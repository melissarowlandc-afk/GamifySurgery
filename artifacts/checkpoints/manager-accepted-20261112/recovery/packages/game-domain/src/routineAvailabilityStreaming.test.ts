import { afterEach, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { createInitialGameState } from "./reducer";
import { deserializeGameState } from "./persistence";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { getRoutinePatientAvailability } from "./routine-patient-availability";
import { getRoutinePatientAvailability as reference } from "./routineAvailabilityReference.testSupport";
import * as eligibility from "./clinical-case-eligibility";
import type { GameState } from "./types";

afterEach(() => vi.restoreAllMocks());

it("matches the literal previous reader across levels, capabilities, learning and active visits", () => {
  const historical = deserializeGameState(readFileSync(new URL("../../../tests/fixtures/level-four-legacy-pre-m3.json", import.meta.url), "utf8"));
  const opening = createInitialGameState();
  for (const original of [opening, historical]) for (const level of [0, 1, 3, 4, 5] as const)
    for (const paused of [false, true]) for (const empty of [false, true]) for (const at of [0, 1_900_000_000_000]) {
      const state: GameState = { ...original, facilityLevel: level, paused,
        ...(empty ? { encounters: {}, employeeDiscussions: {}, rooms: [] } : {}) };
      for (const cases of [PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases, [...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases].reverse()]) {
        const context = { ...PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease: { ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease, cases } };
        expect(getRoutinePatientAvailability(state, at, context)).toStrictEqual(reference(state, at, context));
      }
    }
});

it("stops semantic checks at an available first case instead of scanning the whole release", () => {
  const state: GameState = { ...createInitialGameState(), paused: false, facilityLevel: 3, encounters: {}, employeeDiscussions: {} };
  const semantics = vi.spyOn(eligibility, "clinicalCaseHasSupportedPatientSemantics");
  const before = reference(state, state.createdAtRealMs), previousChecks = semantics.mock.calls.length;
  semantics.mockClear(); const actual = getRoutinePatientAvailability(state, state.createdAtRealMs);
  expect(actual).toStrictEqual(before);
  expect(semantics.mock.calls.length).toBeLessThan(previousChecks);
});
