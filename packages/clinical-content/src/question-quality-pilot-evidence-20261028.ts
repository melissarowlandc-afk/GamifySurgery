import type { ClinicalSource, EvidenceClaim } from "./pilot-schema";

export const QUESTION_QUALITY_CONTENT_VERSION = "question-authoring.2026-10-28.v1";
const draft = {
  contentVersion: QUESTION_QUALITY_CONTENT_VERSION,
  reviewStatus: "needs_clinician_review" as const,
  aiAssistedDrafting: true,
  lastClinicianReview: null,
};

/** Atomic additions only. Existing claim/source IDs remain attached where applicable. */
export const QUESTION_QUALITY_CLAIMS: EvidenceClaim[] = [
  {
    ...draft, id: "claim.qq20261028.cholecystitis.comparative-imaging",
    statement: "When additional imaging is needed for suspected acute calculous cholecystitis, WSES identifies hepatobiliary scintigraphy as having the strongest diagnostic sensitivity and specificity among the modalities compared, with use depending on resources and expertise.",
    sourceIds: ["source.qq20261028.wses-cholecystitis-2020"],
    evidenceCategory: "evaluation", certainty: "moderate",
    limitation: "One guideline supports the comparative ranking; this is not a universal next-test rule and does not address every competing abdominal or duct-imaging goal.",
    applicablePopulation: "Selected patients with suspected acute calculous cholecystitis needing further imaging.", lastCheckedOn: "2026-10-28",
  },
  {
    ...draft, id: "claim.qq20261028.merkel.panel-pattern",
    statement: "A dermal small-cell malignancy with dot-pattern CK20 and neuroendocrine-marker expression can support Merkel cell carcinoma when integrated with the clinical and pathologic assessment.",
    sourceIds: ["source.qq20261028.harms-merkel-2018", "source.qq20261028.esmo-merkel-2024"],
    evidenceCategory: "evaluation", certainty: "moderate",
    limitation: "The illustrative panel is not a stand-alone diagnostic algorithm; the exact differential and panel sufficiency require clinician review.",
    applicablePopulation: "Patients undergoing evaluation of a dermal small-cell malignancy.", lastCheckedOn: "2026-10-28",
  },
  {
    ...draft, id: "claim.qq20261028.merkel.panel-exceptions",
    statement: "CK20 and TTF1 patterns help distinguish Merkel cell carcinoma from pulmonary small-cell carcinoma, but exceptions prevent a single marker from definitively separating them.",
    sourceIds: ["source.qq20261028.harms-merkel-2018", "source.qq20261028.esmo-merkel-2024"],
    evidenceCategory: "evaluation", certainty: "moderate",
    limitation: "The draft asks which diagnosis is best supported among the options, not which diagnosis a stain proves or excludes.",
    applicablePopulation: "Cutaneous small-cell malignancies with a pulmonary small-cell differential.", lastCheckedOn: "2026-10-28",
  },
  {
    ...draft, id: "claim.qq20261028.capnography.rebreathing-baseline",
    statement: "Rebreathing can raise the inspiratory carbon-dioxide baseline; a tracing returning to zero during inspiration weighs against that mechanism for a rising expired carbon-dioxide value.",
    sourceIds: ["source.qq20261028.williams-capnography-2024"],
    evidenceCategory: "evaluation", certainty: "moderate",
    limitation: "The source is a neonatal perspective. Only the general waveform mechanism is used; adult perioperative application and sampling limitations require clinician review. It does not rule out all equipment problems.",
    applicablePopulation: "Illustrative capnography interpretation; not a neonatal-to-adult management recommendation.", lastCheckedOn: "2026-10-28",
  },
  {
    ...draft, id: "claim.qq20261028.peristomal.fit-exposure",
    statement: "When a pouch opening leaves peristomal skin exposed to effluent, fit assessment and an opening fitted around the stoma base address continuing contact injury.",
    sourceIds: ["source.gs028g.babakhanlou-stoma-2022", "source.qq20261028.wocn-peristomal"],
    evidenceCategory: "management", certainty: "moderate",
    limitation: "Does not exclude coexisting infection or prescribe one product, wear interval or opening dimension. Exact skin-distribution interpretation requires clinician review.",
    applicablePopulation: "People with an ostomy and suspected effluent-related peristomal skin injury.", lastCheckedOn: "2026-10-28",
  },
  {
    ...draft, id: "claim.qq20261028.statistics.odds-scale",
    statement: "Odds compare a probability with its complement; the ratio of two such odds is an odds ratio, distinct from division or subtraction of the probabilities themselves.",
    sourceIds: ["source.cdc.field-epi-analysis.2026", "source.cdc.field-epi-study-design.2026"],
    evidenceCategory: "definition", certainty: "high",
    limitation: "Algebraic educational expression, not an adjusted-model interpretation, causal conclusion or real clinical effect estimate. Existing source metadata remains at its recorded access date; analysis page rechecked 2026-10-28.",
    applicablePopulation: "Fictional statistical-method exercises.", lastCheckedOn: "2026-10-28",
  },
];

export const QUESTION_QUALITY_SOURCES: ClinicalSource[] = [
  {
    ...draft, id: "source.qq20261028.harms-merkel-2018",
    title: "The biology and treatment of Merkel cell carcinoma: current understanding and research priorities",
    completeCitation: "Harms PW, Harms KL, Moore PS, DeCaprio JA, Nghiem P, Wong MKK, Brownell I; IWMCC Working Group. The biology and treatment of Merkel cell carcinoma: current understanding and research priorities. Nature Reviews Clinical Oncology. 2018;15:763-776. doi:10.1038/s41571-018-0103-2.",
    organizationOrJournal: "Nature Reviews Clinical Oncology / IWMCC Working Group",
    authors: ["Paul W. Harms", "Kelly L. Harms", "Patrick S. Moore", "James A. DeCaprio", "Paul Nghiem", "Michael K. K. Wong", "Isaac Brownell", "IWMCC Working Group"],
    publicationYear: 2018, doi: "10.1038/s41571-018-0103-2", pmid: null,
    officialUrl: "https://www.nature.com/articles/s41571-018-0103-2", accessedOn: "2026-10-28",
    sourceClass: "narrative_review", licenseLabel: "CC BY 4.0, article-specific publisher notice verified",
    reuseStatus: "cc_by_4_0", reuseNotes: "https://creativecommons.org/licenses/by/4.0/. Authors and original publication credited. Independently synthesized underlying facts only; no source prose, panel, table, figure or algorithm copied or adapted.",
    authorityAssessment: "Expert consensus review; older than the ESMO guideline, independently cross-checks diagnostic panel patterns and limitations.",
    usageRole: "both", evidenceClaimIds: ["claim.qq20261028.merkel.panel-pattern", "claim.qq20261028.merkel.panel-exceptions"],
  },
  {
    ...draft, id: "source.qq20261028.esmo-merkel-2024",
    title: "Merkel-cell carcinoma: ESMO-EURACAN Clinical Practice Guideline for diagnosis, treatment and follow-up",
    completeCitation: "Lugowska I, Becker JC, Ascierto PA, Veness M, Blom A, Lebbe C, Migliano E, Hamming-Vrieze O, Goebeler M, Kneitz H, Nathan P, Rutkowski P, Slowinska M, Schadendorf D, Piulats JM, Petrelli F, van Akkooi ACJ, Berruti A; ESMO Guidelines Committee. Merkel-cell carcinoma: ESMO-EURACAN Clinical Practice Guideline for diagnosis, treatment and follow-up. ESMO Open. 2024;9(5):102977. doi:10.1016/j.esmoop.2024.102977.",
    organizationOrJournal: "ESMO-EURACAN / ESMO Open",
    authors: ["I. Lugowska", "J. C. Becker", "P. A. Ascierto", "M. Veness", "A. Blom", "C. Lebbe", "E. Migliano", "O. Hamming-Vrieze", "M. Goebeler", "H. Kneitz", "P. Nathan", "P. Rutkowski", "M. Slowinska", "D. Schadendorf", "J. M. Piulats", "F. Petrelli", "A. C. J. van Akkooi", "A. Berruti", "ESMO Guidelines Committee"],
    publicationYear: 2024, doi: "10.1016/j.esmoop.2024.102977", pmid: null,
    officialUrl: "https://doi.org/10.1016/j.esmoop.2024.102977", accessedOn: "2026-10-28",
    sourceClass: "professional_society_guideline", licenseLabel: "CC BY-NC-ND 4.0; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only", reuseNotes: "https://creativecommons.org/licenses/by-nc-nd/4.0/. No adaptation or redistribution of source expression. Indexed open-access primary diagnostic text and license readable; direct PMC challenge/publisher restrictions were not bypassed. Rights are not inferred from PMC hosting.",
    authorityAssessment: "Society guideline, cross-checking immunophenotype and exceptions; exact illustrative panel needs clinician review.",
    usageRole: "cross_check", evidenceClaimIds: ["claim.qq20261028.merkel.panel-pattern", "claim.qq20261028.merkel.panel-exceptions"],
  },
  {
    ...draft, id: "source.qq20261028.williams-capnography-2024",
    title: "Capnography waveforms: basic interpretation in neonatal intensive care",
    completeCitation: "Williams EE, Dassios T, Harris C, Greenough A. Capnography waveforms: basic interpretation in neonatal intensive care. Frontiers in Pediatrics. 2024;12:1396846. doi:10.3389/fped.2024.1396846.",
    organizationOrJournal: "Frontiers in Pediatrics", authors: ["Emma E. Williams", "Theodore Dassios", "Christopher Harris", "Anne Greenough"],
    publicationYear: 2024, doi: "10.3389/fped.2024.1396846", pmid: null,
    officialUrl: "https://www.frontiersin.org/journals/pediatrics/articles/10.3389/fped.2024.1396846/full", accessedOn: "2026-10-28",
    sourceClass: "narrative_review", licenseLabel: "CC BY 4.0; article-specific copyright notice verified",
    reuseStatus: "cc_by_4_0", reuseNotes: "https://creativecommons.org/licenses/by/4.0/. Original factual synthesis with attribution; no waveform figure, case scenario, caption or other source expression copied/adapted.",
    authorityAssessment: "Peer-reviewed neonatal perspective; limited to basic waveform physiology, not direct evidence for adult management or probabilities.",
    usageRole: "evidence", evidenceClaimIds: ["claim.qq20261028.capnography.rebreathing-baseline"],
  },
  {
    ...draft, id: "source.qq20261028.wocn-peristomal",
    title: "Peristomal Skin Assessment Guide for Clinicians",
    completeCitation: "Wound, Ostomy, and Continence Nurses Society. Peristomal Skin Assessment Guide for Clinicians. Undated online clinician guide. Accessed October 28, 2026.",
    organizationOrJournal: "Wound, Ostomy, and Continence Nurses Society", authors: ["Wound, Ostomy, and Continence Nurses Society"],
    publicationYear: null, doi: null, pmid: null, officialUrl: "https://psag.wocn.org/index.html", accessedOn: "2026-10-28",
    sourceClass: "professional_society_guideline", licenseLabel: "Copyrighted society guide; no open reuse license established",
    reuseStatus: "copyrighted_targeted_verification_only", reuseNotes: "Targeted factual cross-check only. No guide text, workflow, images, videos or algorithm reproduced/adapted. Educational grant funding disclosed by the source.",
    authorityAssessment: "Specialty-society practical guide; independent of the general stoma review, with no graded comparative-effect estimate implied.",
    usageRole: "cross_check", evidenceClaimIds: ["claim.qq20261028.peristomal.fit-exposure"],
  },
  {
  "contentVersion": "question-authoring.2026-10-28.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.qq20261028.wses-cholecystitis-2020",
  "title": "WSES acute calculous cholecystitis guideline",
  "completeCitation": "Pisano M, Allievi N, Gurusamy K, et al. 2020 World Society of Emergency Surgery updated guidelines for acute calculous cholecystitis. World J Emerg Surg. 2020;15:61.",
  "organizationOrJournal": "World Journal of Emergency Surgery",
  "authors": [
    "Pisano M",
    "Allievi N",
    "Gurusamy K",
    "et al."
  ],
  "publicationYear": 2020,
  "doi": "10.1186/s13017-020-00336-x",
  "pmid": null,
  "officialUrl": "https://link.springer.com/article/10.1186/s13017-020-00336-x",
  "accessedOn": "2026-10-28",
  "sourceClass": "professional_society_guideline",
  "licenseLabel": "Creative Commons Attribution 4.0",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-specific CC BY 4.0 verified on publisher record. https://creativecommons.org/licenses/by/4.0/. Original factual synthesis with citation; no source prose, algorithms, tables or figures copied/adapted.",
  "authorityAssessment": "WSES professional-society guideline; moderate-quality comparative imaging recommendation. A single guideline, not independent replicated support.",
  "usageRole": "evidence",
  "evidenceClaimIds": [
    "claim.qq20261028.cholecystitis.comparative-imaging"
  ]
},
];
