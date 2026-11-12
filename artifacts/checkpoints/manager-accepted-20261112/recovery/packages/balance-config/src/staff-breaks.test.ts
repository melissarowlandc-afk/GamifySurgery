import { describe, expect, it } from "vitest";
import {
  LEGACY_GYM_BREAK_MORALE_GAIN, LEGACY_STAFF_BREAK_DURATION_MINUTES,
  STAFF_BREAK_POLICY,
} from "./staff-breaks";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";
import { LEVEL_FIVE_SUPPORT_TUNING } from "./level-five-support";
import { prototypeBalanceReleaseSchema } from "./schema";
import { getRoomUpgradeLevelBenefit, getRoomUpgradePerPurchaseLabel } from "./room-upgrades";

describe("editorial staff welfare balance", () => {
  it("uses one shorter shared break policy and retains legacy task contracts", () => {
    expect(STAFF_BREAK_POLICY).toEqual({ durationMinutes: 15, cooldownMinutes: 480, highMoraleThreshold: 90, highMoraleCooldownMultiplier: 2, moraleGain: 5, dailyMoraleGain: 1, dailyMoraleGainPerUpgrade: 1 });
    expect(PROTOTYPE_BALANCE_RELEASE.environment.levelThreeSupport).toMatchObject({
      breakDurationMinutes: 15, breakCooldownMinutes: 480, breakHighMoraleThreshold: 90, breakHighMoraleCooldownMultiplier: 2, breakMoraleGain: 5,
      staffRoomMoraleBonusPerDay: 1, staffRoomMoraleBonusPerUpgrade: 1,
    });
    expect(LEVEL_FIVE_SUPPORT_TUNING.gymMorale).toBe(5);
    expect(LEGACY_STAFF_BREAK_DURATION_MINUTES).toBe(30);
    expect(LEGACY_GYM_BREAK_MORALE_GAIN).toBe(5);
  });

  it.each(["room.staff_break", "room.staff_gym"])("describes both actual upgrade effects for %s", room => {
    expect(getRoomUpgradePerPurchaseLabel(room)).toContain("+1 daily morale from the best operational staff room");
    expect(getRoomUpgradeLevelBenefit(room, 5)?.totalDescription).toContain("+4 daily morale from the best operational staff room");
  });

  it("rejects invalid daily morale weights while allowing a disabled bonus", () => {
    const balance = JSON.parse(JSON.stringify(PROTOTYPE_BALANCE_RELEASE)) as typeof PROTOTYPE_BALANCE_RELEASE;
    balance.environment.levelThreeSupport.staffRoomMoraleBonusPerDay = -1;
    expect(prototypeBalanceReleaseSchema.safeParse(balance).success).toBe(false);
    balance.environment.levelThreeSupport.staffRoomMoraleBonusPerDay = 0;
    expect(prototypeBalanceReleaseSchema.safeParse(balance).success).toBe(true);
  });
});
