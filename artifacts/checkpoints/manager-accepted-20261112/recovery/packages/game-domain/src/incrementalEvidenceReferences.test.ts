import { expect, it } from "vitest";
import type { GameEvidenceRecord } from "./game-evidence";
import { freezeEvidence } from "./game-evidence-json";
import { cachedEvidenceRecord, rememberEvidenceRecord, stableEvidenceReference } from "./incrementalEvidenceReferences";

it("reuses immutable row facts and references without confusing sibling record IDs or kinds", () => {
  const value = freezeEvidence({ id: "row", n: 1 });
  const first = freezeEvidence({ id: "e1", kind: "event", origin: "observed-transition", value }) satisfies GameEvidenceRecord;
  const sibling = freezeEvidence({ ...first, value: { id: "other", n: 2 } }) satisfies GameEvidenceRecord;
  rememberEvidenceRecord("event", value, first);
  expect(cachedEvidenceRecord("event", value, () => first)).toBe(first);
  expect(cachedEvidenceRecord("event", value, () => sibling)).toBeUndefined();
  expect(cachedEvidenceRecord("income", value, () => first)).toBeUndefined();
  expect(stableEvidenceReference(first)).toBe(stableEvidenceReference(first));
  expect(stableEvidenceReference(sibling)).not.toBe(stableEvidenceReference(first));
  expect(JSON.stringify(stableEvidenceReference(first))).toBe('{"$e":"e1"}');
});

it("never retains mutable or shallow-frozen input rows", () => {
  const mutable = { nested: { n: 1 } }, shallow = Object.freeze({ nested: { n: 1 } });
  const fact = freezeEvidence({ id: "e2", kind: "event", origin: "observed-transition", value: { n: 1 } }) satisfies GameEvidenceRecord;
  for (const row of [mutable, shallow]) {
    rememberEvidenceRecord("event", row, fact);
    expect(cachedEvidenceRecord("event", row, () => fact)).toBeUndefined();
  }
});
