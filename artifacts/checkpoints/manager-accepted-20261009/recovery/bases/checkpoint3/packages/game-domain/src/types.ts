import type { PrototypeBalanceRelease } from "@gamify-surgery/balance-config";
import type {
  DecisionNode,
  SyntheticClinicalCase,
  SyntheticClinicalRelease,
  TerminalClinicalOutcome,
} from "@gamify-surgery/clinical-content";
import type {
  SerializedFsrsCard,
  SerializedFsrsReviewLog,
} from "./fsrs-adapter";

export type EncounterLifecycle =
  | "waiting_unopened"
  | "active_action_required"
  | "active_pending_result"
  | "resolved_summary_available"
  | "resolved";

export type ArrivalClass = "routine" | "tutorial" | "progression_critical";
export type ReviewRatingIntent = "Good" | "Again";
export type SimulationSpeed = 1 | 2 | 4;
export type RoomOrientation = 0 | 90 | 180 | 270;
export type CardinalDirection = "north" | "east" | "south" | "west";
export type RoomUpgradeLevel = 1 | 2 | 3 | 4 | 5;

/** Optional opt-in contract: old work without this marker keeps its original fee. */
export interface RoomUpgradeRevenueQuote {
  version: "room-upgrade-revenue.v1";
  baseFee: number;
  roomDefinitionId: string;
  candidates: Array<{ roomInstanceId: string; upgradeLevel: RoomUpgradeLevel; multiplier: number }>;
  /** Bound exactly once to the room that earns the fee, never to preparation or recovery. */
  boundRoom: { roomInstanceId: string; multiplier: number } | null;
}

export interface RoomUpgradeExperienceWitness {
  roomInstanceId: string;
  /** Frozen points, including zero; capped awards still consume the witness. */
  points: number;
  boundAtFacilityTick: number;
  appliedAtFacilityTick: number | null;
}

export interface RoomUpgradeExperience {
  version: "room-upgrade-experience.v1";
  waiting?: RoomUpgradeExperienceWitness;
  examination?: RoomUpgradeExperienceWitness;
  recovery?: RoomUpgradeExperienceWitness & { operationId: string };
}

/** Optional original-acceptance contract; unmarked legacy Recovery stays neutral. */
export interface RoomUpgradeRecoveryQuote {
  version: "room-upgrade-recovery.v1";
  phaseId: string;
  candidates: Array<{ roomInstanceId: string; points: number }>;
  boundRoom: { roomInstanceId: string; points: number } | null;
}
export type PrototypeAlertCategory =
  | "action_required"
  | "guidance"
  | "success"
  | "ambient_flavor"
  | "walkout_review";

export type PatientDissatisfactionCause =
  | "excessive_waiting"
  | "poor_cleanliness"
  | "missing_amenities"
  | "no_receptionist"
  | "imaging_unavailable"
  | "general";

export interface PatientDissatisfactionCauseState {
  pointsLost: number;
  lastAppliedAtFacilityTick: number;
}

export type FacilityExperienceConditionKey =
  | "visible_litter"
  | "dirty_cleanliness"
  | "empty_water_cooler"
  | "missing_waiting_room"
  | "missing_examination_room"
  | "missing_bathroom"
  | "no_receptionist"
  | "low_staff_morale"
  | "unavailable_onsite_xray";

/**
 * Alert-only conditions that do not contribute to the facility-experience
 * satisfaction calculation. Keeping these separate prevents financial,
 * advertising, and progression guidance from becoming accidental patient
 * satisfaction inputs.
 */
export type FacilityOperationalAlertConditionKey =
  | "low_cash"
  | "no_cash"
  | "advertising_recommended"
  | "waiting_room_crowded"
  | "room_upgrade_requested"
  | "progression_eligible";

export type FacilityAlertConditionKey =
  | FacilityExperienceConditionKey
  | FacilityOperationalAlertConditionKey;

export interface FacilityExperienceConditionSnapshot {
  conditionKey: FacilityExperienceConditionKey;
  penalty: number;
  cause: PatientDissatisfactionCause;
}

export interface EncounterFacilityExperienceSnapshot {
  appliedAtFacilityTick: number;
  totalPenalty: number;
  conditions: FacilityExperienceConditionSnapshot[];
}

export interface FacilityConditionAlertTarget {
  kind:
    | "litter"
    | "water_cooler"
    | "build_mode"
    | "room"
    | "staff_role"
    | "employee"
    | "emergency_glp1"
    | "advertising"
    | "goal";
  id: string;
}

export interface FacilityConditionOccurrenceState {
  /** Stable identity for this chronological onset or reminder row. */
  id: string;
  /** Stable alert-condition identity; only experience keys affect satisfaction. */
  conditionKey: FacilityAlertConditionKey;
  kind: "onset" | "reminder";
  occurredAtFacilityTick: number;
  /** Set when the condition clears; the historical row itself is retained. */
  resolvedAtFacilityTick: number | null;
  definitionId: string;
  message: string;
  priority: "action_required" | "informational";
  target: FacilityConditionAlertTarget | null;
}

export interface GridPoint {
  x: number;
  y: number;
}

/** Frozen inputs and progress for new diagnostic work; absent on legacy orders. */
export interface DiagnosticResourceChoice {
  roomInstanceId: string;
  roomDefinitionId: string;
  /** Reading workstations and Periop beds share a room without sharing a queue. */
  stationId: string | null;
  employeeIds: string[];
  provider: { kind: "employee"; employeeId: string } | { kind: "founder" } | null;
  patientAnchor: GridPoint;
  staffAnchor: GridPoint;
}

export interface DiagnosticResourceRequirement {
  roomDefinitionId: string;
  staffRoleDefinitionIds: string[];
  providerRoleDefinitionIds: string[];
  founderEligible: boolean;
  stationKind: "reading" | "periop_bed" | null;
}

/** Opt-in five-minute local reading contract; never added to legacy work. */
export interface RoomUpgradeReadingWork {
  version: "room-upgrade-reading.v1";
  baselineMinutes: 5;
  employeeReductionPercent: number;
  acceptedAtTick: number;
  executionEnabledAtTick: number | null;
  /** Actual completed dependencies, never their forecast. */
  readyAtTick: number | null;
  acceptedRooms: Array<{ roomInstanceId: string; upgradeLevel: RoomUpgradeLevel }>;
  quotedRoomInstanceId: string;
  boundRoomInstanceId: string | null;
  boundUpgradeLevel: RoomUpgradeLevel | null;
  durationMinutes: number | null;
}

export interface DiagnosticOrderPhase {
  id: string;
  componentId: string | null;
  kind: "collection" | "acquisition" | "preparation" | "procedure" | "recovery" |
    "interpretation" | "laboratory_processing" | "pathology" | "retained" | "patient_departure" | "patient_return";
  mode: "local" | "external";
  patientPresent: boolean;
  durationMinutes: number;
  dependsOn: string[];
  requirement: DiagnosticResourceRequirement | null;
  resource: DiagnosticResourceChoice | null;
  forecast: {
    readyAtTick: number;
    startsAtTick: number;
    endsAtTick: number;
    queueMinutes: number;
    walkingMinutes: number;
    patientPath: GridPoint[];
    employeePaths: Array<{ employeeId: string; path: GridPoint[] }>;
    founderPath: GridPoint[];
    tilesPerTick: number;
  };
  status: "pending" | "queued" | "active" | "completed" | "cancelled";
  /** Interrupted work keeps this value; it never rereads balance or restarts. */
  remainingMinutes: number;
  startedAtTick: number | null;
  completedAtTick: number | null;
  serviceOperationId: string | null;
  /** Phase identity inside a linked multi-phase physical operation. */
  operationPhaseId: string | null;
  readingUpgradeWork?: RoomUpgradeReadingWork;
}

export interface DiagnosticOrderMilestone {
  afterPhaseIds: string[];
  forecastAtTick: number;
  reachedAtTick: number | null;
}

export interface DiagnosticOrderPlan {
  version: "diagnostic-order.v1";
  /** New accepted plans freeze nurse skill; unmarked legacy plans stay exempt. */
  periopNurseAttentionQuote?: Pick<PeriopNurseAttentionState, "version" | "trainingPercent">;
  timingVersion: "diagnostic-timing.v1";
  orderId: string;
  encounterId: string;
  createdAtTick: number;
  /** Generic profiles can quote work without inventing an executable procedure. */
  execution: "supported" | "preview_only";
  sources: Array<{
    componentId: string | null;
    serviceId: string | null;
    timingProfileId: string | null;
    routeId: string | null;
    routeDisplayName: string;
    /** Optional for older v1 plans; new local acquisitions freeze their fee. */
    incomeLineId?: string;
    quoteFee?: number;
    /** Frozen fee paid once by the local interpretation. */
    readIncomeFee?: number;
    /** Absent on accepted legacy split contracts; new fees are additional. */
    readIncomeBilling?: "additive";
    roomUpgradeRevenue?: RoomUpgradeRevenueQuote;
    roomUpgradeRecovery?: RoomUpgradeRecoveryQuote;
    kind: "explicit_route_phases" | "approved_operation" | "retained_inclusive_total" | "retained_profile";
    inclusiveDurationMinutes: number;
    routePhases: Array<{ id: string; durationMinutes: number; resourceBound: boolean }>;
    operationPhases: Array<{
      id: string;
      roomDefinitionId: string | null;
      durationMinutes: number;
      staffRoleDefinitionIds: string[];
      providerRoleDefinitionIds: string[];
      founderEligible: boolean;
      roomStationId: string | null;
    }>;
  }>;
  phases: DiagnosticOrderPhase[];
  resultReady: DiagnosticOrderMilestone;
  /** Visual endoscopy findings can be viewed while recovery/pathology continues. */
  visualResultReady: DiagnosticOrderMilestone | null;
  careComplete: DiagnosticOrderMilestone;
}

/** Internal remote work; a marked read receives its reserved bundle portion. */
export interface DiagnosticPhaseWork {
  version: "diagnostic-phase-work.v1";
  orderId: string;
  encounterId: string;
  phaseId: string;
  kind: "interpretation" | "laboratory_processing" | "pathology";
  billing: "none";
  durationMinutes: number;
  remainingMinutes: number;
  resource: DiagnosticResourceChoice | null;
  readingUpgradeWork?: RoomUpgradeReadingWork;
  readIncomeFee?: number;
}

/** Binding of frozen diagnostic patient work to the existing physical engine. */
export interface DiagnosticPhysicalWork {
  version: "diagnostic-physical-work.v1";
  orderId: string;
  encounterId: string;
  componentId: string | null;
  billing: "existing_service" | "none";
  /** Legacy split only: withheld from acquisition, paid by the linked read. */
  readIncomeFee?: number;
  phaseBindings: Array<{ diagnosticPhaseId: string; operationPhaseId: string; resource: DiagnosticResourceChoice | null }>;
  phaseWitnesses: Array<{ operationPhaseId: string; startedAtFacilityTick: number | null; completedAtFacilityTick: number | null }>;
  /** Frozen remaining work at the most recent start/resume, never tick-decremented. */
  remainingPhaseMinutes: number | null;
}

export type PixelAppearanceVariant =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29;

/** Stable, presentation-only identifier for one authored adult patient.
 * It is intentionally separate from founder-compatible numeric variants. */
export type PatientIdentityId = `patient.adult.${string}`;

/** Persisted cosmetic still identity. Unknown bounded values are retained so
 * newer asset catalogs can round-trip through older domain builds. */
export type CharacterStillId = string;

export type PatientSexLabel = "Female" | "Male" | "Not specified";

export interface PixelAppearanceDescriptor {
  version: "pixel-avatar.v1";
  bodyShape: "compact" | "average" | "broad" | "tall";
  hairStyle: "none" | "short" | "parted" | "curly" | "bun";
  /**
   * Palette index for the character's persisted skin tone. Optional only for
   * pre-golden-slice saves; normalization fills it deterministically.
   */
  skinTone?: 0 | 1 | 2 | 3;
  hairShade: 0 | 1 | 2 | 3;
  faceStyle: "round" | "square" | "long";
  outfitStyle: "plain" | "striped" | "checked" | "coat";
  outfitShade: 0 | 1 | 2 | 3;
  accessory: "none" | "glasses" | "badge" | "headband";
  /**
   * Stable visual variants used by the shared portrait/map sprite generator.
   * These do not affect clinical demographics or gameplay.
   */
  headVariant?: PixelAppearanceVariant;
  bodyVariant?: PixelAppearanceVariant;
  /**
   * Canonical visual identity for the authored adult patient roster. This is
   * cosmetic matching data only; it never selects clinical content.
   */
  patientIdentityId?: PatientIdentityId;
  /** Cosmetic artwork identity, separate from clinical and patient identity. */
  stillId?: CharacterStillId;
  roleStyle?:
    | "founder"
    | "patient"
    | "receptionist"
    | "imaging_technician"
    | "periop_nurse"
    | "endoscopy_nurse"
    | "endoscopist"
    | "phlebotomist"
    | "evs_worker"
    | "glp1_np";
}

export interface FounderIdentity {
  displayName: string;
  headId: string;
  bodyId: string;
  appearance: PixelAppearanceDescriptor;
}

export interface DomainContext {
  /** Session-only storage failure gate; never serialized as campaign state. */
  guidanceTipsDeliveryBlocked?: boolean;
  /** Session attention holds never acquire or serialize a pause. */
  guidanceAttentionBlocked?: boolean;
  guidanceBlockedTopicIds?: readonly string[];
  clinicalRelease: SyntheticClinicalRelease;
  balanceRelease: PrototypeBalanceRelease;
}

export interface CreateCampaignOptions {
  campaignId?: string;
  campaignSeed?: string;
  createdAtRealMs?: number;
  founder?: FounderIdentity;
}

export interface WaitingState {
  arrivedAtTick: number;
  departureDueTick: number | null;
  patienceExempt: boolean;
  warningThresholdsShown: number[];
}

export interface AnswerRecord {
  decisionNodeId: string;
  primaryConceptId: string;
  answerChoiceId: string;
  correct: boolean;
  ratingIntent: ReviewRatingIntent;
  answeredAtFacilityTick: number;
  explanation: string;
  /** True when a wrong nonfinal answer continued through the approved path. */
  correctedForward: boolean;
}

export interface SchedulerReviewIntent {
  id: string;
  encounterId: string;
  decisionNodeId: string;
  primaryConceptId: string;
  rating: ReviewRatingIntent;
  facilityTick: number;
  reviewedAtMs: number;
}

export interface ConceptReviewEvidence {
  id: string;
  encounterId: string;
  decisionNodeId: string;
  questionVariantId: string;
  patientPresentationVariantId: string;
  primaryConceptId: string;
  answerChoiceId: string;
  correct: boolean;
  rating: ReviewRatingIntent;
  reviewedAtMs: number;
  facilityTick: number;
  schedulerLog: SerializedFsrsReviewLog;
}

export interface ConceptLearningHistory {
  conceptId: string;
  card: SerializedFsrsCard;
  reviews: ConceptReviewEvidence[];
}

export interface SchedulerPins {
  integrationVersion: "fsrs-adapter.v1";
  libraryName: "ts-fsrs";
  libraryVersion: "5.4.1";
  algorithmVersion: "FSRS-6";
  parameterSetId: string;
}

export interface PendingResult {
  diagnosticTiming?: DiagnosticOrderPlan;
  operationId: string;
  gateId: string;
  originatingNodeIndex: number;
  resultTypeId: string;
  pendingLabel: string;
  resultNarrative: string;
  routeId: string;
  routeDisplayName: string;
  scheduledAtTick: number;
  /**
   * Authored action interval. Patient travel and service dwell must fit
   * inside this interval; route time is never silently added afterward.
   */
  serviceDurationTicks: number;
  durationTicks: number;
  dueTick: number;
  deliveredAtTick: number | null;
  /**
   * New perioperative result orders run their local work through the service
   * operation engine before the frozen external-result interval begins.
   * Undefined preserves the timing and travel of existing pending results.
   */
  localServiceOperation?: {
    version: "pending-result-service-operation.v1";
    status: "feedback_pending" | "waiting_for_service" | "external_processing";
    incomeLineId: string;
    serviceOperationId: string | null;
    externalDurationTicks: number;
  };
  /** Non-busy witness for routing a returned procedure question to its completed suite. */
  completedCareProvenance?: {
    version: "completed-care-provenance.v1";
    serviceOperationId: string;
    roomInstanceId: string;
    provider: { kind: "employee"; employeeId: string } | { kind: "founder" } | null;
  };
  /**
   * Set when an off-site patient begins the persisted offscreen-to-Front-Desk
   * return route. Null before that transition.
   */
  offsiteReturnStartedAtTick: number | null;
  /**
   * Frozen sidewalk itinerary for services performed away from the clinic.
   * Null for in-facility routes and legacy results not yet normalized.
   */
  offsiteTravel: FrozenOffsitePatientTravel | null;
  /**
   * Exact facility route and timing selected when the service was scheduled.
   * Null means the route is off-site or otherwise has no simulated facility
   * travel.
   */
  patientTravel: FrozenPatientTravel | null;
  /** The service occurs at the patient's current care location without a journey. */
  patientRemainsOnsite?: true;
  /** The patient may leave clinic while an already-collected specimen is processed; no outside acquisition visit is implied. */
  externalProcessingOnly?: true;
  /** Frozen editorial service phases; they never read later balance values. */
  timingPhases?: Array<{ id: string; durationTicks: number; resourceBound: boolean; startsAtTick: number; endsAtTick: number }>;
  /** Undefined in legacy saves: no new fee is backpaid. */
  serviceIncomeEligible?: true;
  /** Frozen only for work scheduled after the income feature was introduced. */
  serviceIncomeLineId?: string;
  serviceIncomeFee?: number;
  roomUpgradeRevenue?: RoomUpgradeRevenueQuote;
  roomUpgradeRecovery?: RoomUpgradeRecoveryQuote;
  resourceReservations?: Array<{ roomDefinitionId: string; staffRoleDefinitionId: string | null }>;
  /** Concrete mobile imaging worker selected for this frozen onsite service. */
  imagingTechnicianId?: string | null;
  /** Concrete worker assigned to a newly scheduled onsite blood draw. */
  phlebotomistId?: string | null;
  /** Opts new phlebotomy orders into patient-and-worker arrival-gated timing. */
  phlebotomyArrivalGatedVersion?: 1;
  /** Frozen selected clinician capacity for a resource-bound service. */
  providerReservation?:
    | {
        kind: "employee";
        employeeId: string;
        staffRoleDefinitionId: string;
      }
    | { kind: "founder" }
    | null;
  /** Opt-in timing semantics for owner-approved onsite procedure work. */
  approvedProcedureTimingVersion?: 1;
  /**
   * New onsite orders may wait for installed resources without freezing a
   * concrete room, worker, path, or result clock. Undefined preserves legacy
   * and already-dispatched pending results exactly.
   */
  resourceQueue?: {
    version: "onsite-resource-queue.v1";
    status: "waiting_for_resources";
    serviceId: string;
    routeId: string;
    allowedRouteIds: string[] | null;
    queuedAtTick: number;
  };
  /** Opt-in physical report-in lifecycle for newly scheduled onsite work. */
  onsiteReturn?: {
    version: "onsite-front-desk-return.v1";
    status:
      | "awaiting_service_completion"
      | "walking_to_front_desk"
      | "front_desk_arrived";
    serviceCompletedAtTick: number | null;
    frontDeskArrivalTick: number | null;
  };
}

export interface FrozenPatientTravel {
  version: "patient-travel.v1";
  originRoomInstanceId: string;
  destinationRoomInstanceId: string;
  outboundPath: GridPoint[];
  returnPath: GridPoint[];
  tilesPerTick: number;
  outboundStartTick: number;
  outboundArrivalTick: number;
  serviceCompletionTick: number;
  returnArrivalTick: number;
}

export interface FrozenOffsitePatientTravel {
  version: "offsite-patient-travel.v1";
  direction: -1 | 1;
  outboundPath: GridPoint[];
  returnPath: GridPoint[];
  tilesPerTick: number;
  outboundStartTick: number;
  outboundArrivalTick: number;
  returnStartTick: number;
  returnArrivalTick: number;
}

export type PatientMovementKind =
  | "arriving_for_check_in"
  | "walking_to_waiting"
  | "walking_to_care"
  | "departing_for_offsite_testing"
  | "returning_from_offsite_testing"
  | "returning_from_onsite_service"
  | "idle_within_room"
  | "leaving_after_resolution"
  | "leaving_after_walkout";

/**
 * Persisted route progress for ordinary patient movement.
 *
 * Clinical and operational transitions are completed by the reducer when the
 * patient reaches the end of this route. Phaser only visualizes the saved
 * position; it never owns task completion.
 */
export interface PatientMovementState {
  kind: PatientMovementKind;
  path: GridPoint[];
  pathIndex: number;
  lastMovedAtFacilityTick: number;
  destinationRoomInstanceId: string | null;
}

export type EncounterStepStatus =
  | "locked"
  | "action_required"
  | "feedback_pending"
  | "result_pending"
  | "completed";

/**
 * Persisted, presentation-ready structure for a multi-step chart.
 *
 * The frozen case owns authored wording and answer order. This record owns
 * what the learner selected and the exact result route/timing that occurred.
 */
export interface EncounterStepState {
  nodeIndex: number;
  decisionNodeId: string;
  questionVariantId: string;
  primaryConceptId: string;
  status: EncounterStepStatus;
  answer: AnswerRecord | null;
  result: PendingResult | null;
}

export interface TerminalFeedback {
  kind: "completion" | "correction" | "terminal_outcome";
  outcome: TerminalClinicalOutcome | null;
  /** Authored final-choice consequence, including explicit no-immediate-harm results. */
  consequence: string | null;
  correction: string | null;
  acknowledged: boolean;
}

export interface EncounterSettlement {
  id: string;
  encounterId: string;
  completionRevenue: number;
  qualityRevenueBonus: number;
  incorrectFinancialConsequence: number;
  netCashDelta: number;
  satisfactionDelta: number;
  clinicalXpAwarded: number;
  correctAnswers: number;
  incorrectAnswers: number;
  terminalOutcomeSeverity: "minor" | "major" | null;
  settledAtFacilityTick: number;
}

export interface ServiceIncomeReceipt {
  id: string;
  transactionKey: string;
  incomeLineId: string;
  catalogVersion: 1;
  routeId: string | null;
  actorKind: "patient" | "visitor" | "employee" | "founder" | "remote" | "retail_visitor" | "companion";
  actorId: string;
  displayAnchor?:
    | { actorKind: "employee"; actorId: string }
    | { actorKind: "founder"; actorId: "founder" };
  grossAmount: number;
  stockCost: number;
  netCashDelta: number;
  completedAtFacilityTick: number;
}

export interface RadiologistReadTotals {
  inHouseReads: number;
  inHouseIncomeCents: number;
  outsideReads: number;
  outsideIncomeCents: number;
}

export interface RadiologistReadIncomeState {
  version: "radiologist-read-income.v1";
  nextOutsideReadSequence: number;
  dayNumber: number;
  facilityLevel: number;
  today: RadiologistReadTotals;
  thisLevel: RadiologistReadTotals;
}

export interface OutsideRadiologyRead {
  version: "outside-radiology-read.v1";
  sequence: number;
  employeeId: string;
  roomInstanceId: string;
  stationId: string;
  startedAtFacilityTick: number;
  lastObservedAtFacilityTick: number;
  baselineMinutes: number;
  employeeReductionPercent: number;
  upgradeLevel: RoomUpgradeLevel;
  durationMinutes: number;
  fee: number;
}

export type ServiceOperationStatus =
  | "arriving"
  | "waiting_for_resources"
  | "walking_to_service"
  | "in_service"
  | "walking_between_phases"
  | "waiting_for_next_phase"
  | "discharging"
  | "leaving"
  | "completed"
  | "cancelled";

export interface PeriopNurseAttentionTask {
  phaseIndex: number;
  kind: "pre_op" | "post_op";
  /** Frozen once, independently of the patient's (possibly trained) phase. */
  durationMinutes: number;
  remainingMinutes: number;
  readyAtFacilityTick: number | null;
  requiredUntilFacilityTick: number | null;
  employeeId: string | null;
  standingPoint: GridPoint | null;
  startedAtFacilityTick: number | null;
  completedAtFacilityTick: number | null;
  lastProgressAtFacilityTick: number | null;
}

export interface PeriopNurseAttentionState {
  version: "periop-nurse-attention.v1";
  trainingPercent: number;
  tasks: PeriopNurseAttentionTask[];
}

export interface ServiceOperationState {
  diagnosticPhaseWork?: DiagnosticPhaseWork;
  diagnosticPhysicalWork?: DiagnosticPhysicalWork;
  id: string;
  incomeLineId: string;
  catalogVersion: 1;
  actorKind: "visitor" | "encounter" | "remote";
  actorId: string;
  displayName: string;
  appearance: PixelAppearanceDescriptor | null;
  status: ServiceOperationStatus;
  createdAtFacilityTick: number;
  waitDeadlineFacilityTick: number;
  startedAtFacilityTick: number | null;
  completedAtFacilityTick: number | null;
  cancelledAtFacilityTick: number | null;
  quoteFee: number;
  roomUpgradeRevenue?: RoomUpgradeRevenueQuote;
  roomUpgradeRecovery?: RoomUpgradeRecoveryQuote;
  phaseIndex: number;
  phaseStartedAtFacilityTick: number | null;
  phaseEndsAtFacilityTick: number | null;
  reservedRoomInstanceIds: string[];
  reservedEmployeeIds: string[];
  providerReservation:
    | { kind: "employee"; employeeId: string }
    | { kind: "founder" }
    | null;
  /** Historical care witness; it never reserves the room or provider. */
  completedCareProvenance?: {
    version: "completed-care-provenance.v1";
    roomInstanceId: string;
    provider: { kind: "employee"; employeeId: string } | { kind: "founder" } | null;
  };
  location: GridPoint | null;
  path: GridPoint[];
  pathIndex: number;
  lastMovedAtFacilityTick: number;
  cancellationReason: string | null;
  resourceWaitReason?: string | null;
  /** Frozen sidewalk continuity for scheduled diagnostic visitors. */
  visitorTravel?: {
    version: "service-visitor-travel.v1";
    offscreenEndpoint: GridPoint;
    arrivedAtFacilityTick: number | null;
  };
  /** New encounter operations wait indefinitely for installed onsite resources. */
  resourceQueueVersion?: 1;
  /** New periop-first operations reserve and release one phase at a time. */
  phaseFlowVersion?: 1;
  /** New operations bind one real Periop bed from preparation through physical discharge. */
  periopBedFlowVersion?: 1;
  /** Opt-in for new work; unmarked saved phases retain legacy attendance. */
  periopNurseAttention?: PeriopNurseAttentionState;
  periopBedReservation?: {
    version: "periop-bed-reservation.v1";
    roomInstanceId: string;
    bedId: string;
    endpoint: GridPoint;
  };
  /** Stable FIFO timestamp for a physically present patient waiting on the next phase. */
  nextPhaseReadyAtFacilityTick?: number | null;
  /** Rooms retained until the actor physically clears the outgoing suite. */
  transitionHeldRoomInstanceIds?: string[];
  /** Current phase was interrupted by a room sale and must restart in compatible capacity. */
  saleTransfer?: {
    version: "room-sale-transfer.v1";
    interruptedAtFacilityTick: number;
    remainingPhaseMinutes: number;
  };
  departureItinerary?: {
    version: "service-departure-itinerary.v1";
    status: "pending" | "bathroom" | "retail" | "completed" | "skipped";
    choiceKind: "bathroom" | "retail" | "none" | null;
    selectedAtFacilityTick: number | null;
    completedAtFacilityTick: number | null;
    linkedTripId: string | null;
    retailIncomeLineId: string | null;
  };
  /** New work snapshots category skill; each phase binds its alternative once. */
  trainingTiming?: {
    version: "employee-training-timing.v1";
    categoryPercents: Record<string, number>;
    phases: Array<{ phaseId: string; baselineMinutes: number; boundPercent: number | null }>;
  };
  /** Frozen staged-order work template; ordinary and older operations continue using their catalog template. */
  frozenOperationPhases?: Array<{
    id: string;
    roomDefinitionId: string | null;
    durationMinutes: number;
    staffRoleDefinitionIds: string[];
    providerRoleDefinitionIds?: string[];
    founderEligible?: true;
    roomStationId?: "periop_preparation" | "periop_recovery";
  }>;
  /** Frozen exact authored test order for encounter work scheduled by a choice. */
  testChoiceOrder?: {
    version: "test-choice-order.v1";
    purpose: "terminal" | "continuation" | "staged_result_component" | "result_gate";
    caseId: string;
    nodeId: string;
    questionVariantId: string;
    choiceId: string;
    choiceLabel: string;
    serviceId: string;
    routeId: string;
    routeDisplayName: string;
    externalRemainder: string | null;
    componentId?: string;
  };
}

export interface PatientAmenityTripState {
  version: "patient-amenity-trip.v1";
  id: string;
  actorKind: "encounter" | "service_visitor";
  actorId: string;
  amenityKind: "bathroom";
  bathroomRoomInstanceId: string;
  status: "walking_to_amenity" | "using_amenity" | "returning";
  startedAtFacilityTick: number;
  dwellEndsAtFacilityTick: number | null;
  returnRequested: boolean;
  returnTarget: GridPoint;
  path: GridPoint[];
  pathIndex: number;
  lastMovedAtFacilityTick: number;
  purpose?: "departure";
  linkedServiceOperationId?: string;
}

export type RetailActorKind = "employee" | "founder" | "encounter" | "service_visitor" | "retail_visitor" | "companion";
export type RetailOperationStatus = "walking_to_outlet" | "queued" | "purchasing" | "returning" | "leaving" | "completed" | "abandoned" | "cancelled";

export interface RetailOperationState {
  id: string;
  incomeLineId: string;
  catalogVersion: 1;
  actorKind: RetailActorKind;
  actorId: string;
  displayName: string;
  appearance: PixelAppearanceDescriptor;
  linkedServiceOperationId: string | null;
  authorizedOrderId: string | null;
  status: RetailOperationStatus;
  createdAtFacilityTick: number;
  waitDeadlineFacilityTick: number;
  startedAtFacilityTick: number | null;
  completedAtFacilityTick: number | null;
  quoteGross: number;
  roomUpgradeRevenue?: RoomUpgradeRevenueQuote;
  quoteStockCost: number;
  outletRoomInstanceId: string;
  outletDurationMinutes: number;
  staffRoleDefinitionId: string | null;
  servingEmployeeId: string | null;
  location: GridPoint;
  returnLocation: GridPoint | null;
  path: GridPoint[];
  pathIndex: number;
  lastMovedAtFacilityTick: number;
  purchaseEndsAtFacilityTick: number | null;
  cancellationReason: string | null;
  resourceWaitReason?: string | null;
  departureServiceOperationId?: string;
}

export interface ProcedureCompanionState {
  version: "procedure-companion.v1";
  phase: "waiting_in_periop" | "walking_to_amenity" | "using_amenity" | "returning_to_periop" | "leaving_with_patient";
  periopRoomInstanceId: string | null;
  waitingReservation: {
    roomInstanceId: string;
    location: GridPoint;
    kind: "chair" | "standing";
    seatId: string | null;
  } | null;
  /** One seeded amenity decision per procedure phase, preserved through reload. */
  amenityDecisionPhaseIndex: number | null;
  amenityRoomInstanceId: string | null;
  amenityDwellEndsAtFacilityTick: number | null;
}

export interface RetailExternalActorState {
  id: string;
  kind: "retail_visitor" | "companion";
  displayName: string;
  appearance: PixelAppearanceDescriptor;
  linkedServiceOperationId: string | null;
  linkedEncounterId: string | null;
  lifecycle: "arriving" | "onsite" | "departing" | "departed";
  location: GridPoint | null;
  path: GridPoint[];
  pathIndex: number;
  lastMovedAtFacilityTick: number;
  activeRetailOperationId: string | null;
  /** A blocked optional actor journey is visible and retried, never an alert. */
  movementWaitReason?: string | null;
  /** Linked legacy procedure companions are adopted on load/tick. */
  procedureCompanion?: ProcedureCompanionState;
}

export interface RetailOrderState {
  id: string;
  actorKind: RetailActorKind;
  actorId: string;
  incomeLineId: string;
  allowance: number;
  fulfilledQuantity: number;
  createdAtFacilityTick: number;
}

export interface RetailActorLedgerState {
  dayNumber: number;
  foodDayNumber: number;
  discretionarySpent: number;
  foodDrinkPurchases: number;
  giftSupplyPurchases: number;
  lastTripAtFacilityTick: number | null;
}

export interface EncounterState {
  id: string;
  clinicalReleaseId: string;
  frozenCase: SyntheticClinicalCase;
  /**
   * Feed-only attention timer for an unaddressed patient condition. The
   * reducer clears it as soon as the player addresses the condition, so waits
   * shorter than the configured grace period never become Alerts & Events
   * rows. Once a row is emitted, the DomainEvent remains durable history.
   */
  feedAttentionKind:
    | "checked_in"
    | "clinical_decision"
    | "result_ready"
    | null;
  feedAttentionStartedAtTick: number | null;
  patientDisplayName: string;
  patientAppearance: PixelAppearanceDescriptor;
  /** Live patient experience score used for waiting pressure and walkouts. */
  patientSatisfaction: number;
  idleWaitingSinceTick: number | null;
  lastSatisfactionDecayAtTick: number;
  walkoutThreshold: number;
  /** First feed warning for this encounter's actual walkout-risk window. */
  departureRiskWarningAtTick: number | null;
  satisfactionWarningsShown: number[];
  /**
   * Persisted attribution for losses to the one patient-satisfaction score.
   * This drives cause-aware walkout copy without introducing another resource.
   */
  dissatisfactionByCause: Partial<
    Record<PatientDissatisfactionCause, PatientDissatisfactionCauseState>
  >;
  /**
   * Persisted one-time facility-condition assessment applied at Front Desk
   * check-in. Null means the arriving patient has not checked in yet.
   */
  facilityExperienceAtCheckIn: EncounterFacilityExperienceSnapshot | null;
  /** Operational arrival state; intentionally separate from clinical lifecycle. */
  checkInStatus: "approaching" | "awaiting_staff" | "checked_in";
  /** Tick at which the patient began waiting at the Front Desk for staff. */
  checkInWaitingSinceTick: number | null;
  /** Prevents the staffed-check-in overdue consequence from repeating. */
  unstaffedCheckInOverdueApplied: boolean;
  finalPatientSatisfaction: number | null;
  roomUpgradeExperience?: RoomUpgradeExperience;
  resolvedAtFacilityTick: number | null;
  arrivalClass: ArrivalClass;
  protectedGuaranteeId: string | null;
  lifecycle: EncounterLifecycle;
  resolutionReason: "completed" | "walkout" | null;
  /** Current persisted map position; null means the patient is off-site. */
  patientLocation: GridPoint | null;
  /** Persisted route used for arrivals, care, send-outs, returns, and exits. */
  patientMovement: PatientMovementState | null;
  /** Last in-facility room assigned to this patient. */
  assignedRoomInstanceId: string | null;
  /**
   * Exam reservation made when a chart opens while the patient is finishing
   * another legal walking leg. This prevents another chart from claiming the
   * same room and avoids interrupting a route mid-tile.
   */
  queuedCareRoomInstanceId: string | null;
  /** Reserved indoor waiting endpoint, retained while the patient travels or waits. */
  waitingDestination: {
    roomInstanceId: string | null;
    location: GridPoint;
    kind: "chair" | "standing" | "public_wander";
  } | null;
  nextIdleActionAtFacilityTick: number;
  currentNodeIndex: number;
  firstOpenedAtTick: number | null;
  waiting: WaitingState;
  answers: AnswerRecord[];
  steps: EncounterStepState[];
  pendingResult: PendingResult | null;
  /** Frozen local component of a non-result test order before an authored later follow-up. */
  testOnlyContinuation?: {
    diagnosticTiming?: DiagnosticOrderPlan;
    version: "test-only-continuation.v1";
    originatingNodeIndex: number;
    serviceId: string;
    routeId: string;
    routeDisplayName: string;
    incomeLineId: string | null;
    externalRemainder: string;
    quoteFee?: number;
    roomUpgradeRevenue?: RoomUpgradeRevenueQuote;
    roomUpgradeRecovery?: RoomUpgradeRecoveryQuote;
    status: "feedback_pending" | "waiting_for_service" | "returning_to_front_desk" | "completed" | "external_arranged";
    serviceOperationId: string | null;
    scheduledAtFacilityTick: number;
    completedAtFacilityTick: number | null;
    /** Persisted only when a room sale forces the local component off site. */
    saleInterruptedOffsite?: {
      version: "sale-interrupted-continuation.v1";
      readyAtFacilityTick: number | null;
      offscreenEndpoint: GridPoint | null;
      returnPath: GridPoint[];
    };
  };
  /** Frozen supported local pieces that must finish before an authored external result gate begins. */
  stagedResultOrder?: {
    diagnosticTiming?: DiagnosticOrderPlan;
    version: "staged-result-order.v1";
    originatingNodeIndex: number;
    caseId: string;
    nodeId: string;
    questionVariantId: string;
    choiceId: string;
    choiceLabel: string;
    status: "feedback_pending" | "waiting_for_component" | "returning_to_front_desk" | "remainder_pending" | "completed";
    remainderMode: "external_patient_visit" | "external_processing";
    currentComponentIndex: number;
    components: Array<{
      diagnosticTiming?: DiagnosticOrderPlan;
      componentId: string;
      serviceId: string;
      routeId: string;
      routeDisplayName: string;
      incomeLineId: string;
      quoteFee: number;
      roomUpgradeRevenue?: RoomUpgradeRevenueQuote;
      roomUpgradeRecovery?: RoomUpgradeRecoveryQuote;
      operationPhases: Array<{
        id: string;
        roomDefinitionId: string | null;
        durationMinutes: number;
        staffRoleDefinitionIds: string[];
        providerRoleDefinitionIds?: string[];
        founderEligible?: true;
        roomStationId?: "periop_preparation" | "periop_recovery";
      }>;
      externalRemainder: string;
      status: "pending" | "waiting_for_service" | "returning_to_front_desk" | "completed" | "cancelled";
      serviceOperationId: string | null;
    }>;
    /** Authored external route/result frozen at answer time; its clock starts after local return. */
    remainder: PendingResult;
  };
  /** Durable terminal test order, including offsite routes that create no local operation. */
  terminalTestOrder?: {
    diagnosticTiming?: DiagnosticOrderPlan;
    version: "terminal-test-order.v1";
    caseId: string;
    nodeId: string;
    questionVariantId: string;
    choiceId: string;
    choiceLabel: string;
    serviceId: string;
    routeId: string;
    routeDisplayName: string;
    externalRemainder: string | null;
    status: "onsite_service" | "external_arranged";
    serviceOperationId: string | null;
    scheduledAtFacilityTick: number;
  };
  deliveredResultNarratives: string[];
  terminalFeedback: TerminalFeedback | null;
  settlementId: string | null;
  /** Explicit authored restriction. Undefined uses the safe operational default. */
  retailFoodDrinkAllowed?: boolean;
}

export interface PlacedRoom {
  id: string;
  roomDefinitionId: string;
  x: number;
  y: number;
  orientation: RoomOrientation;
  doorSide: CardinalDirection | null;
  upgradeLevel: RoomUpgradeLevel;
  /** Version-5 saves always persist this; optional only for legacy fixtures/imports. */
  cleanliness?: number;
  /** Level 3 equipment upkeep is independent of EVS cleanliness. */
  maintenance?: {
    status: "operational" | "due" | "out_of_service";
    completedUses: number;
    dueAtFacilityTick: number | null;
    outOfServiceAtFacilityTick: number | null;
    appliedUseKeys: string[];
  };
}

export interface DoorState {
  id: string;
  roomId: string;
  side: CardinalDirection;
  /** Zero-based position along the selected wall. */
  offset: number;
  exterior: boolean;
}

export type RoomUpgradeSupportEffectKind =
  | "cleaning_duration_reduction_percent"
  | "repair_duration_reduction_percent"
  | "quality_review_duration_reduction_percent"
  | "training_duration_reduction_percent";

/** Optional frozen work contract; unmarked legacy support retains its old terms. */
export interface RoomUpgradeSupportWork {
  version: "room-upgrade-support.v1";
  effectKind: RoomUpgradeSupportEffectKind;
  baselineMinutes: number;
  employeeReductionPercent: number;
  acceptedRooms: Array<{ roomInstanceId: string; upgradeLevel: RoomUpgradeLevel }>;
  boundRoomInstanceId: string | null;
  boundUpgradeLevel: RoomUpgradeLevel | null;
  durationMinutes: number | null;
}

export interface RoomUpgradeBreakBenefit {
  version: "room-upgrade-break.v1";
  roomInstanceId: string;
  upgradeLevel: RoomUpgradeLevel;
  baselineMoraleGain: number;
  moraleGain: number;
}

export interface EmployeeFacilityTaskState {
  kind: "refill_water" | "collect_litter" | "clean_room" | "perform_imaging" | "perform_service" | "cover_periop" | "periop_attention" | "participate_qi_discussion" | "take_break" | "repair_room" | "review_ambulatory_qi";
  startedAtFacilityTick: number;
  workMinutesRemaining: number;
  targetId?: string;
  seatId?: LevelThreeBreakSeatId;
  /** Frozen on new EVS room jobs; legacy jobs restore their baseline quantity. */
  cleanlinessRestore?: number;
  /** Allows fractional remaining work only for strictly marked new support jobs. */
  roomUpgradeWork?: RoomUpgradeSupportWork;
  roomUpgradeBreakBenefit?: RoomUpgradeBreakBenefit;
}

export interface EmployeeTrainingState {
  version: 1;
  requestSequence: number;
  requestedAtFacilityTick: number;
  /** Finish an already-running automated consultation before departing. */
  earliestDepartureAtFacilityTick: number;
  paidAmount: number;
  targetLevel: 2 | 3 | 4 | 5;
  stage: "queued" | "walking_to_training" | "training" | "returning";
  roomInstanceId: string | null;
  placeId: "stool1" | "stool2" | null;
  remainingMinutes: number;
  startedAtFacilityTick: number | null;
  completedAtFacilityTick: number | null;
  lastProgressAtFacilityTick: number;
  roomUpgradeWork?: RoomUpgradeSupportWork;
}

export interface EmployeeState {
  id: string;
  staffRoleDefinitionId: string;
  displayName: string;
  appearance: PixelAppearanceDescriptor;
  hiredAtFacilityTick: number;
  salaryPerExpenseInterval: number;
  morale: number;
  trainingLevel: RoomUpgradeLevel;
  /** Paid training request/session; omitted in legacy campaigns and fixtures. */
  training?: EmployeeTrainingState | null;
  homeRoomInstanceId: string | null;
  /** Stable approved reading cubicle; absent for other/legacy employees. */
  readingStationId?: string;
  location: GridPoint;
  path: GridPoint[];
  pathIndex: number;
  lastMovedAtFacilityTick: number;
  lastPraisedAtFacilityTick: number | null;
  lastBreakAtFacilityTick?: number | null;
  /** Fair peri-op dispatch; absent in older saves means no previous check. */
  lastPeriopAttentionAssignedAtFacilityTick?: number;
  nextIdleActionAtFacilityTick: number;
  /** Persisted operational work that temporarily supersedes room idling. */
  facilityTask?: EmployeeFacilityTaskState | null;
}

export type LevelThreeBreakSeatId = "massage" | "largeNorth" | "largeSouth" | "largeWest" | "largeEast" | "smallNorth" | "smallSouth";

export interface LevelThreeQiReviewState {
  id: string;
  receiptId: string;
  status: "queued" | "in_progress" | "completed";
  surgeonEmployeeId: string | null;
  enqueuedAtFacilityTick: number;
  startedAtFacilityTick: number | null;
  completedAtFacilityTick: number | null;
  /** Accepted work survives clinical preemption and changes in category skill. */
  trainingWork?: { version: "employee-training-work.v1"; durationMinutes: number; remainingMinutes: number };
  roomUpgradeWork?: RoomUpgradeSupportWork;
}

/** A dismissed employee retained only while their visible exit walk completes. */
export interface DepartingEmployeeState extends EmployeeState {
  dismissedAtFacilityTick: number;
}

export interface LitterState {
  id: string;
  roomId: string;
  location: GridPoint;
  spawnedAtFacilityTick: number;
}

/** A non-patient visual passerby that remains on the exterior sidewalk. */
export interface AmbientPedestrianState {
  id: string;
  appearance: PixelAppearanceDescriptor;
  path: GridPoint[];
  pathIndex: number;
  lastMovedAtFacilityTick: number;
}

export interface FounderActivityState {
  kind:
    | "walk_to_point"
    | "collect_litter"
    | "refill_water"
    | "praise_employee"
    | "attend_encounter"
    | "return_to_front_desk"
    | "wander_facility"
    | "sit_in_chair"
    | "visit_bathroom"
    | "perform_service"
    | "attend_employee_discussion";
  targetId: string;
  path: GridPoint[];
  pathIndex: number;
  lastMovedAtFacilityTick: number;
  workMinutesRemaining: number;
  /** A player-selected chair holds until a newer command or required work supersedes it. */
  explicitSeat?: boolean;
}

export interface FacilityEnvironmentState {
  founderLocation: GridPoint;
  founderActivity: FounderActivityState | null;
  /** Benign explicit movement paused while an answer-ready consult is open. */
  suspendedFounderActivity?: FounderActivityState | null;
  /** The one still-unanswered chart allowed to retry physical founder attendance. */
  pendingFounderConsult?: {
    kind: "encounter" | "employee_discussion";
    targetId: string;
    nodeId: string;
  } | null;
  ambientPedestrians: AmbientPedestrianState[];
  ambientPedestrianSequence: number;
  nextAmbientPedestrianTick: number;
  litterItems: LitterState[];
  litterSequence: number;
  /** Set when the player first successfully starts a litter-cleaning action. */
  trashTeachingAcknowledgedAtTick: number | null;
  /** Durable completion marker for the one-time visible-trash teaching prompt. */
  founderLitterCleanups: number;
  /** Facility tick of the latest completed cleanup, used to pace later complaints. */
  lastLitterCleanupAtTick: number | null;
  nextLitterSpawnTick: number;
  glp1AutomationConsultationsCompleted: number;
  /** Durable timer and concrete worker identity for each staffed GLP-1 suite. */
  glp1AutomationSlots: Array<{
    suiteRoomInstanceId: string;
    employeeId: string;
    nextPayoutTick: number;
    /** Optional frozen staff-only legacy payment, or the full new room-and-staff quote. */
    quotePayment?: number;
    roomUpgradeRevenue?: RoomUpgradeRevenueQuote;
  }>;
  /** One due tick per currently operational staffed GLP-1 suite. */
  glp1AutomationNextPayoutTicks: number[];
  /** Legacy summary of the earliest due payout, retained for v6 compatibility. */
  glp1AutomationNextPayoutTick: number | null;
  coffeeMoraleAppliedDayNumber: number;
  lastEvsRoomCleanupAtTick: number | null;
  waterCoolerFillPercent: number;
  nextWaterCoolerDrainTick: number;
  /** Start of the current continuously-empty episode, if any. */
  waterCoolerEmptySinceTick: number | null;
  /** Next ten-operating-hour reminder during the current empty episode. */
  nextWaterCoolerReminderTick: number | null;
  facilityConditionOccurrenceSequence: number;
  /** Durable rows; resolution clears attention without deleting history. */
  facilityConditionOccurrences: FacilityConditionOccurrenceState[];
}

export interface EmergencyGlp1State {
  dayNumber: number;
  usesToday: number;
  totalUses: number;
  lastUsedAtFacilityTick: number | null;
  sarcasmMessagesShown: number;
  lastFlavorMessage: string | null;
}

export type EmployeeDiscussionLifecycle =
  | "waiting_unopened"
  | "active_traveling"
  | "active_action_required"
  | "feedback_pending"
  | "resolved_summary_available"
  | "resolved"
  | "cancelled";

/**
 * A persisted learning conversation with a real employee actor.
 *
 * This is deliberately separate from EncounterState: it has no patient,
 * satisfaction, room-capacity, settlement, service, or revenue semantics.
 */
export interface EmployeeDiscussionState {
  id: string;
  clinicalReleaseId: string;
  frozenCase: SyntheticClinicalCase;
  employeeId: string;
  employeeDisplayName: string;
  employeeAppearance: PixelAppearanceDescriptor;
  lifecycle: EmployeeDiscussionLifecycle;
  createdAtFacilityTick: number;
  firstOpenedAtTick: number | null;
  resolvedAtFacilityTick: number | null;
  cancellationReason: "employee_unavailable" | "content_invalid" | null;
  currentNodeIndex: number;
  answers: AnswerRecord[];
  steps: EncounterStepState[];
}

export interface EmployeeDiscussionListItem {
  discussionId: string;
  employeeId: string;
  employeeDisplayName: string;
  lifecycle: EmployeeDiscussionLifecycle;
  statusLabel: string;
  actionRequired: boolean;
  createdAtFacilityTick: number;
}

export interface EmployeeDiscussionLists {
  waiting: EmployeeDiscussionListItem[];
  active: EmployeeDiscussionListItem[];
  resolved: EmployeeDiscussionListItem[];
}

export interface CurrentEmployeeDiscussionQuestion {
  discussionId: string;
  employeeId: string;
  employeeDisplayName: string;
  caseDisplayName: string;
  presentation: string;
  node: DecisionNode;
  questionNumber: number;
  questionCount: number;
  syntheticDisclaimer: string;
}

export interface EmergencyGlp1Status {
  dayNumber: number;
  usesToday: number;
  payment: number;
  cooldownRemainingTicks: number;
  eligible: boolean;
  blockedReason: string | null;
}

export interface AlertHumorState {
  /** Additive namespace: absent in older campaigns until safely initialized. */
  guidanceTips?: import("./guidance-tip-types").GuidanceTipsState;
  /** Facility tick at which the player acknowledged the Alerts tutorial. */
  alertsTutorialAcknowledgedAtTick: number | null;
  /** Facility-time deadline; null keeps ambient messages locked. */
  nextAmbientAlertTick: number | null;
  /** One-time migration marker for the 120-minute ambient cadence. */
  ambientCadenceVersion: 1;
  /** Latest arrival used to pace daily quiet-clinic notices across reloads. */
  lastPatientArrivalTick: number | null;
  /** Continuous condition ages used by alert-only debounce policy. */
  conditionActiveSinceTicks: Record<string, number>;
  /** Last feed emission by global cadence group. */
  conditionLastEmittedTicks: Record<string, number>;
  /** Global separation marker shared by patient amenity/staff complaints. */
  lastComplaintAlertTick: number | null;
  /** Stable selection counter used by the deterministic flavor stream. */
  ambientSequence: number;
  /** Increments whenever the currently eligible definition pool is exhausted. */
  ambientCycle: number;
  /** Definition IDs already selected during the current cycle. */
  ambientUsedDefinitionIds: string[];
  /** Bounded persisted history used to avoid recent ambient repeats. */
  recentAmbientDefinitionIds: string[];
  /** Bounded persisted history used to avoid recent walkout-review repeats. */
  recentWalkoutReviewVariantIds: string[];
}

export interface OperationReceipt {
  operationId: string;
  commandType: GameCommand["type"];
  status: "applied" | "rejected";
  message: string;
  facilityTick: number;
}

export interface DomainEvent {
  id: string;
  type:
    | "patience_warning"
    | "left_before_seen"
    | "clinical_decision_recorded"
    | "result_ready"
    | "encounter_settled"
    | "room_placed"
    | "room_sold"
    | "room_upgraded"
    | "room_moved"
    | "room_rotated"
    | "door_placed"
    | "door_removed"
    | "staff_hired"
    | "staff_fired"
    | "staff_quit"
    | "staff_departure_risk"
    | "staff_salary_changed"
    | "facility_level_advanced"
    | "day_rollover"
    | "operating_expense"
    | "patient_arrived"
    | "ambient_message"
    | "success_message"
    | "development_money_added"
    | "emergency_glp1_consultation"
    | "litter_appeared"
    | "litter_collected"
    | "water_cooler_low"
    | "water_cooler_refilled"
    | "employee_praised"
    | "employee_discussion_decision";
  facilityTick: number;
  encounterId: string | null;
  message: string;
  /** Additive rollover snapshot; older events have only their original text. */
  clinicDaySummary?: {
    dayNumber: number;
    patientsSeen: number;
    moneyEarnedCents: number;
    satisfactionPercent: number;
    reviewLine?: string;
    partial?: boolean;
    completedTotal: number;
    earnedTotalCents: number;
  };
  priority?: "critical" | "action_required" | "informational" | "flavor";
  definitionId?: string;
  alertCategory?: PrototypeAlertCategory;
  alertVariantId?: string;
  walkoutReview?: {
    rating: 1 | 2;
    cause: PatientDissatisfactionCause;
  };
  target?: {
    kind: "campaign" | "encounter" | "room" | "employee";
    id: string;
  } | null;
  reward?: {
    cashDelta: number;
    learningXpDelta: number;
    satisfactionDelta: number;
  };
}

export interface GameState {
  schemaVersion: 8 | 9;
  /** Present only when an older campaign required the approved-room geometry migration. */
  approvedRoomGeometryMigration?: {
    version: "approved-room-geometry.v1";
    relocatedRecoveryRoomIds: string[];
    addedHallwayRoomIds: string[];
  };
  approvedRoomNavigationMigration?: {
    version: "approved-room-navigation.v1";
  };
  campaignId: string;
  campaignSeed: string;
  randomGeneratorVersion: "randomness.xoshiro128ss.v1";
  createdAtRealMs: number;
  founder: FounderIdentity;
  clinicalReleaseId: string;
  balanceReleaseId: string;
  schedulerPins: SchedulerPins;
  facilityLevel: 0 | 1 | 2 | 3;
  facilityTick: number;
  paused: boolean;
  simulationSpeed: SimulationSpeed;
  cash: number;
  /** Integer cents are authoritative; cash is a synchronized display value. */
  cashCents: number;
  /** Accrued operating cost in one-sixtieth-of-a-cent units. */
  operatingAccrualSixtiethCents: number;
  nextFinancialPostingTick: number;
  /** Persisted player-selected advertising tier (0 means disabled). */
  advertisingLevel: number;
  clinicalXp: number;
  /** Presentation state: the chart panel currently displayed, including read-only charts. */
  openChartEncounterId: string | null;
  /** Simulation state: only an unresolved Active patient receives reading-time protection. */
  attendedEncounterId: string | null;
  /** Additive non-patient chart state; absent in older version-8 saves. */
  employeeDiscussions?: Record<string, EmployeeDiscussionState>;
  employeeDiscussionSequence?: number;
  nextEmployeeDiscussionTick?: number;
  openEmployeeDiscussionId?: string | null;
  levelThreeQiReviews: LevelThreeQiReviewState[];
  levelThreeQiReviewSequence: number;
  /** Durable room-use event ledger; survives repair and sale/rebuild cycles. */
  levelThreeMaintenanceAppliedUseKeys: string[];
  rooms: PlacedRoom[];
  doors: DoorState[];
  employees: EmployeeState[];
  /** Monotonic paid FIFO order, initialized lazily for legacy campaigns. */
  employeeTrainingSequence?: number;
  departingEmployees?: DepartingEmployeeState[];
  encounters: Record<string, EncounterState>;
  learningHistories: Record<string, ConceptLearningHistory>;
  reviewIntents: SchedulerReviewIntent[];
  settlements: EncounterSettlement[];
  serviceIncomeReceipts: ServiceIncomeReceipt[];
  /** Independent counters survive normal retirement of income receipts. */
  radiologistReadIncome?: RadiologistReadIncomeState;
  /** Only current station work; legacy campaigns start with no outside jobs. */
  outsideRadiologyReads?: OutsideRadiologyRead[];
  nextServiceIncomeReceiptSequence: number;
  serviceAppointmentsEnabled: boolean;
  nextServiceAppointmentTicks: Record<string, number>;
  lastServiceAppointmentArrivalTick: number | null;
  serviceOperationSequence: number;
  serviceOperations: ServiceOperationState[];
  /** Optional for save compatibility; initialized lazily by patient amenity scheduling. */
  patientAmenityTrips?: PatientAmenityTripState[];
  patientAmenityNextOpportunityTicks?: Record<string, number>;
  patientAmenityTripSequence?: number;
  retailOperationSequence: number;
  retailOperations: RetailOperationState[];
  retailExternalActors: RetailExternalActorState[];
  retailOrders: RetailOrderState[];
  retailActorLedgers: Record<string, RetailActorLedgerState>;
  retailNextOpportunityTicks: Record<string, number>;
  nextExternalRetailOpportunityTick: number;
  externalRetailSequence: number;
  companionSequence: number;
  lastServiceAppointmentLineId: string | null;
  lastServiceAppointmentTicks: Record<string, number>;
  operationReceipts: Record<string, OperationReceipt>;
  events: DomainEvent[];
  criticalGuarantees: Record<string, "pending" | "in_progress" | "satisfied">;
  nextRoutineArrivalTick: number;
  routineArrivalSequence: number;
  totalOperatingExpenses: number;
  emergencyGlp1: EmergencyGlp1State;
  environment: FacilityEnvironmentState;
  alertHumor: AlertHumorState;
  /**
   * Compact history of resolved patients whose full records were removed from
   * `encounters` after they left the facility. Optional for save compatibility.
   */
  retiredEncounterSummary?: RetiredEncounterSummary;
  /**
   * Totals and milestones of income receipts and finished service operations
   * removed from live state. Optional for save compatibility.
   */
  retiredServiceHistory?: RetiredServiceHistory;
  /** Daily totals survive eviction of the bounded raw event history. */
  clinicDaySummaryBaseline?: { facilityTick: number; completedTotal: number; earnedTotalCents: number };
}

export interface RetiredServiceHistory {
  version: "retired-service-history.v1";
  retiredReceiptCount: number;
  grossCents: number;
  stockCostCents: number;
  netCashDeltaCents: number;
  /** A retired receipt satisfied the first-endoscopy receipt check. */
  endoscopyReceipt: boolean;
  /** A retired receipt satisfied the first-ambulatory-operation receipt check. */
  ambulatoryOperationReceipt: boolean;
  retiredOperationCount: number;
  /** A retired operation satisfied the first-endoscopy operation check. */
  endoscopyOperationCompleted: boolean;
  /** A retired operation satisfied the first-ambulatory-operation check. */
  ambulatoryOperationCompleted: boolean;
}

export interface RetiredEncounterSatisfactionSample {
  id: string;
  resolvedAtFacilityTick: number;
  finalPatientSatisfaction: number;
  resolutionReason: "completed" | "walkout";
}

/**
 * Everything campaign rules still need from retired encounters. Each full
 * encounter retains its frozen case (several kilobytes), and every facility
 * tick clones the whole state, so retained history made each minute slower.
 */
export interface RetiredEncounterSummary {
  version: "retired-encounter-summary.v1";
  retiredCount: number;
  completedCount: number;
  /** A non-tutorial encounter has been completed. */
  ordinaryEncounterCompleted: boolean;
  /** A delivered in-house endoscopy result existed on a retired encounter. */
  inHouseEndoscopyCompleted: boolean;
  /** Newest-last satisfaction samples for the rolling clinic window. */
  recentEndedSatisfaction: RetiredEncounterSatisfactionSample[];
  /** Latest retired use of each still, merged by arrival for appearance rotation. */
  recentStillUses: RetiredEncounterStillUse[];
}

export interface RetiredEncounterStillUse {
  stillId: string;
  encounterId: string;
  arrivedAtTick: number;
}

interface CommandBase {
  operationId: string;
}

export type GameCommand =
  | (CommandBase & {
      type: "SET_ADVERTISING_LEVEL";
      level: number;
    })
  | (CommandBase & {
      type: "OPEN_CHART";
      encounterId: string;
    })
  | (CommandBase & {
      type: "CLOSE_CHART";
      encounterId: string;
    })
  | (CommandBase & {
      type: "OPEN_EMPLOYEE_DISCUSSION";
      discussionId: string;
    })
  | (CommandBase & {
      type: "CLOSE_EMPLOYEE_DISCUSSION";
      discussionId: string;
    })
  | (CommandBase & {
      type: "SUBMIT_EMPLOYEE_DISCUSSION_ANSWER";
      discussionId: string;
      decisionNodeId: string;
      answerChoiceId: string;
      reviewedAtMs?: number;
    })
  | (CommandBase & {
      type: "ACKNOWLEDGE_EMPLOYEE_DISCUSSION_FEEDBACK";
      discussionId: string;
      decisionNodeId: string;
    })
  | (CommandBase & {
      type: "FILE_EMPLOYEE_DISCUSSION";
      discussionId: string;
    })
  | (CommandBase & {
      type: "SUBMIT_ANSWER";
      encounterId: string;
      decisionNodeId: string;
      answerChoiceId: string;
      reviewedAtMs?: number;
    })
  | (CommandBase & {
      type: "ACKNOWLEDGE_TERMINAL_FEEDBACK";
      encounterId: string;
    })
  | (CommandBase & {
      type: "ACKNOWLEDGE_DECISION_FEEDBACK";
      encounterId: string;
      decisionNodeId: string;
    })
  | (CommandBase & {
      type: "ACKNOWLEDGE_ALERTS_TUTORIAL";
    })
  | (CommandBase & {
      type: "RECORD_GUIDANCE_TOPIC_EXPOSURE";
      topicIds: string[];
    })
  | (CommandBase & {
      type: "SET_PAUSED";
      paused: boolean;
    })
  | (CommandBase & {
      type: "SET_SIMULATION_SPEED";
      speed: SimulationSpeed;
    })
  | (CommandBase & {
      type: "ADVANCE_TICK";
      /** Real-world time used only to determine whether saved FSRS cards are due. */
      advancedAtRealMs?: number;
    })
  | (CommandBase & {
      type: "PLACE_ROOM";
      roomId: string;
      roomDefinitionId: string;
      x: number;
      y: number;
      orientation?: RoomOrientation;
    })
  | (CommandBase & {
      type: "SELL_ROOM";
      roomId: string;
      /** Required when the current sale preview names employee dismissals. */
      saleConfirmationToken?: string;
    })
  | (CommandBase & {
      type: "UPGRADE_ROOM";
      roomId: string;
    })
  | (CommandBase & {
      type: "MOVE_ROOM";
      roomId: string;
      x: number;
      y: number;
    })
  | (CommandBase & {
      type: "ROTATE_ROOM";
      roomId: string;
    })
  | (CommandBase & {
      type: "PLACE_DOOR";
      doorId: string;
      roomId: string;
      side: CardinalDirection;
      offset: number;
      exterior?: boolean;
    })
  | (CommandBase & {
      type: "REMOVE_DOOR";
      doorId: string;
    })
  | (CommandBase & {
      type: "HIRE_STAFF";
      employeeId: string;
      staffRoleDefinitionId: string;
      displayName?: string;
    })
  | (CommandBase & {
      type: "SET_EMPLOYEE_SALARY";
      employeeId: string;
      salaryPerExpenseInterval: number;
    })
  | (CommandBase & {
      type: "TRAIN_EMPLOYEE";
      employeeId: string;
    })
  | (CommandBase & {
      type: "FIRE_EMPLOYEE";
      employeeId: string;
    })
  | (CommandBase & {
      type: "COLLECT_LITTER";
      litterId: string;
    })
  | (CommandBase & {
      type: "REFILL_WATER_COOLER";
    })
  | (CommandBase & {
      type: "PRAISE_EMPLOYEE";
      employeeId: string;
    })
  | (CommandBase & {
      type: "MOVE_FOUNDER";
      destination: GridPoint;
    })
  | (CommandBase & {
      type: "SEAT_FOUNDER_IN_CHAIR";
      roomInstanceId: string;
      location: GridPoint;
      /** Break Room seats share nearest tiles, so they are named explicitly. */
      seatId?: LevelThreeBreakSeatId;
    })
  | (CommandBase & { type: "SEAT_FOUNDER_AT_FRONT_DESK" })
  | (CommandBase & {
      type: "LEVEL_UP";
    })
  | (CommandBase & {
      type: "DEV_FAST_FORWARD";
      tickCount?: number;
    })
  | (CommandBase & {
      type: "DEV_ADD_MONEY";
    })
  | (CommandBase & {
      type: "RUN_EMERGENCY_GLP1_CONSULTATION";
    })
  | (CommandBase & {
      type: "SET_SERVICE_APPOINTMENTS_ENABLED";
      enabled: boolean;
    })
  | (CommandBase & {
      type: "START_SERVICE_OPERATION";
      incomeLineId: string;
      actorKind?: "visitor" | "remote";
    })
  | (CommandBase & {
      type: "START_RETAIL_PURCHASE";
      incomeLineId: string;
      actorKind: RetailActorKind;
      actorId: string;
      authorizedOrderId?: string;
    })
  | (CommandBase & {
      type: "AUTHORIZE_RETAIL_ORDER";
      orderId: string;
      incomeLineId: string;
      actorKind: RetailActorKind;
      actorId: string;
      allowance?: number;
    })
  | (CommandBase & {
      type: "ADMIT_PATIENT";
      encounterId: string;
      caseId: string;
      patientDisplayName: string;
      arrivalClass: ArrivalClass;
      protectedGuaranteeId?: string;
    });

export interface PatientListItem {
  encounterId: string;
  patientDisplayName: string;
  lifecycle: EncounterLifecycle;
  arrivalClass: ArrivalClass;
  statusLabel: string;
  actionRequired: boolean;
  pendingLabel: string | null;
  patientSatisfaction: number;
  waitingMinutes: number;
  /** @deprecated Kept for save/UI compatibility during the minute migration. */
  patienceRemainingTicks: number | null;
  patienceWarning: boolean;
}

export interface PatientLists {
  waiting: PatientListItem[];
  active: PatientListItem[];
  resolved: PatientListItem[];
}

export interface CurrentQuestion {
  encounterId: string;
  caseDisplayName: string;
  presentation: string;
  resultNarratives: string[];
  node: DecisionNode;
  questionNumber: number;
  questionCount: number;
  syntheticDisclaimer: string;
}

export interface WorkloadSnapshot {
  occupancy: number;
  routineLimit: number;
  criticalLimit: number;
  atRoutineCapacity: boolean;
  overRoutineCapacity: boolean;
}

export interface ProgressionRequirementStatus {
  id: string;
  label: string;
  met: boolean;
  current: number;
  required: number;
}

export interface FacilityProgressionStatus {
  facilityLevel: 0 | 1 | 2 | 3;
  displayName: string;
  requirements: ProgressionRequirementStatus[];
  eligible: boolean;
  nextFacilityLevel: 1 | 2 | 3 | null;
  maximumPlayableLevel: 3;
}
