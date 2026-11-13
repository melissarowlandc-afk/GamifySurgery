import {describe, expect, it} from "vitest";
import type {SyntheticClinicalCase} from "@gamify-surgery/clinical-content";
import {I07_SALVAGE, I07_SALVAGE_CASES} from "./eng-i01-frozen-acceptance.fixture";
import {INTRAOP_ANORECTAL_SALVAGE, INTRAOP_ANORECTAL_SALVAGE_CASES} from "./eng-i01-frozen-acceptance.fixture";
import {deserializeGameState, gameReducer, getCurrentCapabilities, serializeGameState} from "../src";
import {selectProcedureConsult} from "../src/founder-consults";
import {normalizeProcedureVisit, procedureFamilyKind} from "../src/procedure-context";
import {advanceEngProcedure, engProcedureClinic, engTick, openEngConsult} from "./eng-i01-live-procedure.fixture";

const rows = [
  {caseId: "case.intraop.anorectal-eua.crohn-checkpoints.20261112-salvage.v1", nodeId: "node.intraop.anorectal-eua.crohn-rectal-activity.20261112.v1", familyId: "procedure.anorectal_eua"},
  {caseId: "case.intraop.parathyroid.missing-gland-salvage.v1", nodeId: "node.intraop.parathyroid.sample-integrity.v1", familyId: "procedure.parathyroidectomy"},
  // Preserve the reviewed thyroid operation; it is not a parathyroidectomy alias.
  {caseId: "case.intraop.parathyroid.gland-preservation-salvage.v1", nodeId: "node.intraop.parathyroid.selective-salvage.v1", familyId: "procedure.thyroidectomy"},
] as const;
const endocrineEquipment = ["capability.endocrine_surgery", "capability.intraoperative_pth",
  "capability.intraoperative_ultrasound", "capability.intraoperative_frozen_pathology"];

/** Exact whole salvage cases, explicitly imported for a test release only.
 * Activation/context changes are metadata; no question, sibling or prose edit. */
function candidate(caseId: string): SyntheticClinicalCase {
  const original = [...INTRAOP_ANORECTAL_SALVAGE_CASES, ...I07_SALVAGE_CASES].find(c => c.id === caseId)!;
  const c = structuredClone(original);
  const endocrine = I07_SALVAGE.procedureContextProposals.find(p => p.caseId === caseId);
  const p = endocrine ?? INTRAOP_ANORECTAL_SALVAGE.procedureContextProposals.find(p => p.caseId === caseId)!.proposedContext;
  c.routineEligible = true;
  c.procedureContext = {version: "procedure-context.v1", mode: "live", kind: "operation", phase: "procedure",
    familyId: p.familyId, allowedIncomeLineIds: [...p.allowedIncomeLineIds], requiredCapabilityIds: [
      ...p.requiredCapabilityIds, ...(endocrine?.familyResourceGate.proposedAdditionalCapabilityIds ?? []),
    ]};
  return c;
}

describe("ENG-I01c exact EUA and endocrine salvage admission", () => {
  it.each(rows)("admits $caseId only during its exact compatible OR procedure", row => {
    const c = candidate(row.caseId);
    expect(c.procedureContext?.familyId).toBe(row.familyId);
    expect(procedureFamilyKind(row.familyId)).toBe("operation");
    let {state, context, id} = engProcedureClinic("operation", c);
    const op = () => state.serviceOperations.find(source => source.id === id)!;
    expect(op().procedureContext?.familyId).toBe(row.familyId);
    for (const capability of c.procedureContext!.mode === "live" ? c.procedureContext!.requiredCapabilityIds : [])
      expect(getCurrentCapabilities(state, context).has(capability), capability).toBe(true);
    expect(selectProcedureConsult(state, context, 1000, new Set())).toBeNull();
    const ordinary = gameReducer(state, {type: "ADMIT_PATIENT", operationId: "eng-i01c.unsourced", encounterId: "eng-i01c.unsourced",
      caseId: c.id, patientDisplayName: c.patientDisplayName, arrivalClass: "routine"}, context);
    expect(ordinary.operationReceipts["eng-i01c.unsourced"]!.status).toBe("rejected");
    state = advanceEngProcedure(state, context, id);
    const selection = selectProcedureConsult(state, context, 1000, new Set());
    expect(selection?.selection.clinicalCase).toEqual(c);
    for (const fault of ["room", "wrong_room", "outage", "family", "phase", "nurse", "provider", "capability"] as const) {
      const bad = structuredClone(state), changed = structuredClone(c), source = bad.serviceOperations.find(source => source.id === id)!;
      if (fault === "room") bad.rooms = bad.rooms.filter(room => room.id !== selection!.roomId);
      if (fault === "wrong_room") bad.rooms.find(room => room.id === selection!.roomId)!.roomDefinitionId = "room.endoscopy";
      if (fault === "outage") bad.rooms.find(room => room.id === selection!.roomId)!.maintenance = {
        status: "out_of_service", dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 0, completedUses: 0, appliedUseKeys: [],
      };
      if (fault === "family") source.procedureContext!.familyId = row.familyId === "procedure.parathyroidectomy" ? "procedure.thyroidectomy" : "procedure.parathyroidectomy";
      if (fault === "phase") source.status = "walking_between_phases";
      if (fault === "nurse") bad.employees = bad.employees.filter(e => e.staffRoleDefinitionId !== "staff.or_nurse");
      if (fault === "provider") source.providerReservation = null;
      if (fault === "capability" && changed.procedureContext?.mode === "live") changed.procedureContext.requiredCapabilityIds.push("capability.not_installed_control");
      const control = {...context, clinicalRelease: {...context.clinicalRelease, cases: context.clinicalRelease.cases.map(other => other.id === c.id ? changed : other)}};
      expect(selectProcedureConsult(bad, control, 1000, new Set()), fault).toBeNull();
      expect(source.consultEncounterId, fault).toBeUndefined();
      expect(source.phaseEndsAtFacilityTick, fault).toBe(op().phaseEndsAtFacilityTick);
    }
    const opened = openEngConsult(state, context, id), encounter = opened.state.encounters[opened.encounterId]!;
    expect(encounter.frozenCase.decisionNodes.map(n => [n.id, n.questionVariantId, n.primaryConceptId]))
      .toEqual(c.decisionNodes.map(n => [n.id, n.questionVariantId, n.primaryConceptId]));
    expect(encounter.frozenCase.decisionNodes.some(n => n.id === row.nodeId)).toBe(true);
    expect(encounter.consult).toMatchObject({kind: "operation", serviceOperationId: id, roomInstanceId: selection!.roomId});
    const loaded = deserializeGameState(serializeGameState(opened.state), context);
    expect(loaded.encounters[encounter.id]!.frozenCase).toEqual(encounter.frozenCase);
    expect(loaded.learningHistories).toEqual(opened.state.learningHistories);
    expect(loaded.serviceOperations.find(source => source.id === id)!.procedureContext).toEqual(op().procedureContext);
  });

  it.each(["absent", "disconnected", "outage"] as const)("does not supply endocrine equipment from an %s OR", fault => {
    const {state, context} = engProcedureClinic("operation", candidate(rows[1].caseId));
    const roomId = state.rooms.find(room => room.roomDefinitionId === "room.ambulatory_or")!.id;
    if (fault === "absent") state.rooms = state.rooms.filter(room => room.id !== roomId);
    if (fault === "disconnected") state.doors = state.doors.filter(door => door.roomId !== roomId);
    if (fault === "outage") state.rooms.find(room => room.id === roomId)!.maintenance = {
      status: "out_of_service", dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 0, completedUses: 0, appliedUseKeys: [],
    };
    for (const capability of endocrineEquipment) expect(getCurrentCapabilities(state, context).has(capability), capability).toBe(false);
  });

  it.each(rows)("adds no hold or economic change for an unavailable $caseId", row => {
    const c = candidate(row.caseId);
    let {state, context, id} = engProcedureClinic("operation", c);
    state = advanceEngProcedure(state, context, id);
    if (c.procedureContext?.mode !== "live") throw new Error("Expected a live test context");
    c.procedureContext.requiredCapabilityIds.push("capability.not_installed_control");
    state.nextRoutineArrivalTick = state.facilityTick;
    const controlContext = {...context, clinicalRelease: {...context.clinicalRelease, cases: context.clinicalRelease.cases.filter(other => other.id !== c.id)}};
    const actual = engTick(structuredClone(state), context, 450), control = engTick(structuredClone(state), controlContext, 450);
    actual.operationReceipts = {}; control.operationReceipts = {};
    expect(serializeGameState(actual)).toBe(serializeGameState(control));
    expect(actual.serviceOperations.find(source => source.id === id)!.completedAtFacilityTick).not.toBeNull();
    expect(actual.serviceIncomeReceipts.filter(receipt => receipt.transactionKey.includes(id))).toHaveLength(1);
  });

  it.each(rows)("reads the new $familyId with the unchanged optional saved visit format", row => {
    const c = candidate(row.caseId), value = {version: "procedure-visit.v1", kind: "operation", familyId: row.familyId, demographics: c.prototypeDemographics};
    expect(normalizeProcedureVisit(value, "income.ambulatory_operation")).toEqual(value);
    expect(() => normalizeProcedureVisit(value, "income.endoscopy")).toThrow(/procedure visit/);
  });
});
