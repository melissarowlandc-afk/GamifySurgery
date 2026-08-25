import type {
  ClinicalSource,
  DiagnosisFamily,
  EvidenceClaim,
  PhysiologyOverlay,
  PilotConcept,
  PilotEncounterTemplate,
  PresentationPhenotype,
} from "../pilot-schema";
import {
  BROAD_ADULT_BMI_POLICY,
  EQUAL_EDITORIAL_WEIGHT,
  GENERAL_ADULT_AGE_BANDS,
  GENERAL_ADULT_SEX_POLICY,
  PILOT_DRAFT,
  answer,
  questionVariant,
} from "./common";

const ADULT_NONPREGNANT =
  "Adults age 18 years or older; pilot presentations are nonpregnant and suppress meaningful comorbidity.";

export const LAC_ABS_BIL_SOURCES = [
  {
    ...PILOT_DRAFT,
    id: "src.cdc.tetanus_wound.2025",
    title: "Clinical Guidance for Wound Management to Prevent Tetanus",
    completeCitation:
      "Centers for Disease Control and Prevention. Clinical Guidance for Wound Management to Prevent Tetanus. Updated June 10, 2025.",
    organizationOrJournal: "Centers for Disease Control and Prevention",
    authors: [],
    publicationYear: 2025,
    doi: null,
    pmid: null,
    officialUrl:
      "https://www.cdc.gov/tetanus/hcp/clinical-guidance/index.html",
    accessedOn: "2026-07-29",
    sourceClass: "government_guidance",
    licenseLabel: "U.S. federal government material; CDC conditions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes:
      "Attribute CDC, avoid logos and separately credited material, do not imply endorsement, link to the freely available original, and recheck for updates.",
    authorityAssessment: "Current U.S. government clinical guidance.",
    usageRole: "evidence",
    evidenceClaimIds: [
      "claim.laceration.tetanus_basis",
      "claim.laceration.tetanus_matrix",
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "src.wses.traumatic_wounds.2016",
    title: "Management of traumatic wounds in the Emergency Department",
    completeCitation:
      "Prevaldi C, Paolillo C, Locatelli C, et al. Management of traumatic wounds in the Emergency Department: position paper from AcEMC and WSES. World J Emerg Surg. 2016;11:30.",
    organizationOrJournal: "World Journal of Emergency Surgery",
    authors: [
      "Carolina Prevaldi",
      "Ciro Paolillo",
      "Carlo Locatelli",
      "Giorgio Ricci",
      "Fausto Catena",
      "Luca Ansaloni",
      "Gianfranco Cervellin",
    ],
    publicationYear: 2016,
    doi: "10.1186/s13017-016-0084-3",
    pmid: null,
    officialUrl:
      "https://doi.org/10.1186/s13017-016-0084-3",
    accessedOn: "2026-07-29",
    sourceClass: "professional_society_guideline",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Attribute authors and source, link the license, identify changes, and screen separately credited third-party material.",
    authorityAssessment:
      "Multi-society Delphi position paper; older and less rigorous than a systematic guideline.",
    usageRole: "evidence",
    evidenceClaimIds: [
      "claim.laceration.preclosure_assessment",
      "claim.laceration.foreign_material",
      "claim.laceration.deep_injury_escalation",
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "src.wses.ssti_pathways.2022",
    title:
      "WSES/GAIS/WSIS/SIS-E/AAST global clinical pathways for patients with skin and soft tissue infections",
    completeCitation:
      "Sartelli M, Coccolini F, Kluger Y, et al. WSES/GAIS/WSIS/SIS-E/AAST global clinical pathways for patients with skin and soft tissue infections. World J Emerg Surg. 2022;17:3.",
    organizationOrJournal: "World Journal of Emergency Surgery",
    authors: ["Massimo Sartelli", "Federico Coccolini", "Yoram Kluger", "et al."],
    publicationYear: 2022,
    doi: "10.1186/s13017-022-00406-2",
    pmid: null,
    officialUrl:
      "https://doi.org/10.1186/s13017-022-00406-2",
    accessedOn: "2026-07-29",
    sourceClass: "professional_society_guideline",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Attribute authors and source, link the license, identify changes, and screen third-party material.",
    authorityAssessment:
      "Global multi-society pathway based on a nonsystematic English-language review.",
    usageRole: "evidence",
    evidenceClaimIds: [
      "claim.abscess.localized_collection",
      "claim.abscess.drainage_primary",
      "claim.abscess.no_collection_no_incision",
      "claim.abscess.escalation_features",
      "claim.abscess.adjunct_uncertainty",
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "src.cdc.mrsa_overview.2025",
    title:
      "Clinical Overview of Methicillin-resistant Staphylococcus aureus in Healthcare Settings",
    completeCitation:
      "Centers for Disease Control and Prevention. Clinical Overview of Methicillin-resistant Staphylococcus aureus in Healthcare Settings. Updated June 27, 2025.",
    organizationOrJournal: "Centers for Disease Control and Prevention",
    authors: [],
    publicationYear: 2025,
    doi: null,
    pmid: null,
    officialUrl:
      "https://www.cdc.gov/mrsa/hcp/clinical-overview/index.html",
    accessedOn: "2026-07-29",
    sourceClass: "government_guidance",
    licenseLabel: "U.S. federal government material; CDC conditions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes:
      "Attribute CDC, avoid logos and separately credited material, do not imply endorsement, and recheck for updates.",
    authorityAssessment: "Current U.S. government clinical overview.",
    usageRole: "both",
    evidenceClaimIds: [
      "claim.abscess.localized_collection",
      "claim.abscess.drainage_primary",
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "src.bmj.abscess_rr.2018",
    title:
      "Antibiotics after incision and drainage for uncomplicated skin abscesses",
    completeCitation:
      "Vermandere M, Aertgeerts B, Agoritsas T, et al. Antibiotics after incision and drainage for uncomplicated skin abscesses. BMJ. 2018;360:k243.",
    organizationOrJournal: "BMJ",
    authors: ["Mieke Vermandere", "Bert Aertgeerts", "Thomas Agoritsas", "et al."],
    publicationYear: 2018,
    doi: "10.1136/bmj.k243",
    pmid: null,
    officialUrl: "https://doi.org/10.1136/bmj.k243",
    accessedOn: "2026-07-29",
    sourceClass: "peer_reviewed_guideline",
    licenseLabel: "CC BY-NC 4.0",
    reuseStatus: "cc_by_nc_4_0_restricted",
    reuseNotes:
      "Metadata and targeted conflict cross-check only pending confirmation that noncommercial terms fit the project.",
    authorityAssessment:
      "GRADE rapid recommendation informed by randomized trials; useful for identifying uncertainty in categorical antibiotic claims.",
    usageRole: "cross_check",
    evidenceClaimIds: ["claim.abscess.adjunct_uncertainty"],
  },
  {
    ...PILOT_DRAFT,
    id: "src.jsge.cholelithiasis.2023",
    title: "Evidence-based clinical practice guidelines for cholelithiasis 2021",
    completeCitation:
      "Fujita N, Yasuda I, Endo I, et al. Evidence-based clinical practice guidelines for cholelithiasis 2021. J Gastroenterol. 2023;58:801-833.",
    organizationOrJournal: "Journal of Gastroenterology",
    authors: ["Naotaka Fujita", "Ichiro Yasuda", "Itaru Endo", "et al."],
    publicationYear: 2023,
    doi: "10.1007/s00535-023-02014-6",
    pmid: null,
    officialUrl: "https://doi.org/10.1007/s00535-023-02014-6",
    accessedOn: "2026-07-29",
    sourceClass: "peer_reviewed_guideline",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Attribute authors and source, link the license, identify changes, and screen third-party content.",
    authorityAssessment:
      "JSGE GRADE guideline, with searches mainly through 2019 plus manual updates.",
    usageRole: "evidence",
    evidenceClaimIds: [
      "claim.biliary.stable_pattern",
      "claim.biliary.ultrasound_evaluation",
      "claim.biliary.no_xray_substitution",
      "claim.biliary.elective_evaluation",
      "claim.biliary.management_uncertainty",
      "claim.biliary.red_flags",
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "src.wses.acute_cholecystitis.2020",
    title:
      "2020 WSES updated guidelines for diagnosis and treatment of acute calculus cholecystitis",
    completeCitation:
      "Pisano M, Allievi N, Gurusamy K, et al. 2020 WSES updated guidelines for diagnosis and treatment of acute calculus cholecystitis. World J Emerg Surg. 2020;15:61.",
    organizationOrJournal: "World Journal of Emergency Surgery",
    authors: ["Michele Pisano", "Nicola Allievi", "Kurinchi Gurusamy", "et al."],
    publicationYear: 2020,
    doi: "10.1186/s13017-020-00336-x",
    pmid: null,
    officialUrl: "https://doi.org/10.1186/s13017-020-00336-x",
    accessedOn: "2026-07-29",
    sourceClass: "professional_society_guideline",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Attribute authors and source, link the license, identify changes, and screen third-party material.",
    authorityAssessment:
      "GRADE multi-society acute cholecystitis guideline with a 2020 literature search.",
    usageRole: "both",
    evidenceClaimIds: ["claim.biliary.red_flags"],
  },
  {
    ...PILOT_DRAFT,
    id: "src.nihr.cgall.2024",
    title:
      "Laparoscopic cholecystectomy versus conservative management for adults with uncomplicated symptomatic gallstones: the C-GALL RCT",
    completeCitation:
      "Innes K, Ahmed I, Hudson J, et al. Laparoscopic cholecystectomy versus conservative management for adults with uncomplicated symptomatic gallstones: the C-GALL RCT. Health Technol Assess. 2024;28(26).",
    organizationOrJournal: "NIHR Journals Library",
    authors: ["Katie Innes", "Irfan Ahmed", "Jennifer Hudson", "et al."],
    publicationYear: 2024,
    doi: "10.3310/MNBY3104",
    pmid: null,
    officialUrl: "https://doi.org/10.3310/MNBY3104",
    accessedOn: "2026-07-29",
    sourceClass: "randomized_trial",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Attribution must include title, authors, NIHR Journals Library, DOI, license link, and any changes.",
    authorityAssessment:
      "Pragmatic multicenter randomized trial; short follow-up and crossover limit long-term conclusions.",
    usageRole: "both",
    evidenceClaimIds: [
      "claim.biliary.elective_evaluation",
      "claim.biliary.management_uncertainty",
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "src.acr.ruq_pain.2022",
    title: "ACR Appropriateness Criteria Right Upper Quadrant Pain: 2022 Update",
    completeCitation:
      "Russo GK, Zaheer A, Kamel IR, et al. ACR Appropriateness Criteria Right Upper Quadrant Pain: 2022 Update. J Am Coll Radiol. 2023;20:S211-S223.",
    organizationOrJournal: "American College of Radiology",
    authors: ["Gianna K Russo", "Atif Zaheer", "Ihab R Kamel", "et al."],
    publicationYear: 2023,
    doi: "10.1016/j.jacr.2023.02.011",
    pmid: null,
    officialUrl: "https://acsearch.acr.org/docs/69474/Narrative/",
    accessedOn: "2026-07-29",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted; permission required for reuse",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Store citation metadata and an independently worded targeted factual result only; do not reproduce tables, ratings, algorithms, or prose.",
    authorityAssessment:
      "Professional-society imaging guidance reviewed on a recurring schedule.",
    usageRole: "cross_check",
    evidenceClaimIds: ["claim.biliary.no_xray_substitution"],
  },
  {
    ...PILOT_DRAFT,
    id: "src.oer.boundless_cardiac_physiology.2017",
    title: "Physiology of the Heart",
    completeCitation:
      "Lumen Learning. Boundless Anatomy and Physiology: Physiology of the Heart. Mt. Hood Community College Pressbooks edition. 2017.",
    organizationOrJournal: "Lumen Learning / Mt. Hood Community College",
    authors: ["Lumen Learning"],
    publicationYear: 2017,
    doi: null,
    pmid: null,
    officialUrl:
      "https://mhcc.pressbooks.pub/surveyofbodysystems/chapter/physiology-of-the-heart/",
    accessedOn: "2026-07-29",
    sourceClass: "open_educational_resource",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Attribute Lumen Learning and the hosting edition, link the license, identify changes, and screen separately credited material. Only independently written facts are stored.",
    authorityAssessment:
      "Open anatomy and physiology reference used only to bound resting adult heart-rate and paired blood-pressure simulation values.",
    usageRole: "evidence",
    evidenceClaimIds: ["claim.physiology.resting_adult_ranges"],
  },
  {
    ...PILOT_DRAFT,
    id: "src.oer.nicolet_vital_signs.2022",
    title: "Nursing Skills: Vital Signs",
    completeCitation:
      "Open Resources for Nursing (Open RN). Nursing Skills: 1.3 Vital Signs. Nicolet College Pressbooks. 2022.",
    organizationOrJournal: "Nicolet College / Open RN",
    authors: ["Open Resources for Nursing (Open RN)"],
    publicationYear: 2022,
    doi: null,
    pmid: null,
    officialUrl:
      "https://nicoletcollege.pressbooks.pub/nicoletnursingskills/chapter/1-3-vital-signs/",
    accessedOn: "2026-07-29",
    sourceClass: "open_educational_resource",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Attribute Nicolet College and Open RN, link the license, identify changes, and screen separately credited material. Only independently written facts are stored.",
    authorityAssessment:
      "Open nursing-skills reference used only to bound oral-temperature and pulse-oximetry simulation values.",
    usageRole: "evidence",
    evidenceClaimIds: [
      "claim.physiology.resting_adult_ranges",
      "claim.physiology.oxygen_saturation_range",
    ],
  },
] satisfies ClinicalSource[];

export const LAC_ABS_BIL_CLAIMS = [
  {
    ...PILOT_DRAFT,
    id: "claim.laceration.preclosure_assessment",
    statement:
      "Before routine repair of a hand laceration, evaluate the wound's mechanism, location, depth, contamination, possible foreign material, and distal motor and sensory function.",
    sourceIds: ["src.wses.traumatic_wounds.2016"],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "The source is an older Delphi paper and gives the most explicit tendon and nerve guidance for hand wounds.",
    applicablePopulation: ADULT_NONPREGNANT,
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.laceration.foreign_material",
    statement:
      "Visible contamination should be removed, and concern for retained material requires deliberate evaluation rather than blind closure.",
    sourceIds: ["src.wses.traumatic_wounds.2016"],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "Imaging choice depends on material and anatomy and is not a pilot teaching point.",
    applicablePopulation: ADULT_NONPREGNANT,
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.laceration.tetanus_basis",
    statement:
      "Wound category and vaccination history determine tetanus prophylaxis; antibiotics are not tetanus prophylaxis.",
    sourceIds: ["src.cdc.tetanus_wound.2025"],
    evidenceCategory: "management",
    certainty: "high",
    limitation: null,
    applicablePopulation:
      "Adults with traumatic wounds; immune-deficiency exceptions are excluded from this pilot.",
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.laceration.tetanus_matrix",
    statement:
      "For an immunocompetent adult with a completed primary series, a clean minor wound calls for a booster at ten or more years since the last dose, while a dirty or major wound calls for a booster at five or more years; TIG is not indicated for either finite profile.",
    sourceIds: ["src.cdc.tetanus_wound.2025"],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "Unknown or incomplete vaccination histories and immune-deficiency exceptions require additional rules not scored here.",
    applicablePopulation:
      "Adults with a completed tetanus primary series and no severe immunodeficiency.",
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.laceration.deep_injury_escalation",
    statement:
      "A hand wound with abnormal active tendon function or a new distal sensory deficit is outside the simple-laceration phenotype and should not proceed as routine clinic closure.",
    sourceIds: ["src.wses.traumatic_wounds.2016"],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "The exact referral destination depends on local capability and requires clinician review.",
    applicablePopulation: ADULT_NONPREGNANT,
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.abscess.localized_collection",
    statement:
      "An uncomplicated cutaneous abscess is a localized purulent collection without suspected deep extension, extensive surrounding inflammation, or systemic illness.",
    sourceIds: ["src.wses.ssti_pathways.2022", "src.cdc.mrsa_overview.2025"],
    evidenceCategory: "definition",
    certainty: "moderate",
    limitation:
      "No single surface finding establishes a collection with perfect accuracy.",
    applicablePopulation: ADULT_NONPREGNANT,
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.abscess.drainage_primary",
    statement:
      "Source control by incision and drainage is the central treatment for a drainable uncomplicated cutaneous abscess.",
    sourceIds: ["src.wses.ssti_pathways.2022", "src.cdc.mrsa_overview.2025"],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "This does not establish the setting, anesthesia, packing, culture, or adjunct-antibiotic plan.",
    applicablePopulation: ADULT_NONPREGNANT,
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.abscess.no_collection_no_incision",
    statement:
      "Diffuse nonpurulent inflammation without a focal collection does not provide a target for incision and drainage.",
    sourceIds: ["src.wses.ssti_pathways.2022"],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "When examination is uncertain, ultrasound may be useful where available; this clinic does not substitute plain radiography.",
    applicablePopulation: ADULT_NONPREGNANT,
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.abscess.escalation_features",
    statement:
      "Rapid progression, extensive spread, hemodynamic disturbance, suspected deep involvement, necrosis, or systemic illness moves a purulent infection outside the simple-abscess pathway.",
    sourceIds: ["src.wses.ssti_pathways.2022"],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "The pilot does not teach a numerical threshold or medication regimen.",
    applicablePopulation: ADULT_NONPREGNANT,
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.abscess.adjunct_uncertainty",
    statement:
      "Some abscess presentations need treatment beyond drainage alone, so this pilot does not teach that antibiotics are always required or never useful.",
    sourceIds: ["src.wses.ssti_pathways.2022", "src.bmj.abscess_rr.2018"],
    evidenceCategory: "management",
    certainty: "conflicting",
    limitation:
      "Drug selection, threshold, duration, and trade-offs are intentionally withheld.",
    applicablePopulation: ADULT_NONPREGNANT,
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.biliary.stable_pattern",
    statement:
      "Gallbladder stones may produce episodic upper abdominal pain with nausea or vomiting; fever is not part of the uncomplicated stable phenotype.",
    sourceIds: ["src.jsge.cholelithiasis.2023"],
    evidenceCategory: "presentation",
    certainty: "moderate",
    limitation:
      "The pilot does not impose a rigid pain-duration rule or demographic stereotype.",
    applicablePopulation: ADULT_NONPREGNANT,
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.biliary.ultrasound_evaluation",
    statement:
      "Stable symptoms suggestive of gallbladder stones are evaluated with formal abdominal ultrasound and appropriate blood testing.",
    sourceIds: ["src.jsge.cholelithiasis.2023"],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "The exact laboratory panel and test timing are not scored in this pilot.",
    applicablePopulation: ADULT_NONPREGNANT,
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.biliary.no_xray_substitution",
    statement:
      "Plain abdominal radiography should not replace formal ultrasound when gallstone disease is suspected.",
    sourceIds: ["src.jsge.cholelithiasis.2023", "src.acr.ruq_pain.2022"],
    evidenceCategory: "safety_boundary",
    certainty: "high",
    limitation:
      "ACR material is used only for targeted factual verification and citation.",
    applicablePopulation: ADULT_NONPREGNANT,
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.biliary.elective_evaluation",
    statement:
      "A stable adult with symptomatic, image-confirmed gallstones and no urgent features warrants elective specialist evaluation rather than emergency transfer or no follow-up.",
    sourceIds: ["src.jsge.cholelithiasis.2023", "src.nihr.cgall.2024"],
    evidenceCategory: "disposition",
    certainty: "high",
    limitation:
      "This teaches referral and shared evaluation, not that every patient must undergo surgery.",
    applicablePopulation: ADULT_NONPREGNANT,
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.biliary.management_uncertainty",
    statement:
      "Guidelines commonly recommend laparoscopic cholecystectomy, while randomized evidence supports discussing short-term conservative management for selected uncomplicated patients; longer-term comparative outcomes remain uncertain.",
    sourceIds: ["src.jsge.cholelithiasis.2023", "src.nihr.cgall.2024"],
    evidenceCategory: "management",
    certainty: "conflicting",
    limitation:
      "The pilot therefore does not score automatic surgery for every stable patient.",
    applicablePopulation:
      "Selected adults with uncomplicated symptomatic gallstones.",
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.biliary.red_flags",
    statement:
      "Fever, jaundice, persistent or worsening pain, peritoneal findings, or physiologic disturbance make an uncomplicated biliary-colic label unsafe and require urgent evaluation for a complication.",
    sourceIds: [
      "src.jsge.cholelithiasis.2023",
      "src.wses.acute_cholecystitis.2020",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "This is a conservative outpatient-triage synthesis; it does not diagnose a specific complication.",
    applicablePopulation: ADULT_NONPREGNANT,
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.physiology.resting_adult_ranges",
    statement:
      "For this pilot's stable adult overlays, heart rate, paired blood pressure, and oral temperature are sampled only within openly published resting-adult reference bounds.",
    sourceIds: [
      "src.oer.boundless_cardiac_physiology.2017",
      "src.oer.nicolet_vital_signs.2022",
    ],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "The overlays use narrower editorial subsets of the source ranges and do not define patient-specific normality, acuity, or treatment thresholds.",
    applicablePopulation:
      "Adults without a meaningful comorbidity or physiologic exception in this early pilot.",
    lastCheckedOn: "2026-07-29",
  },
  {
    ...PILOT_DRAFT,
    id: "claim.physiology.oxygen_saturation_range",
    statement:
      "The pilot's room-air oxygen-saturation values remain within the open nursing reference target range for adults without chronic respiratory disease.",
    sourceIds: ["src.oer.nicolet_vital_signs.2022"],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "Pulse oximetry is an estimate and individual baselines, measurement conditions, altitude, and respiratory disease can change interpretation; those exceptions are excluded here.",
    applicablePopulation:
      "Adults without chronic respiratory disease or another oxygenation exception in this early pilot.",
    lastCheckedOn: "2026-07-29",
  },
] satisfies EvidenceClaim[];

const LAC_L0 = "phenotype.laceration.clean-superficial.l0";
const LAC_TETANUS_L1 = "phenotype.laceration.tetanus-decision.l1";
const LAC_DEEP_L1 = "phenotype.laceration.deep-structure-concern.l1";
const ABS_L0 = "phenotype.abscess.localized-fluctuant.l0";
const ABS_CELLULITIS_L1 = "phenotype.abscess.nonpurulent-differential.l1";
const ABS_ESCALATE_L1 = "phenotype.abscess.rapid-spread.l1";
const BIL_L0 = "phenotype.biliary.known-stones-stable.l0";
const BIL_US_L1 = "phenotype.biliary.needs-ultrasound.l1";
const BIL_RED_L1 = "phenotype.biliary.complication-red-flags.l1";

const STABLE_PHENOTYPES = [
  LAC_L0,
  LAC_TETANUS_L1,
  ABS_L0,
  ABS_CELLULITIS_L1,
  BIL_L0,
  BIL_US_L1,
];
const URGENT_STABLE_PHENOTYPES = [LAC_DEEP_L1, ABS_ESCALATE_L1, BIL_RED_L1];

export const LAC_ABS_BIL_PHYSIOLOGY_OVERLAYS = [
  {
    ...PILOT_DRAFT,
    id: "physiology.pilot.stable-a",
    displayName: "Stable adult physiology",
    acuity: "stable",
    compatiblePhenotypeIds: STABLE_PHENOTYPES,
    vitalRanges: {
      heartRateBpm: { minimum: 60, maximum: 96 },
      systolicBloodPressureMmHg: { minimum: 100, maximum: 120 },
      diastolicBloodPressureMmHg: { minimum: 60, maximum: 80 },
      temperatureF: { minimum: 97.7, maximum: 99.1 },
      oxygenSaturationPercent: { minimum: 95, maximum: 98 },
    },
    requiredFindings: [],
    excludedFindings: [
      "hemodynamic instability",
      "hypoxemia",
      "marked physiologic disturbance",
    ],
    evidenceClaimIds: [
      "claim.physiology.resting_adult_ranges",
      "claim.physiology.oxygen_saturation_range",
    ],
    generationBasis: "editorial_simulation",
  },
  {
    ...PILOT_DRAFT,
    id: "physiology.pilot.urgent-but-stable-a",
    displayName: "Urgent presentation with preserved physiology",
    acuity: "urgent_stable",
    compatiblePhenotypeIds: URGENT_STABLE_PHENOTYPES,
    vitalRanges: {
      heartRateBpm: { minimum: 72, maximum: 100 },
      systolicBloodPressureMmHg: { minimum: 100, maximum: 120 },
      diastolicBloodPressureMmHg: { minimum: 60, maximum: 80 },
      temperatureF: { minimum: 97.7, maximum: 99.1 },
      oxygenSaturationPercent: { minimum: 95, maximum: 98 },
    },
    requiredFindings: [],
    excludedFindings: [
      "shock",
      "hypoxemia",
      "marked physiologic disturbance",
    ],
    evidenceClaimIds: [
      "claim.physiology.resting_adult_ranges",
      "claim.physiology.oxygen_saturation_range",
    ],
    generationBasis: "editorial_simulation",
  },
] satisfies PhysiologyOverlay[];

function phenotype(
  input: Omit<
    PresentationPhenotype,
    | keyof typeof PILOT_DRAFT
    | "presentationSetting"
    | "evidenceSupportedAgeBands"
    | "sexGenerationPolicy"
    | "bmiGenerationPolicy"
    | "simulationWeight"
    | "comorbidityPolicy"
  >,
): PresentationPhenotype {
  return {
    ...PILOT_DRAFT,
    presentationSetting: "outpatient_surgical_clinic",
    evidenceSupportedAgeBands: [...GENERAL_ADULT_AGE_BANDS],
    sexGenerationPolicy: { ...GENERAL_ADULT_SEX_POLICY },
    bmiGenerationPolicy: { ...BROAD_ADULT_BMI_POLICY },
    simulationWeight: { ...EQUAL_EDITORIAL_WEIGHT },
    comorbidityPolicy: "suppress_meaningful_comorbidities",
    ...input,
  };
}

export const LAC_ABS_BIL_PHENOTYPES = [
  phenotype({
    id: LAC_L0,
    diagnosisFamilyId: "traumatic_laceration",
    displayName: "Clean superficial laceration",
    educationalTier: 0,
    acuity: "stable",
    requiredFacilityCapabilityIds: ["capability.examination"],
    allowedDispositions: ["clinic_treatment"],
    requiredFindings: [
      "clean superficial hand laceration",
      "controlled bleeding",
    ],
    commonOptionalFindings: ["recent sharp-object mechanism"],
    possibleFindings: ["mild local tenderness"],
    uncommonFindings: [],
    excludedFindings: [
      "bite",
      "puncture wound",
      "gross contamination",
      "retained foreign material concern",
      "wound infection",
      "tendon deficit",
      "nerve deficit",
      "vascular deficit",
    ],
    redFlags: ["abnormal tendon or nerve function"],
    physiologyOverlayIds: ["physiology.pilot.stable-a"],
    compatibleResults: [],
    differentialDiagnoses: ["deeper tendon injury", "retained foreign body"],
    generationConstraints: [
      "Adult and nonpregnant.",
      "No meaningful comorbidity.",
      "Do not use a universal closure-time cutoff.",
    ],
    clinicalProbabilityNotes: [
      "No diagnosis-specific demographic probability is claimed.",
    ],
    evidenceClaimIds: [
      "claim.laceration.preclosure_assessment",
      "claim.laceration.foreign_material",
    ],
    chiefComplaint: "Recent superficial cut",
    presentationTemplate:
      "A stable adult presents with a recent uncomplicated cut. The wound has not yet been anesthetized or closed.",
  }),
  phenotype({
    id: LAC_TETANUS_L1,
    diagnosisFamilyId: "traumatic_laceration",
    displayName: "Laceration with a tetanus prophylaxis decision",
    educationalTier: 1,
    acuity: "stable",
    requiredFacilityCapabilityIds: ["capability.examination"],
    allowedDispositions: ["clinic_treatment", "procedural_referral"],
    requiredFindings: [
      "superficial wound",
      "completed primary tetanus series documented",
      "date of last tetanus dose available",
    ],
    commonOptionalFindings: ["controlled bleeding"],
    possibleFindings: [],
    uncommonFindings: [],
    excludedFindings: [
      "structural injury",
      "wound infection",
      "severe immunodeficiency",
      "pregnancy",
    ],
    redFlags: [],
    physiologyOverlayIds: ["physiology.pilot.stable-a"],
    compatibleResults: ["documented vaccination history"],
    differentialDiagnoses: [],
    generationConstraints: [
      "Use only the two authored finite vaccination-history profiles.",
      "Do not generate HIV or severe immunodeficiency exceptions.",
    ],
    clinicalProbabilityNotes: [
      "Vaccination profile selection is editorial, not epidemiologic.",
    ],
    evidenceClaimIds: [
      "claim.laceration.tetanus_basis",
      "claim.laceration.tetanus_matrix",
    ],
    chiefComplaint: "Superficial wound and tetanus question",
    presentationTemplate:
      "A stable adult presents with a superficial wound, controlled bleeding, and an available vaccination record.",
  }),
  phenotype({
    id: LAC_DEEP_L1,
    diagnosisFamilyId: "traumatic_laceration",
    displayName: "Hand laceration with deeper-structure concern",
    educationalTier: 1,
    acuity: "urgent_stable",
    requiredFacilityCapabilityIds: ["capability.examination"],
    allowedDispositions: ["prompt_specialty_referral"],
    requiredFindings: [
      "hand laceration",
      "new difficulty actively moving one finger",
    ],
    commonOptionalFindings: ["controlled bleeding"],
    possibleFindings: [],
    uncommonFindings: [],
    excludedFindings: ["shock", "uncontrolled hemorrhage", "routine simple closure"],
    redFlags: ["abnormal tendon function"],
    physiologyOverlayIds: ["physiology.pilot.urgent-but-stable-a"],
    compatibleResults: [],
    differentialDiagnoses: ["tendon laceration"],
    generationConstraints: [
      "Do not label a specific structure definitively before higher-level evaluation.",
    ],
    clinicalProbabilityNotes: [
      "No probability is assigned to tendon or nerve injury.",
    ],
    evidenceClaimIds: ["claim.laceration.deep_injury_escalation"],
    chiefComplaint: "Hand cut with abnormal function",
    presentationTemplate:
      "A stable adult presents after a hand laceration with a newly abnormal distal functional examination.",
  }),
  phenotype({
    id: ABS_L0,
    diagnosisFamilyId: "cutaneous_abscess",
    displayName: "Localized fluctuant cutaneous abscess",
    educationalTier: 0,
    acuity: "stable",
    requiredFacilityCapabilityIds: ["capability.examination"],
    allowedDispositions: ["procedural_referral"],
    requiredFindings: [
      "localized fluctuant superficial collection",
      "accessible upper-back location",
      "no systemic illness",
    ],
    commonOptionalFindings: ["visible purulent focus"],
    possibleFindings: ["localized tenderness"],
    uncommonFindings: [],
    excludedFindings: [
      "rapid progression",
      "extensive surrounding inflammation",
      "suspected deep infection",
      "necrosis",
      "special anatomic location",
      "recurrent disease",
    ],
    redFlags: ["rapid spread", "systemic illness", "suspected deep involvement"],
    physiologyOverlayIds: ["physiology.pilot.stable-a"],
    compatibleResults: [],
    differentialDiagnoses: ["nonpurulent cellulitis", "inflamed cyst"],
    generationConstraints: [
      "No meaningful comorbidity or immunocompromise.",
      "Do not ask for a specific antibiotic.",
    ],
    clinicalProbabilityNotes: [
      "No lesion-size probability or threshold is claimed.",
    ],
    evidenceClaimIds: [
      "claim.abscess.localized_collection",
      "claim.abscess.drainage_primary",
    ],
    chiefComplaint: "Localized painful skin swelling",
    presentationTemplate:
      "A stable adult has one superficial, accessible, fluctuant skin collection without systemic illness or extensive spread.",
  }),
  phenotype({
    id: ABS_CELLULITIS_L1,
    diagnosisFamilyId: "cutaneous_abscess",
    displayName: "Nonpurulent inflammation without a drainage target",
    educationalTier: 1,
    acuity: "stable",
    requiredFacilityCapabilityIds: ["capability.examination"],
    allowedDispositions: ["clinic_treatment"],
    requiredFindings: [
      "diffuse erythema and warmth",
      "no focal fluctuance, drainage, or palpable cavity",
    ],
    commonOptionalFindings: ["diffuse tenderness"],
    possibleFindings: [],
    uncommonFindings: [],
    excludedFindings: [
      "focal purulent collection",
      "systemic illness",
      "necrosis",
      "rapid progression",
    ],
    redFlags: ["rapid progression", "necrosis", "systemic illness"],
    physiologyOverlayIds: ["physiology.pilot.stable-a"],
    compatibleResults: [],
    differentialDiagnoses: ["nonpurulent cellulitis"],
    generationConstraints: [
      "Cellulitis remains a differential, not a complete diagnosis entry.",
      "Do not substitute X-ray for ultrasound when examination is uncertain.",
    ],
    clinicalProbabilityNotes: [
      "No diagnostic sensitivity is assigned to any single surface finding.",
    ],
    evidenceClaimIds: [
      "claim.abscess.localized_collection",
      "claim.abscess.no_collection_no_incision",
    ],
    chiefComplaint: "Diffuse red tender skin",
    presentationTemplate:
      "A stable adult has diffuse nonpurulent skin inflammation without a focal collection on examination.",
  }),
  phenotype({
    id: ABS_ESCALATE_L1,
    diagnosisFamilyId: "cutaneous_abscess",
    displayName: "Purulent infection with rapid spread",
    educationalTier: 1,
    acuity: "urgent_stable",
    requiredFacilityCapabilityIds: ["capability.examination"],
    allowedDispositions: ["emergency_department_transfer"],
    requiredFindings: [
      "suspected purulent collection",
      "rapidly progressive extensive surrounding inflammation",
    ],
    commonOptionalFindings: ["pain extending beyond the focal collection"],
    possibleFindings: ["subjective chills"],
    uncommonFindings: [],
    excludedFindings: [
      "uncomplicated localized label",
      "routine isolated clinic drainage plan",
      "shock",
    ],
    redFlags: [
      "rapid progression",
      "extensive spread",
      "suspected deep involvement",
      "necrosis",
    ],
    physiologyOverlayIds: ["physiology.pilot.urgent-but-stable-a"],
    compatibleResults: [],
    differentialDiagnoses: ["deep soft-tissue infection", "necrotizing infection"],
    generationConstraints: [
      "Do not score medication choice or a numerical systemic threshold.",
    ],
    clinicalProbabilityNotes: [
      "Risk-feature selection is a finite editorial profile.",
    ],
    evidenceClaimIds: [
      "claim.abscess.escalation_features",
      "claim.abscess.adjunct_uncertainty",
    ],
    chiefComplaint: "Rapidly worsening skin infection",
    presentationTemplate:
      "A stable adult has a suspected purulent skin collection with rapidly expanding surrounding inflammation.",
  }),
  phenotype({
    id: BIL_L0,
    diagnosisFamilyId: "symptomatic_cholelithiasis",
    displayName: "Stable biliary symptoms with known gallstones",
    educationalTier: 0,
    acuity: "stable",
    requiredFacilityCapabilityIds: ["capability.examination"],
    allowedDispositions: ["elective_surgical_referral"],
    requiredFindings: [
      "credible prior ultrasound showing gallstones",
      "recurrent episodic compatible upper abdominal pain",
      "currently stable and comfortable",
    ],
    commonOptionalFindings: ["nausea during prior attacks"],
    possibleFindings: [],
    uncommonFindings: [],
    excludedFindings: [
      "fever",
      "jaundice",
      "persistent or worsening pain",
      "peritoneal findings",
      "marked physiologic disturbance",
    ],
    redFlags: [
      "fever",
      "jaundice",
      "persistent pain",
      "peritoneal findings",
    ],
    physiologyOverlayIds: ["physiology.pilot.stable-a"],
    compatibleResults: ["prior ultrasound demonstrates gallstones"],
    differentialDiagnoses: [
      "acute cholecystitis",
      "choledocholithiasis",
      "pancreatitis",
      "cholangitis",
    ],
    generationConstraints: [
      "Do not make every patient female or obese.",
      "Do not generate urgent features while labeling the case uncomplicated.",
    ],
    clinicalProbabilityNotes: [
      "No sex, BMI, or symptom-duration probability is used.",
    ],
    evidenceClaimIds: [
      "claim.biliary.stable_pattern",
      "claim.biliary.elective_evaluation",
      "claim.biliary.management_uncertainty",
    ],
    chiefComplaint: "Recurring upper abdominal pain with known gallstones",
    presentationTemplate:
      "A stable adult with gallstones demonstrated on a credible prior ultrasound reports recurrent compatible pain that has now resolved.",
  }),
  phenotype({
    id: BIL_US_L1,
    diagnosisFamilyId: "symptomatic_cholelithiasis",
    displayName: "Stable biliary symptoms needing formal ultrasound",
    educationalTier: 1,
    acuity: "stable",
    requiredFacilityCapabilityIds: ["capability.examination"],
    allowedDispositions: ["outpatient_testing"],
    requiredFindings: [
      "episodic upper abdominal pain that is currently resolved",
      "no definitive prior gallbladder imaging",
      "no fever, jaundice, or peritoneal tenderness",
    ],
    commonOptionalFindings: ["nausea during pain"],
    possibleFindings: ["normal prior plain abdominal radiograph"],
    uncommonFindings: [],
    excludedFindings: [
      "fever",
      "jaundice",
      "persistent or worsening pain",
      "peritoneal findings",
      "clinic ultrasound",
      "clinic CT",
    ],
    redFlags: ["fever", "jaundice", "persistent pain", "peritoneal findings"],
    physiologyOverlayIds: ["physiology.pilot.stable-a"],
    compatibleResults: ["formal outpatient ultrasound planned"],
    differentialDiagnoses: ["peptic disease", "pancreatitis", "hepatic disease"],
    generationConstraints: [
      "Do not substitute plain X-ray for ultrasound.",
      "Do not invent an onsite ultrasound or CT capability.",
    ],
    clinicalProbabilityNotes: [
      "No exact pretest probability is assigned.",
    ],
    evidenceClaimIds: [
      "claim.biliary.ultrasound_evaluation",
      "claim.biliary.no_xray_substitution",
    ],
    chiefComplaint: "Episodic upper abdominal pain without prior imaging",
    presentationTemplate:
      "A stable adult reports episodic biliary-type upper abdominal symptoms but has not had definitive gallbladder imaging.",
  }),
  phenotype({
    id: BIL_RED_L1,
    diagnosisFamilyId: "symptomatic_cholelithiasis",
    displayName: "Biliary symptoms with complication red flags",
    educationalTier: 1,
    acuity: "urgent_stable",
    requiredFacilityCapabilityIds: ["capability.examination"],
    allowedDispositions: ["emergency_department_transfer"],
    requiredFindings: [
      "credible prior ultrasound showing gallstones",
      "persistent worsening right upper abdominal pain",
      "new jaundice",
    ],
    commonOptionalFindings: [],
    possibleFindings: [],
    uncommonFindings: [],
    excludedFindings: [
      "uncomplicated biliary colic label",
      "routine elective-only disposition",
      "clinic CT",
      "plain X-ray substitution",
      "shock",
    ],
    redFlags: [
      "jaundice",
      "persistent worsening pain",
      "peritoneal findings",
    ],
    physiologyOverlayIds: ["physiology.pilot.urgent-but-stable-a"],
    compatibleResults: [],
    differentialDiagnoses: [
      "acute cholecystitis",
      "choledocholithiasis",
      "cholangitis",
      "pancreatitis",
    ],
    generationConstraints: [
      "End the outpatient case at emergency evaluation.",
      "Do not assign a definitive complication diagnosis.",
    ],
    clinicalProbabilityNotes: [
      "The red-flag profile is editorial and does not represent prevalence.",
    ],
    evidenceClaimIds: ["claim.biliary.red_flags"],
    chiefComplaint: "Persistent right upper abdominal pain with a new red flag",
    presentationTemplate:
      "A stable adult with gallstones documented on prior ultrasound now has persistent worsening pain and a new complication warning sign.",
  }),
] satisfies PresentationPhenotype[];

const concept = (
  input: Omit<PilotConcept, keyof typeof PILOT_DRAFT>,
): PilotConcept => ({ ...PILOT_DRAFT, ...input });

export const LAC_ABS_BIL_CONCEPTS = [
  concept({
    id: "concept.laceration.preclosure-assessment",
    displayName: "Pre-closure laceration assessment",
    learningObjective:
      "Evaluate wound depth, contamination, foreign material risk, and distal structural function before routine closure.",
    educationalTier: 0,
    conceptType: "workup",
    diagnosisFamilyIds: ["traumatic_laceration"],
    phenotypeIds: [LAC_L0],
    correctAction:
      "Assess the wound and document distal motor and sensory function before selecting repair.",
    requiredCapabilityIds: ["capability.examination"],
    disposition: "clinic_treatment",
    evidenceClaimIds: [
      "claim.laceration.preclosure_assessment",
      "claim.laceration.foreign_material",
    ],
    questionVariants: [
      questionVariant({
        id: "question.laceration.preclosure-assessment.v1",
        conceptId: "concept.laceration.preclosure-assessment",
        stem:
          "Before deciding whether to close this clean superficial hand wound, what should be done first?",
        answerChoices: [
          answer(
            "choice.laceration.preclosure.correct",
            "Assess wound depth and distal motor-sensory function before closure",
            true,
            null,
          ),
          answer(
            "choice.laceration.preclosure.close-now",
            "Close the skin immediately without a structural examination",
            false,
            "Immediate closure skips the assessment needed to detect contamination, foreign material, or deeper injury.",
          ),
          answer(
            "choice.laceration.preclosure.antibiotics",
            "Give antibiotics and use that response to exclude tendon or nerve injury",
            false,
            "Antibiotics do not evaluate wound depth or distal tendon and nerve function.",
          ),
          answer(
            "choice.laceration.preclosure.xray",
            "Review vaccination history but omit wound exploration and the distal examination",
            false,
            "Vaccination review is separate from the wound and distal-function assessment required before routine repair.",
          ),
        ],
        explanation:
          "Routine repair begins with a deliberate wound and distal-function assessment. This case is simple only after deeper injury, contamination, and retained material concerns are excluded.",
        supportingEvidenceClaimIds: [
          "claim.laceration.preclosure_assessment",
          "claim.laceration.foreign_material",
        ],
      }),
      questionVariant({
        id: "question.laceration.preclosure-assessment.v2",
        conceptId: "concept.laceration.preclosure-assessment",
        stem:
          "A stable adult has a small clean hand cut. Which step belongs before anesthesia or routine closure?",
        answerChoices: [
          answer(
            "choice.laceration.preclosure.correct",
            "Inspect and explore as appropriate, then record active motion and distal sensation",
            true,
            null,
          ),
          answer(
            "choice.laceration.preclosure.close-now",
            "Suture first and check hand function only if symptoms appear later",
            false,
            "Closing first can obscure or delay recognition of a deeper structural injury.",
          ),
          answer(
            "choice.laceration.preclosure.antibiotics",
            "Use one antibiotic dose as proof that the wound is superficial",
            false,
            "An antibiotic dose cannot establish wound depth or intact tendon and nerve function.",
          ),
          answer(
            "choice.laceration.preclosure.xray",
            "Check only passive movement and omit active tendon and sensory testing",
            false,
            "Passive movement alone does not establish intact active tendon function or a complete distal examination.",
          ),
        ],
        explanation:
          "The examination should establish the wound's extent and distal tendon and nerve status before routine closure proceeds.",
        supportingEvidenceClaimIds: [
          "claim.laceration.preclosure_assessment",
          "claim.laceration.foreign_material",
        ],
      }),
    ],
  }),
  concept({
    id: "concept.prototype.laceration.tetanus",
    displayName: "Laceration tetanus prophylaxis",
    learningObjective:
      "Apply the CDC wound-category and vaccination-history matrix without using antibiotics as tetanus prophylaxis.",
    educationalTier: 1,
    conceptType: "management",
    diagnosisFamilyIds: ["traumatic_laceration"],
    phenotypeIds: [LAC_TETANUS_L1],
    correctAction:
      "Provide or arrange the indicated tetanus vaccine booster without TIG for the finite completed-series profiles.",
    requiredCapabilityIds: ["capability.examination"],
    disposition: "clinic_treatment",
    evidenceClaimIds: [
      "claim.laceration.tetanus_basis",
      "claim.laceration.tetanus_matrix",
    ],
    questionVariants: [
      questionVariant({
        id: "question.laceration.tetanus.v1",
        conceptId: "concept.prototype.laceration.tetanus",
        stem:
          "This is a clean minor wound. The patient completed the primary tetanus series and last received a tetanus-containing vaccine 11 years ago. What prophylaxis is indicated?",
        answerChoices: [
          answer(
            "choice.laceration.tetanus.correct",
            "Give or arrange a tetanus-containing vaccine booster; TIG is not indicated",
            true,
            null,
          ),
          answer(
            "choice.laceration.tetanus.none",
            "No tetanus prophylaxis is needed because the primary series was completed",
            false,
            "A completed series does not remove the booster indication for a clean minor wound when ten or more years have elapsed.",
          ),
          answer(
            "choice.laceration.tetanus.tig",
            "Give TIG alone and withhold the vaccine",
            false,
            "TIG is not indicated for a clean minor wound, and it does not replace an indicated booster.",
          ),
          answer(
            "choice.laceration.tetanus.antibiotics",
            "Use antibiotics instead of vaccination",
            false,
            "Antibiotics are not tetanus prophylaxis.",
          ),
        ],
        explanation:
          "For a clean minor wound after a completed primary series, ten or more years since the last dose calls for a booster; TIG is not used for clean minor wounds.",
        supportingEvidenceClaimIds: [
          "claim.laceration.tetanus_basis",
          "claim.laceration.tetanus_matrix",
        ],
      }),
      questionVariant({
        id: "question.laceration.tetanus.v2",
        conceptId: "concept.prototype.laceration.tetanus",
        stem:
          "This superficial wound is dirty. The patient completed the primary tetanus series and the last tetanus-containing dose was 6 years ago. What should be arranged?",
        answerChoices: [
          answer(
            "choice.laceration.tetanus.correct",
            "Give a tetanus-containing booster; TIG is not indicated",
            true,
            null,
          ),
          answer(
            "choice.laceration.tetanus.none",
            "Wait until ten years have elapsed because every wound uses the same interval",
            false,
            "Dirty or major wounds use the five-year booster interval after a completed primary series.",
          ),
          answer(
            "choice.laceration.tetanus.tig",
            "Give TIG alone because every dirty wound requires TIG",
            false,
            "TIG is not automatically indicated for every dirty wound and does not replace an indicated booster.",
          ),
          answer(
            "choice.laceration.tetanus.antibiotics",
            "Use systemic antibiotics as the tetanus-prevention plan",
            false,
            "Antibiotics do not prevent tetanus.",
          ),
        ],
        explanation:
          "For a dirty or major wound after a completed primary series, five or more years since the last dose calls for a booster. This finite profile does not call for TIG.",
        supportingEvidenceClaimIds: [
          "claim.laceration.tetanus_basis",
          "claim.laceration.tetanus_matrix",
        ],
      }),
    ],
  }),
  concept({
    id: "concept.laceration.deep-structure-referral",
    displayName: "Laceration deeper-structure referral",
    learningObjective:
      "Recognize a hand laceration with an abnormal active-tendon examination as outside routine clinic closure.",
    educationalTier: 1,
    conceptType: "disposition",
    diagnosisFamilyIds: ["traumatic_laceration"],
    phenotypeIds: [LAC_DEEP_L1],
    correctAction:
      "Stop routine closure and arrange prompt specialist-capable tendon evaluation.",
    requiredCapabilityIds: ["capability.examination"],
    disposition: "prompt_specialty_referral",
    evidenceClaimIds: ["claim.laceration.deep_injury_escalation"],
    questionVariants: [
      questionVariant({
        id: "question.laceration.deep-structure-referral.v1",
        conceptId: "concept.laceration.deep-structure-referral",
        stem:
          "A hand laceration has controlled bleeding, but the patient cannot actively flex the affected digit. What is the safest next step?",
        answerChoices: [
          answer(
            "choice.laceration.deep.correct",
            "Do not treat it as a simple closure; arrange prompt higher-level tendon evaluation",
            true,
            null,
          ),
          answer(
            "choice.laceration.deep.close-first",
            "Close the skin routinely and defer the motion deficit to a distant follow-up",
            false,
            "Abnormal active motion raises concern for deeper structural injury that should be evaluated before routine closure.",
          ),
          answer(
            "choice.laceration.deep.xray",
            "Close the skin and defer the abnormal active-motion finding to a routine later visit",
            false,
            "Routine closure and delayed review can postpone evaluation of a possible tendon injury.",
          ),
          answer(
            "choice.laceration.deep.antibiotics",
            "Prescribe antibiotics as treatment for the motion deficit",
            false,
            "Antibiotics do not evaluate or repair a suspected tendon injury.",
          ),
        ],
        explanation:
          "An active-motion deficit makes this a possible tendon injury, not the simple laceration phenotype. Prompt higher-level evaluation is required before routine closure.",
        supportingEvidenceClaimIds: [
          "claim.laceration.deep_injury_escalation",
        ],
      }),
      questionVariant({
        id: "question.laceration.deep-structure-referral.v2",
        conceptId: "concept.laceration.deep-structure-referral",
        stem:
          "A stable patient with a hand laceration has new loss of active finger flexion. How should this be managed from the prototype clinic?",
        answerChoices: [
          answer(
            "choice.laceration.deep.correct",
            "Treat the active-motion deficit as possible tendon injury and arrange prompt higher-level evaluation",
            true,
            null,
          ),
          answer(
            "choice.laceration.deep.close-first",
            "Perform routine closure without addressing the active-motion deficit",
            false,
            "A new active-motion deficit makes routine simple closure inappropriate until deeper injury is evaluated.",
          ),
          answer(
            "choice.laceration.deep.xray",
            "Reassure the patient because bleeding is controlled despite the new motion deficit",
            false,
            "Controlled bleeding does not resolve a new active-motion deficit or make routine closure appropriate.",
          ),
          answer(
            "choice.laceration.deep.antibiotics",
            "Use antibiotics to restore active finger flexion",
            false,
            "Antibiotics do not address a possible tendon laceration.",
          ),
        ],
        explanation:
          "New loss of active finger flexion is a deeper-structure warning. The clinic should not proceed as though this were a simple closure.",
        supportingEvidenceClaimIds: [
          "claim.laceration.deep_injury_escalation",
        ],
      }),
    ],
  }),
  concept({
    id: "concept.prototype.abscess.primary-treatment",
    displayName: "Drainable abscess source control",
    learningObjective:
      "Arrange incision and drainage in an appropriately equipped setting for a classic uncomplicated drainable abscess.",
    educationalTier: 0,
    conceptType: "management",
    diagnosisFamilyIds: ["cutaneous_abscess"],
    phenotypeIds: [ABS_L0],
    correctAction:
      "Arrange incision and drainage in an appropriately equipped setting.",
    requiredCapabilityIds: ["capability.examination"],
    disposition: "procedural_referral",
    evidenceClaimIds: [
      "claim.abscess.localized_collection",
      "claim.abscess.drainage_primary",
    ],
    questionVariants: [
      questionVariant({
        id: "question.abscess.primary-treatment.v1",
        conceptId: "concept.prototype.abscess.primary-treatment",
        stem:
          "What is the central treatment for this localized, fluctuant, uncomplicated cutaneous abscess?",
        answerChoices: [
          answer(
            "choice.abscess.drainage.correct",
            "Arrange incision and drainage in an appropriately equipped setting",
            true,
            null,
          ),
          answer(
            "choice.abscess.drainage.antibiotics-only",
            "Use antibiotics alone as a substitute for source control",
            false,
            "Antibiotics alone leave the drainable collection without source control.",
          ),
          answer(
            "choice.abscess.drainage.observe",
            "Observe indefinitely without a drainage plan",
            false,
            "Observation alone does not provide source control for this explicitly drainable collection.",
          ),
          answer(
            "choice.abscess.drainage.xray",
            "Attempt only manual expression and discharge without arranging drainage",
            false,
            "Manual expression is not the authored source-control plan for this drainable collection.",
          ),
        ],
        explanation:
          "This finite phenotype is superficial, accessible, fluctuant, and uncomplicated. Its central treatment is incision and drainage in a setting that can safely perform it.",
        supportingEvidenceClaimIds: [
          "claim.abscess.localized_collection",
          "claim.abscess.drainage_primary",
        ],
      }),
      questionVariant({
        id: "question.abscess.primary-treatment.v2",
        conceptId: "concept.prototype.abscess.primary-treatment",
        stem:
          "A stable adult has a localized fluctuant upper-back collection with a purulent focus and no systemic illness. Which plan addresses the collection itself?",
        answerChoices: [
          answer(
            "choice.abscess.drainage.correct",
            "Arrange source control with incision and drainage where the procedure can be performed safely",
            true,
            null,
          ),
          answer(
            "choice.abscess.drainage.antibiotics-only",
            "Choose medication alone and leave the collection undrained",
            false,
            "Medication alone does not provide source control for the authored drainable collection.",
          ),
          answer(
            "choice.abscess.drainage.observe",
            "Provide no treatment because the patient is currently stable",
            false,
            "Stable physiology does not eliminate the need to address a drainable abscess.",
          ),
          answer(
            "choice.abscess.drainage.xray",
            "Use dressing changes alone and omit a source-control plan",
            false,
            "Dressing changes do not provide source control for the documented drainable collection.",
          ),
        ],
        explanation:
          "The classic focal collection requires drainage. Adjunct-antibiotic details are deliberately not scored in this pilot.",
        supportingEvidenceClaimIds: [
          "claim.abscess.localized_collection",
          "claim.abscess.drainage_primary",
        ],
      }),
    ],
  }),
  concept({
    id: "concept.abscess.collection-vs-cellulitis",
    displayName: "Abscess versus nonpurulent inflammation",
    learningObjective:
      "Avoid routine abscess incision when examination shows diffuse nonpurulent inflammation without a focal collection.",
    educationalTier: 1,
    conceptType: "diagnosis",
    diagnosisFamilyIds: ["cutaneous_abscess"],
    phenotypeIds: [ABS_CELLULITIS_L1],
    correctAction:
      "Do not incise; continue evaluation through a nonpurulent skin-infection pathway.",
    requiredCapabilityIds: ["capability.examination"],
    disposition: "clinic_treatment",
    evidenceClaimIds: [
      "claim.abscess.localized_collection",
      "claim.abscess.no_collection_no_incision",
    ],
    questionVariants: [
      questionVariant({
        id: "question.abscess.collection-vs-cellulitis.v1",
        conceptId: "concept.abscess.collection-vs-cellulitis",
        stem:
          "The area is broad, flat, warm, and red, with no fluctuance, drainage, pustular focus, or palpable cavity. What should happen next?",
        answerChoices: [
          answer(
            "choice.abscess.cellulitis.correct",
            "Do not perform routine abscess drainage; evaluate this through the nonpurulent skin-infection pathway",
            true,
            null,
          ),
          answer(
            "choice.abscess.cellulitis.incise",
            "Incise the center even though no focal collection is identified",
            false,
            "Diffuse redness without a focal collection does not provide a drainage target.",
          ),
          answer(
            "choice.abscess.cellulitis.xray",
            "Wait for spontaneous drainage before evaluating the diffuse inflammation",
            false,
            "The absence of a drainage target redirects the current evaluation; it does not justify waiting without a nonpurulent-infection assessment.",
          ),
          answer(
            "choice.abscess.cellulitis.ignore",
            "Call it an abscess but provide no evaluation or safety net",
            false,
            "The presentation needs a nonpurulent skin-infection assessment rather than an unsupported label.",
          ),
        ],
        explanation:
          "No focal purulent collection is present in this authored phenotype, so routine incision and drainage has no target. Cellulitis remains a differential rather than a full pilot entry.",
        supportingEvidenceClaimIds: [
          "claim.abscess.localized_collection",
          "claim.abscess.no_collection_no_incision",
        ],
      }),
      questionVariant({
        id: "question.abscess.collection-vs-cellulitis.v2",
        conceptId: "concept.abscess.collection-vs-cellulitis",
        stem:
          "A stable patient has diffuse tender erythema without a focal center, purulence, or palpable fluid cavity. Which statement best fits the drainage decision?",
        answerChoices: [
          answer(
            "choice.abscess.cellulitis.correct",
            "No drainage target; use the nonpurulent evaluation pathway",
            true,
            null,
          ),
          answer(
            "choice.abscess.cellulitis.incise",
            "Every red tender area should be incised as an abscess",
            false,
            "Redness and tenderness alone do not establish a localized pus collection.",
          ),
          answer(
            "choice.abscess.cellulitis.xray",
            "Treat tenderness alone as proof of a hidden abscess",
            false,
            "Tenderness without a focal purulent finding does not establish a drainage target.",
          ),
          answer(
            "choice.abscess.cellulitis.ignore",
            "No further assessment is needed because fluctuation is absent",
            false,
            "Absence of a drainage target redirects the evaluation; it does not make diffuse inflammation irrelevant.",
          ),
        ],
        explanation:
          "The primary concept is whether there is a focal collection to drain. This case intentionally lacks one.",
        supportingEvidenceClaimIds: [
          "claim.abscess.localized_collection",
          "claim.abscess.no_collection_no_incision",
        ],
      }),
    ],
  }),
  concept({
    id: "concept.abscess.rapid-spread-escalation",
    displayName: "Abscess risk-feature escalation",
    learningObjective:
      "Recognize rapid or extensive spread as exceeding the uncomplicated clinic abscess pathway.",
    educationalTier: 1,
    conceptType: "disposition",
    diagnosisFamilyIds: ["cutaneous_abscess"],
    phenotypeIds: [ABS_ESCALATE_L1],
    correctAction:
      "Arrange prompt emergency or hospital-capable evaluation instead of isolated routine clinic drainage.",
    requiredCapabilityIds: ["capability.examination"],
    disposition: "emergency_department_transfer",
    evidenceClaimIds: [
      "claim.abscess.escalation_features",
      "claim.abscess.adjunct_uncertainty",
    ],
    questionVariants: [
      questionVariant({
        id: "question.abscess.rapid-spread-escalation.v1",
        conceptId: "concept.abscess.rapid-spread-escalation",
        stem:
          "A suspected abscess now has rapidly expanding surrounding inflammation and pain beyond the focal collection. What is the safest disposition from this clinic?",
        answerChoices: [
          answer(
            "choice.abscess.escalate.correct",
            "Arrange prompt emergency or hospital-capable evaluation",
            true,
            null,
          ),
          answer(
            "choice.abscess.escalate.routine-drainage",
            "Treat it as an isolated uncomplicated abscess with routine drainage alone",
            false,
            "Rapid extensive spread moves the case outside the simple-abscess pathway and may require more than isolated drainage.",
          ),
          answer(
            "choice.abscess.escalate.delay",
            "Schedule a routine visit in several weeks",
            false,
            "Routine delayed follow-up under-triages a rapidly progressive infection.",
          ),
          answer(
            "choice.abscess.escalate.xray",
            "Wait for a routine culture result before deciding whether to escalate",
            false,
            "A pending routine result should not delay higher-level evaluation of rapid extensive spread.",
          ),
        ],
        explanation:
          "Rapid progression and extensive spread are incompatible with the uncomplicated phenotype. The pilot ends at prompt higher-capability evaluation and does not score a medication regimen.",
        supportingEvidenceClaimIds: [
          "claim.abscess.escalation_features",
          "claim.abscess.adjunct_uncertainty",
        ],
      }),
      questionVariant({
        id: "question.abscess.rapid-spread-escalation.v2",
        conceptId: "concept.abscess.rapid-spread-escalation",
        stem:
          "The area around a purulent focus has expanded quickly since yesterday and the pain now extends well beyond it. The patient is not in shock. What should the outpatient clinic do?",
        answerChoices: [
          answer(
            "choice.abscess.escalate.correct",
            "Escalate now for hospital-capable assessment and source-control planning",
            true,
            null,
          ),
          answer(
            "choice.abscess.escalate.routine-drainage",
            "Assume stability makes routine office drainage alone sufficient",
            false,
            "Preserved physiology does not erase the authored rapid-progression warning.",
          ),
          answer(
            "choice.abscess.escalate.delay",
            "Wait for spontaneous drainage before reassessing",
            false,
            "Waiting can delay evaluation of an infection that is already progressing rapidly.",
          ),
          answer(
            "choice.abscess.escalate.xray",
            "Complete routine office treatment and reassess the rapid spread at a later visit",
            false,
            "Delayed reassessment under-triages an infection that is already progressing rapidly.",
          ),
        ],
        explanation:
          "This is urgent because of rapid spread, even though the physiology overlay remains stable. Higher-level evaluation should not be delayed.",
        supportingEvidenceClaimIds: [
          "claim.abscess.escalation_features",
          "claim.abscess.adjunct_uncertainty",
        ],
      }),
    ],
  }),
  concept({
    id: "concept.prototype.cholelithiasis.management",
    displayName: "Stable symptomatic gallstone referral",
    learningObjective:
      "Route a stable adult with image-confirmed symptomatic gallstones and no urgent features to elective specialist evaluation.",
    educationalTier: 0,
    conceptType: "disposition",
    diagnosisFamilyIds: ["symptomatic_cholelithiasis"],
    phenotypeIds: [BIL_L0],
    correctAction:
      "Arrange elective surgical or specialist evaluation and a management discussion.",
    requiredCapabilityIds: ["capability.examination"],
    disposition: "elective_surgical_referral",
    evidenceClaimIds: [
      "claim.biliary.stable_pattern",
      "claim.biliary.elective_evaluation",
      "claim.biliary.management_uncertainty",
    ],
    questionVariants: [
      questionVariant({
        id: "question.cholelithiasis.stable-referral.v1",
        conceptId: "concept.prototype.cholelithiasis.management",
        stem:
          "Prior ultrasound confirmed gallstones. Recurrent compatible pain has resolved, and the patient is stable without fever, jaundice, persistent pain, or peritoneal findings. What is the next step?",
        answerChoices: [
          answer(
            "choice.biliary.stable.correct",
            "Arrange elective specialist evaluation and discuss management",
            true,
            null,
          ),
          answer(
            "choice.biliary.stable.ed",
            "Send every stable pain-free patient to the emergency department",
            false,
            "The authored case lacks acute complication features requiring emergency evaluation.",
          ),
          answer(
            "choice.biliary.stable.none",
            "Provide no follow-up because the pain has resolved",
            false,
            "Recurrent symptomatic, image-confirmed gallstones warrant an elective management evaluation.",
          ),
          answer(
            "choice.biliary.stable.xray",
            "Repeat plain abdominal radiographs before making a referral",
            false,
            "Plain radiography is not an appropriate substitute for gallstone evaluation and the stones are already documented.",
          ),
        ],
        explanation:
          "This is stable symptomatic, image-confirmed gallstone disease without urgent features. Elective specialist evaluation is appropriate; the pilot does not claim that every patient must undergo surgery.",
        supportingEvidenceClaimIds: [
          "claim.biliary.stable_pattern",
          "claim.biliary.elective_evaluation",
          "claim.biliary.management_uncertainty",
        ],
      }),
      questionVariant({
        id: "question.cholelithiasis.stable-referral.v2",
        conceptId: "concept.prototype.cholelithiasis.management",
        stem:
          "A patient with known gallstones has recurring compatible attacks but is currently comfortable, nonjaundiced, afebrile, and physiologically stable. Which disposition fits?",
        answerChoices: [
          answer(
            "choice.biliary.stable.correct",
            "Plan elective specialist assessment with a shared management discussion",
            true,
            null,
          ),
          answer(
            "choice.biliary.stable.ed",
            "Treat the absence of current pain as an emergency by itself",
            false,
            "Emergency transfer is not supported by the stable authored presentation without red flags.",
          ),
          answer(
            "choice.biliary.stable.none",
            "Close the chart with no planned follow-up",
            false,
            "Recurring symptomatic disease should not be ignored even when the current attack has resolved.",
          ),
          answer(
            "choice.biliary.stable.xray",
            "Use plain X-ray to decide whether the documented gallstones are real",
            false,
            "Plain radiography does not replace the prior credible ultrasound.",
          ),
        ],
        explanation:
          "Stable recurrent symptoms with previously demonstrated gallstones support elective evaluation rather than no follow-up or emergency transfer.",
        supportingEvidenceClaimIds: [
          "claim.biliary.stable_pattern",
          "claim.biliary.elective_evaluation",
          "claim.biliary.management_uncertainty",
        ],
      }),
    ],
  }),
  concept({
    id: "concept.cholelithiasis.ultrasound-evaluation",
    displayName: "Appropriate gallstone evaluation",
    learningObjective:
      "Arrange formal ultrasound-based evaluation for stable suspected gallstone disease without substituting plain radiography.",
    educationalTier: 1,
    conceptType: "workup",
    diagnosisFamilyIds: ["symptomatic_cholelithiasis"],
    phenotypeIds: [BIL_US_L1],
    correctAction:
      "Arrange formal outpatient abdominal ultrasound and appropriate blood testing.",
    requiredCapabilityIds: ["capability.examination"],
    disposition: "outpatient_testing",
    evidenceClaimIds: [
      "claim.biliary.ultrasound_evaluation",
      "claim.biliary.no_xray_substitution",
    ],
    questionVariants: [
      questionVariant({
        id: "question.cholelithiasis.ultrasound-evaluation.v1",
        conceptId: "concept.cholelithiasis.ultrasound-evaluation",
        stem:
          "A stable adult has compatible episodic biliary symptoms, no prior definitive imaging, and no urgent features. What evaluation should be arranged?",
        answerChoices: [
          answer(
            "choice.biliary.ultrasound.correct",
            "Arrange formal abdominal ultrasound with appropriate blood testing",
            true,
            null,
          ),
          answer(
            "choice.biliary.ultrasound.xray",
            "Use the clinic's plain X-ray as the gallstone study",
            false,
            "Plain radiography is not a substitute for formal ultrasound in suspected gallstone disease.",
          ),
          answer(
            "choice.biliary.ultrasound.invent-ct",
            "Use CT as the routine first gallstone study instead of arranging ultrasound",
            false,
            "Formal ultrasound, not routine first-line CT, is the evidence-supported imaging basis for this stable suspected presentation.",
          ),
          answer(
            "choice.biliary.ultrasound.none",
            "Diagnose gallstones without arranging appropriate evaluation",
            false,
            "Symptoms alone do not replace the appropriate imaging and laboratory evaluation.",
          ),
        ],
        explanation:
          "Formal abdominal ultrasound is the appropriate imaging basis for stable suspected gallstone disease. The clinic may arrange it externally but must not substitute plain X-ray.",
        supportingEvidenceClaimIds: [
          "claim.biliary.ultrasound_evaluation",
          "claim.biliary.no_xray_substitution",
        ],
      }),
      questionVariant({
        id: "question.cholelithiasis.ultrasound-evaluation.v2",
        conceptId: "concept.cholelithiasis.ultrasound-evaluation",
        stem:
          "The clinic lacks ultrasound. A prior plain abdominal radiograph was normal, but the stable patient's episodic upper abdominal symptoms remain compatible with gallstones. What is the correct plan?",
        answerChoices: [
          answer(
            "choice.biliary.ultrasound.correct",
            "Arrange external formal ultrasound and appropriate clinical evaluation",
            true,
            null,
          ),
          answer(
            "choice.biliary.ultrasound.xray",
            "Repeat plain radiography until gallstones appear",
            false,
            "A normal or repeated plain radiograph does not replace formal ultrasound.",
          ),
          answer(
            "choice.biliary.ultrasound.invent-ct",
            "Refer for gallstone surgery without first establishing gallstones by appropriate imaging",
            false,
            "Compatible symptoms alone do not establish gallstones; appropriate ultrasound-based evaluation should come first.",
          ),
          answer(
            "choice.biliary.ultrasound.none",
            "Stop evaluation because the clinic lacks the preferred test",
            false,
            "The appropriate response to a missing clinic capability is an external evaluation pathway, not abandonment or substitution.",
          ),
        ],
        explanation:
          "A stable patient can be routed for formal outpatient ultrasound. The available X-ray does not become appropriate merely because ultrasound is offsite.",
        supportingEvidenceClaimIds: [
          "claim.biliary.ultrasound_evaluation",
          "claim.biliary.no_xray_substitution",
        ],
      }),
    ],
  }),
  concept({
    id: "concept.cholelithiasis.red-flag-transfer",
    displayName: "Biliary complication red-flag transfer",
    learningObjective:
      "Distinguish stable biliary symptoms from warning features requiring emergency evaluation.",
    educationalTier: 1,
    conceptType: "disposition",
    diagnosisFamilyIds: ["symptomatic_cholelithiasis"],
    phenotypeIds: [BIL_RED_L1],
    correctAction:
      "Arrange immediate emergency-department or hospital-capable evaluation.",
    requiredCapabilityIds: ["capability.examination"],
    disposition: "emergency_department_transfer",
    evidenceClaimIds: ["claim.biliary.red_flags"],
    questionVariants: [
      questionVariant({
        id: "question.cholelithiasis.red-flag-transfer.v1",
        conceptId: "concept.cholelithiasis.red-flag-transfer",
        stem:
          "A patient with known gallstones now has persistent worsening right upper abdominal pain and new jaundice. What should this clinic do?",
        answerChoices: [
          answer(
            "choice.biliary.redflag.correct",
            "Arrange immediate hospital-capable evaluation",
            true,
            null,
          ),
          answer(
            "choice.biliary.redflag.elective",
            "Schedule only a routine elective visit several weeks away",
            false,
            "New jaundice and persistent worsening pain are incompatible with an uncomplicated elective-only presentation.",
          ),
          answer(
            "choice.biliary.redflag.xray",
            "Obtain a plain X-ray and delay transfer until it is interpreted",
            false,
            "Plain radiography is not the required acute biliary evaluation and should not delay escalation.",
          ),
          answer(
            "choice.biliary.redflag.wait",
            "Wait for the pain and jaundice to resolve before deciding",
            false,
            "Waiting under-triages warning features of a possible biliary complication.",
          ),
        ],
        explanation:
          "Persistent worsening pain plus jaundice makes uncomplicated biliary colic an unsafe label. The outpatient case ends at emergency evaluation without assigning a definitive complication diagnosis.",
        supportingEvidenceClaimIds: ["claim.biliary.red_flags"],
      }),
      questionVariant({
        id: "question.cholelithiasis.red-flag-transfer.v2",
        conceptId: "concept.cholelithiasis.red-flag-transfer",
        stem:
          "A patient with documented gallstones has pain that is now continuous and has developed new jaundice. Which disposition is appropriate?",
        answerChoices: [
          answer(
            "choice.biliary.redflag.correct",
            "Transfer for immediate emergency and hospital-capable evaluation",
            true,
            null,
          ),
          answer(
            "choice.biliary.redflag.elective",
            "Keep the case on a routine elective pathway only",
            false,
            "Persistent pain and new jaundice require urgent evaluation rather than an elective-only plan.",
          ),
          answer(
            "choice.biliary.redflag.xray",
            "Use plain abdominal radiography as definitive acute evaluation",
            false,
            "Plain radiography cannot substitute for appropriate hospital-capable biliary evaluation.",
          ),
          answer(
            "choice.biliary.redflag.wait",
            "Send the patient home to see whether the jaundice disappears",
            false,
            "A new jaundice warning sign should not be managed by delayed observation from this clinic.",
          ),
        ],
        explanation:
          "Persistent pain with new jaundice is outside the uncomplicated phenotype and requires prompt emergency evaluation.",
        supportingEvidenceClaimIds: ["claim.biliary.red_flags"],
      }),
    ],
  }),
] satisfies PilotConcept[];

const summaryDraft = PILOT_DRAFT;

export const LAC_ABS_BIL_FAMILIES = [
  {
    ...PILOT_DRAFT,
    id: "traumatic_laceration",
    displayName: "Simple traumatic laceration",
    synonyms: ["simple laceration", "traumatic cut"],
    scopeDefinition:
      "Adult traumatic skin wounds suitable for initial outpatient assessment, with deeper injury treated as an exclusion or referral warning.",
    exclusions: [
      "bites",
      "puncture wounds",
      "grossly contaminated or infected wounds",
      "uncontrolled hemorrhage",
      "fracture",
      "definitive tendon, nerve, or vascular injury",
    ],
    publicCurriculumTags: ["wound evaluation", "tetanus prophylaxis"],
    phenotypeIds: [LAC_L0, LAC_TETANUS_L1, LAC_DEEP_L1],
    conceptIds: [
      "concept.laceration.preclosure-assessment",
      "concept.prototype.laceration.tetanus",
      "concept.laceration.deep-structure-referral",
    ],
    evidenceClaimIds: [
      "claim.laceration.preclosure_assessment",
      "claim.laceration.foreign_material",
      "claim.laceration.tetanus_basis",
      "claim.laceration.tetanus_matrix",
      "claim.laceration.deep_injury_escalation",
    ],
    chartBackSummary: {
      ...summaryDraft,
      whatItIs:
        "A traumatic laceration is a cut through skin or underlying tissue; this pilot's simple form excludes infection, uncontrolled bleeding, and established deeper injury.",
      typicalPresentation:
        "The simple phenotype is a recent superficial cut in a stable adult with controlled bleeding and intact distal function.",
      initialEvaluation:
        "Assess mechanism, location, depth, contamination, foreign material concern, and distal tendon and nerve function; separately review wound category and tetanus history.",
      managementInThisClinic:
        "Provide basic wound care and routine closure only when the wound is within capability; apply or arrange CDC-supported tetanus prophylaxis.",
      redFlagsRequiringUrgentCare:
        "Abnormal active motion, new distal numbness, uncontrolled bleeding, or suspected deeper injury requires higher-level evaluation. Gross contamination requires deliberate cleaning and risk assessment and may exceed clinic capability.",
      evidenceClaimIds: [
        "claim.laceration.preclosure_assessment",
        "claim.laceration.foreign_material",
        "claim.laceration.tetanus_basis",
        "claim.laceration.tetanus_matrix",
        "claim.laceration.deep_injury_escalation",
      ],
    },
  },
  {
    ...PILOT_DRAFT,
    id: "cutaneous_abscess",
    displayName: "Uncomplicated cutaneous abscess",
    synonyms: ["skin abscess", "localized purulent skin collection"],
    scopeDefinition:
      "A superficial, accessible, localized purulent skin collection in an otherwise stable adult.",
    exclusions: [
      "perirectal or other special-site disease",
      "hidradenitis or pilonidal disease",
      "recurrent disease",
      "immunocompromise",
      "suspected deep or necrotizing infection",
      "detailed antibiotic selection",
    ],
    publicCurriculumTags: ["skin and soft tissue infection", "source control"],
    phenotypeIds: [ABS_L0, ABS_CELLULITIS_L1, ABS_ESCALATE_L1],
    conceptIds: [
      "concept.prototype.abscess.primary-treatment",
      "concept.abscess.collection-vs-cellulitis",
      "concept.abscess.rapid-spread-escalation",
    ],
    evidenceClaimIds: [
      "claim.abscess.localized_collection",
      "claim.abscess.drainage_primary",
      "claim.abscess.no_collection_no_incision",
      "claim.abscess.escalation_features",
      "claim.abscess.adjunct_uncertainty",
    ],
    chartBackSummary: {
      ...summaryDraft,
      whatItIs:
        "A cutaneous abscess is a localized purulent collection in skin or superficial soft tissue. One Level 1 contrast encounter intentionally lacks a collection and tests recognition of a nonpurulent differential.",
      typicalPresentation:
        "A simple drainable abscess is localized and fluctuant, sometimes with a purulent focus, without rapid spread, deep involvement, or systemic illness.",
      initialEvaluation:
        "Determine whether a focal collection is present and look for rapid progression, extensive spread, necrosis, deeper disease, special location, or host risk.",
      managementInThisClinic:
        "Incision and drainage is the central treatment when an uncomplicated collection is drainable and an appropriate procedural setting is available; detailed antibiotic decisions are withheld.",
      redFlagsRequiringUrgentCare:
        "Rapid progression, extensive inflammation, systemic illness, hemodynamic disturbance, necrosis, or suspected deep involvement requires higher-capability evaluation.",
      evidenceClaimIds: [
        "claim.abscess.localized_collection",
        "claim.abscess.drainage_primary",
        "claim.abscess.no_collection_no_incision",
        "claim.abscess.escalation_features",
        "claim.abscess.adjunct_uncertainty",
      ],
    },
  },
  {
    ...PILOT_DRAFT,
    id: "symptomatic_cholelithiasis",
    displayName: "Symptomatic cholelithiasis presenting as biliary colic",
    synonyms: ["symptomatic gallstones", "biliary colic"],
    scopeDefinition:
      "Stable episodic symptoms attributed to gallbladder stones, separated from suspected acute biliary complications.",
    exclusions: [
      "acute cholecystitis",
      "choledocholithiasis",
      "cholangitis",
      "pancreatitis",
      "peritonitis",
      "definitive inpatient treatment",
    ],
    publicCurriculumTags: ["gallstone disease", "right upper quadrant pain"],
    phenotypeIds: [BIL_L0, BIL_US_L1, BIL_RED_L1],
    conceptIds: [
      "concept.prototype.cholelithiasis.management",
      "concept.cholelithiasis.ultrasound-evaluation",
      "concept.cholelithiasis.red-flag-transfer",
    ],
    evidenceClaimIds: [
      "claim.biliary.stable_pattern",
      "claim.biliary.ultrasound_evaluation",
      "claim.biliary.no_xray_substitution",
      "claim.biliary.elective_evaluation",
      "claim.biliary.management_uncertainty",
      "claim.biliary.red_flags",
    ],
    chartBackSummary: {
      ...summaryDraft,
      whatItIs:
        "Symptomatic cholelithiasis is gallbladder stone disease associated with compatible episodic symptoms. One Level 1 encounter represents suspected disease pending formal ultrasound rather than confirmed gallstones.",
      typicalPresentation:
        "The uncomplicated phenotype has episodic upper abdominal pain, sometimes with nausea or vomiting, and lacks fever, jaundice, persistent pain, peritoneal findings, or physiologic disturbance.",
      initialEvaluation:
        "Use formal abdominal ultrasound and appropriate blood testing; an available plain X-ray is not a substitute.",
      managementInThisClinic:
        "Arrange elective specialist assessment for stable image-confirmed symptomatic disease, or external ultrasound-based evaluation when stones have not been demonstrated.",
      redFlagsRequiringUrgentCare:
        "Fever, jaundice, persistent or worsening pain, peritoneal findings, physiologic disturbance, or another complication warning requires emergency evaluation.",
      evidenceClaimIds: [
        "claim.biliary.stable_pattern",
        "claim.biliary.ultrasound_evaluation",
        "claim.biliary.no_xray_substitution",
        "claim.biliary.elective_evaluation",
        "claim.biliary.management_uncertainty",
        "claim.biliary.red_flags",
      ],
    },
  },
] satisfies DiagnosisFamily[];

const template = (
  input: Omit<PilotEncounterTemplate, keyof typeof PILOT_DRAFT>,
): PilotEncounterTemplate => ({ ...PILOT_DRAFT, ...input });

export const LAC_ABS_BIL_TEMPLATES = [
  template({
    id: "case.prototype.tutorial-laceration",
    displayName: "Intro Patient 1: Simple Laceration",
    diagnosisFamilyId: "traumatic_laceration",
    phenotypeId: LAC_L0,
    scoredConceptIds: ["concept.laceration.preclosure-assessment"],
    earliestFacilityStage: 0,
    tutorialEligible: true,
    routineEligible: true,
    requiredClinicalSetting: "clinic",
    rewardTierId: "reward.tutorial",
    evidenceClaimIds: [
      "claim.laceration.preclosure_assessment",
      "claim.laceration.foreign_material",
    ],
  }),
  template({
    id: "case.pilot.laceration-tetanus",
    displayName: "Clinic Patient: Laceration Tetanus Review",
    diagnosisFamilyId: "traumatic_laceration",
    phenotypeId: LAC_TETANUS_L1,
    scoredConceptIds: ["concept.prototype.laceration.tetanus"],
    earliestFacilityStage: 1,
    tutorialEligible: false,
    routineEligible: true,
    requiredClinicalSetting: "clinic",
    rewardTierId: "reward.clinic_basic",
    evidenceClaimIds: [
      "claim.laceration.tetanus_basis",
      "claim.laceration.tetanus_matrix",
    ],
  }),
  template({
    id: "case.pilot.laceration-deep-structure",
    displayName: "Referral Patient: Hand Laceration Warning",
    diagnosisFamilyId: "traumatic_laceration",
    phenotypeId: LAC_DEEP_L1,
    scoredConceptIds: ["concept.laceration.deep-structure-referral"],
    earliestFacilityStage: 1,
    tutorialEligible: false,
    routineEligible: true,
    requiredClinicalSetting: "clinic",
    rewardTierId: "reward.referral",
    evidenceClaimIds: ["claim.laceration.deep_injury_escalation"],
  }),
  template({
    id: "case.prototype.abscess",
    displayName: "Clinic Patient: Localized Abscess",
    diagnosisFamilyId: "cutaneous_abscess",
    phenotypeId: ABS_L0,
    scoredConceptIds: ["concept.prototype.abscess.primary-treatment"],
    earliestFacilityStage: 0,
    tutorialEligible: false,
    routineEligible: true,
    requiredClinicalSetting: "clinic",
    rewardTierId: "reward.clinic_basic",
    evidenceClaimIds: [
      "claim.abscess.localized_collection",
      "claim.abscess.drainage_primary",
    ],
  }),
  template({
    id: "case.pilot.abscess-nonpurulent-differential",
    displayName: "Clinic Patient: No Drainage Target",
    diagnosisFamilyId: "cutaneous_abscess",
    phenotypeId: ABS_CELLULITIS_L1,
    scoredConceptIds: ["concept.abscess.collection-vs-cellulitis"],
    earliestFacilityStage: 1,
    tutorialEligible: false,
    routineEligible: true,
    requiredClinicalSetting: "clinic",
    rewardTierId: "reward.clinic_basic",
    evidenceClaimIds: [
      "claim.abscess.localized_collection",
      "claim.abscess.no_collection_no_incision",
    ],
  }),
  template({
    id: "case.pilot.abscess-rapid-spread",
    displayName: "Referral Patient: Rapidly Spreading Purulent Infection",
    diagnosisFamilyId: "cutaneous_abscess",
    phenotypeId: ABS_ESCALATE_L1,
    scoredConceptIds: ["concept.abscess.rapid-spread-escalation"],
    earliestFacilityStage: 1,
    tutorialEligible: false,
    routineEligible: true,
    requiredClinicalSetting: "clinic",
    rewardTierId: "reward.referral",
    evidenceClaimIds: [
      "claim.abscess.escalation_features",
      "claim.abscess.adjunct_uncertainty",
    ],
  }),
  template({
    id: "case.prototype.symptomatic-cholelithiasis",
    displayName: "Referral Patient: Stable Symptomatic Gallstones",
    diagnosisFamilyId: "symptomatic_cholelithiasis",
    phenotypeId: BIL_L0,
    scoredConceptIds: ["concept.prototype.cholelithiasis.management"],
    earliestFacilityStage: 0,
    tutorialEligible: false,
    routineEligible: true,
    requiredClinicalSetting: "clinic",
    rewardTierId: "reward.referral",
    evidenceClaimIds: [
      "claim.biliary.stable_pattern",
      "claim.biliary.elective_evaluation",
      "claim.biliary.management_uncertainty",
    ],
  }),
  template({
    id: "case.pilot.cholelithiasis-ultrasound",
    displayName: "Clinic Patient: Gallstone Evaluation",
    diagnosisFamilyId: "symptomatic_cholelithiasis",
    phenotypeId: BIL_US_L1,
    scoredConceptIds: ["concept.cholelithiasis.ultrasound-evaluation"],
    earliestFacilityStage: 1,
    tutorialEligible: false,
    routineEligible: true,
    requiredClinicalSetting: "clinic",
    rewardTierId: "reward.clinic_basic",
    evidenceClaimIds: [
      "claim.biliary.ultrasound_evaluation",
      "claim.biliary.no_xray_substitution",
    ],
  }),
  template({
    id: "case.pilot.cholelithiasis-red-flags",
    displayName: "Referral Patient: Biliary Red Flags",
    diagnosisFamilyId: "symptomatic_cholelithiasis",
    phenotypeId: BIL_RED_L1,
    scoredConceptIds: ["concept.cholelithiasis.red-flag-transfer"],
    earliestFacilityStage: 1,
    tutorialEligible: false,
    routineEligible: true,
    requiredClinicalSetting: "clinic",
    rewardTierId: "reward.referral",
    evidenceClaimIds: ["claim.biliary.red_flags"],
  }),
] satisfies PilotEncounterTemplate[];
