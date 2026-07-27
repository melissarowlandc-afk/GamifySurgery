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

export interface GridPoint {
  x: number;
  y: number;
}

export interface PixelAppearanceDescriptor {
  version: "pixel-avatar.v1";
  bodyShape: "compact" | "average" | "broad" | "tall";
  hairStyle: "none" | "short" | "parted" | "curly" | "bun";
  hairShade: 0 | 1 | 2 | 3;
  faceStyle: "round" | "square" | "long";
  outfitStyle: "plain" | "striped" | "checked" | "coat";
  outfitShade: 0 | 1 | 2 | 3;
  accessory: "none" | "glasses" | "badge" | "headband";
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
  /** The frozen service time before any facility travel is added. */
  serviceDurationTicks: number;
  durationTicks: number;
  dueTick: number;
  deliveredAtTick: number | null;
  /**
   * Set when an off-site patient reaches the clinic entrance and begins the
   * persisted in-building return route. Null before that transition.
   */
  offsiteReturnStartedAtTick: number | null;
  /**
   * Exact facility route and timing selected when the service was scheduled.
   * Null means the route is off-site or otherwise has no simulated facility
   * travel.
   */
  patientTravel: FrozenPatientTravel | null;
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

export type PatientMovementKind =
  | "arriving_for_check_in"
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
  patientDisplayName: string;
  patientAppearance: PixelAppearanceDescriptor;
  /** Live patient experience score used for waiting pressure and walkouts. */
  patientSatisfaction: number;
  idleWaitingSinceTick: number | null;
  lastSatisfactionDecayAtTick: number;
  walkoutThreshold: number;
  satisfactionWarningsShown: number[];
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
}

export interface LitterState {
  id: string;
  roomId: string;
  location: GridPoint;
  spawnedAtFacilityTick: number;
}

export interface FounderActivityState {
  kind: "collect_litter" | "refill_water" | "praise_employee";
  targetId: string;
  path: GridPoint[];
  pathIndex: number;
  lastMovedAtFacilityTick: number;
  workMinutesRemaining: number;
}

export interface FacilityEnvironmentState {
  founderLocation: GridPoint;
  founderActivity: FounderActivityState | null;
  litterItems: LitterState[];
  litterSequence: number;
  nextLitterSpawnTick: number;
  waterCoolerFillPercent: number;
  nextWaterCoolerDrainTick: number;
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
  dailyUseCap: number;
  payment: number;
  cooldownRemainingTicks: number;
  cashEligible: boolean;
  eligible: boolean;
  blockedReason: string | null;
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
    | "staff_salary_changed"
    | "facility_level_advanced"
    | "day_rollover"
    | "operating_expense"
    | "patient_arrived"
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
  schemaVersion: 5;
  campaignId: string;
  campaignSeed: string;
  randomGeneratorVersion: "randomness.xoshiro128ss.v1";
  createdAtRealMs: number;
  founder: FounderIdentity;
  clinicalReleaseId: string;
  balanceReleaseId: string;
  schedulerPins: SchedulerPins;
  facilityLevel: 0 | 1;
  facilityTick: number;
  paused: boolean;
  simulationSpeed: SimulationSpeed;
  cash: number;
  /** Integer cents are authoritative; cash is a synchronized display value. */
  cashCents: number;
  /** Accrued operating cost in one-sixtieth-of-a-cent units. */
  operatingAccrualSixtiethCents: number;
  nextFinancialPostingTick: number;
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
}

interface CommandBase {
  operationId: string;
}

export type GameCommand =
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
      type: "SET_PAUSED";
      paused: boolean;
    })
  | (CommandBase & {
      type: "SET_SIMULATION_SPEED";
      speed: SimulationSpeed;
    })
  | (CommandBase & {
      type: "ADVANCE_TICK";
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
  facilityLevel: 0 | 1;
  displayName: string;
  requirements: ProgressionRequirementStatus[];
  eligible: boolean;
  nextFacilityLevel: 1 | null;
  maximumPlayableLevel: 1;
}
