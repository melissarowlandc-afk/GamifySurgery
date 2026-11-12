import { describe, expect, it } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, getPatientLists, procedureConsultKind, serializeGameState } from "../src";
import { answerConsult, consultCommand as command, consultTick as tick, preparedProcedureConsult } from "./founder-consults.fixture";

describe("intra-procedure scored consults", () => {
  it.each(["endoscopy", "operation"] as const)("holds %s until answer AND chart close, retaining its actor and reservations", kind => {
    let { state, id, encounterId, originalAppearance, originalName, ctx } = preparedProcedureConsult(kind);
    const e = state.encounters[encounterId]!;
    expect(e.patientAppearance).toEqual(originalAppearance); expect(e.patientDisplayName).toBe(originalName);
    expect(e.checkInStatus).toBe("checked_in"); expect(e.patientMovement).toBeNull();
    expect(state.serviceOperations.find(op => op.id === id)).toMatchObject({ actorKind: "encounter", actorId: encounterId });
    const lists = getPatientLists(state);
    expect([...lists.active, ...lists.waiting].find(row => row.encounterId === encounterId)?.actionRequired).toBe(true);
    const phase = e.consult!.phaseIndex, end = state.serviceOperations.find(op => op.id === id)!.phaseEndsAtFacilityTick!;
    state = tick(state, end - state.facilityTick + 10, ctx);
    expect(state.serviceOperations.find(op => op.id === id)).toMatchObject({ status: "in_service", phaseIndex: phase, completedAtFacilityTick: null });
    expect(state.serviceOperations.filter(op => !["completed", "cancelled", "leaving"].includes(op.status) &&
      (kind === "endoscopy" ? ["income.endoscopy", "income.advanced_endoscopy"].includes(op.incomeLineId) : op.incomeLineId === "income.ambulatory_operation")).length).toBeLessThanOrEqual(2);
    const held = serializeGameState(state);
    state = deserializeGameState(held, ctx);
    expect(JSON.parse(serializeGameState(state))).toEqual(JSON.parse(held));
    state = command(state, { type: "OPEN_CHART", encounterId }, ctx); state = tick(state, 40, ctx);
    expect(state.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: encounterId });
    const target = state.environment.founderActivity!.path.at(-1)!;
    expect(state.environment.founderLocation).toEqual(target);
    expect(state.employees.some(employee => employee.location.x === target.x && employee.location.y === target.y)).toBe(false);
    state = command(state, { type: "CLOSE_CHART", encounterId }, ctx); state = tick(state, 5, ctx);
    expect(state.encounters[encounterId]!.consult!.closedAtFacilityTick).toBeNull();
    expect(state.serviceOperations.find(op => op.id === id)!.phaseIndex).toBe(phase);
    state = command(state, { type: "OPEN_CHART", encounterId }, ctx); state = answerConsult(state, encounterId, ctx);
    state = tick(state, 10, ctx);
    expect(state.serviceOperations.find(op => op.id === id)!.phaseIndex).toBe(phase);
    const saved = serializeGameState(state); state = deserializeGameState(saved, ctx);
    expect(JSON.parse(serializeGameState(state))).toEqual(JSON.parse(saved));
    state = command(state, { type: "CLOSE_CHART", encounterId }, ctx);
    expect(state.encounters[encounterId]!.consult!.closedAtFacilityTick).toBe(state.facilityTick);
    state = deserializeGameState(serializeGameState(state), ctx);
    expect(state.encounters[encounterId]!.consult!.closedAtFacilityTick).not.toBeNull();
    for (let i = 0; i < 300 && state.serviceOperations.find(op => op.id === id)!.completedAtFacilityTick === null; i++) state = tick(state, 1, ctx);
    expect(state.serviceOperations.find(op => op.id === id)!.completedAtFacilityTick).not.toBeNull();
    expect(state.serviceIncomeReceipts.filter(r => r.transactionKey.includes(id))).toHaveLength(1);
  });
  it("leaves an already-operating founder in the suite during opening and closing", () => {
    let { state, id, encounterId, ctx } = preparedProcedureConsult("endoscopy", true);
    state = command(state, { type: "OPEN_CHART", encounterId }, ctx);
    expect(state.environment.founderActivity).toMatchObject({ kind: "perform_service", targetId: id });
    state = answerConsult(state, encounterId, ctx); state = command(state, { type: "CLOSE_CHART", encounterId }, ctx);
    expect(state.environment.founderActivity).toMatchObject({ kind: "perform_service", targetId: id });
  });
  it("repairs an orphaned optional encounter link on the next tick", () => {
    let { state, id, encounterId } = preparedProcedureConsult(); delete state.encounters[encounterId]; state = tick(state);
    expect(state.serviceOperations.find(op => op.id === id)).toMatchObject({ actorKind: "visitor", actorId: id });
    expect(state.serviceOperations.find(op => op.id === id)!.consultEncounterId).toBeUndefined();
  });
  it("does not relabel pathology or recovery questions as intra-operative findings", () => {
    for (const c of PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(c => c.requiredClinicalSetting === "periop_recovery" || c.id.includes("gastric-malt"))) {
      expect(procedureConsultKind(c)).toBeNull();
    }
  });
});
