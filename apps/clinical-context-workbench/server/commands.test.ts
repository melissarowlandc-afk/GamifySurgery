import { describe, expect, it } from "vitest";

import { validateResearchWorkspace } from "@gamify-surgery/clinical-research";

import { applyWorkbenchCommand } from "./commands.js";
import { presentWorkspace } from "./presentation.js";
import { createInitialResearchWorkspace } from "./workspace.js";

const DENY_PERMISSIONS = {
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
};

describe("canonical workbench command flow", () => {
  it("allows only owners or clinical reviewers to accept Expert Opinion into Known", () => {
    let workspace = createInitialResearchWorkspace(
      "2026-07-26T10:00:00.000Z",
    );
    const gapId = workspace.evidenceGaps[0]!.id;
    workspace = applyWorkbenchCommand(
      workspace,
      {
        type: "add_expert_opinion",
        gapId,
        statement: "A bounded clinical perspective needs human review.",
        rationale: "This fixture exercises the reviewer-role boundary.",
        clinicalScope: "Role-gate testing only.",
        limitations: ["It is not formal evidence."],
      },
      "reviewer.local.developer",
      "developer",
    );
    const opinionId = workspace.expertOpinions[0]!.id;
    const acceptCommand = {
      type: "review_expert_opinion" as const,
      opinionId,
      disposition: "accepted" as const,
      reviewNote: "Attempt to accept this bounded opinion.",
    };

    for (const role of [
      "developer",
      "rights_reviewer",
      "administrator",
    ] as const) {
      expect(() =>
        applyWorkbenchCommand(
          workspace,
          acceptCommand,
          `reviewer.local.${role}`,
          role,
        ),
      ).toThrow(/only an owner or clinical reviewer/i);
    }
    expect(workspace.contributions).toHaveLength(0);
    expect(presentWorkspace(workspace).briefs[0]!.known).toEqual([]);

    workspace = applyWorkbenchCommand(
      workspace,
      acceptCommand,
      "reviewer.local.clinical",
      "clinical_reviewer",
    );
    expect(workspace.expertOpinionRevisions.at(-1)).toMatchObject({
      reviewStatus: "accepted",
      reviewedBy: "reviewer.local.clinical",
      recordedBy: "reviewer.local.clinical",
    });
    expect(workspace.contributions.at(-1)).toMatchObject({
      authority: "expert_opinion",
      reviewStatus: "accepted",
      reviewedBy: "reviewer.local.clinical",
    });
    expect(presentWorkspace(workspace).briefs[0]!.known).toHaveLength(1);
  });

  it("records written permission with its human-reviewed evidence references and conditions", () => {
    const workspace = applyWorkbenchCommand(
      createInitialResearchWorkspace("2026-07-26T10:00:00.000Z"),
      {
        type: "record_source_rights",
        sourceId: null,
        sourceLabel: "Permission-controlled source",
        decisionStatus: "permitted_with_conditions",
        legalBasis: "written_permission",
        permissions: {
          ...DENY_PERMISSIONS,
          privateStorage: true,
          localTextExtraction: true,
          derivedClinicalContent: true,
        },
        territories: ["United States"],
        licenseLabel: null,
        licenseUrl: null,
        termsUrl: "https://example.org/permission-terms",
        attributionStatement: "Credit the source organization.",
        requiredNotices: ["Retain the permission notice with derived drafts."],
        nonCommercialOnly: true,
        shareAlikeRequired: false,
        thirdPartyMaterialPolicy: "item_level_review_required",
        fairUseAssessment: null,
        permissionEvidenceReferenceIds: [
          "permission.local.source-email-2026-07-01",
        ],
        reviewBasis: "legal_counsel",
        effectiveAt: "2026-07-01T00:00:00.000Z",
        expiresAt: "2027-07-01T00:00:00.000Z",
        notes:
          "Permission is limited to local extraction and reviewed derivative drafting.",
      },
      "reviewer.local.rights_one",
    );

    expect(workspace.sourceRightsDecisions[0]).toMatchObject({
      legalBasis: "written_permission",
      termsUrl: "https://example.org/permission-terms",
      requiredNotices: [
        "Retain the permission notice with derived drafts.",
      ],
      permissionEvidenceReferenceIds: [
        "permission.local.source-email-2026-07-01",
      ],
      reviewedBy: "reviewer.local.rights_one",
    });
    expect(presentWorkspace(workspace).view.sourceRights[0]).toMatchObject({
      legalBasis: "written_permission",
      termsUrl: "https://example.org/permission-terms",
      permissionEvidenceReferenceIds: [
        "permission.local.source-email-2026-07-01",
      ],
      reviewedBy: "reviewer.local.rights_one",
    });
  });

  it("rejects written permission without an immutable evidence reference", () => {
    const workspace = createInitialResearchWorkspace(
      "2026-07-26T10:00:00.000Z",
    );
    expect(() =>
      applyWorkbenchCommand(workspace, {
        type: "record_source_rights",
        sourceId: null,
        sourceLabel: "Unsupported permission claim",
        decisionStatus: "permitted_with_conditions",
        legalBasis: "written_permission",
        permissions: {
          ...DENY_PERMISSIONS,
          privateStorage: true,
        },
        territories: ["United States"],
        licenseLabel: null,
        licenseUrl: null,
        termsUrl: null,
        attributionStatement: null,
        requiredNotices: [],
        nonCommercialOnly: false,
        shareAlikeRequired: false,
        thirdPartyMaterialPolicy: "excluded",
        fairUseAssessment: null,
        permissionEvidenceReferenceIds: [],
        reviewBasis: "engineering_risk_assessment",
        effectiveAt: "2026-07-01T00:00:00.000Z",
        expiresAt: null,
        notes: "The form must not turn this assertion into permission.",
      }),
    ).toThrow(/written permission requires at least one permission-evidence/i);
  });

  it("records a reviewer-authored fair-use analysis without inferring its conclusion", () => {
    const assessment = {
      preciseUse:
        "Extract a short factual passage into a private review queue.",
      purposeAndCharacter:
        "The bounded use supports nonprofit education and human review.",
      natureOfWork:
        "The source combines factual clinical guidance with expressive text.",
      amountAndSubstantiality:
        "Only the minimum passage needed for review will be extracted.",
      marketEffect:
        "The workflow will not distribute source text or replace access.",
      conclusion: "proceed_narrowly" as const,
    };
    const workspace = applyWorkbenchCommand(
      createInitialResearchWorkspace("2026-07-26T10:00:00.000Z"),
      {
        type: "record_source_rights",
        sourceId: null,
        sourceLabel: "Narrow fair-use source",
        decisionStatus: "permitted_with_conditions",
        legalBasis: "fair_use",
        permissions: {
          ...DENY_PERMISSIONS,
          privateStorage: true,
          localTextExtraction: true,
        },
        territories: ["United States"],
        licenseLabel: null,
        licenseUrl: null,
        termsUrl: null,
        attributionStatement: null,
        requiredNotices: ["Do not redistribute source text."],
        nonCommercialOnly: true,
        shareAlikeRequired: false,
        thirdPartyMaterialPolicy: "excluded",
        fairUseAssessment: assessment,
        permissionEvidenceReferenceIds: [],
        reviewBasis: "legal_counsel",
        effectiveAt: "2026-07-01T00:00:00.000Z",
        expiresAt: null,
        notes: "Proceed only within the use assessed above.",
      },
      "reviewer.local.rights_two",
    );

    expect(workspace.sourceRightsDecisions[0]).toMatchObject({
      legalBasis: "fair_use",
      fairUseAssessment: assessment,
      reviewedBy: "reviewer.local.rights_two",
    });
    expect(
      presentWorkspace(workspace).view.sourceRights[0]?.fairUseAssessment,
    ).toEqual(assessment);
  });

  it("does not permit fair-use rights when the human conclusion requests legal review", () => {
    const workspace = createInitialResearchWorkspace(
      "2026-07-26T10:00:00.000Z",
    );
    expect(() =>
      applyWorkbenchCommand(workspace, {
        type: "record_source_rights",
        sourceId: null,
        sourceLabel: "Unresolved fair-use source",
        decisionStatus: "permitted_with_conditions",
        legalBasis: "fair_use",
        permissions: {
          ...DENY_PERMISSIONS,
          privateStorage: true,
        },
        territories: ["United States"],
        licenseLabel: null,
        licenseUrl: null,
        termsUrl: null,
        attributionStatement: null,
        requiredNotices: [],
        nonCommercialOnly: false,
        shareAlikeRequired: false,
        thirdPartyMaterialPolicy: "excluded",
        fairUseAssessment: {
          preciseUse: "A proposed but unresolved local extraction.",
          purposeAndCharacter: "The reviewer has not resolved this factor.",
          natureOfWork: "The reviewer has not resolved this factor.",
          amountAndSubstantiality:
            "The reviewer has not resolved this factor.",
          marketEffect: "The reviewer has not resolved this factor.",
          conclusion: "seek_legal_review",
        },
        permissionEvidenceReferenceIds: [],
        reviewBasis: "engineering_risk_assessment",
        effectiveAt: "2026-07-01T00:00:00.000Z",
        expiresAt: null,
        notes: "No use should be permitted while review remains unresolved.",
      }),
    ).toThrow(/proceed-narrowly conclusion/i);
  });

  it("collapses repeated manual metadata while retaining per-run observations", () => {
    let workspace = createInitialResearchWorkspace(
      "2026-07-26T11:00:00.000Z",
    );
    const command = {
      type: "capture_candidate" as const,
      gapId: workspace.evidenceGaps[0]!.id,
      title: "Repeated metadata record",
      citation: "Example Society. Repeated metadata record. 2026.",
      organization: "Example Society",
      sourceType: "clinical_guideline",
    };

    workspace = applyWorkbenchCommand(
      workspace,
      command,
      "reviewer.local.developer_one",
    );
    const candidateId = workspace.candidates[0]!.id;
    workspace = applyWorkbenchCommand(
      workspace,
      command,
      "reviewer.local.developer_one",
    );

    expect(workspace.candidates).toHaveLength(1);
    expect(workspace.candidateObservations).toHaveLength(2);
    expect(workspace.searchRuns).toHaveLength(2);
    expect(workspace.candidates[0]?.recordedBy).toBe(
      "reviewer.local.developer_one",
    );
    expect(
      workspace.candidateObservations.every(
        (observation) =>
          observation.recordedBy === "reviewer.local.developer_one",
      ),
    ).toBe(true);
    expect(
      workspace.candidateObservations.map(
        (observation) => observation.candidateId,
      ),
    ).toEqual([candidateId, candidateId]);
    expect(presentWorkspace(workspace).view.candidates).toHaveLength(1);
    expect(
      presentWorkspace(workspace).briefs[0]?.searchStatus,
    ).toMatchObject({
      candidateCountCaptured: 2,
      candidateCountPresent: 1,
      unscreenedCount: 1,
    });
  });

  it("keeps candidates out of Known until reviewed contributions exist", () => {
    let workspace = createInitialResearchWorkspace(
      "2026-07-26T12:00:00.000Z",
    );
    const gapId = workspace.evidenceGaps[0]!.id;

    workspace = applyWorkbenchCommand(workspace, {
      type: "record_source_rights",
      sourceId: null,
      sourceLabel: "Owner-authored source",
      decisionStatus: "permitted_with_conditions",
      legalBasis: "owner_authored",
      permissions: {
        ...DENY_PERMISSIONS,
        bibliographicMetadata: true,
        privateStorage: true,
        localTextExtraction: true,
        localStructuredIndexing: true,
        derivedClinicalContent: true,
      },
      territories: ["United States"],
      licenseLabel: null,
      licenseUrl: null,
      termsUrl: null,
      attributionStatement: null,
      requiredNotices: [],
      nonCommercialOnly: false,
      shareAlikeRequired: false,
      thirdPartyMaterialPolicy: "not_applicable",
      fairUseAssessment: null,
      permissionEvidenceReferenceIds: [],
      reviewBasis: "owner_attestation",
      effectiveAt: "2026-01-01T00:00:00.000Z",
      expiresAt: null,
      notes: "The owner authorizes bounded local derivation.",
    });
    const sourceId = workspace.externalReferences.sources[0]!.id;

    workspace = applyWorkbenchCommand(workspace, {
      type: "record_source_rights",
      sourceId: null,
      sourceLabel: "Related source",
      decisionStatus: "default_deny",
      legalBasis: "unreviewed",
      permissions: DENY_PERMISSIONS,
      territories: ["United States"],
      licenseLabel: null,
      licenseUrl: null,
      termsUrl: null,
      attributionStatement: null,
      requiredNotices: [],
      nonCommercialOnly: false,
      shareAlikeRequired: false,
      thirdPartyMaterialPolicy: "excluded",
      fairUseAssessment: null,
      permissionEvidenceReferenceIds: [],
      reviewBasis: "engineering_risk_assessment",
      effectiveAt: "2026-01-01T00:00:00.000Z",
      expiresAt: null,
      notes: "No use has been authorized.",
    });
    const relatedSourceId = workspace.externalReferences.sources[1]!.id;
    workspace = applyWorkbenchCommand(workspace, {
      type: "record_source_relation",
      fromSourceId: relatedSourceId,
      toSourceId: sourceId,
      relationType: "updates",
      note: "The relationship is recorded for currentness review.",
    });

    workspace = applyWorkbenchCommand(workspace, {
      type: "capture_candidate",
      gapId,
      title: "Candidate metadata record",
      citation: "Owner. Candidate metadata record. 2026.",
      organization: "Owner organization",
      sourceType: "journal_article",
    });
    const candidate = workspace.candidates[0]!;
    expect(candidate.matchedExistingSourceId).toBeNull();
    expect(presentWorkspace(workspace).briefs[0]!.known).toEqual([]);

    workspace = applyWorkbenchCommand(workspace, {
      type: "screen_candidate",
      candidateId: candidate.id,
      gapId,
      disposition: "include",
      resolvedSourceId: sourceId,
      reason: "The metadata matches the registered owner-authored Source.",
    });
    expect(presentWorkspace(workspace).briefs[0]!.known).toEqual([]);

    workspace.externalReferences.citations.push({
      id: "citation.local.verified",
      sourceId,
      sourceSnapshotId: "snapshot.local.owner.v1",
      verificationState: "human_verified",
      verifiedBy: "reviewer.clinical.local",
      verifiedAt: "2026-07-26T12:00:00.000Z",
    });
    workspace.citationVerificationSignals.push({
      id: "citation-verification.citation.local.verified.v1",
      citationId: "citation.local.verified",
      supersedesSignalId: null,
      verificationState: "human_verified",
      verifiedBy: "reviewer.clinical.local",
      verifiedAt: "2026-07-26T12:00:00.000Z",
      recordedAt: "2026-07-26T12:00:00.000Z",
    });
    workspace = applyWorkbenchCommand(workspace, {
      type: "propose_contribution",
      gapId,
      sourceId,
      citationIds: ["citation.local.verified"],
      role: "supports",
      contributionTypes: ["teaching_point"],
      statement: "The owner-authored fixture supports the workflow example.",
      applicabilityNote: "Applies only to the non-clinical workflow fixture.",
      sourceRole: "primary_study",
    });
    const proposedContribution = workspace.contributions.at(-1)!;
    expect(presentWorkspace(workspace).briefs[0]!.known).toEqual([]);
    workspace = applyWorkbenchCommand(workspace, {
      type: "review_contribution",
      contributionId: proposedContribution.id,
      disposition: "accepted",
    });
    const acceptedFormalContribution = workspace.contributions.at(-1)!;

    workspace = applyWorkbenchCommand(workspace, {
      type: "add_expert_opinion",
      gapId,
      statement: "The fixture is suitable for testing the review workflow.",
      rationale: "It exercises each human decision boundary.",
      clinicalScope: "Non-clinical workflow validation only.",
      limitations: ["It makes no clinical claim."],
    });
    const opinionId = workspace.expertOpinions[0]!.id;
    workspace = applyWorkbenchCommand(workspace, {
      type: "review_expert_opinion",
      opinionId,
      disposition: "accepted",
      reviewNote: "Accepted as a clearly labeled expert perspective.",
    });
    const acceptedExpertContribution = workspace.contributions.at(-1)!;
    const brief = presentWorkspace(workspace).briefs[0]!;
    expect(brief.known.map((entry) => entry.kind)).toEqual([
      "expert_opinion",
    ]);
    expect(brief.needed.openWork.join("\n")).toContain(
      "newer Source update requires currentness review",
    );

    workspace = applyWorkbenchCommand(workspace, {
      type: "create_synthesis",
      gapId,
      supportingSummary: "The reviewed records support the workflow example.",
      opposingOrQualifyingSummary:
        "The records are synthetic and have no clinical authority.",
      proposedDirection: "Retain the example solely for workflow validation.",
      limitations: ["No clinical conclusion may be drawn."],
    });
    const proposalId = workspace.synthesisProposals[0]!.id;
    expect(workspace.synthesisProposals[0]!.contributionIds).toEqual([
      acceptedExpertContribution.id,
    ]);
    expect(workspace.synthesisProposals[0]!.contributionIds).not.toContain(
      acceptedFormalContribution.id,
    );
    workspace = applyWorkbenchCommand(workspace, {
      type: "decide_synthesis",
      proposalId,
      disposition: "accept",
      rationale: "The narrow workflow-only direction is supported.",
    });
    const synthesisDecisionId = workspace.synthesisDecisions[0]!.id;
    workspace = applyWorkbenchCommand(workspace, {
      type: "create_content_change",
      synthesisDecisionId,
      targetKind: "other",
      targetId: "target.local.unassigned",
      changeKind: "no_change",
      beforeSummary: "The example already exists.",
      proposedSummary: "Keep the workflow example without clinical content.",
      status: "ready_for_authoring",
    });

    const projection = presentWorkspace(workspace);
    expect(projection.view.sourceRelations).toHaveLength(1);
    expect(projection.view.contributions).toHaveLength(2);
    expect(projection.view.syntheses[0]).toMatchObject({
      disposition: "accept",
    });
    expect(projection.view.contentChangeProposals[0]).toMatchObject({
      changeKind: "no_change",
      status: "ready_for_authoring",
      crossTargetReview: null,
    });

    workspace.externalReferences.clinicalTargets.push({
      kind: "other",
      id: "target.local.cross-target",
    });
    const crossTargetCommand = {
      type: "create_content_change" as const,
      synthesisDecisionId,
      targetKind: "other" as const,
      targetId: "target.local.cross-target",
      changeKind: "modify" as const,
      beforeSummary: "No coordinated cross-target change.",
      proposedSummary:
        "Coordinate a second authoring target with the accepted synthesis.",
      status: "draft" as const,
    };
    expect(() =>
      applyWorkbenchCommand(workspace, crossTargetCommand),
    ).toThrow(/explicit reviewer confirmation/i);

    workspace = applyWorkbenchCommand(workspace, {
      ...crossTargetCommand,
      crossTargetRationale:
        "The reviewer confirmed that the linked target must change with the Gap target.",
      crossTargetReviewConfirmed: true,
    });
    expect(workspace.contentChangeProposals.at(-1)?.crossTargetReview).toMatchObject({
      rationale:
        "The reviewer confirmed that the linked target must change with the Gap target.",
      reviewedBy: "author.local.workbench",
    });
    expect(
      presentWorkspace(workspace).view.contentChangeProposals.at(-1)
        ?.crossTargetReview,
    ).toMatchObject({
      reviewedBy: "author.local.workbench",
    });
  });

  it("never lets browser citation entry assert human verification", () => {
    let workspace = createInitialResearchWorkspace(
      "2026-07-26T12:00:00.000Z",
    );
    workspace = applyWorkbenchCommand(workspace, {
      type: "record_source_rights",
      sourceId: null,
      sourceLabel: "Metadata-only source",
      decisionStatus: "metadata_only",
      legalBasis: "metadata_only",
      permissions: {
        ...DENY_PERMISSIONS,
        bibliographicMetadata: true,
      },
      territories: ["United States"],
      licenseLabel: null,
      licenseUrl: null,
      termsUrl: null,
      attributionStatement: null,
      requiredNotices: [],
      nonCommercialOnly: false,
      shareAlikeRequired: false,
      thirdPartyMaterialPolicy: "excluded",
      fairUseAssessment: null,
      permissionEvidenceReferenceIds: [],
      reviewBasis: "engineering_risk_assessment",
      effectiveAt: "2026-01-01T00:00:00.000Z",
      expiresAt: null,
      notes: "Metadata registration only.",
    });
    expect(() =>
      applyWorkbenchCommand(workspace, {
        type: "register_citation",
        citationId: "citation.browser.false-attestation",
        sourceId: workspace.externalReferences.sources[0]!.id,
        sourceSnapshotId: "snapshot.not-validated",
        verificationState: "human_verified",
      }),
    ).toThrow(/verificationState/i);
  });

  it("presents the current Citation signal while retaining the immutable root", () => {
    const workspace = createInitialResearchWorkspace(
      "2026-07-27T12:00:00.000Z",
    );
    workspace.externalReferences.sources.push({ id: "source.signal.one" });
    workspace.externalReferences.citations.push({
      id: "citation.signal.one",
      sourceId: "source.signal.one",
      sourceSnapshotId: "snapshot.signal.one",
      verificationState: "human_verified",
      verifiedBy: "reviewer.human.one",
      verifiedAt: "2026-07-26T08:00:00.000Z",
    });
    workspace.citationVerificationSignals.push(
      {
        id: "citation-verification.signal.human.v1",
        citationId: "citation.signal.one",
        supersedesSignalId: null,
        verificationState: "human_verified",
        verifiedBy: "reviewer.human.one",
        verifiedAt: "2026-07-26T08:00:00.000Z",
        recordedAt: "2026-07-26T09:00:00.000Z",
      },
      {
        id: "citation-verification.signal.conflict.v2",
        citationId: "citation.signal.one",
        supersedesSignalId:
          "citation-verification.signal.human.v1",
        verificationState: "conflict_identified",
        verifiedBy: "reviewer.conflict.two",
        verifiedAt: "2026-07-27T08:00:00.000Z",
        recordedAt: "2026-07-27T09:00:00.000Z",
      },
    );

    const projection = presentWorkspace(workspace);
    expect(workspace.externalReferences.citations[0]).toMatchObject({
      verificationState: "human_verified",
      verifiedBy: "reviewer.human.one",
    });
    expect(projection.view.citations[0]).toMatchObject({
      verificationState: "conflict_identified",
      verificationSignalId:
        "citation-verification.signal.conflict.v2",
      verifiedBy: "reviewer.conflict.two",
      verifiedAt: "2026-07-27T08:00:00.000Z",
    });
    expect(projection.view.audit).toContainEqual(
      expect.objectContaining({
        entityType: "citation_verification_signal",
        entityId: "citation.signal.one",
        summary: expect.stringContaining("reviewer.conflict.two"),
      }),
    );
  });

  it("withdraws a mistaken Source relation with a corrective-forward record", () => {
    let workspace = createInitialResearchWorkspace(
      "2026-07-26T12:00:00.000Z",
    );
    workspace.externalReferences.sources.push(
      { id: "source.relation.from" },
      { id: "source.relation.to" },
    );
    workspace = applyWorkbenchCommand(workspace, {
      type: "record_source_relation",
      fromSourceId: "source.relation.from",
      toSourceId: "source.relation.to",
      relationType: "retracts",
      note: "Initial reviewer believed this retraction applied.",
    });
    const active = workspace.sourceRelations.at(-1)!;
    workspace = applyWorkbenchCommand(workspace, {
      type: "withdraw_source_relation",
      relationId: active.id,
      note: "Second review confirmed that the retraction applied elsewhere.",
    });

    expect(workspace.sourceRelations).toHaveLength(2);
    expect(workspace.sourceRelations.at(-1)).toMatchObject({
      relationStatus: "withdrawn",
      supersedesRelationId: active.id,
    });
    expect(presentWorkspace(workspace).view.sourceRelations).toEqual([
      expect.objectContaining({ relationStatus: "withdrawn" }),
    ]);
    expect(() =>
      applyWorkbenchCommand(workspace, {
        type: "withdraw_source_relation",
        relationId: active.id,
        note: "Attempt to withdraw the stale relation again.",
      }),
    ).toThrow(/current active Source Relation/i);

    workspace = applyWorkbenchCommand(workspace, {
      type: "record_source_relation",
      fromSourceId: "source.relation.from",
      toSourceId: "source.relation.to",
      relationType: "retracts",
      note: "A later review independently confirms the retraction.",
    });
    expect(workspace.sourceRelations.at(-1)).toMatchObject({
      relationStatus: "active",
      supersedesRelationId: workspace.sourceRelations.at(-2)!.id,
    });
    expect(() =>
      applyWorkbenchCommand(workspace, {
        type: "record_source_relation",
        fromSourceId: "source.relation.from",
        toSourceId: "source.relation.to",
        relationType: "retracts",
        note: "An accidental duplicate active relation.",
      }),
    ).toThrow(/already active/i);
  });

  it("rejects multiple Source Relation roots for the same typed Source pair", () => {
    let workspace = createInitialResearchWorkspace(
      "2026-07-26T12:00:00.000Z",
    );
    workspace.externalReferences.sources.push(
      { id: "source.relation.root.from" },
      { id: "source.relation.root.to" },
    );
    workspace = applyWorkbenchCommand(workspace, {
      type: "record_source_relation",
      fromSourceId: "source.relation.root.from",
      toSourceId: "source.relation.root.to",
      relationType: "updates",
      note: "The first immutable relation root.",
    });
    workspace.sourceRelations.push({
      ...workspace.sourceRelations[0]!,
      id: "source-relation.duplicate-root",
      note: "A malformed second root for the same typed pair.",
      recordedAt: "2026-07-26T12:00:02.000Z",
    });
    workspace.updatedAt = "2026-07-26T12:00:03.000Z";

    expect(() => validateResearchWorkspace(workspace)).toThrow(
      /must have exactly one root/i,
    );
  });

  it("blocks a new content handoff after an accepted decision is superseded while preserving the historical handoff", () => {
    let workspace = createInitialResearchWorkspace(
      "2026-07-26T12:00:00.000Z",
    );
    const gapId = workspace.evidenceGaps[0]!.id;
    workspace = applyWorkbenchCommand(workspace, {
      type: "add_expert_opinion",
      gapId,
      statement: "A bounded expert statement for command testing.",
      rationale: "This creates reviewed input without external Source rights.",
      clinicalScope: "Non-clinical workflow testing only.",
      limitations: ["No clinical authority."],
    });
    workspace = applyWorkbenchCommand(workspace, {
      type: "review_expert_opinion",
      opinionId: workspace.expertOpinions[0]!.id,
      disposition: "accepted",
      reviewNote: "Accepted for workflow testing.",
    });
    workspace = applyWorkbenchCommand(workspace, {
      type: "create_synthesis",
      gapId,
      supportingSummary: "The reviewed expert record supports a test handoff.",
      opposingOrQualifyingSummary:
        "The record remains explicitly non-clinical.",
      proposedDirection: "Create a workflow-only handoff.",
      limitations: ["No clinical conclusion."],
    });
    const proposalId = workspace.synthesisProposals[0]!.id;
    workspace = applyWorkbenchCommand(workspace, {
      type: "decide_synthesis",
      proposalId,
      disposition: "accept",
      rationale: "Accept the workflow-only handoff.",
    });
    const acceptedDecisionId = workspace.synthesisDecisions[0]!.id;
    workspace = applyWorkbenchCommand(workspace, {
      type: "create_content_change",
      synthesisDecisionId: acceptedDecisionId,
      targetKind: "other",
      targetId: "target.local.unassigned",
      changeKind: "no_change",
      beforeSummary: "No prior workflow handoff.",
      proposedSummary: "Record the accepted workflow handoff.",
      status: "ready_for_authoring",
    });
    const historicalHandoffId = workspace.contentChangeProposals[0]!.id;

    workspace = applyWorkbenchCommand(workspace, {
      type: "decide_synthesis",
      proposalId,
      disposition: "reject",
      rationale: "A later review blocks any additional handoff.",
    });
    expect(workspace.contentChangeProposals[0]!.id).toBe(
      historicalHandoffId,
    );
    expect(() =>
      applyWorkbenchCommand(workspace, {
        type: "create_content_change",
        synthesisDecisionId: acceptedDecisionId,
        targetKind: "other",
        targetId: "target.local.unassigned",
        changeKind: "no_change",
        beforeSummary: "A historical handoff already exists.",
        proposedSummary: "Attempt another handoff from a stale decision.",
        status: "draft",
      }),
    ).toThrow(/current Synthesis Decision head/i);
  });

  it("requires fresh synthesis after accepted Expert Opinion evidence is withdrawn", () => {
    let workspace = createInitialResearchWorkspace(
      "2026-07-26T12:00:00.000Z",
    );
    const gapId = workspace.evidenceGaps[0]!.id;
    workspace = applyWorkbenchCommand(workspace, {
      type: "add_expert_opinion",
      gapId,
      statement: "A bounded opinion for corrective-forward testing.",
      rationale: "It creates a reviewed input without an external source.",
      clinicalScope: "Non-clinical workflow testing only.",
      limitations: ["No clinical authority."],
    });
    const opinionId = workspace.expertOpinions[0]!.id;
    workspace = applyWorkbenchCommand(workspace, {
      type: "review_expert_opinion",
      opinionId,
      disposition: "accepted",
      reviewNote: "Accept for the initial workflow synthesis.",
    });
    workspace = applyWorkbenchCommand(workspace, {
      type: "create_synthesis",
      gapId,
      supportingSummary: "The accepted opinion supports a workflow test.",
      opposingOrQualifyingSummary: "It carries no clinical authority.",
      proposedDirection: "Create a workflow-only handoff.",
      limitations: ["No clinical conclusion."],
    });
    const proposalId = workspace.synthesisProposals[0]!.id;
    workspace = applyWorkbenchCommand(workspace, {
      type: "decide_synthesis",
      proposalId,
      disposition: "accept",
      rationale: "Accept the bounded workflow test.",
    });
    const decisionId = workspace.synthesisDecisions[0]!.id;
    workspace = applyWorkbenchCommand(workspace, {
      type: "create_content_change",
      synthesisDecisionId: decisionId,
      targetKind: "other",
      targetId: "target.local.unassigned",
      changeKind: "no_change",
      beforeSummary: "No prior workflow handoff.",
      proposedSummary: "Record the initial workflow handoff.",
      status: "ready_for_authoring",
    });
    const historicalHandoff = workspace.contentChangeProposals[0]!;

    workspace = applyWorkbenchCommand(workspace, {
      type: "review_expert_opinion",
      opinionId,
      disposition: "rejected",
      reviewNote: "A later review withdraws the opinion prospectively.",
    });
    expect(workspace.contentChangeProposals[0]).toEqual(
      historicalHandoff,
    );
    expect(() =>
      applyWorkbenchCommand(workspace, {
        type: "create_content_change",
        synthesisDecisionId: decisionId,
        targetKind: "other",
        targetId: "target.local.unassigned",
        changeKind: "no_change",
        beforeSummary: "The historical handoff remains.",
        proposedSummary:
          "Attempt another handoff without refreshing the synthesis.",
        status: "draft",
      }),
    ).toThrow(/requires a fresh Synthesis/i);
  });

  it("rejects obvious secrets or identifiers in external metadata queries", () => {
    const workspace = createInitialResearchWorkspace(
      "2026-07-26T12:00:00.000Z",
    );
    expect(() =>
      applyWorkbenchCommand(workspace, {
        type: "create_gap",
        title: "Unsafe query example",
        clinicalQuestion: "What does the current literature report?",
        whyNeeded: "This verifies the provider query boundary.",
        acceptanceCriteria: ["A human reviews the metadata results."],
        targetKind: "other",
        targetId: "target.local.query-safety",
        scoutMode: "metadata_search",
        preferredSourceTypes: ["clinical_guideline"],
        provider: "pubmed",
        query: "appendicitis AND api_key=do-not-send-this",
        refreshIntervalDays: 30,
      }),
    ).toThrow(/must not contain credentials/i);
  });
});
