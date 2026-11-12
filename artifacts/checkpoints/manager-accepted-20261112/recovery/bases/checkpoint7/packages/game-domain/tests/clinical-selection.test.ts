import { describe, expect, it } from "vitest";
import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  selectRoutineClinicalCase,
  type ConceptReviewEvidence,
  type GameState,
} from "../src";

const templateCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
  (clinicalCase) => clinicalCase.routineEligible,
)!;
const templateNode = templateCase.decisionNodes[0]!;

function caseFor(
  id: string,
  conceptIds: readonly string[],
): SyntheticClinicalCase {
  return {
    ...templateCase,
    id,
    decisionNodes: conceptIds.map((conceptId, index) => ({
      ...templateNode,
      id: `node.${id}.${index}`,
      questionVariantId: `question.${id}.${index}`,
      primaryConceptId: conceptId,
    })),
  };
}

function blankState(seed = "clinical-selection"): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.encounters = {};
  state.routineArrivalSequence = 0;
  return state;
}

function markReviewed(
  state: GameState,
  conceptId: string,
  dueAtMs: number,
): void {
  const templateHistory = Object.values(state.learningHistories)[0]!;
  state.learningHistories[conceptId] = {
    conceptId,
    card: {
      ...templateHistory.card,
      dueAtMs,
      lastReviewAtMs: 1,
      reps: 1,
    },
    reviews: [{} as ConceptReviewEvidence],
  };
}

describe("routine clinical selection", () => {
  it("randomizes uniformly by unseen concept before selecting a case variant", () => {
    const state = blankState("unseen-pool");
    const cases = [
      ...Array.from({ length: 8 }, (_, index) =>
        caseFor(`case.concept-a.${index}`, ["concept.a"]),
      ),
      caseFor("case.concept-b.only", ["concept.b"]),
    ];
    const counts = new Map<string, number>();

    for (let sequence = 0; sequence < 256; sequence += 1) {
      state.routineArrivalSequence = sequence;
      const selection = selectRoutineClinicalCase(state, cases, 10_000);
      expect(selection?.kind).toBe("new_concept");
      counts.set(
        selection!.selectedConceptId,
        (counts.get(selection!.selectedConceptId) ?? 0) + 1,
      );
      expect(
        selection!.clinicalCase.decisionNodes.some(
          (node) => node.primaryConceptId === selection!.selectedConceptId,
        ),
      ).toBe(true);
    }

    expect([...counts.keys()].sort()).toEqual(["concept.a", "concept.b"]);
    expect(counts.get("concept.a")).toBeGreaterThan(90);
    expect(counts.get("concept.b")).toBeGreaterThan(90);
  });

  it("prioritizes the most overdue FSRS concept before unseen content", () => {
    const state = blankState("due-before-new");
    markReviewed(state, "concept.due-later", 5_000);
    markReviewed(state, "concept.due-first", 1_000);
    const selection = selectRoutineClinicalCase(
      state,
      [
        caseFor("case.new", ["concept.new"]),
        caseFor("case.due-later", ["concept.due-later"]),
        caseFor("case.due-first", ["concept.due-first"]),
      ],
      10_000,
    );

    expect(selection).toMatchObject({
      kind: "due_review",
      selectedConceptId: "concept.due-first",
      clinicalCase: { id: "case.due-first" },
    });
  });

  it("does not repeat a reviewed concept before its saved due date", () => {
    const state = blankState("not-due");
    markReviewed(state, "concept.not-due", 20_000);

    expect(
      selectRoutineClinicalCase(
        state,
        [caseFor("case.not-due", ["concept.not-due"])],
        10_000,
      ),
    ).toBeNull();
  });

  it("does not use a multistep case to reach new content through an early review", () => {
    const state = blankState("multistep-guard");
    markReviewed(state, "concept.not-due-prefix", 20_000);

    expect(
      selectRoutineClinicalCase(
        state,
        [
          caseFor("case.multistep", [
            "concept.not-due-prefix",
            "concept.new-later-step",
          ]),
        ],
        10_000,
      ),
    ).toBeNull();
  });
});
