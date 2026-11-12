import {topicQuestionAcceptance} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getDiagnosticTimingProfileMapping } from "@gamify-surgery/balance-config";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import { QUESTION_SHIP_MANIFEST } from "./question-ship-manifest";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "./answer-choice-timing";
import {
  RECOVERED_DIVERTICULITIS_CASES,
  RECOVERED_DIVERTICULITIS_QUESTIONS,
} from "./development-batch/2026-09-12/recovered-diverticulitis";
import {
  UNCOMPLICATED_DIVERTICULITIS_CASES,
  UNCOMPLICATED_DIVERTICULITIS_QUESTIONS,
} from "./development-batch/2026-09-17/uncomplicated-diverticulitis";
import { QUESTION_NEW_N3_CASES, QUESTION_NEW_N3_QUESTIONS } from "./question-new-n3-20261105";
import { QUESTION_NEW_N3_ROUND2_CASES, QUESTION_NEW_N3_ROUND2_QUESTIONS } from "./question-new-n3-round2-20261105";
import { answerChoiceTimingRegistryEntrySchema, syntheticClinicalReleaseSchema } from "./schema";
import packet from "../../../docs/research/question-topic-colon-diverticular-lower-bleeding-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-colon-diverticular-lower-bleeding-20261111.json";

const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const originalState = {
  release: sha(SYNTHETIC_CLINICAL_RELEASE),
  manifest: sha(QUESTION_SHIP_MANIFEST),
  timing: sha(ANSWER_CHOICE_TIMING_REGISTRY),
};
const topic = await import("./question-topic-colon-diverticular-lower-bleeding-20261111");
const currentQuestions = [...topic.COLON_TOPIC_QUESTIONS, ...topic.COLON_TOPIC_REVISION_CATALOG.questions];
const allQuestions = [...topic.COLON_TOPIC_REVIEWED_V1_CATALOG.questions, ...topic.COLON_TOPIC_REVISION_CATALOG.questions];
const currentCases = [...topic.COLON_TOPIC_CASES, ...topic.COLON_TOPIC_DEFERRED_PASS_CASES, ...topic.COLON_TOPIC_REVISION_CATALOG.cases, ...topic.COLON_TOPIC_SALVAGE_CASES];
const slug = "colon-diverticular-lower-bleeding";
const originalCases = [
  ...RECOVERED_DIVERTICULITIS_CASES,
  ...UNCOMPLICATED_DIVERTICULITIS_CASES,
  ...QUESTION_NEW_N3_CASES,
  ...QUESTION_NEW_N3_ROUND2_CASES,
];
const originalQuestions = [
  ...RECOVERED_DIVERTICULITIS_QUESTIONS,
  ...UNCOMPLICATED_DIVERTICULITIS_QUESTIONS,
  ...QUESTION_NEW_N3_QUESTIONS,
  ...QUESTION_NEW_N3_ROUND2_QUESTIONS,
];

describe("colon diverticular disease and lower bleeding topic sidecar", () => {
  it("validates the normal explicit-import authoring release", () => {
    expect(syntheticClinicalReleaseSchema.safeParse(topic.COLON_TOPIC_SOURCE_RELEASE).success).toBe(true);
    expect(topic.COLON_TOPIC_CASES).toHaveLength(13);
    expect(topic.COLON_TOPIC_QUESTIONS).toHaveLength(20);
    expect(topic.COLON_TOPIC_CONCEPTS).toHaveLength(17);
    expect(topic.COLON_TOPIC_SOURCE_RELEASE.cases).toEqual(topic.COLON_TOPIC_CASES);
  });

  it("preserves the default assembly, manifest and shared timing registry", () => {
    expect({
      release: sha(SYNTHETIC_CLINICAL_RELEASE),
      manifest: sha(QUESTION_SHIP_MANIFEST),
      timing: sha(ANSWER_CHOICE_TIMING_REGISTRY),
    }).toEqual(originalState);
    for (const question of topic.COLON_TOPIC_QUESTIONS) {
      const previouslyAccepted = packet.salvage.acceptedFreeze.some((row) => row.questionVariantId === question.id);
      const accepted = topicQuestionAcceptance(question.id);
      if (previouslyAccepted) expect(accepted.accepted).toBe(true);
      expect(QUESTION_SHIP_MANIFEST.accepted.some((row) => row.questionVariantId === question.id)).toBe(accepted.accepted);
      expect(SYNTHETIC_CLINICAL_RELEASE.cases.some((clinicalCase) =>
        clinicalCase.decisionNodes.some((node) => node.questionVariantId === question.id),
      )).toBe(accepted.live);
    }
  });

  it("reconciles every assigned inventory, concept, case, node and variant row", () => {
    const program = JSON.parse(readFileSync(new URL("../../../docs/research/question-topic-program-20261111.json", import.meta.url), "utf8")) as {
      inventory: Array<{ recordId: string; primaryTopicSlug: string }>;
      concepts: Array<{ conceptId: string; primaryTopicSlug: string }>;
      caseAssignments: Array<{ caseId: string; primaryTopicSlug: string }>;
      nodeAssignments: Array<{ nodeId: string; primaryTopicSlug: string }>;
      variantAssignments: Array<{ variantId: string; primaryTopicSlug: string }>;
    };
    const assigned = program.inventory.filter((row) => row.primaryTopicSlug === slug);
    expect(packet.assignment.inventory.map((row) => row.recordId).sort()).toEqual(assigned.map((row) => row.recordId).sort());
    expect(packet.audit.map((row) => row.inventoryRecordId).sort()).toEqual(assigned.map((row) => row.recordId).sort());
    expect(packet.assignment.concepts.map((row) => row.conceptId).sort()).toEqual(program.concepts.filter((row) => row.primaryTopicSlug === slug).map((row) => row.conceptId).sort());
    expect(packet.assignment.caseAssignments.map((row) => row.caseId).sort()).toEqual(program.caseAssignments.filter((row) => row.primaryTopicSlug === slug).map((row) => row.caseId).sort());
    expect(packet.assignment.nodeAssignments.map((row) => row.nodeId).sort()).toEqual(program.nodeAssignments.filter((row) => row.primaryTopicSlug === slug).map((row) => row.nodeId).sort());
    expect(packet.assignment.variantAssignments.map((row) => row.variantId).sort()).toEqual(program.variantAssignments.filter((row) => row.primaryTopicSlug === slug).map((row) => row.variantId).sort());
    expect(new Set(packet.audit.map((row) => row.inventoryRecordId)).size).toBe(18);
  });

  it("assigns exactly one verdict and a supported replacement to every before row", () => {
    expect(packet.audit.filter((row) => row.verdict === "Keep")).toHaveLength(0);
    expect(packet.audit.filter((row) => row.verdict === "Rewrite")).toHaveLength(4);
    expect(packet.audit.filter((row) => row.verdict === "Retire-and-replace")).toHaveLength(14);
    for (const row of packet.audit) {
      expect(row.reasons.join(" ").length).toBeGreaterThan(100);
      expect(row.beforeNodeSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(row.fileLocation.export).toBeTruthy();
      expect(row.replacementQuestionIds.length).toBeGreaterThan(0);
      expect(row.replacementQuestionIds.every((id) => currentQuestions.some((question) => question.id === id))).toBe(true);
    }
    expect(packet.proposals.filter((row) => row.creationKind === "new")).toHaveLength(21);
    expect(packet.proposals.filter((row) => row.creationKind === "new").every((row) => row.before === null)).toBe(true);
  });

  it("retains exact before versions and all finite-profile contexts", () => {
    for (const before of packet.before) {
      const clinicalCase = originalCases.find((candidate) => candidate.id === before.case.id &&
        candidate.decisionNodes.some((node) => node.questionVariantId === before.node.questionVariantId));
      const question = originalQuestions.find((candidate) => candidate.id === before.question.id);
      expect(clinicalCase, before.question.id).toBeDefined();
      expect(question, before.question.id).toBeDefined();
      expect(sha(clinicalCase)).toBe(before.caseSha256);
      expect(sha(clinicalCase!.decisionNodes.find((node) => node.questionVariantId === before.question.id))).toBe(before.nodeSha256);
      expect(sha(question)).toBe(before.questionSha256);
      expect(clinicalCase!.approvedInstantiationProfiles).toEqual(before.finiteProfiles);
    }
    expect(packet.countSummary.finiteBeforeProfilesReviewed).toBe(34);
    expect(packet.countSummary.finiteBeforeProfileOccurrences).toBe(66);
  });

  it("checks the exact preserved source files and historical hold references", () => {
    const inputFiles = new Set(packet.assignment.inventory.map((row) => row.fileLocation.file));
    for (const source of packet.assignment.currentSourceHashes.filter((row) => inputFiles.has(row.file))) {
      const actual = createHash("sha256").update(readFileSync(new URL(`../../../${source.file}`, import.meta.url))).digest("hex");
      expect(actual, source.file).toBe(source.sha256);
    }
    expect(packet.assignment.frozenPassReferences).toEqual([]);
    expect(packet.assignment.clinicalApprovalReferences).toEqual([]);
    expect(packet.assignment.recordedHolds.map((hold) => hold.id)).toEqual(["review.n3.postdiverticulitis-examination-extent.v2"]);
    expect(packet.assignment.holdDecisionReferences.every((reference) => reference.decision.decision === "DROP_PROPOSAL")).toBe(true);
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints).toEqual([]);
  });

  it("preserves stable meanings and explicitly versions changed constructs", () => {
    expect(topic.COLON_TOPIC_AUTHORING_CONCEPTS.filter((concept) => concept.conceptRelation === "reuse")).toHaveLength(2);
    expect(topic.COLON_TOPIC_AUTHORING_CONCEPTS.filter((concept) => concept.conceptRelation === "new_version")).toHaveLength(1);
    expect(topic.COLON_TOPIC_AUTHORING_CONCEPTS.filter((concept) => concept.conceptRelation === "new_meaning")).toHaveLength(14);
    const elective = packet.revisionRound.originalIdentityDecisions.find((concept) => concept.id === "concept.recovered-diverticulitis.elective-sigmoid-selection.v2")!;
    expect(elective.previousConceptId).toBe("concept.recovered-diverticulitis.shared-elective-sigmoid-discussion");
    const alarm = topic.COLON_TOPIC_AUTHORING_CONCEPTS.find((concept) => concept.id === "concept.recovered-diverticulitis.alarm-colonoscopy.v2")!;
    expect(alarm.previousConceptId).toBe("concept.recovered-diverticulitis.interval-colonoscopy");
    expect(packet.coverageHistory).toHaveLength(5);
  });

  it("keeps every proposed clinical record under named review", () => {
    for (const record of [
      ...allQuestions,
      ...topic.COLON_TOPIC_AUTHORING_CONCEPTS,
      ...topic.COLON_TOPIC_CLAIMS,
      ...topic.COLON_TOPIC_SOURCES,
      ...topic.COLON_TOPIC_CASE_REVIEWS,
      ...topic.COLON_TOPIC_STATEMENT_MAPPINGS,
    ]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
      expect(record.aiAssistedDrafting).toBe(true);
    }
    expect(topic.COLON_TOPIC_MANIFEST.independentPass).toBe(false);
    expect(topic.COLON_TOPIC_MANIFEST.managerAccepted).toBe(false);
    expect(topic.COLON_TOPIC_MANIFEST.clinicalApproval).toBe(false);
  });

  it("uses named age-sex-consistent finite profiles and existing clinic settings", () => {
    for (const clinicalCase of topic.COLON_TOPIC_CASES) {
      const demographics = clinicalCase.prototypeDemographics!;
      expect(clinicalCase.patientDisplayName.split(" ").length).toBeGreaterThanOrEqual(2);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.presentation).toContain(`${demographics.ageYears}-year-old`);
      expect(clinicalCase.presentation).toContain(demographics.sexLabel === "Female" ? "woman" : "man");
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(demographics);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.presentation).toBe(clinicalCase.presentation);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.presentation).toContain("clinic");
      for (const node of clinicalCase.decisionNodes) {
        expect(node.shuffleAnswers).toBe(true);
        expect(node.answerChoices.length).toBeGreaterThanOrEqual(3);
        expect(node.answerChoices.length).toBeLessThanOrEqual(4);
        expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
        expect(node.stem).toContain("{patientName}");
        expect(node.currentUpdate).toBeTruthy();
        expect(node.resultGateAfter).toBeNull();
        expect(node.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
      }
    }
  });

  it("binds every packet after-version and manual gate to exact authored data", () => {
    for (const proposal of packet.proposals) {
      const question = currentQuestions.find((candidate) => candidate.id === proposal.after.question.id)!;
      const clinicalCase = currentCases.find((candidate) => candidate.id === proposal.after.case.id && candidate.decisionNodes.some((node) => node.questionVariantId === question.id))!;
      const node = clinicalCase.decisionNodes.find((candidate) => candidate.questionVariantId === question.id)!;
      expect(sha(question)).toBe(proposal.after.questionSha256);
      expect(sha(node)).toBe(proposal.after.nodeSha256);
      expect(sha(clinicalCase)).toBe(proposal.after.caseSha256);
      const gate = [...topic.COLON_TOPIC_SELF_CHECKS, ...topic.COLON_TOPIC_REVISION_CATALOG.selfChecks, ...topic.COLON_TOPIC_SALVAGE_SELF_CHECKS].find((check) => check.questionVariantId === question.id && check.nodeId === node.id)!;
      expect(proposal.authorGate).toEqual(gate);
      expect(gate.fiveChecks).toHaveLength(5);
      expect(gate.fiveChecks.every((check) => check.record.length > 50)).toBe(true);
      expect(gate.interpret.length).toBeGreaterThan(30);
      expect(gate.apply.length).toBeGreaterThan(30);
      expect(gate.counterfactualChoiceId).not.toBe(node.answerChoices.find((choice) => choice.isCorrect)!.id);
      expect(node.answerChoices.some((choice) => choice.id === gate.closestChoiceId)).toBe(true);
      expect(gate.optionAudit.every((choice) => choice.temptation && choice.whyRankedHere && choice.reasonableWhen)).toBe(true);
      expect(gate.independent).toBe(false);
    }
  });

  it("resolves every atomic claim, source and question mapping bidirectionally", () => {
    expect(ledger.sources).toHaveLength(10);
    expect(ledger.claims).toHaveLength(46);
    const claimIds = new Set(topic.COLON_TOPIC_CLAIMS.map((claim) => claim.id));
    const sourceIds = new Set(topic.COLON_TOPIC_SOURCES.map((source) => source.id));
    for (const question of allQuestions) {
      expect(question.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      expect(question.supportingEvidenceClaimIds.every((id) => claimIds.has(id))).toBe(true);
      const forward = ledger.questionToClaim.find((row) => row.questionVariantId === question.id)!;
      expect(forward.claimIds).toEqual(question.supportingEvidenceClaimIds);
      const mapping = [...topic.COLON_TOPIC_REVIEWED_V1_CATALOG.statementMappings, ...topic.COLON_TOPIC_REVISION_CATALOG.statementMappings].find((row) => row.questionVariantId === question.id)!;
      expect(mapping.fieldMappings.some((row) => row.field === "currentUpdate")).toBe(true);
      for (const choice of question.answerChoices) {
        expect(mapping.fieldMappings.some((row) => row.field === `answerChoices.${choice.id}` && row.claimIds.length > 0)).toBe(true);
      }
    }
    for (const claim of topic.COLON_TOPIC_CLAIMS) {
      expect(claim.id).toContain(slug);
      expect(claim.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
      const reverse = ledger.claimToQuestion.find((row) => row.claimId === claim.id)!;
      expect(reverse.questionVariantIds.length).toBeGreaterThan(0);
      for (const questionId of reverse.questionVariantIds) {
        expect(allQuestions.find((question) => question.id === questionId)!.supportingEvidenceClaimIds).toContain(claim.id);
      }
    }
    for (const source of topic.COLON_TOPIC_SOURCES) {
      expect(source.id).toContain(slug);
      expect(source.completeCitation.length).toBeGreaterThan(50);
      expect(source.authorityAssessment).toBeTruthy();
      expect(source.reuseStatus).toBeTruthy();
      expect(source.accessedOn).toBe("2026-11-11");
      expect(source.evidenceClaimIds.every((id) => claimIds.has(id))).toBe(true);
    }
  });

  it("provides identity-and-label timing for every proposed testing choice", () => {
    expect(topic.COLON_TOPIC_TIMING_ENTRIES).toHaveLength(20);
    let timedCount = 0;
    for (const entry of topic.COLON_TOPIC_TIMING_ENTRIES) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const question = topic.COLON_TOPIC_QUESTIONS.find((candidate) => candidate.id === entry.questionVariantId)!;
      const item = topic.COLON_TOPIC_ITEMS.flatMap((item) => item.nodes).find((node) => question.id.endsWith(`${node.slug}.v${node.version ?? 1}`))!;
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices.map((choice) => [choice.choiceId, choice.choiceLabel])).toEqual(question.answerChoices.map((choice) => [choice.id, choice.label]));
        for (const [index, choice] of entry.classification.choices.entries()) {
          const authored = item.choices[index]!;
          expect(choice.timing.kind).toBe(authored.timingProfileId ? "test" : "no_test");
          if (choice.timing.kind === "test") {
            expect(choice.timing.timingProfileId).toBe(authored.timingProfileId);
            expect(getDiagnosticTimingProfileMapping(choice.timing.timingProfileId)).toBeDefined();
            timedCount += 1;
          }
        }
      } else {
        expect(item.choices.every((choice) => choice.timingProfileId === undefined)).toBe(true);
      }
    }
    expect(timedCount).toBe(22);
    expect(topic.COLON_TOPIC_ORDER_PROPOSALS).toHaveLength(timedCount);
    for (const order of topic.COLON_TOPIC_ORDER_PROPOSALS) {
      expect(order.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
      expect(order.serviceRequest).toBeNull();
      expect(order.resultGateAfter).toBeNull();
    }
  });

  it("keeps clinical source links safe and disputed teaching points unkeyed", () => {
    for (const link of topic.COLON_TOPIC_SOURCE_LINKS) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
    }
    expect(packet.unkeyedProposals).toHaveLength(3);
    for (const slot of packet.unkeyedProposals) {
      expect(slot.questionVariantId).toBeNull();
      expect(slot.correctChoiceId).toBeNull();
      expect(slot.conceptId).toBeNull();
      expect(slot.reviewStatus).toBe("needs_clinician_review");
    }
    expect(ledger.excludedSources.some((source) => source.title.includes("ESGE"))).toBe(true);
    expect(ledger.sourceTextStored).toBe(false);
  });

  it("records paired eligibility and preserves qualitative review roles", () => {
    expect(topic.COLON_TOPIC_CASES.filter((clinicalCase) => clinicalCase.decisionNodes.length === 2)).toHaveLength(6);
    expect(topic.COLON_TOPIC_CASES.filter((clinicalCase) => clinicalCase.decisionNodes.length === 1)).toHaveLength(7);
    expect(packet.integration.selection.pairedNodes).toBe(12);
    expect(packet.integration.selection.standaloneNodes).toBe(7);
    expect(packet.rankedConcepts).toHaveLength(21);
    expect(packet.advisoryLint.findings.every((finding) => finding.dispositionReason.length > 40)).toBe(true);
    expect(topic.COLON_TOPIC_SELF_CHECKS.every((gate) => gate.authorVerdict === "DRAFT_FOR_INDEPENDENT_REVIEW")).toBe(true);
  });

  it("preserves all reviewed v1 questions, nodes and cases against immutable snapshots", () => {
    expect(packet.revisionRound.originalProposals).toHaveLength(25);
    for (const before of packet.revisionRound.originalProposals) {
      const q = topic.COLON_TOPIC_REVIEWED_V1_CATALOG.questions.find((q) => q.id === before.after.question.id)!;
      const c = topic.COLON_TOPIC_REVIEWED_V1_CATALOG.cases.find((c) => c.id === before.after.case.id)!;
      const n = c.decisionNodes.find((n) => n.id === before.after.node.id)!;
      expect(sha(q), q.id).toBe(before.after.questionSha256);
      expect(sha(c), c.id).toBe(before.after.caseSha256);
      expect(sha(n), n.id).toBe(before.after.nodeSha256);
    }
  });

  it("freezes every editorial PASS and its reviewed header, feedback and concept", () => {
    const reviewPath = new URL("../../../docs/research/question-topic-colon-diverticular-lower-bleeding-review-20261111.json", import.meta.url);
    expect(createHash("sha256").update(readFileSync(reviewPath)).digest("hex")).toBe(packet.revisionRound.reviewFileSha256);
    expect(packet.revisionRound.frozenPass).toHaveLength(10);
    for (const frozen of packet.revisionRound.frozenPass) {
      const q = topic.COLON_TOPIC_QUESTIONS.find((q) => q.id === frozen.id)!;
      const c = [...topic.COLON_TOPIC_CASES, ...topic.COLON_TOPIC_DEFERRED_PASS_CASES].find((c) => c.id === frozen.caseId)!;
      const index = c.decisionNodes.findIndex((n) => n.id === frozen.nodeId);
      const context = {
        header: Object.fromEntries(Object.entries(c).filter(([key]) => !["decisionNodes", "learningSummary"].includes(key))),
        precedingFeedback: c.decisionNodes.slice(0, index).map((n) => ({ explanation: n.explanation })),
      };
      expect(sha(q), frozen.id).toBe(frozen.questionSha256);
      expect(sha(c.decisionNodes[index]), frozen.id).toBe(frozen.nodeSha256);
      expect(sha(context), frozen.id).toBe(frozen.visibleContextSha256);
      expect(topic.COLON_TOPIC_CONCEPTS.find((concept) => concept.id === q.conceptId)).toEqual(frozen.concept);
      expect(packet.revisionRound.itemDispositions.find((p) => p.currentQuestionId === frozen.id)!.status).toBe("pass-preserved");
    }
  });

  it("records one attempt per returned item and excludes every parked version from preview", () => {
    expect(packet.revisionRound.itemDispositions.filter((p) => p.status === "pass-preserved")).toHaveLength(10);
    expect(packet.revisionRound.itemDispositions.filter((p) => p.status === "revised")).toHaveLength(10);
    expect(packet.proposals.filter((p) => p.status === "parked")).toHaveLength(5);
    expect(topic.COLON_TOPIC_REVISION_CATALOG.questions).toHaveLength(15);
    for (const review of packet.revisionRound.reviewRows) {
      const proposal = packet.proposals.find((p) => p.independentReview.reviewedQuestionId === review.id)!;
      expect(proposal.revisionAttemptCount).toBe(review.verdict === "PASS" ? 0 : 1);
      if (review.verdict !== "PASS") {
        expect(proposal.after.question.id).toBe(review.id.replace(/\.v1$/, ".v2"));
        expect(proposal.reviewBefore!.question.id).toBe(review.id);
        expect(proposal.independentReview.newIndependentVerdict).toBeNull();
      }
      if (proposal.status === "parked") {
        expect(proposal.activeAuthoringCandidate).toBe(false);
        expect(proposal.dispositionReason.length).toBeGreaterThan(100);
        expect(topic.COLON_TOPIC_QUESTIONS.some((q) => q.id === proposal.after.question.id)).toBe(false);
        expect(topic.COLON_TOPIC_SOURCE_RELEASE.cases.some((c) => c.decisionNodes.some((n) => n.questionVariantId === proposal.after.question.id))).toBe(false);
      }
    }
    const deferred = "question.topic.colon-diverticular-lower-bleeding.first-episode-with-urinary-symptoms.v1";
    expect(topic.COLON_TOPIC_QUESTIONS.some((q) => q.id === deferred)).toBe(true);
    expect(topic.COLON_TOPIC_CASES.some((c) => c.decisionNodes.some((n) => n.questionVariantId === deferred))).toBe(false);
    expect(packet.revisionRound.assemblyDeferrals.map((d) => d.questionVariantId)).toEqual([deferred]);
    expect(topic.COLON_TOPIC_SOURCE_RELEASE.cases.flatMap((c) => c.decisionNodes)).toHaveLength(19);
  });

  it("preserves testing metadata for all fifteen audit-only revision attempts", () => {
    for (const entry of topic.COLON_TOPIC_REVISION_CATALOG.timing) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const question = topic.COLON_TOPIC_REVISION_CATALOG.questions.find((q) => q.id === entry.questionVariantId)!;
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices.map((c) => [c.choiceId, c.choiceLabel])).toEqual(question.answerChoices.map((c) => [c.id, c.label]));
        for (const c of entry.classification.choices) if (c.timing.kind === "test") expect(getDiagnosticTimingProfileMapping(c.timing.timingProfileId)).toBeDefined();
      }
    }
  });


  it("salvages exactly the skipped PASS nodes in the applicable acceptance receipt", () => {
    const receipt = JSON.parse(readFileSync(new URL("../../../docs/research/question-topic-acceptance-batch3-dispositions-20261111.json", import.meta.url), "utf8")) as {
      items: Array<{ topic: string; status: string; questionVariantId: string; evidence: { record: { verdict: string } } }>;
    };
    const skipped = receipt.items.filter((item) => item.topic === slug && item.status === "skipped" && item.evidence.record.verdict === "PASS");
    expect(skipped).toHaveLength(3);
    expect(topic.COLON_TOPIC_SALVAGE_QUESTIONS.map((q) => q.id).sort()).toEqual(skipped.map((row) => row.questionVariantId).sort());
    expect(packet.proposals.filter((p) => p.status === "salvage")).toHaveLength(3);
    expect(packet.salvage.items).toHaveLength(3);
    expect(topic.COLON_TOPIC_SALVAGE_MANIFEST.independentPass).toBe(false);
    for (const saved of packet.salvage.acceptedFreeze) {
      const c = topic.COLON_TOPIC_CASES.find((c) => c.id === saved.caseId)!;
      const n = c.decisionNodes.find((n) => n.id === saved.nodeId)!;
      const q = topic.COLON_TOPIC_QUESTIONS.find((q) => q.id === saved.questionVariantId)!;
      expect(sha(c), saved.caseId).toBe(saved.caseSha256);
      expect(sha(n), saved.nodeId).toBe(saved.nodeSha256);
      expect(sha(q), saved.questionVariantId).toBe(saved.questionSha256);
      expect(topic.COLON_TOPIC_SALVAGE_QUESTIONS.some((q) => q.id === saved.questionVariantId)).toBe(false);
    }
    expect(packet.salvage.acceptedFreeze).toHaveLength(11);
  });

  it("preserves exact PASS wording and complete visible context in each standalone salvage", () => {
    expect(syntheticClinicalReleaseSchema.safeParse(topic.COLON_TOPIC_SALVAGE_SOURCE_RELEASE).success).toBe(true);
    expect(topic.COLON_TOPIC_SALVAGE_CASES).toHaveLength(3);
    expect(topic.COLON_TOPIC_SALVAGE_CONCEPTS).toHaveLength(2);
    for (const saved of packet.salvage.items) {
      const c = topic.COLON_TOPIC_SALVAGE_CASES.find((c) => c.id === saved.after.case.id)!;
      const q = topic.COLON_TOPIC_SALVAGE_QUESTIONS.find((q) => q.id === saved.after.question.id)!;
      const n = c.decisionNodes[0]!;
      expect(c.decisionNodes).toHaveLength(1);
      expect(sha(c)).toBe(saved.after.caseSha256);
      expect(sha(n)).toBe(saved.after.nodeSha256);
      expect(sha(q)).toBe(saved.before.questionSha256);
      const { id: nodeIdentity, terminalDispositions, ...clinicalFields } = n;
      const { id: previousNodeIdentity, terminalDispositions: previousTerminal, ...previousClinicalFields } = saved.before.node;
      expect(nodeIdentity).not.toBe(previousNodeIdentity);
      expect(clinicalFields).toEqual(previousClinicalFields);
      expect(previousTerminal).toEqual([]);
      expect(c.presentation).toBe(saved.before.case.presentation);
      expect(c.chiefComplaint).toBe(saved.before.case.chiefComplaint);
      expect(c.prototypeDemographics).toEqual(saved.before.case.prototypeDemographics);
      expect(c.patientDisplayName).toBe(saved.before.case.patientDisplayName);
      expect(c.approvedInstantiationProfiles!.map(({ id, ...profile }) => profile)).toEqual(saved.before.case.approvedInstantiationProfiles.map(({ id, ...profile }) => profile));
      expect(saved.origin.originalNodeIndex).toBe(0);
      expect(Object.values(saved.wordingPreservation).every(Boolean)).toBe(true);
      expect(saved.originalPass.record.verdict).toBe("PASS");
      expect(saved.status).toBe("salvage");
      expect(saved.independentPass).toBe(false);
      expect(saved.reviewStatus).toBe("needs_clinician_review");
      expect(c.learningSummary).toBe(n.explanation);
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.requiredCapabilityIds).toEqual([]);
      expect(n.shuffleAnswers).toBe(true);
      expect(n.resultGateAfter).toBeNull();
      expect(terminalDispositions.map((d) => d.answerChoiceId).sort()).toEqual(n.answerChoices.filter((a) => !a.isCorrect).map((a) => a.id).sort());
      expect(terminalDispositions.every((d) => d.kind === "no_terminal_outcome")).toBe(true);
    }
  });

  it("maps every salvage testing choice to its exact new tuple without executing orders", () => {
    expect(topic.COLON_TOPIC_SALVAGE_TIMING_ENTRIES).toHaveLength(3);
    expect(topic.COLON_TOPIC_SALVAGE_ORDER_PROPOSALS).toHaveLength(9);
    for (const entry of topic.COLON_TOPIC_SALVAGE_TIMING_ENTRIES) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const c = topic.COLON_TOPIC_SALVAGE_CASES.find((c) => c.id === entry.caseId)!;
      const node = c.decisionNodes.find((n) => n.id === entry.nodeId)!;
      expect(entry.questionVariantId).toBe(node.questionVariantId);
      expect(entry.classification.kind).toBe("test_choices");
      if (entry.classification.kind !== "test_choices") throw new Error("Missing salvage test timing");
      expect(entry.classification.choices.map((a) => [a.choiceId, a.choiceLabel])).toEqual(node.answerChoices.map((a) => [a.id, a.label]));
      for (const choice of entry.classification.choices) {
        expect(choice.timing.kind).toBe("test");
        if (choice.timing.kind === "test") expect(getDiagnosticTimingProfileMapping(choice.timing.timingProfileId)).toBeDefined();
        const order = topic.COLON_TOPIC_SALVAGE_ORDER_PROPOSALS.find((o) => o.caseId === entry.caseId && o.nodeId === entry.nodeId && o.choiceId === choice.choiceId)!;
        expect(order.questionVariantId).toBe(node.questionVariantId);
        expect(order.choiceLabel).toBe(choice.choiceLabel);
        expect(order.disposition).toEqual({ kind: "not_executed", reason: "future_planned" });
        expect(order.serviceRequest).toBeNull();
        expect(order.resultGateAfter).toBeNull();
      }
    }
    expect(ledger.salvageContextMappings).toEqual(topic.COLON_TOPIC_SALVAGE_STATEMENT_MAPPINGS);
    for (const row of topic.COLON_TOPIC_SALVAGE_STATEMENT_MAPPINGS) {
      const question = topic.COLON_TOPIC_SALVAGE_QUESTIONS.find((q) => q.id === row.questionVariantId)!;
      expect(row.constructedObservations.inferenceClaimIds).toEqual(question.supportingEvidenceClaimIds);
      expect(row.fieldMappings.every((m) => m.claimIds.every((id) => ledger.claims.some((c) => c.id === id)))).toBe(true);
      expect(row.status).toBe("salvage");
    }
    expect(ledger.salvageReuse.newAtomicClaims).toBe(0);
    expect(ledger.salvageReuse.newSourceRecords).toBe(0);
  });

});
