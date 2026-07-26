import { z } from "zod";

import { isoTimestampSchema, stableIdSchema } from "./identifiers.js";
import { claimLocatorSchema } from "./source.js";

export const extractionOutputReferenceSchema = z
  .object({
    kind: z.enum([
      "topic_revision",
      "structured_fact",
      "tested_concept",
      "coverage_framework_node",
      "topic_coverage_mapping",
      "practice_inbox_item",
    ]),
    id: stableIdSchema,
  })
  .strict();

export const extractionBatchSchema = z
  .object({
    id: stableIdSchema,
    sourceSnapshotId: stableIdSchema,
    sourceRange: z
      .object({
        start: claimLocatorSchema,
        end: claimLocatorSchema,
      })
      .strict(),
    processingMethod: z.enum(["manual", "structured_import", "ai_assisted"]),
    schemaVersion: z.literal(1),
    extractorVersion: stableIdSchema,
    inputFingerprint: z
      .string()
      .min(16)
      .max(256)
      .regex(/^[a-z0-9._:-]+$/),
    status: z.enum([
      "queued",
      "in_progress",
      "paused",
      "completed",
      "failed",
    ]),
    totalUnits: z.number().int().positive(),
    completedUnits: z.number().int().min(0),
    lastCompletedLocator: claimLocatorSchema.nullable(),
    outputReferences: z.array(extractionOutputReferenceSchema),
    unresolvedConflictGroupIds: z.array(stableIdSchema),
    errors: z.array(z.string().min(1).max(2_000)),
    startedAt: isoTimestampSchema.nullable(),
    updatedAt: isoTimestampSchema,
    completedAt: isoTimestampSchema.nullable(),
    humanReviewState: z.enum([
      "not_started",
      "in_progress",
      "changes_requested",
      "complete",
    ]),
  })
  .strict()
  .superRefine((batch, context) => {
    const outputKeys = batch.outputReferences.map(
      (reference) => `${reference.kind}:${reference.id}`,
    );
    if (new Set(outputKeys).size !== outputKeys.length) {
      context.addIssue({
        code: "custom",
        message: "Extraction output references must be unique.",
        path: ["outputReferences"],
      });
    }
    if (
      new Set(batch.unresolvedConflictGroupIds).size !==
      batch.unresolvedConflictGroupIds.length
    ) {
      context.addIssue({
        code: "custom",
        message: "Unresolved conflict-group IDs must be unique.",
        path: ["unresolvedConflictGroupIds"],
      });
    }

    if (batch.completedUnits > batch.totalUnits) {
      context.addIssue({
        code: "custom",
        message: "Completed units cannot exceed total units.",
        path: ["completedUnits"],
      });
    }

    if (
      batch.status === "queued" &&
      (batch.completedUnits !== 0 ||
        batch.lastCompletedLocator !== null ||
        batch.startedAt !== null ||
        batch.outputReferences.length > 0 ||
        batch.unresolvedConflictGroupIds.length > 0 ||
        batch.errors.length > 0 ||
        batch.humanReviewState !== "not_started")
    ) {
      context.addIssue({
        code: "custom",
        message:
          "A queued batch cannot contain progress, outputs, conflicts, errors, review activity, a checkpoint, or a start time.",
      });
    }

    if (batch.status !== "queued" && batch.startedAt === null) {
      context.addIssue({
        code: "custom",
        message: "A batch that has left the queue must record startedAt.",
        path: ["startedAt"],
      });
    }

    if (batch.completedUnits > 0 && batch.lastCompletedLocator === null) {
      context.addIssue({
        code: "custom",
        message:
          "A resumable batch with completed work must record its last locator.",
        path: ["lastCompletedLocator"],
      });
    }

    if (
      batch.status === "completed" &&
      (batch.completedUnits !== batch.totalUnits ||
        batch.completedAt === null ||
        batch.errors.length > 0)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "A completed batch must finish every unit, record completion time, and have no unresolved errors.",
      });
    }

    if (batch.status !== "completed" && batch.completedAt !== null) {
      context.addIssue({
        code: "custom",
        message: "Only a completed batch may record completedAt.",
        path: ["completedAt"],
      });
    }

    if (
      batch.startedAt !== null &&
      Date.parse(batch.updatedAt) < Date.parse(batch.startedAt)
    ) {
      context.addIssue({
        code: "custom",
        message: "A batch update cannot predate its start.",
        path: ["updatedAt"],
      });
    }

    if (
      batch.completedAt !== null &&
      (batch.startedAt === null ||
        Date.parse(batch.completedAt) < Date.parse(batch.startedAt) ||
        Date.parse(batch.updatedAt) < Date.parse(batch.completedAt))
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Batch completion must follow its start and cannot postdate its latest update.",
        path: ["completedAt"],
      });
    }

    if (
      batch.humanReviewState === "complete" &&
      batch.status !== "completed"
    ) {
      context.addIssue({
        code: "custom",
        message: "Human review cannot be complete before extraction completes.",
        path: ["humanReviewState"],
      });
    }
  });

export type ExtractionBatch = z.infer<typeof extractionBatchSchema>;
