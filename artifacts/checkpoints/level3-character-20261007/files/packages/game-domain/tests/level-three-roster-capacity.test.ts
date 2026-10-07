import { describe, expect, it } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, staffStillEligibleEntries } from "../src";

describe("Level 3 staff presentation capacity", () => {
  it("never permits more hires than the unique eligible authored still pool", () => {
    for (const roleId of [
      "staff.surgeon",
      "staff.or_nurse",
      "staff.laboratory_technician",
      "staff.pharmacist",
      "staff.repair_person",
    ]) {
      const role = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.staffRoleDefinitions.find(
        (candidate) => candidate.id === roleId,
      )!;
      const uniqueEligibleStills = new Set(
        staffStillEligibleEntries(roleId).map((entry) => entry.stillId),
      );
      expect(role.maximumEmployees, roleId).toBeLessThanOrEqual(uniqueEligibleStills.size);
      expect(uniqueEligibleStills.size, roleId).toBeGreaterThan(0);
    }
  });
});
