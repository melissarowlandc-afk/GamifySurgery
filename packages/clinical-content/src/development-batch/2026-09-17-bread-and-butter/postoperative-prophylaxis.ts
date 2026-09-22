import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
  type ChoiceSpec,
} from "./batch-helpers";

const SHEA = "source.bread-butter.shea-ssi-2022-update";
const SEOM = "source.bread-butter.seom-cancer-vte-2024";
const ASCO = "source.bread-butter.asco-cancer-vte-2023";

const CLAIM_IDS = {
  antibiotics: "claim.bread-butter.antimicrobial-prophylaxis.stop-at-closure",
  vte: "claim.bread-butter.cancer-surgery.extended-vte-prophylaxis",
} as const;

const CONCEPT_IDS = {
  antibiotics: "concept.postoperative-prophylaxis.stop-antibiotics-at-closure",
  vte: "concept.postoperative-prophylaxis.extended-cancer-vte-prevention",
} as const;

export const POSTOPERATIVE_PROPHYLAXIS_CLAIMS = [
  claim({
    id: CLAIM_IDS.antibiotics,
    statement:
      "Surgical antimicrobial prophylaxis should be discontinued after incision closure; continuing it solely because a drain remains does not reduce surgical-site infection and adds antimicrobial harms.",
    sourceIds: [SHEA],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "This concerns prophylaxis only, not treatment for an established infection or another therapeutic indication.",
    applicablePopulation:
      "Postoperative adults with a closed incision, no established infection, and a prophylactic antibiotic continued solely because a drain remains.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.vte,
    statement:
      "After major abdominal or pelvic cancer surgery, selected patients with high VTE risk and acceptable bleeding risk may receive extended postoperative pharmacologic prophylaxis for up to about four weeks; LMWH is an established option.",
    sourceIds: [SEOM, ASCO],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "This is not universal for all cancer operations, and LMWH is not the only current agent; patient selection, renal function, and bleeding risk matter.",
    applicablePopulation:
      "Selected high-VTE-risk adults after major abdominal or pelvic cancer surgery with adequate renal function and low bleeding risk.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const POSTOPERATIVE_PROPHYLAXIS_SOURCES = linkSourcesToClaims(
  [
    source({
      id: SHEA,
      title: "Strategies to Prevent Surgical Site Infections in Acute-Care Hospitals: 2022 Update",
      completeCitation:
        "Calderwood MS, Anderson DJ, Bratzler DW, Dellinger EP, Garcia-Houchins S, Maragakis LL, Nyquist AC, Perkins KM, Preas MA, Saiman L, Schaffzin JK, Schweizer M, Yokoe DS, Kaye KS. Strategies to Prevent Surgical Site Infections in Acute-Care Hospitals: 2022 Update. Infect Control Hosp Epidemiol. 2023;44(5):695-720. doi:10.1017/ice.2023.67. PMID:37137483. PMCID:PMC10867741.",
      organizationOrJournal:
        "Infection Control & Hospital Epidemiology / SHEA, IDSA, APIC, AHA, and The Joint Commission",
      authors: [
        "Calderwood MS", "Anderson DJ", "Bratzler DW", "Dellinger EP", "Garcia-Houchins S", "Maragakis LL", "Nyquist AC", "Perkins KM", "Preas MA", "Saiman L", "Schaffzin JK", "Schweizer M", "Yokoe DS", "Kaye KS",
      ],
      publicationYear: 2023,
      doi: "10.1017/ice.2023.67",
      pmid: "37137483",
      officialUrl: "https://stacks.cdc.gov/view/cdc/155079",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel:
        "Copyrighted journal author manuscript in CDC Stacks; public access is not public-domain status",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted independently phrased fact only; no prose, tables, figures, or implementation sections reproduced.",
      authorityAssessment:
        "Current SHEA-sponsored multisociety update directly addressing prophylaxis after closure when drains remain.",
      usageRole: "evidence",
    }),
    source({
      id: SEOM,
      title: "SEOM clinical guidelines on venous thromboembolism and cancer (2023)",
      completeCitation:
        "Ortega Moran L, Pelegrin Mateo FJ, Porta Balanya R, Rogado Revuelta J, Ros Martinez S, Berros Fombella JP, Brozos Vazquez EM, Luque Caro N, Munoz Langa J, Salgado Fernandez M. SEOM clinical guidelines on venous thromboembolism (VTE) and cancer (2023). Clin Transl Oncol. 2024;26(11):2877-2901. doi:10.1007/s12094-024-03605-2. PMID:39110395. PMCID:PMC11467034.",
      organizationOrJournal:
        "Clinical & Translational Oncology / Spanish Society of Medical Oncology",
      authors: [
        "Ortega Moran L", "Pelegrin Mateo FJ", "Porta Balanya R", "Rogado Revuelta J", "Ros Martinez S", "Berros Fombella JP", "Brozos Vazquez EM", "Luque Caro N", "Munoz Langa J", "Salgado Fernandez M",
      ],
      publicationYear: 2024,
      doi: "10.1007/s12094-024-03605-2",
      pmid: "39110395",
      officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11467034/",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Creative Commons Attribution 4.0 International",
      reuseStatus: "cc_by_4_0",
      reuseNotes:
        "Attributed independently written fact only; no guideline prose, tables, or algorithms reproduced.",
      authorityAssessment:
        "Current society guideline defining selected high-risk major abdominal or pelvic cancer surgery for extended prophylaxis up to four weeks.",
      usageRole: "evidence",
    }),
    source({
      id: ASCO,
      title:
        "Venous Thromboembolism Prophylaxis and Treatment in Patients With Cancer: ASCO Guideline Update",
      completeCitation:
        "Key NS, Khorana AA, Kuderer NM, Bohlke K, Lee AYY, Arcelus JI, Wong SL, Balaban EP, Flowers CR, Gates LE, Kakkar AK, Tempero MA, Gupta S, Lyman GH, Falanga A. Venous Thromboembolism Prophylaxis and Treatment in Patients With Cancer: ASCO Guideline Update. J Clin Oncol. 2023;41(16):3063-3071. doi:10.1200/JCO.23.00294. PMID:37075273.",
      organizationOrJournal:
        "Journal of Clinical Oncology / American Society of Clinical Oncology",
      authors: [
        "Key NS", "Khorana AA", "Kuderer NM", "Bohlke K", "Lee AYY", "Arcelus JI", "Wong SL", "Balaban EP", "Flowers CR", "Gates LE", "Kakkar AK", "Tempero MA", "Gupta S", "Lyman GH", "Falanga A",
      ],
      publicationYear: 2023,
      doi: "10.1200/JCO.23.00294",
      pmid: "37075273",
      officialUrl: "https://ascopubs.org/doi/10.1200/JCO.23.00294",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted professional-society guideline",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted independently phrased fact only; no article prose, tables, or tools reproduced.",
      authorityAssessment:
        "Current ASCO focused update cross-checking extended prophylaxis and current agent options after cancer surgery.",
      usageRole: "cross_check",
    }),
  ],
  POSTOPERATIVE_PROPHYLAXIS_CLAIMS,
);

const plan = (
  id: string,
  label: string,
  rationale: string,
  isCorrect = false,
): ChoiceSpec => ({ id, label, rationale, isCorrect, timing: { kind: "no_test" } });

const stories = [
  ["discharge-medications", "Discharge medications", "returns after major colorectal cancer surgery to review the discharge medication list"],
  ["drain-medications", "Drain medication review", "has a surgical drain after major colorectal cancer surgery and asks which discharge medications should continue"],
  ["postoperative-prophylaxis", "Postoperative prophylaxis", "returns after major abdominal cancer surgery with questions about prophylactic medications"],
  ["cancer-surgery-follow-up", "Cancer surgery follow-up", "brings the medication list from a recent major pelvic cancer operation"],
] as const;

const cases: CaseSpec[] = stories.map(([slug, complaint, detail], index) => {
  const vteUpdate =
    "The review also confirms restricted postoperative mobility and obesity, creating high VTE risk. Bleeding risk is low, renal function is adequate, and LMWH has already been selected for prophylaxis.";
  return {
    id: `case.bread-butter.postoperative-prophylaxis.${slug}`,
    displayName: "Cancer surgery prophylaxis review",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}. A drain remains; antibiotics are listed only for prophylaxis, with a closed incision and no infection.`,
    ageYears: [52, 69],
    sexLabels: ["Female", "Male"],
    stage: 2,
    nodes: [
      {
        conceptId: CONCEPT_IDS.antibiotics,
        stem: "How should {patientName}'s prophylactic antibiotic be managed?",
        choices: [
          plan(`stop_${index + 1}`, "Stop prophylactic antibiotics", "A drain alone does not justify prophylaxis after incision closure.", true),
          plan(`drain_${index + 1}`, "Continue until drain removal", "Continuing prophylaxis solely for a drain does not reduce infection and adds harm."),
          plan(`healed_${index + 1}`, "Continue until the wound heals", "A closed uninfected incision does not justify prolonged antimicrobial prophylaxis."),
          plan(`indefinite_${index + 1}`, "Continue without a stop date", "Indefinite prophylaxis has no indication and increases antimicrobial exposure."),
        ],
        explanation:
          "Stop surgical antimicrobial prophylaxis after incision closure when no infection exists, even if a drain remains.",
        claimIds: [CLAIM_IDS.antibiotics],
      },
      {
        conceptId: CONCEPT_IDS.vte,
        currentUpdate: vteUpdate,
        stem: "What total postoperative LMWH course best fits {patientName}?",
        choices: [
          plan(`four_weeks_${index + 1}`, "28 days total", "Extended prophylaxis fits this selected high-risk cancer-surgery patient.", true),
          plan(`discharge_${index + 1}`, "Until hospital discharge", "Stopping at discharge omits the supported extended course for this selected high-risk patient."),
          plan(`three_months_${index + 1}`, "Three months total", "A three-month course is not the prophylactic duration supported for this scenario."),
          plan(`indefinite_${index + 1}`, "Continue indefinitely", "The case concerns a finite prophylactic course, not indefinite treatment."),
        ],
        explanation:
          "Use an extended total postoperative LMWH course of about 28 days for this selected high-VTE-risk patient after major abdominal or pelvic cancer surgery. LMWH is an established option, not the only current agent.",
        claimIds: [CLAIM_IDS.vte],
      },
    ],
  };
});

export const POSTOPERATIVE_PROPHYLAXIS_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.antibiotics,
    educationalTier: 0,
    displayName: "Stop surgical prophylactic antibiotics after closure",
    learningObjective:
      "Stop surgical antimicrobial prophylaxis after incision closure when no infection exists, even if a drain remains.",
    earliestFacilityStage: 2,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.antibiotics],
  }),
  concept({
    id: CONCEPT_IDS.vte,
    educationalTier: 1,
    displayName: "Extended VTE prophylaxis after selected cancer surgery",
    learningObjective:
      "Use about four weeks of postoperative pharmacologic prophylaxis for a selected high-VTE-risk patient after major abdominal or pelvic cancer surgery.",
    earliestFacilityStage: 2,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.vte],
  }),
];

const family = createDevelopmentFamily({
  concepts: POSTOPERATIVE_PROPHYLAXIS_CONCEPTS,
  cases,
  sourceLabels: [
    "SHEA multisociety SSI prevention update (2023)",
    "SEOM cancer VTE guideline (2024)",
    "ASCO cancer VTE guideline update (2023)",
  ],
});

export const POSTOPERATIVE_PROPHYLAXIS_TESTED_CONCEPTS = family.testedConcepts;
export const POSTOPERATIVE_PROPHYLAXIS_QUESTIONS = family.questions;
export const POSTOPERATIVE_PROPHYLAXIS_CASES = family.cases;
export const POSTOPERATIVE_PROPHYLAXIS_CASE_REVIEWS = family.caseReviews;
export const POSTOPERATIVE_PROPHYLAXIS_TIMING_ENTRIES = family.timingEntries;
export const POSTOPERATIVE_PROPHYLAXIS_AUTHORING_REVIEW = NEEDS_REVIEW;
export const POSTOPERATIVE_PROPHYLAXIS_SERVICE_CONTRACTS = [];
