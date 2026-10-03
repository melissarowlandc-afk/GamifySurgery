import { buildFamily, type FamilySpec } from "./family-builder";
import { variants } from "./spec-utils";
import { SOURCES } from "./source-catalog";

const R = "claim.php.recognition";
const B = "claim.php.block-evaluation";

const recognition = variants([
  {
    slug: "burning-groin",
    complaint: "Burning after repair",
    presentation:
      "{patientName}, a {patientAge}-year-old {patientSex}, presents with burning pain and touch sensitivity along the groin six months after an uncomplicated open inguinal repair. Examination shows no recurrent bulge, fever, drainage, or inflammatory wound finding.",
    stem: "Which clinical interpretation best fits this presentation?",
    correct: [
      "Neuropathic postoperative pain",
      "The burning quality and cutaneous sensitivity after repair support a neuropathic postoperative pattern.",
    ],
    wrong: [
      ["Recurrent postoperative hernia", "No recurrent bulge or cough impulse is described."],
      [
        "Deep postoperative infection",
        "There is no drainage, fever, collection, or inflammatory wound finding.",
      ],
      [
        "Hip-related groin pain",
        "The superficial sensory change is less consistent with pain reproduced by hip movement.",
      ],
    ],
    explanation:
      "Chronic burning pain with sensory change after groin repair supports a neuropathic postherniorrhaphy pattern after recurrence and other causes are reassessed.",
    claims: [R],
  },
  {
    slug: "activity-ache",
    complaint: "Groin pain with walking",
    presentation:
      "{patientName}, a {patientAge}-year-old {patientSex}, returns eight months after laparoscopic groin-hernia repair with a deep activity-related ache but no numbness, allodynia, swelling, or recurrent impulse.",
    stem: "Which interpretation is most appropriate?",
    correct: [
      "Nonneuropathic postoperative pain",
      "A deep activity-related ache without sensory features may reflect a nonneuropathic postoperative pattern.",
    ],
    wrong: [
      [
        "Neuropathic postoperative groin pain",
        "The presentation lacks a mapped cutaneous sensory pattern that would support a neuropathic phenotype.",
      ],
      [
        "Recurrent postoperative groin hernia",
        "There is no bulge, obstruction, irreducibility, or acute tenderness.",
      ],
      [
        "Deep postoperative groin infection",
        "There is no sinus, drainage, fever, or collection finding.",
      ],
    ],
    explanation:
      "Postherniorrhaphy pain is heterogeneous; the history and examination should characterize the pattern without forcing every case into a named neuropathy.",
    claims: [R],
  },
  {
    slug: "new-bulge",
    complaint: "Pain and new bulge",
    presentation:
      "{patientName}, a {patientAge}-year-old {patientSex}, presents one year after inguinal repair with renewed groin discomfort and a reducible cough impulse at the prior site. There is no sensory loss or burning skin pain.",
    stem: "Which diagnosis should be prioritized?",
    correct: [
      "Recurrent postoperative hernia",
      "A new reducible impulse at the repair site supports recurrence rather than isolated neuropathic pain.",
    ],
    wrong: [
      ["Neuropathic postoperative pain", "No neuropathic quality or cutaneous sensory finding is described."],
      [
        "Deep postoperative infection",
        "The examination lacks drainage, collection, and inflammatory findings.",
      ],
      ["Hip-related groin pain", "A palpable cough impulse localizes the problem to the groin repair."],
    ],
    explanation:
      "Chronic pain after repair still requires examination for recurrence and other causes; a new reducible impulse redirects the diagnosis.",
    claims: [R],
  },
  {
    slug: "sensory-map",
    complaint: "Tender repair scar",
    presentation:
      "{patientName}, a {patientAge}-year-old {patientSex}, is seen nine months after groin repair for sharp pain triggered by light clothing. Mapping shows a reproducible superficial hypersensitive zone near the scar, with no hernia impulse or wound inflammation.",
    stem: "Which finding most supports a neuropathic postoperative pattern?",
    correct: [
      "Mapped cutaneous hypersensitivity",
      "Reproducible superficial sensory change supports a neuropathic pain phenotype.",
    ],
    wrong: [
      [
        "Hip-motion-reproduced groin pain",
        "This favors a musculoskeletal source rather than mapped cutaneous neuropathic pain.",
      ],
      [
        "Reducible postoperative groin impulse",
        "That finding would support recurrent hernia rather than isolated neuropathic pain.",
      ],
      [
        "Inflammatory postoperative wound drainage",
        "That finding would support infection rather than an uncomplicated neuropathic pattern.",
      ],
    ],
    explanation:
      "Focused sensory mapping can help characterize chronic postherniorrhaphy pain while the clinician still excludes recurrence and infection.",
    claims: [R],
  },
]);

const block = variants([
  {
    slug: "focal-trigger",
    complaint: "Persistent focal groin pain",
    presentation:
      "{patientName}, a {patientAge}-year-old {patientSex}, presents with a focal reproducible tender point and cutaneous burning seven months after repair. Recurrence and infection have been excluded, and conservative care has not clarified the pain generator.",
    stem: "Which next evaluation is most appropriate?",
    correct: [
      "Refer for targeted block assessment",
      "A specialist can consider whether a targeted local-anesthetic block would add diagnostic information.",
    ],
    wrong: [
      [
        "Refer for routine hernia reoperation",
        "Pain alone does not establish recurrent hernia or an indication for repeat repair.",
      ],
      [
        "Refer for empiric infection treatment",
        "There is no evidence of infection to justify antimicrobial treatment.",
      ],
      [
        "Refer for unchanged self-management",
        "Persistent focal pain after conservative care warrants further assessment.",
      ],
    ],
    explanation:
      "Refer for tailored pain or hernia specialist assessment; a targeted block may be diagnostically useful, but response is not guaranteed.",
    claims: [B],
  },
  {
    slug: "diffuse-pain",
    complaint: "Diffuse groin soreness",
    presentation:
      "{patientName}, a {patientAge}-year-old {patientSex}, returns with broad bilateral groin soreness after repair, hip stiffness, and pain reproduced by hip motion. There is no focal trigger point or cutaneous sensory map.",
    stem: "Which plan best respects the diagnostic uncertainty?",
    correct: [
      "Reassess hip-related pain first",
      "The diffuse motion-related pattern lacks a focal target for a diagnostic nerve-block assessment.",
    ],
    wrong: [
      ["Refer for targeted block assessment", "No focal neuropathic distribution or trigger has been identified."],
      [
        "Refer for mesh-focused surgery",
        "The presentation does not establish mesh infection or mesh-mediated pain.",
      ],
      ["Refer for recurrent-hernia repair", "No recurrent defect or operative indication is described."],
    ],
    explanation:
      "A diagnostic block is selective rather than routine; the clinical pattern should first identify a plausible target.",
    claims: [R, B],
  },
  {
    slug: "block-result",
    complaint: "Review pain injection",
    presentation:
      "{patientName}, a {patientAge}-year-old {patientSex}, reviews a specialist-performed local-anesthetic block for focal postherniorrhaphy pain. The pain briefly improved, but the specialist notes that the result is one part of a broader assessment.",
    stem: "How should this result be interpreted?",
    correct: [
      "Supportive diagnostic information",
      "Temporary relief may add diagnostic information without proving one mechanism or operation.",
    ],
    wrong: [
      [
        "Evidence favoring recurrence alone",
        "Local-anesthetic relief does not demonstrate an anatomic recurrent hernia.",
      ],
      ["Evidence favoring infection alone", "A block response does not identify a prosthetic infection."],
      ["Indication for fixed surgery", "A block response does not select one required operative treatment."],
    ],
    explanation:
      "Very-low-certainty evidence supports blocks as diagnostic aids; treatment remains individualized and multidisciplinary.",
    claims: [B],
  },
  {
    slug: "negative-block",
    complaint: "Pain persists after block",
    presentation:
      "{patientName}, a {patientAge}-year-old {patientSex}, returns after a technically completed specialist block did not relieve a mapped groin pain pattern. There is still no recurrence or infection finding.",
    stem: "Which interpretation is most appropriate?",
    correct: [
      "Nonresponse is not definitive",
      "A nonresponse does not end assessment or establish a single alternative diagnosis.",
    ],
    wrong: [
      [
        "Recurrence is now established",
        "Block nonresponse does not demonstrate an anatomic recurrence.",
      ],
      [
        "Infection is now established",
        "Block nonresponse does not identify a prosthetic infection.",
      ],
      [
        "Mesh removal is now indicated",
        "A negative block does not establish an indication for mesh removal.",
      ],
    ],
    explanation:
      "Block results are interpreted within a broader specialist assessment; neither response nor nonresponse dictates one universal treatment.",
    claims: [B],
  },
]);

const spec: FamilySpec = {
  slug: "postherniorrhaphy-pain",
  label: "Postherniorrhaphy pain",
  pairing: {
    indices: [0, 1],
    updates: [
      "Focused reassessment excludes recurrence and infection and confirms a focal tender sensory distribution.",
      "Reassessment reproduces pain with hip motion and still finds no focal sensory target, recurrence, or infection.",
    ],
  },
  claims: [
    {
      id: R,
      statement:
        "Persistent pain after inguinal-hernia repair requires focused history and examination, pain mapping, and reassessment for recurrence and other causes; a compatible neuropathic distribution supports but does not alone prove a nerve mechanism.",
      sourceIds: [SOURCES.herniaSurge.id],
      category: "evaluation",
      limitation: "No single symptom proves a named nerve lesion.",
      population: "Adults with persistent pain after inguinal-hernia repair.",
    },
    {
      id: B,
      statement:
        "A specialist-performed local-anesthetic trigger-point or peripheral nerve block may add diagnostic information, but evidence is very low and no technique or response is guaranteed.",
      sourceIds: [SOURCES.herniaSurge.id],
      category: "evaluation",
      certainty: "low",
      limitation:
        "External specialist assessment only; no treatment ladder or guaranteed response.",
      population:
        "Adults with persistent focal pain after recurrence and other causes are reassessed.",
    },
  ],
  sources: [SOURCES.herniaSurge],
  concepts: [
    {
      id: "concept.postherniorrhaphy-pain.neuropathic-pattern-recognition",
      displayName: "Recognize postherniorrhaphy pain patterns",
      learningObjective:
        "Recognize a compatible neuropathic postherniorrhaphy pain pattern while reassessing recurrence and other causes.",
      stage: 0,
      educationalTier: 1,
      conceptType: "diagnosis",
      evidenceClaimIds: [R],
      variants: recognition,
    },
    {
      id: "concept.postherniorrhaphy-pain.targeted-block-specialist-evaluation",
      displayName: "Select specialist diagnostic-block evaluation",
      learningObjective:
        "Select targeted specialist block evaluation only when the chronic postherniorrhaphy pain pattern provides a plausible target.",
      stage: 0,
      educationalTier: 1,
      conceptType: "workup",
      evidenceClaimIds: [B],
      variants: block,
    },
  ],
};

export const POSTHERNIORRHAPHY_PAIN = buildFamily(spec);
