import type { GridPoint, RoomUpgradeLevel } from "./types";

/** Optional, versioned Level 5 saved contracts. */
export interface ExecutiveEffectQuote {
  version: "executive-effect-quote.v1";
  staffMoralePoints: number;
  visitorSatisfactionPoints: number;
  inspectionPreparationReductionPercent: number;
  supplierReductionPercent: number;
}

export interface DailyManagementRoundState {
  version: "daily-management-round.v1";
  id: string;
  dayNumber: number;
  employeeId: string;
  officeRoomInstanceId: string;
  status: "walking_to_office" | "working" | "paused" | "completed" | "expired" | "cancelled";
  acceptedAtFacilityTick: number;
  employeeTrainingLevel: RoomUpgradeLevel;
  officeUpgradeLevel: RoomUpgradeLevel;
  rawDurationMinutes: number;
  durationMinutes: number;
  remainingWorkMinutes: number;
  lastProgressAtFacilityTick: number;
  completedAtFacilityTick: number | null;
  effectsAppliedAtFacilityTick: number | null;
  /** The named desk contact belongs to this round, never clinical care. */
  reservedContactId: string | null;
  effects: ExecutiveEffectQuote;
}

export interface DailyManagementTerms {
  version: "daily-management-terms.v1";
  roundId: string;
  dayNumber: number;
  employeeId: string;
  officeRoomInstanceId: string;
  employeeTrainingLevel: RoomUpgradeLevel;
  completedAtFacilityTick: number;
  expiresAtFacilityTick: number;
  effects: ExecutiveEffectQuote;
}

export interface DailyManagementState {
  version: "daily-management.v1";
  round: DailyManagementRoundState | null;
  lastCompletedDayNumber: number | null;
  activeTerms: DailyManagementTerms | null;
  /** Actual expense reductions; these counters never mint income or expense postings. */
  supplierSavings: { stockCents: number; upkeepSixtiethCents: number };
  /** Lazy shadow of undiscounted accrual; savings count only real expense postings. */
  upkeepAccounting?: { baselineAccrualSixtiethCents: number; fractionalReduction: number };
}

export interface ExecutiveComfortQuote {
  version: "executive-comfort.v1";
  roundId: string | null;
  employeeId: string | null;
  employeeTrainingLevel: RoomUpgradeLevel | null;
  acceptedAtFacilityTick: number;
  points: number;
  appliedAtFacilityTick: number | null;
}

export interface ExecutiveStockQuote {
  version: "executive-stock.v1";
  roundId: string;
  employeeTrainingLevel: RoomUpgradeLevel;
  acceptedAtFacilityTick: number;
  reductionPercent: number;
  baselineCostCents: number;
  costCents: number;
}

export interface LevelFiveInspectionUnlock {
  version: "level-five-inspection-unlock.v1";
  earnedAtFacilityTick: number;
  /** Frozen simultaneous goal evidence; later conditions cannot rewrite it. */
  clinicalXp: number;
  displayedSatisfaction: number;
  averageStaffMorale: number;
  employedStaffCount: number;
}

export type FacilityInspectionStatus =
  | "locked" | "ready" | "preparing" | "running" | "completed" | "incomplete" | "cancelled";

export interface InspectionPreparationState {
  version: "inspection-preparation.v1";
  runId: string;
  bookedAtFacilityTick: number;
  rawDurationMinutes: number;
  durationMinutes: number;
  endsAtFacilityTick: number;
  /** Optional frozen paperwork reduction; an Executive is never required. */
  executiveQuote: {
    roundId: string;
    employeeId: string;
    employeeTrainingLevel: RoomUpgradeLevel;
    reductionPercent: number;
  } | null;
}

export type InspectionCategoryId =
  | "cleanliness" | "rooms_built" | "room_upgrades" | "staffing_coverage"
  | "employee_training" | "staff_morale" | "patient_satisfaction" | "wait_flow"
  | "finances" | "clinical_answer_accuracy";

export interface InspectionPresentedQuestion {
  id: string;
  kind: "encounter" | "employee_discussion";
  subjectId: string;
  decisionNodeId: string;
  /** Run-local capture tick; already open unanswered nodes are seeded at run start. */
  presentedAtFacilityTick: number;
  firstAnswer: { id: string; answeredAtFacilityTick: number; correct: boolean } | null;
}

/** Bounded run-local evidence, captured before retirement. No campaign replay on load. */
export interface InspectionAccumulatorState {
  version: "inspection-accumulators.v1";
  observedActiveMinutes: number;
  observedRoomMinutes: number;
  cleanRoomMinutes: number;
  cleanlinessSum: number;
  minimumCleanliness: number | null;
  usableRoomTypeFractionSum: number;
  roomUpgradeFractionSum: number;
  staffingCoverageFractionSum: number;
  employeeTrainingFractionSum: number;
  staffMoraleMeanSum: number;
  patientSatisfactionSum: number;
  patientSatisfactionCount: number;
  queueMinutes: number;
  overdueQueueMinutes: number;
  completedPatientCount: number;
  walkoutPatientCount: number;
  operatingGrossCents: number;
  stockCostCents: number;
  chargedOperatingExpenseCents: number;
  paidOperatingExpenseCents: number;
  expensePostingCount: number;
  paidExpensePostingCount: number;
  qualifyingCompletedEncounterIds: string[];
  settledEncounterIds: string[];
  observedReceiptIds: string[];
  observedExpensePostingIds: string[];
  presentedQuestions: InspectionPresentedQuestion[];
  /** M7a evidence is optional on M1 snapshots; omission is preserved on load. */
  structuralEvidence?: InspectionStructuralEvidence;
}

export interface InspectionStructuralEvidence {
  version: "inspection-structure.v1";
  usableRoomTypeMinutes: Array<{ roomDefinitionId: string; minutes: number }>;
  missingUpgradeTypeMinutes: Array<{ roomDefinitionId: string; minutes: number }>;
  roomAccessProblems: Array<{ roomInstanceId: string; roomDefinitionId: string; reason: string; observedMinutes: number }>;
  roomUpgradeDeficits: Array<{ roomInstanceId: string; roomDefinitionId: string; minimumLevel: RoomUpgradeLevel; maximumLevel: RoomUpgradeLevel }>;
  /** Group identical minute observations, retaining actual home/employee IDs. */
  staffPositionSamples: Array<{ id: string; positionId: string; roomDefinitionId: string; staffRoleDefinitionId: string;
    roomInstanceId: string | null; employeeId: string | null; trainingLevel: RoomUpgradeLevel | null; observedMinutes: number }>;
  unmatchedEmployeeSamples: Array<{ employeeId: string; trainingLevel: RoomUpgradeLevel; observedMinutes: number }>;
}

export interface InspectionRunState {
  version: "facility-inspection-run.v1";
  id: string;
  ruleVersion: "inspection-rules.v1";
  balanceReleaseId: string;
  clinicalReleaseId: string;
  startedAtFacilityTick: number;
  durationMinutes: number;
  endsAtFacilityTick: number;
  lastObservedAtFacilityTick: number | null;
  /** Frozen catalog IDs, never UI totals or only the rooms actually present. */
  requiredRoomDefinitionIds: string[];
  upgradeableRooms: Array<{ roomDefinitionId: string; maximumLevel: RoomUpgradeLevel }>;
  baselineStaffPositions: Array<{ id: string; roomDefinitionId: string; staffRoleDefinitionId: string }>;
  /** Existing operational thresholds frozen at the actual run start. */
  operationalThresholds?: { cleanRoomThreshold: number; idleGraceMinutes: number; checkInGraceMinutes: number };
  accumulators: InspectionAccumulatorState;
}

export interface InspectionCategoryResult {
  id: InspectionCategoryId;
  weightPercent: number;
  score: number | null;
  weightedPoints: number | null;
  /** Independently authored arithmetic/hints; no clinical source prose. */
  formula: string;
  rawValues: Record<string, number>;
  missingItems: Array<{ id: string; reason: string }>;
  improvementHint: string;
}

export interface InspectionReportState {
  version: "facility-inspection-report.v1";
  runId: string;
  ruleVersion: "inspection-rules.v1";
  balanceReleaseId: string;
  clinicalReleaseId: string;
  startedAtFacilityTick: number;
  endedAtFacilityTick: number;
  outcome: "completed" | "incomplete" | "cancelled";
  observedActiveMinutes: number;
  requiredActiveMinutes: number;
  qualifyingScoredPatientCount: number;
  minimumQualifyingScoredPatients: number;
  categories: InspectionCategoryResult[];
  rawTotalScore: number | null;
  recognition: "improving" | "prestige" | "distinguished" | "perfect" | null;
}

export interface FacilityInspectionState {
  version: "facility-inspection.v1";
  /** Lazy sequence is absent from pre-booking/legacy saves. */
  nextRunSequence?: number;
  status: FacilityInspectionStatus;
  preparation: InspectionPreparationState | null;
  run: InspectionRunState | null;
  lastReport: InspectionReportState | null;
  latestCompletedReport: InspectionReportState | null;
  bestCompletedReport: InspectionReportState | null;
}

export type InspectorStillId = `inspector-v6f.${"001" | "002" | "003" | "004" | "005" | "006" | "007" | "008" | "009" | "010"}`;

/** Dedicated presentation lane. These actors are never employees, patients or customers. */
export interface InspectionPresentationActor {
  id: string;
  stillId: InspectorStillId;
  phase: "walking" | "observing" | "stationary";
  location: GridPoint;
  path: GridPoint[];
  pathIndex: number;
  lastMovedAtFacilityTick: number;
  targetRoomInstanceId: string | null;
  observingUntilFacilityTick: number | null;
}

export interface InspectionPresentationState {
  version: "inspection-presentation.v1";
  runId: string | null;
  /** Separate presentation seed, never a clinical/retail stream. */
  seed: string | null;
  actors: InspectionPresentationActor[];
}

export interface LevelFiveGameFinished {
  version: "level-five-game-finished.v1";
  firstCompletedInspectionRunId: string;
  finishedAtFacilityTick: number;
  completionNoticeId: string;
  /** Retain the first report when later attempts replace latest/best. */
  firstCompletedReport: InspectionReportState;
}

export interface LevelFiveProgressState {
  version: "level-five-progress.v1";
  inspectionUnlocked: LevelFiveInspectionUnlock | null;
  gameFinished: LevelFiveGameFinished | null;
  /** Dismissal is separate from both goal completion and first-report completion. */
  finishPageAcknowledgedAtFacilityTick: number | null;
}

export interface LevelFiveState {
  version: "level-five-state.v1";
  management: DailyManagementState;
  progress: LevelFiveProgressState;
  inspection: FacilityInspectionState;
  inspectionPresentation: InspectionPresentationState;
}
