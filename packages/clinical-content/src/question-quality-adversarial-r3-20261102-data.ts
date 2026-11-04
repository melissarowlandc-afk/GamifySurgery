import type { QuestionQualityRevision } from "./question-quality-pilot-20261028";

/** Third author revision; no independent PASS or clinical approval conferred. Runtime choices randomize. */
export const QUESTION_QUALITY_ADVERSARIAL_R3_DEFINITIONS: QuestionQualityRevision[] = [
  {
    "id": "revision.qq20261102b.a06",
    "auditId": "A06",
    "caseId": "case.gs028b.nipple-discharge.paired-bloody-single-duct",
    "nodeId": "node.gs028b.nipple-discharge.paired-bloody-single-duct.1",
    "previousQuestionVariantId": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r5",
    "questionVariantId": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r6",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which evaluation plan should guide {patientName}'s next visit?",
    "previousChoiceLabels": [
      "Breast assessment and medication review",
      "Medication review and symptom reassessment",
      "Endocrine assessment and medication review"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Separate the spontaneous left-duct episodes from the bilateral expressed secretion and the medication-associated laboratory finding. Then Select parallel breast and medication evaluation rather than delaying the local workup or prematurely escalating the endocrine workup.",
    "reviewerNotes": "Moderate application prediction only. The guideline-supported medication step is coordinated review, not an unsupervised drug stop or a diagnosis of a prolactinoma.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qq20261102b.a06.d1": "choice.qq20261102a.a06.d1",
      "choice.qq20261102b.a06.d2": "choice.qq20261102a.a06.d2",
      "choice.qq20261102b.a06.d3": "choice.qq20261102a.a06.d1"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qq20261102b.a06.d1": null,
      "choice.qq20261102b.a06.d2": null,
      "choice.qq20261102b.a06.d3": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "no_test"
      },
      "choice.qq20261102b.a06.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102b.a06.d2": {
        "kind": "no_test"
      },
      "choice.qq20261102b.a06.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r5",
      "whatChanged": "Replace the only-breast-plan key with four balanced breast/endocrine sequences, including premature central imaging and drug-first deferral as distinct errors. Keep the clinically necessary blood-colored focal observation.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#A06",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Cue response: Every plan addresses both the breast and the systemic finding. The four combinations balance both components; the key is neither the only breast plan nor a combination of disproportionately common components. All four options now address breast evaluation and the systemic finding, removing the organ-only-in-key shortcut and balancing component frequency.",
          "cues 2: Cue response: Every plan addresses both the breast and the systemic finding. The four combinations balance both components; the key is neither the only breast plan nor a combination of disproportionately common components. Retain the focal red-brown and bilateral expressed observations; do not delete needed evidence merely to hide risk."
        ],
        "fairness": [
          "fairness 1: Fairness response: The two observed patterns require distinct handling. Medication review/reassessment is warranted, while focal spontaneous discharge remains an independent breast-evaluation indication. Clinical boundary: Moderate application prediction only. The guideline-supported medication step is coordinated review, not an unsupervised drug stop or a diagnosis of a prolactinoma.",
          "fairness 2: Revision/preservation: Retain the focal red-brown and bilateral expressed observations; do not delete needed evidence merely to hide risk. Every plan addresses both the breast and the systemic finding. The four combinations balance both components; the key is neither the only breast plan nor a combination of disproportionately common components.",
          "fairness 3: Revision/preservation: Use immediate parallel workup versus endocrine-first deferral/premature MRI as the actual decision, with medication review rather than a new drug order. Every plan addresses both the breast and the systemic finding. The four combinations balance both components; the key is neither the only breast plan nor a combination of disproportionately common components.",
          "fairness 4: Preserve the earlier positive repair while applying: Retain the focal red-brown and bilateral expressed observations; do not delete needed evidence merely to hide risk.",
          "fairness 5: Preserve the earlier positive repair while applying: Use immediate parallel workup versus endocrine-first deferral/premature MRI as the actual decision, with medication review rather than a new drug order.",
          "fairness 6: Application revision: Separate the spontaneous left-duct episodes from the bilateral expressed secretion and the medication-associated laboratory finding. Then Select parallel breast and medication evaluation rather than delaying the local workup or prematurely escalating the endocrine workup. Closest error: A careful but anchoring resident may defer the local workup until prolactin normalizes; a cancer-anxious resident may add pituitary MRI before assessing the drug contribution.",
          "fairness 7: Preserve the earlier positive repair while applying: Retain the focal red-brown and bilateral expressed observations; do not delete needed evidence merely to hide risk.",
          "fairness 8: Revision/preservation: Retain the focal red-brown and bilateral expressed observations; do not delete needed evidence merely to hide risk. Every plan addresses both the breast and the systemic finding. The four combinations balance both components; the key is neither the only breast plan nor a combination of disproportionately common components.",
          "fairness 9: Preserve the earlier positive repair while applying: All four options now address breast evaluation and the systemic finding, removing the organ-only-in-key shortcut and balancing component frequency."
        ],
        "suggestions": [
          "suggestions 1: Action: All four options now address breast evaluation and the systemic finding, removing the organ-only-in-key shortcut and balancing component frequency.",
          "suggestions 2: Action: Retain the focal red-brown and bilateral expressed observations; do not delete needed evidence merely to hide risk."
        ]
      },
      "selfCheck": {
        "cueAttack": "Every plan addresses both the breast and the systemic finding. The four combinations balance both components; the key is neither the only breast plan nor a combination of disproportionately common components.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Separate the spontaneous left-duct episodes from the bilateral expressed secretion and the medication-associated laboratory finding.",
          "Select parallel breast and medication evaluation rather than delaying the local workup or prematurely escalating the endocrine workup."
        ],
        "oneBestAnswer": "The two observed patterns require distinct handling. Medication review/reassessment is warranted, while focal spontaneous discharge remains an independent breast-evaluation indication.",
        "closestDistractor": "A careful but anchoring resident may defer the local workup until prolactin normalizes; a cancer-anxious resident may add pituitary MRI before assessing the drug contribution.",
        "remainingReview": "Moderate application prediction only. The guideline-supported medication step is coordinated review, not an unsupervised drug stop or a diagnosis of a prolactinoma."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r6",
      "conceptId": "concept.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition",
      "stem": "Which evaluation plan should guide {patientName}'s next visit?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Continue breast evaluation; review metoclopramide and reassess prolactin",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Separates the focal spontaneous discharge from the expressed bilateral component and addresses a plausible medication effect in parallel."
        },
        {
          "id": "choice.qq20261102b.a06.d1",
          "label": "Continue breast evaluation; obtain pituitary MRI before medication review",
          "isCorrect": false,
          "distractorRationale": "Addresses the breast but treats a potentially medication-related prolactin rise as an established reason to prioritize pituitary imaging."
        },
        {
          "id": "choice.qq20261102b.a06.d2",
          "label": "Defer breast evaluation; review metoclopramide and reassess prolactin",
          "isCorrect": false,
          "distractorRationale": "Makes evaluation of the spontaneous focal discharge contingent on resolution of a separate systemic finding."
        },
        {
          "id": "choice.qq20261102b.a06.d3",
          "label": "Defer breast evaluation; obtain pituitary MRI before medication review",
          "isCorrect": false,
          "distractorRationale": "Combines drug-first delay of the focal workup with premature central imaging before assessment of the medication contribution."
        }
      ],
      "explanation": "A drug-associated bilateral secretory component does not explain away spontaneous focal duct discharge. Continue breast-local evaluation while reviewing metoclopramide and reassessing the prolactin finding; a pituitary study is not the automatic first response to a plausible drug-related elevation.",
      "teachingPoint": "A drug-associated bilateral secretory component does not explain away spontaneous focal duct discharge. Continue breast-local evaluation while reviewing metoclopramide and reassessing the prolactin finding; a pituitary study is not the automatic first response to a plausible drug-related elevation.",
      "supportingEvidenceClaimIds": [
        "claim.discharge.pathologic-pattern",
        "claim.qq20261029.discharge.mixed-pattern",
        "claim.qq20261029.discharge.endocrine-alternative",
        "claim.qq20261102.galactorrhea-pattern",
        "claim.qq20261102a.mixed-discharge-medication",
        "claim.qq20261102a.mixed-discharge-local-assessment",
        "claim.qq20261102b.mixed-discharge-parallel-evaluation"
      ]
    }
  },
  {
    "id": "revision.qq20261102b.a06-context",
    "auditId": "A06-context",
    "caseId": "case.gs028b.nipple-discharge.paired-bloody-single-duct",
    "nodeId": "node.gs028b.nipple-discharge.paired-bloody-single-duct.2",
    "previousQuestionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r6",
    "questionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which initial imaging pathway should be arranged for {patientName}?",
    "previousChoiceLabels": [
      "Mammography and targeted ultrasound",
      "Contrast-enhanced MRI and targeted ultrasound",
      "Mammography and contrast-enhanced MRI"
    ],
    "previousCurrentUpdate": "No breast imaging has yet been performed for these symptoms.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Read the outside protocol rather than treating the word MRI and an intact implant report as a completed cancer/discharge evaluation. Then Choose the still-needed diagnostic pathway rather than repeating an advanced modality or moving directly to duct localization.",
    "reviewerNotes": "Melissa/radiology must confirm the implant-protocol scenario and ranking. Ductography is a localization option, not declared useless. No contrast dose or interval is authored.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qq20261102b.a06-context.d1": "choice.qq20261102a.a06-context.d1",
      "choice.qq20261102b.a06-context.d2": "choice.qq20261102a.a06-context.d2"
    },
    "choiceServiceOverrides": {
      "correct_1": "service.diagnostic_breast_imaging",
      "choice.qq20261102b.a06-context.d1": "service.breast_mri",
      "choice.qq20261102b.a06-context.d2": null
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_imaging_bundle"
      },
      "choice.qq20261102b.a06-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_mri"
      },
      "choice.qq20261102b.a06-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_imaging_bundle"
      }
    },
    "currentUpdate": "{patientName} brings an outside breast MRI report obtained for silicone implants. It lists silicone-sensitive sequences without intravenous gadolinium and reports intact implant shells.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r6",
      "whatChanged": "Replace the uncomplicated no-prior-imaging vignette with a concrete outside implant-MRI protocol and three distinct breast-imaging pathways; retain the existing keyed operational service.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#A06-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Revision/preservation: Make the prior protocol consequential: silicone-sensitive noncontrast imaging addresses implant integrity rather than the discharge problem. All options investigate the breast with two modalities, share the ultrasound component and have comparable detail. The prior report gives sequences/contrast use, not an 'inconclusive' interpretation or a missing-test checklist.",
          "fairness 2: Application revision: Read the outside protocol rather than treating the word MRI and an intact implant report as a completed cancer/discharge evaluation. Then Choose the still-needed diagnostic pathway rather than repeating an advanced modality or moving directly to duct localization. Closest error: Repeating MRI with contrast is a credible response to recognizing the outside protocol limitation, but skips the initial diagnostic mammographic assessment.",
          "fairness 3: Fairness response: The documented MRI is for implant integrity; no conventional symptomatic assessment has been provided. Mammography/targeted ultrasound is the supported initial pathway in this age group. Clinical boundary: Melissa/radiology must confirm the implant-protocol scenario and ranking. Ductography is a localization option, not declared useless. No contrast dose or interval is authored.",
          "fairness 4: Preserve the earlier positive repair while applying: Replace two equivalent premature-MRI errors with contrast-MRI substitution and ductography substitution.",
          "fairness 5: Preserve the earlier positive repair while applying: Keep the age, mixed discharge and stage information, and retain the keyed diagnostic-imaging service without executing a different procedure.",
          "fairness 6: Preserve the earlier positive repair while applying: Make the prior protocol consequential: silicone-sensitive noncontrast imaging addresses implant integrity rather than the discharge problem.",
          "fairness 7: Fairness response: The documented MRI is for implant integrity; no conventional symptomatic assessment has been provided. Mammography/targeted ultrasound is the supported initial pathway in this age group. Clinical boundary: Melissa/radiology must confirm the implant-protocol scenario and ranking. Ductography is a localization option, not declared useless. No contrast dose or interval is authored.",
          "fairness 8: Preserve the earlier positive repair while applying: Keep the age, mixed discharge and stage information, and retain the keyed diagnostic-imaging service without executing a different procedure.",
          "fairness 9: Preserve the earlier positive repair while applying: Make the prior protocol consequential: silicone-sensitive noncontrast imaging addresses implant integrity rather than the discharge problem.",
          "fairness 10: Preserve the earlier positive repair while applying: Replace two equivalent premature-MRI errors with contrast-MRI substitution and ductography substitution.",
          "fairness 11: Preserve the earlier positive repair while applying: Keep the age, mixed discharge and stage information, and retain the keyed diagnostic-imaging service without executing a different procedure."
        ],
        "suggestions": [
          "suggestions 1: Application revision: Read the outside protocol rather than treating the word MRI and an intact implant report as a completed cancer/discharge evaluation. Then Choose the still-needed diagnostic pathway rather than repeating an advanced modality or moving directly to duct localization. Closest error: Repeating MRI with contrast is a credible response to recognizing the outside protocol limitation, but skips the initial diagnostic mammographic assessment.",
          "suggestions 2: Action: Replace two equivalent premature-MRI errors with contrast-MRI substitution and ductography substitution."
        ]
      },
      "selfCheck": {
        "cueAttack": "All options investigate the breast with two modalities, share the ultrasound component and have comparable detail. The prior report gives sequences/contrast use, not an 'inconclusive' interpretation or a missing-test checklist.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Read the outside protocol rather than treating the word MRI and an intact implant report as a completed cancer/discharge evaluation.",
          "Choose the still-needed diagnostic pathway rather than repeating an advanced modality or moving directly to duct localization."
        ],
        "oneBestAnswer": "The documented MRI is for implant integrity; no conventional symptomatic assessment has been provided. Mammography/targeted ultrasound is the supported initial pathway in this age group.",
        "closestDistractor": "Repeating MRI with contrast is a credible response to recognizing the outside protocol limitation, but skips the initial diagnostic mammographic assessment.",
        "remainingReview": "Melissa/radiology must confirm the implant-protocol scenario and ranking. Ductography is a localization option, not declared useless. No contrast dose or interval is authored."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r7",
      "conceptId": "concept.pathologic-nipple-discharge.diagnostic-imaging",
      "stem": "Which imaging pathway should now be arranged for {patientName}'s nipple discharge?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Diagnostic mammography and targeted retroareolar ultrasound",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The outside implant-integrity study is not a contrast-enhanced discharge assessment; obtain the conventional diagnostic pathway at this age."
        },
        {
          "id": "choice.qq20261102b.a06-context.d1",
          "label": "Contrast-enhanced breast MRI and targeted retroareolar ultrasound",
          "isCorrect": false,
          "distractorRationale": "Correctly notices the implant study's protocol but advances problem-solving MRI ahead of the conventional diagnostic mammographic assessment."
        },
        {
          "id": "choice.qq20261102b.a06-context.d2",
          "label": "Contrast ductography and targeted retroareolar ultrasound",
          "isCorrect": false,
          "distractorRationale": "Investigates the ducts but substitutes an invasive localization procedure for the initial age-appropriate mammographic assessment."
        }
      ],
      "explanation": "Interpret what the previous MRI actually examined. Noncontrast implant-integrity sequences do not replace symptomatic breast imaging. At the supplied adult age, diagnostic mammography and targeted ultrasound precede contrast MRI or duct-localization procedures in this offered pathway.",
      "supportingEvidenceClaimIds": [
        "claim.discharge.imaging",
        "claim.qq20261102a.initial-breast-pathway",
        "claim.qq20261102a.mixed-discharge-local-assessment",
        "claim.qq20261102b.implant-mri-not-discharge-assessment"
      ],
      "teachingPoint": "Interpret what the previous MRI actually examined. Noncontrast implant-integrity sequences do not replace symptomatic breast imaging. At the supplied adult age, diagnostic mammography and targeted ultrasound precede contrast MRI or duct-localization procedures in this offered pathway."
    }
  },
  {
    "id": "revision.qq20261102b.a25",
    "auditId": "A25",
    "caseId": "case.gs028g.hiv-perioperative.paired-routine-elective",
    "nodeId": "node.gs028g.hiv-perioperative.paired-routine-elective.1",
    "previousQuestionVariantId": "question.gs028g.hiv-perioperative.art-continuity.v1.r6",
    "questionVariantId": "question.gs028g.hiv-perioperative.art-continuity.v1.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which combined medication plan should be agreed with {patientName}'s surgical team?",
    "previousChoiceLabels": [
      "Continue ART; plan titrated intravenous midazolam with respiratory monitoring",
      "Continue ART; plan oral midazolam with respiratory monitoring",
      "Interrupt ART; plan titrated intravenous midazolam with respiratory monitoring",
      "Interrupt ART; plan oral midazolam with respiratory monitoring"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Identify ritonavir within the named regimen and retain coordinated ART continuity. Then Distinguish the oral contraindication from monitored, individualized parenteral use.",
    "reviewerNotes": "Melissa/anesthesia must verify exact administration and dose adjustment; no dose, washout or independent ART interruption is prescribed.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qq20261102b.a25.d1": "choice.qq20261102a.a25.d1",
      "choice.qq20261102b.a25.d2": "choice.qq20261102a.a25.d2",
      "choice.qq20261102b.a25.d3": "choice.qq20261102a.a25.d3"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qq20261102b.a25.d1": null,
      "choice.qq20261102b.a25.d2": null,
      "choice.qq20261102b.a25.d3": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gs028g.hiv-perioperative.art-continuity.v1.r6",
      "whatChanged": "Remove the availability rationale, preserve the balanced factorial decision, and make individualized parenteral dosing explicit without an exact dose.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#A25",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Fairness response: Only continuation plus the monitored parenteral plan respects both the ART-continuity and route-specific interaction guidance. Clinical boundary: Melissa/anesthesia must verify exact administration and dose adjustment; no dose, washout or independent ART interruption is prescribed."
        ],
        "fairness": [
          "fairness 1: Application revision: Identify ritonavir within the named regimen and retain coordinated ART continuity. Then Distinguish the oral contraindication from monitored, individualized parenteral use. Closest error: Monitoring oral midazolam while continuing ART is credible if a resident remembers an interaction but misses its route-specific restriction.",
          "fairness 2: Revision/preservation: Preserve the balanced continuity/route set judged moderate by the reviewer. Delete the service-availability sentence entirely. Each continuity/route component appears twice, with identical titration/monitoring wording; the key has no implementation-hint sentence.",
          "fairness 3: Fairness response: Only continuation plus the monitored parenteral plan respects both the ART-continuity and route-specific interaction guidance. Clinical boundary: Melissa/anesthesia must verify exact administration and dose adjustment; no dose, washout or independent ART interruption is prescribed.",
          "fairness 4: Preserve the earlier positive repair while applying: Preserve the balanced continuity/route set judged moderate by the reviewer.",
          "fairness 5: Preserve the earlier positive repair while applying: Clarify individualized dosing and retain a clinician/anesthesia verification boundary rather than inventing a dose or interruption interval.",
          "fairness 6: Preserve the earlier positive repair while applying: Delete the complete service-availability sentence; procedural context is sufficient for all options.",
          "fairness 7: Preserve the earlier positive repair while applying: Preserve the balanced continuity/route set judged moderate by the reviewer.",
          "fairness 8: Preserve the earlier positive repair while applying: Clarify individualized dosing and retain a clinician/anesthesia verification boundary rather than inventing a dose or interruption interval."
        ],
        "suggestions": [
          "suggestions 1: Action: Delete the complete service-availability sentence; procedural context is sufficient for all options.",
          "suggestions 2: Fairness response: Only continuation plus the monitored parenteral plan respects both the ART-continuity and route-specific interaction guidance. Clinical boundary: Melissa/anesthesia must verify exact administration and dose adjustment; no dose, washout or independent ART interruption is prescribed."
        ]
      },
      "selfCheck": {
        "cueAttack": "Delete the service-availability sentence entirely. Each continuity/route component appears twice, with identical titration/monitoring wording; the key has no implementation-hint sentence.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Identify ritonavir within the named regimen and retain coordinated ART continuity.",
          "Distinguish the oral contraindication from monitored, individualized parenteral use."
        ],
        "oneBestAnswer": "Only continuation plus the monitored parenteral plan respects both the ART-continuity and route-specific interaction guidance.",
        "closestDistractor": "Monitoring oral midazolam while continuing ART is credible if a resident remembers an interaction but misses its route-specific restriction.",
        "remainingReview": "Melissa/anesthesia must verify exact administration and dose adjustment; no dose, washout or independent ART interruption is prescribed."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.hiv-perioperative.art-continuity.v1.r7",
      "conceptId": "concept.gs028g.hiv-perioperative.art-continuity",
      "stem": "Which combined medication plan should be agreed with {patientName}'s surgical team?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Continue ART; plan individually titrated intravenous midazolam with respiratory monitoring",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Preserves ART while coordinating parenteral midazolam, monitoring and individualized dose reduction when appropriate."
        },
        {
          "id": "choice.qq20261102b.a25.d1",
          "label": "Continue ART; plan individually titrated oral midazolam with respiratory monitoring",
          "isCorrect": false,
          "distractorRationale": "Treats monitoring/titration as sufficient to overcome the contraindicated oral boosted-PI combination."
        },
        {
          "id": "choice.qq20261102b.a25.d2",
          "label": "Interrupt ART; plan individually titrated intravenous midazolam with respiratory monitoring",
          "isCorrect": false,
          "distractorRationale": "Unnecessarily interrupts a complete regimen instead of coordinating the procedural medicine."
        },
        {
          "id": "choice.qq20261102b.a25.d3",
          "label": "Interrupt ART; plan individually titrated oral midazolam with respiratory monitoring",
          "isCorrect": false,
          "distractorRationale": "Adds ART interruption and assumes this permits an oral combination without an established interaction-management plan."
        }
      ],
      "explanation": "Coordinate the interacting procedural medicine while maintaining ART when feasible. Oral midazolam is contraindicated with boosted protease inhibitors. Parenteral use requires an appropriately monitored setting and individualized dosing, including consideration of dose reduction, particularly with repeated doses.",
      "teachingPoint": "Coordinate the interacting procedural medicine while maintaining ART when feasible. Oral midazolam is contraindicated with boosted protease inhibitors. Parenteral use requires an appropriately monitored setting and individualized dosing, including consideration of dose reduction, particularly with repeated doses.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.hiv-perioperative.art-continuity",
        "claim.gs028g.hiv-perioperative.art-continuity.fact2",
        "claim.gs028g.hiv-perioperative.art-continuity.fact3",
        "claim.gs028g.hiv-perioperative.art-continuity.fact4",
        "claim.qq20261102.named-art-regimen",
        "claim.qq20261102a.boosted-midazolam-routes",
        "claim.qq20261102a.boosted-parenteral-titration",
        "claim.qq20261102a.art-continuity",
        "claim.qq20261102b.route-specific-midazolam-plan"
      ]
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic before elective hernia repair. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine. Oral midazolam is proposed as premedication.",
    "previousPresentation": "{patientName}, a 43-year-old woman, visits the clinic before elective hernia repair. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine. Oral midazolam is proposed as premedication; the anesthesia service can administer and monitor intravenous sedation.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028g.hiv-perioperative.paired-routine-elective.female.43",
        "presentation": "{patientName}, a 43-year-old woman, visits the clinic before elective hernia repair. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine. Oral midazolam is proposed as premedication; the anesthesia service can administer and monitor intravenous sedation."
      },
      {
        "id": "profile.gs028g.hiv-perioperative.paired-routine-elective.male.43",
        "presentation": "{patientName}, a 43-year-old man, visits the clinic before elective hernia repair. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine. Oral midazolam is proposed as premedication; the anesthesia service can administer and monitor intravenous sedation."
      },
      {
        "id": "profile.gs028g.hiv-perioperative.paired-routine-elective.female.68",
        "presentation": "{patientName}, a 68-year-old woman, visits the clinic before elective hernia repair. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine. Oral midazolam is proposed as premedication; the anesthesia service can administer and monitor intravenous sedation."
      },
      {
        "id": "profile.gs028g.hiv-perioperative.paired-routine-elective.male.68",
        "presentation": "{patientName}, a 68-year-old man, visits the clinic before elective hernia repair. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine. Oral midazolam is proposed as premedication; the anesthesia service can administer and monitor intravenous sedation."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.gs028g.hiv-perioperative.paired-routine-elective",
        "patientPresentationVariantId": "presentation.gs028g.hiv-perioperative.paired-routine-elective",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic before elective hernia repair. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine. Oral midazolam is proposed as premedication; the anesthesia service can administer and monitor intravenous sedation.",
        "revisedFields": [
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102a.profile.gs028g.hiv-perioperative.paired-routine-elective.female.43",
            "approvedInstantiationProfileId": "profile.gs028g.hiv-perioperative.paired-routine-elective.female.43",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic before elective hernia repair. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine. Oral midazolam is proposed as premedication; the anesthesia service can administer and monitor intravenous sedation.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.gs028g.hiv-perioperative.paired-routine-elective.male.43",
            "approvedInstantiationProfileId": "profile.gs028g.hiv-perioperative.paired-routine-elective.male.43",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 43-year-old man, visits the clinic before elective hernia repair. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine. Oral midazolam is proposed as premedication; the anesthesia service can administer and monitor intravenous sedation.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.gs028g.hiv-perioperative.paired-routine-elective.female.68",
            "approvedInstantiationProfileId": "profile.gs028g.hiv-perioperative.paired-routine-elective.female.68",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 68-year-old woman, visits the clinic before elective hernia repair. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine. Oral midazolam is proposed as premedication; the anesthesia service can administer and monitor intravenous sedation.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.gs028g.hiv-perioperative.paired-routine-elective.male.68",
            "approvedInstantiationProfileId": "profile.gs028g.hiv-perioperative.paired-routine-elective.male.68",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 68-year-old man, visits the clinic before elective hernia repair. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine. Oral midazolam is proposed as premedication; the anesthesia service can administer and monitor intravenous sedation.",
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
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102b.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v6"
    }
  },
  {
    "id": "revision.qq20261102b.a25-context",
    "auditId": "A25-context",
    "caseId": "case.gs028g.hiv-perioperative.paired-routine-elective",
    "nodeId": "node.gs028g.hiv-perioperative.paired-routine-elective.2",
    "previousQuestionVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r6",
    "questionVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r7",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which instruction best fits {patientName}'s sedation plan?",
    "previousChoiceLabels": [
      "Consider smaller midazolam increments with monitored titration",
      "Consider standard midazolam increments with monitored titration",
      "Consider omitting ritonavir; use standard increments with monitored titration"
    ],
    "previousCurrentUpdate": "The anesthetist anticipates more than one intravenous midazolam dose during {patientName}'s procedure. The medication list is unchanged.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Distinguish preserved oxygenation and movement from adequate ventilation in a patient receiving midazolam with ritonavir. Then Pause further drug, assess/support ventilation and retain coordinated ART rather than redose or omit a component as a workaround.",
    "reviewerNotes": "Anesthesia must confirm this synthetic monitoring scenario and rescue scope. It contains no exact dose, saturation target, redosing interval or unsupported washout claim.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qq20261102b.a25-context.d1": "choice.qq20261102a.a25-context.d1",
      "choice.qq20261102b.a25-context.d2": "choice.qq20261102a.a25-context.d2",
      "choice.qq20261102b.a25-context.d3": "choice.qq20261102a.a25-context.d1"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qq20261102b.a25-context.d1": null,
      "choice.qq20261102b.a25-context.d2": null,
      "choice.qq20261102b.a25-context.d3": null
    },
    "currentUpdate": "During {patientName}'s procedure, intravenous midazolam has been given. The patient still moves when spoken to. Oxygen saturation remains in its preceding range on supplemental oxygen, while the capnography trace becomes infrequent and chest movements become shallower. The medication list is unchanged.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r6",
      "whatChanged": "Replace flexible smaller/standard increments with an actual discordant response and four equal-component care plans; the key depends on ventilation data rather than a generic caution phrase.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#A25-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Fairness response: The supplied respiratory observations do not support redosing. Uncoordinated ritonavir omission does not replace immediate ventilation/sedation management. Clinical boundary: Anesthesia must confirm this synthetic monitoring scenario and rescue scope. It contains no exact dose, saturation target, redosing interval or unsupported washout claim.",
          "cues 2: Fairness response: The supplied respiratory observations do not support redosing. Uncoordinated ritonavir omission does not replace immediate ventilation/sedation management. Clinical boundary: Anesthesia must confirm this synthetic monitoring scenario and rescue scope. It contains no exact dose, saturation target, redosing interval or unsupported washout claim."
        ],
        "fairness": [
          "fairness 1: Fairness response: The supplied respiratory observations do not support redosing. Uncoordinated ritonavir omission does not replace immediate ventilation/sedation management. Clinical boundary: Anesthesia must confirm this synthetic monitoring scenario and rescue scope. It contains no exact dose, saturation target, redosing interval or unsupported washout claim.",
          "fairness 2: Fairness response: The supplied respiratory observations do not support redosing. Uncoordinated ritonavir omission does not replace immediate ventilation/sedation management. Clinical boundary: Anesthesia must confirm this synthetic monitoring scenario and rescue scope. It contains no exact dose, saturation target, redosing interval or unsupported washout claim.",
          "fairness 3: Fairness response: The supplied respiratory observations do not support redosing. Uncoordinated ritonavir omission does not replace immediate ventilation/sedation management. Clinical boundary: Anesthesia must confirm this synthetic monitoring scenario and rescue scope. It contains no exact dose, saturation target, redosing interval or unsupported washout claim.",
          "fairness 4: Preserve the earlier positive repair while applying: Remove ambiguous standard-versus-smaller increments and give all options the same drug/monitoring/ART components.",
          "fairness 5: Preserve the earlier positive repair while applying: Retain ART coordination; include immediate ventilation care and avoid inventing doses or treating ritonavir omission as rapid reversal.",
          "fairness 6: Fairness response: The supplied respiratory observations do not support redosing. Uncoordinated ritonavir omission does not replace immediate ventilation/sedation management. Clinical boundary: Anesthesia must confirm this synthetic monitoring scenario and rescue scope. It contains no exact dose, saturation target, redosing interval or unsupported washout claim.",
          "fairness 7: Fairness response: The supplied respiratory observations do not support redosing. Uncoordinated ritonavir omission does not replace immediate ventilation/sedation management. Clinical boundary: Anesthesia must confirm this synthetic monitoring scenario and rescue scope. It contains no exact dose, saturation target, redosing interval or unsupported washout claim.",
          "fairness 8: Fairness response: The supplied respiratory observations do not support redosing. Uncoordinated ritonavir omission does not replace immediate ventilation/sedation management. Clinical boundary: Anesthesia must confirm this synthetic monitoring scenario and rescue scope. It contains no exact dose, saturation target, redosing interval or unsupported washout claim.",
          "fairness 9: Fairness response: The supplied respiratory observations do not support redosing. Uncoordinated ritonavir omission does not replace immediate ventilation/sedation management. Clinical boundary: Anesthesia must confirm this synthetic monitoring scenario and rescue scope. It contains no exact dose, saturation target, redosing interval or unsupported washout claim.",
          "fairness 10: Revision/preservation: Replace the repeated-dose forecast with actual oxygenation/capnography/chest observations. No instruction says 'standard increments'. All four plans name the same drug, ventilation care and ART component, so a longer second-drug outlier cannot identify the key.",
          "fairness 11: Preserve the earlier positive repair while applying: Retain ART coordination; include immediate ventilation care and avoid inventing doses or treating ritonavir omission as rapid reversal."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: The supplied respiratory observations do not support redosing. Uncoordinated ritonavir omission does not replace immediate ventilation/sedation management. Clinical boundary: Anesthesia must confirm this synthetic monitoring scenario and rescue scope. It contains no exact dose, saturation target, redosing interval or unsupported washout claim.",
          "suggestions 2: Fairness response: The supplied respiratory observations do not support redosing. Uncoordinated ritonavir omission does not replace immediate ventilation/sedation management. Clinical boundary: Anesthesia must confirm this synthetic monitoring scenario and rescue scope. It contains no exact dose, saturation target, redosing interval or unsupported washout claim."
        ]
      },
      "selfCheck": {
        "cueAttack": "No instruction says 'standard increments'. All four plans name the same drug, ventilation care and ART component, so a longer second-drug outlier cannot identify the key.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Distinguish preserved oxygenation and movement from adequate ventilation in a patient receiving midazolam with ritonavir.",
          "Pause further drug, assess/support ventilation and retain coordinated ART rather than redose or omit a component as a workaround."
        ],
        "oneBestAnswer": "The supplied respiratory observations do not support redosing. Uncoordinated ritonavir omission does not replace immediate ventilation/sedation management.",
        "closestDistractor": "Maintained oxygen saturation and movement can falsely reassure a resident who redoses before interpreting ventilation; the cautious but incorrect alternative omits ritonavir.",
        "remainingReview": "Anesthesia must confirm this synthetic monitoring scenario and rescue scope. It contains no exact dose, saturation target, redosing interval or unsupported washout claim."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r7",
      "conceptId": "concept.gs028g.hiv-perioperative.booster-midazolam-interaction",
      "stem": "Which instruction should guide {patientName}'s ongoing procedural care?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Pause midazolam; assess and support ventilation; continue ART",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Interprets the respiratory observations despite apparent wakefulness/maintained oxygen saturation, while avoiding an uncoordinated ART interruption."
        },
        {
          "id": "choice.qq20261102b.a25-context.d1",
          "label": "Repeat midazolam; assess and support ventilation; continue ART",
          "isCorrect": false,
          "distractorRationale": "Misreads movement and oxygen saturation as permission for another dose despite the ventilation observations."
        },
        {
          "id": "choice.qq20261102b.a25-context.d2",
          "label": "Pause midazolam; assess and support ventilation; omit ritonavir",
          "isCorrect": false,
          "distractorRationale": "Responds to ventilation but treats interruption of one ART component as the immediate interaction-management solution."
        },
        {
          "id": "choice.qq20261102b.a25-context.d3",
          "label": "Repeat midazolam; assess and support ventilation; omit ritonavir",
          "isCorrect": false,
          "distractorRationale": "Combines the inappropriate redosing response with an uncoordinated single-component ART interruption."
        }
      ],
      "explanation": "The capnography and chest-movement changes require assessment/support of ventilation and a pause in further sedation, even when oxygen saturation has not fallen. A boosted regimen can increase midazolam exposure. Manage the procedural medicine with the anesthesia/HIV teams; do not treat omission of ritonavir as an immediate substitute for that care. Reversal and further anesthetic support may be needed according to the clinical response.",
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
        "claim.qq20261102b.sedation-ventilation-response"
      ],
      "teachingPoint": "The capnography and chest-movement changes require assessment/support of ventilation and a pause in further sedation, even when oxygen saturation has not fallen. A boosted regimen can increase midazolam exposure. Manage the procedural medicine with the anesthesia/HIV teams; do not treat omission of ritonavir as an immediate substitute for that care. Reversal and further anesthetic support may be needed according to the clinical response."
    }
  },
  {
    "id": "revision.qq20261102b.b01",
    "auditId": "B01",
    "caseId": "case.achalasia.water-and-solids",
    "nodeId": "node.achalasia.water-and-solids.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v1.r3",
    "questionVariantId": "question.achalasia.manometric-recognition.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which motility diagnosis best accounts for {patientName}'s combined study findings?",
    "previousChoiceLabels": [
      "Achalasia",
      "Esophagogastric junction outflow obstruction",
      "Distal esophageal spasm"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Constructed esophageal pressure-study observations; reference ranges are laboratory-specific.",
      "items": [
        {
          "label": "Junction measurement",
          "value": "Median relaxation pressure above the laboratory reference range"
        },
        {
          "label": "Body tracing",
          "value": "Pressure rises along the whole body simultaneously; no contractile peak travels distally"
        },
        {
          "label": "Distribution",
          "value": "The same body pattern occurs throughout the test swallows"
        }
      ]
    },
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "This narrowly scoped item teaches recognition of the classic pressure pattern; diagnosis-label translation is not presented as difficult two-step application.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_1": "achalasia_1",
      "choice.qq20261102b.b01.d1": "choice.qq20261102a.b01.d1",
      "choice.qq20261102b.b01.d2": "choice.qq20261102a.b01.d2"
    },
    "choiceServiceOverrides": {
      "achalasia_1": null,
      "choice.qq20261102b.b01.d1": null,
      "choice.qq20261102b.b01.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.manometric-recognition.v1.r3",
      "whatChanged": "Label basicRecallIntentional: This narrowly scoped item teaches recognition of the classic pressure pattern; diagnosis-label translation is not presented as difficult two-step application.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B01",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: This narrowly scoped item teaches recognition of the classic pressure pattern; diagnosis-label translation is not presented as difficult two-step application.",
          "fairness 2: Fairness response: The raw pattern meets the achalasia classification rather than the distinct relaxation/peristalsis conditions of the offered neighbors. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 3: Revision/preservation: Do not claim that an endoscopy without an intraluminal mass excludes every secondary cause. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 4: Preserve the earlier positive repair while applying: Retain raw tracing observations, the prior structural assessment and natural diagnostic names without artificial length padding.",
          "fairness 5: Explicit basicRecallIntentional: This narrowly scoped item teaches recognition of the classic pressure pattern; diagnosis-label translation is not presented as difficult two-step application.",
          "fairness 6: Preserve the earlier positive repair while applying: Declare the classic pattern-recognition objective intentionally basic; no subsequent treatment objective is silently added.",
          "fairness 7: Revision/preservation: Declare the classic pattern-recognition objective intentionally basic; no subsequent treatment objective is silently added. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 8: Revision/preservation: Retain raw tracing observations, the prior structural assessment and natural diagnostic names without artificial length padding. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 9: Explicit basicRecallIntentional: This narrowly scoped item teaches recognition of the classic pressure pattern; diagnosis-label translation is not presented as difficult two-step application."
        ],
        "suggestions": [
          "suggestions 1: Action: Declare the classic pattern-recognition objective intentionally basic; no subsequent treatment objective is silently added.",
          "suggestions 2: Action: Retain raw tracing observations, the prior structural assessment and natural diagnostic names without artificial length padding."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "The raw pattern meets the achalasia classification rather than the distinct relaxation/peristalsis conditions of the offered neighbors.",
        "closestDistractor": "Misclassifying a pressure event as preserved peristalsis, or applying the wrong position-specific criterion, drives the closest competing answer.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.manometric-recognition.v1.r4",
      "conceptId": "concept.achalasia.manometric-recognition",
      "stem": "Which motility diagnosis fits {patientName}'s pressure tracing?",
      "answerChoices": [
        {
          "id": "achalasia_1",
          "label": "Achalasia",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the body-pressure/contraction distinction with the appropriate junction-relaxation criterion; an apparent pressure event is not automatically normal peristalsis."
        },
        {
          "id": "choice.qq20261102b.b01.d1",
          "label": "Esophagogastric junction outflow obstruction",
          "isCorrect": false,
          "distractorRationale": "Represents a competing motility classification; check whether its relaxation and true-peristalsis requirements fit all of the reported observations."
        },
        {
          "id": "choice.qq20261102b.b01.d2",
          "label": "Distal esophageal spasm",
          "isCorrect": false,
          "distractorRationale": "Represents a competing motility classification; check whether its relaxation and true-peristalsis requirements fit all of the reported observations."
        }
      ],
      "explanation": "Simultaneous pressurization does not establish a propagated contraction. Integrating absent true peristalsis with impaired junction relaxation supports achalasia rather than preserved-peristalsis outflow obstruction or spasm.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.manometric-recognition",
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102.motility-absent-contractility",
        "claim.qq20261102a.pressure-not-peristalsis"
      ],
      "teachingPoint": "Simultaneous pressurization does not establish a propagated contraction. Integrating absent true peristalsis with impaired junction relaxation supports achalasia rather than preserved-peristalsis outflow obstruction or spasm.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed esophageal pressure-study observations; reference ranges are laboratory-specific.",
        "items": [
          {
            "label": "Junction measurement",
            "value": "Median relaxation pressure above the laboratory reference range"
          },
          {
            "label": "Body tracing",
            "value": "Pressure rises along the whole body simultaneously; no contractile peak travels distally"
          },
          {
            "label": "Distribution",
            "value": "The same body pattern occurs throughout the test swallows"
          }
        ]
      }
    }
  },
  {
    "id": "revision.qq20261102b.b01-context",
    "auditId": "B01-context",
    "caseId": "case.achalasia.water-and-solids",
    "nodeId": "node.achalasia.water-and-solids.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v1.r3",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
    "previousChoiceLabels": [
      "High-resolution manometry with positional pressure assessment",
      "Functional lumen imaging with endoscopic distension assessment",
      "Ambulatory pH-impedance monitoring with symptom association assessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_1": "manometry_1",
      "choice.qq20261102b.b01-context.d1": "choice.qq20261102a.b01-context.d1",
      "choice.qq20261102b.b01-context.d2": "choice.qq20261102a.b01-context.d2"
    },
    "choiceServiceOverrides": {
      "manometry_1": "service.esophageal_manometry",
      "choice.qq20261102b.b01-context.d1": null,
      "choice.qq20261102b.b01-context.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.high-resolution-manometry.v1.r3",
      "whatChanged": "Label basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B01-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
          "fairness 2: Revision/preservation: Keep FLIP as a clinically real adjacent alternative and do not describe it as useless. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 3: Preserve the earlier positive repair while applying: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty.",
          "fairness 4: Preserve the earlier positive repair while applying: Keep FLIP as a clinically real adjacent alternative and do not describe it as useless.",
          "fairness 5: Preserve the earlier positive repair while applying: Use natural parallel test names and retain all existing runtime testing estimates and the manometry gate.",
          "fairness 6: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
          "fairness 7: Preserve the earlier positive repair while applying: Keep FLIP as a clinically real adjacent alternative and do not describe it as useless.",
          "fairness 8: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
          "fairness 9: Preserve the earlier positive repair while applying: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty.",
          "fairness 10: Revision/preservation: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Action: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty.",
          "suggestions 2: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification.",
        "closestDistractor": "Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v1.r4",
      "conceptId": "concept.achalasia.high-resolution-manometry",
      "stem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
      "answerChoices": [
        {
          "id": "manometry_1",
          "label": "High-resolution esophageal manometry",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides contraction and junction-relaxation classification at this stage."
        },
        {
          "id": "choice.qq20261102b.b01-context.d1",
          "label": "Endoscopic functional lumen imaging",
          "isCorrect": false,
          "distractorRationale": "Can be a useful adjunct or alternative in selected circumstances, but no unsuccessful or uninterpretable manometry is supplied."
        },
        {
          "id": "choice.qq20261102b.b01-context.d2",
          "label": "Ambulatory esophageal pH-impedance monitoring",
          "isCorrect": false,
          "distractorRationale": "Evaluates reflux/symptom association rather than the unresolved motor classification."
        }
      ],
      "explanation": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence"
      ],
      "teachingPoint": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies."
    }
  },
  {
    "id": "revision.qq20261102b.b02",
    "auditId": "B02",
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v2.r3",
    "questionVariantId": "question.achalasia.manometric-recognition.v2.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which motility diagnosis best accounts for {patientName}'s combined study findings?",
    "previousChoiceLabels": [
      "Achalasia",
      "Absent contractility",
      "Esophagogastric junction outflow obstruction"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Constructed esophageal pressure-study observations; reference ranges are laboratory-specific.",
      "items": [
        {
          "label": "Primary supine series",
          "value": "Median relaxation pressure above the laboratory reference range"
        },
        {
          "label": "Upright series",
          "value": "Median relaxation pressure within the laboratory reference range"
        },
        {
          "label": "Body tracing",
          "value": "No propagated distal contraction in either series"
        }
      ]
    },
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Classify the body activity as failed rather than premature contraction or preserved peristalsis. Then Apply the appropriate positional criterion before deciding whether corroboration is obligatory for classification or treatment assessment can proceed.",
    "reviewerNotes": "Melissa must verify technical adequacy and classification. Assessment is not a mandated myotomy; secondary-cause evaluation remains individualized.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_2": "achalasia_2",
      "choice.qq20261102b.b02.d1": "choice.qq20261102a.b02.d1",
      "choice.qq20261102b.b02.d2": "choice.qq20261102a.b02.d2"
    },
    "choiceServiceOverrides": {
      "achalasia_2": null,
      "choice.qq20261102b.b02.d1": null,
      "choice.qq20261102b.b02.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.manometric-recognition.v2.r3",
      "whatChanged": "Specify failed versus premature activity and the adequate primary protocol, then test the consequence of positional discordance for classification and planning.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B02",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Fairness response: The technically adequate ten-swallow primary series has abnormal relaxation and universal failed peristalsis. The EGJOO criterion requiring abnormal pressures in both positions is not the achalasia criterion. Clinical boundary: Melissa must verify technical adequacy and classification. Assessment is not a mandated myotomy; secondary-cause evaluation remains individualized.",
          "fairness 2: Fairness response: The technically adequate ten-swallow primary series has abnormal relaxation and universal failed peristalsis. The EGJOO criterion requiring abnormal pressures in both positions is not the achalasia criterion. Clinical boundary: Melissa must verify technical adequacy and classification. Assessment is not a mandated myotomy; secondary-cause evaluation remains individualized.",
          "fairness 3: Revision/preservation: Use classification-confidence and treatment-assessment pathways to test misapplication of EGJOO criteria, without claiming normal endoscopy excludes every secondary cause. No diagnosis is named in the findings. All options pair a classification with a consequential assessment pathway; the normal upright value remains a credible trap.",
          "fairness 4: Preserve the earlier positive repair while applying: Supply the ten-swallow primary protocol and preserve the normal upright result.",
          "fairness 5: Application revision: Classify the body activity as failed rather than premature contraction or preserved peristalsis. Then Apply the appropriate positional criterion before deciding whether corroboration is obligatory for classification or treatment assessment can proceed. Closest error: Applying the familiar newer both-position outflow-obstruction requirement to all elevated-IRP disorders is a plausible resident error.",
          "fairness 6: Preserve the earlier positive repair while applying: Specify all contractions as failed with DCI below the supported cutoff; no ambiguity about premature contractions remains.",
          "fairness 7: Revision/preservation: Specify all contractions as failed with DCI below the supported cutoff; no ambiguity about premature contractions remains. No diagnosis is named in the findings. All options pair a classification with a consequential assessment pathway; the normal upright value remains a credible trap.",
          "fairness 8: Revision/preservation: Supply the ten-swallow primary protocol and preserve the normal upright result. No diagnosis is named in the findings. All options pair a classification with a consequential assessment pathway; the normal upright value remains a credible trap.",
          "fairness 9: Application revision: Classify the body activity as failed rather than premature contraction or preserved peristalsis. Then Apply the appropriate positional criterion before deciding whether corroboration is obligatory for classification or treatment assessment can proceed. Closest error: Applying the familiar newer both-position outflow-obstruction requirement to all elevated-IRP disorders is a plausible resident error."
        ],
        "suggestions": [
          "suggestions 1: Action: Specify all contractions as failed with DCI below the supported cutoff; no ambiguity about premature contractions remains.",
          "suggestions 2: Action: Supply the ten-swallow primary protocol and preserve the normal upright result."
        ]
      },
      "selfCheck": {
        "cueAttack": "No diagnosis is named in the findings. All options pair a classification with a consequential assessment pathway; the normal upright value remains a credible trap.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Classify the body activity as failed rather than premature contraction or preserved peristalsis.",
          "Apply the appropriate positional criterion before deciding whether corroboration is obligatory for classification or treatment assessment can proceed."
        ],
        "oneBestAnswer": "The technically adequate ten-swallow primary series has abnormal relaxation and universal failed peristalsis. The EGJOO criterion requiring abnormal pressures in both positions is not the achalasia criterion.",
        "closestDistractor": "Applying the familiar newer both-position outflow-obstruction requirement to all elevated-IRP disorders is a plausible resident error.",
        "remainingReview": "Melissa must verify technical adequacy and classification. Assessment is not a mandated myotomy; secondary-cause evaluation remains individualized."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.manometric-recognition.v2.r4",
      "conceptId": "concept.achalasia.manometric-recognition",
      "stem": "Which interpretation and planning decision should follow {patientName}'s study?",
      "answerChoices": [
        {
          "id": "achalasia_2",
          "label": "Conclusive achalasia pattern; arrange junction-directed treatment assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Complete failed peristalsis with abnormal primary-position relaxation pressure meets the classification despite a normal secondary-position pressure."
        },
        {
          "id": "choice.qq20261102b.b02.d1",
          "label": "Inconclusive outflow-obstruction pattern; obtain corroboration before treatment assessment",
          "isCorrect": false,
          "distractorRationale": "Overapplies the both-position EGJOO requirement to a patient with no preserved peristalsis."
        },
        {
          "id": "choice.qq20261102b.b02.d2",
          "label": "Absent-contractility pattern; arrange reflux-directed management assessment",
          "isCorrect": false,
          "distractorRationale": "Treats the normal upright measurement as overriding the abnormal adequate primary-position study."
        }
      ],
      "explanation": "All primary-position swallows fail and junction relaxation pressure is abnormal in that adequate series. A normal upright pressure does not impose the both-position EGJOO rule on this achalasia pattern. Arrange specialist treatment assessment rather than classifying the study as absent contractility or automatically inconclusive EGJOO.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.manometric-recognition",
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102.motility-absent-contractility",
        "claim.qq20261102a.primary-position-achalasia",
        "claim.qq20261102b.primary-position-classification",
        "claim.qq20261102a.failed-contraction-threshold"
      ],
      "teachingPoint": "All primary-position swallows fail and junction relaxation pressure is abnormal in that adequate series. A normal upright pressure does not impose the both-position EGJOO rule on this achalasia pattern. Arrange specialist treatment assessment rather than classifying the study as absent contractility or automatically inconclusive EGJOO.",
      "exhibit": {
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
      }
    }
  },
  {
    "id": "revision.qq20261102b.b02-context",
    "auditId": "B02-context",
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v2.r3",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
    "previousChoiceLabels": [
      "High-resolution manometry with positional pressure assessment",
      "Functional lumen imaging with endoscopic distension assessment",
      "Ambulatory pH-impedance monitoring with symptom association assessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_2": "manometry_2",
      "choice.qq20261102b.b02-context.d1": "choice.qq20261102a.b02-context.d1",
      "choice.qq20261102b.b02-context.d2": "choice.qq20261102a.b02-context.d2"
    },
    "choiceServiceOverrides": {
      "manometry_2": "service.esophageal_manometry",
      "choice.qq20261102b.b02-context.d1": null,
      "choice.qq20261102b.b02-context.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.high-resolution-manometry.v2.r3",
      "whatChanged": "Label basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B02-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
          "fairness 2: Revision/preservation: Keep FLIP as a clinically real adjacent alternative and do not describe it as useless. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 3: Preserve the earlier positive repair while applying: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty.",
          "fairness 4: Preserve the earlier positive repair while applying: Keep FLIP as a clinically real adjacent alternative and do not describe it as useless.",
          "fairness 5: Preserve the earlier positive repair while applying: Use natural parallel test names and retain all existing runtime testing estimates and the manometry gate.",
          "fairness 6: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
          "fairness 7: Preserve the earlier positive repair while applying: Keep FLIP as a clinically real adjacent alternative and do not describe it as useless.",
          "fairness 8: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
          "fairness 9: Preserve the earlier positive repair while applying: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty.",
          "fairness 10: Revision/preservation: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Action: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty.",
          "suggestions 2: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification.",
        "closestDistractor": "Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v2.r4",
      "conceptId": "concept.achalasia.high-resolution-manometry",
      "stem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
      "answerChoices": [
        {
          "id": "manometry_2",
          "label": "High-resolution esophageal manometry",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides contraction and junction-relaxation classification at this stage."
        },
        {
          "id": "choice.qq20261102b.b02-context.d1",
          "label": "Endoscopic functional lumen imaging",
          "isCorrect": false,
          "distractorRationale": "Can be a useful adjunct or alternative in selected circumstances, but no unsuccessful or uninterpretable manometry is supplied."
        },
        {
          "id": "choice.qq20261102b.b02-context.d2",
          "label": "Ambulatory esophageal pH-impedance monitoring",
          "isCorrect": false,
          "distractorRationale": "Evaluates reflux/symptom association rather than the unresolved motor classification."
        }
      ],
      "explanation": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence"
      ],
      "teachingPoint": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies."
    }
  },
  {
    "id": "revision.qq20261102b.b03",
    "auditId": "B03",
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v3.r3",
    "questionVariantId": "question.achalasia.manometric-recognition.v3.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which motility diagnosis best accounts for {patientName}'s combined study findings?",
    "previousChoiceLabels": [
      "Achalasia",
      "Distal esophageal spasm",
      "Hypercontractile esophagus"
    ],
    "previousCurrentUpdate": null,
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
    "intendedInference": "Integrate impaired relaxation and premature/failed swallows rather than calling the pattern distal spasm. Then Notice the oxycodone exposure and reassess a potentially medication-associated pattern before irreversible treatment planning.",
    "reviewerNotes": "Melissa/motility review must confirm feasibility of withdrawal and persistent symptom assessment. A chronic opioid should not be abruptly stopped by a game answer; no washout interval is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_3": "achalasia_3",
      "choice.qq20261102b.b03.d1": "choice.qq20261102a.b03.d1",
      "choice.qq20261102b.b03.d2": "choice.qq20261102a.b03.d2",
      "choice.qq20261102b.b03.d3": "choice.qq20261102a.b03.d1"
    },
    "choiceServiceOverrides": {
      "achalasia_3": null,
      "choice.qq20261102b.b03.d1": null,
      "choice.qq20261102b.b03.d2": null,
      "choice.qq20261102b.b03.d3": null
    },
    "currentUpdate": "Medication reconciliation shows that {patientName} takes oxycodone regularly for back pain and took it before the pressure study. No prior attempt to assess swallowing while off that medication is documented.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.manometric-recognition.v3.r3",
      "whatChanged": "Add a concrete medication exposure as a new current observation and make classification plus reversible-cause sequencing consequential.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B03",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Application revision: Integrate impaired relaxation and premature/failed swallows rather than calling the pattern distal spasm. Then Notice the oxycodone exposure and reassess a potentially medication-associated pattern before irreversible treatment planning. Closest error: Correctly classifying type-III-like physiology yet proceeding directly to myotomy is the intended near miss.",
          "fairness 2: Fairness response: Only the key preserves both the achalasia-like classification and coordinated medication reassessment supported for opioid-associated spastic patterns. Clinical boundary: Melissa/motility review must confirm feasibility of withdrawal and persistent symptom assessment. A chronic opioid should not be abruptly stopped by a game answer; no washout interval is invented.",
          "fairness 3: Revision/preservation: Require coordinated reassessment rather than a fixed washout or a claim that every opioid-exposed pattern resolves. The task contains no drug-interaction principle. Two options recognize the same pattern, and two address the opioid, so neither isolated fact identifies the complete key.",
          "fairness 4: Preserve the earlier positive repair while applying: Add recorded oxycodone exposure and compare paired classification/sequence plans, including a correctly named but prematurely treated pattern.",
          "fairness 5: Application revision: Integrate impaired relaxation and premature/failed swallows rather than calling the pattern distal spasm. Then Notice the oxycodone exposure and reassess a potentially medication-associated pattern before irreversible treatment planning. Closest error: Correctly classifying type-III-like physiology yet proceeding directly to myotomy is the intended near miss.",
          "fairness 6: Preserve the earlier positive repair while applying: Keep the spastic/impaired-relaxation observations and prior endoscopy.",
          "fairness 7: Revision/preservation: Keep the spastic/impaired-relaxation observations and prior endoscopy. The task contains no drug-interaction principle. Two options recognize the same pattern, and two address the opioid, so neither isolated fact identifies the complete key.",
          "fairness 8: Fairness response: Only the key preserves both the achalasia-like classification and coordinated medication reassessment supported for opioid-associated spastic patterns. Clinical boundary: Melissa/motility review must confirm feasibility of withdrawal and persistent symptom assessment. A chronic opioid should not be abruptly stopped by a game answer; no washout interval is invented.",
          "fairness 9: Application revision: Integrate impaired relaxation and premature/failed swallows rather than calling the pattern distal spasm. Then Notice the oxycodone exposure and reassess a potentially medication-associated pattern before irreversible treatment planning. Closest error: Correctly classifying type-III-like physiology yet proceeding directly to myotomy is the intended near miss."
        ],
        "suggestions": [
          "suggestions 1: Action: Keep the spastic/impaired-relaxation observations and prior endoscopy.",
          "suggestions 2: Action: Add recorded oxycodone exposure and compare paired classification/sequence plans, including a correctly named but prematurely treated pattern."
        ]
      },
      "selfCheck": {
        "cueAttack": "The task contains no drug-interaction principle. Two options recognize the same pattern, and two address the opioid, so neither isolated fact identifies the complete key.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Integrate impaired relaxation and premature/failed swallows rather than calling the pattern distal spasm.",
          "Notice the oxycodone exposure and reassess a potentially medication-associated pattern before irreversible treatment planning."
        ],
        "oneBestAnswer": "Only the key preserves both the achalasia-like classification and coordinated medication reassessment supported for opioid-associated spastic patterns.",
        "closestDistractor": "Correctly classifying type-III-like physiology yet proceeding directly to myotomy is the intended near miss.",
        "remainingReview": "Melissa/motility review must confirm feasibility of withdrawal and persistent symptom assessment. A chronic opioid should not be abruptly stopped by a game answer; no washout interval is invented."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.manometric-recognition.v3.r4",
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
          "id": "choice.qq20261102b.b03.d1",
          "label": "Achalasia-like spastic pattern; proceed to myotomy planning while continuing the opioid",
          "isCorrect": false,
          "distractorRationale": "Recognizes the tracing but treats it as sufficient proof of a primary irreversible disorder despite a relevant drug exposure."
        },
        {
          "id": "choice.qq20261102b.b03.d2",
          "label": "Distal-spasm pattern; coordinate opioid withdrawal and reassessment before myotomy planning",
          "isCorrect": false,
          "distractorRationale": "Notices the medication issue but ignores the abnormal junction relaxation when classifying the tracing."
        },
        {
          "id": "choice.qq20261102b.b03.d3",
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
    }
  },
  {
    "id": "revision.qq20261102b.b03-context",
    "auditId": "B03-context",
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v3.r3",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
    "previousChoiceLabels": [
      "High-resolution manometry with positional pressure assessment",
      "Functional lumen imaging with endoscopic distension assessment",
      "Ambulatory pH-impedance monitoring with symptom association assessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_3": "manometry_3",
      "choice.qq20261102b.b03-context.d1": "choice.qq20261102a.b03-context.d1",
      "choice.qq20261102b.b03-context.d2": "choice.qq20261102a.b03-context.d2"
    },
    "choiceServiceOverrides": {
      "manometry_3": "service.esophageal_manometry",
      "choice.qq20261102b.b03-context.d1": null,
      "choice.qq20261102b.b03-context.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.high-resolution-manometry.v3.r3",
      "whatChanged": "Label basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B03-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
          "fairness 2: Revision/preservation: Keep FLIP as a clinically real adjacent alternative and do not describe it as useless. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 3: Preserve the earlier positive repair while applying: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty.",
          "fairness 4: Preserve the earlier positive repair while applying: Keep FLIP as a clinically real adjacent alternative and do not describe it as useless.",
          "fairness 5: Preserve the earlier positive repair while applying: Use natural parallel test names and retain all existing runtime testing estimates and the manometry gate.",
          "fairness 6: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
          "fairness 7: Preserve the earlier positive repair while applying: Keep FLIP as a clinically real adjacent alternative and do not describe it as useless.",
          "fairness 8: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
          "fairness 9: Preserve the earlier positive repair while applying: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty.",
          "fairness 10: Revision/preservation: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Action: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty.",
          "suggestions 2: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification.",
        "closestDistractor": "Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v3.r4",
      "conceptId": "concept.achalasia.high-resolution-manometry",
      "stem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
      "answerChoices": [
        {
          "id": "manometry_3",
          "label": "High-resolution esophageal manometry",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides contraction and junction-relaxation classification at this stage."
        },
        {
          "id": "choice.qq20261102b.b03-context.d1",
          "label": "Endoscopic functional lumen imaging",
          "isCorrect": false,
          "distractorRationale": "Can be a useful adjunct or alternative in selected circumstances, but no unsuccessful or uninterpretable manometry is supplied."
        },
        {
          "id": "choice.qq20261102b.b03-context.d2",
          "label": "Ambulatory esophageal pH-impedance monitoring",
          "isCorrect": false,
          "distractorRationale": "Evaluates reflux/symptom association rather than the unresolved motor classification."
        }
      ],
      "explanation": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence"
      ],
      "teachingPoint": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies."
    }
  },
  {
    "id": "revision.qq20261102b.b04",
    "auditId": "B04",
    "caseId": "case.achalasia.clinic-referral",
    "nodeId": "node.achalasia.clinic-referral.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v4.r3",
    "questionVariantId": "question.achalasia.manometric-recognition.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which motility diagnosis best accounts for {patientName}'s combined study findings?",
    "previousChoiceLabels": [
      "Achalasia",
      "Absent contractility",
      "Ineffective esophageal motility"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Constructed esophageal pressure-study observations; reference ranges are laboratory-specific.",
      "items": [
        {
          "label": "Junction measurement",
          "value": "Median relaxation pressure above the laboratory reference range"
        },
        {
          "label": "Distal contractile integral",
          "value": "Readouts of 30–80 mmHg·s·cm across the test swallows"
        },
        {
          "label": "Trace appearance",
          "value": "Small pressure deflections, without a moving distal contraction peak"
        }
      ]
    },
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Use the contractile measurements to recognize failure rather than ineffective preserved contractions. Then Combine the physiology with the later-obtained weight and endoscopic observations before accepting a primary motility diagnosis for treatment.",
    "reviewerNotes": "Melissa must verify the alarm-based assessment and individual sequence. No weight-loss cutoff, duration or invented probability is used; the retained 30-80 measurements are synthetic failed-contraction examples under the supported cutoff.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_4": "achalasia_4",
      "choice.qq20261102b.b04.d1": "choice.qq20261102a.b04.d1",
      "choice.qq20261102b.b04.d2": "choice.qq20261102a.b04.d2",
      "choice.qq20261102b.b04.d3": "choice.qq20261102a.b04.d1"
    },
    "choiceServiceOverrides": {
      "achalasia_4": null,
      "choice.qq20261102b.b04.d1": null,
      "choice.qq20261102b.b04.d2": null,
      "choice.qq20261102b.b04.d3": null
    },
    "currentUpdate": "The endoscopy report also records marked resistance as the instrument crossed the distal junction. {patientName}'s clothes have become loose during the recent progression of symptoms; prior weights document a substantial decline.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.manometric-recognition.v4.r3",
      "whatChanged": "Make the low contractile measurements consequential within a paired classification/secondary-cause decision, adding concrete weight and scope observations rather than another confirming label.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B04",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Application revision: Use the contractile measurements to recognize failure rather than ineffective preserved contractions. Then Combine the physiology with the later-obtained weight and endoscopic observations before accepting a primary motility diagnosis for treatment. Closest error: A resident can correctly name achalasia yet prematurely close the workup after an endoscopy reporting no intraluminal mass.",
          "fairness 2: Fairness response: The pattern and alarm observations must both be addressed. Further assessment, not automatic treatment of presumed primary achalasia, is supported for this represented older patient. Clinical boundary: Melissa must verify the alarm-based assessment and individual sequence. No weight-loss cutoff, duration or invented probability is used; the retained 30-80 measurements are synthetic failed-contraction examples under the supported cutoff.",
          "fairness 3: Revision/preservation: Retain the mucosal examination while explicitly declining to treat it as proof against every secondary cause; no arbitrary risk threshold is added. Two options accept the achalasia pattern and two investigate a secondary lesion. No rationale label or safety slogan is in the task; the normal mucosal view is deliberately not treated as complete exclusion.",
          "fairness 4: Preserve the earlier positive repair while applying: Add actual documented weight decline and marked passage resistance in the older profile, with paired next plans.",
          "fairness 5: Application revision: Use the contractile measurements to recognize failure rather than ineffective preserved contractions. Then Combine the physiology with the later-obtained weight and endoscopic observations before accepting a primary motility diagnosis for treatment. Closest error: A resident can correctly name achalasia yet prematurely close the workup after an endoscopy reporting no intraluminal mass.",
          "fairness 6: Preserve the earlier positive repair while applying: Use the DCI readouts in a failed-versus-retained-contraction trap rather than decorative numerics.",
          "fairness 7: Revision/preservation: Use the DCI readouts in a failed-versus-retained-contraction trap rather than decorative numerics. Two options accept the achalasia pattern and two investigate a secondary lesion. No rationale label or safety slogan is in the task; the normal mucosal view is deliberately not treated as complete exclusion.",
          "fairness 8: Revision/preservation: Add actual documented weight decline and marked passage resistance in the older profile, with paired next plans. Two options accept the achalasia pattern and two investigate a secondary lesion. No rationale label or safety slogan is in the task; the normal mucosal view is deliberately not treated as complete exclusion.",
          "fairness 9: Application revision: Use the contractile measurements to recognize failure rather than ineffective preserved contractions. Then Combine the physiology with the later-obtained weight and endoscopic observations before accepting a primary motility diagnosis for treatment. Closest error: A resident can correctly name achalasia yet prematurely close the workup after an endoscopy reporting no intraluminal mass."
        ],
        "suggestions": [
          "suggestions 1: Action: Use the DCI readouts in a failed-versus-retained-contraction trap rather than decorative numerics.",
          "suggestions 2: Action: Add actual documented weight decline and marked passage resistance in the older profile, with paired next plans."
        ]
      },
      "selfCheck": {
        "cueAttack": "Two options accept the achalasia pattern and two investigate a secondary lesion. No rationale label or safety slogan is in the task; the normal mucosal view is deliberately not treated as complete exclusion.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Use the contractile measurements to recognize failure rather than ineffective preserved contractions.",
          "Combine the physiology with the later-obtained weight and endoscopic observations before accepting a primary motility diagnosis for treatment."
        ],
        "oneBestAnswer": "The pattern and alarm observations must both be addressed. Further assessment, not automatic treatment of presumed primary achalasia, is supported for this represented older patient.",
        "closestDistractor": "A resident can correctly name achalasia yet prematurely close the workup after an endoscopy reporting no intraluminal mass.",
        "remainingReview": "Melissa must verify the alarm-based assessment and individual sequence. No weight-loss cutoff, duration or invented probability is used; the retained 30-80 measurements are synthetic failed-contraction examples under the supported cutoff."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.manometric-recognition.v4.r4",
      "conceptId": "concept.achalasia.manometric-recognition",
      "stem": "Which interpretation and next plan should guide {patientName}'s care?",
      "answerChoices": [
        {
          "id": "achalasia_4",
          "label": "Achalasia-pattern physiology; investigate a secondary junction lesion before treatment planning",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Recognizes failed contractions and impaired relaxation while responding to the older patient's progressive weight loss and endoscopic resistance."
        },
        {
          "id": "choice.qq20261102b.b04.d1",
          "label": "Achalasia-pattern physiology; proceed to treatment planning after the mucosal endoscopy",
          "isCorrect": false,
          "distractorRationale": "Correctly reads the pressure pattern but overstates what a mucosal examination without an intraluminal mass excludes."
        },
        {
          "id": "choice.qq20261102b.b04.d2",
          "label": "Ineffective-motility physiology; investigate a secondary junction lesion before treatment planning",
          "isCorrect": false,
          "distractorRationale": "Notices the alarm observations but counts subthreshold pressure deflections as retained effective contractions despite impaired relaxation."
        },
        {
          "id": "choice.qq20261102b.b04.d3",
          "label": "Ineffective-motility physiology; proceed to treatment planning after the mucosal endoscopy",
          "isCorrect": false,
          "distractorRationale": "Combines a mistaken interpretation of the contractile measurements with premature closure of the secondary-cause assessment."
        }
      ],
      "explanation": "The very low contractile measurements represent failed contractions, not preserved effective peristalsis. Impaired junction relaxation yields an achalasia pattern, but substantial recent weight loss and marked scope resistance in this older patient warrant targeted secondary-cause assessment before treatment planning. A normal-looking mucosa does not exclude a mural or extrinsic lesion.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.manometric-recognition",
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102.motility-absent-contractility",
        "claim.qq20261102a.failed-contraction-threshold",
        "claim.qq20261102b.secondary-achalasia-assessment"
      ],
      "teachingPoint": "The very low contractile measurements represent failed contractions, not preserved effective peristalsis. Impaired junction relaxation yields an achalasia pattern, but substantial recent weight loss and marked scope resistance in this older patient warrant targeted secondary-cause assessment before treatment planning. A normal-looking mucosa does not exclude a mural or extrinsic lesion.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed esophageal pressure-study observations; reference ranges are laboratory-specific.",
        "items": [
          {
            "label": "Junction measurement",
            "value": "Median relaxation pressure above the laboratory reference range"
          },
          {
            "label": "Distal contractile integral",
            "value": "Readouts of 30–80 mmHg·s·cm across the test swallows"
          },
          {
            "label": "Trace appearance",
            "value": "Small pressure deflections, without a moving distal contraction peak"
          }
        ]
      }
    }
  },
  {
    "id": "revision.qq20261102b.b04-context",
    "auditId": "B04-context",
    "caseId": "case.achalasia.clinic-referral",
    "nodeId": "node.achalasia.clinic-referral.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v4.r3",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
    "previousChoiceLabels": [
      "High-resolution manometry with positional pressure assessment",
      "Functional lumen imaging with endoscopic distension assessment",
      "Ambulatory pH-impedance monitoring with symptom association assessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_4": "manometry_4",
      "choice.qq20261102b.b04-context.d1": "choice.qq20261102a.b04-context.d1",
      "choice.qq20261102b.b04-context.d2": "choice.qq20261102a.b04-context.d2"
    },
    "choiceServiceOverrides": {
      "manometry_4": "service.esophageal_manometry",
      "choice.qq20261102b.b04-context.d1": null,
      "choice.qq20261102b.b04-context.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.high-resolution-manometry.v4.r3",
      "whatChanged": "Label basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B04-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
          "fairness 2: Revision/preservation: Keep FLIP as a clinically real adjacent alternative and do not describe it as useless. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 3: Preserve the earlier positive repair while applying: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty.",
          "fairness 4: Preserve the earlier positive repair while applying: Keep FLIP as a clinically real adjacent alternative and do not describe it as useless.",
          "fairness 5: Preserve the earlier positive repair while applying: Use natural parallel test names and retain all existing runtime testing estimates and the manometry gate.",
          "fairness 6: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
          "fairness 7: Preserve the earlier positive repair while applying: Keep FLIP as a clinically real adjacent alternative and do not describe it as useless.",
          "fairness 8: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision.",
          "fairness 9: Preserve the earlier positive repair while applying: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty.",
          "fairness 10: Revision/preservation: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Action: Explicitly label the uncomplicated investigation sequence basic rather than importing a failed manometry or falsely claiming difficulty.",
          "suggestions 2: Explicit basicRecallIntentional: This fixed objective selects the initial motor-classification test after structural assessment; it is a foundational investigation sequence, not an advanced discordant-study decision."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification.",
        "closestDistractor": "Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v4.r4",
      "conceptId": "concept.achalasia.high-resolution-manometry",
      "stem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
      "answerChoices": [
        {
          "id": "manometry_4",
          "label": "High-resolution esophageal manometry",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides contraction and junction-relaxation classification at this stage."
        },
        {
          "id": "choice.qq20261102b.b04-context.d1",
          "label": "Endoscopic functional lumen imaging",
          "isCorrect": false,
          "distractorRationale": "Can be a useful adjunct or alternative in selected circumstances, but no unsuccessful or uninterpretable manometry is supplied."
        },
        {
          "id": "choice.qq20261102b.b04-context.d2",
          "label": "Ambulatory esophageal pH-impedance monitoring",
          "isCorrect": false,
          "distractorRationale": "Evaluates reflux/symptom association rather than the unresolved motor classification."
        }
      ],
      "explanation": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence"
      ],
      "teachingPoint": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies."
    }
  },
  {
    "id": "revision.qq20261102b.b05",
    "auditId": "B05",
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r3",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which initial imaging plan should be arranged for {patientName}?",
    "previousChoiceLabels": [
      "Groin ultrasound with standing and Valsalva",
      "Pelvic MRI with hip and adductor assessment",
      "Pelvic CT with abdominal-wall and groin assessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_4": "dynamic_ultrasound_4",
      "choice.qq20261102b.b05.d1": "choice.qq20261102a.b05.d1",
      "choice.qq20261102b.b05.d2": "choice.qq20261102a.b05.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_4": "service.ultrasound",
      "choice.qq20261102b.b05.d1": null,
      "choice.qq20261102b.b05.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r3",
      "whatChanged": "Label basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B05",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
          "fairness 2: Fairness response: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 3: Revision/preservation: Retain the initial stage rather than manufacture an unsupported universally inferior MRI pathway or a new imaging-availability constraint. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 4: Preserve the earlier positive repair while applying: Replace the artificially narrow hip/adductor MRI protocol with a genuine dynamic groin protocol.",
          "fairness 5: Preserve the earlier positive repair while applying: Retain the initial stage rather than manufacture an unsupported universally inferior MRI pathway or a new imaging-availability constraint.",
          "fairness 6: Explicit basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
          "fairness 7: Preserve the earlier positive repair while applying: Replace the artificially narrow hip/adductor MRI protocol with a genuine dynamic groin protocol.",
          "fairness 8: Revision/preservation: Replace the artificially narrow hip/adductor MRI protocol with a genuine dynamic groin protocol. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 9: Revision/preservation: Retain the initial stage rather than manufacture an unsupported universally inferior MRI pathway or a new imaging-availability constraint. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Explicit basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
          "suggestions 2: Fairness response: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone.",
        "closestDistractor": "Anchoring on the reproducible adductor/hip/trunk pain and selecting musculoskeletal MRI is the intended resident error.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r4",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "stem": "Which initial imaging study should be arranged for {patientName}'s groin symptoms?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_4",
          "label": "Standing groin ultrasound during straining",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Targets the intermittent protrusion at the initial imaging stage."
        },
        {
          "id": "choice.qq20261102b.b05.d1",
          "label": "Dynamic groin MRI during straining",
          "isCorrect": false,
          "distractorRationale": "Is a credible problem-solving option, rather than a hip-only protocol deliberately prevented from assessing the reported protrusion."
        },
        {
          "id": "choice.qq20261102b.b05.d2",
          "label": "Pelvic CT with multiplanar groin assessment",
          "isCorrect": false,
          "distractorRationale": "Is an anatomic alternative, but not the preferred initial dynamic study in the represented stable setting."
        }
      ],
      "explanation": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment"
      ],
      "teachingPoint": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway."
    }
  },
  {
    "id": "revision.qq20261102b.b05-context",
    "auditId": "B05-context",
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r3",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which management plan should be discussed with {patientName}?",
    "previousChoiceLabels": [
      "Elective repair consultation with operative-risk review",
      "Watchful waiting with an individualized symptom-triggered review",
      "Support-garment management with an individualized scheduled review"
    ],
    "previousCurrentUpdate": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_4": "elective_discussion_4",
      "choice.qq20261102b.b05-context.d1": "choice.qq20261102a.b05-context.d1",
      "choice.qq20261102b.b05-context.d2": "choice.qq20261102a.b05-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_4": null,
      "choice.qq20261102b.b05-context.d1": null,
      "choice.qq20261102b.b05-context.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r3",
      "whatChanged": "Label basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B05-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
          "fairness 2: Revision/preservation: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 3: Revision/preservation: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 4: Preserve the earlier positive repair while applying: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source.",
          "fairness 5: Preserve the earlier positive repair while applying: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error.",
          "fairness 6: Preserve the earlier positive repair while applying: Declare this routine referral objective basic, rather than add an unrelated major surgical-risk objective.",
          "fairness 7: Preserve the earlier positive repair while applying: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source.",
          "fairness 8: Preserve the earlier positive repair while applying: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error.",
          "fairness 9: Fairness response: Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 10: Preserve the earlier positive repair while applying: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source.",
          "fairness 11: Explicit basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
          "fairness 12: Revision/preservation: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Action: Declare this routine referral objective basic, rather than add an unrelated major surgical-risk objective.",
          "suggestions 2: Explicit basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery.",
        "closestDistractor": "Overextending watchful-waiting advice for minimally symptomatic hernias is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v4.r4",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "stem": "Which management plan should be discussed with {patientName}?",
      "answerChoices": [
        {
          "id": "elective_discussion_4",
          "label": "Elective hernia repair consultation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Discusses repair without assuming all coexisting hip pain will disappear."
        },
        {
          "id": "choice.qq20261102b.b05-context.d1",
          "label": "Watchful waiting with symptom-triggered review",
          "isCorrect": false,
          "distractorRationale": "Treats activity-limiting symptoms as though the patient were minimally symptomatic."
        },
        {
          "id": "choice.qq20261102b.b05-context.d2",
          "label": "Hip-directed rehabilitation and symptom review",
          "isCorrect": false,
          "distractorRationale": "Overattributes the separate surface-swelling pain to a coexisting musculoskeletal finding."
        }
      ],
      "explanation": "Dynamic findings and functional burden support an elective repair discussion with risk assessment. Watchful waiting can be appropriate in selected minimally symptomatic patients; a support garment is not equivalent to repairing the demonstrated defect.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning"
      ],
      "teachingPoint": "Dynamic findings and functional burden support an elective repair discussion with risk assessment. Watchful waiting can be appropriate in selected minimally symptomatic patients; a support garment is not equivalent to repairing the demonstrated defect."
    }
  },
  {
    "id": "revision.qq20261102b.b06",
    "auditId": "B06",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r3",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which initial imaging plan should be arranged for {patientName}?",
    "previousChoiceLabels": [
      "Groin ultrasound with standing and Valsalva",
      "Pelvic MRI with hip and adductor assessment",
      "Pelvic CT with abdominal-wall and groin assessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_2": "dynamic_ultrasound_2",
      "choice.qq20261102b.b06.d1": "choice.qq20261102a.b06.d1",
      "choice.qq20261102b.b06.d2": "choice.qq20261102a.b06.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_2": "service.ultrasound",
      "choice.qq20261102b.b06.d1": null,
      "choice.qq20261102b.b06.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r3",
      "whatChanged": "Label basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B06",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
          "fairness 2: Fairness response: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 3: Revision/preservation: Retain the initial stage rather than manufacture an unsupported universally inferior MRI pathway or a new imaging-availability constraint. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 4: Preserve the earlier positive repair while applying: Replace the artificially narrow hip/adductor MRI protocol with a genuine dynamic groin protocol.",
          "fairness 5: Preserve the earlier positive repair while applying: Retain the initial stage rather than manufacture an unsupported universally inferior MRI pathway or a new imaging-availability constraint.",
          "fairness 6: Explicit basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
          "fairness 7: Preserve the earlier positive repair while applying: Replace the artificially narrow hip/adductor MRI protocol with a genuine dynamic groin protocol.",
          "fairness 8: Revision/preservation: Replace the artificially narrow hip/adductor MRI protocol with a genuine dynamic groin protocol. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 9: Revision/preservation: Retain the initial stage rather than manufacture an unsupported universally inferior MRI pathway or a new imaging-availability constraint. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Explicit basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
          "suggestions 2: Fairness response: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone.",
        "closestDistractor": "Anchoring on the reproducible adductor/hip/trunk pain and selecting musculoskeletal MRI is the intended resident error.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r4",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "stem": "Which initial imaging study should be arranged for {patientName}'s groin symptoms?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_2",
          "label": "Standing groin ultrasound during straining",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Targets the intermittent protrusion at the initial imaging stage."
        },
        {
          "id": "choice.qq20261102b.b06.d1",
          "label": "Dynamic groin MRI during straining",
          "isCorrect": false,
          "distractorRationale": "Is a credible problem-solving option, rather than a hip-only protocol deliberately prevented from assessing the reported protrusion."
        },
        {
          "id": "choice.qq20261102b.b06.d2",
          "label": "Pelvic CT with multiplanar groin assessment",
          "isCorrect": false,
          "distractorRationale": "Is an anatomic alternative, but not the preferred initial dynamic study in the represented stable setting."
        }
      ],
      "explanation": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment"
      ],
      "teachingPoint": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway."
    }
  },
  {
    "id": "revision.qq20261102b.b06-context",
    "auditId": "B06-context",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r3",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which management plan should be discussed with {patientName}?",
    "previousChoiceLabels": [
      "Elective repair consultation with operative-risk review",
      "Watchful waiting with an individualized symptom-triggered review",
      "Support-garment management with an individualized scheduled review"
    ],
    "previousCurrentUpdate": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_2": "elective_discussion_2",
      "choice.qq20261102b.b06-context.d1": "choice.qq20261102a.b06-context.d1",
      "choice.qq20261102b.b06-context.d2": "choice.qq20261102a.b06-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_2": null,
      "choice.qq20261102b.b06-context.d1": null,
      "choice.qq20261102b.b06-context.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r3",
      "whatChanged": "Label basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B06-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
          "fairness 2: Revision/preservation: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 3: Revision/preservation: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 4: Preserve the earlier positive repair while applying: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source.",
          "fairness 5: Preserve the earlier positive repair while applying: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error.",
          "fairness 6: Preserve the earlier positive repair while applying: Declare this routine referral objective basic, rather than add an unrelated major surgical-risk objective.",
          "fairness 7: Preserve the earlier positive repair while applying: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source.",
          "fairness 8: Preserve the earlier positive repair while applying: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error.",
          "fairness 9: Fairness response: Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 10: Preserve the earlier positive repair while applying: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source.",
          "fairness 11: Explicit basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
          "fairness 12: Revision/preservation: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Action: Declare this routine referral objective basic, rather than add an unrelated major surgical-risk objective.",
          "suggestions 2: Explicit basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery.",
        "closestDistractor": "Overextending watchful-waiting advice for minimally symptomatic hernias is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v2.r4",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "stem": "Which management plan should be discussed with {patientName}?",
      "answerChoices": [
        {
          "id": "elective_discussion_2",
          "label": "Elective hernia repair consultation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Discusses repair without assuming all coexisting hip pain will disappear."
        },
        {
          "id": "choice.qq20261102b.b06-context.d1",
          "label": "Watchful waiting with symptom-triggered review",
          "isCorrect": false,
          "distractorRationale": "Treats activity-limiting symptoms as though the patient were minimally symptomatic."
        },
        {
          "id": "choice.qq20261102b.b06-context.d2",
          "label": "Hip-directed rehabilitation and symptom review",
          "isCorrect": false,
          "distractorRationale": "Overattributes the separate surface-swelling pain to a coexisting musculoskeletal finding."
        }
      ],
      "explanation": "Dynamic findings and functional burden support an elective repair discussion with risk assessment. Watchful waiting can be appropriate in selected minimally symptomatic patients; a support garment is not equivalent to repairing the demonstrated defect.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning"
      ],
      "teachingPoint": "Dynamic findings and functional burden support an elective repair discussion with risk assessment. Watchful waiting can be appropriate in selected minimally symptomatic patients; a support garment is not equivalent to repairing the demonstrated defect."
    }
  },
  {
    "id": "revision.qq20261102b.b07",
    "auditId": "B07",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r3",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which initial imaging plan should be arranged for {patientName}?",
    "previousChoiceLabels": [
      "Groin ultrasound with standing and Valsalva",
      "Pelvic MRI with hip and adductor assessment",
      "Pelvic CT with abdominal-wall and groin assessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_3": "dynamic_ultrasound_3",
      "choice.qq20261102b.b07.d1": "choice.qq20261102a.b07.d1",
      "choice.qq20261102b.b07.d2": "choice.qq20261102a.b07.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_3": "service.ultrasound",
      "choice.qq20261102b.b07.d1": null,
      "choice.qq20261102b.b07.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r3",
      "whatChanged": "Label basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B07",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
          "fairness 2: Fairness response: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 3: Revision/preservation: Retain the initial stage rather than manufacture an unsupported universally inferior MRI pathway or a new imaging-availability constraint. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 4: Preserve the earlier positive repair while applying: Replace the artificially narrow hip/adductor MRI protocol with a genuine dynamic groin protocol.",
          "fairness 5: Preserve the earlier positive repair while applying: Retain the initial stage rather than manufacture an unsupported universally inferior MRI pathway or a new imaging-availability constraint.",
          "fairness 6: Explicit basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
          "fairness 7: Preserve the earlier positive repair while applying: Replace the artificially narrow hip/adductor MRI protocol with a genuine dynamic groin protocol.",
          "fairness 8: Revision/preservation: Replace the artificially narrow hip/adductor MRI protocol with a genuine dynamic groin protocol. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 9: Revision/preservation: Retain the initial stage rather than manufacture an unsupported universally inferior MRI pathway or a new imaging-availability constraint. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Explicit basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
          "suggestions 2: Fairness response: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone.",
        "closestDistractor": "Anchoring on the reproducible adductor/hip/trunk pain and selecting musculoskeletal MRI is the intended resident error.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r4",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "stem": "Which initial imaging study should be arranged for {patientName}'s groin symptoms?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_3",
          "label": "Standing groin ultrasound during straining",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Targets the intermittent protrusion at the initial imaging stage."
        },
        {
          "id": "choice.qq20261102b.b07.d1",
          "label": "Dynamic groin MRI during straining",
          "isCorrect": false,
          "distractorRationale": "Is a credible problem-solving option, rather than a hip-only protocol deliberately prevented from assessing the reported protrusion."
        },
        {
          "id": "choice.qq20261102b.b07.d2",
          "label": "Pelvic CT with multiplanar groin assessment",
          "isCorrect": false,
          "distractorRationale": "Is an anatomic alternative, but not the preferred initial dynamic study in the represented stable setting."
        }
      ],
      "explanation": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment"
      ],
      "teachingPoint": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway."
    }
  },
  {
    "id": "revision.qq20261102b.b07-context",
    "auditId": "B07-context",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r3",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which management plan should be discussed with {patientName}?",
    "previousChoiceLabels": [
      "Elective repair consultation with operative-risk review",
      "Watchful waiting with an individualized symptom-triggered review",
      "Support-garment management with an individualized scheduled review"
    ],
    "previousCurrentUpdate": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_3": "elective_discussion_3",
      "choice.qq20261102b.b07-context.d1": "choice.qq20261102a.b07-context.d1",
      "choice.qq20261102b.b07-context.d2": "choice.qq20261102a.b07-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_3": null,
      "choice.qq20261102b.b07-context.d1": null,
      "choice.qq20261102b.b07-context.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r3",
      "whatChanged": "Label basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B07-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
          "fairness 2: Revision/preservation: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 3: Revision/preservation: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 4: Preserve the earlier positive repair while applying: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source.",
          "fairness 5: Preserve the earlier positive repair while applying: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error.",
          "fairness 6: Preserve the earlier positive repair while applying: Declare this routine referral objective basic, rather than add an unrelated major surgical-risk objective.",
          "fairness 7: Preserve the earlier positive repair while applying: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source.",
          "fairness 8: Preserve the earlier positive repair while applying: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error.",
          "fairness 9: Fairness response: Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 10: Preserve the earlier positive repair while applying: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source.",
          "fairness 11: Explicit basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
          "fairness 12: Revision/preservation: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Action: Declare this routine referral objective basic, rather than add an unrelated major surgical-risk objective.",
          "suggestions 2: Explicit basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery.",
        "closestDistractor": "Overextending watchful-waiting advice for minimally symptomatic hernias is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v3.r4",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "stem": "Which management plan should be discussed with {patientName}?",
      "answerChoices": [
        {
          "id": "elective_discussion_3",
          "label": "Elective hernia repair consultation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Discusses repair without assuming all coexisting hip pain will disappear."
        },
        {
          "id": "choice.qq20261102b.b07-context.d1",
          "label": "Watchful waiting with symptom-triggered review",
          "isCorrect": false,
          "distractorRationale": "Treats activity-limiting symptoms as though the patient were minimally symptomatic."
        },
        {
          "id": "choice.qq20261102b.b07-context.d2",
          "label": "Hip-directed rehabilitation and symptom review",
          "isCorrect": false,
          "distractorRationale": "Overattributes the separate surface-swelling pain to a coexisting musculoskeletal finding."
        }
      ],
      "explanation": "Dynamic findings and functional burden support an elective repair discussion with risk assessment. Watchful waiting can be appropriate in selected minimally symptomatic patients; a support garment is not equivalent to repairing the demonstrated defect.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning"
      ],
      "teachingPoint": "Dynamic findings and functional burden support an elective repair discussion with risk assessment. Watchful waiting can be appropriate in selected minimally symptomatic patients; a support garment is not equivalent to repairing the demonstrated defect."
    }
  },
  {
    "id": "revision.qq20261102b.b08",
    "auditId": "B08",
    "caseId": "case.inguinal-hernia.lifting-bulge",
    "nodeId": "node.inguinal-hernia.lifting-bulge.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v1.r3",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which initial imaging plan should be arranged for {patientName}?",
    "previousChoiceLabels": [
      "Groin ultrasound with standing and Valsalva",
      "Pelvic MRI with hip and adductor assessment",
      "Pelvic CT with abdominal-wall and groin assessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_1": "dynamic_ultrasound_1",
      "choice.qq20261102b.b08.d1": "choice.qq20261102a.b08.d1",
      "choice.qq20261102b.b08.d2": "choice.qq20261102a.b08.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_1": "service.ultrasound",
      "choice.qq20261102b.b08.d1": null,
      "choice.qq20261102b.b08.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v1.r3",
      "whatChanged": "Label basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B08",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
          "fairness 2: Fairness response: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 3: Revision/preservation: Retain the initial stage rather than manufacture an unsupported universally inferior MRI pathway or a new imaging-availability constraint. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 4: Preserve the earlier positive repair while applying: Replace the artificially narrow hip/adductor MRI protocol with a genuine dynamic groin protocol.",
          "fairness 5: Preserve the earlier positive repair while applying: Retain the initial stage rather than manufacture an unsupported universally inferior MRI pathway or a new imaging-availability constraint.",
          "fairness 6: Explicit basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
          "fairness 7: Preserve the earlier positive repair while applying: Replace the artificially narrow hip/adductor MRI protocol with a genuine dynamic groin protocol.",
          "fairness 8: Revision/preservation: Replace the artificially narrow hip/adductor MRI protocol with a genuine dynamic groin protocol. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 9: Revision/preservation: Retain the initial stage rather than manufacture an unsupported universally inferior MRI pathway or a new imaging-availability constraint. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Explicit basicRecallIntentional: The stable intermittent-lump/equivocal-examination objective is deliberately a basic initial dynamic-ultrasound rule; a failed-imaging problem would test a different stage.",
          "suggestions 2: Fairness response: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone.",
        "closestDistractor": "Anchoring on the reproducible adductor/hip/trunk pain and selecting musculoskeletal MRI is the intended resident error.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v1.r4",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "stem": "Which initial imaging study should be arranged for {patientName}'s groin symptoms?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_1",
          "label": "Standing groin ultrasound during straining",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Targets the intermittent protrusion at the initial imaging stage."
        },
        {
          "id": "choice.qq20261102b.b08.d1",
          "label": "Dynamic groin MRI during straining",
          "isCorrect": false,
          "distractorRationale": "Is a credible problem-solving option, rather than a hip-only protocol deliberately prevented from assessing the reported protrusion."
        },
        {
          "id": "choice.qq20261102b.b08.d2",
          "label": "Pelvic CT with multiplanar groin assessment",
          "isCorrect": false,
          "distractorRationale": "Is an anatomic alternative, but not the preferred initial dynamic study in the represented stable setting."
        }
      ],
      "explanation": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment"
      ],
      "teachingPoint": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway."
    }
  },
  {
    "id": "revision.qq20261102b.b08-context",
    "auditId": "B08-context",
    "caseId": "case.inguinal-hernia.lifting-bulge",
    "nodeId": "node.inguinal-hernia.lifting-bulge.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r3",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which management plan should be discussed with {patientName}?",
    "previousChoiceLabels": [
      "Elective repair consultation with operative-risk review",
      "Watchful waiting with an individualized symptom-triggered review",
      "Support-garment management with an individualized scheduled review"
    ],
    "previousCurrentUpdate": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_1": "elective_discussion_1",
      "choice.qq20261102b.b08-context.d1": "choice.qq20261102a.b08-context.d1",
      "choice.qq20261102b.b08-context.d2": "choice.qq20261102a.b08-context.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_1": null,
      "choice.qq20261102b.b08-context.d1": null,
      "choice.qq20261102b.b08-context.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r3",
      "whatChanged": "Label basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B08-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
          "fairness 2: Revision/preservation: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 3: Revision/preservation: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 4: Preserve the earlier positive repair while applying: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source.",
          "fairness 5: Preserve the earlier positive repair while applying: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error.",
          "fairness 6: Preserve the earlier positive repair while applying: Declare this routine referral objective basic, rather than add an unrelated major surgical-risk objective.",
          "fairness 7: Preserve the earlier positive repair while applying: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source.",
          "fairness 8: Preserve the earlier positive repair while applying: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error.",
          "fairness 9: Fairness response: Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 10: Preserve the earlier positive repair while applying: Keep reducibility and activity limitation; retain consultation/risk discussion rather than promising a cure for every pain source.",
          "fairness 11: Explicit basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning.",
          "fairness 12: Revision/preservation: Replace the support-garment duplicate deferral with the distinct and plausible musculoskeletal-attribution error. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Action: Declare this routine referral objective basic, rather than add an unrelated major surgical-risk objective.",
          "suggestions 2: Explicit basicRecallIntentional: This objective teaches discussion of repair for a reducible activity-limiting hernia; operative technique, antiplatelet timing or unrelated perioperative disease would broaden its meaning."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery.",
        "closestDistractor": "Overextending watchful-waiting advice for minimally symptomatic hernias is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v1.r4",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "stem": "Which management plan should be discussed with {patientName}?",
      "answerChoices": [
        {
          "id": "elective_discussion_1",
          "label": "Elective hernia repair consultation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Discusses repair without assuming all coexisting hip pain will disappear."
        },
        {
          "id": "choice.qq20261102b.b08-context.d1",
          "label": "Watchful waiting with symptom-triggered review",
          "isCorrect": false,
          "distractorRationale": "Treats activity-limiting symptoms as though the patient were minimally symptomatic."
        },
        {
          "id": "choice.qq20261102b.b08-context.d2",
          "label": "Hip-directed rehabilitation and symptom review",
          "isCorrect": false,
          "distractorRationale": "Overattributes the separate surface-swelling pain to a coexisting musculoskeletal finding."
        }
      ],
      "explanation": "Dynamic findings and functional burden support an elective repair discussion with risk assessment. Watchful waiting can be appropriate in selected minimally symptomatic patients; a support garment is not equivalent to repairing the demonstrated defect.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102a.symptomatic-groin-planning"
      ],
      "teachingPoint": "Dynamic findings and functional burden support an elective repair discussion with risk assessment. Watchful waiting can be appropriate in selected minimally symptomatic patients; a support garment is not equivalent to repairing the demonstrated defect."
    }
  },
  {
    "id": "revision.qq20261102b.b09",
    "auditId": "B09",
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-palpable-node",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-palpable-node.1",
    "previousQuestionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r3",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which regional imaging plan should be obtained before {patientName}'s operation?",
    "previousChoiceLabels": [
      "Neck ultrasound surveying central and lateral nodal compartments",
      "Contrast neck CT surveying central and lateral nodal compartments",
      "FDG PET-CT surveying central and lateral nodal compartments"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "This objective selects initial cervical mapping after thyroid malignant cytology; it is a basic preoperative workup rule rather than advanced nodal-biopsy criteria.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qq20261102b.b09.d1": "choice.qq20261102a.b09.d1",
      "choice.qq20261102b.b09.d2": "choice.qq20261102a.b09.d2"
    },
    "choiceServiceOverrides": {
      "correct_3": "service.ultrasound",
      "choice.qq20261102b.b09.d1": null,
      "choice.qq20261102b.b09.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qq20261102b.b09.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102b.b09.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r3",
      "whatChanged": "Label basicRecallIntentional: This objective selects initial cervical mapping after thyroid malignant cytology; it is a basic preoperative workup rule rather than advanced nodal-biopsy criteria.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B09",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Fairness response: The record does not contain a regional survey or features establishing a special extensive-disease CT indication; standard initial cervical ultrasound is the best offered plan. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
        ],
        "fairness": [
          "fairness 1: Fairness response: The record does not contain a regional survey or features establishing a special extensive-disease CT indication; standard initial cervical ultrasound is the best offered plan. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 2: Explicit basicRecallIntentional: This objective selects initial cervical mapping after thyroid malignant cytology; it is a basic preoperative workup rule rather than advanced nodal-biopsy criteria.",
          "fairness 3: Fairness response: The record does not contain a regional survey or features establishing a special extensive-disease CT indication; standard initial cervical ultrasound is the best offered plan. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Preserve the earlier positive repair while applying: Label initial mapping basic, preserving the cytology interpretation rather than pretending classic nuclei make it hard.",
          "fairness 5: Preserve the earlier positive repair while applying: Replace PET-CT with a real regional MRI alternative at comparable scope; do not invent advanced-node criteria under this concept.",
          "fairness 6: Explicit basicRecallIntentional: This objective selects initial cervical mapping after thyroid malignant cytology; it is a basic preoperative workup rule rather than advanced nodal-biopsy criteria.",
          "fairness 7: Preserve the earlier positive repair while applying: Label initial mapping basic, preserving the cytology interpretation rather than pretending classic nuclei make it hard.",
          "fairness 8: Revision/preservation: Label initial mapping basic, preserving the cytology interpretation rather than pretending classic nuclei make it hard. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 9: Preserve the earlier positive repair while applying: Remove the sentence announcing that the survey is missing; retain the actual limited procedure-image contents."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: The record does not contain a regional survey or features establishing a special extensive-disease CT indication; standard initial cervical ultrasound is the best offered plan. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "suggestions 2: Fairness response: The record does not contain a regional survey or features establishing a special extensive-disease CT indication; standard initial cervical ultrasound is the best offered plan. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "The record does not contain a regional survey or features establishing a special extensive-disease CT indication; standard initial cervical ultrasound is the best offered plan.",
        "closestDistractor": "Choosing CT to map any palpable lateral node, or advanced metabolic imaging for every malignancy, are credible staging errors.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r4",
      "conceptId": "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound",
      "stem": "Which regional imaging plan should be obtained before {patientName}'s operation?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Neck ultrasound of central and lateral nodal compartments",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides the initial regional map after malignant cytology."
        },
        {
          "id": "choice.qq20261102b.b09.d1",
          "label": "Contrast neck CT of central and lateral nodal compartments",
          "isCorrect": false,
          "distractorRationale": "Can be useful for selected extensive/invasive disease, but the supplied case does not establish that additional anatomic need."
        },
        {
          "id": "choice.qq20261102b.b09.d2",
          "label": "Contrast neck MRI of central and lateral nodal compartments",
          "isCorrect": false,
          "distractorRationale": "Is a genuine cross-sectional regional study, but not a replacement for the initial ultrasound survey in this record."
        }
      ],
      "explanation": "Malignant thyroid cytology calls for cervical ultrasound assessment of the central and lateral nodal compartments. Limited aspiration images are not a regional map. CT or MRI can add anatomic information in selected extensive or invasive disease; those concerns are not established in this basic initial-mapping case.",
      "supportingEvidenceClaimIds": [
        "claim.dtc.preop-ultrasound",
        "claim.qq20261102a.papillary-cytology-regional-survey",
        "claim.qq20261102a.papillary-cytology-pattern"
      ],
      "teachingPoint": "Malignant thyroid cytology calls for cervical ultrasound assessment of the central and lateral nodal compartments. Limited aspiration images are not a regional map. CT or MRI can add anatomic information in selected extensive or invasive disease; those concerns are not established in this basic initial-mapping case."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after a thyroid aspiration. The report describes papillary cell groups, nuclear grooves and intranuclear cytoplasmic inclusions. The saved procedure images contain close views of the nodule and needle tip. A mobile node is palpable in the lateral neck.",
    "previousPresentation": "{patientName}, a 43-year-old woman, visits the clinic after a thyroid aspiration. The report describes papillary cell groups, nuclear grooves and intranuclear cytoplasmic inclusions. The procedure images document the thyroid nodule and needle position. A mobile node is palpable in the lateral neck; no regional nodal survey is documented.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.43",
        "presentation": "{patientName}, a 43-year-old woman, visits the clinic after a thyroid aspiration. The report describes papillary cell groups, nuclear grooves and intranuclear cytoplasmic inclusions. The procedure images document the thyroid nodule and needle position. A mobile node is palpable in the lateral neck; no regional nodal survey is documented."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.43",
        "presentation": "{patientName}, a 43-year-old man, visits the clinic after a thyroid aspiration. The report describes papillary cell groups, nuclear grooves and intranuclear cytoplasmic inclusions. The procedure images document the thyroid nodule and needle position. A mobile node is palpable in the lateral neck; no regional nodal survey is documented."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.68",
        "presentation": "{patientName}, a 68-year-old woman, visits the clinic after a thyroid aspiration. The report describes papillary cell groups, nuclear grooves and intranuclear cytoplasmic inclusions. The procedure images document the thyroid nodule and needle position. A mobile node is palpable in the lateral neck; no regional nodal survey is documented."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.68",
        "presentation": "{patientName}, a 68-year-old man, visits the clinic after a thyroid aspiration. The report describes papillary cell groups, nuclear grooves and intranuclear cytoplasmic inclusions. The procedure images document the thyroid nodule and needle position. A mobile node is palpable in the lateral neck; no regional nodal survey is documented."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.gs028b.differentiated-thyroid-cancer.a-palpable-node",
        "patientPresentationVariantId": "presentation.gs028b.differentiated-thyroid-cancer.a-palpable-node",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Neck lump review",
        "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic after a thyroid aspiration. The report describes papillary cell groups, nuclear grooves and intranuclear cytoplasmic inclusions. The procedure images document the thyroid nodule and needle position. A mobile node is palpable in the lateral neck; no regional nodal survey is documented.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102a.profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.43",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.43",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic after a thyroid aspiration. The report describes papillary cell groups, nuclear grooves and intranuclear cytoplasmic inclusions. The procedure images document the thyroid nodule and needle position. A mobile node is palpable in the lateral neck; no regional nodal survey is documented.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.43",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.43",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 43-year-old man, visits the clinic after a thyroid aspiration. The report describes papillary cell groups, nuclear grooves and intranuclear cytoplasmic inclusions. The procedure images document the thyroid nodule and needle position. A mobile node is palpable in the lateral neck; no regional nodal survey is documented.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.68",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.68",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 68-year-old woman, visits the clinic after a thyroid aspiration. The report describes papillary cell groups, nuclear grooves and intranuclear cytoplasmic inclusions. The procedure images document the thyroid nodule and needle position. A mobile node is palpable in the lateral neck; no regional nodal survey is documented.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.68",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.68",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 68-year-old man, visits the clinic after a thyroid aspiration. The report describes papillary cell groups, nuclear grooves and intranuclear cytoplasmic inclusions. The procedure images document the thyroid nodule and needle position. A mobile node is palpable in the lateral neck; no regional nodal survey is documented.",
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
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102b.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v6"
    }
  },
  {
    "id": "revision.qq20261102b.b10",
    "auditId": "B10",
    "caseId": "case.gs028.stoma-prolapse.b-obstructed-prolapse",
    "nodeId": "node.gs028.stoma-prolapse.b-obstructed-prolapse.1",
    "previousQuestionVariantId": "question.stoma-prolapse.urgent-surgical-escalation.v4.r3",
    "questionVariantId": "question.stoma-prolapse.urgent-surgical-escalation.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which management plan should be initiated for {patientName}'s stoma problem?",
    "previousChoiceLabels": [
      "Hospital surgical assessment with intravenous resuscitation",
      "Osmotic stoma reduction with supervised outpatient reassessment",
      "Sedated manual reduction with supervised outpatient reassessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional safety-recognition item: obstructive symptoms with an irreducible stoma require escalation; hiding these warning signs to make residents struggle would be unsafe and unfair.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qq20261102b.b10.d1": "choice.qq20261102a.b10.d1",
      "choice.qq20261102b.b10.d2": "choice.qq20261102a.b10.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qq20261102b.b10.d1": null,
      "choice.qq20261102b.b10.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.stoma-prolapse.urgent-surgical-escalation.v4.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional safety-recognition item: obstructive symptoms with an irreducible stoma require escalation; hiding these warning signs to make residents struggle would be unsafe and unfair.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B10",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Cue response: This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria. Make the basic safety-recognition designation explicit in the packet and authoring intent.",
          "cues 2: Fairness response: The combined obstructive/nonreducible presentation requires acute surgical assessment rather than an outpatient reduction plan. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
        ],
        "fairness": [
          "fairness 1: Fairness response: The combined obstructive/nonreducible presentation requires acute surgical assessment rather than an outpatient reduction plan. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 2: Explicit basicRecallIntentional: Intentional safety-recognition item: obstructive symptoms with an irreducible stoma require escalation; hiding these warning signs to make residents struggle would be unsafe and unfair.",
          "fairness 3: Revision/preservation: Keep parallel initial management plans and acknowledge that the disposition distinction is intentionally easy, not a difficult reduction-technique test. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 4: Revision/preservation: Make the basic safety-recognition designation explicit in the packet and authoring intent. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 5: Explicit basicRecallIntentional: Intentional safety-recognition item: obstructive symptoms with an irreducible stoma require escalation; hiding these warning signs to make residents struggle would be unsafe and unfair.",
          "fairness 6: Preserve the earlier positive repair while applying: Make the basic safety-recognition designation explicit in the packet and authoring intent.",
          "fairness 7: Explicit basicRecallIntentional: Intentional safety-recognition item: obstructive symptoms with an irreducible stoma require escalation; hiding these warning signs to make residents struggle would be unsafe and unfair.",
          "fairness 8: Preserve the earlier positive repair while applying: Keep parallel initial management plans and acknowledge that the disposition distinction is intentionally easy, not a difficult reduction-technique test.",
          "fairness 9: Preserve the earlier positive repair while applying: Make the basic safety-recognition designation explicit in the packet and authoring intent.",
          "fairness 10: Revision/preservation: Make the basic safety-recognition designation explicit in the packet and authoring intent. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Explicit basicRecallIntentional: Intentional safety-recognition item: obstructive symptoms with an irreducible stoma require escalation; hiding these warning signs to make residents struggle would be unsafe and unfair.",
          "suggestions 2: Fairness response: The combined obstructive/nonreducible presentation requires acute surgical assessment rather than an outpatient reduction plan. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "The combined obstructive/nonreducible presentation requires acute surgical assessment rather than an outpatient reduction plan.",
        "closestDistractor": "Applying osmotic reduction to a red, apparently viable stoma despite obstructive symptoms is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.stoma-prolapse.urgent-surgical-escalation.v4.r4",
      "conceptId": "concept.stoma-prolapse.urgent-surgical-escalation",
      "stem": "Which management plan should be initiated for {patientName}'s stoma problem?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Hospital surgical review with intravenous fluids",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Escalates the irreducible obstructive presentation; color alone is not interpreted as proven necrosis."
        },
        {
          "id": "choice.qq20261102b.b10.d1",
          "label": "Observed osmotic reduction followed by outpatient review",
          "isCorrect": false,
          "distractorRationale": "Does not replace hospital assessment of the supplied obstruction and irreducibility."
        },
        {
          "id": "choice.qq20261102b.b10.d2",
          "label": "Observed manual reduction followed by outpatient review",
          "isCorrect": false,
          "distractorRationale": "Does not establish that the obstructive problem is adequately managed by an outpatient reduction plan."
        }
      ],
      "explanation": "Vomiting, marked output reduction and a nonreducible prolapse warrant hospital surgical assessment and supportive resuscitation. Red bowel is not proof of ischemia, but neither does it justify treating the presentation as uncomplicated.",
      "supportingEvidenceClaimIds": [
        "claim.stoma-prolapse.urgent-escalation"
      ],
      "teachingPoint": "Vomiting, marked output reduction and a nonreducible prolapse warrant hospital surgical assessment and supportive resuscitation. Red bowel is not proof of ischemia, but neither does it justify treating the presentation as uncomplicated."
    }
  },
  {
    "id": "revision.qq20261102b.b11",
    "auditId": "B11",
    "caseId": "case.pigmented-skin-lesion.shoulder-border",
    "nodeId": "node.pigmented-skin-lesion.shoulder-border.2",
    "previousQuestionVariantId": "question.melanoma.sentinel-node-staging.v2.r3",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v2.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which regional-node plan should accompany {patientName}'s further excision planning?",
    "previousChoiceLabels": [
      "Sentinel lymph node mapping and biopsy",
      "Ultrasound-guided biopsy of an imaged regional node",
      "Ultrasound surveillance of the regional nodes"
    ],
    "previousCurrentUpdate": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.6 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret invasion thickness and clinical/sonographic nodal findings to retain the staging indication. Then Coordinate staging with the proposed reconstruction rather than treating staging after wound healing as equivalent.",
    "reviewerNotes": "Melissa must confirm the reconstruction and mapping sequence. The older CCO technical recommendation is corroborated for the staging indication by retained current melanoma evidence; no reliability probability or mandatory operation is asserted.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sentinel_node_2": "sentinel_node_2",
      "choice.qq20261102b.b11.d1": "choice.qq20261102a.b11.d1",
      "choice.qq20261102b.b11.d2": "choice.qq20261102a.b11.d2"
    },
    "choiceServiceOverrides": {
      "sentinel_node_2": null,
      "choice.qq20261102b.b11.d1": null,
      "choice.qq20261102b.b11.d2": null
    },
    "choiceTimingOverrides": {
      "sentinel_node_2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102b.b11.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102b.b11.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "currentUpdate": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.6 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes. The primary-site team has proposed wide local excision followed by a rotation flap.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.melanoma.sentinel-node-staging.v2.r3",
      "whatChanged": "Retain the existing thickness and node observations, add a concrete proposed reconstruction, and require a combined staging/sequence plan rather than routine biopsy-versus-surveillance recall.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B11",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Revision/preservation: Use the raw pathology and reassuring ultrasound without re-labelling them as a conclusion. Two plans include sentinel-node biopsy and two complete primary surgery immediately. No option explains lymphatic disruption; the reconstructive method is supplied as a concrete planned procedure, not a safety slogan.",
          "fairness 2: Application revision: Interpret invasion thickness and clinical/sonographic nodal findings to retain the staging indication. Then Coordinate staging with the proposed reconstruction rather than treating staging after wound healing as equivalent. Closest error: Booking wide excision/reconstruction now and arranging the known sentinel procedure after final pathology/wound healing is the intended near miss.",
          "fairness 3: Fairness response: The key preserves both staging and the guideline-preferred sequence before the planned flap/graft. The alternative staging plan is a credible sequencing error, not an implausible procedure. Clinical boundary: Melissa must confirm the reconstruction and mapping sequence. The older CCO technical recommendation is corroborated for the staging indication by retained current melanoma evidence; no reliability probability or mandatory operation is asserted.",
          "fairness 4: Preserve the earlier positive repair while applying: Add a rotation flap planning and compare staging now versus after reconstruction as the closest error.",
          "fairness 5: Preserve the earlier positive repair while applying: Vary the actual task across siblings: B11/B17 assess reconstruction timing, while B12/B18 are explicitly basic staging-rule items rather than thickness-only claims of harder variants.",
          "fairness 6: Preserve the earlier positive repair while applying: Use the raw pathology and reassuring ultrasound without re-labelling them as a conclusion.",
          "fairness 7: Fairness response: The key preserves both staging and the guideline-preferred sequence before the planned flap/graft. The alternative staging plan is a credible sequencing error, not an implausible procedure. Clinical boundary: Melissa must confirm the reconstruction and mapping sequence. The older CCO technical recommendation is corroborated for the staging indication by retained current melanoma evidence; no reliability probability or mandatory operation is asserted.",
          "fairness 8: Preserve the earlier positive repair while applying: Vary the actual task across siblings: B11/B17 assess reconstruction timing, while B12/B18 are explicitly basic staging-rule items rather than thickness-only claims of harder variants.",
          "fairness 9: Preserve the earlier positive repair while applying: Use the raw pathology and reassuring ultrasound without re-labelling them as a conclusion.",
          "fairness 10: Revision/preservation: Use the raw pathology and reassuring ultrasound without re-labelling them as a conclusion. Two plans include sentinel-node biopsy and two complete primary surgery immediately. No option explains lymphatic disruption; the reconstructive method is supplied as a concrete planned procedure, not a safety slogan.",
          "fairness 11: Revision/preservation: Add a rotation flap planning and compare staging now versus after reconstruction as the closest error. Two plans include sentinel-node biopsy and two complete primary surgery immediately. No option explains lymphatic disruption; the reconstructive method is supplied as a concrete planned procedure, not a safety slogan."
        ],
        "suggestions": [
          "suggestions 1: Application revision: Interpret invasion thickness and clinical/sonographic nodal findings to retain the staging indication. Then Coordinate staging with the proposed reconstruction rather than treating staging after wound healing as equivalent. Closest error: Booking wide excision/reconstruction now and arranging the known sentinel procedure after final pathology/wound healing is the intended near miss.",
          "suggestions 2: Action: Add a rotation flap planning and compare staging now versus after reconstruction as the closest error."
        ]
      },
      "selfCheck": {
        "cueAttack": "Two plans include sentinel-node biopsy and two complete primary surgery immediately. No option explains lymphatic disruption; the reconstructive method is supplied as a concrete planned procedure, not a safety slogan.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret invasion thickness and clinical/sonographic nodal findings to retain the staging indication.",
          "Coordinate staging with the proposed reconstruction rather than treating staging after wound healing as equivalent."
        ],
        "oneBestAnswer": "The key preserves both staging and the guideline-preferred sequence before the planned flap/graft. The alternative staging plan is a credible sequencing error, not an implausible procedure.",
        "closestDistractor": "Booking wide excision/reconstruction now and arranging the known sentinel procedure after final pathology/wound healing is the intended near miss.",
        "remainingReview": "Melissa must confirm the reconstruction and mapping sequence. The older CCO technical recommendation is corroborated for the staging indication by retained current melanoma evidence; no reliability probability or mandatory operation is asserted."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.melanoma.sentinel-node-staging.v2.r4",
      "conceptId": "concept.melanoma.sentinel-node-staging",
      "stem": "Which combined primary-site and regional-node plan should be discussed with {patientName}?",
      "answerChoices": [
        {
          "id": "sentinel_node_2",
          "label": "Sentinel-node biopsy with wide excision, before reconstructive closure",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Maintains microscopic nodal staging and coordinates it with excision before the planned reconstruction can alter lymphatic mapping."
        },
        {
          "id": "choice.qq20261102b.b11.d1",
          "label": "Sentinel-node biopsy after wide excision and reconstructive healing",
          "isCorrect": false,
          "distractorRationale": "Recognizes the staging indication but unnecessarily separates it until after a flap or graft can compromise mapping."
        },
        {
          "id": "choice.qq20261102b.b11.d2",
          "label": "Nodal ultrasound surveillance after wide excision and reconstructive closure",
          "isCorrect": false,
          "distractorRationale": "Treats the reassuring sonographic basin as a substitute for indicated microscopic regional staging."
        }
      ],
      "explanation": "Discuss sentinel-node staging for the represented clinically node-negative intermediate-thickness melanoma. Coordinate mapping/biopsy with wide excision before the planned flap or graft reconstruction; a later separate procedure can be less reliable. Reassuring nodal ultrasound does not replace microscopic staging. Final surgical choices remain individualized.",
      "supportingEvidenceClaimIds": [
        "claim.melanoma.sentinel-node-staging",
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-integrated-node-staging",
        "claim.qq20261102b.sentinel-before-reconstruction"
      ],
      "teachingPoint": "Discuss sentinel-node staging for the represented clinically node-negative intermediate-thickness melanoma. Coordinate mapping/biopsy with wide excision before the planned flap or graft reconstruction; a later separate procedure can be less reliable. Reassuring nodal ultrasound does not replace microscopic staging. Final surgical choices remain individualized."
    }
  },
  {
    "id": "revision.qq20261102b.b11-context",
    "auditId": "B11-context",
    "caseId": "case.pigmented-skin-lesion.shoulder-border",
    "nodeId": "node.pigmented-skin-lesion.shoulder-border.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r3",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
    "previousChoiceLabels": [
      "Elliptical sampling of the lesion through the dermis into subcutaneous fat",
      "Punch sampling of the darkest focus through the dermis into subcutaneous fat",
      "Tangential sampling of the lesion across its surface and papillary dermis"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_2": "excisional_2",
      "choice.qq20261102b.b11-context.d1": "choice.qq20261102a.b11-context.d1",
      "choice.qq20261102b.b11-context.d2": "choice.qq20261102a.b11-context.d2"
    },
    "choiceServiceOverrides": {
      "excisional_2": "service.skin_excisional_biopsy",
      "choice.qq20261102b.b11-context.d1": null,
      "choice.qq20261102b.b11-context.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B11-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
          "fairness 2: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 3: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Revision/preservation: Specify complete removal and a concrete closure examination; 'elliptical sampling' no longer stands in for whole-lesion excision. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 5: Revision/preservation: Remove the B12 sentence explicitly saying the darkest area is not the thickest. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 6: Preserve the earlier positive repair while applying: Specify complete removal and a concrete closure examination; 'elliptical sampling' no longer stands in for whole-lesion excision.",
          "fairness 7: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
          "fairness 8: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 9: Preserve the earlier positive repair while applying: Specify complete removal and a concrete closure examination; 'elliptical sampling' no longer stands in for whole-lesion excision.",
          "fairness 10: Preserve the earlier positive repair while applying: Remove the B12 sentence explicitly saying the darkest area is not the thickest.",
          "fairness 11: Revision/preservation: Remove the B12 sentence explicitly saying the darkest area is not the thickest. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 12: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
          "fairness 13: Preserve the earlier positive repair while applying: Remove the B12 sentence explicitly saying the darkest area is not the thickest."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "suggestions 2: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations.",
        "closestDistractor": "Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r4",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "stem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
      "answerChoices": [
        {
          "id": "excisional_2",
          "label": "Entire-lesion excision with narrow margin into subcutaneous fat",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides whole-lesion architecture and adequate depth when the stated site/closure findings permit diagnostic excision."
        },
        {
          "id": "choice.qq20261102b.b11-context.d1",
          "label": "Punch biopsy of the darkest pigmented focus into subcutaneous fat",
          "isCorrect": false,
          "distractorRationale": "Provides depth at one focus but can miss relevant architecture or a different invasive focus elsewhere."
        },
        {
          "id": "choice.qq20261102b.b11-context.d2",
          "label": "Punch biopsy of the most elevated focus into subcutaneous fat",
          "isCorrect": false,
          "distractorRationale": "Targets a plausible invasive focus but does not assess the whole small lesion when complete diagnostic excision is feasible."
        }
      ],
      "explanation": "A narrow diagnostic excision of the entire small lesion into subcutaneous fat provides architecture and depth for assessment. Either full-depth focal punch can miss a different relevant component. This does not make focal sampling inappropriate for every large or anatomically constrained lesion; the supplied closure examination defines the represented feasible diagnostic excision.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling"
      ],
      "teachingPoint": "A narrow diagnostic excision of the entire small lesion into subcutaneous fat provides architecture and depth for assessment. Either full-depth focal punch can miss a different relevant component. This does not make focal sampling inappropriate for every large or anatomically constrained lesion; the supplied closure examination defines the represented feasible diagnostic excision."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with a changing pigmented lesion on the upper arm. A flat asymmetric pigmented area contains a newly raised focus. On examination, the surrounding lax skin can be brought together around the entire lesion without tension.",
    "previousPresentation": "{patientName}, a 58-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A flat asymmetric pigmented area contains a newly raised focus.",
    "previousProfilePresentations": [
      {
        "id": "profile.pigmented-skin-lesion.shoulder-border.female.58",
        "presentation": "{patientName}, a 58-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A flat asymmetric pigmented area contains a newly raised focus."
      },
      {
        "id": "profile.pigmented-skin-lesion.shoulder-border.male.58",
        "presentation": "{patientName}, a 58-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A flat asymmetric pigmented area contains a newly raised focus."
      },
      {
        "id": "profile.pigmented-skin-lesion.shoulder-border.female.63",
        "presentation": "{patientName}, a 63-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A flat asymmetric pigmented area contains a newly raised focus."
      },
      {
        "id": "profile.pigmented-skin-lesion.shoulder-border.male.63",
        "presentation": "{patientName}, a 63-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A flat asymmetric pigmented area contains a newly raised focus."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.pigmented-skin-lesion.shoulder-border",
        "patientPresentationVariantId": "presentation.pigmented-skin-lesion.shoulder-border",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Changing skin spot",
        "revisedPresentation": "{patientName}, a 58-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A flat asymmetric pigmented area contains a newly raised focus.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.shoulder-border.female.58",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.shoulder-border.female.58",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 58-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A flat asymmetric pigmented area contains a newly raised focus.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.shoulder-border.male.58",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.shoulder-border.male.58",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 58-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A flat asymmetric pigmented area contains a newly raised focus.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.shoulder-border.female.63",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.shoulder-border.female.63",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 63-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A flat asymmetric pigmented area contains a newly raised focus.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.shoulder-border.male.63",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.shoulder-border.male.63",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 63-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A flat asymmetric pigmented area contains a newly raised focus.",
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
        "ageYears": 58,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102b.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v6"
    }
  },
  {
    "id": "revision.qq20261102b.b12",
    "auditId": "B12",
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.2",
    "previousQuestionVariantId": "question.melanoma.sentinel-node-staging.v4.r3",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which regional-node plan should accompany {patientName}'s further excision planning?",
    "previousChoiceLabels": [
      "Sentinel lymph node mapping and biopsy",
      "Ultrasound-guided biopsy of an imaged regional node",
      "Ultrasound surveillance of the regional nodes"
    ],
    "previousCurrentUpdate": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.5 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic regional-staging rule for clinically node-negative intermediate-thickness melanoma; different above-threshold thicknesses do not create advanced decision variants.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sentinel_node_4": "sentinel_node_4",
      "choice.qq20261102b.b12.d1": "choice.qq20261102a.b12.d1",
      "choice.qq20261102b.b12.d2": "choice.qq20261102a.b12.d2"
    },
    "choiceServiceOverrides": {
      "sentinel_node_4": null,
      "choice.qq20261102b.b12.d1": null,
      "choice.qq20261102b.b12.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.melanoma.sentinel-node-staging.v4.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic regional-staging rule for clinically node-negative intermediate-thickness melanoma; different above-threshold thicknesses do not create advanced decision variants.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B12",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Revision/preservation: Label the routine staging indication basic and retain its necessary depth/examination/ultrasound findings. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 2: Explicit basicRecallIntentional: Intentional basic regional-staging rule for clinically node-negative intermediate-thickness melanoma; different above-threshold thicknesses do not create advanced decision variants.",
          "fairness 3: Fairness response: The measured invasive primary and clinically uninvolved basin support sentinel staging; normal-appearing nodes do not establish microscopic node negativity. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Preserve the earlier positive repair while applying: Do not claim that replacing 'Breslow' with descriptive measurements creates a second consequential inference.",
          "fairness 5: Preserve the earlier positive repair while applying: Sibling B11/B17 now assess reconstruction sequencing; these two retain the original narrow indication objective without importing a new eligibility controversy.",
          "fairness 6: Preserve the earlier positive repair while applying: Label the routine staging indication basic and retain its necessary depth/examination/ultrasound findings.",
          "fairness 7: Fairness response: The measured invasive primary and clinically uninvolved basin support sentinel staging; normal-appearing nodes do not establish microscopic node negativity. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 8: Preserve the earlier positive repair while applying: Sibling B11/B17 now assess reconstruction sequencing; these two retain the original narrow indication objective without importing a new eligibility controversy.",
          "fairness 9: Preserve the earlier positive repair while applying: Label the routine staging indication basic and retain its necessary depth/examination/ultrasound findings.",
          "fairness 10: Revision/preservation: Label the routine staging indication basic and retain its necessary depth/examination/ultrasound findings. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 11: Revision/preservation: Do not claim that replacing 'Breslow' with descriptive measurements creates a second consequential inference. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Explicit basicRecallIntentional: Intentional basic regional-staging rule for clinically node-negative intermediate-thickness melanoma; different above-threshold thicknesses do not create advanced decision variants.",
          "suggestions 2: Action: Do not claim that replacing 'Breslow' with descriptive measurements creates a second consequential inference."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "The measured invasive primary and clinically uninvolved basin support sentinel staging; normal-appearing nodes do not establish microscopic node negativity.",
        "closestDistractor": "Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.melanoma.sentinel-node-staging.v4.r4",
      "conceptId": "concept.melanoma.sentinel-node-staging",
      "stem": "Which regional-node assessment should be discussed with {patientName}?",
      "answerChoices": [
        {
          "id": "sentinel_node_4",
          "label": "Sentinel lymph node mapping and biopsy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Interprets the primary depth and clinically uninvolved basin, rather than treating reassuring node imaging as exclusion of microscopic involvement."
        },
        {
          "id": "choice.qq20261102b.b12.d1",
          "label": "Ultrasound-guided biopsy of an imaged regional node",
          "isCorrect": false,
          "distractorRationale": "Confuses size-selected sampling of a nonsuspicious visible node with mapping the sentinel drainage of the primary lesion."
        },
        {
          "id": "choice.qq20261102b.b12.d2",
          "label": "Ultrasound surveillance of the regional nodes",
          "isCorrect": false,
          "distractorRationale": "Overweights benign-appearing imaged nodes and omits the indicated pathologic sentinel staging discussion."
        }
      ],
      "explanation": "The histology establishes an invasive melanoma with the supplied depth. In this clinically node-negative setting, sentinel-node staging should be discussed with definitive excision planning; sampling an arbitrary benign-appearing node or relying on surveillance does not supply equivalent sentinel staging.",
      "supportingEvidenceClaimIds": [
        "claim.melanoma.sentinel-node-staging",
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-integrated-node-staging"
      ],
      "teachingPoint": "The histology establishes an invasive melanoma with the supplied depth. In this clinically node-negative setting, sentinel-node staging should be discussed with definitive excision planning; sampling an arbitrary benign-appearing node or relying on surveillance does not supply equivalent sentinel staging."
    }
  },
  {
    "id": "revision.qq20261102b.b12-context",
    "auditId": "B12-context",
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r3",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
    "previousChoiceLabels": [
      "Elliptical sampling of the lesion through the dermis into subcutaneous fat",
      "Punch sampling of the darkest focus through the dermis into subcutaneous fat",
      "Tangential sampling of the lesion across its surface and papillary dermis"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_4": "excisional_4",
      "choice.qq20261102b.b12-context.d1": "choice.qq20261102a.b12-context.d1",
      "choice.qq20261102b.b12-context.d2": "choice.qq20261102a.b12-context.d2"
    },
    "choiceServiceOverrides": {
      "excisional_4": "service.skin_excisional_biopsy",
      "choice.qq20261102b.b12-context.d1": null,
      "choice.qq20261102b.b12-context.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B12-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Cue response: This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria. Specify complete removal and a concrete closure examination; 'elliptical sampling' no longer stands in for whole-lesion excision."
        ],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
          "fairness 2: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 3: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Revision/preservation: Specify complete removal and a concrete closure examination; 'elliptical sampling' no longer stands in for whole-lesion excision. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 5: Revision/preservation: Remove the B12 sentence explicitly saying the darkest area is not the thickest. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 6: Preserve the earlier positive repair while applying: Specify complete removal and a concrete closure examination; 'elliptical sampling' no longer stands in for whole-lesion excision.",
          "fairness 7: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
          "fairness 8: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 9: Preserve the earlier positive repair while applying: Specify complete removal and a concrete closure examination; 'elliptical sampling' no longer stands in for whole-lesion excision.",
          "fairness 10: Preserve the earlier positive repair while applying: Remove the B12 sentence explicitly saying the darkest area is not the thickest.",
          "fairness 11: Revision/preservation: Remove the B12 sentence explicitly saying the darkest area is not the thickest. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 12: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
          "fairness 13: Preserve the earlier positive repair while applying: Remove the B12 sentence explicitly saying the darkest area is not the thickest."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "suggestions 2: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations.",
        "closestDistractor": "Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r4",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "stem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
      "answerChoices": [
        {
          "id": "excisional_4",
          "label": "Entire-lesion excision with narrow margin into subcutaneous fat",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides whole-lesion architecture and adequate depth when the stated site/closure findings permit diagnostic excision."
        },
        {
          "id": "choice.qq20261102b.b12-context.d1",
          "label": "Punch biopsy of the darkest pigmented focus into subcutaneous fat",
          "isCorrect": false,
          "distractorRationale": "Provides depth at one focus but can miss relevant architecture or a different invasive focus elsewhere."
        },
        {
          "id": "choice.qq20261102b.b12-context.d2",
          "label": "Punch biopsy of the most elevated focus into subcutaneous fat",
          "isCorrect": false,
          "distractorRationale": "Targets a plausible invasive focus but does not assess the whole small lesion when complete diagnostic excision is feasible."
        }
      ],
      "explanation": "A narrow diagnostic excision of the entire small lesion into subcutaneous fat provides architecture and depth for assessment. Either full-depth focal punch can miss a different relevant component. This does not make focal sampling inappropriate for every large or anatomically constrained lesion; the supplied closure examination defines the represented feasible diagnostic excision.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling"
      ],
      "teachingPoint": "A narrow diagnostic excision of the entire small lesion into subcutaneous fat provides architecture and depth for assessment. Either full-depth focal punch can miss a different relevant component. This does not make focal sampling inappropriate for every large or anatomically constrained lesion; the supplied closure examination defines the represented feasible diagnostic excision."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with a changing pigmented lesion on the upper arm. The lesion has an irregular border with darker and lighter areas. On examination, the surrounding lax skin can be brought together around the entire lesion without tension.",
    "previousPresentation": "{patientName}, a 67-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. Two areas have different colors and an irregular border; the darker focus is not the thickest-looking focus.",
    "previousProfilePresentations": [
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.female.67",
        "presentation": "{patientName}, a 67-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. Two areas have different colors and an irregular border; the darker focus is not the thickest-looking focus."
      },
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.male.67",
        "presentation": "{patientName}, a 67-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. Two areas have different colors and an irregular border; the darker focus is not the thickest-looking focus."
      },
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.female.72",
        "presentation": "{patientName}, a 72-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. Two areas have different colors and an irregular border; the darker focus is not the thickest-looking focus."
      },
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.male.72",
        "presentation": "{patientName}, a 72-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. Two areas have different colors and an irregular border; the darker focus is not the thickest-looking focus."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.pigmented-skin-lesion.forearm-change",
        "patientPresentationVariantId": "presentation.pigmented-skin-lesion.forearm-change",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Changing skin spot",
        "revisedPresentation": "{patientName}, a 67-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. Two areas have different colors and an irregular border; the darker focus is not the thickest-looking focus.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.forearm-change.female.67",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.forearm-change.female.67",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 67-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. Two areas have different colors and an irregular border; the darker focus is not the thickest-looking focus.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.forearm-change.male.67",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.forearm-change.male.67",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 67-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. Two areas have different colors and an irregular border; the darker focus is not the thickest-looking focus.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.forearm-change.female.72",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.forearm-change.female.72",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 72-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. Two areas have different colors and an irregular border; the darker focus is not the thickest-looking focus.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.forearm-change.male.72",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.forearm-change.male.72",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 72-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. Two areas have different colors and an irregular border; the darker focus is not the thickest-looking focus.",
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
      "idPrefix": "ppr.qq20261102b.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v6"
    }
  },
  {
    "id": "revision.qq20261102b.b13-context",
    "auditId": "B13-context",
    "caseId": "case.colon-cancer.right-colon-referral",
    "nodeId": "node.colon-cancer.right-colon-referral.1",
    "previousQuestionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v1.r3",
    "questionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which staging pathway should precede further treatment planning for {patientName}?",
    "previousChoiceLabels": [
      "Chest CT with contrast-enhanced abdominal and pelvic CT",
      "Chest radiographs with contrast-enhanced abdominal and pelvic CT",
      "Whole-body FDG PET-CT with regional anatomic review"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the actual prior coverage/protocol rather than the reassuring report summary or the name of a high-technology examination. Then Complete the standard distant assessment without redundant organ testing or routine PET substitution.",
    "reviewerNotes": "Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_cap_1": "ct_cap_1",
      "choice.qq20261102b.b13-context.d1": "choice.qq20261102a.b13-context.d1",
      "choice.qq20261102b.b13-context.d2": "choice.qq20261102a.b13-context.d2"
    },
    "choiceServiceOverrides": {
      "ct_cap_1": "service.ct",
      "choice.qq20261102b.b13-context.d1": null,
      "choice.qq20261102b.b13-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_cap_1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102b.b13-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102b.b13-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pet_ct"
      }
    },
    "currentUpdate": "The current outside CT covers the lung bases through the pelvis with intravenous contrast. The liver and peritoneal surfaces are described, and no distant deposits are reported. A separate chest radiograph shows no focal opacity.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v1.r3",
      "whatChanged": "Add a concrete prior study whose acquisition/coverage must be interpreted, and replace rote complete-bundle recall with a completion decision. Preserve shared presentation and the retained CT gate.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B13-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Application revision: Interpret the actual prior coverage/protocol rather than the reassuring report summary or the name of a high-technology examination. Then Complete the standard distant assessment without redundant organ testing or routine PET substitution. Closest error: Treating a normal chest radiograph plus imaged lung bases as completed thoracic staging.",
          "fairness 2: Fairness response: The scan starts at the lung bases, and the separate thoracic study is radiography. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed. Clinical boundary: Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
          "fairness 3: Revision/preservation: Distinguish staging completion from the entirety of preoperative evaluation; preserve the passed later node and do not import its future CT result. Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan.",
          "fairness 4: Preserve the earlier positive repair while applying: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging.",
          "fairness 5: Preserve the earlier positive repair while applying: Distinguish staging completion from the entirety of preoperative evaluation; preserve the passed later node and do not import its future CT result.",
          "fairness 6: Preserve the earlier positive repair while applying: Supply prior-study acquisition and coverage rather than another adverse-histology variant of the same first-staging question.",
          "fairness 7: Preserve the earlier positive repair while applying: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging.",
          "fairness 8: Fairness response: The scan starts at the lung bases, and the separate thoracic study is radiography. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed. Clinical boundary: Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
          "fairness 9: Preserve the earlier positive repair while applying: Supply prior-study acquisition and coverage rather than another adverse-histology variant of the same first-staging question.",
          "fairness 10: Preserve the earlier positive repair while applying: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging.",
          "fairness 11: Revision/preservation: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging. Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan.",
          "fairness 12: Revision/preservation: Distinguish staging completion from the entirety of preoperative evaluation; preserve the passed later node and do not import its future CT result. Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: The scan starts at the lung bases, and the separate thoracic study is radiography. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed. Clinical boundary: Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
          "suggestions 2: Action: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging."
        ]
      },
      "selfCheck": {
        "cueAttack": "Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the actual prior coverage/protocol rather than the reassuring report summary or the name of a high-technology examination.",
          "Complete the standard distant assessment without redundant organ testing or routine PET substitution."
        ],
        "oneBestAnswer": "The scan starts at the lung bases, and the separate thoracic study is radiography. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed.",
        "closestDistractor": "Treating a normal chest radiograph plus imaged lung bases as completed thoracic staging.",
        "remainingReview": "Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.preoperative-cross-sectional-staging.v1.r4",
      "conceptId": "concept.colon-cancer.preoperative-cross-sectional-staging",
      "stem": "Which imaging plan should complete {patientName}'s pretreatment assessment?",
      "answerChoices": [
        {
          "id": "ct_cap_1",
          "label": "Thoracic CT to complete the existing cross-sectional staging",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Completes the unassessed thorax rather than treating lung bases/chest radiography as full thoracic CT."
        },
        {
          "id": "choice.qq20261102b.b13-context.d1",
          "label": "Hepatic MRI to complete the existing cross-sectional staging",
          "isCorrect": false,
          "distractorRationale": "Adds liver characterization despite no indeterminate lesion and leaves the thoracic staging gap."
        },
        {
          "id": "choice.qq20261102b.b13-context.d2",
          "label": "Whole-body FDG PET-CT to replace the existing staging pathway",
          "isCorrect": false,
          "distractorRationale": "Escalates to routine metabolic staging rather than completing the standard anatomic assessment."
        }
      ],
      "explanation": "Read both the coverage and acquisition of the prior study. Standard colon-cancer distant staging includes thoracic CT and adequate contrast-enhanced abdominal/pelvic assessment; a negative radiograph, organ ultrasound or PET uptake/localization report does not automatically supply that assessment. MRI is a legitimate abdominal alternative in appropriate pathways, not inherently a wrong test.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.preoperative-cross-sectional-staging",
        "claim.qq20261102a.colon-systemic-staging",
        "claim.qq20261102b.colon-staging-coverage",
        "claim.qq20261102b.colon-pet-not-routine-substitute"
      ],
      "teachingPoint": "Read both the coverage and acquisition of the prior study. Standard colon-cancer distant staging includes thoracic CT and adequate contrast-enhanced abdominal/pelvic assessment; a negative radiograph, organ ultrasound or PET uptake/localization report does not automatically supply that assessment. MRI is a legitimate abdominal alternative in appropriate pathways, not inherently a wrong test."
    }
  },
  {
    "id": "revision.qq20261102b.b14-context",
    "auditId": "B14-context",
    "caseId": "case.colon-cancer.sigmoid-referral",
    "nodeId": "node.colon-cancer.sigmoid-referral.1",
    "previousQuestionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v2.r3",
    "questionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v2.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which staging pathway should precede further treatment planning for {patientName}?",
    "previousChoiceLabels": [
      "Chest CT with contrast-enhanced abdominal and pelvic CT",
      "Chest radiographs with contrast-enhanced abdominal and pelvic CT",
      "Whole-body FDG PET-CT with regional anatomic review"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the actual prior coverage/protocol rather than the reassuring report summary or the name of a high-technology examination. Then Complete the standard distant assessment without redundant organ testing or routine PET substitution.",
    "reviewerNotes": "Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_cap_2": "ct_cap_2",
      "choice.qq20261102b.b14-context.d1": "choice.qq20261102a.b14-context.d1",
      "choice.qq20261102b.b14-context.d2": "choice.qq20261102a.b14-context.d2"
    },
    "choiceServiceOverrides": {
      "ct_cap_2": "service.ct",
      "choice.qq20261102b.b14-context.d1": null,
      "choice.qq20261102b.b14-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_cap_2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102b.b14-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qq20261102b.b14-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pet_ct"
      }
    },
    "currentUpdate": "The current outside studies include a chest CT and an abdominal/pelvic CT acquired without intravenous contrast for renal colic. The abdominal report describes urinary calculi and bowel gas; it contains no contrast-enhancement series.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v2.r3",
      "whatChanged": "Add a concrete prior study whose acquisition/coverage must be interpreted, and replace rote complete-bundle recall with a completion decision. Preserve shared presentation and the retained CT gate.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B14-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Application revision: Interpret the actual prior coverage/protocol rather than the reassuring report summary or the name of a high-technology examination. Then Complete the standard distant assessment without redundant organ testing or routine PET substitution. Closest error: Treating a CT label from another protocol as equivalent distant staging or reflexively substituting PET.",
          "fairness 2: Fairness response: The prior abdominal/pelvic CT is a renal-colic acquisition without intravenous enhancement, while the thorax already has CT coverage. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed. Clinical boundary: Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
          "fairness 3: Revision/preservation: Distinguish staging completion from the entirety of preoperative evaluation; preserve the passed later node and do not import its future CT result. Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan.",
          "fairness 4: Preserve the earlier positive repair while applying: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging.",
          "fairness 5: Preserve the earlier positive repair while applying: Distinguish staging completion from the entirety of preoperative evaluation; preserve the passed later node and do not import its future CT result.",
          "fairness 6: Preserve the earlier positive repair while applying: Supply prior-study acquisition and coverage rather than another adverse-histology variant of the same first-staging question.",
          "fairness 7: Preserve the earlier positive repair while applying: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging.",
          "fairness 8: Fairness response: The prior abdominal/pelvic CT is a renal-colic acquisition without intravenous enhancement, while the thorax already has CT coverage. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed. Clinical boundary: Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
          "fairness 9: Preserve the earlier positive repair while applying: Supply prior-study acquisition and coverage rather than another adverse-histology variant of the same first-staging question.",
          "fairness 10: Preserve the earlier positive repair while applying: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging.",
          "fairness 11: Revision/preservation: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging. Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan.",
          "fairness 12: Revision/preservation: Distinguish staging completion from the entirety of preoperative evaluation; preserve the passed later node and do not import its future CT result. Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: The prior abdominal/pelvic CT is a renal-colic acquisition without intravenous enhancement, while the thorax already has CT coverage. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed. Clinical boundary: Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
          "suggestions 2: Action: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging."
        ]
      },
      "selfCheck": {
        "cueAttack": "Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the actual prior coverage/protocol rather than the reassuring report summary or the name of a high-technology examination.",
          "Complete the standard distant assessment without redundant organ testing or routine PET substitution."
        ],
        "oneBestAnswer": "The prior abdominal/pelvic CT is a renal-colic acquisition without intravenous enhancement, while the thorax already has CT coverage. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed.",
        "closestDistractor": "Treating a CT label from another protocol as equivalent distant staging or reflexively substituting PET.",
        "remainingReview": "Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.preoperative-cross-sectional-staging.v2.r4",
      "conceptId": "concept.colon-cancer.preoperative-cross-sectional-staging",
      "stem": "Which imaging plan should complete {patientName}'s pretreatment assessment?",
      "answerChoices": [
        {
          "id": "ct_cap_2",
          "label": "IV-contrast abdominopelvic CT with the existing chest CT",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Supplies the still-needed enhancement assessment while retaining adequate thoracic coverage."
        },
        {
          "id": "choice.qq20261102b.b14-context.d1",
          "label": "Abdominal and pelvic ultrasound with the existing chest CT",
          "isCorrect": false,
          "distractorRationale": "Mistakes a broad sonographic survey for the standard cross-sectional distant staging pathway."
        },
        {
          "id": "choice.qq20261102b.b14-context.d2",
          "label": "Whole-body FDG PET-CT with the existing chest CT",
          "isCorrect": false,
          "distractorRationale": "Uses routine metabolic staging as a replacement for the missing contrast-enhanced abdominal/pelvic assessment."
        }
      ],
      "explanation": "Read both the coverage and acquisition of the prior study. Standard colon-cancer distant staging includes thoracic CT and adequate contrast-enhanced abdominal/pelvic assessment; a negative radiograph, organ ultrasound or PET uptake/localization report does not automatically supply that assessment. MRI is a legitimate abdominal alternative in appropriate pathways, not inherently a wrong test.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.preoperative-cross-sectional-staging",
        "claim.qq20261102a.colon-systemic-staging",
        "claim.qq20261102b.colon-staging-coverage",
        "claim.qq20261102b.colon-pet-not-routine-substitute"
      ],
      "teachingPoint": "Read both the coverage and acquisition of the prior study. Standard colon-cancer distant staging includes thoracic CT and adequate contrast-enhanced abdominal/pelvic assessment; a negative radiograph, organ ultrasound or PET uptake/localization report does not automatically supply that assessment. MRI is a legitimate abdominal alternative in appropriate pathways, not inherently a wrong test."
    }
  },
  {
    "id": "revision.qq20261102b.b15",
    "auditId": "B15",
    "caseId": "case.colon-cancer.transverse-referral",
    "nodeId": "node.colon-cancer.transverse-referral.2",
    "previousQuestionVariantId": "question.colon-cancer.oncologic-regional-resection.v3.r3",
    "questionVariantId": "question.colon-cancer.oncologic-regional-resection.v3.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which treatment plan should be discussed for {patientName}'s resection site?",
    "previousChoiceLabels": [
      "Segmental colectomy with removal of the draining mesentery",
      "Endoscopic full-thickness excision centered on the resection scar",
      "Endoscopic scar surveillance with repeat targeted tissue sampling"
    ],
    "previousCurrentUpdate": "Staging CT shows no distant deposits and no enlarged regional nodes.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the involved deep edge and unmeasurable invasive front alongside favorable grade/no identified LVI, rather than treating those favorable findings as complete low-risk criteria. Then Distinguish completion of local wall treatment from a regional oncologic treatment plan in a surgically suitable patient.",
    "reviewerNotes": "Melissa/colorectal review must confirm the exact pathology and surgical plan. The recommendation is a best planning pathway, not a claim that every patient with a positive margin must undergo the same operation regardless of risk or preferences.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "regional_resection_3": "regional_resection_3",
      "choice.qq20261102b.b15.d1": "choice.qq20261102a.b15.d1",
      "choice.qq20261102b.b15.d2": "choice.qq20261102a.b15.d2"
    },
    "choiceServiceOverrides": {
      "regional_resection_3": null,
      "choice.qq20261102b.b15.d1": null,
      "choice.qq20261102b.b15.d2": null
    },
    "currentUpdate": "Staging CT shows no distant deposits and no enlarged regional nodes. Preoperative assessment finds the patient suitable for elective colon surgery.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colon-cancer.oncologic-regional-resection.v3.r3",
      "whatChanged": "Supply the missing grade/depth/clearance and fitness observations, retain favorable findings rather than invent another adverse feature, and keep the answer at broad regional-treatment scope.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B15",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Application revision: Interpret the involved deep edge and unmeasurable invasive front alongside favorable grade/no identified LVI, rather than treating those favorable findings as complete low-risk criteria. Then Distinguish completion of local wall treatment from a regional oncologic treatment plan in a surgically suitable patient. Closest error: Full-thickness scar excision is attractive for local clearance, particularly with moderate grade and no identified LVI, but does not supply the regional treatment recommended for this represented invasive-margin problem.",
          "fairness 2: Revision/preservation: Supply operative suitability and retain the credible full-thickness local-completion competitor. No new lymphovascular invasion or poor grade is added to force surgery. The task/key no longer prescribe a specific transverse segment operation; the closest endoscopic alternative remains genuine.",
          "fairness 3: Fairness response: ASCRS generally warrants oncologic regional resection for a positive/indeterminate malignant-polyp margin. The case now specifies clearance/depth limitation and operative fitness rather than requiring hidden assumptions. Clinical boundary: Melissa/colorectal review must confirm the exact pathology and surgical plan. The recommendation is a best planning pathway, not a claim that every patient with a positive margin must undergo the same operation regardless of risk or preferences.",
          "fairness 4: Preserve the earlier positive repair while applying: Supply operative suitability and retain the credible full-thickness local-completion competitor.",
          "fairness 5: Preserve the earlier positive repair while applying: Replace a potentially overprecise segmental transverse operation with broad colon-plus-regional-drainage planning; normal CT nodes remain a deliberate false reassurance.",
          "fairness 6: Preserve the earlier positive repair while applying: Specify moderate grade, the transected deepest front and unmeasurable depth, with no invented additional LVI or poor differentiation.",
          "fairness 7: Preserve the earlier positive repair while applying: Supply operative suitability and retain the credible full-thickness local-completion competitor.",
          "fairness 8: Fairness response: ASCRS generally warrants oncologic regional resection for a positive/indeterminate malignant-polyp margin. The case now specifies clearance/depth limitation and operative fitness rather than requiring hidden assumptions. Clinical boundary: Melissa/colorectal review must confirm the exact pathology and surgical plan. The recommendation is a best planning pathway, not a claim that every patient with a positive margin must undergo the same operation regardless of risk or preferences.",
          "fairness 9: Preserve the earlier positive repair while applying: Specify moderate grade, the transected deepest front and unmeasurable depth, with no invented additional LVI or poor differentiation.",
          "fairness 10: Preserve the earlier positive repair while applying: Supply operative suitability and retain the credible full-thickness local-completion competitor.",
          "fairness 11: Preserve the earlier positive repair while applying: Replace a potentially overprecise segmental transverse operation with broad colon-plus-regional-drainage planning; normal CT nodes remain a deliberate false reassurance."
        ],
        "suggestions": [
          "suggestions 1: Action: Specify moderate grade, the transected deepest front and unmeasurable depth, with no invented additional LVI or poor differentiation.",
          "suggestions 2: Fairness response: ASCRS generally warrants oncologic regional resection for a positive/indeterminate malignant-polyp margin. The case now specifies clearance/depth limitation and operative fitness rather than requiring hidden assumptions. Clinical boundary: Melissa/colorectal review must confirm the exact pathology and surgical plan. The recommendation is a best planning pathway, not a claim that every patient with a positive margin must undergo the same operation regardless of risk or preferences."
        ]
      },
      "selfCheck": {
        "cueAttack": "No new lymphovascular invasion or poor grade is added to force surgery. The task/key no longer prescribe a specific transverse segment operation; the closest endoscopic alternative remains genuine.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the involved deep edge and unmeasurable invasive front alongside favorable grade/no identified LVI, rather than treating those favorable findings as complete low-risk criteria.",
          "Distinguish completion of local wall treatment from a regional oncologic treatment plan in a surgically suitable patient."
        ],
        "oneBestAnswer": "ASCRS generally warrants oncologic regional resection for a positive/indeterminate malignant-polyp margin. The case now specifies clearance/depth limitation and operative fitness rather than requiring hidden assumptions.",
        "closestDistractor": "Full-thickness scar excision is attractive for local clearance, particularly with moderate grade and no identified LVI, but does not supply the regional treatment recommended for this represented invasive-margin problem.",
        "remainingReview": "Melissa/colorectal review must confirm the exact pathology and surgical plan. The recommendation is a best planning pathway, not a claim that every patient with a positive margin must undergo the same operation regardless of risk or preferences."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.oncologic-regional-resection.v3.r4",
      "conceptId": "concept.colon-cancer.oncologic-regional-resection",
      "stem": "Which broad treatment plan should be discussed with {patientName}?",
      "answerChoices": [
        {
          "id": "regional_resection_3",
          "label": "Resection of the involved colon with its regional lymphatic drainage",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Addresses incompletely assessed invasive disease and regional risk after a malignant polyp with an involved deep margin, despite a clear scar and normal-size CT nodes."
        },
        {
          "id": "choice.qq20261102b.b15.d1",
          "label": "Endoscopic full-thickness removal of the colon scar and local wall",
          "isCorrect": false,
          "distractorRationale": "Could improve local wall assessment, but is not the preferred substitute for oncologic regional resection in this fit patient with involved/indeterminate invasive clearance."
        },
        {
          "id": "choice.qq20261102b.b15.d2",
          "label": "Endoscopic colon scar surveillance with targeted mucosal tissue sampling",
          "isCorrect": false,
          "distractorRationale": "Mistakes a scar and reassuring CT for proof of local invasive clearance and microscopic node negativity."
        }
      ],
      "explanation": "The deep invasive front is transected and local depth/clearance cannot be adequately assessed. In a surgically suitable patient, this is not the low-risk, completely excised malignant-polyp group. Discuss oncologic resection including regional lymphatic drainage; neither a clear scar nor normal-size CT nodes establishes clearance. This is a broad planning choice, not specification of the exact transverse-colon operation.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.oncologic-regional-resection",
        "claim.qq20261102a.malignant-polyp-adverse-features",
        "claim.qq20261102b.malignant-polyp-positive-margin"
      ],
      "teachingPoint": "The deep invasive front is transected and local depth/clearance cannot be adequately assessed. In a surgically suitable patient, this is not the low-risk, completely excised malignant-polyp group. Discuss oncologic resection including regional lymphatic drainage; neither a clear scar nor normal-size CT nodes establishes clearance. This is a broad planning choice, not specification of the exact transverse-colon operation."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after endoscopic removal of a polyp in the transverse colon. The site now appears as a scar. Moderately differentiated malignant glands extend through the muscularis mucosae into submucosa and reach the cauterized deep edge. The pathology report lists invasion depth as not measurable. No lymphovascular invasion is identified in the sampled sections.",
    "previousPresentation": "{patientName}, a 54-year-old woman, visits the clinic after endoscopic removal of a polyp in the transverse colon. The site now appears as a scar. Invasive malignant glands reach the cauterized deep resection edge.",
    "previousProfilePresentations": [
      {
        "id": "profile.colon-cancer.transverse-referral.female.54",
        "presentation": "{patientName}, a 54-year-old woman, visits the clinic after endoscopic removal of a polyp in the transverse colon. The site now appears as a scar. Invasive malignant glands reach the cauterized deep resection edge."
      },
      {
        "id": "profile.colon-cancer.transverse-referral.male.54",
        "presentation": "{patientName}, a 54-year-old man, visits the clinic after endoscopic removal of a polyp in the transverse colon. The site now appears as a scar. Invasive malignant glands reach the cauterized deep resection edge."
      },
      {
        "id": "profile.colon-cancer.transverse-referral.female.59",
        "presentation": "{patientName}, a 59-year-old woman, visits the clinic after endoscopic removal of a polyp in the transverse colon. The site now appears as a scar. Invasive malignant glands reach the cauterized deep resection edge."
      },
      {
        "id": "profile.colon-cancer.transverse-referral.male.59",
        "presentation": "{patientName}, a 59-year-old man, visits the clinic after endoscopic removal of a polyp in the transverse colon. The site now appears as a scar. Invasive malignant glands reach the cauterized deep resection edge."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.colon-cancer.transverse-referral",
        "patientPresentationVariantId": "presentation.colon-cancer.transverse-referral",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Polyp pathology review",
        "revisedPresentation": "{patientName}, a 54-year-old woman, visits the clinic after endoscopic removal of a polyp in the transverse colon. The site now appears as a scar. Invasive malignant glands reach the cauterized deep resection edge.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102a.profile.colon-cancer.transverse-referral.female.54",
            "approvedInstantiationProfileId": "profile.colon-cancer.transverse-referral.female.54",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 54-year-old woman, visits the clinic after endoscopic removal of a polyp in the transverse colon. The site now appears as a scar. Invasive malignant glands reach the cauterized deep resection edge.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.colon-cancer.transverse-referral.male.54",
            "approvedInstantiationProfileId": "profile.colon-cancer.transverse-referral.male.54",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 54-year-old man, visits the clinic after endoscopic removal of a polyp in the transverse colon. The site now appears as a scar. Invasive malignant glands reach the cauterized deep resection edge.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.colon-cancer.transverse-referral.female.59",
            "approvedInstantiationProfileId": "profile.colon-cancer.transverse-referral.female.59",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 59-year-old woman, visits the clinic after endoscopic removal of a polyp in the transverse colon. The site now appears as a scar. Invasive malignant glands reach the cauterized deep resection edge.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.colon-cancer.transverse-referral.male.59",
            "approvedInstantiationProfileId": "profile.colon-cancer.transverse-referral.male.59",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 59-year-old man, visits the clinic after endoscopic removal of a polyp in the transverse colon. The site now appears as a scar. Invasive malignant glands reach the cauterized deep resection edge.",
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
        "ageYears": 54,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102b.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v6"
    }
  },
  {
    "id": "revision.qq20261102b.b15-context",
    "auditId": "B15-context",
    "caseId": "case.colon-cancer.transverse-referral",
    "nodeId": "node.colon-cancer.transverse-referral.1",
    "previousQuestionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v3.r3",
    "questionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v3.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which staging pathway should precede further treatment planning for {patientName}?",
    "previousChoiceLabels": [
      "Chest CT with contrast-enhanced abdominal and pelvic CT",
      "Chest radiographs with contrast-enhanced abdominal and pelvic CT",
      "Whole-body FDG PET-CT with regional anatomic review"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the actual prior coverage/protocol rather than the reassuring report summary or the name of a high-technology examination. Then Complete the standard distant assessment without redundant organ testing or routine PET substitution.",
    "reviewerNotes": "Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_cap_3": "ct_cap_3",
      "choice.qq20261102b.b15-context.d1": "choice.qq20261102a.b15-context.d1",
      "choice.qq20261102b.b15-context.d2": "choice.qq20261102a.b15-context.d2"
    },
    "choiceServiceOverrides": {
      "ct_cap_3": "service.ct",
      "choice.qq20261102b.b15-context.d1": null,
      "choice.qq20261102b.b15-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_cap_3": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102b.b15-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102b.b15-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pet_ct"
      }
    },
    "currentUpdate": "The current outside assessment includes a chest radiograph and abdominal ultrasound. The reports describe no focal lung opacity, no focal hepatic mass and no ascites.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v3.r3",
      "whatChanged": "Add a concrete prior study whose acquisition/coverage must be interpreted, and replace rote complete-bundle recall with a completion decision. Preserve shared presentation and the retained CT gate.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B15-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Application revision: Interpret the actual prior coverage/protocol rather than the reassuring report summary or the name of a high-technology examination. Then Complete the standard distant assessment without redundant organ testing or routine PET substitution. Closest error: Accepting preliminary negative organ surveys or treating any high-technology body scan as the standard staging pathway.",
          "fairness 2: Fairness response: The apparently reassuring preliminary studies are a chest radiograph and abdominal ultrasound, not completed cross-sectional staging. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed. Clinical boundary: Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
          "fairness 3: Revision/preservation: Distinguish staging completion from the entirety of preoperative evaluation; preserve the passed later node and do not import its future CT result. Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan.",
          "fairness 4: Preserve the earlier positive repair while applying: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging.",
          "fairness 5: Preserve the earlier positive repair while applying: Distinguish staging completion from the entirety of preoperative evaluation; preserve the passed later node and do not import its future CT result.",
          "fairness 6: Preserve the earlier positive repair while applying: Supply prior-study acquisition and coverage rather than another adverse-histology variant of the same first-staging question.",
          "fairness 7: Preserve the earlier positive repair while applying: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging.",
          "fairness 8: Fairness response: The apparently reassuring preliminary studies are a chest radiograph and abdominal ultrasound, not completed cross-sectional staging. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed. Clinical boundary: Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
          "fairness 9: Preserve the earlier positive repair while applying: Supply prior-study acquisition and coverage rather than another adverse-histology variant of the same first-staging question.",
          "fairness 10: Preserve the earlier positive repair while applying: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging.",
          "fairness 11: Revision/preservation: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging. Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan.",
          "fairness 12: Revision/preservation: Distinguish staging completion from the entirety of preoperative evaluation; preserve the passed later node and do not import its future CT result. Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: The apparently reassuring preliminary studies are a chest radiograph and abdominal ultrasound, not completed cross-sectional staging. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed. Clinical boundary: Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
          "suggestions 2: Action: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging."
        ]
      },
      "selfCheck": {
        "cueAttack": "Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the actual prior coverage/protocol rather than the reassuring report summary or the name of a high-technology examination.",
          "Complete the standard distant assessment without redundant organ testing or routine PET substitution."
        ],
        "oneBestAnswer": "The apparently reassuring preliminary studies are a chest radiograph and abdominal ultrasound, not completed cross-sectional staging. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed.",
        "closestDistractor": "Accepting preliminary negative organ surveys or treating any high-technology body scan as the standard staging pathway.",
        "remainingReview": "Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.preoperative-cross-sectional-staging.v3.r4",
      "conceptId": "concept.colon-cancer.preoperative-cross-sectional-staging",
      "stem": "Which imaging plan should complete {patientName}'s pretreatment assessment?",
      "answerChoices": [
        {
          "id": "ct_cap_3",
          "label": "Chest CT with intravenous-contrast abdominal and pelvic CT",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Obtains the standard cross-sectional staging despite reassuring lower-sensitivity preliminary studies."
        },
        {
          "id": "choice.qq20261102b.b15-context.d1",
          "label": "Abdominal and pelvic MRI with the current chest radiograph",
          "isCorrect": false,
          "distractorRationale": "Offers valid abdominal cross-sectional imaging but retains radiography rather than adequate thoracic staging."
        },
        {
          "id": "choice.qq20261102b.b15-context.d2",
          "label": "Whole-body FDG PET-CT with the current chest radiograph",
          "isCorrect": false,
          "distractorRationale": "Substitutes routine metabolic imaging for the standard anatomic pathway without an established metastatic decision problem."
        }
      ],
      "explanation": "Read both the coverage and acquisition of the prior study. Standard colon-cancer distant staging includes thoracic CT and adequate contrast-enhanced abdominal/pelvic assessment; a negative radiograph, organ ultrasound or PET uptake/localization report does not automatically supply that assessment. MRI is a legitimate abdominal alternative in appropriate pathways, not inherently a wrong test.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.preoperative-cross-sectional-staging",
        "claim.qq20261102a.colon-systemic-staging",
        "claim.qq20261102b.colon-staging-coverage",
        "claim.qq20261102b.colon-pet-not-routine-substitute"
      ],
      "teachingPoint": "Read both the coverage and acquisition of the prior study. Standard colon-cancer distant staging includes thoracic CT and adequate contrast-enhanced abdominal/pelvic assessment; a negative radiograph, organ ultrasound or PET uptake/localization report does not automatically supply that assessment. MRI is a legitimate abdominal alternative in appropriate pathways, not inherently a wrong test."
    }
  },
  {
    "id": "revision.qq20261102b.b16-context",
    "auditId": "B16-context",
    "caseId": "case.colon-cancer.descending-referral",
    "nodeId": "node.colon-cancer.descending-referral.1",
    "previousQuestionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v4.r3",
    "questionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which staging pathway should precede further treatment planning for {patientName}?",
    "previousChoiceLabels": [
      "Chest CT with contrast-enhanced abdominal and pelvic CT",
      "Chest radiographs with contrast-enhanced abdominal and pelvic CT",
      "Whole-body FDG PET-CT with regional anatomic review"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the actual prior coverage/protocol rather than the reassuring report summary or the name of a high-technology examination. Then Complete the standard distant assessment without redundant organ testing or routine PET substitution.",
    "reviewerNotes": "Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_cap_4": "ct_cap_4",
      "choice.qq20261102b.b16-context.d1": "choice.qq20261102a.b16-context.d1",
      "choice.qq20261102b.b16-context.d2": "choice.qq20261102a.b16-context.d2"
    },
    "choiceServiceOverrides": {
      "ct_cap_4": "service.ct",
      "choice.qq20261102b.b16-context.d1": null,
      "choice.qq20261102b.b16-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_cap_4": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102b.b16-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.pet_ct"
      },
      "choice.qq20261102b.b16-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "currentUpdate": "An outside FDG PET study reports no distant focus of increased uptake. Its CT component is a low-dose acquisition without intravenous contrast, used for attenuation correction and localization.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v4.r3",
      "whatChanged": "Add a concrete prior study whose acquisition/coverage must be interpreted, and replace rote complete-bundle recall with a completion decision. Preserve shared presentation and the retained CT gate.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B16-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Application revision: Interpret the actual prior coverage/protocol rather than the reassuring report summary or the name of a high-technology examination. Then Complete the standard distant assessment without redundant organ testing or routine PET substitution. Closest error: Accepting 'negative PET-CT' as completed conventional preoperative staging without reading its CT protocol.",
          "fairness 2: Fairness response: The existing CT is explicitly a low-dose noncontrast localization acquisition, not diagnostic contrast staging. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed. Clinical boundary: Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
          "fairness 3: Revision/preservation: Distinguish staging completion from the entirety of preoperative evaluation; preserve the passed later node and do not import its future CT result. Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan.",
          "fairness 4: Preserve the earlier positive repair while applying: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging.",
          "fairness 5: Preserve the earlier positive repair while applying: Distinguish staging completion from the entirety of preoperative evaluation; preserve the passed later node and do not import its future CT result.",
          "fairness 6: Preserve the earlier positive repair while applying: Supply prior-study acquisition and coverage rather than another adverse-histology variant of the same first-staging question.",
          "fairness 7: Preserve the earlier positive repair while applying: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging.",
          "fairness 8: Fairness response: The existing CT is explicitly a low-dose noncontrast localization acquisition, not diagnostic contrast staging. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed. Clinical boundary: Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
          "fairness 9: Preserve the earlier positive repair while applying: Supply prior-study acquisition and coverage rather than another adverse-histology variant of the same first-staging question.",
          "fairness 10: Preserve the earlier positive repair while applying: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging.",
          "fairness 11: Revision/preservation: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging. Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan.",
          "fairness 12: Revision/preservation: Distinguish staging completion from the entirety of preoperative evaluation; preserve the passed later node and do not import its future CT result. Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: The existing CT is explicitly a low-dose noncontrast localization acquisition, not diagnostic contrast staging. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed. Clinical boundary: Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration.",
          "suggestions 2: Action: Keep complete, clinically valid pathways; MRI is not called inadequate when paired with proper thoracic imaging."
        ]
      },
      "selfCheck": {
        "cueAttack": "Keep the passed companion's presentation and after fields untouched. The task does not announce a missing modality; reports give coverage/acquisition facts and every option is an imaging plan.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the actual prior coverage/protocol rather than the reassuring report summary or the name of a high-technology examination.",
          "Complete the standard distant assessment without redundant organ testing or routine PET substitution."
        ],
        "oneBestAnswer": "The existing CT is explicitly a low-dose noncontrast localization acquisition, not diagnostic contrast staging. The keyed plan supplies the missing standard assessment. No contrast contraindication or unexplained indeterminate liver lesion is assumed.",
        "closestDistractor": "Accepting 'negative PET-CT' as completed conventional preoperative staging without reading its CT protocol.",
        "remainingReview": "Melissa/radiology must confirm adequacy/currentness of the previous studies and the requested protocol. A negative scan does not exclude microscopic nodes. Placeholder wait profiles do not assert that different scan types share an actual clinical duration."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.preoperative-cross-sectional-staging.v4.r4",
      "conceptId": "concept.colon-cancer.preoperative-cross-sectional-staging",
      "stem": "Which imaging plan should complete {patientName}'s pretreatment assessment?",
      "answerChoices": [
        {
          "id": "ct_cap_4",
          "label": "Chest CT with intravenous-contrast abdominal and pelvic CT",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides anatomic staging not supplied by a negative PET uptake summary and localization CT."
        },
        {
          "id": "choice.qq20261102b.b16-context.d1",
          "label": "Repeat whole-body FDG PET with low-dose localization CT",
          "isCorrect": false,
          "distractorRationale": "Repeats the same metabolic/localization approach rather than obtaining the missing diagnostic anatomic assessment."
        },
        {
          "id": "choice.qq20261102b.b16-context.d2",
          "label": "Hepatic ultrasound with review of the existing localization CT",
          "isCorrect": false,
          "distractorRationale": "Adds a liver survey but continues to rely on the localization study for the remaining distant assessment."
        }
      ],
      "explanation": "Read both the coverage and acquisition of the prior study. Standard colon-cancer distant staging includes thoracic CT and adequate contrast-enhanced abdominal/pelvic assessment; a negative radiograph, organ ultrasound or PET uptake/localization report does not automatically supply that assessment. MRI is a legitimate abdominal alternative in appropriate pathways, not inherently a wrong test.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.preoperative-cross-sectional-staging",
        "claim.qq20261102a.colon-systemic-staging",
        "claim.qq20261102b.colon-staging-coverage",
        "claim.qq20261102b.colon-pet-not-routine-substitute"
      ],
      "teachingPoint": "Read both the coverage and acquisition of the prior study. Standard colon-cancer distant staging includes thoracic CT and adequate contrast-enhanced abdominal/pelvic assessment; a negative radiograph, organ ultrasound or PET uptake/localization report does not automatically supply that assessment. MRI is a legitimate abdominal alternative in appropriate pathways, not inherently a wrong test."
    }
  },
  {
    "id": "revision.qq20261102b.b17",
    "auditId": "B17",
    "caseId": "case.pigmented-skin-lesion.changing-back-lesion",
    "nodeId": "node.pigmented-skin-lesion.changing-back-lesion.2",
    "previousQuestionVariantId": "question.melanoma.sentinel-node-staging.v1.r3",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which regional-node plan should accompany {patientName}'s further excision planning?",
    "previousChoiceLabels": [
      "Sentinel lymph node mapping and biopsy",
      "Ultrasound-guided biopsy of an imaged regional node",
      "Ultrasound surveillance of the regional nodes"
    ],
    "previousCurrentUpdate": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.4 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret invasion thickness and clinical/sonographic nodal findings to retain the staging indication. Then Coordinate staging with the proposed reconstruction rather than treating staging after wound healing as equivalent.",
    "reviewerNotes": "Melissa must confirm the reconstruction and mapping sequence. The older CCO technical recommendation is corroborated for the staging indication by retained current melanoma evidence; no reliability probability or mandatory operation is asserted.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sentinel_node_1": "sentinel_node_1",
      "choice.qq20261102b.b17.d1": "choice.qq20261102a.b17.d1",
      "choice.qq20261102b.b17.d2": "choice.qq20261102a.b17.d2"
    },
    "choiceServiceOverrides": {
      "sentinel_node_1": null,
      "choice.qq20261102b.b17.d1": null,
      "choice.qq20261102b.b17.d2": null
    },
    "choiceTimingOverrides": {
      "sentinel_node_1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102b.b17.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102b.b17.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "currentUpdate": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.4 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes. The primary-site team has proposed wide local excision followed by a skin graft.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.melanoma.sentinel-node-staging.v1.r3",
      "whatChanged": "Retain the existing thickness and node observations, add a concrete proposed reconstruction, and require a combined staging/sequence plan rather than routine biopsy-versus-surveillance recall.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B17",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Revision/preservation: Use the raw pathology and reassuring ultrasound without re-labelling them as a conclusion. Two plans include sentinel-node biopsy and two complete primary surgery immediately. No option explains lymphatic disruption; the reconstructive method is supplied as a concrete planned procedure, not a safety slogan.",
          "fairness 2: Application revision: Interpret invasion thickness and clinical/sonographic nodal findings to retain the staging indication. Then Coordinate staging with the proposed reconstruction rather than treating staging after wound healing as equivalent. Closest error: Booking wide excision/reconstruction now and arranging the known sentinel procedure after final pathology/wound healing is the intended near miss.",
          "fairness 3: Fairness response: The key preserves both staging and the guideline-preferred sequence before the planned flap/graft. The alternative staging plan is a credible sequencing error, not an implausible procedure. Clinical boundary: Melissa must confirm the reconstruction and mapping sequence. The older CCO technical recommendation is corroborated for the staging indication by retained current melanoma evidence; no reliability probability or mandatory operation is asserted.",
          "fairness 4: Preserve the earlier positive repair while applying: Add a skin graft planning and compare staging now versus after reconstruction as the closest error.",
          "fairness 5: Preserve the earlier positive repair while applying: Vary the actual task across siblings: B11/B17 assess reconstruction timing, while B12/B18 are explicitly basic staging-rule items rather than thickness-only claims of harder variants.",
          "fairness 6: Preserve the earlier positive repair while applying: Use the raw pathology and reassuring ultrasound without re-labelling them as a conclusion.",
          "fairness 7: Fairness response: The key preserves both staging and the guideline-preferred sequence before the planned flap/graft. The alternative staging plan is a credible sequencing error, not an implausible procedure. Clinical boundary: Melissa must confirm the reconstruction and mapping sequence. The older CCO technical recommendation is corroborated for the staging indication by retained current melanoma evidence; no reliability probability or mandatory operation is asserted.",
          "fairness 8: Preserve the earlier positive repair while applying: Vary the actual task across siblings: B11/B17 assess reconstruction timing, while B12/B18 are explicitly basic staging-rule items rather than thickness-only claims of harder variants.",
          "fairness 9: Preserve the earlier positive repair while applying: Use the raw pathology and reassuring ultrasound without re-labelling them as a conclusion.",
          "fairness 10: Revision/preservation: Use the raw pathology and reassuring ultrasound without re-labelling them as a conclusion. Two plans include sentinel-node biopsy and two complete primary surgery immediately. No option explains lymphatic disruption; the reconstructive method is supplied as a concrete planned procedure, not a safety slogan.",
          "fairness 11: Revision/preservation: Add a skin graft planning and compare staging now versus after reconstruction as the closest error. Two plans include sentinel-node biopsy and two complete primary surgery immediately. No option explains lymphatic disruption; the reconstructive method is supplied as a concrete planned procedure, not a safety slogan."
        ],
        "suggestions": [
          "suggestions 1: Application revision: Interpret invasion thickness and clinical/sonographic nodal findings to retain the staging indication. Then Coordinate staging with the proposed reconstruction rather than treating staging after wound healing as equivalent. Closest error: Booking wide excision/reconstruction now and arranging the known sentinel procedure after final pathology/wound healing is the intended near miss.",
          "suggestions 2: Action: Add a skin graft planning and compare staging now versus after reconstruction as the closest error."
        ]
      },
      "selfCheck": {
        "cueAttack": "Two plans include sentinel-node biopsy and two complete primary surgery immediately. No option explains lymphatic disruption; the reconstructive method is supplied as a concrete planned procedure, not a safety slogan.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret invasion thickness and clinical/sonographic nodal findings to retain the staging indication.",
          "Coordinate staging with the proposed reconstruction rather than treating staging after wound healing as equivalent."
        ],
        "oneBestAnswer": "The key preserves both staging and the guideline-preferred sequence before the planned flap/graft. The alternative staging plan is a credible sequencing error, not an implausible procedure.",
        "closestDistractor": "Booking wide excision/reconstruction now and arranging the known sentinel procedure after final pathology/wound healing is the intended near miss.",
        "remainingReview": "Melissa must confirm the reconstruction and mapping sequence. The older CCO technical recommendation is corroborated for the staging indication by retained current melanoma evidence; no reliability probability or mandatory operation is asserted."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.melanoma.sentinel-node-staging.v1.r4",
      "conceptId": "concept.melanoma.sentinel-node-staging",
      "stem": "Which combined primary-site and regional-node plan should be discussed with {patientName}?",
      "answerChoices": [
        {
          "id": "sentinel_node_1",
          "label": "Sentinel-node biopsy with wide excision, before reconstructive closure",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Maintains microscopic nodal staging and coordinates it with excision before the planned reconstruction can alter lymphatic mapping."
        },
        {
          "id": "choice.qq20261102b.b17.d1",
          "label": "Sentinel-node biopsy after wide excision and reconstructive healing",
          "isCorrect": false,
          "distractorRationale": "Recognizes the staging indication but unnecessarily separates it until after a flap or graft can compromise mapping."
        },
        {
          "id": "choice.qq20261102b.b17.d2",
          "label": "Nodal ultrasound surveillance after wide excision and reconstructive closure",
          "isCorrect": false,
          "distractorRationale": "Treats the reassuring sonographic basin as a substitute for indicated microscopic regional staging."
        }
      ],
      "explanation": "Discuss sentinel-node staging for the represented clinically node-negative intermediate-thickness melanoma. Coordinate mapping/biopsy with wide excision before the planned flap or graft reconstruction; a later separate procedure can be less reliable. Reassuring nodal ultrasound does not replace microscopic staging. Final surgical choices remain individualized.",
      "supportingEvidenceClaimIds": [
        "claim.melanoma.sentinel-node-staging",
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-integrated-node-staging",
        "claim.qq20261102b.sentinel-before-reconstruction"
      ],
      "teachingPoint": "Discuss sentinel-node staging for the represented clinically node-negative intermediate-thickness melanoma. Coordinate mapping/biopsy with wide excision before the planned flap or graft reconstruction; a later separate procedure can be less reliable. Reassuring nodal ultrasound does not replace microscopic staging. Final surgical choices remain individualized."
    }
  },
  {
    "id": "revision.qq20261102b.b17-context",
    "auditId": "B17-context",
    "caseId": "case.pigmented-skin-lesion.changing-back-lesion",
    "nodeId": "node.pigmented-skin-lesion.changing-back-lesion.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r3",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
    "previousChoiceLabels": [
      "Elliptical sampling of the lesion through the dermis into subcutaneous fat",
      "Punch sampling of the darkest focus through the dermis into subcutaneous fat",
      "Tangential sampling of the lesion across its surface and papillary dermis"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_1": "excisional_1",
      "choice.qq20261102b.b17-context.d1": "choice.qq20261102a.b17-context.d1",
      "choice.qq20261102b.b17-context.d2": "choice.qq20261102a.b17-context.d2"
    },
    "choiceServiceOverrides": {
      "excisional_1": "service.skin_excisional_biopsy",
      "choice.qq20261102b.b17-context.d1": null,
      "choice.qq20261102b.b17-context.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B17-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Cue response: This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria. Specify complete removal and a concrete closure examination; 'elliptical sampling' no longer stands in for whole-lesion excision."
        ],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
          "fairness 2: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 3: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Revision/preservation: Specify complete removal and a concrete closure examination; 'elliptical sampling' no longer stands in for whole-lesion excision. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 5: Revision/preservation: Remove the B12 sentence explicitly saying the darkest area is not the thickest. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 6: Preserve the earlier positive repair while applying: Specify complete removal and a concrete closure examination; 'elliptical sampling' no longer stands in for whole-lesion excision.",
          "fairness 7: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
          "fairness 8: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 9: Preserve the earlier positive repair while applying: Specify complete removal and a concrete closure examination; 'elliptical sampling' no longer stands in for whole-lesion excision.",
          "fairness 10: Preserve the earlier positive repair while applying: Remove the B12 sentence explicitly saying the darkest area is not the thickest.",
          "fairness 11: Revision/preservation: Remove the B12 sentence explicitly saying the darkest area is not the thickest. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 12: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
          "fairness 13: Preserve the earlier positive repair while applying: Remove the B12 sentence explicitly saying the darkest area is not the thickest."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "suggestions 2: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations.",
        "closestDistractor": "Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r4",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "stem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
      "answerChoices": [
        {
          "id": "excisional_1",
          "label": "Entire-lesion excision with narrow margin into subcutaneous fat",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides whole-lesion architecture and adequate depth when the stated site/closure findings permit diagnostic excision."
        },
        {
          "id": "choice.qq20261102b.b17-context.d1",
          "label": "Punch biopsy of the darkest pigmented focus into subcutaneous fat",
          "isCorrect": false,
          "distractorRationale": "Provides depth at one focus but can miss relevant architecture or a different invasive focus elsewhere."
        },
        {
          "id": "choice.qq20261102b.b17-context.d2",
          "label": "Punch biopsy of the most elevated focus into subcutaneous fat",
          "isCorrect": false,
          "distractorRationale": "Targets a plausible invasive focus but does not assess the whole small lesion when complete diagnostic excision is feasible."
        }
      ],
      "explanation": "A narrow diagnostic excision of the entire small lesion into subcutaneous fat provides architecture and depth for assessment. Either full-depth focal punch can miss a different relevant component. This does not make focal sampling inappropriate for every large or anatomically constrained lesion; the supplied closure examination defines the represented feasible diagnostic excision.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling"
      ],
      "teachingPoint": "A narrow diagnostic excision of the entire small lesion into subcutaneous fat provides architecture and depth for assessment. Either full-depth focal punch can miss a different relevant component. This does not make focal sampling inappropriate for every large or anatomically constrained lesion; the supplied closure examination defines the represented feasible diagnostic excision."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with a changing pigmented lesion on the upper back. A raised focus sits within a changing pigmented area. On examination, the surrounding lax skin can be brought together around the entire lesion without tension.",
    "previousPresentation": "{patientName}, a 46-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A small raised focus sits within a broader changing pigmented area.",
    "previousProfilePresentations": [
      {
        "id": "profile.pigmented-skin-lesion.changing-back-lesion.female.46",
        "presentation": "{patientName}, a 46-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A small raised focus sits within a broader changing pigmented area."
      },
      {
        "id": "profile.pigmented-skin-lesion.changing-back-lesion.male.46",
        "presentation": "{patientName}, a 46-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A small raised focus sits within a broader changing pigmented area."
      },
      {
        "id": "profile.pigmented-skin-lesion.changing-back-lesion.female.51",
        "presentation": "{patientName}, a 51-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A small raised focus sits within a broader changing pigmented area."
      },
      {
        "id": "profile.pigmented-skin-lesion.changing-back-lesion.male.51",
        "presentation": "{patientName}, a 51-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A small raised focus sits within a broader changing pigmented area."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.pigmented-skin-lesion.changing-back-lesion",
        "patientPresentationVariantId": "presentation.pigmented-skin-lesion.changing-back-lesion",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Changing skin spot",
        "revisedPresentation": "{patientName}, a 46-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A small raised focus sits within a broader changing pigmented area.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.changing-back-lesion.female.46",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.changing-back-lesion.female.46",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 46-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A small raised focus sits within a broader changing pigmented area.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.changing-back-lesion.male.46",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.changing-back-lesion.male.46",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 46-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A small raised focus sits within a broader changing pigmented area.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.changing-back-lesion.female.51",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.changing-back-lesion.female.51",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 51-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A small raised focus sits within a broader changing pigmented area.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.changing-back-lesion.male.51",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.changing-back-lesion.male.51",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 51-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A small raised focus sits within a broader changing pigmented area.",
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
        "ageYears": 46,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102b.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v6"
    }
  },
  {
    "id": "revision.qq20261102b.b18",
    "auditId": "B18",
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.2",
    "previousQuestionVariantId": "question.melanoma.sentinel-node-staging.v3.r3",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v3.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which regional-node plan should accompany {patientName}'s further excision planning?",
    "previousChoiceLabels": [
      "Sentinel lymph node mapping and biopsy",
      "Ultrasound-guided biopsy of an imaged regional node",
      "Ultrasound surveillance of the regional nodes"
    ],
    "previousCurrentUpdate": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.8 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic regional-staging rule for clinically node-negative intermediate-thickness melanoma; different above-threshold thicknesses do not create advanced decision variants.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sentinel_node_3": "sentinel_node_3",
      "choice.qq20261102b.b18.d1": "choice.qq20261102a.b18.d1",
      "choice.qq20261102b.b18.d2": "choice.qq20261102a.b18.d2"
    },
    "choiceServiceOverrides": {
      "sentinel_node_3": null,
      "choice.qq20261102b.b18.d1": null,
      "choice.qq20261102b.b18.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.melanoma.sentinel-node-staging.v3.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic regional-staging rule for clinically node-negative intermediate-thickness melanoma; different above-threshold thicknesses do not create advanced decision variants.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B18",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Revision/preservation: Label the routine staging indication basic and retain its necessary depth/examination/ultrasound findings. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 2: Explicit basicRecallIntentional: Intentional basic regional-staging rule for clinically node-negative intermediate-thickness melanoma; different above-threshold thicknesses do not create advanced decision variants.",
          "fairness 3: Fairness response: The measured invasive primary and clinically uninvolved basin support sentinel staging; normal-appearing nodes do not establish microscopic node negativity. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Preserve the earlier positive repair while applying: Do not claim that replacing 'Breslow' with descriptive measurements creates a second consequential inference.",
          "fairness 5: Preserve the earlier positive repair while applying: Sibling B11/B17 now assess reconstruction sequencing; these two retain the original narrow indication objective without importing a new eligibility controversy.",
          "fairness 6: Preserve the earlier positive repair while applying: Label the routine staging indication basic and retain its necessary depth/examination/ultrasound findings.",
          "fairness 7: Fairness response: The measured invasive primary and clinically uninvolved basin support sentinel staging; normal-appearing nodes do not establish microscopic node negativity. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 8: Preserve the earlier positive repair while applying: Sibling B11/B17 now assess reconstruction sequencing; these two retain the original narrow indication objective without importing a new eligibility controversy.",
          "fairness 9: Preserve the earlier positive repair while applying: Label the routine staging indication basic and retain its necessary depth/examination/ultrasound findings.",
          "fairness 10: Revision/preservation: Label the routine staging indication basic and retain its necessary depth/examination/ultrasound findings. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 11: Revision/preservation: Do not claim that replacing 'Breslow' with descriptive measurements creates a second consequential inference. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Explicit basicRecallIntentional: Intentional basic regional-staging rule for clinically node-negative intermediate-thickness melanoma; different above-threshold thicknesses do not create advanced decision variants.",
          "suggestions 2: Action: Do not claim that replacing 'Breslow' with descriptive measurements creates a second consequential inference."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "The measured invasive primary and clinically uninvolved basin support sentinel staging; normal-appearing nodes do not establish microscopic node negativity.",
        "closestDistractor": "Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.melanoma.sentinel-node-staging.v3.r4",
      "conceptId": "concept.melanoma.sentinel-node-staging",
      "stem": "Which regional-node assessment should be discussed with {patientName}?",
      "answerChoices": [
        {
          "id": "sentinel_node_3",
          "label": "Sentinel lymph node mapping and biopsy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Interprets the primary depth and clinically uninvolved basin, rather than treating reassuring node imaging as exclusion of microscopic involvement."
        },
        {
          "id": "choice.qq20261102b.b18.d1",
          "label": "Ultrasound-guided biopsy of an imaged regional node",
          "isCorrect": false,
          "distractorRationale": "Confuses size-selected sampling of a nonsuspicious visible node with mapping the sentinel drainage of the primary lesion."
        },
        {
          "id": "choice.qq20261102b.b18.d2",
          "label": "Ultrasound surveillance of the regional nodes",
          "isCorrect": false,
          "distractorRationale": "Overweights benign-appearing imaged nodes and omits the indicated pathologic sentinel staging discussion."
        }
      ],
      "explanation": "The histology establishes an invasive melanoma with the supplied depth. In this clinically node-negative setting, sentinel-node staging should be discussed with definitive excision planning; sampling an arbitrary benign-appearing node or relying on surveillance does not supply equivalent sentinel staging.",
      "supportingEvidenceClaimIds": [
        "claim.melanoma.sentinel-node-staging",
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-integrated-node-staging"
      ],
      "teachingPoint": "The histology establishes an invasive melanoma with the supplied depth. In this clinically node-negative setting, sentinel-node staging should be discussed with definitive excision planning; sampling an arbitrary benign-appearing node or relying on surveillance does not supply equivalent sentinel staging."
    }
  },
  {
    "id": "revision.qq20261102b.b18-context",
    "auditId": "B18-context",
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r3",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
    "previousChoiceLabels": [
      "Elliptical sampling of the lesion through the dermis into subcutaneous fat",
      "Punch sampling of the darkest focus through the dermis into subcutaneous fat",
      "Tangential sampling of the lesion across its surface and papillary dermis"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_3": "excisional_3",
      "choice.qq20261102b.b18-context.d1": "choice.qq20261102a.b18-context.d1",
      "choice.qq20261102b.b18-context.d2": "choice.qq20261102a.b18-context.d2"
    },
    "choiceServiceOverrides": {
      "excisional_3": "service.skin_excisional_biopsy",
      "choice.qq20261102b.b18-context.d1": null,
      "choice.qq20261102b.b18-context.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B18-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
          "fairness 2: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 3: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Revision/preservation: Specify complete removal and a concrete closure examination; 'elliptical sampling' no longer stands in for whole-lesion excision. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 5: Revision/preservation: Remove the B12 sentence explicitly saying the darkest area is not the thickest. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 6: Preserve the earlier positive repair while applying: Specify complete removal and a concrete closure examination; 'elliptical sampling' no longer stands in for whole-lesion excision.",
          "fairness 7: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
          "fairness 8: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 9: Preserve the earlier positive repair while applying: Specify complete removal and a concrete closure examination; 'elliptical sampling' no longer stands in for whole-lesion excision.",
          "fairness 10: Preserve the earlier positive repair while applying: Remove the B12 sentence explicitly saying the darkest area is not the thickest.",
          "fairness 11: Revision/preservation: Remove the B12 sentence explicitly saying the darkest area is not the thickest. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 12: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique.",
          "fairness 13: Preserve the earlier positive repair while applying: Remove the B12 sentence explicitly saying the darkest area is not the thickest."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "suggestions 2: Explicit basicRecallIntentional: Intentional basic diagnostic-sampling objective for a small lesion whose entire extent can be removed and closed; it does not assess a difficult large-lesion or constrained-site technique."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations.",
        "closestDistractor": "Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r4",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "stem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
      "answerChoices": [
        {
          "id": "excisional_3",
          "label": "Entire-lesion excision with narrow margin into subcutaneous fat",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides whole-lesion architecture and adequate depth when the stated site/closure findings permit diagnostic excision."
        },
        {
          "id": "choice.qq20261102b.b18-context.d1",
          "label": "Punch biopsy of the darkest pigmented focus into subcutaneous fat",
          "isCorrect": false,
          "distractorRationale": "Provides depth at one focus but can miss relevant architecture or a different invasive focus elsewhere."
        },
        {
          "id": "choice.qq20261102b.b18-context.d2",
          "label": "Punch biopsy of the most elevated focus into subcutaneous fat",
          "isCorrect": false,
          "distractorRationale": "Targets a plausible invasive focus but does not assess the whole small lesion when complete diagnostic excision is feasible."
        }
      ],
      "explanation": "A narrow diagnostic excision of the entire small lesion into subcutaneous fat provides architecture and depth for assessment. Either full-depth focal punch can miss a different relevant component. This does not make focal sampling inappropriate for every large or anatomically constrained lesion; the supplied closure examination defines the represented feasible diagnostic excision.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling"
      ],
      "teachingPoint": "A narrow diagnostic excision of the entire small lesion into subcutaneous fat provides architecture and depth for assessment. Either full-depth focal punch can miss a different relevant component. This does not make focal sampling inappropriate for every large or anatomically constrained lesion; the supplied closure examination defines the represented feasible diagnostic excision."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with a changing pigmented lesion on the upper arm. The lesion has a changing border and a firm central focus within a flatter component. On examination, the surrounding lax skin can be brought together around the entire lesion without tension.",
    "previousPresentation": "{patientName}, a 39-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. The lesion has a changing border and a firm central focus within a flatter component.",
    "previousProfilePresentations": [
      {
        "id": "profile.pigmented-skin-lesion.calf-growth.female.39",
        "presentation": "{patientName}, a 39-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. The lesion has a changing border and a firm central focus within a flatter component."
      },
      {
        "id": "profile.pigmented-skin-lesion.calf-growth.male.39",
        "presentation": "{patientName}, a 39-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. The lesion has a changing border and a firm central focus within a flatter component."
      },
      {
        "id": "profile.pigmented-skin-lesion.calf-growth.female.44",
        "presentation": "{patientName}, a 44-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. The lesion has a changing border and a firm central focus within a flatter component."
      },
      {
        "id": "profile.pigmented-skin-lesion.calf-growth.male.44",
        "presentation": "{patientName}, a 44-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. The lesion has a changing border and a firm central focus within a flatter component."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.pigmented-skin-lesion.calf-growth",
        "patientPresentationVariantId": "presentation.pigmented-skin-lesion.calf-growth",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Changing skin spot",
        "revisedPresentation": "{patientName}, a 39-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. The lesion has a changing border and a firm central focus within a flatter component.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.calf-growth.female.39",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.calf-growth.female.39",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 39-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. The lesion has a changing border and a firm central focus within a flatter component.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.calf-growth.male.39",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.calf-growth.male.39",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 39-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. The lesion has a changing border and a firm central focus within a flatter component.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.calf-growth.female.44",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.calf-growth.female.44",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 44-year-old woman, visits the clinic with a changing pigmented skin lesion on an accessible limb site. The lesion has a changing border and a firm central focus within a flatter component.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102a.profile.pigmented-skin-lesion.calf-growth.male.44",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.calf-growth.male.44",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
            "revisedPresentation": "{patientName}, a 44-year-old man, visits the clinic with a changing pigmented skin lesion on an accessible limb site. The lesion has a changing border and a firm central focus within a flatter component.",
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
        "ageYears": 39,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102b.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v6"
    }
  },
  {
    "id": "revision.qq20261102b.b19",
    "auditId": "B19",
    "caseId": "case.soft-tissue-mass.deep-thigh",
    "nodeId": "node.soft-tissue-mass.deep-thigh.2",
    "previousQuestionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v1.r3",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "The specialist team is planning image-guided core sampling. Which target should be sampled for {patientName}?",
    "previousChoiceLabels": [
      "Region A within the mass",
      "Region B within the mass",
      "Region C in surrounding muscle"
    ],
    "previousCurrentUpdate": "MRI shows a mass within muscle. Region A is solid tissue at its edge and takes up contrast. Region B is central fluid-like material that does not take up contrast. Region C is nearby muscle with diffuse high fluid-sensitive signal, without a discrete mass.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Recognize that both intramass solid enhancing regions can provide viable tissue, so intensity alone does not choose the target. Then Select both the initial core method and the tract through the tumor-bearing compartment, preserving future resection planning.",
    "reviewerNotes": "Melissa/sarcoma review must confirm the constructed anatomy and operative tract removal. The original specialist-planned-core construct is restored explicitly through a combined method/path decision; no new sarcoma diagnosis or concept definition is asserted.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sarcoma_core_1": "sarcoma_core_1",
      "choice.qq20261102b.b19.d1": "choice.qq20261102a.b19.d1",
      "choice.qq20261102b.b19.d2": "choice.qq20261102a.b19.d2",
      "choice.qq20261102b.b19.d3": "choice.qq20261102a.b19.d1"
    },
    "choiceServiceOverrides": {
      "sarcoma_core_1": null,
      "choice.qq20261102b.b19.d1": null,
      "choice.qq20261102b.b19.d2": null,
      "choice.qq20261102b.b19.d3": null
    },
    "choiceTimingOverrides": {
      "sarcoma_core_1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102b.b19.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102b.b19.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102b.b19.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      }
    },
    "currentUpdate": "MRI places the mass within rectus femoris. Solid regions A and B both enhance; B enhances more intensely. Path A enters from the anterior skin through rectus femoris. The shorter path B enters from the medial skin, crosses adductor muscle and then reaches region B. Both regions can be sampled percutaneously.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v1.r3",
      "whatChanged": "Replace dead-fluid/outside-mass targets with two viable intramass targets and competing paths; restore the method/planning objective with balanced core/open and path combinations, rotating the safe letter across siblings.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B19",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Cue response: All targets are viable intramass tissue; no surrounding-muscle or central-fluid target is offered. Four combinations balance core/open methods and paths equally; all plans share specialist planning in the task. The safe region letter differs across siblings. Provide two viable intramass targets and descriptors for every offered path; remove the plainly non-tumor C target.",
          "cues 2: Cue response: All targets are viable intramass tissue; no surrounding-muscle or central-fluid target is offered. Four combinations balance core/open methods and paths equally; all plans share specialist planning in the task. The safe region letter differs across siblings. Make the shorter/more-avid path compete with preserving the future surgical compartment."
        ],
        "fairness": [
          "fairness 1: Application revision: Recognize that both intramass solid enhancing regions can provide viable tissue, so intensity alone does not choose the target. Then Select both the initial core method and the tract through the tumor-bearing compartment, preserving future resection planning. Closest error: The shorter tract to the most avid region is an attractive technically efficient choice that fails oncologic compartment planning.",
          "fairness 2: Fairness response: The recorded anatomy places path A within the thigh tumor-bearing muscle and path B through a separate compartment; both are technically accessible, and this is initial sampling. Clinical boundary: Melissa/sarcoma review must confirm the constructed anatomy and operative tract removal. The original specialist-planned-core construct is restored explicitly through a combined method/path decision; no new sarcoma diagnosis or concept definition is asserted.",
          "fairness 3: Fairness response: The recorded anatomy places path A within the thigh tumor-bearing muscle and path B through a separate compartment; both are technically accessible, and this is initial sampling. Clinical boundary: Melissa/sarcoma review must confirm the constructed anatomy and operative tract removal. The original specialist-planned-core construct is restored explicitly through a combined method/path decision; no new sarcoma diagnosis or concept definition is asserted.",
          "fairness 4: Preserve the earlier positive repair while applying: Make the shorter/more-avid path compete with preserving the future surgical compartment.",
          "fairness 5: Preserve the earlier positive repair while applying: Restore choice of the initial biopsy method as part of each complete plan, addressing the previous drift to target-only selection; retain specialist context equally across options.",
          "fairness 6: Application revision: Recognize that both intramass solid enhancing regions can provide viable tissue, so intensity alone does not choose the target. Then Select both the initial core method and the tract through the tumor-bearing compartment, preserving future resection planning. Closest error: The shorter tract to the most avid region is an attractive technically efficient choice that fails oncologic compartment planning.",
          "fairness 7: Fairness response: The recorded anatomy places path A within the thigh tumor-bearing muscle and path B through a separate compartment; both are technically accessible, and this is initial sampling. Clinical boundary: Melissa/sarcoma review must confirm the constructed anatomy and operative tract removal. The original specialist-planned-core construct is restored explicitly through a combined method/path decision; no new sarcoma diagnosis or concept definition is asserted.",
          "fairness 8: Preserve the earlier positive repair while applying: Restore choice of the initial biopsy method as part of each complete plan, addressing the previous drift to target-only selection; retain specialist context equally across options.",
          "fairness 9: Preserve the earlier positive repair while applying: Provide two viable intramass targets and descriptors for every offered path; remove the plainly non-tumor C target.",
          "fairness 10: Fairness response: The recorded anatomy places path A within the thigh tumor-bearing muscle and path B through a separate compartment; both are technically accessible, and this is initial sampling. Clinical boundary: Melissa/sarcoma review must confirm the constructed anatomy and operative tract removal. The original specialist-planned-core construct is restored explicitly through a combined method/path decision; no new sarcoma diagnosis or concept definition is asserted.",
          "fairness 11: Preserve the earlier positive repair while applying: Restore choice of the initial biopsy method as part of each complete plan, addressing the previous drift to target-only selection; retain specialist context equally across options."
        ],
        "suggestions": [
          "suggestions 1: Application revision: Recognize that both intramass solid enhancing regions can provide viable tissue, so intensity alone does not choose the target. Then Select both the initial core method and the tract through the tumor-bearing compartment, preserving future resection planning. Closest error: The shorter tract to the most avid region is an attractive technically efficient choice that fails oncologic compartment planning.",
          "suggestions 2: Action: Make the shorter/more-avid path compete with preserving the future surgical compartment.",
          "suggestions 3: Fairness response: The recorded anatomy places path A within the thigh tumor-bearing muscle and path B through a separate compartment; both are technically accessible, and this is initial sampling. Clinical boundary: Melissa/sarcoma review must confirm the constructed anatomy and operative tract removal. The original specialist-planned-core construct is restored explicitly through a combined method/path decision; no new sarcoma diagnosis or concept definition is asserted."
        ]
      },
      "selfCheck": {
        "cueAttack": "All targets are viable intramass tissue; no surrounding-muscle or central-fluid target is offered. Four combinations balance core/open methods and paths equally; all plans share specialist planning in the task. The safe region letter differs across siblings.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that both intramass solid enhancing regions can provide viable tissue, so intensity alone does not choose the target.",
          "Select both the initial core method and the tract through the tumor-bearing compartment, preserving future resection planning."
        ],
        "oneBestAnswer": "The recorded anatomy places path A within the thigh tumor-bearing muscle and path B through a separate compartment; both are technically accessible, and this is initial sampling.",
        "closestDistractor": "The shorter tract to the most avid region is an attractive technically efficient choice that fails oncologic compartment planning.",
        "remainingReview": "Melissa/sarcoma review must confirm the constructed anatomy and operative tract removal. The original specialist-planned-core construct is restored explicitly through a combined method/path decision; no new sarcoma diagnosis or concept definition is asserted."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.specialist-planned-biopsy.v1.r4",
      "conceptId": "concept.soft-tissue-mass.specialist-planned-biopsy",
      "stem": "Which initial tissue-sampling plan should the sarcoma team select for {patientName}?",
      "answerChoices": [
        {
          "id": "sarcoma_core_1",
          "label": "Image-guided core biopsy of region A along path A",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Obtains diagnostic cores from viable tissue while keeping the planned tract within the tumor-bearing compartment."
        },
        {
          "id": "choice.qq20261102b.b19.d1",
          "label": "Image-guided core biopsy of region B along path B",
          "isCorrect": false,
          "distractorRationale": "Selects the shorter route to the more intensely enhancing region but contaminates a separate muscle compartment."
        },
        {
          "id": "choice.qq20261102b.b19.d2",
          "label": "Open incisional biopsy of region A along path A",
          "isCorrect": false,
          "distractorRationale": "Uses the better tract but escalates to an open procedure before a feasible initial core approach has been attempted."
        },
        {
          "id": "choice.qq20261102b.b19.d3",
          "label": "Open incisional biopsy of region B along path B",
          "isCorrect": false,
          "distractorRationale": "Combines premature open sampling with the path that traverses a separate muscle compartment."
        }
      ],
      "explanation": "Plan the biopsy with the team that would perform definitive surgery. Both offered targets are viable, so the most intense enhancement/shortest route is not sufficient: preserve the surgical approach and avoid traversing a separate compartment. A feasible image-guided core approach is preferred initially; open biopsy is a selected alternative rather than automatically wrong. Both method and tract are balanced across the offered plans.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.planned-biopsy",
        "claim.soft-tissue-mass.mri",
        "claim.qq20261102a.sarcoma-viable-biopsy-target",
        "claim.qq20261102b.sarcoma-method-and-tract",
        "claim.qq20261102b.sarcoma-initial-core-method",
        "claim.qq20261102b.rectus-anterior-compartment",
        "claim.qq20261102b.adductor-medial-compartment"
      ],
      "teachingPoint": "Plan the biopsy with the team that would perform definitive surgery. Both offered targets are viable, so the most intense enhancement/shortest route is not sufficient: preserve the surgical approach and avoid traversing a separate compartment. A feasible image-guided core approach is preferred initially; open biopsy is a selected alternative rather than automatically wrong. Both method and tract are balanced across the offered plans."
    }
  },
  {
    "id": "revision.qq20261102b.b19-context",
    "auditId": "B19-context",
    "caseId": "case.soft-tissue-mass.deep-thigh",
    "nodeId": "node.soft-tissue-mass.deep-thigh.1",
    "previousQuestionVariantId": "question.soft-tissue-mass.extremity-mri.v1.r3",
    "questionVariantId": "question.soft-tissue-mass.extremity-mri.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which local characterization study should precede tissue sampling of {patientName}'s mass?",
    "previousChoiceLabels": [
      "Extremity MRI before and after intravenous contrast",
      "Extremity CT before and after intravenous contrast",
      "Extremity ultrasound with color-flow and spectral Doppler"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic local-imaging objective for a deep ultrasound-indeterminate limb mass; a contraindication or artifact-protocol question would be a new objective.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "extremity_mri_1": "extremity_mri_1",
      "choice.qq20261102b.b19-context.d1": "choice.qq20261102a.b19-context.d1",
      "choice.qq20261102b.b19-context.d2": "choice.qq20261102a.b19-context.d2"
    },
    "choiceServiceOverrides": {
      "extremity_mri_1": "service.extremity_mri",
      "choice.qq20261102b.b19-context.d1": null,
      "choice.qq20261102b.b19-context.d2": null
    },
    "choiceTimingOverrides": {
      "extremity_mri_1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102b.b19-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102b.b19-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pet_ct"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.soft-tissue-mass.extremity-mri.v1.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic local-imaging objective for a deep ultrasound-indeterminate limb mass; a contraindication or artifact-protocol question would be a new objective.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B19-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Fairness response: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
        ],
        "fairness": [
          "fairness 1: Fairness response: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 2: Explicit basicRecallIntentional: Intentional basic local-imaging objective for a deep ultrasound-indeterminate limb mass; a contraindication or artifact-protocol question would be a new objective.",
          "fairness 3: Fairness response: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Preserve the earlier positive repair while applying: Remove unchanged repeat ultrasound after its stated failure; CT and PET-CT are distinct, real adjacent modalities.",
          "fairness 5: Preserve the earlier positive repair while applying: Label this fixed first-local-imaging objective basic; the paired later item now supplies the substantive method/tract decision.",
          "fairness 6: Explicit basicRecallIntentional: Intentional basic local-imaging objective for a deep ultrasound-indeterminate limb mass; a contraindication or artifact-protocol question would be a new objective.",
          "fairness 7: Preserve the earlier positive repair while applying: Remove unchanged repeat ultrasound after its stated failure; CT and PET-CT are distinct, real adjacent modalities.",
          "fairness 8: Preserve the earlier positive repair while applying: Label this fixed first-local-imaging objective basic; the paired later item now supplies the substantive method/tract decision.",
          "fairness 9: Preserve the earlier positive repair while applying: Keep actual subfascial depth and the prior ultrasound limitation without claiming this routine sequence is hard.",
          "fairness 10: Preserve the earlier positive repair while applying: Remove unchanged repeat ultrasound after its stated failure; CT and PET-CT are distinct, real adjacent modalities.",
          "fairness 11: Preserve the earlier positive repair while applying: Label this fixed first-local-imaging objective basic; the paired later item now supplies the substantive method/tract decision.",
          "fairness 12: Preserve the earlier positive repair while applying: Keep actual subfascial depth and the prior ultrasound limitation without claiming this routine sequence is hard."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "suggestions 2: Fairness response: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling.",
        "closestDistractor": "Repeating ultrasound with Doppler because it was the initial triage study is plausible but does not answer the extent question.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.extremity-mri.v1.r4",
      "conceptId": "concept.soft-tissue-mass.extremity-mri",
      "stem": "Which local characterization study should precede tissue sampling of {patientName}'s mass?",
      "answerChoices": [
        {
          "id": "extremity_mri_1",
          "label": "Extremity MRI with precontrast and postcontrast imaging",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides the preferred local characterization and compartment/tract information before biopsy."
        },
        {
          "id": "choice.qq20261102b.b19-context.d1",
          "label": "Extremity CT with precontrast and postcontrast imaging",
          "isCorrect": false,
          "distractorRationale": "Is a real alternative when MRI cannot be used, not excluded by an artificial technical qualifier."
        },
        {
          "id": "choice.qq20261102b.b19-context.d2",
          "label": "Extremity FDG PET-CT with metabolic and anatomic imaging",
          "isCorrect": false,
          "distractorRationale": "Can solve selected problems, but is not the standard first local mapping pathway for this unclassified mass."
        }
      ],
      "explanation": "The prior examination establishes that the lesion lies below the investing fascia and that its deep extent is not defined. Local MRI characterization should precede biopsy planning. An ultrasound description merely below mobile skin would not have established that depth.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.mri",
        "claim.qq20261102a.sarcoma-local-imaging"
      ],
      "teachingPoint": "The prior examination establishes that the lesion lies below the investing fascia and that its deep extent is not defined. Local MRI characterization should precede biopsy planning. An ultrasound description merely below mobile skin would not have established that depth."
    },
    "previousResultNarrative": "MRI shows a mass within muscle. Region A is solid tissue at its edge and takes up contrast. Region B is central fluid-like material that does not take up contrast. Region C is nearby muscle with diffuse high fluid-sensitive signal, without a discrete mass.",
    "resultNarrative": "MRI places the mass within rectus femoris. Solid regions A and B both enhance; B enhances more intensely. Path A enters from the anterior skin through rectus femoris. The shorter path B enters from the medial skin, crosses adductor muscle and then reaches region B. Both regions can be sampled percutaneously."
  },
  {
    "id": "revision.qq20261102b.b20",
    "auditId": "B20",
    "caseId": "case.soft-tissue-mass.upper-arm",
    "nodeId": "node.soft-tissue-mass.upper-arm.2",
    "previousQuestionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v2.r3",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v2.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "The specialist team is planning image-guided core sampling. Which target should be sampled for {patientName}?",
    "previousChoiceLabels": [
      "Region A within the mass",
      "Region B within the mass",
      "Region C in surrounding muscle"
    ],
    "previousCurrentUpdate": "MRI shows a mass within muscle. Region A is solid tissue at its edge and takes up contrast. Region B is central fluid-like material that does not take up contrast. Region C is nearby muscle with diffuse high fluid-sensitive signal, without a discrete mass.",
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Recognize that both intramass solid enhancing regions can provide viable tissue, so intensity alone does not choose the target. Then Select both the initial core method and the tract through the tumor-bearing compartment, preserving future resection planning.",
    "reviewerNotes": "Melissa/sarcoma review must confirm the constructed anatomy and operative tract removal. The original specialist-planned-core construct is restored explicitly through a combined method/path decision; no new sarcoma diagnosis or concept definition is asserted.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sarcoma_core_2": "sarcoma_core_2",
      "choice.qq20261102b.b20.d1": "choice.qq20261102a.b20.d1",
      "choice.qq20261102b.b20.d2": "choice.qq20261102a.b20.d2",
      "choice.qq20261102b.b20.d3": "choice.qq20261102a.b20.d1"
    },
    "choiceServiceOverrides": {
      "sarcoma_core_2": null,
      "choice.qq20261102b.b20.d1": null,
      "choice.qq20261102b.b20.d2": null,
      "choice.qq20261102b.b20.d3": null
    },
    "choiceTimingOverrides": {
      "sarcoma_core_2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102b.b20.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102b.b20.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102b.b20.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      }
    },
    "currentUpdate": "MRI places the mass within triceps. Solid regions A and B both enhance; A enhances more intensely. Path B enters from the posterior skin through triceps. The shorter path A enters from anterior skin, crosses biceps and then reaches region A. Both regions can be sampled percutaneously.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v2.r3",
      "whatChanged": "Replace dead-fluid/outside-mass targets with two viable intramass targets and competing paths; restore the method/planning objective with balanced core/open and path combinations, rotating the safe letter across siblings.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B20",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Cue response: All targets are viable intramass tissue; no surrounding-muscle or central-fluid target is offered. Four combinations balance core/open methods and paths equally; all plans share specialist planning in the task. The safe region letter differs across siblings. Provide two viable intramass targets and descriptors for every offered path; remove the plainly non-tumor C target.",
          "cues 2: Cue response: All targets are viable intramass tissue; no surrounding-muscle or central-fluid target is offered. Four combinations balance core/open methods and paths equally; all plans share specialist planning in the task. The safe region letter differs across siblings. Make the shorter/more-avid path compete with preserving the future surgical compartment."
        ],
        "fairness": [
          "fairness 1: Application revision: Recognize that both intramass solid enhancing regions can provide viable tissue, so intensity alone does not choose the target. Then Select both the initial core method and the tract through the tumor-bearing compartment, preserving future resection planning. Closest error: The shorter tract to the most avid region is an attractive technically efficient choice that fails oncologic compartment planning.",
          "fairness 2: Fairness response: The recorded anatomy places path B within the upper arm tumor-bearing muscle and path A through a separate compartment; both are technically accessible, and this is initial sampling. Clinical boundary: Melissa/sarcoma review must confirm the constructed anatomy and operative tract removal. The original specialist-planned-core construct is restored explicitly through a combined method/path decision; no new sarcoma diagnosis or concept definition is asserted.",
          "fairness 3: Fairness response: The recorded anatomy places path B within the upper arm tumor-bearing muscle and path A through a separate compartment; both are technically accessible, and this is initial sampling. Clinical boundary: Melissa/sarcoma review must confirm the constructed anatomy and operative tract removal. The original specialist-planned-core construct is restored explicitly through a combined method/path decision; no new sarcoma diagnosis or concept definition is asserted.",
          "fairness 4: Preserve the earlier positive repair while applying: Make the shorter/more-avid path compete with preserving the future surgical compartment.",
          "fairness 5: Preserve the earlier positive repair while applying: Restore choice of the initial biopsy method as part of each complete plan, addressing the previous drift to target-only selection; retain specialist context equally across options.",
          "fairness 6: Application revision: Recognize that both intramass solid enhancing regions can provide viable tissue, so intensity alone does not choose the target. Then Select both the initial core method and the tract through the tumor-bearing compartment, preserving future resection planning. Closest error: The shorter tract to the most avid region is an attractive technically efficient choice that fails oncologic compartment planning.",
          "fairness 7: Fairness response: The recorded anatomy places path B within the upper arm tumor-bearing muscle and path A through a separate compartment; both are technically accessible, and this is initial sampling. Clinical boundary: Melissa/sarcoma review must confirm the constructed anatomy and operative tract removal. The original specialist-planned-core construct is restored explicitly through a combined method/path decision; no new sarcoma diagnosis or concept definition is asserted.",
          "fairness 8: Preserve the earlier positive repair while applying: Restore choice of the initial biopsy method as part of each complete plan, addressing the previous drift to target-only selection; retain specialist context equally across options.",
          "fairness 9: Preserve the earlier positive repair while applying: Provide two viable intramass targets and descriptors for every offered path; remove the plainly non-tumor C target.",
          "fairness 10: Fairness response: The recorded anatomy places path B within the upper arm tumor-bearing muscle and path A through a separate compartment; both are technically accessible, and this is initial sampling. Clinical boundary: Melissa/sarcoma review must confirm the constructed anatomy and operative tract removal. The original specialist-planned-core construct is restored explicitly through a combined method/path decision; no new sarcoma diagnosis or concept definition is asserted.",
          "fairness 11: Preserve the earlier positive repair while applying: Restore choice of the initial biopsy method as part of each complete plan, addressing the previous drift to target-only selection; retain specialist context equally across options."
        ],
        "suggestions": [
          "suggestions 1: Application revision: Recognize that both intramass solid enhancing regions can provide viable tissue, so intensity alone does not choose the target. Then Select both the initial core method and the tract through the tumor-bearing compartment, preserving future resection planning. Closest error: The shorter tract to the most avid region is an attractive technically efficient choice that fails oncologic compartment planning.",
          "suggestions 2: Action: Make the shorter/more-avid path compete with preserving the future surgical compartment.",
          "suggestions 3: Fairness response: The recorded anatomy places path B within the upper arm tumor-bearing muscle and path A through a separate compartment; both are technically accessible, and this is initial sampling. Clinical boundary: Melissa/sarcoma review must confirm the constructed anatomy and operative tract removal. The original specialist-planned-core construct is restored explicitly through a combined method/path decision; no new sarcoma diagnosis or concept definition is asserted."
        ]
      },
      "selfCheck": {
        "cueAttack": "All targets are viable intramass tissue; no surrounding-muscle or central-fluid target is offered. Four combinations balance core/open methods and paths equally; all plans share specialist planning in the task. The safe region letter differs across siblings.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that both intramass solid enhancing regions can provide viable tissue, so intensity alone does not choose the target.",
          "Select both the initial core method and the tract through the tumor-bearing compartment, preserving future resection planning."
        ],
        "oneBestAnswer": "The recorded anatomy places path B within the upper arm tumor-bearing muscle and path A through a separate compartment; both are technically accessible, and this is initial sampling.",
        "closestDistractor": "The shorter tract to the most avid region is an attractive technically efficient choice that fails oncologic compartment planning.",
        "remainingReview": "Melissa/sarcoma review must confirm the constructed anatomy and operative tract removal. The original specialist-planned-core construct is restored explicitly through a combined method/path decision; no new sarcoma diagnosis or concept definition is asserted."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.specialist-planned-biopsy.v2.r4",
      "conceptId": "concept.soft-tissue-mass.specialist-planned-biopsy",
      "stem": "Which initial tissue-sampling plan should the sarcoma team select for {patientName}?",
      "answerChoices": [
        {
          "id": "sarcoma_core_2",
          "label": "Image-guided core biopsy of region B along path B",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Obtains diagnostic cores from viable tissue while keeping the planned tract within the tumor-bearing compartment."
        },
        {
          "id": "choice.qq20261102b.b20.d1",
          "label": "Image-guided core biopsy of region A along path A",
          "isCorrect": false,
          "distractorRationale": "Selects the shorter route to the more intensely enhancing region but contaminates a separate muscle compartment."
        },
        {
          "id": "choice.qq20261102b.b20.d2",
          "label": "Open incisional biopsy of region B along path B",
          "isCorrect": false,
          "distractorRationale": "Uses the better tract but escalates to an open procedure before a feasible initial core approach has been attempted."
        },
        {
          "id": "choice.qq20261102b.b20.d3",
          "label": "Open incisional biopsy of region A along path A",
          "isCorrect": false,
          "distractorRationale": "Combines premature open sampling with the path that traverses a separate muscle compartment."
        }
      ],
      "explanation": "Plan the biopsy with the team that would perform definitive surgery. Both offered targets are viable, so the most intense enhancement/shortest route is not sufficient: preserve the surgical approach and avoid traversing a separate compartment. A feasible image-guided core approach is preferred initially; open biopsy is a selected alternative rather than automatically wrong. Both method and tract are balanced across the offered plans.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.planned-biopsy",
        "claim.soft-tissue-mass.mri",
        "claim.qq20261102a.sarcoma-viable-biopsy-target",
        "claim.qq20261102b.sarcoma-method-and-tract",
        "claim.qq20261102b.sarcoma-initial-core-method",
        "claim.qq20261102b.biceps-anterior-compartment",
        "claim.qq20261102b.triceps-posterior-compartment"
      ],
      "teachingPoint": "Plan the biopsy with the team that would perform definitive surgery. Both offered targets are viable, so the most intense enhancement/shortest route is not sufficient: preserve the surgical approach and avoid traversing a separate compartment. A feasible image-guided core approach is preferred initially; open biopsy is a selected alternative rather than automatically wrong. Both method and tract are balanced across the offered plans."
    }
  },
  {
    "id": "revision.qq20261102b.b20-context",
    "auditId": "B20-context",
    "caseId": "case.soft-tissue-mass.upper-arm",
    "nodeId": "node.soft-tissue-mass.upper-arm.1",
    "previousQuestionVariantId": "question.soft-tissue-mass.extremity-mri.v2.r3",
    "questionVariantId": "question.soft-tissue-mass.extremity-mri.v2.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which local characterization study should precede tissue sampling of {patientName}'s mass?",
    "previousChoiceLabels": [
      "Extremity MRI before and after intravenous contrast",
      "Extremity CT before and after intravenous contrast",
      "Extremity ultrasound with color-flow and spectral Doppler"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic local-imaging objective for a deep ultrasound-indeterminate limb mass; a contraindication or artifact-protocol question would be a new objective.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "extremity_mri_2": "extremity_mri_2",
      "choice.qq20261102b.b20-context.d1": "choice.qq20261102a.b20-context.d1",
      "choice.qq20261102b.b20-context.d2": "choice.qq20261102a.b20-context.d2"
    },
    "choiceServiceOverrides": {
      "extremity_mri_2": "service.extremity_mri",
      "choice.qq20261102b.b20-context.d1": null,
      "choice.qq20261102b.b20-context.d2": null
    },
    "choiceTimingOverrides": {
      "extremity_mri_2": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102b.b20-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102b.b20-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pet_ct"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.soft-tissue-mass.extremity-mri.v2.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic local-imaging objective for a deep ultrasound-indeterminate limb mass; a contraindication or artifact-protocol question would be a new objective.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B20-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Fairness response: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
        ],
        "fairness": [
          "fairness 1: Fairness response: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 2: Explicit basicRecallIntentional: Intentional basic local-imaging objective for a deep ultrasound-indeterminate limb mass; a contraindication or artifact-protocol question would be a new objective.",
          "fairness 3: Fairness response: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Preserve the earlier positive repair while applying: Remove unchanged repeat ultrasound after its stated failure; CT and PET-CT are distinct, real adjacent modalities.",
          "fairness 5: Preserve the earlier positive repair while applying: Label this fixed first-local-imaging objective basic; the paired later item now supplies the substantive method/tract decision.",
          "fairness 6: Explicit basicRecallIntentional: Intentional basic local-imaging objective for a deep ultrasound-indeterminate limb mass; a contraindication or artifact-protocol question would be a new objective.",
          "fairness 7: Preserve the earlier positive repair while applying: Remove unchanged repeat ultrasound after its stated failure; CT and PET-CT are distinct, real adjacent modalities.",
          "fairness 8: Preserve the earlier positive repair while applying: Label this fixed first-local-imaging objective basic; the paired later item now supplies the substantive method/tract decision.",
          "fairness 9: Preserve the earlier positive repair while applying: Keep actual subfascial depth and the prior ultrasound limitation without claiming this routine sequence is hard.",
          "fairness 10: Preserve the earlier positive repair while applying: Remove unchanged repeat ultrasound after its stated failure; CT and PET-CT are distinct, real adjacent modalities.",
          "fairness 11: Preserve the earlier positive repair while applying: Label this fixed first-local-imaging objective basic; the paired later item now supplies the substantive method/tract decision.",
          "fairness 12: Preserve the earlier positive repair while applying: Keep actual subfascial depth and the prior ultrasound limitation without claiming this routine sequence is hard."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "suggestions 2: Fairness response: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling.",
        "closestDistractor": "Repeating ultrasound with Doppler because it was the initial triage study is plausible but does not answer the extent question.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.extremity-mri.v2.r4",
      "conceptId": "concept.soft-tissue-mass.extremity-mri",
      "stem": "Which local characterization study should precede tissue sampling of {patientName}'s mass?",
      "answerChoices": [
        {
          "id": "extremity_mri_2",
          "label": "Extremity MRI with precontrast and postcontrast imaging",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides the preferred local characterization and compartment/tract information before biopsy."
        },
        {
          "id": "choice.qq20261102b.b20-context.d1",
          "label": "Extremity CT with precontrast and postcontrast imaging",
          "isCorrect": false,
          "distractorRationale": "Is a real alternative when MRI cannot be used, not excluded by an artificial technical qualifier."
        },
        {
          "id": "choice.qq20261102b.b20-context.d2",
          "label": "Extremity FDG PET-CT with metabolic and anatomic imaging",
          "isCorrect": false,
          "distractorRationale": "Can solve selected problems, but is not the standard first local mapping pathway for this unclassified mass."
        }
      ],
      "explanation": "The prior examination establishes that the lesion lies below the investing fascia and that its deep extent is not defined. Local MRI characterization should precede biopsy planning. An ultrasound description merely below mobile skin would not have established that depth.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.mri",
        "claim.qq20261102a.sarcoma-local-imaging"
      ],
      "teachingPoint": "The prior examination establishes that the lesion lies below the investing fascia and that its deep extent is not defined. Local MRI characterization should precede biopsy planning. An ultrasound description merely below mobile skin would not have established that depth."
    },
    "previousResultNarrative": "MRI shows a mass within muscle. Region A is solid tissue at its edge and takes up contrast. Region B is central fluid-like material that does not take up contrast. Region C is nearby muscle with diffuse high fluid-sensitive signal, without a discrete mass.",
    "resultNarrative": "MRI places the mass within triceps. Solid regions A and B both enhance; A enhances more intensely. Path B enters from the posterior skin through triceps. The shorter path A enters from anterior skin, crosses biceps and then reaches region A. Both regions can be sampled percutaneously."
  },
  {
    "id": "revision.qq20261102b.b21-context",
    "auditId": "B21-context",
    "caseId": "case.l2.colonic-lipoma.direct.typical-a",
    "nodeId": "node.colonic-lipoma.recognition.patient-to-diagnosis.v1",
    "previousQuestionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r3",
    "questionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which diagnosis best integrates {patientName}'s endoscopic and wall-layer findings?",
    "previousChoiceLabels": [
      "Colonic lipoma",
      "Colonic lymphangioma",
      "Gastrointestinal stromal tumor"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic recognition of the integrated classic submucosal lipoma pattern; its consequential no-directed-follow-up decision is the unchanged passed companion.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "colonic_lipoma": "colonic_lipoma",
      "choice.qq20261102b.b21-context.d1": "choice.qq20261102a.b21-context.d1",
      "choice.qq20261102b.b21-context.d2": "choice.qq20261102a.b21-context.d2"
    },
    "choiceServiceOverrides": {
      "colonic_lipoma": null,
      "choice.qq20261102b.b21-context.d1": null,
      "choice.qq20261102b.b21-context.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic recognition of the integrated classic submucosal lipoma pattern; its consequential no-directed-follow-up decision is the unchanged passed companion.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B21-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: Intentional basic recognition of the integrated classic submucosal lipoma pattern; its consequential no-directed-follow-up decision is the unchanged passed companion.",
          "fairness 2: Explicit basicRecallIntentional: Intentional basic recognition of the integrated classic submucosal lipoma pattern; its consequential no-directed-follow-up decision is the unchanged passed companion.",
          "fairness 3: Fairness response: Only lipoma fits the integrated layer, internal echo and surface observations among these alternatives. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Preserve the earlier positive repair while applying: Preserve the actual EUS/appearance information and real same-category alternatives.",
          "fairness 5: Preserve the earlier positive repair while applying: Keep the passed management item and shared case presentation unchanged; no duplicate management question is introduced.",
          "fairness 6: Explicit basicRecallIntentional: Intentional basic recognition of the integrated classic submucosal lipoma pattern; its consequential no-directed-follow-up decision is the unchanged passed companion.",
          "fairness 7: Preserve the earlier positive repair while applying: Preserve the actual EUS/appearance information and real same-category alternatives.",
          "fairness 8: Revision/preservation: Preserve the actual EUS/appearance information and real same-category alternatives. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 9: Revision/preservation: Keep the passed management item and shared case presentation unchanged; no duplicate management question is introduced. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 10: Preserve the earlier positive repair while applying: Preserve the actual EUS/appearance information and real same-category alternatives."
        ],
        "suggestions": [
          "suggestions 1: Action: Label the classic morphology/layer pattern basic rather than add confirming features to claim a second reasoning step.",
          "suggestions 2: Explicit basicRecallIntentional: Intentional basic recognition of the integrated classic submucosal lipoma pattern; its consequential no-directed-follow-up decision is the unchanged passed companion."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Only lipoma fits the integrated layer, internal echo and surface observations among these alternatives.",
        "closestDistractor": "Calling any deformable submucosal lesion lymphangioma without checking for fluid spaces is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r4",
      "conceptId": "concept.colonic-lipoma.endoscopic-recognition",
      "stem": "Which diagnosis fits {patientName}'s endoscopic and wall-layer observations?",
      "answerChoices": [
        {
          "id": "colonic_lipoma",
          "label": "Colonic lipoma",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Combines compressibility/yellow surface with a uniform hyperechoic submucosal lesion."
        },
        {
          "id": "choice.qq20261102b.b21-context.d1",
          "label": "Colonic lymphangioma",
          "isCorrect": false,
          "distractorRationale": "Can be deformable and submucosal, but ordinarily has fluid-containing/cystic internal spaces rather than the supplied uniform bright solid pattern."
        },
        {
          "id": "choice.qq20261102b.b21-context.d2",
          "label": "Gastrointestinal stromal tumor",
          "isCorrect": false,
          "distractorRationale": "Is a plausible solid subepithelial alternative, but the usual muscularis-propria hypoechoic pattern differs from these observations."
        }
      ],
      "explanation": "Interpret the wall layer and internal echo pattern before integrating the endoscopic behavior. A uniform hyperechoic submucosal lesion with this surface behavior supports lipoma; compressibility by itself is not the whole assessment.",
      "supportingEvidenceClaimIds": [
        "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
        "claim.qq20261102a.subepithelial-integrated-pattern"
      ],
      "teachingPoint": "Interpret the wall layer and internal echo pattern before integrating the endoscopic behavior. A uniform hyperechoic submucosal lesion with this surface behavior supports lipoma; compressibility by itself is not the whole assessment."
    }
  },
  {
    "id": "revision.qq20261102b.b22-context",
    "auditId": "B22-context",
    "caseId": "case.l2.colonic-lipoma.direct.typical-b",
    "nodeId": "node.colonic-lipoma.recognition.patient-to-diagnosis.v2",
    "previousQuestionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r3",
    "questionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which diagnosis best integrates {patientName}'s endoscopic and wall-layer findings?",
    "previousChoiceLabels": [
      "Colonic lipoma",
      "Colonic lymphangioma",
      "Gastrointestinal stromal tumor"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic recognition of the integrated classic submucosal lipoma pattern; its consequential no-directed-follow-up decision is the unchanged passed companion.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "colonic_lipoma": "colonic_lipoma",
      "choice.qq20261102b.b22-context.d1": "choice.qq20261102a.b22-context.d1",
      "choice.qq20261102b.b22-context.d2": "choice.qq20261102a.b22-context.d2"
    },
    "choiceServiceOverrides": {
      "colonic_lipoma": null,
      "choice.qq20261102b.b22-context.d1": null,
      "choice.qq20261102b.b22-context.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic recognition of the integrated classic submucosal lipoma pattern; its consequential no-directed-follow-up decision is the unchanged passed companion.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B22-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: Intentional basic recognition of the integrated classic submucosal lipoma pattern; its consequential no-directed-follow-up decision is the unchanged passed companion.",
          "fairness 2: Explicit basicRecallIntentional: Intentional basic recognition of the integrated classic submucosal lipoma pattern; its consequential no-directed-follow-up decision is the unchanged passed companion.",
          "fairness 3: Fairness response: Only lipoma fits the integrated layer, internal echo and surface observations among these alternatives. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Preserve the earlier positive repair while applying: Preserve the actual EUS/appearance information and real same-category alternatives.",
          "fairness 5: Preserve the earlier positive repair while applying: Keep the passed management item and shared case presentation unchanged; no duplicate management question is introduced.",
          "fairness 6: Explicit basicRecallIntentional: Intentional basic recognition of the integrated classic submucosal lipoma pattern; its consequential no-directed-follow-up decision is the unchanged passed companion.",
          "fairness 7: Preserve the earlier positive repair while applying: Preserve the actual EUS/appearance information and real same-category alternatives.",
          "fairness 8: Revision/preservation: Preserve the actual EUS/appearance information and real same-category alternatives. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 9: Revision/preservation: Keep the passed management item and shared case presentation unchanged; no duplicate management question is introduced. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 10: Preserve the earlier positive repair while applying: Preserve the actual EUS/appearance information and real same-category alternatives."
        ],
        "suggestions": [
          "suggestions 1: Action: Label the classic morphology/layer pattern basic rather than add confirming features to claim a second reasoning step.",
          "suggestions 2: Explicit basicRecallIntentional: Intentional basic recognition of the integrated classic submucosal lipoma pattern; its consequential no-directed-follow-up decision is the unchanged passed companion."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Only lipoma fits the integrated layer, internal echo and surface observations among these alternatives.",
        "closestDistractor": "Calling any deformable submucosal lesion lymphangioma without checking for fluid spaces is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r4",
      "conceptId": "concept.colonic-lipoma.endoscopic-recognition",
      "stem": "Which diagnosis fits {patientName}'s endoscopic and wall-layer observations?",
      "answerChoices": [
        {
          "id": "colonic_lipoma",
          "label": "Colonic lipoma",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Combines compressibility/yellow surface with a uniform hyperechoic submucosal lesion."
        },
        {
          "id": "choice.qq20261102b.b22-context.d1",
          "label": "Colonic lymphangioma",
          "isCorrect": false,
          "distractorRationale": "Can be deformable and submucosal, but ordinarily has fluid-containing/cystic internal spaces rather than the supplied uniform bright solid pattern."
        },
        {
          "id": "choice.qq20261102b.b22-context.d2",
          "label": "Gastrointestinal stromal tumor",
          "isCorrect": false,
          "distractorRationale": "Is a plausible solid subepithelial alternative, but the usual muscularis-propria hypoechoic pattern differs from these observations."
        }
      ],
      "explanation": "Interpret the wall layer and internal echo pattern before integrating the endoscopic behavior. A uniform hyperechoic submucosal lesion with this surface behavior supports lipoma; compressibility by itself is not the whole assessment.",
      "supportingEvidenceClaimIds": [
        "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
        "claim.qq20261102a.subepithelial-integrated-pattern"
      ],
      "teachingPoint": "Interpret the wall layer and internal echo pattern before integrating the endoscopic behavior. A uniform hyperechoic submucosal lesion with this surface behavior supports lipoma; compressibility by itself is not the whole assessment."
    }
  },
  {
    "id": "revision.qq20261102b.b24",
    "auditId": "B24",
    "caseId": "case.l2.gastric-malt.cd20-boundary.v1",
    "nodeId": "node.gastric-malt.cd20-alone-boundary.v1",
    "previousQuestionVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r3",
    "questionVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which next diagnostic action should classify {patientName}'s infiltrate?",
    "previousChoiceLabels": [
      "Endoscopic resampling for histology and immunophenotyping",
      "Clonality analysis using immunoglobulin gene-rearrangement testing",
      "Expanded immunohistochemical staining of the existing fragments"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Weigh clonal B-cell testing against the actual mixed-cell/gland-preserving morphology rather than equating a clone or CD20 with lymphoma. Then Choose a next strategy that resolves integrated classification, rather than another assay that confirms lineage/clonality or predicts response after diagnosis.",
    "reviewerNotes": "Melissa/hematopathology must confirm the constructed borderline pattern. Preserved glands do not exclude every lymphoma; no mandatory mapping scheme, test accuracy or clone-size threshold is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "lineage_not_diagnosis": "lineage_not_diagnosis",
      "choice.qq20261102b.b24.d1": "choice.qq20261102a.b24.d1",
      "choice.qq20261102b.b24.d2": "choice.qq20261102a.b24.d2"
    },
    "choiceServiceOverrides": {
      "lineage_not_diagnosis": null,
      "choice.qq20261102b.b24.d1": null,
      "choice.qq20261102b.b24.d2": null
    },
    "choiceTimingOverrides": {
      "lineage_not_diagnosis": {
        "kind": "test",
        "timingProfileId": "timing.test.upper_endoscopy"
      },
      "choice.qq20261102b.b24.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102b.b24.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r3",
      "whatChanged": "Replace announced specimen inadequacy with interpretable discordant morphology/clonality and compare repeat integrated histology, predictive fusion testing and confirmatory clonality testing.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B24",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Fairness response: BSH specifically cautions against clonality alone and recommends repeat endoscopy for diagnostic uncertainty. The raw morphology and clone are discordant enough that predictive fusion testing does not establish the missing integrated diagnosis. Clinical boundary: Melissa/hematopathology must confirm the constructed borderline pattern. Preserved glands do not exclude every lymphoma; no mandatory mapping scheme, test accuracy or clone-size threshold is invented.",
          "cues 2: Cue response: There is no crushed/inadequate-sample sentence and no fluid/outside-tissue filler. All three are concrete diagnostic investigations with comparable detail and plausible pathology purposes. Make a clonal result compete with morphology; repeat IG testing and predictive fusion testing now represent distinct real errors."
        ],
        "fairness": [
          "fairness 1: Fairness response: BSH specifically cautions against clonality alone and recommends repeat endoscopy for diagnostic uncertainty. The raw morphology and clone are discordant enough that predictive fusion testing does not establish the missing integrated diagnosis. Clinical boundary: Melissa/hematopathology must confirm the constructed borderline pattern. Preserved glands do not exclude every lymphoma; no mandatory mapping scheme, test accuracy or clone-size threshold is invented.",
          "fairness 2: Application revision: Weigh clonal B-cell testing against the actual mixed-cell/gland-preserving morphology rather than equating a clone or CD20 with lymphoma. Then Choose a next strategy that resolves integrated classification, rather than another assay that confirms lineage/clonality or predicts response after diagnosis. Closest error: A good resident may read the clonal CD20-positive result as completed MALT classification and advance to response-predictive BIRC3-MALT1 testing.",
          "fairness 3: Fairness response: BSH specifically cautions against clonality alone and recommends repeat endoscopy for diagnostic uncertainty. The raw morphology and clone are discordant enough that predictive fusion testing does not establish the missing integrated diagnosis. Clinical boundary: Melissa/hematopathology must confirm the constructed borderline pattern. Preserved glands do not exclude every lymphoma; no mandatory mapping scheme, test accuracy or clone-size threshold is invented.",
          "fairness 4: Revision/preservation: Remove the crushed/architecture-unrepresented announcement and provide actual mixed-cell and gland observations. There is no crushed/inadequate-sample sentence and no fluid/outside-tissue filler. All three are concrete diagnostic investigations with comparable detail and plausible pathology purposes.",
          "fairness 5: Revision/preservation: Make a clonal result compete with morphology; repeat IG testing and predictive fusion testing now represent distinct real errors. There is no crushed/inadequate-sample sentence and no fluid/outside-tissue filler. All three are concrete diagnostic investigations with comparable detail and plausible pathology purposes.",
          "fairness 6: Preserve the earlier positive repair while applying: Remove the crushed/architecture-unrepresented announcement and provide actual mixed-cell and gland observations.",
          "fairness 7: Preserve the earlier positive repair while applying: Make a clonal result compete with morphology; repeat IG testing and predictive fusion testing now represent distinct real errors.",
          "fairness 8: Fairness response: BSH specifically cautions against clonality alone and recommends repeat endoscopy for diagnostic uncertainty. The raw morphology and clone are discordant enough that predictive fusion testing does not establish the missing integrated diagnosis. Clinical boundary: Melissa/hematopathology must confirm the constructed borderline pattern. Preserved glands do not exclude every lymphoma; no mandatory mapping scheme, test accuracy or clone-size threshold is invented.",
          "fairness 9: Fairness response: BSH specifically cautions against clonality alone and recommends repeat endoscopy for diagnostic uncertainty. The raw morphology and clone are discordant enough that predictive fusion testing does not establish the missing integrated diagnosis. Clinical boundary: Melissa/hematopathology must confirm the constructed borderline pattern. Preserved glands do not exclude every lymphoma; no mandatory mapping scheme, test accuracy or clone-size threshold is invented.",
          "fairness 10: Preserve the earlier positive repair while applying: Make a clonal result compete with morphology; repeat IG testing and predictive fusion testing now represent distinct real errors.",
          "fairness 11: Application revision: Weigh clonal B-cell testing against the actual mixed-cell/gland-preserving morphology rather than equating a clone or CD20 with lymphoma. Then Choose a next strategy that resolves integrated classification, rather than another assay that confirms lineage/clonality or predicts response after diagnosis. Closest error: A good resident may read the clonal CD20-positive result as completed MALT classification and advance to response-predictive BIRC3-MALT1 testing.",
          "fairness 12: Preserve the earlier positive repair while applying: Remove the crushed/architecture-unrepresented announcement and provide actual mixed-cell and gland observations."
        ],
        "suggestions": [
          "suggestions 1: Application revision: Weigh clonal B-cell testing against the actual mixed-cell/gland-preserving morphology rather than equating a clone or CD20 with lymphoma. Then Choose a next strategy that resolves integrated classification, rather than another assay that confirms lineage/clonality or predicts response after diagnosis. Closest error: A good resident may read the clonal CD20-positive result as completed MALT classification and advance to response-predictive BIRC3-MALT1 testing.",
          "suggestions 2: Action: Make a clonal result compete with morphology; repeat IG testing and predictive fusion testing now represent distinct real errors."
        ]
      },
      "selfCheck": {
        "cueAttack": "There is no crushed/inadequate-sample sentence and no fluid/outside-tissue filler. All three are concrete diagnostic investigations with comparable detail and plausible pathology purposes.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Weigh clonal B-cell testing against the actual mixed-cell/gland-preserving morphology rather than equating a clone or CD20 with lymphoma.",
          "Choose a next strategy that resolves integrated classification, rather than another assay that confirms lineage/clonality or predicts response after diagnosis."
        ],
        "oneBestAnswer": "BSH specifically cautions against clonality alone and recommends repeat endoscopy for diagnostic uncertainty. The raw morphology and clone are discordant enough that predictive fusion testing does not establish the missing integrated diagnosis.",
        "closestDistractor": "A good resident may read the clonal CD20-positive result as completed MALT classification and advance to response-predictive BIRC3-MALT1 testing.",
        "remainingReview": "Melissa/hematopathology must confirm the constructed borderline pattern. Preserved glands do not exclude every lymphoma; no mandatory mapping scheme, test accuracy or clone-size threshold is invented."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.cd20-alone-boundary.v1.r4",
      "conceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "stem": "Which next investigation should clarify {patientName}'s gastric infiltrate?",
      "answerChoices": [
        {
          "id": "lineage_not_diagnosis",
          "label": "Repeat endoscopy with documented-site biopsies for histologic comparison",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Resolves integrated diagnostic uncertainty instead of treating a clone plus lineage as established MALT lymphoma."
        },
        {
          "id": "choice.qq20261102b.b24.d1",
          "label": "BIRC3-MALT1 fusion testing on the recorded gastric biopsy material",
          "isCorrect": false,
          "distractorRationale": "Is useful in established gastric MALT evaluation but does not alone resolve the current morphologic classification."
        },
        {
          "id": "choice.qq20261102b.b24.d2",
          "label": "Repeat immunoglobulin gene-rearrangement analysis on a second DNA extraction",
          "isCorrect": false,
          "distractorRationale": "Can corroborate a clone but does not convert clonality without characteristic morphology into a lymphoma diagnosis."
        }
      ],
      "explanation": "B-cell lineage and a clonal rearrangement need morphologic/clinical correlation: chronic inflammation can contain clonal B-cell expansions. The preserved gland epithelium in this sampled infiltrate does not supply the characteristic destructive gland interaction. Repeat documented biopsies and comparative expert review are appropriate for diagnostic uncertainty. Fusion testing and repeat clonality can contribute, but do not replace that assessment.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.integrated-pathologic-recognition",
        "claim.qq20261102a.gastric-lineage-not-classification",
        "claim.qq20261102b.gastric-clone-not-diagnosis",
        "claim.qq20261102b.gastric-uncertainty-repeat-biopsy"
      ],
      "teachingPoint": "B-cell lineage and a clonal rearrangement need morphologic/clinical correlation: chronic inflammation can contain clonal B-cell expansions. The preserved gland epithelium in this sampled infiltrate does not supply the characteristic destructive gland interaction. Repeat documented biopsies and comparative expert review are appropriate for diagnostic uncertainty. Fusion testing and repeat clonality can contribute, but do not replace that assessment."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic to review gastric biopsies obtained for dyspepsia. Small CD20-positive B cells form dense nodules among mixed inflammatory cells. In the sections shown, glands pass through the infiltrate with their epithelium preserved. Immunoglobulin gene-rearrangement testing reports a clonal B-cell population.",
    "previousPresentation": "{patientName}, a 43-year-old woman, visits the clinic to review gastric biopsies obtained for dyspepsia. The fragments contain crushed CD20-positive lymphoid cells; intact relationships between cells and glands are not represented in the material.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.l2.gastric-malt.cd20-boundary.v1",
        "patientPresentationVariantId": "presentation.gastric-malt.cd20-alone-boundary",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Gastric biopsy review",
        "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic to review gastric biopsies obtained for dyspepsia. The fragments contain crushed CD20-positive lymphoid cells; intact relationships between cells and glands are not represented in the material.",
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
      "idPrefix": "ppr.qq20261102b.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v6"
    }
  },
  {
    "id": "revision.qq20261102b.b25-context",
    "auditId": "B25-context",
    "caseId": "case.l2.gastric-malt.profile-to-followup-boundary.v1",
    "nodeId": "node.gastric-malt.pathology-profile-selection.v1",
    "previousQuestionVariantId": "question.gastric-malt.pathology-profile-selection.v1.r3",
    "questionVariantId": "question.gastric-malt.pathology-profile-selection.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which diagnosis best integrates {patientName}'s tissue architecture and marker pattern?",
    "previousChoiceLabels": [
      "Gastric extranodal marginal-zone lymphoma",
      "Gastric follicular lymphoma",
      "Gastric mantle-cell lymphoma"
    ],
    "previousCurrentUpdate": "Atypical B cells expand the gastric lamina propria and infiltrate glands. CD20 and CD79a stain the infiltrate; CD5, CD10 and cyclin D1 do not. The specimen does not show sheets of transformed large cells.",
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic integrated gastric small-B-cell pattern recognition; the passed companion tests the subsequent treatment/response decision.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "small_b_cells_lel": "small_b_cells_lel",
      "choice.qq20261102b.b25-context.d1": "choice.qq20261102a.b25-context.d1",
      "choice.qq20261102b.b25-context.d2": "choice.qq20261102a.b25-context.d2"
    },
    "choiceServiceOverrides": {
      "small_b_cells_lel": null,
      "choice.qq20261102b.b25-context.d1": null,
      "choice.qq20261102b.b25-context.d2": null
    },
    "currentUpdate": "Atypical B cells expand the gastric lamina propria and infiltrate glands. CD20 and CD79a stain the infiltrate; CD5, CD10 and cyclin D1 do not.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-malt.pathology-profile-selection.v1.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic integrated gastric small-B-cell pattern recognition; the passed companion tests the subsequent treatment/response decision.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B25-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Fairness response: The combined architecture and typical panel favor MALT-type marginal-zone lymphoma over the offered follicular and mantle-cell patterns. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 2: Explicit basicRecallIntentional: Intentional basic integrated gastric small-B-cell pattern recognition; the passed companion tests the subsequent treatment/response decision.",
          "fairness 3: Revision/preservation: Keep the passed later treatment/response item and shared presentation unchanged; do not add a second management construct to this pathology objective. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 4: Fairness response: The combined architecture and typical panel favor MALT-type marginal-zone lymphoma over the offered follicular and mantle-cell patterns. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 5: Preserve the earlier positive repair while applying: Keep the passed later treatment/response item and shared presentation unchanged; do not add a second management construct to this pathology objective.",
          "fairness 6: Preserve the earlier positive repair while applying: Delete the transformed-large-cell negative because no offered diagnosis is a large-cell alternative.",
          "fairness 7: Preserve the earlier positive repair while applying: Label integrated pattern classification basic rather than calling a long marker panel two-step application.",
          "fairness 8: Fairness response: The combined architecture and typical panel favor MALT-type marginal-zone lymphoma over the offered follicular and mantle-cell patterns. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 9: Preserve the earlier positive repair while applying: Delete the transformed-large-cell negative because no offered diagnosis is a large-cell alternative.",
          "fairness 10: Preserve the earlier positive repair while applying: Label integrated pattern classification basic rather than calling a long marker panel two-step application.",
          "fairness 11: Explicit basicRecallIntentional: Intentional basic integrated gastric small-B-cell pattern recognition; the passed companion tests the subsequent treatment/response decision.",
          "fairness 12: Revision/preservation: Keep the passed later treatment/response item and shared presentation unchanged; do not add a second management construct to this pathology objective. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Action: Delete the transformed-large-cell negative because no offered diagnosis is a large-cell alternative.",
          "suggestions 2: Explicit basicRecallIntentional: Intentional basic integrated gastric small-B-cell pattern recognition; the passed companion tests the subsequent treatment/response decision."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "The combined architecture and typical panel favor MALT-type marginal-zone lymphoma over the offered follicular and mantle-cell patterns.",
        "closestDistractor": "Overweighting B-cell lineage without integrating gland infiltration and the discriminating panel is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.pathology-profile-selection.v1.r4",
      "conceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "stem": "Which diagnosis fits {patientName}'s gastric architecture and marker pattern?",
      "answerChoices": [
        {
          "id": "small_b_cells_lel",
          "label": "Gastric extranodal marginal-zone lymphoma",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates gland infiltration with the typical B-cell phenotype and absence of markers supporting the closer alternatives."
        },
        {
          "id": "choice.qq20261102b.b25-context.d1",
          "label": "Gastric follicular lymphoma",
          "isCorrect": false,
          "distractorRationale": "Is a closer small-B-cell alternative, but the supplied architecture and absent germinal-center marker do not favor it."
        },
        {
          "id": "choice.qq20261102b.b25-context.d2",
          "label": "Gastric mantle-cell lymphoma",
          "isCorrect": false,
          "distractorRationale": "Is a closer small-B-cell alternative, but the supplied phenotype does not support its usual defining marker pattern."
        }
      ],
      "explanation": "Architecture and immunophenotype must be interpreted together. This integrated pattern supports gastric MALT-type extranodal marginal-zone lymphoma. No single absent stain is a universal exclusion and no marker alone supplies the diagnosis.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.integrated-pathologic-recognition",
        "claim.qq20261102a.gastric-small-b-cell-differential"
      ],
      "teachingPoint": "Architecture and immunophenotype must be interpreted together. This integrated pattern supports gastric MALT-type extranodal marginal-zone lymphoma. No single absent stain is a universal exclusion and no marker alone supplies the diagnosis."
    }
  },
  {
    "id": "revision.qq20261102b.b26",
    "auditId": "B26",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-040",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-040.1",
    "previousQuestionVariantId": "question.statistics-ethics.p-value.v2.r3",
    "questionVariantId": "question.statistics-ethics.p-value.v2.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
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
    "intendedInference": "Interpret the p-value using the specified null and alpha, independently of the effect's size. Then Translate a beneficial reduction into the intervention-minus-control interval and apply the explicit whole-interval target rule.",
    "reviewerNotes": "Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_p-040": "correct_p-040",
      "choice.qq20261102b.b26.d1": "choice.qq20261102a.b26.d1",
      "choice.qq20261102b.b26.d2": "choice.qq20261102a.b26.d2",
      "choice.qq20261102b.b26.d3": "choice.qq20261102a.b26.d3"
    },
    "choiceServiceOverrides": {
      "correct_p-040": null,
      "choice.qq20261102b.b26.d1": null,
      "choice.qq20261102b.b26.d2": null,
      "choice.qq20261102b.b26.d3": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.statistics-ethics.p-value.v2.r3",
      "whatChanged": "Name the adverse endpoint and beneficial direction, specify the whole-interval evidentiary rule, and qualify B39 exclusion as model/interval-based. Correct the singular percentage-point grammar.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B26",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "fairness 2: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "fairness 3: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "fairness 4: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "fairness 5: Preserve the earlier positive repair while applying: Qualify exclusion as outside the reported interval under its model, not impossible in reality; use '4 percentage points' correctly.",
          "fairness 6: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "fairness 7: Preserve the earlier positive repair while applying: State the hypothetical protocol's whole-interval confirmation/exclusion criterion without changing any numeric inputs.",
          "fairness 8: Preserve the earlier positive repair while applying: Qualify exclusion as outside the reported interval under its model, not impossible in reality; use '4 percentage points' correctly.",
          "fairness 9: Preserve the earlier positive repair while applying: Name unplanned reoperation and explicitly define lower risk as benefit.",
          "fairness 10: Revision/preservation: Name unplanned reoperation and explicitly define lower risk as benefit. Preserve the balanced four paired conclusions and all original numeric inputs. The protocol states the evidentiary rule, not the calculated conclusion; no uniquely cautious option identifies the key.",
          "fairness 11: Preserve the earlier positive repair while applying: Qualify exclusion as outside the reported interval under its model, not impossible in reality; use '4 percentage points' correctly."
        ],
        "suggestions": [
          "suggestions 1: Action: Name unplanned reoperation and explicitly define lower risk as benefit.",
          "suggestions 2: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "suggestions 3: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis."
        ]
      },
      "selfCheck": {
        "cueAttack": "Preserve the balanced four paired conclusions and all original numeric inputs. The protocol states the evidentiary rule, not the calculated conclusion; no uniquely cautious option identifies the key.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the p-value using the specified null and alpha, independently of the effect's size.",
          "Translate a beneficial reduction into the intervention-minus-control interval and apply the explicit whole-interval target rule."
        ],
        "oneBestAnswer": "The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion.",
        "closestDistractor": "Confusing statistical rejection of zero with confirmation or exclusion of a prespecified magnitude is the intended near miss.",
        "remainingReview": "Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v2.r4",
      "conceptId": "concept.statistics-ethics.p-value",
      "stem": "Which paired conclusion should {patientName} report from this study?",
      "answerChoices": [
        {
          "id": "correct_p-040",
          "label": "Zero-effect hypothesis not rejected; target benefit unconfirmed",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Separates the pre-specified null test from whether the whole interval supports the protocol's target benefit."
        },
        {
          "id": "choice.qq20261102b.b26.d1",
          "label": "Zero-effect hypothesis not rejected; target benefit demonstrated",
          "isCorrect": false,
          "distractorRationale": "Gets the null-test decision right but substitutes statistical significance or the point estimate for the protocol's magnitude criterion."
        },
        {
          "id": "choice.qq20261102b.b26.d2",
          "label": "Zero-effect hypothesis rejected; target benefit unconfirmed",
          "isCorrect": false,
          "distractorRationale": "Handles the magnitude criterion but misreads the pre-specified null test."
        },
        {
          "id": "choice.qq20261102b.b26.d3",
          "label": "Zero-effect hypothesis rejected; target benefit demonstrated",
          "isCorrect": false,
          "distractorRationale": "Conflates the null-test and magnitude decisions."
        }
      ],
      "explanation": "The endpoint and benefit direction are explicit, and the target is judged by the whole confidence interval rather than its point estimate. Interpret the zero-effect test separately from the hypothetical minimum-benefit rule. For this dataset the target is not established by the reported interval. Confidence-interval exclusion is model-based, not a claim that a true effect outside it is impossible.",
      "teachingPoint": "The endpoint and benefit direction are explicit, and the target is judged by the whole confidence interval rather than its point estimate. Interpret the zero-effect test separately from the hypothetical minimum-benefit rule. For this dataset the target is not established by the reported interval. Confidence-interval exclusion is model-based, not a claim that a true effect outside it is impossible.",
      "exhibit": {
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
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.p-value",
        "claim.qq20261102a.null-test-versus-protocol-magnitude",
        "claim.qq20261102b.specified-interval-decision-rule"
      ]
    },
    "presentationTemplate": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The endpoint is unplanned reoperation; a lower event risk is beneficial. The hypothetical protocol tests zero risk difference at two-sided alpha 0.05. It confirms a benefit of at least 4 percentage points only if the entire reported 95% interval reaches at least that reduction; it excludes that target under the interval model if the entire interval falls short of it.",
    "previousPresentation": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The protocol tests a zero risk difference at a two-sided 0.05 level and separately specifies a benefit of at least 4 percentage points for its study decision.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.gs028se.arr-nnt-p-value.b-p-040",
        "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-040",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Thyroid surgery study",
        "revisedPresentation": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The protocol tests a zero risk difference at a two-sided 0.05 level and separately specifies a benefit of at least 4 percentage points for its study decision.",
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
      "idPrefix": "ppr.qq20261102b.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v6"
    }
  },
  {
    "id": "revision.qq20261102b.b27",
    "auditId": "B27",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-003",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-003.1",
    "previousQuestionVariantId": "question.statistics-ethics.p-value.v1.r3",
    "questionVariantId": "question.statistics-ethics.p-value.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which paired conclusion should {patientName} report from this study?",
    "previousChoiceLabels": [
      "Zero-effect hypothesis rejected; target benefit unconfirmed",
      "Zero-effect hypothesis rejected; target benefit demonstrated",
      "Zero-effect hypothesis not rejected; target benefit unconfirmed",
      "Zero-effect hypothesis not rejected; target benefit demonstrated"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Constructed teaching dataset and hypothetical protocol criteria; not a clinical benefit threshold.",
      "items": [
        {
          "label": "Risk difference: intervention minus control",
          "value": "-6 percentage points"
        },
        {
          "label": "Approximate 95% confidence interval",
          "value": "-11.4 to -0.6 percentage points"
        },
        {
          "label": "Two-sided p-value",
          "value": "0.03"
        }
      ]
    },
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the p-value using the specified null and alpha, independently of the effect's size. Then Translate a beneficial reduction into the intervention-minus-control interval and apply the explicit whole-interval target rule.",
    "reviewerNotes": "Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_p-003": "correct_p-003",
      "choice.qq20261102b.b27.d1": "choice.qq20261102a.b27.d1",
      "choice.qq20261102b.b27.d2": "choice.qq20261102a.b27.d2",
      "choice.qq20261102b.b27.d3": "choice.qq20261102a.b27.d3"
    },
    "choiceServiceOverrides": {
      "correct_p-003": null,
      "choice.qq20261102b.b27.d1": null,
      "choice.qq20261102b.b27.d2": null,
      "choice.qq20261102b.b27.d3": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.statistics-ethics.p-value.v1.r3",
      "whatChanged": "Name the adverse endpoint and beneficial direction, specify the whole-interval evidentiary rule, and qualify B39 exclusion as model/interval-based. Correct the singular percentage-point grammar.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B27",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "fairness 2: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "fairness 3: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "fairness 4: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "fairness 5: Preserve the earlier positive repair while applying: Qualify exclusion as outside the reported interval under its model, not impossible in reality; use '4 percentage points' correctly.",
          "fairness 6: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "fairness 7: Preserve the earlier positive repair while applying: State the hypothetical protocol's whole-interval confirmation/exclusion criterion without changing any numeric inputs.",
          "fairness 8: Preserve the earlier positive repair while applying: Qualify exclusion as outside the reported interval under its model, not impossible in reality; use '4 percentage points' correctly.",
          "fairness 9: Preserve the earlier positive repair while applying: Name unplanned readmission and explicitly define lower risk as benefit.",
          "fairness 10: Revision/preservation: Name unplanned readmission and explicitly define lower risk as benefit. Preserve the balanced four paired conclusions and all original numeric inputs. The protocol states the evidentiary rule, not the calculated conclusion; no uniquely cautious option identifies the key.",
          "fairness 11: Preserve the earlier positive repair while applying: Qualify exclusion as outside the reported interval under its model, not impossible in reality; use '4 percentage points' correctly."
        ],
        "suggestions": [
          "suggestions 1: Action: Name unplanned readmission and explicitly define lower risk as benefit.",
          "suggestions 2: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "suggestions 3: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis."
        ]
      },
      "selfCheck": {
        "cueAttack": "Preserve the balanced four paired conclusions and all original numeric inputs. The protocol states the evidentiary rule, not the calculated conclusion; no uniquely cautious option identifies the key.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the p-value using the specified null and alpha, independently of the effect's size.",
          "Translate a beneficial reduction into the intervention-minus-control interval and apply the explicit whole-interval target rule."
        ],
        "oneBestAnswer": "The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion.",
        "closestDistractor": "The point estimate exceeds a four-point reduction, so a resident may incorrectly call the target demonstrated despite the interval including much smaller reductions.",
        "remainingReview": "Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v1.r4",
      "conceptId": "concept.statistics-ethics.p-value",
      "stem": "Which paired conclusion should {patientName} report from this study?",
      "answerChoices": [
        {
          "id": "correct_p-003",
          "label": "Zero-effect hypothesis rejected; target benefit unconfirmed",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Separates the pre-specified null test from whether the whole interval supports the protocol's target benefit."
        },
        {
          "id": "choice.qq20261102b.b27.d1",
          "label": "Zero-effect hypothesis rejected; target benefit demonstrated",
          "isCorrect": false,
          "distractorRationale": "Gets the null-test decision right but substitutes statistical significance or the point estimate for the protocol's magnitude criterion."
        },
        {
          "id": "choice.qq20261102b.b27.d2",
          "label": "Zero-effect hypothesis not rejected; target benefit unconfirmed",
          "isCorrect": false,
          "distractorRationale": "Handles the magnitude criterion but misreads the pre-specified null test."
        },
        {
          "id": "choice.qq20261102b.b27.d3",
          "label": "Zero-effect hypothesis not rejected; target benefit demonstrated",
          "isCorrect": false,
          "distractorRationale": "Conflates the null-test and magnitude decisions."
        }
      ],
      "explanation": "The endpoint and benefit direction are explicit, and the target is judged by the whole confidence interval rather than its point estimate. Interpret the zero-effect test separately from the hypothetical minimum-benefit rule. For this dataset the target is not established by the reported interval. Confidence-interval exclusion is model-based, not a claim that a true effect outside it is impossible.",
      "teachingPoint": "The endpoint and benefit direction are explicit, and the target is judged by the whole confidence interval rather than its point estimate. Interpret the zero-effect test separately from the hypothetical minimum-benefit rule. For this dataset the target is not established by the reported interval. Confidence-interval exclusion is model-based, not a claim that a true effect outside it is impossible.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed teaching dataset and hypothetical protocol criteria; not a clinical benefit threshold.",
        "items": [
          {
            "label": "Risk difference: intervention minus control",
            "value": "-6 percentage points"
          },
          {
            "label": "Approximate 95% confidence interval",
            "value": "-11.4 to -0.6 percentage points"
          },
          {
            "label": "Two-sided p-value",
            "value": "0.03"
          }
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.p-value",
        "claim.qq20261102a.null-test-versus-protocol-magnitude",
        "claim.qq20261102b.specified-interval-decision-rule"
      ]
    },
    "presentationTemplate": "{patientName} leads an employee journal-club discussion of a constructed randomized colon surgery comparison. The endpoint is unplanned readmission; a lower event risk is beneficial. The hypothetical protocol tests zero risk difference at two-sided alpha 0.05. It confirms a benefit of at least 4 percentage points only if the entire reported 95% interval reaches at least that reduction; it excludes that target under the interval model if the entire interval falls short of it.",
    "previousPresentation": "{patientName} leads an employee journal-club discussion of a constructed randomized colon surgery comparison. The protocol tests a zero risk difference at a two-sided 0.05 level and separately specifies a benefit of at least 4 percentage points for its study decision.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.gs028se.arr-nnt-p-value.b-p-003",
        "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-003",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Colon surgery study",
        "revisedPresentation": "{patientName} leads an employee journal-club discussion of a constructed randomized colon surgery comparison. The protocol tests a zero risk difference at a two-sided 0.05 level and separately specifies a benefit of at least 4 percentage points for its study decision.",
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
      "idPrefix": "ppr.qq20261102b.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v6"
    }
  },
  {
    "id": "revision.qq20261102b.b29",
    "auditId": "B29",
    "caseId": "case.variety3.sedation-discharge-ride",
    "nodeId": "node.variety3.sedation-discharge-ride.1",
    "previousQuestionVariantId": "question.variety3.sedation-discharge-ride.v1.r3",
    "questionVariantId": "question.variety3.sedation-discharge-ride.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which discharge arrangement should be booked for George Harris?",
    "previousChoiceLabels": [
      "Monitor for recurrent sedation; arrange an adult escort and home support",
      "Discharge when orientation returns; arrange an adult escort and home support",
      "Monitor for recurrent sedation; use driver-only transport with remote handover",
      "Discharge when orientation returns; use driver-only transport with remote handover"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic post-sedation recovery/escort item applying an explicit constructed unit protocol; it is not counted as a difficult resident pharmacology or transport-policy item.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "choice.sedation-discharge-ride.adult": "choice.sedation-discharge-ride.adult",
      "choice.qq20261102b.b29.d1": "choice.qq20261102a.b29.d1",
      "choice.qq20261102b.b29.d2": "choice.qq20261102a.b29.d2",
      "choice.qq20261102b.b29.d3": "choice.qq20261102a.b29.d3"
    },
    "choiceServiceOverrides": {
      "choice.sedation-discharge-ride.adult": null,
      "choice.qq20261102b.b29.d1": null,
      "choice.qq20261102b.b29.d2": null,
      "choice.qq20261102b.b29.d3": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.variety3.sedation-discharge-ride.v1.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic post-sedation recovery/escort item applying an explicit constructed unit protocol; it is not counted as a difficult resident pharmacology or transport-policy item.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B29",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Fairness response: Only the monitored-recovery plus adult-escort/home-support combination addresses both supplied issues. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "cues 2: Cue response: This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria. Supply the applicable constructed protocol rather than assert a universal prohibition on all commercial drivers or transport services."
        ],
        "fairness": [
          "fairness 1: Fairness response: Only the monitored-recovery plus adult-escort/home-support combination addresses both supplied issues. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 2: Explicit basicRecallIntentional: Intentional basic post-sedation recovery/escort item applying an explicit constructed unit protocol; it is not counted as a difficult resident pharmacology or transport-policy item.",
          "fairness 3: Revision/preservation: Use role-based adult accompaniment and handover, not a family-only rule or an invented exact observation time. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 4: Preserve the earlier positive repair while applying: Supply the applicable constructed protocol rather than assert a universal prohibition on all commercial drivers or transport services.",
          "fairness 5: Preserve the earlier positive repair while applying: Use role-based adult accompaniment and handover, not a family-only rule or an invented exact observation time.",
          "fairness 6: Explicit basicRecallIntentional: Intentional basic post-sedation recovery/escort item applying an explicit constructed unit protocol; it is not counted as a difficult resident pharmacology or transport-policy item.",
          "fairness 7: Preserve the earlier positive repair while applying: Supply the applicable constructed protocol rather than assert a universal prohibition on all commercial drivers or transport services.",
          "fairness 8: Fairness response: Only the monitored-recovery plus adult-escort/home-support combination addresses both supplied issues. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 9: Explicit basicRecallIntentional: Intentional basic post-sedation recovery/escort item applying an explicit constructed unit protocol; it is not counted as a difficult resident pharmacology or transport-policy item.",
          "fairness 10: Revision/preservation: Retain the flumazenil/recovery observations and both independent requirements, but label the item intentionally basic. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 11: Revision/preservation: Supply the applicable constructed protocol rather than assert a universal prohibition on all commercial drivers or transport services. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 12: Revision/preservation: Use role-based adult accompaniment and handover, not a family-only rule or an invented exact observation time. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Action: Retain the flumazenil/recovery observations and both independent requirements, but label the item intentionally basic.",
          "suggestions 2: Action: Supply the applicable constructed protocol rather than assert a universal prohibition on all commercial drivers or transport services.",
          "suggestions 3: Fairness response: Only the monitored-recovery plus adult-escort/home-support combination addresses both supplied issues. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Only the monitored-recovery plus adult-escort/home-support combination addresses both supplied issues.",
        "closestDistractor": "Assuming normal orientation after flumazenil permits immediate discharge, even with an otherwise appropriate escort, is a credible clinical error.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.variety3.sedation-discharge-ride.v1.r4",
      "conceptId": "concept.variety3.endoscopic-sedation-escort-planning",
      "stem": "Which discharge arrangement should be booked for George Harris?",
      "answerChoices": [
        {
          "id": "choice.sedation-discharge-ride.adult",
          "label": "Continue recovery; book an adult escort with handover to the sister",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Meets the represented recovery and explicit escort/handover requirements."
        },
        {
          "id": "choice.qq20261102b.b29.d1",
          "label": "End recovery now; book an adult escort with handover to the sister",
          "isCorrect": false,
          "distractorRationale": "Provides the escort but treats immediate orientation after reversal as the completed recovery assessment."
        },
        {
          "id": "choice.qq20261102b.b29.d2",
          "label": "Continue recovery; book driver-only transport with telephone handover",
          "isCorrect": false,
          "distractorRationale": "Addresses recovery but does not supply the accompanying care role defined by this case's protocol."
        },
        {
          "id": "choice.qq20261102b.b29.d3",
          "label": "End recovery now; book driver-only transport with telephone handover",
          "isCorrect": false,
          "distractorRationale": "Treats both observed orientation and remote handover as sufficient under a protocol they do not satisfy."
        }
      ],
      "explanation": "Recovery after flumazenil requires further assessment for recurrent sedation; apparent return to baseline is not by itself the full discharge decision. The responsible-adult accompaniment/home-support requirement also remains. Arrange an appropriate escort and handover rather than treating a driver-only journey as that care role.",
      "teachingPoint": "Recovery after flumazenil requires further assessment for recurrent sedation; apparent return to baseline is not by itself the full discharge decision. The responsible-adult accompaniment/home-support requirement also remains. Arrange an appropriate escort and handover rather than treating a driver-only journey as that care role.",
      "supportingEvidenceClaimIds": [
        "claim.variety3.sedation.no-self-driving",
        "claim.variety3.sedation.adult-collection-support",
        "claim.variety3.sedation.residual-effects",
        "claim.qq20261102a.sedation-supported-discharge",
        "claim.qq20261102a.sedation-after-reversal"
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed unit discharge protocol for this case; clinical review pending.",
        "items": [
          {
            "label": "Clinical release",
            "value": "Document satisfactory recovery, including assessment after a reversal agent."
          },
          {
            "label": "Travel and home handover",
            "value": "A suitable adult accepts clinical handover, accompanies the patient home and can provide early recovery support. A driver who only drives does not fulfil that care role."
          }
        ]
      }
    }
  },
  {
    "id": "revision.qq20261102b.b30",
    "auditId": "B30",
    "caseId": "case.l2.gastric-malt.integrated-diagnosis-to-treatment.v1",
    "nodeId": "node.gastric-malt.integrated-pathology-diagnosis.v1",
    "previousQuestionVariantId": "question.gastric-malt.integrated-pathology-diagnosis.v1.r3",
    "questionVariantId": "question.gastric-malt.integrated-pathology-diagnosis.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which diagnosis best fits {patientName}'s integrated biopsy findings?",
    "previousChoiceLabels": [
      "Gastric extranodal marginal-zone lymphoma",
      "Gastric follicular lymphoma",
      "Gastric mantle-cell lymphoma"
    ],
    "previousCurrentUpdate": "Atypical B cells expand the gastric lamina propria and infiltrate glands. CD20 and CD79a stain the infiltrate; CD5, CD10 and cyclin D1 do not. The infiltrate contains lymphocytes with irregular nuclei and pale cytoplasm around and within gastric glands.",
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic integrated gastric lymphoma classification; adding treatment here would duplicate the unchanged passed eradication/response companion and change the narrow pathology objective.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "gastric_malt": "gastric_malt",
      "choice.qq20261102b.b30.d1": "choice.qq20261102a.b30.d1",
      "choice.qq20261102b.b30.d2": "choice.qq20261102a.b30.d2"
    },
    "choiceServiceOverrides": {
      "gastric_malt": null,
      "choice.qq20261102b.b30.d1": null,
      "choice.qq20261102b.b30.d2": null
    },
    "currentUpdate": "The gastric infiltrate contains small atypical B cells with irregular nuclei and pale cytoplasm expanding the lamina propria and entering gland epithelium. CD20 and CD79a stain the infiltrate; CD5, CD10 and cyclin D1 do not.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-malt.integrated-pathology-diagnosis.v1.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic integrated gastric lymphoma classification; adding treatment here would duplicate the unchanged passed eradication/response companion and change the narrow pathology objective.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B30",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Revision/preservation: Consolidate the repeated gland-interaction sentences into one morphology observation. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 2: Explicit basicRecallIntentional: Intentional basic integrated gastric lymphoma classification; adding treatment here would duplicate the unchanged passed eradication/response companion and change the narrow pathology objective.",
          "fairness 3: Fairness response: The integrated typical pattern supports marginal-zone/MALT rather than the alternative small-B-cell processes. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Preserve the earlier positive repair while applying: Retain the integrated architecture/panel and real small-B-cell alternatives, without claiming that multiple markers constitute two consequential steps.",
          "fairness 5: Preserve the earlier positive repair while applying: Label this pathology objective basic and leave the passed treatment/response companion, shared presentation and its exact question version unchanged.",
          "fairness 6: Preserve the earlier positive repair while applying: Consolidate the repeated gland-interaction sentences into one morphology observation.",
          "fairness 7: Explicit basicRecallIntentional: Intentional basic integrated gastric lymphoma classification; adding treatment here would duplicate the unchanged passed eradication/response companion and change the narrow pathology objective.",
          "fairness 8: Preserve the earlier positive repair while applying: Label this pathology objective basic and leave the passed treatment/response companion, shared presentation and its exact question version unchanged.",
          "fairness 9: Revision/preservation: Label this pathology objective basic and leave the passed treatment/response companion, shared presentation and its exact question version unchanged. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 10: Preserve the earlier positive repair while applying: Retain the integrated architecture/panel and real small-B-cell alternatives, without claiming that multiple markers constitute two consequential steps.",
          "fairness 11: Revision/preservation: Retain the integrated architecture/panel and real small-B-cell alternatives, without claiming that multiple markers constitute two consequential steps. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria."
        ],
        "suggestions": [
          "suggestions 1: Explicit basicRecallIntentional: Intentional basic integrated gastric lymphoma classification; adding treatment here would duplicate the unchanged passed eradication/response companion and change the narrow pathology objective.",
          "suggestions 2: Action: Retain the integrated architecture/panel and real small-B-cell alternatives, without claiming that multiple markers constitute two consequential steps."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "The integrated typical pattern supports marginal-zone/MALT rather than the alternative small-B-cell processes.",
        "closestDistractor": "Recognizing B cells but misassigning the subtype by one shared feature is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.integrated-pathology-diagnosis.v1.r4",
      "conceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "stem": "Which diagnosis fits {patientName}'s integrated gastric biopsy findings?",
      "answerChoices": [
        {
          "id": "gastric_malt",
          "label": "Gastric extranodal marginal-zone lymphoma",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the gland-infiltrating marginal-zone-type architecture and typical B-cell marker profile."
        },
        {
          "id": "choice.qq20261102b.b30.d1",
          "label": "Gastric follicular lymphoma",
          "isCorrect": false,
          "distractorRationale": "Requires a different integrated architectural/germinal-center pattern rather than B-cell lineage alone."
        },
        {
          "id": "choice.qq20261102b.b30.d2",
          "label": "Gastric mantle-cell lymphoma",
          "isCorrect": false,
          "distractorRationale": "Is a small-B-cell competitor but is not favored by the integrated marker/architectural findings."
        }
      ],
      "explanation": "The architecture and phenotype together support MALT-type extranodal marginal-zone lymphoma. Follicular and mantle-cell lymphoma are closer small-B-cell alternatives than a large-cell label dismissed by a size adjective. Marker exceptions still require integrated pathology review.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.integrated-pathologic-recognition",
        "claim.qq20261102a.gastric-small-b-cell-differential"
      ],
      "teachingPoint": "The architecture and phenotype together support MALT-type extranodal marginal-zone lymphoma. Follicular and mantle-cell lymphoma are closer small-B-cell alternatives than a large-cell label dismissed by a size adjective. Marker exceptions still require integrated pathology review."
    }
  },
  {
    "id": "revision.qq20261102b.b32-context",
    "auditId": "B32-context",
    "caseId": "case.pancreatic-pseudocyst.early-satiety",
    "nodeId": "node.pancreatic-pseudocyst.early-satiety.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v1.r3",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which examination protocol should evaluate {patientName}'s persistent upper-abdominal symptoms?",
    "previousChoiceLabels": [
      "CT abdomen with intravenous contrast",
      "CT abdomen with oral luminal contrast",
      "CT abdomen without contrast material"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_0": "ct_0",
      "choice.qq20261102b.b32-context.d1": "choice.qq20261102a.b32-context.d1",
      "choice.qq20261102b.b32-context.d2": "choice.qq20261102a.b32-context.d2"
    },
    "choiceServiceOverrides": {
      "ct_0": "service.ct",
      "choice.qq20261102b.b32-context.d1": null,
      "choice.qq20261102b.b32-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_0": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102b.b32-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102b.b32-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.contrast-ct-characterization.v1.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B32-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "cues 2: Cue response: This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria. Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage."
        ],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "fairness 2: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 3: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Preserve the earlier positive repair while applying: Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage.",
          "fairness 5: Preserve the earlier positive repair while applying: Explicitly label this contrast-route rule basic; do not add a hemorrhage/duct problem that would contradict the unchanged passed later collection case.",
          "fairness 6: Preserve the earlier positive repair while applying: Make every protocol mutually exclusive using parallel given/omitted route fields; oral contrast no longer ambiguously permits intravenous contrast too.",
          "fairness 7: Preserve the earlier positive repair while applying: Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage.",
          "fairness 8: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "fairness 9: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 10: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "fairness 11: Preserve the earlier positive repair while applying: Explicitly label this contrast-route rule basic; do not add a hemorrhage/duct problem that would contradict the unchanged passed later collection case.",
          "fairness 12: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 13: Preserve the earlier positive repair while applying: Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "suggestions 2: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "suggestions 3: Action: Explicitly label this contrast-route rule basic; do not add a hemorrhage/duct problem that would contradict the unchanged passed later collection case."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination.",
        "closestDistractor": "Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v1.r4",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization",
      "stem": "Which CT protocol should be requested for {patientName}'s ongoing upper-abdominal symptoms?",
      "answerChoices": [
        {
          "id": "ct_0",
          "label": "Abdominal CT: intravenous contrast given; oral contrast omitted",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides enhancement information for pancreatic-region characterization in the offered protocol set."
        },
        {
          "id": "choice.qq20261102b.b32-context.d1",
          "label": "Abdominal CT: intravenous contrast omitted; oral contrast given",
          "isCorrect": false,
          "distractorRationale": "Supplies bowel-lumen contrast rather than intravenous enhancement; the two routes are explicitly distinguished."
        },
        {
          "id": "choice.qq20261102b.b32-context.d2",
          "label": "Abdominal CT: intravenous contrast omitted; oral contrast omitted",
          "isCorrect": false,
          "distractorRationale": "Provides an unenhanced survey rather than the enhancement assessment needed for this represented question."
        }
      ],
      "explanation": "Persistent symptoms after pancreatitis require evaluation of possible structural complications. Contrast-enhanced CT characterizes the pancreatic region and its relationships; oral contrast or a noncontrast survey does not replace intravenous enhancement. MRI can also be appropriate in selected circumstances and is not offered as a falsely invalid alternative.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.qq20261102a.pancreatic-contrast-characterization"
      ],
      "teachingPoint": "Persistent symptoms after pancreatitis require evaluation of possible structural complications. Contrast-enhanced CT characterizes the pancreatic region and its relationships; oral contrast or a noncontrast survey does not replace intravenous enhancement. MRI can also be appropriate in selected circumstances and is not offered as a falsely invalid alternative."
    }
  },
  {
    "id": "revision.qq20261102b.b33-context",
    "auditId": "B33-context",
    "caseId": "case.pancreatic-pseudocyst.postmeal-vomiting",
    "nodeId": "node.pancreatic-pseudocyst.postmeal-vomiting.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v2.r3",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v2.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which examination protocol should evaluate {patientName}'s persistent upper-abdominal symptoms?",
    "previousChoiceLabels": [
      "CT abdomen with intravenous contrast",
      "CT abdomen with oral luminal contrast",
      "CT abdomen without contrast material"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_1": "ct_1",
      "choice.qq20261102b.b33-context.d1": "choice.qq20261102a.b33-context.d1",
      "choice.qq20261102b.b33-context.d2": "choice.qq20261102a.b33-context.d2"
    },
    "choiceServiceOverrides": {
      "ct_1": "service.ct",
      "choice.qq20261102b.b33-context.d1": null,
      "choice.qq20261102b.b33-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102b.b33-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102b.b33-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.contrast-ct-characterization.v2.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B33-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "cues 2: Cue response: This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria. Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage."
        ],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "fairness 2: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 3: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Preserve the earlier positive repair while applying: Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage.",
          "fairness 5: Preserve the earlier positive repair while applying: Explicitly label this contrast-route rule basic; do not add a hemorrhage/duct problem that would contradict the unchanged passed later collection case.",
          "fairness 6: Preserve the earlier positive repair while applying: Make every protocol mutually exclusive using parallel given/omitted route fields; oral contrast no longer ambiguously permits intravenous contrast too.",
          "fairness 7: Preserve the earlier positive repair while applying: Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage.",
          "fairness 8: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "fairness 9: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 10: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "fairness 11: Preserve the earlier positive repair while applying: Explicitly label this contrast-route rule basic; do not add a hemorrhage/duct problem that would contradict the unchanged passed later collection case.",
          "fairness 12: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 13: Preserve the earlier positive repair while applying: Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "suggestions 2: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "suggestions 3: Action: Explicitly label this contrast-route rule basic; do not add a hemorrhage/duct problem that would contradict the unchanged passed later collection case."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination.",
        "closestDistractor": "Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v2.r4",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization",
      "stem": "Which CT protocol should be requested for {patientName}'s ongoing upper-abdominal symptoms?",
      "answerChoices": [
        {
          "id": "ct_1",
          "label": "Abdominal CT: intravenous contrast given; oral contrast omitted",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides enhancement information for pancreatic-region characterization in the offered protocol set."
        },
        {
          "id": "choice.qq20261102b.b33-context.d1",
          "label": "Abdominal CT: intravenous contrast omitted; oral contrast given",
          "isCorrect": false,
          "distractorRationale": "Supplies bowel-lumen contrast rather than intravenous enhancement; the two routes are explicitly distinguished."
        },
        {
          "id": "choice.qq20261102b.b33-context.d2",
          "label": "Abdominal CT: intravenous contrast omitted; oral contrast omitted",
          "isCorrect": false,
          "distractorRationale": "Provides an unenhanced survey rather than the enhancement assessment needed for this represented question."
        }
      ],
      "explanation": "Persistent symptoms after pancreatitis require evaluation of possible structural complications. Contrast-enhanced CT characterizes the pancreatic region and its relationships; oral contrast or a noncontrast survey does not replace intravenous enhancement. MRI can also be appropriate in selected circumstances and is not offered as a falsely invalid alternative.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.qq20261102a.pancreatic-contrast-characterization"
      ],
      "teachingPoint": "Persistent symptoms after pancreatitis require evaluation of possible structural complications. Contrast-enhanced CT characterizes the pancreatic region and its relationships; oral contrast or a noncontrast survey does not replace intravenous enhancement. MRI can also be appropriate in selected circumstances and is not offered as a falsely invalid alternative."
    }
  },
  {
    "id": "revision.qq20261102b.b34-context",
    "auditId": "B34-context",
    "caseId": "case.pancreatic-pseudocyst.persistent-pain",
    "nodeId": "node.pancreatic-pseudocyst.persistent-pain.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v3.r3",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v3.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which examination protocol should evaluate {patientName}'s persistent upper-abdominal symptoms?",
    "previousChoiceLabels": [
      "CT abdomen with intravenous contrast",
      "CT abdomen with oral luminal contrast",
      "CT abdomen without contrast material"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_2": "ct_2",
      "choice.qq20261102b.b34-context.d1": "choice.qq20261102a.b34-context.d1",
      "choice.qq20261102b.b34-context.d2": "choice.qq20261102a.b34-context.d2"
    },
    "choiceServiceOverrides": {
      "ct_2": "service.ct",
      "choice.qq20261102b.b34-context.d1": null,
      "choice.qq20261102b.b34-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102b.b34-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102b.b34-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.contrast-ct-characterization.v3.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B34-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "cues 2: Cue response: This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria. Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage."
        ],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "fairness 2: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 3: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Preserve the earlier positive repair while applying: Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage.",
          "fairness 5: Preserve the earlier positive repair while applying: Explicitly label this contrast-route rule basic; do not add a hemorrhage/duct problem that would contradict the unchanged passed later collection case.",
          "fairness 6: Preserve the earlier positive repair while applying: Make every protocol mutually exclusive using parallel given/omitted route fields; oral contrast no longer ambiguously permits intravenous contrast too.",
          "fairness 7: Preserve the earlier positive repair while applying: Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage.",
          "fairness 8: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "fairness 9: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 10: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "fairness 11: Preserve the earlier positive repair while applying: Explicitly label this contrast-route rule basic; do not add a hemorrhage/duct problem that would contradict the unchanged passed later collection case.",
          "fairness 12: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 13: Preserve the earlier positive repair while applying: Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "suggestions 2: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "suggestions 3: Action: Explicitly label this contrast-route rule basic; do not add a hemorrhage/duct problem that would contradict the unchanged passed later collection case."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination.",
        "closestDistractor": "Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v3.r4",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization",
      "stem": "Which CT protocol should be requested for {patientName}'s ongoing upper-abdominal symptoms?",
      "answerChoices": [
        {
          "id": "ct_2",
          "label": "Abdominal CT: intravenous contrast given; oral contrast omitted",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides enhancement information for pancreatic-region characterization in the offered protocol set."
        },
        {
          "id": "choice.qq20261102b.b34-context.d1",
          "label": "Abdominal CT: intravenous contrast omitted; oral contrast given",
          "isCorrect": false,
          "distractorRationale": "Supplies bowel-lumen contrast rather than intravenous enhancement; the two routes are explicitly distinguished."
        },
        {
          "id": "choice.qq20261102b.b34-context.d2",
          "label": "Abdominal CT: intravenous contrast omitted; oral contrast omitted",
          "isCorrect": false,
          "distractorRationale": "Provides an unenhanced survey rather than the enhancement assessment needed for this represented question."
        }
      ],
      "explanation": "Persistent symptoms after pancreatitis require evaluation of possible structural complications. Contrast-enhanced CT characterizes the pancreatic region and its relationships; oral contrast or a noncontrast survey does not replace intravenous enhancement. MRI can also be appropriate in selected circumstances and is not offered as a falsely invalid alternative.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.qq20261102a.pancreatic-contrast-characterization"
      ],
      "teachingPoint": "Persistent symptoms after pancreatitis require evaluation of possible structural complications. Contrast-enhanced CT characterizes the pancreatic region and its relationships; oral contrast or a noncontrast survey does not replace intravenous enhancement. MRI can also be appropriate in selected circumstances and is not offered as a falsely invalid alternative."
    }
  },
  {
    "id": "revision.qq20261102b.b35-context",
    "auditId": "B35-context",
    "caseId": "case.pancreatic-pseudocyst.reduced-intake",
    "nodeId": "node.pancreatic-pseudocyst.reduced-intake.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v4.r3",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which examination protocol should evaluate {patientName}'s persistent upper-abdominal symptoms?",
    "previousChoiceLabels": [
      "CT abdomen with intravenous contrast",
      "CT abdomen with oral luminal contrast",
      "CT abdomen without contrast material"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_3": "ct_3",
      "choice.qq20261102b.b35-context.d1": "choice.qq20261102a.b35-context.d1",
      "choice.qq20261102b.b35-context.d2": "choice.qq20261102a.b35-context.d2"
    },
    "choiceServiceOverrides": {
      "ct_3": "service.ct",
      "choice.qq20261102b.b35-context.d1": null,
      "choice.qq20261102b.b35-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_3": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102b.b35-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102b.b35-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.contrast-ct-characterization.v4.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B35-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "cues 2: Cue response: This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria. Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage."
        ],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "fairness 2: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 3: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Preserve the earlier positive repair while applying: Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage.",
          "fairness 5: Preserve the earlier positive repair while applying: Explicitly label this contrast-route rule basic; do not add a hemorrhage/duct problem that would contradict the unchanged passed later collection case.",
          "fairness 6: Preserve the earlier positive repair while applying: Make every protocol mutually exclusive using parallel given/omitted route fields; oral contrast no longer ambiguously permits intravenous contrast too.",
          "fairness 7: Preserve the earlier positive repair while applying: Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage.",
          "fairness 8: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "fairness 9: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 10: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "fairness 11: Preserve the earlier positive repair while applying: Explicitly label this contrast-route rule basic; do not add a hemorrhage/duct problem that would contradict the unchanged passed later collection case.",
          "fairness 12: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 13: Preserve the earlier positive repair while applying: Remove the purpose-label 'luminal' and keep the actual symptoms and initial stage."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "suggestions 2: Explicit basicRecallIntentional: Intentional basic CT contrast-protocol distinction before collection characterization; complex vascular/duct complications are not added to a passed uncomplicated drainage case.",
          "suggestions 3: Action: Explicitly label this contrast-route rule basic; do not add a hemorrhage/duct problem that would contradict the unchanged passed later collection case."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination.",
        "closestDistractor": "Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v4.r4",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization",
      "stem": "Which CT protocol should be requested for {patientName}'s ongoing upper-abdominal symptoms?",
      "answerChoices": [
        {
          "id": "ct_3",
          "label": "Abdominal CT: intravenous contrast given; oral contrast omitted",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides enhancement information for pancreatic-region characterization in the offered protocol set."
        },
        {
          "id": "choice.qq20261102b.b35-context.d1",
          "label": "Abdominal CT: intravenous contrast omitted; oral contrast given",
          "isCorrect": false,
          "distractorRationale": "Supplies bowel-lumen contrast rather than intravenous enhancement; the two routes are explicitly distinguished."
        },
        {
          "id": "choice.qq20261102b.b35-context.d2",
          "label": "Abdominal CT: intravenous contrast omitted; oral contrast omitted",
          "isCorrect": false,
          "distractorRationale": "Provides an unenhanced survey rather than the enhancement assessment needed for this represented question."
        }
      ],
      "explanation": "Persistent symptoms after pancreatitis require evaluation of possible structural complications. Contrast-enhanced CT characterizes the pancreatic region and its relationships; oral contrast or a noncontrast survey does not replace intravenous enhancement. MRI can also be appropriate in selected circumstances and is not offered as a falsely invalid alternative.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.qq20261102a.pancreatic-contrast-characterization"
      ],
      "teachingPoint": "Persistent symptoms after pancreatitis require evaluation of possible structural complications. Contrast-enhanced CT characterizes the pancreatic region and its relationships; oral contrast or a noncontrast survey does not replace intravenous enhancement. MRI can also be appropriate in selected circumstances and is not offered as a falsely invalid alternative."
    }
  },
  {
    "id": "revision.qq20261102b.b36",
    "auditId": "B36",
    "caseId": "case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
    "nodeId": "node.gs028se.pdsa-act-qi-measures.a-abandon-harm.1",
    "previousQuestionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r3",
    "questionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which next PDSA test should {patientName}'s team undertake?",
    "previousChoiceLabels": [
      "Test a revised form while tracking repeat contacts and planning time",
      "Test spread of this form while tracking repeat contacts and planning time",
      "Test refresher training while tracking repeat contacts and planning time"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "table",
      "caption": "Constructed local improvement data; these are not clinical outcome estimates.",
      "columnHeaders": [
        "Plan recorded at first visit",
        "Unplanned repeat contacts",
        "Median planning minutes",
        "Forms with required sections entered"
      ],
      "rowHeaders": [
        "Baseline",
        "Cycle 1",
        "Cycle 2",
        "Cycle 3"
      ],
      "cells": [
        [
          "12/20",
          "8/20",
          "6",
          "Not applicable"
        ],
        [
          "18/20",
          "8/20",
          "10",
          "18/20"
        ],
        [
          "19/20",
          "7/20",
          "12",
          "19/20"
        ],
        [
          "19/20",
          "8/20",
          "12",
          "20/20"
        ]
      ]
    },
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Distinguish total workload location, observed content accuracy and repeat-contact outcome rather than equating filled sections with faithful clinical implementation. Then Choose a specific reversible test directed at the observed added work, preserving other components and measuring whether the hypothesis is supported.",
    "reviewerNotes": "QI/clinical review must confirm feasibility of verified prefill and the prioritization. Ten uses and twenty subsequent visits are explicitly synthetic small-cycle inputs, not an inferred clinical performance threshold or evidence of causality.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_abandon-harm": "correct_abandon-harm",
      "choice.qq20261102b.b36.d1": "choice.qq20261102a.b36.d1",
      "choice.qq20261102b.b36.d2": "choice.qq20261102a.b36.d2"
    },
    "choiceServiceOverrides": {
      "correct_abandon-harm": null,
      "choice.qq20261102b.b36.d1": null,
      "choice.qq20261102b.b36.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r3",
      "whatChanged": "Replace form-completion-as-adherence with actual task-level timing and record-agreement observations; name three concrete next modifications and limit the key to a testable hypothesis.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B36",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Cue response: No 'staff followed the workflow' label or infinitely flexible revised-form option remains. Every choice is a concrete test modification with retained components; the table gives task-level time and accuracy rather than an interpreted burden label. Measure record agreement rather than infer quality from completion of required fields.",
          "cues 2: Cue response: No 'staff followed the workflow' label or infinitely flexible revised-form option remains. Every choice is a concrete test modification with retained components; the table gives task-level time and accuracy rather than an interpreted burden label. Provide separate task-time observations that distinguish the medication-entry burden from an escalation-training hypothesis."
        ],
        "fairness": [
          "fairness 1: Application revision: Distinguish total workload location, observed content accuracy and repeat-contact outcome rather than equating filled sections with faithful clinical implementation. Then Choose a specific reversible test directed at the observed added work, preserving other components and measuring whether the hypothesis is supported. Closest error: Refresher training may be a reasonable generic QI response, but the sampled accuracy and task-time pattern do not make escalation retraining the most informative offered next test.",
          "fairness 2: Fairness response: Among these modifications, medication prefill directly tests the observed added-work location. The other two target unchanged escalation work/accuracy without addressing medication entry. This is prioritization of a next hypothesis, not proof of the intervention's effect. Clinical boundary: QI/clinical review must confirm feasibility of verified prefill and the prioritization. Ten uses and twenty subsequent visits are explicitly synthetic small-cycle inputs, not an inferred clinical performance threshold or evidence of causality.",
          "fairness 3: Revision/preservation: Specify the prefill change and compare concrete alternatives; retain small-cycle uncertainty and do not claim proven causation, immediate spread or a universal abandonment rule. No 'staff followed the workflow' label or infinitely flexible revised-form option remains. Every choice is a concrete test modification with retained components; the table gives task-level time and accuracy rather than an interpreted burden label.",
          "fairness 4: Preserve the earlier positive repair while applying: Provide separate task-time observations that distinguish the medication-entry burden from an escalation-training hypothesis.",
          "fairness 5: Revision/preservation: Provide separate task-time observations that distinguish the medication-entry burden from an escalation-training hypothesis. No 'staff followed the workflow' label or infinitely flexible revised-form option remains. Every choice is a concrete test modification with retained components; the table gives task-level time and accuracy rather than an interpreted burden label.",
          "fairness 6: Preserve the earlier positive repair while applying: Measure record agreement rather than infer quality from completion of required fields.",
          "fairness 7: Preserve the earlier positive repair while applying: Provide separate task-time observations that distinguish the medication-entry burden from an escalation-training hypothesis.",
          "fairness 8: Fairness response: Among these modifications, medication prefill directly tests the observed added-work location. The other two target unchanged escalation work/accuracy without addressing medication entry. This is prioritization of a next hypothesis, not proof of the intervention's effect. Clinical boundary: QI/clinical review must confirm feasibility of verified prefill and the prioritization. Ten uses and twenty subsequent visits are explicitly synthetic small-cycle inputs, not an inferred clinical performance threshold or evidence of causality.",
          "fairness 9: Preserve the earlier positive repair while applying: Measure record agreement rather than infer quality from completion of required fields.",
          "fairness 10: Application revision: Distinguish total workload location, observed content accuracy and repeat-contact outcome rather than equating filled sections with faithful clinical implementation. Then Choose a specific reversible test directed at the observed added work, preserving other components and measuring whether the hypothesis is supported. Closest error: Refresher training may be a reasonable generic QI response, but the sampled accuracy and task-time pattern do not make escalation retraining the most informative offered next test.",
          "fairness 11: Preserve the earlier positive repair while applying: Specify the prefill change and compare concrete alternatives; retain small-cycle uncertainty and do not claim proven causation, immediate spread or a universal abandonment rule.",
          "fairness 12: Fairness response: Among these modifications, medication prefill directly tests the observed added-work location. The other two target unchanged escalation work/accuracy without addressing medication entry. This is prioritization of a next hypothesis, not proof of the intervention's effect. Clinical boundary: QI/clinical review must confirm feasibility of verified prefill and the prioritization. Ten uses and twenty subsequent visits are explicitly synthetic small-cycle inputs, not an inferred clinical performance threshold or evidence of causality.",
          "fairness 13: Preserve the earlier positive repair while applying: Provide separate task-time observations that distinguish the medication-entry burden from an escalation-training hypothesis."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: Among these modifications, medication prefill directly tests the observed added-work location. The other two target unchanged escalation work/accuracy without addressing medication entry. This is prioritization of a next hypothesis, not proof of the intervention's effect. Clinical boundary: QI/clinical review must confirm feasibility of verified prefill and the prioritization. Ten uses and twenty subsequent visits are explicitly synthetic small-cycle inputs, not an inferred clinical performance threshold or evidence of causality.",
          "suggestions 2: Fairness response: Among these modifications, medication prefill directly tests the observed added-work location. The other two target unchanged escalation work/accuracy without addressing medication entry. This is prioritization of a next hypothesis, not proof of the intervention's effect. Clinical boundary: QI/clinical review must confirm feasibility of verified prefill and the prioritization. Ten uses and twenty subsequent visits are explicitly synthetic small-cycle inputs, not an inferred clinical performance threshold or evidence of causality.",
          "suggestions 3: Fairness response: Among these modifications, medication prefill directly tests the observed added-work location. The other two target unchanged escalation work/accuracy without addressing medication entry. This is prioritization of a next hypothesis, not proof of the intervention's effect. Clinical boundary: QI/clinical review must confirm feasibility of verified prefill and the prioritization. Ten uses and twenty subsequent visits are explicitly synthetic small-cycle inputs, not an inferred clinical performance threshold or evidence of causality."
        ]
      },
      "selfCheck": {
        "cueAttack": "No 'staff followed the workflow' label or infinitely flexible revised-form option remains. Every choice is a concrete test modification with retained components; the table gives task-level time and accuracy rather than an interpreted burden label.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Distinguish total workload location, observed content accuracy and repeat-contact outcome rather than equating filled sections with faithful clinical implementation.",
          "Choose a specific reversible test directed at the observed added work, preserving other components and measuring whether the hypothesis is supported."
        ],
        "oneBestAnswer": "Among these modifications, medication prefill directly tests the observed added-work location. The other two target unchanged escalation work/accuracy without addressing medication entry. This is prioritization of a next hypothesis, not proof of the intervention's effect.",
        "closestDistractor": "Refresher training may be a reasonable generic QI response, but the sampled accuracy and task-time pattern do not make escalation retraining the most informative offered next test.",
        "remainingReview": "QI/clinical review must confirm feasibility of verified prefill and the prioritization. Ten uses and twenty subsequent visits are explicitly synthetic small-cycle inputs, not an inferred clinical performance threshold or evidence of causality."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.quality-improvement.pdsa-act-and-iterate.v3.r4",
      "conceptId": "concept.quality-improvement.pdsa-act-and-iterate",
      "stem": "Which modification should {patientName}'s team compare in the next small PDSA test?",
      "answerChoices": [
        {
          "id": "correct_abandon-harm",
          "label": "Prefill medication fields; retain escalation prompts",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Tests the observed concentration of additional entry work while retaining the accurate escalation component; it is a testable hypothesis rather than a proven solution."
        },
        {
          "id": "choice.qq20261102b.b36.d1",
          "label": "Shorten escalation prompts; retain manual medication-field entry",
          "isCorrect": false,
          "distractorRationale": "Targets a section whose observed workload did not increase while leaving the main extra work in place."
        },
        {
          "id": "choice.qq20261102b.b36.d2",
          "label": "Repeat escalation training; retain manual medication-field entry",
          "isCorrect": false,
          "distractorRationale": "Treats unobserved prompt-quality failure as the primary hypothesis despite accurate sampled entries and no added escalation-entry time."
        }
      ],
      "explanation": "The small observations localize added time to medication entry, while the sampled entries agree with the record and the escalation section has not added time. A bounded prefill test directly probes that workload hypothesis while retaining escalation prompts. Track time, accuracy and repeat contacts; do not claim that these observations prove the cause or establish a general adoption/abandonment rule.",
      "teachingPoint": "The small observations localize added time to medication entry, while the sampled entries agree with the record and the escalation section has not added time. A bounded prefill test directly probes that workload hypothesis while retaining escalation prompts. Track time, accuracy and repeat contacts; do not claim that these observations prove the cause or establish a general adoption/abandonment rule.",
      "exhibit": {
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
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.pdsa-act",
        "claim.qq20261102a.pdsa-outcome-balancing-adaptation",
        "claim.qq20261102b.pdsa-hypothesis-not-proof"
      ]
    },
    "presentationTemplate": "{patientName} leads an employee quality meeting about a structured visit form. A small test aims to reduce unplanned repeat contacts while keeping planning workload manageable. The constructed observations below compare the current form with the previous process; they do not establish a causal treatment effect.",
    "previousPresentation": "{patientName} leads an employee quality meeting about a structured visit form. A small test aims to reduce unplanned repeat contacts while keeping planning workload manageable. Each row describes a constructed group of 20 visits.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
        "patientPresentationVariantId": "presentation.gs028se.pdsa-act-qi-measures.a-abandon-harm",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Pathway improvement review",
        "revisedPresentation": "{patientName} leads an employee quality meeting about a structured visit form. A small test aims to reduce unplanned repeat contacts while keeping planning workload manageable. Each row describes a constructed group of 20 visits.",
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
      "idPrefix": "ppr.qq20261102b.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v6"
    }
  },
  {
    "id": "revision.qq20261102b.b37",
    "auditId": "B37",
    "caseId": "case.inflammatory-breast-cancer.persistent-erythema",
    "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.1",
    "previousQuestionVariantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r3",
    "questionVariantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which tissue-sampling plan should come first for {patientName}?",
    "previousChoiceLabels": [
      "Ultrasound-guided core biopsy of parenchymal abnormality",
      "Ultrasound-guided aspiration of the parenchymal abnormality",
      "Punch sampling of the involved breast skin"
    ],
    "previousCurrentUpdate": "External systemic staging is planned if invasive carcinoma is confirmed.",
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic initial tissue-confirmation sequence; the harder response/local-treatment objective is the exact unchanged passed companion, whose shared presentation must be preserved.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "core_staging_4": "core_staging_4",
      "choice.qq20261102b.b37.d1": "choice.qq20261102a.b37.d1",
      "choice.qq20261102b.b37.d2": "choice.qq20261102a.b37.d2"
    },
    "choiceServiceOverrides": {
      "core_staging_4": "service.ibc_biopsy_and_staging",
      "choice.qq20261102b.b37.d1": null,
      "choice.qq20261102b.b37.d2": null
    },
    "choiceTimingOverrides": {
      "core_staging_4": {
        "kind": "test",
        "timingProfileId": "timing.test.ibc_biopsy_and_staging"
      },
      "choice.qq20261102b.b37.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102b.b37.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.nipple_areolar_biopsy"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic initial tissue-confirmation sequence; the harder response/local-treatment objective is the exact unchanged passed companion, whose shared presentation must be preserved.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B37",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Cue response: This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria. Retain the shared presentation exactly because B37-context passed; its limited aspirate is acknowledged as part of a basic tissue-confirmation sequence, not used to claim difficult syndrome recognition.",
          "cues 2: Cue response: This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria. Remove the unchanged-repeat-aspiration option and compare three tissue-sampling strategies, including a real open procedure and adjunctive skin sampling."
        ],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: Intentional basic initial tissue-confirmation sequence; the harder response/local-treatment objective is the exact unchanged passed companion, whose shared presentation must be preserved.",
          "fairness 2: Explicit basicRecallIntentional: Intentional basic initial tissue-confirmation sequence; the harder response/local-treatment objective is the exact unchanged passed companion, whose shared presentation must be preserved.",
          "fairness 3: Fairness response: Core sampling of the imaged parenchymal target best repairs the current diagnostic limitation; repeat aspiration and skin-only sampling do not provide the same assessment. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 4: Explicit basicRecallIntentional: Intentional basic initial tissue-confirmation sequence; the harder response/local-treatment objective is the exact unchanged passed companion, whose shared presentation must be preserved.",
          "fairness 5: Fairness response: Core sampling of the imaged parenchymal target best repairs the current diagnostic limitation; repeat aspiration and skin-only sampling do not provide the same assessment. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 6: Preserve the earlier positive repair while applying: Retain the shared presentation exactly because B37-context passed; its limited aspirate is acknowledged as part of a basic tissue-confirmation sequence, not used to claim difficult syndrome recognition.",
          "fairness 7: Preserve the earlier positive repair while applying: Remove the unchanged-repeat-aspiration option and compare three tissue-sampling strategies, including a real open procedure and adjunctive skin sampling.",
          "fairness 8: Revision/preservation: Remove the unchanged-repeat-aspiration option and compare three tissue-sampling strategies, including a real open procedure and adjunctive skin sampling. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 9: Fairness response: Core sampling of the imaged parenchymal target best repairs the current diagnostic limitation; repeat aspiration and skin-only sampling do not provide the same assessment. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 10: Preserve the earlier positive repair while applying: Remove the unchanged-repeat-aspiration option and compare three tissue-sampling strategies, including a real open procedure and adjunctive skin sampling."
        ],
        "suggestions": [
          "suggestions 1: Fairness response: Core sampling of the imaged parenchymal target best repairs the current diagnostic limitation; repeat aspiration and skin-only sampling do not provide the same assessment. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "suggestions 2: Explicit basicRecallIntentional: Intentional basic initial tissue-confirmation sequence; the harder response/local-treatment objective is the exact unchanged passed companion, whose shared presentation must be preserved.",
          "suggestions 3: Action: Keep staging contingent on invasive confirmation and do not teach that skin punch is never useful; the exact combined external-service contract is retained."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Core sampling of the imaged parenchymal target best repairs the current diagnostic limitation; repeat aspiration and skin-only sampling do not provide the same assessment.",
        "closestDistractor": "Treating skin punch as a complete substitute because the most visible abnormality is cutaneous is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r4",
      "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation",
      "stem": "Which tissue-sampling plan should be arranged next for {patientName}?",
      "answerChoices": [
        {
          "id": "core_staging_4",
          "label": "Ultrasound-guided core biopsy of the parenchymal target",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides tissue from the imaged breast target for diagnosis and biomarkers, with skin punch as an adjunct rather than a substitute."
        },
        {
          "id": "choice.qq20261102b.b37.d1",
          "label": "Open incisional sampling of the parenchymal abnormality",
          "isCorrect": false,
          "distractorRationale": "Can provide tissue but escalates to an open initial procedure when an imaged percutaneous target is supplied."
        },
        {
          "id": "choice.qq20261102b.b37.d2",
          "label": "Multiple punch samples from the involved breast skin",
          "isCorrect": false,
          "distractorRationale": "Can give useful complementary evidence but is not an equivalent substitute for sampling the supplied parenchymal target."
        }
      ],
      "explanation": "The rapidly evolving skin/breast findings warrant assessment of an invasive breast malignancy. Core tissue from the parenchymal abnormality addresses the inadequate cytologic material; skin punch may be adjunctive. The existing external pathway completes staging after confirmation, not because suspicion alone equals a cancer diagnosis.",
      "supportingEvidenceClaimIds": [
        "claim.brief.ibc.core-biopsy-confirmation",
        "claim.qq20261102a.ibc-core-versus-adjunctive-skin"
      ],
      "teachingPoint": "The rapidly evolving skin/breast findings warrant assessment of an invasive breast malignancy. Core tissue from the parenchymal abnormality addresses the inadequate cytologic material; skin punch may be adjunctive. The existing external pathway completes staging after confirmation, not because suspicion alone equals a cancer diagnosis."
    }
  },
  {
    "id": "revision.qq20261102b.b39",
    "auditId": "B39",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-0001",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-0001.1",
    "previousQuestionVariantId": "question.statistics-ethics.p-value.v3.r3",
    "questionVariantId": "question.statistics-ethics.p-value.v3.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which paired conclusion should {patientName} report from this study?",
    "previousChoiceLabels": [
      "Zero-effect hypothesis rejected; target benefit excluded",
      "Zero-effect hypothesis rejected; target benefit not excluded",
      "Zero-effect hypothesis not rejected; target benefit excluded",
      "Zero-effect hypothesis not rejected; target benefit not excluded"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Constructed teaching dataset and hypothetical protocol criteria; not a clinical benefit threshold.",
      "items": [
        {
          "label": "Risk difference: intervention minus control",
          "value": "-0.2 percentage points"
        },
        {
          "label": "Approximate 95% confidence interval",
          "value": "-0.32 to -0.08 percentage points"
        },
        {
          "label": "Two-sided p-value",
          "value": "0.001"
        }
      ]
    },
    "educationalIntent": "resident_application_reviewer_prediction_pending",
    "intendedInference": "Interpret the p-value using the specified null and alpha, independently of the effect's size. Then Translate a beneficial reduction into the intervention-minus-control interval and apply the explicit whole-interval target rule.",
    "reviewerNotes": "Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_p-0001": "correct_p-0001",
      "choice.qq20261102b.b39.d1": "choice.qq20261102a.b39.d1",
      "choice.qq20261102b.b39.d2": "choice.qq20261102a.b39.d2",
      "choice.qq20261102b.b39.d3": "choice.qq20261102a.b39.d3"
    },
    "choiceServiceOverrides": {
      "correct_p-0001": null,
      "choice.qq20261102b.b39.d1": null,
      "choice.qq20261102b.b39.d2": null,
      "choice.qq20261102b.b39.d3": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.statistics-ethics.p-value.v3.r3",
      "whatChanged": "Name the adverse endpoint and beneficial direction, specify the whole-interval evidentiary rule, and qualify B39 exclusion as model/interval-based. Correct the singular percentage-point grammar.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B39",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "fairness 2: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "fairness 3: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "fairness 4: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "fairness 5: Preserve the earlier positive repair while applying: Qualify exclusion as outside the reported interval under its model, not impossible in reality; use '1 percentage point' correctly.",
          "fairness 6: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "fairness 7: Preserve the earlier positive repair while applying: State the hypothetical protocol's whole-interval confirmation/exclusion criterion without changing any numeric inputs.",
          "fairness 8: Preserve the earlier positive repair while applying: Qualify exclusion as outside the reported interval under its model, not impossible in reality; use '1 percentage point' correctly.",
          "fairness 9: Preserve the earlier positive repair while applying: Name unplanned reoperation and explicitly define lower risk as benefit.",
          "fairness 10: Revision/preservation: Name unplanned reoperation and explicitly define lower risk as benefit. Preserve the balanced four paired conclusions and all original numeric inputs. The protocol states the evidentiary rule, not the calculated conclusion; no uniquely cautious option identifies the key.",
          "fairness 11: Preserve the earlier positive repair while applying: Qualify exclusion as outside the reported interval under its model, not impossible in reality; use '1 percentage point' correctly."
        ],
        "suggestions": [
          "suggestions 1: Action: Name unplanned reoperation and explicitly define lower risk as benefit.",
          "suggestions 2: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis.",
          "suggestions 3: Fairness response: The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion. Clinical boundary: Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis."
        ]
      },
      "selfCheck": {
        "cueAttack": "Preserve the balanced four paired conclusions and all original numeric inputs. The protocol states the evidentiary rule, not the calculated conclusion; no uniquely cautious option identifies the key.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the p-value using the specified null and alpha, independently of the effect's size.",
          "Translate a beneficial reduction into the intervention-minus-control interval and apply the explicit whole-interval target rule."
        ],
        "oneBestAnswer": "The stated lower-is-better endpoint and whole-interval rule remove the point-estimate-versus-interval ambiguity. The unchanged p/interval values select one paired conclusion.",
        "closestDistractor": "Confusing statistical rejection of zero with confirmation or exclusion of a prespecified magnitude is the intended near miss.",
        "remainingReview": "Statistics review must confirm the constructed protocol and interval arithmetic. These are fictional study-decision criteria, not clinical thresholds or a literal frequentist probability assigned to the hypothesis."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v3.r4",
      "conceptId": "concept.statistics-ethics.p-value",
      "stem": "Which paired conclusion should {patientName} report from this study?",
      "answerChoices": [
        {
          "id": "correct_p-0001",
          "label": "Zero-effect hypothesis rejected; target reduction outside the reported interval",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The p-value rejects zero, while the full displayed interval is far short of a one-point reduction under the supplied rule."
        },
        {
          "id": "choice.qq20261102b.b39.d1",
          "label": "Zero-effect hypothesis rejected; target reduction within the reported interval",
          "isCorrect": false,
          "distractorRationale": "Correctly rejects zero but mistakes a small statistically significant reduction for inclusion of the protocol target."
        },
        {
          "id": "choice.qq20261102b.b39.d2",
          "label": "Zero-effect hypothesis not rejected; target reduction outside the reported interval",
          "isCorrect": false,
          "distractorRationale": "Reads the magnitude comparison correctly but confuses small effect size with failure to reject zero."
        },
        {
          "id": "choice.qq20261102b.b39.d3",
          "label": "Zero-effect hypothesis not rejected; target reduction within the reported interval",
          "isCorrect": false,
          "distractorRationale": "Misreads both the null comparison and the stated target comparison."
        }
      ],
      "explanation": "The endpoint and benefit direction are explicit, and the target is judged by the whole confidence interval rather than its point estimate. Interpret the zero-effect test separately from the hypothetical minimum-benefit rule. For this dataset the target is outside the reported interval. Confidence-interval exclusion is model-based, not a claim that a true effect outside it is impossible.",
      "teachingPoint": "The endpoint and benefit direction are explicit, and the target is judged by the whole confidence interval rather than its point estimate. Interpret the zero-effect test separately from the hypothetical minimum-benefit rule. For this dataset the target is outside the reported interval. Confidence-interval exclusion is model-based, not a claim that a true effect outside it is impossible.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed teaching dataset and hypothetical protocol criteria; not a clinical benefit threshold.",
        "items": [
          {
            "label": "Risk difference: intervention minus control",
            "value": "-0.2 percentage points"
          },
          {
            "label": "Approximate 95% confidence interval",
            "value": "-0.32 to -0.08 percentage points"
          },
          {
            "label": "Two-sided p-value",
            "value": "0.001"
          }
        ]
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.p-value",
        "claim.qq20261102a.null-test-versus-protocol-magnitude",
        "claim.qq20261102b.specified-interval-decision-rule"
      ]
    },
    "presentationTemplate": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The endpoint is unplanned reoperation; a lower event risk is beneficial. The hypothetical protocol tests zero risk difference at two-sided alpha 0.05. It confirms a benefit of at least 1 percentage point only if the entire reported 95% interval reaches at least that reduction; it excludes that target under the interval model if the entire interval falls short of it.",
    "previousPresentation": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The protocol tests a zero risk difference at a two-sided 0.05 level and separately specifies a benefit of at least 1 percentage points for its study decision.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.gs028se.arr-nnt-p-value.b-p-0001",
        "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-0001",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Thyroid surgery study",
        "revisedPresentation": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The protocol tests a zero risk difference at a two-sided 0.05 level and separately specifies a benefit of at least 1 percentage points for its study decision.",
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
      "idPrefix": "ppr.qq20261102b.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v6"
    }
  },
  {
    "id": "revision.qq20261102b.b40",
    "auditId": "B40",
    "caseId": "case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
    "nodeId": "node.peptic-ulcer-bleeding.visible-vessel-treat.v1",
    "previousQuestionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r3",
    "questionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which initial hemostatic plan should be used for {patientName}'s ulcer?",
    "previousChoiceLabels": [
      "Endoscopic clip placement with proton-pump inhibitor treatment",
      "Endoscopic epinephrine injection with proton-pump inhibitor treatment",
      "Endoscopic topical powder with proton-pump inhibitor treatment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic visible-vessel/local-treatment rule; choosing among accepted definitive modalities without verified lesion-specific criteria would create several defensible keys.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "perform_endoscopic_hemostasis": "perform_endoscopic_hemostasis",
      "choice.qq20261102b.b40.d1": "choice.qq20261102a.b40.d1",
      "choice.qq20261102b.b40.d2": "choice.qq20261102a.b40.d2"
    },
    "choiceServiceOverrides": {
      "perform_endoscopic_hemostasis": null,
      "choice.qq20261102b.b40.d1": null,
      "choice.qq20261102b.b40.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic visible-vessel/local-treatment rule; choosing among accepted definitive modalities without verified lesion-specific criteria would create several defensible keys.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B40",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Explicit basicRecallIntentional: Intentional basic visible-vessel/local-treatment rule; choosing among accepted definitive modalities without verified lesion-specific criteria would create several defensible keys.",
          "fairness 2: Fairness response: Clip treatment is an appropriate initial modality for the represented stigma; the two standalone agent alternatives are not equivalent first-line definitive regimens. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 3: Revision/preservation: Keep parallel initial regimens and no safety/definitive/gold-standard wording in the task; clinician verification of technical suitability remains required. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 4: Preserve the earlier positive repair while applying: Label the initial hemostatic rule basic rather than invent a lesion-access ranking between multiple guideline-accepted definitive modalities.",
          "fairness 5: Preserve the earlier positive repair while applying: Keep parallel initial regimens and no safety/definitive/gold-standard wording in the task; clinician verification of technical suitability remains required.",
          "fairness 6: Explicit basicRecallIntentional: Intentional basic visible-vessel/local-treatment rule; choosing among accepted definitive modalities without verified lesion-specific criteria would create several defensible keys.",
          "fairness 7: Preserve the earlier positive repair while applying: Label the initial hemostatic rule basic rather than invent a lesion-access ranking between multiple guideline-accepted definitive modalities.",
          "fairness 8: Preserve the earlier positive repair while applying: Keep parallel initial regimens and no safety/definitive/gold-standard wording in the task; clinician verification of technical suitability remains required.",
          "fairness 9: Explicit basicRecallIntentional: Intentional basic visible-vessel/local-treatment rule; choosing among accepted definitive modalities without verified lesion-specific criteria would create several defensible keys.",
          "fairness 10: Preserve the earlier positive repair while applying: Label the initial hemostatic rule basic rather than invent a lesion-access ranking between multiple guideline-accepted definitive modalities."
        ],
        "suggestions": [
          "suggestions 1: Explicit basicRecallIntentional: Intentional basic visible-vessel/local-treatment rule; choosing among accepted definitive modalities without verified lesion-specific criteria would create several defensible keys.",
          "suggestions 2: Action: Label the initial hemostatic rule basic rather than invent a lesion-access ranking between multiple guideline-accepted definitive modalities."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "Clip treatment is an appropriate initial modality for the represented stigma; the two standalone agent alternatives are not equivalent first-line definitive regimens.",
        "closestDistractor": "Assuming injection or topical hemostasis is interchangeable with mechanical treatment after the field becomes dry is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r4",
      "conceptId": "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis",
      "stem": "Which initial endoscopic treatment plan should be used for {patientName}'s ulcer?",
      "answerChoices": [
        {
          "id": "perform_endoscopic_hemostasis",
          "label": "Endoscopic clip placement with proton-pump inhibitor treatment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Treats the exposed vessel with a recommended local hemostatic modality despite the dry field."
        },
        {
          "id": "choice.qq20261102b.b40.d1",
          "label": "Endoscopic epinephrine injection with proton-pump inhibitor treatment",
          "isCorrect": false,
          "distractorRationale": "Mistakes transient injection hemostasis for an adequate standalone local treatment of this high-risk stigma."
        },
        {
          "id": "choice.qq20261102b.b40.d2",
          "label": "Endoscopic topical powder with proton-pump inhibitor treatment",
          "isCorrect": false,
          "distractorRationale": "Moves a rescue/temporizing topical approach into first-line standalone treatment of the represented visible-vessel stigma."
        }
      ],
      "explanation": "A protruding nonbleeding vessel remains an important endoscopic stigma despite a dry field. Initial local hemostatic treatment and acid suppression are appropriate; interpret the actual endoscopic course when choosing subsequent treatment.",
      "supportingEvidenceClaimIds": [
        "claim.peptic-ulcer-bleeding.high-risk-stigmata-require-hemostasis",
        "claim.qq20261102.ulcer-initial-treatment",
        "claim.qq20261102.ulcer-rescue-embolization",
        "claim.qq20261102a.ulcer-local-modality-choice"
      ],
      "teachingPoint": "A protruding nonbleeding vessel remains an important endoscopic stigma despite a dry field. Initial local hemostatic treatment and acid suppression are appropriate; interpret the actual endoscopic course when choosing subsequent treatment."
    }
  },
  {
    "id": "revision.qq20261102b.b40-context",
    "auditId": "B40-context",
    "caseId": "case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
    "nodeId": "node.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1",
    "previousQuestionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r3",
    "questionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v5"
    ],
    "previousStem": "Which intervention should complete {patientName}'s endoscopic treatment?",
    "previousChoiceLabels": [
      "Contact bipolar coagulation of the visible vessel",
      "Additional epinephrine injection around the visible vessel",
      "Topical hemostatic powder over the visible vessel"
    ],
    "previousCurrentUpdate": "During treatment of {patientName}'s same duodenal ulcer, a clip does not grasp the base. Epinephrine injection controls the oozing, but the vessel remains visible.",
    "previousExhibit": null,
    "educationalIntent": "basic_recall_intentional",
    "basicRecallIntentional": true,
    "basicRecallJustification": "Intentional basic injection-plus-local-modality rule after a failed clip; it is not claimed to be a difficult definitive-rescue comparison.",
    "intendedInference": "Apply the explicitly scoped foundational objective to the supplied patient findings.",
    "reviewerNotes": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "choice.qq20261102a.b40-context.key": "choice.qq20261102a.b40-context.key",
      "choice.qq20261102b.b40-context.d1": "choice.qq20261102a.b40-context.d1",
      "choice.qq20261102b.b40-context.d2": "choice.qq20261102a.b40-context.d2"
    },
    "choiceServiceOverrides": {
      "choice.qq20261102a.b40-context.key": null,
      "choice.qq20261102b.b40-context.d1": null,
      "choice.qq20261102b.b40-context.d2": null
    },
    "currentUpdate": "During treatment of {patientName}'s same duodenal ulcer, the clip jaws slide off the firm flat base. The endoscopist maintains a stable front-on view of the exposed vessel. Epinephrine injection stops the oozing; the vessel remains visible.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r3",
      "whatChanged": "Label basicRecallIntentional: Intentional basic injection-plus-local-modality rule after a failed clip; it is not claimed to be a difficult definitive-rescue comparison.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review2-20261102.json#B40-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Explicit basicRecallIntentional: Intentional basic injection-plus-local-modality rule after a failed clip; it is not claimed to be a difficult definitive-rescue comparison.",
          "cues 2: Cue response: This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria. Remove the rhetorical 'but' and the task's 'complete' wording; record the visible vessel neutrally."
        ],
        "fairness": [
          "fairness 1: Revision/preservation: Retain the same duodenal lesion and state why clip purchase failed, with front-on access rather than unexplained failed-clip anatomy. This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
          "fairness 2: Fairness response: The offered contact therapy adds the appropriate distinct local treatment after the described injection/clip course. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 3: Explicit basicRecallIntentional: Intentional basic injection-plus-local-modality rule after a failed clip; it is not claimed to be a difficult definitive-rescue comparison.",
          "fairness 4: Preserve the earlier positive repair while applying: Remove the rhetorical 'but' and the task's 'complete' wording; record the visible vessel neutrally.",
          "fairness 5: Preserve the earlier positive repair while applying: Explicitly label the local-modality rule basic. Do not add another accepted definitive modality and pretend a unique ranking is established; Melissa must verify contact suitability and the represented powder role.",
          "fairness 6: Preserve the earlier positive repair while applying: Retain the same duodenal lesion and state why clip purchase failed, with front-on access rather than unexplained failed-clip anatomy.",
          "fairness 7: Preserve the earlier positive repair while applying: Remove the rhetorical 'but' and the task's 'complete' wording; record the visible vessel neutrally.",
          "fairness 8: Fairness response: The offered contact therapy adds the appropriate distinct local treatment after the described injection/clip course. Clinical boundary: Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes.",
          "fairness 9: Explicit basicRecallIntentional: Intentional basic injection-plus-local-modality rule after a failed clip; it is not claimed to be a difficult definitive-rescue comparison.",
          "fairness 10: Preserve the earlier positive repair while applying: Remove the rhetorical 'but' and the task's 'complete' wording; record the visible vessel neutrally.",
          "fairness 11: Preserve the earlier positive repair while applying: Explicitly label the local-modality rule basic. Do not add another accepted definitive modality and pretend a unique ranking is established; Melissa must verify contact suitability and the represented powder role.",
          "fairness 12: Preserve the earlier positive repair while applying: Retain the same duodenal lesion and state why clip purchase failed, with front-on access rather than unexplained failed-clip anatomy."
        ],
        "suggestions": [
          "suggestions 1: Explicit basicRecallIntentional: Intentional basic injection-plus-local-modality rule after a failed clip; it is not claimed to be a difficult definitive-rescue comparison.",
          "suggestions 2: Action: Remove the rhetorical 'but' and the task's 'complete' wording; record the visible vessel neutrally.",
          "suggestions 3: Action: Explicitly label the local-modality rule basic. Do not add another accepted definitive modality and pretend a unique ranking is established; Melissa must verify contact suitability and the represented powder role."
        ]
      },
      "selfCheck": {
        "cueAttack": "This is explicitly a basic item, not a claim of difficult two-step reasoning. Preserve necessary findings rather than disguising the answer with missing criteria.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Apply the explicitly scoped foundational objective to the supplied patient findings."
        ],
        "oneBestAnswer": "The offered contact therapy adds the appropriate distinct local treatment after the described injection/clip course.",
        "closestDistractor": "Mistaking cessation of oozing after injection for completion of treatment is plausible.",
        "remainingReview": "Melissa must verify the clinical ranking; independent review must check the basic label and the specific fairness fixes."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r4",
      "conceptId": "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality",
      "stem": "Which intervention should be used next for {patientName}'s duodenal ulcer?",
      "answerChoices": [
        {
          "id": "choice.qq20261102a.b40-context.key",
          "label": "Contact bipolar coagulation of the visible vessel",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Adds an appropriate second local modality after injection, when the initial clip attempt has not treated the target."
        },
        {
          "id": "choice.qq20261102b.b40-context.d1",
          "label": "Additional epinephrine injection around the visible vessel",
          "isCorrect": false,
          "distractorRationale": "Repeats the same temporary injection strategy without supplying the necessary additional local modality."
        },
        {
          "id": "choice.qq20261102b.b40-context.d2",
          "label": "Topical hemostatic powder over the visible vessel",
          "isCorrect": false,
          "distractorRationale": "Substitutes a rescue/temporizing agent for the offered suitable contact treatment after control of active oozing."
        }
      ],
      "explanation": "Epinephrine injection is not a complete standalone endoscopic regimen. In the represented setting, contact bipolar treatment supplies a second modality after the failed clip attempt. Topical agents have rescue/temporizing roles and are not treated as interchangeable definitive therapy here.",
      "supportingEvidenceClaimIds": [
        "claim.peptic-ulcer-bleeding.nonbleeding-visible-vessel-modalities",
        "claim.peptic-ulcer-bleeding.epinephrine-not-monotherapy",
        "claim.qq20261102a.ulcer-local-modality-choice"
      ],
      "teachingPoint": "Epinephrine injection is not a complete standalone endoscopic regimen. In the represented setting, contact bipolar treatment supplies a second modality after the failed clip attempt. Topical agents have rescue/temporizing roles and are not treated as interchangeable definitive therapy here."
    }
  }
];
