import { describe, expect, it } from "vitest";
import { deserializeGameState, gameReducer, serializeGameState } from "../src";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../tests/fixtures/level-five-state";

const context = createLevelFiveStateQaContext();
describe("Level 5 durable finish-page acknowledgment", () => {
  it.each(["pre-goal", "eligible", "incomplete", "cancelled", "l4-ready"] as const)("rejects acknowledgment before a completed inspection in %s", scenario => {
    const state = createLevelFiveStateQaState(scenario, context);
    const next = gameReducer(state, { type: "ACKNOWLEDGE_FINISH_PAGE", operationId: `finish.reject.${scenario}` }, context);
    expect(next.operationReceipts[`finish.reject.${scenario}`]?.status).toBe("rejected");
    expect(next.levelFive?.progress).toEqual(state.levelFive?.progress);
    expect(next.cashCents).toBe(state.cashCents); expect(next.clinicalXp).toBe(state.clinicalXp);
  });

  it("acknowledges once, survives reload, and preserves first/latest/best reports and campaign history", () => {
    const state = createLevelFiveStateQaState("finish", context);
    const command = { type: "ACKNOWLEDGE_FINISH_PAGE", operationId: "finish.ack" } as const;
    const next = gameReducer(state, command, context);
    expect(next.levelFive!.progress.finishPageAcknowledgedAtFacilityTick).toBe(state.facilityTick);
    expect(gameReducer(next, command, context)).toBe(next);
    const reloaded = deserializeGameState(serializeGameState(next), context);
    const repeated = gameReducer({ ...reloaded, facilityTick: reloaded.facilityTick + 1 }, { ...command, operationId: "finish.ack.again" }, context);
    expect(repeated.levelFive).toEqual(next.levelFive);
    for (const key of ["campaignId", "campaignSeed", "cashCents", "clinicalXp", "learningHistories", "rooms", "employees", "encounters", "events"] as const) {
      expect(next[key]).toEqual(state[key]);
    }
    expect(state.levelFive!.progress.finishPageAcknowledgedAtFacilityTick).toBeNull();
  });
});
