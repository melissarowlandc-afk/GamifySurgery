import { describe, expect, it } from "vitest";

import type { SanitizedAuthoringContextDto } from "./api.js";
import {
  buildEvidenceGapPrefill,
  listUncoveredAuthoringTargets,
} from "./gap-suggestions.js";
import type { GapViewDto } from "./model.js";

const context: SanitizedAuthoringContextDto = {
  schemaVersion: 1,
  authoringWorkspaceId: "authoring.workspace.test",
  authoringWorkspaceUpdatedAt: "2026-07-26T10:00:00.000Z",
  sources: [],
  citations: [],
  topicRevisions: [
    {
      kind: "clinical_topic_revision",
      id: "topic-revision.abscess.v1",
      entityId: "topic.abscess",
      label: "Cutaneous abscess",
    },
  ],
  structuredFacts: [
    {
      kind: "structured_fact",
      id: "fact.abscess.management.v1",
      entityId: "fact.abscess.management",
      label: 'Abscess — management "injection"[pt]',
    },
  ],
  testedConcepts: [],
};

const coveredGap: GapViewDto = {
  id: "gap.abscess.management",
  revisionId: "gap-revision.abscess.management.v1",
  title: "Management",
  clinicalQuestion: "What evidence supports management?",
  whyNeeded: "Needed.",
  acceptanceCriteria: ["Reviewed."],
  status: "open",
  resolutionNote: null,
  targetContent: [
    {
      kind: "structured_fact",
      id: "fact.abscess.management.v1",
    },
  ],
  scoutPolicy: {
    mode: "manual_only",
    preferredSourceTypes: ["clinical_guideline"],
    providerStrategies: [],
    refreshIntervalDays: null,
  },
  revisionCount: 1,
  updatedAt: "2026-07-26T10:00:00.000Z",
};

describe("authoring-target evidence-gap suggestions", () => {
  it("returns only targets that have no linked Evidence Gap", () => {
    expect(listUncoveredAuthoringTargets(context, [coveredGap])).toEqual([
      context.topicRevisions[0],
    ]);
  });

  it("prefills a reviewable authoritative-metadata strategy without saving it", () => {
    const prefill = buildEvidenceGapPrefill(context.structuredFacts[0]!);

    expect(prefill.targetId).toBe("fact.abscess.management.v1");
    expect(prefill.preferredSourceTypes).toEqual([
      "clinical_guideline",
      "systematic_review",
      "meta_analysis",
    ]);
    expect(prefill.query).toContain("systematic[sb]");
    expect(prefill.query).toContain("guideline[pt]");
    expect(prefill.query).not.toContain('"injection"[pt]');
  });
});
