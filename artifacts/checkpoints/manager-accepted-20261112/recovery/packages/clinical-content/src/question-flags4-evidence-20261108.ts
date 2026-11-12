import type {ClinicalSource,EvidenceClaim} from "./pilot-schema";

export const QUESTION_FLAGS4_CLAIMS:(EvidenceClaim&{basisClaimIds:string[];verificationScope:string})[]=[
  {
    "contentVersion": "question-authoring.2026-11-08.flags4-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags4.20261108.carbohydrate-phosphate-uptake",
    "statement": "Following substantial undernutrition, carbohydrate reintroduction can lower serum phosphate through insulin-associated uptake into cells.",
    "basisClaimIds": [
      "claim.gs028f.refeeding.insulin-phosphate-shift"
    ],
    "sourceIds": [
      "source.gs028f.zhang_refeeding2023"
    ],
    "evidenceCategory": "definition",
    "certainty": "high",
    "limitation": "The sole recorded direct mechanism source is the background physiology in a 2023 neurocritical cohort report. AuSPEN supports the diagnostic caution, not a new causal exclusion algorithm. No clinical diagnosis, exact phosphate value, feeding interval/rate, incidence or management plan is inferred. Sources are reused offline with their original 2026-10-07 access/check dates.",
    "applicablePopulation": "The bounded constructed adult nutrition-restart mechanism case; not a diagnostic or management protocol.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Independent application of the already recorded atomic fact. No external source retrieval or currentness check; original basis/access dates retained."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.flags4-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags4.20261108.anabolic-transition",
    "statement": "Resuming nutrition after starvation favors anabolic rather than catabolic metabolism.",
    "basisClaimIds": [
      "claim.gs028f.refeeding.anabolic-transition"
    ],
    "sourceIds": [
      "source.gs028f.zhang_refeeding2023"
    ],
    "evidenceCategory": "definition",
    "certainty": "high",
    "limitation": "Qualitative background physiology only. No anabolic rate, energy requirement or phosphate threshold is introduced; the existing single-source limitation remains.",
    "applicablePopulation": "The bounded constructed adult nutrition-restart mechanism case; not a diagnostic or management protocol.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Independent application of the already recorded atomic fact. No external source retrieval or currentness check; original basis/access dates retained."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.flags4-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags4.20261108.diagnostic-boundary",
    "statement": "A fall in serum phosphate after feeding does not, by itself, establish refeeding syndrome.",
    "basisClaimIds": [
      "claim.gs028f.refeeding.phosphate-not-specific"
    ],
    "sourceIds": [
      "source.gs028f.auspen_refeeding2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Recorded AuSPEN caution only; no diagnostic definition, timing rule, percentage decline, alternate-cause algorithm or treatment rule is adopted.",
    "applicablePopulation": "The bounded constructed adult nutrition-restart mechanism case; not a diagnostic or management protocol.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Independent application of the already recorded atomic fact. No external source retrieval or currentness check; original basis/access dates retained."
  }
];
export const QUESTION_FLAGS4_BASIS_CLAIMS:EvidenceClaim[]=[
  {
    "contentVersion": "development-batch.2026-10-07.variety.2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028f.refeeding.insulin-phosphate-shift",
    "statement": "After substantial undernutrition, carbohydrate reintroduction can increase insulin and promote cellular uptake of phosphate, contributing to a fall in serum phosphate during refeeding.",
    "sourceIds": [
      "source.gs028f.zhang_refeeding2023"
    ],
    "evidenceCategory": "definition",
    "certainty": "high",
    "limitation": "The original 2023 cohort report's Introduction is the sole direct mechanism source in this packet. Stable physiology, not its neurocritical risk model or management algorithm. No exact intake, interval, phosphate threshold or claim that every postfeeding fall has this cause.",
    "applicablePopulation": "Adults with a supplied compatible outside refeeding course after substantial undernutrition.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "development-batch.2026-10-07.variety.2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028f.refeeding.anabolic-transition",
    "statement": "Reintroduction of nutrition after starvation shifts metabolism from a predominantly catabolic state toward an anabolic state.",
    "sourceIds": [
      "source.gs028f.zhang_refeeding2023"
    ],
    "evidenceCategory": "definition",
    "certainty": "high",
    "limitation": "Qualitative mechanism background in the observational report; no numerical energy requirement, timing or incidence adopted. The source population is neurocritical care, but only the stated background physiology is used.",
    "applicablePopulation": "Adults discussing an already evaluated refeeding-related electrolyte course.",
    "lastCheckedOn": "2026-10-07"
  },
  {
    "contentVersion": "development-batch.2026-10-07.variety.2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.gs028f.refeeding.phosphate-not-specific",
    "statement": "A low serum phosphate concentration has causes other than refeeding, so that result alone does not establish refeeding syndrome.",
    "sourceIds": [
      "source.gs028f.auspen_refeeding2025"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "AuSPEN 2025 risk and diagnosis discussion supports this limit. No particular diagnostic definition, percentage fall, timing rule or alternative-cause algorithm is adopted. The mechanism cases supply the outside team's assessment and relevant course.",
    "applicablePopulation": "Adults with low phosphate interpreted in a clinical context.",
    "lastCheckedOn": "2026-10-07"
  }
];
export const QUESTION_FLAGS4_SOURCES:(ClinicalSource&{sourceStatus:string;supportedNewClaimIds:string[];intendedUse:string})[]=[
  {
    "contentVersion": "question-authoring.2026-11-08.flags4-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028f.zhang_refeeding2023",
    "title": "Refeeding physiology in a neurocritical cohort report",
    "completeCitation": "Zhang W, Zhang S-X, Chen S-F, Yu T, Tang Y. Development and validation of risk prediction model for refeeding syndrome in neurocritical patients. Frontiers in Nutrition. 2023;10:1083483. Published February 15, 2023. doi:10.3389/fnut.2023.1083483. Accessed October 7, 2026. Mechanism background in Introduction.",
    "organizationOrJournal": "Frontiers in Nutrition",
    "authors": [
      "Wei Zhang",
      "Sheng-Xiang Zhang",
      "Shu-Fan Chen",
      "Tao Yu",
      "Yun Tang"
    ],
    "publicationYear": 2023,
    "doi": "10.3389/fnut.2023.1083483",
    "pmid": null,
    "officialUrl": "https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2023.1083483/full",
    "accessedOn": "2026-10-07",
    "sourceClass": "observational_study",
    "licenseLabel": "Article-specific CC BY 4.0 verified in the actual publisher copyright notice October 7, 2026, https://creativecommons.org/licenses/by/4.0/. Authors and original article credited here. Claims/cards independently synthesize underlying physiology; no prose, predictive model, table or figure adapted.",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N2 uses recorded atomic synthesis and bibliographic metadata, with explicitly identified mathematical derivations. No source text, table, figure or excerpt was retrieved or copied. The original access date is retained, not refreshed. Flags4 reuses only recorded underlying-fact synthesis and bibliographic metadata offline; no article text, table or figure was fetched or reproduced.",
    "authorityAssessment": "2023 observational neurocritical-care cohort. Its Introduction independently describes the insulin-associated intracellular phosphate uptake and catabolic-to-anabolic transition after feeding. Those stable background mechanisms alone are used; the cohort's risk model, incidence, thresholds and neurocritical-care management are not generalized to clinic patients. Not independent evidence for thiamine timing or efficacy.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.gs028f.refeeding.insulin-phosphate-shift",
      "claim.gs028f.refeeding.anabolic-transition",
      "claim.flags4.20261108.carbohydrate-phosphate-uptake",
      "claim.flags4.20261108.anabolic-transition"
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [
      "claim.flags4.20261108.carbohydrate-phosphate-uptake",
      "claim.flags4.20261108.anabolic-transition"
    ],
    "intendedUse": "Recorded stable carbohydrate/insulin/phosphate and anabolic-transition physiology only; not the cohort risk model, incidence or management."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.flags4-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.gs028f.auspen_refeeding2025",
    "title": "AuSPEN consensus statements on refeeding syndrome",
    "completeCitation": "Matthews-Rensch K, Blackwood K, Lawlis D, Breik L, McLean C, Nguyen T, Phillips S, Small K, Stewart T, Thatcher A, Venkat L, Brodie E, Cleeve B, Diamond L, Ng MY, Small A, Viner Smith E, Asrani V. The Australasian Society of Parenteral and Enteral Nutrition: Consensus statements on refeeding syndrome. Nutrition & Dietetics. 2025;82(2):128–142. Published March 16, 2025. doi:10.1111/1747-0080.70003. PMID:40090863. Accessed October 7, 2026.",
    "organizationOrJournal": "Australasian Society of Parenteral and Enteral Nutrition; Nutrition & Dietetics",
    "authors": [
      "Kylie Matthews-Rensch",
      "Kirrilee Blackwood",
      "Deborah Lawlis",
      "Lina Breik",
      "Cameron McLean",
      "Truc Nguyen",
      "Sarah Phillips",
      "Kimberly Small",
      "Tim Stewart",
      "Amber Thatcher",
      "Leanne Venkat",
      "Emily Brodie",
      "Brydie Cleeve",
      "Lauren Diamond",
      "Mei Yuen Ng",
      "Anna Small",
      "Elizabeth Viner Smith",
      "Varsha Asrani"
    ],
    "publicationYear": 2025,
    "doi": "10.1111/1747-0080.70003",
    "pmid": "40090863",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11973624/",
    "accessedOn": "2026-10-07",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Article-specific CC BY-NC-ND 4.0, https://creativecommons.org/licenses/by-nc-nd/4.0/ verified in the actual article October 7, 2026. The schema lacks a BY-NC-ND category, so conservative targeted-verification status is used. Only underlying facts in original claims; no source prose, tables, figures or algorithm adaptations.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N2 uses recorded atomic synthesis and bibliographic metadata, with explicitly identified mathematical derivations. No source text, table, figure or excerpt was retrieved or copied. The original access date is retained, not refreshed. Flags4 reuses only recorded underlying-fact synthesis and bibliographic metadata offline; no article text, table or figure was fetched or reproduced.",
    "authorityAssessment": "Adult multidisciplinary 2025 society consensus, literature search through November 20, 2024. Section 3.4.1 recommends thiamine before nutrition and explicitly notes absence of specific evidence evaluating thiamine's preventive role. Section 3.5 and summary support close electrolyte/clinical monitoring; risk and diagnosis sections caution that phosphate decline has other causes. Recommendation is expert consensus with limited direct preventive evidence. No dose, duration, feeding rate, diagnostic threshold or claimed prevention certainty is imported; NICE content is excluded.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.gs028f.refeeding.phosphate-not-specific",
      "claim.flags4.20261108.diagnostic-boundary"
    ],
    "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
    "supportedNewClaimIds": [
      "claim.flags4.20261108.diagnostic-boundary"
    ],
    "intendedUse": "Recorded diagnostic caution only; not a refeeding protocol, criterion, timing or treatment rule."
  }
];
export const QUESTION_FLAGS4_CLAIM_PROVENANCE=[
  {
    "claimId": "claim.flags4.20261108.carbohydrate-phosphate-uptake",
    "applicationCheckedOn": "2026-11-08",
    "basis": [
      {
        "claimId": "claim.gs028f.refeeding.insulin-phosphate-shift",
        "originalLastCheckedOn": "2026-10-07",
        "originalReviewStatus": "needs_clinician_review",
        "sourceIds": [
          "source.gs028f.zhang_refeeding2023"
        ]
      }
    ],
    "sourceAccessDatesUnchanged": true,
    "scope": "Independent application of the already recorded atomic fact. No external source retrieval or currentness check; original basis/access dates retained."
  },
  {
    "claimId": "claim.flags4.20261108.anabolic-transition",
    "applicationCheckedOn": "2026-11-08",
    "basis": [
      {
        "claimId": "claim.gs028f.refeeding.anabolic-transition",
        "originalLastCheckedOn": "2026-10-07",
        "originalReviewStatus": "needs_clinician_review",
        "sourceIds": [
          "source.gs028f.zhang_refeeding2023"
        ]
      }
    ],
    "sourceAccessDatesUnchanged": true,
    "scope": "Independent application of the already recorded atomic fact. No external source retrieval or currentness check; original basis/access dates retained."
  },
  {
    "claimId": "claim.flags4.20261108.diagnostic-boundary",
    "applicationCheckedOn": "2026-11-08",
    "basis": [
      {
        "claimId": "claim.gs028f.refeeding.phosphate-not-specific",
        "originalLastCheckedOn": "2026-10-07",
        "originalReviewStatus": "needs_clinician_review",
        "sourceIds": [
          "source.gs028f.auspen_refeeding2025"
        ]
      }
    ],
    "sourceAccessDatesUnchanged": true,
    "scope": "Independent application of the already recorded atomic fact. No external source retrieval or currentness check; original basis/access dates retained."
  }
] as const;
