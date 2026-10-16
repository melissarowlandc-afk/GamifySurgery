import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createInitialGameState, createLevelFiveState, deserializeGameState, gameReducer,
  getDisplayedClinicSatisfaction, getFacilityProgressionStatus, planDiagnosticOrder, readLevelFiveState,
  serializeGameState, type GameState } from "../src";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState, LEVEL_FIVE_QA_SCENARIOS } from "../../../tests/fixtures/level-five-state";
import { pending, timingFixture } from "./diagnostic-timing-fixtures";
import { LEVEL_FIVE_INSPECTION_UNLOCK_EVENT_ID } from "@gamify-surgery/balance-config";
import { LEVEL_FIVE_PROGRESSION_QA_SCENARIOS, type LevelFiveProgressionQaScenario } from "../../../tests/fixtures/level-five-progression";
import { createPreLevelFiveLaunchContext } from "../../../tests/fixtures/level-five-launch";

const context = createLevelFiveStateQaContext();
const rawSave = (state: GameState) => JSON.parse(serializeGameState(state));
type Mutation = (raw: any) => void;

describe("Level 5 optional state foundation", () => {
  it.each([0, 1, 2, 3, 4] as const)("keeps legacy Level %i data and omission through schema 5-9 loads", level => {
    const baseline = deserializeGameState(serializeGameState(createInitialGameState(undefined, {
      campaignId: `campaign.level5.legacy.${level}`, campaignSeed: `level5.legacy.${level}`, createdAtRealMs: 0,
    })));
    baseline.facilityLevel = level;
    for (const schemaVersion of [5, 6, 7, 8, 9]) {
      const old = rawSave(baseline); old.schemaVersion = schemaVersion;
      expect(old).not.toHaveProperty("levelFive");
      const restored = deserializeGameState(JSON.stringify(old));
      const optInRestored = deserializeGameState(JSON.stringify(old), context);
      expect(restored.facilityLevel).toBe(level);
      expect(optInRestored).toEqual(restored);
      expect(restored).not.toHaveProperty("levelFive");
      expect(rawSave(restored)).not.toHaveProperty("levelFive");
      for (const key of ["rooms", "doors", "employees", "encounters", "founder", "cashCents", "clinicalXp", "learningHistories", "reviewIntents",
        "settlements", "serviceIncomeReceipts", "operationReceipts", "schedulerPins", "salaryEconomyVersion", "events", "levelFourCompletion"] as const) {
        expect(restored[key], `schema ${schemaVersion}, ${key}`).toEqual(baseline[key]);
      }
    }
  });

  it("loads the frozen synthetic pre-Level-4 save shape without fabricating any Level 5 evidence", () => {
    const old = readFileSync(new URL("../../../tests/fixtures/level-four-legacy-pre-m3.json", import.meta.url), "utf8");
    const live = deserializeGameState(old), qa = deserializeGameState(old, context);
    expect(qa).toEqual(live);
    expect(qa).not.toHaveProperty("levelFive");
    expect(qa.levelFourCompletion).toBeUndefined();
  });

  it("loads Level 5 in the ordinary release and retains rejection in an explicit legacy cap-4 context", () => {
    const state = createLevelFiveStateQaState();
    expect(() => deserializeGameState(serializeGameState(state), createPreLevelFiveLaunchContext())).toThrow(/incomplete or invalid/);
    expect(deserializeGameState(serializeGameState(state))).toEqual(deserializeGameState(serializeGameState(state), context));
    expect(deserializeGameState(serializeGameState(state), context).facilityLevel).toBe(5);
    const live = createInitialGameState(); live.facilityLevel = 4;
    expect(getFacilityProgressionStatus(live)).toMatchObject({ maximumPlayableLevel: 5, nextFacilityLevel: 5 });
    expect(live).not.toHaveProperty("levelFive");
  });

  it.each(LEVEL_FIVE_QA_SCENARIOS.filter(scenario => !scenario.startsWith("inspection-") && !scenario.startsWith("economy") && !scenario.startsWith("integration-")))("round-trips the synthetic %s contract twice with no new finance/learning/actors", scenario => {
    let state = createLevelFiveStateQaState(scenario);
    const original = structuredClone(state.levelFive);
    for (let reload = 0; reload < 2; reload++) {
      const restored = deserializeGameState(serializeGameState(state), context);
      expect(restored.levelFive).toEqual(original);
      for (const key of ["cashCents", "clinicalXp", "learningHistories", "reviewIntents", "settlements", "serviceIncomeReceipts", "operationReceipts",
        "rooms", "doors", "employees", "encounters", "retailExternalActors", "serviceOperations", "events", "levelFourCompletion"] as const) {
        // Existing persistence normalizes overdue employee idle deadlines (DEFECT-M9-1).
        if (key === "employees") expect(restored.employees.map(e => [e.id, e.appearance, e.salaryPerExpenseInterval, e.morale, e.trainingLevel, e.homeRoomInstanceId]))
          .toEqual(state.employees.map(e => [e.id, e.appearance, e.salaryPerExpenseInterval, e.morale, e.trainingLevel, e.homeRoomInstanceId]));
        else expect(restored[key], key).toEqual(state[key]);
      }
      state = restored;
    }
  });

  it("has fresh independent locked defaults; goal unlock, valid low-score finish and dismissal are separate records", () => {
    const a = createLevelFiveState(), b = createLevelFiveState();
    a.management.supplierSavings.stockCents = 1;
    expect(b.management.supplierSavings.stockCents).toBe(0);
    expect(readLevelFiveState(b, 0, 0)).toEqual(b);
    expect(readLevelFiveState(undefined, 0, 0)).toBeUndefined();
    const pre = createLevelFiveStateQaState("pre-goal"), eligible = createLevelFiveStateQaState("eligible");
    expect(pre.levelFive!.inspection.status).toBe("locked");
    expect(eligible.employees).toHaveLength(1);
    expect(eligible.employees[0]!.staffRoleDefinitionId).not.toBe("staff.executive");
    expect(eligible.rooms.some(room => context.balanceRelease.facility.roomDefinitions.find(def => def.id === room.roomDefinitionId)?.unlockFacilityLevel === 5)).toBe(false);
    expect(getDisplayedClinicSatisfaction(eligible, context)).toBeGreaterThan(90);
    expect(eligible.levelFive!.progress.inspectionUnlocked).toMatchObject({ clinicalXp: 2000, averageStaffMorale: 85, employedStaffCount: 1 });
    expect(eligible.levelFive!.progress.gameFinished).toBeNull();
    const finished = createLevelFiveStateQaState("finish").levelFive!;
    expect(finished.progress.gameFinished!.firstCompletedReport.rawTotalScore).toBe(12);
    expect(finished.progress.finishPageAcknowledgedAtFacilityTick).toBeNull();
    expect(createLevelFiveStateQaState("finish-acknowledged").levelFive!.progress.finishPageAcknowledgedAtFacilityTick).toBe(3160);
    expect(createLevelFiveStateQaState("incomplete").levelFive!.progress.gameFinished).toBeNull();
    expect(createLevelFiveStateQaState("cancelled").levelFive!.progress.gameFinished).toBeNull();
  });

  // The M7b factories earn an unlock then simulate real clinic wear/travel. Removing
  // their entire foundation also erases earned goals, which legitimately changes
  // progression tips after satisfaction declines. M7b compares whole-state visual
  // on/off runs with the same earned progress in inspection-presentation.test.ts.
  it.each(LEVEL_FIVE_QA_SCENARIOS.filter(scenario => !scenario.startsWith("inspection-") && !scenario.startsWith("inspectors") && !scenario.startsWith("economy") && !scenario.startsWith("integration-") && !LEVEL_FIVE_PROGRESSION_QA_SCENARIOS.includes(scenario as LevelFiveProgressionQaScenario)))("keeps non-progression gameplay unchanged when the %s foundation records accompany a real tick", scenario => {
    const state = createLevelFiveStateQaState(scenario);
    state.paused = false;
    const control = structuredClone(state); delete control.levelFive;
    const command = { type: "ADVANCE_TICK" as const, operationId: `m1.tick.${scenario}`, advancedAtRealMs: 1000 };
    const withFoundation = gameReducer(state, command, context), withoutFoundation = gameReducer(control, command, context);
    const expectedFoundation = structuredClone(state.levelFive);
    if (scenario === "management") {
      // M4 now releases the M1 schema-only round's nonexistent employee/home.
      expectedFoundation!.management.round!.status = "cancelled";
      expectedFoundation!.management.round!.reservedContactId = null;
    }
    if (scenario === "management-completed") expectedFoundation!.management.activeTerms = null;
    // M7a activates minute observations; its dedicated full-window/clock suite
    // verifies those counters. All non-inspection foundation/gameplay stays exact.
    if (state.levelFive?.inspection.run) {
      expect(withFoundation.levelFive!.inspection.run!.accumulators.observedActiveMinutes)
        .toBe(state.levelFive.inspection.run.accumulators.observedActiveMinutes + 1);
      expectedFoundation!.inspection = structuredClone(withFoundation.levelFive!.inspection);
    }
    // M7b activates the dedicated cosmetic lane. Its own on/off tests compare
    // every other state field, including exact clinical/arrival/report evidence.
    if (withFoundation.levelFive?.inspection.status === "running") {
      expectedFoundation!.inspectionPresentation = structuredClone(withFoundation.levelFive.inspectionPresentation);
    }
    expect(withFoundation.levelFive).toEqual(expectedFoundation);
    delete withFoundation.levelFive;
    // M6 now earns an unlock on the eligible control's real tick. The dedicated
    // progression suite verifies its record/notice; all other fields stay exact.
    delete withoutFoundation.levelFive;
    withFoundation.events = withFoundation.events.filter(event => event.id !== LEVEL_FIVE_INSPECTION_UNLOCK_EVENT_ID);
    withoutFoundation.events = withoutFoundation.events.filter(event => event.id !== LEVEL_FIVE_INSPECTION_UNLOCK_EVENT_ID);
    expect(withFoundation).toEqual(withoutFoundation);
  });

  it("preserves overdue accepted clocks, fractional effects and duplicate logical route knots", () => {
    const state = createLevelFiveStateQaState("management-completed");
    state.facilityTick = 1300;
    const restored = deserializeGameState(serializeGameState(state), context);
    expect(restored.levelFive!.management).toEqual(state.levelFive!.management);
    expect(restored.levelFive!.management.activeTerms!.expiresAtFacilityTick).toBe(1200);
    const actors = createLevelFiveStateQaState("actors"), actor = actors.levelFive!.inspectionPresentation.actors[0]!;
    actor.path = [actor.location, { ...actor.location }, { x: actor.location.x + 1, y: actor.location.y }];
    actor.pathIndex = 1; actor.phase = "walking";
    expect(deserializeGameState(serializeGameState(actors), context).levelFive!.inspectionPresentation.actors[0]).toEqual(actor);
  });

  it("retains an earned unlock after current conditions decline and histories disappear", () => {
    const state = createLevelFiveStateQaState("eligible");
    const earned = structuredClone(state.levelFive!.progress.inspectionUnlocked);
    state.clinicalXp = 0; state.employees = []; state.encounters = {};
    state.rooms = state.rooms.filter(room => room.roomDefinitionId !== "room.waiting");
    state.levelFourCompletion = { version: "level-four-completion.v1", pediatricVisitWithParent: null,
      woundOstomyCareVisit: null, acknowledgedAtFacilityTick: null };
    expect(deserializeGameState(serializeGameState(state), context).levelFive!.progress.inspectionUnlocked).toEqual(earned);
  });

  it("keeps raw fractional preparation quotes without repricing, even when their deadline is overdue", () => {
    const state = createLevelFiveStateQaState("preparing"), quote = state.levelFive!.inspection.preparation!;
    quote.rawDurationMinutes = 56.25; quote.durationMinutes = 57; quote.endsAtFacilityTick = 157;
    quote.executiveQuote = { roundId: "round.retired.executive", employeeId: "employee.retired.executive", employeeTrainingLevel: 2, reductionPercent: 6.25 };
    state.facilityTick = 200;
    expect(deserializeGameState(serializeGameState(state), context).levelFive!.inspection.preparation).toEqual(quote);
  });

  it("retains first/best reports and dismissal when a later valid report is lower or equal", () => {
    for (const scenario of ["finish", "report"] as const) {
      const state = createLevelFiveStateQaState("report"), first = structuredClone(state.levelFive!.progress.gameFinished!);
      const later = structuredClone(createLevelFiveStateQaState(scenario).levelFive!.inspection.lastReport!);
      later.runId = "inspection.qa.level5.retry"; later.startedAtFacilityTick = 3200; later.endedAtFacilityTick = 6200;
      state.facilityTick = 6200; state.levelFive!.inspection.lastReport = later;
      state.levelFive!.inspection.latestCompletedReport = structuredClone(later);
      const saved = deserializeGameState(serializeGameState(state), context).levelFive!;
      expect(saved.progress.gameFinished).toEqual(first);
      expect(saved.progress.finishPageAcknowledgedAtFacilityTick).toBe(3160);
      expect(saved.inspection.bestCompletedReport!.runId).toBe(first.firstCompletedInspectionRunId);
      expect(saved.inspection.latestCompletedReport!.runId).toBe(later.runId);
    }
  });

  it("retains run-local question/answer IDs after patient/discussion records are retired", () => {
    const state = createLevelFiveStateQaState("running"), evidence = state.levelFive!.inspection.run!.accumulators;
    evidence.completedPatientCount = 1; evidence.patientSatisfactionCount = 1; evidence.patientSatisfactionSum = 90;
    evidence.settledEncounterIds = ["encounter.retired"];
    evidence.qualifyingCompletedEncounterIds = ["encounter.retired"];
    evidence.presentedQuestions = [{ id: "presentation.retired", kind: "encounter", subjectId: "encounter.retired",
      decisionNodeId: "node.retired", presentedAtFacilityTick: 160, firstAnswer: { id: "answer.retired", answeredAtFacilityTick: 165, correct: false } },
      { id: "presentation.discussion", kind: "employee_discussion", subjectId: "discussion.retired", decisionNodeId: "node.discussion",
        presentedAtFacilityTick: 166, firstAnswer: null }];
    const restored = deserializeGameState(serializeGameState(state), context);
    expect(restored.levelFive!.inspection.run!.accumulators).toEqual(evidence);
    expect(restored.encounters).toEqual({});
    const duplicate = rawSave(state);
    duplicate.levelFive.inspection.run.accumulators.presentedQuestions.push({ ...evidence.presentedQuestions[0], id: "presentation.duplicate" });
    expect(() => deserializeGameState(JSON.stringify(duplicate), context)).toThrow(/multiple evidence IDs/);
  });

  it("retains frozen diagnostic quotes and receipt/still identities with the optional default extension", () => {
    const fixture = timingFixture();
    const quote = planDiagnosticOrder(fixture.state, { orderId: "order.level5.legacy", encounterId: fixture.encounter.id,
      serviceId: "service.basic_labs", patientOrigin: fixture.encounter.patientLocation! }, fixture.context);
    if (quote.kind !== "planned") throw new Error(quote.reason);
    fixture.encounter.pendingResult = pending(quote.plan);
    fixture.state.levelFive = createLevelFiveState();
    const restored = deserializeGameState(serializeGameState(fixture.state), fixture.context);
    expect(restored.encounters[fixture.encounter.id]!.pendingResult!.diagnosticTiming).toEqual(quote.plan);
    expect(restored.encounters[fixture.encounter.id]!.patientAppearance).toEqual(fixture.encounter.patientAppearance);
    expect(restored.serviceIncomeReceipts).toEqual(fixture.state.serviceIncomeReceipts);
  });

  const invalid: Array<[string, typeof LEVEL_FIVE_QA_SCENARIOS[number], Mutation]> = [
    ["unknown foundation version", "pre-goal", r => { r.levelFive.version = "level-five-state.v2"; }],
    ["null extension", "pre-goal", r => { r.levelFive = null; }],
    ["missing defaults", "pre-goal", r => { delete r.levelFive.management; }],
    ["unknown field", "pre-goal", r => { r.levelFive.awardCash = 100; }],
    ["negative savings", "pre-goal", r => { r.levelFive.management.supplierSavings.stockCents = -1; }],
    ["unearned XP unlock", "eligible", r => { r.levelFive.progress.inspectionUnlocked.clinicalXp = 1999; }],
    ["satisfaction exactly 90", "eligible", r => { r.levelFive.progress.inspectionUnlocked.displayedSatisfaction = 90; }],
    ["morale below 85", "eligible", r => { r.levelFive.progress.inspectionUnlocked.averageStaffMorale = 84.99; }],
    ["empty workforce unlock", "eligible", r => { r.levelFive.progress.inspectionUnlocked.employedStaffCount = 0; }],
    ["future unlock tick", "eligible", r => { r.levelFive.progress.inspectionUnlocked.earnedAtFacilityTick = 101; }],
    ["ready without unlock", "pre-goal", r => { r.levelFive.inspection.status = "ready"; }],
    ["unknown status", "pre-goal", r => { r.levelFive.inspection.status = "passed"; }],
    ["premature dismissal", "eligible", r => { r.levelFive.progress.finishPageAcknowledgedAtFacilityTick = 100; }],
    ["future management version", "management", r => { r.levelFive.management.round.version = "daily-management-round.v2"; }],
    ["invalid training tier", "management", r => { r.levelFive.management.round.employeeTrainingLevel = 6; }],
    ["excess remaining work", "management", r => { r.levelFive.management.round.remainingWorkMinutes = 31; }],
    ["unearned round effects", "management", r => { r.levelFive.management.round.effectsAppliedAtFacilityTick = 602; }],
    ["missing completion marker", "management-completed", r => { r.levelFive.management.round.effectsAppliedAtFacilityTick = null; }],
    ["term/round mismatch", "management-completed", r => { r.levelFive.management.activeTerms.employeeId = "different.employee"; }],
    ["repriced preparation clock", "preparing", r => { r.levelFive.inspection.preparation.endsAtFacilityTick++; }],
    ["preparation before goals", "preparing", r => { r.levelFive.progress.inspectionUnlocked.earnedAtFacilityTick = 110; }],
    ["two active phases", "running", r => { r.levelFive.inspection.preparation = createLevelFiveStateQaState("preparing").levelFive!.inspection.preparation; }],
    ["shortened scored window", "running", r => { r.levelFive.inspection.run.durationMinutes = 2999; }],
    ["future observation", "running", r => { r.levelFive.inspection.run.lastObservedAtFacilityTick = 171; }],
    ["too many observed minutes", "running", r => { r.levelFive.inspection.run.accumulators.observedActiveMinutes = 11; }],
    ["duplicate room denominator", "running", r => { r.levelFive.inspection.run.requiredRoomDefinitionIds.push(r.levelFive.inspection.run.requiredRoomDefinitionIds[0]); }],
    ["duplicate staff position", "running", r => { r.levelFive.inspection.run.baselineStaffPositions.push(r.levelFive.inspection.run.baselineStaffPositions[0]); }],
    ["overdue above total queue", "running", r => { r.levelFive.inspection.run.accumulators.overdueQueueMinutes = 1; }],
    ["paid above charged costs", "running", r => { r.levelFive.inspection.run.accumulators.paidOperatingExpenseCents = 1; }],
    ["qualifying patient without settlement", "running", r => { r.levelFive.inspection.run.accumulators.qualifyingCompletedEncounterIds = ["retired.patient"]; }],
    ["partial completed sample", "finish", r => { r.levelFive.inspection.lastReport.qualifyingScoredPatientCount = 19; }],
    ["partial completed window", "finish", r => { r.levelFive.inspection.lastReport.observedActiveMinutes = 2999; }],
    ["missing category", "finish", r => { r.levelFive.inspection.lastReport.categories.pop(); }],
    ["duplicate category", "finish", r => { r.levelFive.inspection.lastReport.categories[1] = r.levelFive.inspection.lastReport.categories[0]; }],
    ["changed category weight", "finish", r => { r.levelFive.inspection.lastReport.categories[0].weightPercent = 11; }],
    ["changed weighted points", "finish", r => { r.levelFive.inspection.lastReport.categories[0].weightedPoints = 3; }],
    ["wrong total", "finish", r => { r.levelFive.inspection.lastReport.rawTotalScore = 80; }],
    ["wrong recognition", "finish", r => { r.levelFive.inspection.lastReport.recognition = "perfect"; }],
    ["conflicting frozen same-run report", "finish", r => { r.levelFive.inspection.latestCompletedReport.categories[0].improvementHint = "Changed snapshot"; }],
    ["incomplete prestige", "incomplete", r => { r.levelFive.inspection.lastReport.rawTotalScore = 85; r.levelFive.inspection.lastReport.recognition = "prestige"; }],
    ["incomplete first finish", "incomplete", r => { r.levelFive.progress.gameFinished = createLevelFiveStateQaState("finish").levelFive!.progress.gameFinished; }],
    ["ack before finish", "finish", r => { r.levelFive.progress.finishPageAcknowledgedAtFacilityTick = 3159; }],
    ["mismatched first run", "finish", r => { r.levelFive.progress.gameFinished.firstCompletedInspectionRunId = "another.run"; }],
    ["actor outside active run", "actors", r => { r.levelFive.inspectionPresentation.runId = "another.run"; }],
    ["duplicate inspector", "actors", r => { r.levelFive.inspectionPresentation.actors[1] = r.levelFive.inspectionPresentation.actors[0]; }],
    ["unapproved inspector look", "actors", r => { r.levelFive.inspectionPresentation.actors[0].stillId = "inspector-v6f.011"; }],
    ["bad path index", "actors", r => { r.levelFive.inspectionPresentation.actors[0].pathIndex = 1; }],
    ["invalid route point", "actors", r => { r.levelFive.inspectionPresentation.actors[0].location.x = "bad"; }],
    ["earned state at Level 4", "eligible", r => { r.facilityLevel = 4; }],
  ];
  it.each(invalid)("rejects %s instead of silently dropping or repairing new state", (_label, scenario, mutate) => {
    const raw = rawSave(createLevelFiveStateQaState(scenario)); mutate(raw);
    expect(() => deserializeGameState(JSON.stringify(raw), context)).toThrow(/Level 5 state is invalid/);
  });
});
