import { buildFamily, type ConceptSpec, type VariantSpec } from "./batch-helpers";
import { C, labelsForClaims } from "./evidence-claims";

const allergy = [C.allergyLabel, C.allergyHistory, C.allergyAssessment];
const allergyChoices: VariantSpec["choices"] = [
  { slug: "history", label: "Obtain a detailed drug-reaction history", rationale: "Clarify the original drug, symptoms, timing, severity and later exposures before choosing an evaluation pathway or changing the record.", claimIds: allergy },
  { slug: "skin", label: "Schedule penicillin skin prick testing", rationale: "Testing should follow history and risk assessment; an incompletely characterized label does not by itself select this pathway.", claimIds: [C.allergyHistory, C.allergyAssessment], timingProfileId: "timing.test.clinical_procedure" },
  { slug: "challenge", label: "Schedule a supervised oral drug challenge", rationale: "A supervised challenge can be appropriate for selected patients, but this incomplete history has not yet established suitability.", claimIds: [C.allergyHistory, C.allergyAssessment], timingProfileId: "timing.test.clinical_procedure" },
  { slug: "remove", label: "Remove penicillin from the allergy record", rationale: "The record should not be changed solely because the reaction is unclear. First characterize the history and assess the appropriate evaluation.", claimIds: allergy },
];
const hair = [C.hairLeave, C.hairClip, C.hairDepilatory, C.hairRazor];

const specs: ConceptSpec[] = [
  {
    id: "concept.variety3.penicillin-label-structured-history", displayName: "Clarify a preoperative penicillin label",
    learningObjective: "Obtain a structured reaction history before selecting testing, referral or a record change for an incompletely characterized penicillin-allergy label before ASC care.",
    educationalTier: 0, conceptType: "workup", earliestFacilityStage: 3, evidenceClaimIds: allergy,
    variants: [
      {
        slug: "allergy-childhood-label", patientName: "William Scott", artProfile: "man68", chiefComplaint: "Antibiotic allergy review",
        findings: "William is reviewing plans for an outside ambulatory operation. His chart lists penicillin allergy from childhood, but neither he nor the record identifies the symptoms, timing or severity. The team has not chosen an allergy-evaluation pathway or changed the entry. He asks what should happen first.",
        stem: "Which initial evaluation step should clarify William Scott's undocumented penicillin-allergy label before ambulatory surgery?",
        choices: allergyChoices,
        explanation: "Begin by characterizing the original reaction and subsequent drug exposures. The label alone neither confirms immune-mediated allergy nor selects a testing or delabeling pathway. Risk assessment follows the history; this case does not choose a prophylactic medicine.",
        teachingPoint: "An uncertain allergy label calls for reaction history before a testing or record-change decision.",
        evidence: { presentation: [C.allergyLabel, C.allergyHistory], stem: [C.allergyHistory], explanation: allergy, teachingPoint: [C.allergyHistory, C.allergyAssessment] },
      },
      {
        slug: "allergy-vague-reaction", patientName: "Dorothy Allen", artProfile: "woman71", chiefComplaint: "Pre-op allergy questions",
        findings: "Dorothy brings an outside ASC referral with a penicillin-allergy entry reading only 'felt unwell.' She cannot yet recall whether there was a rash, breathing difficulty, gastrointestinal upset or another reaction. No detailed prior note or subsequent-exposure history is available. She asks how to begin clarifying the entry before her operation.",
        stem: "Which first step should the clinician take to evaluate Dorothy Allen's incompletely described penicillin reaction before ASC care?",
        choices: allergyChoices,
        explanation: "Obtain a detailed history of the drug and reaction, including timing, severity and later exposures. 'Felt unwell' is insufficient to confirm allergy or determine suitability for a challenge or skin testing. Do not infer automatic label removal or a particular antibiotic from the incomplete entry.",
        teachingPoint: "Clarify symptoms and context before turning a vague penicillin label into a testing or delabeling plan.",
        evidence: { presentation: [C.allergyLabel, C.allergyHistory], stem: [C.allergyHistory], explanation: allergy, teachingPoint: [C.allergyHistory, C.allergyAssessment] },
      },
    ],
  },
  {
    id: "concept.variety3.surgical-hair-preparation", displayName: "Plan appropriate surgical hair preparation",
    learningObjective: "Leave noninterfering surgical-site hair alone and select clippers when removal is needed for a supplied non-genital ambulatory operative field.",
    educationalTier: 0, conceptType: "management", earliestFacilityStage: 3, evidenceClaimIds: hair,
    variants: [
      {
        slug: "hair-no-interference", patientName: "Frank Mitchell", artProfile: "man71", chiefComplaint: "Surgical preparation questions",
        findings: "Frank is discussing preparation for an outside ambulatory forearm procedure. The operative team confirms that the hair at this non-genital site will not interfere with the incision, preparation or dressing. He asks whether the area should be cleared simply because an operation is planned.",
        stem: "Which hair-preparation plan best fits Frank Mitchell's non-genital operative site when hair does not interfere with the procedure?",
        choices: [
          { slug: "leave", label: "Leave the operative-field hair intact", rationale: "Hair that does not interfere with the operation does not require routine removal.", claimIds: [C.hairLeave] },
          { slug: "clip", label: "Clip the operative-field hair short", rationale: "Clippers are an option when removal is needed, but the team has identified no interference requiring removal here.", claimIds: [C.hairLeave, C.hairClip] },
          { slug: "shave", label: "Shave the operative-field hair smooth", rationale: "Routine razor shaving is not the supported approach for this non-genital field, and removal is unnecessary in the supplied plan.", claimIds: [C.hairLeave, C.hairRazor] },
          { slug: "chemical", label: "Remove the operative-field hair chemically", rationale: "Although a depilatory can be a removal option when needed, no hair removal is required in this noninterfering field.", claimIds: [C.hairLeave, C.hairDepilatory] },
        ],
        explanation: "Leave the noninterfering hair intact. The operation itself is not a reason for routine hair removal. This supplied non-genital preparation question does not apply a universal rule to genital or scrotal procedures.",
        teachingPoint: "Remove surgical-site hair only when the operative plan requires it.",
        evidence: { presentation: [C.hairLeave], stem: [C.hairLeave], explanation: [C.hairLeave, C.hairRazor], teachingPoint: [C.hairLeave] },
      },
      {
        slug: "hair-clippers-needed", patientName: "Barbara Hughes", artProfile: "woman68", chiefComplaint: "Incision preparation planning",
        findings: "Barbara is reviewing preparation for an outside ambulatory abdominal procedure. Hair at the non-genital operative site interferes with the team's planned skin preparation and dressing. The team has determined that local hair removal is needed and has clippers available. She asks which method fits that plan.",
        stem: "Which available hair-preparation method should Barbara Hughes's team choose when removal is needed at a non-genital operative site?",
        choices: [
          { slug: "clip", label: "Clip the interfering hair short", rationale: "Clippers are an appropriate method when the supplied non-genital operative field requires hair removal.", claimIds: [C.hairClip] },
          { slug: "shave", label: "Shave the interfering hair smooth", rationale: "Razor shaving is avoided for routine preparation of this non-genital field when clipping is available.", claimIds: [C.hairClip, C.hairRazor] },
          { slug: "leave", label: "Leave the interfering hair intact", rationale: "The operative team has already identified interference requiring removal; leaving it intact does not meet the supplied preparation plan.", claimIds: [C.hairLeave, C.hairClip] },
          { slug: "pluck", label: "Pluck the interfering hair completely", rationale: "Plucking is not the guideline-supported method selected for this supplied field; clippers provide the appropriate offered option.", claimIds: [C.hairClip] },
        ],
        explanation: "Choose clippers for the supplied non-genital field when removal is required. A depilatory agent is another guideline-supported option. Routine razor shaving is avoided for this non-genital field.",
        teachingPoint: "When local hair removal is needed, choose an appropriate method rather than routine razor shaving.",
        evidence: { presentation: [C.hairClip], stem: [C.hairClip], explanation: hair, teachingPoint: [C.hairClip, C.hairRazor] },
      },
    ],
  },
];
export const PERIOPERATIVE_FAMILY = buildFamily(specs, labelsForClaims);
