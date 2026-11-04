import type { QuestionQualityR6Revision, QuestionQualityR6ConceptVersion } from "./question-quality-adversarial-r6-20261102";

/** Additive clinical drafts; prior identities and approvals are retained. */
export const QUESTION_QUALITY_ADVERSARIAL_R6_DEFINITIONS: QuestionQualityR6Revision[] = [
  {
    "id": "revision.qq20261102e.b03-context",
    "auditId": "B03-context",
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v3.r6",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which manometry protocol extension should be arranged for {patientName}'s persistent symptoms?",
    "previousChoiceLabels": [
      "Pressure recording during a standardized solid test meal",
      "Pressure recording during a multiple rapid-swallow sequence",
      "Pressure recording during an upright rapid-drink challenge"
    ],
    "previousCurrentUpdate": "The water-swallow study shows junction relaxation within the laboratory range and propagated contractions. The diary records retrosternal hold-up with bread and meat meals. Endoscopy found no ring or stricture, and mucosal biopsies did not show an eosinophilic infiltrate.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Separate inhibition during a swallow sequence from augmentation after it. Then Integrate the independent liquid-loading response without overcalling junction obstruction.",
    "reviewerNotes": "Motility review must confirm the qualitative laboratory-referenced responses and reproducibility. No pressure, volume, swallow-count or diagnostic cutoff is introduced. The later medication-reconciliation result and passed companion remain exact.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_3": "manometry_3",
      "choice.qq20261102e.b03-context.d1": "choice.qq20261102d.b03-context.d1",
      "choice.qq20261102e.b03-context.d2": "choice.qq20261102d.b03-context.d2",
      "choice.qq20261102e.b03-context.d3": "choice.qq20261102d.b03-context.d1"
    },
    "choiceServiceOverrides": {
      "manometry_3": "service.esophageal_manometry",
      "choice.qq20261102e.b03-context.d1": null,
      "choice.qq20261102e.b03-context.d2": null,
      "choice.qq20261102e.b03-context.d3": null
    },
    "choiceTimingOverrides": {
      "manometry_3": {
        "kind": "test",
        "timingProfileId": "timing.test.esophageal_manometry"
      },
      "choice.qq20261102e.b03-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.esophageal_manometry"
      },
      "choice.qq20261102e.b03-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.esophageal_manometry"
      },
      "choice.qq20261102e.b03-context.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.esophageal_manometry"
      }
    },
    "currentUpdate": "Separated swallows produce propagated contractions with junction relaxation within the laboratory range. During repeated rapid-swallow sequences, body pressure falls while swallowing; the contraction after each sequence is weaker than the patient's baseline contractions. During upright rapid drinking, junction relaxation remains within the laboratory range and pressure does not build up throughout the esophagus.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.high-resolution-manometry.v3.r6",
      "whatChanged": "Replace meal selection with interpretation of two actual acquired provocative responses; remove the food diary and repeated structural exclusions; version the changed scored construct.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B03-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Removed the food diary. Neither the update nor options offers a food-test matching shortcut.",
          "cues 2: Replaced the three protocol labels with four balanced reserve/outflow interpretations; each component occurs equally often.",
          "cues 3: Removed the repeated endoscopy/biopsy exclusion sentence; the shared passed presentation retains its original structural observations."
        ],
        "fairness": [
          "fairness 1: Do not deny solid-meal testing's appropriateness in the former scenario. The new task interprets acquired responses rather than rank otherwise reasonable extensions.",
          "fairness 2: The score now requires distinguishing inhibition from reserve and integrating an independent liquid-load result; no symptom-trigger name selects a test."
        ],
        "suggestions": [
          "suggestions 1: The passed structural presentation is exact; no duplicate exclusion or cosmetic food synonym is added.",
          "suggestions 2: Actual pressure-response observations now determine a report-level interpretation with a credible inhibition-versus-reserve error; the changed objective has an explicit new concept version."
        ]
      },
      "selfCheck": {
        "cueAttack": "The food-versus-water test-name match is removed. Four paired interpretations balance both components; neither the cautious outflow conclusion nor the reserve term occurs only in the key.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Separate inhibition during a swallow sequence from augmentation after it.",
          "Integrate the independent liquid-loading response without overcalling junction obstruction."
        ],
        "oneBestAnswer": "Repeated post-sequence contractions fail to augment baseline despite suppression during the sequence; the liquid-loading junction/pressure response is within the stated laboratory range.",
        "closestDistractor": "Read normal inhibition as normal contractile reserve, retaining the otherwise correct liquid-loading interpretation.",
        "remainingReview": "Motility review must confirm the qualitative laboratory-referenced responses and reproducibility. No pressure, volume, swallow-count or diagnostic cutoff is introduced. The later medication-reconciliation result and passed companion remain exact."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v3.r7",
      "conceptId": "concept.achalasia.high-resolution-manometry.v3",
      "stem": "Which interpretation should accompany {patientName}'s referral for specialist manometry review?",
      "answerChoices": [
        {
          "id": "manometry_3",
          "label": "Reduced contractile reserve; liquid-load outflow obstruction not demonstrated",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The diminished post-sequence contraction concerns reserve, whereas the liquid-load response does not demonstrate an outflow obstruction. These are different physiology questions; neither finding alone supplies a complete motor diagnosis."
        },
        {
          "id": "choice.qq20261102e.b03-context.d1",
          "label": "Preserved contractile reserve; liquid-load outflow obstruction not demonstrated",
          "isCorrect": false,
          "distractorRationale": "Normal suppression during rapid swallows concerns inhibition. It does not make the weaker post-sequence contraction evidence of preserved reserve."
        },
        {
          "id": "choice.qq20261102e.b03-context.d2",
          "label": "Reduced contractile reserve; liquid-load outflow obstruction demonstrated",
          "isCorrect": false,
          "distractorRationale": "The reserve interpretation fits, but the supplied junction relaxation and pressure behavior during rapid drinking do not establish the added outflow claim."
        },
        {
          "id": "choice.qq20261102e.b03-context.d3",
          "label": "Preserved contractile reserve; liquid-load outflow obstruction demonstrated",
          "isCorrect": false,
          "distractorRationale": "This confuses inhibition with reserve and interprets the liquid-load response as evidence of obstruction despite the stated observations."
        }
      ],
      "explanation": "The response during rapid swallows and the contraction afterward answer different questions. Suppression is present, but the post-sequence response does not augment baseline contractions, supporting reduced reserve. The supplied rapid-drink response does not demonstrate outflow obstruction. Specialist review must integrate technically adequate acquisition and the full clinical context; these observations do not independently diagnose achalasia or establish the cause of all symptoms.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.qq20261102c.hrm-protocol-and-provocation",
        "claim.qq20261102d.hrm-rapid-swallow-interpretation",
        "claim.qq20261102d.hrm-rapid-drink-purpose",
        "claim.qq20261102d.hrm-solid-meal-provocation",
        "claim.qq20261102e.hrm-reserve-versus-outflow"
      ],
      "teachingPoint": "The response during rapid swallows and the contraction afterward answer different questions. Suppression is present, but the post-sequence response does not augment baseline contractions, supporting reduced reserve. The supplied rapid-drink response does not demonstrate outflow obstruction. Specialist review must integrate technically adequate acquisition and the full clinical context; these observations do not independently diagnose achalasia or establish the cause of all symptoms."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.achalasia.high-resolution-manometry.v2",
      "nextConceptId": "concept.achalasia.high-resolution-manometry.v3",
      "previousKeyServiceId": "service.esophageal_manometry",
      "nextKeyServiceId": "service.esophageal_manometry",
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
        "id": "gate.achalasia.manometry.3",
        "resultTypeId": "service.esophageal_manometry",
        "pendingLabel": "Esophageal manometry pending",
        "resultNarrative": "Medication reconciliation shows that {patientName} takes oxycodone regularly for back pain and took it before the pressure study. The prescribing team can supervise a medication adjustment, and the patient can maintain oral intake during reassessment.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.esophageal_manometry.outsourced"
        ]
      },
      "reason": "The score changes from choosing a protocol extension to interpreting two acquired provocative responses. Retain v2 protocol-selection histories and exact passed companion versions."
    }
  },
  {
    "id": "revision.qq20261102e.b05",
    "auditId": "B05",
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r6",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which investigation protocol should be arranged next for {patientName}?",
    "previousChoiceLabels": [
      "Standing dynamic ultrasound of the groin",
      "Routine supine MRI of the groin and hip",
      "Contrast CT of the groin and pelvis at rest"
    ],
    "previousCurrentUpdate": "The outside ultrasound record contains supine resting views of the inguinal region. No protrusion is visible in those views. The patient's work-shift photograph shows the contour change above the inguinal crease.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Determine what the recorded dynamic examination actually tested rather than treating all negative ultrasounds alike. Then Select cross-sectional assessment of persistent groin uncertainty instead of automatically repeating the same protocol or narrowing to the hip joint.",
    "reviewerNotes": "Groin/MSK review must confirm the selected MRI protocol and ranking. MRI is a context-specific next study after adequate negative targeted assessment, not obligatory after every negative ultrasound.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_4": "dynamic_ultrasound_4",
      "choice.qq20261102e.b05.d1": "choice.qq20261102d.b05.d1",
      "choice.qq20261102e.b05.d2": "choice.qq20261102d.b05.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_4": "service.mri",
      "choice.qq20261102e.b05.d1": null,
      "choice.qq20261102e.b05.d2": null
    },
    "choiceTimingOverrides": {
      "dynamic_ultrasound_4": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102e.b05.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qq20261102e.b05.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      }
    },
    "currentUpdate": "The outside ultrasound includes standing and supine cine loops through the photographed inguinal site during cough and Valsalva. The familiar pressure occurs during the examination; the recorded canal contour does not change. Hip rotation still produces the separate deep ache.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r6",
      "whatChanged": "Change the outside study to an adequate targeted dynamic examination; make persistent discordance select pelvic MRI, with real dynamic sonography and hip arthrography alternatives. Align the existing result gate and new timing/order identity.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B05",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The scan now documents standing/supine cine loops, the clinical site, provocation and symptom reproduction; a resting-only phrase cannot select the answer.",
          "cues 2: Replace the static MRI foil with an actual dynamic pelvic protocol, now keyed because the targeted ultrasound is adequate.",
          "cues 3: Replace the static CT foil with a plausible hip arthrographic protocol addressing the competing rotation finding."
        ],
        "fairness": [
          "fairness 1: The former repeat-ultrasound answer was defensible for its limited study. The new raw acquisition record changes the best selected next study; no photographic diagnosis is asserted.",
          "fairness 2: Every offered investigation is a real protocol. The adequate-versus-inadequate distinction, rather than active-versus-resting labels, now changes the key."
        ],
        "suggestions": [
          "suggestions 1: Preserve explicit acquisition facts rather than hide whether provocation was performed.",
          "suggestions 2: Use a completed adequate dynamic examination to support context-specific cross-sectional assessment; MRI is not declared universally superior. B07 retains a true localization failure with the alternative key."
        ]
      },
      "selfCheck": {
        "cueAttack": "All offered protocols are credible active investigations; no distractor advertises a resting-only limitation. B07 uses the same alternatives with the opposite acquisition-adequacy result.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Determine what the recorded dynamic examination actually tested rather than treating all negative ultrasounds alike.",
          "Select cross-sectional assessment of persistent groin uncertainty instead of automatically repeating the same protocol or narrowing to the hip joint."
        ],
        "oneBestAnswer": "The clinical site and provoking conditions were actually tested with symptom reproduction, but the clinical imaging question remains unresolved.",
        "closestDistractor": "Repeat dynamic ultrasound because an intermittent lump is reported, overlooking that the requested site and provocation were already covered.",
        "remainingReview": "Groin/MSK review must confirm the selected MRI protocol and ranking. MRI is a context-specific next study after adequate negative targeted assessment, not obligatory after every negative ultrasound."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r7",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "stem": "Which investigation should be arranged next for {patientName}'s persistent groin symptoms?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_4",
          "label": "Pelvic MRI with strain and pubic-attachment sequences",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The prior scan has actually assessed the clinical inguinal site under provocation. Persistent discordant symptoms and the competing musculoskeletal findings make dynamic cross-sectional assessment a selected next investigation."
        },
        {
          "id": "choice.qq20261102e.b05.d1",
          "label": "Groin ultrasound with standing strain and cine loops",
          "isCorrect": false,
          "distractorRationale": "This is a credible alternative when the site or provocation was not tested. Here those elements are documented; simply repeating them does not address the remaining combined question as well."
        },
        {
          "id": "choice.qq20261102e.b05.d2",
          "label": "Hip MR arthrography with labral and cartilage sequences",
          "isCorrect": false,
          "distractorRationale": "The rotation-related ache makes a hip explanation plausible, but a joint-focused examination does not answer the intermittent groin contour question alongside the attachment structures."
        }
      ],
      "explanation": "The recorded site, positions, provocation and symptom reproduction distinguish an adequate targeted negative examination from an examination that missed the clinical question. Dynamic pelvic MRI can address persisting groin uncertainty and associated soft-tissue findings. Repeat targeted sonography remains appropriate when the site or provocation was untested; this case does not assert a universal MRI advantage or diagnose the photographed contour change by itself.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment",
        "claim.qq20261102c.groin-imaging-after-negative-study",
        "claim.qq20261102c.groin-inadequate-study-certainty"
      ],
      "teachingPoint": "The recorded site, positions, provocation and symptom reproduction distinguish an adequate targeted negative examination from an examination that missed the clinical question. Dynamic pelvic MRI can address persisting groin uncertainty and associated soft-tissue findings. Repeat targeted sonography remains appropriate when the site or provocation was untested; this case does not assert a universal MRI advantage or diagnose the photographed contour change by itself."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "nextConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "previousKeyServiceId": "service.ultrasound",
      "nextKeyServiceId": "service.mri",
      "previousResultGate": {
        "id": "gate.inguinal-hernia.ultrasound.4",
        "resultTypeId": "service.ultrasound",
        "pendingLabel": "Targeted dynamic groin ultrasound pending",
        "resultNarrative": "Standing strain ultrasound shows an inguinal protrusion that withdraws while supine. Hip-directed exercises have reduced the ache on rotation. During a work shift, the groin lump still makes the patient stop lifting; pressing it back allows lifting to resume. Rotation discomfort is still present on examination.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ultrasound.outsourced",
          "route.ultrasound.in_house"
        ]
      },
      "nextResultGate": {
        "id": "gate.inguinal-hernia.ultrasound.4",
        "resultTypeId": "service.mri",
        "pendingLabel": "Pelvic MRI pending",
        "resultNarrative": "Dynamic pelvic MRI shows an inguinal protrusion during strain that reduces while supine. Hip-directed exercises have reduced the ache on rotation. During a work shift, the groin lump still makes the patient stop lifting; pressing it back allows lifting to resume. Rehabilitation continues for the residual rotation discomfort.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.mri.outsourced"
        ]
      },
      "reason": "Existing objective applied with revised wording/data; no concept meaning change."
    }
  },
  {
    "id": "revision.qq20261102e.b05-context",
    "auditId": "B05-context",
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r6",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which next plan best addresses {patientName}'s remaining activity limitation?",
    "previousChoiceLabels": [
      "Elective hernia consultation with ongoing musculoskeletal care",
      "Further musculoskeletal rehabilitation before hernia consultation",
      "Pelvic MRI before hernia or rehabilitation planning"
    ],
    "previousCurrentUpdate": "Standing strain ultrasound shows an inguinal protrusion that withdraws while supine. Hip-directed exercises have reduced the ache on rotation. During a work shift, the groin lump still makes the patient stop lifting; pressing it back allows lifting to resume. Rotation discomfort is still present on examination.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Compare the differing symptom trajectories rather than attribute every pain to either the MRI finding or the hip. Then Use the remaining hernia-associated functional interruption to time elective assessment alongside the shared rehabilitation.",
    "reviewerNotes": "Hernia/MSK review should confirm functional attribution and elective eligibility. No new timing deadline, compulsory repair, mesh choice or emergency indication is authored.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_4": "elective_discussion_4",
      "choice.qq20261102e.b05-context.d1": "choice.qq20261102d.b05-context.d1",
      "choice.qq20261102e.b05-context.d2": "choice.qq20261102d.b05-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_4": null,
      "choice.qq20261102e.b05-context.d1": null,
      "choice.qq20261102e.b05-context.d2": null
    },
    "choiceTimingOverrides": {
      "elective_discussion_4": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b05-context.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b05-context.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "Dynamic pelvic MRI shows an inguinal protrusion during strain that reduces while supine. Hip-directed exercises have reduced the ache on rotation. During a work shift, the groin lump still makes the patient stop lifting; pressing it back allows lifting to resume. Rehabilitation continues for the residual rotation discomfort.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r6",
      "whatChanged": "Retain the necessary work/reduction response, place rehabilitation in shared context, and compare parallel referral timing policies rather than a combined key against incomplete plans.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B05-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Ongoing rehabilitation is now shared context; the key no longer uniquely adds musculoskeletal care.",
          "cues 2: All choices are parallel referral timing policies. Delaying until rehabilitation ends remains a real attribution/sequence error, without explanatory wording in the label.",
          "cues 3: Retain the work interruption and reduction response as required for fairness, but require their comparison with the separate improving symptom trajectory."
        ],
        "fairness": [
          "fairness 1: Keep elective assessment, not a compulsory operation; retain residual musculoskeletal care in every plan's context.",
          "fairness 2: Equalize scope and caution so completing two problems is not itself a key cue; the timing follows the actual functional response."
        ],
        "suggestions": [
          "suggestions 1: Retain the function/reduction and exercise-response observations exactly in meaning.",
          "suggestions 2: Put ongoing rehabilitation in shared context and compare equal-scope hernia referral policies."
        ]
      },
      "selfCheck": {
        "cueAttack": "All choices concern the same hernia referral and share ongoing rehabilitation in the context; no uniquely combined care plan receives credit for completeness.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Compare the differing symptom trajectories rather than attribute every pain to either the MRI finding or the hip.",
          "Use the remaining hernia-associated functional interruption to time elective assessment alongside the shared rehabilitation."
        ],
        "oneBestAnswer": "Hip-related symptoms improve, whereas lifting remains interrupted by episodes relieved on reduction.",
        "closestDistractor": "Complete rehabilitation first because some rotation discomfort remains.",
        "remainingReview": "Hernia/MSK review should confirm functional attribution and elective eligibility. No new timing deadline, compulsory repair, mesh choice or emergency indication is authored."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v4.r7",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "stem": "When should {patientName}'s hernia referral be arranged?",
      "answerChoices": [
        {
          "id": "elective_discussion_4",
          "label": "Refer during ongoing rehabilitation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The remaining functional interruption tracks the reducible protrusion despite improvement in the coexisting attachment/joint symptoms. Elective assessment need not await completion of that treatment."
        },
        {
          "id": "choice.qq20261102e.b05-context.d1",
          "label": "Refer after rehabilitation is completed",
          "isCorrect": false,
          "distractorRationale": "Residual musculoskeletal symptoms can coexist with a hernia that already limits function. Treating them first as an absolute referral prerequisite delays the separately supported hernia assessment."
        },
        {
          "id": "choice.qq20261102e.b05-context.d2",
          "label": "Refer after repeat imaging documents progression",
          "isCorrect": false,
          "distractorRationale": "Anatomical enlargement is not required before discussing an already demonstrated activity-limiting inguinal hernia. This mistakes imaging change for the relevant functional criterion."
        }
      ],
      "explanation": "The exercise response improves one symptom source without resolving the separate lifting interruption associated with the reducible protrusion. Elective hernia assessment can proceed during the ongoing rehabilitation. Neither disappearance of every musculoskeletal symptom nor imaging enlargement is required before assessment of a function-limiting hernia. Referral is not a commitment to an operation or a particular technique.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "teachingPoint": "The exercise response improves one symptom source without resolving the separate lifting interruption associated with the reducible protrusion. Elective hernia assessment can proceed during the ongoing rehabilitation. Neither disappearance of every musculoskeletal symptom nor imaging enlargement is required before assessment of a function-limiting hernia. Referral is not a commitment to an operation or a particular technique."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Existing objective applied with revised wording/data; no concept meaning change."
    }
  },
  {
    "id": "revision.qq20261102e.b06-context",
    "auditId": "B06-context",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r6",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which initial care plan best fits {patientName}'s activity-limiting symptoms?",
    "previousChoiceLabels": [
      "Adductor rehabilitation; hernia observation",
      "Hip-joint assessment with initial hernia observation",
      "Elective hernia repair before adductor rehabilitation"
    ],
    "previousCurrentUpdate": "Dynamic MRI shows a small reducible inguinal protrusion and signal change at the adductor attachment. Coughing causes a brief groin twinge, but the patient completes lifting at work. Running stops because of medial-thigh pain reproduced by resisted adduction. Passive hip rotation does not reproduce that pain.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Use the dissociation between improving function and unchanged structural findings to reassess their clinical significance. Then Choose whether the observed course supports changing the initial observation plan rather than matching an anatomical word to a rehabilitation label.",
    "reviewerNotes": "Observation requires informed discussion and return advice; the item does not prescribe the patient's ultimate preference. Clinical review must confirm that no new hernia-limiting symptom is implied by the interval history.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_2": "elective_discussion_2",
      "choice.qq20261102e.b06-context.d1": "choice.qq20261102d.b06-context.d1",
      "choice.qq20261102e.b06-context.d2": "choice.qq20261102d.b06-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_2": null,
      "choice.qq20261102e.b06-context.d1": null,
      "choice.qq20261102e.b06-context.d2": null
    },
    "choiceTimingOverrides": {
      "elective_discussion_2": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b06-context.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b06-context.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "After the MRI, {patientName} begins a graded exercise program with hernia observation. At review, walking has progressed to sustained jogging. The groin contour still appears with coughing and withdraws on lying down, as before. Work shifts are completed without interruption. MRI review still shows the small protrusion and the attachment signal change.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r6",
      "whatChanged": "Replace the causal anatomy-to-rehabilitation match with a later response-to-care decision. All options address whether repair planning should change during the same rehabilitation trajectory.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B06-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Delete 'running stops because of' and remove anatomy-specific rehabilitation labels. The update gives an interval function trajectory rather than its cause.",
          "cues 2: Delete the hip-specific negative; it no longer eliminates an offered option.",
          "cues 3: Work function is retained once as observation eligibility. The new deciding comparison is improvement despite unchanged MRI findings, not a stated assignment of the limiting pain."
        ],
        "fairness": [
          "fairness 1: Retain the reducible male/minimally limiting context and informed-observation limitation; repair remains an elective patient choice, not declared prohibited.",
          "fairness 2: The score now concerns whether the interval response supports changing an existing plan. Interpreting discordant structural and functional trajectories is necessary."
        ],
        "suggestions": [
          "suggestions 1: Remove the explicit hip exclusion without replacing it with a new anatomical exclusion.",
          "suggestions 2: Compare same-scope sequencing of repair planning during a graded program; make the observed response, not a named muscle, determine whether change is supported."
        ]
      },
      "selfCheck": {
        "cueAttack": "No option names an adductor or hip target. The named hip exclusion and 'running stops because of' conclusion are removed; persistent imaging is a genuine competing consideration.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Use the dissociation between improving function and unchanged structural findings to reassess their clinical significance.",
          "Choose whether the observed course supports changing the initial observation plan rather than matching an anatomical word to a rehabilitation label."
        ],
        "oneBestAnswer": "Jogging and work function improve without a change in the reducible protrusion; the decision concerns a change from an already established initial conservative plan.",
        "closestDistractor": "Add repair planning solely because the protrusion remains visible on imaging despite clinical improvement.",
        "remainingReview": "Observation requires informed discussion and return advice; the item does not prescribe the patient's ultimate preference. Clinical review must confirm that no new hernia-limiting symptom is implied by the interval history."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v2.r7",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "stem": "Which care adjustment is best supported by {patientName}'s interval course?",
      "answerChoices": [
        {
          "id": "elective_discussion_2",
          "label": "Continue observation while advancing rehabilitation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Function improves without changing the hernia finding. The interval response supports the current conservative approach rather than using persistent imaging alone as an indication to alter the plan."
        },
        {
          "id": "choice.qq20261102e.b06-context.d1",
          "label": "Start repair planning while advancing rehabilitation",
          "isCorrect": false,
          "distractorRationale": "A persistent protrusion can attract repair planning, but the actual functional trajectory does not establish a new hernia-related limitation that explains a need to change this initial plan."
        },
        {
          "id": "choice.qq20261102e.b06-context.d2",
          "label": "Start repair planning before advancing rehabilitation",
          "isCorrect": false,
          "distractorRationale": "This gives an unchanged imaging finding priority over the improving function and pauses a program that is helping. It assumes the hernia must be corrected before activity can progress."
        }
      ],
      "explanation": "The MRI finding has not changed while function has improved during the exercise program. That response supports continuing rehabilitation and observation of the reducible, minimally limiting hernia in this man, with counseling and reassessment if symptoms change. It does not show that elective repair is forbidden or that imaging alone proves the source of all pain.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution",
        "claim.bread-butter.inguinal-hernia.watchful-waiting"
      ],
      "teachingPoint": "The MRI finding has not changed while function has improved during the exercise program. That response supports continuing rehabilitation and observation of the reducible, minimally limiting hernia in this man, with counseling and reassessment if symptoms change. It does not show that elective repair is forbidden or that imaging alone proves the source of all pain."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Existing objective applied with revised wording/data; no concept meaning change."
    }
  },
  {
    "id": "revision.qq20261102e.b07",
    "auditId": "B07",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r6",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which investigation protocol should be arranged next for {patientName}?",
    "previousChoiceLabels": [
      "Standing dynamic ultrasound of the groin",
      "Routine supine MRI of the groin and adductors",
      "Contrast CT of the groin and pelvis at rest"
    ],
    "previousCurrentUpdate": "The outside ultrasound's skin marker lies at the adductor attachment to the pubis. The phone photograph places the swelling above the inguinal ligament. Ultrasound was recorded after that swelling had subsided.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Integrate the image target and clinical episode to distinguish an untested groin question from a true adequate negative study. Then Choose targeted dynamic assessment rather than automatically advance to cross-sectional or joint imaging.",
    "reviewerNotes": "Groin/MSK review must confirm the context-specific selected sequence. The photograph does not prove hernia anatomy; an alternative MRI pathway is not declared universally inappropriate.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_3": "dynamic_ultrasound_3",
      "choice.qq20261102e.b07.d1": "choice.qq20261102d.b07.d1",
      "choice.qq20261102e.b07.d2": "choice.qq20261102d.b07.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_3": "service.ultrasound",
      "choice.qq20261102e.b07.d1": null,
      "choice.qq20261102e.b07.d2": null
    },
    "choiceTimingOverrides": {
      "dynamic_ultrasound_3": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qq20261102e.b07.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102e.b07.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      }
    },
    "currentUpdate": "The outside ultrasound's skin marker lies at the adductor attachment to the pubis. The phone photograph places the swelling above the inguinal ligament. Ultrasound was recorded after that swelling had subsided.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r6",
      "whatChanged": "Keep the site and timing observations but replace both self-disqualifying static foils with real dynamic pelvic and hip-joint protocols; use acquisition concordance to select the sequence.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B07",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Keep the site and timing record because it determines whether the canal question was tested; it no longer faces only static alternatives.",
          "cues 2: Replace the resting MRI foil with a credible dynamic pelvic study used as the key in the adequate-study counterpart B05.",
          "cues 3: Replace the resting CT foil with a real joint-focused MR protocol addressing a different plausible groin-pain pathway."
        ],
        "fairness": [
          "fairness 1: Do not infer a hernia from the photograph; select assessment of the untested target and provoking event.",
          "fairness 2: The sequence depends on anatomy/acquisition concordance, not the key being the only dynamic option. Clinical ranking remains explicitly limited to this stage."
        ],
        "suggestions": [
          "suggestions 1: Retain the real marker/photo/timing facts and offer actual competing protocols.",
          "suggestions 2: B05 now contains an adequate negative dynamic study and selects MRI; B07 retains true localization failure and selects the targeted groin assessment. No cosmetic renaming of static foils is used."
        ]
      },
      "selfCheck": {
        "cueAttack": "All three are genuine protocols; no MRI/CT option announces a static limitation. The B05/B07 pair holds the credible options constant while acquisition adequacy changes the selected next step.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Integrate the image target and clinical episode to distinguish an untested groin question from a true adequate negative study.",
          "Choose targeted dynamic assessment rather than automatically advance to cross-sectional or joint imaging."
        ],
        "oneBestAnswer": "The saved study is centered on the pubic attachment after the swelling recedes; its negative result is not an adequate examination of the reported canal event.",
        "closestDistractor": "Proceed immediately to dynamic pelvic MRI because any previous negative ultrasound is assumed to have completed the initial groin assessment.",
        "remainingReview": "Groin/MSK review must confirm the context-specific selected sequence. The photograph does not prove hernia anatomy; an alternative MRI pathway is not declared universally inappropriate."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r7",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "stem": "Which investigation should be arranged next for {patientName}'s intermittent groin swelling?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_3",
          "label": "Groin ultrasound with standing strain and cine loops",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The outside acquisition documents a different target after the event. A targeted dynamic groin assessment addresses the untested anatomical question before treating that report as a negative inguinal study."
        },
        {
          "id": "choice.qq20261102e.b07.d1",
          "label": "Pelvic MRI with strain and pubic-attachment sequences",
          "isCorrect": false,
          "distractorRationale": "This is a credible next assessment after an adequate unresolved groin ultrasound, as in B05, but the current record has not yet characterized the clinical inguinal site under provocation."
        },
        {
          "id": "choice.qq20261102e.b07.d2",
          "label": "Hip MR arthrography with labral and cartilage sequences",
          "isCorrect": false,
          "distractorRationale": "A hip-joint investigation is useful for an intra-articular question. It does not correct the documented mismatch between the clinical swelling and the sampled pubic attachment."
        }
      ],
      "explanation": "The marker, photo and timing establish that the outside report is not a completed negative dynamic inguinal assessment. Targeted groin sonography with provocation is a selected next step. Dynamic pelvic MRI remains reasonable for an adequate but unresolved study; B05 presents that different sequence. This ranking does not assert a universal ultrasound advantage over MRI or diagnose a hernia solely from the photograph.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment",
        "claim.qq20261102c.groin-imaging-after-negative-study",
        "claim.qq20261102c.groin-inadequate-study-certainty"
      ],
      "teachingPoint": "The marker, photo and timing establish that the outside report is not a completed negative dynamic inguinal assessment. Targeted groin sonography with provocation is a selected next step. Dynamic pelvic MRI remains reasonable for an adequate but unresolved study; B05 presents that different sequence. This ranking does not assert a universal ultrasound advantage over MRI or diagnose a hernia solely from the photograph."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "nextConceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound.v2",
      "previousKeyServiceId": "service.ultrasound",
      "nextKeyServiceId": "service.ultrasound",
      "previousResultGate": {
        "id": "gate.inguinal-hernia.ultrasound.3",
        "resultTypeId": "service.ultrasound",
        "pendingLabel": "Targeted dynamic groin ultrasound pending",
        "resultNarrative": "Dynamic ultrasound shows an inguinal protrusion during strain that reduces while supine. The patient has completed an exercise trial for pubic-attachment pain and can now resist adduction with less discomfort. Lifting the relative still produces the lump and makes the patient set the relative down; the episode eases after the lump is reduced.",
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
        "resultNarrative": "Dynamic ultrasound shows an inguinal protrusion during strain that reduces while supine. The patient has completed an exercise trial for pubic-attachment pain and can now resist adduction with less discomfort. Lifting the relative still produces the lump and makes the patient set the relative down; the episode eases after the lump is reduced. The attachment exercise program continues.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.ultrasound.outsourced",
          "route.ultrasound.in_house"
        ]
      },
      "reason": "Existing objective applied with revised wording/data; no concept meaning change."
    }
  },
  {
    "id": "revision.qq20261102e.b07-context",
    "auditId": "B07-context",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r6",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which next plan best addresses {patientName}'s remaining activity limitation?",
    "previousChoiceLabels": [
      "Elective hernia consultation with ongoing musculoskeletal care",
      "Further musculoskeletal rehabilitation before hernia consultation",
      "Pelvic MRI before hernia or rehabilitation planning"
    ],
    "previousCurrentUpdate": "Dynamic ultrasound shows an inguinal protrusion during strain that reduces while supine. The patient has completed an exercise trial for pubic-attachment pain and can now resist adduction with less discomfort. Lifting the relative still produces the lump and makes the patient set the relative down; the episode eases after the lump is reduced.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Separate the improving attachment response from the persistent load-related reduction-responsive episodes. Then Time referral by the remaining functional burden instead of waiting for the coexisting condition or image size to normalize.",
    "reviewerNotes": "Hernia/MSK review must confirm elective eligibility and attribution. Consultation does not promise that repair will relieve every pubic symptom.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_3": "elective_discussion_3",
      "choice.qq20261102e.b07-context.d1": "choice.qq20261102d.b07-context.d1",
      "choice.qq20261102e.b07-context.d2": "choice.qq20261102d.b07-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_3": null,
      "choice.qq20261102e.b07-context.d1": null,
      "choice.qq20261102e.b07-context.d2": null
    },
    "choiceTimingOverrides": {
      "elective_discussion_3": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b07-context.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b07-context.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "Dynamic ultrasound shows an inguinal protrusion during strain that reduces while supine. The patient has completed an exercise trial for pubic-attachment pain and can now resist adduction with less discomfort. Lifting the relative still produces the lump and makes the patient set the relative down; the episode eases after the lump is reduced. The attachment exercise program continues.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r6",
      "whatChanged": "Keep the functional and reduction-response observations; move ongoing exercise care to common context and compare parallel referral timing policies.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B07-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Remove the combined-care key; the exercise program is now common to every referral policy.",
          "cues 2: Replace care-scope differences with parallel referral timing labels, keeping the real near-miss of deferring an unresolved functional problem.",
          "cues 3: Retain reduction response for fairness and compare it with a distinct improving attachment response rather than label the cause in the task."
        ],
        "fairness": [
          "fairness 1: Preserve elective assessment with residual musculoskeletal care; do not make an operation compulsory.",
          "fairness 2: The key is no longer uniquely comprehensive. The timing follows the two differing trajectories, not a do-everything option."
        ],
        "suggestions": [
          "suggestions 1: Keep the exercise response, caregiving interruption and reduction response as requested.",
          "suggestions 2: Shared exercise care plus equal-scope referral timing removes the completion heuristic and the imaging-before-any-care foil."
        ]
      },
      "selfCheck": {
        "cueAttack": "Ongoing attachment care is in shared context; every option concerns the same hernia referral, at comparable scope and caution.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Separate the improving attachment response from the persistent load-related reduction-responsive episodes.",
          "Time referral by the remaining functional burden instead of waiting for the coexisting condition or image size to normalize."
        ],
        "oneBestAnswer": "The attachment findings improve, but caregiving still stops during the separate protrusion episode and resumes after reduction.",
        "closestDistractor": "Defer assessment until the exercise program is complete because the musculoskeletal finding remains visible or tender.",
        "remainingReview": "Hernia/MSK review must confirm elective eligibility and attribution. Consultation does not promise that repair will relieve every pubic symptom."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v3.r7",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "stem": "When should {patientName}'s hernia referral be arranged?",
      "answerChoices": [
        {
          "id": "elective_discussion_3",
          "label": "Refer during ongoing rehabilitation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The remaining functional interruption tracks the reducible protrusion despite improvement in the coexisting attachment/joint symptoms. Elective assessment need not await completion of that treatment."
        },
        {
          "id": "choice.qq20261102e.b07-context.d1",
          "label": "Refer after rehabilitation is completed",
          "isCorrect": false,
          "distractorRationale": "Residual musculoskeletal symptoms can coexist with a hernia that already limits function. Treating them first as an absolute referral prerequisite delays the separately supported hernia assessment."
        },
        {
          "id": "choice.qq20261102e.b07-context.d2",
          "label": "Refer after repeat imaging documents progression",
          "isCorrect": false,
          "distractorRationale": "Anatomical enlargement is not required before discussing an already demonstrated activity-limiting inguinal hernia. This mistakes imaging change for the relevant functional criterion."
        }
      ],
      "explanation": "The improvement on resisted adduction does not explain away the persisting interruption of caregiving during a reducible-lump episode. Elective hernia assessment can proceed while attachment rehabilitation continues. Neither completion of every exercise goal nor anatomical growth is a prerequisite to assessment of an already function-limiting hernia.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "teachingPoint": "The improvement on resisted adduction does not explain away the persisting interruption of caregiving during a reducible-lump episode. Elective hernia assessment can proceed while attachment rehabilitation continues. Neither completion of every exercise goal nor anatomical growth is a prerequisite to assessment of an already function-limiting hernia."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Existing objective applied with revised wording/data; no concept meaning change."
    }
  },
  {
    "id": "revision.qq20261102e.b08-context",
    "auditId": "B08-context",
    "caseId": "case.inguinal-hernia.lifting-bulge",
    "nodeId": "node.inguinal-hernia.lifting-bulge.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r6",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which initial care plan best fits {patientName}'s activity-limiting symptoms?",
    "previousChoiceLabels": [
      "Abdominal-attachment rehabilitation; hernia observation",
      "Adductor-focused rehabilitation with initial hernia observation",
      "Elective hernia repair before abdominal rehabilitation"
    ],
    "previousCurrentUpdate": "Dynamic MRI shows a small reducible inguinal protrusion and signal change where the lower abdominal attachment meets the pubis. Coughing causes a brief groin twinge, but ordinary walking and lifting remain possible. Repeated trunk flexion reproduces the pain that stops exercise. Resisted adduction does not reproduce it.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Notice that the current load-related episodes differ from the earlier minimally limiting hernia history, while the attachment symptoms improve. Then Change the initial observation/referral sequence according to the new functional pattern rather than preserve the earlier causal label.",
    "reviewerNotes": "Clinical review must verify the later chronology and elective eligibility. No symptom-duration cutoff, irreducibility or urgent operation is invented. The exact passed main and its earlier result remain unchanged.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_1": "elective_discussion_1",
      "choice.qq20261102e.b08-context.d1": "choice.qq20261102d.b08-context.d1",
      "choice.qq20261102e.b08-context.d2": "choice.qq20261102d.b08-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_1": null,
      "choice.qq20261102e.b08-context.d1": null,
      "choice.qq20261102e.b08-context.d2": null
    },
    "choiceTimingOverrides": {
      "elective_discussion_1": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b08-context.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b08-context.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "After the MRI, {patientName} starts rehabilitation with hernia observation. Repeated trunk flexion is now tolerated with less pain. During a later shift, a coughing or lifting episode brings out the groin lump and makes the patient put the load down; the episode settles when the lump is reduced. The attachment program continues, and the protrusion remains reducible.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r6",
      "whatChanged": "Replace the already-explained abdominal-attachment match with a later change-of-plan decision; preserve the earlier passed result but make the current trajectory change referral timing.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B08-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Remove the repeated trunk-flexion causal conclusion; give an interval improvement followed by a different work-limiting pattern that must be compared with the earlier history.",
          "cues 2: Delete the named adduction exclusion and all anatomy-specific rehabilitation foils.",
          "cues 3: The earlier ability to work is retained only in the frozen prior stage. The later update supplies changed function; simply repeating the initial observation answer is now wrong."
        ],
        "fairness": [
          "fairness 1: The earlier observation answer remains defensible for its original male/minimally limiting pattern. The later work interruption changes the current selected plan without declaring all symptomatic hernias emergencies.",
          "fairness 2: The task now requires recognizing a changed attribution/sequence against the earlier passed result, with same-scope referral timing options."
        ],
        "suggestions": [
          "suggestions 1: Retain reducibility and actual function observations; remove the redundant named-muscle exclusion.",
          "suggestions 2: Use a later response trajectory that changes management. All referral plans share ongoing rehabilitation rather than contrast anatomical labels."
        ]
      },
      "selfCheck": {
        "cueAttack": "No adductor-specific negative or anatomy-matched rehabilitation option remains. All three choices address hernia referral timing on the same continuing exercise background.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Notice that the current load-related episodes differ from the earlier minimally limiting hernia history, while the attachment symptoms improve.",
          "Change the initial observation/referral sequence according to the new functional pattern rather than preserve the earlier causal label."
        ],
        "oneBestAnswer": "The interval course adds reduction-responsive work interruption after improvement of the earlier attachment-related symptom pattern.",
        "closestDistractor": "Continue the earlier observation policy solely because the original MRI and first examination favored a musculoskeletal explanation.",
        "remainingReview": "Clinical review must verify the later chronology and elective eligibility. No symptom-duration cutoff, irreducibility or urgent operation is invented. The exact passed main and its earlier result remain unchanged."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v1.r7",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "stem": "When should {patientName}'s hernia referral be arranged?",
      "answerChoices": [
        {
          "id": "elective_discussion_1",
          "label": "Refer during ongoing rehabilitation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The remaining functional interruption tracks the reducible protrusion despite improvement in the coexisting attachment/joint symptoms. Elective assessment need not await completion of that treatment."
        },
        {
          "id": "choice.qq20261102e.b08-context.d1",
          "label": "Refer after rehabilitation is completed",
          "isCorrect": false,
          "distractorRationale": "Residual musculoskeletal symptoms can coexist with a hernia that already limits function. Treating them first as an absolute referral prerequisite delays the separately supported hernia assessment."
        },
        {
          "id": "choice.qq20261102e.b08-context.d2",
          "label": "Refer after repeat imaging documents progression",
          "isCorrect": false,
          "distractorRationale": "Anatomical enlargement is not required before discussing an already demonstrated activity-limiting inguinal hernia. This mistakes imaging change for the relevant functional criterion."
        }
      ],
      "explanation": "The earlier minimally limiting protrusion was observed while the attachment problem was treated. The later course changes that attribution: trunk-flexion pain improves, but reducible-lump episodes now interrupt work. Elective hernia assessment is supported during ongoing rehabilitation. An unchanged previous MRI or an initially incidental finding should not prevent reassessment when function changes.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution",
        "claim.bread-butter.inguinal-hernia.watchful-waiting"
      ],
      "teachingPoint": "The earlier minimally limiting protrusion was observed while the attachment problem was treated. The later course changes that attribution: trunk-flexion pain improves, but reducible-lump episodes now interrupt work. Elective hernia assessment is supported during ongoing rehabilitation. An unchanged previous MRI or an initially incidental finding should not prevent reassessment when function changes."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Existing objective applied with revised wording/data; no concept meaning change."
    }
  },
  {
    "id": "revision.qq20261102e.b11-context",
    "auditId": "B11-context",
    "caseId": "case.pigmented-skin-lesion.shoulder-border",
    "nodeId": "node.pigmented-skin-lesion.shoulder-border.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r6",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which specimen plan should be arranged next for {patientName}'s residual lesion?",
    "previousChoiceLabels": [
      "Full-thickness excisional biopsy",
      "Full-thickness incisional biopsy of the raised focus",
      "Deeper sections and immunostains of the existing block"
    ],
    "previousCurrentUpdate": "The outside tangential specimen diagram marks the flat peripheral area. Sections show atypical melanocytes along the epidermal junction with only a thin strip of papillary dermis beneath them. The central raised focus remains on examination.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Retain what the submitted cytology/architecture establishes at its mapped location. Then Distinguish that local finding from the invasive status of a different residual component before planning from a whole-lesion label.",
    "reviewerNotes": "Dermatopathology review must confirm the original qualitative cytology language and the limited positive assertion of atypia, without diagnosing melanoma from these observations. The passed shared presentation and later staging item remain exact.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_2": "excisional_2",
      "choice.qq20261102e.b11-context.d1": "choice.qq20261102d.b11-context.d1",
      "choice.qq20261102e.b11-context.d2": "choice.qq20261102d.b11-context.d2",
      "choice.qq20261102e.b11-context.d3": "choice.qq20261102d.b11-context.d1"
    },
    "choiceServiceOverrides": {
      "excisional_2": "service.skin_excisional_biopsy",
      "choice.qq20261102e.b11-context.d1": null,
      "choice.qq20261102e.b11-context.d2": null,
      "choice.qq20261102e.b11-context.d3": null
    },
    "choiceTimingOverrides": {
      "excisional_2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102e.b11-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102e.b11-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102e.b11-context.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      }
    },
    "currentUpdate": "The outside tangential specimen diagram marks the flat peripheral sector. The report describes irregular junctional nests of melanocytes with enlarged, uneven nuclei; the specimen includes a thin strip of papillary dermis. The newly raised central focus is still present at a different position on the lesion map.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r6",
      "whatChanged": "Replace repeat-excision selection with a mapped evidence-status assessment. The raw cytology and separate residual site now change the scored record; create v3 rather than merge this with the old procedural-choice history.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B11-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Whole-lesion closure feasibility remains frozen but cannot choose among the four report assessments; all share the same excision request.",
          "cues 2: The location map now determines whether the reported cellular finding can be extended to the residual focus, rather than simply eliminating block review.",
          "cues 3: The remaining focus is necessary to distinguish valid local atypia from unassessed lesion-wide invasion; the options no longer ask which specimen to take."
        ],
        "fairness": [
          "fairness 1: Do not reinterpret the junctional atypia as a measured invasive depth or a definite melanoma diagnosis; preserve the local positive finding and its limitation.",
          "fairness 2: Deleting the update now prevents deciding the two evidence assertions. Excision is shared context, so its unchanged feasibility cannot solve the new task."
        ],
        "suggestions": [
          "suggestions 1: Keep the exact passed presentation, profiles and feasibility statement; no artificial excision obstacle is introduced.",
          "suggestions 2: Score specimen-compartment and map interpretation before later planning, using balanced evidence assessments. The changed objective is versioned and requires dermatopathology review."
        ]
      },
      "selfCheck": {
        "cueAttack": "Excision is the common requested procedure, not the tested choice. Both evidence components are balanced across four comparable assessments; the key is not the sole cautious or qualified option.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Retain what the submitted cytology/architecture establishes at its mapped location.",
          "Distinguish that local finding from the invasive status of a different residual component before planning from a whole-lesion label."
        ],
        "oneBestAnswer": "The atypical junctional population belongs to the flat peripheral sector; the newly raised focus lies elsewhere and remains present.",
        "closestDistractor": "Either treat the junctional fragment as whole-lesion in-situ disease or discard every finding because the sample is partial.",
        "remainingReview": "Dermatopathology review must confirm the original qualitative cytology language and the limited positive assertion of atypia, without diagnosing melanoma from these observations. The passed shared presentation and later staging item remain exact."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r7",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
      "stem": "Which assessment should accompany {patientName}'s request for residual-lesion excision?",
      "answerChoices": [
        {
          "id": "excisional_2",
          "label": "Melanocytic atypia shown; residual-lesion invasion unassessed",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The sampled sector demonstrates a melanocytic abnormality, but that sector and tissue depth do not represent the separate residual raised focus. Retain the positive local finding without assigning a whole-lesion invasive status."
        },
        {
          "id": "choice.qq20261102e.b11-context.d1",
          "label": "Melanocytic atypia shown; residual-lesion invasion excluded",
          "isCorrect": false,
          "distractorRationale": "The positive junctional finding is retained correctly, but the unsampled focus cannot be cleared of invasion by the peripheral fragment."
        },
        {
          "id": "choice.qq20261102e.b11-context.d2",
          "label": "Melanocytic atypia unconfirmed; residual-lesion invasion unassessed",
          "isCorrect": false,
          "distractorRationale": "Sampling limits do not erase the actual cytologic/architectural abnormality in the submitted sector. This discards valid evidence while correctly withholding the whole-lesion conclusion."
        },
        {
          "id": "choice.qq20261102e.b11-context.d3",
          "label": "Melanocytic atypia unconfirmed; residual-lesion invasion excluded",
          "isCorrect": false,
          "distractorRationale": "This discards the demonstrated abnormality and extends the fragment's limitations into an unsupported statement about the residual lesion."
        }
      ],
      "explanation": "Map the reported abnormal junctional population to the sector actually sampled. It is valid evidence of atypia there, not a whole-lesion microstage. The separate raised residual focus remains unassessed for invasion. Completion pathology is needed for subsequent lesion-wide planning; a limited specimen is neither wholly useless nor a basis for clearing unrepresented tissue.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
        "claim.qq20261102e.mapped-partial-skin-evidence"
      ],
      "teachingPoint": "Map the reported abnormal junctional population to the sector actually sampled. It is valid evidence of atypia there, not a whole-lesion microstage. The separate raised residual focus remains unassessed for invasion. Completion pathology is needed for subsequent lesion-wide planning; a limited specimen is neither wholly useless nor a basis for clearing unrepresented tissue."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
      "nextConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
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
      "reason": "The score changes from selecting complete excision to adjudicating what a mapped partial specimen establishes for subsequent planning. Excision remains the shared requested procedure; retain the older procedural-selection construct and its histories."
    }
  },
  {
    "id": "revision.qq20261102e.b12-context",
    "auditId": "B12-context",
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r6",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which specimen plan should be arranged next for {patientName}'s residual lesion?",
    "previousChoiceLabels": [
      "Full-thickness excisional biopsy",
      "Full-thickness incisional biopsy of the pigmented center",
      "Deeper sections and immunostains of the existing block"
    ],
    "previousCurrentUpdate": "The outside punch diagram marks the pale peripheral area. Sections show a nevus in that fragment. The residual pigmented area has an irregular center extending beyond the punch site.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Use the map to judge local concordance rather than either accept or reject the benign result wholesale. Then Choose the tissue/architecture question that resolves the remaining center instead of repeatedly interrogating the sampled edge.",
    "reviewerNotes": "Dermatopathology review must verify that the constructed map supports the limited concordance. A benign label is not a diagnosis of the entire changing lesion; completion details require clinical sign-off.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_4": "excisional_4",
      "choice.qq20261102e.b12-context.d1": "choice.qq20261102d.b12-context.d1",
      "choice.qq20261102e.b12-context.d2": "choice.qq20261102d.b12-context.d2",
      "choice.qq20261102e.b12-context.d3": "choice.qq20261102d.b12-context.d1"
    },
    "choiceServiceOverrides": {
      "excisional_4": "service.skin_excisional_biopsy",
      "choice.qq20261102e.b12-context.d1": null,
      "choice.qq20261102e.b12-context.d2": null,
      "choice.qq20261102e.b12-context.d3": null
    },
    "choiceTimingOverrides": {
      "excisional_4": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102e.b12-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102e.b12-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102e.b12-context.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      }
    },
    "currentUpdate": "The outside punch diagram marks the pale peripheral sector. The report diagnoses a nevus in that submitted fragment. On the current lesion map, the changing irregular center lies beyond the punch circle.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r6",
      "whatChanged": "Make the benign fragment consequential to a local-versus-whole-lesion concordance decision and its completion goal, preserving the passed shared case premise.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B12-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Feasible closure remains exact shared context but does not distinguish the evidence/goal options.",
          "cues 2: Retain the benign peripheral specimen and use its mapped position for a positive limited-concordance judgment; it is not merely an excuse to discredit the block.",
          "cues 3: The unrepresented center now distinguishes what the result explains and which residual architecture must be assessed, instead of selecting an automatic excision label."
        ],
        "fairness": [
          "fairness 1: Keep the nevus diagnosis local to the submitted fragment; neither benign nor malignant whole-lesion status is asserted.",
          "fairness 2: Without the map/report update the local-versus-whole-lesion conclusions cannot be ranked. The scored objective is changed and explicitly versioned."
        ],
        "suggestions": [
          "suggestions 1: Keep the benign fragment as an observation and retain its valid local meaning.",
          "suggestions 2: Compare plausible acceptance, overextension and blanket-rejection interpretations with completion goals. The exact passed companion presentation and question remain unchanged."
        ]
      },
      "selfCheck": {
        "cueAttack": "No option obtains credit just for choosing complete excision; that is the shared requested procedure. Two options retain a residual-architecture goal, preventing a unique comprehensive-key shortcut.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Use the map to judge local concordance rather than either accept or reject the benign result wholesale.",
          "Choose the tissue/architecture question that resolves the remaining center instead of repeatedly interrogating the sampled edge."
        ],
        "oneBestAnswer": "The nevus result is from the pale edge, while the evolving center lies outside the sampled circle.",
        "closestDistractor": "Discard the benign report as necessarily false, rather than retain its limited local validity and investigate the distinct residual component.",
        "remainingReview": "Dermatopathology review must verify that the constructed map supports the limited concordance. A benign label is not a diagnosis of the entire changing lesion; completion details require clinical sign-off."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r7",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
      "stem": "Which interpretation and completion goal should accompany {patientName}'s excision request?",
      "answerChoices": [
        {
          "id": "excisional_4",
          "label": "Sampled edge explained; assess residual-lesion architecture",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The benign diagnosis can explain the tissue actually sampled without accounting for the distinct changing center. Completion should relate the residual architecture to the clinical map."
        },
        {
          "id": "choice.qq20261102e.b12-context.d1",
          "label": "Sampled edge unexplained; assess residual-lesion architecture",
          "isCorrect": false,
          "distractorRationale": "This treats the benign fragment as necessarily erroneous because the whole lesion remains concerning. The map supports limited concordance at the sampled pale edge."
        },
        {
          "id": "choice.qq20261102e.b12-context.d2",
          "label": "Whole lesion explained; review the existing edge sections",
          "isCorrect": false,
          "distractorRationale": "This extends a benign fragment to the changing unrepresented center and limits assessment to tissue that does not contain that center."
        },
        {
          "id": "choice.qq20261102e.b12-context.d3",
          "label": "Sampled edge unexplained; review the existing edge sections",
          "isCorrect": false,
          "distractorRationale": "Re-review can be useful for a true local discrepancy, but the stated concern is an unrepresented changing center; the provided map does not invalidate the edge diagnosis."
        }
      ],
      "explanation": "A benign fragment and a concerning residual lesion are not automatically mutually contradictory. The map allows the nevus result to be locally concordant at the sampled edge while leaving the changing center uncharacterized. Completion pathology must examine the residual architecture rather than extend the fragment to the whole lesion or assume the original pathologist was necessarily wrong.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
        "claim.qq20261102e.mapped-partial-skin-evidence"
      ],
      "teachingPoint": "A benign fragment and a concerning residual lesion are not automatically mutually contradictory. The map allows the nevus result to be locally concordant at the sampled edge while leaving the changing center uncharacterized. Completion pathology must examine the residual architecture rather than extend the fragment to the whole lesion or assume the original pathologist was necessarily wrong."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
      "nextConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
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
      "reason": "The score changes from selecting complete excision to adjudicating what a mapped partial specimen establishes for subsequent planning. Excision remains the shared requested procedure; retain the older procedural-selection construct and its histories."
    }
  },
  {
    "id": "revision.qq20261102e.b17-context",
    "auditId": "B17-context",
    "caseId": "case.pigmented-skin-lesion.changing-back-lesion",
    "nodeId": "node.pigmented-skin-lesion.changing-back-lesion.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r6",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which specimen plan should be arranged next for {patientName}'s residual lesion?",
    "previousChoiceLabels": [
      "Full-thickness excisional biopsy",
      "Full-thickness incisional biopsy of the raised focus",
      "Deeper sections and immunostains of the existing block"
    ],
    "previousCurrentUpdate": "The outside punch diagram marks a flat peripheral portion. The fragment contains melanoma within the epidermis, with dermis present beneath that sampled portion. The raised focus remains in the residual pigmented lesion.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Distinguish dermis being represented from dermis being invaded in the submitted sector. Then Limit the resulting in-situ classification to the sampled location rather than clear a separate residual component.",
    "reviewerNotes": "Dermatopathology/surgical review must verify the compartment interpretation and subsequent staging boundary. No nodal threshold or treatment margin is introduced, and the passed presentation and later staging task remain exact.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_1": "excisional_1",
      "choice.qq20261102e.b17-context.d1": "choice.qq20261102d.b17-context.d1",
      "choice.qq20261102e.b17-context.d2": "choice.qq20261102d.b17-context.d2",
      "choice.qq20261102e.b17-context.d3": "choice.qq20261102d.b17-context.d1"
    },
    "choiceServiceOverrides": {
      "excisional_1": "service.skin_excisional_biopsy",
      "choice.qq20261102e.b17-context.d1": null,
      "choice.qq20261102e.b17-context.d2": null,
      "choice.qq20261102e.b17-context.d3": null
    },
    "choiceTimingOverrides": {
      "excisional_1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102e.b17-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102e.b17-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102e.b17-context.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      }
    },
    "currentUpdate": "The outside punch diagram marks a flat peripheral sector. The fragment shows melanoma cells within the epidermis; dermis is present beneath that sector. The raised focus remains elsewhere in the residual pigmented area on the map.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r6",
      "whatChanged": "Score the two compartment/map assertions instead of asking for the same feasible excision again; version the changed construct and keep the old procedural selection available.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B17-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The exact closure-feasibility statement no longer selects an option because completion excision is common to the task.",
          "cues 2: The map now bounds the meaning of the in-situ finding; it does not simply make block review a weak procedural foil.",
          "cues 3: The remaining raised focus is necessary to distinguish local from whole-lesion classification, with the caution component balanced across options."
        ],
        "fairness": [
          "fairness 1: Retain that represented dermis is not the same as dermal invasion and that a peripheral in-situ component does not clear the residual focus.",
          "fairness 2: The update is essential to both scored assertions; deleting it leaves neither the sample classification nor the map boundary established."
        ],
        "suggestions": [
          "suggestions 1: Keep the shared passed premise, but ask a compartment/map-dependent classification that affects what can be carried into subsequent planning.",
          "suggestions 2: Use equal-scope balanced assessments instead of one cautious biopsy plan against premature staging. New v3 and claim mapping require dermatopathology review."
        ]
      },
      "selfCheck": {
        "cueAttack": "All four options have identical classification scope and parallel components. Both the in-situ label and the cautious residual-status phrase appear twice; neither alone identifies the key.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Distinguish dermis being represented from dermis being invaded in the submitted sector.",
          "Limit the resulting in-situ classification to the sampled location rather than clear a separate residual component."
        ],
        "oneBestAnswer": "The known melanoma is within the epidermis of a mapped flat sector; the separate raised focus is not represented.",
        "closestDistractor": "Either call the whole lesion in situ from a representative-looking punch or call the sample invasive simply because dermis is included.",
        "remainingReview": "Dermatopathology/surgical review must verify the compartment interpretation and subsequent staging boundary. No nodal threshold or treatment margin is introduced, and the passed presentation and later staging task remain exact."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r7",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
      "stem": "Which provisional classification should accompany {patientName}'s request for completion excision?",
      "answerChoices": [
        {
          "id": "excisional_1",
          "label": "Sampled sector in situ; residual-lesion invasion unassessed",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The report establishes epidermis-confined melanoma in the sampled sector. Its mapping does not establish that the separate raised residual focus is also epidermis confined."
        },
        {
          "id": "choice.qq20261102e.b17-context.d1",
          "label": "Sampled sector in situ; residual-lesion invasion excluded",
          "isCorrect": false,
          "distractorRationale": "This correctly identifies the submitted compartment but extends it to a different unrepresented part of the lesion."
        },
        {
          "id": "choice.qq20261102e.b17-context.d2",
          "label": "Sampled sector invasive; residual-lesion invasion unassessed",
          "isCorrect": false,
          "distractorRationale": "The remaining focus is unassessed, but dermis being present in the specimen is not itself evidence that melanoma invaded it."
        },
        {
          "id": "choice.qq20261102e.b17-context.d3",
          "label": "Sampled sector invasive; residual-lesion invasion excluded",
          "isCorrect": false,
          "distractorRationale": "This confuses represented dermis with invaded dermis and simultaneously makes an unsupported clearance claim for the residual component."
        }
      ],
      "explanation": "Represented tissue and involved tissue are different. Melanoma confined to the sampled epidermis establishes an in-situ component there; the mere presence of underlying dermis does not make it invasive. The map leaves a separate raised focus unrepresented, so whole-lesion invasive status must await completion pathology before subsequent planning.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
        "claim.qq20261102e.mapped-partial-skin-evidence"
      ],
      "teachingPoint": "Represented tissue and involved tissue are different. Melanoma confined to the sampled epidermis establishes an in-situ component there; the mere presence of underlying dermis does not make it invasive. The map leaves a separate raised focus unrepresented, so whole-lesion invasive status must await completion pathology before subsequent planning."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
      "nextConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
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
      "reason": "The score changes from selecting complete excision to adjudicating what a mapped partial specimen establishes for subsequent planning. Excision remains the shared requested procedure; retain the older procedural-selection construct and its histories."
    }
  },
  {
    "id": "revision.qq20261102e.b18-context",
    "auditId": "B18-context",
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r6",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which specimen plan should be arranged next for {patientName}'s residual lesion?",
    "previousChoiceLabels": [
      "Full-thickness excisional biopsy",
      "Full-thickness incisional biopsy of the firm focus",
      "Deeper sections and immunostains of the existing block"
    ],
    "previousCurrentUpdate": "The outside shave contains invasive atypical melanocytes at the deep cut surface. The reported distance from the granular layer to that cut surface is 0.6 mm. A firm focus remains within the residual lesion.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Relate the measured endpoint to the tumor-positive cut surface to determine the direction of the valid bound. Then Preserve that lower bound while withholding the final maximum needed for later threshold-dependent planning.",
    "reviewerNotes": "Dermatopathology review must confirm lower-bound reporting and measurement origin. No new numerical threshold or sentinel-node indication is authored; the existing constructed 0.6-mm observation is retained.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_3": "excisional_3",
      "choice.qq20261102e.b18-context.d1": "choice.qq20261102d.b18-context.d1",
      "choice.qq20261102e.b18-context.d2": "choice.qq20261102d.b18-context.d2",
      "choice.qq20261102e.b18-context.d3": "choice.qq20261102d.b18-context.d1"
    },
    "choiceServiceOverrides": {
      "excisional_3": "service.skin_excisional_biopsy",
      "choice.qq20261102e.b18-context.d1": null,
      "choice.qq20261102e.b18-context.d2": null,
      "choice.qq20261102e.b18-context.d3": null
    },
    "choiceTimingOverrides": {
      "excisional_3": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102e.b18-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102e.b18-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102e.b18-context.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      }
    },
    "currentUpdate": "The outside shave contains invasive atypical melanocytes at the deep cut surface. The measured distance from the granular layer to that cut surface is 0.6 mm. The firm focus remains in the residual lesion.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r6",
      "whatChanged": "Make the transected depth consequential to the report/planning record. Compare lower-bound, upper-bound, exact-maximum and discarded-measurement errors at equal scope; version the changed objective.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B18-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Closure feasibility remains frozen but does not choose among the four depth records; excision is common context.",
          "cues 2: Keep the actual tumor-positive cut surface because its relation to the measured endpoint determines the correct bound; it no longer merely discredits deeper sections as a procedural foil.",
          "cues 3: The residual focus supplies the completion context, but the key depends on interpreting the measurement rather than simply noticing residual tissue."
        ],
        "fairness": [
          "fairness 1: Retain a lower bound without treating the constructed value as a complete maximum or a clinical cutoff.",
          "fairness 2: The 0.6-mm value is now the scored planning datum. Three alternatives also await completion, so the key is not found by choosing the most cautious label.",
          "fairness 3: Do not add any nodal-stage threshold or unsupported numerical management rule; final maximum and subsequent clinical decisions remain pending."
        ],
        "suggestions": [
          "suggestions 1: Make the cut surface and depth determine a real reporting interpretation rather than retain an unused number.",
          "suggestions 2: Compare equally scoped lower/upper/exact/unknown records. The shared passed presentation is exact; the new interpretation construct requires pathology and surgical review."
        ]
      },
      "selfCheck": {
        "cueAttack": "Three options await a final maximum, so caution alone cannot choose the key. The retained number changes the scored bound, rather than merely decorate an excision decision.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Relate the measured endpoint to the tumor-positive cut surface to determine the direction of the valid bound.",
          "Preserve that lower bound while withholding the final maximum needed for later threshold-dependent planning."
        ],
        "oneBestAnswer": "Invasive cells reach the very cut surface used as the measurement endpoint; the residual firm focus remains.",
        "closestDistractor": "Discard all depth information out of caution, or treat a precise-looking number as the final maximum.",
        "remainingReview": "Dermatopathology review must confirm lower-bound reporting and measurement origin. No new numerical threshold or sentinel-node indication is authored; the existing constructed 0.6-mm observation is retained."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r7",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
      "stem": "How should the reported depth be carried into {patientName}'s completion-excision planning?",
      "answerChoices": [
        {
          "id": "excisional_3",
          "label": "Retain at least 0.6 mm; await the final maximum depth",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The measured invasive component is valid as a lower bound because tumor reaches the cut base. The unsampled continuation can increase the maximum; it cannot erase the measured extent."
        },
        {
          "id": "choice.qq20261102e.b18-context.d1",
          "label": "Retain at most 0.6 mm; await the final maximum depth",
          "isCorrect": false,
          "distractorRationale": "This reverses the bound. Tumor at the cut base can continue deeper, so the observed depth cannot be used as an upper limit."
        },
        {
          "id": "choice.qq20261102e.b18-context.d2",
          "label": "Retain exactly 0.6 mm; use it as the maximum depth",
          "isCorrect": false,
          "distractorRationale": "The number is a distance to a tumor-positive cut surface, not necessarily the deepest tumor in the lesion. Using it as a complete maximum can understate the lesion."
        },
        {
          "id": "choice.qq20261102e.b18-context.d3",
          "label": "Retain no measured depth; await the final maximum depth",
          "isCorrect": false,
          "distractorRationale": "The incomplete base prevents an exact whole-lesion maximum, but it does not invalidate the already measured invasive extent. Blanket uncertainty loses a valid lower bound."
        }
      ],
      "explanation": "The 0.6-mm observation reaches a cut surface containing invasive cells. Carry it forward as at least that depth, not as a whole-lesion maximum and not as no information. Completion pathology is required to determine the final maximum before any threshold-dependent subsequent plan. The constructed measurement is not itself a treatment or nodal-staging threshold.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
        "claim.qq20261102e.transected-depth-lower-bound"
      ],
      "teachingPoint": "The 0.6-mm observation reaches a cut surface containing invasive cells. Carry it forward as at least that depth, not as a whole-lesion maximum and not as no information. Completion pathology is required to determine the final maximum before any threshold-dependent subsequent plan. The constructed measurement is not itself a treatment or nodal-staging threshold."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
      "nextConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
      "previousKeyServiceId": "service.skin_excisional_biopsy",
      "nextKeyServiceId": "service.skin_excisional_biopsy",
      "previousResultGate": {
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
      "reason": "The score changes from selecting complete excision to adjudicating what a mapped partial specimen establishes for subsequent planning. Excision remains the shared requested procedure; retain the older procedural-selection construct and its histories."
    }
  },
  {
    "id": "revision.qq20261102e.b19-context",
    "auditId": "B19-context",
    "caseId": "case.soft-tissue-mass.deep-thigh",
    "nodeId": "node.soft-tissue-mass.deep-thigh.1",
    "previousQuestionVariantId": "question.soft-tissue-mass.extremity-mri.v1.r6",
    "questionVariantId": "question.soft-tissue-mass.extremity-mri.v1.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which imaging plan should precede {patientName}'s biopsy?",
    "previousChoiceLabels": [
      "Local MRI encompassing the lesion and compartment relationships",
      "Targeted ultrasound of the palpable region for core-biopsy planning",
      "FDG PET/CT with targeting of the most avid region"
    ],
    "previousCurrentUpdate": "The top axial slice of the outside MRI still passes through the thigh mass. The included portion has solid enhancing regions. The palpable proximal extent continues beyond that slice.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Distinguish actual enhancement from pre-existing T1 brightness using matched acquisitions. Then Integrate viable-target information with the proposed tract's compartment relationships before carrying a plan forward.",
    "reviewerNotes": "MSK radiology/sarcoma review must verify the qualitative signal and tract model. No signal cutoff, gadolinium rule, needle dimension or automatic imaging diagnosis is introduced. The later exact passed biopsy-planning item is retained and its new preceding scaffold is disclosed in the packet.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "extremity_mri_1": "extremity_mri_1",
      "choice.qq20261102e.b19-context.d1": "choice.qq20261102d.b19-context.d1",
      "choice.qq20261102e.b19-context.d2": "choice.qq20261102d.b19-context.d2"
    },
    "choiceServiceOverrides": {
      "extremity_mri_1": "service.extremity_mri",
      "choice.qq20261102e.b19-context.d1": null,
      "choice.qq20261102e.b19-context.d2": null
    },
    "choiceTimingOverrides": {
      "extremity_mri_1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102e.b19-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102e.b19-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      }
    },
    "currentUpdate": "The outside MRI covers the entire thigh mass. The involved muscle is rectus femoris; the adjacent adductor compartment is separate from it. The table describes matched T1 acquisitions and the proposed needle corridors. The three regions can each be reached percutaneously.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.soft-tissue-mass.extremity-mri.v1.r6",
      "whatChanged": "Replace obvious coverage repair with a radiology-report target/tract decision from matched signal observations and compartment anatomy; version the materially changed scored objective.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B19-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Coverage is now adequate and common, so a field-of-view failure cannot directly select the answer.",
          "cues 2: Remove the repeated palpable-extent statement; both sequence comparison and corridor anatomy now determine the plan.",
          "cues 3: Replace the uniquely complete MRI label with three equal-scope region/corridor recommendations."
        ],
        "fairness": [
          "fairness 1: Keep MRI before actual biopsy and separate the planning report from execution. The new construct does not diagnose malignancy or alter the passed later node.",
          "fairness 2: No competitor is defeated merely because ultrasound previously missed a margin. Both wrong plans satisfy one of the two required observations and represent credible single-factor errors.",
          "fairness 3: Enhancement now has a genuine competing role: two targets enhance, while the safe-compartment consideration separates them; the convenient third region tests mistaking brightness for enhancement."
        ],
        "suggestions": [
          "suggestions 1: State adequate coverage once and remove the redundant gap description.",
          "suggestions 2: Make matched enhancement and compartment anatomy change a same-scope target/corridor recommendation; use existing verified viable-target and tract claims, with a new construct version and specialist review."
        ]
      },
      "selfCheck": {
        "cueAttack": "All labels name only a region and corridor at identical scope. No option advertises more complete coverage, caution or diagnostic certainty; raw sequence and anatomy observations are both necessary.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Distinguish actual enhancement from pre-existing T1 brightness using matched acquisitions.",
          "Integrate viable-target information with the proposed tract's compartment relationships before carrying a plan forward."
        ],
        "oneBestAnswer": "R increases after contrast and its corridor stays through the involved rectus femoris; P lacks that signal increase and Q's route crosses adductor muscle.",
        "closestDistractor": "Choose the viable medial target without noticing the extra compartment, or choose an anatomically convenient bright region without comparing the precontrast series.",
        "remainingReview": "MSK radiology/sarcoma review must verify the qualitative signal and tract model. No signal cutoff, gadolinium rule, needle dimension or automatic imaging diagnosis is introduced. The later exact passed biopsy-planning item is retained and its new preceding scaffold is disclosed in the packet."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.extremity-mri.v1.r7",
      "conceptId": "concept.soft-tissue-mass.extremity-mri.v3",
      "stem": "Which proposed target and corridor should {patientName}'s radiology planning report carry forward?",
      "answerChoices": [
        {
          "id": "extremity_mri_1",
          "label": "Region R through the anterior corridor",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "This region shows a contrast-related signal increase and can be approached through the involved muscle, integrating viability with a tract that avoids a separate unaffected compartment."
        },
        {
          "id": "choice.qq20261102e.b19-context.d1",
          "label": "Region P through the anterior corridor",
          "isCorrect": false,
          "distractorRationale": "The corridor stays in the involved compartment, but pre-existing T1 brightness without a contrast-related increase is not the supplied evidence of a viable target. Brightness alone is not enhancement."
        },
        {
          "id": "choice.qq20261102e.b19-context.d2",
          "label": "Region Q through the medial corridor",
          "isCorrect": false,
          "distractorRationale": "This region enhances, but its proposed route crosses a separate adductor compartment. Target enhancement does not remove the tract-planning consequence."
        }
      ],
      "explanation": "Compare precontrast with postcontrast signal rather than call every bright region enhancing. Then evaluate the corridor independently: a viable target does not justify contaminating a separate uninvolved compartment. Region R supplies both the supported enhancement information and a corridor through rectus femoris. This is a planning-report decision, not an additional biopsy order or proof of malignancy.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.mri",
        "claim.qq20261102a.sarcoma-local-imaging",
        "claim.qq20261102c.sarcoma-mri-coverage-and-target",
        "claim.qq20261102a.sarcoma-viable-biopsy-target",
        "claim.qq20261102b.sarcoma-method-and-tract",
        "claim.qq20261102c.sarcoma-enhancement-biopsy-target"
      ],
      "teachingPoint": "Compare precontrast with postcontrast signal rather than call every bright region enhancing. Then evaluate the corridor independently: a viable target does not justify contaminating a separate uninvolved compartment. Region R supplies both the supported enhancement information and a corridor through rectus femoris. This is a planning-report decision, not an additional biopsy order or proof of malignancy.",
      "exhibit": {
        "kind": "table",
        "caption": "Constructed MRI planning observations; precontrast and postcontrast images use matched acquisition parameters.",
        "columnHeaders": [
          "Region P",
          "Region Q",
          "Region R"
        ],
        "rowHeaders": [
          "T1 before contrast",
          "T1 after contrast",
          "Proposed corridor"
        ],
        "cells": [
          [
            "Bright",
            "Low signal",
            "Low signal"
          ],
          [
            "Bright, unchanged",
            "Increased signal",
            "Increased signal"
          ],
          [
            "Anterior, through rectus femoris",
            "Medial, through adductor muscle",
            "Anterior, through rectus femoris"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.soft-tissue-mass.extremity-mri.v2",
      "nextConceptId": "concept.soft-tissue-mass.extremity-mri.v3",
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
      "reason": "The score changes from choosing MRI completion for field coverage to selecting a target/tract from actual MRI findings. Preserve v2 imaging-adequacy history and the exact passed later biopsy-planning version."
    }
  },
  {
    "id": "revision.qq20261102e.b21-context",
    "auditId": "B21-context",
    "caseId": "case.l2.colonic-lipoma.direct.typical-a",
    "nodeId": "node.colonic-lipoma.recognition.patient-to-diagnosis.v1",
    "previousQuestionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r6",
    "questionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which paired conclusion should be recorded about {patientName}'s lesion and the outside specimen?",
    "previousChoiceLabels": [
      "Submucosal fatty lesion; histologic confirmation not obtained",
      "Submucosal fatty lesion; histologic confirmation obtained",
      "Mucosal epithelial lesion; histologic confirmation not obtained",
      "Mucosal epithelial lesion; histologic confirmation obtained"
    ],
    "previousCurrentUpdate": "A previous forceps specimen is reported as normal colonic mucosa. The submitted tissue contains colonic crypts and lamina propria; no fat or submucosal tissue is identified.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Infer the specimen's represented wall compartment from its constituents rather than an authored absent-tissue label. Then Distinguish compatibility from lesional tissue confirmation without treating a nonsampling result as a contradiction of classic imaging.",
    "reviewerNotes": "GI/pathology review must confirm the tissue-depth interpretation. The exact classic phenotype and passed no-directed-follow-up version remain unchanged; absent tissue proof is not an automatic repeat-biopsy indication.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "colonic_lipoma": "colonic_lipoma",
      "choice.qq20261102e.b21-context.d1": "choice.qq20261102d.b21-context.d1",
      "choice.qq20261102e.b21-context.d2": "choice.qq20261102d.b21-context.d2",
      "choice.qq20261102e.b21-context.d3": "choice.qq20261102d.b21-context.d3"
    },
    "choiceServiceOverrides": {
      "colonic_lipoma": null,
      "choice.qq20261102e.b21-context.d1": null,
      "choice.qq20261102e.b21-context.d2": null,
      "choice.qq20261102e.b21-context.d3": null
    },
    "choiceTimingOverrides": {
      "colonic_lipoma": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b21-context.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b21-context.d2": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b21-context.d3": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "A previous forceps specimen is reported as normal colonic mucosa. The submitted sections contain colonic crypts and lamina propria.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r6",
      "whatChanged": "Remove the explicit absent-fat/submucosa sentence; replace the already-excluded lesion-category matrix with a concordance-versus-confirmation matrix for the same imaged lesion.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B21-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The frozen presentation retains subepithelial, but every option now concerns the same imaged lesion; no mucosal-diagnosis alternatives are pre-excluded.",
          "cues 2: Delete the explicit absent-fat/submucosa explanation. Residents must infer the represented compartment from actual crypts and lamina propria.",
          "cues 3: Replace lesion-category matching with balanced compatibility and tissue-confirmation assertions; no phrase occurs only in the key."
        ],
        "fairness": [
          "fairness 1: Preserve compatibility with the classic phenotype while distinguishing it from histologic proof.",
          "fairness 2: The specimen remains essential, and the second inference concerns whether a nonlesional result contradicts or merely fails to confirm imaging.",
          "fairness 3: No repeat-biopsy requirement is added; the passed asymptomatic management item and its premise stay exact."
        ],
        "suggestions": [
          "suggestions 1: Retain the constituent list and remove its redundant interpreted absence sentence.",
          "suggestions 2: Compare confirmation, compatibility and apparent contradiction of the same imaged lesion, not a mucosal category already excluded by the presentation."
        ]
      },
      "selfCheck": {
        "cueAttack": "No option is a mucosal epithelial diagnosis that the frozen presentation already excludes. Both compatibility and confirmation components are balanced; the key is not the only cautious interpretation.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Infer the specimen's represented wall compartment from its constituents rather than an authored absent-tissue label.",
          "Distinguish compatibility from lesional tissue confirmation without treating a nonsampling result as a contradiction of classic imaging."
        ],
        "oneBestAnswer": "The imaged lesion occupies the third wall layer while the submitted constituents are crypts and lamina propria.",
        "closestDistractor": "Treat a benign or compatible pathology label as histologic confirmation of the imaged mass, or treat lack of that confirmation as a refutation.",
        "remainingReview": "GI/pathology review must confirm the tissue-depth interpretation. The exact classic phenotype and passed no-directed-follow-up version remain unchanged; absent tissue proof is not an automatic repeat-biopsy indication."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r7",
      "conceptId": "concept.colonic-lipoma.endoscopic-recognition.v3",
      "stem": "Which interpretation of the outside specimen should accompany {patientName}'s imaging assessment?",
      "answerChoices": [
        {
          "id": "colonic_lipoma",
          "label": "Compatible with imaging; lesional histology remains unconfirmed",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The constituents correspond to the overlying mucosa, not a tissue diagnosis of the deeper imaged mass. A locally normal surface specimen does not contradict the integrated classic imaging phenotype."
        },
        {
          "id": "choice.qq20261102e.b21-context.d1",
          "label": "Compatible with imaging; lesional histology is confirmed",
          "isCorrect": false,
          "distractorRationale": "The surface finding can be compatible, but it does not itself represent the imaged third-layer mass. Agreement is not the same as lesional tissue confirmation."
        },
        {
          "id": "choice.qq20261102e.b21-context.d2",
          "label": "Inconsistent with imaging; lesional histology remains unconfirmed",
          "isCorrect": false,
          "distractorRationale": "The lack of a lesional specimen is recognized, but ordinary mucosa above the lesion is not evidence that the imaging characterization is wrong."
        },
        {
          "id": "choice.qq20261102e.b21-context.d3",
          "label": "Inconsistent with imaging; lesional histology is confirmed",
          "isCorrect": false,
          "distractorRationale": "This both overstates what was sampled and treats a compatible surface finding as a conflicting lesional diagnosis."
        }
      ],
      "explanation": "Identify what tissue the crypts and lamina propria represent, then judge concordance separately from confirmation. Overlying mucosa can be normal above the classic imaged third-layer lesion. It neither histologically confirms that mass nor contradicts its integrated characterization. This distinction does not create an indication for another biopsy or change the passed management premise.",
      "supportingEvidenceClaimIds": [
        "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
        "claim.qq20261102a.subepithelial-integrated-pattern",
        "claim.qq20261102c.classic-lipoma-normal-mucosal-sample",
        "claim.qq20261102d.lipoma-histology-provenance"
      ],
      "teachingPoint": "Identify what tissue the crypts and lamina propria represent, then judge concordance separately from confirmation. Overlying mucosa can be normal above the classic imaged third-layer lesion. It neither histologically confirms that mass nor contradicts its integrated characterization. This distinction does not create an indication for another biopsy or change the passed management premise."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.colonic-lipoma.endoscopic-recognition.v3",
      "nextConceptId": "concept.colonic-lipoma.endoscopic-recognition.v3",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Existing objective applied with revised wording/data; no concept meaning change."
    }
  },
  {
    "id": "revision.qq20261102e.b22-context",
    "auditId": "B22-context",
    "caseId": "case.l2.colonic-lipoma.direct.typical-b",
    "nodeId": "node.colonic-lipoma.recognition.patient-to-diagnosis.v2",
    "previousQuestionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r6",
    "questionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which paired conclusion should be recorded about {patientName}'s lesion and the outside specimen?",
    "previousChoiceLabels": [
      "Submucosal fatty lesion; histologic confirmation not obtained",
      "Submucosal fatty lesion; histologic confirmation obtained",
      "Mucosal epithelial lesion; histologic confirmation not obtained",
      "Mucosal epithelial lesion; histologic confirmation obtained"
    ],
    "previousCurrentUpdate": "The outside report labels a bite-on-bite specimen benign. Its levels contain colonic epithelium, crypts and lamina propria; no fat or submucosal tissue is identified in the submitted fragments.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Use actual specimen constituents instead of the biopsy technique or benign label to infer what was sampled. Then Keep compatibility and histologic confirmation separate when carrying the result into the integrated assessment.",
    "reviewerNotes": "GI/pathology review must confirm the constructed specimen depth; do not generalize that bite-on-bite never samples a lesion. No mandatory repeat biopsy or surveillance change is introduced.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "colonic_lipoma": "colonic_lipoma",
      "choice.qq20261102e.b22-context.d1": "choice.qq20261102d.b22-context.d1",
      "choice.qq20261102e.b22-context.d2": "choice.qq20261102d.b22-context.d2",
      "choice.qq20261102e.b22-context.d3": "choice.qq20261102d.b22-context.d3"
    },
    "choiceServiceOverrides": {
      "colonic_lipoma": null,
      "choice.qq20261102e.b22-context.d1": null,
      "choice.qq20261102e.b22-context.d2": null,
      "choice.qq20261102e.b22-context.d3": null
    },
    "choiceTimingOverrides": {
      "colonic_lipoma": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b22-context.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b22-context.d2": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b22-context.d3": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "The outside report labels a bite-on-bite specimen benign. Its levels contain colonic epithelium, crypts and lamina propria.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r6",
      "whatChanged": "Delete the interpreted absent-tissue phrase and score technique-versus-specimen provenance plus concordance, with balanced same-lesion evidence interpretations.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B22-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Remove the mucosal-epithelial alternatives; all choices interpret the same subepithelial imaging finding.",
          "cues 2: Delete the explicit absent-fat/submucosa sentence while retaining the actual constituents and outside benign label.",
          "cues 3: Balance concordance and confirmation components across four interpretations, requiring both to be inferred rather than copied from the stem."
        ],
        "fairness": [
          "fairness 1: Keep the limited statement that this submitted specimen does not establish a lesional diagnosis; do not reject the entire benign report.",
          "fairness 2: Both actual compartment and the meaning of a compatible nonlesional result are now scored; a technique name cannot supply the answer.",
          "fairness 3: The technique is not universally called inadequate and the passed management premise is exact."
        ],
        "suggestions": [
          "suggestions 1: Keep technique, outside label and constituents; remove the teaching absence phrase.",
          "suggestions 2: Compare interpretations of this same lesion and specimen without requiring another biopsy or changing the asymptomatic management decision."
        ]
      },
      "selfCheck": {
        "cueAttack": "No epithelial-versus-subepithelial option split remains. Both confidence components occur twice, and the raw constituent list does not name the conclusion.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Use actual specimen constituents instead of the biopsy technique or benign label to infer what was sampled.",
          "Keep compatibility and histologic confirmation separate when carrying the result into the integrated assessment."
        ],
        "oneBestAnswer": "The biopsy technique sounds deep, but the listed submitted constituents are mucosal; the frozen imaging phenotype is otherwise classic.",
        "closestDistractor": "Assume bite-on-bite plus benign means the imaged lesion has a benign tissue diagnosis.",
        "remainingReview": "GI/pathology review must confirm the constructed specimen depth; do not generalize that bite-on-bite never samples a lesion. No mandatory repeat biopsy or surveillance change is introduced."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r7",
      "conceptId": "concept.colonic-lipoma.endoscopic-recognition.v3",
      "stem": "Which interpretation of the outside specimen should accompany {patientName}'s imaging assessment?",
      "answerChoices": [
        {
          "id": "colonic_lipoma",
          "label": "Compatible with imaging; lesional histology remains unconfirmed",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The specimen's actual constituents, rather than its technique label, establish the represented compartment. Normal surface tissue is compatible with the deeper imaged lesion but does not provide its histologic confirmation."
        },
        {
          "id": "choice.qq20261102e.b22-context.d1",
          "label": "Compatible with imaging; lesional histology is confirmed",
          "isCorrect": false,
          "distractorRationale": "This credits the benign or bite-on-bite label as proof that the imaged mass was sampled, without using the listed tissue constituents."
        },
        {
          "id": "choice.qq20261102e.b22-context.d2",
          "label": "Inconsistent with imaging; lesional histology remains unconfirmed",
          "isCorrect": false,
          "distractorRationale": "The mass is unconfirmed histologically, but a benign overlying mucosal specimen does not conflict with the integrated classic imaging characterization."
        },
        {
          "id": "choice.qq20261102e.b22-context.d3",
          "label": "Inconsistent with imaging; lesional histology is confirmed",
          "isCorrect": false,
          "distractorRationale": "This treats a technique label as proof of lesional tissue and then misreads the benign surface result as a conflicting diagnosis."
        }
      ],
      "explanation": "The technique name does not establish the depth reached in this particular submitted specimen. The constituents represent surface mucosa. That can agree with the overlying surface of the classic imaged lesion while leaving lesional histology unconfirmed. This is neither a universal criticism of bite-on-bite biopsy nor a reason by itself to repeat sampling.",
      "supportingEvidenceClaimIds": [
        "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
        "claim.qq20261102a.subepithelial-integrated-pattern",
        "claim.qq20261102c.classic-lipoma-normal-mucosal-sample",
        "claim.qq20261102d.lipoma-histology-provenance"
      ],
      "teachingPoint": "The technique name does not establish the depth reached in this particular submitted specimen. The constituents represent surface mucosa. That can agree with the overlying surface of the classic imaged lesion while leaving lesional histology unconfirmed. This is neither a universal criticism of bite-on-bite biopsy nor a reason by itself to repeat sampling."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.colonic-lipoma.endoscopic-recognition.v3",
      "nextConceptId": "concept.colonic-lipoma.endoscopic-recognition.v3",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Existing objective applied with revised wording/data; no concept meaning change."
    }
  },
  {
    "id": "revision.qq20261102e.b24",
    "auditId": "B24",
    "caseId": "case.l2.gastric-malt.cd20-boundary.v1",
    "nodeId": "node.gastric-malt.cd20-alone-boundary.v1",
    "previousQuestionVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r6",
    "questionVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which conclusion and histology-review goal are supported by {patientName}'s current findings?",
    "previousChoiceLabels": [
      "Clonal B-cell infiltrate; assess cytology and architecture",
      "Clonal B-cell infiltrate, MALT type; assess large-cell component",
      "Clonal B-cell infiltrate, reactive type; assess Helicobacter activity"
    ],
    "previousCurrentUpdate": "The biopsy container identifies one antral site. Mucosa remains in the submitted block for further sections.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the three raw architectural patterns rather than equate clonality, a prominent follicle or individual large cells with a subtype. Then Select the area supplying the specific small-cell/gland relationship for integrated classification.",
    "reviewerNotes": "Hematopathology must verify all constructed field descriptions, their relative diagnostic value and the distinction between scattered large cells and a large-cell component. No obligatory morphology-only diagnostic criterion or unsupported repeat/molecular hierarchy is taught.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "lineage_not_diagnosis": "lineage_not_diagnosis",
      "choice.qq20261102e.b24.d1": "choice.qq20261102d.b24.d1",
      "choice.qq20261102e.b24.d2": "choice.qq20261102d.b24.d2"
    },
    "choiceServiceOverrides": {
      "lineage_not_diagnosis": null,
      "choice.qq20261102e.b24.d1": null,
      "choice.qq20261102e.b24.d2": null
    },
    "choiceTimingOverrides": {
      "lineage_not_diagnosis": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b24.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b24.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": "Additional levels from the same gastric block show the three areas described in the table.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r6",
      "whatChanged": "Replace polarized subtype labels plus a uniquely cautious key with actual deeper-level field observations and equal-scope area choices; delete the remaining-block permission sentence.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B24",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The key no longer offers broad assessment against two subtype commitments. All choices select a field for the identical integrated assessment.",
          "cues 2: Delete the MALT-type/large-cell downstream label. A real large-cell-containing field is an equal-scope competitor whose pattern must be interpreted.",
          "cues 3: Delete the invented reactive-type reporting label. The follicular field is described with actual observations rather than a confident alternative diagnosis.",
          "cues 4: Remove the remaining-block permission sentence. The update supplies new actual morphology, which is necessary to choose an area."
        ],
        "fairness": [
          "fairness 1: Keep clonality as insufficient by itself; the deeper levels now add positive architectural evidence, rather than use preserved glands to exclude every lymphoma.",
          "fairness 2: The key has no uniquely cautious or comprehensive scope. Two raw morphology interpretations now precede selecting the field for classification.",
          "fairness 3: No formal reactive subtype is invented and no universal requirement for lymphoepithelial lesions is asserted; final integrated classification requires hematopathology review."
        ],
        "suggestions": [
          "suggestions 1: Compare specific observed morphology at one classification stage, under the shared known clonal B-cell finding.",
          "suggestions 2: Delete availability padding and avoid a hierarchy of repeat sampling versus molecular tests. Use existing primary/review mappings and require hematopathology verification of the new raw field model."
        ]
      },
      "selfCheck": {
        "cueAttack": "All options identify an area for the same assessment, with identical scope and caution. No option is uniquely unclassified, comprehensive or noncommittal, and no formal 'reactive type' label is invented.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the three raw architectural patterns rather than equate clonality, a prominent follicle or individual large cells with a subtype.",
          "Select the area supplying the specific small-cell/gland relationship for integrated classification."
        ],
        "oneBestAnswer": "Area B supplies both small B-cell morphology and gland epithelial infiltration/disruption; the alternatives supply different real features without that combined pattern.",
        "closestDistractor": "Prioritize the most visually atypical large cells or the most conspicuous follicle instead of the architecture relevant to this small clonal B-cell question.",
        "remainingReview": "Hematopathology must verify all constructed field descriptions, their relative diagnostic value and the distinction between scattered large cells and a large-cell component. No obligatory morphology-only diagnostic criterion or unsupported repeat/molecular hierarchy is taught."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.cd20-alone-boundary.v1.r7",
      "conceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "stem": "Which area should be prioritized as evidence for {patientName}'s subtype classification?",
      "answerChoices": [
        {
          "id": "lineage_not_diagnosis",
          "label": "Area B for integrated subtype assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Small B-cell morphology together with gland-infiltrating epithelial disruption contributes the architecture that a clone alone cannot supply. It supports integrated MALT assessment without making one feature universally required or sufficient."
        },
        {
          "id": "choice.qq20261102e.b24.d1",
          "label": "Area A for integrated subtype assessment",
          "isCorrect": false,
          "distractorRationale": "A conspicuous follicle and its polarized, macrophage-rich pattern can attract attention, but those features alone do not provide the gland-infiltrating small-cell evidence in the other area."
        },
        {
          "id": "choice.qq20261102e.b24.d2",
          "label": "Area C for integrated subtype assessment",
          "isCorrect": false,
          "distractorRationale": "Large cells can attract concern for transformation, but scattered large cells among smaller lymphocytes do not themselves establish a diffuse large-cell component. The offered focal pattern does not replace integrated subtype morphology."
        }
      ],
      "explanation": "The deeper levels change the available morphology. Small B cells entering and disrupting gland epithelium provide relevant architecture alongside the clonal lineage finding. A prominent polarized follicle or scattered large cells must also be reviewed, but neither by itself establishes the subtype or a transformed large-cell process. Classification remains an integrated hematopathology judgment; lymphoepithelial lesions are not asserted to be universally necessary.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.integrated-pathologic-recognition",
        "claim.qq20261102a.gastric-lineage-not-classification",
        "claim.qq20261102b.gastric-clone-not-diagnosis",
        "claim.qq20261102b.gastric-uncertainty-repeat-biopsy",
        "claim.qq20261102c.gastric-clonality-classification-boundary"
      ],
      "teachingPoint": "The deeper levels change the available morphology. Small B cells entering and disrupting gland epithelium provide relevant architecture alongside the clonal lineage finding. A prominent polarized follicle or scattered large cells must also be reviewed, but neither by itself establishes the subtype or a transformed large-cell process. Classification remains an integrated hematopathology judgment; lymphoepithelial lesions are not asserted to be universally necessary.",
      "exhibit": {
        "kind": "table",
        "caption": "Constructed observations from deeper histology levels.",
        "columnHeaders": [
          "Area A",
          "Area B",
          "Area C"
        ],
        "rowHeaders": [
          "Cell arrangement",
          "Relationship to gastric glands"
        ],
        "cells": [
          [
            "Polarized follicle with numerous macrophages among mixed lymphoid cells",
            "Irregular groups of small CD20-positive cells",
            "Scattered large cells with vesicular nuclei among smaller lymphocytes"
          ],
          [
            "Glands displaced around the follicle",
            "Small cells cross into gland epithelium with focal epithelial disruption",
            "Large cells lie between preserved glands"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "nextConceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Existing objective applied with revised wording/data; no concept meaning change."
    }
  },
  {
    "id": "revision.qq20261102e.b36",
    "auditId": "B36",
    "caseId": "case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
    "nodeId": "node.gs028se.pdsa-act-qi-measures.a-abandon-harm.1",
    "previousQuestionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r6",
    "questionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v8"
    ],
    "previousStem": "Which comparison should {patientName}'s team use for its next PDSA test?",
    "previousChoiceLabels": [
      "Form workflow versus prefilled fields",
      "Form workflow versus a reconciliation checklist",
      "Form workflow versus reordered review items"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "table",
      "caption": "Constructed data from ten visits per process. Time rows are total staff-minutes; the contact row counts contacts arising from those same ten visits.",
      "columnHeaders": [
        "Previous process",
        "Current form"
      ],
      "rowHeaders": [
        "Medication-reconciliation interview",
        "Transfer into the form",
        "Final clinician review",
        "Unplanned medication-clarification contacts"
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
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Separate the source-related agreement pattern from the entry-method time pattern using the existing comparisons. Then Choose the untested combination and comparison that could preserve one observed benefit while checking the other outcome.",
    "reviewerNotes": "QI/owner review should confirm the constructed comparison's plausibility and that the inference is only a next-cycle hypothesis, not a causal claim. Counts/time denominators remain explicit; no patient/question correctness data is collected.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_abandon-harm": "correct_abandon-harm",
      "choice.qq20261102e.b36.d1": "choice.qq20261102d.b36.d1",
      "choice.qq20261102e.b36.d2": "choice.qq20261102d.b36.d2"
    },
    "choiceServiceOverrides": {
      "correct_abandon-harm": null,
      "choice.qq20261102e.b36.d1": null,
      "choice.qq20261102e.b36.d2": null
    },
    "choiceTimingOverrides": {
      "correct_abandon-harm": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b36.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102e.b36.d2": {
        "kind": "no_test"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r6",
      "whatChanged": "Replace one changed time row with a coherent three-workflow source-by-entry pilot. Use agreement and burden tradeoffs to select a controlled next test rather than one option per workflow component.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review5-20261102.json#B36",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Keep ten visits per workflow, separate minutes/forms/contacts, coherent denominators and actual meaningful baselines for every source/method comparison.",
          "fairness 2: Do not assert that current-source prefill will work; agreement/contact checks remain part of the next test and no rollout gate is introduced.",
          "fairness 3: Both source and method contrasts must be interpreted to choose the next combination; a single increased row no longer directly names an intervention.",
          "fairness 4: Retain a genuine QI application using visibly constructed values; the challenge is a tradeoff/control inference, not pretending the task requires medical knowledge."
        ],
        "suggestions": [
          "suggestions 1: Keep coherent denominators, source comparability and record-agreement checks in the exhibit.",
          "suggestions 2: Add a real source-versus-entry tradeoff; compare parallel controlled workflow pairs so the new data determine the next test and are not decorative."
        ]
      },
      "selfCheck": {
        "cueAttack": "All choices compare two actual source/method workflows with parallel grammar. No option names a generally superior or uniquely comprehensive intervention; both table dimensions are needed, and no single changing row selects the key.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Separate the source-related agreement pattern from the entry-method time pattern using the existing comparisons.",
          "Choose the untested combination and comparison that could preserve one observed benefit while checking the other outcome."
        ],
        "oneBestAnswer": "Manual source comparisons change agreement without changing time; the prior-source entry-method comparison changes time without changing agreement. Current-source prefill is the hypothesis needing a test.",
        "closestDistractor": "Repeat the faster prior-source comparison or repeat the source-only manual comparison, each checking only one already observed component of the tradeoff.",
        "remainingReview": "QI/owner review should confirm the constructed comparison's plausibility and that the inference is only a next-cycle hypothesis, not a causal claim. Counts/time denominators remain explicit; no patient/question correctness data is collected."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v9",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.quality-improvement.pdsa-act-and-iterate.v3.r7",
      "conceptId": "concept.quality-improvement.pdsa-act-and-iterate",
      "stem": "Which comparison should {patientName}'s team use for its next PDSA test?",
      "answerChoices": [
        {
          "id": "correct_abandon-harm",
          "label": "Current-list manual entry versus current-list prefill",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The pilot separates a record-source agreement problem from an entry-time opportunity. Testing prefill from the current reconciled source evaluates whether the faster method can retain the agreement of that source."
        },
        {
          "id": "choice.qq20261102e.b36.d1",
          "label": "Prior-list manual entry versus prior-list prefill",
          "isCorrect": false,
          "distractorRationale": "This repeats the observed time reduction while keeping the source associated with poorer agreement. It does not test whether the speed gain can coexist with the current source's agreement."
        },
        {
          "id": "choice.qq20261102e.b36.d2",
          "label": "Prior-list manual entry versus current-list manual entry",
          "isCorrect": false,
          "distractorRationale": "This repeats the observed source contrast without evaluating the faster entry method using the current source. It leaves the practical adaptation question unanswered."
        }
      ],
      "explanation": "Manual entry from the two sources has the same time but different agreement/contact observations. Prefill from the prior source lowers entry time without changing that source's agreement pattern. The next useful test is whether prefill from the current reconciled source can combine lower burden with retained agreement. Continue measuring both rather than assume the new combination will succeed; a small constructed pilot establishes neither causation nor a rollout threshold.",
      "teachingPoint": "Manual entry from the two sources has the same time but different agreement/contact observations. Prefill from the prior source lowers entry time without changing that source's agreement pattern. The next useful test is whether prefill from the current reconciled source can combine lower burden with retained agreement. Continue measuring both rather than assume the new combination will succeed; a small constructed pilot establishes neither causation nor a rollout threshold.",
      "exhibit": {
        "kind": "table",
        "caption": "Constructed pilot data: ten visits per workflow. Time is total form-entry staff-minutes; agreement counts forms matching that visit's reconciled list; contacts arise from those same ten visits.",
        "columnHeaders": [
          "Current reconciled list, manual entry",
          "Prior-visit list, manual entry",
          "Prior-visit list, prefilled entry"
        ],
        "rowHeaders": [
          "Form-entry staff-minutes",
          "Forms agreeing with reconciled list",
          "Unplanned medication-clarification contacts"
        ],
        "cells": [
          [
            "50",
            "50",
            "15"
          ],
          [
            "10 of 10",
            "6 of 10",
            "6 of 10"
          ],
          [
            "8",
            "12",
            "12"
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
    "presentationTemplate": "{patientName} leads an employee quality meeting about a structured visit form. Each workflow includes medication reconciliation, transfer of the list into the form, and final clinician review. The team is studying medication-clarification contacts and staff time; record agreement is checked against the list reconciled for that visit.",
    "previousPresentation": "{patientName} leads an employee quality meeting about a structured visit form. Each workflow includes medication reconciliation, transfer of the reconciled list into the form, and final clinician review. The team is studying repeat medication-clarification contacts and staff time. It can test changes to the interview, form entry or final review while checking agreement with the reconciled list.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102d.case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
        "patientPresentationVariantId": "presentation.gs028se.pdsa-act-qi-measures.a-abandon-harm",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v7",
        "revisedChiefComplaint": "Pathway improvement review",
        "revisedPresentation": "{patientName} leads an employee quality meeting about a structured visit form. Each workflow includes medication reconciliation, transfer of the reconciled list into the form, and final clinician review. The team is studying repeat medication-clarification contacts and staff time. It can test changes to the interview, form entry or final review while checking agreement with the reconciled list.",
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
      "idPrefix": "ppr.qq20261102e.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v8"
    }
  }
];

export const QUESTION_QUALITY_ADVERSARIAL_R6_CONCEPT_VERSIONS: QuestionQualityR6ConceptVersion[] = [
  {
    "id": "concept.achalasia.high-resolution-manometry.v3",
    "displayName": "Interpret provocative motility responses before further planning",
    "learningObjective": "Distinguish post-rapid-swallow contractile reserve from liquid-load outflow findings using actual pressure responses, without converting a provocative finding into a complete motor diagnosis.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "contentVersion": "concept.question-quality.2026-11-02.v4",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.achalasia.high-resolution-manometry.v2",
    "versioningReason": "The score changes from choosing a protocol extension to interpreting two acquired provocative responses. Retain v2 protocol-selection histories and exact passed companion versions.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B03-context"
    ],
    "evidenceClaimIds": [
      "claim.achalasia.high-resolution-manometry",
      "claim.qq20261102a.esophageal-physiology-sequence",
      "claim.qq20261102c.hrm-protocol-and-provocation",
      "claim.qq20261102d.hrm-rapid-swallow-interpretation",
      "claim.qq20261102d.hrm-rapid-drink-purpose",
      "claim.qq20261102d.hrm-solid-meal-provocation",
      "claim.qq20261102e.hrm-reserve-versus-outflow"
    ]
  },
  {
    "id": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
    "displayName": "Interpret mapped partial specimens before melanoma planning",
    "learningObjective": "Integrate the specimen's location, represented tissue compartments and cut surface to retain valid local findings while limiting whole-lesion diagnosis or depth claims before completion pathology.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "contentVersion": "concept.question-quality.2026-11-02.v4",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v2",
    "versioningReason": "The score changes from selecting complete excision to adjudicating what a mapped partial specimen establishes for subsequent planning. Excision remains the shared requested procedure; retain the older procedural-selection construct and its histories.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B11-context",
      "B12-context",
      "B17-context",
      "B18-context"
    ],
    "evidenceClaimIds": [
      "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "claim.qq20261102a.melanoma-diagnostic-sampling",
      "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
      "claim.qq20261102e.mapped-partial-skin-evidence",
      "claim.qq20261102e.transected-depth-lower-bound"
    ]
  },
  {
    "id": "concept.soft-tissue-mass.extremity-mri.v3",
    "displayName": "Integrate enhancement and compartment anatomy in biopsy planning",
    "learningObjective": "Use matched precontrast/postcontrast findings and compartment relationships to select a viable proposed target and tract for the radiology planning report.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "contentVersion": "concept.question-quality.2026-11-02.v4",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.soft-tissue-mass.extremity-mri.v2",
    "versioningReason": "The score changes from choosing MRI completion for field coverage to selecting a target/tract from actual MRI findings. Preserve v2 imaging-adequacy history and the exact passed later biopsy-planning version.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B19-context"
    ],
    "evidenceClaimIds": [
      "claim.soft-tissue-mass.mri",
      "claim.qq20261102a.sarcoma-local-imaging",
      "claim.qq20261102c.sarcoma-mri-coverage-and-target",
      "claim.qq20261102a.sarcoma-viable-biopsy-target",
      "claim.qq20261102b.sarcoma-method-and-tract",
      "claim.qq20261102c.sarcoma-enhancement-biopsy-target"
    ]
  }
];
