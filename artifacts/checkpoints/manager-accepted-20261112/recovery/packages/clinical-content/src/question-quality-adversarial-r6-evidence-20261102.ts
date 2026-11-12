import type {EvidenceClaim, AuthoredClinicalRecord} from "./pilot-schema";

/** Original atomic synthesis; existing primary-source checks reused offline. */
export const QUESTION_QUALITY_ADVERSARIAL_R6_CLAIMS: (EvidenceClaim & AuthoredClinicalRecord)[] = [
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v9",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102e.hrm-reserve-versus-outflow",
    "statement": "After technically adequate rapid-swallow testing, failure of the post-sequence contraction to augment baseline supports reduced contractile reserve, distinct from inhibition during the sequence and from the outflow assessment made during rapid drinking.",
    "sourceIds": [
      "source.qq20261102e.acg2020",
      "source.qq20261102e.chicago2021"
    ],
    "limitation": "Previously verified primary physiology guidance reused offline. Qualitative laboratory-referenced observations and repeatability require motility review. No numerical criterion, diagnostic subtype or cause of all symptoms is inferred from these responses alone.",
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The named synthetic adult teaching cases; constructed observations are not empirical patient or gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v9",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102e.mapped-partial-skin-evidence",
    "statement": "A finding in a mapped partial melanocytic specimen can remain valid at that sampled site without establishing the diagnosis or invasive status of a different unrepresented residual component.",
    "sourceIds": [
      "source.qq20261102e.esmo2025",
      "source.qq20261102e.nci-melanoma"
    ],
    "limitation": "Anatomical and clinicopathologic application of previously verified diagnostic-sampling/microstaging guidance. Original constructed cytology and specimen maps require dermatopathology review; no whole-lesion diagnosis or universal completion technique is inferred from a partial fragment.",
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The named synthetic adult teaching cases; constructed observations are not empirical patient or gameplay data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v9",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102e.transected-depth-lower-bound",
    "statement": "When invasive melanoma reaches the deep cut surface used as the measurement endpoint, the measured invasive depth supplies a lower bound rather than a demonstrated whole-lesion maximum.",
    "sourceIds": [
      "source.qq20261102e.esmo2025",
      "source.qq20261102e.nci-melanoma"
    ],
    "limitation": "Original measurement-bound application of previously verified full-thickness sampling and maximum-depth reporting guidance; specialist confirmation of this report wording remains necessary. The retained 0.6-mm observation is constructed patient data, not a sourced treatment threshold, and no nodal indication is derived from it.",
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The named synthetic adult teaching cases; constructed observations are not empirical patient or gameplay data.",
    "lastCheckedOn": "2026-11-02"
  }
];

export const QUESTION_QUALITY_ADVERSARIAL_R6_SOURCES = [
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v9",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102e.acg2020",
    "title": "ACG esophageal physiologic testing guideline",
    "completeCitation": "Gyawali CP, Carlson DA, Chen JW, Patel A, Wong RJ, Yadlapati RH. ACG Clinical Guidelines: Clinical Use of Esophageal Physiologic Testing. Am J Gastroenterol. 2020;115(9):1412-1428. doi:10.14309/ajg.0000000000000734.",
    "organizationOrJournal": "American College of Gastroenterology / American Journal of Gastroenterology",
    "authors": [
      "Gyawali CP",
      "Carlson DA",
      "Chen JW",
      "Patel A",
      "Wong RJ",
      "Yadlapati RH"
    ],
    "publicationYear": 2020,
    "doi": "10.14309/ajg.0000000000000734",
    "pmid": "32769426",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9468980/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Public author manuscript; reusable license not established",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "No algorithms, protocol tables, source text or exact maneuver quantities copied. Factual verification of society guidance only.",
    "authorityAssessment": "Full primary guideline rechecked for assisted catheter placement, limitations of incomplete studies, provocative maneuvers and complementary FLIP use. Older technical guidance, combined with retained Chicago v4 rather than claimed new diagnostic cutoffs. Round six reuses the existing targeted primary-source verification offline; no fresh retrieval or independent publication is inferred from this new mapping ID.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102e.hrm-reserve-versus-outflow"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v9",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102e.chicago2021",
    "title": "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
    "completeCitation": "Yadlapati R, Kahrilas PJ, Fox MR, Bredenoord AJ, Gyawali CP, Roman S, et al. Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0. Neurogastroenterol Motil. 2021;33(1):e14058. doi:10.1111/nmo.14058. PMID:33373111; PMCID:PMC8034247.",
    "organizationOrJournal": "Neurogastroenterology and Motility / International High-Resolution Manometry Working Group",
    "authors": [
      "Rena Yadlapati",
      "Peter J Kahrilas",
      "Mark R Fox",
      "Albert J Bredenoord",
      "C Prakash Gyawali",
      "Sabine Roman",
      "et al."
    ],
    "publicationYear": 2021,
    "doi": "10.1111/nmo.14058",
    "pmid": "33373111",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8034247/",
    "accessedOn": "2026-11-02",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "Copyrighted expert consensus; public author manuscript, reusable license not established",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "PMC availability is not a reuse license. Targeted consensus-fact verification only; no table, threshold list, algorithm, protocol, trace, figure or source phrasing reproduced. Publisher direct fetch was blocked; the accessible author manuscript and bibliographic record were checked.",
    "authorityAssessment": "Previously verified primary classification consensus retained for technically adequate primary/secondary-position protocols and deglutitive inhibition. The new failed-acquisition cases are clinical applications, not new normal ranges. Same publication as source.qq20261102b.chicago; a new record ID does not create independent evidence. Round six reuses the existing targeted primary-source verification offline; no fresh retrieval or independent publication is inferred from this new mapping ID.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102e.hrm-reserve-versus-outflow"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v9",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102e.esmo2025",
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
    "authorityAssessment": "Full guideline read through the public cancer-institute-hosted copy for complete diagnostic biopsy, microstaging, clinically negative sentinel assessment and stage-based workup. Partial-specimen and missed-node applications are independently authored clinical inferences, not a universal completion algorithm. Round six reuses the existing targeted primary-source verification offline; no fresh retrieval or independent publication is inferred from this new mapping ID.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102e.mapped-partial-skin-evidence",
      "claim.qq20261102e.transected-depth-lower-bound"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v9",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102e.nci-melanoma",
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
    "authorityAssessment": "Independent federal professional evidence summary supports diagnostic depth assessment and sentinel staging in the supplied thickness range; this does not promise a survival benefit. Same publication as source.sc.nci-melanoma-pdq-2025; this recheck is not an independent second source. Round six reuses the existing targeted primary-source verification offline; no fresh retrieval or independent publication is inferred from this new mapping ID.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102e.mapped-partial-skin-evidence",
      "claim.qq20261102e.transected-depth-lower-bound"
    ]
  }
];
