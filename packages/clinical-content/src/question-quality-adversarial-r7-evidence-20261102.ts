import type {EvidenceClaim, AuthoredClinicalRecord} from "./pilot-schema";

/** Original limited synthesis; prior primary-source checks reused offline. */
export const QUESTION_QUALITY_ADVERSARIAL_R7_CLAIMS: (EvidenceClaim & AuthoredClinicalRecord)[] = [
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v10",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102f.integrated-partial-depth-planning",
    "statement": "A smaller invasive-depth measurement from a different partial specimen does not erase a greater valid demonstrated invasive extent; an incomplete whole-lesion maximum can still have a known lower bound relevant to a supported planning discussion.",
    "sourceIds": [
      "source.qq20261102f.esmo2025",
      "source.qq20261102f.nci-melanoma"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Original cross-specimen application of previously verified full-thickness sampling and maximum-depth reporting guidance, not a separately retrieved specimen-integration rule. Dermatopathology must confirm validity and mapping. The 1.8-mm value is retained from this case's existing completed-primary record and 0.6 mm from its existing partial report; their new constructed placement is not a management cutoff. The actual greater-than-1-mm nodal-discussion boundary is separately mapped to existing claim.qq20261102a.melanoma-integrated-node-staging.",
    "applicablePopulation": "The identified named synthetic adult teaching cases; measurements and acquisition observations are constructed, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-03"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v10",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102f.mri-comparable-contrast-acquisition",
    "statement": "Assessment of contrast-related signal change in an intrinsically bright soft-tissue mass region requires accounting for acquisition settings; a pre/post comparison that also changes suppression cannot simply assign all signal differences to enhancement.",
    "sourceIds": [
      "source.qq20261102f.essr2023"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Technical application of previously verified primary MRI characterization/contrast-targeting guidance, reused offline. Only one adequate medical primary consensus source is mapped; no new direct verification of the exact constructed sequence pair occurred. MSK radiology must confirm this comparison and its priority. No universal sequence mandate, contrast dose, numerical enhancement criterion, tract or histologic diagnosis is inferred.",
    "applicablePopulation": "The identified named synthetic adult teaching cases; measurements and acquisition observations are constructed, not empirical patient/gameplay data.",
    "lastCheckedOn": "2026-11-03"
  }
];

export const QUESTION_QUALITY_ADVERSARIAL_R7_SOURCES = [
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v10",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102f.esmo2025",
    "title": "ESMO cutaneous melanoma guideline",
    "completeCitation": "Amaral T, Ottaviano M, Arance A, Blank C, Chiarion-Sileni V, Donia M, et al.; ESMO Guidelines Committee. Cutaneous melanoma: ESMO Clinical Practice Guideline for diagnosis, treatment and follow-up. Ann Oncol. 2025;36(1):10-30. doi:10.1016/j.annonc.2024.11.006.",
    "organizationOrJournal": "European Society for Medical Oncology / Annals of Oncology",
    "authors": [
      "Amaral T",
      "Ottaviano M",
      "Arance A",
      "Blank C",
      "Chiarion-Sileni V",
      "Donia M",
      "ESMO Guidelines Committee"
    ],
    "publicationYear": 2025,
    "doi": "10.1016/j.annonc.2024.11.006",
    "pmid": "39550033",
    "officialUrl": "https://doi.org/10.1016/j.annonc.2024.11.006",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Publisher society copyright; targeted verification only (PMC manuscript separately reports CC BY)",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Access route: https://www.icpf.pf/wp-content/uploads/2025/08/ESMO-2025-Melanome.pdf . PMC routes returned a browser check, so no inaccessible snippet was evidence. No staging tables, margin table, figure or treatment algorithm copied.",
    "authorityAssessment": "Full guideline read through the public cancer-institute-hosted copy for complete diagnostic biopsy, microstaging, clinically negative sentinel assessment and stage-based workup. Partial-specimen and missed-node applications are independently authored clinical inferences, not a universal completion algorithm. Round six reuses the existing targeted primary-source verification offline; no fresh retrieval or independent publication is inferred from this new mapping ID. Round seven retains the original publication, rights and access date for offline use. This new mapping ID is neither a fresh source retrieval nor independent corroboration; the technical/cross-specimen application remains clinician review.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102f.integrated-partial-depth-planning"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v10",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102f.nci-melanoma",
    "title": "Melanoma Treatment (PDQ), Health Professional Version",
    "completeCitation": "PDQ Adult Treatment Editorial Board. Melanoma Treatment (PDQ), Health Professional Version. National Cancer Institute. Updated 2025-05-02. PMID:26389469. Accessed 2026-09-10.",
    "organizationOrJournal": "National Cancer Institute PDQ",
    "authors": [
      "PDQ Adult Treatment Editorial Board"
    ],
    "publicationYear": 2025,
    "doi": null,
    "pmid": "26389469",
    "officialUrl": "https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "United States government factual material; NCI and PDQ reuse conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Original factual synthesis only. No PDQ-branded modified summary, source prose, third-party image, table, or agency mark reproduced; credit NCI without endorsement.",
    "authorityAssessment": "Independent federal professional evidence summary supports diagnostic depth assessment and sentinel staging in the supplied thickness range; this does not promise a survival benefit. Same publication as source.sc.nci-melanoma-pdq-2025; this recheck is not an independent second source. Round six reuses the existing targeted primary-source verification offline; no fresh retrieval or independent publication is inferred from this new mapping ID. Round seven retains the original publication, rights and access date for offline use. This new mapping ID is neither a fresh source retrieval nor independent corroboration; the technical/cross-specimen application remains clinician review.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102f.integrated-partial-depth-planning"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v10",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102f.essr2023",
    "title": "Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where?",
    "completeCitation": "Noebauer-Huhmann IM, Vanhoenacker FM, Vilanova JC, et al. Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where? European Radiology. 2024;34:4427-4437. doi:10.1007/s00330-023-10425-5.",
    "organizationOrJournal": "European Radiology",
    "authors": [
      "Noebauer-Huhmann IM",
      "Vanhoenacker FM",
      "Vilanova JC",
      "et al."
    ],
    "publicationYear": 2024,
    "doi": "10.1007/s00330-023-10425-5",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1007/s00330-023-10425-5",
    "accessedOn": "2026-11-02",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original modified factual synthesis; no algorithms, figures, or third-party art copied. Attribution and license: https://creativecommons.org/licenses/by/4.0/ .",
    "authorityAssessment": "Full current primary MSK guideline rechecked this round at https://pmc.ncbi.nlm.nih.gov/articles/PMC11213759/ for whole-lesion/compartment coverage and enhancement-based viable biopsy targeting. CC BY 4.0 independently confirmed; original factual synthesis only, no consensus table/protocol values copied. Exact case protocols still need radiologist review. Same publication as source.qq20261102a.essr2023; a new record ID does not create independent evidence. Round seven retains the original publication, rights and access date for offline use. This new mapping ID is neither a fresh source retrieval nor independent corroboration; the technical/cross-specimen application remains clinician review.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.qq20261102f.mri-comparable-contrast-acquisition"
    ]
  }
];
