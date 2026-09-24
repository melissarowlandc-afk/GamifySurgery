import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  gameReducer,
  getCurrentQuestion,
  selectRoutineClinicalCase,
  type GameState,
} from "../../src";

const REAL_MS = 10_000;
const OPERATING_MINUTES_PER_DAY = 600;

function tick(state: GameState, operationId: string): GameState {
  return gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId,
    advancedAtRealMs: REAL_MS,
  });
}

function preparedClinic(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: "campaign.gs017.sustained",
    campaignSeed: "gs017-sustained",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.rooms.push({
    id: "room.gs017.exam",
    roomDefinitionId: "room.examination",
    x: 34,
    y: 26,
    orientation: 0,
    doorSide: "south",
    upgradeLevel: 1,
    cleanliness: 100,
  });
  state.doors.push({
    id: "door.gs017.exam",
    roomId: "room.gs017.exam",
    side: "south",
    offset: 1,
    exterior: false,
  });
  state.nextRoutineArrivalTick = 1;
  return state;
}

describe("GS-017 sustained patient supply diagnostic", () => {
  it("runs normal ticks, arrivals, gates, and completions through day eight", () => {
    let state = preparedClinic();
    let operations = 0;
    let answers = 0;
    while (state.facilityTick < OPERATING_MINUTES_PER_DAY * 8) {
      if (operations >= 10_000) {
        throw new Error(
          `Diagnostic operation bound exceeded: ${JSON.stringify({
            facilityTick: state.facilityTick,
            openChartEncounterId: state.openChartEncounterId,
            encounters: Object.values(state.encounters).map((encounter) => ({
              id: encounter.id,
              lifecycle: encounter.lifecycle,
              resolutionReason: encounter.resolutionReason,
              movement: encounter.patientMovement?.kind ?? null,
              step:
                encounter.steps[encounter.currentNodeIndex]?.status ?? null,
            })),
          })}`,
        );
      }

      const prefix = `gs017.sustained.${operations++}`;
      const openEncounter = state.openChartEncounterId
        ? state.encounters[state.openChartEncounterId]
        : null;
      const encounter =
        openEncounter ??
        Object.values(state.encounters).find(
          (candidate) =>
            candidate.lifecycle === "resolved_summary_available",
        ) ??
        Object.values(state.encounters).find(
          (candidate) =>
            candidate.lifecycle === "active_action_required" ||
            candidate.lifecycle === "waiting_unopened",
        ) ??
        Object.values(state.encounters).find(
          (candidate) =>
            candidate.resolutionReason === null &&
            candidate.patientMovement?.kind !== "leaving_after_walkout",
        );

      if (!encounter) {
        state = tick(state, `${prefix}.tick`);
        continue;
      }
      if (encounter.lifecycle === "resolved_summary_available") {
        if (!encounter.terminalFeedback?.acknowledged) {
          state = gameReducer(state, {
            type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
            operationId: `${prefix}.terminal`,
            encounterId: encounter.id,
          });
        }
        state = gameReducer(state, {
          type: "CLOSE_CHART",
          operationId: `${prefix}.close`,
          encounterId: encounter.id,
        });
        expect(state.operationReceipts[`${prefix}.close`]?.status).toBe(
          "applied",
        );
        continue;
      }
      if (
        encounter.lifecycle === "active_pending_result" &&
        state.openChartEncounterId === encounter.id
      ) {
        state = gameReducer(state, {
          type: "CLOSE_CHART",
          operationId: `${prefix}.pending-close`,
          encounterId: encounter.id,
        });
        expect(
          state.operationReceipts[`${prefix}.pending-close`]?.status,
        ).toBe("applied");
        expect(state.openChartEncounterId).toBeNull();
        continue;
      }

      const step = encounter.steps[encounter.currentNodeIndex];
      if (step?.status === "feedback_pending") {
        state = gameReducer(state, {
          type: "ACKNOWLEDGE_DECISION_FEEDBACK",
          operationId: `${prefix}.feedback`,
          encounterId: encounter.id,
          decisionNodeId: step.decisionNodeId,
        });
        expect(state.operationReceipts[`${prefix}.feedback`]?.status).toBe(
          "applied",
        );
        continue;
      }

      const question = getCurrentQuestion(state, encounter.id);
      if (question) {
        const correct = answers % 2 === 0;
        const choice = question.node.answerChoices.find(
          (candidate) => candidate.isCorrect === correct,
        )!;
        state = gameReducer(state, {
          type: "SUBMIT_ANSWER",
          operationId: `${prefix}.answer`,
          encounterId: encounter.id,
          decisionNodeId: question.node.id,
          answerChoiceId: choice.id,
          reviewedAtMs: REAL_MS,
        });
        expect(state.operationReceipts[`${prefix}.answer`]?.status).toBe(
          "applied",
        );
        answers += 1;
        continue;
      }

      if (
        state.openChartEncounterId !== encounter.id &&
        (encounter.lifecycle === "active_action_required" ||
          (encounter.lifecycle === "waiting_unopened" &&
            encounter.checkInStatus === "checked_in"))
      ) {
        state = gameReducer(state, {
          type: "OPEN_CHART",
          operationId: `${prefix}.open`,
          encounterId: encounter.id,
        });
        expect(state.operationReceipts[`${prefix}.open`]?.status).toBe(
          "applied",
        );
        continue;
      }
      state = tick(state, `${prefix}.tick`);
    }

    const encounters = Object.values(state.encounters);
    const eligibleCases =
      PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(
        (clinicalCase) =>
          clinicalCase.routineEligible &&
          clinicalCase.earliestFacilityStage <= state.facilityLevel &&
          clinicalCase.requiredCapabilityIds.length === 0,
      );
    const availableConceptIds = new Set(
      eligibleCases.flatMap((clinicalCase) =>
        clinicalCase.decisionNodes.map((node) => node.primaryConceptId),
      ),
    );
    const arrivalsByDay = Array.from({ length: 8 }, (_, day) =>
      encounters.filter(
        (encounter) =>
          encounter.waiting.arrivedAtTick >=
            day * OPERATING_MINUTES_PER_DAY &&
          encounter.waiting.arrivedAtTick <
            (day + 1) * OPERATING_MINUTES_PER_DAY,
      ).length,
    );
    const evidence = {
      facilityTick: state.facilityTick,
      arrivalsByDay,
      totalArrivals: encounters.length,
      lastArrivalTick: Math.max(
        ...encounters.map((encounter) => encounter.waiting.arrivedAtTick),
      ),
      completed: encounters.filter(
        (encounter) => encounter.resolutionReason === "completed",
      ).length,
      walkouts: encounters.filter(
        (encounter) => encounter.resolutionReason === "walkout",
      ).length,
      unresolved: encounters.filter(
        (encounter) => encounter.resolutionReason === null,
      ).length,
      pendingResults: encounters.filter(
        (encounter) => encounter.lifecycle === "active_pending_result",
      ).length,
      scoredConcepts: Object.values(state.learningHistories).filter(
        (history) => history.reviews.length > 0,
      ).length,
      unseenAvailableConceptIds: [...availableConceptIds]
        .filter(
          (conceptId) =>
            !state.learningHistories[conceptId] ||
            state.learningHistories[conceptId]!.reviews.length === 0,
        )
        .sort(),
      dueReviews: Object.values(state.learningHistories).filter(
        (history) =>
          history.reviews.length > 0 && history.card.dueAtMs <= REAL_MS,
      ).length,
      nextRoutineArrivalTick: state.nextRoutineArrivalTick,
      nextSelectionKind:
        selectRoutineClinicalCase(state, eligibleCases, REAL_MS)?.kind ?? null,
      answers,
    };

    expect(evidence).toMatchInlineSnapshot(`
      {
        "answers": 125,
        "arrivalsByDay": [
          11,
          10,
          9,
          10,
          10,
          9,
          10,
          10,
        ],
        "completed": 77,
        "dueReviews": 0,
        "facilityTick": 4800,
        "lastArrivalTick": 4777,
        "nextRoutineArrivalTick": 4838,
        "nextSelectionKind": "new_concept",
        "pendingResults": 1,
        "scoredConcepts": 125,
        "totalArrivals": 79,
        "unresolved": 2,
        "unseenAvailableConceptIds": [
          "concept.aaa.six-cm-elective-repair-referral",
          "concept.adrenal-incidentaloma.one-mg-dst",
          "concept.anal-hsil.high-risk-hpv-association",
          "concept.breast-cyst.asymptomatic-simple-observation",
          "concept.breast-mass.image-guided-core-biopsy",
          "concept.breast-mass.under-30-initial-ultrasound",
          "concept.choledochal-cyst.type-iva-combined-duct-dilation",
          "concept.chronic-anal-fissure.lis-after-medical-treatment",
          "concept.colon-cancer.oncologic-regional-resection",
          "concept.ebv.associated-malignancy-recognition",
          "concept.femoral-hernia.timely-elective-repair",
          "concept.fhh.biochemical-evaluation",
          "concept.fibroadenoma.concordant-observation",
          "concept.gallbladder-polyp.initial-management-category",
          "concept.gastric-gist.eus-core-molecular-diagnosis",
          "concept.gastric-gist.mutation-guided-neoadjuvant-imatinib",
          "concept.graves.clinical-pattern-recognition",
          "concept.graves.rai-appropriate-candidate",
          "concept.men2a.core-manifestation-pattern",
          "concept.mondor-disease.selective-imaging-evaluation",
          "concept.obstructive-jaundice.vitamin-k-coagulopathy",
          "concept.perianal-abscess.selective-antibiotics",
          "concept.rectal-cancer.multimodal-response-assessment",
          "concept.rectal-cancer.selected-watch-and-wait",
        ],
        "walkouts": 0,
      }
    `);
    expect(arrivalsByDay[5]).toBeGreaterThan(0);
    expect(arrivalsByDay[6]).toBeGreaterThan(0);
    expect(arrivalsByDay[7]).toBeGreaterThan(0);
    expect(evidence.completed).toBeGreaterThan(0);
    expect(answers).toBeGreaterThan(0);
  }, 300_000);
});
