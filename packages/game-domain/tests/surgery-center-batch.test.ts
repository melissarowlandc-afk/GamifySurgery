import { describe, expect, it } from "vitest";
import {
  SURGERY_CENTER_CASES,
  SURGERY_CENTER_TESTED_CONCEPTS,
} from "@gamify-surgery/clinical-content";
import {
  createInitialGameState,
  createPatientPixelAppearance,
  deserializeGameState,
  gameReducer,
  getCurrentCapabilities,
  getCurrentQuestion,
  getEligibleServiceRoute,
  serializeGameState,
  type GameState,
} from "../src";

function preparedState(seed: string, level: 1 | 2): GameState {
  const state = createInitialGameState(undefined, { campaignId: `campaign.sc.${seed}`, campaignSeed: seed, createdAtRealMs: 0 });
  state.facilityLevel = level;
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  if (level === 1) {
    state.rooms.push(
      { id: "room.sc.examination", roomDefinitionId: "room.examination", x: 29, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.sc.minor-procedure", roomDefinitionId: "room.minor_procedure", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      ...([24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.sc.level-one-hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    );
    state.doors.push(
      { id: "door.sc.examination", roomId: "room.sc.examination", side: "east", offset: 1, exterior: false },
      { id: "door.sc.minor-procedure", roomId: "room.sc.minor-procedure", side: "west", offset: 1, exterior: false },
      { id: "door.sc.level-one-front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    );
  }
  if (level === 2) {
    let examination = state.rooms.find((room) => room.roomDefinitionId === "room.examination");
    if (!examination) {
      examination = {
        id: "room.instance.starter_examination",
        roomDefinitionId: "room.examination",
        x: 33,
        y: 25,
        orientation: 0,
        doorSide: null,
        upgradeLevel: 1,
        cleanliness: 100,
      };
      state.rooms.push(examination);
    }
    examination.x = 33;
    examination.y = 25;
    examination.doorSide = null;
    state.doors = state.doors.filter((door) => door.roomId !== examination.id);
    state.rooms.push(
      { id: "room.sc.endoscopy", roomDefinitionId: "room.endoscopy", x: 28, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      { id: "room.sc.periop", roomDefinitionId: "room.periop_recovery", x: 26, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      ...[24, 25, 26, 27, 28].map((y) => ({ id: `room.sc.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    );
    state.doors.push(
      { id: "door.sc.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
      { id: "door.sc.exam", roomId: examination.id, side: "west", offset: 1, exterior: false },
      { id: "door.sc.endoscopy", roomId: "room.sc.endoscopy", side: "east", offset: 1, exterior: false },
      { id: "door.sc.periop", roomId: "room.sc.periop", side: "east", offset: 1, exterior: false },
    );
    for (const [id, role, roomId, location] of [
      ["employee.sc.endo-nurse", "staff.endoscopy_nurse", "room.sc.endoscopy", { x: 29, y: 24 }],
      ["employee.sc.periop-nurse", "staff.periop_nurse", "room.sc.periop", { x: 29, y: 28 }],
      ["employee.sc.endoscopist", "staff.endoscopist", "room.sc.endoscopy", { x: 30, y: 24 }],
    ] as const) state.employees.push({ id, staffRoleDefinitionId: role, displayName: id, appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 100, trainingLevel: 1, homeRoomInstanceId: roomId, location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 100 });
  }
  return state;
}

function ready(state: GameState, encounterId: string, id: string): GameState {
  let next = state;
  for (let tick = 0; tick < 800; tick += 1) {
    if (getCurrentQuestion(next, encounterId)) return next;
    const encounter = next.encounters[encounterId]!;
    next = encounter.lifecycle === "waiting_unopened" && encounter.patientMovement === null
      ? gameReducer(next, { type: "OPEN_CHART", operationId: `${id}.open.${tick}`, encounterId })
      : gameReducer(next, { type: "ADVANCE_TICK", operationId: `${id}.tick.${tick}` });
  }
  const encounter = next.encounters[encounterId]!;
  throw new Error(`Encounter ${encounterId} did not become question-ready: ${encounter.lifecycle}; node ${encounter.currentNodeIndex}; movement ${JSON.stringify(encounter.patientMovement)}; pending ${JSON.stringify(encounter.pendingResult)}`);
}

function answerCorrect(state: GameState, encounterId: string, id: string, reviewedAtMs: number): GameState {
  const question = getCurrentQuestion(state, encounterId)!;
  return gameReducer(state, { type: "SUBMIT_ANSWER", operationId: `${id}.answer`, encounterId, decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices.find((choice) => choice.isCorrect)!.id, reviewedAtMs });
}

function acknowledge(state: GameState, encounterId: string, id: string): GameState {
  const encounter = state.encounters[encounterId]!;
  return gameReducer(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: `${id}.ack`, encounterId, decisionNodeId: encounter.steps[encounter.currentNodeIndex]!.decisionNodeId });
}

describe("September 10 surgery-center production flows", () => {
  it("runs all forty two-node encounters and all thirty-two gated services through reducer actions", () => {
    let gateCount = 0;
    const reviewed = new Set<string>();
    for (const [index, clinicalCase] of SURGERY_CENTER_CASES.entries()) {
      const encounterId = `encounter.sc.${index}`;
      let state = preparedState(`all-${index}`, clinicalCase.earliestFacilityStage === 2 ? 2 : 1);
      state = gameReducer(state, { type: "ADMIT_PATIENT", operationId: `sc.${index}.admit`, encounterId, caseId: clinicalCase.id, patientDisplayName: `Patient ${index}`, arrivalClass: "routine" });
      expect(state.operationReceipts[`sc.${index}.admit`]?.status).toBe("applied");
      state = ready(state, encounterId, `sc.${index}.first`);
      const firstConcept = getCurrentQuestion(state, encounterId)!.node.primaryConceptId;
      expect(firstConcept).toBe(clinicalCase.decisionNodes[0]!.primaryConceptId);
      state = answerCorrect(state, encounterId, `sc.${index}.first`, index + 1);
      reviewed.add(firstConcept);
      const hasGate = clinicalCase.decisionNodes[0]!.resultGateAfter !== null;
      expect(state.encounters[encounterId]!.steps[0]!.status).toBe("feedback_pending");
      state = acknowledge(state, encounterId, `sc.${index}.first`);
      expect(state.operationReceipts[`sc.${index}.first.ack`]?.status).toBe("applied");
      if (hasGate) {
        gateCount += 1;
        const pending = state.encounters[encounterId]!.pendingResult!;
        expect(pending).toMatchObject({ resultTypeId: clinicalCase.decisionNodes[0]!.resultGateAfter!.resultTypeId });
        expect(pending.dueTick).toBeGreaterThan(state.facilityTick);
        expect(getCurrentQuestion(state, encounterId)).toBeNull();
        expect(state.encounters[encounterId]!.deliveredResultNarratives).toEqual([]);
        while (state.facilityTick < pending.dueTick) {
          expect(getCurrentQuestion(state, encounterId)).toBeNull();
          expect(state.encounters[encounterId]!.deliveredResultNarratives).toEqual([]);
          state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `sc.${index}.before-result.${state.facilityTick}` });
        }
        state = ready(state, encounterId, `sc.${index}.result`);
        expect(state.encounters[encounterId]!.deliveredResultNarratives).toContain(clinicalCase.decisionNodes[0]!.resultGateAfter!.resultNarrative);
      } else state = ready(state, encounterId, `sc.${index}.second`);
      const secondConcept = getCurrentQuestion(state, encounterId)!.node.primaryConceptId;
      expect(secondConcept).toBe(clinicalCase.decisionNodes[1]!.primaryConceptId);
      state = answerCorrect(state, encounterId, `sc.${index}.second`, index + 10_000);
      reviewed.add(secondConcept);
      expect(state.learningHistories[firstConcept]?.reviews).toHaveLength(1);
      expect(state.learningHistories[secondConcept]?.reviews).toHaveLength(1);
    }
    expect(gateCount).toBe(32);
    expect(reviewed).toEqual(new Set(SURGERY_CENTER_TESTED_CONCEPTS.map((item) => item.id)));
  }, 15_000);

  it("uses corrective-forward Again grading and preserves a pending external encounter across reload", () => {
    const encounterId = "encounter.sc.corrective";
    let state = preparedState("corrective", 1);
    state = gameReducer(state, { type: "ADMIT_PATIENT", operationId: "sc.corrective.admit", encounterId, caseId: "case.thyroid-nodule.palpable-referral", patientDisplayName: "Corrective Patient", arrivalClass: "routine" });
    state = ready(state, encounterId, "sc.corrective");
    const question = getCurrentQuestion(state, encounterId)!;
    const wrong = question.node.answerChoices.find((choice) => !choice.isCorrect)!;
    state = gameReducer(state, { type: "SUBMIT_ANSWER", operationId: "sc.corrective.answer", encounterId, decisionNodeId: question.node.id, answerChoiceId: wrong.id, reviewedAtMs: 99 });
    expect(state.encounters[encounterId]!.steps[0]!.answer).toMatchObject({ correct: false, correctedForward: true, ratingIntent: "Again" });
    state = acknowledge(state, encounterId, "sc.corrective");
    expect(state.encounters[encounterId]!.pendingResult?.resultTypeId).toBe("service.thyroid_fna");
    const frozen = state.encounters[encounterId]!.frozenCase;
    const restored = deserializeGameState(serializeGameState(state));
    expect(restored.encounters[encounterId]!.frozenCase).toEqual(frozen);
    expect(restored.encounters[encounterId]!.pendingResult).toMatchObject({ routeId: "route.thyroid_fna.outsourced" });
    expect(restored.encounters[encounterId]!.frozenCase.decisionNodes[0]!.showServicePreviews).toBe(false);
  });

  it("enforces the Level 2 EGD boundary and then reserves the operational route", () => {
    const caseId = "case.esophageal-dysphagia.progressive-solids";
    let state = preparedState("endoscopy", 1);
    state = gameReducer(state, { type: "ADMIT_PATIENT", operationId: "sc.egd.level-one", encounterId: "encounter.sc.egd.one", caseId, patientDisplayName: "EGD Patient", arrivalClass: "routine" });
    expect(state.operationReceipts["sc.egd.level-one"]?.message).toBe("This patient becomes eligible at Level 2.");
    const bareLevelTwo = preparedState("endoscopy-bare", 1);
    bareLevelTwo.facilityLevel = 2;
    const rejected = gameReducer(bareLevelTwo, { type: "ADMIT_PATIENT", operationId: "sc.egd.bare", encounterId: "encounter.sc.egd.bare", caseId, patientDisplayName: "EGD Patient", arrivalClass: "routine" });
    expect(rejected.operationReceipts["sc.egd.bare"]?.message).toBe("This patient requires unavailable clinic capability capability.endoscopy.");
    state = preparedState("endoscopy", 2);
    expect(getCurrentCapabilities(state)).toContain("capability.endoscopy");
    expect(getEligibleServiceRoute(state, "service.endoscopy")?.route.id).toBe("route.endoscopy.in_house");
    state = gameReducer(state, { type: "ADMIT_PATIENT", operationId: "sc.egd.ready", encounterId: "encounter.sc.egd.ready", caseId, patientDisplayName: "EGD Patient", arrivalClass: "routine" });
    state = ready(state, "encounter.sc.egd.ready", "sc.egd.ready");
    state = answerCorrect(state, "encounter.sc.egd.ready", "sc.egd.ready", 20_000);
    expect(state.encounters["encounter.sc.egd.ready"]!.steps[0]!.status).toBe("feedback_pending");
    state = acknowledge(state, "encounter.sc.egd.ready", "sc.egd.ready");
    expect(state.operationReceipts["sc.egd.ready.ack"]?.message).toBe("Feedback reviewed; the corrected service is now underway.");
    const pending = state.encounters["encounter.sc.egd.ready"]!.pendingResult!;
    expect(pending).toMatchObject({
      routeId: "route.endoscopy.in_house",
      patientTravel: { originRoomInstanceId: "room.instance.starter_examination", destinationRoomInstanceId: "room.sc.endoscopy" },
      resourceReservations: [
        { roomDefinitionId: "room.endoscopy", staffRoleDefinitionId: "staff.endoscopy_nurse" },
        { roomDefinitionId: "room.periop_recovery", staffRoleDefinitionId: "staff.periop_nurse" },
      ],
      providerReservation: { kind: "employee", employeeId: "employee.sc.endoscopist", staffRoleDefinitionId: "staff.endoscopist" },
    });
    expect(pending.timingPhases).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "phase.endoscopy.preparation", durationTicks: 30, resourceBound: true }),
      expect.objectContaining({ id: "phase.endoscopy.procedure", durationTicks: 45, resourceBound: true }),
      expect.objectContaining({ id: "phase.endoscopy.recovery", durationTicks: 45, resourceBound: true }),
      expect.objectContaining({ id: "phase.endoscopy.return_and_report", durationTicks: 60, resourceBound: false }),
    ]));
  });

  it("freezes generated identity, appearance, profile, and shuffled answer order", () => {
    const orders = new Set<string>();
    for (let seed = 0; seed < 12; seed += 1) {
      const encounterId = `encounter.sc.shuffle.${seed}`;
      let state = preparedState(`shuffle-${seed}`, 1);
      state = gameReducer(state, { type: "ADMIT_PATIENT", operationId: `sc.shuffle.admit.${seed}`, encounterId, caseId: "case.thyroid-nodule.palpable-referral", patientDisplayName: `Shuffle ${seed}`, arrivalClass: "routine" });
      const encounter = state.encounters[encounterId]!;
      orders.add(encounter.frozenCase.decisionNodes[0]!.answerChoices.map((choice) => choice.id).join("|"));
      expect(encounter.frozenCase.presentation).toContain(encounter.patientDisplayName);
      expect(encounter.patientAppearance).toEqual(createPatientPixelAppearance(state.campaignSeed, encounter.id, encounter.frozenCase.prototypeDemographics!));
      expect(encounter.frozenCase.selectedInstantiationProfileId).toBeTruthy();
      const restored = deserializeGameState(serializeGameState(state));
      expect(restored.encounters[encounterId]!.patientDisplayName).toBe(encounter.patientDisplayName);
      expect(restored.encounters[encounterId]!.patientAppearance).toEqual(encounter.patientAppearance);
      expect(restored.encounters[encounterId]!.frozenCase.selectedInstantiationProfileId).toBe(encounter.frozenCase.selectedInstantiationProfileId);
      expect(restored.encounters[encounterId]!.frozenCase.decisionNodes[0]!.answerChoices.map((choice) => choice.id)).toEqual(encounter.frozenCase.decisionNodes[0]!.answerChoices.map((choice) => choice.id));
    }
    expect(orders.size).toBeGreaterThan(1);
  });
});
