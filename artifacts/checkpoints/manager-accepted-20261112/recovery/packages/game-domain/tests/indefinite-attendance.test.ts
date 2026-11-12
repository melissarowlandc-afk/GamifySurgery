import { expect, it } from "vitest";
import { gameReducer, planDiagnosticOrder } from "../src";
import { timingFixture } from "./diagnostic-timing-fixtures";

it("keeps the founder's indefinite encounter hold exact after reaching the chair", () => {
  const f = timingFixture(); f.state.facilityLevel = 2; f.state.facilityTick = 3828; f.state.paused = false;
  f.state.environment.founderActivity = { kind: "attend_encounter", targetId: f.encounter.id,
    path: [f.state.environment.founderLocation], pathIndex: 0, lastMovedAtFacilityTick: 3828, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
  const next = gameReducer(f.state, { type: "ADVANCE_TICK", operationId: "hold.tick" }, f.context);
  expect(next.facilityTick).toBe(3829);
  expect(next.environment.founderActivity?.kind).toBe("attend_encounter");
  expect(next.environment.founderActivity?.workMinutesRemaining).toBe(Number.MAX_SAFE_INTEGER);
});

it.each([Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER - 3828])(
  "never schedules a legacy indefinite hold of %s minutes as finite biopsy work", remaining => {
    const f = timingFixture(); f.state.facilityLevel = 2; f.state.facilityTick = 3828;
    f.addRoom("room.minor_procedure");
    const services = ["service.anoscopy", "service.skin_excisional_biopsy", "service.cutaneous_lesion_biopsy", "service.nipple_areolar_biopsy"];
    for (const serviceId of services) {
      const request = { orderId: `numeric.${serviceId}`, encounterId: f.encounter.id, serviceId };
      const control = planDiagnosticOrder(f.state, request, f.context);
      f.state.environment.founderActivity = { kind: "attend_encounter", targetId: "other.chart",
        path: [f.state.environment.founderLocation], pathIndex: 0, lastMovedAtFacilityTick: 3828, workMinutesRemaining: remaining };
      const result = planDiagnosticOrder(f.state, request, f.context);
      expect(result).toEqual(control);
      expect(result.kind).toBe("planned");
      if (result.kind !== "planned") throw new Error(result.reason);
      for (const phase of result.plan.phases) {
        expect(Number.isSafeInteger(phase.forecast.startsAtTick)).toBe(true);
        expect(Number.isSafeInteger(phase.forecast.endsAtTick)).toBe(true);
        expect(phase.forecast.endsAtTick).toBeLessThan(5000);
      }
      f.state.environment.founderActivity = null;
    }
  });
