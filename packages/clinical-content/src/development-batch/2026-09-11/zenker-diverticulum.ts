import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
} from "./batch-helpers";

export const ZENKER_DIVERTICULUM_CLAIMS = [
  claim({
    id: "claim.zenker-diverticulum.contrast-swallow",
    statement: "Contrast swallow with fluoroscopy is an appropriate first anatomic test when cervical dysphagia and regurgitation of retained food specifically suggest a proximal pharyngoesophageal pouch.",
    sourceIds: ["source.expansion.zen-rad-2021", "source.expansion.cag-dysphagia-2018"],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation: "This does not generalize to all persistent esophageal dysphagia, for which endoscopy often leads after oropharyngeal disease is excluded.",
    applicablePopulation: "Stable adults with a classic presentation suggesting a proximal pharyngoesophageal pouch.",
    lastCheckedOn: "2026-09-11",
  }),
  claim({
    id: "claim.zenker-diverticulum.false-pouch-anatomy",
    statement: "A posterior pouch containing mucosa and submucosa above the cricopharyngeus supports Zenker diverticulum and reflects impaired cricopharyngeal opening with increased pharyngeal pressure.",
    sourceIds: ["source.expansion.zen-rad-2021", "source.expansion.foregut-diverticula-2021"],
    evidenceCategory: "anatomy",
    certainty: "moderate",
    limitation: "A lateral pouch below the cricopharyngeus suggests another diverticulum; returned imaging supports the pattern without selecting a treatment technique.",
    applicablePopulation: "Adults with returned contrast-swallow anatomy showing a posterior pouch above the cricopharyngeus.",
    lastCheckedOn: "2026-09-11",
  }),
];

export const ZENKER_DIVERTICULUM_SOURCES = linkSourcesToClaims([
  source({
    id: "source.expansion.zen-rad-2021",
    title: "Zenker's Diverticulum: Can Protocolised Measurements with Barium SWALLOW Predict Severity and Treatment Outcomes? The Zen-Rad Study",
    completeCitation: "Ishaq S, Siau K, Lee M, et al. Zenker's Diverticulum: Can Protocolised Measurements with Barium SWALLOW Predict Severity and Treatment Outcomes? The Zen-Rad Study. Dysphagia. 2021;36(3):393-401. doi:10.1007/s00455-020-10148-5. Accessed 2026-09-11.",
    organizationOrJournal: "Dysphagia",
    authors: ["S. Ishaq", "K. Siau", "M. Lee", "Zen-Rad investigators"],
    publicationYear: 2021,
    doi: "10.1007/s00455-020-10148-5",
    pmid: null,
    officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8163680/",
    sourceClass: "observational_study",
    licenseLabel: "CC BY 4.0",
    reuseStatus: "cc_by_4_0",
    reuseNotes: "Attribution required; claims are original synthesis and no figures or tables are reproduced.",
    authorityAssessment: "Prospective observational evidence supporting barium-swallow visualization of the pouch and cricopharyngeal relationship.",
    usageRole: "evidence",
    accessedOn: "2026-09-11",
  }),
  source({
    id: "source.expansion.foregut-diverticula-2021",
    title: "Foregut Diverticula",
    completeCitation: "Roh S. Foregut Diverticula. Korean Journal of Family Medicine. 2021;42(3):191-196. doi:10.4082/kjfm.18.0092. Accessed 2026-09-11.",
    organizationOrJournal: "Korean Journal of Family Medicine",
    authors: ["S. Roh"],
    publicationYear: 2021,
    doi: "10.4082/kjfm.18.0092",
    pmid: null,
    officialUrl: "https://www.kjfm.or.kr/upload/pdf/kjfm-18-0092.pdf",
    sourceClass: "narrative_review",
    licenseLabel: "CC BY-NC 4.0",
    reuseStatus: "cc_by_nc_4_0_restricted",
    reuseNotes: "Attribution required; noncommercial reuse only. Claims are original synthesis.",
    authorityAssessment: "Independent peer-reviewed anatomy and mechanism support.",
    usageRole: "cross_check",
    accessedOn: "2026-09-11",
  }),
  source({
    id: "source.expansion.cag-dysphagia-2018",
    title: "Clinical Practice Guidelines for the Assessment of Uninvestigated Esophageal Dysphagia",
    completeCitation: "Liu LWC, Andrews CN, Armstrong D, et al. Clinical Practice Guidelines for the Assessment of Uninvestigated Esophageal Dysphagia. Journal of the Canadian Association of Gastroenterology. 2018;1(1):5-19. doi:10.1093/jcag/gwx008. Accessed 2026-09-11.",
    organizationOrJournal: "Canadian Association of Gastroenterology / Journal of the Canadian Association of Gastroenterology",
    authors: ["L. W. C. Liu", "C. N. Andrews", "D. Armstrong", "Canadian Association of Gastroenterology"],
    publicationYear: 2018,
    doi: "10.1093/jcag/gwx008",
    pmid: null,
    officialUrl: "https://www.cag-acg.org/_Library/clinical_cpgs_position_papers/CAG_CPG_Esophageal_Dysphagia_JCAG_Feb2018.pdf",
    sourceClass: "professional_society_guideline",
    licenseLabel: "CC BY-NC 4.0",
    reuseStatus: "cc_by_nc_4_0_restricted",
    reuseNotes: "Attribution required; noncommercial reuse only. Claims are original synthesis.",
    authorityAssessment: "Boundary source showing endoscopy generally leads in persistent esophageal dysphagia while barium imaging can complement Zenker assessment.",
    usageRole: "cross_check",
    accessedOn: "2026-09-11",
  }),
], ZENKER_DIVERTICULUM_CLAIMS);

const test = (id: string, label: string, timingProfileId: string, rationale: string, isCorrect = false, serviceId?: string) => ({
  id, label, ...(isCorrect ? { isCorrect: true, ...(serviceId ? { serviceId } : {}) } : {}), rationale, timing: { kind: "test" as const, timingProfileId },
});
const noTest = (id: string, label: string, rationale: string, isCorrect = false) => ({
  id, label, rationale, ...(isCorrect ? { isCorrect: true } : {}), timing: { kind: "no_test" as const },
});

const stories = [
  [
    "regurgitated-food",
    [
      67,
      70
    ],
    "I bring up food that I swallowed earlier.",
    "has months of cervical swallowing difficulty, gurgling in the neck, and delayed regurgitation of retained food. There is no acute impaction or respiratory distress."
  ],
  [
    "neck-gurgle",
    [
      72,
      74
    ],
    "I feel food catch high in my neck and hear gurgling.",
    "has progressive cervical dysphagia with neck gurgling and regurgitation of undigested food. The patient is stable and has no acute aspiration event."
  ],
  [
    "night-regurgitation",
    [
      65,
      69
    ],
    "I wake up bringing back undigested food.",
    "reports cervical sticking and delayed nocturnal regurgitation of retained food without an acute obstruction or unstable breathing."
  ],
  [
    "meal-cough",
    [
      71,
      76
    ],
    "I cough and bring back food after meals.",
    "has chronic high-neck dysphagia, postmeal cough, and regurgitation of food eaten earlier. There is no acute infection, impaction, or airway compromise."
  ]
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, presentation], index) => {
  const result = "Contrast fluoroscopy shows a posterior pouch containing contrast and retained material arising above the cricopharyngeus.";
  return {
    id: `case.zenker-diverticulum.${slug}`,
    displayName: "Cervical swallowing evaluation",
    chiefComplaint: complaint,
    presentation: `{patientName} ${presentation}`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: "concept.zenker-diverticulum.contrast-swallow",
        stem: "Which first anatomic study best evaluates {patientName}'s swallowing symptoms?",
        choices: [
          test(`contrast_swallow_${index + 1}`, "Barium swallow", "timing.test.contrast_swallow", "Contrast fluoroscopy demonstrates a proximal pouch and its relationship to the cricopharyngeus.", true, "service.contrast_swallow"),
          test(`egd_${index + 1}`, "Upper endoscopy", "timing.test.upper_endoscopy", "Endoscopy is important in other dysphagia pathways but is not the preferred first anatomic study for this classic proximal-pouch presentation.", false, undefined),
          test(`neck_us_${index + 1}`, "Neck ultrasound", "timing.test.ultrasound", "Ultrasound does not define the pharyngoesophageal lumen or retained contrast pouch.", false, undefined),
          test(`manometry_${index + 1}`, "Esophageal manometry", "timing.test.esophageal_manometry", "Manometry evaluates motility rather than directly demonstrating the suspected proximal pouch anatomy.", false, undefined),
        ],
        explanation: "A contrast swallow with fluoroscopy is an appropriate first anatomic study for classic cervical dysphagia with delayed regurgitation suggesting Zenker diverticulum.",
        claimIds: ["claim.zenker-diverticulum.contrast-swallow"],
        gate: { id: `gate.zenker-diverticulum.${index + 1}`, serviceId: "service.contrast_swallow", pendingLabel: "External contrast swallow pending", resultNarrative: result, routeIds: ["route.contrast_swallow.outsourced"] },
      },
      {
        conceptId: "concept.zenker-diverticulum.false-pouch-anatomy",
        currentUpdate: result,
        stem: "Which wall layers form the pouch demonstrated in {patientName}'s returned swallow study?",
        choices: [
          noTest(`zenker_false_pouch_${index + 1}`, "Mucosa and submucosa", "Zenker diverticulum is a false pouch composed of mucosa and submucosa.", true),
          noTest(`mucosa_only_${index + 1}`, "Mucosa only", "The pouch includes submucosa as well as mucosa." , false),
          noTest(`muscular_layers_${index + 1}`, "Circular and longitudinal muscle", "A Zenker pouch is not composed solely of the esophageal muscle layers.", false),
          noTest(`all_wall_layers_${index + 1}`, "All layers of the wall", "Inclusion of all wall layers describes a true diverticulum rather than the returned Zenker false pouch.", false),
        ],
        explanation: "Zenker diverticulum is a posterior false pouch of mucosa and submucosa above the cricopharyngeus, associated with impaired cricopharyngeal opening.",
        claimIds: ["claim.zenker-diverticulum.false-pouch-anatomy"],
      },
    ],
  };
});

export const ZENKER_DIVERTICULUM_CONCEPTS = [
  concept({ id: "concept.zenker-diverticulum.contrast-swallow", educationalTier: 0, displayName: "Contrast swallow for suspected Zenker diverticulum", learningObjective: "Select contrast swallow with fluoroscopy for a classic proximal pouch presentation.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.zenker-diverticulum.contrast-swallow"] }),
  concept({ id: "concept.zenker-diverticulum.false-pouch-anatomy", educationalTier: 1, displayName: "Zenker false-pouch anatomy", learningObjective: "Recognize a posterior mucosa-and-submucosa pouch above the cricopharyngeus as Zenker anatomy.", earliestFacilityStage: 1, conceptType: "diagnosis", evidenceClaimIds: ["claim.zenker-diverticulum.false-pouch-anatomy"] }),
];

const family = createDevelopmentFamily({ concepts: ZENKER_DIVERTICULUM_CONCEPTS, cases, sourceLabels: ["Zenker's Diverticulum: Can Protocolised Measurements with Barium SWALLOW Predict Severity and Treatment Outcomes? The Zen-Rad Study", "Foregut Diverticula", "Clinical Practice Guidelines for the Assessment of Uninvestigated Esophageal Dysphagia"] });

export const ZENKER_DIVERTICULUM_TESTED_CONCEPTS = family.testedConcepts;
export const ZENKER_DIVERTICULUM_QUESTIONS = family.questions;
export const ZENKER_DIVERTICULUM_CASES = family.cases;
export const ZENKER_DIVERTICULUM_CASE_REVIEWS = family.caseReviews;
export const ZENKER_DIVERTICULUM_TIMING_ENTRIES = family.timingEntries;
export const ZENKER_DIVERTICULUM_AUTHORING_REVIEW = NEEDS_REVIEW;
export const ZENKER_DIVERTICULUM_SERVICE_CONTRACTS = [{ serviceId: "service.contrast_swallow", allowedRouteIds: ["route.contrast_swallow.outsourced"], delivery: "new_external_contract_required" as const }];
