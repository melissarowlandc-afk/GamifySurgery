import {
  FIRST_TUTORIAL_CASE_ID,
  SECOND_TUTORIAL_CASE_ID,
  type DecisionNode,
  type ResultGate,
  type SyntheticClinicalCase,
} from "@gamify-surgery/clinical-content";
import {
  getServiceIncomeForRoute,
  getRoomUpgradeCleanlinessDecayMultiplier,
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
  EMPLOYEE_DISCUSSION_FIRST_DELAY_MINUTES,
  EMPLOYEE_DISCUSSION_INTERVAL_MINUTES,
  employeeDiscussionCaseIsRuntimeSafe,
  getEmployeeDiscussions,
  isEmployeeDiscussionCase,
} from "./employee-discussions";
import { materializePatientName } from "./patientText";
import { getEmployeeRoleTrainingPercent, getEmployeeTrainingMoney } from "./employee-training-effects";
import { bindRoomUpgradeRevenueQuote, cloneRoomUpgradeRevenueQuote, createRoomUpgradeRevenueQuote, getRoomUpgradeQuotedFee } from "./room-upgrades";
import { cloneRoomUpgradeRecoveryQuote, completeExaminationRoomExperience, completeWaitingRoomExperience, createRoomUpgradeRecoveryQuote, getPhysicallyAttendedCareRoom, observeWaitingRoomExperience } from "./room-upgrade-experience";
import { createEmployeeRoomUpgradeSupportWork, getBestOperationalCoffeeUpgradeMorale } from "./room-upgrade-support";
import {
  findCareAwareFacilityPath,
  isProtectedCareRoom,
  pathEntersUnauthorizedProtectedRoom,
  protectedCareRoomAtPoint,
} from "./care-room-access";
import { getFrozenPatientTravelLocation } from "./patient-travel";
import { completePatientDemographics } from "./patientDemographics";
import {
  canAdmitPatient,
  getEligibleServiceRoute,
  getEncounterPatientLocation,
  getServiceOrderRouteSelection,
  getEmergencyGlp1Status,
  getOperationalGlp1AutomationAssignments,
  isEmployeeAssignedToOperationalRoom,
  isEmployeeOperational,
  isRoomOperationalForFacilityWork,
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
  getPatientAppearanceSelectionContext,
  getPresentPatientDisplayNames,
  createPatientPixelAppearance,
  createPixelAppearance,
  createStaffDisplayName,
  normalizePixelAppearance,
  roleStyleForStaffDefinition,
  selectStaffStillId,
} from "./appearance";
import {
  advanceAmbientPedestrians,
  getNextAmbientPedestrianTick,
} from "./ambient-pedestrians";
import {
  findDeterministicFacilityPath,
  getRoomNavigableTiles,
  getRoomNavigationAnchor,
  getRoomCareAnchor,
  getRoomWaitingAnchors,
  getRoomStandingWaitingAnchors,
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
  findRouteFromDisplacedLocationOffscreen,
  findRouteFromDisplacedLocationToPublicEntrance,
  findRouteFromDisplacedLocationToPoint,
  findRouteFromDisplacedLocationToRoom,
} from "./displaced-routing";
import {
  evaluateFacilityExperienceConditions,
  synchronizeFacilityConditionOccurrences,
} from "./facility-experience";
import { synchronizeFacilityOperationalAlertOccurrences } from "./facility-alert-conditions";
import { operatingDayMinutes } from "./alert-cadence";
import { advanceGuidanceTips, createGuidanceTipsState } from "./guidance-tips";
import { advanceLevelThreeSupport } from "./level-three-support";
import { advanceEmployeeTraining, cancelEmployeeTrainingForDismissal, isEmployeeAwayForTraining, requestEmployeeTraining } from "./employee-training";
import {
  employeeDepartureRiskCadenceGroup,
  employeeDepartureRiskWarningIsDue,
  patientDepartureRiskIsActive,
} from "./departure-risk-alerts";
import {
  advanceEmployeeMovement,
  getEmployeeArrival,
  getEffectiveEmployeeMorale,
} from "./staff";
import {
  getRoomSalePreview,
  getRoomStaffCapacity,
  reconcileEmployeeRoomSeats,
} from "./room-capacity";
import {
  advanceServiceOperations,
  cancelServiceOperationsById,
  encounterHasActiveServiceOperation,
  getNewPeriopServiceOperationPhases,
  startEncounterProcedureOperation,
  startEncounterTestOperation,
  startServiceOperation,
  interruptServiceOperationsForEmployeeDismissal,
  interruptServiceOperationsForRoomSale,
} from "./service-operations";
import { getExactTestChoiceOrderRecord } from "./test-choice-orders";
import { getDiagnosticChoicePlanning } from "./diagnostic-order-requests";
import { advanceDiagnosticOrders, createDiagnosticPendingResult, encounterHasActiveDiagnosticWalk, encounterHasDiagnosticCareWork } from "./diagnostic-orders";
import {
  advancePatientAmenityTrips,
  getPatientAmenityTrip,
  getReachablePatientBathroomRoomIds,
  hasActivePatientAmenityTrip,
  redirectPatientAmenityReturn,
  requestPatientAmenityReturn,
  tryStartPatientBathroomTrip,
} from "./patient-amenities";
import {
  findFounderSeat,
  isFounderChairTileOccupied,
  isFounderSeatOccupied,
  listFounderSeats,
} from "./founder-seats";
import {
  activeRetailOperationForActor,
  advanceRetailOperations,
  authorizeRetailOrder,
  cancelRetailTripsForActor,
  cancelRetailOperationsForRoom,
  startRetailPurchase,
  getViableDepartureRetailLineIds,
  redirectRetailReturn,
} from "./retail-operations";
import {
  getRetiredEndedSatisfactionSamples,
  retireDepartedEncounters,
} from "./retired-encounters";
import {
  retireFinishedRetailHistory,
  retireFinishedServiceHistory,
} from "./retired-service-history";
import { captureClinicDaySummary } from "./clinic-day-summary";
import { getWaterCoolerApproachLocation } from "./facility-automation";
import type {
  AnswerRecord,
  DoorState,
  DomainContext,
  DomainEvent,
  EmployeeState,
  EmployeeDiscussionState,
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

function advanceDepartingEmployees(state: GameState, context: DomainContext): void {
  const departures = state.departingEmployees ?? [];
  for (const employee of departures) {
    const alreadyOffMap = employee.location.x < 0 ||
      employee.location.x >= context.balanceRelease.facility.gridWidth;
    if (!alreadyOffMap && employee.path.length <= 1) {
      const replanned = findRouteFromDisplacedLocationOffscreen(state, context, employee.location);
      if (replanned.length > 0) {
        employee.path = replanned;
        employee.pathIndex = 0;
        employee.lastMovedAtFacilityTick = state.facilityTick;
      }
    }
    if (employee.pathIndex < employee.path.length - 1) {
      const elapsed = Math.max(1, state.facilityTick - employee.lastMovedAtFacilityTick);
      employee.pathIndex = Math.min(
        employee.path.length - 1,
        employee.pathIndex + elapsed * context.balanceRelease.facility.characterTravelTilesPerTick,
      );
      employee.location = { ...employee.path[employee.pathIndex]! };
      employee.lastMovedAtFacilityTick = state.facilityTick;
    }
  }
  state.departingEmployees = departures.filter((employee) => {
    const finishedPath = employee.pathIndex >= employee.path.length - 1;
    const offMap = employee.location.x < 0 ||
      employee.location.x >= context.balanceRelease.facility.gridWidth;
    return !(finishedPath && offMap);
  });
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

function samePoint(left: GridPoint, right: GridPoint): boolean {
  return left.x === right.x && left.y === right.y;
}

function isFrontDeskStaffed(state: GameState, context: DomainContext): boolean {
  const entrance = getPublicEntrance(state, context);
  if (!entrance) {
    return false;
  }
  const definition = getRoomDefinition(entrance.room.roomDefinitionId, context);
  if (!definition) {
    return false;
  }
  const staffAnchor = getRoomNavigationAnchor(
    entrance.room,
    definition,
    "staff",
  );
  const founderIsAvailable =
    state.environment.founderActivity === null &&
    samePoint(state.environment.founderLocation, staffAnchor);
  const receptionistIsAvailable = state.employees.some(
    (employee) =>
      employee.staffRoleDefinitionId === "staff.receptionist" &&
      isEmployeeAssignedToOperationalRoom(state, employee.id, context) &&
      employee.facilityTask === null &&
      employee.pathIndex >= employee.path.length - 1 &&
      samePoint(employee.location, staffAnchor),
  );
  return founderIsAvailable || receptionistIsAvailable;
}

function hasOperationalReceptionist(
  state: GameState,
  context: DomainContext,
): boolean {
  return state.employees.some(
    (employee) =>
      employee.staffRoleDefinitionId === "staff.receptionist" &&
      isEmployeeAssignedToOperationalRoom(state, employee.id, context),
  );
}

function hasHiredReceptionist(state: GameState): boolean {
  return state.employees.some(
    (employee) => employee.staffRoleDefinitionId === "staff.receptionist",
  );
}

function pointKey(point: GridPoint): string {
  return `${point.x},${point.y}`;
}

/**
 * Automatic founder idling never claims a clinical room or a staff post.  The
 * same persisted endpoint convention used by patient waiting reservations is
 * used here so a save cannot restore the founder onto an occupied tile.
 */
function chooseAutomaticFounderActivity(
  state: GameState,
  context: DomainContext,
): NonNullable<GameState["environment"]["founderActivity"]> | null {
  if (activeRetailOperationForActor(state, "founder", "founder")) return null;
  const occupied = new Set<string>();
  for (const encounter of Object.values(state.encounters)) {
    if (encounter.lifecycle === "resolved") continue;
    for (const point of [
      encounter.patientLocation,
      encounter.patientMovement?.path.at(-1),
      encounter.waitingDestination?.location,
    ]) {
      if (point) occupied.add(pointKey(point));
    }
  }

  for (const employee of state.employees) {
    occupied.add(pointKey(employee.location));
    const endpoint = employee.path.at(-1);
    if (endpoint) occupied.add(pointKey(endpoint));
  }

  const examinationReservations = new Set(
    Object.values(state.encounters).flatMap((encounter) => [
      encounter.assignedRoomInstanceId,
      encounter.queuedCareRoomInstanceId,
      encounter.patientMovement?.destinationRoomInstanceId ?? null,
    ]).flatMap((roomId) => {
      const room = roomId
        ? state.rooms.find((candidate) => candidate.id === roomId)
        : null;
      return room?.roomDefinitionId === "room.examination" && roomId
        ? [roomId]
        : [];
    }),
  );
  // Endpoints are collected first and only the chosen one is routed: idle
  // choices now chain every few minutes, and routing to every candidate
  // stalled a facility tick (owner stutter report, 2026-10-07).
  const candidates: Array<{
    kind: "wander_facility" | "sit_in_chair" | "visit_bathroom";
    targetId: string;
    point: GridPoint;
  }> = [];
  for (const room of [...state.rooms].sort((left, right) => left.id.localeCompare(right.id))) {
    if (examinationReservations.has(room.id)) continue;
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition) continue;
    const doorTiles = new Set(
      state.doors
        .filter((door) => door.roomId === room.id)
        .flatMap((door) => {
          const cells = getDoorCells(door, room, definition);
          return cells ? [pointKey(cells.inside)] : [];
        }),
    );
    const excludedEndpoints = new Set(doorTiles);
    if (definition.navigation?.staffAnchor) {
      excludedEndpoints.add(
        pointKey(getRoomNavigationAnchor(room, definition, "staff")),
      );
    }
    const addCandidate = (
      kind: "wander_facility" | "sit_in_chair" | "visit_bathroom",
      point: GridPoint,
    ) => {
      if (
        occupied.has(pointKey(point)) ||
        excludedEndpoints.has(pointKey(point))
      ) return;
      candidates.push({
        kind,
        targetId: `${room.id}.${point.x}.${point.y}`,
        point,
      });
    };

    // The authored waiting anchors are chair inventory, not merely visual
    // decoration.  A founder may choose any unoccupied chair once a
    // receptionist is covering the desk.
    const standingAnchors = getRoomStandingWaitingAnchors(room, definition).map(pointKey);
    for (const chair of getRoomWaitingAnchors(room, definition)) {
      if (!standingAnchors.includes(pointKey(chair))) addCandidate("sit_in_chair", chair);
    }
    if (room.roomDefinitionId === "room.bathroom") {
      if (!state.patientAmenityTrips?.some((trip) => trip.bathroomRoomInstanceId === room.id)) {
        addCandidate(
          "visit_bathroom",
          getRoomNavigationAnchor(room, definition),
        );
      }
    }
    if (definition.navigation?.publicWaitingArea === true) {
      const excluded = new Set([
        ...excludedEndpoints,
        ...getRoomWaitingAnchors(room, definition).map(pointKey),
      ]);
      for (const point of getRoomNavigableTiles(room, definition, state.doors)
        .sort((left, right) => left.y - right.y || left.x - right.x)) {
        if (!excluded.has(pointKey(point))) addCandidate("wander_facility", point);
      }
    }
  }
  if (candidates.length === 0) return null;
  const first = deterministicInteger(
    state.campaignSeed,
    RANDOM_STREAMS.environment,
    `founder:auto-idle:${state.facilityTick}`,
    candidates.length,
  );
  let chosen: { kind: (typeof candidates)[number]["kind"]; targetId: string; path: GridPoint[] } | null = null;
  for (let attempt = 0; attempt < Math.min(candidates.length, PUBLIC_WANDER_ROUTE_ATTEMPTS) && !chosen; attempt += 1) {
    const candidate = candidates[(first + attempt) % candidates.length]!;
    const routedPath = pathFromLocationToFacilityPoint(
      state,
      context,
      state.environment.founderLocation,
      candidate.point,
    );
    const path =
      routedPath.length > 0
        ? routedPath
        : samePoint(state.environment.founderLocation, candidate.point)
          ? [{ ...candidate.point }]
          : [];
    if (path.length > 0) chosen = { kind: candidate.kind, targetId: candidate.targetId, path };
  }
  if (!chosen) return null;
  const config = context.balanceRelease.environment;
  return {
    ...chosen,
    pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick,
    // Owner rule (2026-10-07): nobody stands idle in a hallway for more than
    // a few game minutes, so a wander stop is short and chains onward.
    workMinutesRemaining: chosen.kind === "wander_facility"
      ? publicWanderDwellMinutes(state, "founder:auto-idle-dwell")
      : config.idleActionMinimumMinutes +
      deterministicInteger(
        state.campaignSeed,
        RANDOM_STREAMS.environment,
        `founder:auto-idle-dwell:${state.facilityTick}`,
        config.idleActionMaximumMinutes - config.idleActionMinimumMinutes + 1,
      ),
  };
}

function planFounderAfterEncounter(
  state: GameState,
  context: DomainContext,
): void {
  if (state.environment.founderActivity?.explicitSeat) return;
  const entrance = getPublicEntrance(state, context);
  if (!entrance) {
    state.environment.founderActivity = null;
    return;
  }
  const definition = getRoomDefinition(entrance.room.roomDefinitionId, context);
  if (!definition) {
    state.environment.founderActivity = null;
    return;
  }
  if (!hasHiredReceptionist(state)) {
    const desk = getRoomNavigationAnchor(entrance.room, definition, "staff");
    const deskOccupied =
      state.employees.some((employee) =>
        samePoint(employee.location, desk) ||
        samePoint(employee.path.at(-1) ?? employee.location, desk),
      ) ||
      Object.values(state.encounters).some(
        (encounter) =>
          encounter.resolutionReason === null &&
          (samePoint(encounter.patientLocation ?? { x: -1, y: -1 }, desk) ||
            samePoint(
              encounter.patientMovement?.path.at(-1) ?? { x: -1, y: -1 },
              desk,
            ) ||
            samePoint(
              encounter.waitingDestination?.location ?? { x: -1, y: -1 },
              desk,
            )),
      );
    if (deskOccupied) {
      state.environment.founderActivity = null;
      return;
    }
    const path = pathFromLocationToFacilityPoint(
      state,
      context,
      state.environment.founderLocation,
      desk,
    );
    if (samePoint(state.environment.founderLocation, desk)) {
      state.environment.founderLocation = { ...desk };
      state.environment.founderActivity = null;
      return;
    }
    if (path.length === 0) {
      state.environment.founderActivity = null;
      return;
    }
    state.environment.founderActivity = {
      kind: "return_to_front_desk",
      targetId: entrance.room.id,
      path,
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      // This is only a travel plan.  Settling at the desk must make the
      // founder immediately eligible to check patients in.
      workMinutesRemaining: 0,
    };
    return;
  }
  state.environment.founderActivity =
    chooseAutomaticFounderActivity(state, context);
}

function suspendFounderActivityForConsult(state: GameState): void {
  const activity = state.environment.founderActivity;
  state.environment.suspendedFounderActivity =
    activity &&
    (activity.kind === "walk_to_point" ||
      (activity.kind === "sit_in_chair" && activity.explicitSeat === true))
      ? clonePlain(activity)
      : null;
}

function resumeFounderActivityAfterConsult(
  state: GameState,
  context: DomainContext,
): void {
  const suspended = state.environment.suspendedFounderActivity;
  state.environment.suspendedFounderActivity = null;
  if (!suspended) {
    planFounderAfterEncounter(state, context);
    return;
  }
  const endpoint = suspended.path.at(-1);
  if (!endpoint ||
      (suspended.kind === "sit_in_chair" &&
        !founderSeatIsFreeForResume(state, context, suspended))) {
    planFounderAfterEncounter(state, context);
    return;
  }
  const path = pathFromLocationToFacilityPoint(
    state,
    context,
    state.environment.founderLocation,
    endpoint,
    new Set(),
  );
  if (path.length === 0) {
    planFounderAfterEncounter(state, context);
    return;
  }
  state.environment.founderActivity = {
    ...suspended,
    path,
    pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick,
  };
}

function facilityPath(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
  goal: GridPoint,
  allowedProtectedRoomInstanceIds: ReadonlySet<string> | null = null,
): GridPoint[] {
  return allowedProtectedRoomInstanceIds === null
    ? findDeterministicFacilityPath(
        start, goal, state.rooms, state.doors,
        (definitionId) => getRoomDefinition(definitionId, context),
      )
    : findCareAwareFacilityPath(
        state, context, start, goal, allowedProtectedRoomInstanceIds,
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
  allowedProtectedRoomInstanceIds: ReadonlySet<string> | null = null,
): GridPoint[] {
  const destination = getRoomDestinationById(state, context, roomId);
  if (!destination) {
    return [];
  }
  if (start.y >= context.balanceRelease.facility.gridHeight) {
    return pathFromOutsideToRoom(state, context, start, roomId);
  }
  const ordinary = facilityPath(state, context, start, destination, allowedProtectedRoomInstanceIds);
  return ordinary.length > 0
    ? ordinary
    : findRouteFromDisplacedLocationToPoint(
        state, context, start, destination,
        allowedProtectedRoomInstanceIds ?? undefined,
      );
}

function pathFromLocationToFacilityPoint(
  state: GameState,
  context: DomainContext,
  start: GridPoint,
  destination: GridPoint,
  allowedProtectedRoomInstanceIds: ReadonlySet<string> | null = null,
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
      facilityPath(state, context, entrance.inside, destination, allowedProtectedRoomInstanceIds),
    );
  }
  return facilityPath(state, context, start, destination, allowedProtectedRoomInstanceIds);
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
  const internal = facilityPath(state, context, start, entrance.inside, new Set());
  return internal.length > 0
    ? joinPaths(internal, [entrance.outside])
    : findRouteFromDisplacedLocationToPublicEntrance(state, context, start);
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
  const toExit = pathFromLocationToExit(state, context, start);
  if (toExit.length === 0) return [];
  const sidewalkStart = toExit.at(-1) ?? entrance.outside;
  return joinPaths(toExit, straightSidewalkPath(sidewalkStart, endpoint));
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

/**
 * Editorial cadence (owner rule, 2026-10-07): an overflow patient or an idle
 * founder never stands in a public hallway for more than a few game minutes.
 * This is a simulation pacing value, not a clinical timeline.
 */
const PUBLIC_WANDER_DWELL_MINUTES = { minimum: 2, maximum: 4 } as const;
/** Hallway overflow drifts locally rather than pacing the whole building. */
const PUBLIC_WANDER_RADIUS_TILES = 8;
const PUBLIC_WANDER_ROUTE_ATTEMPTS = 6;

function publicWanderDwellMinutes(state: GameState, stableId: string): number {
  return PUBLIC_WANDER_DWELL_MINUTES.minimum + deterministicInteger(
    state.campaignSeed,
    RANDOM_STREAMS.environment,
    `${stableId}:public-wander-dwell:${state.facilityTick}`,
    PUBLIC_WANDER_DWELL_MINUTES.maximum - PUBLIC_WANDER_DWELL_MINUTES.minimum + 1,
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
  founderStart: GridPoint,
  encounterId: string,
): { roomId: string; patientPath: GridPoint[]; founderPath: GridPoint[] } | null {
  const occupiedRoomIds = new Set(
    Object.values(state.encounters)
      .flatMap((encounter) => {
        if (encounter.id === encounterId) return [];
        const visibleLocation = getEncounterPatientLocation(state, encounter.id);
        if (!visibleLocation) return [];
        const visibleRoom = protectedCareRoomAtPoint(state, context, visibleLocation);
        return [
          ...(visibleRoom ? [visibleRoom.id] : []),
          ...(encounter.assignedRoomInstanceId && encounter.lifecycle !== "resolved"
            ? [encounter.assignedRoomInstanceId]
            : []),
          ...(encounter.queuedCareRoomInstanceId
            ? [encounter.queuedCareRoomInstanceId]
            : []),
          ...(encounter.patientMovement?.destinationRoomInstanceId
            ? [encounter.patientMovement.destinationRoomInstanceId]
            : []),
        ];
      }),
  );
  const candidates = state.rooms
    .filter(
      (room) =>
        room.roomDefinitionId === "room.examination" &&
        !occupiedRoomIds.has(room.id),
    )
    .sort((left, right) => left.id.localeCompare(right.id))
    .flatMap((room) => {
      const definition = getRoomDefinition(room.roomDefinitionId, context);
      if (!definition) return [];
      const patientPath = pathFromLocationToFacilityPoint(
        state, context, start, getRoomCareAnchor(room, definition, "patient"), new Set([room.id]),
      );
      const founderPath = pathFromLocationToFacilityPoint(
        state, context, founderStart, getRoomCareAnchor(room, definition, "clinician"), new Set([room.id]),
      );
      return patientPath.length > 0 && founderPath.length > 0
        ? [{ roomId: room.id, patientPath, founderPath }]
        : [];
    })
    .sort(
      (left, right) =>
        left.patientPath.length - right.patientPath.length ||
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

function getEncounterExaminationRoomId(
  state: GameState,
  encounter: EncounterState,
): string | null {
  return [
    encounter.assignedRoomInstanceId,
    encounter.queuedCareRoomInstanceId,
    encounter.patientMovement?.destinationRoomInstanceId ?? null,
  ].find(
    (roomId): roomId is string =>
      roomId !== null &&
      state.rooms.find((room) => room.id === roomId)?.roomDefinitionId ===
        "room.examination",
  ) ?? null;
}

/** Tiles a waiting patient may not claim: other patients, the founder and staff. */
function waitingOccupiedPointKeys(
  state: GameState,
  excludedEncounterId: string | null,
): Set<string> {
  const occupiedPoints = new Set(
    Object.values(state.encounters)
      .filter(
        (candidate) =>
          candidate.id !== excludedEncounterId &&
          (candidate.lifecycle !== "resolved" ||
            encounterHasActiveServiceOperation(state, candidate.id)),
      )
      .flatMap((candidate) => [
        ...(candidate.patientLocation
          ? [candidate.patientLocation]
          : []),
        ...(candidate.patientMovement?.path.at(-1)
          ? [candidate.patientMovement.path.at(-1)!]
          : []),
        ...(candidate.waitingDestination
          ? [candidate.waitingDestination.location]
          : []),
      ])
      .map((point) => `${point.x},${point.y}`),
  );
  const reservedActors = [
    state.environment.founderLocation,
    ...(state.environment.founderActivity?.path.at(-1)
      ? [state.environment.founderActivity.path.at(-1)!]
      : []),
    ...state.employees.flatMap((employee) => [
      employee.location,
      ...(employee.path.at(-1) ? [employee.path.at(-1)!] : []),
    ]),
  ];
  for (const point of reservedActors) occupiedPoints.add(`${point.x},${point.y}`);
  return occupiedPoints;
}

/**
 * Cheap pre-check for re-seating: mirrors the chair tiers of
 * chooseWaitingDestination (Waiting Room chairs, Front Desk chairs, other
 * non-care chairs) without routing.
 */
function hasFreeWaitingChair(state: GameState, context: DomainContext): boolean {
  const occupied = waitingOccupiedPointKeys(state, null);
  const entrance = getPublicEntrance(state, context);
  return state.rooms.some((room) => {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition) return false;
    if (room.roomDefinitionId === "room.waiting") {
      const doorKeys = new Set(state.doors.filter((door) => door.roomId === room.id).flatMap((door) => {
        const cells = getDoorCells(door, room, definition);
        return cells ? [pointKey(cells.inside)] : [];
      }));
      return getRoomWaitingAnchors(room, definition).some((anchor) =>
        !doorKeys.has(pointKey(anchor)) && !occupied.has(pointKey(anchor)));
    }
    if (room.id === entrance?.room.id) {
      const standing = new Set(getRoomStandingWaitingAnchors(room, definition).map(pointKey));
      return getRoomWaitingAnchors(room, definition).some((anchor) =>
        !standing.has(pointKey(anchor)) && !occupied.has(pointKey(anchor)));
    }
    return !isProtectedCareRoom(room) &&
      getRoomWaitingAnchors(room, definition).some((anchor) => !occupied.has(pointKey(anchor)));
  });
}

function chooseWaitingDestination(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
): {
  roomId: string | null;
  path: GridPoint[];
  reservation: EncounterState["waitingDestination"];
} {
  const start = encounter.patientLocation;
  const entrance = getPublicEntrance(state, context);
  if (!start || !entrance) {
    return { roomId: null, path: [], reservation: null };
  }

  const occupiedPoints = waitingOccupiedPointKeys(state, encounter.id);

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
        new Set(),
      );
      if (path.length > 0) {
        return {
          roomId: waitingRoom.id,
          path,
          reservation: { roomInstanceId: waitingRoom.id, location: anchor, kind: "chair" },
        };
      }
    }
  }

  const frontDefinition = getRoomDefinition(entrance.room.roomDefinitionId, context);
  if (frontDefinition) {
    const standingKeys = new Set(
      getRoomStandingWaitingAnchors(entrance.room, frontDefinition).map(pointKey),
    );
    for (const anchor of getRoomWaitingAnchors(entrance.room, frontDefinition)) {
      if (occupiedPoints.has(`${anchor.x},${anchor.y}`)) {
        continue;
      }
      const path = pathFromLocationToFacilityPoint(
        state,
        context,
        start,
        anchor,
        new Set(),
      );
      if (path.length > 0) {
        return {
          roomId: entrance.room.id,
          path,
          reservation: {
            roomInstanceId: entrance.room.id,
            location: anchor,
            kind: standingKeys.has(pointKey(anchor)) ? "standing" : "chair",
          },
        };
      }
    }
  }

  const doorKeysFor = (room: PlacedRoom, definition: NonNullable<ReturnType<typeof getRoomDefinition>>) =>
    new Set(state.doors.filter((door) => door.roomId === room.id).flatMap((door) => {
      const cells = getDoorCells(door, room, definition);
      return cells ? [`${cells.inside.x},${cells.inside.y}`] : [];
    }));
  const findStanding = (
    rooms: readonly PlacedRoom[],
    kind: "standing" | "public_wander",
  ) => {
    for (const room of rooms) {
      const definition = getRoomDefinition(room.roomDefinitionId, context);
      if (!definition) continue;
      const doorKeys = doorKeysFor(room, definition);
      const excluded = new Set([
        ...doorKeys,
        ...getRoomWaitingAnchors(room, definition).map((point) => `${point.x},${point.y}`),
      ]);
      // A configured staff post is not a patient waiting point.  Do not use
      // the generic navigation-anchor fallback here: a 1x1 hallway's primary
      // tile is its only legitimate public standing point.
      if (definition.navigation?.staffAnchor) {
        const staffAnchor = getRoomNavigationAnchor(room, definition, "staff");
        excluded.add(`${staffAnchor.x},${staffAnchor.y}`);
      }
      for (const point of getRoomNavigableTiles(room, definition, state.doors).sort((a, b) => a.y - b.y || a.x - b.x)) {
        const key = `${point.x},${point.y}`;
        if (occupiedPoints.has(key) || excluded.has(key)) continue;
        const path = pathFromLocationToFacilityPoint(state, context, start, point, new Set());
        if (path.length > 0) return { roomId: room.id, path, reservation: { roomInstanceId: room.id, location: point, kind } };
      }
    }
    return null;
  };
  const otherChairRooms = state.rooms
    .filter((room) =>
      room.roomDefinitionId !== "room.waiting" &&
      room.id !== entrance.room.id &&
      !isProtectedCareRoom(room),
    )
    .sort((a, b) => a.id.localeCompare(b.id));
  for (const room of otherChairRooms) {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition) continue;
    for (const anchor of getRoomWaitingAnchors(room, definition)) {
      if (occupiedPoints.has(`${anchor.x},${anchor.y}`)) continue;
      const path = pathFromLocationToFacilityPoint(state, context, start, anchor, new Set());
      if (path.length > 0) return { roomId: room.id, path, reservation: { roomInstanceId: room.id, location: anchor, kind: "chair" } };
    }
  }
  const waitingStanding = findStanding(waitingRooms.map(({ room }) => room), "standing");
  if (waitingStanding) return waitingStanding;
  const publicStanding = findStanding(
    state.rooms.filter((room) => room.roomDefinitionId !== "room.waiting" && getRoomDefinition(room.roomDefinitionId, context)?.navigation?.publicWaitingArea === true).sort((a, b) => a.id.localeCompare(b.id)),
    "public_wander",
  );
  if (publicStanding) return publicStanding;
  const fallbackPath = pathFromLocationToFacilityPoint(state, context, start, entrance.inside, new Set());
  return {
    roomId: entrance.room.id,
    path: fallbackPath,
    reservation: { roomInstanceId: entrance.room.id, location: entrance.inside, kind: "public_wander" },
  };
}

/** Narrow deterministic seam for routing acceptance coverage. */
export function selectWaitingDestinationForTesting(
  state: GameState,
  context: DomainContext,
  encounterId: string,
) {
  const encounter = state.encounters[encounterId];
  return encounter ? chooseWaitingDestination(state, context, encounter) : null;
}

function choosePublicWanderDestination(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
): {
  roomId: string;
  path: GridPoint[];
  reservation: NonNullable<EncounterState["waitingDestination"]>;
} | null {
  const start = encounter.patientLocation;
  if (!start) return null;
  const occupied = new Set(
    Object.values(state.encounters)
      .filter((candidate) => candidate.id !== encounter.id && candidate.lifecycle !== "resolved")
      .flatMap((candidate) => [
        ...(candidate.patientLocation ? [candidate.patientLocation] : []),
        ...(candidate.patientMovement?.path.at(-1) ? [candidate.patientMovement.path.at(-1)!] : []),
        ...(candidate.waitingDestination ? [candidate.waitingDestination.location] : []),
      ])
      .map((point) => `${point.x},${point.y}`),
  );
  for (const point of [
    state.environment.founderLocation,
    ...(state.environment.founderActivity?.path.at(-1) ? [state.environment.founderActivity.path.at(-1)!] : []),
    ...state.employees.flatMap((employee) => [employee.location, ...(employee.path.at(-1) ? [employee.path.at(-1)!] : [])]),
  ]) occupied.add(`${point.x},${point.y}`);

  const candidates: { roomId: string; point: GridPoint }[] = [];
  for (const room of state.rooms
    .filter((candidate) =>
      candidate.roomDefinitionId !== "room.waiting" &&
      getRoomDefinition(candidate.roomDefinitionId, context)?.navigation?.publicWaitingArea === true,
    )
    .sort((left, right) => left.id.localeCompare(right.id))) {
    const definition = getRoomDefinition(room.roomDefinitionId, context);
    if (!definition) continue;
    const excluded = new Set([
      ...state.doors.filter((door) => door.roomId === room.id).flatMap((door) => {
        const cells = getDoorCells(door, room, definition);
        return cells ? [`${cells.inside.x},${cells.inside.y}`] : [];
      }),
      ...getRoomWaitingAnchors(room, definition).map((point) => `${point.x},${point.y}`),
    ]);
    if (definition.navigation?.staffAnchor) {
      const anchor = getRoomNavigationAnchor(room, definition, "staff");
      excluded.add(`${anchor.x},${anchor.y}`);
    }
    for (const point of getRoomNavigableTiles(room, definition, state.doors)
      .sort((left, right) => left.y - right.y || left.x - right.x)) {
      const key = `${point.x},${point.y}`;
      if (occupied.has(key) || excluded.has(key) || (point.x === start.x && point.y === start.y)) continue;
      candidates.push({ roomId: room.id, point });
    }
  }
  if (candidates.length === 0) return null;
  // Overflow patients now move every few minutes, so pick a nearby spot first
  // and route only to it (routing to every public tile each time stalled ticks).
  const nearby = candidates.filter(({ point }) =>
    Math.abs(point.x - start.x) + Math.abs(point.y - start.y) <= PUBLIC_WANDER_RADIUS_TILES);
  const pool = nearby.length > 0 ? nearby : candidates;
  const first = deterministicInteger(
    state.campaignSeed,
    RANDOM_STREAMS.environment,
    `${encounter.id}:public-wander:${state.facilityTick}`,
    pool.length,
  );
  for (let attempt = 0; attempt < Math.min(pool.length, PUBLIC_WANDER_ROUTE_ATTEMPTS); attempt += 1) {
    const choice = pool[(first + attempt) % pool.length]!;
    const path = pathFromLocationToFacilityPoint(state, context, start, choice.point, new Set());
    if (path.length > 1) {
      return {
        roomId: choice.roomId,
        path,
        reservation: { roomInstanceId: choice.roomId, location: { ...choice.point }, kind: "public_wander" },
      };
    }
  }
  return null;
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

  if (state.serviceOperations.some(
    (operation) =>
      operation.status !== "completed" &&
      operation.status !== "cancelled" &&
      (operation.reservedRoomInstanceIds.includes(room.id) ||
        operation.transitionHeldRoomInstanceIds?.includes(room.id) ||
        operation.periopBedReservation?.roomInstanceId === room.id ||
        (operation.location && pointInsideRoom(operation.location, room, context)) ||
        routeTouchesRoom(operation.path.slice(operation.pathIndex))),
  )) return true;

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
  let frozenCase = clonePlain(input.clinicalCase);
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
  frozenCase.prototypeDemographics = completePatientDemographics({
    caseId: frozenCase.id,
    campaignSeed: state.campaignSeed,
    encounterId: input.encounterId,
    demographics: frozenCase.prototypeDemographics,
  });
  const patientDemographics = frozenCase.prototypeDemographics;
  const patientSexLabel = patientDemographics?.sexLabel;
  const patientDisplayName =
    input.patientDisplayName ??
    createPatientDisplayName(
      state.campaignSeed,
      input.encounterId,
      patientSexLabel,
      getPresentPatientDisplayNames(state),
    );
  frozenCase = materializePatientName(frozenCase, patientDisplayName);
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
      {
        sexLabel: patientSexLabel,
        ageYears: patientDemographics?.ageYears,
      },
      "patient",
      getPatientAppearanceSelectionContext(state),
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
    departureRiskWarningAtTick: null,
    satisfactionWarningsShown: [],
    dissatisfactionByCause: {},
    facilityExperienceAtCheckIn: null,
    checkInStatus: "approaching",
    checkInWaitingSinceTick: null,
    unstaffedCheckInOverdueApplied: false,
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
    waitingDestination: null,
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

function completeStaffedCheckIn(
  state: GameState,
  encounter: EncounterState,
  context: DomainContext,
): void {
  if (encounter.checkInStatus !== "awaiting_staff") {
    return;
  }
  encounter.checkInStatus = "checked_in";
  encounter.checkInWaitingSinceTick = null;
  // Check-in makes the chart available immediately, but ordinary walking to a
  // waiting place is not idle waiting and must not consume patience.
  applyFacilityExperienceAtCheckIn(state, encounter, context);
  encounter.idleWaitingSinceTick = null;
  encounter.lastSatisfactionDecayAtTick = state.facilityTick;
  beginPatientFeedAttention(encounter, "checked_in", state.facilityTick);
  const destination = chooseWaitingDestination(state, context, encounter);
  encounter.waitingDestination = destination.reservation;
  startPatientMovement(
    state,
    context,
    encounter,
    "walking_to_waiting",
    destination.path,
    destination.roomId,
  );
}

function maybeCompleteAwaitingCheckIns(
  state: GameState,
  context: DomainContext,
): void {
  if (!isFrontDeskStaffed(state, context)) {
    return;
  }
  for (const encounter of Object.values(state.encounters)) {
    if (
      encounter.checkInStatus === "awaiting_staff" &&
      encounter.patientMovement === null
    ) {
      completeStaffedCheckIn(state, encounter, context);
    }
  }
}

function maybeApplyUnstaffedCheckInOverdue(
  state: GameState,
  context: DomainContext,
): void {
  const config = context.balanceRelease.patientSatisfaction;
  for (const encounter of Object.values(state.encounters)) {
    const waitingSince = encounter.checkInWaitingSinceTick;
    if (
      encounter.checkInStatus !== "awaiting_staff" ||
      waitingSince === null ||
      encounter.unstaffedCheckInOverdueApplied ||
      state.facilityTick - waitingSince <= config.unstaffedCheckInDelayMinutes
    ) {
      continue;
    }
    encounter.unstaffedCheckInOverdueApplied = true;
    applyPatientSatisfactionDelta(
      encounter,
      -config.unstaffedCheckInSatisfactionPenalty,
      "no_receptionist",
      state.facilityTick,
    );
  }
}

function maybeEmitPatientDepartureRiskWarning(
  state: GameState,
  encounter: EncounterState,
): void {
  if (
    encounter.departureRiskWarningAtTick != null ||
    !patientDepartureRiskIsActive(state, encounter)
  ) {
    return;
  }
  const definitionId = "alert.patient.departure-risk";
  const rendered = renderPrototypeAlert(definitionId, {
    patient_name: encounter.patientDisplayName,
    patient_id: encounter.id,
  });
  encounter.departureRiskWarningAtTick = state.facilityTick;
  appendEvent(state, {
    id: `event.patient-departure-risk.${encounter.id}`,
    type: "patience_warning",
    facilityTick: state.facilityTick,
    encounterId: encounter.id,
    message: rendered.body,
    priority: "critical",
    definitionId,
    target: { kind: "encounter", id: encounter.id },
  });
}

function maybeEmitEmployeeDepartureRiskWarnings(
  state: GameState,
  context: DomainContext,
): void {
  for (const employee of state.employees) {
    if (!employeeDepartureRiskWarningIsDue(state, employee, context)) {
      continue;
    }
    const definitionId = "alert.staff.departure-risk";
    const rendered = renderPrototypeAlert(definitionId, {
      employee_name: employee.displayName,
      employee_id: employee.id,
      morale: String(employee.morale),
    });
    state.alertHumor.conditionLastEmittedTicks[
      employeeDepartureRiskCadenceGroup(employee.id)
    ] = state.facilityTick;
    appendEvent(state, {
      id: `event.staff-departure-risk.${employee.id}.${state.facilityTick}`,
      type: "staff_departure_risk",
      facilityTick: state.facilityTick,
      encounterId: null,
      message: rendered.body,
      priority: "action_required",
      definitionId,
      target: { kind: "employee", id: employee.id },
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

function maybeEmitAmbientMessage(
  state: GameState,
  context: DomainContext,
): void {
  const humor = state.alertHumor;
  if (
    humor.alertsTutorialAcknowledgedAtTick === null ||
    humor.nextAmbientAlertTick === null ||
    state.facilityTick < humor.nextAmbientAlertTick ||
    !bothTutorialEncountersResolved(state)
  ) {
    return;
  }

  const day = operatingDayMinutes(context);
  const eligible = getEligibleAmbientDefinitions(state).filter((definition) =>
    definition.variants.some((variant) => {
      const lastEmitted =
        humor.conditionLastEmittedTicks[
          `ambient:${definition.id}:${variant.id}`
        ];
      return lastEmitted === undefined || state.facilityTick - lastEmitted >= day;
    }),
  );
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
  const availableVariants = definition.variants.filter((candidate) => {
    const lastEmitted =
      humor.conditionLastEmittedTicks[
        `ambient:${definition.id}:${candidate.id}`
      ];
    return lastEmitted === undefined || state.facilityTick - lastEmitted >= day;
  });
  const variant = pickWeighted(
    availableVariants,
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
  humor.conditionLastEmittedTicks[
    `ambient:${definition.id}:${variant.id}`
  ] = state.facilityTick;
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

function advanceNewDiagnosticOrders(state: GameState, context: DomainContext): void {
  advanceDiagnosticOrders(state, context, {
    walkingPath(encounter, phase) {
      const target = phase.forecast.patientPath.at(-1);
      if (!target) return [];
      if (!encounter.patientLocation) return phase.forecast.patientPath.map((point) => ({ ...point }));
      const targetRoom = state.rooms.find((room) => {
        const definition = getRoomDefinition(room.roomDefinitionId, context);
        return definition && getRoomNavigableTiles(room, definition, state.doors).some((tile) => samePoint(tile, target));
      });
      return pathFromLocationToFacilityPoint(state, context, encounter.patientLocation, target, new Set(targetRoom ? [targetRoom.id] : []));
    },
    startMovement(encounter, kind, path, roomId) { startPatientMovement(state, context, encounter, kind, path, roomId); },
    roomAt(point) {
      return state.rooms.find((room) => {
        const definition = getRoomDefinition(room.roomDefinitionId, context);
        return definition && getRoomNavigableTiles(room, definition, state.doors).some((tile) => samePoint(tile, point));
      })?.id ?? null;
    },
    releaseCare(encounter) { releaseEncounterCareReservation(encounter); encounter.waitingDestination = null; },
    careCompleted(encounter) {
      releaseEncounterCareReservation(encounter);
      encounter.waitingDestination = null;
      if (!encounter.patientLocation || encounter.patientMovement) return;
      if (encounter.lifecycle === "resolved") {
        startPatientMovement(state, context, encounter, "leaving_after_resolution",
          pathFromLocationToOffscreen(state, context, encounter.patientLocation, encounter.id), null);
      } else {
        const destination = chooseWaitingDestination(state, context, encounter);
        encounter.waitingDestination = destination.reservation;
        if (destination.path.length > 1) startPatientMovement(state, context, encounter, "walking_to_waiting", destination.path, destination.roomId);
      }
    },
  });
}

function prepareNewDiagnosticPatient(state: GameState, encounter: EncounterState): void {
  cancelRetailTripsForActor(state, "encounter", encounter.id, "The ordered diagnostic test superseded optional shopping.");
  if (encounter.patientMovement && ["walking_to_care", "walking_to_waiting", "idle_within_room"].includes(encounter.patientMovement.kind)) {
    encounter.patientMovement = null;
  }
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null;
}

function scheduleResult(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
  node: DecisionNode,
  gate: ResultGate,
  allowOnsiteEquivalents = true,
): PendingResult | null {
  const orderSelection = getServiceOrderRouteSelection(
    state,
    gate.resultTypeId,
    gate.allowedServiceRouteIds,
    context,
    encounter.id,
    allowOnsiteEquivalents,
  );
  const shouldQueue = orderSelection.waitingForResources;
  const selected = orderSelection.selection;
  if (!selected) {
    return null;
  }
  const approvedProcedureRouteIds = new Set([
    "route.anoscopy.in_house",
    "route.thyroid_fna.in_house",
    "route.breast_core_needle_biopsy.in_house",
    "route.skin_excisional_biopsy.in_house",
    "route.cutaneous_lesion_biopsy.in_house",
    "route.genetic_testing.phlebotomy_sendout",
    "route.hiv_hcv_serology.phlebotomy_sendout",
    "route.primary_aldosteronism_screen.phlebotomy_sendout",
    "route.carotid_cta.in_house",
    "route.mesenteric_cta.in_house",
    "route.venous_duplex.in_house",
    "route.colonoscopy.in_house",
    "route.upper_endoscopy_duodenal_biopsy.in_house",
    "route.esophageal_multilevel_biopsy.in_house",
    "route.contrast_swallow.in_house",
    "route.resting_abi.in_house",
    "route.h_pylori_urea_breath.in_house",
    "route.nipple_areolar_biopsy.in_house",
  ]);
  const pending: PendingResult = {
    operationId: `result.${encounter.id}.${node.id}.${gate.id}`,
    gateId: gate.id,
    originatingNodeIndex: encounter.currentNodeIndex,
    resultTypeId: gate.resultTypeId,
    // Gates retain their authored clinical wording. When the already-approved
    // equivalent CT is acquired onsite, expose its actual operational state
    // while preserving the external interpretation.
    pendingLabel: shouldQueue
      ? `${selected.route.displayName} waiting for room and staff`
      : selected.route.id === "route.ct.in_house"
      ? "CT scan and interpretation pending"
      : gate.pendingLabel,
    resultNarrative: gate.resultNarrative,
    routeId: selected.route.id,
    routeDisplayName: selected.route.displayName,
    scheduledAtTick: state.facilityTick,
    serviceDurationTicks: selected.timing.serviceDurationTicks,
    durationTicks: shouldQueue ? 0 : selected.timing.durationTicks,
    dueTick: shouldQueue ? state.facilityTick : state.facilityTick + selected.timing.durationTicks,
    deliveredAtTick: null,
    serviceIncomeEligible: getServiceIncomeForRoute(selected.route.id) ? true : undefined,
    serviceIncomeLineId: getServiceIncomeForRoute(selected.route.id)?.id,
    serviceIncomeFee: getServiceIncomeForRoute(selected.route.id)?.fee,
    offsiteReturnStartedAtTick: null,
    offsiteTravel: null,
    patientTravel: shouldQueue ? null : clonePlain(selected.timing.patientTravel),
    patientRemainsOnsite: selected.route.patientRemainsOnsite,
    timingPhases: shouldQueue ? [] : selected.route.timingPhases.map((phase) => ({ ...phase, startsAtTick: state.facilityTick, endsAtTick: state.facilityTick + phase.durationTicks })),
    resourceReservations: shouldQueue ? [] : clonePlain(selected.route.resourceRequirements),
    imagingTechnicianId: shouldQueue ? null : selected.imagingTechnicianId,
    phlebotomistId: shouldQueue ? null : selected.phlebotomistId,
    providerReservation: !shouldQueue && selected.providerReservation
      ? clonePlain(selected.providerReservation)
      : null,
    ...(shouldQueue
      ? {
          resourceQueue: {
            version: "onsite-resource-queue.v1" as const,
            status: "waiting_for_resources" as const,
            serviceId: gate.resultTypeId,
            routeId: selected.route.id,
            allowedRouteIds: gate.allowedServiceRouteIds
              ? [...gate.allowedServiceRouteIds]
              : null,
            queuedAtTick: state.facilityTick,
          },
        }
      : {}),
    ...(selected.route.patientTravel || selected.route.patientRemainsOnsite
      ? {
          onsiteReturn: {
            version: "onsite-front-desk-return.v1" as const,
            status: "awaiting_service_completion" as const,
            serviceCompletedAtTick: null,
            frontDeskArrivalTick: null,
          },
        }
      : {}),
    ...(approvedProcedureRouteIds.has(selected.route.id)
      ? { approvedProcedureTimingVersion: 1 as const }
      : {}),
    ...(selected.phlebotomistId
      ? { phlebotomyArrivalGatedVersion: 1 as const }
      : {}),
  };
  const incomeLine = getServiceIncomeForRoute(selected.route.id);
  if (incomeLine) {
    pending.roomUpgradeRevenue = createRoomUpgradeRevenueQuote(state, incomeLine.fee,
      selected.route.resourceRequirements.map((resource) => resource.roomDefinitionId));
    pending.roomUpgradeRecovery = createRoomUpgradeRecoveryQuote(state,
      getNewPeriopServiceOperationPhases(incomeLine.id) ?? incomeLine.operation?.phases ?? []);
  }
  if (incomeLine && getNewPeriopServiceOperationPhases(incomeLine.id)) {
    const externalPhases = selected.route.timingPhases
      .filter((phase) => !phase.resourceBound)
      .map((phase) => ({
        ...phase,
        startsAtTick: state.facilityTick,
        endsAtTick: state.facilityTick + phase.durationTicks,
      }));
    const externalDurationTicks = externalPhases.reduce(
      (total, phase) => total + phase.durationTicks,
      0,
    );
    pending.serviceDurationTicks = externalDurationTicks;
    pending.durationTicks = 0;
    pending.dueTick = state.facilityTick;
    pending.patientTravel = null;
    pending.offsiteTravel = null;
    pending.timingPhases = externalPhases;
    pending.resourceReservations = [];
    pending.imagingTechnicianId = null;
    pending.phlebotomistId = null;
    pending.providerReservation = null;
    delete pending.resourceQueue;
    delete pending.phlebotomyArrivalGatedVersion;
    pending.onsiteReturn = {
      version: "onsite-front-desk-return.v1",
      status: "awaiting_service_completion",
      serviceCompletedAtTick: null,
      frontDeskArrivalTick: null,
    };
    pending.localServiceOperation = {
      version: "pending-result-service-operation.v1",
      status: "feedback_pending",
      incomeLineId: incomeLine.id,
      serviceOperationId: null,
      externalDurationTicks,
    };
  }
  return pending;
}

function bindPendingResultRoomRevenue(state: GameState, context: DomainContext, encounter: EncounterState, pending: PendingResult): void {
  const quote = pending.roomUpgradeRevenue;
  if (quote?.boundRoom || pending.diagnosticTiming || pending.localServiceOperation || pending.resourceQueue ||
    encounter.lifecycle !== "active_pending_result" || !encounter.patientLocation) return;
  const earningPhase = pending.timingPhases?.find((phase) => phase.resourceBound);
  if (!earningPhase || state.facilityTick < earningPhase.startsAtTick || state.facilityTick > earningPhase.endsAtTick) return;
  // A planned destination or assigned care room is not evidence of local work.
  const roomId = pending.patientTravel?.destinationRoomInstanceId ??
    (pending.patientRemainsOnsite ? state.rooms.find((room) => room.roomDefinitionId === (quote?.roomDefinitionId ?? pending.resourceReservations?.[0]?.roomDefinitionId) &&
      pointInsideRoom(encounter.patientLocation!, room, context))?.id : null);
  const room = state.rooms.find((candidate) => candidate.id === roomId && (!quote || candidate.roomDefinitionId === quote.roomDefinitionId));
  if (!room || !pointInsideRoom(encounter.patientLocation, room, context)) return;
  const employeeIds = [pending.imagingTechnicianId, pending.phlebotomistId,
    pending.providerReservation?.kind === "employee" ? pending.providerReservation.employeeId : null];
  if (employeeIds.some((employeeId) => employeeId && !state.employees.some((employee) =>
    employee.id === employeeId && employee.pathIndex >= employee.path.length - 1 && pointInsideRoom(employee.location, room, context)))) return;
  if (pending.providerReservation?.kind === "founder" &&
    (state.environment.founderActivity?.targetId !== pending.operationId ||
      state.environment.founderActivity.pathIndex < state.environment.founderActivity.path.length - 1 ||
      !pointInsideRoom(state.environment.founderLocation, room, context))) return;
  completeWaitingRoomExperience(encounter, state.facilityTick);
  if (quote) {
    bindRoomUpgradeRevenueQuote(quote, room.id);
    pending.serviceIncomeFee = getRoomUpgradeQuotedFee(quote);
  }
}

function routeImagingTechnicianToScheduledService(
  state: GameState,
  context: DomainContext,
  pending: PendingResult,
): boolean {
  const destinationRoomId = pending.patientTravel?.destinationRoomInstanceId;
  const reservation = pending.resourceReservations?.find(
    (resource) => resource.staffRoleDefinitionId === "staff.imaging_technician",
  );
  const reservedTechnician = pending.imagingTechnicianId
    ? state.employees.find(
        (employee) => employee.id === pending.imagingTechnicianId,
      )
    : null;
  const destination = destinationRoomId
    ? state.rooms.find((room) => room.id === destinationRoomId)
    : null;
  const definition = destination
    ? getRoomDefinition(destination.roomDefinitionId, context)
    : null;
  if (!reservation) {
    return true;
  }
  if (!destination || !definition) {
    return false;
  }
  const destinationAnchor = getRoomNavigationAnchor(destination, definition, "staff");
  if (
    !reservedTechnician ||
    reservedTechnician.staffRoleDefinitionId !== reservation.staffRoleDefinitionId ||
    reservedTechnician.facilityTask
  ) {
    return false;
  }
  const candidate = [reservedTechnician]
    .map((technician) => ({
      technician,
      path: findCareAwareFacilityPath(
        state, context, technician.location, destinationAnchor, new Set([destination.id]),
      ),
    }))
    .find(({ path }) => path.length > 0);
  if (!candidate) {
    return false;
  }
  const { technician, path } = candidate;
  // Supersede idle wandering even when the technician is already standing at
  // the destination anchor; retaining an old path would move them away on the
  // next facility tick while the imaging task is active.
  technician.path = path;
  technician.pathIndex = 0;
  technician.lastMovedAtFacilityTick = state.facilityTick;
  technician.facilityTask = {
    kind: "perform_imaging",
    startedAtFacilityTick: state.facilityTick,
    // This task only suppresses idle wandering. The authoritative resource
    // window remains the frozen pending-result timing phases.
    workMinutesRemaining: 1,
    targetId: pending.operationId,
  };
  return true;
}

function routePhlebotomistToScheduledService(
  state: GameState,
  context: DomainContext,
  pending: PendingResult,
): boolean {
  if (pending.phlebotomyArrivalGatedVersion !== 1) return true;
  const destinationRoomId = pending.patientTravel?.destinationRoomInstanceId;
  const destination = destinationRoomId ? state.rooms.find((room) => room.id === destinationRoomId) : null;
  const definition = destination ? getRoomDefinition(destination.roomDefinitionId, context) : null;
  const employee = pending.phlebotomistId
    ? state.employees.find((candidate) => candidate.id === pending.phlebotomistId)
    : null;
  if (!destination || !definition || destination.roomDefinitionId !== "room.phlebotomy" ||
      !employee || employee.staffRoleDefinitionId !== "staff.phlebotomist" || employee.facilityTask) return false;
  const path = findCareAwareFacilityPath(
    state, context, employee.location,
    getRoomCareAnchor(destination, definition, "clinician"), new Set([destination.id]),
  );
  if (path.length === 0) return false;
  employee.path = path;
  employee.pathIndex = 0;
  employee.lastMovedAtFacilityTick = state.facilityTick;
  employee.facilityTask = {
    kind: "perform_service",
    startedAtFacilityTick: state.facilityTick,
    workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    targetId: pending.operationId,
  };
  return true;
}

function routeProviderToScheduledService(
  state: GameState,
  context: DomainContext,
  pending: PendingResult,
): boolean {
  const reservation = pending.providerReservation;
  if (!reservation) return true;
  const destinationRoomId = pending.patientTravel?.destinationRoomInstanceId;
  const destination = destinationRoomId
    ? state.rooms.find((room) => room.id === destinationRoomId)
    : null;
  const definition = destination
    ? getRoomDefinition(destination.roomDefinitionId, context)
    : null;
  if (!destination || !definition) return false;
  const target = getRoomNavigationAnchor(destination, definition, "staff");
  if (reservation.kind === "employee") {
    const employee = state.employees.find(
      (candidate) => candidate.id === reservation.employeeId,
    );
    if (!employee || employee.facilityTask) return false;
    const path = findCareAwareFacilityPath(
      state, context, employee.location, target, new Set([destination.id]),
    );
    if (path.length === 0) return false;
    employee.path = path;
    employee.pathIndex = 0;
    employee.lastMovedAtFacilityTick = state.facilityTick;
    employee.facilityTask = {
      kind: "perform_service",
      startedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: Number.MAX_SAFE_INTEGER,
      targetId: pending.operationId,
    };
    return true;
  }
  const path = findCareAwareFacilityPath(
    state, context, state.environment.founderLocation, target, new Set([destination.id]),
  );
  if (path.length === 0) return false;
  state.environment.founderActivity = {
    kind: "perform_service",
    targetId: pending.operationId,
    path,
    pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick,
    workMinutesRemaining: Number.MAX_SAFE_INTEGER,
  };
  return true;
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

function creditEligibleServiceIncome(
  state: GameState,
  encounter: EncounterState,
): void {
  const pending = encounter.pendingResult;
  if (
    encounter.lifecycle !== "active_pending_result" ||
    pending?.diagnosticTiming !== undefined ||
    pending?.deliveredAtTick !== null ||
    pending?.localServiceOperation !== undefined ||
    pending?.resourceQueue !== undefined ||
    !pending?.serviceIncomeEligible ||
    typeof pending.serviceIncomeFee !== "number"
  ) return;
  const line = getServiceIncomeForRoute(pending.routeId);
  if (!line || pending.serviceIncomeLineId !== line.id) return;
  const finalResourceTick = (pending.timingPhases ?? [])
    .filter((phase) => phase.resourceBound)
    .at(-1)?.endsAtTick;
  // A fee is earned only after frozen local work completes; routes without
  // explicit phases use their frozen local route completion tick.
  const completionTick = finalResourceTick ?? pending.dueTick;
  if (state.facilityTick < completionTick) return;
  const id = `income.${pending.operationId}.${pending.serviceIncomeLineId}`;
  if (state.serviceIncomeReceipts.some((receipt) => receipt.transactionKey === id)) return;
  state.serviceIncomeReceipts.push({
    id: `${id}.${state.nextServiceIncomeReceiptSequence}`,
    transactionKey: id,
    incomeLineId: pending.serviceIncomeLineId,
    catalogVersion: 1,
    routeId: pending.routeId,
    actorKind: "patient",
    actorId: encounter.id,
    grossAmount: pending.serviceIncomeFee,
    stockCost: 0,
    netCashDelta: pending.serviceIncomeFee,
    completedAtFacilityTick: state.facilityTick,
  });
  state.nextServiceIncomeReceiptSequence += 1;
  adjustCash(state, pending.serviceIncomeFee);
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
  const ended = [
    ...Object.values(state.encounters).filter(
      (encounter) =>
        encounter.id !== excludedEncounterId &&
        encounter.finalPatientSatisfaction !== null &&
        encounter.resolvedAtFacilityTick !== null &&
        (encounter.resolutionReason === "completed" ||
          encounter.resolutionReason === "walkout"),
    ),
    ...getRetiredEndedSatisfactionSamples(state),
  ]
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
    const priorOrdinaryCompleted =
      state.retiredEncounterSummary?.ordinaryEncounterCompleted === true ||
      Object.values(state.encounters).some(
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
      previousSatisfaction <= 90 &&
      (() => {
        const group = "success.satisfaction-above-90";
        const lastEmitted =
          state.alertHumor.conditionLastEmittedTicks[group];
        if (
          lastEmitted !== undefined &&
          state.facilityTick - lastEmitted < operatingDayMinutes(context)
        ) return false;
        state.alertHumor.conditionLastEmittedTicks[group] =
          state.facilityTick;
        return true;
      })()
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
        config.roomCleanlinessLossPerEncounter * getRoomUpgradeCleanlinessDecayMultiplier(room.roomDefinitionId, room.upgradeLevel),
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

function getEmployeeDiscussionApproachPath(
  state: GameState,
  context: DomainContext,
  employee: EmployeeState,
): GridPoint[] {
  const employeeCareRoom = protectedCareRoomAtPoint(state, context, employee.location);
  const allowedCareRooms = employeeCareRoom ? new Set([employeeCareRoom.id]) : new Set<string>();
  const candidates = [
    { x: employee.location.x, y: employee.location.y - 1 },
    { x: employee.location.x + 1, y: employee.location.y },
    { x: employee.location.x, y: employee.location.y + 1 },
    { x: employee.location.x - 1, y: employee.location.y },
  ];
  return candidates
    .map((destination) =>
      pathFromLocationToFacilityPoint(
        state,
        context,
        state.environment.founderLocation,
        destination,
        allowedCareRooms,
      ),
    )
    .filter((path) => path.length > 0)
    .sort(
      (left, right) =>
        left.length - right.length ||
        (left.at(-1)?.y ?? 0) - (right.at(-1)?.y ?? 0) ||
        (left.at(-1)?.x ?? 0) - (right.at(-1)?.x ?? 0),
    )[0] ?? [];
}

function employeeIsEligibleForDiscussion(
  state: GameState,
  context: DomainContext,
  clinicalCase: SyntheticClinicalCase,
  employee: EmployeeState,
): boolean {
  const participant = clinicalCase.participant;
  if (
    participant?.kind !== "employee_discussion" ||
    !participant.requiredStaffRoleDefinitionIds.includes(
      employee.staffRoleDefinitionId,
    ) ||
    employee.facilityTask ||
    isEmployeeAwayForTraining(employee) ||
    !isEmployeeAssignedToOperationalRoom(state, employee.id, context)
  ) {
    return false;
  }
  if (
    state.retailOperations.some(
      (operation) =>
        operation.actorKind === "employee" &&
        operation.actorId === employee.id &&
        operation.status !== "completed" &&
        operation.status !== "abandoned" &&
        operation.status !== "cancelled",
    )
  ) {
    return false;
  }
  if (
    Object.values(getEmployeeDiscussions(state)).some(
      (discussion) =>
        discussion.employeeId === employee.id &&
        discussion.lifecycle !== "resolved" &&
        discussion.lifecycle !== "cancelled",
    )
  ) {
    return false;
  }
  return getEmployeeDiscussionApproachPath(state, context, employee).length > 0;
}

function createEmployeeDiscussion(
  state: GameState,
  context: DomainContext,
  clinicalCase: SyntheticClinicalCase,
  employee: EmployeeState,
): EmployeeDiscussionState {
  const sequence = state.employeeDiscussionSequence ?? 0;
  const discussionId = `discussion.employee.${sequence}`;
  let frozenCase = clonePlain(clinicalCase);
  for (const node of frozenCase.decisionNodes) {
    if (node.shuffleAnswers) {
      node.answerChoices = deterministicShuffle(
        node.answerChoices,
        state.campaignSeed,
        RANDOM_STREAMS.answerOrder,
        `${discussionId}|${node.id}`,
      );
    }
  }
  frozenCase = materializePatientName(frozenCase, employee.displayName);
  return {
    id: discussionId,
    clinicalReleaseId: context.clinicalRelease.id,
    frozenCase,
    employeeId: employee.id,
    employeeDisplayName: employee.displayName,
    employeeAppearance: clonePlain(employee.appearance),
    lifecycle: "waiting_unopened",
    createdAtFacilityTick: state.facilityTick,
    firstOpenedAtTick: null,
    resolvedAtFacilityTick: null,
    cancellationReason: null,
    currentNodeIndex: 0,
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
  };
}

function reconcileEmployeeDiscussions(
  state: GameState,
): void {
  for (const discussion of Object.values(getEmployeeDiscussions(state))) {
    if (
      discussion.lifecycle === "resolved" ||
      discussion.lifecycle === "cancelled"
    ) {
      continue;
    }
    const employee = state.employees.find(
      (candidate) => candidate.id === discussion.employeeId,
    );
    const requiredRoles =
      discussion.frozenCase.participant?.kind === "employee_discussion"
        ? discussion.frozenCase.participant.requiredStaffRoleDefinitionIds
        : [];
    if (employee && requiredRoles.includes(employee.staffRoleDefinitionId)) {
      continue;
    }
    discussion.lifecycle = "cancelled";
    discussion.cancellationReason = employee
      ? "content_invalid"
      : "employee_unavailable";
    discussion.resolvedAtFacilityTick = state.facilityTick;
    if (state.openEmployeeDiscussionId === discussion.id) {
      state.openEmployeeDiscussionId = null;
    }
    if (
      state.environment.founderActivity?.kind ===
        "attend_employee_discussion" &&
      state.environment.founderActivity.targetId === discussion.id
    ) {
      state.environment.founderActivity = null;
    }
    if (
      employee?.facilityTask?.kind === "participate_qi_discussion" &&
      employee.facilityTask.targetId === discussion.id
    ) {
      employee.facilityTask = null;
    }
  }
}

function maybeScheduleEmployeeDiscussion(
  state: GameState,
  context: DomainContext,
  selectedAtRealMs: number,
): void {
  state.employeeDiscussions ??= {};
  state.employeeDiscussionSequence ??= 0;
  state.nextEmployeeDiscussionTick ??=
    state.facilityTick + EMPLOYEE_DISCUSSION_FIRST_DELAY_MINUTES;
  if (state.facilityTick < state.nextEmployeeDiscussionTick) return;

  const capabilities = getCurrentCapabilities(state, context);
  const activeConceptIds = new Set(
    [
      ...Object.values(state.employeeDiscussions)
        .filter(
          (discussion) =>
            discussion.lifecycle !== "resolved" &&
            discussion.lifecycle !== "cancelled",
        )
        .flatMap((discussion) =>
          discussion.frozenCase.decisionNodes.map(
            (node) => node.primaryConceptId,
          ),
        ),
      ...Object.values(state.encounters)
        .filter((encounter) => encounter.resolutionReason === null)
        .flatMap((encounter) =>
          encounter.frozenCase.decisionNodes.map(
            (node) => node.primaryConceptId,
          ),
        ),
    ],
  );
  const candidates = context.clinicalRelease.cases.filter(
    (clinicalCase) =>
      employeeDiscussionCaseIsRuntimeSafe(clinicalCase) &&
      clinicalCase.routineEligible &&
      clinicalCase.earliestFacilityStage <= state.facilityLevel &&
      clinicalCase.requiredCapabilityIds.every((capabilityId) =>
        capabilities.has(capabilityId),
      ) &&
      clinicalCase.decisionNodes.every(
        (node) => !activeConceptIds.has(node.primaryConceptId),
      ) &&
      state.employees.some((employee) =>
        employeeIsEligibleForDiscussion(
          state,
          context,
          clinicalCase,
          employee,
        ),
      ),
  );
  if (candidates.length === 0) return;
  const selection = selectRoutineClinicalCase(
    {
      ...state,
      routineArrivalSequence: state.employeeDiscussionSequence,
    },
    candidates,
    selectedAtRealMs,
  );
  if (!selection) {
    state.nextEmployeeDiscussionTick =
      state.facilityTick + EMPLOYEE_DISCUSSION_INTERVAL_MINUTES;
    return;
  }
  const employee = state.employees
    .filter((candidate) =>
      employeeIsEligibleForDiscussion(
        state,
        context,
        selection.clinicalCase,
        candidate,
      ),
    )
    .sort((left, right) => left.id.localeCompare(right.id))[0];
  if (!employee) return;
  const discussion = createEmployeeDiscussion(
    state,
    context,
    selection.clinicalCase,
    employee,
  );
  state.employeeDiscussions[discussion.id] = discussion;
  state.employeeDiscussionSequence += 1;
  state.nextEmployeeDiscussionTick =
    state.facilityTick + EMPLOYEE_DISCUSSION_INTERVAL_MINUTES;
}

function tryStartEmployeeDiscussionAttendance(
  state: GameState,
  discussion: EmployeeDiscussionState,
  context: DomainContext,
): boolean {
  if (discussion.lifecycle !== "active_action_required" ||
      state.openEmployeeDiscussionId !== discussion.id ||
      state.environment.pendingFounderConsult?.kind !== "employee_discussion" ||
      state.environment.pendingFounderConsult.targetId !== discussion.id) return false;
  if (state.environment.founderActivity?.kind === "attend_employee_discussion" &&
      state.environment.founderActivity.targetId === discussion.id) return true;
  const employee = state.employees.find((candidate) => candidate.id === discussion.employeeId);
  if (!employee || employee.facilityTask || isEmployeeAwayForTraining(employee) ||
      !isEmployeeAssignedToOperationalRoom(state, employee.id, context) ||
      state.retailOperations.some((operation) =>
        operation.actorKind === "employee" && operation.actorId === employee.id &&
        operation.status !== "completed" && operation.status !== "abandoned" && operation.status !== "cancelled")) return false;
  if (isFounderReservedForService(state) ||
      (state.environment.founderActivity !== null &&
       state.environment.founderActivity.kind !== "walk_to_point" &&
       !isAutomaticFounderActivity(state.environment.founderActivity))) return false;
  const path = getEmployeeDiscussionApproachPath(state, context, employee);
  if (path.length === 0) return false;
  suspendFounderActivityForConsult(state);
  cancelRetailTripsForActor(state, "founder", "founder", "A team discussion superseded optional shopping.");
  employee.path = [];
  employee.pathIndex = 0;
  employee.lastMovedAtFacilityTick = state.facilityTick;
  employee.facilityTask = {
    kind: "participate_qi_discussion",
    startedAtFacilityTick: state.facilityTick,
    workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    targetId: discussion.id,
  };
  state.environment.founderActivity = {
    kind: "attend_employee_discussion",
    targetId: discussion.id,
    path,
    pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick,
    workMinutesRemaining: Number.MAX_SAFE_INTEGER,
  };
  return true;
}

function reduceOpenEmployeeDiscussion(
  state: GameState,
  command: Extract<GameCommand, { type: "OPEN_EMPLOYEE_DISCUSSION" }>,
  context: DomainContext,
): GameState {
  const discussion = getEmployeeDiscussions(state)[command.discussionId];
  if (!discussion) {
    return rejectCommand(state, command, "This team discussion does not exist.");
  }
  if (
    discussion.lifecycle === "resolved" ||
    discussion.lifecycle === "cancelled"
  ) {
    return rejectCommand(state, command, "This team discussion is already filed.");
  }
  if (state.openChartEncounterId !== null) {
    return rejectCommand(state, command, "Close the patient chart before opening a team discussion.");
  }
  if (
    state.openEmployeeDiscussionId &&
    state.openEmployeeDiscussionId !== discussion.id
  ) {
    return rejectCommand(state, command, "Close the current team discussion first.");
  }
  if (discussion.lifecycle !== "waiting_unopened") {
    const next = clonePlain(state);
    if (next.employeeDiscussions?.[discussion.id]?.lifecycle === "active_traveling") {
      next.employeeDiscussions[discussion.id]!.lifecycle = "active_action_required";
    }
    next.openEmployeeDiscussionId = discussion.id;
    const node = next.employeeDiscussions![discussion.id]!.frozenCase.decisionNodes[
      next.employeeDiscussions![discussion.id]!.currentNodeIndex
    ];
    next.environment.pendingFounderConsult =
      next.employeeDiscussions![discussion.id]!.lifecycle === "active_action_required" && node
        ? { kind: "employee_discussion", targetId: discussion.id, nodeId: node.id }
        : null;
    tryStartEmployeeDiscussionAttendance(next, next.employeeDiscussions![discussion.id]!, context);
    return recordReceipt(next, command, "applied", "Team discussion opened.");
  }
  const next = clonePlain(state);
  const nextDiscussion = next.employeeDiscussions![discussion.id]!;
  nextDiscussion.lifecycle = "active_action_required";
  nextDiscussion.firstOpenedAtTick ??= next.facilityTick;
  next.openEmployeeDiscussionId = nextDiscussion.id;
  const node = nextDiscussion.frozenCase.decisionNodes[nextDiscussion.currentNodeIndex];
  next.environment.pendingFounderConsult = node
    ? { kind: "employee_discussion", targetId: nextDiscussion.id, nodeId: node.id }
    : null;
  const traveling = tryStartEmployeeDiscussionAttendance(next, nextDiscussion, context);
  return recordReceipt(
    next,
    command,
    "applied",
    traveling
      ? `Team discussion opened; the founder is walking to ${discussion.employeeDisplayName}.`
      : `Team discussion opened. Physical attendance will begin when available.`,
  );
}

function reduceCloseEmployeeDiscussion(
  state: GameState,
  command: Extract<GameCommand, { type: "CLOSE_EMPLOYEE_DISCUSSION" }>,
  context: DomainContext,
): GameState {
  if (state.openEmployeeDiscussionId !== command.discussionId) {
    return rejectCommand(state, command, "That team discussion is not open.");
  }
  const next = clonePlain(state);
  const discussion = next.employeeDiscussions?.[command.discussionId];
  if (discussion) releaseEmployeeDiscussionReservation(next, discussion, context);
  if (next.environment.pendingFounderConsult?.kind === "employee_discussion" &&
      next.environment.pendingFounderConsult.targetId === command.discussionId) {
    next.environment.pendingFounderConsult = null;
  }
  next.openEmployeeDiscussionId = null;
  return recordReceipt(next, command, "applied", "Team discussion closed.");
}

function reduceSubmitEmployeeDiscussionAnswer(
  state: GameState,
  command: Extract<GameCommand, { type: "SUBMIT_EMPLOYEE_DISCUSSION_ANSWER" }>,
  context: DomainContext,
): GameState {
  const discussion = getEmployeeDiscussions(state)[command.discussionId];
  if (
    !discussion ||
    (discussion.lifecycle !== "active_action_required" && discussion.lifecycle !== "active_traveling") ||
    state.openEmployeeDiscussionId !== discussion.id
  ) {
    return rejectCommand(state, command, "No answer-ready team discussion is open.");
  }
  const node = discussion.frozenCase.decisionNodes[discussion.currentNodeIndex];
  if (!node || node.id !== command.decisionNodeId) {
    return rejectCommand(state, command, "The discussion question is stale.");
  }
  const choice = node.answerChoices.find(
    (candidate) => candidate.id === command.answerChoiceId,
  );
  if (!choice) {
    return rejectCommand(state, command, "The selected answer does not exist.");
  }
  if (discussion.steps[discussion.currentNodeIndex]?.answer !== null) {
    return rejectCommand(state, command, "This discussion question was already answered.");
  }
  const reviewedAtMs =
    command.reviewedAtMs ??
    state.createdAtRealMs +
      state.facilityTick * 60_000 +
      state.reviewIntents.length;
  if (!Number.isSafeInteger(reviewedAtMs) || reviewedAtMs < 0) {
    return rejectCommand(state, command, "The learning review needs a valid timestamp.");
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
    return rejectCommand(state, command, "The learning review predates the previous review.");
  }
  const rating = choice.isCorrect ? "Good" : "Again";
  const scheduledReview = applyFsrsReview(
    currentHistory.card,
    rating,
    reviewedAtMs,
    context.balanceRelease.learning,
  );
  const next = clonePlain(state);
  const nextDiscussion = next.employeeDiscussions![discussion.id]!;
  const nextHistory = clonePlain(currentHistory);
  nextHistory.card = scheduledReview.card;
  nextHistory.reviews.push({
    id: `review.${nextDiscussion.id}.${node.id}`,
    encounterId: nextDiscussion.id,
    decisionNodeId: node.id,
    questionVariantId: node.questionVariantId,
    patientPresentationVariantId:
      nextDiscussion.frozenCase.patientPresentationVariantId,
    primaryConceptId: node.primaryConceptId,
    answerChoiceId: choice.id,
    correct: choice.isCorrect,
    rating,
    reviewedAtMs,
    facilityTick: next.facilityTick,
    schedulerLog: scheduledReview.log,
  });
  next.learningHistories[node.primaryConceptId] = nextHistory;
  const isFinalNode =
    nextDiscussion.currentNodeIndex ===
    nextDiscussion.frozenCase.decisionNodes.length - 1;
  const answer: AnswerRecord = {
    decisionNodeId: node.id,
    primaryConceptId: node.primaryConceptId,
    answerChoiceId: choice.id,
    correct: choice.isCorrect,
    ratingIntent: rating,
    answeredAtFacilityTick: next.facilityTick,
    explanation: node.explanation,
    correctedForward: !choice.isCorrect && !isFinalNode,
  };
  nextDiscussion.answers.push(answer);
  const step = nextDiscussion.steps[nextDiscussion.currentNodeIndex];
  if (!step || step.decisionNodeId !== node.id) {
    throw new Error("Employee discussion history does not match its current node.");
  }
  step.answer = clonePlain(answer);
  step.status = "feedback_pending";
  nextDiscussion.lifecycle = "feedback_pending";
  next.environment.pendingFounderConsult = null;
  releaseEmployeeDiscussionReservation(next, nextDiscussion, context);
  next.reviewIntents.push({
    id: `review-intent.${nextDiscussion.id}.${node.id}`,
    encounterId: nextDiscussion.id,
    decisionNodeId: node.id,
    primaryConceptId: node.primaryConceptId,
    rating,
    facilityTick: next.facilityTick,
    reviewedAtMs,
  });
  const learningXpAwarded = choice.isCorrect
    ? context.balanceRelease.clinicalSettlement.clinicalXpPerCorrectFirstAnswer
    : context.balanceRelease.clinicalSettlement.clinicalXpPerIncorrectFirstAnswer;
  next.clinicalXp += learningXpAwarded;
  appendEvent(next, {
    id: `event.employee-discussion.${nextDiscussion.id}.${node.id}`,
    type: "employee_discussion_decision",
    facilityTick: next.facilityTick,
    encounterId: null,
    message: choice.isCorrect
      ? `${nextDiscussion.employeeDisplayName}: team learning decision recorded. +${learningXpAwarded} Learning XP.`
      : `${nextDiscussion.employeeDisplayName}: corrective team teaching provided.`,
    priority: "informational",
    target: { kind: "employee", id: nextDiscussion.employeeId },
    reward: {
      cashDelta: 0,
      learningXpDelta: learningXpAwarded,
      satisfactionDelta: 0,
    },
  });
  return recordReceipt(next, command, "applied", "Team discussion answer recorded.");
}

function reduceAcknowledgeEmployeeDiscussionFeedback(
  state: GameState,
  command: Extract<GameCommand, { type: "ACKNOWLEDGE_EMPLOYEE_DISCUSSION_FEEDBACK" }>,
): GameState {
  const discussion = getEmployeeDiscussions(state)[command.discussionId];
  const node = discussion?.frozenCase.decisionNodes[discussion.currentNodeIndex];
  if (
    !discussion ||
    discussion.lifecycle !== "feedback_pending" ||
    !node ||
    node.id !== command.decisionNodeId
  ) {
    return rejectCommand(state, command, "No matching discussion feedback is waiting.");
  }
  const next = clonePlain(state);
  const nextDiscussion = next.employeeDiscussions![discussion.id]!;
  const step = nextDiscussion.steps[nextDiscussion.currentNodeIndex]!;
  step.status = "completed";
  if (
    nextDiscussion.currentNodeIndex <
    nextDiscussion.frozenCase.decisionNodes.length - 1
  ) {
    nextDiscussion.currentNodeIndex += 1;
    nextDiscussion.steps[nextDiscussion.currentNodeIndex]!.status =
      "action_required";
    nextDiscussion.lifecycle = "active_action_required";
  } else {
    nextDiscussion.lifecycle = "resolved_summary_available";
    nextDiscussion.resolvedAtFacilityTick = next.facilityTick;
  }
  return recordReceipt(next, command, "applied", "Discussion feedback reviewed.");
}

function releaseEmployeeDiscussionReservation(
  state: GameState,
  discussion: EmployeeDiscussionState,
  context: DomainContext,
): void {
  const employee = state.employees.find(
    (candidate) => candidate.id === discussion.employeeId,
  );
  if (
    employee?.facilityTask?.kind === "participate_qi_discussion" &&
    employee.facilityTask.targetId === discussion.id
  ) {
    employee.facilityTask = null;
  }
  if (
    state.environment.founderActivity?.kind ===
      "attend_employee_discussion" &&
    state.environment.founderActivity.targetId === discussion.id
  ) {
    state.environment.founderActivity = null;
    resumeFounderActivityAfterConsult(state, context);
  } else {
    state.environment.suspendedFounderActivity = null;
  }
}

function reduceFileEmployeeDiscussion(
  state: GameState,
  command: Extract<GameCommand, { type: "FILE_EMPLOYEE_DISCUSSION" }>,
  context: DomainContext,
): GameState {
  const discussion = getEmployeeDiscussions(state)[command.discussionId];
  if (!discussion || discussion.lifecycle !== "resolved_summary_available") {
    return rejectCommand(state, command, "This team discussion is not ready to file.");
  }
  const next = clonePlain(state);
  const nextDiscussion = next.employeeDiscussions![discussion.id]!;
  nextDiscussion.lifecycle = "resolved";
  nextDiscussion.resolvedAtFacilityTick ??= next.facilityTick;
  if (next.openEmployeeDiscussionId === nextDiscussion.id) {
    next.openEmployeeDiscussionId = null;
  }
  releaseEmployeeDiscussionReservation(next, nextDiscussion, context);
  return recordReceipt(next, command, "applied", "Team discussion filed.");
}

function reduceOpenChart(
  state: GameState,
  command: Extract<GameCommand, { type: "OPEN_CHART" }>,
  context: DomainContext,
): GameState {
  if (
    state.openEmployeeDiscussionId !== null &&
    state.openEmployeeDiscussionId !== undefined
  ) {
    return rejectCommand(
      state,
      command,
      "Close the team discussion before opening a patient chart.",
    );
  }
  const encounter = state.encounters[command.encounterId];
  if (!encounter) {
    return rejectCommand(state, command, "This chart does not exist.");
  }
  if (encounter.checkInStatus !== "checked_in") {
    return rejectCommand(
      state,
      command,
      "The patient has not checked in at the Front Desk yet.",
    );
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
  const retailTrip = activeRetailOperationForActor(
    next,
    "encounter",
    command.encounterId,
  );
  if (encounterHasDiagnosticCareWork(next, nextEncounter.id) && nextEncounter.steps[nextEncounter.currentNodeIndex]?.status !== "feedback_pending") {
    next.openChartEncounterId = nextEncounter.id;
    clearPatientFeedAttention(nextEncounter);
    return recordReceipt(next, command, "applied", "Chart opened while the ordered diagnostic care continues.");
  }
  const careEligibleLifecycle =
    nextEncounter.lifecycle === "waiting_unopened" ||
    nextEncounter.lifecycle === "active_action_required" ||
    (nextEncounter.lifecycle === "resolved_summary_available" &&
      nextEncounter.terminalFeedback?.acknowledged !== true);
  if (retailTrip && careEligibleLifecycle) {
    // Retail movement owns the live actor position while its trip is active.
    // Freeze that exact tile before cancelling so the chart redirect starts
    // where the player can currently see the patient.
    nextEncounter.patientLocation = { ...retailTrip.location };
    cancelRetailTripsForActor(
      next,
      "encounter",
      command.encounterId,
      "The patient's examination superseded optional shopping.",
    );
  }
  const amenityTrip = getPatientAmenityTrip(
    next,
    "encounter",
    command.encounterId,
  );

  next.openChartEncounterId = nextEncounter.id;
  clearPatientFeedAttention(nextEncounter);
  const isFirstOpening = nextEncounter.lifecycle === "waiting_unopened";
  const isReopenableActive =
    nextEncounter.lifecycle === "active_action_required";
  const isUnacknowledgedTerminal =
    nextEncounter.lifecycle === "resolved_summary_available" &&
    nextEncounter.terminalFeedback?.acknowledged !== true;
  if (isFirstOpening) {
    nextEncounter.lifecycle = "active_action_required";
    nextEncounter.firstOpenedAtTick ??= next.facilityTick;
  }
  const actionableNode = nextEncounter.lifecycle === "active_action_required"
    ? nextEncounter.frozenCase.decisionNodes[nextEncounter.currentNodeIndex]
    : null;
  next.environment.pendingFounderConsult = actionableNode
    ? { kind: "encounter", targetId: nextEncounter.id, nodeId: actionableNode.id }
    : null;
  const procedureConsultCandidate = (() => {
    const pending = nextEncounter.pendingResult;
    if (!pending || pending.deliveredAtTick === null ||
        nextEncounter.currentNodeIndex <= pending.originatingNodeIndex) return null;
    const roomId = pending.completedCareProvenance?.roomInstanceId ??
      pending.patientTravel?.destinationRoomInstanceId;
    const room = roomId ? next.rooms.find((candidate) => candidate.id === roomId) : null;
    return room && (room.roomDefinitionId === "room.endoscopy" ||
      room.roomDefinitionId === "room.ambulatory_or") ? room : null;
  })();
  const procedureConsultRoom = (() => {
    const room = procedureConsultCandidate;
    if (!room) return null;
    const occupiedByAnotherPatient = Object.values(next.encounters).some(
      (encounter) => encounter.id !== nextEncounter.id && (
        encounter.assignedRoomInstanceId === room.id ||
        encounter.queuedCareRoomInstanceId === room.id ||
        encounter.patientMovement?.destinationRoomInstanceId === room.id ||
        (() => {
          const visibleLocation = getEncounterPatientLocation(next, encounter.id);
          return visibleLocation !== null && pointInsideRoom(visibleLocation, room, context);
        })()
      ),
    ) || next.serviceOperations.some((operation) =>
      operation.actorId !== nextEncounter.id &&
      // A finished operation keeps the last in-room location of a patient who
      // has since walked back to wait for results; only live work occupies
      // the room. Patients are covered by their own locations above.
      operation.status !== "completed" && operation.status !== "cancelled" && (
        operation.reservedRoomInstanceIds.includes(room.id) ||
        operation.transitionHeldRoomInstanceIds?.includes(room.id) ||
        operation.periopBedReservation?.roomInstanceId === room.id ||
        (operation.location !== null && pointInsideRoom(operation.location, room, context))
      ),
    );
    return occupiedByAnotherPatient ? null : room;
  })();
  const hasExamReservation = encounterHasExaminationRoomReservation(
    next,
    nextEncounter,
  );
  // A new clinic starts with $120 while the required first Examination Room
  // costs $160. The two protected tutorial encounters may therefore complete
  // at the Front Desk only while no Examination Room exists, so even their
  // lowest combined payouts still fund normal construction after the required
  // timed-service wait and posted Front Desk upkeep. Every ordinary visit, and
  // every clinic with an Examination Room, retains the care-room rule.
  const usesProtectedFrontDeskTutorialBridge =
    (nextEncounter.id === TUTORIAL_ENCOUNTER_ID ||
      nextEncounter.id === SECOND_TUTORIAL_ENCOUNTER_ID) &&
    next.facilityLevel === 0 &&
    !next.rooms.some(
      (room) => room.roomDefinitionId === "room.examination",
    );
  const needsCareRoom = procedureConsultRoom === null &&
    procedureConsultCandidate === null &&
    (isFirstOpening || isReopenableActive || isUnacknowledgedTerminal) &&
    !hasExamReservation &&
    !usesProtectedFrontDeskTutorialBridge;
  const existingExamRoomId = getEncounterExaminationRoomId(
    next,
    nextEncounter,
  );
  const founderAlreadyAttending =
    next.environment.founderActivity?.kind === "attend_encounter" &&
    next.environment.founderActivity.targetId === nextEncounter.id;
  const needsFounderEscort =
    !needsCareRoom &&
    existingExamRoomId !== null &&
    !founderAlreadyAttending &&
    nextEncounter.lifecycle !== "active_pending_result";
  const needsDetourRedirect =
    careEligibleLifecycle &&
    existingExamRoomId !== null &&
    (amenityTrip !== null || retailTrip !== null);
  const needsProcedureConsult = procedureConsultRoom !== null && !founderAlreadyAttending;
  const founderHasBlockingActivity = next.environment.founderActivity !== null &&
    next.environment.founderActivity.kind !== "walk_to_point" &&
    !isAutomaticFounderActivity(next.environment.founderActivity);
  const founderCanAttend = founderAlreadyAttending ||
    (!isFounderReservedForService(next) && !founderHasBlockingActivity);
  if ((needsCareRoom || needsFounderEscort || needsDetourRedirect || needsProcedureConsult) && founderCanAttend) {
    const destination = needsProcedureConsult
      ? (() => {
          const definition = getRoomDefinition(procedureConsultRoom.roomDefinitionId, context);
          if (!definition) return null;
          const founderPath = pathFromLocationToFacilityPoint(
            next, context, next.environment.founderLocation,
            getRoomNavigationAnchor(procedureConsultRoom, definition, "staff"),
            new Set([procedureConsultRoom.id]),
          );
          return founderPath.length > 0
            ? { roomId: procedureConsultRoom.id, patientPath: [], founderPath }
            : null;
        })()
      : needsCareRoom
      ? (() => {
          const start =
            nextEncounter.patientLocation ??
            getPublicEntrance(next, context)?.outside ??
            null;
          return start === null
            ? null
            : chooseCareRoom(
                next,
                context,
                start,
                next.environment.founderLocation,
                nextEncounter.id,
              );
        })()
      : (() => {
          const room = next.rooms.find(
            (candidate) => candidate.id === existingExamRoomId,
          );
          const definition = room
            ? getRoomDefinition(room.roomDefinitionId, context)
            : null;
          if (!room || !definition) return null;
          const patientPath = nextEncounter.patientLocation
            ? pathFromLocationToFacilityPoint(
                next,
                context,
                nextEncounter.patientLocation,
                getRoomCareAnchor(room, definition, "patient"),
                new Set([room.id]),
              )
            : [];
          const founderPath = pathFromLocationToFacilityPoint(
            next,
            context,
            next.environment.founderLocation,
            getRoomCareAnchor(room, definition, "clinician"),
            new Set([room.id]),
          );
          return founderPath.length > 0
            ? {
                roomId: room.id,
                patientPath,
                founderPath,
              }
            : null;
        })();
    if (destination) {
      if (!founderAlreadyAttending) suspendFounderActivityForConsult(next);
      next.environment.founderActivity = {
      kind: "attend_encounter",
      targetId: nextEncounter.id,
      path: destination.founderPath,
      pathIndex: 0,
      lastMovedAtFacilityTick: next.facilityTick,
      // Arrival keeps the seated visual stable until a later chart-close
      // milestone explicitly assigns the founder's next activity.
      workMinutesRemaining: Number.MAX_SAFE_INTEGER,
      };
    if (!needsProcedureConsult && (needsCareRoom || amenityTrip || retailTrip)) {
      nextEncounter.waitingDestination = null;
      // Chart availability is immediate and so is the care redirect: a patient
      // already walking or idling toward a waiting endpoint leaves that leg at
      // their persisted current tile, not after reaching its stale reservation.
      if (amenityTrip) {
        // The amenity trip owns movement until it can safely turn around. Its
        // return target is changed to the actual exam anchor, so completing
        // the trip cannot restore the stale waiting destination or require a
        // second chart click.
        amenityTrip.returnTarget = {
          ...(destination.patientPath.at(-1) ?? nextEncounter.patientLocation!),
        };
        nextEncounter.queuedCareRoomInstanceId = destination.roomId;
        requestPatientAmenityReturn(
          next,
          "encounter",
          command.encounterId,
          context,
        );
      } else {
        nextEncounter.queuedCareRoomInstanceId = null;
        startPatientMovement(
          next,
          context,
          nextEncounter,
          "walking_to_care",
          destination.patientPath,
          destination.roomId,
        );
      }
    }
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

function releaseEncounterCareReservation(encounter: EncounterState): void {
  encounter.assignedRoomInstanceId = null;
  encounter.queuedCareRoomInstanceId = null;
}

function releasePendingTestingCareReservation(encounter: EncounterState): void {
  releaseEncounterCareReservation(encounter);
  // The patient can finish the already-frozen service approach, but its
  // movement destination must no longer reserve the Examination Room for the
  // duration of that journey.
  if (encounter.patientMovement?.kind === "walking_to_care" &&
      encounter.patientMovement.destinationRoomInstanceId !==
        encounter.pendingResult?.patientTravel?.destinationRoomInstanceId) {
    encounter.patientMovement.destinationRoomInstanceId = null;
  }
}

function releaseFounderAttendanceForEncounter(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
): void {
  const activity = state.environment.founderActivity;
  // A player may have superseded the escort. Do not replace that newer command
  // merely because the original encounter subsequently closes or starts a
  // service route.
  if (activity?.kind !== "attend_encounter" || activity.targetId !== encounter.id) {
    state.environment.suspendedFounderActivity = null;
    return;
  }
  state.environment.founderActivity = null;
  resumeFounderActivityAfterConsult(state, context);
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
  if (next.environment.pendingFounderConsult?.kind === "encounter" &&
      next.environment.pendingFounderConsult.targetId === command.encounterId) {
    next.environment.pendingFounderConsult = null;
  }
  const releaseFounderAttendance = () =>
    releaseFounderAttendanceForEncounter(next, context, nextEncounter);
  const returnPatientToWaiting = () => {
    releaseEncounterCareReservation(nextEncounter);
    nextEncounter.waitingDestination = null;
    // Preserve the tile reached so far, but discard an obsolete leg to the
    // Examination Room before selecting a fresh waiting route.
    nextEncounter.patientMovement = null;
    if (!nextEncounter.patientLocation) return;
    const destination = chooseWaitingDestination(next, context, nextEncounter);
    nextEncounter.waitingDestination = destination.reservation;
    if (destination.path.length > 0) startPatientMovement(next, context, nextEncounter, "walking_to_waiting", destination.path, destination.roomId);
  };
  if (next.openChartEncounterId === command.encounterId) {
    next.openChartEncounterId = null;
  }
  if (next.attendedEncounterId === command.encounterId) {
    next.attendedEncounterId = null;
  }
  if (nextEncounter.lifecycle !== "active_action_required" && encounterHasDiagnosticCareWork(next, nextEncounter.id)) {
    if (nextEncounter.lifecycle === "resolved_summary_available" && nextEncounter.terminalFeedback?.acknowledged) nextEncounter.lifecycle = "resolved";
    releaseFounderAttendance();
    return recordReceipt(next, command, "applied", "Chart closed; the ordered diagnostic care continues.");
  }
  if (
    nextEncounter.lifecycle === "resolved_summary_available" &&
    nextEncounter.terminalFeedback?.acknowledged
  ) {
    nextEncounter.lifecycle = "resolved";
    nextEncounter.idleWaitingSinceTick = null;
    const activeProcedure = encounterHasActiveServiceOperation(
      next,
      nextEncounter.id,
    );
    releaseEncounterCareReservation(nextEncounter);
    nextEncounter.waitingDestination = null;
    nextEncounter.patientMovement = null;
    if (!activeProcedure) {
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
    releaseFounderAttendance();
  } else if (nextEncounter.lifecycle === "active_action_required") {
    returnPatientToWaiting();
    releaseFounderAttendance();
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
  } else if (nextEncounter.lifecycle === "resolved_summary_available") {
    // Terminal feedback remains available until it is acknowledged, but the
    // physical examination is over as soon as the player closes the chart.
    // Route from the current tile so a stale leg to the bed cannot complete.
    returnPatientToWaiting();
    releaseFounderAttendance();
    nextEncounter.idleWaitingSinceTick = next.facilityTick;
    nextEncounter.lastSatisfactionDecayAtTick = next.facilityTick;
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

function finalProcedureIncomeLineId(
  encounter: EncounterState,
  node: DecisionNode,
  answerChoiceId: string,
): string | null {
  const exactAction = `${encounter.frozenCase.id}|${node.id}|${answerChoiceId}`;
  const simpleActions = new Set([
    "case.breast-cyst.under-30-painful-simple|node.breast-cyst.symptomatic-simple-aspiration.v1|needle_aspiration",
  ]);
  if (simpleActions.has(exactAction)) return "income.procedure.breast_cyst_aspiration.v2";
  const cutaneousAbscessActions = new Set([
    "case.bread-butter.cutaneous-abscess.forearm-redness|node.bread-butter.cutaneous-abscess.forearm-redness.2|drain_1",
    "case.bread-butter.cutaneous-abscess.back-nodule|node.bread-butter.cutaneous-abscess.back-nodule.2|drain_2",
    "case.bread-butter.cutaneous-abscess.thigh-swelling|node.bread-butter.cutaneous-abscess.thigh-swelling.2|drain_3",
    "case.bread-butter.cutaneous-abscess.abdominal-wall-redness|node.bread-butter.cutaneous-abscess.abdominal-wall-redness.2|drain_4",
  ]);
  if (cutaneousAbscessActions.has(exactAction)) return "income.procedure.cutaneous_abscess_drainage.v2";
  const complexActions = new Set([
    "case.bread-butter.superficial-incisional-ssi.purulent-staple-line|node.bread-butter.superficial-incisional-ssi.purulent-staple-line.1|open_1",
    "case.bread-butter.superficial-incisional-ssi.red-incision|node.bread-butter.superficial-incisional-ssi.red-incision.1|open_2",
    "case.bread-butter.superficial-incisional-ssi.incisional-collection|node.bread-butter.superficial-incisional-ssi.incisional-collection.1|open_3",
    "case.bread-butter.superficial-incisional-ssi.tender-staples|node.bread-butter.superficial-incisional-ssi.tender-staples.1|open_4",
  ]);
  if (complexActions.has(exactAction)) return "income.procedure.superficial_incisional_infection_drainage.v2";
  const officeBandingActions = new Set([
    "case.internal-hemorrhoids.commute|node.internal-hemorrhoids.commute.2|banding_1",
    "case.internal-hemorrhoids.exercise|node.internal-hemorrhoids.exercise.2|banding_2",
    "case.internal-hemorrhoids.workday|node.internal-hemorrhoids.workday.2|banding_3",
    "case.internal-hemorrhoids.followup|node.internal-hemorrhoids.followup.2|banding_4",
  ]);
  if (officeBandingActions.has(exactAction)) return "income.procedure.office_internal_hemorrhoid_banding";
  const perianalDrainageActions = new Set([
    "case.bread-butter.perianal-abscess.tender-perianal-lump|node.bread-butter.perianal-abscess.tender-perianal-lump.1|drain_1",
    "case.bread-butter.perianal-abscess.perianal-swelling|node.bread-butter.perianal-abscess.perianal-swelling.1|drain_2",
    "case.bread-butter.perianal-abscess.painful-sitting|node.bread-butter.perianal-abscess.painful-sitting.1|drain_3",
    "case.bread-butter.perianal-abscess.draining-pain|node.bread-butter.perianal-abscess.draining-pain.1|drain_4",
  ]);
  if (perianalDrainageActions.has(exactAction)) return "income.procedure.perianal_abscess_drainage";
  const breastAbscessAspirationActions = new Set([
    "case.lactational-breast-abscess.tender-upper-breast|node.lactational-breast-abscess.tender-upper-breast.2|guided_aspiration_1",
    "case.lactational-breast-abscess.persistent-mass|node.lactational-breast-abscess.persistent-mass.2|guided_aspiration_2",
    "case.lactational-breast-abscess.focal-redness|node.lactational-breast-abscess.focal-redness.2|guided_aspiration_3",
    "case.lactational-breast-abscess.nursing-pain|node.lactational-breast-abscess.nursing-pain.2|guided_aspiration_4",
  ]);
  return breastAbscessAspirationActions.has(exactAction)
    ? "income.procedure.image_guided_breast_abscess_aspiration"
    : null;
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
  const correctChoice = node.answerChoices.find((candidate) => candidate.isCorrect);
  const correctTestOrder = correctChoice
    ? getExactTestChoiceOrderRecord(encounter, node, correctChoice.id)
    : null;
  const diagnostic = correctChoice && (!isFinalNode || choice.isCorrect)
    ? getDiagnosticChoicePlanning(state, encounter, node, correctChoice.id, context) : null;
  const diagnosticPlan = diagnostic?.executionAllowed && diagnostic.quote.kind === "planned" && diagnostic.quote.plan.execution === "supported"
    ? diagnostic.quote.plan : null;
  const stagedDisposition =
    !isFinalNode &&
    node.resultGateAfter &&
    correctTestOrder?.disposition.kind === "staged_result_gate"
      ? correctTestOrder.disposition
      : null;
  const stagedComponents = stagedDisposition
    ? stagedDisposition.components.flatMap((component) => {
        const selected = getServiceOrderRouteSelection(
          state,
          component.serviceId,
          component.allowedRouteIds,
          context,
          encounter.id,
        ).selection;
        const income = selected ? getServiceIncomeForRoute(selected.route.id) : null;
        return selected && income
          ? [{ component, selected, income }]
          : [];
      })
    : [];
  let scheduledResult: PendingResult | null = null;
  if (!diagnosticPlan && !isFinalNode && node.resultGateAfter && stagedComponents.length === 0) {
    const resultGateRouteOverride =
      correctTestOrder?.disposition.kind === "result_gate_route_override" &&
      correctTestOrder.disposition.serviceId === node.resultGateAfter.resultTypeId
        ? correctTestOrder.disposition
        : null;
    scheduledResult = scheduleResult(
      state,
      context,
      encounter,
      node,
      resultGateRouteOverride
        ? {
            ...node.resultGateAfter,
            allowedServiceRouteIds: [...resultGateRouteOverride.allowedRouteIds],
          }
        : node.resultGateAfter,
      resultGateRouteOverride?.allowOnsiteEquivalents ?? true,
    );
    if (!scheduledResult) {
      return rejectCommand(
        state,
        command,
        "No permitted result route is currently available.",
      );
    }
  }

  const terminalTestSelection =
    !diagnosticPlan &&
    isFinalNode &&
    choice.isCorrect &&
    correctTestOrder?.disposition.kind === "terminal_service"
      ? getServiceOrderRouteSelection(
          state,
          correctTestOrder.disposition.serviceId,
          correctTestOrder.disposition.allowedRouteIds,
          context,
          encounter.id,
        ).selection
      : null;
  const continuationSelection =
    !diagnosticPlan &&
    !isFinalNode &&
    choice.isCorrect &&
    correctTestOrder?.disposition.kind === "test_only_continuation"
      ? getServiceOrderRouteSelection(
          state,
          correctTestOrder.disposition.serviceId,
          correctTestOrder.disposition.allowedRouteIds,
          context,
          encounter.id,
        ).selection
      : null;

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
  const attendedCareRoom = getPhysicallyAttendedCareRoom(next, nextEncounter, context);
  if (attendedCareRoom) {
    completeWaitingRoomExperience(nextEncounter, next.facilityTick);
    completeExaminationRoomExperience(nextEncounter, attendedCareRoom, next.facilityTick);
  }
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
  if (!diagnosticPlan && stagedComponents.length > 0 && node.resultGateAfter && correctTestOrder) {
    const remainder = scheduleResult(state, context, encounter, node, node.resultGateAfter);
    if (!remainder) {
      return rejectCommand(state, command, "No permitted external result route is currently available.");
    }
    nextEncounter.stagedResultOrder = {
      version: "staged-result-order.v1",
      originatingNodeIndex: nextEncounter.currentNodeIndex,
      caseId: correctTestOrder.caseId,
      nodeId: correctTestOrder.nodeId,
      questionVariantId: correctTestOrder.questionVariantId,
      choiceId: correctTestOrder.choiceId,
      choiceLabel: correctTestOrder.choiceLabel,
      status: "feedback_pending",
      remainderMode: stagedDisposition!.remainderMode,
      currentComponentIndex: 0,
      components: stagedComponents.map(({ component, selected, income }) => ({
        componentId: component.componentId,
        serviceId: component.serviceId,
        routeId: selected.route.id,
        routeDisplayName: selected.route.displayName,
        incomeLineId: income.id,
        quoteFee: income.fee,
        roomUpgradeRevenue: createRoomUpgradeRevenueQuote(next, income.fee,
          selected.route.resourceRequirements.map((resource) => resource.roomDefinitionId)),
        roomUpgradeRecovery: createRoomUpgradeRecoveryQuote(next,
          getNewPeriopServiceOperationPhases(income.id) ?? income.operation?.phases ?? []),
        operationPhases: income.operation!.phases.map((phase) => ({
          id: phase.id,
          roomDefinitionId: phase.roomDefinitionId,
          durationMinutes: phase.durationMinutes,
          staffRoleDefinitionIds: [...phase.staffRoleDefinitionIds],
          ...(phase.providerRoleDefinitionIds
            ? { providerRoleDefinitionIds: [...phase.providerRoleDefinitionIds] }
            : {}),
          ...(phase.founderEligible === true ? { founderEligible: true as const } : {}),
        })),
        externalRemainder: component.externalRemainder,
        status: "pending",
        serviceOperationId: null,
      })),
      remainder: clonePlain(remainder),
    };
  }
  next.reviewIntents.push({
    id: `review-intent.${nextEncounter.id}.${node.id}`,
    encounterId: nextEncounter.id,
    decisionNodeId: node.id,
    primaryConceptId: node.primaryConceptId,
    rating,
    facilityTick: next.facilityTick,
    reviewedAtMs,
  });
  if (
    continuationSelection &&
    correctTestOrder?.disposition.kind === "test_only_continuation"
  ) {
    nextEncounter.testOnlyContinuation = {
      version: "test-only-continuation.v1",
      originatingNodeIndex: nextEncounter.currentNodeIndex,
      serviceId: correctTestOrder.disposition.serviceId,
      routeId: continuationSelection.route.id,
      routeDisplayName: continuationSelection.route.displayName,
      incomeLineId: getServiceIncomeForRoute(continuationSelection.route.id)?.id ?? null,
      externalRemainder: correctTestOrder.disposition.externalRemainder,
      quoteFee: getServiceIncomeForRoute(continuationSelection.route.id)?.fee,
      roomUpgradeRevenue: createRoomUpgradeRevenueQuote(next, getServiceIncomeForRoute(continuationSelection.route.id)?.fee ?? 0,
        continuationSelection.route.resourceRequirements.map((resource) => resource.roomDefinitionId)),
      roomUpgradeRecovery: createRoomUpgradeRecoveryQuote(next,
        getNewPeriopServiceOperationPhases(getServiceIncomeForRoute(continuationSelection.route.id)?.id ?? "") ??
        getServiceIncomeForRoute(continuationSelection.route.id)?.operation?.phases ?? []),
      status: "feedback_pending",
      serviceOperationId: null,
      scheduledAtFacilityTick: next.facilityTick,
      completedAtFacilityTick: null,
    };
  }
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
    completeWaitingRoomExperience(nextEncounter, next.facilityTick);
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
    if (choice.isCorrect) {
      const procedureLineId = finalProcedureIncomeLineId(
        nextEncounter,
        node,
        choice.id,
      );
      if (procedureLineId) {
        startEncounterProcedureOperation(
          next,
          nextEncounter,
          procedureLineId,
          context,
        );
      }
      if (diagnosticPlan && diagnostic) {
        const source = diagnosticPlan.sources[0]!;
        const externalRemainder = correctTestOrder?.disposition.kind === "terminal_service" ? correctTestOrder.disposition.externalRemainder ?? null : null;
        nextEncounter.terminalTestOrder = {
          diagnosticTiming: clonePlain(diagnosticPlan), version: "terminal-test-order.v1",
          caseId: nextEncounter.frozenCase.id, nodeId: node.id, questionVariantId: node.questionVariantId,
          choiceId: correctChoice!.id, choiceLabel: correctChoice!.label, serviceId: diagnostic.serviceId!,
          routeId: source.routeId ?? `route.diagnostic.external.${diagnostic.timingProfileId}`,
          routeDisplayName: source.routeDisplayName, externalRemainder,
          status: diagnosticPlan.phases.some((phase) => phase.mode === "local" && phase.requirement && phase.patientPresent) ? "onsite_service" : "external_arranged",
          serviceOperationId: null, scheduledAtFacilityTick: next.facilityTick,
        };
        prepareNewDiagnosticPatient(next, nextEncounter);
      } else if (terminalTestSelection) {
        const incomeLine = getServiceIncomeForRoute(terminalTestSelection.route.id);
        const externalRemainder =
          correctTestOrder?.disposition.kind === "terminal_service"
            ? correctTestOrder.disposition.externalRemainder
            : undefined;
        const operationId =
          incomeLine && correctTestOrder
            ? startEncounterTestOperation(
                next,
                nextEncounter,
                incomeLine.id,
                context,
                {
                  version: "test-choice-order.v1",
                  purpose: "terminal",
                  caseId: correctTestOrder.caseId,
                  nodeId: correctTestOrder.nodeId,
                  questionVariantId: correctTestOrder.questionVariantId,
                  choiceId: correctTestOrder.choiceId,
                  choiceLabel: correctTestOrder.choiceLabel,
                  serviceId:
                    correctTestOrder.disposition.kind === "terminal_service"
                      ? correctTestOrder.disposition.serviceId
                      : terminalTestSelection.service.id,
                  routeId: terminalTestSelection.route.id,
                  routeDisplayName: terminalTestSelection.route.displayName,
                  externalRemainder: externalRemainder ?? null,
                },
              )
            : null;
        if (incomeLine && !operationId) {
          return rejectCommand(
            state,
            command,
            "The selected onsite test operation could not be scheduled.",
          );
        }
        const startedOnsite = operationId !== null;
        nextEncounter.terminalTestOrder = {
          version: "terminal-test-order.v1",
          caseId: correctTestOrder!.caseId,
          nodeId: correctTestOrder!.nodeId,
          questionVariantId: correctTestOrder!.questionVariantId,
          choiceId: correctTestOrder!.choiceId,
          choiceLabel: correctTestOrder!.choiceLabel,
          serviceId:
            correctTestOrder!.disposition.kind === "terminal_service"
              ? correctTestOrder!.disposition.serviceId
              : terminalTestSelection.service.id,
          routeId: terminalTestSelection.route.id,
          routeDisplayName: terminalTestSelection.route.displayName,
          externalRemainder: externalRemainder ?? null,
          status: startedOnsite ? "onsite_service" : "external_arranged",
          serviceOperationId: operationId,
          scheduledAtFacilityTick: next.facilityTick,
        };
        appendEvent(next, {
          id: `event.test-only-order.${nextEncounter.id}.${node.id}`,
          type: "clinical_decision_recorded",
          facilityTick: next.facilityTick,
          encounterId: nextEncounter.id,
          message: startedOnsite
            ? `${nextEncounter.patientDisplayName}: ${terminalTestSelection.route.displayName} ordered; the patient remains until collection or acquisition is complete.${externalRemainder ? ` ${externalRemainder}` : ""}`
            : `${nextEncounter.patientDisplayName}: ${terminalTestSelection.route.displayName} arranged outside the clinic; no clinic service fee was earned.`,
          priority: "informational",
          definitionId: startedOnsite
            ? "event.clinical.test-only-onsite-ordered"
            : "event.clinical.test-only-external-ordered",
          target: { kind: "encounter", id: nextEncounter.id },
        });
      }
    }
  } else if (diagnosticPlan && diagnostic) {
    const pending = createDiagnosticPendingResult(next, nextEncounter, node, diagnostic, diagnosticPlan);
    nextEncounter.pendingResult = pending;
    currentStep.result = clonePlain(pending);
    if (correctTestOrder?.disposition.kind === "test_only_continuation") {
      const source = diagnosticPlan.sources[0]!;
      nextEncounter.testOnlyContinuation = {
        diagnosticTiming: clonePlain(diagnosticPlan), version: "test-only-continuation.v1", originatingNodeIndex: nextEncounter.currentNodeIndex,
        serviceId: correctTestOrder.disposition.serviceId, routeId: pending.routeId, routeDisplayName: source.routeDisplayName,
        incomeLineId: source.routeId ? getServiceIncomeForRoute(source.routeId)?.id ?? null : null,
        externalRemainder: correctTestOrder.disposition.externalRemainder, status: "feedback_pending", serviceOperationId: null,
        scheduledAtFacilityTick: next.facilityTick, completedAtFacilityTick: null,
      };
    }
    if (correctTestOrder?.disposition.kind === "staged_result_gate" && diagnostic.request.components?.length) {
      nextEncounter.stagedResultOrder = {
        diagnosticTiming: clonePlain(diagnosticPlan), version: "staged-result-order.v1", originatingNodeIndex: nextEncounter.currentNodeIndex,
        caseId: correctTestOrder.caseId, nodeId: correctTestOrder.nodeId, questionVariantId: correctTestOrder.questionVariantId,
        choiceId: correctTestOrder.choiceId, choiceLabel: correctTestOrder.choiceLabel, status: "feedback_pending",
        remainderMode: correctTestOrder.disposition.remainderMode, currentComponentIndex: 0,
        components: diagnostic.request.components.flatMap((component) => {
          const source = diagnosticPlan.sources.find((entry) => entry.componentId === component.componentId);
          const input = correctTestOrder.disposition.kind === "staged_result_gate" ? correctTestOrder.disposition.components.find((entry) => entry.componentId === component.componentId) : null;
          const income = source?.routeId ? getServiceIncomeForRoute(source.routeId) : null;
          return source?.routeId && income && input ? [{
            componentId: component.componentId!, serviceId: input.serviceId, routeId: source.routeId, routeDisplayName: source.routeDisplayName,
            incomeLineId: income.id, quoteFee: source.quoteFee ?? income.fee,
            roomUpgradeRevenue: cloneRoomUpgradeRevenueQuote(source.roomUpgradeRevenue),
            roomUpgradeRecovery: cloneRoomUpgradeRecoveryQuote(source.roomUpgradeRecovery),
            operationPhases: source.operationPhases.map((phase) => ({
              id: phase.id, roomDefinitionId: phase.roomDefinitionId, durationMinutes: phase.durationMinutes,
              staffRoleDefinitionIds: [...phase.staffRoleDefinitionIds], providerRoleDefinitionIds: [...phase.providerRoleDefinitionIds],
              ...(phase.founderEligible ? { founderEligible: true as const } : {}),
              ...(phase.roomStationId === "periop_preparation" || phase.roomStationId === "periop_recovery" ? { roomStationId: phase.roomStationId } : {}),
            })), externalRemainder: input.externalRemainder, status: "pending" as const, serviceOperationId: null,
          }] : [];
        }), remainder: clonePlain(pending),
      };
    }
    currentStep.status = "feedback_pending";
    nextEncounter.lifecycle = "active_action_required";
    nextEncounter.idleWaitingSinceTick = null;
    nextEncounter.lastSatisfactionDecayAtTick = next.facilityTick;
  } else if (nextEncounter.stagedResultOrder?.status === "feedback_pending") {
    currentStep.status = "feedback_pending";
    nextEncounter.lifecycle = "active_action_required";
    nextEncounter.idleWaitingSinceTick = null;
    nextEncounter.lastSatisfactionDecayAtTick = next.facilityTick;
  } else if (scheduledResult) {
    if (!scheduledResult.localServiceOperation && !scheduledResult.resourceQueue && scheduledResult.phlebotomyArrivalGatedVersion === 1) {
      cancelRetailTripsForActor(
        next,
        "encounter",
        nextEncounter.id,
        "Clinical collection superseded optional shopping.",
      );
      if (scheduledResult.phlebotomistId) {
        cancelRetailTripsForActor(
          next,
          "employee",
          scheduledResult.phlebotomistId,
          "Clinical collection superseded optional shopping.",
        );
      }
    }
    if (
      !scheduledResult.localServiceOperation &&
      !scheduledResult.resourceQueue &&
      (!routeImagingTechnicianToScheduledService(next, context, scheduledResult) ||
        !routePhlebotomistToScheduledService(next, context, scheduledResult) ||
        (scheduledResult.approvedProcedureTimingVersion === 1 &&
          !routeProviderToScheduledService(next, context, scheduledResult)))
    ) {
      return rejectCommand(
        state,
        command,
        "The selected service team can no longer reach that service.",
      );
    }
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

  next.environment.pendingFounderConsult = null;
  releaseFounderAttendanceForEncounter(next, context, nextEncounter);

  if (diagnosticPlan && isFinalNode) advanceNewDiagnosticOrders(next, context);

  return recordReceipt(
    next,
    command,
    "applied",
    choice.isCorrect
      ? "Answer recorded as Good."
      : "Answer recorded as Again; review the correction before care continues.",
  );
}

function configureLegacyPendingResultTiming(
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
  let phaseStart = originReadyTick;
  pending.timingPhases = (pending.timingPhases ?? []).map((phase) => {
    const startsAtTick = phaseStart;
    const endsAtTick = startsAtTick + phase.durationTicks;
    phaseStart = endsAtTick;
    return { ...phase, startsAtTick, endsAtTick };
  });
  if (pending.patientRemainsOnsite) {
    pending.offsiteTravel = null;
    return true;
  }
  if (pending.patientTravel) {
    const frozenOrigin = state.rooms.find(
      (room) => room.id === pending.patientTravel?.originRoomInstanceId,
    );
    const expectedOriginDefinitionId = frozenOrigin?.roomDefinitionId ?? null;
    const originRoomCandidates = [
      encounter.queuedCareRoomInstanceId,
      encounter.patientMovement?.destinationRoomInstanceId ?? null,
      encounter.assignedRoomInstanceId,
      encounter.waitingDestination?.roomInstanceId ?? null,
    ].filter((roomId): roomId is string => roomId !== null);
    const actualOriginRoom =
      originRoomCandidates
        .map((roomId) => state.rooms.find((room) => room.id === roomId))
        .find(
          (room) =>
            room !== undefined &&
            (pending.resourceQueue !== undefined ||
              expectedOriginDefinitionId === null ||
              room.roomDefinitionId === expectedOriginDefinitionId),
        ) ??
      state.rooms.find((room) => {
        if (
          pending.resourceQueue === undefined &&
          expectedOriginDefinitionId !== null &&
          room.roomDefinitionId !== expectedOriginDefinitionId
        ) return false;
        const definition = getRoomDefinition(room.roomDefinitionId, context);
        return Boolean(
          definition &&
            getRoomNavigableTiles(room, definition, state.doors).some(
              (point) => point.x === origin.x && point.y === origin.y,
            ),
        );
      });
    if (!actualOriginRoom) return false;
    const outboundPath = pathFromLocationToRoom(
      state,
      context,
      origin,
      pending.patientTravel.destinationRoomInstanceId,
      new Set([pending.patientTravel.destinationRoomInstanceId]),
    );
    const destination = outboundPath.at(-1);
    const returnPath = destination
      ? facilityPath(state, context, destination, origin)
      : [];
    if (outboundPath.length === 0 || returnPath.length === 0) return false;
    const speed = context.balanceRelease.facility.characterTravelTilesPerTick;
    const outboundTicks = Math.ceil(Math.max(0, outboundPath.length - 1) / speed);
    const returnTicks = Math.ceil(Math.max(0, returnPath.length - 1) / speed);
    const minimumDurationTicks = outboundTicks + returnTicks;
    if (pending.durationTicks < minimumDurationTicks) {
      pending.durationTicks = minimumDurationTicks;
      pending.dueTick = originReadyTick + minimumDurationTicks;
    }
    pending.patientTravel.originRoomInstanceId = actualOriginRoom.id;
    pending.patientTravel.outboundPath = outboundPath.map((point) => ({ ...point }));
    pending.patientTravel.returnPath = returnPath.map((point) => ({ ...point }));
    pending.patientTravel.tilesPerTick = speed;
    pending.patientTravel.outboundStartTick = originReadyTick;
    pending.patientTravel.outboundArrivalTick = originReadyTick + outboundTicks;
    const finalResourcePhaseEnd = pending.timingPhases
      ?.filter((phase) => phase.resourceBound)
      .at(-1)?.endsAtTick;
    if (finalResourcePhaseEnd !== undefined) {
      if (pending.patientTravel.outboundArrivalTick > finalResourcePhaseEnd) return false;
      pending.patientTravel.serviceCompletionTick = pending.dueTick - returnTicks;
      if (pending.patientTravel.serviceCompletionTick < finalResourcePhaseEnd) return false;
    } else {
      pending.patientTravel.serviceCompletionTick = pending.dueTick - returnTicks;
      if (pending.patientTravel.serviceCompletionTick < pending.patientTravel.outboundArrivalTick) return false;
    }
    pending.patientTravel.returnArrivalTick = pending.dueTick;
    pending.offsiteTravel = null;
    return true;
  }
  const entrance = getPublicEntrance(state, context);
  if (!entrance) return false;
  const outboundPath = pathFromLocationToOffscreen(state, context, origin, encounter.id);
  const offscreenEndpoint = outboundPath.at(-1) ?? null;
  const returnPath = offscreenEndpoint
    ? pathFromOutsideToRoom(state, context, offscreenEndpoint, entrance.room.id)
    : [];
  if (!offscreenEndpoint || outboundPath.length === 0 || returnPath.length === 0) return false;
  const speed = context.balanceRelease.facility.characterTravelTilesPerTick;
  const outboundTicks = movementDuration(outboundPath, context);
  const returnTicks = movementDuration(returnPath, context);
  const minimumDurationTicks = outboundTicks + returnTicks;
  if (pending.durationTicks < minimumDurationTicks) {
    pending.durationTicks = minimumDurationTicks;
    pending.dueTick = originReadyTick + minimumDurationTicks;
  }
  const outboundArrivalTick = originReadyTick + outboundTicks;
  const returnStartTick = pending.dueTick - returnTicks;
  if (returnStartTick < outboundArrivalTick) return false;
  pending.offsiteTravel = {
    version: "offsite-patient-travel.v1",
    direction: offscreenEndpoint.x < entrance.outside.x ? -1 : 1,
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

function configurePendingResultTiming(
  state: GameState,
  context: DomainContext,
  encounter: EncounterState,
  pending: PendingResult,
  originReadyTick: number,
  origin: GridPoint,
): boolean {
  const finalizeOnsiteReturn = () => {
    if (!pending.onsiteReturn) return;
    pending.onsiteReturn.serviceCompletedAtTick =
      pending.timingPhases
        ?.filter((phase) => phase.resourceBound)
        .at(-1)?.endsAtTick ??
      pending.patientTravel?.serviceCompletionTick ??
      pending.dueTick;
  };
  if (pending.approvedProcedureTimingVersion !== 1 && pending.phlebotomyArrivalGatedVersion !== 1) {
    const configured = configureLegacyPendingResultTiming(
      state,
      context,
      encounter,
      pending,
      originReadyTick,
      origin,
    );
    if (configured) finalizeOnsiteReturn();
    return configured;
  }
  pending.scheduledAtTick = originReadyTick;
  pending.durationTicks = pending.serviceDurationTicks;
  pending.dueTick = originReadyTick + pending.serviceDurationTicks;
  const configurePhases = (startsAtTick: number) => {
    let phaseStart = startsAtTick;
    pending.timingPhases = (pending.timingPhases ?? []).map((phase) => {
      const phaseStartsAtTick = phaseStart;
      const endsAtTick = phaseStartsAtTick + phase.durationTicks;
      phaseStart = endsAtTick;
      return { ...phase, startsAtTick: phaseStartsAtTick, endsAtTick };
    });
    return phaseStart;
  };
  if (pending.patientRemainsOnsite) {
    pending.dueTick = configurePhases(originReadyTick);
    pending.durationTicks = pending.dueTick - originReadyTick;
    pending.offsiteTravel = null;
    finalizeOnsiteReturn();
    return true;
  }
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
      encounter.waitingDestination?.roomInstanceId ?? null,
    ].filter((roomId): roomId is string => roomId !== null);
    const actualOriginRoom =
      originRoomCandidates
        .map((roomId) =>
          state.rooms.find((room) => room.id === roomId),
        )
        .find(
          (room) =>
            room !== undefined &&
            (pending.resourceQueue !== undefined ||
              expectedOriginDefinitionId === null ||
              room.roomDefinitionId === expectedOriginDefinitionId),
        ) ??
      state.rooms.find((room) => {
        if (
          pending.resourceQueue === undefined &&
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
    const phlebotomyDestination = pending.phlebotomyArrivalGatedVersion === 1
      ? state.rooms.find((room) => room.id === pending.patientTravel?.destinationRoomInstanceId)
      : undefined;
    const phlebotomyDefinition = phlebotomyDestination
      ? getRoomDefinition(phlebotomyDestination.roomDefinitionId, context)
      : null;
    const outboundPath = phlebotomyDestination && phlebotomyDefinition
      ? facilityPath(
          state, context, origin,
          getRoomCareAnchor(phlebotomyDestination, phlebotomyDefinition, "patient"),
          new Set([phlebotomyDestination.id]),
        )
      : pathFromLocationToRoom(
          state,
          context,
          origin,
          pending.patientTravel.destinationRoomInstanceId,
          new Set([pending.patientTravel.destinationRoomInstanceId]),
        );
    const destination = outboundPath.at(-1);
    const waitingDestination = chooseWaitingDestination(state, context, encounter);
    const returnTarget = waitingDestination.reservation?.location ?? origin;
    const returnPath = destination
      ? facilityPath(state, context, destination, returnTarget)
      : [];
    if (outboundPath.length === 0 || returnPath.length === 0) {
      return false;
    }
    encounter.waitingDestination = waitingDestination.reservation;
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
    const remainingTravelTicks = (path: readonly GridPoint[], pathIndex: number) =>
      Math.ceil(Math.max(0, path.length - 1 - pathIndex) / speed);
    const imagingArrivalTick = pending.imagingTechnicianId
      ? (() => {
          const technician = state.employees.find(
            (employee) => employee.id === pending.imagingTechnicianId,
          );
          return technician
            ? state.facilityTick + remainingTravelTicks(technician.path, technician.pathIndex)
            : Number.POSITIVE_INFINITY;
        })()
      : originReadyTick;
    const providerArrivalTick = pending.providerReservation?.kind === "employee"
      ? (() => {
          const providerId = pending.providerReservation.kind === "employee"
            ? pending.providerReservation.employeeId
            : "";
          const provider = state.employees.find(
            (employee) => employee.id === providerId,
          );
          return provider
            ? state.facilityTick + remainingTravelTicks(provider.path, provider.pathIndex)
            : Number.POSITIVE_INFINITY;
        })()
      : pending.providerReservation?.kind === "founder"
        ? state.environment.founderActivity?.targetId === pending.operationId
          ? state.facilityTick + remainingTravelTicks(
              state.environment.founderActivity.path,
              state.environment.founderActivity.pathIndex,
            )
          : Number.POSITIVE_INFINITY
        : originReadyTick;
    const phlebotomistArrivalTick = pending.phlebotomyArrivalGatedVersion === 1 && pending.phlebotomistId
      ? (() => {
          const employee = state.employees.find((candidate) => candidate.id === pending.phlebotomistId);
          return employee
            ? state.facilityTick + remainingTravelTicks(employee.path, employee.pathIndex)
            : Number.POSITIVE_INFINITY;
        })()
      : originReadyTick;
    const workStartTick = Math.max(
      pending.patientTravel.outboundArrivalTick,
      imagingArrivalTick,
      providerArrivalTick,
      phlebotomistArrivalTick,
    );
    if (!Number.isFinite(workStartTick)) return false;
    const finalPhaseEnd = configurePhases(workStartTick);
    const finalResourcePhaseEnd = pending.timingPhases
      ?.filter((phase) => phase.resourceBound)
      .at(-1)?.endsAtTick;
    if (finalResourcePhaseEnd !== undefined) {
      pending.patientTravel.serviceCompletionTick = finalResourcePhaseEnd;
    } else {
      pending.patientTravel.serviceCompletionTick = finalPhaseEnd;
    }
    pending.patientTravel.returnArrivalTick =
      pending.patientTravel.serviceCompletionTick + returnTicks;
    pending.dueTick = Math.max(finalPhaseEnd, pending.patientTravel.returnArrivalTick);
    pending.durationTicks = pending.dueTick - originReadyTick;
    pending.offsiteTravel = null;
    finalizeOnsiteReturn();
    return true;
  }

  configurePhases(originReadyTick);

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
  finalizeOnsiteReturn();
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
  if (!pending || pending.diagnosticTiming || pending.deliveredAtTick !== null) {
    return;
  }
  if (pending.resourceQueue) return;
  if (
    pending.patientTravel &&
    encounter.patientMovement === null &&
    state.facilityTick >= pending.patientTravel.outboundStartTick &&
    state.facilityTick < pending.patientTravel.outboundArrivalTick &&
    frozenPathIsContiguous(pending.patientTravel.outboundPath)
  ) {
    const elapsedTiles = Math.max(
      0,
      state.facilityTick - pending.patientTravel.outboundStartTick,
    ) * Math.max(1, pending.patientTravel.tilesPerTick);
    const remainingPath = pending.patientTravel.outboundPath.slice(
      Math.min(pending.patientTravel.outboundPath.length - 1, elapsedTiles),
    );
    const returnDestination = encounter.waitingDestination;
    startPatientMovement(
      state,
      context,
      encounter,
      "walking_to_care",
      remainingPath,
      pending.patientTravel.destinationRoomInstanceId,
    );
    encounter.waitingDestination = returnDestination;
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

function frozenPathIsContiguous(path: readonly GridPoint[]): boolean {
  return path.every((point, index) => {
    if (index === 0) return true;
    const previous = path[index - 1]!;
    return Math.abs(point.x - previous.x) + Math.abs(point.y - previous.y) <= 1;
  });
}

function frozenPathEdgesAreRoutable(
  state: GameState,
  context: DomainContext,
  path: readonly GridPoint[],
  allowedRoomIds: ReadonlySet<string>,
): boolean {
  return path.every((point, index) => {
    if (index === 0) return true;
    const previous = path[index - 1]!;
    if (samePoint(previous, point)) return true;
    const edge = findCareAwareFacilityPath(
      state,
      context,
      previous,
      point,
      allowedRoomIds,
    );
    return edge.length === 2 && samePoint(edge[0]!, previous) && samePoint(edge[1]!, point);
  });
}

function alignedFrozenPath(
  current: GridPoint,
  continuation: readonly GridPoint[],
  elapsedTiles: number,
  totalTiles: number,
): GridPoint[] {
  const path = Array.from(
    { length: Math.max(0, elapsedTiles) + 1 },
    () => ({ ...current }),
  );
  path.push(...continuation.slice(1).map((point) => ({ ...point })));
  const endpoint = path.at(-1) ?? current;
  while (path.length < Math.max(path.length, totalTiles + 1)) {
    path.push({ ...endpoint });
  }
  return path;
}

function deferPendingForTravelDelay(
  pending: PendingResult,
  delay: number,
  thresholdTick: number,
): void {
  if (delay <= 0) return;
  pending.dueTick += delay;
  pending.durationTicks += delay;
  pending.timingPhases = pending.timingPhases?.map((phase) =>
    phase.startsAtTick >= thresholdTick
      ? {
          ...phase,
          startsAtTick: phase.startsAtTick + delay,
          endsAtTick: phase.endsAtTick + delay,
        }
      : phase,
  );
  if (
    pending.onsiteReturn?.serviceCompletedAtTick !== null &&
    pending.onsiteReturn?.serviceCompletedAtTick !== undefined &&
    pending.onsiteReturn.serviceCompletedAtTick >= thresholdTick
  ) {
    pending.onsiteReturn.serviceCompletedAtTick += delay;
  }
}

/**
 * Repairs only the active leg of an undelivered frozen itinerary. The frozen
 * clock is presentation state as well as scheduling state, so a repaired path
 * keeps an elapsed prefix at the pre-advance projected location. This prevents
 * a legacy save from jumping into an unrelated care room before the normal
 * tick movement runs.
 */
function reconcileFrozenPatientTravel(
  original: GameState,
  next: GameState,
  context: DomainContext,
): void {
  const preAdvanceTick = original.facilityTick;
  for (const encounter of Object.values(next.encounters)) {
    const originalPending = original.encounters[encounter.id]?.pendingResult;
    const originalTravel = originalPending?.patientTravel;
    const pending = encounter.pendingResult;
    const travel = pending?.patientTravel;
    if (
      !pending ||
      !travel ||
      !originalTravel ||
      pending.deliveredAtTick !== null ||
      originalPending?.deliveredAtTick !== null
    ) continue;
    if (pending.onsiteReturn) continue;

    const speed = Math.max(1, travel.tilesPerTick);
    const projected = getFrozenPatientTravelLocation(originalTravel, preAdvanceTick);
    if (!projected) continue;

    const outbound = preAdvanceTick < originalTravel.outboundArrivalTick;
    const inService = !outbound && preAdvanceTick < originalTravel.serviceCompletionTick;
    const sourcePath = outbound ? originalTravel.outboundPath : originalTravel.returnPath;
    const legStartTick = outbound
      ? originalTravel.outboundStartTick
      : originalTravel.serviceCompletionTick;
    const elapsedTiles = Math.max(0, preAdvanceTick - legStartTick) * speed;
    const sourceIndex = Math.min(sourcePath.length - 1, elapsedTiles);
    const intendedTarget = outbound
      ? (() => {
          const room = next.rooms.find(
            (candidate) => candidate.id === travel.destinationRoomInstanceId,
          );
          const frozenTarget = originalTravel.outboundPath.at(-1) ?? null;
          if (room && frozenTarget && pointInsideRoom(frozenTarget, room, context)) {
            return frozenTarget;
          }
          const definition = room
            ? getRoomDefinition(room.roomDefinitionId, context)
            : null;
          return room && definition
            ? getRoomCareAnchor(room, definition, "patient")
            : originalTravel.outboundPath.at(-1) ?? null;
        })()
      : (() => {
          const frozenTarget = originalTravel.returnPath.at(-1) ?? null;
          if (!frozenTarget) return null;
          if (!protectedCareRoomAtPoint(next, context, frozenTarget)) {
            return frozenTarget;
          }
          const entrance = getPublicEntrance(next, context);
          if (!entrance) return frozenTarget;
          travel.originRoomInstanceId = entrance.room.id;
          return entrance.inside;
        })();
    if (!intendedTarget) continue;

    const allowedRooms = outbound
      ? new Set([travel.destinationRoomInstanceId])
      : new Set<string>();
    const remaining = sourcePath.slice(sourceIndex);
    const availableContinuation = findCareAwareFacilityPath(
      next,
      context,
      projected,
      intendedTarget,
      allowedRooms,
    );
    const cachedLegIsSafe =
      availableContinuation.length > 0 &&
      frozenPathIsContiguous(remaining) &&
      frozenPathEdgesAreRoutable(next, context, remaining, allowedRooms) &&
      samePoint(remaining[0] ?? projected, projected) &&
      samePoint(remaining.at(-1) ?? projected, intendedTarget) &&
      !pathEntersUnauthorizedProtectedRoom(
        next,
        context,
        sourcePath,
        sourceIndex,
        allowedRooms,
      );
    const movementMatchesLeg = encounter.patientMovement && (
      (outbound && encounter.patientMovement.kind === "walking_to_care") ||
      (!outbound && !inService &&
        encounter.patientMovement.kind === "returning_from_onsite_service")
    );
    if (cachedLegIsSafe) {
      if (movementMatchesLeg) {
        encounter.patientLocation = { ...projected };
        encounter.patientMovement!.path = remaining.map((point) => ({ ...point }));
        encounter.patientMovement!.pathIndex = 0;
        encounter.patientMovement!.lastMovedAtFacilityTick = next.facilityTick;
      }
      continue;
    }

    const repaired = availableContinuation;
    const oldArrivalTick = outbound
      ? travel.outboundArrivalTick
      : travel.returnArrivalTick;
    const repairStartTick = inService
      ? originalTravel.serviceCompletionTick
      : preAdvanceTick;
    const requiredArrivalTick = repaired.length > 0
      ? repairStartTick + Math.ceil(Math.max(0, repaired.length - 1) / speed)
      : preAdvanceTick + 2;
    const newArrivalTick = Math.max(oldArrivalTick, requiredArrivalTick);
    const totalTiles = Math.max(0, newArrivalTick - legStartTick) * speed;
    const aligned = repaired.length > 0
      ? alignedFrozenPath(projected, repaired, elapsedTiles, totalTiles)
      : Array.from({ length: totalTiles + 1 }, (_, index) =>
          index === totalTiles ? { ...intendedTarget } : { ...projected },
        );

    if (outbound) {
      const delay = Math.max(0, newArrivalTick - travel.outboundArrivalTick);
      travel.outboundPath = aligned;
      travel.outboundArrivalTick = newArrivalTick;
      travel.serviceCompletionTick += delay;
      travel.returnArrivalTick += delay;
      deferPendingForTravelDelay(pending, delay, originalTravel.outboundArrivalTick);
    } else {
      const delay = Math.max(0, newArrivalTick - travel.returnArrivalTick);
      travel.returnPath = aligned;
      travel.returnArrivalTick = newArrivalTick;
      pending.dueTick = Math.max(pending.dueTick + delay, newArrivalTick);
      pending.durationTicks = Math.max(
        pending.durationTicks + delay,
        pending.dueTick - pending.scheduledAtTick,
      );
    }

    if (inService) continue;
    if (encounter.patientMovement) {
      encounter.patientLocation = { ...projected };
      if (repaired.length > 0) {
        encounter.patientMovement.path = repaired.map((point) => ({ ...point }));
        encounter.patientMovement.pathIndex = 0;
        encounter.patientMovement.lastMovedAtFacilityTick = next.facilityTick;
      } else {
        encounter.patientMovement = null;
      }
    }
  }
}

function maybeBeginOnsiteFrontDeskReturn(
  state: GameState,
  encounter: EncounterState,
  context: DomainContext,
): void {
  const pending = encounter.pendingResult;
  if (pending?.diagnosticTiming) return;
  const onsiteReturn = pending?.onsiteReturn;
  if (
    !pending ||
    pending.deliveredAtTick !== null ||
    !onsiteReturn ||
    onsiteReturn.status !== "awaiting_service_completion" ||
    onsiteReturn.serviceCompletedAtTick === null ||
    state.facilityTick < onsiteReturn.serviceCompletedAtTick ||
    encounter.patientMovement !== null
  ) {
    return;
  }
  const serviceLocation =
    pending.patientTravel?.outboundPath.at(-1) ??
    encounter.patientLocation;
  const entrance = getPublicEntrance(state, context);
  if (!serviceLocation || !entrance) return;
  encounter.patientLocation = { ...serviceLocation };
  releasePendingTestingCareReservation(encounter);
  releaseFounderAttendanceForEncounter(state, context, encounter);
  const path = pathFromLocationToRoom(
    state,
    context,
    serviceLocation,
    entrance.room.id,
  );
  if (path.length === 0) return;
  onsiteReturn.status = "walking_to_front_desk";
  startPatientMovement(
    state,
    context,
    encounter,
    "returning_from_onsite_service",
    path,
    entrance.room.id,
  );
}

function maybeBeginTestOnlyContinuationReturn(
  state: GameState,
  encounter: EncounterState,
  context: DomainContext,
): void {
  const continuation = encounter.testOnlyContinuation;
  if (continuation?.diagnosticTiming) return;
  if (
    continuation?.status !== "waiting_for_service" ||
    !continuation.serviceOperationId ||
    encounter.patientMovement !== null
  ) {
    return;
  }
  const operation = state.serviceOperations.find(
    (candidate) => candidate.id === continuation.serviceOperationId,
  );
  if (
    !operation ||
    (operation.status !== "completed" && operation.status !== "cancelled" && operation.status !== "discharging")
  ) {
    return;
  }
  const entrance = getPublicEntrance(state, context);
  if (!encounter.patientLocation || !entrance) return;
  const path = pathFromLocationToRoom(
    state,
    context,
    encounter.patientLocation,
    entrance.room.id,
  );
  if (path.length === 0) return;
  continuation.status = "returning_to_front_desk";
  startPatientMovement(
    state,
    context,
    encounter,
    "returning_from_onsite_service",
    path,
    entrance.room.id,
  );
}

function startCurrentStagedResultComponent(
  state: GameState,
  encounter: EncounterState,
  context: DomainContext,
): boolean {
  const order = encounter.stagedResultOrder;
  const component = order?.components[order.currentComponentIndex];
  if (!order || !component || component.status !== "pending") return false;
  const operationId = startEncounterTestOperation(
    state,
    encounter,
    component.incomeLineId,
    context,
    {
      version: "test-choice-order.v1",
      purpose: "staged_result_component",
      caseId: order.caseId,
      nodeId: order.nodeId,
      questionVariantId: order.questionVariantId,
      choiceId: order.choiceId,
      choiceLabel: order.choiceLabel,
      serviceId: component.serviceId,
      routeId: component.routeId,
      routeDisplayName: component.routeDisplayName,
      externalRemainder: component.externalRemainder,
      componentId: component.componentId,
    },
  );
  if (!operationId) return false;
  const operation = state.serviceOperations.find((candidate) => candidate.id === operationId);
  if (!operation) return false;
  operation.quoteFee = component.quoteFee;
  operation.roomUpgradeRevenue = cloneRoomUpgradeRevenueQuote(component.roomUpgradeRevenue);
  operation.frozenOperationPhases =
    getNewPeriopServiceOperationPhases(
      component.incomeLineId,
      component.operationPhases,
    ) ?? clonePlain(component.operationPhases);
  // The carrier already accepted these phases and has no original training quote.
  // Do not attach a newly-created factory contract with different IDs or terms.
  operation.trainingTiming = undefined;
  operation.roomUpgradeRecovery = cloneRoomUpgradeRecoveryQuote(component.roomUpgradeRecovery, operation.frozenOperationPhases);
  component.serviceOperationId = operationId;
  component.status = "waiting_for_service";
  order.status = "waiting_for_component";
  return true;
}

function startPendingResultServiceOperation(
  state: GameState,
  encounter: EncounterState,
  context: DomainContext,
): boolean {
  const pending = encounter.pendingResult;
  const link = pending?.localServiceOperation;
  const step = pending
    ? encounter.steps[pending.originatingNodeIndex]
    : undefined;
  if (!pending || !link || !step?.answer) return false;
  const choiceId = step.answer.answerChoiceId;
  const choiceLabel =
    encounter.frozenCase.decisionNodes[pending.originatingNodeIndex]
      ?.answerChoices.find((choice) => choice.id === choiceId)?.label ?? choiceId;
  const operationId = startEncounterTestOperation(
    state,
    encounter,
    link.incomeLineId,
    context,
    {
      version: "test-choice-order.v1",
      purpose: "result_gate",
      caseId: encounter.frozenCase.id,
      nodeId: step.decisionNodeId,
      questionVariantId: step.questionVariantId,
      choiceId,
      choiceLabel,
      serviceId: pending.resultTypeId,
      routeId: pending.routeId,
      routeDisplayName: pending.routeDisplayName,
      externalRemainder: pending.resultNarrative,
    },
  );
  if (!operationId) return false;
  const operation = state.serviceOperations.find(
    (candidate) => candidate.id === operationId,
  );
  if (!operation) return false;
  if (typeof pending.serviceIncomeFee === "number") {
    operation.quoteFee = pending.serviceIncomeFee;
  }
  operation.roomUpgradeRevenue = cloneRoomUpgradeRevenueQuote(pending.roomUpgradeRevenue);
  operation.roomUpgradeRecovery = cloneRoomUpgradeRecoveryQuote(pending.roomUpgradeRecovery, operation.frozenOperationPhases);
  link.serviceOperationId = operationId;
  link.status = "waiting_for_service";
  return true;
}

function synchronizePendingResultServiceOperation(
  state: GameState,
  encounter: EncounterState,
  context: DomainContext,
): void {
  const pending = encounter.pendingResult;
  if (pending?.diagnosticTiming) return;
  const link = pending?.localServiceOperation;
  if (!pending || !link || link.status !== "waiting_for_service") return;
  const operation = link.serviceOperationId
    ? state.serviceOperations.find((candidate) => candidate.id === link.serviceOperationId)
    : null;
  if (!operation || operation.status === "cancelled") {
    link.serviceOperationId = null;
    if (encounter.patientMovement === null) {
      startPendingResultServiceOperation(state, encounter, context);
    }
    return;
  }
  if ((operation.status !== "completed" && operation.status !== "discharging") || operation.completedAtFacilityTick === null) return;
  const completedAt = operation.completedAtFacilityTick;
  if (operation.completedCareProvenance) {
    pending.completedCareProvenance = {
      version: "completed-care-provenance.v1",
      serviceOperationId: operation.id,
      roomInstanceId: operation.completedCareProvenance.roomInstanceId,
      provider: operation.completedCareProvenance.provider
        ? { ...operation.completedCareProvenance.provider }
        : null,
    };
  }
  link.status = "external_processing";
  pending.scheduledAtTick = completedAt;
  pending.serviceDurationTicks = link.externalDurationTicks;
  pending.durationTicks = link.externalDurationTicks;
  pending.dueTick = completedAt + link.externalDurationTicks;
  let phaseStart = completedAt;
  pending.timingPhases = (pending.timingPhases ?? []).map((phase) => {
    const startsAtTick = phaseStart;
    const endsAtTick = startsAtTick + phase.durationTicks;
    phaseStart = endsAtTick;
    return { ...phase, startsAtTick, endsAtTick };
  });
  if (pending.onsiteReturn) {
    pending.onsiteReturn.status = "awaiting_service_completion";
    pending.onsiteReturn.serviceCompletedAtTick = completedAt;
  }
  maybeBeginOnsiteFrontDeskReturn(state, encounter, context);
}

function maybeBeginStagedResultReturn(
  state: GameState,
  encounter: EncounterState,
  context: DomainContext,
): void {
  const order = encounter.stagedResultOrder;
  if (order?.diagnosticTiming) return;
  const component = order?.components[order.currentComponentIndex];
  if (
    order?.status !== "waiting_for_component" ||
    component?.status !== "waiting_for_service" ||
    !component.serviceOperationId ||
    encounter.patientMovement !== null
  ) return;
  const operation = state.serviceOperations.find((candidate) => candidate.id === component.serviceOperationId);
    if (!operation || (operation.status !== "completed" && operation.status !== "cancelled" && operation.status !== "discharging")) return;
  const entrance = getPublicEntrance(state, context);
  if (!encounter.patientLocation || !entrance) return;
  const path = pathFromLocationToRoom(state, context, encounter.patientLocation, entrance.room.id);
  if (path.length === 0) return;
  component.status = operation.status === "cancelled" ? "cancelled" : "returning_to_front_desk";
  order.status = "returning_to_front_desk";
  startPatientMovement(state, context, encounter, "returning_from_onsite_service", path, entrance.room.id);
}

function completeStagedResultComponentAtFrontDesk(
  state: GameState,
  encounter: EncounterState,
  context: DomainContext,
): boolean {
  const order = encounter.stagedResultOrder;
  const component = order?.components[order.currentComponentIndex];
  if (order?.status !== "returning_to_front_desk" || !component) return false;
  if (component.status !== "cancelled") component.status = "completed";
  const nextIndex = order.currentComponentIndex + 1;
  if (nextIndex < order.components.length) {
    order.currentComponentIndex = nextIndex;
    order.components[nextIndex]!.status = "pending";
    if (!startCurrentStagedResultComponent(state, encounter, context)) {
      order.components[nextIndex]!.status = "cancelled";
      order.status = "returning_to_front_desk";
      return completeStagedResultComponentAtFrontDesk(state, encounter, context);
    }
    return true;
  }
  const pending = order.remainder;
  pending.scheduledAtTick = state.facilityTick;
  pending.durationTicks = pending.serviceDurationTicks;
  pending.dueTick = state.facilityTick + pending.serviceDurationTicks;
  pending.deliveredAtTick = null;
  pending.offsiteReturnStartedAtTick = null;
  pending.offsiteTravel = null;
  pending.patientTravel = null;
  if (order.remainderMode === "external_processing") {
    pending.externalProcessingOnly = true;
    pending.patientRemainsOnsite = true;
    pending.pendingLabel = `${component.externalRemainder} External processing pending`;
  }
  let phaseStart = state.facilityTick;
  pending.timingPhases = (pending.timingPhases ?? []).map((phase) => {
    const startsAtTick = phaseStart;
    const endsAtTick = startsAtTick + phase.durationTicks;
    phaseStart = endsAtTick;
    return { ...phase, startsAtTick, endsAtTick };
  });
  order.status = "remainder_pending";
  encounter.pendingResult = clonePlain(pending);
  const step = encounter.steps[order.originatingNodeIndex];
  if (step) step.result = clonePlain(pending);
  encounter.lifecycle = "active_pending_result";
  encounter.idleWaitingSinceTick = null;
  return true;
}

function completeTestOnlyContinuationAtFrontDesk(
  state: GameState,
  encounter: EncounterState,
): boolean {
  const continuation = encounter.testOnlyContinuation;
  if (
    continuation?.status !== "returning_to_front_desk" ||
    !continuation.serviceOperationId
  ) {
    return false;
  }
  const operation = state.serviceOperations.find(
    (candidate) => candidate.id === continuation.serviceOperationId,
  );
  const completedLocally = operation?.status === "completed";
  continuation.status = completedLocally ? "completed" : "external_arranged";
  continuation.completedAtFacilityTick = state.facilityTick;
  const step = encounter.steps[encounter.currentNodeIndex];
  if (
    !step ||
    step.nodeIndex !== continuation.originatingNodeIndex ||
    step.status !== "result_pending"
  ) {
    return true;
  }
  step.status = "completed";
  encounter.currentNodeIndex += 1;
  const nextStep = encounter.steps[encounter.currentNodeIndex];
  if (nextStep) nextStep.status = "action_required";
  encounter.lifecycle = "active_action_required";
  encounter.idleWaitingSinceTick = state.facilityTick;
  encounter.lastSatisfactionDecayAtTick = state.facilityTick;
  beginPatientFeedAttention(encounter, "clinical_decision", state.facilityTick);
  if (!completedLocally) {
    appendEvent(state, {
      id: `event.test-only-continuation-external.${encounter.id}.${continuation.originatingNodeIndex}`,
      type: "clinical_decision_recorded",
      facilityTick: state.facilityTick,
      encounterId: encounter.id,
      message: `${encounter.patientDisplayName}: local collection could not be completed; the remaining order was arranged outside the clinic.`,
      priority: "informational",
      definitionId: "event.clinical.test-only-continuation-external",
      target: { kind: "encounter", id: encounter.id },
    });
  }
  return true;
}

function interruptedContinuationExternalDuration(
  context: DomainContext,
  continuation: NonNullable<EncounterState["testOnlyContinuation"]>,
): number {
  const service = context.balanceRelease.services.find((candidate) =>
    candidate.id === continuation.serviceId);
  const external = service?.routes.find((route) =>
    route.id !== continuation.routeId &&
    route.requiredCapabilityId === null &&
    route.requiredCapabilityIds.length === 0 &&
    route.resourceRequirements.length === 0 &&
    route.providerRequirement === null);
  return external?.durationTicks ?? 0;
}

function advanceSaleInterruptedContinuation(
  state: GameState,
  encounter: EncounterState,
  context: DomainContext,
): void {
  const continuation = encounter.testOnlyContinuation;
  const travel = continuation?.saleInterruptedOffsite;
  if (!continuation || !travel || encounter.patientMovement !== null) return;
  if (travel.readyAtFacilityTick === null) {
    if (!encounter.patientLocation) return;
    const endpoint = getEncounterArrivalStart(state, context, encounter.id);
    const entrance = getPublicEntrance(state, context);
    if (!endpoint || !entrance) return;
    const outbound = pathFromLocationToOffscreen(state, context, encounter.patientLocation, encounter.id);
    const returnPath = pathFromOutsideToRoom(state, context, endpoint, entrance.room.id);
    if (outbound.length === 0 || returnPath.length === 0) return;
    travel.offscreenEndpoint = { ...endpoint };
    travel.returnPath = returnPath.map((point) => ({ ...point }));
    travel.readyAtFacilityTick = state.facilityTick + movementDuration(outbound, context) +
      interruptedContinuationExternalDuration(context, continuation);
    startPatientMovement(state, context, encounter, "departing_for_offsite_testing", outbound, null);
    return;
  }
  if (encounter.patientLocation === null && state.facilityTick >= travel.readyAtFacilityTick &&
      travel.returnPath.length > 0) {
    const entrance = getPublicEntrance(state, context);
    startPatientMovement(
      state,
      context,
      encounter,
      "returning_from_offsite_testing",
      travel.returnPath,
      entrance?.room.id ?? null,
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
    pending.resourceQueue !== undefined ||
    pending.patientRemainsOnsite ||
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
  if (nextEncounter.pendingResult?.diagnosticTiming && nextEncounter.pendingResult.originatingNodeIndex === nextEncounter.currentNodeIndex) {
    prepareNewDiagnosticPatient(next, nextEncounter);
    nextStep.status = "result_pending";
    nextEncounter.lifecycle = "active_pending_result";
    nextEncounter.idleWaitingSinceTick = null;
    nextEncounter.lastSatisfactionDecayAtTick = next.facilityTick;
    if (nextEncounter.stagedResultOrder?.diagnosticTiming?.orderId === nextEncounter.pendingResult.diagnosticTiming.orderId) {
      nextEncounter.stagedResultOrder.status = "waiting_for_component";
    }
    if (nextEncounter.testOnlyContinuation?.diagnosticTiming?.orderId === nextEncounter.pendingResult.diagnosticTiming.orderId) {
      nextEncounter.testOnlyContinuation.status = "waiting_for_service";
    }
    releaseFounderAttendanceForEncounter(next, context, nextEncounter);
    if (next.openChartEncounterId === nextEncounter.id) next.openChartEncounterId = null;
    if (next.attendedEncounterId === nextEncounter.id) next.attendedEncounterId = null;
    advanceNewDiagnosticOrders(next, context);
    nextStep.result = clonePlain(nextEncounter.pendingResult);
    return recordReceipt(next, command, "applied", "Feedback reviewed; the ordered diagnostic work is now underway.");
  }
  const staged = nextEncounter.stagedResultOrder;
  if (
    staged?.status === "feedback_pending" &&
    staged.originatingNodeIndex === nextEncounter.currentNodeIndex
  ) {
    if (!startCurrentStagedResultComponent(next, nextEncounter, context)) {
      return rejectCommand(state, command, "The selected local test component could not be scheduled.");
    }
    nextStep.status = "result_pending";
    nextEncounter.lifecycle = "active_pending_result";
    nextEncounter.idleWaitingSinceTick = null;
    releasePendingTestingCareReservation(nextEncounter);
    releaseFounderAttendanceForEncounter(next, context, nextEncounter);
    if (next.openChartEncounterId === nextEncounter.id) next.openChartEncounterId = null;
    if (next.attendedEncounterId === nextEncounter.id) next.attendedEncounterId = null;
    return recordReceipt(next, command, "applied", "Feedback reviewed; supported local test components are in progress before the external remainder.");
  }
  const continuation = nextEncounter.testOnlyContinuation;
  if (
    continuation?.status === "feedback_pending" &&
    continuation.originatingNodeIndex === nextEncounter.currentNodeIndex
  ) {
    if (continuation.incomeLineId) {
      const answerChoiceId = nextStep.answer!.answerChoiceId;
      const operationId = startEncounterTestOperation(
        next,
        nextEncounter,
        continuation.incomeLineId,
        context,
        {
          version: "test-choice-order.v1",
          purpose: "continuation",
          caseId: nextEncounter.frozenCase.id,
          nodeId: nextStep.decisionNodeId,
          questionVariantId: nextStep.questionVariantId,
          choiceId: answerChoiceId,
          choiceLabel:
            nextEncounter.frozenCase.decisionNodes[nextEncounter.currentNodeIndex]?.answerChoices.find(
              (candidate) => candidate.id === answerChoiceId,
            )?.label ?? answerChoiceId,
          serviceId: continuation.serviceId,
          routeId: continuation.routeId,
          routeDisplayName: continuation.routeDisplayName,
          externalRemainder: continuation.externalRemainder,
        },
      );
      if (!operationId) {
        return rejectCommand(
          state,
          command,
          "The selected collection team can no longer accept this order.",
        );
      }
      const operation = next.serviceOperations.find(
        (candidate) => candidate.id === operationId,
      );
      if (!operation) {
        return rejectCommand(state, command, "The collection order could not be created.");
      }
      if (continuation.quoteFee !== undefined) operation.quoteFee = continuation.quoteFee;
      operation.roomUpgradeRevenue = cloneRoomUpgradeRevenueQuote(continuation.roomUpgradeRevenue);
      operation.roomUpgradeRecovery = cloneRoomUpgradeRecoveryQuote(continuation.roomUpgradeRecovery, operation.frozenOperationPhases);
      continuation.status = "waiting_for_service";
      continuation.serviceOperationId = operation.id;
      nextStep.status = "result_pending";
      nextEncounter.lifecycle = "active_pending_result";
      nextEncounter.idleWaitingSinceTick = null;
      releasePendingTestingCareReservation(nextEncounter);
      releaseFounderAttendanceForEncounter(next, context, nextEncounter);
      if (next.openChartEncounterId === nextEncounter.id) next.openChartEncounterId = null;
      if (next.attendedEncounterId === nextEncounter.id) next.attendedEncounterId = null;
      appendEvent(next, {
        id: `event.test-only-continuation.${nextEncounter.id}.${nextStep.decisionNodeId}`,
        type: "clinical_decision_recorded",
        facilityTick: next.facilityTick,
        encounterId: nextEncounter.id,
        message: `${nextEncounter.patientDisplayName}: ${continuation.routeDisplayName} ordered. ${continuation.externalRemainder}`,
        priority: "informational",
        definitionId: "event.clinical.test-only-continuation-ordered",
        target: { kind: "encounter", id: nextEncounter.id },
      });
      return recordReceipt(
        next,
        command,
        "applied",
        "Feedback reviewed; the patient is completing the local test component.",
      );
    }
    continuation.status = "external_arranged";
    continuation.completedAtFacilityTick = next.facilityTick;
    appendEvent(next, {
      id: `event.test-only-continuation.${nextEncounter.id}.${nextStep.decisionNodeId}`,
      type: "clinical_decision_recorded",
      facilityTick: next.facilityTick,
      encounterId: nextEncounter.id,
      message: `${nextEncounter.patientDisplayName}: ${continuation.routeDisplayName} arranged outside the clinic. ${continuation.externalRemainder}`,
      priority: "informational",
      definitionId: "event.clinical.test-only-continuation-external",
      target: { kind: "encounter", id: nextEncounter.id },
    });
  }
  if (
    nextEncounter.pendingResult &&
    nextEncounter.pendingResult.originatingNodeIndex ===
      nextEncounter.currentNodeIndex
  ) {
    if (nextEncounter.pendingResult.localServiceOperation) {
      if (!startPendingResultServiceOperation(next, nextEncounter, context)) {
        return rejectCommand(
          state,
          command,
          "The selected perioperative service can no longer be scheduled.",
        );
      }
      releasePendingTestingCareReservation(nextEncounter);
      releaseFounderAttendanceForEncounter(next, context, nextEncounter);
      nextStep.result = clonePlain(nextEncounter.pendingResult);
      nextStep.status = "result_pending";
      nextEncounter.lifecycle = "active_pending_result";
      nextEncounter.idleWaitingSinceTick = null;
      nextEncounter.lastSatisfactionDecayAtTick = next.facilityTick;
      if (next.openChartEncounterId === nextEncounter.id) next.openChartEncounterId = null;
      if (next.attendedEncounterId === nextEncounter.id) next.attendedEncounterId = null;
      return recordReceipt(
        next,
        command,
        "applied",
        "Feedback reviewed; perioperative preparation is now underway.",
      );
    }
    if (nextEncounter.pendingResult.resourceQueue) {
      const destination = chooseWaitingDestination(next, context, nextEncounter);
      nextEncounter.waitingDestination = destination.reservation;
      if (destination.path.length > 0) {
        startPatientMovement(
          next,
          context,
          nextEncounter,
          "walking_to_waiting",
          destination.path,
          destination.roomId,
        );
      }
      releasePendingTestingCareReservation(nextEncounter);
      releaseFounderAttendanceForEncounter(next, context, nextEncounter);
      nextStep.result = clonePlain(nextEncounter.pendingResult);
      nextStep.status = "result_pending";
      nextEncounter.lifecycle = "active_pending_result";
      nextEncounter.idleWaitingSinceTick = null;
      nextEncounter.lastSatisfactionDecayAtTick = next.facilityTick;
      if (next.openChartEncounterId === nextEncounter.id) next.openChartEncounterId = null;
      if (next.attendedEncounterId === nextEncounter.id) next.attendedEncounterId = null;
      return recordReceipt(
        next,
        command,
        "applied",
        "Feedback reviewed; the patient is waiting for the onsite service team.",
      );
    }
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
    // Travel routes release the examination while their frozen journey runs.
    // Stationary bedside services keep the current care reservation until the
    // short service completes and the next decision becomes available.
    if (!nextEncounter.pendingResult.patientRemainsOnsite) {
      releasePendingTestingCareReservation(nextEncounter);
      releaseFounderAttendanceForEncounter(next, context, nextEncounter);
    }
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

  const activeEmployeeDiscussionConceptIds = new Set(
    Object.values(getEmployeeDiscussions(state))
      .filter(
        (discussion) =>
          discussion.lifecycle !== "resolved" &&
          discussion.lifecycle !== "cancelled",
      )
      .flatMap((discussion) =>
        discussion.frozenCase.decisionNodes.map(
          (node) => node.primaryConceptId,
        ),
      ),
  );
  const eligibleCases = context.clinicalRelease.cases
    .filter(
      (clinicalCase) =>
        !isEmployeeDiscussionCase(clinicalCase) &&
        clinicalCase.routineEligible &&
        clinicalCase.earliestFacilityStage <= state.facilityLevel &&
        clinicalCase.decisionNodes.every(
          (node) =>
            !activeEmployeeDiscussionConceptIds.has(node.primaryConceptId),
        ) &&
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
      for (const employee of quittingEmployees) cancelEmployeeTrainingForDismissal(state, employee.id);
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
        x:
          frontRoom.x +
          Math.max(
            0,
            getRotatedFootprint(definition, frontRoom.orientation).width - 1,
          ),
        y: frontRoom.y,
      }
    : state.environment.founderLocation;
}

function canReachCurrentWaterCooler(
  state: GameState,
  context: DomainContext,
  from: GridPoint,
): boolean {
  const approach = getWaterCoolerApproachLocation(state, context);
  if (!approach) return false;
  return findCareAwareFacilityPath(state, context, from, approach).length > 0;
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

  const candidates = getReachableLitterCandidates(state, context);
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

type ReachableLitterCandidate = {
  roomId: string;
  location: GridPoint;
  founderPathLength: number;
};

function getReachableLitterCandidates(
  state: GameState,
  context: DomainContext,
  excludedLitterId: string | null = null,
): ReachableLitterCandidate[] {
  const blocked = new Set<string>([
    `${state.environment.founderLocation.x},${state.environment.founderLocation.y}`,
    ...state.environment.litterItems
      .filter((item) => item.id !== excludedLitterId)
      .map((item) => `${item.location.x},${item.location.y}`),
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

  return state.rooms
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
    .filter(({ location }) => !blocked.has(`${location.x},${location.y}`))
    .flatMap(({ roomId, location }) => {
      const path = pathFromLocationToFacilityPoint(
        state,
        context,
        state.environment.founderLocation,
        location,
        new Set(),
      );
      return path.length > 0
        ? [{ roomId, location, founderPathLength: path.length }]
        : [];
    })
    .sort(
      (left, right) =>
        left.roomId.localeCompare(right.roomId) ||
        left.location.y - right.location.y ||
        left.location.x - right.location.x,
    );
}

function litterCleanupTargetIds(state: GameState): Set<string> {
  return new Set([
    ...(state.environment.founderActivity?.kind === "collect_litter"
      ? [state.environment.founderActivity.targetId]
      : []),
    ...state.employees.flatMap((employee) => {
      const task = employee.facilityTask;
      return task?.kind === "collect_litter" && task.targetId
        ? [task.targetId]
        : [];
    }),
  ]);
}

function manhattanDistance(left: GridPoint, right: GridPoint): number {
  return Math.abs(left.x - right.x) + Math.abs(left.y - right.y);
}

function reconcileInaccessibleLitter(
  state: GameState,
  context: DomainContext,
): void {
  const targeted = litterCleanupTargetIds(state);
  for (const litter of [...state.environment.litterItems].sort(
    (left, right) =>
      left.spawnedAtFacilityTick - right.spawnedAtFacilityTick ||
      left.id.localeCompare(right.id),
  )) {
    if (targeted.has(litter.id)) continue;
    const currentPath = pathFromLocationToFacilityPoint(
      state,
      context,
      state.environment.founderLocation,
      litter.location,
      new Set(),
    );
    if (currentPath.length > 0) continue;
    const candidates = getReachableLitterCandidates(state, context, litter.id);
    const sameRoom = candidates.filter(
      (candidate) => candidate.roomId === litter.roomId,
    );
    const ranked = (sameRoom.length > 0 ? sameRoom : candidates).sort(
      (left, right) =>
        manhattanDistance(left.location, litter.location) -
          manhattanDistance(right.location, litter.location) ||
        left.founderPathLength - right.founderPathLength ||
        left.roomId.localeCompare(right.roomId) ||
        left.location.y - right.location.y ||
        left.location.x - right.location.x,
    );
    const destination = ranked[0];
    if (!destination) continue;
    litter.roomId = destination.roomId;
    litter.location = { ...destination.location };
  }
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
    environment.founderActivity?.kind === "refill_water" ||
    state.employees.some(
      (employee) => employee.facilityTask?.kind === "refill_water",
    )
  ) {
    return;
  }
  if (hasFrontDeskPatientPriority(state)) return;
  const receptionist = state.employees
    .filter(
      (employee) =>
        employee.staffRoleDefinitionId === "staff.receptionist" &&
        !employee.facilityTask &&
        !isEmployeeAwayForTraining(employee) &&
        !(
          environment.founderActivity?.kind === "praise_employee" &&
          environment.founderActivity.targetId === employee.id
        ) &&
        isEmployeeAssignedToOperationalRoom(state, employee.id, context),
    )
    .sort(
      (left, right) =>
        left.hiredAtFacilityTick - right.hiredAtFacilityTick ||
        left.id.localeCompare(right.id),
    )[0];
  if (!receptionist) {
    return;
  }

  const approach = getWaterCoolerApproachLocation(state, context);
  if (!approach) return;
  const path = findCareAwareFacilityPath(state, context, receptionist.location, approach);
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

function hasFrontDeskPatientPriority(state: GameState): boolean {
  return Object.values(state.encounters).some(
    (encounter) =>
      encounter.resolutionReason === null &&
      (encounter.checkInStatus === "approaching" ||
        encounter.checkInStatus === "awaiting_staff" ||
        encounter.patientMovement?.kind === "returning_from_offsite_testing"),
  );
}

function prioritizeReceptionistPatients(
  state: GameState,
  context: DomainContext,
): void {
  if (!hasFrontDeskPatientPriority(state)) return;
  const entrance = getPublicEntrance(state, context);
  const definition = entrance
    ? getRoomDefinition(entrance.room.roomDefinitionId, context)
    : null;
  for (const employee of state.employees) {
    if (
      employee.staffRoleDefinitionId !== "staff.receptionist" ||
      employee.facilityTask?.kind !== "refill_water"
    ) continue;
    employee.facilityTask = null;
    if (!entrance || !definition) {
      employee.path = [{ ...employee.location }];
      employee.pathIndex = 0;
      continue;
    }
    const desk = getRoomNavigationAnchor(entrance.room, definition, "staff");
    const path = findCareAwareFacilityPath(state, context, employee.location, desk);
    if (path.length === 0) {
      employee.path = [{ ...employee.location }];
      employee.pathIndex = 0;
      continue;
    }
    employee.path = path;
    employee.pathIndex = 0;
    employee.lastMovedAtFacilityTick = state.facilityTick;
  }
}

function advanceEmployeeFacilityTasks(
  state: GameState,
  context: DomainContext,
  mode: "non_refill" | "refill_only" = "non_refill",
): void {
  for (const employee of state.employees) {
    const task = employee.facilityTask;
    if (!task) {
      continue;
    }
    // Level-three support owns these work clocks and their completion effects.
    if (task.kind === "take_break" || task.kind === "repair_room" || task.kind === "review_ambulatory_qi") continue;
    if (
      (mode === "non_refill" && task.kind === "refill_water") ||
      (mode === "refill_only" && task.kind !== "refill_water")
    ) continue;
    if (employee.pathIndex < employee.path.length - 1) {
      continue;
    }
    const endpoint = employee.path.at(-1);
    if ((task.kind === "collect_litter" || task.kind === "clean_room") &&
      (!endpoint || employee.location.x !== endpoint.x || employee.location.y !== endpoint.y)) continue;

    if (task.kind === "perform_imaging") {
      const stillReserved = Object.values(state.encounters).some(
        (encounter) => {
          const pending = encounter.pendingResult;
          return Boolean(
            pending &&
              pending.operationId === task.targetId &&
              pending.imagingTechnicianId === employee.id &&
              pending.deliveredAtTick === null &&
              (encounter.steps[pending.originatingNodeIndex]?.status ===
                "feedback_pending" ||
                !(pending.timingPhases?.length) ||
                pending.timingPhases.some(
                  (phase) =>
                    phase.resourceBound && state.facilityTick < phase.endsAtTick,
                )),
          );
        },
      );
      if (stillReserved) {
        continue;
      }
      employee.facilityTask = null;
      employee.nextIdleActionAtFacilityTick = getNextIdleActionTick(
        state,
        context,
        employee.id,
      );
      continue;
    }
    if (task.kind === "perform_service") {
      const stillReservedByOperation = state.serviceOperations.some(
        (operation) =>
          operation.id === task.targetId &&
          operation.status !== "completed" &&
          operation.status !== "cancelled",
      );
      const stillReservedByPendingResult = Object.values(state.encounters).some(
        (encounter) => {
          const pending = encounter.pendingResult;
          return Boolean(
            pending &&
              pending.operationId === task.targetId &&
              ((pending.providerReservation?.kind === "employee" &&
                pending.providerReservation.employeeId === employee.id) ||
                (pending.phlebotomyArrivalGatedVersion === 1 &&
                  pending.phlebotomistId === employee.id)) &&
              pending.deliveredAtTick === null &&
              (encounter.steps[pending.originatingNodeIndex]?.status === "feedback_pending" ||
                !(pending.timingPhases?.length) ||
                pending.timingPhases.some(
                  (phase) => phase.resourceBound && state.facilityTick < phase.endsAtTick,
                )),
          );
        },
      );
      if (stillReservedByOperation || stillReservedByPendingResult) continue;
      employee.facilityTask = null;
      continue;
    }
    if (task.kind === "participate_qi_discussion") {
      continue;
    }

    task.workMinutesRemaining -= 1;
    if (task.workMinutesRemaining > 0) {
      continue;
    }

    if (
      task.kind === "refill_water" &&
      state.environment.waterCoolerFillPercent <= 0 &&
      !hasFrontDeskPatientPriority(state) &&
      canReachCurrentWaterCooler(state, context, employee.location)
    ) {
      state.environment.waterCoolerFillPercent = 100;
      addWaitingPatientSatisfaction(
        state,
        context.balanceRelease.environment
          .waterRefillSatisfactionBonus,
      );
    } else if (task.kind === "collect_litter") {
      const litter = state.environment.litterItems.find(
        (item) => item.id === task.targetId,
      );
      if (litter) {
        state.environment.litterItems = state.environment.litterItems.filter((item) => item.id !== litter.id);
        const room = state.rooms.find(
          (candidate) => candidate.id === litter.roomId,
        );
        if (room) {
          room.cleanliness = clamp(
            (room.cleanliness ?? 100) +
              context.balanceRelease.environment.litterCleanupRestore,
            0,
            100,
          );
        }
        state.environment.lastLitterCleanupAtTick = state.facilityTick;
      }
    } else if (task.kind === "clean_room") {
      const room = state.rooms.find((candidate) => candidate.id === task.targetId);
      if (room) {
        room.cleanliness = clamp(
          (room.cleanliness ?? 100) +
            (task.cleanlinessRestore ?? context.balanceRelease.environment.evsRoomCleanlinessRestore),
          0,
          100,
        );
      }
      state.environment.lastEvsRoomCleanupAtTick = state.facilityTick;
    }
    employee.facilityTask = null;
    employee.nextIdleActionAtFacilityTick = getNextIdleActionTick(
      state,
      context,
      employee.id,
    );
  }
}

function maybeAssignEvsTasks(state: GameState, context: DomainContext): void {
  if (!getCurrentCapabilities(state, context).has("capability.staff.evs_worker")) {
    return;
  }
  const workers = state.employees
    .filter(
      (employee) =>
        employee.staffRoleDefinitionId === "staff.evs_worker" &&
        isEmployeeAssignedToOperationalRoom(state, employee.id, context) &&
        !employee.facilityTask &&
        !isEmployeeAwayForTraining(employee) &&
        employee.pathIndex >= employee.path.length - 1,
    )
    .sort((left, right) => left.id.localeCompare(right.id));
  const targeted = new Set(
    state.employees.flatMap((employee) =>
      (employee.facilityTask?.kind === "collect_litter" ||
        employee.facilityTask?.kind === "clean_room") &&
      employee.facilityTask.targetId
        ? [employee.facilityTask.targetId]
        : [],
    ),
  );
  const litter = state.environment.litterItems
    .filter((item) => !targeted.has(item.id))
    .sort(
      (left, right) =>
        left.spawnedAtFacilityTick - right.spawnedAtFacilityTick ||
        left.id.localeCompare(right.id),
    );
  const config = context.balanceRelease.environment;
  for (const worker of workers) {
    const roomCandidates =
      state.environment.lastEvsRoomCleanupAtTick !== null &&
      state.facilityTick - state.environment.lastEvsRoomCleanupAtTick <
        config.evsRoomCleanupCooldownMinutes
        ? []
        : state.rooms
            .filter(
              (room) =>
                !targeted.has(room.id) &&
                isRoomOperationalForFacilityWork(state, room.id, context) &&
                (room.cleanliness ?? 100) < config.evsRoomCleanlinessThreshold,
            )
            .sort(
              (left, right) =>
                (left.cleanliness ?? 100) - (right.cleanliness ?? 100) ||
                left.id.localeCompare(right.id),
            );
    const candidates = [...litter, ...roomCandidates];
    const selected = candidates
      .map((target) => {
        const location =
          "spawnedAtFacilityTick" in target
            ? target.location
            : getRoomNavigationAnchor(
                target,
                getRoomDefinition(target.roomDefinitionId, context)!,
              );
        return {
          target,
          path: findCareAwareFacilityPath(
            state,
            context,
            worker.location,
            location,
            new Set([
              "spawnedAtFacilityTick" in target ? target.roomId : target.id,
            ]),
          ),
        };
      })
      .find(({ path }) => path.length > 0);
    if (!selected) continue;
    worker.path = selected.path;
    worker.pathIndex = 0;
    worker.lastMovedAtFacilityTick = state.facilityTick;
    const baselineMinutes = "spawnedAtFacilityTick" in selected.target ? config.founderInteractionMinutes : config.evsRoomCleanupMinutes;
    const roomUpgradeWork = createEmployeeRoomUpgradeSupportWork(state, worker, "cleaning_duration_reduction_percent", baselineMinutes, 0, context);
    worker.facilityTask = {
      kind:
        "spawnedAtFacilityTick" in selected.target
          ? "collect_litter"
          : "clean_room",
      targetId: selected.target.id,
      startedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: roomUpgradeWork?.durationMinutes ?? baselineMinutes,
      ...(roomUpgradeWork ? { roomUpgradeWork } : {}),
      ...("spawnedAtFacilityTick" in selected.target ? {} : {
        cleanlinessRestore: config.evsRoomCleanlinessRestore * (1 + getEmployeeRoleTrainingPercent(state, "staff.evs_worker") / 100),
      }),
    };
    if ("spawnedAtFacilityTick" in selected.target) {
      targeted.add(selected.target.id);
      const selectedIndex = litter.findIndex(
        (item) => item.id === selected.target.id,
      );
      if (selectedIndex >= 0) litter.splice(selectedIndex, 1);
    } else {
      targeted.add(selected.target.id);
    }
  }
}

function advanceGlp1Automation(state: GameState, context: DomainContext): void {
  const environment = state.environment;
  const assignments = getOperationalGlp1AutomationAssignments(state, context);
  const priorSlots = environment.glp1AutomationSlots ?? [];
  const suspendedEmployeeIds = new Set(
    state.employees
      .filter(
        (employee) =>
          employee.staffRoleDefinitionId === "staff.glp1_np" &&
          employee.facilityTask?.kind === "participate_qi_discussion",
      )
      .map((employee) => employee.id),
  );
  const suspendedSlots = priorSlots.filter((slot) =>
    suspendedEmployeeIds.has(slot.employeeId),
  );
  if (assignments.length === 0 && suspendedSlots.length === 0) {
    environment.glp1AutomationSlots = [];
    environment.glp1AutomationNextPayoutTicks = [];
    environment.glp1AutomationNextPayoutTick = null;
    return;
  }
  const config = context.balanceRelease.environment;
  const quoteNextInterval = (suiteRoomInstanceId: string) => {
    const employeePayment = getEmployeeTrainingMoney(config.glp1AutomationPayment,
      getEmployeeRoleTrainingPercent(state, "staff.glp1_np"), "increase");
    const roomUpgradeRevenue = createRoomUpgradeRevenueQuote(state, employeePayment, ["room.glp1_telehealth_suite"]);
    bindRoomUpgradeRevenueQuote(roomUpgradeRevenue, suiteRoomInstanceId);
    return { roomUpgradeRevenue, quotePayment: roomUpgradeRevenue ? getRoomUpgradeQuotedFee(roomUpgradeRevenue) : employeePayment };
  };
  const activeSlots = assignments.map((assignment) => {
    const prior = priorSlots.find(
      (slot) =>
        slot.suiteRoomInstanceId === assignment.suiteRoomInstanceId &&
        slot.employeeId === assignment.employeeId,
    );
    return {
      ...prior,
      ...assignment,
      // Existing slots preserve their legacy interval; new ones freeze both
      // employee and actual-suite effects before any work is performed.
      ...(prior ? {} : quoteNextInterval(assignment.suiteRoomInstanceId)),
      // The current tick is the first full facility minute after a new slot
      // became operational, so its first payout lands after 60 such minutes.
      nextPayoutTick:
        prior?.nextPayoutTick ??
        state.facilityTick + config.glp1AutomationIntervalMinutes - 1,
    };
  });
  const activeKeys = new Set(
    activeSlots.map(
      (slot) => `${slot.suiteRoomInstanceId}:${slot.employeeId}`,
    ),
  );
  const slots = [
    ...activeSlots,
    ...suspendedSlots.filter(
      (slot) =>
        !activeKeys.has(`${slot.suiteRoomInstanceId}:${slot.employeeId}`),
    ),
  ];
  for (const slot of activeSlots) {
    if (slot.nextPayoutTick <= state.facilityTick) {
      const transactionKey =
        `income.glp1.automation.${slot.suiteRoomInstanceId}.` +
        `${slot.employeeId}.${slot.nextPayoutTick}`;
      if (!state.serviceIncomeReceipts.some((receipt) => receipt.transactionKey === transactionKey)) {
      const payment = slot.quotePayment ?? config.glp1AutomationPayment;
      state.serviceIncomeReceipts.push({
        id: `${transactionKey}.${state.nextServiceIncomeReceiptSequence++}`,
        transactionKey,
        incomeLineId: "income.glp1_telehealth",
        catalogVersion: 1,
        routeId: null,
        actorKind: "employee",
        actorId: slot.employeeId,
        grossAmount: payment,
        stockCost: 0,
        netCashDelta: payment,
        completedAtFacilityTick: state.facilityTick,
      });
        environment.glp1AutomationConsultationsCompleted += 1;
        adjustCash(state, payment);
      }
      slot.nextPayoutTick += config.glp1AutomationIntervalMinutes;
      Object.assign(slot, quoteNextInterval(slot.suiteRoomInstanceId));
    }
  }
  environment.glp1AutomationSlots = slots;
  environment.glp1AutomationNextPayoutTicks = slots
    .map((slot) => slot.nextPayoutTick)
    .sort((left, right) => left - right);
  environment.glp1AutomationNextPayoutTick =
    environment.glp1AutomationNextPayoutTicks[0] ?? null;
}

function maybeApplyCoffeeMorale(state: GameState, context: DomainContext): void {
  const operatingTicksPerDay =
    (context.balanceRelease.clock.dayEndHour - context.balanceRelease.clock.dayStartHour) * 60;
  const dayNumber = Math.floor(state.facilityTick / operatingTicksPerDay) + 1;
  if (
    !getCurrentCapabilities(state, context).has("capability.coffee_kiosk") ||
    state.environment.coffeeMoraleAppliedDayNumber === dayNumber
  ) {
    return;
  }
  const roomUpgradeMorale = getBestOperationalCoffeeUpgradeMorale(state, context);
  for (const employee of state.employees) {
    employee.morale = clamp(
      employee.morale + context.balanceRelease.environment.coffeeMoraleBonusPerDay + roomUpgradeMorale,
      0,
      100,
    );
  }
  state.environment.coffeeMoraleAppliedDayNumber = dayNumber;
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
  let completedAssignedWork = false;
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
      completedAssignedWork = true;
    }
  } else if (activity.kind === "refill_water") {
    if (getWaterCoolerApproachLocation(state, context) !== null) {
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
      completedAssignedWork = true;
    }
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
      completedAssignedWork = true;
    }
  }
  state.environment.founderActivity = null;
  // Automatic idling chains to the next idle choice so the founder does not
  // stand still in a hallway or at a vacated chair (owner rule, 2026-10-07).
  const automaticIdle = activity.kind === "wander_facility" || activity.kind === "visit_bathroom" ||
    (activity.kind === "sit_in_chair" && activity.explicitSeat !== true);
  if (completedAssignedWork || automaticIdle) {
    planFounderAfterEncounter(state, context);
  }
}

function advanceFounderActivity(
  state: GameState,
  context: DomainContext,
): void {
  const activity = state.environment.founderActivity;
  if (!activity) {
    return;
  }
  if (activity.kind === "return_to_front_desk" && activity.path.length <= 1) {
    const frontDesk = state.rooms.find((room) => room.roomDefinitionId === "room.front_desk");
    const replanned = frontDesk
      ? findRouteFromDisplacedLocationToRoom(
          state,
          context,
          state.environment.founderLocation,
          frontDesk.id,
        )
      : [];
    if (replanned.length > 1) {
      activity.path = replanned;
      activity.pathIndex = 0;
      activity.lastMovedAtFacilityTick = state.facilityTick;
    } else {
      // A temporarily disconnected layout can become routable before Build
      // Mode ends. Keep the founder in place so a later tick can retry.
      return;
    }
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
    if (
      activity.kind === "attend_employee_discussion" &&
      activity.pathIndex >= activity.path.length - 1
    ) {
      const discussion = getEmployeeDiscussions(state)[activity.targetId];
      if (discussion?.lifecycle === "active_traveling") {
        discussion.lifecycle = "active_action_required";
      }
    }
    if (
      activity.kind === "return_to_front_desk" &&
      activity.pathIndex >= activity.path.length - 1
    ) {
      // A Front Desk return is a travel-only automatic plan.  Clearing it on
      // arrival is what makes the seated staff anchor immediately count for
      // check-in on this same simulation tick.
      state.environment.founderActivity = null;
    }
    return;
  }
  if (activity.kind === "attend_employee_discussion") {
    const discussion = getEmployeeDiscussions(state)[activity.targetId];
    if (discussion?.lifecycle === "active_traveling") {
      discussion.lifecycle = "active_action_required";
    }
    return;
  }
  if (activity.kind === "perform_service") {
    const stillReservedByOperation = state.serviceOperations.some(
      (operation) =>
        operation.id === activity.targetId &&
        operation.status !== "completed" &&
        operation.status !== "cancelled",
    );
    const stillReservedByPendingResult = Object.values(state.encounters).some(
      (encounter) => {
        const pending = encounter.pendingResult;
        return Boolean(
          pending &&
            pending.operationId === activity.targetId &&
            pending.providerReservation?.kind === "founder" &&
            pending.deliveredAtTick === null &&
            (encounter.steps[pending.originatingNodeIndex]?.status === "feedback_pending" ||
              !(pending.timingPhases?.length) ||
              pending.timingPhases.some(
                (phase) => phase.resourceBound && state.facilityTick < phase.endsAtTick,
              )),
        );
      },
    );
    if (!stillReservedByOperation && !stillReservedByPendingResult) {
      state.environment.founderActivity = null;
      planFounderAfterEncounter(state, context);
    }
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
  completeWaitingRoomExperience(encounter, state.facilityTick);
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

  if (encounterHasActiveDiagnosticWalk(state, encounter.id) && ["departing_for_offsite_testing", "returning_from_offsite_testing", "returning_from_onsite_service"].includes(movement.kind)) {
    if (movement.kind === "departing_for_offsite_testing") encounter.patientLocation = null;
    encounter.idleWaitingSinceTick = null;
    return;
  }

  switch (movement.kind) {
    case "arriving_for_check_in":
      state.alertHumor.lastPatientArrivalTick = state.facilityTick;
      encounter.checkInStatus = "awaiting_staff";
      encounter.checkInWaitingSinceTick = state.facilityTick;
      encounter.idleWaitingSinceTick = null;
      return;
    case "walking_to_waiting":
      encounter.idleWaitingSinceTick = state.facilityTick;
      encounter.lastSatisfactionDecayAtTick = state.facilityTick;
      if (encounter.queuedCareRoomInstanceId) {
        const roomId = encounter.queuedCareRoomInstanceId;
        const path = encounter.patientLocation
          ? (() => {
              const room = state.rooms.find((candidate) => candidate.id === roomId);
              const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
              return room && definition
                ? pathFromLocationToFacilityPoint(
                    state, context, encounter.patientLocation!,
                    getRoomCareAnchor(room, definition, "patient"), new Set([room.id]),
                  )
                : [];
            })()
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
      if (
        encounter.lifecycle === "resolved" &&
        !encounterHasActiveServiceOperation(state, encounter.id)
      ) {
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
        // ACKNOWLEDGE_DECISION_FEEDBACK released the examination when the
        // service route was frozen. Completing the already-started approach
        // must not silently reserve it again.
        encounter.assignedRoomInstanceId = null;
        encounter.idleWaitingSinceTick = null;
        beginPendingResultTravel(state, encounter, context);
        return;
      }
      if (encounter.lifecycle === "resolved_summary_available") {
        // A question may be answered while the patient is still approaching
        // the Examination Room. Finishing that already-started walk must not
        // reopen a terminal decision after its feedback and settlement exist.
        encounter.idleWaitingSinceTick = null;
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
    case "returning_from_onsite_service": {
      completeStagedResultComponentAtFrontDesk(state, encounter, context);
      completeTestOnlyContinuationAtFrontDesk(state, encounter);
      const onsiteReturn = encounter.pendingResult?.onsiteReturn;
      if (onsiteReturn) {
        onsiteReturn.status = "front_desk_arrived";
        onsiteReturn.frontDeskArrivalTick = state.facilityTick;
      }
      encounter.idleWaitingSinceTick = null;
      encounter.lastSatisfactionDecayAtTick = state.facilityTick;
      const destination = chooseWaitingDestination(state, context, encounter);
      encounter.waitingDestination = destination.reservation;
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
    case "returning_from_offsite_testing": {
      state.alertHumor.lastPatientArrivalTick = state.facilityTick;
      // Reaching the Front Desk completes the return trip and makes the
      // existing chart eligible for its next decision. The patient then moves
      // to the same deterministic waiting hierarchy used after first check-in.
      encounter.idleWaitingSinceTick = null;
      encounter.lastSatisfactionDecayAtTick = state.facilityTick;
      if (encounter.testOnlyContinuation?.saleInterruptedOffsite) {
        encounter.testOnlyContinuation.status = "returning_to_front_desk";
        delete encounter.testOnlyContinuation.saleInterruptedOffsite;
        completeTestOnlyContinuationAtFrontDesk(state, encounter);
      }
      const destination = chooseWaitingDestination(
        state,
        context,
        encounter,
      );
      encounter.waitingDestination = destination.reservation;
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
          ? (() => {
              const room = state.rooms.find((candidate) => candidate.id === roomId);
              const definition = room ? getRoomDefinition(room.roomDefinitionId, context) : null;
              return room && definition
                ? pathFromLocationToFacilityPoint(
                    state, context, encounter.patientLocation!,
                    getRoomCareAnchor(room, definition, "patient"), new Set([room.id]),
                  )
                : [];
            })()
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
      encounter.nextIdleActionAtFacilityTick =
        encounter.waitingDestination?.kind === "public_wander"
          ? state.facilityTick + publicWanderDwellMinutes(state, encounter.id)
          : getNextIdleActionTick(
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

function resumeOpenChartCareAfterAmenity(
  state: GameState,
  context: DomainContext,
): void {
  const encounterId = state.openChartEncounterId;
  if (!encounterId) return;
  const encounter = state.encounters[encounterId];
  if (
    !encounter ||
    encounter.patientMovement !== null ||
    hasActivePatientAmenityTrip(state, "encounter", encounterId) ||
    !encounter.queuedCareRoomInstanceId ||
    !encounter.patientLocation
  ) return;
  const roomId = encounter.queuedCareRoomInstanceId;
  const room = state.rooms.find((candidate) => candidate.id === roomId);
  const definition = room
    ? getRoomDefinition(room.roomDefinitionId, context)
    : null;
  if (!room || !definition || room.roomDefinitionId !== "room.examination") {
    encounter.queuedCareRoomInstanceId = null;
    return;
  }
  const path = pathFromLocationToFacilityPoint(
    state,
    context,
    encounter.patientLocation,
    getRoomCareAnchor(room, definition, "patient"),
    new Set([room.id]),
  );
  if (path.length === 0) return;
  encounter.queuedCareRoomInstanceId = null;
  startPatientMovement(
    state,
    context,
    encounter,
    "walking_to_care",
    path,
    roomId,
  );
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
  if (kind !== "walking_to_waiting" && kind !== "idle_within_room") {
    encounter.waitingDestination = null;
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
    const frozenTravel = encounter.pendingResult?.deliveredAtTick === null
      ? encounter.pendingResult.patientTravel
      : null;
    const frozenLegActive = Boolean(
      frozenTravel && (
        (movement.kind === "walking_to_care" &&
          movement.destinationRoomInstanceId === frozenTravel.destinationRoomInstanceId &&
          state.facilityTick >= frozenTravel.outboundStartTick &&
          state.facilityTick <= frozenTravel.outboundArrivalTick) ||
        (movement.kind === "returning_from_onsite_service" &&
          encounter.pendingResult?.onsiteReturn === undefined &&
          state.facilityTick >= frozenTravel.serviceCompletionTick)
      ),
    );
    if (frozenTravel && frozenLegActive) {
      const projected = getFrozenPatientTravelLocation(
        frozenTravel,
        state.facilityTick,
      );
      if (projected) encounter.patientLocation = projected;
      const activePath = movement.kind === "walking_to_care"
        ? frozenTravel.outboundPath
        : frozenTravel.returnPath;
      const activeStartTick = movement.kind === "walking_to_care"
        ? frozenTravel.outboundStartTick
        : frozenTravel.serviceCompletionTick;
      movement.path = activePath.map((point) => ({ ...point }));
      movement.pathIndex = Math.min(
        Math.max(0, activePath.length - 1),
        Math.max(0, state.facilityTick - activeStartTick) *
          Math.max(1, frozenTravel.tilesPerTick),
      );
      movement.lastMovedAtFacilityTick = state.facilityTick;
      const legComplete = movement.kind === "walking_to_care"
        ? state.facilityTick >= frozenTravel.outboundArrivalTick
        : state.facilityTick >= frozenTravel.returnArrivalTick;
      if (legComplete) completePatientMovement(state, encounter, context);
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
      activeRetailOperationForActor(state, "encounter", encounter.id) !== null ||
      hasActivePatientAmenityTrip(state, "encounter", encounter.id) ||
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
    // Hallway overflow keeps moving on the short owner cadence instead of the
    // occasional idle roll (see PUBLIC_WANDER_DWELL_MINUTES).
    if (encounter.waitingDestination?.kind === "public_wander") {
      encounter.nextIdleActionAtFacilityTick =
        state.facilityTick + publicWanderDwellMinutes(state, encounter.id);
      const destination = choosePublicWanderDestination(state, context, encounter);
      if (destination) {
        encounter.waitingDestination = destination.reservation;
        startPatientMovement(
          state,
          context,
          encounter,
          "idle_within_room",
          destination.path,
          destination.roomId,
        );
      }
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
    const reservation = encounter.waitingDestination;
    // Preferred waiting places remain occupied; only public-wander patients
    // move between public standing points on the deterministic idle cadence.
    if (reservation?.kind === "chair" || reservation?.kind === "standing") {
      continue;
    }
    if (reservation?.kind === "public_wander") {
      const destination = choosePublicWanderDestination(state, context, encounter);
      if (destination) {
        encounter.waitingDestination = destination.reservation;
        startPatientMovement(
          state,
          context,
          encounter,
          "idle_within_room",
          destination.path,
          destination.roomId,
        );
      }
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
      new Set([room.id]),
    );
    if (outboundPath.length > 1) {
      if (reservation?.kind === "public_wander") {
        encounter.waitingDestination = {
          roomInstanceId: room.id,
          location: { ...target },
          kind: "public_wander",
        };
      }
      startPatientMovement(
        state,
        context,
        encounter,
        "idle_within_room",
        outboundPath,
        room.id,
      );
    }
  }
}

/**
 * Owner rule (2026-10-07): a waiting patient does not stand while a waiting
 * chair is free. Standing and hallway patients, including ones walking back
 * from the bathroom or a shop, move to a free chair; the closest one wins.
 * Patients with a pending result keep their frozen test travel untouched.
 */
function reseatStandingWaitingPatients(
  state: GameState,
  context: DomainContext,
): void {
  const gridHeight = context.balanceRelease.facility.gridHeight;
  const candidates = Object.values(state.encounters).filter((encounter) => {
    const reservation = encounter.waitingDestination;
    if (
      (reservation?.kind !== "standing" && reservation?.kind !== "public_wander") ||
      (encounter.lifecycle !== "waiting_unopened" &&
        encounter.lifecycle !== "active_action_required") ||
      encounter.patientMovement !== null ||
      encounter.patientLocation === null ||
      encounter.patientLocation.y >= gridHeight ||
      state.openChartEncounterId === encounter.id ||
      encounterHasActiveServiceOperation(state, encounter.id)
    ) {
      return false;
    }
    const amenityTrip = getPatientAmenityTrip(state, "encounter", encounter.id);
    const retailTrip = activeRetailOperationForActor(state, "encounter", encounter.id);
    if (amenityTrip && (amenityTrip.status !== "returning" || amenityTrip.purpose)) return false;
    if (retailTrip && (retailTrip.status !== "returning" || retailTrip.departureServiceOperationId)) return false;
    return true;
  });
  if (candidates.length === 0 || !hasFreeWaitingChair(state, context)) return;
  const remaining = new Set(candidates);
  while (remaining.size > 0) {
    let best: { encounter: EncounterState; destination: ReturnType<typeof chooseWaitingDestination> } | null = null;
    for (const encounter of remaining) {
      const destination = chooseWaitingDestination(state, context, encounter);
      if (destination.reservation?.kind !== "chair" || destination.path.length <= 1) continue;
      if (!best || destination.path.length < best.destination.path.length) best = { encounter, destination };
    }
    if (!best) return;
    const { encounter, destination } = best;
    const reservation = destination.reservation!;
    remaining.delete(encounter);
    const onTrip = getPatientAmenityTrip(state, "encounter", encounter.id) !== null;
    const onRetailTrip = activeRetailOperationForActor(state, "encounter", encounter.id) !== null;
    if (onTrip || onRetailTrip) {
      const redirected = onTrip
        ? redirectPatientAmenityReturn(state, encounter.id, reservation.location, context)
        : redirectRetailReturn(state, encounter.id, reservation.location, context);
      if (!redirected) continue;
      encounter.assignedRoomInstanceId = reservation.roomInstanceId;
    } else if (
      startPatientMovement(state, context, encounter, "idle_within_room", destination.path, destination.roomId) < 0
    ) {
      continue;
    }
    encounter.waitingDestination = reservation;
    if (!hasFreeWaitingChair(state, context)) return;
  }
}

function dispatchQueuedPendingResults(
  state: GameState,
  context: DomainContext,
): void {
  const queuedIds = Object.values(state.encounters)
    .filter(
      (encounter) =>
        encounter.lifecycle === "active_pending_result" &&
        !hasActivePatientAmenityTrip(state, "encounter", encounter.id) &&
        encounter.patientMovement === null &&
        encounter.pendingResult?.deliveredAtTick === null &&
        encounter.pendingResult.resourceQueue?.status === "waiting_for_resources",
    )
    .sort(
      (left, right) =>
        left.pendingResult!.resourceQueue!.queuedAtTick -
          right.pendingResult!.resourceQueue!.queuedAtTick ||
        left.id.localeCompare(right.id),
    )
    .map((encounter) => encounter.id);
  for (const encounterId of queuedIds) {
    const trial = clonePlain(state);
    const encounter = trial.encounters[encounterId];
    if (!encounter?.pendingResult?.resourceQueue) continue;
    const pending = encounter.pendingResult!;
    const queue = pending.resourceQueue!;
    const selected = getEligibleServiceRoute(
      trial,
      queue.serviceId,
      [queue.routeId],
      context,
      encounter.id,
    );
    if (!selected || selected.route.id !== queue.routeId) continue;

    pending.routeDisplayName = selected.route.displayName;
    pending.pendingLabel = `${selected.route.displayName} pending`;
    pending.serviceDurationTicks = selected.timing.serviceDurationTicks;
    pending.durationTicks = selected.timing.durationTicks;
    pending.patientTravel = clonePlain(selected.timing.patientTravel);
    pending.patientRemainsOnsite = selected.route.patientRemainsOnsite;
    pending.timingPhases = selected.route.timingPhases.map((phase) => ({
      ...phase,
      startsAtTick: state.facilityTick,
      endsAtTick: state.facilityTick + phase.durationTicks,
    }));
    pending.resourceReservations = clonePlain(selected.route.resourceRequirements);
    pending.imagingTechnicianId = selected.imagingTechnicianId;
    pending.phlebotomistId = selected.phlebotomistId;
    pending.phlebotomyArrivalGatedVersion = selected.phlebotomistId ? 1 : undefined;
    pending.providerReservation = selected.providerReservation
      ? clonePlain(selected.providerReservation)
      : null;

    cancelRetailTripsForActor(
      trial,
      "encounter",
      encounter.id,
      "Available clinical resources superseded optional shopping.",
    );
    if (pending.imagingTechnicianId) {
      cancelRetailTripsForActor(
        trial,
        "employee",
        pending.imagingTechnicianId,
        "Clinical work superseded optional shopping.",
      );
    }
    if (pending.phlebotomistId) {
      cancelRetailTripsForActor(
        trial,
        "employee",
        pending.phlebotomistId,
        "Clinical collection superseded optional shopping.",
      );
    }
    if (pending.providerReservation?.kind === "employee") {
      cancelRetailTripsForActor(
        trial,
        "employee",
        pending.providerReservation.employeeId,
        "Clinical work superseded optional shopping.",
      );
    }

    const originPlan = getPendingResultOriginPlan(trial, context, encounter);
    if (
      !originPlan ||
      !routeImagingTechnicianToScheduledService(trial, context, pending) ||
      !routePhlebotomistToScheduledService(trial, context, pending) ||
      (pending.approvedProcedureTimingVersion === 1 &&
        !routeProviderToScheduledService(trial, context, pending)) ||
      !configurePendingResultTiming(
        trial,
        context,
        encounter,
        pending,
        originPlan.readyTick,
        originPlan.origin,
      )
    ) {
      continue;
    }
    delete pending.resourceQueue;
    const step = encounter.steps[pending.originatingNodeIndex];
    if (step) step.result = clonePlain(pending);
    Object.assign(state, trial);
  }
}

function advanceServiceDepartureItineraries(state: GameState, context: DomainContext): void {
  const chance = context.balanceRelease.environment.idleActionChancePercent;
  for (const operation of state.serviceOperations) {
    const itinerary = operation.departureItinerary;
    if (!itinerary || operation.status !== "discharging") continue;
    const actorKind = operation.actorKind === "encounter" ? "encounter" as const : "service_visitor" as const;
    const actorId = operation.actorKind === "encounter" ? operation.actorId : operation.id;
    if (itinerary.status === "bathroom") {
      if (!getPatientAmenityTrip(state, actorKind, actorId)) {
        itinerary.status = "completed";
        itinerary.completedAtFacilityTick = state.facilityTick;
      }
      continue;
    }
    if (itinerary.status === "retail") {
      const retail = state.retailOperations.find((candidate) => candidate.departureServiceOperationId === operation.id);
      if (!retail || retail.status === "completed" || retail.status === "cancelled" || retail.status === "abandoned") {
        itinerary.status = "completed";
        itinerary.completedAtFacilityTick = state.facilityTick;
      }
      continue;
    }
    if (itinerary.status !== "pending") continue;
    itinerary.selectedAtFacilityTick = state.facilityTick;
    const roll = deterministicInteger(state.campaignSeed, RANDOM_STREAMS.environment, `service-departure:${operation.id}:roll`, 100);
    if (roll >= chance) {
      itinerary.status = "skipped";
      itinerary.choiceKind = "none";
      itinerary.completedAtFacilityTick = state.facilityTick;
      continue;
    }
    const bathrooms = getReachablePatientBathroomRoomIds(state, actorKind, actorId, context, operation.id)
      .map((id) => `bathroom:${id}`);
    const retailLines = getViableDepartureRetailLineIds(state, actorKind, actorId, context)
      .map((id) => `retail:${id}`);
    const choices = [...bathrooms, ...retailLines].sort();
    if (choices.length === 0) {
      itinerary.status = "skipped";
      itinerary.choiceKind = "none";
      itinerary.completedAtFacilityTick = state.facilityTick;
      continue;
    }
    const choice = choices[deterministicInteger(state.campaignSeed, RANDOM_STREAMS.environment, `service-departure:${operation.id}:choice`, choices.length)]!;
    const current = operation.actorKind === "encounter" ? state.encounters[actorId]?.patientLocation : operation.location;
    if (!current) {
      itinerary.status = "skipped";
      itinerary.choiceKind = "none";
      itinerary.completedAtFacilityTick = state.facilityTick;
      continue;
    }
    if (choice.startsWith("bathroom:")) {
      if (tryStartPatientBathroomTrip(state, actorKind, actorId, context, {
        purpose: "departure", linkedServiceOperationId: operation.id, returnTarget: current,
      })) {
        itinerary.status = "bathroom";
        itinerary.choiceKind = "bathroom";
        itinerary.linkedTripId = getPatientAmenityTrip(state, actorKind, actorId)?.id ?? null;
        continue;
      }
    } else {
      const lineId = choice.slice("retail:".length);
      const retailId = startRetailPurchase(state, lineId, actorKind, actorId, context, undefined, operation.id);
      if (retailId) {
        itinerary.status = "retail";
        itinerary.choiceKind = "retail";
        itinerary.linkedTripId = retailId;
        itinerary.retailIncomeLineId = lineId;
        continue;
      }
    }
    itinerary.status = "skipped";
    itinerary.choiceKind = "none";
    itinerary.completedAtFacilityTick = state.facilityTick;
  }
}

function deliverReadyPendingResults(next: GameState, context: DomainContext, diagnosticOnly = false): void {
  for (const encounter of Object.values(next.encounters)) {
    if (diagnosticOnly && !encounter.pendingResult?.diagnosticTiming) continue;
    if (
      encounter.lifecycle === "active_pending_result" &&
      encounter.pendingResult &&
      encounter.pendingResult.deliveredAtTick === null &&
      (!encounter.pendingResult.diagnosticTiming || (encounter.pendingResult.diagnosticTiming.resultReady.reachedAtTick !== null && encounter.pendingResult.diagnosticTiming.careComplete.reachedAtTick !== null)) &&
      (!encounter.pendingResult.localServiceOperation ||
        encounter.pendingResult.localServiceOperation.status === "external_processing") &&
      encounter.pendingResult.resourceQueue === undefined &&
      encounter.pendingResult.dueTick <= next.facilityTick
    ) {
      if (hasActivePatientAmenityTrip(next, "encounter", encounter.id)) {
        requestPatientAmenityReturn(next, "encounter", encounter.id, context);
        continue;
      }
      if (
        encounter.pendingResult.onsiteReturn &&
        encounter.pendingResult.onsiteReturn.frontDeskArrivalTick === null
      ) {
        continue;
      }
      if (
        encounter.pendingResult.patientTravel &&
        !encounter.pendingResult.onsiteReturn
      ) {
        const travel = encounter.pendingResult.patientTravel;
        const projected = getFrozenPatientTravelLocation(
          travel,
          next.facilityTick,
        );
        const returnEndpoint = travel.returnPath.at(-1) ?? null;
        if (
          next.facilityTick < travel.returnArrivalTick ||
          !projected ||
          !returnEndpoint ||
          !samePoint(projected, returnEndpoint)
        ) {
          continue;
        }
      }
      const retailTrip = activeRetailOperationForActor(next, "encounter", encounter.id);
      if (retailTrip) {
        const returnLocation = retailTrip.returnLocation;
        cancelRetailTripsForActor(next, "encounter", encounter.id, "A result became actionable and superseded optional shopping.");
        if (returnLocation && encounter.patientLocation && (encounter.patientLocation.x !== returnLocation.x || encounter.patientLocation.y !== returnLocation.y)) {
          const returnPath = findDeterministicFacilityPath(encounter.patientLocation, returnLocation, next.rooms, next.doors, (id) => getRoomDefinition(id, context));
          if (returnPath.length > 0) startPatientMovement(next, context, encounter, "idle_within_room", returnPath, encounter.assignedRoomInstanceId);
          continue;
        }
      }
      if (
        encounter.patientMovement?.kind ===
          "returning_from_offsite_testing" ||
        encounter.patientMovement?.kind === "returning_from_onsite_service"
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
      if (encounter.stagedResultOrder && (encounter.stagedResultOrder.status === "remainder_pending" ||
        encounter.pendingResult.diagnosticTiming && encounter.stagedResultOrder.diagnosticTiming?.orderId === encounter.pendingResult.diagnosticTiming.orderId)) {
        encounter.stagedResultOrder.status = "completed";
      }
      if (
        encounter.pendingResult.patientTravel &&
        !encounter.pendingResult.onsiteReturn
      ) {
        encounter.patientLocation =
          encounter.pendingResult.patientTravel.returnPath.at(-1) ??
          encounter.patientLocation;
        encounter.assignedRoomInstanceId =
          encounter.pendingResult.approvedProcedureTimingVersion === 1
            ? null
            : encounter.pendingResult.patientTravel.originRoomInstanceId;
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
  reconcileFrozenPatientTravel(state, next, context);
  const founderActivity = next.environment.founderActivity;
  if (founderActivity) {
    const allowedFounderRooms = new Set<string>();
    if (founderActivity.kind === "attend_encounter") {
      const encounter = next.encounters[founderActivity.targetId];
      for (const roomId of [
        encounter?.assignedRoomInstanceId,
        encounter?.queuedCareRoomInstanceId,
        encounter?.patientMovement?.destinationRoomInstanceId,
        encounter?.pendingResult?.patientTravel?.destinationRoomInstanceId,
        encounter?.pendingResult?.completedCareProvenance?.roomInstanceId,
      ]) if (roomId) allowedFounderRooms.add(roomId);
    } else if (founderActivity.kind === "attend_employee_discussion") {
      const discussion = next.employeeDiscussions?.[founderActivity.targetId];
      const employee = discussion
        ? next.employees.find((candidate) => candidate.id === discussion.employeeId)
        : null;
      const room = employee
        ? protectedCareRoomAtPoint(next, context, employee.location)
        : null;
      if (room) allowedFounderRooms.add(room.id);
    } else if (founderActivity.kind === "perform_service") {
      const operation = next.serviceOperations.find(
        (candidate) => candidate.id === founderActivity.targetId,
      );
      const pending = Object.values(next.encounters).find(
        (encounter) => encounter.pendingResult?.operationId === founderActivity.targetId,
      )?.pendingResult;
      for (const roomId of [
        ...(operation?.reservedRoomInstanceIds ?? []),
        ...(operation?.transitionHeldRoomInstanceIds ?? []),
        ...(operation?.periopBedReservation
          ? [operation.periopBedReservation.roomInstanceId]
          : []),
        ...(pending?.patientTravel?.destinationRoomInstanceId
          ? [pending.patientTravel.destinationRoomInstanceId]
          : []),
      ]) allowedFounderRooms.add(roomId);
    } else if (founderActivity.kind === "collect_litter") {
      const litter = next.environment.litterItems.find(
        (candidate) => candidate.id === founderActivity.targetId,
      );
      const room = litter
        ? next.rooms.find((candidate) => candidate.id === litter.roomId)
        : null;
      if (room && isProtectedCareRoom(room)) allowedFounderRooms.add(litter!.roomId);
    }
    if (pathEntersUnauthorizedProtectedRoom(
      next,
      context,
      founderActivity.path,
      founderActivity.pathIndex,
      allowedFounderRooms,
    )) {
      let egress = next.rooms
        .filter((room) => !isProtectedCareRoom(room))
        .flatMap((room) => {
          const definition = getRoomDefinition(room.roomDefinitionId, context);
          if (!definition) return [];
          return getRoomNavigableTiles(room, definition, next.doors)
            .map((goal) => findCareAwareFacilityPath(
              next, context, next.environment.founderLocation, goal,
            ))
            .filter((path) => path.length > 0);
        })
        .sort((left, right) => left.length - right.length)[0] ?? [];
      if (egress.length === 0) {
        egress = pathFromLocationToExit(
          next,
          context,
          next.environment.founderLocation,
        );
      }
      next.environment.founderActivity = egress.length > 0
        ? {
            kind: "walk_to_point",
            targetId: "system.protected-room-egress",
            path: egress,
            pathIndex: 0,
            lastMovedAtFacilityTick: next.facilityTick,
            workMinutesRemaining: 0,
          }
        : null;
      next.environment.suspendedFounderActivity = null;
    }
  }
  for (const encounter of Object.values(next.encounters)) {
    const movement = encounter.patientMovement;
    if (!movement) continue;
    const allowedRooms = new Set<string>();
    if (movement.destinationRoomInstanceId && (
      movement.kind === "walking_to_care" ||
      encounter.pendingResult?.patientTravel?.destinationRoomInstanceId ===
        movement.destinationRoomInstanceId ||
      next.serviceOperations.some((operation) =>
        operation.actorKind === "encounter" &&
        operation.actorId === encounter.id &&
        operation.reservedRoomInstanceIds.includes(movement.destinationRoomInstanceId!),
      )
    )) allowedRooms.add(movement.destinationRoomInstanceId);
    if (!pathEntersUnauthorizedProtectedRoom(
      next, context, movement.path, movement.pathIndex, allowedRooms,
    )) continue;
    const goal = movement.path.at(-1);
    const repaired = encounter.patientLocation && goal
      ? findCareAwareFacilityPath(
          next, context, encounter.patientLocation, goal, allowedRooms,
        )
      : [];
    if (repaired.length > 0) {
      const pending = encounter.pendingResult;
      const travel = pending?.patientTravel;
      if (pending && travel && pending.deliveredAtTick === null) {
        const speed = Math.max(1, travel.tilesPerTick);
        const previousRemainingTicks = Math.ceil(
          Math.max(0, movement.path.length - 1 - movement.pathIndex) / speed,
        );
        const repairedRemainingTicks = Math.ceil(
          Math.max(0, repaired.length - 1) / speed,
        );
        const delay = Math.max(0, repairedRemainingTicks - previousRemainingTicks);
        if (delay > 0 && movement.kind === "walking_to_care" &&
            movement.destinationRoomInstanceId === travel.destinationRoomInstanceId) {
          const oldArrival = travel.outboundArrivalTick;
          travel.outboundArrivalTick += delay;
          travel.serviceCompletionTick += delay;
          travel.returnArrivalTick += delay;
          pending.dueTick += delay;
          pending.durationTicks += delay;
          pending.timingPhases = pending.timingPhases?.map((phase) =>
            phase.startsAtTick >= oldArrival && phase.startsAtTick > next.facilityTick
              ? {
                  ...phase,
                  startsAtTick: phase.startsAtTick + delay,
                  endsAtTick: phase.endsAtTick + delay,
                }
              : phase,
          );
          if (pending.onsiteReturn?.serviceCompletedAtTick !== null &&
              pending.onsiteReturn?.serviceCompletedAtTick !== undefined &&
              pending.onsiteReturn.serviceCompletedAtTick > next.facilityTick) {
            pending.onsiteReturn.serviceCompletedAtTick += delay;
          }
        } else if (delay > 0 && movement.kind === "returning_from_onsite_service") {
          travel.returnArrivalTick += delay;
          pending.dueTick = Math.max(pending.dueTick, travel.returnArrivalTick);
          pending.durationTicks = Math.max(
            pending.durationTicks,
            pending.dueTick - pending.scheduledAtTick,
          );
        }
      }
      movement.path = repaired.map((point) => ({ ...point }));
      movement.pathIndex = 0;
      movement.lastMovedAtFacilityTick = next.facilityTick;
      continue;
    }
    const pending = encounter.pendingResult;
    const travel = pending?.patientTravel;
    const isPendingOutbound = Boolean(
      pending && travel && pending.deliveredAtTick === null &&
      movement.kind === "walking_to_care" &&
      movement.destinationRoomInstanceId === travel.destinationRoomInstanceId,
    );
    if (isPendingOutbound && pending && travel) {
      for (const employee of next.employees) {
        if (employee.facilityTask?.targetId === pending.operationId) {
          employee.facilityTask = null;
        }
      }
      if (next.environment.founderActivity?.kind === "perform_service" &&
          next.environment.founderActivity.targetId === pending.operationId) {
        next.environment.founderActivity = null;
        planFounderAfterEncounter(next, context);
      }
      pending.resourceQueue = {
        version: "onsite-resource-queue.v1",
        status: "waiting_for_resources",
        serviceId: pending.resultTypeId,
        routeId: pending.routeId,
        allowedRouteIds: [pending.routeId],
        queuedAtTick: next.facilityTick,
      };
      pending.durationTicks = 0;
      pending.dueTick = next.facilityTick;
      pending.patientTravel = null;
      pending.timingPhases = [];
      pending.resourceReservations = [];
      pending.imagingTechnicianId = null;
      pending.phlebotomistId = null;
      pending.providerReservation = null;
      if (pending.onsiteReturn) {
        pending.onsiteReturn.status = "awaiting_service_completion";
        pending.onsiteReturn.serviceCompletedAtTick = null;
        pending.onsiteReturn.frontDeskArrivalTick = null;
      }
      const pendingStep = encounter.steps[pending.originatingNodeIndex];
      if (pendingStep) pendingStep.result = clonePlain(pending);
    }
    encounter.patientMovement = null;
    encounter.waitingDestination = null;
    if (pending && travel && pending.deliveredAtTick === null &&
        movement.kind === "returning_from_onsite_service" && encounter.patientLocation) {
      const entrance = getPublicEntrance(next, context);
      const safeReturn = entrance
        ? findCareAwareFacilityPath(
            next, context, encounter.patientLocation, entrance.inside,
          )
        : [];
      if (entrance && safeReturn.length > 0) {
        const speed = Math.max(1, travel.tilesPerTick);
        const arrivalTick = next.facilityTick + Math.ceil(
          Math.max(0, safeReturn.length - 1) / speed,
        );
        travel.returnArrivalTick = Math.max(travel.returnArrivalTick, arrivalTick);
        pending.dueTick = Math.max(pending.dueTick, travel.returnArrivalTick);
        pending.durationTicks = Math.max(
          pending.durationTicks,
          pending.dueTick - pending.scheduledAtTick,
        );
        startPatientMovement(
          next, context, encounter, "returning_from_onsite_service",
          safeReturn, entrance!.room.id,
        );
        continue;
      }
    }
    const destination = chooseWaitingDestination(next, context, encounter);
    if (destination.path.length > 0) {
      encounter.waitingDestination = destination.reservation;
      startPatientMovement(
        next, context, encounter, "walking_to_waiting",
        destination.path, destination.roomId,
      );
      continue;
    }
    const publicEgress = next.rooms
      .filter((room) => !isProtectedCareRoom(room))
      .flatMap((room) => {
        const definition = getRoomDefinition(room.roomDefinitionId, context);
        if (!definition || !encounter.patientLocation) return [];
        return getRoomNavigableTiles(room, definition, next.doors)
          .map((goal) => ({
            roomId: room.id,
            path: findCareAwareFacilityPath(
              next, context, encounter.patientLocation!, goal,
            ),
          }))
          .filter((candidate) => candidate.path.length > 0);
      })
      .sort((left, right) =>
        left.path.length - right.path.length || left.roomId.localeCompare(right.roomId),
      )[0];
    if (publicEgress) {
      startPatientMovement(
        next, context, encounter, "walking_to_waiting",
        publicEgress.path, publicEgress.roomId,
      );
    }
  }
  for (const encounter of Object.values(next.encounters)) {
    if (encounter.patientMovement || !encounter.patientLocation) continue;
    if (encounter.pendingResult?.deliveredAtTick === null &&
        encounter.pendingResult.patientTravel &&
        next.facilityTick <= encounter.pendingResult.patientTravel.returnArrivalTick) continue;
    const room = protectedCareRoomAtPoint(next, context, encounter.patientLocation);
    if (!room ||
        encounter.assignedRoomInstanceId === room.id ||
        encounter.queuedCareRoomInstanceId === room.id ||
        next.openChartEncounterId === encounter.id ||
        encounter.pendingResult?.localServiceOperation?.status === "waiting_for_service" ||
        encounterHasActiveServiceOperation(next, encounter.id)) continue;
    if (encounter.lifecycle === "resolved") {
      startPatientMovement(
        next, context, encounter, "leaving_after_resolution",
        pathFromLocationToOffscreen(
          next, context, encounter.patientLocation, encounter.id,
        ),
        null,
      );
      continue;
    }
    const destination = chooseWaitingDestination(next, context, encounter);
    encounter.waitingDestination = destination.reservation;
    startPatientMovement(
      next, context, encounter, "walking_to_waiting",
      destination.path, destination.roomId,
    );
  }
  const operatingTicksPerDay =
    (context.balanceRelease.clock.dayEndHour -
      context.balanceRelease.clock.dayStartHour) *
    60;
  if (next.facilityTick % operatingTicksPerDay === 0) {
    const dayNumber = Math.floor(next.facilityTick / operatingTicksPerDay) + 1;
    next.emergencyGlp1.dayNumber = dayNumber;
    next.emergencyGlp1.usesToday = 0;
    next.emergencyGlp1.lastFlavorMessage = null;
    const clinicDaySummary = captureClinicDaySummary(next, context);
    next.clinicDaySummaryBaseline = { facilityTick: next.facilityTick, completedTotal: clinicDaySummary.completedTotal, earnedTotalCents: clinicDaySummary.earnedTotalCents };
    appendEvent(next, {
      id: `event.day-rollover.${dayNumber}`,
      type: "day_rollover",
      facilityTick: next.facilityTick,
      encounterId: null,
      message: `Day ${dayNumber} begins at 8 AM.`,
      clinicDaySummary,
      priority: "informational",
      definitionId: "event.facility.day-rollover",
      target: {
        kind: "campaign",
        id: next.campaignId,
      },
    });
  }

  for (const encounter of Object.values(next.encounters)) {
    advanceSaleInterruptedContinuation(next, encounter, context);
  }
  advancePatientMovements(next, context);
  for (const encounter of Object.values(next.encounters)) observeWaitingRoomExperience(next, encounter, context);
  advancePatientAmenityTrips(next, context);
  resumeOpenChartCareAfterAmenity(next, context);
  reseatStandingWaitingPatients(next, context);
  maybeStartPatientIdleMovements(next, context);
  advanceAmbientPedestrians(next, context);
  dispatchQueuedPendingResults(next, context);
  advanceNewDiagnosticOrders(next, context);

  for (const encounter of Object.values(next.encounters)) {
    if (encounter.pendingResult) bindPendingResultRoomRevenue(next, context, encounter, encounter.pendingResult);
    creditEligibleServiceIncome(next, encounter);
    if (
      encounter.lifecycle !== "active_pending_result" ||
      !encounter.pendingResult ||
      encounter.pendingResult.diagnosticTiming !== undefined ||
      encounter.pendingResult.deliveredAtTick !== null
    ) {
      continue;
    }
    if (encounter.pendingResult.localServiceOperation) {
      if (
        encounter.pendingResult.localServiceOperation.status === "external_processing"
      ) {
        maybeBeginOnsiteFrontDeskReturn(next, encounter, context);
      }
      continue;
    }
    ensureLegacyOffsiteTravel(next, encounter, context);
    beginPendingResultTravel(next, encounter, context);
    maybeBeginOnsiteFrontDeskReturn(next, encounter, context);
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

  deliverReadyPendingResults(next, context);

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
    maybeEmitPatientDepartureRiskWarning(next, encounter);
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
      -baseDecay * (next.employees.some((employee) => employee.staffRoleDefinitionId === "staff.receptionist" &&
        !employee.facilityTask && isEmployeeOperational(next, employee.id, context))
        ? 1 - getEmployeeRoleTrainingPercent(next, "staff.receptionist") / 100 : 1),
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

    maybeEmitPatientDepartureRiskWarning(next, encounter);

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
  maybeEmitEmployeeDepartureRiskWarnings(next, context);
  prioritizeReceptionistPatients(next, context);
  maybeAssignReceptionistWaterRefill(next, context);
  advanceLevelThreeSupport(next, context);
    advanceEmployeeMovement(next, context);
    advanceDepartingEmployees(next, context);
  advanceFounderActivity(next, context);
  for (const encounter of Object.values(next.encounters)) {
    if (encounter.pendingResult) bindPendingResultRoomRevenue(next, context, encounter, encounter.pendingResult);
  }
  if (next.environment.pendingFounderConsult?.kind === "encounter" &&
      next.openChartEncounterId === next.environment.pendingFounderConsult.targetId &&
      !(next.environment.founderActivity?.kind === "attend_encounter" &&
        next.environment.founderActivity.targetId === next.openChartEncounterId)) {
    const retryOperationId = "system.open-chart-attendance-retry";
    const retried = reduceOpenChart(next, {
      type: "OPEN_CHART",
      operationId: retryOperationId,
      encounterId: next.openChartEncounterId,
    }, context);
    if (retried.environment.founderActivity?.kind === "attend_encounter" &&
        retried.environment.founderActivity.targetId === next.openChartEncounterId) {
      delete retried.operationReceipts[retryOperationId];
      Object.assign(next, retried);
    }
  }
  const founderServiceTarget =
    next.environment.founderActivity?.kind === "perform_service"
      ? next.environment.founderActivity.targetId
      : null;
  advanceServiceOperations(
    next,
    context,
    (queueState, encounter) =>
      chooseWaitingDestination(queueState, context, encounter),
    (departureState, encounter, start) => {
      const path = pathFromLocationToOffscreen(
        departureState,
        context,
        start,
        encounter.id,
      );
      return path[0]?.x === start.x && path[0]?.y === start.y
        ? path
        : [];
    },
  );
  advanceNewDiagnosticOrders(next, context);
  deliverReadyPendingResults(next, context, true);
  advanceServiceDepartureItineraries(next, context);
  for (const encounter of Object.values(next.encounters)) {
    maybeBeginStagedResultReturn(next, encounter, context);
    maybeBeginTestOnlyContinuationReturn(next, encounter, context);
    synchronizePendingResultServiceOperation(next, encounter, context);
  }
  if (
    founderServiceTarget &&
    next.environment.founderActivity === null &&
    (() => {
      const operation = next.serviceOperations.find(
        (candidate) => candidate.id === founderServiceTarget,
      );
      return Boolean(
        operation &&
          operation.providerReservation === null &&
          operation.status !== "cancelled" &&
          operation.cancellationReason === null,
      );
    })()
  ) {
    planFounderAfterEncounter(next, context);
  }
    advanceEmployeeFacilityTasks(next, context, "non_refill");
    maybeAssignEvsTasks(next, context);
    advanceGlp1Automation(next, context);
    maybeApplyCoffeeMorale(next, context);
  advanceRetailOperations(next, context);
  maybeApplyUnstaffedCheckInOverdue(next, context);
  maybeCompleteAwaitingCheckIns(next, context);
  drainWaterCooler(next, context);
  reconcileInaccessibleLitter(next, context);
  maybeSpawnLitter(next, context);
  reconcileEmployeeDiscussions(next);
  if (next.openEmployeeDiscussionId) {
    const openDiscussion = next.employeeDiscussions?.[next.openEmployeeDiscussionId];
    if (openDiscussion) tryStartEmployeeDiscussionAttendance(next, openDiscussion, context);
  }
  maybeScheduleEmployeeDiscussion(
    next,
    context,
    command.advancedAtRealMs ??
      next.createdAtRealMs + next.facilityTick * 60_000,
  );
  maybeAdmitAutomaticPatient(
    next,
    context,
    command.advancedAtRealMs ??
      next.createdAtRealMs + next.facilityTick * 60_000,
  );
  prioritizeReceptionistPatients(next, context);
  advanceEmployeeFacilityTasks(next, context, "refill_only");
  advanceEmployeeTraining(next, context);
  // A receptionist freed by check-in/training this minute can refill now.
  // The same intake-priority guard still wins over this second assignment pass.
  maybeAssignReceptionistWaterRefill(next, context);
  retireDepartedEncounters(next, context);
  retireFinishedServiceHistory(next, context);
  retireFinishedRetailHistory(next);
  synchronizeFacilityConditionOccurrences(next, context);
  synchronizeFacilityOperationalAlertOccurrences(next, context, command.advancedAtRealMs ?? next.createdAtRealMs + next.facilityTick * 60_000);
  if (!advanceGuidanceTips(next, context, command.advancedAtRealMs ?? next.createdAtRealMs + next.facilityTick * 60_000)) maybeEmitAmbientMessage(next, context);

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
  if (!definition.buildable) {
    return rejectCommand(state, command, `${definition.displayName} is legacy space and cannot be constructed.`);
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
  const soldFootprint = getRotatedFootprint(definition, room.orientation);
  const wasInsideSoldRoom = (point: GridPoint | null | undefined): boolean => Boolean(
    point &&
    point.x >= room.x && point.x < room.x + soldFootprint.width &&
    point.y >= room.y && point.y < room.y + soldFootprint.height,
  );
  if (facility.protectedRoomDefinitionIds.includes(room.roomDefinitionId)) {
    return rejectCommand(state, command, "The Front Desk cannot be sold.");
  }
  const salePreview = getRoomSalePreview(state, room.id, context);
  if (!salePreview) {
    return rejectCommand(state, command, "A sale preview could not be created for this room.");
  }
  if (salePreview.dismissedEmployees.length > 0 &&
      command.saleConfirmationToken !== salePreview.confirmationToken) {
    return rejectCommand(state, command, "Review and confirm the named employee dismissals before selling this room.");
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
  const upgradeInvestment = definition.upgradeCosts
    .slice(0, Math.max(0, room.upgradeLevel - 1))
    .reduce((total, cost) => total + cost, 0);
  const refund = Math.floor(
    ((definition.constructionCost + upgradeInvestment) *
      facility.roomResalePercent) /
      100,
  );
  const next = clonePlain(state);
  reconcileEmployeeRoomSeats(next);
  const dismissedIds = new Set(salePreview.dismissedEmployees.map((employee) => employee.id));
  const interruptedOperationIds = interruptServiceOperationsForRoomSale(
    next,
    room.id,
    room.roomDefinitionId,
    context,
  );
  interruptServiceOperationsForEmployeeDismissal(next, dismissedIds);
  const dismissed = next.employees.filter((employee) => dismissedIds.has(employee.id));
  next.departingEmployees ??= [];
  for (const employee of dismissed) {
    cancelEmployeeTrainingForDismissal(next, employee.id);
    const retailLocation = next.retailOperations.find(
      (operation) =>
        operation.actorKind === "employee" &&
        operation.actorId === employee.id &&
        !["completed", "cancelled", "abandoned"].includes(operation.status),
    )?.location;
    cancelRetailTripsForActor(next, "employee", employee.id, "Employment ended when the room was sold.");
    const location = retailLocation ?? employee.path[employee.pathIndex] ?? employee.location;
    const path = [{ ...location }];
    next.departingEmployees.push({
      ...employee,
      salaryPerExpenseInterval: 0,
      homeRoomInstanceId: null,
      facilityTask: null,
      location: { ...path[0]! },
      path,
      pathIndex: 0,
      lastMovedAtFacilityTick: next.facilityTick,
      dismissedAtFacilityTick: next.facilityTick,
    });
  }
  next.employees = next.employees.filter((employee) => !dismissedIds.has(employee.id));
  next.rooms = remainingRooms;
  next.doors = next.doors.filter((door) => door.roomId !== room.id);
  cancelRetailOperationsForRoom(
    next,
    room.id,
    "The outlet room was sold before the trip finished.",
    context,
  );
  if (wasInsideSoldRoom(next.environment.founderLocation)) {
    next.environment.founderActivity = {
      kind: "return_to_front_desk",
      targetId: "room.instance.founder_desk",
      path: [{ ...next.environment.founderLocation }],
      pathIndex: 0,
      lastMovedAtFacilityTick: next.facilityTick,
      workMinutesRemaining: 0,
    };
  }
  reconcileEmployeeRoomSeats(next);
  for (const operationId of interruptedOperationIds) {
    const operation = next.serviceOperations.find((candidate) => candidate.id === operationId);
    if (!operation || operation.cancelledAtFacilityTick === null ||
        operation.actorKind !== "encounter" || !operation.testChoiceOrder) continue;
    const encounter = next.encounters[operation.actorId];
    if (!encounter) continue;
    if (operation.testChoiceOrder.purpose === "terminal" &&
        encounter.terminalTestOrder?.serviceOperationId === operation.id) {
      encounter.terminalTestOrder.status = "external_arranged";
      encounter.terminalTestOrder.serviceOperationId = null;
    } else if (operation.testChoiceOrder.purpose === "continuation" &&
        encounter.testOnlyContinuation?.serviceOperationId === operation.id) {
      encounter.testOnlyContinuation.status = "external_arranged";
      encounter.testOnlyContinuation.saleInterruptedOffsite = {
        version: "sale-interrupted-continuation.v1",
        readyAtFacilityTick: null,
        offscreenEndpoint: null,
        returnPath: [],
      };
      encounter.patientMovement = null;
    } else if (operation.testChoiceOrder.purpose === "staged_result_component" &&
        encounter.stagedResultOrder?.components.some((component) =>
          component.serviceOperationId === operation.id)) {
      const order = encounter.stagedResultOrder;
      cancelServiceOperationsById(
        next,
        new Set(order.components.flatMap((component) =>
          component.serviceOperationId && component.serviceOperationId !== operation.id
            ? [component.serviceOperationId]
            : [])),
        "The staged local testing sequence moved off site after its room was sold.",
        context,
      );
      for (const component of order.components) {
        if (component.status !== "completed") component.status = "cancelled";
      }
      const pending = clonePlain(order.remainder);
      pending.scheduledAtTick = next.facilityTick;
      pending.durationTicks = pending.serviceDurationTicks;
      pending.dueTick = next.facilityTick + pending.serviceDurationTicks;
      pending.deliveredAtTick = null;
      delete pending.patientRemainsOnsite;
      pending.patientTravel = null;
      pending.offsiteTravel = null;
      pending.offsiteReturnStartedAtTick = null;
      delete pending.externalProcessingOnly;
      let phaseStart = next.facilityTick;
      pending.timingPhases = (pending.timingPhases ?? []).map((phase) => {
        const startsAtTick = phaseStart;
        const endsAtTick = startsAtTick + phase.durationTicks;
        phaseStart = endsAtTick;
        return { ...phase, startsAtTick, endsAtTick };
      });
      order.status = "remainder_pending";
      encounter.pendingResult = pending;
      const step = encounter.steps[order.originatingNodeIndex];
      if (step) step.result = clonePlain(pending);
      encounter.lifecycle = "active_pending_result";
      encounter.patientMovement = null;
    } else if (operation.testChoiceOrder.purpose === "result_gate" &&
        encounter.pendingResult?.localServiceOperation?.serviceOperationId === operation.id) {
      const pending = encounter.pendingResult;
      const externalDuration = pending.localServiceOperation!.externalDurationTicks;
      delete pending.localServiceOperation;
      delete pending.onsiteReturn;
      delete pending.serviceIncomeEligible;
      delete pending.serviceIncomeLineId;
      delete pending.serviceIncomeFee;
      delete pending.roomUpgradeRevenue;
      delete pending.roomUpgradeRecovery;
      pending.patientTravel = null;
      pending.offsiteTravel = null;
      pending.offsiteReturnStartedAtTick = null;
      pending.resourceReservations = [];
      pending.timingPhases = [];
      pending.imagingTechnicianId = null;
      pending.phlebotomistId = null;
      pending.providerReservation = null;
      delete pending.resourceQueue;
      pending.scheduledAtTick = next.facilityTick;
      pending.durationTicks = externalDuration;
      pending.serviceDurationTicks = externalDuration;
      pending.dueTick = next.facilityTick + externalDuration;
      delete pending.patientRemainsOnsite;
      delete pending.externalProcessingOnly;
      encounter.patientMovement = null;
    }
  }
  for (const encounter of Object.values(next.encounters)) {
    const pending = encounter.pendingResult;
    if (pending?.deliveredAtTick === null && pending.patientTravel?.destinationRoomInstanceId === room.id) {
      for (const employee of next.employees) {
        if (employee.facilityTask?.targetId === pending.operationId) employee.facilityTask = null;
      }
      const compatibleRoomRemains = next.rooms.some(
        (candidate) => candidate.roomDefinitionId === room.roomDefinitionId,
      );
      if (compatibleRoomRemains) {
        pending.resourceQueue = {
          version: "onsite-resource-queue.v1",
          status: "waiting_for_resources",
          serviceId: pending.resultTypeId,
          routeId: pending.routeId,
          allowedRouteIds: [pending.routeId],
          queuedAtTick: next.facilityTick,
        };
        pending.patientTravel = null;
        pending.resourceReservations = [];
        pending.timingPhases = [];
        pending.imagingTechnicianId = null;
        pending.phlebotomistId = null;
        pending.providerReservation = null;
        encounter.patientMovement = null;
      } else if (encounter.patientLocation) {
        pending.patientTravel = null;
        pending.resourceReservations = [];
        pending.timingPhases = [];
        pending.imagingTechnicianId = null;
        pending.phlebotomistId = null;
        pending.providerReservation = null;
        delete pending.resourceQueue;
        delete pending.serviceIncomeEligible;
        delete pending.serviceIncomeLineId;
        delete pending.serviceIncomeFee;
        delete pending.roomUpgradeRevenue;
        delete pending.roomUpgradeRecovery;
        // Defer route selection until the next unpaused simulation tick. This
        // lets Build Mode replace the sold footprint before off-site travel is
        // planned and safely retries if the temporary layout has no exit.
        pending.offsiteTravel = null;
        encounter.patientMovement = null;
      }
    }
    if (encounter.assignedRoomInstanceId === room.id) encounter.assignedRoomInstanceId = null;
    if (encounter.queuedCareRoomInstanceId === room.id) encounter.queuedCareRoomInstanceId = null;
    if (encounter.waitingDestination?.roomInstanceId === room.id) encounter.waitingDestination = null;
    if (encounter.patientMovement?.destinationRoomInstanceId === room.id &&
        encounter.patientMovement.kind !== "departing_for_offsite_testing") {
      encounter.patientMovement = null;
    }
    if (wasInsideSoldRoom(encounter.patientLocation) &&
        !next.serviceOperations.some((operation) =>
          operation.actorKind === "encounter" && operation.actorId === encounter.id &&
          operation.status !== "completed" && operation.status !== "cancelled")) {
      encounter.patientMovement = null;
      encounter.waitingDestination = null;
    }
  }
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
  if (!definition.buildable) {
    return rejectCommand(state, command, `${definition.displayName} is legacy space and cannot be upgraded.`);
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
  if (isEmployeeDiscussionCase(clinicalCase)) {
    return rejectCommand(
      state,
      command,
      "Employee discussion content cannot be admitted as a patient.",
    );
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
  const roomCapacity = getRoomStaffCapacity(state, definition.id).capacity;
  if (employeesInRole.length >= roomCapacity) {
    return rejectCommand(
      state,
      command,
      roomCapacity === 0
        ? `Build a compatible room before hiring this role.`
        : `${definition.displayName} staffing is at its ${roomCapacity}/${roomCapacity} built-room maximum.`,
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
  if (
    definition.requiredAnyRoomDefinitionIds.length > 0 &&
    !definition.requiredAnyRoomDefinitionIds.some((roomDefinitionId) =>
      placedRoomTypes.has(roomDefinitionId),
    )
  ) {
    const names = definition.requiredAnyRoomDefinitionIds
      .map((roomDefinitionId) => getRoomDefinition(roomDefinitionId, context)?.displayName ?? roomDefinitionId)
      .join(", ");
    return rejectCommand(state, command, `Build one of these rooms before hiring this role: ${names}.`);
  }
  if (state.cash < definition.hiringCost) {
    return rejectCommand(state, command, "There is not enough cash for this hire.");
  }

  const occupiedStillIds = new Set([
    ...state.employees.map((employee) => employee.appearance.stillId),
    ...(state.departingEmployees ?? []).map((employee) => employee.appearance.stillId),
  ].filter((stillId): stillId is string => typeof stillId === "string"));
  const selectedStillId = selectStaffStillId(
    state.campaignSeed,
    command.employeeId,
    definition.id,
    undefined,
    occupiedStillIds,
  );
  if (!selectedStillId) {
    return rejectCommand(state, command, `No unused ${definition.displayName} character design is available yet.`);
  }

  const next = clonePlain(state);
  reconcileEmployeeRoomSeats(next);
  const usedNames = [
    ...next.employees.map((candidate) => candidate.displayName),
    ...(next.departingEmployees ?? []).map((candidate) => candidate.displayName),
  ];
  const requestedName = command.displayName?.trim();
  const displayName = requestedName && !usedNames.includes(requestedName)
    ? requestedName
    : createStaffDisplayName(next.campaignSeed, command.employeeId, usedNames);
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
    appearance: { ...createPixelAppearance(
      next.campaignSeed,
      "staff",
      command.employeeId,
      roleStyleForStaffDefinition(definition.id),
    ), stillId: selectedStillId },
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
    lastBreakAtFacilityTick: null,
    nextIdleActionAtFacilityTick: getNextIdleActionTick(
      next,
      context,
      command.employeeId,
    ),
    facilityTask: null,
  };
  next.employees.push(employee);
  if (definition.id === "staff.radiologist") reconcileEmployeeRoomSeats(next);
  if (
    definition.id === "staff.receptionist" &&
    next.environment.founderActivity?.kind === "return_to_front_desk"
  ) {
    next.environment.founderActivity = null;
  }
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

function reduceTrainEmployee(
  state: GameState,
  command: Extract<GameCommand, { type: "TRAIN_EMPLOYEE" }>,
  context: DomainContext,
): GameState {
  const next = clonePlain(state);
  const result = requestEmployeeTraining(next, command.employeeId, context);
  return result.applied ? recordReceipt(next, command, "applied", result.message) : rejectCommand(state, command, result.message);
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
  if (employee.facilityTask?.kind === "participate_qi_discussion") {
    return rejectCommand(
      state,
      command,
      `${employee.displayName} is participating in a team discussion and cannot be fired yet.`,
    );
  }
  if (state.serviceOperations.some(
    (operation) =>
      operation.status !== "completed" &&
      operation.status !== "cancelled" &&
      (operation.reservedEmployeeIds.includes(employee.id) ||
        (operation.providerReservation?.kind === "employee" &&
          operation.providerReservation.employeeId === employee.id)),
  )) {
    return rejectCommand(
      state,
      command,
      `${employee.displayName} is performing a service and cannot be fired yet.`,
    );
  }
  const reservedForImaging = Object.values(state.encounters).some(
    (encounter) => {
      const pending = encounter.pendingResult;
      return Boolean(
        pending &&
          pending.imagingTechnicianId === employee.id &&
          pending.deliveredAtTick === null &&
          (encounter.steps[pending.originatingNodeIndex]?.status ===
            "feedback_pending" ||
            !(pending.timingPhases?.length) ||
            pending.timingPhases.some(
              (phase) =>
                phase.resourceBound && state.facilityTick < phase.endsAtTick,
            )),
      );
    },
  );
  if (reservedForImaging) {
    return rejectCommand(
      state,
      command,
      `${employee.displayName} is performing an imaging service and cannot be fired yet.`,
    );
  }

  const next = clonePlain(state);
  cancelEmployeeTrainingForDismissal(next, command.employeeId);
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
      "The next facility level remains locked in this prototype.",
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
  next.serviceIncomeReceipts.push({
    id: `income.glp1.manual.${command.operationId}.${next.nextServiceIncomeReceiptSequence++}`,
    transactionKey: `income.glp1.manual.${command.operationId}`,
    incomeLineId: "income.glp1_telehealth",
    catalogVersion: 1,
    routeId: null,
    actorKind: "founder",
    actorId: "founder",
    grossAmount: status.payment,
    stockCost: 0,
    netCashDelta: status.payment,
    completedAtFacilityTick: next.facilityTick,
  });

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
  if (isFounderReservedForService(state)) {
    return rejectCommand(
      state,
      command,
      "The founder is currently reserved for a facility service.",
    );
  }
  if (
    state.environment.founderActivity &&
    state.environment.founderActivity.kind !== "walk_to_point" &&
    !isAutomaticFounderActivity(state.environment.founderActivity)
  ) {
    return rejectCommand(
      state,
      command,
      "The founder is already completing another facility interaction.",
    );
  }
  const purposefulCareRoom =
    kind === "collect_litter"
      ? protectedCareRoomAtPoint(state, context, destination)
      : null;
  const path = pathFromLocationToFacilityPoint(
    state,
    context,
    state.environment.founderLocation,
    destination,
    purposefulCareRoom ? new Set([purposefulCareRoom.id]) : new Set(),
  );
  if (path.length === 0) {
    return rejectCommand(
      state,
      command,
      "The founder cannot reach that destination through the current doors.",
    );
  }
  const next = clonePlain(state);
  next.environment.suspendedFounderActivity = null;
  next.environment.pendingFounderConsult = null;
  cancelRetailTripsForActor(next, "founder", "founder", "A founder command superseded optional shopping.");
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

export function isAutomaticFounderActivity(
  activity: GameState["environment"]["founderActivity"],
): boolean {
  return activity !== null && ["attend_encounter", "attend_employee_discussion", "return_to_front_desk", "wander_facility", "sit_in_chair", "visit_bathroom"].includes(activity.kind);
}

function isFounderReservedForService(state: GameState): boolean {
  return Object.values(state.encounters).some((encounter) => {
    const pending = encounter.pendingResult;
    return Boolean(
      pending &&
        pending.deliveredAtTick === null &&
        pending.providerReservation?.kind === "founder" &&
        (!(pending.timingPhases?.length) ||
          pending.timingPhases.some(
            (phase) =>
              phase.resourceBound && state.facilityTick < phase.endsAtTick,
          )),
    );
  });
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
      new Set(),
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
      new Set(),
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
  if (isFounderReservedForService(state)) {
    return rejectCommand(
      state,
      command,
      "The founder is currently reserved for a facility service.",
    );
  }
  if (
    state.environment.founderActivity &&
    state.environment.founderActivity.kind !== "walk_to_point" &&
    !isAutomaticFounderActivity(state.environment.founderActivity)
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
  next.environment.suspendedFounderActivity = null;
  next.environment.pendingFounderConsult = null;
  cancelRetailTripsForActor(next, "founder", "founder", "A founder command superseded optional shopping.");
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

function reduceSeatFounderAtFrontDesk(state: GameState, command: Extract<GameCommand, { type: "SEAT_FOUNDER_AT_FRONT_DESK" }>, context: DomainContext): GameState {
  if (hasHiredReceptionist(state)) return rejectCommand(state, command, "The receptionist is covering the Front Desk.");
  const entrance = getPublicEntrance(state, context);
  const definition = entrance && getRoomDefinition(entrance.room.roomDefinitionId, context);
  if (!entrance || !definition) return rejectCommand(state, command, "The Front Desk is unavailable.");
  const desk = getRoomNavigationAnchor(entrance.room, definition, "staff");
  const occupied = state.employees.some((employee) =>
    samePoint(employee.location, desk) || samePoint(employee.path.at(-1) ?? employee.location, desk),
  ) || Object.values(state.encounters).some(
    (encounter) =>
      encounter.resolutionReason === null &&
      (samePoint(encounter.patientLocation ?? { x: -1, y: -1 }, desk) ||
        samePoint(encounter.patientMovement?.path.at(-1) ?? { x: -1, y: -1 }, desk) ||
        samePoint(encounter.waitingDestination?.location ?? { x: -1, y: -1 }, desk)),
  );
  if (occupied) return rejectCommand(state, command, "The Front Desk chair is occupied.");
  const next = beginFounderActivity(state, command, context, "return_to_front_desk", entrance.room.id, desk, "The founder is returning to the Front Desk.");
  if (
    samePoint(state.environment.founderLocation, desk) &&
    next.operationReceipts[command.operationId]?.status === "applied"
  ) {
    next.environment.founderActivity = null;
    return recordReceipt(next, command, "applied", "The founder is seated at the Front Desk.");
  }
  return next;
}

function reduceSeatFounderInChair(
  state: GameState,
  command: Extract<GameCommand, { type: "SEAT_FOUNDER_IN_CHAIR" }>,
  context: DomainContext,
): GameState {
  // Owner request (2026-10-07): any free public seat — Waiting Room chairs,
  // the patient-side Front Desk chair and Break Room seats.
  const seat = findFounderSeat(state, context, command.roomInstanceId, command.location, command.seatId);
  if (!seat) return rejectCommand(state, command, "That chair is not available for the founder.");
  if (isFounderSeatOccupied(state, seat)) return rejectCommand(state, command, "That chair is occupied or reserved.");
  const next = beginFounderActivity(state, command, context, "sit_in_chair", seat.targetId, seat.location, "The founder is walking to the chair.");
  if (next.operationReceipts[command.operationId]?.status === "applied" && next.environment.founderActivity) {
    next.environment.founderActivity.explicitSeat = true;
    next.environment.founderActivity.workMinutesRemaining = Number.MAX_SAFE_INTEGER;
  }
  return next;
}

/** A suspended explicit seat resumes only while that same seat still exists and is free. */
function founderSeatIsFreeForResume(
  state: GameState,
  context: DomainContext,
  suspended: NonNullable<GameState["environment"]["founderActivity"]>,
): boolean {
  const seats = listFounderSeats(state, context);
  const endpoint = suspended.path.at(-1);
  // Older saves and fixtures name chairs differently; a non-break chair is
  // also recognised by its tile.
  const seat = seats.find((candidate) => candidate.targetId === suspended.targetId) ??
    seats.find((candidate) => candidate.kind !== "break" && endpoint !== undefined && samePoint(candidate.location, endpoint));
  return Boolean(seat && !isFounderSeatOccupied(state, seat));
}

function reduceCollectLitter(
  state: GameState,
  command: Extract<GameCommand, { type: "COLLECT_LITTER" }>,
  context: DomainContext,
): GameState {
  const reconciled = clonePlain(state);
  reconcileInaccessibleLitter(reconciled, context);
  const litter = reconciled.environment.litterItems.find(
    (item) => item.id === command.litterId,
  );
  if (!litter) {
    return rejectCommand(reconciled, command, "That litter is no longer present.");
  }
  const next = beginFounderActivity(
    reconciled,
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
  const approach = getWaterCoolerApproachLocation(state, context);
  if (!approach) return rejectCommand(state, command, "The water cooler is unavailable.");
  return beginFounderActivity(
    state,
    command,
    context,
    "refill_water",
    "water-cooler.front-desk",
    approach,
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
    schemaVersion: 9,
    approvedRoomNavigationMigration: {
      version: "approved-room-navigation.v1",
    },
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
    employeeDiscussions: {},
    employeeDiscussionSequence: 0,
    nextEmployeeDiscussionTick:
      EMPLOYEE_DISCUSSION_FIRST_DELAY_MINUTES,
    openEmployeeDiscussionId: null,
    levelThreeQiReviews: [],
    levelThreeQiReviewSequence: 0,
    levelThreeMaintenanceAppliedUseKeys: [],
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
    departingEmployees: [],
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
    serviceIncomeReceipts: [],
    nextServiceIncomeReceiptSequence: 0,
    serviceAppointmentsEnabled: true,
    nextServiceAppointmentTicks: {},
    lastServiceAppointmentArrivalTick: null,
    lastServiceAppointmentLineId: null,
    lastServiceAppointmentTicks: {},
    serviceOperationSequence: 0,
    serviceOperations: [],
    patientAmenityTrips: [],
    patientAmenityNextOpportunityTicks: {},
    patientAmenityTripSequence: 0,
    retailOperationSequence: 0,
    retailOperations: [],
    retailExternalActors: [],
    retailOrders: [],
    retailActorLedgers: {},
    retailNextOpportunityTicks: {},
    nextExternalRetailOpportunityTick: 120,
    externalRetailSequence: 0,
    companionSequence: 0,
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
      glp1AutomationConsultationsCompleted: 0,
      glp1AutomationSlots: [],
      glp1AutomationNextPayoutTicks: [],
      glp1AutomationNextPayoutTick: null,
      coffeeMoraleAppliedDayNumber: 0,
      lastEvsRoomCleanupAtTick: null,
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
      ambientCadenceVersion: 1,
      guidanceTips: createGuidanceTipsState(0),
      lastPatientArrivalTick: null,
      conditionActiveSinceTicks: {},
      conditionLastEmittedTicks: {},
      lastComplaintAlertTick: null,
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
    case "OPEN_EMPLOYEE_DISCUSSION":
      return reduceOpenEmployeeDiscussion(state, command, context);
    case "CLOSE_EMPLOYEE_DISCUSSION":
      return reduceCloseEmployeeDiscussion(state, command, context);
    case "SUBMIT_EMPLOYEE_DISCUSSION_ANSWER":
      return reduceSubmitEmployeeDiscussionAnswer(state, command, context);
    case "ACKNOWLEDGE_EMPLOYEE_DISCUSSION_FEEDBACK":
      return reduceAcknowledgeEmployeeDiscussionFeedback(state, command);
    case "FILE_EMPLOYEE_DISCUSSION":
      return reduceFileEmployeeDiscussion(state, command, context);
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
    case "TRAIN_EMPLOYEE":
      return reduceTrainEmployee(state, command, context);
    case "COLLECT_LITTER":
      return reduceCollectLitter(state, command, context);
    case "REFILL_WATER_COOLER":
      return reduceRefillWaterCooler(state, command, context);
    case "PRAISE_EMPLOYEE":
      return reducePraiseEmployee(state, command, context);
    case "MOVE_FOUNDER":
      return reduceMoveFounder(state, command, context);
    case "SEAT_FOUNDER_AT_FRONT_DESK":
      return reduceSeatFounderAtFrontDesk(state, command, context);
    case "SEAT_FOUNDER_IN_CHAIR":
      return reduceSeatFounderInChair(state, command, context);
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
    case "SET_SERVICE_APPOINTMENTS_ENABLED": {
      const next = clonePlain(state);
      next.serviceAppointmentsEnabled = command.enabled;
      if (!command.enabled) next.nextServiceAppointmentTicks = {};
      return recordReceipt(
        next,
        command,
        "applied",
        command.enabled
          ? "Service appointments enabled."
          : "Service appointments disabled.",
      );
    }
    case "START_SERVICE_OPERATION": {
      const next = clonePlain(state);
      const operationId = startServiceOperation(
        next,
        command.incomeLineId,
        command.actorKind ?? "visitor",
        context,
      );
      return operationId
        ? recordReceipt(next, command, "applied", `Service operation ${operationId} scheduled.`)
        : rejectCommand(state, command, "That service operation is not currently eligible.");
    }
    case "START_RETAIL_PURCHASE": {
      const next = clonePlain(state);
      const retailOperationId = startRetailPurchase(next, command.incomeLineId, command.actorKind, command.actorId, context, command.authorizedOrderId);
      return retailOperationId
        ? recordReceipt(next, command, "applied", `Retail trip ${retailOperationId} started.`)
        : rejectCommand(state, command, "That purchase is not currently eligible.");
    }
    case "AUTHORIZE_RETAIL_ORDER": {
      const next = clonePlain(state);
      return authorizeRetailOrder(next, command.orderId, command.incomeLineId, command.actorKind, command.actorId, command.allowance, context)
        ? recordReceipt(next, command, "applied", `Retail order ${command.orderId} authorized.`)
        : rejectCommand(state, command, "That retail order is invalid or already exists.");
    }
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
  // An unpaused tick already synchronized both condition histories as its
  // final simulation step. A second whole-facility evaluation of the same state
  // only adds per-minute main-thread work.
  if (command.type === "ADVANCE_TICK" && !state.paused) {
    return next;
  }
  // Facility conditions can change through paused build/staff commands as
  // well as through simulation time. Reconcile every applied/rejected clone so
  // history and attention clear at the exact persisted facility tick.
  synchronizeFacilityConditionOccurrences(next, context);
  synchronizeFacilityOperationalAlertOccurrences(next, context);
  return next;
}
