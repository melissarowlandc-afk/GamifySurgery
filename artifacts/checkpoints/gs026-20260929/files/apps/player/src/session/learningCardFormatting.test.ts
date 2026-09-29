import { describe, expect, it, vi } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  type ConceptReviewEvidence,
} from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

describe("learning-card status formatting", () => {
  it("keeps status labels unchanged and reuses one date formatter across reviewed cards and projections", () => {
    const state = createInitialGameState();
    const concepts = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts.slice(0, 2);
    const dueAtMs = Date.UTC(2026, 8, 29, 14, 30);
    const expectedDue = new Intl.DateTimeFormat(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(dueAtMs));
    const OriginalDateTimeFormat = Intl.DateTimeFormat;
    const constructorSpy = vi.spyOn(Intl, "DateTimeFormat").mockImplementation(
      function DateTimeFormat(locales, options) {
        return new OriginalDateTimeFormat(locales, options);
      },
    );

    const unreviewed = createPrototypePlayerView(state, null, false, null);
    expect(unreviewed.development.learningCards[0]?.statusLabel).toBe(
      "New · no campaign review",
    );
    expect(constructorSpy).not.toHaveBeenCalled();

    concepts.forEach((concept, index) => {
      const history = state.learningHistories[concept.id]!;
      state.learningHistories[concept.id] = {
        ...history,
        card: {
          ...history.card,
          dueAtMs,
          scheduledDays: index === 0 ? 1 : 0,
        },
        reviews: [
          {
            rating: index === 0 ? "Good" : "Hard",
          } as ConceptReviewEvidence,
        ],
      };
    });

    const firstProjection = createPrototypePlayerView(state, null, false, null);
    const repeatedProjection = createPrototypePlayerView(state, null, false, null);
    const statuses = firstProjection.development.learningCards
      .filter((card) => concepts.some((concept) => concept.id === card.conceptId))
      .map((card) => card.statusLabel);

    expect(statuses).toEqual([
      `Good · 1 day · due ${expectedDue}`,
      `Hard · short learning step · due ${expectedDue}`,
    ]);
    expect(repeatedProjection.development.learningCards
      .filter((card) => concepts.some((concept) => concept.id === card.conceptId))
      .map((card) => card.statusLabel)).toEqual(statuses);
    expect(constructorSpy).toHaveBeenCalledTimes(1);
    expect(constructorSpy).toHaveBeenCalledWith(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  });
});
