import { afterEach, expect, it, vi } from "vitest";
import { createInitialGameState, gameReducer, type GameState } from "@gamify-surgery/game-domain";
import { freezeOperationalValue } from "./operationalFreeze";
import { createOperationalPlayerView, type OperationalViewArguments } from "./operationalViewProjection";
import { OperationalViewReuse } from "./operationalViewReuse";
import * as guidance from "../patientAvailabilityViewModel";

afterEach(() => vi.restoreAllMocks());

it("keeps pan/zoom byte-identical to full projection and resamples time-dependent guidance", () => {
  let now = 0;
  vi.spyOn(Date, "now").mockImplementation(() => now);
  // Isolate the time-input contract from the independently tested availability
  // rules: a cached paused/tutorial message would not expose a stale timestamp.
  vi.spyOn(guidance, "createPatientAvailabilityGuidance").mockImplementation((_state, at) => `guidance.${at}`);
  const state = freezeOperationalValue(createInitialGameState()), reuse = new OperationalViewReuse();
  const args: OperationalViewArguments = [null, false, null, false, null, 0, { zoom: 1, panX: 0, panY: 0 }, [], false];
  const first = reuse.project(state, args, 0);
  for (const at of [1, 60_000, 600_001]) {
    now = at;
    args[6]!.panX += 17;
    const view = reuse.project(state, args, at);
    expect(JSON.stringify(view)).toBe(JSON.stringify(createOperationalPlayerView(state, args, at)));
    expect(view.patientAvailabilityGuidance).toBe(`guidance.${at}`);
    expect(view.development).toBe(first.development);
    expect(view.facility.rooms).toBe(first.facility.rooms);
  }
});

it("invalidates every non-camera presentation input and any new state, without retaining mutable caller arguments", () => {
  let state = freezeOperationalValue(createInitialGameState());
  const reuse = new OperationalViewReuse();
  const check = (args: OperationalViewArguments, at = 0) => {
    expect(JSON.stringify(reuse.project(state, args, at))).toBe(JSON.stringify(createOperationalPlayerView(state, args, at)));
  };
  check([null, false, null]);
  check([null, true, null]);
  check([null, false, "room.hallway", true, "missing", 90]);
  check([null, false, null, false, null, 0, undefined, [], null]);
  check([null, false, null, false, null, 0, undefined, [], true]);
  const args: OperationalViewArguments = [null, false, null, false, null, 0, { zoom: 1, panX: 2, panY: 3 }, [], false];
  check(args);
  args[1] = true; check(args);
  state = freezeOperationalValue(gameReducer(state, { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "view.speed" }));
  check(args, 600_000);
  const mutable = structuredClone(state) as GameState;
  const view = reuse.project(mutable, args, 0); mutable.cashCents += 100; mutable.cash += 1;
  expect(JSON.stringify(reuse.project(mutable, args, 0))).toBe(JSON.stringify(createOperationalPlayerView(mutable, args, 0)));
  expect(JSON.stringify(reuse.project(mutable, args, 0))).not.toBe(JSON.stringify(view));
  // A frozen root alone is not proof that its descendants are immutable.
  Object.freeze(mutable);
  reuse.project(mutable, args, 0); mutable.environment.founderLocation.x++;
  expect(JSON.stringify(reuse.project(mutable, args, 0))).toBe(JSON.stringify(createOperationalPlayerView(mutable, args, 0)));
});

it("opts out when generic arguments contain hidden properties instead of plain transport data", () => {
  const state = freezeOperationalValue(createInitialGameState()), reuse = new OperationalViewReuse();
  const flags: NonNullable<OperationalViewArguments[7]> = [];
  Object.defineProperty(flags, "hidden", { value: "first", configurable: true });
  const args: OperationalViewArguments = [null, false, null, false, null, 0, undefined, flags];
  const first = reuse.project(state, args, 0);
  Object.defineProperty(flags, "hidden", { value: "changed", configurable: true });
  const next = reuse.project(state, args, 0);
  expect(JSON.stringify(next)).toBe(JSON.stringify(createOperationalPlayerView(state, args, 0)));
  expect(next.development).not.toBe(first.development);
});
