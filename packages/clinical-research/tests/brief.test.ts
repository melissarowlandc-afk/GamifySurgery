import { describe, expect, it } from "vitest";

import {
  buildKnownVsNeededBrief,
  validateResearchWorkspace,
} from "../src/index.js";
import type { ResearchWorkspace } from "../src/index.js";
import { makeResearchWorkspace } from "./fixture.js";

const clone = <Value>(value: Value): Value =>
  JSON.parse(JSON.stringify(value)) as Value;

describe("known-versus-needed brief", () => {
  it("promotes only reviewed formal contributions and accepted expert opinions", () => {
    const workspace = validateResearchWorkspace(makeResearchWorkspace());
    const brief = buildKnownVsNeededBrief(workspace, "gap.one");

    expect(brief.known.map((item) => item.id)).toEqual([
      "opinion.rev.one",
      "contribution.formal.one",
    ]);
    expect(brief.known.map((item) => item.kind)).toEqual([
      "expert_opinion",
      "formal_evidence",
    ]);
    expect(JSON.stringify(brief.known)).not.toContain(
      "A proposed qualification remains under review.",
    );
    expect(JSON.stringify(brief.known)).not.toContain(
      "Example imaging review",
    );
    expect(brief.clinicalApprovalConferred).toBe(false);
  });

  it("reports search coverage without treating metadata Candidates as knowledge", () => {
    const brief = buildKnownVsNeededBrief(
      validateResearchWorkspace(makeResearchWorkspace()),
      "gap.one",
    );

    expect(brief.searchStatus).toMatchObject({
      runCount: 1,
      completedRunCount: 1,
      partialRunCount: 0,
      failedRunCount: 0,
      providerResultCountTotal: 10,
      providerRecordsInspected: 2,
      candidateCountCaptured: 2,
      candidateCountPresent: 2,
      includedCount: 1,
      awaitingFullTextCount: 1,
      unscreenedCount: 0,
      latestCompletedAt: "2026-01-03T10:05:00.000Z",
      nextRefreshDueAt: "2026-02-02T10:05:00.000Z",
    });
    expect(brief.needed.openWork).toContain(
      "1 candidate(s) await permitted full-text review.",
    );
  });

  it("is deterministic across harmless record reordering", () => {
    const original = validateResearchWorkspace(makeResearchWorkspace());
    const reordered = clone(original);
    reordered.contributions.reverse();
    reordered.candidates.reverse();
    reordered.screeningDecisions.reverse();
    reordered.sourceRightsDecisions.reverse();

    expect(buildKnownVsNeededBrief(reordered, "gap.one")).toEqual(
      buildKnownVsNeededBrief(original, "gap.one"),
    );
  });

  it("uses only the effective latest screening decision in status counts", () => {
    const workspace = clone(makeResearchWorkspace());
    workspace.updatedAt = "2026-01-11T00:00:00.000Z";
    workspace.screeningDecisions.push({
      id: "screen.two.exclude",
      candidateId: "candidate.two",
      gapId: "gap.one",
      supersedesDecisionId: "screen.two",
      disposition: "exclude",
      resolvedSourceId: null,
      reason: "Full review found that the source does not meet criteria.",
      reviewedAt: "2026-01-10T10:00:00.000Z",
      reviewedBy: "reviewer.evidence",
      recordedAt: "2026-01-10T10:01:00.000Z",
    });

    const brief = buildKnownVsNeededBrief(
      validateResearchWorkspace(workspace),
      "gap.one",
    );
    expect(brief.searchStatus.awaitingFullTextCount).toBe(0);
    expect(brief.searchStatus.excludedCount).toBe(1);
  });

  it("withholds updated formal evidence and makes currentness review explicit", () => {
    const workspace = makeResearchWorkspace();
    workspace.sourceRelations.push({
      id: "relation.update.currentness",
      fromSourceId: "source.two",
      toSourceId: "source.one",
      relationType: "updates",
      relationStatus: "active",
      supersedesRelationId: null,
      note: "A newer source version requires review.",
      recordedAt: "2026-01-09T00:00:00.000Z",
      recordedBy: "reviewer.evidence",
    });

    const brief = buildKnownVsNeededBrief(
      validateResearchWorkspace(workspace),
      "gap.one",
    );
    expect(brief.known.map((item) => item.id)).toEqual([
      "opinion.rev.one",
    ]);
    expect(brief.needed.openWork.join("\n")).toContain(
      "newer Source update requires currentness review",
    );
  });

  it("withholds a Citation conflict and identifies the affected Citation", () => {
    const workspace = makeResearchWorkspace();
    workspace.citationVerificationSignals.push({
      id: "citation-verification.citation.one.conflict.v2",
      citationId: "citation.one",
      supersedesSignalId:
        "citation-verification.citation.one.human.v1",
      verificationState: "conflict_identified",
      verifiedBy: "reviewer.conflict.one",
      verifiedAt: "2026-01-09T00:00:00.000Z",
      recordedAt: "2026-01-09T00:00:00.000Z",
    });

    const brief = buildKnownVsNeededBrief(
      validateResearchWorkspace(workspace),
      "gap.one",
    );
    expect(brief.known.map((item) => item.id)).not.toContain(
      "contribution.formal.one",
    );
    expect(brief.needed.openWork.join("\n")).toContain(
      "Citation citation.one has a current conflict-identification signal",
    );
  });

  it("makes stale searches, missing preferred evidence, review criteria, and open questions explicit", () => {
    const workspace = makeResearchWorkspace();
    workspace.updatedAt = "2026-03-01T00:00:00.000Z";

    const brief = buildKnownVsNeededBrief(
      validateResearchWorkspace(workspace),
      "gap.one",
    );
    const needed = brief.needed.openWork.join("\n");
    expect(needed).toContain("literature search is stale");
    expect(needed).toContain(
      'Preferred Source type "systematic_review" has not been confirmed',
    );
    expect(needed).toContain(
      "Acceptance criterion awaits explicit reviewer confirmation",
    );
    expect(needed).toContain(
      "Reviewer question remains unresolved: Broader inpatient applicability remains open.",
    );
    expect(needed).toContain(
      "proposed Evidence Contribution(s) await human review",
    );
  });

  it("refuses to invent a brief for an unknown gap", () => {
    const workspace: ResearchWorkspace = makeResearchWorkspace();

    expect(() =>
      buildKnownVsNeededBrief(workspace, "gap.unknown"),
    ).toThrow("Unknown Evidence Gap: gap.unknown");
  });
});
