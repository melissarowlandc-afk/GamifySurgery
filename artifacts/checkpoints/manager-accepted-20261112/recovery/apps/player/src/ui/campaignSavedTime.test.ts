import { describe, expect, it } from "vitest";
import { campaignSavedTime } from "./campaignSavedTime";

describe("compact campaign saved time", () => {
  const now = Date.UTC(2026, 10, 2, 12);
  it.each([
    [0, "Saved just now"], [59_999, "Saved just now"], [60_000, "Saved 1 min ago"],
    [59 * 60_000, "Saved 59 min ago"], [60 * 60_000, "Saved 1 hr ago"],
    [24 * 60 * 60_000, "Saved yesterday"], [3 * 24 * 60 * 60_000, "Saved 3 days ago"],
  ])("shows a short label for %s ms without changing any save ordering", (age, expected) => {
    expect(campaignSavedTime(now - Number(age), now)).toBe(expected);
  });
  it("tolerates an unavailable date and a server time ahead of this device", () => {
    expect(campaignSavedTime(NaN, now)).toBe("Saved time unavailable");
    expect(campaignSavedTime(Infinity, now)).toBe("Saved time unavailable");
    expect(campaignSavedTime(now + 60_000, now)).toBe("Saved just now");
  });
});
