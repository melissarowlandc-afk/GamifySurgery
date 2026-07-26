import { z } from "zod";

import { testedConceptSchema } from "./concept.js";
import {
  coverageEntrySchema,
  coverageFrameworkSchema,
} from "./coverage.js";
import { extractionBatchSchema } from "./extraction-batch.js";
import { isoTimestampSchema, stableIdSchema } from "./identifiers.js";
import { practiceQuestionInboxItemSchema } from "./practice-inbox.js";
import {
  citationSchema,
  sourceSchema,
  sourceSnapshotSchema,
} from "./source.js";
import {
  clinicalTopicRevisionSchema,
  clinicalTopicSchema,
  structuredClinicalFactSchema,
} from "./topic.js";

const namedDefinitionSchema = z
  .object({
    id: stableIdSchema,
    label: z.string().min(1).max(240),
    description: z.string().min(1).max(1_000),
  })
  .strict();

const facilityStageDefinitionSchema = namedDefinitionSchema.extend({
  ordinal: z.number().int().min(0),
});

function addDuplicateIssues<T>(
  values: readonly T[],
  getId: (value: T) => string,
  path: string,
  context: z.core.$RefinementCtx,
): void {
  const seen = new Set<string>();
  values.forEach((value, index) => {
    const id = getId(value);
    if (seen.has(id)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate ID: ${id}`,
        path: [path, index],
        input: value,
      });
    }
    seen.add(id);
  });
}

type RevisionLineageRecord = {
  revision: {
    revisionId: string;
    parentRevisionId: string | null;
    createdAt: string;
  };
};

function addRevisionLineageIssues<T extends RevisionLineageRecord>(
  values: readonly T[],
  getEntityId: (value: T) => string,
  path: string,
  context: z.core.$RefinementCtx,
): void {
  const byRevisionId = new Map(
    values.map((value) => [value.revision.revisionId, value]),
  );

  values.forEach((value, index) => {
    const parentRevisionId = value.revision.parentRevisionId;
    if (parentRevisionId === null) {
      return;
    }

    const parent = byRevisionId.get(parentRevisionId);
    if (!parent) {
      context.addIssue({
        code: "custom",
        message: `Unknown parent revision: ${parentRevisionId}`,
        path: [path, index, "revision", "parentRevisionId"],
        input: value,
      });
      return;
    }

    if (getEntityId(parent) !== getEntityId(value)) {
      context.addIssue({
        code: "custom",
        message: "A parent revision must belong to the same stable entity.",
        path: [path, index, "revision", "parentRevisionId"],
        input: value,
      });
    }

    if (
      Date.parse(parent.revision.createdAt) >
      Date.parse(value.revision.createdAt)
    ) {
      context.addIssue({
        code: "custom",
        message: "A parent revision cannot be newer than its child.",
        path: [path, index, "revision", "parentRevisionId"],
        input: value,
      });
    }

    const visited = new Set([value.revision.revisionId]);
    let ancestor: T | undefined = parent;
    while (ancestor) {
      if (visited.has(ancestor.revision.revisionId)) {
        context.addIssue({
          code: "custom",
          message: "Revision lineage cannot contain a cycle.",
          path: [path, index, "revision", "parentRevisionId"],
          input: value,
        });
        break;
      }
      visited.add(ancestor.revision.revisionId);
      ancestor =
        ancestor.revision.parentRevisionId === null
          ? undefined
          : byRevisionId.get(ancestor.revision.parentRevisionId);
    }
  });
}

export const clinicalAuthoringWorkspaceSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: stableIdSchema,
    label: z.string().min(1).max(240),
    createdAt: isoTimestampSchema,
    updatedAt: isoTimestampSchema,
    educationalDifficultyDefinitions: z.array(namedDefinitionSchema).min(1),
    clinicalSettingDefinitions: z.array(namedDefinitionSchema).min(1),
    facilityStageDefinitions: z
      .array(facilityStageDefinitionSchema)
      .min(1),
    deferredScopeDefinitions: z.array(namedDefinitionSchema),
    sources: z.array(sourceSchema),
    sourceSnapshots: z.array(sourceSnapshotSchema),
    citations: z.array(citationSchema),
    coverageFrameworks: z.array(coverageFrameworkSchema),
    coverageEntries: z.array(coverageEntrySchema),
    topics: z.array(clinicalTopicSchema),
    topicRevisions: z.array(clinicalTopicRevisionSchema),
    structuredFacts: z.array(structuredClinicalFactSchema),
    concepts: z.array(testedConceptSchema),
    practiceInbox: z.array(practiceQuestionInboxItemSchema),
    extractionBatches: z.array(extractionBatchSchema),
  })
  .strict()
  .superRefine((workspace, context) => {
    if (Date.parse(workspace.updatedAt) < Date.parse(workspace.createdAt)) {
      context.addIssue({
        code: "custom",
        message: "Workspace updatedAt cannot predate createdAt.",
        path: ["updatedAt"],
      });
    }

    addDuplicateIssues(
      workspace.educationalDifficultyDefinitions,
      (value) => value.id,
      "educationalDifficultyDefinitions",
      context,
    );
    addDuplicateIssues(
      workspace.clinicalSettingDefinitions,
      (value) => value.id,
      "clinicalSettingDefinitions",
      context,
    );
    addDuplicateIssues(
      workspace.facilityStageDefinitions,
      (value) => value.id,
      "facilityStageDefinitions",
      context,
    );
    addDuplicateIssues(
      workspace.deferredScopeDefinitions,
      (value) => value.id,
      "deferredScopeDefinitions",
      context,
    );
    addDuplicateIssues(workspace.sources, (value) => value.id, "sources", context);
    addDuplicateIssues(
      workspace.sourceSnapshots,
      (value) => value.id,
      "sourceSnapshots",
      context,
    );
    addDuplicateIssues(
      workspace.citations,
      (value) => value.id,
      "citations",
      context,
    );
    addDuplicateIssues(
      workspace.coverageFrameworks,
      (value) => value.id,
      "coverageFrameworks",
      context,
    );
    addDuplicateIssues(
      workspace.coverageEntries,
      (value) => value.id,
      "coverageEntries",
      context,
    );
    addDuplicateIssues(workspace.topics, (value) => value.id, "topics", context);
    addDuplicateIssues(
      workspace.topicRevisions,
      (value) => value.revision.revisionId,
      "topicRevisions",
      context,
    );
    addDuplicateIssues(
      workspace.structuredFacts,
      (value) => value.revision.revisionId,
      "structuredFacts",
      context,
    );
    addDuplicateIssues(
      workspace.concepts,
      (value) => value.revision.revisionId,
      "concepts",
      context,
    );
    addDuplicateIssues(
      workspace.practiceInbox,
      (value) => value.revision.revisionId,
      "practiceInbox",
      context,
    );
    addDuplicateIssues(
      workspace.extractionBatches,
      (value) => value.id,
      "extractionBatches",
      context,
    );
    addDuplicateIssues(
      workspace.facilityStageDefinitions,
      (value) => String(value.ordinal),
      "facilityStageDefinitions",
      context,
    );

    addRevisionLineageIssues(
      workspace.topicRevisions,
      (value) => value.topicId,
      "topicRevisions",
      context,
    );
    addRevisionLineageIssues(
      workspace.structuredFacts,
      (value) => value.id,
      "structuredFacts",
      context,
    );
    addRevisionLineageIssues(
      workspace.concepts,
      (value) => value.id,
      "concepts",
      context,
    );
    addRevisionLineageIssues(
      workspace.practiceInbox,
      (value) => value.id,
      "practiceInbox",
      context,
    );

    const seenTopicSectionIds = new Set<string>();
    workspace.topicRevisions.forEach((topicRevision, revisionIndex) => {
      topicRevision.sections.forEach((section, sectionIndex) => {
        if (seenTopicSectionIds.has(section.id)) {
          context.addIssue({
            code: "custom",
            message: `Duplicate Topic Section ID: ${section.id}`,
            path: [
              "topicRevisions",
              revisionIndex,
              "sections",
              sectionIndex,
              "id",
            ],
          });
        }
        seenTopicSectionIds.add(section.id);
      });
    });

    const seenExternalCoverageKeys = new Set<string>();
    workspace.coverageEntries.forEach((entry, index) => {
      const key = `${entry.frameworkId}:${entry.externalCategoryId}`;
      if (seenExternalCoverageKeys.has(key)) {
        context.addIssue({
          code: "custom",
          message:
            "An external category may appear only once within a coverage framework.",
          path: ["coverageEntries", index, "externalCategoryId"],
        });
      }
      seenExternalCoverageKeys.add(key);
    });

    const sourceIds = new Set(workspace.sources.map((source) => source.id));
    const sourceSnapshotIds = new Set(
      workspace.sourceSnapshots.map((snapshot) => snapshot.id),
    );
    const citationById = new Map(
      workspace.citations.map((citation) => [citation.id, citation]),
    );
    const frameworkIds = new Set(
      workspace.coverageFrameworks.map((framework) => framework.id),
    );
    const coverageIds = new Set(
      workspace.coverageEntries.map((entry) => entry.id),
    );
    const topicIds = new Set(workspace.topics.map((topic) => topic.id));
    const topicRevisionById = new Map(
      workspace.topicRevisions.map((revision) => [
        revision.revision.revisionId,
        revision,
      ]),
    );
    const topicSectionIds = new Set(
      workspace.topicRevisions.flatMap((revision) =>
        revision.sections.map((section) => section.id),
      ),
    );
    const factRevisionById = new Map(
      workspace.structuredFacts.map((fact) => [
        fact.revision.revisionId,
        fact,
      ]),
    );
    const conceptStableIds = new Set(
      workspace.concepts.map((concept) => concept.id),
    );
    const conceptRevisionById = new Map(
      workspace.concepts.map((concept) => [
        concept.revision.revisionId,
        concept,
      ]),
    );
    const practiceRevisionById = new Map(
      workspace.practiceInbox.map((item) => [
        item.revision.revisionId,
        item,
      ]),
    );
    const facilityStageIds = new Set(
      workspace.facilityStageDefinitions.map((stage) => stage.id),
    );
    const educationalDifficultyIds = new Set(
      workspace.educationalDifficultyDefinitions.map(
        (difficulty) => difficulty.id,
      ),
    );
    const clinicalSettingIds = new Set(
      workspace.clinicalSettingDefinitions.map((setting) => setting.id),
    );
    const deferredScopeIds = new Set(
      workspace.deferredScopeDefinitions.map((scope) => scope.id),
    );

    function validateClassificationReferences(
      classification: {
        educationalDifficultyId: string;
        earliestFacilityStageId: string;
        requiredClinicalSettingIds: readonly string[];
        deferredScope: { targetScopeId: string } | null;
      },
      path: (string | number)[],
    ): void {
      if (
        !educationalDifficultyIds.has(classification.educationalDifficultyId)
      ) {
        context.addIssue({
          code: "custom",
          message: `Unknown educational difficulty: ${classification.educationalDifficultyId}`,
          path: [...path, "educationalDifficultyId"],
        });
      }
      classification.requiredClinicalSettingIds.forEach(
        (settingId, settingIndex) => {
          if (!clinicalSettingIds.has(settingId)) {
            context.addIssue({
              code: "custom",
              message: `Unknown clinical setting: ${settingId}`,
              path: [
                ...path,
                "requiredClinicalSettingIds",
                settingIndex,
              ],
            });
          }
        },
      );
      if (!facilityStageIds.has(classification.earliestFacilityStageId)) {
        context.addIssue({
          code: "custom",
          message: `Unknown facility stage: ${classification.earliestFacilityStageId}`,
          path: [...path, "earliestFacilityStageId"],
        });
      }
      if (
        classification.deferredScope !== null &&
        !deferredScopeIds.has(classification.deferredScope.targetScopeId)
      ) {
        context.addIssue({
          code: "custom",
          message: `Unknown deferred scope: ${classification.deferredScope.targetScopeId}`,
          path: [...path, "deferredScope", "targetScopeId"],
        });
      }
    }

    const targetIdsByKind = {
      topic_section: topicSectionIds,
      structured_fact: new Set(factRevisionById.keys()),
      tested_concept: new Set(conceptRevisionById.keys()),
      coverage_entry: coverageIds,
      practice_inbox_item: new Set(practiceRevisionById.keys()),
    } as const;

    workspace.sourceSnapshots.forEach((snapshot, index) => {
      if (!sourceIds.has(snapshot.sourceId)) {
        context.addIssue({
          code: "custom",
          message: `Source Snapshot references unknown Source: ${snapshot.sourceId}`,
          path: ["sourceSnapshots", index, "sourceId"],
        });
      }
    });

    workspace.citations.forEach((citation, index) => {
      if (!sourceSnapshotIds.has(citation.sourceSnapshotId)) {
        context.addIssue({
          code: "custom",
          message: `Citation references unknown Source Snapshot: ${citation.sourceSnapshotId}`,
          path: ["citations", index, "sourceSnapshotId"],
        });
      }
      if (!targetIdsByKind[citation.targetKind].has(citation.targetId)) {
        context.addIssue({
          code: "custom",
          message: `Citation references unknown ${citation.targetKind}: ${citation.targetId}`,
          path: ["citations", index, "targetId"],
        });
      }
    });

    const listedCitationIds = new Set<string>();

    function validateCitationLinks(
      citationIds: readonly string[],
      expectedKind: keyof typeof targetIdsByKind,
      expectedTargetId: string,
      path: (string | number)[],
    ): void {
      citationIds.forEach((citationId, citationIndex) => {
        listedCitationIds.add(citationId);
        const citation = citationById.get(citationId);
        if (!citation) {
          context.addIssue({
            code: "custom",
            message: `Unknown citation: ${citationId}`,
            path: [...path, citationIndex],
          });
        } else if (
          citation.targetKind !== expectedKind ||
          citation.targetId !== expectedTargetId
        ) {
          context.addIssue({
            code: "custom",
            message:
              "A citation must point to the exact revision or record that lists it.",
            path: [...path, citationIndex],
          });
        }
      });
    }

    function validateApprovedCitations(
      hasClinicalApproval: boolean,
      citationIds: readonly string[],
      path: (string | number)[],
    ): void {
      if (!hasClinicalApproval) {
        return;
      }
      if (citationIds.length === 0) {
        context.addIssue({
          code: "custom",
          message: "Clinically approved material must cite a source.",
          path,
        });
      }
      citationIds.forEach((citationId, citationIndex) => {
        const citation = citationById.get(citationId);
        if (
          citation !== undefined &&
          citation.verificationState !== "human_verified"
        ) {
          context.addIssue({
            code: "custom",
            message:
              "Clinically approved material may use only human-verified citations.",
            path: [...path, citationIndex],
          });
        }
      });
    }

    workspace.coverageFrameworks.forEach((framework, index) => {
      if (!sourceSnapshotIds.has(framework.sourceSnapshotId)) {
        context.addIssue({
          code: "custom",
          message: `Coverage framework references unknown Source Snapshot: ${framework.sourceSnapshotId}`,
          path: ["coverageFrameworks", index, "sourceSnapshotId"],
        });
      }
    });

    workspace.coverageEntries.forEach((entry, index) => {
      if (!frameworkIds.has(entry.frameworkId)) {
        context.addIssue({
          code: "custom",
          message: `Coverage entry references unknown framework: ${entry.frameworkId}`,
          path: ["coverageEntries", index, "frameworkId"],
        });
      }
      if (entry.topicId !== null && !topicIds.has(entry.topicId)) {
        context.addIssue({
          code: "custom",
          message: `Coverage entry references unknown topic: ${entry.topicId}`,
          path: ["coverageEntries", index, "topicId"],
        });
      }
      if (
        entry.deferredScopeId !== null &&
        !deferredScopeIds.has(entry.deferredScopeId)
      ) {
        context.addIssue({
          code: "custom",
          message: `Coverage entry references unknown deferred scope: ${entry.deferredScopeId}`,
          path: ["coverageEntries", index, "deferredScopeId"],
        });
      }
      validateCitationLinks(
        entry.citationIds,
        "coverage_entry",
        entry.id,
        ["coverageEntries", index, "citationIds"],
      );
    });

    workspace.topics.forEach((topic, index) => {
      const revisionsForTopic = workspace.topicRevisions.filter(
        (revision) => revision.topicId === topic.id,
      );
      if (
        revisionsForTopic.length > 0 &&
        topic.currentWorkingRevisionId === null
      ) {
        context.addIssue({
          code: "custom",
          message:
            "A Clinical Topic with revisions must identify its current working revision.",
          path: ["topics", index, "currentWorkingRevisionId"],
        });
      }
      if (topic.currentWorkingRevisionId !== null) {
        const currentRevision = topicRevisionById.get(
          topic.currentWorkingRevisionId,
        );
        if (!currentRevision || currentRevision.topicId !== topic.id) {
          context.addIssue({
            code: "custom",
            message:
              "A current working revision must exist and belong to this Clinical Topic.",
            path: ["topics", index, "currentWorkingRevisionId"],
          });
        } else if (
          currentRevision.revision.workflowState === "archived"
        ) {
          context.addIssue({
            code: "custom",
            message: "An archived revision cannot be the current working revision.",
            path: ["topics", index, "currentWorkingRevisionId"],
          });
        }
      }
    });

    workspace.topicRevisions.forEach((topicRevision, index) => {
      if (!topicIds.has(topicRevision.topicId)) {
        context.addIssue({
          code: "custom",
          message: `Topic revision references unknown topic: ${topicRevision.topicId}`,
          path: ["topicRevisions", index, "topicId"],
        });
      }
      topicRevision.sections.forEach((section, sectionIndex) => {
        validateCitationLinks(
          section.citationIds,
          "topic_section",
          section.id,
          [
            "topicRevisions",
            index,
            "sections",
            sectionIndex,
            "citationIds",
          ],
        );
        validateApprovedCitations(
          topicRevision.revision.clinicalApproval !== null,
          section.citationIds,
          [
            "topicRevisions",
            index,
            "sections",
            sectionIndex,
            "citationIds",
          ],
        );
      });
      if (
        topicRevision.revision.clinicalApproval !== null &&
        topicRevision.sections.length === 0
      ) {
        context.addIssue({
          code: "custom",
          message:
            "A clinically approved Clinical Topic revision must contain at least one sourced section.",
          path: ["topicRevisions", index, "sections"],
        });
      }
    });

    const unresolvedFactsByGroup = new Map<string, number>();
    workspace.structuredFacts.forEach((fact, index) => {
      if (!topicRevisionById.has(fact.topicRevisionId)) {
        context.addIssue({
          code: "custom",
          message: `Fact references unknown topic revision: ${fact.topicRevisionId}`,
          path: ["structuredFacts", index, "topicRevisionId"],
        });
      }
      validateCitationLinks(
        fact.citationIds,
        "structured_fact",
        fact.revision.revisionId,
        ["structuredFacts", index, "citationIds"],
      );
      validateApprovedCitations(
        fact.revision.clinicalApproval !== null,
        fact.citationIds,
        ["structuredFacts", index, "citationIds"],
      );
      if (
        fact.conflict.state === "unresolved" &&
        fact.conflict.conflictGroupId !== null
      ) {
        unresolvedFactsByGroup.set(
          fact.conflict.conflictGroupId,
          (unresolvedFactsByGroup.get(fact.conflict.conflictGroupId) ?? 0) + 1,
        );
      }
    });
    for (const [groupId, count] of unresolvedFactsByGroup) {
      if (count < 2) {
        context.addIssue({
          code: "custom",
          message: `Unresolved conflict group ${groupId} must retain at least two competing facts.`,
          path: ["structuredFacts"],
        });
      }
    }

    workspace.concepts.forEach((concept, index) => {
      if (!topicIds.has(concept.primaryTopicId)) {
        context.addIssue({
          code: "custom",
          message: `Concept references unknown primary topic: ${concept.primaryTopicId}`,
          path: ["concepts", index, "primaryTopicId"],
        });
      }
      concept.relatedTopicIds.forEach((topicId, topicIndex) => {
        if (!topicIds.has(topicId)) {
          context.addIssue({
            code: "custom",
            message: `Concept references unknown related topic: ${topicId}`,
            path: ["concepts", index, "relatedTopicIds", topicIndex],
          });
        }
      });
      validateClassificationReferences(concept.classification, [
        "concepts",
        index,
        "classification",
      ]);
      validateCitationLinks(
        concept.citationIds,
        "tested_concept",
        concept.revision.revisionId,
        ["concepts", index, "citationIds"],
      );
      validateApprovedCitations(
        concept.revision.clinicalApproval !== null,
        concept.citationIds,
        ["concepts", index, "citationIds"],
      );
    });

    workspace.practiceInbox.forEach((item, index) => {
      if (!sourceSnapshotIds.has(item.sourceSnapshotId)) {
        context.addIssue({
          code: "custom",
          message: `Practice inbox item references unknown Source Snapshot: ${item.sourceSnapshotId}`,
          path: ["practiceInbox", index, "sourceSnapshotId"],
        });
      }
      validateCitationLinks(
        item.citationIds,
        "practice_inbox_item",
        item.revision.revisionId,
        ["practiceInbox", index, "citationIds"],
      );
      validateApprovedCitations(
        item.revision.clinicalApproval !== null,
        item.citationIds,
        ["practiceInbox", index, "citationIds"],
      );

      item.aiSuggestions.forEach((suggestion, suggestionIndex) => {
        if (
          suggestion.recommendedTopicId !== null &&
          !topicIds.has(suggestion.recommendedTopicId)
        ) {
          context.addIssue({
            code: "custom",
            message: `AI suggestion references unknown topic: ${suggestion.recommendedTopicId}`,
            path: [
              "practiceInbox",
              index,
              "aiSuggestions",
              suggestionIndex,
              "recommendedTopicId",
            ],
          });
        }
        if (
          suggestion.matchingConceptId !== null &&
          !conceptStableIds.has(suggestion.matchingConceptId)
        ) {
          context.addIssue({
            code: "custom",
            message: `AI suggestion references unknown concept: ${suggestion.matchingConceptId}`,
            path: [
              "practiceInbox",
              index,
              "aiSuggestions",
              suggestionIndex,
              "matchingConceptId",
            ],
          });
        }
        if (
          suggestion.proposedConceptId !== null &&
          conceptStableIds.has(suggestion.proposedConceptId)
        ) {
          context.addIssue({
            code: "custom",
            message:
              "A proposed concept ID must not overwrite an existing concept.",
            path: [
              "practiceInbox",
              index,
              "aiSuggestions",
              suggestionIndex,
              "proposedConceptId",
            ],
          });
        }
        validateClassificationReferences(
          suggestion.recommendedClassification,
          [
            "practiceInbox",
            index,
            "aiSuggestions",
            suggestionIndex,
            "recommendedClassification",
          ],
        );
      });
    });

    workspace.citations.forEach((citation, index) => {
      if (!listedCitationIds.has(citation.id)) {
        context.addIssue({
          code: "custom",
          message:
            "Every Citation must be listed by the exact record that it supports.",
          path: ["citations", index],
        });
      }
    });

    const outputByKind = {
      topic_revision: topicRevisionById,
      structured_fact: factRevisionById,
      tested_concept: conceptRevisionById,
      coverage_entry: new Map(
        workspace.coverageEntries.map((entry) => [entry.id, entry]),
      ),
      practice_inbox_item: practiceRevisionById,
    } as const;

    workspace.extractionBatches.forEach((batch, index) => {
      if (!sourceSnapshotIds.has(batch.sourceSnapshotId)) {
        context.addIssue({
          code: "custom",
          message: `Extraction batch references unknown Source Snapshot: ${batch.sourceSnapshotId}`,
          path: ["extractionBatches", index, "sourceSnapshotId"],
        });
      }

      batch.outputReferences.forEach((reference, referenceIndex) => {
        const output = outputByKind[reference.kind].get(reference.id);
        if (!output) {
          context.addIssue({
            code: "custom",
            message: `Extraction batch references unknown ${reference.kind}: ${reference.id}`,
            path: [
              "extractionBatches",
              index,
              "outputReferences",
              referenceIndex,
              "id",
            ],
          });
          return;
        }

        if (
          batch.processingMethod === "ai_assisted" &&
          reference.kind === "coverage_entry"
        ) {
          context.addIssue({
            code: "custom",
            message:
              "AI-assisted extraction cannot directly create an unreviewed coverage mapping.",
            path: [
              "extractionBatches",
              index,
              "outputReferences",
              referenceIndex,
            ],
          });
        }

        if (
          "revision" in output &&
          (output.revision.provenance.kind !== batch.processingMethod ||
            output.revision.provenance.reference !== batch.id)
        ) {
          context.addIssue({
            code: "custom",
            message:
              "A revision emitted by an extraction batch must identify that batch and processing method in its provenance.",
            path: [
              "extractionBatches",
              index,
              "outputReferences",
              referenceIndex,
            ],
          });
        }

        if (
          batch.processingMethod === "ai_assisted" &&
          "revision" in output &&
          output.revision.workflowState !== "draft"
        ) {
          context.addIssue({
            code: "custom",
            message:
              "AI-assisted extraction may output only Draft revisions.",
            path: [
              "extractionBatches",
              index,
              "outputReferences",
              referenceIndex,
            ],
          });
        }
      });

      batch.unresolvedConflictGroupIds.forEach((groupId, groupIndex) => {
        if (!unresolvedFactsByGroup.has(groupId)) {
          context.addIssue({
            code: "custom",
            message: `Batch lists unknown unresolved conflict group: ${groupId}`,
            path: [
              "extractionBatches",
              index,
              "unresolvedConflictGroupIds",
              groupIndex,
            ],
          });
        }
      });
    });
  });

/**
 * Additional guardrails for deliberately tracked examples and registries.
 * This can reject obvious private-source leaks, but it cannot determine
 * copyright status or detect every copied passage; human review remains
 * mandatory before committing authoring data.
 */
export const publicClinicalAuthoringWorkspaceSchema =
  clinicalAuthoringWorkspaceSchema.superRefine((workspace, context) => {
    workspace.sources.forEach((source, index) => {
      if (source.rightsReview.status === "review_required") {
        context.addIssue({
          code: "custom",
          message:
            "A public fixture cannot include a Source whose rights review is unresolved.",
          path: ["sources", index, "rightsReview", "status"],
        });
      }
      const identifier = source.canonicalUrlOrIdentifier;
      if (identifier?.startsWith("http://") || identifier?.startsWith("https://")) {
        const url = new URL(identifier);
        if (url.username || url.password) {
          context.addIssue({
            code: "custom",
            message: "Public Source URLs cannot contain embedded credentials.",
            path: ["sources", index, "canonicalUrlOrIdentifier"],
          });
        }
      }
    });

    workspace.sourceSnapshots.forEach((snapshot, index) => {
      if (
        snapshot.accessScope === "authenticated_private" ||
        snapshot.accessScope === "owner_local"
      ) {
        context.addIssue({
          code: "custom",
          message:
            "A public fixture cannot reference authenticated or owner-local source material.",
          path: ["sourceSnapshots", index, "accessScope"],
        });
      }

      if (snapshot.retrievedUrl !== null) {
        const url = new URL(snapshot.retrievedUrl);
        if (
          url.username ||
          url.password ||
          url.search.length > 0 ||
          url.hash.length > 0
        ) {
          context.addIssue({
            code: "custom",
            message:
              "Public snapshot URLs cannot contain credentials, query tokens, or fragments.",
            path: ["sourceSnapshots", index, "retrievedUrl"],
          });
        }
      }
    });
  });

export type ClinicalAuthoringWorkspace = z.infer<
  typeof clinicalAuthoringWorkspaceSchema
>;

export type ClinicalAuthoringWorkspaceSummary = {
  workspaceId: string;
  sourceCount: number;
  sourceSnapshotCount: number;
  frameworkCount: number;
  coverageEntryCount: number;
  topicCount: number;
  structuredFactCount: number;
  conceptCount: number;
  practiceInboxCount: number;
  extractionBatchCount: number;
  unresolvedConflictGroupIds: string[];
};

export function validateClinicalAuthoringWorkspace(
  candidate: unknown,
): ClinicalAuthoringWorkspace {
  return clinicalAuthoringWorkspaceSchema.parse(candidate);
}

export function validatePublicClinicalAuthoringWorkspace(
  candidate: unknown,
): ClinicalAuthoringWorkspace {
  return publicClinicalAuthoringWorkspaceSchema.parse(candidate);
}

export function summarizeClinicalAuthoringWorkspace(
  workspace: ClinicalAuthoringWorkspace,
): ClinicalAuthoringWorkspaceSummary {
  const unresolvedConflictGroupIds = new Set<string>();
  for (const fact of workspace.structuredFacts) {
    if (
      fact.conflict.state === "unresolved" &&
      fact.conflict.conflictGroupId !== null
    ) {
      unresolvedConflictGroupIds.add(fact.conflict.conflictGroupId);
    }
  }

  return {
    workspaceId: workspace.id,
    sourceCount: workspace.sources.length,
    sourceSnapshotCount: workspace.sourceSnapshots.length,
    frameworkCount: workspace.coverageFrameworks.length,
    coverageEntryCount: workspace.coverageEntries.length,
    topicCount: workspace.topics.length,
    structuredFactCount: new Set(
      workspace.structuredFacts.map((fact) => fact.id),
    ).size,
    conceptCount: new Set(workspace.concepts.map((concept) => concept.id)).size,
    practiceInboxCount: workspace.practiceInbox.length,
    extractionBatchCount: workspace.extractionBatches.length,
    unresolvedConflictGroupIds: [...unresolvedConflictGroupIds].sort(),
  };
}
