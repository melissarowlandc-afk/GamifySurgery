import { z } from "zod";

import {
  isoTimestampSchema,
  nonBlankTextSchema,
  stableIdSchema,
} from "./identifiers.js";

export const sourceTypeSchema = z.enum([
  "official_outline",
  "clinical_guideline",
  "systematic_review",
  "meta_analysis",
  "journal_article",
  "regulatory_document",
  "classification_standard",
  "structured_database",
  "book_chapter",
  "professional_guidance",
  "reference_website",
  "owner_notes",
  "other",
]);

export const clinicalTargetKindSchema = z.enum([
  "clinical_topic_revision",
  "topic_section",
  "structured_fact",
  "tested_concept",
  "patient_variant",
  "question_variant",
  "clinical_release",
  "other",
]);

export const clinicalTargetReferenceSchema = z
  .object({
    kind: clinicalTargetKindSchema,
    id: stableIdSchema,
  })
  .strict();

/**
 * These records point to source, citation, content, and approval records owned
 * by other packages. The research workspace never treats one category as
 * another and never becomes the authority that clinically approves content.
 */
export const externalSourceReferenceSchema = z
  .object({
    id: stableIdSchema,
  })
  .strict();

export const externalCitationReferenceSchema = z
  .object({
    id: stableIdSchema,
    sourceId: stableIdSchema,
    sourceSnapshotId: stableIdSchema,
    verificationState: z.enum([
      "unverified",
      "human_verified",
      "conflict_identified",
    ]),
    verifiedBy: stableIdSchema.nullable(),
    verifiedAt: isoTimestampSchema.nullable(),
  })
  .strict()
  .superRefine((citation, context) => {
    const verified = citation.verificationState !== "unverified";
    if (
      verified !==
      (citation.verifiedBy !== null && citation.verifiedAt !== null)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Verified or conflict-identified citations require a verifier and verification time; unverified citations must not carry them.",
        path: ["verifiedBy"],
      });
    }
  });

export const citationVerificationSignalSchema = z
  .object({
    id: stableIdSchema,
    citationId: stableIdSchema,
    supersedesSignalId: stableIdSchema.nullable(),
    verificationState: z.enum([
      "human_verified",
      "conflict_identified",
    ]),
    verifiedBy: stableIdSchema,
    verifiedAt: isoTimestampSchema,
    recordedAt: isoTimestampSchema,
  })
  .strict()
  .superRefine((signal, context) => {
    if (Date.parse(signal.verifiedAt) > Date.parse(signal.recordedAt)) {
      context.addIssue({
        code: "custom",
        message:
          "A Citation verification signal cannot be recorded before its verification event.",
        path: ["recordedAt"],
      });
    }
  });

export const externalClinicalApprovalReferenceSchema = z
  .object({
    id: stableIdSchema,
    targetRevisionId: stableIdSchema,
    reviewedAt: isoTimestampSchema,
  })
  .strict();

export const externalReferenceIndexSchema = z
  .object({
    sources: z.array(externalSourceReferenceSchema),
    citations: z.array(externalCitationReferenceSchema),
    clinicalTargets: z.array(clinicalTargetReferenceSchema),
    clinicalApprovals: z.array(externalClinicalApprovalReferenceSchema),
  })
  .strict();

export const scoutProviderStrategySchema = z
  .object({
    provider: z.enum([
      "pubmed",
      "crossref",
      "clinical_trials",
      "guideline_registry",
      "manual_other",
    ]),
    query: nonBlankTextSchema(4_000),
    filters: z.array(nonBlankTextSchema(500)),
  })
  .strict();

export const scoutPolicySchema = z
  .object({
    mode: z.enum([
      "manual_only",
      "metadata_search",
      "rights_gated_full_text",
    ]),
    preferredSourceTypes: z.array(sourceTypeSchema).min(1),
    preferredJurisdictions: z.array(nonBlankTextSchema(160)),
    preferredPopulations: z.array(nonBlankTextSchema(240)),
    preferredSettings: z.array(nonBlankTextSchema(240)),
    providerStrategies: z.array(scoutProviderStrategySchema),
    publicationYearFloor: z.number().int().min(1800).max(2200).nullable(),
    includePreprints: z.boolean(),
    maximumCandidates: z.number().int().positive().max(1_000),
    refreshIntervalDays: z.number().int().min(1).max(3_650).nullable(),
    requireHumanScreening: z.literal(true),
    requireRightsDecisionBeforeFullText: z.literal(true),
  })
  .strict()
  .superRefine((policy, context) => {
    const automatic = policy.mode !== "manual_only";
    if (
      (automatic &&
        (policy.providerStrategies.length === 0 ||
          policy.refreshIntervalDays === null)) ||
      (!automatic &&
        (policy.providerStrategies.length > 0 ||
          policy.refreshIntervalDays !== null))
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Metadata and rights-gated scouting require literal provider strategies and a refresh cadence; manual-only scouting requires neither.",
      });
    }
  });

export const evidenceGapSchema = z
  .object({
    id: stableIdSchema,
    createdAt: isoTimestampSchema,
    createdBy: stableIdSchema,
  })
  .strict();

export const evidenceGapRevisionSchema = z
  .object({
    revisionId: stableIdSchema,
    gapId: stableIdSchema,
    supersedesRevisionId: stableIdSchema.nullable(),
    title: nonBlankTextSchema(240),
    clinicalQuestion: nonBlankTextSchema(2_000),
    whyNeeded: nonBlankTextSchema(2_000),
    targetContent: z.array(clinicalTargetReferenceSchema).min(1),
    acceptanceCriteria: z.array(nonBlankTextSchema(800)).min(1),
    scoutPolicy: scoutPolicySchema,
    status: z.enum([
      "open",
      "scouting",
      "candidates_found",
      "awaiting_review",
      "resolved",
      "deferred",
      "withdrawn",
    ]),
    resolutionNote: nonBlankTextSchema(2_000).nullable(),
    recordedAt: isoTimestampSchema,
    recordedBy: stableIdSchema,
    changeSummary: nonBlankTextSchema(500),
  })
  .strict()
  .superRefine((revision, context) => {
    const final = ["resolved", "deferred", "withdrawn"].includes(
      revision.status,
    );
    if (final !== (revision.resolutionNote !== null)) {
      context.addIssue({
        code: "custom",
        message:
          "Resolved, deferred, or withdrawn gaps require a resolution note; active gaps must not carry one.",
        path: ["resolutionNote"],
      });
    }
  });

export const sourceRelationSchema = z
  .object({
    id: stableIdSchema,
    fromSourceId: stableIdSchema,
    toSourceId: stableIdSchema,
    relationType: z.enum([
      "corrects",
      "retracts",
      "supersedes",
      "updates",
      "companion_to",
      "executive_summary_of",
      "translation_of",
    ]),
    relationStatus: z.enum(["active", "withdrawn"]),
    supersedesRelationId: stableIdSchema.nullable(),
    note: nonBlankTextSchema(1_200),
    recordedAt: isoTimestampSchema,
    recordedBy: stableIdSchema,
  })
  .strict()
  .superRefine((relation, context) => {
    if (relation.fromSourceId === relation.toSourceId) {
      context.addIssue({
        code: "custom",
        message: "A Source Relation cannot relate a Source to itself.",
        path: ["toSourceId"],
      });
    }
    if (
      relation.relationStatus === "withdrawn" &&
      relation.supersedesRelationId === null
    ) {
      context.addIssue({
        code: "custom",
        message: "Withdrawing a Source Relation must supersede an earlier record.",
        path: ["supersedesRelationId"],
      });
    }
  });

export const sourceRightsPermissionsSchema = z
  .object({
    bibliographicMetadata: z.boolean(),
    privateStorage: z.boolean(),
    localTextExtraction: z.boolean(),
    localStructuredIndexing: z.boolean(),
    externalAiProcessing: z.boolean(),
    derivedClinicalContent: z.boolean(),
    projectParaphrasePublication: z.boolean(),
    publicSourceTextReuse: z.boolean(),
    runtimeRedistribution: z.boolean(),
    commercialDistribution: z.boolean(),
  })
  .strict();

export const denyAllSourceRights = Object.freeze({
  bibliographicMetadata: false,
  privateStorage: false,
  localTextExtraction: false,
  localStructuredIndexing: false,
  externalAiProcessing: false,
  derivedClinicalContent: false,
  projectParaphrasePublication: false,
  publicSourceTextReuse: false,
  runtimeRedistribution: false,
  commercialDistribution: false,
});

export const fairUseAssessmentSchema = z
  .object({
    preciseUse: nonBlankTextSchema(1_600),
    purposeAndCharacter: nonBlankTextSchema(2_000),
    natureOfWork: nonBlankTextSchema(2_000),
    amountAndSubstantiality: nonBlankTextSchema(2_000),
    marketEffect: nonBlankTextSchema(2_000),
    conclusion: z.enum([
      "proceed_narrowly",
      "do_not_proceed",
      "seek_legal_review",
    ]),
  })
  .strict();

export const sourceRightsDecisionSchema = z
  .object({
    id: stableIdSchema,
    sourceId: stableIdSchema,
    supersedesDecisionId: stableIdSchema.nullable(),
    decisionStatus: z.enum([
      "default_deny",
      "permitted_with_conditions",
      "metadata_only",
      "blocked",
      "revoked",
    ]),
    legalBasis: z.enum([
      "unreviewed",
      "owner_authored",
      "public_domain",
      "open_license",
      "written_permission",
      "fair_use",
      "metadata_only",
    ]),
    permissions: sourceRightsPermissionsSchema,
    territories: z.array(nonBlankTextSchema(160)).min(1),
    licenseLabel: nonBlankTextSchema(240).nullable(),
    licenseUrl: z.string().url().max(2_000).nullable(),
    termsUrl: z.string().url().max(2_000).nullable(),
    attributionStatement: nonBlankTextSchema(1_600).nullable(),
    requiredNotices: z.array(nonBlankTextSchema(1_200)),
    nonCommercialOnly: z.boolean(),
    shareAlikeRequired: z.boolean(),
    thirdPartyMaterialPolicy: z.enum([
      "excluded",
      "item_level_review_required",
      "included_by_permission",
      "not_applicable",
    ]),
    fairUseAssessment: fairUseAssessmentSchema.nullable(),
    permissionEvidenceReferenceIds: z.array(stableIdSchema),
    reviewBasis: z.enum([
      "owner_attestation",
      "engineering_risk_assessment",
      "legal_counsel",
    ]),
    reviewedBy: stableIdSchema,
    reviewedAt: isoTimestampSchema,
    effectiveAt: isoTimestampSchema,
    expiresAt: isoTimestampSchema.nullable(),
    recordedAt: isoTimestampSchema,
    notes: nonBlankTextSchema(3_000),
  })
  .strict()
  .superRefine((decision, context) => {
    const entries = Object.entries(decision.permissions);
    const substantive = entries
      .filter(([name]) => name !== "bibliographicMetadata")
      .some(([, allowed]) => allowed);
    const denySubstantive = [
      "default_deny",
      "metadata_only",
      "blocked",
      "revoked",
    ].includes(decision.decisionStatus);

    if (denySubstantive && substantive) {
      context.addIssue({
        code: "custom",
        message:
          "Default-deny, metadata-only, blocked, and revoked decisions cannot grant substantive permissions.",
        path: ["permissions"],
      });
    }
    if (
      decision.decisionStatus === "default_deny" &&
      entries.some(([, allowed]) => allowed)
    ) {
      context.addIssue({
        code: "custom",
        message: "A default-deny decision must deny every permission.",
        path: ["permissions"],
      });
    }
    if (
      decision.decisionStatus === "metadata_only" &&
      !decision.permissions.bibliographicMetadata
    ) {
      context.addIssue({
        code: "custom",
        message: "A metadata-only decision must permit bibliographic metadata.",
        path: ["permissions", "bibliographicMetadata"],
      });
    }
    if (
      decision.decisionStatus === "permitted_with_conditions" &&
      !substantive
    ) {
      context.addIssue({
        code: "custom",
        message:
          "A permitted-with-conditions decision must grant at least one substantive permission.",
        path: ["permissions"],
      });
    }
    if (
      decision.permissions.localStructuredIndexing &&
      !decision.permissions.localTextExtraction
    ) {
      context.addIssue({
        code: "custom",
        message: "Structured indexing requires text-extraction permission.",
        path: ["permissions", "localStructuredIndexing"],
      });
    }
    if (
      decision.permissions.projectParaphrasePublication &&
      !decision.permissions.derivedClinicalContent
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Publishing a project paraphrase requires permission to derive clinical content.",
        path: ["permissions", "projectParaphrasePublication"],
      });
    }
    if (
      decision.permissions.publicSourceTextReuse &&
      !decision.permissions.runtimeRedistribution
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Public source-text reuse requires runtime-redistribution permission.",
        path: ["permissions", "publicSourceTextReuse"],
      });
    }
    if (
      decision.permissions.commercialDistribution &&
      (!decision.permissions.runtimeRedistribution ||
        decision.nonCommercialOnly)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Commercial distribution requires runtime redistribution and cannot be NonCommercial-only.",
        path: ["permissions", "commercialDistribution"],
      });
    }
    if (
      decision.legalBasis === "open_license" &&
      (decision.licenseLabel === null ||
        decision.licenseUrl === null ||
        decision.attributionStatement === null)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Open-license decisions require a license label, license URL, and attribution statement.",
      });
    }
    if (
      decision.legalBasis === "written_permission" &&
      decision.permissionEvidenceReferenceIds.length === 0
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Written permission requires at least one permission-evidence reference.",
        path: ["permissionEvidenceReferenceIds"],
      });
    }
    if (
      decision.legalBasis === "fair_use" &&
      decision.fairUseAssessment === null
    ) {
      context.addIssue({
        code: "custom",
        message: "Fair-use decisions require a recorded four-factor assessment.",
        path: ["fairUseAssessment"],
      });
    }
    if (
      decision.legalBasis !== "fair_use" &&
      decision.fairUseAssessment !== null
    ) {
      context.addIssue({
        code: "custom",
        message: "A fair-use assessment belongs only to a fair-use decision.",
        path: ["fairUseAssessment"],
      });
    }
    if (
      decision.legalBasis === "fair_use" &&
      decision.decisionStatus === "permitted_with_conditions" &&
      decision.fairUseAssessment?.conclusion !== "proceed_narrowly"
    ) {
      context.addIssue({
        code: "custom",
        message:
          "A fair-use decision can permit use only after a proceed-narrowly conclusion.",
        path: ["fairUseAssessment", "conclusion"],
      });
    }
    if (
      ["unreviewed", "metadata_only"].includes(decision.legalBasis) &&
      decision.decisionStatus === "permitted_with_conditions"
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Unreviewed or metadata-only status cannot justify substantive use.",
        path: ["legalBasis"],
      });
    }
    if (Date.parse(decision.reviewedAt) > Date.parse(decision.recordedAt)) {
      context.addIssue({
        code: "custom",
        message: "A rights decision cannot be recorded before its review.",
        path: ["recordedAt"],
      });
    }
    if (
      decision.expiresAt !== null &&
      Date.parse(decision.expiresAt) <= Date.parse(decision.effectiveAt)
    ) {
      context.addIssue({
        code: "custom",
        message: "A rights decision must expire after it becomes effective.",
        path: ["expiresAt"],
      });
    }
  });

export const searchQuerySchema = z
  .object({
    databaseOrRegistry: nonBlankTextSchema(240),
    query: nonBlankTextSchema(4_000),
    filters: z.array(nonBlankTextSchema(500)),
  })
  .strict();

export const evidenceSearchRunSchema = z
  .object({
    id: stableIdSchema,
    gapRevisionIds: z.array(stableIdSchema).min(1),
    strategyVersion: stableIdSchema,
    scoutPolicyFingerprint: z
      .string()
      .regex(/^[a-f0-9]{64}$/, "Use a lowercase hexadecimal SHA-256."),
    queries: z.array(searchQuerySchema).min(1),
    startedAt: isoTimestampSchema,
    completedAt: isoTimestampSchema,
    searchThroughDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD."),
    status: z.enum(["completed", "partial", "failed"]),
    providerResultCountTotal: z.number().int().nonnegative(),
    providerRecordsInspected: z.number().int().nonnegative(),
    candidateCountCaptured: z.number().int().nonnegative(),
    toolId: stableIdSchema,
    toolVersion: nonBlankTextSchema(160),
    inputFingerprint: z
      .string()
      .regex(/^[a-f0-9]{64}$/, "Use a lowercase hexadecimal SHA-256."),
    statusNote: nonBlankTextSchema(2_000).nullable(),
    recordedAt: isoTimestampSchema,
    recordedBy: stableIdSchema,
  })
  .strict()
  .superRefine((run, context) => {
    if (Date.parse(run.completedAt) < Date.parse(run.startedAt)) {
      context.addIssue({
        code: "custom",
        message: "A Search Run cannot complete before it starts.",
        path: ["completedAt"],
      });
    }
    if (Date.parse(run.recordedAt) < Date.parse(run.completedAt)) {
      context.addIssue({
        code: "custom",
        message: "A Search Run cannot be recorded before it completes.",
        path: ["recordedAt"],
      });
    }
    if (
      (run.status !== "completed") !==
      (run.statusNote !== null)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Partial or failed Search Runs require an audit note; completed runs must not carry one.",
        path: ["statusNote"],
      });
    }
    if (
      run.candidateCountCaptured > run.providerRecordsInspected ||
      run.providerRecordsInspected > run.providerResultCountTotal
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Captured candidates cannot exceed reviewed results, and reviewed results cannot exceed the provider total.",
        path: ["candidateCountCaptured"],
      });
    }
  });

export const authoritySignalSchema = z.enum([
  "government_issuer",
  "professional_society",
  "peer_reviewed",
  "systematic_review",
  "clinical_guideline",
  "regulatory_source",
  "official_curriculum",
  "other",
]);

export const evidenceCandidateSchema = z
  .object({
    id: stableIdSchema,
    searchRunId: stableIdSchema,
    sourceType: sourceTypeSchema,
    title: nonBlankTextSchema(700),
    authors: z.array(nonBlankTextSchema(200)),
    organization: nonBlankTextSchema(300).nullable(),
    publicationDate: nonBlankTextSchema(40).nullable(),
    doi: z
      .string()
      .regex(/^10\.\d{4,9}\/\S+$/i)
      .nullable(),
    pmid: z.string().regex(/^\d+$/).nullable(),
    url: z.string().url().max(2_000).nullable(),
    citation: nonBlankTextSchema(1_600),
    publicationTypes: z.array(nonBlankTextSchema(160)),
    language: nonBlankTextSchema(80).nullable(),
    authoritySignals: z.array(authoritySignalSchema),
    surfacingRationale: nonBlankTextSchema(1_200),
    accessHint: z.enum(["unknown", "public", "restricted"]),
    matchedExistingSourceId: stableIdSchema.nullable(),
    metadataFingerprint: z
      .string()
      .regex(/^[a-f0-9]{64}$/, "Use a lowercase hexadecimal SHA-256."),
    discoveredAt: isoTimestampSchema,
    recordedAt: isoTimestampSchema,
    recordedBy: stableIdSchema,
  })
  .strict()
  .superRefine((candidate, context) => {
    if (
      candidate.authors.length === 0 &&
      candidate.organization === null
    ) {
      context.addIssue({
        code: "custom",
        message:
          "An Evidence Candidate requires an author or issuing organization.",
      });
    }
    if (Date.parse(candidate.recordedAt) < Date.parse(candidate.discoveredAt)) {
      context.addIssue({
        code: "custom",
        message: "A Candidate cannot be recorded before discovery.",
        path: ["recordedAt"],
      });
    }
  });

export const evidenceCandidateObservationSchema = z
  .object({
    id: stableIdSchema,
    candidateId: stableIdSchema,
    searchRunId: stableIdSchema,
    provider: z.enum(["pubmed", "crossref", "manual_other"]),
    providerRecordId: nonBlankTextSchema(500),
    observedDoi: z
      .string()
      .regex(/^10\.\d{4,9}\/\S+$/i)
      .nullable(),
    observedPmid: z.string().regex(/^\d+$/).nullable(),
    metadataFingerprint: z
      .string()
      .regex(/^[a-f0-9]{64}$/, "Use a lowercase hexadecimal SHA-256."),
    observedAt: isoTimestampSchema,
    recordedAt: isoTimestampSchema,
    recordedBy: stableIdSchema,
  })
  .strict()
  .superRefine((observation, context) => {
    if (
      Date.parse(observation.recordedAt) <
      Date.parse(observation.observedAt)
    ) {
      context.addIssue({
        code: "custom",
        message: "A Candidate Observation cannot be recorded before observation.",
        path: ["recordedAt"],
      });
    }
  });

export const evidenceScreeningDecisionSchema = z
  .object({
    id: stableIdSchema,
    candidateId: stableIdSchema,
    gapId: stableIdSchema,
    supersedesDecisionId: stableIdSchema.nullable(),
    disposition: z.enum([
      "include",
      "exclude",
      "duplicate",
      "awaiting_full_text",
      "rights_blocked",
    ]),
    resolvedSourceId: stableIdSchema.nullable(),
    reason: nonBlankTextSchema(2_000),
    reviewedAt: isoTimestampSchema,
    reviewedBy: stableIdSchema,
    recordedAt: isoTimestampSchema,
  })
  .strict()
  .superRefine((decision, context) => {
    if (
      ["include", "duplicate"].includes(decision.disposition) !==
      (decision.resolvedSourceId !== null)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Included or duplicate candidates require a resolved Source; other dispositions must not claim one.",
        path: ["resolvedSourceId"],
      });
    }
    if (Date.parse(decision.reviewedAt) > Date.parse(decision.recordedAt)) {
      context.addIssue({
        code: "custom",
        message: "A Screening Decision cannot be recorded before review.",
        path: ["recordedAt"],
      });
    }
  });

export const contributionRoleSchema = z.enum([
  "supports",
  "challenges",
  "qualifies",
  "context",
]);

export const evidenceContributionTypeSchema = z.enum([
  "definition",
  "epidemiology",
  "risk_factor",
  "presentation",
  "diagnosis",
  "workup",
  "management",
  "complication",
  "prognosis",
  "safety",
  "teaching_point",
  "context_only",
]);

export const reviewStatusSchema = z.enum([
  "proposed",
  "accepted",
  "rejected",
  "withdrawn",
]);

const reviewedRecordFields = {
  reviewStatus: reviewStatusSchema,
  reviewedAt: isoTimestampSchema.nullable(),
  reviewedBy: stableIdSchema.nullable(),
};

export const evidenceContributionSchema = z
  .object({
    id: stableIdSchema,
    seriesId: stableIdSchema,
    supersedesContributionId: stableIdSchema.nullable(),
    evidenceGapIds: z.array(stableIdSchema).min(1),
    targetContent: z.array(clinicalTargetReferenceSchema).min(1),
    authority: z.enum(["formal_source", "expert_opinion"]),
    sourceId: stableIdSchema.nullable(),
    citationIds: z.array(stableIdSchema),
    expertOpinionRevisionId: stableIdSchema.nullable(),
    role: contributionRoleSchema,
    contributionTypes: z.array(evidenceContributionTypeSchema).min(1),
    statement: nonBlankTextSchema(1_600),
    applicabilityNote: nonBlankTextSchema(1_200),
    sourceRole: z.enum([
      "primary_study",
      "evidence_synthesis",
      "guideline",
      "regulatory",
      "classification",
      "aggregator",
      "expert_opinion",
    ]),
    generatedBy: z.enum(["human", "ai"]),
    ...reviewedRecordFields,
    recordedAt: isoTimestampSchema,
    recordedBy: stableIdSchema,
  })
  .strict()
  .superRefine((contribution, context) => {
    if (
      contribution.authority === "formal_source" &&
      (contribution.sourceId === null ||
        contribution.citationIds.length === 0 ||
        contribution.expertOpinionRevisionId !== null ||
        contribution.sourceRole === "expert_opinion")
    ) {
      context.addIssue({
        code: "custom",
        message:
          "A formal Contribution requires one Source and verified Citations, and cannot claim Expert Opinion provenance.",
      });
    }
    if (
      contribution.authority === "expert_opinion" &&
      (contribution.sourceId !== null ||
        contribution.citationIds.length > 0 ||
        contribution.expertOpinionRevisionId === null ||
        contribution.sourceRole !== "expert_opinion")
    ) {
      context.addIssue({
        code: "custom",
        message:
          "An Expert Opinion Contribution must reference an Opinion revision and cannot masquerade as a formal Source or Citation.",
      });
    }
    const reviewed = contribution.reviewStatus !== "proposed";
    if (
      reviewed !==
      (contribution.reviewedAt !== null && contribution.reviewedBy !== null)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Accepted, rejected, or withdrawn Contributions require a reviewer and time; proposed Contributions must not carry them.",
        path: ["reviewedBy"],
      });
    }
    if (
      contribution.reviewedAt !== null &&
      Date.parse(contribution.reviewedAt) < Date.parse(contribution.recordedAt)
    ) {
      context.addIssue({
        code: "custom",
        message: "Contribution review cannot predate its record.",
        path: ["reviewedAt"],
      });
    }
  });

export const expertOpinionSchema = z
  .object({
    id: stableIdSchema,
    createdAt: isoTimestampSchema,
    createdBy: stableIdSchema,
  })
  .strict();

export const expertOpinionRevisionSchema = z
  .object({
    revisionId: stableIdSchema,
    opinionId: stableIdSchema,
    supersedesRevisionId: stableIdSchema.nullable(),
    evidenceGapIds: z.array(stableIdSchema).min(1),
    relatedFormalContributionIds: z.array(stableIdSchema),
    statement: nonBlankTextSchema(1_600),
    rationale: nonBlankTextSchema(2_000),
    clinicalScope: nonBlankTextSchema(1_200),
    limitations: z.array(nonBlankTextSchema(800)).min(1),
    ...reviewedRecordFields,
    recordedAt: isoTimestampSchema,
    recordedBy: stableIdSchema,
    changeSummary: nonBlankTextSchema(500),
  })
  .strict()
  .superRefine((opinion, context) => {
    const reviewed = opinion.reviewStatus !== "proposed";
    if (
      reviewed !== (opinion.reviewedAt !== null && opinion.reviewedBy !== null)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Accepted, rejected, or withdrawn Opinions require a reviewer and time; proposed Opinions must not carry them.",
        path: ["reviewedBy"],
      });
    }
    if (
      opinion.reviewedAt !== null &&
      Date.parse(opinion.reviewedAt) < Date.parse(opinion.recordedAt)
    ) {
      context.addIssue({
        code: "custom",
        message: "Opinion review cannot predate its revision.",
        path: ["reviewedAt"],
      });
    }
  });

export const generationProvenanceSchema = z
  .object({
    modelIdentifier: nonBlankTextSchema(240),
    promptVersion: stableIdSchema,
    generatorVersion: stableIdSchema,
    generatedAt: isoTimestampSchema,
    inputContributionIds: z.array(stableIdSchema),
    inputOpinionRevisionIds: z.array(stableIdSchema),
    validationResults: z.array(nonBlankTextSchema(1_000)),
    criticFindings: z.array(nonBlankTextSchema(1_000)),
    repairHistory: z.array(nonBlankTextSchema(1_000)),
  })
  .strict();

export const evidenceSynthesisProposalSchema = z
  .object({
    id: stableIdSchema,
    evidenceGapRevisionIds: z.array(stableIdSchema).min(1),
    searchRunIds: z.array(stableIdSchema),
    contributionIds: z.array(stableIdSchema).min(1),
    expertOpinionRevisionIds: z.array(stableIdSchema),
    focusedQuestion: nonBlankTextSchema(1_200),
    supportingSummary: nonBlankTextSchema(2_000),
    opposingOrQualifyingSummary: nonBlankTextSchema(2_000),
    proposedDirection: nonBlankTextSchema(2_000),
    limitations: z.array(nonBlankTextSchema(800)).min(1),
    unresolvedQuestions: z.array(nonBlankTextSchema(800)),
    generatedBy: z.enum(["human", "ai"]),
    generationProvenance: generationProvenanceSchema.nullable(),
    pointMagnitudeExcluded: z.literal(true),
    clinicalApprovalId: z.null(),
    recordedAt: isoTimestampSchema,
    recordedBy: stableIdSchema,
  })
  .strict()
  .superRefine((proposal, context) => {
    if (
      (proposal.generatedBy === "ai") !==
      (proposal.generationProvenance !== null)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "AI Synthesis Proposals require generation provenance; human proposals must not carry AI provenance.",
        path: ["generationProvenance"],
      });
    }
    if (
      proposal.generationProvenance !== null &&
      Date.parse(proposal.generationProvenance.generatedAt) >
        Date.parse(proposal.recordedAt)
    ) {
      context.addIssue({
        code: "custom",
        message: "A generated proposal cannot be recorded before generation.",
        path: ["recordedAt"],
      });
    }
  });

export const evidenceSynthesisDecisionSchema = z
  .object({
    id: stableIdSchema,
    proposalId: stableIdSchema,
    supersedesDecisionId: stableIdSchema.nullable(),
    disposition: z.enum([
      "accept",
      "narrow",
      "reject",
      "defer",
      "request_more_evidence",
    ]),
    acceptedStatement: nonBlankTextSchema(2_000).nullable(),
    rationale: nonBlankTextSchema(2_000),
    resultingEvidenceGapIds: z.array(stableIdSchema),
    reviewedAt: isoTimestampSchema,
    reviewedBy: stableIdSchema,
    recordedAt: isoTimestampSchema,
    clinicalApprovalId: z.null(),
  })
  .strict()
  .superRefine((decision, context) => {
    const accepts = ["accept", "narrow"].includes(decision.disposition);
    if (accepts !== (decision.acceptedStatement !== null)) {
      context.addIssue({
        code: "custom",
        message:
          "Accepted or narrowed Syntheses require an accepted statement; other dispositions must not carry one.",
        path: ["acceptedStatement"],
      });
    }
    if (
      decision.disposition === "request_more_evidence" &&
      decision.resultingEvidenceGapIds.length === 0
    ) {
      context.addIssue({
        code: "custom",
        message:
          "A request for more evidence must identify at least one resulting Evidence Gap.",
        path: ["resultingEvidenceGapIds"],
      });
    }
    if (Date.parse(decision.reviewedAt) > Date.parse(decision.recordedAt)) {
      context.addIssue({
        code: "custom",
        message: "A Synthesis Decision cannot be recorded before review.",
        path: ["recordedAt"],
      });
    }
  });

export const clinicalContentChangeProposalSchema = z
  .object({
    id: stableIdSchema,
    synthesisDecisionId: stableIdSchema,
    targetContent: z.array(clinicalTargetReferenceSchema).min(1),
    changeKind: z.enum(["add", "modify", "withdraw", "no_change"]),
    beforeSummary: z.string().max(2_000),
    proposedSummary: nonBlankTextSchema(2_000),
    status: z.enum(["draft", "ready_for_authoring", "withdrawn"]),
    crossTargetReview: z
      .object({
        rationale: nonBlankTextSchema(2_000),
        reviewedAt: isoTimestampSchema,
        reviewedBy: stableIdSchema,
      })
      .strict()
      .nullable(),
    clinicalApprovalId: z.null(),
    recordedAt: isoTimestampSchema,
    recordedBy: stableIdSchema,
  })
  .strict()
  .superRefine((proposal, context) => {
    if (
      proposal.crossTargetReview !== null &&
      Date.parse(proposal.crossTargetReview.reviewedAt) >
        Date.parse(proposal.recordedAt)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "A cross-target review cannot occur after its Content Change Proposal was recorded.",
        path: ["crossTargetReview", "reviewedAt"],
      });
    }
  });

export type SourceType = z.infer<typeof sourceTypeSchema>;
export type ClinicalTargetReference = z.infer<
  typeof clinicalTargetReferenceSchema
>;
export type ExternalReferenceIndex = z.infer<
  typeof externalReferenceIndexSchema
>;
export type CitationVerificationSignal = z.infer<
  typeof citationVerificationSignalSchema
>;
export type ScoutPolicy = z.infer<typeof scoutPolicySchema>;
export type EvidenceGap = z.infer<typeof evidenceGapSchema>;
export type EvidenceGapRevision = z.infer<typeof evidenceGapRevisionSchema>;
export type SourceRelation = z.infer<typeof sourceRelationSchema>;
export type SourceRightsPermissions = z.infer<
  typeof sourceRightsPermissionsSchema
>;
export type SourceRightsDecision = z.infer<
  typeof sourceRightsDecisionSchema
>;
export type EvidenceSearchRun = z.infer<typeof evidenceSearchRunSchema>;
export type EvidenceCandidate = z.infer<typeof evidenceCandidateSchema>;
export type EvidenceCandidateObservation = z.infer<
  typeof evidenceCandidateObservationSchema
>;
export type EvidenceScreeningDecision = z.infer<
  typeof evidenceScreeningDecisionSchema
>;
export type EvidenceContribution = z.infer<
  typeof evidenceContributionSchema
>;
export type ExpertOpinion = z.infer<typeof expertOpinionSchema>;
export type ExpertOpinionRevision = z.infer<
  typeof expertOpinionRevisionSchema
>;
export type EvidenceSynthesisProposal = z.infer<
  typeof evidenceSynthesisProposalSchema
>;
export type EvidenceSynthesisDecision = z.infer<
  typeof evidenceSynthesisDecisionSchema
>;
export type ClinicalContentChangeProposal = z.infer<
  typeof clinicalContentChangeProposalSchema
>;
