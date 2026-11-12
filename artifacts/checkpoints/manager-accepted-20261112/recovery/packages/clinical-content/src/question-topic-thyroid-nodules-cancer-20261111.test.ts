import {topicQuestionAcceptance, retainedTopicCase} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import { QUESTION_QUALITY_REVISIONS } from "./question-quality-pilot-20261028";
import { syntheticClinicalCaseSchema, answerChoiceTimingRegistryEntrySchema } from "./schema";
import {
  THYROID_NODULES_CANCER_TOPIC_PACKET as packet,
  THYROID_NODULES_CANCER_TOPIC_LEDGER as ledger,
  THYROID_NODULES_CANCER_TOPIC_QUESTIONS as questions,
  THYROID_NODULES_CANCER_TOPIC_NODES as nodes,
  THYROID_NODULES_CANCER_TOPIC_CASES as cases,
  THYROID_NODULES_CANCER_TOPIC_CONCEPT_PROPOSALS as concepts,
  THYROID_NODULES_CANCER_TOPIC_TIMING_ENTRIES as timings,
  THYROID_NODULES_CANCER_TOPIC_ORDER_PROPOSALS as orders,
  THYROID_NODULES_CANCER_TOPIC_SOURCE_LINKS as links,
  THYROID_NODULES_CANCER_TOPIC_PREVIEW_RELEASE as preview,
  THYROID_NODULES_CANCER_TOPIC_REVISION_CANDIDATE_RELEASE as candidates,
  THYROID_NODULES_CANCER_TOPIC_PASS_PRESERVED_CASES as passedCases,
  THYROID_NODULES_CANCER_TOPIC_REVISION_CANDIDATE_CASES as revisedCases,
  THYROID_NODULES_CANCER_TOPIC_PARKED_ATTEMPTS as parked,
  THYROID_NODULES_CANCER_TOPIC_MANIFEST as manifest,
} from "./question-topic-thyroid-nodules-cancer-20261111";

const root = new URL("../../../", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, root), "utf8");
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const textHash = (value: string) => createHash("sha256").update(value).digest("hex");
const round = packet.reviewRound;
const byCode = (code: string) => packet.proposedNodes.find(item => item.code === code)!;
const state = (code: string) => round.statuses.find(item => item.code === code)!;
const active = packet.proposedNodes.filter(item => state(item.code).status !== "parked");

describe("thyroid topic bounded independent-review return", () => {
  it("retains the complete 63-row assignment and original audit without treating parks as replacements", () => {
    const program = JSON.parse(read("docs/research/question-topic-program-20261111.json"));
    for (const key of ["inventory", "concepts", "caseAssignments", "nodeAssignments", "variantAssignments"] as const) {
      expect(packet.assignment[key]).toEqual(program[key].filter((row: { primaryTopicSlug: string }) =>
        row.primaryTopicSlug === "thyroid-nodules-cancer"));
    }
    expect(packet.audit).toHaveLength(63);
    expect(packet.assignment.concepts).toHaveLength(18);
    expect(new Set(packet.audit.map(row => row.inventoryRecordId)).size).toBe(63);
    expect(packet.audit.map(row => row.inventoryRecordId).sort()).toEqual(
      packet.assignment.inventory.map(row => row.recordId).sort());
    expect(packet.audit.filter(row => row.verdict === "Keep")).toHaveLength(3);
    expect(packet.audit.filter(row => row.verdict === "Rewrite")).toHaveLength(6);
    expect(packet.audit.filter(row => row.verdict === "Retire-and-replace")).toHaveLength(54);
    for (const row of packet.audit) {
      const before = packet.beforeSnapshots.find(item => item.inventoryRecordId === row.inventoryRecordId)!;
      expect(hash(before.question)).toBe(row.beforeQuestionSha256);
      expect(hash(before.node)).toBe(row.beforeNodeSha256);
      expect(hash(before.clinicalCase)).toBe(row.beforeCaseSha256);
      expect(row.reasons.length).toBeGreaterThanOrEqual(2);
      if (row.verdict !== "Keep") {
        expect(row.replacementQuestionVariantIds.length).toBeGreaterThan(0);
        expect(row.replacementQuestionVariantIds.every(id => round.beforeNodes.some(item => item.questionVariantId === id))).toBe(true);
      }
    }
  });

  it("preserves live definitions, exact historical PASS records and named clinical approvals", () => {
    for (const row of packet.audit.filter(item => item.live)) {
      const clinicalCase = retainedTopicCase(row.caseId)!;
      expect(hash(clinicalCase), row.questionVariantId).toBe(row.beforeCaseSha256);
      expect(hash(clinicalCase.decisionNodes.find(item => item.questionVariantId === row.questionVariantId)),
        row.questionVariantId).toBe(row.beforeNodeSha256);
    }
    for (const input of packet.assignment.sourceHashes.filter(item =>
      !item.file.endsWith("/index.ts") && !item.file.endsWith("/synthetic-content.ts"))) {
      expect(textHash(read(input.file)), input.file).toBe(input.currentSha256);
    }
    expect(packet.assignment.frozenPassReferences).toHaveLength(2);
    expect(packet.assignment.clinicalApprovalReferences).toHaveLength(25);
    for (const reference of packet.assignment.frozenPassReferences) {
      expect(packet.audit.find(row => row.questionVariantId === reference.variant)?.verdict).toBe("Keep");
    }
    const approved = QUESTION_QUALITY_REVISIONS.find(item => item.auditId === "A11")!.question;
    const reference = packet.assignment.clinicalApprovalReferences.find(item => item.questionVariantId === approved.id)!;
    expect(hash(approved)).toBe(reference.questionSha256);
    expect(approved.reviewStatus).toBe("clinically_approved");
  });

  it("preserves all seven exact reviewed PASS objects including optional suggestions", () => {
    expect(textHash(read(round.reviewFile))).toBe(round.reviewFileSha256);
    expect(JSON.parse(read(round.reviewFile))).toEqual(round.review);
    expect(round.passFreeze.map(item => item.code).sort()).toEqual(["N01", "N02", "N06", "N13", "N19", "R02", "R08"]);
    for (const frozen of round.passFreeze) {
      expect(state(frozen.code).status).toBe("pass-preserved");
      expect(byCode(frozen.code)).toEqual(frozen.authoredNode);
      expect(hash(byCode(frozen.code))).toBe(frozen.authoredNodeSha256);
      const question = questions.find(item => item.id === frozen.questionVariantId)!;
      const node = nodes.find(item => item.id === frozen.node.id)!;
      const timing = timings.find(item => item.questionVariantId === frozen.questionVariantId)!;
      expect(question).toEqual(frozen.question);
      expect(hash(question)).toBe(frozen.questionSha256);
      expect(node).toEqual(frozen.node);
      expect(hash(node)).toBe(frozen.nodeSha256);
      expect(timing).toEqual(frozen.timing);
      expect(hash(timing)).toBe(frozen.timingSha256);
      expect(round.attempts.some(attempt => attempt.code === frozen.code)).toBe(false);
    }
    expect(byCode("R08").questionVariantId).toBe("question.topic.thyroid-nodules-cancer.r08.v2");
    expect(byCode("R08").choices.every(choice => /^Methimazole \d+ mg daily$/.test(choice.label))).toBe(true);
  });

  it("splits nonpassing companions while preserving PASS patient text and exact clinical node fields", () => {
    expect(passedCases).toHaveLength(6);
    expect(revisedCases).toHaveLength(12);
    expect(cases.filter(item => item.decisionNodes.length > 1)).toHaveLength(1);
    for (const frozen of round.passFreeze) {
      const clinicalCase = passedCases.find(item => item.id === frozen.clinicalCase.id)!;
      const original = frozen.clinicalCase;
      for (const key of ["presentation", "chiefComplaint", "patientDisplayName",
        "patientPresentationVariantId", "prototypeDemographics", "approvedInstantiationProfiles"] as const) {
        expect(clinicalCase[key]).toEqual(original[key]);
      }
      const node = clinicalCase.decisionNodes.find(item => item.id === frozen.node.id)!;
      const { terminalDispositions: actualTerminal, ...actualClinical } = node;
      const { terminalDispositions: oldTerminal, ...oldClinical } = frozen.node;
      expect(actualClinical).toEqual(oldClinical);
      if (oldTerminal.length) expect(actualTerminal).toEqual(oldTerminal);
      else if (node === clinicalCase.decisionNodes.at(-1)) {
        expect(actualTerminal).toHaveLength(node.answerChoices.length - 1);
        for (const terminal of actualTerminal) {
          expect(terminal.kind).toBe("no_terminal_outcome");
          if (terminal.kind !== "no_terminal_outcome") throw new Error("Unexpected clinical outcome");
          const choice = node.answerChoices.find(item => item.id === terminal.answerChoiceId)!;
          expect(terminal.clinicalRationale).toBe(choice.rationale);
          expect(terminal.consequenceNarrative).toBe(choice.rationale);
        }
      } else expect(actualTerminal).toEqual([]);
    }
    const paired = passedCases.find(item => item.decisionNodes.length > 1)!;
    expect(paired.decisionNodes.map(item => item.id)).toEqual(["N01", "N02"].map(code => byCode(code).nodeId));
    for (const clinicalCase of cases.filter(item => item.decisionNodes.length > 1)) {
      expect(clinicalCase.decisionNodes.every(node => round.passFreeze.some(item => item.node.id === node.id))).toBe(true);
    }
    expect(revisedCases.every(item => item.decisionNodes.length === 1)).toBe(true);
    expect(preview.cases).toEqual(passedCases);
    expect(candidates.cases).toEqual(revisedCases);
  });

  it("records one correction attempt and an indexed disposition for every returned item", () => {
    expect(round.statuses).toHaveLength(26);
    expect(new Set(round.statuses.map(item => item.code)).size).toBe(26);
    expect(round.attempts).toHaveLength(19);
    expect(new Set(round.attempts.map(item => item.code)).size).toBe(19);
    expect(round.statuses.filter(item => item.status === "revised")).toHaveLength(12);
    expect(round.statuses.filter(item => item.status === "parked")).toHaveLength(7);
    for (const review of round.review.filter(item => item.verdict !== "PASS")) {
      const status = state(review.id);
      const attempts = round.attempts.filter(item => item.code === review.id);
      expect(attempts).toHaveLength(1);
      expect(attempts[0]!.attemptNumber).toBe(1);
      expect(attempts[0]!.review).toEqual(review);
      expect(attempts[0]!.currentQuestionVariantId).toBe(byCode(review.id).questionVariantId);
      expect(byCode(review.id).questionVariantId).not.toBe(attempts[0]!.priorQuestionVariantId);
      expect(status.independentPass).toBe(false);
      expect(status.reason.length).toBeGreaterThan(40);
      expect(hash(byCode(review.id))).toBe(status.exactAfterNodeSha256);
      for (const group of ["clarityIssues", "cues", "fairness", "suggestions"] as const) {
        expect(status.reviewIssueDisposition![group]).toHaveLength(review[group].length);
        for (const [index, disposition] of status.reviewIssueDisposition![group].entries()) {
          expect(disposition.issueIndex).toBe(index);
          expect(disposition.reviewIssue).toEqual(review[group][index]);
          expect(disposition.response.length).toBeGreaterThan(40);
        }
      }
    }
  });

  it("keeps all seven parked attempts out of every executable-candidate binding", () => {
    expect(parked.map(item => item.code).sort()).toEqual(["N07", "N08", "N09", "N10", "N11", "N20", "R03"]);
    for (const item of parked) {
      expect(questions.some(question => question.id === item.questionVariantId)).toBe(false);
      expect(nodes.some(node => node.id === item.nodeId)).toBe(false);
      expect(cases.some(clinicalCase => clinicalCase.id === item.caseId)).toBe(false);
      expect(timings.some(timing => timing.questionVariantId === item.questionVariantId)).toBe(false);
      expect(orders.some(order => order.questionVariantId === item.questionVariantId)).toBe(false);
      expect(concepts.some(concept => concept.id === item.conceptId)).toBe(false);
      expect(item.authorGate.status).toBe("author_gate_failed_parked");
      expect(item.authorGate.twoConsequentialSteps).toEqual([]);
    }
    const toxicity = round.revisedCaseDefinitions.find(item => item.nodeCodes[0] === "N11")!;
    expect(toxicity.presentation).not.toContain("below");
    expect(toxicity.presentation).not.toContain("earlier visit");
    const chart = round.revisedCaseDefinitions.find(item => item.nodeCodes[0] === "N20")!;
    expect(chart.outsideChartReview).toBe(true);
    expect(chart.patientAcuity).toBe("stable");
    expect(chart.reviewedEventAcuity).toBe("airway_emergency");
    expect(chart.presentation).not.toContain("founder");
    expect(chart.presentation).toContain("expert surgical and airway help");
    expect(byCode("N20").choices.every(choice => !choice.label.includes("summoning"))).toBe(true);
  });

  it("constructs valid standalone clinic contexts without promoting editorial status to clinical approval", () => {
    expect(questions).toHaveLength(19);
    expect(nodes).toHaveLength(19);
    expect(cases).toHaveLength(18);
    for (const clinicalCase of cases) {
      expect(syntheticClinicalCaseSchema.safeParse(clinicalCase).success).toBe(true);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.tutorialEligible).toBe(false);
      expect(clinicalCase.patientDisplayName!.split(/\s+/).length).toBeGreaterThanOrEqual(2);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.presentation).toContain(String(clinicalCase.prototypeDemographics!.ageYears) + "-year-old");
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(clinicalCase.prototypeDemographics);
    }
    for (const question of questions) {
      expect(question.reviewStatus).toBe("needs_clinician_review");
      expect(question.lastClinicianReview).toBeNull();
      expect(question.shuffleAnswers).toBe(true);
    }
    for (const release of [preview, candidates]) expect(release.publicationStatus).toBe("synthetic_unapproved_prototype");
    for (const flag of [manifest.pipelinePassed, manifest.clinicalApproval, manifest.managerAccepted,
      manifest.publicReleaseAuthorized, manifest.executableOrdersAdded]) expect(flag).toBe(false);
  });

  it("retains same-meaning IDs and creates distinct histories for materially changed decisions", () => {
    expect(concepts).toHaveLength(17);
    expect(concepts.filter(item => item.conceptRelation === "existing_meaning_variant")).toHaveLength(3);
    expect(concepts.filter(item => item.conceptRelation === "new_meaning")).toHaveLength(14);
    for (const code of ["R01", "R04", "N04", "N05", "N12", "N15"]) {
      expect(byCode(code).conceptId).toBe(round.beforeNodes.find(item => item.code === code)!.conceptId);
    }
    for (const code of ["R06", "N03", "N14", "N16", "N17", "N18"]) {
      const current = byCode(code);
      const previous = round.beforeNodes.find(item => item.code === code)!;
      expect(current.conceptId).not.toBe(previous.conceptId);
      expect(current.conceptIdentityDecision.previousConceptId).toBe(previous.conceptId);
      expect(current.conceptIdentityDecision.relation).toBe("new_meaning");
      expect(current.reviewStatus).toBe("needs_clinician_review");
    }
    for (const concept of concepts.filter(item => item.conceptRelation === "existing_meaning_variant")) {
      expect(concept.learningObjective).toBe(packet.assignment.concepts.find(item => item.conceptId === concept.id)!.learningObjective);
    }
    expect(packet.conceptHistory.filter(item => item.registryOnly)).toHaveLength(4);
  });

  it("provides exact timing for every active testing choice including the wrong alternatives", () => {
    const profiles = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(item => item.id));
    expect(timings).toHaveLength(19);
    for (const entry of timings) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const item = active.find(candidate => candidate.questionVariantId === entry.questionVariantId)!;
      expect(entry.caseId).toBe(item.caseId);
      expect(entry.nodeId).toBe(item.nodeId);
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices.map(choice => [choice.choiceId, choice.choiceLabel, choice.timing]))
          .toEqual(item.choices.map(choice => [choice.id, choice.label, choice.timing]));
      }
      for (const choice of item.choices) {
        if (choice.timing.kind === "test") {
          expect("timingProfileId" in choice.timing).toBe(true);
          if ("timingProfileId" in choice.timing && typeof choice.timing.timingProfileId === "string") {
            expect(profiles.has(choice.timing.timingProfileId)).toBe(true);
          }
          expect(orders.some(order => order.choiceId === choice.id && order.choiceLabel === choice.label &&
            order.questionVariantId === item.questionVariantId)).toBe(true);
        }
      }
    }
    const biopsyTiming = byCode("N03").choices.at(-1)!.timing;
    expect("timingProfileId" in biopsyTiming && biopsyTiming.timingProfileId).toBe("timing.test.excisional_biopsy");
    expect(byCode("N17").choices.every(choice => "timingProfileId" in choice.timing && choice.timing.timingProfileId === "timing.test.combined_diagnostic")).toBe(true);
    expect(orders.every(item => item.execution === "presentation_only_estimate" && item.serviceRequest === null)).toBe(true);
    expect(nodes.every(node => node.resultGateAfter === null && node.answerChoices.every(choice => choice.serviceRequest === null))).toBe(true);
    expect(packet.timingOrderProposals.map(item => item.questionVariantId).sort()).toEqual(questions.map(item => item.id).sort());
  });

  it("maps current, parked and historical claims separately to complete rights-reviewed sources", () => {
    expect(ledger.sources).toHaveLength(12);
    expect(ledger.evidenceClaims).toHaveLength(69);
    for (const item of packet.proposedNodes) {
      for (const id of item.supportingEvidenceClaimIds) {
        const claim = ledger.evidenceClaims.find(candidate => candidate.id === id)!;
        expect(claim, id).toBeDefined();
        expect(claim.questionVariantIds).toContain(item.questionVariantId);
        expect(claim.reviewStatus).toBe("needs_clinician_review");
        expect(claim.lastCheckedOn).toBe("2026-11-11");
        const mapped = state(item.code).status === "parked" ? claim.parkedQuestionVariantIds : claim.activeQuestionVariantIds;
        expect(mapped).toContain(item.questionVariantId);
        for (const sourceId of claim.sourceIds) {
          expect(ledger.sources.find(candidate => candidate.id === sourceId)!.evidenceClaimIds).toContain(claim.id);
        }
      }
      expect(item.clinicalStatementMappings.keyAndExplanation).toEqual(item.supportingEvidenceClaimIds);
    }
    for (const source of ledger.sources) {
      for (const value of [source.completeCitation, source.organizationOrJournal, source.officialUrl,
        source.licenseLabel, source.reuseNotes, source.authorityAssessment]) expect(value.length).toBeGreaterThan(5);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.accessedOn).toBe("2026-11-11");
      expect(source.rightsAccessCheck.sourceTextStored).toBe(false);
      expect(source.evidenceClaimIds.every(id => ledger.evidenceClaims.some(claim => claim.id === id && claim.sourceIds.includes(source.id)))).toBe(true);
    }
    expect(links.every(link => link.target === "_blank" && link.rel === "noopener noreferrer" &&
      link.referrerPolicy === "no-referrer" && link.href.startsWith("https://"))).toBe(true);
    expect(ledger.withheldDisagreements).toHaveLength(3);
    expect(packet.assignment.unkeyedDraftSlots).toHaveLength(0);
  });

  it("keeps concrete author reasoning distinct from independent PASS and basic safety acceptance", () => {
    expect(packet.reviewOrderNotice).toBe("key shown first for review only.");
    for (const item of active) {
      expect(item.authorGate.twoConsequentialSteps).toHaveLength(2);
      expect(item.authorGate.independentPass).toBe(false);
      for (const value of [item.authorGate.coverTheKey, item.authorGate.oneDecisionStageAndCategory,
        item.authorGate.residentDifficulty, item.authorGate.oneBestAnswer.decidingObservation,
        item.authorGate.oneBestAnswer.decisionChangingCounterfactual, item.deletionTest,
        item.visibleSequenceAudit]) expect(value.length).toBeGreaterThan(35);
      expect(item.choices.length).toBeGreaterThanOrEqual(3);
      expect(item.choices.length).toBeLessThanOrEqual(4);
      expect(item.choices.filter(choice => choice.isCorrect)).toHaveLength(1);
      for (const choice of item.choices) {
        expect(choice.rationale.length).toBeGreaterThan(25);
        expect(choice.counterfactual.length).toBeGreaterThan(35);
        expect(choice.temptation.length).toBeGreaterThan(20);
      }
    }
    expect(packet.ownerApprovalsNeeded.find(item => item.id === "O6")!.status).toBe("parked_not_supply");
    expect(round.counts.allMultipartNodesIndependentPass).toBe(true);
    for (const question of questions) topicQuestionAcceptance(question.id);
    expect(SYNTHETIC_CLINICAL_RELEASE.cases.some(item => item.id.startsWith("case.topic.thyroid-nodules-cancer."))).toBe(questions.some(question => topicQuestionAcceptance(question.id).live));
  });
});
