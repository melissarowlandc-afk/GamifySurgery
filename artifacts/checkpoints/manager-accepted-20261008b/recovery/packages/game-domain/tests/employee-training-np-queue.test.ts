import { describe, expect, it } from "vitest";
import { deserializeGameState, gameReducer, serializeGameState, type GameState } from "../src";
import { addTrainingEmployee, trainingFixture } from "./employee-training-fixtures";

const NP = "employee.training-np-queue.np";
const FILLERS = ["employee.training-np-queue.first", "employee.training-np-queue.second"];

function advance(state: GameState, throughTick: number): GameState {
  while (state.facilityTick < throughTick) state = gameReducer(state, {
    type: "ADVANCE_TICK", operationId: `np-full-queue.tick.${state.facilityTick + 1}`,
  });
  return state;
}

describe("queued NP consultation continuity", () => {
  it("finishes the current consult when both training places remain full past earlier payouts", () => {
    let state = trainingFixture();
    state.rooms.push(
      { id: "room.np-full-queue.suite", roomDefinitionId: "room.glp1_telehealth_suite", x: 29, y: 29,
        orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      ...[29, 30].map((y) => ({ id: `room.np-full-queue.hall.${y}`, roomDefinitionId: "room.hallway",
        x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
    );
    state.doors.push({ id: "door.np-full-queue.suite", roomId: "room.np-full-queue.suite",
      side: "east", offset: 1, exterior: false });
    for (const id of FILLERS) addTrainingEmployee(state, id);
    addTrainingEmployee(state, NP, "staff.glp1_np", "room.np-full-queue.suite");
    state.environment.glp1AutomationSlots = [{ suiteRoomInstanceId: "room.np-full-queue.suite",
      employeeId: NP, nextPayoutTick: 3 }];
    for (const id of [...FILLERS, NP]) {
      state = gameReducer(state, { type: "TRAIN_EMPLOYEE", employeeId: id, operationId: `np-full-queue.pay.${id}` });
      expect(state.operationReceipts[`np-full-queue.pay.${id}`]?.status).toBe("applied");
    }
    state = advance(state, 63);
    expect(state.employees.filter((employee) => employee.training?.stage === "training")).toHaveLength(2);
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(2);
    const nextPayout = state.environment.glp1AutomationSlots.find((slot) => slot.employeeId === NP)!.nextPayoutTick;
    expect(nextPayout).toBe(123);
    while (state.facilityTick < 100 && state.employees.filter((employee) =>
      FILLERS.includes(employee.id) && employee.training?.roomInstanceId).length === 2) {
      state = advance(state, state.facilityTick + 1);
    }
    expect(state.facilityTick).toBeGreaterThan(63);
    expect(state.facilityTick).toBeLessThan(nextPayout);
    expect(state.employees.find((employee) => employee.id === NP)!.training?.stage).toBe("queued");
    expect(state.employees.find((employee) => employee.id === NP)!.training?.earliestDepartureAtFacilityTick).toBe(nextPayout);
    state = deserializeGameState(serializeGameState(state));
    state = advance(state, nextPayout - 1);
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(2);
    expect(state.employees.find((employee) => employee.id === NP)!.training?.stage).toBe("queued");
    state = advance(state, nextPayout);
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(3);
    expect(state.serviceIncomeReceipts.filter((receipt) => receipt.incomeLineId === "income.glp1_telehealth"))
      .toHaveLength(3);
    expect(state.employees.find((employee) => employee.id === NP)!.training?.stage).toBe("walking_to_training");
  });
});
