import type { GameEvidenceDelta } from "@gamify-surgery/game-domain";
import { CloudCacheError } from "./cloud/codecCache";

// Transport-only provenance. Never stored in a journal row or account snapshot.
const parts = new WeakMap<GameEvidenceDelta, readonly GameEvidenceDelta[]>();
type Patch = GameEvidenceDelta["patches"][number];
type Writes = { at?: number; children: Map<string, Writes> };
const writes = (): Writes => ({ children: new Map() });

/** Independent assignments commute. Put the last value at its FIRST write's
 * position to preserve newly inserted object-key order. Overlapping writes,
 * deletions and array structure changes close that independent run. */
function compactPatches(deltas: readonly GameEvidenceDelta[]): Patch[] {
  const root = writes(), result: Patch[] = [];
  for (const delta of deltas) for (const patch of delta.patches) {
    // Do not let an overwritten assignment conceal malformed input that the
    // released recovery reader would reject.
    if (!patch || !Array.isArray(patch.path) || patch.path.some(key => typeof key !== "string") ||
      typeof patch.present !== "boolean" || patch.present !== Object.hasOwn(patch, "value") ||
      patch.present && patch.value === undefined) throw new CloudCacheError("checksum");
    if (!patch.path.length) { root.children.clear(); result.push(patch); continue; }
    let node = root, parent = root;
    for (const key of patch.path) {
      node.at = undefined; parent = node;
      let next = node.children.get(key);
      if (!next) { next = writes(); node.children.set(key, next); }
      node = next;
    }
    const key = patch.path.at(-1)!;
    if (key === "length" || /^(0|[1-9][0-9]*)$/.test(key)) {
      // An indexed write may extend an array; preserve every such operation
      // and invalidate sibling paths whose existence/order depends on it.
      parent.children.clear(); parent.at = undefined; result.push(patch); continue;
    }
    node.children.clear();
    if (!patch.present) { node.at = undefined; result.push(patch); }
    else if (node.at !== undefined) result[node.at] = patch;
    else { node.at = result.length; result.push(patch); }
  }
  return result;
}
// A slow append may leave a whole accepted queue behind it. This is the existing
// logical-command bound, not a new row/receipt/history allowance.
export const MAX_CLOCK_JOURNAL_COMMANDS = 128;

export function clockJournalDeltasContinue(first: GameEvidenceDelta, second: GameEvidenceDelta): boolean {
  return first.head.sequence === second.fromSequence && first.fromRecord + first.records.length === second.fromRecord;
}

/** The released journal reader already applies patches/records in order and
 * permits a delta to span multiple transitions. Keep every operation/FSRS row. */
export function joinClockJournalDeltas(first: GameEvidenceDelta, second: GameEvidenceDelta): GameEvidenceDelta | null {
  return materializeClockJournalDeltas([...clockJournalDeltaParts(first), ...clockJournalDeltaParts(second)]);
}

/** Called once when sealing a bounded list, never while admitting each tick.
 * Keep every record and the exact final projection in the released fields. */
export function materializeClockJournalDeltas(deltas: readonly GameEvidenceDelta[]): GameEvidenceDelta | null {
  if (!deltas.length || deltas.length > MAX_CLOCK_JOURNAL_COMMANDS) return null;
  if (deltas.length === 1) return deltas[0]!;
  const first = deltas[0]!, last = deltas.at(-1)!;
  for (let i = 1; i < deltas.length; i++) if (!clockJournalDeltasContinue(deltas[i - 1]!, deltas[i]!)) return null;
  let patches: Patch[] | undefined, records: GameEvidenceDelta["records"][number][] | undefined;
  const joined = { fromSequence: first.fromSequence, fromRecord: first.fromRecord, head: last.head,
    // Worker version IDs can encode this row without expanding it on main.
    // Fallback/native storage reads the same memoized released-format fields.
    get patches() { return patches ??= compactPatches(deltas); },
    get records() {
      if (!records) { records = []; for (const delta of deltas) for (const record of delta.records) records.push(record); }
      return records;
    } };
  parts.set(joined, deltas.slice());
  return joined;
}

export function clockJournalDeltaParts(delta: GameEvidenceDelta): readonly GameEvidenceDelta[] { return parts.get(delta) ?? [delta]; }
