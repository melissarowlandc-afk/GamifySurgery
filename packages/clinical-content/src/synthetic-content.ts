import { validateSyntheticClinicalRelease } from "./schema";

const PROTOTYPE_REVIEW_NOTICE =
  "Original prototype draft; requires Melissa's clinical review before any learner pilot.";

/**
 * Small original prototype fixture.
 *
 * Some records exercise clinically themed mechanics, but every record is
 * deliberately marked as unapproved. Nothing in this release may be presented
 * as clinically reviewed educational material.
 */
export const SYNTHETIC_CLINICAL_RELEASE = validateSyntheticClinicalRelease({
  id: "clinical.synthetic.prototype.v1",
  schemaVersion: 1,
  publicationStatus: "synthetic_unapproved_prototype",
  disclaimer:
    "Synthetic and original prototype draft content for software testing only; not clinically approved and not medical guidance.",
  concepts: [
    {
      id: "concept.synthetic.signal",
      displayName: "Synthetic signal recognition",
      learningObjective:
        "Select the explicitly named placeholder signal from a finite list.",
      earliestFacilityStage: 0,
      conceptType: "diagnosis",
    },
    {
      id: "concept.synthetic.action",
      displayName: "Synthetic action selection",
      learningObjective:
        "Select the explicitly named placeholder action from a finite list.",
      earliestFacilityStage: 0,
      conceptType: "management",
    },
    {
      id: "concept.prototype.laceration.tetanus",
      displayName: "Draft laceration tetanus prevention",
      learningObjective:
        "Recognize that wound care and tetanus vaccination-history assessment are separate required considerations.",
      earliestFacilityStage: 0,
      conceptType: "management",
    },
    {
      id: "concept.prototype.abscess.primary-treatment",
      displayName: "Draft uncomplicated abscess management",
      learningObjective:
        "Identify drainage as the primary procedural treatment represented by this uncomplicated prototype vignette.",
      earliestFacilityStage: 1,
      conceptType: "management",
    },
    {
      id: "concept.prototype.postoperative-symptoms.escalation",
      displayName: "Draft postoperative vomiting/distension escalation",
      learningObjective:
        "Identify that a postoperative patient with vomiting and progressive distension needs prompt surgical-team and hospital-capable evaluation rather than routine clinic treatment.",
      earliestFacilityStage: 1,
      conceptType: "disposition",
    },
    {
      id: "concept.prototype.cholelithiasis.management",
      displayName: "Draft symptomatic cholelithiasis management",
      learningObjective:
        "Recognize surgical referral as the represented next step for uncomplicated symptomatic gallstones.",
      earliestFacilityStage: 1,
      conceptType: "management",
    },
  ],
  cases: [
    {
      id: "case.synthetic.tutorial",
      displayName: "Intro Patient 1: Interface Tutorial",
      patientPresentationVariantId: "presentation.synthetic.tutorial-a",
      patientDisplayName: "Pixel Patient",
      presentation:
        "SYNTHETIC TEST CASE: Pixel Patient arrives carrying a card marked SIGNAL ALPHA. No real diagnosis or medical advice is represented.",
      tutorialEligible: true,
      routineEligible: false,
      earliestFacilityStage: 0,
      requiredClinicalSetting: "clinic",
      rewardTierId: "reward.tutorial",
      sourceLabels: ["Synthetic prototype fixture; no clinical source"],
      decisionNodes: [
        {
          id: "node.synthetic.signal",
          questionVariantId: "question.synthetic.signal.v1",
          primaryConceptId: "concept.synthetic.signal",
          stem:
            "For this synthetic tutorial only, which signal is printed on the patient's card?",
          answerChoices: [
            {
              id: "choice.signal.alpha",
              label: "SIGNAL ALPHA",
              isCorrect: true,
            },
            {
              id: "choice.signal.beta",
              label: "SIGNAL BETA",
              isCorrect: false,
            },
            {
              id: "choice.signal.gamma",
              label: "SIGNAL GAMMA",
              isCorrect: false,
            },
          ],
          shuffleAnswers: true,
          explanation:
            "The synthetic presentation explicitly named SIGNAL ALPHA. This explanation contains no clinical claim.",
          sourceLabels: ["Synthetic prototype fixture; no clinical source"],
          resultGateAfter: {
            id: "gate.synthetic.analysis",
            resultTypeId: "service.synthetic.analysis",
            pendingLabel: "Synthetic analysis pending",
            resultNarrative:
              "SYNTHETIC RESULT: The returned marker reads ACTION CIRCLE.",
            readiness: "all",
            allowedServiceRouteIds: [
              "route.synthetic.in_house",
              "route.synthetic.outsourced",
            ],
          },
          terminalDispositions: [],
        },
        {
          id: "node.synthetic.action",
          questionVariantId: "question.synthetic.action.v1",
          primaryConceptId: "concept.synthetic.action",
          stem:
            "The synthetic result reads ACTION CIRCLE. Which placeholder action completes this test case?",
          answerChoices: [
            {
              id: "choice.action.circle",
              label: "ACTION CIRCLE",
              isCorrect: true,
            },
            {
              id: "choice.action.square",
              label: "ACTION SQUARE",
              isCorrect: false,
            },
            {
              id: "choice.action.triangle",
              label: "ACTION TRIANGLE",
              isCorrect: false,
            },
          ],
          shuffleAnswers: true,
          explanation:
            "The synthetic result explicitly named ACTION CIRCLE. This is placeholder teaching text, not clinical guidance.",
          sourceLabels: ["Synthetic prototype fixture; no clinical source"],
          resultGateAfter: null,
          terminalDispositions: [
            {
              answerChoiceId: "choice.action.square",
              kind: "terminal_outcome",
              outcome: {
                id: "outcome.synthetic.square",
                severity: "minor",
                narrative:
                  "SYNTHETIC OUTCOME: the square token jams the imaginary dispenser, causing a brief fictional delay.",
                causalFraming: "possible_consequence",
                clinicalRationale:
                  "Software-test rationale only: this deterministic vignette verifies a minor terminal outcome.",
                sourceLabels: ["Synthetic prototype fixture; no clinical source"],
              },
            },
            {
              answerChoiceId: "choice.action.triangle",
              kind: "terminal_outcome",
              outcome: {
                id: "outcome.synthetic.triangle",
                severity: "major",
                narrative:
                  "SYNTHETIC OUTCOME: the triangle token shuts down the imaginary machine for this fictional patient.",
                causalFraming: "possible_consequence",
                clinicalRationale:
                  "Software-test rationale only: this deterministic vignette verifies a major terminal outcome.",
                sourceLabels: ["Synthetic prototype fixture; no clinical source"],
              },
            },
          ],
        },
      ],
      learningSummary:
        "SYNTHETIC LEARNING SUMMARY: read the explicitly labeled signal and result, then choose their matching tokens. This is not clinically approved content.",
    },
    {
      id: "case.prototype.tutorial-laceration",
      displayName: "Intro Patient 2: Draft Laceration",
      patientPresentationVariantId: "presentation.prototype.laceration-a",
      patientDisplayName: "Morgan Thread",
      presentation:
        "UNAPPROVED PROTOTYPE DRAFT: An adult presents to the small clinic with a recent uncomplicated laceration. The chart has not yet documented wound cleaning or tetanus vaccination history.",
      tutorialEligible: true,
      routineEligible: true,
      earliestFacilityStage: 0,
      requiredClinicalSetting: "clinic",
      rewardTierId: "reward.tutorial",
      sourceLabels: [
        "CDC, Clinical Guidance for Wound Management to Prevent Tetanus, accessed 2026-07-24",
        PROTOTYPE_REVIEW_NOTICE,
      ],
      decisionNodes: [
        {
          id: "node.prototype.laceration.tetanus",
          questionVariantId: "question.prototype.laceration.tetanus.v1",
          primaryConceptId: "concept.prototype.laceration.tetanus",
          stem:
            "For this unapproved draft vignette, which action best addresses tetanus prevention while routine wound care proceeds?",
          answerChoices: [
            {
              id: "choice.laceration.assess-history",
              label:
                "Assess wound type and vaccine history, clean the wound, then provide vaccine/TIG when indicated",
              isCorrect: true,
            },
            {
              id: "choice.laceration.antibiotics-only",
              label: "Use antibiotics alone as tetanus prevention",
              isCorrect: false,
            },
            {
              id: "choice.laceration.ignore-history",
              label: "Ignore vaccination history because the wound is recent",
              isCorrect: false,
            },
          ],
          shuffleAnswers: true,
          explanation:
            "CDC guidance separates wound care from vaccination/TIG assessment and states that antibiotics are not used to prevent tetanus. Melissa must clinically review this original draft before learner use.",
          sourceLabels: [
            "https://www.cdc.gov/tetanus/hcp/clinical-guidance/index.html",
            PROTOTYPE_REVIEW_NOTICE,
          ],
          resultGateAfter: null,
          terminalDispositions: [
            {
              answerChoiceId: "choice.laceration.antibiotics-only",
              kind: "no_terminal_outcome",
            },
            {
              answerChoiceId: "choice.laceration.ignore-history",
              kind: "no_terminal_outcome",
            },
          ],
        },
      ],
      learningSummary:
        "UNAPPROVED DRAFT SUMMARY: first assess wound type and vaccination history; clean the wound and provide vaccination/TIG when indicated. Antibiotics do not prevent tetanus. Requires Melissa's review.",
    },
    {
      id: "case.prototype.abscess",
      displayName: "Draft Clinic Patient: Abscess",
      patientPresentationVariantId: "presentation.prototype.abscess-a",
      patientDisplayName: "Avery Pixel",
      presentation:
        "UNAPPROVED PROTOTYPE DRAFT: An otherwise healthy, stable adult has one superficial, accessible, fluctuant and drainable skin abscess. This vignette explicitly excludes systemic illness, major host-risk factors, a special anatomic location, and concern for deeper infection.",
      tutorialEligible: false,
      routineEligible: true,
      earliestFacilityStage: 1,
      requiredClinicalSetting: "clinic",
      rewardTierId: "reward.clinic_basic",
      sourceLabels: [
        "IDSA, Practice Guidelines for Skin and Soft Tissue Infections (2014)",
        PROTOTYPE_REVIEW_NOTICE,
      ],
      decisionNodes: [
        {
          id: "node.prototype.abscess.primary-treatment",
          questionVariantId: "question.prototype.abscess.primary-treatment.v1",
          primaryConceptId: "concept.prototype.abscess.primary-treatment",
          stem:
            "Which management choice matches the primary treatment represented by this uncomplicated draft abscess vignette?",
          answerChoices: [
            {
              id: "choice.abscess.drainage",
              label: "Incision and drainage, in an appropriate equipped setting",
              isCorrect: true,
            },
            {
              id: "choice.abscess.observe-only",
              label: "Observation alone regardless of progression",
              isCorrect: false,
            },
            {
              id: "choice.abscess.imaging-only",
              label: "X-ray as definitive treatment",
              isCorrect: false,
            },
          ],
          shuffleAnswers: true,
          explanation:
            "The cited IDSA guideline identifies incision and drainage as recommended treatment for cutaneous abscesses. This simplified draft excludes important modifiers and requires Melissa's review.",
          sourceLabels: [
            "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/",
            PROTOTYPE_REVIEW_NOTICE,
          ],
          resultGateAfter: null,
          terminalDispositions: [
            {
              answerChoiceId: "choice.abscess.observe-only",
              kind: "no_terminal_outcome",
            },
            {
              answerChoiceId: "choice.abscess.imaging-only",
              kind: "no_terminal_outcome",
            },
          ],
        },
      ],
      learningSummary:
        "UNAPPROVED DRAFT SUMMARY: this deliberately uncomplicated prototype represents drainage as primary treatment. It omits modifier-dependent decisions and requires clinical review.",
    },
    {
      id: "case.prototype.postoperative-symptoms",
      displayName: "Draft Referral Patient: Postoperative Symptoms",
      patientPresentationVariantId:
        "presentation.prototype.postoperative-symptoms-a",
      patientDisplayName: "Jordan Grid",
      presentation:
        "UNAPPROVED PROTOTYPE DRAFT: A postoperative adult presents to the clinic with progressive abdominal distension, vomiting, and inability to tolerate oral intake.",
      tutorialEligible: false,
      routineEligible: true,
      earliestFacilityStage: 1,
      requiredClinicalSetting: "clinic",
      rewardTierId: "reward.referral",
      sourceLabels: [
        "Postoperative Ileus, NCBI Bookshelf NBK560780, accessed 2026-07-24",
        PROTOTYPE_REVIEW_NOTICE,
      ],
      decisionNodes: [
        {
          id: "node.prototype.postoperative-symptoms.escalation",
          questionVariantId:
            "question.prototype.postoperative-symptoms.escalation.v1",
          primaryConceptId:
            "concept.prototype.postoperative-symptoms.escalation",
          stem:
            "What is the safest disposition represented by this limited outpatient clinic prototype?",
          answerChoices: [
            {
              id: "choice.ileus.hospital-evaluation",
              label:
                "Contact the surgical team and arrange prompt emergency/hospital-capable evaluation",
              isCorrect: true,
            },
            {
              id: "choice.ileus.routine-followup",
              label: "Schedule routine follow-up in several weeks",
              isCorrect: false,
            },
            {
              id: "choice.ileus.minor-procedure",
              label: "Treat in the clinic's minor-procedure room",
              isCorrect: false,
            },
          ],
          shuffleAnswers: true,
          explanation:
            "This draft escalates the concerning postoperative symptom cluster because the small clinic cannot evaluate or support it. It deliberately avoids declaring a diagnosis and requires Melissa's review.",
          sourceLabels: [
            "https://www.ncbi.nlm.nih.gov/books/NBK560780/",
            PROTOTYPE_REVIEW_NOTICE,
          ],
          resultGateAfter: null,
          terminalDispositions: [
            {
              answerChoiceId: "choice.ileus.routine-followup",
              kind: "terminal_outcome",
              outcome: {
                id: "outcome.prototype.postoperative-symptoms.delay",
                severity: "major",
                narrative:
                  "PROTOTYPE OUTCOME: delayed escalation could allow the condition to worsen before appropriate evaluation.",
                causalFraming: "possible_consequence",
                clinicalRationale:
                  "This educational draft links an unsafe delay to a possible adverse outcome; exact wording requires Melissa's clinical review.",
                sourceLabels: [
                  "https://www.ncbi.nlm.nih.gov/books/NBK560780/",
                  PROTOTYPE_REVIEW_NOTICE,
                ],
              },
            },
            {
              answerChoiceId: "choice.ileus.minor-procedure",
              kind: "no_terminal_outcome",
            },
          ],
        },
      ],
      learningSummary:
        "UNAPPROVED DRAFT SUMMARY: a postoperative patient with vomiting and progressive distension beyond the clinic's capabilities should be escalated promptly to the surgical team and a hospital-capable setting; this vignette does not establish a final diagnosis.",
    },
    {
      id: "case.prototype.symptomatic-cholelithiasis",
      displayName: "Draft Clinic Patient: Symptomatic Cholelithiasis",
      patientPresentationVariantId: "presentation.prototype.cholelithiasis-a",
      patientDisplayName: "Riley Mono",
      presentation:
        "UNAPPROVED PROTOTYPE DRAFT: A stable adult has recurrent episodic postprandial right-upper-quadrant pain and previously documented gallstones. This simplified scenario explicitly excludes fever, jaundice, persistent pain, or other acute-complication features.",
      tutorialEligible: false,
      routineEligible: true,
      earliestFacilityStage: 1,
      requiredClinicalSetting: "clinic",
      rewardTierId: "reward.referral",
      sourceLabels: [
        "SAGES, Guidelines for the Clinical Application of Laparoscopic Biliary Tract Surgery",
        "NICE CG188, Gallstone disease: diagnosis and management",
        PROTOTYPE_REVIEW_NOTICE,
      ],
      decisionNodes: [
        {
          id: "node.prototype.cholelithiasis.management",
          questionVariantId: "question.prototype.cholelithiasis.management.v1",
          primaryConceptId: "concept.prototype.cholelithiasis.management",
          stem:
            "Which next step is represented for this uncomplicated symptomatic gallstone draft?",
          answerChoices: [
            {
              id: "choice.chole.surgical-referral",
              label: "Refer for surgical evaluation for cholecystectomy",
              isCorrect: true,
            },
            {
              id: "choice.chole.no-followup",
              label: "No follow-up because symptoms resolved today",
              isCorrect: false,
            },
            {
              id: "choice.chole.clinic-drainage",
              label: "Perform drainage in the minor-procedure room",
              isCorrect: false,
            },
          ],
          shuffleAnswers: true,
          explanation:
            "The cited SAGES guidance includes symptomatic cholelithiasis among indications for laparoscopic cholecystectomy. This simplified draft requires Melissa's review.",
          sourceLabels: [
            "https://www.sages.org/publications/guidelines/guidelines-for-the-clinical-application-of-laparoscopic-biliary-tract-surgery/",
            "https://www.nice.org.uk/guidance/cg188/chapter/Recommendations",
            PROTOTYPE_REVIEW_NOTICE,
          ],
          resultGateAfter: null,
          terminalDispositions: [
            {
              answerChoiceId: "choice.chole.no-followup",
              kind: "no_terminal_outcome",
            },
            {
              answerChoiceId: "choice.chole.clinic-drainage",
              kind: "no_terminal_outcome",
            },
          ],
        },
      ],
      learningSummary:
        "UNAPPROVED DRAFT SUMMARY: this uncomplicated symptomatic gallstone prototype routes the patient to surgical evaluation. It excludes acute complications.",
    },
  ],
});

export const SYNTHETIC_TUTORIAL_CASE_ID = "case.synthetic.tutorial";
export const SECOND_TUTORIAL_CASE_ID = "case.prototype.tutorial-laceration";
export const LEVEL_ONE_ROUTINE_CASE_IDS = [
  "case.prototype.tutorial-laceration",
  "case.prototype.abscess",
  "case.prototype.postoperative-symptoms",
  "case.prototype.symptomatic-cholelithiasis",
] as const;
