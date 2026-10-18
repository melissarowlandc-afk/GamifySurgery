import { gameReducer } from "./reducer";
import { withGameEvidenceObserver } from "./game-evidence-capture";
import {
  applyEvidencePatches, evidenceJsonText, evidencePatches, freezeEvidence, GameEvidenceError,
  jsonCopy, jsonEqual, jsonObject, type EvidenceJson, type EvidenceObject, type EvidencePatch,
} from "./game-evidence-json";
import type { DomainContext, GameCommand, GameState } from "./types";

export { GameEvidenceError } from "./game-evidence-json";
export type { EvidenceJson, EvidenceObject, EvidencePatch } from "./game-evidence-json";
export const GAME_EVIDENCE_VERSION = 1;
export type GameEvidenceKind = "frozen-case" | "answer" | "review" | "card-state" | "review-intent" |
  "settlement" | "income" | "operation" | "event" | "completion-witness" | "inspection-report" |
  "inspection-preparation" | "inspection-question" | "inspection-unlock" | "transition" |
  "retired-encounter" | "retired-service" | "retired-retail" | "retired-actor" | "retired-order" | "inspection-end" |
  "episode-identity" | "decision-identity" | "frozen-work" | "frozen-order" | "frozen-result-text" | "build-reversion";
export interface GameEvidenceRecord {
  readonly id: string;
  readonly kind: GameEvidenceKind;
  readonly origin: "import-baseline" | "legacy-projection" | "observed-transition";
  readonly value: EvidenceJson;
}
interface Reference { $e: string }
interface FinanceWitness {
  facilityTick: number;
  cashCents: number;
  operatingAccrualSixtiethCents: number;
  totalOperatingExpenses: number;
  nextFinancialPostingTick: number;
}
interface LearningProjection { [concept: string]: { card: string; reviews: string[] } }
export interface GameEvidenceArchive {
  readonly version: 1;
  readonly campaignId: string;
  readonly baseline: {
    /** Complete available original source, with immutable values replaced by references. */
    readonly source: EvidenceObject;
    readonly historicalCoverage: "available-local-data-only";
    readonly historicalQuestionCountCredit: 0;
    readonly legacyReviewProjection: boolean;
    readonly openingFinance: FinanceWitness;
    readonly openingLearning: LearningProjection;
    readonly pins: EvidenceObject;
  };
  readonly records: readonly GameEvidenceRecord[];
}
export interface GameEvidenceSnapshot {
  readonly version: 1;
  readonly campaignId: string;
  readonly gameSchemaVersion: number;
  /** Complete current projection relative to the immutable import source; no event replay. */
  readonly patches: readonly EvidencePatch[];
  readonly head: { readonly sequence: number; readonly transitionId: string | null };
}
export interface GameEvidenceCheckpoint {
  readonly snapshot: GameEvidenceSnapshot;
  readonly evidence: GameEvidenceArchive;
}

const kinds: readonly GameEvidenceKind[] = ["frozen-case", "answer", "review", "card-state", "review-intent",
  "settlement", "income", "operation", "event", "completion-witness", "inspection-report", "inspection-preparation",
  "inspection-question", "inspection-unlock", "transition", "retired-encounter", "retired-service", "retired-retail",
  "retired-actor", "retired-order", "inspection-end", "episode-identity", "decision-identity", "frozen-work", "frozen-order", "frozen-result-text", "build-reversion"];
const reference = (id: string): EvidenceObject => ({ $e: id });
function isReference(value: unknown): value is Reference {
  return jsonObject(value) && Object.keys(value).length === 1 && typeof value.$e === "string";
}
const asJson = (value: unknown): EvidenceJson => jsonCopy(value) as EvidenceJson;
const asObject = (value: unknown): EvidenceObject => {
  if (!jsonObject(value)) throw new GameEvidenceError("object-shape");
  return value;
};
function exactFields(value: object, fields: readonly string[]): void {
  if (Object.keys(value).length !== fields.length || fields.some(field => !Object.hasOwn(value, field))) throw new GameEvidenceError("contract-fields");
}

/** Exact domain ownership paths, not a heuristic based on property names. */
function kindAt(path: readonly string[]): GameEvidenceKind | undefined {
  const [root, second, third, fourth, fifth, sixth] = path;
  if (root === "encounters" || root === "employeeDiscussions") {
    const identity = root === "encounters" ? ["id", "patientDisplayName", "patientAppearance", "arrivalClass"]
      : ["id", "clinicalReleaseId", "employeeId", "employeeDisplayName", "employeeAppearance", "createdAtFacilityTick"];
    if (path.length === 3 && identity.includes(third ?? "") || root === "encounters" && path.length === 4 && third === "waiting" && fourth === "arrivedAtTick") return "episode-identity";
    if (third === "steps" && path.length === 5 && ["nodeIndex", "decisionNodeId", "questionVariantId", "primaryConceptId"].includes(fifth ?? "")) return "decision-identity";
    if (path.at(-1) === "resultNarrative" && (third === "pendingResult" && path.length === 4 || third === "steps" && fifth === "result" && path.length === 6)) return "frozen-result-text";
  }
  if (root === "serviceOperations" && path.length === 3) {
    if (third === "frozenOperationPhases") return "frozen-work";
    if (third === "testChoiceOrder") return "frozen-order";
  }
  if ((root === "encounters" || root === "employeeDiscussions") && path.length === 3 && third === "frozenCase") return "frozen-case";
  if ((root === "encounters" || root === "employeeDiscussions") &&
    (path.length === 4 && third === "answers" || path.length === 5 && third === "steps" && fifth === "answer")) return "answer";
  if (root === "learningHistories" && path.length === 3 && third === "card") return "card-state";
  if (root === "learningHistories" && path.length === 4 && third === "reviews") return "review";
  if (path.length === 2) {
    const top: Record<string, GameEvidenceKind> = { reviewIntents: "review-intent", settlements: "settlement",
      serviceIncomeReceipts: "income", operationReceipts: "operation", events: "event" };
    if (root && Object.hasOwn(top, root)) return top[root];
    if (root === "levelFourCompletion" && ["pediatricVisitWithParent", "woundOstomyCareVisit"].includes(second ?? "")) return "completion-witness";
  }
  if (root === "levelFive") {
    if (second === "inspection" && path.length === 3) {
      if (["lastReport", "latestCompletedReport", "bestCompletedReport"].includes(third ?? "")) return "inspection-report";
      if (third === "preparation") return "inspection-preparation";
    }
    if (second === "progress" && third === "inspectionUnlocked" && path.length === 3) return "inspection-unlock";
    if (second === "progress" && third === "gameFinished" && fourth === "firstCompletedReport" && path.length === 4) return "inspection-report";
    if (second === "inspection" && third === "run" && fourth === "accumulators" && fifth === "presentedQuestions" && sixth !== undefined && path.length === 6) return "inspection-question";
  }
  return undefined;
}

const indexes = new WeakMap<GameEvidenceArchive, Map<string, string>>();
function archiveIndex(archive: GameEvidenceArchive): Map<string, string> {
  const cached = Object.isFrozen(archive) ? indexes.get(archive) : undefined;
  if (cached) return cached;
  if (archive.version !== GAME_EVIDENCE_VERSION || typeof archive.campaignId !== "string" || !archive.campaignId ||
    !Array.isArray(archive.records) || !jsonObject(archive.baseline) || archive.baseline.historicalCoverage !== "available-local-data-only" ||
    archive.baseline.historicalQuestionCountCredit !== 0 || typeof archive.baseline.legacyReviewProjection !== "boolean") {
    throw new GameEvidenceError("archive-shape");
  }
  exactFields(archive, ["version", "campaignId", "baseline", "records"]);
  exactFields(archive.baseline, ["source", "historicalCoverage", "historicalQuestionCountCredit", "legacyReviewProjection", "openingFinance", "openingLearning", "pins"]);
  const result = new Map<string, string>();
  for (const [index, fact] of archive.records.entries()) {
    exactFields(fact, ["id", "kind", "origin", "value"]);
    if (fact.id !== `e${(index + 1).toString(36)}` || !kinds.includes(fact.kind) ||
      !["import-baseline", "legacy-projection", "observed-transition"].includes(fact.origin) || !Object.hasOwn(fact, "value")) throw new GameEvidenceError("record-shape");
    const key = `${fact.kind}\0${evidenceJsonText(fact.value)}`;
    if (result.has(key)) throw new GameEvidenceError("duplicate-evidence");
    result.set(key, fact.id);
  }
  if (Object.isFrozen(archive)) indexes.set(archive, result);
  return result;
}

function recordAt(archive: Pick<GameEvidenceArchive, "records">, id: string): GameEvidenceRecord {
  if (!/^e[1-9a-z][0-9a-z]*$/.test(id)) throw new GameEvidenceError("reference-shape");
  const record = archive.records[Number.parseInt(id.slice(1), 36) - 1];
  if (!record || record.id !== id) throw new GameEvidenceError("missing-evidence");
  return record;
}

class EvidenceBuilder {
  readonly records: GameEvidenceRecord[];
  readonly index: Map<string, string>;
  origin: GameEvidenceRecord["origin"] = "import-baseline";
  constructor(archive?: GameEvidenceArchive) {
    this.records = archive ? [...archive.records] : [];
    this.index = archive ? new Map(archiveIndex(archive)) : new Map();
  }
  put(kind: GameEvidenceKind, value: EvidenceJson): string {
    const key = `${kind}\0${evidenceJsonText(value)}`, previous = this.index.get(key);
    if (previous) return previous;
    const id = `e${(this.records.length + 1).toString(36)}`;
    this.records.push(freezeEvidence({ id, kind, origin: this.origin, value: jsonCopy(value) }));
    this.index.set(key, id);
    return id;
  }
  project(value: EvidenceJson, path: string[] = []): EvidenceJson {
    if (isReference(value)) throw new GameEvidenceError("reserved-reference-in-source");
    const kind = kindAt(path);
    if (kind && value !== null) return reference(this.put(kind, value));
    if (Array.isArray(value)) return value.map((child, index) => this.project(child, [...path, String(index)]));
    if (jsonObject(value)) return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, this.project(child, [...path, key])]));
    return value;
  }
}

function assertProjected(value: EvidenceJson, archive: GameEvidenceArchive, path: string[] = []): void {
  const kind = kindAt(path);
  if (isReference(value)) {
    if (!kind || recordAt(archive, value.$e).kind !== kind) throw new GameEvidenceError("reference-owner");
    return;
  }
  if (kind && value !== null) throw new GameEvidenceError("duplicated-evidence-in-snapshot");
  if (Array.isArray(value)) value.forEach((child, index) => assertProjected(child, archive, [...path, String(index)]));
  else if (jsonObject(value)) Object.entries(value).forEach(([key, child]) => assertProjected(child, archive, [...path, key]));
}

function resolve(value: EvidenceJson, archive: GameEvidenceArchive, active = new Set<string>(), depth = 0,
  budget = { nodes: 0, textUnits: 0 }): EvidenceJson {
  if (depth > 128) throw new GameEvidenceError("reference-depth");
  budget.nodes += 1;
  if (typeof value === "string") budget.textUnits += value.length;
  if (jsonObject(value)) budget.textUnits += Object.keys(value).reduce((sum, key) => sum + key.length, 0);
  if (budget.nodes > 300_000 || budget.textUnits > 6_000_000) throw new GameEvidenceError("resolved-size");
  if (isReference(value)) {
    if (active.has(value.$e)) throw new GameEvidenceError("reference-cycle");
    const next = new Set(active); next.add(value.$e);
    return resolve(recordAt(archive, value.$e).value, archive, next, depth + 1, budget);
  }
  if (Array.isArray(value)) return value.map(child => resolve(child, archive, active, depth + 1, budget));
  if (jsonObject(value)) return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, resolve(child, archive, active, depth + 1, budget)]));
  return value;
}

function finance(state: GameState): FinanceWitness {
  const witness = { facilityTick: state.facilityTick, cashCents: state.cashCents,
    operatingAccrualSixtiethCents: state.operatingAccrualSixtiethCents, totalOperatingExpenses: state.totalOperatingExpenses,
    nextFinancialPostingTick: state.nextFinancialPostingTick };
  if (Object.values(witness).some(value => !Number.isFinite(value)) || !Number.isSafeInteger(witness.cashCents)) throw new GameEvidenceError("finance-range");
  return witness;
}
function pins(state: GameState): EvidenceObject {
  return asObject(asJson({ campaignId: state.campaignId, campaignSeed: state.campaignSeed, createdAtRealMs: state.createdAtRealMs,
    randomGeneratorVersion: state.randomGeneratorVersion, clinicalReleaseId: state.clinicalReleaseId,
    balanceReleaseId: state.balanceReleaseId, salaryEconomyVersion: state.salaryEconomyVersion, schedulerPins: state.schedulerPins }));
}
function learning(projected: EvidenceObject): LearningProjection {
  const result: LearningProjection = {};
  for (const [id, value] of Object.entries(asObject(projected.learningHistories))) {
    const history = asObject(value);
    if (!isReference(history.card) || !Array.isArray(history.reviews) || history.reviews.some(review => !isReference(review))) throw new GameEvidenceError("learning-projection");
    Object.defineProperty(result, id, { value: { card: history.card.$e, reviews: history.reviews.map(review => (review as unknown as Reference).$e) }, enumerable: true, writable: true, configurable: true });
  }
  return result;
}

function validateHead(snapshot: GameEvidenceSnapshot, archive: GameEvidenceArchive, state: GameState, projected: EvidenceObject): void {
  if (!Number.isSafeInteger(snapshot.head.sequence) || snapshot.head.sequence < 0 ||
    (snapshot.head.sequence === 0) !== (snapshot.head.transitionId === null)) throw new GameEvidenceError("head-shape");
  let id = snapshot.head.transitionId, sequence = snapshot.head.sequence, expected = finance(state);
  const expectedLearning = learning(projected), visited = new Set<string>(), operations = new Set<string>();
  while (id !== null) {
    if (visited.has(id)) throw new GameEvidenceError("transition-cycle");
    visited.add(id);
    const fact = recordAt(archive, id), entry = asObject(fact.value);
    if (fact.kind !== "transition" || entry.sequence !== sequence || !jsonEqual(asJson(expected), entry.after!) ||
      !jsonObject(entry.before) || !jsonObject(entry.command) || typeof entry.command.operationId !== "string" ||
      operations.has(entry.command.operationId) || typeof entry.cashDeltaCents !== "string" || !Array.isArray(entry.learningChanges)) throw new GameEvidenceError("transition-chain");
    operations.add(entry.command.operationId);
    const before = entry.before as unknown as FinanceWitness;
    if (!Number.isSafeInteger(before.cashCents) || entry.cashDeltaCents !== (BigInt(expected.cashCents) - BigInt(before.cashCents)).toString()) throw new GameEvidenceError("money-reconciliation");
    const changedConcepts = new Set<string>();
    for (const rawChange of entry.learningChanges) {
      const change = asObject(rawChange);
      if (typeof change.conceptId !== "string" || !expectedLearning[change.conceptId] || !Array.isArray(change.appendedReviews) ||
        typeof change.beforeCard !== "string" || typeof change.afterCard !== "string") throw new GameEvidenceError("learning-chain");
      const current = expectedLearning[change.conceptId]!;
      if (changedConcepts.has(change.conceptId)) throw new GameEvidenceError("learning-chain");
      changedConcepts.add(change.conceptId);
      if (current.card !== change.afterCard || !jsonEqual(asJson(current.reviews.slice(current.reviews.length - change.appendedReviews.length)), change.appendedReviews)) throw new GameEvidenceError("learning-reconciliation");
      current.reviews.splice(current.reviews.length - change.appendedReviews.length, change.appendedReviews.length);
      current.card = change.beforeCard;
    }
    expected = before;
    if (entry.previous !== null && typeof entry.previous !== "string") throw new GameEvidenceError("transition-chain");
    id = entry.previous as string | null;
    sequence -= 1;
  }
  if (sequence !== 0 || !jsonEqual(asJson(expected), asJson(archive.baseline.openingFinance))) throw new GameEvidenceError("money-reconciliation");
  if (!jsonEqual(asJson(expectedLearning), asJson(archive.baseline.openingLearning))) throw new GameEvidenceError("learning-reconciliation");
}

/** Initial adoption only. Original imported facts stay distinct from reconstructed v1 projections. */
export function createGameEvidenceCheckpoint(state: GameState, options: { sourceState?: EvidenceObject } = {}): GameEvidenceCheckpoint {
  const current = asObject(asJson(state)), source = jsonCopy(options.sourceState ?? current), builder = new EvidenceBuilder();
  if (typeof source.campaignId === "string" && source.campaignId !== state.campaignId) throw new GameEvidenceError("campaign-identity");
  const base = asObject(builder.project(source));
  const legacy = source.schemaVersion === 1;
  if (legacy) builder.origin = "legacy-projection";
  const projected = asObject(builder.project(current));
  const evidence: GameEvidenceArchive = freezeEvidence({ version: GAME_EVIDENCE_VERSION, campaignId: state.campaignId,
    baseline: { source: base, historicalCoverage: "available-local-data-only", historicalQuestionCountCredit: 0,
      legacyReviewProjection: legacy, openingFinance: finance(state), openingLearning: learning(projected), pins: pins(state) }, records: builder.records });
  indexes.set(evidence, builder.index);
  const snapshot: GameEvidenceSnapshot = freezeEvidence({ version: GAME_EVIDENCE_VERSION, campaignId: state.campaignId,
    gameSchemaVersion: state.schemaVersion, patches: evidencePatches(base, projected), head: { sequence: 0, transitionId: null } });
  return freezeEvidence({ snapshot, evidence });
}

/** No reducers, review replay, current release resolution or persistence migration on hydration. */
export function importGameEvidence(snapshot: GameEvidenceSnapshot, evidence: GameEvidenceArchive): GameState {
  archiveIndex(evidence);
  if (snapshot.version !== GAME_EVIDENCE_VERSION || snapshot.campaignId !== evidence.campaignId || !Array.isArray(snapshot.patches) ||
    !jsonObject(snapshot.head)) throw new GameEvidenceError("snapshot-shape");
  exactFields(snapshot, ["version", "campaignId", "gameSchemaVersion", "patches", "head"]);
  exactFields(snapshot.head, ["sequence", "transitionId"]);
  const projected = asObject(applyEvidencePatches(evidence.baseline.source, snapshot.patches));
  assertProjected(projected, evidence);
  const state = asObject(resolve(projected, evidence)) as unknown as GameState;
  if (state.campaignId !== snapshot.campaignId || state.schemaVersion !== snapshot.gameSchemaVersion) throw new GameEvidenceError("campaign-identity");
  if (!jsonEqual(pins(state), evidence.baseline.pins)) throw new GameEvidenceError("immutable-pins");
  validateHead(snapshot, evidence, state, projected);
  return state;
}

/** Complete logical original remains recoverable after later snapshots and retirement. Exact original text stays on-device. */
export function restoreGameEvidenceImportSource(evidence: GameEvidenceArchive): EvidenceObject {
  archiveIndex(evidence);
  assertProjected(evidence.baseline.source, evidence);
  return asObject(resolve(evidence.baseline.source, evidence));
}

function retainRemoved(builder: EvidenceBuilder, before: EvidenceObject, after: GameState): void {
  const dictionaries: Array<[string, GameEvidenceKind]> = [["encounters", "retired-encounter"]];
  for (const [field, kind] of dictionaries) {
    const old = asObject(before[field]);
    const present = new Set(Object.keys((after as unknown as Record<string, unknown>)[field] as object));
    for (const [id, value] of Object.entries(old)) if (!present.has(id)) builder.put(kind, value);
  }
  const collections: Array<[keyof GameState, GameEvidenceKind]> = [["serviceOperations", "retired-service"],
    ["retailOperations", "retired-retail"], ["retailExternalActors", "retired-actor"], ["retailOrders", "retired-order"]];
  for (const [field, kind] of collections) {
    const present = new Set((after[field] as Array<{ id: string }>).map(value => value.id));
    for (const value of before[field] as EvidenceJson[]) if (!present.has(String(asObject(value).id))) builder.put(kind, value);
  }
}

/**
 * Opt-in, synchronous command boundary for a future cloud coordinator. The old
 * reducer and serialized GameState remain unchanged. The caller must commit the
 * returned snapshot + appended evidence atomically, or keep the old checkpoint.
 */
export function applyGameEvidenceCommand(checkpoint: GameEvidenceCheckpoint, command: GameCommand, context?: DomainContext): {
  checkpoint: GameEvidenceCheckpoint; state: GameState; appendedEvidence: readonly GameEvidenceRecord[]; replayed: boolean;
} {
  const state = importGameEvidence(checkpoint.snapshot, checkpoint.evidence);
  const prior = checkpoint.evidence.records.find(fact => fact.kind === "transition" && asObject(asObject(fact.value).command).operationId === command.operationId);
  if (prior) {
    if (!jsonEqual(asObject(prior.value).command!, asJson(command))) throw new GameEvidenceError("operation-id-reuse");
    return { checkpoint, state, appendedEvidence: [], replayed: true };
  }
  const builder = new EvidenceBuilder(checkpoint.evidence);
  builder.origin = "observed-transition";
  const before = asObject(builder.project(asJson(state))), oldLearning = learning(before);
  let beforeRetirement: EvidenceObject | undefined;
  const next = withGameEvidenceObserver({
    beforeRetirement: value => { beforeRetirement = asObject(builder.project(asJson(value))); },
    event: value => { builder.put("event", asJson(value)); },
    receipt: value => { builder.put("operation", asJson(value)); },
  }, () => gameReducer(state, command, context));
  if (next === state) return { checkpoint, state, appendedEvidence: [], replayed: true };
  const projected = asObject(builder.project(asJson(next))), newLearning = learning(projected);
  if (beforeRetirement) retainRemoved(builder, beforeRetirement, next);
  const oldRun = state.levelFive?.inspection.run, oldPreparation = state.levelFive?.inspection.preparation;
  if ((oldRun || oldPreparation) && !next.levelFive?.inspection.run && !next.levelFive?.inspection.preparation) {
    builder.put("inspection-end", { commandType: command.type, priorRun: before.levelFive ? asObject(asObject(before.levelFive).inspection!).run ?? null : null,
      priorPreparation: before.levelFive ? asObject(asObject(before.levelFive).inspection!).preparation ?? null : null,
      report: projected.levelFive ? asObject(asObject(projected.levelFive).inspection!).lastReport ?? null : null });
  }
  return finishEvidenceTransition(checkpoint, builder, state, next, projected, oldLearning, newLearning, asJson(command));
}

function finishEvidenceTransition(checkpoint: GameEvidenceCheckpoint, builder: EvidenceBuilder, state: GameState, next: GameState,
  projected: EvidenceObject, oldLearning: LearningProjection, newLearning: LearningProjection, command: EvidenceJson) {
  if (Object.keys(oldLearning).length !== Object.keys(newLearning).length) throw new GameEvidenceError("concept-set-change");
  const learningChanges: EvidenceJson[] = [];
  for (const [conceptId, current] of Object.entries(newLearning)) {
    const previous = oldLearning[conceptId];
    if (!previous || !jsonEqual(asJson(previous.reviews), asJson(current.reviews.slice(0, previous.reviews.length)))) throw new GameEvidenceError("review-removal-or-edit");
    const appendedReviews = current.reviews.slice(previous.reviews.length);
    if (previous.card !== current.card && appendedReviews.length === 0) throw new GameEvidenceError("card-change-without-review");
    if (previous.card !== current.card || appendedReviews.length) learningChanges.push({ conceptId, beforeCard: previous.card, afterCard: current.card, appendedReviews });
  }
  const sequence = checkpoint.snapshot.head.sequence + 1;
  const transitionId = builder.put("transition", { sequence, previous: checkpoint.snapshot.head.transitionId, command,
    before: asJson(finance(state)), after: asJson(finance(next)),
    cashDeltaCents: (BigInt(next.cashCents) - BigInt(state.cashCents)).toString(), learningChanges });
  const evidence: GameEvidenceArchive = freezeEvidence({ ...checkpoint.evidence, records: builder.records });
  indexes.set(evidence, builder.index);
  const snapshot: GameEvidenceSnapshot = freezeEvidence({ version: GAME_EVIDENCE_VERSION, campaignId: next.campaignId,
    gameSchemaVersion: next.schemaVersion, patches: evidencePatches(evidence.baseline.source, projected), head: { sequence, transitionId } });
  const result = freezeEvidence({ snapshot, evidence });
  // Always reconcile the complete cards/reviews/money chain before returning an uploadable checkpoint.
  importGameEvidence(snapshot, evidence);
  return { checkpoint: result, state: next, appendedEvidence: evidence.records.slice(checkpoint.evidence.records.length), replayed: false };
}

/**
 * The existing Build Undo restores the exact saved in-memory build state.
 * Keep that projection, while appending a compensating journal transition and
 * explicit receipt reversions to the SAME immutable archive. Never rewind its head.
 */
export function applyGameEvidenceBuildUndo(checkpoint: GameEvidenceCheckpoint, target: GameState, operationId: string): {
  checkpoint: GameEvidenceCheckpoint; state: GameState; appendedEvidence: readonly GameEvidenceRecord[]; replayed: boolean;
} {
  const state = importGameEvidence(checkpoint.snapshot, checkpoint.evidence);
  if (!operationId || checkpoint.evidence.records.some(fact => fact.kind === "transition" && asObject(asObject(fact.value).command).operationId === operationId)) {
    throw new GameEvidenceError("operation-id-reuse");
  }
  if (!state.paused || !target.paused || state.facilityTick !== target.facilityTick || !jsonEqual(pins(state), pins(target)) ||
    !jsonEqual(asJson(state.learningHistories), asJson(target.learningHistories))) throw new GameEvidenceError("unsafe-build-undo");
  const builder = new EvidenceBuilder(checkpoint.evidence); builder.origin = "observed-transition";
  const before = asObject(builder.project(asJson(state))), projected = asObject(builder.project(asJson(target)));
  const revertedReceipts: EvidenceJson[] = [];
  const commandSequences = new Map<string, number>(), alreadyReverted = new Set<string>();
  for (const fact of checkpoint.evidence.records) {
    if (fact.kind === "transition") { const value = asObject(fact.value); commandSequences.set(String(asObject(value.command).operationId), Number(value.sequence)); }
    else if (fact.kind === "build-reversion") alreadyReverted.add(String(asObject(fact.value).revertedOperationId));
  }
  // Runtime receipts are bounded. The target's latest retained command locates
  // its journal boundary; the archive also contains receipts trimmed during a
  // long hallway stroke. Previously undone commands stay reverted exactly once.
  let targetSequence = 0;
  for (const id of Object.keys(target.operationReceipts)) targetSequence = Math.max(targetSequence, commandSequences.get(id) ?? 0);
  for (const fact of checkpoint.evidence.records) {
    if (fact.kind !== "operation" || fact.origin !== "observed-transition") continue;
    const id = String(asObject(fact.value).operationId);
    if ((commandSequences.get(id) ?? 0) <= targetSequence || Object.hasOwn(target.operationReceipts, id) || alreadyReverted.has(id)) continue;
    builder.put("build-reversion", { undoOperationId: operationId, revertedOperationId: id, receiptEvidenceId: fact.id, status: "reverted" });
    alreadyReverted.add(id);
    revertedReceipts.push(id);
  }
  return finishEvidenceTransition(checkpoint, builder, state, target, projected, learning(before), learning(projected),
    { type: "UNDO_BUILD", operationId, revertedReceipts });
}

/** Transport/export owns immutable rows separately; snapshots contain references and operational patches only. */
export function exportGameEvidence(checkpoint: GameEvidenceCheckpoint): GameEvidenceArchive {
  importGameEvidence(checkpoint.snapshot, checkpoint.evidence);
  return checkpoint.evidence;
}
