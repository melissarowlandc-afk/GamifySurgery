import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, gameReducer, getFacilityProgressionStatus,
  getInspectionBookingBlockedReason, serializeGameState, type GameState, type InspectionReportState,
} from "../src";
import { createPreLevelFiveLaunchContext } from "../../../tests/fixtures/level-five-launch";
import { createLevelFiveIntegrationQaState, LEVEL_FIVE_INTEGRATION_QA_SCENARIOS } from "../../../tests/fixtures/level-five-integration-qa";
import { LevelFiveIntegrationJourney, integrationReviewTime } from "../../../tests/fixtures/level-five-integration";
import legacy from "../../../tests/fixtures/level-five-legacy-behavior-20261012.json";
import checkpoints from "../../../tests/fixtures/level-five-integration-checkpoints-20261012.json";

const context = PROTOTYPE_DOMAIN_CONTEXT;
const stateOf = (scenario: typeof LEVEL_FIVE_INTEGRATION_QA_SCENARIOS[number]) => createLevelFiveIntegrationQaState(scenario, context);
const evidence = () => JSON.parse(readFileSync(new URL("../../../tools/qa/level-five-integration-results-20261012.json", import.meta.url), "utf8")) as {
  inputs: Record<string, string>; commandsReconciled: number; openingCashCents: number; closingCashCents: number;
  replayCompatibleInputs?: Record<string, { actualRunHash: string; currentHash: string; reason: string }>;
  artifactInputs?: Record<string, string>;
  grossCents: number; stockCents: number; paidOperatingCents: number; capitalCents: number;
  completedDailyRounds: number; positiveComfortUses: number; reports: InspectionReportState[];
};

describe("M9 connected Level 5 reducer journey", () => {
  it("binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash", () => {
    const run = evidence();
    for (const [file, hash] of Object.entries(run.artifactInputs ?? {}))
      expect(createHash("sha256").update(readFileSync(new URL(`../../../${file}`, import.meta.url))).digest("hex"), file).toBe(hash);
    if (run.replayCompatibleInputs) expect(Object.keys(run.replayCompatibleInputs)).toEqual(["packages/game-domain/src/persistence.ts"]);
    for (const [file, hash] of Object.entries(run.inputs)) {
      const compatible = run.replayCompatibleInputs?.[file];
      if (compatible) {
        expect(file).toBe("packages/game-domain/src/persistence.ts");
        expect(compatible.actualRunHash).toBe(hash);
      }
      let source = readFileSync(new URL(`../../../${file}`, import.meta.url), "utf8");
      if (file === "packages/balance-config/src/prototype-balance.ts" &&
          hash === "ef17332a37b98726aaee97240bb878a4b88deadfba19c4ef944f565fb9316af2") {
        // Only the historical pre-M10 hash needs the exact launch switch
        // restored. Fresh runs bind the current file without transformation.
        source = source.replace('import { LEVEL_FIVE_STAGE_DEFINITION } from "./level-five-progression";\n', "")
          .replace("maximumPlayableLevel: 5,", "maximumPlayableLevel: 4,")
          .replace("        nextFacilityLevel: 5,\n      },\n      LEVEL_FIVE_STAGE_DEFINITION,", "        nextFacilityLevel: null,\n      },");
      }
      expect(createHash("sha256").update(source).digest("hex"), file).toBe(compatible?.currentHash ?? hash);
    }
    expect(run.commandsReconciled).toBeGreaterThan(20_000);
    expect(run.closingCashCents).toBe(run.openingCashCents + run.grossCents - run.stockCents - run.paidOperatingCents - run.capitalCents);
    expect(run.completedDailyRounds).toBeGreaterThan(0); expect(run.positiveComfortUses).toBeGreaterThan(0);
    expect(run.reports).toHaveLength(3);
  });

  it("loads a reducer-earned mature Level 4 save unchanged and advances at the ordinary cap 5", () => {
    const old = stateOf("integration-l4"), encoded = serializeGameState(old);
    const live = deserializeGameState(encoded), qa = deserializeGameState(encoded, context);
    expect(live).toEqual(qa); expect(live).not.toHaveProperty("levelFive");
    expect(qa.clinicalXp).toBeGreaterThanOrEqual(750);
    expect(qa.levelFourCompletion!.pediatricVisitWithParent!.completedAtFacilityTick).toBeGreaterThan(0);
    expect(qa.levelFourCompletion!.woundOstomyCareVisit!.completedAtFacilityTick).toBeGreaterThan(0);
    expect(getFacilityProgressionStatus(qa, context).requirements.every(g => g.met)).toBe(true);
    const blocked = gameReducer(live, { type: "LEVEL_UP", operationId: "m9.live.advance" }, createPreLevelFiveLaunchContext());
    expect(blocked.operationReceipts["m9.live.advance"]!.status).toBe("rejected"); expect(blocked.facilityLevel).toBe(4);
    const advance = { type: "LEVEL_UP" as const, operationId: "m9.qa.advance" };
    const next = gameReducer(qa, advance, context);
    expect(next.facilityLevel).toBe(5); expect(next.clinicalXp).toBe(0);
    for (const key of ["cashCents", "rooms", "doors", "employees", "encounters", "learningHistories", "reviewIntents", "settlements", "serviceIncomeReceipts", "levelFourCompletion"] as const)
      expect(next[key], key).toEqual(qa[key]);
    expect(gameReducer(next, advance, context)).toBe(next);
    const twice = gameReducer(deserializeGameState(serializeGameState(next), context), { ...advance, operationId: "m9.qa.again" }, context);
    expect(twice.facilityLevel).toBe(5); expect(twice.clinicalXp).toBe(0);
    expect(twice.operationReceipts["m9.qa.again"]!.status).toBe("rejected");
    expect(twice.events.filter(event => event.id === "event.facility-level.5")).toHaveLength(1);
  });

  it("builds all five approved rooms and hires the $45 Executive before earning the three goals", () => {
    const opening = stateOf("integration-build"), preparing = stateOf("integration-preparing");
    expect(opening.clinicalXp).toBe(0); expect(opening.levelFive!.progress.inspectionUnlocked).toBeNull();
    for (const [id, width, height] of [["room.founder_office", 3, 3], ["room.executive_office", 3, 2], ["room.gift_shop", 3, 3], ["room.indoor_garden", 4, 4], ["room.staff_gym", 4, 4]] as const) {
      const room = opening.rooms.find(r => r.roomDefinitionId === id)!;
      expect(opening.rooms.filter(r => r.roomDefinitionId === id)).toHaveLength(1);
      expect(context.balanceRelease.facility.roomDefinitions.find(r => r.id === id)).toMatchObject({ width, height });
      expect(opening.doors.some(d => d.roomId === room.id)).toBe(true);
    }
    expect(opening.employees.find(e => e.staffRoleDefinitionId === "staff.executive")!.salaryPerExpenseInterval).toBe(45);
    expect(getInspectionBookingBlockedReason(opening, context)).toContain("all three");
    const rejected = gameReducer(opening, { type: "BOOK_INSPECTION", operationId: "m9.before-goals" }, context);
    expect(rejected.operationReceipts["m9.before-goals"]!.status).toBe("rejected");
    expect(preparing.levelFive!.progress.inspectionUnlocked).toMatchObject({ clinicalXp: expect.any(Number), displayedSatisfaction: expect.any(Number) });
    expect(preparing.levelFive!.progress.inspectionUnlocked!.clinicalXp).toBeGreaterThanOrEqual(2000);
    expect(preparing.levelFive!.progress.inspectionUnlocked!.displayedSatisfaction).toBeGreaterThan(90);
    expect(preparing.levelFive!.progress.inspectionUnlocked!.averageStaffMorale).toBeGreaterThanOrEqual(85);
    expect(preparing.levelFive!.progress.gameFinished).toBeNull();
    expect(preparing.levelFive!.management.supplierSavings.stockCents).toBeGreaterThan(0);
    expect(preparing.levelFive!.management.supplierSavings.upkeepSixtiethCents).toBeGreaterThan(0);
    expect(stateOf("integration-running").levelFive!.inspectionPresentation.actors).toHaveLength(10);
  });

  it.each(["integration-final", "integration-repeat-final"] as const)("settles %s by a real final minute, preserves prestige and creates no finish payout", scenario => {
    const initial = stateOf(scenario);
    const played = gameReducer(initial, { type: "SET_PAUSED", paused: false, operationId: "m9.final.play" }, context);
    const next = gameReducer(played, { type: "ADVANCE_TICK", operationId: "m9.final.minute",
      advancedAtRealMs: integrationReviewTime(played, played.facilityTick + 1) }, context);
    const report = next.levelFive!.inspection.lastReport!;
    expect(report).toEqual(evidence().reports[scenario === "integration-final" ? 0 : 1]);
    expect(report.observedActiveMinutes).toBe(3000); expect(report.qualifyingScoredPatientCount).toBeGreaterThanOrEqual(20);
    expect(report.categories.map(c => c.weightPercent)).toEqual([10, 10, 10, 10, 10, 10, 10, 5, 5, 20]);
    expect(report.rawTotalScore).toBeCloseTo(report.categories.reduce((sum, c) => sum + c.weightedPoints!, 0), 10);
    expect(next.levelFive!.inspectionPresentation.actors).toHaveLength(0);
    expect(next.levelFive!.inspection.bestCompletedReport).toEqual(report);
    expect(next.levelFive!.progress.gameFinished!.firstCompletedReport).toEqual(evidence().reports[0]);
    expect(next.clinicalXp).toBe(played.clinicalXp);
    expect(next.events.filter(e => e.id === "event.level-five.game-finished")).toHaveLength(1);
    expect(next.events.find(e => e.id === "event.level-five.game-finished")!.reward).toBeUndefined();
    expect(gameReducer(next, { type: "ADVANCE_TICK", operationId: "m9.final.minute" }, context)).toBe(next);
  });

  it.each(["integration-preparing", "integration-running", "integration-final", "integration-finish"] as const)("matches continued play after save/reload at %s", scenario => {
    // Use the unnormalized continuous-play checkpoint, not a QA factory that
    // has already passed through the reader and could conceal a clock reset.
    const before = structuredClone(checkpoints[scenario]) as unknown as GameState;
    const loaded = deserializeGameState(serializeGameState(before), context);
    expect(loaded.levelFive).toEqual(before.levelFive);
    for (const employee of before.employees)
      expect(loaded.employees.find(e => e.id === employee.id)!.nextIdleActionAtFacilityTick).toBe(employee.nextIdleActionAtFacilityTick);
    for (const encounter of Object.values(before.encounters))
      expect(loaded.encounters[encounter.id]!.nextIdleActionAtFacilityTick).toBe(encounter.nextIdleActionAtFacilityTick);
    const control = new LevelFiveIntegrationJourney(context, before), resumed = new LevelFiveIntegrationJourney(context, loaded);
    for (const branch of [control, resumed]) {
      if (scenario === "integration-finish") branch.apply({ type: "ACKNOWLEDGE_FINISH_PAGE" });
      branch.apply({ type: "SET_PAUSED", paused: false });
    }
    for (let minute = 0; minute < 120; minute++) {
      for (const branch of [control, resumed]) { branch.pump(); branch.tick(); }
      // Persistence has legacy absent/null shape normalization. Comparing the
      // canonical serialized forms still detects changed clocks or gameplay.
      expect(deserializeGameState(serializeGameState(resumed.state), context), `minute ${minute}`)
        .toEqual(deserializeGameState(serializeGameState(control.state), context));
    }
  }, 30_000);

  it("continues normal operations, completes a genuinely lower retry and retains the higher best and first finish", () => {
    const opening = stateOf("integration-repeat"), first = structuredClone(opening.levelFive!.progress.gameFinished);
    const journey = new LevelFiveIntegrationJourney(context, opening); journey.accuracy = 0;
    let newFinishNotices = 0;
    const observe = (action: () => void) => {
      const had = journey.state.events.some(e => e.id === "event.level-five.game-finished");
      action();
      if (!had && journey.state.events.some(e => e.id === "event.level-five.game-finished")) newFinishNotices++;
    };
    journey.apply({ type: "BOOK_INSPECTION" }); journey.apply({ type: "SET_PAUSED", paused: false });
    for (let i = 0; i < 3061 && ["preparing", "running"].includes(journey.state.levelFive!.inspection.status); i++) { observe(() => journey.pump()); observe(() => journey.tick()); }
    const inspection = journey.state.levelFive!.inspection;
    expect(inspection.lastReport!.outcome).toBe("completed");
    expect(inspection.lastReport!.rawTotalScore).toBeLessThan(opening.levelFive!.inspection.bestCompletedReport!.rawTotalScore!);
    expect(inspection.latestCompletedReport).toEqual(inspection.lastReport);
    expect(inspection.bestCompletedReport).toEqual(opening.levelFive!.inspection.bestCompletedReport);
    expect(journey.state.levelFive!.progress.gameFinished).toEqual(first);
    expect(journey.state.levelFive!.progress.finishPageAcknowledgedAtFacilityTick).toBe(opening.levelFive!.progress.finishPageAcknowledgedAtFacilityTick);
    // Ordinary event retirement can remove the old notice. It cannot emit
    // another one or remove the durable first-completed record.
    expect(newFinishNotices).toBe(0);
    expect(journey.state.retiredServiceHistory!.retiredReceiptCount).toBeGreaterThan(opening.retiredServiceHistory!.retiredReceiptCount);
  }, 300_000);

  it("cancels real preparation and running checkpoints without a report, finish or prestige", () => {
    for (const scenario of ["integration-preparing", "integration-running"] as const) {
      const initial = stateOf(scenario), cancelled = gameReducer(initial, { type: "CANCEL_INSPECTION", operationId: "m9.cancel" }, context);
      expect(cancelled.levelFive!.inspection.status).toBe("cancelled");
      expect(cancelled.levelFive!.inspection.bestCompletedReport).toBeNull();
      expect(cancelled.levelFive!.progress.gameFinished).toBeNull();
      expect(cancelled.levelFive!.inspectionPresentation.actors).toHaveLength(0);
      expect(cancelled.clinicalXp).toBe(initial.clinicalXp); expect(cancelled.cashCents).toBe(initial.cashCents);
    }
  });
});

describe("M9 Level 0-4 intake behavior after the ordinary cap-5 switch", () => {
  it.each(legacy.rows.flatMap(row => [5, 6, 7, 8, 9].map(schema => ({ ...row, schema }))))("matches the actual pre-M9 load and next 120 minutes for level $level/schema $schema", row => {
    const raw = JSON.parse(row.serializedInput); raw.schemaVersion = row.schema;
    let state = deserializeGameState(JSON.stringify(raw));
    expect(createHash("sha256").update(JSON.stringify(state)).digest("hex")).toBe(row.loadedHashes[String(row.schema) as keyof typeof row.loadedHashes]);
    expect(state).not.toHaveProperty("levelFive");
    state = gameReducer(state, { type: "SET_PAUSED", paused: false, operationId: "m9.legacy.play" });
    for (let i = 0; i < legacy.minutes; i++) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `m9.legacy.minute.${i}`, advancedAtRealMs: (i + 1) * 1000 });
    expect(state).toEqual(row.after); expect(state).not.toHaveProperty("levelFive");
    expect(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.maximumPlayableLevel).toBe(5);
  });
});
