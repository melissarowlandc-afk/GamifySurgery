import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";

export const ROW_054_CONTENT_VERSION = "clinical.owner-row-054.2026-08-31.1";
const RELEASE_POINT_ID = "release.future.ed_trauma" as const;
const REQUIRED_CLINICAL_SETTING = "hospital_or" as const;

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_054_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-31",
    contentVersion: ROW_054_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_054_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const CONCEPT_IDS = {
  emergencyReversalScope: "concept.trauma-vka.emergency-reversal-scope",
  fourFactorPccSelection: "concept.trauma-vka.four-factor-pcc-selection",
  concurrentIvVitaminK: "concept.trauma-vka.concurrent-iv-vitamin-k",
  rapidConcentratedPccVersusPlasma:
    "concept.trauma-vka.rapid-concentrated-pcc-versus-plasma",
  fourFactorPccComposition: "concept.trauma-vka.four-factor-pcc-composition",
} as const;

const CLAIM_IDS = {
  scope: "claim.trauma-vka.scope",
  pccSelection: "claim.trauma-vka.pcc-selection",
  ivVitaminK: "claim.trauma-vka.iv-vitamin-k",
  pccVsPlasma: "claim.trauma-vka.pcc-vs-plasma",
  composition: "claim.trauma-vka.composition",
} as const;

const ALL_CONCEPT_IDS = Object.values(CONCEPT_IDS);

export const ROW_054_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-054.2026-08-31",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-31",
  contentVersion: ROW_054_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (3).xlsx",
    sheetName: "Sheet1",
    sourceRow: 54,
    sourceRecordKey: "owner-concept.sheet1.row-054",
    exactApprovalConversationDate: "2026-08-31",
  },
  approvedConceptIds: ALL_CONCEPT_IDS,
  approvedConceptTypes: ["management", "applied_science"],
  approvedPresentationVariantIds: Array.from({ length: 20 }, (_, index) =>
    `presentation.trauma-vka.emergency-reversal.v${index + 1}`,
  ),
  approvedQuestionVariantIds: Array.from({ length: 20 }, (_, index) =>
    `question.trauma-vka.emergency-reversal.v${index + 1}`,
  ),
  approvedEvidenceClaimIds: [],
  approvedReleasePointIds: [RELEASE_POINT_ID],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "five_fsrs_identities",
    "twenty_patient_linked_question_variants",
    "future_ed_trauma_context_only",
    "answer_order_shuffling",
    "one_primary_concept_per_question",
  ],
  deferredElements: [
    "runtime_admission",
    "onsite_operation",
    "dosing",
    "orders",
    "treatment_simulation",
    "hemorrhage_control_or_resuscitation_replacement",
  ],
} as const;

export const ROW_054_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.rossaint.trauma-bleeding.2023",
    title: "The European guideline on management of major bleeding and coagulopathy following trauma: sixth edition",
    completeCitation: "Rossaint R, Afshari A, Bouillon B, et al. The European guideline on management of major bleeding and coagulopathy following trauma: sixth edition. Critical Care. 2023;27:80. doi:10.1186/s13054-023-04327-7. PMID: 36859355. PMCID: PMC9977110.",
    organizationOrJournal: "Critical Care",
    authors: ["R Rossaint", "A Afshari", "B Bouillon", "et al."],
    publicationYear: 2023,
    doi: "10.1186/s13054-023-04327-7",
    pmid: "36859355",
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9977110/",
    accessedOn: "2026-08-31",
    sourceClass: "peer_reviewed_guideline",
    licenseLabel: "Open-access article; reuse status requires verification",
    reuseStatus: "metadata_only_rights_reserved",
    reuseNotes: "Use only for targeted factual verification and independently written synthesis. Do not reproduce source prose, tables, figures, or algorithms until reuse terms are verified.",
    authorityAssessment: "European multidisciplinary trauma guideline; high authority for trauma bleeding and VKA-reversal context.",
    usageRole: "both",
    evidenceClaimIds: [CLAIM_IDS.scope, CLAIM_IDS.pccSelection, CLAIM_IDS.ivVitaminK],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.tomaselli.acc-oac-bleeding.2020",
    title: "2020 ACC Expert Consensus Decision Pathway on Management of Bleeding in Patients on Oral Anticoagulants",
    completeCitation: "Tomaselli GF, Mahaffey KW, Cuker A, Dobesh PP, Doherty JU, Eikelboom JW, Florido R, Gluckman TJ, Hucker WJ, Mehran R, Messé SR, Perino AC, Rodriguez F, Sarode R, Siegal DM, Wiggins BS. 2020 ACC Expert Consensus Decision Pathway on Management of Bleeding in Patients on Oral Anticoagulants. J Am Coll Cardiol. 2020;76(5):594-622. doi:10.1016/j.jacc.2020.04.053. PMID: 32680646.",
    organizationOrJournal: "American College of Cardiology; Journal of the American College of Cardiology",
    authors: ["G F Tomaselli", "K W Mahaffey", "A Cuker", "P P Dobesh", "J U Doherty", "J W Eikelboom", "R Florido", "T J Gluckman", "W J Hucker", "R Mehran", "S R Messé", "A C Perino", "F Rodriguez", "R Sarode", "D M Siegal", "B S Wiggins"],
    publicationYear: 2020,
    doi: "10.1016/j.jacc.2020.04.053",
    pmid: "32680646",
    officialUrl: "https://www.jacc.org/doi/10.1016/j.jacc.2020.04.053",
    accessedOn: "2026-08-31",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted; targeted verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Use only for targeted factual verification and independently written synthesis. Do not reproduce source prose, tables, figures, or algorithms.",
    authorityAssessment: "ACC expert consensus; high authority for anticoagulant-specific reversal framing.",
    usageRole: "both",
    evidenceClaimIds: [CLAIM_IDS.scope, CLAIM_IDS.pccSelection, CLAIM_IDS.ivVitaminK, CLAIM_IDS.pccVsPlasma, CLAIM_IDS.composition],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.fda.kcentra.2023",
    title: "Kcentra",
    completeCitation: "U.S. Food and Drug Administration. Kcentra. 2023 approval information and prescribing-information locator.",
    organizationOrJournal: "U.S. Food and Drug Administration",
    authors: ["U.S. Food and Drug Administration"],
    publicationYear: 2023,
    doi: null,
    pmid: null,
    officialUrl: "https://www.fda.gov/vaccines-blood-biologics/approved-blood-products/kcentra",
    accessedOn: "2026-08-31",
    sourceClass: "government_guidance",
    licenseLabel: "U.S. government work; public-domain conditions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "Use only for targeted factual verification and independently written synthesis. Check FDA page-specific notices before reuse.",
    authorityAssessment: "U.S. regulatory product information; high authority for labeled VKA urgent-reversal indication and product identity.",
    usageRole: "both",
    evidenceClaimIds: [CLAIM_IDS.scope, CLAIM_IDS.pccSelection, CLAIM_IDS.composition],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.acs.tbi.2024",
    title: "Best Practices Guidelines for the Management of Traumatic Brain Injury",
    completeCitation: "American College of Surgeons Trauma Quality Programs. Best Practices Guidelines for the Management of Traumatic Brain Injury. 2024.",
    organizationOrJournal: "American College of Surgeons Trauma Quality Programs",
    authors: ["American College of Surgeons Trauma Quality Programs"],
    publicationYear: 2024,
    doi: null,
    pmid: null,
    officialUrl: "https://www.facs.org/quality-programs/trauma/quality/best-practices-guidelines/",
    accessedOn: "2026-08-31",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted; targeted verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Use only for targeted factual verification and independently written synthesis. Do not reproduce source prose, tables, figures, or algorithms.",
    authorityAssessment: "Professional trauma guidance; high authority for traumatic intracranial-bleeding context.",
    usageRole: "cross_check",
    evidenceClaimIds: [CLAIM_IDS.scope, CLAIM_IDS.pccSelection],
  },
] satisfies ClinicalSource[];

export const ROW_054_EVIDENCE_CLAIMS = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: CLAIM_IDS.scope,
    statement: "Emergency VKA reversal teaching is limited to documented VKA/warfarin exposure with major or critical-site traumatic bleeding or an urgent intervention; an elevated INR alone does not establish that medication-specific pathway.",
    sourceIds: [ROW_054_SOURCES[0]!.id, ROW_054_SOURCES[1]!.id, ROW_054_SOURCES[2]!.id, ROW_054_SOURCES[3]!.id],
    evidenceCategory: "safety_boundary",
    certainty: "high",
    limitation: "Does not define all causes or management of INR elevation.",
    applicablePopulation: "Patients with documented VKA/warfarin exposure and traumatic major or critical-site bleeding, or an urgent intervention.",
    lastCheckedOn: "2026-08-31",
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: CLAIM_IDS.pccSelection,
    statement: "In the approved VKA emergency-reversal scope, 4F-PCC is the rapid clotting-factor replacement product; plasma is a fallback when 4F-PCC is unavailable.",
    sourceIds: [ROW_054_SOURCES[0]!.id, ROW_054_SOURCES[1]!.id, ROW_054_SOURCES[2]!.id, ROW_054_SOURCES[3]!.id],
    evidenceCategory: "management",
    certainty: "high",
    limitation: "Does not provide dose, inventory, or patient-specific prescribing instructions.",
    applicablePopulation: "Patients within the approved VKA emergency-reversal teaching scope.",
    lastCheckedOn: "2026-08-31",
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: CLAIM_IDS.ivVitaminK,
    statement: "IV vitamin K is paired with PCC in the approved VKA emergency-reversal teaching because vitamin K does not supply the immediate factor replacement provided by PCC.",
    sourceIds: [ROW_054_SOURCES[0]!.id, ROW_054_SOURCES[1]!.id],
    evidenceCategory: "management",
    certainty: "high",
    limitation: "No timing or dosing instruction is encoded.",
    applicablePopulation: "Patients within the approved VKA emergency-reversal teaching scope.",
    lastCheckedOn: "2026-08-31",
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: CLAIM_IDS.pccVsPlasma,
    statement: "Available 4F-PCC provides concentrated factor replacement with less infusion volume and more rapid preparation or administration than plasma in the approved VKA-reversal comparison.",
    sourceIds: [ROW_054_SOURCES[1]!.id],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation: "Does not replace hemorrhage control, resuscitation, or local protocol.",
    applicablePopulation: "Patients within the approved VKA emergency-reversal teaching scope when 4F-PCC and plasma are available.",
    lastCheckedOn: "2026-08-31",
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: CLAIM_IDS.composition,
    statement: "The named procoagulant factors in the approved 4F-PCC teaching set are II, VII, IX, and X.",
    sourceIds: [ROW_054_SOURCES[1]!.id, ROW_054_SOURCES[2]!.id],
    evidenceCategory: "definition",
    certainty: "high",
    limitation: "Formulation details beyond the named teaching set are out of scope.",
    applicablePopulation: "Patients within the approved VKA emergency-reversal teaching scope.",
    lastCheckedOn: "2026-08-31",
  },
] satisfies EvidenceClaim[];

type DeferredTraumaVkaConcept = {
  id: string;
  displayName: string;
  learningObjective: string;
  conceptType: "management" | "applied_science";
  educationalTier: 1;
  acuity: "obvious_emergency";
  requiredFacilityCapabilityIds: readonly [];
  releasePointId: typeof RELEASE_POINT_ID;
  earliestFacilityStage: null;
  requiredClinicalSetting: typeof REQUIRED_CLINICAL_SETTING;
  currentGameEligibility: "deferred";
  supportingEvidenceClaimIds: readonly string[];
};

export const ROW_054_CONCEPTS = [
  { id: CONCEPT_IDS.emergencyReversalScope, displayName: "Emergency VKA-reversal scope", learningObjective: "Recognize the documented VKA exposure and bleeding or urgent-intervention scope for this emergency teaching.", conceptType: "management", educationalTier: 1, acuity: "obvious_emergency", requiredFacilityCapabilityIds: [], releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", supportingEvidenceClaimIds: [CLAIM_IDS.scope] },
  { id: CONCEPT_IDS.fourFactorPccSelection, displayName: "Four-factor PCC selection for VKA reversal", learningObjective: "Identify four-factor PCC as the approved rapid VKA factor-replacement product.", conceptType: "management", educationalTier: 1, acuity: "obvious_emergency", requiredFacilityCapabilityIds: [], releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", supportingEvidenceClaimIds: [CLAIM_IDS.pccSelection] },
  { id: CONCEPT_IDS.concurrentIvVitaminK, displayName: "Concurrent IV vitamin K with PCC", learningObjective: "Recognize the approved paired IV vitamin K and PCC teaching point.", conceptType: "management", educationalTier: 1, acuity: "obvious_emergency", requiredFacilityCapabilityIds: [], releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", supportingEvidenceClaimIds: [CLAIM_IDS.ivVitaminK] },
  { id: CONCEPT_IDS.rapidConcentratedPccVersusPlasma, displayName: "Rapid concentrated PCC versus plasma", learningObjective: "Identify the approved rapid, concentrated, lower-volume PCC comparison with plasma.", conceptType: "management", educationalTier: 1, acuity: "obvious_emergency", requiredFacilityCapabilityIds: [], releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", supportingEvidenceClaimIds: [CLAIM_IDS.pccVsPlasma] },
  { id: CONCEPT_IDS.fourFactorPccComposition, displayName: "Four-factor PCC composition", learningObjective: "Identify the named procoagulant factors in the four-factor PCC teaching set.", conceptType: "applied_science", educationalTier: 1, acuity: "obvious_emergency", requiredFacilityCapabilityIds: [], releasePointId: RELEASE_POINT_ID, earliestFacilityStage: null, requiredClinicalSetting: REQUIRED_CLINICAL_SETTING, currentGameEligibility: "deferred", supportingEvidenceClaimIds: [CLAIM_IDS.composition] },
] satisfies readonly DeferredTraumaVkaConcept[];

type QuestionSpec = readonly [
  conceptId: string,
  claimId: string,
  patientPresentation: string,
  stem: string,
  labels: readonly [string, string, string],
  correctIndex: 0 | 1 | 2,
  explanation: string,
];

const QUESTION_SPECS = [
  [CONCEPT_IDS.emergencyReversalScope, CLAIM_IDS.scope, "An older patient taking warfarin for atrial fibrillation has a pelvic fracture with ongoing retroperitoneal hemorrhage and an elevated INR.", "Which feature places this patient in the VKA-specific emergency-reversal pathway?", ["Active major bleeding combined with documented warfarin exposure", "An elevated INR considered without medication or bleeding context", "The pelvic fracture considered by itself"], 0, "The relevant scope combines major bleeding with documented VKA therapy."],
  [CONCEPT_IDS.emergencyReversalScope, CLAIM_IDS.scope, "A patient taking warfarin for a mechanical valve develops an acute traumatic subdural hematoma and has an elevated INR.", "Why does this meet the emergency VKA-reversal scope?", ["There is critical-site traumatic bleeding while the patient is taking a VKA", "The patient’s age and injury mechanism alone require VKA reversal", "Any INR elevation requires VKA reversal regardless of medication history"], 0, "Critical-site bleeding during documented VKA therapy warrants emergency reversal consideration."],
  [CONCEPT_IDS.emergencyReversalScope, CLAIM_IDS.scope, "A patient taking warfarin has a small controlled laceration, an elevated INR, no ongoing bleeding, and no urgent procedure planned.", "Which new finding would clearly move the case into the emergency VKA-reversal scope?", ["Major bleeding or bleeding requiring urgent intervention", "A higher INR value by itself while the patient remains stable", "Older age without a change in bleeding or procedural needs"], 0, "Emergency factor replacement is scoped to major bleeding or urgent intervention, not an INR value alone."],
  [CONCEPT_IDS.emergencyReversalScope, CLAIM_IDS.scope, "A bleeding trauma patient has an elevated INR, but medication reconciliation confirms no VKA exposure and documents chronic liver disease.", "What is the safest conclusion?", ["INR elevation alone does not establish VKA exposure or justify automatically applying the VKA-specific regimen", "Treat every elevated INR as evidence of warfarin effect", "Classify liver-associated coagulopathy as VKA therapy"], 0, "The medication and clinical context must establish that the VKA pathway applies."],
  [CONCEPT_IDS.fourFactorPccSelection, CLAIM_IDS.pccSelection, "A patient taking warfarin has ongoing pelvic hemorrhage, and four-factor prothrombin complex concentrate is available.", "Which product is preferred for rapid VKA factor replacement?", ["Four-factor PCC", "Fresh frozen plasma", "IV vitamin K alone"], 0, "Four-factor PCC is the rapid factor-replacement component; IV vitamin K is still given concurrently."],
  [CONCEPT_IDS.fourFactorPccSelection, CLAIM_IDS.pccSelection, "A patient taking warfarin has an expanding traumatic intracranial hemorrhage.", "Which anticoagulant-specific reversal product fits this medication?", ["Four-factor PCC", "Idarucizumab", "Andexanet alfa"], 0, "Idarucizumab and andexanet are associated with different anticoagulant classes."],
  [CONCEPT_IDS.fourFactorPccSelection, CLAIM_IDS.pccSelection, "A patient taking warfarin for prior venous thromboembolism has active intra-abdominal traumatic bleeding and an elevated INR.", "Which order specifically provides rapid replacement of the VKA-depleted clotting factors?", ["Four-factor PCC", "Platelet transfusion", "Cryoprecipitate"], 0, "Platelets or cryoprecipitate may have other trauma indications, but neither is the specific rapid VKA-reversal product."],
  [CONCEPT_IDS.fourFactorPccSelection, CLAIM_IDS.pccSelection, "A patient taking warfarin needs urgent operative hemorrhage control. The draft order uses plasma even though four-factor PCC is immediately available.", "What revision is preferred?", ["Use four-factor PCC for rapid VKA reversal", "Keep plasma as first choice despite PCC availability", "Substitute recombinant factor VIIa as routine VKA reversal"], 0, "Four-factor PCC is preferred when available; plasma is a fallback when it is unavailable."],
  [CONCEPT_IDS.concurrentIvVitaminK, CLAIM_IDS.ivVitaminK, "A patient taking warfarin has major traumatic bleeding and an order for four-factor PCC.", "What should be administered concurrently?", ["IV vitamin K to support ongoing restoration of vitamin-K-dependent factors", "Oral vitamin K as the emergency co-therapy", "No vitamin K because PCC is sufficient alone"], 0, "PCC provides immediate replacement, while IV vitamin K supports continued reversal."],
  [CONCEPT_IDS.concurrentIvVitaminK, CLAIM_IDS.ivVitaminK, "A patient taking warfarin has a traumatic hemothorax with ongoing bleeding, but only IV vitamin K is ordered.", "What immediate reversal component is missing?", ["Four-factor PCC", "No additional treatment because IV vitamin K acts immediately", "Plasma even though four-factor PCC is available"], 0, "Vitamin K does not provide immediate factor replacement."],
  [CONCEPT_IDS.concurrentIvVitaminK, CLAIM_IDS.ivVitaminK, "A patient receives four-factor PCC for warfarin-associated traumatic bleeding, but vitamin K was omitted.", "Why should IV vitamin K be added?", ["To support renewed hepatic production of vitamin-K-dependent factors after the immediate PCC effect", "To supply platelets", "To remove warfarin directly from the circulation"], 0, "IV vitamin K supports continued reversal after PCC provides the initial factor repletion."],
  [CONCEPT_IDS.concurrentIvVitaminK, CLAIM_IDS.ivVitaminK, "A patient taking warfarin has a traumatic solid-organ hemorrhage requiring intervention.", "Which paired VKA-reversal regimen matches guidance?", ["Early four-factor PCC plus IV vitamin K", "Four-factor PCC alone", "IV vitamin K alone"], 0, "The two components address immediate replacement and continued endogenous factor restoration."],
  [CONCEPT_IDS.rapidConcentratedPccVersusPlasma, CLAIM_IDS.pccVsPlasma, "A patient taking warfarin has pelvic hemorrhage and heart failure with pulmonary congestion.", "Why is available four-factor PCC advantageous over plasma for reversal?", ["It provides more rapid, concentrated factor replacement with substantially less infusion volume", "It requires more volume and a slower infusion", "It works primarily by stimulating immediate new hepatic factor synthesis"], 0, "Concentration, speed, and lower volume distinguish PCC from plasma."],
  [CONCEPT_IDS.rapidConcentratedPccVersusPlasma, CLAIM_IDS.pccVsPlasma, "A patient taking warfarin needs urgent craniotomy for traumatic intracranial bleeding.", "Which statement best explains choosing available four-factor PCC over plasma?", ["PCC can be rapidly prepared and infused, providing faster correction with less volume", "Plasma corrects the VKA effect more rapidly", "Both require comparable preparation and infusion volume"], 0, "This tests the practical time-and-volume advantage rather than the treatment indication itself."],
  [CONCEPT_IDS.rapidConcentratedPccVersusPlasma, CLAIM_IDS.pccVsPlasma, "A patient taking warfarin has active bleeding and worsening pulmonary edema. Both four-factor PCC and plasma are available.", "Which feature favors PCC?", ["Concentrated factor replacement in a much smaller volume", "A requirement for more infused volume than plasma", "A requirement to wait for ABO-compatible units before PCC can be used"], 0, "PCC avoids the large-volume plasma replacement burden."],
  [CONCEPT_IDS.rapidConcentratedPccVersusPlasma, CLAIM_IDS.pccVsPlasma, "A patient taking warfarin has major traumatic bleeding, and plasma is delayed while compatible units are prepared. Available four-factor PCC is selected alongside IV vitamin K.", "Which practical feature supports that choice?", ["It supplies concentrated factors rapidly in a smaller volume without waiting for plasma preparation", "It requires a larger volume before reversal can begin", "It acts through immediate new hepatic factor synthesis"], 0, "This tests PCC delivery and volume advantages, not vitamin K’s mechanism."],
  [CONCEPT_IDS.fourFactorPccComposition, CLAIM_IDS.composition, "A patient taking warfarin is receiving four-factor PCC for major traumatic bleeding.", "Which clotting-factor set defines the four-factor product?", ["Factors II, VII, IX, and X", "Factors II, VIII, IX, and X", "Factors I, V, VIII, and XIII"], 0, ""],
  [CONCEPT_IDS.fourFactorPccComposition, CLAIM_IDS.composition, "A patient taking warfarin has traumatic intracranial bleeding. The team reviews which procoagulant factors four-factor PCC supplies.", "Which set is correct?", ["Factors II, VII, IX, and X", "Factors II, V, VII, and XII", "Factors VIII, IX, XI, and XIII"], 0, ""],
  [CONCEPT_IDS.fourFactorPccComposition, CLAIM_IDS.composition, "A patient taking warfarin receives four-factor PCC after a traumatic splenic bleed.", "Which factor is not one of its four named procoagulant factors?", ["Factor VIII", "Factor II", "Factor VII"], 0, "The named set is II, VII, IX, and X."],
  [CONCEPT_IDS.fourFactorPccComposition, CLAIM_IDS.composition, "A patient taking warfarin has major traumatic bleeding. The pharmacist reviews factors II, IX, and X from the four-factor PCC set.", "Which factor completes the set?", ["Factor VII", "Factor VIII", "Factor XIII"], 0, "This wording avoids making broader assumptions about every three-factor product formulation."],
] as const satisfies readonly QuestionSpec[];

type DeferredTraumaVkaQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId: typeof RELEASE_POINT_ID;
  earliestFacilityStage: null;
  requiredClinicalSetting: typeof REQUIRED_CLINICAL_SETTING;
  requiredCapabilityIds: readonly [];
  encounterRole: "single-decision-deferred-emergency-reversal";
  shuffleAnswers: true;
  currentGameEligibility: "deferred";
};

export const ROW_054_QUESTION_VARIANTS = QUESTION_SPECS.map((spec, index) => ({
  ...CLINICIAN_APPROVAL,
  id: `question.trauma-vka.emergency-reversal.v${index + 1}`,
  presentationVariantId: `presentation.trauma-vka.emergency-reversal.v${index + 1}`,
  patientPresentation: spec[2],
  conceptId: spec[0],
  releasePointId: RELEASE_POINT_ID,
  earliestFacilityStage: null,
  requiredClinicalSetting: REQUIRED_CLINICAL_SETTING,
  requiredCapabilityIds: [],
  currentGameEligibility: "deferred",
  encounterRole: "single-decision-deferred-emergency-reversal",
  stem: spec[3],
  answerChoices: spec[4].map((label, choiceIndex) => ({
    id: `choice-${choiceIndex + 1}`,
    label,
    isCorrect: choiceIndex === spec[5],
    distractorRationale:
      choiceIndex === spec[5]
        ? null
        : "Clinician-approved distractor; rationale remains outside the runtime question.",
  })),
  shuffleAnswers: true,
  explanation: spec[6],
  supportingEvidenceClaimIds: [spec[1]],
})) satisfies DeferredTraumaVkaQuestionVariant[];

export const ROW_054_APPROVED_ENCOUNTER_BLUEPRINTS = ROW_054_QUESTION_VARIANTS.map(
  (variant) => ({
    id: `blueprint.${variant.id.replace(/^question\./, "")}`,
    presentationVariantId: variant.presentationVariantId,
    questionVariantIds: [variant.id],
    releasePointId: variant.releasePointId,
    earliestFacilityStage: variant.earliestFacilityStage,
    requiredClinicalSetting: variant.requiredClinicalSetting,
    requiredCapabilityIds: variant.requiredCapabilityIds,
    currentGameEligibility: "deferred" as const,
    maximumScoredDecisionsPerEncounter: 1 as const,
  }),
);

export const ROW_054_APPROVED_BACKLOG = {
  conceptIds: ROW_054_CONCEPTS.map((concept) => concept.id),
  educationalDifficulty: "future_ed_trauma_vka_emergency_reversal",
  releasePointId: RELEASE_POINT_ID,
  earliestFacilityStage: null,
  requiredClinicalSetting: REQUIRED_CLINICAL_SETTING,
  currentGameEligibility: "deferred",
  deferredReason:
    "The current ED/Trauma systems are unavailable; this package does not authorize dosing, orders, treatment simulation, or replacement of hemorrhage control and resuscitation.",
  approvedForRuntime: false,
  tutorialEligible: false,
  maximumScoredDecisionsPerEncounter: 1,
  questionVariantIds: ROW_054_QUESTION_VARIANTS.map((variant) => variant.id),
  encounterBlueprintIds: ROW_054_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
} as const;
