import {describe, expect, it} from "vitest";
import type {SyntheticClinicalCase} from "@gamify-surgery/clinical-content";
import {INTRAOP_BILIARY_CASES} from "./eng-i01-frozen-acceptance.fixture";
import {ASC_ACCESS_INTRAOP_CASES} from "./eng-i01-frozen-acceptance.fixture";
import {ENDOSCOPIC_INJURY_CASES} from "./eng-i01-frozen-acceptance.fixture";
import {I15_CASES} from "./eng-i01-frozen-acceptance.fixture";
import {deserializeGameState, gameReducer, getCurrentCapabilities, serializeGameState} from "../src";
import {selectProcedureConsult} from "../src/founder-consults";
import {PROCEDURE_ROOM_CAPABILITIES} from "../src/procedure-room-capabilities";
import {normalizeProcedureVisit, procedureFamilyKind} from "../src/procedure-context";
import {advanceEngProcedure, engProcedureClinic, engTick, openEngConsult} from "./eng-i01-live-procedure.fixture";

// Explicit authoring imports are test-only. No default/manifest acceptance or
// question edits: each row retains its whole authored case and scored siblings.
const rows = [
  {nodeId: "node.intraop.asc-access.anterior-port-course.20261112.v1", familyId: "procedure.central_venous_port_insertion", required: ["capability.fluoroscopy"]},
  {nodeId: "node.intraop.biliary-safety.major-injury-transfer.20261112.v1", familyId: "procedure.laparoscopic_cholecystectomy", required: ["capability.fluoroscopy", "capability.intraoperative_cholangiography"]},
  {nodeId: "node.intraop.biliary-safety.stone-clearance-route.20261112.v1", familyId: "procedure.laparoscopic_cholecystectomy", required: ["capability.fluoroscopy", "capability.intraoperative_cholangiography", "capability.transcystic_exploration"]},
  {nodeId: "node.intraop.biliary-safety.unexplained-bile.20261112.v1", familyId: "procedure.laparoscopic_cholecystectomy", required: ["capability.fluoroscopy", "capability.intraoperative_cholangiography"]},
  {nodeId: "node.intraop.endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1", familyId: "procedure.colonoscopy_polypectomy", required: ["capability.endoscopic_closure", "capability.endoscopic_rescue"]},
  {nodeId: "node.intraop.endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1", familyId: "procedure.egd", required: ["capability.endoscopic_closure", "capability.endoscopic_rescue"]},
  {nodeId: "node.intraop.endoscopic-perforation-and-injury.postclip-tension-rescue.v1", familyId: "procedure.colonoscopy_polypectomy", required: ["capability.endoscopic_closure", "capability.endoscopic_rescue"]},
  {nodeId: "node.intraop.suspicious-polyps.deep-pattern-before-resection.20261112.v1", familyId: "procedure.colonoscopy_polypectomy", required: ["capability.chromoendoscopy"]},
] as const;
const authored = [...INTRAOP_BILIARY_CASES, ...ASC_ACCESS_INTRAOP_CASES, ...ENDOSCOPIC_INJURY_CASES, ...I15_CASES];
function candidate(row: typeof rows[number]): SyntheticClinicalCase {
  const original = authored.find(c => c.decisionNodes.some(n => n.id === row.nodeId));
  if (!original) throw new Error(`Missing exact skipped node ${row.nodeId}`);
  const c = structuredClone(original);
  const kind = procedureFamilyKind(row.familyId)!;
  c.routineEligible = true;
  c.procedureContext = {version: "procedure-context.v1", mode: "live", familyId: row.familyId, kind,
    phase: "procedure", allowedIncomeLineIds: [kind === "operation" ? "income.ambulatory_operation" : "income.endoscopy"],
    requiredCapabilityIds: [...row.required]};
  return c;
}

describe("ENG-I01b standard installed procedural equipment", () => {
  it.each(rows)("admits the whole case for $nodeId only at its compatible live source", row => {
    const c = candidate(row), kind = procedureFamilyKind(row.familyId)!;
    let {state, context, id} = engProcedureClinic(kind, c);
    const source = () => state.serviceOperations.find(op => op.id === id)!;
    expect(source().procedureContext?.familyId).toBe(row.familyId);
    for (const capability of row.required) expect(getCurrentCapabilities(state, context).has(capability)).toBe(true);
    expect(selectProcedureConsult(state, context, 1000, new Set())).toBeNull();
    const ordinary = gameReducer(state, {type: "ADMIT_PATIENT", operationId: "eng-i01b.unsourced", encounterId: "eng-i01b.unsourced",
      caseId: c.id, patientDisplayName: c.patientDisplayName, arrivalClass: "routine"}, context);
    expect(ordinary.operationReceipts["eng-i01b.unsourced"]!.status).toBe("rejected");
    state = advanceEngProcedure(state, context, id);
    const chosen = selectProcedureConsult(state, context, 1000, new Set());
    expect(chosen?.selection.clinicalCase).toEqual(c);
    expect(chosen?.kind).toBe(kind);
    for (const fault of ["room", "outage", "family", "nurse", "capability"] as const) {
      const bad = structuredClone(state), changed = structuredClone(c), op = bad.serviceOperations.find(op => op.id === id)!;
      if (fault === "room") bad.rooms = bad.rooms.filter(room => !op.reservedRoomInstanceIds.includes(room.id));
      if (fault === "outage") bad.rooms.find(room => room.id === chosen!.roomId)!.maintenance = {
        status: "out_of_service", dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 0, completedUses: 0, appliedUseKeys: [],
      };
      if (fault === "family") op.procedureContext!.familyId = kind === "operation" ? "procedure.soft_tissue_excision" : "procedure.unsupported_control";
      if (fault === "nurse") bad.employees = bad.employees.filter(employee => employee.staffRoleDefinitionId !== (kind === "operation" ? "staff.or_nurse" : "staff.endoscopy_nurse"));
      if (fault === "capability" && changed.procedureContext?.mode === "live") changed.procedureContext.requiredCapabilityIds.push("capability.not_installed_control");
      const control = {...context, clinicalRelease: {...context.clinicalRelease, cases: context.clinicalRelease.cases.map(other => other.id === c.id ? changed : other)}};
      expect(selectProcedureConsult(bad, control, 1000, new Set()), fault).toBeNull();
      expect(op.consultEncounterId, fault).toBeUndefined();
      expect(op.quoteFee, fault).toBe(source().quoteFee);
    }
    const opened = openEngConsult(state, context, id);
    const encounter = opened.state.encounters[opened.encounterId]!;
    expect(encounter.frozenCase.decisionNodes.map(node => [node.id, node.questionVariantId, node.primaryConceptId]))
      .toEqual(c.decisionNodes.map(node => [node.id, node.questionVariantId, node.primaryConceptId]));
    expect(encounter.frozenCase.decisionNodes.some(node => node.id === row.nodeId)).toBe(true);
    expect(encounter.consult).toMatchObject({serviceOperationId: id, kind, roomInstanceId: chosen!.roomId});
    const loaded = deserializeGameState(serializeGameState(opened.state), context);
    expect(loaded.encounters[encounter.id]!.frozenCase).toEqual(encounter.frozenCase);
    expect(loaded.learningHistories).toEqual(opened.state.learningHistories);
    expect(loaded.serviceOperations.find(op => op.id === id)!.procedureContext).toEqual(source().procedureContext);
  });

  it.each(["operation", "endoscopy"] as const)("loses %s equipment when its room is absent, disconnected or out of service", kind => {
    const c = candidate(rows[kind === "operation" ? 0 : 4]);
    const {state, context} = engProcedureClinic(kind, c);
    const roomDefinitionId = kind === "operation" ? "room.ambulatory_or" : "room.endoscopy";
    const room = state.rooms.find(room => room.roomDefinitionId === roomDefinitionId)!;
    for (const fault of ["absent", "disconnected", "outage"] as const) {
      const bad = structuredClone(state);
      if (fault === "absent") bad.rooms = bad.rooms.filter(other => other.id !== room.id);
      if (fault === "disconnected") bad.doors = bad.doors.filter(door => door.roomId !== room.id);
      if (fault === "outage") bad.rooms.find(other => other.id === room.id)!.maintenance = {
        status: "out_of_service", dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 0, completedUses: 0, appliedUseKeys: [],
      };
      const capabilities = getCurrentCapabilities(bad, context);
      for (const capability of PROCEDURE_ROOM_CAPABILITIES[roomDefinitionId]!) expect(capabilities.has(capability), `${fault}: ${capability}`).toBe(false);
    }
  });

  it.each(["operation", "endoscopy"] as const)("does not hold or change %s income/timing when a candidate cannot be offered", kind => {
    const c = candidate(rows[kind === "operation" ? 0 : 4]);
    let {state, context, id} = engProcedureClinic(kind, c);
    state = advanceEngProcedure(state, context, id);
    if (c.procedureContext?.mode !== "live") throw new Error("Expected a live test context");
    c.procedureContext.requiredCapabilityIds.push("capability.not_installed_control");
    state.nextRoutineArrivalTick = state.facilityTick;
    const controlContext = {...context, clinicalRelease: {...context.clinicalRelease, cases: context.clinicalRelease.cases.filter(other => other.id !== c.id)}};
    const actual = engTick(structuredClone(state), context, 450), control = engTick(structuredClone(state), controlContext, 450);
    actual.operationReceipts = {}; control.operationReceipts = {};
    expect(serializeGameState(actual)).toBe(serializeGameState(control));
    expect(actual.serviceOperations.find(op => op.id === id)!.completedAtFacilityTick).not.toBeNull();
    expect(actual.serviceIncomeReceipts.filter(receipt => receipt.transactionKey.includes(id))).toHaveLength(1);
  });

  it("recognizes the authored port family in the unchanged optional save contract", () => {
    const value = {version: "procedure-visit.v1", familyId: "procedure.central_venous_port_insertion", kind: "operation",
      demographics: {ageYears: 47, sexLabel: "Female"}};
    expect(procedureFamilyKind(value.familyId)).toBe("operation");
    expect(normalizeProcedureVisit(value, "income.ambulatory_operation")).toEqual(value);
    expect(() => normalizeProcedureVisit(value, "income.endoscopy")).toThrow(/procedure visit/);
  });
});
