import { describe, expect, it } from "vitest";
import { deserializeGameState, gameReducer, getEmployeeTrainingPlaces, isEmployeeOperational, requestEmployeeTraining,
  serializeGameState, type GameState } from "../src";
import { addTrainingEmployee, advanceTrainingMinutes, reachTrainingStage, trainingFixture } from "./employee-training-fixtures";

const reload = (state: GameState): GameState => deserializeGameState(serializeGameState(state));

describe("saved employee training", () => {
  it("loads legacy employees without a training session and retains achieved levels and identities", () => {
    const state = trainingFixture();
    for (const level of [1, 2, 3, 4, 5] as const) addTrainingEmployee(state, `employee.legacy.${level}`).trainingLevel = level;
    const restored = reload(state);
    expect(restored.schemaVersion).toBe(state.schemaVersion);
    expect(restored.employees.map((employee) => [employee.id, employee.trainingLevel, employee.training])).toEqual(
      state.employees.map((employee) => [employee.id, employee.trainingLevel, undefined]),
    );
  });

  it("retains the paid FIFO queue and command receipts without charging again after reload", () => {
    let state = trainingFixture();
    for (const id of ["first", "second", "third"]) {
      addTrainingEmployee(state, id);
      state = gameReducer(state, { type: "TRAIN_EMPLOYEE", employeeId: id, operationId: `pay.${id}` });
    }
    state = reload(state);
    expect(state.cash).toBe(24_775);
    expect(state.employeeTrainingSequence).toBe(3);
    expect(state.employees.map((employee) => employee.training?.requestSequence)).toEqual([0, 1, 2]);
    state = gameReducer(state, { type: "TRAIN_EMPLOYEE", employeeId: "first", operationId: "pay.first" });
    state = gameReducer(state, { type: "TRAIN_EMPLOYEE", employeeId: "first", operationId: "pay-again.first" });
    expect(state.cash).toBe(24_775);
    advanceTrainingMinutes(state);
    expect(state.employees.map((employee) => employee.training?.stage)).toEqual(["walking_to_training", "walking_to_training", "queued"]);
    expect(isEmployeeOperational(state, "third")).toBe(true);
  });

  it("retains outgoing travel and its reserved stool, and does not start the hour until arrival", () => {
    let state = trainingFixture();
    addTrainingEmployee(state, "employee.walking");
    requestEmployeeTraining(state, "employee.walking");
    advanceTrainingMinutes(state);
    const before = JSON.parse(JSON.stringify(state.employees[0]!));
    state = reload(state);
    expect(state.employees[0]?.training).toEqual(before.training);
    expect(state.employees[0]?.path).toEqual(before.path);
    expect(state.employees[0]?.location).toEqual(before.location);
    expect(getEmployeeTrainingPlaces(state)[0]?.employeeId).toBe("employee.walking");
    expect(isEmployeeOperational(state, "employee.walking")).toBe(false);
    reachTrainingStage(state, "employee.walking", "training");
    expect(state.employees[0]?.training?.remainingMinutes).toBe(60);
    expect(state.cash).toBe(24_925);
  });

  it("resumes only the saved remaining minutes, and a saved return never repeats the level increase", () => {
    let state = trainingFixture();
    addTrainingEmployee(state, "employee.session");
    requestEmployeeTraining(state, "employee.session");
    reachTrainingStage(state, "employee.session", "training");
    advanceTrainingMinutes(state, 30);
    const startedAt = state.employees[0]?.training?.startedAtFacilityTick;
    state = reload(state);
    expect(state.employees[0]?.training).toMatchObject({ stage: "training", remainingMinutes: 30, startedAtFacilityTick: startedAt });
    advanceTrainingMinutes(state, 29);
    expect(state.employees[0]?.trainingLevel).toBe(1);
    advanceTrainingMinutes(state);
    expect(state.employees[0]?.trainingLevel).toBe(2);
    expect(state.employees[0]?.training?.stage).toBe("returning");
    expect(getEmployeeTrainingPlaces(state).every((place) => place.employeeId === null)).toBe(true);
    state = reload(state);
    expect(state.employees[0]?.training?.stage).toBe("returning");
    expect(isEmployeeOperational(state, "employee.session")).toBe(false);
    for (let tick = 0; state.employees[0]?.training && tick < 40; tick += 1) advanceTrainingMinutes(state);
    expect(state.employees[0]?.trainingLevel).toBe(2);
    expect(state.employees[0]?.training).toBeNull();
    expect(state.cash).toBe(24_925);
    state = reload(state);
    expect(state.employees[0]?.trainingLevel).toBe(2);
  });

  it("repairs duplicate restored place claims without erasing either paid session", () => {
    let state = trainingFixture();
    for (const id of ["employee.claim.first", "employee.claim.second"]) {
      addTrainingEmployee(state, id);
      requestEmployeeTraining(state, id);
    }
    reachTrainingStage(state, "employee.claim.first", "training");
    reachTrainingStage(state, "employee.claim.second", "training");
    advanceTrainingMinutes(state, 10);
    state.employees[1]!.training!.placeId = state.employees[0]!.training!.placeId;
    const minutes = state.employees[1]!.training!.remainingMinutes;
    state = reload(state);
    expect(state.employees[1]?.training).toMatchObject({ stage: "walking_to_training", roomInstanceId: null, placeId: null, remainingMinutes: minutes });
    expect(state.cash).toBe(24_850);
    advanceTrainingMinutes(state);
    expect(state.employees[0]?.training?.placeId).not.toBe(state.employees[1]?.training?.placeId);
    expect(getEmployeeTrainingPlaces(state).filter((place) => place.employeeId)).toHaveLength(2);
    expect(state.employees.every((employee) => employee.trainingLevel === 1)).toBe(true);
  });

  it("preserves paid started work through room sale, reload and replacement construction", () => {
    let state = trainingFixture();
    addTrainingEmployee(state, "employee.room-sale");
    requestEmployeeTraining(state, "employee.room-sale");
    reachTrainingStage(state, "employee.room-sale", "training");
    advanceTrainingMinutes(state, 20);
    state = gameReducer(state, { type: "SELL_ROOM", roomId: "room.test.training", operationId: "sell.training" });
    expect(state.operationReceipts["sell.training"]?.status).toBe("applied");
    state = reload(state);
    expect(state.employees[0]?.training).toMatchObject({ stage: "walking_to_training", roomInstanceId: null, remainingMinutes: 40 });
    advanceTrainingMinutes(state, 10);
    expect(state.employees[0]?.training?.remainingMinutes).toBe(40);
    expect(isEmployeeOperational(state, "employee.room-sale")).toBe(false);
    state = gameReducer(state, { type: "PLACE_ROOM", roomId: "room.test.training-replacement", roomDefinitionId: "room.training", x: 29, y: 24, operationId: "rebuild.training" });
    state = gameReducer(state, { type: "PLACE_DOOR", roomId: "room.test.training-replacement", doorId: "door.training-replacement", side: "east", offset: 1, exterior: false, operationId: "reconnect.training" });
    expect(state.operationReceipts["rebuild.training"]?.status).toBe("applied");
    expect(state.operationReceipts["reconnect.training"]?.status).toBe("applied");
    reachTrainingStage(state, "employee.room-sale", "training");
    expect(state.employees[0]?.training?.remainingMinutes).toBe(40);
    advanceTrainingMinutes(state, 40);
    expect(state.employees[0]?.trainingLevel).toBe(2);
  });

  it("refunds queued dismissal after reload once and preserves the other requests", () => {
    let state = trainingFixture();
    for (const id of ["employee.keep", "employee.refund"]) {
      addTrainingEmployee(state, id); requestEmployeeTraining(state, id);
    }
    state = reload(state);
    const command = { type: "FIRE_EMPLOYEE" as const, employeeId: "employee.refund", operationId: "fire.queued" };
    state = gameReducer(state, command);
    expect(state.cash).toBe(24_925);
    expect(state.employees.map((employee) => employee.id)).toEqual(["employee.keep"]);
    state = reload(state);
    state = gameReducer(state, command);
    expect(state.cash).toBe(24_925);
    expect(state.employees[0]?.training?.paidAmount).toBe(75);
  });

  it.each(["paidAmount", "remainingMinutes", "targetLevel"])("refuses malformed paid training %s rather than silently dropping it", (key) => {
    const state = trainingFixture();
    addTrainingEmployee(state, "employee.invalid"); requestEmployeeTraining(state, "employee.invalid");
    const raw = JSON.parse(serializeGameState(state));
    raw.employees[0].training[key] = key === "targetLevel" ? 999 : -1;
    expect(() => deserializeGameState(JSON.stringify(raw))).toThrow("saved employee training request is invalid");
  });
});
