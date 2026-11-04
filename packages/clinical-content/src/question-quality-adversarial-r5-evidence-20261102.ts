import type { EvidenceClaim, AuthoredClinicalRecord } from "./pilot-schema";

/** Original synthesis and metadata only; prior primary checks reused offline. */
export const QUESTION_QUALITY_ADVERSARIAL_R5_CLAIMS: (EvidenceClaim & AuthoredClinicalRecord)[] = [
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v8",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102d.hrm-rapid-swallow-interpretation",
    "statement": "A rapid-swallow manometry sequence assesses inhibition and post-sequence contractile reserve; it is not interchangeable with separated baseline swallows for esophageal-body classification.",
    "sourceIds": [
      "source.qq20261102d.acg2020",
      "source.qq20261102d.chicago2021"
    ],
    "limitation": "Previously verified primary physiology guidance and classification consensus reused offline. Interpretation depends on adequate acquisition; no exact swallow count, volume, interval or pressure cutoff is introduced.",
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The identified synthetic adult teaching cases; constructed observations are not patient data or clinical thresholds.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v8",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102d.hrm-rapid-drink-purpose",
    "statement": "A rapid-drink manometry challenge assesses esophageal outflow under liquid loading rather than replacing the ordinary separated-swallow peristaltic assessment.",
    "sourceIds": [
      "source.qq20261102d.acg2020",
      "source.qq20261102d.chicago2021"
    ],
    "limitation": "Existing primary-source verification reused offline. This is a protocol-purpose distinction, not a universal preference over other corroborating studies or an invented quantitative criterion.",
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The identified synthetic adult teaching cases; constructed observations are not patient data or clinical thresholds.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v8",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102d.hrm-solid-meal-provocation",
    "statement": "A standardized solid-meal manometry challenge can investigate food-associated obstructive symptoms that an ordinary water-swallow series has not explained.",
    "sourceIds": [
      "source.qq20261102d.acg2020",
      "source.qq20261102d.chicago2021"
    ],
    "limitation": "Previously verified primary sources reused offline. Choice of meal and protocol needs specialist review; no recipe, diagnostic cutoff or universal test hierarchy is authored.",
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The identified synthetic adult teaching cases; constructed observations are not patient data or clinical thresholds.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v8",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102d.node-washout-versus-serum",
    "statement": "Cervical-node FNA thyroglobulin washout is a node-local adjunct; serum thyroglobulin with an intact thyroid is not a substitute for assessing a particular suspicious node.",
    "sourceIds": [
      "source.qq20261102d.ata2025"
    ],
    "limitation": "One previously verified current primary guideline. Reuse of the existing ATA evidence is not a new independent source or a fresh network verification. Washout is selective and has intact-thyroid interpretation limitations; neither marker alone establishes the full surgical stage. The crossed target/matrix application requires thyroid review.",
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The identified synthetic adult teaching cases; constructed observations are not patient data or clinical thresholds.",
    "lastCheckedOn": "2026-11-02"
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v8",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.qq20261102d.lipoma-histology-provenance",
    "statement": "A specimen limited to colonic mucosa does not provide histologic confirmation of a mass localized to submucosa, even when the integrated endoscopic and EUS phenotype supports lipoma.",
    "sourceIds": [
      "source.qq20261102d.sel2022"
    ],
    "limitation": "An anatomical application of previously verified primary ESGE guidance, with one adequate source. This separates clinical characterization from histologic proof; it does not imply another biopsy is required or change the passed asymptomatic management premise.",
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The identified synthetic adult teaching cases; constructed observations are not patient data or clinical thresholds.",
    "lastCheckedOn": "2026-11-02"
  }
];

export const QUESTION_QUALITY_ADVERSARIAL_R5_SOURCES = [
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v8",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102d.ata2025",
    "title": "2025 American Thyroid Association Management Guidelines for Adult Patients with Differentiated Thyroid Cancer",
    "completeCitation": "Ringel MD, Sosa JA, Baloch Z, Bischoff L, Bloom G, Brent GA, et al. 2025 American Thyroid Association Management Guidelines for Adult Patients with Differentiated Thyroid Cancer. Thyroid. 2025;35(8):841-985. doi:10.1177/10507256251363120.",
    "organizationOrJournal": "American Thyroid Association / Thyroid",
    "authors": [
      "Matthew D Ringel",
      "Julie Ann Sosa",
      "Zubair Baloch",
      "Lindsay Bischoff",
      "Gary Bloom",
      "Gregory A Brent",
      "et al."
    ],
    "publicationYear": 2025,
    "doi": "10.1177/10507256251363120",
    "pmid": null,
    "officialUrl": "https://thyca.org/wp-content/uploads/DTCGuidelines.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright American Thyroid Association; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Full primary guideline rechecked through the public ThyCa PDF. Supports suspicious cystic-node assessment, targeted FNA and selected thyroglobulin washout; intact-thyroid limitations preserved. Same publication as source.qq20261102a.ata2025; a new record ID does not create independent evidence. Round five reuses that already-recorded primary-source verification offline; no new web retrieval or independent corroborating source is claimed. The new source ID records a new atomic mapping, not a new publication.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102d.node-washout-versus-serum"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v8",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102d.sel2022",
    "title": "Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: ESGE Guideline",
    "completeCitation": "Deprez PH, Moons LMG, O'Toole D, Gincul R, Seicean A, Pimentel-Nunes P, et al. Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: European Society of Gastrointestinal Endoscopy (ESGE) Guideline. Endoscopy. 2022;54(4):412-429. doi:10.1055/a-1751-5742.",
    "organizationOrJournal": "European Society of Gastrointestinal Endoscopy / Endoscopy",
    "authors": [
      "Pierre H Deprez",
      "Leon MG Moons",
      "Dermot O'Toole",
      "Rodica Gincul",
      "Andrada Seicean",
      "Pedro Pimentel-Nunes",
      "et al."
    ],
    "publicationYear": 2022,
    "doi": "10.1055/a-1751-5742",
    "pmid": null,
    "officialUrl": "https://www.esge.com/assets/downloads/pdfs/guidelines/2022_a-1751-5742.pdf",
    "accessedOn": "2026-11-02",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ESGE; all rights reserved; targeted verification only",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.",
    "authorityAssessment": "Full primary guideline rechecked this round for subepithelial wall layers, characteristic lipoma diagnosis, selective tissue acquisition and no surveillance when clearly diagnosed/asymptomatic. Same publication as source.qq20261102a.esge-sel2022; a new record ID does not create independent evidence. Round five reuses that already-recorded primary-source verification offline; no new web retrieval or independent corroborating source is claimed. The new source ID records a new atomic mapping, not a new publication.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102d.lipoma-histology-provenance"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v8",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102d.acg2020",
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
    "authorityAssessment": "Full primary guideline rechecked for assisted catheter placement, limitations of incomplete studies, provocative maneuvers and complementary FLIP use. Older technical guidance, combined with retained Chicago v4 rather than claimed new diagnostic cutoffs. Round five reuses that already-recorded primary-source verification offline; no new web retrieval or independent corroborating source is claimed. The new source ID records a new atomic mapping, not a new publication.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102d.hrm-rapid-swallow-interpretation",
      "claim.qq20261102d.hrm-rapid-drink-purpose",
      "claim.qq20261102d.hrm-solid-meal-provocation"
    ]
  },
  {
    "contentVersion": "evidence.question-quality.2026-11-02.v8",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.qq20261102d.chicago2021",
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
    "authorityAssessment": "Previously verified primary classification consensus retained for technically adequate primary/secondary-position protocols and deglutitive inhibition. The new failed-acquisition cases are clinical applications, not new normal ranges. Same publication as source.qq20261102b.chicago; a new record ID does not create independent evidence. Round five reuses that already-recorded primary-source verification offline; no new web retrieval or independent corroborating source is claimed. The new source ID records a new atomic mapping, not a new publication.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.qq20261102d.hrm-rapid-swallow-interpretation",
      "claim.qq20261102d.hrm-rapid-drink-purpose",
      "claim.qq20261102d.hrm-solid-meal-provocation"
    ]
  }
];
