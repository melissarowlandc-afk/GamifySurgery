import {topicQuestionAcceptance} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE as balance } from "@gamify-surgery/balance-config";
import { SYNTHETIC_CLINICAL_RELEASE as live } from "./synthetic-content";
import { QUESTION_SHIP_MANIFEST as manifest } from "./question-ship-manifest";
import { decisionNodeSchema, syntheticClinicalCaseSchema, testedConceptSchema } from "./schema";

const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const beforeImport = { live: sha(live), manifest: sha(manifest) };
const topic = await import("./question-topic-hematology-transfusion-coagulation-20261111");
const packet = topic.HEMATOLOGY_TOPIC_PACKET;
const ledger = topic.HEMATOLOGY_TOPIC_SOURCE_LEDGER;
const nodes = topic.HEMATOLOGY_TOPIC_NODES;
const root = new URL("../../../", import.meta.url);

describe("hematology topic explicit-import authoring sidecar", () => {
  it("reconciles every exact assigned variant and all three verdict totals", () => {
    const program = JSON.parse(readFileSync(new URL("docs/research/question-topic-program-20261111.json", root), "utf8")) as {
      inventory: Array<{ primaryTopicSlug: string; recordId: string }>;
    };
    const assigned = program.inventory.filter((row) => row.primaryTopicSlug === packet.topicSlug);
    expect(assigned).toHaveLength(51);
    expect(packet.audit.map((row) => row.inventoryRecordId).sort()).toEqual(assigned.map((row) => row.recordId).sort());
    expect(new Set(packet.audit.map((row) => row.inventoryRecordId)).size).toBe(51);
    expect(packet.audit.filter((row) => row.verdict === "Keep")).toHaveLength(2);
    expect(packet.audit.filter((row) => row.verdict === "Rewrite")).toHaveLength(7);
    expect(packet.audit.filter((row) => row.verdict === "Retire-and-replace")).toHaveLength(42);
    expect(packet.assignment.inventory.filter((row) => row.live)).toHaveLength(22);
    expect(packet.assignment.inventory.filter((row) => !row.live)).toHaveLength(29);
    const proposed = new Set(packet.proposedNodes.map((node) => node.questionVariantId));
    for (const row of packet.audit) {
      expect(row.reasons.length).toBeGreaterThanOrEqual(2);
      expect(row.beforeContentVersion.length).toBeGreaterThan(5);
      expect(row.beforeQuestionSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(row.replacementQuestionVariantIds.every((id) => proposed.has(id))).toBe(true);
      if (row.verdict !== "Keep") expect(row.replacementQuestionVariantIds.length).toBeGreaterThan(0);
    }
  });

  it("preserves the exact input questions, retained contexts and direct source files", () => {
    expect(packet.preservedQuestionDefinitions).toHaveLength(51);
    expect(packet.preservedRetainedContexts).toHaveLength(45);
    expect(packet.contextAudit).toHaveLength(45);
    for (const entry of packet.preservedQuestionDefinitions) expect(sha(entry.questionDefinition)).toBe(entry.sha256);
    for (const entry of packet.preservedRetainedContexts) {
      expect(sha(entry.caseDefinition)).toBe(entry.caseSha256);
      expect(sha(entry.nodeDefinition)).toBe(entry.nodeSha256);
      const audit = packet.contextAudit.find((row) => row.caseSha256 === entry.caseSha256 && row.nodeSha256 === entry.nodeSha256)!;
      expect(audit.auditRecordIds.length).toBeGreaterThan(0);
      expect(audit.contextFinding.length).toBeGreaterThan(80);
    }
    const directFiles = new Set(packet.assignment.inventory.map((entry) => entry.fileLocation.file));
    for (const input of packet.assignment.sourceHashes.filter((entry) => directFiles.has(entry.file))) {
      expect(createHash("sha256").update(readFileSync(new URL(input.file, root))).digest("hex"), input.file)
        .toBe(input.currentSha256);
    }
  });

  it("retains exact PASS and clinical approvals without conferring either on drafts", () => {
    expect(packet.frozenIndependentPass).toHaveLength(2);
    for (const frozen of packet.frozenIndependentPass) {
      expect(frozen.review.verdict).toBe("PASS");
      const old = packet.preservedQuestionDefinitions.find((entry) => entry.questionDefinition.id === frozen.questionVariantId)!;
      expect(old.sha256).toBe(frozen.questionSha256);
      expect(old.questionDefinition.contentVersion).toBe(frozen.contentVersion);
      expect(frozen.clinicalApproval).toBe(false);
    }
    expect(packet.frozenClinicalApprovals).toHaveLength(2);
    expect(packet.preservedQuestionDefinitions.filter((entry) => entry.questionDefinition.reviewStatus === "clinically_approved"))
      .toHaveLength(24);
    for (const frozen of packet.frozenClinicalApprovals) expect(sha(frozen.approval)).toBe(frozen.approvalSha256);
    for (const item of [...topic.HEMATOLOGY_TOPIC_QUESTIONS, ...topic.HEMATOLOGY_TOPIC_AUTHORING_CONCEPTS,
      ...topic.HEMATOLOGY_TOPIC_CLAIMS, ...topic.HEMATOLOGY_TOPIC_SOURCES]) {
      expect(item.reviewStatus).toBe("needs_clinician_review");
      expect(item.lastClinicianReview).toBeNull();
    }
    expect(topic.HEMATOLOGY_TOPIC_REVIEW_METADATA.independentPass).toBe(false);
    expect(topic.HEMATOLOGY_TOPIC_REVIEW_METADATA.managerAccepted).toBe(false);
    expect(topic.HEMATOLOGY_TOPIC_REVIEW_METADATA.publicReleaseAuthorized).toBe(false);
  });

  it("carries all holds and all registry-only identities explicitly", () => {
    expect(packet.assignment.recordedHolds.map((entry) => entry.id).sort()).toEqual([
      "claim.n1r3.vka-sustained-reversal", "flags2-G01", "review.n2.factor-assays-without-mixing-gate.v2",
    ].sort());
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints).toEqual([]);
    expect(packet.registryCoverageHistory).toHaveLength(15);
    expect(packet.registryCoverageHistory.filter((entry) => entry.registered && entry.registryOnly)).toHaveLength(4);
    expect(packet.ownerApprovalsNeeded.some((entry) => entry.id === "carry-flags2-G01")).toBe(true);
    expect(packet.ownerApprovalsNeeded.some((entry) => entry.id === "carry-vka-sustained-reversal")).toBe(true);
    expect(packet.ownerApprovalsNeeded.some((entry) => entry.id === "carry-n2-factor-priority")).toBe(true);
  });

  it("materializes all drafts as named adult cases in the existing clinic setting", () => {
    expect(topic.HEMATOLOGY_TOPIC_CASES).toHaveLength(23);
    expect(nodes).toHaveLength(23);
    expect(topic.HEMATOLOGY_TOPIC_QUESTIONS).toHaveLength(23);
    expect(topic.HEMATOLOGY_TOPIC_CASES.every((item) => item.decisionNodes.length === 1)).toBe(true);
    expect(new Set(nodes.map((node) => node.id)).size).toBe(23);
    expect(new Set(nodes.map((node) => node.questionVariantId)).size).toBe(23);
    for (const clinicalCase of topic.HEMATOLOGY_TOPIC_CASES) {
      expect(syntheticClinicalCaseSchema.safeParse(clinicalCase).success).toBe(true);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.releasePointId).toBe("release.l0.clinic_evaluation");
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.tutorialEligible).toBe(false);
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.presentation).toContain(clinicalCase.patientDisplayName);
      expect(clinicalCase.presentation).toContain(`${clinicalCase.prototypeDemographics!.ageYears}-year-old`);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(clinicalCase.prototypeDemographics);
      const review = topic.HEMATOLOGY_TOPIC_REVIEW_METADATA.caseReviews.find((row) => row.caseId === clinicalCase.id)!;
      expect(review.patientAcuity).toBe("stable");
      expect(review.educationalTier).toBe(2);
      expect(review.earliestFacilityStage).toBe(0);
      expect(clinicalCase.decisionNodes.map((node) => node.questionVariantId))
        .toEqual(packet.sequenceAudit.find((row) => row.caseId === clinicalCase.id)!.orderedQuestionIds);
    }
  });

  it("keeps complete tasks, one key, randomized choices and no simulated orders", () => {
    for (const node of nodes) {
      expect(decisionNodeSchema.safeParse(node).success).toBe(true);
      expect(node.stem.endsWith("?")).toBe(true);
      expect([3, 4]).toContain(node.answerChoices.length);
      expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(node.shuffleAnswers).toBe(true);
      expect(node.resultGateAfter).toBeNull();
      expect(node.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
      for (const choice of node.answerChoices) expect(choice.rationale!.length).toBeGreaterThan(30);
    }
    expect(topic.HEMATOLOGY_TOPIC_ORDER_PROPOSALS.every((entry) => !entry.executesOrder && entry.resultGateAfter === null)).toBe(true);
    expect(topic.HEMATOLOGY_TOPIC_REVIEW_METADATA.reviewDisplay).toBe("key shown first for review only");
  });

  it("maps every testing choice and exact label to an existing placeholder profile", () => {
    const knownProfiles = new Set(balance.answerChoiceTimingProfiles.map((profile) => profile.id));
    expect(topic.HEMATOLOGY_TOPIC_TIMING_PROPOSALS).toHaveLength(23);
    let timedChoices = 0;
    for (const proposal of packet.proposedNodes) {
      const entry = topic.HEMATOLOGY_TOPIC_TIMING_PROPOSALS.find((row) => row.questionVariantId === proposal.questionVariantId)!;
      const expected = proposal.choices.filter((choice) => choice.timingProfileId);
      if (expected.length) {
        expect(entry.classification.kind).toBe("test_choices");
        if (entry.classification.kind !== "test_choices") throw new Error("Missing exact-choice timing");
        expect(entry.classification.choices).toHaveLength(proposal.choices.length);
        for (const choice of proposal.choices) {
          const timing = entry.classification.choices.find((row) => row.choiceId === choice.id)!;
          expect(timing.choiceLabel).toBe(choice.label);
          if (choice.timingProfileId) {
            expect(timing.timing).toEqual({ kind: "test", timingProfileId: choice.timingProfileId });
            expect(knownProfiles.has(choice.timingProfileId)).toBe(true);
            timedChoices++;
          } else expect(timing.timing).toEqual({ kind: "no_test" });
        }
      } else expect(entry.classification).toEqual({ kind: "no_test" });
    }
    expect(timedChoices).toBe(32);
  });

  it("preserves unchanged concepts and explicitly versions six further changed meanings", () => {
    expect(topic.HEMATOLOGY_TOPIC_CONCEPTS).toHaveLength(23);
    for (const concept of topic.HEMATOLOGY_TOPIC_CONCEPTS) expect(testedConceptSchema.safeParse(concept).success).toBe(true);
    expect(packet.countBasis.reusedConceptIds).toHaveLength(5);
    expect(packet.countBasis.newConceptIds).toHaveLength(18);
    const changed = packet.proposedNodes.filter((node) => node.previousConceptId && node.conceptRelation === "new_meaning");
    expect(changed).toHaveLength(7);
    expect(changed.find((node) => node.key === "cholestasis-correction")!.previousConceptId)
      .toBe("concept.obstructive-jaundice.vitamin-k-coagulopathy");
    for (const node of packet.proposedNodes) {
      const before = packet.reviewRound.before.proposedNodes.find((old) => old.key === node.key)!;
      const changedThisRound = Object.hasOwn(node, "meaningChangeFromReviewedV1");
      if (changedThisRound) {
        expect(node.previousConceptId).toBe(before.conceptId);
        expect(node.conceptId).not.toBe(before.conceptId);
      } else expect(node.conceptId).toBe(before.conceptId);
    }
    expect(packet.proposedNodes.filter((node) => Object.hasOwn(node, "meaningChangeFromReviewedV1"))).toHaveLength(6);
    expect(packet.proposedNodes.filter((node) => node.proposalKind === "new")).toHaveLength(16);
    expect(packet.proposedNodes.filter((node) => node.proposalKind === "replacement")).toHaveLength(7);
    for (const node of packet.proposedNodes.filter((node) => node.proposalKind === "new")) expect(node.before).toEqual([]);
  });

  it("requires complete bibliographic metadata and bidirectional claim mappings", () => {
    expect(ledger.sources).toHaveLength(36);
    expect(ledger.evidenceClaims).toHaveLength(63);
    const sourceIds = new Set(ledger.sources.map((source) => source.id));
    const claimIds = new Set(ledger.evidenceClaims.map((claim) => claim.id));
    for (const source of ledger.sources) {
      expect(source.completeCitation.length).toBeGreaterThan(30);
      expect(source.organizationOrJournal.length).toBeGreaterThan(2);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toMatch(/^2026-\d{2}-\d{2}$/);
      expect(source.licenseLabel.length).toBeGreaterThan(5);
      expect(source.reuseNotes.length).toBeGreaterThan(30);
      expect(source.authorityAssessment.length).toBeGreaterThan(30);
      expect(source.evidenceClaimIds.slice().sort()).toEqual(ledger.evidenceClaims.filter((claim) => claim.sourceIds.includes(source.id)).map((claim) => claim.id).sort());
    }
    for (const claim of ledger.evidenceClaims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(claim.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
      expect(claim.limitation!.length).toBeGreaterThan(15);
      expect(claim.lastCheckedOn).toMatch(/^2026-\d{2}-\d{2}$/);
      const reverse = ledger.claimToQuestionMappings.find((row) => row.claimId === claim.id)!;
      expect(reverse.questionVariantIds.slice().sort()).toEqual(packet.proposedNodes.filter((node) => node.supportingEvidenceClaimIds.includes(claim.id)).map((node) => node.questionVariantId).sort());
    }
    for (const node of packet.proposedNodes) {
      expect(node.supportingEvidenceClaimIds.every((id) => claimIds.has(id))).toBe(true);
      expect(ledger.questionClaimMappings.find((row) => row.questionVariantId === node.questionVariantId)!.supportingEvidenceClaimIds)
        .toEqual(node.supportingEvidenceClaimIds);
      const fields = packet.statementMappings.filter((mapping) => mapping.questionVariantId === node.questionVariantId);
      expect(fields.some((mapping) => mapping.field === "presentation")).toBe(true);
      expect(fields.some((mapping) => mapping.field === "explanation")).toBe(true);
      expect(fields.filter((mapping) => mapping.field.startsWith("choices.")).length).toBe(node.choices.length);
    }
    expect(ledger.sources.find((source) => source.id === "source.bsg.iron-deficiency-anaemia.2021")!.accessedOn).toBe("2026-09-09");
    expect(ledger.evidenceClaims.find((claim) => claim.id.endsWith(".ida-endoscopy"))!.lastCheckedOn).toBe("2026-09-09");
  });

  it("binds concrete five-check self-review to every exact proposed context", () => {
    for (const node of packet.proposedNodes) {
      const clinicalCase = packet.caseCompositionProposals.find((item) => item.id === node.caseId)!;
      const exact = {
        caseId: clinicalCase.id, name: clinicalCase.name, age: clinicalCase.age, sex: clinicalCase.sex,
        chiefComplaint: clinicalCase.chiefComplaint, presentation: clinicalCase.presentation,
        questionVariantId: node.questionVariantId, conceptId: node.conceptId, task: node.task,
        currentUpdate: node.currentUpdate, exhibit: node.exhibit, choices: node.choices,
        explanation: node.explanation, supportingEvidenceClaimIds: node.supportingEvidenceClaimIds,
      };
      expect(sha(exact), node.key).toBe(node.authorGateExactSha256);
      expect(node.manualAuthorGate).toHaveLength(5);
      expect(node.manualAuthorGate.every((check) => check.record.length > 60)).toBe(true);
      expect(node.reasoningSteps).toHaveLength(2);
      expect(node.decidingObservation.length).toBeGreaterThan(30);
      expect(node.counterfactual.length).toBeGreaterThan(50);
      expect(node.errorConsequence.length).toBeGreaterThan(30);
      expect(node.authorSelfCheck.independentPass).toBe(false);
      expect(node.authorSelfCheck.clinicalApproval).toBe(false);
      for (const choice of node.choices) {
        expect(choice.temptation.length).toBeGreaterThan(20);
        expect(choice.counterfactualWhereReasonable.length).toBeGreaterThan(30);
      }
    }
  });

  it("reconciles the exact independent review with one disposition per item", () => {
    const bytes = readFileSync(new URL(packet.reviewRound.reviewPath, root));
    const review = JSON.parse(bytes.toString("utf8")) as Array<{ id: string; verdict: string }>;
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(packet.reviewRound.reviewSha256);
    expect(packet.reviewRound.items.map((item) => item.beforeQuestionVariantId).sort())
      .toEqual(review.map((item) => item.id).sort());
    expect(packet.reviewRound.items.filter((item) => item.status === "pass-preserved")).toHaveLength(1);
    expect(packet.reviewRound.items.filter((item) => item.status === "revised")).toHaveLength(22);
    expect(packet.reviewRound.items.filter((item) => item.status === "parked")).toHaveLength(1);
    for (const item of packet.reviewRound.items) {
      expect(item.review).toEqual(review.find((entry) => entry.id === item.beforeQuestionVariantId));
      expect(item.issueResponses.map((entry) => entry.reviewField))
        .toEqual(["clarityIssues", "cues", "fairness", "suggestions"]);
      expect(item.issueResponses.every((entry) => entry.response.length > 60)).toBe(true);
      expect(item.clinicalApproval).toBe(false);
      if (item.status === "pass-preserved") {
        expect(item.revisionAttempts).toBe(0);
        expect(item.afterQuestionVariantId).toBe(item.beforeQuestionVariantId);
        expect(item.independentPass).toBe(true);
      } else {
        expect(item.revisionAttempts).toBe(1);
        expect(item.independentPass).toBe(false);
        expect(nodes.some((node) => node.questionVariantId === item.beforeQuestionVariantId)).toBe(false);
        if (item.status === "revised") {
          const after = topic.HEMATOLOGY_TOPIC_QUESTIONS.find((entry) => entry.id === item.afterQuestionVariantId)!;
          expect(after.id).toMatch(/\.v2$/);
          expect(after.contentVersion).toBe(packet.contentVersion);
        } else {
          expect(item.afterQuestionVariantId).toBeNull();
          expect(item.afterNodeId).toBeNull();
        }
      }
    }
  });

  it("preserves the reviewed PASS runtime definitions and every visible word exactly", () => {
    const frozen = topic.HEMATOLOGY_TOPIC_REVIEW_PASS;
    expect(frozen.questionSha256).toBe("3c457de4905c170462dc8cf79af5abd452961f69725427dd69761e5fcae2f7e1");
    expect(frozen.nodeSha256).toBe("8f9ebf64b468c86390aea424c50cf37897beda334572990a3a2c39adc853d9b1");
    expect(frozen.caseSha256).toBe("1ae61696537d059669dee2806110089e44b2f17200df4acd67755a0758735517");
    expect(frozen.proposalSha256).toBe("7383e7d31bdc30f6b1a4cc4072e61a23935722cabdda038a715429efa7a78bc0");
    expect(sha(frozen.question)).toBe(frozen.questionSha256);
    expect(sha(frozen.node)).toBe(frozen.nodeSha256);
    expect(sha(frozen.case)).toBe(frozen.caseSha256);
    expect(sha(frozen.proposal)).toBe(frozen.proposalSha256);
    expect(topic.HEMATOLOGY_TOPIC_QUESTIONS.find((item) => item.id === frozen.question.id)).toEqual(frozen.question);
    expect(nodes.find((item) => item.id === frozen.node.id)).toEqual(frozen.node);
    expect(packet.proposedNodes.find((item) => item.questionVariantId === frozen.question.id)).toEqual(frozen.proposal);
    const split = topic.HEMATOLOGY_TOPIC_CASES.find((item) => item.id === frozen.case.id)!;
    expect(split).toEqual({ ...frozen.case, decisionNodes: [frozen.node] });
    expect(split.decisionNodes).toHaveLength(1);
    expect(split.decisionNodes[0]!.currentUpdate).toBe(frozen.node.currentUpdate);
  });

  it("excludes the parked fluid item and prevents mixed-review multipart cases", () => {
    expect(topic.HEMATOLOGY_TOPIC_PARKED_ITEMS).toHaveLength(1);
    const parked = topic.HEMATOLOGY_TOPIC_PARKED_ITEMS[0]!;
    expect(parked.status).toBe("parked");
    expect(parked.originalProposal.key).toBe("trali-support");
    expect(parked.revisionAttempt.reasonAttemptNotRetained.length).toBeGreaterThan(100);
    expect(nodes.some((node) => node.id === parked.originalProposal.nodeId)).toBe(false);
    expect(topic.HEMATOLOGY_TOPIC_QUESTIONS.some((question) => question.id === parked.revisionAttempt.questionVariantId)).toBe(false);
    const passing = new Set(topic.HEMATOLOGY_TOPIC_REVIEW_METADATA.independentPassQuestionVariantIds);
    for (const clinicalCase of topic.HEMATOLOGY_TOPIC_CASES.filter((item) => item.decisionNodes.length > 1)) {
      expect(clinicalCase.decisionNodes.every((node) => passing.has(node.questionVariantId))).toBe(true);
    }
    expect(packet.reviewRound.futureMultipartCandidates.filter((item) => item.status === "withheld_until_all_exact_nodes_pass_in_context"))
      .toHaveLength(6);
    expect(packet.reviewRound.futureMultipartCandidates.filter((item) => item.status === "do_not_recompose_changed_context"))
      .toHaveLength(2);
    for (const node of packet.proposedNodes) {
      expect(node.exhibit!.items.every((item) => !item.value.includes("?")), node.key).toBe(true);
    }
    const compatibility = packet.proposedNodes.find((item) => item.key === "antigen-compatible-rbc")!;
    expect(compatibility.choices).toHaveLength(4);
    expect(new Set(compatibility.choices.map((choice) => choice.label)).size).toBe(4);
  });

  it("uses safe source links and leaves the assembled release unchanged", () => {
    for (const link of topic.HEMATOLOGY_TOPIC_SOURCE_LINKS) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
    }
    expect(sha(live)).toBe(beforeImport.live);
    expect(sha(manifest)).toBe(beforeImport.manifest);
    const ids = new Set(nodes.map((node) => node.questionVariantId));
    for (const node of nodes) topicQuestionAcceptance(node.questionVariantId);
    expect(live.cases.flatMap((item) => item.decisionNodes).some((node) => ids.has(node.questionVariantId))).toBe(nodes.some(node => topicQuestionAcceptance(node.questionVariantId).live));
  });
});
