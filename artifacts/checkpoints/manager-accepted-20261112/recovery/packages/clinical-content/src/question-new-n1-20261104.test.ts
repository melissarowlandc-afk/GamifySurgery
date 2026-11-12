import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "./answer-choice-timing";
// Preserve N1's exact assembly assertions while the separate N2 append is reviewed.
import { QUESTION_NEW_N1_PRE_RELEASE, QUESTION_NEW_N2_PRE_RELEASE as SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import { validateSyntheticClinicalRelease } from "./schema";
import { QUESTION_NEW_N1_AUTHORING_CONCEPTS as concepts, QUESTION_NEW_N1_BATCH_MANIFEST as manifest,
  QUESTION_NEW_N1_CASES as cases, QUESTION_NEW_N1_CASE_REVIEWS as reviews,
  QUESTION_NEW_N1_CLAIMS as claims, QUESTION_NEW_N1_CLAIM_PROVENANCE as provenance,
  QUESTION_NEW_N1_ITEMS as items, QUESTION_NEW_N1_QUESTIONS as questions,
  QUESTION_NEW_N1_SOURCES as sources, QUESTION_NEW_N1_STATEMENT_MAPPINGS as mappings,
  QUESTION_NEW_N1_SOURCE_LINKS as links, QUESTION_NEW_N1_TIMING_ENTRIES as timings } from "./question-new-n1-20261104";

describe("N1 newly playable clinic objectives", () => {
  it("adds forty identities with no change to a pre-N1 concept, case, question or frozen timing entry", () => {
    expect(concepts).toHaveLength(40);
    expect(new Set(concepts.map(c => c.id)).size).toBe(40);
    expect(cases).toHaveLength(40);
    expect(questions).toHaveLength(40);
    expect(concepts.filter(c => c.identityBasis === "new_decision_construct")).toHaveLength(17);
    expect(concepts.filter(c => c.identityBasis === "preserved_unadmitted_identity")).toHaveLength(23);
    const added = new Set(concepts.map(c => c.id));
    expect(QUESTION_NEW_N1_PRE_RELEASE.concepts.some(c => added.has(c.id))).toBe(false);
    expect(SYNTHETIC_CLINICAL_RELEASE.concepts.filter(c => !added.has(c.id))).toEqual(QUESTION_NEW_N1_PRE_RELEASE.concepts);
    expect(SYNTHETIC_CLINICAL_RELEASE.cases.filter(c => !c.id.startsWith("case.n1."))).toEqual(QUESTION_NEW_N1_PRE_RELEASE.cases);
    expect(() => validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE)).not.toThrow();
    expect(manifest).toMatchObject({ clinicalApproval: false, pipelinePassed: false, publicReleaseAuthorized: false });
  });

  it.each(cases.map((c, i) => [c.id, c, i] as const))("keeps %s a finite clinic draft with independent stage/tier/acuity and complete choices", (_id, clinicalCase, i) => {
    const item = items[i]!, node = clinicalCase.decisionNodes[0]!;
    expect(clinicalCase.decisionNodes).toHaveLength(1);
    expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
    expect(clinicalCase.requiredCapabilityIds).toEqual([]);
    expect(clinicalCase.earliestFacilityStage).toBe(item.level);
    expect([3, 4]).toContain(item.level);
    expect(concepts[i]).toMatchObject({ educationalTier: 1, acuity: item.acuity, reviewStatus: "needs_clinician_review", lastClinicianReview: null });
    expect(reviews[i]).toMatchObject({ reviewStatus: "needs_clinician_review", educationalTier: 1 });
    expect(questions[i]).toMatchObject({ reviewStatus: "needs_clinician_review", lastClinicianReview: null });
    expect(clinicalCase.presentation).toContain("{patientName}");
    expect(clinicalCase.presentation).toContain(`${item.age}-year-old`);
    expect(clinicalCase.prototypeDemographics).toEqual({ ageYears: item.age, sexLabel: item.sex });
    expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
    expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
    expect(clinicalCase.approvedInstantiationProfiles![0]).toMatchObject({ presentation: clinicalCase.presentation, prototypeDemographics: clinicalCase.prototypeDemographics });
    expect(node.shuffleAnswers).toBe(true);
    expect(node.answerChoices).toHaveLength(3);
    expect(node.answerChoices.filter(c => c.isCorrect)).toHaveLength(1);
    expect(node.answerChoices.every(c => c.rationale && c.serviceRequest === null)).toBe(true);
    expect(node.resultGateAfter).toBeNull();
    expect(node.terminalDispositions.every(d => d.kind === "no_terminal_outcome")).toBe(true);
    const key = node.answerChoices.find(c => c.isCorrect)!;
    expect(key.label.length).toBeLessThanOrEqual(Math.max(...node.answerChoices.filter(c => !c.isCorrect).map(c => c.label.length)));
    expect(node.answerChoices.some(c => /\balone\b|individuali[sz]ed|tailored|management assessment|treatment assessment/i.test(c.label))).toBe(false);
    expect(mappings[i]!.evidenceClaimIds.length).toBeGreaterThan(0);
    expect(item.inference && item.closestError && item.discriminator && item.counterfactual).toBeTruthy();
  });

  it("binds each offered test to an existing exact-label estimate without new clinical execution", () => {
    const profiles = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(p => p.id));
    for (const entry of timings) {
      expect(ANSWER_CHOICE_TIMING_REGISTRY.filter(r => r.caseId === entry.caseId && r.nodeId === entry.nodeId && r.questionVariantId === entry.questionVariantId)).toEqual([entry]);
      if (entry.classification.kind !== "test_choices") continue;
      for (const choice of entry.classification.choices) if (choice.timing.kind === "test")
        expect(profiles.has(choice.timing.timingProfileId), choice.timing.timingProfileId).toBe(true);
    }
    for (const clinicalCase of cases) for (const choice of clinicalCase.decisionNodes[0]!.answerChoices) {
      if (!/\b(?:biopsy|CT|MRI|mammography|sampling|assay|genotyping|serology|scintigraphy|endoscopy|manometry|duplex|oximetry|capnography|blood count)\b/i.test(choice.label)) continue;
      const classification = timings.find(t => t.caseId === clinicalCase.id)!.classification;
      expect(classification.kind, `${clinicalCase.id}/${choice.label}`).toBe("test_choices");
      if (classification.kind === "test_choices") expect(classification.choices.find(c => c.choiceId === choice.id)?.timing.kind, choice.label).toBe("test");
    }
  });

  it("retains actual source access/check dates, bidirectional claim provenance, review states and safe links", () => {
    expect(claims).toHaveLength(85);
    expect(sources).toHaveLength(68);
    const ids = new Set(claims.map(c => c.id));
    for (const claim of claims) {
      expect(claim).toMatchObject({ reviewStatus: "needs_clinician_review", lastClinicianReview: null });
      const origin = provenance.find(p => p.claimId === claim.id)!;
      expect(origin).toBeDefined();
      expect(claim.lastCheckedOn).toBe(origin.inheritedLastCheckedOn);
      expect(claim.limitation).toContain("Offline reuse");
      if (claim.sourceIds.length === 1) expect(claim.limitation).toContain("Only one recorded source");
      for (const sourceId of claim.sourceIds) expect(sources.find(s => s.id === sourceId)?.evidenceClaimIds).toContain(claim.id);
    }
    for (const source of sources) {
      for (const key of ["completeCitation", "organizationOrJournal", "accessedOn", "sourceClass", "licenseLabel", "reuseStatus", "reuseNotes", "authorityAssessment", "usageRole"] as const)
        expect(source[key], `${source.id}/${key}`).toBeTruthy();
      expect(source.officialUrl ?? source.doi).toBeTruthy();
      expect(source).toMatchObject({ reviewStatus: "needs_clinician_review", lastClinicianReview: null });
      expect(source.evidenceClaimIds.some(id => ids.has(id))).toBe(true);
    }
    expect(links.every(link => link.target === "_blank" && link.rel === "noopener noreferrer")).toBe(true);
  });
});
