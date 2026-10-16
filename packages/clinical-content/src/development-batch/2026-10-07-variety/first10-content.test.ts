import { describe, expect, it } from "vitest";
import {
  answerChoiceTimingRegistryEntrySchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
} from "../../schema";
import { BATCH_CONTENT_VERSION, CHECKED_ON } from "./batch-helpers";
import { RADIOLOGY_FAMILY } from "./radiology";
import { PHARMACOLOGY_FAMILY } from "./pharmacology";
import { PREOPERATIVE_FAMILY } from "./preoperative";
import { MIS_PRINCIPLES_FAMILY } from "./mis-principles";
import { COLLAGEN_REMODELING_FAMILY } from "./collagen-remodeling";

const families = [RADIOLOGY_FAMILY, PHARMACOLOGY_FAMILY, PREOPERATIVE_FAMILY,
  MIS_PRINCIPLES_FAMILY, COLLAGEN_REMODELING_FAMILY];
const concepts = families.flatMap((family) => family.authoringConcepts);
const questions = families.flatMap((family) => family.questions);
const cases = families.flatMap((family) => family.cases);
const timings = families.flatMap((family) => family.timingEntries);
const reviews = families.flatMap((family) => family.caseReviews);
const claims = families.flatMap((family) => family.claims);
const sources = families.flatMap((family) => family.sources);

const EXPECTED_IDS = [
  "concept.imaging.ionizing-versus-nonionizing-modalities",
  "concept.mri.device-specific-safety-verification",
  "concept.iodinated-contrast.physiologic-versus-allergic-like-reaction",
  "concept.sglt2-inhibitor.euglycemic-ketoacidosis-adverse-effect",
  "concept.naloxone.competitive-opioid-antagonist-mechanism",
  "concept.perioperative-sglt2.drug-specific-interruption",
  "concept.laparoscopy.co2-absorption-hypercarbia",
  "concept.pneumoperitoneum.context-dependent-venous-return",
  "concept.postlaparoscopy.benign-referred-shoulder-pain",
  "concept.wound-healing.type-iii-to-type-i-collagen-remodeling",
] as const;

describe("GS-028 October 7 first ten variety objectives", () => {
  it("contains the ten scoped meanings and four distinct questions for each", () => {
    expect(concepts.map((concept) => concept.id)).toEqual(EXPECTED_IDS);
    expect(questions).toHaveLength(40);
    expect(cases).toHaveLength(40);
    expect(timings).toHaveLength(cases.length);
    expect(reviews).toHaveLength(cases.length);
    for (const concept of concepts) {
      const variants = questions.filter((question) => question.conceptId === concept.id);
      expect(variants, concept.id).toHaveLength(4);
      expect(new Set(variants.map((question) => question.stem)), concept.id).toHaveLength(4);
      const clinicalContexts = variants.map((question) => question.patientPresentation
        .replace(/\d+-year-old (woman|man|adult)/, "adult"));
      expect(new Set(clinicalContexts), concept.id).toHaveLength(4);
      // A recurring longest key is a presentation cue, even when four stems differ.
      expect(variants.every((question) => {
        const key = question.answerChoices.find((choice) => choice.isCorrect)!;
        return question.answerChoices.filter((choice) => !choice.isCorrect)
          .every((choice) => key.label.length > choice.label.length);
      }), `${concept.id} consistently longest key`).toBe(false);
    }
  });

  it("passes the actual runtime schemas with unique stable identifiers", () => {
    for (const concept of families.flatMap((family) => family.testedConcepts)) {
      expect(testedConceptSchema.parse(concept)).toEqual(concept);
    }
    for (const clinicalCase of cases) {
      expect(syntheticClinicalCaseSchema.parse(clinicalCase)).toEqual(clinicalCase);
      expect(clinicalCase.id).toMatch(/^case\.gs028e\./);
    }
    for (const timing of timings) {
      expect(answerChoiceTimingRegistryEntrySchema.parse(timing)).toEqual(timing);
    }
    for (const records of [concepts, questions, cases, claims]) {
      expect(new Set(records.map((record) => record.id))).toHaveLength(records.length);
    }
    const nodes = cases.flatMap((clinicalCase) => clinicalCase.decisionNodes);
    expect(new Set(nodes.map((node) => node.id))).toHaveLength(40);
  });

  it("keeps all authoring and clinical provenance records unapproved", () => {
    expect(BATCH_CONTENT_VERSION).toBe("development-batch.2026-10-07.variety.1");
    expect(CHECKED_ON).toBe("2026-10-07");
    for (const record of [...concepts, ...questions, ...reviews, ...claims, ...sources]) {
      expect(record.contentVersion).toBe(BATCH_CONTENT_VERSION);
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.aiAssistedDrafting).toBe(true);
      expect(record.lastClinicianReview).toBeNull();
    }
    for (const record of [...concepts, ...questions, ...reviews]) {
      expect(record.agentReview.clinicianSignOff).toBe(false);
    }
  });

  it("links each teaching node to dated claims and reciprocal complete sources", () => {
    expect(new Set(sources.map((source) => source.id))).toHaveLength(17);
    for (const family of families) {
      const claimById = new Map(family.claims.map((claim) => [claim.id, claim]));
      const sourceById = new Map(family.sources.map((source) => [source.id, source]));
      for (const concept of family.authoringConcepts) {
        expect(concept.evidenceClaimIds.length, concept.id).toBeGreaterThan(0);
        for (const claimId of concept.evidenceClaimIds) expect(claimById.has(claimId), claimId).toBe(true);
      }
      for (const question of family.questions) {
        expect(question.supportingEvidenceClaimIds.length, question.id).toBeGreaterThan(0);
        for (const claimId of question.supportingEvidenceClaimIds) expect(claimById.has(claimId), claimId).toBe(true);
      }
      for (const claim of family.claims) {
        expect(claim.lastCheckedOn).toBe(CHECKED_ON);
        expect(claim.limitation?.length, claim.id).toBeGreaterThan(20);
        expect(claim.applicablePopulation.length, claim.id).toBeGreaterThan(10);
        expect(claim.sourceIds.length, claim.id).toBeGreaterThan(0);
        for (const sourceId of claim.sourceIds) {
          const source = sourceById.get(sourceId);
          expect(source, sourceId).toBeDefined();
          expect(source!.evidenceClaimIds, sourceId).toContain(claim.id);
        }
      }
      for (const source of family.sources) {
        expect(source.accessedOn).toBe(CHECKED_ON);
        expect(source.completeCitation.length, source.id).toBeGreaterThan(60);
        expect(source.organizationOrJournal.length, source.id).toBeGreaterThan(5);
        expect(source.authors.length, source.id).toBeGreaterThan(0);
        expect(source.officialUrl).toMatch(/^https:\/\//);
        expect(source.licenseLabel.length, source.id).toBeGreaterThan(20);
        expect(source.authorityAssessment.length, source.id).toBeGreaterThan(40);
        expect(source.evidenceClaimIds.length, source.id).toBeGreaterThan(0);
        for (const claimId of source.evidenceClaimIds) {
          expect(claimById.get(claimId)?.sourceIds, claimId).toContain(source.id);
        }
      }
    }
  });

  it("uses named adult profiles, explicit demographics and short complaints", () => {
    for (const clinicalCase of cases) {
      expect(clinicalCase.patientDisplayName).toBe("{patientName}");
      expect(clinicalCase.chiefComplaint.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.chiefComplaint.trim().length).toBeGreaterThan(0);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(4);
      for (const profile of clinicalCase.approvedInstantiationProfiles) {
        const demographics = profile.prototypeDemographics!;
        expect(demographics.ageYears).toBeGreaterThanOrEqual(18);
        const sexWord = demographics.sexLabel === "Female" ? "woman" : "man";
        expect(profile.presentation).toContain(`{patientName}, a ${demographics.ageYears}-year-old ${sexWord}`);
        expect(profile.presentation).not.toMatch(/\{patientAge\}|\{patientSex\}/);
      }
    }
  });

  it("uses complete prompts, one key, shuffled runtime answers and explicit feedback", () => {
    for (const question of questions) {
      expect(question.stem.endsWith("?"), question.id).toBe(true);
      expect(question.stem, question.id).toMatch(/patient|naloxone/i);
      expect(question.answerChoices).toHaveLength(4);
      const keys = question.answerChoices.filter((choice) => choice.isCorrect);
      expect(keys, question.id).toHaveLength(1);
      expect(question.explanation, question.id).toContain(`The correct answer is “${keys[0]!.label}.”`);
      expect(new Set(question.answerChoices.map((choice) => choice.label)), question.id).toHaveLength(4);
      for (const choice of question.answerChoices) {
        expect(choice.label, question.id).not.toMatch(/^Only\b|\balone$/i);
        if (!choice.isCorrect) expect(choice.distractorRationale?.length, question.id).toBeGreaterThan(20);
      }
    }
    for (const clinicalCase of cases) {
      const node = clinicalCase.decisionNodes[0]!;
      expect(node.shuffleAnswers).toBe(true);
      expect(clinicalCase.learningSummary).toBe(node.explanation);
    }
  });

  it("offers independent early clinic discussions without fictional testing gates", () => {
    for (const clinicalCase of cases) {
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.releasePointId).toBe("release.l0.clinic_evaluation");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.routineEligible).toBe(true);
      for (const node of clinicalCase.decisionNodes) {
        expect(node.resultGateAfter).toBeNull();
        for (const choice of node.answerChoices) expect(choice.serviceRequest).toBeNull();
      }
    }
    for (const timing of timings) expect(timing.classification).toEqual({ kind: "no_test" });
    for (const concept of concepts) {
      expect(cases.filter((clinicalCase) => clinicalCase.decisionNodes[0]?.primaryConceptId === concept.id)).toHaveLength(4);
    }
  });

  it("supplies ketone/acidosis evidence and urgent escalation for active SGLT2 cases", () => {
    const dkaQuestions = questions.filter((question) => question.conceptId === EXPECTED_IDS[3]);
    for (const question of dkaQuestions) {
      expect(question.patientPresentation).toMatch(/ketone/i);
      expect(question.patientPresentation).toMatch(/acidosis/i);
      expect(question.patientPresentation).toMatch(/glucose/i);
      expect(question.patientPresentation).toMatch(/empagliflozin|ertugliflozin/i);
    }
    const urgentCases = cases.filter((clinicalCase) => reviews.find((review) => review.caseId === clinicalCase.id)?.acuity === "urgent");
    expect(urgentCases).toHaveLength(2);
    for (const clinicalCase of urgentCases) {
      expect(clinicalCase.decisionNodes[0]!.primaryConceptId).toBe(EXPECTED_IDS[3]);
      expect(clinicalCase.decisionNodes[0]!.explanation).toMatch(/immediate.*(assessment|care)/i);
      expect(clinicalCase.decisionNodes[0]!.explanation).toMatch(/interrupt|stop/i);
      expect(clinicalCase.decisionNodes[0]!.resultGateAfter).toBeNull();
    }
  });

  it("keeps drug-specific minima and leaves resumption outside the scored choices", () => {
    const preop = PREOPERATIVE_FAMILY.questions;
    expect(preop[0]!.answerChoices.find((choice) => choice.isCorrect)!.label).toMatch(/(?:three|3) days/);
    expect(preop[1]!.answerChoices.find((choice) => choice.isCorrect)!.label).toMatch(/four days/);
    for (const question of preop) {
      expect(question.answerChoices.map((choice) => choice.label).join(" ")).not.toMatch(/resume|restart/i);
      expect(question.patientPresentation).toMatch(/elective/i);
    }
    expect(preop[3]!.explanation).toMatch(/clinically stable.*oral intake/);
  });

  it("keeps laparoscopy retrospective and shoulder teaching within benign context", () => {
    for (const question of MIS_PRINCIPLES_FAMILY.questions) {
      expect(question.patientPresentation).toMatch(/outside/i);
      expect(question.patientPresentation).not.toMatch(/currently (ventilated|intubated)|in the operating room now/i);
    }
    const shoulder = MIS_PRINCIPLES_FAMILY.questions.filter((question) => question.conceptId === EXPECTED_IDS[8]);
    for (const question of shoulder) {
      const presentation = question.patientPresentation;
      expect(presentation).toMatch(/mild/i);
      expect(presentation).toMatch(/improving|resolved|fading/i);
      expect(presentation).toMatch(/normal shoulder motion/);
      expect(presentation).toMatch(/vital signs/i);
      expect(presentation).toMatch(/abdomen|abdominal/);
      for (const feature of ["dyspnea", "fever", "vomiting", "jaundice", "wound"]) {
        expect(presentation, `${question.id}: ${feature}`).toContain(feature);
        expect(question.explanation, `${question.id} feedback: ${feature}`).toMatch(feature === "dyspnea" ? /dyspnea|breathing/i : new RegExp(feature, "i"));
      }
    }
    const returnClaim = claims.find((claim) => claim.id.endsWith("caval-compression-venous-return"))!;
    expect(returnClaim.statement).toMatch(/possible|can/);
    expect(returnClaim.limitation).toMatch(/universal|automatic/);
  });
});
