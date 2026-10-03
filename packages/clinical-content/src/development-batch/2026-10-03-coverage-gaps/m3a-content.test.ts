import { describe, expect, it } from "vitest";
import {
  answerChoiceTimingRegistryEntrySchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
} from "../../schema";
import { BATCH_CONTENT_VERSION } from "./batch-helpers";
import { CRITICAL_CARE_FAMILY } from "./critical-care";
import { TRAUMA_FAMILIES } from "./trauma";

const families = [CRITICAL_CARE_FAMILY, ...TRAUMA_FAMILIES];
const concepts = families.flatMap((family) => family.authoringConcepts);
const questions = families.flatMap((family) => family.questions);
const cases = families.flatMap((family) => family.cases);
const timing = families.flatMap((family) => family.timingEntries);
const reviews = families.flatMap((family) => family.caseReviews);
const claims = families.flatMap((family) => family.claims);
const sources = families.flatMap((family) => family.sources);

const EXPECTED_CONCEPT_IDS = [
  "concept.ards.permeability-edema-mechanism",
  "concept.ards.predicted-body-weight-ventilation",
  "concept.blunt-cardiac-injury.ecg-troponin-evaluation",
  "concept.blunt-cardiac-injury.monitored-disposition",
  "concept.head-injury.anticoagulant-ed-ct-evaluation",
  "concept.pelvic-trauma.binder-greater-trochanter-placement",
] as const;

describe("GS-028 October 3 M3a first six coverage-gap objectives", () => {
  it("contains exactly six new objectives and twenty-four substantive variants", () => {
    expect(concepts.map((item) => item.id)).toEqual(EXPECTED_CONCEPT_IDS);
    expect(questions).toHaveLength(24);
    expect(cases).toHaveLength(24);
    expect(timing).toHaveLength(24);
    expect(reviews).toHaveLength(24);

    for (const concept of concepts) {
      const variantsForConcept = questions.filter(
        (question) => question.conceptId === concept.id,
      );
      expect(variantsForConcept, concept.id).toHaveLength(4);
      expect(
        new Set(variantsForConcept.map((question) => question.patientPresentation)),
        `${concept.id} presentations`,
      ).toHaveLength(4);
      expect(
        new Set(variantsForConcept.map((question) => question.stem)),
        `${concept.id} stems`,
      ).toHaveLength(4);
    }
  });

  it("passes runtime schemas with unique dated identifiers", () => {
    for (const concept of families.flatMap((family) => family.testedConcepts)) {
      expect(testedConceptSchema.parse(concept)).toEqual(concept);
    }
    for (const clinicalCase of cases) {
      expect(syntheticClinicalCaseSchema.parse(clinicalCase)).toEqual(clinicalCase);
      expect(clinicalCase.id).toMatch(/^case\.gs028d\./);
    }
    for (const entry of timing) {
      expect(answerChoiceTimingRegistryEntrySchema.parse(entry)).toEqual(entry);
    }

    expect(new Set(cases.map((item) => item.id))).toHaveLength(cases.length);
    expect(new Set(questions.map((item) => item.id))).toHaveLength(questions.length);
    const nodes = cases.flatMap((item) => item.decisionNodes);
    expect(new Set(nodes.map((item) => item.id))).toHaveLength(nodes.length);
  });

  it("keeps every clinical record as an unapproved October 3 draft", () => {
    for (const record of [...concepts, ...questions, ...reviews, ...claims, ...sources]) {
      expect(record.contentVersion).toBe(BATCH_CONTENT_VERSION);
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.aiAssistedDrafting).toBe(true);
      expect(record.lastClinicianReview).toBeNull();
    }
    expect(BATCH_CONTENT_VERSION).toBe(
      "development-batch.2026-10-03.coverage-gaps.1",
    );
  });

  it("makes every objective independently available at the beginning", () => {
    for (const concept of concepts) {
      expect(concept.earliestFacilityStage, concept.id).toBe(0);
      expect(
        cases.filter(
          (clinicalCase) =>
            clinicalCase.decisionNodes.length === 1 &&
            clinicalCase.decisionNodes[0]?.primaryConceptId === concept.id,
        ),
        concept.id,
      ).toHaveLength(4);
    }

    for (const clinicalCase of cases) {
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.releasePointId).toBe("release.l0.clinic_evaluation");
      expect(clinicalCase.routineEligible).toBe(true);
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
    }
  });

  it("uses generated named profiles with coherent age, sex, and short complaints", () => {
    for (const clinicalCase of cases) {
      expect(clinicalCase.patientDisplayName).toBe("{patientName}");
      expect(clinicalCase.chiefComplaint.trim().split(/\s+/).length).toBeGreaterThan(0);
      expect(clinicalCase.chiefComplaint.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(4);
      for (const profile of clinicalCase.approvedInstantiationProfiles) {
        expect(profile.presentation).toContain("{patientName}");
        expect(profile.presentation).toMatch(/\d+-year-old (woman|man|adult)/);
      }
    }
  });

  it("keeps complete prompts, shuffled choices, one key, and specific feedback", () => {
    for (const question of questions) {
      expect(question.stem.trim().endsWith("?"), question.id).toBe(true);
      expect(question.answerChoices).toHaveLength(4);
      expect(question.answerChoices.filter((choice) => choice.isCorrect), question.id).toHaveLength(1);
      const key = question.answerChoices.find((choice) => choice.isCorrect)!;
      const longestDistractor = Math.max(
        ...question.answerChoices
          .filter((choice) => !choice.isCorrect)
          .map((choice) => choice.label.length),
      );
      expect(key.label.length, `${question.id} key length`).toBeLessThanOrEqual(
        longestDistractor,
      );
      for (const distractor of question.answerChoices.filter(
        (choice) => !choice.isCorrect,
      )) {
        expect(distractor.distractorRationale?.length, question.id).toBeGreaterThan(35);
      }
    }

    for (const clinicalCase of cases) {
      for (const node of clinicalCase.decisionNodes) {
        expect(node.shuffleAnswers).toBe(true);
      }
    }
  });

  it("keeps retrospective ARDS and binder facts outside active clinic resuscitation", () => {
    const retrospective = questions.filter(
      (question) =>
        question.conceptId.startsWith("concept.ards.") ||
        question.conceptId.startsWith("concept.pelvic-trauma."),
    );
    expect(retrospective).toHaveLength(12);
    for (const question of retrospective) {
      expect(question.patientPresentation).toMatch(
        /after|record|completed|returns|follows up|recovery/i,
      );
      expect(question.patientPresentation).not.toMatch(
        /currently (intubated|ventilated)|binder is being applied in the clinic/i,
      );
    }
  });

  it("routes acute BCI and anticoagulated head injury to emergency care without clinic test gates", () => {
    const urgentConcepts = new Set([
      "concept.blunt-cardiac-injury.ecg-troponin-evaluation",
      "concept.head-injury.anticoagulant-ed-ct-evaluation",
    ]);
    const urgentQuestions = questions.filter((question) =>
      urgentConcepts.has(question.conceptId),
    );
    expect(urgentQuestions).toHaveLength(8);
    for (const question of urgentQuestions) {
      const key = question.answerChoices.find((choice) => choice.isCorrect)!;
      expect(`${question.stem} ${key.label}`).toMatch(/emergency|ED/i);
    }

    const urgentCaseIds = new Set(
      reviews.filter((review) => review.acuity === "urgent").map((review) => review.caseId),
    );
    expect(urgentCaseIds).toHaveLength(8);
    for (const clinicalCase of cases.filter((item) => urgentCaseIds.has(item.id))) {
      expect(clinicalCase.decisionNodes[0]?.resultGateAfter).toBeNull();
      expect(
        clinicalCase.decisionNodes[0]?.answerChoices.every(
          (choice) => choice.serviceRequest === null,
        ),
      ).toBe(true);
    }
  });

  it("uses neutral timing for testing choices without fictional clinic services", () => {
    expect(families.flatMap((family) => family.serviceContracts)).toEqual([]);
    for (const clinicalCase of cases) {
      for (const node of clinicalCase.decisionNodes) {
        expect(node.resultGateAfter).toBeNull();
        expect(node.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
      }
    }
    const timedEntries = timing.filter(
      (entry) => entry.classification.kind === "test_choices",
    );
    const noTestEntries = timing.filter(
      (entry) => entry.classification.kind === "no_test",
    );
    expect(timedEntries).toHaveLength(8);
    expect(noTestEntries).toHaveLength(16);

    for (const entry of timedEntries) {
      if (entry.questionVariantId.startsWith("question.blunt-cardiac-injury.ecg-troponin-evaluation.")) {
        expect(entry.classification.kind).toBe("test_choices");
        if (entry.classification.kind === "test_choices") {
          expect(entry.classification.choices).toHaveLength(4);
          expect(
            entry.classification.choices.every(
              (choice) =>
                choice.timing.kind === "test" &&
                choice.timing.timingProfileId === "timing.test.combined_diagnostic",
            ),
          ).toBe(true);
        }
      } else {
        expect(entry.questionVariantId).toMatch(
          /^question\.head-injury\.anticoagulant-ed-ct-evaluation\./,
        );
        if (entry.classification.kind === "test_choices") {
          expect(
            entry.classification.choices.filter(
              (choice) => choice.timing.kind === "test",
            ),
          ).toEqual([
            expect.objectContaining({
              timing: {
                kind: "test",
                timingProfileId: "timing.test.ct",
              },
            }),
          ]);
        }
      }
    }
  });

  it("maintains complete claim-to-source mappings and explicit source rights", () => {
    expect(claims).toHaveLength(7);
    expect(sources).toHaveLength(5);
    const sourceById = new Map(sources.map((item) => [item.id, item]));
    for (const evidenceClaim of claims) {
      expect(evidenceClaim.statement.length).toBeGreaterThan(60);
      expect(evidenceClaim.sourceIds.length).toBeGreaterThan(0);
      for (const sourceId of evidenceClaim.sourceIds) {
        expect(sourceById.get(sourceId)?.evidenceClaimIds).toContain(evidenceClaim.id);
      }
    }
    for (const source of sources) {
      expect(source.completeCitation.length).toBeGreaterThan(80);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-10-03");
      expect(source.licenseLabel.length).toBeGreaterThan(20);
      expect(source.reuseNotes).toMatch(/Original factual synthesis/i);
      expect(source.authorityAssessment.length).toBeGreaterThan(40);
      expect(source.evidenceClaimIds.length).toBeGreaterThan(0);
      expect(source.authors).not.toContain("et al.");
    }
    expect(sourceById.get("source.esicm.ards-guideline.2023")?.authors).toHaveLength(64);
    expect(sourceById.get("source.east.blunt-cardiac-injury-screening.2012")?.authors).toHaveLength(11);
    expect(sourceById.get("source.wjes.blunt-cardiac-injury-diagnostics.2023")?.authors).toHaveLength(20);
    expect(sourceById.get("source.cdc.adult-mtbi-key-recommendations")?.authors).toHaveLength(1);
    expect(sourceById.get("source.wses.pelvic-trauma-guideline.2017")?.authors).toHaveLength(30);
    for (const source of sources.filter((item) =>
      item.reuseStatus.startsWith("cc_by"),
    )) {
      expect(source.licenseLabel).toMatch(/creativecommons\.org\/licenses\//);
      expect(source.licenseLabel).toMatch(/credited/i);
      expect(source.licenseLabel).toMatch(/independently synthesized/i);
    }
  });
});
