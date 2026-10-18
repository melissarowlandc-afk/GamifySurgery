import type { GameState } from "@gamify-surgery/game-domain";
import type { LocalCampaignRecord, LocalPrototypeProfile } from "../prototypeStorage";
import { CloudCodecError, type CodecObject } from "./codecJson";

export type CloudFieldOwner = "operational" | "immutable-evidence" | "mutable-card-projection" |
  "campaign-metadata" | "device-only";

export interface CloudFieldRule {
  owner: CloudFieldOwner;
  role: "canonical" | "cached-projection" | "mixed";
  note: string;
}

const operational: CloudFieldRule = { owner: "operational", role: "canonical", note: "Preserve the complete persisted subtree, including clocks, counters, frozen work and RNG inputs." };
const metadata: CloudFieldRule = { owner: "campaign-metadata", role: "canonical", note: "Immutable identity/version pins; lifecycle metadata changes only through a future revision-checked transaction." };
const evidenceProjection: CloudFieldRule = { owner: "immutable-evidence", role: "cached-projection", note: "Opening value is witnessed by the immutable import baseline. Future changes require complete domain evidence; runtime views are not a ledger." };
const mixedOperational: CloudFieldRule = { owner: "operational", role: "mixed", note: "Operational subtree with evidence overrides listed in CLOUD_NESTED_FIELD_OWNERSHIP; preserve all remaining descendants." };

/** Exhaustive at compile time. A new domain field requires an explicit ownership decision. */
export const CLOUD_GAME_FIELD_OWNERSHIP = {
  schemaVersion: metadata,
  approvedRoomGeometryMigration: operational,
  approvedRoomNavigationMigration: operational,
  campaignId: metadata, campaignSeed: metadata, randomGeneratorVersion: metadata, createdAtRealMs: metadata,
  founder: mixedOperational, clinicalReleaseId: metadata, balanceReleaseId: metadata,
  salaryEconomyVersion: metadata, schedulerPins: metadata,
  facilityLevel: operational, pediatricFamilies: operational, levelFourCompletion: evidenceProjection,
  levelFive: mixedOperational, facilityTick: operational, paused: operational, simulationSpeed: operational,
  cash: evidenceProjection, cashCents: evidenceProjection, operatingAccrualSixtiethCents: operational,
  nextFinancialPostingTick: operational, advertisingLevel: operational, clinicalXp: evidenceProjection,
  openChartEncounterId: operational, attendedEncounterId: operational,
  employeeDiscussions: mixedOperational, employeeDiscussionSequence: operational,
  nextEmployeeDiscussionTick: operational, openEmployeeDiscussionId: operational,
  levelThreeQiReviews: mixedOperational, levelThreeQiReviewSequence: operational,
  levelThreeMaintenanceAppliedUseKeys: evidenceProjection,
  rooms: operational, doors: operational, employees: operational, employeeTrainingSequence: operational,
  departingEmployees: operational, encounters: mixedOperational,
  learningHistories: { owner: "mutable-card-projection", role: "mixed", note: "conceptId/card are campaign-scoped current projections; reviews are canonical immutable evidence, never a usage-count source." },
  reviewIntents: evidenceProjection, settlements: evidenceProjection, serviceIncomeReceipts: evidenceProjection,
  radiologistReadIncome: evidenceProjection, outsideRadiologyReads: operational,
  nextServiceIncomeReceiptSequence: operational, serviceAppointmentsEnabled: operational,
  nextServiceAppointmentTicks: operational, lastServiceAppointmentArrivalTick: operational,
  serviceOperationSequence: operational, serviceOperations: mixedOperational,
  patientAmenityTrips: operational, patientAmenityNextOpportunityTicks: operational,
  patientAmenityTripSequence: operational, retailOperationSequence: operational,
  retailOperations: mixedOperational, giftRetailDemand: operational, retailExternalActors: operational,
  retailOrders: operational, retailActorLedgers: operational, retailNextOpportunityTicks: operational,
  nextExternalRetailOpportunityTick: operational, externalRetailSequence: operational, companionSequence: operational,
  lastServiceAppointmentLineId: operational, lastServiceAppointmentTicks: operational,
  operationReceipts: evidenceProjection, events: evidenceProjection,
  criticalGuarantees: operational, nextRoutineArrivalTick: operational, routineArrivalSequence: operational,
  totalOperatingExpenses: evidenceProjection, emergencyGlp1: mixedOperational,
  environment: operational, alertHumor: operational,
  retiredEncounterSummary: evidenceProjection, retiredServiceHistory: evidenceProjection,
  clinicDaySummaryBaseline: evidenceProjection,
} as const satisfies Record<keyof GameState, CloudFieldRule>;

/** Wildcards inherit the parent rule except where this table assigns a more specific owner. */
export const CLOUD_NESTED_FIELD_OWNERSHIP = {
  "founder.{id,displayName,appearance}": metadata,
  "encounters.*.{id,frozenCase,patientDisplayName,patientAppearance,arrivalClass,arrivedAtTick}": evidenceProjection,
  "encounters.*.answers": evidenceProjection,
  "encounters.*.steps.*.{nodeIndex,decisionNodeId,questionVariantId,primaryConceptId,answer}": evidenceProjection,
  "employeeDiscussions.*.{id,clinicalReleaseId,frozenCase,employeeId,employeeDisplayName,employeeAppearance,createdAtFacilityTick,answers}": evidenceProjection,
  "employeeDiscussions.*.steps.*.{nodeIndex,decisionNodeId,questionVariantId,primaryConceptId,answer}": evidenceProjection,
  "learningHistories.*.{conceptId,card}": { owner: "mutable-card-projection", role: "canonical", note: "One card per owned campaign/concept. Store the supplied card and timezone-bearing review data; never replay reviews on load." },
  "learningHistories.*.reviews": evidenceProjection,
  "serviceOperations.*.{id,testChoiceOrder,frozenOperationPhases}": evidenceProjection,
  "retailOperations.*.{id,quoteGross,quoteStockCost,roomUpgradeRevenue,executiveStock}": evidenceProjection,
  "levelThreeQiReviews.*.{id,receiptId,completedAtFacilityTick}": evidenceProjection,
  "levelFive.inspection.{lastReport,latestCompletedReport,bestCompletedReport}": evidenceProjection,
  "levelFive.progress.{inspectionUnlocked,gameFinished}": evidenceProjection,
  "levelFive.inspection.{preparation,run,nextRunSequence}": operational,
  "levelFive.inspection.run.accumulators.presentedQuestions": evidenceProjection,
  "levelFive.inspectionPresentation": operational,
  "levelFive.management": operational,
  "emergencyGlp1.*": operational,
} as const satisfies Record<string, CloudFieldRule>;

export const CLOUD_CAMPAIGN_FIELD_OWNERSHIP = {
  campaignId: metadata, name: metadata, createdAtRealMs: metadata, updatedAtRealMs: metadata,
  status: metadata, state: mixedOperational,
} as const satisfies Record<keyof LocalCampaignRecord, CloudFieldRule>;

export const CLOUD_PROFILE_FIELD_OWNERSHIP = {
  schemaVersion: "device-only", activeCampaignId: "device-only", nextCampaignNumber: "device-only",
  tutorialsEnabled: "device-only", tutorialGuidanceByCampaign: "campaign-metadata",
  tutorialIntroDismissedCampaignIds: "campaign-metadata",
  tutorialDailyRoutineTipAcknowledgments: "campaign-metadata",
  tutorialDailyRoutinePauseByCampaign: "campaign-metadata", campaigns: "campaign-metadata",
  pendingUsageQuestions: "device-only",
} as const satisfies Record<keyof LocalPrototypeProfile, CloudFieldOwner>;

export const CLOUD_EVIDENCE_CONTRACT = Object.freeze({
  version: 1,
  baseline: "All available imported persisted fields, unchanged, form one immutable baseline; missing historical events remain unknown.",
  cards: "Current campaign/concept cards are mutable projections; append-only reviews have independent immutable ownership.",
  money: "Baseline cashCents is an opening balance. Complete exact future ledger deltas must reconcile cash, accrual/posting and expense projections.",
  frozenContent: "Preserve frozen case, question variant, choice order, scoring and presentation versions; do not resolve them from a newer release.",
  inspections: "Baseline reports are retained as available, not a complete attempt ledger. Future attempts must be captured before latest/best/first projections replace them.",
  historicalQuestionCountCredit: 0,
  liveDeltaExport: "applyGameEvidenceCommand captures opt-in immutable evidence before runtime retirement; existing persistence stays unchanged",
});

export function assertMappedGameFields(state: CodecObject): void {
  if (Object.keys(state).some(key => !Object.hasOwn(CLOUD_GAME_FIELD_OWNERSHIP, key))) {
    throw new CloudCodecError("unmapped_field", "The saved game contains a field without a cloud ownership contract.");
  }
}
