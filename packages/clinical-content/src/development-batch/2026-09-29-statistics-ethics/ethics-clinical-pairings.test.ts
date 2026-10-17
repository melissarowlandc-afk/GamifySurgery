import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "../../answer-choice-timing";
import { SYNTHETIC_CLINICAL_RELEASE } from "../../synthetic-content";
import { syntheticClinicalCaseSchema } from "../../schema";
import { EXISTING_ANCHOR_CLAIMS, EXISTING_ANCHOR_SOURCES } from "./clinical-anchor-test-catalog";
import { ETHICS_BASE_FAMILIES, ETHICS_FAMILIES, ETHICS_P2E_QUESTIONS } from "./ethics";
import { ETHICS_CLINICAL_ANCHOR_BY_QUESTION } from "./ethics";
import { ETHICS_P2E_PAIRINGS, getP2EClinicalDonor, P2E_CONTENT_VERSION, P2E_REUSED_CLINICAL_CONTENT } from "./ethics-clinical-pairings";

const before = ETHICS_BASE_FAMILIES.flatMap(family => family.cases);
const after = ETHICS_FAMILIES.flatMap(family => family.cases);
const paired = after.filter(item => item.id.startsWith("case.gs028se.p2e."));
const originalQuestions = ETHICS_BASE_FAMILIES.flatMap(family => family.questions);
const claims = new Map(EXISTING_ANCHOR_CLAIMS.map(item => [item.id, item]));
const sources = new Map(EXISTING_ANCHOR_SOURCES.map(item => [item.id, item]));
const labelsForClaims = (ids: string[]) => [...new Set(ids.flatMap(id => claims.get(id)!.sourceIds.map(sourceId => sources.get(sourceId)!.title)))];

describe("P2-E ethics before an existing clinical decision", () => {
  it("replaces exactly eight single-step cases and preserves all other cases and original questions", () => {
    expect(ETHICS_P2E_PAIRINGS).toHaveLength(8);
    expect(paired).toHaveLength(8);
    expect(ETHICS_P2E_QUESTIONS).toHaveLength(8);
    expect(after).toHaveLength(36);
    expect(after.flatMap(item => item.decisionNodes)).toHaveLength(48);
    expect(ETHICS_FAMILIES.flatMap(family => family.questions)).toEqual(originalQuestions);
    const replacedIds = new Set(ETHICS_P2E_PAIRINGS.map(item => item.ethicsQuestionId));
    for (const clinicalCase of before) {
      if (replacedIds.has(clinicalCase.decisionNodes[0]!.questionVariantId)) {
        expect(clinicalCase.decisionNodes).toHaveLength(1);
        expect(after.some(item => item.id === clinicalCase.id)).toBe(false);
      } else expect(after.find(item => item.id === clinicalCase.id)).toEqual(clinicalCase);
    }
    expect(new Set(after.map(item => item.id)).size).toBe(36);
    expect(new Set(after.flatMap(item => item.decisionNodes.map(node => node.id))).size).toBe(48);
    expect(new Set(after.flatMap(item => item.decisionNodes.map(node => node.questionVariantId))).size).toBe(48);
  });

  it("preserves all four early interpreter-consent sequences byte for byte and all level-1 ethics supply", () => {
    const interpreted = before.filter(item => item.decisionNodes.length === 2);
    expect(interpreted).toHaveLength(4);
    for (const clinicalCase of interpreted) expect(after.find(item => item.id === clinicalCase.id)).toEqual(clinicalCase);
    for (const level of [1, 2]) {
      expect(after.filter(item => item.earliestFacilityStage <= level)).toHaveLength(36);
      const ethicsNodes = after.filter(item => item.earliestFacilityStage <= level)
        .flatMap(item => item.decisionNodes.filter(node => node.primaryConceptId.startsWith("concept.statistics-ethics.")));
      expect(ethicsNodes).toHaveLength(40);
      for (const concept of ETHICS_FAMILIES.flatMap(family => family.testedConcepts)) {
        expect(ethicsNodes.filter(node => node.primaryConceptId === concept.id)).toHaveLength(4);
      }
    }
    expect(before.filter(item => item.earliestFacilityStage === 0)).toHaveLength(36);
    expect(after.filter(item => item.earliestFacilityStage === 0)).toHaveLength(33);
    expect(after.filter(item => item.earliestFacilityStage === 1)).toHaveLength(3);
  });

  it.each(ETHICS_P2E_PAIRINGS)("reuses the $anchor decision, population and evidence for $ethicsQuestionId", pairing => {
    const clinicalCase = paired.find(item => item.decisionNodes[0]!.questionVariantId === pairing.ethicsQuestionId)!;
    const original = before.find(item => item.decisionNodes[0]!.questionVariantId === pairing.ethicsQuestionId)!;
    const donor = getP2EClinicalDonor(pairing);
    const [ethics, clinical] = clinicalCase.decisionNodes;
    const question = ETHICS_P2E_QUESTIONS.find(item => item.id === clinical!.questionVariantId)!;
    syntheticClinicalCaseSchema.parse(clinicalCase);
    expect(ETHICS_CLINICAL_ANCHOR_BY_QUESTION[ethics!.questionVariantId]).toBe(pairing.anchor);
    expect(clinicalCase.presentation).toBe(original.presentation);
    expect(clinicalCase.prototypeDemographics).toEqual(original.prototypeDemographics);
    expect(clinicalCase.approvedInstantiationProfiles).toEqual(original.approvedInstantiationProfiles);
    expect(question.approvedInstantiationProfiles).toEqual(original.approvedInstantiationProfiles);
    for (const profile of clinicalCase.approvedInstantiationProfiles ?? []) {
      expect(profile.prototypeDemographics!.ageYears).toBeGreaterThanOrEqual(18);
      expect(profile.presentation).toMatch(/\d+-year-old (?:woman|man)/);
    }
    expect(clinical!.primaryConceptId).toBe(donor.node.primaryConceptId);
    expect(SYNTHETIC_CLINICAL_RELEASE.concepts.filter(item => item.id === clinical!.primaryConceptId)).toHaveLength(1);
    expect(clinical!.questionVariantId).not.toBe(pairing.sourceQuestionId);
    expect(clinical!.answerChoices.map(answer => [answer.id, answer.isCorrect, answer.serviceRequest]))
      .toEqual(donor.node.answerChoices.map(answer => [answer.id, answer.isCorrect, answer.serviceRequest]));
    expect(clinical!.answerChoices.map(answer => answer.label))
      .toEqual(pairing.choiceLabels ?? donor.node.answerChoices.map(answer => answer.label));
    const originalQuestion = originalQuestions.find(item => item.id === ethics!.questionVariantId)!;
    expect(question.supportingEvidenceClaimIds)
      .toEqual([...new Set([...donor.claimIds, ...originalQuestion.supportingEvidenceClaimIds])]);
    expect(clinical!.teachingPoint).toBe(donor.node.teachingPoint ?? donor.node.explanation);
    expect(question).toMatchObject({
      contentVersion: P2E_CONTENT_VERSION, reviewStatus: "needs_clinician_review", lastClinicianReview: null,
      aiAssistedDrafting: true, reachedCurrentUpdate: clinical!.currentUpdate, stem: clinical!.stem,
      agentReview: { reviewedOn: "2026-10-17", clinicianSignOff: false },
    });
    const review = ETHICS_FAMILIES.flatMap(family => family.caseReviews).find(item => item.caseId === clinicalCase.id)!;
    expect(review).toMatchObject({ contentVersion: P2E_CONTENT_VERSION, reviewStatus: "needs_clinician_review", lastClinicianReview: null,
      agentReview: { reviewedOn: "2026-10-17", clinicianSignOff: false },
    });
    expect(clinicalCase.earliestFacilityStage).toBe(Math.max(original.earliestFacilityStage, donor.clinicalCase.earliestFacilityStage));
    expect(clinicalCase.releasePointId).toBe(donor.clinicalCase.releasePointId);
    expect(clinicalCase.requiredCapabilityIds).toEqual([...new Set([...original.requiredCapabilityIds, ...donor.clinicalCase.requiredCapabilityIds])]);
    expect(ethics!.sourceLabels).toEqual(labelsForClaims(originalQuestion.supportingEvidenceClaimIds));
    expect(clinical!.sourceLabels).toEqual(labelsForClaims(question.supportingEvidenceClaimIds));
    expect(clinicalCase.sourceLabels).toEqual([...new Set([...ethics!.sourceLabels, ...clinical!.sourceLabels])]);
    expect(clinicalCase.sourceLabels.join(" ")).not.toMatch(/Clinically approved/);
    for (const claimId of question.supportingEvidenceClaimIds) {
      const claim = claims.get(claimId)!;
      expect(claim, claimId).toBeDefined();
      for (const sourceId of claim.sourceIds) expect(sources.get(sourceId)!.evidenceClaimIds).toContain(claimId);
    }
    expect(ethics!.terminalDispositions).toEqual([]);
    expect(clinical!.terminalDispositions).toHaveLength(3);
    expect(clinical!.terminalDispositions.every(item => item.kind === "no_terminal_outcome")).toBe(true);
    expect(clinical!.resultGateAfter).toEqual(donor.node.resultGateAfter);
    expect(clinical!.stem).toContain("{patientName}");
    expect(clinical!.stem).toMatch(/\?$/);
    expect(clinical!.currentUpdate).toContain("{patientName}");
    expect(clinical!.shuffleAnswers).toBe(true);
    expect(clinical!.answerChoices.every(answer => Boolean(answer.rationale))).toBe(true);
    expect(question.teachingPoint).toBe(clinical!.teachingPoint);
    expect(question.explanation).toBe(clinical!.explanation);
    expect(question.explanation).not.toBe(question.teachingPoint);
  });

  it("registers every reached node once and preserves management-only wait classifications", () => {
    let testingChoices = 0;
    for (const clinicalCase of paired) for (const node of clinicalCase.decisionNodes) {
      const entries = ANSWER_CHOICE_TIMING_REGISTRY.filter(item => item.caseId === clinicalCase.id && item.nodeId === node.id);
      expect(entries).toHaveLength(1);
      expect(entries[0]!.questionVariantId).toBe(node.questionVariantId);
      if (entries[0]!.classification.kind === "test_choices") {
        expect(entries[0]!.classification.choices.map(item => [item.choiceId, item.choiceLabel]))
          .toEqual(node.answerChoices.map(item => [item.id, item.label]));
        testingChoices += entries[0]!.classification.choices.filter(item => item.timing.kind === "test").length;
        const pairing = ETHICS_P2E_PAIRINGS.find(item => item.ethicsQuestionId === clinicalCase.decisionNodes[0]!.questionVariantId)!;
        const donor = getP2EClinicalDonor(pairing);
        expect(entries[0]!.classification).toEqual(P2E_REUSED_CLINICAL_CONTENT.timingEntries.find(item =>
          item.caseId === donor.clinicalCase.id && item.questionVariantId === pairing.sourceQuestionId,
        )!.classification);
      } else expect(entries[0]!.classification).toEqual({ kind: "no_test" });
    }
    expect(testingChoices).toBe(0);
  });

  it("provides the owner every step, key, choice rationale and lesson in the pairing review", () => {
    const review = readFileSync(new URL("../../../../../docs/reviews/stats-ethics-p2e-pairings-20261017.md", import.meta.url), "utf8");
    expect(review).toContain("KEY FIRST FOR REVIEW ONLY");
    expect(review).toContain("Runtime randomizes all answer choices");
    for (const clinicalCase of paired) {
      expect(review).toContain(clinicalCase.id);
      for (const node of clinicalCase.decisionNodes) {
        expect(review).toContain(node.questionVariantId);
        expect(review).toContain(node.teachingPoint!);
        for (const answer of node.answerChoices) {
          expect(review).toContain(answer.label);
          expect(review).toContain(answer.rationale!);
        }
      }
    }
  });
});
