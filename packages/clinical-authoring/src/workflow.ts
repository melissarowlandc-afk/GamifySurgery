import { z } from "zod";

import { isoTimestampSchema, stableIdSchema } from "./identifiers.js";

export const workflowStateSchema = z.enum([
  "draft",
  "needs_clinical_review",
  "changes_requested",
  "clinically_approved",
  "archived",
]);

export const provenanceSchema = z
  .object({
    kind: z.enum(["manual", "structured_import", "ai_assisted"]),
    reference: z.string().min(1).max(240),
  })
  .strict();

export const clinicalApprovalSchema = z
  .object({
    reviewerId: stableIdSchema,
    reviewedAt: isoTimestampSchema,
    checklistVersion: stableIdSchema,
  })
  .strict();

export const revisionEnvelopeSchema = z
  .object({
    revisionId: stableIdSchema,
    parentRevisionId: stableIdSchema.nullable(),
    workflowState: workflowStateSchema,
    provenance: provenanceSchema,
    createdAt: isoTimestampSchema,
    changeSummary: z.string().min(1).max(500),
    clinicalApproval: clinicalApprovalSchema.nullable(),
  })
  .strict()
  .superRefine((revision, context) => {
    if (revision.parentRevisionId === revision.revisionId) {
      context.addIssue({
        code: "custom",
        message: "A revision cannot name itself as its parent.",
        path: ["parentRevisionId"],
      });
    }

    if (
      revision.workflowState === "clinically_approved" &&
      revision.clinicalApproval === null
    ) {
      context.addIssue({
        code: "custom",
        message: "A clinically approved revision must carry clinical approval.",
        path: ["clinicalApproval"],
      });
    }

    if (
      revision.workflowState !== "clinically_approved" &&
      revision.workflowState !== "archived" &&
      revision.clinicalApproval !== null
    ) {
      context.addIssue({
        code: "custom",
        message:
          "An active unapproved revision cannot carry clinical approval. Archived revisions may retain prior approval for audit.",
        path: ["clinicalApproval"],
      });
    }

    if (
      revision.clinicalApproval !== null &&
      Date.parse(revision.clinicalApproval.reviewedAt) <
        Date.parse(revision.createdAt)
    ) {
      context.addIssue({
        code: "custom",
        message: "Clinical approval cannot predate revision creation.",
        path: ["clinicalApproval", "reviewedAt"],
      });
    }
  });

/**
 * An AI suggestion is never itself promoted through the clinical workflow.
 * Accepting one creates or edits a separate revision that still undergoes
 * ordinary human review.
 */
export const aiSuggestionEnvelopeSchema = z
  .object({
    suggestionId: stableIdSchema,
    workflowState: z.literal("draft"),
    provenance: z
      .object({
        kind: z.literal("ai_assisted"),
        reference: z.string().min(1).max(240),
      })
      .strict(),
    createdAt: isoTimestampSchema,
  })
  .strict();

export type WorkflowState = z.infer<typeof workflowStateSchema>;
export type RevisionEnvelope = z.infer<typeof revisionEnvelopeSchema>;
export type AiSuggestionEnvelope = z.infer<
  typeof aiSuggestionEnvelopeSchema
>;
