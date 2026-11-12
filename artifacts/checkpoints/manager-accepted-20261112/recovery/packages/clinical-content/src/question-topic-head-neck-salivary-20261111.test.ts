import {topicCaseIsExplicitlyLive} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import { NECK_MASS_FAMILY } from "./development-batch/2026-10-07-variety-2/neck-mass-workup";
import { QUESTION_FLAG_QUESTIONS } from "./question-flags-20261104";
import { QUESTION_FLAG_ROUND2_QUESTIONS } from "./question-flags-round2-20261104";
import { QUESTION_FLAG_ROUND3_QUESTIONS } from "./question-flags-round3-20261104";
import { QUESTION_NEW_N1_QUESTIONS } from "./question-new-n1-20261104";
import { QUESTION_NEW_N1_ROUND2_QUESTIONS } from "./question-new-n1-round2-20261104";
import { QUESTION_NEW_N1_ROUND3_QUESTIONS } from "./question-new-n1-round3-20261104";
import { answerChoiceTimingRegistryEntrySchema, syntheticClinicalCaseSchema } from "./schema";
import {
  HEAD_NECK_SALIVARY_TOPIC_PACKET as packet,
  HEAD_NECK_SALIVARY_TOPIC_LEDGER as ledger,
  HEAD_NECK_SALIVARY_TOPIC_QUESTIONS as questions,
  HEAD_NECK_SALIVARY_TOPIC_NODES as nodes,
  HEAD_NECK_SALIVARY_TOPIC_CASES as cases,
  HEAD_NECK_SALIVARY_TOPIC_CONCEPT_PROPOSALS as concepts,
  HEAD_NECK_SALIVARY_TOPIC_TIMING_ENTRIES as timings,
  HEAD_NECK_SALIVARY_TOPIC_ORDER_PROPOSALS as orders,
  HEAD_NECK_SALIVARY_TOPIC_SOURCE_LINKS as links,
  HEAD_NECK_SALIVARY_TOPIC_PREVIEW_RELEASE as preview,
  HEAD_NECK_SALIVARY_TOPIC_REVISION_CANDIDATE_RELEASE as revisions,
  HEAD_NECK_SALIVARY_TOPIC_PARKED_ITEMS as parked,
  HEAD_NECK_SALIVARY_TOPIC_MANIFEST as manifest,
} from "./question-topic-head-neck-salivary-20261111";

const root = new URL("../../../", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, root), "utf8");
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const scoredItems = packet.proposedNodes.filter(item =>
  packet.reviewRound.statuses.find(status => status.code === item.code)!.status !== "parked");
const sourceQuestions = [
  ...NECK_MASS_FAMILY.questions,
  ...QUESTION_FLAG_QUESTIONS,
  ...QUESTION_FLAG_ROUND2_QUESTIONS,
  ...QUESTION_FLAG_ROUND3_QUESTIONS,
  ...QUESTION_NEW_N1_QUESTIONS,
  ...QUESTION_NEW_N1_ROUND2_QUESTIONS,
  ...QUESTION_NEW_N1_ROUND3_QUESTIONS,
];

describe("head-neck-salivary wave 12 explicit authoring sidecar", () => {
  it("reconciles every assigned row and registry-only identity with exactly one verdict", () => {
    const program = JSON.parse(read("docs/research/question-topic-program-20261111.json"));
    for (const key of ["inventory", "concepts", "caseAssignments", "nodeAssignments", "variantAssignments"] as const) {
      expect(packet.assignment[key]).toEqual(program[key].filter(
        (row: { primaryTopicSlug: string }) => row.primaryTopicSlug === "head-neck-salivary"));
    }
    expect(packet.audit).toHaveLength(14);
    expect(new Set(packet.audit.map(row => row.inventoryRecordId)).size).toBe(14);
    expect(packet.audit.map(row => row.inventoryRecordId).sort()).toEqual(
      packet.assignment.inventory.map(row => row.recordId).sort());
    expect(packet.audit.filter(row => row.verdict === "Keep")).toHaveLength(1);
    expect(packet.audit.filter(row => row.verdict === "Rewrite")).toHaveLength(2);
    expect(packet.audit.filter(row => row.verdict === "Retire-and-replace")).toHaveLength(11);
    expect(packet.assignment.concepts.find(row => row.registryOnly)?.conceptId)
      .toBe("concept.n1.neck-mass-core-after-inadequate-fna");
    expect(packet.assignment.recordedHolds).toEqual([]);
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints).toEqual([]);
    for (const row of packet.audit) {
      expect(row.reasons).toHaveLength(2);
      if (row.verdict === "Keep") continue;
      expect(row.replacementQuestionVariantIds.length).toBeGreaterThan(0);
      for (const id of row.replacementQuestionVariantIds) {
        expect(questions.some(question => question.id === id) ||
          packet.beforeSnapshots.some(snapshot => snapshot.question.id === id)).toBe(true);
      }
    }
  });

  it("binds exact before definitions and preserves current live clinical fields", () => {
    for (const row of packet.audit) {
      const before = packet.beforeSnapshots.find(item => item.inventoryRecordId === row.inventoryRecordId)!;
      expect(hash(before.question)).toBe(row.beforeQuestionSha256);
      expect(hash(before.node)).toBe(row.beforeNodeSha256);
      expect(hash(before.clinicalCase)).toBe(row.beforeCaseSha256);
      const currentQuestion = sourceQuestions.find(question => question.id === row.questionVariantId)!;
      expect(currentQuestion, row.questionVariantId).toEqual(before.question);
      if (!row.currentDefaultRelease) continue;
      const current = SYNTHETIC_CLINICAL_RELEASE.cases.find(item => item.id === row.caseId)!;
      expect(hash(current), row.caseId).toBe(row.beforeCaseSha256);
      expect(hash(current.decisionNodes.find(node => node.questionVariantId === row.questionVariantId)))
        .toBe(row.beforeNodeSha256);
    }
    expect(packet.assignment.frozenPassReferences).toEqual([]);
    expect(packet.assignment.clinicalApprovalReferences).toEqual([]);
    expect(packet.assignment.approvalReferenceSearch.acceptedHistoricalReference.decision)
      .toContain("Not independent PASS or clinical approval");
    expect(packet.assignment.priorReviewReferences).toHaveLength(4);
    expect(packet.audit.find(row => row.questionVariantId.endsWith(".v4.r4"))?.verdict).toBe("Keep");
  });

  it("keeps changed meaning separate from the old core-after-FNA learning history", () => {
    expect(questions).toHaveLength(9);
    expect(cases).toHaveLength(9);
    expect(concepts.filter(item => item.conceptRelation === "existing_meaning_variant")).toHaveLength(1);
    expect(concepts.filter(item => item.conceptRelation === "new_meaning")).toHaveLength(8);
    const replacement = packet.proposedNodes.find(item => item.code === "R03")!;
    expect(replacement.conceptId).toBe("concept.topic.head-neck-salivary.lymphoid-surgical-architecture.v1");
    expect(replacement.conceptIdentityDecision.previousConceptId)
      .toBe("concept.n1.neck-mass-core-after-inadequate-fna");
    expect(concepts.some(item => item.id === replacement.conceptIdentityDecision.previousConceptId)).toBe(false);
    for (const group of [questions, nodes, cases, concepts]) {
      expect(new Set(group.map(item => item.id)).size).toBe(group.length);
    }
    for (const clinicalCase of cases) topicCaseIsExplicitlyLive(clinicalCase.id);
    expect(SYNTHETIC_CLINICAL_RELEASE.cases.some(item => cases.some(draft => item.id === draft.id))).toBe(cases.some(clinicalCase => topicCaseIsExplicitlyLive(clinicalCase.id)));
  });

  it("uses complete clinic cases and separately records education, acuity and progression", () => {
    expect(preview.cases).toHaveLength(2);
    expect(revisions.cases).toHaveLength(7);
    expect([...preview.cases, ...revisions.cases].map(item => item.id).sort())
      .toEqual(cases.map(item => item.id).sort());
    expect(cases.every(item => item.decisionNodes.length === 1)).toBe(true);
    for (const clinicalCase of cases) {
      expect(syntheticClinicalCaseSchema.parse(clinicalCase)).toEqual(clinicalCase);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.presentation).toContain("attends clinic");
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.prototypeDemographics)
        .toEqual(clinicalCase.prototypeDemographics);
      const authored = packet.caseDefinitions.find(item => item.id === clinicalCase.id)!;
      expect(authored.educationalTier).toBe(2);
      expect(authored.patientAcuity).toBe("stable");
      expect(authored.facilityProgressionLevel).toBe(0);
      expect(authored.facilityCapabilities).toEqual([]);
      if (authored.clinicalSettingScope === "outside_hospital_chart_review") {
        expect(clinicalCase.presentation).toMatch(/outside (operation|admission|hospital)/);
        expect(authored.recordAcuity).toBe("urgent");
      }
    }
  });

  it("exports randomized scored nodes with no executable test, result gate or clinical promotion", () => {
    for (const question of questions) {
      expect(question.reviewStatus).toBe("needs_clinician_review");
      expect(question.lastClinicianReview).toBeNull();
      expect(question.shuffleAnswers).toBe(true);
      expect(question.answerChoices).toHaveLength(3);
      expect(question.answerChoices.filter(choice => choice.isCorrect)).toHaveLength(1);
    }
    for (const node of nodes) {
      expect(node.shuffleAnswers).toBe(true);
      expect(node.resultGateAfter).toBeNull();
      expect(node.answerChoices.every(choice => choice.serviceRequest === null)).toBe(true);
    }
    expect(manifest.pipelinePassed).toBe(false);
    expect(manifest.clinicalApproval).toBe(false);
    expect(manifest.managerAccepted).toBe(false);
    expect(manifest.publicReleaseAuthorized).toBe(false);
    expect(manifest.reviewOrderNotice).toBe("key shown first for review only.");
  });

  it("binds every testing choice and distractor to its exact existing profile and nonexecution tuple", () => {
    expect(timings).toHaveLength(nodes.length);
    expect(orders).toHaveLength(17);
    const profiles = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(item => item.id));
    for (const item of scoredItems) {
      const entry = timings.find(row => row.questionVariantId === item.questionVariantId)!;
      expect(answerChoiceTimingRegistryEntrySchema.parse(entry)).toEqual(entry);
      if (!item.choices.some(choice => choice.timing.kind === "test")) {
        expect(entry.classification.kind).toBe("no_test");
        continue;
      }
      if (entry.classification.kind !== "test_choices") throw new Error("Missing choice timings");
      expect(entry.classification.choices.map(choice => choice.choiceId)).toEqual(item.choices.map(choice => choice.id));
      for (const choice of item.choices) {
        const timing = entry.classification.choices.find(row => row.choiceId === choice.id)!;
        expect(timing.choiceLabel).toBe(choice.label);
        expect(timing.timing).toEqual(choice.timing);
        const order = orders.find(row => row.choiceId === choice.id);
        if (timing.timing.kind === "no_test") { expect(order).toBeUndefined(); continue; }
        expect(profiles.has(timing.timing.timingProfileId)).toBe(true);
        expect(order).toEqual({
          caseId: item.caseId, nodeId: item.nodeId, questionVariantId: item.questionVariantId,
          choiceId: choice.id, choiceLabel: choice.label, timingProfileId: timing.timing.timingProfileId,
          disposition: { kind: "not_executed", reason: "future_planned" },
        });
      }
    }
    expect(orders.find(row => row.choiceId.endsWith("n09.v2.arterial"))?.timingProfileId)
      .toBe("timing.test.ct_angiography");
    expect(orders.find(row => row.choiceId.endsWith("n06.surveillance"))?.timingProfileId)
      .toBe("timing.test.mri");
  });

  it("freezes exact PASS definitions and preserves their complete clinical context when split", () => {
    expect(packet.reviewRound.passFreeze.map(item => item.code)).toEqual(["N01", "N06"]);
    for (const frozen of packet.reviewRound.passFreeze) {
      const authored = packet.proposedNodes.find(item => item.code === frozen.code)!;
      const question = questions.find(item => item.id === frozen.questionVariantId)!;
      const node = nodes.find(item => item.questionVariantId === frozen.questionVariantId)!;
      expect(authored).toEqual(frozen.authoredNode);
      expect(hash(authored)).toBe(frozen.authoredNodeSha256);
      expect(question).toEqual(frozen.question);
      expect(hash(question)).toBe(frozen.questionSha256);
      expect(node).toEqual(frozen.node);
      expect(hash(node)).toBe(frozen.nodeSha256);
      expect(timings.find(item => item.questionVariantId === frozen.questionVariantId)).toEqual(frozen.timing);
      expect(orders.filter(item => item.questionVariantId === frozen.questionVariantId)).toEqual(frozen.orders);
      const clinicalCase = cases.find(item => item.id === authored.caseId)!;
      const { decisionNodes: oldNodes, learningSummary: oldSummary, sourceLabels: oldLabels, ...oldContext } = frozen.clinicalCase;
      const { decisionNodes: splitNodes, learningSummary: splitSummary, sourceLabels: splitLabels, ...splitContext } = clinicalCase;
      expect(splitContext).toEqual(oldContext);
      expect(oldNodes.length).toBe(2);
      expect(oldSummary.length).toBeGreaterThan(0);
      expect(oldLabels.length).toBeGreaterThan(0);
      expect(splitNodes).toHaveLength(1);
      expect(splitSummary).toBe(node.explanation);
      expect(splitLabels).toEqual(node.sourceLabels);
      const bound = splitNodes[0]!;
      const { terminalDispositions: added, ...boundClinical } = bound;
      const { terminalDispositions: reviewed, ...frozenClinical } = node;
      expect(boundClinical).toEqual(frozenClinical);
      if (frozen.code === "N06") expect(bound).toEqual(node);
      else {
        expect(reviewed).toEqual([]);
        expect(added).toHaveLength(2);
        for (const disposition of added) {
          expect(disposition.kind).toBe("no_terminal_outcome");
          if (disposition.kind !== "no_terminal_outcome") throw new Error("Unexpected outcome in PASS split");
          expect(disposition.clinicalRationale).toBe(node.answerChoices
            .find(choice => choice.id === disposition.answerChoiceId)!.rationale);
          expect(disposition.sourceLabels).toEqual(node.sourceLabels);
        }
      }
    }
  });

  it("records one attempt per returned item and accounts for every indexed review note", () => {
    const originalText = read(packet.reviewRound.reviewFile);
    expect(createHash("sha256").update(originalText).digest("hex"))
      .toBe(packet.reviewRound.reviewFileSha256);
    expect(packet.reviewRound.review).toEqual(JSON.parse(originalText));
    expect(packet.reviewRound.statuses).toHaveLength(12);
    expect(packet.reviewRound.statuses.filter(item => item.status === "pass-preserved")).toHaveLength(2);
    expect(packet.reviewRound.statuses.filter(item => item.status === "revised")).toHaveLength(7);
    expect(packet.reviewRound.statuses.filter(item => item.status === "parked")).toHaveLength(3);
    expect(packet.reviewRound.attempts).toHaveLength(10);
    for (const status of packet.reviewRound.statuses) {
      const review = packet.reviewRound.review.find(item => item.id === status.reviewedQuestionVariantId)!;
      expect(status.clinicianReviewStatus).toBe("needs_clinician_review");
      if (review.verdict === "PASS") {
        expect(status.status).toBe("pass-preserved");
        expect(status.attemptCount).toBe(0);
        expect(status.currentQuestionVariantId).toBe(status.reviewedQuestionVariantId);
        continue;
      }
      expect(status.attemptCount).toBe(1);
      expect(status.independentVerdictForCurrentVersion).toBe("not_reviewed");
      const attempt = packet.reviewRound.attempts.find(item => item.code === status.code)!;
      expect(hash(packet.proposedNodes.find(item => item.code === status.code))).toBe(attempt.afterNodeSha256);
      expect(attempt.independentPassClaimed).toBe(false);
      expect(attempt.clinicalApprovalClaimed).toBe(false);
      for (const group of ["clarityIssues", "cues", "fairness", "suggestions"] as const) {
        expect(attempt.reviewNoteDispositions[group].map(item => item.note)).toEqual(review[group]);
        expect(attempt.reviewNoteDispositions[group].map(item => item.index))
          .toEqual(review[group].map((_, index) => index));
        expect(attempt.reviewNoteDispositions[group].every(item => item.response.length > 30)).toBe(true);
      }
    }
  });

  it("excludes parked attempts and revised versions from PASS-only preview admission", () => {
    expect(parked.map(item => item.code)).toEqual(["N02", "N03", "N10"]);
    for (const item of parked) {
      expect(questions.some(question => question.id === item.questionVariantId)).toBe(false);
      expect(nodes.some(node => node.questionVariantId === item.questionVariantId)).toBe(false);
      expect(cases.some(clinicalCase => clinicalCase.decisionNodes.some(node => node.id === item.nodeId))).toBe(false);
      expect(timings.some(entry => entry.questionVariantId === item.questionVariantId)).toBe(false);
      expect(orders.some(entry => entry.questionVariantId === item.questionVariantId)).toBe(false);
      expect(packet.reviewRound.parkedCaseDefinitions.some(definition => definition.nodeCodes.includes(item.code))).toBe(true);
    }
    for (const item of parked.filter(item => ["N03", "N10"].includes(item.code))) {
      expect(item.choices.every(choice => !choice.isCorrect)).toBe(true);
    }
    const previewIds = preview.cases.flatMap(item => item.decisionNodes.map(node => node.questionVariantId));
    expect(previewIds.sort()).toEqual(packet.reviewRound.passFreeze.map(item => item.questionVariantId).sort());
    for (const clinicalCase of preview.cases) {
      expect(clinicalCase.decisionNodes.every(node => packet.reviewRound.statuses.some(status =>
        status.currentQuestionVariantId === node.questionVariantId && status.status === "pass-preserved"))).toBe(true);
    }
    expect(packet.reviewRound.compositionProposals.every(item => item.executable === false)).toBe(true);
  });

  it("reconciles atomic claims, both mapping directions and source rights without approval", () => {
    const claimIds = new Set(ledger.evidenceClaims.map(item => item.id));
    const sourceIds = new Set(ledger.sources.map(item => item.id));
    for (const item of packet.proposedNodes) {
      expect(item.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      for (const id of item.supportingEvidenceClaimIds) {
        expect(claimIds.has(id)).toBe(true);
        expect(ledger.claimToQuestions.find(row => row.claimId === id)?.questionVariantIds)
          .toContain(item.questionVariantId);
      }
      expect(ledger.statementMappings.find(row => row.questionVariantId === item.questionVariantId)?.claimIds)
        .toEqual(item.supportingEvidenceClaimIds);
    }
    for (const claim of ledger.evidenceClaims) {
      expect(claim.reviewStatus).toBe("needs_clinician_review");
      expect(claim.lastCheckedOn).toBe("2026-11-11");
      expect(claim.limitation.length).toBeGreaterThan(15);
      for (const id of claim.sourceIds) {
        expect(sourceIds.has(id)).toBe(true);
        expect(ledger.sources.find(source => source.id === id)?.evidenceClaimIds).toContain(claim.id);
      }
    }
    for (const source of ledger.sources) {
      expect(source.completeCitation.length).toBeGreaterThan(50);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.licenseLabel.length).toBeGreaterThan(20);
      expect(source.authorityAssessment.length).toBeGreaterThan(30);
      expect(source.officialUrl).toMatch(/^https:\/\//);
    }
    for (const link of links) {
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
    }
    expect(ledger.excludedSources.some(source => source.url?.includes("entnet.org"))).toBe(true);
    expect(ledger.sources.some(source => source.officialUrl.includes("entnet.org"))).toBe(false);
  });

  it("retains concrete author attacks, sequenced updates and the withheld clinical disagreement", () => {
    for (const item of packet.proposedNodes) {
      expect(item.authorGate.independent).toBe(false);
      expect(item.authorGate.clinicalApproval).toBe(false);
      expect(item.authorGate.coverTheKeyCueAttack.length).toBeGreaterThan(100);
      expect(item.authorGate.twoConsequentialSteps).toHaveLength(2);
      expect(item.authorGate.deletionAndUpdateCheck.length).toBeGreaterThan(100);
      expect(item.reasoning.decidingObservation.length).toBeGreaterThan(30);
      expect(item.reasoning.counterfactual.length).toBeGreaterThan(50);
      for (const choice of item.choices.filter(choice => !choice.isCorrect)) {
        expect(choice.temptation.length).toBeGreaterThan(20);
        expect(choice.correctUnderCounterfactual.length).toBeGreaterThan(30);
      }
    }
    for (const definition of packet.caseDefinitions.filter(item => item.nodeCodes.length === 2)) {
      const second = packet.proposedNodes.find(item => item.code === definition.nodeCodes[1])!;
      expect(second.currentUpdate!.length).toBeGreaterThan(100);
    }
    expect(ledger.withheldDisagreements).toHaveLength(1);
    expect(ledger.withheldDisagreements[0]!.id).toBe("hold.head-neck-salivary.functioning-invaded-nerve");
    expect(packet.ownerApprovalsNeeded.some(item => item.id === ledger.withheldDisagreements[0]!.id)).toBe(true);
  });
});
