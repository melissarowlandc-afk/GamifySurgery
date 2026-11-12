import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { deterministicInteger, RANDOM_STREAMS } from "./randomness";
import type { GameState } from "./types";

export type RoutineClinicalSelectionKind = "due_review" | "new_concept";

export interface RoutineClinicalSelection {
  clinicalCase: SyntheticClinicalCase;
  selectedConceptId: string;
  kind: RoutineClinicalSelectionKind;
}

function uniqueConceptIds(clinicalCase: SyntheticClinicalCase): string[] {
  return [
    ...new Set(
      clinicalCase.decisionNodes.map((node) => node.primaryConceptId),
    ),
  ];
}

function deterministicChoice<T>(
  values: readonly T[],
  state: GameState,
  purposeId: string,
): T {
  return values[
    deterministicInteger(
      state.campaignSeed,
      RANDOM_STREAMS.clinicalCaseSelection,
      purposeId,
      values.length,
    )
  ]!;
}

/**
 * Selects the educational content for one routine arrival.
 *
 * FSRS remains authoritative for repeat timing: a reviewed concept is eligible
 * only once its saved card is due. When no review is due, selection is uniform
 * across distinct unseen concept identities, then uniform across the eligible
 * case variants that can express the selected concept. Selecting concepts
 * before variants prevents a concept with many authored variants from crowding
 * out one with only a single variant.
 *
 * A multi-decision case is eligible only when every concept it would score is
 * either unseen or due. This prevents reaching a new later decision by forcing
 * an early review of a preceding concept. Concepts already present in an
 * unresolved encounter are also excluded.
 */
export function selectRoutineClinicalCase(
  state: GameState,
  eligibleCases: readonly SyntheticClinicalCase[],
  selectedAtRealMs: number,
): RoutineClinicalSelection | null {
  if (!Number.isSafeInteger(selectedAtRealMs) || selectedAtRealMs < 0) {
    throw new Error("Routine clinical selection needs a valid timestamp.");
  }

  const activeConceptIds = new Set(
    Object.values(state.encounters)
      .filter((encounter) => encounter.resolutionReason === null)
      .flatMap((encounter) => uniqueConceptIds(encounter.frozenCase)),
  );

  const compatibleCases = [...eligibleCases]
    .sort((left, right) => left.id.localeCompare(right.id))
    .filter((clinicalCase) =>
      uniqueConceptIds(clinicalCase).every((conceptId) => {
        if (activeConceptIds.has(conceptId)) {
          return false;
        }
        const history = state.learningHistories[conceptId];
        return (
          !history ||
          history.reviews.length === 0 ||
          history.card.dueAtMs <= selectedAtRealMs
        );
      }),
    );
  if (compatibleCases.length === 0) {
    return null;
  }

  const dueByConceptId = new Map<string, number>();
  for (const clinicalCase of compatibleCases) {
    for (const conceptId of uniqueConceptIds(clinicalCase)) {
      const history = state.learningHistories[conceptId];
      if (
        history &&
        history.reviews.length > 0 &&
        history.card.dueAtMs <= selectedAtRealMs
      ) {
        dueByConceptId.set(conceptId, history.card.dueAtMs);
      }
    }
  }

  let kind: RoutineClinicalSelectionKind;
  let conceptPool: string[];
  if (dueByConceptId.size > 0) {
    kind = "due_review";
    const earliestDueAt = Math.min(...dueByConceptId.values());
    conceptPool = [...dueByConceptId.entries()]
      .filter(([, dueAtMs]) => dueAtMs === earliestDueAt)
      .map(([conceptId]) => conceptId)
      .sort((left, right) => left.localeCompare(right));
  } else {
    kind = "new_concept";
    conceptPool = [
      ...new Set(
        compatibleCases.flatMap((clinicalCase) =>
          uniqueConceptIds(clinicalCase).filter((conceptId) => {
            const history = state.learningHistories[conceptId];
            return !history || history.reviews.length === 0;
          }),
        ),
      ),
    ].sort((left, right) => left.localeCompare(right));
  }

  if (conceptPool.length === 0) {
    return null;
  }

  const selectedConceptId = deterministicChoice(
    conceptPool,
    state,
    `routine.${state.routineArrivalSequence}.${kind}.concept.v1`,
  );
  const casePool = compatibleCases.filter((clinicalCase) =>
    uniqueConceptIds(clinicalCase).includes(selectedConceptId),
  );
  const clinicalCase = deterministicChoice(
    casePool,
    state,
    `routine.${state.routineArrivalSequence}.${kind}.${selectedConceptId}.case.v1`,
  );

  return { clinicalCase, selectedConceptId, kind };
}
