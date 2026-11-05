import { describe, expect, it } from "vitest";
import { getServiceIncomeLine } from "./service-income-catalog";

describe("routine OR editorial demand balance", () => {
  it("uses the existing endoscopy cadence without changing operative fees or work", () => {
    const operation = getServiceIncomeLine("income.ambulatory_operation")!;
    const endoscopy = getServiceIncomeLine("income.endoscopy")!;
    expect(operation.operation?.visitorMode).toBe("scheduled");
    expect(operation.operation?.arrivalCadenceMinutes).toBe(endoscopy.operation?.arrivalCadenceMinutes);
    expect(operation).toMatchObject({ minimumFacilityLevel: 3, fee: 1300, eligibleRouteIds: [],
      operation: { phases: [{ durationMinutes: 120, staffRoleDefinitionIds: ["staff.or_nurse"], providerRoleDefinitionIds: ["staff.surgeon"] },
        { durationMinutes: 60, staffRoleDefinitionIds: ["staff.periop_nurse"] }] } });
    expect(getServiceIncomeLine("income.ambulatory_operation_extended")?.operation).toMatchObject({ visitorMode: "explicit_only", arrivalCadenceMinutes: null });
  });
});
