import { buildFamily, type ConceptSpec, type VariantSpec } from "./batch-helpers";
import { C, labelsForClaims } from "./evidence-claims";

const diastasis = [C.diastasisDefinition, C.diastasisDoming, C.diastasisAssessment, C.herniaDistinction];
const diastasisChoices: VariantSpec["choices"] = [
  { slug: "separation", label: "Rectus diastasis", rationale: "Broad midline doming with separated rectus edges and no identified focal defect best fits rectus diastasis.", claimIds: diastasis },
  { slug: "epigastric", label: "Epigastric hernia", rationale: "The supplied examination describes broad separation rather than an identified focal epigastric protrusion through a defect.", claimIds: [C.diastasisDefinition, C.herniaDistinction] },
  { slug: "incisional", label: "Incisional hernia", rationale: "No operative scar or focal defect is supplied; the positive finding is a broad separation pattern.", claimIds: [C.diastasisDefinition, C.herniaDistinction] },
  { slug: "umbilical", label: "Umbilical hernia", rationale: "An isolated umbilical defect is not identified. Rectus separation best explains the broad ridge in this examination.", claimIds: [C.diastasisDefinition, C.herniaDistinction] },
];
const cyst = [C.cystPattern, C.cystDifferential, C.cystInflammation];
const cystChoices: VariantSpec["choices"] = [
  { slug: "epidermoid", label: "Epidermoid cyst", rationale: "Slow growth and a central punctum are a useful epidermoid-cyst pattern; this remains a clinical best-fit diagnosis.", claimIds: [C.cystPattern, C.cystDifferential] },
  { slug: "lipoma", label: "Subcutaneous lipoma", rationale: "The punctum-bearing skin lesion fits an epidermoid cyst better than the proposed lipomatous mass.", claimIds: [C.cystPattern, C.cystDifferential] },
  { slug: "pilar", label: "Trichilemmal cyst", rationale: "The described central punctum favors an epidermoid cyst over this other cutaneous-cyst diagnosis.", claimIds: [C.cystDifferential] },
  { slug: "abscess", label: "Cutaneous abscess", rationale: "No painful inflamed collection is described. A cyst with a punctum best fits the supplied slowly growing, nontender lump.", claimIds: [C.cystPattern, C.cystInflammation] },
];
const hemorrhoid = [C.externalClot, C.externalPain, C.internalLocation, C.analAssessment];
const hemorrhoidChoices: VariantSpec["choices"] = [
  { slug: "external", label: "Thrombosed external hemorrhoid", rationale: "The clot-filled tender lump lies beneath external anal skin, which identifies the external thrombosis pattern.", claimIds: [C.externalClot, C.externalPain] },
  { slug: "internal", label: "Prolapsing internal hemorrhoid", rationale: "The supplied lesion is under external skin, without protruding mucosal tissue from the anal canal.", claimIds: [C.externalClot, C.internalLocation] },
  { slug: "abscess", label: "Acute perianal abscess", rationale: "The examination identifies a clot-filled external lump rather than a draining collection. The external thrombosis is the best fit.", claimIds: [C.externalClot, C.externalPain, C.analAssessment] },
  { slug: "fissure", label: "Acute anal fissure", rationale: "No linear tear is seen. The positive finding is the examined external clot-filled lump.", claimIds: [C.externalClot, C.externalPain, C.analAssessment] },
];
const itch = [C.itchIrritation, C.itchCare, C.itchAvoid, C.itchReassess];
const itchChoices: VariantSpec["choices"] = [
  { slug: "gentle", label: "Rinse gently and dry by patting", rationale: "Gentle water cleansing and patting dry reduce further irritation after the supplied assessment.", claimIds: [C.itchCare, C.itchAvoid] },
  { slug: "powder", label: "Scrub firmly and apply scented powder", rationale: "Scrubbing and scented products can aggravate the irritation being addressed.", claimIds: [C.itchIrritation, C.itchAvoid] },
  { slug: "wipes", label: "Rub briskly and use fragranced wipes", rationale: "Repeated rubbing and fragrance continue the irritant exposure rather than addressing it.", claimIds: [C.itchIrritation, C.itchAvoid] },
  { slug: "soap", label: "Wash vigorously and use medicated soap", rationale: "Vigorous cleaning and irritating products are not the basic gentle-care approach supported for this presentation.", claimIds: [C.itchIrritation, C.itchCare, C.itchAvoid] },
];

const specs: ConceptSpec[] = [
  {
    id: "concept.variety3.rectus-diastasis-recognition", displayName: "Recognize rectus diastasis",
    learningObjective: "Distinguish a supplied broad rectus-separation pattern from a focal abdominal-wall hernia without assuming that the conditions cannot coexist.",
    educationalTier: 0, conceptType: "diagnosis", earliestFacilityStage: 1, evidenceClaimIds: diastasis,
    variants: [
      {
        slug: "diastasis-head-lift", patientName: "Daniel Brooks", artProfile: "man32", chiefComplaint: "Midline abdominal bulge",
        findings: "Daniel notices a long ridge in the middle of his abdomen when sitting up. During a head lift, a broad dome appears between the rectus muscles. The examiner can feel separated muscle edges but identifies no focal fascial defect or localized protrusion. There is no abdominal operative scar.",
        stem: "Which abdominal-wall diagnosis best explains Daniel Brooks's broad midline doming and separated rectus edges?",
        choices: diastasisChoices,
        explanation: "The broad separation pattern best fits rectus diastasis. It differs from protrusion through a focal abdominal-wall defect. This supplied examination supports recognition; it does not establish that every coexisting hernia has been excluded.",
        teachingPoint: "Broad midline rectus separation is a different finding from a focal hernia defect.",
        evidence: { presentation: diastasis, stem: diastasis, explanation: diastasis, teachingPoint: [C.diastasisDefinition, C.herniaDistinction] },
      },
      {
        slug: "diastasis-ridge-review", patientName: "Laura Bennett", artProfile: "woman48", chiefComplaint: "Abdominal contour change",
        findings: "Laura asks about a ridge that appears along the abdominal midline when she raises her shoulders from the examination couch. It extends across a broad area above and below the umbilicus. Examination finds separated rectus edges without a discrete umbilical or epigastric defect. She has no abdominal surgical scar.",
        stem: "Which diagnosis best fits Laura Bennett's broad rectus separation without an identified focal abdominal-wall defect?",
        choices: diastasisChoices,
        explanation: "Rectus diastasis describes the supplied widened midline between the rectus muscles. The broad dome is not the same finding as a focal hernia protrusion. A separate suspected hernia would still need its own assessment.",
        teachingPoint: "Identify rectus separation without treating every midline ridge as a focal hernia.",
        evidence: { presentation: diastasis, stem: diastasis, explanation: diastasis, teachingPoint: [C.diastasisDefinition, C.herniaDistinction] },
      },
    ],
  },
  {
    id: "concept.variety3.epidermoid-cyst-recognition", displayName: "Recognize an epidermoid cyst",
    learningObjective: "Select epidermoid cyst as the best clinical fit for a slowly growing cutaneous lump with a central punctum, without claiming histologic certainty.",
    educationalTier: 0, conceptType: "diagnosis", earliestFacilityStage: 1, evidenceClaimIds: cyst,
    variants: [
      {
        slug: "epidermoid-upper-back", patientName: "Robert Lewis", artProfile: "man42", chiefComplaint: "Back lump",
        findings: "Robert has a slowly enlarging rounded lump in the skin of his upper back. It is nontender, and a small central punctum is visible. There is no surrounding redness or active drainage. He asks what the examination most likely represents before discussing any treatment.",
        stem: "Which diagnosis best fits Robert Lewis's slowly enlarging upper-back skin lump with a central punctum?",
        choices: cystChoices,
        explanation: "An epidermoid cyst is the best fit for this slow-growing punctum-bearing lesion. The task is clinical recognition, not proof of histology or a decision that every cyst requires removal.",
        teachingPoint: "A central punctum is a useful clue to an epidermoid cyst, interpreted with the rest of the examination.",
        evidence: { presentation: cyst, stem: [C.cystPattern], explanation: [C.cystPattern, C.cystDifferential], teachingPoint: [C.cystPattern, C.cystDifferential] },
      },
      {
        slug: "epidermoid-shoulder", patientName: "Helen Carter", artProfile: "woman60", chiefComplaint: "Shoulder skin lump",
        findings: "Helen brings a painless lump over the posterior shoulder for assessment. It has enlarged gradually and remains centered in the skin, with a visible central pore. The examiner finds no redness, tenderness or draining collection. Helen wants to understand the likely diagnosis.",
        stem: "Which diagnosis best matches Helen Carter's gradually enlarging shoulder skin lump with a central pore?",
        choices: cystChoices,
        explanation: "The gradual growth and central punctum favor an epidermoid cyst. These are descriptive clinical clues; the answer is a best-fit diagnosis rather than histologic confirmation.",
        teachingPoint: "Use the punctum-bearing skin-lump pattern for recognition without presenting it as histologic confirmation.",
        evidence: { presentation: cyst, stem: [C.cystPattern], explanation: [C.cystPattern, C.cystDifferential], teachingPoint: [C.cystPattern, C.cystDifferential] },
      },
    ],
  },
  {
    id: "concept.variety3.thrombosed-external-hemorrhoid-recognition", displayName: "Recognize an external hemorrhoid clot",
    learningObjective: "Identify a clot-filled painful external anal-margin lump as a thrombosed external hemorrhoid rather than internal prolapse or another proposed anal lesion.",
    educationalTier: 0, conceptType: "diagnosis", earliestFacilityStage: 1, evidenceClaimIds: hemorrhoid,
    variants: [
      {
        slug: "external-clot-sudden-lump", patientName: "Michael Grant", artProfile: "man46", chiefComplaint: "Painful anal lump", acuity: "urgent_stable",
        findings: "Michael reports sudden pain from a new lump at the anal opening. Examination identifies a tense, tender, clot-filled lump beneath the external anal skin. There is no protruding mucosal tissue, visible linear tear or draining collection. He is otherwise well and asks what the examined lesion is.",
        stem: "Which diagnosis best fits Michael Grant's painful clot-filled lump beneath external anal skin?",
        choices: hemorrhoidChoices,
        explanation: "The location beneath external anal skin and the supplied clot identify a thrombosed external hemorrhoid. Pain alone would not establish the diagnosis. This question identifies the lesion and does not select a procedure or a treatment deadline.",
        teachingPoint: "Use the examined external clot and anatomic location to recognize hemorrhoid thrombosis.",
        evidence: { presentation: hemorrhoid, stem: [C.externalClot, C.externalPain], explanation: hemorrhoid, teachingPoint: [C.externalClot, C.internalLocation] },
      },
      {
        slug: "external-clot-examination", patientName: "Ellen Morgan", artProfile: "woman67", chiefComplaint: "Tender perianal swelling", acuity: "urgent_stable",
        findings: "Ellen has localized anal-margin pain and a tender swelling. The clinician examines a firm clot-filled external lump covered by anal skin. No internal mucosal prolapse, linear tear or draining collection is seen. Ellen wants the lesion named before discussing care options.",
        stem: "Which diagnosis explains Ellen Morgan's examined clot-filled external anal-margin lump?",
        choices: hemorrhoidChoices,
        explanation: "This supplied examination fits external hemorrhoid thrombosis. The clot is in an external lesion rather than protruding internal mucosa. Recognition does not by itself determine whether conservative or procedural treatment is appropriate.",
        teachingPoint: "A clot in an external hemorrhoid identifies thrombosis; treatment selection is a separate decision.",
        evidence: { presentation: hemorrhoid, stem: [C.externalClot, C.externalPain], explanation: [C.externalClot, C.internalLocation, C.analAssessment], teachingPoint: [C.externalClot] },
      },
    ],
  },
  {
    id: "concept.variety3.pruritus-ani-gentle-skin-care", displayName: "Counsel gentle care for anal itching",
    learningObjective: "Choose gentle cleansing and drying for assessed uncomplicated perianal irritation while avoiding abrasive or fragranced care and retaining reassessment.",
    educationalTier: 0, conceptType: "management", earliestFacilityStage: 1, evidenceClaimIds: itch,
    variants: [
      {
        slug: "pruritus-repeated-scrubbing", patientName: "James Turner", artProfile: "man49", chiefComplaint: "Anal itching",
        findings: "James repeatedly scrubs the anal area with scented soap because it feels itchy after bowel movements. Examination shows superficial irritation without a focal mass, ulcer, tear or draining lesion. The clinician has assessed him and is discussing basic skin care, with reassessment if symptoms persist or change.",
        stem: "Which basic skin-care approach should James Turner use for his assessed perianal irritation and itching?",
        choices: itchChoices,
        explanation: "Choose gentle water cleansing and patting dry. Vigorous scrubbing and irritating products can continue the irritation. Persistent or concerning symptoms still need reassessment rather than an assumption that skin care explains every cause.",
        teachingPoint: "Gentle cleansing and drying can reduce further irritation; more scrubbing is not the solution.",
        evidence: { presentation: [C.itchIrritation, C.itchReassess], stem: [C.itchCare], explanation: itch, teachingPoint: [C.itchIrritation, C.itchCare] },
      },
      {
        slug: "pruritus-fragranced-wipes", patientName: "Susan Hayes", artProfile: "woman68", chiefComplaint: "Perianal skin irritation",
        findings: "Susan has anal itching while using fragranced wipes and rubbing the area repeatedly to feel clean. Examination finds irritated perianal skin without a focal ulcer, mass, fissure or draining lesion. After assessment, the clinician discusses an initial skin-care change and plans reassessment for ongoing or changing symptoms.",
        stem: "Which basic cleansing approach best addresses Susan Hayes's assessed perianal irritation during repeated fragranced-wipe use?",
        choices: itchChoices,
        explanation: "Gentle water cleansing followed by patting dry avoids adding friction and fragrance to the supplied irritation. The plan addresses basic care after examination and retains reassessment if the problem continues or changes.",
        teachingPoint: "Reduce friction and fragranced-product exposure when counseling assessed perianal irritation.",
        evidence: { presentation: [C.itchIrritation, C.itchAvoid, C.itchReassess], stem: [C.itchCare, C.itchAvoid], explanation: itch, teachingPoint: [C.itchIrritation, C.itchAvoid] },
      },
    ],
  },
];
export const CLINIC_FAMILY = buildFamily(specs, labelsForClaims);
