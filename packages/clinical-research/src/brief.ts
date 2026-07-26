import type {
  EvidenceContribution,
  EvidenceGapRevision,
  ExpertOpinionRevision,
} from "./schemas.js";
import {
  assessCurrentSynthesisContributions,
  type ResearchWorkspace,
} from "./workspace.js";

export interface KnownBriefItem {
  kind: "formal_evidence" | "expert_opinion";
  id: string;
  role: EvidenceContribution["role"] | "expert_opinion";
  statement: string;
  applicabilityOrScope: string;
  reviewedAt: string;
  sourceId: string | null;
}

export interface ResearchSearchStatus {
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
}

export interface KnownVsNeededBrief {
  evidenceGapId: string;
  evidenceGapRevisionId: string;
  title: string;
  clinicalQuestion: string;
  gapStatus: EvidenceGapRevision["status"];
  known: KnownBriefItem[];
  needed: {
    whyNeeded: string;
    acceptanceCriteria: string[];
    openWork: string[];
  };
  searchStatus: ResearchSearchStatus;
  clinicalApprovalConferred: false;
}

const newestTimestamp = (values: readonly string[]) =>
  values.length === 0
    ? null
    : [...values].sort(
        (left, right) =>
          Date.parse(right) - Date.parse(left) ||
          right.localeCompare(left),
      )[0]!;

const addUtcDays = (timestamp: string, days: number) => {
  const value = new Date(timestamp);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString();
};

function findHead<Revision extends { revisionId: string }>(
  revisions: readonly Revision[],
  parentIds: ReadonlySet<string>,
): Revision | undefined {
  return [...revisions]
    .filter((revision) => !parentIds.has(revision.revisionId))
    .sort((left, right) => left.revisionId.localeCompare(right.revisionId))[0];
}

/**
 * Produces a stable, UI-ready brief without promoting Candidate metadata,
 * unreviewed AI output, or a Synthesis Proposal into "known" information.
 */
export function buildKnownVsNeededBrief(
  workspace: ResearchWorkspace,
  evidenceGapId: string,
): KnownVsNeededBrief {
  const gap = workspace.evidenceGaps.find(
    (candidate) => candidate.id === evidenceGapId,
  );
  if (!gap) throw new Error(`Unknown Evidence Gap: ${evidenceGapId}`);

  const gapRevisionParentIds = new Set(
    workspace.evidenceGapRevisions
      .map((revision) => revision.supersedesRevisionId)
      .filter((id): id is string => id !== null),
  );
  const gapRevision = findHead(
    workspace.evidenceGapRevisions.filter(
      (revision) => revision.gapId === evidenceGapId,
    ),
    gapRevisionParentIds,
  );
  if (!gapRevision) {
    throw new Error(`Evidence Gap has no current revision: ${evidenceGapId}`);
  }

  const contributionAssessment = assessCurrentSynthesisContributions(
    workspace,
    evidenceGapId,
    workspace.updatedAt,
  );
  const currentFormalContributions =
    contributionAssessment.eligibleContributions
      .filter(
        (contribution) => contribution.authority === "formal_source",
      )
      .sort((left, right) => left.id.localeCompare(right.id));

  const opinionParentIds = new Set(
    workspace.expertOpinionRevisions
      .map((revision) => revision.supersedesRevisionId)
      .filter((id): id is string => id !== null),
  );
  const reviewedOpinions = workspace.expertOpinionRevisions
    .filter(
      (opinion) =>
        opinion.reviewStatus === "accepted" &&
        opinion.reviewedAt !== null &&
        Date.parse(opinion.reviewedAt) <=
          Date.parse(workspace.updatedAt) &&
        opinion.evidenceGapIds.includes(evidenceGapId) &&
        !opinionParentIds.has(opinion.revisionId),
    )
    .sort((left, right) => left.revisionId.localeCompare(right.revisionId));

  const known: KnownBriefItem[] = [
    ...currentFormalContributions.map(
      (contribution): KnownBriefItem => ({
        kind: "formal_evidence",
        id: contribution.id,
        role: contribution.role,
        statement: contribution.statement,
        applicabilityOrScope: contribution.applicabilityNote,
        reviewedAt: contribution.reviewedAt!,
        sourceId: contribution.sourceId,
      }),
    ),
    ...reviewedOpinions.map(
      (opinion): KnownBriefItem => ({
        kind: "expert_opinion",
        id: opinion.revisionId,
        role: "expert_opinion",
        statement: opinion.statement,
        applicabilityOrScope: opinion.clinicalScope,
        reviewedAt: opinion.reviewedAt!,
        sourceId: null,
      }),
    ),
  ].sort(
    (left, right) =>
      left.kind.localeCompare(right.kind) || left.id.localeCompare(right.id),
  );

  const revisionIdsForGap = new Set(
    workspace.evidenceGapRevisions
      .filter((revision) => revision.gapId === evidenceGapId)
      .map((revision) => revision.revisionId),
  );
  const runs = workspace.searchRuns
    .filter((run) =>
      run.gapRevisionIds.some((revisionId) =>
        revisionIdsForGap.has(revisionId),
      ),
    )
    .sort((left, right) => left.id.localeCompare(right.id));
  const runIds = new Set(runs.map((run) => run.id));
  const candidateIdsObservedForGap = new Set(
    workspace.candidateObservations
      .filter((observation) => runIds.has(observation.searchRunId))
      .map((observation) => observation.candidateId),
  );
  const candidates = workspace.candidates
    .filter((candidate) => candidateIdsObservedForGap.has(candidate.id))
    .sort((left, right) => left.id.localeCompare(right.id));

  const screeningParentIds = new Set(
    workspace.screeningDecisions
      .map((decision) => decision.supersedesDecisionId)
      .filter((id): id is string => id !== null),
  );
  const latestScreeningByCandidate = new Map(
    workspace.screeningDecisions
      .filter(
        (decision) =>
          decision.gapId === evidenceGapId &&
          !screeningParentIds.has(decision.id),
      )
      .sort((left, right) => left.id.localeCompare(right.id))
      .map((decision) => [decision.candidateId, decision]),
  );

  const dispositionCount = (
    disposition:
      | "include"
      | "exclude"
      | "duplicate"
      | "awaiting_full_text"
      | "rights_blocked",
  ) =>
    [...latestScreeningByCandidate.values()].filter(
      (decision) => decision.disposition === disposition,
    ).length;

  const latestCompletedAt = newestTimestamp(
    runs.map((run) => run.completedAt),
  );
  const nextRefreshDueAt =
    latestCompletedAt !== null &&
    gapRevision.scoutPolicy.refreshIntervalDays !== null
      ? addUtcDays(
          latestCompletedAt,
          gapRevision.scoutPolicy.refreshIntervalDays,
        )
      : null;

  const searchStatus: ResearchSearchStatus = {
    runCount: runs.length,
    completedRunCount: runs.filter((run) => run.status === "completed").length,
    partialRunCount: runs.filter((run) => run.status === "partial").length,
    failedRunCount: runs.filter((run) => run.status === "failed").length,
    providerResultCountTotal: runs.reduce(
      (total, run) => total + run.providerResultCountTotal,
      0,
    ),
    providerRecordsInspected: runs.reduce(
      (total, run) => total + run.providerRecordsInspected,
      0,
    ),
    candidateCountCaptured: runs.reduce(
      (total, run) => total + run.candidateCountCaptured,
      0,
    ),
    candidateCountPresent: candidates.length,
    includedCount: dispositionCount("include"),
    excludedCount: dispositionCount("exclude"),
    duplicateCount: dispositionCount("duplicate"),
    awaitingFullTextCount: dispositionCount("awaiting_full_text"),
    rightsBlockedCount: dispositionCount("rights_blocked"),
    unscreenedCount: candidates.filter(
      (candidate) => !latestScreeningByCandidate.has(candidate.id),
    ).length,
    latestCompletedAt,
    nextRefreshDueAt,
  };

  const openWork: string[] = [];
  if (runs.length === 0) openWork.push("No evidence search has been recorded.");
  if (searchStatus.partialRunCount > 0) {
    openWork.push(
      `${searchStatus.partialRunCount} partial search run(s) require review or retry.`,
    );
  }
  if (searchStatus.failedRunCount > 0) {
    openWork.push(
      `${searchStatus.failedRunCount} failed search run(s) require review or retry.`,
    );
  }
  if (
    searchStatus.nextRefreshDueAt !== null &&
    Date.parse(searchStatus.nextRefreshDueAt) <=
      Date.parse(workspace.updatedAt)
  ) {
    openWork.push(
      `The literature search is stale and was due for refresh at ${searchStatus.nextRefreshDueAt}.`,
    );
  }
  if (searchStatus.unscreenedCount > 0) {
    openWork.push(
      `${searchStatus.unscreenedCount} candidate(s) await human screening.`,
    );
  }
  if (searchStatus.awaitingFullTextCount > 0) {
    openWork.push(
      `${searchStatus.awaitingFullTextCount} candidate(s) await permitted full-text review.`,
    );
  }
  if (searchStatus.rightsBlockedCount > 0) {
    openWork.push(
      `${searchStatus.rightsBlockedCount} candidate(s) are blocked by source-use rights.`,
    );
  }
  for (const blocked of contributionAssessment.blockedFormalContributions) {
    const blockCodes = new Set(blocked.blocks.map((block) => block.code));
    const conflictedCitationIds = blocked.blocks
      .filter((block) => block.code === "citation_conflict_identified")
      .map((block) => block.citationId)
      .filter((id): id is string => id !== undefined)
      .sort();
    if (conflictedCitationIds.length > 0) {
      openWork.push(
        `Reviewed Contribution ${blocked.contribution.id} is withheld from Known and synthesis because Citation ${conflictedCitationIds.join(", ")} has a current conflict-identification signal.`,
      );
    }
    const unverifiedCitationIds = blocked.blocks
      .filter(
        (block) =>
          block.code === "citation_human_verification_unavailable",
      )
      .map((block) => block.citationId)
      .filter((id): id is string => id !== undefined)
      .sort();
    if (unverifiedCitationIds.length > 0) {
      openWork.push(
        `Reviewed Contribution ${blocked.contribution.id} is withheld from Known and synthesis because Citation ${unverifiedCitationIds.join(", ")} is not currently human-verified.`,
      );
    }
    if (blockCodes.has("source_update_requires_currentness_review")) {
      openWork.push(
        `Reviewed Contribution ${blocked.contribution.id} is withheld from Known and synthesis because a newer Source update requires currentness review.`,
      );
    }
    const correctiveCodes = blocked.blocks
      .map((block) => block.code)
      .filter(
        (code) =>
          code === "source_corrected" ||
          code === "source_retracted" ||
          code === "source_superseded",
      );
    if (correctiveCodes.length > 0) {
      openWork.push(
        `Reviewed Contribution ${blocked.contribution.id} is withheld from Known and synthesis pending corrective-forward review (${correctiveCodes.join(", ")}).`,
      );
    }
    if (blockCodes.has("derived_content_rights_unavailable")) {
      openWork.push(
        `Reviewed Contribution ${blocked.contribution.id} is withheld from Known and synthesis because current Source rights do not permit derived clinical content.`,
      );
    }
  }
  if (currentFormalContributions.length === 0) {
    openWork.push("No current reviewed formal Evidence Contribution is available.");
  }

  const candidateById = new Map(
    candidates.map((candidate) => [candidate.id, candidate]),
  );
  const confirmedSourceTypes = new Set(
    [...latestScreeningByCandidate.values()].flatMap((decision) => {
      if (
        !["include", "duplicate"].includes(decision.disposition) ||
        decision.resolvedSourceId === null
      ) {
        return [];
      }
      const candidate = candidateById.get(decision.candidateId);
      return candidate ? [candidate.sourceType] : [];
    }),
  );
  for (const preferredSourceType of [
    ...gapRevision.scoutPolicy.preferredSourceTypes,
  ].sort()) {
    if (!confirmedSourceTypes.has(preferredSourceType)) {
      openWork.push(
        `Preferred Source type "${preferredSourceType}" has not been confirmed among included, human-screened Candidates.`,
      );
    }
  }

  const activeGap = !["resolved", "deferred", "withdrawn"].includes(
    gapRevision.status,
  );
  if (activeGap) {
    for (const criterion of gapRevision.acceptanceCriteria) {
      openWork.push(
        `Acceptance criterion awaits explicit reviewer confirmation: ${criterion}`,
      );
    }
  }

  const synthesisDecisionParentIds = new Set(
    workspace.synthesisDecisions
      .map((decision) => decision.supersedesDecisionId)
      .filter((id): id is string => id !== null),
  );
  const acceptedProposalIds = new Set(
    workspace.synthesisDecisions
      .filter(
        (decision) =>
          !synthesisDecisionParentIds.has(decision.id) &&
          ["accept", "narrow"].includes(decision.disposition) &&
          Date.parse(decision.reviewedAt) <=
            Date.parse(workspace.updatedAt) &&
          Date.parse(decision.recordedAt) <= Date.parse(workspace.updatedAt),
      )
      .map((decision) => decision.proposalId),
  );
  const reconciledContributionIds = new Set(
    workspace.synthesisProposals
      .filter((proposal) => acceptedProposalIds.has(proposal.id))
      .flatMap((proposal) => proposal.contributionIds),
  );
  for (const contribution of currentFormalContributions.filter(
    (candidate) =>
      ["challenges", "qualifies"].includes(candidate.role) &&
      !reconciledContributionIds.has(candidate.id),
  )) {
    openWork.push(
      `Reviewed ${contribution.role} Contribution ${contribution.id} still requires reconciliation in an accepted synthesis.`,
    );
  }

  const currentGapRevisionIds = new Set(
    workspace.evidenceGapRevisions
      .filter((revision) => revision.gapId === evidenceGapId)
      .map((revision) => revision.revisionId),
  );
  const unresolvedQuestions = new Set(
    workspace.synthesisProposals
      .filter((proposal) =>
        proposal.evidenceGapRevisionIds.some((revisionId) =>
          currentGapRevisionIds.has(revisionId),
        ),
      )
      .flatMap((proposal) => proposal.unresolvedQuestions),
  );
  for (const question of [...unresolvedQuestions].sort()) {
    openWork.push(`Reviewer question remains unresolved: ${question}`);
  }

  const currentContributionParentIds = new Set(
    workspace.contributions
      .map((contribution) => contribution.supersedesContributionId)
      .filter((id): id is string => id !== null),
  );
  const proposedContributionCount = workspace.contributions.filter(
    (contribution) =>
      contribution.evidenceGapIds.includes(evidenceGapId) &&
      contribution.reviewStatus === "proposed" &&
      !currentContributionParentIds.has(contribution.id),
  ).length;
  if (proposedContributionCount > 0) {
    openWork.push(
      `${proposedContributionCount} proposed Evidence Contribution(s) await human review.`,
    );
  }

  return {
    evidenceGapId,
    evidenceGapRevisionId: gapRevision.revisionId,
    title: gapRevision.title,
    clinicalQuestion: gapRevision.clinicalQuestion,
    gapStatus: gapRevision.status,
    known,
    needed: {
      whyNeeded: gapRevision.whyNeeded,
      acceptanceCriteria: [...gapRevision.acceptanceCriteria],
      openWork: [...new Set(openWork)],
    },
    searchStatus,
    clinicalApprovalConferred: false,
  };
}
