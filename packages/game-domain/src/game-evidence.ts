import { gameReducer } from "./reducer";
import { withGameEvidenceObserver } from "./game-evidence-capture";
import {
  applyEvidencePatches, evidenceJsonText, evidencePatches, freezeEvidence, GameEvidenceError,
  jsonCopy, jsonEqual, jsonObject, type EvidenceJson, type EvidenceObject, type EvidencePatch,
} from "./game-evidence-json";
import type { DomainContext, GameCommand, GameState } from "./types";
import { EvidenceIndex, normalizeEvidence } from "./game-evidence-index";

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

/** Local operational journal only; this does not change exported save formats.
 * Recorded projections are restored without rerunning commands or grading. */
export interface GameEvidenceDelta {
  readonly fromSequence: number;
  readonly fromRecord: number;
  readonly head: GameEvidenceSnapshot["head"];
  readonly patches: readonly EvidencePatch[];
  readonly records: readonly GameEvidenceRecord[];
}
/** Local journal dialect only: array indices/length avoid rewriting a whole
 * operational collection when one actor changes. Account patches stay intact. */
function journalPatches(before: EvidenceJson, after: EvidenceJson, path: string[] = []): EvidencePatch[] {
  if (before === after) return [];
  const patches: EvidencePatch[] = [];
  if (Array.isArray(before) && Array.isArray(after)) {
    for (let i = 0; i < Math.min(before.length, after.length); i++) patches.push(...journalPatches(before[i]!, after[i]!, [...path, String(i)]));
    for (let i = before.length; i < after.length; i++) patches.push({ path: [...path, String(i)], present: true, value: after[i]! });
    if (after.length < before.length) patches.push({ path: [...path, "length"], present: true, value: after.length });
    return patches;
  }
  if (jsonObject(before) && jsonObject(after)) {
    for (const key of Object.keys(before)) {
      if (!Object.hasOwn(after, key)) patches.push({ path: [...path, key], present: false });
      else patches.push(...journalPatches(before[key]!, after[key]!, [...path, key]));
    }
    for (const key of Object.keys(after)) if (!Object.hasOwn(before, key)) patches.push({ path: [...path, key], present: true, value: after[key]! });
    return patches;
  }
  return [{ path, present: true, value: after }];
}
function applyJournalOwned(value: EvidenceJson, patches: readonly EvidencePatch[]): EvidenceJson {
  const index = (key: string) => /^(0|[1-9][0-9]*)$/.test(key) && Number.isSafeInteger(Number(key)) ? Number(key) : -1;
  for (const patch of patches) {
    if (!Array.isArray(patch.path) || patch.path.some(key => typeof key !== "string") || typeof patch.present !== "boolean" ||
      patch.present !== Object.hasOwn(patch, "value")) throw new GameEvidenceError("journal-patch");
    if (!patch.path.length) { if (!patch.present) throw new GameEvidenceError("journal-patch"); value = jsonCopy(patch.value!); continue; }
    let parent = value;
    for (const key of patch.path.slice(0, -1)) {
      if (Array.isArray(parent)) { const i = index(key); if (i < 0 || i >= parent.length) throw new GameEvidenceError("journal-patch"); parent = parent[i]!; }
      else { if (!jsonObject(parent) || !Object.hasOwn(parent, key)) throw new GameEvidenceError("journal-patch"); parent = parent[key]!; }
    }
    const key = patch.path.at(-1)!;
    if (Array.isArray(parent)) {
      if (key === "length" && patch.present && typeof patch.value === "number" && Number.isSafeInteger(patch.value) && patch.value >= 0 && patch.value <= parent.length) parent.length = patch.value;
      else { const i = index(key); if (i < 0 || i > parent.length || !patch.present) throw new GameEvidenceError("journal-patch"); parent[i] = jsonCopy(patch.value!); }
    } else {
      if (!jsonObject(parent)) throw new GameEvidenceError("journal-patch");
      if (patch.present) Object.defineProperty(parent, key, { value: jsonCopy(patch.value!), enumerable: true, configurable: true, writable: true });
      else { if (!Object.hasOwn(parent, key)) throw new GameEvidenceError("journal-patch"); delete parent[key]; }
    }
  }
  return value;
}
/** Pure private projection update; never mutates the checkpoint or raw rows. */
export function applyGameEvidenceJournalPatches(base: EvidenceObject, patches: readonly EvidencePatch[]): EvidenceObject {
  return asObject(applyJournalOwned(jsonCopy(base), patches));
}
/** A privately owned worker can maintain this projection from recorded patches.
 * Hydration/import still performs the complete contract validation. */
export function gameEvidenceProjection(checkpoint: GameEvidenceCheckpoint): EvidenceObject {
  return asObject(applyEvidencePatches(checkpoint.evidence.baseline.source, checkpoint.snapshot.patches));
}
export function gameEvidenceOperationalSnapshot(base: GameEvidenceCheckpoint, projected: EvidenceObject,
  head: GameEvidenceSnapshot["head"]): GameEvidenceSnapshot {
  return { version: base.snapshot.version, campaignId: base.snapshot.campaignId, gameSchemaVersion: base.snapshot.gameSchemaVersion,
    head, patches: evidencePatches(base.evidence.baseline.source, projected) };
}

export function gameEvidenceDelta(before: GameEvidenceCheckpoint, after: GameEvidenceCheckpoint): GameEvidenceDelta {
  const prior = runtimeFor(before), next = runtimeFor(after);
  const chunks: (readonly GameEvidenceRecord[])[] = [];
  let cursor: EvidenceLog | undefined = next.log;
  while (cursor && cursor !== prior.log) { chunks.push(cursor.added); cursor = cursor.parent; }
  // Hydrated imports can have equivalent, independently indexed prefix logs.
  // Only trusted descendants created from this checkpoint take the fast path.
  if (!cursor) throw new GameEvidenceError("journal-branch");
  const records: GameEvidenceRecord[] = [];
  for (let i = chunks.length - 1; i >= 0; i--) records.push(...chunks[i]!);
  return { fromSequence: before.snapshot.head.sequence, fromRecord: prior.log.length,
    head: after.snapshot.head, patches: journalPatches(prior.projected, next.projected), records };
}

/** Full validation belongs to recovery/compaction, not every local append. */
export function restoreGameEvidenceJournal(base: GameEvidenceCheckpoint, deltas: readonly GameEvidenceDelta[]): GameEvidenceCheckpoint {
  let projected = applyEvidencePatches(base.evidence.baseline.source, base.snapshot.patches);
  const records = [...base.evidence.records];
  let head = base.snapshot.head;
  for (const delta of deltas) {
    if (delta.fromSequence !== head.sequence || delta.fromRecord !== records.length || delta.head.sequence < head.sequence ||
      delta.records.some((row, i) => row.id !== `e${(records.length + i + 1).toString(36)}`)) throw new GameEvidenceError("journal-sequence");
    projected = applyJournalOwned(projected, delta.patches);
    records.push(...delta.records); head = delta.head;
  }
  const checkpoint = freezeEvidence({ snapshot: { ...base.snapshot, head, patches: evidencePatches(base.evidence.baseline.source, projected) },
    evidence: { ...base.evidence, records } });
  importGameEvidence(checkpoint.snapshot, checkpoint.evidence);
  return checkpoint;
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

const indexes = new WeakMap<GameEvidenceArchive, EvidenceIndex<string>>();
function archiveIndex(archive: GameEvidenceArchive): EvidenceIndex<string> {
  const cached = Object.isFrozen(archive) ? indexes.get(archive) : undefined;
  if (cached) return cached;
  if (archive.version !== GAME_EVIDENCE_VERSION || typeof archive.campaignId !== "string" || !archive.campaignId ||
    !Array.isArray(archive.records) || !jsonObject(archive.baseline) || archive.baseline.historicalCoverage !== "available-local-data-only" ||
    archive.baseline.historicalQuestionCountCredit !== 0 || typeof archive.baseline.legacyReviewProjection !== "boolean") {
    throw new GameEvidenceError("archive-shape");
  }
  exactFields(archive, ["version", "campaignId", "baseline", "records"]);
  exactFields(archive.baseline, ["source", "historicalCoverage", "historicalQuestionCountCredit", "legacyReviewProjection", "openingFinance", "openingLearning", "pins"]);
  let result = EvidenceIndex.empty<string>();
  for (const [index, fact] of archive.records.entries()) {
    exactFields(fact, ["id", "kind", "origin", "value"]);
    if (fact.id !== `e${(index + 1).toString(36)}` || !kinds.includes(fact.kind) ||
      !["import-baseline", "legacy-projection", "observed-transition"].includes(fact.origin) || !Object.hasOwn(fact, "value")) throw new GameEvidenceError("record-shape");
    const key = `${fact.kind}\0${evidenceJsonText(fact.value)}`;
    if (result.has(key)) throw new GameEvidenceError("duplicate-evidence");
    result = result.with(key, fact.id);
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

interface EvidenceLog {
  readonly length: number;
  readonly parent?: EvidenceLog;
  readonly added: readonly GameEvidenceRecord[];
}
function materializeRecords(log: EvidenceLog): readonly GameEvidenceRecord[] {
  const chunks: (readonly GameEvidenceRecord[])[] = [];
  for (let node: EvidenceLog | undefined = log; node; node = node.parent) chunks.push(node.added);
  const records: GameEvidenceRecord[] = [];
  for (let i = chunks.length - 1; i >= 0; i--) for (const fact of chunks[i]!) records.push(fact);
  return Object.freeze(records);
}
interface EvidenceRuntime {
  readonly state: GameState;
  readonly projected: EvidenceObject;
  readonly learning: LearningProjection;
  readonly log: EvidenceLog;
  readonly content: EvidenceIndex<string>;
  readonly operations: EvidenceIndex<GameEvidenceRecord>;
  readonly byId: EvidenceIndex<GameEvidenceRecord>;
  readonly receipts: EvidenceIndex<GameEvidenceRecord>;
  readonly reverted: EvidenceIndex<true>;
  readonly undoHead: UndoHead | undefined;
  readonly regularChain: boolean;
  readonly resolution: WeakMap<object, ResolvedProjection>;
  readonly operationScanError?: unknown;
}
interface UndoHead { readonly sequence: number; readonly operationId: string; readonly previous?: UndoHead }
const runtimes = new WeakMap<GameEvidenceCheckpoint, EvidenceRuntime>();

class EvidenceBuilder {
  readonly added: GameEvidenceRecord[] = [];
  readonly prefix: EvidenceLog;
  index: EvidenceIndex<string>;
  byId: EvidenceIndex<GameEvidenceRecord>;
  origin: GameEvidenceRecord["origin"] = "import-baseline";
  constructor(runtime?: EvidenceRuntime) {
    this.prefix = runtime?.log ?? { length: 0, added: [] };
    this.index = runtime?.content ?? EvidenceIndex.empty();
    this.byId = runtime?.byId ?? EvidenceIndex.empty();
  }
  get records(): readonly GameEvidenceRecord[] { return materializeRecords(this.log); }
  get log(): EvidenceLog { return { length: this.prefix.length + this.added.length, parent: this.prefix, added: Object.freeze(this.added.slice()) }; }
  put(kind: GameEvidenceKind, value: EvidenceJson): string {
    const key = `${kind}\0${evidenceJsonText(value)}`, previous = this.index.get(key);
    if (previous) return previous;
    const id = `e${(this.prefix.length + this.added.length + 1).toString(36)}`;
    const fact = freezeEvidence({ id, kind, origin: this.origin, value: jsonCopy(value) });
    this.added.push(fact);
    this.index = this.index.with(key, id);
    this.byId = this.byId.with(id, fact);
    return id;
  }
  project(value: EvidenceJson, path: string[] = [], previous?: EvidenceJson, projection?: EvidenceJson): EvidenceJson {
    if (value === previous && projection !== undefined) return projection;
    if (isReference(value)) throw new GameEvidenceError("reserved-reference-in-source");
    const kind = kindAt(path);
    if (kind && value !== null) return reference(this.put(kind, value));
    if (Array.isArray(value)) return value.map((child, index) => this.project(child, [...path, String(index)], Array.isArray(previous) ? previous[index] : undefined, Array.isArray(projection) ? projection[index] : undefined));
    if (jsonObject(value)) return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, this.project(child, [...path, key], jsonObject(previous) ? previous[key] : undefined, jsonObject(projection) ? projection[key] : undefined)]));
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

// Patches preserve the import source's object-key order. Keep that same order
// in the hydrated runtime too (JSON bytes, not just canonical equality).
const rebased = new WeakMap<object, WeakMap<object, EvidenceJson>>();
function rebaseProjection(base: EvidenceJson, current: EvidenceJson): EvidenceJson {
  if (base === current || current === null || typeof current !== "object" || base === null || typeof base !== "object") return current;
  const cached = rebased.get(current)?.get(base);
  if (cached !== undefined) return cached;
  let result: EvidenceJson;
  if (jsonEqual(base, current)) result = base;
  else if (!jsonObject(base) || !jsonObject(current)) result = current;
  else result = Object.fromEntries([...new Set([...Object.keys(base), ...Object.keys(current)])]
    .filter(key => Object.hasOwn(current, key)).map(key => [key, Object.hasOwn(base, key) ? rebaseProjection(base[key]!, current[key]!) : current[key]!]));
  let entries = rebased.get(current);
  if (!entries) { entries = new WeakMap(); rebased.set(current, entries); }
  entries.set(base, result);
  return result;
}
interface ResolvedProjection { value: EvidenceJson; nodes: number; textUnits: number; height: number }
function resolveIncremental(value: EvidenceJson, byId: EvidenceIndex<GameEvidenceRecord>, resolved: WeakMap<object, ResolvedProjection>, active = new Set<string>()): ResolvedProjection {
  if (value !== null && typeof value === "object") {
    const cached = resolved.get(value);
    if (cached) return cached;
  }
  let result: ResolvedProjection = { value, nodes: 1, textUnits: typeof value === "string" ? value.length : 0, height: 0 };
  const add = (child: ResolvedProjection) => {
    result.nodes += child.nodes; result.textUnits += child.textUnits; result.height = Math.max(result.height, child.height + 1);
    return child.value;
  };
  if (isReference(value)) {
    if (!/^e[1-9a-z][0-9a-z]*$/.test(value.$e)) throw new GameEvidenceError("reference-shape");
    if (active.has(value.$e)) throw new GameEvidenceError("reference-cycle");
    const record = byId.get(value.$e);
    if (!record) throw new GameEvidenceError("missing-evidence");
    result.textUnits += 2;
    active.add(value.$e);
    try { result.value = add(resolveIncremental(record.value, byId, resolved, active)); }
    finally { active.delete(value.$e); }
  } else if (Array.isArray(value)) result.value = Object.freeze(value.map(child => add(resolveIncremental(child, byId, resolved, active)))) as unknown as EvidenceJson[];
  else if (jsonObject(value)) {
    result.textUnits += Object.keys(value).reduce((sum, key) => sum + key.length, 0);
    result.value = Object.freeze(Object.fromEntries(Object.entries(value).map(([key, child]) => [key, add(resolveIncremental(child, byId, resolved, active))])));
  }
  if (result.height > 128) throw new GameEvidenceError("reference-depth");
  if (result.nodes > 300_000 || result.textUnits > 6_000_000) throw new GameEvidenceError("resolved-size");
  if (value !== null && typeof value === "object") resolved.set(value, result);
  return result;
}

function deeplyFrozen(value: unknown): boolean {
  return value === null || typeof value !== "object" || Object.isFrozen(value) && Object.values(value).every(deeplyFrozen);
}
function runtimeFor(checkpoint: GameEvidenceCheckpoint): EvidenceRuntime {
  const existing = runtimes.get(checkpoint);
  if (existing) return existing;
  // Untrusted load/import ALWAYS performs the complete contract/chain check.
  const state = freezeEvidence(importGameEvidence(checkpoint.snapshot, checkpoint.evidence));
  const projected = freezeEvidence(asObject(applyEvidencePatches(checkpoint.evidence.baseline.source, checkpoint.snapshot.patches)));
  const records = freezeEvidence(checkpoint.evidence.records.slice());
  let operations = EvidenceIndex.empty<GameEvidenceRecord>(), byId = EvidenceIndex.empty<GameEvidenceRecord>();
  let receipts = EvidenceIndex.empty<GameEvidenceRecord>(), reverted = EvidenceIndex.empty<true>(), undoHead: UndoHead | undefined;
  let transitionCount = 0, regularChain = true, operationScanError: unknown;
  for (const record of records) {
    byId = byId.with(record.id, record);
    if (record.kind === "transition") {
      transitionCount++;
      if (!operationScanError) try {
        const entry = asObject(record.value), operationId = asObject(entry.command).operationId;
        // Preserve find/some short-circuit behavior for unusual imported
        // archives: the first matching command precedes any malformed orphan.
        if (typeof operationId === "string" && !operations.has(operationId)) operations = operations.with(operationId, record);
        if (entry.sequence !== transitionCount) regularChain = false;
        undoHead = { sequence: Number(entry.sequence), operationId: String(operationId), previous: undoHead };
      } catch (error) { operationScanError = error; regularChain = false; }
    } else if (record.kind === "operation" && record.origin === "observed-transition") {
      if (!jsonObject(record.value)) regularChain = false;
      else {
        const operationId = String(record.value.operationId);
        if (!receipts.has(operationId)) receipts = receipts.with(operationId, record);
      }
    } else if (record.kind === "build-reversion") {
      if (!jsonObject(record.value)) regularChain = false;
      else reverted = reverted.with(String(record.value.revertedOperationId), true);
    }
  }
  if (transitionCount !== checkpoint.snapshot.head.sequence) regularChain = false;
  const runtime: EvidenceRuntime = { state, projected, learning: learning(projected),
    log: { length: records.length, added: records },
    content: archiveIndex(checkpoint.evidence), operations, byId, receipts, reverted, undoHead, regularChain, resolution: new WeakMap(), operationScanError };
  // Mutable caller-owned checkpoints are rechecked on every use. Newly emitted
  // checkpoints are registered directly and need no deep-frozen scan.
  if (deeplyFrozen(checkpoint)) runtimes.set(checkpoint, runtime);
  return runtime;
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
function learning(projected: EvidenceObject, previous?: EvidenceRuntime): LearningProjection {
  if (previous && projected.learningHistories === previous.projected.learningHistories) return previous.learning;
  const result: LearningProjection = {};
  for (const [id, value] of Object.entries(asObject(projected.learningHistories))) {
    if (previous && value === asObject(previous.projected.learningHistories)[id]) {
      Object.defineProperty(result, id, { value: previous.learning[id], enumerable: true, writable: true, configurable: true });
      continue;
    }
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
  const runtime = runtimeFor(checkpoint), state = runtime.state;
  const prior = runtime.operations.get(command.operationId);
  if (prior) {
    if (!jsonEqual(asObject(prior.value).command!, asJson(command))) throw new GameEvidenceError("operation-id-reuse");
    return { checkpoint, state: jsonCopy(state), appendedEvidence: [], replayed: true };
  }
  if (runtime.operationScanError) throw runtime.operationScanError;
  const builder = new EvidenceBuilder(runtime);
  builder.origin = "observed-transition";
  const before = runtime.projected;
  let beforeRetirement: EvidenceObject | undefined;
  const next = withGameEvidenceObserver({
    beforeRetirement: value => { beforeRetirement = asObject(builder.project(freezeEvidence(normalizeEvidence(value, state)) as unknown as EvidenceObject, [], state as unknown as EvidenceObject, before)); },
    event: value => { builder.put("event", asJson(value)); },
    receipt: value => { builder.put("operation", asJson(value)); },
  }, () => gameReducer(state, command, context));
  if (next === state) return { checkpoint, state: jsonCopy(state), appendedEvidence: [], replayed: true };
  const normalized = freezeEvidence(normalizeEvidence(next, state)) as unknown as EvidenceObject;
  const projected = freezeEvidence(asObject(builder.project(normalized, [], state as unknown as EvidenceObject, before)));
  if (beforeRetirement) retainRemoved(builder, beforeRetirement, next);
  const oldRun = state.levelFive?.inspection.run, oldPreparation = state.levelFive?.inspection.preparation;
  if ((oldRun || oldPreparation) && !next.levelFive?.inspection.run && !next.levelFive?.inspection.preparation) {
    builder.put("inspection-end", { commandType: command.type, priorRun: before.levelFive ? asObject(asObject(before.levelFive).inspection!).run ?? null : null,
      priorPreparation: before.levelFive ? asObject(asObject(before.levelFive).inspection!).preparation ?? null : null,
      report: projected.levelFive ? asObject(asObject(projected.levelFive).inspection!).lastReport ?? null : null });
  }
  return finishEvidenceTransition(checkpoint, runtime, builder, next, projected, asJson(command));
}

function finishEvidenceTransition(checkpoint: GameEvidenceCheckpoint, runtime: EvidenceRuntime, builder: EvidenceBuilder, next: GameState,
  projected: EvidenceObject, command: EvidenceJson) {
  const state = runtime.state, oldLearning = runtime.learning, newLearning = learning(projected, runtime);
  if (next.campaignId !== checkpoint.snapshot.campaignId || next.schemaVersion !== checkpoint.snapshot.gameSchemaVersion) throw new GameEvidenceError("campaign-identity");
  if (!jsonEqual(pins(next), checkpoint.evidence.baseline.pins)) throw new GameEvidenceError("immutable-pins");
  if (Object.keys(oldLearning).length !== Object.keys(newLearning).length) throw new GameEvidenceError("concept-set-change");
  const learningChanges: EvidenceJson[] = [];
  for (const [conceptId, current] of Object.entries(newLearning)) {
    const previous = oldLearning[conceptId];
    if (previous === current) continue;
    if (!previous || !jsonEqual(asJson(previous.reviews), asJson(current.reviews.slice(0, previous.reviews.length)))) throw new GameEvidenceError("review-removal-or-edit");
    const appendedReviews = current.reviews.slice(previous.reviews.length);
    if (previous.card !== current.card && appendedReviews.length === 0) throw new GameEvidenceError("card-change-without-review");
    if (previous.card !== current.card || appendedReviews.length) learningChanges.push({ conceptId, beforeCard: previous.card, afterCard: current.card, appendedReviews });
  }
  const sequence = checkpoint.snapshot.head.sequence + 1;
  const beforeFinance = finance(state), afterFinance = finance(next);
  const transitionId = builder.put("transition", { sequence, previous: checkpoint.snapshot.head.transitionId, command,
    before: asJson(beforeFinance), after: asJson(afterFinance),
    cashDeltaCents: (BigInt(next.cashCents) - BigInt(state.cashCents)).toString(), learningChanges });
  const log = builder.log;
  // Plain enumerable getters materialize ordinary frozen arrays only when a
  // serialization/verification consumer requests them. Native structuredClone
  // invokes them normally; no Proxy/custom wire type crosses that boundary.
  let records: readonly GameEvidenceRecord[] | undefined, patches: readonly EvidencePatch[] | undefined;
  const evidence: GameEvidenceArchive = Object.freeze({ version: checkpoint.evidence.version,
    campaignId: checkpoint.evidence.campaignId, baseline: freezeEvidence(checkpoint.evidence.baseline),
    get records() { return records ??= materializeRecords(log); } });
  indexes.set(evidence, builder.index);
  const snapshot: GameEvidenceSnapshot = Object.freeze({ version: GAME_EVIDENCE_VERSION, campaignId: next.campaignId,
    gameSchemaVersion: next.schemaVersion,
    get patches() { return patches ??= freezeEvidence(evidencePatches(evidence.baseline.source, projected)); },
    head: Object.freeze({ sequence, transitionId }) });
  const result = Object.freeze({ snapshot, evidence });
  const hydratedProjection = freezeEvidence(asObject(rebaseProjection(evidence.baseline.source, projected)));
  const hydrated = resolveIncremental(hydratedProjection, builder.byId, runtime.resolution).value as unknown as GameState;
  // The trusted prefix was fully reconciled on adoption. This extension checks
  // exact pins, concept membership, unchanged review prefixes, card/review
  // coupling, finance range/delta, unique operation and the immediate chain tip.
  // Full import/export verification still walks the entire untrusted chain.
  const operationId = String(asObject(command).operationId);
  if (runtime.operations.has(operationId)) throw new GameEvidenceError("operation-id-reuse");
  let receipts = runtime.receipts, reverted = runtime.reverted;
  for (const record of builder.added) {
    if (record.kind === "operation" && record.origin === "observed-transition") {
      const id = String(asObject(record.value).operationId);
      if (!receipts.has(id)) receipts = receipts.with(id, record);
    } else if (record.kind === "build-reversion") reverted = reverted.with(String(asObject(record.value).revertedOperationId), true);
  }
  runtimes.set(result, { state: hydrated, projected: hydratedProjection, learning: newLearning, log,
    content: builder.index, byId: builder.byId, operations: runtime.operations.with(operationId, builder.byId.get(transitionId)!),
    receipts, reverted, undoHead: { sequence, operationId, previous: runtime.undoHead }, regularChain: runtime.regularChain, resolution: runtime.resolution });
  return { checkpoint: result, state: next, appendedEvidence: builder.added.slice(), replayed: false };
}

/**
 * The existing Build Undo restores the exact saved in-memory build state.
 * Keep that projection, while appending a compensating journal transition and
 * explicit receipt reversions to the SAME immutable archive. Never rewind its head.
 */
export function applyGameEvidenceBuildUndo(checkpoint: GameEvidenceCheckpoint, target: GameState, operationId: string): {
  checkpoint: GameEvidenceCheckpoint; state: GameState; appendedEvidence: readonly GameEvidenceRecord[]; replayed: boolean;
} {
  const runtime = runtimeFor(checkpoint), state = runtime.state;
  if (!operationId || runtime.operations.has(operationId)) {
    throw new GameEvidenceError("operation-id-reuse");
  }
  if (runtime.operationScanError) throw runtime.operationScanError;
  if (!state.paused || !target.paused || state.facilityTick !== target.facilityTick || !jsonEqual(pins(state), pins(target)) ||
    !jsonEqual(asJson(state.learningHistories), asJson(target.learningHistories))) throw new GameEvidenceError("unsafe-build-undo");
  const builder = new EvidenceBuilder(runtime); builder.origin = "observed-transition";
  const projected = freezeEvidence(asObject(builder.project(freezeEvidence(normalizeEvidence(target, state)) as unknown as EvidenceObject, [], state as unknown as EvidenceObject, runtime.projected)));
  const revertedReceipts: EvidenceJson[] = [];
  if (runtime.regularChain) {
    let targetSequence = 0;
    for (const id of Object.keys(target.operationReceipts)) {
      const record = runtime.operations.get(id);
      if (record) targetSequence = Math.max(targetSequence, Number(asObject(record.value).sequence));
    }
    const candidates: GameEvidenceRecord[] = [];
    for (let head = runtime.undoHead; head && head.sequence > targetSequence; head = head.previous) {
      const receipt = runtime.receipts.get(head.operationId);
      if (receipt && !Object.hasOwn(target.operationReceipts, head.operationId) && !runtime.reverted.has(head.operationId)) candidates.push(receipt);
    }
    // Preserve the old archive-order receipt traversal exactly, including an
    // earlier receipt first captured inside a compound development command.
    candidates.sort((a, b) => Number.parseInt(a.id.slice(1), 36) - Number.parseInt(b.id.slice(1), 36));
    for (const receipt of candidates) {
      const id = String(asObject(receipt.value).operationId);
      builder.put("build-reversion", { undoOperationId: operationId, revertedOperationId: id, receiptEvidenceId: receipt.id, status: "reverted" });
      revertedReceipts.push(id);
    }
    return finishEvidenceTransition(checkpoint, runtime, builder, target, projected, { type: "UNDO_BUILD", operationId, revertedReceipts });
  }
  // Preserve compatibility with unusual imported archives containing orphan
  // transitions. Ordinary generated chains take the suffix-only path above.
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
  return finishEvidenceTransition(checkpoint, runtime, builder, target, projected,
    { type: "UNDO_BUILD", operationId, revertedReceipts });
}

/** Transport/export owns immutable rows separately; snapshots contain references and operational patches only. */
export function exportGameEvidence(checkpoint: GameEvidenceCheckpoint): GameEvidenceArchive {
  importGameEvidence(checkpoint.snapshot, checkpoint.evidence);
  return checkpoint.evidence;
}
