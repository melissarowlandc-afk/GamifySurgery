import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  gameReducer,
  getCurrentQuestion,
  selectRoutineClinicalCase,
  type ConceptReviewEvidence,
  type GameState,
} from "../src";

const OPERATING_MINUTES_PER_DAY = 10 * 60;
const FIXED_REAL_TIME_MS = 10_000;

function routineCasesAtStage(
  stage: 0 | 1 | 2,
  availableCapabilityIds: ReadonlySet<string>,
): SyntheticClinicalCase[] {
  return PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(
    (clinicalCase) =>
      clinicalCase.routineEligible &&
      clinicalCase.earliestFacilityStage <= stage &&
      clinicalCase.requiredCapabilityIds.every((capabilityId) =>
        availableCapabilityIds.has(capabilityId),
      ),
  );
}

function uniqueConceptIds(clinicalCase: SyntheticClinicalCase): string[] {
  return [
    ...new Set(
      clinicalCase.decisionNodes.map((node) => node.primaryConceptId),
    ),
  ];
}

function blankState(seed: string): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.patient-supply.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.routineArrivalSequence = 0;
  return state;
}

function markConceptReviewedNotDue(
  state: GameState,
  conceptId: string,
): void {
  const templateHistory = Object.values(state.learningHistories)[0]!;
  state.learningHistories[conceptId] = {
    conceptId,
    card: {
      ...templateHistory.card,
      dueAtMs: FIXED_REAL_TIME_MS + 86_400_000,
      lastReviewAtMs: FIXED_REAL_TIME_MS,
      reps: 1,
    },
    reviews: [{} as ConceptReviewEvidence],
  };
}

function exhaustUnseenSupply(
  cases: readonly SyntheticClinicalCase[],
  seed: string,
): { patientCount: number; introducedConceptIds: Set<string> } {
  const state = blankState(seed);
  const introducedConceptIds = new Set<string>();
  let patientCount = 0;

  while (true) {
    const selection = selectRoutineClinicalCase(
      state,
      cases,
      FIXED_REAL_TIME_MS,
    );
    if (!selection) break;
    for (const conceptId of uniqueConceptIds(selection.clinicalCase)) {
      introducedConceptIds.add(conceptId);
      markConceptReviewedNotDue(state, conceptId);
    }
    state.routineArrivalSequence += 1;
    patientCount += 1;
    if (patientCount > cases.length) {
      throw new Error("Routine selection did not reach a bounded exhaustion point.");
    }
  }

  return { patientCount, introducedConceptIds };
}

function unseenPatientBoundary(
  cases: readonly SyntheticClinicalCase[],
  stageLabel: string,
): { minimum: number; maximum: number } {
  const counts = Array.from({ length: 16 }, (_, index) =>
    exhaustUnseenSupply(cases, `${stageLabel}.${index}`).patientCount,
  );
  return { minimum: Math.min(...counts), maximum: Math.max(...counts) };
}

function preparedLevelOneClinic(seed: string): GameState {
  const state = blankState(seed);
  state.facilityLevel = 1;
  state.rooms.push({
    id: "room.patient-supply.examination",
    roomDefinitionId: "room.examination",
    x: 34,
    y: 26,
    orientation: 0,
    doorSide: "south",
    upgradeLevel: 1,
    cleanliness: 100,
  });
  state.doors.push({
    id: "door.patient-supply.examination",
    roomId: "room.patient-supply.examination",
    side: "south",
    offset: 1,
    exterior: false,
  });
  state.nextRoutineArrivalTick = 1;
  return state;
}

function advance(state: GameState, operationId: string): GameState {
  return gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId,
    advancedAtRealMs: FIXED_REAL_TIME_MS,
  });
}

function admitAndCompleteAtDay(
  state: GameState,
  dayNumber: 6 | 7 | 8,
  answerCorrectly: boolean,
): {
  state: GameState;
  encounterId: string;
  arrivalTick: number;
  answerCount: number;
} {
  const existingIds = new Set(Object.keys(state.encounters));
  state.facilityTick = (dayNumber - 1) * OPERATING_MINUTES_PER_DAY - 1;
  state.nextRoutineArrivalTick = state.facilityTick + 1;
  let next = advance(state, `patient-supply.day-${dayNumber}.arrival`);
  const encounter = Object.values(next.encounters).find(
    (candidate) => !existingIds.has(candidate.id),
  );
  if (!encounter) throw new Error(`Day ${dayNumber} did not admit a patient.`);
  const arrivalTick = encounter.waiting.arrivedAtTick;
  next.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  let answerCount = 0;

  for (let operation = 0; operation < 2_000; operation += 1) {
    const current = next.encounters[encounter.id]!;
    const prefix = `patient-supply.day-${dayNumber}.${operation}`;
    if (current.lifecycle === "resolved_summary_available") {
      next = gameReducer(next, {
        type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
        operationId: `${prefix}.terminal`,
        encounterId: current.id,
      });
      next = gameReducer(next, {
        type: "CLOSE_CHART",
        operationId: `${prefix}.close`,
        encounterId: current.id,
      });
      expect(next.operationReceipts[`${prefix}.close`]?.status).toBe("applied");
      return { state: next, encounterId: current.id, arrivalTick, answerCount };
    }
    const step = current.steps[current.currentNodeIndex];
    if (step?.status === "feedback_pending") {
      next = gameReducer(next, {
        type: "ACKNOWLEDGE_DECISION_FEEDBACK",
        operationId: `${prefix}.feedback`,
        encounterId: current.id,
        decisionNodeId: step.decisionNodeId,
      });
      expect(next.operationReceipts[`${prefix}.feedback`]?.status).toBe("applied");
      continue;
    }
    const question = getCurrentQuestion(next, current.id);
    if (question) {
      const choice = question.node.answerChoices.find(
        (candidate) => candidate.isCorrect === answerCorrectly,
      )!;
      next = gameReducer(next, {
        type: "SUBMIT_ANSWER",
        operationId: `${prefix}.answer`,
        encounterId: current.id,
        decisionNodeId: question.node.id,
        answerChoiceId: choice.id,
        reviewedAtMs: FIXED_REAL_TIME_MS,
      });
      expect(next.operationReceipts[`${prefix}.answer`]?.status).toBe("applied");
      answerCount += 1;
      continue;
    }
    if (
      next.openChartEncounterId !== current.id &&
      (current.checkInStatus === "checked_in" ||
        current.lifecycle === "active_action_required")
    ) {
      next = gameReducer(next, {
        type: "OPEN_CHART",
        operationId: `${prefix}.open`,
        encounterId: current.id,
      });
      expect(next.operationReceipts[`${prefix}.open`]?.status).toBe("applied");
      continue;
    }
    next = advance(next, `${prefix}.tick`);
  }
  throw new Error(`Day ${dayNumber} patient did not complete within 2,000 operations.`);
}

describe("routine patient supply", () => {
  it("records the current clinical inventory and exact unseen-patient boundary by stage", () => {
    const release = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease;
    expect(release.concepts).toHaveLength(183);
    expect(release.cases).toHaveLength(450);
    expect(release.cases.flatMap((item) => item.decisionNodes)).toHaveLength(703);

    const noCapabilities = new Set<string>();
    const everyCapability = new Set(
      release.cases.flatMap((clinicalCase) => clinicalCase.requiredCapabilityIds),
    );
    const stageZeroCases = routineCasesAtStage(0, noCapabilities);
    const stageOneCases = routineCasesAtStage(1, noCapabilities);
    const stageTwoExternalCases = routineCasesAtStage(2, noCapabilities);
    const stageTwoAllCases = routineCasesAtStage(2, everyCapability);

    const stageConceptIds = (cases: readonly SyntheticClinicalCase[]) =>
      new Set(cases.flatMap((clinicalCase) => uniqueConceptIds(clinicalCase)));

    const stageZeroSupply = exhaustUnseenSupply(stageZeroCases, "stage-zero");
    const stageOneSupply = exhaustUnseenSupply(stageOneCases, "stage-one");
    const stageTwoExternalSupply = exhaustUnseenSupply(
      stageTwoExternalCases,
      "stage-two-external",
    );
    const stageTwoAllSupply = exhaustUnseenSupply(
      stageTwoAllCases,
      "stage-two-all",
    );
    const strandedConceptIds = (
      cases: readonly SyntheticClinicalCase[],
      introduced: ReadonlySet<string>,
    ) => [...stageConceptIds(cases)]
      .filter((conceptId) => !introduced.has(conceptId))
      .sort();
    const routineConceptIds = new Set(
      stageTwoAllCases.flatMap((clinicalCase) => uniqueConceptIds(clinicalCase)),
    );
    const conceptRecordCounts = new Map<string, number>();
    for (const concept of release.concepts) {
      conceptRecordCounts.set(
        concept.id,
        (conceptRecordCounts.get(concept.id) ?? 0) + 1,
      );
    }

    expect({
      stageZero: {
        cases: stageZeroCases.length,
        availableConcepts: stageConceptIds(stageZeroCases).size,
        introducedConcepts: stageZeroSupply.introducedConceptIds.size,
        strandedConceptIds: strandedConceptIds(stageZeroCases, stageZeroSupply.introducedConceptIds),
        seededPatientsUntilNotDue: stageZeroSupply.patientCount,
        patientBoundaryAcrossSeeds: unseenPatientBoundary(stageZeroCases, "stage-zero-range"),
      },
      stageOne: {
        cases: stageOneCases.length,
        availableConcepts: stageConceptIds(stageOneCases).size,
        introducedConcepts: stageOneSupply.introducedConceptIds.size,
        strandedConceptIds: strandedConceptIds(stageOneCases, stageOneSupply.introducedConceptIds),
        seededPatientsUntilNotDue: stageOneSupply.patientCount,
        patientBoundaryAcrossSeeds: unseenPatientBoundary(stageOneCases, "stage-one-range"),
      },
      stageTwoExternal: {
        cases: stageTwoExternalCases.length,
        availableConcepts: stageConceptIds(stageTwoExternalCases).size,
        introducedConcepts: stageTwoExternalSupply.introducedConceptIds.size,
        strandedConceptIds: strandedConceptIds(stageTwoExternalCases, stageTwoExternalSupply.introducedConceptIds),
        seededPatientsUntilNotDue: stageTwoExternalSupply.patientCount,
        patientBoundaryAcrossSeeds: unseenPatientBoundary(stageTwoExternalCases, "stage-two-external-range"),
      },
      stageTwoAllCapabilities: {
        cases: stageTwoAllCases.length,
        availableConcepts: stageConceptIds(stageTwoAllCases).size,
        introducedConcepts: stageTwoAllSupply.introducedConceptIds.size,
        strandedConceptIds: strandedConceptIds(stageTwoAllCases, stageTwoAllSupply.introducedConceptIds),
        seededPatientsUntilNotDue: stageTwoAllSupply.patientCount,
        patientBoundaryAcrossSeeds: unseenPatientBoundary(stageTwoAllCases, "stage-two-all-range"),
      },
      conceptsWithoutRoutineCases: release.concepts
        .map((concept) => concept.id)
        .filter((conceptId) => !routineConceptIds.has(conceptId))
        .sort(),
      duplicateConceptRecordIds: [...conceptRecordCounts.entries()]
        .filter(([, count]) => count > 1)
        .sort(([left], [right]) => left.localeCompare(right)),
    }).toMatchInlineSnapshot(`
      {
        "conceptsWithoutRoutineCases": [],
        "duplicateConceptRecordIds": [],
        "stageOne": {
          "availableConcepts": 156,
          "cases": 396,
          "introducedConcepts": 156,
          "patientBoundaryAcrossSeeds": {
            "maximum": 102,
            "minimum": 98,
          },
          "seededPatientsUntilNotDue": 98,
          "strandedConceptIds": [],
        },
        "stageTwoAllCapabilities": {
          "availableConcepts": 183,
          "cases": 450,
          "introducedConcepts": 181,
          "patientBoundaryAcrossSeeds": {
            "maximum": 118,
            "minimum": 113,
          },
          "seededPatientsUntilNotDue": 116,
          "strandedConceptIds": [
            "concept.breast-cyst.asymptomatic-simple-observation",
            "concept.distal-cholangiocarcinoma.operable-tissue-evaluation",
          ],
        },
        "stageTwoExternal": {
          "availableConcepts": 171,
          "cases": 428,
          "introducedConcepts": 170,
          "patientBoundaryAcrossSeeds": {
            "maximum": 110,
            "minimum": 105,
          },
          "seededPatientsUntilNotDue": 106,
          "strandedConceptIds": [
            "concept.felty-syndrome.splenectomy-for-refractory-infections",
          ],
        },
        "stageZero": {
          "availableConcepts": 58,
          "cases": 196,
          "introducedConcepts": 58,
          "patientBoundaryAcrossSeeds": {
            "maximum": 52,
            "minimum": 47,
          },
          "seededPatientsUntilNotDue": 50,
          "strandedConceptIds": [],
        },
      }
    `);
  }, 10_000);

  it("does not let an ineligible multistep case strand other eligible content", () => {
    const cases = routineCasesAtStage(1, new Set());
    const blockedCase = cases.find(
      (clinicalCase) => uniqueConceptIds(clinicalCase).length > 1,
    )!;
    const blockedConceptIds = new Set(uniqueConceptIds(blockedCase));
    const eligibleCase = cases.find((clinicalCase) =>
      uniqueConceptIds(clinicalCase).every(
        (conceptId) => !blockedConceptIds.has(conceptId),
      ),
    )!;
    const state = blankState("mixed-eligible-pool");
    markConceptReviewedNotDue(state, uniqueConceptIds(blockedCase)[0]!);

    const selection = selectRoutineClinicalCase(
      state,
      [blockedCase, eligibleCase],
      FIXED_REAL_TIME_MS,
    );

    expect(selection?.clinicalCase.id).toBe(eligibleCase.id);
    expect(selection?.kind).toBe("new_concept");
  });

  it("admits and completes patients in prepared day-six through day-eight states", () => {
    let state = preparedLevelOneClinic("day-eight");
    const observations = [];
    // These targeted states isolate the day-number boundary from elapsed-time
    // supply. The sustained no-reset run is retained as an ignored diagnostic
    // receipt under .local-dev/gs-017-patient-supply-diagnostic.test.ts.
    for (const [dayNumber, answerCorrectly] of [
      [6, false],
      [7, true],
      [8, false],
    ] as const) {
      const result = admitAndCompleteAtDay(state, dayNumber, answerCorrectly);
      state = result.state;
      observations.push({
        dayNumber,
        arrivalTick: result.arrivalTick,
        answerCorrectly,
        answerCount: result.answerCount,
        resolutionReason: state.encounters[result.encounterId]!.resolutionReason,
      });
    }

    expect(observations).toMatchInlineSnapshot(`
      [
        {
          "answerCorrectly": false,
          "answerCount": 3,
          "arrivalTick": 3000,
          "dayNumber": 6,
          "resolutionReason": "completed",
        },
        {
          "answerCorrectly": true,
          "answerCount": 1,
          "arrivalTick": 3600,
          "dayNumber": 7,
          "resolutionReason": "completed",
        },
        {
          "answerCorrectly": false,
          "answerCount": 1,
          "arrivalTick": 4200,
          "dayNumber": 8,
          "resolutionReason": "completed",
        },
      ]
    `);
    expect(observations.every((item) => item.answerCount > 0)).toBe(true);
    expect(observations.every((item) => item.resolutionReason === "completed")).toBe(true);
  }, 30_000);
});
