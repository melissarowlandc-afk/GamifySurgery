import {
  claim,
  concept,
  createDevelopmentFamily,
  linkSourcesToClaims,
  NEEDS_REVIEW,
  source,
  type CaseSpec,
  type ChoiceSpec,
} from "./batch-helpers";

const IDSA = "source.bread-butter.idsa-ssti-2014-wound";
const ACS_ASE = "source.bread-butter.acs-ase-postoperative-care";
const COTCCC = "source.bread-butter.cotccc-evisceration-2021";

const CLAIM_IDS = {
  superficial: "claim.bread-butter.superficial-incisional-ssi.open-drain",
  emergency: "claim.bread-butter.fascial-dehiscence-evisceration.emergency",
  moistCover: "claim.bread-butter.evisceration.moist-cover",
} as const;

const CONCEPT_IDS = {
  superficial: "concept.superficial-incisional-ssi.open-drain",
  emergency: "concept.fascial-dehiscence-evisceration.emergency-transfer",
} as const;

export const POSTOPERATIVE_WOUNDS_CLAIMS = [
  claim({
    id: CLAIM_IDS.superficial,
    statement:
      "A localized superficial incisional surgical-site infection with purulence requires opening the involved incision and drainage, with removal of sutures or staples when needed for source control.",
    sourceIds: [IDSA],
    evidenceCategory: "management",
    certainty: "moderate",
    limitation:
      "Systemic antibiotics depend on systemic response and operative site; deep, organ-space, and necrotizing infections require different care.",
    applicablePopulation:
      "Stable adults with purulent superficial incisional infection, intact fascia, and no systemic toxicity.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.emergency,
    statement:
      "Postoperative abdominal wound separation with visible bowel is evisceration and requires immediate surgical escalation rather than delayed outpatient testing.",
    sourceIds: [ACS_ASE],
    evidenceCategory: "safety_boundary",
    certainty: "high",
    limitation:
      "This claim addresses obvious evisceration; suspected fascial separation beneath intact skin can require a different urgent evaluation, and probing can worsen the defect.",
    applicablePopulation:
      "Postoperative adults with visible bowel through a separated abdominal incision.",
    lastCheckedOn: "2026-09-17",
  }),
  claim({
    id: CLAIM_IDS.moistCover,
    statement:
      "During immediate transfer for abdominal evisceration, exposed bowel should be protected with a sterile moist covering and should not be forcibly reduced.",
    sourceIds: [COTCCC],
    evidenceCategory: "safety_boundary",
    certainty: "moderate",
    limitation:
      "The explicit temporary-cover evidence comes from traumatic evisceration guidance; definitive postoperative management still requires immediate surgical care.",
    applicablePopulation:
      "Adults with exposed abdominal viscera awaiting immediate emergency surgical transfer.",
    lastCheckedOn: "2026-09-17",
  }),
];

export const POSTOPERATIVE_WOUNDS_SOURCES = linkSourcesToClaims(
  [
    source({
      id: IDSA,
      title:
        "Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue Infections: 2014 Update",
      completeCitation:
        "Stevens DL, Bisno AL, Chambers HF, Dellinger EP, Goldstein EJC, Gorbach SL, Hirschmann JV, Kaplan SL, Montoya JG, Wade JC. Practice guidelines for the diagnosis and management of skin and soft tissue infections: 2014 update by the Infectious Diseases Society of America. Clin Infect Dis. 2014;59(2):e10-e52. doi:10.1093/cid/ciu296. PMID:24973422.",
      organizationOrJournal:
        "Clinical Infectious Diseases / Infectious Diseases Society of America",
      authors: [
        "Stevens DL",
        "Bisno AL",
        "Chambers HF",
        "Dellinger EP",
        "Goldstein EJC",
        "Gorbach SL",
        "Hirschmann JV",
        "Kaplan SL",
        "Montoya JG",
        "Wade JC",
      ],
      publicationYear: 2014,
      doi: "10.1093/cid/ciu296",
      pmid: "24973422",
      officialUrl:
        "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/",
      accessedOn: "2026-09-17",
      sourceClass: "professional_society_guideline",
      licenseLabel: "Copyrighted professional-society guidance",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Original synthesis only; no source prose, tables, figures, or algorithms reproduced.",
      authorityAssessment:
        "Current IDSA guidance directly supporting suture removal and incision and drainage for superficial incisional infection.",
      usageRole: "evidence",
    }),
    source({
      id: ACS_ASE,
      title: "ACS/ASE Medical Student Core Curriculum: Postoperative Care",
      completeCitation:
        "Campbell AR, section editor; Anand R, Wickramaratne N, content authors. ACS/ASE Medical Student Core Curriculum: Postoperative Care. American College of Surgeons Division of Education and Association for Surgical Education. Accessed September 17, 2026.",
      organizationOrJournal:
        "American College of Surgeons / Association for Surgical Education",
      authors: ["Campbell AR", "Anand R", "Wickramaratne N"],
      publicationYear: 2017,
      doi: null,
      pmid: null,
      officialUrl: "https://www.facs.org/media/iccbhdga/postoperative_care.pdf",
      accessedOn: "2026-09-17",
      sourceClass: "open_educational_resource",
      licenseLabel:
        "Copyrighted professional-society educational material; targeted factual verification only",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "No source prose, tables, or figures reproduced. The PDF does not print a publication date; 2017 is the catalogued module year.",
      authorityAssessment:
        "Official surgical education curriculum identifying bowel evisceration from fascial dehiscence as a surgical emergency.",
      usageRole: "evidence",
    }),
    source({
      id: COTCCC,
      title:
        "The Management of Abdominal Evisceration in Tactical Combat Casualty Care: TCCC Guideline Change 20-02",
      completeCitation:
        "Riesberg JC, Gurney JM, Morgan M, Northern DM, Onifer DJ, Gephart WJ, Remley MA, Eickhoff E, Miller C, Eastridge BJ, Montgomery HR, Butler FK Jr, Drew B. The management of abdominal evisceration in Tactical Combat Casualty Care: TCCC Guideline Change 20-02. J Spec Oper Med. 2021;21(4):138-142. doi:10.55460/9U6S-1K7M. PMID:34969144.",
      organizationOrJournal:
        "Journal of Special Operations Medicine / Committee on Tactical Combat Casualty Care",
      authors: [
        "Riesberg JC",
        "Gurney JM",
        "Morgan M",
        "Northern DM",
        "Onifer DJ",
        "Gephart WJ",
        "Remley MA",
        "Eickhoff E",
        "Miller C",
        "Eastridge BJ",
        "Montgomery HR",
        "Butler FK Jr",
        "Drew B",
      ],
      publicationYear: 2021,
      doi: "10.55460/9U6S-1K7M",
      pmid: "34969144",
      officialUrl: "https://pubmed.ncbi.nlm.nih.gov/34969144/",
      accessedOn: "2026-09-17",
      sourceClass: "consensus_guideline",
      licenseLabel: "Copyrighted journal guidance; targeted factual verification only",
      reuseStatus: "copyrighted_targeted_verification_only",
      reuseNotes:
        "Only the independently worded temporary-protection fact is stored; no source prose or algorithm reproduced.",
      authorityAssessment:
        "Government committee guideline cross-checking sterile moist protection and avoidance of forced reduction for exposed abdominal viscera.",
      usageRole: "cross_check",
    }),
  ],
  POSTOPERATIVE_WOUNDS_CLAIMS,
);

const plan = (
  id: string,
  label: string,
  rationale: string,
  isCorrect = false,
): ChoiceSpec => ({ id, label, rationale, isCorrect, timing: { kind: "no_test" } });

const superficialStories = [
  ["purulent-staple-line", "Incision drainage", "has purulent drainage from a short segment of a recent abdominal incision; the fascia is intact"],
  ["red-incision", "Red draining incision", "returns after surgery with localized redness and pus at the incision; the fascia remains intact"],
  ["incisional-collection", "Wound drainage", "has a localized superficial collection draining through a recent surgical incision with intact fascia"],
  ["tender-staples", "Tender staple line", "has focal tenderness and purulent drainage around several recent abdominal-incision staples; the fascia is intact"],
] as const;

const eviscerationStories = [
  ["bowel-visible", "Open abdominal wound", "arrives with sudden separation of a recent outside abdominal incision and visible bowel"],
  ["cough-wound-opened", "Incision opened", "reports the abdominal incision opened after coughing, with bowel now visible through the wound"],
  ["wound-separation", "Visible bowel", "has complete separation of a recent abdominal wound with exposed bowel"],
  ["postoperative-evisceration", "Wound emergency", "arrives after a recent laparotomy with the incision separated and bowel visible"],
] as const;

const cases: CaseSpec[] = [
  ...superficialStories.map(([slug, complaint, detail], index) => ({
    id: `case.bread-butter.superficial-incisional-ssi.${slug}`,
    displayName: "Superficial incisional infection",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}. Vitals are normal, with no spreading infection, systemic toxicity, necrosis, or exposed viscera.`,
    ageYears: [36, 62],
    sexLabels: ["Female", "Male"] as const,
    stage: 0 as const,
    nodes: [
      {
        conceptId: CONCEPT_IDS.superficial,
        stem: "Which treatment provides source control for {patientName}?",
        choices: [
          plan(`open_${index + 1}`, "Open and drain incision", "Opening and drainage provides source control; involved closure material can be removed as needed.", true),
          plan(`antibiotic_${index + 1}`, "Give oral antibiotics alone", "Antibiotics alone do not drain this purulent superficial incisional infection."),
          plan(`reclose_${index + 1}`, "Reclose the draining incision", "Closing a purulent incision traps infection rather than providing source control."),
          plan(`observe_${index + 1}`, "Observe without wound treatment", "Purulent drainage requires local source control rather than observation alone."),
        ],
        explanation:
          "Open and drain the involved superficial incision, removing sutures or staples as needed. The intact fascia and stable examination distinguish this from deep dehiscence.",
        claimIds: [CLAIM_IDS.superficial],
      },
    ],
  } satisfies CaseSpec)),
  ...eviscerationStories.map(([slug, complaint, detail], index) => ({
    id: `case.bread-butter.evisceration.${slug}`,
    displayName: "Postoperative abdominal evisceration",
    chiefComplaint: complaint,
    presentation: `{patientName} is a {patientAge}-year-old {patientSex} who ${detail}. The team is at the bedside.`,
    ageYears: [45, 68],
    sexLabels: ["Female", "Male"] as const,
    stage: 0 as const,
    acuity: "urgent" as const,
    nodes: [
      {
        conceptId: CONCEPT_IDS.emergency,
        stem: "Which immediate action should the team take?",
        choices: [
          plan(`cover_transfer_${index + 1}`, "Apply moist cover; arrange emergency transfer", "A sterile moist cover protects exposed bowel during immediate surgical transfer.", true),
          plan(`reduce_delay_${index + 1}`, "Reduce bowel and arrange nonemergency transfer", "The exposed bowel should not be forcibly reduced or managed with delayed transfer."),
          plan(`dry_observe_${index + 1}`, "Apply dry gauze and continue clinic observation", "Observation delays definitive emergency care, and a dry dressing is not the preferred temporary protection."),
          plan(`probe_close_${index + 1}`, "Probe the wound and reclose it bedside", "Probing or bedside reclosure can worsen injury and does not replace emergency surgical care."),
        ],
        explanation:
          "Protect the exposed bowel with a sterile moist covering and activate immediate emergency surgical transfer. Do not probe or forcibly reduce the bowel.",
        claimIds: [CLAIM_IDS.emergency, CLAIM_IDS.moistCover],
      },
    ],
  } satisfies CaseSpec)),
];

export const POSTOPERATIVE_WOUNDS_CONCEPTS = [
  concept({
    id: CONCEPT_IDS.superficial,
    educationalTier: 0,
    displayName: "Source control for superficial incisional infection",
    learningObjective:
      "Open and drain a purulent superficial incisional infection with intact fascia.",
    earliestFacilityStage: 0,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.superficial],
  }),
  concept({
    id: CONCEPT_IDS.emergency,
    educationalTier: 0,
    displayName: "Emergency response to abdominal evisceration",
    learningObjective:
      "Protect exposed bowel with a sterile moist covering and activate immediate emergency surgical transfer.",
    earliestFacilityStage: 0,
    conceptType: "management",
    evidenceClaimIds: [CLAIM_IDS.emergency, CLAIM_IDS.moistCover],
  }),
];

const family = createDevelopmentFamily({
  concepts: POSTOPERATIVE_WOUNDS_CONCEPTS,
  cases,
  sourceLabels: [
    "IDSA skin and soft-tissue infection guideline (2014)",
    "ACS/ASE postoperative care curriculum (accessed 2026)",
    "TCCC abdominal evisceration guideline (2021)",
  ],
});

export const POSTOPERATIVE_WOUNDS_TESTED_CONCEPTS = family.testedConcepts;
export const POSTOPERATIVE_WOUNDS_QUESTIONS = family.questions;
export const POSTOPERATIVE_WOUNDS_CASES = family.cases;
export const POSTOPERATIVE_WOUNDS_CASE_REVIEWS = family.caseReviews;
export const POSTOPERATIVE_WOUNDS_TIMING_ENTRIES = family.timingEntries;
export const POSTOPERATIVE_WOUNDS_AUTHORING_REVIEW = NEEDS_REVIEW;
export const POSTOPERATIVE_WOUNDS_SERVICE_CONTRACTS = [];
