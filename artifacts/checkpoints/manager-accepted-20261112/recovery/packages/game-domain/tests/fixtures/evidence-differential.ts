import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  createGameEvidenceCheckpoint, applyGameEvidenceCommand, applyGameEvidenceBuildUndo, importGameEvidence,
  createInitialGameState, getCurrentQuestion, serializeGameState, type DomainContext, type GameCommand, type GameState,
} from "../../src";
import * as legacy from "./game-evidence-legacy";
import { LevelFiveIntegrationJourney, runLevelFiveIntegrationJourney } from "../../../../tests/fixtures/level-five-integration";
import { createLevelFiveStateQaContext } from "../../../../tests/fixtures/level-five-state";

export class EvidenceDifferential {
  old: ReturnType<typeof legacy.createGameEvidenceCheckpoint>;
  current: ReturnType<typeof createGameEvidenceCheckpoint>;
  steps = 0;
  constructor(state: GameState) {
    this.old = legacy.createGameEvidenceCheckpoint(state);
    this.current = createGameEvidenceCheckpoint(state);
    assert.equal(JSON.stringify(this.current), JSON.stringify(this.old));
  }
  apply(command: GameCommand, context?: DomainContext) {
    const before = this.current;
    const old = legacy.applyGameEvidenceCommand(this.old, command, context);
    const current = applyGameEvidenceCommand(this.current, command, context);
    // Full deep equality at EVERY step, including the complete evidence prefix.
    assert.deepStrictEqual(current, old, `step ${this.steps}: ${command.operationId}`);
    assert.equal(serializeGameState(current.state), serializeGameState(old.state));
    assert.equal(JSON.stringify(current.checkpoint.snapshot), JSON.stringify(old.checkpoint.snapshot));
    assert.equal(JSON.stringify(current.appendedEvidence), JSON.stringify(old.appendedEvidence));
    // By induction, the unchanged frozen archive prefix plus these exact new
    // bytes and exact snapshot bytes prove every saved checkpoint byte too.
    if (this.steps % 1000 === 0) assert.equal(JSON.stringify(current.checkpoint), JSON.stringify(old.checkpoint));
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
    assert.equal(JSON.stringify(this.current), JSON.stringify(this.old));
    assert.deepStrictEqual(importGameEvidence(this.current.snapshot, this.current.evidence), legacy.importGameEvidence(this.old.snapshot, this.old.evidence));
  }
}

export function runEvidenceFuzz(seed: number, count: number, state?: GameState) {
  let value = seed >>> 0;
  const random = (max: number) => { value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return (value >>> 0) % max; };
  const initial = state ?? createInitialGameState(undefined, { campaignId: `campaign.fuzz.${seed}`, campaignSeed: `evidence.fuzz.${seed}`, createdAtRealMs: 0 });
  const pair = new EvidenceDifferential(initial), commands: GameCommand[] = [];
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
