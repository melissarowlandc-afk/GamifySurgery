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

export interface DomainContext {
  clinicalRelease: SyntheticClinicalRelease;
  balanceRelease: PrototypeBalanceRelease;
}

export interface CreateCampaignOptions {
  campaignId?: string;
  campaignSeed?: string;
  createdAtRealMs?: number;
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
  durationTicks: number;
  dueTick: number;
  deliveredAtTick: number | null;
}

export interface TerminalFeedback {
  kind: "completion" | "correction" | "terminal_outcome";
  outcome: TerminalClinicalOutcome | null;
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
  arrivalClass: ArrivalClass;
  protectedGuaranteeId: string | null;
  lifecycle: EncounterLifecycle;
  resolutionReason: "completed" | "left_before_seen" | null;
  currentNodeIndex: number;
  firstOpenedAtTick: number | null;
  waiting: WaitingState;
  answers: AnswerRecord[];
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
}

export interface EmployeeState {
  id: string;
  staffRoleDefinitionId: string;
  displayName: string;
  hiredAtFacilityTick: number;
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
    | "result_ready"
    | "encounter_settled"
    | "room_placed"
    | "staff_hired"
    | "facility_level_advanced"
    | "operating_expense"
    | "patient_arrived"
    | "development_money_added";
  facilityTick: number;
  encounterId: string | null;
  message: string;
}

export interface GameState {
  schemaVersion: 2;
  campaignId: string;
  campaignSeed: string;
  createdAtRealMs: number;
  clinicalReleaseId: string;
  balanceReleaseId: string;
  schedulerPins: SchedulerPins;
  facilityLevel: 0 | 1;
  facilityTick: number;
  paused: boolean;
  cash: number;
  satisfaction: number;
  clinicalXp: number;
  /** Presentation state: the chart panel currently displayed, including read-only charts. */
  openChartEncounterId: string | null;
  /** Simulation state: only an unresolved Active patient receives reading-time protection. */
  attendedEncounterId: string | null;
  rooms: PlacedRoom[];
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
      type: "SET_PAUSED";
      paused: boolean;
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
    })
  | (CommandBase & {
      type: "HIRE_STAFF";
      employeeId: string;
      staffRoleDefinitionId: string;
      displayName: string;
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
