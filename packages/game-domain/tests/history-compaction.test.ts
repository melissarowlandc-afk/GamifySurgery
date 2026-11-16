import { describe, expect, it } from "vitest";
import { applyFsrsReview, applyGameEvidenceCommand, captureClinicDaySummary, compactCampaignHistory, compactGameState,
  createGameEvidenceCheckpoint, createInitialGameState, deserializeGameState, exportGameEvidence, gameReducer,
  getConceptReviewCount, getReviewIntentCount, getRollingIncomeSummary, getServiceIncomeTotalsCents,
  getPatientEncounterIncomeCents, getSettlementCount, importGameEvidence, PROTOTYPE_DOMAIN_CONTEXT,
  restoreGameEvidenceImportSource, serializeGameState, getCurrentQuestion, type GameState } from "../src";
import { createHistoryCompactionFixture, outsideReadReceipt } from "../../../tests/fixtures/history-compaction";

describe("owner-approved current-state history compaction", () => {
  it("retains three recent logs, exact counts and every FSRS card/due byte, including the next review", () => {
    const state = createHistoryCompactionFixture(), source = serializeGameState(state);
    const compact = compactGameState(state);
    expect(serializeGameState(state)).toBe(source);
    for (const [id, before] of Object.entries(state.learningHistories)) {
      const after = compact.learningHistories[id]!;
      expect(JSON.stringify(after.card)).toBe(JSON.stringify(before.card));
      expect(after.card.dueAtMs).toBe(before.card.dueAtMs);
      expect(after.reviews).toEqual(before.reviews.slice(-3));
      expect(getConceptReviewCount(after)).toBe(before.reviews.length);
      expect(applyFsrsReview(after.card, "Good", 100 * 86_400_000, PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.learning))
        .toEqual(applyFsrsReview(before.card, "Good", 100 * 86_400_000, PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.learning));
    }
    expect(compactGameState(compact)).toBe(compact);
  });

  it("keeps 20 newest filed discussions and every open, travelling, unanswered or live-referenced subject", () => {
    const state = createHistoryCompactionFixture();
    const rows = Object.values(state.employeeDiscussions!);
    rows[0]!.lifecycle = "waiting_unopened"; rows[1]!.lifecycle = "active_traveling";
    rows[2]!.lifecycle = "feedback_pending"; rows[3]!.lifecycle = "resolved_summary_available";
    state.openEmployeeDiscussionId = rows[4]!.id;
    rows[5]!.answers = []; rows[5]!.steps = []; // malformed legacy filed-but-unanswered subject stays safe
    const compact = compactGameState(state);
    for (const row of rows.slice(0, 6)) expect(compact.employeeDiscussions![row.id]).toEqual(row);
    expect(Object.keys(compact.employeeDiscussions!)).toHaveLength(26);
    expect(Object.values(compact.employeeDiscussions!).filter(row => Number(row.id.split(".").at(-1)) >= 60)).toHaveLength(20);
  });

  it("preserves lifetime, exact rolling-window sources, daily totals and default score offsets", () => {
    const state = createHistoryCompactionFixture();
    const before = { total: getServiceIncomeTotalsCents(state), rolling: getRollingIncomeSummary(state),
      patient: getPatientEncounterIncomeCents(state), daily: captureClinicDaySummary(state),
      intents: getReviewIntentCount(state), settlements: getSettlementCount(state) };
    const compact = compactGameState(state);
    expect(getServiceIncomeTotalsCents(compact)).toEqual(before.total);
    expect(getRollingIncomeSummary(compact)).toEqual(before.rolling);
    expect(getPatientEncounterIncomeCents(compact)).toBe(before.patient);
    expect(captureClinicDaySummary(compact)).toEqual(before.daily);
    expect(getReviewIntentCount(compact)).toBe(before.intents); expect(getSettlementCount(compact)).toBe(before.settlements);
    expect(compact.reviewIntents.length).toBe(32); expect(compact.settlements).toHaveLength(0);
    const newest = (s: GameState) => s.serviceIncomeReceipts.slice(-8);
    expect(newest(compact)).toEqual(newest(state));
    const expired = { ...compact, facilityTick: compact.facilityTick + 601 };
    const totals = getServiceIncomeTotalsCents(expired);
    const retired = compactGameState(expired);
    expect(getServiceIncomeTotalsCents(retired)).toEqual(totals);
    expect(retired.historyCompaction!.outsideReadReceipts).toHaveLength(0);
  });

  it("keeps filed-chart settlements and the whole three-day competition window", () => {
    const state = createHistoryCompactionFixture();
    state.settlements[0]!.encounterId = Object.keys(state.encounters)[0]!;
    state.settlements[1]!.settledAtFacilityTick = state.facilityTick - 1799;
    const compact = compactGameState(state);
    expect(compact.settlements).toEqual(state.settlements.slice(0, 2));
  });

  it("retires only orphan departed families, spending/clocks, removed-target observations and retired-source use keys", () => {
    const state = createHistoryCompactionFixture();
    const child = Object.keys(state.encounters)[0]!;
    state.pediatricFamilies = Object.fromEntries(["orphan", "live", "walking"].map(id => [id, {
      version: "pediatric-family.v1", id, child: { kind: "encounter", id: id === "live" ? child : "absent" },
      parentActorId: `parent.${id}`, phase: id === "walking" ? "departing" : "departed", reservation: null,
    }])) as GameState["pediatricFamilies"];
    state.retailNextOpportunityTicks = { "encounter:absent": 12, [`encounter:${child}`]: 17, "founder:founder": 30 };
    state.patientAmenityNextOpportunityTicks = { "companion:absent": 20 };
    state.retailActorLedgers = { "companion:absent": { spent: 1 } } as unknown as GameState["retailActorLedgers"];
    const tips = state.alertHumor.guidanceTips!;
    tips.observations["room:absent"] = { signature: "old", changedAtTick: 1 };
    tips.observations[`room:${state.rooms[0]!.id}`] = { signature: "live", changedAtTick: 2 };
    state.levelThreeMaintenanceAppliedUseKeys = ["service:absent:phase:1", "retail:absent", "unknown-legacy-key"];
    const compact = compactGameState(state);
    expect(Object.keys(compact.pediatricFamilies!)).toEqual(["live", "walking"]);
    expect(compact.retailNextOpportunityTicks).toEqual({ [`encounter:${child}`]: 17, "founder:founder": 30 });
    expect(compact.retailActorLedgers).toEqual({}); expect(compact.patientAmenityNextOpportunityTicks).toEqual({});
    expect(compact.alertHumor.guidanceTips!.observations["room:absent"]).toBeUndefined();
    expect(compact.alertHumor.guidanceTips!.observations[`room:${state.rooms[0]!.id}`]).toEqual({ signature: "live", changedAtTick: 2 });
    expect(compact.levelThreeMaintenanceAppliedUseKeys).toEqual(["unknown-legacy-key"]);
  });

  it("bounds a synthetic long campaign below 2 MB and migrates idempotently", () => {
    const state = createHistoryCompactionFixture(200, 20);
    const compact = compactGameState(state);
    expect(Buffer.byteLength(serializeGameState(state))).toBeGreaterThan(2_000_000);
    expect(Buffer.byteLength(serializeGameState(compact))).toBeLessThan(2_000_000);
    const loaded = deserializeGameState(serializeGameState(compact));
    expect(Buffer.byteLength(serializeGameState(loaded))).toBeLessThan(2_000_000);
    for (const [id, history] of Object.entries(compact.learningHistories)) expect(loaded.learningHistories[id]).toEqual(history);
    expect(compactGameState(loaded)).toBe(loaded);
    loaded.paused = false; loaded.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    loaded.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER; loaded.serviceAppointmentsEnabled = false;
    let continued = loaded;
    for (let n = 0; n < 120; n++) {
      continued = gameReducer(continued, { type: "ADVANCE_TICK", operationId: `long.compact.${n}` });
      expect(Buffer.byteLength(serializeGameState(continued))).toBeLessThan(2_000_000);
    }
  }, 60_000);

  it("retains a verifiable immutable source and exact review-prefix compaction chain across reload/replay", () => {
    const state = createHistoryCompactionFixture(8, 1);
    state.paused = false; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER; state.serviceAppointmentsEnabled = false;
    const source = serializeGameState(state), before = createGameEvidenceCheckpoint(state);
    const command = { type: "ADVANCE_TICK" as const, operationId: "compaction.proof.tick", advancedAtRealMs: 100 * 86_400_000 };
    const result = applyGameEvidenceCommand(before, command);
    expect(serializeGameState(result.state)).toBe(serializeGameState(gameReducer(state, command)));
    expect(serializeGameState(importGameEvidence(result.checkpoint.snapshot, exportGameEvidence(result.checkpoint))))
      .toBe(serializeGameState(result.state));
    expect(restoreGameEvidenceImportSource(result.checkpoint.evidence)).toEqual(JSON.parse(source));
    expect(serializeGameState(state)).toBe(source);
    expect(applyGameEvidenceCommand(result.checkpoint, command).replayed).toBe(true);
    const tampered = JSON.parse(JSON.stringify(result.checkpoint));
    const transition = tampered.evidence.records.find((row: {kind: string}) => row.kind === "transition");
    transition.value.learningChanges[0].compactedReviews.pop();
    expect(() => importGameEvidence(tampered.snapshot, tampered.evidence)).toThrow();
  }, 60_000);

  it("keeps a still-creditable outside read's transaction key", () => {
    const state = createHistoryCompactionFixture();
    state.outsideRadiologyReads = [{ sequence: 0 }] as GameState["outsideRadiologyReads"];
    expect(compactGameState(state).serviceIncomeReceipts).toContainEqual(state.serviceIncomeReceipts[0]);
  });

  it("preserves legacy duplicate payment semantics instead of combining incompatible totals", () => {
    const state = createHistoryCompactionFixture();
    state.settlements.push({ ...state.settlements[0]!, netCashDelta: 123 });
    state.serviceIncomeReceipts.push({ ...state.serviceIncomeReceipts[0]!, id: "duplicate.read", completedAtFacilityTick: state.facilityTick - 20 });
    const before = { income: getPatientEncounterIncomeCents(state), rolling: getRollingIncomeSummary(state), daily: captureClinicDaySummary(state) };
    const compact = compactGameState(state);
    expect(compact.settlements.filter(row => row.id === state.settlements[0]!.id)).toHaveLength(2);
    expect(compact.serviceIncomeReceipts.filter(row => row.transactionKey === state.serviceIncomeReceipts[0]!.transactionKey)).toHaveLength(2);
    expect({ income: getPatientEncounterIncomeCents(compact), rolling: getRollingIncomeSummary(compact), daily: captureClinicDaySummary(compact) }).toEqual(before);
  });

  it("accepts the next answer after prefix compaction and rejects duplicate first answers without changing its card", () => {
    let state = createInitialGameState(undefined, { createdAtRealMs: 0 });
    const id = Object.keys(state.encounters)[0]!;
    state = gameReducer(state, { type: "SET_PAUSED", paused: false, operationId: "compact.answer.play" });
    for (let n = 0; n < 250 && !getCurrentQuestion(state, id); n++) {
      const e = state.encounters[id]!;
      state = gameReducer(state, e.lifecycle === "waiting_unopened" && e.checkInStatus === "checked_in"
        ? { type: "OPEN_CHART", encounterId: id, operationId: `compact.answer.open.${n}` }
        : { type: "ADVANCE_TICK", operationId: `compact.answer.tick.${n}`, advancedAtRealMs: n * 1000 });
    }
    const q = getCurrentQuestion(state, id)!;
    const seeded = Object.values(createHistoryCompactionFixture(8, 1).learningHistories).find(h => h.reviews.length)!;
    state.learningHistories = { ...state.learningHistories, [q.node.primaryConceptId]: { ...seeded, conceptId: q.node.primaryConceptId } };
    let checkpoint = createGameEvidenceCheckpoint(state);
    const tick = applyGameEvidenceCommand(checkpoint, { type: "ADVANCE_TICK", operationId: "compact.answer.retire" });
    checkpoint = tick.checkpoint;
    const command = { type: "SUBMIT_ANSWER" as const, operationId: "compact.answer.submit", encounterId: id,
      decisionNodeId: q.node.id, answerChoiceId: q.node.answerChoices.find(c => c.isCorrect)!.id, reviewedAtMs: 100 * 86_400_000 };
    const answer = applyGameEvidenceCommand(checkpoint, command);
    expect(answer.state.operationReceipts[command.operationId]!.status).toBe("applied");
    expect(getConceptReviewCount(answer.state.learningHistories[q.node.primaryConceptId])).toBe(9);
    expect(importGameEvidence(answer.checkpoint.snapshot, exportGameEvidence(answer.checkpoint))).toEqual(answer.state);
    const duplicate = applyGameEvidenceCommand(answer.checkpoint, { ...command, operationId: "compact.answer.duplicate" });
    expect(duplicate.state.operationReceipts["compact.answer.duplicate"]!.status).toBe("rejected");
    expect(duplicate.state.learningHistories).toEqual(answer.state.learningHistories);
  }, 60_000);
});
