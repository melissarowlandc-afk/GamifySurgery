import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { GS028_20261002_QUESTIONS } from "./development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch";
import { QUESTION_QUALITY_ADVERSARIAL_R4_QUESTIONS } from "./question-quality-adversarial-r4-20261102";
import { QUESTION_QUALITY_ADVERSARIAL_R5_QUESTIONS } from "./question-quality-adversarial-r5-20261102";
import { QUESTION_BANK_BATCH2B_ROUND2_QUESTIONS } from "./question-bank-batch2b-round2-20261104";
import { answerChoiceTimingRegistryEntrySchema, validateSyntheticClinicalRelease } from "./schema";
import {
  ACUTE_PANCREATITIS_TOPIC_PACKET as packet,
  ACUTE_PANCREATITIS_TOPIC_LEDGER as ledger,
  ACUTE_PANCREATITIS_TOPIC_CASES as cases,
  ACUTE_PANCREATITIS_TOPIC_NODES as nodes,
  ACUTE_PANCREATITIS_TOPIC_QUESTIONS as questions,
  ACUTE_PANCREATITIS_TOPIC_CONCEPT_PROPOSALS as concepts,
  ACUTE_PANCREATITIS_TOPIC_CLAIMS as claims,
  ACUTE_PANCREATITIS_TOPIC_SOURCES as sources,
  ACUTE_PANCREATITIS_TOPIC_SOURCE_LINKS as links,
  ACUTE_PANCREATITIS_TOPIC_TIMING_PROPOSALS as timings,
  ACUTE_PANCREATITIS_TOPIC_ORDER_PROPOSALS as orders,
  ACUTE_PANCREATITIS_TOPIC_PREVIEW_RELEASE as preview,
  ACUTE_PANCREATITIS_TOPIC_MANIFEST as manifest,
} from "./question-topic-pancreas-acute-pancreatitis-20261111";

const repository = new URL("../../../", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, repository), "utf8");
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const fileDigest = (file: string) => createHash("sha256").update(read(file)).digest("hex");

describe("acute pancreatitis explicit-import topic sidecar", () => {
  it("reconciles the independent review and exactly one attempt for every returned item", () => {
    const round = packet.reviewRound;
    expect(fileDigest(round.reviewFile)).toBe(round.reviewFileSha256);
    expect(JSON.parse(read(round.reviewFile))).toEqual(round.reviewRecords);
    expect(round.dispositions).toHaveLength(20);
    expect(new Set(round.dispositions.map(item => item.reviewedQuestionVariantId)).size).toBe(20);
    expect(round.dispositions.filter(item => item.status === "pass-preserved")).toHaveLength(2);
    expect(round.dispositions.filter(item => item.status === "revised")).toHaveLength(14);
    expect(round.dispositions.filter(item => item.status === "parked")).toHaveLength(4);
    for (const item of round.dispositions) {
      const review = round.reviewRecords.find(row => row.id === item.reviewedQuestionVariantId)!;
      if (review.verdict === "PASS") {
        expect(item.status).toBe("pass-preserved");
        expect(item.revisionAttempts).toBe(0);
      } else {
        expect(item.revisionAttempts).toBe(1);
        for (const field of ["clarityIssues", "cues", "fairness", "suggestions"] as const) {
          const response = item.responses as Record<string, Array<{ index: number; note: unknown; response: string }>>;
          expect(response[field]).toHaveLength(review[field].length);
          review[field].forEach((note, index) => {
            expect(response[field]![index]!.index).toBe(index);
            expect(response[field]![index]!.note).toEqual(note);
            expect(response[field]![index]!.response.trim()).not.toBe("");
          });
        }
      }
    }
  });

  it("pins every PASS question, complete node and clinical header exactly while isolating companions", () => {
    for (const freeze of packet.reviewRound.passFreeze) {
      const question = questions.find(row => row.id === freeze.questionVariantId)!;
      const node = nodes.find(row => row.questionVariantId === freeze.questionVariantId)!;
      const clinicalCase = cases.find(row => row.decisionNodes.some(node => node.questionVariantId === freeze.questionVariantId))!;
      const header = { patientDisplayName: clinicalCase.patientDisplayName, prototypeDemographics: clinicalCase.prototypeDemographics,
        chiefComplaint: clinicalCase.chiefComplaint, presentation: clinicalCase.presentation };
      expect(digest(question)).toBe(freeze.questionSha256);
      expect(digest(node)).toBe(freeze.nodeSha256);
      expect(digest(header)).toBe(freeze.headerSha256);
      expect(clinicalCase.decisionNodes).toHaveLength(1);
    }
    for (const composition of packet.reviewRound.compositionProposals) {
      expect(composition.executable).toBe(false);
      expect(composition.admissionCondition).toMatch(/PASS|pass/);
    }
  });

  it("excludes every parked or superseded attempt from all current selectable cases", () => {
    const ids = new Set(cases.flatMap(row => row.decisionNodes.map(node => node.questionVariantId)));
    expect(packet.reviewRound.parkedSlots).toHaveLength(4);
    for (const item of packet.reviewRound.parkedAttempts) {
      expect(ids.has(item.disposition.reviewedQuestionVariantId)).toBe(false);
      expect(ids.has(item.attemptedDefinition.questionVariantId)).toBe(false);
      expect(item.disposition.parkReason).toBeTruthy();
      expect(item.disposition.revisionAttempts).toBe(1);
    }
    for (const slot of packet.reviewRound.parkedSlots) {
      expect(slot.selectable).toBe(false);
      expect(slot.questionVariantId).toBeNull();
      expect(slot.conceptId).toBeNull();
    }
    for (const item of packet.reviewRound.revisedDefinitions) {
      expect(item.task).not.toMatch(/\?s\b|\?C\b|\?10\^9/);
      expect(ids.has(item.previousQuestionVariantId)).toBe(false);
      expect(ids.has(item.questionVariantId)).toBe(true);
    }
  });

  it("reconciles all assigned exact variants and distinct visible contexts", () => {
    const program = JSON.parse(read("docs/research/question-topic-program-20261111.json")) as {
      inventory: typeof packet.assignment.inventory;
    };
    const assigned = program.inventory.filter(row => row.primaryTopicSlug === packet.topicSlug);
    expect(packet.assignment.inventory).toEqual(assigned);
    expect(packet.audit.map(row => row.inventoryRecordId).sort()).toEqual(assigned.map(row => row.recordId).sort());
    expect(new Set(packet.audit.map(row => row.inventoryRecordId)).size).toBe(47);
    expect(packet.counts).toMatchObject({ auditedExactVariants: 47, auditedVisibleContexts: 51,
      auditedFiniteProfileOccurrences: 204, kept: 9, rewritten: 3, retiredAndReplacedProposed: 35, newQuestions: 17 });
    const proposedIds = new Set(packet.reviewRound.snapshot.questions.map(question => question.id));
    for (const row of packet.audit) {
      expect(["Keep", "Rewrite", "Retire-and-replace"]).toContain(row.verdict);
      expect(row.reasons.length).toBeGreaterThan(120);
      const before = packet.beforeVersions.find(item => item.inventoryRecordId === row.inventoryRecordId)!;
      expect(row.beforeQuestionSha256).toBe(digest(before.exactAuthoredQuestions[0]!.question));
      expect(row.contextAudits).toHaveLength(before.exactVisibleContexts.length);
      for (const context of before.exactVisibleContexts) {
        expect(context.contextSha256).toBe(digest(context.context));
        expect(context.nodeSha256).toBe(digest(context.context.currentNode));
        expect(row.contextAudits.some(item => item.contextSha256 === context.contextSha256)).toBe(true);
        expect(context.context.approvedInstantiationProfiles).toHaveLength(4);
      }
      if (row.verdict === "Keep") expect(row.freezeReferences.length).toBeGreaterThan(0);
      else expect(proposedIds.has(row.replacementQuestionVariantId!)).toBe(true);
    }
    expect(packet.assignment.concepts).toHaveLength(7);
    expect(packet.assignment.concepts.filter(row => row.registryOnly)).toHaveLength(2);
    expect(packet.assignment.recordedHolds).toEqual([]);
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
  });

  it("checks actual assigned source files and preserves current topic cases through shared release drift", () => {
    const topicInputs = packet.assignment.sourceHashes.filter(input => !input.drift);
    for (const input of topicInputs) expect(fileDigest(input.file)).toBe(input.actualSha256);
    expect(packet.assignment.sourceHashes.filter(input => input.drift).map(input => input.file).sort()).toEqual([
      "packages/clinical-content/src/index.ts", "packages/clinical-content/src/synthetic-content.ts",
    ]);
    const assignedSourceQuestions = [...GS028_20261002_QUESTIONS, ...QUESTION_QUALITY_ADVERSARIAL_R4_QUESTIONS,
      ...QUESTION_QUALITY_ADVERSARIAL_R5_QUESTIONS, ...QUESTION_BANK_BATCH2B_ROUND2_QUESTIONS];
    for (const before of packet.beforeVersions.filter(row => row.liveCase !== null)) {
      const actual = assignedSourceQuestions.find(question => question.id === before.variantId);
      expect(actual).toEqual(before.exactAuthoredQuestions[0]!.question);
    }
    // The shared release is concurrently assembled. Verify the explicit-import boundary
    // without running that unrelated assembly as a prerequisite to this focused suite.
    for (const file of ["packages/clinical-content/src/index.ts", "packages/clinical-content/src/synthetic-content.ts"]) {
      expect(read(file)).not.toContain("question-topic-pancreas-acute-pancreatitis-20261111");
    }
  });

  it("retains exact independent review references without promoting clinical approval", () => {
    for (const reference of packet.assignment.frozenIndependentReviewReferences) {
      expect(fileDigest(reference.file)).toBe(reference.fileSha256);
      expect(reference.record.verdict).toBe("PASS");
    }
    expect(packet.audit.filter(row => row.verdict === "Keep")).toHaveLength(9);
    expect(packet.assignment.clinicalApprovalReferences).toEqual([]);
    expect(manifest).toMatchObject({ clinicalApproval: false, pipelinePassed: false, managerAccepted: false,
      publicReleaseAuthorized: false, executableOrdersAdded: false });
  });

  it("normalizes sixteen standalone candidates and previews only the two exact PASS cases", () => {
    expect(() => validateSyntheticClinicalRelease(preview)).not.toThrow();
    expect(cases).toHaveLength(16);
    expect(nodes).toHaveLength(16);
    expect(questions).toHaveLength(16);
    expect(concepts).toHaveLength(15);
    expect(new Set(questions.map(question => question.id)).size).toBe(16);
    expect(new Set(nodes.map(node => node.id)).size).toBe(16);
    expect(cases.every(row => row.decisionNodes.length === 1)).toBe(true);
    expect(preview.cases).toHaveLength(2);
    expect(preview.cases.flatMap(row => row.decisionNodes.map(node => node.questionVariantId)).sort())
      .toEqual(packet.reviewRound.passFreeze.map(item => item.questionVariantId).sort());
    expect(cases.every(row => row.requiredClinicalSetting === "clinic" && row.earliestFacilityStage === 0)).toBe(true);
    for (const clinicalCase of cases) {
      expect(clinicalCase.presentation).toContain(clinicalCase.patientDisplayName);
      expect(clinicalCase.presentation).toContain(String(clinicalCase.prototypeDemographics!.ageYears));
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.tutorialEligible).toBe(false);
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
    }
  });

  it("preserves unchanged meaning and explicitly versions the three changed objectives", () => {
    expect(packet.reviewRound.clinicalVersioning).toHaveLength(3);
    for (const item of packet.reviewRound.dispositions.filter(row => row.status === "revised")) {
      const before = packet.reviewRound.snapshot.definitions.find(row => row.questionVariantId === item.reviewedQuestionVariantId)!;
      const after = packet.proposedNodes.find(row => row.questionVariantId === item.currentQuestionVariantId)!;
      expect(after.questionVariantId).not.toBe(before.questionVariantId);
      if (item.currentConceptId !== item.previousConceptId) {
        expect(after.previousConceptId).toBe(before.conceptId);
        const proposal = concepts.find(row => row.id === after.conceptId)!;
        expect(proposal.previousConceptId).toBe(before.conceptId);
        expect(proposal.clinicalVersioningReason).toBeTruthy();
      } else expect(after.conceptId).toBe(before.conceptId);
    }
    expect(packet.reviewRound.clinicalVersioning.every(item => item.historyTransfer === false)).toBe(true);
  });

  it("keeps every new clinical artifact in needs_clinician_review", () => {
    for (const record of [...questions, ...concepts, ...claims, ...sources, ...packet.caseDefinitions]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.aiAssistedDrafting).toBe(true);
      expect(record.lastClinicianReview).toBeNull();
    }
    expect(packet.proposedNodes.every(node => !node.pipelinePassed && !node.managerAccepted && node.clinicalApproval === null)).toBe(true);
  });

  it("binds the review packet to exact normalized question and complete visible sequence", () => {
    expect(packet.reviewItems).toHaveLength(16);
    for (const item of packet.reviewItems) {
      const clinicalCase = cases.find(row => row.id === item.caseId)!;
      const index = clinicalCase.decisionNodes.findIndex(node => node.id === item.nodeId);
      const context = {
        caseId: clinicalCase.id, patientDisplayName: clinicalCase.patientDisplayName,
        chiefComplaint: clinicalCase.chiefComplaint, prototypeDemographics: clinicalCase.prototypeDemographics,
        presentation: clinicalCase.presentation, finiteProfiles: [], currentNode: clinicalCase.decisionNodes[index],
        visiblePriorNodes: clinicalCase.decisionNodes.slice(0, index),
      };
      expect(item.exactVisibleContextSha256).toBe(digest(context));
      expect(item.exactQuestionSha256).toBe(digest(questions.find(question => question.id === item.questionVariantId)));
      expect(item.after.reviewOptions[0]!.isCorrect).toBe(true);
      expect(item.reviewOrderNotice).toBe("key shown first for review only.");
      if (item.reviewDisposition === "pass-preserved") expect(item.independentReview).toBe(packet.reviewRound.reviewFile);
      else expect(item.independentReview).toBeNull();
    }
    for (const definition of packet.caseDefinitions) {
      expect(definition.normalizedRuntimeCase).toEqual(cases.find(row => row.id === definition.id));
    }
    expect(packet.timingProposals).toEqual(timings);
    expect(packet.testOrderProposals).toEqual(orders);
  });

  it("resolves clinical evidence and source rights in both directions", () => {
    const claimIds = new Set(claims.map(claim => claim.id));
    const sourceIds = new Set(sources.map(source => source.id));
    expect(claimIds.size).toBe(claims.length);
    expect(sourceIds.size).toBe(sources.length);
    for (const question of questions) {
      expect(question.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      for (const id of question.supportingEvidenceClaimIds) expect(claimIds.has(id)).toBe(true);
    }
    for (const claim of claims) {
      expect(claim.id).toContain(packet.topicSlug);
      expect(claim.lastCheckedOn).toBe("2026-11-11");
      expect(claim.limitation).toBeTruthy();
      for (const id of claim.sourceIds) {
        expect(sourceIds.has(id)).toBe(true);
        expect(sources.find(source => source.id === id)!.evidenceClaimIds).toContain(claim.id);
      }
    }
    for (const source of sources) {
      expect(source.completeCitation.length).toBeGreaterThan(80);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.authorityAssessment).toBeTruthy();
      expect(source.reuseNotes).toBeTruthy();
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.evidenceClaimIds).toEqual(claims.filter(claim => claim.sourceIds.includes(source.id)).map(claim => claim.id));
    }
    expect(ledger.excludedSources.find(source => source.id.endsWith("iap-2025-excluded"))!.rightsFinding).toMatch(/AI/);
    expect(claims.every(claim => claim.sourceIds.every(id => !id.endsWith("iap-2025-excluded")))).toBe(true);
  });

  it("retains ranked coverage and explicit bidirectional evidence mappings", () => {
    const mappings = ledger.claimToQuestionMappings as Record<string, string[]>;
    for (const question of questions) {
      for (const claimId of question.supportingEvidenceClaimIds) expect(mappings[claimId]).toContain(question.id);
      expect(packet.statementMappings.find(row => row.questionVariantId === question.id)!.supportingEvidenceClaimIds)
        .toEqual(question.supportingEvidenceClaimIds);
    }
    for (const group of packet.rankedConcepts) {
      expect(group.residentDecision).toBeTruthy();
      expect(group.rawEvidence).toBeTruthy();
      expect(group.closestCredibleError).toBeTruthy();
      for (const id of group.proposedQuestionVariantIds) expect(questions.some(question => question.id === id)).toBe(true);
      for (const id of group.existingInventoryRecordIds) expect(packet.audit.some(row => row.inventoryRecordId === id)).toBe(true);
    }
  });

  it("supplies exact timing identities for every diagnostic choice including distractors", () => {
    const profiles = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(profile => profile.id));
    for (const entry of timings) {
      expect(() => answerChoiceTimingRegistryEntrySchema.parse(entry)).not.toThrow();
      const item = packet.proposedNodes.find(node => node.questionVariantId === entry.questionVariantId)!;
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices).toEqual(item.choices.map(choice => ({
          choiceId: choice.id, choiceLabel: choice.label, timing: choice.timing,
        })));
        for (const choice of entry.classification.choices) if (choice.timing.kind === "test") {
          expect(profiles.has(choice.timing.timingProfileId)).toBe(true);
          expect(choice.timing.timingProfileId).not.toBe("timing.test.clinical_procedure");
        }
      } else expect(item.choices.every(choice => choice.timing.kind === "no_test")).toBe(true);
    }
    expect(orders).toHaveLength(packet.proposedNodes.flatMap(node => node.choices.filter(choice => choice.timing.kind === "test")).length);
    for (const order of orders) {
      const choice = packet.proposedNodes.find(node => node.questionVariantId === order.questionVariantId)!.choices.find(row => row.id === order.choiceId)!;
      expect(order.choiceLabel).toBe(choice.label);
      expect(order.serviceRequest).toBeNull();
      expect(order.resultGateAfter).toBeNull();
      expect(order.execution).toBe("archived_record_review_only");
    }
  });

  it("uses safe source links and no executable clinic investigations", () => {
    for (const link of links) expect(link).toMatchObject({ target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer" });
    for (const node of nodes) {
      expect(node.shuffleAnswers).toBe(true);
      expect(node.answerChoices).toHaveLength(3);
      expect(node.answerChoices.filter(choice => choice.isCorrect)).toHaveLength(1);
      expect(node.resultGateAfter).toBeNull();
      expect(node.answerChoices.every(choice => choice.serviceRequest === null)).toBe(true);
    }
    expect(manifest.reviewOrderNotice).toBe("key shown first for review only.");
  });

  it("records concrete manual attacks, counterfactuals and separate evidence holds", () => {
    for (const item of packet.proposedNodes) {
      const gate = item.manualAuthorGate;
      for (const value of [gate.reasoningStep1, gate.reasoningStep2, gate.closestCredibleError, gate.decidingObservation,
        gate.decisionChangingCounterfactual, gate.deletionTest, gate.coverTheKeyCueAttack,
        gate.oneDecisionStageAndCategory, gate.residentDifficultyPrediction, gate.singleBestAnswerCheck]) {
        expect(value).toEqual(expect.any(String));
        expect(value.trim()).not.toBe("");
      }
      expect(item.choices.some(choice => choice.id === gate.counterfactualChoiceId)).toBe(true);
      for (const choice of item.choices) {
        expect(choice.rationale.trim()).not.toBe("");
        expect(choice.temptation.trim()).not.toBe("");
        expect(choice.counterfactual.trim()).not.toBe("");
      }
    }
    expect(packet["Owner approvals needed"][0]!.affectedExactVariantIds).toContain("question.pseudocyst.symptomatic-endoscopic-drainage.v4.r4");
    expect(packet.withheldTeachingPoints).toHaveLength(2);
    expect(packet.withheldTeachingPoints.every(point => point.unkeyed && point.questionVariantId === null)).toBe(true);
  });
});
