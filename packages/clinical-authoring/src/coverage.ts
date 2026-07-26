import { z } from "zod";

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

export const coverageEntrySchema = z
  .object({
    id: stableIdSchema,
    frameworkId: stableIdSchema,
    externalCategoryId: z.string().min(1).max(240),
    categoryPath: z.array(z.string().min(1).max(240)).min(1),
    topicId: stableIdSchema.nullable(),
    coverageStatus: z.enum(["missing", "partial", "complete"]),
    sourceCoverageCount: z.number().int().min(0),
    approvedConceptCount: z.number().int().min(0),
    approvedQuestionVariantCount: z.number().int().min(0),
    currentGameEligibility: z.enum([
      "unclassified",
      "eligible",
      "deferred",
      "excluded",
    ]),
    deferredScopeId: stableIdSchema.nullable(),
    citationIds: z.array(stableIdSchema).min(1),
    note: z.string().min(1).max(1_000),
  })
  .strict()
  .superRefine((entry, context) => {
    if (new Set(entry.citationIds).size !== entry.citationIds.length) {
      context.addIssue({
        code: "custom",
        message: "Coverage citation IDs must be unique.",
        path: ["citationIds"],
      });
    }

    if (entry.coverageStatus !== "missing" && entry.topicId === null) {
      context.addIssue({
        code: "custom",
        message: "Partial or complete coverage must identify a Clinical Topic.",
        path: ["topicId"],
      });
    }
    if (
      entry.coverageStatus === "missing" &&
      (entry.sourceCoverageCount !== 0 ||
        entry.approvedConceptCount !== 0 ||
        entry.approvedQuestionVariantCount !== 0)
    ) {
      context.addIssue({
        code: "custom",
        message: "Missing coverage cannot report completed source or content counts.",
        path: ["coverageStatus"],
      });
    }
    if (
      entry.coverageStatus === "complete" &&
      (entry.sourceCoverageCount === 0 ||
        entry.approvedConceptCount === 0 ||
        entry.approvedQuestionVariantCount === 0)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Complete coverage must include source coverage, an approved concept, and an approved question variant.",
        path: ["coverageStatus"],
      });
    }

    const requiresDeferredScope =
      entry.currentGameEligibility === "deferred" ||
      entry.currentGameEligibility === "excluded";
    if (requiresDeferredScope !== (entry.deferredScopeId !== null)) {
      context.addIssue({
        code: "custom",
        message:
          "Deferred or excluded coverage must identify its deferred scope; unclassified or eligible coverage must not.",
        path: ["deferredScopeId"],
      });
    }
  });

export type CoverageFramework = z.infer<typeof coverageFrameworkSchema>;
export type CoverageEntry = z.infer<typeof coverageEntrySchema>;
