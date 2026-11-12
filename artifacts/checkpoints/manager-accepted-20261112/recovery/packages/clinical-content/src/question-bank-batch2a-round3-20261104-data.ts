import type { QuestionBankBatch2aRevision } from "./question-bank-batch2a-20261104";
import type { QuestionFlagConceptVersion } from "./question-flags-20261104";

/** Additive final-round drafts; all prior definitions and PASS fields retained. */
export const QUESTION_BANK_BATCH2A_ROUND3_DEFINITIONS: QuestionBankBatch2aRevision[] = [
  {
    "id": "revision.qbp2ar3.20261104.b2a03",
    "auditId": "B2A03",
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v2.r8",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r9",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2a-r2"
    ],
    "previousStem": "Which acquisition should be requested to classify {patientName}’s esophageal body motility?",
    "previousChoiceLabels": [
      "Separated single-water-swallow pressure series",
      "Repeated multiple-rapid-swallow pressure series",
      "Continuous rapid-water-drinking pressure series"
    ],
    "previousCurrentUpdate": "The outside acquisition log records a catheter crossing the junction. The saved sequences show successive water swallows beginning before the preceding response has ended. Body pressure remains low during each sequence; a distal contraction follows its end.",
    "previousExhibit": null,
    "currentUpdate": "The foregut team is reviewing the earlier outside pressure study before operative planning. The acquisition worksheet records the catheter spanning the junction in each block.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize the quiet clustered phase as inhibition, distinguish it from the traveling baseline waves and identify what the file actually captured. Then: Request the acquisition that can measure the unresolved recovery response rather than repeat a completed but different physiological question.",
    "reviewerNotes": "Technical physiology application of the recorded ACG/Chicago sources; no volume, repetition count, interval or cutoff is introduced. This remains a specialist acquisition-interpretation item; independent review must judge its practical importance and difficulty. It does not select an operation or pre-interpret the frozen later wall-lesion question.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "manometry_2": "manometry_2",
      "choice.qbp2ar3.20261104.b2a03.d1": "choice.qbp2ar2.20261104.b2a03.d1",
      "choice.qbp2ar3.20261104.b2a03.d2": "choice.qbp2ar2.20261104.b2a03.d2"
    },
    "choiceServiceOverrides": {
      "manometry_2": "service.esophageal_manometry",
      "choice.qbp2ar3.20261104.b2a03.d1": null,
      "choice.qbp2ar3.20261104.b2a03.d2": null
    },
    "choiceTimingOverrides": {
      "manometry_2": {
        "kind": "test",
        "timingProfileId": "timing.test.esophageal_manometry"
      },
      "choice.qbp2ar3.20261104.b2a03.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.esophageal_manometry"
      },
      "choice.qbp2ar3.20261104.b2a03.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.esophageal_manometry"
      }
    },
    "question": {
      "id": "question.achalasia.high-resolution-manometry.v2.r9",
      "conceptId": "concept.esophageal-physiology.reserve-acquisition-integrity.v1",
      "stem": "Which esophageal pressure acquisition should be repeated for {patientName}?",
      "answerChoices": [
        {
          "id": "manometry_2",
          "label": "Multiple-rapid-swallow pressure acquisition",
          "isCorrect": true,
          "rationale": "The clustered block records the inhibitory phase but stops before its recovery response can be assessed. A repeat that includes the post-sequence recording can answer the remaining reserve question; silence during the cluster is not a completed negative reserve result.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar3.20261104.b2a03.d1",
          "label": "Upright single-water-swallow pressure acquisition",
          "isCorrect": false,
          "distractorRationale": "The worksheet already establishes a technically recorded upright baseline series. Its weak but traveling waves are observations to interpret, rather than a reason to substitute another baseline for the truncated provocative block."
        },
        {
          "id": "choice.qbp2ar3.20261104.b2a03.d2",
          "label": "Rapid-drink challenge pressure acquisition",
          "isCorrect": false,
          "distractorRationale": "The during-load interval supplies outflow observations even though this acquisition also stops at its last water event. Repeating that different physiological question does not recover the post-cluster response needed to interpret the other block."
        }
      ],
      "explanation": "Identify the purpose and the recorded extent of each block. Both challenge acquisitions stop at their final water event. The liquid-load interval contains outflow observations, whereas the clustered-swallow acquisition does not contain the post-sequence contraction needed for reserve assessment. Repeat the multiple-rapid-swallow acquisition through recovery rather than report that reserve was absent. This does not declare every possible rapid-drink protocol question complete. The later returned full study is a new assessment, not an interpretation of this truncated acquisition.",
      "teachingPoint": "Identify the purpose and the recorded extent of each block. Both challenge acquisitions stop at their final water event. The liquid-load interval contains outflow observations, whereas the clustered-swallow acquisition does not contain the post-sequence contraction needed for reserve assessment. Repeat the multiple-rapid-swallow acquisition through recovery rather than report that reserve was absent. This does not declare every possible rapid-drink protocol question complete. The later returned full study is a new assessment, not an interpretation of this truncated acquisition.",
      "supportingEvidenceClaimIds": [
        "claim.qq20261102c.hrm-protocol-and-provocation",
        "claim.qq20261102d.hrm-rapid-swallow-interpretation",
        "claim.qq20261102d.hrm-rapid-drink-purpose",
        "claim.qbp2ar3.reserve-recording-integrity"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r3",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Outside acquisition record",
        "columnHeaders": [
          "Block",
          "Water-event record",
          "Pressure record"
        ],
        "rowHeaders": [
          "A",
          "B",
          "C"
        ],
        "cells": [
          [
            "A",
            "Individual water events, recorded in supine and upright positions",
            "A weak pressure wave travels down the body after each event; the junction trace falls within the laboratory relaxation interval. Recording continues between events."
          ],
          [
            "B",
            "A cluster of water events",
            "Body channels become quiet during the cluster. Acquisition stops at the final water-event marker."
          ],
          [
            "C",
            "A continuous water load",
            "Junction relaxation is within the laboratory interval, without a sustained body-wide pressure column. Acquisition stops at the final water-event marker."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.achalasia.high-resolution-manometry.v2",
      "nextConceptId": "concept.esophageal-physiology.reserve-acquisition-integrity.v1",
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
      "reason": "The score changes from identifying a missing baseline classification series to recognizing an uninterpretable reserve acquisition despite available baseline and liquid-load observations. Retain the original classification objective and history."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B02-context",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaced the overlap-to-separated-swallow opposites cue with three actually recorded blocks. Both challenge acquisitions stop at the same input boundary, so a generic truncation shortcut does not select the key. The worksheet establishes actual acquisition extent, not just exported views. The learner must distinguish the phase needed for each physiological inference. The task no longer names baseline classification; the consequence is avoiding an unsupported reserve report before operative planning.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2ar3.20261104.b2a04",
    "auditId": "B2A04",
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v3.r10",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3.r11",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2a-r2"
    ],
    "previousStem": "Which interpretation and next plan best fit {patientName}’s recordings?",
    "previousChoiceLabels": [
      "Reduced contraction reserve; obtain a timed barium esophagram",
      "Reduced contraction reserve; arrange pneumatic junction dilation",
      "Preserved contraction reserve; obtain a timed barium esophagram",
      "Preserved contraction reserve; arrange pneumatic junction dilation"
    ],
    "previousCurrentUpdate": "For the illustrated pressure study, the software-derived pressure-time-length integral of each recovery contraction is below that of the separated baseline contraction.",
    "previousExhibit": {
      "kind": "image",
      "caption": "Constructed pressure recordings; qualitative traces with separate laboratory analysis, not patient measurements.",
      "assetPath": "clinical-exhibits/batch2a-r2-b04-pressure.png",
      "description": "Panel A shows a pressure peak traveling from the upper to the lower body channel. Both rapid-swallow repeats show inhibition during the sequence and a recovery response afterwards. The laboratory-derived recovery integral is below the baseline integral in both repeats. During rapid drinking, junction relaxation measurements remain within the laboratory reference interval and there is no body-wide pressure column; the patient reports discomfort.",
      "width": 1200,
      "height": 720
    },
    "currentUpdate": null,
    "educationalIntent": "applied_physiology_interpretation_independent_difficulty_review_pending",
    "intendedInference": "Interpret the post-sequence software integrals in relation to baseline rather than substitute peak height or during-sequence silence. Then: Combine that result with baseline propagation and junction behavior to choose the report that can legitimately accompany ongoing emptying assessment.",
    "reviewerNotes": "This is clinical interpretation of a constructed study, not a two-step management item or proof of normal emptying. The software bars supply necessary independent integration; the qualitative curves alone do not measure DCI. The existing contrast gate/result and later opioid-associated pressure report remain exact. Difficulty is for independent review.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "manometry_3": "manometry_3",
      "choice.qbp2ar3.20261104.b2a04.d1": "choice.qbp2ar2.20261104.b2a04.d1",
      "choice.qbp2ar3.20261104.b2a04.d2": "choice.qbp2ar2.20261104.b2a04.d2"
    },
    "choiceServiceOverrides": {
      "manometry_3": "service.contrast_swallow",
      "choice.qbp2ar3.20261104.b2a04.d1": null,
      "choice.qbp2ar3.20261104.b2a04.d2": null
    },
    "choiceTimingOverrides": {
      "manometry_3": {
        "kind": "test",
        "timingProfileId": "timing.test.contrast_swallow"
      },
      "choice.qbp2ar3.20261104.b2a04.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.contrast_swallow"
      },
      "choice.qbp2ar3.20261104.b2a04.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.contrast_swallow"
      }
    },
    "question": {
      "id": "question.achalasia.high-resolution-manometry.v3.r11",
      "conceptId": "concept.esophageal-physiology.integrated-pressure-report.v2",
      "stem": "Which report of the pressure study should accompany {patientName}’s timed esophagram request?",
      "answerChoices": [
        {
          "id": "manometry_3",
          "label": "Reduced post-swallow reserve with preserved junction relaxation",
          "isCorrect": true,
          "rationale": "The software-integrated recovery responses do not augment the baseline despite taller peaks. Baseline propagation and the liquid-load relaxation observations do not establish absent body contractility or impaired junction relaxation.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar3.20261104.b2a04.d1",
          "label": "Preserved post-swallow reserve with preserved junction relaxation",
          "isCorrect": false,
          "distractorRationale": "The junction component fits, but peak height is not the integrated contractile response. The measured recovery integrals do not demonstrate augmentation."
        },
        {
          "id": "choice.qbp2ar3.20261104.b2a04.d2",
          "label": "Absent esophageal body contractility with impaired junction relaxation",
          "isCorrect": false,
          "distractorRationale": "This mistakes the quiet clustered-swallow phase for baseline failure and the presence of dysphagia for junction obstruction. Traveling baseline waves and the recorded relaxation behavior contradict those claims."
        }
      ],
      "explanation": "Read the separate measurements for their separate purposes. The integrated post-sequence contraction, rather than its peak alone, is the reserve comparison. The baseline waves show propagation, and the junction trace during liquid loading does not support impaired relaxation. Report reduced reserve with preserved relaxation. The common timed-esophagram request assesses actual emptying; this question does not claim that a reserve result selects barium over every other investigation or proves the cause of dysphagia.",
      "teachingPoint": "Read the separate measurements for their separate purposes. The integrated post-sequence contraction, rather than its peak alone, is the reserve comparison. The baseline waves show propagation, and the junction trace during liquid loading does not support impaired relaxation. Report reduced reserve with preserved relaxation. The common timed-esophagram request assesses actual emptying; this question does not claim that a reserve result selects barium over every other investigation or proves the cause of dysphagia.",
      "supportingEvidenceClaimIds": [
        "claim.qq20261102d.hrm-rapid-swallow-interpretation",
        "claim.qq20261102d.hrm-rapid-drink-purpose",
        "claim.qq20261102e.hrm-reserve-versus-outflow",
        "claim.qbp2ar3.pressure-report-boundary"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r3",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "image",
        "caption": "Constructed pressure study and software integration; schematic traces, not patient measurements.",
        "assetPath": "clinical-exhibits/batch2a-r3-b04-pressure.png",
        "description": "The baseline upper, middle and lower body peaks occur successively. During each clustered-swallow sequence the body channels are quiet, followed by a taller, narrower recovery peak. The software DCI bars for both recovery responses are shorter than the baseline DCI bar. During the liquid load, the junction relaxation trace lies within the shaded laboratory reference band and the body channels do not form a sustained simultaneous pressure column.",
        "width": 760,
        "height": 1220
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.esophageal-physiology.reserve-before-junction-intervention.v1",
      "nextConceptId": "concept.esophageal-physiology.integrated-pressure-report.v2",
      "previousKeyServiceId": "service.contrast_swallow",
      "nextKeyServiceId": "service.contrast_swallow",
      "previousResultGate": {
        "id": "gate.achalasia.contrast.batch2a-r2.3",
        "resultTypeId": "service.contrast_swallow",
        "pendingLabel": "Contrast esophagram pending",
        "resultNarrative": "The timed contrast images retain a barium column above the junction; the tablet remains at the junction during the recorded examination. The outside laboratory also supplies a more recent full pressure study, acquired after the illustrated challenge recording, for the interval review. Medication reconciliation records oxycodone taken before that later pressure study.",
        "readiness": "all",
        "allowedServiceRouteIds": [
          "route.contrast_swallow.outsourced"
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
      "reason": "The scored objective changes from ranking investigation versus junction intervention to interpretation of an actual exhibit. The common contrast study remains an encounter-continuity step, not the scored management comparison; retain the prior management objective/history."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B03-context",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Deleted the entire duplicated current update and the instructional PNG footer. A new neutral exhibit carries the measured integral observations once, with equivalent accessibility text. Removed the investigation-versus-dilation matrix and its unsupported ranking. The scored task is a useful applied interpretation, as review two explicitly permits; no two-step management or hard-treatment claim is made. All choices share the existing contrast-result wait.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2ar3.20261104.b2a05",
    "auditId": "B2A05",
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r10",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r11",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2a-r2"
    ],
    "previousStem": "Which plan should be offered for {patientName}’s stock-handling limitation?",
    "previousChoiceLabels": [
      "Refer for elective inguinal hernia repair",
      "Continue inguinal hernia surveillance with graded activity",
      "Refer for hip-directed physiotherapy"
    ],
    "previousCurrentUpdate": "A hip radiograph shows joint-space narrowing and marginal osteophytes.",
    "previousExhibit": {
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
    },
    "currentUpdate": "The archived operation report from the same groin describes mesh fixed to the pubic tubercle and inguinal ligament, with the external oblique aponeurosis closed over it. The current dynamic study shows a protrusion at that groin during strain.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Identify the previous anterior mesh plane from the operative anatomy. Then: Apply that history to select the posterior offered repair for the symptomatic recurrence, rather than be distracted by hip disease or choose another anterior technique.",
    "reviewerNotes": "Offline application of the existing HerniaSurge guideline records. Recurrent-repair section/operative wording needs clinician source-alignment confirmation; no numerical risk, deadline, mesh specification or universal TEP-versus-TAPP superiority is asserted. The constructed history changes the scored objective and receives a new concept version.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "elective_discussion_4": "elective_discussion_4",
      "choice.qbp2ar3.20261104.b2a05.d1": "choice.qbp2ar2.20261104.b2a05.d1",
      "choice.qbp2ar3.20261104.b2a05.d2": "choice.qbp2ar2.20261104.b2a05.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_4": null,
      "choice.qbp2ar3.20261104.b2a05.d1": null,
      "choice.qbp2ar3.20261104.b2a05.d2": null
    },
    "choiceTimingOverrides": {
      "elective_discussion_4": {
        "kind": "no_test"
      },
      "choice.qbp2ar3.20261104.b2a05.d1": {
        "kind": "no_test"
      },
      "choice.qbp2ar3.20261104.b2a05.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v4.r11",
      "conceptId": "concept.inguinal-hernia.recurrence-after-anterior-repair.v1",
      "stem": "Which repair should be discussed for {patientName}’s recurrent groin defect?",
      "answerChoices": [
        {
          "id": "elective_discussion_4",
          "label": "Totally extraperitoneal repair",
          "isCorrect": true,
          "rationale": "The old report describes an anterior mesh plane. A posterior preperitoneal approach is the offered route that avoids re-entering that operated plane for a symptomatic recurrence.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar3.20261104.b2a05.d1",
          "label": "Anterior Lichtenstein mesh repair",
          "isCorrect": false,
          "distractorRationale": "This is a valid primary repair, but repeating the anterior mesh approach re-enters the prior operative plane in this recurrence."
        },
        {
          "id": "choice.qbp2ar3.20261104.b2a05.d2",
          "label": "Anterior Shouldice tissue repair",
          "isCorrect": false,
          "distractorRationale": "Changing to a tissue repair does not change the fact that this is another anterior-plane operation after the recorded anterior mesh repair."
        }
      ],
      "explanation": "The current functional episode remains consistent with the demonstrated hernia rather than being dismissed because hip disease also exists. The new decision concerns recurrence. Mesh fixed in the inguinal floor and covered by external oblique indicates a previous anterior repair; the offered posterior preperitoneal repair uses the other plane. This does not establish TEP as superior to every other posterior approach or promise that hernia repair cures the separate hip ache.",
      "teachingPoint": "The current functional episode remains consistent with the demonstrated hernia rather than being dismissed because hip disease also exists. The new decision concerns recurrence. Mesh fixed in the inguinal floor and covered by external oblique indicates a previous anterior repair; the offered posterior preperitoneal repair uses the other plane. This does not establish TEP as superior to every other posterior approach or promise that hernia repair cures the separate hip ache.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102c.groin-symptom-attribution",
        "claim.qbp2ar3.anterior-repair-plane",
        "claim.qbp2ar3.recurrent-groin-opposite-plane"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r3",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Current review record",
        "columnHeaders": [
          "Observation",
          "Recorded finding"
        ],
        "rowHeaders": [
          "Groin"
        ],
        "cells": [
          [
            "Work episode",
            "The superficial protrusion and focal pressure recur when the patient lifts the usual crate and interrupts the task."
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "nextConceptId": "concept.inguinal-hernia.recurrence-after-anterior-repair.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The prior symptom-attribution/referral objective is replaced by operative-plane planning for a documented recurrence. Earlier feedback already explains the functional referral; a new construct avoids pretending that repeating it is a new resident challenge."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B05-context",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the task’s stock-handling cue and the caption framing. Kept the symptomatic hernia and existing hip presentation, but deleted the repeated hip update and exhibit row because they do not select an operative plane. The decisive new observation is the old operation’s anatomy. All choices are named repairs at the same operative decision stage. Earlier preserved feedback can establish that referral is appropriate without giving this new plane decision away.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2ar3.20261104.b2a06",
    "auditId": "B2A06",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r8",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r9",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2a-r2"
    ],
    "previousStem": "Which ultrasound request should be sent for {patientName}’s intermittent groin contour?",
    "previousChoiceLabels": [
      "Standing strain; cine ultrasound of groin canals",
      "Supine strain; cine ultrasound of groin canals",
      "Standing compression; Doppler ultrasound of groin veins",
      "Supine compression; Doppler ultrasound of groin veins"
    ],
    "previousCurrentUpdate": "The sonographer’s acquisition worksheet records a supine musculoskeletal examination of the adductor origin with resisted adduction; it reproduces the medial-thigh pain. During today’s examination, supine cough does not produce the photographed contour. After standing and straining, a separate contour appears above the pubic tubercle.",
    "previousExhibit": null,
    "currentUpdate": "The outside worksheet records adductor-origin images acquired with resisted adduction. A brief transverse sweep at the photographed contour also shows moving fat following the cord on the lateral side of the inferior epigastric vessels during strain. Its cranial continuation runs beyond the recorded sweep.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Map the lateral epigastric relationship and cord course to the indirect/deep-ring route, rather than a direct or femoral origin. Then: Select the additional proximal acquisition that can establish a defect without assuming that distal fat movement already proves the diagnosis.",
    "reviewerNotes": "Anatomical application using the already recorded open groin-ultrasound source plus HerniaSurge initial-imaging guidance. The exact sweep is constructed and needs clinician review. No diagnostic accuracy, exclusive whole-exam protocol or claim that moving fat alone establishes a hernia is made.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_2": "dynamic_ultrasound_2",
      "choice.qbp2ar3.20261104.b2a06.d1": "choice.qbp2ar2.20261104.b2a06.d1",
      "choice.qbp2ar3.20261104.b2a06.d2": "choice.qbp2ar2.20261104.b2a06.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_2": "service.ultrasound",
      "choice.qbp2ar3.20261104.b2a06.d1": null,
      "choice.qbp2ar3.20261104.b2a06.d2": null
    },
    "choiceTimingOverrides": {
      "dynamic_ultrasound_2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qbp2ar3.20261104.b2a06.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qbp2ar3.20261104.b2a06.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "question": {
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r9",
      "conceptId": "concept.groin-ultrasound.proximal-neck-localization.v2",
      "stem": "Which focused groin ultrasound acquisition should trace {patientName}’s recorded tissue course proximally?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_2",
          "label": "Deep inguinal ring during Valsalva",
          "isCorrect": true,
          "rationale": "The lateral-to-epigastric cord course points toward the deep ring. Following the moving tissue proximally there can establish whether it enters through a defect rather than infer the diagnosis from a distal contour or an adductor study.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar3.20261104.b2a06.d1",
          "label": "Posterior inguinal wall during Valsalva",
          "isCorrect": false,
          "distractorRationale": "This is the nearby direct-hernia region, medial to the epigastric vessels. It does not best follow the lateral cord course actually recorded."
        },
        {
          "id": "choice.qbp2ar3.20261104.b2a06.d2",
          "label": "Femoral canal during Valsalva",
          "isCorrect": false,
          "distractorRationale": "This is another clinically important groin region, below the ligament and medial to the femoral vein; it does not trace the recorded tissue along the inguinal cord."
        }
      ],
      "explanation": "Use the anatomical course to choose the additional focus. The deep ring is lateral to the inferior epigastric vessels; the direct region lies medially and the femoral canal follows a different route below the ligament. The recorded distal fat movement is not itself proof of a proximal hernia neck. Follow its origin dynamically rather than infer that the tendon examination settled the contour question. A full study can include all regions and positions; this asks for the added focus, not a universally sufficient protocol.",
      "teachingPoint": "Use the anatomical course to choose the additional focus. The deep ring is lateral to the inferior epigastric vessels; the direct region lies medially and the femoral canal follows a different route below the ligament. The recorded distal fat movement is not itself proof of a proximal hernia neck. Follow its origin dynamically rather than infer that the tendon examination settled the contour question. A full study can include all regions and positions; this asks for the added focus, not a universally sufficient protocol.",
      "supportingEvidenceClaimIds": [
        "claim.qq20261102a.groin-initial-dynamic-assessment",
        "claim.qq20261102c.groin-inadequate-study-certainty",
        "claim.bread-butter.indirect-inguinal-hernia.lateral-epigastric",
        "claim.inguinal-hernia.direct-anatomic-location",
        "claim.qbp2ar2.femoral-anatomy-application",
        "claim.qbp2ar3.proximal-groin-acquisition"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r3",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.groin-ultrasound.symptom-provocation-protocol.v1",
      "nextConceptId": "concept.groin-ultrasound.proximal-neck-localization.v2",
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
      "reason": "The score changes from choosing a posture/provocation protocol to choosing an anatomical target from the actual recorded tissue course. Retain the previous protocol construct and its histories."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B06",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Deleted the standing-versus-supine symptom match and all venous foils. The three choices are nearby plausible groin targets with identical provocation and parallel grammar. The actual worksheet remains, while anatomical interpretation determines an additional focused acquisition. No MRI mandate, fixed position hierarchy or diagnosis from a photograph is asserted.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2ar3.20261104.b2a07",
    "auditId": "B2A07",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r10",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r11",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2a-r2"
    ],
    "previousStem": "Which plan should address {patientName}’s continuing work restriction?",
    "previousChoiceLabels": [
      "Elective inguinal hernia repair referral",
      "Supervised adductor strengthening rehabilitation",
      "Inguinal hernia surveillance with graded activity"
    ],
    "previousCurrentUpdate": "The targeted ultrasound shows a protrusion in the inguinal canal during strain that withdraws at rest. On interval review, jogging distance has increased. The rota records completed shifts, with crate handling assigned to a colleague.",
    "previousExhibit": {
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
    },
    "currentUpdate": "The targeted ultrasound shows a protrusion in the inguinal canal during strain that withdraws at rest. On interval review, jogging distance has increased. The rota records completed shifts, with crate handling assigned to a colleague.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Recognize that the improved shift record is on modified duty and does not test the usual lifting demand. Then: Use the reproduced limiting episode and ultrasound finding to prioritize the named hernia referral over more attachment treatment or surveillance.",
    "reviewerNotes": "The priority is for the demonstrated current restriction, not a prohibition on concurrent rehabilitation or a guarantee of surgical benefit. This remains separate from the new recurrent-repair-plane item B2A05; no merge or history change is applied.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_2": "elective_discussion_2",
      "choice.qbp2ar3.20261104.b2a07.d1": "choice.qbp2ar2.20261104.b2a07.d1",
      "choice.qbp2ar3.20261104.b2a07.d2": "choice.qbp2ar2.20261104.b2a07.d2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_2": null,
      "choice.qbp2ar3.20261104.b2a07.d1": null,
      "choice.qbp2ar3.20261104.b2a07.d2": null
    },
    "choiceTimingOverrides": {
      "elective_discussion_2": {
        "kind": "no_test"
      },
      "choice.qbp2ar3.20261104.b2a07.d1": {
        "kind": "no_test"
      },
      "choice.qbp2ar3.20261104.b2a07.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v2.r11",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
      "stem": "Which treatment should now be prioritized for {patientName}’s groin symptoms?",
      "answerChoices": [
        {
          "id": "elective_discussion_2",
          "label": "Arrange elective inguinal hernia repair referral",
          "isCorrect": true,
          "rationale": "Completed modified shifts and improved running do not establish tolerance of the original lifting task. The limiting episode now accompanies the demonstrated inguinal protrusion.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar3.20261104.b2a07.d1",
          "label": "Arrange supervised adductor strengthening rehabilitation",
          "isCorrect": false,
          "distractorRationale": "This remains appropriate for the attachment discomfort, but does not target the current protrusion-associated interruption of the usual job task."
        },
        {
          "id": "choice.qbp2ar3.20261104.b2a07.d2",
          "label": "Arrange inguinal hernia surveillance with graded activity",
          "isCorrect": false,
          "distractorRationale": "Surveillance can suit minimally symptomatic inguinal hernia, but the current original-task trial remains limited despite better exercise and modified work participation."
        }
      ],
      "explanation": "Compare function under the original demand with function after task reassignment. Current lifting still reproduces the limiting inguinal episode despite completed modified shifts and improved jogging. Prioritize the offered repair referral for that restriction; the adductor complaint can still receive care. No promise is made that an operation resolves all groin pain.",
      "teachingPoint": "Compare function under the original demand with function after task reassignment. Current lifting still reproduces the limiting inguinal episode despite completed modified shifts and improved jogging. Prioritize the offered repair referral for that restriction; the adductor complaint can still receive care. No promise is made that an operation resolves all groin pain.",
      "supportingEvidenceClaimIds": [
        "claim.qq20261102a.symptomatic-groin-planning",
        "claim.inguinal-hernia.symptomatic-elective-repair",
        "claim.qq20261102c.groin-symptom-attribution",
        "claim.qbp2ar2.functional-groin-target"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r3",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Current activity record",
        "columnHeaders": [
          "Activity",
          "Observation"
        ],
        "rowHeaders": [
          "Walking and running",
          "Crate handling",
          "Resisted adduction"
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
      "reason": "Same symptom-attribution and functional treatment-priority objective; only the cues and wording change, so preserve the concept ID."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B06-context-continuity",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Removed the global-recovery teaching caption, the Full stock task label and the task’s work-restriction pointer. Retained the actual rota, task interruption and ultrasound observations. All options name care plans; the preceding new acquisition feedback explains anatomy without recommending this repair referral.",
      "status": "awaiting_independent_and_clinician_review"
    }
  },
  {
    "id": "revision.qbp2ar3.20261104.b2a10",
    "auditId": "B2A10",
    "caseId": "case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
    "nodeId": "node.gs028se.pdsa-act-qi-measures.a-abandon-harm.1",
    "previousQuestionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r10",
    "questionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r11",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2a-r2"
    ],
    "previousStem": "Which change should {patientName}’s team test in the next small pilot?",
    "previousChoiceLabels": [
      "Reconcile hospital source lists before transfer",
      "Revise transfer parsing for hospital source lists",
      "Retrain transcription staff for hospital source transfer"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
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
    },
    "currentUpdate": null,
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Locate each discrepancy by comparing the same medicine before and after each transfer method; distinguish source gaps from real manual and import errors. Then: Apply the stated count-based priority to choose which specific small change to test first rather than assert a common cause from equal totals.",
    "reviewerNotes": "Illustrative process data, not an empirical rate, medication recommendation, causal proof or clinical cutoff. The count priority is local to this stated audit; patient harm or implementation burden could require a different priority in a real program. No correctness or player analytics are collected.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_abandon-harm": "correct_abandon-harm",
      "choice.qbp2ar3.20261104.b2a10.d1": "choice.qbp2ar2.20261104.b2a10.d1",
      "choice.qbp2ar3.20261104.b2a10.d2": "choice.qbp2ar2.20261104.b2a10.d2"
    },
    "choiceServiceOverrides": {
      "correct_abandon-harm": null,
      "choice.qbp2ar3.20261104.b2a10.d1": null,
      "choice.qbp2ar3.20261104.b2a10.d2": null
    },
    "choiceTimingOverrides": {
      "correct_abandon-harm": {
        "kind": "no_test"
      },
      "choice.qbp2ar3.20261104.b2a10.d1": {
        "kind": "no_test"
      },
      "choice.qbp2ar3.20261104.b2a10.d2": {
        "kind": "no_test"
      }
    },
    "question": {
      "id": "question.quality-improvement.pdsa-act-and-iterate.v3.r11",
      "conceptId": "concept.quality-improvement.source-by-method-next-pilot.v1",
      "stem": "Which single change should {patientName}’s clinic team test first to address the most omitted medicines in this audit?",
      "answerChoices": [
        {
          "id": "correct_abandon-harm",
          "label": "Check original hospital medicine lists with patients",
          "isCorrect": true,
          "rationale": "Two different audited medicines are absent at the original-source stage and remain absent in both outputs. Testing source completeness can target those two; the other observed transfer errors remain separate problems.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar3.20261104.b2a10.d1",
          "label": "Revise parsing of original hospital medicine lists during import",
          "isCorrect": false,
          "distractorRationale": "The import-specific omission is real, but parsing a document cannot recover the two medicines absent from the original source. This pilot directly targets one of the audited medicines."
        },
        {
          "id": "choice.qbp2ar3.20261104.b2a10.d2",
          "label": "Compare manual outputs against the original hospital medicine lists",
          "isCorrect": false,
          "distractorRationale": "The manual-only omission is real, but comparing transcription against the same incomplete source cannot recover the two upstream medicines. This pilot directly targets the separate manual-output error."
        }
      ],
      "explanation": "Track each medicine, not the equality of aggregate counts. Two audited omissions precede either transfer method, one arises in import and another in manual transcription. With the task’s stated medicine-count priority, testing the hospital-source check first targets the largest identified group. This is a hypothesis for a small improvement test, not proof of future benefit or permission to ignore the other errors. The constructed audit is not a population estimate or gameplay analytics.",
      "teachingPoint": "Track each medicine, not the equality of aggregate counts. Two audited omissions precede either transfer method, one arises in import and another in manual transcription. With the task’s stated medicine-count priority, testing the hospital-source check first targets the largest identified group. This is a hypothesis for a small improvement test, not proof of future benefit or permission to ignore the other errors. The constructed audit is not a population estimate or gameplay analytics.",
      "supportingEvidenceClaimIds": [
        "claim.quality-improvement.pdsa-linked-iterative-tests",
        "claim.quality-improvement.next-step-follows-results",
        "claim.qq20261102b.pdsa-hypothesis-not-proof",
        "claim.qbp2ar3.paired-error-localization"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r3",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true,
      "exhibit": {
        "kind": "table",
        "caption": "Constructed paired discrepancy audit; each row follows one medicine through the same record and outputs.",
        "columnHeaders": [
          "Record / medicine",
          "Reference",
          "Original source",
          "Manual output",
          "Import output"
        ],
        "rowHeaders": [
          "A",
          "B",
          "C",
          "D",
          "E"
        ],
        "cells": [
          [
            "Hospital A / metformin",
            "Present",
            "Absent",
            "Absent",
            "Absent"
          ],
          [
            "Hospital B / metoprolol",
            "Present",
            "Absent",
            "Absent",
            "Absent"
          ],
          [
            "Hospital C / levothyroxine",
            "Present",
            "Present",
            "Present",
            "Absent"
          ],
          [
            "Hospital D / amlodipine",
            "Present",
            "Present",
            "Absent",
            "Present"
          ],
          [
            "Local clinic E / omeprazole",
            "Present",
            "Present",
            "Present",
            "Present"
          ]
        ]
      }
    },
    "clinicalBinding": {
      "previousConceptId": "concept.quality-improvement.source-by-method-next-pilot.v1",
      "nextConceptId": "concept.quality-improvement.source-by-method-next-pilot.v1",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "Same source-versus-transfer improvement-pilot objective. Paired observations repair the evidentiary gap without changing the clinical/process meaning or transferring history to another construct."
    },
    "ownerProgramReview": {
      "ownerItemId": "b1-B36",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaced equal marginal omission counts with medicine-level paired source/manual/import observations, including genuine competing transfer defects. The task explicitly defines the bounded priority, and all choices test one named process change. Removed decorative staff times and the reconciled/reconcile word echo. Preserved the named employee-discussion role and a short audit complaint.",
      "status": "awaiting_independent_and_clinician_review"
    },
    "presentationTemplate": "{patientName} reviews a preoperative-clinic medication-list transfer audit with the team. Each source record and its two transferred outputs are compared with a reference list established by patient interview and medicine-container review.",
    "previousPresentation": "{patientName} leads a preoperative-clinic medication-list pilot. Copied local-clinic and hospital records are processed by both manual transcription and automatic import, then checked against the reconciled reference list.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qbp2ar2.20261104.case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
        "patientPresentationVariantId": "presentation.gs028se.pdsa-act-qi-measures.a-abandon-harm",
        "contentVersion": "presentation-revision.question-bank-batch2a-round2.2026-11-04.v1",
        "revisedChiefComplaint": "Pathway improvement review",
        "revisedPresentation": "{patientName} leads a preoperative-clinic medication-list pilot. Copied local-clinic and hospital records are processed by both manual transcription and automatic import, then checked against the reconciled reference list.",
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
      "idPrefix": "ppr.qbp2ar3.20261104.",
      "contentVersion": "presentation-revision.question-bank-batch2a-round3.2026-11-04.v1"
    },
    "chiefComplaint": "Medication list audit",
    "previousChiefComplaint": "Pathway improvement review",
    "previousProfileChiefComplaints": []
  },
  {
    "id": "revision.qbp2ar3.20261104.b2a11",
    "auditId": "B2A11",
    "caseId": "case.adrenal-incidentaloma.small-adrenal-adenoma",
    "nodeId": "node.adrenal-incidentaloma.small-adrenal-adenoma.1",
    "previousQuestionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4.r3",
    "questionVariantId": "question.adrenal-incidentaloma.one-mg-dst.v4.r4",
    "previousContentVersions": [
      "question-authoring.2026-11-04.batch2a-r2"
    ],
    "previousStem": "Which study should guide the next etiologic step in {patientName}’s cortisol evaluation?",
    "previousChoiceLabels": [
      "Basal plasma corticotropin measurement",
      "High-dose dexamethasone suppression study",
      "Corticotropin-releasing hormone stimulation study"
    ],
    "previousCurrentUpdate": "Post-test serum cortisol remains above this laboratory’s suppression decision limit on repeated overnight dexamethasone studies.",
    "previousExhibit": null,
    "currentUpdate": "The nodule was seen on an abdominal CT acquired in the portal venous phase. Late-night salivary cortisol and urine free-cortisol results exceed their laboratory decision limits on repeated assessment. Medication review records no oral, inhaled, injected or topical glucocorticoid use. Basal plasma ACTH is below the laboratory reporting limit on repeat sampling. A previous headache MRI also describes a small pituitary focus of lower enhancement.",
    "educationalIntent": "resident_application_independent_difficulty_review_pending",
    "intendedInference": "Interpret the independently abnormal cortisol findings and repeatedly suppressed ACTH as an adrenal-directed, rather than ACTH-dependent, evaluation. Then: Use that branch and the actual prior CT acquisition to choose the named adrenal study over targeting an incidental pituitary focus or an ectopic ACTH source.",
    "reviewerNotes": "Offline mapping to recorded Endocrine Society/Endotext and ESE/AAES guidance. The ACTH source-localization fact has one directly recorded supporting reference; exact endocrine application and imaging wording require clinician review. No numerical cortisol/ACTH threshold, dose, washout, operation indication or ACTH-dependent localization hierarchy is introduced.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dst_4": "dst_4",
      "choice.qbp2ar3.20261104.b2a11.d1": "choice.qbp2ar2.20261104.b2a11.d1",
      "choice.qbp2ar3.20261104.b2a11.d2": "choice.qbp2ar2.20261104.b2a11.d2"
    },
    "choiceServiceOverrides": {
      "dst_4": null,
      "choice.qbp2ar3.20261104.b2a11.d1": null,
      "choice.qbp2ar3.20261104.b2a11.d2": null
    },
    "choiceTimingOverrides": {
      "dst_4": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qbp2ar3.20261104.b2a11.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qbp2ar3.20261104.b2a11.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "question": {
      "id": "question.adrenal-incidentaloma.one-mg-dst.v4.r4",
      "conceptId": "concept.adrenal-incidentaloma.acth-directed-source-imaging.v2",
      "stem": "Which imaging study should be prioritized to investigate the source of {patientName}’s cortisol findings?",
      "answerChoices": [
        {
          "id": "dst_4",
          "label": "Noncontrast adrenal CT",
          "isCorrect": true,
          "rationale": "The repeated biochemical pattern supports an ACTH-independent branch, so the incidental pituitary focus does not redirect the evaluation. The existing contrast-only abdominal acquisition has not supplied the unenhanced adrenal assessment.",
          "distractorRationale": null
        },
        {
          "id": "choice.qbp2ar3.20261104.b2a11.d1",
          "label": "Dedicated pituitary MRI",
          "isCorrect": false,
          "distractorRationale": "The small focus is an anchoring temptation. Pituitary localization belongs to an ACTH-dependent evaluation; repeatedly suppressed ACTH does not support making that focus the source here."
        },
        {
          "id": "choice.qbp2ar3.20261104.b2a11.d2",
          "label": "Contrast-enhanced chest CT",
          "isCorrect": false,
          "distractorRationale": "A search for an ectopic ACTH source can be relevant in an ACTH-dependent pathway. The supplied hormone pattern instead directs adrenal evaluation; neither the incidental adrenal size nor the pituitary image substitutes for that classification."
        }
      ],
      "explanation": "First establish that the current question follows abnormal cortisol assessment rather than screening an image. Then interpret ACTH before assigning a source: repeatedly suppressed ACTH directs an adrenal pathway despite the pituitary incidental finding. Obtain the unenhanced adrenal assessment that the original contrast-only CT did not include. This does not select adrenalectomy, diagnose the nodule from its size, or establish a universal ACTH-dependent localization sequence.",
      "teachingPoint": "First establish that the current question follows abnormal cortisol assessment rather than screening an image. Then interpret ACTH before assigning a source: repeatedly suppressed ACTH directs an adrenal pathway despite the pituitary incidental finding. Obtain the unenhanced adrenal assessment that the original contrast-only CT did not include. This does not select adrenalectomy, diagnose the nodule from its size, or establish a universal ACTH-dependent localization sequence.",
      "supportingEvidenceClaimIds": [
        "claim.cushing.confirm-before-localization",
        "claim.cushing.acth-guides-adrenal-imaging",
        "claim.qbp2ar3.cortisol-exposure-history",
        "claim.qbp2ar3.cortisol-branch-before-image",
        "claim.qbp2ar3.unenhanced-adrenal-assessment"
      ],
      "contentVersion": "question-authoring.2026-11-04.batch2a-r3",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null,
      "aiAssistedDrafting": true
    },
    "clinicalBinding": {
      "previousConceptId": "concept.adrenal-incidentaloma.cortisol-etiologic-classification.v1",
      "nextConceptId": "concept.adrenal-incidentaloma.acth-directed-source-imaging.v2",
      "previousKeyServiceId": null,
      "nextKeyServiceId": null,
      "previousResultGate": null,
      "nextResultGate": null,
      "reason": "The score changes from obtaining basal ACTH to applying an already measured hormone pattern to the anatomical investigation. Preserve the initial-screen and etiologic-assay constructs and their histories."
    },
    "ownerProgramReview": {
      "ownerItemId": "new-adrenal-question-flag",
      "reviewedOn": "2026-11-04",
      "whatChanged": "Replaced recall of the next basal measurement with interpretation of measured hormones before choosing among three named imaging targets. Added a plausible competing incidental image, raw prior-CT acquisition facts and specific exposure history. The lead-in is one complete imaging task, with no etiologic-stage cue or competing hormonal screens.",
      "status": "awaiting_independent_and_clinician_review"
    }
  }
];

export const QUESTION_BANK_BATCH2A_ROUND3_CONCEPT_VERSIONS: QuestionFlagConceptVersion[] = [
  {
    "id": "concept.esophageal-physiology.reserve-acquisition-integrity.v1",
    "displayName": "Check the recorded phase before interpreting contractile reserve",
    "learningObjective": "Distinguish completed baseline/outflow observations from an incomplete post-cluster acquisition before reporting a reserve deficit for operative assessment.",
    "conceptType": "workup",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.achalasia.high-resolution-manometry.v2",
    "versioningReason": "The score changes from identifying a missing baseline classification series to recognizing an uninterpretable reserve acquisition despite available baseline and liquid-load observations. Retain the original classification objective and history.",
    "revisedItemIds": [
      "B2A03"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102c.hrm-protocol-and-provocation",
      "claim.qq20261102d.hrm-rapid-swallow-interpretation",
      "claim.qq20261102d.hrm-rapid-drink-purpose",
      "claim.qbp2ar3.reserve-recording-integrity"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2a-r3",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.esophageal-physiology.integrated-pressure-report.v2",
    "displayName": "Interpret reserve separately from baseline propagation and junction relaxation",
    "learningObjective": "Use the acquired baseline, integrated post-sequence response and liquid-load behavior to choose a defensible physiological report without inferring emptying or a treatment indication.",
    "conceptType": "workup",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.esophageal-physiology.reserve-before-junction-intervention.v1",
    "versioningReason": "The scored objective changes from ranking investigation versus junction intervention to interpretation of an actual exhibit. The common contrast study remains an encounter-continuity step, not the scored management comparison; retain the prior management objective/history.",
    "revisedItemIds": [
      "B2A04"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102d.hrm-rapid-swallow-interpretation",
      "claim.qq20261102d.hrm-rapid-drink-purpose",
      "claim.qq20261102e.hrm-reserve-versus-outflow",
      "claim.qbp2ar3.pressure-report-boundary"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2a-r3",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.inguinal-hernia.recurrence-after-anterior-repair.v1",
    "displayName": "Choose the operative plane for a symptomatic recurrent inguinal hernia",
    "learningObjective": "Interpret the archived operative anatomy and choose an offered posterior repair after prior anterior mesh surgery rather than repeat the operated plane.",
    "conceptType": "management",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.inguinal-hernia.symptomatic-elective-repair.v3",
    "versioningReason": "The prior symptom-attribution/referral objective is replaced by operative-plane planning for a documented recurrence. Earlier feedback already explains the functional referral; a new construct avoids pretending that repeating it is a new resident challenge.",
    "revisedItemIds": [
      "B2A05"
    ],
    "evidenceClaimIds": [
      "claim.inguinal-hernia.symptomatic-elective-repair",
      "claim.qq20261102c.groin-symptom-attribution",
      "claim.qbp2ar3.anterior-repair-plane",
      "claim.qbp2ar3.recurrent-groin-opposite-plane"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2a-r3",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.groin-ultrasound.proximal-neck-localization.v2",
    "displayName": "Select a dynamic groin acquisition from the recorded anatomical course",
    "learningObjective": "Interpret a distal cord finding relative to the inferior epigastric vessels and select the additional acquisition that can trace its proximal origin.",
    "conceptType": "workup",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.groin-ultrasound.symptom-provocation-protocol.v1",
    "versioningReason": "The score changes from choosing a posture/provocation protocol to choosing an anatomical target from the actual recorded tissue course. Retain the previous protocol construct and its histories.",
    "revisedItemIds": [
      "B2A06"
    ],
    "evidenceClaimIds": [
      "claim.qq20261102a.groin-initial-dynamic-assessment",
      "claim.qq20261102c.groin-inadequate-study-certainty",
      "claim.bread-butter.indirect-inguinal-hernia.lateral-epigastric",
      "claim.inguinal-hernia.direct-anatomic-location",
      "claim.qbp2ar2.femoral-anatomy-application",
      "claim.qbp2ar3.proximal-groin-acquisition"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2a-r3",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  },
  {
    "id": "concept.adrenal-incidentaloma.acth-directed-source-imaging.v2",
    "displayName": "Select source-directed imaging from cortisol and ACTH findings",
    "learningObjective": "Use a supported cortisol/ACTH pattern to choose adrenal imaging despite an incidental pituitary focus, rather than recall the next basal assay after suppression testing.",
    "conceptType": "workup",
    "earliestFacilityStage": 1,
    "educationalTier": 1,
    "previousConceptId": "concept.adrenal-incidentaloma.cortisol-etiologic-classification.v1",
    "versioningReason": "The score changes from obtaining basal ACTH to applying an already measured hormone pattern to the anatomical investigation. Preserve the initial-screen and etiologic-assay constructs and their histories.",
    "revisedItemIds": [
      "B2A11"
    ],
    "evidenceClaimIds": [
      "claim.cushing.confirm-before-localization",
      "claim.cushing.acth-guides-adrenal-imaging",
      "claim.qbp2ar3.cortisol-exposure-history",
      "claim.qbp2ar3.cortisol-branch-before-image",
      "claim.qbp2ar3.unenhanced-adrenal-assessment"
    ],
    "contentVersion": "question-authoring.2026-11-04.batch2a-r3",
    "aiAssistedDrafting": true,
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null
  }
];
