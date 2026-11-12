import {retainedTopicCase} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import { ROW_060_CLINICAL_APPROVAL, ROW_060_QUESTION_VARIANTS } from "./approved-data/familial-hypocalciuric-hypercalcemia";
import {
  answerChoiceTimingRegistryEntrySchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
} from "./schema";
import {
  PARATHYROID_CALCIUM_TOPIC_PACKET as packet,
  PARATHYROID_CALCIUM_TOPIC_LEDGER as ledger,
  PARATHYROID_CALCIUM_TOPIC_QUESTIONS as questions,
  PARATHYROID_CALCIUM_TOPIC_CASES as cases,
  PARATHYROID_CALCIUM_TOPIC_NODES as nodes,
  PARATHYROID_CALCIUM_TOPIC_CONCEPTS as concepts,
  PARATHYROID_CALCIUM_TOPIC_CONCEPT_PROPOSALS as proposals,
  PARATHYROID_CALCIUM_TOPIC_TIMING_ENTRIES as timings,
  PARATHYROID_CALCIUM_TOPIC_ORDER_PROPOSALS as orders,
  PARATHYROID_CALCIUM_TOPIC_SOURCE_LINKS as links,
  PARATHYROID_CALCIUM_TOPIC_MANIFEST as manifest,
  PARATHYROID_CALCIUM_TOPIC_PREVIEW_RELEASE as preview,
  PARATHYROID_CALCIUM_TOPIC_PASS_PRESERVED_CASES as preservedCases,
  PARATHYROID_CALCIUM_TOPIC_REVISION_CANDIDATE_CASES as revisionCases,
  PARATHYROID_CALCIUM_TOPIC_REVISION_CANDIDATE_RELEASE as revisionPreview,
  PARATHYROID_CALCIUM_TOPIC_PARKED_ATTEMPTS as parked,
} from "./question-topic-parathyroid-calcium-20261111";

const root = new URL("../../../", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, root), "utf8");
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const byCode = (code: string) => packet.proposedNodes.find(node => node.code === code)!;

describe("parathyroid/calcium explicit-import authoring sidecar", () => {
  it("reconciles all exact assigned rows, canonical identities and separate verdict counts", () => {
    const program = JSON.parse(read("docs/research/question-topic-program-20261111.json")) as {
      inventory: Array<{ recordId: string; primaryTopicSlug: string }>;
    };
    const assigned = program.inventory.filter(row => row.primaryTopicSlug === "parathyroid-calcium");
    expect(packet.assignment.inventory).toEqual(assigned);
    expect(assigned).toHaveLength(27);
    expect(packet.audit.map(row => row.inventoryRecordId).sort()).toEqual(assigned.map(row => row.recordId).sort());
    expect(new Set(packet.audit.map(row => row.inventoryRecordId)).size).toBe(27);
    expect(new Set(packet.audit.map(row => row.questionVariantId)).size).toBe(27);
    expect(packet.audit.filter(row => row.verdict === "Keep")).toHaveLength(1);
    expect(packet.audit.filter(row => row.verdict === "Rewrite")).toHaveLength(6);
    expect(packet.audit.filter(row => row.verdict === "Retire-and-replace")).toHaveLength(20);
    expect(packet.assignment.concepts).toHaveLength(10);
    expect(packet.assignment.nodeAssignments).toHaveLength(22);
    expect(packet.assignment.variantAssignments).toHaveLength(27);
    expect(packet.assignment.caseAssignments).toHaveLength(12);
    expect(packet.assignment.crossTopicCaseAssignments).toHaveLength(1);
    for (const row of packet.audit) {
      const before = packet.beforeSnapshots.find(snapshot => snapshot.inventoryRecordId === row.inventoryRecordId)!;
      expect(hash(before.question)).toBe(row.beforeQuestionSha256);
      expect(hash(before.node)).toBe(row.beforeNodeSha256);
      expect(hash(before.clinicalCase)).toBe(row.beforeCaseSha256);
      expect(row.reasons.length).toBeGreaterThanOrEqual(2);
      expect(row.sourceExport.length).toBeGreaterThan(3);
      expect(row.replacementQuestionVariantId.length).toBeGreaterThan(3);
    }
  });

  it("preserves exact current live contexts, the G05 PASS and five historical clinical approvals", () => {
    for (const row of packet.audit.filter(row => row.status.startsWith("live"))) {
      const clinicalCase = retainedTopicCase(row.caseId)!;
      expect(hash(clinicalCase), row.inventoryRecordId).toBe(row.beforeCaseSha256);
      const node = clinicalCase.decisionNodes.find(candidate => candidate.questionVariantId === row.questionVariantId)!;
      expect(hash(node), row.inventoryRecordId).toBe(row.beforeNodeSha256);
    }
    const passed = packet.audit.find(row => row.inventoryRecordId === "inventory.3d405629daa345b2")!;
    expect(passed.verdict).toBe("Keep");
    expect(passed.questionVariantId).toBe("question.asymptomatic-phpt.age-based-surgery.v1.r3");
    expect(passed.editorialFreezeReference?.reviewItemId).toBe("G05");
    expect(passed.clinicalApprovalReference.reviewStatus).toBe("needs_clinician_review");
    expect(packet.assignment.frozenPassAndApprovalReferences).toHaveLength(6);
    expect(ROW_060_CLINICAL_APPROVAL.approvedQuestionVariantIds).toHaveLength(5);
    for (const question of ROW_060_QUESTION_VARIANTS) {
      const row = packet.audit.find(candidate => candidate.questionVariantId === question.id)!;
      expect(hash(question)).toBe(row.beforeQuestionSha256);
      expect(row.clinicalApprovalReference.approvalId).toBe(ROW_060_CLINICAL_APPROVAL.id);
    }
    expect(questions.some(question => question.id === passed.questionVariantId)).toBe(false);
  });

  it("has 20 schema-valid singleton drafts with passed and revision previews separated", () => {
    expect(questions).toHaveLength(20);
    expect(nodes).toHaveLength(20);
    expect(cases).toHaveLength(20);
    expect(cases.every(clinicalCase => clinicalCase.decisionNodes.length === 1)).toBe(true);
    expect(concepts).toHaveLength(18);
    expect(preview.publicationStatus).toBe("synthetic_unapproved_prototype");
    expect(preview.cases).toHaveLength(8);
    expect(revisionPreview.cases).toHaveLength(12);
    expect(preservedCases).toEqual(preview.cases);
    expect(revisionCases).toEqual(revisionPreview.cases);
    for (const clinicalCase of cases) {
      expect(syntheticClinicalCaseSchema.safeParse(clinicalCase).success).toBe(true);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.tutorialEligible).toBe(false);
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.patientDisplayName).not.toContain("{patientName}");
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.presentation).toContain(`${clinicalCase.prototypeDemographics!.ageYears}-year-old`);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      const profile = clinicalCase.approvedInstantiationProfiles![0]!;
      expect(profile.prototypeDemographics).toEqual(clinicalCase.prototypeDemographics);
      expect(profile.presentation).toBe(clinicalCase.presentation);
      expect(clinicalCase.presentation).not.toMatch(/\b(?:race|ethnicity)\b/i);
    }
    for (const question of questions) {
      expect(question.reviewStatus).toBe("needs_clinician_review");
      expect(question.lastClinicianReview).toBeNull();
      expect(question.shuffleAnswers).toBe(true);
      expect(question.answerChoices.length).toBeGreaterThanOrEqual(3);
      expect(question.answerChoices.length).toBeLessThanOrEqual(4);
      expect(question.answerChoices.filter(choice => choice.isCorrect)).toHaveLength(1);
    }
    expect(nodes.every(node => node.shuffleAnswers && node.resultGateAfter === null)).toBe(true);
    expect(nodes.every(node => node.answerChoices.every(choice => choice.serviceRequest === null))).toBe(true);
    expect(manifest.pipelinePassed).toBe(false);
    expect(manifest.publicReleaseAuthorized).toBe(false);
  });

  it("retains old meanings and versions the four materially changed correction objectives", () => {
    expect(proposals.filter(proposal => proposal.conceptRelation === "existing_meaning_variant")).toHaveLength(10);
    expect(proposals.filter(proposal => proposal.id.endsWith(".v2"))).toHaveLength(4);
    for (const proposal of proposals) {
      expect(proposal.reviewStatus).toBe("needs_clinician_review");
      expect(testedConceptSchema.safeParse(concepts.find(concept => concept.id === proposal.id)).success).toBe(true);
      if (proposal.conceptRelation === "existing_meaning_variant") {
        const old = packet.assignment.concepts.find(concept => concept.conceptId === proposal.id)!;
        expect(proposal.previousConceptId).toBe(proposal.id);
        if (old) expect(proposal.learningObjective).toBe(old.learningObjective);
        else expect(packet.reviewRound.beforeNodes.some(node => node.conceptId === proposal.id)).toBe(true);
      } else {
        expect(proposal.id).toMatch(/^concept\.topic\.parathyroid-calcium\./);
        if (proposal.id.endsWith(".v2")) expect(proposal.previousConceptId).not.toBeNull();
        else expect(proposal.previousConceptId).toBeNull();
      }
    }
    expect(byCode("N02").conceptId).toBe("concept.fhh.recognition-and-confirmation");
    expect(byCode("N04").conceptIdentityDecision.previousConceptId).toBe("concept.primary-hyperparathyroidism.biochemical-confirmation");
    expect(byCode("N06").conceptId).toBe("concept.primary-hyperparathyroidism.symptomatic-surgery-assessment");
  });

  it("requires concrete author attacks, counterfactuals and supported before references for every exact draft", () => {
    expect(packet.reviewOrderNotice).toBe("key shown first for review only.");
    for (const node of packet.proposedNodes) {
      const gate = node.authorGate;
      expect(gate.twoConsequentialSteps).toHaveLength(2);
      for (const text of [gate.coverTheKey, gate.oneDecisionStageAndCategory, gate.residentDifficulty,
        gate.oneBestAnswer.decidingObservation, gate.oneBestAnswer.decisionChangingCounterfactual,
        node.deletionTest, node.visibleSequenceAudit]) expect(text.length).toBeGreaterThan(40);
      for (const choice of node.choices) {
        expect(choice.temptation.length).toBeGreaterThan(15);
        expect(choice.decidingBoundary.length).toBeGreaterThan(15);
        expect(choice.counterfactual.length).toBeGreaterThan(20);
      }
      if (node.code.startsWith("N")) expect(node.before).toBeNull();
      else expect(node.beforeInventoryRecordIds).toHaveLength(1);
      expect(node.clinicalStatementMappings.keyAndExplanation).toEqual(node.supportingEvidenceClaimIds);
    }
    expect(byCode("R03").authoringRevisionLog).toHaveLength(1);
    expect(byCode("R04").authoringRevisionLog).toHaveLength(1);
    expect(byCode("N01").authoringRevisionLog).toHaveLength(1);
  });

  it("maps all choices to exact existing placeholder profiles without executing clinical services", () => {
    const profileIds = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(profile => profile.id));
    expect(timings).toHaveLength(20);
    const expectedOrderIds: string[] = [];
    for (const entry of timings) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const definition = packet.proposedNodes.find(node => node.questionVariantId === entry.questionVariantId)!;
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices.map(choice => choice.choiceId)).toEqual(definition.choices.map(choice => choice.id));
        for (const choice of entry.classification.choices) {
          const exact = definition.choices.find(candidate => candidate.id === choice.choiceId)!;
          expect(choice.choiceLabel).toBe(exact.label);
          expect(choice.timing).toEqual(exact.timing);
          if (choice.timing.kind === "test") {
            expect(profileIds.has(choice.timing.timingProfileId)).toBe(true);
            expectedOrderIds.push(choice.choiceId);
          }
        }
      } else expect(definition.choices.every(choice => choice.timing.kind === "no_test")).toBe(true);
    }
    expect(orders.map(order => order.choiceId).sort()).toEqual(expectedOrderIds.sort());
    expect(orders.every(order => order.serviceRequest === null && order.resultGateAfter === null)).toBe(true);
    expect(orders.every(order => order.execution === "presentation_only_estimate")).toBe(true);
    const preparation = timings.find(entry => entry.questionVariantId === byCode("R05").questionVariantId)!;
    expect(preparation.classification.kind).toBe("test_choices");
    if (preparation.classification.kind === "test_choices") {
      expect(preparation.classification.choices.every(choice => choice.timing.kind === "test"
        && choice.timing.timingProfileId === "timing.test.twenty_four_hour_protocol")).toBe(true);
    }
  });

  it("has complete source/atomic-claim mappings and safe offline links", () => {
    expect(ledger.sources).toHaveLength(15);
    expect(ledger.evidenceClaims).toHaveLength(51);
    const sourceIds = new Set(ledger.sources.map(source => source.id));
    const claimIds = new Set(ledger.evidenceClaims.map(claim => claim.id));
    for (const source of ledger.sources) {
      for (const field of [source.completeCitation, source.organizationOrJournal, source.licenseLabel,
        source.reuseNotes, source.authorityAssessment, source.officialUrl]) expect(field!.length).toBeGreaterThan(5);
      expect(source.reviewStatus).toBe("needs_clinician_review");
      expect(source.accessedOn).toBe("2026-11-11");
      expect(source.evidenceClaimIds).toEqual(ledger.evidenceClaims.filter(claim => claim.sourceIds.includes(source.id)).map(claim => claim.id));
    }
    for (const claim of ledger.evidenceClaims) {
      expect(claim.reviewStatus).toBe("needs_clinician_review");
      expect(claim.lastCheckedOn).toBe("2026-11-11");
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(claim.sourceIds.every(id => sourceIds.has(id))).toBe(true);
      expect(ledger.claimToQuestionMappings.find(mapping => mapping.claimId === claim.id)?.questionVariantIds)
        .toEqual(packet.proposedNodes.filter(node => node.supportingEvidenceClaimIds.includes(claim.id)).map(node => node.questionVariantId));
    }
    for (const question of questions) expect(question.supportingEvidenceClaimIds.every(id => claimIds.has(id))).toBe(true);
    for (const link of links) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
    }
    for (const file of ["docs/research/question-topic-parathyroid-calcium-20261111.json",
      "docs/research/sources-question-topic-parathyroid-calcium-20261111.json"]) expect(() => JSON.parse(read(file))).not.toThrow();
  });

  it("keeps holds, cross-topic composition and feedback-sensitive cases explicit", () => {
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints).toEqual([]);
    expect(packet.heldAndUnkeyedLedger.carriedHolds.map(hold => hold.id)).toEqual(["flags2-G05-staging"]);
    expect(packet.heldAndUnkeyedLedger.newUnkeyedResearchBoundaries).toHaveLength(2);
    const ethics = packet.audit.find(row => row.inventoryRecordId === "inventory.56e2eb30a06c0c83")!;
    expect(ethics.verdict).toBe("Retire-and-replace");
    expect(ethics.reasons.join(" ")).toContain("ethics-owned");
    for (const code of ["R04", "N15", "N16"]) {
      const question = byCode(code);
      expect(packet.caseDefinitions.find(clinicalCase => clinicalCase.id === question.caseId)!.nodeIds).toHaveLength(1);
    }
    expect(byCode("R05").explanation).not.toMatch(/genetic|CASR|0\.01/i);
    expect(byCode("N07").explanation).not.toMatch(/bilateral/i);
    expect(byCode("N11").explanation).not.toMatch(/4D|four-dimensional|PET/);
    for (const code of ["N11", "N12", "N13", "N14"]) {
      const node = byCode(code);
      const clinicalCase = packet.caseDefinitions.find(candidate => candidate.id === node.caseId)!;
      expect(clinicalCase.encounterMode).toBe("outside_hospital_chart_review");
      expect(clinicalCase.presentation).toContain("outside");
      expect(node.currentUpdate ?? "").not.toMatch(/years later/i);
    }
    expect(byCode("N11").task).toContain("postoperative stage");
    expect(byCode("N13").task).toContain("earlier nondialysis visit");
  });

  it("preserves the protocol calculation and age/site eligibility that the new keys depend on", () => {
    const io = byCode("N17");
    expect(io.exhibit?.kind).toBe("table");
    const highestBaseline = Math.max(100, 180);
    expect(80).toBeLessThan(highestBaseline / 2);
    expect(80).toBeGreaterThan(65);
    expect(110).toBeGreaterThan(highestBaseline / 2);
    expect(io.choices.find(choice => choice.isCorrect)!.label).toBe("Conclude parathyroid exploration");
    expect(packet.caseDefinitions.find(clinicalCase => clinicalCase.id === byCode("R04").caseId)!.age).toBe(44);
    expect(packet.caseDefinitions.find(clinicalCase => clinicalCase.id === byCode("N05").caseId)!.age).toBe(66);
    expect(byCode("N05").exhibit).toMatchObject({ rowHeaders: ["Lumbar spine DXA", "Total hip DXA", "Distal one-third radius DXA"] });
    expect(byCode("N18").choices.find(choice => choice.isCorrect)!.label).toContain("En bloc");
    expect(packet.caseDefinitions.find(clinicalCase => clinicalCase.id === byCode("N18").caseId)!.presentation)
      .toContain("gross extension");
  });

  it("freezes every exact independent PASS question, node, definition and visible patient header", () => {
    expect(packet.reviewRound.passFreeze).toHaveLength(8);
    expect(createHash("sha256").update(read(packet.reviewRound.reviewFile)).digest("hex"))
      .toBe(packet.reviewRound.reviewFileSha256);
    for (const frozen of packet.reviewRound.passFreeze) {
      expect(hash(frozen.question)).toBe(frozen.questionSha256);
      expect(hash(frozen.node)).toBe(frozen.nodeSha256);
      expect(hash(frozen.definition)).toBe(frozen.definitionSha256);
      expect(hash(frozen.clinicalCase)).toBe(frozen.caseSha256);
      expect(hash(questions.find(question => question.id === frozen.questionVariantId))).toBe(frozen.questionSha256);
      expect(hash(nodes.find(node => node.questionVariantId === frozen.questionVariantId))).toBe(frozen.nodeSha256);
      expect(hash(byCode(frozen.definition.code))).toBe(frozen.definitionSha256);
      const projected = cases.find(clinicalCase => clinicalCase.id === frozen.clinicalCase.id)!;
      const { decisionNodes: _oldNodes, learningSummary: _oldSummary, ...oldHeader } = frozen.clinicalCase;
      const { decisionNodes: _newNodes, learningSummary: _newSummary, ...newHeader } = projected;
      expect(newHeader).toEqual(oldHeader);
      const projectedNode = projected.decisionNodes[0]!;
      const { terminalDispositions: _oldDispositions, ...oldVisibleNode } = frozen.node;
      const { terminalDispositions: _newDispositions, ...newVisibleNode } = projectedNode;
      expect(newVisibleNode).toEqual(oldVisibleNode);
      if (frozen.node.terminalDispositions.length) expect(projectedNode).toEqual(frozen.node);
      else {
        expect(["N07", "N13"]).toContain(frozen.definition.code);
        for (const disposition of projectedNode.terminalDispositions) {
          const choice = frozen.node.answerChoices.find(candidate => candidate.id === disposition.answerChoiceId)!;
          expect(disposition.kind).toBe("no_terminal_outcome");
          if (disposition.kind === "no_terminal_outcome") {
            expect(disposition.clinicalRationale).toBe(choice.rationale);
            expect(disposition.consequenceNarrative).toBe(choice.rationale);
          }
        }
      }
      expect(projected.learningSummary).toBe(frozen.node.explanation);
    }
  });

  it("accounts for one attempt per returned item and excludes every parked candidate", () => {
    const statuses = packet.reviewRound.statuses;
    expect(statuses).toHaveLength(24);
    expect(new Set(statuses.map(status => status.reviewedQuestionVariantId)).size).toBe(24);
    expect(statuses.filter(status => status.status === "pass-preserved")).toHaveLength(8);
    expect(statuses.filter(status => status.status === "revised")).toHaveLength(12);
    expect(statuses.filter(status => status.status === "parked")).toHaveLength(4);
    expect(parked.map(node => node.code).sort()).toEqual(["N01", "N03", "N08", "N15"]);
    for (const status of statuses) {
      const review = packet.reviewRound.review.find(item => item.id === status.reviewedQuestionVariantId)!;
      expect(status.attempts).toBe(review.verdict === "PASS" ? 0 : 1);
      if (review.verdict !== "PASS") {
        expect(status.currentQuestionVariantId).not.toBe(status.reviewedQuestionVariantId);
        expect(status.reviewIssues).toEqual({ clarityIssues: review.clarityIssues, cues: review.cues,
          fairness: review.fairness, suggestions: review.suggestions });
        expect(status.independentReviewVerdict).toContain("pending");
      }
      if (status.status === "parked") {
        expect(questions.some(question => question.id === status.currentQuestionVariantId)).toBe(false);
        expect(timings.some(entry => entry.questionVariantId === status.currentQuestionVariantId)).toBe(false);
      }
    }
    expect(byCode("N08").choices.every(choice => !choice.isCorrect)).toBe(true);
    expect(manifest.correctionRound.mixedMultipartCases).toBe(0);
  });

  it("protects the repaired clinical boundaries and real competitor identities", () => {
    expect(byCode("R01").supportingEvidenceClaimIds).toContain("claim.parathyroid-calcium.biotin-pth-interference");
    expect(byCode("R03").choices).toHaveLength(4);
    expect(byCode("R05").choices).toHaveLength(4);
    expect(byCode("N09").explanation).toContain("concurrent PTH insufficiency can contribute");
    expect(byCode("N10").choices.map(choice => choice.label)).toContain("Start palopegteriparatide");
    expect(byCode("N12").choices.map(choice => choice.label)).toEqual([
      "Parathyroid MRI with gadolinium contrast", "Parathyroid 4D CT with iodinated contrast", "Selective venous PTH sampling"]);
    expect(byCode("N14").choices.map(choice => choice.label)).toContain("Replace cinacalcet with intravenous etelcalcetide");
    expect(byCode("N16").choices.map(choice => choice.label)).toEqual(["Denosumab", "Oral alendronate", "Teriparatide"]);
    expect(byCode("N17").choices.map(choice => choice.label)).toContain("Continue PTH sampling until laboratory normalization");
  });
});
