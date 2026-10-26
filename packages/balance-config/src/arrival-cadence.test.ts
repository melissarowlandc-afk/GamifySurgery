import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";
import { prototypeBalanceReleaseSchema } from "./schema";

describe("Level 1 routine cadence", () => {
  it("keeps the shared and first-arrival defaults with an explicit Level 1 override", () => {
    expect(PROTOTYPE_BALANCE_RELEASE.arrivals).toMatchObject({
      firstArrivalMinimumMinutes: 35,
      firstArrivalMaximumMinutes: 75,
      routineBaseIntervalMinutes: 60,
      routineVariationMinutes: 15,
      levelOneRoutineCadence: { baseIntervalMinutes: 50, variationMinutes: 12 },
    });
  });

  it("accepts older balance releases without an override or a schema version change", () => {
    const legacy = { ...PROTOTYPE_BALANCE_RELEASE, arrivals: { ...PROTOTYPE_BALANCE_RELEASE.arrivals } };
    delete legacy.arrivals.levelOneRoutineCadence;
    const parsed = prototypeBalanceReleaseSchema.parse(legacy);
    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.arrivals.levelOneRoutineCadence).toBeUndefined();
  });

  it.each([
    { baseIntervalMinutes: 0, variationMinutes: 0 },
    { baseIntervalMinutes: 50.5, variationMinutes: 12 },
    { baseIntervalMinutes: 50, variationMinutes: -1 },
    { baseIntervalMinutes: 50, variationMinutes: 12.5 },
    { baseIntervalMinutes: 50, variationMinutes: 50 },
    { baseIntervalMinutes: 50, variationMinutes: 51 },
    { baseIntervalMinutes: 50 },
    { variationMinutes: 12 },
  ])("rejects an invalid or incomplete override: %j", (cadence) => {
    const candidate = { ...PROTOTYPE_BALANCE_RELEASE, arrivals: {
      ...PROTOTYPE_BALANCE_RELEASE.arrivals, levelOneRoutineCadence: cadence,
    } };
    expect(prototypeBalanceReleaseSchema.safeParse(candidate).success).toBe(false);
  });
});
