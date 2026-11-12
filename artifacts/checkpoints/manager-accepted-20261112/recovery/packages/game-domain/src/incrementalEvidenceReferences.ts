import type { GameEvidenceKind, GameEvidenceRecord } from "./game-evidence";
import { isImmutableEvidenceJson } from "./incrementalEvidenceValues";
import type { EvidenceJson } from "./game-evidence-json";

const recordsByValue = new WeakMap<object, Map<GameEvidenceKind, GameEvidenceRecord>>();
const references = new WeakMap<GameEvidenceRecord, { readonly $e: string }>();

/** Validate the exact record identity in this branch. A sibling checkpoint can
 * assign the same ID to another record; ID membership alone is insufficient.
 * Weak keys keep this independent of journal/command-tail length.
 */
export function cachedEvidenceRecord(kind: GameEvidenceKind, value: EvidenceJson,
  recordAt: (id: string) => GameEvidenceRecord | undefined): GameEvidenceRecord | undefined {
  if (value === null || typeof value !== "object" || !isImmutableEvidenceJson(value)) return undefined;
  const record = recordsByValue.get(value)?.get(kind);
  return record && recordAt(record.id) === record ? record : undefined;
}

export function rememberEvidenceRecord(kind: GameEvidenceKind, value: EvidenceJson, record: GameEvidenceRecord): void {
  if (value === null || typeof value !== "object" || !isImmutableEvidenceJson(value) || !Object.isFrozen(record)) return;
  let kinds = recordsByValue.get(value);
  if (!kinds) { kinds = new Map(); recordsByValue.set(value, kinds); }
  kinds.set(kind, record);
}

/** Identical wire object, stable private identity. Repeated shifted rows can
 * reuse the already checked resolution instead of rebuilding $e wrappers.
 */
export function stableEvidenceReference(record: GameEvidenceRecord): { readonly $e: string } {
  if (!Object.isFrozen(record)) return { $e: record.id };
  let reference = references.get(record);
  if (!reference) { reference = Object.freeze({ $e: record.id }); references.set(record, reference); }
  return reference;
}
