import type {
  AuthoredClinicalRecord,
  ClinicalSource,
  EvidenceClaim,
  QuestionVariant,
} from "../pilot-schema";
import type { TestedConcept } from "../schema";

export const ROW_049_CONTENT_VERSION =
  "clinical.owner-row-049.2026-08-10.1";

const CLINICIAN_APPROVAL = {
  contentVersion: ROW_049_CONTENT_VERSION,
  reviewStatus: "clinically_approved",
  aiAssistedDrafting: true,
  lastClinicianReview: {
    reviewer: "Melissa Rowland, MD",
    reviewedOn: "2026-08-10",
    contentVersion: ROW_049_CONTENT_VERSION,
  },
} as const satisfies AuthoredClinicalRecord;

const SOURCE_METADATA_REVIEW = {
  contentVersion: ROW_049_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;

const HIGH_RISK_STIGMATA_CLAIM_ID =
  "claim.peptic-ulcer-bleeding.high-risk-stigmata-require-hemostasis";
const LOW_RISK_STIGMATA_CLAIM_ID =
  "claim.peptic-ulcer-bleeding.clean-base-flat-spot-no-hemostasis";
const VISIBLE_VESSEL_MODALITY_CLAIM_ID =
  "claim.peptic-ulcer-bleeding.nonbleeding-visible-vessel-modalities";
const EPINEPHRINE_BOUNDARY_CLAIM_ID =
  "claim.peptic-ulcer-bleeding.epinephrine-not-monotherapy";
const ACTIVE_BLEED_COMBINATION_CLAIM_ID =
  "claim.peptic-ulcer-bleeding.active-bleed-conventional-combination";
const ADVANCED_MONOTHERAPY_BOUNDARY_CLAIM_ID =
  "claim.peptic-ulcer-bleeding.selected-advanced-monotherapy-boundary";

const STIGMATA_CONCEPT_ID =
  "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis";
const MODALITY_CONCEPT_ID =
  "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality";

const PRESENTATION_IDS = {
  visibleVesselTreat:
    "presentation.peptic-ulcer-bleeding.visible-vessel-treat",
  selectHighRisk:
    "presentation.peptic-ulcer-bleeding.select-high-risk-stigmata",
  cleanBaseReverse:
    "presentation.peptic-ulcer-bleeding.clean-base-reverse",
  activeOozingTreat:
    "presentation.peptic-ulcer-bleeding.active-oozing-treat",
  visibleVesselInadequateMonotherapy:
    "presentation.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy",
  visibleVesselModalityPrinciple:
    "presentation.peptic-ulcer-bleeding.visible-vessel-modality-principle",
  activeOozingAfterEpinephrine:
    "presentation.peptic-ulcer-bleeding.active-oozing-after-epinephrine",
  activeBleedingMechanicalCombination:
    "presentation.peptic-ulcer-bleeding.active-bleeding-mechanical-combination",
  activeBleedingDefinitiveSecondModality:
    "presentation.peptic-ulcer-bleeding.active-bleeding-definitive-second-modality",
} as const;

const QUESTION_IDS = {
  visibleVesselTreat:
    "question.peptic-ulcer-bleeding.visible-vessel-treat.v1",
  selectHighRisk:
    "question.peptic-ulcer-bleeding.select-high-risk-stigmata.v1",
  cleanBaseReverse:
    "question.peptic-ulcer-bleeding.clean-base-reverse.v1",
  activeOozingTreat:
    "question.peptic-ulcer-bleeding.active-oozing-treat.v1",
  visibleVesselInadequateMonotherapy:
    "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1",
  visibleVesselModalityPrinciple:
    "question.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1",
  activeOozingAfterEpinephrine:
    "question.peptic-ulcer-bleeding.active-oozing-after-epinephrine.v1",
  activeBleedingMechanicalCombination:
    "question.peptic-ulcer-bleeding.active-bleeding-mechanical-combination.v1",
  activeBleedingDefinitiveSecondModality:
    "question.peptic-ulcer-bleeding.active-bleeding-definitive-second-modality.v1",
} as const;

export const ROW_049_CLINICAL_APPROVAL = {
  id: "approval.melissa-rowland-md.owner-row-049.2026-08-10",
  reviewer: "Melissa Rowland, MD",
  reviewerRole: "Surgeon",
  reviewedOn: "2026-08-10",
  contentVersion: ROW_049_CONTENT_VERSION,
  sourceProvenance: {
    workbookFileName: "Gamify Surgery Concepts (2).xlsx",
    sheetName: "Sheet1",
    sourceRow: 49,
    sourceRecordKey: "owner-concept.sheet1.row-049",
    earlierConceptReviewId:
      "melissa-rowland-md-2026-08-05-rows-2-56",
    evidencePackageId: "owner-concept-intake-2026-08-03-v3",
    approvedScopeDecisionId:
      "decision.owner-row-049.two-concept-stigmata-and-modality-split.2026-08-10",
    exactApprovalConversationDate: "2026-08-10",
  },
  approvedConceptIds: [STIGMATA_CONCEPT_ID, MODALITY_CONCEPT_ID],
  approvedConceptTypes: ["management", "management"],
  approvedPresentationVariantIds: Object.values(PRESENTATION_IDS),
  approvedQuestionVariantIds: Object.values(QUESTION_IDS),
  approvedEvidenceClaimIds: [
    HIGH_RISK_STIGMATA_CLAIM_ID,
    LOW_RISK_STIGMATA_CLAIM_ID,
    VISIBLE_VESSEL_MODALITY_CLAIM_ID,
    EPINEPHRINE_BOUNDARY_CLAIM_ID,
    ACTIVE_BLEED_COMBINATION_CLAIM_ID,
    ADVANCED_MONOTHERAPY_BOUNDARY_CLAIM_ID,
  ],
  approvedReleasePointIds: [
    "release.l2.endoscopy",
    "release.future.hospital_floor",
  ],
  tutorialEligible: false,
  decision: "approved",
  approvedElements: [
    "two_fsrs_concept_identities",
    "one_primary_concept_per_scored_decision",
    "nine_single_select_question_variants",
    "brief_variable_patient_presentations",
    "level_2_stable_nonbleeding_visible_vessel_iterations",
    "future_hospital_active_bleeding_iterations",
    "high_risk_stigmata_treatment_boundary",
    "clean_base_and_flat_spot_boundary",
    "epinephrine_monotherapy_is_inadequate",
    "thermal_or_mechanical_visible_vessel_monotherapy",
    "conventional_epinephrine_plus_definitive_modality_pathway",
    "two_approved_two-decision_blueprints",
    "complete_answer_sets_and_keyed_answers",
    "similar_modality_distractors",
    "shuffled_answer_order",
    "answer_length_cue_mitigation",
  ],
  deferredElements: [
    "level_2_runtime_case_materialization",
    "endoscopy_room_service_and_movement_integration",
    "future_hospital_endoscopy_capability_assignment",
    "post_hemostasis_ppi_concept",
    "recurrent_bleeding_pathway",
    "angiographic_embolization_and_surgical_rescue",
    "advanced_ots_clip_and_hemostatic_forceps_questions",
  ],
  excludedElements: [
    "any_two_modalities_are_always_required",
    "epinephrine_monotherapy_as_definitive_treatment",
    "clip_plus_cautery_as_a_uniquely_required_pair",
    "generic_clip_or_cautery_monotherapy_always_wrong",
    "unstable_active_bleeding_as_routine_ambulatory_endoscopy",
  ],
} as const;

export const ROW_049_SOURCES = [
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.acg.upper-gastrointestinal-ulcer-bleeding-guideline.2021",
    title:
      "ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding",
    completeCitation:
      "Laine L, Barkun AN, Saltzman JR, Martel M, Leontiadis GI. ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding. American Journal of Gastroenterology. 2021;116(5):899-917. doi:10.14309/ajg.0000000000001245.",
    organizationOrJournal:
      "American College of Gastroenterology; American Journal of Gastroenterology",
    authors: [
      "Loren Laine",
      "Alan N. Barkun",
      "John R. Saltzman",
      "Myriam Martel",
      "Grigorios I. Leontiadis",
    ],
    publicationYear: 2021,
    doi: "10.14309/ajg.0000000000001245",
    pmid: "33929377",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/33929377/",
    accessedOn: "2026-08-10",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Copyrighted professional-society guideline; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use independently written factual synthesis for targeted guideline verification; do not reproduce recommendations, tables, figures, algorithms, or protected explanatory wording.",
    authorityAssessment:
      "Current ACG upper-GI and ulcer-bleeding guideline supporting treatment of active bleeding and nonbleeding visible vessels, accepted hemostatic modalities, and the rule that epinephrine is not definitive monotherapy.",
    usageRole: "evidence",
    evidenceClaimIds: [
      HIGH_RISK_STIGMATA_CLAIM_ID,
      LOW_RISK_STIGMATA_CLAIM_ID,
      VISIBLE_VESSEL_MODALITY_CLAIM_ID,
      EPINEPHRINE_BOUNDARY_CLAIM_ID,
      ACTIVE_BLEED_COMBINATION_CLAIM_ID,
    ],
  },
  {
    ...SOURCE_METADATA_REVIEW,
    id: "source.esge.peptic-ulcer-bleeding-guideline.2026",
    title:
      "Endoscopic diagnosis and management of peptic ulcer bleeding: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2026",
    completeCitation:
      "Gralnek IM, Morris J, Laursen SB, et al. Endoscopic diagnosis and management of peptic ulcer bleeding: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2026. Endoscopy. 2026;58(8):899-924. doi:10.1055/a-2863-8314.",
    organizationOrJournal:
      "European Society of Gastrointestinal Endoscopy; Endoscopy",
    authors: [
      "Ian M. Gralnek",
      "John Morris",
      "Stig Borbjerg Laursen",
      "Marine Camus",
      "Georgios Tziatzios",
      "Lynn K. Debels",
      "Gaurav B. Nigam",
      "Balint Eross",
      "Martin Goetz",
      "Nauzer Forbes",
      "Tiago Curdia Goncalves",
      "Krzysztof Kurek",
      "Michael Bretthauer",
      "Tony C. Tham",
    ],
    publicationYear: 2026,
    doi: "10.1055/a-2863-8314",
    pmid: "42127996",
    officialUrl: "https://pubmed.ncbi.nlm.nih.gov/42127996/",
    accessedOn: "2026-08-10",
    sourceClass: "professional_society_guideline",
    licenseLabel:
      "Free-to-read copyrighted professional-society guideline; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Use independently written factual synthesis only; do not reproduce protected recommendation wording, tables, figures, or algorithms. PubMed lists a published correction (PMID 42173116); this package does not rely on formatting or conflict-of-interest details affected by that notice.",
    authorityAssessment:
      "Current ESGE peptic-ulcer-bleeding guideline supporting stigmata-specific hemostasis, monotherapy options for a nonbleeding visible vessel, conventional combination therapy for active bleeding, and selected advanced monotherapy boundaries that prevent overbroad distractors.",
    usageRole: "both",
    evidenceClaimIds: [
      HIGH_RISK_STIGMATA_CLAIM_ID,
      LOW_RISK_STIGMATA_CLAIM_ID,
      VISIBLE_VESSEL_MODALITY_CLAIM_ID,
      EPINEPHRINE_BOUNDARY_CLAIM_ID,
      ACTIVE_BLEED_COMBINATION_CLAIM_ID,
      ADVANCED_MONOTHERAPY_BOUNDARY_CLAIM_ID,
    ],
  },
] satisfies ClinicalSource[];

export const ROW_049_EVIDENCE_CLAIMS = [
  {
    ...CLINICIAN_APPROVAL,
    id: HIGH_RISK_STIGMATA_CLAIM_ID,
    statement:
      "Peptic ulcers with active spurting, active oozing, or a nonbleeding visible vessel are high-risk endoscopic findings for which endoscopic hemostasis is indicated.",
    sourceIds: [
      "source.acg.upper-gastrointestinal-ulcer-bleeding-guideline.2021",
      "source.esge.peptic-ulcer-bleeding-guideline.2026",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "This claim assumes the patient has been appropriately assessed and stabilized for endoscopy; it does not define pre-endoscopy resuscitation, transfusion, medication, or disposition decisions.",
    applicablePopulation:
      "Adults undergoing upper endoscopy for suspected or confirmed nonvariceal peptic-ulcer bleeding.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: LOW_RISK_STIGMATA_CLAIM_ID,
    statement:
      "A clean-based peptic ulcer or a flat pigmented spot does not require endoscopic hemostatic treatment solely for that stigma.",
    sourceIds: [
      "source.acg.upper-gastrointestinal-ulcer-bleeding-guideline.2021",
      "source.esge.peptic-ulcer-bleeding-guideline.2026",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "The absence of an endoscopic hemostasis indication does not determine the complete medical treatment, cause-specific therapy, observation need, or discharge plan.",
    applicablePopulation:
      "Adults whose upper endoscopy shows a peptic ulcer with a clean base or flat pigmented spot and no separate high-risk bleeding stigma.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: VISIBLE_VESSEL_MODALITY_CLAIM_ID,
    statement:
      "A nonbleeding visible vessel may be treated with an accepted thermal or mechanical hemostatic modality as monotherapy, or with such a definitive modality combined with epinephrine injection.",
    sourceIds: [
      "source.acg.upper-gastrointestinal-ulcer-bleeding-guideline.2021",
      "source.esge.peptic-ulcer-bleeding-guideline.2026",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "The concept does not claim that every available modality is equivalent in every lesion, that two definitive modalities are routinely required, or that device selection is independent of anatomy, expertise, and equipment.",
    applicablePopulation:
      "Adults with a peptic ulcer containing a nonbleeding visible vessel during upper endoscopy.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: EPINEPHRINE_BOUNDARY_CLAIM_ID,
    statement:
      "Epinephrine injection should not be used as the sole definitive endoscopic treatment for a high-risk bleeding peptic ulcer; when epinephrine is selected, it must be paired with a definitive hemostatic modality.",
    sourceIds: [
      "source.acg.upper-gastrointestinal-ulcer-bleeding-guideline.2021",
      "source.esge.peptic-ulcer-bleeding-guideline.2026",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "high",
    limitation:
      "This claim does not require epinephrine in every hemostatic plan and does not make an accepted thermal, mechanical, or selected advanced modality inadequate merely because injection was omitted.",
    applicablePopulation:
      "Adults receiving endoscopic hemostasis for a peptic ulcer with active bleeding or a nonbleeding visible vessel when epinephrine injection is under consideration.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: ACTIVE_BLEED_COMBINATION_CLAIM_ID,
    statement:
      "A conventional combination pathway for an actively bleeding peptic ulcer uses dilute epinephrine injection for temporary control followed by contact thermal or mechanical hemostasis.",
    sourceIds: [
      "source.acg.upper-gastrointestinal-ulcer-bleeding-guideline.2021",
      "source.esge.peptic-ulcer-bleeding-guideline.2026",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "This is a conventional pathway, not a claim that every actively bleeding ulcer must receive epinephrine or that selected contemporary OTS-clip or hemostatic-forceps monotherapy is never appropriate.",
    applicablePopulation:
      "Appropriately stabilized adults undergoing hospital endoscopy for an actively bleeding peptic ulcer when the conventional epinephrine-combination pathway is selected.",
    lastCheckedOn: "2026-08-10",
  },
  {
    ...CLINICIAN_APPROVAL,
    id: ADVANCED_MONOTHERAPY_BOUNDARY_CLAIM_ID,
    statement:
      "Current guidance recognizes selected advanced monotherapy options, including over-the-scope clipping for certain high-risk actively bleeding ulcers and hemostatic forceps with soft coagulation, so generic clip or cautery monotherapy cannot be labeled universally wrong.",
    sourceIds: [
      "source.esge.peptic-ulcer-bleeding-guideline.2026",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "The exact choice depends on lesion characteristics, device type, technical competence, local resources, and recommendation strength; these advanced options are boundaries for distractor authoring rather than scored content in this package.",
    applicablePopulation:
      "Adults undergoing expert endoscopic hemostasis for high-risk peptic-ulcer bleeding.",
    lastCheckedOn: "2026-08-10",
  },
] satisfies EvidenceClaim[];

export const ROW_049_CONCEPTS = [
  {
    id: STIGMATA_CONCEPT_ID,
    displayName:
      "High-risk peptic-ulcer stigmata requiring endoscopic hemostasis",
    learningObjective:
      "Distinguish active spurting, active oozing, and a nonbleeding visible vessel from low-risk clean-base or flat-spot findings when deciding whether endoscopic hemostasis is required.",
    earliestFacilityStage: 2,
    conceptType: "management",
  },
  {
    id: MODALITY_CONCEPT_ID,
    displayName:
      "Endoscopic hemostasis modality selection for peptic-ulcer bleeding",
    learningObjective:
      "Select an accepted definitive thermal or mechanical modality, recognize that epinephrine is never definitive monotherapy, and apply the conventional epinephrine-plus-definitive-modality pathway without making all monotherapies universally wrong.",
    earliestFacilityStage: 2,
    conceptType: "management",
  },
] satisfies TestedConcept[];

type ApprovedDeferredQuestionVariant = QuestionVariant & {
  presentationVariantId: string;
  patientPresentation: string;
  releasePointId:
    | "release.l2.endoscopy"
    | "release.future.hospital_floor";
  requiredClinicalSetting: "endoscopy" | "hospital_floor";
  requiredCapabilityIds: readonly string[];
  encounterRole: "peptic-ulcer-hemostasis-approved-question-pool";
  shuffleAnswers: true;
};

type ChoiceInput = readonly [
  id: string,
  label: string,
  isCorrect: boolean,
  distractorRationale: string | null,
];

function answerChoices(values: readonly ChoiceInput[]) {
  return values.map(
    ([id, label, isCorrect, distractorRationale]) => ({
      id,
      label,
      isCorrect,
      distractorRationale,
    }),
  );
}

function approvedVariant(
  input: Omit<
    ApprovedDeferredQuestionVariant,
    | keyof AuthoredClinicalRecord
    | "encounterRole"
    | "shuffleAnswers"
  >,
): ApprovedDeferredQuestionVariant {
  return {
    ...CLINICIAN_APPROVAL,
    ...input,
    encounterRole: "peptic-ulcer-hemostasis-approved-question-pool",
    shuffleAnswers: true,
  };
}

const STIGMATA_EXPLANATION =
  "Active spurting, active oozing, and a nonbleeding visible vessel are high-risk peptic-ulcer stigmata that warrant endoscopic hemostasis. A clean base or flat pigmented spot does not require endoscopic treatment solely for that finding.";

const VISIBLE_VESSEL_MODALITY_EXPLANATION =
  "For a nonbleeding visible vessel, accepted thermal or mechanical therapy may be used alone or with epinephrine. Epinephrine alone is not definitive hemostasis, while two definitive modalities are not automatically required.";

const EPINEPHRINE_COMBINATION_EXPLANATION =
  "When the conventional epinephrine pathway is selected for active ulcer bleeding, temporary injection control must be followed by definitive thermal or mechanical hemostasis. This does not make every noninjection monotherapy universally wrong; selected advanced alternatives belong to a separate expert pathway.";

export const ROW_049_QUESTION_VARIANTS = [
  approvedVariant({
    id: QUESTION_IDS.visibleVesselTreat,
    presentationVariantId: PRESENTATION_IDS.visibleVesselTreat,
    patientPresentation:
      "A hemodynamically stable adult undergoes EGD after recent melena. A duodenal ulcer is no longer actively bleeding but contains a clearly visible vessel.",
    conceptId: STIGMATA_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    stem: "What should be done for this endoscopic finding?",
    answerChoices: answerChoices([
      [
        "perform_endoscopic_hemostasis",
        "Perform endoscopic hemostasis",
        true,
        null,
      ],
      [
        "oral_ppi_without_hemostasis",
        "Give oral PPI without endoscopic treatment",
        false,
        "A nonbleeding visible vessel is a high-risk stigma requiring endoscopic hemostasis rather than medication alone.",
      ],
      [
        "biopsy_vessel",
        "Biopsy the visible vessel before treatment",
        false,
        "Biopsy does not provide hemostasis and risks disrupting a high-risk vascular stigma.",
      ],
      [
        "repeat_egd_without_treatment",
        "Schedule repeat EGD without treating the vessel",
        false,
        "Deferring treatment leaves the high-risk visible vessel without endoscopic hemostasis.",
      ],
    ]),
    explanation: STIGMATA_EXPLANATION,
    supportingEvidenceClaimIds: [HIGH_RISK_STIGMATA_CLAIM_ID],
  }),
  approvedVariant({
    id: QUESTION_IDS.selectHighRisk,
    presentationVariantId: PRESENTATION_IDS.selectHighRisk,
    patientPresentation:
      "During an endoscopy list for adults with recent upper-GI bleeding symptoms, the team compares several peptic-ulcer findings to determine which one requires hemostatic treatment.",
    conceptId: STIGMATA_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    stem: "Which finding requires endoscopic hemostasis?",
    answerChoices: answerChoices([
      [
        "nonbleeding_visible_vessel",
        "Ulcer with a nonbleeding visible vessel",
        true,
        null,
      ],
      [
        "clean_base",
        "Clean-based ulcer without active bleeding",
        false,
        "A clean base is a low-risk stigma that does not require endoscopic hemostasis solely for that finding.",
      ],
      [
        "flat_pigmented_spot",
        "Flat pigmented spot without active bleeding",
        false,
        "A flat pigmented spot does not require endoscopic hemostasis solely for that finding.",
      ],
      [
        "healed_scar",
        "Healed ulcer scar without bleeding stigmata",
        false,
        "A healed scar without a bleeding stigma is not an indication for endoscopic hemostasis.",
      ],
    ]),
    explanation: STIGMATA_EXPLANATION,
    supportingEvidenceClaimIds: [
      HIGH_RISK_STIGMATA_CLAIM_ID,
      LOW_RISK_STIGMATA_CLAIM_ID,
    ],
  }),
  approvedVariant({
    id: QUESTION_IDS.cleanBaseReverse,
    presentationVariantId: PRESENTATION_IDS.cleanBaseReverse,
    patientPresentation:
      "A stable adult undergoes EGD after a self-limited episode of dark stool. Several possible ulcer stigmata are being reviewed before an endoscopic treatment decision is made.",
    conceptId: STIGMATA_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    stem: "Which finding generally does not require endoscopic hemostasis?",
    answerChoices: answerChoices([
      ["clean_based_ulcer", "Clean-based ulcer", true, null],
      [
        "spurting_ulcer",
        "Actively spurting ulcer",
        false,
        "Active spurting is a high-risk stigma that requires endoscopic hemostasis.",
      ],
      [
        "oozing_ulcer",
        "Actively oozing ulcer",
        false,
        "Active oozing is a high-risk stigma that requires endoscopic hemostasis.",
      ],
      [
        "visible_vessel_ulcer",
        "Ulcer with a nonbleeding visible vessel",
        false,
        "A nonbleeding visible vessel remains a high-risk stigma requiring endoscopic hemostasis.",
      ],
    ]),
    explanation: STIGMATA_EXPLANATION,
    supportingEvidenceClaimIds: [
      HIGH_RISK_STIGMATA_CLAIM_ID,
      LOW_RISK_STIGMATA_CLAIM_ID,
    ],
  }),
  approvedVariant({
    id: QUESTION_IDS.activeOozingTreat,
    presentationVariantId: PRESENTATION_IDS.activeOozingTreat,
    patientPresentation:
      "A hospitalized adult with melena has been resuscitated and undergoes EGD. A duodenal ulcer is actively oozing blood.",
    conceptId: STIGMATA_CONCEPT_ID,
    releasePointId: "release.future.hospital_floor",
    requiredClinicalSetting: "hospital_floor",
    requiredCapabilityIds: [],
    stem: "What is the appropriate endoscopic response?",
    answerChoices: answerChoices([
      [
        "perform_endoscopic_hemostasis",
        "Perform endoscopic hemostasis",
        true,
        null,
      ],
      [
        "observe_venous_bleeding",
        "Observe because the bleeding appears venous",
        false,
        "Active oozing from a peptic ulcer is a treatment indication regardless of this unsupported characterization.",
      ],
      [
        "oral_ppi_end_procedure",
        "Use oral PPI alone and end the procedure",
        false,
        "Medication alone does not replace endoscopic hemostasis for an actively bleeding ulcer.",
      ],
      [
        "delay_until_second_bleed",
        "Delay treatment until a second bleeding episode",
        false,
        "The present active bleed is already an indication for endoscopic hemostasis.",
      ],
    ]),
    explanation: STIGMATA_EXPLANATION,
    supportingEvidenceClaimIds: [HIGH_RISK_STIGMATA_CLAIM_ID],
  }),
  approvedVariant({
    id: QUESTION_IDS.visibleVesselInadequateMonotherapy,
    presentationVariantId:
      PRESENTATION_IDS.visibleVesselInadequateMonotherapy,
    patientPresentation:
      "A stable adult with recent maroon stool undergoes EGD. A gastric ulcer contains a nonbleeding visible vessel, and four possible hemostatic plans are considered.",
    conceptId: MODALITY_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    stem: "Which option is inappropriate as sole endoscopic treatment?",
    answerChoices: answerChoices([
      [
        "epinephrine_plus_bipolar",
        "Epinephrine plus bipolar coagulation",
        false,
        "This pairs epinephrine with a definitive contact-thermal modality and is an acceptable combination pathway.",
      ],
      [
        "epinephrine_alone",
        "Epinephrine injection alone",
        true,
        null,
      ],
      [
        "bipolar_alone",
        "Bipolar coagulation alone",
        false,
        "Contact thermal therapy is an accepted monotherapy for a nonbleeding visible vessel.",
      ],
      [
        "clip_alone",
        "Endoscopic clip alone",
        false,
        "Mechanical clip therapy is an accepted monotherapy for a nonbleeding visible vessel.",
      ],
    ]),
    explanation: VISIBLE_VESSEL_MODALITY_EXPLANATION,
    supportingEvidenceClaimIds: [
      VISIBLE_VESSEL_MODALITY_CLAIM_ID,
      EPINEPHRINE_BOUNDARY_CLAIM_ID,
    ],
  }),
  approvedVariant({
    id: QUESTION_IDS.visibleVesselModalityPrinciple,
    presentationVariantId:
      PRESENTATION_IDS.visibleVesselModalityPrinciple,
    patientPresentation:
      "A hemodynamically stable patient undergoing EGD for recent melena has a nonbleeding visible vessel within a peptic ulcer. The endoscopy team is selecting among thermal, injection, and mechanical options.",
    conceptId: MODALITY_CONCEPT_ID,
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    stem: "Which statement about hemostatic modality selection is correct?",
    answerChoices: answerChoices([
      [
        "thermal_or_clip_without_epi",
        "Thermal therapy or clipping may be used without epinephrine",
        true,
        null,
      ],
      [
        "epi_alone_definitive",
        "Epinephrine alone provides definitive hemostasis",
        false,
        "Epinephrine injection alone is not accepted as definitive hemostasis for a high-risk ulcer stigma.",
      ],
      [
        "bipolar_requires_clip",
        "Bipolar coagulation must always be combined with clipping",
        false,
        "A nonbleeding visible vessel may receive an accepted thermal modality as monotherapy.",
      ],
      [
        "clip_requires_thermal",
        "An endoscopic clip must always be combined with thermal therapy",
        false,
        "Mechanical clip therapy may be used as monotherapy for a nonbleeding visible vessel.",
      ],
    ]),
    explanation: VISIBLE_VESSEL_MODALITY_EXPLANATION,
    supportingEvidenceClaimIds: [
      VISIBLE_VESSEL_MODALITY_CLAIM_ID,
      EPINEPHRINE_BOUNDARY_CLAIM_ID,
    ],
  }),
  approvedVariant({
    id: QUESTION_IDS.activeOozingAfterEpinephrine,
    presentationVariantId:
      PRESENTATION_IDS.activeOozingAfterEpinephrine,
    patientPresentation:
      "A resuscitated hospitalized adult has an actively oozing duodenal ulcer during EGD. Dilute epinephrine is injected and the bleeding slows.",
    conceptId: MODALITY_CONCEPT_ID,
    releasePointId: "release.future.hospital_floor",
    requiredClinicalSetting: "hospital_floor",
    requiredCapabilityIds: [],
    stem: "What should the endoscopist do next?",
    answerChoices: answerChoices([
      [
        "apply_bipolar",
        "Apply bipolar coagulation to the vessel",
        true,
        null,
      ],
      [
        "end_after_slowing",
        "End the procedure because the bleeding slowed",
        false,
        "Temporary slowing after epinephrine does not provide definitive hemostasis.",
      ],
      [
        "more_epi_then_stop",
        "Inject additional epinephrine and then stop",
        false,
        "Additional epinephrine still leaves the ulcer without a definitive second modality.",
      ],
      [
        "observe_without_definitive",
        "Observe the vessel without definitive treatment",
        false,
        "Observation does not complete hemostasis after temporary injection control of active bleeding.",
      ],
    ]),
    explanation: EPINEPHRINE_COMBINATION_EXPLANATION,
    supportingEvidenceClaimIds: [
      EPINEPHRINE_BOUNDARY_CLAIM_ID,
      ACTIVE_BLEED_COMBINATION_CLAIM_ID,
      ADVANCED_MONOTHERAPY_BOUNDARY_CLAIM_ID,
    ],
  }),
  approvedVariant({
    id: QUESTION_IDS.activeBleedingMechanicalCombination,
    presentationVariantId:
      PRESENTATION_IDS.activeBleedingMechanicalCombination,
    patientPresentation:
      "A resuscitated hospitalized adult has an actively bleeding peptic ulcer at EGD. The endoscopist elects to use the conventional epinephrine-combination pathway with mechanical hemostasis.",
    conceptId: MODALITY_CONCEPT_ID,
    releasePointId: "release.future.hospital_floor",
    requiredClinicalSetting: "hospital_floor",
    requiredCapabilityIds: [],
    stem: "Which complete treatment plan follows that pathway?",
    answerChoices: answerChoices([
      [
        "epinephrine_plus_clip",
        "Epinephrine injection plus endoscopic clipping",
        true,
        null,
      ],
      [
        "epinephrine_alone",
        "Epinephrine injection alone",
        false,
        "Epinephrine alone lacks the definitive mechanical modality specified by the chosen pathway.",
      ],
      [
        "epinephrine_plus_saline",
        "Epinephrine plus saline injection without definitive hemostasis",
        false,
        "A second injection without a definitive thermal or mechanical modality does not complete the pathway.",
      ],
      [
        "repeated_epinephrine",
        "Repeated epinephrine injections without definitive therapy",
        false,
        "Repeating epinephrine does not substitute for definitive mechanical or thermal hemostasis.",
      ],
    ]),
    explanation: EPINEPHRINE_COMBINATION_EXPLANATION,
    supportingEvidenceClaimIds: [
      EPINEPHRINE_BOUNDARY_CLAIM_ID,
      ACTIVE_BLEED_COMBINATION_CLAIM_ID,
      ADVANCED_MONOTHERAPY_BOUNDARY_CLAIM_ID,
    ],
  }),
  approvedVariant({
    id: QUESTION_IDS.activeBleedingDefinitiveSecondModality,
    presentationVariantId:
      PRESENTATION_IDS.activeBleedingDefinitiveSecondModality,
    patientPresentation:
      "During hospital EGD for an actively oozing ulcer, the team compares conventional plans that use epinephrine for initial temporary control with plans that provide definitive hemostasis.",
    conceptId: MODALITY_CONCEPT_ID,
    releasePointId: "release.future.hospital_floor",
    requiredClinicalSetting: "hospital_floor",
    requiredCapabilityIds: [],
    stem: "Which plan fails to provide a definitive second modality after epinephrine?",
    answerChoices: answerChoices([
      [
        "epinephrine_then_bipolar",
        "Epinephrine followed by bipolar coagulation of the identified vessel",
        false,
        "Bipolar coagulation supplies the definitive contact-thermal modality after epinephrine.",
      ],
      [
        "epinephrine_then_clip",
        "Epinephrine followed by endoscopic clipping of the identified vessel",
        false,
        "Clipping supplies the definitive mechanical modality after epinephrine.",
      ],
      [
        "epinephrine_then_epinephrine",
        "Epinephrine followed only by another epinephrine injection",
        true,
        null,
      ],
      [
        "bipolar_without_injection",
        "Bipolar coagulation without injection therapy to definitively treat the vessel",
        false,
        "This uses a definitive thermal modality rather than relying on epinephrine monotherapy; the question does not claim injection is mandatory in every accepted pathway.",
      ],
    ]),
    explanation: EPINEPHRINE_COMBINATION_EXPLANATION,
    supportingEvidenceClaimIds: [
      EPINEPHRINE_BOUNDARY_CLAIM_ID,
      ACTIVE_BLEED_COMBINATION_CLAIM_ID,
      ADVANCED_MONOTHERAPY_BOUNDARY_CLAIM_ID,
    ],
  }),
] satisfies ApprovedDeferredQuestionVariant[];

export const ROW_049_APPROVED_ENCOUNTER_BLUEPRINTS = [
  {
    id: "blueprint.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
    presentationVariantIds: [
      PRESENTATION_IDS.visibleVesselTreat,
      PRESENTATION_IDS.visibleVesselInadequateMonotherapy,
    ],
    questionVariantIds: [
      QUESTION_IDS.visibleVesselTreat,
      QUESTION_IDS.visibleVesselInadequateMonotherapy,
    ],
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    maximumScoredDecisions: 2,
    intermediateDecisionBehavior: "corrective_forward",
  },
  {
    id: "blueprint.peptic-ulcer-bleeding.active-oozing-hemostasis.v1",
    presentationVariantIds: [
      PRESENTATION_IDS.activeOozingTreat,
      PRESENTATION_IDS.activeOozingAfterEpinephrine,
    ],
    questionVariantIds: [
      QUESTION_IDS.activeOozingTreat,
      QUESTION_IDS.activeOozingAfterEpinephrine,
    ],
    releasePointId: "release.future.hospital_floor",
    requiredClinicalSetting: "hospital_floor",
    requiredCapabilityIds: [],
    maximumScoredDecisions: 2,
    intermediateDecisionBehavior: "corrective_forward",
  },
  {
    id: "blueprint.peptic-ulcer-bleeding.select-high-risk-stigmata.v1",
    presentationVariantIds: [PRESENTATION_IDS.selectHighRisk],
    questionVariantIds: [QUESTION_IDS.selectHighRisk],
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    maximumScoredDecisions: 1,
    intermediateDecisionBehavior: "not_applicable",
  },
  {
    id: "blueprint.peptic-ulcer-bleeding.clean-base-reverse.v1",
    presentationVariantIds: [PRESENTATION_IDS.cleanBaseReverse],
    questionVariantIds: [QUESTION_IDS.cleanBaseReverse],
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    maximumScoredDecisions: 1,
    intermediateDecisionBehavior: "not_applicable",
  },
  {
    id: "blueprint.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1",
    presentationVariantIds: [
      PRESENTATION_IDS.visibleVesselModalityPrinciple,
    ],
    questionVariantIds: [QUESTION_IDS.visibleVesselModalityPrinciple],
    releasePointId: "release.l2.endoscopy",
    requiredClinicalSetting: "endoscopy",
    requiredCapabilityIds: ["capability.endoscopy"],
    maximumScoredDecisions: 1,
    intermediateDecisionBehavior: "not_applicable",
  },
  {
    id: "blueprint.peptic-ulcer-bleeding.active-mechanical-combination.v1",
    presentationVariantIds: [
      PRESENTATION_IDS.activeBleedingMechanicalCombination,
    ],
    questionVariantIds: [QUESTION_IDS.activeBleedingMechanicalCombination],
    releasePointId: "release.future.hospital_floor",
    requiredClinicalSetting: "hospital_floor",
    requiredCapabilityIds: [],
    maximumScoredDecisions: 1,
    intermediateDecisionBehavior: "not_applicable",
  },
  {
    id: "blueprint.peptic-ulcer-bleeding.definitive-second-modality.v1",
    presentationVariantIds: [
      PRESENTATION_IDS.activeBleedingDefinitiveSecondModality,
    ],
    questionVariantIds: [
      QUESTION_IDS.activeBleedingDefinitiveSecondModality,
    ],
    releasePointId: "release.future.hospital_floor",
    requiredClinicalSetting: "hospital_floor",
    requiredCapabilityIds: [],
    maximumScoredDecisions: 1,
    intermediateDecisionBehavior: "not_applicable",
  },
] as const;

export const ROW_049_APPROVED_BACKLOG = {
  conceptIds: ROW_049_CONCEPTS.map((concept) => concept.id),
  educationalDifficulty: "intermediate",
  releasePointIds: [
    "release.l2.endoscopy",
    "release.future.hospital_floor",
  ],
  earliestFacilityStage: 2,
  requiredClinicalSettings: ["endoscopy", "hospital_floor"],
  currentGameEligibility: "partially_active_level_2_future_hospital_floor_excluded",
  activeBlueprintIds: [
    "blueprint.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
    "blueprint.peptic-ulcer-bleeding.select-high-risk-stigmata.v1",
    "blueprint.peptic-ulcer-bleeding.clean-base-reverse.v1",
    "blueprint.peptic-ulcer-bleeding.visible-vessel-modality-principle.v1",
  ],
  deferredBlueprintIds: [
    "blueprint.peptic-ulcer-bleeding.active-oozing-hemostasis.v1",
    "blueprint.peptic-ulcer-bleeding.active-mechanical-combination.v1",
    "blueprint.peptic-ulcer-bleeding.definitive-second-modality.v1",
  ],
  deferredReason:
    "Future Hospital Floor active-bleeding blueprints remain excluded; the listed stable Level 2 endoscopy blueprints are active.",
  approvedForRuntime: true,
  tutorialEligible: false,
  maximumScoredDecisionsPerEncounter: 2,
  questionVariantIds: ROW_049_QUESTION_VARIANTS.map(
    (variant) => variant.id,
  ),
  encounterBlueprintIds: ROW_049_APPROVED_ENCOUNTER_BLUEPRINTS.map(
    (blueprint) => blueprint.id,
  ),
} as const;
