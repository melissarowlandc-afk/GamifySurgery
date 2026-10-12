import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, gameReducer, getFacilityProgressionStatus,
  getInspectionBookingBlockedReason, serializeGameState } from "../src";
import { createLevelFiveLaunchQaState, createPreLevelFiveLaunchContext } from "../../../tests/fixtures/level-five-launch";
import { integrationReviewTime } from "../../../tests/fixtures/level-five-integration";

describe("M10 ordinary Level 5 launch", () => {
  it.each([5, 6, 7, 8, 9])("loads the earned schema-%i Level 4 save unchanged and manually advances once", schemaVersion => {
    expect(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease).toBe(PROTOTYPE_BALANCE_RELEASE);
    const raw = JSON.parse(serializeGameState(createLevelFiveLaunchQaState("launch-ready")));
    raw.schemaVersion = schemaVersion;
    const state = deserializeGameState(JSON.stringify(raw));
    expect(state).toEqual(deserializeGameState(JSON.stringify(raw), createPreLevelFiveLaunchContext()));
    expect(state).not.toHaveProperty("levelFive");
    expect(getFacilityProgressionStatus(state)).toMatchObject({ eligible: true, nextFacilityLevel: 5, terminalComplete: false });
    const command = { type: "LEVEL_UP" as const, operationId: "m10.ordinary.advance" };
    const next = gameReducer(state, command);
    expect(next.facilityLevel).toBe(5); expect(next.clinicalXp).toBe(0);
    for (const key of ["cashCents", "rooms", "doors", "employees", "encounters", "learningHistories", "reviewIntents",
      "settlements", "serviceIncomeReceipts", "levelFourCompletion"] as const) expect(next[key], key).toEqual(state[key]);
    expect(next.rooms.some(room => room.roomDefinitionId === "room.founder_office")).toBe(false);
    expect(next.employees.some(employee => employee.staffRoleDefinitionId === "staff.executive")).toBe(false);
    expect(next.levelFive!.inspection.status).toBe("locked");
    expect(next.levelFive!.progress.inspectionUnlocked).toBeNull();
    expect(next.levelFive!.progress.gameFinished).toBeNull();
    expect(getInspectionBookingBlockedReason(next)).toContain("all three");
    expect(getFacilityProgressionStatus(next)).toMatchObject({ eligible: false, nextFacilityLevel: null, maximumPlayableLevel: 5 });
    expect(gameReducer(next, command)).toBe(next);
    const again = gameReducer(deserializeGameState(serializeGameState(next)), { ...command, operationId: "m10.ordinary.again" });
    expect(again.facilityLevel).toBe(5); expect(again.clinicalXp).toBe(0);
    expect(again.operationReceipts["m10.ordinary.again"]!.status).toBe("rejected");
    expect(again.events.filter(event => event.id === "event.facility-level.5")).toHaveLength(1);
  });

  it("leaves an unmet Level 4 save intact and rejects Advance without spending or new evidence", () => {
    const state = deserializeGameState(serializeGameState(createLevelFiveLaunchQaState("launch-unmet")));
    expect(getFacilityProgressionStatus(state).requirements.filter(goal => !goal.met).map(goal => goal.id)).toEqual(["progression.clinical_xp"]);
    const next = gameReducer(state, { type: "LEVEL_UP", operationId: "m10.unmet" });
    expect(next.operationReceipts["m10.unmet"]!.status).toBe("rejected");
    expect(next.facilityLevel).toBe(4); expect(next.clinicalXp).toBe(749);
    expect(next.cashCents).toBe(state.cashCents); expect(next.levelFourCompletion).toEqual(state.levelFourCompletion);
    expect(next).not.toHaveProperty("levelFive");
  });

  it("loads the ordinary active inspection, including all ten inspector identities", () => {
    const state = deserializeGameState(serializeGameState(createLevelFiveLaunchQaState("launch-running")));
    expect(state.levelFive!.inspection.status).toBe("running");
    expect(state.levelFive!.inspection.run!.accumulators.observedActiveMinutes).toBe(80);
    expect(state.levelFive!.inspectionPresentation.actors).toHaveLength(10);
    expect(state.levelFive!.progress.gameFinished).toBeNull();
  });

  it("finishes the first ordinary low-score report and durably keeps playing without a reward", () => {
    let state = deserializeGameState(serializeGameState(createLevelFiveLaunchQaState("launch-final")));
    state = gameReducer(state, { type: "SET_PAUSED", paused: false, operationId: "m10.final.play" });
    const before = state;
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "m10.final.minute",
      advancedAtRealMs: integrationReviewTime(state, state.facilityTick + 1) });
    const report = state.levelFive!.inspection.lastReport!;
    expect(report.outcome).toBe("completed");
    expect(report.observedActiveMinutes).toBe(3000);
    expect(report.qualifyingScoredPatientCount).toBe(52);
    expect(report.rawTotalScore).toBe(62.49398772204757);
    expect(report.categories).toHaveLength(10);
    expect(state.levelFive!.progress.gameFinished!.firstCompletedReport).toEqual(report);
    expect(state.levelFive!.inspectionPresentation.actors).toHaveLength(0);
    expect(state.clinicalXp).toBe(before.clinicalXp);
    expect(state.events.find(event => event.id === "event.level-five.game-finished")?.reward).toBeUndefined();
    const finish = structuredClone(state.levelFive!.progress.gameFinished);
    const kept = gameReducer(state, { type: "ACKNOWLEDGE_FINISH_PAGE", operationId: "m10.keep" });
    expect(kept.cashCents).toBe(state.cashCents); expect(kept.learningHistories).toEqual(state.learningHistories);
    expect(kept.levelFive!.progress.gameFinished).toEqual(finish);
    const loaded = deserializeGameState(serializeGameState(kept));
    expect(loaded.levelFive!.progress.finishPageAcknowledgedAtFacilityTick).toBe(kept.facilityTick);
    expect(loaded.levelFive!.inspection.bestCompletedReport).toEqual(report);
    const retry = gameReducer(loaded, { type: "BOOK_INSPECTION", operationId: "m10.retry" });
    expect(retry.operationReceipts["m10.retry"]!.status).toBe("applied");
    expect(retry.levelFive!.inspection.status).toBe("preparing");
    expect(retry.levelFive!.inspection.bestCompletedReport).toEqual(report);
    expect(retry.levelFive!.progress.gameFinished).toEqual(finish);
  });
});
