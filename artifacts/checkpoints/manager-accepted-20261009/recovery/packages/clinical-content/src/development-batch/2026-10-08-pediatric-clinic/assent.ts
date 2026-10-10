import { buildFamily, type ConceptSpec } from "./batch-helpers";
import { C, labelsForClaims } from "./evidence-claims";

const participation = [C.childInformation, C.childAssent, C.voluntaryDiscussion, C.consentBoundary];
const specs: ConceptSpec[] = [{
  id: "concept.pediatric-clinic.developmental-assent-discussion",
  displayName: "Include the child in a nonurgent care discussion",
  learningObjective: "Explain a nonurgent clinic plan to the child at an appropriate level, invite questions and seek developmentally appropriate assent while involving the parent.",
  educationalTier: 0, conceptType: "management", evidenceClaimIds: participation,
  variants: [
    {
      slug: "child-asks-about-examination", patientName: "Lily Walker", artProfile: "girl6", parentName: "Susan Walker", parentRelationship: "mother",
      chiefComplaint: "Examination questions",
      findings: "Lily is attending a planned nonurgent clinic review. Her mother agrees with the proposed examination, but Lily asks what will happen and looks worried. There is time to talk before beginning, and no urgent treatment decision is required.",
      stem: "Which communication approach should the clinician use before Lily Walker's nonurgent examination?",
      choices: [
        { slug: "include", label: "Explain to Lily and invite her participation", rationale: "Use language Lily can understand, invite her questions and seek developmentally appropriate agreement while keeping her mother involved.", claimIds: [C.childInformation, C.childAssent, C.voluntaryDiscussion] },
        { slug: "parent-only", label: "Explain to her mother and proceed with care", rationale: "Parental involvement does not replace an age-appropriate explanation and an opportunity for Lily to participate.", claimIds: [C.childInformation, C.childAssent] },
        { slug: "silence", label: "Treat Lily's silence as agreement and proceed", rationale: "Silence does not provide the meaningful participation sought through an explanation and an invitation for questions.", claimIds: [C.childAssent, C.voluntaryDiscussion] },
        { slug: "defer", label: "Defer discussion with Lily until she is older", rationale: "Children can be involved at a level suited to their understanding; the discussion need not wait for a fixed age.", claimIds: [C.childInformation, C.childAssent, C.consentBoundary] },
      ],
      explanation: "Explain the examination directly to Lily in terms she can understand, invite questions and seek developmentally appropriate assent with her mother involved. Ethical participation and legal consent authority are separate considerations.",
      teachingPoint: "A parent's agreement does not replace developmentally appropriate participation by the child.",
      evidence: { presentation: [C.childInformation, C.childAssent], stem: [C.childInformation, C.childAssent], explanation: participation, teachingPoint: [C.childInformation, C.childAssent] },
    },
    {
      slug: "child-wants-plan-explained", patientName: "Ruby Anderson", artProfile: "girl11", parentName: "Thomas Anderson", parentRelationship: "father",
      chiefComplaint: "Visit-plan questions",
      findings: "Ruby is here for a routine nonurgent review. Her father has done most of the talking and agrees with the proposed clinic plan. Ruby says she does not understand the plan and wants to ask questions before it goes ahead. The clinician has time for a discussion with both of them.",
      stem: "Which approach best supports Ruby Anderson's participation in the nonurgent clinic plan?",
      choices: [
        { slug: "include", label: "Explain to Ruby and invite her questions", rationale: "An explanation suited to Ruby's understanding and an invitation for her views support meaningful participation and assent.", claimIds: [C.childInformation, C.childAssent, C.voluntaryDiscussion] },
        { slug: "parent-only", label: "Confirm the plan with her father and proceed", rationale: "Confirming the parent's agreement does not address Ruby's stated lack of understanding.", claimIds: [C.childInformation, C.childAssent] },
        { slug: "silence", label: "Accept Ruby's eventual silence and proceed", rationale: "The task is to support informed participation, not to substitute silence for a chance to understand and ask questions.", claimIds: [C.childAssent, C.voluntaryDiscussion] },
        { slug: "defer", label: "Defer Ruby's involvement until she is older", rationale: "Participation should match the child's understanding rather than being postponed to a universal age cutoff.", claimIds: [C.childInformation, C.childAssent, C.consentBoundary] },
      ],
      explanation: "Include Ruby directly in the discussion, use understandable language, check what she understands and invite her views with her father involved. Seek developmentally appropriate assent. Ethical participation and legal consent authority are separate considerations.",
      teachingPoint: "Invite the child's understanding and views during a nonurgent family care discussion.",
      evidence: { presentation: [C.childInformation, C.childAssent], stem: [C.childInformation, C.childAssent], explanation: participation, teachingPoint: [C.childInformation, C.childAssent, C.voluntaryDiscussion] },
    },
  ],
}];

export const ASSENT_FAMILY = buildFamily(specs, labelsForClaims);
