import { describe, expect, it } from "vitest";
import { formatFacilityDuration } from "./facilityDuration";

describe("facility duration labels", () => {
  it.each([
    [0, "0 min"], [1, "1 min"], [59, "59 min"], [60, "1 hour"],
    [90, "90 min"], [120, "2 hours"], [240, "4 hours"],
    [36, "36 min"], [54, "54 min"], [4.5, "4.5 min"],
    [4.275, "4.275 min"], [4.2749999999999995, "4.275 min"],
    [3.0000000000000004, "3 min"], [4.27549, "≈4.275 min"],
    [4.2755, "≈4.276 min"], [0.0001, "≈0 min"],
  ])("formats %s without changing the runtime quantity", (value, label) => {
    expect(formatFacilityDuration(value)).toBe(label);
  });
});
