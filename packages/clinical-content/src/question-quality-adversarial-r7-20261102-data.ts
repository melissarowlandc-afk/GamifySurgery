import type { QuestionQualityR7Revision, QuestionQualityR7ConceptVersion } from "./question-quality-adversarial-r7-20261102";

/** Additive clinical drafts; prior identities and approvals are retained. */
export const QUESTION_QUALITY_ADVERSARIAL_R7_DEFINITIONS: QuestionQualityR7Revision[] = [
  {
    "id": "revision.qq20261102f.b03-context",
    "auditId": "B03-context",
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v3.r7",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3.r8",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v9"
    ],
    "previousStem": "Which interpretation should accompany {patientName}'s referral for specialist manometry review?",
    "previousChoiceLabels": [
      "Reduced contractile reserve; liquid-load outflow obstruction not demonstrated",
      "Preserved contractile reserve; liquid-load outflow obstruction not demonstrated",
      "Reduced contractile reserve; liquid-load outflow obstruction demonstrated",
      "Preserved contractile reserve; liquid-load outflow obstruction demonstrated"
    ],
    "previousCurrentUpdate": "Separated swallows produce propagated contractions with junction relaxation within the laboratory range. During repeated rapid-swallow sequences, body pressure falls while swallowing; the contraction after each sequence is weaker than the patient's baseline contractions. During upright rapid drinking, junction relaxation remains within the laboratory range and pressure does not build up throughout the esophagus.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Separate within-sequence inhibition from the repeat post-sequence response when checking the draft's normal-reserve conclusion. Then Use the independent liquid-load pressure/junction observations, rather than symptom reproduction alone, to decide which other report conclusion can stand.",
    "reviewerNotes": "Motility review must confirm acquisition adequacy, reproducibility and the limited report correction. Existing qualitative protocol claims are reused; no numerical criterion, cause, subtype or preoperative treatment recommendation is introduced.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_3": "manometry_3",
      "choice.qq20261102f.b03-context.d1": "choice.qq20261102e.b03-context.d1",
      "choice.qq20261102f.b03-context.d2": "choice.qq20261102e.b03-context.d2",
      "choice.qq20261102f.b03-context.d3": "choice.qq20261102e.b03-context.d3"
    },
    "choiceServiceOverrides": {
      "manometry_3": "service.esophageal_manometry",
      "choice.qq20261102f.b03-context.d1": null,
      "choice.qq20261102f.b03-context.d2": null,
      "choice.qq20261102f.b03-context.d3": null
    },
    "currentUpdate": "An earlier technically adequate pressure study includes separated swallows and two repeat rapid-swallow sequences. The draft report describes both provocative responses as normal. The recorded observations are shown below.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.high-resolution-manometry.v3.r7",
      "whatChanged": "Replace verbal physiology labels with a draft-report correction requiring phase-specific interpretation and a symptom-versus-pressure comparison. Keep the passed later motor-pattern/medication item independent.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review6-20261102.json#B03-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Remove the weaker-to-reduced answer-label match. Choices now concern which draft conclusion must be corrected; baseline propagation and within-sequence suppression compete with the post-sequence response.",
          "cues 2: Retain necessary junction/pressure observations but add symptom reproduction as a credible competing interpretation. No answer contains normal/not-demonstrated wording."
        ],
        "fairness": [
          "fairness 1: Keep the limited reserve/outflow application and existing claim; do not infer achalasia or a symptom cause.",
          "fairness 2: Two distinct report conclusions must now be adjudicated from separate acquisitions, with a tempting symptom-based reversal; a balanced matrix alone is not the difficulty claim.",
          "fairness 3: Make normal inhibition consequential: the draft incorrectly treats the provocative testing as globally normal. The options require deciding which conclusion that phase can support.",
          "fairness 4: Identify this as an earlier study and retain no preceding feedback. Do not use the later opioid reconciliation or motor-pattern exhibit to solve it; introduce no cutoff."
        ],
        "suggestions": [
          "suggestions 1: Make inhibition-versus-augmentation the draft's near-miss and give each report conclusion an equal-scope retain/revise alternative.",
          "suggestions 2: Use a consequential correction to the clinical report instead of substituting synonyms or arbitrary numbers. Specialist validation of the qualitative interpretation remains required.",
          "suggestions 3: Freeze passed B03 and all its medication fields. The revised earlier feedback does not discuss achalasia, opioids or irreversible treatment."
        ]
      },
      "selfCheck": {
        "cueAttack": "No weaker/reduced or normal/not-demonstrated answer matrix remains. All four choices make two equally scoped report decisions; retaining, amending or doing both is not uniquely cautious. Removing either protocol's observations leaves two options viable.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Separate within-sequence inhibition from the repeat post-sequence response when checking the draft's normal-reserve conclusion.",
          "Use the independent liquid-load pressure/junction observations, rather than symptom reproduction alone, to decide which other report conclusion can stand."
        ],
        "oneBestAnswer": "The draft accepts reserve despite absent augmentation on two repeat sequences; symptom reproduction is a competing observation but is not accompanied by the supplied outflow physiology.",
        "closestDistractor": "Accept the inhibition/baseline response as evidence of reserve and relabel the symptom-provoking rapid-drink response as obstruction.",
        "remainingReview": "Motility review must confirm acquisition adequacy, reproducibility and the limited report correction. Existing qualitative protocol claims are reused; no numerical criterion, cause, subtype or preoperative treatment recommendation is introduced."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v10",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v3.r8",
      "conceptId": "concept.achalasia.high-resolution-manometry.v3",
      "stem": "Which change should be requested in {patientName}'s draft report?",
      "answerChoices": [
        {
          "id": "manometry_3",
          "label": "Revise the reserve conclusion; retain the outflow conclusion",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Normal inhibition during the sequence is not evidence of post-sequence augmentation. The repeat responses challenge the reserve conclusion, whereas reproduced discomfort without the supplied outflow findings does not establish liquid-load obstruction."
        },
        {
          "id": "choice.qq20261102f.b03-context.d1",
          "label": "Retain the reserve conclusion; revise the outflow conclusion",
          "isCorrect": false,
          "distractorRationale": "This accepts suppression as proof of reserve and lets symptom reproduction override the actual junction and pressure observations during loading."
        },
        {
          "id": "choice.qq20261102f.b03-context.d2",
          "label": "Revise the reserve conclusion; revise the outflow conclusion",
          "isCorrect": false,
          "distractorRationale": "The reserve conclusion needs correction, but the symptom-provoking liquid load does not itself supply evidence for the added outflow revision."
        },
        {
          "id": "choice.qq20261102f.b03-context.d3",
          "label": "Retain the reserve conclusion; retain the outflow conclusion",
          "isCorrect": false,
          "distractorRationale": "Baseline propagation and appropriate inhibition do not establish the post-sequence reserve response. Accepting the whole draft misses that distinction."
        }
      ],
      "explanation": "A provocative protocol has distinct acquisition phases. Appropriate inhibition while swallowing does not establish augmentation after the sequence; the repeated post-sequence finding warrants correction of the reserve statement. A familiar symptom during rapid drinking does not by itself establish impaired outflow. This report review does not assign a final motor diagnosis or a cause of all symptoms.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.qq20261102c.hrm-protocol-and-provocation",
        "claim.qq20261102d.hrm-rapid-swallow-interpretation",
        "claim.qq20261102d.hrm-rapid-drink-purpose",
        "claim.qq20261102d.hrm-solid-meal-provocation",
        "claim.qq20261102e.hrm-reserve-versus-outflow"
      ],
      "teachingPoint": "A provocative protocol has distinct acquisition phases. Appropriate inhibition while swallowing does not establish augmentation after the sequence; the repeated post-sequence finding warrants correction of the reserve statement. A familiar symptom during rapid drinking does not by itself establish impaired outflow. This report review does not assign a final motor diagnosis or a cause of all symptoms.",
      "exhibit": {
        "kind": "table",
        "caption": "Constructed observations from an earlier study; laboratory comparisons are qualitative.",
        "columnHeaders": [
          "Separated swallows",
          "Rapid-swallow sequences",
          "Upright rapid drinking"
        ],
        "rowHeaders": [
          "Esophageal-body response",
          "Junction and symptoms"
        ],
        "cells": [
          [
            "Propagated contractions between swallows",
            "Pressure falls during the sequence; neither repeat is followed by a contraction exceeding the baseline response",
            "No pressure column develops across the esophageal body"
          ],
          [
            "Relaxation within the laboratory range",
            "Relaxation during the sequence within the laboratory range",
            "Relaxation within the laboratory range; the familiar chest discomfort occurs"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.achalasia.high-resolution-manometry.v3",
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
      "reason": "Existing objective applied with revised wording/data; no concept meaning change."
    }
  },
  {
    "id": "revision.qq20261102f.b05-context",
    "auditId": "B05-context",
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r7",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r8",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v9"
    ],
    "previousStem": "When should {patientName}'s hernia referral be arranged?",
    "previousChoiceLabels": [
      "Refer during ongoing rehabilitation",
      "Refer after rehabilitation is completed",
      "Refer after repeat imaging documents progression"
    ],
    "previousCurrentUpdate": "Dynamic pelvic MRI shows an inguinal protrusion during strain that reduces while supine. Hip-directed exercises have reduced the ache on rotation. During a work shift, the groin lump still makes the patient stop lifting; pressing it back allows lifting to resume. Rehabilitation continues for the residual rotation discomfort.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Compare the later activity-specific observations with the earlier hernia-related episodes instead of treating a positive MRI as attribution of all pain. Then Choose the assessment that addresses the currently limiting function among three active, clinically plausible care targets.",
    "reviewerNotes": "Hernia and musculoskeletal clinicians must confirm the proposed care priority and competing plans. These are selected next assessments, not compulsory operations, promises of pain relief or rules prohibiting elective consultation. No size, duration, imaging-growth or rehabilitation-completion threshold is used.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_4": "elective_discussion_4",
      "choice.qq20261102f.b05-context.d1": "choice.qq20261102e.b05-context.d1",
      "choice.qq20261102f.b05-context.d2": "choice.qq20261102e.b05-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_4": null,
      "choice.qq20261102f.b05-context.d1": null,
      "choice.qq20261102f.b05-context.d2": null
    },
    "currentUpdate": "At a later review, the inguinal contour still appears with standing strain and withdraws on lying down. The work diary and examination now record the following. The existing exercise program continues.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r7",
      "whatChanged": "Replace referral timing with a later shift in the remaining functional limitation. Three same-stage assessment targets compete; current observations reverse the automatic hernia-referral shortcut.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review6-20261102.json#B05-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Do not repeat the reduction-to-return-to-work chain as the current trigger. Preserve it in the frozen earlier result and supply a later, different remaining task limitation.",
          "cues 2: The exercise program is common context, absent from all distinguishing option wording; it no longer singles out a combined-care key.",
          "cues 3: Remove the unsupported imaging-progression prerequisite. All three alternatives are active assessments of actual findings."
        ],
        "fairness": [
          "fairness 1: Preserve reducibility and a non-emergency course. The question chooses the lead assessment for a specified limitation, not a prohibition on hernia consultation or a promise about surgery.",
          "fairness 2: Change the task away from the single refer-a-symptomatic-hernia rule. A resident must resist attributing a new hip-related functional deficit to an already demonstrated hernia.",
          "fairness 3: The later record changes the ranking despite the earlier hernia symptoms; deleting the task-specific update no longer leaves the same key.",
          "fairness 4: Keep passed B05 and its adequacy feedback exact. That feedback does not supply this functional reassessment."
        ],
        "suggestions": [
          "suggestions 1: Use three credible same-stage assessment targets, with current positive observations for hip, hernia and attachment possibilities.",
          "suggestions 2: Make interval function, not an invented duration or size, determine the current priority. Clinician review must confirm that ranking.",
          "suggestions 3: Keep common rehabilitation and passed shared presentation. The new concept version records the changed prioritization objective rather than claim a basic exemption."
        ]
      },
      "selfCheck": {
        "cueAttack": "There are no refer-now versus arbitrary-delay options. Each choice prioritizes an actual positive finding. The earlier passed result alone favors the wrong target for this later task, so the new interval observations must be used.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Compare the later activity-specific observations with the earlier hernia-related episodes instead of treating a positive MRI as attribution of all pain.",
          "Choose the assessment that addresses the currently limiting function among three active, clinically plausible care targets."
        ],
        "oneBestAnswer": "The low-shelf task stops because of the hip-rotation-reproduced deep ache, whereas current protrusion and adduction tasks are tolerated.",
        "closestDistractor": "Continue to attribute all work disability to the MRI-demonstrated hernia because the earlier result described reduction-responsive lifting episodes.",
        "remainingReview": "Hernia and musculoskeletal clinicians must confirm the proposed care priority and competing plans. These are selected next assessments, not compulsory operations, promises of pain relief or rules prohibiting elective consultation. No size, duration, imaging-growth or rehabilitation-completion threshold is used."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v10",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v4.r8",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "stem": "Which assessment should lead the plan for the activity that still limits {patientName}'s work?",
      "answerChoices": [
        {
          "id": "elective_discussion_4",
          "label": "Hip-focused musculoskeletal assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The limiting low-shelf task and reproduced deep ache now track hip movement while the visible protrusion is tolerated. Prior hernia-related episodes do not establish the cause of this different remaining limitation."
        },
        {
          "id": "choice.qq20261102f.b05-context.d1",
          "label": "Hernia-focused surgical assessment",
          "isCorrect": false,
          "distractorRationale": "The demonstrated hernia and earlier lifting episodes make this credible, but the later functional record does not connect the remaining low-shelf limitation to current protrusion episodes."
        },
        {
          "id": "choice.qq20261102f.b05-context.d2",
          "label": "Pubic-attachment rehabilitation assessment",
          "isCorrect": false,
          "distractorRationale": "A pubic symptom is present, but the recorded resisted activity is completed. It does not reproduce the deep ache stopping the limiting work task."
        }
      ],
      "explanation": "A demonstrated hernia need not explain every later groin complaint. The remaining work limitation is reproduced with the hip-related task, while current protrusion and resisted-adduction observations have different functional effects. Prioritize assessment of that remaining limitation; the hernia can still be discussed according to symptoms, risk and preference.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "teachingPoint": "A demonstrated hernia need not explain every later groin complaint. The remaining work limitation is reproduced with the hip-related task, while current protrusion and resisted-adduction observations have different functional effects. Prioritize assessment of that remaining limitation; the hernia can still be discussed according to symptoms, risk and preference.",
      "exhibit": {
        "kind": "table",
        "caption": "Current recorded activities and examination; this is later than the MRI-result visit.",
        "columnHeaders": [
          "Standing and coughing",
          "Deep squat to a low shelf",
          "Resisted adduction"
        ],
        "rowHeaders": [
          "Contour and discomfort",
          "Task performance"
        ],
        "cells": [
          [
            "Groin contour appears; no discomfort is reported",
            "Deep groin ache; contour remains withdrawn",
            "Brief pubic discomfort; contour remains withdrawn"
          ],
          [
            "Continues standing work",
            "Cannot reach the low shelf; hip rotation reproduces this ache",
            "Completes the resisted task"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored decision now compares active care targets using interval functional evidence, rather than choosing referral timing from an explicitly assigned hernia symptom. Retain the prior repair/observation concept and histories without transfer."
    }
  },
  {
    "id": "revision.qq20261102f.b06-context",
    "auditId": "B06-context",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r7",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r8",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v9"
    ],
    "previousStem": "Which care adjustment is best supported by {patientName}'s interval course?",
    "previousChoiceLabels": [
      "Continue observation while advancing rehabilitation",
      "Start repair planning while advancing rehabilitation",
      "Start repair planning before advancing rehabilitation"
    ],
    "previousCurrentUpdate": "After the MRI, {patientName} begins a graded exercise program with hernia observation. At review, walking has progressed to sustained jogging. The groin contour still appears with coughing and withdraws on lying down, as before. Work shifts are completed without interruption. MRI review still shows the small protrusion and the attachment signal change.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Recognize that improved exercise and completed shifts on modified duties are not evidence that the original work demand is tolerated. Then Relate the attempted lifting event to the current groin finding and choose the appropriate assessment priority despite residual adduction discomfort.",
    "reviewerNotes": "Hernia and musculoskeletal clinicians must confirm the proposed care priority and competing plans. These are selected next assessments, not compulsory operations, promises of pain relief or rules prohibiting elective consultation. No size, duration, imaging-growth or rehabilitation-completion threshold is used.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_2": "elective_discussion_2",
      "choice.qq20261102f.b06-context.d1": "choice.qq20261102e.b06-context.d1",
      "choice.qq20261102f.b06-context.d2": "choice.qq20261102e.b06-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_2": null,
      "choice.qq20261102f.b06-context.d1": null,
      "choice.qq20261102f.b06-context.d2": null
    },
    "currentUpdate": "Following the MRI, {patientName} continues the graded exercise program with hernia observation. At review, jogging lasts longer. The rota lists completed work shifts, but the accompanying duty log records that a colleague now handles the stock crates. During an observed attempt to resume crate handling, the patient sets the crate down with pressure at the photographed groin contour; the contour withdraws on lying down. Resisted adduction still causes medial-thigh discomfort, but ordinary walking and the exercises are completed.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r7",
      "whatChanged": "Replace unopposed improvement with an exposure-versus-outcome near miss: modified duties conceal persistent limitation. Compare three plausible care priorities without a rehabilitation pause or unexplained delay.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review6-20261102.json#B06-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Improved jogging is retained as a competing favorable observation, not the full course. The duty log and attempted lifting supply an independent countervailing functional result.",
          "cues 2: Completed shifts are now on modified duties. A resident must distinguish actual tolerance from avoidance rather than read no interruption as recovery.",
          "cues 3: Replace one continuation against two repair-planning escalations with observation, hernia assessment and attachment reassessment, all retaining the same graded activity."
        ],
        "fairness": [
          "fairness 1: Do not imply repair is compulsory or observation forbidden. The selected change is elective assessment of a demonstrated current limitation.",
          "fairness 2: Persistent anatomy is not the competing reason. The new work-exposure information, not unchanged MRI, changes the ranking.",
          "fairness 3: Make the interval record necessary: attendance and exercise improvement pull toward the closest distractor until modified duties and the observed task are interpreted.",
          "fairness 4: Keep the earlier passed result exact. It describes an earlier tolerated lifting course; the later attempted task now provides new functional evidence without a numerical cutoff."
        ],
        "suggestions": [
          "suggestions 1: Compare actual care policies that remain reasonable under different functional readings; no arbitrary delay or two versions of unsupported escalation.",
          "suggestions 2: Use residual adduction discomfort as a real competing target and the work log as the discriminator. Do not assert a causal diagnosis in a concluding stem sentence.",
          "suggestions 3: Freeze passed B06, retain reducibility and improved exercise, and introduce no urgency, exact interval or preference cue."
        ]
      },
      "selfCheck": {
        "cueAttack": "All options retain graded activity and comparable care scope. The closest alternative is a defensible observation policy if unrestricted function had actually recovered; reading the duty log changes that decision. Persistent imaging alone is not the escalation trigger.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that improved exercise and completed shifts on modified duties are not evidence that the original work demand is tolerated.",
          "Relate the attempted lifting event to the current groin finding and choose the appropriate assessment priority despite residual adduction discomfort."
        ],
        "oneBestAnswer": "The duty log exposes avoided crate handling, and the observed attempt interrupts that task with the separate groin event.",
        "closestDistractor": "Continue observation because the headline says improved jogging and uninterrupted shifts, without reading the change in work exposure.",
        "remainingReview": "Hernia and musculoskeletal clinicians must confirm the proposed care priority and competing plans. These are selected next assessments, not compulsory operations, promises of pain relief or rules prohibiting elective consultation. No size, duration, imaging-growth or rehabilitation-completion threshold is used."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v10",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v2.r8",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "stem": "Which care priority best fits {patientName}'s current functional record?",
      "answerChoices": [
        {
          "id": "elective_discussion_2",
          "label": "Hernia assessment with continued graded activity",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Completed shifts on modified duties do not demonstrate recovery of the avoided lifting task. The current pressure/contour event supplies a hernia-related functional concern despite improved running and a coexisting attachment symptom."
        },
        {
          "id": "choice.qq20261102f.b06-context.d1",
          "label": "Hernia observation with continued graded activity",
          "isCorrect": false,
          "distractorRationale": "This mistakes attendance on modified duties and longer jogging for unrestricted work function. It overlooks the task that remains unperformed and the observed groin event on attempting it."
        },
        {
          "id": "choice.qq20261102f.b06-context.d2",
          "label": "Attachment reassessment with continued graded activity",
          "isCorrect": false,
          "distractorRationale": "The persistent adduction symptom is a credible reason for musculoskeletal review, but the actual remaining crate-handling interruption occurs with the separate groin pressure/contour event."
        }
      ],
      "explanation": "Functional recovery must be read against the work actually attempted. Longer jogging and completed modified shifts do not settle the avoided lifting task. The current groin event supports elective hernia assessment while graded activity and the coexisting attachment symptoms continue to be addressed. This does not require immediate repair.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution",
        "claim.bread-butter.inguinal-hernia.watchful-waiting"
      ],
      "teachingPoint": "Functional recovery must be read against the work actually attempted. Longer jogging and completed modified shifts do not settle the avoided lifting task. The current groin event supports elective hernia assessment while graded activity and the coexisting attachment symptoms continue to be addressed. This does not require immediate repair."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored decision now compares active care targets using interval functional evidence, rather than choosing referral timing from an explicitly assigned hernia symptom. Retain the prior repair/observation concept and histories without transfer."
    }
  },
  {
    "id": "revision.qq20261102f.b07-context",
    "auditId": "B07-context",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r7",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r8",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v9"
    ],
    "previousStem": "When should {patientName}'s hernia referral be arranged?",
    "previousChoiceLabels": [
      "Refer during ongoing rehabilitation",
      "Refer after rehabilitation is completed",
      "Refer after repeat imaging documents progression"
    ],
    "previousCurrentUpdate": "Dynamic ultrasound shows an inguinal protrusion during strain that reduces while supine. The patient has completed an exercise trial for pubic-attachment pain and can now resist adduction with less discomfort. Lifting the relative still produces the lump and makes the patient set the relative down; the episode eases after the lump is reduced. The attachment exercise program continues.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Distinguish the later transfer limitation from the earlier reduction-responsive episodes using tasks performed with and without the visible contour. Then Compare the reproduced medial pain with the separate hip ache to choose the lead care target.",
    "reviewerNotes": "Hernia and musculoskeletal clinicians must confirm the proposed care priority and competing plans. These are selected next assessments, not compulsory operations, promises of pain relief or rules prohibiting elective consultation. No size, duration, imaging-growth or rehabilitation-completion threshold is used.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_3": "elective_discussion_3",
      "choice.qq20261102f.b07-context.d1": "choice.qq20261102e.b07-context.d1",
      "choice.qq20261102f.b07-context.d2": "choice.qq20261102e.b07-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_3": null,
      "choice.qq20261102f.b07-context.d1": null,
      "choice.qq20261102f.b07-context.d2": null
    },
    "currentUpdate": "At a later reassessment, the patient continues a maintenance exercise program after the initial supervised phase. The groin contour withdraws when supine. During coughing it appears without pain. The caregiving log describes medial pubic pain during transfers from a low chair, including transfers when no contour is visible. A transfer from a raised chair is completed while the contour is visible. Resisted adduction reproduces the low-chair pain; hip rotation produces a different deep ache.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r7",
      "whatChanged": "Clarify initial supervised versus maintenance care and use later crossed task/contour observations to select among three active care targets. Earlier hernia-associated symptoms no longer automatically assign the current limitation.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review6-20261102.json#B07-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Retain the earlier reduction/functional facts in the frozen result but replace their restatement with later crossed transfer observations; current contour and pain do not simply move together.",
          "cues 2: The maintenance program is shared by every option, so it cannot uniquely match the key.",
          "cues 3: Remove both unexplained waiting policies. Each option selects an actual positive clinical target at the same stage."
        ],
        "fairness": [
          "fairness 1: Keep a reducible, non-emergency hernia and allow consultation; the task is prioritization of the specified current caregiving problem.",
          "fairness 2: The new decision is not refer-versus-delay. It requires separating current attachment, hernia and hip observations after an earlier hernia-related course.",
          "fairness 3: Specify the initial supervised phase and ongoing maintenance rather than use completed-versus-continuing rehabilitation as an ambiguous foil.",
          "fairness 4: Preserve passed B07 and its acquisition feedback. It cannot choose among the later function-specific care targets."
        ],
        "suggestions": [
          "suggestions 1: Make chronology explicit without inventing a required exercise duration or completion threshold.",
          "suggestions 2: Use crossed functional observations and credible active assessments. The update contains no authoritative sentence assigning the cause.",
          "suggestions 3: Freeze passed shared fields, retain reducibility, and require clinician confirmation of the current prioritization; no growth or treatment-duration rule."
        ]
      },
      "selfCheck": {
        "cueAttack": "Every choice is an active assessment alongside the same exercise program. No rehabilitation-completion or imaging-growth gate remains. The crossed task/contour observations must be interpreted rather than a reduction-relief sentence matched to referral.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Distinguish the later transfer limitation from the earlier reduction-responsive episodes using tasks performed with and without the visible contour.",
          "Compare the reproduced medial pain with the separate hip ache to choose the lead care target."
        ],
        "oneBestAnswer": "Low-chair pain occurs without a contour and matches the adduction-provoked symptom; the raised-chair transfer is completed despite a visible contour.",
        "closestDistractor": "Select hernia assessment solely because the earlier dynamic study confirmed a protrusion and the patient still has a lifting-related duty.",
        "remainingReview": "Hernia and musculoskeletal clinicians must confirm the proposed care priority and competing plans. These are selected next assessments, not compulsory operations, promises of pain relief or rules prohibiting elective consultation. No size, duration, imaging-growth or rehabilitation-completion threshold is used."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v10",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v3.r8",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "stem": "Which assessment should lead the next plan for {patientName}'s remaining caregiving difficulty?",
      "answerChoices": [
        {
          "id": "elective_discussion_3",
          "label": "Attachment assessment alongside the current exercise program",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The limiting transfer pain is reproduced by adduction and occurs without the contour; a transfer can be completed with the contour present. These observations favor reviewing the attachment-related limitation rather than assigning all burden to the hernia."
        },
        {
          "id": "choice.qq20261102f.b07-context.d1",
          "label": "Inguinal-hernia assessment alongside the current exercise program",
          "isCorrect": false,
          "distractorRationale": "The earlier hernia-associated episodes make this credible, but the later task-specific dissociation weakens attribution of the current transfer difficulty to the protrusion."
        },
        {
          "id": "choice.qq20261102f.b07-context.d2",
          "label": "Hip-joint assessment alongside the current exercise program",
          "isCorrect": false,
          "distractorRationale": "A separate deep ache exists, but it is not the pain reproduced in the low-chair transfers. Selecting it confuses a positive examination finding with the currently limiting symptom."
        }
      ],
      "explanation": "The current task, site and provocation matter more than the mere coexistence of a hernia. Later transfer observations dissociate the limiting medial pain from the visible contour and reproduce it with adduction. Prioritize assessment of that remaining functional problem while retaining appropriate hernia review as symptoms and preferences require.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution"
      ],
      "teachingPoint": "The current task, site and provocation matter more than the mere coexistence of a hernia. Later transfer observations dissociate the limiting medial pain from the visible contour and reproduce it with adduction. Prioritize assessment of that remaining functional problem while retaining appropriate hernia review as symptoms and preferences require."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored decision now compares active care targets using interval functional evidence, rather than choosing referral timing from an explicitly assigned hernia symptom. Retain the prior repair/observation concept and histories without transfer."
    }
  },
  {
    "id": "revision.qq20261102f.b08-context",
    "auditId": "B08-context",
    "caseId": "case.inguinal-hernia.lifting-bulge",
    "nodeId": "node.inguinal-hernia.lifting-bulge.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r7",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r8",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v9"
    ],
    "previousStem": "When should {patientName}'s hernia referral be arranged?",
    "previousChoiceLabels": [
      "Refer during ongoing rehabilitation",
      "Refer after rehabilitation is completed",
      "Refer after repeat imaging documents progression"
    ],
    "previousCurrentUpdate": "After the MRI, {patientName} starts rehabilitation with hernia observation. Repeated trunk flexion is now tolerated with less pain. During a later shift, a coughing or lifting episode brings out the groin lump and makes the patient put the load down; the episode settles when the lump is reduced. The attachment program continues, and the protrusion remains reducible.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Compare the original painless-protrusion/flexion-pain record with the later site-specific functional course rather than preserve the first attribution indefinitely. Then Rank the hernia, attachment and hip care targets using the actual remaining work symptom.",
    "reviewerNotes": "Hernia and musculoskeletal clinicians must confirm the proposed care priority and competing plans. These are selected next assessments, not compulsory operations, promises of pain relief or rules prohibiting elective consultation. No size, duration, imaging-growth or rehabilitation-completion threshold is used.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_1": "elective_discussion_1",
      "choice.qq20261102f.b08-context.d1": "choice.qq20261102e.b08-context.d1",
      "choice.qq20261102f.b08-context.d2": "choice.qq20261102e.b08-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_1": null,
      "choice.qq20261102f.b08-context.d1": null,
      "choice.qq20261102f.b08-context.d2": null
    },
    "currentUpdate": "After the MRI-result visit, {patientName} continues rehabilitation with hernia observation. At a later review, repeated trunk flexion is completed and no longer reproduces the original suprapubic pain. The work log now records pauses with a superficial ache at the inguinal fold during coughing and crate lifting. In the clinic the familiar superficial ache occurs while the groin contour is visible; the contour withdraws when supine. Hip rotation still produces a deeper ache that the patient distinguishes from the work episodes.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r7",
      "whatChanged": "Replace arbitrary waiting alternatives with three real care targets. Use the earlier frozen symptom assignment as the credible near miss and require a current-versus-earlier comparison to change priority.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review6-20261102.json#B08-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Do not narrate relief after reduction as the complete reason to refer. Use the site/provocation change and work record against the earlier frozen painless-protrusion finding.",
          "cues 2: Make ongoing rehabilitation common to all choices; retain reducibility without a uniquely elective/cautious option.",
          "cues 3: Delete the imaging-progression prerequisite and compare active hernia, attachment and hip assessment priorities."
        ],
        "fairness": [
          "fairness 1: Retain explicit later chronology so the new symptom is not a contradiction of the earlier painless protrusion.",
          "fairness 2: Elective assessment remains the action; no compulsory operation, exact symptom interval or hernia-size rule.",
          "fairness 3: The nearest distractor is the earlier valid attachment attribution. Its current functional correlate has changed; compare both records rather than use a new causal summary.",
          "fairness 4: Keep the preceding passed imaging feedback exact; it does not give the current priority."
        ],
        "suggestions": [
          "suggestions 1: Make the initial attribution and later task-specific change necessary to distinguish the lead care target.",
          "suggestions 2: Use supported same-stage care alternatives arising from the actual residual observations; no arbitrary rehabilitation or imaging delay.",
          "suggestions 3: Freeze B08 and retain reducibility. Do not add urgency or a numerical interval to manufacture difficulty."
        ]
      },
      "selfCheck": {
        "cueAttack": "All three choices keep the same rehabilitation and select an active assessment. Neither generic referral timing nor the words rehabilitation or progression identify the key. The initial and later site/provocation findings must be compared.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Compare the original painless-protrusion/flexion-pain record with the later site-specific functional course rather than preserve the first attribution indefinitely.",
          "Rank the hernia, attachment and hip care targets using the actual remaining work symptom."
        ],
        "oneBestAnswer": "The original reproduced flexion pain has resolved, and a different superficial work-limiting symptom now occurs with the reducible contour; the remaining hip ache is separately identified.",
        "closestDistractor": "Intensify attachment care because the frozen earlier MRI result assigned the original limitation to that structure.",
        "remainingReview": "Hernia and musculoskeletal clinicians must confirm the proposed care priority and competing plans. These are selected next assessments, not compulsory operations, promises of pain relief or rules prohibiting elective consultation. No size, duration, imaging-growth or rehabilitation-completion threshold is used."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v10",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v1.r8",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "stem": "Which change should be made to {patientName}'s current care plan?",
      "answerChoices": [
        {
          "id": "elective_discussion_1",
          "label": "Prioritize hernia assessment while continuing rehabilitation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The earlier painless protrusion is not proof that all later episodes are incidental. A different, now limiting groin symptom tracks the protrusion after the original flexion-provoked complaint improves."
        },
        {
          "id": "choice.qq20261102f.b08-context.d1",
          "label": "Prioritize attachment reassessment while continuing rehabilitation",
          "isCorrect": false,
          "distractorRationale": "This carries forward the earlier MRI-associated pain assignment despite resolution of its reproduced functional problem and a different current site/provocation."
        },
        {
          "id": "choice.qq20261102f.b08-context.d2",
          "label": "Prioritize hip-joint assessment while continuing rehabilitation",
          "isCorrect": false,
          "distractorRationale": "A hip-related ache remains, but the patient and observed task distinguish it from the superficial symptom stopping work."
        }
      ],
      "explanation": "Attribution can change over time. The original flexion-provoked suprapubic limitation has improved, whereas a different current superficial symptom occurs with the protrusion and interrupts work. That supports elective hernia assessment without assuming that repair will treat every groin ache or stopping care for coexisting symptoms.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.qq20261102c.groin-symptom-attribution",
        "claim.bread-butter.inguinal-hernia.watchful-waiting"
      ],
      "teachingPoint": "Attribution can change over time. The original flexion-provoked suprapubic limitation has improved, whereas a different current superficial symptom occurs with the protrusion and interrupts work. That supports elective hernia assessment without assuming that repair will treat every groin ache or stopping care for coexisting symptoms."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
      "nextConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The scored decision now compares active care targets using interval functional evidence, rather than choosing referral timing from an explicitly assigned hernia symptom. Retain the prior repair/observation concept and histories without transfer."
    }
  },
  {
    "id": "revision.qq20261102f.b12-context",
    "auditId": "B12-context",
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r7",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r8",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v9"
    ],
    "previousStem": "Which interpretation and completion goal should accompany {patientName}'s excision request?",
    "previousChoiceLabels": [
      "Sampled edge explained; assess residual-lesion architecture",
      "Sampled edge unexplained; assess residual-lesion architecture",
      "Whole lesion explained; review the existing edge sections",
      "Sampled edge unexplained; review the existing edge sections"
    ],
    "previousCurrentUpdate": "The outside punch diagram marks the pale peripheral sector. The report diagnoses a nevus in that submitted fragment. On the current lesion map, the changing irregular center lies beyond the punch circle.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Identify the discrepancy between the central request label, the photographed punch opening and the serially changing sector without declaring the benign diagnosis wrong. Then Choose the review request that resolves specimen-to-clinical-target concordance rather than substitute more analysis of a possibly different sector.",
    "reviewerNotes": "Dermatopathology and the treating clinician must confirm specimen mapping, local-versus-residual interpretation and the proposed request. No partial result establishes all residual tissue, and no obligatory extra procedure or exact margin is invented.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_4": "excisional_4",
      "choice.qq20261102f.b12-context.d1": "choice.qq20261102e.b12-context.d1",
      "choice.qq20261102f.b12-context.d2": "choice.qq20261102e.b12-context.d2"
    },
    "choiceServiceOverrides": {
      "excisional_4": "service.skin_excisional_biopsy",
      "choice.qq20261102f.b12-context.d1": null,
      "choice.qq20261102f.b12-context.d2": null
    },
    "currentUpdate": "The outside request labels the punch as central. The procedure photograph shows the punch opening touching the pale lateral border, with an intact darker focus medial to it. The report diagnoses a nevus in the submitted fragment. Serial photographs show enlargement of the medial focus while the pale lateral border has the same outline. Completion sampling is being arranged with the existing slides available for review.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r7",
      "whatChanged": "Add a real clinicopathologic provenance discrepancy while retaining the benign-fragment fact. Replace scope-label matching with a choice among credible pathology-review requests.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review6-20261102.json#B12-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Retain the benign-fragment fact but stop using its named diagnosis as the answer. The issue is whether the submitted site matches the clinically changing target.",
          "cues 2: Use conflicting request/photo provenance, not merely a center outside a circle. The resident must decide whether to seek mapping correlation or more analysis of the existing tissue.",
          "cues 3: Remove all explained/unexplained/whole-lesion labels. All alternatives are credible pathology-review actions."
        ],
        "fairness": [
          "fairness 1: Do not equate a pale appearance with validated concordance. The discrepancy explicitly requires site correlation; the benign fragment can remain locally valid.",
          "fairness 2: The first decision is whether the clinical/pathology disagreement is a provenance issue; the second is which review request can resolve it.",
          "fairness 3: The raw location and serial observations replace a named-result-plus-separate-center scope exercise. Dermatopathology must confirm the clinical priority.",
          "fairness 4: Every option is a review goal accompanying the same completion-sampling request; no mismatch between a mandatory excision task and section-review options."
        ],
        "suggestions": [
          "suggestions 1: Use an actual local concordance problem, with no invented microscopic nevus rule. Preserve the benign report and supply the original location records.",
          "suggestions 2: Offer mapping correlation, deeper levels and immunostains as equal-scope review actions; none claims that no sample could possibly support a whole-lesion conclusion.",
          "suggestions 3: Freeze passed presentation and later B12 fields. Keep the benign fragment and do not prescribe an extra procedure or presume malignancy in the residual focus."
        ]
      },
      "selfCheck": {
        "cueAttack": "All choices request a specific pathology-review action with comparable scope. No unexplained-edge/whole-lesion matrix remains; none promises a new malignant diagnosis or treats the benign report as wrong. Without the site records, levels and stains are not automatically inferior.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Identify the discrepancy between the central request label, the photographed punch opening and the serially changing sector without declaring the benign diagnosis wrong.",
          "Choose the review request that resolves specimen-to-clinical-target concordance rather than substitute more analysis of a possibly different sector."
        ],
        "oneBestAnswer": "The request's central label conflicts with the photographed lateral punch site while the serially changing focus remains medial.",
        "closestDistractor": "Request more levels or stains because the clinical concern seems inconsistent with a benign report, without checking whether the report represents that concern.",
        "remainingReview": "Dermatopathology and the treating clinician must confirm specimen mapping, local-versus-residual interpretation and the proposed request. No partial result establishes all residual tissue, and no obligatory extra procedure or exact margin is invented."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v10",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r8",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
      "stem": "Which issue should {patientName}'s completion-sampling request ask the pathology review to resolve first?",
      "answerChoices": [
        {
          "id": "excisional_4",
          "label": "Correlate the submitted site with the procedure photograph",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The central label and photographed punch location do not assign the benign tissue to the same clinical target. Resolve that provenance before treating the benign diagnosis as concordant with the changing focus."
        },
        {
          "id": "choice.qq20261102f.b12-context.d1",
          "label": "Reassess the existing fragment with additional tissue levels",
          "isCorrect": false,
          "distractorRationale": "Deeper levels can answer a question about tissue in the block, but they cannot establish that it came from the changing center when the location records disagree."
        },
        {
          "id": "choice.qq20261102f.b12-context.d2",
          "label": "Reassess the existing fragment with additional immunostains",
          "isCorrect": false,
          "distractorRationale": "Ancillary stains can contribute to classification, but they do not settle which clinical sector was represented. The benign fragment need not be erroneous to leave the changing focus unexplained."
        }
      ],
      "explanation": "A benign fragment and a concerning clinical lesion can coexist without either record being inherently false. Here the first review question is which sector the submitted tissue represents: the request label and procedure photograph differ. Technical re-review of that fragment does not by itself resolve its clinical provenance. The completion specimen must still be interpreted with the lesion map.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
        "claim.qq20261102e.mapped-partial-skin-evidence"
      ],
      "teachingPoint": "A benign fragment and a concerning clinical lesion can coexist without either record being inherently false. Here the first review question is which sector the submitted tissue represents: the request label and procedure photograph differ. Technical re-review of that fragment does not by itself resolve its clinical provenance. The completion specimen must still be interpreted with the lesion map."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
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
      "reason": "Existing objective applied with revised wording/data; no concept meaning change."
    }
  },
  {
    "id": "revision.qq20261102f.b17-context",
    "auditId": "B17-context",
    "caseId": "case.pigmented-skin-lesion.changing-back-lesion",
    "nodeId": "node.pigmented-skin-lesion.changing-back-lesion.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r7",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r8",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v9"
    ],
    "previousStem": "Which provisional classification should accompany {patientName}'s request for completion excision?",
    "previousChoiceLabels": [
      "Sampled sector in situ; residual-lesion invasion unassessed",
      "Sampled sector in situ; residual-lesion invasion excluded",
      "Sampled sector invasive; residual-lesion invasion unassessed",
      "Sampled sector invasive; residual-lesion invasion excluded"
    ],
    "previousCurrentUpdate": "The outside punch diagram marks a flat peripheral sector. The fragment shows melanoma cells within the epidermis; dermis is present beneath that sector. The raised focus remains elsewhere in the residual pigmented area on the map.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Validate the limited epidermal diagnosis from the explicit dermal observation, rather than equate dermis being present with either invasion or its absence. Then Reject extending that local classification into a lesion-wide treatment plan and choose a feasible diagnostic specimen that can resolve the residual uncertainty.",
    "reviewerNotes": "Dermatopathology and the treating clinician must confirm specimen mapping, local-versus-residual interpretation and the proposed request. No partial result establishes all residual tissue, and no obligatory extra procedure or exact margin is invented.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_1": "excisional_1",
      "choice.qq20261102f.b17-context.d1": "choice.qq20261102e.b17-context.d1",
      "choice.qq20261102f.b17-context.d2": "choice.qq20261102e.b17-context.d2"
    },
    "choiceServiceOverrides": {
      "excisional_1": "service.skin_excisional_biopsy",
      "choice.qq20261102f.b17-context.d1": null,
      "choice.qq20261102f.b17-context.d2": null
    },
    "currentUpdate": "The outside punch sampled a flat peripheral sector. Atypical melanocytes meeting the pathologist's melanoma criteria are confined to the epidermis in the examined sections; the represented dermis contains none of those cells. The procedure map and current examination show the raised focus in the remaining pigmented lesion. The referral proposes treating the residual lesion using the peripheral report.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r7",
      "whatChanged": "Repair the missing invasion observation and replace the classification matrix with a diagnostic-versus-treatment extent decision prompted by the outside referral's extrapolation. Explicitly version the changed construct.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review6-20261102.json#B17-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Keep necessary mapping but make it change the operative plan; the answer is no longer residual invasion unassessed selected from a simple spatial matrix."
        ],
        "fairness": [
          "fairness 1: Explicitly state that examined dermis contains none of the atypical melanoma cells. Dermis being represented alone is not used to establish local confinement.",
          "fairness 2: Re-solve the item with that negative supplied: local epidermal disease is supported, whole-residual classification is not. The new alternatives are primary-site procedures rather than underdetermined labels.",
          "fairness 3: Move the confinement observation into the displayed update, where it is needed. Post-answer text is not a substitute for decisive information.",
          "fairness 4: Use a real extrapolation error in a treatment referral and feasible complete diagnostic sampling to create a consequential application. No ambiguity or new basic label substitutes for difficulty."
        ],
        "suggestions": [
          "suggestions 1: Supply the raw compartment-negative observation rather than the answer label in situ. Keep its limited scope and do not infer whole-lesion absence of invasion.",
          "suggestions 2: Make the interpretation choose among complete diagnostic, lesion-wide treatment and targeted partial procedures. Existing diagnostic-sampling claims support the preference; clinician review remains required.",
          "suggestions 3: Preserve the exact passed B17 and returned 1.4-mm result. Earlier feedback does not discuss sentinel-node timing, reconstruction or the later answer."
        ]
      },
      "selfCheck": {
        "cueAttack": "Necessary absence of melanoma cells in examined dermis is supplied for fairness. The task now makes the local/residual distinction consequential to three real primary-site procedure plans; it is not merely epidermis-to-in-situ translation. No option contains its own rationale or a special safety qualifier.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Validate the limited epidermal diagnosis from the explicit dermal observation, rather than equate dermis being present with either invasion or its absence.",
          "Reject extending that local classification into a lesion-wide treatment plan and choose a feasible diagnostic specimen that can resolve the residual uncertainty."
        ],
        "oneBestAnswer": "The punch establishes only the local epidermal component; the raised residual focus is unrepresented, and complete removal is feasible in the unchanged shared examination.",
        "closestDistractor": "Treat the whole residual lesion as in situ because the first biopsy was correctly read that way, or take another targeted partial specimen despite feasible complete diagnostic sampling.",
        "remainingReview": "Dermatopathology and the treating clinician must confirm specimen mapping, local-versus-residual interpretation and the proposed request. No partial result establishes all residual tissue, and no obligatory extra procedure or exact margin is invented."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v10",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r8",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v4",
      "stem": "Which primary-site procedure should be arranged next for {patientName}?",
      "answerChoices": [
        {
          "id": "excisional_1",
          "label": "Excisional biopsy of the complete lesion",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The sampled sector is epidermis confined, but its report does not establish the invasive status of the raised residual component. Complete diagnostic removal is feasible and can supply the architecture and maximum invasion information needed before selecting treatment extent."
        },
        {
          "id": "choice.qq20261102f.b17-context.d1",
          "label": "Wide local excision for melanoma in situ",
          "isCorrect": false,
          "distractorRationale": "This converts a valid local epidermal diagnosis into a whole-lesion treatment classification before the raised residual focus is represented. A therapeutic plan based on that extension may use the wrong disease extent."
        },
        {
          "id": "choice.qq20261102f.b17-context.d2",
          "label": "Full-thickness incisional biopsy of the raised focus",
          "isCorrect": false,
          "distractorRationale": "Targeting the raised component is a credible way to seek invasion information, but it again samples part of a lesion whose complete diagnostic removal is feasible, leaving whole-lesion architecture and maximum depth less fully represented."
        }
      ],
      "explanation": "The represented dermis is explicitly free of the atypical melanoma cells, so the local epidermal diagnosis is supported. That does not classify a separate residual focus. When the whole suspicious lesion can be removed diagnostically, representative architecture and invasion assessment should precede selecting its treatment extent.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
        "claim.qq20261102e.mapped-partial-skin-evidence"
      ],
      "teachingPoint": "The represented dermis is explicitly free of the atypical melanoma cells, so the local epidermal diagnosis is supported. That does not classify a separate residual focus. When the whole suspicious lesion can be removed diagnostically, representative architecture and invasion assessment should precede selecting its treatment extent."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
      "nextConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v4",
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
      "reason": "The scored objective changes from a local/residual classification matrix to the extent and phase of the next primary-site procedure. Retain mapped-evidence v3 and the original procedural concept; do not transfer their review history."
    }
  },
  {
    "id": "revision.qq20261102f.b18-context",
    "auditId": "B18-context",
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r7",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r8",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v9"
    ],
    "previousStem": "How should the reported depth be carried into {patientName}'s completion-excision planning?",
    "previousChoiceLabels": [
      "Retain at least 0.6 mm; await the final maximum depth",
      "Retain at most 0.6 mm; await the final maximum depth",
      "Retain exactly 0.6 mm; use it as the maximum depth",
      "Retain no measured depth; await the final maximum depth"
    ],
    "previousCurrentUpdate": "The outside shave contains invasive atypical melanocytes at the deep cut surface. The measured distance from the granular layer to that cut surface is 0.6 mm. The firm focus remains in the residual lesion.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Retain the greatest demonstrated invasive extent across the two specimens and distinguish it from an unknown whole-lesion maximum. Then Apply the existing supported greater-than-1-mm discussion boundary to that lower bound rather than require an exact final maximum first.",
    "reviewerNotes": "Dermatopathology must confirm cross-specimen depth integration and measurement validity, and melanoma clinicians must confirm the provisional nodal discussion. The existing greater-than-1-mm claim is reused offline; 1.8 and 0.6 mm are constructed specimen measurements, not new treatment cutoffs. Later suspicious-node assessment and reconstruction choices remain unprompted.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_3": "excisional_3",
      "choice.qq20261102f.b18-context.d1": "choice.qq20261102e.b18-context.d1",
      "choice.qq20261102f.b18-context.d2": "choice.qq20261102e.b18-context.d2",
      "choice.qq20261102f.b18-context.d3": "choice.qq20261102e.b18-context.d3"
    },
    "choiceServiceOverrides": {
      "excisional_3": "service.skin_excisional_biopsy",
      "choice.qq20261102f.b18-context.d1": null,
      "choice.qq20261102f.b18-context.d2": null,
      "choice.qq20261102f.b18-context.d3": null
    },
    "currentUpdate": "Two mapped outside specimens are available. The earlier full-thickness punch from one sector contains invasive melanoma measuring 1.8 mm from the granular layer to the deepest tumor; that fragment's deep edge is free of tumor. A later shave from another sector measures 0.6 mm to melanoma at its deep cut surface. A firm focus remains in the residual lesion. No regional node is palpable at this visit. Completion sampling is being arranged.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r7",
      "whatChanged": "Replace a single truncation-rule matrix with two conflicting-depth records plus a consequential, sourced planning boundary. Preserve the original constructed 0.6-mm observation as a non-threshold.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review6-20261102.json#B18-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: A cut-surface phrase no longer alone selects the key. A separate greater, intact-base invasive measurement must be retained and then used for a different planning question.",
          "cues 2: Remove every exact/upper-bound/discard-all foil. Each option uses a lower bound and makes an equally scoped provisional discussion entry."
        ],
        "fairness": [
          "fairness 1: Retain the valid 0.6-mm lower-bound logic, but prevent it from erasing a separate greater demonstrated invasive depth.",
          "fairness 2: Make the bound consequential to a sourced discussion decision, rather than count two parts of truncation as two steps.",
          "fairness 3: Keep 0.6 mm constructed and non-threshold. Add a constructed 1.8-mm finding and map the actual discussion boundary to the pre-existing greater-than-1-mm guidance, not to either case number itself.",
          "fairness 4: Do not assert a final maximum or automatic procedure. Require pathology and melanoma review of the integrated provisional record."
        ],
        "suggestions": [
          "suggestions 1: Integrate two mapped reports, then apply a supported management-discussion boundary; the latest-report and wait-for-exact-maximum errors are distinct plausible near misses.",
          "suggestions 2: Supply the earlier valid invasive measurement and clinically node-negative examination. Reuse exact existing greater-than-1-mm source/claim support; no threshold from memory.",
          "suggestions 3: Do not relabel the item basic. A new construct version records the materially expanded integration/planning objective."
        ]
      },
      "selfCheck": {
        "cueAttack": "All four entries retain an at-least value and have equal reporting scope; uncertainty is common rather than key-only. Both possible values and both discussion decisions occur twice, so no majority-component shortcut selects the key. Hiding either specimen or the clinical node status breaks the full justification.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Retain the greatest demonstrated invasive extent across the two specimens and distinguish it from an unknown whole-lesion maximum.",
          "Apply the existing supported greater-than-1-mm discussion boundary to that lower bound rather than require an exact final maximum first."
        ],
        "oneBestAnswer": "A valid earlier 1.8-mm invasive measurement survives the later 0.6-mm transected report and already exceeds the sourced discussion boundary; no regional node is palpable at this visit.",
        "closestDistractor": "Use the latest smaller report or postpone every staging discussion until an exact maximum is available, despite a sufficient already-demonstrated extent.",
        "remainingReview": "Dermatopathology must confirm cross-specimen depth integration and measurement validity, and melanoma clinicians must confirm the provisional nodal discussion. The existing greater-than-1-mm claim is reused offline; 1.8 and 0.6 mm are constructed specimen measurements, not new treatment cutoffs. Later suspicious-node assessment and reconstruction choices remain unprompted."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v10",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r8",
      "conceptId": "concept.pigmented-skin-lesion.partial-depth-nodal-planning.v1",
      "stem": "Which provisional depth and nodal-discussion entry should accompany {patientName}'s completion-sampling request?",
      "answerChoices": [
        {
          "id": "excisional_3",
          "label": "At least 1.8 mm; nodal-staging discussion supported",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The greatest demonstrated invasive extent is not erased by a later shallower transected fragment. Even though the whole-lesion maximum is not final, the established depth is already in the range supporting a sentinel-node discussion in this clinically node-negative setting."
        },
        {
          "id": "choice.qq20261102f.b18-context.d1",
          "label": "At least 0.6 mm; nodal-staging discussion supported",
          "isCorrect": false,
          "distractorRationale": "The general discussion direction does not repair the depth record: this drops the greater demonstrated invasive extent simply because another specimen was later or transected."
        },
        {
          "id": "choice.qq20261102f.b18-context.d2",
          "label": "At least 1.8 mm; nodal-staging discussion deferred",
          "isCorrect": false,
          "distractorRationale": "This preserves the demonstrated extent but treats uncertainty about a possibly greater maximum as a reason to ignore a discussion boundary already crossed by known evidence."
        },
        {
          "id": "choice.qq20261102f.b18-context.d3",
          "label": "At least 0.6 mm; nodal-staging discussion deferred",
          "isCorrect": false,
          "distractorRationale": "This both replaces the greater demonstrated extent with a later smaller value and uses incomplete maximum-depth assessment to defer an already supported discussion."
        }
      ],
      "explanation": "Integrate the mapped specimens rather than replace one with the latest report. The 1.8-mm invasive measurement remains demonstrated; a 0.6-mm tumor-positive cut base cannot lower it. The whole-lesion maximum may still increase. The existing greater-than-1-mm guidance supports discussing sentinel-node staging in this clinically node-negative setting while primary assessment continues. It does not order a nodal procedure or determine how a later abnormal node should be assessed.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling",
        "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
        "claim.qq20261102e.transected-depth-lower-bound",
        "claim.qq20261102f.integrated-partial-depth-planning",
        "claim.qq20261102a.melanoma-integrated-node-staging"
      ],
      "teachingPoint": "Integrate the mapped specimens rather than replace one with the latest report. The 1.8-mm invasive measurement remains demonstrated; a 0.6-mm tumor-positive cut base cannot lower it. The whole-lesion maximum may still increase. The existing greater-than-1-mm guidance supports discussing sentinel-node staging in this clinically node-negative setting while primary assessment continues. It does not order a nodal procedure or determine how a later abnormal node should be assessed."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
      "nextConceptId": "concept.pigmented-skin-lesion.partial-depth-nodal-planning.v1",
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
      "reason": "The score now integrates two specimen-depth records and applies an independently sourced nodal-discussion boundary; it is no longer only lower-bound report recognition. Retain mapped-partial-evidence and prior nodal-staging concepts without FSRS-history transfer."
    }
  },
  {
    "id": "revision.qq20261102f.b19-context",
    "auditId": "B19-context",
    "caseId": "case.soft-tissue-mass.deep-thigh",
    "nodeId": "node.soft-tissue-mass.deep-thigh.1",
    "previousQuestionVariantId": "question.soft-tissue-mass.extremity-mri.v1.r7",
    "questionVariantId": "question.soft-tissue-mass.extremity-mri.v1.r8",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v9"
    ],
    "previousStem": "Which proposed target and corridor should {patientName}'s radiology planning report carry forward?",
    "previousChoiceLabels": [
      "Region R through the anterior corridor",
      "Region P through the anterior corridor",
      "Region Q through the medial corridor"
    ],
    "previousCurrentUpdate": "The outside MRI covers the entire thigh mass. The involved muscle is rectus femoris; the adjacent adductor compartment is separate from it. The table describes matched T1 acquisitions and the proposed needle corridors. The three regions can each be reached percutaneously.",
    "previousExhibit": {
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
    },
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Recognize that intrinsic T1 brightness and changed suppression confound the apparent contrast comparison in the outside record. Then Select the additional image comparison that addresses that acquisition problem rather than more planes or different weighting alone.",
    "reviewerNotes": "MSK/sarcoma radiology must confirm the constructed sequence settings and the recommended comparison. Existing primary MRI-targeting guidance is reused offline as a technical application, not a fresh source check or a universal requirement for this exact protocol. No target, tract, diagnosis, contrast dose or biopsy needle specification is assigned here.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "extremity_mri_1": "extremity_mri_1",
      "choice.qq20261102f.b19-context.d1": "choice.qq20261102e.b19-context.d1",
      "choice.qq20261102f.b19-context.d2": "choice.qq20261102e.b19-context.d2"
    },
    "choiceServiceOverrides": {
      "extremity_mri_1": "service.extremity_mri",
      "choice.qq20261102f.b19-context.d1": null,
      "choice.qq20261102f.b19-context.d2": null
    },
    "currentUpdate": "The outside MRI covers the whole thigh mass. A central part is bright on the precontrast T1 sequence, which has no fat suppression. The supplied postcontrast T1 sequence uses fat suppression; fluid-sensitive images also show bright areas. The team is completing the local MRI record before tissue sampling.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.soft-tissue-mass.extremity-mri.v1.r7",
      "whatChanged": "Replace convergent target/tract selection with a distinct acquisition-comparability task. Remove all tract, compartment and core-versus-open teaching from earlier feedback; later A/B labels first appear in the unchanged returned report.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review6-20261102.json#B19-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Delete the entire repeated-enhancement table; no majority signal component remains.",
          "cues 2: Delete all corridor components and compartment labels from this earlier item; no majority route can be combined with the signal row.",
          "cues 3: Remove the separate-compartment rule from this returned item's task, options, rationale, explanation and teaching point. Do not change passed B19.",
          "cues 4: Remove the rectus-femoris favored-target statement and all target-specific tract feedback before B19. The new scored task concerns acquisition comparability, not the same rule in different prose."
        ],
        "fairness": [
          "fairness 1: Retain a defensible local-imaging application but explicitly version the change away from the previously fair isolated target/tract question.",
          "fairness 2: Use three same-stage acquisition comparisons with similar grammar and specificity. Explicitly specify suppression in the precontrast T1 distractor so an unstated suppressed baseline cannot make it defensible. No option is a uniquely comprehensive caution plan.",
          "fairness 3: Reuse the primary enhancement-targeting source offline with a new transparent technical-application claim; MSK review remains required and no numerical cutoff is added.",
          "fairness 4: Record actual runtime order and the audit of later visibleHistory. Removing feedback alone is insufficient, so the preceding scored task no longer asks for a tract choice.",
          "fairness 5: Introduce no P/Q/R lesion regions. Earlier labels are sequence settings; the unchanged returned MRI report first introduces regions A/B for the completed study."
        ],
        "suggestions": [
          "suggestions 1: Remove the whole majority-component construction rather than pad it with a fourth plan.",
          "suggestions 2: Protect every passed B19 byte by changing only this returned earlier task and feedback to a distinct acquisition question. No tract rule or biopsy-method answer is taught here.",
          "suggestions 3: Make chronology explicit: outside image settings precede the completed local MRI report. A/B are not renamed earlier targets.",
          "suggestions 4: Do not assume owner acceptance of teaching/rehearsal. The new sequence is flagged for independent re-review; no carried rating is claimed as a fresh sequence finding."
        ]
      },
      "selfCheck": {
        "cueAttack": "Remove the P/Q/R target-and-corridor table entirely. All three choices are plausible MRI acquisition comparisons of similar length. There is no majority-component table and no anatomy/tract component to rehearse the later passed answer.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that intrinsic T1 brightness and changed suppression confound the apparent contrast comparison in the outside record.",
          "Select the additional image comparison that addresses that acquisition problem rather than more planes or different weighting alone."
        ],
        "oneBestAnswer": "The existing pre/post T1 pair differs in suppression as well as contrast; neither additional postcontrast planes nor a precontrast T1/T2 comparison supplies the missing controlled contrast comparison.",
        "closestDistractor": "Treat brighter postcontrast appearance, more imaging planes or a fluid-sensitive bright region as adequate evidence of enhancement without checking the acquisition baseline.",
        "remainingReview": "MSK/sarcoma radiology must confirm the constructed sequence settings and the recommended comparison. Existing primary MRI-targeting guidance is reused offline as a technical application, not a fresh source check or a universal requirement for this exact protocol. No target, tract, diagnosis, contrast dose or biopsy needle specification is assigned here."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v10",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.extremity-mri.v1.r8",
      "conceptId": "concept.soft-tissue-mass.extremity-mri.v4",
      "stem": "Which additional MRI comparison should be obtained for {patientName}'s biopsy planning?",
      "answerChoices": [
        {
          "id": "extremity_mri_1",
          "label": "Axial T1 before and after contrast, both with fat suppression",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "A comparison with consistent sequence settings can distinguish intrinsic precontrast brightness from contrast-related change. The outside pair changes both contrast status and suppression, so brightness differences cannot simply be assigned to enhancement."
        },
        {
          "id": "choice.qq20261102f.b19-context.d1",
          "label": "Axial and coronal T1 after contrast, both with fat suppression",
          "isCorrect": false,
          "distractorRationale": "Orthogonal anatomy is useful, but two postcontrast views do not supply a comparable precontrast baseline for the intrinsically bright area."
        },
        {
          "id": "choice.qq20261102f.b19-context.d2",
          "label": "Axial T1 without fat suppression and fluid-sensitive images before contrast",
          "isCorrect": false,
          "distractorRationale": "These contribute tissue characterization but retain an unsuppressed T1 baseline. Different sequence weighting does not supply the comparable pre/postcontrast information needed for this targeting question."
        }
      ],
      "explanation": "Signal differences must be interpreted against how the images were acquired. A bright native T1 region and a postcontrast image with a different suppression setting cannot simply be compared as if contrast were their only difference. Comparable before/after acquisitions can clarify enhancement for the later planning report.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.mri",
        "claim.qq20261102a.sarcoma-local-imaging",
        "claim.qq20261102c.sarcoma-mri-coverage-and-target",
        "claim.qq20261102a.sarcoma-viable-biopsy-target",
        "claim.qq20261102b.sarcoma-method-and-tract",
        "claim.qq20261102c.sarcoma-enhancement-biopsy-target",
        "claim.qq20261102f.mri-comparable-contrast-acquisition"
      ],
      "teachingPoint": "Signal differences must be interpreted against how the images were acquired. A bright native T1 region and a postcontrast image with a different suppression setting cannot simply be compared as if contrast were their only difference. Comparable before/after acquisitions can clarify enhancement for the later planning report."
    },
    "clinicalBinding": {
      "previousConceptId": "concept.soft-tissue-mass.extremity-mri.v3",
      "nextConceptId": "concept.soft-tissue-mass.extremity-mri.v4",
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
      "reason": "The scored objective changes from target-plus-tract selection to MRI acquisition adequacy. This deliberately removes rehearsal of the frozen later method/tract task and retains the previous v3 construct for saved encounters and scheduling history."
    }
  },
  {
    "id": "revision.qq20261102f.b24",
    "auditId": "B24",
    "caseId": "case.l2.gastric-malt.cd20-boundary.v1",
    "nodeId": "node.gastric-malt.cd20-alone-boundary.v1",
    "previousQuestionVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r7",
    "questionVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r8",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v9"
    ],
    "previousStem": "Which area should be prioritized as evidence for {patientName}'s subtype classification?",
    "previousChoiceLabels": [
      "Area B for integrated subtype assessment",
      "Area A for integrated subtype assessment",
      "Area C for integrated subtype assessment"
    ],
    "previousCurrentUpdate": "Additional levels from the same gastric block show the three areas described in the table.",
    "previousExhibit": {
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
    },
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the competing follicular, gland-infiltrating and scattered-large-cell patterns under the shared original lineage/clonality record. Then Select the field whose architecture contributes to integrated subtype assessment rather than repeat a stain token or prioritize the most conspicuous cells.",
    "reviewerNotes": "Hematopathology must verify the constructed field descriptions and their relative diagnostic value. The source-backed integrated-morphology principle does not assert uniform stains, an obligatory single feature or a diagnosis of transformation from scattered cells.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "lineage_not_diagnosis": "lineage_not_diagnosis",
      "choice.qq20261102f.b24.d1": "choice.qq20261102e.b24.d1",
      "choice.qq20261102f.b24.d2": "choice.qq20261102e.b24.d2"
    },
    "choiceServiceOverrides": {
      "lineage_not_diagnosis": null,
      "choice.qq20261102f.b24.d1": null,
      "choice.qq20261102f.b24.d2": null
    },
    "currentUpdate": "Additional levels from the same gastric block show the three areas described in the table.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r7",
      "whatChanged": "Remove the unique CD20 repetition and balance the small-lymphocyte descriptions across fields. Keep the architectural discriminator, equal area choices and integrated-classification task.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review6-20261102.json#B24",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Remove CD20 from Area B. All fields contain small lymphocytes, so the original lineage wording cannot nominate one area by token matching.",
          "cues 2: Describe the small-cell arrangement and gland relationship without an area-specific stain result. Do not invent uniform immunophenotyping across fields."
        ],
        "fairness": [
          "fairness 1: Retain equal-scope area options and the integrated-classification task; no uniquely cautious conclusion is introduced.",
          "fairness 2: Keep Area B's architectural relevance without claiming that it alone establishes a definitive subtype or a universal required lesion.",
          "fairness 3: Preserve the different-level chronology and scattered-versus-diffuse large-cell distinction; morphology still requires expert review.",
          "fairness 4: Perform the requested hidden-gland-row attack: the remaining labels share small lymphocytes and no field uniquely repeats the original CD20 token."
        ],
        "suggestions": [
          "suggestions 1: Remove the unique stain repetition while keeping the architectural observations that should decide the answer.",
          "suggestions 2: Do not add a shared stain claim. Common cell-size wording describes constructed fields, not assumed uniform immunophenotype.",
          "suggestions 3: Retain exact area-choice scope and task. Record the row-deletion cue attack and require hematopathology verification."
        ]
      },
      "selfCheck": {
        "cueAttack": "Every field now contains small lymphocytes; none repeats CD20. Hiding the gland-relationship row leaves no unique stem/stain token nominating B. No uniform staining across the three areas is invented, and the unchanged area options have identical scope.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the competing follicular, gland-infiltrating and scattered-large-cell patterns under the shared original lineage/clonality record.",
          "Select the field whose architecture contributes to integrated subtype assessment rather than repeat a stain token or prioritize the most conspicuous cells."
        ],
        "oneBestAnswer": "The gland-relationship row, not a unique stain or small-cell label, distinguishes Area B's architecture.",
        "closestDistractor": "Prioritize conspicuous large cells or a prominent follicle, or match the original stain label without examining epithelial relationships.",
        "remainingReview": "Hematopathology must verify the constructed field descriptions and their relative diagnostic value. The source-backed integrated-morphology principle does not assert uniform stains, an obligatory single feature or a diagnosis of transformation from scattered cells."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v10",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.cd20-alone-boundary.v1.r8",
      "conceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "stem": "Which area should be prioritized as evidence for {patientName}'s subtype classification?",
      "answerChoices": [
        {
          "id": "lineage_not_diagnosis",
          "label": "Area B for integrated subtype assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The small-cell gland-infiltrating and epithelial-disrupting pattern contributes relevant architecture to the known lineage/clonality findings. It does not make a single feature universally necessary or sufficient for the subtype."
        },
        {
          "id": "choice.qq20261102f.b24.d1",
          "label": "Area A for integrated subtype assessment",
          "isCorrect": false,
          "distractorRationale": "A polarized macrophage-rich follicle is conspicuous but does not supply the same small-cell gland relationship. The known B-cell clone does not make every lymphoid area equally specific."
        },
        {
          "id": "choice.qq20261102f.b24.d2",
          "label": "Area C for integrated subtype assessment",
          "isCorrect": false,
          "distractorRationale": "Scattered large cells warrant attention but are not the same as a diffuse large-cell component. Their presence alone does not replace the relevant small-cell architectural assessment."
        }
      ],
      "explanation": "Lineage and clonality require morphological context. Among these constructed fields, the gland-infiltrating small-cell pattern provides the most relevant additional architecture for integrated MALT assessment. A prominent follicle and scattered large cells require interpretation rather than automatic subtype labels; none of these observations alone closes the diagnosis.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.integrated-pathologic-recognition",
        "claim.qq20261102a.gastric-lineage-not-classification",
        "claim.qq20261102b.gastric-clone-not-diagnosis",
        "claim.qq20261102b.gastric-uncertainty-repeat-biopsy",
        "claim.qq20261102c.gastric-clonality-classification-boundary"
      ],
      "teachingPoint": "Lineage and clonality require morphological context. Among these constructed fields, the gland-infiltrating small-cell pattern provides the most relevant additional architecture for integrated MALT assessment. A prominent follicle and scattered large cells require interpretation rather than automatic subtype labels; none of these observations alone closes the diagnosis.",
      "exhibit": {
        "kind": "table",
        "caption": "Constructed observations from deeper histology levels; the original lineage/clonality results remain part of the integrated record.",
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
            "Small lymphocytes in polarized follicles containing numerous macrophages",
            "Small lymphocytes in irregular groups between follicles",
            "Small lymphocytes with scattered large cells having vesicular nuclei"
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
    "id": "revision.qq20261102f.b36",
    "auditId": "B36",
    "caseId": "case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
    "nodeId": "node.gs028se.pdsa-act-qi-measures.a-abandon-harm.1",
    "previousQuestionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r7",
    "questionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r8",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v9"
    ],
    "previousStem": "Which comparison should {patientName}'s team use for its next PDSA test?",
    "previousChoiceLabels": [
      "Current-list manual entry versus current-list prefill",
      "Prior-list manual entry versus prior-list prefill",
      "Prior-list manual entry versus current-list manual entry"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Separate the observed source-agreement pattern from the entry-method time pattern, then identify which high-agreement manual workflow still carries the greater burden. Then Choose the new comparison that tests adapting that workflow against its own baseline rather than prioritize an already lower-burden workflow or change source and method together.",
    "reviewerNotes": "QI/owner review must confirm the prioritization under the stated reduce-work/retain-agreement aim. The efficient structured workflow is a constructed comparator, not proof that its format causes the time difference. Counts, times and contacts are coherent simulated records; no causal proof, rollout threshold or gameplay analytics.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_abandon-harm": "correct_abandon-harm",
      "choice.qq20261102f.b36.d1": "choice.qq20261102e.b36.d1",
      "choice.qq20261102f.b36.d2": "choice.qq20261102e.b36.d2"
    },
    "choiceServiceOverrides": {
      "correct_abandon-harm": null,
      "choice.qq20261102f.b36.d1": null,
      "choice.qq20261102f.b36.d2": null
    },
    "currentUpdate": "The next cycle will test an entry adaptation with the same interview, final clinical review and record-agreement checks. Source L is the signed visit narrative list; source M is the prior-visit list; source N is a structured list reconciled for that visit. The team aims to reduce entry work while retaining agreement with the reconciled medication record.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r7",
      "whatChanged": "Add an efficient high-agreement manual workflow and compare three genuinely new tests. Two controlled method tests now compete, requiring both agreement and burden data before prioritizing the first adaptation.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review6-20261102.json#B36",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Every comparison now introduces an untested prefill workflow. Two are within-source controlled method comparisons; neither novelty nor a generic keep-one-factor rule selects L over N without outcomes."
        ],
        "fairness": [
          "fairness 1: Retain the source/method pattern and add an equally high-agreement but already lower-burden manual workflow. The resident must integrate both outcomes before choosing which controlled adaptation to prioritize.",
          "fairness 2: Keep the exploratory character, the same ten simulated visit records, explicit minute/count denominators and continuing review/agreement checks. No causal benefit is asserted.",
          "fairness 3: Remove the repeat-only foils. N-prefill is a genuinely new controlled test and a credible later choice; the complete-workflow benchmark is also new but answers a less direct adaptation question.",
          "fairness 4: Contacts support the agreement pattern rather than being essential. Time distinguishes the two high-agreement controlled targets; agreement prevents faster prefilling of a poor source from being called the whole solution.",
          "fairness 5: Introduce no clinical threshold, rollout criterion, empirical effect size or gameplay statistic."
        ],
        "suggestions": [
          "suggestions 1: Offer three genuinely new comparisons, including two plausible controlled method tests. All retain review and record-agreement checks in shared context.",
          "suggestions 2: Require the data to rank the controlled L and N tests: the source-agreement and manual-burden observations cannot both be discarded. Preserve QI review of the priority judgment.",
          "suggestions 3: Keep the constructed-data label and the same-record denominators. The missing combinations remain hypotheses, not guaranteed combined benefits."
        ]
      },
      "selfCheck": {
        "cueAttack": "All three comparisons are new; L prefill or N prefill was absent from the pilot. Two alternatives are equally controlled within-source method tests, so design alone cannot identify the key. Hiding the time or agreement row prevents the full ranking; L/N labels do not intrinsically identify the higher-burden source. No key-only novelty or uniquely cautious check remains.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Separate the observed source-agreement pattern from the entry-method time pattern, then identify which high-agreement manual workflow still carries the greater burden.",
          "Choose the new comparison that tests adapting that workflow against its own baseline rather than prioritize an already lower-burden workflow or change source and method together."
        ],
        "oneBestAnswer": "L and N both agree on ten of ten records, but manual L takes 50 minutes versus 15 for N; the M manual/prefill pair supplies the observed entry-time opportunity without repairing M's agreement.",
        "closestDistractor": "Choose the equally novel N within-source test because it also has high agreement, without comparing its already lower manual burden, or benchmark L prefill against N manual without isolating the adaptation.",
        "remainingReview": "QI/owner review must confirm the prioritization under the stated reduce-work/retain-agreement aim. The efficient structured workflow is a constructed comparator, not proof that its format causes the time difference. Counts, times and contacts are coherent simulated records; no causal proof, rollout threshold or gameplay analytics."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v10",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.quality-improvement.pdsa-act-and-iterate.v3.r8",
      "conceptId": "concept.quality-improvement.pdsa-act-and-iterate",
      "stem": "Which comparison should {patientName}'s team prioritize for its next PDSA test?",
      "answerChoices": [
        {
          "id": "correct_abandon-harm",
          "label": "Source L manual entry versus source L prefill",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "This retains an input with the better agreement record and tests the demonstrated entry-time opportunity where the recorded burden remains greater. It directly evaluates a method change within that workflow without assuming success."
        },
        {
          "id": "choice.qq20261102f.b36.d1",
          "label": "Source N manual entry versus source N prefill",
          "isCorrect": false,
          "distractorRationale": "This is an equally new controlled method comparison using another high-agreement source. It is a credible later test, but its manual entry already has the lower observed burden, making it a weaker first target for the stated improvement aim."
        },
        {
          "id": "choice.qq20261102f.b36.d2",
          "label": "Source N manual entry versus source L prefill",
          "isCorrect": false,
          "distractorRationale": "This is also a new comparison and could benchmark complete workflows. It changes source and entry method together, rather than establish the effect of adapting the higher-burden manual workflow against its own baseline."
        }
      ],
      "explanation": "The source-M comparison suggests a possible time gain from prefilling without resolving its source-related agreement problem. Sources L and N both have the better agreement record, but manual entry from L retains the greater observed burden. Test L manual entry against L prefill first, preserving review and measuring agreement and burden again. N manual entry is a useful efficient comparator, but comparing it with L prefill would change two workflow features. These small constructed observations support a next-test hypothesis, not a causal benefit or rollout decision.",
      "teachingPoint": "The source-M comparison suggests a possible time gain from prefilling without resolving its source-related agreement problem. Sources L and N both have the better agreement record, but manual entry from L retains the greater observed burden. Test L manual entry against L prefill first, preserving review and measuring agreement and burden again. N manual entry is a useful efficient comparator, but comparing it with L prefill would change two workflow features. These small constructed observations support a next-test hypothesis, not a causal benefit or rollout decision.",
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.pdsa-act",
        "claim.qq20261102a.pdsa-outcome-balancing-adaptation",
        "claim.qq20261102b.pdsa-hypothesis-not-proof",
        "claim.qq20261102c.pdsa-source-specific-next-test",
        "claim.qq20261102c.qi-comparison-input-control"
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed pilot data: the same ten visit records are processed under each workflow. Time is total form-entry staff-minutes; agreement counts forms matching the reconciled record; contacts are recorded for those ten simulated visits.",
        "columnHeaders": [
          "Source L, manual entry",
          "Source M, manual entry",
          "Source M, prefilled entry",
          "Source N, manual entry"
        ],
        "rowHeaders": [
          "Form-entry staff-minutes",
          "Forms agreeing with reconciled record",
          "Unplanned medication-clarification contacts"
        ],
        "cells": [
          [
            "50",
            "50",
            "15",
            "15"
          ],
          [
            "10 of 10",
            "6 of 10",
            "6 of 10",
            "10 of 10"
          ],
          [
            "8",
            "12",
            "12",
            "8"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.quality-improvement.pdsa-act-and-iterate",
      "nextConceptId": "concept.quality-improvement.pdsa-act-and-iterate",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Existing objective applied with revised wording/data; no concept meaning change."
    }
  }
];

export const QUESTION_QUALITY_ADVERSARIAL_R7_CONCEPT_VERSIONS: QuestionQualityR7ConceptVersion[] = [
  {
    "id": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
    "displayName": "Prioritize care when groin findings have competing symptom sources",
    "learningObjective": "Integrate interval functional observations with a demonstrated reducible inguinal hernia and coexisting musculoskeletal findings to choose the current care priority.",
    "earliestFacilityStage": 1,
    "conceptType": "management",
    "contentVersion": "concept.question-quality.2026-11-02.v4",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v2",
    "versioningReason": "The scored decision now compares active care targets using interval functional evidence, rather than choosing referral timing from an explicitly assigned hernia symptom. Retain the prior repair/observation concept and histories without transfer.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B05-context",
      "B06-context",
      "B07-context",
      "B08-context"
    ],
    "evidenceClaimIds": [
      "claim.inguinal-hernia.symptomatic-elective-repair",
      "claim.qq20261102a.symptomatic-groin-planning",
      "claim.qq20261102c.groin-symptom-attribution",
      "claim.bread-butter.inguinal-hernia.watchful-waiting"
    ]
  },
  {
    "id": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v4",
    "displayName": "Select diagnostic extent after a locally in-situ partial specimen",
    "learningObjective": "Apply an adequately described local epidermal melanoma finding to the next primary-site procedure without extending that finding to an unrepresented raised residual component.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "contentVersion": "concept.question-quality.2026-11-02.v4",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
    "versioningReason": "The scored objective changes from a local/residual classification matrix to the extent and phase of the next primary-site procedure. Retain mapped-evidence v3 and the original procedural concept; do not transfer their review history.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B17-context"
    ],
    "evidenceClaimIds": [
      "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "claim.qq20261102a.melanoma-diagnostic-sampling",
      "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
      "claim.qq20261102e.mapped-partial-skin-evidence"
    ]
  },
  {
    "id": "concept.pigmented-skin-lesion.partial-depth-nodal-planning.v1",
    "displayName": "Integrate partial depth records before a nodal-staging discussion",
    "learningObjective": "Preserve demonstrated invasive depth across mapped partial specimens and decide whether that evidence already supports a sentinel-node staging discussion while primary assessment continues.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "contentVersion": "concept.question-quality.2026-11-02.v4",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3",
    "versioningReason": "The score now integrates two specimen-depth records and applies an independently sourced nodal-discussion boundary; it is no longer only lower-bound report recognition. Retain mapped-partial-evidence and prior nodal-staging concepts without FSRS-history transfer.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B18-context"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102f.integrated-partial-depth-planning",
      "claim.qq20261102a.melanoma-integrated-node-staging",
      "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "claim.qq20261102a.melanoma-diagnostic-sampling",
      "claim.qq20261102c.melanoma-incomplete-biopsy-completion",
      "claim.qq20261102e.transected-depth-lower-bound"
    ]
  },
  {
    "id": "concept.soft-tissue-mass.extremity-mri.v4",
    "displayName": "Check MRI acquisition comparability before biopsy targeting",
    "learningObjective": "Recognize when different acquisition settings prevent an intrinsically bright mass region from being assessed for contrast-related signal change, and request the comparison needed before targeting.",
    "earliestFacilityStage": 1,
    "conceptType": "workup",
    "contentVersion": "concept.question-quality.2026-11-02.v4",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "previousConceptId": "concept.soft-tissue-mass.extremity-mri.v3",
    "versioningReason": "The scored objective changes from target-plus-tract selection to MRI acquisition adequacy. This deliberately removes rehearsal of the frozen later method/tract task and retains the previous v3 construct for saved encounters and scheduling history.",
    "educationalTier": 1,
    "revisedItemIds": [
      "B19-context"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102f.mri-comparable-contrast-acquisition",
      "claim.soft-tissue-mass.mri",
      "claim.qq20261102a.sarcoma-local-imaging",
      "claim.qq20261102c.sarcoma-mri-coverage-and-target",
      "claim.qq20261102a.sarcoma-viable-biopsy-target",
      "claim.qq20261102b.sarcoma-method-and-tract",
      "claim.qq20261102c.sarcoma-enhancement-biopsy-target"
    ]
  }
];
