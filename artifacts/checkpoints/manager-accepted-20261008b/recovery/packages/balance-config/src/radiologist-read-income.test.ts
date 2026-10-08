import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";
import { RADIOLOGIST_IN_HOUSE_INCOME_LINE_ID, RADIOLOGIST_OUTSIDE_INCOME_LINE_ID, RADIOLOGIST_READ_INCOME, getServiceIncomeLine } from "./service-income-catalog";

describe("radiologist read game economy", () => {
  it("makes one fully busy base reader modestly profitable after the entire room upkeep", () => {
    const radiologist = PROTOTYPE_BALANCE_RELEASE.facility.staffRoleDefinitions.find(role => role.id === "staff.radiologist")!;
    const room = PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find(room => room.id === "room.reading")!;
    const hourlyRevenue = 60 / RADIOLOGIST_READ_INCOME.outsideDurationMinutes * RADIOLOGIST_READ_INCOME.outsideFee;
    expect(hourlyRevenue).toBe(60);
    expect(hourlyRevenue - radiologist.salaryPerExpenseInterval - room.upkeepPerExpenseInterval).toBe(10);
    expect(RADIOLOGIST_READ_INCOME.inHouseFee).toBe(5);
  });
  it("keeps acquisition prices unchanged alongside the additional $5 local read fee", () => {
    expect(["income.ultrasound", "income.xray", "income.ct", "income.mri"].map(id => getServiceIncomeLine(id)?.fee)).toEqual([120, 90, 180, 240]);
    expect(getServiceIncomeLine(RADIOLOGIST_IN_HOUSE_INCOME_LINE_ID)?.fee).toBe(5);
  });
  it("shows both automatic services at the same facility level as radiologist hiring", () => {
    for (const id of [RADIOLOGIST_IN_HOUSE_INCOME_LINE_ID, RADIOLOGIST_OUTSIDE_INCOME_LINE_ID]) {
      expect(getServiceIncomeLine(id)).toMatchObject({ minimumFacilityLevel: 3, fee: 5, paymentStage: "resource_completion" });
      expect(getServiceIncomeLine(id)?.operation).toBeUndefined();
    }
    expect(getServiceIncomeLine("income.image_read")).toMatchObject({ fee: 40, operation: { phases: [{ durationMinutes: 30 }] } });
  });
});
