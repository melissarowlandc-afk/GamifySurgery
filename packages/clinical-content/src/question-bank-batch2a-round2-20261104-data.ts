import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";
import type { QuestionFlagConceptVersion } from "./question-flags-20261104";

/** Additive drafts; B2A01 and every prior version remain exact. */
export const QUESTION_BANK_BATCH2A_ROUND2_DEFINITIONS: QuestionBankBatch2aRevision[] = [
  {
    "id": "revision.qbp2ar2.20261104.b2a02",
    "auditId": "B2A02",
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v2.r5",
    "questionVariantId": "question.achalasia.manometric-recognition.v2.r6",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which treatment should be offered to {patientName} on the basis of this workup?",
    "previousChoiceLabels": [
      "Laparoscopic Heller myotomy",
      "Oral omeprazole therapy",
      "Oral isosorbide dinitrate therapy"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Constructed technically adequate pressure study; references are specific to this laboratory.",
      "items": [
        {
          "label": "Primary supine series",
          "value": "Ten wet swallows; median relaxation pressure above the laboratory upper reference limit"
        },
        {
          "label": "Secondary upright series",
          "value": "Median relaxation pressure within the reference range"
        },
        {
          "label": "Esophageal body in both positions",
          "value": "Every swallow has DCI below 100 mmHg.s.cm; no premature or propagated distal contraction"
        }
      ]
    },
    "currentUpdate": "At return, {patientName} reports continuing unintentional weight loss. The endoscopy record describes resistance as the instrument crossed the junction; mucosal samples contain no malignancy. An interval CT shows eccentric thickening of the gastric cardia extending across the junction.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize that the primary-position motor pattern is not negated by the upright measurement. Then: Use the new wall/mucosal discordance to prioritize deeper etiologic assessment over further motor or emptying measurement.",
    "reviewerNotes": "One directly checked ACG guideline supports the secondary-lesion boundary. The exact EUS sampling approach is an offline clinical application requiring foregut review. The earlier Heller/PPI/nitrate source hold remains attached to the retained prior version, not cleared by this rewrite.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_2": "achalasia_2",
      "choice.qbp2ar2.20261104.b2a02.d1": "choice.qbp2a.20261104.b2a02.d1",
      "choice.qbp2ar2.20261104.b2a02.d2": "choice.qbp2a.20261104.b2a02.d2"
    },
    "choiceServiceOverrides": {
      "achalasia_2": null,
      "choice.qbp2ar2.20261104.b2a02.d1": null,
      "choice.qbp2ar2.20261104.b2a02.d2": null
    },
    "choiceTimingOverrides": {
      "achalasia_2": {
        "kind": "test",
        "timingProfileId": "timing.test.endoscopy_with_sampling"
      },
      "choice.qbp2ar2.20261104.b2a02.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.upper_endoscopy"
      },
      "choice.qbp2ar2.20261104.b2a02.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.contrast_swallow"
      }
    },
    "question": {
      "id": "question.achalasia.manometric-recognition.v2.r6",
      "conceptId": "concept.achalasia.secondary-junction-lesion-assessment.v1",
      "stem": "Which procedure should be requested next for {patientName}?",
      "answerChoices": [
        {
          "id": "achalasia_2",
          "label": "Endoscopic ultrasound with wall sampling",
          "isCorrect": true,
          "rationale": "The motor pattern does not exclude a secondary junction process. Eccentric wall thickening and resistance despite unrevealing mucosal samples make deeper wall assessment the priority among these procedures.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a02.d1",
          "label": "Functional lumen imaging probe distensibility study",
          "isCorrect": false,
          "distractorRationale": "This can complement equivocal motor assessment, but another distensibility measurement does not establish the cause of the focal wall abnormality."
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a02.d2",
          "label": "Timed barium esophagram with a tablet",
          "isCorrect": false,
          "distractorRationale": "This can characterize bolus emptying, but the new wall finding requires etiologic tissue assessment rather than another measure of impaired passage."
        }
      ],
      "explanation": "Separate recognition of the motor pattern from attribution to primary disease. The primary-position study can support an achalasia pattern despite the upright value, but the wall abnormality and weight trajectory require evaluation for a secondary junction lesion. Endoscopic ultrasonography can assess and sample tissue beyond the mucosa. Neither another emptying study nor a distensibility study resolves the new wall finding.",
      "teachingPoint": "Separate recognition of the motor pattern from attribution to primary disease. The primary-position study can support an achalasia pattern despite the upright value, but the wall abnormality and weight trajectory require evaluation for a secondary junction lesion. Endoscopic ultrasonography can assess and sample tissue beyond the mucosa. Neither another emptying study nor a distensibility study resolves the new wall finding.",
      "supportingEvidenceClaimIds": [
        "claim.qq20261102a.primary-position-achalasia",
        "claim.qq20261102b.secondary-achalasia-assessment",
        "claim.qq20261102c.hrm-incomplete-placement",
        "claim.qbp2ar2.junction-wall-assessment"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed pressure-study observations; reference intervals belong to this laboratory.",
        "items": [
          {
            "label": "Primary supine acquisition",
            "value": "Separated water swallows with the catheter spanning the junction; relaxation pressure above the laboratory upper reference limit"
          },
          {
            "label": "Secondary upright acquisition",
            "value": "Relaxation pressure within the laboratory reference interval"
          },
          {
            "label": "Body channels",
            "value": "No propagated distal contraction in either position"
          }
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.achalasia.physiology-directed-treatment.v1",
      "nextConceptId": "concept.achalasia.secondary-junction-lesion-assessment.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored action changes from selecting a primary-achalasia treatment to investigating a secondary junction lesion. Retain the prior treatment construct and all held treatment claims."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B02",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the adequacy label and the operation-versus-oral-therapy contrast. All choices are named specialist investigations. Added interval wall observations that change the next action; the old unverified treatment ranking is not scored by this version.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2ar2.20261104.b2a03",
    "auditId": "B2A03",
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v2.r7",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r8",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which investigation should be arranged next for {patientName}’s dysphagia?",
    "previousChoiceLabels": [
      "Repeat standard high-resolution esophageal manometry",
      "Obtain a timed barium esophagram with a tablet",
      "Obtain ambulatory esophageal pH-impedance monitoring"
    ],
    "previousCurrentUpdate": "The catheter spans the junction. The outside recording contains three water swallows in quick succession, each beginning before the preceding pressure response has ended. A distal contraction appears after the final swallow. The remaining attempts stopped during retching.",
    "previousExhibit": null,
    "currentUpdate": "The outside acquisition log records a catheter crossing the junction. The saved sequences show successive water swallows beginning before the preceding response has ended. Body pressure remains low during each sequence; a distal contraction follows its end.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Identify inhibition/recovery as a provocative sequence rather than baseline failed peristalsis. Then: Select the specific acquisition that supplies the classification needed for clinical planning.",
    "reviewerNotes": "No new swallow count, volume, interval or diagnostic cutoff. This acquisition-only task does not select a next-modality sequence or a catheter-tolerance plan; those remain separate clinical matters.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "manometry_2": "manometry_2",
      "choice.qbp2ar2.20261104.b2a03.d1": "choice.qbp2a.20261104.b2a03.d1",
      "choice.qbp2ar2.20261104.b2a03.d2": "choice.qbp2a.20261104.b2a03.d2"
    },
    "choiceServiceOverrides": {
      "manometry_2": "service.esophageal_manometry",
      "choice.qbp2ar2.20261104.b2a03.d1": null,
      "choice.qbp2ar2.20261104.b2a03.d2": null
    },
    "choiceTimingOverrides": {
      "manometry_2": {
        "kind": "test",
        "timingProfileId": "timing.test.esophageal_manometry"
      },
      "choice.qbp2ar2.20261104.b2a03.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.esophageal_manometry"
      },
      "choice.qbp2ar2.20261104.b2a03.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.esophageal_manometry"
      }
    },
    "question": {
      "id": "question.achalasia.high-resolution-manometry.v2.r8",
      "conceptId": "concept.achalasia.high-resolution-manometry.v2",
      "stem": "Which acquisition should be requested to classify {patientName}’s esophageal body motility?",
      "answerChoices": [
        {
          "id": "manometry_2",
          "label": "Separated single-water-swallow pressure series",
          "isCorrect": true,
          "rationale": "The existing sequences test inhibition and recovery; they do not supply a separated baseline series for body classification.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a03.d1",
          "label": "Repeated multiple-rapid-swallow pressure series",
          "isCorrect": false,
          "distractorRationale": "More rapid sequences may reproduce inhibition and recovery but do not supply the missing baseline classification."
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a03.d2",
          "label": "Continuous rapid-water-drinking pressure series",
          "isCorrect": false,
          "distractorRationale": "A liquid-load challenge addresses outflow under a different load rather than replacing baseline peristaltic assessment."
        }
      ],
      "explanation": "Interpret what was acquired, not simply how many traces were saved. Inhibition during rapid swallowing and a recovery contraction are not a diagnostic baseline body series. Request separated single-water swallows for that classification. A rapid-drink acquisition answers a different physiological question. This task selects the required acquisition; it does not impose a universal repeat-manometry-versus-barium sequence after catheter intolerance.",
      "teachingPoint": "Interpret what was acquired, not simply how many traces were saved. Inhibition during rapid swallowing and a recovery contraction are not a diagnostic baseline body series. Request separated single-water swallows for that classification. A rapid-drink acquisition answers a different physiological question. This task selects the required acquisition; it does not impose a universal repeat-manometry-versus-barium sequence after catheter intolerance.",
      "supportingEvidenceClaimIds": [
        "claim.qq20261102c.hrm-protocol-and-provocation",
        "claim.qq20261102d.hrm-rapid-swallow-interpretation",
        "claim.qq20261102d.hrm-rapid-drink-purpose"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.achalasia.high-resolution-manometry.v2",
      "nextConceptId": "concept.achalasia.high-resolution-manometry.v2",
      "previousKeyServiceId": "service.esophageal_manometry",
      "nextKeyServiceId": "service.esophageal_manometry",
      "previousResultGate": {
        "id": "gate.achalasia.manometry.2",
        "resultTypeId": "service.esophageal_manometry",
        "pendingLabel": "Esophageal manometry pending",
        "resultNarrative": "The esophageal pressure-study report is available for review.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.esophageal_manometry.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.achalasia.manometry.2",
        "resultTypeId": "service.esophageal_manometry",
        "pendingLabel": "Esophageal manometry pending",
        "resultNarrative": "The esophageal pressure-study report is available for review.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.esophageal_manometry.outsourced"
        ]
      },
      "reason": "Same assessment-adequacy objective; the next acquisition is specified instead of asserting a universal investigation sequence after intolerance."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B02-context",
      "reviewedOn": "2026-11-04",
      "whatChanged": "All options are parallel acquisitions within the same test, removing the unfinished-test-to-repeat shortcut and the ambiguous barium-versus-repeat hierarchy. The acquisition log replaces inference from retained images; intolerance/recovery framing is deleted because no next-modality sequence is scored.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2ar2.20261104.b2a04",
    "auditId": "B2A04",
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v3.r9",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3.r10",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which paired interpretation best fits {patientName}’s displayed recordings?",
    "previousChoiceLabels": [
      "Reduced contraction reserve with preserved liquid-load outflow",
      "Preserved contraction reserve with impaired liquid-load outflow",
      "Reduced contraction reserve with impaired liquid-load outflow",
      "Preserved contraction reserve with preserved liquid-load outflow"
    ],
    "previousCurrentUpdate": "An outside pressure study includes the baseline swallow and repeat challenge recordings shown in the exhibit.",
    "previousExhibit": {
      "kind": "image",
      "caption": "Constructed pressure-study schematic; qualitative teaching observations, not a patient recording.",
      "assetPath": "clinical-exhibits/batch2a-b03-pressure.png",
      "description": "Panel A shows a propagated baseline esophageal-body contraction. In both rapid-swallow repeats, body pressure falls during the sequence and the contraction afterwards is smaller than the baseline contraction. During the rapid-drink panel the junction relaxes within the laboratory range and no body-wide pressure column develops. The familiar discomfort occurs during that drink.",
      "width": 1200,
      "height": 720
    },
    "currentUpdate": "For the illustrated pressure study, the software-derived pressure-time-length integral of each recovery contraction is below that of the separated baseline contraction.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the recovery integrals as reduced reserve without treating them as an outflow diagnosis. Then: Choose complementary emptying assessment instead of junction disruption from discomfort alone.",
    "reviewerNotes": "Corroborating emptying assessment is a guideline-based offline application; it does not establish a universal ordering preference over FLIP. The retained following item supplies a separate full pressure report and medication exposure; it is not edited or pre-explained here.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "manometry_3": "manometry_3",
      "choice.qbp2ar2.20261104.b2a04.d1": "choice.qbp2a.20261104.b2a04.d1",
      "choice.qbp2ar2.20261104.b2a04.d2": "choice.qbp2a.20261104.b2a04.d2",
      "choice.qbp2ar2.20261104.b2a04.d3": "choice.qbp2a.20261104.b2a04.d3"
    },
    "choiceServiceOverrides": {
      "manometry_3": "service.contrast_swallow",
      "choice.qbp2ar2.20261104.b2a04.d1": null,
      "choice.qbp2ar2.20261104.b2a04.d2": null,
      "choice.qbp2ar2.20261104.b2a04.d3": null
    },
    "choiceTimingOverrides": {
      "manometry_3": {
        "kind": "test",
        "timingProfileId": "timing.test.contrast_swallow"
      },
      "choice.qbp2ar2.20261104.b2a04.d1": {
        "kind": "no_test"
      },
      "choice.qbp2ar2.20261104.b2a04.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.contrast_swallow"
      },
      "choice.qbp2ar2.20261104.b2a04.d3": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.achalasia.high-resolution-manometry.v3.r10",
      "conceptId": "concept.esophageal-physiology.reserve-before-junction-intervention.v1",
      "stem": "Which interpretation and next plan best fit {patientName}’s recordings?",
      "answerChoices": [
        {
          "id": "manometry_3",
          "label": "Reduced contraction reserve; obtain a timed barium esophagram",
          "isCorrect": true,
          "rationale": "The reduced recovery integral concerns reserve, not proof of a junction obstruction. Assess actual emptying before selecting junction-disrupting treatment.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a04.d1",
          "label": "Reduced contraction reserve; arrange pneumatic junction dilation",
          "isCorrect": false,
          "distractorRationale": "The reserve finding does not itself establish an outflow lesion that would justify dilation."
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a04.d2",
          "label": "Preserved contraction reserve; obtain a timed barium esophagram",
          "isCorrect": false,
          "distractorRationale": "An emptying assessment is reasonable, but the stated recovery integrals do not demonstrate augmentation."
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a04.d3",
          "label": "Preserved contraction reserve; arrange pneumatic junction dilation",
          "isCorrect": false,
          "distractorRationale": "This both overcalls augmentation and converts discomfort into an unsupported indication to disrupt the junction."
        }
      ],
      "explanation": "The instrument-derived integral, rather than peak height in the schematic, supports reduced reserve. That finding does not establish impaired junction outflow. Pressure behavior during drinking does not directly measure bolus clearance; a timed esophagram supplies complementary emptying information. Discomfort does not by itself justify pneumatic dilation. No superiority over FLIP or every other corroborating test is claimed.",
      "teachingPoint": "The instrument-derived integral, rather than peak height in the schematic, supports reduced reserve. That finding does not establish impaired junction outflow. Pressure behavior during drinking does not directly measure bolus clearance; a timed esophagram supplies complementary emptying information. Discomfort does not by itself justify pneumatic dilation. No superiority over FLIP or every other corroborating test is claimed.",
      "supportingEvidenceClaimIds": [
        "claim.qq20261102d.hrm-rapid-swallow-interpretation",
        "claim.qq20261102d.hrm-rapid-drink-purpose",
        "claim.qq20261102.motility-egjoo",
        "claim.qbp2ar2.reserve-emptying-boundary"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "image",
        "caption": "Constructed pressure recordings; qualitative traces with separate laboratory analysis, not patient measurements.",
        "assetPath": "clinical-exhibits/batch2a-r2-b04-pressure.png",
        "description": "Panel A shows a pressure peak traveling from the upper to the lower body channel. Both rapid-swallow repeats show inhibition during the sequence and a recovery response afterwards. The laboratory-derived recovery integral is below the baseline integral in both repeats. During rapid drinking, junction relaxation measurements remain within the laboratory reference interval and there is no body-wide pressure column; the patient reports discomfort.",
        "width": 1200,
        "height": 720
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.achalasia.high-resolution-manometry.v3",
      "nextConceptId": "concept.esophageal-physiology.reserve-before-junction-intervention.v1",
      "previousKeyServiceId": "service.esophageal_manometry",
      "nextKeyServiceId": "service.contrast_swallow",
      "previousResultGate": {
        "id": "gate.achalasia.manometry.3",
        "resultTypeId": "service.esophageal_manometry",
        "pendingLabel": "Esophageal manometry pending",
        "resultNarrative": "Medication reconciliation shows that {patientName} takes oxycodone regularly for back pain and took it before the pressure study. The prescribing team can supervise a medication adjustment, and the patient can maintain oral intake during reassessment.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.esophageal_manometry.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.achalasia.contrast.batch2a-r2.3",
        "resultTypeId": "service.contrast_swallow",
        "pendingLabel": "Contrast esophagram pending",
        "resultNarrative": "The timed contrast images retain a barium column above the junction; the tablet remains at the junction during the recorded examination. The outside laboratory also supplies a more recent full pressure study, acquired after the illustrated challenge recording, for the interval review. Medication reconciliation records oxycodone taken before that later pressure study.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.contrast_swallow.outsourced"
        ]
      },
      "reason": "The prior task classified two pressure axes. This version makes that interpretation consequential for investigation versus intervention; preserve the older classification construct."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B03-context",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Kept an actual image and accessible observations, supplied the integral analysis that peak height cannot establish, and replaced the unsupported preserved-clearance label with a balanced interpretation/action matrix. The choice now changes care.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2ar2.20261104.b2a05",
    "auditId": "B2A05",
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r9",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r10",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which next plan should be offered for {patientName}’s remaining work limitation?",
    "previousChoiceLabels": [
      "Offer elective inguinal hernia repair",
      "Repeat a course of hip rehabilitation",
      "Repeat targeted dynamic groin ultrasonography"
    ],
    "previousCurrentUpdate": "At review the deep ache on hip rotation has subsided. During stock lifting, a superficial groin lump still makes {patientName} stop; the episode settles when the lump is pressed back. Standing cough reproduces the lump on examination. Lying supine makes it withdraw.",
    "previousExhibit": null,
    "currentUpdate": "A hip radiograph shows joint-space narrowing and marginal osteophytes.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish the symptomatic roles of the joint and reproduced protrusion. Then: Use the current activity limit to choose repair referral rather than treating the inguinal finding as minimally symptomatic.",
    "reviewerNotes": "The functional observations and radiograph are synthetic qualitative case details, not proof of a universal pain-attribution rule. Repair is a discussion/referral, not an automatic operation or cure of all groin pain.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "elective_discussion_4": "elective_discussion_4",
      "choice.qbp2ar2.20261104.b2a05.d1": "choice.qbp2a.20261104.b2a05.d1",
      "choice.qbp2ar2.20261104.b2a05.d2": "choice.qbp2a.20261104.b2a05.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_4": null,
      "choice.qbp2ar2.20261104.b2a05.d1": null,
      "choice.qbp2ar2.20261104.b2a05.d2": null
    },
    "choiceTimingOverrides": {
      "elective_discussion_4": {
        "kind": "no_test"
      },
      "choice.qbp2ar2.20261104.b2a05.d1": {
        "kind": "no_test"
      },
      "choice.qbp2ar2.20261104.b2a05.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v4.r10",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "stem": "Which plan should be offered for {patientName}’s stock-handling limitation?",
      "answerChoices": [
        {
          "id": "elective_discussion_4",
          "label": "Refer for elective inguinal hernia repair",
          "isCorrect": true,
          "rationale": "The limiting stock task reproduces the protrusion-associated episode. The coexisting hip changes do not establish the cause of that particular limitation.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a05.d1",
          "label": "Continue inguinal hernia surveillance with graded activity",
          "isCorrect": false,
          "distractorRationale": "This is reasonable for a minimally symptomatic inguinal hernia, but the current full-load work task is limited by the protrusion-associated event."
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a05.d2",
          "label": "Refer for hip-directed physiotherapy",
          "isCorrect": false,
          "distractorRationale": "This addresses a real separate symptom, but the observed stock-lifting episode is localized to the protrusion rather than the reproduced joint-line ache."
        }
      ],
      "explanation": "Do not let a positive radiograph select the treatment target without matching the activity that fails. Hip symptoms remain present, but the stock-handling limit accompanies the reducible inguinal finding. This is not a minimally symptomatic watchful-waiting presentation. Refer for elective repair planning while treating the joint complaint separately; no promise is made that repair will cure all groin pain.",
      "teachingPoint": "Do not let a positive radiograph select the treatment target without matching the activity that fails. Hip symptoms remain present, but the stock-handling limit accompanies the reducible inguinal finding. This is not a minimally symptomatic watchful-waiting presentation. Refer for elective repair planning while treating the joint complaint separately; no promise is made that repair will cure all groin pain.",
      "supportingEvidenceClaimIds": [
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution",
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qbp2ar2.functional-groin-target"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Observed activity record; the rows describe the same review visit.",
        "columnHeaders": [
          "Activity",
          "Observation",
          "Function"
        ],
        "rowHeaders": [
          "Hip examination",
          "Stock handling"
        ],
        "cells": [
          [
            "Passive hip rotation",
            "Deep joint-line ache",
            "The ache also occurs on the walk to work"
          ],
          [
            "Lifting a stock crate",
            "A lump above and medial to the pubic tubercle appears with focal pressure",
            "The patient puts the crate down; the lump withdraws when supine"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same functional symptom-attribution and elective-repair planning objective; no concept change."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B05-context",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed symptom-resolution exclusions, reduction-causes-relief wording, unsupported repeat testing and an unneeded third pain source. A second inguinal care plan prevents diagnosis-name matching; the hip finding remains a genuine competitor. Added the location needed for the inguinal designation.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2ar2.20261104.b2a06",
    "auditId": "B2A06",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r7",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r8",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which investigation should be arranged next for {patientName}’s intermittent groin swelling?",
    "previousChoiceLabels": [
      "Repeat dynamic groin ultrasound",
      "Obtain dynamic groin MRI",
      "Obtain contrast-enhanced pelvic CT"
    ],
    "previousCurrentUpdate": "The outside ultrasound report contains two saved supine views at the tender adductor attachment. The phone photograph places the intermittent swelling higher, in the inguinal region.",
    "previousExhibit": null,
    "currentUpdate": "The sonographer’s acquisition worksheet records a supine musculoskeletal examination of the adductor origin with resisted adduction; it reproduces the medial-thigh pain. During today’s examination, supine cough does not produce the photographed contour. After standing and straining, a separate contour appears above the pubic tubercle.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish the structure/provocation already assessed from the separate intermittent contour. Then: Choose the acquisition that tests the latter clinical finding rather than repeating its non-reproducing posture or the attachment study.",
    "reviewerNotes": "Protocol selection is an offline clinical application, not a measured ultrasound-versus-MRI accuracy claim. The image/skin observations do not independently diagnose a hernia or rule out all vascular alternatives.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_2": "dynamic_ultrasound_2",
      "choice.qbp2ar2.20261104.b2a06.d1": "choice.qbp2a.20261104.b2a06.d1",
      "choice.qbp2ar2.20261104.b2a06.d2": "choice.qbp2a.20261104.b2a06.d2",
      "choice.qbp2ar2.20261104.b2a06.d3": "choice.qbp2a.20261104.b2a06.d1"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_2": "service.ultrasound",
      "choice.qbp2ar2.20261104.b2a06.d1": null,
      "choice.qbp2ar2.20261104.b2a06.d2": null,
      "choice.qbp2ar2.20261104.b2a06.d3": null
    },
    "choiceTimingOverrides": {
      "dynamic_ultrasound_2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qbp2ar2.20261104.b2a06.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qbp2ar2.20261104.b2a06.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qbp2ar2.20261104.b2a06.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "question": {
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r8",
      "conceptId": "concept.groin-ultrasound.symptom-provocation-protocol.v1",
      "stem": "Which ultrasound request should be sent for {patientName}’s intermittent groin contour?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_2",
          "label": "Standing strain; cine ultrasound of groin canals",
          "isCorrect": true,
          "rationale": "This tests the posture and provocation associated with the separate contour while assessing hernia anatomy.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a06.d1",
          "label": "Supine strain; cine ultrasound of groin canals",
          "isCorrect": false,
          "distractorRationale": "This is a hernia protocol but repeats the posture that has not reproduced the clinical contour; standing assessment directly addresses this observed discrepancy."
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a06.d2",
          "label": "Standing compression; Doppler ultrasound of groin veins",
          "isCorrect": false,
          "distractorRationale": "A posture-dependent venous swelling is a credible alternative, but the suprapubic strain-associated contour is better addressed first by dynamic canal assessment."
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a06.d3",
          "label": "Supine compression; Doppler ultrasound of groin veins",
          "isCorrect": false,
          "distractorRationale": "This tests a vascular alternative in a non-reproducing posture rather than assessing the canal contour during its observed trigger."
        }
      ],
      "explanation": "The acquisition worksheet establishes what was examined; saved-image count alone would not. Separate the attachment pain from the posture/strain-dependent contour, then request dynamic canal imaging in the reproducing position. The alternatives are actual ultrasound acquisitions rather than routine escalation to MRI. This does not make MRI inappropriate after a clinically adequate but unresolved groin assessment.",
      "teachingPoint": "The acquisition worksheet establishes what was examined; saved-image count alone would not. Separate the attachment pain from the posture/strain-dependent contour, then request dynamic canal imaging in the reproducing position. The alternatives are actual ultrasound acquisitions rather than routine escalation to MRI. This does not make MRI inappropriate after a clinically adequate but unresolved groin assessment.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment",
        "claim.qq20261102c.groin-inadequate-study-certainty",
        "claim.qbp2ar2.dynamic-groin-protocol"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "nextConceptId": "concept.groin-ultrasound.symptom-provocation-protocol.v1",
      "previousKeyServiceId": "service.ultrasound",
      "nextKeyServiceId": "service.ultrasound",
      "previousResultGate": {
        "id": "gate.inguinal-hernia.ultrasound.2",
        "resultTypeId": "service.ultrasound",
        "pendingLabel": "Targeted dynamic groin ultrasound pending",
        "resultNarrative": "Targeted dynamic ultrasound shows an inguinal protrusion during strain that reduces while supine. Resisted adduction reproduces the separate medial-thigh pain. Coughing causes a brief groin twinge, but the patient completes lifting at work. Running stops because of medial-thigh pain reproduced by resisted adduction. Passive hip rotation does not reproduce that pain.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ultrasound.outsourced",
          "route.ultrasound.in_house"
        ]
      },
      "nextResultGate": {
        "id": "gate.inguinal-hernia.ultrasound.2",
        "resultTypeId": "service.ultrasound",
        "pendingLabel": "Targeted dynamic groin ultrasound pending",
        "resultNarrative": "Targeted dynamic ultrasound shows an inguinal protrusion during strain that reduces while supine. Resisted adduction reproduces the separate medial-thigh pain. Coughing causes a brief groin twinge, but the patient completes lifting at work. Running stops because of medial-thigh pain reproduced by resisted adduction. Passive hip rotation does not reproduce that pain.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ultrasound.outsourced",
          "route.ultrasound.in_house"
        ]
      },
      "reason": "The scored decision changes from selecting a next imaging modality to selecting the actual acquisition within ultrasound. Retain the original imaging-adequacy construct."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B06",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Used an actual acquisition worksheet and current examination, not saved views as proof of a missing study. Removed MRI/CT hierarchy and compared four specific ultrasound protocols; key is neither the only standing option nor the only canal option.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2ar2.20261104.b2a07",
    "auditId": "B2A07",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r9",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r10",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which care priority best fits {patientName}'s current functional record?",
    "previousChoiceLabels": [
      "Hernia assessment with continued graded activity",
      "Hernia observation with continued graded activity",
      "Attachment reassessment with continued graded activity"
    ],
    "previousCurrentUpdate": "After the targeted ultrasound, {patientName} continues the graded exercise program with hernia observation. At review, jogging lasts longer. The rota lists completed work shifts, but the accompanying duty log records that a colleague now handles the stock crates. During an observed attempt to resume crate handling, the patient sets the crate down with pressure at the photographed groin contour; the contour withdraws on lying down. Resisted adduction still causes medial-thigh discomfort, but ordinary walking and the exercises are completed.",
    "previousExhibit": null,
    "currentUpdate": "The targeted ultrasound shows a protrusion in the inguinal canal during strain that withdraws at rest. On interval review, jogging distance has increased. The rota records completed shifts, with crate handling assigned to a colleague.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize that the rota reflects modified work rather than recovery of the original task. Then: Combine the current load-provoked event with the demonstrated canal finding to choose a specific treatment referral.",
    "reviewerNotes": "This companion has no separate owner approval. Its new action and visible history require independent review; improvement in one activity does not quantify overall operative benefit.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "elective_discussion_2": "elective_discussion_2",
      "choice.qbp2ar2.20261104.b2a07.d1": "choice.qq20261102f.b06-context.d1",
      "choice.qbp2ar2.20261104.b2a07.d2": "choice.qq20261102f.b06-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_2": null,
      "choice.qbp2ar2.20261104.b2a07.d1": null,
      "choice.qbp2ar2.20261104.b2a07.d2": null
    },
    "choiceTimingOverrides": {
      "elective_discussion_2": {
        "kind": "no_test"
      },
      "choice.qbp2ar2.20261104.b2a07.d1": {
        "kind": "no_test"
      },
      "choice.qbp2ar2.20261104.b2a07.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v2.r10",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "stem": "Which plan should address {patientName}’s continuing work restriction?",
      "answerChoices": [
        {
          "id": "elective_discussion_2",
          "label": "Elective inguinal hernia repair referral",
          "isCorrect": true,
          "rationale": "Current full-task testing supports a hernia-related work limit despite better exercise performance and completed modified shifts.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a07.d1",
          "label": "Supervised adductor strengthening rehabilitation",
          "isCorrect": false,
          "distractorRationale": "This can address the attachment complaint but does not account for the current load-triggered inguinal event."
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a07.d2",
          "label": "Inguinal hernia surveillance with graded activity",
          "isCorrect": false,
          "distractorRationale": "This can maintain work participation, but completed modified shifts do not establish tolerance of the original stock task or address its demonstrated hernia-related restriction."
        }
      ],
      "explanation": "Completed modified shifts do not establish tolerance of the original job. The earlier ultrasound demonstrates the anatomical finding; the current full-task observation determines its functional importance now. Elective repair referral is the offered action directed at that restriction. Continue to distinguish the separate attachment complaint rather than promising that repair treats it.",
      "teachingPoint": "Completed modified shifts do not establish tolerance of the original job. The earlier ultrasound demonstrates the anatomical finding; the current full-task observation determines its functional importance now. Elective repair referral is the offered action directed at that restriction. Continue to distinguish the separate attachment complaint rather than promising that repair treats it.",
      "supportingEvidenceClaimIds": [
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102c.groin-symptom-attribution",
        "claim.qbp2ar2.functional-groin-target"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Current function after the earlier ultrasound; no global recovery rating is supplied.",
        "columnHeaders": [
          "Task",
          "Observation"
        ],
        "rowHeaders": [
          "Graded exercise",
          "Full stock task",
          "Attachment examination"
        ],
        "cells": [
          [
            "Walking and the prescribed running intervals",
            "Completed"
          ],
          [
            "Handling the usual stock crate",
            "The inguinal contour appears; focal groin pressure makes the patient set it down"
          ],
          [
            "Resisted adduction",
            "Medial-thigh discomfort remains during the maneuver"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same functional reassessment and elective-repair referral objective; no concept change."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B06-context-continuity",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Made the ultrasound finding visible, retained the useful duty-log inference, and replaced overlapping generic priority labels with named treatment referrals. Removed the preselected hernia-observation plan and shared continued-activity wording.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2ar2.20261104.b2a08",
    "auditId": "B2A08",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r9",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r10",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which next plan should be offered for {patientName}’s continuing lifting limitation?",
    "previousChoiceLabels": [
      "Offer elective inguinal hernia repair",
      "Repeat supervised adductor rehabilitation",
      "Repeat targeted dynamic groin ultrasonography"
    ],
    "previousCurrentUpdate": "After the exercise course, resisted adduction produces less pubic discomfort. Lifting the relative still brings out the inguinal lump and makes {patientName} put the relative down. Pressing the lump back relieves that episode. The same lump appears during standing strain and withdraws when supine.",
    "previousExhibit": null,
    "currentUpdate": "At interval review, {patientName} can complete the usual lifting task, although a groin contour still appears. The abdomen is soft and not distended. The earlier report called the contour inguinal.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the current ligament/venous relationship instead of copying the earlier inguinal label. Then: Apply the femoral repair boundary despite a reducible finding and improved lifting tolerance.",
    "reviewerNotes": "Current re-localization is explicit; the retained preceding report is not silently edited. Anatomy is independently synthesized from existing groin references and requires clinician confirmation. No incarceration probability or fixed repair interval is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "elective_discussion_3": "elective_discussion_3",
      "choice.qbp2ar2.20261104.b2a08.d1": "choice.qbp2a.20261104.b2a08.d1",
      "choice.qbp2ar2.20261104.b2a08.d2": "choice.qbp2a.20261104.b2a08.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_3": null,
      "choice.qbp2ar2.20261104.b2a08.d1": null,
      "choice.qbp2ar2.20261104.b2a08.d2": null
    },
    "choiceTimingOverrides": {
      "elective_discussion_3": {
        "kind": "no_test"
      },
      "choice.qbp2ar2.20261104.b2a08.d1": {
        "kind": "no_test"
      },
      "choice.qbp2ar2.20261104.b2a08.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v3.r10",
      "conceptId": "concept.groin-hernia.femoral-defect-repair-priority.v1",
      "stem": "Which plan should be offered for {patientName}’s groin finding?",
      "answerChoices": [
        {
          "id": "elective_discussion_3",
          "label": "Arrange planned groin hernia repair",
          "isCorrect": true,
          "rationale": "The current landmarks identify a femoral pathway. Mild or absent current limitation does not put that finding into the usual male inguinal watchful-waiting group.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a08.d1",
          "label": "Arrange outpatient groin hernia surveillance",
          "isCorrect": false,
          "distractorRationale": "Observation is credible for selected minimally symptomatic inguinal hernias in men, but the new anatomical evidence changes which rule applies."
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a08.d2",
          "label": "Arrange urgent groin hernia exploration",
          "isCorrect": false,
          "distractorRationale": "Femoral anatomy changes the elective repair indication, but the current reducing sac and nonacute abdominal findings do not establish an emergency exploration indication."
        }
      ],
      "explanation": "Reconcile the current landmarks with the old report label before using a watchful-waiting rule. A sac below the inguinal ligament and medial to the femoral vein follows the femoral canal. A stable reducible femoral hernia calls for timely elective repair planning even with mild symptoms. The attachment complaint remains separate; no emergency deadline or operative technique is specified.",
      "teachingPoint": "Reconcile the current landmarks with the old report label before using a watchful-waiting rule. A sac below the inguinal ligament and medial to the femoral vein follows the femoral canal. A stable reducible femoral hernia calls for timely elective repair planning even with mild symptoms. The attachment complaint remains separate; no emergency deadline or operative technique is specified.",
      "supportingEvidenceClaimIds": [
        "claim.bread-butter.inguinal-hernia.watchful-waiting",
        "claim.bread-butter.femoral-hernia.timely-repair",
        "claim.qbp2ar2.femoral-anatomy-application"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Current targeted groin ultrasound observations.",
        "columnHeaders": [
          "Observation",
          "Recorded finding"
        ],
        "rowHeaders": [
          "Ligament landmark",
          "Vascular landmark",
          "Strain and rest"
        ],
        "cells": [
          [
            "Position of the sac neck",
            "Below the inguinal ligament"
          ],
          [
            "Position relative to the common femoral vein",
            "Medial to the vein"
          ],
          [
            "Behavior",
            "A peritoneal sac enters during strain and withdraws at rest"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "nextConceptId": "concept.groin-hernia.femoral-defect-repair-priority.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored objective changes from symptom-prioritized inguinal repair to anatomical reclassification and the femoral repair exception. Retain the previous inguinal care-priority construct."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B07-context",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Differentiated this item from the work-limiting inguinal cases. Replaced unsupported repeat imaging with real management competitors, and made current anatomy change the ranking of observation versus repair.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2ar2.20261104.b2a09",
    "auditId": "B2A09",
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r9",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r10",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which next diagnostic step should be arranged for {patientName}’s remaining lesion?",
    "previousChoiceLabels": [
      "Perform a narrow-margin excisional biopsy",
      "Perform a punch biopsy of the darker portion",
      "Request deeper histological sections from the block"
    ],
    "previousCurrentUpdate": "A punch from the pale lateral edge contains a nevus. The darker medial portion remains in place and has enlarged on serial photographs.",
    "previousExhibit": null,
    "currentUpdate": "The report describes a junctional nevus in the submitted tissue.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Limit a valid fragment diagnosis to its mapped footprint rather than calling it false. Then: Select the breadth-and-depth diagnostic specimen needed for the newly changed residual focus.",
    "reviewerNotes": "No new numerical lesion size, diagnostic margin or depth threshold. Whole-lesion technique suitability still needs clinician review; no claim that partial biopsy is universally wrong or that the valid nevus fragment proves malignancy.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "excisional_4": "excisional_4",
      "choice.qbp2ar2.20261104.b2a09.d1": "choice.qbp2a.20261104.b2a09.d1",
      "choice.qbp2ar2.20261104.b2a09.d2": "choice.qbp2a.20261104.b2a09.d2"
    },
    "choiceServiceOverrides": {
      "excisional_4": "service.skin_excisional_biopsy",
      "choice.qbp2ar2.20261104.b2a09.d1": null,
      "choice.qbp2ar2.20261104.b2a09.d2": null
    },
    "choiceTimingOverrides": {
      "excisional_4": {
        "kind": "test",
        "timingProfileId": "timing.test.excisional_biopsy"
      },
      "choice.qbp2ar2.20261104.b2a09.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.cutaneous_lesion_biopsy"
      },
      "choice.qbp2ar2.20261104.b2a09.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r10",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v5",
      "stem": "Which diagnostic plan should be arranged next for {patientName}?",
      "answerChoices": [
        {
          "id": "excisional_4",
          "label": "Narrow-margin excision of the residual patch",
          "isCorrect": true,
          "rationale": "This supplies architecture and depth across the unassessed remainder rather than treating the valid fragment result as a whole-lesion assessment.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a09.d1",
          "label": "Deep punch biopsy through the medial focus",
          "isCorrect": false,
          "distractorRationale": "This may sample the new focus but can still leave the architecture and maximum depth of a heterogeneous residual patch incompletely represented."
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a09.d2",
          "label": "Schedule photographic review of the residual patch",
          "isCorrect": false,
          "distractorRationale": "The prior fragment does not settle a new focus outside its footprint. Continued documentation does not provide the representative tissue needed for that changed clinical finding."
        }
      ],
      "explanation": "The fragment diagnosis remains valid for its represented tissue. It does not classify a new focus outside the footprint or establish the depth of the residual lesion. A complete full-thickness diagnostic specimen with narrow margins is the preferred offered approach at this localized upper-arm site. Definitive wide margins and nodal planning are not selected from this fragment, and selected partial or deep saucerization techniques can be appropriate in other settings.",
      "teachingPoint": "The fragment diagnosis remains valid for its represented tissue. It does not classify a new focus outside the footprint or establish the depth of the residual lesion. A complete full-thickness diagnostic specimen with narrow margins is the preferred offered approach at this localized upper-arm site. Definitive wide margins and nodal planning are not selected from this fragment, and selected partial or deep saucerization techniques can be appropriate in other settings.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
        "claim.qbp2ar2.skin-specimen-map"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Specimen and interval record; the fragment diagnosis is not relabelled.",
        "columnHeaders": [
          "Record",
          "Observation"
        ],
        "rowHeaders": [
          "Biopsy map",
          "Histological sections",
          "Interval photograph"
        ],
        "cells": [
          [
            "Position of the submitted punch",
            "Lateral part of the original patch"
          ],
          [
            "Tissue represented",
            "Epidermis and a short dermal segment from that punch; melanocytic proliferation reaches a side edge"
          ],
          [
            "Change in the residual patch",
            "A raised medial focus has developed outside the healed punch footprint"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v5",
      "nextConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v5",
      "previousKeyServiceId": "service.skin_excisional_biopsy",
      "nextKeyServiceId": "service.skin_excisional_biopsy",
      "previousResultGate": {
        "id": "gate.pigmented-skin-lesion.biopsy.4",
        "resultTypeId": "service.skin_excisional_biopsy",
        "pendingLabel": "Skin-lesion pathology pending",
        "resultNarrative": "The completed primary specimen measures 1.5 mm in maximum vertical thickness. A regional node is round with eccentric cortex and a replaced central hilum. Ultrasound-guided sampling of its solid cortex contains malignant melanocytes matching the skin primary. Distant staging has not yet been completed.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.skin_excisional_biopsy.in_house",
          "route.skin_excisional_biopsy.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.pigmented-skin-lesion.biopsy.4",
        "resultTypeId": "service.skin_excisional_biopsy",
        "pendingLabel": "Skin-lesion pathology pending",
        "resultNarrative": "The completed primary specimen measures 1.5 mm in maximum vertical thickness. A regional node is round with eccentric cortex and a replaced central hilum. Ultrasound-guided sampling of its solid cortex contains malignant melanocytes matching the skin primary. Distant staging has not yet been completed.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.skin_excisional_biopsy.in_house",
          "route.skin_excisional_biopsy.outsourced"
        ]
      },
      "reason": "Same representative residual-lesion diagnostic-completion objective; no new concept is required."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B12-context",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Deleted closure feasibility and classic irregular/dark lesion labels. The mapped interval change, not the opening description, creates the sampling decision. All alternatives are specific diagnostic plans, including a targeted deep biopsy and photographic surveillance rather than an old-block-only foil or a biopsy named as superficial. The original scenario’s small-size observation is retained without an invented numerical measurement.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, attends the clinic with the pathology report and serial photographs of a pigmented upper-arm lesion. A small discrete patch remains around the healed punch site.",
    "previousPresentation": "{patientName}, a 67-year-old woman, visits the clinic with a changing pigmented lesion on the upper arm. The lesion has an irregular border with darker and lighter areas. On examination, the surrounding lax skin can be brought together around the entire lesion without tension.",
    "previousProfilePresentations": [
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.female.67",
        "presentation": "{patientName}, a 67-year-old woman, visits the clinic with a changing pigmented lesion on the upper arm. The lesion has an irregular border with darker and lighter areas. On examination, the surrounding lax skin can be brought together around the entire lesion without tension."
      },
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.male.67",
        "presentation": "{patientName}, a 67-year-old man, visits the clinic with a changing pigmented lesion on the upper arm. The lesion has an irregular border with darker and lighter areas. On examination, the surrounding lax skin can be brought together around the entire lesion without tension."
      },
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.female.72",
        "presentation": "{patientName}, a 72-year-old woman, visits the clinic with a changing pigmented lesion on the upper arm. The lesion has an irregular border with darker and lighter areas. On examination, the surrounding lax skin can be brought together around the entire lesion without tension."
      },
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.male.72",
        "presentation": "{patientName}, a 72-year-old man, visits the clinic with a changing pigmented lesion on the upper arm. The lesion has an irregular border with darker and lighter areas. On examination, the surrounding lax skin can be brought together around the entire lesion without tension."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102b.case.pigmented-skin-lesion.forearm-change",
        "patientPresentationVariantId": "presentation.pigmented-skin-lesion.forearm-change",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v6",
        "revisedChiefComplaint": "Changing skin spot",
        "revisedPresentation": "{patientName}, a 67-year-old woman, visits the clinic with a changing pigmented lesion on the upper arm. The lesion has an irregular border with darker and lighter areas. On examination, the surrounding lax skin can be brought together around the entire lesion without tension.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102b.profile.pigmented-skin-lesion.forearm-change.female.67",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.forearm-change.female.67",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v6",
            "revisedPresentation": "{patientName}, a 67-year-old woman, visits the clinic with a changing pigmented lesion on the upper arm. The lesion has an irregular border with darker and lighter areas. On examination, the surrounding lax skin can be brought together around the entire lesion without tension.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102b.profile.pigmented-skin-lesion.forearm-change.male.67",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.forearm-change.male.67",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v6",
            "revisedPresentation": "{patientName}, a 67-year-old man, visits the clinic with a changing pigmented lesion on the upper arm. The lesion has an irregular border with darker and lighter areas. On examination, the surrounding lax skin can be brought together around the entire lesion without tension.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102b.profile.pigmented-skin-lesion.forearm-change.female.72",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.forearm-change.female.72",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v6",
            "revisedPresentation": "{patientName}, a 72-year-old woman, visits the clinic with a changing pigmented lesion on the upper arm. The lesion has an irregular border with darker and lighter areas. On examination, the surrounding lax skin can be brought together around the entire lesion without tension.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102b.profile.pigmented-skin-lesion.forearm-change.male.72",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.forearm-change.male.72",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v6",
            "revisedPresentation": "{patientName}, a 72-year-old man, visits the clinic with a changing pigmented lesion on the upper arm. The lesion has an irregular border with darker and lighter areas. On examination, the surrounding lax skin can be brought together around the entire lesion without tension.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          }
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 67,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2ar2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2a-round2.2026-11-04.v1"
    }
  },
  {
    "id": "revision.qbp2ar2.20261104.b2a10",
    "auditId": "B2A10",
    "caseId": "case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
    "nodeId": "node.gs028se.pdsa-act-qi-measures.a-abandon-harm.1",
    "previousQuestionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r9",
    "questionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r10",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which change should {patientName}’s team test next?",
    "previousChoiceLabels": [
      "Test importing as-needed medication entries",
      "Test filtering duplicate entries during transfer",
      "Test manual medication-list re-entry"
    ],
    "previousCurrentUpdate": "Automatic transfer takes less staff time. Before expanding the pilot, the team checks the following example against the reconciled record.",
    "previousExhibit": {
      "kind": "table",
      "caption": "Constructed preoperative list-transfer check; illustrative entries, not prescribing instructions.",
      "columnHeaders": [
        "Medication in reconciled record",
        "Recorded schedule",
        "Automatically transferred entry"
      ],
      "rowHeaders": [
        "Entry A",
        "Entry B",
        "Entry C",
        "Entry D"
      ],
      "cells": [
        [
          "Amlodipine",
          "Daily",
          "Amlodipine"
        ],
        [
          "Metformin",
          "With meals",
          "Metformin"
        ],
        [
          "Paracetamol",
          "When needed for pain",
          "No entry"
        ],
        [
          "Ondansetron",
          "When needed for nausea",
          "No entry"
        ]
      ]
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Compare both methods within each source instead of attributing all omissions to automation. Then: Choose a specific source-reconciliation test and retain completeness and work measures.",
    "reviewerNotes": "Illustrative process counts are explicitly constructed, not clinical thresholds or empirical causal evidence. No patient-level data, correctness statistics, adoption gate or gameplay analytics are collected.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_abandon-harm": "correct_abandon-harm",
      "choice.qbp2ar2.20261104.b2a10.d1": "choice.qbp2a.20261104.b2a10.d1",
      "choice.qbp2ar2.20261104.b2a10.d2": "choice.qbp2a.20261104.b2a10.d2"
    },
    "choiceServiceOverrides": {
      "correct_abandon-harm": null,
      "choice.qbp2ar2.20261104.b2a10.d1": null,
      "choice.qbp2ar2.20261104.b2a10.d2": null
    },
    "choiceTimingOverrides": {
      "correct_abandon-harm": {
        "kind": "no_test"
      },
      "choice.qbp2ar2.20261104.b2a10.d1": {
        "kind": "no_test"
      },
      "choice.qbp2ar2.20261104.b2a10.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.quality-improvement.pdsa-act-and-iterate.v3.r10",
      "conceptId": "concept.quality-improvement.source-by-method-next-pilot.v1",
      "stem": "Which change should {patientName}’s team test in the next small pilot?",
      "answerChoices": [
        {
          "id": "correct_abandon-harm",
          "label": "Reconcile hospital source lists before transfer",
          "isCorrect": true,
          "rationale": "The discrepancies track source rather than transfer method in these observations. A source-reconciliation test targets that hypothesis while retaining measurement of completeness and staff work.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a10.d1",
          "label": "Revise transfer parsing for hospital source lists",
          "isCorrect": false,
          "distractorRationale": "An import defect is a credible concern, but the same hospital omissions with manual transfer weaken it as the first hypothesis to test."
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a10.d2",
          "label": "Retrain transcription staff for hospital source transfer",
          "isCorrect": false,
          "distractorRationale": "Staff error is possible, but a manual-only remedy does not explain the same source-associated problem in automatic output."
        }
      ],
      "explanation": "Read the source-by-method comparison before blaming the faster workflow. Omissions occur with hospital records through both methods; local records remain complete through both. Test source reconciliation as a hypothesis, using both methods and the same reference checks, while remeasuring staff burden. The small constructed pilot neither proves a source mechanism nor warrants immediate rollout.",
      "teachingPoint": "Read the source-by-method comparison before blaming the faster workflow. Omissions occur with hospital records through both methods; local records remain complete through both. Test source reconciliation as a hypothesis, using both methods and the same reference checks, while remeasuring staff burden. The small constructed pilot neither proves a source mechanism nor warrants immediate rollout.",
      "supportingEvidenceClaimIds": [
        "claim.quality-improvement.pdsa-linked-iterative-tests",
        "claim.quality-improvement.next-step-follows-results",
        "claim.qq20261102c.pdsa-source-specific-next-test",
        "claim.qq20261102b.pdsa-hypothesis-not-proof",
        "claim.qbp2ar2.source-method-pilot"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Constructed medication-list transfer pilot; counts and staff times are illustrative.",
        "columnHeaders": [
          "Record source",
          "Transfer method",
          "Lists checked",
          "Lists with omitted medicines",
          "Median staff minutes"
        ],
        "rowHeaders": [
          "Local/manual",
          "Local/import",
          "Hospital/manual",
          "Hospital/import"
        ],
        "cells": [
          [
            "Local clinic",
            "Manual transcription",
            "20",
            "0",
            "8"
          ],
          [
            "Local clinic",
            "Automatic import",
            "20",
            "0",
            "3"
          ],
          [
            "Hospital",
            "Manual transcription",
            "20",
            "4",
            "8"
          ],
          [
            "Hospital",
            "Automatic import",
            "20",
            "4",
            "3"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.quality-improvement.pdsa-act-and-iterate",
      "nextConceptId": "concept.quality-improvement.source-by-method-next-pilot.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored discriminator changes from correcting an as-needed import omission to selecting a source-aware hypothesis from a crossed process pilot. Retain the prior Act/adapt objective and histories."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B36",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the as-needed synonym match, the unsupported duplicate filter and the repeat-manual comparator. All choices are novel named process changes; the crossed exhibit makes source and method competing explanations.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName} leads a preoperative-clinic medication-list pilot. Copied local-clinic and hospital records are processed by both manual transcription and automatic import, then checked against the reconciled reference list.",
    "previousPresentation": "{patientName} leads a preoperative-clinic medication-list pilot. An automatic transfer is compared with manual entry from the same reconciled record.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2a.20261104.case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
        "patientPresentationVariantId": "presentation.gs028se.pdsa-act-qi-measures.a-abandon-harm",
        "contentVersion": "presentation-revision.question-bank-program.2026-11-04.v1",
        "revisedChiefComplaint": "Pathway improvement review",
        "revisedPresentation": "{patientName} leads a preoperative-clinic medication-list pilot. An automatic transfer is compared with manual entry from the same reconciled record.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": null,
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qbp2ar2.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2a-round2.2026-11-04.v1"
    }
  },
  {
    "id": "revision.qbp2ar2.20261104.b2a11",
    "auditId": "B2A11",
    "caseId": "case.adrenal-incidentaloma.small-adrenal-adenoma",
    "nodeId": "node.adrenal-incidentaloma.small-adrenal-adenoma.1",
    "previousQuestionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4.r2",
    "questionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-04.v13"
    ],
    "previousStem": "Which study should be used to assess cortisol secretion in {patientName}’s adrenal evaluation?",
    "previousChoiceLabels": [
      "1-mg overnight dexamethasone test",
      "Late-night salivary cortisol measurement",
      "Urinary free cortisol measurement"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "currentUpdate": "Post-test serum cortisol remains above this laboratory’s suppression decision limit on repeated overnight dexamethasone studies.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Distinguish biochemical cortisol findings from evidence that the incidental adrenal nodule caused them. Then: Select basal corticotropin classification before a specialized dynamic/localization branch.",
    "reviewerNotes": "The ACTH branch uses one existing Endotext source, already recorded as directly checked. Exact dynamic-test ranking is an offline application requiring endocrine review; no dose, numerical cutoff or ACTH-dependent localization result is introduced.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dst_4": "dst_4",
      "choice.qbp2ar2.20261104.b2a11.d1": "choice.qbp2a.20261104.b2a11.d1",
      "choice.qbp2ar2.20261104.b2a11.d2": "choice.qbp2a.20261104.b2a11.d2"
    },
    "choiceServiceOverrides": {
      "dst_4": null,
      "choice.qbp2ar2.20261104.b2a11.d1": null,
      "choice.qbp2ar2.20261104.b2a11.d2": null
    },
    "choiceTimingOverrides": {
      "dst_4": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      },
      "choice.qbp2ar2.20261104.b2a11.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.dexamethasone_suppression"
      },
      "choice.qbp2ar2.20261104.b2a11.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.basic_labs"
      }
    },
    "question": {
      "id": "question.adrenal-incidentaloma.one-mg-dst.v4.r3",
      "conceptId": "concept.adrenal-incidentaloma.cortisol-etiologic-classification.v1",
      "stem": "Which study should guide the next etiologic step in {patientName}’s cortisol evaluation?",
      "answerChoices": [
        {
          "id": "dst_4",
          "label": "Basal plasma corticotropin measurement",
          "isCorrect": true,
          "rationale": "ACTH classifies the etiologic branch after biochemical cortisol assessment. An adrenal nodule does not establish that it is the cortisol source.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a11.d1",
          "label": "High-dose dexamethasone suppression study",
          "isCorrect": false,
          "distractorRationale": "A specialized suppression comparison does not replace establishing the basal ACTH branch first."
        },
        {
          "id": "choice.qbp2ar2.20261104.b2a11.d2",
          "label": "Corticotropin-releasing hormone stimulation study",
          "isCorrect": false,
          "distractorRationale": "A stimulation/localization pathway should not be selected from the incidental anatomical finding before basal ACTH classification."
        }
      ],
      "explanation": "Interpret the nonsuppression results as a reason to complete etiologic classification, not proof that the incidental nodule is responsible. Basal ACTH guides that branch; suppressed ACTH supports adrenal-directed evaluation. The task is limited to the cortisol pathway and does not imply that other indicated hormonal axes have been assessed. No numerical suppression cutoff or universal specialized stimulation algorithm is taught.",
      "teachingPoint": "Interpret the nonsuppression results as a reason to complete etiologic classification, not proof that the incidental nodule is responsible. Basal ACTH guides that branch; suppressed ACTH supports adrenal-directed evaluation. The task is limited to the cortisol pathway and does not imply that other indicated hormonal axes have been assessed. No numerical suppression cutoff or universal specialized stimulation algorithm is taught.",
      "supportingEvidenceClaimIds": [
        "claim.brief.adrenal-incidentaloma.one-mg-dst",
        "claim.cushing.confirm-before-localization",
        "claim.cushing.acth-guides-adrenal-imaging",
        "claim.qbp2ar2.cortisol-etiologic-stage"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.adrenal-incidentaloma.one-mg-dst",
      "nextConceptId": "concept.adrenal-incidentaloma.cortisol-etiologic-classification.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The task changes from recalling the initial incidentaloma screen to selecting the subsequent etiologic classification step. Retain the original screening concept and exact dose mapping."
    },
    "ownerProgramReview": {
      "ownerItemId": "new-adrenal-question-flag",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Made the stage explicit and moved beyond initial-screen recall. All choices are named endocrine studies with parallel specificity; the key is no longer the only dose/challenge option. No broad multi-axis workup question or automatic adrenalectomy inference remains.",
      "status": "awaiting_independent_and_clinician_review"
    }
  }
];

export const QUESTION_BANK_BATCH2A_ROUND2_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = [
  {
    "id": "concept.achalasia.secondary-junction-lesion-assessment.v1",
    "displayName": "Investigate a secondary junction lesion despite achalasia-pattern physiology",
    "learningObjective": "Integrate positional motor findings with a discordant wall abnormality and select etiologic assessment before attributing the pattern to primary achalasia.",
    "conceptType": "workup",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.achalasia.physiology-directed-treatment.v1",
    "versioningReason": "The scored action changes from selecting a primary-achalasia treatment to investigating a secondary junction lesion. Retain the prior treatment construct and all held treatment claims.",
    "revisedItemIds": [
      "B2A02"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102a.primary-position-achalasia",
      "claim.qq20261102b.secondary-achalasia-assessment",
      "claim.qq20261102c.hrm-incomplete-placement",
      "claim.qbp2ar2.junction-wall-assessment"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.esophageal-physiology.reserve-before-junction-intervention.v1",
    "displayName": "Do not equate reduced reserve with an outflow-treatment indication",
    "learningObjective": "Interpret a recovery-integral finding separately from junction pressure behavior and select complementary emptying assessment rather than unsupported dilation.",
    "conceptType": "workup",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.achalasia.high-resolution-manometry.v3",
    "versioningReason": "The prior task classified two pressure axes. This version makes that interpretation consequential for investigation versus intervention; preserve the older classification construct.",
    "revisedItemIds": [
      "B2A04"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102d.hrm-rapid-swallow-interpretation",
      "claim.qq20261102d.hrm-rapid-drink-purpose",
      "claim.qq20261102.motility-egjoo",
      "claim.qbp2ar2.reserve-emptying-boundary"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.groin-ultrasound.symptom-provocation-protocol.v1",
    "displayName": "Request a symptom-matched dynamic groin acquisition",
    "learningObjective": "Distinguish musculoskeletal and posture-dependent groin observations and choose the targeted ultrasound acquisition rather than a generic modality escalation.",
    "conceptType": "workup",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
    "versioningReason": "The scored decision changes from selecting a next imaging modality to selecting the actual acquisition within ultrasound. Retain the original imaging-adequacy construct.",
    "revisedItemIds": [
      "B2A06"
    ],
    "evidenceClaimIds": [
      "claim.inguinal-hernia.equivocal-exam-ultrasound",
      "claim.qq20261102a.groin-initial-dynamic-assessment",
      "claim.qq20261102c.groin-inadequate-study-certainty",
      "claim.qbp2ar2.dynamic-groin-protocol"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.groin-hernia.femoral-defect-repair-priority.v1",
    "displayName": "Recognize the femoral exception to inguinal watchful waiting",
    "learningObjective": "Use current vascular/ligament landmarks to reclassify a groin sac and apply the repair boundary despite improved function.",
    "conceptType": "management",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
    "versioningReason": "The scored objective changes from symptom-prioritized inguinal repair to anatomical reclassification and the femoral repair exception. Retain the previous inguinal care-priority construct.",
    "revisedItemIds": [
      "B2A08"
    ],
    "evidenceClaimIds": [
      "claim.bread-butter.inguinal-hernia.watchful-waiting",
      "claim.bread-butter.femoral-hernia.timely-repair",
      "claim.qbp2ar2.femoral-anatomy-application"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.quality-improvement.source-by-method-next-pilot.v1",
    "displayName": "Use a source-by-method pilot to select the next change",
    "learningObjective": "Separate an input-source pattern from a transfer-method pattern, then select a controlled next hypothesis while retaining outcome and burden checks.",
    "conceptType": "workup",
    "earliestFacilityStage": 2,
    "educationalTier": 1,
    "previousConceptId": "concept.quality-improvement.pdsa-act-and-iterate",
    "versioningReason": "The scored discriminator changes from correcting an as-needed import omission to selecting a source-aware hypothesis from a crossed process pilot. Retain the prior Act/adapt objective and histories.",
    "revisedItemIds": [
      "B2A10"
    ],
    "evidenceClaimIds": [
      "claim.quality-improvement.pdsa-linked-iterative-tests",
      "claim.quality-improvement.next-step-follows-results",
      "claim.qq20261102c.pdsa-source-specific-next-test",
      "claim.qq20261102b.pdsa-hypothesis-not-proof",
      "claim.qbp2ar2.source-method-pilot"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.adrenal-incidentaloma.cortisol-etiologic-classification.v1",
    "displayName": "Separate cortisol confirmation from source attribution",
    "learningObjective": "Use completed cortisol assessment to choose basal ACTH classification before attributing function to an incidental adrenal nodule.",
    "conceptType": "workup",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.adrenal-incidentaloma.one-mg-dst",
    "versioningReason": "The task changes from recalling the initial incidentaloma screen to selecting the subsequent etiologic classification step. Retain the original screening concept and exact dose mapping.",
    "revisedItemIds": [
      "B2A11"
    ],
    "evidenceClaimIds": [
      "claim.brief.adrenal-incidentaloma.one-mg-dst",
      "claim.cushing.confirm-before-localization",
      "claim.cushing.acth-guides-adrenal-imaging",
      "claim.qbp2ar2.cortisol-etiologic-stage"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2a-r2",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  }
];
