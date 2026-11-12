import { describe, expect, it } from "vitest";
import before from "../../../tests/fixtures/late-game-costs-before-20261111.json";
import { getRoomUpgradeCost } from "@gamify-surgery/balance-config";
import { deserializeGameState, gameReducer, getEmployeeTrainingQuote, serializeGameState } from "../src";
import { addTrainingEmployee, advanceTrainingMinutes, reachTrainingStage, trainingFixture } from "./employee-training-fixtures";

describe("future late-tier purchase costs with legacy ownership", () => {
  it("charges the new room quote once and rejects one cent short without changing ownership", () => {
    const opening = trainingFixture();
    const room = opening.rooms.find(r => r.id === "room.test.training")!;
    room.upgradeLevel = 4;
    const cost = getRoomUpgradeCost(room.roomDefinitionId, 5)!;
    opening.cashCents = Math.round(cost * 100) - 1; opening.cash = opening.cashCents / 100;
    const short = gameReducer(opening, { type: "UPGRADE_ROOM", roomId: room.id, operationId: "late.room.short" });
    expect(short.operationReceipts["late.room.short"]?.status).toBe("rejected");
    expect(short.cashCents).toBe(opening.cashCents);
    expect(short.rooms.find(r => r.id === room.id)!.upgradeLevel).toBe(4);
    opening.cashCents += 1; opening.cash = cost;
    const command = { type: "UPGRADE_ROOM", roomId: room.id, operationId: "late.room.paid" } as const;
    const bought = gameReducer(opening, command);
    expect(bought.operationReceipts[command.operationId]?.status).toBe("applied");
    expect(bought.cashCents).toBe(0);
    expect(bought.rooms.find(r => r.id === room.id)!.upgradeLevel).toBe(5);
    expect(gameReducer(bought, command).cashCents).toBe(0);
  });

  it("quotes and charges future training at the new tier5 price", () => {
    let state = trainingFixture();
    const employee = addTrainingEmployee(state, "late.future"); employee.trainingLevel = 4;
    const quote = getEmployeeTrainingQuote(state, employee.id);
    expect(quote).toMatchObject({ targetLevel: 5, cost: 420, canTrain: true });
    const cash = state.cashCents;
    const command = { type: "TRAIN_EMPLOYEE", employeeId: employee.id, operationId: "late.future.pay" } as const;
    state = gameReducer(state, command);
    expect(state.cashCents).toBe(cash - 42000);
    expect(state.employees.find(e => e.id === employee.id)!.training?.paidAmount).toBe(420);
    expect(gameReducer(state, command).cashCents).toBe(state.cashCents);
  });

  it("reopens already-owned tier5 rooms and employees without charging or reducing their tiers", () => {
    const state = trainingFixture();
    state.rooms.find(r => r.id === "room.test.training")!.upgradeLevel = 5;
    addTrainingEmployee(state, "late.owned").trainingLevel = 5;
    const loaded = deserializeGameState(serializeGameState(state));
    expect(loaded.cashCents).toBe(state.cashCents);
    expect(loaded.rooms.find(r => r.id === "room.test.training")!.upgradeLevel).toBe(5);
    expect(loaded.employees.find(e => e.id === "late.owned")!.trainingLevel).toBe(5);
  });

  it("finishes an old paid tier5 training request at its frozen payment without a top-up", () => {
    let state = trainingFixture();
    const employee = addTrainingEmployee(state, "late.legacy.paid"); employee.trainingLevel = 4;
    state = gameReducer(state, { type: "TRAIN_EMPLOYEE", employeeId: employee.id, operationId: "late.old.pay" });
    const paid = state.employees.find(e => e.id === employee.id)!;
    // Exact old serialized request shape, already paid before the balance pass.
    const oldPrice = before.training["staff.receptionist"][3]!;
    state.cashCents += Math.round((paid.training!.paidAmount - oldPrice) * 100); state.cash = state.cashCents / 100;
    paid.training!.paidAmount = oldPrice;
    const cash = state.cashCents;
    state = deserializeGameState(serializeGameState(state));
    expect(getEmployeeTrainingQuote(state, employee.id)).toMatchObject({ cost: oldPrice, targetLevel: 5 });
    reachTrainingStage(state, employee.id, "training");
    advanceTrainingMinutes(state, 60);
    expect(state.employees.find(e => e.id === employee.id)!.trainingLevel).toBe(5);
    expect(state.cashCents).toBe(cash);
    const loaded = deserializeGameState(serializeGameState(state));
    expect(loaded.employees.find(e => e.id === employee.id)!.trainingLevel).toBe(5);
  });

  it("refunds only the frozen old payment if queued tier5 training is dismissed after reload", () => {
    let state = trainingFixture();
    const employee = addTrainingEmployee(state, "late.legacy.refund"); employee.trainingLevel = 4;
    state = gameReducer(state, { type: "TRAIN_EMPLOYEE", employeeId: employee.id, operationId: "late.refund.pay" });
    const oldPrice = before.training["staff.receptionist"][3]!;
    const paid = state.employees.find(e => e.id === employee.id)!.training!;
    state.cashCents += Math.round((paid.paidAmount - oldPrice) * 100); state.cash = state.cashCents / 100;
    paid.paidAmount = oldPrice;
    state = deserializeGameState(serializeGameState(state));
    const cash = state.cashCents;
    state = gameReducer(state, { type: "FIRE_EMPLOYEE", employeeId: employee.id, operationId: "late.refund.fire" });
    expect(state.operationReceipts["late.refund.fire"]?.status).toBe("applied");
    expect(state.cashCents).toBe(cash + oldPrice * 100);
    expect(state.employees.some(e => e.id === employee.id)).toBe(false);
  });
});
