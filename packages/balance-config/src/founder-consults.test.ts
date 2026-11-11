import { describe, expect, it } from "vitest";
import { FOUNDER_CONSULT_POLICY, getRoutineClinicWorkMinutes } from "./founder-consults";

describe("editorial routine clinic throughput", () => {
  it("gives basic clinics a queue and trained upgraded clinics spare capacity", () => {
    expect(getRoutineClinicWorkMinutes(1, 1)).toBe(95);
    expect(getRoutineClinicWorkMinutes(1, 1)).toBeGreaterThan(FOUNDER_CONSULT_POLICY.adultAppointmentCadenceMinutes);
    expect(getRoutineClinicWorkMinutes(5, 5)).toBe(46);
    expect(getRoutineClinicWorkMinutes(5, 5)).toBeLessThan(FOUNDER_CONSULT_POLICY.adultAppointmentCadenceMinutes);
    for (let training = 1; training < 5; training++) for (let room = 1; room < 5; room++) {
      expect(getRoutineClinicWorkMinutes(training + 1, room)).toBeLessThan(getRoutineClinicWorkMinutes(training, room));
      expect(getRoutineClinicWorkMinutes(training, room + 1)).toBeLessThan(getRoutineClinicWorkMinutes(training, room));
    }
    expect(getRoutineClinicWorkMinutes(0, 10)).toBe(getRoutineClinicWorkMinutes(1, 5));
  });
});
