import { describe, expect, it } from "vitest";

import {
  ResearchWorkspaceTransitionError,
  assessCurrentSynthesisContributions,
  assertAppendOnlyWorkspaceTransition,
  currentSynthesisEligibleContributions,
  denyAllSourceRights,
  effectiveCitationVerification,
  effectiveRightsForSource,
  getEffectiveSourceRightsDecision,
  researchWorkspaceSchema,
  scoutPolicySchema,
  sourceRightsDecisionSchema,
  validateResearchWorkspace,
} from "../src/index.js";
import type { ResearchWorkspace } from "../src/index.js";
import { makeResearchWorkspace } from "./fixture.js";

const clone = <Value>(value: Value): Value =>
  JSON.parse(JSON.stringify(value)) as Value;

const messagesFor = (candidate: unknown) => {
  const result = researchWorkspaceSchema.safeParse(candidate);
  expect(result.success).toBe(false);
  return result.success
    ? ""
    : result.error.issues.map((issue) => issue.message).join("\n");
};

describe("browser-safe clinical research domain", () => {
  it("accepts a fully linked append-only research workspace", () => {
    const workspace = makeResearchWorkspace();

    expect(validateResearchWorkspace(workspace)).toEqual(workspace);
  });

  it("keeps Candidate, Source, Citation, Approval, and research identities distinct", () => {
    const workspace = makeResearchWorkspace();
    workspace.candidates[0]!.id = "source.one";

    expect(messagesFor(workspace)).toContain(
      "Candidate, Source, Citation, Approval, and research-record identities must remain distinct",
    );
  });

  it("fails closed when bibliographic identities map to multiple Candidates", () => {
    const duplicateDoi = makeResearchWorkspace();
    duplicateDoi.candidates[0]!.doi =
      duplicateDoi.candidates[1]!.doi;
    expect(messagesFor(duplicateDoi)).toContain(
      "Evidence Candidate DOI identities must be unique",
    );

    const duplicateProviderRecord = makeResearchWorkspace();
    duplicateProviderRecord.candidateObservations[1]!.provider =
      duplicateProviderRecord.candidateObservations[0]!.provider;
    duplicateProviderRecord.candidateObservations[1]!.providerRecordId =
      duplicateProviderRecord.candidateObservations[0]!.providerRecordId;
    expect(messagesFor(duplicateProviderRecord)).toContain(
      "maps to more than one Candidate",
    );
  });

  it("uses the deterministic latest rights decision and defaults unknown decisions to deny", () => {
    const workspace = makeResearchWorkspace();
    workspace.sourceRightsDecisions.reverse();

    expect(
      getEffectiveSourceRightsDecision(
        workspace,
        "source.one",
        "2026-01-10T00:00:00.000Z",
      )?.id,
    ).toBe("rights.source.one.open");
    expect(
      effectiveRightsForSource(workspace, "source.one").permissions
        .derivedClinicalContent,
    ).toBe(true);

    const implicit = effectiveRightsForSource(workspace, "source.two");
    expect(implicit.decisionId).toBeNull();
    expect(implicit.decisionStatus).toBe("implicit_default_deny");
    expect(Object.values(implicit.permissions).every((allowed) => !allowed)).toBe(
      true,
    );
  });

  it("does not revive an older permission after the latest decision expires", () => {
    const workspace = makeResearchWorkspace();
    workspace.sourceRightsDecisions[1]!.expiresAt =
      "2026-01-09T00:00:00.000Z";

    expect(
      getEffectiveSourceRightsDecision(
        workspace,
        "source.one",
        "2026-01-10T00:00:00.000Z",
      ),
    ).toBeNull();
    expect(
      effectiveRightsForSource(
        workspace,
        "source.one",
        "2026-01-10T00:00:00.000Z",
      ),
    ).toMatchObject({
      decisionId: null,
      decisionStatus: "implicit_default_deny",
    });
  });

  it("rejects a default-deny decision that grants any permission", () => {
    const decision = clone(
      makeResearchWorkspace().sourceRightsDecisions[0]!,
    );
    decision.permissions.bibliographicMetadata = true;

    const result = sourceRightsDecisionSchema.safeParse(decision);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message).join("\n")).toContain(
        "default-deny decision must deny every permission",
      );
    }
  });

  it("requires literal provider strategies and cadence only for automated scouting", () => {
    const automatic = clone(
      makeResearchWorkspace().evidenceGapRevisions[0]!.scoutPolicy,
    );
    automatic.refreshIntervalDays = null;
    expect(scoutPolicySchema.safeParse(automatic).success).toBe(false);

    const manual = {
      ...automatic,
      mode: "manual_only" as const,
      providerStrategies: [] as typeof automatic.providerStrategies,
      refreshIntervalDays: null,
    };
    expect(scoutPolicySchema.safeParse(manual).success).toBe(true);

    manual.providerStrategies = [
      {
        provider: "pubmed",
        query: "literal query",
        filters: [],
      },
    ];
    expect(scoutPolicySchema.safeParse(manual).success).toBe(false);
  });

  it("does not allow accepted formal evidence without a verified matching citation", () => {
    const workspace = makeResearchWorkspace();
    workspace.externalReferences.citations[0]!.verificationState = "unverified";
    workspace.externalReferences.citations[0]!.verifiedBy = null;
    workspace.externalReferences.citations[0]!.verifiedAt = null;
    workspace.citationVerificationSignals = [];

    expect(messagesFor(workspace)).toContain(
      "accepted formal Contribution requires human-verified Citations",
    );
  });

  it("evaluates Citation verification as of contribution review time", () => {
    const workspace = makeResearchWorkspace();
    const citation = workspace.externalReferences.citations[0]!;
    const signal = workspace.citationVerificationSignals[0]!;
    citation.verifiedAt = "2026-01-05T00:00:00.000Z";
    signal.verifiedAt = "2026-01-05T00:00:00.000Z";
    signal.recordedAt = "2026-01-05T00:00:00.000Z";

    expect(messagesFor(workspace)).toContain(
      "accepted formal Contribution requires human-verified Citations as of its review time",
    );
  });

  it("does not allow accepted formal evidence when current rights are default-deny", () => {
    const workspace = makeResearchWorkspace();
    workspace.sourceRightsDecisions = [
      workspace.sourceRightsDecisions[0]!,
    ];

    expect(messagesFor(workspace)).toContain(
      "Creating a formal Evidence Contribution requires effective permission for derived clinical content",
    );
  });

  it("allows a Synthesis to cite only current accepted contributions", () => {
    const workspace = makeResearchWorkspace();
    workspace.synthesisProposals[0]!.contributionIds.push(
      "contribution.formal.proposed",
    );

    expect(messagesFor(workspace)).toContain(
      "Synthesis may use only current accepted Contributions",
    );
  });

  it("does not make accepted Contributions or Opinions eligible before their review time", () => {
    const workspace = makeResearchWorkspace();

    expect(
      currentSynthesisEligibleContributions(
        workspace,
        "gap.one",
        "2026-01-04T11:30:00.000Z",
      ).map((entry) => entry.id),
    ).not.toContain("contribution.formal.one");
    expect(
      currentSynthesisEligibleContributions(
        workspace,
        "gap.one",
        "2026-01-04T12:00:00.000Z",
      ).map((entry) => entry.id),
    ).toContain("contribution.formal.one");
    expect(
      currentSynthesisEligibleContributions(
        workspace,
        "gap.one",
        "2026-01-05T12:30:00.000Z",
      ).map((entry) => entry.id),
    ).not.toContain("contribution.expert.one");
    expect(
      currentSynthesisEligibleContributions(
        workspace,
        "gap.one",
        "2026-01-05T13:00:00.000Z",
      ).map((entry) => entry.id),
    ).toContain("contribution.expert.one");

    workspace.synthesisProposals.push({
      ...workspace.synthesisProposals[0]!,
      id: "synthesis.before-opinion-review",
      contributionIds: ["contribution.formal.one"],
      recordedAt: "2026-01-05T10:30:00.000Z",
    });
    expect(messagesFor(workspace)).toContain(
      "current accepted Expert Opinion revisions as of its recorded time",
    );
  });

  it("preserves a historical synthesis after its evidence is corrected forward", () => {
    const workspace = makeResearchWorkspace();
    const formal = workspace.contributions.find(
      (entry) => entry.id === "contribution.formal.one",
    )!;
    workspace.contributions.push({
      ...formal,
      id: "contribution.formal.corrected",
      supersedesContributionId: formal.id,
      statement:
        "A later review narrows which findings can support imaging.",
      reviewedAt: "2026-01-09T10:00:00.000Z",
      recordedAt: "2026-01-09T09:00:00.000Z",
      recordedBy: "author.two",
    });
    const opinion = workspace.expertOpinionRevisions[0]!;
    workspace.expertOpinionRevisions.push({
      ...opinion,
      revisionId: "opinion.rev.two",
      supersedesRevisionId: opinion.revisionId,
      statement:
        "A later expert review further narrows the prototype interpretation.",
      reviewedAt: "2026-01-09T12:00:00.000Z",
      recordedAt: "2026-01-09T11:00:00.000Z",
      recordedBy: "expert.two",
      changeSummary:
        "Correct the interpretation without rewriting the prior synthesis.",
    });

    expect(validateResearchWorkspace(workspace)).toEqual(workspace);
    expect(workspace.synthesisProposals[0]!.contributionIds).toContain(
      "contribution.formal.one",
    );
    expect(
      workspace.synthesisProposals[0]!.expertOpinionRevisionIds,
    ).toContain("opinion.rev.one");
  });

  it("quarantines a current Citation conflict without invalidating historical synthesis or handoff", () => {
    const workspace = makeResearchWorkspace();
    workspace.citationVerificationSignals.push({
      id: "citation-verification.citation.one.conflict.v2",
      citationId: "citation.one",
      supersedesSignalId:
        "citation-verification.citation.one.human.v1",
      verificationState: "conflict_identified",
      verifiedBy: "reviewer.conflict.one",
      verifiedAt: "2026-01-09T00:00:00.000Z",
      recordedAt: "2026-01-09T00:00:00.000Z",
    });

    expect(validateResearchWorkspace(workspace)).toEqual(workspace);
    expect(
      effectiveCitationVerification(
        workspace,
        "citation.one",
        "2026-01-08T00:00:00.000Z",
      ),
    ).toMatchObject({
      verificationState: "human_verified",
      verifiedBy: "reviewer.clinical.one",
    });
    expect(
      effectiveCitationVerification(
        workspace,
        "citation.one",
        workspace.updatedAt,
      ),
    ).toMatchObject({
      verificationState: "conflict_identified",
      verifiedBy: "reviewer.conflict.one",
    });
    const current = assessCurrentSynthesisContributions(
      workspace,
      "gap.one",
      workspace.updatedAt,
    );
    expect(
      current.eligibleContributions.map((entry) => entry.id),
    ).not.toContain("contribution.formal.one");
    expect(current.blockedFormalContributions[0]!.blocks).toContainEqual(
      expect.objectContaining({
        code: "citation_conflict_identified",
        citationId: "citation.one",
      }),
    );
  });

  it("requires fresh synthesis before a new handoff after Citation conflict", () => {
    const workspace = makeResearchWorkspace();
    workspace.citationVerificationSignals.push({
      id: "citation-verification.citation.one.conflict.v2",
      citationId: "citation.one",
      supersedesSignalId:
        "citation-verification.citation.one.human.v1",
      verificationState: "conflict_identified",
      verifiedBy: "reviewer.conflict.one",
      verifiedAt: "2026-01-09T00:00:00.000Z",
      recordedAt: "2026-01-09T00:00:00.000Z",
    });
    workspace.contentChangeProposals.push({
      ...workspace.contentChangeProposals[0]!,
      id: "change.after-citation-conflict",
      recordedAt: "2026-01-09T01:00:00.000Z",
    });

    expect(messagesFor(workspace)).toContain(
      "requires a fresh Synthesis because one or more contributing records are no longer current and eligible",
    );
  });

  it("quarantines a contribution when its Expert Opinion is no longer the current accepted revision", () => {
    const workspace = makeResearchWorkspace();
    const prior = workspace.expertOpinionRevisions[0]!;
    workspace.expertOpinionRevisions.push({
      ...prior,
      revisionId: "opinion.rev.rejected.v2",
      supersedesRevisionId: prior.revisionId,
      reviewStatus: "rejected",
      reviewedAt: "2026-01-09T01:00:00.000Z",
      reviewedBy: "reviewer.clinical.two",
      recordedAt: "2026-01-09T00:00:00.000Z",
      recordedBy: "expert.two",
      changeSummary:
        "Withdraw the prior opinion prospectively after review.",
    });

    expect(validateResearchWorkspace(workspace)).toEqual(workspace);
    expect(
      currentSynthesisEligibleContributions(
        workspace,
        "gap.one",
        "2026-01-08T00:00:00.000Z",
      ).map((entry) => entry.id),
    ).toContain("contribution.expert.one");
    expect(
      currentSynthesisEligibleContributions(
        workspace,
        "gap.one",
        workspace.updatedAt,
      ).map((entry) => entry.id),
    ).not.toContain("contribution.expert.one");
  });

  it.each(["corrects", "retracts", "supersedes", "updates"] as const)(
    "blocks current formal evidence affected by an active %s relation without rewriting historical synthesis",
    (relationType) => {
      const workspace = makeResearchWorkspace();
      workspace.sourceRelations.push({
        id: `relation.${relationType}.one`,
        fromSourceId: "source.two",
        toSourceId: "source.one",
        relationType,
        relationStatus: "active",
        supersedesRelationId: null,
        note: "Recorded after the historical synthesis for forward review.",
        recordedAt: "2026-01-09T00:00:00.000Z",
        recordedBy: "reviewer.evidence",
      });

      expect(validateResearchWorkspace(workspace)).toEqual(workspace);
      expect(
        currentSynthesisEligibleContributions(
          workspace,
          "gap.one",
          "2026-01-08T00:00:00.000Z",
        ).map((entry) => entry.id),
      ).toContain("contribution.formal.one");

      const assessment = assessCurrentSynthesisContributions(
        workspace,
        "gap.one",
        workspace.updatedAt,
      );
      expect(
        assessment.eligibleContributions.map((entry) => entry.id),
      ).not.toContain("contribution.formal.one");
      expect(
        assessment.blockedFormalContributions[0]!.blocks[0]!.code,
      ).toBe(
        {
          corrects: "source_corrected",
          retracts: "source_retracted",
          supersedes: "source_superseded",
          updates: "source_update_requires_currentness_review",
        }[relationType],
      );
    },
  );

  it("uses rights known at the audit time and does not apply a later-recorded revocation retroactively", () => {
    const workspace = makeResearchWorkspace();
    const prior = workspace.sourceRightsDecisions.at(-1)!;
    workspace.sourceRightsDecisions.push({
      ...prior,
      id: "rights.source.one.revoked",
      supersedesDecisionId: prior.id,
      decisionStatus: "revoked",
      legalBasis: "unreviewed",
      permissions: { ...denyAllSourceRights },
      licenseLabel: null,
      licenseUrl: null,
      termsUrl: null,
      attributionStatement: null,
      requiredNotices: [],
      thirdPartyMaterialPolicy: "excluded",
      reviewedAt: "2026-01-09T00:00:00.000Z",
      effectiveAt: "2026-01-05T00:00:00.000Z",
      recordedAt: "2026-01-09T01:00:00.000Z",
      notes: "Rights were revoked prospectively when this record was made.",
    });

    expect(validateResearchWorkspace(workspace)).toEqual(workspace);
    expect(
      currentSynthesisEligibleContributions(
        workspace,
        "gap.one",
        "2026-01-06T00:00:00.000Z",
      ).map((entry) => entry.id),
    ).toContain("contribution.formal.one");
    const current = assessCurrentSynthesisContributions(
      workspace,
      "gap.one",
      workspace.updatedAt,
    );
    expect(
      current.eligibleContributions.map((entry) => entry.id),
    ).not.toContain("contribution.formal.one");
    expect(current.blockedFormalContributions[0]!.blocks).toContainEqual({
      code: "derived_content_rights_unavailable",
      sourceRelationId: null,
    });
  });

  it("rejects a new synthesis that cites evidence blocked at its recorded time", () => {
    const workspace = makeResearchWorkspace();
    workspace.sourceRelations.push({
      id: "relation.update.after-synthesis",
      fromSourceId: "source.two",
      toSourceId: "source.one",
      relationType: "updates",
      relationStatus: "active",
      supersedesRelationId: null,
      note: "A newer update requires currentness review.",
      recordedAt: "2026-01-09T00:00:00.000Z",
      recordedBy: "reviewer.evidence",
    });
    workspace.synthesisProposals.push({
      ...workspace.synthesisProposals[0]!,
      id: "synthesis.after-update",
      recordedAt: "2026-01-09T01:00:00.000Z",
    });

    expect(messagesFor(workspace)).toContain(
      "unaffected by corrective or currentness-review Source Relations",
    );
  });

  it("requires the accepted decision to be the current head when a content handoff is created", () => {
    const workspace = makeResearchWorkspace();
    workspace.synthesisDecisions.push({
      id: "synthesis.decision.rejected-later",
      proposalId: "synthesis.one",
      supersedesDecisionId: "synthesis.decision.one",
      disposition: "reject",
      acceptedStatement: null,
      rationale: "A later review rejects new handoffs.",
      resultingEvidenceGapIds: [],
      reviewedAt: "2026-01-09T00:00:00.000Z",
      reviewedBy: "reviewer.clinical",
      recordedAt: "2026-01-09T01:00:00.000Z",
      clinicalApprovalId: null,
    });

    // The handoff recorded before the later rejection remains reproducible.
    expect(validateResearchWorkspace(workspace)).toEqual(workspace);

    workspace.contentChangeProposals.push({
      ...workspace.contentChangeProposals[0]!,
      id: "change.after-rejection",
      recordedAt: "2026-01-09T02:00:00.000Z",
    });
    expect(messagesFor(workspace)).toContain(
      "must use the current Synthesis Decision head as of the handoff time",
    );
  });

  it("requires an explicit reviewed rationale for a cross-target content handoff", () => {
    const workspace = makeResearchWorkspace();
    const handoff = workspace.contentChangeProposals[0]!;
    handoff.targetContent = [
      { kind: "clinical_topic_revision", id: "topic.rev.one" },
    ];

    expect(messagesFor(workspace)).toContain(
      "may target only content declared by its Synthesis Gap unless an explicit reviewed cross-target rationale is recorded",
    );

    handoff.crossTargetReview = {
      rationale:
        "The reviewed evidence also requires a coordinated topic-summary update.",
      reviewedAt: "2026-01-07T12:00:00.000Z",
      reviewedBy: "reviewer.clinical",
    };
    expect(validateResearchWorkspace(workspace)).toEqual(workspace);
  });

  it("rejects a misleading cross-target review on a same-target handoff", () => {
    const workspace = makeResearchWorkspace();
    workspace.contentChangeProposals[0]!.crossTargetReview = {
      rationale: "This review is not needed for the declared Gap target.",
      reviewedAt: "2026-01-07T12:00:00.000Z",
      reviewedBy: "reviewer.clinical",
    };

    expect(messagesFor(workspace)).toContain(
      "must not claim an unnecessary cross-target review",
    );
  });

  it("requires an accepted or narrowed Synthesis before proposing a content change", () => {
    const workspace = makeResearchWorkspace();
    workspace.synthesisDecisions[0]!.disposition = "reject";
    workspace.synthesisDecisions[0]!.acceptedStatement = null;

    expect(messagesFor(workspace)).toContain(
      "Content Change Proposal requires an accepted or narrowed Synthesis Decision",
    );
  });

  it("does not let research records masquerade as clinical approval", () => {
    const workspace = clone(makeResearchWorkspace()) as unknown as {
      synthesisProposals: Array<{ clinicalApprovalId: string | null }>;
    };
    workspace.synthesisProposals[0]!.clinicalApprovalId = "approval.one";

    const result = researchWorkspaceSchema.safeParse(workspace);
    expect(result.success).toBe(false);
  });
});

describe("append-only workspace transitions", () => {
  const appendSourceRelation = (previous: ResearchWorkspace) => {
    const next = clone(previous);
    next.updatedAt = "2026-01-11T00:00:00.000Z";
    next.sourceRelations.push({
      id: "relation.two",
      fromSourceId: "source.one",
      toSourceId: "source.two",
      relationType: "companion_to",
      relationStatus: "active",
      supersedesRelationId: null,
      note: "A second immutable relationship record.",
      recordedAt: "2026-01-10T12:00:00.000Z",
      recordedBy: "reviewer.rights",
    });
    return next;
  };

  it("accepts a transition that appends a record and preserves prior records", () => {
    const previous = makeResearchWorkspace();
    const next = appendSourceRelation(previous);

    expect(assertAppendOnlyWorkspaceTransition(previous, next)).toEqual(next);
  });

  it("allows harmless collection reordering when a new record is appended", () => {
    const previous = makeResearchWorkspace();
    const next = appendSourceRelation(previous);
    next.candidates.reverse();
    next.sourceRightsDecisions.reverse();

    expect(assertAppendOnlyWorkspaceTransition(previous, next)).toEqual(next);
  });

  it("accepts a superseding Citation verification signal and rejects rewriting it", () => {
    const previous = makeResearchWorkspace();
    const next = clone(previous);
    next.updatedAt = "2026-01-11T00:00:00.000Z";
    next.citationVerificationSignals.push({
      id: "citation-verification.citation.one.conflict.v2",
      citationId: "citation.one",
      supersedesSignalId:
        "citation-verification.citation.one.human.v1",
      verificationState: "conflict_identified",
      verifiedBy: "reviewer.conflict.one",
      verifiedAt: "2026-01-10T12:00:00.000Z",
      recordedAt: "2026-01-10T12:00:00.000Z",
    });

    expect(assertAppendOnlyWorkspaceTransition(previous, next)).toEqual(next);

    const rewritten = clone(next);
    rewritten.updatedAt = "2026-01-12T00:00:00.000Z";
    rewritten.sourceRelations.push({
      id: "relation.after-verification-signal",
      fromSourceId: "source.one",
      toSourceId: "source.two",
      relationType: "companion_to",
      relationStatus: "active",
      supersedesRelationId: null,
      note: "A valid appended record accompanying the rewrite attempt.",
      recordedAt: "2026-01-11T12:00:00.000Z",
      recordedBy: "reviewer.rights",
    });
    rewritten.citationVerificationSignals.at(-1)!.verifiedBy =
      "reviewer.rewritten";
    expect(() =>
      assertAppendOnlyWorkspaceTransition(next, rewritten),
    ).toThrow(/rewrote Citation Verification Signal/);
  });

  it("rejects deletion, rewrite, no-op, and a nonadvancing timestamp", () => {
    const previous = makeResearchWorkspace();

    const removed = appendSourceRelation(previous);
    removed.sourceRelations = removed.sourceRelations.filter(
      (relation) => relation.id !== "relation.one",
    );
    expect(() =>
      assertAppendOnlyWorkspaceTransition(previous, removed),
    ).toThrow(/removed Source Relation/);

    const rewritten = appendSourceRelation(previous);
    rewritten.candidates[0]!.title = "Silently rewritten title";
    expect(() =>
      assertAppendOnlyWorkspaceTransition(previous, rewritten),
    ).toThrow(/rewrote Evidence Candidate/);

    const rewrittenObservation = appendSourceRelation(previous);
    rewrittenObservation.candidateObservations[0]!.metadataFingerprint =
      "f".repeat(64);
    expect(() =>
      assertAppendOnlyWorkspaceTransition(previous, rewrittenObservation),
    ).toThrow(/rewrote Evidence Candidate Observation/);

    const noNewRecord = clone(previous);
    noNewRecord.updatedAt = "2026-01-11T00:00:00.000Z";
    expect(() =>
      assertAppendOnlyWorkspaceTransition(previous, noNewRecord),
    ).toThrow(/contains no new record/);

    const staleTimestamp = appendSourceRelation(previous);
    staleTimestamp.sourceRelations.at(-1)!.recordedAt =
      "2026-01-09T12:00:00.000Z";
    staleTimestamp.updatedAt = previous.updatedAt;
    expect(() =>
      assertAppendOnlyWorkspaceTransition(previous, staleTimestamp),
    ).toThrow(ResearchWorkspaceTransitionError);
  });
});
