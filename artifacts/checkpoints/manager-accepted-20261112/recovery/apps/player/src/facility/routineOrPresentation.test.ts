import { describe, expect, it } from "vitest";
import { advanceRoutineOrUntil, routineOrFixture } from "../../../../packages/game-domain/tests/routine-or-demand.fixture";
import { createPrototypePlayerView } from "../session/viewModels";

describe("routine OR visitor presentation", () => {
  it("projects the routine patient in Periop, the occupied OR, recovery and departure", () => {
    const clinic = routineOrFixture();
    advanceRoutineOrUntil(clinic, state => state.serviceOperations.some(op => op.incomeLineId === "income.ambulatory_operation" && op.phaseIndex === 0 && op.status === "in_service"));
    const id = clinic.state.serviceOperations.find(op => op.incomeLineId === "income.ambulatory_operation")!.id;
    const view = () => createPrototypePlayerView(clinic.state, null, false, null).facility;
    const actor = () => view().serviceVisitors!.find(row => row.instanceId === id)!;
    expect(actor()).toMatchObject({ supportRole: "periop-bed-patient", moving: false });
    advanceRoutineOrUntil(clinic, state => state.serviceOperations.some(op => op.id === id && op.phaseIndex === 1 && op.status === "in_service"));
    const operation = clinic.state.serviceOperations.find(op => op.id === id)!;
    expect(actor().location).toEqual(operation.location);
    expect(view().endoscopyOccupancy?.serviceVisitorInstanceIds).toContain(id);
    expect(view().endoscopyOccupancy?.roomInstanceIds).toContain("qa.or");
    advanceRoutineOrUntil(clinic, state => state.serviceOperations.some(op => op.id === id && op.phaseIndex === 2 && op.status === "in_service"));
    expect(actor()).toMatchObject({ supportRole: "periop-bed-patient", moving: false });
    expect(view().endoscopyOccupancy?.serviceVisitorInstanceIds).not.toContain(id);
    advanceRoutineOrUntil(clinic, state => state.serviceOperations.some(op => op.id === id && op.status === "completed"));
    expect(view().serviceVisitors!.some(row => row.instanceId === id)).toBe(false);
  });
});
