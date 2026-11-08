import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";
/** Exact current live source at stats1 intake. Never an acceptance. */
export const QUESTION_STATS1_RETAINED_INPUT:SyntheticClinicalRelease={
  "id": "clinical.stats1-retained-input.20261108.v1",
  "schemaVersion": 1,
  "publicationStatus": "synthetic_unapproved_prototype",
  "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
  "concepts": [
    {
      "id": "concept.statistics-ethics.independent-t",
      "displayName": "Select an independent-samples t test",
      "learningObjective": "Select an independent-samples t test for a continuous outcome in two independent groups when its assumptions are reasonable.",
      "earliestFacilityStage": 2,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.paired-t",
      "displayName": "Select a paired t test",
      "learningObjective": "Select a paired t test for a continuous outcome measured twice on the same units when paired differences are reasonably normal.",
      "earliestFacilityStage": 2,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.one-way-anova",
      "displayName": "Select one-way ANOVA",
      "learningObjective": "Select one-way ANOVA for a continuous outcome across three or more independent groups when its assumptions are reasonable.",
      "earliestFacilityStage": 2,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.rank-sum",
      "displayName": "Select a Wilcoxon rank-sum test",
      "learningObjective": "Select a Wilcoxon rank-sum procedure for ordinal or markedly non-normal observations from two independent groups.",
      "earliestFacilityStage": 2,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.signed-rank",
      "displayName": "Select a Wilcoxon signed-rank test",
      "learningObjective": "Select a Wilcoxon signed-rank procedure for paired continuous differences that are reasonably symmetric but unsuitable for a paired t model.",
      "earliestFacilityStage": 2,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.chi-square",
      "displayName": "Select a chi-square test of independence",
      "learningObjective": "Select a chi-square test of independence for two categorical variables when expected counts support the approximation.",
      "earliestFacilityStage": 2,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.fisher-exact",
      "displayName": "Select Fisher exact test",
      "learningObjective": "Select Fisher exact testing for a sparse two-by-two categorical table when a chi-square approximation is unreliable.",
      "earliestFacilityStage": 2,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.study-design",
      "displayName": "Identify basic study designs",
      "learningObjective": "Identify randomized experiments, cohort studies, case-control studies, and cross-sectional studies from how participants and measurements are organized.",
      "earliestFacilityStage": 2,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.bias-confounding",
      "displayName": "Distinguish bias from confounding",
      "learningObjective": "Identify confounding, selection bias, and measurement bias as distinct threats to inference.",
      "earliestFacilityStage": 2,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.sensitivity-specificity",
      "displayName": "Interpret sensitivity and specificity",
      "learningObjective": "Calculate and interpret sensitivity and specificity using the correct disease-status denominators.",
      "earliestFacilityStage": 0,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.predictive-value-prevalence",
      "displayName": "Relate positive predictive value to prevalence",
      "learningObjective": "Calculate positive predictive value and predict how it changes with prevalence when test characteristics stay fixed.",
      "earliestFacilityStage": 0,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.predictive-value.collection-population-denominator.v1",
      "displayName": "Match a positive result to its collection population and denominator",
      "learningObjective": "Identify the relevant tested cohort from collection chronology, then calculate positive predictive value rather than sensitivity or pretest prevalence.",
      "earliestFacilityStage": 0,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.risk-ratio-odds-ratio",
      "displayName": "Distinguish risk ratio and odds ratio",
      "learningObjective": "Name and interpret risk ratios and odds ratios without silently substituting one measure for the other.",
      "earliestFacilityStage": 2,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.arr-nnt",
      "displayName": "Calculate absolute risk reduction and NNT",
      "learningObjective": "Calculate absolute risk reduction and number needed to treat while retaining comparator, outcome, and time horizon.",
      "earliestFacilityStage": 0,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.p-value",
      "displayName": "Interpret a p-value",
      "learningObjective": "Interpret a p-value as a null-model tail probability without treating it as effect size or hypothesis probability.",
      "earliestFacilityStage": 2,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.p-value.v2",
      "displayName": "Apply uncertainty to a target-benefit decision",
      "learningObjective": "Integrate an effect estimate, confidence interval and null test to distinguish target benefit confirmed, excluded or unresolved and avoid false adoption, futility or equivalence conclusions.",
      "earliestFacilityStage": 2,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.confidence-interval",
      "displayName": "Interpret a confidence interval",
      "learningObjective": "Interpret confidence intervals using their null value and precision without assigning probability to a fixed parameter.",
      "earliestFacilityStage": 2,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.statistics-ethics.errors-power",
      "displayName": "Distinguish type I error, type II error, and power",
      "learningObjective": "Distinguish type I error, type II error, and power relative to a prespecified model and effect.",
      "earliestFacilityStage": 2,
      "conceptType": "applied_science"
    }
  ],
  "cases": [
    {
      "id": "case.gs028se.independent-t-paired-t.a-two-teams",
      "displayName": "Select an independent-samples t test and Select a paired t test",
      "patientPresentationVariantId": "presentation.gs028se.independent-t-paired-t.a-two-teams",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "venous leg ulcer study",
      "presentation": "{patientName}, the journal-club lead, reviews a trial of a new compression device for venous leg ulcers in adults whose arterial assessment permits compression. Two groups contribute healing times. The presenter cites his own testimonial as independent confirmation; he submitted it under his middle name so the reviews would look less repetitive. The protocol's assumptions are available.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Two-Sample t-Test",
        "Paired t-Test",
        "McNemar Test",
        "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.independent-t-paired-t.a-two-teams.1",
          "questionVariantId": "question.statistics-ethics.independent-t.v1",
          "primaryConceptId": "concept.statistics-ethics.independent-t",
          "stem": "Which analysis best fits the study's comparison of mean healing time, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_two-teams",
              "label": "Two-sample t test",
              "isCorrect": true,
              "rationale": "The study compares means from two groups of different people, and its stated continuous-data assumptions are reasonable. A two-sample t procedure matches that structure.",
              "serviceRequest": null
            },
            {
              "id": "d1_two-teams",
              "label": "Paired t test",
              "isCorrect": false,
              "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations.",
              "serviceRequest": null
            },
            {
              "id": "d2_two-teams",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": false,
              "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links.",
              "serviceRequest": null
            },
            {
              "id": "d3_two-teams",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum answers a ranked-observation comparison. This study explicitly requests means and supplies reasonable assumptions for the mean-based procedure.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use a two-sample t test for mean completed healing time: the groups contain different people, and the stated continuous-data assumptions are reasonable.",
          "teachingPoint": "Start with the outcome and who contributed it. This study compares mean healing time between two groups of different people, with reasonable normal-model assumptions and complete follow-up. A two-sample t test fits that question. Remember: sharing an outcome measure does not make observations linked; repeated people or deliberate matching would change the structure.",
          "exhibit": {
            "kind": "abstract",
            "title": "Healing time — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational compression device in venous leg ulcers. Outcome: healing time, in days. Two separately sampled treatment groups contribute one measurement per person. Groups do not overlap and nobody is matched. Measurements are approximately normal with comparable variability and no influential outliers. All times are observed to completion with no censoring. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "Two-Sample t-Test",
            "Paired t-Test",
            "McNemar Test",
            "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_two-teams",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a two-sample t test for mean completed healing time: the groups contain different people, and the stated continuous-data assumptions are reasonable.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_two-teams",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a two-sample t test for mean completed healing time: the groups contain different people, and the stated continuous-data assumptions are reasonable.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_two-teams",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a two-sample t test for mean completed healing time: the groups contain different people, and the stated continuous-data assumptions are reasonable.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.independent-t-paired-t.a-two-cohorts",
      "displayName": "Select an independent-samples t test and Select a paired t test",
      "patientPresentationVariantId": "presentation.gs028se.independent-t-paired-t.a-two-cohorts",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "lactational breast abscess study",
      "presentation": "{patientName}, the breast-service research lead, reviews a trial of a new topical agent after drainage of lactational breast abscesses. Different participants received each preparation. Ultrasound measured the remaining cavity area at the protocol visit. A colleague proposes linking the groups because the same sonographer collected all measurements. The report includes the distribution checks for analysis.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Two-Sample t-Test",
        "Paired t-Test",
        "McNemar Test",
        "ACR Appropriateness Criteria Breast Imaging During Lactation",
        "Academy of Breastfeeding Medicine Clinical Protocol #36: The Mastitis Spectrum, Revised 2022"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.independent-t-paired-t.a-two-cohorts.1",
          "questionVariantId": "question.statistics-ethics.independent-t.v2",
          "primaryConceptId": "concept.statistics-ethics.independent-t",
          "stem": "Which analysis best fits the study's comparison of mean remaining abscess-cavity area, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_two-cohorts",
              "label": "Two-sample t test",
              "isCorrect": true,
              "rationale": "The study compares means from two groups of different people, and its stated continuous-data assumptions are reasonable. A two-sample t procedure matches that structure.",
              "serviceRequest": null
            },
            {
              "id": "d1_two-cohorts",
              "label": "Paired t test",
              "isCorrect": false,
              "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations.",
              "serviceRequest": null
            },
            {
              "id": "d2_two-cohorts",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum answers a ranked-observation comparison. This study explicitly requests means and supplies reasonable assumptions for the mean-based procedure.",
              "serviceRequest": null
            },
            {
              "id": "d3_two-cohorts",
              "label": "Chi-square test of independence",
              "isCorrect": false,
              "rationale": "Chi-square testing analyzes counts in categories. The requested comparison concerns continuous measurements or ordered ratings, not a categorical contingency table.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "A two-sample t test fits mean remaining abscess-cavity area in two nonoverlapping groups. Using the same sonographer does not create repeated or matched observations.",
          "teachingPoint": "The scanner does not define the relationship between observations. These abscess-cavity areas come from different people in two nonoverlapping groups, with suitable continuous-data assumptions. A two-sample t test compares their means. Remember to ask who was measured, not whether the groups used the same instrument or had the same number of columns.",
          "exhibit": {
            "kind": "abstract",
            "title": "Remaining abscess-cavity area — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational topical agent in lactational breast abscesses. Outcome: remaining abscess-cavity area, in square centimeters. Two separately sampled treatment groups contribute one measurement per person. Groups do not overlap and nobody is matched. Measurements are approximately normal with comparable variability and no influential outliers. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "Two-Sample t-Test",
            "Paired t-Test",
            "McNemar Test",
            "ACR Appropriateness Criteria Breast Imaging During Lactation",
            "Academy of Breastfeeding Medicine Clinical Protocol #36: The Mastitis Spectrum, Revised 2022"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_two-cohorts",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "A two-sample t test fits mean remaining abscess-cavity area in two nonoverlapping groups. Using the same sonographer does not create repeated or matched observations.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_two-cohorts",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "A two-sample t test fits mean remaining abscess-cavity area in two nonoverlapping groups. Using the same sonographer does not create repeated or matched observations.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_two-cohorts",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "A two-sample t test fits mean remaining abscess-cavity area in two nonoverlapping groups. Using the same sonographer does not create repeated or matched observations.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.independent-t-paired-t.a-two-shifts",
      "displayName": "Select an independent-samples t test and Select a paired t test",
      "patientPresentationVariantId": "presentation.gs028se.independent-t-paired-t.a-two-shifts",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "superficial partial-thickness burn study",
      "presentation": "{patientName}, the burn-service discussion lead, reviews two new cooling dressings for superficial partial-thickness burns. The trial records remaining wound depth at a protocol visit, with each adult contributing one measurement. A colleague has prepared a comparison of dressing labels. The investigators' stated question concerns average remaining depth, and the measurement assumptions appear in the exhibit.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Two-Sample t-Test",
        "Paired t-Test",
        "McNemar Test",
        "ABA Guidelines for Burn Patient Referral",
        "2024 Guidelines for First Aid"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.independent-t-paired-t.a-two-shifts.1",
          "questionVariantId": "question.statistics-ethics.independent-t.v3",
          "primaryConceptId": "concept.statistics-ethics.independent-t",
          "stem": "Which analysis best fits the study's comparison of mean remaining burn depth, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_two-shifts",
              "label": "Two-sample t test",
              "isCorrect": true,
              "rationale": "The study compares means from two groups of different people, and its stated continuous-data assumptions are reasonable. A two-sample t procedure matches that structure.",
              "serviceRequest": null
            },
            {
              "id": "d1_two-shifts",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": false,
              "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links.",
              "serviceRequest": null
            },
            {
              "id": "d2_two-shifts",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum answers a ranked-observation comparison. This study explicitly requests means and supplies reasonable assumptions for the mean-based procedure.",
              "serviceRequest": null
            },
            {
              "id": "d3_two-shifts",
              "label": "Chi-square test of independence",
              "isCorrect": false,
              "rationale": "Chi-square testing analyzes counts in categories. The requested comparison concerns continuous measurements or ordered ratings, not a categorical contingency table.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Compare mean burn depth with a two-sample t test under the supplied assumptions. Device labels define groups; they are not the measured outcome.",
          "teachingPoint": "Device names identify the groups; measured burn depth is the continuous outcome. With two groups of different people and reasonable normal-model assumptions, a two-sample t test fits a comparison of means. Remember to distinguish a group label from the outcome being compared before selecting a categorical or continuous-data procedure.",
          "exhibit": {
            "kind": "abstract",
            "title": "Remaining burn depth — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational cooling dressing in superficial partial-thickness burns. Outcome: remaining burn depth, in millimeters. Two separately sampled treatment groups contribute one measurement per person. Groups do not overlap and nobody is matched. Measurements are approximately normal with comparable variability and no influential outliers. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "Two-Sample t-Test",
            "Paired t-Test",
            "McNemar Test",
            "ABA Guidelines for Burn Patient Referral",
            "2024 Guidelines for First Aid"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_two-shifts",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Compare mean burn depth with a two-sample t test under the supplied assumptions. Device labels define groups; they are not the measured outcome.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_two-shifts",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Compare mean burn depth with a two-sample t test under the supplied assumptions. Device labels define groups; they are not the measured outcome.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_two-shifts",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Compare mean burn depth with a two-sample t test under the supplied assumptions. Device labels define groups; they are not the measured outcome.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.independent-t-paired-t.a-two-scripts",
      "displayName": "Select an independent-samples t test and Select a paired t test",
      "patientPresentationVariantId": "presentation.gs028se.independent-t-paired-t.a-two-scripts",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "chronic anal fissure study",
      "presentation": "{patientName}, the colorectal research lead, reviews a study of a new topical agent for chronic anal fissure. Two hospitals contribute completed healing times from different patients. The company representative calls his presentation a brief overview, then asks whether attending it can count toward everyone's continuing education credits. The report supplies its sampling and distribution details.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Two-Sample t-Test",
        "Paired t-Test",
        "McNemar Test",
        "ASCRS Clinical Practice Guidelines for the Management of Anal Fissures",
        "SIUCP guidelines for the management of anal fissure"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.independent-t-paired-t.a-two-scripts.1",
          "questionVariantId": "question.statistics-ethics.independent-t.v4",
          "primaryConceptId": "concept.statistics-ethics.independent-t",
          "stem": "Which analysis best fits the study's comparison of mean fissure-healing time, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_two-scripts",
              "label": "Two-sample t test",
              "isCorrect": true,
              "rationale": "The study compares means from two groups of different people, and its stated continuous-data assumptions are reasonable. A two-sample t procedure matches that structure.",
              "serviceRequest": null
            },
            {
              "id": "d1_two-scripts",
              "label": "Paired t test",
              "isCorrect": false,
              "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations.",
              "serviceRequest": null
            },
            {
              "id": "d2_two-scripts",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": false,
              "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links.",
              "serviceRequest": null
            },
            {
              "id": "d3_two-scripts",
              "label": "Chi-square test of independence",
              "isCorrect": false,
              "rationale": "Chi-square testing analyzes counts in categories. The requested comparison concerns continuous measurements or ordered ratings, not a categorical contingency table.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "A two-sample t test fits these two groups' mean completed fissure-healing times. There is no matching, and the normal-model assumptions are stated to be reasonable.",
          "teachingPoint": "A two-sample t test compares means from two groups of different people when the stated assumptions are reasonable. Each participant contributes one completed fissure-healing time here, with no matching. Remember that two columns alone tell you little: the people, measurement scale and distribution checks determine whether a two-group mean comparison fits.",
          "exhibit": {
            "kind": "abstract",
            "title": "Fissure-healing time — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational topical agent in chronic anal fissure. Outcome: fissure-healing time, in days. Two hospitals using different study preparations contribute different people, without matching, with one completed healing time per person. Measurements are approximately normal with comparable variability and no influential outliers. All times are observed to completion with no censoring. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "Two-Sample t-Test",
            "Paired t-Test",
            "McNemar Test",
            "ASCRS Clinical Practice Guidelines for the Management of Anal Fissures",
            "SIUCP guidelines for the management of anal fissure"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_two-scripts",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "A two-sample t test fits these two groups' mean completed fissure-healing times. There is no matching, and the normal-model assumptions are stated to be reasonable.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_two-scripts",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "A two-sample t test fits these two groups' mean completed fissure-healing times. There is no matching, and the normal-model assumptions are stated to be reasonable.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_two-scripts",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "A two-sample t test fits these two groups' mean completed fissure-healing times. There is no matching, and the normal-model assumptions are stated to be reasonable.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.independent-t-paired-t.b-same-rooms",
      "displayName": "Select an independent-samples t test and Select a paired t test",
      "patientPresentationVariantId": "presentation.gs028se.independent-t-paired-t.b-same-rooms",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "hidradenitis suppurativa study",
      "presentation": "{patientName}, the skin-service research lead, reviews a new topical agent for hidradenitis suppurativa. Investigators measured involved skin area before and after treatment in the same adults. The coordinator describes appointments as flexible: participants may choose any date, provided it is the one already booked for them. The study reports individual changes and their distribution checks.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Two-Sample t-Test",
        "Paired t-Test",
        "McNemar Test",
        "Australasian hidradenitis suppurativa management guidelines",
        "North American HS management guidelines Part I"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.independent-t-paired-t.b-same-rooms.1",
          "questionVariantId": "question.statistics-ethics.paired-t.v1",
          "primaryConceptId": "concept.statistics-ethics.paired-t",
          "stem": "Which analysis best fits the study's comparison of mean involved-skin-area change, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_same-rooms",
              "label": "Paired t test",
              "isCorrect": true,
              "rationale": "Each change comes from repeated measurements or a designated pair, and those differences are approximately normal. A paired t procedure compares their mean.",
              "serviceRequest": null
            },
            {
              "id": "d1_same-rooms",
              "label": "Independent-samples t test",
              "isCorrect": false,
              "rationale": "A two-sample t procedure treats the groups as unrelated. It would discard the within-person or designated-pair relationship that supplies this study's differences.",
              "serviceRequest": null
            },
            {
              "id": "d2_same-rooms",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": false,
              "rationale": "Signed-rank uses the signs and ranks of differences. Here the stated question is about mean change and the approximately normal differences support a paired mean model.",
              "serviceRequest": null
            },
            {
              "id": "d3_same-rooms",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum compares ranked observations from unrelated groups. It would ignore the repeated-person or matching structure used to form the study's differences.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use a paired t test on each person's involved-skin-area change. The same people supply both measurements, and the changes are approximately normal.",
          "teachingPoint": "Repeated measurements from one person belong together. Calculate each person's involved-skin-area change, then analyze those differences; here they are approximately normal, supporting a paired t test. Remember: the unit of analysis is the within-person change. Treating the visits as unrelated groups discards the relationship built into the study design.",
          "exhibit": {
            "kind": "abstract",
            "title": "Involved-skin-area change — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational topical agent in hidradenitis suppurativa. Outcome: involved-skin-area change, in square centimeters. The same 18 people are measured before and after treatment. Within-person differences are approximately normal without influential outliers. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "Two-Sample t-Test",
            "Paired t-Test",
            "McNemar Test",
            "Australasian hidradenitis suppurativa management guidelines",
            "North American HS management guidelines Part I"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_same-rooms",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a paired t test on each person's involved-skin-area change. The same people supply both measurements, and the changes are approximately normal.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_same-rooms",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a paired t test on each person's involved-skin-area change. The same people supply both measurements, and the changes are approximately normal.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_same-rooms",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a paired t test on each person's involved-skin-area change. The same people supply both measurements, and the changes are approximately normal.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.independent-t-paired-t.b-same-trainees",
      "displayName": "Select an independent-samples t test and Select a paired t test",
      "patientPresentationVariantId": "presentation.gs028se.independent-t-paired-t.b-same-trainees",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "cutaneous abscess study",
      "presentation": "{patientName}, the surgical research lead, reviews a new irrigation instrument used during drainage of cutaneous abscesses. The same participants had cavity depth measured before and after use. The presenter promises an anonymous discussion, then asks everyone to introduce themselves with names, departments and line managers. The report supplies the distribution of each participant's measured change.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Two-Sample t-Test",
        "Paired t-Test",
        "McNemar Test",
        "Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue Infections: 2014 Update",
        "Abscess Evaluation"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.independent-t-paired-t.b-same-trainees.1",
          "questionVariantId": "question.statistics-ethics.paired-t.v2",
          "primaryConceptId": "concept.statistics-ethics.paired-t",
          "stem": "Which analysis best fits the study's comparison of mean abscess-cavity-depth change, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_same-trainees",
              "label": "Paired t test",
              "isCorrect": true,
              "rationale": "Each change comes from repeated measurements or a designated pair, and those differences are approximately normal. A paired t procedure compares their mean.",
              "serviceRequest": null
            },
            {
              "id": "d1_same-trainees",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum compares ranked observations from unrelated groups. It would ignore the repeated-person or matching structure used to form the study's differences.",
              "serviceRequest": null
            },
            {
              "id": "d2_same-trainees",
              "label": "One-way ANOVA",
              "isCorrect": false,
              "rationale": "The ordinary unrelated-group ANOVA listed here does not use the designated within-person or matched differences. Extra columns do not remove that linkage.",
              "serviceRequest": null
            },
            {
              "id": "d3_same-trainees",
              "label": "Independent-samples t test",
              "isCorrect": false,
              "rationale": "A two-sample t procedure treats the groups as unrelated. It would discard the within-person or designated-pair relationship that supplies this study's differences.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The approximately normal within-person abscess-cavity-depth changes support a paired t test. Separate visits do not make the repeated observations into unrelated samples.",
          "teachingPoint": "The key distribution check concerns within-person changes, not whether each visit's column looks normal separately. These abscess-cavity-depth changes are approximately normal, supporting a paired t test of mean change. Remember to keep each person's two measurements together; a new visit does not create a new group of unrelated people.",
          "exhibit": {
            "kind": "abstract",
            "title": "Abscess-cavity-depth change — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational irrigation instrument in cutaneous abscesses. Outcome: abscess-cavity-depth change, in millimeters. The same 24 people are measured before and after treatment. Within-person differences are approximately normal without influential outliers. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "Two-Sample t-Test",
            "Paired t-Test",
            "McNemar Test",
            "Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue Infections: 2014 Update",
            "Abscess Evaluation"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_same-trainees",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The approximately normal within-person abscess-cavity-depth changes support a paired t test. Separate visits do not make the repeated observations into unrelated samples.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_same-trainees",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The approximately normal within-person abscess-cavity-depth changes support a paired t test. Separate visits do not make the repeated observations into unrelated samples.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_same-trainees",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The approximately normal within-person abscess-cavity-depth changes support a paired t test. Separate visits do not make the repeated observations into unrelated samples.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.independent-t-paired-t.b-matched-sites",
      "displayName": "Select an independent-samples t test and Select a paired t test",
      "patientPresentationVariantId": "presentation.gs028se.independent-t-paired-t.b-matched-sites",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "pilonidal disease study",
      "presentation": "{patientName}, the colorectal journal-club lead, reviews a new excision technique for chronic pilonidal disease. Investigators matched each recipient with a comparison patient before recording completed healing times. One colleague says, 'They are different people, so the matching cannot matter.' The matching records and the distribution of differences within the designated pairs are available for review.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Two-Sample t-Test",
        "Paired t-Test",
        "McNemar Test",
        "Consensus statement of the Italian society of colorectal surgery (SICCR): management and treatment of pilonidal disease",
        "Pilonidal Disease"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.independent-t-paired-t.b-matched-sites.1",
          "questionVariantId": "question.statistics-ethics.paired-t.v3",
          "primaryConceptId": "concept.statistics-ethics.paired-t",
          "stem": "Which analysis best fits the study's comparison of mean pilonidal-wound healing-time difference, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_matched-sites",
              "label": "Paired t test",
              "isCorrect": true,
              "rationale": "Each change comes from repeated measurements or a designated pair, and those differences are approximately normal. A paired t procedure compares their mean.",
              "serviceRequest": null
            },
            {
              "id": "d1_matched-sites",
              "label": "Independent-samples t test",
              "isCorrect": false,
              "rationale": "A two-sample t procedure treats the groups as unrelated. It would discard the within-person or designated-pair relationship that supplies this study's differences.",
              "serviceRequest": null
            },
            {
              "id": "d2_matched-sites",
              "label": "One-way ANOVA",
              "isCorrect": false,
              "rationale": "The ordinary unrelated-group ANOVA listed here does not use the designated within-person or matched differences. Extra columns do not remove that linkage.",
              "serviceRequest": null
            },
            {
              "id": "d3_matched-sites",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": false,
              "rationale": "Signed-rank uses the signs and ranks of differences. Here the stated question is about mean change and the approximately normal differences support a paired mean model.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use a paired t test for the designated partners' pilonidal-wound healing-time differences. Deliberate matching supplies the linkage, and the differences are approximately normal.",
          "teachingPoint": "Pairing can come from deliberate matching as well as repeated measurements. Here each technique recipient has a designated comparison partner, and their pilonidal-wound healing-time differences are approximately normal. A paired t test analyzes those differences. Remember: different people can still supply linked observations when the study design establishes the pairs in advance.",
          "exhibit": {
            "kind": "abstract",
            "title": "Pilonidal-wound healing-time difference — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational excision technique in chronic pilonidal disease. Outcome: pilonidal-wound healing-time difference, in days. Fifteen treatment recipients were each matched to a comparison recipient before measurement; the 15 differences are computed within those pairs. Within-pair differences are approximately normal without influential outliers. All times are observed to completion with no censoring. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "Two-Sample t-Test",
            "Paired t-Test",
            "McNemar Test",
            "Consensus statement of the Italian society of colorectal surgery (SICCR): management and treatment of pilonidal disease",
            "Pilonidal Disease"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_matched-sites",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a paired t test for the designated partners' pilonidal-wound healing-time differences. Deliberate matching supplies the linkage, and the differences are approximately normal.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_matched-sites",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a paired t test for the designated partners' pilonidal-wound healing-time differences. Deliberate matching supplies the linkage, and the differences are approximately normal.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_matched-sites",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a paired t test for the designated partners' pilonidal-wound healing-time differences. Deliberate matching supplies the linkage, and the differences are approximately normal.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.independent-t-paired-t.b-same-workers",
      "displayName": "Select an independent-samples t test and Select a paired t test",
      "patientPresentationVariantId": "presentation.gs028se.independent-t-paired-t.b-same-workers",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "skin-graft donor wound study",
      "presentation": "{patientName}, the reconstructive research lead, reviews a new dressing for skin-graft donor wounds. The same participants had wound area recorded at baseline and four weeks. The coordinator calls follow-up effortless; participants phone to confirm an email confirming their telephone appointment. A colleague proposes treating visits as separate groups. The report includes the individual wound-area changes.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Two-Sample t-Test",
        "Paired t-Test",
        "McNemar Test",
        "Skin Grafting, Cryopreservation, and Diseases: A Review Article"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.independent-t-paired-t.b-same-workers.1",
          "questionVariantId": "question.statistics-ethics.paired-t.v4",
          "primaryConceptId": "concept.statistics-ethics.paired-t",
          "stem": "Which analysis best fits the study's comparison of mean donor-wound-area change, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_same-workers",
              "label": "Paired t test",
              "isCorrect": true,
              "rationale": "Each change comes from repeated measurements or a designated pair, and those differences are approximately normal. A paired t procedure compares their mean.",
              "serviceRequest": null
            },
            {
              "id": "d1_same-workers",
              "label": "One-way ANOVA",
              "isCorrect": false,
              "rationale": "The ordinary unrelated-group ANOVA listed here does not use the designated within-person or matched differences. Extra columns do not remove that linkage.",
              "serviceRequest": null
            },
            {
              "id": "d2_same-workers",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum compares ranked observations from unrelated groups. It would ignore the repeated-person or matching structure used to form the study's differences.",
              "serviceRequest": null
            },
            {
              "id": "d3_same-workers",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": false,
              "rationale": "Signed-rank uses the signs and ranks of differences. Here the stated question is about mean change and the approximately normal differences support a paired mean model.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Analyze follow-up-minus-baseline donor-wound area with a paired t test. Both measurements belong to the same people, and their changes meet the supplied normality assumption.",
          "teachingPoint": "Two visits do not mean two unrelated samples when the same people attend both. Use each participant's follow-up-minus-baseline donor-wound area; the approximately normal changes support a paired t test. Remember to analyze the change distribution. A procedure for several unrelated groups would answer a different structural question from this repeated-measurement study.",
          "exhibit": {
            "kind": "abstract",
            "title": "Donor-wound-area change — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational donor-site dressing in skin-graft donor wounds. Outcome: donor-wound-area change, in square centimeters. The same 30 people are measured at baseline and four weeks. Within-person differences are approximately normal without influential outliers. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "Two-Sample t-Test",
            "Paired t-Test",
            "McNemar Test",
            "Skin Grafting, Cryopreservation, and Diseases: A Review Article"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_same-workers",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Analyze follow-up-minus-baseline donor-wound area with a paired t test. Both measurements belong to the same people, and their changes meet the supplied normality assumption.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_same-workers",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Analyze follow-up-minus-baseline donor-wound area with a paired t test. Both measurements belong to the same people, and their changes meet the supplied normality assumption.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_same-workers",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Analyze follow-up-minus-baseline donor-wound area with a paired t test. Both measurements belong to the same people, and their changes meet the supplied normality assumption.",
              "sourceLabels": [
                "Two-Sample t-Test",
                "Paired t-Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.one-way-anova-rank-sum.a-three-teams",
      "displayName": "Select one-way ANOVA and Select a Wilcoxon rank-sum test",
      "patientPresentationVariantId": "presentation.gs028se.one-way-anova-rank-sum.a-three-teams",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "diabetic foot ulcer study",
      "presentation": "{patientName}, the wound-service research lead, reviews new offloading devices for clinically uninfected diabetic foot ulcers. Three separately assigned groups contribute completed healing times. Each manufacturer wants its product designated the reference standard before anyone sees the results. The investigators request one overall comparison of average healing time, with sampling and distribution information supplied in the report.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "One-Way ANOVA Assumptions",
        "Rank Sum Test",
        "McNemar Test",
        "IWGDF/IDSA diabetes-related foot infection guideline"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.one-way-anova-rank-sum.a-three-teams.1",
          "questionVariantId": "question.statistics-ethics.one-way-anova.v1",
          "primaryConceptId": "concept.statistics-ethics.one-way-anova",
          "stem": "Which analysis best fits the study's comparison of mean ulcer-healing time, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_three-teams",
              "label": "One-way ANOVA",
              "isCorrect": true,
              "rationale": "The requested overall mean comparison includes several groups, each containing different people. The residual-normality and comparable-variance assumptions are stated to fit.",
              "serviceRequest": null
            },
            {
              "id": "d1_three-teams",
              "label": "Paired t test",
              "isCorrect": false,
              "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations.",
              "serviceRequest": null
            },
            {
              "id": "d2_three-teams",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum addresses two groups rather than the requested overall comparison across several treatment groups. It does not supply that multi-group mean test.",
              "serviceRequest": null
            },
            {
              "id": "d3_three-teams",
              "label": "Independent-samples t test",
              "isCorrect": false,
              "rationale": "A two-sample procedure addresses two groups at a time. The requested overall comparison includes more than two treatment groups together.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use one-way ANOVA for an overall comparison of mean completed ulcer-healing time across three groups. The stated observation, residual and spread assumptions fit.",
          "teachingPoint": "One-way ANOVA tests an overall question about means across three or more groups when its assumptions fit. These ulcer-healing times come from different people, with suitable residual and spread checks. Remember: one overall test asks whether all group means are equal; a significant result alone would not identify which particular groups differ.",
          "exhibit": {
            "kind": "abstract",
            "title": "Ulcer-healing time — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational offloading device in clinically uninfected diabetic foot ulcers. Outcome: ulcer-healing time, in days. 3 separately assigned treatment groups contribute one measurement per person. Groups do not overlap. Model residuals are approximately normal and within-group variances are comparable. All times are observed to completion with no censoring. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "One-Way ANOVA Assumptions",
            "Rank Sum Test",
            "McNemar Test",
            "IWGDF/IDSA diabetes-related foot infection guideline"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_three-teams",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use one-way ANOVA for an overall comparison of mean completed ulcer-healing time across three groups. The stated observation, residual and spread assumptions fit.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_three-teams",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use one-way ANOVA for an overall comparison of mean completed ulcer-healing time across three groups. The stated observation, residual and spread assumptions fit.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_three-teams",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use one-way ANOVA for an overall comparison of mean completed ulcer-healing time across three groups. The stated observation, residual and spread assumptions fit.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.one-way-anova-rank-sum.a-four-formats",
      "displayName": "Select one-way ANOVA and Select a Wilcoxon rank-sum test",
      "patientPresentationVariantId": "presentation.gs028se.one-way-anova-rank-sum.a-four-formats",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "keloid study",
      "presentation": "{patientName}, the plastic-surgery research lead, reviews four new injectable preparations for keloid scars. Each participant received one preparation, and scar area was measured at the protocol visit. Procurement wants the winning supplier named before opening bids, so that supplier can help write the purchasing criteria. The report supplies assumptions for comparing the groups' average scar areas.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "One-Way ANOVA Assumptions",
        "Rank Sum Test",
        "McNemar Test",
        "Scars"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.one-way-anova-rank-sum.a-four-formats.1",
          "questionVariantId": "question.statistics-ethics.one-way-anova.v2",
          "primaryConceptId": "concept.statistics-ethics.one-way-anova",
          "stem": "Which analysis best fits the study's comparison of mean remaining scar area, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_four-formats",
              "label": "One-way ANOVA",
              "isCorrect": true,
              "rationale": "The requested overall mean comparison includes several groups, each containing different people. The residual-normality and comparable-variance assumptions are stated to fit.",
              "serviceRequest": null
            },
            {
              "id": "d1_four-formats",
              "label": "Independent-samples t test",
              "isCorrect": false,
              "rationale": "A two-sample procedure addresses two groups at a time. The requested overall comparison includes more than two treatment groups together.",
              "serviceRequest": null
            },
            {
              "id": "d2_four-formats",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": false,
              "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links.",
              "serviceRequest": null
            },
            {
              "id": "d3_four-formats",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum addresses two groups rather than the requested overall comparison across several treatment groups. It does not supply that multi-group mean test.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "One-way ANOVA compares mean remaining scar area across the four groups together. Each participant appears once, and the supplied model assumptions are reasonable.",
          "teachingPoint": "Four groups require a procedure that addresses their means together. With continuous scar areas, separate participants, reasonable residual normality and comparable variances, one-way ANOVA fits. Remember to count groups after checking the measurement structure. A two-group procedure does not become an overall four-group test simply because the outcome is continuous.",
          "exhibit": {
            "kind": "abstract",
            "title": "Remaining scar area — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational injectable scar preparation in keloids. Outcome: remaining scar area, in square centimeters. 4 separately assigned treatment groups contribute one measurement per person. Groups do not overlap. Model residuals are approximately normal and within-group variances are comparable. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "One-Way ANOVA Assumptions",
            "Rank Sum Test",
            "McNemar Test",
            "Scars"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_four-formats",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "One-way ANOVA compares mean remaining scar area across the four groups together. Each participant appears once, and the supplied model assumptions are reasonable.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_four-formats",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "One-way ANOVA compares mean remaining scar area across the four groups together. Each participant appears once, and the supplied model assumptions are reasonable.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_four-formats",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "One-way ANOVA compares mean remaining scar area across the four groups together. Each participant appears once, and the supplied model assumptions are reasonable.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.one-way-anova-rank-sum.a-three-sites",
      "displayName": "Select one-way ANOVA and Select a Wilcoxon rank-sum test",
      "patientPresentationVariantId": "presentation.gs028se.one-way-anova-rank-sum.a-three-sites",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "perianal abscess study",
      "presentation": "{patientName}, the colorectal discussion lead, reviews new drainage adjuncts for superficial perianal abscesses. Three groups contribute remaining cavity depths at the protocol visit. Each participant belongs to one group. The investigators request an overall comparison of average depth. A colleague has instead entered the product labels as the outcome; the measurement assumptions accompany the data.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "One-Way ANOVA Assumptions",
        "Rank Sum Test",
        "McNemar Test",
        "The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Anorectal Abscess, Fistula-in-Ano, and Rectovaginal Fistula"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.one-way-anova-rank-sum.a-three-sites.1",
          "questionVariantId": "question.statistics-ethics.one-way-anova.v3",
          "primaryConceptId": "concept.statistics-ethics.one-way-anova",
          "stem": "Which analysis best fits the study's comparison of mean remaining abscess-cavity depth, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_three-sites",
              "label": "One-way ANOVA",
              "isCorrect": true,
              "rationale": "The requested overall mean comparison includes several groups, each containing different people. The residual-normality and comparable-variance assumptions are stated to fit.",
              "serviceRequest": null
            },
            {
              "id": "d1_three-sites",
              "label": "Independent-samples t test",
              "isCorrect": false,
              "rationale": "A two-sample procedure addresses two groups at a time. The requested overall comparison includes more than two treatment groups together.",
              "serviceRequest": null
            },
            {
              "id": "d2_three-sites",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum addresses two groups rather than the requested overall comparison across several treatment groups. It does not supply that multi-group mean test.",
              "serviceRequest": null
            },
            {
              "id": "d3_three-sites",
              "label": "Chi-square test of independence",
              "isCorrect": false,
              "rationale": "Chi-square testing analyzes counts in categories. The requested comparison concerns continuous measurements or ordered ratings, not a categorical contingency table.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use one-way ANOVA to compare mean abscess-cavity depth across three treatment groups. Depth is continuous; treatment labels identify the groups being compared.",
          "teachingPoint": "The device label defines the group, while abscess-cavity depth supplies the measured outcome. One-way ANOVA compares mean depth across these three groups under the stated assumptions. Remember to identify what was measured before choosing a procedure: a table listing group names does not turn a continuous outcome into categorical counts.",
          "exhibit": {
            "kind": "abstract",
            "title": "Remaining abscess-cavity depth — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational drainage adjunct in perianal abscesses. Outcome: remaining abscess-cavity depth, in millimeters. 3 separately assigned treatment groups contribute one measurement per person. Groups do not overlap. Model residuals are approximately normal and within-group variances are comparable. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "One-Way ANOVA Assumptions",
            "Rank Sum Test",
            "McNemar Test",
            "The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Anorectal Abscess, Fistula-in-Ano, and Rectovaginal Fistula"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_three-sites",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use one-way ANOVA to compare mean abscess-cavity depth across three treatment groups. Depth is continuous; treatment labels identify the groups being compared.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_three-sites",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use one-way ANOVA to compare mean abscess-cavity depth across three treatment groups. Depth is continuous; treatment labels identify the groups being compared.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_three-sites",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use one-way ANOVA to compare mean abscess-cavity depth across three treatment groups. Depth is continuous; treatment labels identify the groups being compared.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.one-way-anova-rank-sum.a-five-signs",
      "displayName": "Select one-way ANOVA and Select a Wilcoxon rank-sum test",
      "patientPresentationVariantId": "presentation.gs028se.one-way-anova-rank-sum.a-five-signs",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "ARDS study",
      "presentation": "{patientName}, the critical-care journal-club lead, reviews five investigational ventilation techniques for adults with ARDS. Each group contributes measured changes in arterial oxygen tension. The designer requests an impartial assessment, then explains how impartial reviewers usually describe his favorite technique. Follow-up measurements are complete, and the report supplies assumptions for an overall comparison of average change.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "One-Way ANOVA Assumptions",
        "Rank Sum Test",
        "McNemar Test",
        "ESICM guidelines on acute respiratory distress syndrome: definition, phenotyping and respiratory support strategies"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.one-way-anova-rank-sum.a-five-signs.1",
          "questionVariantId": "question.statistics-ethics.one-way-anova.v4",
          "primaryConceptId": "concept.statistics-ethics.one-way-anova",
          "stem": "Which analysis best fits the study's comparison of mean arterial-oxygen-tension change, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_five-signs",
              "label": "One-way ANOVA",
              "isCorrect": true,
              "rationale": "The requested overall mean comparison includes several groups, each containing different people. The residual-normality and comparable-variance assumptions are stated to fit.",
              "serviceRequest": null
            },
            {
              "id": "d1_five-signs",
              "label": "Paired t test",
              "isCorrect": false,
              "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations.",
              "serviceRequest": null
            },
            {
              "id": "d2_five-signs",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": false,
              "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links.",
              "serviceRequest": null
            },
            {
              "id": "d3_five-signs",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum addresses two groups rather than the requested overall comparison across several treatment groups. It does not supply that multi-group mean test.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "One-way ANOVA fits the overall comparison of mean arterial-oxygen-tension change across five groups. A significant overall result alone would not identify which groups differ.",
          "teachingPoint": "One-way ANOVA can compare mean changes across five groups when its assumptions fit. Each participant contributes one oxygen-tension change score to a single group. Remember: the analysis compares group means of those scores; a change score does not make different treatment groups into matched pairs. An overall result does not locate every difference.",
          "exhibit": {
            "kind": "abstract",
            "title": "Arterial-oxygen-tension change — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational ventilation technique in adult ARDS. Outcome: arterial-oxygen-tension change, in mmHg. 5 separately assigned treatment groups contribute one measurement per person. Groups do not overlap. Model residuals are approximately normal and within-group variances are comparable. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "One-Way ANOVA Assumptions",
            "Rank Sum Test",
            "McNemar Test",
            "ESICM guidelines on acute respiratory distress syndrome: definition, phenotyping and respiratory support strategies"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_five-signs",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "One-way ANOVA fits the overall comparison of mean arterial-oxygen-tension change across five groups. A significant overall result alone would not identify which groups differ.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_five-signs",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "One-way ANOVA fits the overall comparison of mean arterial-oxygen-tension change across five groups. A significant overall result alone would not identify which groups differ.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_five-signs",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "One-way ANOVA fits the overall comparison of mean arterial-oxygen-tension change across five groups. A significant overall result alone would not identify which groups differ.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.one-way-anova-rank-sum.b-ordinal-teams",
      "displayName": "Select one-way ANOVA and Select a Wilcoxon rank-sum test",
      "patientPresentationVariantId": "presentation.gs028se.one-way-anova-rank-sum.b-ordinal-teams",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "achalasia study",
      "presentation": "{patientName}, the esophageal research lead, reviews two new endoscopic techniques for achalasia. The study uses ordered, protocol-defined symptom-relief ratings after structural obstruction was excluded. The sponsor calls the report accessible; the scale explanation appears only after the tutorial on accessing the report. Each participant received one technique, and the exhibit describes how the ratings are used.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "One-Way ANOVA Assumptions",
        "Rank Sum Test",
        "McNemar Test",
        "2019 Seoul Consensus on Esophageal Achalasia Guidelines"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.one-way-anova-rank-sum.b-ordinal-teams.1",
          "questionVariantId": "question.statistics-ethics.rank-sum.v1",
          "primaryConceptId": "concept.statistics-ethics.rank-sum",
          "stem": "Which analysis best fits the study's comparison of symptom-relief ratings, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_ordinal-teams",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": true,
              "rationale": "These protocol-defined symptom-relief ratings are ordinal, and the two groups contain different people. Rank-sum fits that ranked comparison without assuming equal distances between category labels.",
              "serviceRequest": null
            },
            {
              "id": "d1_ordinal-teams",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": false,
              "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links.",
              "serviceRequest": null
            },
            {
              "id": "d2_ordinal-teams",
              "label": "Paired t test",
              "isCorrect": false,
              "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations.",
              "serviceRequest": null
            },
            {
              "id": "d3_ordinal-teams",
              "label": "Independent-samples t test",
              "isCorrect": false,
              "rationale": "This mean-based procedure does not fit the supplied ordinal scale or unsuitable normal-model distribution. A numerical code or a continuous time measurement alone does not establish its assumptions.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use Wilcoxon rank-sum for ordinal symptom-relief ratings from two groups of different people. Ordered labels do not establish equal spacing for a mean comparison.",
          "teachingPoint": "Ordered symptom-relief categories preserve rank without promising equal spacing between labels. A Wilcoxon rank-sum test fits the comparison of two groups of different people here. Remember: ordered is not automatically continuous. Using a ranking procedure also does not justify describing every result as an unqualified difference in population medians.",
          "exhibit": {
            "kind": "abstract",
            "title": "Symptom-relief ratings — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational endoscopic technique in achalasia. Outcome: symptom-relief ratings, in ordered categories. Two separately sampled groups contribute one result per person, without matching. The protocol uses a five-level ordinal rating, not assumed equally spaced and not an established clinical score. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "One-Way ANOVA Assumptions",
            "Rank Sum Test",
            "McNemar Test",
            "2019 Seoul Consensus on Esophageal Achalasia Guidelines"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_ordinal-teams",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Wilcoxon rank-sum for ordinal symptom-relief ratings from two groups of different people. Ordered labels do not establish equal spacing for a mean comparison.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_ordinal-teams",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Wilcoxon rank-sum for ordinal symptom-relief ratings from two groups of different people. Ordered labels do not establish equal spacing for a mean comparison.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_ordinal-teams",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Wilcoxon rank-sum for ordinal symptom-relief ratings from two groups of different people. Ordered labels do not establish equal spacing for a mean comparison.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.one-way-anova-rank-sum.b-skewed-delays",
      "displayName": "Select one-way ANOVA and Select a Wilcoxon rank-sum test",
      "patientPresentationVariantId": "presentation.gs028se.one-way-anova-rank-sum.b-skewed-delays",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "gastroparesis study",
      "presentation": "{patientName}, the foregut journal-club lead, reviews a new gastric motility agent for gastroparesis after mechanical obstruction was excluded. Two groups contribute gastric-emptying times, including verified unusually long measurements. The project manager promises a short discussion, then distributes an agenda with a separate agenda briefing. The report describes the distributions and the comparison requested by investigators.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "One-Way ANOVA Assumptions",
        "Rank Sum Test",
        "McNemar Test",
        "ACG Clinical Guideline: Gastroparesis",
        "AGA Clinical Practice Guideline on Management of Gastroparesis",
        "Gastroparesis"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.one-way-anova-rank-sum.b-skewed-delays.1",
          "questionVariantId": "question.statistics-ethics.rank-sum.v2",
          "primaryConceptId": "concept.statistics-ethics.rank-sum",
          "stem": "Which analysis best fits the study's comparison of gastric-emptying-time distributions, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_skewed-delays",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": true,
              "rationale": "The groups contain different people with completed gastric-emptying times that are unsuitable for the stated normal model. Rank-sum fits this comparison of ranked observations.",
              "serviceRequest": null
            },
            {
              "id": "d1_skewed-delays",
              "label": "Independent-samples t test",
              "isCorrect": false,
              "rationale": "This mean-based procedure does not fit the supplied ordinal scale or unsuitable normal-model distribution. A numerical code or a continuous time measurement alone does not establish its assumptions.",
              "serviceRequest": null
            },
            {
              "id": "d2_skewed-delays",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": false,
              "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links.",
              "serviceRequest": null
            },
            {
              "id": "d3_skewed-delays",
              "label": "Chi-square test of independence",
              "isCorrect": false,
              "rationale": "Chi-square testing analyzes counts in categories. The requested comparison concerns continuous measurements or ordered ratings, not a categorical contingency table.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Wilcoxon rank-sum fits the two groups' ranked gastric-emptying-time comparison. The verified skew and extremes make the stated normal-model mean comparison unsuitable for this exercise.",
          "teachingPoint": "Check the data structure before the distribution. These completed gastric-emptying times come from two groups of different people, but verified extreme skew makes the stated normal-model comparison unsuitable. Wilcoxon rank-sum fits this ranked comparison. Remember that a median-only interpretation still needs additional distributional assumptions; selecting the procedure does not supply them.",
          "exhibit": {
            "kind": "abstract",
            "title": "Gastric-emptying-time distributions — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational gastric motility agent in gastroparesis. Outcome: gastric-emptying-time distributions, in minutes. Two separately sampled groups contribute one result per person, without matching. Measurements are strongly right-skewed with verified influential extremes; a normal-model mean comparison is unsuitable. No common distribution shape is established. All times are observed to completion with no censoring. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "One-Way ANOVA Assumptions",
            "Rank Sum Test",
            "McNemar Test",
            "ACG Clinical Guideline: Gastroparesis",
            "AGA Clinical Practice Guideline on Management of Gastroparesis",
            "Gastroparesis"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_skewed-delays",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Wilcoxon rank-sum fits the two groups' ranked gastric-emptying-time comparison. The verified skew and extremes make the stated normal-model mean comparison unsuitable for this exercise.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_skewed-delays",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Wilcoxon rank-sum fits the two groups' ranked gastric-emptying-time comparison. The verified skew and extremes make the stated normal-model mean comparison unsuitable for this exercise.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_skewed-delays",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Wilcoxon rank-sum fits the two groups' ranked gastric-emptying-time comparison. The verified skew and extremes make the stated normal-model mean comparison unsuitable for this exercise.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.one-way-anova-rank-sum.b-independent-likert",
      "displayName": "Select one-way ANOVA and Select a Wilcoxon rank-sum test",
      "patientPresentationVariantId": "presentation.gs028se.one-way-anova-rank-sum.b-independent-likert",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "carpal tunnel syndrome study",
      "presentation": "{patientName}, the hand-service research lead, reviews two new wrist devices for carpal tunnel syndrome. Participants reported hand function on an ordered scale at the protocol visit. A colleague proposes matching people because both groups used the same form. Another wants to treat the labels as evenly spaced measurements. The study's scale definitions accompany the results.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "One-Way ANOVA Assumptions",
        "Rank Sum Test",
        "McNemar Test",
        "Carpal tunnel syndrome"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.one-way-anova-rank-sum.b-independent-likert.1",
          "questionVariantId": "question.statistics-ethics.rank-sum.v3",
          "primaryConceptId": "concept.statistics-ethics.rank-sum",
          "stem": "Which analysis best fits the study's comparison of hand-function categories, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_independent-likert",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": true,
              "rationale": "These protocol-defined hand-function ratings are ordinal, and the two groups contain different people. Rank-sum fits that ranked comparison without assuming equal distances between category labels.",
              "serviceRequest": null
            },
            {
              "id": "d1_independent-likert",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": false,
              "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links.",
              "serviceRequest": null
            },
            {
              "id": "d2_independent-likert",
              "label": "One-way ANOVA",
              "isCorrect": false,
              "rationale": "This ordinary mean-based ANOVA does not address the supplied ordinal or unsuitable non-normal comparison. Having groups does not by itself establish its assumptions.",
              "serviceRequest": null
            },
            {
              "id": "d3_independent-likert",
              "label": "Independent-samples t test",
              "isCorrect": false,
              "rationale": "This mean-based procedure does not fit the supplied ordinal scale or unsuitable normal-model distribution. A numerical code or a continuous time measurement alone does not establish its assumptions.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The groups contain different people using an ordinal scale, supporting Wilcoxon rank-sum. A shared form neither links the observations nor supplies equal measurement intervals.",
          "teachingPoint": "A shared rating form does not link people in different groups. These protocol-defined categories are ordinal, so Wilcoxon rank-sum fits their two-group comparison. Remember that numbers printed beside ordered labels do not establish equal distances between them. A mean-based model requires more than a convenient numerical code on the form.",
          "exhibit": {
            "kind": "abstract",
            "title": "Hand-function categories — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational wrist device in carpal tunnel syndrome. Outcome: hand-function categories, in ordered categories. Two separately sampled groups contribute one result per person, without matching. The protocol uses a seven-level ordinal rating, not assumed equally spaced and not an established clinical score. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "One-Way ANOVA Assumptions",
            "Rank Sum Test",
            "McNemar Test",
            "Carpal tunnel syndrome"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_independent-likert",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The groups contain different people using an ordinal scale, supporting Wilcoxon rank-sum. A shared form neither links the observations nor supplies equal measurement intervals.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_independent-likert",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The groups contain different people using an ordinal scale, supporting Wilcoxon rank-sum. A shared form neither links the observations nor supplies equal measurement intervals.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_independent-likert",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The groups contain different people using an ordinal scale, supporting Wilcoxon rank-sum. A shared form neither links the observations nor supplies equal measurement intervals.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.one-way-anova-rank-sum.b-two-queues",
      "displayName": "Select one-way ANOVA and Select a Wilcoxon rank-sum test",
      "patientPresentationVariantId": "presentation.gs028se.one-way-anova-rank-sum.b-two-queues",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "postherniorrhaphy pain study",
      "presentation": "{patientName}, the pain-service journal-club lead, reviews a new targeted nerve-block delivery device for postherniorrhaphy pain. Two groups contribute the duration of symptom relief, with verified long observations retained. No participants are matched. A colleague proposes describing any detected difference as a difference in medians. The report provides the available distribution checks and the intended comparison.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "One-Way ANOVA Assumptions",
        "Rank Sum Test",
        "McNemar Test",
        "International HerniaSurge guideline update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.one-way-anova-rank-sum.b-two-queues.1",
          "questionVariantId": "question.statistics-ethics.rank-sum.v4",
          "primaryConceptId": "concept.statistics-ethics.rank-sum",
          "stem": "Which analysis best fits the study's comparison of symptom-relief-duration distributions, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_two-queues",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": true,
              "rationale": "The groups contain different people with completed symptom-relief durations that are unsuitable for the stated normal model. Rank-sum fits this comparison of ranked observations.",
              "serviceRequest": null
            },
            {
              "id": "d1_two-queues",
              "label": "Paired t test",
              "isCorrect": false,
              "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations.",
              "serviceRequest": null
            },
            {
              "id": "d2_two-queues",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": false,
              "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links.",
              "serviceRequest": null
            },
            {
              "id": "d3_two-queues",
              "label": "Independent-samples t test",
              "isCorrect": false,
              "rationale": "This mean-based procedure does not fit the supplied ordinal scale or unsuitable normal-model distribution. A numerical code or a continuous time measurement alone does not establish its assumptions.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use Wilcoxon rank-sum for the stated ranked symptom-relief-duration comparison. Its result is not automatically a pure median comparison without additional distributional assumptions.",
          "teachingPoint": "Wilcoxon rank-sum compares ranked observations from two groups of different people. It fits the stated non-normal symptom-relief-duration distributions here. Remember the interpretation boundary: without further shape and location assumptions, its result is not automatically a pure median comparison. Choosing a suitable procedure and describing what it establishes are separate steps.",
          "exhibit": {
            "kind": "abstract",
            "title": "Symptom-relief-duration distributions — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational nerve-block delivery device in postherniorrhaphy pain. Outcome: symptom-relief-duration distributions, in hours. Two separately sampled groups contribute one result per person, without matching. Measurements are strongly right-skewed with verified influential extremes; a normal-model mean comparison is unsuitable. No common distribution shape is established. All times are observed to completion with no censoring. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "One-Way ANOVA Assumptions",
            "Rank Sum Test",
            "McNemar Test",
            "International HerniaSurge guideline update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_two-queues",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Wilcoxon rank-sum for the stated ranked symptom-relief-duration comparison. Its result is not automatically a pure median comparison without additional distributional assumptions.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_two-queues",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Wilcoxon rank-sum for the stated ranked symptom-relief-duration comparison. Its result is not automatically a pure median comparison without additional distributional assumptions.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_two-queues",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Wilcoxon rank-sum for the stated ranked symptom-relief-duration comparison. Its result is not automatically a pure median comparison without additional distributional assumptions.",
              "sourceLabels": [
                "One-Way ANOVA Assumptions",
                "Rank Sum Test",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.signed-rank-chi-square.a-paired-workload",
      "displayName": "Select a Wilcoxon signed-rank test and Select a chi-square test of independence",
      "patientPresentationVariantId": "presentation.gs028se.signed-rank-chi-square.a-paired-workload",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "Graves disease study",
      "presentation": "{patientName}, the endocrine research lead, reviews a new thyroid-directed agent for Graves disease. The same adults had thyroid volume measured before and after treatment. The reviewer requests raw measurements; the coordinator offers the polished version because it makes a better first impression. The report describes the distribution of individual volume changes and the assumptions under review.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Signed Rank Test",
        "CHI-SQUARE INDEPENDENCE TEST",
        "McNemar Test",
        "Graves’ Disease"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.signed-rank-chi-square.a-paired-workload.1",
          "questionVariantId": "question.statistics-ethics.signed-rank.v1",
          "primaryConceptId": "concept.statistics-ethics.signed-rank",
          "stem": "Which analysis best fits the study's comparison of thyroid-volume change, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_paired-workload",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": true,
              "rationale": "The study supplies linked continuous differences that are reasonably symmetric but unsuitable for a t model. Signed-rank uses their signs and ranks.",
              "serviceRequest": null
            },
            {
              "id": "d1_paired-workload",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum compares ranked observations from unrelated groups. It would ignore the repeated-person or matching structure used to form the study's differences.",
              "serviceRequest": null
            },
            {
              "id": "d2_paired-workload",
              "label": "Independent-samples t test",
              "isCorrect": false,
              "rationale": "A two-sample t procedure treats the groups as unrelated. It would discard the within-person or designated-pair relationship that supplies this study's differences.",
              "serviceRequest": null
            },
            {
              "id": "d3_paired-workload",
              "label": "Paired t test",
              "isCorrect": false,
              "rationale": "The observations are linked, but the exhibit says their differences are unsuitable for the paired mean model. Linkage alone does not establish its distributional assumptions.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use Wilcoxon signed-rank for the linked thyroid-volume differences: they are reasonably symmetric but unsuitable for the stated paired mean model in this exercise.",
          "teachingPoint": "Keep each person's measurements linked before considering the distribution. These thyroid-volume differences are reasonably symmetric but unsuitable for the paired mean model, supporting Wilcoxon signed-rank. Remember: signed-rank uses the signs and ranks of nonzero within-pair differences. It is not the same procedure as comparing ranked observations from unrelated groups.",
          "exhibit": {
            "kind": "abstract",
            "title": "Thyroid-volume change — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational thyroid-directed agent in Graves disease. Outcome: thyroid-volume change, in cubic centimeters. The same people are measured before and after treatment. Differences are reasonably symmetric but distinctly non-normal, making a paired mean model unsuitable. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "Signed Rank Test",
            "CHI-SQUARE INDEPENDENCE TEST",
            "McNemar Test",
            "Graves’ Disease"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_paired-workload",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Wilcoxon signed-rank for the linked thyroid-volume differences: they are reasonably symmetric but unsuitable for the stated paired mean model in this exercise.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_paired-workload",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Wilcoxon signed-rank for the linked thyroid-volume differences: they are reasonably symmetric but unsuitable for the stated paired mean model in this exercise.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_paired-workload",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Wilcoxon signed-rank for the linked thyroid-volume differences: they are reasonably symmetric but unsuitable for the stated paired mean model in this exercise.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.signed-rank-chi-square.a-same-rooms-skewed",
      "displayName": "Select a Wilcoxon signed-rank test and Select a chi-square test of independence",
      "patientPresentationVariantId": "presentation.gs028se.signed-rank-chi-square.a-same-rooms-skewed",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "primary hyperparathyroidism study",
      "presentation": "{patientName}, the endocrine journal-club lead, reviews a new calcium-lowering agent for primary hyperparathyroidism. Serum calcium was measured before and after treatment in the same adults. The presenter insists everyone arrive early for his seminar on respecting colleagues' time. One colleague checked each visit separately; the report also describes the distribution of changes within individual participants.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Signed Rank Test",
        "CHI-SQUARE INDEPENDENCE TEST",
        "McNemar Test",
        "Primary Hyperparathyroidism",
        "Hyperparathyroidism Treatment"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.signed-rank-chi-square.a-same-rooms-skewed.1",
          "questionVariantId": "question.statistics-ethics.signed-rank.v2",
          "primaryConceptId": "concept.statistics-ethics.signed-rank",
          "stem": "Which analysis best fits the study's comparison of serum-calcium change, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_same-rooms-skewed",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": true,
              "rationale": "The study supplies linked continuous differences that are reasonably symmetric but unsuitable for a t model. Signed-rank uses their signs and ranks.",
              "serviceRequest": null
            },
            {
              "id": "d1_same-rooms-skewed",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum compares ranked observations from unrelated groups. It would ignore the repeated-person or matching structure used to form the study's differences.",
              "serviceRequest": null
            },
            {
              "id": "d2_same-rooms-skewed",
              "label": "Independent-samples t test",
              "isCorrect": false,
              "rationale": "A two-sample t procedure treats the groups as unrelated. It would discard the within-person or designated-pair relationship that supplies this study's differences.",
              "serviceRequest": null
            },
            {
              "id": "d3_same-rooms-skewed",
              "label": "One-way ANOVA",
              "isCorrect": false,
              "rationale": "The ordinary unrelated-group ANOVA listed here does not use the designated within-person or matched differences. Extra columns do not remove that linkage.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Wilcoxon signed-rank fits the within-person serum-calcium differences under the supplied symmetry and distribution findings. Checking visit columns separately does not answer that change-distribution question.",
          "teachingPoint": "The relevant distribution is the change within each patient. Here serum-calcium differences are reasonably symmetric but have non-normal tails that make the paired mean model unsuitable. Wilcoxon signed-rank fits the stated conditions. Remember that separate checks of the two visit columns do not replace a check of the differences being analyzed.",
          "exhibit": {
            "kind": "abstract",
            "title": "Serum-calcium change — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational calcium-lowering agent in primary hyperparathyroidism. Outcome: serum-calcium change, in mg/dL. The same people are measured before and after treatment. Differences are reasonably symmetric but distinctly non-normal, making a paired mean model unsuitable. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "Signed Rank Test",
            "CHI-SQUARE INDEPENDENCE TEST",
            "McNemar Test",
            "Primary Hyperparathyroidism",
            "Hyperparathyroidism Treatment"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_same-rooms-skewed",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Wilcoxon signed-rank fits the within-person serum-calcium differences under the supplied symmetry and distribution findings. Checking visit columns separately does not answer that change-distribution question.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_same-rooms-skewed",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Wilcoxon signed-rank fits the within-person serum-calcium differences under the supplied symmetry and distribution findings. Checking visit columns separately does not answer that change-distribution question.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_same-rooms-skewed",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Wilcoxon signed-rank fits the within-person serum-calcium differences under the supplied symmetry and distribution findings. Checking visit columns separately does not answer that change-distribution question.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.signed-rank-chi-square.a-matched-dyads",
      "displayName": "Select a Wilcoxon signed-rank test and Select a chi-square test of independence",
      "patientPresentationVariantId": "presentation.gs028se.signed-rank-chi-square.a-matched-dyads",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "persistent neck mass study",
      "presentation": "{patientName}, the head-and-neck research lead, reviews a new needle-biopsy technique for persistent neck masses undergoing malignancy evaluation. Recipients were matched to comparison patients before completed biopsy-site healing times were recorded. The investigators want to compare times within those designated pairs. The report supplies the matching structure and the distribution of differences between paired healing times.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Signed Rank Test",
        "CHI-SQUARE INDEPENDENCE TEST",
        "McNemar Test",
        "Head and Neck Cancer: United Kingdom National Multidisciplinary Guidelines, Sixth Edition"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.signed-rank-chi-square.a-matched-dyads.1",
          "questionVariantId": "question.statistics-ethics.signed-rank.v3",
          "primaryConceptId": "concept.statistics-ethics.signed-rank",
          "stem": "Which analysis best fits the study's comparison of biopsy-site healing-time differences, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_matched-dyads",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": true,
              "rationale": "The study supplies linked continuous differences that are reasonably symmetric but unsuitable for a t model. Signed-rank uses their signs and ranks.",
              "serviceRequest": null
            },
            {
              "id": "d1_matched-dyads",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum compares ranked observations from unrelated groups. It would ignore the repeated-person or matching structure used to form the study's differences.",
              "serviceRequest": null
            },
            {
              "id": "d2_matched-dyads",
              "label": "Independent-samples t test",
              "isCorrect": false,
              "rationale": "A two-sample t procedure treats the groups as unrelated. It would discard the within-person or designated-pair relationship that supplies this study's differences.",
              "serviceRequest": null
            },
            {
              "id": "d3_matched-dyads",
              "label": "McNemar test",
              "isCorrect": false,
              "rationale": "McNemar testing concerns paired binary responses. The exhibit instead supplies separate participants or continuous matched differences, so that observation structure does not fit.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use Wilcoxon signed-rank for the designated pairs' continuous biopsy-site healing-time differences. Their reasonable symmetry and unsuitable t-model distribution support that choice over unrelated-group or binary-response procedures.",
          "teachingPoint": "Deliberately matched people can form pairs even when nobody is measured twice. These biopsy-site healing-time differences are reasonably symmetric but unsuitable for a t model, supporting Wilcoxon signed-rank. Remember to follow the design's links. McNemar testing concerns paired binary responses, not the continuous completed healing times recorded within these matched pairs.",
          "exhibit": {
            "kind": "abstract",
            "title": "Biopsy-site healing-time differences — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational needle-biopsy technique in persistent adult neck masses. Outcome: biopsy-site healing-time differences, in days. Treatment recipients were matched to comparison recipients before measurement; differences are computed within the designated pairs. Differences are reasonably symmetric but distinctly non-normal, making a paired mean model unsuitable. All times are observed to completion with no censoring. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "Signed Rank Test",
            "CHI-SQUARE INDEPENDENCE TEST",
            "McNemar Test",
            "Head and Neck Cancer: United Kingdom National Multidisciplinary Guidelines, Sixth Edition"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_matched-dyads",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Wilcoxon signed-rank for the designated pairs' continuous biopsy-site healing-time differences. Their reasonable symmetry and unsuitable t-model distribution support that choice over unrelated-group or binary-response procedures.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_matched-dyads",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Wilcoxon signed-rank for the designated pairs' continuous biopsy-site healing-time differences. Their reasonable symmetry and unsuitable t-model distribution support that choice over unrelated-group or binary-response procedures.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_matched-dyads",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Wilcoxon signed-rank for the designated pairs' continuous biopsy-site healing-time differences. Their reasonable symmetry and unsuitable t-model distribution support that choice over unrelated-group or binary-response procedures.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.signed-rank-chi-square.a-pre-post-counts",
      "displayName": "Select a Wilcoxon signed-rank test and Select a chi-square test of independence",
      "patientPresentationVariantId": "presentation.gs028se.signed-rank-chi-square.a-pre-post-counts",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "cubital tunnel syndrome study",
      "presentation": "{patientName}, the hand-service journal-club lead, reviews a new elbow-bracing device for cubital tunnel syndrome. Investigators measured handgrip force before and after treatment in the same adults. Management calls the project frictionless; opening its presentation requires three passwords and a paper permission slip. The report describes individual force changes and the distribution checks for the proposed analysis.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Signed Rank Test",
        "CHI-SQUARE INDEPENDENCE TEST",
        "McNemar Test",
        "Hand Therapy – Cubital Tunnel Syndrome"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.signed-rank-chi-square.a-pre-post-counts.1",
          "questionVariantId": "question.statistics-ethics.signed-rank.v4",
          "primaryConceptId": "concept.statistics-ethics.signed-rank",
          "stem": "Which analysis best fits the study's comparison of handgrip-force change, using the measurements and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_pre-post-counts",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": true,
              "rationale": "The study supplies linked continuous differences that are reasonably symmetric but unsuitable for a t model. Signed-rank uses their signs and ranks.",
              "serviceRequest": null
            },
            {
              "id": "d1_pre-post-counts",
              "label": "Paired t test",
              "isCorrect": false,
              "rationale": "The observations are linked, but the exhibit says their differences are unsuitable for the paired mean model. Linkage alone does not establish its distributional assumptions.",
              "serviceRequest": null
            },
            {
              "id": "d2_pre-post-counts",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum compares ranked observations from unrelated groups. It would ignore the repeated-person or matching structure used to form the study's differences.",
              "serviceRequest": null
            },
            {
              "id": "d3_pre-post-counts",
              "label": "Chi-square test of independence",
              "isCorrect": false,
              "rationale": "Chi-square testing analyzes counts in categories. The requested comparison concerns continuous measurements or ordered ratings, not a categorical contingency table.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The repeated handgrip-force differences support Wilcoxon signed-rank under the stated symmetry and non-normality findings. Non-normal data alone would not establish all the required conditions.",
          "teachingPoint": "A Wilcoxon signed-rank procedure fits linked continuous differences that are reasonably symmetric but unsuitable for the stated t model. These repeated handgrip forces meet those supplied conditions. Remember both requirements: linkage distinguishes signed-rank from rank-sum, while symmetry matters for the usual location interpretation. Non-normality alone is not a complete selection rule.",
          "exhibit": {
            "kind": "abstract",
            "title": "Handgrip-force change — illustrative clinical study",
            "body": "Invented protocol observations for an unnamed investigational elbow-bracing device in cubital tunnel syndrome. Outcome: handgrip-force change, in newtons. The same people are measured before and after treatment. Differences are reasonably symmetric but distinctly non-normal, making a paired mean model unsuitable. These practice assumptions supply no real treatment efficacy."
          },
          "sourceLabels": [
            "Signed Rank Test",
            "CHI-SQUARE INDEPENDENCE TEST",
            "McNemar Test",
            "Hand Therapy – Cubital Tunnel Syndrome"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_pre-post-counts",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The repeated handgrip-force differences support Wilcoxon signed-rank under the stated symmetry and non-normality findings. Non-normal data alone would not establish all the required conditions.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_pre-post-counts",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The repeated handgrip-force differences support Wilcoxon signed-rank under the stated symmetry and non-normality findings. Non-normal data alone would not establish all the required conditions.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_pre-post-counts",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The repeated handgrip-force differences support Wilcoxon signed-rank under the stated symmetry and non-normality findings. Non-normal data alone would not establish all the required conditions.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.signed-rank-chi-square.b-role-by-choice",
      "displayName": "Select a Wilcoxon signed-rank test and Select a chi-square test of independence",
      "patientPresentationVariantId": "presentation.gs028se.signed-rank-chi-square.b-role-by-choice",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "appendicitis study",
      "presentation": "{patientName}, the emergency-surgery research lead, reviews three new operative techniques for appendicitis with an appendicolith. The trial records surgical-site infection categories within thirty days. The presenter saves the methods appendix until after discussion because, he says, nobody likes a spoiler. Each participant contributes one category, and the report supplies the table's expected-count assessment for analysis.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Signed Rank Test",
        "CHI-SQUARE INDEPENDENCE TEST",
        "McNemar Test",
        "SAGES guideline for appendicitis",
        "CODA appendicitis evidence update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.signed-rank-chi-square.b-role-by-choice.1",
          "questionVariantId": "question.statistics-ethics.chi-square.v1",
          "primaryConceptId": "concept.statistics-ethics.chi-square",
          "stem": "Which analysis best examines the association between study intervention and thirty-day SSI category, using the table and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_role-by-choice",
              "label": "Chi-square test",
              "isCorrect": true,
              "rationale": "Device group and outcome category are categorical variables, with separate observations and adequate expected counts. The requested large-sample association procedure fits those conditions.",
              "serviceRequest": null
            },
            {
              "id": "d1_role-by-choice",
              "label": "McNemar test",
              "isCorrect": false,
              "rationale": "McNemar testing concerns paired binary responses. The exhibit instead supplies separate participants or continuous matched differences, so that observation structure does not fit.",
              "serviceRequest": null
            },
            {
              "id": "d2_role-by-choice",
              "label": "Fisher exact test",
              "isCorrect": false,
              "rationale": "The ordinary two-by-two exact procedure does not match this table's multiple categories. Adequate expected counts support the requested large-sample association analysis.",
              "serviceRequest": null
            },
            {
              "id": "d3_role-by-choice",
              "label": "Independent-samples t test",
              "isCorrect": false,
              "rationale": "This mean-based procedure does not fit the supplied ordinal scale or unsuitable normal-model distribution. A numerical code or a continuous time measurement alone does not establish its assumptions.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
          "teachingPoint": "A chi-square test of independence assesses a relationship between categorical variables when observations are separate and expected counts support the approximation. Here intervention groups and outcome categories define the table. Remember to identify what each cell counts; several categories in a row do not make the same person a repeated observation.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational appendectomy technique study: invented practice counts of people by intervention and thirty-day SSI category. Each contributes once; no matching. Expected counts support the requested approximation.",
            "columnHeaders": [
              "No SSI",
              "Superficial SSI",
              "Deeper SSI"
            ],
            "rowHeaders": [
              "New study intervention A",
              "New study intervention B",
              "New study intervention C"
            ],
            "cells": [
              [
                "30",
                "25",
                "25"
              ],
              [
                "25",
                "30",
                "25"
              ],
              [
                "25",
                "25",
                "30"
              ]
            ]
          },
          "sourceLabels": [
            "Signed Rank Test",
            "CHI-SQUARE INDEPENDENCE TEST",
            "McNemar Test",
            "SAGES guideline for appendicitis",
            "CODA appendicitis evidence update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_role-by-choice",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_role-by-choice",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_role-by-choice",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.signed-rank-chi-square.b-shift-by-response",
      "displayName": "Select a Wilcoxon signed-rank test and Select a chi-square test of independence",
      "patientPresentationVariantId": "presentation.gs028se.signed-rank-chi-square.b-shift-by-response",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "gallstones study",
      "presentation": "{patientName}, the biliary research lead, reviews three new dissection instruments used during surgery for symptomatic gallstones. The trial classifies thirty-day surgical-site infection as absent, superficial or deeper. Each participant contributes once and received one instrument. Investigators want to examine the relationship between instrument group and infection category; the report includes the expected-count assessment for the table.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Signed Rank Test",
        "CHI-SQUARE INDEPENDENCE TEST",
        "McNemar Test",
        "Treatment for Gallstones",
        "Evidence-based clinical practice guidelines for cholelithiasis 2021"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.signed-rank-chi-square.b-shift-by-response.1",
          "questionVariantId": "question.statistics-ethics.chi-square.v2",
          "primaryConceptId": "concept.statistics-ethics.chi-square",
          "stem": "Which analysis best examines the association between study intervention and thirty-day SSI category, using the table and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_shift-by-response",
              "label": "Chi-square test",
              "isCorrect": true,
              "rationale": "Device group and outcome category are categorical variables, with separate observations and adequate expected counts. The requested large-sample association procedure fits those conditions.",
              "serviceRequest": null
            },
            {
              "id": "d1_shift-by-response",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum answers a ranked-observation comparison. This study explicitly requests means and supplies reasonable assumptions for the mean-based procedure.",
              "serviceRequest": null
            },
            {
              "id": "d2_shift-by-response",
              "label": "Fisher exact test",
              "isCorrect": false,
              "rationale": "The ordinary two-by-two exact procedure does not match this table's multiple categories. Adequate expected counts support the requested large-sample association analysis.",
              "serviceRequest": null
            },
            {
              "id": "d3_shift-by-response",
              "label": "McNemar test",
              "isCorrect": false,
              "rationale": "McNemar testing concerns paired binary responses. The exhibit instead supplies separate participants or continuous matched differences, so that observation structure does not fit.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
          "teachingPoint": "Device group and recorded outcome category are both categorical variables. The expected counts support a chi-square approximation, and each person contributes once. Remember that the number of columns does not establish pairing or a continuous outcome. The question concerns an association between categories, not a comparison of numerical means.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational gallbladder dissection instrument study: invented practice counts of people by intervention and thirty-day SSI category. Each contributes once; no matching. Expected counts support the requested approximation.",
            "columnHeaders": [
              "No SSI",
              "Superficial SSI",
              "Deeper SSI"
            ],
            "rowHeaders": [
              "New study intervention A",
              "New study intervention B",
              "New study intervention C"
            ],
            "cells": [
              [
                "30",
                "20",
                "10"
              ],
              [
                "20",
                "30",
                "10"
              ],
              [
                "10",
                "20",
                "30"
              ]
            ]
          },
          "sourceLabels": [
            "Signed Rank Test",
            "CHI-SQUARE INDEPENDENCE TEST",
            "McNemar Test",
            "Treatment for Gallstones",
            "Evidence-based clinical practice guidelines for cholelithiasis 2021"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_shift-by-response",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_shift-by-response",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_shift-by-response",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.signed-rank-chi-square.b-badge-by-completion",
      "displayName": "Select a Wilcoxon signed-rank test and Select a chi-square test of independence",
      "patientPresentationVariantId": "presentation.gs028se.signed-rank-chi-square.b-badge-by-completion",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "anal-canal SCC study",
      "presentation": "{patientName}, the oncology discussion lead, reviews two new radiation-delivery devices for localized anal-canal SCC. The study records complete response or incomplete response at its stated assessment visit. A colleague proposes comparing average healing time, but the available records contain only device group and response category. Each participant contributes once, and the expected-count assessment accompanies the table.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Signed Rank Test",
        "CHI-SQUARE INDEPENDENCE TEST",
        "McNemar Test",
        "Anal Cancer Treatment (PDQ®)–Health Professional Version"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.signed-rank-chi-square.b-badge-by-completion.1",
          "questionVariantId": "question.statistics-ethics.chi-square.v3",
          "primaryConceptId": "concept.statistics-ethics.chi-square",
          "stem": "Which analysis best examines the association between study intervention and tumor response at six months, using the table and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_badge-by-completion",
              "label": "Chi-square test",
              "isCorrect": true,
              "rationale": "Device group and outcome category are categorical variables, with separate observations and adequate expected counts. The requested large-sample association procedure fits those conditions.",
              "serviceRequest": null
            },
            {
              "id": "d1_badge-by-completion",
              "label": "McNemar test",
              "isCorrect": false,
              "rationale": "McNemar testing concerns paired binary responses. The exhibit instead supplies separate participants or continuous matched differences, so that observation structure does not fit.",
              "serviceRequest": null
            },
            {
              "id": "d2_badge-by-completion",
              "label": "Wilcoxon rank-sum test",
              "isCorrect": false,
              "rationale": "Rank-sum answers a ranked-observation comparison. This study explicitly requests means and supplies reasonable assumptions for the mean-based procedure.",
              "serviceRequest": null
            },
            {
              "id": "d3_badge-by-completion",
              "label": "Fisher exact test",
              "isCorrect": false,
              "rationale": "An exact two-by-two comparison could answer another analysis plan. This exhibit explicitly requests the large-sample approximation, whose expected-count conditions are met.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
          "teachingPoint": "The observed counts describe intervention group and whether complete response occurred. With separate observations and adequate expected counts, a chi-square test fits the planned large-sample association analysis. Remember to inspect expected counts and the requested approximation, rather than choosing solely because a table is two by two or has a large total.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational anal-cancer radiation device study: invented practice counts of people by intervention and tumor response at six months. Each contributes once; no matching. Expected counts support the requested approximation.",
            "columnHeaders": [
              "Complete response",
              "Incomplete response"
            ],
            "rowHeaders": [
              "New study intervention A",
              "New study intervention B"
            ],
            "cells": [
              [
                "120",
                "80"
              ],
              [
                "80",
                "120"
              ]
            ]
          },
          "sourceLabels": [
            "Signed Rank Test",
            "CHI-SQUARE INDEPENDENCE TEST",
            "McNemar Test",
            "Anal Cancer Treatment (PDQ®)–Health Professional Version"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_badge-by-completion",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_badge-by-completion",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_badge-by-completion",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.signed-rank-chi-square.b-site-by-category",
      "displayName": "Select a Wilcoxon signed-rank test and Select a chi-square test of independence",
      "patientPresentationVariantId": "presentation.gs028se.signed-rank-chi-square.b-site-by-category",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "carotid stenosis study",
      "presentation": "{patientName}, the vascular journal-club lead, reviews three new monitoring devices used during carotid operations for symptomatic carotid stenosis. The study classifies postoperative neurologic outcomes at thirty days. The committee requests a concise summary, but each manufacturer insists on a personal foreword. Each participant contributes one category, and the report supplies the expected-count assessment for the comparison.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Signed Rank Test",
        "CHI-SQUARE INDEPENDENCE TEST",
        "McNemar Test",
        "Canadian Stroke Best Practice Recommendations: Management of Extracranial Carotid Disease and Intracranial Atherosclerosis",
        "European Stroke Organisation guideline on endarterectomy and stenting for carotid artery stenosis"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.signed-rank-chi-square.b-site-by-category.1",
          "questionVariantId": "question.statistics-ethics.chi-square.v4",
          "primaryConceptId": "concept.statistics-ethics.chi-square",
          "stem": "Which analysis best examines the association between study intervention and thirty-day neurologic outcome, using the table and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_site-by-category",
              "label": "Chi-square test",
              "isCorrect": true,
              "rationale": "Device group and outcome category are categorical variables, with separate observations and adequate expected counts. The requested large-sample association procedure fits those conditions.",
              "serviceRequest": null
            },
            {
              "id": "d1_site-by-category",
              "label": "One-way ANOVA",
              "isCorrect": false,
              "rationale": "This ordinary mean-based ANOVA does not address the supplied ordinal or unsuitable non-normal comparison. Having groups does not by itself establish its assumptions.",
              "serviceRequest": null
            },
            {
              "id": "d2_site-by-category",
              "label": "Fisher exact test",
              "isCorrect": false,
              "rationale": "The ordinary two-by-two exact procedure does not match this table's multiple categories. Adequate expected counts support the requested large-sample association analysis.",
              "serviceRequest": null
            },
            {
              "id": "d3_site-by-category",
              "label": "McNemar test",
              "isCorrect": false,
              "rationale": "McNemar testing concerns paired binary responses. The exhibit instead supplies separate participants or continuous matched differences, so that observation structure does not fit.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
          "teachingPoint": "A table can have several rows and columns while asking one categorical-association question. Here a chi-square test fits the separate observations and adequate expected counts. Remember that both conditions matter. Counting rows and columns alone cannot establish them, and numerical cell entries remain counts within categories, not continuous outcome measurements.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational carotid monitoring device study: invented practice counts of people by intervention and thirty-day neurologic outcome. Each contributes once; no matching. Expected counts support the requested approximation.",
            "columnHeaders": [
              "No event",
              "Transient deficit",
              "Persistent deficit",
              "Other neurologic event"
            ],
            "rowHeaders": [
              "New study intervention A",
              "New study intervention B",
              "New study intervention C"
            ],
            "cells": [
              [
                "10",
                "10",
                "10",
                "10"
              ],
              [
                "8",
                "12",
                "11",
                "9"
              ],
              [
                "12",
                "8",
                "9",
                "11"
              ]
            ]
          },
          "sourceLabels": [
            "Signed Rank Test",
            "CHI-SQUARE INDEPENDENCE TEST",
            "McNemar Test",
            "Canadian Stroke Best Practice Recommendations: Management of Extracranial Carotid Disease and Intracranial Atherosclerosis",
            "European Stroke Organisation guideline on endarterectomy and stenting for carotid artery stenosis"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_site-by-category",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_site-by-category",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_site-by-category",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
              "sourceLabels": [
                "Signed Rank Test",
                "CHI-SQUARE INDEPENDENCE TEST",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.fisher-exact-study-design.a-rare-event",
      "displayName": "Select Fisher exact test and Identify basic study designs",
      "patientPresentationVariantId": "presentation.gs028se.fisher-exact-study-design.a-rare-event",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "gastric GIST study",
      "presentation": "{patientName}, the upper-GI research lead, reviews a small trial of a new stapling instrument used during gastric GIST resection. The report records staple-line leak within thirty days in two separate groups. Participants were not matched, and some table entries are very small. The investigators want to compare leak outcomes; the report provides its expected-count assessment for analysis.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Fisher Exact Test",
        "Design, Conduct, and Analyze Field Studies",
        "McNemar Test",
        "2023 GEIS Guidelines for gastrointestinal stromal tumors",
        "Gastrointestinal Stromal Tumors Treatment (PDQ®), Health Professional Version"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.fisher-exact-study-design.a-rare-event.1",
          "questionVariantId": "question.statistics-ethics.fisher-exact.v1",
          "primaryConceptId": "concept.statistics-ethics.fisher-exact",
          "stem": "Which analysis best compares thirty-day staple-line leak between the separate groups, using the sparse table and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_rare-event",
              "label": "Fisher exact test",
              "isCorrect": true,
              "rationale": "The exhibit supplies a sparse two-by-two table from separate participants. An exact categorical comparison fits the stated expected-count problem.",
              "serviceRequest": null
            },
            {
              "id": "d1_rare-event",
              "label": "Chi-square test of independence",
              "isCorrect": false,
              "rationale": "The usual chi-square approximation is unreliable under the stated sparse expected counts. A two-by-two table does not by itself establish that approximation's adequacy.",
              "serviceRequest": null
            },
            {
              "id": "d2_rare-event",
              "label": "Paired t test",
              "isCorrect": false,
              "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations.",
              "serviceRequest": null
            },
            {
              "id": "d3_rare-event",
              "label": "McNemar test",
              "isCorrect": false,
              "rationale": "McNemar testing concerns paired binary responses. The exhibit instead supplies separate participants or continuous matched differences, so that observation structure does not fit.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
          "teachingPoint": "Fisher's exact test fits this sparse two-by-two comparison of intervention group and outcome status. The supplied expected-count assessment makes a large-sample approximation unreliable. Remember to check the cells, not just the total sample size. A binary outcome from different people also does not create the paired binary structure needed for McNemar testing.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational GIST resection stapler: invented practice counts by group and 30-day staple-line leak. Cells count people once, unmatched. Expected counts are sparse; the large-sample approximation is unreliable.",
            "columnHeaders": [
              "Leak",
              "No leak"
            ],
            "rowHeaders": [
              "New study intervention",
              "Study comparator"
            ],
            "cells": [
              [
                "1",
                "8"
              ],
              [
                "0",
                "9"
              ]
            ]
          },
          "sourceLabels": [
            "Fisher Exact Test",
            "Design, Conduct, and Analyze Field Studies",
            "McNemar Test",
            "2023 GEIS Guidelines for gastrointestinal stromal tumors",
            "Gastrointestinal Stromal Tumors Treatment (PDQ®), Health Professional Version"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_rare-event",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_rare-event",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_rare-event",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.fisher-exact-study-design.a-tiny-pilot",
      "displayName": "Select Fisher exact test and Identify basic study designs",
      "patientPresentationVariantId": "presentation.gs028se.fisher-exact-study-design.a-tiny-pilot",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "rectal prolapse study",
      "presentation": "{patientName}, the colorectal discussion lead, reviews a fictional pilot comparing recurrence after two approaches to rectal prolapse. Separate unmatched groups are assessed once at two years. The exhibit contains the observed patient counts; it does not report an efficacy conclusion.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Fisher Exact Test",
        "Design, Conduct, and Analyze Field Studies",
        "McNemar Test",
        "Clinical Practice Guidelines for the Treatment of Rectal Prolapse"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.fisher-exact-study-design.a-tiny-pilot.1",
          "questionVariantId": "question.statistics-ethics.fisher-exact.v2.r3",
          "primaryConceptId": "concept.statistics-ethics.fisher-exact",
          "stem": "Which statistical test is most appropriate for comparing recurrence between the study groups?",
          "answerChoices": [
            {
              "id": "correct_tiny-pilot",
              "label": "Fisher exact test",
              "isCorrect": true,
              "rationale": "Interprets the small observed categorical table and the inadequacy of the usual large-sample approximation.",
              "serviceRequest": null
            },
            {
              "id": "d1_tiny-pilot",
              "label": "Pearson chi-square test",
              "isCorrect": false,
              "rationale": "Recognizes independent categorical groups but overlooks the sparse expected-count problem.",
              "serviceRequest": null
            },
            {
              "id": "d2_tiny-pilot",
              "label": "McNemar test",
              "isCorrect": false,
              "rationale": "Recognizes a binary outcome but mistakes the two independent groups for paired observations.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Fisher exact testing fits this small two-by-two table from independent groups. Expected counts derived from the observed margins are too sparse for the usual Pearson approximation in this exercise. McNemar testing would require paired binary observations. The invented counts do not establish clinical efficacy.",
          "teachingPoint": "Fisher exact testing fits this small two-by-two table from independent groups. Expected counts derived from the observed margins are too sparse for the usual Pearson approximation in this exercise. McNemar testing would require paired binary observations. The invented counts do not establish clinical efficacy.",
          "exhibit": {
            "kind": "table",
            "caption": "Fictional practice data: recurrence status at two years, one observation per person in separate unmatched groups.",
            "columnHeaders": [
              "Recurrence",
              "No recurrence"
            ],
            "rowHeaders": [
              "Study intervention",
              "Study comparator"
            ],
            "cells": [
              [
                "0",
                "7"
              ],
              [
                "3",
                "4"
              ]
            ]
          },
          "sourceLabels": [
            "Fisher Exact Test",
            "Design, Conduct, and Analyze Field Studies",
            "McNemar Test",
            "Clinical Practice Guidelines for the Treatment of Rectal Prolapse",
            "Clinically approved: Melissa Rowland (clinical sign-off) on 2026-10-29 (question-authoring.2026-10-28.v2)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_tiny-pilot",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Pearson chi-square test”.",
              "clinicalRationale": "Recognizes independent categorical groups but overlooks the sparse expected-count problem.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_tiny-pilot",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “McNemar test”.",
              "clinicalRationale": "Recognizes a binary outcome but mistakes the two independent groups for paired observations.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.fisher-exact-study-design.a-sparse-exposure",
      "displayName": "Select Fisher exact test and Identify basic study designs",
      "patientPresentationVariantId": "presentation.gs028se.fisher-exact-study-design.a-sparse-exposure",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "ectopic pregnancy study",
      "presentation": "{patientName}, the gynecology journal-club lead, reviews a new diagnostic pathway for suspected ectopic pregnancy. A small observational study records whether ectopic diagnoses were missed during the protocol assessment. Pathway exposure was uncommon. Participants were not matched or measured repeatedly for this comparison, and the report includes a sparse two-by-two table with an expected-count assessment for analysis.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Fisher Exact Test",
        "Design, Conduct, and Analyze Field Studies",
        "McNemar Test",
        "Early pregnancy loss",
        "Pregnancy Test",
        "Ectopic Pregnancy",
        "Ectopic pregnancy"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.fisher-exact-study-design.a-sparse-exposure.1",
          "questionVariantId": "question.statistics-ethics.fisher-exact.v3",
          "primaryConceptId": "concept.statistics-ethics.fisher-exact",
          "stem": "Which analysis best compares missed ectopic diagnosis at protocol assessment between the separate groups, using the sparse table and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_sparse-exposure",
              "label": "Fisher exact test",
              "isCorrect": true,
              "rationale": "The exhibit supplies a sparse two-by-two table from separate participants. An exact categorical comparison fits the stated expected-count problem.",
              "serviceRequest": null
            },
            {
              "id": "d1_sparse-exposure",
              "label": "One-way ANOVA",
              "isCorrect": false,
              "rationale": "This ordinary mean-based ANOVA does not address the supplied ordinal or unsuitable non-normal comparison. Having groups does not by itself establish its assumptions.",
              "serviceRequest": null
            },
            {
              "id": "d2_sparse-exposure",
              "label": "Chi-square test of independence",
              "isCorrect": false,
              "rationale": "The usual chi-square approximation is unreliable under the stated sparse expected counts. A two-by-two table does not by itself establish that approximation's adequacy.",
              "serviceRequest": null
            },
            {
              "id": "d3_sparse-exposure",
              "label": "Paired t test",
              "isCorrect": false,
              "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
          "teachingPoint": "The comparison concerns categorical intervention exposure and outcome status, with sparse counts in a two-by-two table. Fisher's exact test fits the stated conditions. Remember that an uneven exposure split can leave problematic cells even when the total seems larger. Continuous-outcome procedures do not become suitable merely because the table contains numerical counts.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational early-pregnancy diagnostic pathway: invented practice counts by group and missed ectopic diagnosis. Cells count people once, unmatched. Expected counts are sparse; the large-sample approximation is unreliable.",
            "columnHeaders": [
              "Missed diagnosis",
              "No missed diagnosis"
            ],
            "rowHeaders": [
              "New study intervention",
              "Study comparator"
            ],
            "cells": [
              [
                "1",
                "2"
              ],
              [
                "1",
                "18"
              ]
            ]
          },
          "sourceLabels": [
            "Fisher Exact Test",
            "Design, Conduct, and Analyze Field Studies",
            "McNemar Test",
            "Early pregnancy loss",
            "Pregnancy Test",
            "Ectopic Pregnancy",
            "Ectopic pregnancy"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_sparse-exposure",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_sparse-exposure",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_sparse-exposure",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.fisher-exact-study-design.a-small-response",
      "displayName": "Select Fisher exact test and Identify basic study designs",
      "patientPresentationVariantId": "presentation.gs028se.fisher-exact-study-design.a-small-response",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "allergic contact dermatitis study",
      "presentation": "{patientName}, the immunology research lead, reviews a new barrier film for allergic contact dermatitis. The small trial records whether a flare occurred during protocol exposure. The representative offers to answer methods questions afterward, then books his departure for the minute his presentation ends. Each participant contributes one outcome, and the report includes its expected-count assessment.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Fisher Exact Test",
        "Design, Conduct, and Analyze Field Studies",
        "McNemar Test",
        "Immunopathogenesis and immunoregulatory mechanisms in allergic contact dermatitis",
        "Immunotoxicity Testing Guidance"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.fisher-exact-study-design.a-small-response.1",
          "questionVariantId": "question.statistics-ethics.fisher-exact.v4",
          "primaryConceptId": "concept.statistics-ethics.fisher-exact",
          "stem": "Which analysis best compares flare during protocol exposure between the separate groups, using the sparse table and assumptions in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_small-response",
              "label": "Fisher exact test",
              "isCorrect": true,
              "rationale": "The exhibit supplies a sparse two-by-two table from separate participants. An exact categorical comparison fits the stated expected-count problem.",
              "serviceRequest": null
            },
            {
              "id": "d1_small-response",
              "label": "McNemar test",
              "isCorrect": false,
              "rationale": "McNemar testing concerns paired binary responses. The exhibit instead supplies separate participants or continuous matched differences, so that observation structure does not fit.",
              "serviceRequest": null
            },
            {
              "id": "d2_small-response",
              "label": "Wilcoxon signed-rank test",
              "isCorrect": false,
              "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links.",
              "serviceRequest": null
            },
            {
              "id": "d3_small-response",
              "label": "Chi-square test of independence",
              "isCorrect": false,
              "rationale": "The usual chi-square approximation is unreliable under the stated sparse expected counts. A two-by-two table does not by itself establish that approximation's adequacy.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
          "teachingPoint": "Fisher's exact test addresses the sparse two-by-two categorical comparison described here. Each person contributes one flare outcome, with no pairing. Remember the separate checks: sparse expected counts favor the exact method, while the observation structure rules out a paired binary procedure. Neither the table's two columns nor two groups establishes linkage.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational contact-dermatitis barrier film: invented practice counts by group and protocol-exposure flare. Cells count people once, unmatched. Expected counts are sparse; the large-sample approximation is unreliable.",
            "columnHeaders": [
              "Flare",
              "No flare"
            ],
            "rowHeaders": [
              "New study intervention",
              "Study comparator"
            ],
            "cells": [
              [
                "1",
                "7"
              ],
              [
                "0",
                "8"
              ]
            ]
          },
          "sourceLabels": [
            "Fisher Exact Test",
            "Design, Conduct, and Analyze Field Studies",
            "McNemar Test",
            "Immunopathogenesis and immunoregulatory mechanisms in allergic contact dermatitis",
            "Immunotoxicity Testing Guidance"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_small-response",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_small-response",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_small-response",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.fisher-exact-study-design.b-cohort-followup",
      "displayName": "Select Fisher exact test and Identify basic study designs",
      "patientPresentationVariantId": "presentation.gs028se.fisher-exact-study-design.b-cohort-followup",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "inguinal hernia study",
      "presentation": "{patientName}, the hernia-service research lead, reviews a new reinforcement material for symptomatic inguinal hernia repair. Investigators grouped patients by material already received and followed recurrence for two years. The publicity officer wants 'breakthrough' in the title and offers 'breakthrough pending' as a compromise. The clinical teams chose materials; investigators did not allocate the treatments under review.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Fisher Exact Test",
        "Design, Conduct, and Analyze Field Studies",
        "McNemar Test",
        "International guidelines for groin hernia management",
        "Inguinal Hernia"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.fisher-exact-study-design.b-cohort-followup.1",
          "questionVariantId": "question.statistics-ethics.study-design.v1",
          "primaryConceptId": "concept.statistics-ethics.study-design",
          "stem": "Which study design matches how the investigators selected participants, handled the study intervention and measured the clinical outcome described in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_cohort-followup",
              "label": "Prospective cohort study",
              "isCorrect": true,
              "rationale": "Patients enter by material already received and are followed for recurrence. With no investigator assignment, that forward observation is a prospective cohort.",
              "serviceRequest": null
            },
            {
              "id": "d1_cohort-followup",
              "label": "Retrospective case-control study",
              "isCorrect": false,
              "rationale": "Case-control sampling would begin with recurrence cases and controls. This project instead begins with existing material exposure and observes later outcomes.",
              "serviceRequest": null
            },
            {
              "id": "d2_cohort-followup",
              "label": "Cross-sectional study",
              "isCorrect": false,
              "rationale": "A cross-sectional snapshot measures exposure and outcome together. These investigators instead follow the exposure groups for later recurrence.",
              "serviceRequest": null
            },
            {
              "id": "d3_cohort-followup",
              "label": "Randomized experiment",
              "isCorrect": false,
              "rationale": "An experiment would assign the materials. Following patients forward does not create the random allocation absent from this project.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "This is a prospective cohort: investigators grouped patients by reinforcement material already received and followed later recurrence without assigning treatment. Forward observation alone does not create randomization.",
          "teachingPoint": "Name the design by how people entered the study and what investigators did next. These patients were grouped by material already received and followed for later recurrence, without assigned treatment. That is a prospective cohort. Remember: watching forward in time does not, by itself, make a study randomized or establish a treatment effect.",
          "exhibit": {
            "kind": "abstract",
            "title": "Hernia recurrence — illustrative study design",
            "body": "Patients who already received one of two study reinforcement materials for inguinal hernia repair are grouped by exposure and followed for recurrence over two years. Investigators assign nothing. This unnamed investigational hernia reinforcement material protocol is invented for practice, not an actual study or efficacy estimate."
          },
          "sourceLabels": [
            "Fisher Exact Test",
            "Design, Conduct, and Analyze Field Studies",
            "McNemar Test",
            "International guidelines for groin hernia management",
            "Inguinal Hernia"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_cohort-followup",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "This is a prospective cohort: investigators grouped patients by reinforcement material already received and followed later recurrence without assigning treatment. Forward observation alone does not create randomization.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_cohort-followup",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "This is a prospective cohort: investigators grouped patients by reinforcement material already received and followed later recurrence without assigning treatment. Forward observation alone does not create randomization.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_cohort-followup",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "This is a prospective cohort: investigators grouped patients by reinforcement material already received and followed later recurrence without assigning treatment. Forward observation alone does not create randomization.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.fisher-exact-study-design.b-random-scripts",
      "displayName": "Select Fisher exact test and Identify basic study designs",
      "patientPresentationVariantId": "presentation.gs028se.fisher-exact-study-design.b-random-scripts",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "colon cancer study",
      "presentation": "{patientName}, the colorectal journal-club lead, reviews a new monoclonal antibody after resection of localized colon cancer. Investigators allocated participants to study arms and followed recurrence for two years. The representative requests equal speaking time for both products, then volunteers to speak for both. The report gives allocation details; the team is reviewing how the study was organized.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Fisher Exact Test",
        "Design, Conduct, and Analyze Field Studies",
        "McNemar Test",
        "Screening Tests to Detect Colorectal Cancer and Polyps",
        "ASCRS Clinical Practice Guidelines for the Management of Colon Cancer",
        "Colon Cancer Treatment (PDQ), Health Professional Version"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.fisher-exact-study-design.b-random-scripts.1",
          "questionVariantId": "question.statistics-ethics.study-design.v2",
          "primaryConceptId": "concept.statistics-ethics.study-design",
          "stem": "Which study design matches how the investigators selected participants, handled the study intervention and measured the clinical outcome described in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_random-scripts",
              "label": "Randomized experiment",
              "isCorrect": true,
              "rationale": "Investigators randomly allocate antibody or control before measuring recurrence. That investigator-created assignment is the defining experimental action in this project.",
              "serviceRequest": null
            },
            {
              "id": "d1_random-scripts",
              "label": "Prospective cohort study",
              "isCorrect": false,
              "rationale": "A cohort would observe existing exposure groups. Here investigators create the groups through random assignment rather than recording treatment already received.",
              "serviceRequest": null
            },
            {
              "id": "d2_random-scripts",
              "label": "Case-control study",
              "isCorrect": false,
              "rationale": "Case-control selection would start with recurrence status and review exposure. This project assigns study arms before measuring that outcome.",
              "serviceRequest": null
            },
            {
              "id": "d3_random-scripts",
              "label": "Cross-sectional study",
              "isCorrect": false,
              "rationale": "A cross-sectional survey would measure exposure and outcome together without allocation. Here investigators assign study arms and subsequently measure recurrence.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The investigators randomly allocated antibody or control before measuring recurrence. That assignment makes this a randomized experiment rather than observation of treatment groups that already existed.",
          "teachingPoint": "Random assignment is an action by investigators, not a description of who happened to attend. Here they allocated antibody or control randomly before measuring recurrence, making this a randomized experiment. Remember to look for assignment. A cohort observes existing exposures; case-control and cross-sectional designs organize selection and measurement differently.",
          "exhibit": {
            "kind": "abstract",
            "title": "Colon-cancer recurrence — illustrative study design",
            "body": "Investigators randomly allocate people after localized colon-cancer resection to a new monoclonal antibody or control, then follow recurrence for two years. This unnamed investigational monoclonal antibody protocol is invented for practice, not an actual study or efficacy estimate."
          },
          "sourceLabels": [
            "Fisher Exact Test",
            "Design, Conduct, and Analyze Field Studies",
            "McNemar Test",
            "Screening Tests to Detect Colorectal Cancer and Polyps",
            "ASCRS Clinical Practice Guidelines for the Management of Colon Cancer",
            "Colon Cancer Treatment (PDQ), Health Professional Version"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_random-scripts",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The investigators randomly allocated antibody or control before measuring recurrence. That assignment makes this a randomized experiment rather than observation of treatment groups that already existed.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_random-scripts",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The investigators randomly allocated antibody or control before measuring recurrence. That assignment makes this a randomized experiment rather than observation of treatment groups that already existed.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_random-scripts",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The investigators randomly allocated antibody or control before measuring recurrence. That assignment makes this a randomized experiment rather than observation of treatment groups that already existed.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.fisher-exact-study-design.b-case-control",
      "displayName": "Select Fisher exact test and Identify basic study designs",
      "patientPresentationVariantId": "presentation.gs028se.fisher-exact-study-design.b-case-control",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "peptic ulcer bleeding study",
      "presentation": "{patientName}, the endoscopy research lead, reviews a new hemostasis device for peptic ulcer bleeding. Investigators selected patients who rebled and comparison patients who did not, then checked earlier device exposure. They did not assign treatment. The study concerns rebleeding after the initial procedure, and the report describes the sampling and sequence of measurements for the discussion.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Fisher Exact Test",
        "Design, Conduct, and Analyze Field Studies",
        "McNemar Test",
        "ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding",
        "Endoscopic diagnosis and management of peptic ulcer bleeding: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2026"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.fisher-exact-study-design.b-case-control.1",
          "questionVariantId": "question.statistics-ethics.study-design.v3",
          "primaryConceptId": "concept.statistics-ethics.study-design",
          "stem": "Which study design matches how the investigators selected participants, handled the study intervention and measured the clinical outcome described in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_case-control",
              "label": "Case-control study",
              "isCorrect": true,
              "rationale": "Selection begins with people who rebled and controls who did not; investigators then examine earlier device use. That outcome-first sampling is case-control.",
              "serviceRequest": null
            },
            {
              "id": "d1_case-control",
              "label": "Prospective cohort study",
              "isCorrect": false,
              "rationale": "A cohort comparison would begin with exposure groups. Reviewing earlier records does not make these outcome-selected groups into a cohort.",
              "serviceRequest": null
            },
            {
              "id": "d2_case-control",
              "label": "Randomized experiment",
              "isCorrect": false,
              "rationale": "The investigators assign no intervention. Selecting rebleeding cases and controls is observational, rather than allocation of a randomized treatment.",
              "serviceRequest": null
            },
            {
              "id": "d3_case-control",
              "label": "Cross-sectional study",
              "isCorrect": false,
              "rationale": "A cross-sectional study would sample without selecting on rebleeding status and measure current variables together. This design selects cases and controls by outcome.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Selection began with rebleeding status and then examined earlier device exposure. That outcome-first sampling defines a case-control design, rather than a cohort simply because records were reviewed.",
          "teachingPoint": "Ask what determined entry into the comparison. Selecting people who rebled and controls who did not, then reviewing earlier device exposure, gives a case-control study. Old records alone do not define that design; outcome-based selection does. Remember the entry rule: a cohort would begin by organizing people according to exposure.",
          "exhibit": {
            "kind": "abstract",
            "title": "Ulcer rebleeding — illustrative study design",
            "body": "Investigators select people with rebleeding after endoscopic treatment of peptic ulcer bleeding and controls without rebleeding, then review previous study-device exposure. Investigators assign nothing. This unnamed investigational endoscopic hemostasis device protocol is invented for practice, not an actual study or efficacy estimate."
          },
          "sourceLabels": [
            "Fisher Exact Test",
            "Design, Conduct, and Analyze Field Studies",
            "McNemar Test",
            "ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding",
            "Endoscopic diagnosis and management of peptic ulcer bleeding: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2026"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_case-control",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Selection began with rebleeding status and then examined earlier device exposure. That outcome-first sampling defines a case-control design, rather than a cohort simply because records were reviewed.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_case-control",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Selection began with rebleeding status and then examined earlier device exposure. That outcome-first sampling defines a case-control design, rather than a cohort simply because records were reviewed.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_case-control",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Selection began with rebleeding status and then examined earlier device exposure. That outcome-first sampling defines a case-control design, rather than a cohort simply because records were reviewed.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.fisher-exact-study-design.b-cross-sectional",
      "displayName": "Select Fisher exact test and Identify basic study designs",
      "patientPresentationVariantId": "presentation.gs028se.fisher-exact-study-design.b-cross-sectional",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "reflux disease study",
      "presentation": "{patientName}, the foregut journal-club lead, reviews a new wearable test for reflux disease. A survey records device use and current reflux symptoms at one visit, without allocating treatment or following participants afterward. The author calls the questionnaire streamlined; its optional feedback section first requires an explanation of why the feedback is optional. Recruitment details accompany the report.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Fisher Exact Test",
        "Design, Conduct, and Analyze Field Studies",
        "McNemar Test",
        "ACG Clinical Guideline: Guidelines for the Diagnosis and Management of Gastroesophageal Reflux Disease",
        "How to select patients for antireflux surgery? The ICARUS guidelines"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.fisher-exact-study-design.b-cross-sectional.1",
          "questionVariantId": "question.statistics-ethics.study-design.v4",
          "primaryConceptId": "concept.statistics-ethics.study-design",
          "stem": "Which study design matches how the investigators selected participants, handled the study intervention and measured the clinical outcome described in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_cross-sectional",
              "label": "Cross-sectional study",
              "isCorrect": true,
              "rationale": "Current device use and reflux symptoms are recorded together, without outcome-based recruitment or follow-up. Those features define this cross-sectional snapshot.",
              "serviceRequest": null
            },
            {
              "id": "d1_cross-sectional",
              "label": "Case-control study",
              "isCorrect": false,
              "rationale": "Case-control recruitment would depend on outcome status. The exhibit explicitly says recruitment does not depend on the current symptom findings.",
              "serviceRequest": null
            },
            {
              "id": "d2_cross-sectional",
              "label": "Prospective cohort study",
              "isCorrect": false,
              "rationale": "A prospective cohort would organize exposure groups and observe later outcomes. This survey has no follow-up after the same-visit measurements.",
              "serviceRequest": null
            },
            {
              "id": "d3_cross-sectional",
              "label": "Randomized experiment",
              "isCorrect": false,
              "rationale": "A randomized experiment requires investigator assignment. This survey records device use and symptoms without assigning a device or study arm.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "This is a cross-sectional survey: device use and current reflux symptoms were recorded together, without outcome-based recruitment, subsequent follow-up or investigator-assigned intervention.",
          "teachingPoint": "A cross-sectional study records exposure and outcome at one time, giving a snapshot. Here device use and current symptoms are measured together, without outcome-based recruitment, assignment or follow-up. Remember what the study actually observed. A report title cannot create a time sequence or treatment allocation that the design never supplied.",
          "exhibit": {
            "kind": "abstract",
            "title": "Reflux findings — illustrative study design",
            "body": "A survey records use of a new wearable reflux test and current reflux symptoms at the same visit. Recruitment is not based on symptom status; there is no follow-up or allocation. This unnamed investigational wearable reflux test protocol is invented for practice, not an actual study or efficacy estimate."
          },
          "sourceLabels": [
            "Fisher Exact Test",
            "Design, Conduct, and Analyze Field Studies",
            "McNemar Test",
            "ACG Clinical Guideline: Guidelines for the Diagnosis and Management of Gastroesophageal Reflux Disease",
            "How to select patients for antireflux surgery? The ICARUS guidelines"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_cross-sectional",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "This is a cross-sectional survey: device use and current reflux symptoms were recorded together, without outcome-based recruitment, subsequent follow-up or investigator-assigned intervention.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d2_cross-sectional",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "This is a cross-sectional survey: device use and current reflux symptoms were recorded together, without outcome-based recruitment, subsequent follow-up or investigator-assigned intervention.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            },
            {
              "answerChoiceId": "d3_cross-sectional",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "This is a cross-sectional survey: device use and current reflux symptoms were recorded together, without outcome-based recruitment, subsequent follow-up or investigator-assigned intervention.",
              "sourceLabels": [
                "Fisher Exact Test",
                "Design, Conduct, and Analyze Field Studies",
                "McNemar Test"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.bias-confounding-sensitivity-specificity.a-baseline-shift",
      "displayName": "Distinguish bias from confounding and Interpret sensitivity and specificity",
      "patientPresentationVariantId": "presentation.gs028se.bias-confounding-sensitivity-specificity.a-baseline-shift",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "incisional hernia study",
      "presentation": "{patientName}, the abdominal-wall research lead, reviews a new reinforcement material for incisional hernia repair. The observational study compares recurrence within two years. The sponsor wants a clean comparison, meaning a report without complicated caveats. The exhibit describes a study site related to both material use and recurrence; the unadjusted report does not account for that site.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Analyzing and Interpreting Data",
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "Midline incisional hernia guidelines: the European Hernia Society"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.bias-confounding-sensitivity-specificity.a-baseline-shift.1",
          "questionVariantId": "question.statistics-ethics.bias-confounding.v1",
          "primaryConceptId": "concept.statistics-ethics.bias-confounding",
          "stem": "Which problem most directly threatens the unadjusted intervention-outcome comparison when study site relates to both?",
          "answerChoices": [
            {
              "id": "correct_baseline-shift",
              "label": "Confounding by study site",
              "isCorrect": true,
              "rationale": "Site relates to both intervention use and the outcome, and the comparison ignores it. Their mixed association is the stated confounding concern.",
              "serviceRequest": null
            },
            {
              "id": "d1_baseline-shift",
              "label": "Selection bias from enrollment",
              "isCorrect": false,
              "rationale": "The exhibit describes an ignored third factor in the comparison, not differential entry into the sample. That is the confounding rather than selection mechanism supplied.",
              "serviceRequest": null
            },
            {
              "id": "d2_baseline-shift",
              "label": "Measurement bias from recall",
              "isCorrect": false,
              "rationale": "No unequal recall or outcome-recording method is described. The stated problem is the ignored relationship of site with both exposure and outcome.",
              "serviceRequest": null
            },
            {
              "id": "d3_baseline-shift",
              "label": "Random error from sample size",
              "isCorrect": false,
              "rationale": "More observations do not automatically remove the systematic mixing with site. Sample-size variation is not the primary mechanism described.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Study site is a confounder in this exercise because it relates to both intervention use and the outcome and is ignored in the comparison.",
          "teachingPoint": "Confounding occurs when an exposure comparison is mixed with another associated factor. Here site relates to both intervention use and the outcome, so the unadjusted association may combine those relationships. Remember the third-factor question: what else differs with exposure and outcome? More observations do not automatically remove that systematic problem.",
          "exhibit": {
            "kind": "abstract",
            "title": "Clinical study — illustrative bias review",
            "body": "An unnamed investigational hernia reinforcement material study: Study site predicts both material use and two-year hernia recurrence. The unadjusted comparison ignores site; that relationship is stipulated for this exercise, not a clinical risk-factor claim. These study conditions are invented for practice, not real intervention results."
          },
          "sourceLabels": [
            "Analyzing and Interpreting Data",
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "Midline incisional hernia guidelines: the European Hernia Society"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_baseline-shift",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Study site is a confounder in this exercise because it relates to both intervention use and the outcome and is ignored in the comparison.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d2_baseline-shift",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Study site is a confounder in this exercise because it relates to both intervention use and the outcome and is ignored in the comparison.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d3_baseline-shift",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Study site is a confounder in this exercise because it relates to both intervention use and the outcome and is ignored in the comparison.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.bias-confounding-sensitivity-specificity.a-night-excluded",
      "displayName": "Distinguish bias from confounding and Interpret sensitivity and specificity",
      "patientPresentationVariantId": "presentation.gs028se.bias-confounding-sensitivity-specificity.a-night-excluded",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "thyroglossal duct cyst study",
      "presentation": "{patientName}, the neck-surgery journal-club lead, reviews a new dissection technique for symptomatic thyroglossal duct cysts. Investigators record surgical-site infection within thirty days. The author says every patient's voice matters; recruitment stopped whenever the coordinator went home. The report presents its conclusion as applying to all eligible patients, although enrollment covered daytime operations and excluded nighttime operations.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Analyzing and Interpreting Data",
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "Thyroglossal Duct Cyst Excision"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.bias-confounding-sensitivity-specificity.a-night-excluded.1",
          "questionVariantId": "question.statistics-ethics.bias-confounding.v2",
          "primaryConceptId": "concept.statistics-ethics.bias-confounding",
          "stem": "Which bias most directly limits the claim about all eligible surgical patients when recruitment covers daytime operations only?",
          "answerChoices": [
            {
              "id": "correct_night-excluded",
              "label": "Selection bias from daytime-only recruitment",
              "isCorrect": true,
              "rationale": "Daytime encounters alone are used to make an all-patients claim. The missing nighttime surgical patients create the stated selection concern even with a large daytime sample.",
              "serviceRequest": null
            },
            {
              "id": "d1_night-excluded",
              "label": "Confounding by an unmeasured patient characteristic",
              "isCorrect": false,
              "rationale": "The supplied mechanism is who entered the audit. No patient factor relating both exposure and outcome is identified as the primary concern.",
              "serviceRequest": null
            },
            {
              "id": "d2_night-excluded",
              "label": "Measurement bias from unequal recall windows",
              "isCorrect": false,
              "rationale": "The exhibit does not describe unequal recall. It describes exclusion of nighttime surgical patients from an all-patients conclusion.",
              "serviceRequest": null
            },
            {
              "id": "d3_night-excluded",
              "label": "Random error from insufficient sample precision",
              "isCorrect": false,
              "rationale": "A large daytime sample can still exclude the target population of nighttime surgical patients. Greater sampling precision does not repair that selection problem.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Daytime-only sampling creates the stated selection concern. Adding more daytime surgical patients does not supply the missing nighttime surgical observations needed for the all-patients conclusion.",
          "teachingPoint": "Selection bias concerns which observations enter the study. A large daytime-only sample still leaves nighttime surgical patients outside an audit presented as applying to all eligible surgical patients. Sample size cannot repair that missing coverage. Distinguish this selection problem from confounding within the comparison or inconsistent measurement after people have entered it.",
          "exhibit": {
            "kind": "abstract",
            "title": "Clinical study — illustrative bias review",
            "body": "An unnamed investigational thyroglossal-cyst dissection technique study: Investigators enroll daytime operations and no nighttime operations, yet present their thirty-day SSI conclusion as applying to all eligible surgical patients. These study conditions are invented for practice, not real intervention results."
          },
          "sourceLabels": [
            "Analyzing and Interpreting Data",
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "Thyroglossal Duct Cyst Excision"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_night-excluded",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Daytime-only sampling creates the stated selection concern. Adding more daytime surgical patients does not supply the missing nighttime surgical observations needed for the all-patients conclusion.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d2_night-excluded",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Daytime-only sampling creates the stated selection concern. Adding more daytime surgical patients does not supply the missing nighttime surgical observations needed for the all-patients conclusion.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d3_night-excluded",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Daytime-only sampling creates the stated selection concern. Adding more daytime surgical patients does not supply the missing nighttime surgical observations needed for the all-patients conclusion.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.bias-confounding-sensitivity-specificity.a-recall-timing",
      "displayName": "Distinguish bias from confounding and Interpret sensitivity and specificity",
      "patientPresentationVariantId": "presentation.gs028se.bias-confounding-sensitivity-specificity.a-recall-timing",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "postoperative DVT study",
      "presentation": "{patientName}, the perioperative research lead, reviews a new calf-stimulation device and postoperative DVT. One group reported thrombotic events when they occurred; another recalled events six months later. A colleague points out that everyone used the same form. The investigators are reviewing the collection process, and the report specifies how the two reporting schedules differed during follow-up.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Analyzing and Interpreting Data",
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "Testing and Diagnosis for Venous Thromboembolism",
        "Venous Thromboembolism: Deep Vein Thrombosis (DVT)"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.bias-confounding-sensitivity-specificity.a-recall-timing.1",
          "questionVariantId": "question.statistics-ethics.bias-confounding.v3",
          "primaryConceptId": "concept.statistics-ethics.bias-confounding",
          "stem": "Which information problem most directly threatens the outcome comparison when one group reports immediately and the other recalls events six months later?",
          "answerChoices": [
            {
              "id": "correct_recall-timing",
              "label": "Measurement bias from unequal recall",
              "isCorrect": true,
              "rationale": "Immediate recording in one group and recall six months later in the other use unequal measurement processes. That can systematically distort the recorded contrast.",
              "serviceRequest": null
            },
            {
              "id": "d1_recall-timing",
              "label": "Selection bias from study enrollment",
              "isCorrect": false,
              "rationale": "The difference concerns how outcomes were recorded after entry, rather than how people were selected for the study.",
              "serviceRequest": null
            },
            {
              "id": "d2_recall-timing",
              "label": "Confounding by baseline study site",
              "isCorrect": false,
              "rationale": "No baseline site factor is supplied as relating exposure and the outcome. The stated concern is the unequal reporting schedule.",
              "serviceRequest": null
            },
            {
              "id": "d3_recall-timing",
              "label": "Random error from natural variation",
              "isCorrect": false,
              "rationale": "The groups are measured by different recall processes. That systematic difference is not simply random variation that a larger sample necessarily removes.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The primary concern is measurement bias from unequal recall schedules. The groups' recorded outcomes may differ because one reports immediately and the other recalls much later.",
          "teachingPoint": "Measurement bias can arise when groups' outcomes are recorded differently. Immediate reports and recall six months later use unequal measurement processes, so a difference in reports may reflect how the outcomes were remembered. This is distinct from who was recruited or which baseline factor confounds the comparison. Larger samples do not equalize the reporting methods.",
          "exhibit": {
            "kind": "abstract",
            "title": "Clinical study — illustrative bias review",
            "body": "An unnamed investigational calf-stimulation device study: One group reports postoperative DVT events immediately; the other recalls those events six months later. The reporting schedules differ; no real device effect is supplied. These study conditions are invented for practice, not real intervention results."
          },
          "sourceLabels": [
            "Analyzing and Interpreting Data",
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "Testing and Diagnosis for Venous Thromboembolism",
            "Venous Thromboembolism: Deep Vein Thrombosis (DVT)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_recall-timing",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The primary concern is measurement bias from unequal recall schedules. The groups' recorded outcomes may differ because one reports immediately and the other recalls much later.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d2_recall-timing",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The primary concern is measurement bias from unequal recall schedules. The groups' recorded outcomes may differ because one reports immediately and the other recalls much later.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d3_recall-timing",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The primary concern is measurement bias from unequal recall schedules. The groups' recorded outcomes may differ because one reports immediately and the other recalls much later.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.bias-confounding-sensitivity-specificity.a-adjusted-model",
      "displayName": "Distinguish bias from confounding and Interpret sensitivity and specificity",
      "patientPresentationVariantId": "presentation.gs028se.bias-confounding-sensitivity-specificity.a-adjusted-model",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "malignant-hyperthermia susceptibility study",
      "presentation": "{patientName}, the anesthesia journal-club lead, reviews a new monitoring sensor for malignant-hyperthermia susceptibility. An observational model compares recognition of concerning intraoperative changes. Investigators adjusted for recorded differences between groups. Follow-up access relates to both sensor choice and recorded recognition, but important access differences were not measured. The report describes those stipulated relationships and the model under review.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Analyzing and Interpreting Data",
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "JSA guideline for management of malignant hyperthermia in 2025",
        "Perioperative Management of MH Suspected or Susceptible Patients"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.bias-confounding-sensitivity-specificity.a-adjusted-model.1",
          "questionVariantId": "question.statistics-ethics.bias-confounding.v4",
          "primaryConceptId": "concept.statistics-ethics.bias-confounding",
          "stem": "Which limitation remains after adjustment when an important factor related to both sensor choice and recorded outcomes was not measured?",
          "answerChoices": [
            {
              "id": "correct_adjusted-model",
              "label": "Residual confounding by unmeasured factors",
              "isCorrect": true,
              "rationale": "Unrecorded follow-up access differences relate to intervention choice and the outcome. Adjustment for other factors leaves that potential confounding unresolved.",
              "serviceRequest": null
            },
            {
              "id": "d1_adjusted-model",
              "label": "Random error from the sampling process",
              "isCorrect": false,
              "rationale": "The exhibit identifies an unrecorded associated factor, not just sampling variability. Greater precision would not supply the missing follow-up access information.",
              "serviceRequest": null
            },
            {
              "id": "d2_adjusted-model",
              "label": "Selection bias from study enrollment",
              "isCorrect": false,
              "rationale": "No enrollment mechanism is described as the primary concern. The known limitation is confounding by follow-up access differences absent from the model.",
              "serviceRequest": null
            },
            {
              "id": "d3_adjusted-model",
              "label": "Measurement bias from inconsistent outcome recording",
              "isCorrect": false,
              "rationale": "No inconsistent outcome-recording process is supplied. The gap is a relevant factor the model could not adjust for because it was not recorded.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Residual confounding remains because relevant follow-up access differences were not measured. Adjusting for site and procedure category does not automatically account for that unrecorded factor.",
          "teachingPoint": "Adjustment can address recorded factors without accounting for unrecorded ones. Follow-up access still relates to both intervention choice and the outcome, so residual confounding remains possible despite adjustment for site and procedure category. Remember that an adjusted label is not a guarantee of an unconfounded result; ask which relevant differences the model could actually use.",
          "exhibit": {
            "kind": "abstract",
            "title": "Clinical study — illustrative bias review",
            "body": "An unnamed investigational anesthesia monitoring sensor study: The model adjusts for measured site and procedure category. Follow-up access relates to both sensor choice and recorded recognition of concerning intraoperative changes, but important access differences were not recorded. These relationships are stipulated, not general clinical risk-factor claims. These study conditions are invented for practice, not real intervention results."
          },
          "sourceLabels": [
            "Analyzing and Interpreting Data",
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "JSA guideline for management of malignant hyperthermia in 2025",
            "Perioperative Management of MH Suspected or Susceptible Patients"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_adjusted-model",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Residual confounding remains because relevant follow-up access differences were not measured. Adjusting for site and procedure category does not automatically account for that unrecorded factor.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d2_adjusted-model",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Residual confounding remains because relevant follow-up access differences were not measured. Adjusting for site and procedure category does not automatically account for that unrecorded factor.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d3_adjusted-model",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Residual confounding remains because relevant follow-up access differences were not measured. Adjusting for site and procedure category does not automatically account for that unrecorded factor.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90",
      "displayName": "Distinguish bias from confounding and Interpret sensitivity and specificity",
      "patientPresentationVariantId": "presentation.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 58,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Blood-test question",
      "presentation": "{patientName}, a 58-year-old woman, has an accessible suspicious solid breast mass on completed diagnostic imaging. Core biopsy is arranged. A recruiter offers a study of a new screening blood test. His slides call the evidence transparent, but he keeps skipping the results table. The patient asks how often the test identified disease in the separate validation cohort.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90.female.58",
          "prototypeDemographics": {
            "ageYears": 58,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 58-year-old woman, has an accessible suspicious solid breast mass on completed diagnostic imaging. Core biopsy is arranged. A recruiter offers a study of a new screening blood test. His slides call the evidence transparent, but he keeps skipping the results table. The patient asks how often the test identified disease in the separate validation cohort."
        },
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90.male.58",
          "prototypeDemographics": {
            "ageYears": 58,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 58-year-old man, has an accessible suspicious solid breast mass on completed diagnostic imaging. Core biopsy is arranged. A recruiter offers a study of a new screening blood test. His slides call the evidence transparent, but he keeps skipping the results table. The patient asks how often the test identified disease in the separate validation cohort."
        },
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90.female.29",
          "prototypeDemographics": {
            "ageYears": 29,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 29-year-old woman, has an accessible suspicious solid breast mass on completed diagnostic imaging. Core biopsy is arranged. A recruiter offers a study of a new screening blood test. His slides call the evidence transparent, but he keeps skipping the results table. The patient asks how often the test identified disease in the separate validation cohort."
        },
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90.male.29",
          "prototypeDemographics": {
            "ageYears": 29,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 29-year-old man, has an accessible suspicious solid breast mass on completed diagnostic imaging. Core biopsy is arranged. A recruiter offers a study of a new screening blood test. His slides call the evidence transparent, but he keeps skipping the results table. The patient asks how often the test identified disease in the separate validation cohort."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Analyzing and Interpreting Data",
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "ACR Appropriateness Criteria Palpable Breast Masses: 2022 Update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90.1",
          "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v1",
          "primaryConceptId": "concept.statistics-ethics.sensitivity-specificity",
          "stem": "What is the new investigational breast-cancer blood test's sensitivity in the separate constructed validation cohort shown in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_sensitivity-90",
              "label": "90%",
              "isCorrect": true,
              "rationale": "Of the 100 people with the condition, 90 screen positive: 90/(90 + 10) = 90%. This is the condition-present denominator sensitivity requires.",
              "serviceRequest": null
            },
            {
              "id": "d1_sensitivity-90",
              "label": "10%",
              "isCorrect": false,
              "rationale": "Ten of 100 people with the condition screen negative. That is the false-negative fraction, not the positive fraction requested for sensitivity.",
              "serviceRequest": null
            },
            {
              "id": "d2_sensitivity-90",
              "label": "75%",
              "isCorrect": false,
              "rationale": "The calculation 90/(90 + 30) = 75% starts with all positive screens. That gives positive predictive value rather than sensitivity.",
              "serviceRequest": null
            },
            {
              "id": "d3_sensitivity-90",
              "label": "70%",
              "isCorrect": false,
              "rationale": "The calculation 70/(30 + 70) = 70% starts with people without the condition. It gives specificity, not sensitivity.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use the condition-present row: 90/(90 + 10) = 90% sensitivity. The positive-result column answers a different question, and this practice table is not a personal risk estimate.",
          "teachingPoint": "Sensitivity starts with people who have the condition by the reference assessment: how many tested positive? Here 90 of 100 did, giving 90%. Remember: sensitivity begins with condition present, not with a positive or negative screen. These practice counts explain the measure; they do not calculate this patient's probability after a negative result.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational breast-cancer blood test: invented practice counts from a separate validation cohort. Cells count people; reference classification is treated as correct. Not real test performance or a personal disease probability.",
            "columnHeaders": [
              "New blood test positive",
              "New blood test negative"
            ],
            "rowHeaders": [
              "Breast cancer present by reference",
              "Breast cancer absent by reference"
            ],
            "cells": [
              [
                "90",
                "10"
              ],
              [
                "30",
                "70"
              ]
            ]
          },
          "sourceLabels": [
            "Analyzing and Interpreting Data",
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "ACR Appropriateness Criteria Palpable Breast Masses: 2022 Update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_sensitivity-90",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use the condition-present row: 90/(90 + 10) = 90% sensitivity. The positive-result column answers a different question, and this practice table is not a personal risk estimate.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d2_sensitivity-90",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use the condition-present row: 90/(90 + 10) = 90% sensitivity. The positive-result column answers a different question, and this practice table is not a personal risk estimate.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d3_sensitivity-90",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use the condition-present row: 90/(90 + 10) = 90% sensitivity. The positive-result column answers a different question, and this practice table is not a personal risk estimate.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95",
      "displayName": "Distinguish bias from confounding and Interpret sensitivity and specificity",
      "patientPresentationVariantId": "presentation.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 29,
        "sexLabel": "Male"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Breath-test question",
      "presentation": "{patientName}, a 29-year-old man, has an uncomplicated duodenal ulcer being evaluated for H. pylori. An optional study offers a new breath test. The patient asks, 'What happened to people who did not have the infection?' Its separate validation table compares the investigational result with a reference assessment. The planned clinical evaluation has not been replaced by enrollment.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95.male.29",
          "prototypeDemographics": {
            "ageYears": 29,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 29-year-old man, has an uncomplicated duodenal ulcer being evaluated for H. pylori. An optional study offers a new breath test. The patient asks, 'What happened to people who did not have the infection?' Its separate validation table compares the investigational result with a reference assessment. The planned clinical evaluation has not been replaced by enrollment."
        },
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95.female.29",
          "prototypeDemographics": {
            "ageYears": 29,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 29-year-old woman, has an uncomplicated duodenal ulcer being evaluated for H. pylori. An optional study offers a new breath test. The patient asks, 'What happened to people who did not have the infection?' Its separate validation table compares the investigational result with a reference assessment. The planned clinical evaluation has not been replaced by enrollment."
        },
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95.male.67",
          "prototypeDemographics": {
            "ageYears": 67,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 67-year-old man, has an uncomplicated duodenal ulcer being evaluated for H. pylori. An optional study offers a new breath test. The patient asks, 'What happened to people who did not have the infection?' Its separate validation table compares the investigational result with a reference assessment. The planned clinical evaluation has not been replaced by enrollment."
        },
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95.female.67",
          "prototypeDemographics": {
            "ageYears": 67,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 67-year-old woman, has an uncomplicated duodenal ulcer being evaluated for H. pylori. An optional study offers a new breath test. The patient asks, 'What happened to people who did not have the infection?' Its separate validation table compares the investigational result with a reference assessment. The planned clinical evaluation has not been replaced by enrollment."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Analyzing and Interpreting Data",
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "ACG Clinical Guideline: Treatment of Helicobacter pylori Infection",
        "Peptic Ulcer Disease"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95.1",
          "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v2",
          "primaryConceptId": "concept.statistics-ethics.sensitivity-specificity",
          "stem": "What is the new investigational breast-cancer blood test's specificity in the separate constructed validation cohort shown in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_specificity-95",
              "label": "95%",
              "isCorrect": true,
              "rationale": "Of the 100 people without the condition, 95 screen negative: 95/(5 + 95) = 95%. This is specificity.",
              "serviceRequest": null
            },
            {
              "id": "d1_specificity-95",
              "label": "5%",
              "isCorrect": false,
              "rationale": "Five of the 100 people without the condition screen positive. That gives the false-positive fraction, the opposite screen result from the one used for specificity.",
              "serviceRequest": null
            },
            {
              "id": "d2_specificity-95",
              "label": "80%",
              "isCorrect": false,
              "rationale": "The calculation 80/(80 + 20) = 80% uses the condition-present row and gives sensitivity. Specificity starts with condition absent.",
              "serviceRequest": null
            },
            {
              "id": "d3_specificity-95",
              "label": "94%",
              "isCorrect": false,
              "rationale": "The calculation 80/(80 + 5) is about 94%. It uses the positive-screen column to give positive predictive value, not specificity.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Specificity is 95/(5 + 95) = 95%, using everyone without the condition as the denominator. It is not the proportion of positive results that are correct.",
          "teachingPoint": "Specificity asks how often the screen is negative among people without the condition. In this table, 95 of 100 condition-absent people test negative, giving 95%. Start with condition absent. Starting with positive screens would instead ask about positive predictive value, which is a different measure and denominator.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational H. pylori breath test: invented practice counts from a separate validation cohort. Cells count people; reference classification is treated as correct. Not real test performance or a personal disease probability.",
            "columnHeaders": [
              "New breath test positive",
              "New breath test negative"
            ],
            "rowHeaders": [
              "H. pylori infection present by reference",
              "H. pylori infection absent by reference"
            ],
            "cells": [
              [
                "80",
                "20"
              ],
              [
                "5",
                "95"
              ]
            ]
          },
          "sourceLabels": [
            "Analyzing and Interpreting Data",
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "ACG Clinical Guideline: Treatment of Helicobacter pylori Infection",
            "Peptic Ulcer Disease"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_specificity-95",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Specificity is 95/(5 + 95) = 95%, using everyone without the condition as the denominator. It is not the proportion of positive results that are correct.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d2_specificity-95",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Specificity is 95/(5 + 95) = 95%, using everyone without the condition as the denominator. It is not the proportion of positive results that are correct.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d3_specificity-95",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Specificity is 95/(5 + 95) = 95%, using everyone without the condition as the denominator. It is not the proportion of positive results that are correct.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80",
      "displayName": "Distinguish bias from confounding and Interpret sensitivity and specificity",
      "patientPresentationVariantId": "presentation.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 72,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Optical-test question",
      "presentation": "{patientName}, a 72-year-old woman, is discussing biopsy of a lesion suspicious for cutaneous SCC. A brochure describes a new optical skin test's validation cohort. 'The evidence gets one paragraph; the subscription terms get three pages,' the patient says. The patient asks how often the test identified disease among participants known to have it by reference assessment.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80.female.72",
          "prototypeDemographics": {
            "ageYears": 72,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 72-year-old woman, is discussing biopsy of a lesion suspicious for cutaneous SCC. A brochure describes a new optical skin test's validation cohort. 'The evidence gets one paragraph; the subscription terms get three pages,' the patient says. The patient asks how often the test identified disease among participants known to have it by reference assessment."
        },
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80.male.72",
          "prototypeDemographics": {
            "ageYears": 72,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 72-year-old man, is discussing biopsy of a lesion suspicious for cutaneous SCC. A brochure describes a new optical skin test's validation cohort. 'The evidence gets one paragraph; the subscription terms get three pages,' the patient says. The patient asks how often the test identified disease among participants known to have it by reference assessment."
        },
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80.female.36",
          "prototypeDemographics": {
            "ageYears": 36,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 36-year-old woman, is discussing biopsy of a lesion suspicious for cutaneous SCC. A brochure describes a new optical skin test's validation cohort. 'The evidence gets one paragraph; the subscription terms get three pages,' the patient says. The patient asks how often the test identified disease among participants known to have it by reference assessment."
        },
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80.male.36",
          "prototypeDemographics": {
            "ageYears": 36,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 36-year-old man, is discussing biopsy of a lesion suspicious for cutaneous SCC. A brochure describes a new optical skin test's validation cohort. 'The evidence gets one paragraph; the subscription terms get three pages,' the patient says. The patient asks how often the test identified disease among participants known to have it by reference assessment."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Analyzing and Interpreting Data",
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "Guidelines of care for the management of cutaneous squamous cell carcinoma",
        "Choosing Wisely recommendations"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80.1",
          "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v3",
          "primaryConceptId": "concept.statistics-ethics.sensitivity-specificity",
          "stem": "What is the new investigational breast-cancer blood test's sensitivity in the separate constructed validation cohort shown in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_sensitivity-80",
              "label": "80%",
              "isCorrect": true,
              "rationale": "The condition-present row contains 20 positive and five negative screens. Its positive share is 20/25 = 80%, the sensitivity.",
              "serviceRequest": null
            },
            {
              "id": "d1_sensitivity-80",
              "label": "67%",
              "isCorrect": false,
              "rationale": "The calculation 20/(20 + 10) is about 67% and starts with positive screens. That calculates positive predictive value, not sensitivity.",
              "serviceRequest": null
            },
            {
              "id": "d2_sensitivity-80",
              "label": "20%",
              "isCorrect": false,
              "rationale": "The calculation 5/(20 + 5) = 20% counts negative screens among people with the condition. That is the false-negative fraction.",
              "serviceRequest": null
            },
            {
              "id": "d3_sensitivity-80",
              "label": "60%",
              "isCorrect": false,
              "rationale": "The calculation 15/(10 + 15) = 60% uses people without the condition. That calculates specificity rather than sensitivity.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "There are 25 people with the condition, and 20 screen positive: sensitivity is 80%. The five missed cases belong in that same denominator.",
          "teachingPoint": "Choose the condition-present denominator before calculating sensitivity. This row contains 20 positive screens and five negative screens, so 20/25 = 80%. The remaining five show why sensitivity and the false-negative fraction differ. Counting all positive screens would answer a predictive-value question instead of the condition-based question asked here.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational cutaneous-SCC optical test: invented practice counts from a separate validation cohort. Cells count people; reference classification is treated as correct. Not real test performance or a personal disease probability.",
            "columnHeaders": [
              "New optical test positive",
              "New optical test negative"
            ],
            "rowHeaders": [
              "Cutaneous SCC present by reference",
              "Cutaneous SCC absent by reference"
            ],
            "cells": [
              [
                "20",
                "5"
              ],
              [
                "10",
                "15"
              ]
            ]
          },
          "sourceLabels": [
            "Analyzing and Interpreting Data",
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "Guidelines of care for the management of cutaneous squamous cell carcinoma",
            "Choosing Wisely recommendations"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_sensitivity-80",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "There are 25 people with the condition, and 20 screen positive: sensitivity is 80%. The five missed cases belong in that same denominator.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d2_sensitivity-80",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "There are 25 people with the condition, and 20 screen positive: sensitivity is 80%. The five missed cases belong in that same denominator.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d3_sensitivity-80",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "There are 25 people with the condition, and 20 screen positive: sensitivity is 80%. The five missed cases belong in that same denominator.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70",
      "displayName": "Distinguish bias from confounding and Interpret sensitivity and specificity",
      "patientPresentationVariantId": "presentation.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 42,
        "sexLabel": "Male"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Blood-test question",
      "presentation": "{patientName}, a 42-year-old man, has suspected post-transplant lymphoproliferative disorder and is discussing tissue diagnosis. A recruiter presents a new blood test's separate validation table. The patient asks what negative results mean among participants without the disorder. Reference findings and investigational results appear separately, and the patient wants help interpreting the study before deciding about optional enrollment.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70.male.42",
          "prototypeDemographics": {
            "ageYears": 42,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 42-year-old man, has suspected post-transplant lymphoproliferative disorder and is discussing tissue diagnosis. A recruiter presents a new blood test's separate validation table. The patient asks what negative results mean among participants without the disorder. Reference findings and investigational results appear separately, and the patient wants help interpreting the study before deciding about optional enrollment."
        },
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70.female.42",
          "prototypeDemographics": {
            "ageYears": 42,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 42-year-old woman, has suspected post-transplant lymphoproliferative disorder and is discussing tissue diagnosis. A recruiter presents a new blood test's separate validation table. The patient asks what negative results mean among participants without the disorder. Reference findings and investigational results appear separately, and the patient wants help interpreting the study before deciding about optional enrollment."
        },
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70.male.54",
          "prototypeDemographics": {
            "ageYears": 54,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 54-year-old man, has suspected post-transplant lymphoproliferative disorder and is discussing tissue diagnosis. A recruiter presents a new blood test's separate validation table. The patient asks what negative results mean among participants without the disorder. Reference findings and investigational results appear separately, and the patient wants help interpreting the study before deciding about optional enrollment."
        },
        {
          "id": "profile.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70.female.54",
          "prototypeDemographics": {
            "ageYears": 54,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 54-year-old woman, has suspected post-transplant lymphoproliferative disorder and is discussing tissue diagnosis. A recruiter presents a new blood test's separate validation table. The patient asks what negative results mean among participants without the disorder. Reference findings and investigational results appear separately, and the patient wants help interpreting the study before deciding about optional enrollment."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Analyzing and Interpreting Data",
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "AST PTLD and EBV guideline",
        "Comprehensive review of PTLD after solid organ transplantation"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70.1",
          "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v4",
          "primaryConceptId": "concept.statistics-ethics.sensitivity-specificity",
          "stem": "What is the new investigational breast-cancer blood test's specificity in the separate constructed validation cohort shown in the exhibit?",
          "answerChoices": [
            {
              "id": "correct_specificity-70",
              "label": "70%",
              "isCorrect": true,
              "rationale": "The condition-absent row has 70 negative screens out of 100 people: 70/(30 + 70) = 70%, the specificity.",
              "serviceRequest": null
            },
            {
              "id": "d1_specificity-70",
              "label": "30%",
              "isCorrect": false,
              "rationale": "Thirty of 100 people without the condition screen positive. That is the false-positive fraction rather than specificity.",
              "serviceRequest": null
            },
            {
              "id": "d2_specificity-70",
              "label": "80%",
              "isCorrect": false,
              "rationale": "The calculation 16/(16 + 4) = 80% uses people with the condition. That is sensitivity, not specificity.",
              "serviceRequest": null
            },
            {
              "id": "d3_specificity-70",
              "label": "35%",
              "isCorrect": false,
              "rationale": "The calculation 16/(16 + 30) is about 35%. It uses all positive screens to calculate positive predictive value, not specificity.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Use the condition-absent row: 70/(30 + 70) = 70% specificity. A particular patient’s result does not change the denominator defining this test measure.",
          "teachingPoint": "Specificity uses everyone classified as condition absent, whether their test was positive or negative. Here 70 of those 100 people test negative, so specificity is 70%. Remember the starting group: condition absent. Starting with the positive-result column would instead ask a predictive-value question, regardless of which result interests a particular patient.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational PTLD blood test: invented practice counts from a separate validation cohort. Cells count people; reference classification is treated as correct. Not real test performance or a personal disease probability.",
            "columnHeaders": [
              "New blood test positive",
              "New blood test negative"
            ],
            "rowHeaders": [
              "PTLD present by reference",
              "PTLD absent by reference"
            ],
            "cells": [
              [
                "16",
                "4"
              ],
              [
                "30",
                "70"
              ]
            ]
          },
          "sourceLabels": [
            "Analyzing and Interpreting Data",
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "AST PTLD and EBV guideline",
            "Comprehensive review of PTLD after solid organ transplantation"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_specificity-70",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use the condition-absent row: 70/(30 + 70) = 70% specificity. A particular patient’s result does not change the denominator defining this test measure.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d2_specificity-70",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use the condition-absent row: 70/(30 + 70) = 70% specificity. A particular patient’s result does not change the denominator defining this test measure.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            },
            {
              "answerChoiceId": "d3_specificity-70",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Use the condition-absent row: 70/(30 + 70) = 70% specificity. A particular patient’s result does not change the denominator defining this test measure.",
              "sourceLabels": [
                "Analyzing and Interpreting Data",
                "Principles of Epidemiology: Lesson 5, Appendix A"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence",
      "displayName": "Relate positive predictive value to prevalence and Distinguish risk ratio and odds ratio",
      "patientPresentationVariantId": "presentation.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 29,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Positive-test question",
      "presentation": "{patientName}, a 29-year-old woman, is discussing diagnostic excision of a small pigmented lesion concerning for melanoma. A new optical-test brochure compares two hypothetical populations. Its presenter calls the brochure personalized, then offers two identical covers to choose from. The patient asks why a positive result would have different meanings in the populations before considering optional study enrollment.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence.female.29",
          "prototypeDemographics": {
            "ageYears": 29,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 29-year-old woman, is discussing diagnostic excision of a small pigmented lesion concerning for melanoma. A new optical-test brochure compares two hypothetical populations. Its presenter calls the brochure personalized, then offers two identical covers to choose from. The patient asks why a positive result would have different meanings in the populations before considering optional study enrollment."
        },
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence.male.29",
          "prototypeDemographics": {
            "ageYears": 29,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 29-year-old man, is discussing diagnostic excision of a small pigmented lesion concerning for melanoma. A new optical-test brochure compares two hypothetical populations. Its presenter calls the brochure personalized, then offers two identical covers to choose from. The patient asks why a positive result would have different meanings in the populations before considering optional study enrollment."
        },
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence.female.58",
          "prototypeDemographics": {
            "ageYears": 58,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 58-year-old woman, is discussing diagnostic excision of a small pigmented lesion concerning for melanoma. A new optical-test brochure compares two hypothetical populations. Its presenter calls the brochure personalized, then offers two identical covers to choose from. The patient asks why a positive result would have different meanings in the populations before considering optional study enrollment."
        },
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence.male.58",
          "prototypeDemographics": {
            "ageYears": 58,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 58-year-old man, is discussing diagnostic excision of a small pigmented lesion concerning for melanoma. A new optical-test brochure compares two hypothetical populations. Its presenter calls the brochure personalized, then offers two identical covers to choose from. The patient asks why a positive result would have different meanings in the populations before considering optional study enrollment."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
        "Design, Conduct, and Analyze Field Studies",
        "Analyzing and Interpreting Data",
        "Melanoma Treatment (PDQ), Health Professional Version",
        "Melanoma clinical guideline (Guideline highlights)"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence.1",
          "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v1",
          "primaryConceptId": "concept.statistics-ethics.predictive-value-prevalence",
          "stem": "How does the new investigational breast-cancer blood test's positive predictive value change between the hypothetical populations when sensitivity and specificity remain fixed as stated?",
          "answerChoices": [
            {
              "id": "correct_higher-prevalence",
              "label": "Positive predictive value increases",
              "isCorrect": true,
              "rationale": "With sensitivity and specificity fixed, the higher-prevalence population has a greater true-positive share among positive screens. This supports an increase, without an exact percentage.",
              "serviceRequest": null
            },
            {
              "id": "d1_higher-prevalence",
              "label": "Positive predictive value decreases",
              "isCorrect": false,
              "rationale": "This reverses the direction: higher prevalence increases the true-positive share among positives under the fixed-test assumptions.",
              "serviceRequest": null
            },
            {
              "id": "d2_higher-prevalence",
              "label": "Positive predictive value stays fixed",
              "isCorrect": false,
              "rationale": "Fixed sensitivity and specificity do not fix positive predictive value. Prevalence also determines the mix of true and false positives.",
              "serviceRequest": null
            },
            {
              "id": "d3_higher-prevalence",
              "label": "Positive predictive value is indeterminate",
              "isCorrect": false,
              "rationale": "An exact percentage would need more numbers, but the direction follows from higher prevalence with fixed test characteristics. That direction is not indeterminate.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Positive predictive value increases under the stated fixed-test assumptions because prevalence is higher. The exhibit supports the direction of change without supplying an exact personal probability.",
          "teachingPoint": "Positive predictive value asks what share of positive results come from people with the condition. With sensitivity and specificity held fixed, higher prevalence makes true positives a larger share of positives, so predictive value rises. Remember that the test and the tested population both matter; this comparison gives direction, not a personal percentage.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Unnamed investigational melanoma optical test: invented testing-population assumptions for practice. These comparisons supply no real test performance or personal disease probability.",
            "items": [
              {
                "label": "Sensitivity",
                "value": "Same in the two hypothetical populations"
              },
              {
                "label": "Specificity",
                "value": "Same in the two hypothetical populations"
              },
              {
                "label": "Prevalence",
                "value": "Higher in population B than in population A"
              }
            ]
          },
          "sourceLabels": [
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
            "Design, Conduct, and Analyze Field Studies",
            "Analyzing and Interpreting Data",
            "Melanoma Treatment (PDQ), Health Professional Version",
            "Melanoma clinical guideline (Guideline highlights)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_higher-prevalence",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Positive predictive value increases under the stated fixed-test assumptions because prevalence is higher. The exhibit supports the direction of change without supplying an exact personal probability.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "d2_higher-prevalence",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Positive predictive value increases under the stated fixed-test assumptions because prevalence is higher. The exhibit supports the direction of change without supplying an exact personal probability.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "d3_higher-prevalence",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Positive predictive value increases under the stated fixed-test assumptions because prevalence is higher. The exhibit supports the direction of change without supplying an exact personal probability.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence",
      "displayName": "Relate positive predictive value to prevalence and Distinguish risk ratio and odds ratio",
      "patientPresentationVariantId": "presentation.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 67,
        "sexLabel": "Male"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Preoperative result discussion",
      "patientPresentationRevision": {
        "id": "ppr.flags2.20261105.case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence",
        "patientPresentationVariantId": "presentation.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence",
        "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
        "revisedChiefComplaint": "Preoperative result discussion",
        "revisedPresentation": "{patientName}, a 67-year-old man, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.flags2.20261105.profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.67",
            "approvedInstantiationProfileId": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.67",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 67-year-old man, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.67",
            "approvedInstantiationProfileId": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.67",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 67-year-old woman, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.42",
            "approvedInstantiationProfileId": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.42",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 42-year-old man, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.flags2.20261105.profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.42",
            "approvedInstantiationProfileId": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.42",
            "contentVersion": "presentation-revision.question-flags2.2026-11-05.v1",
            "revisedPresentation": "{patientName}, a 42-year-old woman, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts.",
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
      "presentation": "{patientName}, a 67-year-old man, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.67",
          "prototypeDemographics": {
            "ageYears": 67,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Preoperative result discussion",
          "presentation": "{patientName}, a 67-year-old man, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts."
        },
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.67",
          "prototypeDemographics": {
            "ageYears": 67,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Preoperative result discussion",
          "presentation": "{patientName}, a 67-year-old woman, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts."
        },
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.male.42",
          "prototypeDemographics": {
            "ageYears": 42,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Preoperative result discussion",
          "presentation": "{patientName}, a 42-year-old man, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts."
        },
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.female.42",
          "prototypeDemographics": {
            "ageYears": 42,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "chiefComplaint": "Preoperative result discussion",
          "presentation": "{patientName}, a 42-year-old woman, visits after pancreatic-tail cancer surgery to discuss a nasal MRSA PCR result. The specimen was collected in the pre-admission clinic; its positive result was discussed during postoperative ICU care. The audit below used the same assay and independent reference culture for every participant in both cohorts."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
        "Design, Conduct, and Analyze Field Studies",
        "Analyzing and Interpreting Data",
        "Multidisciplinary consensus statement on the clinical management of patients with pancreatic cancer",
        "Pancreatic Cancer Treatment (PDQ): Health Professional Version"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.1",
          "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v2.r1",
          "primaryConceptId": "concept.predictive-value.collection-population-denominator.v1",
          "stem": "Using this audit, what approximate positive predictive value should be used for {patientName}'s reported PCR result?",
          "answerChoices": [
            {
              "id": "correct_lower-prevalence",
              "label": "About 70%",
              "isCorrect": true,
              "rationale": "The specimen belongs to the pre-admission cohort, regardless of the later ICU care. Among that cohort's positive tests, 45 of 64 agree with the reference culture: 45/(45+19), about 70%.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g06.d1",
              "label": "About 92%",
              "isCorrect": false,
              "rationale": "This is 180/(180+16), the positive predictive value of the ICU cohort. Applying it to a specimen collected in pre-admission screening imports the wrong tested population.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g06.d2",
              "label": "About 90%",
              "isCorrect": false,
              "rationale": "This is sensitivity, 45/(45+5), not the proportion of positive screens that represent reference-confirmed carriage. Both cohorts have that same sensitivity.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags2.20261105.g06.d3",
              "label": "About 5%",
              "isCorrect": false,
              "rationale": "This is the pre-admission cohort's reference-positive fraction, (45+5)/1000. It is the pretest prevalence in the constructed audit, not the result-conditioned fraction.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The specimen belongs to the pre-admission cohort, regardless of the later ICU care. Among that cohort's positive tests, 45 of 64 agree with the reference culture: 45/(45+19), about 70%. This is 180/(180+16), the positive predictive value of the ICU cohort. Applying it to a specimen collected in pre-admission screening imports the wrong tested population. This is sensitivity, 45/(45+5), not the proportion of positive screens that represent reference-confirmed carriage. Both cohorts have that same sensitivity. This is the pre-admission cohort's reference-positive fraction, (45+5)/1000. It is the pretest prevalence in the constructed audit, not the result-conditioned fraction.",
          "teachingPoint": "The specimen belongs to the pre-admission cohort, regardless of the later ICU care. Among that cohort's positive tests, 45 of 64 agree with the reference culture: 45/(45+19), about 70%.",
          "exhibit": {
            "kind": "table",
            "caption": "Constructed local audit for this clinical numeracy exercise; counts are not published assay performance or prevalence estimates.",
            "columnHeaders": [
              "PCR positive / culture positive",
              "PCR positive / culture negative",
              "PCR negative / culture positive",
              "PCR negative / culture negative"
            ],
            "rowHeaders": [
              "Pre-admission clinic specimens",
              "ICU specimens"
            ],
            "cells": [
              [
                "45",
                "19",
                "5",
                "931"
              ],
              [
                "180",
                "16",
                "20",
                "784"
              ]
            ]
          },
          "sourceLabels": [
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
            "Design, Conduct, and Analyze Field Studies",
            "Analyzing and Interpreting Data",
            "Multidisciplinary consensus statement on the clinical management of patients with pancreatic cancer",
            "Pancreatic Cancer Treatment (PDQ): Health Professional Version",
            "AI-assisted revision: needs_clinician_review (clinical.question-flags2.2026-11-05.v1)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.flags2.20261105.g06.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “About 92%”.",
              "clinicalRationale": "This is 180/(180+16), the positive predictive value of the ICU cohort. Applying it to a specimen collected in pre-admission screening imports the wrong tested population.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "choice.flags2.20261105.g06.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “About 90%”.",
              "clinicalRationale": "This is sensitivity, 45/(45+5), not the proportion of positive screens that represent reference-confirmed carriage. Both cohorts have that same sensitivity.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "choice.flags2.20261105.g06.d3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “About 5%”.",
              "clinicalRationale": "This is the pre-admission cohort's reference-positive fraction, (45+5)/1000. It is the pretest prevalence in the constructed audit, not the result-conditioned fraction.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            }
          ]
        }
      ],
      "learningSummary": "The specimen belongs to the pre-admission cohort, regardless of the later ICU care. Among that cohort's positive tests, 45 of 64 agree with the reference culture: 45/(45+19), about 70%. This is 180/(180+16), the positive predictive value of the ICU cohort. Applying it to a specimen collected in pre-admission screening imports the wrong tested population. This is sensitivity, 45/(45+5), not the proportion of positive screens that represent reference-confirmed carriage. Both cohorts have that same sensitivity. This is the pre-admission cohort's reference-positive fraction, (45+5)/1000. It is the pretest prevalence in the constructed audit, not the result-conditioned fraction."
    },
    {
      "id": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table",
      "displayName": "Relate positive predictive value to prevalence and Distinguish risk ratio and odds ratio",
      "patientPresentationVariantId": "presentation.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 36,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Positive-test question",
      "presentation": "{patientName}, a 36-year-old woman, has a suspicious thyroid nodule meeting biopsy criteria, with needle sampling planned. An study offers a new screening blood test and a separate validation table. The patient asks, 'Among the people with a positive result, how many actually had cancer?' Study enrollment remains undecided, and the table describes a constructed cohort rather than today's biopsy.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table.female.36",
          "prototypeDemographics": {
            "ageYears": 36,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 36-year-old woman, has a suspicious thyroid nodule meeting biopsy criteria, with needle sampling planned. An study offers a new screening blood test and a separate validation table. The patient asks, 'Among the people with a positive result, how many actually had cancer?' Study enrollment remains undecided, and the table describes a constructed cohort rather than today's biopsy."
        },
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table.male.36",
          "prototypeDemographics": {
            "ageYears": 36,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 36-year-old man, has a suspicious thyroid nodule meeting biopsy criteria, with needle sampling planned. An study offers a new screening blood test and a separate validation table. The patient asks, 'Among the people with a positive result, how many actually had cancer?' Study enrollment remains undecided, and the table describes a constructed cohort rather than today's biopsy."
        },
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table.female.72",
          "prototypeDemographics": {
            "ageYears": 72,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 72-year-old woman, has a suspicious thyroid nodule meeting biopsy criteria, with needle sampling planned. An study offers a new screening blood test and a separate validation table. The patient asks, 'Among the people with a positive result, how many actually had cancer?' Study enrollment remains undecided, and the table describes a constructed cohort rather than today's biopsy."
        },
        {
          "id": "profile.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table.male.72",
          "prototypeDemographics": {
            "ageYears": 72,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 72-year-old man, has a suspicious thyroid nodule meeting biopsy criteria, with needle sampling planned. An study offers a new screening blood test and a separate validation table. The patient asks, 'Among the people with a positive result, how many actually had cancer?' Study enrollment remains undecided, and the table describes a constructed cohort rather than today's biopsy."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
        "Design, Conduct, and Analyze Field Studies",
        "Analyzing and Interpreting Data",
        "Thyroid Nodules"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table.1",
          "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v3",
          "primaryConceptId": "concept.statistics-ethics.predictive-value-prevalence",
          "stem": "Among positive results in the separate constructed validation cohort, what is the new investigational breast-cancer blood test's positive predictive value?",
          "answerChoices": [
            {
              "id": "correct_ppv-table",
              "label": "80%",
              "isCorrect": true,
              "rationale": "Start with all positive screens: 40 + 10 = 50. Forty had the condition, so positive predictive value is 40/50 = 80%.",
              "serviceRequest": null
            },
            {
              "id": "d1_ppv-table",
              "label": "75%",
              "isCorrect": false,
              "rationale": "The calculation 30/(10 + 30) = 75% uses the condition-absent row. It answers a specificity question, not the positive-screen question asked.",
              "serviceRequest": null
            },
            {
              "id": "d2_ppv-table",
              "label": "20%",
              "isCorrect": false,
              "rationale": "The calculation 10/(40 + 10) = 20% is the false-positive share among positives. The requested predictive value counts true positives instead.",
              "serviceRequest": null
            },
            {
              "id": "d3_ppv-table",
              "label": "67%",
              "isCorrect": false,
              "rationale": "The calculation 40/(40 + 20) is about 67%. It begins with people who have the condition and therefore calculates sensitivity.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Read the positive-screen column: 40 true positives and 10 false positives. Positive predictive value is 40/50 = 80% for these practice data.",
          "teachingPoint": "Positive predictive value asks, of all positive results, how many were true positives? Its denominator includes true and false positives. Here 40 of 50 positives had the condition, giving 80%. Sensitivity instead starts with people known to have the condition. Remember which group the question starts with before choosing a row or column.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational thyroid-cancer blood test: invented practice counts from a separate validation cohort. Cells count people; reference classification is treated as correct. Not real test performance or a personal disease probability.",
            "columnHeaders": [
              "New blood test positive",
              "New blood test negative"
            ],
            "rowHeaders": [
              "Thyroid cancer present by reference",
              "Thyroid cancer absent by reference"
            ],
            "cells": [
              [
                "40",
                "20"
              ],
              [
                "10",
                "30"
              ]
            ]
          },
          "sourceLabels": [
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
            "Design, Conduct, and Analyze Field Studies",
            "Analyzing and Interpreting Data",
            "Thyroid Nodules"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_ppv-table",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Read the positive-screen column: 40 true positives and 10 false positives. Positive predictive value is 40/50 = 80% for these practice data.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "d2_ppv-table",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Read the positive-screen column: 40 true positives and 10 false positives. Positive predictive value is 40/50 = 80% for these practice data.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "d3_ppv-table",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Read the positive-screen column: 40 true positives and 10 false positives. Positive predictive value is 40/50 = 80% for these practice data.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed",
      "displayName": "Relate positive predictive value to prevalence and Distinguish risk ratio and odds ratio",
      "patientPresentationVariantId": "presentation.flags3.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed.20261107",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "Nathan Brooks",
      "prototypeDemographics": {
        "ageYears": 54,
        "sexLabel": "Male"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Positive screening result",
      "presentation": "{patientName}, a 54-year-old man, attends the preoperative clinic to discuss a positive nasal MRSA screening result.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.flags3.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed.20261107",
          "prototypeDemographics": {
            "ageYears": 54,
            "sexLabel": "Male"
          },
          "chiefComplaint": "Positive screening result",
          "presentation": "{patientName}, a 54-year-old man, attends the preoperative clinic to discuss a positive nasal MRSA screening result."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed.1",
          "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v4.r1",
          "primaryConceptId": "concept.statistics-ethics.predictive-value-prevalence",
          "stem": "For a positive screen such as {patientName}'s, what percentage in this audit had MRSA detected by reference culture?",
          "answerChoices": [
            {
              "id": "choice.flags3.20261107.f3-01.key",
              "label": "About 30%",
              "isCorrect": true,
              "rationale": "The relevant group is all positive screens: 40 with MRSA detected and 95 without it. Thus 40/135 is about 30%.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags3.20261107.f3-01.d1",
              "label": "About 70%",
              "isCorrect": false,
              "rationale": "This is 95/135, the reference-negative share of positive screens. It reverses which reference outcome the question asks about.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags3.20261107.f3-01.d2",
              "label": "About 80%",
              "isCorrect": false,
              "rationale": "This is 40/50, the sensitivity within reference-positive patients. The patient starts with a positive screen, so that is the wrong denominator.",
              "serviceRequest": null
            },
            {
              "id": "choice.flags3.20261107.f3-01.d3",
              "label": "About 90%",
              "isCorrect": false,
              "rationale": "This is 855/950, the specificity within reference-negative patients. It does not estimate reference positivity after a positive screen.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Start with the positive-screen row, then distinguish the two reference outcomes. Forty of the 135 positive screens have MRSA detected by culture, giving about 30%. Sensitivity and specificity use reference-status denominators instead; about 70% here is the reference-negative share of positive screens. These original constructed counts do not describe real MRSA assay performance or diagnose infection.",
          "teachingPoint": "Start with the positive-screen row, then distinguish the two reference outcomes. Forty of the 135 positive screens have MRSA detected by culture, giving about 30%. Sensitivity and specificity use reference-status denominators instead; about 70% here is the reference-negative share of positive screens. These original constructed counts do not describe real MRSA assay performance or diagnose infection.",
          "exhibit": {
            "kind": "table",
            "caption": "Constructed preoperative screening audit. All consecutive patients received both tests.",
            "columnHeaders": [
              "Reference culture: MRSA detected",
              "Reference culture: MRSA not detected"
            ],
            "rowHeaders": [
              "Screen positive",
              "Screen negative"
            ],
            "cells": [
              [
                "40",
                "95"
              ],
              [
                "10",
                "855"
              ]
            ]
          },
          "sourceLabels": [
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.flags3.20261107.f3-01.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the interpretation before continuing.",
              "clinicalRationale": "This is 95/135, the reference-negative share of positive screens. It reverses which reference outcome the question asks about.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers"
              ]
            },
            {
              "answerChoiceId": "choice.flags3.20261107.f3-01.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the interpretation before continuing.",
              "clinicalRationale": "This is 40/50, the sensitivity within reference-positive patients. The patient starts with a positive screen, so that is the wrong denominator.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers"
              ]
            },
            {
              "answerChoiceId": "choice.flags3.20261107.f3-01.d3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the interpretation before continuing.",
              "clinicalRationale": "This is 855/950, the specificity within reference-negative patients. It does not estimate reference positivity after a positive screen.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Start with the positive-screen row, then distinguish the two reference outcomes. Forty of the 135 positive screens have MRSA detected by culture, giving about 30%. Sensitivity and specificity use reference-status denominators instead; about 70% here is the reference-negative share of positive screens. These original constructed counts do not describe real MRSA assay performance or diagnose infection."
    },
    {
      "id": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-cohort-risk",
      "displayName": "Relate positive predictive value to prevalence and Distinguish risk ratio and odds ratio",
      "patientPresentationVariantId": "presentation.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-cohort-risk",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "acute cholecystitis study",
      "presentation": "{patientName}, the biliary journal-club lead, reviews a new dissection instrument for acute cholecystitis operations. The observational study reports surgical-site infection within thirty days. Its sponsor requests a balanced account: equal space for the data and the company's response to the data. The report supplies risks in exposed and unexposed groups, and the team is reviewing the comparison.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
        "Design, Conduct, and Analyze Field Studies",
        "Analyzing and Interpreting Data",
        "WSES acute calculous cholecystitis guideline"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-cohort-risk.1",
          "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v1",
          "primaryConceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
          "stem": "What risk ratio compares exposed with unexposed participants for the clinical outcome in the constructed cohort?",
          "answerChoices": [
            {
              "id": "correct_cohort-risk",
              "label": "Risk ratio of 2.0",
              "isCorrect": true,
              "rationale": "Divide exposed risk by unexposed risk: 0.20/0.10 = 2.0. The inputs are probabilities, so the result is a risk ratio.",
              "serviceRequest": null
            },
            {
              "id": "d1_cohort-risk",
              "label": "Odds ratio of 2.0",
              "isCorrect": false,
              "rationale": "The quotient 0.20/0.10 compares risks, not odds. Calling that number an odds ratio changes the scale without doing an odds calculation.",
              "serviceRequest": null
            },
            {
              "id": "d2_cohort-risk",
              "label": "Risk ratio of 0.5",
              "isCorrect": false,
              "rationale": "The value 0.5 comes from 0.10/0.20, reversing the requested exposed-versus-unexposed direction.",
              "serviceRequest": null
            },
            {
              "id": "d3_cohort-risk",
              "label": "Odds ratio of 0.5",
              "isCorrect": false,
              "rationale": "This both reverses the comparison and assigns an odds label to a calculation of probabilities. Neither change preserves the requested estimate.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Dividing the exposed risk by the unexposed risk gives 0.20/0.10 = 2.0, a risk ratio. That calculation does not become an odds ratio by relabeling it.",
          "teachingPoint": "Risk is a probability; a risk ratio divides one group's probability by the comparator's. Here 20%/10% = 2.0 for exposed versus unexposed over 30 days. An odds ratio compares odds instead. Remember both the scale and direction: reversing the groups gives a reciprocal, while changing the label changes the claimed measure.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Unnamed investigational gallbladder dissection instrument study: invented thirty-day SSI estimates for practice. These describe the constructed study, not real efficacy or personal risk.",
            "items": [
              {
                "label": "Exposed group risk",
                "value": "20%"
              },
              {
                "label": "Unexposed group risk",
                "value": "10%"
              }
            ]
          },
          "sourceLabels": [
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
            "Design, Conduct, and Analyze Field Studies",
            "Analyzing and Interpreting Data",
            "WSES acute calculous cholecystitis guideline"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_cohort-risk",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Dividing the exposed risk by the unexposed risk gives 0.20/0.10 = 2.0, a risk ratio. That calculation does not become an odds ratio by relabeling it.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "d2_cohort-risk",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Dividing the exposed risk by the unexposed risk gives 0.20/0.10 = 2.0, a risk ratio. That calculation does not become an odds ratio by relabeling it.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "d3_cohort-risk",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Dividing the exposed risk by the unexposed risk gives 0.20/0.10 = 2.0, a risk ratio. That calculation does not become an odds ratio by relabeling it.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-case-control-or",
      "displayName": "Relate positive predictive value to prevalence and Distinguish risk ratio and odds ratio",
      "patientPresentationVariantId": "presentation.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-case-control-or",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "gastric adenocarcinoma study",
      "presentation": "{patientName}, the upper-GI research lead, reviews a new anastomosis technique used during resection of gastric adenocarcinoma. Investigators selected people with a postoperative leak and controls without a leak, then reviewed previous technique exposure. The table gives exposure counts for those selected groups. The report does not supply leak risks in the entire surgical population under study.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
        "Design, Conduct, and Analyze Field Studies",
        "Analyzing and Interpreting Data",
        "Korean Practice Guidelines for Gastric Cancer 2024: An Evidence-based, Multidisciplinary Approach",
        "Japanese Gastric Cancer Treatment Guidelines 2021",
        "Randomized Controlled Trial to Evaluate Splenectomy in Total Gastrectomy for Proximal Gastric Carcinoma"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-case-control-or.1",
          "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v2",
          "primaryConceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
          "stem": "Which association measure can be calculated directly from the case-control exposure table for postoperative leak?",
          "answerChoices": [
            {
              "id": "correct_case-control-or",
              "label": "Exposure odds ratio of 1.8",
              "isCorrect": true,
              "rationale": "Compare exposure odds in cases and controls: (18/12)/(10/12) = 1.8. This gives an exposure odds ratio for the supplied outcome-selected sample.",
              "serviceRequest": null
            },
            {
              "id": "d1_case-control-or",
              "label": "Exposure risk ratio of 1.8",
              "isCorrect": false,
              "rationale": "The sampling plan selects cases and controls by outcome. Their totals do not provide the population risks needed to justify a risk-ratio label.",
              "serviceRequest": null
            },
            {
              "id": "d2_case-control-or",
              "label": "Exposure odds ratio of 0.56",
              "isCorrect": false,
              "rationale": "About 0.56 is the reciprocal of 1.8. It describes controls versus cases, reversing the requested exposure-odds comparison.",
              "serviceRequest": null
            },
            {
              "id": "d3_case-control-or",
              "label": "Exposure risk ratio of 0.56",
              "isCorrect": false,
              "rationale": "This reverses the direction and uses a risk scale unsupported by the outcome-selected sampling totals.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The exposure odds ratio is (18/12)/(10/12) = 1.8 for cases versus controls. Population risks are not supplied, so a risk-ratio label is unsupported.",
          "teachingPoint": "In this outcome-selected table, compare exposure odds in cases with exposure odds in controls: (18/12)/(10/12) = 1.8. That is an exposure odds ratio. The sampled case and control totals do not supply population event risks. Remember what the design selected before deciding whether a risk-ratio label is justified.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational gastric anastomosis technique study: invented practice counts of people selected by thirty-day leak status. Cells count prior technique exposure; population leak risks are not supplied.",
            "columnHeaders": [
              "Exposed",
              "Unexposed"
            ],
            "rowHeaders": [
              "Cases",
              "Controls"
            ],
            "cells": [
              [
                "18",
                "12"
              ],
              [
                "10",
                "12"
              ]
            ]
          },
          "sourceLabels": [
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
            "Design, Conduct, and Analyze Field Studies",
            "Analyzing and Interpreting Data",
            "Korean Practice Guidelines for Gastric Cancer 2024: An Evidence-based, Multidisciplinary Approach",
            "Japanese Gastric Cancer Treatment Guidelines 2021",
            "Randomized Controlled Trial to Evaluate Splenectomy in Total Gastrectomy for Proximal Gastric Carcinoma"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_case-control-or",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The exposure odds ratio is (18/12)/(10/12) = 1.8 for cases versus controls. Population risks are not supplied, so a risk-ratio label is unsupported.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "d2_case-control-or",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The exposure odds ratio is (18/12)/(10/12) = 1.8 for cases versus controls. Population risks are not supplied, so a risk-ratio label is unsupported.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "d3_case-control-or",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The exposure odds ratio is (18/12)/(10/12) = 1.8 for cases versus controls. Population risks are not supplied, so a risk-ratio label is unsupported.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds",
      "displayName": "Relate positive predictive value to prevalence and Distinguish risk ratio and odds ratio",
      "patientPresentationVariantId": "presentation.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "Logistic model discussion",
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds",
        "patientPresentationVariantId": "presentation.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Logistic model discussion",
        "revisedPresentation": "{patientName} leads an employee study discussion. A fitted logistic model compares intervention with control at the same covariate profile. At that profile the control event risk is 40%; the adjusted intervention-versus-control odds ratio is 0.60.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "presentation": "{patientName} leads an employee study discussion. A fitted logistic model compares intervention with control at the same covariate profile. At that profile the control event risk is 40%; the adjusted intervention-versus-control odds ratio is 0.60.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
        "Design, Conduct, and Analyze Field Studies",
        "Analyzing and Interpreting Data",
        "Merkel Cell Carcinoma Treatment (PDQ), Health Professional Version"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds.1",
          "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v3.r3",
          "primaryConceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
          "stem": "What intervention event risk does that model predict for the same profile?",
          "answerChoices": [
            {
              "id": "correct_adjusted-odds",
              "label": "About 29% event risk",
              "isCorrect": true,
              "rationale": "Converts reference risk to odds, multiplies by the conditional odds ratio, then converts predicted odds back to risk.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102a.b28.d1",
              "label": "About 24% event risk",
              "isCorrect": false,
              "rationale": "Multiplies the baseline risk directly by the odds ratio as though it were a risk ratio.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102a.b28.d2",
              "label": "About 19% event risk",
              "isCorrect": false,
              "rationale": "Treats the reference probability as baseline odds before applying the odds ratio and converting back.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Reference odds are 0.40/0.60. Multiplying by 0.60 gives predicted odds 0.40, hence risk 0.40/1.40, about 29%. This is a conditional model prediction for the stated profile, not a marginal causal risk estimate.",
          "teachingPoint": "Reference odds are 0.40/0.60. Multiplying by 0.60 gives predicted odds 0.40, hence risk 0.40/1.40, about 29%. This is a conditional model prediction for the stated profile, not a marginal causal risk estimate.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed model inputs; the reference risk is fixed for this calculation.",
            "items": [
              {
                "label": "Control event risk",
                "value": "40%"
              },
              {
                "label": "Conditional odds ratio",
                "value": "0.60"
              }
            ]
          },
          "sourceLabels": [
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
            "Design, Conduct, and Analyze Field Studies",
            "Analyzing and Interpreting Data",
            "Merkel Cell Carcinoma Treatment (PDQ), Health Professional Version",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.qq20261102a.b28.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “About 24% event risk”.",
              "clinicalRationale": "Multiplies the baseline risk directly by the odds ratio as though it were a risk ratio.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "choice.qq20261102a.b28.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “About 19% event risk”.",
              "clinicalRationale": "Treats the reference probability as baseline odds before applying the odds ratio and converting back.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical",
      "displayName": "Relate positive predictive value to prevalence and Distinguish risk ratio and odds ratio",
      "patientPresentationVariantId": "presentation.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "marginal ulcer study",
      "presentation": "{patientName}, the bariatric journal-club lead, reviews a fictional study of ulcer recurrence after gastric bypass.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Principles of Epidemiology: Lesson 5, Appendix A",
        "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
        "Design, Conduct, and Analyze Field Studies",
        "Analyzing and Interpreting Data",
        "ASMBS marginal-ulcer treatment review"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical.1",
          "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v4.r3",
          "primaryConceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
          "stem": "Which measure is calculated by the expression in this ulcer-recurrence report?",
          "answerChoices": [
            {
              "id": "correct_rare-not-identical",
              "label": "Odds ratio",
              "isCorrect": true,
              "rationale": "Recognizes the ratio of two odds, rather than a direct comparison of probabilities.",
              "serviceRequest": null
            },
            {
              "id": "d1_rare-not-identical",
              "label": "Risk ratio",
              "isCorrect": false,
              "rationale": "Treats division of odds as though it were division of the probabilities themselves.",
              "serviceRequest": null
            },
            {
              "id": "d3_rare-not-identical",
              "label": "Risk difference",
              "isCorrect": false,
              "rationale": "Confuses a relative comparison with subtraction of the two probabilities.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Each p/(1-p) term is an odds. Dividing the two terms produces an odds ratio. A risk ratio divides the probabilities themselves, and a risk difference subtracts them. Similarity in selected settings does not make these measures interchangeable.",
          "teachingPoint": "Each p/(1-p) term is an odds. Dividing the two terms produces an odds ratio. A risk ratio divides the probabilities themselves, and a risk difference subtracts them. Similarity in selected settings does not make these measures interchangeable.",
          "exhibit": {
            "kind": "abstract",
            "title": "Fictional comparison expression",
            "body": "Let p_E denote recurrence probability in the exposed group and p_C recurrence probability in the comparator group. The reported expression is [p_E / (1 - p_E)] / [p_C / (1 - p_C)]."
          },
          "sourceLabels": [
            "Principles of Epidemiology: Lesson 5, Appendix A",
            "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
            "Design, Conduct, and Analyze Field Studies",
            "Analyzing and Interpreting Data",
            "ASMBS marginal-ulcer treatment review",
            "Clinically approved: Melissa Rowland (clinical sign-off) on 2026-10-29 (question-authoring.2026-10-28.v2)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_rare-not-identical",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Risk ratio”.",
              "clinicalRationale": "Treats division of odds as though it were division of the probabilities themselves.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            },
            {
              "answerChoiceId": "d3_rare-not-identical",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Risk difference”.",
              "clinicalRationale": "Confuses a relative comparison with subtraction of the two probabilities.",
              "sourceLabels": [
                "Principles of Epidemiology: Lesson 5, Appendix A",
                "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
                "Design, Conduct, and Analyze Field Studies",
                "Analyzing and Interpreting Data"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.arr-nnt-p-value.a-arr-ten",
      "displayName": "Calculate absolute risk reduction and NNT and Interpret a p-value",
      "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.a-arr-ten",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 61,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Surgical-study question",
      "presentation": "{patientName}, a 61-year-old woman, has biopsy-confirmed localized colon cancer and is discussing resection. An optional trial tests a new monoclonal antibody, reporting recurrence over two years. Its brochure announces 'a major improvement' in a typeface larger than the results table. The patient asks what absolute benefit the study showed and how many participants needed treatment for one fewer recurrence.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-ten.female.61",
          "prototypeDemographics": {
            "ageYears": 61,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 61-year-old woman, has biopsy-confirmed localized colon cancer and is discussing resection. An optional trial tests a new monoclonal antibody, reporting recurrence over two years. Its brochure announces 'a major improvement' in a typeface larger than the results table. The patient asks what absolute benefit the study showed and how many participants needed treatment for one fewer recurrence."
        },
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-ten.male.61",
          "prototypeDemographics": {
            "ageYears": 61,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 61-year-old man, has biopsy-confirmed localized colon cancer and is discussing resection. An optional trial tests a new monoclonal antibody, reporting recurrence over two years. Its brochure announces 'a major improvement' in a typeface larger than the results table. The patient asks what absolute benefit the study showed and how many participants needed treatment for one fewer recurrence."
        },
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-ten.female.34",
          "prototypeDemographics": {
            "ageYears": 34,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 34-year-old woman, has biopsy-confirmed localized colon cancer and is discussing resection. An optional trial tests a new monoclonal antibody, reporting recurrence over two years. Its brochure announces 'a major improvement' in a typeface larger than the results table. The patient asks what absolute benefit the study showed and how many participants needed treatment for one fewer recurrence."
        },
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-ten.male.34",
          "prototypeDemographics": {
            "ageYears": 34,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 34-year-old man, has biopsy-confirmed localized colon cancer and is discussing resection. An optional trial tests a new monoclonal antibody, reporting recurrence over two years. Its brochure announces 'a major improvement' in a typeface larger than the results table. The patient asks what absolute benefit the study showed and how many participants needed treatment for one fewer recurrence."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Chapter 15: Interpreting results and drawing conclusions",
        "Critical values and p values",
        "Screening Tests to Detect Colorectal Cancer and Polyps",
        "ASCRS Clinical Practice Guidelines for the Management of Colon Cancer",
        "Colon Cancer Treatment (PDQ), Health Professional Version"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.arr-nnt-p-value.a-arr-ten.1",
          "questionVariantId": "question.statistics-ethics.arr-nnt.v1",
          "primaryConceptId": "concept.statistics-ethics.arr-nnt",
          "stem": "For colon-cancer recurrence over two years in the constructed trial, what ARR and NNT describe the new unnamed intervention versus control?",
          "answerChoices": [
            {
              "id": "correct_arr-ten",
              "label": "ARR 10 percentage points; NNT 10 over two years",
              "isCorrect": true,
              "rationale": "The practice risks are 20/100 and 10/100. Subtracting gives 0.10; 1/0.10 = 10 for the specified outcome over two years.",
              "serviceRequest": null
            },
            {
              "id": "d1_arr-ten",
              "label": "ARR 50 percentage points; NNT 2 over two years",
              "isCorrect": false,
              "rationale": "The outcome risk halves relative to its 20% starting value, but falls by 10 percentage points, not 50. The relative wording does not supply this ARR or NNT.",
              "serviceRequest": null
            },
            {
              "id": "d2_arr-ten",
              "label": "ARR 10 percentage points; NNT 100 over two years",
              "isCorrect": false,
              "rationale": "The absolute difference is right, but its reciprocal uses the proportion 0.10: 1/0.10 = 10, not 100.",
              "serviceRequest": null
            },
            {
              "id": "d3_arr-ten",
              "label": "ARR 5 percentage points; NNT 20 over two years",
              "isCorrect": false,
              "rationale": "An NNT of 20 would correspond to an absolute difference of 0.05. These practice risks differ by 0.10 instead.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The practice risks are 20/100 and 10/100. Their difference is 0.10, giving ARR 10 percentage points and NNT 10 for the specified two-year outcome.",
          "teachingPoint": "Calculate each group's risk first, then subtract intervention risk from comparator risk. Here 20% minus 10% is 10 percentage points, so NNT is 1/0.10 = 10 over two years. Half the starting risk and a 10-point absolute drop describe the same practice numbers; keep the outcome, comparator, and period attached.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational monoclonal antibody trial: invented practice counts of colon-cancer recurrence within two years. Cells count recurrences and people followed. Follow-up is complete; not real efficacy or personal risk.",
            "columnHeaders": [
              "Recurrence within two years",
              "People followed"
            ],
            "rowHeaders": [
              "Control arm",
              "New unnamed intervention"
            ],
            "cells": [
              [
                "20",
                "100"
              ],
              [
                "10",
                "100"
              ]
            ]
          },
          "sourceLabels": [
            "Chapter 15: Interpreting results and drawing conclusions",
            "Critical values and p values",
            "Screening Tests to Detect Colorectal Cancer and Polyps",
            "ASCRS Clinical Practice Guidelines for the Management of Colon Cancer",
            "Colon Cancer Treatment (PDQ), Health Professional Version"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_arr-ten",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The practice risks are 20/100 and 10/100. Their difference is 0.10, giving ARR 10 percentage points and NNT 10 for the specified two-year outcome.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            },
            {
              "answerChoiceId": "d2_arr-ten",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The practice risks are 20/100 and 10/100. Their difference is 0.10, giving ARR 10 percentage points and NNT 10 for the specified two-year outcome.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            },
            {
              "answerChoiceId": "d3_arr-ten",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The practice risks are 20/100 and 10/100. Their difference is 0.10, giving ARR 10 percentage points and NNT 10 for the specified two-year outcome.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.arr-nnt-p-value.a-arr-five",
      "displayName": "Calculate absolute risk reduction and NNT and Interpret a p-value",
      "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.a-arr-five",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 38,
        "sexLabel": "Male"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Research-results discussion",
      "presentation": "{patientName}, a 38-year-old man, has a resected low-risk cutaneous SCC and asks about an optional new topical-agent trial reporting recurrence over three years. The investigator calls the calculation obvious, then opens a spreadsheet containing twelve hidden tabs. The arms have different totals. The patient wants the absolute benefit and treatment number for the stated follow-up period.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-five.male.38",
          "prototypeDemographics": {
            "ageYears": 38,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 38-year-old man, has a resected low-risk cutaneous SCC and asks about an optional new topical-agent trial reporting recurrence over three years. The investigator calls the calculation obvious, then opens a spreadsheet containing twelve hidden tabs. The arms have different totals. The patient wants the absolute benefit and treatment number for the stated follow-up period."
        },
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-five.female.38",
          "prototypeDemographics": {
            "ageYears": 38,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 38-year-old woman, has a resected low-risk cutaneous SCC and asks about an optional new topical-agent trial reporting recurrence over three years. The investigator calls the calculation obvious, then opens a spreadsheet containing twelve hidden tabs. The arms have different totals. The patient wants the absolute benefit and treatment number for the stated follow-up period."
        },
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-five.male.70",
          "prototypeDemographics": {
            "ageYears": 70,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 70-year-old man, has a resected low-risk cutaneous SCC and asks about an optional new topical-agent trial reporting recurrence over three years. The investigator calls the calculation obvious, then opens a spreadsheet containing twelve hidden tabs. The arms have different totals. The patient wants the absolute benefit and treatment number for the stated follow-up period."
        },
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-five.female.70",
          "prototypeDemographics": {
            "ageYears": 70,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 70-year-old woman, has a resected low-risk cutaneous SCC and asks about an optional new topical-agent trial reporting recurrence over three years. The investigator calls the calculation obvious, then opens a spreadsheet containing twelve hidden tabs. The arms have different totals. The patient wants the absolute benefit and treatment number for the stated follow-up period."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Chapter 15: Interpreting results and drawing conclusions",
        "Critical values and p values",
        "Guidelines of care for the management of cutaneous squamous cell carcinoma",
        "Choosing Wisely recommendations"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.arr-nnt-p-value.a-arr-five.1",
          "questionVariantId": "question.statistics-ethics.arr-nnt.v2",
          "primaryConceptId": "concept.statistics-ethics.arr-nnt",
          "stem": "For cutaneous-SCC recurrence over three years in the constructed trial, what ARR and NNT describe the new unnamed intervention versus control?",
          "answerChoices": [
            {
              "id": "correct_arr-five",
              "label": "ARR 5 percentage points; NNT 20 over three years",
              "isCorrect": true,
              "rationale": "First divide within each group: 30/200 = 0.15 and 10/100 = 0.10. ARR is 0.05 and its reciprocal is NNT 20 over three years.",
              "serviceRequest": null
            },
            {
              "id": "d1_arr-five",
              "label": "ARR 20 percentage points; NNT 5 over three years",
              "isCorrect": false,
              "rationale": "Subtracting 30 and 10 events ignores that the groups contain 200 and 100 people. Risks, rather than raw counts, must be subtracted.",
              "serviceRequest": null
            },
            {
              "id": "d2_arr-five",
              "label": "ARR 33 percentage points; NNT 3 over three years",
              "isCorrect": false,
              "rationale": "About 33% describes the relative reduction from 15% to 10%. The absolute drop is five percentage points, giving NNT 20.",
              "serviceRequest": null
            },
            {
              "id": "d3_arr-five",
              "label": "ARR 10 percentage points; NNT 10 over three years",
              "isCorrect": false,
              "rationale": "The comparator risk is 30/200 = 15%, not 20%. Using the actual denominator gives a five-point difference rather than ten.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "First calculate risks: 30/200 = 0.15 and 10/100 = 0.10. ARR is 0.05, or five percentage points, and three-year NNT is 20.",
          "teachingPoint": "Unequal group sizes make raw event-count subtraction misleading. Convert each count to a risk: 30/200 = 15% and 10/100 = 10%. Their absolute difference is five percentage points, so NNT is 1/0.05 = 20 over three years. Remember: divide within groups before subtracting between groups, retaining the specified recurrence outcome and comparator.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational topical agent trial: invented practice counts of cutaneous-SCC recurrence within three years. Cells count recurrences and people followed. Follow-up is complete; not real efficacy or personal risk.",
            "columnHeaders": [
              "Recurrence within three years",
              "People followed"
            ],
            "rowHeaders": [
              "Control arm",
              "New unnamed intervention"
            ],
            "cells": [
              [
                "30",
                "200"
              ],
              [
                "10",
                "100"
              ]
            ]
          },
          "sourceLabels": [
            "Chapter 15: Interpreting results and drawing conclusions",
            "Critical values and p values",
            "Guidelines of care for the management of cutaneous squamous cell carcinoma",
            "Choosing Wisely recommendations"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_arr-five",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "First calculate risks: 30/200 = 0.15 and 10/100 = 0.10. ARR is 0.05, or five percentage points, and three-year NNT is 20.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            },
            {
              "answerChoiceId": "d2_arr-five",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "First calculate risks: 30/200 = 0.15 and 10/100 = 0.10. ARR is 0.05, or five percentage points, and three-year NNT is 20.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            },
            {
              "answerChoiceId": "d3_arr-five",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "First calculate risks: 30/200 = 0.15 and 10/100 = 0.10. ARR is 0.05, or five percentage points, and three-year NNT is 20.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.arr-nnt-p-value.a-arr-twenty",
      "displayName": "Calculate absolute risk reduction and NNT and Interpret a p-value",
      "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.a-arr-twenty",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 47,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Evidence review",
      "presentation": "{patientName}, a 47-year-old woman, has recovered from a primary spontaneous pneumothorax and is discussing recurrence prevention. An optional study tested a new pleural device, reporting recurrence over five years. The patient compares the two trial arms and asks how the absolute benefit translates into the number treated for one fewer recurrence during that stated period.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-twenty.female.47",
          "prototypeDemographics": {
            "ageYears": 47,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 47-year-old woman, has recovered from a primary spontaneous pneumothorax and is discussing recurrence prevention. An optional study tested a new pleural device, reporting recurrence over five years. The patient compares the two trial arms and asks how the absolute benefit translates into the number treated for one fewer recurrence during that stated period."
        },
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-twenty.male.47",
          "prototypeDemographics": {
            "ageYears": 47,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 47-year-old man, has recovered from a primary spontaneous pneumothorax and is discussing recurrence prevention. An optional study tested a new pleural device, reporting recurrence over five years. The patient compares the two trial arms and asks how the absolute benefit translates into the number treated for one fewer recurrence during that stated period."
        },
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-twenty.female.28",
          "prototypeDemographics": {
            "ageYears": 28,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 28-year-old woman, has recovered from a primary spontaneous pneumothorax and is discussing recurrence prevention. An optional study tested a new pleural device, reporting recurrence over five years. The patient compares the two trial arms and asks how the absolute benefit translates into the number treated for one fewer recurrence during that stated period."
        },
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-twenty.male.28",
          "prototypeDemographics": {
            "ageYears": 28,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 28-year-old man, has recovered from a primary spontaneous pneumothorax and is discussing recurrence prevention. An optional study tested a new pleural device, reporting recurrence over five years. The patient compares the two trial arms and asks how the absolute benefit translates into the number treated for one fewer recurrence during that stated period."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Chapter 15: Interpreting results and drawing conclusions",
        "Critical values and p values",
        "Joint ERS/EACTS/ESTS clinical practice guidelines on adults with spontaneous pneumothorax"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.arr-nnt-p-value.a-arr-twenty.1",
          "questionVariantId": "question.statistics-ethics.arr-nnt.v3",
          "primaryConceptId": "concept.statistics-ethics.arr-nnt",
          "stem": "For pneumothorax recurrence over five years in the constructed trial, what ARR and NNT describe the new unnamed intervention versus control?",
          "answerChoices": [
            {
              "id": "correct_arr-twenty",
              "label": "ARR 20 percentage points; NNT 5 over five years",
              "isCorrect": true,
              "rationale": "Subtract 10/100 from 30/100 to get 0.20. The reciprocal is 1/0.20 = 5 for the same comparator and five-year outcome.",
              "serviceRequest": null
            },
            {
              "id": "d1_arr-twenty",
              "label": "ARR 67 percentage points; NNT 2 over five years",
              "isCorrect": false,
              "rationale": "The risk falls by about two thirds relative to its starting value, but the absolute drop is 20 percentage points, not 67.",
              "serviceRequest": null
            },
            {
              "id": "d2_arr-twenty",
              "label": "ARR 20 percentage points; NNT 50 over five years",
              "isCorrect": false,
              "rationale": "The ARR is correct, but 1/0.20 is 5. An NNT of 50 is a reciprocal calculation error.",
              "serviceRequest": null
            },
            {
              "id": "d3_arr-twenty",
              "label": "ARR 10 percentage points; NNT 10 over five years",
              "isCorrect": false,
              "rationale": "The two practice risks are 30% and 10%, a 20-point difference. A ten-point reduction would describe different inputs.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The practice outcome risks differ by 0.30 - 0.10 = 0.20. ARR is 20 percentage points and NNT is 5 over the stated five-year period.",
          "teachingPoint": "Absolute reduction subtracts risks on the same scale: 30% minus 10% is 20 percentage points. Taking the reciprocal of 0.20 gives NNT 5 for this comparator and outcome over five years. The relative reduction uses a different starting denominator. Remember that percentage points, percentages, and proportions are not interchangeable labels.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational pleural device trial: invented practice counts of pneumothorax recurrence within five years. Cells count recurrences and people followed. Follow-up is complete; not real efficacy or personal risk.",
            "columnHeaders": [
              "Recurrence within five years",
              "People followed"
            ],
            "rowHeaders": [
              "Control arm",
              "New unnamed intervention"
            ],
            "cells": [
              [
                "30",
                "100"
              ],
              [
                "10",
                "100"
              ]
            ]
          },
          "sourceLabels": [
            "Chapter 15: Interpreting results and drawing conclusions",
            "Critical values and p values",
            "Joint ERS/EACTS/ESTS clinical practice guidelines on adults with spontaneous pneumothorax"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_arr-twenty",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The practice outcome risks differ by 0.30 - 0.10 = 0.20. ARR is 20 percentage points and NNT is 5 over the stated five-year period.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            },
            {
              "answerChoiceId": "d2_arr-twenty",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The practice outcome risks differ by 0.30 - 0.10 = 0.20. ARR is 20 percentage points and NNT is 5 over the stated five-year period.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            },
            {
              "answerChoiceId": "d3_arr-twenty",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The practice outcome risks differ by 0.30 - 0.10 = 0.20. ARR is 20 percentage points and NNT is 5 over the stated five-year period.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.arr-nnt-p-value.a-arr-six",
      "displayName": "Calculate absolute risk reduction and NNT and Interpret a p-value",
      "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.a-arr-six",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 73,
        "sexLabel": "Male"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Study interpretation",
      "presentation": "{patientName}, a 73-year-old man, has a resected gastric GIST and asks about an optional trial of a new biologic reporting recurrence over two years. The patient brings a calculator: 'They called this simple arithmetic, so I assumed they'd brought someone to explain it.' The discussion concerns absolute benefit and the treatment number calculated from the trial's results.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-six.male.73",
          "prototypeDemographics": {
            "ageYears": 73,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 73-year-old man, has a resected gastric GIST and asks about an optional trial of a new biologic reporting recurrence over two years. The patient brings a calculator: 'They called this simple arithmetic, so I assumed they'd brought someone to explain it.' The discussion concerns absolute benefit and the treatment number calculated from the trial's results."
        },
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-six.female.73",
          "prototypeDemographics": {
            "ageYears": 73,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 73-year-old woman, has a resected gastric GIST and asks about an optional trial of a new biologic reporting recurrence over two years. The patient brings a calculator: 'They called this simple arithmetic, so I assumed they'd brought someone to explain it.' The discussion concerns absolute benefit and the treatment number calculated from the trial's results."
        },
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-six.male.56",
          "prototypeDemographics": {
            "ageYears": 56,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 56-year-old man, has a resected gastric GIST and asks about an optional trial of a new biologic reporting recurrence over two years. The patient brings a calculator: 'They called this simple arithmetic, so I assumed they'd brought someone to explain it.' The discussion concerns absolute benefit and the treatment number calculated from the trial's results."
        },
        {
          "id": "profile.gs028se.arr-nnt-p-value.a-arr-six.female.56",
          "prototypeDemographics": {
            "ageYears": 56,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 56-year-old woman, has a resected gastric GIST and asks about an optional trial of a new biologic reporting recurrence over two years. The patient brings a calculator: 'They called this simple arithmetic, so I assumed they'd brought someone to explain it.' The discussion concerns absolute benefit and the treatment number calculated from the trial's results."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Chapter 15: Interpreting results and drawing conclusions",
        "Critical values and p values",
        "2023 GEIS Guidelines for gastrointestinal stromal tumors",
        "Gastrointestinal Stromal Tumors Treatment (PDQ®), Health Professional Version"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.arr-nnt-p-value.a-arr-six.1",
          "questionVariantId": "question.statistics-ethics.arr-nnt.v4",
          "primaryConceptId": "concept.statistics-ethics.arr-nnt",
          "stem": "For gastric-GIST recurrence over two years in the constructed trial, what ARR and NNT describe the new unnamed intervention versus control?",
          "answerChoices": [
            {
              "id": "correct_arr-six",
              "label": "ARR 6 percentage points; NNT 17 over two years",
              "isCorrect": true,
              "rationale": "The absolute difference is 0.20 - 0.14 = 0.06. Its reciprocal is about 16.67, conventionally rounded upward to NNT 17 over two years.",
              "serviceRequest": null
            },
            {
              "id": "d1_arr-six",
              "label": "ARR 6 percentage points; NNT 16 over two years",
              "isCorrect": false,
              "rationale": "The six-point difference is right, but conventionally rounding NNT upward gives 17. Rounding down to 16 changes that reporting convention.",
              "serviceRequest": null
            },
            {
              "id": "d2_arr-six",
              "label": "ARR 30 percentage points; NNT 4 over two years",
              "isCorrect": false,
              "rationale": "Thirty percent is the relative reduction from the 20% comparator risk. The absolute reduction is six percentage points, not thirty.",
              "serviceRequest": null
            },
            {
              "id": "d3_arr-six",
              "label": "ARR 14 percentage points; NNT 8 over two years",
              "isCorrect": false,
              "rationale": "Fourteen percent is the intervention risk, not the difference between group risks. Subtracting from the comparator gives six percentage points.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "ARR is 0.20 - 0.14 = 0.06. Its reciprocal is about 16.67, conventionally rounded up to NNT 17 for the stated two-year outcome.",
          "teachingPoint": "Subtract the risks before taking a reciprocal: 20% minus 14% is six percentage points, or 0.06. Then 1/0.06 is about 16.67; conventionally round NNT upward to 17. Keep the specified recurrence outcome, comparator, and two-year period with the result. The intervention's 14% risk is not itself the reduction.",
          "exhibit": {
            "kind": "table",
            "caption": "Unnamed investigational biologic trial: invented practice counts of gastric-GIST recurrence within two years. Cells count recurrences and people followed. Follow-up is complete; not real efficacy or personal risk.",
            "columnHeaders": [
              "Recurrence within two years",
              "People followed"
            ],
            "rowHeaders": [
              "Control arm",
              "New unnamed intervention"
            ],
            "cells": [
              [
                "20",
                "100"
              ],
              [
                "14",
                "100"
              ]
            ]
          },
          "sourceLabels": [
            "Chapter 15: Interpreting results and drawing conclusions",
            "Critical values and p values",
            "2023 GEIS Guidelines for gastrointestinal stromal tumors",
            "Gastrointestinal Stromal Tumors Treatment (PDQ®), Health Professional Version"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_arr-six",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "ARR is 0.20 - 0.14 = 0.06. Its reciprocal is about 16.67, conventionally rounded up to NNT 17 for the stated two-year outcome.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            },
            {
              "answerChoiceId": "d2_arr-six",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "ARR is 0.20 - 0.14 = 0.06. Its reciprocal is about 16.67, conventionally rounded up to NNT 17 for the stated two-year outcome.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            },
            {
              "answerChoiceId": "d3_arr-six",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "ARR is 0.20 - 0.14 = 0.06. Its reciprocal is about 16.67, conventionally rounded up to NNT 17 for the stated two-year outcome.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.arr-nnt-p-value.b-p-003",
      "displayName": "Calculate absolute risk reduction and NNT and Interpret a p-value",
      "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-003",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "Colon surgery study",
      "patientPresentationRevision": {
        "id": "ppr.qq20261102b.case.gs028se.arr-nnt-p-value.b-p-003",
        "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-003",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v6",
        "revisedChiefComplaint": "Colon surgery study",
        "revisedPresentation": "{patientName} leads an employee journal-club discussion of a constructed randomized colon surgery comparison. The endpoint is unplanned readmission; a lower event risk is beneficial. The hypothetical protocol tests zero risk difference at two-sided alpha 0.05. It confirms a benefit of at least 4 percentage points only if the entire reported 95% interval reaches at least that reduction; it excludes that target under the interval model if the entire interval falls short of it.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "presentation": "{patientName} leads an employee journal-club discussion of a constructed randomized colon surgery comparison. The endpoint is unplanned readmission; a lower event risk is beneficial. The hypothetical protocol tests zero risk difference at two-sided alpha 0.05. It confirms a benefit of at least 4 percentage points only if the entire reported 95% interval reaches at least that reduction; it excludes that target under the interval model if the entire interval falls short of it.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Chapter 15: Interpreting results and drawing conclusions",
        "Critical values and p values",
        "WSES acute calculous cholecystitis guideline"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.arr-nnt-p-value.b-p-003.1",
          "questionVariantId": "question.statistics-ethics.p-value.v1.r4",
          "primaryConceptId": "concept.statistics-ethics.p-value",
          "stem": "Which paired conclusion should {patientName} report from this study?",
          "answerChoices": [
            {
              "id": "correct_p-003",
              "label": "Zero-effect hypothesis rejected; target benefit unconfirmed",
              "isCorrect": true,
              "rationale": "Separates the pre-specified null test from whether the whole interval supports the protocol's target benefit.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102b.b27.d1",
              "label": "Zero-effect hypothesis rejected; target benefit demonstrated",
              "isCorrect": false,
              "rationale": "Gets the null-test decision right but substitutes statistical significance or the point estimate for the protocol's magnitude criterion.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102b.b27.d2",
              "label": "Zero-effect hypothesis not rejected; target benefit unconfirmed",
              "isCorrect": false,
              "rationale": "Handles the magnitude criterion but misreads the pre-specified null test.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102b.b27.d3",
              "label": "Zero-effect hypothesis not rejected; target benefit demonstrated",
              "isCorrect": false,
              "rationale": "Conflates the null-test and magnitude decisions.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
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
          "sourceLabels": [
            "Chapter 15: Interpreting results and drawing conclusions",
            "Critical values and p values",
            "WSES acute calculous cholecystitis guideline",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.qq20261102b.b27.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Zero-effect hypothesis rejected; target benefit demonstrated”.",
              "clinicalRationale": "Gets the null-test decision right but substitutes statistical significance or the point estimate for the protocol's magnitude criterion.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            },
            {
              "answerChoiceId": "choice.qq20261102b.b27.d3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Zero-effect hypothesis not rejected; target benefit demonstrated”.",
              "clinicalRationale": "Conflates the null-test and magnitude decisions.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            },
            {
              "answerChoiceId": "choice.qq20261102b.b27.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Zero-effect hypothesis not rejected; target benefit unconfirmed”.",
              "clinicalRationale": "Handles the magnitude criterion but misreads the pre-specified null test.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.arr-nnt-p-value.b-p-040",
      "displayName": "Calculate absolute risk reduction and NNT and Interpret a p-value",
      "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-040",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "Thyroid surgery study",
      "patientPresentationRevision": {
        "id": "ppr.qq20261102c.case.gs028se.arr-nnt-p-value.b-p-040",
        "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-040",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v7",
        "revisedChiefComplaint": "Thyroid surgery study",
        "revisedPresentation": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The outcome is unplanned reoperation; a lower risk is beneficial. The hypothetical protocol tests zero risk difference at two-sided alpha 0.05. Its target benefit is a reduction of at least 4 percentage points. It confirms that target only when the entire reported 95% interval supports that reduction, and excludes the target only when the entire interval falls short of it.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "presentation": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The outcome is unplanned reoperation; a lower risk is beneficial. The hypothetical protocol tests zero risk difference at two-sided alpha 0.05. Its target benefit is a reduction of at least 4 percentage points. It confirms that target only when the entire reported 95% interval supports that reduction, and excludes the target only when the entire interval falls short of it.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Chapter 15: Interpreting results and drawing conclusions",
        "Critical values and p values",
        "Clinical Practice Guidelines for the Treatment of Rectal Prolapse"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.arr-nnt-p-value.b-p-040.1",
          "questionVariantId": "question.statistics-ethics.p-value.v2.r6",
          "primaryConceptId": "concept.statistics-ethics.p-value.v2",
          "stem": "Which target-benefit conclusion and next study plan should {patientName}'s team report?",
          "answerChoices": [
            {
              "id": "correct_p-040",
              "label": "Target unresolved; plan a precision-focused efficacy study",
              "isCorrect": true,
              "rationale": "The interval admits target-sized benefit as well as no benefit/harm. The target is unresolved despite a nonsignificant null test.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102d.b26.d1",
              "label": "Target excluded; plan an alternative-intervention efficacy study",
              "isCorrect": false,
              "rationale": "This treats nonsignificance as exclusion of the target-sized effects still in the interval.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102d.b26.d2",
              "label": "Target confirmed; plan an implementation-feasibility study",
              "isCorrect": false,
              "rationale": "This treats a favorable point estimate as satisfying the whole-interval target criterion.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "At the supplied two-sided threshold the null is not rejected. The interval contains effects meeting the target and effects failing it, so neither target confirmation nor target exclusion follows. A more precise efficacy estimate may resolve that uncertainty. Nonsignificance does not establish equivalence or futility, and the point estimate does not meet a whole-interval confirmation rule by itself.",
          "teachingPoint": "At the supplied two-sided threshold the null is not rejected. The interval contains effects meeting the target and effects failing it, so neither target confirmation nor target exclusion follows. A more precise efficacy estimate may resolve that uncertainty. Nonsignificance does not establish equivalence or futility, and the point estimate does not meet a whole-interval confirmation rule by itself.",
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
          "sourceLabels": [
            "Chapter 15: Interpreting results and drawing conclusions",
            "Critical values and p values",
            "Clinical Practice Guidelines for the Treatment of Rectal Prolapse",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v7)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v8)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.qq20261102d.b26.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Target excluded; plan an alternative-intervention efficacy study”.",
              "clinicalRationale": "This treats nonsignificance as exclusion of the target-sized effects still in the interval.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            },
            {
              "answerChoiceId": "choice.qq20261102d.b26.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Target confirmed; plan an implementation-feasibility study”.",
              "clinicalRationale": "This treats a favorable point estimate as satisfying the whole-interval target criterion.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            }
          ]
        }
      ],
      "learningSummary": "At the supplied two-sided threshold the null is not rejected. The interval contains effects meeting the target and effects failing it, so neither target confirmation nor target exclusion follows. A more precise efficacy estimate may resolve that uncertainty. Nonsignificance does not establish equivalence or futility, and the point estimate does not meet a whole-interval confirmation rule by itself."
    },
    {
      "id": "case.gs028se.arr-nnt-p-value.b-p-0001",
      "displayName": "Calculate absolute risk reduction and NNT and Interpret a p-value",
      "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-0001",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "Thyroid surgery study",
      "patientPresentationRevision": {
        "id": "ppr.qq20261102b.case.gs028se.arr-nnt-p-value.b-p-0001",
        "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-0001",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v6",
        "revisedChiefComplaint": "Thyroid surgery study",
        "revisedPresentation": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The endpoint is unplanned reoperation; a lower event risk is beneficial. The hypothetical protocol tests zero risk difference at two-sided alpha 0.05. It confirms a benefit of at least 1 percentage point only if the entire reported 95% interval reaches at least that reduction; it excludes that target under the interval model if the entire interval falls short of it.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "presentation": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The endpoint is unplanned reoperation; a lower event risk is beneficial. The hypothetical protocol tests zero risk difference at two-sided alpha 0.05. It confirms a benefit of at least 1 percentage point only if the entire reported 95% interval reaches at least that reduction; it excludes that target under the interval model if the entire interval falls short of it.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Chapter 15: Interpreting results and drawing conclusions",
        "Critical values and p values",
        "Gastric mucosa-associated lymphoid tissue lymphoma and Helicobacter pylori infection: a review of current diagnosis and management",
        "Clinical Management of Patients with Gastric MALT Lymphoma: A Gastroenterologist's Point of View",
        "Guideline for the diagnosis and management of marginal zone lymphomas: A British Society of Haematology Guideline",
        "Indolent B-Cell Non-Hodgkin Lymphoma Treatment (PDQ): Health Professional Version"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.arr-nnt-p-value.b-p-0001.1",
          "questionVariantId": "question.statistics-ethics.p-value.v3.r4",
          "primaryConceptId": "concept.statistics-ethics.p-value",
          "stem": "Which paired conclusion should {patientName} report from this study?",
          "answerChoices": [
            {
              "id": "correct_p-0001",
              "label": "Zero-effect hypothesis rejected; target reduction outside the reported interval",
              "isCorrect": true,
              "rationale": "The p-value rejects zero, while the full displayed interval is far short of a one-point reduction under the supplied rule.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102b.b39.d1",
              "label": "Zero-effect hypothesis rejected; target reduction within the reported interval",
              "isCorrect": false,
              "rationale": "Correctly rejects zero but mistakes a small statistically significant reduction for inclusion of the protocol target.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102b.b39.d2",
              "label": "Zero-effect hypothesis not rejected; target reduction outside the reported interval",
              "isCorrect": false,
              "rationale": "Reads the magnitude comparison correctly but confuses small effect size with failure to reject zero.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102b.b39.d3",
              "label": "Zero-effect hypothesis not rejected; target reduction within the reported interval",
              "isCorrect": false,
              "rationale": "Misreads both the null comparison and the stated target comparison.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
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
          "sourceLabels": [
            "Chapter 15: Interpreting results and drawing conclusions",
            "Critical values and p values",
            "Gastric mucosa-associated lymphoid tissue lymphoma and Helicobacter pylori infection: a review of current diagnosis and management",
            "Clinical Management of Patients with Gastric MALT Lymphoma: A Gastroenterologist's Point of View",
            "Guideline for the diagnosis and management of marginal zone lymphomas: A British Society of Haematology Guideline",
            "Indolent B-Cell Non-Hodgkin Lymphoma Treatment (PDQ): Health Professional Version",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.qq20261102b.b39.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Zero-effect hypothesis rejected; target reduction within the reported interval”.",
              "clinicalRationale": "Correctly rejects zero but mistakes a small statistically significant reduction for inclusion of the protocol target.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            },
            {
              "answerChoiceId": "choice.qq20261102b.b39.d3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Zero-effect hypothesis not rejected; target reduction within the reported interval”.",
              "clinicalRationale": "Misreads both the null comparison and the stated target comparison.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            },
            {
              "answerChoiceId": "choice.qq20261102b.b39.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Zero-effect hypothesis not rejected; target reduction outside the reported interval”.",
              "clinicalRationale": "Reads the magnitude comparison correctly but confuses small effect size with failure to reject zero.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.arr-nnt-p-value.b-p-008",
      "displayName": "Calculate absolute risk reduction and NNT and Interpret a p-value",
      "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-008",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "Trial methods discussion",
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.gs028se.arr-nnt-p-value.b-p-008",
        "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-008",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Trial methods discussion",
        "revisedPresentation": "{patientName} leads an employee methods discussion of a constructed trial. Its protocol uses a two-sided 0.05 superiority test and two one-sided 0.05 equivalence tests with margins of minus 3 to plus 3 percentage points.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "presentation": "{patientName} leads an employee methods discussion of a constructed trial. Its protocol uses a two-sided 0.05 superiority test and two one-sided 0.05 equivalence tests with margins of minus 3 to plus 3 percentage points.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Chapter 15: Interpreting results and drawing conclusions",
        "Critical values and p values",
        "Meckel's Diverticulum in Adults: Surgical Concerns",
        "Laparoscopic Management of Perforated Meckel's Diverticulum in Adults",
        "Meckel's diverticulectomy: a multi-centre 19-year retrospective study"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.arr-nnt-p-value.b-p-008.1",
          "questionVariantId": "question.statistics-ethics.p-value.v4.r3",
          "primaryConceptId": "concept.statistics-ethics.p-value",
          "stem": "Which paired conclusion should {patientName} report?",
          "answerChoices": [
            {
              "id": "correct_p-008",
              "label": "Superiority uncertain; equivalence uncertain",
              "isCorrect": true,
              "rationale": "The null-test result and the interval's failure to lie within the equivalence margins are separate findings.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102a.b31.d1",
              "label": "Superiority uncertain; equivalence supported",
              "isCorrect": false,
              "rationale": "Mistakes a nonsignificant superiority test for evidence of equivalence.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102a.b31.d2",
              "label": "Superiority supported; equivalence uncertain",
              "isCorrect": false,
              "rationale": "Overweights the point estimate without applying its uncertainty and the pre-specified test.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102a.b31.d3",
              "label": "Superiority supported; equivalence supported",
              "isCorrect": false,
              "rationale": "Misreads both the superiority test and the equivalence interval criterion.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "A nonsignificant superiority result does not establish equivalence. The 90% interval for the two one-sided equivalence tests is not contained within the hypothetical equivalence margins, so neither superiority nor equivalence supported. The 95% estimation interval is reported separately.",
          "teachingPoint": "A nonsignificant superiority result does not establish equivalence. The 90% interval for the two one-sided equivalence tests is not contained within the hypothetical equivalence margins, so neither superiority nor equivalence supported. The 95% estimation interval is reported separately.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed trial/protocol values; the equivalence margin is not a clinical guideline.",
            "items": [
              {
                "label": "Risk difference: intervention minus control",
                "value": "-5 percentage points"
              },
              {
                "label": "Approximate 95% confidence interval",
                "value": "-10.6 to +0.6 percentage points"
              },
              {
                "label": "Approximate 90% confidence interval",
                "value": "-9.7 to -0.3 percentage points"
              },
              {
                "label": "Two-sided superiority p-value",
                "value": "0.08"
              }
            ]
          },
          "sourceLabels": [
            "Chapter 15: Interpreting results and drawing conclusions",
            "Critical values and p values",
            "Meckel's Diverticulum in Adults: Surgical Concerns",
            "Laparoscopic Management of Perforated Meckel's Diverticulum in Adults",
            "Meckel's diverticulectomy: a multi-centre 19-year retrospective study",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.qq20261102a.b31.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Superiority uncertain; equivalence supported”.",
              "clinicalRationale": "Mistakes a nonsignificant superiority test for evidence of equivalence.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            },
            {
              "answerChoiceId": "choice.qq20261102a.b31.d3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Superiority supported; equivalence supported”.",
              "clinicalRationale": "Misreads both the superiority test and the equivalence interval criterion.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            },
            {
              "answerChoiceId": "choice.qq20261102a.b31.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “Superiority supported; equivalence uncertain”.",
              "clinicalRationale": "Overweights the point estimate without applying its uncertainty and the pre-specified test.",
              "sourceLabels": [
                "Chapter 15: Interpreting results and drawing conclusions",
                "Critical values and p values"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.confidence-interval-errors-power.a-ratio-crosses",
      "displayName": "Interpret a confidence interval and Distinguish type I error, type II error, and power",
      "patientPresentationVariantId": "presentation.gs028se.confidence-interval-errors-power.a-ratio-crosses",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "Recurrence study discussion",
      "patientPresentationRevision": {
        "id": "ppr.qq20261102a.case.gs028se.confidence-interval-errors-power.a-ratio-crosses",
        "patientPresentationVariantId": "presentation.gs028se.confidence-interval-errors-power.a-ratio-crosses",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v5",
        "revisedChiefComplaint": "Recurrence study discussion",
        "revisedPresentation": "{patientName} leads an employee trial discussion. For a constructed recurrence comparison, use a fixed 20% control risk to translate the reported relative-risk interval. The hypothetical protocol asks whether an absolute risk increase of 5 percentage points is outside that interval.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "aiAssistedDrafting": true,
        "reviewStatus": "needs_clinician_review",
        "lastClinicianReview": null
      },
      "presentation": "{patientName} leads an employee trial discussion. For a constructed recurrence comparison, use a fixed 20% control risk to translate the reported relative-risk interval. The hypothetical protocol asks whether an absolute risk increase of 5 percentage points is outside that interval.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "What are confidence intervals?",
        "Confidence Limits for the Mean",
        "Quantitative Techniques",
        "International guidelines for groin hernia management"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.confidence-interval-errors-power.a-ratio-crosses.1",
          "questionVariantId": "question.statistics-ethics.confidence-interval.v1.r3",
          "primaryConceptId": "concept.statistics-ethics.confidence-interval",
          "stem": "Which translated interval and protocol conclusion should {patientName} report?",
          "answerChoices": [
            {
              "id": "correct_ratio-crosses",
              "label": "12 points lower to 4 higher; the +5-point margin is outside the interval",
              "isCorrect": true,
              "rationale": "Converts ratio bounds to event risks using the fixed control risk, then subtracts the control risk before comparing the margin.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102a.b38.d1",
              "label": "14 points lower to 2 higher; the +5-point margin is outside the interval",
              "isCorrect": false,
              "rationale": "Incorrectly centers a symmetric absolute interval on the point estimate rather than translating the supplied asymmetric ratio bounds.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102a.b38.d2",
              "label": "6 points lower to 10 higher; the +5-point margin is inside the interval",
              "isCorrect": false,
              "rationale": "Subtracts the predicted intervention point risk rather than the fixed control risk when forming risk-difference bounds.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The ratio interval gives intervention risks of 8% to 24% under the fixed 20% control input. Subtracting 20% gives a risk-difference interval of -12 to +4 percentage points, so the hypothetical +5-point margin is outside it. These are confidence-interval summaries under the stated model, not hard limits on possible effects or a universal clinical harm threshold.",
          "teachingPoint": "The ratio interval gives intervention risks of 8% to 24% under the fixed 20% control input. Subtracting 20% gives a risk-difference interval of -12 to +4 percentage points, so the hypothetical +5-point margin is outside it. These are confidence-interval summaries under the stated model, not hard limits on possible effects or a universal clinical harm threshold.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed model/protocol inputs; the reference risk is fixed, not another estimated quantity.",
            "items": [
              {
                "label": "Recurrence risk ratio",
                "value": "0.70"
              },
              {
                "label": "95% confidence interval for the risk ratio",
                "value": "0.40 to 1.20"
              },
              {
                "label": "Fixed control recurrence risk",
                "value": "20%"
              },
              {
                "label": "Hypothetical absolute harm margin",
                "value": "+5 percentage points"
              }
            ]
          },
          "sourceLabels": [
            "What are confidence intervals?",
            "Confidence Limits for the Mean",
            "Quantitative Techniques",
            "International guidelines for groin hernia management",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.qq20261102a.b38.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “14 points lower to 2 higher; the +5-point margin is outside the interval”.",
              "clinicalRationale": "Incorrectly centers a symmetric absolute interval on the point estimate rather than translating the supplied asymmetric ratio bounds.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            },
            {
              "answerChoiceId": "choice.qq20261102a.b38.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "The encounter recorded “6 points lower to 10 higher; the +5-point margin is inside the interval”.",
              "clinicalRationale": "Subtracts the predicted intervention point risk rather than the fixed control risk when forming risk-difference bounds.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.confidence-interval-errors-power.a-difference-excludes",
      "displayName": "Interpret a confidence interval and Distinguish type I error, type II error, and power",
      "patientPresentationVariantId": "presentation.gs028se.confidence-interval-errors-power.a-difference-excludes",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "pilonidal disease study",
      "presentation": "{patientName}, the colorectal journal-club lead, reviews a new operative closure technique for chronic pilonidal disease. The trial reports recurrence within two years as an absolute risk difference with a confidence interval. One colleague says the range establishes an important benefit. The report provides no threshold for what difference would matter to patients, and the team is reviewing that interpretation.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "What are confidence intervals?",
        "Confidence Limits for the Mean",
        "Quantitative Techniques",
        "Consensus statement of the Italian society of colorectal surgery (SICCR): management and treatment of pilonidal disease",
        "Pilonidal Disease"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.confidence-interval-errors-power.a-difference-excludes.1",
          "questionVariantId": "question.statistics-ethics.confidence-interval.v2",
          "primaryConceptId": "concept.statistics-ethics.confidence-interval",
          "stem": "Which statement is justified by the constructed two-year recurrence risk difference of -4 percentage points with a 95% interval from -6 to -2?",
          "answerChoices": [
            {
              "id": "correct_difference-excludes",
              "label": "The interval excludes the null value 0",
              "isCorrect": true,
              "rationale": "All values from -6 to -2 are below zero. The interval therefore excludes zero, the no-difference value on this scale.",
              "serviceRequest": null
            },
            {
              "id": "d1_difference-excludes",
              "label": "The interval includes the null value 0",
              "isCorrect": false,
              "rationale": "Zero is outside the stated limits. The null for a difference is zero, even though a ratio would use one.",
              "serviceRequest": null
            },
            {
              "id": "d2_difference-excludes",
              "label": "The interval gives 95% probability of clinical benefit",
              "isCorrect": false,
              "rationale": "The confidence level is not a probability that the intervention provides clinical benefit. The exercise gives no clinical-importance criterion.",
              "serviceRequest": null
            },
            {
              "id": "d3_difference-excludes",
              "label": "The interval establishes a clinically important effect",
              "isCorrect": false,
              "rationale": "Excluding zero addresses compatibility with the difference null. It does not, by itself, establish a clinically important magnitude.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The interval from -6 to -2 excludes zero, the null for a risk difference. Excluding zero does not by itself establish a clinically important effect.",
          "teachingPoint": "For a difference, the no-difference value is 0, rather than the ratio null of 1. Every value from -6 to -2 lies below zero, so this interval excludes the null. That describes the estimate's uncertainty on its stated scale; it does not alone establish clinical importance or a probability of benefit.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Unnamed investigational pilonidal closure technique: invented two-year recurrence risk difference, percentage points (new minus control), for practice. No real efficacy or clinical-importance threshold.",
            "items": [
              {
                "label": "Estimate",
                "value": "-4"
              },
              {
                "label": "95% confidence interval",
                "value": "-6 to -2"
              }
            ]
          },
          "sourceLabels": [
            "What are confidence intervals?",
            "Confidence Limits for the Mean",
            "Quantitative Techniques",
            "Consensus statement of the Italian society of colorectal surgery (SICCR): management and treatment of pilonidal disease",
            "Pilonidal Disease"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_difference-excludes",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The interval from -6 to -2 excludes zero, the null for a risk difference. Excluding zero does not by itself establish a clinically important effect.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            },
            {
              "answerChoiceId": "d2_difference-excludes",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The interval from -6 to -2 excludes zero, the null for a risk difference. Excluding zero does not by itself establish a clinically important effect.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            },
            {
              "answerChoiceId": "d3_difference-excludes",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The interval from -6 to -2 excludes zero, the null for a risk difference. Excluding zero does not by itself establish a clinically important effect.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.confidence-interval-errors-power.a-precision-width",
      "displayName": "Interpret a confidence interval and Distinguish type I error, type II error, and power",
      "patientPresentationVariantId": "presentation.gs028se.confidence-interval-errors-power.a-precision-width",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "lactational breast abscess study",
      "presentation": "{patientName}, the breast-service research lead, reviews two studies of a new aspiration device for lactational breast abscesses. Both report repeat drainage within thirty days on the same scale. A colleague prefers the paper with the most confident title; its author underlined 'definitive' twice. The intervals use the same method and confidence level, and the team is comparing precision.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "What are confidence intervals?",
        "Confidence Limits for the Mean",
        "Quantitative Techniques",
        "ACR Appropriateness Criteria Breast Imaging During Lactation",
        "Academy of Breastfeeding Medicine Clinical Protocol #36: The Mastitis Spectrum, Revised 2022"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.confidence-interval-errors-power.a-precision-width.1",
          "questionVariantId": "question.statistics-ethics.confidence-interval.v3",
          "primaryConceptId": "concept.statistics-ethics.confidence-interval",
          "stem": "Which constructed repeat-drainage risk-difference interval is more precise when method, confidence level and measurement scale are the same?",
          "answerChoices": [
            {
              "id": "correct_precision-width",
              "label": "The 4-to-6 interval is more precise",
              "isCorrect": true,
              "rationale": "The 4-to-6 interval is narrower than 1-to-9 under the same method, confidence level, and scale. It therefore displays greater sampling precision.",
              "serviceRequest": null
            },
            {
              "id": "d1_precision-width",
              "label": "The 1-to-9 interval is more precise",
              "isCorrect": false,
              "rationale": "The 1-to-9 interval is wider. Under the supplied comparable conditions, that width displays more sampling uncertainty rather than greater precision.",
              "serviceRequest": null
            },
            {
              "id": "d2_precision-width",
              "label": "Both intervals have equal precision",
              "isCorrect": false,
              "rationale": "Both point estimates are five, but the interval widths differ. A shared center does not imply equal precision.",
              "serviceRequest": null
            },
            {
              "id": "d3_precision-width",
              "label": "Precision cannot be ranked without sample sizes",
              "isCorrect": false,
              "rationale": "The widths already display relative sampling precision under the same method and scale. The exercise does not require sample sizes to compare those widths.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The 4-to-6 interval is more precise because it is narrower under the same method and scale. Both estimates being 5 does not equalize the interval widths.",
          "teachingPoint": "With the same method, confidence level, and scale, a narrower interval displays less sampling uncertainty and therefore greater precision. The 4-to-6 interval is narrower than 1-to-9, even though both center on 5. Remember that the center gives the point estimate while the width conveys precision; equal centers do not imply equal uncertainty.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Unnamed investigational lactational-abscess aspiration device: invented thirty-day repeat-drainage risk difference, percentage points (new minus control), for practice. No real efficacy or clinical-importance threshold.",
            "items": [
              {
                "label": "Interval A, 95%",
                "value": "1 to 9"
              },
              {
                "label": "Interval B, 95%",
                "value": "4 to 6"
              },
              {
                "label": "Both estimates",
                "value": "5"
              }
            ]
          },
          "sourceLabels": [
            "What are confidence intervals?",
            "Confidence Limits for the Mean",
            "Quantitative Techniques",
            "ACR Appropriateness Criteria Breast Imaging During Lactation",
            "Academy of Breastfeeding Medicine Clinical Protocol #36: The Mastitis Spectrum, Revised 2022"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_precision-width",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The 4-to-6 interval is more precise because it is narrower under the same method and scale. Both estimates being 5 does not equalize the interval widths.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            },
            {
              "answerChoiceId": "d2_precision-width",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The 4-to-6 interval is more precise because it is narrower under the same method and scale. Both estimates being 5 does not equalize the interval widths.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            },
            {
              "answerChoiceId": "d3_precision-width",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The 4-to-6 interval is more precise because it is narrower under the same method and scale. Both estimates being 5 does not equalize the interval widths.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.confidence-interval-errors-power.a-repeated-sampling",
      "displayName": "Interpret a confidence interval and Distinguish type I error, type II error, and power",
      "patientPresentationVariantId": "presentation.gs028se.confidence-interval-errors-power.a-repeated-sampling",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "gastric adenocarcinoma study",
      "presentation": "{patientName}, the upper-GI journal-club lead, reviews a new biologic after resection of gastric adenocarcinoma. Its trial reports a three-year recurrence risk difference with a frequentist interval. The presenter lists an invited lecture on his CV; the invitation came from the seminar series he organizes himself. The team is reviewing what the stated confidence level describes across repeated studies.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "What are confidence intervals?",
        "Confidence Limits for the Mean",
        "Quantitative Techniques",
        "Korean Practice Guidelines for Gastric Cancer 2024: An Evidence-based, Multidisciplinary Approach",
        "Japanese Gastric Cancer Treatment Guidelines 2021",
        "Randomized Controlled Trial to Evaluate Splenectomy in Total Gastrectomy for Proximal Gastric Carcinoma"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.confidence-interval-errors-power.a-repeated-sampling.1",
          "questionVariantId": "question.statistics-ethics.confidence-interval.v4",
          "primaryConceptId": "concept.statistics-ethics.confidence-interval",
          "stem": "What does a 95% confidence level describe for repeated use of the stated frequentist three-year recurrence risk-difference interval procedure?",
          "answerChoices": [
            {
              "id": "correct_repeated-sampling",
              "label": "The method covers the true value in 95% of repetitions",
              "isCorrect": true,
              "rationale": "The 95% level describes long-run coverage by intervals constructed with this procedure under its assumptions. The fixed true value is covered in that proportion of repetitions.",
              "serviceRequest": null
            },
            {
              "id": "d1_repeated-sampling",
              "label": "This interval has a 95% chance of containing the truth",
              "isCorrect": false,
              "rationale": "After observation, this frequentist framework treats the parameter as fixed. Its confidence level does not assign a fresh probability to this particular interval containing that value.",
              "serviceRequest": null
            },
            {
              "id": "d2_repeated-sampling",
              "label": "The null hypothesis has a 5% chance of being correct",
              "isCorrect": false,
              "rationale": "Neither 95% confidence nor its 5% complement supplies a truth probability for a hypothesis. That is a different question from interval coverage.",
              "serviceRequest": null
            },
            {
              "id": "d3_repeated-sampling",
              "label": "The estimate has a 95% chance of being unbiased",
              "isCorrect": false,
              "rationale": "Coverage under a procedure does not guarantee the absence of systematic bias. The confidence level is not a probability that the estimate is unbiased.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The 95% refers to long-run coverage of intervals produced by the procedure under its assumptions. It does not assign a 95% truth probability to this particular interval.",
          "teachingPoint": "A frequentist confidence level describes repeated use of the interval method under its assumptions. In 95% of those repetitions, intervals produced by the procedure cover the fixed true value. It is a property of the method, not a new probability assigned to this observed interval or a guarantee that the estimate is unbiased.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Unnamed investigational gastric-cancer biologic: invented three-year recurrence risk-difference procedure, percentage points (new minus control), for practice. No real efficacy or clinical-importance threshold.",
            "items": [
              {
                "label": "Framework",
                "value": "Standard frequentist procedure"
              },
              {
                "label": "Confidence level",
                "value": "95%"
              }
            ]
          },
          "sourceLabels": [
            "What are confidence intervals?",
            "Confidence Limits for the Mean",
            "Quantitative Techniques",
            "Korean Practice Guidelines for Gastric Cancer 2024: An Evidence-based, Multidisciplinary Approach",
            "Japanese Gastric Cancer Treatment Guidelines 2021",
            "Randomized Controlled Trial to Evaluate Splenectomy in Total Gastrectomy for Proximal Gastric Carcinoma"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_repeated-sampling",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The 95% refers to long-run coverage of intervals produced by the procedure under its assumptions. It does not assign a 95% truth probability to this particular interval.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            },
            {
              "answerChoiceId": "d2_repeated-sampling",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The 95% refers to long-run coverage of intervals produced by the procedure under its assumptions. It does not assign a 95% truth probability to this particular interval.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            },
            {
              "answerChoiceId": "d3_repeated-sampling",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "The 95% refers to long-run coverage of intervals produced by the procedure under its assumptions. It does not assign a 95% truth probability to this particular interval.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.confidence-interval-errors-power.b-type-one",
      "displayName": "Interpret a confidence interval and Distinguish type I error, type II error, and power",
      "patientPresentationVariantId": "presentation.gs028se.confidence-interval-errors-power.b-type-one",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "DCIS study",
      "presentation": "{patientName}, the breast-oncology research lead, reviews a new local treatment device for DCIS. A simulation concerns recurrence within five years and stipulates the underlying state. The investigator lists one conference abstract as a presentation, publication and public-engagement project on his appraisal. The analysis rejects its null, and the team is reviewing how to classify that simulated result.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "What are confidence intervals?",
        "Confidence Limits for the Mean",
        "Quantitative Techniques",
        "Resource Guide on Breast Cancer Breast Conservation Surgery Margins",
        "DCIS margin consensus guideline"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.confidence-interval-errors-power.b-type-one.1",
          "questionVariantId": "question.statistics-ethics.errors-power.v1",
          "primaryConceptId": "concept.statistics-ethics.errors-power",
          "stem": "Which testing error occurs in the simulated DCIS-recurrence analysis when the null is true but the analysis rejects it?",
          "answerChoices": [
            {
              "id": "correct_type-one",
              "label": "Type I error",
              "isCorrect": true,
              "rationale": "The underlying null is stipulated to be true, yet the analysis rejects it. That truth-and-decision combination defines a type I error.",
              "serviceRequest": null
            },
            {
              "id": "d1_type-one",
              "label": "Type II error",
              "isCorrect": false,
              "rationale": "Type II error would mean failing to reject under a specified true alternative. Both the underlying state and decision differ from this exhibit.",
              "serviceRequest": null
            },
            {
              "id": "d2_type-one",
              "label": "Measurement bias",
              "isCorrect": false,
              "rationale": "The exhibit gives the hypothesis state and decision, without describing inconsistent outcome measurement. It identifies a testing error rather than that bias mechanism.",
              "serviceRequest": null
            },
            {
              "id": "d3_type-one",
              "label": "Selection bias",
              "isCorrect": false,
              "rationale": "No systematic exclusion from recruitment is supplied. The stated problem is rejection of a true null, not a selection process.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Rejecting a true null is a type I error. The exhibit supplies the true state and testing decision, not evidence of a measurement or recruitment mechanism.",
          "teachingPoint": "Testing errors compare a decision with the underlying state. Type I error means rejecting a null that is actually true; type II means failing to reject when a specified alternative is true. Here the null is true and was rejected. Remember: first identify what is true, then what the analysis decided.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Simulated unnamed investigational local DCIS treatment device trial: the underlying state for five-year recurrence is stipulated for practice. It is not learned from a p-value or asserted for a real intervention.",
            "items": [
              {
                "label": "Underlying state",
                "value": "Null hypothesis true"
              },
              {
                "label": "Analysis decision",
                "value": "Reject the null hypothesis"
              }
            ]
          },
          "sourceLabels": [
            "What are confidence intervals?",
            "Confidence Limits for the Mean",
            "Quantitative Techniques",
            "Resource Guide on Breast Cancer Breast Conservation Surgery Margins",
            "DCIS margin consensus guideline"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_type-one",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Rejecting a true null is a type I error. The exhibit supplies the true state and testing decision, not evidence of a measurement or recruitment mechanism.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            },
            {
              "answerChoiceId": "d2_type-one",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Rejecting a true null is a type I error. The exhibit supplies the true state and testing decision, not evidence of a measurement or recruitment mechanism.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            },
            {
              "answerChoiceId": "d3_type-one",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Rejecting a true null is a type I error. The exhibit supplies the true state and testing decision, not evidence of a measurement or recruitment mechanism.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.confidence-interval-errors-power.b-type-two",
      "displayName": "Interpret a confidence interval and Distinguish type I error, type II error, and power",
      "patientPresentationVariantId": "presentation.gs028se.confidence-interval-errors-power.b-type-two",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "hepatocellular carcinoma study",
      "presentation": "{patientName}, the liver-surgery discussion lead, reviews a new resection instrument for solitary hepatocellular carcinoma in a favorable operative profile. A simulation concerns recurrence within three years and stipulates that a specified difference exists. The analysis fails to reject its null model. The team has the underlying state and analysis decision available and is reviewing the testing-error classification.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "What are confidence intervals?",
        "Confidence Limits for the Mean",
        "Quantitative Techniques",
        "AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.confidence-interval-errors-power.b-type-two.1",
          "questionVariantId": "question.statistics-ethics.errors-power.v2",
          "primaryConceptId": "concept.statistics-ethics.errors-power",
          "stem": "Which testing error occurs in the simulated HCC-recurrence analysis when the specified alternative is true but the analysis fails to reject the null?",
          "answerChoices": [
            {
              "id": "correct_type-two",
              "label": "Type II error",
              "isCorrect": true,
              "rationale": "The specified alternative is stipulated to be true, but the test fails to reject the null. That combination defines a type II error.",
              "serviceRequest": null
            },
            {
              "id": "d1_type-two",
              "label": "Type I error",
              "isCorrect": false,
              "rationale": "Type I error requires rejection under a true null. This exercise instead supplies nonrejection under a true alternative.",
              "serviceRequest": null
            },
            {
              "id": "d2_type-two",
              "label": "Measurement bias",
              "isCorrect": false,
              "rationale": "No unequal outcome-recording process is described. The facts identify a missed specified alternative by the test.",
              "serviceRequest": null
            },
            {
              "id": "d3_type-two",
              "label": "Selection bias",
              "isCorrect": false,
              "rationale": "The exhibit does not describe systematic sampling exclusion. The testing decision, compared with the supplied true alternative, identifies the error.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "This is a type II error: the specified alternative is true, yet the test fails to reject the null. Nonrejection does not establish that no effect exists.",
          "teachingPoint": "Failure to reject does not guarantee a true null. If the specified alternative is actually true and the analysis misses it, the decision is a type II error. Type I is the opposite truth-and-decision combination: rejection under a true null. Keep the underlying state separate from the decision reported by the test.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Simulated unnamed investigational hepatic resection instrument trial: the underlying state for three-year HCC recurrence is stipulated for practice. It is not learned from a p-value or asserted for a real intervention.",
            "items": [
              {
                "label": "Underlying state",
                "value": "Specified alternative true"
              },
              {
                "label": "Analysis decision",
                "value": "Fail to reject the null hypothesis"
              }
            ]
          },
          "sourceLabels": [
            "What are confidence intervals?",
            "Confidence Limits for the Mean",
            "Quantitative Techniques",
            "AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_type-two",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "This is a type II error: the specified alternative is true, yet the test fails to reject the null. Nonrejection does not establish that no effect exists.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            },
            {
              "answerChoiceId": "d2_type-two",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "This is a type II error: the specified alternative is true, yet the test fails to reject the null. Nonrejection does not establish that no effect exists.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            },
            {
              "answerChoiceId": "d3_type-two",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "This is a type II error: the specified alternative is true, yet the test fails to reject the null. Nonrejection does not establish that no effect exists.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.confidence-interval-errors-power.b-power",
      "displayName": "Interpret a confidence interval and Distinguish type I error, type II error, and power",
      "patientPresentationVariantId": "presentation.gs028se.confidence-interval-errors-power.b-power",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "pancreatic cancer study",
      "presentation": "{patientName}, the pancreatic-oncology research lead, reviews a new radiation-delivery technique after pancreatic tail cancer resection. Its trial is planned around recurrence within two years. The grant writer wants a guaranteed discovery and asks whether 'statistically likely' can be upgraded in the budget justification. The calculation specifies the effect, variability and sampling assumptions before any outcomes are collected.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "What are confidence intervals?",
        "Confidence Limits for the Mean",
        "Quantitative Techniques",
        "Multidisciplinary consensus statement on the clinical management of patients with pancreatic cancer",
        "Pancreatic Cancer Treatment (PDQ): Health Professional Version"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.confidence-interval-errors-power.b-power.1",
          "questionVariantId": "question.statistics-ethics.errors-power.v3",
          "primaryConceptId": "concept.statistics-ethics.errors-power",
          "stem": "What does prospective power describe under the specified alternative in the constructed pancreatic-cancer recurrence trial?",
          "answerChoices": [
            {
              "id": "correct_power",
              "label": "Chance of rejection if that alternative is true",
              "isCorrect": true,
              "rationale": "Under the specified true alternative and design assumptions, power is the probability of rejecting the null. It describes how the planned procedure behaves in that situation.",
              "serviceRequest": null
            },
            {
              "id": "d1_power",
              "label": "Chance that a statistically positive result is true",
              "isCorrect": false,
              "rationale": "This reverses what is conditioned on. Power assumes an alternative to evaluate rejection, rather than estimating whether a statistically positive conclusion is true.",
              "serviceRequest": null
            },
            {
              "id": "d2_power",
              "label": "Chance that the null hypothesis itself is true",
              "isCorrect": false,
              "rationale": "The plan does not assign a probability to the null hypothesis being true. It calculates a rejection probability under the specified alternative.",
              "serviceRequest": null
            },
            {
              "id": "d3_power",
              "label": "Chance of nonrejection if that alternative is true",
              "isCorrect": false,
              "rationale": "Nonrejection under a true alternative describes a type II error probability. Power instead concerns rejection under that alternative.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Planned power is the chance of rejecting the null under the specified true alternative and design assumptions. It is not the truth probability of a positive result.",
          "teachingPoint": "Power is the probability that the analysis rejects the null if the specified alternative is true, under the planned design assumptions. It is a statement about a procedure operating in that situation. Remember the direction of conditioning: it does not give the probability that a positive study conclusion or the alternative itself is true.",
          "exhibit": {
            "kind": "abstract",
            "title": "Recurrence trial — illustrative analysis",
            "body": "An unnamed investigational pancreatic-cancer radiation technique study of two-year recurrence. Before collecting data, investigators specify the recurrence effect, variability, alpha and sampling design. Power is calculated under that alternative. These study conditions are invented for practice, not real efficacy findings."
          },
          "sourceLabels": [
            "What are confidence intervals?",
            "Confidence Limits for the Mean",
            "Quantitative Techniques",
            "Multidisciplinary consensus statement on the clinical management of patients with pancreatic cancer",
            "Pancreatic Cancer Treatment (PDQ): Health Professional Version"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_power",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Planned power is the chance of rejecting the null under the specified true alternative and design assumptions. It is not the truth probability of a positive result.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            },
            {
              "answerChoiceId": "d2_power",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Planned power is the chance of rejecting the null under the specified true alternative and design assumptions. It is not the truth probability of a positive result.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            },
            {
              "answerChoiceId": "d3_power",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Planned power is the chance of rejecting the null under the specified true alternative and design assumptions. It is not the truth probability of a positive result.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    },
    {
      "id": "case.gs028se.confidence-interval-errors-power.b-post-hoc",
      "displayName": "Interpret a confidence interval and Distinguish type I error, type II error, and power",
      "patientPresentationVariantId": "presentation.gs028se.confidence-interval-errors-power.b-post-hoc",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "participant": {
        "kind": "employee_discussion",
        "requiredStaffRoleDefinitionIds": [
          "staff.glp1_np",
          "staff.endoscopy_nurse",
          "staff.endoscopist",
          "staff.periop_nurse",
          "staff.surgeon",
          "staff.or_nurse",
          "staff.pharmacist",
          "staff.radiologist"
        ]
      },
      "chiefComplaint": "basal cell carcinoma study",
      "presentation": "{patientName}, the skin-oncology journal-club lead, reviews a new topical agent for basal cell carcinoma. The trial evaluates recurrence within two years and does not reject its null model. After seeing the results, authors calculate low power and conclude the agent has no effect. The team is reviewing that conclusion alongside the reported effect estimate and uncertainty.",
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 2,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "What are confidence intervals?",
        "Confidence Limits for the Mean",
        "Quantitative Techniques",
        "NCI Skin Cancer Treatment PDQ",
        "S2k basal cell carcinoma guideline update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.confidence-interval-errors-power.b-post-hoc.1",
          "questionVariantId": "question.statistics-ethics.errors-power.v4",
          "primaryConceptId": "concept.statistics-ethics.errors-power",
          "stem": "Which statement is justified when the constructed basal-cell-carcinoma recurrence trial fails to reject its null and reports low post-hoc power?",
          "answerChoices": [
            {
              "id": "correct_post-hoc",
              "label": "Post-hoc power does not prove no effect",
              "isCorrect": true,
              "rationale": "A low post-hoc calculation does not establish that the effect is exactly absent. Power is conditional on a specified alternative, rather than a truth probability for the null.",
              "serviceRequest": null
            },
            {
              "id": "d1_post-hoc",
              "label": "Low post-hoc power favors an absent effect",
              "isCorrect": false,
              "rationale": "The later calculation does not make the no-effect conclusion valid. Neither low post-hoc power nor nonrejection supplies proof of an absent effect.",
              "serviceRequest": null
            },
            {
              "id": "d2_post-hoc",
              "label": "Post-hoc power gives the probability of the null",
              "isCorrect": false,
              "rationale": "Power does not assign a probability to the null hypothesis. It concerns rejection behavior under a specified alternative.",
              "serviceRequest": null
            },
            {
              "id": "d3_post-hoc",
              "label": "The observed p-value is the study's achieved power",
              "isCorrect": false,
              "rationale": "A p-value concerns observed-or-more-extreme data under a null model; power concerns rejection under an alternative. They are different conditional quantities.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Low post-hoc power does not prove no effect. It neither gives the probability of the null nor makes the observed p-value equal to power.",
          "teachingPoint": "Power describes rejection probability under a specified alternative, not the probability that a hypothesis is true. A low post-hoc power calculation after nonrejection does not establish an exactly absent effect. Remember that a second conditional calculation cannot transform the first result into proof of equality or supply the effect size missing from this exercise.",
          "exhibit": {
            "kind": "abstract",
            "title": "Recurrence trial — illustrative analysis",
            "body": "An unnamed investigational basal-cell-carcinoma topical agent study of two-year recurrence. The trial does not reject its recurrence null model. Authors calculate low post-hoc power and claim that no recurrence effect exists. These study conditions are invented for practice, not real efficacy findings."
          },
          "sourceLabels": [
            "What are confidence intervals?",
            "Confidence Limits for the Mean",
            "Quantitative Techniques",
            "NCI Skin Cancer Treatment PDQ",
            "S2k basal cell carcinoma guideline update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_post-hoc",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Low post-hoc power does not prove no effect. It neither gives the probability of the null nor makes the observed p-value equal to power.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            },
            {
              "answerChoiceId": "d2_post-hoc",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Low post-hoc power does not prove no effect. It neither gives the probability of the null nor makes the observed p-value equal to power.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            },
            {
              "answerChoiceId": "d3_post-hoc",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the teaching point and choice rationales.",
              "clinicalRationale": "Low post-hoc power does not prove no effect. It neither gives the probability of the null nor makes the observed p-value equal to power.",
              "sourceLabels": [
                "What are confidence intervals?",
                "Confidence Limits for the Mean",
                "Quantitative Techniques"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Review the teaching points and choice rationales for this encounter."
    }
  ]
};
export const QUESTION_STATS1_RETAINED_TIMINGS:AnswerChoiceTimingRegistryEntry[]=[
  {
    "caseId": "case.gs028se.independent-t-paired-t.a-two-teams",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-teams.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.independent-t-paired-t.a-two-cohorts",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-cohorts.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.independent-t-paired-t.a-two-shifts",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-shifts.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.independent-t-paired-t.a-two-scripts",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-scripts.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.independent-t-paired-t.b-same-rooms",
    "nodeId": "node.gs028se.independent-t-paired-t.b-same-rooms.1",
    "questionVariantId": "question.statistics-ethics.paired-t.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.independent-t-paired-t.b-same-trainees",
    "nodeId": "node.gs028se.independent-t-paired-t.b-same-trainees.1",
    "questionVariantId": "question.statistics-ethics.paired-t.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.independent-t-paired-t.b-matched-sites",
    "nodeId": "node.gs028se.independent-t-paired-t.b-matched-sites.1",
    "questionVariantId": "question.statistics-ethics.paired-t.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.independent-t-paired-t.b-same-workers",
    "nodeId": "node.gs028se.independent-t-paired-t.b-same-workers.1",
    "questionVariantId": "question.statistics-ethics.paired-t.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-three-teams",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-three-teams.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-four-formats",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-four-formats.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-three-sites",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-three-sites.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-five-signs",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-five-signs.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.one-way-anova-rank-sum.b-ordinal-teams",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.b-ordinal-teams.1",
    "questionVariantId": "question.statistics-ethics.rank-sum.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.one-way-anova-rank-sum.b-skewed-delays",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.b-skewed-delays.1",
    "questionVariantId": "question.statistics-ethics.rank-sum.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.one-way-anova-rank-sum.b-independent-likert",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.b-independent-likert.1",
    "questionVariantId": "question.statistics-ethics.rank-sum.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.one-way-anova-rank-sum.b-two-queues",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.b-two-queues.1",
    "questionVariantId": "question.statistics-ethics.rank-sum.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.signed-rank-chi-square.a-paired-workload",
    "nodeId": "node.gs028se.signed-rank-chi-square.a-paired-workload.1",
    "questionVariantId": "question.statistics-ethics.signed-rank.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.signed-rank-chi-square.a-same-rooms-skewed",
    "nodeId": "node.gs028se.signed-rank-chi-square.a-same-rooms-skewed.1",
    "questionVariantId": "question.statistics-ethics.signed-rank.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.signed-rank-chi-square.a-matched-dyads",
    "nodeId": "node.gs028se.signed-rank-chi-square.a-matched-dyads.1",
    "questionVariantId": "question.statistics-ethics.signed-rank.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.signed-rank-chi-square.a-pre-post-counts",
    "nodeId": "node.gs028se.signed-rank-chi-square.a-pre-post-counts.1",
    "questionVariantId": "question.statistics-ethics.signed-rank.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.signed-rank-chi-square.b-role-by-choice",
    "nodeId": "node.gs028se.signed-rank-chi-square.b-role-by-choice.1",
    "questionVariantId": "question.statistics-ethics.chi-square.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.signed-rank-chi-square.b-shift-by-response",
    "nodeId": "node.gs028se.signed-rank-chi-square.b-shift-by-response.1",
    "questionVariantId": "question.statistics-ethics.chi-square.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.signed-rank-chi-square.b-badge-by-completion",
    "nodeId": "node.gs028se.signed-rank-chi-square.b-badge-by-completion.1",
    "questionVariantId": "question.statistics-ethics.chi-square.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.signed-rank-chi-square.b-site-by-category",
    "nodeId": "node.gs028se.signed-rank-chi-square.b-site-by-category.1",
    "questionVariantId": "question.statistics-ethics.chi-square.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.fisher-exact-study-design.a-rare-event",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-rare-event.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.fisher-exact-study-design.a-tiny-pilot",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-tiny-pilot.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v2.r3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.fisher-exact-study-design.a-sparse-exposure",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-sparse-exposure.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.fisher-exact-study-design.a-small-response",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-small-response.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.fisher-exact-study-design.b-cohort-followup",
    "nodeId": "node.gs028se.fisher-exact-study-design.b-cohort-followup.1",
    "questionVariantId": "question.statistics-ethics.study-design.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.fisher-exact-study-design.b-random-scripts",
    "nodeId": "node.gs028se.fisher-exact-study-design.b-random-scripts.1",
    "questionVariantId": "question.statistics-ethics.study-design.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.fisher-exact-study-design.b-case-control",
    "nodeId": "node.gs028se.fisher-exact-study-design.b-case-control.1",
    "questionVariantId": "question.statistics-ethics.study-design.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.fisher-exact-study-design.b-cross-sectional",
    "nodeId": "node.gs028se.fisher-exact-study-design.b-cross-sectional.1",
    "questionVariantId": "question.statistics-ethics.study-design.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.a-baseline-shift",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.a-baseline-shift.1",
    "questionVariantId": "question.statistics-ethics.bias-confounding.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.a-night-excluded",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.a-night-excluded.1",
    "questionVariantId": "question.statistics-ethics.bias-confounding.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.a-recall-timing",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.a-recall-timing.1",
    "questionVariantId": "question.statistics-ethics.bias-confounding.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.a-adjusted-model",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.a-adjusted-model.1",
    "questionVariantId": "question.statistics-ethics.bias-confounding.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90.1",
    "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95.1",
    "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80.1",
    "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70.1",
    "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence.1",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.1",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v2.r1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table.1",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed.1",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v4.r1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-cohort-risk",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-cohort-risk.1",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-case-control-or",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-case-control-or.1",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds.1",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v3.r3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical.1",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v4.r3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-ten",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-ten.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-five",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-five.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-twenty",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-twenty.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-six",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-six.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-003",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-003.1",
    "questionVariantId": "question.statistics-ethics.p-value.v1.r4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-040",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-040.1",
    "questionVariantId": "question.statistics-ethics.p-value.v2.r6",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-0001",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-0001.1",
    "questionVariantId": "question.statistics-ethics.p-value.v3.r4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-008",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-008.1",
    "questionVariantId": "question.statistics-ethics.p-value.v4.r3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.confidence-interval-errors-power.a-ratio-crosses",
    "nodeId": "node.gs028se.confidence-interval-errors-power.a-ratio-crosses.1",
    "questionVariantId": "question.statistics-ethics.confidence-interval.v1.r3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.confidence-interval-errors-power.a-difference-excludes",
    "nodeId": "node.gs028se.confidence-interval-errors-power.a-difference-excludes.1",
    "questionVariantId": "question.statistics-ethics.confidence-interval.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.confidence-interval-errors-power.a-precision-width",
    "nodeId": "node.gs028se.confidence-interval-errors-power.a-precision-width.1",
    "questionVariantId": "question.statistics-ethics.confidence-interval.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.confidence-interval-errors-power.a-repeated-sampling",
    "nodeId": "node.gs028se.confidence-interval-errors-power.a-repeated-sampling.1",
    "questionVariantId": "question.statistics-ethics.confidence-interval.v4",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.confidence-interval-errors-power.b-type-one",
    "nodeId": "node.gs028se.confidence-interval-errors-power.b-type-one.1",
    "questionVariantId": "question.statistics-ethics.errors-power.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.confidence-interval-errors-power.b-type-two",
    "nodeId": "node.gs028se.confidence-interval-errors-power.b-type-two.1",
    "questionVariantId": "question.statistics-ethics.errors-power.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.confidence-interval-errors-power.b-power",
    "nodeId": "node.gs028se.confidence-interval-errors-power.b-power.1",
    "questionVariantId": "question.statistics-ethics.errors-power.v3",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.gs028se.confidence-interval-errors-power.b-post-hoc",
    "nodeId": "node.gs028se.confidence-interval-errors-power.b-post-hoc.1",
    "questionVariantId": "question.statistics-ethics.errors-power.v4",
    "classification": {
      "kind": "no_test"
    }
  }
];
