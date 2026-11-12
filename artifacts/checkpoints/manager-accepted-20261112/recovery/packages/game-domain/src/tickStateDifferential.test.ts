import { afterEach, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { gameReducer } from "./reducer";
import { deserializeGameState } from "./persistence";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import type { GameCommand, GameState } from "./types";
import { createLevelFourIntegrationState, m9PumpChart } from "../../../tests/fixtures/level-four-integration";

const control = vi.hoisted(() => ({ legacy: false }));
vi.mock("./tickStateClone", async importOriginal => {
  const actual = await importOriginal<typeof import("./tickStateClone")>();
  return { ...actual, cloneTickState: (state: GameState): GameState => control.legacy
    ? JSON.parse(JSON.stringify(state)) as GameState : actual.cloneTickState(state) };
});
vi.mock("./facilityPathCache", async importOriginal => {
  const actual = await importOriginal<typeof import("./facilityPathCache")>();
  return { ...actual, cachedFacilityAdjacency: (...args: Parameters<typeof actual.cachedFacilityAdjacency>) =>
    control.legacy ? args[4]() : actual.cachedFacilityAdjacency(...args) };
});
vi.mock("./tickQueryCache", async importOriginal => {
  const actual = await importOriginal<typeof import("./tickQueryCache")>();
  return { ...actual, memoizeSnapshotQuery: <K, V>(query: (key: K) => V) =>
    control.legacy ? query : actual.memoizeSnapshotQuery(query) };
});
afterEach(() => { control.legacy = false; vi.restoreAllMocks(); });
const hostedTime = (ms: number) => process.env.CI ? ms * 10 : ms;

function differential(state: GameState, command: GameCommand): GameState {
  const input = JSON.stringify(state);
  control.legacy = true;
  let expected: GameState;
  try { expected = gameReducer(state, command, PROTOTYPE_DOMAIN_CONTEXT); }
  finally { control.legacy = false; }
  const actual = gameReducer(state, command, PROTOTYPE_DOMAIN_CONTEXT);
  expect(JSON.stringify(actual), `${command.operationId} at ${state.facilityTick}`).toBe(JSON.stringify(expected));
  expect(JSON.stringify(state), `immutable input ${command.operationId}`).toBe(input);
  expect(() => structuredClone(actual)).not.toThrow();
  return actual;
}

it("matches the previous clone for long Level 3 and Level 4 tick/action runs", () => {
  const legacy = readFileSync(new URL("../../../tests/fixtures/level-four-legacy-pre-m3.json", import.meta.url), "utf8");
  for (let state of [deserializeGameState(legacy), createLevelFourIntegrationState("tick-differential")]) {
    state = differential(state, { type: "SET_PAUSED", paused: false, operationId: "diff.play" });
    for (let i = 0; i < 360; i++) {
      if (i % 60 === 0) state = differential(state, { type: "SET_SIMULATION_SPEED", speed: [1, 2, 4][i / 60 % 3] as 1 | 2 | 4, operationId: `diff.speed.${i}` });
      state = differential(state, { type: "ADVANCE_TICK", advancedAtRealMs: state.createdAtRealMs + (state.facilityTick + 1) * 60_000, operationId: `diff.tick.${i}` });
      // Real chart commands, answers, reviews and frozen question progression.
      const prior = state;
      control.legacy = true;
      let expected: GameState;
      try { expected = m9PumpChart(prior); } finally { control.legacy = false; }
      state = m9PumpChart(prior);
      expect(JSON.stringify(state)).toBe(JSON.stringify(expected));
    }
  }
}, hostedTime(120_000));

it("matches the previous clone for retained Level 5 ticks and state transitions", () => {
  const raw = readFileSync(new URL("../../../tests/fixtures/level-five-economy-checkpoint-20261012.json", import.meta.url), "utf8");
  let state = deserializeGameState(raw);
  state = differential(state, { type: "SET_PAUSED", paused: false, operationId: "diff5.play" });
  for (let i = 0; i < 180; i++) {
    state = differential(state, { type: "ADVANCE_TICK", advancedAtRealMs: state.createdAtRealMs + (state.facilityTick + 1) * 60_000, operationId: `diff5.tick.${i}` });
    if (i % 30 === 0) {
      state = differential(state, { type: "SET_PAUSED", paused: true, operationId: `diff5.pause.${i}` });
      state = differential(state, { type: "ADVANCE_TICK", advancedAtRealMs: state.createdAtRealMs, operationId: `diff5.paused-tick.${i}` });
      state = differential(state, { type: "SET_PAUSED", paused: false, operationId: `diff5.resume.${i}` });
    }
  }
}, hostedTime(120_000));
