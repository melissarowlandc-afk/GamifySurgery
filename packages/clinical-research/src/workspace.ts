import { z } from "zod";

import { isoTimestampSchema, stableIdSchema } from "./identifiers.js";
import {
  citationVerificationSignalSchema,
  clinicalContentChangeProposalSchema,
  denyAllSourceRights,
  evidenceCandidateObservationSchema,
  evidenceCandidateSchema,
  evidenceContributionSchema,
  evidenceGapRevisionSchema,
  evidenceGapSchema,
  evidenceScreeningDecisionSchema,
  evidenceSearchRunSchema,
  evidenceSynthesisDecisionSchema,
  evidenceSynthesisProposalSchema,
  expertOpinionRevisionSchema,
  expertOpinionSchema,
  externalReferenceIndexSchema,
  sourceRelationSchema,
  sourceRightsDecisionSchema,
  type EvidenceContribution,
  type SourceRelation,
  type SourceRightsDecision,
  type SourceRightsPermissions,
} from "./schemas.js";

type RefinementContext = z.RefinementCtx;

const targetKey = (target: { kind: string; id: string }) =>
  `${target.kind}:${target.id}`;

const unique = <Value>(values: readonly Value[]) =>
  new Set(values).size === values.length;

function issue(
  context: RefinementContext,
  message: string,
  path: Array<string | number>,
) {
  context.addIssue({ code: "custom", message, path });
}

interface ChainRecord {
  id: string;
  owner: string;
  parentId: string | null;
  recordedAt: string;
  pathIndex: number;
}

function validateLinearChains(
  records: readonly ChainRecord[],
  context: RefinementContext,
  path: string,
  label: string,
  requireOneRootPerOwner: boolean,
) {
  const byId = new Map(records.map((record) => [record.id, record]));
  const rootsByOwner = new Map<string, number>();
  const childCounts = new Map<string, number>();

  for (const record of records) {
    if (record.parentId === null) {
      rootsByOwner.set(record.owner, (rootsByOwner.get(record.owner) ?? 0) + 1);
      continue;
    }
    const parent = byId.get(record.parentId);
    if (!parent) {
      issue(
        context,
        `${label} supersedes an unknown record: ${record.parentId}`,
        [path, record.pathIndex],
      );
      continue;
    }
    if (parent.owner !== record.owner) {
      issue(
        context,
        `${label} may supersede only a record in the same append-only series.`,
        [path, record.pathIndex],
      );
    }
    if (Date.parse(record.recordedAt) <= Date.parse(parent.recordedAt)) {
      issue(
        context,
        `${label} must be recorded after the record it supersedes.`,
        [path, record.pathIndex, "recordedAt"],
      );
    }
    childCounts.set(
      record.parentId,
      (childCounts.get(record.parentId) ?? 0) + 1,
    );
  }

  for (const [parentId, childCount] of childCounts) {
    if (childCount > 1) {
      const parent = byId.get(parentId);
      issue(
        context,
        `${label} history cannot fork; ${parentId} has ${childCount} successors.`,
        [path, parent?.pathIndex ?? 0],
      );
    }
  }

  if (requireOneRootPerOwner) {
    const owners = new Set(records.map((record) => record.owner));
    for (const owner of owners) {
      if ((rootsByOwner.get(owner) ?? 0) !== 1) {
        issue(
          context,
          `${label} series ${owner} must have exactly one root.`,
          [path],
        );
      }
    }
  }
}

const researchWorkspaceShape = z
  .object({
    schemaVersion: z.literal(1),
    id: stableIdSchema,
    createdAt: isoTimestampSchema,
    updatedAt: isoTimestampSchema,
    externalReferences: externalReferenceIndexSchema,
    citationVerificationSignals: z.array(citationVerificationSignalSchema),
    evidenceGaps: z.array(evidenceGapSchema),
    evidenceGapRevisions: z.array(evidenceGapRevisionSchema),
    sourceRelations: z.array(sourceRelationSchema),
    sourceRightsDecisions: z.array(sourceRightsDecisionSchema),
    searchRuns: z.array(evidenceSearchRunSchema),
    candidates: z.array(evidenceCandidateSchema),
    candidateObservations: z.array(evidenceCandidateObservationSchema),
    screeningDecisions: z.array(evidenceScreeningDecisionSchema),
    contributions: z.array(evidenceContributionSchema),
    expertOpinions: z.array(expertOpinionSchema),
    expertOpinionRevisions: z.array(expertOpinionRevisionSchema),
    synthesisProposals: z.array(evidenceSynthesisProposalSchema),
    synthesisDecisions: z.array(evidenceSynthesisDecisionSchema),
    contentChangeProposals: z.array(clinicalContentChangeProposalSchema),
  })
  .strict();

export type ResearchWorkspace = z.infer<typeof researchWorkspaceShape>;

function latestByEffectiveTime(
  decisions: readonly SourceRightsDecision[],
  at: string,
): SourceRightsDecision | null {
  const atMilliseconds = Date.parse(at);
  const eligible = decisions
    .filter(
      (decision) =>
        Date.parse(decision.effectiveAt) <= atMilliseconds &&
        Date.parse(decision.recordedAt) <= atMilliseconds,
    )
    .sort((left, right) => {
      const effectiveDifference =
        Date.parse(right.effectiveAt) - Date.parse(left.effectiveAt);
      if (effectiveDifference !== 0) return effectiveDifference;
      const recordedDifference =
        Date.parse(right.recordedAt) - Date.parse(left.recordedAt);
      if (recordedDifference !== 0) return recordedDifference;
      return right.id.localeCompare(left.id);
    });
  return eligible[0] ?? null;
}

/**
 * Returns the latest decision that had become effective by `at`. An expired
 * latest decision does not revive an older, superseded grant.
 */
export function getEffectiveSourceRightsDecision(
  workspace: ResearchWorkspace,
  sourceId: string,
  at = workspace.updatedAt,
): SourceRightsDecision | null {
  const latest = latestByEffectiveTime(
    workspace.sourceRightsDecisions.filter(
      (decision) => decision.sourceId === sourceId,
    ),
    at,
  );
  if (
    latest?.expiresAt !== null &&
    latest?.expiresAt !== undefined &&
    Date.parse(latest.expiresAt) <= Date.parse(at)
  ) {
    return null;
  }
  return latest;
}

export interface EffectiveSourceRights {
  decisionId: string | null;
  decisionStatus: SourceRightsDecision["decisionStatus"] | "implicit_default_deny";
  permissions: SourceRightsPermissions;
}

export function effectiveRightsForSource(
  workspace: ResearchWorkspace,
  sourceId: string,
  at = workspace.updatedAt,
): EffectiveSourceRights {
  const decision = getEffectiveSourceRightsDecision(workspace, sourceId, at);
  if (!decision) {
    return {
      decisionId: null,
      decisionStatus: "implicit_default_deny",
      permissions: { ...denyAllSourceRights },
    };
  }
  return {
    decisionId: decision.id,
    decisionStatus: decision.decisionStatus,
    permissions: { ...decision.permissions },
  };
}

export type SynthesisContributionBlockCode =
  | "derived_content_rights_unavailable"
  | "citation_human_verification_unavailable"
  | "citation_conflict_identified"
  | "source_corrected"
  | "source_retracted"
  | "source_superseded"
  | "source_update_requires_currentness_review";

export interface SynthesisContributionBlock {
  code: SynthesisContributionBlockCode;
  sourceRelationId: string | null;
  citationId?: string;
  citationVerificationSignalId?: string | null;
}

export interface BlockedSynthesisContribution {
  contribution: EvidenceContribution;
  blocks: SynthesisContributionBlock[];
}

export interface CurrentSynthesisContributionAssessment {
  eligibleContributions: EvidenceContribution[];
  blockedFormalContributions: BlockedSynthesisContribution[];
}

const visibleCurrentHeads = <
  RecordType extends {
    id: string;
    recordedAt: string;
    parentId: string | null;
  },
>(
  records: readonly RecordType[],
  atMilliseconds: number,
): RecordType[] => {
  const visible = records.filter(
    (record) => Date.parse(record.recordedAt) <= atMilliseconds,
  );
  const supersededIds = new Set(
    visible
      .map((record) => record.parentId)
      .filter((id): id is string => id !== null),
  );
  return visible.filter((record) => !supersededIds.has(record.id));
};

export interface EffectiveCitationVerification {
  citationId: string;
  verificationState:
    | "unverified"
    | "human_verified"
    | "conflict_identified";
  signalId: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  recordedAt: string | null;
}

export function effectiveCitationVerification(
  workspace: ResearchWorkspace,
  citationId: string,
  at = workspace.updatedAt,
): EffectiveCitationVerification {
  const atMilliseconds = Date.parse(at);
  if (Number.isNaN(atMilliseconds)) {
    throw new RangeError(
      "Citation verification lookup requires a valid timestamp.",
    );
  }
  const current = visibleCurrentHeads(
    workspace.citationVerificationSignals
      .filter((signal) => signal.citationId === citationId)
      .map((signal) => ({
        ...signal,
        parentId: signal.supersedesSignalId,
      })),
    atMilliseconds,
  ).sort(
    (left, right) =>
      Date.parse(right.recordedAt) - Date.parse(left.recordedAt) ||
      Date.parse(right.verifiedAt) - Date.parse(left.verifiedAt) ||
      right.id.localeCompare(left.id),
  )[0];
  if (!current) {
    return {
      citationId,
      verificationState: "unverified",
      signalId: null,
      verifiedBy: null,
      verifiedAt: null,
      recordedAt: null,
    };
  }
  return {
    citationId,
    verificationState: current.verificationState,
    signalId: current.id,
    verifiedBy: current.verifiedBy,
    verifiedAt: current.verifiedAt,
    recordedAt: current.recordedAt,
  };
}

const activeSourceRelationsAt = (
  workspace: ResearchWorkspace,
  atMilliseconds: number,
): SourceRelation[] =>
  visibleCurrentHeads(
    workspace.sourceRelations.map((relation) => ({
      ...relation,
      parentId: relation.supersedesRelationId,
    })),
    atMilliseconds,
  )
    .filter((relation) => relation.relationStatus === "active")
    .sort(
      (left, right) =>
        left.relationType.localeCompare(right.relationType) ||
        left.id.localeCompare(right.id),
    );

/**
 * Computes synthesis eligibility at an explicit audit time. Later rights
 * decisions, contribution revisions, and Source Relations therefore cannot
 * retroactively invalidate a historical Synthesis Proposal.
 */
export function assessCurrentSynthesisContributions(
  workspace: ResearchWorkspace,
  evidenceGapId: string,
  at = workspace.updatedAt,
): CurrentSynthesisContributionAssessment {
  const atMilliseconds = Date.parse(at);
  if (Number.isNaN(atMilliseconds)) {
    throw new RangeError("Synthesis eligibility requires a valid timestamp.");
  }

  const currentAccepted = visibleCurrentHeads(
    workspace.contributions.map((contribution) => ({
      ...contribution,
      parentId: contribution.supersedesContributionId,
    })),
    atMilliseconds,
  )
    .filter(
      (contribution) =>
        contribution.reviewStatus === "accepted" &&
        contribution.reviewedAt !== null &&
        Date.parse(contribution.reviewedAt) <= atMilliseconds &&
        contribution.evidenceGapIds.includes(evidenceGapId),
    )
    .sort((left, right) => left.id.localeCompare(right.id));
  const activeRelations = activeSourceRelationsAt(
    workspace,
    atMilliseconds,
  );
  const currentAcceptedOpinionRevisionIds = new Set(
    visibleCurrentHeads(
      workspace.expertOpinionRevisions.map((revision) => ({
        ...revision,
        id: revision.revisionId,
        parentId: revision.supersedesRevisionId,
      })),
      atMilliseconds,
    )
      .filter(
        (revision) =>
          revision.reviewStatus === "accepted" &&
          revision.reviewedAt !== null &&
          Date.parse(revision.reviewedAt) <= atMilliseconds,
      )
      .map((revision) => revision.revisionId),
  );

  const eligibleContributions: EvidenceContribution[] = [];
  const blockedFormalContributions: BlockedSynthesisContribution[] = [];
  for (const { parentId: _parentId, ...contribution } of currentAccepted) {
    if (contribution.authority === "expert_opinion") {
      if (
        contribution.expertOpinionRevisionId !== null &&
        currentAcceptedOpinionRevisionIds.has(
          contribution.expertOpinionRevisionId,
        )
      ) {
        eligibleContributions.push(contribution);
      }
      continue;
    }
    if (
      contribution.authority !== "formal_source" ||
      contribution.sourceId === null
    ) {
      eligibleContributions.push(contribution);
      continue;
    }

    const blocks: SynthesisContributionBlock[] = [];
    const rights = effectiveRightsForSource(
      workspace,
      contribution.sourceId,
      at,
    );
    if (!rights.permissions.derivedClinicalContent) {
      blocks.push({
        code: "derived_content_rights_unavailable",
        sourceRelationId: null,
      });
    }
    for (const citationId of contribution.citationIds) {
      const verification = effectiveCitationVerification(
        workspace,
        citationId,
        at,
      );
      if (verification.verificationState === "human_verified") continue;
      blocks.push({
        code:
          verification.verificationState === "conflict_identified"
            ? "citation_conflict_identified"
            : "citation_human_verification_unavailable",
        sourceRelationId: null,
        citationId,
        citationVerificationSignalId: verification.signalId,
      });
    }
    for (const relation of activeRelations.filter(
      (candidate) => candidate.toSourceId === contribution.sourceId,
    )) {
      const codeByRelationType = {
        corrects: "source_corrected",
        retracts: "source_retracted",
        supersedes: "source_superseded",
        updates: "source_update_requires_currentness_review",
      } as const;
      const code =
        codeByRelationType[
          relation.relationType as keyof typeof codeByRelationType
        ];
      if (code) {
        blocks.push({ code, sourceRelationId: relation.id });
      }
    }

    if (blocks.length === 0) {
      eligibleContributions.push(contribution);
    } else {
      blockedFormalContributions.push({ contribution, blocks });
    }
  }

  return {
    eligibleContributions,
    blockedFormalContributions,
  };
}

export function currentSynthesisEligibleContributions(
  workspace: ResearchWorkspace,
  evidenceGapId: string,
  at = workspace.updatedAt,
): EvidenceContribution[] {
  return assessCurrentSynthesisContributions(
    workspace,
    evidenceGapId,
    at,
  ).eligibleContributions;
}

export const researchWorkspaceSchema = researchWorkspaceShape.superRefine(
  (workspace, context) => {
    const sourceIds = new Set(
      workspace.externalReferences.sources.map((source) => source.id),
    );
    const citationsById = new Map(
      workspace.externalReferences.citations.map((citation) => [
        citation.id,
        citation,
      ]),
    );
    const targetIds = new Set(
      workspace.externalReferences.clinicalTargets.map(targetKey),
    );
    const targetRevisionIds = new Set(
      workspace.externalReferences.clinicalTargets.map((target) => target.id),
    );

    const idRecords: Array<{
      id: string;
      category: string;
      path: Array<string | number>;
    }> = [];
    const addIds = <Value>(
      values: readonly Value[],
      category: string,
      path: string,
      select: (value: Value) => string,
    ) => {
      values.forEach((value, index) =>
        idRecords.push({
          id: select(value),
          category,
          path: [path, index],
        }),
      );
    };
    addIds(
      workspace.externalReferences.sources,
      "Source",
      "externalReferences.sources",
      (value) => value.id,
    );
    addIds(
      workspace.externalReferences.citations,
      "Citation",
      "externalReferences.citations",
      (value) => value.id,
    );
    addIds(
      workspace.citationVerificationSignals,
      "Citation Verification Signal",
      "citationVerificationSignals",
      (value) => value.id,
    );
    addIds(
      workspace.externalReferences.clinicalApprovals,
      "Clinical Approval",
      "externalReferences.clinicalApprovals",
      (value) => value.id,
    );
    addIds(workspace.evidenceGaps, "Evidence Gap", "evidenceGaps", (value) => value.id);
    addIds(
      workspace.evidenceGapRevisions,
      "Evidence Gap revision",
      "evidenceGapRevisions",
      (value) => value.revisionId,
    );
    addIds(
      workspace.sourceRelations,
      "Source Relation",
      "sourceRelations",
      (value) => value.id,
    );
    addIds(
      workspace.sourceRightsDecisions,
      "Source Rights Decision",
      "sourceRightsDecisions",
      (value) => value.id,
    );
    addIds(workspace.searchRuns, "Search Run", "searchRuns", (value) => value.id);
    addIds(workspace.candidates, "Evidence Candidate", "candidates", (value) => value.id);
    addIds(
      workspace.candidateObservations,
      "Evidence Candidate Observation",
      "candidateObservations",
      (value) => value.id,
    );
    addIds(
      workspace.screeningDecisions,
      "Screening Decision",
      "screeningDecisions",
      (value) => value.id,
    );
    addIds(
      workspace.contributions,
      "Evidence Contribution",
      "contributions",
      (value) => value.id,
    );
    addIds(
      workspace.expertOpinions,
      "Expert Opinion",
      "expertOpinions",
      (value) => value.id,
    );
    addIds(
      workspace.expertOpinionRevisions,
      "Expert Opinion revision",
      "expertOpinionRevisions",
      (value) => value.revisionId,
    );
    addIds(
      workspace.synthesisProposals,
      "Synthesis Proposal",
      "synthesisProposals",
      (value) => value.id,
    );
    addIds(
      workspace.synthesisDecisions,
      "Synthesis Decision",
      "synthesisDecisions",
      (value) => value.id,
    );
    addIds(
      workspace.contentChangeProposals,
      "Content Change Proposal",
      "contentChangeProposals",
      (value) => value.id,
    );

    const seenIds = new Map<string, (typeof idRecords)[number]>();
    for (const record of idRecords) {
      const prior = seenIds.get(record.id);
      if (prior) {
        issue(
          context,
          `${record.category} ID ${record.id} collides with ${prior.category}; Candidate, Source, Citation, Approval, and research-record identities must remain distinct.`,
          record.path,
        );
      } else {
        seenIds.set(record.id, record);
      }
    }

    const duplicateTargets = workspace.externalReferences.clinicalTargets
      .map(targetKey)
      .filter((key, index, all) => all.indexOf(key) !== index);
    if (duplicateTargets.length > 0) {
      issue(
        context,
        `Clinical Target references must be unique: ${duplicateTargets.join(", ")}`,
        ["externalReferences", "clinicalTargets"],
      );
    }

    workspace.externalReferences.citations.forEach((citation, index) => {
      if (!sourceIds.has(citation.sourceId)) {
        issue(
          context,
          `Citation references an unknown Source: ${citation.sourceId}`,
          ["externalReferences", "citations", index, "sourceId"],
        );
      }
      if (citation.verificationState !== "unverified") {
        const rootSignal = workspace.citationVerificationSignals.find(
          (signal) =>
            signal.citationId === citation.id &&
            signal.supersedesSignalId === null,
        );
        if (
          !rootSignal ||
          rootSignal.verificationState !== citation.verificationState ||
          rootSignal.verifiedBy !== citation.verifiedBy ||
          rootSignal.verifiedAt !== citation.verifiedAt
        ) {
          issue(
            context,
            "A verified Citation reference requires a matching immutable root verification signal.",
            ["externalReferences", "citations", index],
          );
        }
      }
    });
    workspace.citationVerificationSignals.forEach((signal, index) => {
      if (!citationsById.has(signal.citationId)) {
        issue(
          context,
          `Citation Verification Signal references an unknown Citation: ${signal.citationId}`,
          ["citationVerificationSignals", index, "citationId"],
        );
      }
    });
    validateLinearChains(
      workspace.citationVerificationSignals.map((signal, index) => ({
        id: signal.id,
        owner: signal.citationId,
        parentId: signal.supersedesSignalId,
        recordedAt: signal.recordedAt,
        pathIndex: index,
      })),
      context,
      "citationVerificationSignals",
      "Citation Verification Signal",
      true,
    );
    workspace.externalReferences.clinicalApprovals.forEach(
      (approval, index) => {
        if (!targetRevisionIds.has(approval.targetRevisionId)) {
          issue(
            context,
            `Clinical Approval references an unknown clinical target revision: ${approval.targetRevisionId}`,
            [
              "externalReferences",
              "clinicalApprovals",
              index,
              "targetRevisionId",
            ],
          );
        }
      },
    );

    const gapsById = new Map(
      workspace.evidenceGaps.map((gap) => [gap.id, gap]),
    );
    const gapRevisionsById = new Map(
      workspace.evidenceGapRevisions.map((revision) => [
        revision.revisionId,
        revision,
      ]),
    );
    for (const gap of workspace.evidenceGaps) {
      if (
        !workspace.evidenceGapRevisions.some(
          (revision) => revision.gapId === gap.id,
        )
      ) {
        issue(
          context,
          `Evidence Gap ${gap.id} requires at least one revision.`,
          ["evidenceGaps"],
        );
      }
    }
    workspace.evidenceGapRevisions.forEach((revision, index) => {
      const gap = gapsById.get(revision.gapId);
      if (!gap) {
        issue(
          context,
          `Evidence Gap revision references unknown Gap: ${revision.gapId}`,
          ["evidenceGapRevisions", index, "gapId"],
        );
      } else if (Date.parse(revision.recordedAt) < Date.parse(gap.createdAt)) {
        issue(
          context,
          "An Evidence Gap revision cannot predate its Gap.",
          ["evidenceGapRevisions", index, "recordedAt"],
        );
      }
      revision.targetContent.forEach((target, targetIndex) => {
        if (!targetIds.has(targetKey(target))) {
          issue(
            context,
            `Evidence Gap references an unknown clinical target: ${targetKey(target)}`,
            [
              "evidenceGapRevisions",
              index,
              "targetContent",
              targetIndex,
            ],
          );
        }
      });
    });
    validateLinearChains(
      workspace.evidenceGapRevisions.map((revision, index) => ({
        id: revision.revisionId,
        owner: revision.gapId,
        parentId: revision.supersedesRevisionId,
        recordedAt: revision.recordedAt,
        pathIndex: index,
      })),
      context,
      "evidenceGapRevisions",
      "Evidence Gap revision",
      true,
    );

    const relationsById = new Map(
      workspace.sourceRelations.map((relation) => [relation.id, relation]),
    );
    workspace.sourceRelations.forEach((relation, index) => {
      for (const [field, sourceId] of [
        ["fromSourceId", relation.fromSourceId],
        ["toSourceId", relation.toSourceId],
      ] as const) {
        if (!sourceIds.has(sourceId)) {
          issue(
            context,
            `Source Relation references an unknown Source: ${sourceId}`,
            ["sourceRelations", index, field],
          );
        }
      }
      if (relation.supersedesRelationId !== null) {
        const parent = relationsById.get(relation.supersedesRelationId);
        if (
          parent &&
          (parent.fromSourceId !== relation.fromSourceId ||
            parent.toSourceId !== relation.toSourceId ||
            parent.relationType !== relation.relationType)
        ) {
          issue(
            context,
            "A Source Relation may supersede only the same typed Source pair.",
            ["sourceRelations", index, "supersedesRelationId"],
          );
        }
      }
    });
    validateLinearChains(
      workspace.sourceRelations.map((relation, index) => ({
        id: relation.id,
        owner: `${relation.fromSourceId}:${relation.relationType}:${relation.toSourceId}`,
        parentId: relation.supersedesRelationId,
        recordedAt: relation.recordedAt,
        pathIndex: index,
      })),
      context,
      "sourceRelations",
      "Source Relation",
      true,
    );

    const rightsById = new Map(
      workspace.sourceRightsDecisions.map((decision) => [
        decision.id,
        decision,
      ]),
    );
    workspace.sourceRightsDecisions.forEach((decision, index) => {
      if (!sourceIds.has(decision.sourceId)) {
        issue(
          context,
          `Rights Decision references an unknown Source: ${decision.sourceId}`,
          ["sourceRightsDecisions", index, "sourceId"],
        );
      }
      if (decision.supersedesDecisionId !== null) {
        const parent = rightsById.get(decision.supersedesDecisionId);
        if (
          parent &&
          Date.parse(decision.effectiveAt) < Date.parse(parent.effectiveAt)
        ) {
          issue(
            context,
            "A successor Rights Decision cannot become effective before its predecessor.",
            ["sourceRightsDecisions", index, "effectiveAt"],
          );
        }
      }
    });
    validateLinearChains(
      workspace.sourceRightsDecisions.map((decision, index) => ({
        id: decision.id,
        owner: decision.sourceId,
        parentId: decision.supersedesDecisionId,
        recordedAt: decision.recordedAt,
        pathIndex: index,
      })),
      context,
      "sourceRightsDecisions",
      "Source Rights Decision",
      true,
    );

    const runsById = new Map(workspace.searchRuns.map((run) => [run.id, run]));
    workspace.searchRuns.forEach((run, index) => {
      for (const revisionId of run.gapRevisionIds) {
        const revision = gapRevisionsById.get(revisionId);
        if (!revision) {
          issue(
            context,
            `Search Run references an unknown Gap revision: ${revisionId}`,
            ["searchRuns", index, "gapRevisionIds"],
          );
        } else if (
          Date.parse(run.startedAt) < Date.parse(revision.recordedAt)
        ) {
          issue(
            context,
            "A Search Run cannot predate the Gap revision that requested it.",
            ["searchRuns", index, "startedAt"],
          );
        }
      }
    });

    const candidatesById = new Map(
      workspace.candidates.map((candidate) => [candidate.id, candidate]),
    );
    const observationsByCandidateId = new Map<string, Set<string>>();
    workspace.candidates.forEach((candidate, index) => {
      const run = runsById.get(candidate.searchRunId);
      if (!run) {
        issue(
          context,
          `Candidate references an unknown Search Run: ${candidate.searchRunId}`,
          ["candidates", index, "searchRunId"],
        );
      } else if (
        Date.parse(candidate.discoveredAt) < Date.parse(run.startedAt) ||
        Date.parse(candidate.discoveredAt) > Date.parse(run.completedAt)
      ) {
        issue(
          context,
          "Candidate discovery must fall within its completed Search Run.",
          ["candidates", index, "discoveredAt"],
        );
      }
      if (
        candidate.matchedExistingSourceId !== null &&
        !sourceIds.has(candidate.matchedExistingSourceId)
      ) {
        issue(
          context,
          `Candidate matches an unknown Source: ${candidate.matchedExistingSourceId}`,
          ["candidates", index, "matchedExistingSourceId"],
        );
      }
    });
    const duplicateDois = workspace.candidates
      .flatMap((candidate) =>
        candidate.doi ? [candidate.doi.toLocaleLowerCase()] : [],
      )
      .filter((doi, index, all) => all.indexOf(doi) !== index);
    if (duplicateDois.length > 0) {
      issue(
        context,
        `Evidence Candidate DOI identities must be unique: ${[...new Set(duplicateDois)].join(", ")}`,
        ["candidates"],
      );
    }
    const duplicatePmids = workspace.candidates
      .flatMap((candidate) => (candidate.pmid ? [candidate.pmid] : []))
      .filter((pmid, index, all) => all.indexOf(pmid) !== index);
    if (duplicatePmids.length > 0) {
      issue(
        context,
        `Evidence Candidate PMID identities must be unique: ${[...new Set(duplicatePmids)].join(", ")}`,
        ["candidates"],
      );
    }
    const observedCandidateRunPairs = new Set<string>();
    const candidateByObservedIdentity = new Map<string, string>();
    workspace.candidateObservations.forEach((observation, index) => {
      const candidate = candidatesById.get(observation.candidateId);
      const run = runsById.get(observation.searchRunId);
      if (!candidate) {
        issue(
          context,
          `Candidate Observation references an unknown Candidate: ${observation.candidateId}`,
          ["candidateObservations", index, "candidateId"],
        );
      }
      if (!run) {
        issue(
          context,
          `Candidate Observation references an unknown Search Run: ${observation.searchRunId}`,
          ["candidateObservations", index, "searchRunId"],
        );
      } else if (
        Date.parse(observation.observedAt) < Date.parse(run.startedAt) ||
        Date.parse(observation.observedAt) > Date.parse(run.completedAt)
      ) {
        issue(
          context,
          "Candidate observation must fall within its completed Search Run.",
          ["candidateObservations", index, "observedAt"],
        );
      } else if (
        !run.queries.some(
          (query) =>
            query.databaseOrRegistry.trim().toLocaleLowerCase() ===
            observation.provider,
        )
      ) {
        issue(
          context,
          "Candidate Observation provider must match a provider recorded by its Search Run.",
          ["candidateObservations", index, "provider"],
        );
      }
      const pair = `${observation.candidateId}:${observation.searchRunId}`;
      if (observedCandidateRunPairs.has(pair)) {
        issue(
          context,
          "A Candidate may be observed only once in the same Search Run.",
          ["candidateObservations", index],
        );
      }
      observedCandidateRunPairs.add(pair);
      const identities = [
        `provider:${observation.provider}:${observation.providerRecordId}`,
        ...(observation.observedDoi
          ? [`doi:${observation.observedDoi.toLocaleLowerCase()}`]
          : []),
        ...(observation.observedPmid
          ? [`pmid:${observation.observedPmid}`]
          : []),
      ];
      for (const identity of identities) {
        const priorCandidateId =
          candidateByObservedIdentity.get(identity);
        if (
          priorCandidateId !== undefined &&
          priorCandidateId !== observation.candidateId
        ) {
          issue(
            context,
            `Observed bibliographic identity ${identity} maps to more than one Candidate.`,
            ["candidateObservations", index],
          );
        } else {
          candidateByObservedIdentity.set(
            identity,
            observation.candidateId,
          );
        }
      }
      const runIds =
        observationsByCandidateId.get(observation.candidateId) ??
        new Set<string>();
      runIds.add(observation.searchRunId);
      observationsByCandidateId.set(observation.candidateId, runIds);
    });
    workspace.candidates.forEach((candidate, index) => {
      if (
        !observedCandidateRunPairs.has(
          `${candidate.id}:${candidate.searchRunId}`,
        )
      ) {
        issue(
          context,
          "A Candidate requires an immutable observation in its first Search Run.",
          ["candidates", index, "searchRunId"],
        );
      }
    });
    workspace.searchRuns.forEach((run, index) => {
      const count = workspace.candidateObservations.filter(
        (observation) => observation.searchRunId === run.id,
      ).length;
      if (count !== run.candidateCountCaptured) {
        issue(
          context,
          `Search Run records ${run.candidateCountCaptured} captured candidates but the workspace contains ${count} observations.`,
          ["searchRuns", index, "candidateCountCaptured"],
        );
      }
    });

    workspace.screeningDecisions.forEach((decision, index) => {
      const candidate = candidatesById.get(decision.candidateId);
      if (!candidate) {
        issue(
          context,
          `Screening Decision references an unknown Candidate: ${decision.candidateId}`,
          ["screeningDecisions", index, "candidateId"],
        );
      }
      if (!gapsById.has(decision.gapId)) {
        issue(
          context,
          `Screening Decision references an unknown Evidence Gap: ${decision.gapId}`,
          ["screeningDecisions", index, "gapId"],
        );
      }
      if (decision.resolvedSourceId !== null && !sourceIds.has(decision.resolvedSourceId)) {
        issue(
          context,
          `Screening Decision resolves to an unknown Source: ${decision.resolvedSourceId}`,
          ["screeningDecisions", index, "resolvedSourceId"],
        );
      }
      if (candidate) {
        const runGapIds = new Set(
          [...(observationsByCandidateId.get(candidate.id) ?? [])]
            .flatMap(
              (runId) => runsById.get(runId)?.gapRevisionIds ?? [],
            )
            .map((revisionId) => gapRevisionsById.get(revisionId)?.gapId)
            .filter((gapId): gapId is string => gapId !== undefined),
        );
        if (!runGapIds.has(decision.gapId)) {
          issue(
            context,
            "A Screening Decision may address only a Gap in which the Candidate was observed.",
            ["screeningDecisions", index, "gapId"],
          );
        }
      }
    });
    validateLinearChains(
      workspace.screeningDecisions.map((decision, index) => ({
        id: decision.id,
        owner: `${decision.candidateId}:${decision.gapId}`,
        parentId: decision.supersedesDecisionId,
        recordedAt: decision.recordedAt,
        pathIndex: index,
      })),
      context,
      "screeningDecisions",
      "Screening Decision",
      true,
    );

    const opinionsById = new Map(
      workspace.expertOpinions.map((opinion) => [opinion.id, opinion]),
    );
    const opinionRevisionsById = new Map(
      workspace.expertOpinionRevisions.map((revision) => [
        revision.revisionId,
        revision,
      ]),
    );
    const contributionsById = new Map(
      workspace.contributions.map((contribution) => [
        contribution.id,
        contribution,
      ]),
    );

    workspace.expertOpinions.forEach((opinion) => {
      if (
        !workspace.expertOpinionRevisions.some(
          (revision) => revision.opinionId === opinion.id,
        )
      ) {
        issue(
          context,
          `Expert Opinion ${opinion.id} requires at least one revision.`,
          ["expertOpinions"],
        );
      }
    });
    workspace.expertOpinionRevisions.forEach((revision, index) => {
      const opinion = opinionsById.get(revision.opinionId);
      if (!opinion) {
        issue(
          context,
          `Opinion revision references unknown Opinion: ${revision.opinionId}`,
          ["expertOpinionRevisions", index, "opinionId"],
        );
      } else if (Date.parse(revision.recordedAt) < Date.parse(opinion.createdAt)) {
        issue(
          context,
          "An Opinion revision cannot predate its Opinion.",
          ["expertOpinionRevisions", index, "recordedAt"],
        );
      }
      revision.evidenceGapIds.forEach((gapId) => {
        if (!gapsById.has(gapId)) {
          issue(
            context,
            `Opinion revision references unknown Evidence Gap: ${gapId}`,
            ["expertOpinionRevisions", index, "evidenceGapIds"],
          );
        }
      });
      revision.relatedFormalContributionIds.forEach((contributionId) => {
        const contribution = contributionsById.get(contributionId);
        if (!contribution || contribution.authority !== "formal_source") {
          issue(
            context,
            `Opinion may relate only to a formal Evidence Contribution: ${contributionId}`,
            [
              "expertOpinionRevisions",
              index,
              "relatedFormalContributionIds",
            ],
          );
        }
      });
    });
    validateLinearChains(
      workspace.expertOpinionRevisions.map((revision, index) => ({
        id: revision.revisionId,
        owner: revision.opinionId,
        parentId: revision.supersedesRevisionId,
        recordedAt: revision.recordedAt,
        pathIndex: index,
      })),
      context,
      "expertOpinionRevisions",
      "Expert Opinion revision",
      true,
    );

    workspace.contributions.forEach((contribution, index) => {
      contribution.evidenceGapIds.forEach((gapId) => {
        if (!gapsById.has(gapId)) {
          issue(
            context,
            `Contribution references unknown Evidence Gap: ${gapId}`,
            ["contributions", index, "evidenceGapIds"],
          );
        }
      });
      contribution.targetContent.forEach((target, targetIndex) => {
        if (!targetIds.has(targetKey(target))) {
          issue(
            context,
            `Contribution references unknown clinical target: ${targetKey(target)}`,
            ["contributions", index, "targetContent", targetIndex],
          );
        }
      });
      if (!unique(contribution.citationIds)) {
        issue(
          context,
          "Contribution Citation IDs must be unique.",
          ["contributions", index, "citationIds"],
        );
      }
      if (contribution.authority === "formal_source" && contribution.sourceId) {
        if (!sourceIds.has(contribution.sourceId)) {
          issue(
            context,
            `Contribution references an unknown Source: ${contribution.sourceId}`,
            ["contributions", index, "sourceId"],
          );
        }
        contribution.citationIds.forEach((citationId) => {
          const citation = citationsById.get(citationId);
          if (!citation) {
            issue(
              context,
              `Contribution references an unknown Citation: ${citationId}`,
              ["contributions", index, "citationIds"],
            );
          } else {
            if (citation.sourceId !== contribution.sourceId) {
              issue(
                context,
                "A formal Contribution's Citations must belong to its Source.",
                ["contributions", index, "citationIds"],
              );
            }
            if (
              contribution.reviewStatus === "accepted" &&
              effectiveCitationVerification(
                workspace,
                citationId,
                contribution.reviewedAt!,
              ).verificationState !== "human_verified"
            ) {
              issue(
                context,
                "An accepted formal Contribution requires human-verified Citations as of its review time.",
                ["contributions", index, "citationIds"],
              );
            }
          }
        });
        const rights = effectiveRightsForSource(
          workspace,
          contribution.sourceId,
          contribution.recordedAt,
        );
        if (!rights.permissions.derivedClinicalContent) {
          issue(
            context,
            "Creating a formal Evidence Contribution requires effective permission for derived clinical content.",
            ["contributions", index, "sourceId"],
          );
        }
        if (
          contribution.generatedBy === "ai" &&
          !rights.permissions.externalAiProcessing
        ) {
          issue(
            context,
            "An AI-generated Contribution requires effective external-AI processing permission.",
            ["contributions", index, "generatedBy"],
          );
        }
      }
      if (contribution.authority === "expert_opinion") {
        const opinionRevision =
          contribution.expertOpinionRevisionId === null
            ? undefined
            : opinionRevisionsById.get(contribution.expertOpinionRevisionId);
        if (!opinionRevision) {
          issue(
            context,
            `Contribution references an unknown Expert Opinion revision: ${contribution.expertOpinionRevisionId}`,
            ["contributions", index, "expertOpinionRevisionId"],
          );
        } else if (
          contribution.reviewStatus === "accepted" &&
          opinionRevision.reviewStatus !== "accepted"
        ) {
          issue(
            context,
            "An accepted Expert Opinion Contribution requires an accepted Opinion revision.",
            ["contributions", index, "expertOpinionRevisionId"],
          );
        }
      }
    });
    validateLinearChains(
      workspace.contributions.map((contribution, index) => ({
        id: contribution.id,
        owner: contribution.seriesId,
        parentId: contribution.supersedesContributionId,
        recordedAt: contribution.recordedAt,
        pathIndex: index,
      })),
      context,
      "contributions",
      "Evidence Contribution",
      true,
    );

    const opinionRevisionChildren = new Map<
      string,
      typeof workspace.expertOpinionRevisions
    >();
    workspace.expertOpinionRevisions.forEach((revision) => {
      if (revision.supersedesRevisionId === null) return;
      const children =
        opinionRevisionChildren.get(revision.supersedesRevisionId) ?? [];
      children.push(revision);
      opinionRevisionChildren.set(revision.supersedesRevisionId, children);
    });
    const synthesisProposalsById = new Map(
      workspace.synthesisProposals.map((proposal) => [proposal.id, proposal]),
    );
    workspace.synthesisProposals.forEach((proposal, index) => {
      const proposalGapIds = new Set(
        proposal.evidenceGapRevisionIds
          .map((revisionId) => gapRevisionsById.get(revisionId)?.gapId)
          .filter((gapId): gapId is string => gapId !== undefined),
      );
      const eligibleContributionIds = new Set(
        [...proposalGapIds].flatMap((gapId) =>
          currentSynthesisEligibleContributions(
            workspace,
            gapId,
            proposal.recordedAt,
          ).map((contribution) => contribution.id),
        ),
      );
      proposal.evidenceGapRevisionIds.forEach((revisionId) => {
        if (!gapRevisionsById.has(revisionId)) {
          issue(
            context,
            `Synthesis references an unknown Gap revision: ${revisionId}`,
            ["synthesisProposals", index, "evidenceGapRevisionIds"],
          );
        }
      });
      proposal.searchRunIds.forEach((runId) => {
        if (!runsById.has(runId)) {
          issue(
            context,
            `Synthesis references an unknown Search Run: ${runId}`,
            ["synthesisProposals", index, "searchRunIds"],
          );
        }
      });
      proposal.contributionIds.forEach((contributionId) => {
        if (!eligibleContributionIds.has(contributionId)) {
          issue(
            context,
            `Synthesis may use only current accepted Contributions that are rights-cleared and unaffected by corrective or currentness-review Source Relations as of its recorded time: ${contributionId}`,
            ["synthesisProposals", index, "contributionIds"],
          );
        }
      });
      proposal.expertOpinionRevisionIds.forEach((revisionId) => {
        const opinion = opinionRevisionsById.get(revisionId);
        if (
          !opinion ||
          opinion.reviewStatus !== "accepted" ||
          Date.parse(opinion.recordedAt) > Date.parse(proposal.recordedAt) ||
          opinion.reviewedAt === null ||
          Date.parse(opinion.reviewedAt) >
            Date.parse(proposal.recordedAt) ||
          (opinionRevisionChildren.get(revisionId) ?? []).some(
            (child) =>
              Date.parse(child.recordedAt) <=
              Date.parse(proposal.recordedAt),
          )
        ) {
          issue(
            context,
            `Synthesis may use only current accepted Expert Opinion revisions as of its recorded time: ${revisionId}`,
            ["synthesisProposals", index, "expertOpinionRevisionIds"],
          );
        }
      });
      if (proposal.generationProvenance) {
        const expectedContributions = [...proposal.contributionIds].sort();
        const actualContributions = [
          ...proposal.generationProvenance.inputContributionIds,
        ].sort();
        const expectedOpinions = [...proposal.expertOpinionRevisionIds].sort();
        const actualOpinions = [
          ...proposal.generationProvenance.inputOpinionRevisionIds,
        ].sort();
        if (
          JSON.stringify(expectedContributions) !==
            JSON.stringify(actualContributions) ||
          JSON.stringify(expectedOpinions) !== JSON.stringify(actualOpinions)
        ) {
          issue(
            context,
            "Generation provenance must list exactly the Contributions and Opinions used by the Synthesis.",
            ["synthesisProposals", index, "generationProvenance"],
          );
        }
      }
    });

    workspace.synthesisDecisions.forEach((decision, index) => {
      const proposal = synthesisProposalsById.get(decision.proposalId);
      if (!proposal) {
        issue(
          context,
          `Synthesis Decision references unknown Proposal: ${decision.proposalId}`,
          ["synthesisDecisions", index, "proposalId"],
        );
      } else if (Date.parse(decision.reviewedAt) < Date.parse(proposal.recordedAt)) {
        issue(
          context,
          "Synthesis review cannot predate its Proposal.",
          ["synthesisDecisions", index, "reviewedAt"],
        );
      }
      decision.resultingEvidenceGapIds.forEach((gapId) => {
        if (!gapsById.has(gapId)) {
          issue(
            context,
            `Synthesis Decision references unknown resulting Gap: ${gapId}`,
            ["synthesisDecisions", index, "resultingEvidenceGapIds"],
          );
        }
      });
    });
    validateLinearChains(
      workspace.synthesisDecisions.map((decision, index) => ({
        id: decision.id,
        owner: decision.proposalId,
        parentId: decision.supersedesDecisionId,
        recordedAt: decision.recordedAt,
        pathIndex: index,
      })),
      context,
      "synthesisDecisions",
      "Evidence Synthesis Decision",
      true,
    );

    const synthesisDecisionsById = new Map(
      workspace.synthesisDecisions.map((decision) => [decision.id, decision]),
    );
    workspace.contentChangeProposals.forEach((proposal, index) => {
      const decision = synthesisDecisionsById.get(
        proposal.synthesisDecisionId,
      );
      if (
        !decision ||
        !["accept", "narrow"].includes(decision.disposition)
      ) {
        issue(
          context,
          "A Content Change Proposal requires an accepted or narrowed Synthesis Decision.",
          ["contentChangeProposals", index, "synthesisDecisionId"],
        );
      } else if (Date.parse(proposal.recordedAt) < Date.parse(decision.recordedAt)) {
        issue(
          context,
          "A Content Change Proposal cannot predate its Synthesis Decision.",
          ["contentChangeProposals", index, "recordedAt"],
        );
      } else {
        const visibleDecisions = workspace.synthesisDecisions.filter(
          (candidate) =>
            candidate.proposalId === decision.proposalId &&
            Date.parse(candidate.recordedAt) <=
              Date.parse(proposal.recordedAt) &&
            Date.parse(candidate.reviewedAt) <=
              Date.parse(proposal.recordedAt),
        );
        const supersededDecisionIds = new Set(
          visibleDecisions
            .map((candidate) => candidate.supersedesDecisionId)
            .filter((id): id is string => id !== null),
        );
        const currentDecision = visibleDecisions.find(
          (candidate) => !supersededDecisionIds.has(candidate.id),
        );
        if (currentDecision?.id !== decision.id) {
          issue(
            context,
            "A Content Change Proposal must use the current Synthesis Decision head as of the handoff time.",
            ["contentChangeProposals", index, "synthesisDecisionId"],
          );
        }
        const synthesisProposal = synthesisProposalsById.get(
          decision.proposalId,
        );
        if (synthesisProposal !== undefined) {
          const synthesisTargetKeys = new Set(
            synthesisProposal.evidenceGapRevisionIds.flatMap(
              (revisionId) =>
                gapRevisionsById
                  .get(revisionId)
                  ?.targetContent.map(targetKey) ?? [],
            ),
          );
          const crossesTargetBoundary = proposal.targetContent.some(
            (target) => !synthesisTargetKeys.has(targetKey(target)),
          );
          if (
            crossesTargetBoundary &&
            proposal.crossTargetReview === null
          ) {
            issue(
              context,
              "A Content Change Proposal may target only content declared by its Synthesis Gap unless an explicit reviewed cross-target rationale is recorded.",
              ["contentChangeProposals", index, "crossTargetReview"],
            );
          }
          if (
            !crossesTargetBoundary &&
            proposal.crossTargetReview !== null
          ) {
            issue(
              context,
              "A same-target Content Change Proposal must not claim an unnecessary cross-target review.",
              ["contentChangeProposals", index, "crossTargetReview"],
            );
          }
          const evidenceGapIds = new Set(
            synthesisProposal.evidenceGapRevisionIds
              .map(
                (revisionId) =>
                  gapRevisionsById.get(revisionId)?.gapId,
              )
              .filter((id): id is string => id !== undefined),
          );
          const currentlyEligibleContributionIds = new Set(
            [...evidenceGapIds].flatMap((gapId) =>
              currentSynthesisEligibleContributions(
                workspace,
                gapId,
                proposal.recordedAt,
              ).map((contribution) => contribution.id),
            ),
          );
          if (
            synthesisProposal.contributionIds.some(
              (contributionId) =>
                !currentlyEligibleContributionIds.has(contributionId),
            )
          ) {
            issue(
              context,
              "A Content Change Proposal requires a fresh Synthesis because one or more contributing records are no longer current and eligible.",
              ["contentChangeProposals", index, "synthesisDecisionId"],
            );
          }
        }
      }
      proposal.targetContent.forEach((target, targetIndex) => {
        if (!targetIds.has(targetKey(target))) {
          issue(
            context,
            `Content Change Proposal references unknown clinical target: ${targetKey(target)}`,
            [
              "contentChangeProposals",
              index,
              "targetContent",
              targetIndex,
            ],
          );
        }
      });
    });

    const timestamps = [
      ...workspace.evidenceGaps.map((value) => value.createdAt),
      ...workspace.evidenceGapRevisions.map((value) => value.recordedAt),
      ...workspace.citationVerificationSignals.flatMap((value) => [
        value.verifiedAt,
        value.recordedAt,
      ]),
      ...workspace.sourceRelations.map((value) => value.recordedAt),
      ...workspace.sourceRightsDecisions.map((value) => value.recordedAt),
      ...workspace.searchRuns.map((value) => value.recordedAt),
      ...workspace.candidates.map((value) => value.recordedAt),
      ...workspace.candidateObservations.flatMap((value) => [
        value.observedAt,
        value.recordedAt,
      ]),
      ...workspace.screeningDecisions.map((value) => value.recordedAt),
      ...workspace.contributions.flatMap((value) => [
        value.recordedAt,
        ...(value.reviewedAt ? [value.reviewedAt] : []),
      ]),
      ...workspace.expertOpinions.map((value) => value.createdAt),
      ...workspace.expertOpinionRevisions.flatMap((value) => [
        value.recordedAt,
        ...(value.reviewedAt ? [value.reviewedAt] : []),
      ]),
      ...workspace.synthesisProposals.map((value) => value.recordedAt),
      ...workspace.synthesisDecisions.map((value) => value.recordedAt),
      ...workspace.contentChangeProposals.flatMap((value) => [
        value.recordedAt,
        ...(value.crossTargetReview
          ? [value.crossTargetReview.reviewedAt]
          : []),
      ]),
    ];
    if (
      timestamps.some(
        (timestamp) =>
          Date.parse(timestamp) > Date.parse(workspace.updatedAt),
      )
    ) {
      issue(
        context,
        "Workspace updatedAt cannot predate a contained record.",
        ["updatedAt"],
      );
    }
    if (Date.parse(workspace.updatedAt) < Date.parse(workspace.createdAt)) {
      issue(
        context,
        "Workspace updatedAt cannot predate creation.",
        ["updatedAt"],
      );
    }
  },
);

export function validateResearchWorkspace(candidate: unknown): ResearchWorkspace {
  return researchWorkspaceSchema.parse(candidate);
}

export class ResearchWorkspaceTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResearchWorkspaceTransitionError";
  }
}

type WorkspaceRecord = Record<string, unknown>;

const deepEqual = (left: unknown, right: unknown) =>
  JSON.stringify(left) === JSON.stringify(right);

/**
 * Enforces append-only persistence at the browser/API boundary. Reordering is
 * harmless, but an existing record may not be edited, removed, or silently
 * replaced. Any correction must be a new revision or superseding decision.
 */
export function assertAppendOnlyWorkspaceTransition(
  previousCandidate: unknown,
  nextCandidate: unknown,
): ResearchWorkspace {
  const previous = validateResearchWorkspace(previousCandidate);
  const next = validateResearchWorkspace(nextCandidate);

  if (
    previous.schemaVersion !== next.schemaVersion ||
    previous.id !== next.id ||
    previous.createdAt !== next.createdAt
  ) {
    throw new ResearchWorkspaceTransitionError(
      "Workspace schemaVersion, id, and createdAt are immutable.",
    );
  }
  if (Date.parse(next.updatedAt) <= Date.parse(previous.updatedAt)) {
    throw new ResearchWorkspaceTransitionError(
      "An append-only transition must advance updatedAt.",
    );
  }

  const collections: Array<{
    label: string;
    previous: readonly WorkspaceRecord[];
    next: readonly WorkspaceRecord[];
    key: (record: WorkspaceRecord) => string;
  }> = [
    {
      label: "external Source",
      previous: previous.externalReferences.sources,
      next: next.externalReferences.sources,
      key: (record) => String(record.id),
    },
    {
      label: "external Citation",
      previous: previous.externalReferences.citations,
      next: next.externalReferences.citations,
      key: (record) => String(record.id),
    },
    {
      label: "Citation Verification Signal",
      previous: previous.citationVerificationSignals,
      next: next.citationVerificationSignals,
      key: (record) => String(record.id),
    },
    {
      label: "external clinical target",
      previous: previous.externalReferences.clinicalTargets,
      next: next.externalReferences.clinicalTargets,
      key: (record) => `${String(record.kind)}:${String(record.id)}`,
    },
    {
      label: "external Clinical Approval",
      previous: previous.externalReferences.clinicalApprovals,
      next: next.externalReferences.clinicalApprovals,
      key: (record) => String(record.id),
    },
    {
      label: "Evidence Gap",
      previous: previous.evidenceGaps,
      next: next.evidenceGaps,
      key: (record) => String(record.id),
    },
    {
      label: "Evidence Gap revision",
      previous: previous.evidenceGapRevisions,
      next: next.evidenceGapRevisions,
      key: (record) => String(record.revisionId),
    },
    {
      label: "Source Relation",
      previous: previous.sourceRelations,
      next: next.sourceRelations,
      key: (record) => String(record.id),
    },
    {
      label: "Source Rights Decision",
      previous: previous.sourceRightsDecisions,
      next: next.sourceRightsDecisions,
      key: (record) => String(record.id),
    },
    {
      label: "Search Run",
      previous: previous.searchRuns,
      next: next.searchRuns,
      key: (record) => String(record.id),
    },
    {
      label: "Evidence Candidate",
      previous: previous.candidates,
      next: next.candidates,
      key: (record) => String(record.id),
    },
    {
      label: "Evidence Candidate Observation",
      previous: previous.candidateObservations,
      next: next.candidateObservations,
      key: (record) => String(record.id),
    },
    {
      label: "Screening Decision",
      previous: previous.screeningDecisions,
      next: next.screeningDecisions,
      key: (record) => String(record.id),
    },
    {
      label: "Evidence Contribution",
      previous: previous.contributions,
      next: next.contributions,
      key: (record) => String(record.id),
    },
    {
      label: "Expert Opinion",
      previous: previous.expertOpinions,
      next: next.expertOpinions,
      key: (record) => String(record.id),
    },
    {
      label: "Expert Opinion revision",
      previous: previous.expertOpinionRevisions,
      next: next.expertOpinionRevisions,
      key: (record) => String(record.revisionId),
    },
    {
      label: "Synthesis Proposal",
      previous: previous.synthesisProposals,
      next: next.synthesisProposals,
      key: (record) => String(record.id),
    },
    {
      label: "Synthesis Decision",
      previous: previous.synthesisDecisions,
      next: next.synthesisDecisions,
      key: (record) => String(record.id),
    },
    {
      label: "Content Change Proposal",
      previous: previous.contentChangeProposals,
      next: next.contentChangeProposals,
      key: (record) => String(record.id),
    },
  ];

  let appendedRecords = 0;
  for (const collection of collections) {
    const nextByKey = new Map(
      collection.next.map((record) => [collection.key(record), record]),
    );
    for (const priorRecord of collection.previous) {
      const key = collection.key(priorRecord);
      const nextRecord = nextByKey.get(key);
      if (!nextRecord) {
        throw new ResearchWorkspaceTransitionError(
          `Append-only transition removed ${collection.label} ${key}.`,
        );
      }
      if (!deepEqual(priorRecord, nextRecord)) {
        throw new ResearchWorkspaceTransitionError(
          `Append-only transition rewrote ${collection.label} ${key}.`,
        );
      }
    }
    appendedRecords += collection.next.length - collection.previous.length;
  }

  if (appendedRecords === 0) {
    throw new ResearchWorkspaceTransitionError(
      "Append-only transition contains no new record.",
    );
  }
  return next;
}
