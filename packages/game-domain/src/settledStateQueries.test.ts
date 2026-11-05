import { expect, it } from "vitest";
import { createInitialGameState } from "./reducer";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { settledStateQuery, withSettledStateQueries } from "./settledStateQueries";

it("reuses only the explicitly settled root and drops results at every mutation boundary", () => {
  const state = createInitialGameState(), predicted = structuredClone(state), key = Symbol("test");
  let calls = 0;
  const query = (root = state) => settledStateQuery(root, PROTOTYPE_DOMAIN_CONTEXT, key, "same", () => ++calls);
  withSettledStateQueries(state, () => {
    expect(query()).toBe(1); expect(query()).toBe(1);
    expect(query(predicted)).toBe(2); predicted.facilityTick++;
    expect(query(predicted)).toBe(3);
    withSettledStateQueries(predicted, () => { expect(query(predicted)).toBe(4); expect(query(predicted)).toBe(4); });
    expect(query()).toBe(1);
  });
  state.facilityTick++;
  withSettledStateQueries(state, () => expect(query()).toBe(5));
  expect(query()).toBe(6);
});

it("clears query scopes after exceptions and separates contexts, namespaces and null results", () => {
  const state = createInitialGameState(), context = { ...PROTOTYPE_DOMAIN_CONTEXT }, namespace = Symbol("null");
  let calls = 0;
  const query = (ctx = context) => settledStateQuery(state, ctx, namespace, "key", () => { calls++; return null; });
  expect(() => withSettledStateQueries(state, () => { query(); query(); query(PROTOTYPE_DOMAIN_CONTEXT); throw Error("exit"); })).toThrow("exit");
  expect(calls).toBe(2); query(); expect(calls).toBe(3);
});
