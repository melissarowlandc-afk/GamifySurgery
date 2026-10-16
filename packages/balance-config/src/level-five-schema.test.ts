import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";
import { facilityLevelSchema, facilityStageDefinitionSchema, prototypeBalanceReleaseSchema,
  staffRoleDefinitionSchema } from "./schema";

function schemaFixture() {
  const balance = JSON.parse(JSON.stringify(PROTOTYPE_BALANCE_RELEASE)) as typeof PROTOTYPE_BALANCE_RELEASE;
  balance.facility.maximumPlayableLevel = 4;
  balance.facility.stageDefinitions = balance.facility.stageDefinitions.filter(stage => stage.level < 5);
  balance.facility.stageDefinitions.find(stage => stage.level === 4)!.nextFacilityLevel = null;
  const role = balance.facility.staffRoleDefinitions.find(role => role.id === "staff.glp1_np")!;
  balance.facility.staffRoleDefinitions = balance.facility.staffRoleDefinitions.filter(role => role.id !== "staff.executive");
  balance.facility.staffRoleDefinitions.push(staffRoleDefinitionSchema.parse({ ...role, id: "staff.executive",
    displayName: "Schema-only Executive", unlockFacilityLevel: 5, maximumEmployees: 1,
    requiredRoomDefinitionIds: ["room.executive_office"], capabilityIds: [], salaryPerExpenseInterval: 45,
    minimumSalaryPerExpenseInterval: 35, maximumSalaryPerExpenseInterval: 65 }));
  balance.facility.stageDefinitions.push(facilityStageDefinitionSchema.parse({ level: 5, displayName: "State QA",
    minimumClinicalXp: 2000, minimumCompletedEncounters: 0, satisfactionMustBeGreaterThan: 90,
    minimumAverageStaffMorale: 85, requiredRoomDefinitionIds: [], requiredStaffRoleIds: [], nextFacilityLevel: null }));
  return balance;
}

describe("dormant Level 5 balance schema", () => {
  it("accepts all five approved footprints, one Executive and a separate morale goal without activating the catalog", () => {
    const fixture = schemaFixture();
    expect(prototypeBalanceReleaseSchema.parse(JSON.parse(JSON.stringify(fixture)))).toEqual(fixture);
    expect(fixture.facility.maximumPlayableLevel).toBe(4);
    expect(fixture.facility.stageDefinitions.find(stage => stage.level === 4)!.nextFacilityLevel).toBeNull();
    fixture.facility.maximumPlayableLevel = 5;
    fixture.facility.stageDefinitions.find(stage => stage.level === 4)!.nextFacilityLevel = 5;
    expect(prototypeBalanceReleaseSchema.parse(fixture)).toEqual(fixture);
  });

  it("leaves the shipped release, original Level 4 goals and older stage shapes unchanged", () => {
    expect(prototypeBalanceReleaseSchema.parse(PROTOTYPE_BALANCE_RELEASE)).toEqual(PROTOTYPE_BALANCE_RELEASE);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(5);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.stageDefinitions.map(stage => stage.level)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.filter(room => room.unlockFacilityLevel === 5)).toHaveLength(5);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.staffRoleDefinitions.find(role => role.id === "staff.executive")?.unlockFacilityLevel).toBe(5);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.stageDefinitions.filter(stage => stage.level < 5).every(stage => stage.minimumAverageStaffMorale === undefined)).toBe(true);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.stageDefinitions.at(-1)?.minimumAverageStaffMorale).toBe(85);
  });

  it("rejects Level 6, missing cap stages, older-stage morale requirements and invalid goal values", () => {
    expect(facilityLevelSchema.safeParse(5).success).toBe(true);
    expect(facilityLevelSchema.safeParse(6).success).toBe(false);
    const fixture = schemaFixture(), stage = fixture.facility.stageDefinitions.at(-1)!;
    for (const change of [{ level: 6 }, { level: 4 }, { minimumAverageStaffMorale: -1 },
      { minimumAverageStaffMorale: 101 }, { minimumAverageStaffMorale: Number.NaN }, { nextFacilityLevel: 6 },
      { requiredCompletionWitnessIds: ["pediatric_visit_with_parent"] }]) {
      expect(facilityStageDefinitionSchema.safeParse({ ...stage, ...change }).success).toBe(false);
    }
    fixture.facility.maximumPlayableLevel = 5;
    fixture.facility.stageDefinitions.pop();
    expect(prototypeBalanceReleaseSchema.safeParse(fixture).success).toBe(false);
  });
});
