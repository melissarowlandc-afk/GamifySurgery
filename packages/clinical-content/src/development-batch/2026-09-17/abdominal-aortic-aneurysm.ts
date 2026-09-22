import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
  type ChoiceSpec,
  type NodeSpec,
} from "./batch-helpers";

const USPSTF = "source.brief.uspstf-aaa-screening-2019";
const SVS = "source.brief.svs-aaa-patient-guidance";

const CLAIM_IDS = {
  screening: "claim.brief.aaa.one-time-ultrasound-screening",
  referral: "claim.brief.aaa.six-cm-elective-repair-referral",
} as const;

const CONCEPT_IDS = {
  screening: "concept.aaa.one-time-ultrasound-screening",
  referral: "concept.aaa.six-cm-elective-repair-referral",
} as const;

export const ABDOMINAL_AORTIC_ANEURYSM_CLAIMS = [
  claim({
    id: CLAIM_IDS.screening,
    statement:
      "Men age 65 through 75 who have ever smoked should receive one-time abdominal ultrasound screening for abdominal aortic aneurysm.",
    sourceIds: [USPSTF],
    evidenceCategory: "evaluation",
    certainty: "high",
    limitation:
      "This claim is limited to asymptomatic men with a smoking history and no prior screening; it does not define screening for other populations.",
    applicablePopulation:
      "Asymptomatic men age 65-75 who have ever smoked and have not previously undergone AAA screening.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.referral,
    statement:
      "An acceptable-risk patient with an asymptomatic 6-cm fusiform abdominal aortic aneurysm should receive prompt vascular-surgery evaluation for elective repair rather than routine surveillance alone.",
    sourceIds: [SVS],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "Anatomy and specialist assessment determine open versus endovascular repair. Pain or suspected rupture requires emergency care rather than this outpatient pathway.",
    applicablePopulation:
      "Stable acceptable-risk men with a newly identified asymptomatic 6-cm fusiform AAA and no rupture features.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const ABDOMINAL_AORTIC_ANEURYSM_SOURCES = linkSourcesToClaims(
  [
    source({
      id: USPSTF,
      title: "Abdominal Aortic Aneurysm: Screening",
      completeCitation:
        "US Preventive Services Task Force. Abdominal Aortic Aneurysm: Screening. Final Recommendation Statement. December 10, 2019.",
      organizationOrJournal: "US Preventive Services Task Force",
      authors: ["US Preventive Services Task Force"],
      publicationYear: 2019,
      doi: null,
      pmid: null,
      officialUrl:
        "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/abdominal-aortic-aneurysm-screening",
      accessedOn: "2026-09-17",
      sourceClass: "government_guidance",
      licenseLabel:
        "United States government factual material; USPSTF reuse conditions apply",
      reuseStatus: "public_domain_conditions_apply",
      reuseNotes:
        "Original factual synthesis only; no source prose, tables, graphics, or agency marks reproduced.",
      authorityAssessment:
        "Current federal preventive-services recommendation directly supporting one-time ultrasound screening in the authored population.",
      usageRole: "evidence",
    }),
    source({
      id: SVS,
      title: "Patients with Abdominal Aortic Aneurysm (AAA)",
      completeCitation:
        "Society for Vascular Surgery. Patients with Abdominal Aortic Aneurysm (AAA). Professional guideline summary. Accessed September 17, 2026.",
      organizationOrJournal: "Society for Vascular Surgery",
      authors: ["Society for Vascular Surgery"],
      publicationYear: null,
      doi: null,
      pmid: null,
      officialUrl: "https://vascular.org/node/87",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted professional-society guidance",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual verification and citation only; no source wording, tables, or algorithms reproduced.",
      authorityAssessment:
        "Society guidance supporting referral at diagnosis and elective repair consideration for an acceptable-risk fusiform AAA at least 5.5 cm.",
      usageRole: "evidence",
    }),
  ],
  ABDOMINAL_AORTIC_ANEURYSM_CLAIMS,
);

const test = (
  id: string,
  label: string,
  timingProfileId: string,
  rationale: string,
  isCorrect = false,
  serviceId?: string,
): ChoiceSpec => ({
  id,
  label,
  rationale,
  isCorrect,
  ...(serviceId ? { serviceId } : {}),
  timing: { kind: "test", timingProfileId },
});

const plan = (
  id: string,
  label: string,
  rationale: string,
  isCorrect = false,
): ChoiceSpec => ({
  id,
  label,
  rationale,
  isCorrect,
  timing: { kind: "no_test" },
});

const screeningChoices = (index: number): NodeSpec["choices"] => [
  test(
    `ultrasound_${index}`,
    "Abdominal ultrasound",
    "timing.test.ultrasound",
    "Ultrasound is the recommended one-time screening test.",
    true,
    "service.ultrasound",
  ),
  test(
    `cta_${index}`,
    "CT angiography",
    "timing.test.ct",
    "CT angiography is not the routine first screening study in this asymptomatic patient.",
  ),
  test(
    `xray_${index}`,
    "Abdominal radiography",
    "timing.test.radiography",
    "Plain radiography does not reliably screen the abdominal aorta.",
  ),
  test(
    `echo_${index}`,
    "Transthoracic echocardiography",
    "timing.test.echocardiography",
    "Transthoracic echocardiography does not provide the recommended abdominal aortic screen.",
  ),
];

const referralChoices = (index: number): NodeSpec["choices"] => [
  plan(
    `vascular_${index}`,
    "Elective vascular repair evaluation",
    "A 6-cm fusiform aneurysm warrants prompt specialist evaluation for elective repair.",
    true,
  ),
  test(
    `annual_${index}`,
    "Annual ultrasound surveillance",
    "timing.test.ultrasound",
    "Routine surveillance alone is inappropriate at this clearly qualifying size.",
  ),
  plan(
    `emergency_${index}`,
    "Send for emergency rupture exploration",
    "The patient has no pain, instability, or imaging evidence of rupture.",
  ),
  plan(
    `no_followup_${index}`,
    "End aneurysm follow-up",
    "The returned aneurysm requires specialist management rather than discharge from follow-up.",
  ),
];

const stories = [
  ["retired-carpenter", [65, 66, 67, 68], "Aneurysm screening", "smoked for 25 years before quitting and has never had aneurysm screening. He has no abdominal or back pain and is an acceptable operative-risk candidate."],
  ["former-smoker", [69, 70, 71, 72], "Screening question", "quit smoking twelve years ago after a long smoking history and has never had abdominal aortic screening. He is active and has no aneurysm symptoms."],
  ["remote-smoking", [65, 68, 71, 74], "Preventive visit", "smoked earlier in adulthood and has no prior abdominal aortic imaging. He reports no abdominal, flank, or back pain and is otherwise medically stable."],
  ["current-smoker", [66, 69, 72, 75], "Aortic screening", "currently smokes and has never completed abdominal aortic screening. He is asymptomatic, independent, and has no major condition that would preclude elective repair evaluation."],
] as const;

const cases: CaseSpec[] = stories.map(([slug, ages, complaint, detail], index) => {
  const result =
    "Ultrasound shows a 6.0-cm fusiform infrarenal abdominal aortic aneurysm without rupture. The patient remains an acceptable operative-risk candidate.";
  return {
    id: `case.aaa.${slug}`,
    displayName: "AAA screening visit",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old man who ${detail}`,
    ageYears: ages,
    sexLabels: ["Male"],
    stage: 1,
    nodes: [
      {
        conceptId: CONCEPT_IDS.screening,
        stem: "Which one-time screening test should {patientName} receive?",
        choices: screeningChoices(index + 1),
        explanation:
          "Men age 65 through 75 who have ever smoked should receive one-time abdominal ultrasound screening for AAA.",
        claimIds: [CLAIM_IDS.screening],
        gate: {
          id: `gate.aaa.ultrasound.${index + 1}`,
          serviceId: "service.ultrasound",
          pendingLabel: "Aortic ultrasound pending",
          resultNarrative: result,
          routeIds: ["route.ultrasound.outsourced", "route.ultrasound.in_house"],
        },
      },
      {
        conceptId: CONCEPT_IDS.referral,
        currentUpdate: result,
        stem: "What is the next plan for {patientName}?",
        choices: referralChoices(index + 1),
        explanation:
          "Refer promptly for vascular-surgery evaluation for elective repair. Anatomy and specialist assessment determine the operative approach.",
        claimIds: [CLAIM_IDS.referral],
      },
    ],
  };
});

export const ABDOMINAL_AORTIC_ANEURYSM_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.screening,
    educationalTier: 0,
    displayName: "One-time AAA ultrasound screening",
    learningObjective:
      "Select one-time abdominal ultrasound screening for a man age 65-75 who has ever smoked.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.screening],
  }),
  concept({
    id: CONCEPT_IDS.referral,
    educationalTier: 1,
    displayName: "Elective repair evaluation for a 6-cm AAA",
    learningObjective:
      "Refer an acceptable-risk patient with an asymptomatic 6-cm fusiform AAA for elective vascular repair evaluation.",
    earliestFacilityStage: 1,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.referral],
  }),
];

const family = createDevelopmentFamily({
  concepts: ABDOMINAL_AORTIC_ANEURYSM_CONCEPTS,
  cases,
  sourceLabels: [
    "USPSTF AAA screening recommendation (2019)",
    "Society for Vascular Surgery AAA guidance (accessed 2026)",
  ],
});

export const ABDOMINAL_AORTIC_ANEURYSM_TESTED_CONCEPTS = family.testedConcepts;
export const ABDOMINAL_AORTIC_ANEURYSM_QUESTIONS = family.questions;
export const ABDOMINAL_AORTIC_ANEURYSM_CASES = family.cases;
export const ABDOMINAL_AORTIC_ANEURYSM_CASE_REVIEWS = family.caseReviews;
export const ABDOMINAL_AORTIC_ANEURYSM_TIMING_ENTRIES = family.timingEntries;
export const ABDOMINAL_AORTIC_ANEURYSM_AUTHORING_REVIEW = NEEDS_REVIEW;
export const ABDOMINAL_AORTIC_ANEURYSM_SERVICE_CONTRACTS = [
  {
    serviceId: "service.ultrasound",
    allowedRouteIds: ["route.ultrasound.outsourced", "route.ultrasound.in_house"],
    delivery: "existing_balance_contract" as const,
  },
];
