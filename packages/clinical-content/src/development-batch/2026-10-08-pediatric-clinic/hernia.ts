import { buildFamily, type ConceptSpec } from "./batch-helpers";
import { C, labelsForClaims } from "./evidence-claims";

const recognition = [C.epigastric, C.umbilical, C.inguinalLocation, C.femoralLocation];
const diagnoses = [
  { slug: "epigastric", label: "Epigastric hernia", rationale: "The focal defect lies in the upper abdominal midline and contains protruding fat, matching an epigastric hernia.", claimIds: [C.epigastric] },
  { slug: "umbilical", label: "Umbilical hernia", rationale: "An umbilical hernia is centered at the navel; this child's defect is above it.", claimIds: [C.umbilical, C.epigastric] },
  { slug: "inguinal", label: "Inguinal canal hernia", rationale: "An inguinal hernia is a groin finding, whereas this lump is in the upper abdominal midline.", claimIds: [C.inguinalLocation, C.epigastric] },
  { slug: "femoral", label: "Femoral canal hernia", rationale: "A femoral hernia is near the groin in the upper thigh, rather than above the navel.", claimIds: [C.femoralLocation, C.epigastric] },
] satisfies ConceptSpec["variants"][number]["choices"];

const specs: ConceptSpec[] = [
  {
    id: "concept.pediatric-clinic.inguinal-hernia-referral",
    displayName: "Refer a childhood inguinal hernia",
    learningObjective: "Refer a clinically suspected childhood inguinal hernia for pediatric surgical assessment rather than applying adult observation criteria.",
    educationalTier: 0, conceptType: "disposition", evidenceClaimIds: [C.groinBulge, C.groinReferral],
    variants: [
      {
        slug: "groin-bulge-after-play", patientName: "Noah Bennett", artProfile: "boy5", parentName: "Daniel Bennett", parentRelationship: "father",
        chiefComplaint: "Groin bulge",
        findings: "His father has noticed a painless bulge in Noah's right groin during active play. A soft groin bulge appears when Noah coughs and disappears when he lies down. Noah is comfortable, with no vomiting or abdominal pain.",
        stem: "Which outpatient plan is most appropriate for Noah Bennett's clinically suspected inguinal hernia?",
        choices: [
          { slug: "surgery", label: "Refer for pediatric surgical assessment", rationale: "The clinical groin-hernia finding warrants pediatric surgical referral even though Noah is comfortable today.", claimIds: [C.groinReferral, C.groinBulge] },
          { slug: "observe", label: "Continue observation in primary care", rationale: "Observation alone does not follow the child-specific referral recommendation for a clinically suspected inguinal hernia.", claimIds: [C.groinReferral] },
          { slug: "parent-monitoring", label: "Continue parent-led monitoring of the bulge", rationale: "Parent observations help establish the history, but monitoring alone omits the indicated pediatric surgical assessment.", claimIds: [C.groinReferral] },
          { slug: "pain-dependent", label: "Defer surgical referral until pain develops", rationale: "The child-specific referral recommendation is based on the clinical hernia finding; pain is not required before referral.", claimIds: [C.groinReferral] },
        ],
        explanation: "Noah's history and examination support a childhood inguinal hernia. Arrange pediatric surgical assessment, including when the child is comfortable and the bulge settles with position.",
        teachingPoint: "A clinically suspected childhood inguinal hernia belongs in a pediatric surgical referral pathway.",
        evidence: { presentation: [C.groinBulge], stem: [C.groinBulge, C.groinReferral], explanation: [C.groinReferral], teachingPoint: [C.groinReferral] },
      },
      {
        slug: "intermittent-groin-swelling", patientName: "Sofia Reed", artProfile: "girl9", parentName: "Helen Reed", parentRelationship: "mother",
        chiefComplaint: "Intermittent groin swelling",
        findings: "Her mother describes a recurrent left groin bulge that appears when Sofia strains and disappears while she rests. The same soft bulge is visible during today's examination and settles when Sofia lies down. Sofia has no pain, vomiting or skin change.",
        stem: "What is the best outpatient disposition for Sofia Reed's clinically apparent inguinal hernia?",
        choices: [
          { slug: "surgery", label: "Arrange a pediatric surgery referral", rationale: "The clinically apparent childhood inguinal hernia should be assessed by pediatric surgery.", claimIds: [C.groinReferral] },
          { slug: "observe", label: "Arrange routine primary-care observation", rationale: "Routine observation alone omits the recommended referral for a childhood inguinal hernia.", claimIds: [C.groinReferral] },
          { slug: "parent-monitoring", label: "Arrange parent-led monitoring of the bulge", rationale: "The parental history already contributes to the diagnosis; further parent monitoring alone does not replace surgical assessment.", claimIds: [C.groinReferral] },
          { slug: "pain-dependent", label: "Arrange surgical referral if pain develops", rationale: "A clinically apparent childhood inguinal hernia warrants referral even while it is painless.", claimIds: [C.groinReferral] },
        ],
        explanation: "Sofia's parent history and examination support a clinically apparent childhood groin hernia. Arrange pediatric surgical assessment based on these clinical findings.",
        teachingPoint: "Child-specific groin-hernia referral is based on clinical history and examination.",
        evidence: { presentation: [C.groinBulge], stem: [C.groinReferral], explanation: [C.groinReferral], teachingPoint: [C.groinReferral] },
      },
    ],
  },
  {
    // Unchanged canonical objective from the accepted 2026-09-28 batch: retain its FSRS identity.
    id: "concept.umbilical-epigastric-hernia.clinical-recognition",
    displayName: "Recognize primary midline hernia",
    learningObjective: "Recognize umbilical or epigastric hernia clinically and reserve imaging for uncertainty.",
    reusedStage: 0, educationalTier: 0, conceptType: "diagnosis", evidenceClaimIds: recognition,
    variants: [
      {
        slug: "upper-midline-lump", patientName: "Ella Morgan", artProfile: "girl6", parentName: "Rachel Morgan", parentRelationship: "mother",
        chiefComplaint: "Upper belly lump",
        findings: "Her mother points out a small focal lump in Ella's upper abdominal midline, above the navel. Examination identifies a small abdominal-wall gap with protruding fat at that site. The navel and groins have no bulge. Ella is comfortable and has no vomiting.",
        stem: "Which diagnosis best explains Ella Morgan's focal upper-midline abdominal-wall defect?",
        choices: diagnoses,
        explanation: "Ella's upper-midline defect with protruding fat supports an epigastric hernia. An umbilical hernia is centered at the navel, and inguinal and femoral hernias occur near the groin.",
        teachingPoint: "A focal fat-containing abdominal-wall defect above the navel supports epigastric hernia.",
        evidence: { presentation: [C.epigastric, C.umbilical], stem: [C.epigastric], explanation: recognition, teachingPoint: [C.epigastric] },
      },
      {
        slug: "epigastric-standing-bulge", patientName: "Oliver Hayes", artProfile: "boy10", parentName: "Martin Hayes", parentRelationship: "father",
        chiefComplaint: "Midline belly bump",
        findings: "Oliver has noticed a focal bump between the lower end of the breastbone and the navel. Standing makes it easier to see. Examination localizes a small upper-midline abdominal-wall defect with a fatty prominence. There is no navel or groin bulge and no acute pain or vomiting.",
        stem: "Which hernia diagnosis best matches Oliver Hayes's upper-midline abdominal-wall finding?",
        choices: diagnoses.map((choice) => ({ ...choice, claimIds: [...choice.claimIds] })) as typeof diagnoses,
        explanation: "Oliver's focal fatty prominence arises through a defect in the upper abdominal midline, which fits an epigastric hernia. Localizing the defect distinguishes this finding from navel and groin hernias.",
        teachingPoint: "Use the site of the focal defect to distinguish epigastric from umbilical and groin hernias.",
        evidence: { presentation: [C.epigastric], stem: [C.epigastric], explanation: recognition, teachingPoint: recognition },
      },
    ],
  },
];

export const HERNIA_FAMILY = buildFamily(specs, labelsForClaims);
