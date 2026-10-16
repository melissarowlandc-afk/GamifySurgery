import { buildFamily, type ConceptSpec } from "./batch-helpers";
import { C, labelsForClaims } from "./evidence-claims";

const ascent = [C.testisAscent, C.persistentHighTestis, C.ascentReferral];
const retractile = [C.retractileDefinition, C.retractileFollowup, C.retractileAscent, C.retractileNoOperation];
const specs: ConceptSpec[] = [
  {
    id: "concept.pediatric-clinic.acquired-testis-ascent-referral",
    displayName: "Refer suspected acquired testicular ascent",
    learningObjective: "Refer a previously scrotal testis that no longer maintains a normal scrotal position for pediatric specialist assessment.",
    educationalTier: 1, conceptType: "disposition", evidenceClaimIds: ascent,
    variants: [
      {
        slug: "previously-scrotal-testis", patientName: "Jack Wilson", artProfile: "boy10", parentName: "Rebecca Wilson", parentRelationship: "mother",
        chiefComplaint: "Testicle position",
        findings: "Earlier examination records document both testes in Jack's scrotum. His mother now reports that the right side often looks empty. After the examination is explained to Jack and his mother, the right testis is found high and cannot be maintained in the scrotum. The left testis is scrotal. Jack has no acute pain or swelling.",
        stem: "Which plan is most appropriate for Jack Wilson's newly non-scrotal right testis?",
        choices: [
          { slug: "referral", label: "Refer for pediatric urologic assessment", rationale: "Prior scrotal documentation followed by a position that cannot stay scrotal suggests acquired ascent and warrants specialist assessment.", claimIds: ascent },
          { slug: "retractile", label: "Continue routine retractile-testis observation", rationale: "This testis cannot maintain a normal scrotal position, so the reassuring true-retractile definition does not apply.", claimIds: [C.persistentHighTestis, C.retractileDefinition] },
          { slug: "discharge", label: "End further testicular-position follow-up", rationale: "Previous normal documentation does not exclude acquired ascent; the new abnormal position needs assessment.", claimIds: [C.testisAscent, C.ascentReferral] },
          { slug: "parent-monitoring", label: "Use parent-led monitoring of testicular position", rationale: "Parent observations are useful, but monitoring alone does not replace specialist assessment of the suspected acquired ascent.", claimIds: [C.ascentReferral] },
        ],
        explanation: "A testis can ascend after earlier normal scrotal examinations. Jack's right testis no longer maintains a normal scrotal position, so arrange pediatric urologic or surgical assessment for suspected acquired ascent.",
        teachingPoint: "Earlier scrotal documentation does not rule out acquired testicular ascent.",
        evidence: { presentation: [C.testisAscent, C.persistentHighTestis, C.childInformation], stem: [C.persistentHighTestis], explanation: ascent, teachingPoint: [C.testisAscent] },
      },
      {
        slug: "testis-no-longer-stays-down", patientName: "Henry Adams", artProfile: "boy12", parentName: "Peter Adams", parentRelationship: "father",
        chiefComplaint: "High testicle",
        findings: "Henry's childhood records describe both testes as scrotal. At a recent visit the left testis was higher, and it remains high on today's relaxed examination. Henry and his father receive an explanation before the examination. The left testis returns to the higher position when released instead of remaining in the scrotum. There is no acute scrotal pain or swelling.",
        stem: "What is the best clinic disposition for Henry Adams's suspected acquired left testicular ascent?",
        choices: [
          { slug: "referral", label: "Arrange pediatric urology or surgery assessment", rationale: "A previously scrotal testis that no longer stays in the scrotum warrants specialist assessment for acquired ascent.", claimIds: ascent },
          { slug: "retractile", label: "Continue observation as a true retractile testis", rationale: "Immediate return to a higher position does not meet the definition requiring the testis to remain scrotal after release.", claimIds: [C.persistentHighTestis, C.retractileDefinition] },
          { slug: "discharge", label: "Discharge from routine testicular-position follow-up", rationale: "The new position still needs assessment despite earlier normal findings.", claimIds: [C.testisAscent, C.ascentReferral] },
          { slug: "parent-monitoring", label: "Use parent-led monitoring of testicular position", rationale: "A newly persistent high position warrants specialist assessment; parent monitoring alone leaves that clinical change unassessed.", claimIds: [C.ascentReferral] },
        ],
        explanation: "Henry's history and examination raise concern for acquired ascent. Refer for pediatric urologic or surgical assessment. A previously normal examination is not a reason to disregard the new finding, and the true-retractile surveillance rule does not apply to a testis that cannot remain scrotal.",
        teachingPoint: "Distinguish a testis that remains scrotal after release from one that no longer stays down.",
        evidence: { presentation: [C.testisAscent, C.persistentHighTestis, C.childInformation], stem: [C.testisAscent, C.ascentReferral], explanation: ascent, teachingPoint: [C.persistentHighTestis, C.retractileDefinition] },
      },
    ],
  },
  {
    id: "concept.pediatric-clinic.true-retractile-testis-surveillance",
    displayName: "Follow a true retractile testis",
    learningObjective: "Choose documented position surveillance for a true retractile testis and reassess or refer if it acquires a persistently higher position.",
    educationalTier: 1, conceptType: "management", evidenceClaimIds: retractile,
    variants: [
      {
        slug: "retractile-testis-remains-scrotal", patientName: "Ben Foster", artProfile: "boy6", parentName: "Laura Foster", parentRelationship: "mother",
        chiefComplaint: "Moving testicle",
        findings: "Ben's mother sometimes notices that his right testis sits higher, especially when he is tense. The examination is explained to them. In a relaxed setting, the testis can be brought into the normal scrotal position without tension and remains there after release. Ben has no pain or swelling.",
        stem: "Which management plan is most appropriate for Ben Foster's true retractile testis?",
        choices: [
          { slug: "followup", label: "Arrange documented testicular-position follow-up", rationale: "The examination meets the true-retractile definition; documented surveillance can identify a later change in position.", claimIds: [C.retractileDefinition, C.retractileFollowup, C.retractileAscent] },
          { slug: "operation", label: "Arrange immediate orchidopexy planning", rationale: "Operative planning is not recommended for the explicitly defined true-retractile examination pattern.", claimIds: [C.retractileDefinition, C.retractileNoOperation] },
          { slug: "discharge", label: "End routine testicular-position surveillance", rationale: "A true retractile testis still needs position follow-up to detect acquired ascent.", claimIds: [C.retractileFollowup, C.retractileAscent] },
          { slug: "parent-monitoring", label: "Continue parent-led testicular-position monitoring", rationale: "Parent observations can help, but the cited follow-up plan includes documented clinical position examinations.", claimIds: [C.retractileFollowup] },
        ],
        explanation: "Ben's testis stays in the normal scrotal position after gentle placement without tension, meeting the true-retractile definition. Arrange documented follow-up examinations, with reassessment or referral if the testis later fails to remain scrotal. This narrow phenotype does not call for immediate operative planning.",
        teachingPoint: "A true retractile testis needs surveillance, with referral if acquired ascent develops.",
        evidence: { presentation: [C.retractileDefinition, C.childInformation], stem: [C.retractileDefinition], explanation: retractile, teachingPoint: [C.retractileFollowup, C.retractileAscent] },
      },
      {
        slug: "intermittent-retraction-followup", patientName: "Leo Mitchell", artProfile: "boy5", parentName: "David Mitchell", parentRelationship: "father",
        chiefComplaint: "Testicle comes and goes",
        findings: "Leo's father reports that the left testis looks higher when Leo is anxious but is visible in the scrotum when he is relaxed. After an explanation to Leo and his father, examination confirms that the testis can be positioned in the scrotum without tension and remains there after release. There is no pain, swelling or persistently high position.",
        stem: "What follow-up plan best fits Leo Mitchell's clinically confirmed true retractile testis?",
        choices: [
          { slug: "followup", label: "Continue documented testicular-position examinations", rationale: "Position surveillance is appropriate for a true retractile testis and can identify later ascent.", claimIds: [C.retractileFollowup, C.retractileAscent] },
          { slug: "operation", label: "Refer for routine orchidopexy planning", rationale: "A testis that remains scrotal after release meets the true-retractile definition rather than an operative indication in the cited guideline.", claimIds: [C.retractileDefinition, C.retractileNoOperation] },
          { slug: "discharge", label: "Stop further examinations of testicular position", rationale: "Normal positioning today does not eliminate the need to check for acquired ascent during follow-up.", claimIds: [C.retractileFollowup, C.retractileAscent] },
          { slug: "parent-monitoring", label: "Continue parent-led monitoring of testicular position", rationale: "Parent observations should not substitute for the documented clinical examinations used to detect a change in position.", claimIds: [C.retractileFollowup, C.retractileAscent] },
        ],
        explanation: "Leo's examination supports a true retractile testis. Continue documented position examinations and refer if a future examination identifies acquired ascent.",
        teachingPoint: "The ability to remain scrotal after release supports surveillance rather than immediate operation.",
        evidence: { presentation: [C.retractileDefinition, C.childInformation], stem: [C.retractileDefinition], explanation: [C.retractileFollowup, C.retractileAscent], teachingPoint: [C.retractileDefinition, C.retractileNoOperation] },
      },
    ],
  },
];

export const TESTIS_FAMILY = buildFamily(specs, labelsForClaims);
