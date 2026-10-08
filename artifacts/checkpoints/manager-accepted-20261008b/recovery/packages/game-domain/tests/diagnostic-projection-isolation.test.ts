import { describe, expect, it } from "vitest";
import {
  forecastDiagnosticOrderPlan,
  planDiagnosticOrder,
  requestEmployeeTraining,
  type DiagnosticOrderPlan,
} from "../src";
import { manualLab, timingFixture } from "./diagnostic-timing-fixtures";

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function quote(fixture: ReturnType<typeof timingFixture>, serviceId: string): DiagnosticOrderPlan {
  const result = planDiagnosticOrder(fixture.state, {
    orderId: "projection.isolation", encounterId: fixture.encounter.id, serviceId,
  }, fixture.context);
  if (result.kind !== "planned") throw new Error(result.reason);
  return result.plan;
}

describe("diagnostic projection isolation", () => {
  it("retains the non-reading resource calendar and leaves the saved campaign untouched", () => {
    const fixture = timingFixture();
    fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    fixture.state.serviceOperations.push(manualLab(fixture.state), manualLab(fixture.state, "waiting_for_resources", "lab.successor"));
    const plan = quote(fixture, "service.basic_labs");
    const saved = JSON.stringify(fixture.state);
    const expected = forecastDiagnosticOrderPlan(fixture.state, plan, fixture.context);
    const frozen = forecastDiagnosticOrderPlan(deepFreeze(fixture.state), deepFreeze(plan), fixture.context);
    expect(frozen).toEqual(expected);
    expect(frozen.blockedPhaseIds).toEqual([]);
    expect(frozen.plan.phases.find((phase) => phase.kind === "laboratory_processing")?.forecast.startsAtTick).toBe(120);
    expect(frozen.plan.resultReady.forecastAtTick).toBe(135);
    expect(JSON.stringify(fixture.state)).toBe(saved);
  });

  it.each([false, true])("isolates reading travel and training projection (queued training: %s)", (training) => {
    const fixture = timingFixture();
    fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    fixture.addRoom("room.reading", "staff.radiologist", 2);
    fixture.addRoom("room.training");
    const plan = quote(fixture, "service.ultrasound");
    if (training) {
      const reader = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.radiologist")!;
      expect(requestEmployeeTraining(fixture.state, reader.id, fixture.context).applied).toBe(true);
    }
    const saved = JSON.stringify(fixture.state);
    const frozenPlan = JSON.stringify(plan);
    const expected = forecastDiagnosticOrderPlan(fixture.state, plan, fixture.context);
    const actual = forecastDiagnosticOrderPlan(deepFreeze(fixture.state), deepFreeze(plan), fixture.context);
    expect(actual).toEqual(expected);
    expect(actual.plan.phases.find((phase) => phase.kind === "interpretation")?.forecast.endsAtTick).toBeGreaterThan(0);
    expect(JSON.stringify(fixture.state)).toBe(saved);
    expect(JSON.stringify(plan)).toBe(frozenPlan);
  });
});
