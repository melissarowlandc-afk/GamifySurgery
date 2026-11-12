import { expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createLearningDevelopmentView } from "./learningDevelopmentView";

it("reuses frozen history formatting across ticks while preserving fresh catalog labels", () => {
  const state = createInitialGameState(), id = Object.keys(state.learningHistories)[0]!;
  const history = state.learningHistories[id]!;
  Object.freeze(history.card); Object.freeze(history.reviews); Object.freeze(history);
  state.learningHistories = Object.freeze({ [id]: history });
  const format = vi.fn(row => row ? "New · no campaign review" : "Missing");
  const first = createLearningDevelopmentView(state, [{ id, displayName: "Original label" }], format);
  const next = createLearningDevelopmentView({ ...state, facilityTick: state.facilityTick + 1 }, [{ id, displayName: "Current label" }], format);
  expect(format).toHaveBeenCalledTimes(1);
  expect(next).toStrictEqual({ ...first, learningCards: [{ ...first.learningCards[0]!, conceptLabel: "Current label" }] });
});

it("does not cache mutable history fields or a changed history version", () => {
  const state = createInitialGameState(), id = Object.keys(state.learningHistories)[0]!;
  const history = state.learningHistories[id]!;
  state.learningHistories = { [id]: history };
  const format = vi.fn(row => String(row?.card.dueAtMs));
  const catalog = [{ id, displayName: "Concept" }];
  const first = createLearningDevelopmentView(state, catalog, format);
  history.card.dueAtMs++;
  const second = createLearningDevelopmentView(state, catalog, format);
  expect(second.learningCards[0]!.statusLabel).not.toBe(first.learningCards[0]!.statusLabel);
  state.learningHistories = { [id]: { ...history, card: { ...history.card, dueAtMs: history.card.dueAtMs + 1 } } };
  expect(createLearningDevelopmentView(state, catalog, format).learningCards[0]!.statusLabel).not.toBe(second.learningCards[0]!.statusLabel);
  expect(format).toHaveBeenCalledTimes(3);
});
