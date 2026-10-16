import { describe, expect, it } from "vitest";
import { advanceFacilityInspection, bookFacilityInspection, cancelFacilityInspection, createFacilityInspectionRun, createInspectionReport,
  deserializeGameState, gameReducer, getInspectionStructure, inspectionQueueState, inspectionScoreLabel, observeInspectionExpensePosting,
  observeInspectionFirstAnswer, observeInspectionPatientEnd, observeInspectionQuestions, observeInspectionReceipt, observeInspectionSettlement,
  readLevelFiveState, serializeGameState, type AnswerRecord, type EncounterState, type GameCommand, type GameState, type InspectionRunState } from "../src";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../tests/fixtures/level-five-state";

const context = createLevelFiveStateQaContext();
const base = createLevelFiveStateQaState("goals-unlocked", context);
const apply = (state: GameState, command: GameCommand) => gameReducer(state, command, context);
const tick = (state: GameState, id = `m7a.tick.${state.facilityTick}`) => apply(state, { type: "ADVANCE_TICK", operationId: id });
const ready = () => structuredClone(base);
function measured() {
  const state = ready();
  state.levelFive!.inspection.status = "running";
  state.levelFive!.inspection.run = createFacilityInspectionRun(state, "inspection.unit", context);
  return state;
}
const answer = (node: string, now: number, correct = true): AnswerRecord => ({ decisionNodeId: node, primaryConceptId: "concept.test",
  answerChoiceId: "choice.test", correct, ratingIntent: correct ? "Good" : "Again", answeredAtFacilityTick: now, explanation: "", correctedForward: !correct });

/** Pure arithmetic evidence fixture; not a claimed game playthrough or approval. */
function perfectEvidence(): InspectionRunState {
  const state = measured(), run = state.levelFive!.inspection.run!, a = run.accumulators;
  a.observedActiveMinutes = 3000; a.observedRoomMinutes = 3000; a.cleanRoomMinutes = 3000;
  a.cleanlinessSum = 300000; a.minimumCleanliness = 100;
  a.usableRoomTypeFractionSum = a.roomUpgradeFractionSum = a.staffingCoverageFractionSum = a.employeeTrainingFractionSum = 3000;
  a.staffMoraleMeanSum = 300000; a.patientSatisfactionCount = a.completedPatientCount = 20; a.patientSatisfactionSum = 2000;
  a.operatingGrossCents = 100000; a.chargedOperatingExpenseCents = a.paidOperatingExpenseCents = 90000;
  a.expensePostingCount = a.paidExpensePostingCount = 10;
  a.qualifyingCompletedEncounterIds = a.settledEncounterIds = Array.from({ length: 20 }, (_, i) => `encounter.unit.${i}`);
  a.presentedQuestions = a.qualifyingCompletedEncounterIds.map((subjectId, i) => ({ id: `question.${i}`, kind: "encounter", subjectId,
    decisionNodeId: `node.${i}`, presentedAtFacilityTick: run.startedAtFacilityTick,
    firstAnswer: { id: `answer.${i}`, answeredAtFacilityTick: run.startedAtFacilityTick, correct: true } }));
  a.structuralEvidence!.usableRoomTypeMinutes.forEach(row => row.minutes = 3000);
  a.structuralEvidence!.staffPositionSamples = run.baselineStaffPositions.map((slot, i) => ({ ...slot, id: `sample.${i}`, positionId: slot.id,
    roomInstanceId: `room.${i}`, employeeId: `employee.${i}`, trainingLevel: 5, observedMinutes: 3000 }));
  run.lastObservedAtFacilityTick = run.endsAtFacilityTick;
  return run;
}

describe("M7a booking, clocks and save contracts", () => {
  it("rejects booking outside Level 5 and before the earned goal record", () => {
    for (const state of [createLevelFiveStateQaState("l4-ready", context), createLevelFiveStateQaState("pre-goal", context)]) {
      const before = serializeGameState(state);
      const next = apply(state, { type: "BOOK_INSPECTION", operationId: "m7a.locked" });
      expect(next.operationReceipts["m7a.locked"]?.status).toBe("rejected");
      expect(serializeGameState(state)).toBe(before);
      expect(next.levelFive?.inspection.preparation).toBeFalsy();
    }
  });
  it("books for free without an Executive, freezes 60 minutes, and accepts one preparation", () => {
    const state = ready(), command = { type: "BOOK_INSPECTION" as const, operationId: "m7a.book" };
    const next = apply(state, command);
    expect(next.levelFive!.inspection.preparation).toMatchObject({ rawDurationMinutes: 60, durationMinutes: 60,
      endsAtFacilityTick: state.facilityTick + 60, executiveQuote: null });
    for (const key of ["cashCents", "clinicalXp", "rooms", "employees", "learningHistories", "reviewIntents"] as const) expect(next[key]).toEqual(state[key]);
    expect(apply(next, command)).toBe(next);
    expect(apply(next, { ...command, operationId: "m7a.book.again" }).operationReceipts["m7a.book.again"]?.status).toBe("rejected");
    expect(deserializeGameState(serializeGameState(next), context).levelFive).toEqual(next.levelFive);
  });
  it("advances only active minutes, leaves preparation unscored, then freezes the actual catalog", () => {
    let state = apply(ready(), { type: "BOOK_INSPECTION", operationId: "m7a.clock.book" });
    state = apply(state, { type: "DEV_FAST_FORWARD", operationId: "m7a.clock.paused", tickCount: 500 });
    expect(state.facilityTick).toBe(base.facilityTick);
    state = apply(state, { type: "SET_PAUSED", operationId: "m7a.clock.play", paused: false });
    state = apply(state, { type: "DEV_FAST_FORWARD", operationId: "m7a.clock.prep", tickCount: 59 });
    expect(state.levelFive!.inspection.run).toBeNull();
    state = tick(deserializeGameState(serializeGameState(state), context));
    const run = state.levelFive!.inspection.run!;
    expect(run.accumulators.observedActiveMinutes).toBe(0);
    expect(run.requiredRoomDefinitionIds).toHaveLength(33); expect(run.upgradeableRooms).toHaveLength(31);
    expect(run.baselineStaffPositions).toHaveLength(28);
    expect(new Set(run.baselineStaffPositions.map(slot => slot.staffRoleDefinitionId)).size).toBe(16);
    expect(run.endsAtFacilityTick - run.startedAtFacilityTick).toBe(3000);
    expect(run.operationalThresholds).toEqual({ cleanRoomThreshold: 80, idleGraceMinutes: 20, checkInGraceMinutes: 60 });
    state = tick(state);
    expect(state.levelFive!.inspection.run!.accumulators.observedActiveMinutes).toBe(1);
    expect(state.levelFive!.inspection.run!.accumulators.operatingGrossCents).toBe(0); // prep receipts never leak in
    const captured = structuredClone(state.levelFive);
    advanceFacilityInspection(state, context); // repeated observer on the same tick
    expect(state.levelFive).toEqual(captured);
    expect(deserializeGameState(serializeGameState(state), context).levelFive).toEqual(captured);
  });
  it("cancels preparation without a fabricated report, then retries with a distinct durable run ID", () => {
    let state = apply(ready(), { type: "BOOK_INSPECTION", operationId: "m7a.cancel.book" });
    const id = state.levelFive!.inspection.preparation!.runId;
    state = apply(state, { type: "CANCEL_INSPECTION", operationId: "m7a.cancel.prep" });
    expect(state.levelFive!.inspection).toMatchObject({ status: "cancelled", preparation: null, run: null, lastReport: null, bestCompletedReport: null });
    expect(state.levelFive!.progress.gameFinished).toBeNull();
    state = deserializeGameState(serializeGameState(state), context);
    state = apply(state, { type: "BOOK_INSPECTION", operationId: "m7a.retry" });
    expect(state.levelFive!.inspection.preparation!.runId).not.toBe(id);
  });
  it("cancels a running window and clears only its presentation lane, with no finish/prestige", () => {
    const state = createLevelFiveStateQaState("actors", context);
    expect(cancelFacilityInspection(state)).toBeNull();
    expect(state.levelFive!.inspection.lastReport?.outcome).toBe("cancelled");
    expect(state.levelFive!.inspection.lastReport?.rawTotalScore).toBeNull();
    expect(state.levelFive!.inspectionPresentation.actors).toHaveLength(0);
    expect(state.levelFive!.progress.gameFinished).toBeNull();
    expect(deserializeGameState(serializeGameState(state), context).levelFive).toEqual(state.levelFive);
    expect(cancelFacilityInspection(state)).toContain("no active");
  });
  it.each(["minutes", "position", "threshold", "sequence"])("rejects malformed new %s evidence without repairing it", defect => {
    const state = measured(); state.facilityTick++; advanceFacilityInspection(state, context);
    const raw = structuredClone(state.levelFive!);
    if (defect === "minutes") raw.inspection.run!.accumulators.structuralEvidence!.usableRoomTypeMinutes[0]!.minutes = 2;
    if (defect === "position") raw.inspection.run!.accumulators.structuralEvidence!.staffPositionSamples[0]!.observedMinutes = 2;
    if (defect === "threshold") raw.inspection.run!.operationalThresholds!.idleGraceMinutes = -1;
    if (defect === "sequence") raw.inspection.nextRunSequence = 1.5;
    expect(() => readLevelFiveState(raw, state.facilityTick, 5)).toThrow(/invalid/);
  });
});

describe("M7a structural and event evidence", () => {
  it("uses the existing 80 cleanliness threshold and legacy fallback for every placed room-minute", () => {
    const state = measured(), run = state.levelFive!.inspection.run!;
    state.rooms = state.rooms.slice(0, 3);
    state.rooms[0]!.cleanliness = 80;
    state.rooms[1]!.cleanliness = 79;
    delete state.rooms[2]!.cleanliness;
    state.facilityTick++; advanceFacilityInspection(state, context);
    const row = createInspectionReport(run, state.facilityTick).categories.find(row => row.id === "cleanliness")!;
    expect(row.score).toBe(100 * 2 / 3);
    expect(row.rawValues).toEqual({ cleanRoomMinutes: 2, observedRoomMinutes: 3, meanCleanliness: 259 / 3, minimumCleanliness: 79 });
  });
  it("counts each actual queue once, with overdue strictly after the existing idle/check-in grace", () => {
    const state = measured(); state.facilityTick += 100;
    const run = state.levelFive!.inspection.run = createFacilityInspectionRun(state, "inspection.queue", context);
    const template = Object.values(createLevelFiveStateQaState("goals", context).encounters).find(e => e.arrivalClass !== "tutorial")!;
    const idle: EncounterState = { ...structuredClone(template), id: "queue.idle", checkInStatus: "checked_in",
      lifecycle: "waiting_unopened", patientLocation: { x: 0, y: 0 }, patientMovement: null, pendingResult: null,
      resolutionReason: null, idleWaitingSinceTick: state.facilityTick + 1 - 20, checkInWaitingSinceTick: null };
    const intake = { ...structuredClone(idle), id: "queue.intake", checkInStatus: "awaiting_staff" as const,
      checkInWaitingSinceTick: state.facilityTick + 1 - 60 };
    state.encounters = { [idle.id]: idle, [intake.id]: intake };
    state.facilityTick++; advanceFacilityInspection(state, context);
    expect(run.accumulators).toMatchObject({ queueMinutes: 2, overdueQueueMinutes: 0 });
    state.facilityTick++; advanceFacilityInspection(state, context);
    expect(run.accumulators).toMatchObject({ queueMinutes: 4, overdueQueueMinutes: 2 });
    state.openChartEncounterId = idle.id;
    expect(inspectionQueueState(idle, state)).toBeNull();
    state.openChartEncounterId = null;
    idle.patientLocation = null;
    expect(inspectionQueueState(idle, state)).toBeNull();
    idle.patientLocation = { x: 0, y: 0 };
    state.encounters[idle.id]!.patientMovement = { kind: "walking_to_care", path: [], pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick, destinationRoomInstanceId: null };
    expect(inspectionQueueState(state.encounters[idle.id]!, state)).toBeNull();
    state.encounters[idle.id]!.patientMovement = null;
    idle.lifecycle = "active_pending_result";
    expect(inspectionQueueState(idle, state)).toBeNull();
  });
  it("samples missing types, duplicate low-tier copies and empty physical positions without renormalizing", () => {
    let state = measured();
    state = apply(state, { type: "PLACE_ROOM", operationId: "m7a.extra.exam", roomId: "room.m7a.extra", roomDefinitionId: "room.examination", x: 29, y: 24, orientation: 0 });
    state = apply(state, { type: "PLACE_DOOR", operationId: "m7a.extra.door", doorId: "door.m7a.extra", roomId: "room.m7a.extra", side: "south", offset: 1 });
    expect(state.operationReceipts["m7a.extra.door"]?.status).toBe("applied");
    state.rooms.find(room => room.id === "room.level5.exam")!.upgradeLevel = 5;
    const run = state.levelFive!.inspection.run!, structure = getInspectionStructure(state, run, context);
    expect(structure.positions).toHaveLength(29);
    expect(structure.positions.filter(slot => slot.employeeId)).toHaveLength(1);
    expect(structure.staffingFraction).toBe(1 / 29);
    expect(structure.upgradesFraction).toBeCloseTo(0.5 / 31); // two exam copies, not the max tier only
    state.facilityTick++; advanceFacilityInspection(state, context);
    const evidence = run.accumulators.structuralEvidence!;
    expect(evidence.roomUpgradeDeficits.some(row => row.roomInstanceId === "room.m7a.extra")).toBe(true);
    state.rooms = state.rooms.filter(room => room.id !== "room.m7a.extra"); // sale cannot rewrite the earlier sample
    state.facilityTick++; advanceFacilityInspection(state, context);
    expect(run.accumulators.structuralEvidence!.roomUpgradeDeficits.some(row => row.roomInstanceId === "room.m7a.extra")).toBe(true);
    expect(getInspectionStructure(state, run, context).positions).toHaveLength(28);
    expect(createInspectionReport(run, state.facilityTick).categories.find(row => row.id === "room_upgrades")!.missingItems.some(row => row.id === "room.m7a.extra")).toBe(true);
  });
  it("matches each installed employee once during busy/training states and retains unmatched hires in training", () => {
    const state = measured(), run = state.levelFive!.inspection.run!;
    state.employees[0]!.facilityTask = { kind: "take_break", startedAtFacilityTick: state.facilityTick, workMinutesRemaining: 30 };
    expect(getInspectionStructure(state, run, context).staffingFraction).toBe(1 / 28);
    state.employees[0]!.facilityTask = null;
    state.employees[0]!.trainingLevel = 4;
    state.employees[0]!.training = { version: 1, requestSequence: 1, requestedAtFacilityTick: state.facilityTick,
      earliestDepartureAtFacilityTick: state.facilityTick, paidAmount: 400, targetLevel: 5, stage: "training",
      roomInstanceId: null, placeId: null, remainingMinutes: 30, startedAtFacilityTick: state.facilityTick,
      completedAtFacilityTick: null, lastProgressAtFacilityTick: state.facilityTick };
    const training = getInspectionStructure(state, run, context);
    expect(training.staffingFraction).toBe(1 / 28); expect(training.trainingFraction).toBe(0.75 / 28);
    state.employees[0]!.training = null;
    state.employees[0]!.trainingLevel = 5;
    const busy = getInspectionStructure(state, run, context);
    expect(busy.staffingFraction).toBe(1 / 28); expect(busy.trainingFraction).toBe(1 / 28);
    state.employees.push({ ...structuredClone(state.employees[0]!), id: "unmatched.unit", trainingLevel: 1 });
    const overflow = getInspectionStructure(state, run, context);
    expect(overflow.positions.filter(slot => slot.employeeId)).toHaveLength(1);
    expect(overflow.unmatched).toHaveLength(1); expect(overflow.trainingFraction).toBe(1 / 29);
    state.employees[0]!.homeRoomInstanceId = "missing.room";
    expect(getInspectionStructure(state, run, context).staffingFraction).toBe(1 / 28); // overflow now owns the single valid home slot
    state.employees[1]!.homeRoomInstanceId = null;
    expect(getInspectionStructure(state, run, context).staffingFraction).toBe(0);
  });
  it("captures first correct/wrong answers once, including employee discussions, before subject retirement", () => {
    const state = measured(), history = structuredClone(state.learningHistories), run = state.levelFive!.inspection.run!;
    observeInspectionFirstAnswer(state, "encounter", "retired.patient", answer("node.a", state.facilityTick, false));
    observeInspectionFirstAnswer(state, "encounter", "retired.patient", answer("node.a", state.facilityTick, true));
    observeInspectionFirstAnswer(state, "employee_discussion", "retired.discussion", answer("node.b", state.facilityTick, true));
    expect(run.accumulators.presentedQuestions).toHaveLength(2);
    expect(run.accumulators.presentedQuestions[0]!.firstAnswer?.correct).toBe(false);
    state.encounters = {}; state.employeeDiscussions = {};
    expect(deserializeGameState(serializeGameState(state), context).levelFive).toEqual(state.levelFive);
    expect(createInspectionReport(run, state.facilityTick).categories.at(-1)?.score).toBe(50);
    expect(state.learningHistories).toEqual(history);
  });
  it("seeds only already presented unanswered nodes and keeps them when a chart closes", () => {
    const state = createLevelFiveStateQaState("goals", context);
    state.clinicalXp = 2000;
    state.levelFive!.progress.inspectionUnlocked = structuredClone(base.levelFive!.progress.inspectionUnlocked);
    const encounter = Object.values(state.encounters).find(e => e.arrivalClass !== "tutorial")!;
    encounter.firstOpenedAtTick = state.facilityTick;
    encounter.lifecycle = "active_action_required";
    state.levelFive!.inspection.status = "running";
    const run = state.levelFive!.inspection.run = createFacilityInspectionRun(state, "inspection.seed", context);
    observeInspectionQuestions(state); observeInspectionQuestions(state);
    expect(run.accumulators.presentedQuestions).toHaveLength(1);
    expect(run.accumulators.presentedQuestions[0]!.firstAnswer).toBeNull();
    state.openChartEncounterId = null;
    expect(createInspectionReport(run, state.facilityTick).categories.at(-1)?.rawValues.presentedButUnanswered).toBe(1);
    expect(createInspectionReport(run, state.facilityTick).categories.at(-1)?.score).toBe(0);
  });
  it("requires an in-window answer and an in-window distinct scored completion, including wrong first answers", () => {
    const state = createLevelFiveStateQaState("goals", context);
    state.levelFive!.progress.inspectionUnlocked = structuredClone(base.levelFive!.progress.inspectionUnlocked);
    state.levelFive!.inspection.status = "running";
    const run = state.levelFive!.inspection.run = createFacilityInspectionRun(state, "inspection.sample", context);
    const template = Object.values(state.encounters).find(e => e.arrivalClass !== "tutorial")!;
    const end = (id: string, kind: "completed" | "walkout", first = true, tutorial = false) => {
      const encounter = { ...structuredClone(template), id, arrivalClass: tutorial ? "tutorial" as const : "routine" as const,
        resolutionReason: kind, resolvedAtFacilityTick: state.facilityTick, finalPatientSatisfaction: kind === "walkout" ? 20 : 90 };
      if (first) observeInspectionFirstAnswer(state, "encounter", id, answer("node.sample", state.facilityTick, false));
      observeInspectionPatientEnd(state, encounter); observeInspectionPatientEnd(state, encounter);
    };
    end("answered", "completed"); end("preanswered", "completed", false); end("walkout", "walkout"); end("helper", "completed", true, true);
    expect(run.accumulators.qualifyingCompletedEncounterIds).toEqual(["answered"]);
    expect(run.accumulators.completedPatientCount).toBe(2); expect(run.accumulators.walkoutPatientCount).toBe(1);
    expect(run.accumulators.patientSatisfactionCount).toBe(3);
    expect(run.accumulators.patientSatisfactionSum).toBe(200);
  });
  it("counts actual stock once and full charged bills including partial/unpaid cash, excluding construction/reserves", () => {
    const state = measured(), a = state.levelFive!.inspection.run!.accumulators;
    const receipt = { id: "receipt.stock", transactionKey: "stock.key", incomeLineId: "income.gift_shop", catalogVersion: 1 as const, routeId: null,
      actorKind: "retail_visitor" as const, actorId: "shopper", grossAmount: 15, stockCost: 5.88, netCashDelta: 9.12, completedAtFacilityTick: state.facilityTick };
    observeInspectionReceipt(state, receipt); observeInspectionReceipt(state, receipt);
    observeInspectionExpensePosting(state, "bill.1", 1000, 700); observeInspectionExpensePosting(state, "bill.1", 1000, 1000);
    observeInspectionExpensePosting(state, "bill.2", 1000, 1000); observeInspectionExpensePosting(state, "zero", 0, 0);
    state.cashCents += 500000; // reserves/capital do not enter any evidence hook
    expect(a).toMatchObject({ operatingGrossCents: 1500, stockCostCents: 588, chargedOperatingExpenseCents: 2000,
      paidOperatingExpenseCents: 1700, expensePostingCount: 2, paidExpensePostingCount: 1 });
    state.facilityTick++; advanceFacilityInspection(state, context);
    const finances = createInspectionReport(state.levelFive!.inspection.run!, state.facilityTick).categories.find(row => row.id === "finances")!;
    expect(finances.score).toBe(25); expect(finances.rawValues.operatingNetCents).toBe(-1088);
  });
});

describe("M7a ten-category report and first game finish", () => {
  it("does not award empty financial or zero-queue components without their required evidence", () => {
    const run = perfectEvidence(), a = run.accumulators;
    a.operatingGrossCents = a.stockCostCents = a.chargedOperatingExpenseCents = a.paidOperatingExpenseCents = 0;
    a.expensePostingCount = a.paidExpensePostingCount = 0;
    let report = createInspectionReport(run, run.endsAtFacilityTick);
    expect(report.categories.find(row => row.id === "finances")!.score).toBe(0);
    expect(report.categories.find(row => row.id === "wait_flow")!.score).toBe(100);
    a.qualifyingCompletedEncounterIds = [];
    report = createInspectionReport(run, run.endsAtFacilityTick);
    expect(report.outcome).toBe("incomplete"); expect(report.rawTotalScore).toBeNull();
    expect(report.categories.find(row => row.id === "wait_flow")!.score).toBe(50);
  });
  it.each([[79.999, "improving"], [80, "prestige"], [94.999, "prestige"], [95, "distinguished"]])("uses the unrounded %f recognition boundary", (score, recognition) => {
    const run = perfectEvidence(), a = run.accumulators;
    const fraction = ((score as number) - 20) / 80; // Accuracy stays 100; the other 80% varies.
    a.cleanRoomMinutes = a.observedRoomMinutes * fraction;
    a.usableRoomTypeFractionSum = a.roomUpgradeFractionSum = a.staffingCoverageFractionSum = a.employeeTrainingFractionSum = 3000 * fraction;
    a.staffMoraleMeanSum = 300000 * fraction; a.patientSatisfactionSum = 2000 * fraction;
    a.queueMinutes = 100; a.overdueQueueMinutes = 200 * (1 - fraction);
    a.paidExpensePostingCount = a.expensePostingCount * (2 * fraction - 1);
    const report = createInspectionReport(run, run.endsAtFacilityTick);
    expect(report.rawTotalScore).toBeCloseTo(score as number, 8);
    expect(report.recognition).toBe(recognition);
  });
  it("reproduces the exact 85-point weighted example and keeps all formulas/hints", () => {
    const run = perfectEvidence(), a = run.accumulators;
    a.cleanRoomMinutes = 2700; a.usableRoomTypeFractionSum = 2400; a.roomUpgradeFractionSum = 2250;
    a.staffingCoverageFractionSum = 2550; a.employeeTrainingFractionSum = 2100; a.staffMoraleMeanSum = 270000;
    a.patientSatisfactionSum = 1900; a.queueMinutes = 100; a.overdueQueueMinutes = 20; a.completedPatientCount = 80; a.walkoutPatientCount = 20;
    a.operatingGrossCents = 100000; a.chargedOperatingExpenseCents = 95500; a.paidOperatingExpenseCents = 85950; a.paidExpensePostingCount = 9;
    a.presentedQuestions = Array.from({ length: 100 }, (_, i) => ({ id: `q.${i}`, kind: "encounter", subjectId: `encounter.${i}`, decisionNodeId: `node.${i}`,
      presentedAtFacilityTick: run.startedAtFacilityTick, firstAnswer: { id: `a.${i}`, answeredAtFacilityTick: run.startedAtFacilityTick, correct: i < 90 } }));
    const report = createInspectionReport(run, run.endsAtFacilityTick);
    expect(report.categories.map(row => row.score)).toEqual([90, 80, 75, 85, 70, 90, 95, 80, 90, 90]);
    expect(report.rawTotalScore).toBe(85); expect(report.recognition).toBe("prestige");
    expect(report.categories.every(row => row.formula.length > 10 && row.improvementHint.length > 10)).toBe(true);
  });
  it("allows exactly 100 only with the full patient and all structural/answer checks", () => {
    const run = perfectEvidence();
    expect(createInspectionReport(run, run.endsAtFacilityTick)).toMatchObject({ rawTotalScore: 100, recognition: "perfect", outcome: "completed" });
    run.accumulators.structuralEvidence!.staffPositionSamples = [];
    const guarded = createInspectionReport(run, run.endsAtFacilityTick);
    expect(guarded.rawTotalScore).toBeLessThan(100); expect(inspectionScoreLabel(guarded.rawTotalScore!)).toBe("99.99");
  });
  it.each(["missing room", "upgrade deficit", "empty position", "untrained employee", "wrong answer", "unanswered"])("prevents a perfect report for %s even if rounded labels appear full", defect => {
    const run = perfectEvidence(), a = run.accumulators, s = a.structuralEvidence!;
    if (defect === "missing room") { s.usableRoomTypeMinutes[0]!.minutes--; a.usableRoomTypeFractionSum -= 1 / 33; }
    if (defect === "upgrade deficit") s.roomUpgradeDeficits.push({ roomInstanceId: "sold.room", roomDefinitionId: run.upgradeableRooms[0]!.roomDefinitionId, minimumLevel: 1, maximumLevel: 5 });
    if (defect === "empty position") { s.staffPositionSamples[0]!.employeeId = null; s.staffPositionSamples[0]!.trainingLevel = null; }
    if (defect === "untrained employee") s.unmatchedEmployeeSamples.push({ employeeId: "extra", trainingLevel: 1, observedMinutes: 3000 });
    if (defect === "wrong answer") a.presentedQuestions[0]!.firstAnswer!.correct = false;
    if (defect === "unanswered") a.presentedQuestions[0]!.firstAnswer = null;
    const result = createInspectionReport(run, run.endsAtFacilityTick);
    expect(result.rawTotalScore).toBeLessThan(100); expect(result.recognition).not.toBe("perfect");
  });
  it.each([[79.999, "79.99"], [80, "80.00"], [94.999, "94.99"], [95, "95.00"], [99.995, "99.99"], [100, "100.00"]])("floors %f to %s without rounding up", (score, label) => {
    expect(inspectionScoreLabel(score as number)).toBe(label);
  });
  it("does not finish or silently extend an incomplete full window, and offers an immediate retry", () => {
    const state = measured(), run = state.levelFive!.inspection.run!;
    state.facilityTick = run.endsAtFacilityTick - 1; run.accumulators.observedActiveMinutes = 2999; run.lastObservedAtFacilityTick = state.facilityTick;
    state.facilityTick++; advanceFacilityInspection(state, context);
    expect(state.levelFive!.inspection).toMatchObject({ status: "incomplete", run: null, latestCompletedReport: null, bestCompletedReport: null });
    expect(state.levelFive!.inspection.lastReport).toMatchObject({ observedActiveMinutes: 3000, rawTotalScore: null, recognition: null });
    expect(state.levelFive!.progress.gameFinished).toBeNull();
    expect(bookFacilityInspection(state, context)).toBeNull();
  });
  it("freezes first/latest/best at any valid low score and never replays finish or overwrites an equal best", () => {
    let state = measured();
    const end = (id: string, fractions: number) => {
      const run = perfectEvidence(); run.id = id; run.startedAtFacilityTick = state.facilityTick; run.endsAtFacilityTick = state.facilityTick + 3000;
      run.lastObservedAtFacilityTick = run.endsAtFacilityTick - 1; run.accumulators.observedActiveMinutes = 2999;
      for (const q of run.accumulators.presentedQuestions) { q.presentedAtFacilityTick = state.facilityTick; q.firstAnswer!.answeredAtFacilityTick = state.facilityTick; }
      for (const row of run.accumulators.structuralEvidence!.usableRoomTypeMinutes) row.minutes = 2999;
      for (const row of run.accumulators.structuralEvidence!.staffPositionSamples) row.observedMinutes = 2999;
      run.accumulators.usableRoomTypeFractionSum = run.accumulators.roomUpgradeFractionSum = run.accumulators.staffingCoverageFractionSum = run.accumulators.employeeTrainingFractionSum = fractions;
      state.levelFive!.inspection.status = "running"; state.levelFive!.inspection.run = run;
      state.facilityTick = run.endsAtFacilityTick; advanceFacilityInspection(state, context);
    };
    end("first.low", 0);
    const first = structuredClone(state.levelFive!.progress.gameFinished!);
    expect(first.firstCompletedReport.rawTotalScore).toBeLessThan(80);
    expect(first.finishedAtFacilityTick).toBe(state.facilityTick);
    expect(state.levelFive!.progress.finishPageAcknowledgedAtFacilityTick).toBeNull();
    const money = state.cashCents, xp = state.clinicalXp, history = structuredClone(state.learningHistories);
    state = deserializeGameState(serializeGameState(state), context);
    end("equal.low", 0);
    expect(state.levelFive!.inspection.latestCompletedReport?.runId).toBe("equal.low");
    expect(state.levelFive!.inspection.bestCompletedReport?.runId).toBe("first.low");
    end("higher", 2000);
    expect(state.levelFive!.inspection.bestCompletedReport?.runId).toBe("higher");
    const best = structuredClone(state.levelFive!.inspection.bestCompletedReport);
    end("lower", 0);
    expect(state.levelFive!.inspection.bestCompletedReport).toEqual(best);
    expect(state.levelFive!.progress.gameFinished).toEqual(first);
    expect(state.events.filter(event => event.id === first.completionNoticeId)).toHaveLength(1);
    expect(state.cashCents).toBe(money); expect(state.clinicalXp).toBe(xp); expect(state.learningHistories).toEqual(history);
    expect(deserializeGameState(serializeGameState(state), context).levelFive).toEqual(state.levelFive);
  });
});
