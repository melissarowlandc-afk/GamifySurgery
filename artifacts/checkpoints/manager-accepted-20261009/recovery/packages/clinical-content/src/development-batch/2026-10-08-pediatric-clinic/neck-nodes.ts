import { buildFamily, type ConceptSpec } from "./batch-helpers";
import { C, labelsForClaims } from "./evidence-claims";

const observation = [C.reactiveNodes, C.nodeObservation, C.nodeSafetyNet];
const systemicFindings = [C.nodeFever, C.nodeWeightLoss, C.nodeNightSweats];
const referral = [C.supraclavicular, C.growingNode, C.nodeReferral];

const specs: ConceptSpec[] = [
  {
    id: "concept.pediatric-clinic.reactive-neck-node-observation",
    displayName: "Observe uncomplicated childhood neck nodes",
    learningObjective: "Choose observation with reassurance and safety-net advice for a well child with small mobile cervical nodes and no concerning findings.",
    educationalTier: 0, conceptType: "management", evidenceClaimIds: [...observation, ...systemicFindings],
    variants: [
      {
        slug: "neck-nodes-after-cold", patientName: "Mia Carter", artProfile: "girl7", parentName: "Anne Carter", parentRelationship: "mother",
        chiefComplaint: "Neck lumps",
        findings: "Mia's mother noticed small lumps on both sides of her neck during a recent cold. Mia has recovered and is playing and eating normally. Examination finds small mobile cervical nodes without overlying inflammation or supraclavicular enlargement. There is no ongoing fever, weight loss, night sweating or node growth.",
        stem: "Which plan best addresses Mia Carter's small mobile cervical nodes after her viral illness?",
        choices: [
          { slug: "observe", label: "Observe with follow-up and return precautions", rationale: "A well child with this uncomplicated pattern can be observed; the family should know when changing nodes or new symptoms require reassessment.", claimIds: observation },
          { slug: "urgent-referral", label: "Refer for urgent pediatric specialist assessment", rationale: "The described pattern lacks the concerning findings that support early specialist assessment in the cited pathway.", claimIds: [C.nodeObservation, C.nodeReferral] },
          { slug: "routine-ent", label: "Refer for routine pediatric ENT assessment", rationale: "The cited pathway supports initial observation in this uncomplicated profile; routine specialist referral is not the most appropriate first plan.", claimIds: [C.nodeObservation] },
          { slug: "discharge", label: "Discharge without follow-up or return precautions", rationale: "Reassurance should include safety-net advice rather than ending reassessment if the pattern changes.", claimIds: [C.nodeObservation, C.nodeSafetyNet] },
        ],
        explanation: "Mia's small mobile nodes and recovery from a viral illness fit a reactive pattern. Reassure her and her mother, document the findings and provide follow-up and return advice for enlargement or new systemic symptoms.",
        teachingPoint: "Observation of uncomplicated childhood neck nodes includes a safety net for change.",
        evidence: { presentation: [C.reactiveNodes, C.nodeObservation, C.supraclavicular, C.nodeSafetyNet, ...systemicFindings], stem: [C.reactiveNodes, C.nodeObservation], explanation: observation, teachingPoint: [C.nodeObservation, C.nodeSafetyNet] },
      },
      {
        slug: "shrinking-mobile-neck-nodes", patientName: "Ethan Brooks", artProfile: "boy12", parentName: "Paul Brooks", parentRelationship: "father",
        chiefComplaint: "Persistent neck bumps",
        findings: "Ethan's father can still feel small neck nodes after Ethan recovered from a respiratory illness. The nodes have become less noticeable. Ethan feels well, and the nodes are mobile without skin change or supraclavicular enlargement. There is no node growth, unexplained fever, weight loss or night sweating.",
        stem: "What is the most appropriate clinic plan for Ethan Brooks's improving cervical-node findings?",
        choices: [
          { slug: "observe", label: "Continue observation with a reassessment plan", rationale: "The improving, uncomplicated node pattern in a well child supports observation with clear instructions to return if it changes.", claimIds: observation },
          { slug: "urgent-referral", label: "Arrange urgent pediatric oncology assessment", rationale: "No concerning feature is described to justify an urgent oncology pathway instead of initial observation.", claimIds: [C.nodeObservation, C.nodeReferral] },
          { slug: "routine-ent", label: "Arrange routine pediatric ENT assessment", rationale: "These improving small mobile nodes in a well child support initial observation rather than routine specialist referral.", claimIds: [C.nodeObservation] },
          { slug: "discharge", label: "End follow-up without reassessment instructions", rationale: "An observation plan should retain instructions for enlargement or new systemic symptoms.", claimIds: [C.nodeSafetyNet] },
        ],
        explanation: "Ethan's improving pattern of small mobile nodes after illness can be observed while he is well. Give Ethan and his father a reassessment plan, including return advice for node growth or new systemic symptoms.",
        teachingPoint: "Use the child's overall condition and node pattern to guide observation and reassessment.",
        evidence: { presentation: [C.reactiveNodes, C.nodeObservation, C.nodeSafetyNet, C.supraclavicular, ...systemicFindings], stem: [C.nodeObservation], explanation: observation, teachingPoint: [C.nodeObservation, C.nodeSafetyNet] },
      },
    ],
  },
  {
    id: "concept.pediatric-clinic.concerning-neck-node-referral",
    displayName: "Refer concerning childhood neck nodes",
    learningObjective: "Arrange early pediatric assessment of a concerning cervical-node pattern without assigning a cancer diagnosis from a red flag alone.",
    educationalTier: 1, conceptType: "disposition", evidenceClaimIds: [...referral, C.nodeSkinTether],
    variants: [
      {
        slug: "supraclavicular-neck-lump", patientName: "Grace Turner", artProfile: "girl11", parentName: "James Turner", parentRelationship: "father",
        chiefComplaint: "Low neck lump",
        findings: "Grace and her father report an enlarging lump above her left collarbone. Examination identifies a firm supraclavicular node. She has no recent respiratory illness, overlying skin infection, breathing difficulty or swallowing difficulty.",
        stem: "Which disposition is most appropriate for Grace Turner's enlarging supraclavicular node?",
        choices: [
          { slug: "assessment", label: "Arrange prompt pediatric specialist assessment", rationale: "Supraclavicular location and growth are concerning findings that merit early pediatric assessment.", claimIds: referral },
          { slug: "observe", label: "Continue routine reactive neck-node observation", rationale: "The growing supraclavicular finding does not match the uncomplicated reactive-node profile used for routine observation.", claimIds: [C.supraclavicular, C.growingNode, C.nodeObservation] },
          { slug: "routine-ent", label: "Arrange routine pediatric ENT follow-up", rationale: "The growing supraclavicular finding requires early assessment through the concerning-node pathway; routine follow-up would not address that urgency.", claimIds: [C.supraclavicular, C.growingNode, C.nodeReferral] },
          { slug: "discharge", label: "Discharge from further neck-node review", rationale: "Ending evaluation would leave the concerning location and growth unassessed.", claimIds: [C.supraclavicular, C.growingNode, C.nodeReferral] },
        ],
        explanation: "Grace's growing supraclavicular node warrants early pediatric assessment. Explain the concerning location and change to Grace and her father. The cause remains uncertain and requires further evaluation.",
        teachingPoint: "A concerning node pattern calls for pediatric assessment while its cause remains uncertain.",
        acuity: "urgent_stable",
        evidence: { presentation: [C.supraclavicular, C.growingNode], stem: [C.supraclavicular, C.nodeReferral], explanation: referral, teachingPoint: [C.nodeReferral] },
      },
      {
        slug: "growing-firm-neck-node", patientName: "Lucas Ellis", artProfile: "boy14", parentName: "Sarah Ellis", parentRelationship: "mother",
        chiefComplaint: "Growing neck lump",
        findings: "Lucas's mother reports that a neck lump is becoming more prominent rather than resolving. Examination finds a firm cervical node tethered to the overlying skin. There is no recent cold or inflammatory skin lesion. Lucas is comfortable at rest and has no airway or swallowing symptoms.",
        stem: "What is the best outpatient disposition for Lucas Ellis's growing firm cervical node?",
        choices: [
          { slug: "assessment", label: "Refer for prompt pediatric specialist assessment", rationale: "Growth and an abnormal firm-node examination merit early assessment rather than uncomplicated reactive-node observation.", claimIds: [C.growingNode, C.nodeReferral] },
          { slug: "observe", label: "Follow as uncomplicated viral lymphadenopathy", rationale: "The described progressive, firm finding does not match the reassuring small mobile-node profile.", claimIds: [C.growingNode, C.nodeObservation] },
          { slug: "routine-ent", label: "Arrange routine pediatric ENT follow-up", rationale: "The progressive abnormal-node pattern warrants early pediatric assessment rather than a routine follow-up pathway.", claimIds: [C.growingNode, C.nodeReferral] },
          { slug: "discharge", label: "Discharge from further cervical-node surveillance", rationale: "The concerning change still requires assessment even though Lucas has no acute airway symptoms.", claimIds: [C.growingNode, C.nodeReferral] },
        ],
        explanation: "Lucas's growing lump and abnormal firm-node examination warrant early pediatric assessment, even though he is comfortable at rest. The cause remains uncertain and requires further evaluation.",
        teachingPoint: "Progressive abnormal nodes merit assessment; a stable clinic presentation does not remove that need.",
        acuity: "urgent_stable",
        evidence: { presentation: [C.growingNode, C.nodeSkinTether], stem: [C.growingNode, C.nodeReferral], explanation: [C.growingNode, C.nodeReferral], teachingPoint: [C.growingNode, C.nodeReferral] },
      },
    ],
  },
];

export const NECK_NODE_FAMILY = buildFamily(specs, labelsForClaims);
