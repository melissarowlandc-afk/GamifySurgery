import { buildFamily, type ConceptSpec } from "./batch-helpers";
import { C, labelsForClaims } from "./evidence-claims";

const excavatum = [C.excavatumAppearance, C.excavatumSymptoms, C.excavatumEvaluation, C.excavatumUncertainty];
const carinatum = [C.carinatumAppearance, C.braceOption, C.braceSelection, C.braceEvidence];
const specs: ConceptSpec[] = [
  {
    id: "concept.pediatric-clinic.symptomatic-pectus-excavatum-evaluation",
    displayName: "Evaluate symptomatic pectus excavatum",
    learningObjective: "Refer a stable adolescent with pectus excavatum and exertional symptoms for specialist evaluation before attributing the symptoms or choosing corrective treatment.",
    educationalTier: 1, conceptType: "disposition", evidenceClaimIds: excavatum,
    variants: [
      {
        slug: "sunken-chest-exercise-limits", patientName: "Amelia Scott", artProfile: "girl14", parentName: "Clare Scott", parentRelationship: "mother",
        chiefComplaint: "Breathless with exercise",
        findings: "Amelia has a longstanding inward depression of her anterior chest wall. She now becomes breathless and tires earlier during sports. She is comfortable at rest and has no acute chest pain or fainting. Amelia and her mother ask whether chest-wall treatment would improve her exercise tolerance.",
        stem: "Which referral plan best addresses Amelia Scott's pectus excavatum and new exertional symptoms?",
        choices: [
          { slug: "evaluation", label: "Refer for chest-wall and cardiopulmonary assessment", rationale: "Exertional symptoms warrant assessment of possible cardiopulmonary effects and alternative causes before selecting treatment.", claimIds: [C.excavatumSymptoms, C.excavatumEvaluation, C.excavatumUncertainty] },
          { slug: "operation", label: "Refer for immediate corrective-surgery booking", rationale: "Symptoms alone do not establish a treatment indication or a predictable functional benefit; evaluation should precede a treatment decision.", claimIds: [C.excavatumEvaluation, C.excavatumUncertainty] },
          { slug: "cosmetic", label: "Refer for a reassurance consultation on chest appearance", rationale: "A discussion confined to appearance would leave Amelia's exertional symptoms unevaluated.", claimIds: [C.excavatumSymptoms, C.excavatumEvaluation] },
          { slug: "posture", label: "Refer for a routine posture-training program", rationale: "Posture training does not replace assessment of the reported exercise limitation and possible cardiopulmonary effects.", claimIds: [C.excavatumEvaluation] },
        ],
        explanation: "Amelia's exertional symptoms deserve specialist evaluation alongside her pectus finding. Assess possible cardiopulmonary effects and other explanations before a treatment decision. The evidence does not support promising that a repair will restore her exercise tolerance.",
        teachingPoint: "Evaluate symptomatic pectus before choosing treatment or promising physiologic benefit.",
        evidence: { presentation: [C.excavatumAppearance, C.excavatumSymptoms], stem: [C.excavatumSymptoms, C.excavatumEvaluation], explanation: [C.excavatumEvaluation, C.excavatumUncertainty], teachingPoint: [C.excavatumEvaluation, C.excavatumUncertainty] },
      },
      {
        slug: "pectus-new-sports-fatigue", patientName: "Samuel Price", artProfile: "boy17", parentName: "Andrew Price", parentRelationship: "father",
        chiefComplaint: "Sports fatigue",
        findings: "Samuel has pectus excavatum with a visible inward chest-wall depression. He reports reduced stamina and breathlessness during running. He has no symptoms at rest, acute chest pain or collapse. His father wonders whether the chest shape proves why Samuel cannot keep up with teammates.",
        stem: "What is the best outpatient plan for Samuel Price's pectus excavatum and exercise limitation?",
        choices: [
          { slug: "evaluation", label: "Arrange chest-wall and cardiopulmonary specialist assessment", rationale: "The symptoms and chest-wall finding should be evaluated before assigning causation or choosing treatment.", claimIds: [C.excavatumEvaluation, C.excavatumUncertainty] },
          { slug: "operation", label: "Arrange direct operative booking for chest correction", rationale: "Direct booking bypasses evaluation and assumes a treatment indication that the scenario has not established.", claimIds: [C.excavatumEvaluation, C.excavatumUncertainty] },
          { slug: "cosmetic", label: "Arrange a consultation for reassurance about chest appearance", rationale: "Reassurance about appearance alone does not assess Samuel's exercise limitation.", claimIds: [C.excavatumSymptoms, C.excavatumEvaluation] },
          { slug: "posture", label: "Arrange a routine posture-training referral", rationale: "A posture program is not a substitute for evaluation of the reported exertional symptoms.", claimIds: [C.excavatumEvaluation] },
        ],
        explanation: "Arrange specialist assessment of Samuel's exercise limitation and possible cardiopulmonary effects before choosing treatment. Discuss that symptom causation and the functional benefit of repair require careful evaluation.",
        teachingPoint: "An anatomical pectus finding does not establish the cause of every exertional symptom.",
        evidence: { presentation: [C.excavatumAppearance, C.excavatumSymptoms], stem: [C.excavatumEvaluation], explanation: [C.excavatumEvaluation, C.excavatumUncertainty], teachingPoint: [C.excavatumUncertainty] },
      },
    ],
  },
  {
    id: "concept.pediatric-clinic.pectus-carinatum-brace-assessment",
    displayName: "Discuss brace assessment for pectus carinatum",
    learningObjective: "Offer specialist brace-suitability assessment to a young person with pectus carinatum seeking active nonsurgical care, without promising a universal regimen or outcome.",
    educationalTier: 1, conceptType: "management", evidenceClaimIds: carinatum,
    variants: [
      {
        slug: "prominent-chest-brace-question", patientName: "Daniel Green", artProfile: "boy14", parentName: "Emma Green", parentRelationship: "mother",
        chiefComplaint: "Prominent chest",
        findings: "Daniel has an outward prominence of the anterior chest wall consistent with pectus carinatum. There are no acute chest symptoms. He is bothered by the appearance and asks about active treatment that could avoid surgery. His mother supports discussing options, and Daniel is willing to learn what a brace plan would involve.",
        stem: "Which plan best addresses Daniel Green's request for nonsurgical treatment of pectus carinatum?",
        choices: [
          { slug: "brace", label: "Discuss specialist brace-suitability assessment", rationale: "Bracing is a potential option for selected young people; a specialist assessment can evaluate suitability and the demands of treatment.", claimIds: [C.braceOption, C.braceSelection] },
          { slug: "operation", label: "Discuss booking directly for corrective surgery", rationale: "Direct operative booking does not address Daniel's request to explore a nonsurgical option before deciding on treatment.", claimIds: [C.braceOption] },
          { slug: "observation", label: "Discuss observation as the treatment plan", rationale: "Observation may be a choice, but Daniel is asking for active nonsurgical treatment; brace assessment better addresses that stated goal.", claimIds: [C.braceOption, C.braceSelection] },
          { slug: "posture", label: "Discuss routine posture-training referral", rationale: "The verified nonsurgical chest-wall treatment option is bracing assessed for suitability, not substitution of a posture referral.", claimIds: [C.carinatumAppearance, C.braceOption] },
        ],
        explanation: "Discuss referral for a specialist brace assessment with Daniel and his mother. Chest-wall flexibility, willingness to follow the plan and their goals inform suitability. Expected benefits and the treatment commitment should be discussed individually because the evidence is mainly observational.",
        teachingPoint: "Pectus carinatum bracing is an individualized option assessed by specialists.",
        evidence: { presentation: [C.carinatumAppearance, C.braceOption, C.braceSelection], stem: [C.braceOption], explanation: [C.braceOption, C.braceSelection, C.braceEvidence], teachingPoint: [C.braceOption, C.braceSelection] },
      },
      {
        slug: "carinatum-nonsurgical-options", patientName: "Chloe Harris", artProfile: "girl16", parentName: "Michael Harris", parentRelationship: "father",
        chiefComplaint: "Chest shape options",
        findings: "Chloe has a stable outward anterior chest-wall prominence diagnosed as pectus carinatum. She has no chest pain or breathlessness and would like to consider active nonsurgical care. She and her father ask whether a chest brace could be suitable; she is willing to discuss the practical commitment.",
        stem: "What is the most appropriate next clinic plan for Chloe Harris's pectus carinatum treatment question?",
        choices: [
          { slug: "brace", label: "Refer for specialist brace-suitability review", rationale: "Specialist assessment can determine whether bracing is a suitable option in light of the chest-wall features and Chloe's goals.", claimIds: [C.braceOption, C.braceSelection] },
          { slug: "operation", label: "Refer directly for corrective chest-wall surgery", rationale: "A surgical booking referral bypasses the requested discussion of a potential nonsurgical option.", claimIds: [C.braceOption] },
          { slug: "observation", label: "Recommend observation as the treatment plan", rationale: "Observation remains a possible choice, but it does not answer Chloe's request to explore active nonsurgical care.", claimIds: [C.braceOption, C.braceSelection] },
          { slug: "posture", label: "Refer for a routine posture-training program", rationale: "The cited treatment assessment concerns chest-wall bracing; posture training does not replace an assessment for that option.", claimIds: [C.carinatumAppearance, C.braceOption] },
        ],
        explanation: "Offer specialist brace-suitability assessment. Chloe's goals, chest-wall characteristics and willingness to follow the plan inform the discussion. Explain that outcomes vary and the treatment regimen is individualized.",
        teachingPoint: "A brace discussion should establish suitability and expectations before a regimen is chosen.",
        evidence: { presentation: [C.carinatumAppearance, C.braceOption, C.braceSelection], stem: [C.braceOption], explanation: [C.braceOption, C.braceSelection, C.braceEvidence], teachingPoint: [C.braceSelection, C.braceEvidence] },
      },
    ],
  },
];

export const CHEST_WALL_FAMILY = buildFamily(specs, labelsForClaims);
