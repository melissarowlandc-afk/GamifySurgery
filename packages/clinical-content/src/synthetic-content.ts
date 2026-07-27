import { validateSyntheticClinicalRelease } from "./schema";

const PROTOTYPE_REVIEW_NOTICE =
  "Original prototype draft; requires Melissa's clinical review before any learner pilot.";

function authoredFinalConsequenceWithoutOutcomeVignette(
  answerChoiceId: string,
  consequenceNarrative: string,
  clinicalRationale: string,
  sourceLabels: string[],
) {
  return {
    answerChoiceId,
    kind: "no_terminal_outcome" as const,
    consequenceNarrative,
    clinicalRationale,
    sourceLabels,
  };
}

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
      displayName: "Laceration tetanus prevention",
      learningObjective:
        "Recognize that wound care and tetanus vaccination-history assessment are separate required considerations.",
      earliestFacilityStage: 0,
      conceptType: "management",
    },
    {
      id: "concept.prototype.abscess.primary-treatment",
      displayName: "Uncomplicated abscess management",
      learningObjective:
        "Identify drainage as the primary procedural treatment for an uncomplicated cutaneous abscess.",
      earliestFacilityStage: 1,
      conceptType: "management",
    },
    {
      id: "concept.prototype.postoperative-symptoms.escalation",
      displayName: "Postoperative vomiting/distension escalation",
      learningObjective:
        "Identify that a postoperative patient with vomiting and progressive distension needs prompt surgical-team and hospital-capable evaluation rather than routine clinic treatment.",
      earliestFacilityStage: 1,
      conceptType: "disposition",
    },
    {
      id: "concept.prototype.cholelithiasis.management",
      displayName: "Symptomatic cholelithiasis management",
      learningObjective:
        "Recognize surgical referral as the next step for uncomplicated symptomatic gallstones.",
      earliestFacilityStage: 1,
      conceptType: "management",
    },
    {
      id: "concept.synthetic.service.xray",
      displayName: "Synthetic X-ray service selection",
      learningObjective:
        "Select the X-ray service when an artificial training token explicitly requests X-RAY.",
      earliestFacilityStage: 1,
      conceptType: "workup",
    },
    {
      id: "concept.synthetic.service.basic-labs",
      displayName: "Synthetic laboratory service selection",
      learningObjective:
        "Select basic laboratory testing when an artificial training token explicitly requests BASIC LABS.",
      earliestFacilityStage: 1,
      conceptType: "workup",
    },
    {
      id: "concept.synthetic.result.clear-grid",
      displayName: "Synthetic clear-grid result recognition",
      learningObjective:
        "Recognize the explicitly labeled CLEAR GRID result in an artificial training case.",
      earliestFacilityStage: 1,
      conceptType: "diagnosis",
    },
    {
      id: "concept.synthetic.disposition.routine-return",
      displayName: "Synthetic routine-return selection",
      learningObjective:
        "Select ROUTINE RETURN when that artificial disposition token is explicitly provided.",
      earliestFacilityStage: 1,
      conceptType: "disposition",
    },
  ],
  cases: [
    {
      id: "case.synthetic.tutorial",
      displayName: "Intro Patient 1: Interface Tutorial",
      patientPresentationVariantId: "presentation.synthetic.tutorial-a",
      patientDisplayName: "Pixel Patient",
      prototypeDemographics: {
        ageYears: 42,
        sexLabel: "Not specified",
      },
      prototypeVitalSigns: {
        heartRateBpm: 72,
        systolicBloodPressureMmHg: 118,
        diastolicBloodPressureMmHg: 74,
        temperatureF: 98.6,
        oxygenSaturationPercent: 99,
      },
      chiefComplaint: "A card marked SIGNAL ALPHA",
      presentation:
        "Pixel Patient arrives carrying a card marked SIGNAL ALPHA.",
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
            "Which signal is printed on the patient's card?",
          answerChoices: [
            {
              id: "choice.signal.alpha",
              label: "SIGNAL ALPHA",
              isCorrect: true,
              serviceRequest: {
                serviceId: "service.synthetic.analysis",
              },
            },
            {
              id: "choice.signal.beta",
              label: "SIGNAL BETA",
              isCorrect: false,
              serviceRequest: {
                serviceId: "service.synthetic.analysis",
              },
            },
            {
              id: "choice.signal.gamma",
              label: "SIGNAL GAMMA",
              isCorrect: false,
              serviceRequest: {
                serviceId: "service.synthetic.analysis",
              },
            },
          ],
          shuffleAnswers: true,
          explanation:
            "The presentation explicitly named SIGNAL ALPHA.",
          sourceLabels: ["Synthetic prototype fixture; no clinical source"],
          resultGateAfter: {
            id: "gate.synthetic.analysis",
            resultTypeId: "service.synthetic.analysis",
            pendingLabel: "Analysis pending",
            resultNarrative:
              "The returned marker reads ACTION CIRCLE.",
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
            "The result reads ACTION CIRCLE. Which matching action completes the chart?",
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
            "The result explicitly named ACTION CIRCLE.",
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
                  "The square token jams the imaginary dispenser, causing a brief delay.",
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
                  "The triangle token shuts down the imaginary machine for this patient.",
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
        "Read the explicitly labeled signal and result, then choose their matching tokens.",
    },
    {
      id: "case.prototype.tutorial-laceration",
      displayName: "Intro Patient 2: Laceration",
      patientPresentationVariantId: "presentation.prototype.laceration-a",
      patientDisplayName: "Morgan Thread",
      prototypeDemographics: {
        ageYears: 34,
        sexLabel: "Female",
      },
      prototypeVitalSigns: {
        heartRateBpm: 78,
        systolicBloodPressureMmHg: 122,
        diastolicBloodPressureMmHg: 76,
        temperatureF: 98.4,
        oxygenSaturationPercent: 99,
      },
      chiefComplaint: "Recent uncomplicated laceration",
      presentation:
        "An adult presents to the small clinic with a recent uncomplicated laceration. The chart has not yet documented wound cleaning or tetanus vaccination history.",
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
            "Which action best addresses tetanus prevention while routine wound care proceeds?",
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
            "CDC guidance separates wound care from vaccination/TIG assessment and states that antibiotics are not used to prevent tetanus.",
          sourceLabels: [
            "https://www.cdc.gov/tetanus/hcp/clinical-guidance/index.html",
            PROTOTYPE_REVIEW_NOTICE,
          ],
          resultGateAfter: null,
          terminalDispositions: [
            authoredFinalConsequenceWithoutOutcomeVignette(
              "choice.laceration.antibiotics-only",
              "Antibiotics were used as a substitute for the authored tetanus-prevention assessment, leaving vaccination and TIG needs unaddressed.",
              "Antibiotics do not replace wound assessment and indicated vaccination or TIG.",
              [
                "https://www.cdc.gov/tetanus/hcp/clinical-guidance/index.html",
                PROTOTYPE_REVIEW_NOTICE,
              ],
            ),
            authoredFinalConsequenceWithoutOutcomeVignette(
              "choice.laceration.ignore-history",
              "Vaccination history was not assessed, so indicated prophylaxis could be missed.",
              "The authored decision requires wound type and vaccination history before selecting prophylaxis.",
              [
                "https://www.cdc.gov/tetanus/hcp/clinical-guidance/index.html",
                PROTOTYPE_REVIEW_NOTICE,
              ],
            ),
          ],
        },
      ],
      learningSummary:
        "First assess wound type and vaccination history; clean the wound and provide vaccination/TIG when indicated. Antibiotics do not prevent tetanus.",
    },
    {
      id: "case.prototype.abscess",
      displayName: "Clinic Patient: Abscess",
      patientPresentationVariantId: "presentation.prototype.abscess-a",
      patientDisplayName: "Avery Pixel",
      prototypeDemographics: {
        ageYears: 39,
        sexLabel: "Male",
      },
      prototypeVitalSigns: {
        heartRateBpm: 80,
        systolicBloodPressureMmHg: 124,
        diastolicBloodPressureMmHg: 78,
        temperatureF: 98.8,
        oxygenSaturationPercent: 98,
      },
      chiefComplaint: "Painful fluctuant skin lesion",
      presentation:
        "An otherwise healthy, stable adult has one superficial, accessible, fluctuant and drainable skin abscess. There is no systemic illness, major host-risk factor, special anatomic location, or concern for deeper infection.",
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
            "What is the primary treatment for this uncomplicated cutaneous abscess?",
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
            "The cited IDSA guideline recommends incision and drainage for cutaneous abscesses. The presentation excludes features that would alter this narrow decision.",
          sourceLabels: [
            "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/",
            PROTOTYPE_REVIEW_NOTICE,
          ],
          resultGateAfter: null,
          terminalDispositions: [
            authoredFinalConsequenceWithoutOutcomeVignette(
              "choice.abscess.observe-only",
              "The drainable abscess was left without the authored definitive treatment.",
              "Observation alone does not perform incision and drainage for this explicitly uncomplicated drainable abscess.",
              [
                "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/",
                PROTOTYPE_REVIEW_NOTICE,
              ],
            ),
            authoredFinalConsequenceWithoutOutcomeVignette(
              "choice.abscess.imaging-only",
              "Imaging did not treat the drainable abscess, so the clinical problem remained unresolved.",
              "An X-ray is not the definitive treatment for the narrow presentation in this case.",
              [
                "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/",
                PROTOTYPE_REVIEW_NOTICE,
              ],
            ),
          ],
        },
      ],
      learningSummary:
        "Incision and drainage is the primary treatment for this superficial, accessible cutaneous abscess. Systemic illness, host risk, special locations, and deeper infection require additional decisions.",
    },
    {
      id: "case.prototype.postoperative-symptoms",
      displayName: "Referral Patient: Postoperative Symptoms",
      patientPresentationVariantId:
        "presentation.prototype.postoperative-symptoms-a",
      patientDisplayName: "Jordan Grid",
      prototypeDemographics: {
        ageYears: 58,
        sexLabel: "Female",
      },
      prototypeVitalSigns: {
        heartRateBpm: 96,
        systolicBloodPressureMmHg: 108,
        diastolicBloodPressureMmHg: 68,
        temperatureF: 99.1,
        oxygenSaturationPercent: 97,
      },
      chiefComplaint: "Postoperative vomiting and distension",
      presentation:
        "A postoperative adult presents to the clinic with progressive abdominal distension, vomiting, and inability to tolerate oral intake.",
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
            "What is the safest next step from this outpatient clinic?",
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
            "Progressive postoperative vomiting, distension, and inability to tolerate oral intake exceed this clinic's evaluation and support capabilities and need prompt hospital-capable evaluation.",
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
                  "Delayed escalation could allow the condition to worsen before appropriate evaluation.",
                causalFraming: "possible_consequence",
                clinicalRationale:
                  "This scenario links an unsafe delay to a possible adverse outcome.",
                sourceLabels: [
                  "https://www.ncbi.nlm.nih.gov/books/NBK560780/",
                  PROTOTYPE_REVIEW_NOTICE,
                ],
              },
            },
            authoredFinalConsequenceWithoutOutcomeVignette(
              "choice.ileus.minor-procedure",
              "The patient was directed toward a clinic procedure that did not provide the hospital-capable evaluation required by the case.",
              "The authored presentation exceeds the clinic's evaluation and support capabilities.",
              [
                "https://www.ncbi.nlm.nih.gov/books/NBK560780/",
                PROTOTYPE_REVIEW_NOTICE,
              ],
            ),
          ],
        },
      ],
      learningSummary:
        "Progressive postoperative vomiting and distension beyond the clinic's capabilities require prompt surgical-team contact and hospital-capable evaluation.",
    },
    {
      id: "case.prototype.symptomatic-cholelithiasis",
      displayName: "Clinic Patient: Symptomatic Cholelithiasis",
      patientPresentationVariantId: "presentation.prototype.cholelithiasis-a",
      patientDisplayName: "Riley Mono",
      prototypeDemographics: {
        ageYears: 46,
        sexLabel: "Female",
      },
      prototypeVitalSigns: {
        heartRateBpm: 74,
        systolicBloodPressureMmHg: 126,
        diastolicBloodPressureMmHg: 80,
        temperatureF: 98.5,
        oxygenSaturationPercent: 99,
      },
      chiefComplaint: "Recurrent postprandial right-upper-quadrant pain",
      presentation:
        "A stable adult has recurrent episodic postprandial right-upper-quadrant pain and previously documented gallstones. They have no fever, jaundice, persistent pain, or other acute-complication features.",
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
            "What is the appropriate next step for these uncomplicated symptomatic gallstones?",
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
            "The cited SAGES guidance includes symptomatic cholelithiasis among indications for laparoscopic cholecystectomy.",
          sourceLabels: [
            "https://www.sages.org/publications/guidelines/guidelines-for-the-clinical-application-of-laparoscopic-biliary-tract-surgery/",
            "https://www.nice.org.uk/guidance/cg188/chapter/Recommendations",
            PROTOTYPE_REVIEW_NOTICE,
          ],
          resultGateAfter: null,
          terminalDispositions: [
            authoredFinalConsequenceWithoutOutcomeVignette(
              "choice.chole.no-followup",
              "The recurrent symptomatic gallstone disease was left without surgical follow-up.",
              "Symptom resolution during the visit does not remove the authored indication for surgical evaluation.",
              [
                "https://www.sages.org/publications/guidelines/guidelines-for-the-clinical-application-of-laparoscopic-biliary-tract-surgery/",
                "https://www.nice.org.uk/guidance/cg188/chapter/Recommendations",
                PROTOTYPE_REVIEW_NOTICE,
              ],
            ),
            authoredFinalConsequenceWithoutOutcomeVignette(
              "choice.chole.clinic-drainage",
              "A clinic drainage plan did not address the authored gallstone disease.",
              "The narrow uncomplicated presentation calls for surgical evaluation rather than a minor-procedure-room drainage.",
              [
                "https://www.sages.org/publications/guidelines/guidelines-for-the-clinical-application-of-laparoscopic-biliary-tract-surgery/",
                "https://www.nice.org.uk/guidance/cg188/chapter/Recommendations",
                PROTOTYPE_REVIEW_NOTICE,
              ],
            ),
          ],
        },
      ],
      learningSummary:
        "Uncomplicated symptomatic gallstones warrant surgical evaluation for cholecystectomy; acute-complication features would require a different pathway.",
    },
    {
      id: "case.synthetic.xray-routing",
      displayName: "Practice Patient: X-ray Routing Drill",
      patientPresentationVariantId: "presentation.synthetic.xray-routing-a",
      patientDisplayName: "Cameron Dither",
      prototypeDemographics: {
        ageYears: 29,
        sexLabel: "Male",
      },
      prototypeVitalSigns: {
        heartRateBpm: 70,
        systolicBloodPressureMmHg: 116,
        diastolicBloodPressureMmHg: 72,
        temperatureF: 98.6,
        oxygenSaturationPercent: 99,
      },
      chiefComplaint: "A card marked REQUEST: X-RAY",
      presentation:
        "Cameron carries a software-test card marked REQUEST: X-RAY. The card contains no real clinical findings.",
      tutorialEligible: false,
      routineEligible: true,
      earliestFacilityStage: 1,
      requiredClinicalSetting: "clinic",
      rewardTierId: "reward.clinic_basic",
      sourceLabels: ["Synthetic prototype fixture; no clinical source"],
      decisionNodes: [
        {
          id: "node.synthetic.xray-routing.order",
          questionVariantId: "question.synthetic.xray-routing.order.v1",
          primaryConceptId: "concept.synthetic.service.xray",
          stem: "Which service matches the X-RAY request token?",
          answerChoices: [
            {
              id: "choice.synthetic.xray-routing.xray",
              label: "Order the X-ray token service",
              isCorrect: true,
              serviceRequest: {
                serviceId: "service.xray",
              },
            },
            {
              id: "choice.synthetic.xray-routing.wait",
              label: "Wait without requesting a token service",
              isCorrect: false,
            },
            {
              id: "choice.synthetic.xray-routing.labs",
              label: "Order the basic-labs token service",
              isCorrect: false,
              serviceRequest: {
                serviceId: "service.basic_labs",
              },
            },
          ],
          shuffleAnswers: true,
          explanation:
            "The artificial card explicitly requests the X-RAY token service.",
          sourceLabels: ["Synthetic prototype fixture; no clinical source"],
          resultGateAfter: {
            id: "gate.synthetic.xray-routing.result",
            resultTypeId: "service.xray",
            pendingLabel: "Training X-ray pending",
            resultNarrative: "Training X-ray token result: CLEAR GRID.",
            readiness: "all",
            allowedServiceRouteIds: [
              "route.xray.in_house",
              "route.xray.outsourced",
            ],
          },
          terminalDispositions: [],
        },
        {
          id: "node.synthetic.xray-routing.result",
          questionVariantId: "question.synthetic.xray-routing.result.v1",
          primaryConceptId: "concept.synthetic.result.clear-grid",
          stem: "Which result token was returned?",
          answerChoices: [
            {
              id: "choice.synthetic.xray-routing.clear",
              label: "CLEAR GRID",
              isCorrect: true,
            },
            {
              id: "choice.synthetic.xray-routing.dark",
              label: "DARK GRID",
              isCorrect: false,
            },
            {
              id: "choice.synthetic.xray-routing.striped",
              label: "STRIPED GRID",
              isCorrect: false,
            },
          ],
          shuffleAnswers: true,
          explanation:
            "The returned artificial result explicitly reads CLEAR GRID.",
          sourceLabels: ["Synthetic prototype fixture; no clinical source"],
          resultGateAfter: null,
          terminalDispositions: [
            authoredFinalConsequenceWithoutOutcomeVignette(
              "choice.synthetic.xray-routing.dark",
              "DARK GRID was recorded even though the artificial result read CLEAR GRID.",
              "This software fixture requires the exact returned token.",
              ["Synthetic prototype fixture; no clinical source"],
            ),
            authoredFinalConsequenceWithoutOutcomeVignette(
              "choice.synthetic.xray-routing.striped",
              "STRIPED GRID was recorded even though the artificial result read CLEAR GRID.",
              "This software fixture requires the exact returned token.",
              ["Synthetic prototype fixture; no clinical source"],
            ),
          ],
        },
      ],
      learningSummary:
        "Software-test summary: an X-RAY request token produced the artificial CLEAR GRID result.",
    },
    {
      id: "case.synthetic.lab-routing",
      displayName: "Practice Patient: Laboratory Routing Drill",
      patientPresentationVariantId: "presentation.synthetic.lab-routing-a",
      patientDisplayName: "Devon Sprite",
      prototypeDemographics: {
        ageYears: 51,
        sexLabel: "Not specified",
      },
      prototypeVitalSigns: {
        heartRateBpm: 76,
        systolicBloodPressureMmHg: 120,
        diastolicBloodPressureMmHg: 76,
        temperatureF: 98.7,
        oxygenSaturationPercent: 98,
      },
      chiefComplaint: "A card marked REQUEST: BASIC LABS",
      presentation:
        "Devon carries a software-test card marked REQUEST: BASIC LABS and FINAL TOKEN: ROUTINE RETURN.",
      tutorialEligible: false,
      routineEligible: true,
      earliestFacilityStage: 1,
      requiredClinicalSetting: "clinic",
      rewardTierId: "reward.clinic_basic",
      sourceLabels: ["Synthetic prototype fixture; no clinical source"],
      decisionNodes: [
        {
          id: "node.synthetic.lab-routing.order",
          questionVariantId: "question.synthetic.lab-routing.order.v1",
          primaryConceptId: "concept.synthetic.service.basic-labs",
          stem: "Which service matches the BASIC LABS request token?",
          answerChoices: [
            {
              id: "choice.synthetic.lab-routing.labs",
              label: "Order the basic-labs token service",
              isCorrect: true,
              serviceRequest: {
                serviceId: "service.basic_labs",
              },
            },
            {
              id: "choice.synthetic.lab-routing.xray",
              label: "Order the X-ray token service",
              isCorrect: false,
              serviceRequest: {
                serviceId: "service.xray",
              },
            },
            {
              id: "choice.synthetic.lab-routing.none",
              label: "Request no token service",
              isCorrect: false,
            },
          ],
          shuffleAnswers: true,
          explanation:
            "The artificial card explicitly requests the BASIC LABS token service.",
          sourceLabels: ["Synthetic prototype fixture; no clinical source"],
          resultGateAfter: {
            id: "gate.synthetic.lab-routing.result",
            resultTypeId: "service.basic_labs",
            pendingLabel: "Training laboratory result pending",
            resultNarrative: "Training laboratory token result: STABLE PIXELS.",
            readiness: "all",
            allowedServiceRouteIds: ["route.basic_labs.outsourced"],
          },
          terminalDispositions: [],
        },
        {
          id: "node.synthetic.lab-routing.disposition",
          questionVariantId: "question.synthetic.lab-routing.disposition.v1",
          primaryConceptId: "concept.synthetic.disposition.routine-return",
          stem: "Which final token is printed on Devon's card?",
          answerChoices: [
            {
              id: "choice.synthetic.lab-routing.routine",
              label: "ROUTINE RETURN",
              isCorrect: true,
            },
            {
              id: "choice.synthetic.lab-routing.urgent",
              label: "URGENT RETURN",
              isCorrect: false,
            },
            {
              id: "choice.synthetic.lab-routing.archive",
              label: "ARCHIVE ONLY",
              isCorrect: false,
            },
          ],
          shuffleAnswers: true,
          explanation:
            "The artificial presentation explicitly names ROUTINE RETURN.",
          sourceLabels: ["Synthetic prototype fixture; no clinical source"],
          resultGateAfter: null,
          terminalDispositions: [
            authoredFinalConsequenceWithoutOutcomeVignette(
              "choice.synthetic.lab-routing.urgent",
              "URGENT RETURN was selected even though the artificial instruction read ROUTINE RETURN.",
              "This software fixture requires the exact returned instruction.",
              ["Synthetic prototype fixture; no clinical source"],
            ),
            authoredFinalConsequenceWithoutOutcomeVignette(
              "choice.synthetic.lab-routing.archive",
              "The artificial follow-up instruction was archived instead of being carried forward as ROUTINE RETURN.",
              "This software fixture requires the exact returned instruction.",
              ["Synthetic prototype fixture; no clinical source"],
            ),
          ],
        },
      ],
      learningSummary:
        "Software-test summary: BASIC LABS returned STABLE PIXELS and the card specified ROUTINE RETURN.",
    },
    {
      id: "case.synthetic.three-step-routing",
      displayName: "Practice Patient: Three-Step Routing Drill",
      patientPresentationVariantId:
        "presentation.synthetic.three-step-routing-a",
      patientDisplayName: "Harper Bitmap",
      prototypeDemographics: {
        ageYears: 44,
        sexLabel: "Female",
      },
      prototypeVitalSigns: {
        heartRateBpm: 82,
        systolicBloodPressureMmHg: 128,
        diastolicBloodPressureMmHg: 78,
        temperatureF: 98.9,
        oxygenSaturationPercent: 99,
      },
      chiefComplaint: "A three-step workflow card",
      presentation:
        "Harper's artificial workflow card reads BASIC LABS, then X-RAY, then ROUTINE RETURN.",
      tutorialEligible: false,
      routineEligible: true,
      earliestFacilityStage: 1,
      requiredClinicalSetting: "clinic",
      rewardTierId: "reward.clinic_basic",
      sourceLabels: ["Synthetic prototype fixture; no clinical source"],
      decisionNodes: [
        {
          id: "node.synthetic.three-step.labs",
          questionVariantId: "question.synthetic.three-step.labs.v1",
          primaryConceptId: "concept.synthetic.service.basic-labs",
          stem: "Which first service does the workflow card request?",
          answerChoices: [
            {
              id: "choice.synthetic.three-step.labs",
              label: "Order the basic-labs token service",
              isCorrect: true,
              serviceRequest: {
                serviceId: "service.basic_labs",
              },
            },
            {
              id: "choice.synthetic.three-step.labs-xray",
              label: "Order the X-ray token service first",
              isCorrect: false,
              serviceRequest: {
                serviceId: "service.xray",
              },
            },
            {
              id: "choice.synthetic.three-step.labs-none",
              label: "Request no token service",
              isCorrect: false,
            },
          ],
          shuffleAnswers: true,
          explanation:
            "The first service printed on the artificial card is BASIC LABS.",
          sourceLabels: ["Synthetic prototype fixture; no clinical source"],
          resultGateAfter: {
            id: "gate.synthetic.three-step.labs",
            resultTypeId: "service.basic_labs",
            pendingLabel: "First training result pending",
            resultNarrative: "First token result: LAB GRID READY.",
            readiness: "all",
            allowedServiceRouteIds: ["route.basic_labs.outsourced"],
          },
          terminalDispositions: [],
        },
        {
          id: "node.synthetic.three-step.xray",
          questionVariantId: "question.synthetic.three-step.xray.v1",
          primaryConceptId: "concept.synthetic.service.xray",
          stem: "Which second service does the workflow card request?",
          answerChoices: [
            {
              id: "choice.synthetic.three-step.xray",
              label: "Order the X-ray token service",
              isCorrect: true,
              serviceRequest: {
                serviceId: "service.xray",
              },
            },
            {
              id: "choice.synthetic.three-step.xray-repeat-labs",
              label: "Repeat the basic-labs token service",
              isCorrect: false,
              serviceRequest: {
                serviceId: "service.basic_labs",
              },
            },
            {
              id: "choice.synthetic.three-step.xray-stop",
              label: "Stop the artificial workflow",
              isCorrect: false,
            },
          ],
          shuffleAnswers: true,
          explanation:
            "The second service printed on the artificial card is X-RAY.",
          sourceLabels: ["Synthetic prototype fixture; no clinical source"],
          resultGateAfter: {
            id: "gate.synthetic.three-step.xray",
            resultTypeId: "service.xray",
            pendingLabel: "Second training result pending",
            resultNarrative: "Second token result: IMAGE GRID READY.",
            readiness: "all",
            allowedServiceRouteIds: [
              "route.xray.in_house",
              "route.xray.outsourced",
            ],
          },
          terminalDispositions: [],
        },
        {
          id: "node.synthetic.three-step.disposition",
          questionVariantId: "question.synthetic.three-step.disposition.v1",
          primaryConceptId: "concept.synthetic.disposition.routine-return",
          stem: "Which final token completes Harper's workflow?",
          answerChoices: [
            {
              id: "choice.synthetic.three-step.routine",
              label: "ROUTINE RETURN",
              isCorrect: true,
            },
            {
              id: "choice.synthetic.three-step.urgent",
              label: "URGENT RETURN",
              isCorrect: false,
            },
            {
              id: "choice.synthetic.three-step.repeat",
              label: "REPEAT FOREVER",
              isCorrect: false,
            },
          ],
          shuffleAnswers: true,
          explanation:
            "The final token printed on the artificial workflow card is ROUTINE RETURN.",
          sourceLabels: ["Synthetic prototype fixture; no clinical source"],
          resultGateAfter: null,
          terminalDispositions: [
            authoredFinalConsequenceWithoutOutcomeVignette(
              "choice.synthetic.three-step.urgent",
              "URGENT RETURN was selected even though the workflow card ended with ROUTINE RETURN.",
              "This software fixture requires the exact final token.",
              ["Synthetic prototype fixture; no clinical source"],
            ),
            authoredFinalConsequenceWithoutOutcomeVignette(
              "choice.synthetic.three-step.repeat",
              "The artificial workflow was set to repeat indefinitely instead of ending with ROUTINE RETURN.",
              "This software fixture requires the exact final token.",
              ["Synthetic prototype fixture; no clinical source"],
            ),
          ],
        },
      ],
      learningSummary:
        "Software-test summary: the three-step artificial workflow was BASIC LABS, X-RAY, then ROUTINE RETURN.",
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
  "case.synthetic.xray-routing",
  "case.synthetic.lab-routing",
  "case.synthetic.three-step-routing",
] as const;
