import { buildFamily, type ConceptSpec } from "./batch-helpers";
import { labelsForClaims } from "./evidence-claims";

export const ASSENT_CLINICAL_ANCHOR_KEYS = ["child-groin", "child-node"] as const;

// Wording revision: 2026-10-16, round 3 revision 1 diverse clinical anchors. Constrained child and parent identities retained.
const specs: ConceptSpec[] = [
  {
    "id": "concept.pediatric-clinic.developmental-assent-discussion",
    "displayName": "Include the child in a nonurgent care discussion",
    "learningObjective": "Explain a nonurgent clinic plan to the child at an appropriate level, invite questions and seek developmentally appropriate assent while involving the parent.",
    "educationalTier": 0,
    "conceptType": "management",
    "evidenceClaimIds": [
      "claim.pediatric-clinic.developmentally-appropriate-information",
      "claim.pediatric-clinic.invite-child-participation-and-assent",
      "claim.pediatric-clinic.noncoercive-child-discussion",
      "claim.pediatric-clinic.assent-legal-consent-boundary"
    ],
    "variants": [
      {
        "slug": "child-asks-about-examination",
        "patientName": "Lily Walker",
        "artProfile": "girl6",
        "parentName": "Susan Walker",
        "parentRelationship": "mother",
        "chiefComplaint": "Groin-examination questions",
        "findings": "An intermittent groin bulge prompts nonurgent hernia assessment. Lily asks what the examination involves. 'Mum has already answered, but she hasn't done the examining,' she says. Susan agrees; there is time to explain.",
        "stem": "Which communication approach should be used before Lily Walker's nonurgent groin examination when her mother agrees but Lily has questions?",
        "choices": [
          {
            "slug": "include",
            "label": "Explain to Lily and invite her participation",
            "rationale": "Lily has questions before a nonurgent examination. Explain in terms she can understand and invite her participation, while keeping Susan involved rather than treating her agreement as the whole discussion.",
            "claimIds": [
              "claim.pediatric-clinic.developmentally-appropriate-information",
              "claim.pediatric-clinic.invite-child-participation-and-assent",
              "claim.pediatric-clinic.noncoercive-child-discussion"
            ]
          },
          {
            "slug": "parent-only",
            "label": "Explain to Susan and begin the examination",
            "rationale": "Susan's agreement does not answer Lily's questions or provide the child's own developmentally appropriate participation before this nonurgent examination.",
            "claimIds": [
              "claim.pediatric-clinic.developmentally-appropriate-information",
              "claim.pediatric-clinic.invite-child-participation-and-assent"
            ]
          },
          {
            "slug": "silence",
            "label": "Accept Lily's silence and begin the examination",
            "rationale": "Silence does not establish meaningful participation. Lily has asked what will happen and needs an understandable explanation and an opportunity for questions.",
            "claimIds": [
              "claim.pediatric-clinic.invite-child-participation-and-assent",
              "claim.pediatric-clinic.noncoercive-child-discussion"
            ]
          },
          {
            "slug": "defer",
            "label": "Postpone Lily's involvement until she is older",
            "rationale": "Participation can match Lily's present understanding. A universal older-age requirement would postpone the explanation and invitation this nonurgent visit permits.",
            "claimIds": [
              "claim.pediatric-clinic.developmentally-appropriate-information",
              "claim.pediatric-clinic.invite-child-participation-and-assent",
              "claim.pediatric-clinic.assent-legal-consent-boundary"
            ]
          }
        ],
        "explanation": "Explain the examination directly to Lily, invite questions, and seek developmentally appropriate assent with her mother involved. Her participation and legal consent authority are separate considerations.",
        "teachingPoint": "Assent means inviting the child's developmentally appropriate participation, not treating a parent's agreement as the end of discussion. Explain the examination in language Lily can understand, invite questions, and seek her participation with Susan involved. Remember to include the child directly. This ethical approach does not establish a universal rule about legal consent authority.",
        "evidence": {
          "presentation": [
            "claim.pediatric-clinic.developmentally-appropriate-information",
            "claim.pediatric-clinic.invite-child-participation-and-assent",
            "claim.pediatric-clinic.dynamic-groin-bulge",
            "claim.pediatric-clinic.clinical-groin-hernia-referral"
          ],
          "stem": [
            "claim.pediatric-clinic.developmentally-appropriate-information",
            "claim.pediatric-clinic.invite-child-participation-and-assent"
          ],
          "explanation": [
            "claim.pediatric-clinic.developmentally-appropriate-information",
            "claim.pediatric-clinic.invite-child-participation-and-assent",
            "claim.pediatric-clinic.noncoercive-child-discussion",
            "claim.pediatric-clinic.assent-legal-consent-boundary"
          ],
          "teachingPoint": [
            "claim.pediatric-clinic.developmentally-appropriate-information",
            "claim.pediatric-clinic.invite-child-participation-and-assent",
            "claim.pediatric-clinic.noncoercive-child-discussion",
            "claim.pediatric-clinic.assent-legal-consent-boundary"
          ]
        }
      },
      {
        "slug": "child-wants-plan-explained",
        "patientName": "Ruby Anderson",
        "artProfile": "girl11",
        "parentName": "Thomas Anderson",
        "parentRelationship": "father",
        "chiefComplaint": "Neck-node plan questions",
        "findings": "Ruby is well with small mobile reactive cervical nodes and no concerning findings. At this nonurgent visit, she asks what observation means and wants the plan explained to her. Thomas asks whether his agreement is enough.",
        "stem": "Which communication approach should be used for Ruby Anderson's nonurgent neck-node observation plan when her father agrees but she wants the plan explained?",
        "choices": [
          {
            "slug": "include",
            "label": "Explain to Ruby and invite her questions",
            "rationale": "Ruby explicitly says she does not understand. Address her directly with an appropriate explanation and invitation for questions and assent, while retaining her father's involvement.",
            "claimIds": [
              "claim.pediatric-clinic.developmentally-appropriate-information",
              "claim.pediatric-clinic.invite-child-participation-and-assent",
              "claim.pediatric-clinic.noncoercive-child-discussion"
            ]
          },
          {
            "slug": "parent-only",
            "label": "Confirm with Thomas and begin the clinic plan",
            "rationale": "Thomas's agreement does not resolve Ruby's stated lack of understanding. Confirming only his view leaves the child's own participation unanswered.",
            "claimIds": [
              "claim.pediatric-clinic.developmentally-appropriate-information",
              "claim.pediatric-clinic.invite-child-participation-and-assent"
            ]
          },
          {
            "slug": "silence",
            "label": "Accept Ruby's silence and begin the clinic plan",
            "rationale": "Eventual silence does not establish understanding. The response should give Ruby a meaningful opportunity to understand the plan and express questions or views.",
            "claimIds": [
              "claim.pediatric-clinic.invite-child-participation-and-assent",
              "claim.pediatric-clinic.noncoercive-child-discussion"
            ]
          },
          {
            "slug": "defer",
            "label": "Postpone Ruby's involvement until she is older",
            "rationale": "Participation should match Ruby's understanding now. Deferring all involvement to a fixed older age bypasses the understandable discussion she is requesting.",
            "claimIds": [
              "claim.pediatric-clinic.developmentally-appropriate-information",
              "claim.pediatric-clinic.invite-child-participation-and-assent",
              "claim.pediatric-clinic.assent-legal-consent-boundary"
            ]
          }
        ],
        "explanation": "Include Ruby directly, explain the plan understandably, and invite questions and developmentally appropriate assent with her father involved. Her ethical participation and legal consent authority remain separate considerations.",
        "teachingPoint": "A child's voice can be missed even when a parent is engaged and supportive. Explain the plan directly to Ruby, check understanding, and invite her questions and developmentally appropriate assent with Thomas involved. Remember that parental agreement and child participation address different needs. This ethical participation does not settle jurisdiction-specific legal consent authority.",
        "evidence": {
          "presentation": [
            "claim.pediatric-clinic.developmentally-appropriate-information",
            "claim.pediatric-clinic.invite-child-participation-and-assent",
            "claim.pediatric-clinic.reactive-child-neck-nodes",
            "claim.pediatric-clinic.well-child-node-observation"
          ],
          "stem": [
            "claim.pediatric-clinic.developmentally-appropriate-information",
            "claim.pediatric-clinic.invite-child-participation-and-assent"
          ],
          "explanation": [
            "claim.pediatric-clinic.developmentally-appropriate-information",
            "claim.pediatric-clinic.invite-child-participation-and-assent",
            "claim.pediatric-clinic.noncoercive-child-discussion",
            "claim.pediatric-clinic.assent-legal-consent-boundary"
          ],
          "teachingPoint": [
            "claim.pediatric-clinic.developmentally-appropriate-information",
            "claim.pediatric-clinic.invite-child-participation-and-assent",
            "claim.pediatric-clinic.noncoercive-child-discussion",
            "claim.pediatric-clinic.assent-legal-consent-boundary"
          ]
        }
      }
    ]
  }
];

export const ASSENT_FAMILY = buildFamily(specs, labelsForClaims);
