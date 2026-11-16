import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  createGameEvidenceCheckpoint, applyGameEvidenceCommand, applyGameEvidenceBuildUndo, importGameEvidence,
  createInitialGameState, getCurrentQuestion, serializeGameState, type DomainContext, type GameCommand, type GameState,
  gameReducer, getConceptReviewCount, restoreGameEvidenceImportSource,
} from "../../src";
import * as legacy from "./game-evidence-legacy";
import { LevelFiveIntegrationJourney, runLevelFiveIntegrationJourney } from "../../../../tests/fixtures/level-five-integration";
import { createLevelFiveStateQaContext } from "../../../../tests/fixtures/level-five-state";

export class EvidenceDifferential {
  old: ReturnType<typeof legacy.createGameEvidenceCheckpoint>;
  current: ReturnType<typeof createGameEvidenceCheckpoint>;
  steps = 0;
  constructor(state: GameState, readonly historyCompaction = false) {
    this.old = legacy.createGameEvidenceCheckpoint(state);
    this.current = createGameEvidenceCheckpoint(state);
    this.equalCheckpoint(this.current, this.old);
  }
  private comparable<T>(value: T): T {
    if (!this.historyCompaction) return value;
    const copy = structuredClone(value) as T & { evidence?: { baseline: { openingLearning: Record<string, { retiredReviews?: number }> } }; checkpoint?: { evidence: { baseline: { openingLearning: Record<string, { retiredReviews?: number }> } } } };
    const baseline = copy.evidence?.baseline ?? copy.checkpoint?.evidence.baseline;
    // The frozen oracle predates this additive count projection. State/card/
    // review payloads and every other archive field still compare byte-exact.
    if (baseline) for (const history of Object.values(baseline.openingLearning)) delete history.retiredReviews;
    return copy;
  }
  private equalCheckpoint(current: unknown, old: unknown): void {
    assert.equal(JSON.stringify(this.comparable(current)), JSON.stringify(old));
  }
  apply(command: GameCommand, context?: DomainContext) {
    const before = this.current;
    const current = applyGameEvidenceCommand(this.current, command, context);
    const beforeState: GameState | null = this.historyCompaction ? importGameEvidence(before.snapshot, before.evidence) : null;
    const retired = beforeState && Object.entries(current.state.learningHistories).some(([id, h]) =>
      (h.retiredReviewCount ?? 0) > (beforeState.learningHistories[id]?.retiredReviewCount ?? 0));
    if (retired) {
      // A pre-compaction oracle cannot encode the new retirement witness.
      // Prove the real reducer, exact suffix/count/card, complete untrusted
      // import and original source/prefix first; only then rebase BOTH test
      // branches at the same snapshot-only boundary. No frozen oracle edits.
      assert.deepStrictEqual(current.state, gameReducer(beforeState!, command, context));
      assert.deepStrictEqual(importGameEvidence(current.checkpoint.snapshot, current.checkpoint.evidence), current.state);
      assert.deepStrictEqual(restoreGameEvidenceImportSource(current.checkpoint.evidence), restoreGameEvidenceImportSource(before.evidence));
      assert.deepStrictEqual(current.checkpoint.evidence.records.slice(0, before.evidence.records.length), before.evidence.records);
      for (const [id, after] of Object.entries(current.state.learningHistories)) {
        const prior: GameState["learningHistories"][string] = beforeState!.learningHistories[id]!;
        assert.deepStrictEqual(after.card, prior.card);
        assert.equal(getConceptReviewCount(after), getConceptReviewCount(prior));
        assert.deepStrictEqual(after.reviews, prior.reviews.slice(-3));
      }
      assert.equal(before.snapshot.head.sequence + 1, current.checkpoint.snapshot.head.sequence);
      const oldBase = legacy.createGameEvidenceCheckpoint(current.state), base = createGameEvidenceCheckpoint(current.state);
      // Keep all prior command witnesses as unused/orphan records in BOTH
      // rebased archives. Retries and changed-operation reuse must remain
      // checked across this test boundary, not disappear with the old head.
      const commands = current.checkpoint.evidence.records.filter(record => record.kind === "transition");
      this.old = { ...oldBase, evidence: { ...oldBase.evidence, records: [...oldBase.evidence.records,
        ...commands.map((record, i) => ({ ...record, id: `e${(oldBase.evidence.records.length + i + 1).toString(36)}` }))] as typeof oldBase.evidence.records } };
      this.current = { ...base, evidence: { ...base.evidence, records: [...base.evidence.records,
        ...commands.map((record, i) => ({ ...record, id: `e${(base.evidence.records.length + i + 1).toString(36)}` }))] } };
      this.equalCheckpoint(this.current, this.old); this.steps++;
      return current;
    }
    const old = legacy.applyGameEvidenceCommand(this.old, command, context);
    // Full deep equality at EVERY step, including the complete evidence prefix.
    assert.deepStrictEqual(this.comparable(current), old, `step ${this.steps}: ${command.operationId}`);
    assert.equal(serializeGameState(current.state), serializeGameState(old.state));
    assert.equal(JSON.stringify(current.checkpoint.snapshot), JSON.stringify(old.checkpoint.snapshot));
    assert.equal(JSON.stringify(current.appendedEvidence), JSON.stringify(old.appendedEvidence));
    // By induction, the unchanged frozen archive prefix plus these exact new
    // bytes and exact snapshot bytes prove every saved checkpoint byte too.
    if (this.steps % 1000 === 0) this.equalCheckpoint(current.checkpoint, old.checkpoint);
    assert.equal(before.snapshot.head.sequence + (current.replayed ? 0 : 1), current.checkpoint.snapshot.head.sequence);
    this.old = old.checkpoint; this.current = current.checkpoint; this.steps++;
    return current;
  }
  undo(target: GameState, operationId: string) {
    const old = legacy.applyGameEvidenceBuildUndo(this.old, target, operationId);
    const current = applyGameEvidenceBuildUndo(this.current, target, operationId);
    assert.deepStrictEqual(current, old);
    assert.equal(JSON.stringify(current.checkpoint), JSON.stringify(old.checkpoint));
    this.old = old.checkpoint; this.current = current.checkpoint; this.steps++;
    return current;
  }
  verify() {
    this.equalCheckpoint(this.current, this.old);
    assert.deepStrictEqual(importGameEvidence(this.current.snapshot, this.current.evidence), legacy.importGameEvidence(this.old.snapshot, this.old.evidence));
  }
}

export function runEvidenceFuzz(seed: number, count: number, state?: GameState, historyCompaction = false) {
  let value = seed >>> 0;
  const random = (max: number) => { value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return (value >>> 0) % max; };
  const initial = state ?? createInitialGameState(undefined, { campaignId: `campaign.fuzz.${seed}`, campaignSeed: `evidence.fuzz.${seed}`, createdAtRealMs: 0 });
  const pair = new EvidenceDifferential(initial, historyCompaction), commands: GameCommand[] = [];
  let current = initial;
  for (let index = 0; index < count; index++) {
    const operationId = `fuzz.${seed}.${index}`, type = random(12);
    const encounter = Object.values(current.encounters)[random(Object.keys(current.encounters).length)];
    const question = encounter && getCurrentQuestion(current, encounter.id);
    let command: GameCommand = type < 4 ? { type: "ADVANCE_TICK", operationId, advancedAtRealMs: initial.createdAtRealMs + (current.facilityTick + 1) * 60_000 }
      : type === 4 ? { type: "SET_PAUSED", operationId, paused: Boolean(random(2)) }
      : type === 5 ? { type: "SET_SIMULATION_SPEED", operationId, speed: [1, 2, 4][random(3)] as 1 | 2 | 4 }
      : type === 6 && encounter ? { type: "OPEN_CHART", operationId, encounterId: encounter.id }
      : type === 7 && encounter && question ? { type: "SUBMIT_ANSWER", operationId, encounterId: encounter.id,
        decisionNodeId: question.node.id, answerChoiceId: question.node.answerChoices[random(question.node.answerChoices.length)]!.id,
        reviewedAtMs: initial.createdAtRealMs + (current.facilityTick + 1) * 60_000 }
      : type === 8 && encounter ? { type: "CLOSE_CHART", operationId, encounterId: encounter.id }
      : type === 9 && encounter?.steps[encounter.currentNodeIndex] ? { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId,
        encounterId: encounter.id, decisionNodeId: encounter.steps[encounter.currentNodeIndex]!.decisionNodeId }
      : type === 10 ? { type: "SELL_ROOM", operationId, roomId: "room.missing.fuzz" }
      : { type: "SET_SERVICE_APPOINTMENTS_ENABLED", operationId, enabled: Boolean(random(2)) };
    if (index > 0 && index % 17 === 0) command = commands[random(commands.length)]!;
    current = pair.apply(command).state;
    commands.push(command);
    if (index > 0 && index % 23 === 0) {
      const reused = { ...commands[0]!, fuzzOperationReuseProbe: true } as unknown as GameCommand;
      assert.throws(() => legacy.applyGameEvidenceCommand(pair.old, reused), /operation-id-reuse/);
      assert.throws(() => applyGameEvidenceCommand(pair.current, reused), /operation-id-reuse/);
    }
  }
  pair.verify();
  return { seed, steps: pair.steps, cashCents: current.cashCents };
}

/** Uses the unchanged real driver, with a third ordinary-reducer control for
 * all of its accounting/inspection assertions. No evidence artifact writes. */
export function runFullEvidenceDifferential(progress?: (message: string) => void,
  observe?: (steps: number, pair: EvidenceDifferential) => void) {
  const context = createLevelFiveStateQaContext();
  const opening = new LevelFiveIntegrationJourney(context).state, pair = new EvidenceDifferential(opening);
  const original = LevelFiveIntegrationJourney.prototype.apply;
  const start = performance.now();
  LevelFiveIntegrationJourney.prototype.apply = function(command) {
    const observed = pair.apply({ ...command, operationId: `m9.journey.${this.sequence}` } as GameCommand, context);
    original.call(this, command);
    assert.deepStrictEqual(observed.state, this.state);
    observe?.(pair.steps, pair);
    if (pair.steps % 100 === 0) progress?.(`${pair.steps} commands; ${(performance.now() - start).toFixed(0)} ms`);
  };
  let journey: LevelFiveIntegrationJourney;
  try { journey = runLevelFiveIntegrationJourney(context, message => progress?.(message)); }
  finally { LevelFiveIntegrationJourney.prototype.apply = original; }
  assert.equal(journey.commands, 26_710);
  assert.equal(pair.steps, 26_710);
  assert.equal(journey.state.cashCents, 5_818_501);
  const fixtures = JSON.parse(readFileSync(new URL("../../../../tests/fixtures/level-five-integration-checkpoints-20261012.json", import.meta.url), "utf8"));
  for (const [name, state] of Object.entries(journey.checkpoints)) {
    assert.equal(serializeGameState(state), JSON.stringify(fixtures[name]), `Level 5 checkpoint ${name}`);
  }
  pair.verify();
  return { commands: pair.steps, closingCashCents: journey.state.cashCents,
    checkpoints: Object.keys(journey.checkpoints), elapsedMs: performance.now() - start };
}

/** Generate the unchanged real command stream and exact incremental endpoints.
 * Parallel oracle workers verify EVERY interval, including endpoint continuity;
 * once all intervals pass, induction proves one continuous old/new replay. */
export function captureEvidenceStream(chunkSize: number, progress?: (message: string) => void,
  options: { historicalFixtureMode?: "require" | "report" } = {}) {
  const context = createLevelFiveStateQaContext(), opening = new LevelFiveIntegrationJourney(context).state;
  let checkpoint = createGameEvidenceCheckpoint(opening);
  assert.equal(JSON.stringify(checkpoint), JSON.stringify(legacy.createGameEvidenceCheckpoint(opening)));
  const endpoints = [{ step: 0, checkpoint }], commands: GameCommand[] = [];
  const original = LevelFiveIntegrationJourney.prototype.apply;
  LevelFiveIntegrationJourney.prototype.apply = function(command) {
    const complete = { ...command, operationId: `m9.journey.${this.sequence}` } as GameCommand;
    const observed = applyGameEvidenceCommand(checkpoint, complete, context);
    checkpoint = observed.checkpoint; commands.push(complete);
    original.call(this, command);
    assert.deepStrictEqual(observed.state, this.state);
    if (commands.length % chunkSize === 0) { endpoints.push({ step: commands.length, checkpoint }); progress?.(`Stream: ${commands.length} commands`); }
  };
  let journey: LevelFiveIntegrationJourney;
  try { journey = runLevelFiveIntegrationJourney(context, message => progress?.(message)); }
  finally { LevelFiveIntegrationJourney.prototype.apply = original; }
  assert.equal(commands.length, 26_710); assert.equal(journey.state.cashCents, 5_818_501);
  if (endpoints.at(-1)!.step !== commands.length) endpoints.push({ step: commands.length, checkpoint });
  const fixtures = JSON.parse(readFileSync(new URL("../../../../tests/fixtures/level-five-integration-checkpoints-20261012.json", import.meta.url), "utf8"));
  const historicalCheckpoints = Object.entries(journey.checkpoints).map(([name, state]) => {
    const actual = serializeGameState(state), expected = JSON.stringify(fixtures[name]);
    const byteIdentical = actual === expected;
    if (options.historicalFixtureMode !== "report") assert.equal(actual, expected, `Level 5 checkpoint ${name}`);
    if (!byteIdentical) progress?.(`Historical fixture differs: ${name}; recorded separately from old/new application equality`);
    return { name, byteIdentical, actualSha256: createHash("sha256").update(actual).digest("hex"),
      historicalSha256: createHash("sha256").update(expected).digest("hex") };
  });
  return { commands, endpoints, summary: { commands: commands.length, closingCashCents: journey.state.cashCents,
    byteIdenticalEarnedCheckpoints: historicalCheckpoints.filter(row => row.byteIdentical).map(row => row.name), historicalCheckpoints } };
}
