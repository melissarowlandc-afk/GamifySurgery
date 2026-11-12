import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  applyGameEvidenceCommand, createGameEvidenceCheckpoint, createInitialGameState, deserializeGameState,
  exportGameEvidence, gameReducer, getCurrentQuestion, importGameEvidence, restoreGameEvidenceImportSource, serializeGameState,
  type GameCommand, type GameEvidenceCheckpoint, type GameState,
} from "../src";
// Hosted CI runners run long simulations up to ten times slower.
const hostedTime = (ms: number) => (process.env.CI ? ms * 10 : ms);

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const initial = () => createInitialGameState(undefined, { campaignId: "campaign.evidence.synthetic", campaignSeed: "evidence.synthetic", createdAtRealMs: 0 });
const fixtureRoot = new URL("../../../tests/fixtures/", import.meta.url);
const fixtureSources: Array<[string, string]> = [];
for (const file of ["level-four-legacy-pre-m3.json", "level-five-economy-checkpoint-20261012.json", "level-five-integration-checkpoints-20261012.json"]) {
  const parsed = JSON.parse(readFileSync(new URL(file, fixtureRoot), "utf8"));
  fixtureSources.push(...(parsed.schemaVersion ? [[file, JSON.stringify(parsed)] as [string, string]]
    : Object.entries(parsed).map(([key, value]): [string, string] => [key, JSON.stringify(value)])));
}

describe("separate immutable game evidence", () => {
  it.each(fixtureSources)("preserves every current and original persisted field for %s", (_name, source) => {
    const state = deserializeGameState(source), before = serializeGameState(state);
    const checkpoint = createGameEvidenceCheckpoint(state, { sourceState: JSON.parse(source) });
    expect(serializeGameState(state)).toBe(before);
    expect(JSON.parse(serializeGameState(importGameEvidence(checkpoint.snapshot, checkpoint.evidence)))).toEqual(JSON.parse(before));
    expect(restoreGameEvidenceImportSource(checkpoint.evidence)).toEqual(JSON.parse(source));
    expect(exportGameEvidence(checkpoint)).toBe(checkpoint.evidence);
    expect(checkpoint.evidence.baseline.historicalQuestionCountCredit).toBe(0);
    expect(Object.isFrozen(checkpoint.evidence.records)).toBe(true);
    expect(JSON.stringify(checkpoint.snapshot)).not.toContain('"frozenCase":{');
    expect(JSON.stringify(checkpoint.snapshot)).not.toContain('"schedulerLog":');
    expect(JSON.stringify(checkpoint.snapshot)).not.toContain('"explanation":');
    expect(new Set(checkpoint.evidence.records.map(record => `${record.kind}:${JSON.stringify(record.value)}`)).size).toBe(checkpoint.evidence.records.length);
  });

  it("shares identical reports and cards through references, without clinical or FSRS replay", () => {
    const state = deserializeGameState(fixtureSources.find(([name]) => name === "integration-finish")![1]);
    const checkpoint = createGameEvidenceCheckpoint(state);
    const reports = checkpoint.evidence.records.filter(record => record.kind === "inspection-report");
    expect(reports).toHaveLength(1);
    expect(serializeGameState(importGameEvidence(checkpoint.snapshot, checkpoint.evidence))).toBe(serializeGameState(state));
    expect(restoreGameEvidenceImportSource(checkpoint.evidence)).toEqual(JSON.parse(serializeGameState(state)));
  });

  it("retains the original import after current state and source fields diverge", () => {
    const state = initial(), source = JSON.parse(serializeGameState(state));
    let checkpoint = createGameEvidenceCheckpoint(state);
    checkpoint = applyGameEvidenceCommand(checkpoint, { type: "SET_PAUSED", paused: false, operationId: "evidence.play" }).checkpoint;
    checkpoint = applyGameEvidenceCommand(checkpoint, { type: "ADVANCE_TICK", operationId: "evidence.tick", advancedAtRealMs: 60_000 }).checkpoint;
    expect(importGameEvidence(checkpoint.snapshot, checkpoint.evidence).facilityTick).toBe(1);
    expect(restoreGameEvidenceImportSource(checkpoint.evidence)).toEqual(source);
  });

  it("keeps existing save and reducer bytes identical across observed and ordinary commands", () => {
    let state = initial(), checkpoint = createGameEvidenceCheckpoint(state);
    const commands: GameCommand[] = [{ type: "SET_PAUSED", paused: false, operationId: "bytes.play" },
      ...Array.from({ length: 65 }, (_, index): GameCommand => ({ type: "ADVANCE_TICK", operationId: `bytes.tick.${index}`, advancedAtRealMs: index * 60_000 })),
      { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "bytes.speed" },
      { type: "SET_PAUSED", paused: true, operationId: "bytes.pause" }];
    for (const command of commands) {
      const before = serializeGameState(state);
      const observed = applyGameEvidenceCommand(checkpoint, command);
      expect(serializeGameState(state)).toBe(before);
      state = gameReducer(state, command);
      expect(serializeGameState(observed.state), command.operationId).toBe(serializeGameState(state));
      expect(serializeGameState(importGameEvidence(observed.checkpoint.snapshot, observed.checkpoint.evidence)), command.operationId).toBe(serializeGameState(state));
      expect(observed.checkpoint.evidence.records.slice(0, checkpoint.evidence.records.length)).toEqual(checkpoint.evidence.records);
      checkpoint = observed.checkpoint;
    }
  }, hostedTime(30_000));

  it("captures the actual final record before retirement and keeps it after raw state removes it", () => {
    const state = initial(), template = Object.values(state.encounters)[0]!;
    state.encounters = {};
    for (let index = 0; index < 12; index += 1) {
      const id = `encounter.evidence.retirement.${index}`;
      state.encounters[id] = { ...copy(template), id, arrivalClass: "routine", lifecycle: "resolved",
        patientLocation: null, patientMovement: null, pendingResult: null, resolvedAtFacilityTick: 0,
        resolutionReason: "completed", finalPatientSatisfaction: 100 };
    }
    state.paused = false; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER; state.serviceAppointmentsEnabled = false;
    state.openChartEncounterId = null; state.attendedEncounterId = null;
    const source = serializeGameState(state), before = createGameEvidenceCheckpoint(state);
    const result = applyGameEvidenceCommand(before, { type: "ADVANCE_TICK", operationId: "retirement.tick", advancedAtRealMs: 60_000 });
    const removed = Object.keys(state.encounters).filter(id => !result.state.encounters[id]);
    expect(removed.length).toBeGreaterThan(0);
    const archived = result.appendedEvidence.filter(record => record.kind === "retired-encounter");
    expect(archived).toHaveLength(removed.length);
    for (const record of archived) expect(JSON.stringify(record.value)).toContain('"resolvedAtFacilityTick":0');
    expect(serializeGameState(state)).toBe(source);
    expect(serializeGameState(result.state)).toBe(serializeGameState(gameReducer(state, { type: "ADVANCE_TICK", operationId: "retirement.tick", advancedAtRealMs: 60_000 })));
    expect(restoreGameEvidenceImportSource(result.checkpoint.evidence)).toEqual(JSON.parse(source));
  });

  it("preserves trimmed receipts, suppresses identical retries and rejects changed operation reuse", () => {
    const state = initial(); state.paused = false;
    let checkpoint = createGameEvidenceCheckpoint(state);
    for (let index = 0; index < 7; index += 1) checkpoint = applyGameEvidenceCommand(checkpoint,
      { type: "ADVANCE_TICK", operationId: `receipt.${index}`, advancedAtRealMs: index * 60_000 }).checkpoint;
    const loaded = importGameEvidence(checkpoint.snapshot, checkpoint.evidence);
    expect(loaded.operationReceipts["receipt.0"]).toBeUndefined();
    expect(checkpoint.evidence.records.filter(record => record.kind === "operation").length).toBeGreaterThanOrEqual(7);
    const replay = applyGameEvidenceCommand(checkpoint, { type: "ADVANCE_TICK", operationId: "receipt.0", advancedAtRealMs: 0 });
    expect(replay.replayed).toBe(true); expect(replay.checkpoint).toBe(checkpoint);
    expect(replay.state.facilityTick).toBe(7);
    expect(() => applyGameEvidenceCommand(checkpoint, { type: "ADVANCE_TICK", operationId: "receipt.0", advancedAtRealMs: 1 })).toThrowError(expect.objectContaining({ code: "operation-id-reuse" }));
  });

  it("captures a reducer-accepted answer and exact new card/review once", () => {
    let state = initial();
    const encounterId = Object.keys(state.encounters)[0]!;
    state = gameReducer(state, { type: "SET_PAUSED", paused: false, operationId: "answer.setup.play" });
    for (let index = 0; index < 250 && !getCurrentQuestion(state, encounterId); index += 1) {
      const encounter = state.encounters[encounterId]!;
      state = gameReducer(state, encounter.lifecycle === "waiting_unopened" && encounter.checkInStatus === "checked_in"
        ? { type: "OPEN_CHART", operationId: `answer.setup.open.${index}`, encounterId }
        : { type: "ADVANCE_TICK", operationId: `answer.setup.tick.${index}`, advancedAtRealMs: index * 60_000 });
    }
    expect(getCurrentQuestion(state, encounterId)).not.toBeNull();
    const question = getCurrentQuestion(state, encounterId)!;
    const command: GameCommand = { type: "SUBMIT_ANSWER", operationId: "evidence.recorded.answer", encounterId,
      decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices[0]!.id,
      reviewedAtMs: state.createdAtRealMs + (state.facilityTick + 1) * 60_000 };
    const initialCheckpoint = createGameEvidenceCheckpoint(state), result = applyGameEvidenceCommand(initialCheckpoint, command);
    expect(result.state.operationReceipts[command.operationId]?.status).toBe("applied");
    expect(result.appendedEvidence.filter(record => record.kind === "review")).toHaveLength(1);
    expect(result.appendedEvidence.filter(record => record.kind === "card-state")).toHaveLength(1);
    expect(serializeGameState(result.state)).toBe(serializeGameState(gameReducer(state, command)));
    expect(importGameEvidence(result.checkpoint.snapshot, result.checkpoint.evidence).learningHistories).toEqual(result.state.learningHistories);
    const replay = applyGameEvidenceCommand(result.checkpoint, command);
    expect(replay.appendedEvidence).toHaveLength(0);
    expect(replay.state.learningHistories).toEqual(result.state.learningHistories);
  });

  it.each(["integration-preparing", "integration-final"])("keeps ended inspection evidence for %s", scenario => {
    const state = deserializeGameState(fixtureSources.find(([name]) => name === scenario)![1]);
    if (scenario === "integration-final") state.paused = false;
    const command: GameCommand = scenario === "integration-preparing"
      ? { type: "CANCEL_INSPECTION", operationId: "inspection.evidence.cancel" }
      : { type: "ADVANCE_TICK", operationId: "inspection.evidence.finish", advancedAtRealMs: state.createdAtRealMs + (state.facilityTick + 1) * 60_000 };
    const result = applyGameEvidenceCommand(createGameEvidenceCheckpoint(state), command);
    expect(result.appendedEvidence.filter(record => record.kind === "inspection-end")).toHaveLength(1);
    if (scenario === "integration-final") expect(result.appendedEvidence.filter(record => record.kind === "inspection-report")).toHaveLength(1);
    expect(serializeGameState(result.state)).toBe(serializeGameState(gameReducer(state, command)));
    expect(importGameEvidence(result.checkpoint.snapshot, result.checkpoint.evidence).levelFive).toEqual(result.state.levelFive);
  });

  it("reconciles cash and full review/card projections instead of trusting mutable patches", () => {
    const state = deserializeGameState(fixtureSources.find(([name]) => name.startsWith("level-five-economy"))![1]);
    const checkpoint = createGameEvidenceCheckpoint(state);
    const money = copy(checkpoint);
    const moneySnapshot = { ...money.snapshot, patches: [...money.snapshot.patches, { path: ["cashCents"], present: true, value: state.cashCents + 1 }] };
    expect(() => importGameEvidence(moneySnapshot, money.evidence)).toThrowError(expect.objectContaining({ code: "money-reconciliation" }));
    const reviews = copy(checkpoint);
    const concept = Object.values(state.learningHistories).find(history => history.reviews.length > 0)!.conceptId;
    const reviewSnapshot = { ...reviews.snapshot, patches: [...reviews.snapshot.patches, { path: ["learningHistories", concept, "reviews"], present: true, value: [] }] };
    expect(() => importGameEvidence(reviewSnapshot, reviews.evidence)).toThrowError(expect.objectContaining({ code: "learning-reconciliation" }));
  });

  it("rejects missing evidence and raw immutable payloads injected into a snapshot", () => {
    const state = initial(), checkpoint = createGameEvidenceCheckpoint(state), broken = copy(checkpoint);
    const id = Object.keys(state.encounters)[0]!;
    const snapshot = { ...broken.snapshot, patches: [{ path: ["encounters", id, "frozenCase"], present: true, value: copy(state.encounters[id]!.frozenCase) }] };
    expect(() => importGameEvidence(snapshot, broken.evidence)).toThrowError(expect.objectContaining({ code: "duplicated-evidence-in-snapshot" }));
    expect(() => importGameEvidence(checkpoint.snapshot, { ...checkpoint.evidence, records: [] })).toThrowError(expect.objectContaining({ code: "missing-evidence" }));
    expect(() => importGameEvidence({ ...checkpoint.snapshot, patches: [{ path: ["campaignSeed"], present: true, value: "changed-seed" }] }, checkpoint.evidence))
      .toThrowError(expect.objectContaining({ code: "immutable-pins" }));
  });
});
