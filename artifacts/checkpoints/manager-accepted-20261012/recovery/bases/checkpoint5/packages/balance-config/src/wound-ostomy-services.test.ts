import { describe, expect, it } from "vitest";
import { getServiceIncomeLine } from "./service-income-catalog";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";

describe("M6 wound/ostomy visit contracts", () => {
  it("binds routine care/support to one APP provider and covers its salary plus clinic upkeep", () => {
    let grossPerHour = 0;
    for (const [id, fee, phaseId] of [["income.wound_care", 60, "wound_care"], ["income.ostomy_support", 75, "support"]] as const) {
      const line = getServiceIncomeLine(id)!;
      expect(line).toMatchObject({ fee, operation: { visitorMode: "scheduled", arrivalCadenceMinutes: 180,
        phases: [{ id: phaseId, roomDefinitionId: "room.wound_ostomy", durationMinutes: 30,
          staffRoleDefinitionIds: [], providerRoleDefinitionIds: ["staff.app"] }] } });
      expect(line.operation!.phases.some(phase => phase.founderEligible)).toBe(false);
      grossPerHour += fee * 60 / line.operation!.arrivalCadenceMinutes!;
    }
    const salary = PROTOTYPE_BALANCE_RELEASE.facility.staffRoleDefinitions.find(row => row.id === "staff.app")!.salaryPerExpenseInterval;
    const upkeep = PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find(row => row.id === "room.wound_ostomy")!.upkeepPerExpenseInterval;
    expect([grossPerHour, salary, upkeep, grossPerHour - salary - upkeep]).toEqual([45, 30, 2, 13]);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(4);
  });

  it("keeps procedure and supply authorizations separate from ordinary visits", () => {
    expect(getServiceIncomeLine("income.wound_procedure")!.operation).toMatchObject({ visitorMode: "explicit_only", arrivalCadenceMinutes: null });
    expect(getServiceIncomeLine("income.wound_supply")).toMatchObject({ fee: 20, eligibleRouteIds: [],
      retail: { category: "authorized_order", stockCost: 10 } });
  });
});
