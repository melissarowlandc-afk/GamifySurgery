import { describe, expect, it } from "vitest";
import {
  ROW_062_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_062_CASES,
  ROW_062_CLINICAL_APPROVAL,
  ROW_062_CONCEPTS,
  ROW_062_EVIDENCE_CLAIMS,
  ROW_062_QUESTION_VARIANTS,
  ROW_062_SOURCES,
} from "./men2a-clinic-batch";

const EXPECTED_VARIANTS = [
 ["1a","concept.men2a.core-manifestation-pattern","An adult patient with medullary thyroid carcinoma is also found to have a pheochromocytoma and PTH-dependent hypercalcemia.","Which inherited syndrome best fits this combination?",["Multiple endocrine neoplasia type 1","Multiple endocrine neoplasia type 2A","Multiple endocrine neoplasia type 2B"],"Multiple endocrine neoplasia type 2A","Multiple endocrine neoplasia type 2A"],
 ["1b","concept.men2a.core-manifestation-pattern","A patient with confirmed MEN2A is being counseled after medullary thyroid carcinoma is diagnosed.","Which pair of additional manifestations belongs to the syndrome’s core pattern?",["Mucosal neuromas and intestinal ganglioneuromatosis","Pheochromocytoma and primary hyperparathyroidism","Pituitary adenoma and pancreatic neuroendocrine tumor"],"Pheochromocytoma and primary hyperparathyroidism","Pheochromocytoma and primary hyperparathyroidism"],
 ["1c","concept.men2a.core-manifestation-pattern","A patient from a family affected by medullary thyroid carcinoma and pheochromocytoma now has hypercalcemia with an inappropriately elevated PTH level.","Which MEN phenotype best explains this pattern?",["Multiple endocrine neoplasia type 2B","Multiple endocrine neoplasia type 1","Multiple endocrine neoplasia type 2A"],"Multiple endocrine neoplasia type 2A","Multiple endocrine neoplasia type 2A"],
 ["1d","concept.men2a.core-manifestation-pattern","A patient undergoing evaluation for an MEN2A phenotype has pheochromocytoma and primary hyperparathyroidism.","Which thyroid malignancy completes the characteristic disease pattern?",["Follicular thyroid carcinoma","Medullary thyroid carcinoma","Papillary thyroid carcinoma"],"Medullary thyroid carcinoma","Medullary thyroid carcinoma"],
 ["2a","concept.men2a.pheochromocytoma-precedes-thyroid-intervention","A patient with MEN2A and medullary thyroid carcinoma is preparing for thyroid surgery. Testing also confirms a functioning pheochromocytoma.","Which sequence is safest?",["Proceed with thyroid surgery before addressing the pheochromocytoma","Address the pheochromocytoma before proceeding with thyroid surgery","Perform both operations without assigning either condition priority"],"Address the pheochromocytoma before proceeding with thyroid surgery","Address the pheochromocytoma before proceeding with thyroid surgery"],
 ["2b","concept.men2a.pheochromocytoma-precedes-thyroid-intervention","An asymptomatic patient with hereditary medullary thyroid carcinoma has completed the neck evaluation and is preparing for thyroid intervention.","Which occult condition must be excluded before proceeding?",["A functioning pheochromocytoma","An insulin-secreting pancreatic tumor","A functioning pituitary adenoma"],"A functioning pheochromocytoma","A functioning pheochromocytoma. Absence of classic symptoms does not remove the perioperative concern."],
 ["2c","concept.men2a.pheochromocytoma-precedes-thyroid-intervention","A patient with MEN2A has both medullary thyroid carcinoma and a biochemically confirmed pheochromocytoma. The thyroid operation is already scheduled.","Which modification is most appropriate?",["Proceed with thyroid surgery because the thyroid malignancy was identified first","Perform both operations without establishing a sequence","Defer thyroid surgery until the pheochromocytoma is addressed"],"Defer thyroid surgery until the pheochromocytoma is addressed","Defer thyroid surgery until the pheochromocytoma is addressed"],
 ["2d","concept.men2a.pheochromocytoma-precedes-thyroid-intervention","A patient with MEN2A asks why a confirmed pheochromocytoma changes the order of the planned endocrine operations.","Which explanation is most accurate?",["It can compromise interpretation of the thyroid pathology","It can precipitate a dangerous perioperative catecholamine crisis","It can impair healing of the cervical incision"],"It can precipitate a dangerous perioperative catecholamine crisis","It can precipitate a dangerous perioperative catecholamine crisis"],
 ["3a","concept.pheochromocytoma.alpha-before-beta-blockade","A patient with a functioning pheochromocytoma is being prepared for surgery. Because tachycardia persists, the specialist plans to use both alpha- and beta-adrenergic blockade.","Which order is appropriate?",["Establish alpha blockade before adding beta blockade","Establish beta blockade before adding alpha blockade","Begin alpha and beta blockade simultaneously"],"Establish alpha blockade before adding beta blockade","Establish alpha blockade before adding beta blockade"],
 ["3b","concept.pheochromocytoma.alpha-before-beta-blockade","A patient with MEN2A and a functioning pheochromocytoma has a draft medication plan that starts beta blockade before alpha blockade. Both drug classes are expected to be needed.","Which correction is appropriate?",["Establish beta blockade, then add alpha blockade","Establish both forms of blockade at the same time","Establish alpha blockade, then add beta blockade"],"Establish alpha blockade, then add beta blockade","Establish alpha blockade, then add beta blockade"],
 ["3c","concept.pheochromocytoma.alpha-before-beta-blockade","A patient with a functioning pheochromocytoma has adequate alpha blockade established, but clinically significant tachycardia persists. The specialist decides that beta blockade is indicated.","Which next step is consistent with the required sequence?",["Replace alpha blockade with beta blockade","Add beta blockade to the established alpha blockade","Delay beta blockade until after tumor resection"],"Add beta blockade to the established alpha blockade","Add beta blockade to the established alpha blockade"],
 ["3d","concept.pheochromocytoma.alpha-before-beta-blockade","A patient with a functioning pheochromocytoma inadvertently receives beta blockade before alpha blockade.","Why can this be dangerous?",["Unopposed beta-adrenergic stimulation can provoke severe tachycardia","Unopposed alpha-adrenergic vasoconstriction can provoke severe hypertension","Unopposed dopaminergic vasodilation can provoke severe hypotension"],"Unopposed alpha-adrenergic vasoconstriction can provoke severe hypertension","Unopposed alpha-adrenergic vasoconstriction can provoke severe hypertension"],
] as const;

describe("approved row 62 MEN2A clinic batch", () => {
  it("preserves the three stable concepts and twelve approved patient-linked variants", () => {
    expect(ROW_062_CONCEPTS.map((concept) => concept.id)).toEqual([
      "concept.men2a.core-manifestation-pattern",
      "concept.men2a.pheochromocytoma-precedes-thyroid-intervention",
      "concept.pheochromocytoma.alpha-before-beta-blockade",
    ]);
    expect(ROW_062_QUESTION_VARIANTS).toHaveLength(12);
    expect(ROW_062_CASES).toHaveLength(12);
    expect(ROW_062_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(12);
  });

  it("preserves corrected 2B without its deleted cueing sentence", () => {
    const variant = ROW_062_QUESTION_VARIANTS.find((candidate) => candidate.id === "question.men2a.2b.v1");
    expect(variant?.stem).toBe("Which occult condition must be excluded before proceeding?");
    expect(variant?.answerChoices.map((choice) => choice.label)).toEqual([
      "A functioning pheochromocytoma",
      "An insulin-secreting pancreatic tumor",
      "A functioning pituitary adenoma",
    ]);
    expect(variant?.stem).not.toContain("record contains no pheochromocytoma evaluation");
  });

  it("keeps each active case Level 0, shuffled, and limited to one primary concept", () => {
    for (const clinicalCase of ROW_062_CASES) {
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.releasePointId).toBe("release.l0.clinic_evaluation");
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      expect(clinicalCase.decisionNodes[0]?.shuffleAnswers).toBe(true);
      expect(clinicalCase.decisionNodes[0]?.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
    }
  });

  it("keeps bidirectional provenance links and review states intact", () => {
    const claimIds = new Set(ROW_062_EVIDENCE_CLAIMS.map((claim) => claim.id));
    const sourceIds = new Set(ROW_062_SOURCES.map((source) => source.id));

    for (const source of ROW_062_SOURCES) {
      expect(source.reviewStatus).toBe("needs_clinician_review");
      expect(source.evidenceClaimIds.every((id) => claimIds.has(id))).toBe(true);
    }
    expect(ROW_062_SOURCES.map((source) => [source.id, source.sourceClass])).toEqual([
      ["source.gene-reviews.men2.2023", "open_educational_resource"],
      ["source.ata.mtc-guideline.2015", "professional_society_guideline"],
      ["source.endocrine-society.ppgl-guideline.2014", "professional_society_guideline"],
      ["source.jes.ppgl-guideline.2026", "professional_society_guideline"],
    ]);

    for (const claim of ROW_062_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("needs_clinician_review");
      expect(claim.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
    }

    for (const question of ROW_062_QUESTION_VARIANTS) {
      expect(question.reviewStatus).toBe("clinically_approved");
      expect(
        question.supportingEvidenceClaimIds.every((id) => claimIds.has(id)),
      ).toBe(true);
    }

    expect(ROW_062_CLINICAL_APPROVAL.approvedEvidenceClaimIds).toEqual([]);
  });

  it("preserves every exact approved MEN2A variant and its active links", () => {
    for (const [suffix, conceptId, presentation, stem, labels, correct, explanation] of EXPECTED_VARIANTS) {
      const questionId = `question.men2a.${suffix}.v1`;
      const question = ROW_062_QUESTION_VARIANTS.find((item) => item.id === questionId);
      const clinicalCase = ROW_062_CASES.find((item) => item.id === `case.men2a.${suffix}`);
      const blueprint = ROW_062_APPROVED_ENCOUNTER_BLUEPRINTS.find((item) => item.id === `blueprint.men2a.${suffix}`);
      expect(question).toMatchObject({ id: questionId, conceptId, stem, explanation, reviewStatus: "clinically_approved" });
      expect(question?.answerChoices.map((choice) => choice.label)).toEqual(labels);
      expect(question?.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(question?.answerChoices.find((choice) => choice.isCorrect)?.label).toBe(correct);
      expect(clinicalCase?.presentation).toBe(presentation);
      expect(clinicalCase?.decisionNodes[0]).toMatchObject({ id: `node.men2a.${suffix}`, primaryConceptId: conceptId, questionVariantId: questionId, shuffleAnswers: true });
      expect(clinicalCase).toMatchObject({ id: `case.men2a.${suffix}`, releasePointId: "release.l0.clinic_evaluation", earliestFacilityStage: 0 });
      expect(blueprint).toMatchObject({ presentationVariantId: clinicalCase?.patientPresentationVariantId, questionVariantIds: [questionId], releasePointId: "release.l0.clinic_evaluation", earliestFacilityStage: 0 });
    }
    const twoB = ROW_062_CASES.find((item) => item.id === "case.men2a.2b");
    expect(`${twoB?.presentation} ${twoB?.decisionNodes[0]?.stem}`).not.toContain("The record contains no pheochromocytoma evaluation.");
    expect(ROW_062_QUESTION_VARIANTS.find((item) => item.id === "question.men2a.1b.v1")?.stem).toContain("syndrome’s");
  });
});
