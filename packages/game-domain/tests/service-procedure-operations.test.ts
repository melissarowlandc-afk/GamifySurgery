import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  findDeterministicRoomPath,
  gameReducer,
  getCurrentQuestion,
  getCurrentCapabilities,
  getEligibleServiceRoute,
  getRoomDefinition,
  getRoomNavigationAnchor,
  isRoomOperationalForFacilityWork,
  type GameState,
} from "../src";

let sequence = 0;

function minorProcedureState(): GameState {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.procedure-income.${sequence++}`,
    campaignSeed: "procedure-income",
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.founderActivity = null;
  state.encounters = {};
  state.rooms.push(
    { id: "room.test.exam", roomDefinitionId: "room.examination", x: 29, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.test.minor", roomDefinitionId: "room.minor_procedure", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...([24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.test.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.test.minor", roomId: "room.test.minor", side: "west", offset: 1, exterior: false },
    { id: "door.test.exam", roomId: "room.test.exam", side: "east", offset: 1, exterior: false },
    { id: "door.test.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  return state;
}

function prepareQuestion(state: GameState, caseId: string, conceptId: string): GameState {
  let next = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: `procedure.admit.${sequence++}`,
    encounterId: "procedure-patient",
    caseId,
    patientDisplayName: "Procedure Patient",
    arrivalClass: "routine",
  });
  expect(next.operationReceipts[Object.keys(next.operationReceipts).at(-1)!]?.status).toBe("applied");
  const encounter = next.encounters["procedure-patient"]!;
  const nodeIndex = encounter.frozenCase.decisionNodes.findIndex((node) => node.primaryConceptId === conceptId);
  expect(nodeIndex).toBeGreaterThanOrEqual(0);
  encounter.currentNodeIndex = nodeIndex;
  encounter.steps.forEach((step, index) => {
    step.status = index < nodeIndex ? "completed" : index === nodeIndex ? "action_required" : "locked";
  });
  const front = next.rooms.find((room) => room.id === "room.instance.founder_desk")!;
  encounter.patientLocation = getRoomNavigationAnchor(front, getRoomDefinition(front.roomDefinitionId)!, "primary");
  encounter.patientMovement = null;
  encounter.lifecycle = "active_action_required";
  next.openChartEncounterId = encounter.id;
  next.attendedEncounterId = encounter.id;
  return next;
}

function submit(state: GameState, correct: boolean): GameState {
  const question = getCurrentQuestion(state, "procedure-patient")!;
  const choice = question.node.answerChoices.find((candidate) => candidate.isCorrect === correct)!;
  return gameReducer(state, {
    type: "SUBMIT_ANSWER",
    operationId: `procedure.answer.${sequence++}`,
    encounterId: "procedure-patient",
    decisionNodeId: question.node.id,
    answerChoiceId: choice.id,
    reviewedAtMs: 10_000,
  });
}

function advance(state: GameState, minutes: number): GameState {
  let next = state;
  for (let index = 0; index < minutes; index += 1) {
    next = gameReducer(next, { type: "ADVANCE_TICK", operationId: `procedure.tick.${sequence++}` });
  }
  return next;
}

describe("mapped in-clinic procedure operations", () => {
  it.each([
    ["case.breast-cyst.under-30-painful-simple", "concept.breast-cyst.symptomatic-simple-aspiration", "income.minor_procedure_simple", 100],
    ["case.bread-butter.cutaneous-abscess.forearm-redness", "concept.cutaneous-abscess.incision-drainage", "income.minor_procedure_simple", 100],
    ["case.bread-butter.superficial-incisional-ssi.purulent-staple-line", "concept.superficial-incisional-ssi.open-drain", "income.minor_procedure_complex", 200],
  ])("performs %s only after the exact final correct action", (caseId, conceptId, incomeLineId, fee) => {
    let state = prepareQuestion(minorProcedureState(), caseId, conceptId);
    const cashBefore = state.cash;
    state = submit(state, true);
    expect(state.serviceIncomeReceipts).toEqual([]);
    expect(state.serviceOperations[0]).toMatchObject({ actorKind: "encounter", incomeLineId, status: "waiting_for_resources" });
    expect(state.encounters["procedure-patient"]!.patientMovement).toBeNull();
    const cashAfterAnswer = state.cash;
    expect(cashAfterAnswer).toBeGreaterThanOrEqual(cashBefore);
    state = advance(state, 100);
    expect(state.cash).toBe(cashAfterAnswer + fee);
    expect(state.serviceIncomeReceipts).toHaveLength(1);
    expect(state.serviceIncomeReceipts[0]).toMatchObject({ actorKind: "patient", incomeLineId, grossAmount: fee });
  });

  it("does not start or pay a mapped procedure after an incorrect final choice", () => {
    let state = prepareQuestion(minorProcedureState(), "case.bread-butter.superficial-incisional-ssi.purulent-staple-line", "concept.superficial-incisional-ssi.open-drain");
    state = submit(state, false);
    expect(state.serviceOperations).toEqual([]);
    expect(state.serviceIncomeReceipts).toEqual([]);
  });

  it("prefers the approved onsite skin acquisition routes while retaining external pathology time", () => {
    const state = minorProcedureState();
    expect([...getCurrentCapabilities(state)]).toContain("capability.minor_procedure");
    expect(isRoomOperationalForFacilityWork(state, "room.test.minor")).toBe(true);
    const exam = state.rooms.find((room) => room.id === "room.test.exam")!;
    const minor = state.rooms.find((room) => room.id === "room.test.minor")!;
    expect(findDeterministicRoomPath(exam, minor, getRoomDefinition, state.rooms, new Set(["room.front_desk"]), state.doors).length).toBeGreaterThan(0);
    for (const [serviceId, routeId] of [
      ["service.skin_excisional_biopsy", "route.skin_excisional_biopsy.in_house"],
      ["service.cutaneous_lesion_biopsy", "route.cutaneous_lesion_biopsy.in_house"],
    ] as const) {
      expect(getEligibleServiceRoute(state, serviceId)).toMatchObject({
        route: {
          id: routeId,
          timingPhases: [
            { durationTicks: 60, resourceBound: true },
            { durationTicks: 120, resourceBound: false },
          ],
        },
        providerReservation: { kind: "founder" },
      });
    }
  });

  it("keeps newly admitted mapped cases behind the minor-procedure capability", () => {
    const state = createInitialGameState();
    const gatedCaseIds = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases
      .filter((clinicalCase) => clinicalCase.requiredCapabilityIds.includes("capability.minor_procedure"))
      .map((clinicalCase) => clinicalCase.id);
    expect(gatedCaseIds).toContain("case.bread-butter.superficial-incisional-ssi.purulent-staple-line");
    expect(gatedCaseIds.some((id) => id.startsWith("case.cutaneous-scc."))).toBe(true);
    expect(gatedCaseIds.some((id) => id.startsWith("case.pigmented-skin-lesion."))).toBe(true);
    const attempted = gameReducer(state, { type: "ADMIT_PATIENT", operationId: "gated.case", encounterId: "gated", caseId: "case.bread-butter.superficial-incisional-ssi.purulent-staple-line", patientDisplayName: "Gated Patient", arrivalClass: "routine" });
    expect(attempted.operationReceipts["gated.case"]?.status).toBe("rejected");
  });
});
