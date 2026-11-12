import { describe, expect, it } from "vitest";
import { LEVEL_FIVE_STAGE_DEFINITION } from "./level-five-progression";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";
import { getPrototypeAlertDefinition } from "./prototype-alerts";
import { facilityStageDefinitionSchema } from "./schema";

describe("Level 5 M6 binding goal data", () => {
  it("defines exactly the three editorial goals, no room, role, visit or successor gate", () => {
    expect(LEVEL_FIVE_STAGE_DEFINITION).toEqual({ level: 5, displayName: "Level 5 - Optimized ASC / Prestige",
      minimumClinicalXp: 2000, minimumCompletedEncounters: 0, satisfactionMustBeGreaterThan: 90,
      minimumAverageStaffMorale: 85, requiredRoomDefinitionIds: [], requiredStaffRoleIds: [], nextFacilityLevel: null });
    expect(facilityStageDefinitionSchema.parse(LEVEL_FIVE_STAGE_DEFINITION)).toEqual(LEVEL_FIVE_STAGE_DEFINITION);
  });

  it("opens the shipped cap to final Level 5 through the original Level 4 goals", () => {
    expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(5);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.stageDefinitions.find(stage => stage.level === 4)!.nextFacilityLevel).toBe(5);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.stageDefinitions.map(stage => stage.level)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.stageDefinitions.at(-1)).toEqual(LEVEL_FIVE_STAGE_DEFINITION);
  });

  it("delivers one informational Level 5 milestone without attention, ticker or booking", () => {
    expect(getPrototypeAlertDefinition("alert.progress.inspections-unlocked")).toMatchObject({
      category: "success", priority: "informational", titleTemplate: "Inspections unlocked",
      eligibleFacilityLevels: [5], oncePerEvent: true, showAttentionMarker: false,
      tickerEligible: false, clickAction: "none", persistent: false,
    });
  });
});
