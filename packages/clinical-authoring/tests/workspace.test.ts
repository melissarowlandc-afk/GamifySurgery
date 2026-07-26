import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  clinicalAuthoringWorkspaceSchema,
  summarizeClinicalAuthoringWorkspace,
  validateClinicalAuthoringWorkspace,
  validatePublicClinicalAuthoringWorkspace,
} from "../src/index.js";

function readJson(url: URL): any {
  return JSON.parse(readFileSync(url, "utf8"));
}

function syntheticWorkspace(): any {
  return readJson(new URL("../examples/synthetic-workspace.json", import.meta.url));
}

function validationMessages(candidate: unknown): string[] {
  const result = clinicalAuthoringWorkspaceSchema.safeParse(candidate);
  return result.success
    ? []
    : result.error.issues.map((issue) => issue.message);
}

describe("clinical-authoring workspace", () => {
  it("validates and summarizes the complete synthetic fixture", () => {
    const workspace = validateClinicalAuthoringWorkspace(syntheticWorkspace());

    expect(summarizeClinicalAuthoringWorkspace(workspace)).toEqual({
      workspaceId: "workspace.synthetic.pilot.v1",
      sourceCount: 1,
      sourceSnapshotCount: 1,
      frameworkCount: 1,
      coverageEntryCount: 1,
      topicCount: 1,
      structuredFactCount: 1,
      conceptCount: 1,
      practiceInboxCount: 1,
      extractionBatchCount: 1,
      unresolvedConflictGroupIds: [],
    });
  });

  it("validates the tracked official-framework registry with public guardrails", () => {
    const fixture = readJson(
      new URL(
        "../../../clinical-data/public/official-frameworks.json",
        import.meta.url,
      ),
    );

    expect(() =>
      validatePublicClinicalAuthoringWorkspace(fixture),
    ).not.toThrow();
  });

  it("rejects a missing immutable source snapshot", () => {
    const fixture = syntheticWorkspace();
    fixture.citations[0].sourceSnapshotId = "snapshot.missing";

    expect(validationMessages(fixture)).toContain(
      "Citation references unknown Source Snapshot: snapshot.missing",
    );
  });

  it("rejects invalid revision lineage", () => {
    const fixture = syntheticWorkspace();
    fixture.concepts[0].revision.parentRevisionId = "concept-rev.missing";

    expect(validationMessages(fixture)).toContain(
      "Unknown parent revision: concept-rev.missing",
    );
  });

  it("rejects a topic pointer to the wrong working revision", () => {
    const fixture = syntheticWorkspace();
    fixture.topics[0].currentWorkingRevisionId =
      "concept-rev.synthetic.queue-triage.next-action.v1";

    expect(validationMessages(fixture)).toContain(
      "A current working revision must exist and belong to this Clinical Topic.",
    );
  });

  it("requires exact, bidirectional topic-section citation links", () => {
    const fixture = syntheticWorkspace();
    fixture.citations[1].targetId = "section.synthetic.wrong";

    const messages = validationMessages(fixture);
    expect(messages).toContain(
      "Citation references unknown topic_section: section.synthetic.wrong",
    );
    expect(messages).toContain(
      "A citation must point to the exact revision or record that lists it.",
    );
  });

  it("does not allow an unapproved fact to drive scenarios", () => {
    const fixture = syntheticWorkspace();
    fixture.structuredFacts[0].scenarioUseStatus = "scenario_approved";

    expect(validationMessages(fixture)).toContain(
      "A fact cannot drive approved scenario generation before clinical approval.",
    );
  });

  it("requires human-verified citations on approved material", () => {
    const fixture = syntheticWorkspace();
    fixture.concepts[0].revision.workflowState = "clinically_approved";
    fixture.concepts[0].revision.clinicalApproval = {
      reviewerId: "reviewer.synthetic",
      reviewedAt: "2026-07-25T23:56:00Z",
      checklistVersion: "checklist.synthetic.v1",
    };
    fixture.citations[3].verificationState = "unverified";

    expect(validationMessages(fixture)).toContain(
      "Clinically approved material may use only human-verified citations.",
    );
  });

  it("validates vocabulary references inside AI suggestions", () => {
    const fixture = syntheticWorkspace();
    fixture.practiceInbox[0].aiSuggestions.push({
      envelope: {
        suggestionId: "suggestion.synthetic.v1",
        workflowState: "draft",
        provenance: {
          kind: "ai_assisted",
          reference: "offline-test",
        },
        createdAt: "2026-07-25T23:56:00Z",
      },
      recommendedTopicId: "topic.synthetic.queue-triage",
      matchingConceptId: "concept.synthetic.queue-triage.next-action",
      proposedConceptId: null,
      proposedLearningObjective: null,
      duplicateAssessment: "likely_duplicate",
      proposedConceptType: "synthetic_training",
      recommendedClassification: {
        educationalDifficultyId: "difficulty.unknown",
        earliestFacilityStageId: "facility-stage.synthetic",
        requiredClinicalSettingIds: ["setting.synthetic"],
        currentGameEligibility: "eligible",
        deferredScope: null,
      },
      rationale: "Synthetic test suggestion.",
    });

    expect(validationMessages(fixture)).toContain(
      "Unknown educational difficulty: difficulty.unknown",
    );
  });

  it("rejects private source access in a tracked public fixture", () => {
    const fixture = syntheticWorkspace();
    fixture.sourceSnapshots[0].accessScope = "owner_local";

    expect(() =>
      validatePublicClinicalAuthoringWorkspace(fixture),
    ).toThrow(/public fixture cannot reference authenticated or owner-local/i);
  });

  it("rejects inconsistent resumable-batch state", () => {
    const fixture = syntheticWorkspace();
    fixture.extractionBatches[0].status = "queued";

    expect(validationMessages(fixture)).toContain(
      "A queued batch cannot contain progress, a checkpoint, or a start time.",
    );
  });
});
