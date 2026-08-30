import { describe, expect, it } from "vitest";

import {
  exteriorCandidateEnvelope,
  getExteriorLandscapeCandidates,
  getVisibleExteriorLandscape,
} from "./exteriorLandscape";

describe("exterior landscaping", () => {
  it("generates a stable, irregular full-site field with stable keys", () => {
    const first = getExteriorLandscapeCandidates(16, 10);
    const second = getExteriorLandscapeCandidates(16, 10);
    expect(first).toEqual(second);
    expect(first.length).toBeGreaterThanOrEqual(44);
    expect(new Set(first.map((candidate) => candidate.key)).size).toBe(first.length);
    expect(new Set(first.map((candidate) => candidate.x)).size).toBeGreaterThan(12);
  });

  it("removes a whole plant envelope when construction intersects it", () => {
    const candidate = getExteriorLandscapeCandidates(16, 10)[0]!;
    const envelope = exteriorCandidateEnvelope(candidate);
    expect(getVisibleExteriorLandscape([candidate], [envelope])).toEqual([]);
  });

  it("keeps unaffected candidates at their original stable positions", () => {
    const candidates = getExteriorLandscapeCandidates(16, 10);
    const first = candidates[0]!;
    const second = candidates.find((candidate) => candidate.key !== first.key && candidate.x > first.x + 2)!;
    const hidden = getVisibleExteriorLandscape(candidates, [exteriorCandidateEnvelope(first)]);
    expect(hidden.find((candidate) => candidate.key === first.key)).toBeUndefined();
    expect(hidden.find((candidate) => candidate.key === second.key)).toEqual(second);
  });
});
