import { z } from "zod";

import { currentGameEligibilitySchema } from "./concept.js";
import { isoTimestampSchema, stableIdSchema } from "./identifiers.js";

export const coverageFrameworkSchema = z
  .object({
    id: stableIdSchema,
    name: z.string().min(1).max(500),
    versionLabel: z.string().min(1).max(160),
    sourceSnapshotId: stableIdSchema,
    recordedAt: isoTimestampSchema,
  })
  .strict();

/**
 * An immutable node copied by reference from one exact official-framework
 * snapshot. Nodes describe the source hierarchy; they do not themselves claim
 * that one project-owned Clinical Topic exists or is complete.
 */
export const coverageFrameworkNodeSchema = z
  .object({
    id: stableIdSchema,
    frameworkId: stableIdSchema,
    externalCategoryId: z.string().min(1).max(240),
    parentNodeId: stableIdSchema.nullable(),
    ordinal: z.number().int().min(0),
    categoryPath: z.array(z.string().min(1).max(240)).min(1),
    sourceDefinedClassificationId: stableIdSchema.nullable(),
    citationIds: z.array(stableIdSchema).min(1),
    note: z.string().min(1).max(1_000),
  })
  .strict()
  .superRefine((node, context) => {
    if (new Set(node.citationIds).size !== node.citationIds.length) {
      context.addIssue({
        code: "custom",
        message: "Coverage-node citation IDs must be unique.",
        path: ["citationIds"],
      });
    }
    if (node.parentNodeId === node.id) {
      context.addIssue({
        code: "custom",
        message: "A coverage node cannot be its own parent.",
        path: ["parentNodeId"],
      });
    }
  });

/**
 * Project-owned many-to-many mapping from one official framework node to one
 * Clinical Topic. Progress counts are derived from authored records instead
 * of being copied into this mutable mapping.
 */
export const topicCoverageMappingSchema = z
  .object({
    id: stableIdSchema,
    coverageNodeId: stableIdSchema,
    topicId: stableIdSchema,
    coverageStatus: z.enum(["missing", "partial", "complete"]),
    currentGameEligibility: currentGameEligibilitySchema,
    deferredScopeId: stableIdSchema.nullable(),
    authorId: stableIdSchema,
    updatedAt: isoTimestampSchema,
    workflowState: z.literal("draft"),
    note: z.string().min(1).max(1_000),
  })
  .strict()
  .superRefine((mapping, context) => {
    const requiresDeferredScope =
      mapping.currentGameEligibility === "deferred" ||
      mapping.currentGameEligibility === "excluded";
    if (requiresDeferredScope !== (mapping.deferredScopeId !== null)) {
      context.addIssue({
        code: "custom",
        message:
          "Deferred or excluded mappings must identify their deferred scope; unclassified or eligible mappings must not.",
        path: ["deferredScopeId"],
      });
    }
  });

export type CoverageFramework = z.infer<typeof coverageFrameworkSchema>;
export type CoverageFrameworkNode = z.infer<
  typeof coverageFrameworkNodeSchema
>;
export type TopicCoverageMapping = z.infer<
  typeof topicCoverageMappingSchema
>;
