import {
  buildKnownVsNeededBrief,
  denyAllSourceRights,
  effectiveCitationVerification,
  getEffectiveSourceRightsDecision,
  type ResearchWorkspace,
} from "@gamify-surgery/clinical-research";

import type {
  AuditEntryDto,
  CandidateViewDto,
  ContentChangeProposalViewDto,
  ContributionViewDto,
  ExpertOpinionViewDto,
  GapViewDto,
  KnownVsNeededBriefDto,
  SourceRightsViewDto,
  SourceRelationViewDto,
  SynthesisViewDto,
  WorkbenchViewDto,
} from "../client/src/model.js";

function headRecords<
  RecordType extends {
    id: string;
    parentId: string | null;
  },
>(records: readonly RecordType[]): RecordType[] {
  const parentIds = new Set(
    records
      .map((record) => record.parentId)
      .filter((id): id is string => id !== null),
  );
  return records.filter((record) => !parentIds.has(record.id));
}

function sourceLabel(workspace: ResearchWorkspace, sourceId: string): string {
  const screening = [...workspace.screeningDecisions]
    .reverse()
    .find((decision) => decision.resolvedSourceId === sourceId);
  if (screening !== undefined) {
    const candidate = workspace.candidates.find(
      (entry) => entry.id === screening.candidateId,
    );
    if (candidate !== undefined) {
      return candidate.title;
    }
  }
  const decision = [...workspace.sourceRightsDecisions]
    .reverse()
    .find((entry) => entry.sourceId === sourceId);
  const label = decision?.notes.match(/^Source label: (.+)$/m)?.[1]?.trim();
  return label || sourceId;
}

function gapViews(workspace: ResearchWorkspace): GapViewDto[] {
  const heads = headRecords(
    workspace.evidenceGapRevisions.map((revision) => ({
      ...revision,
      id: revision.revisionId,
      parentId: revision.supersedesRevisionId,
    })),
  );
  return heads
    .map((revision): GapViewDto => ({
      id: revision.gapId,
      revisionId: revision.revisionId,
      title: revision.title,
      clinicalQuestion: revision.clinicalQuestion,
      whyNeeded: revision.whyNeeded,
      acceptanceCriteria: [...revision.acceptanceCriteria],
      status: revision.status,
      resolutionNote: revision.resolutionNote,
      targetContent: revision.targetContent.map((target) => ({ ...target })),
      scoutPolicy: {
        mode: revision.scoutPolicy.mode,
        preferredSourceTypes: [...revision.scoutPolicy.preferredSourceTypes],
        providerStrategies: revision.scoutPolicy.providerStrategies.map(
          (strategy) => ({
            provider: strategy.provider,
            query: strategy.query,
            filters: [...strategy.filters],
          }),
        ),
        refreshIntervalDays: revision.scoutPolicy.refreshIntervalDays,
      },
      revisionCount: workspace.evidenceGapRevisions.filter(
        (candidate) => candidate.gapId === revision.gapId,
      ).length,
      updatedAt: revision.recordedAt,
    }))
    .sort((left, right) => left.title.localeCompare(right.title));
}

function candidateViews(workspace: ResearchWorkspace): CandidateViewDto[] {
  const gapRevisionById = new Map(
    workspace.evidenceGapRevisions.map((revision) => [
      revision.revisionId,
      revision,
    ]),
  );
  const runById = new Map(
    workspace.searchRuns.map((run) => [run.id, run]),
  );
  const runIdsByCandidateId = new Map<string, Set<string>>();
  for (const observation of workspace.candidateObservations) {
    const runIds =
      runIdsByCandidateId.get(observation.candidateId) ?? new Set<string>();
    runIds.add(observation.searchRunId);
    runIdsByCandidateId.set(observation.candidateId, runIds);
  }
  const decisions = headRecords(
    workspace.screeningDecisions.map((decision) => ({
      ...decision,
      parentId: decision.supersedesDecisionId,
    })),
  );
  return workspace.candidates
    .map((candidate): CandidateViewDto => {
      const gapIds = [
        ...new Set(
          [...(runIdsByCandidateId.get(candidate.id) ?? [])]
            .flatMap((runId) => runById.get(runId)?.gapRevisionIds ?? [])
            .map((revisionId) => gapRevisionById.get(revisionId)?.gapId)
            .filter((gapId): gapId is string => gapId !== undefined),
        ),
      ].sort();
      return {
        id: candidate.id,
        title: candidate.title,
        citation: candidate.citation,
        organization: candidate.organization,
        sourceType: candidate.sourceType,
        gapIds,
        screenings: gapIds.map((gapId) => {
          const decision = decisions.find(
            (entry) =>
              entry.candidateId === candidate.id &&
              entry.gapId === gapId,
          );
          return {
            gapId,
            sourceId:
              decision?.resolvedSourceId ??
              candidate.matchedExistingSourceId,
            disposition: decision?.disposition ?? "unscreened",
            reason: decision?.reason ?? null,
          };
        }),
        discoveredAt: candidate.discoveredAt,
      };
    })
    .sort((left, right) => left.title.localeCompare(right.title));
}

function rightsViews(workspace: ResearchWorkspace): SourceRightsViewDto[] {
  const heads = headRecords(
    workspace.sourceRightsDecisions.map((decision) => ({
      ...decision,
      parentId: decision.supersedesDecisionId,
    })),
  );
  return workspace.externalReferences.sources
    .map((source): SourceRightsViewDto => {
      const recordedHead = heads.find(
        (entry) => entry.sourceId === source.id,
      );
      const decision = getEffectiveSourceRightsDecision(
        workspace,
        source.id,
        workspace.updatedAt,
      );
      const permissions = decision?.permissions ?? denyAllSourceRights;
      return {
        sourceId: source.id,
        label: sourceLabel(workspace, source.id),
        decisionId: decision?.id ?? null,
        decisionStatus:
          decision?.decisionStatus ?? "implicit_default_deny",
        legalBasis: decision?.legalBasis ?? null,
        notes:
          decision?.notes ??
          (recordedHead
            ? "No recorded rights decision is currently effective; default deny applies."
            : "No explicit rights decision is recorded."),
        permissions: { ...permissions },
        territories: decision?.territories ?? [],
        licenseLabel: decision?.licenseLabel ?? null,
        licenseUrl: decision?.licenseUrl ?? null,
        termsUrl: decision?.termsUrl ?? null,
        attributionStatement: decision?.attributionStatement ?? null,
        requiredNotices: decision?.requiredNotices ?? [],
        nonCommercialOnly: decision?.nonCommercialOnly ?? false,
        shareAlikeRequired: decision?.shareAlikeRequired ?? false,
        thirdPartyMaterialPolicy:
          decision?.thirdPartyMaterialPolicy ?? null,
        fairUseAssessment: decision?.fairUseAssessment ?? null,
        permissionEvidenceReferenceIds:
          decision?.permissionEvidenceReferenceIds ?? [],
        reviewBasis: decision?.reviewBasis ?? null,
        reviewedBy: decision?.reviewedBy ?? null,
        privateStoragePermitted: permissions.privateStorage,
        localProcessingPermitted:
          permissions.localTextExtraction ||
          permissions.localStructuredIndexing,
        reviewedAt: decision?.reviewedAt ?? null,
        effectiveAt: decision?.effectiveAt ?? null,
        expiresAt: decision?.expiresAt ?? null,
      };
    })
    .sort((left, right) => left.label.localeCompare(right.label));
}

function opinionViews(workspace: ResearchWorkspace): ExpertOpinionViewDto[] {
  const heads = headRecords(
    workspace.expertOpinionRevisions.map((revision) => ({
      ...revision,
      id: revision.revisionId,
      parentId: revision.supersedesRevisionId,
    })),
  );
  return heads
    .map((revision): ExpertOpinionViewDto => ({
      id: revision.opinionId,
      revisionId: revision.revisionId,
      gapIds: [...revision.evidenceGapIds],
      statement: revision.statement,
      rationale: revision.rationale,
      clinicalScope: revision.clinicalScope,
      limitations: [...revision.limitations],
      reviewStatus: revision.reviewStatus,
      revisionCount: workspace.expertOpinionRevisions.filter(
        (candidate) => candidate.opinionId === revision.opinionId,
      ).length,
      updatedAt: revision.recordedAt,
    }))
    .sort((left, right) => left.updatedAt.localeCompare(right.updatedAt));
}

function contributionViews(
  workspace: ResearchWorkspace,
): ContributionViewDto[] {
  return headRecords(
    workspace.contributions.map((contribution) => ({
      ...contribution,
      parentId: contribution.supersedesContributionId,
    })),
  )
    .map((contribution): ContributionViewDto => ({
      id: contribution.id,
      seriesId: contribution.seriesId,
      gapIds: [...contribution.evidenceGapIds],
      authority: contribution.authority,
      sourceId: contribution.sourceId,
      citationIds: [...contribution.citationIds],
      expertOpinionRevisionId: contribution.expertOpinionRevisionId,
      role: contribution.role,
      contributionTypes: [...contribution.contributionTypes],
      statement: contribution.statement,
      applicabilityNote: contribution.applicabilityNote,
      sourceRole: contribution.sourceRole,
      reviewStatus: contribution.reviewStatus,
      updatedAt: contribution.recordedAt,
    }))
    .sort((left, right) => left.updatedAt.localeCompare(right.updatedAt));
}

function relationViews(workspace: ResearchWorkspace): SourceRelationViewDto[] {
  return headRecords(
    workspace.sourceRelations.map((relation) => ({
      ...relation,
      parentId: relation.supersedesRelationId,
    })),
  )
    .map((relation): SourceRelationViewDto => ({
      id: relation.id,
      fromSourceId: relation.fromSourceId,
      toSourceId: relation.toSourceId,
      relationType: relation.relationType,
      relationStatus: relation.relationStatus,
      note: relation.note,
      recordedAt: relation.recordedAt,
    }))
    .sort((left, right) => left.recordedAt.localeCompare(right.recordedAt));
}

function contentChangeViews(
  workspace: ResearchWorkspace,
): ContentChangeProposalViewDto[] {
  return workspace.contentChangeProposals
    .map((proposal): ContentChangeProposalViewDto => ({
      id: proposal.id,
      synthesisDecisionId: proposal.synthesisDecisionId,
      targetContent: proposal.targetContent.map((target) => ({ ...target })),
      changeKind: proposal.changeKind,
      beforeSummary: proposal.beforeSummary,
      proposedSummary: proposal.proposedSummary,
      status: proposal.status,
      crossTargetReview:
        proposal.crossTargetReview === null
          ? null
          : { ...proposal.crossTargetReview },
      recordedAt: proposal.recordedAt,
    }))
    .sort((left, right) => left.recordedAt.localeCompare(right.recordedAt));
}

function synthesisViews(workspace: ResearchWorkspace): SynthesisViewDto[] {
  const revisionById = new Map(
    workspace.evidenceGapRevisions.map((revision) => [
      revision.revisionId,
      revision,
    ]),
  );
  const decisions = headRecords(
    workspace.synthesisDecisions.map((decision) => ({
      ...decision,
      parentId: decision.supersedesDecisionId,
    })),
  );
  return workspace.synthesisProposals
    .map((proposal): SynthesisViewDto => {
      const decision = decisions.find(
        (entry) => entry.proposalId === proposal.id,
      );
      return {
        id: proposal.id,
        decisionId: decision?.id ?? null,
        gapIds: [
          ...new Set(
            proposal.evidenceGapRevisionIds
              .map((id) => revisionById.get(id)?.gapId)
              .filter((id): id is string => id !== undefined),
          ),
        ],
        focusedQuestion: proposal.focusedQuestion,
        supportingSummary: proposal.supportingSummary,
        opposingOrQualifyingSummary:
          proposal.opposingOrQualifyingSummary,
        proposedDirection: proposal.proposedDirection,
        limitations: [...proposal.limitations],
        contributionCount: proposal.contributionIds.length,
        opinionCount: proposal.expertOpinionRevisionIds.length,
        disposition: decision?.disposition ?? "pending",
        decisionRationale: decision?.rationale ?? null,
        reviewedAt: decision?.reviewedAt ?? null,
        recordedAt: proposal.recordedAt,
      };
    })
    .sort((left, right) => left.recordedAt.localeCompare(right.recordedAt));
}

function auditViews(workspace: ResearchWorkspace): AuditEntryDto[] {
  const entries: AuditEntryDto[] = [];
  workspace.evidenceGapRevisions.forEach((revision) => {
    entries.push({
      id: `audit.${revision.revisionId}`,
      at: revision.recordedAt,
      action:
        revision.supersedesRevisionId === null ? "gap_created" : "gap_revised",
      entityType: "evidence_gap",
      entityId: revision.gapId,
      summary: revision.changeSummary,
    });
  });
  workspace.searchRuns.forEach((run) => {
    entries.push({
      id: `audit.${run.id}`,
      at: run.recordedAt,
      action: "search_recorded",
      entityType: "search_run",
      entityId: run.id,
      summary: `Recorded a ${run.status} search with ${run.candidateCountCaptured} candidate(s).`,
    });
  });
  workspace.candidates.forEach((candidate) => {
    entries.push({
      id: `audit.${candidate.id}`,
      at: candidate.recordedAt,
      action: "candidate_captured",
      entityType: "evidence_candidate",
      entityId: candidate.id,
      summary: `Captured candidate metadata: ${candidate.title}.`,
    });
  });
  workspace.candidateObservations.forEach((observation) => {
    entries.push({
      id: `audit.${observation.id}`,
      at: observation.recordedAt,
      action: "candidate_observed",
      entityType: "evidence_candidate_observation",
      entityId: observation.candidateId,
      summary: `Observed ${observation.candidateId} in ${observation.searchRunId} via ${observation.provider}.`,
    });
  });
  workspace.screeningDecisions.forEach((decision) => {
    entries.push({
      id: `audit.${decision.id}`,
      at: decision.recordedAt,
      action: "candidate_screened",
      entityType: "screening_decision",
      entityId: decision.id,
      summary: `Recorded ${decision.disposition} for ${decision.candidateId}.`,
    });
  });
  workspace.sourceRightsDecisions.forEach((decision) => {
    entries.push({
      id: `audit.${decision.id}`,
      at: decision.recordedAt,
      action: "rights_decided",
      entityType: "source_rights",
      entityId: decision.sourceId,
      summary: `Recorded ${decision.decisionStatus} rights for ${sourceLabel(workspace, decision.sourceId)}.`,
    });
  });
  workspace.sourceRelations.forEach((relation) => {
    entries.push({
      id: `audit.${relation.id}`,
      at: relation.recordedAt,
      action: "source_relation_recorded",
      entityType: "source_relation",
      entityId: relation.id,
      summary:
        relation.relationStatus === "withdrawn"
          ? `Withdrew the recorded ${relation.relationType} relation from ${relation.fromSourceId} to ${relation.toSourceId}.`
          : `Recorded that ${relation.fromSourceId} ${relation.relationType} ${relation.toSourceId}.`,
    });
  });
  workspace.citationVerificationSignals.forEach((signal) => {
    entries.push({
      id: `audit.${signal.id}`,
      at: signal.recordedAt,
      action: "citation_verification_recorded",
      entityType: "citation_verification_signal",
      entityId: signal.citationId,
      summary: `Recorded ${signal.verificationState} for ${signal.citationId} by ${signal.verifiedBy}; verification occurred at ${signal.verifiedAt}.`,
    });
  });
  workspace.expertOpinionRevisions.forEach((revision) => {
    entries.push({
      id: `audit.${revision.revisionId}`,
      at: revision.recordedAt,
      action: "expert_opinion_recorded",
      entityType: "expert_opinion",
      entityId: revision.opinionId,
      summary: revision.changeSummary,
    });
  });
  workspace.synthesisProposals.forEach((proposal) => {
    entries.push({
      id: `audit.${proposal.id}`,
      at: proposal.recordedAt,
      action: "synthesis_proposed",
      entityType: "synthesis",
      entityId: proposal.id,
      summary: "Recorded a human-authored synthesis proposal.",
    });
  });
  workspace.contributions.forEach((contribution) => {
    entries.push({
      id: `audit.${contribution.id}`,
      at: contribution.recordedAt,
      action: "contribution_recorded",
      entityType: "evidence_contribution",
      entityId: contribution.id,
      summary: `Recorded a ${contribution.reviewStatus} ${contribution.authority} contribution.`,
    });
  });
  workspace.synthesisDecisions.forEach((decision) => {
    entries.push({
      id: `audit.${decision.id}`,
      at: decision.recordedAt,
      action: "synthesis_decided",
      entityType: "synthesis_decision",
      entityId: decision.id,
      summary: `Recorded ${decision.disposition} for ${decision.proposalId}.`,
    });
  });
  workspace.contentChangeProposals.forEach((proposal) => {
    entries.push({
      id: `audit.${proposal.id}`,
      at: proposal.recordedAt,
      action: "authoring_handoff_created",
      entityType: "content_change_proposal",
      entityId: proposal.id,
      summary: `Created a ${proposal.status} ${proposal.changeKind} handoff${
        proposal.crossTargetReview
          ? ` with a cross-target rationale reviewed by ${proposal.crossTargetReview.reviewedBy}`
          : ""
      }; no clinical approval was conferred.`,
    });
  });
  return entries.sort(
    (left, right) =>
      Date.parse(right.at) - Date.parse(left.at) ||
      right.id.localeCompare(left.id),
  );
}

export function presentWorkspace(workspace: ResearchWorkspace): {
  view: WorkbenchViewDto;
  briefs: KnownVsNeededBriefDto[];
} {
  const gaps = gapViews(workspace);
  return {
    view: {
      id: workspace.id,
      label: "Clinical Context Workbench",
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      gaps,
      candidates: candidateViews(workspace),
      sourceRights: rightsViews(workspace),
      expertOpinions: opinionViews(workspace),
      citations: workspace.externalReferences.citations.map((citation) => {
        const verification = effectiveCitationVerification(
          workspace,
          citation.id,
          workspace.updatedAt,
        );
        return {
          ...citation,
          verificationState: verification.verificationState,
          verificationSignalId: verification.signalId,
          verifiedBy: verification.verifiedBy,
          verifiedAt: verification.verifiedAt,
        };
      }),
      sourceRelations: relationViews(workspace),
      contributions: contributionViews(workspace),
      syntheses: synthesisViews(workspace),
      contentChangeProposals: contentChangeViews(workspace),
      audit: auditViews(workspace),
    },
    briefs: gaps.map(
      (gap) =>
        buildKnownVsNeededBrief(
          workspace,
          gap.id,
        ) as KnownVsNeededBriefDto,
    ),
  };
}
