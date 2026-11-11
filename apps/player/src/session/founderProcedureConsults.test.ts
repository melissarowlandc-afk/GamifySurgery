import { describe, expect, it } from "vitest";
import { preparedProcedureConsult, consultCommand, consultTick } from "../../../../packages/game-domain/tests/founder-consults.fixture";
import { createPrototypePlayerView } from "./viewModels";

describe("procedure consult chart and physical presentation hooks", () => {
  it.each(["endoscopy", "operation"] as const)("shows an unopened ! %s chart, then a standing founder and covered patient in that suite", kind => {
    let { state, id, encounterId, ctx } = preparedProcedureConsult(kind);
    let view = createPrototypePlayerView(state, null, false, null);
    expect(view.patients.find(patient => patient.id === encounterId)).toMatchObject({ actionRequired: true,
      statusLabel: kind === "endoscopy" ? "Intra-endoscopy consult" : "Intra-op consult" });
    expect(view.facility.patients!.filter(patient => patient.instanceId === encounterId)).toHaveLength(1);
    expect(view.facility.serviceVisitors!.some(visitor => visitor.instanceId === id)).toBe(false);
    state = consultCommand(state, { type: "OPEN_CHART", encounterId }, ctx); state = consultTick(state, 40, ctx);
    view = createPrototypePlayerView(state, null, false, null);
    expect(view.facility.founder).toMatchObject({ moving: false, seated: false });
    expect(state.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: encounterId });
    expect(state.environment.founderLocation).toEqual(state.environment.founderActivity!.path.at(-1));
    expect(view.facility.endoscopyOccupancy?.roomInstanceIds).toContain(state.encounters[encounterId]!.consult!.roomInstanceId);
    expect(view.facility.endoscopyOccupancy?.patientInstanceIds).toContain(encounterId);
    expect(view.facility.patients!.find(patient => patient.instanceId === encounterId)?.location).toEqual(state.encounters[encounterId]!.patientLocation);
    state = consultTick(state, 60, ctx);
    expect(state.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: encounterId });
  });
});
