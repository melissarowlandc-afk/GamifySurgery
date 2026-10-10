import { buildFamily, type ConceptSpec } from "./batch-helpers";
import { C, labelsForClaims } from "./evidence-claims";

const care = [C.pilonidalCare, C.pilonidalClean, C.pilonidalMoisture, C.pilonidalPressure, C.pilonidalHair, C.pilonidalReassessment];
const specs: ConceptSpec[] = [{
  id: "concept.pediatric-clinic.limited-pilonidal-conservative-care",
  displayName: "Plan conservative adolescent pilonidal care",
  learningObjective: "Discuss individualized conservative care and reassessment for limited adolescent pilonidal disease without an acute abscess, rather than selecting an operation by default.",
  educationalTier: 1, conceptType: "management", evidenceClaimIds: [C.pilonidalPattern, ...care, C.pilonidalInfection],
  variants: [
    {
      slug: "pilonidal-first-clinic-visit", patientName: "Ava Collins", artProfile: "girl16", parentName: "Julia Collins", parentRelationship: "mother",
      chiefComplaint: "Tailbone drainage",
      findings: "Ava has occasional drainage from small pits in the midline of the upper natal cleft. Symptoms have had little effect on her activities. Examination shows limited pilonidal disease with no tender fluctuant swelling, spreading redness or fever. Ava has not yet tried a coordinated local-care plan.",
      stem: "Which initial plan best fits Ava Collins's limited pilonidal disease without an acute abscess?",
      choices: [
        { slug: "care", label: "Begin conservative cleft care with reassessment", rationale: "Limited disease without an acute abscess can start with individualized conservative care and review of the response.", claimIds: [C.pilonidalCare, C.pilonidalReassessment] },
        { slug: "excision", label: "Refer directly for elective excision and closure", rationale: "Immediate selection of excision bypasses a conservative care discussion for this mild, previously untreated presentation.", claimIds: [C.pilonidalCare, C.pilonidalReassessment] },
        { slug: "abscess", label: "Refer for treatment as an acute abscess", rationale: "An acute abscess is a different management situation; Ava's examination explicitly lacks that presentation.", claimIds: [C.pilonidalInfection, C.pilonidalCare] },
        { slug: "discharge", label: "Reassure and end further local-care follow-up", rationale: "A conservative plan should include care advice and reassessment if symptoms persist or the pattern changes.", claimIds: [C.pilonidalCare, C.pilonidalReassessment] },
      ],
      explanation: "Discuss a practical conservative plan with Ava and her mother: cleft cleanliness, limiting retained moisture and prolonged local pressure, and an individualized hair-management discussion. Review the response and reconsider the plan if symptoms or disease burden increase.",
      teachingPoint: "Limited adolescent pilonidal disease can begin with individualized conservative care and reassessment.",
      evidence: { presentation: [C.pilonidalPattern, C.pilonidalCare, C.pilonidalInfection], stem: [C.pilonidalCare], explanation: care, teachingPoint: [C.pilonidalCare, C.pilonidalReassessment] },
    },
    {
      slug: "pilonidal-mild-cleft-symptoms", patientName: "Owen Taylor", artProfile: "boy17", parentName: "Mark Taylor", parentRelationship: "father",
      chiefComplaint: "Cleft irritation",
      findings: "Owen reports intermittent upper-cleft irritation and scant drainage. Examination identifies midline natal-cleft pits without a fluctuant mass, spreading inflammation or fever. His day-to-day activities are largely unaffected. He and his father ask whether surgery must be the first treatment.",
      stem: "Which management plan is most appropriate for Owen Taylor's limited pilonidal disease at this first clinic assessment?",
      choices: [
        { slug: "care", label: "Discuss conservative local care and follow-up", rationale: "Individualized conservative management is a reasonable initial plan for limited disease without acute infection.", claimIds: [C.pilonidalCare, C.pilonidalReassessment] },
        { slug: "excision", label: "Discuss immediate excision as the initial plan", rationale: "The cited pediatric approach does not require choosing excision before conservative care has been discussed in a mild presentation.", claimIds: [C.pilonidalCare] },
        { slug: "abscess", label: "Discuss referral for acute abscess treatment", rationale: "The examination does not describe an acute abscess; that separate management pathway is not indicated by this scenario.", claimIds: [C.pilonidalInfection, C.pilonidalCare] },
        { slug: "discharge", label: "Discuss discharge from further local-care review", rationale: "Ending review would omit reassessment of the response to local care and changing disease burden.", claimIds: [C.pilonidalCare, C.pilonidalReassessment] },
      ],
      explanation: "Discuss individualized cleft care, moisture and pressure reduction, a suitable hair-management plan and follow-up with Owen and his father. Persistent symptoms or greater disease burden can prompt reassessment of treatment options.",
      teachingPoint: "Initial pilonidal planning should account for symptom burden and response to conservative care.",
      evidence: { presentation: [C.pilonidalPattern, C.pilonidalCare, C.pilonidalInfection], stem: [C.pilonidalCare], explanation: care, teachingPoint: [C.pilonidalCare, C.pilonidalReassessment] },
    },
  ],
}];

export const PILONIDAL_FAMILY = buildFamily(specs, labelsForClaims);
