import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  applyGameEvidenceCommand, createGameEvidenceCheckpoint, createInitialGameState,
  deserializeGameState, gameEvidenceDelta, gameReducer, getFacilityProgressionStatus,
  importGameEvidence, restoreGameEvidenceJournal, serializeGameState,
  type GameCommand, type GameState,
} from "../src";
import { createLevelThreeReadyQaState, createLevelFourAlmostQaState } from "../../../tests/fixtures/level-four-progression";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../tests/fixtures/level-five-state";

const context = createLevelFiveStateQaContext();
const boundaries = [[3, 500, 550], [4, 750, 870], [5, 2000, 2300]] as const;
const policy = (level = 3) => level < 4
  ? { version: "late-progression.v1" as const, preservedClinicalXpGoal: null }
  : { version: "late-progression.v2" as const, preservedClinicalXpGoal: null, preservedCompletedEncounterGoal: null };
function stateAt(level: 3 | 4 | 5): GameState {
  return level === 3 ? createLevelThreeReadyQaState() : level === 4
    ? createLevelFourAlmostQaState(context) : createLevelFiveStateQaState("pre-goal", context);
}
const goal = (state: GameState) => getFacilityProgressionStatus(state, context).requirements
  .find(row => row.id === "progression.clinical_xp")!;
const load = (state: GameState) => deserializeGameState(serializeGameState(state), context);

describe("modest late XP pacing and earned save goals", () => {
  it.each(boundaries)("uses the new Level %i boundary for unearned/new-stage work", (level, oldXp, newXp) => {
    let state = stateAt(level);
    state.lateProgression = policy(level);
    state.clinicalXp = oldXp;
    state = load(state);
    expect(goal(state)).toMatchObject({ required: newXp, met: false });
    state.clinicalXp = newXp - 1;
    expect(goal(state).met).toBe(false);
    state.clinicalXp++;
    expect(goal(state)).toMatchObject({ required: newXp, met: true });
    state = gameReducer(state, { type: "SET_PAUSED", paused: true, operationId: `pacing.new.goal.${level}` }, context);
    expect(goal(load(state))).toMatchObject({ required: newXp, met: true });
  });

  it.each(boundaries)("keeps an earned Level %i XP goal through repeated legacy loads and ticks", (level, oldXp) => {
    let state = stateAt(level);
    delete state.lateProgression;
    state.clinicalXp = oldXp;
    for (let n = 0; n < 3; n++) {
      const prior = state;
      state = load(state);
      expect(goal(state)).toMatchObject({ required: oldXp, met: true });
      expect(state.facilityLevel).toBe(level);
      for (const key of ["cashCents", "clinicalXp", "rooms", "encounters", "settlements", "learningHistories"] as const)
        expect(state[key], key).toEqual(prior[key]);
      // Existing avatar/home-assignment migrations still run on legacy shapes.
      const contracts = (value: GameState) => value.employees.map(employee =>
        [employee.id, employee.salaryPerExpenseInterval, employee.trainingLevel]);
      expect(contracts(state)).toEqual(contracts(prior));
      state = gameReducer(state, { type: "SET_PAUSED", paused: true, operationId: `pacing.old.${level}.${n}` }, context);
      expect(goal(state).met).toBe(true);
    }
  });

  it.each(boundaries)("does not grant historical credit by crossing the old Level %i goal after loading", (level, oldXp, newXp) => {
    let state = stateAt(level);
    delete state.lateProgression;
    state.clinicalXp = oldXp - 1;
    state = load(state);
    expect(state.lateProgression).toEqual(level === 5 ? {...policy(level), preservedCompletedEncounterGoal:
      {facilityLevel: 5, minimumCompletedEncounters: 330}} : policy(level));
    state.clinicalXp = oldXp;
    state = load(state);
    expect(goal(state)).toMatchObject({ required: newXp, met: false });
  });

  it("preserves a mature schema-5 goal, level and reward while applying the new goal after advancing", () => {
    const raw = JSON.parse(serializeGameState(createLevelThreeReadyQaState()));
    raw.schemaVersion = 5;
    delete raw.lateProgression;
    const state = deserializeGameState(JSON.stringify(raw), context);
    expect(goal(state)).toMatchObject({ required: 500, met: true });
    const command = { type: "LEVEL_UP", operationId: "pacing.advance" } as const;
    const advanced = gameReducer(state, command, context);
    expect(advanced.operationReceipts[command.operationId]?.status).toBe("applied");
    expect(advanced.facilityLevel).toBe(4);
    expect(advanced.cashCents).toBe(state.cashCents);
    expect(advanced.clinicalXp).toBe(0);
    expect(goal(advanced)).toMatchObject({ required: 870, met: false });
    advanced.clinicalXp = 750;
    expect(goal(load(advanced))).toMatchObject({ required: 870, met: false });
    expect(gameReducer(advanced, command, context)).toBe(advanced);
  });

  it("stamps pre-command credit before fast-forward and preserves command identity and determinism", () => {
    const state = stateAt(3);
    delete state.lateProgression;
    state.clinicalXp = 499;
    state.paused = false;
    const before = serializeGameState(state);
    const command = { type: "DEV_FAST_FORWARD", tickCount: 3, operationId: "pacing.fast" } as const;
    const first = gameReducer(state, command, context);
    expect(first.lateProgression).toEqual(policy());
    expect(serializeGameState(state)).toBe(before);
    expect(serializeGameState(gameReducer(state, command, context))).toBe(serializeGameState(first));
    expect(gameReducer(first, command, context)).toBe(first);
    first.clinicalXp = 500;
    expect(goal(first)).toMatchObject({ required: 550, met: false });
  });

  it.each(["integration-l4", "integration-finish"])("keeps earned checkpoint goals and finish records: %s", (checkpoint) => {
    const frozenBytes = readFileSync(new URL("../../../tests/fixtures/late-progression-pre-policy-checkpoints-20261111.json", import.meta.url));
    expect(createHash("sha256").update(frozenBytes).digest("hex")).toBe("24ef8c51dd46319bf8f1b895a6e03e9bdc38fc4b72a5ebf89b31e64e0315b4a4");
    const checkpoints = JSON.parse(frozenBytes.toString("utf8")).checkpoints;
    const raw = checkpoints[checkpoint];
    expect(raw.lateProgression).toBeUndefined();
    let state = deserializeGameState(JSON.stringify(raw), context);
    const oldLevel = state.facilityLevel, oldProgress = structuredClone(state.levelFive?.progress);
    expect(goal(state).met).toBe(true);
    for (let n = 0; n < 3; n++) {
      state = load(state);
      state = gameReducer(state, { type: "SET_PAUSED", paused: true, operationId: `pacing.retained.${checkpoint}.${n}` }, context);
      expect(state.facilityLevel).toBe(oldLevel);
      expect(state.levelFive?.progress).toEqual(oldProgress);
      expect(goal(state).met).toBe(true);
    }
  });

  it("accepts an old 2000-XP inspection unlock after XP and live morale decline", () => {
    const state = createLevelFiveStateQaState("eligible", context);
    state.levelFive!.progress.inspectionUnlocked!.clinicalXp = 2000;
    state.clinicalXp = 0;
    state.employees = [];
    delete state.lateProgression;
    const restored = load(state);
    expect(restored.levelFive!.progress).toEqual(state.levelFive!.progress);
    expect(goal(restored)).toMatchObject({ required: 2000, met: true });
  });

  it("retains a new earned inspection goal at its new target instead of relabeling it as a legacy goal", () => {
    const state = createLevelFiveStateQaState("eligible", context);
    state.lateProgression = policy();
    state.clinicalXp = 0;
    const restored = load(state);
    expect(restored.levelFive!.progress).toEqual(state.levelFive!.progress);
    expect(goal(restored)).toMatchObject({ required: 2300, met: true });
  });

  it.each([0, 1, 2] as const)("leaves Level %i goals and save shape unchanged", (level) => {
    const state = createInitialGameState(context);
    state.facilityLevel = level;
    const restored = load(state);
    expect(restored).not.toHaveProperty("lateProgression");
    const next = gameReducer(restored, { type: "SET_PAUSED", paused: true, operationId: `pacing.early.${level}` }, context);
    expect(next).not.toHaveProperty("lateProgression");
    expect(getFacilityProgressionStatus(next, context).requirements.find(row => row.id === "progression.clinical_xp")?.required)
      .toBe([10, 150, 300][level]);
  });

  it.each([
    { version: "future", preservedClinicalXpGoal: null },
    { version: "late-progression.v1", preservedClinicalXpGoal: { facilityLevel: 3, minimumClinicalXp: 499 } },
    { version: "late-progression.v1", preservedClinicalXpGoal: { facilityLevel: 5, minimumClinicalXp: 2000 } },
    { version: "late-progression.v1", preservedClinicalXpGoal: null, extra: true },
  ])("rejects an invalid policy instead of granting unearned credit: %j", (invalid) => {
    const raw = JSON.parse(serializeGameState(stateAt(3)));
    raw.lateProgression = invalid;
    expect(() => deserializeGameState(JSON.stringify(raw), context)).toThrow("late progression policy");
  });

  it("retains policy and exact replay through evidence checkpoints and operational journal deltas", () => {
    let state = stateAt(3);
    delete state.lateProgression;
    state.clinicalXp = 499;
    state.paused = false;
    const base = createGameEvidenceCheckpoint(state);
    let checkpoint = base;
    const deltas = [];
    const commands: GameCommand[] = [{ type: "SET_PAUSED", paused: false, operationId: "pacing.evidence.play" },
      ...Array.from({ length: 3 }, (_, n): GameCommand => ({ type: "ADVANCE_TICK", operationId: `pacing.evidence.tick.${n}` }))];
    for (const command of commands) {
      const observed = applyGameEvidenceCommand(checkpoint, command, context);
      deltas.push(gameEvidenceDelta(checkpoint, observed.checkpoint));
      checkpoint = observed.checkpoint;
      state = gameReducer(state, command, context);
      expect(serializeGameState(observed.state)).toBe(serializeGameState(state));
      expect(importGameEvidence(checkpoint.snapshot, checkpoint.evidence).lateProgression).toEqual(policy());
    }
    const restored = restoreGameEvidenceJournal(base, deltas);
    expect(serializeGameState(importGameEvidence(restored.snapshot, restored.evidence))).toBe(serializeGameState(state));
    expect(goal(load(state))).toMatchObject({ required: 550, met: false });
  });
});
