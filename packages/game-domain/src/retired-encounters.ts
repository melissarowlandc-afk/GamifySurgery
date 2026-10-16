import { getServiceIncomeLine } from "@gamify-surgery/balance-config";

import { patientStillIdForAppearance } from "./appearance";
import { getDiagnosticOrderPlans, hasOutstandingDiagnosticWork } from "./diagnostic-timing";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
} from "./context";
import type {
  DomainContext,
  EncounterState,
  GameState,
  RetiredEncounterSatisfactionSample,
  RetiredEncounterStillUse,
  RetiredEncounterSummary,
} from "./types";

/**
 * The newest finished patients stay complete so recent filed charts and the
 * "Open chart" links on recent messages keep working. Older finished patients
 * become counters and short histories in `retiredEncounterSummary`.
 */
export const RETAINED_RETIRED_ENCOUNTER_LIMIT = 10;
const MINIMUM_RETAINED_SATISFACTION_SAMPLES = 32;
const RETAINED_STILL_HISTORY_LIMIT = 512;

export function isInHouseEndoscopyResult(
  result: NonNullable<EncounterState["pendingResult"]>,
): boolean {
  const lineIds = result.serviceIncomeLineId
    ? [result.serviceIncomeLineId]
    : ["income.endoscopy", "income.advanced_endoscopy"];
  return lineIds.some((lineId) =>
    (lineId === "income.endoscopy" || lineId === "income.advanced_endoscopy") &&
    Boolean(getServiceIncomeLine(lineId)?.eligibleRouteIds.includes(result.routeId)),
  );
}

export function encounterHasDeliveredInHouseEndoscopy(
  encounter: EncounterState,
): boolean {
  return encounter.steps.some((step) => {
    const result = step.result;
    return Boolean(
      step.status === "completed" &&
        result &&
        result.deliveredAtTick !== null &&
        isInHouseEndoscopyResult(result),
    );
  });
}

export function getRetiredCompletedEncounterCount(
  state: Pick<GameState, "retiredEncounterSummary">,
): number {
  return state.retiredEncounterSummary?.completedCount ?? 0;
}

export function getRetiredEndedSatisfactionSamples(
  state: Pick<GameState, "retiredEncounterSummary">,
): readonly RetiredEncounterSatisfactionSample[] {
  return state.retiredEncounterSummary?.recentEndedSatisfaction ?? [];
}

function createRetiredEncounterSummary(): RetiredEncounterSummary {
  return {
    version: "retired-encounter-summary.v1",
    retiredCount: 0,
    completedCount: 0,
    ordinaryEncounterCompleted: false,
    inHouseEndoscopyCompleted: false,
    recentEndedSatisfaction: [],
    recentStillUses: [],
  };
}

/** Every encounter id that a live record could still look up. */
function referencedEncounterIds(state: GameState): Set<string> {
  const ids = new Set<string>();
  const add = (id: string | null | undefined) => {
    if (id) ids.add(id);
  };
  add(state.openChartEncounterId);
  add(state.attendedEncounterId);
  for (const plan of getDiagnosticOrderPlans(state)) {
    if (hasOutstandingDiagnosticWork(plan)) add(plan.encounterId);
  }
  const environment = state.environment;
  add(environment.founderActivity?.targetId);
  add(environment.suspendedFounderActivity?.targetId);
  add(environment.pendingFounderConsult?.targetId);
  for (const employee of state.employees) add(employee.facilityTask?.targetId);
  for (const operation of state.serviceOperations) {
    if (operation.status !== "completed" && operation.status !== "cancelled") {
      add(operation.actorId);
    }
  }
  for (const operation of state.retailOperations) {
    if (
      operation.status !== "completed" &&
      operation.status !== "abandoned" &&
      operation.status !== "cancelled"
    ) {
      add(operation.actorId);
    }
  }
  for (const trip of state.patientAmenityTrips ?? []) add(trip.actorId);
  for (const actor of state.retailExternalActors) {
    if (actor.lifecycle !== "departed") add(actor.linkedEncounterId);
  }
  return ids;
}

function isRetirable(
  encounter: EncounterState,
  referenced: ReadonlySet<string>,
): boolean {
  return (
    encounter.lifecycle === "resolved" &&
    encounter.arrivalClass !== "tutorial" &&
    encounter.id !== TUTORIAL_ENCOUNTER_ID &&
    encounter.id !== SECOND_TUTORIAL_ENCOUNTER_ID &&
    encounter.patientLocation === null &&
    encounter.patientMovement === null &&
    // A delivered result is history once the patient has resolved; only an
    // undelivered result can still move, credit or reserve anything.
    (encounter.pendingResult === null ||
      encounter.pendingResult.deliveredAtTick !== null) &&
    !encounter.testOnlyContinuation?.saleInterruptedOffsite &&
    !referenced.has(encounter.id)
  );
}

export function compareStillUseArrival(
  left: Pick<RetiredEncounterStillUse, "arrivedAtTick" | "encounterId">,
  right: Pick<RetiredEncounterStillUse, "arrivedAtTick" | "encounterId">,
): number {
  return (
    left.arrivedAtTick - right.arrivedAtTick ||
    left.encounterId.localeCompare(right.encounterId)
  );
}

const newestResolutionFirst = (left: EncounterState, right: EncounterState) =>
  (right.resolvedAtFacilityTick ?? 0) - (left.resolvedAtFacilityTick ?? 0) ||
  right.id.localeCompare(left.id);

/**
 * Removes finished patients who have left the facility, keeping the newest
 * few complete, and folds the removed ones into the compact summary. Every
 * rule that read removed encounters also reads the summary, so goals,
 * satisfaction, milestones and appearance rotation keep their results.
 */
export function retireDepartedEncounters(
  state: GameState,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): void {
  const referenced = referencedEncounterIds(state);
  const retirable = Object.values(state.encounters).filter((encounter) =>
    isRetirable(encounter, referenced),
  );
  if (retirable.length <= RETAINED_RETIRED_ENCOUNTER_LIMIT) return;

  const removed = retirable
    .sort(newestResolutionFirst)
    .slice(RETAINED_RETIRED_ENCOUNTER_LIMIT);
  const summary =
    state.retiredEncounterSummary ?? createRetiredEncounterSummary();

  for (const encounter of removed) {
    summary.retiredCount += 1;
    if (encounter.resolutionReason === "completed") {
      summary.completedCount += 1;
      // Tutorial encounters are never retired; see `isRetirable`.
      summary.ordinaryEncounterCompleted = true;
    }
    if (
      !summary.inHouseEndoscopyCompleted &&
      encounterHasDeliveredInHouseEndoscopy(encounter)
    ) {
      summary.inHouseEndoscopyCompleted = true;
    }
    if (
      encounter.finalPatientSatisfaction !== null &&
      encounter.resolvedAtFacilityTick !== null &&
      (encounter.resolutionReason === "completed" ||
        encounter.resolutionReason === "walkout")
    ) {
      summary.recentEndedSatisfaction.push({
        id: encounter.id,
        resolvedAtFacilityTick: encounter.resolvedAtFacilityTick,
        finalPatientSatisfaction: encounter.finalPatientSatisfaction,
        resolutionReason: encounter.resolutionReason,
      });
    }
  }
  const satisfactionLimit = Math.max(
    MINIMUM_RETAINED_SATISFACTION_SAMPLES,
    context.balanceRelease.patientSatisfaction.rollingWindowSize,
  );
  summary.recentEndedSatisfaction = summary.recentEndedSatisfaction
    .sort(
      (left, right) =>
        left.resolvedAtFacilityTick - right.resolvedAtFacilityTick ||
        left.id.localeCompare(right.id),
    )
    .slice(-satisfactionLimit);

  // Appearance rotation orders every encounter still by arrival and uses
  // only each still's latest position, so the latest retired use per still
  // is enough to reproduce it. That bounds this history by the still catalog.
  const stillUses = new Map(
    summary.recentStillUses.map((use) => [use.stillId, use] as const),
  );
  for (const encounter of removed) {
    const stillId = patientStillIdForAppearance(encounter.patientAppearance);
    if (!stillId) continue;
    const use: RetiredEncounterStillUse = {
      stillId,
      encounterId: encounter.id,
      arrivedAtTick: encounter.waiting.arrivedAtTick,
    };
    const existing = stillUses.get(stillId);
    if (!existing || compareStillUseArrival(existing, use) < 0) {
      stillUses.set(stillId, use);
    }
  }
  summary.recentStillUses = [...stillUses.values()]
    .sort(compareStillUseArrival)
    .slice(-RETAINED_STILL_HISTORY_LIMIT);

  for (const encounter of removed) {
    delete state.encounters[encounter.id];
    // Per-actor scheduler and spending entries are read only for present
    // actors, and a retired patient never returns.
    const actorKey = `encounter:${encounter.id}`;
    delete state.retailNextOpportunityTicks[actorKey];
    delete state.retailActorLedgers[actorKey];
    if (state.patientAmenityNextOpportunityTicks) {
      delete state.patientAmenityNextOpportunityTicks[actorKey];
    }
  }
  state.retiredEncounterSummary = summary;
}

export function normalizeRetiredEncounterSummary(
  value: unknown,
): RetiredEncounterSummary | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const parsed = value as Partial<Record<keyof RetiredEncounterSummary, unknown>>;
  if (parsed.version !== "retired-encounter-summary.v1") return undefined;
  const count = (candidate: unknown) =>
    typeof candidate === "number" &&
    Number.isSafeInteger(candidate) &&
    candidate >= 0
      ? candidate
      : 0;
  const samples = Array.isArray(parsed.recentEndedSatisfaction)
    ? parsed.recentEndedSatisfaction.filter(
        (sample): sample is RetiredEncounterSatisfactionSample =>
          typeof sample === "object" &&
          sample !== null &&
          typeof sample.id === "string" &&
          typeof sample.resolvedAtFacilityTick === "number" &&
          typeof sample.finalPatientSatisfaction === "number" &&
          (sample.resolutionReason === "completed" ||
            sample.resolutionReason === "walkout"),
      )
    : [];
  return {
    version: "retired-encounter-summary.v1",
    retiredCount: count(parsed.retiredCount),
    completedCount: count(parsed.completedCount),
    ordinaryEncounterCompleted: parsed.ordinaryEncounterCompleted === true,
    inHouseEndoscopyCompleted: parsed.inHouseEndoscopyCompleted === true,
    recentEndedSatisfaction: samples,
    recentStillUses: Array.isArray(parsed.recentStillUses)
      ? parsed.recentStillUses
          .filter(
            (use): use is RetiredEncounterStillUse =>
              typeof use === "object" &&
              use !== null &&
              typeof use.stillId === "string" &&
              typeof use.encounterId === "string" &&
              typeof use.arrivedAtTick === "number",
          )
          .slice(-RETAINED_STILL_HISTORY_LIMIT)
      : [],
  };
}
