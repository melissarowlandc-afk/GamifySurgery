import { z } from "zod";

import { isoTimestampSchema, stableIdSchema } from "./identifiers.js";

export const sourceTypeSchema = z.enum([
  "official_outline",
  "textbook",
  "guideline",
  "journal_article",
  "reference_website",
  "practice_question_source",
  "owner_notes",
  "synthetic_fixture",
]);

export const sourceRightsReviewSchema = z
  .object({
    status: z.enum([
      "synthetic_or_owner_authored",
      "metadata_only",
      "review_required",
      "documented_permission",
    ]),
    note: z.string().min(1).max(1_000),
    reviewedBy: stableIdSchema,
    reviewedAt: isoTimestampSchema,
    basis: z.string().min(1).max(2_000),
    privateStoragePermitted: z.boolean(),
    localProcessingPermitted: z.boolean(),
    externalAiTransferPermitted: z.boolean(),
    publicSourceTextReusePermitted: z.boolean(),
    projectParaphrasePublicationPermitted: z.boolean(),
  })
  .strict()
  .superRefine((review, context) => {
    if (
      review.status === "review_required" &&
      (review.privateStoragePermitted ||
        review.localProcessingPermitted ||
        review.externalAiTransferPermitted ||
        review.publicSourceTextReusePermitted ||
        review.projectParaphrasePublicationPermitted)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "An unresolved rights review is default-deny for every source use.",
      });
    }
  });

export const sourceSchema = z
  .object({
    id: stableIdSchema,
    title: z.string().min(1).max(500),
    sourceType: sourceTypeSchema,
    edition: z.string().min(1).max(120).nullable(),
    publicationYear: z.number().int().min(1800).max(2200).nullable(),
    publisherOrOrganization: z.string().min(1).max(240).nullable(),
    canonicalUrlOrIdentifier: z
      .string()
      .min(1)
      .max(1_000)
      .refine(
        (value) => value === value.trim(),
        "A Source URL or identifier cannot contain leading or trailing whitespace.",
      )
      .nullable(),
    scopeNote: z.string().min(1).max(1_000),
    rightsReview: sourceRightsReviewSchema,
  })
  .strict();

/**
 * A Source is the stable bibliographic identity; a Source Snapshot is the
 * exact retrieved artifact that supported a claim. Versionless URLs can
 * therefore change without rewriting historical provenance.
 */
export const sourceSnapshotSchema = z
  .object({
    id: stableIdSchema,
    sourceId: stableIdSchema,
    formatId: stableIdSchema,
    accessScope: z.enum([
      "public_web",
      "authenticated_private",
      "owner_local",
      "metadata_only",
      "synthetic_fixture",
    ]),
    retrievedUrl: z.string().url().max(2_000).nullable(),
    retrievedAt: isoTimestampSchema,
    upstreamLastModified: isoTimestampSchema.nullable(),
    sha256: z
      .string()
      .regex(/^[a-f0-9]{64}$/, "Use a lowercase hexadecimal SHA-256.")
      .nullable(),
  })
  .strict()
  .superRefine((snapshot, context) => {
    if (
      snapshot.accessScope === "public_web" &&
      snapshot.retrievedUrl === null
    ) {
      context.addIssue({
        code: "custom",
        message: "A public-web snapshot must record its retrieved URL.",
        path: ["retrievedUrl"],
      });
    }
    if (
      snapshot.accessScope === "public_web" &&
      snapshot.retrievedUrl !== null &&
      !["http:", "https:"].includes(new URL(snapshot.retrievedUrl).protocol)
    ) {
      context.addIssue({
        code: "custom",
        message: "A public-web snapshot must use an HTTP(S) retrieval URL.",
        path: ["retrievedUrl"],
      });
    }
    if (
      snapshot.accessScope !== "metadata_only" &&
      snapshot.accessScope !== "synthetic_fixture" &&
      snapshot.sha256 === null
    ) {
      context.addIssue({
        code: "custom",
        message:
          "A retrieved source artifact must record its SHA-256 checksum.",
        path: ["sha256"],
      });
    }
    if (
      snapshot.upstreamLastModified !== null &&
      Date.parse(snapshot.upstreamLastModified) >
        Date.parse(snapshot.retrievedAt)
    ) {
      context.addIssue({
        code: "custom",
        message: "Upstream modification cannot postdate retrieval.",
        path: ["upstreamLastModified"],
      });
    }
  });

export const claimLocatorSchema = z
  .object({
    kind: z.enum([
      "chapter",
      "section",
      "page",
      "paragraph",
      "figure",
      "table",
      "question_reference",
      "owner_note",
      "synthetic_marker",
    ]),
    label: z.string().min(1).max(240),
    secondaryLabel: z.string().min(1).max(240).nullable(),
  })
  .strict();

export const citationTargetKindSchema = z.enum([
  "topic_section",
  "structured_fact",
  "tested_concept",
  "coverage_framework_node",
  "practice_inbox_item",
]);

export const citationUsageKindSchema = z.enum([
  "bibliographic_metadata",
  "project_paraphrase",
  "source_excerpt",
  "synthetic_content",
]);

export const citationSchema = z
  .object({
    id: stableIdSchema,
    sourceSnapshotId: stableIdSchema,
    targetKind: citationTargetKindSchema,
    targetId: stableIdSchema,
    locator: claimLocatorSchema,
    supportedClaim: z.string().min(1).max(1_000),
    usageKind: citationUsageKindSchema,
    verificationState: z.enum([
      "unverified",
      "human_verified",
      "conflict_identified",
    ]),
    verificationReviewerId: stableIdSchema.nullable(),
    verificationRecordedAt: isoTimestampSchema.nullable(),
    recordedAt: isoTimestampSchema,
  })
  .strict()
  .superRefine((citation, context) => {
    const requiresVerificationAudit =
      citation.verificationState !== "unverified";
    if (
      requiresVerificationAudit !==
      (citation.verificationReviewerId !== null &&
        citation.verificationRecordedAt !== null)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Verified or conflict-identified Citations require a reviewer and verification time; unverified Citations must not carry them.",
        path: ["verificationReviewerId"],
      });
    }
    if (
      citation.verificationRecordedAt !== null &&
      Date.parse(citation.verificationRecordedAt) <
        Date.parse(citation.recordedAt)
    ) {
      context.addIssue({
        code: "custom",
        message: "Citation verification cannot predate Citation creation.",
        path: ["verificationRecordedAt"],
      });
    }
  });

export type Source = z.infer<typeof sourceSchema>;
export type SourceRightsReview = z.infer<typeof sourceRightsReviewSchema>;
export type SourceSnapshot = z.infer<typeof sourceSnapshotSchema>;
export type ClaimLocator = z.infer<typeof claimLocatorSchema>;
export type CitationUsageKind = z.infer<typeof citationUsageKindSchema>;
export type Citation = z.infer<typeof citationSchema>;
