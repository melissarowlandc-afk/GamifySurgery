import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";
import { getServiceIncomeLine } from "./service-income-catalog";

const roomRates = [
  ["front_desk", 1, 0], ["hallway", 0, 0], ["examination", 2, 0],
  ["bathroom", 1, 0], ["waiting", 1, 0], ["xray", 4, 1],
  ["minor_procedure", 4, 1], ["ultrasound", 8, 1], ["ct", 8, 1],
  ["phlebotomy", 2, 1], ["evs_closet", 1, 0], ["endoscopy", 12, 2],
  ["periop_recovery", 3, 0], ["training", 1, 0], ["coffee_kiosk", 1, 0],
  ["glp1_telehealth_suite", 2, 1], ["ambulatory_or", 12, 2], ["laboratory", 4, 1],
  ["pharmacy", 2, 1], ["maintenance_workshop", 1, 0], ["staff_break", 1, 0],
  ["surgeon_office", 1, 0], ["vending", 1, 0], ["reading", 6, 0],
] as const;
const salaryRates = [
  ["receptionist", 10, 6, 22], ["imaging_technician", 18, 12, 34],
  ["periop_nurse", 20, 14, 40], ["endoscopy_nurse", 24, 16, 46],
  ["endoscopist", 40, 28, 76], ["phlebotomist", 18, 12, 34],
  ["evs_worker", 12, 8, 26], ["glp1_np", 30, 22, 54],
  ["laboratory_technician", 20, 12, 42], ["surgeon", 50, 32, 104],
  ["or_nurse", 26, 16, 52], ["pharmacist", 24, 16, 50],
  ["repair_person", 16, 10, 34], ["radiologist", 18, 12, 34],
] as const;

describe("owner-approved room economy option B", () => {
  it.each(roomRates)("uses the exact base/tier hourly upkeep for %s", (id, base, tier) => {
    expect(PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find((room) => room.id === `room.${id}`))
      .toMatchObject({ upkeepPerExpenseInterval: base, upkeepPerUpgradeLevel: tier });
  });
  it.each(salaryRates)("shifts %s salary and bounds while retaining negotiation steps", (id, base, min, max) => {
    expect(PROTOTYPE_BALANCE_RELEASE.facility.staffRoleDefinitions.find((role) => role.id === `staff.${id}`))
      .toMatchObject({ salaryPerExpenseInterval: base, minimumSalaryPerExpenseInterval: min,
        maximumSalaryPerExpenseInterval: max, salaryAdjustmentStep: 2, moralePerSalaryStep: 5 });
  });
  it("changes the three approved fees and keeps the existing emergency consultation", () => {
    expect(["income.ambulatory_operation", "income.ambulatory_operation_extended", "income.pharmacy_pickup"]
      .map((id) => getServiceIncomeLine(id)?.fee)).toEqual([1300, 1900, 70]);
    expect(PROTOTYPE_BALANCE_RELEASE.emergencyGlp1).toMatchObject({ payment: 50, cooldownMinutes: 60 });
    expect(getServiceIncomeLine("income.endoscopy")).toMatchObject({ fee: 450, scheduledVisitorFee: 600 });
    expect(getServiceIncomeLine("income.glp1_telehealth")?.fee).toBe(50);
  });
});
