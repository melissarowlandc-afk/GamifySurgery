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
  GENERAL_ADULT_AGE_BANDS,
  GENERAL_ADULT_SEX_POLICY,
  PILOT_DRAFT,
  answer,
  questionVariant,
} from "./common";

// Source metadata was checked during the five-diagnosis pilot review.
const CHECKED_ON = "2026-07-29";

export const HERNIA_L0 =
  "phenotype.inguinal-hernia.l0-reducible-symptomatic";
export const HERNIA_WW_L1 =
  "phenotype.inguinal-hernia.l1-minimally-symptomatic-man";
export const HERNIA_URGENT_L1 =
  "phenotype.inguinal-hernia.l1-acutely-irreducible";
export const APPENDIX_L0 =
  "phenotype.acute-appendicitis.l0-classic";
export const APPENDIX_EARLY_L1 =
  "phenotype.acute-appendicitis.l1-early-incomplete";
export const APPENDIX_NO_IMAGING_L1 =
  "phenotype.acute-appendicitis.l1-no-onsite-imaging";

export const HERNIA_APPENDICITIS_SOURCES = [
  {
    ...PILOT_DRAFT,
    id: "src.hernia.herniasurge_2023",
    title:
      "Update of the international HerniaSurge guidelines for groin hernia management",
    completeCitation:
      "Stabilini C, van Veenendaal N, Aasvang E, et al. Update of the international HerniaSurge guidelines for groin hernia management. BJS Open. 2023;7(5):zrad080.",
    organizationOrJournal: "BJS Open / HerniaSurge",
    authors: ["Cesare Stabilini", "Nadine van Veenendaal", "Eske Aasvang"],
    publicationYear: 2023,
    doi: "10.1093/bjsopen/zrad080",
    pmid: "37862616",
    officialUrl: "https://doi.org/10.1093/bjsopen/zrad080",
    accessedOn: CHECKED_ON,
    sourceClass: "peer_reviewed_guideline",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Attribute the authors and source, link the license, identify changes, and separately screen credited third-party material. No source prose, tables, or algorithms are reproduced.",
    authorityAssessment:
      "Current international-society update; primary evidence for watchful-waiting boundaries and acute irreducibility.",
    usageRole: "evidence",
    evidenceClaimIds: [
      "claim.inguinal.watchful-waiting-men",
      "claim.inguinal.watchful-waiting-boundary",
      "claim.inguinal.acute-irreducibility",
      "claim.inguinal.red-flag-context",
      "claim.inguinal.terminology",
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "src.hernia.herniasurge_corrigendum_2024",
    title:
      "Corrigendum to: Update of the international HerniaSurge guidelines for groin hernia management",
    completeCitation:
      "Corrigendum to: Update of the international HerniaSurge guidelines for groin hernia management. BJS Open. 2024;8(2):zrae034.",
    organizationOrJournal: "BJS Open",
    authors: [],
    publicationYear: 2024,
    doi: "10.1093/bjsopen/zrae034",
    pmid: "38484113",
    officialUrl: "https://doi.org/10.1093/bjsopen/zrae034",
    accessedOn: CHECKED_ON,
    sourceClass: "correction",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Recorded for source completeness. The corrigendum restores an omitted supplementary file and does not independently support a teaching claim.",
    authorityAssessment:
      "Required currentness companion to the 2023 update; no recommendation change was announced.",
    usageRole: "cross_check",
    evidenceClaimIds: [],
  },
  {
    ...PILOT_DRAFT,
    id: "src.hernia.herniasurge_2018",
    title: "International guidelines for groin hernia management",
    completeCitation:
      "HerniaSurge Group. International guidelines for groin hernia management. Hernia. 2018;22(1):1-165.",
    organizationOrJournal: "Hernia / HerniaSurge",
    authors: ["HerniaSurge Group"],
    publicationYear: 2018,
    doi: "10.1007/s10029-017-1668-x",
    pmid: "29330835",
    officialUrl: "https://doi.org/10.1007/s10029-017-1668-x",
    accessedOn: CHECKED_ON,
    sourceClass: "peer_reviewed_guideline",
    licenseLabel: "CC BY-NC 4.0",
    reuseStatus: "cc_by_nc_4_0_restricted",
    reuseNotes:
      "Targeted factual cross-check and citation only unless noncommercial distribution is confirmed. No protected expression is reproduced.",
    authorityAssessment:
      "Older international backbone, partly updated in 2023; used for physical diagnosis, symptomatic disease, and the original sex-specific observation boundary.",
    usageRole: "both",
    evidenceClaimIds: [
      "claim.inguinal.definition",
      "claim.inguinal.clinical-diagnosis",
      "claim.inguinal.symptomatic-referral",
      "claim.inguinal.watchful-waiting-men",
      "claim.inguinal.watchful-waiting-boundary",
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "src.appendicitis.swedish_2025",
    title:
      "Swedish national guidelines for diagnosis and management of acute appendicitis in adults and children",
    completeCitation:
      "Salö M, Tiselius C, Rosemar A, Öst E, Sohlberg S, Andersson RE. Swedish national guidelines for diagnosis and management of acute appendicitis in adults and children. BJS Open. 2025;9(2):zrae165.",
    organizationOrJournal: "BJS Open",
    authors: [
      "Martin Salö",
      "Catarina Tiselius",
      "Anders Rosemar",
      "Elin Öst",
      "Sara Sohlberg",
      "Roland E Andersson",
    ],
    publicationYear: 2025,
    doi: "10.1093/bjsopen/zrae165",
    pmid: "40203150",
    officialUrl: "https://doi.org/10.1093/bjsopen/zrae165",
    accessedOn: CHECKED_ON,
    sourceClass: "peer_reviewed_guideline",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Attribute the authors and source, link the license, identify changes, and screen third-party material. No recommendation text or algorithms are reproduced.",
    authorityAssessment:
      "Current national guideline with a section directly addressing suspected appendicitis in primary care.",
    usageRole: "evidence",
    evidenceClaimIds: [
      "claim.appendicitis.typical-pattern",
      "claim.appendicitis.pattern-not-diagnostic",
      "claim.appendicitis.outpatient-urgent-evaluation",
      "claim.appendicitis.imaging-context",
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "src.appendicitis.wses_2020",
    title:
      "Diagnosis and treatment of acute appendicitis: 2020 update of the WSES Jerusalem guidelines",
    completeCitation:
      "Di Saverio S, Podda M, De Simone B, et al. Diagnosis and treatment of acute appendicitis: 2020 update of the WSES Jerusalem guidelines. World J Emerg Surg. 2020;15:27.",
    organizationOrJournal:
      "World Journal of Emergency Surgery / World Society of Emergency Surgery",
    authors: ["Salomone Di Saverio", "Mauro Podda", "Belinda De Simone"],
    publicationYear: 2020,
    doi: "10.1186/s13017-020-00306-3",
    pmid: null,
    officialUrl: "https://doi.org/10.1186/s13017-020-00306-3",
    accessedOn: CHECKED_ON,
    sourceClass: "peer_reviewed_guideline",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes:
      "Rights-cleared diagnostic cross-check. It is superseded for current WSES positions by the 2025 edition.",
    authorityAssessment:
      "Older international guideline retained as a secondary diagnostic cross-check rather than the sole current authority.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      "claim.appendicitis.pattern-not-diagnostic",
      "claim.appendicitis.imaging-context",
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "src.appendicitis.wses_2025_metadata",
    title:
      "Diagnosis and Treatment of Acute Appendicitis: 2025 Edition of the World Society of Emergency Surgery Jerusalem Guidelines",
    completeCitation:
      "Podda M, Ceresoli M, De Simone B, et al. Diagnosis and Treatment of Acute Appendicitis: 2025 Edition of the World Society of Emergency Surgery Jerusalem Guidelines. JAMA Surg. 2026;161(3):283-295.",
    organizationOrJournal:
      "JAMA Surgery / World Society of Emergency Surgery",
    authors: ["Mauro Podda", "Marco Ceresoli", "Belinda De Simone"],
    publicationYear: 2026,
    doi: "10.1001/jamasurg.2025.6218",
    pmid: "41604201",
    officialUrl: "https://doi.org/10.1001/jamasurg.2025.6218",
    accessedOn: CHECKED_ON,
    sourceClass: "bibliographic_metadata",
    licenseLabel:
      "Copyrighted; publisher reserves text/data-mining and AI rights",
    reuseStatus: "metadata_only_rights_reserved",
    reuseNotes:
      "Bibliographic metadata and currentness only. The full article was not used as an ingestible content corpus.",
    authorityAssessment:
      "Newest WSES currentness signal, recorded so the 2020 guideline is not misrepresented as current.",
    usageRole: "cross_check",
    evidenceClaimIds: [],
  },
  {
    ...PILOT_DRAFT,
    id: "src.appendicitis.niddk_definition",
    title: "Definition & Facts for Appendicitis",
    completeCitation:
      "National Institute of Diabetes and Digestive and Kidney Diseases. Definition & Facts for Appendicitis. Last reviewed July 2021.",
    organizationOrJournal:
      "National Institute of Diabetes and Digestive and Kidney Diseases",
    authors: [],
    publicationYear: 2021,
    doi: null,
    pmid: null,
    officialUrl:
      "https://www.niddk.nih.gov/health-information/digestive-diseases/appendicitis/definition-facts",
    accessedOn: CHECKED_ON,
    sourceClass: "government_guidance",
    licenseLabel:
      "U.S. federal government material; third-party conditions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes:
      "Attribute NIDDK, exclude images and separately credited material, avoid implied endorsement, and recheck for updates.",
    authorityAssessment:
      "Independent U.S. government support for the definition and complication context.",
    usageRole: "evidence",
    evidenceClaimIds: ["claim.appendicitis.definition"],
  },
  {
    ...PILOT_DRAFT,
    id: "src.appendicitis.niddk_symptoms",
    title: "Symptoms & Causes of Appendicitis",
    completeCitation:
      "National Institute of Diabetes and Digestive and Kidney Diseases. Symptoms & Causes of Appendicitis. Last reviewed July 2021.",
    organizationOrJournal:
      "National Institute of Diabetes and Digestive and Kidney Diseases",
    authors: [],
    publicationYear: 2021,
    doi: null,
    pmid: null,
    officialUrl:
      "https://www.niddk.nih.gov/health-information/digestive-diseases/appendicitis/symptoms-causes",
    accessedOn: CHECKED_ON,
    sourceClass: "government_guidance",
    licenseLabel:
      "U.S. federal government material; third-party conditions apply",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes:
      "Attribute NIDDK, exclude images and separately credited material, avoid implied endorsement, and recheck for updates.",
    authorityAssessment:
      "Independent U.S. government support for the typical symptom pattern and immediate-care message.",
    usageRole: "both",
    evidenceClaimIds: [
      "claim.appendicitis.typical-pattern",
      "claim.appendicitis.outpatient-urgent-evaluation",
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "src.appendicitis.acr_rlq_2022",
    title:
      "ACR Appropriateness Criteria Right Lower Quadrant Pain: 2022 Update",
    completeCitation:
      "Kambadakone AR, Santillan CS, Kim DH, et al. ACR Appropriateness Criteria Right Lower Quadrant Pain: 2022 Update. J Am Coll Radiol. 2022;19(11S):S445-S461.",
    organizationOrJournal: "American College of Radiology",
    authors: ["Avinash R Kambadakone", "Carlos S Santillan", "Danny H Kim"],
    publicationYear: 2022,
    doi: "10.1016/j.jacr.2022.09.011",
    pmid: "36436969",
    officialUrl: "https://acsearch.acr.org/docs/69357/Narrative/",
    accessedOn: CHECKED_ON,
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted; all rights reserved",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Targeted factual verification of modality appropriateness only. No ratings table, source wording, or algorithm is reproduced.",
    authorityAssessment:
      "Specialty imaging criterion directly comparing modalities for adult right-lower-quadrant pain.",
    usageRole: "evidence",
    evidenceClaimIds: [
      "claim.appendicitis.imaging-context",
      "claim.appendicitis.no-plain-xray",
    ],
  },
  {
    ...PILOT_DRAFT,
    id: "src.appendicitis.sages_2024",
    title: "SAGES guideline for the diagnosis and treatment of appendicitis",
    completeCitation:
      "Kumar SS, Collings AT, Lamm R, et al. SAGES guideline for the diagnosis and treatment of appendicitis. Surg Endosc. 2024;38:2974-2994.",
    organizationOrJournal:
      "Society of American Gastrointestinal and Endoscopic Surgeons",
    authors: ["Sunjay S Kumar", "Amelia T Collings", "Ryan Lamm"],
    publicationYear: 2024,
    doi: "10.1007/s00464-024-10813-y",
    pmid: "38740595",
    officialUrl:
      "https://www.sages.org/publications/guidelines/guideline-for-the-diagnosis-and-treatment-of-appendicitis/",
    accessedOn: CHECKED_ON,
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted; all rights reserved",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes:
      "Targeted factual cross-check and citation only. No society questions, tables, infographic, algorithms, or recommendation wording are reproduced.",
    authorityAssessment:
      "Current U.S. society cross-check used for diagnosis and imaging context; definitive-treatment disagreement is withheld from this pilot.",
    usageRole: "cross_check",
    evidenceClaimIds: [
      "claim.appendicitis.pattern-not-diagnostic",
      "claim.appendicitis.imaging-context",
    ],
  },
] satisfies ClinicalSource[];

const claim = (
  input: Omit<EvidenceClaim, keyof typeof PILOT_DRAFT>,
): EvidenceClaim => ({ ...PILOT_DRAFT, ...input });

export const HERNIA_APPENDICITIS_CLAIMS = [
  claim({
    id: "claim.inguinal.definition",
    statement:
      "An inguinal hernia is protrusion of intra-abdominal tissue through the inguinal canal and commonly presents as a groin bulge.",
    sourceIds: ["src.hernia.herniasurge_2018"],
    evidenceCategory: "definition",
    certainty: "high",
    limitation: null,
    applicablePopulation: "Adults with a suspected primary inguinal hernia.",
    lastCheckedOn: CHECKED_ON,
  }),
  claim({
    id: "claim.inguinal.clinical-diagnosis",
    statement:
      "A classic inguinal hernia can usually be identified from history and physical examination; routine imaging is not required for every clear presentation.",
    sourceIds: ["src.hernia.herniasurge_2018"],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "Occult, recurrent, complex, or diagnostically uncertain groin findings may require imaging or specialist evaluation.",
    applicablePopulation:
      "Adults with a clinically apparent uncomplicated groin bulge.",
    lastCheckedOn: CHECKED_ON,
  }),
  claim({
    id: "claim.inguinal.symptomatic-referral",
    statement:
      "A reducible inguinal hernia causing meaningful symptoms warrants elective surgical evaluation rather than indefinite unreviewed observation.",
    sourceIds: ["src.hernia.herniasurge_2018"],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "The decision and timing of repair are individualized; this pilot ends at referral and does not teach operative technique.",
    applicablePopulation:
      "Nonpregnant adults with a reducible symptomatic inguinal hernia and no urgent features.",
    lastCheckedOn: CHECKED_ON,
  }),
  claim({
    id: "claim.inguinal.watchful-waiting-men",
    statement:
      "Watchful waiting with safety-net instructions is a guideline-supported option for selected adult men whose inguinal hernia is asymptomatic or only minimally symptomatic.",
    sourceIds: [
      "src.hernia.herniasurge_2018",
      "src.hernia.herniasurge_2023",
    ],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "Many patients eventually choose repair as symptoms progress; observation is an option rather than a promise that surgery will never be needed.",
    applicablePopulation:
      "Selected adult men with a reducible asymptomatic or minimally symptomatic inguinal hernia.",
    lastCheckedOn: CHECKED_ON,
  }),
  claim({
    id: "claim.inguinal.watchful-waiting-boundary",
    statement:
      "The watchful-waiting evidence for minimally symptomatic men should not be generalized to all adults with groin hernias, particularly women, patients with meaningful symptoms, or patients with acute irreducibility.",
    sourceIds: [
      "src.hernia.herniasurge_2018",
      "src.hernia.herniasurge_2023",
    ],
    evidenceCategory: "safety_boundary",
    certainty: "high",
    limitation:
      "Individual specialist decisions may differ; the pilot teaches only the well-supported population boundary.",
    applicablePopulation: "Adults being considered for nonoperative observation.",
    lastCheckedOn: CHECKED_ON,
  }),
  claim({
    id: "claim.inguinal.acute-irreducibility",
    statement:
      "A newly painful, acutely nonreducible groin hernia requires urgent surgical-capable evaluation because obstruction or strangulation may be present.",
    sourceIds: ["src.hernia.herniasurge_2023"],
    evidenceCategory: "disposition",
    certainty: "high",
    limitation:
      "This outpatient pilot does not teach manual reduction, operative management, or definitive diagnosis of strangulation.",
    applicablePopulation:
      "Adults with an acutely irreducible groin hernia or an acute change in reducibility.",
    lastCheckedOn: CHECKED_ON,
  }),
  claim({
    id: "claim.inguinal.red-flag-context",
    statement:
      "Escalating pain, vomiting, abdominal distension, inability to pass stool or flatus, skin changes over the bulge, peritoneal findings, or systemic illness increase concern for an urgent hernia complication.",
    sourceIds: ["src.hernia.herniasurge_2023"],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "No single listed feature independently proves strangulation; the combined clinical context determines urgency.",
    applicablePopulation:
      "Adults with a known or suspected groin hernia and new acute symptoms.",
    lastCheckedOn: CHECKED_ON,
  }),
  claim({
    id: "claim.inguinal.terminology",
    statement:
      "Current HerniaSurge terminology distinguishes acutely irreducible, chronically irreducible, and strangulated hernias instead of using 'incarcerated' without qualification.",
    sourceIds: ["src.hernia.herniasurge_2023"],
    evidenceCategory: "definition",
    certainty: "high",
    limitation:
      "Legacy terminology remains common in clinical communication and source literature.",
    applicablePopulation: "Clinical description of adult groin hernias.",
    lastCheckedOn: CHECKED_ON,
  }),
  claim({
    id: "claim.appendicitis.definition",
    statement:
      "Acute appendicitis is inflammation of the appendix and can progress to serious intra-abdominal complications if not evaluated and treated promptly.",
    sourceIds: ["src.appendicitis.niddk_definition"],
    evidenceCategory: "definition",
    certainty: "high",
    limitation:
      "The pilot represents suspected appendicitis in an outpatient clinic, not a confirmed postoperative diagnosis.",
    applicablePopulation: "Adults with suspected acute appendicitis.",
    lastCheckedOn: CHECKED_ON,
  }),
  claim({
    id: "claim.appendicitis.typical-pattern",
    statement:
      "A typical appendicitis pattern includes worsening abdominal pain that may begin centrally and migrate to the right lower quadrant, often with focal tenderness and possible anorexia, nausea, vomiting, or fever.",
    sourceIds: [
      "src.appendicitis.swedish_2025",
      "src.appendicitis.niddk_symptoms",
    ],
    evidenceCategory: "presentation",
    certainty: "high",
    limitation:
      "Not every patient has migration, fever, vomiting, or the complete classic pattern.",
    applicablePopulation: "Nonpregnant adults with acute abdominal pain.",
    lastCheckedOn: CHECKED_ON,
  }),
  claim({
    id: "claim.appendicitis.pattern-not-diagnostic",
    statement:
      "History and examination can establish concern for appendicitis, but an individual symptom or examination finding does not by itself confirm or exclude the diagnosis.",
    sourceIds: [
      "src.appendicitis.swedish_2025",
      "src.appendicitis.wses_2020",
      "src.appendicitis.sages_2024",
    ],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "Risk scores, laboratory tests, and imaging may refine probability in an appropriately equipped setting.",
    applicablePopulation: "Adults with possible acute appendicitis.",
    lastCheckedOn: CHECKED_ON,
  }),
  claim({
    id: "claim.appendicitis.outpatient-urgent-evaluation",
    statement:
      "When outpatient history and examination create meaningful concern for acute appendicitis, the patient should receive prompt emergency-department or surgical-capable evaluation rather than delayed routine clinic follow-up.",
    sourceIds: [
      "src.appendicitis.swedish_2025",
      "src.appendicitis.niddk_symptoms",
    ],
    evidenceCategory: "disposition",
    certainty: "high",
    limitation:
      "The Swedish primary-care recommendation incorporates CRP when available; this pilot does not require a test the clinic lacks.",
    applicablePopulation:
      "Stable nonpregnant adults with suspected appendicitis in an outpatient clinic.",
    lastCheckedOn: CHECKED_ON,
  }),
  claim({
    id: "claim.appendicitis.imaging-context",
    statement:
      "Appropriate imaging can refine the diagnosis of suspected appendicitis, but modality selection depends on patient factors and available expertise and should occur in a setting capable of completing the urgent evaluation.",
    sourceIds: [
      "src.appendicitis.swedish_2025",
      "src.appendicitis.wses_2020",
      "src.appendicitis.acr_rlq_2022",
      "src.appendicitis.sages_2024",
    ],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "This pilot is restricted to nonpregnant adults and does not teach a complete modality algorithm.",
    applicablePopulation:
      "Nonpregnant adults undergoing evaluation for possible acute appendicitis.",
    lastCheckedOn: CHECKED_ON,
  }),
  claim({
    id: "claim.appendicitis.no-plain-xray",
    statement:
      "Plain abdominal radiography is not an appropriate substitute for CT, ultrasound, or MRI when evaluating suspected appendicitis.",
    sourceIds: ["src.appendicitis.acr_rlq_2022"],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "This exact modality comparison relies on one current specialty imaging guideline and requires focused clinician review.",
    applicablePopulation:
      "Nonpregnant adults with suspected appendicitis or right-lower-quadrant pain.",
    lastCheckedOn: CHECKED_ON,
  }),
] satisfies EvidenceClaim[];

export const HERNIA_APPENDICITIS_OVERLAYS = [
  {
    ...PILOT_DRAFT,
    id: "physiology.inguinal-hernia.stable-editorial",
    displayName: "Stable adult with uncomplicated inguinal hernia",
    acuity: "stable",
    compatiblePhenotypeIds: [HERNIA_L0, HERNIA_WW_L1],
    vitalRanges: {
      heartRateBpm: { minimum: 60, maximum: 96 },
      systolicBloodPressureMmHg: { minimum: 100, maximum: 120 },
      diastolicBloodPressureMmHg: { minimum: 60, maximum: 80 },
      temperatureF: { minimum: 97.7, maximum: 99.1 },
      oxygenSaturationPercent: { minimum: 95, maximum: 98 },
    },
    requiredFindings: ["Stable general appearance"],
    excludedFindings: [
      "Hemodynamic instability",
      "Hypoxemia",
      "Clinically important fever",
    ],
    evidenceClaimIds: [
      "claim.inguinal.symptomatic-referral",
      "claim.inguinal.watchful-waiting-men",
      "claim.physiology.resting_adult_ranges",
      "claim.physiology.oxygen_saturation_range",
    ],
    generationBasis: "editorial_simulation",
  },
  {
    ...PILOT_DRAFT,
    id: "physiology.inguinal-hernia.urgent-pain-editorial",
    displayName: "Urgent but transfer-stable adult with painful groin hernia",
    acuity: "urgent_stable",
    compatiblePhenotypeIds: [HERNIA_URGENT_L1],
    vitalRanges: {
      heartRateBpm: { minimum: 72, maximum: 100 },
      systolicBloodPressureMmHg: { minimum: 100, maximum: 120 },
      diastolicBloodPressureMmHg: { minimum: 60, maximum: 80 },
      temperatureF: { minimum: 97.7, maximum: 99.1 },
      oxygenSaturationPercent: { minimum: 95, maximum: 98 },
    },
    requiredFindings: ["Alert mental status"],
    excludedFindings: ["Shock", "Respiratory failure"],
    evidenceClaimIds: [
      "claim.inguinal.acute-irreducibility",
      "claim.inguinal.red-flag-context",
      "claim.physiology.resting_adult_ranges",
      "claim.physiology.oxygen_saturation_range",
    ],
    generationBasis: "editorial_simulation",
  },
  {
    ...PILOT_DRAFT,
    id: "physiology.appendicitis.urgent-stable-editorial",
    displayName: "Urgent but transfer-stable adult with suspected appendicitis",
    acuity: "urgent_stable",
    compatiblePhenotypeIds: [
      APPENDIX_L0,
      APPENDIX_EARLY_L1,
      APPENDIX_NO_IMAGING_L1,
    ],
    vitalRanges: {
      heartRateBpm: { minimum: 68, maximum: 100 },
      systolicBloodPressureMmHg: { minimum: 100, maximum: 120 },
      diastolicBloodPressureMmHg: { minimum: 60, maximum: 80 },
      temperatureF: { minimum: 97.7, maximum: 99.1 },
      oxygenSaturationPercent: { minimum: 95, maximum: 98 },
    },
    requiredFindings: ["Alert mental status"],
    excludedFindings: ["Shock", "Generalized peritonitis", "Hypoxemia"],
    evidenceClaimIds: [
      "claim.appendicitis.typical-pattern",
      "claim.appendicitis.outpatient-urgent-evaluation",
      "claim.physiology.resting_adult_ranges",
      "claim.physiology.oxygen_saturation_range",
    ],
    generationBasis: "editorial_simulation",
  },
] satisfies PhysiologyOverlay[];

const baseAdultPhenotype: Pick<
  PresentationPhenotype,
  | "presentationSetting"
  | "evidenceSupportedAgeBands"
  | "sexGenerationPolicy"
  | "bmiGenerationPolicy"
  | "comorbidityPolicy"
> = {
  presentationSetting: "outpatient_surgical_clinic",
  evidenceSupportedAgeBands: [...GENERAL_ADULT_AGE_BANDS],
  sexGenerationPolicy: {
    ...GENERAL_ADULT_SEX_POLICY,
    allowed: [...GENERAL_ADULT_SEX_POLICY.allowed],
  },
  bmiGenerationPolicy: { ...BROAD_ADULT_BMI_POLICY },
  comorbidityPolicy: "suppress_meaningful_comorbidities",
};

export const HERNIA_APPENDICITIS_PHENOTYPES = [
  {
    ...PILOT_DRAFT,
    ...baseAdultPhenotype,
    id: HERNIA_L0,
    diagnosisFamilyId: "inguinal_hernia",
    displayName: "Reducible symptomatic inguinal hernia",
    educationalTier: 0,
    acuity: "stable",
    requiredFacilityCapabilityIds: ["capability.examination"],
    allowedDispositions: ["elective_surgical_referral"],
    requiredFindings: [
      "Prior clinical documentation identifies an inguinal hernia",
      "Groin bulge that increases with standing or exertion",
      "Bulge is readily reducible on examination",
      "Recurring discomfort now limits lifting or exercise",
      "Stable general appearance",
    ],
    commonOptionalFindings: [
      "Cough impulse",
      "Aching after lifting",
      "Bulge becomes less apparent while supine",
    ],
    possibleFindings: ["Long-standing intermittent symptoms"],
    uncommonFindings: [],
    excludedFindings: [
      "Acute inability to reduce the bulge",
      "Severe or escalating groin pain",
      "Vomiting",
      "Abdominal distension",
      "Inability to pass stool or flatus",
      "Skin discoloration over the bulge",
      "Peritoneal signs",
      "Systemic illness",
    ],
    redFlags: [
      "New irreducibility",
      "Escalating pain",
      "Vomiting or obstructive symptoms",
      "Skin changes",
      "Peritoneal findings",
    ],
    physiologyOverlayIds: ["physiology.inguinal-hernia.stable-editorial"],
    compatibleResults: [
      "No laboratory or imaging result is required for a classic presentation",
      "Prior documentation of an inguinal hernia is compatible",
    ],
    differentialDiagnoses: [
      "Femoral hernia",
      "Groin lymphadenopathy",
      "Lipoma",
      "Hydrocele",
    ],
    generationConstraints: [
      "Generate an adult, nonpregnant patient",
      "Suppress meaningful comorbidity",
      "Keep name, portrait, sex, and nonclinical traits independent of disease selection",
      "Use prior confirmation of inguinal location when femoral-herniation uncertainty would otherwise make the case ambiguous",
      "Do not generate urgent-complication findings",
    ],
    clinicalProbabilityNotes: [
      "Reducibility and exertional prominence are supportive relationships, not numeric probabilities",
      "Sex and BMI weights are editorial",
    ],
    simulationWeight: {
      value: 1,
      rationale:
        "Editorial review weight for the uncomplicated phenotype; not a prevalence estimate.",
      basis: "editorial",
    },
    evidenceClaimIds: [
      "claim.inguinal.definition",
      "claim.inguinal.clinical-diagnosis",
      "claim.inguinal.symptomatic-referral",
    ],
    chiefComplaint: "Recurring groin bulge with activity-limiting discomfort",
    presentationTemplate:
      "A {ageYears}-year-old {sexLabel} adult with BMI {bmi} reports a documented inguinal hernia whose recurring discomfort now limits usual lifting or exercise. Findings: {findings}.",
  },
  {
    ...PILOT_DRAFT,
    ...baseAdultPhenotype,
    id: HERNIA_WW_L1,
    diagnosisFamilyId: "inguinal_hernia",
    displayName: "Selected minimally symptomatic man considering observation",
    educationalTier: 1,
    acuity: "stable",
    requiredFacilityCapabilityIds: ["capability.examination"],
    allowedDispositions: [
      "watchful_waiting_with_safety_net",
      "elective_surgical_referral",
    ],
    sexGenerationPolicy: {
      kind: "phenotype_eligibility_constraint",
      allowed: ["Male"],
      rationale:
        "This phenotype is intentionally limited to the population for whom guideline-supported watchful waiting is taught.",
    },
    requiredFindings: [
      "Adult man",
      "Prior clinical documentation identifies an inguinal hernia",
      "Groin bulge is reducible",
      "No pain limiting usual activities",
      "Patient asks whether observation is reasonable",
      "Stable general appearance",
    ],
    commonOptionalFindings: [
      "Minimal intermittent awareness of the bulge",
      "Bulge appears with coughing or standing",
    ],
    possibleFindings: ["Preference to defer an operation"],
    uncommonFindings: [],
    excludedFindings: [
      "Bulge is acutely nonreducible",
      "Meaningful activity-limiting pain",
      "Vomiting or obstructive symptoms",
      "Skin changes over the bulge",
      "Systemic illness",
    ],
    redFlags: [
      "New irreducibility",
      "Increasing pain",
      "Vomiting",
      "Abdominal distension",
      "Inability to pass stool or flatus",
    ],
    physiologyOverlayIds: ["physiology.inguinal-hernia.stable-editorial"],
    compatibleResults: [
      "No routine imaging result is required for a clinically apparent reducible hernia",
    ],
    differentialDiagnoses: [
      "Femoral hernia",
      "Groin lymphadenopathy",
      "Lipoma",
    ],
    generationConstraints: [
      "Generate only an adult man for this evidence-bounded phenotype",
      "Suppress meaningful comorbidity",
      "Do not use this phenotype to imply that every inguinal-hernia patient is male",
      "Do not generate meaningful symptoms or urgent features",
      "Include safety-net discussion in the correct response",
    ],
    clinicalProbabilityNotes: [
      "Male sex is an eligibility constraint for the teaching point, not a prevalence claim",
      "No numeric probability of eventual repair is generated",
    ],
    simulationWeight: {
      value: 0.55,
      rationale:
        "Editorial review weight for the bounded watchful-waiting concept; not claimed prevalence.",
      basis: "editorial",
    },
    evidenceClaimIds: [
      "claim.inguinal.watchful-waiting-men",
      "claim.inguinal.watchful-waiting-boundary",
    ],
    chiefComplaint: "Reducible groin bulge with few symptoms",
    presentationTemplate:
      "A {ageYears}-year-old man with BMI {bmi} asks whether his reducible, minimally symptomatic groin bulge can be observed. Findings: {findings}.",
  },
  {
    ...PILOT_DRAFT,
    ...baseAdultPhenotype,
    id: HERNIA_URGENT_L1,
    diagnosisFamilyId: "inguinal_hernia",
    displayName: "Painful acutely irreducible groin hernia",
    educationalTier: 1,
    acuity: "urgent_stable",
    requiredFacilityCapabilityIds: ["capability.examination"],
    allowedDispositions: ["emergency_department_transfer"],
    requiredFindings: [
      "Prior clinical documentation identifies an inguinal hernia",
      "New inability to reduce a previously reducible groin bulge",
      "Increasing groin pain",
    ],
    commonOptionalFindings: ["Localized tenderness"],
    possibleFindings: [
      "Vomiting",
      "Abdominal distension",
      "Skin erythema over the bulge",
    ],
    uncommonFindings: ["Reduced passage of stool or flatus"],
    excludedFindings: [
      "Bulge is readily reducible",
      "Symptoms have resolved",
      "Comfortable routine presentation",
      "Shock",
    ],
    redFlags: [
      "Acute irreducibility",
      "Escalating pain",
      "Vomiting",
      "Distension",
      "Obstipation",
      "Skin changes",
    ],
    physiologyOverlayIds: [
      "physiology.inguinal-hernia.urgent-pain-editorial",
    ],
    compatibleResults: ["No clinic test is required before emergency transfer"],
    differentialDiagnoses: [
      "Femoral hernia",
      "Bowel obstruction",
      "Strangulated groin hernia",
    ],
    generationConstraints: [
      "Generate an adult, nonpregnant patient",
      "Suppress meaningful comorbidity",
      "Keep sex broadly distributed",
      "Do not require clinic imaging or laboratory testing before transfer",
      "Do not teach forceful outpatient reduction or definitive treatment",
    ],
    clinicalProbabilityNotes: [
      "Acute painful irreducibility defines this urgent phenotype; obstructive findings are optional",
      "No probability of strangulation is asserted",
    ],
    simulationWeight: {
      value: 0.45,
      rationale:
        "Editorial review weight for an urgent recognition case; not claimed prevalence.",
      basis: "editorial",
    },
    evidenceClaimIds: [
      "claim.inguinal.acute-irreducibility",
      "claim.inguinal.red-flag-context",
      "claim.inguinal.terminology",
    ],
    chiefComplaint: "Painful groin bulge that no longer reduces",
    presentationTemplate:
      "A {ageYears}-year-old {sexLabel} adult with BMI {bmi} has a newly painful groin bulge that no longer reduces. Findings: {findings}.",
  },
  {
    ...PILOT_DRAFT,
    ...baseAdultPhenotype,
    id: APPENDIX_L0,
    diagnosisFamilyId: "acute_appendicitis",
    displayName: "Classic concerning appendicitis presentation",
    educationalTier: 0,
    acuity: "urgent_stable",
    requiredFacilityCapabilityIds: ["capability.examination"],
    allowedDispositions: ["emergency_department_transfer"],
    requiredFindings: [
      "Pain began near the umbilicus and migrated to the right lower quadrant",
      "Progressive right-lower-quadrant tenderness",
      "Symptoms worsened over several hours",
    ],
    commonOptionalFindings: [
      "Anorexia",
      "Nausea",
      "Pain worsens with movement",
    ],
    possibleFindings: ["One episode of vomiting"],
    uncommonFindings: [],
    excludedFindings: [
      "Known pregnancy",
      "Pain has completely resolved",
      "Generalized peritonitis",
      "Shock",
      "A benign alternate diagnosis has been established",
    ],
    redFlags: [
      "Progressive focal tenderness",
      "Guarding",
      "Rebound tenderness",
      "Clinical deterioration",
    ],
    physiologyOverlayIds: [
      "physiology.appendicitis.urgent-stable-editorial",
    ],
    compatibleResults: [
      "No clinic imaging result is required before transfer",
      "A normal or unavailable clinic laboratory result does not replace the clinical disposition decision",
    ],
    differentialDiagnoses: [
      "Gastroenteritis",
      "Ureteral stone",
      "Urinary tract infection",
      "Gynecologic causes of right-lower-quadrant pain",
    ],
    generationConstraints: [
      "Generate an adult, nonpregnant patient",
      "Suppress meaningful comorbidity",
      "Do not use race or ethnicity in disease selection",
      "Do not require CT, ultrasound, or inpatient treatment in the clinic",
      "End the encounter at emergency-department transfer",
    ],
    clinicalProbabilityNotes: [
      "Migration and focal tenderness are supportive pattern features, not numeric probabilities",
      "Sex and BMI are editorial",
    ],
    simulationWeight: {
      value: 1,
      rationale:
        "Editorial review weight for a clear Level 0 disposition case; not claimed prevalence.",
      basis: "editorial",
    },
    evidenceClaimIds: [
      "claim.appendicitis.typical-pattern",
      "claim.appendicitis.pattern-not-diagnostic",
      "claim.appendicitis.outpatient-urgent-evaluation",
    ],
    chiefComplaint: "Worsening abdominal pain now in the right lower quadrant",
    presentationTemplate:
      "A {ageYears}-year-old {sexLabel} adult with BMI {bmi} has worsening abdominal pain that migrated to the right lower quadrant. Findings: {findings}.",
  },
  {
    ...PILOT_DRAFT,
    ...baseAdultPhenotype,
    id: APPENDIX_EARLY_L1,
    diagnosisFamilyId: "acute_appendicitis",
    displayName: "Early or incomplete concerning appendicitis pattern",
    educationalTier: 1,
    acuity: "urgent_stable",
    requiredFacilityCapabilityIds: ["capability.examination"],
    allowedDispositions: ["emergency_department_transfer"],
    requiredFindings: [
      "Progressively worsening abdominal pain",
      "Focal right-lower-quadrant tenderness",
      "Focal tenderness persists on repeat examination",
    ],
    commonOptionalFindings: ["Anorexia", "Nausea", "Pain with movement"],
    possibleFindings: [
      "Pain did not clearly migrate",
      "No measured fever",
      "Mild urinary symptoms without a definitive urinary diagnosis",
    ],
    uncommonFindings: [],
    excludedFindings: [
      "Known pregnancy",
      "Symptoms have fully resolved",
      "A confirmed benign alternate diagnosis",
      "Shock",
      "Generalized peritonitis",
    ],
    redFlags: [
      "Progressive focal pain",
      "Guarding or rebound tenderness",
      "Worsening general condition",
    ],
    physiologyOverlayIds: [
      "physiology.appendicitis.urgent-stable-editorial",
    ],
    compatibleResults: [
      "Urinalysis findings may be nondiagnostic",
      "No clinic CT result is required",
    ],
    differentialDiagnoses: [
      "Gastroenteritis",
      "Urinary tract infection",
      "Ureteral stone",
      "Constipation",
      "Gynecologic causes of acute pelvic or abdominal pain",
    ],
    generationConstraints: [
      "Generate an adult, nonpregnant patient",
      "Suppress meaningful comorbidity",
      "Include one incomplete feature or meaningful distractor",
      "Keep the combined presentation concerning enough for urgent evaluation",
      "Keep recognition and disposition as two separately scored concepts",
      "End the encounter at emergency-department transfer",
    ],
    clinicalProbabilityNotes: [
      "Absence of migration or fever does not exclude appendicitis",
      "No exact likelihood or score is generated",
    ],
    simulationWeight: {
      value: 0.65,
      rationale:
        "Editorial review weight for a multistep Level 1 case; not claimed prevalence.",
      basis: "editorial",
    },
    evidenceClaimIds: [
      "claim.appendicitis.typical-pattern",
      "claim.appendicitis.pattern-not-diagnostic",
      "claim.appendicitis.outpatient-urgent-evaluation",
      "claim.appendicitis.imaging-context",
      "claim.appendicitis.no-plain-xray",
    ],
    chiefComplaint: "Worsening focal right-lower-quadrant pain",
    presentationTemplate:
      "A {ageYears}-year-old {sexLabel} adult with BMI {bmi} has progressively worsening focal right-lower-quadrant pain. Findings: {findings}.",
  },
  {
    ...PILOT_DRAFT,
    ...baseAdultPhenotype,
    id: APPENDIX_NO_IMAGING_L1,
    diagnosisFamilyId: "acute_appendicitis",
    displayName: "Concerning appendicitis without appropriate onsite imaging",
    educationalTier: 1,
    acuity: "urgent_stable",
    requiredFacilityCapabilityIds: ["capability.examination"],
    allowedDispositions: ["emergency_department_transfer"],
    requiredFindings: [
      "Progressively worsening right-lower-quadrant pain",
      "Focal right-lower-quadrant tenderness",
      "Appropriate appendicitis imaging is unavailable in the clinic",
    ],
    commonOptionalFindings: [
      "Anorexia",
      "Nausea",
    ],
    possibleFindings: ["Incomplete classic symptom migration"],
    uncommonFindings: [],
    excludedFindings: [
      "Known pregnancy",
      "Clinical concern has resolved",
      "A definitive alternate diagnosis",
      "Shock",
      "Generalized peritonitis",
    ],
    redFlags: [
      "Progressive focal pain",
      "Guarding or rebound tenderness",
      "Clinical deterioration",
    ],
    physiologyOverlayIds: [
      "physiology.appendicitis.urgent-stable-editorial",
    ],
    compatibleResults: [
      "No CT or ultrasound is available in the clinic",
      "Plain X-ray is available but is not an appropriate substitute",
    ],
    differentialDiagnoses: [
      "Gastroenteritis",
      "Ureteral stone",
      "Urinary tract infection",
      "Gynecologic causes of right-lower-quadrant pain",
    ],
    generationConstraints: [
      "Generate an adult, nonpregnant patient",
      "Suppress meaningful comorbidity",
      "Do not order plain X-ray as a substitute for appropriate appendicitis imaging",
      "Do not delay transfer for a future outpatient CT",
      "End the encounter at emergency-department transfer",
    ],
    clinicalProbabilityNotes: [
      "Facility availability affects disposition but does not create a clinical probability",
      "No exact diagnostic probability is generated",
    ],
    simulationWeight: {
      value: 0.35,
      rationale:
        "Editorial review weight for the unavailable-test safety boundary; not claimed prevalence.",
      basis: "editorial",
    },
    evidenceClaimIds: [
      "claim.appendicitis.pattern-not-diagnostic",
      "claim.appendicitis.outpatient-urgent-evaluation",
      "claim.appendicitis.imaging-context",
      "claim.appendicitis.no-plain-xray",
    ],
    chiefComplaint: "Concerning right-lower-quadrant pain without onsite CT",
    presentationTemplate:
      "A {ageYears}-year-old {sexLabel} adult with BMI {bmi} has progressively worsening right-lower-quadrant pain, and appropriate appendicitis imaging is unavailable onsite. Findings: {findings}.",
  },
] satisfies PresentationPhenotype[];
