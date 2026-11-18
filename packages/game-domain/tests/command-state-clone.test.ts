import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { createInitialGameState, deserializeGameState, gameReducer, getCurrentQuestion, type GameCommand, type GameState } from "../src";
import { cloneCommandState } from "../src/commandStateClone";
import { createDiagnosticWorkload } from "../../../tests/fixtures/diagnostic-workload";

function freeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
}

it.each(["integration-l4", "integration-build", "synthetic"])("matches the mutable reducer at every command with deeply immutable %s input", key => {
  const fixtures = JSON.parse(readFileSync(new URL("../../../tests/fixtures/level-five-integration-checkpoints-20261012.json", import.meta.url), "utf8"));
  let state = key === "synthetic" ? createDiagnosticWorkload().state : deserializeGameState(JSON.stringify(fixtures[key]));
  let answered = 0;
  const apply = (command: GameCommand) => {
    const bytes = JSON.stringify(state), frozen = freeze(JSON.parse(bytes) as GameState);
    const expected = gameReducer(JSON.parse(bytes) as GameState, command);
    const actual = gameReducer(frozen, command);
    expect(JSON.stringify(actual), command.type).toBe(JSON.stringify(expected));
    expect(JSON.stringify(frozen)).toBe(bytes);
    state = actual;
  };
  apply({ type: "SET_PAUSED", paused: false, operationId: "clone.play" });
  for (let i = 0; i < 80; i++) {
    const encounter = Object.values(state.encounters).find(e => e.lifecycle !== "resolved" && e.checkInStatus === "checked_in" && getCurrentQuestion(state, e.id));
    if (encounter) {
      apply({ type: "OPEN_CHART", encounterId: encounter.id, operationId: `clone.open.${i}` });
      const question = getCurrentQuestion(state, encounter.id)!;
      apply({ type: "SUBMIT_ANSWER", encounterId: encounter.id, decisionNodeId: question.node.id,
        answerChoiceId: question.node.answerChoices.find(c => c.isCorrect)!.id,
        reviewedAtMs: Math.max(state.createdAtRealMs + (state.facilityTick + i + 1) * 60_000,
          (state.learningHistories[question.node.primaryConceptId]?.card.lastReviewAtMs ?? 0) + 1), operationId: `clone.answer.${i}` });
      if (state.operationReceipts[`clone.answer.${i}`]?.status === "applied") answered++;
      apply({ type: "ACKNOWLEDGE_DECISION_FEEDBACK", encounterId: encounter.id, decisionNodeId: question.node.id, operationId: `clone.feedback.${i}` });
      apply({ type: "CLOSE_CHART", encounterId: encounter.id, operationId: `clone.close.${i}` });
    }
    apply({ type: "ADVANCE_TICK", advancedAtRealMs: state.createdAtRealMs + (state.facilityTick + 1) * 60_000, operationId: `clone.tick.${i}` });
  }
  if (key === "synthetic") expect(answered).toBeGreaterThan(0);
}, 120_000);

it("preserves the original JSON boundary for mutable, shallow-frozen and exotic inputs", () => {
  for (const freezeRoot of [false, true]) {
    const state = createInitialGameState() as GameState & { extras: unknown };
    state.extras = { missing: undefined, nonfinite: NaN, negativeZero: -0, sparse: [, undefined], date: new Date(0) };
    if (freezeRoot) Object.freeze(state);
    const expected = JSON.parse(JSON.stringify(state));
    const next = cloneCommandState(state);
    expect(JSON.stringify(next)).toBe(JSON.stringify(expected));
    expect(next.learningHistories).not.toBe(state.learningHistories);
    expect(next.environment).not.toBe(state.environment);
  }
  const state = freeze(createInitialGameState());
  const copy = cloneCommandState(state);
  copy.learningHistories["synthetic.new"] = { ...Object.values(copy.learningHistories)[0]!, conceptId: "synthetic.new" };
  expect(state.learningHistories["synthetic.new"]).toBeUndefined();
  expect(() => { copy.environment.founderLocation.x++; }).not.toThrow();
});
