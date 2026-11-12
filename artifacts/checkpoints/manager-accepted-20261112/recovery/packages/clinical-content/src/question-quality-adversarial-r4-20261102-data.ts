import type { QuestionQualityR4Revision, QuestionQualityConceptVersion } from "./question-quality-adversarial-r4-20261102";

/** Additive clinical drafts; prior identities and approvals are retained. */
export const QUESTION_QUALITY_ADVERSARIAL_R4_DEFINITIONS: QuestionQualityR4Revision[] = [
  {
    "id": "revision.qq20261102c.a25-context",
    "auditId": "A25-context",
    "caseId": "case.gs028g.hiv-perioperative.paired-routine-elective",
    "nodeId": "node.gs028g.hiv-perioperative.paired-routine-elective.2",
    "previousQuestionVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r7",
    "questionVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r8",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which instruction should guide {patientName}'s ongoing procedural care?",
    "previousChoiceLabels": [
      "Pause midazolam; assess and support ventilation; continue ART",
      "Repeat midazolam; assess and support ventilation; continue ART",
      "Pause midazolam; assess and support ventilation; omit ritonavir",
      "Repeat midazolam; assess and support ventilation; omit ritonavir"
    ],
    "previousCurrentUpdate": "During {patientName}'s procedure, intravenous midazolam has been given. The patient still moves when spoken to. Oxygen saturation remains in its preceding range on supplemental oxygen, while the capnography trace becomes infrequent and chest movements become shallower. The medication list is unchanged.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Recognize that the benzodiazepine was treating ongoing seizure activity, rather than merely producing procedural sedation. Then Apply the antagonist contraindication despite the competing need to manage prolonged respiratory depression.",
    "reviewerNotes": "Melissa/anesthesia must confirm the seizure-course interpretation and antidote boundary. No seizure-duration threshold, antidote dose, prophylactic antiseizure regimen or monitoring duration is invented.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qq20261102c.a25-context.d1": "choice.qq20261102b.a25-context.d1",
      "choice.qq20261102c.a25-context.d2": "choice.qq20261102b.a25-context.d2"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qq20261102c.a25-context.d1": null,
      "choice.qq20261102c.a25-context.d2": null
    },
    "currentUpdate": "During induction, the patient develops repeated generalized convulsions without regaining awareness between them. Intravenous midazolam stops the convulsions and the procedure is abandoned. Assisted ventilation is now maintaining oxygenation while the capnography trace remains infrequent and spontaneous chest movements are shallow.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r7",
      "whatChanged": "Retain overt respiratory findings and support in every choice, but replace the independent ART/rescue axes with an antagonist decision changed by the actual indication for midazolam.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#A25-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Keep the overt respiratory-depression signs; every option continues assisted ventilation. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. New inference, rather than a substitute cue: Midazolam stopped repeated generalized seizures without intervening recovery; airway support is already in progress. Attack: All choices retain the same airway/seizure-support plan; none repeats sedative during overt respiratory deterioration. The passed preceding ART/route explanation does not answer the new seizure-control antagonist decision. No safety qualifier in the task supplies the key.",
          "cues 2: The cited wording is absent from the new visible fields. Keep the overt respiratory-depression signs; every option continues assisted ventilation. The original same-route prevention draft was discarded because the preceding passed item already supplies that answer. New inference, rather than a substitute cue: Midazolam stopped repeated generalized seizures without intervening recovery; airway support is already in progress. Attack: All choices retain the same airway/seizure-support plan; none repeats sedative during overt respiratory deterioration. The passed preceding ART/route explanation does not answer the new seizure-control antagonist decision. No safety qualifier in the task supplies the key."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: Midazolam stopped repeated generalized seizures without intervening recovery; airway support is already in progress. Keep the overt respiratory-depression signs; every option continues assisted ventilation. The original same-route prevention draft was discarded because the preceding passed item already supplies that answer. Source limits: Melissa/anesthesia must confirm the seizure-course interpretation and antidote boundary. No seizure-duration threshold, antidote dose, prophylactic antiseizure regimen or monitoring duration is invented.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Recognize that the benzodiazepine was treating ongoing seizure activity, rather than merely producing procedural sedation. Then Apply the antagonist contraindication despite the competing need to manage prolonged respiratory depression. Closest competing error: Automatically give flumazenil for midazolam-associated respiratory depression without noticing why the benzodiazepine was required. The original same-route prevention draft was discarded because the preceding passed item already supplies that answer. Use the reviewer's supportive-care/next-action alternative with raw seizure-course data, an explicit new concept version and the FDA contraindication claim.",
          "fairness 3: The old difficulty/shortcut is addressed by a consequential decision: Recognize that the benzodiazepine was treating ongoing seizure activity, rather than merely producing procedural sedation. Then Apply the antagonist contraindication despite the competing need to manage prolonged respiratory depression. Closest competing error: Automatically give flumazenil for midazolam-associated respiratory depression without noticing why the benzodiazepine was required. Keep the overt respiratory-depression signs; every option continues assisted ventilation. The original same-route prevention draft was discarded because the preceding passed item already supplies that answer."
        ],
        "suggestions": [
          "suggestions 1: Use the reviewer's supportive-care/next-action alternative with raw seizure-course data, an explicit new concept version and the FDA contraindication claim. Keep the overt respiratory-depression signs; every option continues assisted ventilation. Concrete implementation: Recognize that the benzodiazepine was treating ongoing seizure activity, rather than merely producing procedural sedation. Then Apply the antagonist contraindication despite the competing need to manage prolonged respiratory depression. The closest error is: Automatically give flumazenil for midazolam-associated respiratory depression without noticing why the benzodiazepine was required. Required clinical boundary: Melissa/anesthesia must confirm the seizure-course interpretation and antidote boundary. No seizure-duration threshold, antidote dose, prophylactic antiseizure regimen or monitoring duration is invented.",
          "suggestions 2: Keep the overt respiratory-depression signs; every option continues assisted ventilation. The original same-route prevention draft was discarded because the preceding passed item already supplies that answer. Concrete implementation: Recognize that the benzodiazepine was treating ongoing seizure activity, rather than merely producing procedural sedation. Then Apply the antagonist contraindication despite the competing need to manage prolonged respiratory depression. The closest error is: Automatically give flumazenil for midazolam-associated respiratory depression without noticing why the benzodiazepine was required. Required clinical boundary: Melissa/anesthesia must confirm the seizure-course interpretation and antidote boundary. No seizure-duration threshold, antidote dose, prophylactic antiseizure regimen or monitoring duration is invented."
        ]
      },
      "selfCheck": {
        "cueAttack": "All choices retain the same airway/seizure-support plan; none repeats sedative during overt respiratory deterioration. The passed preceding ART/route explanation does not answer the new seizure-control antagonist decision. No safety qualifier in the task supplies the key.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that the benzodiazepine was treating ongoing seizure activity, rather than merely producing procedural sedation.",
          "Apply the antagonist contraindication despite the competing need to manage prolonged respiratory depression."
        ],
        "oneBestAnswer": "Midazolam stopped repeated generalized seizures without intervening recovery; airway support is already in progress.",
        "closestDistractor": "Automatically give flumazenil for midazolam-associated respiratory depression without noticing why the benzodiazepine was required.",
        "remainingReview": "Melissa/anesthesia must confirm the seizure-course interpretation and antidote boundary. No seizure-duration threshold, antidote dose, prophylactic antiseizure regimen or monitoring duration is invented."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r8",
      "conceptId": "concept.gs028g.hiv-perioperative.booster-midazolam-interaction.v2",
      "stem": "Which reversal instruction should guide {patientName}'s care while assisted ventilation continues?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Withhold flumazenil",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Midazolam was used to control a potentially life-threatening seizure state; antagonizing it is contraindicated even though respiratory support is needed."
        },
        {
          "id": "choice.qq20261102c.a25-context.d1",
          "label": "Administer flumazenil now",
          "isCorrect": false,
          "distractorRationale": "Respiratory depression does not remove the contraindication when the benzodiazepine was required for seizure control."
        },
        {
          "id": "choice.qq20261102c.a25-context.d2",
          "label": "Administer flumazenil after another antiseizure drug",
          "isCorrect": false,
          "distractorRationale": "An additional antiseizure drug does not make the stated benzodiazepine-antagonist contraindication disappear."
        }
      ],
      "explanation": "The reason a benzodiazepine was administered changes whether its antagonist is appropriate. Repeated convulsions without recovery of awareness required seizure control; flumazenil is contraindicated when benzodiazepines are used to control a potentially life-threatening condition such as status epilepticus. Maintain supported ventilation and specialist seizure/anesthesia care. Boosted exposure increases the temptation to reverse sedation, but does not override this boundary.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.hiv-perioperative.booster-midazolam-interaction",
        "claim.gs028g.hiv-perioperative.booster-midazolam-interaction.fact2",
        "claim.gs028g.hiv-perioperative.booster-midazolam-interaction.fact3",
        "claim.qq20261102.named-art-regimen",
        "claim.qq20261102a.boosted-midazolam-routes",
        "claim.qq20261102a.boosted-parenteral-titration",
        "claim.qq20261102a.art-continuity",
        "claim.qq20261102b.oxygenation-not-ventilation",
        "claim.qq20261102b.route-specific-midazolam-plan",
        "claim.qq20261102b.sedation-ventilation-response",
        "claim.qq20261102c.flumazenil-seizure-control-contraindication",
        "claim.qq20261102c.midazolam-route-and-monitoring"
      ],
      "teachingPoint": "The reason a benzodiazepine was administered changes whether its antagonist is appropriate. Repeated convulsions without recovery of awareness required seizure control; flumazenil is contraindicated when benzodiazepines are used to control a potentially life-threatening condition such as status epilepticus. Maintain supported ventilation and specialist seizure/anesthesia care. Boosted exposure increases the temptation to reverse sedation, but does not override this boundary."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.gs028g.hiv-perioperative.booster-midazolam-interaction",
      "nextConceptId": "concept.gs028g.hiv-perioperative.booster-midazolam-interaction.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "This deliberately changes the scored objective from booster/route recognition to an antagonist contraindication application; the original interaction concept and all prior variants remain available for frozen learning histories."
    }
  },
  {
    "id": "revision.qq20261102c.b01-context",
    "auditId": "B01-context",
    "caseId": "case.achalasia.water-and-solids",
    "nodeId": "node.achalasia.water-and-solids.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v1.r4",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
    "previousChoiceLabels": [
      "High-resolution esophageal manometry",
      "Endoscopic functional lumen imaging",
      "Ambulatory esophageal pH-impedance monitoring"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Recognize that the catheter never sampled below the junction, so pressurization is not a valid subtype classification. Then Select assisted completion rather than treating an uninterpretable study.",
    "reviewerNotes": "The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_1": "manometry_1",
      "choice.qq20261102c.b01-context.d1": "choice.qq20261102b.b01-context.d1",
      "choice.qq20261102c.b01-context.d2": "choice.qq20261102b.b01-context.d2"
    },
    "choiceServiceOverrides": {
      "manometry_1": "service.esophageal_manometry",
      "choice.qq20261102c.b01-context.d1": null,
      "choice.qq20261102c.b01-context.d2": null
    },
    "choiceTimingOverrides": {
      "manometry_1": {
        "kind": "test",
        "timingProfileId": "timing.test.esophageal_manometry"
      },
      "choice.qq20261102c.b01-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.upper_endoscopy"
      },
      "choice.qq20261102c.b01-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.radiography"
      }
    },
    "currentUpdate": "The outside pressure-study record shows the catheter tip remaining above the diaphragm throughout. The technician stopped after repeated retching during blind advancement. No endoscopically assisted placement was attempted. The recorded channels show simultaneous pressurization during swallowing.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.high-resolution-manometry.v1.r4",
      "whatChanged": "Replace repeated first-test recall with a protocol/technical-adequacy application. Preserve the passed later tracing and shared patient presentation.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B01-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: There are no gastric channels and only blind placement has failed. There are no gastric channels and only blind placement has failed. The rejected basic designation is removed; the new scored objective has a separate concept version and no history migration. Source limits: The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Recognize that the catheter never sampled below the junction, so pressurization is not a valid subtype classification. Then Select assisted completion rather than treating an uninterpretable study. Closest competing error: Treat the simultaneous pressurization as a diagnostic tracing and proceed to sphincter treatment. There are no gastric channels and only blind placement has failed. The rejected basic designation is removed; the new scored objective has a separate concept version and no history migration.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The original initial-test rule is replaced by interpretation of an existing technically limited or symptom-discordant physiologic study."
        ],
        "suggestions": [
          "suggestions 1: There are no gastric channels and only blind placement has failed. The rejected basic designation is removed; the new scored objective has a separate concept version and no history migration. Concrete implementation: Recognize that the catheter never sampled below the junction, so pressurization is not a valid subtype classification. Then Select assisted completion rather than treating an uninterpretable study. The closest error is: Treat the simultaneous pressurization as a diagnostic tracing and proceed to sphincter treatment. Required clinical boundary: The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
          "suggestions 2: The rejected basic designation is removed; the new scored objective has a separate concept version and no history migration. The shared presentation is frozen because the later main item passed; new acquisition history is in Current update. Concrete implementation: Recognize that the catheter never sampled below the junction, so pressurization is not a valid subtype classification. Then Select assisted completion rather than treating an uninterpretable study. The closest error is: Treat the simultaneous pressurization as a diagnostic tracing and proceed to sphincter treatment. Required clinical boundary: The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition."
        ]
      },
      "selfCheck": {
        "cueAttack": "An outside report or numerical value competes with its actual acquisition record. The task asks what to do about that specific limitation, not which generic first test diagnoses achalasia.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that the catheter never sampled below the junction, so pressurization is not a valid subtype classification.",
          "Select assisted completion rather than treating an uninterpretable study."
        ],
        "oneBestAnswer": "There are no gastric channels and only blind placement has failed.",
        "closestDistractor": "Treat the simultaneous pressurization as a diagnostic tracing and proceed to sphincter treatment.",
        "remainingReview": "The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v1.r5",
      "conceptId": "concept.achalasia.high-resolution-manometry.v2",
      "stem": "Which plan should resolve {patientName}'s pressure-study findings?",
      "answerChoices": [
        {
          "id": "manometry_1",
          "label": "Manometry with endoscopic catheter placement",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Without gastric/junction recordings the tracing cannot establish relaxation or subtype; assisted completion is available before abandoning manometry."
        },
        {
          "id": "choice.qq20261102c.b01-context.d1",
          "label": "Obtain junction distensibility measurements with endoscopic FLIP",
          "isCorrect": false,
          "distractorRationale": "FLIP can complement an obstructive-symptom assessment, especially when manometry cannot be completed despite assisted placement, but does not replace the still-feasible pressure classification required here."
        },
        {
          "id": "choice.qq20261102c.b01-context.d2",
          "label": "Obtain a timed barium esophagram with a tablet",
          "isCorrect": false,
          "distractorRationale": "Timed barium emptying helps assess obstruction but does not supply the missing junction-relaxation and peristaltic classification measurements."
        }
      ],
      "explanation": "Recognize that the catheter never sampled below the junction, so pressurization is not a valid subtype classification. Select assisted completion rather than treating an uninterpretable study. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.qq20261102c.hrm-incomplete-placement"
      ],
      "teachingPoint": "Recognize that the catheter never sampled below the junction, so pressurization is not a valid subtype classification. Select assisted completion rather than treating an uninterpretable study. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.achalasia.high-resolution-manometry",
      "nextConceptId": "concept.achalasia.high-resolution-manometry.v2",
      "previousKeyServiceId": "service.esophageal_manometry",
      "nextKeyServiceId": "service.esophageal_manometry",
      "previousResultGate": {
        "id": "gate.achalasia.manometry.1",
        "resultTypeId": "service.esophageal_manometry",
        "pendingLabel": "Esophageal manometry pending",
        "resultNarrative": "The esophageal pressure-study report is available for review.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.esophageal_manometry.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.achalasia.manometry.1",
        "resultTypeId": "service.esophageal_manometry",
        "pendingLabel": "Esophageal manometry pending",
        "resultNarrative": "The esophageal pressure-study report is available for review.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.esophageal_manometry.outsourced"
        ]
      },
      "reason": "The original initial-test rule is replaced by interpretation of an existing technically limited or symptom-discordant physiologic study."
    }
  },
  {
    "id": "revision.qq20261102c.b02-context",
    "auditId": "B02-context",
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v2.r4",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
    "previousChoiceLabels": [
      "High-resolution esophageal manometry",
      "Endoscopic functional lumen imaging",
      "Ambulatory esophageal pH-impedance monitoring"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Separate swallow-protocol failure from a true absence of peristalsis. Then Complete a valid position-specific protocol before selecting disease-specific therapy.",
    "reviewerNotes": "The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_2": "manometry_2",
      "choice.qq20261102c.b02-context.d1": "choice.qq20261102b.b02-context.d1",
      "choice.qq20261102c.b02-context.d2": "choice.qq20261102b.b02-context.d2"
    },
    "choiceServiceOverrides": {
      "manometry_2": "service.esophageal_manometry",
      "choice.qq20261102c.b02-context.d1": null,
      "choice.qq20261102c.b02-context.d2": "service.ambulatory_reflux_monitoring"
    },
    "choiceTimingOverrides": {
      "manometry_2": {
        "kind": "test",
        "timingProfileId": "timing.test.esophageal_manometry"
      },
      "choice.qq20261102c.b02-context.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b02-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ambulatory_reflux_monitoring"
      }
    },
    "currentUpdate": "The outside report labels absent peristalsis. Its saved record contains three water swallows: each begins while the preceding swallow's contraction is still developing. The remaining attempts are marked retching. The catheter crosses the junction; no spaced-swallow series or alternate-position series is saved.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.high-resolution-manometry.v2.r4",
      "whatChanged": "Replace repeated first-test recall with a protocol/technical-adequacy application. Preserve the passed later tracing and shared patient presentation.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B02-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited phrase remains in Presentation because its observation is necessary; its old option-aligned exclusion no longer determines this changed task. Use a neutral complete task that fits every option category; do not pre-filter treatment or tissue choices by asking only for a pressure study or imaging. The saved swallows overlap and the protocol was not completed, despite catheter passage. New inference, rather than a substitute cue: The saved swallows overlap and the protocol was not completed, despite catheter passage. Attack: An outside report or numerical value competes with its actual acquisition record. The task asks what to do about that specific limitation, not which generic first test diagnoses achalasia."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The saved swallows overlap and the protocol was not completed, despite catheter passage. Use a neutral complete task that fits every option category; do not pre-filter treatment or tissue choices by asking only for a pressure study or imaging. The saved swallows overlap and the protocol was not completed, despite catheter passage. Source limits: The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Separate swallow-protocol failure from a true absence of peristalsis. Then Complete a valid position-specific protocol before selecting disease-specific therapy. Closest competing error: Accept the outside absent-peristalsis label and treat on that basis. Use a neutral complete task that fits every option category; do not pre-filter treatment or tissue choices by asking only for a pressure study or imaging. The saved swallows overlap and the protocol was not completed, despite catheter passage.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The original initial-test rule is replaced by interpretation of an existing technically limited or symptom-discordant physiologic study."
        ],
        "suggestions": [
          "suggestions 1: The saved swallows overlap and the protocol was not completed, despite catheter passage. Use a neutral complete task that fits every option category; do not pre-filter treatment or tissue choices by asking only for a pressure study or imaging. Concrete implementation: Separate swallow-protocol failure from a true absence of peristalsis. Then Complete a valid position-specific protocol before selecting disease-specific therapy. The closest error is: Accept the outside absent-peristalsis label and treat on that basis. Required clinical boundary: The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
          "suggestions 2: The rejected basic designation is removed; the new scored objective has a separate concept version and no history migration. The shared presentation is frozen because the later main item passed; new acquisition history is in Current update. Concrete implementation: Separate swallow-protocol failure from a true absence of peristalsis. Then Complete a valid position-specific protocol before selecting disease-specific therapy. The closest error is: Accept the outside absent-peristalsis label and treat on that basis. Required clinical boundary: The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition."
        ]
      },
      "selfCheck": {
        "cueAttack": "An outside report or numerical value competes with its actual acquisition record. The task asks what to do about that specific limitation, not which generic first test diagnoses achalasia.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Separate swallow-protocol failure from a true absence of peristalsis.",
          "Complete a valid position-specific protocol before selecting disease-specific therapy."
        ],
        "oneBestAnswer": "The saved swallows overlap and the protocol was not completed, despite catheter passage.",
        "closestDistractor": "Accept the outside absent-peristalsis label and treat on that basis.",
        "remainingReview": "The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v2.r5",
      "conceptId": "concept.achalasia.high-resolution-manometry.v2",
      "stem": "Which next plan best fits {patientName}'s outside assessment?",
      "answerChoices": [
        {
          "id": "manometry_2",
          "label": "Repeat a complete high-resolution manometry study",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Overlapping swallows and an incomplete series do not establish the classification; a technically adequate protocol is required."
        },
        {
          "id": "choice.qq20261102c.b02-context.d1",
          "label": "Plan sphincter-directed treatment for achalasia",
          "isCorrect": false,
          "distractorRationale": "Deglutitive inhibition during overlapping swallows cannot substitute for a valid primary-position series."
        },
        {
          "id": "choice.qq20261102c.b02-context.d2",
          "label": "Plan supportive treatment for absent contractility",
          "isCorrect": false,
          "distractorRationale": "Absent propagation in this incomplete protocol does not establish absent contractility."
        }
      ],
      "explanation": "Separate swallow-protocol failure from a true absence of peristalsis. Complete a valid position-specific protocol before selecting disease-specific therapy. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.qq20261102c.hrm-protocol-and-provocation"
      ],
      "teachingPoint": "Separate swallow-protocol failure from a true absence of peristalsis. Complete a valid position-specific protocol before selecting disease-specific therapy. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.achalasia.high-resolution-manometry",
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
      "reason": "The original initial-test rule is replaced by interpretation of an existing technically limited or symptom-discordant physiologic study."
    }
  },
  {
    "id": "revision.qq20261102c.b03",
    "auditId": "B03",
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v3.r4",
    "questionVariantId": "question.achalasia.manometric-recognition.v3.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which interpretation and next plan best fit {patientName}'s record?",
    "previousChoiceLabels": [
      "Achalasia-like spastic pattern; reassess after coordinated opioid withdrawal",
      "Achalasia-like spastic pattern; proceed to myotomy planning while continuing the opioid",
      "Distal-spasm pattern; coordinate opioid withdrawal and reassessment before myotomy planning",
      "Distal-spasm pattern; proceed to myotomy planning while continuing the opioid"
    ],
    "previousCurrentUpdate": "Medication reconciliation shows that {patientName} takes oxycodone regularly for back pain and took it before the pressure study. No prior attempt to assess swallowing while off that medication is documented.",
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Constructed esophageal pressure-study observations; reference ranges are laboratory-specific.",
      "items": [
        {
          "label": "Junction measurement",
          "value": "Median relaxation pressure above the laboratory reference range"
        },
        {
          "label": "Most swallows",
          "value": "An early distal contraction begins before the laboratory's latency reference; no normal propagating sequence occurs"
        },
        {
          "label": "Remaining swallows",
          "value": "No distal contraction develops"
        }
      ]
    },
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Identify the spastic outflow pattern in the report. Then Notice the opioid exposure and feasible coordinated reassessment before irreversible treatment.",
    "reviewerNotes": "The supervising prescriber and clinician must verify safe adjustment; no abrupt withdrawal, washout or reversibility guarantee.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_3": "achalasia_3",
      "choice.qq20261102c.b03.d1": "choice.qq20261102b.b03.d1",
      "choice.qq20261102c.b03.d2": "choice.qq20261102b.b03.d2",
      "choice.qq20261102c.b03.d3": "choice.qq20261102b.b03.d3"
    },
    "choiceServiceOverrides": {
      "achalasia_3": null,
      "choice.qq20261102c.b03.d1": null,
      "choice.qq20261102c.b03.d2": null,
      "choice.qq20261102c.b03.d3": null
    },
    "currentUpdate": "Medication reconciliation shows that {patientName} takes oxycodone regularly for back pain and took it before the pressure study. The prescribing team can supervise a medication adjustment, and the patient can maintain oral intake during reassessment.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.manometric-recognition.v3.r4",
      "whatChanged": "Remove the preview of the keyed next action; add only feasibility of coordinated medication adjustment.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B03",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Delete the explicit absent-off-opioid-assessment sentence. Retain concrete oxycodone exposure; state feasible supervised adjustment and maintained intake. New inference, rather than a substitute cue: Oxycodone exposure is documented and supervised adjustment is feasible; there is no need for abrupt cessation. Attack: Delete the sentence announcing the unperformed off-medication study. Medication reconciliation remains an ordinary case fact; feasibility is given without a rationale sentence."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: Oxycodone exposure is documented and supervised adjustment is feasible; there is no need for abrupt cessation. Delete the explicit absent-off-opioid-assessment sentence. Retain concrete oxycodone exposure; state feasible supervised adjustment and maintained intake. Source limits: The supervising prescriber and clinician must verify safe adjustment; no abrupt withdrawal, washout or reversibility guarantee.",
          "fairness 2: Decision-critical basis is now explicit: Oxycodone exposure is documented and supervised adjustment is feasible; there is no need for abrupt cessation. Delete the explicit absent-off-opioid-assessment sentence. Retain concrete oxycodone exposure; state feasible supervised adjustment and maintained intake. Single-best claim is limited by: The supervising prescriber and clinician must verify safe adjustment; no abrupt withdrawal, washout or reversibility guarantee.",
          "fairness 3: The old difficulty/shortcut is addressed by a consequential decision: Identify the spastic outflow pattern in the report. Then Notice the opioid exposure and feasible coordinated reassessment before irreversible treatment. Closest competing error: Treat the spastic achalasia-like pattern immediately without considering opioid exposure. Delete the explicit absent-off-opioid-assessment sentence. Retain concrete oxycodone exposure; state feasible supervised adjustment and maintained intake."
        ],
        "suggestions": [
          "suggestions 1: Delete the explicit absent-off-opioid-assessment sentence. Retain concrete oxycodone exposure; state feasible supervised adjustment and maintained intake. Concrete implementation: Identify the spastic outflow pattern in the report. Then Notice the opioid exposure and feasible coordinated reassessment before irreversible treatment. The closest error is: Treat the spastic achalasia-like pattern immediately without considering opioid exposure. Required clinical boundary: The supervising prescriber and clinician must verify safe adjustment; no abrupt withdrawal, washout or reversibility guarantee.",
          "suggestions 2: Retain concrete oxycodone exposure; state feasible supervised adjustment and maintained intake. Delete the explicit absent-off-opioid-assessment sentence. Concrete implementation: Identify the spastic outflow pattern in the report. Then Notice the opioid exposure and feasible coordinated reassessment before irreversible treatment. The closest error is: Treat the spastic achalasia-like pattern immediately without considering opioid exposure. Required clinical boundary: The supervising prescriber and clinician must verify safe adjustment; no abrupt withdrawal, washout or reversibility guarantee."
        ]
      },
      "selfCheck": {
        "cueAttack": "Delete the sentence announcing the unperformed off-medication study. Medication reconciliation remains an ordinary case fact; feasibility is given without a rationale sentence.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Identify the spastic outflow pattern in the report.",
          "Notice the opioid exposure and feasible coordinated reassessment before irreversible treatment."
        ],
        "oneBestAnswer": "Oxycodone exposure is documented and supervised adjustment is feasible; there is no need for abrupt cessation.",
        "closestDistractor": "Treat the spastic achalasia-like pattern immediately without considering opioid exposure.",
        "remainingReview": "The supervising prescriber and clinician must verify safe adjustment; no abrupt withdrawal, washout or reversibility guarantee."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.manometric-recognition.v3.r5",
      "conceptId": "concept.achalasia.manometric-recognition",
      "stem": "Which interpretation and next plan best fit {patientName}'s record?",
      "answerChoices": [
        {
          "id": "achalasia_3",
          "label": "Achalasia-like spastic pattern; reassess after coordinated opioid withdrawal",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Recognizes the pattern and the potentially reversible medication-associated contribution before committing to irreversible therapy."
        },
        {
          "id": "choice.qq20261102c.b03.d1",
          "label": "Achalasia-like spastic pattern; proceed to myotomy planning while continuing the opioid",
          "isCorrect": false,
          "distractorRationale": "Recognizes the tracing but treats it as sufficient proof of a primary irreversible disorder despite a relevant drug exposure."
        },
        {
          "id": "choice.qq20261102c.b03.d2",
          "label": "Distal-spasm pattern; coordinate opioid withdrawal and reassessment before myotomy planning",
          "isCorrect": false,
          "distractorRationale": "Notices the medication issue but ignores the abnormal junction relaxation when classifying the tracing."
        },
        {
          "id": "choice.qq20261102c.b03.d3",
          "label": "Distal-spasm pattern; proceed to myotomy planning while continuing the opioid",
          "isCorrect": false,
          "distractorRationale": "Combines an incorrect relaxation-pattern classification with premature invasive treatment planning during the relevant exposure."
        }
      ],
      "explanation": "The failed/premature body activity with impaired junction relaxation is an achalasia-like spastic pattern. Opioids can produce this phenotype; Chicago v4 advises studying off opioids when possible. Coordinate a clinically appropriate withdrawal/reassessment plan before treating this as established primary disease requiring myotomy. No abrupt cessation or fixed washout is prescribed.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.manometric-recognition",
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102.motility-absent-contractility",
        "claim.qq20261102a.spastic-achalasia",
        "claim.qq20261102b.opioid-spastic-pattern"
      ],
      "teachingPoint": "The failed/premature body activity with impaired junction relaxation is an achalasia-like spastic pattern. Opioids can produce this phenotype; Chicago v4 advises studying off opioids when possible. Coordinate a clinically appropriate withdrawal/reassessment plan before treating this as established primary disease requiring myotomy. No abrupt cessation or fixed washout is prescribed.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed esophageal pressure-study observations; reference ranges are laboratory-specific.",
        "items": [
          {
            "label": "Junction measurement",
            "value": "Median relaxation pressure above the laboratory reference range"
          },
          {
            "label": "Most swallows",
            "value": "An early distal contraction begins before the laboratory's latency reference; no normal propagating sequence occurs"
          },
          {
            "label": "Remaining swallows",
            "value": "No distal contraction develops"
          }
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.achalasia.manometric-recognition",
      "nextConceptId": "concept.achalasia.manometric-recognition",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Existing objective applied with revised wording/data; no concept meaning change."
    }
  },
  {
    "id": "revision.qq20261102c.b03-context",
    "auditId": "B03-context",
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v3.r4",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
    "previousChoiceLabels": [
      "High-resolution esophageal manometry",
      "Endoscopic functional lumen imaging",
      "Ambulatory esophageal pH-impedance monitoring"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Notice the mismatch between symptom-provoking meals and the unrevealing water-only protocol. Then Select physiologic provocation rather than declaring the symptoms explained or repeating the same protocol.",
    "reviewerNotes": "The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_3": "manometry_3",
      "choice.qq20261102c.b03-context.d1": "choice.qq20261102b.b03-context.d1",
      "choice.qq20261102c.b03-context.d2": "choice.qq20261102b.b03-context.d2"
    },
    "choiceServiceOverrides": {
      "manometry_3": "service.esophageal_manometry",
      "choice.qq20261102c.b03-context.d1": null,
      "choice.qq20261102c.b03-context.d2": "service.ambulatory_reflux_monitoring"
    },
    "choiceTimingOverrides": {
      "manometry_3": {
        "kind": "test",
        "timingProfileId": "timing.test.esophageal_manometry"
      },
      "choice.qq20261102c.b03-context.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b03-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ambulatory_reflux_monitoring"
      }
    },
    "currentUpdate": "Water-swallow manometry shows normal junction relaxation and propagated contractions. The symptom diary records food sticking during bread and meat meals; none of the water swallows reproduces it. Endoscopy and mucosal biopsies show no structural or eosinophilic explanation. The study has no meal or provocative-swallow recording.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.high-resolution-manometry.v3.r4",
      "whatChanged": "Replace repeated first-test recall with a protocol/technical-adequacy application. Preserve the passed later tracing and shared patient presentation.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B03-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: Adequate routine water swallows did not reproduce the actual meal symptom; structural/mucosal evaluation is recorded. Adequate routine water swallows did not reproduce the actual meal symptom; structural/mucosal evaluation is recorded. The rejected basic designation is removed; the new scored objective has a separate concept version and no history migration. Source limits: The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Notice the mismatch between symptom-provoking meals and the unrevealing water-only protocol. Then Select physiologic provocation rather than declaring the symptoms explained or repeating the same protocol. Closest competing error: Repeat routine manometry because it is the standard test, without changing the protocol. Adequate routine water swallows did not reproduce the actual meal symptom; structural/mucosal evaluation is recorded. The rejected basic designation is removed; the new scored objective has a separate concept version and no history migration.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The original initial-test rule is replaced by interpretation of an existing technically limited or symptom-discordant physiologic study."
        ],
        "suggestions": [
          "suggestions 1: Adequate routine water swallows did not reproduce the actual meal symptom; structural/mucosal evaluation is recorded. The rejected basic designation is removed; the new scored objective has a separate concept version and no history migration. Concrete implementation: Notice the mismatch between symptom-provoking meals and the unrevealing water-only protocol. Then Select physiologic provocation rather than declaring the symptoms explained or repeating the same protocol. The closest error is: Repeat routine manometry because it is the standard test, without changing the protocol. Required clinical boundary: The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
          "suggestions 2: The rejected basic designation is removed; the new scored objective has a separate concept version and no history migration. The shared presentation is frozen because the later main item passed; new acquisition history is in Current update. Concrete implementation: Notice the mismatch between symptom-provoking meals and the unrevealing water-only protocol. Then Select physiologic provocation rather than declaring the symptoms explained or repeating the same protocol. The closest error is: Repeat routine manometry because it is the standard test, without changing the protocol. Required clinical boundary: The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition."
        ]
      },
      "selfCheck": {
        "cueAttack": "An outside report or numerical value competes with its actual acquisition record. The task asks what to do about that specific limitation, not which generic first test diagnoses achalasia.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Notice the mismatch between symptom-provoking meals and the unrevealing water-only protocol.",
          "Select physiologic provocation rather than declaring the symptoms explained or repeating the same protocol."
        ],
        "oneBestAnswer": "Adequate routine water swallows did not reproduce the actual meal symptom; structural/mucosal evaluation is recorded.",
        "closestDistractor": "Repeat routine manometry because it is the standard test, without changing the protocol.",
        "remainingReview": "The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v3.r5",
      "conceptId": "concept.achalasia.high-resolution-manometry.v2",
      "stem": "Which investigation plan should be arranged for {patientName}'s persistent dysphagia?",
      "answerChoices": [
        {
          "id": "manometry_3",
          "label": "High-resolution manometry with a test meal",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Supplementary maneuvers can reveal obstructive physiology missed by routine water swallows and relate it to the actual symptom."
        },
        {
          "id": "choice.qq20261102c.b03-context.d1",
          "label": "High-resolution manometry with another water-swallow series",
          "isCorrect": false,
          "distractorRationale": "Repeating the same unrevealing protocol does not address the missing symptom challenge."
        },
        {
          "id": "choice.qq20261102c.b03-context.d2",
          "label": "Ambulatory pH-impedance monitoring",
          "isCorrect": false,
          "distractorRationale": "Acid monitoring cannot replace an assessment of swallowing physiology when the unresolved symptom is bolus obstruction."
        }
      ],
      "explanation": "Notice the mismatch between symptom-provoking meals and the unrevealing water-only protocol. Select physiologic provocation rather than declaring the symptoms explained or repeating the same protocol. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.qq20261102c.hrm-protocol-and-provocation"
      ],
      "teachingPoint": "Notice the mismatch between symptom-provoking meals and the unrevealing water-only protocol. Select physiologic provocation rather than declaring the symptoms explained or repeating the same protocol. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.achalasia.high-resolution-manometry",
      "nextConceptId": "concept.achalasia.high-resolution-manometry.v2",
      "previousKeyServiceId": "service.esophageal_manometry",
      "nextKeyServiceId": "service.esophageal_manometry",
      "previousResultGate": {
        "id": "gate.achalasia.manometry.3",
        "resultTypeId": "service.esophageal_manometry",
        "pendingLabel": "Esophageal manometry pending",
        "resultNarrative": "The esophageal pressure-study report is available for review.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.esophageal_manometry.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.achalasia.manometry.3",
        "resultTypeId": "service.esophageal_manometry",
        "pendingLabel": "Esophageal manometry pending",
        "resultNarrative": "Medication reconciliation shows that {patientName} takes oxycodone regularly for back pain and took it before the pressure study. The prescribing team can supervise a medication adjustment, and the patient can maintain oral intake during reassessment.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.esophageal_manometry.outsourced"
        ]
      },
      "reason": "The original initial-test rule is replaced by interpretation of an existing technically limited or symptom-discordant physiologic study."
    }
  },
  {
    "id": "revision.qq20261102c.b04-context",
    "auditId": "B04-context",
    "caseId": "case.achalasia.clinic-referral",
    "nodeId": "node.achalasia.clinic-referral.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v4.r4",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v4.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
    "previousChoiceLabels": [
      "High-resolution esophageal manometry",
      "Endoscopic functional lumen imaging",
      "Ambulatory esophageal pH-impedance monitoring"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Check how the reported number was obtained rather than accepting the report label. Then Repeat an interpretable assessment before an irreversible intervention.",
    "reviewerNotes": "The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_4": "manometry_4",
      "choice.qq20261102c.b04-context.d1": "choice.qq20261102b.b04-context.d1",
      "choice.qq20261102c.b04-context.d2": "choice.qq20261102b.b04-context.d2"
    },
    "choiceServiceOverrides": {
      "manometry_4": "service.esophageal_manometry",
      "choice.qq20261102c.b04-context.d1": null,
      "choice.qq20261102c.b04-context.d2": null
    },
    "choiceTimingOverrides": {
      "manometry_4": {
        "kind": "test",
        "timingProfileId": "timing.test.esophageal_manometry"
      },
      "choice.qq20261102c.b04-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.upper_endoscopy"
      },
      "choice.qq20261102c.b04-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.radiography"
      }
    },
    "currentUpdate": "The exported outside manometry plots have no gastric baseline channel. During the test the entire catheter moves upward with retching; the report nevertheless gives a junction relaxation value and recommends dilation.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.high-resolution-manometry.v4.r4",
      "whatChanged": "Replace repeated first-test recall with a protocol/technical-adequacy application. Preserve the passed later tracing and shared patient presentation.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B04-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: Displacement and absence of a gastric reference are documented; the exported value does not establish junction relaxation. Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence. Displacement and absence of a gastric reference are documented; the exported value does not establish junction relaxation. Source limits: The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Check how the reported number was obtained rather than accepting the report label. Then Repeat an interpretable assessment before an irreversible intervention. Closest competing error: Treat a precise-looking reported relaxation value as valid despite the missing reference. Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence. Displacement and absence of a gastric reference are documented; the exported value does not establish junction relaxation.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The original initial-test rule is replaced by interpretation of an existing technically limited or symptom-discordant physiologic study."
        ],
        "suggestions": [
          "suggestions 1: Displacement and absence of a gastric reference are documented; the exported value does not establish junction relaxation. The rejected basic designation is removed; the new scored objective has a separate concept version and no history migration. Concrete implementation: Check how the reported number was obtained rather than accepting the report label. Then Repeat an interpretable assessment before an irreversible intervention. The closest error is: Treat a precise-looking reported relaxation value as valid despite the missing reference. Required clinical boundary: The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition.",
          "suggestions 2: The rejected basic designation is removed; the new scored objective has a separate concept version and no history migration. The shared presentation is frozen because the later main item passed; new acquisition history is in Current update. Concrete implementation: Check how the reported number was obtained rather than accepting the report label. Then Repeat an interpretable assessment before an irreversible intervention. The closest error is: Treat a precise-looking reported relaxation value as valid despite the missing reference. Required clinical boundary: The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition."
        ]
      },
      "selfCheck": {
        "cueAttack": "An outside report or numerical value competes with its actual acquisition record. The task asks what to do about that specific limitation, not which generic first test diagnoses achalasia.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Check how the reported number was obtained rather than accepting the report label.",
          "Repeat an interpretable assessment before an irreversible intervention."
        ],
        "oneBestAnswer": "Displacement and absence of a gastric reference are documented; the exported value does not establish junction relaxation.",
        "closestDistractor": "Treat a precise-looking reported relaxation value as valid despite the missing reference.",
        "remainingReview": "The exact specialist protocol and symptom interpretation need clinical review. No new pressure cutoff, meal quantity, timing or diagnosis is inferred from an invalid acquisition."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v4.r5",
      "conceptId": "concept.achalasia.high-resolution-manometry.v2",
      "stem": "How should {patientName}'s next physiologic assessment be arranged?",
      "answerChoices": [
        {
          "id": "manometry_4",
          "label": "Manometry with endoscopic catheter placement",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A displaced catheter without a gastric reference cannot provide a dependable junction relaxation assessment; technically adequate repeat testing is feasible."
        },
        {
          "id": "choice.qq20261102c.b04-context.d1",
          "label": "Obtain junction distensibility measurements with endoscopic FLIP",
          "isCorrect": false,
          "distractorRationale": "FLIP can complement an obstructive-symptom assessment, especially when manometry cannot be completed despite assisted placement, but does not replace the still-feasible pressure classification required here."
        },
        {
          "id": "choice.qq20261102c.b04-context.d2",
          "label": "Obtain a timed barium esophagram with a tablet",
          "isCorrect": false,
          "distractorRationale": "Timed barium emptying helps assess obstruction but does not supply the missing junction-relaxation and peristaltic classification measurements."
        }
      ],
      "explanation": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.qq20261102c.hrm-incomplete-placement"
      ],
      "teachingPoint": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.achalasia.high-resolution-manometry",
      "nextConceptId": "concept.achalasia.high-resolution-manometry.v2",
      "previousKeyServiceId": "service.esophageal_manometry",
      "nextKeyServiceId": "service.esophageal_manometry",
      "previousResultGate": {
        "id": "gate.achalasia.manometry.4",
        "resultTypeId": "service.esophageal_manometry",
        "pendingLabel": "Esophageal manometry pending",
        "resultNarrative": "The esophageal pressure-study report is available for review.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.esophageal_manometry.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.achalasia.manometry.4",
        "resultTypeId": "service.esophageal_manometry",
        "pendingLabel": "Esophageal manometry pending",
        "resultNarrative": "The esophageal pressure-study report is available for review.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.esophageal_manometry.outsourced"
        ]
      },
      "reason": "The original initial-test rule is replaced by interpretation of an existing technically limited or symptom-discordant physiologic study."
    }
  },
  {
    "id": "revision.qq20261102c.b05",
    "auditId": "B05",
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r4",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which initial imaging study should be arranged for {patientName}'s groin symptoms?",
    "previousChoiceLabels": [
      "Standing groin ultrasound during straining",
      "Dynamic groin MRI during straining",
      "Pelvic CT with multiplanar groin assessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Distinguish a resting scan of a different target from an adequate occult-hernia assessment. Then Obtain a technically appropriate dynamic study before escalating or assigning all symptoms to the hip.",
    "reviewerNotes": "Clinician must verify the target/provocation observations and whether the photograph establishes any diagnosis. Dynamic MRI is a legitimate alternative in appropriate uncertainty; this question does not force-rank it against adequate ultrasound.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_4": "dynamic_ultrasound_4",
      "choice.qq20261102c.b05.d1": "choice.qq20261102b.b05.d1",
      "choice.qq20261102c.b05.d2": "choice.qq20261102b.b05.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_4": "service.ultrasound",
      "choice.qq20261102c.b05.d1": null,
      "choice.qq20261102c.b05.d2": null
    },
    "choiceTimingOverrides": {
      "dynamic_ultrasound_4": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qq20261102c.b05.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b05.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "The outside ultrasound was obtained supine at rest with the probe over the painful hip-flexor origin. The saved images do not include coughing or straining. The report describes no groin protrusion.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r4",
      "whatChanged": "Apply the actual outside study's limitations to diagnostic certainty and the next care plan, rather than asserting an unsupported ultrasound-versus-MRI hierarchy.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B05",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. The imaged site and lack of provocation did not test the reported intermittent swelling. The paired follow-up uses the actual result of this selected imaging pathway. New inference, rather than a substitute cue: The imaged site and lack of provocation did not test the reported intermittent swelling. Attack: All three choices pair a diagnostic-certainty conclusion with its care consequence. The negative outside report and competing hip findings tempt false exclusion; the photograph tempts premature confirmation. Dynamic MRI is not offered as incorrectly inferior to repeat ultrasound."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The imaged site and lack of provocation did not test the reported intermittent swelling. Remove dynamic MRI as a wrong alternative: the guideline permits it after nondiagnostic ultrasound. Test false exclusion versus premature confirmation with three parallel certainty-and-plan choices. The imaged site and lack of provocation did not test the reported intermittent swelling. Source limits: Clinician must verify the target/provocation observations and whether the photograph establishes any diagnosis. Dynamic MRI is a legitimate alternative in appropriate uncertainty; this question does not force-rank it against adequate ultrasound.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Distinguish a resting scan of a different target from an adequate occult-hernia assessment. Then Obtain a technically appropriate dynamic study before escalating or assigning all symptoms to the hip. Closest competing error: Accept the outside negative label and treat the hip findings as sufficient to exclude the intermittent groin process. The paired follow-up uses the actual result of this selected imaging pathway. The imaged site and lack of provocation did not test the reported intermittent swelling.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The scored objective changes from initial ultrasound selection to deciding how an actual prior evaluation should change the next investigation."
        ],
        "suggestions": [
          "suggestions 1: Remove dynamic MRI as a wrong alternative: the guideline permits it after nondiagnostic ultrasound. Test false exclusion versus premature confirmation with three parallel certainty-and-plan choices. The imaged site and lack of provocation did not test the reported intermittent swelling. Concrete implementation: Distinguish a resting scan of a different target from an adequate occult-hernia assessment. Then Obtain a technically appropriate dynamic study before escalating or assigning all symptoms to the hip. The closest error is: Accept the outside negative label and treat the hip findings as sufficient to exclude the intermittent groin process. Required clinical boundary: Clinician must verify the target/provocation observations and whether the photograph establishes any diagnosis. Dynamic MRI is a legitimate alternative in appropriate uncertainty; this question does not force-rank it against adequate ultrasound.",
          "suggestions 2: The task and objective are changed rather than defending an onboarding exception. The paired follow-up uses the actual result of this selected imaging pathway. Concrete implementation: Distinguish a resting scan of a different target from an adequate occult-hernia assessment. Then Obtain a technically appropriate dynamic study before escalating or assigning all symptoms to the hip. The closest error is: Accept the outside negative label and treat the hip findings as sufficient to exclude the intermittent groin process. Required clinical boundary: Clinician must verify the target/provocation observations and whether the photograph establishes any diagnosis. Dynamic MRI is a legitimate alternative in appropriate uncertainty; this question does not force-rank it against adequate ultrasound."
        ]
      },
      "selfCheck": {
        "cueAttack": "All three choices pair a diagnostic-certainty conclusion with its care consequence. The negative outside report and competing hip findings tempt false exclusion; the photograph tempts premature confirmation. Dynamic MRI is not offered as incorrectly inferior to repeat ultrasound.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Distinguish a resting scan of a different target from an adequate occult-hernia assessment.",
          "Obtain a technically appropriate dynamic study before escalating or assigning all symptoms to the hip."
        ],
        "oneBestAnswer": "The imaged site and lack of provocation did not test the reported intermittent swelling.",
        "closestDistractor": "Accept the outside negative label and treat the hip findings as sufficient to exclude the intermittent groin process.",
        "remainingReview": "Clinician must verify the target/provocation observations and whether the photograph establishes any diagnosis. Dynamic MRI is a legitimate alternative in appropriate uncertainty; this question does not force-rank it against adequate ultrasound."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r5",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "stem": "Which interpretation and next plan best fit {patientName}'s outside assessment?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_4",
          "label": "Hernia unresolved; dynamic groin ultrasound",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The outside acquisition did not assess the reported intermittent groin event. It cannot exclude a hernia; a properly targeted dynamic study is an appropriate completion plan."
        },
        {
          "id": "choice.qq20261102c.b05.d1",
          "label": "Hernia excluded; hip-directed rehabilitation",
          "isCorrect": false,
          "distractorRationale": "The hip findings can explain part of the pain, but do not make the mistargeted or resting negative study an exclusion of the photographed swelling."
        },
        {
          "id": "choice.qq20261102c.b05.d2",
          "label": "Hernia established; elective inguinal repair planning",
          "isCorrect": false,
          "distractorRationale": "The photographed swelling and limited outside study do not establish the anatomic diagnosis needed to commit to a repair pathway."
        }
      ],
      "explanation": "Interpret an ultrasound result together with its actual target and acquisition. An incomplete or mistargeted study does not answer the reported event; a suitable negative study with continuing uncertainty can support dynamic cross-sectional imaging. Choose the protocol that resolves the particular unanswered diagnostic question.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment",
        "claim.qq20261102c.groin-imaging-after-negative-study",
        "claim.qq20261102c.groin-inadequate-study-certainty"
      ],
      "teachingPoint": "Interpret an ultrasound result together with its actual target and acquisition. An incomplete or mistargeted study does not answer the reported event; a suitable negative study with continuing uncertainty can support dynamic cross-sectional imaging. Choose the protocol that resolves the particular unanswered diagnostic question."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "nextConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "previousKeyServiceId": "service.ultrasound",
      "nextKeyServiceId": "service.ultrasound",
      "previousResultGate": {
        "id": "gate.inguinal-hernia.ultrasound.4",
        "resultTypeId": "service.ultrasound",
        "pendingLabel": "Dynamic groin ultrasound pending",
        "resultNarrative": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ultrasound.outsourced",
          "route.ultrasound.in_house"
        ]
      },
      "nextResultGate": {
        "id": "gate.inguinal-hernia.ultrasound.4",
        "resultTypeId": "service.ultrasound",
        "pendingLabel": "Targeted dynamic groin ultrasound pending",
        "resultNarrative": "With standing and straining, ultrasound shows an inguinal protrusion that withdraws at rest. Pressure over that protrusion reproduces the superficial pain reported during lifting. Hip rotation reproduces a separate deep ache.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ultrasound.outsourced",
          "route.ultrasound.in_house"
        ]
      },
      "reason": "The scored objective changes from initial ultrasound selection to deciding how an actual prior evaluation should change the next investigation."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with groin pain after long work shifts. Hip rotation reproduces a deep ache. A separate superficial swelling is seen after lifting. The office cough examination does not reproduce it.",
    "previousPresentation": "{patientName}, a 51-year-old man, visits the clinic with groin pain after long work shifts. Hip rotation reproduces a deep ache, but the patient describes a separate surface swelling that is absent on waking. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
    "previousProfilePresentations": [
      {
        "id": "profile.inguinal-hernia.standing-shift.male.51",
        "presentation": "{patientName}, a 51-year-old man, visits the clinic with groin pain after long work shifts. Hip rotation reproduces a deep ache, but the patient describes a separate surface swelling that is absent on waking. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      },
      {
        "id": "profile.inguinal-hernia.standing-shift.male.54",
        "presentation": "{patientName}, a 54-year-old man, visits the clinic with groin pain after long work shifts. Hip rotation reproduces a deep ache, but the patient describes a separate surface swelling that is absent on waking. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      },
      {
        "id": "profile.inguinal-hernia.standing-shift.male.57",
        "presentation": "{patientName}, a 57-year-old man, visits the clinic with groin pain after long work shifts. Hip rotation reproduces a deep ache, but the patient describes a separate surface swelling that is absent on waking. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      },
      {
        "id": "profile.inguinal-hernia.standing-shift.male.60",
        "presentation": "{patientName}, a 60-year-old man, visits the clinic with groin pain after long work shifts. Hip rotation reproduces a deep ache, but the patient describes a separate surface swelling that is absent on waking. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.inguinal-hernia.standing-shift",
        "patientPresentationVariantId": "presentation.inguinal-hernia.standing-shift",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Intermittent groin bulge",
        "revisedPresentation": "{patientName}, a 51-year-old man, visits the clinic with groin pain after long work shifts. Hip rotation reproduces a deep ache, but the patient describes a separate surface swelling that is absent on waking. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.standing-shift.male.51",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.standing-shift.male.51",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 51-year-old man, visits the clinic with groin pain after long work shifts. Hip rotation reproduces a deep ache, but the patient describes a separate surface swelling that is absent on waking. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.standing-shift.male.54",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.standing-shift.male.54",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 54-year-old man, visits the clinic with groin pain after long work shifts. Hip rotation reproduces a deep ache, but the patient describes a separate surface swelling that is absent on waking. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.standing-shift.male.57",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.standing-shift.male.57",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 57-year-old man, visits the clinic with groin pain after long work shifts. Hip rotation reproduces a deep ache, but the patient describes a separate surface swelling that is absent on waking. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.standing-shift.male.60",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.standing-shift.male.60",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 60-year-old man, visits the clinic with groin pain after long work shifts. Hip rotation reproduces a deep ache, but the patient describes a separate surface swelling that is absent on waking. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
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
        "ageYears": 51,
        "sexLabel": "Male"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102c.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v7"
    }
  },
  {
    "id": "revision.qq20261102c.b05-context",
    "auditId": "B05-context",
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r4",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which management plan should be discussed with {patientName}?",
    "previousChoiceLabels": [
      "Elective hernia repair consultation",
      "Watchful waiting with symptom-triggered review",
      "Hip-directed rehabilitation and symptom review"
    ],
    "previousCurrentUpdate": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Discuss repair for the concordant hernia-related symptoms while retaining a separate musculoskeletal assessment.",
    "reviewerNotes": "Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_4": "elective_discussion_4",
      "choice.qq20261102c.b05-context.d1": "choice.qq20261102b.b05-context.d1",
      "choice.qq20261102c.b05-context.d2": "choice.qq20261102b.b05-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_4": null,
      "choice.qq20261102c.b05-context.d1": null,
      "choice.qq20261102c.b05-context.d2": null
    },
    "currentUpdate": "With standing and straining, ultrasound shows an inguinal protrusion that withdraws at rest. Pressure over that protrusion reproduces the superficial pain reported during lifting. Hip rotation reproduces a separate deep ache.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r4",
      "whatChanged": "Replace identical repair-consultation answers with paired concordant versus discordant symptom-attribution decisions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B05-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. New inference, rather than a substitute cue: Pressure/strain over the actual protrusion reproduces one pain, while hip/adductor maneuvers reproduce a separate ache. Attack: The image finding alone no longer supplies the key. Repair options are close and credible, but their proposed pain attribution differs. No preference simply asks for the keyed plan."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: Pressure/strain over the actual protrusion reproduces one pain, while hip/adductor maneuvers reproduce a separate ache. Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Source limits: Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Discuss repair for the concordant hernia-related symptoms while retaining a separate musculoskeletal assessment. Closest competing error: Offer repair as a cure for both anatomically separate pains. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The scored objective changes from repairing an already-labelled symptomatic hernia to deciding whether the hernia accounts for the symptoms."
        ],
        "suggestions": [
          "suggestions 1: Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Concrete implementation: Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Discuss repair for the concordant hernia-related symptoms while retaining a separate musculoskeletal assessment. The closest error is: Offer repair as a cure for both anatomically separate pains. Required clinical boundary: Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
          "suggestions 2: Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. Concrete implementation: Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Discuss repair for the concordant hernia-related symptoms while retaining a separate musculoskeletal assessment. The closest error is: Offer repair as a cure for both anatomically separate pains. Required clinical boundary: Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing."
        ]
      },
      "selfCheck": {
        "cueAttack": "The image finding alone no longer supplies the key. Repair options are close and credible, but their proposed pain attribution differs. No preference simply asks for the keyed plan.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image.",
          "Discuss repair for the concordant hernia-related symptoms while retaining a separate musculoskeletal assessment."
        ],
        "oneBestAnswer": "Pressure/strain over the actual protrusion reproduces one pain, while hip/adductor maneuvers reproduce a separate ache.",
        "closestDistractor": "Offer repair as a cure for both anatomically separate pains.",
        "remainingReview": "Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v4.r5",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "stem": "Which management discussion should follow {patientName}'s returned imaging and examination findings?",
      "answerChoices": [
        {
          "id": "elective_discussion_4",
          "label": "Discuss hernia repair and hip-pain assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Treat the two pain patterns separately: repair consultation addresses the reproducible hernia-related component without promising to cure the deep musculoskeletal ache."
        },
        {
          "id": "choice.qq20261102c.b05-context.d1",
          "label": "Trial hip rehabilitation with hernia observation",
          "isCorrect": false,
          "distractorRationale": "The reproduced superficial pain over the demonstrated protrusion is not accounted for by hip findings alone."
        },
        {
          "id": "choice.qq20261102c.b05-context.d2",
          "label": "Discuss elective hernia repair without hip assessment",
          "isCorrect": false,
          "distractorRationale": "A confirmed hernia does not establish that anatomically separate hip/adductor symptoms will resolve with repair."
        }
      ],
      "explanation": "A positive image and a symptom may coexist without having the same cause. Correlate location and provocation. In a man with a reducible painless hernia, watchful waiting can be discussed; concordant activity-limiting hernia symptoms support repair assessment. Neither path promises resolution of a separate musculoskeletal problem.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "teachingPoint": "A positive image and a symptom may coexist without having the same cause. Correlate location and provocation. In a man with a reducible painless hernia, watchful waiting can be discussed; concordant activity-limiting hernia symptoms support repair assessment. Neither path promises resolution of a separate musculoskeletal problem."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored objective changes from repairing an already-labelled symptomatic hernia to deciding whether the hernia accounts for the symptoms."
    }
  },
  {
    "id": "revision.qq20261102c.b06",
    "auditId": "B06",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r4",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which initial imaging study should be arranged for {patientName}'s groin symptoms?",
    "previousChoiceLabels": [
      "Standing groin ultrasound during straining",
      "Dynamic groin MRI during straining",
      "Pelvic CT with multiplanar groin assessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Recognize a genuinely adequate negative dynamic ultrasound rather than a missing-provocation problem. Then Use cross-sectional dynamic assessment to evaluate an occult hernia and a competing musculoskeletal cause before closing the workup.",
    "reviewerNotes": "Confirm ultrasound adequacy, local expertise and the preferred dynamic cross-sectional investigation; MRI is not an absolute rule for every negative study.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_2": "dynamic_ultrasound_2",
      "choice.qq20261102c.b06.d1": "choice.qq20261102b.b06.d1",
      "choice.qq20261102c.b06.d2": "choice.qq20261102b.b06.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_2": "service.mri",
      "choice.qq20261102c.b06.d1": "service.ultrasound",
      "choice.qq20261102c.b06.d2": null
    },
    "choiceTimingOverrides": {
      "dynamic_ultrasound_2": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102c.b06.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qq20261102c.b06.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "An experienced examiner obtained groin ultrasound supine and standing during repeated coughing and straining. The photographed contour change and focal groin symptoms occurred during scanning, but no canal protrusion was seen. The adductor attachment is tender on examination.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r4",
      "whatChanged": "Replace four first-ultrasound rules with protocol/site-specific decisions and two MRI completion pathways.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B06",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The scan actually reproduced the event with a suitable protocol; persistent separate contour symptoms remain unexplained. The scan actually reproduced the event with a suitable protocol; persistent separate contour symptoms remain unexplained. The task and objective are changed rather than defending an onboarding exception. Source limits: Confirm ultrasound adequacy, local expertise and the preferred dynamic cross-sectional investigation; MRI is not an absolute rule for every negative study.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Recognize a genuinely adequate negative dynamic ultrasound rather than a missing-provocation problem. Then Use cross-sectional dynamic assessment to evaluate an occult hernia and a competing musculoskeletal cause before closing the workup. Closest competing error: Treat the adductor findings as the whole explanation after a negative scan. The paired follow-up uses the actual result of this selected imaging pathway. The scan actually reproduced the event with a suitable protocol; persistent separate contour symptoms remain unexplained.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The scored objective changes from initial ultrasound selection to deciding how an actual prior evaluation should change the next investigation."
        ],
        "suggestions": [
          "suggestions 1: The scan actually reproduced the event with a suitable protocol; persistent separate contour symptoms remain unexplained. The paired follow-up uses the actual result of this selected imaging pathway. Concrete implementation: Recognize a genuinely adequate negative dynamic ultrasound rather than a missing-provocation problem. Then Use cross-sectional dynamic assessment to evaluate an occult hernia and a competing musculoskeletal cause before closing the workup. The closest error is: Treat the adductor findings as the whole explanation after a negative scan. Required clinical boundary: Confirm ultrasound adequacy, local expertise and the preferred dynamic cross-sectional investigation; MRI is not an absolute rule for every negative study.",
          "suggestions 2: The task and objective are changed rather than defending an onboarding exception. The paired follow-up uses the actual result of this selected imaging pathway. Concrete implementation: Recognize a genuinely adequate negative dynamic ultrasound rather than a missing-provocation problem. Then Use cross-sectional dynamic assessment to evaluate an occult hernia and a competing musculoskeletal cause before closing the workup. The closest error is: Treat the adductor findings as the whole explanation after a negative scan. Required clinical boundary: Confirm ultrasound adequacy, local expertise and the preferred dynamic cross-sectional investigation; MRI is not an absolute rule for every negative study."
        ]
      },
      "selfCheck": {
        "cueAttack": "Siblings differ in actual adequacy and localization and have different keyed investigations. Posture is balanced across relevant imaging alternatives; no generic 'inconclusive' label supplies the decision.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize a genuinely adequate negative dynamic ultrasound rather than a missing-provocation problem.",
          "Use cross-sectional dynamic assessment to evaluate an occult hernia and a competing musculoskeletal cause before closing the workup."
        ],
        "oneBestAnswer": "The scan actually reproduced the event with a suitable protocol; persistent separate contour symptoms remain unexplained.",
        "closestDistractor": "Treat the adductor findings as the whole explanation after a negative scan.",
        "remainingReview": "Confirm ultrasound adequacy, local expertise and the preferred dynamic cross-sectional investigation; MRI is not an absolute rule for every negative study."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r5",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "stem": "Which investigation plan should be arranged for {patientName}'s groin symptoms?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_2",
          "label": "Dynamic pelvic MRI with groin strain views",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The next investigation addresses the actual unresolved protocol/localization question rather than relying on a report label."
        },
        {
          "id": "choice.qq20261102c.b06.d1",
          "label": "Repeat dynamic groin ultrasonography",
          "isCorrect": false,
          "distractorRationale": "The stated acquisition history makes this apparently routine step premature or repetitive."
        },
        {
          "id": "choice.qq20261102c.b06.d2",
          "label": "Sports-medicine assessment with clinical reassessment",
          "isCorrect": false,
          "distractorRationale": "The competing finding or presumed diagnosis does not resolve the documented imaging/symptom mismatch."
        }
      ],
      "explanation": "Interpret an ultrasound result together with its actual target and acquisition. An incomplete or mistargeted study does not answer the reported event; a suitable negative study with continuing uncertainty can support dynamic cross-sectional imaging. Choose the protocol that resolves the particular unanswered diagnostic question.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment",
        "claim.qq20261102c.groin-imaging-after-negative-study"
      ],
      "teachingPoint": "Interpret an ultrasound result together with its actual target and acquisition. An incomplete or mistargeted study does not answer the reported event; a suitable negative study with continuing uncertainty can support dynamic cross-sectional imaging. Choose the protocol that resolves the particular unanswered diagnostic question."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "nextConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "previousKeyServiceId": "service.ultrasound",
      "nextKeyServiceId": "service.mri",
      "previousResultGate": {
        "id": "gate.inguinal-hernia.ultrasound.2",
        "resultTypeId": "service.ultrasound",
        "pendingLabel": "Dynamic groin ultrasound pending",
        "resultNarrative": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ultrasound.outsourced",
          "route.ultrasound.in_house"
        ]
      },
      "nextResultGate": {
        "id": "gate.inguinal-hernia.ultrasound.2",
        "resultTypeId": "service.mri",
        "pendingLabel": "Dynamic groin MRI pending",
        "resultNarrative": "Dynamic MRI shows a small inguinal protrusion during straining and signal change at the adductor attachment. At reassessment, the protrusion is not tender and straining does not reproduce the limiting pain; resisted adduction reproduces the usual medial thigh pain.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.mri.outsourced"
        ]
      },
      "reason": "The scored objective changes from initial ultrasound selection to deciding how an actual prior evaluation should change the next investigation."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with groin pain after running. Resisted adduction reproduces medial thigh pain. A phone photograph also records a transient groin contour change.",
    "previousPresentation": "{patientName}, a 35-year-old man, visits the clinic with groin pain after running. Resisted hip adduction causes discomfort; a phone photograph taken after running shows a contour change at the symptomatic groin. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
    "previousProfilePresentations": [
      {
        "id": "profile.inguinal-hernia.running-discomfort.male.35",
        "presentation": "{patientName}, a 35-year-old man, visits the clinic with groin pain after running. Resisted hip adduction causes discomfort; a phone photograph taken after running shows a contour change at the symptomatic groin. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      },
      {
        "id": "profile.inguinal-hernia.running-discomfort.male.38",
        "presentation": "{patientName}, a 38-year-old man, visits the clinic with groin pain after running. Resisted hip adduction causes discomfort; a phone photograph taken after running shows a contour change at the symptomatic groin. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      },
      {
        "id": "profile.inguinal-hernia.running-discomfort.male.41",
        "presentation": "{patientName}, a 41-year-old man, visits the clinic with groin pain after running. Resisted hip adduction causes discomfort; a phone photograph taken after running shows a contour change at the symptomatic groin. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      },
      {
        "id": "profile.inguinal-hernia.running-discomfort.male.44",
        "presentation": "{patientName}, a 44-year-old man, visits the clinic with groin pain after running. Resisted hip adduction causes discomfort; a phone photograph taken after running shows a contour change at the symptomatic groin. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.inguinal-hernia.running-discomfort",
        "patientPresentationVariantId": "presentation.inguinal-hernia.running-discomfort",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Intermittent groin bulge",
        "revisedPresentation": "{patientName}, a 35-year-old man, visits the clinic with groin pain after running. Resisted hip adduction causes discomfort; a phone photograph taken after running shows a contour change at the symptomatic groin. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.running-discomfort.male.35",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.running-discomfort.male.35",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 35-year-old man, visits the clinic with groin pain after running. Resisted hip adduction causes discomfort; a phone photograph taken after running shows a contour change at the symptomatic groin. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.running-discomfort.male.38",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.running-discomfort.male.38",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 38-year-old man, visits the clinic with groin pain after running. Resisted hip adduction causes discomfort; a phone photograph taken after running shows a contour change at the symptomatic groin. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.running-discomfort.male.41",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.running-discomfort.male.41",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 41-year-old man, visits the clinic with groin pain after running. Resisted hip adduction causes discomfort; a phone photograph taken after running shows a contour change at the symptomatic groin. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.running-discomfort.male.44",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.running-discomfort.male.44",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 44-year-old man, visits the clinic with groin pain after running. Resisted hip adduction causes discomfort; a phone photograph taken after running shows a contour change at the symptomatic groin. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
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
        "ageYears": 35,
        "sexLabel": "Male"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102c.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v7"
    }
  },
  {
    "id": "revision.qq20261102c.b06-context",
    "auditId": "B06-context",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r4",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which management plan should be discussed with {patientName}?",
    "previousChoiceLabels": [
      "Elective hernia repair consultation",
      "Watchful waiting with symptom-triggered review",
      "Hip-directed rehabilitation and symptom review"
    ],
    "previousCurrentUpdate": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Address the discordant musculoskeletal symptoms and discuss watchful waiting for the painless reducible hernia.",
    "reviewerNotes": "Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_2": "elective_discussion_2",
      "choice.qq20261102c.b06-context.d1": "choice.qq20261102b.b06-context.d1",
      "choice.qq20261102c.b06-context.d2": "choice.qq20261102b.b06-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_2": null,
      "choice.qq20261102c.b06-context.d1": null,
      "choice.qq20261102c.b06-context.d2": null
    },
    "currentUpdate": "Dynamic MRI shows a small inguinal protrusion during straining and signal change at the adductor attachment. At reassessment, the protrusion is not tender and straining does not reproduce the limiting pain; resisted adduction reproduces the usual medial thigh pain.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r4",
      "whatChanged": "Replace identical repair-consultation answers with paired concordant versus discordant symptom-attribution decisions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B06-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. New inference, rather than a substitute cue: The protrusion is painless during provocation, while the limiting pain follows the muscle-attachment maneuver. Attack: The image finding alone no longer supplies the key. Repair options are close and credible, but their proposed pain attribution differs. No preference simply asks for the keyed plan."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The protrusion is painless during provocation, while the limiting pain follows the muscle-attachment maneuver. Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Source limits: Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Address the discordant musculoskeletal symptoms and discuss watchful waiting for the painless reducible hernia. Closest competing error: Treat the positive hernia image as the cause of all limiting pain. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The scored objective changes from repairing an already-labelled symptomatic hernia to deciding whether the hernia accounts for the symptoms."
        ],
        "suggestions": [
          "suggestions 1: Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Concrete implementation: Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Address the discordant musculoskeletal symptoms and discuss watchful waiting for the painless reducible hernia. The closest error is: Treat the positive hernia image as the cause of all limiting pain. Required clinical boundary: Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
          "suggestions 2: Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. Concrete implementation: Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Address the discordant musculoskeletal symptoms and discuss watchful waiting for the painless reducible hernia. The closest error is: Treat the positive hernia image as the cause of all limiting pain. Required clinical boundary: Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing."
        ]
      },
      "selfCheck": {
        "cueAttack": "The image finding alone no longer supplies the key. Repair options are close and credible, but their proposed pain attribution differs. No preference simply asks for the keyed plan.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image.",
          "Address the discordant musculoskeletal symptoms and discuss watchful waiting for the painless reducible hernia."
        ],
        "oneBestAnswer": "The protrusion is painless during provocation, while the limiting pain follows the muscle-attachment maneuver.",
        "closestDistractor": "Treat the positive hernia image as the cause of all limiting pain.",
        "remainingReview": "Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v2.r5",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "stem": "Which explanation and initial plan best fit {patientName}'s limiting pain?",
      "answerChoices": [
        {
          "id": "elective_discussion_2",
          "label": "Muscle pain: treat and observe the hernia",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The limiting symptoms track the musculoskeletal provocation, while the reducible protrusion has no reproduced symptoms; do not promise pain relief from repair."
        },
        {
          "id": "choice.qq20261102c.b06-context.d1",
          "label": "Hernia pain: repair before muscle-attachment treatment",
          "isCorrect": false,
          "distractorRationale": "Imaging confirmation alone does not establish symptom attribution or guarantee pain relief."
        },
        {
          "id": "choice.qq20261102c.b06-context.d2",
          "label": "Combined pain: repair with muscle-attachment treatment",
          "isCorrect": false,
          "distractorRationale": "This treats the image label as an explanation for a discordant pain pattern."
        }
      ],
      "explanation": "A positive image and a symptom may coexist without having the same cause. Correlate location and provocation. In a man with a reducible painless hernia, watchful waiting can be discussed; concordant activity-limiting hernia symptoms support repair assessment. Neither path promises resolution of a separate musculoskeletal problem.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "teachingPoint": "A positive image and a symptom may coexist without having the same cause. Correlate location and provocation. In a man with a reducible painless hernia, watchful waiting can be discussed; concordant activity-limiting hernia symptoms support repair assessment. Neither path promises resolution of a separate musculoskeletal problem."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored objective changes from repairing an already-labelled symptomatic hernia to deciding whether the hernia accounts for the symptoms."
    }
  },
  {
    "id": "revision.qq20261102c.b07",
    "auditId": "B07",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r4",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which initial imaging study should be arranged for {patientName}'s groin symptoms?",
    "previousChoiceLabels": [
      "Standing groin ultrasound during straining",
      "Dynamic groin MRI during straining",
      "Pelvic CT with multiplanar groin assessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Notice that a dynamic protocol can still miss the clinical target if localization is wrong. Then Reconcile the observed site and repeat targeted assessment instead of treating a negative report as exclusion.",
    "reviewerNotes": "Clinician must verify the target/provocation observations and whether the photograph establishes any diagnosis. Dynamic MRI is a legitimate alternative in appropriate uncertainty; this question does not force-rank it against adequate ultrasound.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_3": "dynamic_ultrasound_3",
      "choice.qq20261102c.b07.d1": "choice.qq20261102b.b07.d1",
      "choice.qq20261102c.b07.d2": "choice.qq20261102b.b07.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_3": "service.ultrasound",
      "choice.qq20261102c.b07.d1": null,
      "choice.qq20261102c.b07.d2": null
    },
    "choiceTimingOverrides": {
      "dynamic_ultrasound_3": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qq20261102c.b07.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b07.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "The outside ultrasound saved standing strain views, but the operator examined a site lateral to the photographed lump. The report's skin marker and the patient's photograph place the two sites on opposite sides of the inguinal crease.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r4",
      "whatChanged": "Apply the actual outside study's limitations to diagnostic certainty and the next care plan, rather than asserting an unsupported ultrasound-versus-MRI hierarchy.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B07",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. The task and objective are changed rather than defending an onboarding exception. The paired follow-up uses the actual result of this selected imaging pathway. New inference, rather than a substitute cue: The saved site and the photographed event do not correspond. Attack: All three choices pair a diagnostic-certainty conclusion with its care consequence. The negative outside report and competing hip findings tempt false exclusion; the photograph tempts premature confirmation. Dynamic MRI is not offered as incorrectly inferior to repeat ultrasound."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The saved site and the photographed event do not correspond. Remove dynamic MRI as a wrong alternative: the guideline permits it after nondiagnostic ultrasound. Test false exclusion versus premature confirmation with three parallel certainty-and-plan choices. The saved site and the photographed event do not correspond. Source limits: Clinician must verify the target/provocation observations and whether the photograph establishes any diagnosis. Dynamic MRI is a legitimate alternative in appropriate uncertainty; this question does not force-rank it against adequate ultrasound.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Notice that a dynamic protocol can still miss the clinical target if localization is wrong. Then Reconcile the observed site and repeat targeted assessment instead of treating a negative report as exclusion. Closest competing error: Accept the outside negative label and treat the hip findings as sufficient to exclude the intermittent groin process. The paired follow-up uses the actual result of this selected imaging pathway. Remove dynamic MRI as a wrong alternative: the guideline permits it after nondiagnostic ultrasound. Test false exclusion versus premature confirmation with three parallel certainty-and-plan choices.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The scored objective changes from initial ultrasound selection to deciding how an actual prior evaluation should change the next investigation."
        ],
        "suggestions": [
          "suggestions 1: Remove dynamic MRI as a wrong alternative: the guideline permits it after nondiagnostic ultrasound. Test false exclusion versus premature confirmation with three parallel certainty-and-plan choices. The paired follow-up uses the actual result of this selected imaging pathway. Concrete implementation: Notice that a dynamic protocol can still miss the clinical target if localization is wrong. Then Reconcile the observed site and repeat targeted assessment instead of treating a negative report as exclusion. The closest error is: Accept the outside negative label and treat the hip findings as sufficient to exclude the intermittent groin process. Required clinical boundary: Clinician must verify the target/provocation observations and whether the photograph establishes any diagnosis. Dynamic MRI is a legitimate alternative in appropriate uncertainty; this question does not force-rank it against adequate ultrasound.",
          "suggestions 2: The task and objective are changed rather than defending an onboarding exception. The paired follow-up uses the actual result of this selected imaging pathway. Concrete implementation: Notice that a dynamic protocol can still miss the clinical target if localization is wrong. Then Reconcile the observed site and repeat targeted assessment instead of treating a negative report as exclusion. The closest error is: Accept the outside negative label and treat the hip findings as sufficient to exclude the intermittent groin process. Required clinical boundary: Clinician must verify the target/provocation observations and whether the photograph establishes any diagnosis. Dynamic MRI is a legitimate alternative in appropriate uncertainty; this question does not force-rank it against adequate ultrasound."
        ]
      },
      "selfCheck": {
        "cueAttack": "All three choices pair a diagnostic-certainty conclusion with its care consequence. The negative outside report and competing hip findings tempt false exclusion; the photograph tempts premature confirmation. Dynamic MRI is not offered as incorrectly inferior to repeat ultrasound.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Notice that a dynamic protocol can still miss the clinical target if localization is wrong.",
          "Reconcile the observed site and repeat targeted assessment instead of treating a negative report as exclusion."
        ],
        "oneBestAnswer": "The saved site and the photographed event do not correspond.",
        "closestDistractor": "Accept the outside negative label and treat the hip findings as sufficient to exclude the intermittent groin process.",
        "remainingReview": "Clinician must verify the target/provocation observations and whether the photograph establishes any diagnosis. Dynamic MRI is a legitimate alternative in appropriate uncertainty; this question does not force-rank it against adequate ultrasound."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r5",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "stem": "Which interpretation and next plan best fit {patientName}'s outside assessment?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_3",
          "label": "Hernia unresolved; dynamic groin ultrasound",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The outside acquisition did not assess the reported intermittent groin event. It cannot exclude a hernia; a properly targeted dynamic study is an appropriate completion plan."
        },
        {
          "id": "choice.qq20261102c.b07.d1",
          "label": "Hernia excluded; hip-directed rehabilitation",
          "isCorrect": false,
          "distractorRationale": "The hip findings can explain part of the pain, but do not make the mistargeted or resting negative study an exclusion of the photographed swelling."
        },
        {
          "id": "choice.qq20261102c.b07.d2",
          "label": "Hernia established; elective inguinal repair planning",
          "isCorrect": false,
          "distractorRationale": "The photographed swelling and limited outside study do not establish the anatomic diagnosis needed to commit to a repair pathway."
        }
      ],
      "explanation": "Interpret an ultrasound result together with its actual target and acquisition. An incomplete or mistargeted study does not answer the reported event; a suitable negative study with continuing uncertainty can support dynamic cross-sectional imaging. Choose the protocol that resolves the particular unanswered diagnostic question.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment",
        "claim.qq20261102c.groin-imaging-after-negative-study",
        "claim.qq20261102c.groin-inadequate-study-certainty"
      ],
      "teachingPoint": "Interpret an ultrasound result together with its actual target and acquisition. An incomplete or mistargeted study does not answer the reported event; a suitable negative study with continuing uncertainty can support dynamic cross-sectional imaging. Choose the protocol that resolves the particular unanswered diagnostic question."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "nextConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "previousKeyServiceId": "service.ultrasound",
      "nextKeyServiceId": "service.ultrasound",
      "previousResultGate": {
        "id": "gate.inguinal-hernia.ultrasound.3",
        "resultTypeId": "service.ultrasound",
        "pendingLabel": "Dynamic groin ultrasound pending",
        "resultNarrative": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ultrasound.outsourced",
          "route.ultrasound.in_house"
        ]
      },
      "nextResultGate": {
        "id": "gate.inguinal-hernia.ultrasound.3",
        "resultTypeId": "service.ultrasound",
        "pendingLabel": "Targeted dynamic groin ultrasound pending",
        "resultNarrative": "Targeted ultrasound now shows a reducible inguinal protrusion at the photographed site. Straining reproduces the familiar superficial pressure there. A different tender point at the adductor origin produces discomfort only with resisted hip adduction.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ultrasound.outsourced",
          "route.ultrasound.in_house"
        ]
      },
      "reason": "The scored objective changes from initial ultrasound selection to deciding how an actual prior evaluation should change the next investigation."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with groin pain when lifting a relative. A lump is photographed after lifting; it is absent at the clinic examination. There is also localized tenderness near the pubic tubercle.",
    "previousPresentation": "{patientName}, a 59-year-old man, visits the clinic with groin pain when lifting a relative. Tenderness lies near the pubic tubercle; the patient reports a separate lump that disappears after lying down. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
    "previousProfilePresentations": [
      {
        "id": "profile.inguinal-hernia.caregiving-strain.male.59",
        "presentation": "{patientName}, a 59-year-old man, visits the clinic with groin pain when lifting a relative. Tenderness lies near the pubic tubercle; the patient reports a separate lump that disappears after lying down. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      },
      {
        "id": "profile.inguinal-hernia.caregiving-strain.male.62",
        "presentation": "{patientName}, a 62-year-old man, visits the clinic with groin pain when lifting a relative. Tenderness lies near the pubic tubercle; the patient reports a separate lump that disappears after lying down. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      },
      {
        "id": "profile.inguinal-hernia.caregiving-strain.male.65",
        "presentation": "{patientName}, a 65-year-old man, visits the clinic with groin pain when lifting a relative. Tenderness lies near the pubic tubercle; the patient reports a separate lump that disappears after lying down. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      },
      {
        "id": "profile.inguinal-hernia.caregiving-strain.male.68",
        "presentation": "{patientName}, a 68-year-old man, visits the clinic with groin pain when lifting a relative. Tenderness lies near the pubic tubercle; the patient reports a separate lump that disappears after lying down. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.inguinal-hernia.caregiving-strain",
        "patientPresentationVariantId": "presentation.inguinal-hernia.caregiving-strain",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Intermittent groin bulge",
        "revisedPresentation": "{patientName}, a 59-year-old man, visits the clinic with groin pain when lifting a relative. Tenderness lies near the pubic tubercle; the patient reports a separate lump that disappears after lying down. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.caregiving-strain.male.59",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.caregiving-strain.male.59",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 59-year-old man, visits the clinic with groin pain when lifting a relative. Tenderness lies near the pubic tubercle; the patient reports a separate lump that disappears after lying down. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.caregiving-strain.male.62",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.caregiving-strain.male.62",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 62-year-old man, visits the clinic with groin pain when lifting a relative. Tenderness lies near the pubic tubercle; the patient reports a separate lump that disappears after lying down. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.caregiving-strain.male.65",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.caregiving-strain.male.65",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 65-year-old man, visits the clinic with groin pain when lifting a relative. Tenderness lies near the pubic tubercle; the patient reports a separate lump that disappears after lying down. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.caregiving-strain.male.68",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.caregiving-strain.male.68",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 68-year-old man, visits the clinic with groin pain when lifting a relative. Tenderness lies near the pubic tubercle; the patient reports a separate lump that disappears after lying down. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
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
        "ageYears": 59,
        "sexLabel": "Male"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102c.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v7"
    }
  },
  {
    "id": "revision.qq20261102c.b07-context",
    "auditId": "B07-context",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r4",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which management plan should be discussed with {patientName}?",
    "previousChoiceLabels": [
      "Elective hernia repair consultation",
      "Watchful waiting with symptom-triggered review",
      "Hip-directed rehabilitation and symptom review"
    ],
    "previousCurrentUpdate": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Discuss repair for the concordant hernia-related symptoms while retaining a separate musculoskeletal assessment.",
    "reviewerNotes": "Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_3": "elective_discussion_3",
      "choice.qq20261102c.b07-context.d1": "choice.qq20261102b.b07-context.d1",
      "choice.qq20261102c.b07-context.d2": "choice.qq20261102b.b07-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_3": null,
      "choice.qq20261102c.b07-context.d1": null,
      "choice.qq20261102c.b07-context.d2": null
    },
    "currentUpdate": "Targeted ultrasound now shows a reducible inguinal protrusion at the photographed site. Straining reproduces the familiar superficial pressure there. A different tender point at the adductor origin produces discomfort only with resisted hip adduction.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r4",
      "whatChanged": "Replace identical repair-consultation answers with paired concordant versus discordant symptom-attribution decisions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B07-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. New inference, rather than a substitute cue: Pressure/strain over the actual protrusion reproduces one pain, while hip/adductor maneuvers reproduce a separate ache. Attack: The image finding alone no longer supplies the key. Repair options are close and credible, but their proposed pain attribution differs. No preference simply asks for the keyed plan."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: Pressure/strain over the actual protrusion reproduces one pain, while hip/adductor maneuvers reproduce a separate ache. Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Source limits: Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Discuss repair for the concordant hernia-related symptoms while retaining a separate musculoskeletal assessment. Closest competing error: Offer repair as a cure for both anatomically separate pains. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The scored objective changes from repairing an already-labelled symptomatic hernia to deciding whether the hernia accounts for the symptoms."
        ],
        "suggestions": [
          "suggestions 1: Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Concrete implementation: Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Discuss repair for the concordant hernia-related symptoms while retaining a separate musculoskeletal assessment. The closest error is: Offer repair as a cure for both anatomically separate pains. Required clinical boundary: Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
          "suggestions 2: Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. Concrete implementation: Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Discuss repair for the concordant hernia-related symptoms while retaining a separate musculoskeletal assessment. The closest error is: Offer repair as a cure for both anatomically separate pains. Required clinical boundary: Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing."
        ]
      },
      "selfCheck": {
        "cueAttack": "The image finding alone no longer supplies the key. Repair options are close and credible, but their proposed pain attribution differs. No preference simply asks for the keyed plan.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image.",
          "Discuss repair for the concordant hernia-related symptoms while retaining a separate musculoskeletal assessment."
        ],
        "oneBestAnswer": "Pressure/strain over the actual protrusion reproduces one pain, while hip/adductor maneuvers reproduce a separate ache.",
        "closestDistractor": "Offer repair as a cure for both anatomically separate pains.",
        "remainingReview": "Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v3.r5",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "stem": "Which management discussion should follow {patientName}'s returned imaging and examination findings?",
      "answerChoices": [
        {
          "id": "elective_discussion_3",
          "label": "Discuss hernia repair and hip-pain assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Treat the two pain patterns separately: repair consultation addresses the reproducible hernia-related component without promising to cure the deep musculoskeletal ache."
        },
        {
          "id": "choice.qq20261102c.b07-context.d1",
          "label": "Trial hip rehabilitation with hernia observation",
          "isCorrect": false,
          "distractorRationale": "The reproduced superficial pain over the demonstrated protrusion is not accounted for by hip findings alone."
        },
        {
          "id": "choice.qq20261102c.b07-context.d2",
          "label": "Discuss elective hernia repair without hip assessment",
          "isCorrect": false,
          "distractorRationale": "A confirmed hernia does not establish that anatomically separate hip/adductor symptoms will resolve with repair."
        }
      ],
      "explanation": "A positive image and a symptom may coexist without having the same cause. Correlate location and provocation. In a man with a reducible painless hernia, watchful waiting can be discussed; concordant activity-limiting hernia symptoms support repair assessment. Neither path promises resolution of a separate musculoskeletal problem.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "teachingPoint": "A positive image and a symptom may coexist without having the same cause. Correlate location and provocation. In a man with a reducible painless hernia, watchful waiting can be discussed; concordant activity-limiting hernia symptoms support repair assessment. Neither path promises resolution of a separate musculoskeletal problem."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored objective changes from repairing an already-labelled symptomatic hernia to deciding whether the hernia accounts for the symptoms."
    }
  },
  {
    "id": "revision.qq20261102c.b08",
    "auditId": "B08",
    "caseId": "case.inguinal-hernia.lifting-bulge",
    "nodeId": "node.inguinal-hernia.lifting-bulge.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v1.r4",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which initial imaging study should be arranged for {patientName}'s groin symptoms?",
    "previousChoiceLabels": [
      "Standing groin ultrasound during straining",
      "Dynamic groin MRI during straining",
      "Pelvic CT with multiplanar groin assessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Recognize persistent diagnostic uncertainty after adequate concordantly negative studies. Then Choose an investigation that evaluates both an occult defect and a competing muscle-attachment cause before surgery.",
    "reviewerNotes": "Confirm ultrasound adequacy, local expertise and the preferred dynamic cross-sectional investigation; MRI is not an absolute rule for every negative study.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_1": "dynamic_ultrasound_1",
      "choice.qq20261102c.b08.d1": "choice.qq20261102b.b08.d1",
      "choice.qq20261102c.b08.d2": "choice.qq20261102b.b08.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_1": "service.mri",
      "choice.qq20261102c.b08.d1": "service.ultrasound",
      "choice.qq20261102c.b08.d2": null
    },
    "choiceTimingOverrides": {
      "dynamic_ultrasound_1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102c.b08.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qq20261102c.b08.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "Two independently reviewed dynamic groin ultrasound examinations include standing and supine strain views at the marked site. Neither shows a protrusion during the reported event. Hip and abdominal muscle maneuvers reproduce overlapping symptoms.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v1.r4",
      "whatChanged": "Replace four first-ultrasound rules with protocol/site-specific decisions and two MRI completion pathways.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B08",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: Dynamic imaging at the actual marked site has already been adequate; a competing attachment-related cause is reproducible. Dynamic imaging at the actual marked site has already been adequate; a competing attachment-related cause is reproducible. The task and objective are changed rather than defending an onboarding exception. Source limits: Confirm ultrasound adequacy, local expertise and the preferred dynamic cross-sectional investigation; MRI is not an absolute rule for every negative study.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Recognize persistent diagnostic uncertainty after adequate concordantly negative studies. Then Choose an investigation that evaluates both an occult defect and a competing muscle-attachment cause before surgery. Closest competing error: Proceed toward an operation because the history sounds typical despite repeated adequate negative imaging. The paired follow-up uses the actual result of this selected imaging pathway. Dynamic imaging at the actual marked site has already been adequate; a competing attachment-related cause is reproducible.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The scored objective changes from initial ultrasound selection to deciding how an actual prior evaluation should change the next investigation."
        ],
        "suggestions": [
          "suggestions 1: Dynamic imaging at the actual marked site has already been adequate; a competing attachment-related cause is reproducible. The paired follow-up uses the actual result of this selected imaging pathway. Concrete implementation: Recognize persistent diagnostic uncertainty after adequate concordantly negative studies. Then Choose an investigation that evaluates both an occult defect and a competing muscle-attachment cause before surgery. The closest error is: Proceed toward an operation because the history sounds typical despite repeated adequate negative imaging. Required clinical boundary: Confirm ultrasound adequacy, local expertise and the preferred dynamic cross-sectional investigation; MRI is not an absolute rule for every negative study.",
          "suggestions 2: The task and objective are changed rather than defending an onboarding exception. Dynamic imaging at the actual marked site has already been adequate; a competing attachment-related cause is reproducible. Concrete implementation: Recognize persistent diagnostic uncertainty after adequate concordantly negative studies. Then Choose an investigation that evaluates both an occult defect and a competing muscle-attachment cause before surgery. The closest error is: Proceed toward an operation because the history sounds typical despite repeated adequate negative imaging. Required clinical boundary: Confirm ultrasound adequacy, local expertise and the preferred dynamic cross-sectional investigation; MRI is not an absolute rule for every negative study."
        ]
      },
      "selfCheck": {
        "cueAttack": "Siblings differ in actual adequacy and localization and have different keyed investigations. Posture is balanced across relevant imaging alternatives; no generic 'inconclusive' label supplies the decision.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize persistent diagnostic uncertainty after adequate concordantly negative studies.",
          "Choose an investigation that evaluates both an occult defect and a competing muscle-attachment cause before surgery."
        ],
        "oneBestAnswer": "Dynamic imaging at the actual marked site has already been adequate; a competing attachment-related cause is reproducible.",
        "closestDistractor": "Proceed toward an operation because the history sounds typical despite repeated adequate negative imaging.",
        "remainingReview": "Confirm ultrasound adequacy, local expertise and the preferred dynamic cross-sectional investigation; MRI is not an absolute rule for every negative study."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v1.r5",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "stem": "Which investigation plan should be arranged for {patientName}'s groin symptoms?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_1",
          "label": "Dynamic MRI of the groin and pelvis",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The next investigation addresses the actual unresolved protocol/localization question rather than relying on a report label."
        },
        {
          "id": "choice.qq20261102c.b08.d1",
          "label": "Repeat dynamic groin ultrasonography",
          "isCorrect": false,
          "distractorRationale": "The stated acquisition history makes this apparently routine step premature or repetitive."
        },
        {
          "id": "choice.qq20261102c.b08.d2",
          "label": "Diagnostic laparoscopic groin exploration",
          "isCorrect": false,
          "distractorRationale": "The competing finding or presumed diagnosis does not resolve the documented imaging/symptom mismatch."
        }
      ],
      "explanation": "Interpret an ultrasound result together with its actual target and acquisition. An incomplete or mistargeted study does not answer the reported event; a suitable negative study with continuing uncertainty can support dynamic cross-sectional imaging. Choose the protocol that resolves the particular unanswered diagnostic question.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment",
        "claim.qq20261102c.groin-imaging-after-negative-study"
      ],
      "teachingPoint": "Interpret an ultrasound result together with its actual target and acquisition. An incomplete or mistargeted study does not answer the reported event; a suitable negative study with continuing uncertainty can support dynamic cross-sectional imaging. Choose the protocol that resolves the particular unanswered diagnostic question."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "nextConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "previousKeyServiceId": "service.ultrasound",
      "nextKeyServiceId": "service.mri",
      "previousResultGate": {
        "id": "gate.inguinal-hernia.ultrasound.1",
        "resultTypeId": "service.ultrasound",
        "pendingLabel": "Dynamic groin ultrasound pending",
        "resultNarrative": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ultrasound.outsourced",
          "route.ultrasound.in_house"
        ]
      },
      "nextResultGate": {
        "id": "gate.inguinal-hernia.ultrasound.1",
        "resultTypeId": "service.mri",
        "pendingLabel": "Dynamic groin MRI pending",
        "resultNarrative": "Dynamic MRI shows a reducible inguinal protrusion and edema at the rectus-adductor attachment. The visible protrusion causes no discomfort with strain; resisted trunk flexion reproduces the limiting suprapubic pain.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.mri.outsourced"
        ]
      },
      "reason": "The scored objective changes from initial ultrasound selection to deciding how an actual prior evaluation should change the next investigation."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with persistent groin pain during lifting. The pain is now reproduced near the lower abdominal attachment during resisted trunk flexion. The patient also reports a separate intermittent groin swelling.",
    "previousPresentation": "{patientName}, a 44-year-old man, visits the clinic with groin pain while lifting at work. A musculoskeletal assessment reproduces pain with trunk movement; the patient also reports a swelling that comes and goes. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
    "previousProfilePresentations": [
      {
        "id": "profile.inguinal-hernia.lifting-bulge.male.44",
        "presentation": "{patientName}, a 44-year-old man, visits the clinic with groin pain while lifting at work. A musculoskeletal assessment reproduces pain with trunk movement; the patient also reports a swelling that comes and goes. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      },
      {
        "id": "profile.inguinal-hernia.lifting-bulge.male.47",
        "presentation": "{patientName}, a 47-year-old man, visits the clinic with groin pain while lifting at work. A musculoskeletal assessment reproduces pain with trunk movement; the patient also reports a swelling that comes and goes. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      },
      {
        "id": "profile.inguinal-hernia.lifting-bulge.male.50",
        "presentation": "{patientName}, a 50-year-old man, visits the clinic with groin pain while lifting at work. A musculoskeletal assessment reproduces pain with trunk movement; the patient also reports a swelling that comes and goes. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      },
      {
        "id": "profile.inguinal-hernia.lifting-bulge.male.53",
        "presentation": "{patientName}, a 53-year-old man, visits the clinic with groin pain while lifting at work. A musculoskeletal assessment reproduces pain with trunk movement; the patient also reports a swelling that comes and goes. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.inguinal-hernia.lifting-bulge",
        "patientPresentationVariantId": "presentation.inguinal-hernia.lifting-bulge",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Intermittent groin bulge",
        "revisedPresentation": "{patientName}, a 44-year-old man, visits the clinic with groin pain while lifting at work. A musculoskeletal assessment reproduces pain with trunk movement; the patient also reports a swelling that comes and goes. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.lifting-bulge.male.44",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.lifting-bulge.male.44",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 44-year-old man, visits the clinic with groin pain while lifting at work. A musculoskeletal assessment reproduces pain with trunk movement; the patient also reports a swelling that comes and goes. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.lifting-bulge.male.47",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.lifting-bulge.male.47",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 47-year-old man, visits the clinic with groin pain while lifting at work. A musculoskeletal assessment reproduces pain with trunk movement; the patient also reports a swelling that comes and goes. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.lifting-bulge.male.50",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.lifting-bulge.male.50",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 50-year-old man, visits the clinic with groin pain while lifting at work. A musculoskeletal assessment reproduces pain with trunk movement; the patient also reports a swelling that comes and goes. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.inguinal-hernia.lifting-bulge.male.53",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.lifting-bulge.male.53",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 53-year-old man, visits the clinic with groin pain while lifting at work. A musculoskeletal assessment reproduces pain with trunk movement; the patient also reports a swelling that comes and goes. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
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
        "ageYears": 44,
        "sexLabel": "Male"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102c.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v7"
    }
  },
  {
    "id": "revision.qq20261102c.b08-context",
    "auditId": "B08-context",
    "caseId": "case.inguinal-hernia.lifting-bulge",
    "nodeId": "node.inguinal-hernia.lifting-bulge.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r4",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which management plan should be discussed with {patientName}?",
    "previousChoiceLabels": [
      "Elective hernia repair consultation",
      "Watchful waiting with symptom-triggered review",
      "Hip-directed rehabilitation and symptom review"
    ],
    "previousCurrentUpdate": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Address the discordant musculoskeletal symptoms and discuss watchful waiting for the painless reducible hernia.",
    "reviewerNotes": "Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_1": "elective_discussion_1",
      "choice.qq20261102c.b08-context.d1": "choice.qq20261102b.b08-context.d1",
      "choice.qq20261102c.b08-context.d2": "choice.qq20261102b.b08-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_1": null,
      "choice.qq20261102c.b08-context.d1": null,
      "choice.qq20261102c.b08-context.d2": null
    },
    "currentUpdate": "Dynamic MRI shows a reducible inguinal protrusion and edema at the rectus-adductor attachment. The visible protrusion causes no discomfort with strain; resisted trunk flexion reproduces the limiting suprapubic pain.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r4",
      "whatChanged": "Replace identical repair-consultation answers with paired concordant versus discordant symptom-attribution decisions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B08-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. New inference, rather than a substitute cue: The protrusion is painless during provocation, while the limiting pain follows the muscle-attachment maneuver. Attack: The image finding alone no longer supplies the key. Repair options are close and credible, but their proposed pain attribution differs. No preference simply asks for the keyed plan."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The protrusion is painless during provocation, while the limiting pain follows the muscle-attachment maneuver. Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Source limits: Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Address the discordant musculoskeletal symptoms and discuss watchful waiting for the painless reducible hernia. Closest competing error: Treat the positive hernia image as the cause of all limiting pain. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The scored objective changes from repairing an already-labelled symptomatic hernia to deciding whether the hernia accounts for the symptoms."
        ],
        "suggestions": [
          "suggestions 1: Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. Replace the identical activity-interruption sentence with concrete location and maneuver correlations. Concrete implementation: Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Address the discordant musculoskeletal symptoms and discuss watchful waiting for the painless reducible hernia. The closest error is: Treat the positive hernia image as the cause of all limiting pain. Required clinical boundary: Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing.",
          "suggestions 2: Two siblings support a limited repair discussion; two support musculoskeletal assessment with observation of a painless protrusion. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. Concrete implementation: Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image. Then Address the discordant musculoskeletal symptoms and discuss watchful waiting for the painless reducible hernia. The closest error is: Treat the positive hernia image as the cause of all limiting pain. Required clinical boundary: Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing."
        ]
      },
      "selfCheck": {
        "cueAttack": "The image finding alone no longer supplies the key. Repair options are close and credible, but their proposed pain attribution differs. No preference simply asks for the keyed plan.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Map each reproduced pain pattern to its location and maneuver rather than attributing every symptom to a positive image.",
          "Address the discordant musculoskeletal symptoms and discuss watchful waiting for the painless reducible hernia."
        ],
        "oneBestAnswer": "The protrusion is painless during provocation, while the limiting pain follows the muscle-attachment maneuver.",
        "closestDistractor": "Treat the positive hernia image as the cause of all limiting pain.",
        "remainingReview": "Clinician must verify pain localization and counseling; no individual outcome guarantee or unverified operation timing."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v1.r5",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "stem": "Which explanation and initial plan best fit {patientName}'s limiting pain?",
      "answerChoices": [
        {
          "id": "elective_discussion_1",
          "label": "Muscle pain: treat and observe the hernia",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The limiting symptoms track the musculoskeletal provocation, while the reducible protrusion has no reproduced symptoms; do not promise pain relief from repair."
        },
        {
          "id": "choice.qq20261102c.b08-context.d1",
          "label": "Hernia pain: repair before muscle-attachment treatment",
          "isCorrect": false,
          "distractorRationale": "Imaging confirmation alone does not establish symptom attribution or guarantee pain relief."
        },
        {
          "id": "choice.qq20261102c.b08-context.d2",
          "label": "Combined pain: repair with muscle-attachment treatment",
          "isCorrect": false,
          "distractorRationale": "This treats the image label as an explanation for a discordant pain pattern."
        }
      ],
      "explanation": "A positive image and a symptom may coexist without having the same cause. Correlate location and provocation. In a man with a reducible painless hernia, watchful waiting can be discussed; concordant activity-limiting hernia symptoms support repair assessment. Neither path promises resolution of a separate musculoskeletal problem.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "teachingPoint": "A positive image and a symptom may coexist without having the same cause. Correlate location and provocation. In a man with a reducible painless hernia, watchful waiting can be discussed; concordant activity-limiting hernia symptoms support repair assessment. Neither path promises resolution of a separate musculoskeletal problem."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored objective changes from repairing an already-labelled symptomatic hernia to deciding whether the hernia accounts for the symptoms."
    }
  },
  {
    "id": "revision.qq20261102c.b09",
    "auditId": "B09",
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-palpable-node",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-palpable-node.1",
    "previousQuestionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r4",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which regional imaging plan should be obtained before {patientName}'s operation?",
    "previousChoiceLabels": [
      "Neck ultrasound of central and lateral nodal compartments",
      "Contrast neck CT of central and lateral nodal compartments",
      "Contrast neck MRI of central and lateral nodal compartments"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Compare suspicious solid-rim ultrasound observations with what the needle actually sampled. Then Resolve the nodal uncertainty before assigning an operative nodal category.",
    "reviewerNotes": "Clinician must verify sampling eligibility, localization and intact-thyroid washout interpretation. The 12-mm measurement is a constructed patient observation; the guideline's sampling criterion is the evidence-backed rule, not a new authored threshold.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qq20261102c.b09.d1": "choice.qq20261102b.b09.d1",
      "choice.qq20261102c.b09.d2": "choice.qq20261102b.b09.d2"
    },
    "choiceServiceOverrides": {
      "correct_3": "service.thyroid_fna",
      "choice.qq20261102c.b09.d1": "service.ultrasound",
      "choice.qq20261102c.b09.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102c.b09.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qq20261102c.b09.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "The outside neck ultrasound includes central and lateral compartments. A lateral node has a 12-mm short axis, a fluid-filled center, punctate bright foci in its solid rim and peripheral blood flow. Aspiration of the fluid yielded macrophages and proteinaceous material; the saved needle image shows no pass through the solid rim.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r4",
      "whatChanged": "Use a complete prior map and fluid-only sampling of a cystic node; test targeted resampling rather than initial ultrasound recall.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B09",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The suspicious solid component was not sampled; full compartment mapping is already available. Offer whole-map repetition and false node-negative assignment as credible errors. Document actual mapped compartments, solid rim features and needle target. Source limits: Clinician must verify sampling eligibility, localization and intact-thyroid washout interpretation. The 12-mm measurement is a constructed patient observation; the guideline's sampling criterion is the evidence-backed rule, not a new authored threshold.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Compare suspicious solid-rim ultrasound observations with what the needle actually sampled. Then Resolve the nodal uncertainty before assigning an operative nodal category. Closest competing error: Accept the reported negative fluid aspirate and proceed as node-negative. Document actual mapped compartments, solid rim features and needle target. Offer whole-map repetition and false node-negative assignment as credible errors.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: Initial compartment mapping changes to resolving an already-mapped suspicious node's discordant sampling result."
        ],
        "suggestions": [
          "suggestions 1: Document actual mapped compartments, solid rim features and needle target. Offer whole-map repetition and false node-negative assignment as credible errors. Concrete implementation: Compare suspicious solid-rim ultrasound observations with what the needle actually sampled. Then Resolve the nodal uncertainty before assigning an operative nodal category. The closest error is: Accept the reported negative fluid aspirate and proceed as node-negative. Required clinical boundary: Clinician must verify sampling eligibility, localization and intact-thyroid washout interpretation. The 12-mm measurement is a constructed patient observation; the guideline's sampling criterion is the evidence-backed rule, not a new authored threshold.",
          "suggestions 2: Document actual mapped compartments, solid rim features and needle target. Offer whole-map repetition and false node-negative assignment as credible errors. Concrete implementation: Compare suspicious solid-rim ultrasound observations with what the needle actually sampled. Then Resolve the nodal uncertainty before assigning an operative nodal category. The closest error is: Accept the reported negative fluid aspirate and proceed as node-negative. Required clinical boundary: Clinician must verify sampling eligibility, localization and intact-thyroid washout interpretation. The 12-mm measurement is a constructed patient observation; the guideline's sampling criterion is the evidence-backed rule, not a new authored threshold."
        ]
      },
      "selfCheck": {
        "cueAttack": "The task is no longer the first mapping test. Coverage is already adequate, and the near miss is accepting a target-mismatched negative sample. No serum/washout cutoff is supplied as a universal rule.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Compare suspicious solid-rim ultrasound observations with what the needle actually sampled.",
          "Resolve the nodal uncertainty before assigning an operative nodal category."
        ],
        "oneBestAnswer": "The suspicious solid component was not sampled; full compartment mapping is already available.",
        "closestDistractor": "Accept the reported negative fluid aspirate and proceed as node-negative.",
        "remainingReview": "Clinician must verify sampling eligibility, localization and intact-thyroid washout interpretation. The 12-mm measurement is a constructed patient observation; the guideline's sampling criterion is the evidence-backed rule, not a new authored threshold."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r5",
      "conceptId": "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v2",
      "stem": "Which preoperative diagnostic plan should be arranged for {patientName}'s lateral neck finding?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Repeat node FNA with cytology and thyroglobulin washout",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The prior fluid-only sample does not resolve the suspicious rim findings. Target solid tissue and use washout as an adjunct interpreted with the intact thyroid."
        },
        {
          "id": "choice.qq20261102c.b09.d1",
          "label": "Repeat whole-neck ultrasound before further cervical-node FNA",
          "isCorrect": false,
          "distractorRationale": "The compartments are already mapped; repeating the map alone does not resolve the discordant node sample."
        },
        {
          "id": "choice.qq20261102c.b09.d2",
          "label": "Proceed with cervical-node staging from the existing cytology",
          "isCorrect": false,
          "distractorRationale": "Macrophages/protein in a cystic aspirate do not establish a benign result for a suspicious solid rim."
        }
      ],
      "explanation": "A negative or nondiagnostic fluid aspirate does not override discordant nodal imaging. Repeat targeted cytology and consider thyroglobulin washout, especially for a cystic node, before allowing the result to determine the surgical plan. Washout is adjunctive, with limitations when the thyroid remains in place.",
      "supportingEvidenceClaimIds": [
        "claim.dtc.preop-ultrasound",
        "claim.qq20261102a.papillary-cytology-regional-survey",
        "claim.qq20261102a.papillary-cytology-pattern",
        "claim.qq20261102c.thyroid-cystic-node-discordance"
      ],
      "teachingPoint": "A negative or nondiagnostic fluid aspirate does not override discordant nodal imaging. Repeat targeted cytology and consider thyroglobulin washout, especially for a cystic node, before allowing the result to determine the surgical plan. Washout is adjunctive, with limitations when the thyroid remains in place."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound",
      "nextConceptId": "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v2",
      "previousKeyServiceId": "service.ultrasound",
      "nextKeyServiceId": "service.thyroid_fna",
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Initial compartment mapping changes to resolving an already-mapped suspicious node's discordant sampling result."
    }
  },
  {
    "id": "revision.qq20261102c.b11-context",
    "auditId": "B11-context",
    "caseId": "case.pigmented-skin-lesion.shoulder-border",
    "nodeId": "node.pigmented-skin-lesion.shoulder-border.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r4",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
    "previousChoiceLabels": [
      "Entire-lesion excision with narrow margin into subcutaneous fat",
      "Punch biopsy of the darkest pigmented focus into subcutaneous fat",
      "Punch biopsy of the most elevated focus into subcutaneous fat"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan.",
    "reviewerNotes": "Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_2": "excisional_2",
      "choice.qq20261102c.b11-context.d1": "choice.qq20261102b.b11-context.d1",
      "choice.qq20261102c.b11-context.d2": "choice.qq20261102b.b11-context.d2"
    },
    "choiceServiceOverrides": {
      "excisional_2": "service.skin_excisional_biopsy",
      "choice.qq20261102c.b11-context.d1": null,
      "choice.qq20261102c.b11-context.d2": null
    },
    "choiceTimingOverrides": {
      "excisional_2": {
        "kind": "test",
        "timingProfileId": "timing.test.excisional_biopsy"
      },
      "choice.qq20261102c.b11-context.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b11-context.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "An outside tangential specimen came from the flat edge of the pigmented area. It contains atypical melanocytes along the epidermal junction and reaches the deep specimen edge. A raised central component remains on examination. The report does not give a reliable maximum invasive thickness.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r4",
      "whatChanged": "Replace complete-versus-two-punch recall with a documented sampling/microstaging error and competing definitive-procedure plans.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B11-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited phrase remains in Presentation because its observation is necessary; its old option-aligned exclusion no longer determines this changed task. The sampled flat edge does not establish the depth of the raised residual component. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. New inference, rather than a substitute cue: The sampled flat edge does not establish the depth of the raised residual component. Attack: Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion.",
          "cues 2: The cited wording is absent from the new visible fields. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. The sampled flat edge does not establish the depth of the raised residual component. New inference, rather than a substitute cue: The sampled flat edge does not establish the depth of the raised residual component. Attack: Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The sampled flat edge does not establish the depth of the raised residual component. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. The sampled flat edge does not establish the depth of the raised residual component. Source limits: Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan. Closest competing error: Proceed directly to wide excision/flap using an incompletely measured lesion. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. Retain passed later pathology/staging exactly; the gate supplies the completed specimen report.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The initial small-lesion excision rule changes to interpreting an actual partial specimen and sequencing completion against definitive surgery."
        ],
        "suggestions": [
          "suggestions 1: The sampled flat edge does not establish the depth of the raised residual component. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. Concrete implementation: Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan. The closest error is: Proceed directly to wide excision/flap using an incompletely measured lesion. Required clinical boundary: Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
          "suggestions 2: All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. The sampled flat edge does not establish the depth of the raised residual component. Concrete implementation: Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan. The closest error is: Proceed directly to wide excision/flap using an incompletely measured lesion. Required clinical boundary: Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced."
        ]
      },
      "selfCheck": {
        "cueAttack": "Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the specimen's site and deep-edge limitations against the actual residual lesion.",
          "Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan."
        ],
        "oneBestAnswer": "The sampled flat edge does not establish the depth of the raised residual component.",
        "closestDistractor": "Proceed directly to wide excision/flap using an incompletely measured lesion.",
        "remainingReview": "Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r5",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
      "stem": "Which plan should be used for {patientName}'s remaining pigmented lesion?",
      "answerChoices": [
        {
          "id": "excisional_2",
          "label": "Complete diagnostic excision before definitive excision and staging",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A representative completion specimen resolves the discrepancy before definitive staging/reconstruction; do not mistake a partial result or a minimum for the whole lesion."
        },
        {
          "id": "choice.qq20261102c.b11-context.d1",
          "label": "Wide excision with flap closure using the current specimen report",
          "isCorrect": false,
          "distractorRationale": "The sample's site or deep edge limits what its result can establish about the residual lesion."
        },
        {
          "id": "choice.qq20261102c.b11-context.d2",
          "label": "Wide excision with sentinel-node biopsy using the current specimen report",
          "isCorrect": false,
          "distractorRationale": "An unsampled appearance or a different flat focus does not provide the missing maximum invasive thickness."
        }
      ],
      "explanation": "The diagnosis and microstaging apply to the tissue actually sampled. An unsampled raised focus, a clinicopathologic mismatch or a transected invasive base may require completion. Diagnostic sampling is distinguished from definitive wide excision; do not choose staging or reconstruction from an unrepresentative result.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion"
      ],
      "teachingPoint": "The diagnosis and microstaging apply to the tissue actually sampled. An unsampled raised focus, a clinicopathologic mismatch or a transected invasive base may require completion. Diagnostic sampling is distinguished from definitive wide excision; do not choose staging or reconstruction from an unrepresentative result."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "nextConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
      "previousKeyServiceId": "service.skin_excisional_biopsy",
      "nextKeyServiceId": "service.skin_excisional_biopsy",
      "previousResultGate": {
        "id": "gate.pigmented-skin-lesion.biopsy.2",
        "resultTypeId": "service.skin_excisional_biopsy",
        "pendingLabel": "Skin-lesion pathology pending",
        "resultNarrative": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.6 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.skin_excisional_biopsy.in_house",
          "route.skin_excisional_biopsy.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.pigmented-skin-lesion.biopsy.2",
        "resultTypeId": "service.skin_excisional_biopsy",
        "pendingLabel": "Skin-lesion pathology pending",
        "resultNarrative": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.6 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.skin_excisional_biopsy.in_house",
          "route.skin_excisional_biopsy.outsourced"
        ]
      },
      "reason": "The initial small-lesion excision rule changes to interpreting an actual partial specimen and sequencing completion against definitive surgery."
    }
  },
  {
    "id": "revision.qq20261102c.b12",
    "auditId": "B12",
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.2",
    "previousQuestionVariantId": "question.melanoma.sentinel-node-staging.v4.r4",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v4.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which regional-node assessment should be discussed with {patientName}?",
    "previousChoiceLabels": [
      "Sentinel lymph node mapping and biopsy",
      "Ultrasound-guided biopsy of an imaged regional node",
      "Ultrasound surveillance of the regional nodes"
    ],
    "previousCurrentUpdate": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.5 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the regional node morphology and whether the sample establishes malignancy or actually sampled the node. Then Use the known-positive pathway rather than performing an occult sentinel-node test.",
    "reviewerNotes": "Melanoma clinician must confirm sample adequacy, staging scope and the contemporary multidisciplinary pathway; no drug regimen or automatic nodal operation is authored.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sentinel_node_4": "sentinel_node_4",
      "choice.qq20261102c.b12.d1": "choice.qq20261102b.b12.d1",
      "choice.qq20261102c.b12.d2": "choice.qq20261102b.b12.d2"
    },
    "choiceServiceOverrides": {
      "sentinel_node_4": null,
      "choice.qq20261102c.b12.d1": null,
      "choice.qq20261102c.b12.d2": null
    },
    "choiceTimingOverrides": {
      "sentinel_node_4": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b12.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qq20261102c.b12.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      }
    },
    "currentUpdate": "The completed primary specimen measures 1.5 mm in maximum vertical thickness. A regional node is round with eccentric cortex and a replaced central hilum. Ultrasound-guided sampling of its solid cortex contains malignant melanocytes matching the skin primary. Distant staging has not yet been completed.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.melanoma.sentinel-node-staging.v4.r4",
      "whatChanged": "Replace two uncomplicated above-threshold sentinel-node rules with positive versus inadequately sampled suspicious-node decisions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B12",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Replace the tailored normal-node observations with actual suspicious morphology and needle/pathology findings. Remove the rejected basic flag and retain the prior concept for existing learning histories. New inference, rather than a substitute cue: Malignant melanocytes in the solid regional-node sample already establish nodal involvement. Attack: The primary thickness is retained as a tempting familiar rule, but the decisive variable is the nodal specimen. The two siblings require different actions for positive versus nonrepresentative-negative sampling."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: Malignant melanocytes in the solid regional-node sample already establish nodal involvement. Replace the tailored normal-node observations with actual suspicious morphology and needle/pathology findings. Retain measured primary thickness, which tempts the familiar shortcut but does not override nodal evidence. Source limits: Melanoma clinician must confirm sample adequacy, staging scope and the contemporary multidisciplinary pathway; no drug regimen or automatic nodal operation is authored.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Interpret the regional node morphology and whether the sample establishes malignancy or actually sampled the node. Then Use the known-positive pathway rather than performing an occult sentinel-node test. Closest competing error: Apply the familiar thickness-based sentinel-node rule despite a proven positive node. Retain measured primary thickness, which tempts the familiar shortcut but does not override nodal evidence. Replace the tailored normal-node observations with actual suspicious morphology and needle/pathology findings.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The scored decision changes from applying a thickness rule in a negative basin to resolving observed nodal evidence before using that rule."
        ],
        "suggestions": [
          "suggestions 1: Replace the tailored normal-node observations with actual suspicious morphology and needle/pathology findings. Retain measured primary thickness, which tempts the familiar shortcut but does not override nodal evidence. Concrete implementation: Interpret the regional node morphology and whether the sample establishes malignancy or actually sampled the node. Then Use the known-positive pathway rather than performing an occult sentinel-node test. The closest error is: Apply the familiar thickness-based sentinel-node rule despite a proven positive node. Required clinical boundary: Melanoma clinician must confirm sample adequacy, staging scope and the contemporary multidisciplinary pathway; no drug regimen or automatic nodal operation is authored.",
          "suggestions 2: Replace the tailored normal-node observations with actual suspicious morphology and needle/pathology findings. Retain measured primary thickness, which tempts the familiar shortcut but does not override nodal evidence. Concrete implementation: Interpret the regional node morphology and whether the sample establishes malignancy or actually sampled the node. Then Use the known-positive pathway rather than performing an occult sentinel-node test. The closest error is: Apply the familiar thickness-based sentinel-node rule despite a proven positive node. Required clinical boundary: Melanoma clinician must confirm sample adequacy, staging scope and the contemporary multidisciplinary pathway; no drug regimen or automatic nodal operation is authored."
        ]
      },
      "selfCheck": {
        "cueAttack": "The primary thickness is retained as a tempting familiar rule, but the decisive variable is the nodal specimen. The two siblings require different actions for positive versus nonrepresentative-negative sampling.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the regional node morphology and whether the sample establishes malignancy or actually sampled the node.",
          "Use the known-positive pathway rather than performing an occult sentinel-node test."
        ],
        "oneBestAnswer": "Malignant melanocytes in the solid regional-node sample already establish nodal involvement.",
        "closestDistractor": "Apply the familiar thickness-based sentinel-node rule despite a proven positive node.",
        "remainingReview": "Melanoma clinician must confirm sample adequacy, staging scope and the contemporary multidisciplinary pathway; no drug regimen or automatic nodal operation is authored."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.melanoma.sentinel-node-staging.v4.r5",
      "conceptId": "concept.melanoma.sentinel-node-staging.v2",
      "stem": "Which staging plan should be arranged next for {patientName}?",
      "answerChoices": [
        {
          "id": "sentinel_node_4",
          "label": "Distant staging and regional multidisciplinary review",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The basin is already tissue-positive; occult sentinel-node staging does not answer the remaining extent/treatment question."
        },
        {
          "id": "choice.qq20261102c.b12.d1",
          "label": "Sentinel-node biopsy followed by regional treatment planning",
          "isCorrect": false,
          "distractorRationale": "Tissue has already demonstrated melanoma in the suspicious regional node."
        },
        {
          "id": "choice.qq20261102c.b12.d2",
          "label": "Therapeutic node dissection followed by distant staging",
          "isCorrect": false,
          "distractorRationale": "Therapeutic nodal surgery may be part of care, but committing before distant staging and multidisciplinary planning can miss a management-changing extent finding."
        }
      ],
      "explanation": "Sentinel-node biopsy evaluates occult regional disease in an appropriate clinically node-negative patient. A proven positive node or an unresolved suspicious, inadequately sampled node belongs to a different diagnostic/staging sequence. Do not apply a primary-thickness rule before establishing which basin category actually exists.",
      "supportingEvidenceClaimIds": [
        "claim.melanoma.sentinel-node-staging",
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-integrated-node-staging",
        "claim.qq20261102c.melanoma-suspicious-node-pathway"
      ],
      "teachingPoint": "Sentinel-node biopsy evaluates occult regional disease in an appropriate clinically node-negative patient. A proven positive node or an unresolved suspicious, inadequately sampled node belongs to a different diagnostic/staging sequence. Do not apply a primary-thickness rule before establishing which basin category actually exists."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.melanoma.sentinel-node-staging",
      "nextConceptId": "concept.melanoma.sentinel-node-staging.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored decision changes from applying a thickness rule in a negative basin to resolving observed nodal evidence before using that rule."
    }
  },
  {
    "id": "revision.qq20261102c.b12-context",
    "auditId": "B12-context",
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r4",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
    "previousChoiceLabels": [
      "Entire-lesion excision with narrow margin into subcutaneous fat",
      "Punch biopsy of the darkest pigmented focus into subcutaneous fat",
      "Punch biopsy of the most elevated focus into subcutaneous fat"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan.",
    "reviewerNotes": "Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_4": "excisional_4",
      "choice.qq20261102c.b12-context.d1": "choice.qq20261102b.b12-context.d1",
      "choice.qq20261102c.b12-context.d2": "choice.qq20261102b.b12-context.d2"
    },
    "choiceServiceOverrides": {
      "excisional_4": "service.skin_excisional_biopsy",
      "choice.qq20261102c.b12-context.d1": null,
      "choice.qq20261102c.b12-context.d2": null
    },
    "choiceTimingOverrides": {
      "excisional_4": {
        "kind": "test",
        "timingProfileId": "timing.test.excisional_biopsy"
      },
      "choice.qq20261102c.b12-context.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b12-context.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "The outside biopsy diagram places a punch in the pale edge of the lesion. That fragment is reported as a nevus. The changing asymmetric center remains, with a different surface pattern from the sampled area. The clinician and pathologist have reviewed the diagram together.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r4",
      "whatChanged": "Replace complete-versus-two-punch recall with a documented sampling/microstaging error and competing definitive-procedure plans.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B12-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited phrase remains in Presentation because its observation is necessary; its old option-aligned exclusion no longer determines this changed task. A benign fragment from a different part of the clinical lesion does not resolve the persisting changing center. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. New inference, rather than a substitute cue: A benign fragment from a different part of the clinical lesion does not resolve the persisting changing center. Attack: Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion.",
          "cues 2: The cited wording is absent from the new visible fields. A benign fragment from a different part of the clinical lesion does not resolve the persisting changing center. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. New inference, rather than a substitute cue: A benign fragment from a different part of the clinical lesion does not resolve the persisting changing center. Attack: Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: A benign fragment from a different part of the clinical lesion does not resolve the persisting changing center. A benign fragment from a different part of the clinical lesion does not resolve the persisting changing center. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. Source limits: Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan. Closest competing error: Accept the benign punch as representative of the entire asymmetric lesion. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. Retain passed later pathology/staging exactly; the gate supplies the completed specimen report.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The initial small-lesion excision rule changes to interpreting an actual partial specimen and sequencing completion against definitive surgery."
        ],
        "suggestions": [
          "suggestions 1: All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. Retain passed later pathology/staging exactly; the gate supplies the completed specimen report. Concrete implementation: Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan. The closest error is: Accept the benign punch as representative of the entire asymmetric lesion. Required clinical boundary: Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
          "suggestions 2: A benign fragment from a different part of the clinical lesion does not resolve the persisting changing center. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. Concrete implementation: Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan. The closest error is: Accept the benign punch as representative of the entire asymmetric lesion. Required clinical boundary: Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced."
        ]
      },
      "selfCheck": {
        "cueAttack": "Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the specimen's site and deep-edge limitations against the actual residual lesion.",
          "Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan."
        ],
        "oneBestAnswer": "A benign fragment from a different part of the clinical lesion does not resolve the persisting changing center.",
        "closestDistractor": "Accept the benign punch as representative of the entire asymmetric lesion.",
        "remainingReview": "Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r5",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
      "stem": "Which next specimen plan should be arranged for {patientName}'s persisting lesion?",
      "answerChoices": [
        {
          "id": "excisional_4",
          "label": "Complete diagnostic excision of the residual pigmented area",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A representative completion specimen resolves the discrepancy before definitive staging/reconstruction; do not mistake a partial result or a minimum for the whole lesion."
        },
        {
          "id": "choice.qq20261102c.b12-context.d1",
          "label": "Repeat punch biopsy of the residual pigmented center",
          "isCorrect": false,
          "distractorRationale": "A central punch is a credible targeted alternative, but another partial sample can leave a heterogeneous residual lesion incompletely assessed when complete diagnostic excision is feasible."
        },
        {
          "id": "choice.qq20261102c.b12-context.d2",
          "label": "Wide excision with sentinel-node biopsy of the regional basin",
          "isCorrect": false,
          "distractorRationale": "An unsampled appearance or a different flat focus does not provide the missing maximum invasive thickness."
        }
      ],
      "explanation": "The diagnosis and microstaging apply to the tissue actually sampled. An unsampled raised focus, a clinicopathologic mismatch or a transected invasive base may require completion. Diagnostic sampling is distinguished from definitive wide excision; do not choose staging or reconstruction from an unrepresentative result.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion"
      ],
      "teachingPoint": "The diagnosis and microstaging apply to the tissue actually sampled. An unsampled raised focus, a clinicopathologic mismatch or a transected invasive base may require completion. Diagnostic sampling is distinguished from definitive wide excision; do not choose staging or reconstruction from an unrepresentative result."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "nextConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
      "previousKeyServiceId": "service.skin_excisional_biopsy",
      "nextKeyServiceId": "service.skin_excisional_biopsy",
      "previousResultGate": {
        "id": "gate.pigmented-skin-lesion.biopsy.4",
        "resultTypeId": "service.skin_excisional_biopsy",
        "pendingLabel": "Skin-lesion pathology pending",
        "resultNarrative": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.5 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
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
      "reason": "The initial small-lesion excision rule changes to interpreting an actual partial specimen and sequencing completion against definitive surgery."
    }
  },
  {
    "id": "revision.qq20261102c.b14-context",
    "auditId": "B14-context",
    "caseId": "case.colon-cancer.sigmoid-referral",
    "nodeId": "node.colon-cancer.sigmoid-referral.1",
    "previousQuestionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v2.r4",
    "questionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v2.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which imaging plan should complete {patientName}'s pretreatment assessment?",
    "previousChoiceLabels": [
      "IV-contrast abdominopelvic CT with the existing chest CT",
      "Abdominal and pelvic ultrasound with the existing chest CT",
      "Whole-body FDG PET-CT with the existing chest CT"
    ],
    "previousCurrentUpdate": "The current outside studies include a chest CT and an abdominal/pelvic CT acquired without intravenous contrast for renal colic. The abdominal report describes urinary calculi and bowel gas; it contains no contrast-enhancement series.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Separate complete staging coverage from an unresolved focal characterization problem. Then Select targeted liver characterization rather than repeat the same general examination or substitute routine PET.",
    "reviewerNotes": "Radiology/colorectal clinician must verify the exact liver protocol and benign classification; no invented attenuation cutoff, growth interval or contrast eligibility threshold.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_cap_2": "ct_cap_2",
      "choice.qq20261102c.b14-context.d1": "choice.qq20261102b.b14-context.d1",
      "choice.qq20261102c.b14-context.d2": "choice.qq20261102b.b14-context.d2"
    },
    "choiceServiceOverrides": {
      "ct_cap_2": "service.liver_mri",
      "choice.qq20261102c.b14-context.d1": "service.imaging.pet-ct",
      "choice.qq20261102c.b14-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_cap_2": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102c.b14-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.pet_ct"
      },
      "choice.qq20261102c.b14-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      }
    },
    "currentUpdate": "The outside contrast CT includes the entire chest, abdomen and pelvis. A solitary 8-mm liver focus is neither uniform water attenuation nor fat and cannot be classified from its single portal-venous acquisition. No other distant lesion is reported. Kidney function is within the laboratory range.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v2.r4",
      "whatChanged": "Replace the twice-stated missing-contrast cue with an adequately covered examination and an indeterminate liver focus requiring a different protocol.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B14-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence. Use a neutral complete task that fits every option category; do not pre-filter treatment or tissue choices by asking only for a pressure study or imaging. New inference, rather than a substitute cue: Coverage is complete; only a noncystic/nonfat single-phase liver focus remains unresolved, and MRI is feasible. Attack: No repeated sentence names an absent contrast series. Every option is a plausible completion strategy, and only the actual unresolved liver finding distinguishes them.",
          "cues 2: The cited wording is absent from the new visible fields. Delete the redundant missing-enhancement statement. Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence. New inference, rather than a substitute cue: Coverage is complete; only a noncystic/nonfat single-phase liver focus remains unresolved, and MRI is feasible. Attack: No repeated sentence names an absent contrast series. Every option is a plausible completion strategy, and only the actual unresolved liver finding distinguishes them."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: Coverage is complete; only a noncystic/nonfat single-phase liver focus remains unresolved, and MRI is feasible. Use a neutral complete task that fits every option category; do not pre-filter treatment or tissue choices by asking only for a pressure study or imaging. Delete the redundant missing-enhancement statement. Source limits: Radiology/colorectal clinician must verify the exact liver protocol and benign classification; no invented attenuation cutoff, growth interval or contrast eligibility threshold.",
          "fairness 2: Decision-critical basis is now explicit: Coverage is complete; only a noncystic/nonfat single-phase liver focus remains unresolved, and MRI is feasible. Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence. Delete the redundant missing-enhancement statement. Single-best claim is limited by: Radiology/colorectal clinician must verify the exact liver protocol and benign classification; no invented attenuation cutoff, growth interval or contrast eligibility threshold.",
          "fairness 3: Decision-critical basis is now explicit: Coverage is complete; only a noncystic/nonfat single-phase liver focus remains unresolved, and MRI is feasible. Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence. Supply actual coverage, a specific unresolved liver finding and the kidney-function observation; omit a generic modality-permission list. Single-best claim is limited by: Radiology/colorectal clinician must verify the exact liver protocol and benign classification; no invented attenuation cutoff, growth interval or contrast eligibility threshold."
        ],
        "suggestions": [
          "suggestions 1: Delete the redundant missing-enhancement statement. Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence. Concrete implementation: Separate complete staging coverage from an unresolved focal characterization problem. Then Select targeted liver characterization rather than repeat the same general examination or substitute routine PET. The closest error is: Request PET-CT as a universal tie-breaker for an indeterminate cancer-staging focus. Required clinical boundary: Radiology/colorectal clinician must verify the exact liver protocol and benign classification; no invented attenuation cutoff, growth interval or contrast eligibility threshold.",
          "suggestions 2: Supply actual coverage, a specific unresolved liver finding and the kidney-function observation; omit a generic modality-permission list. Use a neutral complete task that fits every option category; do not pre-filter treatment or tissue choices by asking only for a pressure study or imaging. Concrete implementation: Separate complete staging coverage from an unresolved focal characterization problem. Then Select targeted liver characterization rather than repeat the same general examination or substitute routine PET. The closest error is: Request PET-CT as a universal tie-breaker for an indeterminate cancer-staging focus. Required clinical boundary: Radiology/colorectal clinician must verify the exact liver protocol and benign classification; no invented attenuation cutoff, growth interval or contrast eligibility threshold."
        ]
      },
      "selfCheck": {
        "cueAttack": "No repeated sentence names an absent contrast series. Every option is a plausible completion strategy, and only the actual unresolved liver finding distinguishes them.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Separate complete staging coverage from an unresolved focal characterization problem.",
          "Select targeted liver characterization rather than repeat the same general examination or substitute routine PET."
        ],
        "oneBestAnswer": "Coverage is complete; only a noncystic/nonfat single-phase liver focus remains unresolved, and MRI is feasible.",
        "closestDistractor": "Request PET-CT as a universal tie-breaker for an indeterminate cancer-staging focus.",
        "remainingReview": "Radiology/colorectal clinician must verify the exact liver protocol and benign classification; no invented attenuation cutoff, growth interval or contrast eligibility threshold."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.preoperative-cross-sectional-staging.v2.r5",
      "conceptId": "concept.colon-cancer.preoperative-cross-sectional-staging.v2",
      "stem": "Which investigation should complete {patientName}'s pretreatment assessment?",
      "answerChoices": [
        {
          "id": "ct_cap_2",
          "label": "Liver MRI with contrast",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Dedicated liver characterization addresses the actual unresolved staging finding without discarding adequate coverage elsewhere."
        },
        {
          "id": "choice.qq20261102c.b14-context.d1",
          "label": "Whole-body FDG PET-CT",
          "isCorrect": false,
          "distractorRationale": "Routine metabolic imaging does not substitute for appropriate anatomic characterization of this indeterminate liver finding."
        },
        {
          "id": "choice.qq20261102c.b14-context.d2",
          "label": "Image-guided liver biopsy",
          "isCorrect": false,
          "distractorRationale": "Tissue can be appropriate in selected indeterminate lesions, but dedicated noninvasive characterization is the preferred next problem-solving step for this small single-phase finding before committing to sampling."
        }
      ],
      "explanation": "A complete staging examination may leave a focal lesion unresolved. Dedicated liver MRI is an appropriate next characterization study for a subcentimeter single-phase CT finding in known extrahepatic cancer. PET sensitivity and the value/feasibility of biopsy differ from targeted anatomic characterization; neither is universally forbidden. Retain the adequate prior staging.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.preoperative-cross-sectional-staging",
        "claim.qq20261102a.colon-systemic-staging",
        "claim.qq20261102b.colon-staging-coverage",
        "claim.qq20261102b.colon-pet-not-routine-substitute",
        "claim.qq20261102c.colon-indeterminate-liver-mri"
      ],
      "teachingPoint": "A complete staging examination may leave a focal lesion unresolved. Dedicated liver MRI is an appropriate next characterization study for a subcentimeter single-phase CT finding in known extrahepatic cancer. PET sensitivity and the value/feasibility of biopsy differ from targeted anatomic characterization; neither is universally forbidden. Retain the adequate prior staging."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.colon-cancer.preoperative-cross-sectional-staging",
      "nextConceptId": "concept.colon-cancer.preoperative-cross-sectional-staging.v2",
      "previousKeyServiceId": "service.ct",
      "nextKeyServiceId": "service.liver_mri",
      "previousResultGate": {
        "id": "gate.colon-cancer.2",
        "resultTypeId": "service.ct",
        "pendingLabel": "External staging CT pending",
        "resultNarrative": "Staging CT shows no distant deposits and no enlarged regional nodes.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ct.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.colon-cancer.2",
        "resultTypeId": "service.liver_mri",
        "pendingLabel": "Liver characterization pending",
        "resultNarrative": "Dedicated liver MRI characterizes the focus as a benign cyst. The correlated final staging review identifies no distant deposits or enlarged regional nodes.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.liver_mri.outsourced"
        ]
      },
      "reason": "Routine first staging-bundle selection changes to completing an already-performed assessment with a specific unresolved finding."
    }
  },
  {
    "id": "revision.qq20261102c.b15-context",
    "auditId": "B15-context",
    "caseId": "case.colon-cancer.transverse-referral",
    "nodeId": "node.colon-cancer.transverse-referral.1",
    "previousQuestionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v3.r4",
    "questionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v3.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which imaging plan should complete {patientName}'s pretreatment assessment?",
    "previousChoiceLabels": [
      "Chest CT with intravenous-contrast abdominal and pelvic CT",
      "Abdominal and pelvic MRI with the current chest radiograph",
      "Whole-body FDG PET-CT with the current chest radiograph"
    ],
    "previousCurrentUpdate": "The current outside assessment includes a chest radiograph and abdominal ultrasound. The reports describe no focal lung opacity, no focal hepatic mass and no ascites.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Read the actual anatomic start/end of the prior CT instead of treating any chest-containing CT as complete staging. Then Preserve adequate abdominopelvic MRI and obtain diagnostic whole-chest assessment of the partly imaged nodule.",
    "reviewerNotes": "Confirm protocol eligibility and radiology characterization. Small is an observed descriptor, not an invented nodule-size or surveillance cutoff; no exact follow-up interval is authored.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_cap_3": "ct_cap_3",
      "choice.qq20261102c.b15-context.d1": "choice.qq20261102b.b15-context.d1",
      "choice.qq20261102c.b15-context.d2": "choice.qq20261102b.b15-context.d2"
    },
    "choiceServiceOverrides": {
      "ct_cap_3": "service.ct",
      "choice.qq20261102c.b15-context.d1": null,
      "choice.qq20261102c.b15-context.d2": "service.imaging.pet-ct"
    },
    "choiceTimingOverrides": {
      "ct_cap_3": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102c.b15-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.radiography"
      },
      "choice.qq20261102c.b15-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pet_ct"
      }
    },
    "currentUpdate": "The outside abdominal and pelvic MRI includes the liver, mesentery and pelvic nodal stations with diagnostic contrast-enhanced sequences; no distant deposit is identified there. A separate CT obtained for cardiac assessment starts below the carina and ends at the diaphragm. Its lower-lung images contain a small solid nodule near the cranial edge. No upper-lung images were acquired.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v3.r4",
      "whatChanged": "Replace normal radiography/ultrasound with usable abdominopelvic MRI and a partly imaged lung finding on a genuinely limited chest acquisition.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B15-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The CT covers only below the carina, whereas the abdominal and pelvic MRI is already diagnostic. Three complete imaging plans differ in whether they adequately assess the chest. The long pathology presentation remains exact because it belongs to the passed resection decision; it is not repeated as a new staging cue. Source limits: Confirm protocol eligibility and radiology characterization. Small is an observed descriptor, not an invented nodule-size or surveillance cutoff; no exact follow-up interval is authored.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Read the actual anatomic start/end of the prior CT instead of treating any chest-containing CT as complete staging. Then Preserve adequate abdominopelvic MRI and obtain diagnostic whole-chest assessment of the partly imaged nodule. Closest competing error: Order metabolic imaging to characterize a small nodule while accepting low-dose localization images as full diagnostic chest staging. The long pathology presentation remains exact because it belongs to the passed resection decision; it is not repeated as a new staging cue. Retain the usable studies and make the unresolved region/finding explicit.",
          "fairness 3: The old difficulty/shortcut is addressed by a consequential decision: Read the actual anatomic start/end of the prior CT instead of treating any chest-containing CT as complete staging. Then Preserve adequate abdominopelvic MRI and obtain diagnostic whole-chest assessment of the partly imaged nodule. Closest competing error: Order metabolic imaging to characterize a small nodule while accepting low-dose localization images as full diagnostic chest staging. The long pathology presentation remains exact because it belongs to the passed resection decision; it is not repeated as a new staging cue. Retain the usable studies and make the unresolved region/finding explicit."
        ],
        "suggestions": [
          "suggestions 1: Retain the usable studies and make the unresolved region/finding explicit. Three complete imaging plans differ in whether they adequately assess the chest. Concrete implementation: Read the actual anatomic start/end of the prior CT instead of treating any chest-containing CT as complete staging. Then Preserve adequate abdominopelvic MRI and obtain diagnostic whole-chest assessment of the partly imaged nodule. The closest error is: Order metabolic imaging to characterize a small nodule while accepting low-dose localization images as full diagnostic chest staging. Required clinical boundary: Confirm protocol eligibility and radiology characterization. Small is an observed descriptor, not an invented nodule-size or surveillance cutoff; no exact follow-up interval is authored.",
          "suggestions 2: Three complete imaging plans differ in whether they adequately assess the chest. The long pathology presentation remains exact because it belongs to the passed resection decision; it is not repeated as a new staging cue. Concrete implementation: Read the actual anatomic start/end of the prior CT instead of treating any chest-containing CT as complete staging. Then Preserve adequate abdominopelvic MRI and obtain diagnostic whole-chest assessment of the partly imaged nodule. The closest error is: Order metabolic imaging to characterize a small nodule while accepting low-dose localization images as full diagnostic chest staging. Required clinical boundary: Confirm protocol eligibility and radiology characterization. Small is an observed descriptor, not an invented nodule-size or surveillance cutoff; no exact follow-up interval is authored."
        ]
      },
      "selfCheck": {
        "cueAttack": "The choices are comparable completion plans that retain the useful MRI. Neither a normal radiograph nor a list of nonstaging tests supplies the usual bundle verbatim.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Read the actual anatomic start/end of the prior CT instead of treating any chest-containing CT as complete staging.",
          "Preserve adequate abdominopelvic MRI and obtain diagnostic whole-chest assessment of the partly imaged nodule."
        ],
        "oneBestAnswer": "The CT covers only below the carina, whereas the abdominal and pelvic MRI is already diagnostic.",
        "closestDistractor": "Order metabolic imaging to characterize a small nodule while accepting low-dose localization images as full diagnostic chest staging.",
        "remainingReview": "Confirm protocol eligibility and radiology characterization. Small is an observed descriptor, not an invented nodule-size or surveillance cutoff; no exact follow-up interval is authored."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.preoperative-cross-sectional-staging.v3.r5",
      "conceptId": "concept.colon-cancer.preoperative-cross-sectional-staging.v2",
      "stem": "Which plan should complete {patientName}'s pretreatment imaging assessment?",
      "answerChoices": [
        {
          "id": "ct_cap_3",
          "label": "Diagnostic whole-chest CT",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The prior examination did not cover the whole chest; preserve the diagnostic abdominal/pelvic work and complete the unresolved thoracic assessment."
        },
        {
          "id": "choice.qq20261102c.b15-context.d1",
          "label": "Chest radiography",
          "isCorrect": false,
          "distractorRationale": "A radiograph does not replace diagnostic thoracic CT for the incompletely assessed lung finding and staging coverage."
        },
        {
          "id": "choice.qq20261102c.b15-context.d2",
          "label": "FDG PET with low-dose localization CT",
          "isCorrect": false,
          "distractorRationale": "Metabolic assessment with localization CT is not the same as the required diagnostic thoracic acquisition, particularly for a small nodule."
        }
      ],
      "explanation": "Use the studies that actually answer each regional question. Diagnostic abdominal/pelvic MRI can be retained, but a partial lower-chest cardiac acquisition does not cover the upper lungs or fully assess the edge nodule. The later staging report is supplied only after completion of the diagnostic chest study.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.preoperative-cross-sectional-staging",
        "claim.qq20261102a.colon-systemic-staging",
        "claim.qq20261102b.colon-staging-coverage",
        "claim.qq20261102b.colon-pet-not-routine-substitute",
        "claim.qq20261102c.colon-adequate-regions-and-chest-ct"
      ],
      "teachingPoint": "Use the studies that actually answer each regional question. Diagnostic abdominal/pelvic MRI can be retained, but a partial lower-chest cardiac acquisition does not cover the upper lungs or fully assess the edge nodule. The later staging report is supplied only after completion of the diagnostic chest study."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.colon-cancer.preoperative-cross-sectional-staging",
      "nextConceptId": "concept.colon-cancer.preoperative-cross-sectional-staging.v2",
      "previousKeyServiceId": "service.ct",
      "nextKeyServiceId": "service.ct",
      "previousResultGate": {
        "id": "gate.colon-cancer.3",
        "resultTypeId": "service.ct",
        "pendingLabel": "External staging CT pending",
        "resultNarrative": "Staging CT shows no distant deposits and no enlarged regional nodes.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ct.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.colon-cancer.3",
        "resultTypeId": "service.ct",
        "pendingLabel": "External staging CT pending",
        "resultNarrative": "Staging CT shows no distant deposits and no enlarged regional nodes.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ct.outsourced"
        ]
      },
      "reason": "Routine first staging-bundle selection changes to completing an already-performed assessment with a specific unresolved finding."
    }
  },
  {
    "id": "revision.qq20261102c.b17-context",
    "auditId": "B17-context",
    "caseId": "case.pigmented-skin-lesion.changing-back-lesion",
    "nodeId": "node.pigmented-skin-lesion.changing-back-lesion.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r4",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
    "previousChoiceLabels": [
      "Entire-lesion excision with narrow margin into subcutaneous fat",
      "Punch biopsy of the darkest pigmented focus into subcutaneous fat",
      "Punch biopsy of the most elevated focus into subcutaneous fat"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan.",
    "reviewerNotes": "Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_1": "excisional_1",
      "choice.qq20261102c.b17-context.d1": "choice.qq20261102b.b17-context.d1",
      "choice.qq20261102c.b17-context.d2": "choice.qq20261102b.b17-context.d2"
    },
    "choiceServiceOverrides": {
      "excisional_1": "service.skin_excisional_biopsy",
      "choice.qq20261102c.b17-context.d1": null,
      "choice.qq20261102c.b17-context.d2": null
    },
    "choiceTimingOverrides": {
      "excisional_1": {
        "kind": "test",
        "timingProfileId": "timing.test.excisional_biopsy"
      },
      "choice.qq20261102c.b17-context.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b17-context.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "An outside punch sampled a flat peripheral area. It shows melanoma confined to the epidermis in that fragment. The raised central focus remains; its surface was not included in the specimen diagram. There has been no definitive excision.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r4",
      "whatChanged": "Replace complete-versus-two-punch recall with a documented sampling/microstaging error and competing definitive-procedure plans.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B17-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited phrase remains in Presentation because its observation is necessary; its old option-aligned exclusion no longer determines this changed task. The in-situ result describes only a flat peripheral fragment, not the unsampled raised focus. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. New inference, rather than a substitute cue: The in-situ result describes only a flat peripheral fragment, not the unsampled raised focus. Attack: Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion.",
          "cues 2: The cited wording is absent from the new visible fields. The in-situ result describes only a flat peripheral fragment, not the unsampled raised focus. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. New inference, rather than a substitute cue: The in-situ result describes only a flat peripheral fragment, not the unsampled raised focus. Attack: Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The in-situ result describes only a flat peripheral fragment, not the unsampled raised focus. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. The in-situ result describes only a flat peripheral fragment, not the unsampled raised focus. Source limits: Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan. Closest competing error: Treat the peripheral in-situ sample as the stage of the whole lesion. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. Retain passed later pathology/staging exactly; the gate supplies the completed specimen report.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The initial small-lesion excision rule changes to interpreting an actual partial specimen and sequencing completion against definitive surgery."
        ],
        "suggestions": [
          "suggestions 1: All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. Retain passed later pathology/staging exactly; the gate supplies the completed specimen report. Concrete implementation: Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan. The closest error is: Treat the peripheral in-situ sample as the stage of the whole lesion. Required clinical boundary: Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
          "suggestions 2: All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. The in-situ result describes only a flat peripheral fragment, not the unsampled raised focus. Concrete implementation: Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan. The closest error is: Treat the peripheral in-situ sample as the stage of the whole lesion. Required clinical boundary: Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced."
        ]
      },
      "selfCheck": {
        "cueAttack": "Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the specimen's site and deep-edge limitations against the actual residual lesion.",
          "Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan."
        ],
        "oneBestAnswer": "The in-situ result describes only a flat peripheral fragment, not the unsampled raised focus.",
        "closestDistractor": "Treat the peripheral in-situ sample as the stage of the whole lesion.",
        "remainingReview": "Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r5",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
      "stem": "Which plan should be used for {patientName}'s remaining pigmented lesion?",
      "answerChoices": [
        {
          "id": "excisional_1",
          "label": "Complete diagnostic excision before definitive excision and staging",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A representative completion specimen resolves the discrepancy before definitive staging/reconstruction; do not mistake a partial result or a minimum for the whole lesion."
        },
        {
          "id": "choice.qq20261102c.b17-context.d1",
          "label": "Wide excision with reconstruction using an in-situ margin plan",
          "isCorrect": false,
          "distractorRationale": "The sample's site or deep edge limits what its result can establish about the residual lesion."
        },
        {
          "id": "choice.qq20261102c.b17-context.d2",
          "label": "Wide excision with sentinel-node biopsy using an invasive-disease plan",
          "isCorrect": false,
          "distractorRationale": "An unsampled appearance or a different flat focus does not provide the missing maximum invasive thickness."
        }
      ],
      "explanation": "The diagnosis and microstaging apply to the tissue actually sampled. An unsampled raised focus, a clinicopathologic mismatch or a transected invasive base may require completion. Diagnostic sampling is distinguished from definitive wide excision; do not choose staging or reconstruction from an unrepresentative result.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion"
      ],
      "teachingPoint": "The diagnosis and microstaging apply to the tissue actually sampled. An unsampled raised focus, a clinicopathologic mismatch or a transected invasive base may require completion. Diagnostic sampling is distinguished from definitive wide excision; do not choose staging or reconstruction from an unrepresentative result."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "nextConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
      "previousKeyServiceId": "service.skin_excisional_biopsy",
      "nextKeyServiceId": "service.skin_excisional_biopsy",
      "previousResultGate": {
        "id": "gate.pigmented-skin-lesion.biopsy.1",
        "resultTypeId": "service.skin_excisional_biopsy",
        "pendingLabel": "Skin-lesion pathology pending",
        "resultNarrative": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.4 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.skin_excisional_biopsy.in_house",
          "route.skin_excisional_biopsy.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.pigmented-skin-lesion.biopsy.1",
        "resultTypeId": "service.skin_excisional_biopsy",
        "pendingLabel": "Skin-lesion pathology pending",
        "resultNarrative": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.4 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.skin_excisional_biopsy.in_house",
          "route.skin_excisional_biopsy.outsourced"
        ]
      },
      "reason": "The initial small-lesion excision rule changes to interpreting an actual partial specimen and sequencing completion against definitive surgery."
    }
  },
  {
    "id": "revision.qq20261102c.b18",
    "auditId": "B18",
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.2",
    "previousQuestionVariantId": "question.melanoma.sentinel-node-staging.v3.r4",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v3.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which regional-node assessment should be discussed with {patientName}?",
    "previousChoiceLabels": [
      "Sentinel lymph node mapping and biopsy",
      "Ultrasound-guided biopsy of an imaged regional node",
      "Ultrasound surveillance of the regional nodes"
    ],
    "previousCurrentUpdate": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.8 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the regional node morphology and whether the sample establishes malignancy or actually sampled the node. Then Resolve a target-mismatched negative sample before assigning a node-negative sentinel-node pathway.",
    "reviewerNotes": "Melanoma clinician must confirm sample adequacy, staging scope and the contemporary multidisciplinary pathway; no drug regimen or automatic nodal operation is authored.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sentinel_node_3": "sentinel_node_3",
      "choice.qq20261102c.b18.d1": "choice.qq20261102b.b18.d1",
      "choice.qq20261102c.b18.d2": "choice.qq20261102b.b18.d2"
    },
    "choiceServiceOverrides": {
      "sentinel_node_3": null,
      "choice.qq20261102c.b18.d1": null,
      "choice.qq20261102c.b18.d2": null
    },
    "choiceTimingOverrides": {
      "sentinel_node_3": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102c.b18.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qq20261102c.b18.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "currentUpdate": "The completed primary specimen measures 1.8 mm in maximum vertical thickness. A regional node is round with eccentric cortex and a replaced central hilum. The aspiration report says no malignant cells, but the submitted material contains blood without lymphoid tissue. The saved needle image does not enter the abnormal cortex.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.melanoma.sentinel-node-staging.v3.r4",
      "whatChanged": "Replace two uncomplicated above-threshold sentinel-node rules with positive versus inadequately sampled suspicious-node decisions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B18",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Replace the tailored normal-node observations with actual suspicious morphology and needle/pathology findings. Remove the rejected basic flag and retain the prior concept for existing learning histories. New inference, rather than a substitute cue: The aspirate is blood-only and the needle missed the abnormal cortex. Attack: The primary thickness is retained as a tempting familiar rule, but the decisive variable is the nodal specimen. The two siblings require different actions for positive versus nonrepresentative-negative sampling."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The aspirate is blood-only and the needle missed the abnormal cortex. Replace the tailored normal-node observations with actual suspicious morphology and needle/pathology findings. Retain measured primary thickness, which tempts the familiar shortcut but does not override nodal evidence. Source limits: Melanoma clinician must confirm sample adequacy, staging scope and the contemporary multidisciplinary pathway; no drug regimen or automatic nodal operation is authored.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Interpret the regional node morphology and whether the sample establishes malignancy or actually sampled the node. Then Resolve a target-mismatched negative sample before assigning a node-negative sentinel-node pathway. Closest competing error: Treat the word negative as sufficient and apply the thickness-based sentinel-node rule. Retain measured primary thickness, which tempts the familiar shortcut but does not override nodal evidence. Replace the tailored normal-node observations with actual suspicious morphology and needle/pathology findings.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The scored decision changes from applying a thickness rule in a negative basin to resolving observed nodal evidence before using that rule."
        ],
        "suggestions": [
          "suggestions 1: Replace the tailored normal-node observations with actual suspicious morphology and needle/pathology findings. Retain measured primary thickness, which tempts the familiar shortcut but does not override nodal evidence. Concrete implementation: Interpret the regional node morphology and whether the sample establishes malignancy or actually sampled the node. Then Resolve a target-mismatched negative sample before assigning a node-negative sentinel-node pathway. The closest error is: Treat the word negative as sufficient and apply the thickness-based sentinel-node rule. Required clinical boundary: Melanoma clinician must confirm sample adequacy, staging scope and the contemporary multidisciplinary pathway; no drug regimen or automatic nodal operation is authored.",
          "suggestions 2: Replace the tailored normal-node observations with actual suspicious morphology and needle/pathology findings. Retain measured primary thickness, which tempts the familiar shortcut but does not override nodal evidence. Concrete implementation: Interpret the regional node morphology and whether the sample establishes malignancy or actually sampled the node. Then Resolve a target-mismatched negative sample before assigning a node-negative sentinel-node pathway. The closest error is: Treat the word negative as sufficient and apply the thickness-based sentinel-node rule. Required clinical boundary: Melanoma clinician must confirm sample adequacy, staging scope and the contemporary multidisciplinary pathway; no drug regimen or automatic nodal operation is authored."
        ]
      },
      "selfCheck": {
        "cueAttack": "The primary thickness is retained as a tempting familiar rule, but the decisive variable is the nodal specimen. The two siblings require different actions for positive versus nonrepresentative-negative sampling.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the regional node morphology and whether the sample establishes malignancy or actually sampled the node.",
          "Resolve a target-mismatched negative sample before assigning a node-negative sentinel-node pathway."
        ],
        "oneBestAnswer": "The aspirate is blood-only and the needle missed the abnormal cortex.",
        "closestDistractor": "Treat the word negative as sufficient and apply the thickness-based sentinel-node rule.",
        "remainingReview": "Melanoma clinician must confirm sample adequacy, staging scope and the contemporary multidisciplinary pathway; no drug regimen or automatic nodal operation is authored."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.melanoma.sentinel-node-staging.v3.r5",
      "conceptId": "concept.melanoma.sentinel-node-staging.v2",
      "stem": "Which staging plan should be arranged next for {patientName}?",
      "answerChoices": [
        {
          "id": "sentinel_node_3",
          "label": "Targeted core biopsy of the regional node",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The negative aspiration is not representative of the suspicious node; settle that discrepancy before an occult-node pathway."
        },
        {
          "id": "choice.qq20261102c.b18.d1",
          "label": "Sentinel-node biopsy of the regional basin",
          "isCorrect": false,
          "distractorRationale": "A blood-only miss does not establish a clinically negative basin."
        },
        {
          "id": "choice.qq20261102c.b18.d2",
          "label": "Serial ultrasound surveillance of the regional basin",
          "isCorrect": false,
          "distractorRationale": "The unresolved suspicious morphology cannot be dismissed by the nonrepresentative aspirate."
        }
      ],
      "explanation": "Sentinel-node biopsy evaluates occult regional disease in an appropriate clinically node-negative patient. A proven positive node or an unresolved suspicious, inadequately sampled node belongs to a different diagnostic/staging sequence. Do not apply a primary-thickness rule before establishing which basin category actually exists.",
      "supportingEvidenceClaimIds": [
        "claim.melanoma.sentinel-node-staging",
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-integrated-node-staging",
        "claim.qq20261102c.melanoma-suspicious-node-pathway"
      ],
      "teachingPoint": "Sentinel-node biopsy evaluates occult regional disease in an appropriate clinically node-negative patient. A proven positive node or an unresolved suspicious, inadequately sampled node belongs to a different diagnostic/staging sequence. Do not apply a primary-thickness rule before establishing which basin category actually exists."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.melanoma.sentinel-node-staging",
      "nextConceptId": "concept.melanoma.sentinel-node-staging.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored decision changes from applying a thickness rule in a negative basin to resolving observed nodal evidence before using that rule."
    }
  },
  {
    "id": "revision.qq20261102c.b18-context",
    "auditId": "B18-context",
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r4",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
    "previousChoiceLabels": [
      "Entire-lesion excision with narrow margin into subcutaneous fat",
      "Punch biopsy of the darkest pigmented focus into subcutaneous fat",
      "Punch biopsy of the most elevated focus into subcutaneous fat"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan.",
    "reviewerNotes": "Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_3": "excisional_3",
      "choice.qq20261102c.b18-context.d1": "choice.qq20261102b.b18-context.d1",
      "choice.qq20261102c.b18-context.d2": "choice.qq20261102b.b18-context.d2"
    },
    "choiceServiceOverrides": {
      "excisional_3": "service.skin_excisional_biopsy",
      "choice.qq20261102c.b18-context.d1": null,
      "choice.qq20261102c.b18-context.d2": null
    },
    "choiceTimingOverrides": {
      "excisional_3": {
        "kind": "test",
        "timingProfileId": "timing.test.excisional_biopsy"
      },
      "choice.qq20261102c.b18-context.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b18-context.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "The outside shave contains invasive atypical melanocytes at its deep cut surface. The pathologist reports at least 0.6 mm of invasion, with deeper tumor beyond the section's edge not measurable. A firm residual focus is present.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r4",
      "whatChanged": "Replace complete-versus-two-punch recall with a documented sampling/microstaging error and competing definitive-procedure plans.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B18-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited phrase remains in Presentation because its observation is necessary; its old option-aligned exclusion no longer determines this changed task. A transected invasive specimen supplies a minimum, while a raised residual focus remains available for completion. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. New inference, rather than a substitute cue: A transected invasive specimen supplies a minimum, while a raised residual focus remains available for completion. Attack: Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion.",
          "cues 2: The cited wording is absent from the new visible fields. A transected invasive specimen supplies a minimum, while a raised residual focus remains available for completion. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. New inference, rather than a substitute cue: A transected invasive specimen supplies a minimum, while a raised residual focus remains available for completion. Attack: Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: A transected invasive specimen supplies a minimum, while a raised residual focus remains available for completion. A transected invasive specimen supplies a minimum, while a raised residual focus remains available for completion. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. Source limits: Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan. Closest competing error: Treat a minimum thickness as the maximum depth when planning an irreversible procedure. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. A transected invasive specimen supplies a minimum, while a raised residual focus remains available for completion.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The initial small-lesion excision rule changes to interpreting an actual partial specimen and sequencing completion against definitive surgery."
        ],
        "suggestions": [
          "suggestions 1: A transected invasive specimen supplies a minimum, while a raised residual focus remains available for completion. All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. Concrete implementation: Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan. The closest error is: Treat a minimum thickness as the maximum depth when planning an irreversible procedure. Required clinical boundary: Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced.",
          "suggestions 2: All options now concern clinically meaningful completion/staging choices, rather than darkest versus raised punch distractors. A transected invasive specimen supplies a minimum, while a raised residual focus remains available for completion. Concrete implementation: Interpret the specimen's site and deep-edge limitations against the actual residual lesion. Then Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan. The closest error is: Treat a minimum thickness as the maximum depth when planning an irreversible procedure. Required clinical boundary: Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced."
        ]
      },
      "selfCheck": {
        "cueAttack": "Every plan addresses the residual lesion and subsequent procedure. Whole-lesion closure feasibility remains in the frozen passed companion's shared presentation where applicable, but does not distinguish diagnostic completion from immediate wide excision; both can remove the whole lesion.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the specimen's site and deep-edge limitations against the actual residual lesion.",
          "Obtain representative completion before committing to a definitive excision, reconstruction or nodal plan."
        ],
        "oneBestAnswer": "A transected invasive specimen supplies a minimum, while a raised residual focus remains available for completion.",
        "closestDistractor": "Treat a minimum thickness as the maximum depth when planning an irreversible procedure.",
        "remainingReview": "Dermatology/clinician review must confirm completion technique and timing; no unverified margin or thickness threshold is introduced."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r5",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
      "stem": "Which plan should be used for {patientName}'s remaining pigmented lesion?",
      "answerChoices": [
        {
          "id": "excisional_3",
          "label": "Complete diagnostic excision of the residual lesion",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A representative completion specimen resolves the discrepancy before definitive staging/reconstruction; do not mistake a partial result or a minimum for the whole lesion."
        },
        {
          "id": "choice.qq20261102c.b18-context.d1",
          "label": "Wide excision and nodal planning using the minimum depth",
          "isCorrect": false,
          "distractorRationale": "The sample's site or deep edge limits what its result can establish about the residual lesion."
        },
        {
          "id": "choice.qq20261102c.b18-context.d2",
          "label": "Punch biopsy of the adjacent flat pigmented area",
          "isCorrect": false,
          "distractorRationale": "An unsampled appearance or a different flat focus does not provide the missing maximum invasive thickness."
        }
      ],
      "explanation": "The diagnosis and microstaging apply to the tissue actually sampled. An unsampled raised focus, a clinicopathologic mismatch or a transected invasive base may require completion. Diagnostic sampling is distinguished from definitive wide excision; do not choose staging or reconstruction from an unrepresentative result.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion"
      ],
      "teachingPoint": "The diagnosis and microstaging apply to the tissue actually sampled. An unsampled raised focus, a clinicopathologic mismatch or a transected invasive base may require completion. Diagnostic sampling is distinguished from definitive wide excision; do not choose staging or reconstruction from an unrepresentative result."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "nextConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
      "previousKeyServiceId": "service.skin_excisional_biopsy",
      "nextKeyServiceId": "service.skin_excisional_biopsy",
      "previousResultGate": {
        "id": "gate.pigmented-skin-lesion.biopsy.3",
        "resultTypeId": "service.skin_excisional_biopsy",
        "pendingLabel": "Skin-lesion pathology pending",
        "resultNarrative": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.8 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.skin_excisional_biopsy.in_house",
          "route.skin_excisional_biopsy.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.pigmented-skin-lesion.biopsy.3",
        "resultTypeId": "service.skin_excisional_biopsy",
        "pendingLabel": "Skin-lesion pathology pending",
        "resultNarrative": "The completed primary specimen measures 1.8 mm in maximum vertical thickness. A regional node is round with eccentric cortex and a replaced central hilum. The aspiration report says no malignant cells, but the submitted material contains blood without lymphoid tissue. The saved needle image does not enter the abnormal cortex.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.skin_excisional_biopsy.in_house",
          "route.skin_excisional_biopsy.outsourced"
        ]
      },
      "reason": "The initial small-lesion excision rule changes to interpreting an actual partial specimen and sequencing completion against definitive surgery."
    }
  },
  {
    "id": "revision.qq20261102c.b19-context",
    "auditId": "B19-context",
    "caseId": "case.soft-tissue-mass.deep-thigh",
    "nodeId": "node.soft-tissue-mass.deep-thigh.1",
    "previousQuestionVariantId": "question.soft-tissue-mass.extremity-mri.v1.r4",
    "questionVariantId": "question.soft-tissue-mass.extremity-mri.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which local characterization study should precede tissue sampling of {patientName}'s mass?",
    "previousChoiceLabels": [
      "Extremity MRI with precontrast and postcontrast imaging",
      "Extremity CT with precontrast and postcontrast imaging",
      "Extremity FDG PET-CT with metabolic and anatomic imaging"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Recognize that contrast does not repair a field that truncates the lesion. Then Obtain local MRI of the entire lesion and compartment relationships before a tract is chosen.",
    "reviewerNotes": "MSK radiologist must confirm exact acquisition requirements, contrast eligibility and tract implications; no new signal threshold, dose, tumor diagnosis or protocol timing is claimed.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "extremity_mri_1": "extremity_mri_1",
      "choice.qq20261102c.b19-context.d1": "choice.qq20261102b.b19-context.d1",
      "choice.qq20261102c.b19-context.d2": "choice.qq20261102b.b19-context.d2"
    },
    "choiceServiceOverrides": {
      "extremity_mri_1": "service.extremity_mri",
      "choice.qq20261102c.b19-context.d1": "service.extremity_mri",
      "choice.qq20261102c.b19-context.d2": "service.imaging.pet-ct"
    },
    "choiceTimingOverrides": {
      "extremity_mri_1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102c.b19-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102c.b19-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pet_ct"
      }
    },
    "currentUpdate": "The outside MRI was requested as a knee examination. Its uppermost image cuts through the distal edge of the palpable thigh mass; the proximal palpable end lies above the acquired field. The included images show enhancing tissue, but no transverse section contains the entire mass with the adjacent neurovascular bundle.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.soft-tissue-mass.extremity-mri.v1.r4",
      "whatChanged": "Use cropped-field versus missing-enhancement problems rather than two generic MRI-first questions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B19-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The lesion and its proximal relationships lie outside the acquired field. Show the actual field truncation instead of calling an MRI inadequate. Keep the passed later method/tract question and its returned result exactly. Source limits: MSK radiologist must confirm exact acquisition requirements, contrast eligibility and tract implications; no new signal threshold, dose, tumor diagnosis or protocol timing is claimed.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Recognize that contrast does not repair a field that truncates the lesion. Then Obtain local MRI of the entire lesion and compartment relationships before a tract is chosen. Closest competing error: Repeat the impressive-looking contrast study while retaining the knee field. Show the actual field truncation instead of calling an MRI inadequate. Keep the passed later method/tract question and its returned result exactly.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The initial modality-selection rule changes to deciding which part of an existing local MRI must be completed."
        ],
        "suggestions": [
          "suggestions 1: Show the actual field truncation instead of calling an MRI inadequate. Keep the passed later method/tract question and its returned result exactly. Concrete implementation: Recognize that contrast does not repair a field that truncates the lesion. Then Obtain local MRI of the entire lesion and compartment relationships before a tract is chosen. The closest error is: Repeat the impressive-looking contrast study while retaining the knee field. Required clinical boundary: MSK radiologist must confirm exact acquisition requirements, contrast eligibility and tract implications; no new signal threshold, dose, tumor diagnosis or protocol timing is claimed.",
          "suggestions 2: Show the actual field truncation instead of calling an MRI inadequate. Keep the passed later method/tract question and its returned result exactly. Concrete implementation: Recognize that contrast does not repair a field that truncates the lesion. Then Obtain local MRI of the entire lesion and compartment relationships before a tract is chosen. The closest error is: Repeat the impressive-looking contrast study while retaining the knee field. Required clinical boundary: MSK radiologist must confirm exact acquisition requirements, contrast eligibility and tract implications; no new signal threshold, dose, tumor diagnosis or protocol timing is claimed."
        ]
      },
      "selfCheck": {
        "cueAttack": "Each sibling contains a real MRI and a different missing question. The key is not uniquely the MRI modality; a competing MRI protocol is credible but does not repair the actual limitation.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that contrast does not repair a field that truncates the lesion.",
          "Obtain local MRI of the entire lesion and compartment relationships before a tract is chosen."
        ],
        "oneBestAnswer": "The lesion and its proximal relationships lie outside the acquired field.",
        "closestDistractor": "Repeat the impressive-looking contrast study while retaining the knee field.",
        "remainingReview": "MSK radiologist must confirm exact acquisition requirements, contrast eligibility and tract implications; no new signal threshold, dose, tumor diagnosis or protocol timing is claimed."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.extremity-mri.v1.r5",
      "conceptId": "concept.soft-tissue-mass.extremity-mri.v2",
      "stem": "Which imaging plan should be arranged for {patientName}'s mass?",
      "answerChoices": [
        {
          "id": "extremity_mri_1",
          "label": "Contrast-enhanced whole-thigh MRI",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The acquired knee field does not show the extent/compartment relationships needed for planning a biopsy tract."
        },
        {
          "id": "choice.qq20261102c.b19-context.d1",
          "label": "Contrast-enhanced MRI of the knee",
          "isCorrect": false,
          "distractorRationale": "More enhancement data in the same cropped field cannot establish the missing proximal extent."
        },
        {
          "id": "choice.qq20261102c.b19-context.d2",
          "label": "FDG PET-CT of the thigh",
          "isCorrect": false,
          "distractorRationale": "Metabolic intensity does not replace complete local anatomic planning."
        }
      ],
      "explanation": "Local MRI needs to answer extent and compartment questions, not merely contain a piece of enhancing tumor. Correct the coverage before choosing a tract.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.mri",
        "claim.qq20261102a.sarcoma-local-imaging",
        "claim.qq20261102c.sarcoma-mri-coverage-and-target"
      ],
      "teachingPoint": "Local MRI needs to answer extent and compartment questions, not merely contain a piece of enhancing tumor. Correct the coverage before choosing a tract."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.soft-tissue-mass.extremity-mri",
      "nextConceptId": "concept.soft-tissue-mass.extremity-mri.v2",
      "previousKeyServiceId": "service.extremity_mri",
      "nextKeyServiceId": "service.extremity_mri",
      "previousResultGate": {
        "id": "gate.soft-tissue-mass.mri.1",
        "resultTypeId": "service.extremity_mri",
        "pendingLabel": "Extremity MRI pending",
        "resultNarrative": "MRI places the mass within rectus femoris. Solid regions A and B both enhance; B enhances more intensely. Path A enters from the anterior skin through rectus femoris. The shorter path B enters from the medial skin, crosses adductor muscle and then reaches region B. Both regions can be sampled percutaneously.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.extremity_mri.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.soft-tissue-mass.mri.1",
        "resultTypeId": "service.extremity_mri",
        "pendingLabel": "Extremity MRI pending",
        "resultNarrative": "MRI places the mass within rectus femoris. Solid regions A and B both enhance; B enhances more intensely. Path A enters from the anterior skin through rectus femoris. The shorter path B enters from the medial skin, crosses adductor muscle and then reaches region B. Both regions can be sampled percutaneously.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.extremity_mri.outsourced"
        ]
      },
      "reason": "The initial modality-selection rule changes to deciding which part of an existing local MRI must be completed."
    }
  },
  {
    "id": "revision.qq20261102c.b20-context",
    "auditId": "B20-context",
    "caseId": "case.soft-tissue-mass.upper-arm",
    "nodeId": "node.soft-tissue-mass.upper-arm.1",
    "previousQuestionVariantId": "question.soft-tissue-mass.extremity-mri.v2.r4",
    "questionVariantId": "question.soft-tissue-mass.extremity-mri.v2.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which local characterization study should precede tissue sampling of {patientName}'s mass?",
    "previousChoiceLabels": [
      "Extremity MRI with precontrast and postcontrast imaging",
      "Extremity CT with precontrast and postcontrast imaging",
      "Extremity FDG PET-CT with metabolic and anatomic imaging"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Recognize that adequate coverage does not establish which bright internal region is viable. Then Complete enhancement assessment before choosing a viable region and tract.",
    "reviewerNotes": "MSK radiologist must confirm exact acquisition requirements, contrast eligibility and tract implications; no new signal threshold, dose, tumor diagnosis or protocol timing is claimed.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "extremity_mri_2": "extremity_mri_2",
      "choice.qq20261102c.b20-context.d1": "choice.qq20261102b.b20-context.d1",
      "choice.qq20261102c.b20-context.d2": "choice.qq20261102b.b20-context.d2"
    },
    "choiceServiceOverrides": {
      "extremity_mri_2": "service.extremity_mri",
      "choice.qq20261102c.b20-context.d1": "service.extremity_mri",
      "choice.qq20261102c.b20-context.d2": "service.imaging.pet-ct"
    },
    "choiceTimingOverrides": {
      "extremity_mri_2": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102c.b20-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102c.b20-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pet_ct"
      }
    },
    "currentUpdate": "The outside upper-arm MRI covers the full palpable mass and adjacent neurovascular structures. The saved series are T1 and fluid-sensitive acquisitions; no post-injection series appears in the export. Several internal regions are bright on fluid-sensitive images.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.soft-tissue-mass.extremity-mri.v2.r4",
      "whatChanged": "Use cropped-field versus missing-enhancement problems rather than two generic MRI-first questions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B20-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The full lesion is mapped but there is no enhancement acquisition to separate internal components. Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence. Show actual acquired series instead of announcing a missing safety study. Source limits: MSK radiologist must confirm exact acquisition requirements, contrast eligibility and tract implications; no new signal threshold, dose, tumor diagnosis or protocol timing is claimed.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Recognize that adequate coverage does not establish which bright internal region is viable. Then Complete enhancement assessment before choosing a viable region and tract. Closest competing error: Select the brightest fluid-sensitive region as viable tissue without enhancement assessment. Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence. Show actual acquired series instead of announcing a missing safety study.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: The initial modality-selection rule changes to deciding which part of an existing local MRI must be completed."
        ],
        "suggestions": [
          "suggestions 1: Show actual acquired series instead of announcing a missing safety study. Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence. Concrete implementation: Recognize that adequate coverage does not establish which bright internal region is viable. Then Complete enhancement assessment before choosing a viable region and tract. The closest error is: Select the brightest fluid-sensitive region as viable tissue without enhancement assessment. Required clinical boundary: MSK radiologist must confirm exact acquisition requirements, contrast eligibility and tract implications; no new signal threshold, dose, tumor diagnosis or protocol timing is claimed.",
          "suggestions 2: Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence. Show actual acquired series instead of announcing a missing safety study. Concrete implementation: Recognize that adequate coverage does not establish which bright internal region is viable. Then Complete enhancement assessment before choosing a viable region and tract. The closest error is: Select the brightest fluid-sensitive region as viable tissue without enhancement assessment. Required clinical boundary: MSK radiologist must confirm exact acquisition requirements, contrast eligibility and tract implications; no new signal threshold, dose, tumor diagnosis or protocol timing is claimed."
        ]
      },
      "selfCheck": {
        "cueAttack": "Each sibling contains a real MRI and a different missing question. The key is not uniquely the MRI modality; a competing MRI protocol is credible but does not repair the actual limitation.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that adequate coverage does not establish which bright internal region is viable.",
          "Complete enhancement assessment before choosing a viable region and tract."
        ],
        "oneBestAnswer": "The full lesion is mapped but there is no enhancement acquisition to separate internal components.",
        "closestDistractor": "Select the brightest fluid-sensitive region as viable tissue without enhancement assessment.",
        "remainingReview": "MSK radiologist must confirm exact acquisition requirements, contrast eligibility and tract implications; no new signal threshold, dose, tumor diagnosis or protocol timing is claimed."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.extremity-mri.v2.r5",
      "conceptId": "concept.soft-tissue-mass.extremity-mri.v2",
      "stem": "Which imaging plan should be arranged for {patientName}'s mass?",
      "answerChoices": [
        {
          "id": "extremity_mri_2",
          "label": "Upper-arm MRI with contrast",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Enhancement information can distinguish viable sampling regions when fluid-sensitive brightness alone does not establish viability."
        },
        {
          "id": "choice.qq20261102c.b20-context.d1",
          "label": "Noncontrast MRI of the entire arm",
          "isCorrect": false,
          "distractorRationale": "Coverage is already complete; a larger field alone does not provide the missing enhancement information."
        },
        {
          "id": "choice.qq20261102c.b20-context.d2",
          "label": "Upper-arm FDG PET-CT",
          "isCorrect": false,
          "distractorRationale": "An avid target does not substitute for local enhancement and tract planning in this accessible lesion."
        }
      ],
      "explanation": "Fluid-sensitive signal is not a viability label. Complete the enhancement assessment of the already-mapped mass before choosing a target.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.mri",
        "claim.qq20261102a.sarcoma-local-imaging",
        "claim.qq20261102c.sarcoma-mri-coverage-and-target",
        "claim.qq20261102c.sarcoma-enhancement-biopsy-target"
      ],
      "teachingPoint": "Fluid-sensitive signal is not a viability label. Complete the enhancement assessment of the already-mapped mass before choosing a target."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.soft-tissue-mass.extremity-mri",
      "nextConceptId": "concept.soft-tissue-mass.extremity-mri.v2",
      "previousKeyServiceId": "service.extremity_mri",
      "nextKeyServiceId": "service.extremity_mri",
      "previousResultGate": {
        "id": "gate.soft-tissue-mass.mri.2",
        "resultTypeId": "service.extremity_mri",
        "pendingLabel": "Extremity MRI pending",
        "resultNarrative": "MRI places the mass within triceps. Solid regions A and B both enhance; A enhances more intensely. Path B enters from the posterior skin through triceps. The shorter path A enters from anterior skin, crosses biceps and then reaches region A. Both regions can be sampled percutaneously.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.extremity_mri.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.soft-tissue-mass.mri.2",
        "resultTypeId": "service.extremity_mri",
        "pendingLabel": "Extremity MRI pending",
        "resultNarrative": "MRI places the mass within triceps. Solid regions A and B both enhance; A enhances more intensely. Path B enters from the posterior skin through triceps. The shorter path A enters from anterior skin, crosses biceps and then reaches region A. Both regions can be sampled percutaneously.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.extremity_mri.outsourced"
        ]
      },
      "reason": "The initial modality-selection rule changes to deciding which part of an existing local MRI must be completed."
    }
  },
  {
    "id": "revision.qq20261102c.b21-context",
    "auditId": "B21-context",
    "caseId": "case.l2.colonic-lipoma.direct.typical-a",
    "nodeId": "node.colonic-lipoma.recognition.patient-to-diagnosis.v1",
    "previousQuestionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r4",
    "questionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which diagnosis fits {patientName}'s endoscopic and wall-layer observations?",
    "previousChoiceLabels": [
      "Colonic lipoma",
      "Colonic lymphangioma",
      "Gastrointestinal stromal tumor"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Locate the sampled tissue relative to the EUS-defined lesion, instead of treating negative or bite-on-bite as proof that the lesion was sampled. Then Decide whether the characteristic lipoma appearance needs another specimen, rather than applying a tissue-required rule to every subepithelial lesion.",
    "reviewerNotes": "The characteristic-image conclusion requires clinician verification. If imaging is genuinely discordant or not diagnostic, further EUS/tissue evaluation can be indicated; that uncertainty must not be hidden.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "colonic_lipoma": "colonic_lipoma",
      "choice.qq20261102c.b21-context.d1": "choice.qq20261102b.b21-context.d1",
      "choice.qq20261102c.b21-context.d2": "choice.qq20261102b.b21-context.d2"
    },
    "choiceServiceOverrides": {
      "colonic_lipoma": null,
      "choice.qq20261102c.b21-context.d1": null,
      "choice.qq20261102c.b21-context.d2": null
    },
    "choiceTimingOverrides": {
      "colonic_lipoma": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b21-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.upper_endoscopy"
      },
      "choice.qq20261102c.b21-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.upper_endoscopy"
      }
    },
    "currentUpdate": "A previous forceps specimen was reported as normal colonic mucosa. Its slide contains epithelium, crypts and lamina propria, ending above the submucosal plane. The current endoscopic and wall-layer observations are documented above.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r4",
      "whatChanged": "Replace repeated label recognition with normal-mucosa versus submucosal-imaging interpretation and credible over-sampling/exclusion errors.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B21-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited phrase remains in Presentation because its observation is necessary; its old option-aligned exclusion no longer determines this changed task. Use an observed specimen-layer discrepancy rather than manufacturing contradictory current EUS findings. Retain all exact shared clinical findings because the later management item passed. New inference, rather than a substitute cue: The current deformable third-layer uniformly bright lesion is characteristic, and the submitted specimen contains only the overlying mucosa. Attack: The task now applies specimen-layer interpretation against a plausible instinct to obtain tissue proof. It does not introduce a contradictory fourth-layer lesion or a second unresolved mass that would invalidate the passed no-follow-up plan."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The current deformable third-layer uniformly bright lesion is characteristic, and the submitted specimen contains only the overlying mucosa. Use an observed specimen-layer discrepancy rather than manufacturing contradictory current EUS findings. Retain all exact shared clinical findings because the later management item passed. Source limits: The characteristic-image conclusion requires clinician verification. If imaging is genuinely discordant or not diagnostic, further EUS/tissue evaluation can be indicated; that uncertainty must not be hidden.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Locate the sampled tissue relative to the EUS-defined lesion, instead of treating negative or bite-on-bite as proof that the lesion was sampled. Then Decide whether the characteristic lipoma appearance needs another specimen, rather than applying a tissue-required rule to every subepithelial lesion. Closest competing error: Require EUS-guided core tissue for every subepithelial lesion after a normal mucosal biopsy. Retain all exact shared clinical findings because the later management item passed. Use an observed specimen-layer discrepancy rather than manufacturing contradictory current EUS findings.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: Simple lesion naming changes to a patient-specific specimen/imaging and further-investigation decision."
        ],
        "suggestions": [
          "suggestions 1: Use an observed specimen-layer discrepancy rather than manufacturing contradictory current EUS findings. Retain all exact shared clinical findings because the later management item passed. Concrete implementation: Locate the sampled tissue relative to the EUS-defined lesion, instead of treating negative or bite-on-bite as proof that the lesion was sampled. Then Decide whether the characteristic lipoma appearance needs another specimen, rather than applying a tissue-required rule to every subepithelial lesion. The closest error is: Require EUS-guided core tissue for every subepithelial lesion after a normal mucosal biopsy. Required clinical boundary: The characteristic-image conclusion requires clinician verification. If imaging is genuinely discordant or not diagnostic, further EUS/tissue evaluation can be indicated; that uncertainty must not be hidden.",
          "suggestions 2: Retain all exact shared clinical findings because the later management item passed. Use an observed specimen-layer discrepancy rather than manufacturing contradictory current EUS findings. Concrete implementation: Locate the sampled tissue relative to the EUS-defined lesion, instead of treating negative or bite-on-bite as proof that the lesion was sampled. Then Decide whether the characteristic lipoma appearance needs another specimen, rather than applying a tissue-required rule to every subepithelial lesion. The closest error is: Require EUS-guided core tissue for every subepithelial lesion after a normal mucosal biopsy. Required clinical boundary: The characteristic-image conclusion requires clinician verification. If imaging is genuinely discordant or not diagnostic, further EUS/tissue evaluation can be indicated; that uncertainty must not be hidden."
        ]
      },
      "selfCheck": {
        "cueAttack": "The task now applies specimen-layer interpretation against a plausible instinct to obtain tissue proof. It does not introduce a contradictory fourth-layer lesion or a second unresolved mass that would invalidate the passed no-follow-up plan.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Locate the sampled tissue relative to the EUS-defined lesion, instead of treating negative or bite-on-bite as proof that the lesion was sampled.",
          "Decide whether the characteristic lipoma appearance needs another specimen, rather than applying a tissue-required rule to every subepithelial lesion."
        ],
        "oneBestAnswer": "The current deformable third-layer uniformly bright lesion is characteristic, and the submitted specimen contains only the overlying mucosa.",
        "closestDistractor": "Require EUS-guided core tissue for every subepithelial lesion after a normal mucosal biopsy.",
        "remainingReview": "The characteristic-image conclusion requires clinician verification. If imaging is genuinely discordant or not diagnostic, further EUS/tissue evaluation can be indicated; that uncertainty must not be hidden."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r5",
      "conceptId": "concept.colonic-lipoma.endoscopic-recognition.v2",
      "stem": "Which tissue-assessment plan should be recorded for {patientName}'s lesion?",
      "answerChoices": [
        {
          "id": "colonic_lipoma",
          "label": "No additional lesion tissue sampling",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The normal surface biopsy is compatible with a characteristic submucosal lipoma; it does not require invasive confirmation."
        },
        {
          "id": "choice.qq20261102c.b21-context.d1",
          "label": "EUS-guided core biopsy of the lesion",
          "isCorrect": false,
          "distractorRationale": "Core tissue is appropriate for selected indeterminate or higher-risk subepithelial lesions, but is not needed solely to reconfirm the characteristic lipoma pattern shown here."
        },
        {
          "id": "choice.qq20261102c.b21-context.d2",
          "label": "Repeat deep-forceps biopsy of the lesion",
          "isCorrect": false,
          "distractorRationale": "A deeper forceps attempt might obtain submucosa, but another tissue procedure is unnecessary when the characteristic imaging and examination already establish an asymptomatic lipoma."
        }
      ],
      "explanation": "Interpret a negative specimen by the layer it contains. Normal mucosa does not erase a submucosal lesion. For a characteristic lipoma, normal mucosal biopsies do not mandate another lesion specimen.",
      "supportingEvidenceClaimIds": [
        "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
        "claim.qq20261102a.subepithelial-integrated-pattern",
        "claim.qq20261102c.classic-lipoma-normal-mucosal-sample"
      ],
      "teachingPoint": "Interpret a negative specimen by the layer it contains. Normal mucosa does not erase a submucosal lesion. For a characteristic lipoma, normal mucosal biopsies do not mandate another lesion specimen."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.colonic-lipoma.endoscopic-recognition",
      "nextConceptId": "concept.colonic-lipoma.endoscopic-recognition.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Simple lesion naming changes to a patient-specific specimen/imaging and further-investigation decision."
    }
  },
  {
    "id": "revision.qq20261102c.b22-context",
    "auditId": "B22-context",
    "caseId": "case.l2.colonic-lipoma.direct.typical-b",
    "nodeId": "node.colonic-lipoma.recognition.patient-to-diagnosis.v2",
    "previousQuestionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r4",
    "questionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which diagnosis fits {patientName}'s endoscopic and wall-layer observations?",
    "previousChoiceLabels": [
      "Colonic lipoma",
      "Colonic lymphangioma",
      "Gastrointestinal stromal tumor"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Locate the sampled tissue relative to the EUS-defined lesion, instead of treating negative or bite-on-bite as proof that the lesion was sampled. Then Decide whether the characteristic lipoma appearance needs another specimen, rather than applying a tissue-required rule to every subepithelial lesion.",
    "reviewerNotes": "The characteristic-image conclusion requires clinician verification. If imaging is genuinely discordant or not diagnostic, further EUS/tissue evaluation can be indicated; that uncertainty must not be hidden.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "colonic_lipoma": "colonic_lipoma",
      "choice.qq20261102c.b22-context.d1": "choice.qq20261102b.b22-context.d1",
      "choice.qq20261102c.b22-context.d2": "choice.qq20261102b.b22-context.d2"
    },
    "choiceServiceOverrides": {
      "colonic_lipoma": null,
      "choice.qq20261102c.b22-context.d1": null,
      "choice.qq20261102c.b22-context.d2": null
    },
    "choiceTimingOverrides": {
      "colonic_lipoma": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b22-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.upper_endoscopy"
      },
      "choice.qq20261102c.b22-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.upper_endoscopy"
      }
    },
    "currentUpdate": "The outside laboratory report calls a bite-on-bite specimen negative. Review of its levels shows epithelium and lamina propria only; the submucosal plane is not represented. The lesion's deformability and wall-layer study are those documented in the current examination above.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r4",
      "whatChanged": "Replace repeated label recognition with normal-mucosa versus submucosal-imaging interpretation and credible over-sampling/exclusion errors.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B22-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited phrase remains in Presentation because its observation is necessary; its old option-aligned exclusion no longer determines this changed task. Use an observed specimen-layer discrepancy rather than manufacturing contradictory current EUS findings. Retain all exact shared clinical findings because the later management item passed. New inference, rather than a substitute cue: The current deformable third-layer uniformly bright lesion is characteristic, and the submitted specimen contains only the overlying mucosa. Attack: The task now applies specimen-layer interpretation against a plausible instinct to obtain tissue proof. It does not introduce a contradictory fourth-layer lesion or a second unresolved mass that would invalidate the passed no-follow-up plan."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The current deformable third-layer uniformly bright lesion is characteristic, and the submitted specimen contains only the overlying mucosa. Use an observed specimen-layer discrepancy rather than manufacturing contradictory current EUS findings. Retain all exact shared clinical findings because the later management item passed. Source limits: The characteristic-image conclusion requires clinician verification. If imaging is genuinely discordant or not diagnostic, further EUS/tissue evaluation can be indicated; that uncertainty must not be hidden.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Locate the sampled tissue relative to the EUS-defined lesion, instead of treating negative or bite-on-bite as proof that the lesion was sampled. Then Decide whether the characteristic lipoma appearance needs another specimen, rather than applying a tissue-required rule to every subepithelial lesion. Closest competing error: Keep repeating an apparently deep biopsy technique until a classic lesion has histologic proof. Retain all exact shared clinical findings because the later management item passed. Use an observed specimen-layer discrepancy rather than manufacturing contradictory current EUS findings.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: Simple lesion naming changes to a patient-specific specimen/imaging and further-investigation decision."
        ],
        "suggestions": [
          "suggestions 1: Use an observed specimen-layer discrepancy rather than manufacturing contradictory current EUS findings. Retain all exact shared clinical findings because the later management item passed. Concrete implementation: Locate the sampled tissue relative to the EUS-defined lesion, instead of treating negative or bite-on-bite as proof that the lesion was sampled. Then Decide whether the characteristic lipoma appearance needs another specimen, rather than applying a tissue-required rule to every subepithelial lesion. The closest error is: Keep repeating an apparently deep biopsy technique until a classic lesion has histologic proof. Required clinical boundary: The characteristic-image conclusion requires clinician verification. If imaging is genuinely discordant or not diagnostic, further EUS/tissue evaluation can be indicated; that uncertainty must not be hidden.",
          "suggestions 2: Retain all exact shared clinical findings because the later management item passed. Use an observed specimen-layer discrepancy rather than manufacturing contradictory current EUS findings. Concrete implementation: Locate the sampled tissue relative to the EUS-defined lesion, instead of treating negative or bite-on-bite as proof that the lesion was sampled. Then Decide whether the characteristic lipoma appearance needs another specimen, rather than applying a tissue-required rule to every subepithelial lesion. The closest error is: Keep repeating an apparently deep biopsy technique until a classic lesion has histologic proof. Required clinical boundary: The characteristic-image conclusion requires clinician verification. If imaging is genuinely discordant or not diagnostic, further EUS/tissue evaluation can be indicated; that uncertainty must not be hidden."
        ]
      },
      "selfCheck": {
        "cueAttack": "The task now applies specimen-layer interpretation against a plausible instinct to obtain tissue proof. It does not introduce a contradictory fourth-layer lesion or a second unresolved mass that would invalidate the passed no-follow-up plan.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Locate the sampled tissue relative to the EUS-defined lesion, instead of treating negative or bite-on-bite as proof that the lesion was sampled.",
          "Decide whether the characteristic lipoma appearance needs another specimen, rather than applying a tissue-required rule to every subepithelial lesion."
        ],
        "oneBestAnswer": "The current deformable third-layer uniformly bright lesion is characteristic, and the submitted specimen contains only the overlying mucosa.",
        "closestDistractor": "Keep repeating an apparently deep biopsy technique until a classic lesion has histologic proof.",
        "remainingReview": "The characteristic-image conclusion requires clinician verification. If imaging is genuinely discordant or not diagnostic, further EUS/tissue evaluation can be indicated; that uncertainty must not be hidden."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r5",
      "conceptId": "concept.colonic-lipoma.endoscopic-recognition.v2",
      "stem": "Which tissue-assessment plan should be recorded for {patientName}'s lesion?",
      "answerChoices": [
        {
          "id": "colonic_lipoma",
          "label": "No additional lesion tissue sampling",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The named biopsy technique did not reach the lesion, but a characteristic lipoma appearance does not require tissue confirmation merely because surface mucosa is normal."
        },
        {
          "id": "choice.qq20261102c.b22-context.d1",
          "label": "EUS-guided core biopsy of the lesion",
          "isCorrect": false,
          "distractorRationale": "Core tissue is appropriate for selected indeterminate or higher-risk subepithelial lesions, but is not needed solely to reconfirm the characteristic lipoma pattern shown here."
        },
        {
          "id": "choice.qq20261102c.b22-context.d2",
          "label": "Repeat deep-forceps biopsy of the lesion",
          "isCorrect": false,
          "distractorRationale": "A deeper forceps attempt might obtain submucosa, but another tissue procedure is unnecessary when the characteristic imaging and examination already establish an asymptomatic lipoma."
        }
      ],
      "explanation": "Interpret a negative specimen by the layer it contains. Normal mucosa does not erase a submucosal lesion. For a characteristic lipoma, normal mucosal biopsies do not mandate another lesion specimen.",
      "supportingEvidenceClaimIds": [
        "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
        "claim.qq20261102a.subepithelial-integrated-pattern",
        "claim.qq20261102c.classic-lipoma-normal-mucosal-sample"
      ],
      "teachingPoint": "Interpret a negative specimen by the layer it contains. Normal mucosa does not erase a submucosal lesion. For a characteristic lipoma, normal mucosal biopsies do not mandate another lesion specimen."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.colonic-lipoma.endoscopic-recognition",
      "nextConceptId": "concept.colonic-lipoma.endoscopic-recognition.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Simple lesion naming changes to a patient-specific specimen/imaging and further-investigation decision."
    }
  },
  {
    "id": "revision.qq20261102c.b24",
    "auditId": "B24",
    "caseId": "case.l2.gastric-malt.cd20-boundary.v1",
    "nodeId": "node.gastric-malt.cd20-alone-boundary.v1",
    "previousQuestionVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r4",
    "questionVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which next investigation should clarify {patientName}'s gastric infiltrate?",
    "previousChoiceLabels": [
      "Repeat endoscopy with documented-site biopsies for histologic comparison",
      "BIRC3-MALT1 fusion testing on the recorded gastric biopsy material",
      "Repeat immunoglobulin gene-rearrangement analysis on a second DNA extraction"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Weigh the clonal result against the actual morphology and sampling distribution rather than translating clonality into malignancy. Then Choose continued integrated classification before either lymphoma treatment or diagnostic closure.",
    "reviewerNotes": "Melissa/pathology must adjudicate the integrated classification and eventual sampling plan. This draft does not claim a particular next test is uniquely best or that absent gland destruction excludes MALT.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "lineage_not_diagnosis": "lineage_not_diagnosis",
      "choice.qq20261102c.b24.d1": "choice.qq20261102b.b24.d1",
      "choice.qq20261102c.b24.d2": "choice.qq20261102b.b24.d2"
    },
    "choiceServiceOverrides": {
      "lineage_not_diagnosis": null,
      "choice.qq20261102c.b24.d1": null,
      "choice.qq20261102c.b24.d2": null
    },
    "choiceTimingOverrides": {
      "lineage_not_diagnosis": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b24.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b24.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "The biopsy container identifies one antral site. The remaining block contains mucosa available for further sections. The stored endoscopy diagram has no marked biopsy sites elsewhere in the stomach.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r4",
      "whatChanged": "Reframe the failed investigation ranking as a classification/diagnostic-closure decision; supply real sample distribution and remaining-material facts.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B24",
      "originalVerdict": "FAIL",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Do not claim a repeat endoscopy is superior to testing existing tissue on the facts given. The near misses are overcalling malignancy from clonality and excluding it from preserved glands; no new concept meaning is intended beyond the existing integrated-diagnosis boundary. New inference, rather than a substitute cue: B-cell lineage/clonality is established, but the supplied morphology and sampling do not establish a specific lymphoma or exclude it. Attack: Remove the unadjudicated repeat-endoscopy-versus-FISH competition. All choices are interpretation-and-care categories, and none gets credit from a named safety principle or a longer test bundle."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: B-cell lineage/clonality is established, but the supplied morphology and sampling do not establish a specific lymphoma or exclude it. The near misses are overcalling malignancy from clonality and excluding it from preserved glands; no new concept meaning is intended beyond the existing integrated-diagnosis boundary. Describe one recorded site and available remaining material instead of assuming adequacy or exhaustion. Source limits: Melissa/pathology must adjudicate the integrated classification and eventual sampling plan. This draft does not claim a particular next test is uniquely best or that absent gland destruction excludes MALT.",
          "fairness 2: Decision-critical basis is now explicit: B-cell lineage/clonality is established, but the supplied morphology and sampling do not establish a specific lymphoma or exclude it. Do not claim a repeat endoscopy is superior to testing existing tissue on the facts given. Describe one recorded site and available remaining material instead of assuming adequacy or exhaustion. Single-best claim is limited by: Melissa/pathology must adjudicate the integrated classification and eventual sampling plan. This draft does not claim a particular next test is uniquely best or that absent gland destruction excludes MALT.",
          "fairness 3: The old difficulty/shortcut is addressed by a consequential decision: Weigh the clonal result against the actual morphology and sampling distribution rather than translating clonality into malignancy. Then Choose continued integrated classification before either lymphoma treatment or diagnostic closure. Closest competing error: Treat clonal B cells as sufficient proof of lymphoma and start the lymphoma pathway. Do not claim a repeat endoscopy is superior to testing existing tissue on the facts given. Describe one recorded site and available remaining material instead of assuming adequacy or exhaustion."
        ],
        "suggestions": [
          "suggestions 1: Describe one recorded site and available remaining material instead of assuming adequacy or exhaustion. Do not claim a repeat endoscopy is superior to testing existing tissue on the facts given. Concrete implementation: Weigh the clonal result against the actual morphology and sampling distribution rather than translating clonality into malignancy. Then Choose continued integrated classification before either lymphoma treatment or diagnostic closure. The closest error is: Treat clonal B cells as sufficient proof of lymphoma and start the lymphoma pathway. Required clinical boundary: Melissa/pathology must adjudicate the integrated classification and eventual sampling plan. This draft does not claim a particular next test is uniquely best or that absent gland destruction excludes MALT.",
          "suggestions 2: The near misses are overcalling malignancy from clonality and excluding it from preserved glands; no new concept meaning is intended beyond the existing integrated-diagnosis boundary. Do not claim a repeat endoscopy is superior to testing existing tissue on the facts given. Concrete implementation: Weigh the clonal result against the actual morphology and sampling distribution rather than translating clonality into malignancy. Then Choose continued integrated classification before either lymphoma treatment or diagnostic closure. The closest error is: Treat clonal B cells as sufficient proof of lymphoma and start the lymphoma pathway. Required clinical boundary: Melissa/pathology must adjudicate the integrated classification and eventual sampling plan. This draft does not claim a particular next test is uniquely best or that absent gland destruction excludes MALT."
        ]
      },
      "selfCheck": {
        "cueAttack": "Remove the unadjudicated repeat-endoscopy-versus-FISH competition. All choices are interpretation-and-care categories, and none gets credit from a named safety principle or a longer test bundle.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Weigh the clonal result against the actual morphology and sampling distribution rather than translating clonality into malignancy.",
          "Choose continued integrated classification before either lymphoma treatment or diagnostic closure."
        ],
        "oneBestAnswer": "B-cell lineage/clonality is established, but the supplied morphology and sampling do not establish a specific lymphoma or exclude it.",
        "closestDistractor": "Treat clonal B cells as sufficient proof of lymphoma and start the lymphoma pathway.",
        "remainingReview": "Melissa/pathology must adjudicate the integrated classification and eventual sampling plan. This draft does not claim a particular next test is uniquely best or that absent gland destruction excludes MALT."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.cd20-alone-boundary.v1.r5",
      "conceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "stem": "Which interpretation should guide {patientName}'s next care?",
      "answerChoices": [
        {
          "id": "lineage_not_diagnosis",
          "label": "Keep the classification open and obtain correlated histologic assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Clonality and B-cell lineage do not settle a morphologically unresolved infiltrate; retain diagnostic review rather than assign a definitive lymphoma or reactive category."
        },
        {
          "id": "choice.qq20261102c.b24.d1",
          "label": "Assign gastric MALT lymphoma and enter its treatment pathway",
          "isCorrect": false,
          "distractorRationale": "A clonal population may occur with chronic inflammation; the stated evidence does not independently establish the lymphoma classification."
        },
        {
          "id": "choice.qq20261102c.b24.d2",
          "label": "Assign reactive gastritis and end the lymphoma assessment",
          "isCorrect": false,
          "distractorRationale": "Preserved glands in these sections do not by themselves exclude all MALT lymphoma or make this limited distribution definitive."
        }
      ],
      "explanation": "A clonal B-cell result is interpreted with morphology and clinical context. It neither independently establishes gastric MALT lymphoma nor makes preserved glands proof of benignity. The correct decision here is to retain diagnostic assessment. This question deliberately does not rank fusion testing, deeper sections and repeat endoscopy as interchangeable next investigations.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.integrated-pathologic-recognition",
        "claim.qq20261102a.gastric-lineage-not-classification",
        "claim.qq20261102b.gastric-clone-not-diagnosis",
        "claim.qq20261102b.gastric-uncertainty-repeat-biopsy",
        "claim.qq20261102c.gastric-clonality-classification-boundary"
      ],
      "teachingPoint": "A clonal B-cell result is interpreted with morphology and clinical context. It neither independently establishes gastric MALT lymphoma nor makes preserved glands proof of benignity. The correct decision here is to retain diagnostic assessment. This question deliberately does not rank fusion testing, deeper sections and repeat endoscopy as interchangeable next investigations."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "nextConceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Existing objective applied with revised wording/data; no concept meaning change."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic to review gastric biopsies obtained for dyspepsia. Small CD20-positive B cells form nodules among mixed inflammatory cells. The submitted sections contain gastric glands whose epithelium is preserved. Immunoglobulin gene-rearrangement testing reports a clonal B-cell population.",
    "previousPresentation": "{patientName}, a 43-year-old woman, visits the clinic to review gastric biopsies obtained for dyspepsia. Small CD20-positive B cells form dense nodules among mixed inflammatory cells. In the sections shown, glands pass through the infiltrate with their epithelium preserved. Immunoglobulin gene-rearrangement testing reports a clonal B-cell population.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102b.case.l2.gastric-malt.cd20-boundary.v1",
        "patientPresentationVariantId": "presentation.gastric-malt.cd20-alone-boundary",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v6",
        "revisedChiefComplaint": "Gastric biopsy review",
        "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic to review gastric biopsies obtained for dyspepsia. Small CD20-positive B cells form dense nodules among mixed inflammatory cells. In the sections shown, glands pass through the infiltrate with their epithelium preserved. Immunoglobulin gene-rearrangement testing reports a clonal B-cell population.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102c.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v7"
    }
  },
  {
    "id": "revision.qq20261102c.b25",
    "auditId": "B25",
    "caseId": "case.l2.gastric-malt.profile-to-followup-boundary.v1",
    "nodeId": "node.gastric-malt.eradication-response-reassessment.v1",
    "previousQuestionVariantId": "question.gastric-malt.eradication-response-reassessment.v1.r3",
    "questionVariantId": "question.gastric-malt.eradication-response-reassessment.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which treatment-and-review plan is appropriate for {patientName}'s localized gastric lymphoma?",
    "previousChoiceLabels": [
      "H. pylori eradication with planned histologic response assessment",
      "Rituximab treatment with planned radiologic response assessment",
      "H. pylori eradication with symptom-triggered clinical reassessment"
    ],
    "previousCurrentUpdate": "The pathology review identifies low-grade gastric MALT lymphoma. H. pylori testing is positive, and staging confines the disease to the stomach.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Verify that the infection result is interpretable and distinguish residual histology/PCR from ongoing infection. Then Use the symptom and histologic trajectory to choose monitoring rather than equating any residual clone with treatment failure.",
    "reviewerNotes": "Hematology/clinician must confirm response classification, the exact infection-test conditions and follow-up schedule. No new lymphoma response deadline or universal observation duration is authored.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "eradicate_and_reassess": "eradicate_and_reassess",
      "choice.qq20261102c.b25.d1": "choice.qq20261102a.b25.d1",
      "choice.qq20261102c.b25.d2": "choice.qq20261102a.b25.d2"
    },
    "choiceServiceOverrides": {
      "eradicate_and_reassess": null,
      "choice.qq20261102c.b25.d1": null,
      "choice.qq20261102c.b25.d2": null
    },
    "currentUpdate": "After treatment for localized H. pylori-positive gastric MALT lymphoma, a urea breath test is negative six weeks after therapy started and two weeks after proton-pump inhibitors stopped. The gastric ulcer has healed, the discomfort has resolved and repeat mapped biopsies show smaller residual lymphoid clusters with increasing fibrosis. There is no new deep wall extension or nodal disease on reassessment. The original BIRC3-MALT1 study was negative. PCR still detects the original B-cell clone.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-malt.eradication-response-reassessment.v1.r3",
      "whatChanged": "Replace initial first-line recall with a discordant molecular-positive but clinically/histologically improving response.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B25",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Supply source-backed infection-test timing/medication conditions rather than say eradication was successful. Supply symptom, endoscopic, histologic and extent trajectories. New inference, rather than a substitute cue: Symptoms and ulceration have resolved and morphology is regressing, with valid infection assessment and no new adverse extension. Attack: The diagnosis alone no longer gives an initial-treatment rule. Positive residual tests compete with concrete improvement; the choices are three complete follow-up strategies without the former shared-half convergence."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: Symptoms and ulceration have resolved and morphology is regressing, with valid infection assessment and no new adverse extension. Supply symptom, endoscopic, histologic and extent trajectories. Supply source-backed infection-test timing/medication conditions rather than say eradication was successful. Source limits: Hematology/clinician must confirm response classification, the exact infection-test conditions and follow-up schedule. No new lymphoma response deadline or universal observation duration is authored.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Verify that the infection result is interpretable and distinguish residual histology/PCR from ongoing infection. Then Use the symptom and histologic trajectory to choose monitoring rather than equating any residual clone with treatment failure. Closest competing error: Escalate to radiotherapy because the original clone remains detectable. Supply source-backed infection-test timing/medication conditions rather than say eradication was successful. Supply symptom, endoscopic, histologic and extent trajectories.",
          "fairness 3: The old difficulty/shortcut is addressed by a consequential decision: Verify that the infection result is interpretable and distinguish residual histology/PCR from ongoing infection. Then Use the symptom and histologic trajectory to choose monitoring rather than equating any residual clone with treatment failure. Closest competing error: Escalate to radiotherapy because the original clone remains detectable. Supply source-backed infection-test timing/medication conditions rather than say eradication was successful. Supply symptom, endoscopic, histologic and extent trajectories."
        ],
        "suggestions": [
          "suggestions 1: Supply source-backed infection-test timing/medication conditions rather than say eradication was successful. Supply symptom, endoscopic, histologic and extent trajectories. Concrete implementation: Verify that the infection result is interpretable and distinguish residual histology/PCR from ongoing infection. Then Use the symptom and histologic trajectory to choose monitoring rather than equating any residual clone with treatment failure. The closest error is: Escalate to radiotherapy because the original clone remains detectable. Required clinical boundary: Hematology/clinician must confirm response classification, the exact infection-test conditions and follow-up schedule. No new lymphoma response deadline or universal observation duration is authored.",
          "suggestions 2: Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. Make persistent clone versus persistent infection versus progressive lymphoma the competing interpretations; version the changed objective. Concrete implementation: Verify that the infection result is interpretable and distinguish residual histology/PCR from ongoing infection. Then Use the symptom and histologic trajectory to choose monitoring rather than equating any residual clone with treatment failure. The closest error is: Escalate to radiotherapy because the original clone remains detectable. Required clinical boundary: Hematology/clinician must confirm response classification, the exact infection-test conditions and follow-up schedule. No new lymphoma response deadline or universal observation duration is authored."
        ]
      },
      "selfCheck": {
        "cueAttack": "The diagnosis alone no longer gives an initial-treatment rule. Positive residual tests compete with concrete improvement; the choices are three complete follow-up strategies without the former shared-half convergence.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Verify that the infection result is interpretable and distinguish residual histology/PCR from ongoing infection.",
          "Use the symptom and histologic trajectory to choose monitoring rather than equating any residual clone with treatment failure."
        ],
        "oneBestAnswer": "Symptoms and ulceration have resolved and morphology is regressing, with valid infection assessment and no new adverse extension.",
        "closestDistractor": "Escalate to radiotherapy because the original clone remains detectable.",
        "remainingReview": "Hematology/clinician must confirm response classification, the exact infection-test conditions and follow-up schedule. No new lymphoma response deadline or universal observation duration is authored."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.eradication-response-reassessment.v1.r4",
      "conceptId": "concept.gastric-malt-lymphoma.hpylori-eradication-first-line.v2",
      "stem": "Which care plan should be arranged for {patientName}'s returned assessment?",
      "answerChoices": [
        {
          "id": "eradicate_and_reassess",
          "label": "Active surveillance with repeat gastric biopsies",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The patient is asymptomatic with regressing residual disease and no adverse progression; persistent clonality alone is not an instruction for immediate additional treatment."
        },
        {
          "id": "choice.qq20261102c.b25.d1",
          "label": "Involved-site radiotherapy with repeat gastric biopsies",
          "isCorrect": false,
          "distractorRationale": "This treats molecular persistence as sufficient progression despite regressing morphology and resolved symptoms."
        },
        {
          "id": "choice.qq20261102c.b25.d2",
          "label": "Further eradication therapy with repeat gastric biopsies",
          "isCorrect": false,
          "distractorRationale": "Infection clearance was assessed under stated conditions; residual lymphoma is not equivalent to persistent infection."
        }
      ],
      "explanation": "The direction of the clinical and histologic response matters. Asymptomatic residual gastric MALT without adverse progression can be monitored after eradication. A persistent molecular clone does not by itself establish a need for radiotherapy, and residual lymphoma does not prove that the infection persists. Planned histologic follow-up remains necessary.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.hpylori-eradication-initial-localized",
        "claim.gastric-malt.eradication-confirmation-and-response-reassessment",
        "claim.gastric-malt.progression-and-transformation-boundary",
        "claim.qq20261102a.gastric-malt-response-assessment",
        "claim.qq20261102c.hpylori-test-conditions",
        "claim.qq20261102c.gastric-regressing-residual-monitoring",
        "claim.qq20261102c.gastric-molecular-persistence"
      ],
      "teachingPoint": "The direction of the clinical and histologic response matters. Asymptomatic residual gastric MALT without adverse progression can be monitored after eradication. A persistent molecular clone does not by itself establish a need for radiotherapy, and residual lymphoma does not prove that the infection persists. Planned histologic follow-up remains necessary."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.gastric-malt-lymphoma.hpylori-eradication-first-line",
      "nextConceptId": "concept.gastric-malt-lymphoma.hpylori-eradication-first-line.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Initial eradication selection changes to deciding what an actual post-treatment response warrants."
    }
  },
  {
    "id": "revision.qq20261102c.b25-context",
    "auditId": "B25-context",
    "caseId": "case.l2.gastric-malt.profile-to-followup-boundary.v1",
    "nodeId": "node.gastric-malt.pathology-profile-selection.v1",
    "previousQuestionVariantId": "question.gastric-malt.pathology-profile-selection.v1.r4",
    "questionVariantId": "question.gastric-malt.pathology-profile-selection.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which diagnosis fits {patientName}'s gastric architecture and marker pattern?",
    "previousChoiceLabels": [
      "Gastric extranodal marginal-zone lymphoma",
      "Gastric follicular lymphoma",
      "Gastric mantle-cell lymphoma"
    ],
    "previousCurrentUpdate": "Atypical B cells expand the gastric lamina propria and infiltrate glands. CD20 and CD79a stain the infiltrate; CD5, CD10 and cyclin D1 do not.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the architecture and distribution of the larger cells instead of grading from their mere presence. Then Select the corresponding initial infection-associated indolent lymphoma pathway and retain histologic review.",
    "reviewerNotes": "Pathologist must verify the described architecture and absence of a confluent large-cell component; no proliferation cutoff or regimen/dose is invented.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "small_b_cells_lel": "small_b_cells_lel",
      "choice.qq20261102c.b25-context.d1": "choice.qq20261102b.b25-context.d1",
      "choice.qq20261102c.b25-context.d2": "choice.qq20261102b.b25-context.d2"
    },
    "choiceServiceOverrides": {
      "small_b_cells_lel": null,
      "choice.qq20261102c.b25-context.d1": null,
      "choice.qq20261102c.b25-context.d2": null
    },
    "currentUpdate": "The gastric sections contain a dense small B-cell infiltrate expanding the lamina propria and entering gland epithelium. Larger cells with open chromatin and nucleoli occur singly between the small cells rather than in confluent groups. CD20 marks the infiltrate. H. pylori is detected, and staging shows disease confined to the stomach.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-malt.pathology-profile-selection.v1.r4",
      "whatChanged": "Replace subtype-marker recall with a larger-cell interpretation that would otherwise redirect treatment.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B25-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Remove the marker-negative elimination list. Use actual small-cell/gland architecture and individual large-cell distribution. New inference, rather than a substitute cue: The destructive infiltrate is predominantly small B cells; the larger cells are dispersed individually, with localized H. pylori-associated disease. Attack: Delete the negative CD5/CD10/cyclin-D1 list and its tailored subtype distractors. The competing error now changes management, and the diagnosis is an answer choice rather than a stem label."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The destructive infiltrate is predominantly small B cells; the larger cells are dispersed individually, with localized H. pylori-associated disease. Use actual small-cell/gland architecture and individual large-cell distribution. Remove the marker-negative elimination list. Source limits: Pathologist must verify the described architecture and absence of a confluent large-cell component; no proliferation cutoff or regimen/dose is invented.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Interpret the architecture and distribution of the larger cells instead of grading from their mere presence. Then Select the corresponding initial infection-associated indolent lymphoma pathway and retain histologic review. Closest competing error: Overcall transformation from the presence of a few larger atypical cells and bypass eradication-led care. Use actual small-cell/gland architecture and individual large-cell distribution. Remove the marker-negative elimination list.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: Signature-marker recognition changes to a morphology-driven classification and initial-care decision with a competing transformation interpretation."
        ],
        "suggestions": [
          "suggestions 1: Remove the marker-negative elimination list. The initial classification/therapy decision is separate from the later post-eradication response question and receives a new concept version. Concrete implementation: Interpret the architecture and distribution of the larger cells instead of grading from their mere presence. Then Select the corresponding initial infection-associated indolent lymphoma pathway and retain histologic review. The closest error is: Overcall transformation from the presence of a few larger atypical cells and bypass eradication-led care. Required clinical boundary: Pathologist must verify the described architecture and absence of a confluent large-cell component; no proliferation cutoff or regimen/dose is invented.",
          "suggestions 2: The initial classification/therapy decision is separate from the later post-eradication response question and receives a new concept version. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. Concrete implementation: Interpret the architecture and distribution of the larger cells instead of grading from their mere presence. Then Select the corresponding initial infection-associated indolent lymphoma pathway and retain histologic review. The closest error is: Overcall transformation from the presence of a few larger atypical cells and bypass eradication-led care. Required clinical boundary: Pathologist must verify the described architecture and absence of a confluent large-cell component; no proliferation cutoff or regimen/dose is invented."
        ]
      },
      "selfCheck": {
        "cueAttack": "Delete the negative CD5/CD10/cyclin-D1 list and its tailored subtype distractors. The competing error now changes management, and the diagnosis is an answer choice rather than a stem label.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the architecture and distribution of the larger cells instead of grading from their mere presence.",
          "Select the corresponding initial infection-associated indolent lymphoma pathway and retain histologic review."
        ],
        "oneBestAnswer": "The destructive infiltrate is predominantly small B cells; the larger cells are dispersed individually, with localized H. pylori-associated disease.",
        "closestDistractor": "Overcall transformation from the presence of a few larger atypical cells and bypass eradication-led care.",
        "remainingReview": "Pathologist must verify the described architecture and absence of a confluent large-cell component; no proliferation cutoff or regimen/dose is invented."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.pathology-profile-selection.v1.r5",
      "conceptId": "concept.gastric-malt-lymphoma.pathologic-recognition.v2",
      "stem": "Which pathology-and-initial-care interpretation should be used for {patientName}?",
      "answerChoices": [
        {
          "id": "small_b_cells_lel",
          "label": "Gastric MALT lymphoma: eradication and histologic review",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Scattered larger cells do not by themselves establish large-B-cell transformation; integrate the small-cell/gland architecture and localized infection-associated presentation."
        },
        {
          "id": "choice.qq20261102c.b25-context.d1",
          "label": "Gastric large-B-cell lymphoma: systemic lymphoma care",
          "isCorrect": false,
          "distractorRationale": "The mere presence of individual larger cells is not the confluent large-cell component required to establish transformation."
        },
        {
          "id": "choice.qq20261102c.b25-context.d2",
          "label": "Reactive gastric follicles: infection care and clinical review",
          "isCorrect": false,
          "distractorRationale": "The atypical small B-cell expansion with gland invasion is not explained by a reactive-follicle label alone."
        }
      ],
      "explanation": "Gastric lymphoma classification is architectural, not a tally of positive lineage markers or any large cell. A confluent large-B-cell component changes the pathway; individual larger cells among an otherwise small-cell MALT pattern do not establish that change. Localized infection-associated indolent disease is treated with eradication and planned histologic response assessment.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.integrated-pathologic-recognition",
        "claim.qq20261102a.gastric-small-b-cell-differential",
        "claim.qq20261102c.gastric-large-cell-transformation-boundary",
        "claim.qq20261102c.gastric-eradication-response-pathway"
      ],
      "teachingPoint": "Gastric lymphoma classification is architectural, not a tally of positive lineage markers or any large cell. A confluent large-B-cell component changes the pathway; individual larger cells among an otherwise small-cell MALT pattern do not establish that change. Localized infection-associated indolent disease is treated with eradication and planned histologic response assessment."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "nextConceptId": "concept.gastric-malt-lymphoma.pathologic-recognition.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Signature-marker recognition changes to a morphology-driven classification and initial-care decision with a competing transformation interpretation."
    }
  },
  {
    "id": "revision.qq20261102c.b26",
    "auditId": "B26",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-040",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-040.1",
    "previousQuestionVariantId": "question.statistics-ethics.p-value.v2.r4",
    "questionVariantId": "question.statistics-ethics.p-value.v2.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which paired conclusion should {patientName} report from this study?",
    "previousChoiceLabels": [
      "Zero-effect hypothesis not rejected; target benefit unconfirmed",
      "Zero-effect hypothesis not rejected; target benefit demonstrated",
      "Zero-effect hypothesis rejected; target benefit unconfirmed",
      "Zero-effect hypothesis rejected; target benefit demonstrated"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Constructed teaching dataset and hypothetical protocol criteria; not a clinical benefit threshold.",
      "items": [
        {
          "label": "Risk difference: intervention minus control",
          "value": "-2 percentage points"
        },
        {
          "label": "Approximate 95% confidence interval",
          "value": "-6.7 to 2.7 percentage points"
        },
        {
          "label": "Two-sided p-value",
          "value": "0.4"
        }
      ]
    },
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Notice that the point estimate meets the target but the uncertainty interval still includes harm and much larger benefit. Then Reject both premature adoption and false futility/equivalence, and identify precision as the unresolved question.",
    "reviewerNotes": "Statistical/clinical review must verify estimates and the distinction between an interval model and a probability of a true effect. No real treatment benefit threshold or collection of gameplay statistics.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_p-040": "correct_p-040",
      "choice.qq20261102c.b26.d1": "choice.qq20261102b.b26.d1",
      "choice.qq20261102c.b26.d2": "choice.qq20261102b.b26.d2",
      "choice.qq20261102c.b26.d3": "choice.qq20261102b.b26.d3"
    },
    "choiceServiceOverrides": {
      "correct_p-040": null,
      "choice.qq20261102c.b26.d1": null,
      "choice.qq20261102c.b26.d2": null,
      "choice.qq20261102c.b26.d3": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.statistics-ethics.p-value.v2.r4",
      "whatChanged": "Use a target-meeting point estimate with an interval admitting both harm and worthwhile benefit; distinguish unconfirmed from excluded.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B26",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Keep the hypothetical protocol criteria visible rather than hide necessary decision information. Introduce a real point-estimate/interval conflict and consequence-based options. New inference, rather than a substitute cue: The interval spans harm and target-level benefit despite a favorable target-meeting point estimate. Attack: The protocol stays visible for fairness. The conflict is between the favorable point estimate and uncertainty, rather than two concordant threshold comparisons. Every option states a conclusion and consequence."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The interval spans harm and target-level benefit despite a favorable target-meeting point estimate. Introduce a real point-estimate/interval conflict and consequence-based options. Keep the hypothetical protocol criteria visible rather than hide necessary decision information. Source limits: Statistical/clinical review must verify estimates and the distinction between an interval model and a probability of a true effect. No real treatment benefit threshold or collection of gameplay statistics.",
          "fairness 2: Decision-critical basis is now explicit: The interval spans harm and target-level benefit despite a favorable target-meeting point estimate. Keep the hypothetical protocol criteria visible rather than hide necessary decision information. Introduce a real point-estimate/interval conflict and consequence-based options. Single-best claim is limited by: Statistical/clinical review must verify estimates and the distinction between an interval model and a probability of a true effect. No real treatment benefit threshold or collection of gameplay statistics.",
          "fairness 3: The old difficulty/shortcut is addressed by a consequential decision: Notice that the point estimate meets the target but the uncertainty interval still includes harm and much larger benefit. Then Reject both premature adoption and false futility/equivalence, and identify precision as the unresolved question. Closest competing error: Call the target excluded because the result is not statistically significant. Validate all constructed arithmetic separately and version the broader scored objective. Keep the hypothetical protocol criteria visible rather than hide necessary decision information."
        ],
        "suggestions": [
          "suggestions 1: Introduce a real point-estimate/interval conflict and consequence-based options. Keep the hypothetical protocol criteria visible rather than hide necessary decision information. Concrete implementation: Notice that the point estimate meets the target but the uncertainty interval still includes harm and much larger benefit. Then Reject both premature adoption and false futility/equivalence, and identify precision as the unresolved question. The closest error is: Call the target excluded because the result is not statistically significant. Required clinical boundary: Statistical/clinical review must verify estimates and the distinction between an interval model and a probability of a true effect. No real treatment benefit threshold or collection of gameplay statistics.",
          "suggestions 2: Introduce a real point-estimate/interval conflict and consequence-based options. Keep the hypothetical protocol criteria visible rather than hide necessary decision information. Concrete implementation: Notice that the point estimate meets the target but the uncertainty interval still includes harm and much larger benefit. Then Reject both premature adoption and false futility/equivalence, and identify precision as the unresolved question. The closest error is: Call the target excluded because the result is not statistically significant. Required clinical boundary: Statistical/clinical review must verify estimates and the distinction between an interval model and a probability of a true effect. No real treatment benefit threshold or collection of gameplay statistics."
        ]
      },
      "selfCheck": {
        "cueAttack": "The protocol stays visible for fairness. The conflict is between the favorable point estimate and uncertainty, rather than two concordant threshold comparisons. Every option states a conclusion and consequence.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Notice that the point estimate meets the target but the uncertainty interval still includes harm and much larger benefit.",
          "Reject both premature adoption and false futility/equivalence, and identify precision as the unresolved question."
        ],
        "oneBestAnswer": "The interval spans harm and target-level benefit despite a favorable target-meeting point estimate.",
        "closestDistractor": "Call the target excluded because the result is not statistically significant.",
        "remainingReview": "Statistical/clinical review must verify estimates and the distinction between an interval model and a probability of a true effect. No real treatment benefit threshold or collection of gameplay statistics."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v2.r5",
      "conceptId": "concept.statistics-ethics.p-value.v2",
      "stem": "Which interpretation and study-planning conclusion should {patientName}'s team report?",
      "answerChoices": [
        {
          "id": "correct_p-040",
          "label": "Target benefit is plausible but unconfirmed; a more precise study could resolve it",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The point estimate meets the target, but the interval admits both a larger benefit and harm. Neither significance nor target confirmation/exclusion is established."
        },
        {
          "id": "choice.qq20261102c.b26.d1",
          "label": "Target benefit is excluded by nonsignificance; another efficacy study has no role",
          "isCorrect": false,
          "distractorRationale": "A failure to reject the zero-effect null does not exclude clinically important benefits admitted by the interval."
        },
        {
          "id": "choice.qq20261102c.b26.d2",
          "label": "Target benefit is established by the point estimate; proceed with routine adoption",
          "isCorrect": false,
          "distractorRationale": "A favorable point estimate alone does not satisfy the supplied whole-interval decision criterion."
        },
        {
          "id": "choice.qq20261102c.b26.d3",
          "label": "Clinical equivalence is established by nonsignificance; stop comparative efficacy work",
          "isCorrect": false,
          "distractorRationale": "Nonsignificance is not an equivalence result, especially when the interval includes large effects in both directions."
        }
      ],
      "explanation": "The p-value, estimated effect and interval answer different questions. A nonsignificant study can remain compatible with a worthwhile effect. Here the target is unconfirmed, not excluded, and equivalence has not been established. A more precise design may distinguish those possibilities; the fictional protocol does not prescribe a clinical adoption threshold.",
      "teachingPoint": "The p-value, estimated effect and interval answer different questions. A nonsignificant study can remain compatible with a worthwhile effect. Here the target is unconfirmed, not excluded, and equivalence has not been established. A more precise design may distinguish those possibilities; the fictional protocol does not prescribe a clinical adoption threshold.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed teaching estimates and protocol; not a clinical benefit threshold.",
        "items": [
          {
            "label": "Risk difference: intervention minus control",
            "value": "-5 percentage points"
          },
          {
            "label": "Approximate 95% confidence interval",
            "value": "-17 to 7 percentage points"
          },
          {
            "label": "Two-sided p-value, rounded",
            "value": "0.4"
          }
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.p-value",
        "claim.qq20261102a.null-test-versus-protocol-magnitude",
        "claim.qq20261102b.specified-interval-decision-rule",
        "claim.qq20261102c.uncertain-target-benefit-not-excluded"
      ]
    },
    "clinicalBinding": {
      "previousConceptId": "concept.statistics-ethics.p-value",
      "nextConceptId": "concept.statistics-ethics.p-value.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Defining a p-value changes to an applied study-planning decision about a target effect under uncertainty."
    },
    "presentationTemplate": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The outcome is unplanned reoperation; a lower risk is beneficial. The hypothetical protocol tests zero risk difference at two-sided alpha 0.05. Its target benefit is a reduction of at least 4 percentage points. It confirms that target only when the entire reported 95% interval supports that reduction, and excludes the target only when the entire interval falls short of it.",
    "previousPresentation": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The endpoint is unplanned reoperation; a lower event risk is beneficial. The hypothetical protocol tests zero risk difference at two-sided alpha 0.05. It confirms a benefit of at least 4 percentage points only if the entire reported 95% interval reaches at least that reduction; it excludes that target under the interval model if the entire interval falls short of it.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102b.case.gs028se.arr-nnt-p-value.b-p-040",
        "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-040",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v6",
        "revisedChiefComplaint": "Thyroid surgery study",
        "revisedPresentation": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The endpoint is unplanned reoperation; a lower event risk is beneficial. The hypothetical protocol tests zero risk difference at two-sided alpha 0.05. It confirms a benefit of at least 4 percentage points only if the entire reported 95% interval reaches at least that reduction; it excludes that target under the interval model if the entire interval falls short of it.",
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
      "idPrefix": "ppr.qq20261102c.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v7"
    }
  },
  {
    "id": "revision.qq20261102c.b30",
    "auditId": "B30",
    "caseId": "case.l2.gastric-malt.integrated-diagnosis-to-treatment.v1",
    "nodeId": "node.gastric-malt.integrated-pathology-diagnosis.v1",
    "previousQuestionVariantId": "question.gastric-malt.integrated-pathology-diagnosis.v1.r4",
    "questionVariantId": "question.gastric-malt.integrated-pathology-diagnosis.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which diagnosis fits {patientName}'s integrated gastric biopsy findings?",
    "previousChoiceLabels": [
      "Gastric extranodal marginal-zone lymphoma",
      "Gastric follicular lymphoma",
      "Gastric mantle-cell lymphoma"
    ],
    "previousCurrentUpdate": "The gastric infiltrate contains small atypical B cells with irregular nuclei and pale cytoplasm expanding the lamina propria and entering gland epithelium. CD20 and CD79a stain the infiltrate; CD5, CD10 and cyclin D1 do not.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret a negative fusion test as a limited molecular result rather than exclusion of the morphologic diagnosis. Then Retain the localized infection-associated lymphoma treatment and response-assessment pathway.",
    "reviewerNotes": "Pathology must confirm the complete classification and molecular-test role; FISH negativity does not guarantee treatment response or exclude all alternative diagnoses.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "gastric_malt": "gastric_malt",
      "choice.qq20261102c.b30.d1": "choice.qq20261102b.b30.d1",
      "choice.qq20261102c.b30.d2": "choice.qq20261102b.b30.d2"
    },
    "choiceServiceOverrides": {
      "gastric_malt": null,
      "choice.qq20261102c.b30.d1": null,
      "choice.qq20261102c.b30.d2": null
    },
    "currentUpdate": "Mapped gastric biopsies show a small atypical B-cell expansion entering gland epithelium and replacing portions of its lining. CD20 marks the infiltrate. H. pylori is present. FISH does not detect BIRC3-MALT1. The clinical staging assessment confines the disease to the stomach.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-malt.integrated-pathology-diagnosis.v1.r4",
      "whatChanged": "Use a discordant negative molecular result as a consequential classification/follow-up decision rather than another signature immunophenotype.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B30",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Make the actual negative fusion result compete with the tissue architecture. Delete CD5/CD10/cyclin-D1 eliminations. New inference, rather than a substitute cue: The architecture is compatible despite absent fusion; the test is not universally positive in this disease. Attack: Remove the tailored negative lineage-marker list. The negative test is a credible contrary observation that must be interpreted, not a complete diagnosis summary before the question."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The architecture is compatible despite absent fusion; the test is not universally positive in this disease. Keep treatment response separate in the later node; the changed classification-plus-care objective has its own version. Delete CD5/CD10/cyclin-D1 eliminations. Source limits: Pathology must confirm the complete classification and molecular-test role; FISH negativity does not guarantee treatment response or exclude all alternative diagnoses.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Interpret a negative fusion test as a limited molecular result rather than exclusion of the morphologic diagnosis. Then Retain the localized infection-associated lymphoma treatment and response-assessment pathway. Closest competing error: Use a precise negative molecular report to overrule the integrated morphology and omit lymphoma follow-up. Delete CD5/CD10/cyclin-D1 eliminations. Make the actual negative fusion result compete with the tissue architecture.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: Signature-marker recognition changes to a morphology-driven classification and initial-care decision with a competing transformation interpretation."
        ],
        "suggestions": [
          "suggestions 1: Make the actual negative fusion result compete with the tissue architecture. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. Concrete implementation: Interpret a negative fusion test as a limited molecular result rather than exclusion of the morphologic diagnosis. Then Retain the localized infection-associated lymphoma treatment and response-assessment pathway. The closest error is: Use a precise negative molecular report to overrule the integrated morphology and omit lymphoma follow-up. Required clinical boundary: Pathology must confirm the complete classification and molecular-test role; FISH negativity does not guarantee treatment response or exclude all alternative diagnoses.",
          "suggestions 2: Keep treatment response separate in the later node; the changed classification-plus-care objective has its own version. Make the actual negative fusion result compete with the tissue architecture. Concrete implementation: Interpret a negative fusion test as a limited molecular result rather than exclusion of the morphologic diagnosis. Then Retain the localized infection-associated lymphoma treatment and response-assessment pathway. The closest error is: Use a precise negative molecular report to overrule the integrated morphology and omit lymphoma follow-up. Required clinical boundary: Pathology must confirm the complete classification and molecular-test role; FISH negativity does not guarantee treatment response or exclude all alternative diagnoses."
        ]
      },
      "selfCheck": {
        "cueAttack": "Remove the tailored negative lineage-marker list. The negative test is a credible contrary observation that must be interpreted, not a complete diagnosis summary before the question.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret a negative fusion test as a limited molecular result rather than exclusion of the morphologic diagnosis.",
          "Retain the localized infection-associated lymphoma treatment and response-assessment pathway."
        ],
        "oneBestAnswer": "The architecture is compatible despite absent fusion; the test is not universally positive in this disease.",
        "closestDistractor": "Use a precise negative molecular report to overrule the integrated morphology and omit lymphoma follow-up.",
        "remainingReview": "Pathology must confirm the complete classification and molecular-test role; FISH negativity does not guarantee treatment response or exclude all alternative diagnoses."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.integrated-pathology-diagnosis.v1.r5",
      "conceptId": "concept.gastric-malt-lymphoma.pathologic-recognition.v2",
      "stem": "Which interpretation and initial-care plan should be discussed with {patientName}?",
      "answerChoices": [
        {
          "id": "gastric_malt",
          "label": "Gastric MALT lymphoma: eradication and histologic review",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The fusion is not present in all MALT lymphoma. Negative FISH does not overturn compatible integrated morphology or remove the need for response assessment."
        },
        {
          "id": "choice.qq20261102c.b30.d1",
          "label": "Reactive gastritis: infection care and clinical review",
          "isCorrect": false,
          "distractorRationale": "A negative subtype-associated molecular test is not a sensitive exclusion test for MALT lymphoma."
        },
        {
          "id": "choice.qq20261102c.b30.d2",
          "label": "Indeterminate infiltrate: repeat fusion testing before treatment",
          "isCorrect": false,
          "distractorRationale": "Repeating the same negative molecular result does not resolve or override the already available integrated tissue findings."
        }
      ],
      "explanation": "Molecular tests have different roles from integrated diagnosis. BIRC3-MALT1 is not detected in every gastric MALT lymphoma, so its absence cannot exclude an otherwise supported classification. Use the morphology and clinical extent to plan eradication-led care and histologic response review.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.integrated-pathologic-recognition",
        "claim.qq20261102a.gastric-small-b-cell-differential",
        "claim.qq20261102c.gastric-negative-fusion-not-exclusion",
        "claim.qq20261102c.gastric-eradication-response-pathway"
      ],
      "teachingPoint": "Molecular tests have different roles from integrated diagnosis. BIRC3-MALT1 is not detected in every gastric MALT lymphoma, so its absence cannot exclude an otherwise supported classification. Use the morphology and clinical extent to plan eradication-led care and histologic response review."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "nextConceptId": "concept.gastric-malt-lymphoma.pathologic-recognition.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Signature-marker recognition changes to a morphology-driven classification and initial-care decision with a competing transformation interpretation."
    }
  },
  {
    "id": "revision.qq20261102c.b30-context",
    "auditId": "B30-context",
    "caseId": "case.l2.gastric-malt.integrated-diagnosis-to-treatment.v1",
    "nodeId": "node.gastric-malt.localized-hpylori-positive-initial-treatment.v1",
    "previousQuestionVariantId": "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1.r3",
    "questionVariantId": "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which initial treatment and response-assessment plan should be arranged for {patientName}?",
    "previousChoiceLabels": [
      "H. pylori eradication with planned histologic response assessment",
      "H. pylori eradication with symptom-triggered clinical reassessment",
      "Rituximab treatment with planned radiologic response assessment"
    ],
    "previousCurrentUpdate": "{patientName}'s reviewed biopsy supports low-grade gastric MALT lymphoma. H. pylori is detected, and staging confines the disease to the stomach.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Distinguish overt symptomatic histologic/endoscopic progression from slow or regressing residual disease. Then Use localized extent and confirmed infection clearance to choose a lymphoma escalation discussion.",
    "reviewerNotes": "Hematology/radiation clinician must verify escalation and restaging; no dose, response deadline or automatic radiotherapy instruction is authored.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "eradicate_then_reassess": "eradicate_then_reassess",
      "choice.qq20261102c.b30-context.d1": "choice.qq20261102a.b30-context.d1",
      "choice.qq20261102c.b30-context.d2": "choice.qq20261102a.b30-context.d2"
    },
    "choiceServiceOverrides": {
      "eradicate_then_reassess": null,
      "choice.qq20261102c.b30-context.d1": null,
      "choice.qq20261102c.b30-context.d2": null
    },
    "currentUpdate": "After completed eradication, the urea breath test is negative six weeks after treatment started and two weeks after stopping proton-pump inhibitors. Serial endoscopy shows the gastric ulcer enlarging rather than healing, and recurrent bleeding has lowered hemoglobin. Repeat mapped biopsies show increasing low-grade MALT infiltration. Restaging still confines the disease to the stomach; there is no confluent large-cell component.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1.r3",
      "whatChanged": "Replace the duplicated initial eradication question with a progressive symptomatic localized response that contrasts with B25's improving residual disease.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B30-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Use actual infection-test conditions and serial endoscopic/histologic findings. Offer observation as a credible near miss with a defined clinical boundary. New inference, rather than a substitute cue: Ulcer enlargement, recurrent bleeding and increasing lymphoma infiltration coexist after interpretable infection clearance. Attack: The key is determined by observed progression, not an arbitrary time since eradication. The sister case supports monitoring with the same test conditions but a different clinical trajectory."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: Ulcer enlargement, recurrent bleeding and increasing lymphoma infiltration coexist after interpretable infection clearance. Use actual infection-test conditions and serial endoscopic/histologic findings. Offer observation as a credible near miss with a defined clinical boundary. Source limits: Hematology/radiation clinician must verify escalation and restaging; no dose, response deadline or automatic radiotherapy instruction is authored.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Distinguish overt symptomatic histologic/endoscopic progression from slow or regressing residual disease. Then Use localized extent and confirmed infection clearance to choose a lymphoma escalation discussion. Closest competing error: Apply the familiar prolonged-response observation policy despite a worsening clinical and tissue trajectory. Use actual infection-test conditions and serial endoscopic/histologic findings. Offer observation as a credible near miss with a defined clinical boundary.",
          "fairness 3: The old difficulty/shortcut is addressed by a consequential decision: Distinguish overt symptomatic histologic/endoscopic progression from slow or regressing residual disease. Then Use localized extent and confirmed infection clearance to choose a lymphoma escalation discussion. Closest competing error: Apply the familiar prolonged-response observation policy despite a worsening clinical and tissue trajectory. Offer observation as a credible near miss with a defined clinical boundary. Use actual infection-test conditions and serial endoscopic/histologic findings."
        ],
        "suggestions": [
          "suggestions 1: Use actual infection-test conditions and serial endoscopic/histologic findings. Offer observation as a credible near miss with a defined clinical boundary. Concrete implementation: Distinguish overt symptomatic histologic/endoscopic progression from slow or regressing residual disease. Then Use localized extent and confirmed infection clearance to choose a lymphoma escalation discussion. The closest error is: Apply the familiar prolonged-response observation policy despite a worsening clinical and tissue trajectory. Required clinical boundary: Hematology/radiation clinician must verify escalation and restaging; no dose, response deadline or automatic radiotherapy instruction is authored.",
          "suggestions 2: Version the changed objective; do not introduce an exact response-failure deadline. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. Concrete implementation: Distinguish overt symptomatic histologic/endoscopic progression from slow or regressing residual disease. Then Use localized extent and confirmed infection clearance to choose a lymphoma escalation discussion. The closest error is: Apply the familiar prolonged-response observation policy despite a worsening clinical and tissue trajectory. Required clinical boundary: Hematology/radiation clinician must verify escalation and restaging; no dose, response deadline or automatic radiotherapy instruction is authored."
        ]
      },
      "selfCheck": {
        "cueAttack": "The key is determined by observed progression, not an arbitrary time since eradication. The sister case supports monitoring with the same test conditions but a different clinical trajectory.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Distinguish overt symptomatic histologic/endoscopic progression from slow or regressing residual disease.",
          "Use localized extent and confirmed infection clearance to choose a lymphoma escalation discussion."
        ],
        "oneBestAnswer": "Ulcer enlargement, recurrent bleeding and increasing lymphoma infiltration coexist after interpretable infection clearance.",
        "closestDistractor": "Apply the familiar prolonged-response observation policy despite a worsening clinical and tissue trajectory.",
        "remainingReview": "Hematology/radiation clinician must verify escalation and restaging; no dose, response deadline or automatic radiotherapy instruction is authored."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1.r4",
      "conceptId": "concept.gastric-malt-lymphoma.hpylori-eradication-first-line.v2",
      "stem": "Which care plan should be arranged for {patientName}'s returned assessment?",
      "answerChoices": [
        {
          "id": "eradicate_then_reassess",
          "label": "Involved-site radiotherapy with histologic review",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Localized symptomatic, overtly progressive disease after infection clearance warrants escalation rather than monitoring a regressing residual pattern."
        },
        {
          "id": "choice.qq20261102c.b30-context.d1",
          "label": "Continued surveillance with histologic review",
          "isCorrect": false,
          "distractorRationale": "Observation of asymptomatic residual disease does not apply unchanged to worsening ulceration, bleeding and increasing infiltration."
        },
        {
          "id": "choice.qq20261102c.b30-context.d2",
          "label": "Further eradication therapy with histologic review",
          "isCorrect": false,
          "distractorRationale": "The infection assessment is interpretable; disease progression is not evidence that the same infection treatment needs repetition."
        }
      ],
      "explanation": "Slow histologic clearance and overt progression are different clinical states. Localized gastric MALT with symptomatic or adverse progression after eradication should be assessed for involved-site radiotherapy. Do not infer persistent infection from residual lymphoma or apply watchful monitoring without considering the actual trajectory.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.hpylori-eradication-initial-localized",
        "claim.gastric-malt.eradication-confirmation-and-response-reassessment",
        "claim.qq20261102a.gastric-malt-response-assessment",
        "claim.qq20261102c.hpylori-test-conditions",
        "claim.qq20261102c.gastric-progressive-local-escalation"
      ],
      "teachingPoint": "Slow histologic clearance and overt progression are different clinical states. Localized gastric MALT with symptomatic or adverse progression after eradication should be assessed for involved-site radiotherapy. Do not infer persistent infection from residual lymphoma or apply watchful monitoring without considering the actual trajectory."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.gastric-malt-lymphoma.hpylori-eradication-first-line",
      "nextConceptId": "concept.gastric-malt-lymphoma.hpylori-eradication-first-line.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Initial eradication selection changes to deciding what an actual post-treatment response warrants."
    }
  },
  {
    "id": "revision.qq20261102c.b32",
    "auditId": "B32",
    "caseId": "case.pancreatic-pseudocyst.early-satiety",
    "nodeId": "node.pancreatic-pseudocyst.early-satiety.2",
    "previousQuestionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v1.r3",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
    "previousChoiceLabels": [
      "Referral for endoscopic transmural drainage assessment",
      "Referral for percutaneous catheter drainage assessment",
      "Referral for operative internal drainage assessment",
      "Observation with nutritional support and repeat imaging"
    ],
    "previousCurrentUpdate": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the matching arterial filling/connecting channel as an arterial lesion rather than collection debris. Then Prioritize vascular treatment over the otherwise plausible symptomatic collection drainage.",
    "reviewerNotes": "Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_0": "drain_0",
      "choice.qq20261102c.b32.d1": "choice.qq20261102a.b32.d1",
      "choice.qq20261102c.b32.d2": "choice.qq20261102a.b32.d2"
    },
    "choiceServiceOverrides": {
      "drain_0": null,
      "choice.qq20261102c.b32.d1": null,
      "choice.qq20261102c.b32.d2": null
    },
    "choiceTimingOverrides": {
      "drain_0": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      },
      "choice.qq20261102c.b32.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102c.b32.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      }
    },
    "currentUpdate": "Arterial CT shows a round cavity at the collection edge filling to the same density as the splenic artery, with a narrow connecting channel. The collection has a complete wall and compresses the posterior stomach. Hemoglobin remains below the previous clinic value after the episode of melena; pulse and blood pressure remain near the post-resuscitation observations.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v1.r3",
      "whatChanged": "Replace four near-identical drainage referrals with arterial control, necrosis step-up, partial-leak bridging and disconnected-duct drainage decisions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B32",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The enhancing cavity communicates with an artery and accompanies new blood loss. The enhancing cavity communicates with an artery and accompanies new blood loss. Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. Source limits: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Interpret the matching arterial filling/connecting channel as an arterial lesion rather than collection debris. Then Prioritize vascular treatment over the otherwise plausible symptomatic collection drainage. Closest competing error: Proceed with the apparently ideal apposed-collection drainage before treating the vascular source. Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. The enhancing cavity communicates with an artery and accompanies new blood loss.",
          "fairness 3: The old difficulty/shortcut is addressed by a consequential decision: Interpret the matching arterial filling/connecting channel as an arterial lesion rather than collection debris. Then Prioritize vascular treatment over the otherwise plausible symptomatic collection drainage. Closest competing error: Proceed with the apparently ideal apposed-collection drainage before treating the vascular source. Do not require every preprocedure safety step before referral; the new task asks about the particular returned finding that changes the next plan. The enhancing cavity communicates with an artery and accompanies new blood loss.",
          "fairness 4: The old difficulty/shortcut is addressed by a consequential decision: Interpret the matching arterial filling/connecting channel as an arterial lesion rather than collection debris. Then Prioritize vascular treatment over the otherwise plausible symptomatic collection drainage. Closest competing error: Proceed with the apparently ideal apposed-collection drainage before treating the vascular source. Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options."
        ],
        "suggestions": [
          "suggestions 1: Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. The enhancing cavity communicates with an artery and accompanies new blood loss. Concrete implementation: Interpret the matching arterial filling/connecting channel as an arterial lesion rather than collection debris. Then Prioritize vascular treatment over the otherwise plausible symptomatic collection drainage. The closest error is: Proceed with the apparently ideal apposed-collection drainage before treating the vascular source. Required clinical boundary: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
          "suggestions 2: Do not require every preprocedure safety step before referral; the new task asks about the particular returned finding that changes the next plan. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. Concrete implementation: Interpret the matching arterial filling/connecting channel as an arterial lesion rather than collection debris. Then Prioritize vascular treatment over the otherwise plausible symptomatic collection drainage. The closest error is: Proceed with the apparently ideal apposed-collection drainage before treating the vascular source. Required clinical boundary: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
          "suggestions 3: Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. Concrete implementation: Interpret the matching arterial filling/connecting channel as an arterial lesion rather than collection debris. Then Prioritize vascular treatment over the otherwise plausible symptomatic collection drainage. The closest error is: Proceed with the apparently ideal apposed-collection drainage before treating the vascular source. Required clinical boundary: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee."
        ]
      },
      "selfCheck": {
        "cueAttack": "The four siblings require different treatment sequences, not a repeated apposed-fluid rule. Actual failure of meals/support and/or blood loss supplies the decision burden; no size-only intervention threshold or timing-based shortcut.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the matching arterial filling/connecting channel as an arterial lesion rather than collection debris.",
          "Prioritize vascular treatment over the otherwise plausible symptomatic collection drainage."
        ],
        "oneBestAnswer": "The enhancing cavity communicates with an artery and accompanies new blood loss.",
        "closestDistractor": "Proceed with the apparently ideal apposed-collection drainage before treating the vascular source.",
        "remainingReview": "Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.symptomatic-endoscopic-drainage.v1.r4",
      "conceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage.v2",
      "stem": "Which treatment sequence should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "drain_0",
          "label": "Arterial embolization, then collection drainage if required",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The arterial source takes priority; drainage can be reconsidered after vascular control rather than puncturing or decompressing it first."
        },
        {
          "id": "choice.qq20261102c.b32.d1",
          "label": "Endoscopic collection drainage, then arterial treatment if required",
          "isCorrect": false,
          "distractorRationale": "The otherwise reasonable drainage indication does not override an untreated communicating arterial source."
        },
        {
          "id": "choice.qq20261102c.b32.d2",
          "label": "Surgical arterial control with internal collection drainage",
          "isCorrect": false,
          "distractorRationale": "Surgery can provide vascular control in selected circumstances, but angiographic control is the usual less invasive next approach for the supplied resuscitated arterial complication when available; internal drainage alone is not the vascular treatment."
        }
      ],
      "explanation": "Interpret the matching arterial filling/connecting channel as an arterial lesion rather than collection debris. Prioritize vascular treatment over the otherwise plausible symptomatic collection drainage. The symptom trajectory supplies an intervention problem, but the collection label alone does not determine the route or sequence. Decisions depend on the reported vascular, contents and duct anatomy.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.early.pseudocyst.symptomatic-endoscopic-drainage",
        "claim.qq20261102c.pancreatic-arterial-focus-before-drainage"
      ],
      "teachingPoint": "Interpret the matching arterial filling/connecting channel as an arterial lesion rather than collection debris. Prioritize vascular treatment over the otherwise plausible symptomatic collection drainage. The symptom trajectory supplies an intervention problem, but the collection label alone does not determine the route or sequence. Decisions depend on the reported vascular, contents and duct anatomy."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage",
      "nextConceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "A generic pseudocyst drainage-referral rule changes materially to sequencing treatment for vascular/necrotic or duct-related complications."
    }
  },
  {
    "id": "revision.qq20261102c.b32-context",
    "auditId": "B32-context",
    "caseId": "case.pancreatic-pseudocyst.early-satiety",
    "nodeId": "node.pancreatic-pseudocyst.early-satiety.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v1.r4",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which CT protocol should be requested for {patientName}'s ongoing upper-abdominal symptoms?",
    "previousChoiceLabels": [
      "Abdominal CT: intravenous contrast given; oral contrast omitted",
      "Abdominal CT: intravenous contrast omitted; oral contrast given",
      "Abdominal CT: intravenous contrast omitted; oral contrast omitted"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Notice the new blood-loss finding within an otherwise plausible symptomatic collection story. Then Select arterial characterization rather than repeating the venous acquisition or moving directly to duct mapping.",
    "reviewerNotes": "Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_0": "ct_0",
      "choice.qq20261102c.b32-context.d1": "choice.qq20261102b.b32-context.d1",
      "choice.qq20261102c.b32-context.d2": "choice.qq20261102b.b32-context.d2"
    },
    "choiceServiceOverrides": {
      "ct_0": "service.ct",
      "choice.qq20261102c.b32-context.d1": "service.ct",
      "choice.qq20261102c.b32-context.d2": "service.mrcp"
    },
    "choiceTimingOverrides": {
      "ct_0": {
        "kind": "test",
        "timingProfileId": "timing.test.ct_angiography"
      },
      "choice.qq20261102c.b32-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102c.b32-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.mrcp"
      }
    },
    "currentUpdate": "The outside portal-venous CT shows a walled fluid collection next to the posterior stomach. A rounded enhancing focus lies at its margin. No arterial acquisition was obtained. Hemoglobin has fallen from the last clinic result. After resuscitation, repeated pulse and blood-pressure observations are near the patient's preceding values.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.contrast-ct-characterization.v1.r4",
      "whatChanged": "Replace four identical contrast-route questions with vascular, contents and duct-continuity applications paired to different treatment decisions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B32-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Remove the oral-contrast omission assertion and all rejected basic metadata. Only a venous acquisition exists, and the unresolved finding is enhancing marginal tissue with blood loss. New inference, rather than a substitute cue: Only a venous acquisition exists, and the unresolved finding is enhancing marginal tissue with blood loss. Attack: Replace the IV-given versus IV-omitted outlier with actual prior acquisition data and three plausible investigation plans. No universal claim about oral contrast is retained."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: Only a venous acquisition exists, and the unresolved finding is enhancing marginal tissue with blood loss. Remove the oral-contrast omission assertion and all rejected basic metadata. Use an explicit new concept version and, for three siblings, the existing MRCP service/gate instead of falsely returning MRCP findings from a CT-only order. Source limits: Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Notice the new blood-loss finding within an otherwise plausible symptomatic collection story. Then Select arterial characterization rather than repeating the venous acquisition or moving directly to duct mapping. Closest competing error: Repeat portal-venous CT with the same coverage as the outside study Remove the oral-contrast omission assertion and all rejected basic metadata. Only a venous acquisition exists, and the unresolved finding is enhancing marginal tissue with blood loss.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: A routine IV-contrast CT rule changes to choosing among different investigations for an unresolved intervention-planning question."
        ],
        "suggestions": [
          "suggestions 1: Only a venous acquisition exists, and the unresolved finding is enhancing marginal tissue with blood loss. Remove the oral-contrast omission assertion and all rejected basic metadata. Concrete implementation: Notice the new blood-loss finding within an otherwise plausible symptomatic collection story. Then Select arterial characterization rather than repeating the venous acquisition or moving directly to duct mapping. The closest error is: Repeat portal-venous CT with the same coverage as the outside study Required clinical boundary: Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
          "suggestions 2: Only a venous acquisition exists, and the unresolved finding is enhancing marginal tissue with blood loss. Remove the oral-contrast omission assertion and all rejected basic metadata. Concrete implementation: Notice the new blood-loss finding within an otherwise plausible symptomatic collection story. Then Select arterial characterization rather than repeating the venous acquisition or moving directly to duct mapping. The closest error is: Repeat portal-venous CT with the same coverage as the outside study Required clinical boundary: Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored."
        ]
      },
      "selfCheck": {
        "cueAttack": "Replace the IV-given versus IV-omitted outlier with actual prior acquisition data and three plausible investigation plans. No universal claim about oral contrast is retained.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Notice the new blood-loss finding within an otherwise plausible symptomatic collection story.",
          "Select arterial characterization rather than repeating the venous acquisition or moving directly to duct mapping."
        ],
        "oneBestAnswer": "Only a venous acquisition exists, and the unresolved finding is enhancing marginal tissue with blood loss.",
        "closestDistractor": "Repeat portal-venous CT with the same coverage as the outside study",
        "remainingReview": "Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v1.r5",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization.v2",
      "stem": "Which imaging plan should be arranged next for {patientName}?",
      "answerChoices": [
        {
          "id": "ct_0",
          "label": "Multiphasic CT angiography",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Bleeding plus an enhancing marginal focus requires vascular characterization before a drainage plan."
        },
        {
          "id": "choice.qq20261102c.b32-context.d1",
          "label": "Portal-venous contrast-enhanced CT",
          "isCorrect": false,
          "distractorRationale": "Repeating the same venous acquisition does not answer the suspected arterial-source question."
        },
        {
          "id": "choice.qq20261102c.b32-context.d2",
          "label": "Pancreatic MRI with MRCP",
          "isCorrect": false,
          "distractorRationale": "Duct continuity matters for drainage but does not take priority over the new arterial-bleeding concern."
        }
      ],
      "explanation": "Notice the new blood-loss finding within an otherwise plausible symptomatic collection story. Select arterial characterization rather than repeating the venous acquisition or moving directly to duct mapping. The selected acquisition must answer the actual unresolved vascular, contents or duct question; repeating an existing modality label is not completion of that assessment.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.qq20261102a.pancreatic-contrast-characterization",
        "claim.qq20261102c.pancreatic-arterial-focus-before-drainage"
      ],
      "teachingPoint": "Notice the new blood-loss finding within an otherwise plausible symptomatic collection story. Select arterial characterization rather than repeating the venous acquisition or moving directly to duct mapping. The selected acquisition must answer the actual unresolved vascular, contents or duct question; repeating an existing modality label is not completion of that assessment."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pseudocyst.contrast-ct-characterization",
      "nextConceptId": "concept.pseudocyst.contrast-ct-characterization.v2",
      "previousKeyServiceId": "service.ct",
      "nextKeyServiceId": "service.ct",
      "previousResultGate": {
        "id": "gate.pseudocyst.ct.0",
        "resultTypeId": "service.ct",
        "pendingLabel": "External contrast-enhanced CT pending",
        "resultNarrative": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ct.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.pseudocyst.ct.0",
        "resultTypeId": "service.ct",
        "pendingLabel": "Arterial CT assessment pending",
        "resultNarrative": "Arterial CT shows a round cavity at the collection edge filling to the same density as the splenic artery, with a narrow connecting channel. The collection has a complete wall and compresses the posterior stomach. Hemoglobin remains below the previous clinic value after the episode of melena; pulse and blood pressure remain near the post-resuscitation observations.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ct.outsourced"
        ]
      },
      "reason": "A routine IV-contrast CT rule changes to choosing among different investigations for an unresolved intervention-planning question."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with fullness after pancreatitis. Meals stop after a few mouthfuls, and weight is falling despite dietetic support. The patient now reports black stools.",
    "previousPresentation": "{patientName}, a 49-year-old woman, visits the clinic with persistent early satiety after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
    "previousProfilePresentations": [
      {
        "id": "profile.pancreatic-pseudocyst.early-satiety.female.49",
        "presentation": "{patientName}, a 49-year-old woman, visits the clinic with persistent early satiety after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      },
      {
        "id": "profile.pancreatic-pseudocyst.early-satiety.male.49",
        "presentation": "{patientName}, a 49-year-old man, visits the clinic with persistent early satiety after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      },
      {
        "id": "profile.pancreatic-pseudocyst.early-satiety.female.51",
        "presentation": "{patientName}, a 51-year-old woman, visits the clinic with persistent early satiety after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      },
      {
        "id": "profile.pancreatic-pseudocyst.early-satiety.male.51",
        "presentation": "{patientName}, a 51-year-old man, visits the clinic with persistent early satiety after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.pancreatic-pseudocyst.early-satiety",
        "patientPresentationVariantId": "presentation.pancreatic-pseudocyst.early-satiety",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedPresentation": "{patientName}, a 49-year-old woman, visits the clinic with persistent early satiety after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
        "revisedFields": [
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.early-satiety.female.49",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.early-satiety.female.49",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 49-year-old woman, visits the clinic with persistent early satiety after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.early-satiety.male.49",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.early-satiety.male.49",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 49-year-old man, visits the clinic with persistent early satiety after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.early-satiety.female.51",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.early-satiety.female.51",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 51-year-old woman, visits the clinic with persistent early satiety after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.early-satiety.male.51",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.early-satiety.male.51",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 51-year-old man, visits the clinic with persistent early satiety after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
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
        "ageYears": 49,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102c.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v7"
    }
  },
  {
    "id": "revision.qq20261102c.b33",
    "auditId": "B33",
    "caseId": "case.pancreatic-pseudocyst.postmeal-vomiting",
    "nodeId": "node.pancreatic-pseudocyst.postmeal-vomiting.2",
    "previousQuestionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v2.r3",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v2.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
    "previousChoiceLabels": [
      "Referral for endoscopic transmural drainage assessment",
      "Referral for percutaneous catheter drainage assessment",
      "Referral for operative internal drainage assessment",
      "Observation with nutritional support and repeat imaging"
    ],
    "previousCurrentUpdate": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Distinguish an encapsulated necrotic collection from a simple fluid-only pseudocyst. Then Choose staged drainage/reassessment rather than immediate complete debridement or a duct-only shortcut.",
    "reviewerNotes": "Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_1": "drain_1",
      "choice.qq20261102c.b33.d1": "choice.qq20261102a.b33.d1",
      "choice.qq20261102c.b33.d2": "choice.qq20261102a.b33.d2"
    },
    "choiceServiceOverrides": {
      "drain_1": null,
      "choice.qq20261102c.b33.d1": null,
      "choice.qq20261102c.b33.d2": null
    },
    "choiceTimingOverrides": {
      "drain_1": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102c.b33.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102c.b33.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ercp"
      }
    },
    "currentUpdate": "MRI shows a complete-walled collection apposed to the posterior stomach, containing dependent irregular nonliquid fragments among fluid. The patient continues to vomit after meals despite nutritional support. There is no current clinical sepsis or organ failure.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v2.r3",
      "whatChanged": "Replace four near-identical drainage referrals with arterial control, necrosis step-up, partial-leak bridging and disconnected-duct drainage decisions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B33",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The mature apposed collection contains nonliquid fragments and causes persistent feeding intolerance. The mature apposed collection contains nonliquid fragments and causes persistent feeding intolerance. Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. Source limits: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
          "fairness 2: Decision-critical basis is now explicit: The mature apposed collection contains nonliquid fragments and causes persistent feeding intolerance. The mature apposed collection contains nonliquid fragments and causes persistent feeding intolerance. Do not require every preprocedure safety step before referral; the new task asks about the particular returned finding that changes the next plan. Single-best claim is limited by: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
          "fairness 3: The old difficulty/shortcut is addressed by a consequential decision: Distinguish an encapsulated necrotic collection from a simple fluid-only pseudocyst. Then Choose staged drainage/reassessment rather than immediate complete debridement or a duct-only shortcut. Closest competing error: Choose immediate necrosectomy because solid material is visible, rather than beginning with drainage and reassessment. Do not require every preprocedure safety step before referral; the new task asks about the particular returned finding that changes the next plan. The mature apposed collection contains nonliquid fragments and causes persistent feeding intolerance.",
          "fairness 4: The old difficulty/shortcut is addressed by a consequential decision: Distinguish an encapsulated necrotic collection from a simple fluid-only pseudocyst. Then Choose staged drainage/reassessment rather than immediate complete debridement or a duct-only shortcut. Closest competing error: Choose immediate necrosectomy because solid material is visible, rather than beginning with drainage and reassessment. The mature apposed collection contains nonliquid fragments and causes persistent feeding intolerance. Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention."
        ],
        "suggestions": [
          "suggestions 1: The mature apposed collection contains nonliquid fragments and causes persistent feeding intolerance. Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. Concrete implementation: Distinguish an encapsulated necrotic collection from a simple fluid-only pseudocyst. Then Choose staged drainage/reassessment rather than immediate complete debridement or a duct-only shortcut. The closest error is: Choose immediate necrosectomy because solid material is visible, rather than beginning with drainage and reassessment. Required clinical boundary: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
          "suggestions 2: Do not require every preprocedure safety step before referral; the new task asks about the particular returned finding that changes the next plan. The mature apposed collection contains nonliquid fragments and causes persistent feeding intolerance. Concrete implementation: Distinguish an encapsulated necrotic collection from a simple fluid-only pseudocyst. Then Choose staged drainage/reassessment rather than immediate complete debridement or a duct-only shortcut. The closest error is: Choose immediate necrosectomy because solid material is visible, rather than beginning with drainage and reassessment. Required clinical boundary: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
          "suggestions 3: Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. The mature apposed collection contains nonliquid fragments and causes persistent feeding intolerance. Concrete implementation: Distinguish an encapsulated necrotic collection from a simple fluid-only pseudocyst. Then Choose staged drainage/reassessment rather than immediate complete debridement or a duct-only shortcut. The closest error is: Choose immediate necrosectomy because solid material is visible, rather than beginning with drainage and reassessment. Required clinical boundary: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee."
        ]
      },
      "selfCheck": {
        "cueAttack": "The four siblings require different treatment sequences, not a repeated apposed-fluid rule. Actual failure of meals/support and/or blood loss supplies the decision burden; no size-only intervention threshold or timing-based shortcut.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Distinguish an encapsulated necrotic collection from a simple fluid-only pseudocyst.",
          "Choose staged drainage/reassessment rather than immediate complete debridement or a duct-only shortcut."
        ],
        "oneBestAnswer": "The mature apposed collection contains nonliquid fragments and causes persistent feeding intolerance.",
        "closestDistractor": "Choose immediate necrosectomy because solid material is visible, rather than beginning with drainage and reassessment.",
        "remainingReview": "Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.symptomatic-endoscopic-drainage.v2.r4",
      "conceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage.v2",
      "stem": "Which endoscopic treatment sequence should be discussed for {patientName}?",
      "answerChoices": [
        {
          "id": "drain_1",
          "label": "Transmural drainage with reassessment; add necrosectomy if required",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "An apposed symptomatic necrotic collection supports an endoscopic step-up approach rather than assuming all debris must be removed in the first session."
        },
        {
          "id": "choice.qq20261102c.b33.d1",
          "label": "Transmural necrosectomy first, followed by drainage stenting",
          "isCorrect": false,
          "distractorRationale": "Visible solid material does not automatically require immediate direct debridement before an initial drainage strategy."
        },
        {
          "id": "choice.qq20261102c.b33.d2",
          "label": "Transpapillary duct stenting alone, followed by collection reassessment",
          "isCorrect": false,
          "distractorRationale": "A duct-only approach does not adequately address an apposed necrotic collection with nonliquid material and persistent obstructive symptoms."
        }
      ],
      "explanation": "Distinguish an encapsulated necrotic collection from a simple fluid-only pseudocyst. Choose staged drainage/reassessment rather than immediate complete debridement or a duct-only shortcut. The symptom trajectory supplies an intervention problem, but the collection label alone does not determine the route or sequence. Decisions depend on the reported vascular, contents and duct anatomy.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.early.pseudocyst.symptomatic-endoscopic-drainage",
        "claim.qq20261102c.pancreatic-mri-contents",
        "claim.qq20261102c.pancreatic-necrosis-step-up"
      ],
      "teachingPoint": "Distinguish an encapsulated necrotic collection from a simple fluid-only pseudocyst. Choose staged drainage/reassessment rather than immediate complete debridement or a duct-only shortcut. The symptom trajectory supplies an intervention problem, but the collection label alone does not determine the route or sequence. Decisions depend on the reported vascular, contents and duct anatomy."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage",
      "nextConceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "A generic pseudocyst drainage-referral rule changes materially to sequencing treatment for vascular/necrotic or duct-related complications."
    }
  },
  {
    "id": "revision.qq20261102c.b33-context",
    "auditId": "B33-context",
    "caseId": "case.pancreatic-pseudocyst.postmeal-vomiting",
    "nodeId": "node.pancreatic-pseudocyst.postmeal-vomiting.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v2.r4",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v2.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which CT protocol should be requested for {patientName}'s ongoing upper-abdominal symptoms?",
    "previousChoiceLabels": [
      "Abdominal CT: intravenous contrast given; oral contrast omitted",
      "Abdominal CT: intravenous contrast omitted; oral contrast given",
      "Abdominal CT: intravenous contrast omitted; oral contrast omitted"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Recognize that the proposed procedure depends on whether CT strands are nonliquid contents. Then Choose a complementary contents/duct study rather than repeat the same acquisition or intervene before classification.",
    "reviewerNotes": "Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_1": "ct_1",
      "choice.qq20261102c.b33-context.d1": "choice.qq20261102b.b33-context.d1",
      "choice.qq20261102c.b33-context.d2": "choice.qq20261102b.b33-context.d2"
    },
    "choiceServiceOverrides": {
      "ct_1": "service.mrcp",
      "choice.qq20261102c.b33-context.d1": "service.ct",
      "choice.qq20261102c.b33-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.mrcp"
      },
      "choice.qq20261102c.b33-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102c.b33-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ercp"
      }
    },
    "currentUpdate": "The outside contrast CT shows an encapsulated collection against the posterior stomach. Its contents are described as mostly fluid, with internal strands that cannot be separated from nonliquid material on the available images.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.contrast-ct-characterization.v2.r4",
      "whatChanged": "Replace four identical contrast-route questions with vascular, contents and duct-continuity applications paired to different treatment decisions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B33-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Remove the oral-contrast omission assertion and all rejected basic metadata. Use an explicit new concept version and, for three siblings, the existing MRCP service/gate instead of falsely returning MRCP findings from a CT-only order. New inference, rather than a substitute cue: The CT's actual unresolved question is internal nonliquid material, not simply whether IV contrast was used. Attack: Replace the IV-given versus IV-omitted outlier with actual prior acquisition data and three plausible investigation plans. No universal claim about oral contrast is retained."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The CT's actual unresolved question is internal nonliquid material, not simply whether IV contrast was used. Remove the oral-contrast omission assertion and all rejected basic metadata. Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence. Source limits: Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Recognize that the proposed procedure depends on whether CT strands are nonliquid contents. Then Choose a complementary contents/duct study rather than repeat the same acquisition or intervene before classification. Closest competing error: Repeat the same CT acquisition and classify all low-density contents as fluid The CT's actual unresolved question is internal nonliquid material, not simply whether IV contrast was used. Remove the oral-contrast omission assertion and all rejected basic metadata.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: A routine IV-contrast CT rule changes to choosing among different investigations for an unresolved intervention-planning question."
        ],
        "suggestions": [
          "suggestions 1: The CT's actual unresolved question is internal nonliquid material, not simply whether IV contrast was used. Remove the oral-contrast omission assertion and all rejected basic metadata. Concrete implementation: Recognize that the proposed procedure depends on whether CT strands are nonliquid contents. Then Choose a complementary contents/duct study rather than repeat the same acquisition or intervene before classification. The closest error is: Repeat the same CT acquisition and classify all low-density contents as fluid Required clinical boundary: Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
          "suggestions 2: The CT's actual unresolved question is internal nonliquid material, not simply whether IV contrast was used. Remove the oral-contrast omission assertion and all rejected basic metadata. Concrete implementation: Recognize that the proposed procedure depends on whether CT strands are nonliquid contents. Then Choose a complementary contents/duct study rather than repeat the same acquisition or intervene before classification. The closest error is: Repeat the same CT acquisition and classify all low-density contents as fluid Required clinical boundary: Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored."
        ]
      },
      "selfCheck": {
        "cueAttack": "Replace the IV-given versus IV-omitted outlier with actual prior acquisition data and three plausible investigation plans. No universal claim about oral contrast is retained.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that the proposed procedure depends on whether CT strands are nonliquid contents.",
          "Choose a complementary contents/duct study rather than repeat the same acquisition or intervene before classification."
        ],
        "oneBestAnswer": "The CT's actual unresolved question is internal nonliquid material, not simply whether IV contrast was used.",
        "closestDistractor": "Repeat the same CT acquisition and classify all low-density contents as fluid",
        "remainingReview": "Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v2.r5",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization.v2",
      "stem": "Which investigation plan should be arranged next for {patientName}'s collection?",
      "answerChoices": [
        {
          "id": "ct_1",
          "label": "Pancreatic MRI with MRCP",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "MRI can better resolve nonliquid contents and duct anatomy before choosing the procedure."
        },
        {
          "id": "choice.qq20261102c.b33-context.d1",
          "label": "Repeat contrast-enhanced CT",
          "isCorrect": false,
          "distractorRationale": "A duplicate acquisition and fluid-only assumption do not resolve the actual contents question."
        },
        {
          "id": "choice.qq20261102c.b33-context.d2",
          "label": "Endoscopic retrograde pancreatography",
          "isCorrect": false,
          "distractorRationale": "A duct intervention cannot replace characterization of a possible necrotic collection before treatment planning."
        }
      ],
      "explanation": "Recognize that the proposed procedure depends on whether CT strands are nonliquid contents. Choose a complementary contents/duct study rather than repeat the same acquisition or intervene before classification. The selected acquisition must answer the actual unresolved vascular, contents or duct question; repeating an existing modality label is not completion of that assessment.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.qq20261102a.pancreatic-contrast-characterization",
        "claim.qq20261102c.pancreatic-mri-contents",
        "claim.qq20261102c.pancreatic-necrosis-step-up"
      ],
      "teachingPoint": "Recognize that the proposed procedure depends on whether CT strands are nonliquid contents. Choose a complementary contents/duct study rather than repeat the same acquisition or intervene before classification. The selected acquisition must answer the actual unresolved vascular, contents or duct question; repeating an existing modality label is not completion of that assessment."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pseudocyst.contrast-ct-characterization",
      "nextConceptId": "concept.pseudocyst.contrast-ct-characterization.v2",
      "previousKeyServiceId": "service.ct",
      "nextKeyServiceId": "service.mrcp",
      "previousResultGate": {
        "id": "gate.pseudocyst.ct.1",
        "resultTypeId": "service.ct",
        "pendingLabel": "External contrast-enhanced CT pending",
        "resultNarrative": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ct.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.pseudocyst.ct.1",
        "resultTypeId": "service.mrcp",
        "pendingLabel": "MRI/MRCP assessment pending",
        "resultNarrative": "MRI shows a complete-walled collection apposed to the posterior stomach, containing dependent irregular nonliquid fragments among fluid. The patient continues to vomit after meals despite nutritional support. There is no current clinical sepsis or organ failure.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.mrcp.outsourced"
        ]
      },
      "reason": "A routine IV-contrast CT rule changes to choosing among different investigations for an unresolved intervention-planning question."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after necrotizing pancreatitis. Vomiting repeatedly stops meals, and oral intake has not recovered despite dietetic and enteral support.",
    "previousPresentation": "{patientName}, a 63-year-old woman, visits the clinic with vomiting after meals after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
    "previousProfilePresentations": [
      {
        "id": "profile.pancreatic-pseudocyst.postmeal-vomiting.female.63",
        "presentation": "{patientName}, a 63-year-old woman, visits the clinic with vomiting after meals after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      },
      {
        "id": "profile.pancreatic-pseudocyst.postmeal-vomiting.male.63",
        "presentation": "{patientName}, a 63-year-old man, visits the clinic with vomiting after meals after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      },
      {
        "id": "profile.pancreatic-pseudocyst.postmeal-vomiting.female.61",
        "presentation": "{patientName}, a 61-year-old woman, visits the clinic with vomiting after meals after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      },
      {
        "id": "profile.pancreatic-pseudocyst.postmeal-vomiting.male.61",
        "presentation": "{patientName}, a 61-year-old man, visits the clinic with vomiting after meals after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.pancreatic-pseudocyst.postmeal-vomiting",
        "patientPresentationVariantId": "presentation.pancreatic-pseudocyst.postmeal-vomiting",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedPresentation": "{patientName}, a 63-year-old woman, visits the clinic with vomiting after meals after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
        "revisedFields": [
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.postmeal-vomiting.female.63",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.postmeal-vomiting.female.63",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 63-year-old woman, visits the clinic with vomiting after meals after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.postmeal-vomiting.male.63",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.postmeal-vomiting.male.63",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 63-year-old man, visits the clinic with vomiting after meals after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.postmeal-vomiting.female.61",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.postmeal-vomiting.female.61",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 61-year-old woman, visits the clinic with vomiting after meals after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.postmeal-vomiting.male.61",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.postmeal-vomiting.male.61",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 61-year-old man, visits the clinic with vomiting after meals after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
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
        "ageYears": 63,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102c.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v7"
    }
  },
  {
    "id": "revision.qq20261102c.b34",
    "auditId": "B34",
    "caseId": "case.pancreatic-pseudocyst.persistent-pain",
    "nodeId": "node.pancreatic-pseudocyst.persistent-pain.2",
    "previousQuestionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v3.r3",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v3.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
    "previousChoiceLabels": [
      "Referral for endoscopic transmural drainage assessment",
      "Referral for percutaneous catheter drainage assessment",
      "Referral for operative internal drainage assessment",
      "Observation with nutritional support and repeat imaging"
    ],
    "previousCurrentUpdate": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Distinguish a partial communicating leak with upstream continuity from a disconnected duct. Then Select a duct-bridging approach when transmural apposition is absent, rather than applying a generic gastric drainage rule.",
    "reviewerNotes": "Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_2": "drain_2",
      "choice.qq20261102c.b34.d1": "choice.qq20261102a.b34.d1",
      "choice.qq20261102c.b34.d2": "choice.qq20261102a.b34.d2"
    },
    "choiceServiceOverrides": {
      "drain_2": null,
      "choice.qq20261102c.b34.d1": null,
      "choice.qq20261102c.b34.d2": null
    },
    "choiceTimingOverrides": {
      "drain_2": {
        "kind": "test",
        "timingProfileId": "timing.test.ercp"
      },
      "choice.qq20261102c.b34.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102c.b34.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.clinical_procedure"
      }
    },
    "currentUpdate": "MRCP shows a 4-cm fluid-only collection with a complete wall. A side leak communicates with it, while the main duct remains continuous into the upstream gland. Stomach and duodenum are separated from the collection by intervening bowel. Meal-related pain and reduced intake persist despite supportive care.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v3.r3",
      "whatChanged": "Replace four near-identical drainage referrals with arterial control, necrosis step-up, partial-leak bridging and disconnected-duct drainage decisions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B34",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The duct remains continuous beyond the leak; the small collection is not apposed to stomach/duodenum. The duct remains continuous beyond the leak; the small collection is not apposed to stomach/duodenum. Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. Source limits: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
          "fairness 2: Decision-critical basis is now explicit: The duct remains continuous beyond the leak; the small collection is not apposed to stomach/duodenum. Do not require every preprocedure safety step before referral; the new task asks about the particular returned finding that changes the next plan. The duct remains continuous beyond the leak; the small collection is not apposed to stomach/duodenum. Single-best claim is limited by: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
          "fairness 3: The old difficulty/shortcut is addressed by a consequential decision: Distinguish a partial communicating leak with upstream continuity from a disconnected duct. Then Select a duct-bridging approach when transmural apposition is absent, rather than applying a generic gastric drainage rule. Closest competing error: Use the familiar transmural drainage route despite interposed bowel and a bridgeable duct leak. Do not require every preprocedure safety step before referral; the new task asks about the particular returned finding that changes the next plan. The duct remains continuous beyond the leak; the small collection is not apposed to stomach/duodenum.",
          "fairness 4: The old difficulty/shortcut is addressed by a consequential decision: Distinguish a partial communicating leak with upstream continuity from a disconnected duct. Then Select a duct-bridging approach when transmural apposition is absent, rather than applying a generic gastric drainage rule. Closest competing error: Use the familiar transmural drainage route despite interposed bowel and a bridgeable duct leak. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. The duct remains continuous beyond the leak; the small collection is not apposed to stomach/duodenum."
        ],
        "suggestions": [
          "suggestions 1: Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. The duct remains continuous beyond the leak; the small collection is not apposed to stomach/duodenum. Concrete implementation: Distinguish a partial communicating leak with upstream continuity from a disconnected duct. Then Select a duct-bridging approach when transmural apposition is absent, rather than applying a generic gastric drainage rule. The closest error is: Use the familiar transmural drainage route despite interposed bowel and a bridgeable duct leak. Required clinical boundary: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
          "suggestions 2: Do not require every preprocedure safety step before referral; the new task asks about the particular returned finding that changes the next plan. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. Concrete implementation: Distinguish a partial communicating leak with upstream continuity from a disconnected duct. Then Select a duct-bridging approach when transmural apposition is absent, rather than applying a generic gastric drainage rule. The closest error is: Use the familiar transmural drainage route despite interposed bowel and a bridgeable duct leak. Required clinical boundary: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
          "suggestions 3: Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. Concrete implementation: Distinguish a partial communicating leak with upstream continuity from a disconnected duct. Then Select a duct-bridging approach when transmural apposition is absent, rather than applying a generic gastric drainage rule. The closest error is: Use the familiar transmural drainage route despite interposed bowel and a bridgeable duct leak. Required clinical boundary: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee."
        ]
      },
      "selfCheck": {
        "cueAttack": "The four siblings require different treatment sequences, not a repeated apposed-fluid rule. Actual failure of meals/support and/or blood loss supplies the decision burden; no size-only intervention threshold or timing-based shortcut.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Distinguish a partial communicating leak with upstream continuity from a disconnected duct.",
          "Select a duct-bridging approach when transmural apposition is absent, rather than applying a generic gastric drainage rule."
        ],
        "oneBestAnswer": "The duct remains continuous beyond the leak; the small collection is not apposed to stomach/duodenum.",
        "closestDistractor": "Use the familiar transmural drainage route despite interposed bowel and a bridgeable duct leak.",
        "remainingReview": "Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.symptomatic-endoscopic-drainage.v3.r4",
      "conceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage.v2",
      "stem": "Which drainage plan should be discussed for {patientName}?",
      "answerChoices": [
        {
          "id": "drain_2",
          "label": "Transpapillary pancreatic duct stenting",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A small communicating collection with a continuous upstream duct and no safe apposition can be considered for a transpapillary bridging approach."
        },
        {
          "id": "choice.qq20261102c.b34.d1",
          "label": "Transmural drainage of the collection",
          "isCorrect": false,
          "distractorRationale": "The actual path lacks safe apposition; a visible collection does not by itself provide a suitable transmural route."
        },
        {
          "id": "choice.qq20261102c.b34.d2",
          "label": "Percutaneous drainage of the collection",
          "isCorrect": false,
          "distractorRationale": "This may leave ongoing pancreatic leakage and an external fistula; it does not use the bridgeable duct anatomy supplied."
        }
      ],
      "explanation": "Distinguish a partial communicating leak with upstream continuity from a disconnected duct. Select a duct-bridging approach when transmural apposition is absent, rather than applying a generic gastric drainage rule. The symptom trajectory supplies an intervention problem, but the collection label alone does not determine the route or sequence. Decisions depend on the reported vascular, contents and duct anatomy.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.early.pseudocyst.symptomatic-endoscopic-drainage",
        "claim.qq20261102a.collection-symptom-attribution",
        "claim.qq20261102c.pancreatic-duct-mapping",
        "claim.qq20261102c.pancreatic-partial-leak-bridge"
      ],
      "teachingPoint": "Distinguish a partial communicating leak with upstream continuity from a disconnected duct. Select a duct-bridging approach when transmural apposition is absent, rather than applying a generic gastric drainage rule. The symptom trajectory supplies an intervention problem, but the collection label alone does not determine the route or sequence. Decisions depend on the reported vascular, contents and duct anatomy."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage",
      "nextConceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "A generic pseudocyst drainage-referral rule changes materially to sequencing treatment for vascular/necrotic or duct-related complications."
    }
  },
  {
    "id": "revision.qq20261102c.b34-context",
    "auditId": "B34-context",
    "caseId": "case.pancreatic-pseudocyst.persistent-pain",
    "nodeId": "node.pancreatic-pseudocyst.persistent-pain.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v3.r4",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v3.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which CT protocol should be requested for {patientName}'s ongoing upper-abdominal symptoms?",
    "previousChoiceLabels": [
      "Abdominal CT: intravenous contrast given; oral contrast omitted",
      "Abdominal CT: intravenous contrast omitted; oral contrast given",
      "Abdominal CT: intravenous contrast omitted; oral contrast omitted"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Identify duct continuity as the unresolved variable that changes the route. Then Use noninvasive duct mapping before committing to diagnostic/therapeutic ERCP.",
    "reviewerNotes": "Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_2": "ct_2",
      "choice.qq20261102c.b34-context.d1": "choice.qq20261102b.b34-context.d1",
      "choice.qq20261102c.b34-context.d2": "choice.qq20261102b.b34-context.d2"
    },
    "choiceServiceOverrides": {
      "ct_2": "service.mrcp",
      "choice.qq20261102c.b34-context.d1": "service.ct",
      "choice.qq20261102c.b34-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_2": {
        "kind": "test",
        "timingProfileId": "timing.test.mrcp"
      },
      "choice.qq20261102c.b34-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102c.b34-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ercp"
      }
    },
    "currentUpdate": "The outside CT shows a walled 4-cm fluid collection separated from the stomach and duodenum by intervening bowel. The main pancreatic duct is visible on both sides of the region, but the CT does not show whether its lumen remains continuous or communicates with the collection.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.contrast-ct-characterization.v3.r4",
      "whatChanged": "Replace four identical contrast-route questions with vascular, contents and duct-continuity applications paired to different treatment decisions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B34-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Remove the oral-contrast omission assertion and all rejected basic metadata. Use an explicit new concept version and, for three siblings, the existing MRCP service/gate instead of falsely returning MRCP findings from a CT-only order. New inference, rather than a substitute cue: CT has already mapped the collection and intervening bowel, but not duct continuity/communication. Attack: Replace the IV-given versus IV-omitted outlier with actual prior acquisition data and three plausible investigation plans. No universal claim about oral contrast is retained."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: CT has already mapped the collection and intervening bowel, but not duct continuity/communication. Remove the oral-contrast omission assertion and all rejected basic metadata. Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence. Source limits: Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Identify duct continuity as the unresolved variable that changes the route. Then Use noninvasive duct mapping before committing to diagnostic/therapeutic ERCP. Closest competing error: Repeat portal-venous CT using the same acquisition and field Remove the oral-contrast omission assertion and all rejected basic metadata. Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: A routine IV-contrast CT rule changes to choosing among different investigations for an unresolved intervention-planning question."
        ],
        "suggestions": [
          "suggestions 1: CT has already mapped the collection and intervening bowel, but not duct continuity/communication. Remove the oral-contrast omission assertion and all rejected basic metadata. Concrete implementation: Identify duct continuity as the unresolved variable that changes the route. Then Use noninvasive duct mapping before committing to diagnostic/therapeutic ERCP. The closest error is: Repeat portal-venous CT using the same acquisition and field Required clinical boundary: Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
          "suggestions 2: CT has already mapped the collection and intervening bowel, but not duct continuity/communication. Remove the oral-contrast omission assertion and all rejected basic metadata. Concrete implementation: Identify duct continuity as the unresolved variable that changes the route. Then Use noninvasive duct mapping before committing to diagnostic/therapeutic ERCP. The closest error is: Repeat portal-venous CT using the same acquisition and field Required clinical boundary: Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored."
        ]
      },
      "selfCheck": {
        "cueAttack": "Replace the IV-given versus IV-omitted outlier with actual prior acquisition data and three plausible investigation plans. No universal claim about oral contrast is retained.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Identify duct continuity as the unresolved variable that changes the route.",
          "Use noninvasive duct mapping before committing to diagnostic/therapeutic ERCP."
        ],
        "oneBestAnswer": "CT has already mapped the collection and intervening bowel, but not duct continuity/communication.",
        "closestDistractor": "Repeat portal-venous CT using the same acquisition and field",
        "remainingReview": "Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v3.r5",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization.v2",
      "stem": "Which investigation plan should be arranged for {patientName}'s returned CT findings?",
      "answerChoices": [
        {
          "id": "ct_2",
          "label": "Pancreatic MRI with MRCP",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Duct communication and partial versus complete interruption change the choice of drainage route; obtain noninvasive mapping first."
        },
        {
          "id": "choice.qq20261102c.b34-context.d1",
          "label": "Repeat contrast-enhanced CT",
          "isCorrect": false,
          "distractorRationale": "The existing CT already provides the relevant wall and surrounding-organ information but does not resolve the duct question."
        },
        {
          "id": "choice.qq20261102c.b34-context.d2",
          "label": "Endoscopic retrograde pancreatography",
          "isCorrect": false,
          "distractorRationale": "Diagnostic ERCP adds procedural risk before the duct anatomy and likelihood of a therapeutic target are established."
        }
      ],
      "explanation": "Identify duct continuity as the unresolved variable that changes the route. Use noninvasive duct mapping before committing to diagnostic/therapeutic ERCP. The selected acquisition must answer the actual unresolved vascular, contents or duct question; repeating an existing modality label is not completion of that assessment.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.qq20261102a.pancreatic-contrast-characterization",
        "claim.qq20261102c.pancreatic-duct-mapping",
        "claim.qq20261102c.pancreatic-partial-leak-bridge"
      ],
      "teachingPoint": "Identify duct continuity as the unresolved variable that changes the route. Use noninvasive duct mapping before committing to diagnostic/therapeutic ERCP. The selected acquisition must answer the actual unresolved vascular, contents or duct question; repeating an existing modality label is not completion of that assessment."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pseudocyst.contrast-ct-characterization",
      "nextConceptId": "concept.pseudocyst.contrast-ct-characterization.v2",
      "previousKeyServiceId": "service.ct",
      "nextKeyServiceId": "service.mrcp",
      "previousResultGate": {
        "id": "gate.pseudocyst.ct.2",
        "resultTypeId": "service.ct",
        "pendingLabel": "External contrast-enhanced CT pending",
        "resultNarrative": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ct.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.pseudocyst.ct.2",
        "resultTypeId": "service.mrcp",
        "pendingLabel": "MRI/MRCP assessment pending",
        "resultNarrative": "MRCP shows a 4-cm fluid-only collection with a complete wall. A side leak communicates with it, while the main duct remains continuous into the upstream gland. Stomach and duodenum are separated from the collection by intervening bowel. Meal-related pain and reduced intake persist despite supportive care.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.mrcp.outsourced"
        ]
      },
      "reason": "A routine IV-contrast CT rule changes to choosing among different investigations for an unresolved intervention-planning question."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after pancreatitis with persistent meal-related upper-abdominal pain. Usual meals remain incomplete despite dietetic support.",
    "previousPresentation": "{patientName}, a 44-year-old woman, visits the clinic with meal-related upper-abdominal pain and vomiting after interstitial edematous pancreatitis. Meals are repeatedly stopped after a few mouthfuls because of pain and fullness; the patient cannot maintain the usual food intake.",
    "previousProfilePresentations": [
      {
        "id": "profile.pancreatic-pseudocyst.persistent-pain.female.44",
        "presentation": "{patientName}, a 44-year-old woman, visits the clinic with meal-related upper-abdominal pain and vomiting after interstitial edematous pancreatitis. Meals are repeatedly stopped after a few mouthfuls because of pain and fullness; the patient cannot maintain the usual food intake."
      },
      {
        "id": "profile.pancreatic-pseudocyst.persistent-pain.male.44",
        "presentation": "{patientName}, a 44-year-old man, visits the clinic with meal-related upper-abdominal pain and vomiting after interstitial edematous pancreatitis. Meals are repeatedly stopped after a few mouthfuls because of pain and fullness; the patient cannot maintain the usual food intake."
      },
      {
        "id": "profile.pancreatic-pseudocyst.persistent-pain.female.46",
        "presentation": "{patientName}, a 46-year-old woman, visits the clinic with meal-related upper-abdominal pain and vomiting after interstitial edematous pancreatitis. Meals are repeatedly stopped after a few mouthfuls because of pain and fullness; the patient cannot maintain the usual food intake."
      },
      {
        "id": "profile.pancreatic-pseudocyst.persistent-pain.male.46",
        "presentation": "{patientName}, a 46-year-old man, visits the clinic with meal-related upper-abdominal pain and vomiting after interstitial edematous pancreatitis. Meals are repeatedly stopped after a few mouthfuls because of pain and fullness; the patient cannot maintain the usual food intake."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.pancreatic-pseudocyst.persistent-pain",
        "patientPresentationVariantId": "presentation.pancreatic-pseudocyst.persistent-pain",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedPresentation": "{patientName}, a 44-year-old woman, visits the clinic with meal-related upper-abdominal pain and vomiting after interstitial edematous pancreatitis. Meals are repeatedly stopped after a few mouthfuls because of pain and fullness; the patient cannot maintain the usual food intake.",
        "revisedFields": [
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102a.profile.pancreatic-pseudocyst.persistent-pain.female.44",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.persistent-pain.female.44",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 44-year-old woman, visits the clinic with meal-related upper-abdominal pain and vomiting after interstitial edematous pancreatitis. Meals are repeatedly stopped after a few mouthfuls because of pain and fullness; the patient cannot maintain the usual food intake.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.pancreatic-pseudocyst.persistent-pain.male.44",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.persistent-pain.male.44",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 44-year-old man, visits the clinic with meal-related upper-abdominal pain and vomiting after interstitial edematous pancreatitis. Meals are repeatedly stopped after a few mouthfuls because of pain and fullness; the patient cannot maintain the usual food intake.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.pancreatic-pseudocyst.persistent-pain.female.46",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.persistent-pain.female.46",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 46-year-old woman, visits the clinic with meal-related upper-abdominal pain and vomiting after interstitial edematous pancreatitis. Meals are repeatedly stopped after a few mouthfuls because of pain and fullness; the patient cannot maintain the usual food intake.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.pancreatic-pseudocyst.persistent-pain.male.46",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.persistent-pain.male.46",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 46-year-old man, visits the clinic with meal-related upper-abdominal pain and vomiting after interstitial edematous pancreatitis. Meals are repeatedly stopped after a few mouthfuls because of pain and fullness; the patient cannot maintain the usual food intake.",
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
        "ageYears": 44,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102c.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v7"
    }
  },
  {
    "id": "revision.qq20261102c.b35",
    "auditId": "B35",
    "caseId": "case.pancreatic-pseudocyst.reduced-intake",
    "nodeId": "node.pancreatic-pseudocyst.reduced-intake.2",
    "previousQuestionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v4.r3",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
    "previousChoiceLabels": [
      "Referral for endoscopic transmural drainage assessment",
      "Referral for percutaneous catheter drainage assessment",
      "Referral for operative internal drainage assessment",
      "Observation with nutritional support and repeat imaging"
    ],
    "previousCurrentUpdate": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Infer a disconnected upstream pancreatic source rather than a partial bridgeable leak. Then Plan persistent internal drainage instead of repeating transient decompression or assuming ERCP can bridge the gap.",
    "reviewerNotes": "Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_3": "drain_3",
      "choice.qq20261102c.b35.d1": "choice.qq20261102a.b35.d1",
      "choice.qq20261102c.b35.d2": "choice.qq20261102a.b35.d2"
    },
    "choiceServiceOverrides": {
      "drain_3": null,
      "choice.qq20261102c.b35.d1": null,
      "choice.qq20261102c.b35.d2": null
    },
    "choiceTimingOverrides": {
      "drain_3": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102c.b35.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102c.b35.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ercp"
      }
    },
    "currentUpdate": "MRCP shows an enhancing viable pancreatic tail with a dilated duct ending at the recurrent collection. The duct from the ampulla ends on the other side of the intervening necrotic segment; no connecting segment is demonstrated. The collection is completely walled and apposed to the posterior stomach. Fullness again prevents normal food intake.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v4.r3",
      "whatChanged": "Replace four near-identical drainage referrals with arterial control, necrosis step-up, partial-leak bridging and disconnected-duct drainage decisions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B35",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: Viable upstream gland drains into a recurrent collection without a demonstrated duct connection to the downstream gland. Viable upstream gland drains into a recurrent collection without a demonstrated duct connection to the downstream gland. Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. Source limits: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Infer a disconnected upstream pancreatic source rather than a partial bridgeable leak. Then Plan persistent internal drainage instead of repeating transient decompression or assuming ERCP can bridge the gap. Closest competing error: Choose an ERCP bridge by treating complete disconnection as the partial leak in the other sibling. Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. Do not require every preprocedure safety step before referral; the new task asks about the particular returned finding that changes the next plan.",
          "fairness 3: The old difficulty/shortcut is addressed by a consequential decision: Infer a disconnected upstream pancreatic source rather than a partial bridgeable leak. Then Plan persistent internal drainage instead of repeating transient decompression or assuming ERCP can bridge the gap. Closest competing error: Choose an ERCP bridge by treating complete disconnection as the partial leak in the other sibling. Do not require every preprocedure safety step before referral; the new task asks about the particular returned finding that changes the next plan. Viable upstream gland drains into a recurrent collection without a demonstrated duct connection to the downstream gland.",
          "fairness 4: The old difficulty/shortcut is addressed by a consequential decision: Infer a disconnected upstream pancreatic source rather than a partial bridgeable leak. Then Plan persistent internal drainage instead of repeating transient decompression or assuming ERCP can bridge the gap. Closest competing error: Choose an ERCP bridge by treating complete disconnection as the partial leak in the other sibling. Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. Viable upstream gland drains into a recurrent collection without a demonstrated duct connection to the downstream gland."
        ],
        "suggestions": [
          "suggestions 1: Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. Viable upstream gland drains into a recurrent collection without a demonstrated duct connection to the downstream gland. Concrete implementation: Infer a disconnected upstream pancreatic source rather than a partial bridgeable leak. Then Plan persistent internal drainage instead of repeating transient decompression or assuming ERCP can bridge the gap. The closest error is: Choose an ERCP bridge by treating complete disconnection as the partial leak in the other sibling. Required clinical boundary: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
          "suggestions 2: Do not require every preprocedure safety step before referral; the new task asks about the particular returned finding that changes the next plan. Viable upstream gland drains into a recurrent collection without a demonstrated duct connection to the downstream gland. Concrete implementation: Infer a disconnected upstream pancreatic source rather than a partial bridgeable leak. Then Plan persistent internal drainage instead of repeating transient decompression or assuming ERCP can bridge the gap. The closest error is: Choose an ERCP bridge by treating complete disconnection as the partial leak in the other sibling. Required clinical boundary: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee.",
          "suggestions 3: Specify observed symptom/feeding trajectory rather than assume any fullness requires intervention. Viable upstream gland drains into a recurrent collection without a demonstrated duct connection to the downstream gland. Concrete implementation: Infer a disconnected upstream pancreatic source rather than a partial bridgeable leak. Then Plan persistent internal drainage instead of repeating transient decompression or assuming ERCP can bridge the gap. The closest error is: Choose an ERCP bridge by treating complete disconnection as the partial leak in the other sibling. Required clinical boundary: Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee."
        ]
      },
      "selfCheck": {
        "cueAttack": "The four siblings require different treatment sequences, not a repeated apposed-fluid rule. Actual failure of meals/support and/or blood loss supplies the decision burden; no size-only intervention threshold or timing-based shortcut.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Infer a disconnected upstream pancreatic source rather than a partial bridgeable leak.",
          "Plan persistent internal drainage instead of repeating transient decompression or assuming ERCP can bridge the gap."
        ],
        "oneBestAnswer": "Viable upstream gland drains into a recurrent collection without a demonstrated duct connection to the downstream gland.",
        "closestDistractor": "Choose an ERCP bridge by treating complete disconnection as the partial leak in the other sibling.",
        "remainingReview": "Pancreatic/IR clinician must verify unique ranking and technique. Complete versus partial duct interruption and the viability/extent of debris need clinical review; long-term stent guidance rests on low-quality evidence, not a universal cure guarantee."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.symptomatic-endoscopic-drainage.v4.r4",
      "conceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage.v2",
      "stem": "Which endoscopic plan should be discussed for {patientName}'s recurrent collection?",
      "answerChoices": [
        {
          "id": "drain_3",
          "label": "Transmural drainage with planned long-term plastic-stent drainage",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A symptomatic recurrent collection supplied by a disconnected viable upstream gland favors continued internal drainage rather than assuming a short drainage course cures the source."
        },
        {
          "id": "choice.qq20261102c.b35.d1",
          "label": "Transpapillary stenting intended to bridge the separated duct ends",
          "isCorrect": false,
          "distractorRationale": "Complete disconnection is different from a partial leak with upstream continuity; a presumed bridging route does not resolve the supplied anatomy."
        },
        {
          "id": "choice.qq20261102c.b35.d2",
          "label": "Temporary transmural drainage with removal once the fluid collapses",
          "isCorrect": false,
          "distractorRationale": "This repeats the short-course assumption despite recurrence and an ongoing disconnected upstream source."
        }
      ],
      "explanation": "Infer a disconnected upstream pancreatic source rather than a partial bridgeable leak. Plan persistent internal drainage instead of repeating transient decompression or assuming ERCP can bridge the gap. The symptom trajectory supplies an intervention problem, but the collection label alone does not determine the route or sequence. Decisions depend on the reported vascular, contents and duct anatomy.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.early.pseudocyst.symptomatic-endoscopic-drainage",
        "claim.qq20261102c.pancreatic-duct-mapping",
        "claim.qq20261102c.pancreatic-disconnected-long-term-drainage"
      ],
      "teachingPoint": "Infer a disconnected upstream pancreatic source rather than a partial bridgeable leak. Plan persistent internal drainage instead of repeating transient decompression or assuming ERCP can bridge the gap. The symptom trajectory supplies an intervention problem, but the collection label alone does not determine the route or sequence. Decisions depend on the reported vascular, contents and duct anatomy."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage",
      "nextConceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "A generic pseudocyst drainage-referral rule changes materially to sequencing treatment for vascular/necrotic or duct-related complications."
    }
  },
  {
    "id": "revision.qq20261102c.b35-context",
    "auditId": "B35-context",
    "caseId": "case.pancreatic-pseudocyst.reduced-intake",
    "nodeId": "node.pancreatic-pseudocyst.reduced-intake.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v4.r4",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v4.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which CT protocol should be requested for {patientName}'s ongoing upper-abdominal symptoms?",
    "previousChoiceLabels": [
      "Abdominal CT: intravenous contrast given; oral contrast omitted",
      "Abdominal CT: intravenous contrast omitted; oral contrast given",
      "Abdominal CT: intravenous contrast omitted; oral contrast omitted"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Use recurrence and the viable upstream gland to recognize why anatomy matters more than collection size alone. Then Map continuity noninvasively before selecting another duct/transmural strategy.",
    "reviewerNotes": "Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_3": "ct_3",
      "choice.qq20261102c.b35-context.d1": "choice.qq20261102b.b35-context.d1",
      "choice.qq20261102c.b35-context.d2": "choice.qq20261102b.b35-context.d2"
    },
    "choiceServiceOverrides": {
      "ct_3": "service.mrcp",
      "choice.qq20261102c.b35-context.d1": "service.ct",
      "choice.qq20261102c.b35-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_3": {
        "kind": "test",
        "timingProfileId": "timing.test.mrcp"
      },
      "choice.qq20261102c.b35-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102c.b35-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ercp"
      }
    },
    "currentUpdate": "CT shows a recurrent fluid collection against the posterior stomach and enhancing pancreatic tissue in the tail beyond the prior necrotic segment. The former drain fluid had pancreatic-enzyme activity far above the serum sample. The CT does not trace a duct connection from the tail to the downstream gland.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.contrast-ct-characterization.v4.r4",
      "whatChanged": "Replace four identical contrast-route questions with vascular, contents and duct-continuity applications paired to different treatment decisions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B35-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Remove the oral-contrast omission assertion and all rejected basic metadata. Use an explicit new concept version and, for three siblings, the existing MRCP service/gate instead of falsely returning MRCP findings from a CT-only order. New inference, rather than a substitute cue: CT shows viable upstream tissue and recurrence, but not continuity; pancreatic-enzyme-rich fluid supports an ongoing duct-source question. Attack: Replace the IV-given versus IV-omitted outlier with actual prior acquisition data and three plausible investigation plans. No universal claim about oral contrast is retained."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: CT shows viable upstream tissue and recurrence, but not continuity; pancreatic-enzyme-rich fluid supports an ongoing duct-source question. Remove the oral-contrast omission assertion and all rejected basic metadata. Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence. Source limits: Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Use recurrence and the viable upstream gland to recognize why anatomy matters more than collection size alone. Then Map continuity noninvasively before selecting another duct/transmural strategy. Closest competing error: Repeat the same CT and choose a larger drain from collection diameter alone Remove the oral-contrast omission assertion and all rejected basic metadata. Delete the generic permission sentence that names the keyed test; no introduced device, contrast reaction or organ failure requires that sentence.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: A routine IV-contrast CT rule changes to choosing among different investigations for an unresolved intervention-planning question."
        ],
        "suggestions": [
          "suggestions 1: CT shows viable upstream tissue and recurrence, but not continuity; pancreatic-enzyme-rich fluid supports an ongoing duct-source question. Remove the oral-contrast omission assertion and all rejected basic metadata. Concrete implementation: Use recurrence and the viable upstream gland to recognize why anatomy matters more than collection size alone. Then Map continuity noninvasively before selecting another duct/transmural strategy. The closest error is: Repeat the same CT and choose a larger drain from collection diameter alone Required clinical boundary: Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored.",
          "suggestions 2: CT shows viable upstream tissue and recurrence, but not continuity; pancreatic-enzyme-rich fluid supports an ongoing duct-source question. Remove the oral-contrast omission assertion and all rejected basic metadata. Concrete implementation: Use recurrence and the viable upstream gland to recognize why anatomy matters more than collection size alone. Then Map continuity noninvasively before selecting another duct/transmural strategy. The closest error is: Repeat the same CT and choose a larger drain from collection diameter alone Required clinical boundary: Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored."
        ]
      },
      "selfCheck": {
        "cueAttack": "Replace the IV-given versus IV-omitted outlier with actual prior acquisition data and three plausible investigation plans. No universal claim about oral contrast is retained.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Use recurrence and the viable upstream gland to recognize why anatomy matters more than collection size alone.",
          "Map continuity noninvasively before selecting another duct/transmural strategy."
        ],
        "oneBestAnswer": "CT shows viable upstream tissue and recurrence, but not continuity; pancreatic-enzyme-rich fluid supports an ongoing duct-source question.",
        "closestDistractor": "Repeat the same CT and choose a larger drain from collection diameter alone",
        "remainingReview": "Pancreatic radiology/endoscopy clinician must verify modality/protocol ranking and eligibility. Secretin, where useful, is not made a mandatory unprovided resource; no dose or scan-phase time is authored."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v4.r5",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization.v2",
      "stem": "Which investigation should guide {patientName}'s next drainage plan?",
      "answerChoices": [
        {
          "id": "ct_3",
          "label": "Pancreatic MRI with MRCP",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Recurrence, pancreatic drainage and a viable upstream gland make duct continuity consequential; MRCP can assess it noninvasively."
        },
        {
          "id": "choice.qq20261102c.b35-context.d1",
          "label": "Repeat contrast-enhanced CT",
          "isCorrect": false,
          "distractorRationale": "A larger drain does not resolve whether an ongoing disconnected upstream source exists."
        },
        {
          "id": "choice.qq20261102c.b35-context.d2",
          "label": "Endoscopic retrograde pancreatography",
          "isCorrect": false,
          "distractorRationale": "Upstream tissue on CT is not proof of a bridgeable duct; assess the anatomy rather than assume continuity."
        }
      ],
      "explanation": "Use recurrence and the viable upstream gland to recognize why anatomy matters more than collection size alone. Map continuity noninvasively before selecting another duct/transmural strategy. The selected acquisition must answer the actual unresolved vascular, contents or duct question; repeating an existing modality label is not completion of that assessment.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.qq20261102a.pancreatic-contrast-characterization",
        "claim.qq20261102c.pancreatic-duct-mapping",
        "claim.qq20261102c.pancreatic-disconnected-long-term-drainage"
      ],
      "teachingPoint": "Use recurrence and the viable upstream gland to recognize why anatomy matters more than collection size alone. Map continuity noninvasively before selecting another duct/transmural strategy. The selected acquisition must answer the actual unresolved vascular, contents or duct question; repeating an existing modality label is not completion of that assessment."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pseudocyst.contrast-ct-characterization",
      "nextConceptId": "concept.pseudocyst.contrast-ct-characterization.v2",
      "previousKeyServiceId": "service.ct",
      "nextKeyServiceId": "service.mrcp",
      "previousResultGate": {
        "id": "gate.pseudocyst.ct.3",
        "resultTypeId": "service.ct",
        "pendingLabel": "External contrast-enhanced CT pending",
        "resultNarrative": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ct.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.pseudocyst.ct.3",
        "resultTypeId": "service.mrcp",
        "pendingLabel": "MRI/MRCP assessment pending",
        "resultNarrative": "MRCP shows an enhancing viable pancreatic tail with a dilated duct ending at the recurrent collection. The duct from the ampulla ends on the other side of the intervening necrotic segment; no connecting segment is demonstrated. The collection is completely walled and apposed to the posterior stomach. Fullness again prevents normal food intake.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.mrcp.outsourced"
        ]
      },
      "reason": "A routine IV-contrast CT rule changes to choosing among different investigations for an unresolved intervention-planning question."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with recurrent fullness and reduced intake after necrotizing pancreatitis. A collection that collapsed during temporary drainage has reaccumulated after drain removal.",
    "previousPresentation": "{patientName}, a 56-year-old woman, visits the clinic with early fullness and reduced food intake after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
    "previousProfilePresentations": [
      {
        "id": "profile.pancreatic-pseudocyst.reduced-intake.female.56",
        "presentation": "{patientName}, a 56-year-old woman, visits the clinic with early fullness and reduced food intake after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      },
      {
        "id": "profile.pancreatic-pseudocyst.reduced-intake.male.56",
        "presentation": "{patientName}, a 56-year-old man, visits the clinic with early fullness and reduced food intake after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      },
      {
        "id": "profile.pancreatic-pseudocyst.reduced-intake.female.58",
        "presentation": "{patientName}, a 58-year-old woman, visits the clinic with early fullness and reduced food intake after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      },
      {
        "id": "profile.pancreatic-pseudocyst.reduced-intake.male.58",
        "presentation": "{patientName}, a 58-year-old man, visits the clinic with early fullness and reduced food intake after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.pancreatic-pseudocyst.reduced-intake",
        "patientPresentationVariantId": "presentation.pancreatic-pseudocyst.reduced-intake",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedPresentation": "{patientName}, a 56-year-old woman, visits the clinic with early fullness and reduced food intake after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
        "revisedFields": [
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.reduced-intake.female.56",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.reduced-intake.female.56",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 56-year-old woman, visits the clinic with early fullness and reduced food intake after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.reduced-intake.male.56",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.reduced-intake.male.56",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 56-year-old man, visits the clinic with early fullness and reduced food intake after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.reduced-intake.female.58",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.reduced-intake.female.58",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 58-year-old woman, visits the clinic with early fullness and reduced food intake after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.reduced-intake.male.58",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.reduced-intake.male.58",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 58-year-old man, visits the clinic with early fullness and reduced food intake after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
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
        "ageYears": 56,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102c.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v7"
    }
  },
  {
    "id": "revision.qq20261102c.b36",
    "auditId": "B36",
    "caseId": "case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
    "nodeId": "node.gs028se.pdsa-act-qi-measures.a-abandon-harm.1",
    "previousQuestionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r4",
    "questionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which modification should {patientName}'s team compare in the next small PDSA test?",
    "previousChoiceLabels": [
      "Prefill medication fields; retain escalation prompts",
      "Shorten escalation prompts; retain manual medication-field entry",
      "Repeat escalation training; retain manual medication-field entry"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "table",
      "caption": "Constructed observations from the same small test; minutes are totals across ten observed uses.",
      "columnHeaders": [
        "Previous process",
        "Current form",
        "Entries agreeing with the clinical record"
      ],
      "rowHeaders": [
        "Medication-list entry: total minutes",
        "Escalation-plan entry: total minutes",
        "Follow-up booking: total minutes",
        "Unplanned repeat contacts in the next 20 visits"
      ],
      "cells": [
        [
          "10",
          "50",
          "10/10"
        ],
        [
          "20",
          "20",
          "10/10"
        ],
        [
          "10",
          "10",
          "10/10"
        ],
        [
          "8",
          "8",
          "Not applicable"
        ]
      ]
    },
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Use the stage-specific times to identify form re-entry as the adaptation target rather than reconciliation or final review. Then Choose a comparison of the actual manual process with automatic entry that preserves the clinical source, instead of confounding source freshness with entry method.",
    "reviewerNotes": "QI reviewer must verify the best next local test and feasible imports. Source and workflow observations are constructed; this is not a mandate for one-factor-at-a-time testing in every PDSA cycle or proof of software benefit.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_abandon-harm": "correct_abandon-harm",
      "choice.qq20261102c.b36.d1": "choice.qq20261102b.b36.d1",
      "choice.qq20261102c.b36.d2": "choice.qq20261102b.b36.d2"
    },
    "choiceServiceOverrides": {
      "correct_abandon-harm": null,
      "choice.qq20261102c.b36.d1": null,
      "choice.qq20261102c.b36.d2": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r4",
      "whatChanged": "Replace source-choice matching with a controlled next-cycle comparison: interpret the workload stage, then separate an entry-method change from a simultaneous clinical-source change. The existing adopt/adapt/define-next-cycle objective is retained.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B36",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Offer three natural workflow comparisons: same-source method change, simultaneous method/source change, and source-only change. Show the actual current manual process, two available record sources, their timing and both import capabilities. New inference, rather than a substitute cue: The added work is after signed-list review, the existing manual process uses that list, and the dispensing record differs in its prescriptions. Attack: The task asks for the next comparison rather than preselecting a prefill source. All options use concrete sources and entry modes; multiple alternatives import the visit list, so its freshness cannot identify the key by word matching alone. No causal-effect teaching appears before the answer.",
          "cues 2: The cited wording is absent from the new visible fields. Offer three natural workflow comparisons: same-source method change, simultaneous method/source change, and source-only change. Show the actual current manual process, two available record sources, their timing and both import capabilities. New inference, rather than a substitute cue: The added work is after signed-list review, the existing manual process uses that list, and the dispensing record differs in its prescriptions. Attack: The task asks for the next comparison rather than preselecting a prefill source. All options use concrete sources and entry modes; multiple alternatives import the visit list, so its freshness cannot identify the key by word matching alone. No causal-effect teaching appears before the answer.",
          "cues 3: The cited wording is absent from the new visible fields. Remove the preselected-prefill lead-in and implementation/privacy wording in the exhibit caption; keep the inference and causal limitation in feedback. Show the actual current manual process, two available record sources, their timing and both import capabilities. New inference, rather than a substitute cue: The added work is after signed-list review, the existing manual process uses that list, and the dispensing record differs in its prescriptions. Attack: The task asks for the next comparison rather than preselecting a prefill source. All options use concrete sources and entry modes; multiple alternatives import the visit list, so its freshness cannot identify the key by word matching alone. No causal-effect teaching appears before the answer."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: The added work is after signed-list review, the existing manual process uses that list, and the dispensing record differs in its prescriptions. Offer three natural workflow comparisons: same-source method change, simultaneous method/source change, and source-only change. Remove the preselected-prefill lead-in and implementation/privacy wording in the exhibit caption; keep the inference and causal limitation in feedback. Source limits: QI reviewer must verify the best next local test and feasible imports. Source and workflow observations are constructed; this is not a mandate for one-factor-at-a-time testing in every PDSA cycle or proof of software benefit.",
          "fairness 2: Decision-critical basis is now explicit: The added work is after signed-list review, the existing manual process uses that list, and the dispensing record differs in its prescriptions. Offer three natural workflow comparisons: same-source method change, simultaneous method/source change, and source-only change. Remove the preselected-prefill lead-in and implementation/privacy wording in the exhibit caption; keep the inference and causal limitation in feedback. Single-best claim is limited by: QI reviewer must verify the best next local test and feasible imports. Source and workflow observations are constructed; this is not a mandate for one-factor-at-a-time testing in every PDSA cycle or proof of software benefit.",
          "fairness 3: The old difficulty/shortcut is addressed by a consequential decision: Use the stage-specific times to identify form re-entry as the adaptation target rather than reconciliation or final review. Then Choose a comparison of the actual manual process with automatic entry that preserves the clinical source, instead of confounding source freshness with entry method. Closest competing error: Compare stale dispensing/manual data with current-list automatic entry and attribute the whole difference to automation. Show the actual current manual process, two available record sources, their timing and both import capabilities. Offer three natural workflow comparisons: same-source method change, simultaneous method/source change, and source-only change."
        ],
        "suggestions": [
          "suggestions 1: Show the actual current manual process, two available record sources, their timing and both import capabilities. Offer three natural workflow comparisons: same-source method change, simultaneous method/source change, and source-only change. Concrete implementation: Use the stage-specific times to identify form re-entry as the adaptation target rather than reconciliation or final review. Then Choose a comparison of the actual manual process with automatic entry that preserves the clinical source, instead of confounding source freshness with entry method. The closest error is: Compare stale dispensing/manual data with current-list automatic entry and attribute the whole difference to automation. Required clinical boundary: QI reviewer must verify the best next local test and feasible imports. Source and workflow observations are constructed; this is not a mandate for one-factor-at-a-time testing in every PDSA cycle or proof of software benefit.",
          "suggestions 2: Offer three natural workflow comparisons: same-source method change, simultaneous method/source change, and source-only change. Show the actual current manual process, two available record sources, their timing and both import capabilities. Concrete implementation: Use the stage-specific times to identify form re-entry as the adaptation target rather than reconciliation or final review. Then Choose a comparison of the actual manual process with automatic entry that preserves the clinical source, instead of confounding source freshness with entry method. The closest error is: Compare stale dispensing/manual data with current-list automatic entry and attribute the whole difference to automation. Required clinical boundary: QI reviewer must verify the best next local test and feasible imports. Source and workflow observations are constructed; this is not a mandate for one-factor-at-a-time testing in every PDSA cycle or proof of software benefit.",
          "suggestions 3: Remove the preselected-prefill lead-in and implementation/privacy wording in the exhibit caption; keep the inference and causal limitation in feedback. Show the actual current manual process, two available record sources, their timing and both import capabilities. Concrete implementation: Use the stage-specific times to identify form re-entry as the adaptation target rather than reconciliation or final review. Then Choose a comparison of the actual manual process with automatic entry that preserves the clinical source, instead of confounding source freshness with entry method. The closest error is: Compare stale dispensing/manual data with current-list automatic entry and attribute the whole difference to automation. Required clinical boundary: QI reviewer must verify the best next local test and feasible imports. Source and workflow observations are constructed; this is not a mandate for one-factor-at-a-time testing in every PDSA cycle or proof of software benefit."
        ]
      },
      "selfCheck": {
        "cueAttack": "The task asks for the next comparison rather than preselecting a prefill source. All options use concrete sources and entry modes; multiple alternatives import the visit list, so its freshness cannot identify the key by word matching alone. No causal-effect teaching appears before the answer.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Use the stage-specific times to identify form re-entry as the adaptation target rather than reconciliation or final review.",
          "Choose a comparison of the actual manual process with automatic entry that preserves the clinical source, instead of confounding source freshness with entry method."
        ],
        "oneBestAnswer": "The added work is after signed-list review, the existing manual process uses that list, and the dispensing record differs in its prescriptions.",
        "closestDistractor": "Compare stale dispensing/manual data with current-list automatic entry and attribute the whole difference to automation.",
        "remainingReview": "QI reviewer must verify the best next local test and feasible imports. Source and workflow observations are constructed; this is not a mandate for one-factor-at-a-time testing in every PDSA cycle or proof of software benefit."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.quality-improvement.pdsa-act-and-iterate.v3.r5",
      "conceptId": "concept.quality-improvement.pdsa-act-and-iterate",
      "stem": "Which comparison should {patientName}'s team use for its next PDSA test?",
      "answerChoices": [
        {
          "id": "correct_abandon-harm",
          "label": "Manual entry from the visit list vs automatic entry from that list",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "This tests an adaptation of the increased form-entry work while keeping the clinical source unchanged. Retain review and record agreement as well as time."
        },
        {
          "id": "choice.qq20261102c.b36.d1",
          "label": "Manual entry from dispensing data vs automatic entry from the visit list",
          "isCorrect": false,
          "distractorRationale": "Both the entry method and the clinical source change. The record difference can confound interpretation of the method change and does not represent the existing manual workflow."
        },
        {
          "id": "choice.qq20261102c.b36.d2",
          "label": "Automatic entry from dispensing data vs automatic entry from the visit list",
          "isCorrect": false,
          "distractorRationale": "This tests source differences between two automatic workflows, rather than the change from the actual manual form-entry process that has gained work."
        }
      ],
      "explanation": "The extra work occurs during form entry after the medication list has been reviewed. Compare the current manual process with automatic entry using the same visit list; retain review and measure agreement as well as time. Simultaneously changing record sources makes the method comparison harder to interpret, while comparing two automatic sources answers a different question. A small PDSA test informs the next iteration; it does not establish a treatment effect or guarantee benefit.",
      "teachingPoint": "The extra work occurs during form entry after the medication list has been reviewed. Compare the current manual process with automatic entry using the same visit list; retain review and measure agreement as well as time. Simultaneously changing record sources makes the method comparison harder to interpret, while comparing two automatic sources answers a different question. A small PDSA test informs the next iteration; it does not establish a treatment effect or guarantee benefit.",
      "exhibit": {
        "kind": "table",
        "caption": "Constructed totals across the same ten uses.",
        "columnHeaders": [
          "Previous process",
          "Current form"
        ],
        "rowHeaders": [
          "Medication reconciliation: total minutes",
          "Form entry after current-list sign-off: total minutes",
          "Final clinical review: total minutes",
          "Unplanned repeat contacts in the next 20 visits"
        ],
        "cells": [
          [
            "20",
            "20"
          ],
          [
            "10",
            "50"
          ],
          [
            "10",
            "10"
          ],
          [
            "8",
            "8"
          ]
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.pdsa-act",
        "claim.qq20261102a.pdsa-outcome-balancing-adaptation",
        "claim.qq20261102b.pdsa-hypothesis-not-proof",
        "claim.qq20261102c.pdsa-source-specific-next-test",
        "claim.qq20261102c.qi-comparison-input-control"
      ]
    },
    "clinicalBinding": {
      "previousConceptId": "concept.quality-improvement.pdsa-act-and-iterate",
      "nextConceptId": "concept.quality-improvement.pdsa-act-and-iterate",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Existing objective applied with revised wording/data; no concept meaning change."
    },
    "presentationTemplate": "{patientName} leads an employee quality meeting about a structured visit form. Staff currently copy the signed visit medication list into the form by hand. The prescriber enters dose changes in that list before form entry; the latest dispensing record still contains the previous prescriptions. Staff can manually enter or import either record. The team wants to reduce the extra form work, retaining clinician review and checking both time and agreement with the clinical record.",
    "previousPresentation": "{patientName} leads an employee quality meeting about a structured visit form. A small test aims to reduce unplanned repeat contacts while keeping planning workload manageable. The constructed observations below compare the current form with the previous process; they do not establish a causal treatment effect.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102b.case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
        "patientPresentationVariantId": "presentation.gs028se.pdsa-act-qi-measures.a-abandon-harm",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v6",
        "revisedChiefComplaint": "Pathway improvement review",
        "revisedPresentation": "{patientName} leads an employee quality meeting about a structured visit form. A small test aims to reduce unplanned repeat contacts while keeping planning workload manageable. The constructed observations below compare the current form with the previous process; they do not establish a causal treatment effect.",
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
      "idPrefix": "ppr.qq20261102c.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v7"
    }
  },
  {
    "id": "revision.qq20261102c.b37",
    "auditId": "B37",
    "caseId": "case.inflammatory-breast-cancer.persistent-erythema",
    "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.1",
    "previousQuestionVariantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r4",
    "questionVariantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which tissue-sampling plan should be arranged next for {patientName}?",
    "previousChoiceLabels": [
      "Ultrasound-guided core biopsy of the parenchymal target",
      "Open incisional sampling of the parenchymal abnormality",
      "Multiple punch samples from the involved breast skin"
    ],
    "previousCurrentUpdate": "External systemic staging is planned if invasive carcinoma is confirmed.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Check the specimen/marker against the imaged target instead of accepting benign tissue as representative. Then Obtain target-concordant parenchymal tissue; do not substitute inflammatory treatment or skin-only clearance.",
    "reviewerNotes": "Breast clinician must verify the image/pathology discordance and appropriate repeat core/vacuum-assisted or surgical technique. The existing bundled biopsy/staging service remains; no new service execution is implied by an option label.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "core_staging_4": "core_staging_4",
      "choice.qq20261102c.b37.d1": "choice.qq20261102b.b37.d1",
      "choice.qq20261102c.b37.d2": "choice.qq20261102b.b37.d2"
    },
    "choiceServiceOverrides": {
      "core_staging_4": "service.ibc_biopsy_and_staging",
      "choice.qq20261102c.b37.d1": null,
      "choice.qq20261102c.b37.d2": "service.cutaneous_lesion_biopsy"
    },
    "choiceTimingOverrides": {
      "core_staging_4": {
        "kind": "test",
        "timingProfileId": "timing.test.ibc_biopsy_and_staging"
      },
      "choice.qq20261102c.b37.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b37.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.cutaneous_lesion_biopsy"
      }
    },
    "currentUpdate": "A subsequent ultrasound-guided core procedure sampled the breast. The stored post-biopsy image places the marker in fat below the irregular parenchymal area; the needle track remains below that area. Sections contain adipose tissue and scant fibrous stroma. The expanding skin changes remain, and the irregular area is still visible on repeat ultrasound.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r4",
      "whatChanged": "Replace aspirate-to-core recall with documented missed-target sampling and competing false-benign/skin-only pathways.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B37",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited phrase remains in Presentation because its observation is necessary; its old option-aligned exclusion no longer determines this changed task. Use saved needle/marker position and actual sampled tissue, not an inconclusive label. Use a neutral complete task that fits every option category; do not pre-filter treatment or tissue choices by asking only for a pressure study or imaging. New inference, rather than a substitute cue: Both the needle/marker location and tissue show that the persistent parenchymal target was missed. Attack: Delete the future-staging teaching sentence. The old shared aspiration/no-block facts remain exact because the passed companion uses the same presentation; the new task is driven by a later missed-target core, not by an announced need for initial tissue.",
          "cues 2: The cited wording is absent from the new visible fields. Delete the future systemic-staging sentence. Use saved needle/marker position and actual sampled tissue, not an inconclusive label. New inference, rather than a substitute cue: Both the needle/marker location and tissue show that the persistent parenchymal target was missed. Attack: Delete the future-staging teaching sentence. The old shared aspiration/no-block facts remain exact because the passed companion uses the same presentation; the new task is driven by a later missed-target core, not by an announced need for initial tissue."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: Both the needle/marker location and tissue show that the persistent parenchymal target was missed. Use saved needle/marker position and actual sampled tissue, not an inconclusive label. Use a neutral complete task that fits every option category; do not pre-filter treatment or tissue choices by asking only for a pressure study or imaging. Source limits: Breast clinician must verify the image/pathology discordance and appropriate repeat core/vacuum-assisted or surgical technique. The existing bundled biopsy/staging service remains; no new service execution is implied by an option label.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Check the specimen/marker against the imaged target instead of accepting benign tissue as representative. Then Obtain target-concordant parenchymal tissue; do not substitute inflammatory treatment or skin-only clearance. Closest competing error: Trust the negative core report and treat the persistent skin changes as inflammation. Use saved needle/marker position and actual sampled tissue, not an inconclusive label. Delete the future systemic-staging sentence.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: Initial tissue confirmation changes to an actual benign-core/imaging-target discordance decision."
        ],
        "suggestions": [
          "suggestions 1: Use saved needle/marker position and actual sampled tissue, not an inconclusive label. Use a neutral complete task that fits every option category; do not pre-filter treatment or tissue choices by asking only for a pressure study or imaging. Concrete implementation: Check the specimen/marker against the imaged target instead of accepting benign tissue as representative. Then Obtain target-concordant parenchymal tissue; do not substitute inflammatory treatment or skin-only clearance. The closest error is: Trust the negative core report and treat the persistent skin changes as inflammation. Required clinical boundary: Breast clinician must verify the image/pathology discordance and appropriate repeat core/vacuum-assisted or surgical technique. The existing bundled biopsy/staging service remains; no new service execution is implied by an option label.",
          "suggestions 2: Delete the future systemic-staging sentence. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. Concrete implementation: Check the specimen/marker against the imaged target instead of accepting benign tissue as representative. Then Obtain target-concordant parenchymal tissue; do not substitute inflammatory treatment or skin-only clearance. The closest error is: Trust the negative core report and treat the persistent skin changes as inflammation. Required clinical boundary: Breast clinician must verify the image/pathology discordance and appropriate repeat core/vacuum-assisted or surgical technique. The existing bundled biopsy/staging service remains; no new service execution is implied by an option label."
        ]
      },
      "selfCheck": {
        "cueAttack": "Delete the future-staging teaching sentence. The old shared aspiration/no-block facts remain exact because the passed companion uses the same presentation; the new task is driven by a later missed-target core, not by an announced need for initial tissue.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Check the specimen/marker against the imaged target instead of accepting benign tissue as representative.",
          "Obtain target-concordant parenchymal tissue; do not substitute inflammatory treatment or skin-only clearance."
        ],
        "oneBestAnswer": "Both the needle/marker location and tissue show that the persistent parenchymal target was missed.",
        "closestDistractor": "Trust the negative core report and treat the persistent skin changes as inflammation.",
        "remainingReview": "Breast clinician must verify the image/pathology discordance and appropriate repeat core/vacuum-assisted or surgical technique. The existing bundled biopsy/staging service remains; no new service execution is implied by an option label."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r5",
      "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation.v2",
      "stem": "Which next care plan best fits {patientName}'s current findings?",
      "answerChoices": [
        {
          "id": "core_staging_4",
          "label": "Repeat image-guided breast core biopsy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The actual target was not represented by the core; resolve the imaging-pathology discordance rather than treat a missed-target benign result as exclusion."
        },
        {
          "id": "choice.qq20261102c.b37.d1",
          "label": "Anti-inflammatory treatment with clinical reassessment",
          "isCorrect": false,
          "distractorRationale": "The needle/marker and tissue do not explain the persistent imaged abnormality and clinical progression."
        },
        {
          "id": "choice.qq20261102c.b37.d2",
          "label": "Skin punch biopsy with clinical reassessment",
          "isCorrect": false,
          "distractorRationale": "Skin sampling may be complementary, but does not substitute for representative tissue from the unresolved parenchymal target."
        }
      ],
      "explanation": "Benign tissue is informative only when it accounts for the clinical and imaging target. A missed-target core requires further histologic assessment, with the technique selected jointly by breast imaging/pathology. Skin punch samples may add information but cannot independently clear the unsampled parenchymal lesion.",
      "supportingEvidenceClaimIds": [
        "claim.brief.ibc.core-biopsy-confirmation",
        "claim.qq20261102a.ibc-core-versus-adjunctive-skin",
        "claim.qq20261102c.breast-core-target-discordance"
      ],
      "teachingPoint": "Benign tissue is informative only when it accounts for the clinical and imaging target. A missed-target core requires further histologic assessment, with the technique selected jointly by breast imaging/pathology. Skin punch samples may add information but cannot independently clear the unsampled parenchymal lesion."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation",
      "nextConceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation.v2",
      "previousKeyServiceId": "service.ibc_biopsy_and_staging",
      "nextKeyServiceId": "service.ibc_biopsy_and_staging",
      "previousResultGate": {
        "id": "gate.inflammatory-breast-cancer.biopsy-staging.4",
        "resultTypeId": "service.ibc_biopsy_and_staging",
        "pendingLabel": "Breast biopsy and staging pending",
        "resultNarrative": "Breast core biopsy confirms invasive carcinoma. Biomarker testing is complete, and external staging shows regional stage III disease without distant metastasis.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ibc_biopsy_and_staging.outsourced"
        ]
      },
      "nextResultGate": {
        "id": "gate.inflammatory-breast-cancer.biopsy-staging.4",
        "resultTypeId": "service.ibc_biopsy_and_staging",
        "pendingLabel": "Breast biopsy and staging pending",
        "resultNarrative": "Breast core biopsy confirms invasive carcinoma. Biomarker testing is complete, and external staging shows regional stage III disease without distant metastasis.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ibc_biopsy_and_staging.outsourced"
        ]
      },
      "reason": "Initial tissue confirmation changes to an actual benign-core/imaging-target discordance decision."
    }
  },
  {
    "id": "revision.qq20261102c.b40",
    "auditId": "B40",
    "caseId": "case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
    "nodeId": "node.peptic-ulcer-bleeding.visible-vessel-treat.v1",
    "previousQuestionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r4",
    "questionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which initial endoscopic treatment plan should be used for {patientName}'s ulcer?",
    "previousChoiceLabels": [
      "Endoscopic clip placement with proton-pump inhibitor treatment",
      "Endoscopic epinephrine injection with proton-pump inhibitor treatment",
      "Endoscopic topical powder with proton-pump inhibitor treatment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Distinguish clinical rebleeding after initial success from a persistently dry visible vessel or failed second hemostasis attempt. Then Use resuscitation response and known access to select repeat endoscopic hemostasis before immediate radiologic/operative rescue.",
    "reviewerNotes": "Melissa must verify escalation and the resuscitation/access facts. The vital signs are constructed patient observations, not a new stability threshold; no transfusion, ulcer-size or treatment-time cutoff is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "perform_endoscopic_hemostasis": "perform_endoscopic_hemostasis",
      "choice.qq20261102c.b40.d1": "choice.qq20261102b.b40.d1",
      "choice.qq20261102c.b40.d2": "choice.qq20261102b.b40.d2"
    },
    "choiceServiceOverrides": {
      "perform_endoscopic_hemostasis": null,
      "choice.qq20261102c.b40.d1": null,
      "choice.qq20261102c.b40.d2": null
    },
    "choiceTimingOverrides": {
      "perform_endoscopic_hemostasis": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b40.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b40.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "The patient now has fresh hematemesis and a further hemoglobin fall. After resuscitation, blood pressure is 118/72 mmHg and pulse is 94/min. The first examination recorded a directly accessible ulcer target; no repeat endoscopic hemostasis has yet been attempted. Endoscopic, angiographic and operative care are available at the receiving hospital.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r4",
      "whatChanged": "Replace the initial visible-vessel modality rule with a resuscitated recurrent-bleeding decision after one successful course.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B40",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: Initial hemostasis succeeded, the patient has been resuscitated, the target was accessible and a second attempt has not yet failed. Supply actual treatment success, recurrence, hemodynamic observations and target access. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. Source limits: Melissa must verify escalation and the resuscitation/access facts. The vital signs are constructed patient observations, not a new stability threshold; no transfusion, ulcer-size or treatment-time cutoff is invented.",
          "fairness 2: The old difficulty/shortcut is addressed by a consequential decision: Distinguish clinical rebleeding after initial success from a persistently dry visible vessel or failed second hemostasis attempt. Then Use resuscitation response and known access to select repeat endoscopic hemostasis before immediate radiologic/operative rescue. Closest competing error: Escalate directly to embolization because there has already been one endoscopy. Avoid generic powder comparisons and unverified lesion-specific contraindications. Supply actual treatment success, recurrence, hemodynamic observations and target access.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: A high-risk-stigmata recognition rule changes to selecting an escalation sequence after a documented treatment course."
        ],
        "suggestions": [
          "suggestions 1: Supply actual treatment success, recurrence, hemodynamic observations and target access. Use concise parallel decision labels; remove explanatory or dismissive qualifiers from the options. Concrete implementation: Distinguish clinical rebleeding after initial success from a persistently dry visible vessel or failed second hemostasis attempt. Then Use resuscitation response and known access to select repeat endoscopic hemostasis before immediate radiologic/operative rescue. The closest error is: Escalate directly to embolization because there has already been one endoscopy. Required clinical boundary: Melissa must verify escalation and the resuscitation/access facts. The vital signs are constructed patient observations, not a new stability threshold; no transfusion, ulcer-size or treatment-time cutoff is invented.",
          "suggestions 2: Avoid generic powder comparisons and unverified lesion-specific contraindications. Give all escalation services equal availability; version the new objective. Concrete implementation: Distinguish clinical rebleeding after initial success from a persistently dry visible vessel or failed second hemostasis attempt. Then Use resuscitation response and known access to select repeat endoscopic hemostasis before immediate radiologic/operative rescue. The closest error is: Escalate directly to embolization because there has already been one endoscopy. Required clinical boundary: Melissa must verify escalation and the resuscitation/access facts. The vital signs are constructed patient observations, not a new stability threshold; no transfusion, ulcer-size or treatment-time cutoff is invented."
        ]
      },
      "selfCheck": {
        "cueAttack": "The task no longer asks a visible-vessel rule or ranks equally accepted initial modalities. All three choices are plausible escalation pathways; the course of the prior treatment and current assessment determine their sequence.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Distinguish clinical rebleeding after initial success from a persistently dry visible vessel or failed second hemostasis attempt.",
          "Use resuscitation response and known access to select repeat endoscopic hemostasis before immediate radiologic/operative rescue."
        ],
        "oneBestAnswer": "Initial hemostasis succeeded, the patient has been resuscitated, the target was accessible and a second attempt has not yet failed.",
        "closestDistractor": "Escalate directly to embolization because there has already been one endoscopy.",
        "remainingReview": "Melissa must verify escalation and the resuscitation/access facts. The vital signs are constructed patient observations, not a new stability threshold; no transfusion, ulcer-size or treatment-time cutoff is invented."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r5",
      "conceptId": "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis.v2",
      "stem": "Which hemostasis plan should be arranged next for {patientName}?",
      "answerChoices": [
        {
          "id": "perform_endoscopic_hemostasis",
          "label": "Repeat therapeutic upper endoscopy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Clinical recurrent bleeding after an initially successful course supports another endoscopic attempt, with a cap-mounted clip considered for recurrence."
        },
        {
          "id": "choice.qq20261102c.b40.d1",
          "label": "Transcatheter arterial embolization",
          "isCorrect": false,
          "distractorRationale": "This bypasses the usual second endoscopic attempt in the resuscitated patient with an accessible target and no documented repeat failure."
        },
        {
          "id": "choice.qq20261102c.b40.d2",
          "label": "Operative ulcer hemostasis",
          "isCorrect": false,
          "distractorRationale": "Primary surgery bypasses less invasive repeat endoscopy and angiographic options available in this setting."
        }
      ],
      "explanation": "After an initially successful hemostasis course, a resuscitated patient with recurrent bleeding and an accessible target can undergo another therapeutic endoscopy. Consider a cap-mounted clip for recurrence. The fact that a procedure has already occurred does not establish that an accurately targeted repeat treatment has no role.",
      "supportingEvidenceClaimIds": [
        "claim.peptic-ulcer-bleeding.high-risk-stigmata-require-hemostasis",
        "claim.qq20261102.ulcer-initial-treatment",
        "claim.qq20261102.ulcer-rescue-embolization",
        "claim.qq20261102a.ulcer-local-modality-choice",
        "claim.qq20261102c.ulcer-rebleeding-repeat-endoscopy"
      ],
      "teachingPoint": "After an initially successful hemostasis course, a resuscitated patient with recurrent bleeding and an accessible target can undergo another therapeutic endoscopy. Consider a cap-mounted clip for recurrence. The fact that a procedure has already occurred does not establish that an accurately targeted repeat treatment has no role."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis",
      "nextConceptId": "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "A high-risk-stigmata recognition rule changes to selecting an escalation sequence after a documented treatment course."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, is assessed after renewed melena following endoscopic treatment of a duodenal ulcer. At the first EGD, epinephrine injection and through-the-scope clips stopped the bleeding; proton-pump inhibitor treatment continued.",
    "previousPresentation": "{patientName}, a 43-year-old woman, visits the clinic after melena and is referred for EGD. Endoscopy shows a duodenal ulcer with a protruding vessel in its base; the field stays dry during observation.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
        "patientPresentationVariantId": "presentation.peptic-ulcer-bleeding.visible-vessel-treat",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Recent upper-GI bleeding",
        "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic after melena and is referred for EGD. Endoscopy shows a duodenal ulcer with a protruding vessel in its base; the field stays dry during observation.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102c.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v7"
    }
  },
  {
    "id": "revision.qq20261102c.b40-context",
    "auditId": "B40-context",
    "caseId": "case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
    "nodeId": "node.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1",
    "previousQuestionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r4",
    "questionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v6"
    ],
    "previousStem": "Which intervention should be used next for {patientName}'s duodenal ulcer?",
    "previousChoiceLabels": [
      "Contact bipolar coagulation of the visible vessel",
      "Additional epinephrine injection around the visible vessel",
      "Topical hemostatic powder over the visible vessel"
    ],
    "previousCurrentUpdate": "During treatment of {patientName}'s same duodenal ulcer, the clip jaws slide off the firm flat base. The endoscopist maintains a stable front-on view of the exposed vessel. Epinephrine injection stops the oozing; the vessel remains visible.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Recognize actual failure of the repeat therapeutic endoscopy, not merely a difficult first clip. Then Select available angiographic rescue rather than repeat inaccurate endoscopic attempts or bypass it for surgery.",
    "reviewerNotes": "Melissa/IR must verify escalation, hemodynamics and availability. No generic powder is treated as uniformly inferior and no exact procedure limit or resuscitation threshold is authored.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "choice.qq20261102a.b40-context.key": "choice.qq20261102a.b40-context.key",
      "choice.qq20261102c.b40-context.d1": "choice.qq20261102b.b40-context.d1",
      "choice.qq20261102c.b40-context.d2": "choice.qq20261102b.b40-context.d2"
    },
    "choiceServiceOverrides": {
      "choice.qq20261102a.b40-context.key": null,
      "choice.qq20261102c.b40-context.d1": null,
      "choice.qq20261102c.b40-context.d2": null
    },
    "choiceTimingOverrides": {
      "choice.qq20261102a.b40-context.key": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b40-context.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102c.b40-context.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "During repeat EGD of the same duodenal ulcer, a cap-mounted clip cannot encompass the bleeding base and contact treatment does not stop the jet. Repeated suction and irrigation cannot maintain a view for another accurately placed device. During continued resuscitation, blood pressure is 112/70 mmHg and pulse is 100/min. Angiographic and surgical teams are available.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r4",
      "whatChanged": "Replace failed-clip/injection monotherapy recall with verified repeat-treatment failure and loss of accurate access.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review3-20261102.json#B40-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The cited wording is absent from the new visible fields. Specify both failed repeat therapy and the actual inability to maintain a treatment view. Use the same duodenal ulcer and a coherent sequence after B40. New inference, rather than a substitute cue: A second endoscopic hemostasis course has failed and the target can no longer be treated accurately; embolization is available during continued resuscitation. Attack: The same duodenal target is preserved throughout. The former injection-plus-another-modality rule and generic powder ranking are removed. Necessary access findings now distinguish actual endoscopic failure from a treatable recurrence.",
          "cues 2: The cited wording is absent from the new visible fields. Specify both failed repeat therapy and the actual inability to maintain a treatment view. Use the same duodenal ulcer and a coherent sequence after B40. New inference, rather than a substitute cue: A second endoscopic hemostasis course has failed and the target can no longer be treated accurately; embolization is available during continued resuscitation. Attack: The same duodenal target is preserved throughout. The former injection-plus-another-modality rule and generic powder ranking are removed. Necessary access findings now distinguish actual endoscopic failure from a treatable recurrence."
        ],
        "fairness": [
          "fairness 1: Retained valid basis/corrected ranking: A second endoscopic hemostasis course has failed and the target can no longer be treated accurately; embolization is available during continued resuscitation. Use the same duodenal ulcer and a coherent sequence after B40. Specify both failed repeat therapy and the actual inability to maintain a treatment view. Source limits: Melissa/IR must verify escalation, hemodynamics and availability. No generic powder is treated as uniformly inferior and no exact procedure limit or resuscitation threshold is authored.",
          "fairness 2: Decision-critical basis is now explicit: A second endoscopic hemostasis course has failed and the target can no longer be treated accurately; embolization is available during continued resuscitation. Specify both failed repeat therapy and the actual inability to maintain a treatment view. Use the same duodenal ulcer and a coherent sequence after B40. Single-best claim is limited by: Melissa/IR must verify escalation, hemodynamics and availability. No generic powder is treated as uniformly inferior and no exact procedure limit or resuscitation threshold is authored.",
          "fairness 3: The rejected basic designation and its justification are removed. New objective/version: Selection among initial endoscopic modalities changes to the escalation boundary after failed repeat therapy."
        ],
        "suggestions": [
          "suggestions 1: Specify both failed repeat therapy and the actual inability to maintain a treatment view. Use the same duodenal ulcer and a coherent sequence after B40. Concrete implementation: Recognize actual failure of the repeat therapeutic endoscopy, not merely a difficult first clip. Then Select available angiographic rescue rather than repeat inaccurate endoscopic attempts or bypass it for surgery. The closest error is: Try another endoscopic device because cap-mounted clips are recommended for recurrent bleeding, despite failure and loss of an accurate view. Required clinical boundary: Melissa/IR must verify escalation, hemodynamics and availability. No generic powder is treated as uniformly inferior and no exact procedure limit or resuscitation threshold is authored.",
          "suggestions 2: Remove topical-technology ambiguity and version the new objective. Specify both failed repeat therapy and the actual inability to maintain a treatment view. Concrete implementation: Recognize actual failure of the repeat therapeutic endoscopy, not merely a difficult first clip. Then Select available angiographic rescue rather than repeat inaccurate endoscopic attempts or bypass it for surgery. The closest error is: Try another endoscopic device because cap-mounted clips are recommended for recurrent bleeding, despite failure and loss of an accurate view. Required clinical boundary: Melissa/IR must verify escalation, hemodynamics and availability. No generic powder is treated as uniformly inferior and no exact procedure limit or resuscitation threshold is authored."
        ]
      },
      "selfCheck": {
        "cueAttack": "The same duodenal target is preserved throughout. The former injection-plus-another-modality rule and generic powder ranking are removed. Necessary access findings now distinguish actual endoscopic failure from a treatable recurrence.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize actual failure of the repeat therapeutic endoscopy, not merely a difficult first clip.",
          "Select available angiographic rescue rather than repeat inaccurate endoscopic attempts or bypass it for surgery."
        ],
        "oneBestAnswer": "A second endoscopic hemostasis course has failed and the target can no longer be treated accurately; embolization is available during continued resuscitation.",
        "closestDistractor": "Try another endoscopic device because cap-mounted clips are recommended for recurrent bleeding, despite failure and loss of an accurate view.",
        "remainingReview": "Melissa/IR must verify escalation, hemodynamics and availability. No generic powder is treated as uniformly inferior and no exact procedure limit or resuscitation threshold is authored."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r5",
      "conceptId": "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2",
      "stem": "Which hemostasis pathway should be arranged next for {patientName}?",
      "answerChoices": [
        {
          "id": "choice.qq20261102a.b40-context.key",
          "label": "Transcatheter arterial embolization",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The repeat endoscopic course has failed and no accurate further endoscopic target can be maintained; angiographic rescue is available."
        },
        {
          "id": "choice.qq20261102c.b40-context.d1",
          "label": "Repeat therapeutic upper endoscopy",
          "isCorrect": false,
          "distractorRationale": "This repeats a pathway after its second course has failed and the required accurate view cannot be maintained."
        },
        {
          "id": "choice.qq20261102c.b40-context.d2",
          "label": "Operative ulcer hemostasis",
          "isCorrect": false,
          "distractorRationale": "Surgery remains rescue care, but available angiographic treatment is the recommended next pathway after failed repeat endoscopic hemostasis in this supplied situation."
        }
      ],
      "explanation": "Failure of the repeat endoscopic attempt changes the escalation boundary. Current guidance supports considering transcatheter embolization, with surgery when embolization is unavailable or unsuccessful or other individual circumstances require it. Do not persist with blind/inaccurate device application merely because a modality is normally useful.",
      "supportingEvidenceClaimIds": [
        "claim.peptic-ulcer-bleeding.nonbleeding-visible-vessel-modalities",
        "claim.peptic-ulcer-bleeding.epinephrine-not-monotherapy",
        "claim.qq20261102a.ulcer-local-modality-choice",
        "claim.qq20261102c.ulcer-failed-repeat-embolization"
      ],
      "teachingPoint": "Failure of the repeat endoscopic attempt changes the escalation boundary. Current guidance supports considering transcatheter embolization, with surgery when embolization is unavailable or unsuccessful or other individual circumstances require it. Do not persist with blind/inaccurate device application merely because a modality is normally useful."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality",
      "nextConceptId": "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Selection among initial endoscopic modalities changes to the escalation boundary after failed repeat therapy."
    }
  }
];

export const QUESTION_QUALITY_ADVERSARIAL_R4_CONCEPT_VERSIONS: QuestionQualityConceptVersion[] = [
  {
    "id": "concept.gs028g.hiv-perioperative.booster-midazolam-interaction.v2",
    "displayName": "Apply benzodiazepine-antagonist contraindication after seizure control",
    "learningObjective": "Use the actual indication for perioperative midazolam to choose a reversal plan when supported respiratory depression competes with preservation of treatment for a potentially life-threatening seizure state.",
    "earliestFacilityStage": 3,
    "conceptType": "management",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.gs028g.hiv-perioperative.booster-midazolam-interaction",
    "versioningReason": "This deliberately changes the scored objective from booster/route recognition to an antagonist contraindication application; the original interaction concept and all prior variants remain available for frozen learning histories.",
    "educationalTier": 1,
    "revisedItemIds": [
      "A25-context"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.flumazenil-seizure-control-contraindication",
      "claim.qq20261102c.midazolam-route-and-monitoring",
      "claim.gs028g.hiv-perioperative.booster-midazolam-interaction",
      "claim.gs028g.hiv-perioperative.booster-midazolam-interaction.fact2",
      "claim.gs028g.hiv-perioperative.booster-midazolam-interaction.fact3",
      "claim.qq20261102.named-art-regimen",
      "claim.qq20261102a.boosted-midazolam-routes",
      "claim.qq20261102a.boosted-parenteral-titration",
      "claim.qq20261102a.art-continuity",
      "claim.qq20261102b.oxygenation-not-ventilation",
      "claim.qq20261102b.route-specific-midazolam-plan",
      "claim.qq20261102b.sedation-ventilation-response"
    ]
  },
  {
    "id": "concept.achalasia.high-resolution-manometry.v2",
    "displayName": "Resolve technical and symptom-protocol limitations in motility testing",
    "learningObjective": "Assess whether an existing esophageal pressure study answers the clinical question and select completion, assisted placement or provocative testing before disease-specific treatment.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.achalasia.high-resolution-manometry",
    "versioningReason": "The original initial-test rule is replaced by interpretation of an existing technically limited or symptom-discordant physiologic study.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B01-context",
      "B02-context",
      "B03-context",
      "B04-context"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.hrm-incomplete-placement",
      "claim.qq20261102c.hrm-protocol-and-provocation",
      "claim.achalasia.high-resolution-manometry",
      "claim.qq20261102a.esophageal-physiology-sequence"
    ]
  },
  {
    "id": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
    "displayName": "Resolve occult-groin imaging and symptom discordance",
    "learningObjective": "Choose an adequate targeted repeat study or dynamic cross-sectional assessment by interpreting prior scan localization, provocation, symptom reproduction and competing musculoskeletal findings.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
    "versioningReason": "The scored objective changes from initial ultrasound selection to deciding how an actual prior evaluation should change the next investigation.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B05",
      "B06",
      "B07",
      "B08"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.groin-imaging-after-negative-study",
      "claim.qq20261102c.groin-inadequate-study-certainty",
      "claim.inguinal-hernia.equivocal-exam-ultrasound",
      "claim.qq20261102a.groin-initial-dynamic-assessment"
    ]
  },
  {
    "id": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
    "displayName": "Apply symptom attribution to a demonstrated inguinal hernia",
    "learningObjective": "Distinguish hernia-related from coexisting musculoskeletal pain and select a repair discussion or observation without assuming every positive image explains the patient's limitation.",
    "earliestFacilityStage": 1,
    "conceptType": "management",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
    "versioningReason": "The scored objective changes from repairing an already-labelled symptomatic hernia to deciding whether the hernia accounts for the symptoms.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B05-context",
      "B06-context",
      "B07-context",
      "B08-context"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.groin-symptom-attribution",
      "claim.inguinal-hernia.symptomatic-elective-repair",
      "claim.qq20261102a.symptomatic-groin-planning"
    ]
  },
  {
    "id": "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v2",
    "displayName": "Resolve cystic thyroid-node imaging/cytology discordance",
    "learningObjective": "Select targeted tissue confirmation for a suspicious cervical node when prior fluid-only aspiration does not explain its solid imaging features, before determining operative nodal management.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound",
    "versioningReason": "Initial compartment mapping changes to resolving an already-mapped suspicious node's discordant sampling result.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B09"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.thyroid-cystic-node-discordance",
      "claim.dtc.preop-ultrasound",
      "claim.qq20261102a.papillary-cytology-regional-survey",
      "claim.qq20261102a.papillary-cytology-pattern"
    ]
  },
  {
    "id": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
    "displayName": "Resolve partial skin-biopsy and microstaging limitations",
    "learningObjective": "Choose a representative diagnostic completion strategy when specimen location, deep transection or clinicopathologic discordance prevents a reliable whole-lesion diagnosis or microstage before definitive reconstruction/staging.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
    "versioningReason": "The initial small-lesion excision rule changes to interpreting an actual partial specimen and sequencing completion against definitive surgery.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B11-context",
      "B12-context",
      "B17-context",
      "B18-context"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
      "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "claim.qq20261102a.melanoma-diagnostic-sampling"
    ]
  },
  {
    "id": "concept.melanoma.sentinel-node-staging.v2",
    "displayName": "Apply regional-node evidence before sentinel staging",
    "learningObjective": "Distinguish a clinically node-negative melanoma basin from a proven-positive or suspicious nonrepresentatively sampled node, and choose the appropriate next diagnostic/staging pathway.",
    "earliestFacilityStage": 1,
    "conceptType": "management",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.melanoma.sentinel-node-staging",
    "versioningReason": "The scored decision changes from applying a thickness rule in a negative basin to resolving observed nodal evidence before using that rule.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B12",
      "B18"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.melanoma-suspicious-node-pathway",
      "claim.melanoma.sentinel-node-staging",
      "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "claim.qq20261102a.melanoma-integrated-node-staging"
    ]
  },
  {
    "id": "concept.colon-cancer.preoperative-cross-sectional-staging.v2",
    "displayName": "Complete colon staging from actual prior imaging",
    "learningObjective": "Retain adequate prior staging while selecting targeted characterization or missing-region imaging from the actual coverage and unresolved findings of outside examinations.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.colon-cancer.preoperative-cross-sectional-staging",
    "versioningReason": "Routine first staging-bundle selection changes to completing an already-performed assessment with a specific unresolved finding.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B14-context",
      "B15-context"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.colon-indeterminate-liver-mri",
      "claim.qq20261102c.colon-adequate-regions-and-chest-ct",
      "claim.colon-cancer.preoperative-cross-sectional-staging",
      "claim.qq20261102a.colon-systemic-staging",
      "claim.qq20261102b.colon-staging-coverage",
      "claim.qq20261102b.colon-pet-not-routine-substitute"
    ]
  },
  {
    "id": "concept.soft-tissue-mass.extremity-mri.v2",
    "displayName": "Assess local MRI adequacy before soft-tissue biopsy",
    "learningObjective": "Choose completion of local MRI based on the actual field coverage, compartment mapping and viable-target information missing from an outside study before biopsy planning.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.soft-tissue-mass.extremity-mri",
    "versioningReason": "The initial modality-selection rule changes to deciding which part of an existing local MRI must be completed.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B19-context",
      "B20-context"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.sarcoma-mri-coverage-and-target",
      "claim.qq20261102c.sarcoma-enhancement-biopsy-target",
      "claim.soft-tissue-mass.mri",
      "claim.qq20261102a.sarcoma-local-imaging"
    ]
  },
  {
    "id": "concept.colonic-lipoma.endoscopic-recognition.v2",
    "displayName": "Reconcile mucosal sampling with a characteristic subepithelial lesion",
    "learningObjective": "Interpret whether a negative surface specimen samples the EUS-defined layer and decide whether a characteristic colonic lipoma needs further tissue confirmation.",
    "earliestFacilityStage": 2,
    "conceptType": "diagnosis",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.colonic-lipoma.endoscopic-recognition",
    "versioningReason": "Simple lesion naming changes to a patient-specific specimen/imaging and further-investigation decision.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B21-context",
      "B22-context"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.classic-lipoma-normal-mucosal-sample",
      "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
      "claim.qq20261102a.subepithelial-integrated-pattern"
    ]
  },
  {
    "id": "concept.gastric-malt-lymphoma.hpylori-eradication-first-line.v2",
    "displayName": "Choose gastric MALT care from post-eradication trajectory",
    "learningObjective": "Distinguish regressing asymptomatic residual gastric MALT or molecular persistence from progressive symptomatic disease after interpretable infection reassessment, and choose monitoring versus escalation.",
    "earliestFacilityStage": 2,
    "conceptType": "management",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.gastric-malt-lymphoma.hpylori-eradication-first-line",
    "versioningReason": "Initial eradication selection changes to deciding what an actual post-treatment response warrants.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B25",
      "B30-context"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.hpylori-test-conditions",
      "claim.qq20261102c.gastric-regressing-residual-monitoring",
      "claim.qq20261102c.gastric-molecular-persistence",
      "claim.qq20261102c.gastric-progressive-local-escalation",
      "claim.gastric-malt.hpylori-eradication-initial-localized",
      "claim.gastric-malt.eradication-confirmation-and-response-reassessment",
      "claim.gastric-malt.progression-and-transformation-boundary",
      "claim.qq20261102a.gastric-malt-response-assessment"
    ]
  },
  {
    "id": "concept.gastric-malt-lymphoma.pathologic-recognition.v2",
    "displayName": "Apply gastric lymphoma morphology to the treatment pathway",
    "learningObjective": "Integrate gastric small-cell architecture, molecular-test limitations and the actual distribution of large cells before selecting an indolent MALT rather than aggressive/reactive care pathway.",
    "earliestFacilityStage": 2,
    "conceptType": "diagnosis",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
    "versioningReason": "Signature-marker recognition changes to a morphology-driven classification and initial-care decision with a competing transformation interpretation.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B25-context",
      "B30"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.gastric-large-cell-transformation-boundary",
      "claim.qq20261102c.gastric-eradication-response-pathway",
      "claim.qq20261102c.gastric-negative-fusion-not-exclusion",
      "claim.gastric-malt.integrated-pathologic-recognition",
      "claim.qq20261102a.gastric-small-b-cell-differential"
    ]
  },
  {
    "id": "concept.statistics-ethics.p-value.v2",
    "displayName": "Apply uncertainty to a target-benefit decision",
    "learningObjective": "Integrate an effect estimate, confidence interval and null test to distinguish target benefit confirmed, excluded or unresolved and avoid false adoption, futility or equivalence conclusions.",
    "earliestFacilityStage": 2,
    "conceptType": "applied_science",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.statistics-ethics.p-value",
    "versioningReason": "Defining a p-value changes to an applied study-planning decision about a target effect under uncertainty.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B26"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.uncertain-target-benefit-not-excluded",
      "claim.gs028se.statistics.p-value",
      "claim.qq20261102a.null-test-versus-protocol-magnitude",
      "claim.qq20261102b.specified-interval-decision-rule"
    ]
  },
  {
    "id": "concept.pseudocyst.symptomatic-endoscopic-drainage.v2",
    "displayName": "Apply vascular, contents and duct findings to collection treatment",
    "learningObjective": "Choose the route and sequence of intervention for a clinically consequential post-pancreatitis collection by interpreting arterial findings, necrotic contents and partial versus complete duct interruption.",
    "earliestFacilityStage": 2,
    "conceptType": "management",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage",
    "versioningReason": "A generic pseudocyst drainage-referral rule changes materially to sequencing treatment for vascular/necrotic or duct-related complications.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B32",
      "B33",
      "B34",
      "B35"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.pancreatic-arterial-focus-before-drainage",
      "claim.qq20261102c.pancreatic-mri-contents",
      "claim.qq20261102c.pancreatic-necrosis-step-up",
      "claim.qq20261102c.pancreatic-duct-mapping",
      "claim.qq20261102c.pancreatic-partial-leak-bridge",
      "claim.qq20261102c.pancreatic-disconnected-long-term-drainage",
      "claim.early.pseudocyst.contrast-ct-characterization",
      "claim.early.pseudocyst.symptomatic-endoscopic-drainage",
      "claim.qq20261102a.collection-symptom-attribution"
    ]
  },
  {
    "id": "concept.pseudocyst.contrast-ct-characterization.v2",
    "displayName": "Complete collection imaging for a specific intervention question",
    "learningObjective": "Select targeted vascular, internal-content or pancreatic-duct assessment from actual prior imaging and clinical findings before choosing a collection intervention.",
    "earliestFacilityStage": 2,
    "conceptType": "workup",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.pseudocyst.contrast-ct-characterization",
    "versioningReason": "A routine IV-contrast CT rule changes to choosing among different investigations for an unresolved intervention-planning question.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B32-context",
      "B33-context",
      "B34-context",
      "B35-context"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.pancreatic-arterial-focus-before-drainage",
      "claim.qq20261102c.pancreatic-mri-contents",
      "claim.qq20261102c.pancreatic-necrosis-step-up",
      "claim.qq20261102c.pancreatic-duct-mapping",
      "claim.qq20261102c.pancreatic-partial-leak-bridge",
      "claim.qq20261102c.pancreatic-disconnected-long-term-drainage",
      "claim.early.pseudocyst.contrast-ct-characterization",
      "claim.qq20261102a.pancreatic-contrast-characterization"
    ]
  },
  {
    "id": "concept.inflammatory-breast-cancer.core-biopsy-confirmation.v2",
    "displayName": "Resolve breast imaging/core-biopsy discordance",
    "learningObjective": "Interpret target position and specimen contents after a benign breast core result and choose representative further tissue assessment rather than dismiss a persistent suspicious parenchymal lesion.",
    "earliestFacilityStage": 2,
    "conceptType": "workup",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation",
    "versioningReason": "Initial tissue confirmation changes to an actual benign-core/imaging-target discordance decision.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B37"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.breast-core-target-discordance",
      "claim.brief.ibc.core-biopsy-confirmation",
      "claim.qq20261102a.ibc-core-versus-adjunctive-skin"
    ]
  },
  {
    "id": "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis.v2",
    "displayName": "Sequence treatment of recurrent ulcer bleeding",
    "learningObjective": "Distinguish recurrent bleeding after initially successful endoscopy from failure of repeat hemostasis and select repeat endoscopy, angiographic or operative rescue from actual resuscitation/access findings.",
    "earliestFacilityStage": 2,
    "conceptType": "management",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis",
    "versioningReason": "A high-risk-stigmata recognition rule changes to selecting an escalation sequence after a documented treatment course.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B40"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.ulcer-rebleeding-repeat-endoscopy",
      "claim.peptic-ulcer-bleeding.high-risk-stigmata-require-hemostasis",
      "claim.qq20261102.ulcer-initial-treatment",
      "claim.qq20261102.ulcer-rescue-embolization",
      "claim.qq20261102a.ulcer-local-modality-choice"
    ]
  },
  {
    "id": "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2",
    "displayName": "Recognize failed repeat ulcer hemostasis and select rescue",
    "learningObjective": "Use documented repeat-endoscopy failure and target access to choose angiographic versus further endoscopic or operative rescue for recurrent peptic-ulcer bleeding.",
    "earliestFacilityStage": 2,
    "conceptType": "management",
    "contentVersion": "concept.question-quality.2026-11-02.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality",
    "versioningReason": "Selection among initial endoscopic modalities changes to the escalation boundary after failed repeat therapy.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B40-context"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.ulcer-failed-repeat-embolization",
      "claim.peptic-ulcer-bleeding.nonbleeding-visible-vessel-modalities",
      "claim.peptic-ulcer-bleeding.epinephrine-not-monotherapy",
      "claim.qq20261102a.ulcer-local-modality-choice"
    ]
  }
];
