import { describe, expect, it } from "vitest";
import { createEarlyLevelFourEconomyState } from "../../../tools/economy-audit/level-four-simulation";
import { isAppAppointment } from "../src";
import { consultTick } from "./founder-consults.fixture";

describe("bounded independent clinic queues", () => {
  it("keeps MRI demand moving while multiple APP homes have patients waiting", () => {
    let state = createEarlyLevelFourEconomyState("clinic-queue.mri-fairness");
    let admittedWithClinicQueue = false;
    const mri = new Set<string>();
    for (let i = 0; i < 900; i++) {
      state = consultTick(state);
      for (const op of state.serviceOperations.filter(op => op.incomeLineId === "income.mri")) if (!mri.has(op.id)) {
        mri.add(op.id);
        if (state.serviceOperations.filter(other => isAppAppointment(other) && other.status === "waiting_for_resources").length >= 2) admittedWithClinicQueue = true;
      }
      for (const home of state.rooms) expect(state.serviceOperations.filter(op => isAppAppointment(op) && op.clinicVisit?.requestedRoomInstanceId === home.id &&
        !["leaving", "completed", "cancelled"].includes(op.status)).length).toBeLessThanOrEqual(2);
    }
    expect(mri.size).toBe(3);
    expect(admittedWithClinicQueue).toBe(true);
    expect(state.serviceIncomeReceipts.filter(row => row.incomeLineId === "income.mri").length).toBeGreaterThanOrEqual(2);
  });
});
