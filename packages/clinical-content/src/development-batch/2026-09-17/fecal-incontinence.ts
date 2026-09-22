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

const ASCRS = "source.brief.ascrs-fecal-incontinence-2023";

const CLAIM_IDS = {
  firstLine: "claim.brief.fecal-incontinence.first-line-stool-care",
  endoanalUltrasound:
    "claim.brief.fecal-incontinence.endoanal-ultrasound-repair-planning",
} as const;

const CONCEPT_IDS = {
  firstLine: "concept.fecal-incontinence.first-line-stool-care",
  endoanalUltrasound:
    "concept.fecal-incontinence.endoanal-ultrasound-repair-planning",
} as const;

export const FECAL_INCONTINENCE_CLAIMS = [
  claim({
    id: CLAIM_IDS.firstLine,
    statement:
      "Dietary and medical measures that improve bowel habits and stool consistency are first-line care for stable fecal incontinence.",
    sourceIds: [ASCRS],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "No single diet, medication, dose, or regimen is universally appropriate; care should respond to the patient's stool pattern and contributors.",
    applicablePopulation:
      "Stable adults presenting for initial management of fecal incontinence without an acute neurologic, infectious, or obstructive feature.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.endoanalUltrasound,
    statement:
      "Endoanal ultrasound is a selected anatomy study when sphincter repair is being considered after appropriate evaluation for persistent fecal incontinence.",
    sourceIds: [ASCRS],
    evidenceCategory: "evaluation",
    certainty: "moderate",
    limitation:
      "A sphincter defect alone does not predict symptom severity or mandate an operation. Ultrasound is not a routine test for every patient with fecal incontinence.",
    applicablePopulation:
      "Adults with persistent fecal incontinence for whom specialist evaluation has identified possible sphincter injury and repair planning is under consideration.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const FECAL_INCONTINENCE_SOURCES = linkSourcesToClaims(
  [
    source({
      id: ASCRS,
      title:
        "The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Fecal Incontinence",
      completeCitation:
        "Bordeianou LG, Thorsen AJ, Keller DS, Hawkins AT, Messick C, Oliveira L, Feingold DL, Lightner AL, Paquette IM. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Fecal Incontinence. Dis Colon Rectum. 2023;66(5):647-661. doi:10.1097/DCR.0000000000002776.",
      organizationOrJournal:
        "American Society of Colon and Rectal Surgeons / Diseases of the Colon & Rectum",
      authors: [
        "Bordeianou LG",
        "Thorsen AJ",
        "Keller DS",
        "Hawkins AT",
        "Messick C",
        "Oliveira L",
        "Feingold DL",
        "Lightner AL",
        "Paquette IM",
      ],
      publicationYear: 2023,
      doi: "10.1097/DCR.0000000000002776",
      pmid: null,
      officialUrl:
        "https://fascrs.org/ascrs/media/files/2023-Fecal-Incontinence-CPG.pdf",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyright American Society of Colon & Rectal Surgeons",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Targeted factual verification and citation only; no source prose, tables, figures, or algorithms reproduced.",
      authorityAssessment:
        "Current colorectal-surgery guideline directly supporting first-line conservative care and selected endoanal ultrasound for repair planning.",
      usageRole: "evidence",
    }),
  ],
  FECAL_INCONTINENCE_CLAIMS,
);

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

const test = (
  id: string,
  label: string,
  timingProfileId: string,
  rationale: string,
  isCorrect = false,
): ChoiceSpec => ({
  id,
  label,
  rationale,
  isCorrect,
  timing: { kind: "test", timingProfileId },
});

const firstLineChoices = (index: number): NodeSpec["choices"] => [
  plan(
    `stool_care_${index}`,
    "Stool-consistency management",
    "Dietary and medical care tailored to stool pattern is the first-line approach.",
    true,
  ),
  plan(
    `repair_${index}`,
    "Immediate sphincter repair",
    "Operative repair is not the first step before conservative care and anatomy assessment.",
  ),
  plan(
    `neuromodulation_${index}`,
    "Immediate sacral neuromodulation",
    "Advanced procedural treatment should not precede an initial conservative plan.",
  ),
  plan(
    `colostomy_${index}`,
    "Immediate colostomy creation",
    "The stable initial presentation does not justify this advanced option.",
  ),
];

const anatomyChoices = (index: number): NodeSpec["choices"] => [
  test(
    `eaus_${index}`,
    "Endoanal ultrasound",
    "timing.test.endoanal_ultrasound",
    "This study defines sphincter anatomy when repair planning is being considered.",
    true,
  ),
  test(
    `manometry_${index}`,
    "Anorectal manometry",
    "timing.test.anorectal_manometry",
    "Manometry evaluates function but does not provide the requested sphincter anatomy for repair planning.",
  ),
  test(
    `colonoscopy_${index}`,
    "Diagnostic colonoscopy",
    "timing.test.lower_endoscopy",
    "Colonoscopy does not map an anal sphincter defect for repair planning.",
  ),
  test(
    `ct_${index}`,
    "Pelvic CT",
    "timing.test.ct",
    "Routine pelvic CT is not the selected sphincter anatomy study.",
  ),
];

const initialStories = [
  ["loose-stool-leakage", [38, 52], "Bowel leakage", "reports intermittent leakage associated with loose stools. This is the first treatment visit, with no bleeding, weight loss, neurologic deficit, impaction, or acute infection."],
  ["urgency-accidents", [44, 61], "Urgency accidents", "has urgency and occasional stool accidents when stools are loose. There is no alarm symptom, acute neurologic change, obstructive symptom, or prior conservative treatment plan."],
  ["daily-smearing", [35, 58], "Stool smearing", "reports stool smearing and variable stool consistency without pain or bleeding. This is the first treatment visit, with no prior conservative plan and no acute neurologic, infectious, or obstructive concern."],
  ["exercise-leakage", [41, 66], "Stool leakage", "has small-volume leakage during exercise when stools are loose. This is the initial management visit, without bleeding, weight loss, impaction, or acute neurologic symptom."],
] as const;

const planningStories = [
  ["obstetric-injury", [42, 48, 54, 60], "Persistent leakage", "has persistent fecal incontinence despite documented dietary and medical management. Specialist examination suggests an old obstetric sphincter injury, and repair planning is now being considered."],
  ["prior-anorectal-injury", [43, 62], "Continence follow-up", "continues to have fecal incontinence after an adequate conservative program. Prior anorectal trauma may have disrupted the sphincter, and the specialist is considering repair."],
  ["sphincter-concern", [51, 68], "Ongoing incontinence", "has persistent symptoms after stool consistency and bowel-habit care. Examination raises concern for a focal sphincter defect, and anatomic repair planning is under discussion."],
  ["repair-consult", [48, 64], "Repair planning", "returns after persistent fecal incontinence despite appropriate conservative care. The colorectal specialist suspects a repairable sphincter injury and needs anatomic definition before counseling."],
] as const;

const initialCases: CaseSpec[] = initialStories.map(
  ([slug, ages, complaint, detail], index) => ({
    id: `case.fecal-incontinence.${slug}`,
    displayName: "Initial fecal incontinence care",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}`,
    ageYears: ages,
    sexLabels: ["Female", "Male"],
    stage: 0,
    nodes: [
      {
        conceptId: CONCEPT_IDS.firstLine,
        stem: "Which initial treatment best fits {patientName}?",
        choices: firstLineChoices(index + 1),
        explanation:
          "Begin with dietary and medical measures tailored to bowel habits and stool consistency. No single regimen is appropriate for every patient.",
        claimIds: [CLAIM_IDS.firstLine],
      },
    ],
  }),
);

const planningCases: CaseSpec[] = planningStories.map(
  ([slug, ages, complaint, detail], index) => ({
    id: `case.fecal-incontinence.${slug}`,
    displayName: "Sphincter repair planning",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}`,
    ageYears: ages,
    sexLabels: index === 0 ? ["Female"] : ["Female", "Male"],
    stage: 1,
    nodes: [
      {
        conceptId: CONCEPT_IDS.endoanalUltrasound,
        stem: "Which study should define sphincter anatomy?",
        choices: anatomyChoices(index + 1),
        explanation:
          "Use endoanal ultrasound when sphincter repair is being considered. A defect informs planning but does not by itself mandate surgery.",
        claimIds: [CLAIM_IDS.endoanalUltrasound],
      },
    ],
  }),
);

export const FECAL_INCONTINENCE_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.firstLine,
    educationalTier: 0,
    displayName: "First-line stool and bowel-habit care",
    learningObjective:
      "Begin stable fecal incontinence care with dietary and medical measures tailored to stool consistency and bowel habits.",
    earliestFacilityStage: 0,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.firstLine],
  }),
  concept({
    id: CONCEPT_IDS.endoanalUltrasound,
    educationalTier: 1,
    displayName: "Endoanal ultrasound for sphincter repair planning",
    learningObjective:
      "Select endoanal ultrasound when sphincter anatomy is needed for possible repair planning.",
    earliestFacilityStage: 1,
    conceptType: "workup",
    evidenceClaimIds: [CLAIM_IDS.endoanalUltrasound],
  }),
];

const family = createDevelopmentFamily({
  concepts: FECAL_INCONTINENCE_CONCEPTS,
  cases: [...initialCases, ...planningCases],
  sourceLabels: ["ASCRS fecal incontinence guideline (2023)"],
});

export const FECAL_INCONTINENCE_TESTED_CONCEPTS = family.testedConcepts;
export const FECAL_INCONTINENCE_QUESTIONS = family.questions;
export const FECAL_INCONTINENCE_CASES = family.cases;
export const FECAL_INCONTINENCE_CASE_REVIEWS = family.caseReviews;
export const FECAL_INCONTINENCE_TIMING_ENTRIES = family.timingEntries;
export const FECAL_INCONTINENCE_AUTHORING_REVIEW = NEEDS_REVIEW;
export const FECAL_INCONTINENCE_SERVICE_CONTRACTS = [];
