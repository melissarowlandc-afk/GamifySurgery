import { describe, expect, it } from "vitest";
import { describeRoomUpgradeBenefit, roomBuildPurpose } from "./buildModePresentation";

describe("staff-room break and daily benefit presentation", () => {
  it.each(["room.staff_break", "room.staff_gym"])("shows the shared care-first policy for %s", room => {
    const text = roomBuildPurpose(room);
    expect(text).toContain("below 90 morale");
    expect(text).toContain("15-minute");
    expect(text).toContain("+5 morale");
    expect(text).toContain("480-minute");
    expect(text).toContain("90-99 morale");
    expect(text).toContain("960 minutes");
    expect(text).toContain("at 100 staff skip breaks");
    expect(text).toContain("Care interrupts");
    expect(text).toContain("best operational Break Room or gym");
  });

  it.each(["room.staff_break", "room.staff_gym"])("shows total break/daily rewards at every tier of %s", room => {
    for (const level of [1, 2, 3, 4, 5]) {
      const benefit = describeRoomUpgradeBenefit({ roomDefinitionId: room, upgradeLevel: level, maxUpgradeLevel: 5, upkeepPerLevel: 0 })!;
      expect(benefit.currentLabel).toContain(`+${5 + 2 * (level - 1)} morale per completed break`);
      expect(benefit.currentLabel).toContain(`+${level} daily morale`);
      expect(benefit.note).toContain("Care interrupts");
      expect(benefit.perUpgradeLabel).toContain("+1 daily morale");
    }
  });
});
