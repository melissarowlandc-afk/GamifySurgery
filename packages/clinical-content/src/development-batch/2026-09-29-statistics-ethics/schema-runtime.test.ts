import { describe, expect, it } from "vitest";
import { caseExhibitSchema, syntheticClinicalCaseSchema, type CaseExhibit } from "../../schema";
import { createDevelopmentFamily, type CaseSpec } from "./batch-helpers";
import { STATISTICS_QI_FAMILIES } from "./statistics-qi";
import {
  PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, deserializeGameState,
  gameReducer, getCurrentQuestion, materializePatientName, serializeGameState,
  type DomainContext, type GameState,
} from "../../../../game-domain/src";

const exhibits: CaseExhibit[] = [
  { kind: "table", caption: "{patientName}'s teaching dataset", columnHeaders: ["Before", "After"], rowHeaders: ["Group"], cells: [["20", "10"]] },
  { kind: "keyValue", caption: "{patientName}'s comparison", items: [{ label: "Group", value: "{patientName}'s group" }] },
  { kind: "abstract", title: "{patientName}'s study discussion", body: "Compare the two teaching groups." },
];

function fixture(exhibit: CaseExhibit) {
  const source = STATISTICS_QI_FAMILIES[0]!;
  const authored = source.questions[0]!;
  const spec: CaseSpec = {
    id: "case.gs028se.schema-roundtrip", displayName: "Schema round trip",
    chiefComplaint: "Test question", presentation: "{patientName}, a {patientAge}-year-old {patientSex}, asks about a comparison.",
    ageYears: [43], sexLabels: ["Female"], stage: 0,
    nodes: [{
      conceptId: authored.conceptId, stem: authored.stem,
      explanation: "Compare the observations using the stated design.",
      teachingPoint: "{patientName}'s comparison depends on the observation structure.",
      exhibit, claimIds: authored.supportingEvidenceClaimIds,
      choices: authored.answerChoices.map((item) => ({
        id: item.id, label: item.label, isCorrect: item.isCorrect,
        rationale: "{patientName}'s choice can be assessed against the design.",
        timing: { kind: "no_test" as const },
      })) as CaseSpec["nodes"][number]["choices"],
    }],
  };
  const built = createDevelopmentFamily({ concepts: [source.authoringConcepts[0]!], cases: [spec], sourceLabels: source.cases[0]!.sourceLabels });
  const clinicalCase = syntheticClinicalCaseSchema.parse(built.cases[0]);
  const context: DomainContext = {
    ...PROTOTYPE_DOMAIN_CONTEXT,
    clinicalRelease: { ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease, cases: [...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases, clinicalCase] },
  };
  let state = createInitialGameState(context, { campaignSeed: "gs028-schema", createdAtRealMs: 0 });
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push({ id: "room.gs028.schema.exam", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0, doorSide: "south", upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "door.gs028.schema.exam", roomId: "room.gs028.schema.exam", side: "south", offset: 1, exterior: false });
  state = gameReducer(state, { type: "ADMIT_PATIENT", operationId: "schema.admit", encounterId: "encounter.gs028.schema", caseId: clinicalCase.id, patientDisplayName: "Maya Reed", arrivalClass: "routine" }, context);
  expect(state.operationReceipts["schema.admit"]?.status).toBe("applied");
  return { built, clinicalCase, context, state };
}

function ready(state: GameState, context: DomainContext): GameState {
  let next = state;
  const encounterId = "encounter.gs028.schema";
  for (let attempt = 0; attempt < 1_500; attempt += 1) {
    if (getCurrentQuestion(next, encounterId, context)) return next;
    const encounter = next.encounters[encounterId]!;
    next = encounter.lifecycle === "waiting_unopened" && encounter.patientMovement === null
      ? gameReducer(next, { type: "OPEN_CHART", operationId: `schema.open.${attempt}`, encounterId }, context)
      : gameReducer(next, { type: "ADVANCE_TICK", operationId: `schema.tick.${attempt}` }, context);
  }
  throw new Error("Schema fixture never became answer-ready.");
}

describe("GS028 optional feedback and exhibit save contract", () => {
  it.each(exhibits)("carries $kind from authoring through shuffled frozen cases and reload", (exhibit) => {
    const { built, clinicalCase, context, state } = fixture(exhibit);
    expect(built.questions[0]!.exhibit).toEqual(exhibit);
    expect(built.questions[0]!.teachingPoint).toEqual(clinicalCase.decisionNodes[0]!.teachingPoint);
    const expected = materializePatientName(clinicalCase, "Maya Reed");
    const frozen = state.encounters["encounter.gs028.schema"]!.frozenCase;
    expect(frozen.decisionNodes[0]!.exhibit).toEqual(expected.decisionNodes[0]!.exhibit);
    expect(frozen.decisionNodes[0]!.teachingPoint).toEqual(expected.decisionNodes[0]!.teachingPoint);
    for (const answer of frozen.decisionNodes[0]!.answerChoices) {
      expect(answer.rationale).toBe("Maya Reed's choice can be assessed against the design.");
      expect(built.questions[0]!.answerChoices.find((choice) => choice.id === answer.id)?.rationale).toContain("{patientName}");
    }
    expect(deserializeGameState(serializeGameState(state), context).encounters["encounter.gs028.schema"]!.frozenCase).toEqual(frozen);
    expect(JSON.stringify(clinicalCase)).toContain("{patientName}");
  });

  it("loads and plays a legacy frozen save without any of the three optional fields", () => {
    const { context, state } = fixture(exhibits[0]!);
    const frozen = state.encounters["encounter.gs028.schema"]!.frozenCase;
    for (const node of frozen.decisionNodes) {
      delete node.teachingPoint;
      delete node.exhibit;
      for (const choice of node.answerChoices) delete choice.rationale;
    }
    syntheticClinicalCaseSchema.parse(frozen);
    let reloaded = deserializeGameState(serializeGameState(state), context);
    expect(reloaded.encounters["encounter.gs028.schema"]!.frozenCase).toEqual(frozen);
    reloaded = ready(reloaded, context);
    const question = getCurrentQuestion(reloaded, "encounter.gs028.schema", context)!;
    reloaded = gameReducer(reloaded, { type: "SUBMIT_ANSWER", operationId: "legacy.answer", encounterId: "encounter.gs028.schema", decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices.find((choice) => choice.isCorrect)!.id, reviewedAtMs: 1 }, context);
    expect(reloaded.operationReceipts["legacy.answer"]?.status).toBe("applied");
    expect(reloaded.learningHistories[question.node.primaryConceptId]?.reviews).toHaveLength(1);
    expect(reloaded.encounters["encounter.gs028.schema"]!.lifecycle).toBe("resolved_summary_available");
  });

  it("rejects ragged teaching tables", () => {
    expect(caseExhibitSchema.safeParse({ ...exhibits[0], cells: [["20"]] }).success).toBe(false);
  });
});
