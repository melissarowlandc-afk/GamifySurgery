import { describe, expect, it } from "vitest";
import { createAppAppointmentsQaState } from "../../../tests/fixtures/app-appointments";
import { createLevelFourRoomsQaContext } from "../../../tests/fixtures/level-four-rooms";
import { deserializeGameState, getCurrentQuestion, getPatientLists, getRoomCareAnchor, getRoomDefinition, getRoomSalePreview, isAppAppointment, serializeGameState } from "../src";
import { clinicFounderPath } from "../src/clinic-consults";
import { answerConsult, consultCommand, consultTick } from "./founder-consults.fixture";

const fullContext = createLevelFourRoomsQaContext();
// Exercise the handoff with existing no-test clinic questions. Separate cases
// below cover a diagnostic continuation without relabeling authored content.
const context = { ...fullContext, clinicalRelease: { ...fullContext.clinicalRelease,
  cases: fullContext.clinicalRelease.cases.filter(c => c.tutorialEligible || c.requiredClinicalSetting === "clinic" && !c.participant && !c.pediatricProfile &&
    c.decisionNodes.every(n => !n.resultGateAfter && n.answerChoices.every(a => !a.serviceRequest))) } };
function prepared(ctx = context) {
  let state = createAppAppointmentsQaState(ctx);
  state.paused = false; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < 180 && !state.serviceOperations.some(op => isAppAppointment(op) && op.status === "in_service"); i++) state = consultTick(state, 1, ctx);
  const op = state.serviceOperations.find(op => isAppAppointment(op) && op.status === "in_service")!;
  expect(op).toBeTruthy();
  const original = { name: op.displayName, appearance: structuredClone(op.appearance), location: structuredClone(op.location) };
  state.nextRoutineArrivalTick = state.facilityTick + 1;
  for (let i = 0; i < 3 && !state.serviceOperations.find(row => row.id === op.id)?.consultEncounterId; i++) state = consultTick(state, 1, ctx);
  const encounterId = state.serviceOperations.find(row => row.id === op.id)!.consultEncounterId!;
  expect(encounterId).toBeTruthy(); state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  return { state, id: op.id, encounterId, original };
}

describe("APP patient consult handoff", () => {
  it("finishes a previously staffed visit when the answered chart closes after a room interruption", () => {
    let { state, id, encounterId } = prepared(); state.serviceAppointmentsEnabled = false;
    state = consultCommand(state, { type: "OPEN_CHART", encounterId }, context); state = consultTick(state, 40, context);
    state = answerConsult(state, encounterId, context);
    const roomId = state.encounters[encounterId]!.consult!.roomInstanceId;
    state = consultCommand(state, { type: "SELL_ROOM", roomId,
      saleConfirmationToken: getRoomSalePreview(state, roomId, context)!.confirmationToken }, context);
    state = deserializeGameState(serializeGameState(state), context);
    state = consultCommand(state, { type: "CLOSE_CHART", encounterId }, context); state = consultTick(state, 1, context);
    expect(state.serviceOperations.find(op => op.id === id)!.status).toBe("completed");
    expect(state.encounters[encounterId]!.patientMovement?.kind).toBe("leaving_after_resolution");
    expect(state.serviceIncomeReceipts.filter(row => row.transactionKey.includes(id))).toHaveLength(1);
    state = deserializeGameState(serializeGameState(state), context); state = consultTick(state, 5, context);
    expect(state.serviceIncomeReceipts.filter(row => row.transactionKey.includes(id))).toHaveLength(1);
  });
  it("recovers an open consult after its room is sold, including reload while queued for a spare clinic", () => {
    let { state, id, encounterId } = prepared(); state.serviceAppointmentsEnabled = false;
    state = consultCommand(state, { type: "OPEN_CHART", encounterId }, context);
    state = consultTick(state, 40, context);
    const oldRoom = state.encounters[encounterId]!.consult!.roomInstanceId;
    state = consultCommand(state, { type: "SELL_ROOM", roomId: oldRoom,
      saleConfirmationToken: getRoomSalePreview(state, oldRoom, context)!.confirmationToken }, context);
    state = deserializeGameState(serializeGameState(state), context);
    for (let i = 0; i < 240 && state.serviceOperations.find(op => op.id === id)!.status !== "in_service"; i++) state = consultTick(state, 1, context);
    expect(state.serviceOperations.find(op => op.id === id)!.status).toBe("in_service");
    state = consultTick(state, 40, context);
    expect(state.encounters[encounterId]!.consult!.roomInstanceId).not.toBe(oldRoom);
    expect(state.employees.some(employee => employee.id === state.encounters[encounterId]!.consult!.providerEmployeeId)).toBe(true);
    expect(state.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: encounterId });
    state = answerConsult(state, encounterId, context);
    state = consultCommand(state, { type: "CLOSE_CHART", encounterId }, context);
    state = consultTick(state, 1, context);
    expect(state.serviceOperations.find(op => op.id === id)!.status).toBe("completed");
  });

  it("holds the same seated patient and APP, swaps the stool on open, and returns the APP on close", () => {
    let { state, id, encounterId, original } = prepared();
    const e = state.encounters[encounterId]!;
    const providerId = e.consult!.providerEmployeeId!;
    const room = state.rooms.find(room => room.id === e.consult!.roomInstanceId)!;
    const chair = getRoomCareAnchor(room, getRoomDefinition(room.roomDefinitionId, context)!, "clinician");
    expect(e.consult!.kind).toBe("app");
    expect(e.patientDisplayName).toBe(original.name); expect(e.patientAppearance).toEqual(original.appearance);
    expect(e.patientLocation).toEqual(original.location);
    const lists = getPatientLists(state);
    expect([...lists.active, ...lists.waiting].find(row => row.encounterId === encounterId)?.actionRequired).toBe(true);
    state = consultTick(state, 120, context);
    expect(state.serviceOperations.find(op => op.id === id)!.completedAtFacilityTick).toBeNull();
    expect(state.employees.find(row => row.id === providerId)!.location).toEqual(chair);
    expect(state.encounters[encounterId]!.patientLocation).toEqual(original.location);
    state = deserializeGameState(serializeGameState(state), context);
    expect(state.encounters[encounterId]!.consult!.closedAtFacilityTick).toBeNull();
    state = consultCommand(state, { type: "OPEN_CHART", encounterId }, context);
    expect(clinicFounderPath(state, state.encounters[encounterId]!, context).at(-1)).toEqual(chair);
    for (let i = 0; i < 100; i++) {
      state = consultTick(state, 1, context);
      if (JSON.stringify(state.environment.founderLocation) === JSON.stringify(chair)) expect(state.employees.find(row => row.id === providerId)!.location).not.toEqual(chair);
      if (JSON.stringify(state.environment.founderLocation) === JSON.stringify(chair)) break;
    }
    expect(state.environment.founderLocation).toEqual(chair);
    expect(state.employees.find(row => row.id === providerId)!.location).not.toEqual(chair);
    // Closing unanswered returns the APP but does not complete its visit.
    state = consultCommand(state, { type: "CLOSE_CHART", encounterId }, context);
    state = consultTick(state, 60, context);
    expect(state.encounters[encounterId]!.consult!.closedAtFacilityTick).toBeNull();
    expect(state.employees.find(row => row.id === providerId)!.location).toEqual(chair);
    state = consultCommand(state, { type: "OPEN_CHART", encounterId }, context);
    state = consultTick(state, 30, context);
    expect(state.serviceOperations.find(op => op.id === id)!.status).toBe("in_service");
    state = answerConsult(state, encounterId, context);
    state = consultTick(state, 5, context);
    expect(state.serviceOperations.find(op => op.id === id)!.completedAtFacilityTick).toBeNull();
    state = deserializeGameState(serializeGameState(state), context);
    state = consultCommand(state, { type: "CLOSE_CHART", encounterId }, context);
    expect(state.encounters[encounterId]!.consult!.closedAtFacilityTick).toBe(state.facilityTick);
    state = consultTick(state, 1, context);
    expect(state.serviceOperations.find(op => op.id === id)!.status).toBe("completed");
    expect(state.serviceIncomeReceipts.filter(row => row.transactionKey.includes(id))).toHaveLength(1);
    state = consultTick(state, 60, context);
    expect(state.employees.find(row => row.id === providerId)!.location).toEqual(chair);
  });

  it("binds actual training/room work once and preserves both new and legacy visits on reload", () => {
    let state = createAppAppointmentsQaState(context);
    state.paused = false; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    for (const employee of state.employees) if (employee.staffRoleDefinitionId === "staff.app") employee.trainingLevel = 5;
    for (const room of state.rooms) if (room.id.startsWith("room.app.")) room.upgradeLevel = 5;
    for (let i = 0; i < 150 && !state.serviceOperations.some(op => op.clinicWork?.binding); i++) state = consultTick(state, 1, context);
    const op = state.serviceOperations.find(op => op.clinicWork?.binding)!;
    expect(op.clinicWork!.binding!.durationMinutes).toBe(46);
    expect(op.frozenOperationPhases![0]!.durationMinutes).toBe(46);
    expect(deserializeGameState(serializeGameState(state), context).serviceOperations.find(row => row.id === op.id)!.clinicWork).toEqual(op.clinicWork);
    const legacy = structuredClone(state);
    const old = legacy.serviceOperations.find(row => row.id === op.id)!;
    delete old.clinicWork; old.frozenOperationPhases![0]!.durationMinutes = 30;
    expect(deserializeGameState(serializeGameState(legacy), context).serviceOperations.find(row => row.id === op.id)!.frozenOperationPhases![0]!.durationMinutes).toBe(30);
    const invalid = structuredClone(state);
    invalid.serviceOperations.find(row => row.id === op.id)!.clinicWork!.binding!.durationMinutes++;
    expect(() => deserializeGameState(serializeGameState(invalid), context)).toThrow("routine clinic work");
  });

  it("releases the APP on diagnostic feedback's implicit chart close, preserving the next clinical step", () => {
    const clinicalCase = fullContext.clinicalRelease.cases.find(c => c.routineEligible && !c.participant && !c.pediatricProfile &&
      c.requiredClinicalSetting === "clinic" && c.requiredCapabilityIds.length === 0 && c.decisionNodes[0]?.resultGateAfter)!;
    expect(clinicalCase).toBeTruthy();
    const ctx = { ...fullContext, clinicalRelease: { ...fullContext.clinicalRelease,
      cases: fullContext.clinicalRelease.cases.filter(c => c.tutorialEligible || c.id === clinicalCase.id) } };
    let { state, id, encounterId } = prepared(ctx);
    state = consultCommand(state, { type: "OPEN_CHART", encounterId }, ctx);
    state = consultTick(state, 30, ctx);
    const q = getCurrentQuestion(state, encounterId, ctx)!;
    state = consultCommand(state, { type: "SUBMIT_ANSWER", encounterId, decisionNodeId: q.node.id,
      answerChoiceId: q.node.answerChoices.find(choice => choice.isCorrect)!.id }, ctx);
    state = consultCommand(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", encounterId, decisionNodeId: q.node.id }, ctx);
    expect(state.openChartEncounterId).toBeNull();
    const pending = structuredClone(state.encounters[encounterId]!.pendingResult);
    expect(pending).toBeTruthy();
    const reopened = deserializeGameState(serializeGameState(state), ctx);
    const a = consultTick(state, 1, ctx), b = consultTick(reopened, 1, ctx);
    expect(JSON.parse(serializeGameState(a))).toEqual(JSON.parse(serializeGameState(b)));
    expect(a.serviceOperations.find(op => op.id === id)!.status).toBe("completed");
    expect(a.encounters[encounterId]!.pendingResult?.originatingNodeIndex).toBe(pending!.originatingNodeIndex);
    expect(a.encounters[encounterId]!.consult!.closedAtFacilityTick).not.toBeNull();
  });
});
