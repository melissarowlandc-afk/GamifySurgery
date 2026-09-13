import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
} from "./batch-helpers";

export const CAROTID_STENOSIS_CLAIMS = [
  claim({
    id: "claim.carotid-stenosis.confirmatory-vascular-imaging",
    statement: "After duplex suggests severe stenosis in a patient with a recent ipsilateral retinal or hemispheric ischemic event, CTA or MRA is used to confirm stenosis and define anatomy before revascularization planning.",
    sourceIds: ["source.board-batch.canadian-stroke-carotid-2020"],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation: "One adequate supporting guideline source was used. CTA and MRA selection is individualized; this pathway uses CTA and assumes the acute stroke assessment is complete.",
    applicablePopulation: "Stable adults after completed acute assessment for a resolved ipsilateral retinal or nondisabling hemispheric ischemic event.",
    lastCheckedOn: "2026-09-11",
  }),
  claim({
    id: "claim.carotid-stenosis.symptomatic-endarterectomy-selection",
    statement: "A suitable patient with recent symptoms and severe 70–99% ipsilateral carotid stenosis should receive prompt assessment for carotid endarterectomy together with best medical therapy.",
    sourceIds: ["source.board-batch.canadian-stroke-carotid-2020", "source.board-batch.eso-carotid-2021"],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation: "This excludes near-occlusion, complete occlusion, large infarct, hemorrhage, disabling deficit, prohibitive anatomy, and unsuitable operative risk.",
    applicablePopulation: "Stable suitable adults with recent ipsilateral symptoms and confirmed severe carotid stenosis after completed acute stroke assessment.",
    lastCheckedOn: "2026-09-11",
  }),
];

export const CAROTID_STENOSIS_SOURCES = linkSourcesToClaims([
  source({
    id: "source.board-batch.canadian-stroke-carotid-2020",
    title: "Canadian Stroke Best Practice Recommendations: Management of Extracranial Carotid Disease and Intracranial Atherosclerosis",
    completeCitation: "Heart and Stroke Foundation of Canada. Canadian Stroke Best Practice Recommendations, Secondary Prevention of Stroke, Seventh Edition 2020, section 9. Accessed 2026-09-11.",
    organizationOrJournal: "Heart and Stroke Foundation of Canada",
    authors: ["Heart and Stroke Foundation of Canada"],
    publicationYear: 2020,
    doi: null,
    pmid: null,
    officialUrl: "https://www.strokebestpractices.ca/recommendations/secondary-prevention-of-stroke/management-of-extracranial-carotid-disease-and-intracranial-atherosclerosis",
    sourceClass: "professional_society_guideline",
    licenseLabel: "Copyrighted professional guidance; targeted factual verification only",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Original factual synthesis only; no recommendation prose, tables, figures, or marks reproduced.",
    authorityAssessment: "Direct professional guidance for confirmatory CTA or MRA and timely CEA assessment in suitable symptomatic severe disease.",
    usageRole: "evidence",
    accessedOn: "2026-09-11",
  }),
  source({
    id: "source.board-batch.eso-carotid-2021",
    title: "European Stroke Organisation guideline on endarterectomy and stenting for carotid artery stenosis",
    completeCitation: "Bonati LH, Kakkos S, et al. European Stroke Organisation guideline on endarterectomy and stenting for carotid artery stenosis. European Stroke Journal. 2021;6(2):I-XLVII. doi:10.1177/23969873211012121. Accessed 2026-09-11.",
    organizationOrJournal: "European Stroke Organisation / European Stroke Journal",
    authors: ["L. H. Bonati", "S. Kakkos", "European Stroke Organisation Guideline Board"],
    publicationYear: 2021,
    doi: "10.1177/23969873211012121",
    pmid: null,
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8370069/",
    sourceClass: "peer_reviewed_guideline",
    licenseLabel: "Publicly readable; no reusable license asserted",
    reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Original factual synthesis only; no source prose, tables, figures, or marks reproduced.",
    authorityAssessment: "Independent guideline support for carotid endarterectomy in appropriate patients with symptomatic 70–99% stenosis and timely intervention.",
    usageRole: "cross_check",
    accessedOn: "2026-09-11",
  }),
], CAROTID_STENOSIS_CLAIMS);

const test = (id: string, label: string, timingProfileId: string, rationale: string, isCorrect = false, serviceId?: string) => ({
  id, label, ...(isCorrect ? { isCorrect: true, ...(serviceId ? { serviceId } : {}) } : {}), rationale, timing: { kind: "test" as const, timingProfileId },
});
const noTest = (id: string, label: string, rationale: string, isCorrect = false) => ({
  id, label, rationale, ...(isCorrect ? { isCorrect: true } : {}), timing: { kind: "no_test" as const },
});

const stories = [
  [
    "retinal-event",
    [
      63,
      66
    ],
    "I briefly lost vision in one eye last week.",
    "had complete loss of vision in the left eye for ten minutes one week ago and completed urgent stroke-team assessment. There is no hemorrhage, large infarct, disabling deficit, ongoing symptom, or prohibitive operative illness; prevention therapy is underway and duplex suggests severe left carotid stenosis."
  ],
  [
    "hand-weakness",
    [
      68,
      71
    ],
    "I had brief hand weakness that has completely resolved.",
    "had right-hand weakness for fifteen minutes five days ago and completed acute stroke assessment. There is no large infarct, hemorrhage, ongoing deficit, or prohibitive operative illness; best medical prevention has begun and duplex suggests severe left carotid stenosis."
  ],
  [
    "speech-event",
    [
      59,
      62
    ],
    "I had a brief episode of speech difficulty that resolved.",
    "had expressive speech difficulty for twenty minutes eight days ago and completed urgent stroke evaluation. There is no disabling deficit, large infarct, hemorrhage, active symptom, or prohibitive operative illness; medical prevention is underway and duplex suggests severe left carotid narrowing."
  ],
  [
    "curtain-vision",
    [
      72,
      74
    ],
    "I had a curtain-like loss of vision that went away.",
    "had curtain-like loss of vision in the right eye for five minutes four days ago and completed acute stroke-team assessment. There is no ongoing symptom, large infarct, hemorrhage, disabling deficit, or prohibitive operative illness; prevention treatment is underway and duplex suggests severe right carotid stenosis."
  ]
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, presentation], index) => {
  const sides = ["left", "left", "left", "right"] as const;
  const result = `CTA confirms 80% NASCET-equivalent stenosis of the ${sides[index]} internal carotid artery without distal collapse or complete occlusion.`;
  return {
    id: `case.carotid-stenosis.${slug}`,
    displayName: "Symptomatic carotid disease follow-up",
    chiefComplaint: complaint,
    presentation: `{patientName} ${presentation}`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: "concept.carotid-stenosis.confirmatory-vascular-imaging",
        stem: "Which study should confirm the degree and anatomy of {patientName}'s carotid stenosis?",
        choices: [
          test(`carotid_cta_${index + 1}`, "CT angiography of the neck", "timing.test.ct_angiography", "CTA confirms stenosis severity and vascular anatomy after an abnormal duplex study.", true, "service.carotid_cta"),
          test(`repeat_duplex_${index + 1}`, "Repeat carotid duplex ultrasound", "timing.test.ultrasound", "Repeating the same screening modality does not provide the requested confirmatory cross-sectional anatomy.", false, undefined),
          test(`brain_mri_${index + 1}`, "Brain MRI", "timing.test.mri", "Brain MRI assesses cerebral injury but does not define the extracranial carotid stenosis for procedural planning.", false, undefined),
          test(`cardiac_echo_${index + 1}`, "Transthoracic echocardiography", "timing.test.ultrasound", "Cardiac imaging evaluates another embolic source and does not confirm the suspected carotid lesion.", false, undefined),
        ],
        explanation: "CTA is an appropriate confirmatory vascular study after duplex suggests severe symptomatic carotid stenosis; MRA may be selected instead when clinically appropriate.",
        claimIds: ["claim.carotid-stenosis.confirmatory-vascular-imaging"],
        gate: { id: `gate.carotid-stenosis.${index + 1}`, serviceId: "service.carotid_cta", pendingLabel: "External carotid CT angiography pending", resultNarrative: result, routeIds: ["route.carotid_cta.outsourced"] },
      },
      {
        conceptId: "concept.carotid-stenosis.symptomatic-endarterectomy-selection",
        currentUpdate: result,
        stem: "Which next plan is appropriate for {patientName}'s confirmed severe symptomatic stenosis?",
        choices: [
          noTest(`cea_assessment_${index + 1}`, "Prompt carotid endarterectomy assessment", "A suitable patient with recent symptoms and severe ipsilateral stenosis warrants prompt CEA assessment while best medical therapy continues.", true),
          noTest(`routine_year_${index + 1}`, "Repeat office review in one year", "Routine delayed follow-up is inappropriate for recent symptomatic severe carotid disease.", false),
          noTest(`stop_medical_${index + 1}`, "Stop medical therapy while awaiting a procedure", "Best medical therapy continues alongside revascularization assessment.", false),
          noTest(`wait_event_${index + 1}`, "Wait for another ischemic event before referral", "Another acute event should not be awaited before prompt assessment of suitable symptomatic severe stenosis.", false),
        ],
        explanation: "After completed acute assessment, a suitable patient with recent symptoms and confirmed 70–99% ipsilateral stenosis should receive prompt CEA assessment while best medical therapy continues.",
        claimIds: ["claim.carotid-stenosis.symptomatic-endarterectomy-selection"],
      },
    ],
  };
});

export const CAROTID_STENOSIS_CONCEPTS = [
  concept({ id: "concept.carotid-stenosis.confirmatory-vascular-imaging", educationalTier: 0, displayName: "Confirmatory vascular imaging after carotid duplex", learningObjective: "Select confirmatory CT angiography after duplex suggests severe symptomatic carotid stenosis.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.carotid-stenosis.confirmatory-vascular-imaging"] }),
  concept({ id: "concept.carotid-stenosis.symptomatic-endarterectomy-selection", educationalTier: 1, displayName: "Endarterectomy assessment for severe symptomatic carotid stenosis", learningObjective: "Select prompt carotid endarterectomy assessment with best medical therapy for a suitable patient with severe ipsilateral symptomatic stenosis.", earliestFacilityStage: 1, conceptType: "management", evidenceClaimIds: ["claim.carotid-stenosis.symptomatic-endarterectomy-selection"] }),
];

const family = createDevelopmentFamily({ concepts: CAROTID_STENOSIS_CONCEPTS, cases, sourceLabels: ["Canadian Stroke Best Practice Recommendations: Management of Extracranial Carotid Disease and Intracranial Atherosclerosis", "European Stroke Organisation guideline on endarterectomy and stenting for carotid artery stenosis"] });

export const CAROTID_STENOSIS_TESTED_CONCEPTS = family.testedConcepts;
export const CAROTID_STENOSIS_QUESTIONS = family.questions;
export const CAROTID_STENOSIS_CASES = family.cases;
export const CAROTID_STENOSIS_CASE_REVIEWS = family.caseReviews;
export const CAROTID_STENOSIS_TIMING_ENTRIES = family.timingEntries;
export const CAROTID_STENOSIS_AUTHORING_REVIEW = NEEDS_REVIEW;
export const CAROTID_STENOSIS_SERVICE_CONTRACTS = [{ serviceId: "service.carotid_cta", allowedRouteIds: ["route.carotid_cta.outsourced"], delivery: "new_external_contract_required" as const }];
