import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "../synthetic-content";
import { LEVEL_TWO_ROUTINE_CASE_IDS } from "./level-two-runtime";
import {
  ROW_054_APPROVED_BACKLOG,
  ROW_054_APPROVED_ENCOUNTER_BLUEPRINTS,
  ROW_054_CLINICAL_APPROVAL,
  ROW_054_CONCEPTS,
  ROW_054_CONTENT_VERSION,
  ROW_054_EVIDENCE_CLAIMS,
  ROW_054_QUESTION_VARIANTS,
  ROW_054_SOURCES,
} from "./trauma-vka-emergency-reversal";

const RELEASE_POINT_ID = "release.future.ed_trauma";
const REQUIRED_CLINICAL_SETTING = "hospital_or";

const EXPECTED_VARIANTS = [
  ["question.trauma-vka.emergency-reversal.v1", "presentation.trauma-vka.emergency-reversal.v1", "concept.trauma-vka.emergency-reversal-scope", "claim.trauma-vka.scope", "An older patient taking warfarin for atrial fibrillation has a pelvic fracture with ongoing retroperitoneal hemorrhage and an elevated INR.", "Which feature places this patient in the VKA-specific emergency-reversal pathway?", ["Active major bleeding combined with documented warfarin exposure", "An elevated INR considered without medication or bleeding context", "The pelvic fracture considered by itself"], "Active major bleeding combined with documented warfarin exposure", "The relevant scope combines major bleeding with documented VKA therapy."],
  ["question.trauma-vka.emergency-reversal.v2", "presentation.trauma-vka.emergency-reversal.v2", "concept.trauma-vka.emergency-reversal-scope", "claim.trauma-vka.scope", "A patient taking warfarin for a mechanical valve develops an acute traumatic subdural hematoma and has an elevated INR.", "Why does this meet the emergency VKA-reversal scope?", ["There is critical-site traumatic bleeding while the patient is taking a VKA", "The patient’s age and injury mechanism alone require VKA reversal", "Any INR elevation requires VKA reversal regardless of medication history"], "There is critical-site traumatic bleeding while the patient is taking a VKA", "Critical-site bleeding during documented VKA therapy warrants emergency reversal consideration."],
  ["question.trauma-vka.emergency-reversal.v3", "presentation.trauma-vka.emergency-reversal.v3", "concept.trauma-vka.emergency-reversal-scope", "claim.trauma-vka.scope", "A patient taking warfarin has a small controlled laceration, an elevated INR, no ongoing bleeding, and no urgent procedure planned.", "Which new finding would clearly move the case into the emergency VKA-reversal scope?", ["Major bleeding or bleeding requiring urgent intervention", "A higher INR value by itself while the patient remains stable", "Older age without a change in bleeding or procedural needs"], "Major bleeding or bleeding requiring urgent intervention", "Emergency factor replacement is scoped to major bleeding or urgent intervention, not an INR value alone."],
  ["question.trauma-vka.emergency-reversal.v4", "presentation.trauma-vka.emergency-reversal.v4", "concept.trauma-vka.emergency-reversal-scope", "claim.trauma-vka.scope", "A bleeding trauma patient has an elevated INR, but medication reconciliation confirms no VKA exposure and documents chronic liver disease.", "What is the safest conclusion?", ["INR elevation alone does not establish VKA exposure or justify automatically applying the VKA-specific regimen", "Treat every elevated INR as evidence of warfarin effect", "Classify liver-associated coagulopathy as VKA therapy"], "INR elevation alone does not establish VKA exposure or justify automatically applying the VKA-specific regimen", "The medication and clinical context must establish that the VKA pathway applies."],
  ["question.trauma-vka.emergency-reversal.v5", "presentation.trauma-vka.emergency-reversal.v5", "concept.trauma-vka.four-factor-pcc-selection", "claim.trauma-vka.pcc-selection", "A patient taking warfarin has ongoing pelvic hemorrhage, and four-factor prothrombin complex concentrate is available.", "Which product is preferred for rapid VKA factor replacement?", ["Four-factor PCC", "Fresh frozen plasma", "IV vitamin K alone"], "Four-factor PCC", "Four-factor PCC is the rapid factor-replacement component; IV vitamin K is still given concurrently."],
  ["question.trauma-vka.emergency-reversal.v6", "presentation.trauma-vka.emergency-reversal.v6", "concept.trauma-vka.four-factor-pcc-selection", "claim.trauma-vka.pcc-selection", "A patient taking warfarin has an expanding traumatic intracranial hemorrhage.", "Which anticoagulant-specific reversal product fits this medication?", ["Four-factor PCC", "Idarucizumab", "Andexanet alfa"], "Four-factor PCC", "Idarucizumab and andexanet are associated with different anticoagulant classes."],
  ["question.trauma-vka.emergency-reversal.v7", "presentation.trauma-vka.emergency-reversal.v7", "concept.trauma-vka.four-factor-pcc-selection", "claim.trauma-vka.pcc-selection", "A patient taking warfarin for prior venous thromboembolism has active intra-abdominal traumatic bleeding and an elevated INR.", "Which order specifically provides rapid replacement of the VKA-depleted clotting factors?", ["Four-factor PCC", "Platelet transfusion", "Cryoprecipitate"], "Four-factor PCC", "Platelets or cryoprecipitate may have other trauma indications, but neither is the specific rapid VKA-reversal product."],
  ["question.trauma-vka.emergency-reversal.v8", "presentation.trauma-vka.emergency-reversal.v8", "concept.trauma-vka.four-factor-pcc-selection", "claim.trauma-vka.pcc-selection", "A patient taking warfarin needs urgent operative hemorrhage control. The draft order uses plasma even though four-factor PCC is immediately available.", "What revision is preferred?", ["Use four-factor PCC for rapid VKA reversal", "Keep plasma as first choice despite PCC availability", "Substitute recombinant factor VIIa as routine VKA reversal"], "Use four-factor PCC for rapid VKA reversal", "Four-factor PCC is preferred when available; plasma is a fallback when it is unavailable."],
  ["question.trauma-vka.emergency-reversal.v9", "presentation.trauma-vka.emergency-reversal.v9", "concept.trauma-vka.concurrent-iv-vitamin-k", "claim.trauma-vka.iv-vitamin-k", "A patient taking warfarin has major traumatic bleeding and an order for four-factor PCC.", "What should be administered concurrently?", ["IV vitamin K to support ongoing restoration of vitamin-K-dependent factors", "Oral vitamin K as the emergency co-therapy", "No vitamin K because PCC is sufficient alone"], "IV vitamin K to support ongoing restoration of vitamin-K-dependent factors", "PCC provides immediate replacement, while IV vitamin K supports continued reversal."],
  ["question.trauma-vka.emergency-reversal.v10", "presentation.trauma-vka.emergency-reversal.v10", "concept.trauma-vka.concurrent-iv-vitamin-k", "claim.trauma-vka.iv-vitamin-k", "A patient taking warfarin has a traumatic hemothorax with ongoing bleeding, but only IV vitamin K is ordered.", "What immediate reversal component is missing?", ["Four-factor PCC", "No additional treatment because IV vitamin K acts immediately", "Plasma even though four-factor PCC is available"], "Four-factor PCC", "Vitamin K does not provide immediate factor replacement."],
  ["question.trauma-vka.emergency-reversal.v11", "presentation.trauma-vka.emergency-reversal.v11", "concept.trauma-vka.concurrent-iv-vitamin-k", "claim.trauma-vka.iv-vitamin-k", "A patient receives four-factor PCC for warfarin-associated traumatic bleeding, but vitamin K was omitted.", "Why should IV vitamin K be added?", ["To support renewed hepatic production of vitamin-K-dependent factors after the immediate PCC effect", "To supply platelets", "To remove warfarin directly from the circulation"], "To support renewed hepatic production of vitamin-K-dependent factors after the immediate PCC effect", "IV vitamin K supports continued reversal after PCC provides the initial factor repletion."],
  ["question.trauma-vka.emergency-reversal.v12", "presentation.trauma-vka.emergency-reversal.v12", "concept.trauma-vka.concurrent-iv-vitamin-k", "claim.trauma-vka.iv-vitamin-k", "A patient taking warfarin has a traumatic solid-organ hemorrhage requiring intervention.", "Which paired VKA-reversal regimen matches guidance?", ["Early four-factor PCC plus IV vitamin K", "Four-factor PCC alone", "IV vitamin K alone"], "Early four-factor PCC plus IV vitamin K", "The two components address immediate replacement and continued endogenous factor restoration."],
  ["question.trauma-vka.emergency-reversal.v13", "presentation.trauma-vka.emergency-reversal.v13", "concept.trauma-vka.rapid-concentrated-pcc-versus-plasma", "claim.trauma-vka.pcc-vs-plasma", "A patient taking warfarin has pelvic hemorrhage and heart failure with pulmonary congestion.", "Why is available four-factor PCC advantageous over plasma for reversal?", ["It provides more rapid, concentrated factor replacement with substantially less infusion volume", "It requires more volume and a slower infusion", "It works primarily by stimulating immediate new hepatic factor synthesis"], "It provides more rapid, concentrated factor replacement with substantially less infusion volume", "Concentration, speed, and lower volume distinguish PCC from plasma."],
  ["question.trauma-vka.emergency-reversal.v14", "presentation.trauma-vka.emergency-reversal.v14", "concept.trauma-vka.rapid-concentrated-pcc-versus-plasma", "claim.trauma-vka.pcc-vs-plasma", "A patient taking warfarin needs urgent craniotomy for traumatic intracranial bleeding.", "Which statement best explains choosing available four-factor PCC over plasma?", ["PCC can be rapidly prepared and infused, providing faster correction with less volume", "Plasma corrects the VKA effect more rapidly", "Both require comparable preparation and infusion volume"], "PCC can be rapidly prepared and infused, providing faster correction with less volume", "This tests the practical time-and-volume advantage rather than the treatment indication itself."],
  ["question.trauma-vka.emergency-reversal.v15", "presentation.trauma-vka.emergency-reversal.v15", "concept.trauma-vka.rapid-concentrated-pcc-versus-plasma", "claim.trauma-vka.pcc-vs-plasma", "A patient taking warfarin has active bleeding and worsening pulmonary edema. Both four-factor PCC and plasma are available.", "Which feature favors PCC?", ["Concentrated factor replacement in a much smaller volume", "A requirement for more infused volume than plasma", "A requirement to wait for ABO-compatible units before PCC can be used"], "Concentrated factor replacement in a much smaller volume", "PCC avoids the large-volume plasma replacement burden."],
  ["question.trauma-vka.emergency-reversal.v16", "presentation.trauma-vka.emergency-reversal.v16", "concept.trauma-vka.rapid-concentrated-pcc-versus-plasma", "claim.trauma-vka.pcc-vs-plasma", "A patient taking warfarin has major traumatic bleeding, and plasma is delayed while compatible units are prepared. Available four-factor PCC is selected alongside IV vitamin K.", "Which practical feature supports that choice?", ["It supplies concentrated factors rapidly in a smaller volume without waiting for plasma preparation", "It requires a larger volume before reversal can begin", "It acts through immediate new hepatic factor synthesis"], "It supplies concentrated factors rapidly in a smaller volume without waiting for plasma preparation", "This tests PCC delivery and volume advantages, not vitamin K’s mechanism."],
  ["question.trauma-vka.emergency-reversal.v17", "presentation.trauma-vka.emergency-reversal.v17", "concept.trauma-vka.four-factor-pcc-composition", "claim.trauma-vka.composition", "A patient taking warfarin is receiving four-factor PCC for major traumatic bleeding.", "Which clotting-factor set defines the four-factor product?", ["Factors II, VII, IX, and X", "Factors II, VIII, IX, and X", "Factors I, V, VIII, and XIII"], "Factors II, VII, IX, and X", ""],
  ["question.trauma-vka.emergency-reversal.v18", "presentation.trauma-vka.emergency-reversal.v18", "concept.trauma-vka.four-factor-pcc-composition", "claim.trauma-vka.composition", "A patient taking warfarin has traumatic intracranial bleeding. The team reviews which procoagulant factors four-factor PCC supplies.", "Which set is correct?", ["Factors II, VII, IX, and X", "Factors II, V, VII, and XII", "Factors VIII, IX, XI, and XIII"], "Factors II, VII, IX, and X", ""],
  ["question.trauma-vka.emergency-reversal.v19", "presentation.trauma-vka.emergency-reversal.v19", "concept.trauma-vka.four-factor-pcc-composition", "claim.trauma-vka.composition", "A patient taking warfarin receives four-factor PCC after a traumatic splenic bleed.", "Which factor is not one of its four named procoagulant factors?", ["Factor VIII", "Factor II", "Factor VII"], "Factor VIII", "The named set is II, VII, IX, and X."],
  ["question.trauma-vka.emergency-reversal.v20", "presentation.trauma-vka.emergency-reversal.v20", "concept.trauma-vka.four-factor-pcc-composition", "claim.trauma-vka.composition", "A patient taking warfarin has major traumatic bleeding. The pharmacist reviews factors II, IX, and X from the four-factor PCC set.", "Which factor completes the set?", ["Factor VII", "Factor VIII", "Factor XIII"], "Factor VII", "This wording avoids making broader assumptions about every three-factor product formulation."],
] as const;

const EXPECTED_CONCEPT_IDS = [
  "concept.trauma-vka.emergency-reversal-scope",
  "concept.trauma-vka.four-factor-pcc-selection",
  "concept.trauma-vka.concurrent-iv-vitamin-k",
  "concept.trauma-vka.rapid-concentrated-pcc-versus-plasma",
  "concept.trauma-vka.four-factor-pcc-composition",
] as const;

const EXPECTED_CONCEPT_CLAIM_IDS = [
  "claim.trauma-vka.scope",
  "claim.trauma-vka.pcc-selection",
  "claim.trauma-vka.iv-vitamin-k",
  "claim.trauma-vka.pcc-vs-plasma",
  "claim.trauma-vka.composition",
] as const;

describe("owner row 54 approved deferred trauma/VKA emergency reversal", () => {
  it("preserves every exact approved patient-linked question in receipt order", () => {
    expect(ROW_054_QUESTION_VARIANTS).toHaveLength(20);
    for (const [id, presentationVariantId, conceptId, claimId, patientPresentation, stem, labels, correctLabel, explanation] of EXPECTED_VARIANTS) {
      const question = ROW_054_QUESTION_VARIANTS.find((item) => item.id === id);
      expect(question).toMatchObject({ id, presentationVariantId, conceptId, patientPresentation, stem, explanation, releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", shuffleAnswers: true, reviewStatus: "clinically_approved", supportingEvidenceClaimIds: [claimId] });
      expect(question?.answerChoices.map((choice) => choice.label)).toEqual(labels);
      expect(question?.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(question?.answerChoices.find((choice) => choice.isCorrect)?.label).toBe(correctLabel);
    }
  });

  it("protects the clinician-approved product and factor-composition revisions", () => {
    const twoB = ROW_054_QUESTION_VARIANTS[5]!;
    expect(twoB.answerChoices.map((choice) => choice.label)).toEqual(["Four-factor PCC", "Idarucizumab", "Andexanet alfa"]);
    expect(twoB.answerChoices.find((choice) => choice.isCorrect)?.label).toBe("Four-factor PCC");
    expect(ROW_054_QUESTION_VARIANTS[4]?.answerChoices[1]?.label).toBe("Fresh frozen plasma");
    expect(ROW_054_QUESTION_VARIANTS[6]?.answerChoices.slice(1).map((choice) => choice.label)).toEqual(["Platelet transfusion", "Cryoprecipitate"]);
    const fiveD = ROW_054_QUESTION_VARIANTS[19]!;
    expect(fiveD.stem).not.toContain("VII");
    expect(fiveD.answerChoices.find((choice) => choice.isCorrect)?.label).toBe("Factor VII");
  });

  it("keeps all five FSRS identities deferred with four variants each", () => {
    expect(ROW_054_CONCEPTS.map((concept) => concept.id)).toEqual(EXPECTED_CONCEPT_IDS);
    expect(ROW_054_CONCEPTS.map((concept) => concept.supportingEvidenceClaimIds)).toEqual(EXPECTED_CONCEPT_CLAIM_IDS.map((claimId) => [claimId]));
    expect(ROW_054_CONCEPTS.map((concept) => ({ educationalTier: concept.educationalTier, acuity: concept.acuity, releasePointId: concept.releasePointId, earliestFacilityStage: concept.earliestFacilityStage, requiredClinicalSetting: concept.requiredClinicalSetting, currentGameEligibility: concept.currentGameEligibility }))).toEqual(Array(5).fill({ educationalTier: 1, acuity: "obvious_emergency", releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred" }));
    expect(EXPECTED_CONCEPT_IDS.map((conceptId) => ROW_054_QUESTION_VARIANTS.filter((question) => question.conceptId === conceptId).length)).toEqual([4, 4, 4, 4, 4]);
    expect(new Set(ROW_054_QUESTION_VARIANTS.map((question) => question.id)).size).toBe(20);
    expect(new Set(ROW_054_QUESTION_VARIANTS.map((question) => question.presentationVariantId)).size).toBe(20);
    expect(ROW_054_QUESTION_VARIANTS.every((question) => question.answerChoices.filter((choice) => choice.isCorrect).length === 1 && question.shuffleAnswers && question.supportingEvidenceClaimIds.length === 1)).toBe(true);
  });

  it("keeps twenty one-to-one deferred blueprints and the exact deferred backlog", () => {
    expect(ROW_054_APPROVED_ENCOUNTER_BLUEPRINTS).toHaveLength(20);
    for (const blueprint of ROW_054_APPROVED_ENCOUNTER_BLUEPRINTS) {
      expect(blueprint).toMatchObject({ releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", maximumScoredDecisionsPerEncounter: 1 });
      expect(blueprint.questionVariantIds).toHaveLength(1);
      expect(ROW_054_QUESTION_VARIANTS.some((question) => question.id === blueprint.questionVariantIds[0])).toBe(true);
    }
    expect(ROW_054_APPROVED_BACKLOG).toMatchObject({ conceptIds: EXPECTED_CONCEPT_IDS, releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", approvedForRuntime: false, tutorialEligible: false, maximumScoredDecisionsPerEncounter: 1, questionVariantIds: EXPECTED_VARIANTS.map(([id]) => id), encounterBlueprintIds: ROW_054_APPROVED_ENCOUNTER_BLUEPRINTS.map((blueprint) => blueprint.id) });
  });

  it("preserves the exact named-clinician question approval while keeping new claims unapproved", () => {
    expect(ROW_054_CLINICAL_APPROVAL).toMatchObject({ id: "approval.melissa-rowland-md.owner-row-054.2026-08-31", reviewer: "Melissa Rowland, MD", reviewerRole: "Surgeon", reviewedOn: "2026-08-31", contentVersion: ROW_054_CONTENT_VERSION, decision: "approved", approvedConceptIds: EXPECTED_CONCEPT_IDS, approvedPresentationVariantIds: EXPECTED_VARIANTS.map(([, id]) => id), approvedQuestionVariantIds: EXPECTED_VARIANTS.map(([id]) => id), approvedEvidenceClaimIds: [], approvedReleasePointIds: [RELEASE_POINT_ID] });
    expect(ROW_054_QUESTION_VARIANTS.every((question) => question.reviewStatus === "clinically_approved" && question.lastClinicianReview?.contentVersion === ROW_054_CONTENT_VERSION)).toBe(true);
    expect(ROW_054_CONCEPTS.every((concept) => concept.currentGameEligibility === "deferred")).toBe(true);
  });

  it("maintains complete bidirectional source and claim provenance without conflating review states", () => {
    const sourceIds = new Set(ROW_054_SOURCES.map((source) => source.id));
    const claimIds = new Set(ROW_054_EVIDENCE_CLAIMS.map((claim) => claim.id));
    expect(ROW_054_SOURCES).toHaveLength(4);
    expect(ROW_054_EVIDENCE_CLAIMS).toHaveLength(5);
    for (const source of ROW_054_SOURCES) {
      expect(source).toMatchObject({ reviewStatus: "needs_clinician_review", contentVersion: ROW_054_CONTENT_VERSION, lastClinicianReview: null, accessedOn: "2026-08-31" });
      expect(source.completeCitation).not.toHaveLength(0); expect(source.organizationOrJournal).not.toHaveLength(0); expect(source.authors.length).toBeGreaterThan(0); expect(source.officialUrl).toMatch(/^https:\/\//); expect(source.licenseLabel).not.toHaveLength(0); expect(source.reuseStatus).not.toHaveLength(0); expect(source.reuseNotes).not.toHaveLength(0);
      expect(source.evidenceClaimIds.every((claimId) => claimIds.has(claimId))).toBe(true);
    }
    for (const claim of ROW_054_EVIDENCE_CLAIMS) {
      expect(claim).toMatchObject({ reviewStatus: "needs_clinician_review", contentVersion: ROW_054_CONTENT_VERSION, lastClinicianReview: null, lastCheckedOn: "2026-08-31" });
      expect(claim.limitation).not.toHaveLength(0); expect(claim.sourceIds.every((sourceId) => sourceIds.has(sourceId))).toBe(true);
      expect(ROW_054_SOURCES.some((source) => (source.evidenceClaimIds as readonly string[]).includes(claim.id))).toBe(true);
    }
    expect(ROW_054_SOURCES.every((source) => source.evidenceClaimIds.every((claimId) => (ROW_054_EVIDENCE_CLAIMS.find((claim) => claim.id === claimId)?.sourceIds as readonly string[] | undefined)?.includes(source.id)))).toBe(true);
    expect(ROW_054_QUESTION_VARIANTS.every((question) => question.supportingEvidenceClaimIds.every((claimId) => claimIds.has(claimId)))).toBe(true);
  });

  it("keeps the package out of active gameplay and away from dosing or treatment-simulation payloads", () => {
    const packagePrefix = "trauma-vka.emergency-reversal";
    expect(SYNTHETIC_CLINICAL_RELEASE.concepts.some((concept) => EXPECTED_CONCEPT_IDS.includes(concept.id as typeof EXPECTED_CONCEPT_IDS[number]))).toBe(false);
    expect(SYNTHETIC_CLINICAL_RELEASE.cases.some((clinicalCase) => clinicalCase.id.includes(packagePrefix) || clinicalCase.patientPresentationVariantId.includes(packagePrefix) || clinicalCase.decisionNodes.some((node) => node.questionVariantId.includes(packagePrefix) || EXPECTED_CONCEPT_IDS.includes(node.primaryConceptId as typeof EXPECTED_CONCEPT_IDS[number])))).toBe(false);
    expect(LEVEL_TWO_ROUTINE_CASE_IDS.some((caseId) => caseId.includes(packagePrefix))).toBe(false);
    expect(JSON.stringify({ variants: ROW_054_QUESTION_VARIANTS, blueprints: ROW_054_APPROVED_ENCOUNTER_BLUEPRINTS, backlog: ROW_054_APPROVED_BACKLOG })).not.toMatch(/"(?:dose|dosing|order|orders|treatmentSimulation|treatment_simulation)"\s*:/i);
    expect(ROW_054_APPROVED_BACKLOG.deferredReason).toContain("does not authorize dosing, orders, treatment simulation");
  });
});
