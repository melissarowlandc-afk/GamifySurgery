import { createLevelThreeReadyQaState } from "../../../tests/fixtures/level-four-progression";
import { describe, expect, it } from "vitest";
import {
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  deserializeGameState,
  getDisplayedClinicSatisfaction,
  getFacilityProgressionStatus,
  getRoomDefinition,
  getRoomNavigationAnchor,
  getStaffRoleDefinition,
  serializeGameState,
  type EmployeeState,
  type GameState,
  type ServiceOperationState,
} from "../src";

const readyCampaign = createLevelThreeReadyQaState;

describe("condensed Level 3 goals", () => {
  it("completes the unchanged Level 3 checklist without a lab, lab technician, OR, or OR nurse remaining", () => {
    const state = readyCampaign();
    const progression = getFacilityProgressionStatus(state);
    expect(progression.requirements.map((requirement) => requirement.id)).toEqual([
      "progression.clinical_xp",
      "progression.satisfaction",
      "progression.staff.staff.pharmacist",
      "progression.ambulatory_operation_completion",
    ]);
    expect(getDisplayedClinicSatisfaction(state)).toBeGreaterThan(90);
    expect(progression.requirements.filter((requirement) => !requirement.met)).toEqual([]);
    expect(progression).toMatchObject({ eligible: true, nextFacilityLevel: 4, maximumPlayableLevel: 4 });
  });

  it("preserves the XP, strict satisfaction, and operational pharmacist requirements", () => {
    const state = readyCampaign();
    state.clinicalXp = 499;
    Object.values(state.encounters).forEach(encounter => { encounter.finalPatientSatisfaction = 90; });
    state.employees = state.employees.filter((employee) => employee.staffRoleDefinitionId !== "staff.pharmacist");
    expect(getFacilityProgressionStatus(state).requirements.filter((requirement) => !requirement.met).map((requirement) => requirement.id)).toEqual([
      "progression.clinical_xp", "progression.satisfaction", "progression.staff.staff.pharmacist",
    ]);
  });

  it("retains existing completion, current XP, encounters, and learning histories after save/reload", () => {
    const state = readyCampaign();
    const restored = deserializeGameState(serializeGameState(state));
    expect(getFacilityProgressionStatus(restored).requirements.every((requirement) => requirement.met)).toBe(true);
    expect(restored.clinicalXp).toBe(500);
    expect(restored.learningHistories).toEqual(state.learningHistories);
    expect(restored.encounters[TUTORIAL_ENCOUNTER_ID]!.frozenCase).toEqual(state.encounters[TUTORIAL_ENCOUNTER_ID]!.frozenCase);
    expect(restored.serviceIncomeReceipts).toEqual(state.serviceIncomeReceipts);
  });

  it.each(["ambulatoryOperationCompleted", "ambulatoryOperationReceipt"] as const)("retains retired %s credit after save/reload", (flag) => {
    const state = readyCampaign();
    state.serviceIncomeReceipts = [];
    state.retiredServiceHistory = {
      version: "retired-service-history.v1", retiredReceiptCount: 0, retiredOperationCount: 1,
      grossCents: 0, stockCostCents: 0, netCashDeltaCents: 0,
      endoscopyReceipt: false, endoscopyOperationCompleted: false,
      ambulatoryOperationReceipt: false, ambulatoryOperationCompleted: false,
      [flag]: true,
    };
    const restored = deserializeGameState(serializeGameState(state));
    expect(getFacilityProgressionStatus(restored).requirements.every((requirement) => requirement.met)).toBe(true);
  });

  it("does not count an operation still awaiting recovery as completion", () => {
    const state = readyCampaign();
    state.serviceIncomeReceipts = [];
    state.serviceOperations = [{
      id: "service.goal.pending-recovery", incomeLineId: "income.ambulatory_operation",
      status: "waiting_for_next_phase", completedAtFacilityTick: null, cancelledAtFacilityTick: null,
      phaseIndex: 1, actorKind: "visitor",
    } as ServiceOperationState];
    expect(getFacilityProgressionStatus(state).requirements.find((requirement) => requirement.id === "progression.ambulatory_operation_completion")).toMatchObject({ met: false, current: 0 });
  });
});
