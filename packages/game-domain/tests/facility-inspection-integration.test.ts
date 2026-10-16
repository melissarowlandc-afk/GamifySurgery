import { describe, expect, it } from "vitest";
import { writeFileSync } from "node:fs";
import { deserializeGameState, gameReducer, getCurrentQuestion, getExecutivePreparationQuote, getInspectionBookingBlockedReason,
  serializeGameState, type GameCommand, type GameState } from "../src";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../tests/fixtures/level-five-state";
import { createLevelFiveInspectionQaState } from "../../../tests/fixtures/level-five-inspection";
// Hosted CI runners run long simulations up to ten times slower.
const hostedTime = (ms: number) => (process.env.CI ? ms * 10 : ms);

const context = createLevelFiveStateQaContext();
const apply = (state: GameState, command: GameCommand) => {
  const next = gameReducer(state, command, context);
  expect(next.operationReceipts[command.operationId]?.status, command.type).toBe("applied");
  return next;
};
const tick = (state: GameState, id = `integration.tick.${state.facilityTick}`) => apply(state, { type: "ADVANCE_TICK", operationId: id });

describe("M7a actual reducer/retirement inspection integration", () => {
  it.each([[1, 57, 57], [2, 56.25, 57], [3, 55.5, 56], [4, 54.75, 55], [5, 54, 54]] as const)("freezes tier %i preparation at raw %f / accepted %i after a real daily round", (level, raw, duration) => {
    let state = createLevelFiveStateQaState("executive", context);
    const employee = state.employees.find(employee => employee.staffRoleDefinitionId === "staff.executive")!;
    employee.trainingLevel = level; // Explicit test achieved-tier setup before real round acceptance.
    state.rooms.find(room => room.roomDefinitionId === "room.executive_office")!.upgradeLevel = 5;
    state = apply(state, { type: "SET_EMPLOYEE_SALARY", operationId: `prep.salary.${level}`, employeeId: employee.id, salaryPerExpenseInterval: 49 });
    state.clinicalXp = 2000; // Unlock boundary setup; normal answer rewards are tested below.
    state = apply(state, { type: "SET_PAUSED", operationId: `prep.play.${level}`, paused: false });
    for (let minute = 0; minute < 180 && state.levelFive!.management.round?.status !== "completed"; minute++) state = tick(state);
    expect(state.levelFive!.management.round).toMatchObject({ status: "completed", employeeTrainingLevel: level, durationMinutes: 24 });
    expect(getExecutivePreparationQuote(state, context)).toMatchObject({ rawDurationMinutes: raw, durationMinutes: duration });
    state = apply(state, { type: "BOOK_INSPECTION", operationId: `prep.book.${level}` });
    const frozen = structuredClone(state.levelFive!.inspection.preparation);
    state = apply(state, { type: "FIRE_EMPLOYEE", operationId: `prep.fire.${level}`, employeeId: employee.id });
    expect(state.levelFive!.inspection.preparation).toEqual(frozen);
    state = deserializeGameState(serializeGameState(state), context);
    expect(state.levelFive!.inspection.preparation).toEqual(frozen);
    while (state.levelFive!.inspection.status === "preparing") state = tick(state);
    expect(state.levelFive!.inspection.run!.startedAtFacilityTick).toBe(frozen!.endsAtFacilityTick);
    expect(state.levelFive!.inspection.run!.durationMinutes).toBe(3000);
  });

  it("earns the full 2999-minute QA evidence and >=20 ordinary scored completions, then finishes at a low score once", () => {
    let openingCash = 0, openingExpenses = 0, reconciledMinutes = 0;
    let state = createLevelFiveInspectionQaState("inspection-final", context, {
      start: state => { openingCash = state.cashCents; openingExpenses = state.totalOperatingExpenses; },
      minute: state => {
        const a = state.levelFive!.inspection.run!.accumulators;
        expect(state.cashCents - openingCash).toBe(a.operatingGrossCents - a.stockCostCents - a.paidOperatingExpenseCents);
        expect(Math.round((state.totalOperatingExpenses - openingExpenses) * 100)).toBe(a.chargedOperatingExpenseCents);
        reconciledMinutes++;
      },
    });
    const run = structuredClone(state.levelFive!.inspection.run!);
    expect(run.accumulators.observedActiveMinutes).toBe(2999);
    expect(run.accumulators.qualifyingCompletedEncounterIds.length).toBeGreaterThanOrEqual(20);
    const firstAnswers = run.accumulators.presentedQuestions.filter(q => q.firstAnswer);
    expect(state.clinicalXp).toBe(2000 + firstAnswers.length * 10);
    expect(state.levelFive!.progress.gameFinished).toBeNull();
    expect(state.encounters[run.accumulators.qualifyingCompletedEncounterIds[0]!]).toBeUndefined(); // earlier evidence retired
    state = deserializeGameState(serializeGameState(state), context);
    expect(state.levelFive!.inspection.run).toEqual(run);
    state = apply(state, { type: "SET_PAUSED", operationId: "finish.qa.play", paused: false });
    const cash = state.cashCents, xp = state.clinicalXp, histories = structuredClone(state.learningHistories);
    state = tick(state, "finish.qa.tick");
    const report = state.levelFive!.inspection.lastReport!;
    expect(report.outcome).toBe("completed"); expect(report.observedActiveMinutes).toBe(3000);
    expect(report.rawTotalScore).toBeLessThan(80); expect(report.recognition).toBe("improving");
    expect(reconciledMinutes).toBe(2999);
    if (process.env.LEVEL5_M7A_REPORT === "1") writeFileSync(new URL("../../../.local-dev/level5-m7a/window-evidence.json", import.meta.url),
      JSON.stringify({ setup: "Boundary XP and scripted existing-case admissions are QA metadata, not a zero-XP pacing run. Every observed minute/answer/receipt is reducer-earned.",
        reconciledMinutes, firstAnswers: firstAnswers.length, xpBeforeLastMinute: xp, openingCashCents: openingCash, closingCashCents: state.cashCents,
        accumulators: { ...run.accumulators, structuralEvidence: undefined, presentedQuestions: undefined }, report }, null, 2) + "\n");
    expect(state.levelFive!.progress.gameFinished).toMatchObject({ firstCompletedInspectionRunId: report.runId, finishedAtFacilityTick: state.facilityTick,
      firstCompletedReport: report });
    expect(state.clinicalXp).toBe(xp); expect(state.learningHistories).toEqual(histories);
    expect(state.cashCents).toBe(cash); // ending observation creates no reward; this tick has no posting
    expect(state.events.filter(event => event.id === "event.level-five.game-finished")).toHaveLength(1);
    const finished = structuredClone(state.levelFive!.progress.gameFinished);
    state = apply(state, { type: "SET_PAUSED", operationId: "finish.qa.pause", paused: true });
    for (let i = 0; i < 2; i++) {
      state = deserializeGameState(serializeGameState(state), context);
      state = tick(state, `finish.paused.${i}`);
      expect(state.levelFive!.progress.gameFinished).toEqual(finished);
      expect(state.events.filter(event => event.id === "event.level-five.game-finished")).toHaveLength(1);
    }
    expect(getInspectionBookingBlockedReason(state, context)).toBeNull();
    const first = structuredClone(state.levelFive!.inspection.bestCompletedReport);
    state = apply(state, { type: "BOOK_INSPECTION", operationId: "finish.retry.book" });
    state = apply(state, { type: "CANCEL_INSPECTION", operationId: "finish.retry.cancel" });
    expect(state.levelFive!.inspection.bestCompletedReport).toEqual(first);
    expect(state.levelFive!.progress.gameFinished).toEqual(finished);
  }, hostedTime(60_000));

  it("ends the separate real 3000-minute empty window incomplete without fabricated sample, score or finish", () => {
    let state = createLevelFiveInspectionQaState("inspection-incomplete", context);
    state = apply(state, { type: "SET_PAUSED", operationId: "incomplete.qa.play", paused: false });
    state = tick(state, "incomplete.qa.end");
    expect(state.levelFive!.inspection.lastReport).toMatchObject({ outcome: "incomplete", observedActiveMinutes: 3000,
      qualifyingScoredPatientCount: 0, rawTotalScore: null, recognition: null });
    expect(state.levelFive!.progress.gameFinished).toBeNull(); expect(state.levelFive!.inspection.bestCompletedReport).toBeNull();
    expect(deserializeGameState(serializeGameState(state), context).levelFive).toEqual(state.levelFive);
    state = apply(state, { type: "BOOK_INSPECTION", operationId: "incomplete.qa.retry" });
    expect(state.levelFive!.inspection.status).toBe("preparing");
  }, hostedTime(60_000));

  it("keeps real clinical selection, normal first-answer XP/FSRS, cash and receipts equal with the observer on/off", () => {
    let observed = createLevelFiveInspectionQaState("inspection-running", context);
    observed.nextRoutineArrivalTick = observed.facilityTick + 1;
    observed.paused = false;
    let control = structuredClone(observed);
    control.levelFive!.inspection.status = "ready"; control.levelFive!.inspection.run = null;
    for (let minute = 0; minute < 240; minute++) {
      for (const state of [observed, control]) {
        const open = state.openChartEncounterId ? state.encounters[state.openChartEncounterId] : null;
        // This comparison intentionally leaves charts unopened. A real accepted
        // chart/answer follows below after identical normal admission/selection.
        expect(open).toBeNull();
      }
      observed = tick(observed, `pair.${minute}`); control = tick(control, `pair.${minute}`);
    }
    const patient = Object.values(observed.encounters).find(e => e.checkInStatus === "checked_in" && e.lifecycle === "waiting_unopened" && !e.patientMovement);
    expect(patient).toBeTruthy();
    observed = apply(observed, { type: "OPEN_CHART", operationId: "pair.open", encounterId: patient!.id });
    control = apply(control, { type: "OPEN_CHART", operationId: "pair.open", encounterId: patient!.id });
    for (let minute = 0; minute < 90 && observed.encounters[patient!.id]!.patientMovement; minute++) {
      observed = tick(observed, `pair.attend.${minute}`); control = tick(control, `pair.attend.${minute}`);
    }
    const q = getCurrentQuestion(observed, patient!.id, context)!;
    const command = { type: "SUBMIT_ANSWER" as const, operationId: "pair.answer", encounterId: patient!.id, decisionNodeId: q.node.id,
      answerChoiceId: q.node.answerChoices.find(choice => !choice.isCorrect)!.id, reviewedAtMs: 1_791_806_400_000 };
    observed = apply(observed, command); control = apply(control, command);
    expect(observed.clinicalXp - 2000).toBe(2);
    expect(observed.levelFive!.inspection.run!.accumulators.presentedQuestions.some(q => q.firstAnswer?.correct === false)).toBe(true);
    for (const key of ["campaignSeed", "encounters", "employees", "rooms", "cashCents", "clinicalXp", "learningHistories", "reviewIntents", "serviceIncomeReceipts", "settlements", "events"] as const) {
      expect(observed[key], key).toEqual(control[key]);
    }
  }, hostedTime(60_000));
});
