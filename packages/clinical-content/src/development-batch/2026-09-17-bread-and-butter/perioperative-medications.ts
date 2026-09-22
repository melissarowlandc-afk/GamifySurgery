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

const AHA_ACC = "source.bread-butter.aha-acc-perioperative-2024";
const CHEST = "source.bread-butter.chest-antithrombotic-2022";

const CLAIM_IDS = {
  betaBlocker: "claim.bread-butter.beta-blocker.continue-chronic",
  noBridge: "claim.bread-butter.atrial-fibrillation.warfarin-no-routine-bridge",
} as const;

const CONCEPT_IDS = {
  betaBlocker: "concept.perioperative-medication.continue-chronic-beta-blocker",
  noBridge: "concept.perioperative-medication.warfarin-interruption-no-bridge",
} as const;

export const PERIOPERATIVE_MEDICATIONS_CLAIMS = [
  claim({
    id: CLAIM_IDS.betaBlocker,
    statement:
      "A patient taking a stable beta-blocker dose should generally continue it through noncardiac surgery when clinical circumstances do not create a contraindication.",
    sourceIds: [AHA_ACC],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "This does not override hypotension, bradycardia, shock, or another reason to hold therapy and does not support starting a beta blocker on surgery day solely for risk reduction.",
    applicablePopulation:
      "Adults on a tolerated stable chronic beta-blocker dose before elective noncardiac surgery.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.noBridge,
    statement:
      "For a patient receiving warfarin for atrial fibrillation who requires interruption for elective surgery, routine therapeutic-dose heparin bridging is not recommended.",
    sourceIds: [CHEST],
    evidenceCategory: "management",
    certainty: "high",
    limitation:
      "Selected very-high-thromboembolic-risk situations require individualized consideration; this does not concern ordinary postoperative VTE prophylaxis or mechanical-valve cases.",
    applicablePopulation:
      "Selected adults taking warfarin for nonvalvular atrial fibrillation without recent stroke, TIA, thrombosis, a mechanical valve, or another very-high-risk feature.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const PERIOPERATIVE_MEDICATIONS_SOURCES = linkSourcesToClaims(
  [
    source({
      id: AHA_ACC,
      title:
        "2024 AHA/ACC/ACS/ASNC/HRS/SCA/SCCT/SCMR/SVM Guideline for Perioperative Cardiovascular Management for Noncardiac Surgery",
      completeCitation:
        "Thompson A, Fleischmann KE, Smilowitz NR, de Las Fuentes L, Mukherjee D, Aggarwal NR, Ahmad FS, Allen RB, Altin SE, Auerbach A, Berger JS, Chow B, Dakik HA, Eisenstein EL, Gerhard-Herman M, Ghadimi K, Kachulis B, Leclerc J, Lee CS, Macaulay TE, Mates G, Merli GJ, Parwani P, Poole JE, Rich MW, Ruetzler K, Stain SC, Sweitzer B, Talbot AW, Vallabhajosyula S, Whittle J, Williams KA Sr. 2024 AHA/ACC/ACS/ASNC/HRS/SCA/SCCT/SCMR/SVM Guideline for Perioperative Cardiovascular Management for Noncardiac Surgery. Circulation. 2024;150(19):e351-e442. doi:10.1161/CIR.0000000000001285. PMID:39316661.",
      organizationOrJournal: "Circulation / AHA and ACC multisociety collaboration",
      authors: [
        "Thompson A", "Fleischmann KE", "Smilowitz NR", "de Las Fuentes L", "Mukherjee D", "Aggarwal NR", "Ahmad FS", "Allen RB", "Altin SE", "Auerbach A", "Berger JS", "Chow B", "Dakik HA", "Eisenstein EL", "Gerhard-Herman M", "Ghadimi K", "Kachulis B", "Leclerc J", "Lee CS", "Macaulay TE", "Mates G", "Merli GJ", "Parwani P", "Poole JE", "Rich MW", "Ruetzler K", "Stain SC", "Sweitzer B", "Talbot AW", "Vallabhajosyula S", "Whittle J", "Williams KA Sr",
      ],
      publicationYear: 2024,
      doi: "10.1161/CIR.0000000000001285",
      pmid: "39316661",
      officialUrl:
        "https://professional.heart.org/en/guidelines-statements/2024-ahaaccacsasnchrsscascctscmrsvm-guideline-for-perioperative-cardiovascularcir0000000000001285",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted multisociety guideline",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted independently phrased fact only; no guideline prose, tables, algorithms, or slides reproduced.",
      authorityAssessment:
        "Current AHA/ACC multisociety guideline directly supporting continuation of stable beta-blocker therapy.",
      usageRole: "evidence",
    }),
    source({
      id: CHEST,
      title:
        "Perioperative Management of Antithrombotic Therapy: An American College of Chest Physicians Clinical Practice Guideline",
      completeCitation:
        "Douketis JD, Spyropoulos AC, Murad MH, Arcelus JI, Dager WE, Dunn AS, Fargo RA, Levy JH, Samama CM, Shah SH, Sherwood MW, Tafur AJ, Tang LV, Moores LK. Perioperative Management of Antithrombotic Therapy: An American College of Chest Physicians Clinical Practice Guideline. Chest. 2022;162(5):e207-e243. doi:10.1016/j.chest.2022.07.025. PMID:35964704.",
      organizationOrJournal: "CHEST / American College of Chest Physicians",
      authors: [
        "Douketis JD", "Spyropoulos AC", "Murad MH", "Arcelus JI", "Dager WE", "Dunn AS", "Fargo RA", "Levy JH", "Samama CM", "Shah SH", "Sherwood MW", "Tafur AJ", "Tang LV", "Moores LK",
      ],
      publicationYear: 2022,
      doi: "10.1016/j.chest.2022.07.025",
      pmid: "35964704",
      officialUrl:
        "https://journal.chestnet.org/article/S0012-3692%2822%2901359-9/fulltext",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted professional-society guideline",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted independently phrased fact only; no recommendation prose, tables, or algorithms reproduced.",
      authorityAssessment:
        "Current CHEST guideline directly supporting no routine therapeutic-dose bridging for atrial fibrillation when warfarin is interrupted.",
      usageRole: "evidence",
    }),
  ],
  PERIOPERATIVE_MEDICATIONS_CLAIMS,
);

const plan = (
  id: string,
  label: string,
  rationale: string,
  isCorrect = false,
): ChoiceSpec => ({ id, label, rationale, isCorrect, timing: { kind: "no_test" } });

const stories = [
  ["medication-review", "Preoperative medications", "is reviewing medications before elective noncardiac surgery"],
  ["surgery-medications", "Surgery medication plan", "returns to finalize the medication plan for an elective operation"],
  ["preoperative-visit", "Preoperative visit", "is preparing for elective noncardiac surgery and has questions about chronic medications"],
  ["medication-instructions", "Medication instructions", "requests medication instructions before an elective noncardiac operation"],
] as const;

const cases: CaseSpec[] = stories.map(([slug, complaint, detail], index) => {
  const anticoagulationUpdate =
    "The same medication review shows warfarin for nonvalvular atrial fibrillation. The operation requires interruption. There is no mechanical valve, recent stroke or TIA, recent thrombosis, prior perioperative stroke, or other very-high-risk feature.";
  return {
    id: `case.bread-butter.perioperative-medications.${slug}`,
    displayName: "Elective surgery medication review",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}. A chronic beta blocker is well tolerated at a stable dose; pulse and blood pressure are normal, with no shock or contraindication.`,
    ageYears: [55, 71],
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: CONCEPT_IDS.betaBlocker,
        stem: "How should {patientName}'s chronic beta blocker be managed?",
        choices: [
          plan(`continue_${index + 1}`, "Continue the stable beta blocker", "Stable chronic beta-blocker therapy should continue without a contraindication.", true),
          plan(`hold_${index + 1}`, "Hold the beta blocker before surgery", "Routine interruption is not indicated in this stable, tolerant patient."),
          plan(`double_${index + 1}`, "Double the dose on surgery day", "Dose escalation is not supported and can cause hypotension or bradycardia."),
          plan(`replace_${index + 1}`, "Replace it with another agent", "The case provides no indication to substitute another medication."),
        ],
        explanation:
          "Continue the tolerated stable chronic beta blocker through the perioperative period because no contraindication is present.",
        claimIds: [CLAIM_IDS.betaBlocker],
      },
      {
        conceptId: CONCEPT_IDS.noBridge,
        currentUpdate: anticoagulationUpdate,
        stem: "Which perioperative anticoagulation plan best fits {patientName}?",
        choices: [
          plan(`interrupt_${index + 1}`, "Interrupt warfarin without bridging", "Routine therapeutic-dose heparin bridging is not recommended for this selected atrial-fibrillation patient.", true),
          plan(`bridge_${index + 1}`, "Interrupt warfarin and add heparin bridging", "The case lacks a very-high-risk feature warranting individualized bridging consideration."),
          plan(`continue_${index + 1}`, "Continue warfarin unchanged", "The planned operation has already been identified as requiring interruption."),
          plan(`stop_${index + 1}`, "Stop anticoagulation indefinitely", "The question concerns temporary perioperative interruption, not permanent cessation."),
        ],
        explanation:
          "Interrupt warfarin without routine therapeutic-dose heparin bridging for this selected nonvalvular atrial-fibrillation patient. Exact interruption timing remains procedure- and patient-specific.",
        claimIds: [CLAIM_IDS.noBridge],
      },
    ],
  };
});

export const PERIOPERATIVE_MEDICATIONS_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.betaBlocker,
    educationalTier: 0,
    displayName: "Continuation of a chronic beta blocker",
    learningObjective:
      "Continue a tolerated chronic beta blocker through noncardiac surgery when no contraindication is present.",
    earliestFacilityStage: 1,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.betaBlocker],
  }),
  concept({
    id: CONCEPT_IDS.noBridge,
    educationalTier: 1,
    displayName: "Warfarin interruption without routine bridging",
    learningObjective:
      "Avoid routine therapeutic-dose heparin bridging when warfarin is interrupted for selected nonvalvular atrial fibrillation.",
    earliestFacilityStage: 1,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.noBridge],
  }),
];

const family = createDevelopmentFamily({
  concepts: PERIOPERATIVE_MEDICATIONS_CONCEPTS,
  cases,
  sourceLabels: [
    "AHA/ACC perioperative cardiovascular guideline (2024)",
    "CHEST perioperative antithrombotic guideline (2022)",
  ],
});

export const PERIOPERATIVE_MEDICATIONS_TESTED_CONCEPTS = family.testedConcepts;
export const PERIOPERATIVE_MEDICATIONS_QUESTIONS = family.questions;
export const PERIOPERATIVE_MEDICATIONS_CASES = family.cases;
export const PERIOPERATIVE_MEDICATIONS_CASE_REVIEWS = family.caseReviews;
export const PERIOPERATIVE_MEDICATIONS_TIMING_ENTRIES = family.timingEntries;
export const PERIOPERATIVE_MEDICATIONS_AUTHORING_REVIEW = NEEDS_REVIEW;
export const PERIOPERATIVE_MEDICATIONS_SERVICE_CONTRACTS = [];
