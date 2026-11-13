import { describe, expect, it } from "vitest";
import { engCommand, engProcedureClinic, engTick, advanceEngProcedure, mechanicalProcedureCase, openEngConsult } from "../../../../packages/game-domain/tests/eng-i01-live-procedure.fixture";
import { createPrototypePlayerView } from "./viewModels";

describe("ENG-I01 existing chart and child procedure presentation", () => {
  it.each(["operation", "endoscopy"] as const)("keeps the child still on its exact preparation and recovery bed for %s", kind => {
    const c = mechanicalProcedureCase(kind, true);
    let {state, context, id} = engProcedureClinic(kind, c);
    const seen = new Set<number>();
    for (let tick = 0; tick < 700 && seen.size < 2; tick++) {
      const source = state.serviceOperations.find(op => op.id === id)!;
      const phase = source.frozenOperationPhases?.[source.phaseIndex];
      if (source.status === "in_service" && phase?.roomDefinitionId === "room.periop_recovery" && !seen.has(source.phaseIndex)) {
        const view = createPrototypePlayerView(state, null, false, null);
        expect(view.facility.serviceVisitors?.find(actor => actor.instanceId === id)).toMatchObject({
          appearance: {stillId: source.procedureContext!.pediatricFamilyContext!.childStillId},
          supportRole: "periop-bed-patient", supportId: `periop-bed:${source.periopBedReservation!.bedId}`, moving: false,
        });
        expect(view.facility.retailExternalActors?.filter(actor => actor.pediatricFamilyId === source.clinicVisit!.pediatricFamilyId)).toHaveLength(1);
        seen.add(source.phaseIndex);
      }
      state = engTick(state, context);
    }
    expect(seen.size).toBe(2);
  });

  it.each(["operation", "endoscopy"] as const)("keeps the frozen child visible on the %s table, with one named parent and an actionable chart", kind => {
    const c = mechanicalProcedureCase(kind, true);
    let {state, context, id} = engProcedureClinic(kind, c);
    state = advanceEngProcedure(state, context, id);
    const source = state.serviceOperations.find(op => op.id === id)!;
    const before = createPrototypePlayerView(state, null, false, null);
    expect(before.facility.endoscopyOccupancy?.serviceVisitorInstanceIds).not.toContain(id);
    expect(before.facility.endoscopyOccupancy?.roomInstanceIds).not.toContain(source.reservedRoomInstanceIds[0]);
    expect(before.facility.serviceVisitors?.find(actor => actor.instanceId === id)).toMatchObject({
      appearance: {stillId: source.procedureContext!.pediatricFamilyContext!.childStillId}, pose: "exam-table", moving: false,
    });
    const opened = openEngConsult(state, context, id); state = opened.state;
    const view = createPrototypePlayerView(state, opened.encounterId, false, null);
    expect(view.facility.endoscopyOccupancy?.patientInstanceIds).not.toContain(opened.encounterId);
    expect(view.facility.patients?.find(actor => actor.instanceId === opened.encounterId)).toMatchObject({
      appearance: {stillId: source.procedureContext!.pediatricFamilyContext!.childStillId}, pose: "exam-table", moving: false,
    });
    expect(view.chart?.patientDetails).toContain(kind === "operation" ? "Intra-op consult" : "Intra-endoscopy consult");
    expect(view.chart?.patientDetails).toContain(source.procedureContext!.pediatricFamilyContext!.parentName);
    expect(view.chart?.decisionSteps?.some(step => step.answerChoices.length > 0 && step.answerChoices.some(choice => !choice.disabled))).toBe(true);
    expect(view.facility.retailExternalActors?.filter(actor => actor.pediatricFamilyId === state.encounters[opened.encounterId]!.pediatricFamilyId)).toHaveLength(1);
  });

  it("shows hospital procedure records in the ordinary chart header", () => {
    const c = mechanicalProcedureCase("operation");
    c.requiredClinicalSetting = "clinic";
    c.procedureContext = {version: "procedure-context.v1", mode: "chart_review", familyId: "procedure.hospital_operation",
      recordKind: "anesthesia_record", recordCheckpoint: "Recorded recovery checkpoint"};
    let {state, context} = engProcedureClinic("operation", c);
    state = engCommand(state, {type: "ADMIT_PATIENT", encounterId: "eng.player.record", caseId: c.id,
      patientDisplayName: c.patientDisplayName, arrivalClass: "routine"}, context);
    expect(createPrototypePlayerView(state, "eng.player.record", false, null).chart?.patientDetails)
      .toBe("Hospital record review · Anesthesia record · Recorded recovery checkpoint");
  });
});
