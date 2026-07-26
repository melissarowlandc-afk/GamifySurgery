/**
 * Browser-safe projection types only. The persisted source of truth is the
 * `ResearchWorkspace` validated server-side by
 * `@gamify-surgery/clinical-research`; these DTOs are never persisted.
 */

export type GapStatus =
  | "open"
  | "scouting"
  | "candidates_found"
  | "awaiting_review"
  | "resolved"
  | "deferred"
  | "withdrawn";

export type ScreeningDisposition =
  | "unscreened"
  | "include"
  | "exclude"
  | "duplicate"
  | "awaiting_full_text"
  | "rights_blocked";

export type RightsDecisionStatus =
  | "implicit_default_deny"
  | "default_deny"
  | "permitted_with_conditions"
  | "metadata_only"
  | "blocked"
  | "revoked";

export type ReviewStatus = "proposed" | "accepted" | "rejected" | "withdrawn";

export type SynthesisDisposition =
  | "pending"
  | "accept"
  | "narrow"
  | "reject"
  | "defer"
  | "request_more_evidence";

export type GapViewDto = {
  id: string;
  revisionId: string;
  title: string;
  clinicalQuestion: string;
  whyNeeded: string;
  acceptanceCriteria: string[];
  status: GapStatus;
  resolutionNote: string | null;
  targetContent: {
    kind: string;
    id: string;
  }[];
  scoutPolicy: {
    mode: "manual_only" | "metadata_search" | "rights_gated_full_text";
    preferredSourceTypes: string[];
    providerStrategies: {
      provider:
        | "pubmed"
        | "crossref"
        | "clinical_trials"
        | "guideline_registry"
        | "manual_other";
      query: string;
      filters: string[];
    }[];
    refreshIntervalDays: number | null;
  };
  revisionCount: number;
  updatedAt: string;
};

export type CandidateViewDto = {
  id: string;
  title: string;
  citation: string;
  organization: string | null;
  sourceType: string;
  gapIds: string[];
  screenings: {
    gapId: string;
    sourceId: string | null;
    disposition: ScreeningDisposition;
    reason: string | null;
  }[];
  discoveredAt: string;
};

export type SourceRightsViewDto = {
  sourceId: string;
  label: string;
  decisionId: string | null;
  decisionStatus: RightsDecisionStatus;
  legalBasis: string | null;
  notes: string;
  permissions: RightsPermissionsDto;
  territories: string[];
  licenseLabel: string | null;
  licenseUrl: string | null;
  termsUrl: string | null;
  attributionStatement: string | null;
  requiredNotices: string[];
  nonCommercialOnly: boolean;
  shareAlikeRequired: boolean;
  thirdPartyMaterialPolicy: string | null;
  fairUseAssessment: FairUseAssessmentDto | null;
  permissionEvidenceReferenceIds: string[];
  reviewBasis: string | null;
  reviewedBy: string | null;
  privateStoragePermitted: boolean;
  localProcessingPermitted: boolean;
  reviewedAt: string | null;
  effectiveAt: string | null;
  expiresAt: string | null;
};

export type ExpertOpinionViewDto = {
  id: string;
  revisionId: string;
  gapIds: string[];
  statement: string;
  rationale: string;
  clinicalScope: string;
  limitations: string[];
  reviewStatus: ReviewStatus;
  revisionCount: number;
  updatedAt: string;
};

export type CitationReferenceViewDto = {
  id: string;
  sourceId: string;
  sourceSnapshotId: string;
  verificationState: "unverified" | "human_verified" | "conflict_identified";
  verificationSignalId: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
};

export type ContributionViewDto = {
  id: string;
  seriesId: string;
  gapIds: string[];
  authority: "formal_source" | "expert_opinion";
  sourceId: string | null;
  citationIds: string[];
  expertOpinionRevisionId: string | null;
  role: "supports" | "challenges" | "qualifies" | "context";
  contributionTypes: string[];
  statement: string;
  applicabilityNote: string;
  sourceRole: string;
  reviewStatus: ReviewStatus;
  updatedAt: string;
};

export type SourceRelationViewDto = {
  id: string;
  fromSourceId: string;
  toSourceId: string;
  relationType:
    | "corrects"
    | "retracts"
    | "supersedes"
    | "updates"
    | "companion_to"
    | "executive_summary_of"
    | "translation_of";
  relationStatus: "active" | "withdrawn";
  note: string;
  recordedAt: string;
};

export type ContentChangeProposalViewDto = {
  id: string;
  synthesisDecisionId: string;
  targetContent: {
    kind: string;
    id: string;
  }[];
  changeKind: "add" | "modify" | "withdraw" | "no_change";
  beforeSummary: string;
  proposedSummary: string;
  status: "draft" | "ready_for_authoring" | "withdrawn";
  crossTargetReview: {
    rationale: string;
    reviewedAt: string;
    reviewedBy: string;
  } | null;
  recordedAt: string;
};

export type SynthesisViewDto = {
  id: string;
  decisionId: string | null;
  gapIds: string[];
  focusedQuestion: string;
  supportingSummary: string;
  opposingOrQualifyingSummary: string;
  proposedDirection: string;
  limitations: string[];
  contributionCount: number;
  opinionCount: number;
  disposition: SynthesisDisposition;
  decisionRationale: string | null;
  reviewedAt: string | null;
  recordedAt: string;
};

export type AuditEntryDto = {
  id: string;
  at: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
};

export type WorkbenchViewDto = {
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
  gaps: GapViewDto[];
  candidates: CandidateViewDto[];
  sourceRights: SourceRightsViewDto[];
  citations: CitationReferenceViewDto[];
  sourceRelations: SourceRelationViewDto[];
  expertOpinions: ExpertOpinionViewDto[];
  contributions: ContributionViewDto[];
  syntheses: SynthesisViewDto[];
  contentChangeProposals: ContentChangeProposalViewDto[];
  audit: AuditEntryDto[];
};

export type RightsPermissionsDto = {
  bibliographicMetadata: boolean;
  privateStorage: boolean;
  localTextExtraction: boolean;
  localStructuredIndexing: boolean;
  externalAiProcessing: boolean;
  derivedClinicalContent: boolean;
  projectParaphrasePublication: boolean;
  publicSourceTextReuse: boolean;
  runtimeRedistribution: boolean;
  commercialDistribution: boolean;
};

export type FairUseAssessmentDto = {
  preciseUse: string;
  purposeAndCharacter: string;
  natureOfWork: string;
  amountAndSubstantiality: string;
  marketEffect: string;
  conclusion:
    | "proceed_narrowly"
    | "do_not_proceed"
    | "seek_legal_review";
};

export type KnownBriefItemDto = {
  kind: "formal_evidence" | "expert_opinion";
  id: string;
  role: string;
  statement: string;
  applicabilityOrScope: string;
  reviewedAt: string;
  sourceId: string | null;
};

export type KnownVsNeededBriefDto = {
  evidenceGapId: string;
  evidenceGapRevisionId: string;
  title: string;
  clinicalQuestion: string;
  gapStatus: GapStatus;
  known: KnownBriefItemDto[];
  needed: {
    whyNeeded: string;
    acceptanceCriteria: string[];
    openWork: string[];
  };
  searchStatus: {
    runCount: number;
    completedRunCount: number;
    partialRunCount: number;
    failedRunCount: number;
    providerResultCountTotal: number;
    providerRecordsInspected: number;
    candidateCountCaptured: number;
    candidateCountPresent: number;
    includedCount: number;
    excludedCount: number;
    duplicateCount: number;
    awaitingFullTextCount: number;
    rightsBlockedCount: number;
    unscreenedCount: number;
    latestCompletedAt: string | null;
    nextRefreshDueAt: string | null;
  };
  clinicalApprovalConferred: false;
};

export type WorkbenchCommand =
  | {
      type: "create_gap";
      title: string;
      clinicalQuestion: string;
      whyNeeded: string;
      acceptanceCriteria: string[];
      targetKind:
        | "clinical_topic_revision"
        | "topic_section"
        | "structured_fact"
        | "tested_concept"
        | "patient_variant"
        | "question_variant"
        | "clinical_release"
        | "other";
      targetId: string;
      scoutMode: "manual_only" | "metadata_search";
      preferredSourceTypes: string[];
      provider:
        | "pubmed"
        | "crossref"
        | "clinical_trials"
        | "guideline_registry"
        | "manual_other";
      query: string;
      refreshIntervalDays: number | null;
    }
  | {
      type: "revise_gap";
      gapId: string;
      title: string;
      clinicalQuestion: string;
      whyNeeded: string;
      acceptanceCriteria: string[];
      status: GapStatus;
      resolutionNote: string | null;
      changeSummary: string;
      targetKind:
        | "clinical_topic_revision"
        | "topic_section"
        | "structured_fact"
        | "tested_concept"
        | "patient_variant"
        | "question_variant"
        | "clinical_release"
        | "other";
      targetId: string;
      scoutMode: "manual_only" | "metadata_search";
      preferredSourceTypes: string[];
      provider:
        | "pubmed"
        | "crossref"
        | "clinical_trials"
        | "guideline_registry"
        | "manual_other";
      query: string;
      refreshIntervalDays: number | null;
    }
  | {
      type: "capture_candidate";
      gapId: string;
      title: string;
      citation: string;
      organization: string;
      sourceType:
        | "clinical_guideline"
        | "systematic_review"
        | "meta_analysis"
        | "journal_article"
        | "professional_guidance"
        | "reference_website"
        | "other";
    }
  | {
      type: "screen_candidate";
      candidateId: string;
      gapId: string;
      disposition:
        | "include"
        | "exclude"
        | "duplicate"
        | "awaiting_full_text"
        | "rights_blocked";
      resolvedSourceId: string | null;
      reason: string;
    }
  | {
      type: "record_source_rights";
      sourceId: string | null;
      sourceLabel: string;
      decisionStatus:
        | "default_deny"
        | "permitted_with_conditions"
        | "metadata_only"
        | "blocked"
        | "revoked";
      legalBasis:
        | "unreviewed"
        | "owner_authored"
        | "public_domain"
        | "open_license"
        | "written_permission"
        | "fair_use"
        | "metadata_only";
      permissions: RightsPermissionsDto;
      territories: string[];
      licenseLabel: string | null;
      licenseUrl: string | null;
      termsUrl: string | null;
      attributionStatement: string | null;
      requiredNotices: string[];
      nonCommercialOnly: boolean;
      shareAlikeRequired: boolean;
      thirdPartyMaterialPolicy:
        | "excluded"
        | "item_level_review_required"
        | "included_by_permission"
        | "not_applicable";
      fairUseAssessment: FairUseAssessmentDto | null;
      permissionEvidenceReferenceIds: string[];
      reviewBasis:
        | "owner_attestation"
        | "engineering_risk_assessment"
        | "legal_counsel";
      effectiveAt: string;
      expiresAt: string | null;
      notes: string;
    }
  | {
      type: "add_expert_opinion";
      gapId: string;
      statement: string;
      rationale: string;
      clinicalScope: string;
      limitations: string[];
    }
  | {
      type: "review_expert_opinion";
      opinionId: string;
      disposition: "accepted" | "rejected";
      reviewNote: string;
    }
  | {
      type: "register_citation";
      citationId: string;
      sourceId: string;
      sourceSnapshotId: string;
      verificationState: "unverified";
    }
  | {
      type: "propose_contribution";
      gapId: string;
      sourceId: string;
      citationIds: string[];
      role: "supports" | "challenges" | "qualifies" | "context";
      contributionTypes: string[];
      statement: string;
      applicabilityNote: string;
      sourceRole:
        | "primary_study"
        | "evidence_synthesis"
        | "guideline"
        | "regulatory"
        | "classification"
        | "aggregator";
    }
  | {
      type: "review_contribution";
      contributionId: string;
      disposition: "accepted" | "rejected";
    }
  | {
      type: "record_source_relation";
      fromSourceId: string;
      toSourceId: string;
      relationType:
        | "corrects"
        | "retracts"
        | "supersedes"
        | "updates"
        | "companion_to"
        | "executive_summary_of"
        | "translation_of";
      note: string;
    }
  | {
      type: "withdraw_source_relation";
      relationId: string;
      note: string;
    }
  | {
      type: "create_synthesis";
      gapId: string;
      supportingSummary: string;
      opposingOrQualifyingSummary: string;
      proposedDirection: string;
      limitations: string[];
    }
  | {
      type: "decide_synthesis";
      proposalId: string;
      disposition: "accept" | "reject";
      rationale: string;
    }
  | {
      type: "create_content_change";
      synthesisDecisionId: string;
      targetKind:
        | "clinical_topic_revision"
        | "topic_section"
        | "structured_fact"
        | "tested_concept"
        | "patient_variant"
        | "question_variant"
        | "clinical_release"
        | "other";
      targetId: string;
      changeKind: "add" | "modify" | "withdraw" | "no_change";
      beforeSummary: string;
      proposedSummary: string;
      status: "draft" | "ready_for_authoring";
      crossTargetRationale?: string;
      crossTargetReviewConfirmed?: boolean;
    };
