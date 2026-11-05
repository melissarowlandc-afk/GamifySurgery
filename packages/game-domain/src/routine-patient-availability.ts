import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { clinicalCaseEarliestFacilityStage, clinicalCaseHasSupportedPatientSemantics, getClinicalCaseEligibilityIssue } from "./clinical-case-eligibility";
import { getEmployeeDiscussions, isEmployeeDiscussionCase } from "./employee-discussions";
import { canAdmitPatient, getCurrentCapabilities } from "./selectors";
import type { DomainContext, GameState } from "./types";

export type RoutinePatientAvailabilityReason =
  | "paused"
  | "at_capacity"
  | "arrival_scheduled"
  | "available"
  | "in_progress"
  | "reviews_scheduled"
  | "capabilities_unavailable"
  | "content_unavailable";

export interface RoutinePatientAvailability {
  reason: RoutinePatientAvailabilityReason;
  /** Earliest complete, currently gate-compatible case review time, not an arrival time. */
  nextReviewAtRealMs: number | null;
  activeEncounterCount: number;
  pendingEncounterCount: number;
  activeDiscussionCount: number;
}

function conceptIds(clinicalCase: SyntheticClinicalCase): string[] {
  return [...new Set(clinicalCase.decisionNodes.map((node) => node.primaryConceptId))];
}

/** Every learned concept in a case must be due before that complete case can be offered. */
function caseReviewReadyAt(
  state: GameState,
  caseConceptIds: readonly string[],
  asOfRealMs: number,
): number {
  return caseConceptIds.reduce((readyAt, conceptId) => {
    const history = state.learningHistories[conceptId];
    return history && history.reviews.length > 0
      ? Math.max(readyAt, history.card.dueAtMs)
      : readyAt;
  }, asOfRealMs);
}

/**
 * Read-only explanation of the routine admission rules. This does not select a
 * patient, advance a clock, or change FSRS. It mirrors the admission filters and
 * complete-case eligibility in clinical-selection without sorting or drawing a
 * random choice for a UI projection.
 */
export function getRoutinePatientAvailability(
  state: GameState,
  asOfRealMs: number,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): RoutinePatientAvailability {
  if (!Number.isSafeInteger(asOfRealMs) || asOfRealMs < 0) {
    throw new Error("Routine patient availability needs a valid timestamp.");
  }

  const activeEncounters = Object.values(state.encounters).filter(
    (encounter) => encounter.resolutionReason === null,
  );
  const activeDiscussions = Object.values(getEmployeeDiscussions(state)).filter(
    (discussion) => discussion.lifecycle !== "resolved" && discussion.lifecycle !== "cancelled",
  );
  const summary: RoutinePatientAvailability = {
    reason: "content_unavailable",
    nextReviewAtRealMs: null,
    activeEncounterCount: activeEncounters.length,
    pendingEncounterCount: activeEncounters.filter(
      (encounter) => encounter.lifecycle === "active_pending_result",
    ).length,
    activeDiscussionCount: activeDiscussions.length,
  };
  if (state.paused) return { ...summary, reason: "paused" };
  if (!canAdmitPatient(state, "routine", context)) {
    return { ...summary, reason: "at_capacity" };
  }

  const capabilities = getCurrentCapabilities(state, context);
  const activeConceptIds = new Set([
    ...activeEncounters.flatMap((encounter) => conceptIds(encounter.frozenCase)),
    ...activeDiscussions.flatMap((discussion) => conceptIds(discussion.frozenCase)),
  ]);
  let unblockedCaseCount = 0;
  let stageCaseCount = 0, gateCompatibleCaseCount = 0;
  let otherwiseReadyCaseIsInProgress = false;
  let nextReviewAtRealMs: number | null = null;
  // Preserve source order and all eligibility rules. Availability can return
  // at the first due, unblocked case; it need not build two whole-release arrays
  // or inspect future-stage pediatric variants before reaching that case.
  for (const clinicalCase of context.clinicalRelease.cases) {
    if (isEmployeeDiscussionCase(clinicalCase) || !clinicalCase.routineEligible ||
      clinicalCaseEarliestFacilityStage(clinicalCase) > state.facilityLevel ||
      !clinicalCaseHasSupportedPatientSemantics(clinicalCase)) continue;
    stageCaseCount++;
    if (getClinicalCaseEligibilityIssue(state, clinicalCase, context, capabilities) !== null) continue;
    gateCompatibleCaseCount++;
    const caseConceptIds = conceptIds(clinicalCase);
    if (caseConceptIds.length === 0) continue;
    const readyAt = caseReviewReadyAt(state, caseConceptIds, asOfRealMs);
    if (caseConceptIds.some((conceptId) => activeConceptIds.has(conceptId))) {
      otherwiseReadyCaseIsInProgress ||= readyAt <= asOfRealMs;
      continue;
    }
    unblockedCaseCount += 1;
    if (readyAt <= asOfRealMs) {
      return {
        ...summary,
        reason: state.facilityTick < state.nextRoutineArrivalTick ? "arrival_scheduled" : "available",
      };
    }
    nextReviewAtRealMs = nextReviewAtRealMs === null
      ? readyAt
      : Math.min(nextReviewAtRealMs, readyAt);
  }

  if (!stageCaseCount) return summary;
  if (!gateCompatibleCaseCount) return { ...summary, reason: "capabilities_unavailable" };
  if (otherwiseReadyCaseIsInProgress || (unblockedCaseCount === 0 && activeConceptIds.size > 0)) {
    return { ...summary, reason: "in_progress" };
  }
  return nextReviewAtRealMs === null
    ? summary
    : { ...summary, reason: "reviews_scheduled", nextReviewAtRealMs };
}
