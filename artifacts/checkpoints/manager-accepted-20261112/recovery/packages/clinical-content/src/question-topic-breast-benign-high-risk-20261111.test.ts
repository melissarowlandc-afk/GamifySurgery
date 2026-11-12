import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import packet from "../../../docs/research/question-topic-breast-benign-high-risk-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-breast-benign-high-risk-20261111.json";
import {
  BREAST_BENIGN_HIGH_RISK_TOPIC_AUDIT as audit,
  BREAST_BENIGN_HIGH_RISK_TOPIC_AUTHOR_GATES as gates,
  BREAST_BENIGN_HIGH_RISK_TOPIC_CASES as cases,
  BREAST_BENIGN_HIGH_RISK_TOPIC_COMPOSITION_PROPOSALS as composition,
  BREAST_BENIGN_HIGH_RISK_TOPIC_CONCEPT_PROPOSALS as conceptProposals,
  BREAST_BENIGN_HIGH_RISK_TOPIC_CONCEPTS as concepts,
  BREAST_BENIGN_HIGH_RISK_TOPIC_DRAFT as draft,
  BREAST_BENIGN_HIGH_RISK_TOPIC_EVIDENCE_CLAIMS as claims,
  BREAST_BENIGN_HIGH_RISK_TOPIC_INDEPENDENT_PASS_CASES as passedCases,
  BREAST_BENIGN_HIGH_RISK_TOPIC_ORDER_PROPOSALS as orders,
  BREAST_BENIGN_HIGH_RISK_TOPIC_PARKED_ATTEMPTS as parked,
  BREAST_BENIGN_HIGH_RISK_TOPIC_PENDING_REVIEW_CASES as pendingCases,
  BREAST_BENIGN_HIGH_RISK_TOPIC_QUESTIONS as questions,
  BREAST_BENIGN_HIGH_RISK_TOPIC_RETAINED_ROUND1 as retained,
  BREAST_BENIGN_HIGH_RISK_TOPIC_REVIEW_RESPONSES as responses,
  BREAST_BENIGN_HIGH_RISK_TOPIC_SOURCE_LINKS as links,
  BREAST_BENIGN_HIGH_RISK_TOPIC_SOURCES as sources,
  BREAST_BENIGN_HIGH_RISK_TOPIC_TIMING_PROPOSALS as timings,
} from "./question-topic-breast-benign-high-risk-20261111";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const sha256 = (value: Buffer) => createHash("sha256").update(value).digest("hex");

describe("breast benign/high-risk explicit authoring sidecar", () => {
  it("reconciles every assigned context and exact variant without creating release entries", () => {
    expect(audit).toHaveLength(152);
    expect(audit.map((row) => row.recordId).sort()).toEqual(
      packet.assignment.inventory.map((row) => row.recordId).sort(),
    );
    expect(new Set(audit.flatMap((row) => row.variantIds)).size).toBe(150);
    expect(audit.filter((row) => row.live)).toHaveLength(52);
    expect(audit.filter((row) => row.verdict === "Keep")).toHaveLength(66);
    expect(audit.filter((row) => row.verdict === "Rewrite")).toHaveLength(11);
    expect(audit.filter((row) => row.verdict === "Retire-and-replace")).toHaveLength(75);
    for (const row of audit) {
      expect(row.reasons.length).toBeGreaterThanOrEqual(3);
      expect(row.beforeVersion.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(row.exportLocator.file).toBe(row.sourceFile);
      for (const id of row.replacementProposalIds) {
        expect(packet.proposals.some((proposal) => proposal.id === id)).toBe(true);
      }
    }
    expect(draft.releaseAdmission).toBe("not_requested_by_this_sidecar");
  });

  it("preserves the exact scoped source inputs and original clinical approvals", () => {
    const inputs = packet.assignment.inputHashes.filter((input) => input.unchanged);
    const directlyOwnedInputs = new Set(
      packet.assignment.inventory.map((row) => row.fileLocation.file),
    );
    for (const input of inputs.filter((input) => directlyOwnedInputs.has(input.file))) {
      expect(sha256(readFileSync(root + input.file)), input.file).toBe(input.sha256);
    }
    expect(packet.assignment.sourceClinicalApprovals).toHaveLength(4);
    for (const approval of packet.assignment.sourceClinicalApprovals) {
      expect(sha256(readFileSync(root + approval.file))).toBe(approval.fileSha256);
      for (const variantId of approval.approval.approvedQuestionVariantIds) {
        for (const row of audit.filter((row) => row.variantIds.includes(variantId))) {
          expect(row.verdict).toBe("Keep");
        }
      }
    }
  });

  it("keeps all source-scope holds visible without treating replacements as resolution", () => {
    expect(packet.assignment.recordedHolds.map((hold) => hold.id).sort()).toEqual([
      "claim.n1r3.axillary-core-scope",
      "claim.n1r3.current-grade-margin-scope",
      "claim.n1r3.phyllodes-posterior-plane",
    ]);
    expect(audit.filter((row) => row.recordedHoldIds.length)).toHaveLength(4);
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints).toEqual([]);
  });

  it("preserves the exact independent PASS questions and every reviewed visible field", () => {
    const round = packet.reviewRound2;
    expect(sha256(readFileSync(root + round.reviewInput.file))).toBe(round.reviewInput.sha256);
    expect(round.passPreservation).toHaveLength(4);
    for (const frozen of round.passPreservation) {
      expect(frozen.reviewRecord.verdict).toBe("PASS");
      expect(frozen.clinicalApproval).toBe(false);
      const question = questions.find((q) => q.id === frozen.questionVariantId)!;
      expect(question).toEqual(frozen.exactQuestion);
      expect(retained.questions.find((q) => q.id === question.id)).toEqual(question);
      const clinicalCase = packet.authoredCases.find((c) => c.id === frozen.standaloneCaseId)!;
      const node = clinicalCase.decisionNodes[0]!;
      const header = clinicalCase as unknown as Record<string, unknown>;
      const nodeFields = node as unknown as Record<string, unknown>;
      for (const [field, expected] of Object.entries(frozen.visibleProjection)) {
        if (field !== "node") expect(header[field] ?? null, field).toEqual(expected);
      }
      for (const [field, expected] of Object.entries(frozen.visibleProjection.node)) {
        expect(nodeFields[field] ?? null, field).toEqual(expected);
      }
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      expect(passedCases.some((c) => c.id === clinicalCase.id)).toBe(true);
      // Splitting an earlier node only adds platform-required dispositions using
      // the unchanged reviewed rationale. It cannot introduce a new clinical outcome.
      for (const disposition of node.terminalDispositions) {
        expect(disposition.kind).toBe("no_terminal_outcome");
        expect(disposition.clinicalRationale).toBe(
          node.answerChoices.find((a) => a.id === disposition.answerChoiceId)!.rationale,
        );
      }
    }
  });

  it("accounts for all nineteen returned items once and keeps seven attempts unkeyed", () => {
    expect(responses).toHaveLength(23);
    expect(new Set(responses.map((r) => r.originalQuestionVariantId)).size).toBe(23);
    expect(responses.filter((r) => r.status === "pass-preserved")).toHaveLength(4);
    expect(responses.filter((r) => r.status === "revised")).toHaveLength(12);
    expect(responses.filter((r) => r.status === "parked")).toHaveLength(7);
    expect(parked).toHaveLength(7);
    expect(retained.questions).toHaveLength(23);
    expect(retained.cases).toHaveLength(12);
    for (const response of responses) {
      const review = packet.reviewRound2.reviewInput.records.find(
        (r) => r.id === response.originalQuestionVariantId,
      )!;
      expect(response.originalVerdict).toBe(review.verdict);
      expect(response.revisionAttempts).toBe(review.verdict === "PASS" ? 0 : 1);
      if (review.verdict !== "PASS") {
        for (const category of ["clarityIssues", "cues", "fairness", "suggestions"] as const) {
          const notes = response.reviewNoteResponses[category]!;
          expect(notes.map((n) => n.issue)).toEqual(review[category]);
          expect(notes.every((n) => n.response.length > 35)).toBe(true);
        }
      }
      if (response.status === "revised") {
        expect(response.independentReviewStatus).toBe("pending");
        const current = questions.find((q) => q.id === response.currentQuestionVariantId)!;
        expect(current.id).toMatch(/\.v2$/);
        expect(current).not.toEqual(retained.questions.find((q) => q.id === review.id));
      }
    }
    for (const attempt of parked) {
      expect(attempt.key).toBeNull();
      expect(attempt.explanation).toBeNull();
      expect(attempt.scored).toBe(false);
      expect(attempt.availableForSelection).toBe(false);
      expect(attempt.presentation).toContain(`${attempt.prototypeDemographics.ageYears}-year-old`);
      expect(attempt.proposedPlans.length).toBeGreaterThanOrEqual(3);
      expect(attempt.unresolvedClinicalOrEditorialBoundary.length).toBeGreaterThan(100);
      expect(questions.some((q) => q.id === attempt.id)).toBe(false);
      expect(cases.some((c) => c.id === attempt.caseId)).toBe(false);
      for (const id of attempt.supportingEvidenceClaimIds) {
        expect(claims.some((claim) => claim.id === id)).toBe(true);
      }
    }
  });

  it("materializes sixteen self-contained nodes without mixing passed and returned companions", () => {
    expect(cases).toHaveLength(16);
    expect(questions).toHaveLength(16);
    expect(cases.flatMap((clinicalCase) => clinicalCase.decisionNodes)).toHaveLength(16);
    expect(new Set(questions.map((question) => question.id)).size).toBe(16);
    expect(new Set(concepts.map((concept) => concept.id)).size).toBe(16);
    for (const clinicalCase of cases) {
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.presentation).toContain(`${clinicalCase.prototypeDemographics!.ageYears}-year-old`);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.prototypeDemographics)
        .toEqual(clinicalCase.prototypeDemographics);
      for (const node of clinicalCase.decisionNodes) {
        const question = questions.find((question) => question.id === node.questionVariantId)!;
        expect(question.conceptId).toBe(node.primaryConceptId);
        expect(question.stem).toBe(node.stem);
        expect(question.explanation).toBe(node.explanation);
        expect([...node.answerChoices].sort((a, b) => a.id.localeCompare(b.id)))
          .toEqual(question.answerChoices.map(({ distractorRationale: _, ...answer }) =>
            ({ ...answer, serviceRequest: null })).sort((a, b) => a.id.localeCompare(b.id)));
      }
    }
  });

  it("keeps every new clinical object unapproved and every new question distinct from its before", () => {
    for (const record of [...questions, ...claims, ...sources, ...conceptProposals]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
      expect(record.aiAssistedDrafting).toBe(true);
    }
    expect(packet.proposals.filter((proposal) => proposal.kind === "rewrite")).toHaveLength(9);
    expect(packet.proposals.filter((proposal) => proposal.kind === "new")).toHaveLength(7);
    const oldIds = new Set(packet.assignment.inventory.flatMap((row) => row.variantIds));
    for (const proposal of packet.proposals) {
      expect(oldIds.has(proposal.question.id)).toBe(false);
      expect(proposal.kind === "new" ? proposal.assignmentBeforeRecordIds.length === 0 :
        proposal.assignmentBeforeRecordIds.length > 0).toBe(true);
    }
  });

  it("preserves five assigned identities and eleven new meanings without moving old history", () => {
    expect(conceptProposals.filter((proposal) => proposal.kind === "reuse_existing_meaning"))
      .toHaveLength(5);
    expect(conceptProposals.filter((proposal) => proposal.kind === "new_meaning"))
      .toHaveLength(11);
    for (const concept of concepts) {
      const prior = packet.assignment.concepts.find((prior) => prior.conceptId === concept.id);
      if (prior) expect(concept.learningObjective).toBe(prior.learningObjective);
    }
    for (const proposal of conceptProposals) {
      expect(proposal.historyPolicy).toContain("no_history_transfer");
      expect(proposal.educationalTier).toBe(1);
      expect(proposal.patientAcuity).toBe("stable_outpatient");
      expect(proposal.requiredClinicalSetting).toBe("clinic");
    }
  });

  it("randomizes every runtime node and keeps review-only ordering explicit", () => {
    expect(draft.reviewOrderLabel).toBe("key shown first for review only.");
    for (const node of cases.flatMap((clinicalCase) => clinicalCase.decisionNodes)) {
      expect(node.shuffleAnswers).toBe(true);
      expect([3, 4]).toContain(node.answerChoices.length);
      expect(node.answerChoices.filter((answer) => answer.isCorrect)).toHaveLength(1);
      expect(node.answerChoices[0]!.isCorrect).toBe(false);
    }
  });

  it("maps all timing entries to exact choice identities and labels, including distractors", () => {
    const allowed = new Set([
      "timing.test.breast_core_biopsy", "timing.test.ultrasound", "timing.test.breast_mri",
      "timing.test.mammography", "timing.test.combined_diagnostic",
      "timing.test.excisional_biopsy", "timing.test.ct", "timing.test.clinical_procedure",
      "timing.test.biopsy",
    ]);
    expect(timings).toHaveLength(16);
    for (const entry of timings) {
      const node = cases.find((clinicalCase) => clinicalCase.id === entry.caseId)!
        .decisionNodes.find((node) => node.id === entry.nodeId)!;
      expect(entry.questionVariantId).toBe(node.questionVariantId);
      expect(entry.classification.kind).toBe("test_choices");
      if (entry.classification.kind !== "test_choices") throw new Error("Missing choice mappings");
      expect(entry.classification.choices).toHaveLength(node.answerChoices.length);
      for (const mapping of entry.classification.choices) {
        expect(node.answerChoices.find((answer) => answer.id === mapping.choiceId)!.label)
          .toBe(mapping.choiceLabel);
        if (mapping.timing.kind === "test") expect(allowed.has(mapping.timing.timingProfileId)).toBe(true);
        if (/^(Retrieve|Review)\b/.test(mapping.choiceLabel)) {
          // Reviewing acquired records must not inherit a new scan's ETA.
          expect(mapping.timing.kind).toBe("no_test");
        } else if (/ultrasound|mammograph|\bCT\b|\bMRI\b|biopsy|sampling|excision|drainage|aspiration/i.test(mapping.choiceLabel)) {
          expect(mapping.timing.kind, mapping.choiceLabel).toBe("test");
        }
      }
    }
  });

  it("keeps preview metadata separate from clinical service execution", () => {
    for (const order of orders) {
      expect(order.execution).toBe("outside_record_review_only");
      expect(order.serviceRequests).toEqual([]);
      expect(order.resultGateAfter).toBeNull();
    }
    for (const node of cases.flatMap((clinicalCase) => clinicalCase.decisionNodes)) {
      expect(node.resultGateAfter).toBeNull();
      expect(node.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
      expect(node.stem).not.toMatch(/\bwait\s+\d+/i);
    }
    expect(composition.filter((entry) => entry.selection === "standalone")).toHaveLength(16);
    expect(composition.every((entry) => entry.pipelinePassed === false)).toBe(true);
    expect(composition.filter((entry) => entry.everyScoredNodePassedIndependentReview)).toHaveLength(4);
    expect(passedCases).toHaveLength(4);
    expect(pendingCases).toHaveLength(12);
  });

  it("closes the source-claim-question graph and retains source rights and date limits", () => {
    const sourceIds = new Set(sources.map((source) => source.id));
    const claimIds = new Set(claims.map((claim) => claim.id));
    for (const source of sources) {
      expect(source.completeCitation.length).toBeGreaterThan(40);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.accessedOn).toBe("2026-11-11");
      expect(source.licenseLabel.length).toBeGreaterThan(0);
      expect(source.authorityAssessment.length).toBeGreaterThan(20);
      expect(source.reuseNotes.length).toBeGreaterThan(30);
      for (const id of source.evidenceClaimIds) {
        expect(claims.find((claim) => claim.id === id)!.sourceIds).toContain(source.id);
      }
    }
    for (const claim of claims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(claim.limitation).toBeTruthy();
      expect(claim.lastCheckedOn).toBe("2026-11-11");
      for (const sourceId of claim.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
    for (const question of questions) {
      for (const id of question.supportingEvidenceClaimIds) expect(claimIds.has(id)).toBe(true);
      const mapping = ledger.claimQuestionMappings.find((mapping) => mapping.questionVariantId === question.id);
      expect(mapping!.evidenceClaimIds).toEqual(question.supportingEvidenceClaimIds);
    }
  });

  it("provides specific manual author checks and individual distractor counterfactuals", () => {
    expect(gates).toHaveLength(16);
    for (const proposal of packet.proposals) {
      expect(proposal.manualAuthorGate.checks).toHaveLength(5);
      expect(proposal.manualAuthorGate.pipelinePassed).toBe(false);
      expect(proposal.manualAuthorGate.clinicianSignOff).toBe(false);
      expect(proposal.reasoning.step1.length).toBeGreaterThan(35);
      expect(proposal.reasoning.step2.length).toBeGreaterThan(35);
      expect(proposal.reasoning.decisionChangingCounterfactual.length).toBeGreaterThan(45);
      expect(proposal.distractorReviews).toHaveLength(proposal.question.answerChoices.length - 1);
      expect(proposal.distractorReviews.every((review) => review.counterfactualWhereReasonable.length > 20)).toBe(true);
    }
  });

  it("uses safe external clinical links and parses both durable JSON artifacts", () => {
    for (const link of links) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
    }
    for (const name of [
      "question-topic-breast-benign-high-risk-20261111.json",
      "sources-question-topic-breast-benign-high-risk-20261111.json",
    ]) expect(JSON.parse(readFileSync(root + "docs/research/" + name, "utf8"))).toBeTruthy();
  });
});
