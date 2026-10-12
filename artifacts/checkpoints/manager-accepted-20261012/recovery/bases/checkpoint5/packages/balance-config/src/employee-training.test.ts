import { describe, expect, it } from "vitest";
import { EMPLOYEE_TRAINING_PLACES, EMPLOYEE_TRAINING_ROLES, EMPLOYEE_TRAINING_SESSION_MINUTES,
  getEmployeeTrainingCost, getEmployeeTrainingLevelBenefit, getEmployeeTrainingPercent } from "./employee-training";

describe("approved employee training catalog", () => {
  it("retains every approved fixed per-transition price, independent of salaries", () => {
    const approved = {
      receptionist: [75, 150, 225, 300], imaging_technician: [75, 150, 225, 300],
      periop_nurse: [125, 250, 375, 500], endoscopy_nurse: [125, 250, 375, 500],
      endoscopist: [225, 450, 675, 900], phlebotomist: [100, 200, 300, 400],
      evs_worker: [75, 150, 225, 300], glp1_np: [150, 300, 450, 600],
      laboratory_technician: [125, 250, 375, 500], surgeon: [350, 700, 1050, 1400],
      or_nurse: [175, 350, 525, 700], pharmacist: [150, 300, 450, 600],
      repair_person: [100, 200, 300, 400], radiologist: [75, 150, 225, 300],
      app: [150, 300, 450, 600],
    };
    expect(EMPLOYEE_TRAINING_ROLES).toHaveLength(15);
    for (const [role, prices] of Object.entries(approved)) {
      expect([2, 3, 4, 5].map((level) => getEmployeeTrainingCost(`staff.${role}`, level))).toEqual(prices);
      expect(getEmployeeTrainingCost(`staff.${role}`, 1)).toBeNull();
      expect(getEmployeeTrainingCost(`staff.${role}`, 6)).toBeNull();
    }
    expect(getEmployeeTrainingCost("staff.unknown", 2)).toBeNull();
  });

  it("uses cumulative current-level percentages instead of summing past bonuses", () => {
    for (const role of EMPLOYEE_TRAINING_ROLES) {
      const percentages = ([1, 2, 3, 4, 5] as const).map((level) => getEmployeeTrainingPercent(role.staffRoleDefinitionId, level));
      expect(percentages).toEqual(role.staffRoleDefinitionId === "staff.pharmacist" ? [0, 5, 10, 15, 20] : [0, 10, 20, 30, 40]);
    }
    expect(EMPLOYEE_TRAINING_SESSION_MINUTES).toBe(60);
  });

  it("distinguishes total benefit from a single upgrade in the short descriptions", () => {
    expect(getEmployeeTrainingLevelBenefit("staff.periop_nurse", 3)).toMatchObject({
      percent: 20, incrementalPercent: 10, totalDescription: "Reduces prep time 20%", incrementalDescription: "Reduces prep time another 10%",
    });
    expect(getEmployeeTrainingLevelBenefit("staff.pharmacist", 5)).toMatchObject({ percent: 20, incrementalPercent: 5 });
    expect(([1, 2, 3, 4, 5] as const).map((level) => getEmployeeTrainingLevelBenefit("staff.glp1_np", level)?.consultFee)).toEqual([50, 55, 60, 65, 70]);
    expect(getEmployeeTrainingLevelBenefit("staff.glp1_np", 4)).toMatchObject({ totalDescription: "Adds $15 per consult", incrementalDescription: "Adds $5 per consult" });
  });

  it("uses the two approved north-facing stools and distinct navigation approaches", () => {
    expect(EMPLOYEE_TRAINING_PLACES.map((place) => ({ id: place.id, contact: place.floorContact, facing: place.facing }))).toEqual([
      { id: "stool1", contact: { x: 1.05, y: 1.7 }, facing: "north" },
      { id: "stool2", contact: { x: 1.95, y: 1.7 }, facing: "north" },
    ]);
    expect(EMPLOYEE_TRAINING_PLACES[0].approach).not.toEqual(EMPLOYEE_TRAINING_PLACES[1].approach);
  });
});
