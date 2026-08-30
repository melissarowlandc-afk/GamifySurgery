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
  /** Frozen editorial service phases; they never read later balance values. */
  timingPhases?: Array<{ id: string; durationTicks: number; resourceBound: boolean; startsAtTick: number; endsAtTick: number }>;
  resourceReservations?: Array<{ roomDefinitionId: string; staffRoleDefinitionId: string | null }>;
  /** Frozen selected clinician capacity for a resource-bound service. */
  providerReservation?:
    | {
        kind: "employee";
        employeeId: string;
        staffRoleDefinitionId: string;
      }
    | { kind: "founder" }
    | null;
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
  finalPatientSatisfaction: number | null;
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
  nextIdleActionAtFacilityTick: number;
  currentNodeIndex: number;
  firstOpenedAtTick: number | null;
  waiting: WaitingState;
  answers: AnswerRecord[];
  steps: EncounterStepState[];
  pendingResult: PendingResult | null;
  deliveredResultNarratives: string[];
  terminalFeedback: TerminalFeedback | null;
  settlementId: string | null;
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
}

export interface DoorState {
  id: string;
  roomId: string;
  side: CardinalDirection;
  /** Zero-based position along the selected wall. */
  offset: number;
  exterior: boolean;
}

export interface EmployeeFacilityTaskState {
  kind: "refill_water" | "collect_litter" | "clean_room";
  startedAtFacilityTick: number;
  workMinutesRemaining: number;
  targetId?: string;
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
  homeRoomInstanceId: string | null;
  location: GridPoint;
  path: GridPoint[];
  pathIndex: number;
  lastMovedAtFacilityTick: number;
  lastPraisedAtFacilityTick: number | null;
  nextIdleActionAtFacilityTick: number;
  /** Persisted operational work that temporarily supersedes room idling. */
  facilityTask?: EmployeeFacilityTaskState | null;
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
    | "praise_employee";
  targetId: string;
  path: GridPoint[];
  pathIndex: number;
  lastMovedAtFacilityTick: number;
  workMinutesRemaining: number;
}

export interface FacilityEnvironmentState {
  founderLocation: GridPoint;
  founderActivity: FounderActivityState | null;
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

export interface EmergencyGlp1Status {
  dayNumber: number;
  usesToday: number;
  payment: number;
  cooldownRemainingTicks: number;
  eligible: boolean;
  blockedReason: string | null;
}

export interface AlertHumorState {
  /** Facility tick at which the player acknowledged the Alerts tutorial. */
  alertsTutorialAcknowledgedAtTick: number | null;
  /** Facility-time deadline; null keeps ambient messages locked. */
  nextAmbientAlertTick: number | null;
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
    | "employee_praised";
  facilityTick: number;
  encounterId: string | null;
  message: string;
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
  schemaVersion: 6;
  campaignId: string;
  campaignSeed: string;
  randomGeneratorVersion: "randomness.xoshiro128ss.v1";
  createdAtRealMs: number;
  founder: FounderIdentity;
  clinicalReleaseId: string;
  balanceReleaseId: string;
  schedulerPins: SchedulerPins;
  facilityLevel: 0 | 1 | 2;
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
  rooms: PlacedRoom[];
  doors: DoorState[];
  employees: EmployeeState[];
  encounters: Record<string, EncounterState>;
  learningHistories: Record<string, ConceptLearningHistory>;
  reviewIntents: SchedulerReviewIntent[];
  settlements: EncounterSettlement[];
  operationReceipts: Record<string, OperationReceipt>;
  events: DomainEvent[];
  criticalGuarantees: Record<string, "pending" | "in_progress" | "satisfied">;
  nextRoutineArrivalTick: number;
  routineArrivalSequence: number;
  totalOperatingExpenses: number;
  emergencyGlp1: EmergencyGlp1State;
  environment: FacilityEnvironmentState;
  alertHumor: AlertHumorState;
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
  facilityLevel: 0 | 1 | 2;
  displayName: string;
  requirements: ProgressionRequirementStatus[];
  eligible: boolean;
  nextFacilityLevel: 1 | 2 | null;
  maximumPlayableLevel: 2;
}
