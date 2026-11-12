import { expect, it, vi } from "vitest";
import { projectEvidenceArray } from "./incrementalEvidenceProjection";
import { freezeEvidence, type EvidenceJson } from "./game-evidence-json";

it("reuses only exact immutable source/projection pairs after ordered pruning and appending", () => {
  const previous = freezeEvidence(Array.from({ length: 500 }, (_, id) => ({ id, nested: { n: id } })));
  const projection = freezeEvidence(previous.map((_, i) => ({ $e: `e${i + 1}` })));
  const added = { id: 501, nested: { n: 501 } }, input = [...previous.slice(1), added];
  const project = vi.fn((child: EvidenceJson) => ({ id: (child as { id: number }).id }));
  const actual = projectEvidenceArray(input, previous, projection, project);
  expect(actual.slice(0, 499)).toEqual(projection.slice(1));
  expect(actual[0]).toBe(projection[1]); expect(project).toHaveBeenCalledTimes(1);
  expect(actual[499]).toEqual({ id: 501 });
  const other = freezeEvidence(projection.map((_, i) => ({ $e: `other${i}` })));
  expect(projectEvidenceArray(input, previous, other, project)[0]).toBe(other[1]);
});

it("does not use deep-equal copies, mutable shifted rows or missing projection pairs as identity proofs", () => {
  const mutable = { id: "mutable" }, frozen = freezeEvidence({ id: "frozen" });
  const previous = [mutable, frozen], projection = [{ $e: "e1" }, { $e: "e2" }];
  const project = vi.fn((child: EvidenceJson) => child);
  const copy = { ...frozen };
  expect(projectEvidenceArray([copy, mutable], previous, projection, project)).toEqual([copy, mutable]);
  expect(project).toHaveBeenCalledTimes(2);
  expect(projectEvidenceArray([frozen], previous, undefined, project)[0]).toBe(frozen);
});
