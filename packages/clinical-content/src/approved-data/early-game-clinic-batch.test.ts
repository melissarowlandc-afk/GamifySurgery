import { describe, expect, it } from "vitest";
import {
  EARLY_GAME_CLINIC_BATCH_BLUEPRINTS,
  EARLY_GAME_CLINIC_BATCH_CASES,
  EARLY_GAME_CLINIC_BATCH_CONCEPTS,
  EARLY_GAME_CLINIC_BATCH_EVIDENCE_CLAIMS,
  EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS,
  EARLY_GAME_CLINIC_BATCH_SOURCES,
  ROW_066_087_109_CLINICAL_APPROVALS,
} from "./early-game-clinic-batch";

const EXPECTED_VARIANTS = [
  ["question.ipaa.pouchitis.1a.v1", "concept.ipaa.pouchitis-common-post-ipaa-complication", "Patient with ulcerative colitis is considering restorative proctocolectomy with IPAA.", "Which pouch-related inflammatory complication should be described as the most common after this operation?", ["Pouchitis", "Cuffitis", "Crohn’s-like disease of the pouch"], "Pouchitis", "Pouchitis is the most common complication after restorative proctocolectomy with IPAA for UC."],
  ["question.ipaa.pouchitis.1b.v1", "concept.ipaa.pouchitis-common-post-ipaa-complication", "Patient with ulcerative colitis returns for long-term counseling after IPAA.", "Which inflammatory pouch disorder is encountered most commonly?", ["Pouchitis", "Cuffitis", "Crohn’s-like disease of the pouch"], "Pouchitis", "Pouchitis"],
  ["question.ipaa.pouchitis.1c.v1", "concept.ipaa.pouchitis-common-post-ipaa-complication", "A patient with medically refractory ulcerative colitis returns for counseling after restorative proctocolectomy with IPAA.", "Among inflammatory disorders affecting the newly created pouch, which is encountered most commonly?", ["Pouchitis", "Cuffitis", "Crohn’s-like disease of the pouch"], "Pouchitis", "Pouchitis"],
  ["question.ipaa.pouchitis.1d.v1", "concept.ipaa.pouchitis-common-post-ipaa-complication", "A patient with ulcerative colitis had IPAA several years ago and asks about recognized long-term inflammatory problems of the reconstruction.", "Which pouch-related inflammatory complication is encountered most commonly?", ["Pouchitis", "Cuffitis", "Crohn’s-like disease of the pouch"], "Pouchitis", "This asks frequency only; it does not diagnose the patient or introduce treatment."],
  ["question.choledochal-cyst.type-iva.2a.v1", "concept.choledochal-cyst.type-iva-combined-duct-dilation", "A middle-aged patient with intermittent abdominal pain and jaundice has MRCP showing multiple cystic dilatations involving both intrahepatic and extrahepatic bile ducts.", "Which Todani subtype fits?", ["Type IVA", "Type IVB", "Type V"], "Type IVA", "Type IVA includes intrahepatic and extrahepatic involvement."],
  ["question.choledochal-cyst.type-iva.2b.v1", "concept.choledochal-cyst.type-iva-combined-duct-dilation", "An adult patient has a congenital bile duct cyst (commonly called a choledochal cyst) discovered during outpatient imaging. MRCP shows multiple cystic dilatations involving intrahepatic and extrahepatic bile ducts.", "Which classification is appropriate?", ["Type IVA", "Type I", "Type IVB"], "Type IVA", "Type IVA"],
  ["question.choledochal-cyst.type-iva.2c.v1", "concept.choledochal-cyst.type-iva-combined-duct-dilation", "A patient's specialist note identifies a Type IVA congenital bile duct cyst.", "Which anatomic distribution should the clinic team expect on the reviewed imaging?", ["Multiple cystic dilatations involving both intrahepatic and extrahepatic bile ducts", "Multiple extrahepatic dilatations with normal intrahepatic ducts", "Intrahepatic dilation without extrahepatic involvement"], "Multiple cystic dilatations involving both intrahepatic and extrahepatic bile ducts", "The second pattern is IVB; intrahepatic-only disease corresponds to Type V/Caroli disease."],
  ["question.choledochal-cyst.type-iva.2d.v1", "concept.choledochal-cyst.type-iva-combined-duct-dilation", "A patient is referred after MRCP demonstrates a congenital bile duct cyst, and the clinician contrasts Type IVA with Type IVB.", "Which statement correctly identifies Type IVA?", ["It includes multiple cystic dilatations involving both intrahepatic and extrahepatic bile ducts", "It is confined to multiple extrahepatic duct dilatations", "It is confined to intrahepatic duct dilation"], "It includes multiple cystic dilatations involving both intrahepatic and extrahepatic bile ducts", "It includes multiple cystic dilatations involving both intrahepatic and extrahepatic bile ducts"],
  ["question.anal-hsil.hpv.3a.v1", "concept.anal-hsil.high-risk-hpv-association", "A patient's biopsy shows anal high-grade squamous intraepithelial lesion (anal HSIL; historically high-grade AIN).", "Which viral category is etiologically associated with this lesion?", ["High-risk human papillomavirus", "Human immunodeficiency virus", "Hepatitis C virus"], "High-risk human papillomavirus", "Anal HSIL is HPV-associated; this does not mean every HPV infection represents HSIL."],
  ["question.anal-hsil.hpv.3b.v1", "concept.anal-hsil.high-risk-hpv-association", "A patient with anal HSIL asks which virus is etiologically linked to this dysplastic lesion.", "Which answer is appropriate?", ["High-risk human papillomavirus", "Human immunodeficiency virus", "Epstein–Barr virus"], "High-risk human papillomavirus", "High-risk human papillomavirus"],
  ["question.anal-hsil.hpv.3c.v1", "concept.anal-hsil.high-risk-hpv-association", "A solid-organ transplant recipient has off-site pathology confirming anal HSIL.", "Which viral category is directly associated with the dysplastic lesion?", ["High-risk human papillomavirus", "BK polyomavirus", "Cytomegalovirus"], "High-risk human papillomavirus", "Immunosuppression is patient context; high-risk HPV is the lesion’s viral association."],
  ["question.anal-hsil.hpv.3d.v1", "concept.anal-hsil.high-risk-hpv-association", "Patient with a prior vulvar HSIL is evaluated for a new anal squamous intraepithelial lesion.", "Which persistent infection is the shared oncogenic association?", ["High-risk human papillomavirus", "Herpes simplex virus type 2", "Epstein–Barr virus"], "High-risk human papillomavirus", "High-risk human papillomavirus"],
] as const;

describe("approved early-game clinic batch", () => {
  it("preserves the three approved concepts and twelve patient-linked variants", () => {
    expect(EARLY_GAME_CLINIC_BATCH_CONCEPTS.map((concept) => concept.id)).toEqual([
      "concept.ipaa.pouchitis-common-post-ipaa-complication",
      "concept.choledochal-cyst.type-iva-combined-duct-dilation",
      "concept.anal-hsil.high-risk-hpv-association",
    ]);
    expect(EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS).toHaveLength(12);
    expect(EARLY_GAME_CLINIC_BATCH_CASES).toHaveLength(12);
    expect(EARLY_GAME_CLINIC_BATCH_BLUEPRINTS).toHaveLength(12);
  });

  it("preserves exact HPV distractors and the approved 3C order", () => {
    const variants = EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS;
    expect(
      variants.flatMap((variant) => variant.answerChoices).filter(
        (choice) => choice.label === "Human immunodeficiency virus",
      ),
    ).toHaveLength(2);
    expect(variants.find((variant) => variant.id === "question.anal-hsil.hpv.3c.v1")?.answerChoices.map((choice) => choice.label)).toEqual([
      "High-risk human papillomavirus",
      "BK polyomavirus",
      "Cytomegalovirus",
    ]);
  });

  it("keeps one correct shuffled Level 0 question per active case", () => {
    for (const clinicalCase of EARLY_GAME_CLINIC_BATCH_CASES) {
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.releasePointId).toBe("release.l0.clinic_evaluation");
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      expect(clinicalCase.decisionNodes[0]?.shuffleAnswers).toBe(true);
      expect(clinicalCase.decisionNodes[0]?.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
    }
  });

  it("keeps bidirectional provenance links and review states intact", () => {
    const claimIds = new Set(EARLY_GAME_CLINIC_BATCH_EVIDENCE_CLAIMS.map((claim) => claim.id));
    const sourceIds = new Set(EARLY_GAME_CLINIC_BATCH_SOURCES.map((source) => source.id));

    for (const source of EARLY_GAME_CLINIC_BATCH_SOURCES) {
      expect(source.reviewStatus).toBe("needs_clinician_review");
      expect(source.evidenceClaimIds.every((id) => claimIds.has(id))).toBe(true);
    }

    for (const claim of EARLY_GAME_CLINIC_BATCH_EVIDENCE_CLAIMS) {
      expect(claim.reviewStatus).toBe("needs_clinician_review");
      expect(claim.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
    }

    for (const question of EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS) {
      expect(question.reviewStatus).toBe("clinically_approved");
      expect(
        question.supportingEvidenceClaimIds.every((id) => claimIds.has(id)),
      ).toBe(true);
    }

    for (const approval of ROW_066_087_109_CLINICAL_APPROVALS) {
      expect(approval.approvedEvidenceClaimIds).toEqual([]);
    }
  });

  it("protects every approved patient-linked question from wording and linkage drift", () => {
    for (const [id, conceptId, presentation, stem, labels, correct, explanation] of EXPECTED_VARIANTS) {
      const question = EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS.find((item) => item.id === id);
      const clinicalCase = EARLY_GAME_CLINIC_BATCH_CASES.find((item) => item.id === id.replace("question.", "case.").replace(".v1", ""));
      const blueprint = EARLY_GAME_CLINIC_BATCH_BLUEPRINTS.find((item) => item.questionVariantIds.includes(id));
      expect(question).toMatchObject({ id, conceptId, stem, explanation, reviewStatus: "clinically_approved" });
      expect(question?.answerChoices.map((choice) => choice.label)).toEqual(labels);
      expect(question?.answerChoices.find((choice) => choice.isCorrect)?.label).toBe(correct);
      expect(question?.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(clinicalCase?.presentation).toBe(presentation);
      expect(clinicalCase?.decisionNodes[0]).toMatchObject({ primaryConceptId: conceptId, questionVariantId: id, shuffleAnswers: true });
      expect(clinicalCase?.releasePointId).toBe("release.l0.clinic_evaluation");
      expect(clinicalCase?.earliestFacilityStage).toBe(0);
      expect(blueprint).toMatchObject({ presentationVariantId: clinicalCase?.patientPresentationVariantId, questionVariantIds: [id], releasePointId: "release.l0.clinic_evaluation", earliestFacilityStage: 0 });
    }
  });
});
