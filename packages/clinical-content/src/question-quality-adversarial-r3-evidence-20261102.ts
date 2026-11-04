import type { ClinicalSource, EvidenceClaim } from "./pilot-schema";

/** Original atomic synthesis only; no source prose stored. Clinical review pending. */
export const QUESTION_QUALITY_ADVERSARIAL_R3_CLAIMS: EvidenceClaim[] = [
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.mixed-discharge-parallel-evaluation",
    "statement": "A plausible medication-associated prolactin rise warrants medication review and reassessment rather than automatic prioritization of pituitary imaging.",
    "sourceIds": [
      "source.qq20261102b.pitarch"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One current open clinical review for this sequence; not a rule excluding pituitary disease. Existing independent metoclopramide and focal-discharge claims remain mapped.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.implant-mri-not-discharge-assessment",
    "statement": "A noncontrast silicone-implant-integrity MRI does not replace the conventional diagnostic pathway for spontaneous focal nipple discharge.",
    "sourceIds": [
      "source.qq20261102b.acr-implant",
      "source.qq20261102b.pitarch"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Synthesis of two distinct protocol facts, not a direct comparative trial; age-appropriate mammography/targeted ultrasound and later contrast MRI remain individualized.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.route-specific-midazolam-plan",
    "statement": "Boosted-protease-inhibitor therapy requires individualized parenteral midazolam dosing and appropriate monitoring.",
    "sourceIds": [
      "source.qq20261102b.nysdoh-hiv"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single adequate current guideline. Existing separate oral-contraindication/ART-continuity claims retained. Dose reduction is considered, especially with repeated dosing; no exact dose authored.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.oxygenation-not-ventilation",
    "statement": "Pulse oximetry does not establish adequate ventilation during procedural sedation.",
    "sourceIds": [
      "source.qq20261102b.bsg-sedation"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "One primary specialist guideline. The fictional capnography/chest observations are not a numerical toxicity threshold.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.sedation-ventilation-response",
    "statement": "Sedation-associated respiratory depression calls for assessment and support of ventilation, with reversal or additional anesthesia support as clinically needed.",
    "sourceIds": [
      "source.qq20261102b.bsg-sedation"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One primary specialist guideline. No reversal dose, saturation target, peak-effect time or universal rescue sequence authored.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.primary-position-classification",
    "statement": "Universal failed peristalsis with an abnormal relaxation pressure in an adequate primary-position series can establish an achalasia pattern despite a normal secondary-position pressure.",
    "sourceIds": [
      "source.qq20261102b.chicago"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Primary classification consensus; technically adequate ten-swallow primary series supplied. It does not assert that manometry excludes every secondary cause.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.opioid-spastic-pattern",
    "statement": "Opioid exposure can accompany an achalasia-like spastic pattern, and assessment off opioids is advised when feasible.",
    "sourceIds": [
      "source.qq20261102b.chicago"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "Conditional, low-grade consensus guidance. Withdrawal must be coordinated; no abrupt cessation, fixed washout or universal reversibility is claimed.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.secondary-achalasia-assessment",
    "statement": "Older patients with achalasia-pattern physiology and substantial recent weight loss can require targeted assessment for a secondary junction lesion.",
    "sourceIds": [
      "source.qq20261102b.acg-achalasia"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single adequate directly retrieved primary guideline for the added alarm-based application. EUS/cross-sectional choice is individualized; no exact weight/time threshold or probability is invented.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.sentinel-before-reconstruction",
    "statement": "Sentinel-node mapping/biopsy is preferably coordinated with wide excision before flap or graft reconstruction can disrupt later mapping.",
    "sourceIds": [
      "source.qq20261102b.cco-melanoma"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Direct older primary technical guideline; current retained staging-indication evidence is independently mapped. No blanket contraindication after every excision or exact reliability effect is asserted.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.colon-staging-coverage",
    "statement": "Standard colon-cancer distant staging includes thoracic CT and adequate contrast-enhanced abdominal/pelvic assessment.",
    "sourceIds": [
      "source.qq20261102b.ascrs-colon"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Single adequate retrieved guideline. Abdominal MRI can be a valid alternative; radiography, ultrasound and localization CT are not silently treated as equivalent complete pathways.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.colon-pet-not-routine-substitute",
    "statement": "Routine FDG PET-CT does not replace standard initial anatomic colon-cancer staging in the absence of a specific metastatic decision problem.",
    "sourceIds": [
      "source.qq20261102b.ascrs-colon"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Primary guideline; not a claim PET never helps or that every PET-CT lacks diagnostic contrast CT. Each constructed prior report explicitly states its actual acquisition.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.malignant-polyp-positive-margin",
    "statement": "A positive or indeterminate invasive malignant-polyp margin generally warrants discussion of oncologic regional resection in a surgically suitable patient.",
    "sourceIds": [
      "source.qq20261102b.ascrs-colon"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "One adequate primary guideline; no invented additional poor grade/LVI. A precise transverse-colon operation, individual preference and technical endoscopic alternatives require colorectal review.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.sarcoma-method-and-tract",
    "statement": "Planned sarcoma biopsy should avoid contaminating a separate unaffected compartment.",
    "sourceIds": [
      "source.qq20261102b.essr2015",
      "source.qq20261102b.seom2024"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "The exact compartment rule is directly checked in older ESSR technique guidance; current SEOM corroborates tract removal/planning. Constructed rectus/adductor and triceps/biceps paths require clinician anatomy review.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.sarcoma-initial-core-method",
    "statement": "A feasible image-guided core biopsy is preferred initially for a suspicious deep extremity soft-tissue mass.",
    "sourceIds": [
      "source.qq20261102b.seom2024",
      "source.qq20261102b.essr2015"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Open biopsy is a selected alternative, not universally wrong; no failed core, needle gauge, sample count or tumor subtype is invented.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.rectus-anterior-compartment",
    "statement": "Rectus femoris belongs to the anterior thigh compartment.",
    "sourceIds": [
      "source.qq20261102b.thigh-anatomy"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Stable anatomy, independently synthesized from the review's compartment depiction. No figure adapted. The exact constructed tract still needs clinician review.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.adductor-medial-compartment",
    "statement": "Adductor longus is a muscle of the medial thigh compartment.",
    "sourceIds": [
      "source.qq20261102b.adductor-anatomy"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Directly described anatomical membership; not a claim about all adductor variants or the clinical safety of a trajectory. B19's medial crossing is a constructed observation.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.biceps-anterior-compartment",
    "statement": "Biceps brachii is in the anterior arm compartment.",
    "sourceIds": [
      "source.qq20261102b.arm-anatomy"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Single adequate imaging-anatomy review for stable membership. No source expression adapted; exact case route requires clinician review.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.triceps-posterior-compartment",
    "statement": "Triceps brachii is in the posterior arm compartment.",
    "sourceIds": [
      "source.qq20261102b.arm-anatomy"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Single adequate imaging-anatomy review for stable membership. No source expression adapted; exact case route requires clinician review.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.gastric-clone-not-diagnosis",
    "statement": "Clonal B-cell expansion can occur in chronic inflammation and does not establish gastric MALT lymphoma without morphologic/clinical correlation.",
    "sourceIds": [
      "source.qq20261102b.bsh-mzl"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Direct primary guideline caution. Preserved glands do not by themselves exclude every lymphoma; CD20 remains a lineage marker.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.gastric-uncertainty-repeat-biopsy",
    "statement": "Repeat endoscopy with biopsies is recommended when gastric MALT classification remains diagnostically uncertain.",
    "sourceIds": [
      "source.qq20261102b.bsh-mzl"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One adequate primary guideline. Site documentation/comparative expert review is retained; no mandatory mapping grid, diagnostic probability or fixed interval is asserted.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.specified-interval-decision-rule",
    "statement": "Null-effect testing and comparison of a confidence interval with a separately defined effect target answer different statistical questions.",
    "sourceIds": [
      "source.qq20261102b.nist-p",
      "source.qq20261102b.nist-ci"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "The endpoint, benefit direction and whole-interval confirmation/exclusion rule are explicitly fictional protocol inputs. No source is represented as prescribing a clinical benefit cutoff; interval exclusion is not impossibility.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102b.pdsa-hypothesis-not-proof",
    "statement": "A small PDSA test uses local observations to select and evaluate a specific next change rather than establish its causal effect in advance.",
    "sourceIds": [
      "source.qq20261102b.ahrq-pdca",
      "source.qq20261102b.ahrq-metrics"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "The task-time/record-agreement table and prefill candidate are constructed hypotheses. No empirical effectiveness claim, adoption cutoff or answer analytics is introduced.",
    "applicablePopulation": "The identified adult synthetic teaching cases; constructed observations are not observed patient data.",
    "lastCheckedOn": "2026-11-02"
  }
];

export const QUESTION_QUALITY_ADVERSARIAL_R3_SOURCES: ClinicalSource[] = [
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.pitarch",
    "title": "An update on multimodal imaging strategies for nipple discharge: from detection to decision",
    "completeCitation": "Pitarch M, Alcantara R, Comerma L, Vazquez de Las Heras I, Azcona J, Wiedemann A, Prutki M, Fallenberg EM. An update on multimodal imaging strategies for nipple discharge: from detection to decision. Insights Imaging. 2025;16:70. doi:10.1186/s13244-025-01947-1.",
    "organizationOrJournal": "Insights into Imaging",
    "authors": [
      "Mireia Pitarch",
      "Rodrigo Alcantara",
      "Laura Comerma",
      "Ivonne Vazquez de Las Heras",
      "Javier Azcona",
      "Antonia Wiedemann",
      "Maja Prutki",
      "Eva Maria Fallenberg"
    ],
    "publicationYear": 2025,
    "doi": "10.1186/s13244-025-01947-1",
    "pmid": null,
    "officialUrl": "https://link.springer.com/article/10.1186/s13244-025-01947-1",
    "accessedOn": "2026-11-02",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0 (publisher rights statement checked)",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "https://creativecommons.org/licenses/by/4.0/ . Original factual synthesis with attribution; no copied prose, figures, algorithms or case examples. No source text stored.",
    "authorityAssessment": "Open review rechecked for mixed discharge and conventional/contrast-MRI sequence. Original synthesis only; no clinical algorithms reproduced. Same publication as source.qq20261102a.pitarch; no independent second source is implied.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.qq20261102b.mixed-discharge-parallel-evaluation",
      "claim.qq20261102b.implant-mri-not-discharge-assessment"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.nysdoh-hiv",
    "title": "Perioperative Care in Adults With HIV",
    "completeCitation": "Shin SJ, Vail R, Shah S, Fine SM, McGowan JP, Merrick ST, Radix AE, Rodrigues JC, Hoffmann CJ, Norton BL, Gonzalez CJ; NYSDOH AIDS Institute. Perioperative Care in Adults With HIV. Clinical Guidelines Program; November 4, 2024.",
    "organizationOrJournal": "New York State Department of Health AIDS Institute",
    "authors": [
      "Sangyoon Jason Shin",
      "Rona Vail",
      "Sanjiv Shah",
      "Steven M Fine",
      "Joseph P McGowan",
      "Samuel T Merrick",
      "Asa E Radix",
      "Jessica Rodrigues",
      "Christopher J Hoffmann",
      "Brianna L Norton",
      "Charles J Gonzalez"
    ],
    "publicationYear": 2024,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.hivguidelines.org/guideline/hiv-perioperative/",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "Government guidance; site and third-party reuse conditions apply",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Current government guidance rechecked for ART continuity and oral/parenteral midazolam handling. Same publication as source.qq20261102a.nysdoh-hiv; no independent second source is implied.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.route-specific-midazolam-plan"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.bsg-sedation",
    "title": "British Society of Gastroenterology guidelines on sedation in gastrointestinal endoscopy",
    "completeCitation": "Sidhu R, Turnbull D, Haboubi H, Leeds JS, Healey C, Hebbar S, et al. British Society of Gastroenterology guidelines on sedation in gastrointestinal endoscopy. Gut. 2024;73:219-245. doi:10.1136/gutjnl-2023-330396.",
    "organizationOrJournal": "British Society of Gastroenterology / Gut",
    "authors": [
      "Reena Sidhu",
      "Duncan Turnbull",
      "Haboubi H",
      "John S Leeds",
      "Chris Healey",
      "Srisha Hebbar",
      "et al."
    ],
    "publicationYear": 2024,
    "doi": "10.1136/gutjnl-2023-330396",
    "pmid": null,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10850688/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Public guideline manuscript; reuse license not assumed; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Current primary specialist guideline rechecked for oxygenation versus ventilation, management of respiratory depression, reversal and adult accompaniment. Same publication as source.qq20261102a.bsg-sedation; no independent second source is implied.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.oxygenation-not-ventilation",
      "claim.qq20261102b.sedation-ventilation-response"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.chicago",
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
    "authorityAssessment": "Primary 2021 consensus rechecked for primary/secondary-position criteria, failed-contraction threshold, supportive tests and opioid-associated spastic patterns. Same publication as source.qq20261102a.chicago; no independent second source is implied.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.primary-position-classification",
      "claim.qq20261102b.opioid-spastic-pattern"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.ascrs-colon",
    "title": "The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Colon Cancer",
    "completeCitation": "Vogel JD, Felder SI, Bhama AR, Hawkins AT, Langenfeld SJ, Shaffer VO, et al. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Colon Cancer. Dis Colon Rectum. 2022;65(2):148-177. doi:10.1097/DCR.0000000000002323.",
    "organizationOrJournal": "American Society of Colon and Rectal Surgeons / Diseases of the Colon and Rectum",
    "authors": [
      "Jon D Vogel",
      "Scott I Felder",
      "Anuradha R Bhama",
      "Alexander T Hawkins",
      "Sean J Langenfeld",
      "Vaughn O Shaffer",
      "et al."
    ],
    "publicationYear": 2022,
    "doi": "10.1097/DCR.0000000000002323",
    "pmid": null,
    "officialUrl": "https://www.ascrsu.com/ascrs/view/ASCRS-Evidence-Based-Guidelines-and-Expert-Consensus/3982018/all/Management_of_Colon_Cancer__2022_",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ASCRS; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Copyright ASCRS/Wolters Kluwer. Targeted factual verification through the public complete society guideline only; no source prose, tables, algorithms or images stored. The older official PDF URL returned 404; a moved/expired toolkit route was not used as evidence.",
    "authorityAssessment": "Full society guideline rechecked through the current public evidence-guideline page: positive/indeterminate malignant-polyp margin, staging coverage and MRI alternatives. Same publication as source.qq20261102a.ascrs-colon; no independent second source is implied.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.colon-staging-coverage",
      "claim.qq20261102b.colon-pet-not-routine-substitute",
      "claim.qq20261102b.malignant-polyp-positive-margin"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.essr2015",
    "title": "Soft Tissue Tumors in Adults: ESSR-Approved Guidelines for Diagnostic Imaging",
    "completeCitation": "Noebauer-Huhmann IM, et al. Soft Tissue Tumors in Adults: ESSR-Approved Guidelines for Diagnostic Imaging. Semin Musculoskelet Radiol. 2015;19(5):475-482. doi:10.1055/s-0035-1569251.",
    "organizationOrJournal": "European Society of Musculoskeletal Radiology / Seminars in Musculoskeletal Radiology",
    "authors": [
      "Iris-Melanie Noebauer-Huhmann",
      "et al."
    ],
    "publicationYear": 2015,
    "doi": "10.1055/s-0035-1569251",
    "pmid": null,
    "officialUrl": "https://pure.amsterdamumc.nl/ws/files/173173752/Soft-tissue-tumors-in-adults-essr-approved-guidelines-for-diagnostic-imaging.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright Thieme; institutional Taverne access, not an open reuse license",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Institutional version states personal-use/reproduction restrictions. Used only for targeted factual verification of professional-society guidance as permitted by AGENTS; no text, figures, biopsy diagrams or procedures copied or distributed. No reusable-content license inferred.",
    "authorityAssessment": "Primary technical guideline rechecked for viable targets, core sampling and avoiding contamination of other compartments. Older technique guidance, corroborated by current SEOM planning guidance. Same publication as source.qq20261102a.essr2015-target; no independent second source is implied.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.sarcoma-method-and-tract",
      "claim.qq20261102b.sarcoma-initial-core-method"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.seom2024",
    "title": "SEOM-GEIS Spanish clinical guidelines for the management of soft-tissue sarcomas (2024)",
    "completeCitation": "Serrano C, Arregui M, Carrasco I, et al. SEOM-GEIS Spanish clinical guidelines for the management of soft-tissue sarcomas (2024). Clinical and Translational Oncology. 2025;27(4):1460-1471. doi:10.1007/s12094-024-03842-5.",
    "organizationOrJournal": "Spanish Society of Medical Oncology and Spanish Group for Sarcoma Research; Clinical and Translational Oncology",
    "authors": [
      "Cesar Serrano",
      "Marta Arregui",
      "Irene Carrasco",
      "Nadia Hindi",
      "Javier Martinez-Trufero",
      "Jeronimo Martinez-Garcia",
      "Aurea Molina",
      "Ana Paisan",
      "Raul Sanchez",
      "Maria Angeles Sala"
    ],
    "publicationYear": 2025,
    "doi": "10.1007/s12094-024-03842-5",
    "pmid": "39918719",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12000159/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Use independently written factual synthesis with attribution; do not copy source prose, tables, figures, or algorithms.",
    "authorityAssessment": "Current open society guideline rechecked for initial image-guided core biopsy, selected open biopsy and planned removal of the tract with the tumor. Same publication as source.qq20261102a.seom2024; no independent second source is implied.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.qq20261102b.sarcoma-method-and-tract",
      "claim.qq20261102b.sarcoma-initial-core-method"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.bsh-mzl",
    "title": "Guideline for the diagnosis and management of marginal zone lymphomas: A British Society of Haematology Guideline",
    "completeCitation": "Walewska R, Eyre TA, Barrington S, Brady J, Fields P, Iyengar S, et al.; British Society of Haematology. Guideline for the diagnosis and management of marginal zone lymphomas. Br J Haematol. 2024;204(1):86-107. doi:10.1111/bjh.19064. First published November 13, 2023.",
    "organizationOrJournal": "British Society of Haematology / British Journal of Haematology",
    "authors": [
      "Renata Walewska",
      "Toby A Eyre",
      "Sally Barrington",
      "Jessica Brady",
      "Paul Fields",
      "Sunil Iyengar",
      "et al."
    ],
    "publicationYear": 2024,
    "doi": "10.1111/bjh.19064",
    "pmid": null,
    "officialUrl": "https://b-s-h.org.uk/media/x0bbg4bs/guideline-for-the-diagnosis-and-management-of-marginal-zone-lymphomas-a-british-society.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright BSH/Wiley; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Current full society guideline rechecked: clonality can occur in chronic inflammation; repeat OGD is recommended for diagnostic uncertainty; fusion testing has a different role. Same publication as source.qq20261102a.bsh-mzl; no independent second source is implied.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.gastric-clone-not-diagnosis",
      "claim.qq20261102b.gastric-uncertainty-repeat-biopsy"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.nist-p",
    "title": "Critical values and p values",
    "completeCitation": "National Institute of Standards and Technology. Engineering Statistics Handbook: Critical values and p values. Accessed 2026-09-29.",
    "organizationOrJournal": "National Institute of Standards and Technology",
    "authors": [
      "National Institute of Standards and Technology"
    ],
    "publicationYear": null,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.itl.nist.gov/div898/handbook/prc/section1/prc131.htm",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "Targeted factual verification only; record-level reuse permission was not separately verified.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Existing verified government methods reference reused for null-model testing; the constructed protocol is not attributed to NIST as a clinical rule. Same publication as source.qq20261102a.nist-p; no independent second source is implied.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.specified-interval-decision-rule"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.nist-ci",
    "title": "What are confidence intervals?",
    "completeCitation": "National Institute of Standards and Technology. Engineering Statistics Handbook: What are confidence intervals? Accessed 2026-09-29.",
    "organizationOrJournal": "National Institute of Standards and Technology",
    "authors": [
      "National Institute of Standards and Technology"
    ],
    "publicationYear": null,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "Targeted factual verification only; record-level reuse permission was not separately verified.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Existing verified government methods reference reused for interval interpretation and limitations, not a posterior probability of the true effect. Same publication as source.qq20261102a.nist-ci; no independent second source is implied.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.specified-interval-decision-rule"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.ahrq-pdca",
    "title": "Plan-Do-Check-Act Cycle",
    "completeCitation": "Agency for Healthcare Research and Quality. Plan-Do-Check-Act Cycle. Accessed 2026-09-29.",
    "organizationOrJournal": "Agency for Healthcare Research and Quality",
    "authors": [
      "Agency for Healthcare Research and Quality"
    ],
    "publicationYear": null,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://digital.ahrq.gov/health-it-tools-and-resources/evaluation-resources/workflow-assessment-health-it-toolkit/all-workflow-tools/plan-do-check-act-cycle",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "Targeted factual verification only; record-level reuse permission was not separately verified.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Existing verified government improvement toolkit reused for small iterative tests and hypothesis refinement, not proof of a prefill intervention. Same publication as source.qq20261102a.ahrq-pdca; no independent second source is implied.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.pdsa-hypothesis-not-proof"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.ahrq-metrics",
    "title": "Chapter 6. Track Performance with Metrics",
    "completeCitation": "Agency for Healthcare Research and Quality. Chapter 6. Track Performance with Metrics. Last reviewed May 2016. Accessed 2026-09-29.",
    "organizationOrJournal": "Agency for Healthcare Research and Quality",
    "authors": [
      "Agency for Healthcare Research and Quality"
    ],
    "publicationYear": 2016,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.ahrq.gov/patient-safety/settings/hospital/vtguide/guide6.html",
    "accessedOn": "2026-11-02",
    "sourceClass": "government_guidance",
    "licenseLabel": "Targeted factual verification only; record-level reuse permission was not separately verified.",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
    "authorityAssessment": "Existing verified government improvement guidance reused for process/outcome/balancing measurement; no patient outcome or question-correctness data are collected. Same publication as source.qq20261102a.ahrq-metrics; no independent second source is implied.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.pdsa-hypothesis-not-proof"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.acg-achalasia",
    "title": "ACG clinical guideline: achalasia",
    "completeCitation": "Vaezi MF, Pandolfino JE, Yadlapati RH, Greer KB, Kavitt RT. ACG Clinical Guidelines: Diagnosis and Management of Achalasia. Am J Gastroenterol. 2020;115(9):1393-1411. doi:10.14309/ajg.0000000000000731.",
    "organizationOrJournal": "American College of Gastroenterology / American Journal of Gastroenterology",
    "authors": [
      "Vaezi MF",
      "Pandolfino JE",
      "Yadlapati RH",
      "Greer KB",
      "Kavitt RT"
    ],
    "publicationYear": 2020,
    "doi": "10.14309/ajg.0000000000000731",
    "pmid": "32773454",
    "officialUrl": "https://gi.org/guideline/diagnosis-and-management-of-achalasia/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ACG; no reusable license assumed",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification of complete guideline through the Portuguese gastroenterology society-hosted PDF: https://www.spg.pt/wp-content/uploads/2023/03/ACG-Clinical-Guidelines-Diagnosis-and-Management-of-Achalasia.pdf . Direct publisher route was inaccessible; no paywalled snippet used, no PDF or prose stored.",
    "authorityAssessment": "Primary professional-society guideline supports targeted cross-sectional/EUS assessment when older patients with achalasia-pattern physiology have substantial short-term weight loss. No invented risk score, cutoff or probability.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.secondary-achalasia-assessment"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.cco-melanoma",
    "title": "CCO melanoma excision and sentinel-node guideline",
    "completeCitation": "Wright FC, Souter LH, Kellett S, Easson A, Murray C, Toye J, McCready D, Nessim C, Ghazarian D, Look Hong NJ, Johnson S, Goldstein DP, Petrella T; Melanoma Disease Site Group. Primary excision margins, sentinel lymph node biopsy, and completion lymph node dissection in cutaneous melanoma: a clinical practice guideline. Curr Oncol. 2019;26(4):e541-e550. doi:10.3747/co.26.4885.",
    "organizationOrJournal": "Cancer Care Ontario / Current Oncology",
    "authors": [
      "Wright FC",
      "Souter LH",
      "Kellett S",
      "Easson A",
      "Murray C",
      "Toye J",
      "McCready D",
      "Nessim C",
      "Ghazarian D",
      "Look Hong NJ",
      "Johnson S",
      "Goldstein DP",
      "Petrella T",
      "Melanoma Disease Site Group"
    ],
    "publicationYear": 2019,
    "doi": "10.3747/co.26.4885",
    "pmid": "31548823",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6726255/",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "2019 Multimed copyright; no open reuse permission inferred from PMC",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Complete guideline available for targeted factual verification. No source prose/tables/figures stored or adapted; PMC availability does not confer reuse rights.",
    "authorityAssessment": "Primary guideline directly addresses sentinel biopsy with wide excision and reduced reliability after flap/graft repair. Older technical statement: current retained EADO/NCI sources support the indication independently, not a new independent verification of every reconstruction detail.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.sentinel-before-reconstruction"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.acr-implant",
    "title": "ACR/RSNA public implant-evaluation guidance",
    "completeCitation": "Romero C, Lee RK. Breast Implant Evaluation. RadiologyInfo.org; American College of Radiology and Radiological Society of North America. Reviewed December 15, 2021.",
    "organizationOrJournal": "ACR / RSNA, RadiologyInfo.org",
    "authors": [
      "Romero C",
      "Lee RK"
    ],
    "publicationYear": 2021,
    "doi": null,
    "pmid": null,
    "officialUrl": "https://www.radiologyinfo.org/en/info/acs-breast-implant-evaluation",
    "accessedOn": "2026-11-02",
    "sourceClass": "open_educational_resource",
    "licenseLabel": "Copyright RSNA; linking encouraged, copying prohibited",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of the noncontrast silicone-implant protocol fact only. Terms checked at https://www.radiologyinfo.org/en/info/about-terms-of-use (reviewed March 1, 2026): no copying; no article text stored. Independently synthesized medical fact, linked citation; no license inferred.",
    "authorityAssessment": "Official public organization guidance confirms noncontrast MRI evaluates silicone-implant rupture. Used with the independent CC BY discharge-imaging review; not treated as a complete specialist discharge algorithm.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.implant-mri-not-discharge-assessment"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.thigh-anatomy",
    "title": "Fascia lata and tensor fasciae latae anatomy review",
    "completeCitation": "Szczerba N, Waleszczyńska J, Jerka D, Bonowicz-Kozłowska K, Gagat M. Fascia Lata and Tensor Fasciae Latae in Lower-Limb Reconstruction. J Clin Med. 2026;15(14):5547. doi:10.3390/jcm15145547.",
    "organizationOrJournal": "Journal of Clinical Medicine",
    "authors": [
      "Szczerba N",
      "Waleszczyńska J",
      "Jerka D",
      "Bonowicz-Kozłowska K",
      "Gagat M"
    ],
    "publicationYear": 2026,
    "doi": "10.3390/jcm15145547",
    "pmid": "42513461",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13413262/",
    "accessedOn": "2026-11-02",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0; copyright the authors",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "https://creativecommons.org/licenses/by/4.0/ . Underlying compartment anatomy independently synthesized with attribution; no figure, caption, table or source prose copied or adapted.",
    "authorityAssessment": "Open peer-reviewed anatomical review, used only for rectus femoris compartment membership, not its proposed reconstruction treatments. Clinical route interpretation requires specialist review.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.rectus-anterior-compartment"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.adductor-anatomy",
    "title": "Adductor longus cadaveric and sonographic anatomy",
    "completeCitation": "Santamaría-Le Pera J, Valera-Garrido F, Valderrama-Canales FJ, Minaya-Muñoz F, Herrero P, Lapuente-Hernández D. Are palpation-guided interventional procedures on the adductor longus muscle safe? A cadaveric and sonographic investigation. Surg Radiol Anat. 2025;47(1):74. doi:10.1007/s00276-025-03567-2.",
    "organizationOrJournal": "Surgical and Radiologic Anatomy",
    "authors": [
      "Santamaría-Le Pera J",
      "Valera-Garrido F",
      "Valderrama-Canales FJ",
      "Minaya-Muñoz F",
      "Herrero P",
      "Lapuente-Hernández D"
    ],
    "publicationYear": 2025,
    "doi": "10.1007/s00276-025-03567-2",
    "pmid": "39920288",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11805763/",
    "accessedOn": "2026-11-02",
    "sourceClass": "observational_study",
    "licenseLabel": "CC BY 4.0; copyright the authors",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "https://creativecommons.org/licenses/by/4.0/ . Original synthesis of compartment membership only; no procedural windows, numerical measurements, text, images or tables reproduced.",
    "authorityAssessment": "Primary cadaveric/sonographic study directly describes adductor longus in the medial thigh compartment. Not evidence that any named trajectory is clinically safe or that every adductor has identical relationships.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.adductor-medial-compartment"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v6",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102b.arm-anatomy",
    "title": "Elbow MRI anatomy review",
    "completeCitation": "Lombardi A, Ashir A, Gorbachova T, Taljanovic MS, Chang EY. Magnetic resonance imaging of the elbow. Pol J Radiol. 2020;85:e440-e460. doi:10.5114/pjr.2020.98691.",
    "organizationOrJournal": "Polish Journal of Radiology",
    "authors": [
      "Lombardi A",
      "Ashir A",
      "Gorbachova T",
      "Taljanovic MS",
      "Chang EY"
    ],
    "publicationYear": 2020,
    "doi": "10.5114/pjr.2020.98691",
    "pmid": "32999696",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7509698/",
    "accessedOn": "2026-11-02",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY-NC-ND 4.0; copyright Polish Medical Society of Radiology",
    "reuseStatus": "metadata_only_rights_reserved",
    "reuseNotes": "https://creativecommons.org/licenses/by-nc-nd/4.0/ . No adaptation, copying or redistribution of source expression, tables or images. Bibliographic citation and independently expressed underlying anatomic facts only; no commercial reuse permission inferred.",
    "authorityAssessment": "Open peer-reviewed imaging-anatomy review directly identifies biceps anterior and triceps posterior. Single adequate source for these stable anatomical facts; no inference that the constructed biopsy route is clinically approved.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102b.biceps-anterior-compartment",
      "claim.qq20261102b.triceps-posterior-compartment"
    ]
  }
];
