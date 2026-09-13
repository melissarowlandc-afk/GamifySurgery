import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
} from "./batch-helpers";

export const POST_THYROIDECTOMY_VOICE_CLAIMS = [
  claim({
    id: "claim.post-thyroidectomy-voice.laryngeal-examination",
    statement: "Persistent voice change after thyroid surgery warrants laryngeal visualization with assessment of vocal-fold status.",
    sourceIds: ["source.expansion.kslpl-thyroid-voice-2022"],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation: "Symptoms alone do not establish recurrent or external superior laryngeal nerve injury; edema, intubation injury, muscle or scar effects, and neural dysfunction can overlap.",
    applicablePopulation: "Stable adults with persistent voice change after thyroid surgery.",
    lastCheckedOn: "2026-09-11",
  }),
  claim({
    id: "claim.post-thyroidectomy-voice.external-superior-laryngeal-nerve",
    statement: "The external branch of the superior laryngeal nerve supplies the cricothyroid muscle; postoperative loss of high pitch or projection with preserved ordinary vocal-fold mobility supports cricothyroid or external superior laryngeal nerve dysfunction.",
    sourceIds: ["source.expansion.kslpl-thyroid-voice-2022", "source.expansion.ata-thyroid-surgery-2026"],
    evidenceCategory: "anatomy",
    certainty: "moderate",
    limitation: "This pattern supports but does not prove the localization; specialized voice testing or laryngeal electromyography may be needed.",
    applicablePopulation: "Adults evaluated for persistent loss of upper vocal range or projection after thyroid superior-pole dissection.",
    lastCheckedOn: "2026-09-11",
  }),
];

export const POST_THYROIDECTOMY_VOICE_SOURCES = linkSourcesToClaims([
  source({
    id: "source.expansion.kslpl-thyroid-voice-2022",
    title: "Care and Management of Voice Change in Thyroid Surgery: Korean Society of Laryngology, Phoniatrics and Logopedics Clinical Practice Guideline",
    completeCitation: "Ryu CH, Lee SJ, Cho JG, et al. Care and Management of Voice Change in Thyroid Surgery: Korean Society of Laryngology, Phoniatrics and Logopedics Clinical Practice Guideline. Clinical and Experimental Otorhinolaryngology. 2022;15(1):24-48. doi:10.21053/ceo.2021.00633. Accessed 2026-09-11.",
    organizationOrJournal: "Korean Society of Laryngology, Phoniatrics and Logopedics / Clinical and Experimental Otorhinolaryngology",
    authors: ["C. H. Ryu", "S. J. Lee", "J. G. Cho", "KSLPL Guideline Task Force"],
    publicationYear: 2022,
    doi: "10.21053/ceo.2021.00633",
    pmid: null,
    officialUrl: "https://doi.org/10.21053/ceo.2021.00633",
    sourceClass: "peer_reviewed_guideline",
    licenseLabel: "CC BY-NC 4.0",
    reuseStatus: "cc_by_nc_4_0_restricted",
    reuseNotes: "Attribution required; noncommercial reuse only. Claims are original synthesis.",
    authorityAssessment: "Evidence-based society guideline supporting postoperative laryngeal examination and external superior laryngeal nerve/cricothyroid function.",
    usageRole: "evidence",
    accessedOn: "2026-09-11",
  }),
  source({
    id: "source.expansion.ata-thyroid-surgery-2026",
    title: "Thyroid Surgery",
    completeCitation: "American Thyroid Association. Thyroid Surgery. Undated live education page. Accessed 2026-09-11.",
    organizationOrJournal: "American Thyroid Association",
    authors: ["American Thyroid Association"],
    publicationYear: null,
    doi: null,
    pmid: null,
    officialUrl: "https://www.thyroid.org/thyroid-surgery/",
    sourceClass: "open_educational_resource",
    licenseLabel: "Copyright ATA; educational-use terms; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Accurate attributed factual synthesis only; no republication.",
    authorityAssessment: "Independent society education distinguishing loss of projection and high pitch from ordinary hoarseness patterns.",
    usageRole: "cross_check",
    accessedOn: "2026-09-11",
  }),
], POST_THYROIDECTOMY_VOICE_CLAIMS);

const test = (id: string, label: string, timingProfileId: string, rationale: string, isCorrect = false, serviceId?: string) => ({
  id, label, ...(isCorrect ? { isCorrect: true, ...(serviceId ? { serviceId } : {}) } : {}), rationale, timing: { kind: "test" as const, timingProfileId },
});
const noTest = (id: string, label: string, rationale: string, isCorrect = false) => ({
  id, label, rationale, ...(isCorrect ? { isCorrect: true } : {}), timing: { kind: "no_test" as const },
});

const stories = [
  [
    "choir-range",
    [
      38,
      42
    ],
    "I cannot reach high notes since my thyroid surgery.",
    "sings in a community choir and reports persistent loss of upper range six weeks after thyroidectomy. Ordinary conversation remains clear after a superior-pole dissection."
  ],
  [
    "teacher-projection",
    [
      45,
      48
    ],
    "I cannot project my voice across the classroom since surgery.",
    "teaches school and reports persistent loss of vocal projection after thyroidectomy. Speaking at ordinary volume is preserved, and there is no breathing or swallowing distress."
  ],
  [
    "coach-volume",
    [
      52,
      55
    ],
    "I cannot call across the field since my thyroid operation.",
    "coaches youth sports and has persistent difficulty producing a loud projected voice after thyroid superior-pole work. The ordinary speaking voice remains usable."
  ],
  [
    "singer-pitch",
    [
      33,
      36
    ],
    "I lost the top of my singing range after thyroid surgery.",
    "performs music and reports a persistent loss of high pitch after thyroidectomy. The symptom is stable, and there is no stridor or acute airway concern."
  ]
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, presentation], index) => {
  const result = "Laryngeal visualization shows preserved ordinary vocal-fold mobility without a mucosal lesion; the patient continues to have impaired high pitch and projection.";
  return {
    id: `case.post-thyroidectomy-voice.${slug}`,
    displayName: "Voice change after thyroid surgery",
    chiefComplaint: complaint,
    presentation: `{patientName} ${presentation}`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: "concept.post-thyroidectomy-voice.laryngeal-examination",
        stem: "Which examination should be arranged for {patientName}'s persistent postoperative voice change?",
        choices: [
          test(`laryngeal_exam_${index + 1}`, "Flexible laryngoscopy", "timing.test.laryngeal_examination", "Laryngeal visualization directly assesses vocal-fold status after persistent postoperative voice change.", true, "service.laryngeal_examination"),
          test(`neck_us_${index + 1}`, "Neck ultrasound", "timing.test.ultrasound", "Neck ultrasound does not replace direct laryngeal visualization in this postoperative evaluation pathway.", false, undefined),
          test(`chest_ct_${index + 1}`, "Chest CT", "timing.test.ct", "Chest CT is not the focused examination for this stable postoperative voice complaint.", false, undefined),
          test(`contrast_swallow_${index + 1}`, "Contrast swallow study", "timing.test.contrast_swallow", "A swallow study does not directly evaluate vocal-fold status for the reported voice change.", false, undefined),
        ],
        explanation: "Persistent voice change after thyroid surgery warrants laryngeal visualization rather than symptom-only nerve labeling.",
        claimIds: ["claim.post-thyroidectomy-voice.laryngeal-examination"],
        gate: { id: `gate.post-thyroidectomy-voice.${index + 1}`, serviceId: "service.laryngeal_examination", pendingLabel: "External laryngeal examination pending", resultNarrative: result, routeIds: ["route.laryngeal_examination.outsourced"] },
      },
      {
        conceptId: "concept.post-thyroidectomy-voice.external-superior-laryngeal-nerve",
        currentUpdate: result,
        stem: "Which functional structure best localizes {patientName}'s persistent loss of high pitch and projection?",
        choices: [
          noTest(`ebsln_cricothyroid_${index + 1}`, "External superior laryngeal nerve and cricothyroid muscle", "The external superior laryngeal nerve supplies the cricothyroid muscle that supports vocal-fold tension, high pitch, and projection.", true),
          noTest(`rln_pca_${index + 1}`, "Recurrent laryngeal nerve and posterior cricoarytenoid muscle", "This motor pathway is central to vocal-fold abduction, which does not match the preserved ordinary mobility described.", false),
          noTest(`internal_sln_${index + 1}`, "Internal superior laryngeal nerve and supraglottic sensation", "The internal branch is sensory and does not drive cricothyroid tension for high pitch and projection.", false),
          noTest(`hypoglossal_${index + 1}`, "Hypoglossal nerve and tongue musculature", "Tongue motor function does not explain the isolated postoperative loss of upper range and projection.", false),
        ],
        explanation: "Loss of high pitch or projection with preserved ordinary vocal-fold mobility supports external superior laryngeal nerve and cricothyroid dysfunction, although the pattern is not independently definitive.",
        claimIds: ["claim.post-thyroidectomy-voice.external-superior-laryngeal-nerve"],
      },
    ],
  };
});

export const POST_THYROIDECTOMY_VOICE_CONCEPTS = [
  concept({ id: "concept.post-thyroidectomy-voice.laryngeal-examination", educationalTier: 0, displayName: "Laryngeal examination after thyroid surgery", learningObjective: "Select laryngeal visualization for persistent voice change after thyroid surgery.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.post-thyroidectomy-voice.laryngeal-examination"] }),
  concept({ id: "concept.post-thyroidectomy-voice.external-superior-laryngeal-nerve", educationalTier: 1, displayName: "External superior laryngeal nerve localization", learningObjective: "Localize loss of high pitch and projection with preserved ordinary vocal-fold mobility to external superior laryngeal nerve and cricothyroid dysfunction.", earliestFacilityStage: 1, conceptType: "applied_science", evidenceClaimIds: ["claim.post-thyroidectomy-voice.external-superior-laryngeal-nerve"] }),
];

const family = createDevelopmentFamily({ concepts: POST_THYROIDECTOMY_VOICE_CONCEPTS, cases, sourceLabels: ["Care and Management of Voice Change in Thyroid Surgery: Korean Society of Laryngology, Phoniatrics and Logopedics Clinical Practice Guideline", "Thyroid Surgery"] });

export const POST_THYROIDECTOMY_VOICE_TESTED_CONCEPTS = family.testedConcepts;
export const POST_THYROIDECTOMY_VOICE_QUESTIONS = family.questions;
export const POST_THYROIDECTOMY_VOICE_CASES = family.cases;
export const POST_THYROIDECTOMY_VOICE_CASE_REVIEWS = family.caseReviews;
export const POST_THYROIDECTOMY_VOICE_TIMING_ENTRIES = family.timingEntries;
export const POST_THYROIDECTOMY_VOICE_AUTHORING_REVIEW = NEEDS_REVIEW;
export const POST_THYROIDECTOMY_VOICE_SERVICE_CONTRACTS = [{ serviceId: "service.laryngeal_examination", allowedRouteIds: ["route.laryngeal_examination.outsourced"], delivery: "new_external_contract_required" as const }];
