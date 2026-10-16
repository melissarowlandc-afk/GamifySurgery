import { describe, expect, it } from "vitest";
import { creditRadiologistRead, deserializeGameState, serializeGameState } from "../src";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../tests/fixtures/level-five-state";

describe("inspection receipt IDs follow the runtime transaction contract", () => {
  it("preserves a real writer's composed ID longer than an entity ID, and observes it once", () => {
    const context = createLevelFiveStateQaContext(), state = createLevelFiveStateQaState("inspection-running", context);
    // Legal component IDs can produce a transaction ID longer than 120 chars.
    // The actual income writer and inspection hook, rather than invented
    // counters/receipt rows, produce this isolated reader regression.
    // Actual 147-character receipt observed at minute 1444 in the M8 probe
    // (the writer appends its sequence to this real diagnostic transaction key).
    const transactionKey = "income.diagnostic-read.diagnostic.encounter.auto.5.20.node.peripheral-arterial-disease.grocery-trip.1.resting_abi_3.diagnostic.1.interpretation";
    creditRadiologistRead(state, "in_house", transactionKey, state.employees[0]!.id, 5, context);
    const receipt = state.serviceIncomeReceipts.at(-1)!;
    expect(receipt.id.length).toBeGreaterThan(120);
    creditRadiologistRead(state, "in_house", transactionKey, state.employees[0]!.id, 5, context);
    expect(state.levelFive!.inspection.run!.accumulators.observedReceiptIds).toEqual([receipt.id]);
    expect(state.levelFive!.inspection.run!.accumulators.operatingGrossCents).toBe(500);
    const restored = deserializeGameState(serializeGameState(state), context);
    expect(restored.levelFive).toEqual(state.levelFive);
    expect(restored.serviceIncomeReceipts).toEqual(state.serviceIncomeReceipts);
    expect(restored.cashCents).toBe(state.cashCents);
  });

  it.each(["duplicate", "empty", "non-string"] as const)("still rejects %s receipt evidence", kind => {
    const context = createLevelFiveStateQaContext(), state = createLevelFiveStateQaState("inspection-running", context);
    const value = JSON.parse(serializeGameState(state));
    value.levelFive.inspection.run.accumulators.observedReceiptIds = kind === "duplicate" ? ["receipt.valid", "receipt.valid"] : kind === "empty" ? [""] : [1];
    expect(() => deserializeGameState(JSON.stringify(value), context)).toThrow(/invalid or duplicate evidence IDs/);
  });
});
