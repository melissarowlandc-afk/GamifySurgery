import { z } from "zod";

import { testedConceptSchema } from "./concept.js";
import {
  coverageFrameworkSchema,
  coverageFrameworkNodeSchema,
  topicCoverageMappingSchema,
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

export const CLINICAL_AUTHORING_WORKSPACE_SCHEMA_VERSION = 2 as const;

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
    workflowState: string;
  };
};

function addRevisionLineageIssues<T extends RevisionLineageRecord>(
  values: readonly T[],
  getEntityId: (value: T) => string,
  path: string,
  context: z.core.$RefinementCtx,
  requireSingleActiveLeaf = false,
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

  if (!requireSingleActiveLeaf) {
    return;
  }

  const byEntityId = new Map<string, T[]>();
  values.forEach((value) => {
    const entityId = getEntityId(value);
    const group = byEntityId.get(entityId) ?? [];
    group.push(value);
    byEntityId.set(entityId, group);
  });

  for (const [entityId, revisions] of byEntityId) {
    const parentsOfActiveRevisions = new Set(
      revisions
        .filter((value) => value.revision.workflowState !== "archived")
        .map((value) => value.revision.parentRevisionId)
        .filter((value): value is string => value !== null),
    );
    const activeLeaves = revisions.filter(
      (value) =>
        value.revision.workflowState !== "archived" &&
        !parentsOfActiveRevisions.has(value.revision.revisionId),
    );
    const hasActiveRevision = revisions.some(
      (value) => value.revision.workflowState !== "archived",
    );
    if (hasActiveRevision && activeLeaves.length !== 1) {
      context.addIssue({
        code: "custom",
        message: `Stable entity ${entityId} must have exactly one active revision leaf.`,
        path: [path],
      });
    }
  }
}

function addWhitespaceOnlyStringIssues(
  value: unknown,
  path: (string | number)[],
  context: z.core.$RefinementCtx,
): void {
  if (typeof value === "string") {
    if (value.length > 0 && value.trim().length === 0) {
      context.addIssue({
        code: "custom",
        message: "Text values cannot contain only whitespace.",
        path,
      });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      addWhitespaceOnlyStringIssues(item, [...path, index], context),
    );
    return;
  }
  if (value !== null && typeof value === "object") {
    Object.entries(value).forEach(([key, nested]) =>
      addWhitespaceOnlyStringIssues(nested, [...path, key], context),
    );
  }
}

export const clinicalAuthoringWorkspaceSchema = z
  .object({
    schemaVersion: z.literal(CLINICAL_AUTHORING_WORKSPACE_SCHEMA_VERSION),
    id: stableIdSchema,
    label: z.string().min(1).max(240),
    createdAt: isoTimestampSchema,
    updatedAt: isoTimestampSchema,
    educationalDifficultyDefinitions: z.array(namedDefinitionSchema).min(1),
    clinicalSettingDefinitions: z.array(namedDefinitionSchema).min(1),
    conceptTopicRelationshipDefinitions: z
      .array(namedDefinitionSchema)
      .min(1),
    facilityStageDefinitions: z
      .array(facilityStageDefinitionSchema)
      .min(1),
    deferredScopeDefinitions: z.array(namedDefinitionSchema),
    sourceFormatDefinitions: z.array(namedDefinitionSchema).min(1),
    factTypeDefinitions: z.array(namedDefinitionSchema).min(1),
    distributionTypeDefinitions: z.array(namedDefinitionSchema).min(1),
    coverageClassificationDefinitions: z
      .array(namedDefinitionSchema)
      .min(1),
    sources: z.array(sourceSchema),
    sourceSnapshots: z.array(sourceSnapshotSchema),
    citations: z.array(citationSchema),
    coverageFrameworks: z.array(coverageFrameworkSchema),
    coverageFrameworkNodes: z.array(coverageFrameworkNodeSchema),
    topicCoverageMappings: z.array(topicCoverageMappingSchema),
    topics: z.array(clinicalTopicSchema),
    topicRevisions: z.array(clinicalTopicRevisionSchema),
    structuredFacts: z.array(structuredClinicalFactSchema),
    concepts: z.array(testedConceptSchema),
    practiceInbox: z.array(practiceQuestionInboxItemSchema),
    extractionBatches: z.array(extractionBatchSchema),
  })
  .strict()
  .superRefine((workspace, context) => {
    addWhitespaceOnlyStringIssues(workspace, [], context);

    if (Date.parse(workspace.updatedAt) < Date.parse(workspace.createdAt)) {
      context.addIssue({
        code: "custom",
        message: "Workspace updatedAt cannot predate createdAt.",
        path: ["updatedAt"],
      });
    }
    const containedEventTimestamps: {
      timestamp: string;
      path: (string | number)[];
    }[] = [];
    workspace.sources.forEach((source, index) => {
      containedEventTimestamps.push({
        timestamp: source.rightsReview.reviewedAt,
        path: ["sources", index, "rightsReview", "reviewedAt"],
      });
    });
    workspace.sourceSnapshots.forEach((snapshot, index) => {
      containedEventTimestamps.push({
        timestamp: snapshot.retrievedAt,
        path: ["sourceSnapshots", index, "retrievedAt"],
      });
    });
    workspace.citations.forEach((citation, index) => {
      containedEventTimestamps.push({
        timestamp: citation.recordedAt,
        path: ["citations", index, "recordedAt"],
      });
      if (citation.verificationRecordedAt !== null) {
        containedEventTimestamps.push({
          timestamp: citation.verificationRecordedAt,
          path: ["citations", index, "verificationRecordedAt"],
        });
      }
    });
    workspace.coverageFrameworks.forEach((framework, index) => {
      containedEventTimestamps.push({
        timestamp: framework.recordedAt,
        path: ["coverageFrameworks", index, "recordedAt"],
      });
    });
    workspace.topicCoverageMappings.forEach((mapping, index) => {
      containedEventTimestamps.push({
        timestamp: mapping.updatedAt,
        path: ["topicCoverageMappings", index, "updatedAt"],
      });
    });
    const revisionCollections = [
      ["topicRevisions", workspace.topicRevisions],
      ["structuredFacts", workspace.structuredFacts],
      ["concepts", workspace.concepts],
      ["practiceInbox", workspace.practiceInbox],
    ] as const;
    revisionCollections.forEach(([collectionName, values]) => {
      values.forEach((value, index) => {
        containedEventTimestamps.push({
          timestamp: value.revision.createdAt,
          path: [collectionName, index, "revision", "createdAt"],
        });
        if (value.revision.clinicalApproval !== null) {
          containedEventTimestamps.push({
            timestamp: value.revision.clinicalApproval.reviewedAt,
            path: [
              collectionName,
              index,
              "revision",
              "clinicalApproval",
              "reviewedAt",
            ],
          });
        }
      });
    });
    workspace.practiceInbox.forEach((item, itemIndex) => {
      item.aiSuggestions.forEach((suggestion, suggestionIndex) => {
        containedEventTimestamps.push({
          timestamp: suggestion.envelope.createdAt,
          path: [
            "practiceInbox",
            itemIndex,
            "aiSuggestions",
            suggestionIndex,
            "envelope",
            "createdAt",
          ],
        });
      });
    });
    workspace.extractionBatches.forEach((batch, index) => {
      containedEventTimestamps.push({
        timestamp: batch.updatedAt,
        path: ["extractionBatches", index, "updatedAt"],
      });
      if (batch.startedAt !== null) {
        containedEventTimestamps.push({
          timestamp: batch.startedAt,
          path: ["extractionBatches", index, "startedAt"],
        });
      }
      if (batch.completedAt !== null) {
        containedEventTimestamps.push({
          timestamp: batch.completedAt,
          path: ["extractionBatches", index, "completedAt"],
        });
      }
    });
    const futureEvent = containedEventTimestamps.find(
      ({ timestamp }) =>
        Date.parse(timestamp) > Date.parse(workspace.updatedAt),
    );
    if (futureEvent !== undefined) {
      context.addIssue({
        code: "custom",
        message:
          "Workspace updatedAt must be at least as recent as every contained event.",
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
      workspace.conceptTopicRelationshipDefinitions,
      (value) => value.id,
      "conceptTopicRelationshipDefinitions",
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
    addDuplicateIssues(
      workspace.sourceFormatDefinitions,
      (value) => value.id,
      "sourceFormatDefinitions",
      context,
    );
    addDuplicateIssues(
      workspace.factTypeDefinitions,
      (value) => value.id,
      "factTypeDefinitions",
      context,
    );
    addDuplicateIssues(
      workspace.distributionTypeDefinitions,
      (value) => value.id,
      "distributionTypeDefinitions",
      context,
    );
    addDuplicateIssues(
      workspace.coverageClassificationDefinitions,
      (value) => value.id,
      "coverageClassificationDefinitions",
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
      workspace.coverageFrameworkNodes,
      (value) => value.id,
      "coverageFrameworkNodes",
      context,
    );
    addDuplicateIssues(
      workspace.topicCoverageMappings,
      (value) => value.id,
      "topicCoverageMappings",
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
      true,
    );
    addRevisionLineageIssues(
      workspace.structuredFacts,
      (value) => value.id,
      "structuredFacts",
      context,
      true,
    );
    addRevisionLineageIssues(
      workspace.concepts,
      (value) => value.id,
      "concepts",
      context,
      true,
    );
    addRevisionLineageIssues(
      workspace.practiceInbox,
      (value) => value.id,
      "practiceInbox",
      context,
      true,
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
    const seenCoverageOrdinals = new Set<string>();
    workspace.coverageFrameworkNodes.forEach((node, index) => {
      const key = `${node.frameworkId}:${node.externalCategoryId}`;
      if (seenExternalCoverageKeys.has(key)) {
        context.addIssue({
          code: "custom",
          message:
            "An external category may appear only once within a coverage framework.",
          path: [
            "coverageFrameworkNodes",
            index,
            "externalCategoryId",
          ],
        });
      }
      seenExternalCoverageKeys.add(key);

      const ordinalKey = `${node.frameworkId}:${node.parentNodeId ?? "root"}:${node.ordinal}`;
      if (seenCoverageOrdinals.has(ordinalKey)) {
        context.addIssue({
          code: "custom",
          message:
            "Sibling coverage nodes must use distinct source-order ordinals.",
          path: ["coverageFrameworkNodes", index, "ordinal"],
        });
      }
      seenCoverageOrdinals.add(ordinalKey);
    });

    const seenTopicCoverageKeys = new Set<string>();
    workspace.topicCoverageMappings.forEach((mapping, index) => {
      const key = `${mapping.coverageNodeId}:${mapping.topicId}`;
      if (seenTopicCoverageKeys.has(key)) {
        context.addIssue({
          code: "custom",
          message:
            "A Clinical Topic may map to a coverage node only once.",
          path: ["topicCoverageMappings", index],
        });
      }
      seenTopicCoverageKeys.add(key);
    });

    const sourceIds = new Set(workspace.sources.map((source) => source.id));
    const sourceById = new Map(
      workspace.sources.map((source) => [source.id, source]),
    );
    const sourceSnapshotIds = new Set(
      workspace.sourceSnapshots.map((snapshot) => snapshot.id),
    );
    const sourceSnapshotById = new Map(
      workspace.sourceSnapshots.map((snapshot) => [snapshot.id, snapshot]),
    );
    const citationById = new Map(
      workspace.citations.map((citation) => [citation.id, citation]),
    );
    const frameworkIds = new Set(
      workspace.coverageFrameworks.map((framework) => framework.id),
    );
    const coverageFrameworkById = new Map(
      workspace.coverageFrameworks.map((framework) => [
        framework.id,
        framework,
      ]),
    );
    const coverageNodeIds = new Set(
      workspace.coverageFrameworkNodes.map((node) => node.id),
    );
    const topicCoverageMappingIds = new Set(
      workspace.topicCoverageMappings.map((mapping) => mapping.id),
    );
    const topicIds = new Set(workspace.topics.map((topic) => topic.id));
    const topicRevisionById = new Map(
      workspace.topicRevisions.map((revision) => [
        revision.revision.revisionId,
        revision,
      ]),
    );

    function validateRightsReviewPredatesUse(
      source: (typeof workspace.sources)[number],
      useTimestamp: string,
      path: (string | number)[],
      activity: string,
    ): void {
      if (
        Date.parse(source.rightsReview.reviewedAt) >
        Date.parse(useTimestamp)
      ) {
        context.addIssue({
          code: "custom",
          message: `${activity} cannot predate the Source rights review that authorizes it.`,
          path,
        });
      }
    }
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
    const conceptTopicRelationshipIds = new Set(
      workspace.conceptTopicRelationshipDefinitions.map(
        (relationship) => relationship.id,
      ),
    );
    const sourceFormatIds = new Set(
      workspace.sourceFormatDefinitions.map((format) => format.id),
    );
    const factTypeIds = new Set(
      workspace.factTypeDefinitions.map((factType) => factType.id),
    );
    const distributionTypeIds = new Set(
      workspace.distributionTypeDefinitions.map(
        (distribution) => distribution.id,
      ),
    );
    const coverageClassificationIds = new Set(
      workspace.coverageClassificationDefinitions.map(
        (classification) => classification.id,
      ),
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
      coverage_framework_node: coverageNodeIds,
      practice_inbox_item: new Set(practiceRevisionById.keys()),
    } as const;

    workspace.sourceSnapshots.forEach((snapshot, index) => {
      const source = sourceById.get(snapshot.sourceId);
      if (!source) {
        context.addIssue({
          code: "custom",
          message: `Source Snapshot references unknown Source: ${snapshot.sourceId}`,
          path: ["sourceSnapshots", index, "sourceId"],
        });
      }
      if (!sourceFormatIds.has(snapshot.formatId)) {
        context.addIssue({
          code: "custom",
          message: `Source Snapshot references unknown format: ${snapshot.formatId}`,
          path: ["sourceSnapshots", index, "formatId"],
        });
      }
      const representsRetrievedArtifact =
        snapshot.accessScope !== "metadata_only" &&
        snapshot.accessScope !== "synthetic_fixture";
      if (
        source !== undefined &&
        representsRetrievedArtifact &&
        !source.rightsReview.localProcessingPermitted
      ) {
        context.addIssue({
          code: "custom",
          message:
            "A retrieved Source Snapshot requires permission for local processing.",
          path: ["sourceSnapshots", index, "accessScope"],
        });
      }
      const representsRetainedPrivateArtifact =
        snapshot.accessScope === "authenticated_private" ||
        snapshot.accessScope === "owner_local";
      if (
        source !== undefined &&
        representsRetainedPrivateArtifact &&
        !source.rightsReview.privateStoragePermitted
      ) {
        context.addIssue({
          code: "custom",
          message:
            "A private Source Snapshot requires permission for private storage.",
          path: ["sourceSnapshots", index, "accessScope"],
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
      const snapshot = sourceSnapshotById.get(citation.sourceSnapshotId);
      const source =
        snapshot === undefined ? undefined : sourceById.get(snapshot.sourceId);
      if (
        snapshot !== undefined &&
        Date.parse(citation.recordedAt) < Date.parse(snapshot.retrievedAt)
      ) {
        context.addIssue({
          code: "custom",
          message:
            "A Citation cannot be recorded before its exact Source Snapshot was retrieved.",
          path: ["citations", index, "recordedAt"],
        });
      }
      if (
        source !== undefined &&
        citation.usageKind !== "bibliographic_metadata" &&
        citation.usageKind !== "synthetic_content" &&
        !source.rightsReview.localProcessingPermitted
      ) {
        context.addIssue({
          code: "custom",
          message:
            "A content-bearing Citation requires permission for local processing.",
          path: ["citations", index, "usageKind"],
        });
      }
      if (
        source !== undefined &&
        citation.usageKind === "source_excerpt" &&
        !source.rightsReview.privateStoragePermitted
      ) {
        context.addIssue({
          code: "custom",
          message:
            "A Citation that retains a source excerpt requires permission for private storage.",
          path: ["citations", index, "usageKind"],
        });
      }
      if (
        source !== undefined &&
        citation.usageKind === "synthetic_content" &&
        source.rightsReview.status !== "synthetic_or_owner_authored"
      ) {
        context.addIssue({
          code: "custom",
          message:
            "Synthetic-content Citation usage requires a synthetic or owner-authored Source.",
          path: ["citations", index, "usageKind"],
        });
      }
      if (
        source !== undefined &&
        citation.usageKind !== "bibliographic_metadata"
      ) {
        validateRightsReviewPredatesUse(
          source,
          citation.recordedAt,
          ["citations", index, "recordedAt"],
          "Content-bearing Citation creation",
        );
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
      clinicalApproval: { reviewedAt: string } | null,
      citationIds: readonly string[],
      path: (string | number)[],
    ): void {
      if (clinicalApproval === null) {
        return;
      }
      if (citationIds.length === 0) {
        context.addIssue({
          code: "custom",
          message: "Clinically approved material must cite a source.",
          path,
        });
      }
      const hasSubstantiveVerifiedCitation = citationIds.some(
        (citationId) => {
          const citation = citationById.get(citationId);
          return (
            citation !== undefined &&
            citation.verificationState === "human_verified" &&
            citation.usageKind !== "bibliographic_metadata"
          );
        },
      );
      if (!hasSubstantiveVerifiedCitation) {
        context.addIssue({
          code: "custom",
          message:
            "Clinically approved material requires at least one human-verified content-bearing Citation; bibliographic metadata alone is not clinical support.",
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
        if (
          citation !== undefined &&
          (Date.parse(citation.recordedAt) >
            Date.parse(clinicalApproval.reviewedAt) ||
            citation.verificationRecordedAt === null ||
            Date.parse(citation.verificationRecordedAt) >
              Date.parse(clinicalApproval.reviewedAt))
        ) {
          context.addIssue({
            code: "custom",
            message:
              "A clinically approved revision may use only Citations created and human-verified no later than its approval time.",
            path: [...path, citationIndex],
          });
        }
      });
    }

    workspace.coverageFrameworks.forEach((framework, index) => {
      const snapshot = sourceSnapshotById.get(framework.sourceSnapshotId);
      if (!snapshot) {
        context.addIssue({
          code: "custom",
          message: `Coverage framework references unknown Source Snapshot: ${framework.sourceSnapshotId}`,
          path: ["coverageFrameworks", index, "sourceSnapshotId"],
        });
        return;
      }
      const source = sourceById.get(snapshot.sourceId);
      if (
        source !== undefined &&
        source.sourceType !== "official_outline" &&
        source.sourceType !== "synthetic_fixture"
      ) {
        context.addIssue({
          code: "custom",
          message:
            "A Coverage Framework must use an official-outline Source (or an explicitly synthetic fixture).",
          path: ["coverageFrameworks", index, "sourceSnapshotId"],
        });
      }
      if (Date.parse(framework.recordedAt) < Date.parse(snapshot.retrievedAt)) {
        context.addIssue({
          code: "custom",
          message:
            "A Coverage Framework cannot be recorded before its Source Snapshot was retrieved.",
          path: ["coverageFrameworks", index, "recordedAt"],
        });
      }
    });

    const coverageNodeById = new Map(
      workspace.coverageFrameworkNodes.map((node) => [node.id, node]),
    );
    workspace.coverageFrameworkNodes.forEach((node, index) => {
      if (!frameworkIds.has(node.frameworkId)) {
        context.addIssue({
          code: "custom",
          message: `Coverage node references unknown framework: ${node.frameworkId}`,
          path: ["coverageFrameworkNodes", index, "frameworkId"],
        });
      }
      if (
        node.sourceDefinedClassificationId !== null &&
        !coverageClassificationIds.has(
          node.sourceDefinedClassificationId,
        )
      ) {
        context.addIssue({
          code: "custom",
          message: `Coverage node references unknown source classification: ${node.sourceDefinedClassificationId}`,
          path: [
            "coverageFrameworkNodes",
            index,
            "sourceDefinedClassificationId",
          ],
        });
      }
      if (node.parentNodeId === null && node.categoryPath.length !== 1) {
        context.addIssue({
          code: "custom",
          message: "A root coverage node must contain exactly one path label.",
          path: ["coverageFrameworkNodes", index, "categoryPath"],
        });
      }
      if (node.parentNodeId !== null) {
        const parent = coverageNodeById.get(node.parentNodeId);
        if (!parent) {
          context.addIssue({
            code: "custom",
            message: `Coverage node references unknown parent: ${node.parentNodeId}`,
            path: ["coverageFrameworkNodes", index, "parentNodeId"],
          });
        } else {
          if (parent.frameworkId !== node.frameworkId) {
            context.addIssue({
              code: "custom",
              message:
                "A coverage node and its parent must belong to the same framework.",
              path: ["coverageFrameworkNodes", index, "parentNodeId"],
            });
          }
          const expectedPrefix = node.categoryPath.slice(0, -1);
          if (
            node.categoryPath.length !== parent.categoryPath.length + 1 ||
            expectedPrefix.some(
              (label, pathIndex) => label !== parent.categoryPath[pathIndex],
            )
          ) {
            context.addIssue({
              code: "custom",
              message:
                "A child coverage path must extend its parent path by exactly one label.",
              path: ["coverageFrameworkNodes", index, "categoryPath"],
            });
          }
        }
      }

      const visited = new Set([node.id]);
      let ancestorId = node.parentNodeId;
      while (ancestorId !== null) {
        if (visited.has(ancestorId)) {
          context.addIssue({
            code: "custom",
            message: "Coverage-node hierarchy cannot contain a cycle.",
            path: ["coverageFrameworkNodes", index, "parentNodeId"],
          });
          break;
        }
        visited.add(ancestorId);
        ancestorId = coverageNodeById.get(ancestorId)?.parentNodeId ?? null;
      }

      validateCitationLinks(
        node.citationIds,
        "coverage_framework_node",
        node.id,
        ["coverageFrameworkNodes", index, "citationIds"],
      );
      const framework = coverageFrameworkById.get(node.frameworkId);
      node.citationIds.forEach((citationId, citationIndex) => {
        const citation = citationById.get(citationId);
        if (
          framework !== undefined &&
          citation !== undefined &&
          citation.sourceSnapshotId !== framework.sourceSnapshotId
        ) {
          context.addIssue({
            code: "custom",
            message:
              "A Coverage Framework Node citation must use the framework's exact Source Snapshot.",
            path: [
              "coverageFrameworkNodes",
              index,
              "citationIds",
              citationIndex,
            ],
          });
        }
      });
    });

    workspace.topicCoverageMappings.forEach((mapping, index) => {
      if (!coverageNodeIds.has(mapping.coverageNodeId)) {
        context.addIssue({
          code: "custom",
          message: `Topic coverage mapping references unknown node: ${mapping.coverageNodeId}`,
          path: ["topicCoverageMappings", index, "coverageNodeId"],
        });
      }
      if (!topicIds.has(mapping.topicId)) {
        context.addIssue({
          code: "custom",
          message: `Topic coverage mapping references unknown topic: ${mapping.topicId}`,
          path: ["topicCoverageMappings", index, "topicId"],
        });
      }
      if (
        mapping.deferredScopeId !== null &&
        !deferredScopeIds.has(mapping.deferredScopeId)
      ) {
        context.addIssue({
          code: "custom",
          message: `Topic coverage mapping references unknown deferred scope: ${mapping.deferredScopeId}`,
          path: ["topicCoverageMappings", index, "deferredScopeId"],
        });
      }
    });

    workspace.topics.forEach((topic, index) => {
      const revisionsForTopic = workspace.topicRevisions.filter(
        (revision) => revision.topicId === topic.id,
      );
      const activeRevisionsForTopic = revisionsForTopic.filter(
        (revision) => revision.revision.workflowState !== "archived",
      );
      if (
        activeRevisionsForTopic.length > 0 &&
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
        } else {
          const isParentOfActiveRevision = activeRevisionsForTopic.some(
            (revision) =>
              revision.revision.parentRevisionId ===
              currentRevision.revision.revisionId,
          );
          if (isParentOfActiveRevision) {
            context.addIssue({
              code: "custom",
              message:
                "The current working revision must be the unique active revision leaf.",
              path: ["topics", index, "currentWorkingRevisionId"],
            });
          }
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
          topicRevision.revision.clinicalApproval,
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

    const parentRevisionIdsOfActiveFacts = new Set(
      workspace.structuredFacts
        .filter((fact) => fact.revision.workflowState !== "archived")
        .map((fact) => fact.revision.parentRevisionId)
        .filter((revisionId): revisionId is string => revisionId !== null),
    );
    const currentFactRevisions = workspace.structuredFacts.filter(
      (fact) =>
        fact.revision.workflowState !== "archived" &&
        !parentRevisionIdsOfActiveFacts.has(fact.revision.revisionId),
    );
    const historicalUnresolvedFactIdsByGroup = new Map<
      string,
      Set<string>
    >();
    const currentUnresolvedFactIdsByGroup = new Map<string, Set<string>>();
    workspace.structuredFacts.forEach((fact, index) => {
      if (!topicRevisionById.has(fact.topicRevisionId)) {
        context.addIssue({
          code: "custom",
          message: `Fact references unknown topic revision: ${fact.topicRevisionId}`,
          path: ["structuredFacts", index, "topicRevisionId"],
        });
      }
      if (!factTypeIds.has(fact.factTypeId)) {
        context.addIssue({
          code: "custom",
          message: `Fact references unknown fact type: ${fact.factTypeId}`,
          path: ["structuredFacts", index, "factTypeId"],
        });
      }
      if (
        fact.value.kind === "distribution" &&
        !distributionTypeIds.has(fact.value.distributionTypeId)
      ) {
        context.addIssue({
          code: "custom",
          message: `Fact references unknown distribution type: ${fact.value.distributionTypeId}`,
          path: [
            "structuredFacts",
            index,
            "value",
            "distributionTypeId",
          ],
        });
      }
      validateCitationLinks(
        fact.citationIds,
        "structured_fact",
        fact.revision.revisionId,
        ["structuredFacts", index, "citationIds"],
      );
      validateApprovedCitations(
        fact.revision.clinicalApproval,
        fact.citationIds,
        ["structuredFacts", index, "citationIds"],
      );
      if (
        fact.conflict.state === "unresolved" &&
        fact.conflict.conflictGroupId !== null
      ) {
        const factIds =
          historicalUnresolvedFactIdsByGroup.get(
            fact.conflict.conflictGroupId,
          ) ?? new Set<string>();
        factIds.add(fact.id);
        historicalUnresolvedFactIdsByGroup.set(
          fact.conflict.conflictGroupId,
          factIds,
        );
      }
    });
    currentFactRevisions.forEach((fact) => {
      if (
        fact.conflict.state === "unresolved" &&
        fact.conflict.conflictGroupId !== null
      ) {
        const factIds =
          currentUnresolvedFactIdsByGroup.get(
            fact.conflict.conflictGroupId,
          ) ??
          new Set<string>();
        factIds.add(fact.id);
        currentUnresolvedFactIdsByGroup.set(
          fact.conflict.conflictGroupId,
          factIds,
        );
      }
    });
    for (const [groupId, factIds] of currentUnresolvedFactIdsByGroup) {
      if (factIds.size < 2) {
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
      concept.relatedTopics.forEach((relationship, topicIndex) => {
        if (!topicIds.has(relationship.topicId)) {
          context.addIssue({
            code: "custom",
            message: `Concept references unknown related topic: ${relationship.topicId}`,
            path: ["concepts", index, "relatedTopics", topicIndex, "topicId"],
          });
        }
        if (
          !conceptTopicRelationshipIds.has(
            relationship.relationshipTypeId,
          )
        ) {
          context.addIssue({
            code: "custom",
            message: `Concept references unknown topic-link type: ${relationship.relationshipTypeId}`,
            path: [
              "concepts",
              index,
              "relatedTopics",
              topicIndex,
              "relationshipTypeId",
            ],
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
        concept.revision.clinicalApproval,
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
        item.revision.clinicalApproval,
        item.citationIds,
        ["practiceInbox", index, "citationIds"],
      );
      const hasExactCaptureCitation = item.citationIds.some((citationId) => {
        const citation = citationById.get(citationId);
        return (
          citation !== undefined &&
          citation.sourceSnapshotId === item.sourceSnapshotId &&
          citation.locator.kind === item.sourceLocator.kind &&
          citation.locator.label === item.sourceLocator.label &&
          citation.locator.secondaryLabel ===
            item.sourceLocator.secondaryLabel &&
          (citation.usageKind === "project_paraphrase" ||
            citation.usageKind === "synthetic_content")
        );
      });
      if (!hasExactCaptureCitation) {
        context.addIssue({
          code: "custom",
          message:
            "A Practice Question Inbox item must cite its exact captured Source Snapshot and locator.",
          path: ["practiceInbox", index, "citationIds"],
        });
      }

      const snapshot = sourceSnapshotById.get(item.sourceSnapshotId);
      const source =
        snapshot === undefined ? undefined : sourceById.get(snapshot.sourceId);
      if (
        snapshot !== undefined &&
        Date.parse(item.revision.createdAt) < Date.parse(snapshot.retrievedAt)
      ) {
        context.addIssue({
          code: "custom",
          message:
            "A Practice Question Inbox capture cannot predate its exact Source Snapshot.",
          path: ["practiceInbox", index, "revision", "createdAt"],
        });
      }
      if (
        source !== undefined &&
        !source.rightsReview.localProcessingPermitted
      ) {
        context.addIssue({
          code: "custom",
          message:
            "Practice-question capture requires permission for local processing.",
          path: ["practiceInbox", index, "sourceSnapshotId"],
        });
      }
      if (source !== undefined) {
        validateRightsReviewPredatesUse(
          source,
          item.revision.createdAt,
          ["practiceInbox", index, "revision", "createdAt"],
          "Practice-question capture",
        );
      }
      if (item.aiSuggestions.length > 0) {
        if (
          source !== undefined &&
          !source.rightsReview.externalAiTransferPermitted
        ) {
          context.addIssue({
            code: "custom",
            message:
              "AI suggestions are prohibited because this Source is not approved for external AI transfer.",
            path: ["practiceInbox", index, "aiSuggestions"],
          });
        }
      }

      item.aiSuggestions.forEach((suggestion, suggestionIndex) => {
        if (
          Date.parse(suggestion.envelope.createdAt) <
          Date.parse(item.revision.createdAt)
        ) {
          context.addIssue({
            code: "custom",
            message:
              "An AI suggestion cannot predate the Practice Question Inbox revision it analyzes.",
            path: [
              "practiceInbox",
              index,
              "aiSuggestions",
              suggestionIndex,
              "envelope",
              "createdAt",
            ],
          });
        }
        if (source !== undefined) {
          validateRightsReviewPredatesUse(
            source,
            suggestion.envelope.createdAt,
            [
              "practiceInbox",
              index,
              "aiSuggestions",
              suggestionIndex,
              "envelope",
              "createdAt",
            ],
            "AI suggestion creation",
          );
        }
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

    const topicCoverageMappingById = new Map(
      workspace.topicCoverageMappings.map((mapping) => [
        mapping.id,
        mapping,
      ]),
    );
    const outputByKind = {
      topic_revision: topicRevisionById,
      structured_fact: factRevisionById,
      tested_concept: conceptRevisionById,
      coverage_framework_node: coverageNodeById,
      topic_coverage_mapping: topicCoverageMappingById,
      practice_inbox_item: practiceRevisionById,
    } as const;
    const extractionBatchById = new Map(
      workspace.extractionBatches.map((batch) => [batch.id, batch]),
    );

    const revisionOutputs = [
      {
        kind: "topic_revision" as const,
        values: workspace.topicRevisions,
        path: "topicRevisions",
      },
      {
        kind: "structured_fact" as const,
        values: workspace.structuredFacts,
        path: "structuredFacts",
      },
      {
        kind: "tested_concept" as const,
        values: workspace.concepts,
        path: "concepts",
      },
      {
        kind: "practice_inbox_item" as const,
        values: workspace.practiceInbox,
        path: "practiceInbox",
      },
    ];
    revisionOutputs.forEach(({ kind, values, path }) => {
      values.forEach((value, index) => {
        const provenance = value.revision.provenance;
        if (provenance.kind === "manual") {
          return;
        }

        const batch = extractionBatchById.get(provenance.reference);
        if (!batch) {
          context.addIssue({
            code: "custom",
            message:
              "A non-manual revision must reference its exact extraction batch.",
            path: [path, index, "revision", "provenance", "reference"],
          });
        } else {
          if (batch.processingMethod !== provenance.kind) {
            context.addIssue({
              code: "custom",
              message:
                "Revision provenance must match the extraction batch processing method.",
              path: [path, index, "revision", "provenance", "kind"],
            });
          }
          const batchListsRevision = batch.outputReferences.some(
            (reference) =>
              reference.kind === kind &&
              reference.id === value.revision.revisionId,
          );
          if (!batchListsRevision) {
            context.addIssue({
              code: "custom",
              message:
                "The referenced extraction batch must list this exact revision as an output.",
              path: [path, index, "revision", "provenance", "reference"],
            });
          }
        }

        if (
          provenance.kind === "ai_assisted" &&
          value.revision.workflowState !== "draft"
        ) {
          context.addIssue({
            code: "custom",
            message:
              "An AI-assisted revision must remain Draft; human acceptance creates a new reviewed revision.",
            path: [path, index, "revision", "workflowState"],
          });
        }
      });
    });

    workspace.extractionBatches.forEach((batch, index) => {
      if (!sourceSnapshotIds.has(batch.sourceSnapshotId)) {
        context.addIssue({
          code: "custom",
          message: `Extraction batch references unknown Source Snapshot: ${batch.sourceSnapshotId}`,
          path: ["extractionBatches", index, "sourceSnapshotId"],
        });
      }
      if (batch.processingMethod === "ai_assisted") {
        const snapshot = sourceSnapshotById.get(batch.sourceSnapshotId);
        const source =
          snapshot === undefined ? undefined : sourceById.get(snapshot.sourceId);
        if (
          source !== undefined &&
          !source.rightsReview.externalAiTransferPermitted
        ) {
          context.addIssue({
            code: "custom",
            message:
              "AI-assisted extraction is prohibited because this Source is not approved for external AI transfer.",
            path: ["extractionBatches", index, "processingMethod"],
          });
        }
      }
      const extractionSnapshot = sourceSnapshotById.get(
        batch.sourceSnapshotId,
      );
      const extractionSource =
        extractionSnapshot === undefined
          ? undefined
          : sourceById.get(extractionSnapshot.sourceId);
      if (
        extractionSource !== undefined &&
        !extractionSource.rightsReview.localProcessingPermitted
      ) {
        context.addIssue({
          code: "custom",
          message:
            "Source extraction requires permission for local processing.",
          path: ["extractionBatches", index, "sourceSnapshotId"],
        });
      }
      if (
        extractionSource !== undefined &&
        batch.startedAt !== null
      ) {
        validateRightsReviewPredatesUse(
          extractionSource,
          batch.startedAt,
          ["extractionBatches", index, "startedAt"],
          "Source extraction",
        );
      }
      if (
        extractionSnapshot !== undefined &&
        batch.startedAt !== null &&
        Date.parse(batch.startedAt) <
          Date.parse(extractionSnapshot.retrievedAt)
      ) {
        context.addIssue({
          code: "custom",
          message:
            "A Source extraction batch cannot start before its exact Source Snapshot was retrieved.",
          path: ["extractionBatches", index, "startedAt"],
        });
      }
      if (
        extractionSnapshot !== undefined &&
        Date.parse(batch.updatedAt) <
          Date.parse(extractionSnapshot.retrievedAt)
      ) {
        context.addIssue({
          code: "custom",
          message:
            "An extraction-batch record cannot predate its exact Source Snapshot.",
          path: ["extractionBatches", index, "updatedAt"],
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
          reference.kind === "coverage_framework_node" ||
          reference.kind === "topic_coverage_mapping"
        ) {
          context.addIssue({
            code: "custom",
            message:
              "The beta cannot list Coverage Framework Nodes or Topic Coverage Mappings as extraction outputs because they do not yet carry exact import provenance.",
            path: [
              "extractionBatches",
              index,
              "outputReferences",
              referenceIndex,
            ],
          });
          return;
        }

        if (batch.startedAt !== null) {
          const outputWindowEnd = batch.completedAt ?? batch.updatedAt;
          let outputTimestamp: string | null = null;
          if ("revision" in output) {
            outputTimestamp = output.revision.createdAt;
          }
          if (
            outputTimestamp !== null &&
            (Date.parse(outputTimestamp) < Date.parse(batch.startedAt) ||
              Date.parse(outputTimestamp) > Date.parse(outputWindowEnd))
          ) {
            context.addIssue({
              code: "custom",
              message:
                "An extraction output must be created within its batch start and completion/update window.",
              path: [
                "extractionBatches",
                index,
                "outputReferences",
                referenceIndex,
              ],
            });
          }
        }

        let outputCitationIds: readonly string[];
        switch (reference.kind) {
          case "topic_revision":
            outputCitationIds = topicRevisionById
              .get(reference.id)!
              .sections.flatMap((section) => section.citationIds);
            break;
          case "structured_fact":
            outputCitationIds =
              factRevisionById.get(reference.id)!.citationIds;
            break;
          case "tested_concept":
            outputCitationIds =
              conceptRevisionById.get(reference.id)!.citationIds;
            break;
          case "practice_inbox_item":
            outputCitationIds =
              practiceRevisionById.get(reference.id)!.citationIds;
            break;
        }
        const citesBatchSnapshot = outputCitationIds.some(
          (citationId) =>
            citationById.get(citationId)?.sourceSnapshotId ===
            batch.sourceSnapshotId,
        );
        if (!citesBatchSnapshot) {
          context.addIssue({
            code: "custom",
            message:
              "An extraction output must cite the exact Source Snapshot processed by its batch.",
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
        const historicalFactIds =
          historicalUnresolvedFactIdsByGroup.get(groupId);
        if (historicalFactIds === undefined || historicalFactIds.size < 2) {
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
        const groupAppearsInOutput = batch.outputReferences.some(
          (reference) => {
            if (reference.kind !== "structured_fact") {
              return false;
            }
            const fact = factRevisionById.get(reference.id);
            return (
              fact?.conflict.state === "unresolved" &&
              fact.conflict.conflictGroupId === groupId
            );
          },
        );
        if (!groupAppearsInOutput) {
          context.addIssue({
            code: "custom",
            message:
              "A batch conflict snapshot must be represented by at least one Structured Fact revision emitted by that batch.",
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
    const sourceById = new Map(
      workspace.sources.map((source) => [source.id, source]),
    );
    const sourceSnapshotById = new Map(
      workspace.sourceSnapshots.map((snapshot) => [snapshot.id, snapshot]),
    );

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
      const identifierScheme =
        identifier?.match(/^([a-z][a-z0-9+.-]*):/i)?.[1]?.toLowerCase() ??
        null;
      const allowedOpaqueIdentifierSchemes = new Set([
        "doi",
        "isbn",
        "issn",
        "pmid",
      ]);
      if (
        identifier !== null &&
        identifierScheme !== null &&
        identifierScheme !== "http" &&
        identifierScheme !== "https" &&
        !allowedOpaqueIdentifierSchemes.has(identifierScheme)
      ) {
        context.addIssue({
          code: "custom",
          message:
            "A public Source identifier must use HTTP(S), an approved DOI/ISBN/ISSN/PMID identifier scheme, or no URI scheme.",
          path: ["sources", index, "canonicalUrlOrIdentifier"],
        });
      } else if (
        identifier !== null &&
        identifierScheme !== null &&
        allowedOpaqueIdentifierSchemes.has(identifierScheme) &&
        /[?#]/.test(identifier)
      ) {
        context.addIssue({
          code: "custom",
          message:
            "A public opaque Source identifier cannot contain a query or fragment.",
          path: ["sources", index, "canonicalUrlOrIdentifier"],
        });
      } else if (
        identifier !== null &&
        (identifierScheme === "http" || identifierScheme === "https")
      ) {
        let url: URL;
        try {
          url = new URL(identifier);
        } catch {
          context.addIssue({
            code: "custom",
            message: "A public Source URL must be a valid HTTP(S) URL.",
            path: ["sources", index, "canonicalUrlOrIdentifier"],
          });
          return;
        }
        if (
          url.username ||
          url.password ||
          url.search.length > 0 ||
          url.hash.length > 0
        ) {
          context.addIssue({
            code: "custom",
            message:
              "Public Source URLs cannot contain credentials, query tokens, or fragments.",
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
          !["http:", "https:"].includes(url.protocol) ||
          url.username ||
          url.password ||
          url.search.length > 0 ||
          url.hash.length > 0
        ) {
          context.addIssue({
            code: "custom",
            message:
              "Public snapshot URLs must use HTTP(S) and cannot contain credentials, query tokens, or fragments.",
            path: ["sourceSnapshots", index, "retrievedUrl"],
          });
        }
      }
    });

    workspace.citations.forEach((citation, index) => {
      const snapshot = sourceSnapshotById.get(citation.sourceSnapshotId);
      const source =
        snapshot === undefined ? undefined : sourceById.get(snapshot.sourceId);
      if (!source) {
        return;
      }

      if (
        citation.usageKind === "project_paraphrase" &&
        !source.rightsReview.projectParaphrasePublicationPermitted
      ) {
        context.addIssue({
          code: "custom",
          message:
            "A public fixture cannot publish a project paraphrase without explicit Source permission.",
          path: ["citations", index, "usageKind"],
        });
      }
      if (
        (citation.usageKind === "source_excerpt" ||
          citation.usageKind === "synthetic_content") &&
        !source.rightsReview.publicSourceTextReusePermitted
      ) {
        context.addIssue({
          code: "custom",
          message:
            "A public fixture cannot reuse source text without explicit Source permission.",
          path: ["citations", index, "usageKind"],
        });
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
  coverageNodeCount: number;
  topicCoverageMappingCount: number;
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
  const parentRevisionIdsOfActiveFacts = new Set(
    workspace.structuredFacts
      .filter((fact) => fact.revision.workflowState !== "archived")
      .map((fact) => fact.revision.parentRevisionId)
      .filter((revisionId): revisionId is string => revisionId !== null),
  );
  const unresolvedConflictGroupIds = new Set<string>();
  for (const fact of workspace.structuredFacts) {
    if (
      fact.revision.workflowState !== "archived" &&
      !parentRevisionIdsOfActiveFacts.has(fact.revision.revisionId) &&
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
    coverageNodeCount: workspace.coverageFrameworkNodes.length,
    topicCoverageMappingCount: workspace.topicCoverageMappings.length,
    topicCount: workspace.topics.length,
    structuredFactCount: new Set(
      workspace.structuredFacts.map((fact) => fact.id),
    ).size,
    conceptCount: new Set(workspace.concepts.map((concept) => concept.id)).size,
    practiceInboxCount: new Set(
      workspace.practiceInbox.map((item) => item.id),
    ).size,
    extractionBatchCount: workspace.extractionBatches.length,
    unresolvedConflictGroupIds: [...unresolvedConflictGroupIds].sort(),
  };
}
