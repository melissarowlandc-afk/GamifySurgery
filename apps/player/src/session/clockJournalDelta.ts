import type { GameEvidenceDelta } from "@gamify-surgery/game-domain";

// Transport-only provenance. Never stored in a journal row or account snapshot.
const parts = new WeakMap<GameEvidenceDelta, readonly GameEvidenceDelta[]>();
// A two-second window can contain three 1 Hz pulses when the clock callback
// runs before the deadline callback. Bound composition work in either ordering.
export const MAX_CLOCK_JOURNAL_COMMANDS = 3;

/** The released journal reader already applies patches/records in order and
 * permits a delta to span multiple transitions. Keep every operation/FSRS row. */
export function joinClockJournalDeltas(first: GameEvidenceDelta, second: GameEvidenceDelta): GameEvidenceDelta | null {
  if (first.head.sequence !== second.fromSequence || first.fromRecord + first.records.length !== second.fromRecord) return null;
  const joined = { fromSequence: first.fromSequence, fromRecord: first.fromRecord, head: second.head,
    patches: [...first.patches, ...second.patches], records: [...first.records, ...second.records] };
  parts.set(joined, [...clockJournalDeltaParts(first), ...clockJournalDeltaParts(second)]);
  return joined;
}

export function clockJournalDeltaParts(delta: GameEvidenceDelta): readonly GameEvidenceDelta[] { return parts.get(delta) ?? [delta]; }
