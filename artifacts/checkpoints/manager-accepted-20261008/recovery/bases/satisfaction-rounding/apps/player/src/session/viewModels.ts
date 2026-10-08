import {
  PROTOTYPE_DOMAIN_CONTEXT,
  TUTORIAL_ENCOUNTER_ID,
  getFounderBreakSeatClaim,
  isFounderSeatOccupied,
  listFounderSeats,
  getAnswerChoiceServicePreview,
  getDiagnosticOrderTiming,
  getDisplayedClinicSatisfaction,
  getFacilityAccessValidation,
  getFacilityProgressionStatus,
  getPlacedRoomIdleSpotAt,
  getFacilityClock,
  getCurrentQuestion,
  getCurrentCapabilities,
  getEmergencyGlp1Status,
  getEmployeeRoleTrainingPercent,
  getEmployeeTrainingMoney,
  getOperationalGlp1AutomationCapacity,
  getEncounterSettlement,
  getEncounterPatientLocation,
  getLearningSummary,
  getNextRoomUpgradeCost,
  getOperatingExpensePerFacilityHour,
  isEmployeeOperational,
  isEmployeeAssignedToOperationalRoom,
  isRoomOperationalForFacilityWork,
  getPatientLists,
  getEmployeeDiscussionLists,
  getEmployeeDiscussionBlockedReason,
  getPendingPatientRoutePresentation,
  getPatientAmenityTrip,
  getPendingResultEta,
  getRotatedFootprint,
  getRoomDefinition,
  getRoomInstanceFootprint,
  getRoomNavigationAnchor,
  getRoomStandingWaitingAnchors,
  getRoomWaitingAnchors,
  getRoomCareAnchor,
  getGlp1NursePractitionerStation,
  getRoomResaleValue,
  getRoomSalePreview,
  getRoomStaffCapacity,
  getRemoteWorkQueueAvailability,
  getLevelThreeSupportStatus,
  getServiceIncomeTotalsCents,
  getStaffRoleDefinition,
  getWorkloadSnapshot,
  validateDoorPlacement,
  type CardinalDirection,
  type EncounterState,
  type GameState,
  type GridPoint,
  type PatientListItem,
  type RoomOrientation,
  type ServiceOperationState,
} from "@gamify-surgery/game-domain";
import { DIAGNOSTIC_READING_WORKSTATIONS, SERVICE_INCOME_CATALOG, getCurrentRoomUpgradeDefinition } from "@gamify-surgery/balance-config";
import type { FacilityActorSupportRole } from "../facility/types";
import { isTouchupImagingDimRoom } from "../facility/roomTouchups";
import type { FacilityBuildDoorSlotView, FacilityViewModel } from "../facility";
import { createMessageBoardView } from "./alertViewModels";
import {
  normalizeFrozenClinicalText,
  splitClinicalDecisionStem,
} from "./clinicalText";
import { getFounderActivityLabel } from "./founderActivityPresentation";
import {
  describeRoomUpgradeBenefit,
  letteredRoomNames,
  roomBuildCategory,
  roomBuildPurpose,
  roomBuildSortKey,
} from "./buildModePresentation";
import { createPatientAvailabilityGuidance } from "./patientAvailabilityViewModel";
import { createEmployeeTrainingView } from "./employeeTrainingViewModels";
import { formatFacilityDuration } from "./facilityDuration";
import {
  diagnosticChoiceTimingPresentation,
  diagnosticPendingPresentation,
} from "./diagnosticTimingPresentation";
import {
  createManagementFinanceView,
  createRoleTrainingSummary,
  createRoleAverageAfterTrainingLabel,
  createServiceSetupState,
  createStaffTrainingOverview,
  facilityTimeLabel,
  serviceArrivalLabel,
} from "./managementViewModels";
import {
  isQuestionFlagOpen,
  type QuestionReviewFlag,
} from "./questionReviewFlags";
import type {
  AdvertisingView,
  ChartView,
  DevelopmentView,
  ProcedureSetupRequirementView,
  EmergencyGlp1View,
  MessageBoardItemView,
  PatientFolder,
  PatientTabView,
  ProgressionView,
  ResourceBarView,
  ServiceIncomeView,
  RoomBuildOptionView,
  SelectedRoomBuildView,
  StaffRoleGroupView,
  StaffHireOptionView,
  StaffTrainingOverviewView,
} from "../ui";
import type {
  EmployeeDiscussionTabView,
  EmployeeDiscussionView,
  LockedRoomBuildView,
  OwnedRoomBuildView,
} from "../ui/types";

export interface PrototypePlayerView {
  resourceBar: ResourceBarView;
  patients: PatientTabView[];
  /** Kept separate until the patient-list component accepts discriminated rows. */
  employeeDiscussionRows: EmployeeDiscussionTabView[];
  employeeDiscussion: EmployeeDiscussionView | null;
  chart: ChartView | null;
  facility: FacilityViewModel;
  progression: ProgressionView;
  roomOptions: RoomBuildOptionView[];
  /** Built rooms for the My Rooms tab, grouped and lettered. */
  ownedRooms: OwnedRoomBuildView[];
  /** Rooms that unlock at the next facility level, shown greyed out. */
  lockedRoomOptions: LockedRoomBuildView[];
  staffOptions: StaffHireOptionView[];
  staffRoles: StaffRoleGroupView[];
  staffTraining: StaffTrainingOverviewView | null;
  messages: MessageBoardItemView[];
  selectedRoomBuild: SelectedRoomBuildView | null;
  emergencyGlp1: EmergencyGlp1View;
  advertising: AdvertisingView;
  development: DevelopmentView;
  workloadStatus: string;
  patientAvailabilityGuidance: string | null;
  serviceIncome: ServiceIncomeView;
}

export function pendingPatientAwaitingCopy(remainsOnsite: boolean): string {
  return remainsOnsite
    ? "The patient remains in clinic while awaiting the result."
    : "The patient will return when the result is ready.";
}

function currency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getProcedureSetupRequirements(
  state: GameState,
  procedure: "endoscopy" | "ambulatory_operation",
): ProcedureSetupRequirementView[] | undefined {
  const endoscopy = procedure === "endoscopy";
  if (state.facilityLevel !== (endoscopy ? 2 : 3)) return undefined;
  const roomRequirement = (id: string): ProcedureSetupRequirementView => {
    const definition = getRoomDefinition(id)!;
    const existing = state.rooms.filter((room) => room.roomDefinitionId === id);
    const met = existing.some((room) =>
      room.roomDefinitionId === id && isRoomOperationalForFacilityWork(state, room.id),
    );
    return {
      id: `${procedure}.setup.${id}`,
      label: definition.displayName,
      detail: met
        ? `$${definition.constructionCost.toLocaleString()} build · $${definition.upkeepPerExpenseInterval.toLocaleString()}/hr upkeep`
        : existing.length > 0
          ? "Built, but needs a reachable valid layout before it can operate."
          : `$${definition.constructionCost.toLocaleString()} build · $${definition.upkeepPerExpenseInterval.toLocaleString()}/hr upkeep`,
      met,
      ...(!met && existing.length === 0 ? { action: { label: "Build" as const, target: "room" as const, id } } : {}),
    };
  };
  const staffRequirement = (id: string): ProcedureSetupRequirementView => {
    const definition = getStaffRoleDefinition(id)!;
    const hired = state.employees.filter((employee) =>
      employee.staffRoleDefinitionId === id,
    );
    const met = hired.some((employee) =>
      employee.staffRoleDefinitionId === id && isEmployeeAssignedToOperationalRoom(state, employee.id),
    );
    return {
      id: `${procedure}.setup.${id}`,
      label: definition.displayName,
      detail: met
        ? `$${definition.hiringCost.toLocaleString()} hire · $${definition.salaryPerExpenseInterval.toLocaleString()}/hr salary`
        : hired.length > 0
          ? "Hired, but their home room needs a reachable valid layout before they can operate."
          : `$${definition.hiringCost.toLocaleString()} hire · $${definition.salaryPerExpenseInterval.toLocaleString()}/hr salary`,
      met,
      ...(!met && hired.length === 0 ? { action: { label: "Hire" as const, target: "staff" as const, id } } : {}),
    };
  };
  const provider = getStaffRoleDefinition(endoscopy ? "staff.endoscopist" : "staff.surgeon")!;
  const hiredProvider = state.employees.some((employee) =>
    employee.staffRoleDefinitionId === provider.id &&
      isEmployeeAssignedToOperationalRoom(state, employee.id),
  );
  return [
    roomRequirement(endoscopy ? "room.endoscopy" : "room.ambulatory_or"),
    roomRequirement("room.periop_recovery"),
    staffRequirement(endoscopy ? "staff.endoscopy_nurse" : "staff.or_nurse"),
    staffRequirement("staff.periop_nurse"),
    {
      id: `${procedure}.setup.provider`,
      label: `${provider.displayName} or founder`,
      detail: hiredProvider
        ? `${provider.displayName} hired.`
        : endoscopy
          ? `Founder can perform endoscopy. Hire an endoscopist to keep yourself available for clinic patients. $${provider.hiringCost.toLocaleString()} hire · $${provider.salaryPerExpenseInterval.toLocaleString()}/hr salary.`
          : `Founder can perform ambulatory operations. Hire a surgeon to keep yourself available for clinic patients. $${provider.hiringCost.toLocaleString()} hire · $${provider.salaryPerExpenseInterval.toLocaleString()}/hr salary.`,
      met: true,
    },
  ];
}

function founderIsIdleAtUnstaffedFrontDesk(state: GameState): boolean {
  if (
    state.environment.founderActivity !== null ||
    state.employees.some(
      (employee) => employee.staffRoleDefinitionId === "staff.receptionist",
    ) ||
    state.retailOperations.some(
      (operation) =>
        operation.actorKind === "founder" &&
        !["completed", "abandoned", "cancelled"].includes(operation.status),
    ) ||
    state.serviceOperations.some(
      (operation) =>
        operation.providerReservation?.kind === "founder" &&
        operation.status !== "completed" &&
        operation.status !== "cancelled",
    ) ||
    Object.values(state.encounters).some((encounter) => {
      const pending = encounter.pendingResult;
      return Boolean(
          pending &&
          pending.deliveredAtTick === null &&
          pending.providerReservation?.kind === "founder" &&
          (encounter.steps[pending.originatingNodeIndex]?.status ===
            "feedback_pending" ||
            !(pending.timingPhases?.length) ||
            pending.timingPhases.some(
              (phase) =>
                phase.resourceBound && state.facilityTick < phase.endsAtTick,
            )),
      );
    })
  ) {
    return false;
  }
  const frontDesk = state.rooms.find(
    (room) => room.roomDefinitionId === "room.front_desk",
  );
  const definition = frontDesk
    ? getRoomDefinition(frontDesk.roomDefinitionId)
    : null;
  if (!frontDesk || !definition) return false;
  const desk = getRoomNavigationAnchor(frontDesk, definition, "staff");
  return (
    state.environment.founderLocation.x === desk.x &&
    state.environment.founderLocation.y === desk.y
  );
}

function humanizeIdentifier(value: string): string {
  return value
    .replace(/^(capability|room|staff)\./, "")
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function serviceOperationStatusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function operationPhase(operation: ServiceOperationState) {
  const phases = operation.frozenOperationPhases ??
    SERVICE_INCOME_CATALOG.find((line) => line.id === operation.incomeLineId)?.operation?.phases;
  return phases?.[operation.phaseIndex];
}

function periopPreparationStatusLabel(
  operation: ServiceOperationState,
): string | null {
  const phase = operationPhase(operation);
  if (
    operation.phaseFlowVersion !== 1 ||
    !phase ||
    !("roomStationId" in phase) ||
    phase.roomStationId !== "periop_preparation"
  ) {
    return null;
  }
  if (operation.status === "in_service") return "Preparing in Peri-op";
  if (operation.status === "waiting_for_next_phase") {
    return "Ready in Peri-op — waiting for procedure";
  }
  return null;
}

function encounterPeriopPreparationStatusLabel(
  state: GameState,
  encounterId: string,
): string | null {
  const operation = state.serviceOperations.find(
    (candidate) =>
      candidate.actorKind === "encounter" &&
      candidate.actorId === encounterId &&
      candidate.status !== "completed" &&
      candidate.status !== "cancelled",
  );
  return operation ? periopPreparationStatusLabel(operation) : null;
}

function pendingLocalServiceIsInProgress(
  pending: EncounterState["pendingResult"] | null | undefined,
): boolean {
  return pending?.localServiceOperation?.status === "waiting_for_service";
}

function activeEncounterOperationMovement(
  state: GameState,
  encounterId: string,
): Pick<ServiceOperationState, "path" | "pathIndex"> | null {
  const operation = state.serviceOperations.find(
    (candidate) =>
      candidate.actorKind === "encounter" &&
      candidate.actorId === encounterId &&
      [
        "walking_to_service",
        "walking_between_phases",
        "in_service",
        "waiting_for_next_phase",
      ].includes(candidate.status),
  );
  return operation ? { path: operation.path, pathIndex: operation.pathIndex } : null;
}

function signedCurrency(value: number): string {
  const sign = value >= 0 ? "+" : "-";
  return `${sign}$${Math.abs(value).toLocaleString()}`;
}

function signedPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value}% satisfaction`;
}

function buildEligibleDoorSlots(
  state: GameState,
  preferredRoomId: string | null,
): FacilityBuildDoorSlotView[] {
  const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
  const protectedRoomDefinitionIds = new Set(
    facility.protectedRoomDefinitionIds,
  );
  const physicalSegments = new Set<string>();
  const slots: FacilityBuildDoorSlotView[] = [];
  const sides: CardinalDirection[] = [
    "north",
    "east",
    "south",
    "west",
  ];

  for (const room of [...state.rooms].sort(
    (left, right) =>
      Number(right.id === preferredRoomId) -
        Number(left.id === preferredRoomId) ||
      left.id.localeCompare(right.id),
  )) {
    const definition = getRoomDefinition(room.roomDefinitionId);
    const footprint = getRoomInstanceFootprint(state, room.id);
    if (!definition || !footprint || definition.kind === "hallway") {
      continue;
    }
    const sideLengths: Record<CardinalDirection, number> = {
      north: footprint.width,
      east: footprint.height,
      south: footprint.width,
      west: footprint.height,
    };

    for (const side of sides) {
      for (let offset = 0; offset < sideLengths[side]; offset += 1) {
        const validation = validateDoorPlacement(
          {
            id: `door.preview.${room.id}.${side}.${offset}`,
            roomId: room.id,
            side,
            offset,
            exterior: false,
          },
          state.rooms,
          state.doors,
          (definitionId) => getRoomDefinition(definitionId),
          facility.gridWidth,
          facility.gridHeight,
          protectedRoomDefinitionIds,
        );
        if (!validation.valid) {
          continue;
        }
        const segmentKey =
          side === "north"
            ? `h:${room.x + offset}:${room.y}`
            : side === "south"
              ? `h:${room.x + offset}:${room.y + footprint.height}`
              : side === "west"
                ? `v:${room.x}:${room.y + offset}`
                : `v:${room.x + footprint.width}:${room.y + offset}`;
        if (physicalSegments.has(segmentKey)) {
          continue;
        }
        physicalSegments.add(segmentKey);
        slots.push({
          id: `${room.id}.${side}.${offset}`,
          roomInstanceId: room.id,
          side,
          offset,
        });
      }
    }
  }

  return slots;
}

function movementPresentation(
  path: GridPoint[] | undefined,
  pathIndex: number | undefined,
): {
  moving: boolean;
  direction: "front" | "side" | "back";
  path?: GridPoint[];
  pathIndex?: number;
} {
  if (!path || path.length < 2 || pathIndex === undefined) {
    return {
      moving: false,
      direction: "front",
      ...(path ? { path } : {}),
      ...(pathIndex === undefined ? {} : { pathIndex }),
    };
  }
  const current = path[Math.min(pathIndex, path.length - 1)];
  const next = path[Math.min(pathIndex + 1, path.length - 1)];
  if (!current || !next || (current.x === next.x && current.y === next.y)) {
    return {
      moving: false,
      direction: "front",
      path,
      pathIndex,
    };
  }
  return {
    moving: true,
    path,
    pathIndex,
    direction:
      next.x !== current.x
        ? "side"
        : next.y < current.y
          ? "back"
          : "front",
  };
}

function samePoint(left: GridPoint | null | undefined, right: GridPoint | null | undefined): boolean {
  return Boolean(left && right && left.x === right.x && left.y === right.y);
}

function patientSupportRoleForRoom(definitionId: string): FacilityActorSupportRole | undefined {
  if (definitionId === "room.examination") return "examination-patient";
  if (definitionId === "room.ultrasound") return "ultrasound-patient";
  if (definitionId === "room.minor_procedure") return "minor-procedure-patient";
  if (definitionId === "room.ct") return "ct-patient";
  if (definitionId === "room.phlebotomy") return "phlebotomy-patient";
  return undefined;
}

function getPeriopBedPatientSupport(
  state: GameState,
  operation: ServiceOperationState | undefined,
  location: GridPoint | null | undefined,
): Readonly<{ supportRole: "periop-bed-patient"; supportId: string }> | undefined {
  const reservation = operation?.periopBedFlowVersion === 1
    ? operation.periopBedReservation
    : undefined;
  const phase = operation ? operationPhase(operation) : undefined;
  if (
    !operation ||
    !reservation ||
    !location ||
    operation.pathIndex < operation.path.length - 1 ||
    !samePoint(location, reservation.endpoint) ||
    (operation?.status !== "in_service" && operation?.status !== "waiting_for_next_phase") ||
    phase?.roomDefinitionId !== "room.periop_recovery"
  ) return undefined;
  const room = state.rooms.find((candidate) => candidate.id === reservation.roomInstanceId);
  if (room?.roomDefinitionId !== "room.periop_recovery") return undefined;
  return { supportRole: "periop-bed-patient", supportId: `periop-bed:${reservation.bedId}` };
}

function clinicianSupportRoleForRoom(definitionId: string): FacilityActorSupportRole | undefined {
  if (definitionId === "room.examination") return "examination-clinician";
  if (definitionId === "room.ultrasound") return "ultrasound-clinician";
  if (definitionId === "room.minor_procedure") return "minor-procedure-clinician";
  if (definitionId === "room.ct") return "ct-operator";
  if (definitionId === "room.phlebotomy") return "phlebotomy-clinician";
  if (definitionId === "room.ambulatory_or") return "ambulatory-or-surgeon";
  if (definitionId === "room.laboratory") return "laboratory-technician";
  return undefined;
}

function pendingServiceStillOccupiesSupport(state: GameState, encounter: EncounterState): boolean {
  const pending = encounter.pendingResult;
  if (!pending || pending.deliveredAtTick !== null || pending.resourceQueue) return false;
  const completedAt = pending.onsiteReturn?.serviceCompletedAtTick ??
    pending.timingPhases?.filter((phase) => phase.resourceBound).at(-1)?.endsAtTick ??
    pending.patientTravel?.serviceCompletionTick;
  return completedAt === undefined || completedAt === null || state.facilityTick < completedAt;
}

function getPatientCareSupportRole(
  state: GameState,
  encounter: EncounterState,
  location: GridPoint | null,
): FacilityActorSupportRole | undefined {
  if (!location || encounter.patientMovement !== null) return undefined;
  const activeOperation = state.serviceOperations.find((operation) =>
    operation.actorKind === "encounter" && operation.actorId === encounter.id &&
    (operation.status === "walking_to_service" || operation.status === "in_service"),
  );
  if (activeOperation) {
    const destination = activeOperation.path.at(-1) ?? activeOperation.location;
    const room = activeOperation.reservedRoomInstanceIds
      .map((id) => state.rooms.find((candidate) => candidate.id === id))
      .find((candidate) => candidate && patientSupportRoleForRoom(candidate.roomDefinitionId));
    if (room && samePoint(location, destination) && (activeOperation.status === "in_service" || activeOperation.pathIndex >= activeOperation.path.length - 1)) {
      return patientSupportRoleForRoom(room.roomDefinitionId);
    }
  }
  const pending = encounter.pendingResult;
  const travel = pending?.patientTravel;
  if (pending && travel && pendingServiceStillOccupiesSupport(state, encounter) && samePoint(location, travel.outboundPath.at(-1))) {
    const room = state.rooms.find((candidate) => candidate.id === travel.destinationRoomInstanceId);
    if (room) return patientSupportRoleForRoom(room.roomDefinitionId);
  }
  const assignedRoom = encounter.assignedRoomInstanceId
    ? state.rooms.find((candidate) => candidate.id === encounter.assignedRoomInstanceId)
    : undefined;
  const definition = assignedRoom ? getRoomDefinition(assignedRoom.roomDefinitionId) : null;
  if (assignedRoom?.roomDefinitionId === "room.examination" && definition &&
      samePoint(location, getRoomCareAnchor(assignedRoom, definition, "patient"))) {
    return "examination-patient";
  }
  return undefined;
}

function getServiceTargetRoom(state: GameState, targetId: string, workerId?: string | "founder") {
  const operation = state.serviceOperations.find((candidate) => candidate.id === targetId);
  const operationAssigned = operation && workerId
    ? workerId === "founder"
      ? operation.providerReservation?.kind === "founder"
      : operation.reservedEmployeeIds.includes(workerId) ||
        (operation.providerReservation?.kind === "employee" && operation.providerReservation.employeeId === workerId)
    : Boolean(operation);
  if (operation && operationAssigned && !["waiting_for_resources", "leaving", "completed", "cancelled"].includes(operation.status)) {
    const activeRoomDefinitionId = operationPhase(operation)?.roomDefinitionId;
    return operation.reservedRoomInstanceIds
      .map((id) => state.rooms.find((candidate) => candidate.id === id))
      .find((room) => room &&
        (!activeRoomDefinitionId || room.roomDefinitionId === activeRoomDefinitionId) &&
        clinicianSupportRoleForRoom(room.roomDefinitionId));
  }
  for (const encounter of Object.values(state.encounters)) {
    const pending = encounter.pendingResult;
    if (pending?.operationId !== targetId || !pendingServiceStillOccupiesSupport(state, encounter)) continue;
    const pendingAssigned = !workerId || (workerId === "founder"
      ? pending.providerReservation?.kind === "founder"
      : pending.imagingTechnicianId === workerId ||
        pending.phlebotomistId === workerId ||
        (pending.providerReservation?.kind === "employee" && pending.providerReservation.employeeId === workerId));
    if (!pendingAssigned) continue;
    const roomId = pending.patientTravel?.destinationRoomInstanceId ?? encounter.assignedRoomInstanceId;
    const room = roomId ? state.rooms.find((candidate) => candidate.id === roomId) : undefined;
    if (room && clinicianSupportRoleForRoom(room.roomDefinitionId)) return room;
  }
  return undefined;
}

function roomContainingPoint(state: GameState, location: GridPoint | null | undefined) {
  if (!location) return undefined;
  return state.rooms.find((room) => {
    const footprint = getRoomInstanceFootprint(state, room.id);
    return footprint && location.x >= room.x && location.x < room.x + footprint.width &&
      location.y >= room.y && location.y < room.y + footprint.height;
  });
}

function getFounderSupportRole(state: GameState): FacilityActorSupportRole | undefined {
  const activity = state.environment.founderActivity;
  if (activity && activity.pathIndex < activity.path.length - 1) return undefined;
  if (activity && !samePoint(state.environment.founderLocation, activity.path.at(-1))) return undefined;
  if (activity?.kind === "perform_service") {
    const room = getServiceTargetRoom(state, activity.targetId, "founder");
    return room ? clinicianSupportRoleForRoom(room.roomDefinitionId) : undefined;
  }
  if (activity?.kind === "attend_encounter") {
    const encounter = state.encounters[activity.targetId];
    const room = encounter?.assignedRoomInstanceId
      ? state.rooms.find((candidate) => candidate.id === encounter.assignedRoomInstanceId)
      : undefined;
    return room ? clinicianSupportRoleForRoom(room.roomDefinitionId) : undefined;
  }
  if (activity?.kind === "sit_in_chair") {
    if (getFounderBreakSeatClaim(state)) return "staff-break-seat";
    const room = roomContainingPoint(state, state.environment.founderLocation);
    if (room?.roomDefinitionId !== "room.front_desk") return "waiting-seat";
    const definition = getRoomDefinition(room.roomDefinitionId);
    return definition && samePoint(state.environment.founderLocation, getRoomNavigationAnchor(room, definition, "staff"))
      ? "front-desk-staff"
      : "front-desk-public";
  }
  return founderIsIdleAtUnstaffedFrontDesk(state) ? "front-desk-staff" : undefined;
}

function getGlp1NursePractitionerSupportRole(
  state: GameState,
  employee: GameState["employees"][number],
): FacilityActorSupportRole | undefined {
  if (employee.staffRoleDefinitionId !== "staff.glp1_np" || employee.facilityTask) return undefined;
  if (employee.pathIndex < employee.path.length - 1) return undefined;
  if (state.retailOperations.some((operation) =>
    operation.actorKind === "employee" &&
    operation.actorId === employee.id &&
    !["completed", "abandoned", "cancelled"].includes(operation.status),
  )) return undefined;
  const homeRoom = employee.homeRoomInstanceId
    ? state.rooms.find((room) => room.id === employee.homeRoomInstanceId)
    : undefined;
  if (homeRoom?.roomDefinitionId !== "room.glp1_telehealth_suite") return undefined;
  const station = getGlp1NursePractitionerStation(state, employee, PROTOTYPE_DOMAIN_CONTEXT);
  if (!station || !samePoint(employee.location, station)) return undefined;
  const assigned = state.employees
    .filter((candidate) =>
      candidate.staffRoleDefinitionId === "staff.glp1_np" &&
      candidate.homeRoomInstanceId === homeRoom.id,
    )
    .sort((left, right) => left.id.localeCompare(right.id));
  return assigned.findIndex((candidate) => candidate.id === employee.id) === 0
    ? "glp1-np-station-1"
    : "glp1-np-station-2";
}

let learningCardDateTimeFormatter: Intl.DateTimeFormat | undefined;

function getLearningCardDateTimeFormatter(): Intl.DateTimeFormat {
  learningCardDateTimeFormatter ??= new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
  return learningCardDateTimeFormatter;
}

function formatLearningCardStatus(
  state: GameState,
  conceptId: string,
): string {
  const history = state.learningHistories[conceptId];
  const latestReview = history?.reviews.at(-1);
  if (!history || !latestReview) {
    return "New · no campaign review";
  }
  const interval =
    history.card.scheduledDays > 0
      ? `${history.card.scheduledDays} day${
          history.card.scheduledDays === 1 ? "" : "s"
        }`
      : "short learning step";
  const due = getLearningCardDateTimeFormatter().format(
    new Date(history.card.dueAtMs),
  );
  return `${latestReview.rating} · ${interval} · due ${due}`;
}

function toPatientTab(
  state: GameState,
  item: PatientListItem,
  folder: PatientFolder,
  selectedEncounterId: string | null,
): PatientTabView {
  const encounter = state.encounters[item.encounterId];
  const arrivalLabel =
    item.arrivalClass === "tutorial"
      ? "Tutorial patient"
      : item.arrivalClass === "progression_critical"
        ? "Progression patient"
        : "Routine patient";
  const pendingMinutes =
    encounter?.lifecycle === "active_pending_result" &&
    encounter.pendingResult &&
    encounter.patientMovement === null
      ? pendingLocalServiceIsInProgress(encounter.pendingResult)
        ? null
        : getPendingResultEta(state, encounter.id)
      : null;
  const pendingStatus =
    pendingMinutes === null
      ? null
      : `${
          encounter?.pendingResult?.pendingLabel ?? "Result pending"
        } · returns in ${formatFacilityDuration(pendingMinutes)}`;
  const periopStatus = encounter
    ? encounterPeriopPreparationStatusLabel(state, encounter.id)
    : null;

  return {
    id: item.encounterId,
    folder,
    name: item.patientDisplayName,
    subtitle: arrivalLabel,
    statusLabel: periopStatus ?? pendingStatus ?? item.statusLabel,
    actionRequired: item.actionRequired,
    selected: selectedEncounterId === item.encounterId,
    satisfactionPercent: item.patientSatisfaction,
    patienceLabel: `Satisfaction: ${item.patientSatisfaction}% · Waiting: ${item.waitingMinutes} min`,
    avatar: encounter?.patientAppearance,
    sortKey: encounter?.waiting.arrivedAtTick,
  };
}

export function employeeDiscussionView(state: GameState): EmployeeDiscussionView | null {
  const discussion = state.openEmployeeDiscussionId
    ? state.employeeDiscussions?.[state.openEmployeeDiscussionId] : undefined;
  if (!discussion || ["resolved", "cancelled", "waiting_unopened"].includes(discussion.lifecycle)) return null;
  const node = discussion.frozenCase.decisionNodes[discussion.currentNodeIndex];
  if (!node) return null;
  const employee = state.employees.find((item) => item.id === discussion.employeeId);
  const answer = discussion.answers.find((item) => item.decisionNodeId === node.id);
  const correct = node.answerChoices.find((item) => item.isCorrect);
  const status = discussion.lifecycle === "active_traveling" ? "traveling"
    : discussion.lifecycle === "active_action_required" ? "question"
    : discussion.lifecycle === "feedback_pending" ? "feedback" : "summary";
  const answerable = status === "traveling" || status === "question";
  return {
    id: discussion.id, employeeName: discussion.employeeDisplayName,
    roleLabel: employee ? getStaffRoleDefinition(employee.staffRoleDefinitionId)?.displayName ?? "Team member" : "Team member",
    avatar: discussion.employeeAppearance, status,
    topicLabel: discussion.frozenCase.chiefComplaint,
    presentation: discussion.frozenCase.presentation,
    reviewStatus: "Educational draft · needs clinician review",
    question: node.stem,
    // The key is revealed only after an answer exists, as on patient charts.
    choices: node.answerChoices.map((choice) => ({
      id: choice.id, label: choice.label, selected: choice.id === answer?.answerChoiceId, disabled: !answerable,
      ...(answer ? {revealedCorrect: choice.isCorrect} : {}),
    })),
    // Selected/correct choices are tagged on the answer rows, so the body is the teaching text alone.
    feedbackTitle: answer ? (answer.correct ? "Correct" : "Incorrect") : undefined,
    feedback: answer ? answer.explanation || node.explanation : undefined,
    correctAnswerText: correct?.label,
    finalStep: discussion.currentNodeIndex >= discussion.frozenCase.decisionNodes.length - 1,
  };
}

function employeeDiscussionRows(state: GameState): EmployeeDiscussionTabView[] {
  const lists = getEmployeeDiscussionLists(state);
  const folders: Array<[keyof typeof lists, PatientFolder]> = [
    ["waiting", "waiting"], ["active", "active"], ["resolved", "resolved"],
  ];
  return folders.flatMap(([listName, folder]) => lists[listName].map((item) => {
    const discussion = state.employeeDiscussions?.[item.discussionId];
    const employee = state.employees.find((candidate) => candidate.id === item.employeeId);
    const blockedReason = getEmployeeDiscussionBlockedReason(state, item.discussionId);
    return {
      subjectKind: "employee-discussion" as const,
      id: item.discussionId, employeeId: item.employeeId, folder,
      name: item.employeeDisplayName,
      roleLabel: employee ? getStaffRoleDefinition(employee.staffRoleDefinitionId)?.displayName ?? "Team member" : "Team member",
      statusLabel: item.statusLabel, actionRequired: item.actionRequired,
      selected: state.openEmployeeDiscussionId === item.discussionId,
      ...(blockedReason ? { blockedReason } : {}),
      avatar: discussion?.employeeAppearance,
      sortKey: item.createdAtFacilityTick,
    };
  }));
}

function encounterStatus(encounter: EncounterState): string {
  if (encounter.checkInStatus === "awaiting_staff") {
    return "Waiting to Check In";
  }
  if (encounter.patientMovement) {
    switch (encounter.patientMovement.kind) {
      case "arriving_for_check_in":
        return "Walking to Check-In";
      case "walking_to_care":
        return "Walking to Examination";
      case "walking_to_waiting":
        return "Walking to Waiting Area";
      case "departing_for_offsite_testing":
        return encounter.pendingResult?.externalProcessingOnly
          ? "Leaving while results process"
          : "Leaving for Testing";
      case "returning_from_offsite_testing":
        return encounter.pendingResult?.externalProcessingOnly
          ? "Returning for Results"
          : "Returning to Clinic";
      case "idle_within_room":
        break;
      case "leaving_after_resolution":
      case "leaving_after_walkout":
        return "Leaving Clinic";
    }
  }
  switch (encounter.lifecycle) {
    case "waiting_unopened":
      return "Waiting";
    case "active_action_required":
      return "Action required";
    case "active_pending_result":
      return encounter.stagedResultOrder?.status === "returning_to_front_desk"
        ? "Returning to Front Desk after local testing"
        : encounter.stagedResultOrder?.status === "waiting_for_component"
          ? "Local test component in progress"
      : encounter.testOnlyContinuation?.status === "returning_to_front_desk"
        ? "Returning to Front Desk after collection"
        : encounter.testOnlyContinuation?.status === "waiting_for_service"
          ? "Collection in progress"
          : "Result pending";
    case "resolved_summary_available":
      return "Encounter complete";
    case "resolved":
      return encounter.resolutionReason === "walkout"
        ? "Walked out"
        : "Resolved";
  }
}

function createChartView(
  state: GameState,
  encounterId: string | null,
  summaryVisible: boolean,
  questionReviewFlags: readonly QuestionReviewFlag[],
): ChartView | null {
  if (encounterId === null) {
    return null;
  }
  const encounter = state.encounters[encounterId];
  if (!encounter) {
    return null;
  }
  const periopStatus = encounterPeriopPreparationStatusLabel(state, encounter.id);

  // A patient who was never opened must not reveal the unseen question,
  // answers, explanation, outcome, or learning summary.
  if (encounter.resolutionReason === "walkout") {
    return {
      id: encounter.id,
      patientName: encounter.patientDisplayName,
      patientDetails: `Final satisfaction: ${encounter.finalPatientSatisfaction ?? encounter.patientSatisfaction}%`,
      statusLabel: "Walked out",
      presentation: "The patient left before the encounter was completed.",
      answerChoices: [],
      terminalFeedbackNeedsAcknowledgment: false,
      summaryAvailable: false,
      summaryVisible: false,
      canFile: true,
      readOnly: true,
    };
  }

  const question = getCurrentQuestion(state, encounter.id);
  const pendingEta = pendingLocalServiceIsInProgress(encounter.pendingResult)
    ? null
    : getPendingResultEta(state, encounter.id);
  const activeTestOnlyContinuation =
    encounter.lifecycle === "active_pending_result" &&
    (encounter.testOnlyContinuation?.status === "waiting_for_service" ||
      encounter.testOnlyContinuation?.status === "returning_to_front_desk")
      ? encounter.testOnlyContinuation
      : null;
  const activeStagedResult =
    encounter.lifecycle === "active_pending_result" &&
    (encounter.stagedResultOrder?.status === "waiting_for_component" ||
      encounter.stagedResultOrder?.status === "returning_to_front_desk")
      ? encounter.stagedResultOrder
      : null;
  const activeStagedComponent = activeStagedResult
    ? activeStagedResult.components[activeStagedResult.currentComponentIndex]
    : null;
  const learningSummary = getLearningSummary(state, encounter.id);
  const lastAnswer = encounter.answers.at(-1);
  const answerForQuestion = question
    ? encounter.answers.find(
        (answer) => answer.decisionNodeId === question.node.id,
      )
    : undefined;
  const terminalFeedback = encounter.terminalFeedback;
  const currentStep =
    encounter.steps[encounter.currentNodeIndex] ?? null;
  const diagnosticTiming = getDiagnosticOrderTiming(state, encounter.id);
  const diagnosticPresentation = diagnosticTiming
    ? diagnosticPendingPresentation(
        diagnosticTiming,
        encounter.pendingResult?.diagnosticTiming?.orderId === diagnosticTiming.orderId
          ? encounter.pendingResult.resultNarrative : "",
        formatFacilityDuration,
      )
    : null;
  const showDiagnosticPending = diagnosticPresentation?.hasPendingWork === true &&
    currentStep?.status !== "feedback_pending";
  const showInterimFeedback =
    currentStep?.status === "feedback_pending" &&
    lastAnswer !== undefined;
  const feedbackBody = terminalFeedback
    ? (terminalFeedback.correction ?? lastAnswer?.explanation)
    : showInterimFeedback
      ? lastAnswer.explanation
      : undefined;
  const feedbackTitle =
    lastAnswer?.correct === true
      ? "Correct"
      : lastAnswer
        ? "Incorrect"
        : undefined;
  const terminalOutcome = terminalFeedback?.outcome ?? null;
  const terminalConsequence =
    terminalOutcome?.narrative ?? terminalFeedback?.consequence ?? null;
  const intermediateFeedbackNeedsAcknowledgment =
    currentStep?.status === "feedback_pending";
  const terminalFeedbackNeedsAcknowledgment =
    (terminalFeedback !== null && !terminalFeedback.acknowledged) ||
    intermediateFeedbackNeedsAcknowledgment;
  const summaryAvailable = learningSummary !== null;
  const readOnly = encounter.lifecycle === "resolved";
  const canFile =
    readOnly ||
    (encounter.lifecycle === "resolved_summary_available" &&
      terminalFeedback?.acknowledged === true);

  const decisionSteps = encounter.steps
    .filter((step) => step.status !== "locked")
    .map((step) => {
      const node = encounter.frozenCase.decisionNodes[step.nodeIndex];
      if (!node) {
        return null;
      }
      const isCurrentNode =
        step.nodeIndex === encounter.currentNodeIndex;
      const decisionAvailableDuringMovement =
        encounter.patientMovement === null ||
        encounter.patientMovement.kind === "walking_to_care";
      const isCurrent =
        isCurrentNode &&
        encounter.lifecycle !== "resolved" &&
        (encounter.lifecycle === "resolved_summary_available" ||
          (encounter.lifecycle === "active_action_required" &&
            decisionAvailableDuringMovement));
      const questionIsVisible =
        step.status !== "action_required" || isCurrent;
      const answer = step.answer;
      const result = step.result;
      const visibleResult =
        step.status === "feedback_pending" ? null : result;
      const resultDelivered =
        visibleResult !== null &&
        visibleResult.deliveredAtTick !== null;
      const diagnosticForStep = visibleResult?.diagnosticTiming && diagnosticTiming &&
        visibleResult.diagnosticTiming.orderId === diagnosticTiming.orderId &&
        (isCurrent || diagnosticPresentation?.hasPendingWork)
          ? diagnosticPresentation : null;
      const selectedAnswerLabel = answer
        ? (node.answerChoices.find(
            (choice) => choice.id === answer.answerChoiceId,
          )?.label ?? "Decision recorded")
        : undefined;
      const correctAnswerLabel = node.answerChoices.find(
        (choice) => choice.isCorrect,
      )?.label;
      const feedbackBody =
        answer === null
          ? undefined
          : answer.correct
            ? answer.explanation
            : correctAnswerLabel
              ? `Correct answer: ${correctAnswerLabel}. ${answer.explanation}`
              : answer.explanation;
      const precedingDeliveredResult =
        step.nodeIndex > 0
          ? encounter.steps[step.nodeIndex - 1]?.result
          : null;
      const fallbackCurrentUpdate =
        precedingDeliveredResult?.deliveredAtTick != null
          ? precedingDeliveredResult.resultNarrative
          : undefined;
      const decisionText = splitClinicalDecisionStem(
        normalizeFrozenClinicalText({
          clinicalCaseId: encounter.frozenCase.id,
          patientDisplayName: encounter.patientDisplayName,
          text: node.stem,
          field: "stem",
          decisionNodeId: node.id,
          questionVariantId: node.questionVariantId,
        }) ?? node.stem,
      );
      return {
        id: step.decisionNodeId,
        questionVariantId: step.questionVariantId,
        primaryConceptId: step.primaryConceptId,
        flaggedForDeveloperReview: isQuestionFlagOpen(
          questionReviewFlags,
          {
            clinicalReleaseId: encounter.clinicalReleaseId,
            clinicalCaseId: encounter.frozenCase.id,
            patientPresentationVariantId:
              encounter.frozenCase.patientPresentationVariantId,
            selectedInstantiationProfileId:
              encounter.frozenCase.selectedInstantiationProfileId ?? null,
            questionVariantId: step.questionVariantId,
            patientPresentation: encounter.frozenCase.presentation,
            stem: node.stem,
            answerChoices: node.answerChoices,
            explanation: node.explanation,
          },
        ),
        heading: `Decision ${step.nodeIndex + 1} of ${
          encounter.frozenCase.decisionNodes.length
        }`,
        statusLabel:
          step.status === "action_required" && !isCurrent
            ? "Patient en route"
            : step.status === "result_pending"
            ? diagnosticForStep?.statusLabel ?? (result?.patientTravel || pendingLocalServiceIsInProgress(result)
              ? "Onsite care in progress"
              : result?.offsiteTravel
                ? "External service in progress"
                : "Awaiting result")
            : step.status === "feedback_pending"
              ? "Review feedback"
            : step.status === "action_required"
              ? undefined
              : "Complete",
        questionPrompt: questionIsVisible
          ? decisionText.question
          : undefined,
        answerChoices: questionIsVisible ? node.answerChoices.map((choice) => {
          const preview =
            isCurrent && answer === null
              ? getAnswerChoiceServicePreview(
                  state,
                  encounter.id,
                  choice.id,
                )
              : null;
          return {
            id: choice.id,
            label: choice.label,
            selected: answer?.answerChoiceId === choice.id,
            disabled:
              answer !== null ||
              !isCurrent ||
              terminalFeedbackNeedsAcknowledgment ||
              readOnly,
            ...diagnosticChoiceTimingPresentation(preview, state.facilityTick, formatFacilityDuration),
            ...(answer !== null && choice.isCorrect ? { revealedCorrect: true } : {}),
          };
        }) : [],
        resultHeading:
          (!isCurrent && !diagnosticForStep) || visibleResult === null
            ? undefined
            : diagnosticForStep
              ? diagnosticForStep.heading
            : resultDelivered
              ? "Result returned"
              : visibleResult.pendingLabel,
        resultSummary: diagnosticForStep && visibleResult !== null ? diagnosticForStep.summary : undefined,
        resultPhases: diagnosticForStep && visibleResult !== null ? diagnosticForStep.phases : undefined,
        resultBody:
          (!isCurrent && !diagnosticForStep) || visibleResult === null
            ? undefined
            : diagnosticForStep
              ? diagnosticForStep.body
            : resultDelivered
              ? visibleResult.resultNarrative
              : `${visibleResult.routeDisplayName}. ${pendingPatientAwaitingCopy(
                  Boolean(
                    visibleResult.resourceQueue ||
                    visibleResult.patientRemainsOnsite ||
                    visibleResult.patientTravel,
                  ),
                )}`,
        etaLabel:
          diagnosticForStep
            ? diagnosticForStep.etaLabel
          : visibleResult && !resultDelivered && !visibleResult.resourceQueue && !visibleResult.diagnosticTiming
            ? `${formatFacilityDuration(
                Math.max(
                  0,
                  visibleResult.dueTick - state.facilityTick,
                ),
              )} remaining`
            : undefined,
        feedbackTitle:
          answer === null
            ? undefined
            : answer.correct
              ? "Correct"
              : "Incorrect",
        feedbackBody,
        rewardLabel: answer
          ? `Decision XP: +${
              answer.correct
                ? encounter.id === TUTORIAL_ENCOUNTER_ID
                  ? PROTOTYPE_DOMAIN_CONTEXT.balanceRelease
                      .clinicalSettlement
                      .firstTutorialCorrectDecisionXp
                  : PROTOTYPE_DOMAIN_CONTEXT.balanceRelease
                      .clinicalSettlement
                      .clinicalXpPerCorrectFirstAnswer
                : PROTOTYPE_DOMAIN_CONTEXT.balanceRelease
                    .clinicalSettlement
                    .clinicalXpPerIncorrectFirstAnswer
            }`
          : undefined,
        nextActionLabel:
          answer && step.status === "feedback_pending"
            ? result
              ? `${
                  answer.correct ? "Next" : "Corrected plan"
                }: ${result.routeDisplayName} will begin after you continue.`
              : step.nodeIndex ===
                  encounter.frozenCase.decisionNodes.length - 1
                ? "Next: review the encounter outcome, then close the chart."
                : "Next: continue to the following clinical decision."
            : undefined,
        collapsedResultLabel: answer
          ? `${
              answer.correct ? "Correct" : "Incorrect"
            } — ${selectedAnswerLabel}${diagnosticForStep?.pathologyPending ? " · Collected pathology pending" : ""}`
          : undefined,
        currentUpdate: isCurrent
          ? normalizeFrozenClinicalText({
              clinicalCaseId: encounter.frozenCase.id,
              patientDisplayName: encounter.patientDisplayName,
              text: node.currentUpdate ?? fallbackCurrentUpdate,
              field: "currentUpdate",
              decisionNodeId: node.id,
              questionVariantId: node.questionVariantId,
            })
          : undefined,
        current: isCurrent,
        complete: step.status === "completed",
      };
    })
    .filter((step) => step !== null);
  const settlement = getEncounterSettlement(state, encounter.id);
  const currentNode =
    encounter.frozenCase.decisionNodes[encounter.currentNodeIndex];
  const currentDecisionText = currentNode
    ? splitClinicalDecisionStem(
        normalizeFrozenClinicalText({
          clinicalCaseId: encounter.frozenCase.id,
          patientDisplayName: encounter.patientDisplayName,
          text: currentNode.stem,
          field: "stem",
          decisionNodeId: currentNode.id,
          questionVariantId: currentNode.questionVariantId,
        }) ?? currentNode.stem,
      )
    : null;

  return {
    id: encounter.id,
    clinicalCaseId: encounter.frozenCase.id,
    patientName: encounter.patientDisplayName,
    patientDetails:
      encounter.arrivalClass === "tutorial"
        ? "Tutorial patient"
        : "Clinic patient",
    ageLabel: encounter.frozenCase.prototypeDemographics
      ? `${encounter.frozenCase.prototypeDemographics.ageYears} years`
      : undefined,
    sexLabel:
      encounter.frozenCase.prototypeDemographics?.sexLabel,
    chiefComplaint: normalizeFrozenClinicalText({
      clinicalCaseId: encounter.frozenCase.id,
      patientDisplayName: encounter.patientDisplayName,
      text: encounter.frozenCase.chiefComplaint,
      field: "chiefComplaint",
    }),
    patientSatisfactionLabel: `${encounter.patientSatisfaction}%`,
    vitals: encounter.frozenCase.prototypeVitalSigns
      ? [
          {
            id: "heart-rate",
            label: "HR",
            value: `${encounter.frozenCase.prototypeVitalSigns.heartRateBpm}`,
            icon: "heart" as const,
          },
          {
            id: "blood-pressure",
            label: "BP",
            value: `${encounter.frozenCase.prototypeVitalSigns.systolicBloodPressureMmHg}/${encounter.frozenCase.prototypeVitalSigns.diastolicBloodPressureMmHg}`,
            icon: "pressure" as const,
          },
          {
            id: "temperature",
            label: "Temp",
            value: `${encounter.frozenCase.prototypeVitalSigns.temperatureF.toFixed(1)} °F`,
            icon: "temperature" as const,
          },
          {
            id: "oxygen",
            label: "SpO₂",
            value: `${encounter.frozenCase.prototypeVitalSigns.oxygenSaturationPercent}%`,
            icon: "oxygen" as const,
          },
        ]
      : undefined,
    statusLabel: encounter.lifecycle === "active_pending_result" && diagnosticPresentation
      ? diagnosticPresentation.statusLabel : periopStatus ?? encounterStatus(encounter),
    presentation: normalizeFrozenClinicalText({
      clinicalCaseId: encounter.frozenCase.id,
      patientDisplayName: encounter.patientDisplayName,
      text: encounter.frozenCase.presentation,
      field: "presentation",
      selectedInstantiationProfileId:
        encounter.frozenCase.selectedInstantiationProfileId,
    }) ?? encounter.frozenCase.presentation,
    presentationUpdate:
      encounter.currentNodeIndex > 0
        ? currentDecisionText?.context
        : undefined,
    pendingLabel:
      showDiagnosticPending
        ? diagnosticPresentation!.body
      : encounter.lifecycle === "active_pending_result"
        ? activeStagedResult && activeStagedComponent
          ? activeStagedResult.status === "returning_to_front_desk"
            ? `Returning to Front Desk after ${activeStagedComponent.routeDisplayName}. ${activeStagedComponent.externalRemainder}`
            : `${activeStagedComponent.routeDisplayName} in progress. ${activeStagedComponent.externalRemainder}`
        : activeTestOnlyContinuation
          ? activeTestOnlyContinuation.status === "returning_to_front_desk"
            ? `Returning to Front Desk after ${activeTestOnlyContinuation.routeDisplayName}. ${activeTestOnlyContinuation.externalRemainder}`
            : `${activeTestOnlyContinuation.routeDisplayName} in progress. ${activeTestOnlyContinuation.externalRemainder}`
          : pendingLocalServiceIsInProgress(encounter.pendingResult)
            ? `${encounter.pendingResult?.routeDisplayName ?? "Onsite service"} in progress.`
          : `${encounter.pendingResult?.pendingLabel ?? "Result pending"} via ${
              encounter.pendingResult?.routeDisplayName ?? "approved route"
            }`
        : undefined,
    pendingSummary: showDiagnosticPending ? diagnosticPresentation!.summary : undefined,
    pendingPhases: showDiagnosticPending ? diagnosticPresentation!.phases : undefined,
    pendingPatientIsAway:
      showDiagnosticPending
        ? encounter.patientLocation === null
      : encounter.lifecycle === "active_pending_result"
        ? activeStagedResult
          ? false
        : activeTestOnlyContinuation
          ? false
          : !(
            encounter.pendingResult?.resourceQueue ||
            pendingLocalServiceIsInProgress(encounter.pendingResult) ||
            encounter.pendingResult?.patientRemainsOnsite ||
            encounter.pendingResult?.patientTravel
          )
        : undefined,
    etaLabel:
      showDiagnosticPending
        ? diagnosticPresentation!.etaLabel
      : pendingEta === null
        ? undefined
        : `${formatFacilityDuration(pendingEta)} remaining`,
    questionPrompt: question
      ? splitClinicalDecisionStem(
          normalizeFrozenClinicalText({
            clinicalCaseId: encounter.frozenCase.id,
            patientDisplayName: encounter.patientDisplayName,
            text: question.node.stem,
            field: "stem",
            decisionNodeId: question.node.id,
            questionVariantId: question.node.questionVariantId,
          }) ?? question.node.stem,
        ).question
      : undefined,
    answerChoices:
      question?.node.answerChoices.map((choice) => {
        const preview =
          answerForQuestion === undefined
            ? getAnswerChoiceServicePreview(
                state,
                encounter.id,
                choice.id,
              )
            : null;
        return {
          id: choice.id,
          label: choice.label,
          selected: answerForQuestion?.answerChoiceId === choice.id,
          disabled:
            answerForQuestion !== undefined ||
            terminalFeedbackNeedsAcknowledgment ||
            readOnly,
          ...diagnosticChoiceTimingPresentation(preview, state.facilityTick, formatFacilityDuration),
        };
      }) ?? [],
    feedbackTitle,
    feedbackBody,
    terminalOutcomeTitle: terminalConsequence ? "What happened" : undefined,
    terminalOutcomeBody: terminalConsequence ?? undefined,
    terminalOutcomeSeverity: terminalOutcome?.severity,
    terminalFeedbackNeedsAcknowledgment,
    summaryAvailable,
    summaryVisible: summaryAvailable && summaryVisible,
    summaryBody: learningSummary ?? undefined,
    canFile,
    readOnly,
    avatar: encounter.patientAppearance,
    decisionSteps,
    reward: settlement
      ? {
          heading: `Decisions Correct: ${settlement.correctAnswers}/${
            settlement.correctAnswers + settlement.incorrectAnswers
          }`,
          moneyLabel: `Encounter Payment: ${signedCurrency(
            settlement.netCashDelta,
          )}`,
          xpLabel: `Encounter XP: +${settlement.clinicalXpAwarded}`,
        }
      : undefined,
    primaryActionLabel: terminalFeedbackNeedsAcknowledgment
      ? intermediateFeedbackNeedsAcknowledgment
        ? encounter.pendingResult
          ? lastAnswer?.correct
            ? "Enact Plan"
            : "Enact Corrected Plan"
          : "Enact Plan"
        : "Dismiss and close chart"
      : encounter.lifecycle === "active_pending_result"
        ? "Return to clinic"
        : undefined,
    primaryActionClosesChart:
      terminalFeedbackNeedsAcknowledgment &&
      !intermediateFeedbackNeedsAcknowledgment,
  };
}

/**
 * Equivalent to a stable newest-first sort followed by `slice(0, limit)`, but
 * linear in the receipt history that is re-projected on every facility tick.
 */
export function newestServiceIncomeReceipts<
  Receipt extends { completedAtFacilityTick: number },
>(receipts: readonly Receipt[], limit: number): Receipt[] {
  const newest: Receipt[] = [];
  for (const receipt of receipts) {
    let index = newest.length;
    while (
      index > 0 &&
      newest[index - 1]!.completedAtFacilityTick <
        receipt.completedAtFacilityTick
    ) {
      index -= 1;
    }
    if (index >= limit) continue;
    newest.splice(index, 0, receipt);
    if (newest.length > limit) newest.pop();
  }
  return newest;
}

export function createPrototypePlayerView(
  state: GameState,
  selectedEncounterId: string | null,
  summaryVisible: boolean,
  selectedRoomDefinitionId: string | null,
  buildMode = false,
  selectedRoomInstanceId: string | null = null,
  placementOrientation: RoomOrientation = 0,
  camera: FacilityViewModel["camera"] = {
    zoom: 1,
    panX: 0,
    panY: 0,
  },
  questionReviewFlags: readonly QuestionReviewFlag[] = [],
): PrototypePlayerView {
  const lists = getPatientLists(state);
  // One pass over service history instead of one pass per resolved patient.
  const encounterIdsWithActiveServiceOperation = new Set(
    state.serviceOperations
      .filter(
        (operation) =>
          operation.actorKind === "encounter" &&
          operation.status !== "completed" &&
          operation.status !== "cancelled",
      )
      .map((operation) => operation.actorId),
  );
  const workload = getWorkloadSnapshot(state);
  const progressionStatus = getFacilityProgressionStatus(state);
  const facilityBalance =
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
  const initialRoomInstanceIds = new Set(
    facilityBalance.initialRooms.map((room) => room.id),
  );
  // Build Mode presentation: lettered names, live access and each room's
  // purchased catalog benefits.
  const buildRoomNames = letteredRoomNames(
    state.rooms,
    (roomDefinitionId) =>
      getRoomDefinition(roomDefinitionId)?.displayName ?? roomDefinitionId,
  );
  const buildUnreachableRoomIds = new Set(
    buildMode ? getFacilityAccessValidation(state).unreachableRoomIds : [],
  );
  const roomUpgradeable = (roomDefinitionId: string): boolean => {
    const definition = getRoomDefinition(roomDefinitionId);
    return Boolean(
      definition?.buildable && definition.maximumUpgradeLevel > 1 &&
        getCurrentRoomUpgradeDefinition(roomDefinitionId)?.upgradeCosts.length,
    );
  };
  const roomUpgradeBenefit = (room: GameState["rooms"][number]) => {
    const definition = getRoomDefinition(room.roomDefinitionId);
    return definition && roomUpgradeable(room.roomDefinitionId)
      ? describeRoomUpgradeBenefit({
          roomDefinitionId: room.roomDefinitionId,
          upgradeLevel: room.upgradeLevel,
          maxUpgradeLevel: definition.maximumUpgradeLevel,
          upkeepPerLevel: definition.upkeepPerUpgradeLevel,
        })
      : undefined;
  };
  const placedRoomDefinitionIds = new Set(
    state.rooms.map((room) => room.roomDefinitionId),
  );
  const hasGlp1StaffingSlot = state.rooms.some(
    (room) =>
      room.roomDefinitionId === "room.glp1_telehealth_suite" &&
      isRoomOperationalForFacilityWork(state, room.id) &&
      state.employees.filter(
        (employee) =>
          employee.staffRoleDefinitionId === "staff.glp1_np" &&
          employee.homeRoomInstanceId === room.id,
      ).length < 2,
  );
  const clock = getFacilityClock(state);
  const emergencyGlp1Status = getEmergencyGlp1Status(state);
  const glp1AutomationCapacity = getOperationalGlp1AutomationCapacity(state);
  const glp1ConsultPayment = getEmployeeTrainingMoney(
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment.glp1AutomationPayment,
    getEmployeeRoleTrainingPercent(state, "staff.glp1_np"),
    "increase",
  );
  const nextGlp1PayoutTick = state.environment.glp1AutomationNextPayoutTick;
  const advertisingLevels =
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.advertising.levels;
  const currentAdvertising =
    advertisingLevels.find((level) => level.level === state.advertisingLevel) ??
    advertisingLevels[0]!;
  const advertisingFrequencyLabel = (intervalPercent: number): string => {
    const increasePercent = Math.round(10_000 / intervalPercent - 100);
    return `+${Math.max(0, increasePercent)}% arrival frequency`;
  };
  const effectiveSatisfaction = getDisplayedClinicSatisfaction(state);
  const currentCapabilities = getCurrentCapabilities(state);
  // Retail borrows the actor already in the facility. Its live trip is only a
  // movement overlay, never a second patient, employee, or founder sprite.
  const retailTripPresentation = (actorKind: string, actorId: string) => {
    const trip = state.retailOperations.find(
      (operation) =>
        operation.actorKind === actorKind &&
        operation.actorId === actorId &&
        !["completed", "abandoned", "cancelled"].includes(operation.status),
    );
    return trip
      ? { location: trip.location, ...movementPresentation(trip.path, trip.pathIndex) }
      : null;
  };
  const serviceIncomeTotals = getServiceIncomeTotalsCents(state);
  const receiptActorLabel = (actorKind: string, actorId: string): string => {
    if (actorKind === "remote") return "Remote service";
    if (actorKind === "founder") return state.founder.displayName;
    if (actorKind === "employee") return state.employees.find((employee) => employee.id === actorId)?.displayName ?? "Employee";
    if (actorKind === "retail_visitor" || actorKind === "companion") return state.retailExternalActors.find((actor) => actor.id === actorId)?.displayName ?? (actorKind === "companion" ? "Companion" : "Retail visitor");
    if (actorKind === "visitor") return state.serviceOperations.find((operation) => operation.actorId === actorId)?.displayName ?? "Service visitor";
    return state.encounters[actorId]?.patientDisplayName ?? "Patient";
  };
  const capabilityLabels = new Map<string, string>();
  for (const definition of [
    ...facilityBalance.roomDefinitions,
    ...facilityBalance.staffRoleDefinitions,
  ]) {
    for (const capabilityId of definition.capabilityIds ?? []) {
      capabilityLabels.set(capabilityId, definition.displayName);
    }
  }
  const laboratoryQueue = getRemoteWorkQueueAvailability(
    state,
    "income.laboratory_processing",
    PROTOTYPE_DOMAIN_CONTEXT,
  );
  const operationalLaboratory = state.rooms.some(
    (room) => room.roomDefinitionId === "room.laboratory" && isRoomOperationalForFacilityWork(state, room.id),
  );
  const laboratoryOutOfService = state.rooms.some((room) => room.roomDefinitionId === "room.laboratory" && room.maintenance?.status === "out_of_service");
  const operationalLaboratoryTechnician = state.employees.some(
    (employee) => employee.staffRoleDefinitionId === "staff.laboratory_technician" && isEmployeeAssignedToOperationalRoom(state, employee.id),
  );
  const laboratoryQueueStatus = laboratoryQueue.activeCount === 0
    ? laboratoryQueue.canStart ? "Ready to queue processing" : "No work queued"
    : laboratoryQueue.waitingCount > 0
      ? `${laboratoryQueue.waitingCount} queued · ${laboratoryQueue.activeCount - laboratoryQueue.waitingCount} working`
      : `${laboratoryQueue.activeCount} working`;
  const laboratoryQueueDisabledReason = laboratoryQueue.canStart
    ? undefined
    : !operationalLaboratory
      ? laboratoryOutOfService
        ? "Laboratory equipment is awaiting repair."
        : "Requires a reachable, operational Laboratory."
      : !operationalLaboratoryTechnician
        ? "Requires a laboratory technician assigned to a reachable Laboratory."
        : laboratoryQueue.functionalCapacity === 0
          ? "Waiting for the laboratory technician to return."
          : "Laboratory work queue is full.";
  const levelThreeQiReviews = state.levelThreeQiReviews ?? [];
  const levelThreeSupport = getLevelThreeSupportStatus(
    state.levelThreeQiReviews ? state : { ...state, levelThreeQiReviews },
  );
  const levelThreeRoomName = (id: string): string | null => {
    const room = state.rooms.find((candidate) => candidate.id === id);
    return room ? getRoomDefinition(room.roomDefinitionId)?.displayName ?? room.roomDefinitionId : null;
  };
  const repairingRoomIds = [...new Set(state.employees.flatMap((employee) =>
    employee.facilityTask?.kind === "repair_room" && employee.facilityTask.targetId
      ? [employee.facilityTask.targetId]
      : [],
  ))];
  const serviceIncome: ServiceIncomeView = {
    appointmentsEnabled: state.serviceAppointmentsEnabled,
    catalogLines: SERVICE_INCOME_CATALOG.filter((line) => line.showInCatalog !== false).map((line) => {
      const missingCapabilities = line.requiredCapabilityIds.filter(
        (capabilityId) => !currentCapabilities.has(capabilityId),
      );
      const levelLocked = state.facilityLevel < line.minimumFacilityLevel;
      const stockCost = line.retail?.outlets.every((outlet) => outlet.staffRoleDefinitionId === "staff.pharmacist")
        ? getEmployeeTrainingMoney(line.retail.stockCost, getEmployeeRoleTrainingPercent(state, "staff.pharmacist"), "decrease")
        : line.retail?.stockCost;
      const retailOutletAvailable = line.retail?.outlets.some((outlet) =>
        outlet.requiredCapabilityIds.every((capabilityId) => currentCapabilities.has(capabilityId)) &&
        state.rooms.some((room) => room.roomDefinitionId === outlet.roomDefinitionId && isRoomOperationalForFacilityWork(state, room.id)) &&
        (!outlet.staffRoleDefinitionId || state.employees.some((employee) => employee.staffRoleDefinitionId === outlet.staffRoleDefinitionId && isEmployeeOperational(state, employee.id))),
      );
      const retailOutletLabel = line.retail?.outlets.map((outlet) => {
        const room = (getRoomDefinition(outlet.roomDefinitionId)?.displayName ?? humanizeIdentifier(outlet.roomDefinitionId)).replace("Wound Ostomy", "Wound/Ostomy Clinic");
        const staff = outlet.staffRoleDefinitionId ? ` + ${getStaffRoleDefinition(outlet.staffRoleDefinitionId)?.displayName ?? humanizeIdentifier(outlet.staffRoleDefinitionId)}` : "";
        return `${room}${staff}`;
      }).join(" or ");
      const requiredRoomDefinitionIds = [...new Set(line.operation?.phases.flatMap((phase) => phase.roomDefinitionId ? [phase.roomDefinitionId] : []) ?? [])];
      const requiredStaffRoleIds = [...new Set(line.operation?.phases.flatMap((phase) => phase.staffRoleDefinitionIds) ?? [])];
      const missingRooms = requiredRoomDefinitionIds.filter((definitionId) => !state.rooms.some(
        (room) => room.roomDefinitionId === definitionId && isRoomOperationalForFacilityWork(state, room.id),
      ));
      const missingStaff = requiredStaffRoleIds.filter((roleId) => !state.employees.some(
        (employee) => employee.staffRoleDefinitionId === roleId && isEmployeeOperational(state, employee.id),
      ));
      const providerPhase = line.operation?.phases.find(
        (phase) => phase.providerRoleDefinitionIds?.length || phase.founderEligible,
      );
      const providerAvailable = !providerPhase || Boolean(
        providerPhase.founderEligible || state.employees.some(
          (employee) => Boolean(providerPhase.providerRoleDefinitionIds?.includes(employee.staffRoleDefinitionId)) && isEmployeeOperational(state, employee.id),
        ),
      );
      const phaseRequirements = [
        ...requiredRoomDefinitionIds.map((definitionId) => getRoomDefinition(definitionId)?.displayName ?? humanizeIdentifier(definitionId)),
        ...requiredStaffRoleIds.map((roleId) => getStaffRoleDefinition(roleId)?.displayName ?? humanizeIdentifier(roleId)),
        ...(providerPhase?.founderEligible ? ["Founder or approved provider"] : providerPhase?.providerRoleDefinitionIds?.map((roleId) => getStaffRoleDefinition(roleId)?.displayName ?? humanizeIdentifier(roleId)) ?? []),
      ];
      const requirementLabel = (line.retail ? retailOutletLabel : [...line.requiredCapabilityIds.map((capabilityId) => capabilityLabels.get(capabilityId) ?? humanizeIdentifier(capabilityId)), ...phaseRequirements]
        .filter((label, index, labels) => labels.indexOf(label) === index)
        .join(" + ")) || "No on-site capability required";
      const unavailableRequirements = [...new Set([
        ...missingCapabilities.map((capabilityId) => capabilityLabels.get(capabilityId) ?? humanizeIdentifier(capabilityId)),
        ...missingRooms.map((definitionId) => getRoomDefinition(definitionId)?.displayName ?? humanizeIdentifier(definitionId)),
        ...missingStaff.map((roleId) => getStaffRoleDefinition(roleId)?.displayName ?? humanizeIdentifier(roleId)),
        ...(providerAvailable ? [] : ["approved provider"]),
      ])];
      const lineAvailable = !levelLocked && unavailableRequirements.length === 0 && (line.retail ? retailOutletAvailable === true : true);
      // Retail outlets name their own room/staff; offer the first outlet's setup.
      const firstRetailOutlet = line.retail && !retailOutletAvailable ? line.retail.outlets[0] : undefined;
      const retailMissingRooms = firstRetailOutlet ? [firstRetailOutlet.roomDefinitionId] : [];
      const retailMissingStaff = firstRetailOutlet?.staffRoleDefinitionId ? [firstRetailOutlet.staffRoleDefinitionId] : [];
      return {
        ...createServiceSetupState(state, {
          levelLocked,
          available: lineAvailable,
          missingCapabilityIds: missingCapabilities,
          missingRoomDefinitionIds: [...missingRooms, ...retailMissingRooms.filter((id) => !state.rooms.some((room) => room.roomDefinitionId === id && isRoomOperationalForFacilityWork(state, room.id)))],
          missingStaffRoleIds: [...missingStaff, ...retailMissingStaff.filter((id) => !state.employees.some((employee) => employee.staffRoleDefinitionId === id && isEmployeeOperational(state, employee.id)))],
        }),
        arrivalLabel: serviceArrivalLabel(line, retailOutletLabel),
        scheduled: line.operation?.visitorMode === "scheduled",
        id: line.id,
        displayName: line.displayName,
        kind: line.kind,
        feeLabel: line.id === "income.glp1_telehealth"
          ? currency(glp1ConsultPayment)
          : line.scheduledVisitorFee === undefined
          ? currency(line.fee)
          : `${currency(line.scheduledVisitorFee)} per scheduled visitor · ${currency(line.fee)} question-ordered`,
        minimumFacilityLevel: line.minimumFacilityLevel,
        requirementLabel,
        available: lineAvailable,
        unavailableReason: levelLocked
          ? `Locked until Facility Level ${line.minimumFacilityLevel}`
          : unavailableRequirements.length > 0
            ? `Requires ${unavailableRequirements.join(" + ")}`
            : line.retail && !retailOutletAvailable
              ? `Requires ${retailOutletLabel}`
            : undefined,
        ...(stockCost !== undefined ? { stockCostLabel: currency(stockCost), contributionLabel: currency(line.fee - stockCost) } : {}),
      };
    }),
    activeOperations: [...state.serviceOperations
      .filter((operation) => operation.status !== "completed" && operation.status !== "cancelled")
      .map((operation) => ({
        id: operation.id,
        displayName: SERVICE_INCOME_CATALOG.find((line) => line.id === operation.incomeLineId)?.displayName ?? operation.incomeLineId,
        actorLabel: operation.actorKind === "visitor" ? operation.displayName : operation.actorKind === "remote" ? "Remote service" : operation.displayName,
        statusLabel: operation.resourceWaitReason ?? periopPreparationStatusLabel(operation) ?? serviceOperationStatusLabel(operation.status),
        quoteFeeLabel: currency(operation.quoteFee),
      })),
      ...state.retailOperations
        .filter((operation) => !["completed", "abandoned", "cancelled"].includes(operation.status))
        .map((operation) => ({
          id: operation.id,
          displayName: SERVICE_INCOME_CATALOG.find((line) => line.id === operation.incomeLineId)?.displayName ?? operation.incomeLineId,
          actorLabel: operation.displayName,
          statusLabel: operation.resourceWaitReason ?? serviceOperationStatusLabel(operation.status),
          quoteFeeLabel: `${currency(operation.quoteGross)} gross · ${currency(operation.quoteStockCost)} stock`,
        })),
    ],
    recentReceipts: newestServiceIncomeReceipts(state.serviceIncomeReceipts, 8)
      .map((receipt) => ({
        id: receipt.id,
        displayName: SERVICE_INCOME_CATALOG.find((line) => line.id === receipt.incomeLineId)?.displayName ?? receipt.incomeLineId,
        actorLabel: receiptActorLabel(receipt.actorKind, receipt.actorId),
        grossLabel: currency(receipt.grossAmount),
        stockCostLabel: currency(receipt.stockCost),
        netLabel: currency(receipt.netCashDelta),
        timeLabel: facilityTimeLabel(state, receipt.completedAtFacilityTick),
      })),
    finances: createManagementFinanceView(
      state,
      serviceIncomeTotals,
      (incomeLineId) => SERVICE_INCOME_CATALOG.find((line) => line.id === incomeLineId)?.displayName ?? incomeLineId,
    ),
    // Includes receipts retired from live state; see retiredServiceHistory.
    grossTotalLabel: currency(serviceIncomeTotals.grossCents / 100),
    stockCostTotalLabel: currency(serviceIncomeTotals.stockCostCents / 100),
    netTotalLabel: currency(serviceIncomeTotals.netCashDeltaCents / 100),
    ...(state.facilityLevel >= 3 ? { laboratoryWorkQueue: {
      enabled: laboratoryQueue.canStart,
      statusLabel: laboratoryQueueStatus,
      ...(laboratoryQueueDisabledReason ? { disabledReason: laboratoryQueueDisabledReason } : {}),
    } } : {}),
    ...(state.facilityLevel >= 3 ? { levelThreeSupport: {
      maintenanceDueRoomNames: levelThreeSupport.maintenanceDueRoomIds.map(levelThreeRoomName).filter((name): name is string => name !== null),
      maintenanceOutOfServiceRoomNames: levelThreeSupport.maintenanceOutOfServiceRoomIds.map(levelThreeRoomName).filter((name): name is string => name !== null),
      maintenanceRepairingRoomNames: repairingRoomIds.map(levelThreeRoomName).filter((name): name is string => name !== null),
      queuedQiReviewCount: levelThreeSupport.queuedQiReviewCount,
      inProgressQiReviewCount: levelThreeQiReviews.filter((review) => review.status === "in_progress").length,
      completedQiReviewCount: levelThreeSupport.completedQiReviewCount,
      staffOnBreakCount: levelThreeSupport.occupiedBreakSeats.length,
    } } : {}),
  };
  const hourlyOperatingDelta = getOperatingExpensePerFacilityHour(state);
  const xpRequirement = progressionStatus.requirements.find(
    (requirement) => requirement.id === "progression.clinical_xp",
  );
  const xpRequired =
    xpRequirement?.required ??
    facilityBalance.stageDefinitions.find(
      (stage) => stage.level === state.facilityLevel,
    )?.minimumClinicalXp ??
    0;
  const xpProgressPercent = xpRequirement
    ? Math.min(
        100,
        (xpRequirement.current / Math.max(1, xpRequirement.required)) * 100,
      )
    : xpRequired > 0
      ? Math.min(100, (state.clinicalXp / xpRequired) * 100)
      : 100;
  const workloadStatus = workload.overRoutineCapacity
    ? "Routine workload is above its target."
    : workload.atRoutineCapacity
      ? "Routine arrivals pause until capacity is available."
      : `${workload.routineLimit - workload.occupancy} routine workload slot${
          workload.routineLimit - workload.occupancy === 1 ? "" : "s"
        } available.`;

  const patients = [
    ...lists.waiting.map((item) =>
      toPatientTab(state, item, "waiting", selectedEncounterId),
    ),
    ...lists.active.map((item) =>
      toPatientTab(state, item, "active", selectedEncounterId),
    ),
    ...lists.resolved.map((item) =>
      toPatientTab(state, item, "resolved", selectedEncounterId),
    ),
  ];

  return {
    employeeDiscussionRows: employeeDiscussionRows(state),
    employeeDiscussion: employeeDiscussionView(state),
    emergencyGlp1: {
      // A built but inaccessible/unstaffed suite cannot replace the founder.
      visible: glp1AutomationCapacity === 0,
      enabled: emergencyGlp1Status.eligible,
      paymentLabel: `+$${emergencyGlp1Status.payment}`,
      statusLabel:
        emergencyGlp1Status.blockedReason ??
        "Ready now; one consult per facility hour.",
      cooldownProgressPercent: Math.max(
        0,
        Math.min(
          100,
          100 -
            (emergencyGlp1Status.cooldownRemainingTicks /
              Math.max(
                1,
                PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.emergencyGlp1
                  .cooldownMinutes,
              )) *
              100,
        ),
      ),
      flavorMessage:
        state.emergencyGlp1.lastFlavorMessage ?? undefined,
      automationCapacity: glp1AutomationCapacity,
      nextPayoutLabel:
        glp1AutomationCapacity > 0 && nextGlp1PayoutTick !== null
          ? `Next payout in ${formatFacilityDuration(
              Math.max(0, nextGlp1PayoutTick - state.facilityTick),
            )}.`
          : undefined,
    },
    advertising: {
      currentLevel: currentAdvertising.level,
      currentDisplayName: currentAdvertising.displayName,
      hourlyCostLabel:
        currentAdvertising.hourlyCost === 0
          ? "$0/hr"
          : `$${currentAdvertising.hourlyCost}/hr`,
      arrivalFrequencyLabel: advertisingFrequencyLabel(
        currentAdvertising.arrivalIntervalMultiplierPercent,
      ),
      canDecrease:
        advertisingLevels.some(
          (level) => level.level < currentAdvertising.level,
        ),
      canIncrease:
        advertisingLevels.some(
          (level) => level.level > currentAdvertising.level,
        ),
    },
    serviceIncome,
    resourceBar: {
      moneyLabel: `$${state.cash.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      moneyDeltaLabel: `${signedCurrency(hourlyOperatingDelta)}/hr`,
      xpLabel: state.clinicalXp.toLocaleString(),
      satisfactionLabel:
        effectiveSatisfaction === null ? "—" : `${effectiveSatisfaction}%`,
      facilityTimeLabel: clock.displayLabel,
      workloadLabel: `${workload.occupancy}/${workload.routineLimit}`,
      workloadStatusLabel: workload.atRoutineCapacity
        ? "At routine capacity"
        : "Capacity available",
      facilityLevelLabel: `Level ${state.facilityLevel}`,
      levelLabel: `Level ${state.facilityLevel}`,
      xpProgressLabel: xpRequirement
        ? `${Math.min(
            xpRequirement.current,
            xpRequirement.required,
          )}/${xpRequirement.required} XP`
        : xpRequired > 0
          ? `${Math.min(state.clinicalXp, xpRequired)}/${xpRequired} XP`
          : "Maximum prototype level",
      xpProgressPercent,
      moneyHourlyDeltaLabel: `${signedCurrency(hourlyOperatingDelta)}/hr`,
      dayTimeLabel: clock.displayLabel,
      goals: progressionStatus.requirements.map((requirement) => ({
        id: requirement.id,
        label: requirement.label,
        complete: requirement.met,
        progressLabel: `${Math.min(
          requirement.current,
          requirement.required,
        )}/${requirement.required}`,
      })),
      contentNoticeLabel:
        "DEMONSTRATION CONTENT ONLY — not clinically approved or medical advice.",
    },
    patients,
    chart: createChartView(
      state,
      selectedEncounterId,
      summaryVisible,
      questionReviewFlags,
    ),
    facility: {
      facilityTitle: progressionStatus.displayName,
      campaignId: state.campaignId,
      facilityTick: state.facilityTick,
      endoscopyOccupancy: (() => {
        const roomIds = new Set<string>();
        const patients = new Set<string>();
        const visitors = new Set<string>();
        for (const operation of state.serviceOperations) {
          const phase = operationPhase(operation);
          if (
            (phase?.roomDefinitionId !== "room.endoscopy" && phase?.roomDefinitionId !== "room.ambulatory_or") ||
            (phase.roomDefinitionId === "room.ambulatory_or"
              ? operation.status !== "in_service"
              : operation.status !== "in_service" && operation.status !== "waiting_for_next_phase")
          ) continue;
          const roomId = operation.reservedRoomInstanceIds.find((candidate) => {
            const definitionId = state.rooms.find((room) => room.id === candidate)?.roomDefinitionId;
            return definitionId === phase.roomDefinitionId;
          });
          if (!roomId) continue;
          roomIds.add(roomId);
          if (operation.actorKind === "visitor") visitors.add(operation.id);
          if (operation.actorKind === "encounter") patients.add(operation.actorId);
        }
        // Legacy frozen clinical travel does not create service operations.
        // Its frozen timing is the sole presentation clock for covered care.
        for (const encounter of Object.values(state.encounters)) {
          const travel = encounter.pendingResult?.patientTravel;
          if (!travel || state.facilityTick < travel.outboundArrivalTick || state.facilityTick >= travel.serviceCompletionTick) continue;
          if (state.rooms.find((room) => room.id === travel.destinationRoomInstanceId)?.roomDefinitionId !== "room.endoscopy") continue;
          roomIds.add(travel.destinationRoomInstanceId);
          patients.add(encounter.id);
        }
        return { roomInstanceIds: [...roomIds], patientInstanceIds: [...patients], serviceVisitorInstanceIds: [...visitors] };
      })(),
      // Owner revision 2026-10-07: imaging rooms dim only while a scan runs.
      imagingActiveRoomInstanceIds: (() => {
        const ids = new Set<string>();
        const definitionOf = (roomId: string) => state.rooms.find((room) => room.id === roomId)?.roomDefinitionId;
        for (const operation of state.serviceOperations) {
          if (operation.status !== "in_service") continue;
          const phaseRoomDefinitionId = operationPhase(operation)?.roomDefinitionId ?? null;
          if (phaseRoomDefinitionId !== null && !isTouchupImagingDimRoom(phaseRoomDefinitionId)) continue;
          for (const roomId of operation.reservedRoomInstanceIds) {
            const definitionId = definitionOf(roomId);
            if (definitionId && isTouchupImagingDimRoom(definitionId) && (phaseRoomDefinitionId === null || phaseRoomDefinitionId === definitionId)) ids.add(roomId);
          }
        }
        for (const encounter of Object.values(state.encounters)) {
          const travel = encounter.pendingResult?.patientTravel;
          if (!travel || state.facilityTick < travel.outboundArrivalTick || state.facilityTick >= travel.serviceCompletionTick) continue;
          const definitionId = definitionOf(travel.destinationRoomInstanceId);
          if (definitionId && isTouchupImagingDimRoom(definitionId)) ids.add(travel.destinationRoomInstanceId);
        }
        return [...ids].sort();
      })(),
      paused: state.paused,
      simulationSpeed: state.simulationSpeed,
      realMillisecondsPerFacilityMinuteAt1x:
        PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clock
          .realMillisecondsPerFacilityMinuteAt1x,
      characterTravelTilesPerFacilityMinute:
        PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility
          .characterTravelTilesPerTick,
      buildMode,
      buildDoorSlots: buildMode
        ? buildEligibleDoorSlots(state, selectedRoomInstanceId)
        : [],
      selectedRoomInstanceId,
      camera,
      gridColumns: facilityBalance.gridWidth,
      gridRows: facilityBalance.gridHeight,
      patientCounts: {
        waiting: lists.waiting.length,
        active: lists.active.length,
        actionReady: lists.active.filter((item) => item.actionRequired).length,
        resolved: lists.resolved.length,
      },
      founder: {
        displayName: state.founder.displayName,
        appearance: state.founder.appearance,
        ...(retailTripPresentation("founder", "founder") ?? {
          location: state.environment.founderLocation,
          ...movementPresentation(state.environment.founderActivity?.path, state.environment.founderActivity?.pathIndex),
        }),
        activityLabel: getFounderActivityLabel({
          activity: state.environment.founderActivity,
          serviceOperations: state.serviceOperations,
          retailOperations: state.retailOperations,
          rooms: state.rooms,
          encounters: Object.values(state.encounters),
        }),
        seated:
          founderIsIdleAtUnstaffedFrontDesk(state) ||
          ((state.environment.founderActivity?.kind === "attend_encounter" || state.environment.founderActivity?.kind === "sit_in_chair") &&
            state.environment.founderActivity.pathIndex >=
              state.environment.founderActivity.path.length - 1),
        ...(() => {
          const supportRole = getFounderSupportRole(state);
          const breakSeat = supportRole === "staff-break-seat" ? getFounderBreakSeatClaim(state) : null;
          return supportRole
            ? { supportRole, ...(breakSeat ? { supportId: breakSeat.seatId, supportRoomInstanceId: breakSeat.roomId } : {}) }
            : {};
        })(),
      },
      founderChairs: listFounderSeats(state, PROTOTYPE_DOMAIN_CONTEXT).map((seat) => ({
        roomInstanceId: seat.roomInstanceId,
        location: seat.location,
        kind: seat.kind,
        ...(seat.seatId ? { seatId: seat.seatId } : {}),
        occupied: isFounderSeatOccupied(state, seat),
      })),
      ambientPedestrians: state.environment.ambientPedestrians.map(
        (pedestrian) => ({
          instanceId: pedestrian.id,
          appearance: pedestrian.appearance,
          location: pedestrian.path[pedestrian.pathIndex]!,
          path: pedestrian.path,
          pathIndex: pedestrian.pathIndex,
          ...movementPresentation(
            pedestrian.path,
            pedestrian.pathIndex,
          ),
        }),
      ),
      litterItems: state.environment.litterItems.map((item) => ({
        instanceId: item.id,
        roomInstanceId: item.roomId,
        location: item.location,
      })),
      waterCooler: {
        location: (() => {
          const front = state.rooms.find((room) =>
            facilityBalance.protectedRoomDefinitionIds.includes(
              room.roomDefinitionId,
            ),
          );
          const footprint = front
            ? getRoomInstanceFootprint(state, front.id)
            : null;
          return front
            ? {
                x: front.x + Math.max(0, (footprint?.width ?? 1) - 1),
                // The cooler occupies Front Desk A5. Its refill approach is
                // distinct (B5) in the domain so actors never clip through it.
                y: front.y,
              }
            : state.environment.founderLocation;
        })(),
        fillPercent: state.environment.waterCoolerFillPercent,
        needsRefill:
          state.environment.waterCoolerFillPercent <=
          PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment
            .waterCoolerLowThreshold,
      },
      patients: Object.values(state.encounters)
        .filter(
          (encounter) =>
            encounter.lifecycle !== "resolved" ||
            encounter.patientMovement !== null ||
            encounterIdsWithActiveServiceOperation.has(encounter.id),
        )
        .map((encounter) => {
          const location = getEncounterPatientLocation(
            state,
            encounter.id,
          );
          // Amenity trips own the actor's physical movement until the domain
          // removes the trip after its real return. They must therefore win
          // over a retained chair/bed, retail overlay, or service route.
          const amenityTrip = getPatientAmenityTrip(
            state,
            "encounter",
            encounter.id,
          );
          const assignedRoom = encounter.assignedRoomInstanceId
            ? state.rooms.find(
                (room) =>
                  room.id === encounter.assignedRoomInstanceId,
              )
            : undefined;
          const assignedRoomDefinition = assignedRoom
            ? getRoomDefinition(assignedRoom.roomDefinitionId)
            : null;
          const waitingAnchorSeated =
            amenityTrip === null &&
            encounter.patientMovement === null &&
            location !== null &&
            assignedRoomDefinition !== null &&
            assignedRoom !== undefined &&
            getRoomWaitingAnchors(assignedRoom, assignedRoomDefinition).some(
              (anchor) => anchor.x === location.x && anchor.y === location.y,
            ) &&
            !getRoomStandingWaitingAnchors(assignedRoom, assignedRoomDefinition).some(
              (anchor) => anchor.x === location.x && anchor.y === location.y,
            );
          const seated =
            amenityTrip === null &&
            encounter.patientMovement === null &&
            location !== null &&
            ((encounter.waitingDestination?.kind === "chair" &&
              encounter.waitingDestination.location.x === location.x &&
              encounter.waitingDestination.location.y === location.y) ||
              waitingAnchorSeated);
          const careSupportRole = amenityTrip === null
            ? getPatientCareSupportRole(state, encounter, location)
            : undefined;
          const periopOperation = state.serviceOperations.find((operation) =>
            operation.actorKind === "encounter" && operation.actorId === encounter.id &&
            operation.status !== "completed" && operation.status !== "cancelled",
          );
          const periopBedSupport = amenityTrip === null
            ? getPeriopBedPatientSupport(state, periopOperation, location)
            : undefined;
          const supportRole = periopBedSupport?.supportRole ?? careSupportRole ?? (seated
            ? assignedRoom?.roomDefinitionId === "room.front_desk"
              ? "front-desk-public"
              : "waiting-seat"
            : undefined);
          const pendingFacilityRoute =
            getPendingPatientRoutePresentation(state, encounter.id);
          const retailTrip = retailTripPresentation("encounter", encounter.id);
          const serviceOperationMovement = activeEncounterOperationMovement(
            state,
            encounter.id,
          );
          const presentationPath = amenityTrip?.path ??
            retailTrip?.path ??
            encounter.patientMovement?.path ??
            serviceOperationMovement?.path ??
            pendingFacilityRoute?.path;
          const presentationPathIndex = amenityTrip?.pathIndex ??
            retailTrip?.pathIndex ??
            encounter.patientMovement?.pathIndex ??
            serviceOperationMovement?.pathIndex ??
            pendingFacilityRoute?.pathIndex;
          return {
            instanceId: encounter.id,
            displayName: encounter.patientDisplayName,
            status:
              encounter.patientMovement?.kind ===
                  "leaving_after_resolution" ||
                encounter.patientMovement?.kind ===
                  "leaving_after_walkout"
                ? ("active" as const)
                : encounter.lifecycle === "waiting_unopened"
                ? ("waiting" as const)
                : encounter.lifecycle === "active_pending_result"
                  ? ("off-site" as const)
                  : encounter.lifecycle === "active_action_required"
                    ? ("action-ready" as const)
                    : ("active" as const),
            appearance: encounter.patientAppearance,
            seated,
            pose: periopBedSupport
              ? "seated"
              : careSupportRole
              ? careSupportRole === "phlebotomy-patient" ? "seated" : "exam-table"
              : seated ? "seated" : undefined,
            ...(supportRole ? { supportRole } : {}),
            ...(periopBedSupport ? { supportId: periopBedSupport.supportId } : {}),
            ...movementPresentation(
              presentationPath,
              presentationPathIndex,
            ),
            ...(amenityTrip?.path[amenityTrip.pathIndex]
              ? { location: amenityTrip.path[amenityTrip.pathIndex] }
              : retailTrip?.location
                ? { location: retailTrip.location }
                : location
                  ? { location }
                  : {}),
          };
        }),
      serviceVisitors: state.serviceOperations
        .filter(
          (operation) =>
            operation.actorKind === "visitor" &&
            operation.status !== "completed" &&
            operation.status !== "cancelled",
        )
        .map((operation) => {
          const amenityTrip = getPatientAmenityTrip(
            state,
            "service_visitor",
            operation.id,
          );
          // Retail service-visitor operations are keyed by their service
          // operation ID, while actorId is the visitor's display identity.
          const retailTrip = retailTripPresentation("service_visitor", operation.id);
          const room = operation.reservedRoomInstanceIds
            .map((id) => state.rooms.find((candidate) => candidate.id === id))
            .find((candidate) => candidate && patientSupportRoleForRoom(candidate.roomDefinitionId));
          const atServiceEndpoint = (operation.status === "walking_to_service" || operation.status === "in_service") &&
            operation.pathIndex >= operation.path.length - 1 && samePoint(operation.location, operation.path.at(-1));
          const periopBedSupport = amenityTrip === null
            ? getPeriopBedPatientSupport(state, operation, operation.location)
            : undefined;
          const supportRole = periopBedSupport?.supportRole ?? (amenityTrip === null && room && atServiceEndpoint ? patientSupportRoleForRoom(room.roomDefinitionId) : undefined);
          return {
            instanceId: operation.id, actorId: operation.actorId, displayName: operation.displayName, appearance: operation.appearance,
            ...(supportRole ? { supportRole } : {}),
            ...(periopBedSupport ? { supportId: periopBedSupport.supportId } : {}),
            ...(amenityTrip
              ? movementPresentation(amenityTrip.path, amenityTrip.pathIndex)
              : retailTrip ?? movementPresentation(operation.path, operation.pathIndex)),
            ...(amenityTrip?.path[amenityTrip.pathIndex]
              ? { location: amenityTrip.path[amenityTrip.pathIndex] }
              : retailTrip?.location
                ? { location: retailTrip.location }
                : operation.location
                  ? { location: operation.location }
                  : {}),
          };
        }),
      retailExternalActors: state.retailExternalActors
        .filter((actor) => actor.lifecycle !== "departed")
        .map((actor) => {
          const retailTrip = retailTripPresentation(actor.kind, actor.id);
          return {
            instanceId: actor.id, actorKind: actor.kind, displayName: actor.displayName, appearance: actor.appearance,
            ...(retailTrip ?? movementPresentation(actor.path, actor.pathIndex)),
            ...(retailTrip?.location ? { location: retailTrip.location } : actor.location ? { location: actor.location } : {}),
          };
        }),
      earningsReceipts: state.serviceIncomeReceipts.map((receipt) => ({
        transactionKey: receipt.transactionKey,
        actorKind: receipt.actorKind,
        actorId: receipt.actorId,
        grossAmount: receipt.grossAmount,
        ...(receipt.displayAnchor ? { displayAnchor: receipt.displayAnchor } : {}),
      })),
      rooms: state.rooms.flatMap((room) => {
        const definition = getRoomDefinition(room.roomDefinitionId);
        const footprint = getRoomInstanceFootprint(state, room.id);
        return definition
          ? [
              {
                instanceId: room.id,
                definitionId: room.roomDefinitionId,
                displayName: definition.displayName,
                tileX: room.x,
                tileY: room.y,
                width: footprint?.width ?? definition.width,
                height: footprint?.height ?? definition.height,
                isFounderRoom: initialRoomInstanceIds.has(room.id),
                kind: definition.kind,
                orientation: room.orientation,
                doorSide: room.doorSide,
                upgradeLevel: room.upgradeLevel,
                cleanliness: room.cleanliness ?? 100,
                upgradeAvailable:
                  definition.buildable &&
                  getNextRoomUpgradeCost(state, room.id) !== null,
                buildLabel:
                  buildRoomNames.get(room.id) ?? definition.displayName,
                upgradeMaxLevel: roomUpgradeable(room.roomDefinitionId)
                  ? definition.maximumUpgradeLevel
                  : 1,
                upgradeAffordable: (() => {
                  const cost = definition.buildable
                    ? getNextRoomUpgradeCost(state, room.id)
                    : null;
                  return cost !== null && state.cash >= cost;
                })(),
                accessProblem: buildUnreachableRoomIds.has(room.id),
              },
            ]
          : [];
      }),
      doors: state.doors.map((door) => ({
        instanceId: door.id,
        roomInstanceId: door.roomId,
        side: door.side,
        offset: door.offset,
        exterior: door.exterior,
      })),
      staff: [
        ...state.employees,
        ...(state.departingEmployees ?? []),
      ].map((employee) => {
        const role = getStaffRoleDefinition(
          employee.staffRoleDefinitionId,
        );
        const departing = (state.departingEmployees ?? []).some((candidate) => candidate.id === employee.id);
        const taskAtEndpoint = !departing && employee.facilityTask &&
          (employee.facilityTask.kind === "perform_imaging" || employee.facilityTask.kind === "perform_service") &&
          employee.pathIndex >= employee.path.length - 1 && samePoint(employee.location, employee.path.at(-1));
        const serviceRoom = taskAtEndpoint && employee.facilityTask?.targetId
          ? getServiceTargetRoom(state, employee.facilityTask.targetId, employee.id)
          : undefined;
        const serviceSupportRole = serviceRoom?.roomDefinitionId === "room.ambulatory_or"
          ? employee.staffRoleDefinitionId === "staff.or_nurse"
            ? "ambulatory-or-nurse"
            : employee.staffRoleDefinitionId === "staff.surgeon"
              ? "ambulatory-or-surgeon"
              : undefined
          : serviceRoom
          ? clinicianSupportRoleForRoom(serviceRoom.roomDefinitionId)
          : undefined;
        const homeRoom = employee.homeRoomInstanceId
          ? state.rooms.find((candidate) => candidate.id === employee.homeRoomInstanceId)
          : undefined;
        const homeDefinition = homeRoom ? getRoomDefinition(homeRoom.roomDefinitionId) : null;
        const atFrontDeskSeat = !departing && employee.staffRoleDefinitionId === "staff.receptionist" &&
          homeRoom?.roomDefinitionId === "room.front_desk" && homeDefinition && !employee.facilityTask &&
          employee.pathIndex >= employee.path.length - 1 &&
          samePoint(employee.location, getRoomNavigationAnchor(homeRoom, homeDefinition, "staff"));
        const glp1SupportRole = departing ? undefined : getGlp1NursePractitionerSupportRole(state, employee);
        const arrivedSupportTask = !departing && employee.facilityTask && employee.pathIndex >= employee.path.length - 1 && samePoint(employee.location, employee.path.at(-1));
        const activeQiReview = arrivedSupportTask && employee.facilityTask?.kind === "review_ambulatory_qi"
          ? levelThreeQiReviews.find((review) =>
              review.id === employee.facilityTask?.targetId &&
              review.status === "in_progress" &&
              review.surgeonEmployeeId === employee.id)
          : undefined;
        const taskSupport = arrivedSupportTask && employee.facilityTask?.kind === "take_break" &&
          employee.facilityTask.seatId &&
          state.rooms.find((candidate) => candidate.id === employee.facilityTask?.targetId)?.roomDefinitionId === "room.staff_break"
          ? { supportRole: "staff-break-seat" as const, supportId: employee.facilityTask.seatId, supportRoomInstanceId: employee.facilityTask.targetId }
          : activeQiReview && homeRoom?.roomDefinitionId === "room.surgeon_office"
            ? { supportRole: "surgeon-office" as const, supportId: "surgeon", supportRoomInstanceId: homeRoom.id }
            : undefined;
        const atHomeAnchor = !employee.facilityTask && homeRoom && homeDefinition &&
          employee.pathIndex >= employee.path.length - 1 &&
          samePoint(employee.location, getRoomNavigationAnchor(homeRoom, homeDefinition, "staff"));
        const homeSupport = atHomeAnchor
          ? homeRoom.roomDefinitionId === "room.laboratory" && employee.staffRoleDefinitionId === "staff.laboratory_technician"
            ? { supportRole: "laboratory-technician" as const, supportRoomInstanceId: homeRoom.id }
            : homeRoom.roomDefinitionId === "room.pharmacy" && employee.staffRoleDefinitionId === "staff.pharmacist"
              ? { supportRole: "pharmacist" as const, supportRoomInstanceId: homeRoom.id }
              : homeRoom.roomDefinitionId === "room.maintenance_workshop" && employee.staffRoleDefinitionId === "staff.repair_person"
                ? { supportRole: "repair-person" as const, supportRoomInstanceId: homeRoom.id }
                : undefined
          : undefined;
        // A radiologist standing on their own workstation's anchor sits in that
        // workstation's chair (idle at home or reading a study).
        const readingStation = !departing && employee.staffRoleDefinitionId === "staff.radiologist" &&
          homeRoom?.roomDefinitionId === "room.reading" && employee.pathIndex >= employee.path.length - 1
          ? DIAGNOSTIC_READING_WORKSTATIONS.find((station) => station.id === employee.readingStationId)
          : undefined;
        const readingSupport = readingStation && homeRoom &&
          samePoint(employee.location, { x: homeRoom.x + readingStation.staffAnchor.x, y: homeRoom.y + readingStation.staffAnchor.y })
          ? { supportRole: "reading-radiologist" as const, supportId: readingStation.id, supportRoomInstanceId: homeRoom.id }
          : undefined;
        const serviceSupport = serviceSupportRole === "ct-operator" && employee.staffRoleDefinitionId !== "staff.imaging_technician"
          ? undefined
          : serviceSupportRole && serviceRoom
            ? { supportRole: serviceSupportRole, supportRoomInstanceId: serviceRoom.id }
            : undefined;
        const trainingSupport = !departing && employee.training?.stage === "training" &&
          employee.training.roomInstanceId && employee.training.placeId &&
          employee.pathIndex >= employee.path.length - 1
          ? {
              supportRole: "training-employee" as const,
              supportId: employee.training.placeId,
              supportRoomInstanceId: employee.training.roomInstanceId,
            }
          : undefined;
        // An idle employee resting on a chair or workstation tile of their own
        // room sits there or faces it. If two share the tile, the first
        // (by id) takes the spot and the other just stands.
        const idleSpot = !departing && !employee.facilityTask && (!employee.training || employee.training.stage === "queued") && homeRoom &&
          employee.pathIndex >= employee.path.length - 1
          ? getPlacedRoomIdleSpotAt(homeRoom, employee.location)
          : undefined;
        const idleSpotSupport = idleSpot && homeRoom && !state.employees.some((other) =>
          other.id < employee.id && !other.facilityTask && other.pathIndex >= other.path.length - 1 &&
          samePoint(other.location, employee.location))
          ? { supportRole: "staff-idle" as const, supportId: idleSpot.id, supportRoomInstanceId: homeRoom.id }
          : undefined;
        const projectedSupport = trainingSupport ?? taskSupport ?? readingSupport ?? serviceSupport ?? (glp1SupportRole ? { supportRole: glp1SupportRole } : undefined) ?? homeSupport ?? idleSpotSupport ?? (atFrontDeskSeat ? { supportRole: "front-desk-staff" as const } : undefined);
        return {
          instanceId: employee.id,
          discussionActionRequired: Object.values(state.employeeDiscussions ?? {}).some((discussion) =>
            discussion.employeeId === employee.id && ["waiting_unopened", "active_action_required", "feedback_pending", "resolved_summary_available"].includes(discussion.lifecycle)),
          staffRoleDefinitionId: employee.staffRoleDefinitionId,
          displayName: employee.displayName,
          roleDisplayName:
            role?.displayName ?? employee.staffRoleDefinitionId,
          homeRoomInstanceId: employee.homeRoomInstanceId,
          appearance: employee.appearance,
          salaryPerExpenseInterval:
            employee.salaryPerExpenseInterval,
          morale: employee.morale,
          trainingLevel: employee.trainingLevel,
          ...(projectedSupport?.supportRole ? { supportRole: projectedSupport.supportRole } : {}),
          ...(projectedSupport && "supportId" in projectedSupport && projectedSupport.supportId ? { supportId: projectedSupport.supportId } : {}),
          ...(projectedSupport && "supportRoomInstanceId" in projectedSupport && projectedSupport.supportRoomInstanceId ? { supportRoomInstanceId: projectedSupport.supportRoomInstanceId } : {}),
          ...(retailTripPresentation("employee", employee.id) ?? {
            location: employee.location, path: employee.path, pathIndex: employee.pathIndex,
            ...movementPresentation(employee.path, employee.pathIndex),
          }),
        };
      }),
      placement: selectedRoomDefinitionId
        ? (() => {
            const definition = getRoomDefinition(
              selectedRoomDefinitionId,
            );
            const footprint = definition
              ? getRotatedFootprint(definition, placementOrientation)
              : null;
            return definition
              ? {
                  definitionId: definition.id,
                  displayName: definition.displayName,
                  width: footprint?.width ?? definition.width,
                  height: footprint?.height ?? definition.height,
                  kind: definition.kind,
                  orientation: placementOrientation,
                  // Doors are placed separately after the room footprint.
                  doorSide: null,
                }
              : null;
          })()
        : null,
    },
    progression: {
      facilityLevelLabel: `Level ${state.facilityLevel}`,
      nextLevelLabel:
        progressionStatus.nextFacilityLevel === null
          ? state.facilityLevel === 2
            ? "Level 3"
            : state.facilityLevel === 3
              ? "Level 4 preview"
              : null
          : `Level ${progressionStatus.nextFacilityLevel}`,
      goals: progressionStatus.requirements.map((requirement) => ({
        id: requirement.id,
        label: requirement.label,
        complete: requirement.met,
        progressLabel: `${Math.min(
          requirement.current,
          requirement.required,
        )}/${requirement.required}`,
      })),
      ...(state.facilityLevel >= 3 ? { secondaryGoals: [{
        id: "secondary.level_three_first_qi_review",
        label: "Complete the first administrative quality review",
        complete: levelThreeSupport.completedQiReviewCount > 0,
        progressLabel: `${Math.min(levelThreeSupport.completedQiReviewCount, 1)}/1`,
      }] } : {}),
      canLevelUp: progressionStatus.eligible,
      prototypeComplete:
        progressionStatus.nextFacilityLevel === null &&
        progressionStatus.requirements.every(
          (requirement) => requirement.met,
        ),
      endoscopySetupRequirements: getProcedureSetupRequirements(state, "endoscopy"),
      ambulatoryOperationSetupRequirements: getProcedureSetupRequirements(state, "ambulatory_operation"),
    },
    roomOptions: facilityBalance.roomDefinitions
      .filter(
        (definition) =>
          definition.constructionCost > 0 &&
          definition.buildable &&
          definition.unlockFacilityLevel <= state.facilityLevel,
      )
      .map((definition) => {
        const ownedCount = state.rooms.filter(
          (room) => room.roomDefinitionId === definition.id,
        ).length;
        const owned = ownedCount > 0;
        const atMaximum =
          definition.maximumInstances !== null &&
          ownedCount >= definition.maximumInstances;
        const requirementsMet =
          definition.requiredRoomDefinitionIds.every((requiredId) =>
            placedRoomDefinitionIds.has(requiredId),
          );
        const affordable = state.cash >= definition.constructionCost;
        const blockedReason = atMaximum
          ? `Maximum ${definition.maximumInstances} built.`
          : !requirementsMet
            ? `Requires ${definition.requiredRoomDefinitionIds
                .filter(
                  (requiredId) =>
                    !placedRoomDefinitionIds.has(requiredId),
                )
                .map(
                  (requiredId) =>
                    getRoomDefinition(requiredId)?.displayName ??
                    requiredId,
                )
                .join(", ")}.`
            : !affordable
              ? `Need $${(
                  definition.constructionCost - state.cash
                ).toLocaleString()} more.`
              : undefined;
        const purpose = roomBuildPurpose(definition.id);
        return {
          id: definition.id,
          displayName: definition.displayName,
          category: roomBuildCategory(definition.id),
          ...(purpose ? { purpose } : {}),
          footprintLabel: `${definition.width} × ${definition.height} tiles${definition.id === "room.reading" ? ` · ${DIAGNOSTIC_READING_WORKSTATIONS.length} reading positions` : ""}`,
          costLabel: `$${definition.constructionCost.toLocaleString()}`,
          upkeepLabel: `$${definition.upkeepPerExpenseInterval.toLocaleString()} upkeep / hr`,
          builtCountLabel: definition.maximumInstances === null
            ? `${ownedCount} built · no limit`
            : `${ownedCount} / ${definition.maximumInstances} built`,
          atMaximum,
          owned,
          selected: selectedRoomDefinitionId === definition.id,
          enabled:
            !atMaximum &&
            requirementsMet &&
            affordable,
          blockedReason,
        };
      }),
    ownedRooms: state.rooms
      .flatMap((room) => {
        const definition = getRoomDefinition(room.roomDefinitionId);
        if (!definition || definition.kind === "hallway") {
          return [];
        }
        const upgradeable = roomUpgradeable(room.roomDefinitionId);
        const upgradeCost = upgradeable
          ? getNextRoomUpgradeCost(state, room.id)
          : null;
        const benefit = roomUpgradeBenefit(room);
        const view: OwnedRoomBuildView = {
          id: room.id,
          roomDefinitionId: room.roomDefinitionId,
          displayName: buildRoomNames.get(room.id) ?? definition.displayName,
          category: roomBuildCategory(room.roomDefinitionId),
          upgradeLevel: room.upgradeLevel,
          maxUpgradeLevel: upgradeable ? definition.maximumUpgradeLevel : 1,
          upgradeable,
          ...(upgradeCost === null
            ? {}
            : { nextUpgradeCostLabel: `$${upgradeCost.toLocaleString()}` }),
          canUpgrade: upgradeCost !== null && state.cash >= upgradeCost,
          ...(benefit ? { benefitSummary: benefit.perUpgradeLabel, benefit } : {}),
          accessProblem: buildUnreachableRoomIds.has(room.id),
        };
        return [view];
      })
      // Stable sort keeps build order inside a type, so A sits before B.
      .sort(
        (left, right) =>
          roomBuildSortKey(left.roomDefinitionId) -
          roomBuildSortKey(right.roomDefinitionId),
      ),
    lockedRoomOptions: facilityBalance.roomDefinitions
      .filter(
        (definition) =>
          definition.constructionCost > 0 &&
          definition.buildable &&
          definition.unlockFacilityLevel === state.facilityLevel + 1,
      )
      .map((definition): LockedRoomBuildView => ({
        id: definition.id,
        displayName: definition.displayName,
        category: roomBuildCategory(definition.id),
        purpose: roomBuildPurpose(definition.id) ?? "",
        costLabel: `$${definition.constructionCost.toLocaleString()}`,
        unlockLabel: `Unlocks at Facility Level ${definition.unlockFacilityLevel}`,
      }))
      .sort(
        (left, right) =>
          roomBuildSortKey(left.id) - roomBuildSortKey(right.id),
      ),
    staffOptions: facilityBalance.staffRoleDefinitions
      .filter(
        (role) => role.unlockFacilityLevel <= state.facilityLevel,
      )
      .map((role) => {
        const hiredCount = state.employees.filter(
          (employee) => employee.staffRoleDefinitionId === role.id,
        ).length;
        const hired = hiredCount > 0;
        const roomCapacity = getRoomStaffCapacity(state, role.id);
        const atMaximum = hiredCount >= roomCapacity.capacity;
        const requirementsMet = role.requiredRoomDefinitionIds.every(
          (requiredId) => placedRoomDefinitionIds.has(requiredId),
        ) && (role.requiredAnyRoomDefinitionIds.length === 0 ||
          role.requiredAnyRoomDefinitionIds.some((requiredId) =>
            placedRoomDefinitionIds.has(requiredId),
          ));
        const affordable = state.cash >= role.hiringCost;
        const lacksGlp1StaffingSlot =
          role.id === "staff.glp1_np" && !hasGlp1StaffingSlot;
        const blockedReason = roomCapacity.capacity === 0
          ? role.id === "staff.radiologist"
            ? "Build a Reading Room to add four radiologist positions."
          : role.id === "staff.imaging_technician"
            ? "Build an Ultrasound, X-ray, or CT Room to add imaging technician capacity."
            : "Build a compatible room to add hiring capacity."
          : atMaximum
            ? `Maximum ${roomCapacity.capacity} hired for the rooms you have built.`
          : !requirementsMet
            ? `Requires ${role.requiredRoomDefinitionIds
                .filter(
                  (requiredId) =>
                    !placedRoomDefinitionIds.has(requiredId),
                )
                .map(
                  (requiredId) =>
                    getRoomDefinition(requiredId)?.displayName ??
                    requiredId,
                )
                .join(", ")}${role.requiredAnyRoomDefinitionIds.length > 0 ? `${role.requiredRoomDefinitionIds.length > 0 ? " and " : ""}one of: ${role.requiredAnyRoomDefinitionIds.map((id) => getRoomDefinition(id)?.displayName ?? id).join(", ")}` : ""}.`
            : lacksGlp1StaffingSlot
              ? "Requires an available slot in a reachable GLP-1 Telehealth Suite (maximum 2 NPs per suite)."
            : !affordable
              ? `Need $${(
                  role.hiringCost - state.cash
                ).toLocaleString()} more.`
              : undefined;
        return {
          id: role.id,
          displayName: `${role.displayName} ${hiredCount}/${roomCapacity.capacity}`,
          costLabel: `$${role.hiringCost.toLocaleString()} hire`,
          salaryLabel: `$${role.salaryPerExpenseInterval.toLocaleString()} salary / hr`,
          hired,
          enabled:
            !atMaximum &&
            requirementsMet &&
            !lacksGlp1StaffingSlot &&
            affordable,
          blockedReason,
        };
      }),
    staffRoles: facilityBalance.staffRoleDefinitions
      .filter((role) => role.unlockFacilityLevel <= state.facilityLevel)
      .map((role) => {
        const employees = state.employees.filter(
          (employee) => employee.staffRoleDefinitionId === role.id,
        );
        const requirementsMet = role.requiredRoomDefinitionIds.every(
          (requiredId) => placedRoomDefinitionIds.has(requiredId),
        ) && (role.requiredAnyRoomDefinitionIds.length === 0 ||
          role.requiredAnyRoomDefinitionIds.some((requiredId) =>
            placedRoomDefinitionIds.has(requiredId),
          ));
        const affordable = state.cash >= role.hiringCost;
        const roomCapacity = getRoomStaffCapacity(state, role.id);
        const atMaximum = employees.length >= roomCapacity.capacity;
        const lacksGlp1StaffingSlot =
          role.id === "staff.glp1_np" && !hasGlp1StaffingSlot;
        const blockedReason = roomCapacity.capacity === 0
          ? role.id === "staff.radiologist"
            ? "Build a Reading Room to add four radiologist positions."
          : role.id === "staff.imaging_technician"
            ? "Build an Ultrasound, X-ray, or CT Room to add imaging technician capacity."
            : "Build a compatible room to add hiring capacity."
          : atMaximum
            ? `Maximum ${roomCapacity.capacity} hired for the rooms you have built.`
          : !requirementsMet
            ? `Requires ${role.requiredRoomDefinitionIds
                .filter(
                  (requiredId) =>
                    !placedRoomDefinitionIds.has(requiredId),
                )
                .map(
                  (requiredId) =>
                    getRoomDefinition(requiredId)?.displayName ??
                    requiredId,
                )
                .join(", ")}${role.requiredAnyRoomDefinitionIds.length > 0 ? `${role.requiredRoomDefinitionIds.length > 0 ? " and " : ""}one of: ${role.requiredAnyRoomDefinitionIds.map((id) => getRoomDefinition(id)?.displayName ?? id).join(", ")}` : ""}.`
            : lacksGlp1StaffingSlot
              ? "Requires an available slot in a reachable GLP-1 Telehealth Suite (maximum 2 NPs per suite)."
            : !affordable
              ? `Need $${(
                  role.hiringCost - state.cash
                ).toLocaleString()} more.`
              : undefined;
        return {
          id: role.id,
          displayName: role.displayName,
          currentCount: employees.length,
          maximumCount: roomCapacity.capacity,
          hiringCostLabel: `$${role.hiringCost.toLocaleString()}`,
          employees: employees.map((employee) => ({
            id: employee.id,
            displayName: employee.displayName,
            roleDisplayName: role.displayName,
            salaryLabel: `$${employee.salaryPerExpenseInterval.toLocaleString()}/hr`,
            moraleLabel: `${employee.morale}%`,
            moralePercent: employee.morale,
            avatar: employee.appearance,
            training: createEmployeeTrainingView(state, employee.id),
            salaryPerHour: employee.salaryPerExpenseInterval,
            trainingTeamAverageAfterLabel: createRoleAverageAfterTrainingLabel(state, role.id, employees, employee.id),
            canDecreaseSalary:
              employee.salaryPerExpenseInterval >
              role.minimumSalaryPerExpenseInterval,
            canIncreaseSalary:
              employee.salaryPerExpenseInterval <
              role.maximumSalaryPerExpenseInterval,
          })),
          staffingGuidance: role.id === "staff.periop_nurse"
            ? "Each Peri-op/Recovery Room has two peri-op nurse positions."
            : role.id === "staff.radiologist"
              ? "Each Reading Room has four radiologist positions. Each operational radiologist has a separate queue and reads one study at a time."
            : role.id === "staff.glp1_np"
              ? `Each GLP-1 Telehealth Suite has two NP positions. Each staffed NP earns $${glp1ConsultPayment.toLocaleString("en-US", { maximumFractionDigits: 2 })} per facility hour.`
              : role.id === "staff.imaging_technician"
                ? "Each Ultrasound, X-ray, or CT Room adds one shared imaging technician position."
                : roomCapacity.builtRoomCount > 0
                  ? `Each compatible room adds capacity; ${roomCapacity.capacity} position${roomCapacity.capacity === 1 ? "" : "s"} available.`
                  : undefined,
          canHire:
            !atMaximum &&
            requirementsMet &&
            !lacksGlp1StaffingSlot &&
            affordable,
          blockedReason,
          trainingSummary: createRoleTrainingSummary(state, role.id, employees),
        };
      }),
    staffTraining: createStaffTrainingOverview(state),
    messages: createMessageBoardView(state),
    selectedRoomBuild: (() => {
      if (!selectedRoomInstanceId) {
        return null;
      }
      const room = state.rooms.find(
        (candidate) => candidate.id === selectedRoomInstanceId,
      );
      const definition = room
        ? getRoomDefinition(room.roomDefinitionId)
        : null;
      if (!room || !definition) {
        return null;
      }
      const upgradeCost = definition.buildable
        ? getNextRoomUpgradeCost(state, room.id)
        : null;
      const nextUpgradeLevel =
        upgradeCost === null ? undefined : room.upgradeLevel + 1;
      const resaleValue = getRoomResaleValue(state, room.id);
      const protectedRoom =
        facilityBalance.protectedRoomDefinitionIds.includes(
          room.roomDefinitionId,
        );
      const upgradeImprovements =
        nextUpgradeLevel === undefined
          ? []
          : [
              roomUpgradeBenefit(room)?.perUpgradeLabel ?? "",
              ...(definition.upkeepPerUpgradeLevel > 0
                ? [
                    `Hourly upkeep +$${definition.upkeepPerUpgradeLevel}.`,
                  ]
                : []),
            ];
      const upgradeable = roomUpgradeable(room.roomDefinitionId);
      const benefit = roomUpgradeBenefit(room);
      return {
        id: room.id,
        roomDefinitionId: room.roomDefinitionId,
        displayName: buildRoomNames.get(room.id) ?? definition.displayName,
        upgradeLevel: room.upgradeLevel,
        maxUpgradeLevel: upgradeable ? definition.maximumUpgradeLevel : 1,
        upgradeable,
        ...(benefit ? { benefit } : {}),
        canMove: !protectedRoom,
        accessProblem: buildUnreachableRoomIds.has(room.id),
        nextUpgradeLevel,
        upgradeCostLabel:
          upgradeCost === null
            ? undefined
            : `$${upgradeCost.toLocaleString()}`,
        upgradeImprovements,
        resaleValueLabel:
          resaleValue === null
            ? undefined
            : `$${resaleValue.toLocaleString()} refund`,
        canUpgrade:
          upgradeCost !== null && state.cash >= upgradeCost,
        canSell: !protectedRoom,
        salePreview: getRoomSalePreview(state, room.id, PROTOTYPE_DOMAIN_CONTEXT) ?? undefined,
        blockedReason: !definition.buildable
          ? "Legacy space is retained for this saved campaign and cannot be upgraded."
          : protectedRoom
          ? "The Front Desk is the clinic's permanent entrance and cannot be sold."
          : upgradeCost !== null && state.cash < upgradeCost
            ? `Need $${(
                upgradeCost - state.cash
              ).toLocaleString()} more to upgrade.`
            : undefined,
      };
    })(),
    development: {
      campaignIdLabel:
        state.campaignId.length > 20
          ? `${state.campaignId.slice(0, 17)}…`
          : state.campaignId,
      learningHistoryLabel: `${Object.values(
        state.learningHistories,
      ).filter((history) => history.reviews.length > 0).length} reviewed / ${
        Object.keys(state.learningHistories).length
      } available`,
      reviewCountLabel: `${state.reviewIntents.length} scored`,
      fastForwardLabel: `Fast-forward ${PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.development.fastForwardTickCount} min`,
      addMoneyLabel: `Add $${PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.development.addMoneyAmount}`,
      learningCards:
        PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts.map((concept) => ({
          conceptId: concept.id,
          conceptLabel: concept.displayName,
          statusLabel: formatLearningCardStatus(state, concept.id),
        })),
    },
    workloadStatus,
    patientAvailabilityGuidance: createPatientAvailabilityGuidance(state, Date.now()),
  };
}
