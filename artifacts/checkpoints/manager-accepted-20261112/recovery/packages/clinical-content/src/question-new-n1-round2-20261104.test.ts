import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "./answer-choice-timing";
import { QUESTION_NEW_N1_ROUND2_PRE_RELEASE, QUESTION_BANK_PRE_BATCH2B_RELEASE as roundTwoRelease, QUESTION_NEW_N1_ROUND3_PRE_RELEASE as SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import { QUESTION_NEW_N1_CASES, QUESTION_NEW_N1_QUESTIONS, QUESTION_NEW_N1_SOURCES, QUESTION_NEW_N1_TIMING_ENTRIES } from "./question-new-n1-20261104";
import { QUESTION_NEW_N2_CASES } from "./question-new-n2-20261104";
import { applyQuestionNewN1Round2Revisions, QUESTION_NEW_N1_ROUND2_CASES as cases,
  QUESTION_NEW_N1_ROUND2_REVISED_CASES as revised, QUESTION_NEW_N1_ROUND2_REVISIONS as revisions,
  QUESTION_NEW_N1_ROUND2_QUESTIONS as questions, QUESTION_NEW_N1_ROUND2_CLAIMS as claims,
  QUESTION_NEW_N1_ROUND2_SOURCES as sources, QUESTION_NEW_N1_ROUND2_CLAIM_PROVENANCE as provenance,
  QUESTION_NEW_N1_ROUND2_REVIEW_TIMING as timings, QUESTION_NEW_N1_ROUND2_NEW_CONCEPT_VERSIONS as newConcepts } from "./question-new-n1-round2-20261104";

describe("N1 round-two exact independent-review revisions", () => {
  it("revises exactly the 38 returned variants in its preserved assembly while preserving both PASS, all other cohorts and old definitions", () => {
    expect(cases).toHaveLength(40);
    expect(revised).toHaveLength(38);
    expect(newConcepts).toHaveLength(6);
    expect(roundTwoRelease.cases).toHaveLength(QUESTION_NEW_N1_ROUND2_PRE_RELEASE.cases.length);
    expect(roundTwoRelease.concepts).toEqual([...QUESTION_NEW_N1_ROUND2_PRE_RELEASE.concepts, ...newConcepts]);
    const changed = new Set(revised.map(c => c.id));
    for (const old of QUESTION_NEW_N1_ROUND2_PRE_RELEASE.cases.filter(c => !changed.has(c.id)))
      expect(roundTwoRelease.cases.find(c => c.id === old.id)).toEqual(old);
    for (const old of QUESTION_NEW_N2_CASES)
      expect(roundTwoRelease.cases.find(c => c.id === old.id)).toEqual(old);
    for (const slug of ["phyllodes-benign-margin", "aldosterone-overt-phenotype"]) {
      const index = QUESTION_NEW_N1_CASES.findIndex(c => c.id === `case.n1.${slug}.v1`);
      expect(cases[index]).toEqual(QUESTION_NEW_N1_CASES[index]);
      expect(questions[index]).toEqual(QUESTION_NEW_N1_QUESTIONS[index]);
    }
    expect(QUESTION_NEW_N1_CASES.every(c => c.decisionNodes[0]!.questionVariantId.endsWith(".v1"))).toBe(true);
    expect(() => applyQuestionNewN1Round2Revisions(roundTwoRelease.cases)).toThrow("prior binding changed");
  });

  it.each(revisions.map(r => [r.slug, r] as const))("keeps %s a separate pending version with exact source/timing/finite-profile bindings", (slug, revision) => {
    const cs = revised.find(c => c.id === `case.n1.${slug}.v1`)!;
    // Later cohorts may append/project their own cases; every live N1 exact revision remains bound.
    expect(SYNTHETIC_CLINICAL_RELEASE.cases.find(c => c.id === cs.id)).toEqual(cs);
    const q = questions.find(q => q.id === cs.decisionNodes[0]!.questionVariantId)!;
    expect(q).toMatchObject({ reviewStatus: "needs_clinician_review", lastClinicianReview: null,
      contentVersion: "clinical.question-new-n1.2026-11-04.v2" });
    expect(cs.decisionNodes[0]!.primaryConceptId).toBe(revision.item.conceptId);
    expect(cs.decisionNodes[0]!.shuffleAnswers).toBe(true);
    expect(cs.decisionNodes[0]!.resultGateAfter).toBeNull();
    expect(cs.decisionNodes[0]!.answerChoices.every(c => c.serviceRequest === null)).toBe(true);
    expect(cs.approvedInstantiationProfiles).toEqual([{ id: `profile.n1.${slug}.v2`,
      prototypeDemographics: cs.prototypeDemographics, chiefComplaint: cs.chiefComplaint, presentation: cs.presentation }]);
    const timing = timings.find(t => t.caseId === cs.id)!;
    expect(ANSWER_CHOICE_TIMING_REGISTRY.filter(t => t.caseId === cs.id && t.nodeId === timing.nodeId && t.questionVariantId === q.id)).toEqual([timing]);
    if (timing.classification.kind === "test_choices") for (const choice of timing.classification.choices) {
      expect(cs.decisionNodes[0]!.answerChoices.find(c => c.id === choice.choiceId)?.label).toBe(choice.choiceLabel);
      if (choice.timing.kind === "test") {
        const profileId = choice.timing.timingProfileId;
        expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.some(p => p.id === profileId)).toBe(true);
      }
    }
    for (const id of q.supportingEvidenceClaimIds) {
      const claim = claims.find(c => c.id === id)!;
      expect(claim).toBeDefined();
      for (const sourceId of claim.sourceIds) expect(sources.find(s => s.id === sourceId)?.evidenceClaimIds).toContain(id);
    }
  });

  it("retains all old exact testing estimates and real inherited dates while dating new syntheses locally", () => {
    for (const old of QUESTION_NEW_N1_TIMING_ENTRIES)
      expect(ANSWER_CHOICE_TIMING_REGISTRY).toContainEqual(old);
    for (const source of sources) {
      const old = QUESTION_NEW_N1_SOURCES.find(s => s.id === source.id);
      if (old) {
        expect(source.accessedOn).toBe(old.accessedOn);
        expect(source.completeCitation).toBe(old.completeCitation);
        expect(source.licenseLabel).toBe(old.licenseLabel);
        expect(source.reuseStatus).toBe(old.reuseStatus);
        expect(source.authorityAssessment).toBe(old.authorityAssessment);
      }
    }
    for (const mapping of provenance) {
      const claim = claims.find(c => c.id === mapping.claimId)!;
      if (!mapping.statementUnchanged) expect(claim.lastCheckedOn).toBe("2026-11-04");
      else expect(claim.lastCheckedOn).toBe(mapping.inheritedLastCheckedOn);
    }
  });

  it("ships the three referenced original PNG schematics with their actual declared dimensions", () => {
    const images = revised.flatMap(c => c.decisionNodes.flatMap(n => n.exhibit?.kind === "image" ? [n.exhibit] : []));
    expect(images).toHaveLength(3);
    for (const asset of images) {
      const bytes = readFileSync(new URL(`../../../apps/player/public/${asset.assetPath}`, import.meta.url));
      expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect(bytes.readUInt32BE(16)).toBe(asset.width);
      expect(bytes.readUInt32BE(20)).toBe(asset.height);
    }
  });
});
