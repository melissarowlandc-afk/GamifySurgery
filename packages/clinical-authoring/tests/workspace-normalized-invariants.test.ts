import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  clinicalAuthoringWorkspaceSchema,
  summarizeClinicalAuthoringWorkspace,
  sourceRightsReviewSchema,
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

function addTopic(
  fixture: any,
  id = "topic.synthetic.queue-triage.alternate",
): void {
  fixture.topics.push({
    id,
    preferredName: "Alternate synthetic queue triage",
    topicType: "synthetic_training_topic",
    aliases: [],
    currentWorkingRevisionId: null,
  });
}

function addCoverageNodeCitation(
  fixture: any,
  nodeId: string,
  citationId: string,
): void {
  fixture.citations.push({
    ...fixture.citations[0],
    id: citationId,
    targetId: nodeId,
    supportedClaim: `Synthetic coverage claim for ${nodeId}.`,
  });
}

describe("normalized clinical-authoring workspace invariants", () => {
  it("allows multiple Clinical Topics to map to one framework node", () => {
    const fixture = syntheticWorkspace();
    fixture.updatedAt = "2026-07-25T23:56:00Z";
    const secondTopicId = "topic.synthetic.queue-triage.alternate";
    addTopic(fixture, secondTopicId);
    fixture.topicCoverageMappings.push({
      id: "coverage-map.synthetic.queue-triage.alternate",
      coverageNodeId: "coverage-node.synthetic.queue-triage",
      topicId: secondTopicId,
      coverageStatus: "missing",
      currentGameEligibility: "eligible",
      deferredScopeId: null,
      authorId: "author.system.synthetic",
      updatedAt: "2026-07-25T23:56:00Z",
      workflowState: "draft",
      note: "A second project-owned topic maps to the same source category.",
    });

    expect(validationMessages(fixture)).toEqual([]);
  });

  it("rejects a duplicate node-to-topic mapping even when its record ID differs", () => {
    const fixture = syntheticWorkspace();
    fixture.topicCoverageMappings.push({
      ...fixture.topicCoverageMappings[0],
      id: "coverage-map.synthetic.queue-triage.duplicate",
    });

    expect(validationMessages(fixture)).toContain(
      "A Clinical Topic may map to a coverage node only once.",
    );
  });

  it("rejects an unknown structured-fact type", () => {
    const fixture = syntheticWorkspace();
    fixture.structuredFacts[0].factTypeId = "fact-type.unknown";

    expect(validationMessages(fixture)).toContain(
      "Fact references unknown fact type: fact-type.unknown",
    );
  });

  it("rejects an unknown source-snapshot format", () => {
    const fixture = syntheticWorkspace();
    fixture.sourceSnapshots[0].formatId = "format.unknown";

    expect(validationMessages(fixture)).toContain(
      "Source Snapshot references unknown format: format.unknown",
    );
  });

  it("rejects whitespace-only text in direct JSON workspaces", () => {
    for (const mutate of [
      (fixture: any) => {
        fixture.sources[0].title = "   ";
      },
      (fixture: any) => {
        fixture.topicRevisions[0].sections[0].narrative = "\n\t";
      },
    ]) {
      const fixture = syntheticWorkspace();
      mutate(fixture);
      expect(validationMessages(fixture)).toContain(
        "Text values cannot contain only whitespace.",
      );
    }
  });

  it("requires workspace updatedAt to cover contained events", () => {
    const fixture = syntheticWorkspace();
    fixture.topicCoverageMappings[0].updatedAt =
      "2026-07-25T23:56:00Z";

    expect(validationMessages(fixture)).toContain(
      "Workspace updatedAt must be at least as recent as every contained event.",
    );
  });

  it("rejects an unknown concept-to-topic relationship type", () => {
    const fixture = syntheticWorkspace();
    const relatedTopicId = "topic.synthetic.queue-triage.related";
    addTopic(fixture, relatedTopicId);
    fixture.concepts[0].relatedTopics.push({
      topicId: relatedTopicId,
      relationshipTypeId: "topic-link.unknown",
    });

    expect(validationMessages(fixture)).toContain(
      "Concept references unknown topic-link type: topic-link.unknown",
    );
  });

  it("rejects multiple active revision leaves for one stable entity", () => {
    const fixture = syntheticWorkspace();
    const baseConcept = fixture.concepts[0];
    const baseCitation = fixture.citations.find(
      (citation: any) => citation.id === "citation.synthetic.concept.v1",
    );

    for (const suffix of ["v2a", "v2b"]) {
      const revisionId =
        `concept-rev.synthetic.queue-triage.next-action.${suffix}`;
      const citationId = `citation.synthetic.concept.${suffix}`;
      fixture.citations.push({
        ...baseCitation,
        id: citationId,
        targetId: revisionId,
        supportedClaim: `Synthetic concept branch ${suffix}.`,
      });
      fixture.concepts.push({
        ...baseConcept,
        revision: {
          ...baseConcept.revision,
          revisionId,
          parentRevisionId:
            "concept-rev.synthetic.queue-triage.next-action.v1",
          createdAt:
            suffix === "v2a"
              ? "2026-07-25T23:56:00Z"
              : "2026-07-25T23:57:00Z",
          changeSummary: `Create synthetic branch ${suffix}.`,
        },
        citationIds: [citationId],
      });
    }

    expect(validationMessages(fixture)).toContain(
      "Stable entity concept.synthetic.queue-triage.next-action must have exactly one active revision leaf.",
    );
  });

  it("rejects multiple active topic-revision leaves", () => {
    const fixture = syntheticWorkspace();
    const baseRevision = fixture.topicRevisions[0];

    for (const suffix of ["v2a", "v2b"]) {
      fixture.topicRevisions.push({
        topicId: baseRevision.topicId,
        revision: {
          ...baseRevision.revision,
          revisionId: `topic-rev.synthetic.queue-triage.${suffix}`,
          parentRevisionId: "topic-rev.synthetic.queue-triage.v1",
          createdAt:
            suffix === "v2a"
              ? "2026-07-25T23:56:00Z"
              : "2026-07-25T23:57:00Z",
          changeSummary: `Create synthetic topic branch ${suffix}.`,
        },
        sections: [],
      });
    }

    expect(validationMessages(fixture)).toContain(
      "Stable entity topic.synthetic.queue-triage must have exactly one active revision leaf.",
    );
  });

  it("requires a topic's working pointer to identify its active leaf", () => {
    const fixture = syntheticWorkspace();
    const baseRevision = fixture.topicRevisions[0];
    fixture.topicRevisions.push({
      topicId: baseRevision.topicId,
      revision: {
        ...baseRevision.revision,
        revisionId: "topic-rev.synthetic.queue-triage.v2",
        parentRevisionId: "topic-rev.synthetic.queue-triage.v1",
        createdAt: "2026-07-25T23:56:00Z",
        changeSummary: "Create a successor topic revision.",
      },
      sections: [],
    });

    expect(validationMessages(fixture)).toContain(
      "The current working revision must be the unique active revision leaf.",
    );
  });

  it("makes an unresolved rights review default-deny for every permission", () => {
    const baseRights = syntheticWorkspace().sources[0].rightsReview;
    const permissionKeys = [
      "privateStoragePermitted",
      "localProcessingPermitted",
      "externalAiTransferPermitted",
      "publicSourceTextReusePermitted",
      "projectParaphrasePublicationPermitted",
    ];
    const defaultDenyRights = {
      ...baseRights,
      status: "review_required",
      privateStoragePermitted: false,
      localProcessingPermitted: false,
      externalAiTransferPermitted: false,
      publicSourceTextReusePermitted: false,
      projectParaphrasePublicationPermitted: false,
    };

    expect(sourceRightsReviewSchema.safeParse(defaultDenyRights).success).toBe(
      true,
    );

    for (const permissionKey of permissionKeys) {
      const result = sourceRightsReviewSchema.safeParse({
        ...defaultDenyRights,
        [permissionKey]: true,
      });
      expect(result.success, permissionKey).toBe(false);
      if (!result.success) {
        expect(result.error.issues.map((issue) => issue.message)).toContain(
          "An unresolved rights review is default-deny for every source use.",
        );
      }
    }
  });

  it("prohibits AI suggestions when source rights deny external AI transfer", () => {
    const fixture = syntheticWorkspace();
    fixture.sources[0].rightsReview.externalAiTransferPermitted = false;
    fixture.practiceInbox[0].aiSuggestions.push({
      envelope: {
        suggestionId: "suggestion.synthetic.rights-check.v1",
        workflowState: "draft",
        provenance: {
          kind: "ai_assisted",
          reference: "offline-rights-check",
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
        educationalDifficultyId: "difficulty.synthetic",
        earliestFacilityStageId: "facility-stage.synthetic",
        requiredClinicalSettingIds: ["setting.synthetic"],
        currentGameEligibility: "eligible",
        deferredScope: null,
      },
      rationale: "Synthetic rights-enforcement test.",
    });

    expect(validationMessages(fixture)).toContain(
      "AI suggestions are prohibited because this Source is not approved for external AI transfer.",
    );
  });

  it("prohibits AI-assisted extraction when source rights deny external AI transfer", () => {
    const fixture = syntheticWorkspace();
    fixture.sources[0].rightsReview.externalAiTransferPermitted = false;
    fixture.extractionBatches[0].processingMethod = "ai_assisted";
    fixture.extractionBatches[0].outputReferences = [];

    expect(validationMessages(fixture)).toContain(
      "AI-assisted extraction is prohibited because this Source is not approved for external AI transfer.",
    );
  });

  it("requires local-processing permission for retrieved source artifacts", () => {
    const fixture = syntheticWorkspace();
    fixture.sources[0].rightsReview.localProcessingPermitted = false;
    fixture.sourceSnapshots[0].accessScope = "public_web";
    fixture.sourceSnapshots[0].retrievedUrl =
      "https://example.test/synthetic-source";
    fixture.sourceSnapshots[0].sha256 = "a".repeat(64);

    expect(validationMessages(fixture)).toContain(
      "A retrieved Source Snapshot requires permission for local processing.",
    );
  });

  it("requires public-web snapshots to use HTTP(S) retrieval URLs", () => {
    const fixture = syntheticWorkspace();
    fixture.sourceSnapshots[0].accessScope = "public_web";
    fixture.sourceSnapshots[0].retrievedUrl =
      "file:///C:/Users/owner/private-source.pdf";
    fixture.sourceSnapshots[0].sha256 = "a".repeat(64);

    expect(validationMessages(fixture)).toContain(
      "A public-web snapshot must use an HTTP(S) retrieval URL.",
    );
  });

  it("rejects non-HTTP snapshot URLs from public fixtures at every access scope", () => {
    const fixture = syntheticWorkspace();
    fixture.sourceSnapshots[0].accessScope = "metadata_only";
    fixture.sourceSnapshots[0].retrievedUrl =
      "javascript:alert('not-public-metadata')";

    expect(() =>
      validatePublicClinicalAuthoringWorkspace(fixture),
    ).toThrow(/must use HTTP\(S\)/i);
  });

  it("requires private-storage permission for retained private artifacts", () => {
    const fixture = syntheticWorkspace();
    fixture.sources[0].rightsReview.privateStoragePermitted = false;
    fixture.sourceSnapshots[0].accessScope = "owner_local";
    fixture.sourceSnapshots[0].sha256 = "a".repeat(64);

    expect(validationMessages(fixture)).toContain(
      "A private Source Snapshot requires permission for private storage.",
    );
  });

  it("blocks unpermitted paraphrases and excerpts from public fixtures", () => {
    for (const usageKind of ["project_paraphrase", "source_excerpt"]) {
      const fixture = syntheticWorkspace();
      fixture.citations[1].usageKind = usageKind;
      fixture.sources[0].rightsReview.projectParaphrasePublicationPermitted =
        false;
      fixture.sources[0].rightsReview.publicSourceTextReusePermitted = false;

      expect(
        () => validatePublicClinicalAuthoringWorkspace(fixture),
        usageKind,
      ).toThrow(/public fixture cannot (publish|reuse)/i);
    }
  });

  it("requires reviewer identity and time for a verified citation", () => {
    const fixture = syntheticWorkspace();
    fixture.citations[0].verificationReviewerId = null;

    expect(validationMessages(fixture)).toContain(
      "Verified or conflict-identified Citations require a reviewer and verification time; unverified Citations must not carry them.",
    );
  });

  it("does not allow a Citation to predate its Source Snapshot", () => {
    const fixture = syntheticWorkspace();
    fixture.citations[0].recordedAt = "2026-07-25T23:54:00Z";

    expect(validationMessages(fixture)).toContain(
      "A Citation cannot be recorded before its exact Source Snapshot was retrieved.",
    );
  });

  it("requires a substantive verified Citation for clinical approval", () => {
    const fixture = syntheticWorkspace();
    const concept = fixture.concepts[0];
    concept.revision.workflowState = "clinically_approved";
    concept.revision.clinicalApproval = {
      reviewerId: "reviewer.clinical",
      reviewedAt: "2026-07-25T23:56:00Z",
      checklistVersion: "checklist.clinical.v1",
    };
    const citation = fixture.citations.find(
      (candidate: any) => candidate.id === concept.citationIds[0],
    );
    citation.usageKind = "bibliographic_metadata";

    expect(validationMessages(fixture)).toContain(
      "Clinically approved material requires at least one human-verified content-bearing Citation; bibliographic metadata alone is not clinical support.",
    );
  });

  it("does not let a later rights review retroactively authorize content use", () => {
    const cases = [
      {
        label: "citation",
        mutate(fixture: any): void {
          fixture.citations[1].recordedAt = "2026-07-25T23:54:00Z";
          fixture.citations[1].verificationRecordedAt =
            "2026-07-25T23:55:00Z";
        },
        message:
          "Content-bearing Citation creation cannot predate the Source rights review that authorizes it.",
      },
      {
        label: "practice capture",
        mutate(fixture: any): void {
          fixture.practiceInbox[0].revision.createdAt =
            "2026-07-25T23:54:00Z";
        },
        message:
          "Practice-question capture cannot predate the Source rights review that authorizes it.",
      },
      {
        label: "extraction",
        mutate(fixture: any): void {
          fixture.extractionBatches[0].startedAt =
            "2026-07-25T23:54:00Z";
        },
        message:
          "Source extraction cannot predate the Source rights review that authorizes it.",
      },
    ];

    for (const testCase of cases) {
      const fixture = syntheticWorkspace();
      testCase.mutate(fixture);
      expect(validationMessages(fixture), testCase.label).toContain(
        testCase.message,
      );
    }
  });

  it("rejects public Source URLs containing credentials, queries, or fragments", () => {
    for (const identifier of [
      "HTTPS://user:secret@example.test/source",
      "https://example.test/source?token=secret",
      "https://example.test/source#private-marker",
    ]) {
      const fixture = syntheticWorkspace();
      fixture.sources[0].canonicalUrlOrIdentifier = identifier;

      expect(
        () => validatePublicClinicalAuthoringWorkspace(fixture),
        identifier,
      ).toThrow(/credentials, query tokens, or fragments/i);
    }
  });

  it("rejects unsafe URL schemes in public Source identifiers", () => {
    for (const identifier of [
      "data:text/plain,private",
      "javascript:alert('unsafe')",
      "file:///C:/Users/owner/private-source.pdf",
      "ftp://user:secret@example.test/private-source.pdf",
      " https://user:secret@example.test/private-source.pdf",
    ]) {
      const fixture = syntheticWorkspace();
      fixture.sources[0].canonicalUrlOrIdentifier = identifier;

      expect(
        () => validatePublicClinicalAuthoringWorkspace(fixture),
        identifier,
      ).toThrow(
        /must use HTTP\(S\), an approved|leading or trailing whitespace/i,
      );
    }
  });

  it("requires approved citations to predate the clinical approval", () => {
    for (const timestampField of [
      "recordedAt",
      "verificationRecordedAt",
    ]) {
      const fixture = syntheticWorkspace();
      fixture.concepts[0].revision.workflowState = "clinically_approved";
      fixture.concepts[0].revision.clinicalApproval = {
        reviewerId: "reviewer.clinical",
        reviewedAt: "2026-07-25T23:56:00Z",
        checklistVersion: "checklist.clinical.v1",
      };
      fixture.citations.find(
        (citation: any) =>
          citation.id === fixture.concepts[0].citationIds[0],
      )[timestampField] = "2026-07-25T23:57:00Z";

      expect(validationMessages(fixture), timestampField).toContain(
        "A clinically approved revision may use only Citations created and human-verified no later than its approval time.",
      );
    }
  });

  it("requires reverse provenance closure to an exact extraction output", () => {
    const fixture = syntheticWorkspace();
    fixture.concepts[0].revision.provenance = {
      kind: "structured_import",
      reference: "batch.synthetic.missing",
    };

    expect(validationMessages(fixture)).toContain(
      "A non-manual revision must reference its exact extraction batch.",
    );
  });

  it("keeps AI-assisted revisions in Draft even when a batch lists them", () => {
    const fixture = syntheticWorkspace();
    const conceptRevisionId =
      "concept-rev.synthetic.queue-triage.next-action.v1";
    fixture.concepts[0].revision.provenance = {
      kind: "ai_assisted",
      reference: "batch.synthetic.ai.v1",
    };
    fixture.concepts[0].revision.workflowState = "needs_clinical_review";
    fixture.extractionBatches.push({
      ...fixture.extractionBatches[0],
      id: "batch.synthetic.ai.v1",
      processingMethod: "ai_assisted",
      outputReferences: [
        {
          kind: "tested_concept",
          id: conceptRevisionId,
        },
      ],
    });

    expect(validationMessages(fixture)).toContain(
      "An AI-assisted revision must remain Draft; human acceptance creates a new reviewed revision.",
    );
  });

  it("binds a framework node to its framework's exact source snapshot", () => {
    const fixture = syntheticWorkspace();
    const replacementSnapshotId = "snapshot.synthetic.learning-loop.v2";
    fixture.sourceSnapshots.push({
      ...fixture.sourceSnapshots[0],
      id: replacementSnapshotId,
    });
    fixture.citations[0].sourceSnapshotId = replacementSnapshotId;

    expect(validationMessages(fixture)).toContain(
      "A Coverage Framework Node citation must use the framework's exact Source Snapshot.",
    );
  });

  it("requires coverage frameworks to use eligible source provenance", () => {
    const fixture = syntheticWorkspace();
    fixture.sources[0].sourceType = "textbook";

    expect(validationMessages(fixture)).toContain(
      "A Coverage Framework must use an official-outline Source (or an explicitly synthetic fixture).",
    );
  });

  it("defers batch provenance for immutable framework nodes", () => {
    const fixture = syntheticWorkspace();
    fixture.extractionBatches[0].outputReferences.push({
      kind: "coverage_framework_node",
      id: "coverage-node.synthetic.queue-triage",
    });
    fixture.extractionBatches[0].processingMethod = "ai_assisted";

    expect(validationMessages(fixture)).toContain(
      "The beta cannot list Coverage Framework Nodes or Topic Coverage Mappings as extraction outputs because they do not yet carry exact import provenance.",
    );
  });

  it("binds extraction outputs to the batch time window and exact Source Snapshot", () => {
    const lateOutput = syntheticWorkspace();
    lateOutput.updatedAt = "2026-07-26T00:01:00Z";
    lateOutput.concepts[0].revision.createdAt =
      "2026-07-26T00:01:00Z";

    expect(validationMessages(lateOutput)).toContain(
      "An extraction output must be created within its batch start and completion/update window.",
    );

    const wrongSnapshot = syntheticWorkspace();
    wrongSnapshot.sourceSnapshots.push({
      ...wrongSnapshot.sourceSnapshots[0],
      id: "snapshot.synthetic.learning-loop.v2",
    });
    wrongSnapshot.extractionBatches[0].sourceSnapshotId =
      "snapshot.synthetic.learning-loop.v2";

    expect(validationMessages(wrongSnapshot)).toContain(
      "An extraction output must cite the exact Source Snapshot processed by its batch.",
    );
  });

  it("does not treat an unrelated historical conflict as a batch conflict snapshot", () => {
    const fixture = syntheticWorkspace();
    const groupId = "conflict.synthetic.unrelated";
    const baseFact = fixture.structuredFacts[0];
    const baseCitation = fixture.citations.find(
      (citation: any) => citation.id === baseFact.citationIds[0],
    );
    baseFact.conflict = {
      state: "unresolved",
      conflictGroupId: groupId,
    };
    fixture.citations.push({
      ...baseCitation,
      id: "citation.synthetic.fact-unrelated.v1",
      targetId: "fact-rev.synthetic.queue-triage.unrelated.v1",
      supportedClaim: "Second synthetic conflict claim.",
    });
    fixture.structuredFacts.push({
      ...baseFact,
      id: "fact.synthetic.queue-triage.unrelated",
      revision: {
        ...baseFact.revision,
        revisionId: "fact-rev.synthetic.queue-triage.unrelated.v1",
        changeSummary: "Add an unrelated conflict record.",
      },
      citationIds: ["citation.synthetic.fact-unrelated.v1"],
    });
    fixture.extractionBatches[0].outputReferences =
      fixture.extractionBatches[0].outputReferences.filter(
        (reference: any) => reference.kind !== "structured_fact",
      );
    fixture.extractionBatches[0].unresolvedConflictGroupIds = [groupId];

    expect(validationMessages(fixture)).toContain(
      "A batch conflict snapshot must be represented by at least one Structured Fact revision emitted by that batch.",
    );
  });

  it("defers extraction provenance for Topic Coverage Mappings", () => {
    const fixture = syntheticWorkspace();
    fixture.extractionBatches[0].outputReferences.push({
      kind: "topic_coverage_mapping",
      id: "coverage-map.synthetic.queue-triage",
    });

    expect(validationMessages(fixture)).toContain(
      "The beta cannot list Coverage Framework Nodes or Topic Coverage Mappings as extraction outputs because they do not yet carry exact import provenance.",
    );
  });

  it("binds a practice capture to a citation with the same snapshot and locator", () => {
    const fixture = syntheticWorkspace();
    fixture.practiceInbox[0].sourceLocator.label =
      "A locator not used by its citation";

    expect(validationMessages(fixture)).toContain(
      "A Practice Question Inbox item must cite its exact captured Source Snapshot and locator.",
    );
  });

  it("orders snapshot, capture, AI suggestion, and extraction events causally", () => {
    const earlyCapture = syntheticWorkspace();
    earlyCapture.practiceInbox[0].revision.createdAt =
      "2026-07-25T23:54:00Z";
    expect(validationMessages(earlyCapture)).toContain(
      "A Practice Question Inbox capture cannot predate its exact Source Snapshot.",
    );

    const earlySuggestion = syntheticWorkspace();
    earlySuggestion.practiceInbox[0].aiSuggestions.push({
      envelope: {
        suggestionId: "suggestion.synthetic.early.v1",
        workflowState: "draft",
        provenance: {
          kind: "ai_assisted",
          reference: "batch.synthetic.ai-early.v1",
        },
        createdAt: "2026-07-25T23:54:00Z",
      },
      recommendedTopicId: null,
      matchingConceptId: null,
      proposedConceptId: "concept.synthetic.proposed",
      proposedLearningObjective: "Choose a synthetic action.",
      duplicateAssessment: "likely_new",
      proposedConceptType: "synthetic_training",
      recommendedClassification: {
        educationalDifficultyId: "difficulty.synthetic",
        earliestFacilityStageId: "facility-stage.synthetic",
        requiredClinicalSettingIds: ["setting.synthetic"],
        currentGameEligibility: "eligible",
        deferredScope: null,
      },
      rationale: "Synthetic causal-order test.",
    });
    expect(validationMessages(earlySuggestion)).toContain(
      "An AI suggestion cannot predate the Practice Question Inbox revision it analyzes.",
    );

    const earlyBatch = syntheticWorkspace();
    earlyBatch.extractionBatches[0].startedAt =
      "2026-07-25T23:54:00Z";
    expect(validationMessages(earlyBatch)).toContain(
      "A Source extraction batch cannot start before its exact Source Snapshot was retrieved.",
    );

    const earlyQueuedRecord = syntheticWorkspace();
    earlyQueuedRecord.updatedAt = "2026-07-25T23:56:00Z";
    earlyQueuedRecord.sourceSnapshots.push({
      ...earlyQueuedRecord.sourceSnapshots[0],
      id: "snapshot.synthetic.future.v1",
      retrievedAt: "2026-07-25T23:56:00Z",
    });
    Object.assign(earlyQueuedRecord.extractionBatches[0], {
      sourceSnapshotId: "snapshot.synthetic.future.v1",
      status: "queued",
      completedUnits: 0,
      lastCompletedLocator: null,
      outputReferences: [],
      unresolvedConflictGroupIds: [],
      errors: [],
      startedAt: null,
      updatedAt: "2026-07-25T23:55:00Z",
      completedAt: null,
      humanReviewState: "not_started",
    });
    expect(validationMessages(earlyQueuedRecord)).toContain(
      "An extraction-batch record cannot predate its exact Source Snapshot.",
    );
  });

  it("reports conflicts from distinct current fact leaves, not superseded history", () => {
    const fixture = syntheticWorkspace();
    fixture.updatedAt = "2026-07-25T23:56:00Z";
    const baseFact = fixture.structuredFacts[0];
    const baseCitation = fixture.citations.find(
      (citation: any) => citation.id === "citation.synthetic.fact.v1",
    );
    const conflictGroupId = "conflict.synthetic.superseded";
    baseFact.conflict = {
      state: "unresolved",
      conflictGroupId,
    };

    const secondFactRevisionId = "fact-rev.synthetic.queue-triage.clock-b.v1";
    const secondCitationId = "citation.synthetic.fact-b.v1";
    fixture.citations.push({
      ...baseCitation,
      id: secondCitationId,
      targetId: secondFactRevisionId,
      supportedClaim: "A second synthetic competing claim.",
    });
    fixture.structuredFacts.push({
      ...baseFact,
      id: "fact.synthetic.queue-triage.clock-b",
      revision: {
        ...baseFact.revision,
        revisionId: secondFactRevisionId,
        changeSummary: "Add a second synthetic competing fact.",
      },
      citationIds: [secondCitationId],
    });
    fixture.extractionBatches[0].unresolvedConflictGroupIds = [
      conflictGroupId,
    ];

    for (const [factIndex, suffix] of [
      [0, "clock"],
      [1, "clock-b"],
    ] as const) {
      const oldFact = fixture.structuredFacts[factIndex];
      const revisionId = `fact-rev.synthetic.queue-triage.${suffix}.v2`;
      const citationId = `citation.synthetic.${suffix}.v2`;
      fixture.citations.push({
        ...baseCitation,
        id: citationId,
        targetId: revisionId,
        supportedClaim: `Synthetic successor for ${suffix}.`,
      });
      fixture.structuredFacts.push({
        ...oldFact,
        revision: {
          ...oldFact.revision,
          revisionId,
          parentRevisionId: oldFact.revision.revisionId,
          createdAt: "2026-07-25T23:56:00Z",
          changeSummary: `Resolve the synthetic ${suffix} conflict.`,
        },
        conflict: {
          state: "none",
          conflictGroupId: null,
        },
        citationIds: [citationId],
      });
    }

    const result = clinicalAuthoringWorkspaceSchema.safeParse(fixture);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(
        summarizeClinicalAuthoringWorkspace(result.data)
          .unresolvedConflictGroupIds,
      ).toEqual([]);
    }
  });

  it("counts stable Practice Inbox items rather than their revisions", () => {
    const fixture = syntheticWorkspace();
    fixture.updatedAt = "2026-07-25T23:56:00Z";
    const first = fixture.practiceInbox[0];
    const firstCitation = fixture.citations.find(
      (citation: any) => citation.id === first.citationIds[0],
    );
    const revisionId = "inbox-rev.synthetic.queue-triage.v2";
    const citationId = "citation.synthetic.inbox.v2";
    fixture.citations.push({
      ...firstCitation,
      id: citationId,
      targetId: revisionId,
      supportedClaim: "Synthetic successor capture.",
      verificationRecordedAt: "2026-07-25T23:56:00Z",
      recordedAt: "2026-07-25T23:56:00Z",
    });
    fixture.practiceInbox.push({
      ...first,
      revision: {
        ...first.revision,
        revisionId,
        parentRevisionId: first.revision.revisionId,
        createdAt: "2026-07-25T23:56:00Z",
        changeSummary: "Create a successor synthetic capture.",
      },
      citationIds: [citationId],
    });

    const result = clinicalAuthoringWorkspaceSchema.safeParse(fixture);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(
        summarizeClinicalAuthoringWorkspace(result.data).practiceInboxCount,
      ).toBe(1);
    }
  });

  it("rejects a child coverage path that does not extend its parent path", () => {
    const fixture = syntheticWorkspace();
    const nodeId = "coverage-node.synthetic.bad-path";
    const citationId = "citation.synthetic.coverage.bad-path";
    addCoverageNodeCitation(fixture, nodeId, citationId);
    fixture.coverageFrameworkNodes.push({
      id: nodeId,
      frameworkId: "framework.synthetic.learning-loop.v1",
      externalCategoryId: "synthetic.bad-path",
      parentNodeId: "coverage-node.synthetic.queue-triage",
      ordinal: 0,
      categoryPath: ["Different root", "Bad child"],
      sourceDefinedClassificationId: null,
      citationIds: [citationId],
      note: "Synthetic invalid child path.",
    });

    expect(validationMessages(fixture)).toContain(
      "A child coverage path must extend its parent path by exactly one label.",
    );
  });

  it("rejects a cycle in the coverage-node parent hierarchy", () => {
    const fixture = syntheticWorkspace();
    const firstNodeId = "coverage-node.synthetic.cycle-a";
    const secondNodeId = "coverage-node.synthetic.cycle-b";
    const firstCitationId = "citation.synthetic.coverage.cycle-a";
    const secondCitationId = "citation.synthetic.coverage.cycle-b";
    addCoverageNodeCitation(fixture, firstNodeId, firstCitationId);
    addCoverageNodeCitation(fixture, secondNodeId, secondCitationId);
    fixture.coverageFrameworkNodes.push(
      {
        id: firstNodeId,
        frameworkId: "framework.synthetic.learning-loop.v1",
        externalCategoryId: "synthetic.cycle-a",
        parentNodeId: secondNodeId,
        ordinal: 0,
        categoryPath: ["Synthetic cycle", "Cycle A"],
        sourceDefinedClassificationId: null,
        citationIds: [firstCitationId],
        note: "First node in a deliberately invalid synthetic cycle.",
      },
      {
        id: secondNodeId,
        frameworkId: "framework.synthetic.learning-loop.v1",
        externalCategoryId: "synthetic.cycle-b",
        parentNodeId: firstNodeId,
        ordinal: 0,
        categoryPath: ["Synthetic cycle", "Cycle B"],
        sourceDefinedClassificationId: null,
        citationIds: [secondCitationId],
        note: "Second node in a deliberately invalid synthetic cycle.",
      },
    );

    expect(validationMessages(fixture)).toContain(
      "Coverage-node hierarchy cannot contain a cycle.",
    );
  });
});
