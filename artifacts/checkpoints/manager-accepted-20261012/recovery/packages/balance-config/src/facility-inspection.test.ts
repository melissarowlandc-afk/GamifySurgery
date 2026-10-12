import { describe, expect, it } from "vitest";
import { FACILITY_INSPECTION_RULES } from "./facility-inspection";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";

describe("editorial inspection contract", () => {
  it("retains the exact ten weights, five 10-hour days and qualifying sample", () => {
    expect(Object.values(FACILITY_INSPECTION_RULES.categoryWeights)).toEqual([10, 10, 10, 10, 10, 10, 10, 5, 5, 20]);
    expect(Object.values(FACILITY_INSPECTION_RULES.categoryWeights).reduce((a, b) => a + b, 0)).toBe(100);
    expect(FACILITY_INSPECTION_RULES.durationMinutes).toBe(3000);
    expect(FACILITY_INSPECTION_RULES.minimumQualifyingScoredPatients).toBe(20);
    expect(FACILITY_INSPECTION_RULES.targetOperatingMargin).toBe(0.05);
  });
  it("opens ordinary Level 5 and leaves its successor empty", () => {
    expect(PROTOTYPE_BALANCE_RELEASE.facility.maximumPlayableLevel).toBe(5);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.stageDefinitions.find(stage => stage.level === 4)?.nextFacilityLevel).toBe(5);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.stageDefinitions.find(stage => stage.level === 5)?.nextFacilityLevel).toBeNull();
  });
});
