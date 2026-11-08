import type {QuestionVariant} from "./pilot-schema";
export interface Stats1Definition {auditId:string;title:string;family:string;caseId:string;nodeId:string;questionVariantId:string;question:QuestionVariant;originalVariantId:string;originalConceptId:string;conceptMeaning:string;conceptVersionReason:string;employeeDiscussion:boolean;patientName:string;presentation:string;demographics?:{ageYears:number;sexLabel:"Female"|"Male"|"Not specified"};skill:string;focus:string;educationalIntent:string;holdStatus:string;}
export const QUESTION_STATS1_DEFINITIONS:Stats1Definition[]=[
  {
    "auditId": "S01",
    "title": "Choose an independent two-mean test",
    "family": "independent-t",
    "caseId": "case.gs028se.independent-t-paired-t.a-two-teams",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-teams.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v1.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.independent-t.v1.r1",
      "conceptId": "concept.statistics-ethics.independent-t",
      "stem": "Which test directly compares the two population mean healing times?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s01.key",
          "label": "Independent-samples Student t-test",
          "isCorrect": true,
          "rationale": "Separate groups with suitable continuous-data assumptions support a direct two-mean comparison.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s01.d1",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "This requires matched observations or repeated measurements on the same people; a shared investigator does not create pairs.",
          "distractorRationale": "This requires matched observations or repeated measurements on the same people; a shared investigator does not create pairs."
        },
        {
          "id": "choice.stats1.20261108.s01.d2",
          "label": "Wilcoxon rank-sum test",
          "isCorrect": false,
          "rationale": "This targets ranked distributions rather than directly testing the specified population means.",
          "distractorRationale": "This targets ranked distributions rather than directly testing the specified population means."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Groups",
            "value": "Two dressings; different patients in each group."
          },
          {
            "label": "Outcome",
            "value": "Healing time in days; approximately normal with similar variances."
          }
        ]
      },
      "explanation": "Two separate groups + suitable continuous-data assumptions -> independent-samples t-test.\nThe requested parameter is the difference between population means.\nPaired t-testing needs matched people or repeated measurements, not a shared assessor.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.s01.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.independent-t.v1",
    "originalConceptId": "concept.statistics-ethics.independent-t",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose an independent two-mean test",
    "focus": "Separate people, continuous outcome and suitable normal/variance assumptions.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S02",
    "title": "Choose an independent two-mean test",
    "family": "independent-t",
    "caseId": "case.gs028se.independent-t-paired-t.a-two-cohorts",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-cohorts.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v2.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.independent-t.v2.r1",
      "conceptId": "concept.statistics-ethics.independent-t",
      "stem": "Which test compares the two population mean blood losses?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s02.key",
          "label": "Independent-samples Student t-test",
          "isCorrect": true,
          "rationale": "Separate groups with suitable continuous-data assumptions support a direct two-mean comparison.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s02.d1",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "This requires matched observations or repeated measurements on the same people; a shared investigator does not create pairs.",
          "distractorRationale": "This requires matched observations or repeated measurements on the same people; a shared investigator does not create pairs."
        },
        {
          "id": "choice.stats1.20261108.s02.d2",
          "label": "Wilcoxon rank-sum test",
          "isCorrect": false,
          "rationale": "This targets ranked distributions rather than directly testing the specified population means.",
          "distractorRationale": "This targets ranked distributions rather than directly testing the specified population means."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Groups",
            "value": "Two hospitals; different patients in each sample."
          },
          {
            "label": "Outcome",
            "value": "Mean blood loss in mL; observations approximately normal with similar variances."
          }
        ]
      },
      "explanation": "Two separate groups + suitable continuous-data assumptions -> independent-samples t-test.\nThe requested parameter is the difference between population means.\nPaired t-testing needs matched people or repeated measurements, not a shared assessor.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.s02.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.independent-t.v2",
    "originalConceptId": "concept.statistics-ethics.independent-t",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose an independent two-mean test",
    "focus": "Patients are not matched by their shared hospital or measurement instrument.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S03",
    "title": "Choose an independent two-mean test",
    "family": "independent-t",
    "caseId": "case.gs028se.independent-t-paired-t.a-two-shifts",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-shifts.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v3.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.independent-t.v3.r1",
      "conceptId": "concept.statistics-ethics.independent-t",
      "stem": "Which test directly compares the two population mean incision lengths?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s03.key",
          "label": "Independent-samples Student t-test",
          "isCorrect": true,
          "rationale": "Separate groups with suitable continuous-data assumptions support a direct two-mean comparison.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s03.d1",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "This requires matched observations or repeated measurements on the same people; a shared investigator does not create pairs.",
          "distractorRationale": "This requires matched observations or repeated measurements on the same people; a shared investigator does not create pairs."
        },
        {
          "id": "choice.stats1.20261108.s03.d2",
          "label": "Wilcoxon rank-sum test",
          "isCorrect": false,
          "rationale": "This targets ranked distributions rather than directly testing the specified population means.",
          "distractorRationale": "This targets ranked distributions rather than directly testing the specified population means."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Groups",
            "value": "Two surgical approaches; each patient contributes to one group."
          },
          {
            "label": "Outcome",
            "value": "Incision length in cm; approximately normal with similar variances."
          }
        ]
      },
      "explanation": "Two separate groups + suitable continuous-data assumptions -> independent-samples t-test.\nThe requested parameter is the difference between population means.\nPaired t-testing needs matched people or repeated measurements, not a shared assessor.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.s03.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.independent-t.v3",
    "originalConceptId": "concept.statistics-ethics.independent-t",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose an independent two-mean test",
    "focus": "One continuous observation per person in separate groups.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S04",
    "title": "Choose an independent two-mean test",
    "family": "independent-t",
    "caseId": "case.gs028se.independent-t-paired-t.a-two-scripts",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-scripts.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v4.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.independent-t.v4.r1",
      "conceptId": "concept.statistics-ethics.independent-t",
      "stem": "Which test directly compares the two population mean walking distances?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s04.key",
          "label": "Independent-samples Student t-test",
          "isCorrect": true,
          "rationale": "Separate groups with suitable continuous-data assumptions support a direct two-mean comparison.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s04.d1",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "This requires matched observations or repeated measurements on the same people; a shared investigator does not create pairs.",
          "distractorRationale": "This requires matched observations or repeated measurements on the same people; a shared investigator does not create pairs."
        },
        {
          "id": "choice.stats1.20261108.s04.d2",
          "label": "Wilcoxon rank-sum test",
          "isCorrect": false,
          "rationale": "This targets ranked distributions rather than directly testing the specified population means.",
          "distractorRationale": "This targets ranked distributions rather than directly testing the specified population means."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Groups",
            "value": "Two rehabilitation programs; separate patients. One therapist measures everyone."
          },
          {
            "label": "Outcome",
            "value": "Walking distance in meters; approximately normal with similar variances."
          }
        ]
      },
      "explanation": "Two separate groups + suitable continuous-data assumptions -> independent-samples t-test.\nThe requested parameter is the difference between population means.\nPaired t-testing needs matched people or repeated measurements, not a shared assessor.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.s04.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.independent-t.v4",
    "originalConceptId": "concept.statistics-ethics.independent-t",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose an independent two-mean test",
    "focus": "A common therapist does not make observations paired.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S05",
    "title": "Choose a paired mean-difference test",
    "family": "paired-t",
    "caseId": "case.gs028se.independent-t-paired-t.b-same-rooms",
    "nodeId": "node.gs028se.independent-t-paired-t.b-same-rooms.1",
    "questionVariantId": "question.statistics-ethics.paired-t.v1.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.paired-t.v1.r1",
      "conceptId": "concept.statistics-ethics.paired-t",
      "stem": "Which test directly evaluates the population mean change in walking distance?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s05.key",
          "label": "Paired-samples Student t-test",
          "isCorrect": true,
          "rationale": "The analysis uses each person's or matched pair's difference; normality concerns those differences.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s05.d1",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "This discards the stated within-person or matched-pair linkage.",
          "distractorRationale": "This discards the stated within-person or matched-pair linkage."
        },
        {
          "id": "choice.stats1.20261108.s05.d2",
          "label": "Wilcoxon signed-rank test",
          "isCorrect": false,
          "rationale": "This is a ranked paired-difference procedure rather than the direct test of a mean change requested here.",
          "distractorRationale": "This is a ranked paired-difference procedure rather than the direct test of a mean change requested here."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Measurements",
            "value": "Walking distance in meters, before and after rehabilitation in the same patients."
          },
          {
            "label": "Differences",
            "value": "Approximately normal."
          }
        ]
      },
      "explanation": "Form one difference per person or matched pair.\nApproximately normal differences + a mean-change target -> paired-samples t-test.\nIndependent t-testing ignores the pairing; normality of separate series is not the paired-t requirement.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.signed-rank",
        "claim.stats1.20261108.s05.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.paired-t.v1",
    "originalConceptId": "concept.statistics-ethics.paired-t",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose a paired mean-difference test",
    "focus": "The same people supply both measurements; analyze their differences.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S06",
    "title": "Choose a paired mean-difference test",
    "family": "paired-t",
    "caseId": "case.gs028se.independent-t-paired-t.b-same-trainees",
    "nodeId": "node.gs028se.independent-t-paired-t.b-same-trainees.1",
    "questionVariantId": "question.statistics-ethics.paired-t.v2.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.paired-t.v2.r1",
      "conceptId": "concept.statistics-ethics.paired-t",
      "stem": "Which test directly evaluates the population mean difference between the scales?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s06.key",
          "label": "Paired-samples Student t-test",
          "isCorrect": true,
          "rationale": "The analysis uses each person's or matched pair's difference; normality concerns those differences.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s06.d1",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "This discards the stated within-person or matched-pair linkage.",
          "distractorRationale": "This discards the stated within-person or matched-pair linkage."
        },
        {
          "id": "choice.stats1.20261108.s06.d2",
          "label": "Wilcoxon signed-rank test",
          "isCorrect": false,
          "rationale": "This is a ranked paired-difference procedure rather than the direct test of a mean change requested here.",
          "distractorRationale": "This is a ranked paired-difference procedure rather than the direct test of a mean change requested here."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Measurements",
            "value": "Two scales measure each patient's weight in kg."
          },
          {
            "label": "Differences",
            "value": "Approximately normal."
          }
        ]
      },
      "explanation": "Form one difference per person or matched pair.\nApproximately normal differences + a mean-change target -> paired-samples t-test.\nIndependent t-testing ignores the pairing; normality of separate series is not the paired-t requirement.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.signed-rank",
        "claim.stats1.20261108.s06.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.paired-t.v2",
    "originalConceptId": "concept.statistics-ethics.paired-t",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose a paired mean-difference test",
    "focus": "Each patient links one reading from each scale.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S07",
    "title": "Choose a paired mean-difference test",
    "family": "paired-t",
    "caseId": "case.gs028se.independent-t-paired-t.b-matched-sites",
    "nodeId": "node.gs028se.independent-t-paired-t.b-matched-sites.1",
    "questionVariantId": "question.statistics-ethics.paired-t.v3.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.paired-t.v3.r1",
      "conceptId": "concept.statistics-ethics.paired-t",
      "stem": "Which test directly compares the population mean healing times using these matches?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s07.key",
          "label": "Paired-samples Student t-test",
          "isCorrect": true,
          "rationale": "The analysis uses each person's or matched pair's difference; normality concerns those differences.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s07.d1",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "This discards the stated within-person or matched-pair linkage.",
          "distractorRationale": "This discards the stated within-person or matched-pair linkage."
        },
        {
          "id": "choice.stats1.20261108.s07.d2",
          "label": "Wilcoxon signed-rank test",
          "isCorrect": false,
          "rationale": "This is a ranked paired-difference procedure rather than the direct test of a mean change requested here.",
          "distractorRationale": "This is a ranked paired-difference procedure rather than the direct test of a mean change requested here."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Measurements",
            "value": "Patients are matched one-to-one by age across two dressing groups; healing time is measured in days."
          },
          {
            "label": "Within-pair differences",
            "value": "Approximately normal."
          }
        ]
      },
      "explanation": "Form one difference per person or matched pair.\nApproximately normal differences + a mean-change target -> paired-samples t-test.\nIndependent t-testing ignores the pairing; normality of separate series is not the paired-t requirement.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.signed-rank",
        "claim.stats1.20261108.s07.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.paired-t.v3",
    "originalConceptId": "concept.statistics-ethics.paired-t",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose a paired mean-difference test",
    "focus": "Explicit one-to-one matches create the pairs even though patients differ.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S08",
    "title": "Choose a paired mean-difference test",
    "family": "paired-t",
    "caseId": "case.gs028se.independent-t-paired-t.b-same-workers",
    "nodeId": "node.gs028se.independent-t-paired-t.b-same-workers.1",
    "questionVariantId": "question.statistics-ethics.paired-t.v4.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.paired-t.v4.r1",
      "conceptId": "concept.statistics-ethics.paired-t",
      "stem": "Which test directly evaluates the population mean blood-pressure change?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s08.key",
          "label": "Paired-samples Student t-test",
          "isCorrect": true,
          "rationale": "The analysis uses each person's or matched pair's difference; normality concerns those differences.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s08.d1",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "This discards the stated within-person or matched-pair linkage.",
          "distractorRationale": "This discards the stated within-person or matched-pair linkage."
        },
        {
          "id": "choice.stats1.20261108.s08.d2",
          "label": "Wilcoxon signed-rank test",
          "isCorrect": false,
          "rationale": "This is a ranked paired-difference procedure rather than the direct test of a mean change requested here.",
          "distractorRationale": "This is a ranked paired-difference procedure rather than the direct test of a mean change requested here."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Measurements",
            "value": "The same patients have blood pressure measured before and after an intervention, in mmHg."
          },
          {
            "label": "Distribution",
            "value": "Separate readings are skewed; within-person differences are approximately normal."
          }
        ]
      },
      "explanation": "Form one difference per person or matched pair.\nApproximately normal differences + a mean-change target -> paired-samples t-test.\nIndependent t-testing ignores the pairing; normality of separate series is not the paired-t requirement.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.signed-rank",
        "claim.stats1.20261108.s08.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.paired-t.v4",
    "originalConceptId": "concept.statistics-ethics.paired-t",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose a paired mean-difference test",
    "focus": "Normality of differences, not of each separate series, determines the paired t assumption.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S09",
    "title": "Choose one omnibus mean comparison",
    "family": "one-way-anova",
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-three-teams",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-three-teams.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v1.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.one-way-anova.v1.r1",
      "conceptId": "concept.statistics-ethics.one-way-anova",
      "stem": "Which single test compares all population means?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s09.key",
          "label": "One-way analysis of variance test",
          "isCorrect": true,
          "rationale": "This supplies the requested single omnibus comparison of means across separate groups.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s09.d1",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means.",
          "distractorRationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means."
        },
        {
          "id": "choice.stats1.20261108.s09.d2",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "There are multiple separate groups, not a two-measurement pairing.",
          "distractorRationale": "There are multiple separate groups, not a two-measurement pairing."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Groups",
            "value": "Three dressings; different patients in each group."
          },
          {
            "label": "Outcome",
            "value": "healing time in days; approximately normal within groups with similar variances."
          }
        ]
      },
      "explanation": "Three or more separate groups + suitable mean-model assumptions -> one-way analysis of variance.\nIt tests whether all population means are equal; it does not identify a particular differing pair.\nA two-sample t-test compares two means, not this full omnibus question.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.one-way-anova",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.s09.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.one-way-anova.v1",
    "originalConceptId": "concept.statistics-ethics.one-way-anova",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose one omnibus mean comparison",
    "focus": "Count all groups and keep the requested analysis omnibus.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S10",
    "title": "Choose one omnibus mean comparison",
    "family": "one-way-anova",
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-four-formats",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-four-formats.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v2.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.one-way-anova.v2.r1",
      "conceptId": "concept.statistics-ethics.one-way-anova",
      "stem": "Which single test compares all population means?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s10.key",
          "label": "One-way analysis of variance test",
          "isCorrect": true,
          "rationale": "This supplies the requested single omnibus comparison of means across separate groups.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s10.d1",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means.",
          "distractorRationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means."
        },
        {
          "id": "choice.stats1.20261108.s10.d2",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "There are multiple separate groups, not a two-measurement pairing.",
          "distractorRationale": "There are multiple separate groups, not a two-measurement pairing."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Groups",
            "value": "Four wards; different patients in each group."
          },
          {
            "label": "Outcome",
            "value": "length of stay in days; approximately normal within groups with similar variances."
          }
        ]
      },
      "explanation": "Three or more separate groups + suitable mean-model assumptions -> one-way analysis of variance.\nIt tests whether all population means are equal; it does not identify a particular differing pair.\nA two-sample t-test compares two means, not this full omnibus question.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.one-way-anova",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.s10.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.one-way-anova.v2",
    "originalConceptId": "concept.statistics-ethics.one-way-anova",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose one omnibus mean comparison",
    "focus": "Count all groups and keep the requested analysis omnibus.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S11",
    "title": "Choose one omnibus mean comparison",
    "family": "one-way-anova",
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-three-sites",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-three-sites.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v3.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.one-way-anova.v3.r1",
      "conceptId": "concept.statistics-ethics.one-way-anova",
      "stem": "Which single test compares all population means?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s11.key",
          "label": "One-way analysis of variance test",
          "isCorrect": true,
          "rationale": "This supplies the requested single omnibus comparison of means across separate groups.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s11.d1",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means.",
          "distractorRationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means."
        },
        {
          "id": "choice.stats1.20261108.s11.d2",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "There are multiple separate groups, not a two-measurement pairing.",
          "distractorRationale": "There are multiple separate groups, not a two-measurement pairing."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Groups",
            "value": "Three training programs; different patients in each group."
          },
          {
            "label": "Outcome",
            "value": "task-completion time in seconds; approximately normal within groups with similar variances."
          }
        ]
      },
      "explanation": "Three or more separate groups + suitable mean-model assumptions -> one-way analysis of variance.\nIt tests whether all population means are equal; it does not identify a particular differing pair.\nA two-sample t-test compares two means, not this full omnibus question.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.one-way-anova",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.s11.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.one-way-anova.v3",
    "originalConceptId": "concept.statistics-ethics.one-way-anova",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose one omnibus mean comparison",
    "focus": "Count all groups and keep the requested analysis omnibus.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S12",
    "title": "Choose one omnibus mean comparison",
    "family": "one-way-anova",
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-five-signs",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-five-signs.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v4.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.one-way-anova.v4.r1",
      "conceptId": "concept.statistics-ethics.one-way-anova",
      "stem": "Which single test compares all population means?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s12.key",
          "label": "One-way analysis of variance test",
          "isCorrect": true,
          "rationale": "This supplies the requested single omnibus comparison of means across separate groups.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s12.d1",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means.",
          "distractorRationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means."
        },
        {
          "id": "choice.stats1.20261108.s12.d2",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "There are multiple separate groups, not a two-measurement pairing.",
          "distractorRationale": "There are multiple separate groups, not a two-measurement pairing."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Groups",
            "value": "Four devices; different patients in each group."
          },
          {
            "label": "Outcome",
            "value": "blood loss in mL; approximately normal within groups with similar variances."
          }
        ]
      },
      "explanation": "Three or more separate groups + suitable mean-model assumptions -> one-way analysis of variance.\nIt tests whether all population means are equal; it does not identify a particular differing pair.\nA two-sample t-test compares two means, not this full omnibus question.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.one-way-anova",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.s12.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.one-way-anova.v4",
    "originalConceptId": "concept.statistics-ethics.one-way-anova",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose one omnibus mean comparison",
    "focus": "Count all groups and keep the requested analysis omnibus.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S13",
    "title": "Choose a rank comparison for separate groups",
    "family": "rank-sum",
    "caseId": "case.gs028se.one-way-anova-rank-sum.b-ordinal-teams",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.b-ordinal-teams.1",
    "questionVariantId": "question.statistics-ethics.rank-sum.v1.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.rank-sum.v1.r1",
      "conceptId": "concept.statistics-ethics.rank-sum",
      "stem": "Which test compares the two outcome distributions?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s13.key",
          "label": "Wilcoxon rank-sum test",
          "isCorrect": true,
          "rationale": "Two separate groups and a distribution/rank target fit rank-sum testing.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s13.d1",
          "label": "Wilcoxon signed-rank test",
          "isCorrect": false,
          "rationale": "This requires paired differences, which these separate patients do not provide.",
          "distractorRationale": "This requires paired differences, which these separate patients do not provide."
        },
        {
          "id": "choice.stats1.20261108.s13.d2",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "This directly targets means under its assumptions, rather than the requested comparison of ranked distributions.",
          "distractorRationale": "This directly targets means under its assumptions, rather than the requested comparison of ranked distributions."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Groups",
            "value": "Two dressings; eight different patients per group."
          },
          {
            "label": "Outcome",
            "value": "healing time in days; strongly skewed continuous values."
          }
        ]
      },
      "explanation": "Small, strongly skewed samples from two separate groups -> Wilcoxon rank-sum testing.\nDo not automatically describe the result as a comparison of means or medians.\nSigned-rank testing requires within-person or matched-pair differences.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.signed-rank",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.s13.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.rank-sum.v1",
    "originalConceptId": "concept.statistics-ethics.rank-sum",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose a rank comparison for separate groups",
    "focus": "The patient groups are separate; the target is their ranked distributions.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S14",
    "title": "Choose a rank comparison for separate groups",
    "family": "rank-sum",
    "caseId": "case.gs028se.one-way-anova-rank-sum.b-skewed-delays",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.b-skewed-delays.1",
    "questionVariantId": "question.statistics-ethics.rank-sum.v2.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.rank-sum.v2.r1",
      "conceptId": "concept.statistics-ethics.rank-sum",
      "stem": "Which test compares the two outcome distributions?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s14.key",
          "label": "Wilcoxon rank-sum test",
          "isCorrect": true,
          "rationale": "Two separate groups and a distribution/rank target fit rank-sum testing.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s14.d1",
          "label": "Wilcoxon signed-rank test",
          "isCorrect": false,
          "rationale": "This requires paired differences, which these separate patients do not provide.",
          "distractorRationale": "This requires paired differences, which these separate patients do not provide."
        },
        {
          "id": "choice.stats1.20261108.s14.d2",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "This directly targets means under its assumptions, rather than the requested comparison of ranked distributions.",
          "distractorRationale": "This directly targets means under its assumptions, rather than the requested comparison of ranked distributions."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Groups",
            "value": "Two recovery programs; eight different patients per group."
          },
          {
            "label": "Outcome",
            "value": "walking distance in meters; strongly skewed continuous values."
          }
        ]
      },
      "explanation": "Small, strongly skewed samples from two separate groups -> Wilcoxon rank-sum testing.\nDo not automatically describe the result as a comparison of means or medians.\nSigned-rank testing requires within-person or matched-pair differences.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.signed-rank",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.s14.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.rank-sum.v2",
    "originalConceptId": "concept.statistics-ethics.rank-sum",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose a rank comparison for separate groups",
    "focus": "The patient groups are separate; the target is their ranked distributions.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S15",
    "title": "Choose a rank comparison for separate groups",
    "family": "rank-sum",
    "caseId": "case.gs028se.one-way-anova-rank-sum.b-independent-likert",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.b-independent-likert.1",
    "questionVariantId": "question.statistics-ethics.rank-sum.v3.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.rank-sum.v3.r1",
      "conceptId": "concept.statistics-ethics.rank-sum",
      "stem": "Which test compares the two outcome distributions?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s15.key",
          "label": "Wilcoxon rank-sum test",
          "isCorrect": true,
          "rationale": "Two separate groups and a distribution/rank target fit rank-sum testing.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s15.d1",
          "label": "Wilcoxon signed-rank test",
          "isCorrect": false,
          "rationale": "This requires paired differences, which these separate patients do not provide.",
          "distractorRationale": "This requires paired differences, which these separate patients do not provide."
        },
        {
          "id": "choice.stats1.20261108.s15.d2",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "This directly targets means under its assumptions, rather than the requested comparison of ranked distributions.",
          "distractorRationale": "This directly targets means under its assumptions, rather than the requested comparison of ranked distributions."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Groups",
            "value": "Two wards; eight different patients per group."
          },
          {
            "label": "Outcome",
            "value": "length of stay in days; strongly skewed continuous values."
          }
        ]
      },
      "explanation": "Small, strongly skewed samples from two separate groups -> Wilcoxon rank-sum testing.\nDo not automatically describe the result as a comparison of means or medians.\nSigned-rank testing requires within-person or matched-pair differences.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.signed-rank",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.s15.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.rank-sum.v3",
    "originalConceptId": "concept.statistics-ethics.rank-sum",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose a rank comparison for separate groups",
    "focus": "The patient groups are separate; the target is their ranked distributions.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S16",
    "title": "Choose a rank comparison for separate groups",
    "family": "rank-sum",
    "caseId": "case.gs028se.one-way-anova-rank-sum.b-two-queues",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.b-two-queues.1",
    "questionVariantId": "question.statistics-ethics.rank-sum.v4.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.rank-sum.v4.r1",
      "conceptId": "concept.statistics-ethics.rank-sum",
      "stem": "Which test compares the two outcome distributions?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s16.key",
          "label": "Wilcoxon rank-sum test",
          "isCorrect": true,
          "rationale": "Two separate groups and a distribution/rank target fit rank-sum testing.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s16.d1",
          "label": "Wilcoxon signed-rank test",
          "isCorrect": false,
          "rationale": "This requires paired differences, which these separate patients do not provide.",
          "distractorRationale": "This requires paired differences, which these separate patients do not provide."
        },
        {
          "id": "choice.stats1.20261108.s16.d2",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "This directly targets means under its assumptions, rather than the requested comparison of ranked distributions.",
          "distractorRationale": "This directly targets means under its assumptions, rather than the requested comparison of ranked distributions."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Groups",
            "value": "Two devices; eight different patients per group."
          },
          {
            "label": "Outcome",
            "value": "blood loss in mL; strongly skewed continuous values."
          }
        ]
      },
      "explanation": "Small, strongly skewed samples from two separate groups -> Wilcoxon rank-sum testing.\nDo not automatically describe the result as a comparison of means or medians.\nSigned-rank testing requires within-person or matched-pair differences.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.signed-rank",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.s16.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.rank-sum.v4",
    "originalConceptId": "concept.statistics-ethics.rank-sum",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose a rank comparison for separate groups",
    "focus": "The patient groups are separate; the target is their ranked distributions.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S17",
    "title": "Choose a rank comparison of within-pair change",
    "family": "signed-rank",
    "caseId": "case.gs028se.signed-rank-chi-square.a-paired-workload",
    "nodeId": "node.gs028se.signed-rank-chi-square.a-paired-workload.1",
    "questionVariantId": "question.statistics-ethics.signed-rank.v1.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.signed-rank.v1.r1",
      "conceptId": "concept.statistics-ethics.signed-rank",
      "stem": "Which test evaluates whether the median within-pair difference is zero?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s17.key",
          "label": "Wilcoxon signed-rank test",
          "isCorrect": true,
          "rationale": "Repeated or matched observations provide signed differences; their stated symmetry supports the location test.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s17.d1",
          "label": "Wilcoxon rank-sum test",
          "isCorrect": false,
          "rationale": "This treats observations as two separate groups and loses the within-pair differences.",
          "distractorRationale": "This treats observations as two separate groups and loses the within-pair differences."
        },
        {
          "id": "choice.stats1.20261108.s17.d2",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "This directly tests a mean using its difference-distribution assumptions, not the specified rank-based comparison.",
          "distractorRationale": "This directly tests a mean using its difference-distribution assumptions, not the specified rank-based comparison."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Measurements",
            "value": "Walking distance in meters, before and after training in the same patients."
          },
          {
            "label": "Within-pair differences",
            "value": "Twelve continuous differences; symmetric and strongly nonnormal."
          }
        ]
      },
      "explanation": "Pair first; rank the magnitudes of nonzero differences and retain their signs.\nSymmetric paired differences -> Wilcoxon signed-rank location test.\nRank-sum compares separate groups, so it does not use these within-pair changes.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.signed-rank",
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.s17.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.signed-rank.v1",
    "originalConceptId": "concept.statistics-ethics.signed-rank",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose a rank comparison of within-pair change",
    "focus": "Pairing plus symmetry of differences, with a rank-based location target.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S18",
    "title": "Choose a rank comparison of within-pair change",
    "family": "signed-rank",
    "caseId": "case.gs028se.signed-rank-chi-square.a-same-rooms-skewed",
    "nodeId": "node.gs028se.signed-rank-chi-square.a-same-rooms-skewed.1",
    "questionVariantId": "question.statistics-ethics.signed-rank.v2.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.signed-rank.v2.r1",
      "conceptId": "concept.statistics-ethics.signed-rank",
      "stem": "Which test evaluates whether the median within-pair difference is zero?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s18.key",
          "label": "Wilcoxon signed-rank test",
          "isCorrect": true,
          "rationale": "Repeated or matched observations provide signed differences; their stated symmetry supports the location test.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s18.d1",
          "label": "Wilcoxon rank-sum test",
          "isCorrect": false,
          "rationale": "This treats observations as two separate groups and loses the within-pair differences.",
          "distractorRationale": "This treats observations as two separate groups and loses the within-pair differences."
        },
        {
          "id": "choice.stats1.20261108.s18.d2",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "This directly tests a mean using its difference-distribution assumptions, not the specified rank-based comparison.",
          "distractorRationale": "This directly tests a mean using its difference-distribution assumptions, not the specified rank-based comparison."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Measurements",
            "value": "Weights in kg from two scales used on each patient."
          },
          {
            "label": "Within-pair differences",
            "value": "Twelve continuous differences; symmetric and strongly nonnormal."
          }
        ]
      },
      "explanation": "Pair first; rank the magnitudes of nonzero differences and retain their signs.\nSymmetric paired differences -> Wilcoxon signed-rank location test.\nRank-sum compares separate groups, so it does not use these within-pair changes.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.signed-rank",
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.s18.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.signed-rank.v2",
    "originalConceptId": "concept.statistics-ethics.signed-rank",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose a rank comparison of within-pair change",
    "focus": "Pairing plus symmetry of differences, with a rank-based location target.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S19",
    "title": "Choose a rank comparison of within-pair change",
    "family": "signed-rank",
    "caseId": "case.gs028se.signed-rank-chi-square.a-matched-dyads",
    "nodeId": "node.gs028se.signed-rank-chi-square.a-matched-dyads.1",
    "questionVariantId": "question.statistics-ethics.signed-rank.v3.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.signed-rank.v3.r1",
      "conceptId": "concept.statistics-ethics.signed-rank",
      "stem": "Which test evaluates whether the median within-pair difference is zero?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s19.key",
          "label": "Wilcoxon signed-rank test",
          "isCorrect": true,
          "rationale": "Repeated or matched observations provide signed differences; their stated symmetry supports the location test.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s19.d1",
          "label": "Wilcoxon rank-sum test",
          "isCorrect": false,
          "rationale": "This treats observations as two separate groups and loses the within-pair differences.",
          "distractorRationale": "This treats observations as two separate groups and loses the within-pair differences."
        },
        {
          "id": "choice.stats1.20261108.s19.d2",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "This directly tests a mean using its difference-distribution assumptions, not the specified rank-based comparison.",
          "distractorRationale": "This directly tests a mean using its difference-distribution assumptions, not the specified rank-based comparison."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Measurements",
            "value": "Healing times in days from one-to-one matched dressing pairs."
          },
          {
            "label": "Within-pair differences",
            "value": "Twelve continuous differences; symmetric and strongly nonnormal."
          }
        ]
      },
      "explanation": "Pair first; rank the magnitudes of nonzero differences and retain their signs.\nSymmetric paired differences -> Wilcoxon signed-rank location test.\nRank-sum compares separate groups, so it does not use these within-pair changes.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.signed-rank",
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.s19.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.signed-rank.v3",
    "originalConceptId": "concept.statistics-ethics.signed-rank",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose a rank comparison of within-pair change",
    "focus": "Pairing plus symmetry of differences, with a rank-based location target.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S20",
    "title": "Choose a rank comparison of within-pair change",
    "family": "signed-rank",
    "caseId": "case.gs028se.signed-rank-chi-square.a-pre-post-counts",
    "nodeId": "node.gs028se.signed-rank-chi-square.a-pre-post-counts.1",
    "questionVariantId": "question.statistics-ethics.signed-rank.v4.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.signed-rank.v4.r1",
      "conceptId": "concept.statistics-ethics.signed-rank",
      "stem": "Which test evaluates whether the median within-pair difference is zero?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s20.key",
          "label": "Wilcoxon signed-rank test",
          "isCorrect": true,
          "rationale": "Repeated or matched observations provide signed differences; their stated symmetry supports the location test.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s20.d1",
          "label": "Wilcoxon rank-sum test",
          "isCorrect": false,
          "rationale": "This treats observations as two separate groups and loses the within-pair differences.",
          "distractorRationale": "This treats observations as two separate groups and loses the within-pair differences."
        },
        {
          "id": "choice.stats1.20261108.s20.d2",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "This directly tests a mean using its difference-distribution assumptions, not the specified rank-based comparison.",
          "distractorRationale": "This directly tests a mean using its difference-distribution assumptions, not the specified rank-based comparison."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Measurements",
            "value": "Blood loss in mL measured by two methods on each operation."
          },
          {
            "label": "Within-pair differences",
            "value": "Twelve continuous differences; symmetric and strongly nonnormal."
          }
        ]
      },
      "explanation": "Pair first; rank the magnitudes of nonzero differences and retain their signs.\nSymmetric paired differences -> Wilcoxon signed-rank location test.\nRank-sum compares separate groups, so it does not use these within-pair changes.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.signed-rank",
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.s20.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.signed-rank.v4",
    "originalConceptId": "concept.statistics-ethics.signed-rank",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose a rank comparison of within-pair change",
    "focus": "Pairing plus symmetry of differences, with a rank-based location target.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S21",
    "title": "Choose an association test for independent categories",
    "family": "chi-square",
    "caseId": "case.gs028se.signed-rank-chi-square.b-role-by-choice",
    "nodeId": "node.gs028se.signed-rank-chi-square.b-role-by-choice.1",
    "questionVariantId": "question.statistics-ethics.chi-square.v1.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.chi-square.v1.r1",
      "conceptId": "concept.statistics-ethics.chi-square",
      "stem": "Which test assesses association between the row and column categories?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s21.key",
          "label": "Pearson chi-square test",
          "isCorrect": true,
          "rationale": "Independent categorical observations with adequately populated expected cells fit this association test.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s21.d1",
          "label": "McNemar chi-square test",
          "isCorrect": false,
          "rationale": "This is for paired binary responses, not the independent multi-category table shown.",
          "distractorRationale": "This is for paired binary responses, not the independent multi-category table shown."
        },
        {
          "id": "choice.stats1.20261108.s21.d2",
          "label": "One-way analysis of variance test",
          "isCorrect": false,
          "rationale": "Category counts are not continuous observations for comparing population means.",
          "distractorRationale": "Category counts are not continuous observations for comparing population means."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed counts; observations are independent.",
        "columnHeaders": [
          "Healed",
          "Infected",
          "Bleeding"
        ],
        "rowHeaders": [
          "Dressing A",
          "Dressing B"
        ],
        "cells": [
          [
            "30",
            "10",
            "10"
          ],
          [
            "20",
            "20",
            "10"
          ]
        ]
      },
      "explanation": "Independent categories + adequate expected counts -> Pearson chi-square association test.\nSmallest expected cell = 50 x 20 / 100 = 10.\nMcNemar testing requires linked binary observations, not these separate groups.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.chi-square",
        "claim.stats1.20261108.mcnemar",
        "claim.stats1.20261108.one-way-anova",
        "claim.stats1.20261108.s21.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.chi-square.v1",
    "originalConceptId": "concept.statistics-ethics.chi-square",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose an association test for independent categories",
    "focus": "Independent people, nominal categories and adequate expected counts.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S22",
    "title": "Choose an association test for independent categories",
    "family": "chi-square",
    "caseId": "case.gs028se.signed-rank-chi-square.b-shift-by-response",
    "nodeId": "node.gs028se.signed-rank-chi-square.b-shift-by-response.1",
    "questionVariantId": "question.statistics-ethics.chi-square.v2.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.chi-square.v2.r1",
      "conceptId": "concept.statistics-ethics.chi-square",
      "stem": "Which test assesses association between the row and column categories?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s22.key",
          "label": "Pearson chi-square test",
          "isCorrect": true,
          "rationale": "Independent categorical observations with adequately populated expected cells fit this association test.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s22.d1",
          "label": "McNemar chi-square test",
          "isCorrect": false,
          "rationale": "This is for paired binary responses, not the independent multi-category table shown.",
          "distractorRationale": "This is for paired binary responses, not the independent multi-category table shown."
        },
        {
          "id": "choice.stats1.20261108.s22.d2",
          "label": "One-way analysis of variance test",
          "isCorrect": false,
          "rationale": "Category counts are not continuous observations for comparing population means.",
          "distractorRationale": "Category counts are not continuous observations for comparing population means."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed counts; observations are independent.",
        "columnHeaders": [
          "Device A",
          "Device B",
          "Device C"
        ],
        "rowHeaders": [
          "Hospital A",
          "Hospital B"
        ],
        "cells": [
          [
            "20",
            "20",
            "20"
          ],
          [
            "30",
            "10",
            "20"
          ]
        ]
      },
      "explanation": "Independent categories + adequate expected counts -> Pearson chi-square association test.\nSmallest expected cell = 60 x 30 / 120 = 15.\nMcNemar testing requires linked binary observations, not these separate groups.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.chi-square",
        "claim.stats1.20261108.mcnemar",
        "claim.stats1.20261108.one-way-anova",
        "claim.stats1.20261108.s22.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.chi-square.v2",
    "originalConceptId": "concept.statistics-ethics.chi-square",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose an association test for independent categories",
    "focus": "Independent people, nominal categories and adequate expected counts.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S23",
    "title": "Choose an association test for independent categories",
    "family": "chi-square",
    "caseId": "case.gs028se.signed-rank-chi-square.b-badge-by-completion",
    "nodeId": "node.gs028se.signed-rank-chi-square.b-badge-by-completion.1",
    "questionVariantId": "question.statistics-ethics.chi-square.v3.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.chi-square.v3.r1",
      "conceptId": "concept.statistics-ethics.chi-square",
      "stem": "Which test assesses association between the row and column categories?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s23.key",
          "label": "Pearson chi-square test",
          "isCorrect": true,
          "rationale": "Independent categorical observations with adequately populated expected cells fit this association test.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s23.d1",
          "label": "McNemar chi-square test",
          "isCorrect": false,
          "rationale": "This is for paired binary responses, not the independent multi-category table shown.",
          "distractorRationale": "This is for paired binary responses, not the independent multi-category table shown."
        },
        {
          "id": "choice.stats1.20261108.s23.d2",
          "label": "One-way analysis of variance test",
          "isCorrect": false,
          "rationale": "Category counts are not continuous observations for comparing population means.",
          "distractorRationale": "Category counts are not continuous observations for comparing population means."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed counts; observations are independent.",
        "columnHeaders": [
          "Readmitted",
          "Not readmitted"
        ],
        "rowHeaders": [
          "Group A",
          "Group B",
          "Group C"
        ],
        "cells": [
          [
            "20",
            "30"
          ],
          [
            "10",
            "40"
          ],
          [
            "30",
            "20"
          ]
        ]
      },
      "explanation": "Independent categories + adequate expected counts -> Pearson chi-square association test.\nSmallest expected cell = 50 x 60 / 150 = 20.\nMcNemar testing requires linked binary observations, not these separate groups.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.chi-square",
        "claim.stats1.20261108.mcnemar",
        "claim.stats1.20261108.one-way-anova",
        "claim.stats1.20261108.s23.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.chi-square.v3",
    "originalConceptId": "concept.statistics-ethics.chi-square",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose an association test for independent categories",
    "focus": "Independent people, nominal categories and adequate expected counts.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S24",
    "title": "Choose an association test for independent categories",
    "family": "chi-square",
    "caseId": "case.gs028se.signed-rank-chi-square.b-site-by-category",
    "nodeId": "node.gs028se.signed-rank-chi-square.b-site-by-category.1",
    "questionVariantId": "question.statistics-ethics.chi-square.v4.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.chi-square.v4.r1",
      "conceptId": "concept.statistics-ethics.chi-square",
      "stem": "Which test assesses association between the row and column categories?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s24.key",
          "label": "Pearson chi-square test",
          "isCorrect": true,
          "rationale": "Independent categorical observations with adequately populated expected cells fit this association test.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s24.d1",
          "label": "McNemar chi-square test",
          "isCorrect": false,
          "rationale": "This is for paired binary responses, not the independent multi-category table shown.",
          "distractorRationale": "This is for paired binary responses, not the independent multi-category table shown."
        },
        {
          "id": "choice.stats1.20261108.s24.d2",
          "label": "One-way analysis of variance test",
          "isCorrect": false,
          "rationale": "Category counts are not continuous observations for comparing population means.",
          "distractorRationale": "Category counts are not continuous observations for comparing population means."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed counts; observations are independent.",
        "columnHeaders": [
          "Open",
          "Laparoscopic",
          "Robotic"
        ],
        "rowHeaders": [
          "Ward A",
          "Ward B"
        ],
        "cells": [
          [
            "20",
            "30",
            "10"
          ],
          [
            "30",
            "10",
            "20"
          ]
        ]
      },
      "explanation": "Independent categories + adequate expected counts -> Pearson chi-square association test.\nSmallest expected cell = 60 x 30 / 120 = 15.\nMcNemar testing requires linked binary observations, not these separate groups.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.chi-square",
        "claim.stats1.20261108.mcnemar",
        "claim.stats1.20261108.one-way-anova",
        "claim.stats1.20261108.s24.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.chi-square.v4",
    "originalConceptId": "concept.statistics-ethics.chi-square",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose an association test for independent categories",
    "focus": "Independent people, nominal categories and adequate expected counts.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S25",
    "title": "Choose an exact test for sparse independent counts",
    "family": "fisher-exact",
    "caseId": "case.gs028se.fisher-exact-study-design.a-rare-event",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-rare-event.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v1.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.fisher-exact.v1.r1",
      "conceptId": "concept.statistics-ethics.fisher-exact",
      "stem": "Which test compares the event proportions?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s25.key",
          "label": "Fisher exact test",
          "isCorrect": true,
          "rationale": "The event cells are sparse in a 2x2 table from separate groups; exact testing avoids the poor large-sample approximation.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s25.d1",
          "label": "Pearson chi-square test",
          "isCorrect": false,
          "rationale": "Its large-sample approximation is unreliable for these tiny expected event counts.",
          "distractorRationale": "Its large-sample approximation is unreliable for these tiny expected event counts."
        },
        {
          "id": "choice.stats1.20261108.s25.d2",
          "label": "McNemar chi-square test",
          "isCorrect": false,
          "rationale": "The groups are separate rather than paired binary observations.",
          "distractorRationale": "The groups are separate rather than paired binary observations."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed counts from two independently sampled groups.",
        "columnHeaders": [
          "Event",
          "No event"
        ],
        "rowHeaders": [
          "Group A",
          "Group B"
        ],
        "cells": [
          [
            "0",
            "8"
          ],
          [
            "2",
            "6"
          ]
        ]
      },
      "explanation": "Sparse independent 2x2 counts -> Fisher exact test.\nExpected events = 1 per group.\nPearson chi-square relies on an unreliable large-sample approximation for these tiny expected cells.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.fisher-exact",
        "claim.stats1.20261108.chi-square",
        "claim.stats1.20261108.mcnemar",
        "claim.stats1.20261108.s25.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.fisher-exact.v1",
    "originalConceptId": "concept.statistics-ethics.fisher-exact",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose an exact test for sparse independent counts",
    "focus": "Infer sparsity from the counts instead of receiving an eligibility label.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S26",
    "title": "Choose an exact test for sparse independent counts",
    "family": "fisher-exact",
    "caseId": "case.gs028se.fisher-exact-study-design.a-tiny-pilot",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-tiny-pilot.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v2.r4",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.fisher-exact.v2.r4",
      "conceptId": "concept.statistics-ethics.fisher-exact",
      "stem": "Which test compares the event proportions?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s26.key",
          "label": "Fisher exact test",
          "isCorrect": true,
          "rationale": "The event cells are sparse in a 2x2 table from separate groups; exact testing avoids the poor large-sample approximation.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s26.d1",
          "label": "Pearson chi-square test",
          "isCorrect": false,
          "rationale": "Its large-sample approximation is unreliable for these tiny expected event counts.",
          "distractorRationale": "Its large-sample approximation is unreliable for these tiny expected event counts."
        },
        {
          "id": "choice.stats1.20261108.s26.d2",
          "label": "McNemar chi-square test",
          "isCorrect": false,
          "rationale": "The groups are separate rather than paired binary observations.",
          "distractorRationale": "The groups are separate rather than paired binary observations."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed counts from two independently sampled groups.",
        "columnHeaders": [
          "Event",
          "No event"
        ],
        "rowHeaders": [
          "Group A",
          "Group B"
        ],
        "cells": [
          [
            "1",
            "9"
          ],
          [
            "0",
            "10"
          ]
        ]
      },
      "explanation": "Sparse independent 2x2 counts -> Fisher exact test.\nExpected events = 0.5 per group.\nPearson chi-square relies on an unreliable large-sample approximation for these tiny expected cells.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.fisher-exact",
        "claim.stats1.20261108.chi-square",
        "claim.stats1.20261108.mcnemar",
        "claim.stats1.20261108.s26.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.fisher-exact.v2.r3",
    "originalConceptId": "concept.statistics-ethics.fisher-exact",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose an exact test for sparse independent counts",
    "focus": "Infer sparsity from the counts instead of receiving an eligibility label.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S27",
    "title": "Choose an exact test for sparse independent counts",
    "family": "fisher-exact",
    "caseId": "case.gs028se.fisher-exact-study-design.a-sparse-exposure",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-sparse-exposure.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v3.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.fisher-exact.v3.r1",
      "conceptId": "concept.statistics-ethics.fisher-exact",
      "stem": "Which test compares the event proportions?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s27.key",
          "label": "Fisher exact test",
          "isCorrect": true,
          "rationale": "The event cells are sparse in a 2x2 table from separate groups; exact testing avoids the poor large-sample approximation.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s27.d1",
          "label": "Pearson chi-square test",
          "isCorrect": false,
          "rationale": "Its large-sample approximation is unreliable for these tiny expected event counts.",
          "distractorRationale": "Its large-sample approximation is unreliable for these tiny expected event counts."
        },
        {
          "id": "choice.stats1.20261108.s27.d2",
          "label": "McNemar chi-square test",
          "isCorrect": false,
          "rationale": "The groups are separate rather than paired binary observations.",
          "distractorRationale": "The groups are separate rather than paired binary observations."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed counts from two independently sampled groups.",
        "columnHeaders": [
          "Event",
          "No event"
        ],
        "rowHeaders": [
          "Group A",
          "Group B"
        ],
        "cells": [
          [
            "0",
            "10"
          ],
          [
            "2",
            "8"
          ]
        ]
      },
      "explanation": "Sparse independent 2x2 counts -> Fisher exact test.\nExpected events = 1 per group.\nPearson chi-square relies on an unreliable large-sample approximation for these tiny expected cells.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.fisher-exact",
        "claim.stats1.20261108.chi-square",
        "claim.stats1.20261108.mcnemar",
        "claim.stats1.20261108.s27.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.fisher-exact.v3",
    "originalConceptId": "concept.statistics-ethics.fisher-exact",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose an exact test for sparse independent counts",
    "focus": "Infer sparsity from the counts instead of receiving an eligibility label.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S28",
    "title": "Choose an exact test for sparse independent counts",
    "family": "fisher-exact",
    "caseId": "case.gs028se.fisher-exact-study-design.a-small-response",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-small-response.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v4.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.fisher-exact.v4.r1",
      "conceptId": "concept.statistics-ethics.fisher-exact",
      "stem": "Which test compares the event proportions?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s28.key",
          "label": "Fisher exact test",
          "isCorrect": true,
          "rationale": "The event cells are sparse in a 2x2 table from separate groups; exact testing avoids the poor large-sample approximation.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s28.d1",
          "label": "Pearson chi-square test",
          "isCorrect": false,
          "rationale": "Its large-sample approximation is unreliable for these tiny expected event counts.",
          "distractorRationale": "Its large-sample approximation is unreliable for these tiny expected event counts."
        },
        {
          "id": "choice.stats1.20261108.s28.d2",
          "label": "McNemar chi-square test",
          "isCorrect": false,
          "rationale": "The groups are separate rather than paired binary observations.",
          "distractorRationale": "The groups are separate rather than paired binary observations."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed counts from two independently sampled groups.",
        "columnHeaders": [
          "Event",
          "No event"
        ],
        "rowHeaders": [
          "Group A",
          "Group B"
        ],
        "cells": [
          [
            "1",
            "11"
          ],
          [
            "0",
            "12"
          ]
        ]
      },
      "explanation": "Sparse independent 2x2 counts -> Fisher exact test.\nExpected events = 0.5 per group.\nPearson chi-square relies on an unreliable large-sample approximation for these tiny expected cells.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.fisher-exact",
        "claim.stats1.20261108.chi-square",
        "claim.stats1.20261108.mcnemar",
        "claim.stats1.20261108.s28.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.fisher-exact.v4",
    "originalConceptId": "concept.statistics-ethics.fisher-exact",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Choose an exact test for sparse independent counts",
    "focus": "Infer sparsity from the counts instead of receiving an eligibility label.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S29",
    "title": "Identify one study design",
    "family": "study-design",
    "caseId": "case.gs028se.fisher-exact-study-design.b-cohort-followup",
    "nodeId": "node.gs028se.fisher-exact-study-design.b-cohort-followup.1",
    "questionVariantId": "question.statistics-ethics.study-design.v1.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.study-design.v1.r1",
      "conceptId": "concept.statistics-ethics.study-design",
      "stem": "What is the study design?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s29.key",
          "label": "Randomized trial",
          "isCorrect": true,
          "rationale": "Investigators assign the intervention by chance.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s29.d1",
          "label": "Cohort study",
          "isCorrect": false,
          "rationale": "This observational classification would omit the investigator's random assignment.",
          "distractorRationale": "This observational classification would omit the investigator's random assignment."
        },
        {
          "id": "choice.stats1.20261108.s29.d2",
          "label": "Case-control study",
          "isCorrect": false,
          "rationale": "Participants were not selected because they already had or lacked the outcome.",
          "distractorRationale": "Participants were not selected because they already had or lacked the outcome."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Study",
            "value": "Investigators assign patients to two dressings by a random sequence, then record wound infections."
          }
        ]
      },
      "explanation": "Intervention assigned by chance -> randomized trial.\nHere, the investigator determines the dressing allocation.\nA cohort study observes exposure rather than assigning it randomly.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.study-design",
        "claim.stats1.20261108.s29.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.study-design.v1",
    "originalConceptId": "concept.statistics-ethics.study-design",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Identify one study design",
    "focus": "The sampling/assignment structure, not the disease label or use of old records.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S30",
    "title": "Identify one study design",
    "family": "study-design",
    "caseId": "case.gs028se.fisher-exact-study-design.b-random-scripts",
    "nodeId": "node.gs028se.fisher-exact-study-design.b-random-scripts.1",
    "questionVariantId": "question.statistics-ethics.study-design.v2.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.study-design.v2.r1",
      "conceptId": "concept.statistics-ethics.study-design",
      "stem": "What is the study design?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s30.key",
          "label": "Cohort study",
          "isCorrect": true,
          "rationale": "Groups are defined by exposure and subsequent outcomes are compared.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s30.d1",
          "label": "Case-control study",
          "isCorrect": false,
          "rationale": "This would select groups by outcome, not by the earlier exposure.",
          "distractorRationale": "This would select groups by outcome, not by the earlier exposure."
        },
        {
          "id": "choice.stats1.20261108.s30.d2",
          "label": "Cross-sectional study",
          "isCorrect": false,
          "rationale": "Exposure precedes the subsequently recorded outcome rather than both being assessed at one time.",
          "distractorRationale": "Exposure precedes the subsequently recorded outcome rather than both being assessed at one time."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Study",
            "value": "Investigators group old charts by preoperative smoking status, then compare the recorded postoperative infections."
          }
        ]
      },
      "explanation": "Sampling by exposure before the outcome -> cohort study.\nHistorical records do not turn an exposure-defined cohort into a case-control study.\nCase-control sampling starts with infection status, not smoking status.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.study-design",
        "claim.stats1.20261108.s30.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.study-design.v2",
    "originalConceptId": "concept.statistics-ethics.study-design",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Identify one study design",
    "focus": "The sampling/assignment structure, not the disease label or use of old records.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S31",
    "title": "Identify one study design",
    "family": "study-design",
    "caseId": "case.gs028se.fisher-exact-study-design.b-case-control",
    "nodeId": "node.gs028se.fisher-exact-study-design.b-case-control.1",
    "questionVariantId": "question.statistics-ethics.study-design.v3.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.study-design.v3.r1",
      "conceptId": "concept.statistics-ethics.study-design",
      "stem": "What is the study design?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s31.key",
          "label": "Case-control study",
          "isCorrect": true,
          "rationale": "Sampling begins with outcome groups and then compares earlier exposure.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s31.d1",
          "label": "Cohort study",
          "isCorrect": false,
          "rationale": "This would begin with exposure groups rather than infection status.",
          "distractorRationale": "This would begin with exposure groups rather than infection status."
        },
        {
          "id": "choice.stats1.20261108.s31.d2",
          "label": "Cross-sectional study",
          "isCorrect": false,
          "rationale": "The study reconstructs earlier exposure after selecting cases and controls.",
          "distractorRationale": "The study reconstructs earlier exposure after selecting cases and controls."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Study",
            "value": "Investigators select patients with wound infections and patients without infections, then compare previous smoking histories."
          }
        ]
      },
      "explanation": "Sampling by outcome, then examining prior exposure -> case-control study.\nInfection status selects the two groups.\nA cohort begins with exposure groups; this study begins with the outcome.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.study-design",
        "claim.stats1.20261108.s31.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.study-design.v3",
    "originalConceptId": "concept.statistics-ethics.study-design",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Identify one study design",
    "focus": "The sampling/assignment structure, not the disease label or use of old records.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S32",
    "title": "Identify one study design",
    "family": "study-design",
    "caseId": "case.gs028se.fisher-exact-study-design.b-cross-sectional",
    "nodeId": "node.gs028se.fisher-exact-study-design.b-cross-sectional.1",
    "questionVariantId": "question.statistics-ethics.study-design.v4.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.study-design.v4.r1",
      "conceptId": "concept.statistics-ethics.study-design",
      "stem": "What is the study design?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s32.key",
          "label": "Cross-sectional study",
          "isCorrect": true,
          "rationale": "Exposure and outcome are assessed at one sampling visit.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s32.d1",
          "label": "Cohort study",
          "isCorrect": false,
          "rationale": "There is no later outcome observation after an exposure-defined starting point.",
          "distractorRationale": "There is no later outcome observation after an exposure-defined starting point."
        },
        {
          "id": "choice.stats1.20261108.s32.d2",
          "label": "Case-control study",
          "isCorrect": false,
          "rationale": "Sampling is not selected by outcome status.",
          "distractorRationale": "Sampling is not selected by outcome status."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Study",
            "value": "At one clinic survey, investigators measure smoking status and current wound symptoms in every respondent."
          }
        ]
      },
      "explanation": "Exposure and outcome measured at one sampling time -> cross-sectional study.\nThe survey does not follow an exposure-defined group for a later outcome.\nA cohort requires an exposure-to-outcome sequence, not this one-time snapshot.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.study-design",
        "claim.stats1.20261108.s32.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.study-design.v4",
    "originalConceptId": "concept.statistics-ethics.study-design",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Identify one study design",
    "focus": "The sampling/assignment structure, not the disease label or use of old records.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S33",
    "title": "Recognize confounding by illness severity",
    "family": "bias-confounding",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.a-baseline-shift",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.a-baseline-shift.1",
    "questionVariantId": "question.statistics-ethics.bias-confounding.v1.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.bias-confounding.v1.r1",
      "conceptId": "concept.statistics-ethics.bias-confounding",
      "stem": "What primarily threatens attribution of the healing difference to dressing choice?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s33.key",
          "label": "Confounding bias",
          "isCorrect": true,
          "rationale": "Illness severity is linked to the chosen dressing and independently affects the outcome.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s33.d1",
          "label": "Recall bias",
          "isCorrect": false,
          "rationale": "The problem is not differential memory of an earlier exposure.",
          "distractorRationale": "The problem is not differential memory of an earlier exposure."
        },
        {
          "id": "choice.stats1.20261108.s33.d2",
          "label": "Observer bias",
          "isCorrect": false,
          "rationale": "The stated problem is a patient factor, not how an assessor records healing.",
          "distractorRationale": "The stated problem is a patient factor, not how an assessor records healing."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Comparison",
            "value": "Sicker patients receive dressing A more often. Illness severity also delays healing."
          }
        ]
      },
      "explanation": "Confounding: a factor is associated with both exposure and outcome.\nSeverity affects dressing selection and healing, mixing their effects.\nRecall bias concerns reporting prior exposure, not this severity imbalance.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.confounding",
        "claim.stats1.20261108.recall",
        "claim.stats1.20261108.measurement",
        "claim.stats1.20261108.s33.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.bias-confounding.v1",
    "originalConceptId": "concept.statistics-ethics.bias-confounding",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Recognize confounding by illness severity",
    "focus": "The same patient factor affects exposure choice and outcome.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S34",
    "title": "Recognize outcome-dependent recall",
    "family": "bias-confounding",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.a-night-excluded",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.a-night-excluded.1",
    "questionVariantId": "question.statistics-ethics.bias-confounding.v2.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.bias-confounding.v2.r1",
      "conceptId": "concept.statistics-ethics.bias-confounding",
      "stem": "Which bias primarily affects the interview comparison?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s34.key",
          "label": "Recall bias",
          "isCorrect": true,
          "rationale": "Reporting of the earlier exposure differs with the later outcome despite the diary record.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s34.d1",
          "label": "Selection bias",
          "isCorrect": false,
          "rationale": "The supplied discrepancy concerns exposure reports, not which people entered the study.",
          "distractorRationale": "The supplied discrepancy concerns exposure reports, not which people entered the study."
        },
        {
          "id": "choice.stats1.20261108.s34.d2",
          "label": "Confounding bias",
          "isCorrect": false,
          "rationale": "A shared underlying patient factor is not the described cause of the diary-interview discrepancy.",
          "distractorRationale": "A shared underlying patient factor is not the described cause of the diary-interview discrepancy."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Records",
            "value": "Diaries show equal preoperative skin-cut exposure in cases and controls."
          },
          {
            "label": "Later interviews",
            "value": "Patients with infection report more earlier skin cuts than patients without infection."
          }
        ]
      },
      "explanation": "Recall bias: reporting of prior exposure differs by outcome status.\nThe diary-interview discrepancy depends on whether infection occurred.\nSelection bias concerns entry or response, not this altered exposure report.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.recall",
        "claim.stats1.20261108.selection",
        "claim.stats1.20261108.confounding",
        "claim.stats1.20261108.s34.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.bias-confounding.v2",
    "originalConceptId": "concept.statistics-ethics.bias-confounding",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Recognize outcome-dependent recall",
    "focus": "The earlier diary and later interview disagree according to the known outcome.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S35",
    "title": "Recognize outcome-related survey response",
    "family": "bias-confounding",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.a-recall-timing",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.a-recall-timing.1",
    "questionVariantId": "question.statistics-ethics.bias-confounding.v3.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.bias-confounding.v3.r1",
      "conceptId": "concept.statistics-ethics.bias-confounding",
      "stem": "Which bias threatens the survey estimate of recovery?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s35.key",
          "label": "Selection bias",
          "isCorrect": true,
          "rationale": "Response differs by recovery outcome, producing an unrepresentative respondent sample.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s35.d1",
          "label": "Recall bias",
          "isCorrect": false,
          "rationale": "The information identifies who responds, not differing memory accuracy.",
          "distractorRationale": "The information identifies who responds, not differing memory accuracy."
        },
        {
          "id": "choice.stats1.20261108.s35.d2",
          "label": "Observer bias",
          "isCorrect": false,
          "rationale": "The information does not describe outcome-assessment differences by observer.",
          "distractorRationale": "The information does not describe outcome-assessment differences by observer."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed counts; all patients invited.",
        "columnHeaders": [
          "Excellent recovery",
          "Poor recovery"
        ],
        "rowHeaders": [
          "All patients",
          "Survey respondents"
        ],
        "cells": [
          [
            "50",
            "50"
          ],
          [
            "40",
            "10"
          ]
        ]
      },
      "explanation": "Selection bias: participation is related to the outcome being estimated.\nResponse is 40/50 = 80% after excellent recovery and 10/50 = 20% after poor recovery.\nInviting everyone does not correct unequal response.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.selection",
        "claim.stats1.20261108.recall",
        "claim.stats1.20261108.measurement",
        "claim.stats1.20261108.s35.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.bias-confounding.v3",
    "originalConceptId": "concept.statistics-ethics.bias-confounding",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Recognize outcome-related survey response",
    "focus": "Compare the respondents with the invited cohort, not merely the favorable response count.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S36",
    "title": "Recognize differential measurement error",
    "family": "bias-confounding",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.a-adjusted-model",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.a-adjusted-model.1",
    "questionVariantId": "question.statistics-ethics.bias-confounding.v4.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.bias-confounding.v4.r1",
      "conceptId": "concept.statistics-ethics.bias-confounding",
      "stem": "Which bias primarily affects the between-group blood-pressure comparison?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s36.key",
          "label": "Measurement bias",
          "isCorrect": true,
          "rationale": "A systematic device difference is tied to group assignment and distorts the measured comparison.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s36.d1",
          "label": "Confounding bias",
          "isCorrect": false,
          "rationale": "The stated cause is instrument error, not a patient characteristic affecting exposure and true pressure.",
          "distractorRationale": "The stated cause is instrument error, not a patient characteristic affecting exposure and true pressure."
        },
        {
          "id": "choice.stats1.20261108.s36.d2",
          "label": "Selection bias",
          "isCorrect": false,
          "rationale": "The supplied facts concern measurement, not selection into the sample.",
          "distractorRationale": "The supplied facts concern measurement, not selection into the sample."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Calibration",
            "value": "Device A reads 10 mmHg above the reference; device B matches the reference."
          },
          {
            "label": "Study use",
            "value": "The intervention group uses A; the control group uses B."
          }
        ]
      },
      "explanation": "Measurement bias: systematic measurement error differs by group.\nA contributes a constructed 10 mmHg measurement offset to one group.\nThis is an instrument error, rather than confounding by a patient factor.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.measurement",
        "claim.stats1.20261108.confounding",
        "claim.stats1.20261108.selection",
        "claim.stats1.20261108.s36.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.bias-confounding.v4",
    "originalConceptId": "concept.statistics-ethics.bias-confounding",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Recognize differential measurement error",
    "focus": "Calibration error and device allocation together distort the group comparison.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S37",
    "title": "Calculate sensitivity",
    "family": "sensitivity-specificity",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-90.1",
    "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v1.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.sensitivity-specificity.v1.r1",
      "conceptId": "concept.statistics-ethics.sensitivity-specificity",
      "stem": "What is the sensitivity?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s37.key",
          "label": "60%",
          "isCorrect": true,
          "rationale": "Sensitivity = 30 / (30 + 20) = 60%.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s37.d1",
          "label": "40%",
          "isCorrect": false,
          "rationale": "This is the false-negative fraction, 20 / 50.",
          "distractorRationale": "This is the false-negative fraction, 20 / 50."
        },
        {
          "id": "choice.stats1.20261108.s37.d2",
          "label": "75%",
          "isCorrect": false,
          "rationale": "This is PPV, 30 / (30 + 10).",
          "distractorRationale": "This is PPV, 30 / (30 + 10)."
        },
        {
          "id": "choice.stats1.20261108.s37.d3",
          "label": "80%",
          "isCorrect": false,
          "rationale": "This is specificity, 40 / (40 + 10).",
          "distractorRationale": "This is specificity, 40 / (40 + 10)."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed screening data",
        "columnHeaders": [
          "Reference positive",
          "Reference negative"
        ],
        "rowHeaders": [
          "Test positive",
          "Test negative"
        ],
        "cells": [
          [
            "30",
            "10"
          ],
          [
            "20",
            "40"
          ]
        ]
      },
      "explanation": "Sensitivity = true positives / all reference positives.\n30 / (30 + 20) = 30 / 50 = 60%.\n75% is PPV: its denominator is positive tests, not reference-positive patients.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.sensitivity",
        "claim.stats1.20261108.specificity",
        "claim.stats1.20261108.false-negative",
        "claim.stats1.20261108.ppv",
        "claim.stats1.20261108.s37.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.sensitivity-specificity.v1",
    "originalConceptId": "concept.statistics-ethics.sensitivity-specificity",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": false,
    "patientName": "Hannah Lewis",
    "presentation": "{patientName}, 58 F, reviews study data in clinic.",
    "demographics": {
      "ageYears": 58,
      "sexLabel": "Female"
    },
    "skill": "Calculate sensitivity",
    "focus": "Condition on reference positivity, not on the test result.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S38",
    "title": "Calculate specificity",
    "family": "sensitivity-specificity",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.b-specificity-95.1",
    "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v2.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.sensitivity-specificity.v2.r1",
      "conceptId": "concept.statistics-ethics.sensitivity-specificity",
      "stem": "What is the specificity?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s38.key",
          "label": "80%",
          "isCorrect": true,
          "rationale": "Specificity = 80 / (80 + 20) = 80%.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s38.d1",
          "label": "90%",
          "isCorrect": false,
          "rationale": "This is sensitivity, 90 / (90 + 10).",
          "distractorRationale": "This is sensitivity, 90 / (90 + 10)."
        },
        {
          "id": "choice.stats1.20261108.s38.d2",
          "label": "20%",
          "isCorrect": false,
          "rationale": "This is the false-positive fraction, 20 / 100.",
          "distractorRationale": "This is the false-positive fraction, 20 / 100."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed screening data",
        "columnHeaders": [
          "Reference positive",
          "Reference negative"
        ],
        "rowHeaders": [
          "Test positive",
          "Test negative"
        ],
        "cells": [
          [
            "90",
            "20"
          ],
          [
            "10",
            "80"
          ]
        ]
      },
      "explanation": "Specificity = true negatives / all reference negatives.\n80 / (80 + 20) = 80%.\n90% is sensitivity and uses the other reference group.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.specificity",
        "claim.stats1.20261108.sensitivity",
        "claim.stats1.20261108.s38.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.sensitivity-specificity.v2",
    "originalConceptId": "concept.statistics-ethics.sensitivity-specificity",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": false,
    "patientName": "Owen Miller",
    "presentation": "{patientName}, 29 M, reviews study data in clinic.",
    "demographics": {
      "ageYears": 29,
      "sexLabel": "Male"
    },
    "skill": "Calculate specificity",
    "focus": "Condition on reference negativity.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S39",
    "title": "Calculate sensitivity from the reference-positive subgroup",
    "family": "sensitivity-specificity",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.b-sensitivity-80.1",
    "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v3.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.sensitivity-specificity.v3.r1",
      "conceptId": "concept.statistics-ethics.sensitivity-specificity",
      "stem": "What is the sensitivity?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s39.key",
          "label": "20%",
          "isCorrect": true,
          "rationale": "Sensitivity = 20 / (20 + 80) = 20%.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s39.d1",
          "label": "25%",
          "isCorrect": false,
          "rationale": "20 / 80 is an event-to-nonevent ratio, not a proportion of all reference positives.",
          "distractorRationale": "20 / 80 is an event-to-nonevent ratio, not a proportion of all reference positives."
        },
        {
          "id": "choice.stats1.20261108.s39.d2",
          "label": "80%",
          "isCorrect": false,
          "rationale": "This is the false-negative fraction in the reference-positive group.",
          "distractorRationale": "This is the false-negative fraction in the reference-positive group."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Reference-positive patients",
            "value": "20 test positive; 80 test negative."
          }
        ]
      },
      "explanation": "Sensitivity uses everyone with the reference condition.\n20 / (20 + 80) = 20%.\n25% divides positives by negatives instead of by their total.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.sensitivity",
        "claim.stats1.20261108.false-negative",
        "claim.stats1.20261108.odds-ratio",
        "claim.stats1.20261108.s39.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.sensitivity-specificity.v3",
    "originalConceptId": "concept.statistics-ethics.sensitivity-specificity",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": false,
    "patientName": "Nora Brooks",
    "presentation": "{patientName}, 72 F, reviews study data in clinic.",
    "demographics": {
      "ageYears": 72,
      "sexLabel": "Female"
    },
    "skill": "Calculate sensitivity from the reference-positive subgroup",
    "focus": "Use the subgroup total, not positives divided by negatives.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S40",
    "title": "Calculate the false-negative rate",
    "family": "sensitivity-specificity",
    "caseId": "case.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70",
    "nodeId": "node.gs028se.bias-confounding-sensitivity-specificity.b-specificity-70.1",
    "questionVariantId": "question.statistics-ethics.sensitivity-specificity.v4.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.sensitivity-specificity.v4.r1",
      "conceptId": "concept.statistics-ethics.sensitivity-specificity",
      "stem": "What is the false-negative rate among reference-positive patients?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s40.key",
          "label": "20%",
          "isCorrect": true,
          "rationale": "False negatives / all reference positives = 20 / 100 = 20%.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s40.d1",
          "label": "80%",
          "isCorrect": false,
          "rationale": "This is sensitivity, the positive fraction of the same reference-positive group.",
          "distractorRationale": "This is sensitivity, the positive fraction of the same reference-positive group."
        },
        {
          "id": "choice.stats1.20261108.s40.d2",
          "label": "25%",
          "isCorrect": false,
          "rationale": "20 / 80 divides false negatives by true positives rather than their total.",
          "distractorRationale": "20 / 80 divides false negatives by true positives rather than their total."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Reference-positive patients",
            "value": "80 test positive; 20 test negative."
          }
        ]
      },
      "explanation": "False-negative rate = false negatives / all reference positives = 1 - sensitivity.\n20 / (80 + 20) = 20%.\n80% is sensitivity, the complementary fraction.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.false-negative",
        "claim.stats1.20261108.sensitivity",
        "claim.stats1.20261108.s40.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.sensitivity-specificity.v4",
    "originalConceptId": "concept.statistics-ethics.sensitivity-specificity",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": false,
    "patientName": "Gavin Price",
    "presentation": "{patientName}, 42 M, reviews study data in clinic.",
    "demographics": {
      "ageYears": 42,
      "sexLabel": "Male"
    },
    "skill": "Calculate the false-negative rate",
    "focus": "A negative result in the reference-positive subgroup is the error of interest.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S41",
    "title": "Calculate positive predictive value",
    "family": "predictive-value-prevalence",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-higher-prevalence.1",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v1.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.predictive-value-prevalence.v1.r1",
      "conceptId": "concept.statistics-ethics.predictive-value-prevalence",
      "stem": "What is the positive predictive value?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s41.key",
          "label": "80%",
          "isCorrect": true,
          "rationale": "PPV = 40 / (40 + 10) = 80%.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s41.d1",
          "label": "40%",
          "isCorrect": false,
          "rationale": "This is sensitivity, 40 / (40 + 60).",
          "distractorRationale": "This is sensitivity, 40 / (40 + 60)."
        },
        {
          "id": "choice.stats1.20261108.s41.d2",
          "label": "90%",
          "isCorrect": false,
          "rationale": "This is specificity, 90 / (90 + 10).",
          "distractorRationale": "This is specificity, 90 / (90 + 10)."
        },
        {
          "id": "choice.stats1.20261108.s41.d3",
          "label": "20%",
          "isCorrect": false,
          "rationale": "This is the reference-negative fraction among positive tests.",
          "distractorRationale": "This is the reference-negative fraction among positive tests."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed screening data",
        "columnHeaders": [
          "Reference positive",
          "Reference negative"
        ],
        "rowHeaders": [
          "Test positive",
          "Test negative"
        ],
        "cells": [
          [
            "40",
            "10"
          ],
          [
            "60",
            "90"
          ]
        ]
      },
      "explanation": "PPV = true positives / all positive tests.\n40 / (40 + 10) = 40 / 50 = 80%.\n40% is sensitivity: it starts with reference-positive patients instead of positive tests.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.ppv",
        "claim.stats1.20261108.sensitivity",
        "claim.stats1.20261108.specificity",
        "claim.stats1.20261108.s41.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.predictive-value-prevalence.v1",
    "originalConceptId": "concept.statistics-ethics.predictive-value-prevalence",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": false,
    "patientName": "Elena Reed",
    "presentation": "{patientName}, 29 F, reviews study data in clinic.",
    "demographics": {
      "ageYears": 29,
      "sexLabel": "Female"
    },
    "skill": "Calculate positive predictive value",
    "focus": "Start with the positive-test row.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S42",
    "title": "Use the collection cohort for PPV",
    "family": "predictive-value-prevalence",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-lower-prevalence.1",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v2.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.predictive-value-prevalence.v2.r2",
      "conceptId": "concept.predictive-value.collection-population-denominator.v1",
      "stem": "What is the positive predictive value for this specimen's collection cohort?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s42.key",
          "label": "80%",
          "isCorrect": true,
          "rationale": "The clinic was the collection cohort: 40 / (40 + 10) = 80%.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s42.d1",
          "label": "90%",
          "isCorrect": false,
          "rationale": "This uses the later ICU cohort, 90 / (90 + 10).",
          "distractorRationale": "This uses the later ICU cohort, 90 / (90 + 10)."
        },
        {
          "id": "choice.stats1.20261108.s42.d2",
          "label": "20%",
          "isCorrect": false,
          "rationale": "This reverses the reference outcome among the clinic's positive tests.",
          "distractorRationale": "This reverses the reference outcome among the clinic's positive tests."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed positive-test counts. Specimen collected in clinic before transfer to ICU.",
        "columnHeaders": [
          "Reference positive",
          "Reference negative"
        ],
        "rowHeaders": [
          "Clinic",
          "ICU"
        ],
        "cells": [
          [
            "40",
            "10"
          ],
          [
            "90",
            "10"
          ]
        ]
      },
      "explanation": "Use the cohort at collection, not the later ward.\nPPV = true positives / positive tests = 40 / (40 + 10) = 80%.\n90% comes from the ICU cohort, where this specimen was not collected.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.collection",
        "claim.stats1.20261108.ppv",
        "claim.stats1.20261108.s42.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.predictive-value-prevalence.v2.r1",
    "originalConceptId": "concept.predictive-value.collection-population-denominator.v1",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same collection-population and positive-result denominator objective. Retain the collection-before-transfer discriminator; remove the clinical backstory and extra calculations.",
    "employeeDiscussion": false,
    "patientName": "Daniel Reed",
    "presentation": "{patientName}, 67 M, reviews study data in clinic.",
    "demographics": {
      "ageYears": 67,
      "sexLabel": "Male"
    },
    "skill": "Use the collection cohort for PPV",
    "focus": "Collection precedes transfer; select the clinic row and its positive-result denominator.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S43",
    "title": "Relate PPV to tested-population prevalence",
    "family": "predictive-value-prevalence",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-ppv-table.1",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v3.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.predictive-value-prevalence.v3.r1",
      "conceptId": "concept.statistics-ethics.predictive-value-prevalence",
      "stem": "Which clinic has the higher positive predictive value?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s43.key",
          "label": "Clinic B",
          "isCorrect": true,
          "rationale": "Higher prevalence increases PPV for the same stated imperfect test and process.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s43.d1",
          "label": "Clinic A",
          "isCorrect": false,
          "rationale": "Lower prevalence increases the share of positive tests that are false positives, not PPV.",
          "distractorRationale": "Lower prevalence increases the share of positive tests that are false positives, not PPV."
        },
        {
          "id": "choice.stats1.20261108.s43.d2",
          "label": "Equal PPV",
          "isCorrect": false,
          "rationale": "Equal sensitivity and specificity do not make predictive values independent of prevalence.",
          "distractorRationale": "Equal sensitivity and specificity do not make predictive values independent of prevalence."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Condition prevalence",
            "value": "Clinic A: 10%; clinic B: 20%."
          },
          {
            "label": "Test performance in both clinics",
            "value": "Sensitivity 80%; specificity 90%; same testing process."
          }
        ]
      },
      "explanation": "With the same imperfect test, higher prevalence -> higher PPV.\nClinic B has prevalence 20%, compared with 10% in A.\nEqual sensitivity and specificity do not imply equal PPV.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.ppv",
        "claim.stats1.20261108.prevalence",
        "claim.stats1.20261108.s43.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.predictive-value-prevalence.v3",
    "originalConceptId": "concept.statistics-ethics.predictive-value-prevalence",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": false,
    "patientName": "Hannah Lewis",
    "presentation": "{patientName}, 36 F, reviews study data in clinic.",
    "demographics": {
      "ageYears": 36,
      "sexLabel": "Female"
    },
    "skill": "Relate PPV to tested-population prevalence",
    "focus": "Predictive value changes with prevalence even when the test characteristics do not.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S44",
    "title": "Calculate PPV without substituting sensitivity",
    "family": "predictive-value-prevalence",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.a-characteristics-fixed.1",
    "questionVariantId": "question.statistics-ethics.predictive-value-prevalence.v4.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.predictive-value-prevalence.v4.r2",
      "conceptId": "concept.statistics-ethics.predictive-value-prevalence",
      "stem": "What is the positive predictive value?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s44.key",
          "label": "50%",
          "isCorrect": true,
          "rationale": "PPV = 20 / (20 + 20) = 50%.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s44.d1",
          "label": "25%",
          "isCorrect": false,
          "rationale": "This is sensitivity, 20 / (20 + 60).",
          "distractorRationale": "This is sensitivity, 20 / (20 + 60)."
        },
        {
          "id": "choice.stats1.20261108.s44.d2",
          "label": "90%",
          "isCorrect": false,
          "rationale": "This is specificity, 180 / (180 + 20).",
          "distractorRationale": "This is specificity, 180 / (180 + 20)."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed screening data",
        "columnHeaders": [
          "Reference positive",
          "Reference negative"
        ],
        "rowHeaders": [
          "Test positive",
          "Test negative"
        ],
        "cells": [
          [
            "20",
            "20"
          ],
          [
            "60",
            "180"
          ]
        ]
      },
      "explanation": "PPV = true positives / all positive tests.\n20 / (20 + 20) = 20 / 40 = 50%.\n25% is sensitivity, which uses the reference-positive column.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.ppv",
        "claim.stats1.20261108.sensitivity",
        "claim.stats1.20261108.specificity",
        "claim.stats1.20261108.s44.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.predictive-value-prevalence.v4.r1",
    "originalConceptId": "concept.statistics-ethics.predictive-value-prevalence",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": false,
    "patientName": "Nathan Brooks",
    "presentation": "{patientName}, 54 M, reviews study data in clinic.",
    "demographics": {
      "ageYears": 54,
      "sexLabel": "Male"
    },
    "skill": "Calculate PPV without substituting sensitivity",
    "focus": "The requested measure fixes the denominator as all positive tests.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S45",
    "title": "Calculate a risk ratio",
    "family": "risk-ratio-odds-ratio",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-cohort-risk",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-cohort-risk.1",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v1.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.risk-ratio-odds-ratio.v1.r1",
      "conceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
      "stem": "What is the exposed-versus-unexposed risk ratio?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s45.key",
          "label": "2.0",
          "isCorrect": true,
          "rationale": "(20 / 100) / (10 / 100) = 2.0.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s45.d1",
          "label": "0.5",
          "isCorrect": false,
          "rationale": "This inverts the requested comparison.",
          "distractorRationale": "This inverts the requested comparison."
        },
        {
          "id": "choice.stats1.20261108.s45.d2",
          "label": "2.25",
          "isCorrect": false,
          "rationale": "This compares event-to-nonevent odds, not the two risks.",
          "distractorRationale": "This compares event-to-nonevent odds, not the two risks."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed study data",
        "columnHeaders": [
          "Events",
          "Total patients"
        ],
        "rowHeaders": [
          "Exposed",
          "Unexposed"
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
      "explanation": "Risk ratio = exposed event risk / unexposed event risk.\n(20 / 100) / (10 / 100) = 2.0.\n2.25 is the odds ratio: (20 / 80) / (10 / 90).",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.risk-ratio",
        "claim.stats1.20261108.odds-ratio",
        "claim.stats1.20261108.s45.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v1",
    "originalConceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Calculate a risk ratio",
    "focus": "Use events divided by total people before forming the ratio.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S46",
    "title": "Calculate an odds ratio from case-control sampling",
    "family": "risk-ratio-odds-ratio",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-case-control-or",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-case-control-or.1",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v2.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.risk-ratio-odds-ratio.v2.r1",
      "conceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
      "stem": "What is the exposure odds ratio for cases versus controls?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s46.key",
          "label": "4.0",
          "isCorrect": true,
          "rationale": "(40 x 20) / (10 x 20) = 4.0.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s46.d1",
          "label": "0.25",
          "isCorrect": false,
          "rationale": "This is the inverse odds ratio.",
          "distractorRationale": "This is the inverse odds ratio."
        },
        {
          "id": "choice.stats1.20261108.s46.d2",
          "label": "2.0",
          "isCorrect": false,
          "rationale": "This treats outcome-selected case/control fractions as cohort risks.",
          "distractorRationale": "This treats outcome-selected case/control fractions as cohort risks."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed case-control exposure counts.",
        "columnHeaders": [
          "Cases",
          "Controls"
        ],
        "rowHeaders": [
          "Exposed",
          "Unexposed"
        ],
        "cells": [
          [
            "40",
            "20"
          ],
          [
            "10",
            "20"
          ]
        ]
      },
      "explanation": "Odds ratio = (exposed cases x unexposed controls) / (unexposed cases x exposed controls).\n(40 x 20) / (10 x 20) = 4.0.\n2.0 treats these outcome-selected samples as if they supplied cohort risks.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.odds-ratio",
        "claim.stats1.20261108.risk-ratio",
        "claim.stats1.20261108.study-design",
        "claim.stats1.20261108.s46.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v2",
    "originalConceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Calculate an odds ratio from case-control sampling",
    "focus": "Cross-products compare the exposure odds in outcome-selected groups.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S47",
    "title": "Convert model odds to event probability",
    "family": "risk-ratio-odds-ratio",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds.1",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v3.r4",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.risk-ratio-odds-ratio.v3.r4",
      "conceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
      "stem": "What event probability does the model predict for group A? Round to the nearest whole percent.",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s47.key",
          "label": "33%",
          "isCorrect": true,
          "rationale": "Reference odds = 0.5 / 0.5 = 1; new odds = 0.5; risk = 0.5 / 1.5, about 33%.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s47.d1",
          "label": "25%",
          "isCorrect": false,
          "rationale": "This multiplies probability by the odds ratio as though it were a risk ratio.",
          "distractorRationale": "This multiplies probability by the odds ratio as though it were a risk ratio."
        },
        {
          "id": "choice.stats1.20261108.s47.d2",
          "label": "50%",
          "isCorrect": false,
          "rationale": "This treats odds of 0.5 as probability 0.5, skipping conversion back to probability.",
          "distractorRationale": "This treats odds of 0.5 as probability 0.5, skipping conversion back to probability."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Reference-group probability",
            "value": "50%."
          },
          {
            "label": "Group A versus reference: odds ratio",
            "value": "0.5 for the same covariate profile."
          }
        ]
      },
      "explanation": "Reference odds = 0.50 / (1 - 0.50) = 1; new odds = 1 x 0.5 = 0.5.\nProbability = odds / (1 + odds) = 0.5 / 1.5 = 1/3, rounded to 33%.\n25% incorrectly multiplies the reference probability by an odds ratio.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.odds-to-risk",
        "claim.stats1.20261108.odds-ratio",
        "claim.stats1.20261108.risk-ratio",
        "claim.stats1.20261108.s47.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v3.r3",
    "originalConceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Convert model odds to event probability",
    "focus": "An odds ratio scales odds, not the reference probability.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S48",
    "title": "Interpret relative risk without changing its scale",
    "family": "risk-ratio-odds-ratio",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical.1",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v4.r4",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.risk-ratio-odds-ratio.v4.r4",
      "conceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
      "stem": "How does group A's risk compare with group B's?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s48.key",
          "label": "Risk is 50% lower",
          "isCorrect": true,
          "rationale": "A risk ratio of 0.5 means half the comparison risk.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s48.d1",
          "label": "Odds are 50% lower",
          "isCorrect": false,
          "rationale": "This changes the reported measure from a risk ratio to an odds ratio.",
          "distractorRationale": "This changes the reported measure from a risk ratio to an odds ratio."
        },
        {
          "id": "choice.stats1.20261108.s48.d2",
          "label": "Risk is 50 percentage points lower",
          "isCorrect": false,
          "rationale": "This substitutes an absolute risk difference, which requires the reference risk.",
          "distractorRationale": "This substitutes an absolute risk difference, which requires the reference risk."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Reported measure",
            "value": "Risk ratio for group A versus group B: 0.5."
          }
        ]
      },
      "explanation": "Risk ratio 0.5 = half the comparison risk = 50% lower risk.\nThis describes a relative probability, not an absolute percentage-point difference.\nA 50-percentage-point reduction cannot be inferred without the reference risk.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.risk-ratio",
        "claim.stats1.20261108.odds-ratio",
        "claim.stats1.20261108.arr",
        "claim.stats1.20261108.s48.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v4.r3",
    "originalConceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Interpret relative risk without changing its scale",
    "focus": "Keep the reported measure on its risk-ratio scale.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S49",
    "title": "Calculate NNT for one outcome and horizon",
    "family": "arr-nnt",
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-ten",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-ten.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v1.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.arr-nnt.v1.r1",
      "conceptId": "concept.statistics-ethics.arr-nnt",
      "stem": "What is the number needed to treat to prevent one infection during follow-up?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s49.key",
          "label": "10 patients",
          "isCorrect": true,
          "rationale": "NNT = 1 / the absolute risk reduction expressed as a proportion.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s49.d1",
          "label": "5 patients",
          "isCorrect": false,
          "rationale": "This takes 1 / control risk rather than 1 / absolute risk reduction.",
          "distractorRationale": "This takes 1 / control risk rather than 1 / absolute risk reduction."
        },
        {
          "id": "choice.stats1.20261108.s49.d2",
          "label": "2 patients",
          "isCorrect": false,
          "rationale": "This takes the reciprocal of the 50% relative reduction.",
          "distractorRationale": "This takes the reciprocal of the 50% relative reduction."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Outcome",
            "value": "Wound infection within 30 days."
          },
          {
            "label": "Control event rate",
            "value": "20%."
          },
          {
            "label": "Treatment event rate",
            "value": "10%."
          }
        ]
      },
      "explanation": "ARR = control risk - treatment risk = 20% - 10% = 10 percentage points.\nNNT = 1 / 0.1 = 10 patients over 30 days.\nUse the absolute difference as a proportion, not the relative reduction or a whole-number percent.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.arr",
        "claim.stats1.20261108.nnt",
        "claim.stats1.20261108.s49.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.arr-nnt.v1",
    "originalConceptId": "concept.statistics-ethics.arr-nnt",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": false,
    "patientName": "Hannah Lewis",
    "presentation": "{patientName}, 61 F, reviews study data in clinic.",
    "demographics": {
      "ageYears": 61,
      "sexLabel": "Female"
    },
    "skill": "Calculate NNT for one outcome and horizon",
    "focus": "Subtract the two risks, convert the absolute difference to a proportion, then take its reciprocal.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S50",
    "title": "Calculate absolute risk reduction",
    "family": "arr-nnt",
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-five",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-five.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v2.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.arr-nnt.v2.r1",
      "conceptId": "concept.statistics-ethics.arr-nnt",
      "stem": "What is the absolute risk reduction?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s50.key",
          "label": "5 percentage points",
          "isCorrect": true,
          "rationale": "15% - 10% = 5 percentage points.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s50.d1",
          "label": "33 percentage points",
          "isCorrect": false,
          "rationale": "This confuses the relative reduction of about one third with an absolute difference.",
          "distractorRationale": "This confuses the relative reduction of about one third with an absolute difference."
        },
        {
          "id": "choice.stats1.20261108.s50.d2",
          "label": "25 percentage points",
          "isCorrect": false,
          "rationale": "This adds the two event rates instead of subtracting them.",
          "distractorRationale": "This adds the two event rates instead of subtracting them."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Outcome",
            "value": "Wound infection within 30 days."
          },
          {
            "label": "Control event rate",
            "value": "15%."
          },
          {
            "label": "Treatment event rate",
            "value": "10%."
          }
        ]
      },
      "explanation": "ARR = control event risk - treatment event risk.\n15% - 10% = 5 percentage points.\nAbout 33% is the relative reduction, not the absolute percentage-point difference.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.arr",
        "claim.stats1.20261108.nnt",
        "claim.stats1.20261108.s50.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.arr-nnt.v2",
    "originalConceptId": "concept.statistics-ethics.arr-nnt",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": false,
    "patientName": "Owen Miller",
    "presentation": "{patientName}, 38 M, reviews study data in clinic.",
    "demographics": {
      "ageYears": 38,
      "sexLabel": "Male"
    },
    "skill": "Calculate absolute risk reduction",
    "focus": "Subtract risks on the same outcome and time scale.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S51",
    "title": "Calculate NNT for one outcome and horizon",
    "family": "arr-nnt",
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-twenty",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-twenty.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v3.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.arr-nnt.v3.r1",
      "conceptId": "concept.statistics-ethics.arr-nnt",
      "stem": "What is the number needed to treat to prevent one infection during follow-up?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s51.key",
          "label": "25 patients",
          "isCorrect": true,
          "rationale": "NNT = 1 / the absolute risk reduction expressed as a proportion.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s51.d1",
          "label": "4 patients",
          "isCorrect": false,
          "rationale": "Four is the percentage-point ARR, not its reciprocal as a proportion.",
          "distractorRationale": "Four is the percentage-point ARR, not its reciprocal as a proportion."
        },
        {
          "id": "choice.stats1.20261108.s51.d2",
          "label": "3 patients",
          "isCorrect": false,
          "rationale": "This takes the reciprocal of the one-third relative reduction.",
          "distractorRationale": "This takes the reciprocal of the one-third relative reduction."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Outcome",
            "value": "Wound infection within 30 days."
          },
          {
            "label": "Control event rate",
            "value": "12%."
          },
          {
            "label": "Treatment event rate",
            "value": "8%."
          }
        ]
      },
      "explanation": "ARR = control risk - treatment risk = 12% - 8% = 4 percentage points.\nNNT = 1 / 0.04 = 25 patients over 30 days.\nUse the absolute difference as a proportion, not the relative reduction or a whole-number percent.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.arr",
        "claim.stats1.20261108.nnt",
        "claim.stats1.20261108.s51.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.arr-nnt.v3",
    "originalConceptId": "concept.statistics-ethics.arr-nnt",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": false,
    "patientName": "Nora Brooks",
    "presentation": "{patientName}, 47 F, reviews study data in clinic.",
    "demographics": {
      "ageYears": 47,
      "sexLabel": "Female"
    },
    "skill": "Calculate NNT for one outcome and horizon",
    "focus": "Subtract the two risks, convert the absolute difference to a proportion, then take its reciprocal.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S52",
    "title": "Calculate NNT for one outcome and horizon",
    "family": "arr-nnt",
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-six",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-six.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v4.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.arr-nnt.v4.r1",
      "conceptId": "concept.statistics-ethics.arr-nnt",
      "stem": "What is the number needed to treat to prevent one infection during follow-up?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s52.key",
          "label": "20 patients",
          "isCorrect": true,
          "rationale": "NNT = 1 / the absolute risk reduction expressed as a proportion.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s52.d1",
          "label": "5 patients",
          "isCorrect": false,
          "rationale": "Five is the percentage-point ARR, not the number needed to treat.",
          "distractorRationale": "Five is the percentage-point ARR, not the number needed to treat."
        },
        {
          "id": "choice.stats1.20261108.s52.d2",
          "label": "6 patients",
          "isCorrect": false,
          "rationale": "This takes the reciprocal of the one-sixth relative reduction.",
          "distractorRationale": "This takes the reciprocal of the one-sixth relative reduction."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Outcome",
            "value": "Wound infection within 30 days."
          },
          {
            "label": "Control event rate",
            "value": "30%."
          },
          {
            "label": "Treatment event rate",
            "value": "25%."
          }
        ]
      },
      "explanation": "ARR = control risk - treatment risk = 30% - 25% = 5 percentage points.\nNNT = 1 / 0.05 = 20 patients over 30 days.\nUse the absolute difference as a proportion, not the relative reduction or a whole-number percent.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.arr",
        "claim.stats1.20261108.nnt",
        "claim.stats1.20261108.s52.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.arr-nnt.v4",
    "originalConceptId": "concept.statistics-ethics.arr-nnt",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": false,
    "patientName": "Gavin Price",
    "presentation": "{patientName}, 73 M, reviews study data in clinic.",
    "demographics": {
      "ageYears": 73,
      "sexLabel": "Male"
    },
    "skill": "Calculate NNT for one outcome and horizon",
    "focus": "Subtract the two risks, convert the absolute difference to a proportion, then take its reciprocal.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S53",
    "title": "Interpret a p-value under its null model",
    "family": "p-value",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-003",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-003.1",
    "questionVariantId": "question.statistics-ethics.p-value.v1.r5",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v1.r5",
      "conceptId": "concept.statistics-ethics.p-value",
      "stem": "What does the p-value mean?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s53.key",
          "label": "4% probability of results at least this extreme if the null hypothesis were true",
          "isCorrect": true,
          "rationale": "This is a probability of data or more extreme data under the specified null model.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s53.d1",
          "label": "4% probability that the null hypothesis is true after seeing these results",
          "isCorrect": false,
          "rationale": "This reverses a probability conditional on the null into a probability of the null itself.",
          "distractorRationale": "This reverses a probability conditional on the null into a probability of the null itself."
        },
        {
          "id": "choice.stats1.20261108.s53.d2",
          "label": "4% probability that repeating the study would produce the same result",
          "isCorrect": false,
          "rationale": "This mistakes a null-model tail probability for a replication probability.",
          "distractorRationale": "This mistakes a null-model tail probability for a replication probability."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Test",
            "value": "Two-sided comparison of mean recovery times."
          },
          {
            "label": "p-value",
            "value": "0.04."
          }
        ]
      },
      "explanation": "A p-value conditions on the specified null model, not on a hypothesis being true after testing.\np = 0.04 means a 4% probability of results at least this extreme under that null model.\nIt does not mean a 4% probability that the null hypothesis is true.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.p-value",
        "claim.stats1.20261108.s53.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.p-value.v1.r4",
    "originalConceptId": "concept.statistics-ethics.p-value",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Interpret a p-value under its null model",
    "focus": "Keep probability of data given a model distinct from probability of a hypothesis.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S54",
    "title": "Compare an uncertainty interval with a benefit target",
    "family": "p-value",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-040",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-040.1",
    "questionVariantId": "question.statistics-ethics.p-value.v2.r7",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v2.r7",
      "conceptId": "concept.statistics-ethics.p-value.v2",
      "stem": "Where does the target benefit fall relative to the confidence interval?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s54.key",
          "label": "Target lies inside the interval",
          "isCorrect": true,
          "rationale": "The interval contains values below and above the stated target.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s54.d1",
          "label": "Target lies below the interval",
          "isCorrect": false,
          "rationale": "The lower endpoint is below the target.",
          "distractorRationale": "The lower endpoint is below the target."
        },
        {
          "id": "choice.stats1.20261108.s54.d2",
          "label": "Target lies above the interval",
          "isCorrect": false,
          "rationale": "The upper endpoint is above the target.",
          "distractorRationale": "The upper endpoint is above the target."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Outcome",
            "value": "Reduction in mean recovery time, in days."
          },
          {
            "label": "Target benefit",
            "value": "At least 2 days."
          },
          {
            "label": "95% confidence interval for the reduction",
            "value": "1 to 3 days."
          }
        ]
      },
      "explanation": "Compare the effect interval with the separately stated target.\nAn interval of 1 to 3 days spans the 2-day target; target benefit remains unresolved.\nThe lower endpoint is 1 day, so the target does not lie below the whole interval.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.target-interval",
        "claim.stats1.20261108.ci-null",
        "claim.stats1.20261108.s54.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.p-value.v2.r6",
    "originalConceptId": "concept.statistics-ethics.p-value.v2",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same target-benefit interval classification objective. Retain the effect interval and stated target; remove the redundant null-test report and downstream study-plan choice. The card is not reassigned to generic p-value recall.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Compare an uncertainty interval with a benefit target",
    "focus": "The clinically specified study target is compared with the whole uncertainty interval, not with a redundant null-test result.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S55",
    "title": "Avoid proving no effect from nonsignificance",
    "family": "p-value",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-0001",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-0001.1",
    "questionVariantId": "question.statistics-ethics.p-value.v3.r5",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v3.r5",
      "conceptId": "concept.statistics-ethics.p-value",
      "stem": "Which conclusion follows from the difference test?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s55.key",
          "label": "The null hypothesis is not rejected",
          "isCorrect": true,
          "rationale": "The p-value exceeds the stated significance level; this does not prove the null.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s55.d1",
          "label": "The treatments are demonstrated equivalent",
          "isCorrect": false,
          "rationale": "Failure to reject a difference-test null is not an equivalence test.",
          "distractorRationale": "Failure to reject a difference-test null is not an equivalence test."
        },
        {
          "id": "choice.stats1.20261108.s55.d2",
          "label": "The null hypothesis is disproved",
          "isCorrect": false,
          "rationale": "This reverses the significance-level comparison.",
          "distractorRationale": "This reverses the significance-level comparison."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Test",
            "value": "Difference in mean recovery time."
          },
          {
            "label": "Prespecified significance level",
            "value": "0.05."
          },
          {
            "label": "p-value",
            "value": "0.20."
          }
        ]
      },
      "explanation": "A p-value above the chosen threshold does not reject the null.\n0.20 > 0.05 -> do not reject the equal-means null.\nNonsignificance does not demonstrate equivalence.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.p-value",
        "claim.stats1.20261108.p-decision",
        "claim.stats1.20261108.s55.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.p-value.v3.r4",
    "originalConceptId": "concept.statistics-ethics.p-value",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Avoid proving no effect from nonsignificance",
    "focus": "Failure to reject is different from proving equal effects.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S56",
    "title": "Separate statistical evidence from clinical importance",
    "family": "p-value",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-008",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-008.1",
    "questionVariantId": "question.statistics-ethics.p-value.v4.r4",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v4.r4",
      "conceptId": "concept.statistics-ethics.p-value",
      "stem": "Which inference is supported by the p-value?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s56.key",
          "label": "Strong evidence against the null model",
          "isCorrect": true,
          "rationale": "The observed result is highly incompatible with the specified no-difference model.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s56.d1",
          "label": "Strong evidence of a large clinical benefit",
          "isCorrect": false,
          "rationale": "A p-value does not measure the magnitude or clinical importance of an effect.",
          "distractorRationale": "A p-value does not measure the magnitude or clinical importance of an effect."
        },
        {
          "id": "choice.stats1.20261108.s56.d2",
          "label": "Strong evidence that systematic bias is absent",
          "isCorrect": false,
          "rationale": "The p-value does not establish freedom from systematic error.",
          "distractorRationale": "The p-value does not establish freedom from systematic error."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Test",
            "value": "Difference in mean recovery time."
          },
          {
            "label": "p-value",
            "value": "0.001."
          }
        ]
      },
      "explanation": "Small p-values provide evidence against the specified null model.\np = 0.001 does not quantify a recovery-time benefit.\nA large clinical benefit needs effect-size interpretation, not a p-value alone.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.p-value",
        "claim.stats1.20261108.p-limits",
        "claim.stats1.20261108.s56.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.p-value.v4.r3",
    "originalConceptId": "concept.statistics-ethics.p-value",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Separate statistical evidence from clinical importance",
    "focus": "A small p-value concerns the null model rather than clinical effect size.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S57",
    "title": "Interpret a ratio interval containing its null",
    "family": "confidence-interval",
    "caseId": "case.gs028se.confidence-interval-errors-power.a-ratio-crosses",
    "nodeId": "node.gs028se.confidence-interval-errors-power.a-ratio-crosses.1",
    "questionVariantId": "question.statistics-ethics.confidence-interval.v1.r4",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.confidence-interval.v1.r4",
      "conceptId": "concept.statistics-ethics.confidence-interval",
      "stem": "At the matching 5% significance level, which conclusion follows?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s57.key",
          "label": "No statistically significant difference",
          "isCorrect": true,
          "rationale": "The matching two-sided interval includes the null value.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s57.d1",
          "label": "Statistically significant lower risk",
          "isCorrect": false,
          "rationale": "This conflicts with whether the interval contains 1 and with which side of 1 it occupies.",
          "distractorRationale": "This conflicts with whether the interval contains 1 and with which side of 1 it occupies."
        },
        {
          "id": "choice.stats1.20261108.s57.d2",
          "label": "Statistically significant higher risk",
          "isCorrect": false,
          "rationale": "This conflicts with whether the interval contains 1 and with which side of 1 it occupies.",
          "distractorRationale": "This conflicts with whether the interval contains 1 and with which side of 1 it occupies."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Two-sided 95% confidence interval for risk ratio A/B",
            "value": "0.8 to 1.2."
          }
        ]
      },
      "explanation": "The null value for a risk ratio is 1.\nThe interval 0.8 to 1.2 contains 1, so the matching two-sided test does not reject no difference.\nAn interval containing 1 does not prove the risks are equal.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.ci-null",
        "claim.stats1.20261108.p-decision",
        "claim.stats1.20261108.s57.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.confidence-interval.v1.r3",
    "originalConceptId": "concept.statistics-ethics.confidence-interval",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Interpret a ratio interval containing its null",
    "focus": "A ratio uses 1, not 0, as its null value.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S58",
    "title": "Interpret a ratio interval below its null",
    "family": "confidence-interval",
    "caseId": "case.gs028se.confidence-interval-errors-power.a-difference-excludes",
    "nodeId": "node.gs028se.confidence-interval-errors-power.a-difference-excludes.1",
    "questionVariantId": "question.statistics-ethics.confidence-interval.v2.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.confidence-interval.v2.r1",
      "conceptId": "concept.statistics-ethics.confidence-interval",
      "stem": "At the matching 5% significance level, which conclusion follows?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s58.key",
          "label": "Statistically significant lower risk",
          "isCorrect": true,
          "rationale": "The interval excludes the null value in the indicated direction.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s58.d1",
          "label": "No statistically significant difference",
          "isCorrect": false,
          "rationale": "This conflicts with whether the interval contains 1 and with which side of 1 it occupies.",
          "distractorRationale": "This conflicts with whether the interval contains 1 and with which side of 1 it occupies."
        },
        {
          "id": "choice.stats1.20261108.s58.d2",
          "label": "Statistically significant higher risk",
          "isCorrect": false,
          "rationale": "This conflicts with whether the interval contains 1 and with which side of 1 it occupies.",
          "distractorRationale": "This conflicts with whether the interval contains 1 and with which side of 1 it occupies."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Two-sided 95% confidence interval for risk ratio A/B",
            "value": "0.4 to 0.8."
          }
        ]
      },
      "explanation": "The null value for a risk ratio is 1.\nThe entire interval 0.4 to 0.8 is below 1, supporting lower risk in the matching test.\nExcluding 0 is not the significance rule for a risk ratio.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.ci-null",
        "claim.stats1.20261108.p-decision",
        "claim.stats1.20261108.s58.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.confidence-interval.v2",
    "originalConceptId": "concept.statistics-ethics.confidence-interval",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Interpret a ratio interval below its null",
    "focus": "Keep the null value appropriate to the ratio scale.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S59",
    "title": "Use zero as the null for a difference",
    "family": "confidence-interval",
    "caseId": "case.gs028se.confidence-interval-errors-power.a-precision-width",
    "nodeId": "node.gs028se.confidence-interval-errors-power.a-precision-width.1",
    "questionVariantId": "question.statistics-ethics.confidence-interval.v3.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.confidence-interval.v3.r1",
      "conceptId": "concept.statistics-ethics.confidence-interval",
      "stem": "At the matching 5% significance level, which conclusion follows?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s59.key",
          "label": "Recovery times do not differ significantly",
          "isCorrect": true,
          "rationale": "The reported range spans zero, the no-effect value.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s59.d1",
          "label": "Recovery times are significantly shorter with A",
          "isCorrect": false,
          "rationale": "The interval includes a difference in the opposite direction as well as 0.",
          "distractorRationale": "The interval includes a difference in the opposite direction as well as 0."
        },
        {
          "id": "choice.stats1.20261108.s59.d2",
          "label": "Recovery times are significantly longer with A",
          "isCorrect": false,
          "rationale": "The interval also includes negative differences and 0.",
          "distractorRationale": "The interval also includes negative differences and 0."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Two-sided 95% confidence interval for mean recovery-time difference, A minus B",
            "value": "-2 to +1 days."
          }
        ]
      },
      "explanation": "The null value for a difference is 0, not 1.\nThe interval -2 to +1 days includes 0, so the matching test does not reject no difference.\nA negative point estimate does not override an interval containing 0.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.ci-null",
        "claim.stats1.20261108.p-decision",
        "claim.stats1.20261108.s59.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.confidence-interval.v3",
    "originalConceptId": "concept.statistics-ethics.confidence-interval",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Use zero as the null for a difference",
    "focus": "A difference and a ratio have different null values.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S60",
    "title": "Compare precision at the same confidence level",
    "family": "confidence-interval",
    "caseId": "case.gs028se.confidence-interval-errors-power.a-repeated-sampling",
    "nodeId": "node.gs028se.confidence-interval-errors-power.a-repeated-sampling.1",
    "questionVariantId": "question.statistics-ethics.confidence-interval.v4.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.confidence-interval.v4.r1",
      "conceptId": "concept.statistics-ethics.confidence-interval",
      "stem": "Which estimate is more precise?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s60.key",
          "label": "Estimate A",
          "isCorrect": true,
          "rationale": "At the same confidence level and scale, its narrower interval indicates greater precision.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s60.d1",
          "label": "Estimate B",
          "isCorrect": false,
          "rationale": "Its wider interval indicates less precision, not more.",
          "distractorRationale": "Its wider interval indicates less precision, not more."
        },
        {
          "id": "choice.stats1.20261108.s60.d2",
          "label": "Equal precision",
          "isCorrect": false,
          "rationale": "Both intervals containing the null does not make their widths equal.",
          "distractorRationale": "Both intervals containing the null does not make their widths equal."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Estimate A: 95% interval for the risk ratio",
            "value": "0.9 to 1.1."
          },
          {
            "label": "Estimate B: 95% interval for the same risk ratio",
            "value": "0.5 to 1.5."
          }
        ]
      },
      "explanation": "At the same confidence level, a narrower interval is more precise.\nA width = 0.2; B width = 1.0 -> A is more precise.\nBoth intervals containing 1 does not make precision equal.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.ci-precision",
        "claim.stats1.20261108.ci-null",
        "claim.stats1.20261108.s60.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.confidence-interval.v4",
    "originalConceptId": "concept.statistics-ethics.confidence-interval",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Compare precision at the same confidence level",
    "focus": "Compare widths at the same confidence level, not null inclusion.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S61",
    "title": "Recognize a false positive hypothesis test",
    "family": "errors-power",
    "caseId": "case.gs028se.confidence-interval-errors-power.b-type-one",
    "nodeId": "node.gs028se.confidence-interval-errors-power.b-type-one.1",
    "questionVariantId": "question.statistics-ethics.errors-power.v1.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.errors-power.v1.r1",
      "conceptId": "concept.statistics-ethics.errors-power",
      "stem": "Which testing error occurred?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s61.key",
          "label": "Type 1 error",
          "isCorrect": true,
          "rationale": "The test rejects a null that is true.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s61.d1",
          "label": "Type 2 error",
          "isCorrect": false,
          "rationale": "Type II fails to reject a false null.",
          "distractorRationale": "Type II fails to reject a false null."
        },
        {
          "id": "choice.stats1.20261108.s61.d2",
          "label": "No testing error",
          "isCorrect": false,
          "rationale": "The decision contradicts the specified simulation truth.",
          "distractorRationale": "The decision contradicts the specified simulation truth."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Simulation truth",
            "value": "No treatment effect."
          },
          {
            "label": "Test decision",
            "value": "Reject the no-effect null."
          }
        ]
      },
      "explanation": "Type I (type 1) error = reject a true null hypothesis.\nThe simulated null is true, but the test rejects it.\nType II error instead misses a specified real effect.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.type-i",
        "claim.stats1.20261108.type-ii",
        "claim.stats1.20261108.s61.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.errors-power.v1",
    "originalConceptId": "concept.statistics-ethics.errors-power",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Recognize a false positive hypothesis test",
    "focus": "Compare the test decision with the specified simulation truth.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S62",
    "title": "Recognize a false negative hypothesis test",
    "family": "errors-power",
    "caseId": "case.gs028se.confidence-interval-errors-power.b-type-two",
    "nodeId": "node.gs028se.confidence-interval-errors-power.b-type-two.1",
    "questionVariantId": "question.statistics-ethics.errors-power.v2.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.errors-power.v2.r1",
      "conceptId": "concept.statistics-ethics.errors-power",
      "stem": "Which testing error occurred?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s62.key",
          "label": "Type 2 error",
          "isCorrect": true,
          "rationale": "The test fails to reject a null that is false.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s62.d1",
          "label": "Type 1 error",
          "isCorrect": false,
          "rationale": "Type I rejects a true null.",
          "distractorRationale": "Type I rejects a true null."
        },
        {
          "id": "choice.stats1.20261108.s62.d2",
          "label": "No testing error",
          "isCorrect": false,
          "rationale": "The decision contradicts the specified simulation truth.",
          "distractorRationale": "The decision contradicts the specified simulation truth."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Simulation truth",
            "value": "A treatment effect exists."
          },
          {
            "label": "Test decision",
            "value": "Do not reject the no-effect null."
          }
        ]
      },
      "explanation": "Type II (type 2) error = fail to reject a false null under a specified alternative.\nThe simulated effect exists, but the test does not reject the no-effect null.\nType I error instead rejects a null that is true.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.type-ii",
        "claim.stats1.20261108.type-i",
        "claim.stats1.20261108.s62.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.errors-power.v2",
    "originalConceptId": "concept.statistics-ethics.errors-power",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Recognize a false negative hypothesis test",
    "focus": "Compare the test decision with the specified simulation truth.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S63",
    "title": "Calculate power from type II error probability",
    "family": "errors-power",
    "caseId": "case.gs028se.confidence-interval-errors-power.b-power",
    "nodeId": "node.gs028se.confidence-interval-errors-power.b-power.1",
    "questionVariantId": "question.statistics-ethics.errors-power.v3.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.errors-power.v3.r1",
      "conceptId": "concept.statistics-ethics.errors-power",
      "stem": "What is the statistical power under that alternative?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s63.key",
          "label": "80%",
          "isCorrect": true,
          "rationale": "Power = 1 - beta = 100% - 20% = 80%.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s63.d1",
          "label": "20%",
          "isCorrect": false,
          "rationale": "This is beta, the probability of missing the specified effect.",
          "distractorRationale": "This is beta, the probability of missing the specified effect."
        },
        {
          "id": "choice.stats1.20261108.s63.d2",
          "label": "90%",
          "isCorrect": false,
          "rationale": "This incorrectly halves beta before taking its complement.",
          "distractorRationale": "This incorrectly halves beta before taking its complement."
        },
        {
          "id": "choice.stats1.20261108.s63.d3",
          "label": "10%",
          "isCorrect": false,
          "rationale": "This incorrectly halves beta and reports that half as power.",
          "distractorRationale": "This incorrectly halves beta and reports that half as power."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Specified alternative",
            "value": "Type II error probability: 20%."
          }
        ]
      },
      "explanation": "Power = 1 - type II error probability.\n100% - 20% = 80%.\n20% is the probability of missing the effect, not detecting it.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.power",
        "claim.stats1.20261108.type-ii",
        "claim.stats1.20261108.s63.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.errors-power.v3",
    "originalConceptId": "concept.statistics-ethics.errors-power",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Calculate power from type II error probability",
    "focus": "Power and beta are complementary probabilities under the same alternative.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S64",
    "title": "Calculate type II error probability from power",
    "family": "errors-power",
    "caseId": "case.gs028se.confidence-interval-errors-power.b-post-hoc",
    "nodeId": "node.gs028se.confidence-interval-errors-power.b-post-hoc.1",
    "questionVariantId": "question.statistics-ethics.errors-power.v4.r1",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.errors-power.v4.r1",
      "conceptId": "concept.statistics-ethics.errors-power",
      "stem": "What is the type II error probability under that alternative?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.s64.key",
          "label": "10%",
          "isCorrect": true,
          "rationale": "Beta = 1 - power = 100% - 90% = 10%.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.s64.d1",
          "label": "90%",
          "isCorrect": false,
          "rationale": "This repeats power instead of its complement.",
          "distractorRationale": "This repeats power instead of its complement."
        },
        {
          "id": "choice.stats1.20261108.s64.d2",
          "label": "5%",
          "isCorrect": false,
          "rationale": "This incorrectly halves the complement as though beta were a two-tail significance allocation.",
          "distractorRationale": "This incorrectly halves the complement as though beta were a two-tail significance allocation."
        },
        {
          "id": "choice.stats1.20261108.s64.d3",
          "label": "95%",
          "isCorrect": false,
          "rationale": "This confuses the quantity with a commonly stated confidence level.",
          "distractorRationale": "This confuses the quantity with a commonly stated confidence level."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Specified alternative",
            "value": "Power: 90%."
          }
        ]
      },
      "explanation": "Type II error probability = 1 - power.\n100% - 90% = 10%.\n90% is detection probability, not failure-to-detect probability.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.power",
        "claim.stats1.20261108.type-ii",
        "claim.stats1.20261108.s64.application"
      ]
    },
    "originalVariantId": "question.statistics-ethics.errors-power.v4",
    "originalConceptId": "concept.statistics-ethics.errors-power",
    "conceptMeaning": "same",
    "conceptVersionReason": "Same existing statistical-method objective. A new exact variant isolates one skill; no concept or FSRS identity changes.",
    "employeeDiscussion": true,
    "patientName": "Jordan Ellis",
    "presentation": "{patientName} reviews study data.",
    "skill": "Calculate type II error probability from power",
    "focus": "Beta is not the significance level or a tail-split probability.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  }
];
export const QUESTION_STATS1_AUTHORING_CONCEPTS=[
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.independent-t",
    "displayName": "Select an independent-samples t test",
    "learningObjective": "Select an independent-samples t test for a continuous outcome in two independent groups when its assumptions are reasonable.",
    "earliestFacilityStage": 2,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.independent-t",
      "claim.stats1.20261108.paired-t",
      "claim.stats1.20261108.rank-sum",
      "claim.stats1.20261108.s01.application",
      "claim.stats1.20261108.s02.application",
      "claim.stats1.20261108.s03.application",
      "claim.stats1.20261108.s04.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.paired-t",
    "displayName": "Select a paired t test",
    "learningObjective": "Select a paired t test for a continuous outcome measured twice on the same units when paired differences are reasonably normal.",
    "earliestFacilityStage": 2,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.paired-t",
      "claim.stats1.20261108.independent-t",
      "claim.stats1.20261108.signed-rank",
      "claim.stats1.20261108.s05.application",
      "claim.stats1.20261108.s06.application",
      "claim.stats1.20261108.s07.application",
      "claim.stats1.20261108.s08.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.one-way-anova",
    "displayName": "Select one-way ANOVA",
    "learningObjective": "Select one-way ANOVA for a continuous outcome across three or more independent groups when its assumptions are reasonable.",
    "earliestFacilityStage": 2,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.one-way-anova",
      "claim.stats1.20261108.independent-t",
      "claim.stats1.20261108.paired-t",
      "claim.stats1.20261108.s09.application",
      "claim.stats1.20261108.s10.application",
      "claim.stats1.20261108.s11.application",
      "claim.stats1.20261108.s12.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.rank-sum",
    "displayName": "Select a Wilcoxon rank-sum test",
    "learningObjective": "Select a Wilcoxon rank-sum procedure for ordinal or markedly non-normal observations from two independent groups.",
    "earliestFacilityStage": 2,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.rank-sum",
      "claim.stats1.20261108.signed-rank",
      "claim.stats1.20261108.independent-t",
      "claim.stats1.20261108.s13.application",
      "claim.stats1.20261108.s14.application",
      "claim.stats1.20261108.s15.application",
      "claim.stats1.20261108.s16.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.signed-rank",
    "displayName": "Select a Wilcoxon signed-rank test",
    "learningObjective": "Select a Wilcoxon signed-rank procedure for paired continuous differences that are reasonably symmetric but unsuitable for a paired t model.",
    "earliestFacilityStage": 2,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.signed-rank",
      "claim.stats1.20261108.rank-sum",
      "claim.stats1.20261108.paired-t",
      "claim.stats1.20261108.s17.application",
      "claim.stats1.20261108.s18.application",
      "claim.stats1.20261108.s19.application",
      "claim.stats1.20261108.s20.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.chi-square",
    "displayName": "Select a chi-square test of independence",
    "learningObjective": "Select a chi-square test of independence for two categorical variables when expected counts support the approximation.",
    "earliestFacilityStage": 2,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.chi-square",
      "claim.stats1.20261108.mcnemar",
      "claim.stats1.20261108.one-way-anova",
      "claim.stats1.20261108.s21.application",
      "claim.stats1.20261108.s22.application",
      "claim.stats1.20261108.s23.application",
      "claim.stats1.20261108.s24.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.fisher-exact",
    "displayName": "Select Fisher exact test",
    "learningObjective": "Select Fisher exact testing for a sparse two-by-two categorical table when a chi-square approximation is unreliable.",
    "earliestFacilityStage": 2,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.fisher-exact",
      "claim.stats1.20261108.chi-square",
      "claim.stats1.20261108.mcnemar",
      "claim.stats1.20261108.s25.application",
      "claim.stats1.20261108.s26.application",
      "claim.stats1.20261108.s27.application",
      "claim.stats1.20261108.s28.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.study-design",
    "displayName": "Identify basic study designs",
    "learningObjective": "Identify randomized experiments, cohort studies, case-control studies, and cross-sectional studies from how participants and measurements are organized.",
    "earliestFacilityStage": 2,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.study-design",
      "claim.stats1.20261108.s29.application",
      "claim.stats1.20261108.s30.application",
      "claim.stats1.20261108.s31.application",
      "claim.stats1.20261108.s32.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.bias-confounding",
    "displayName": "Distinguish bias from confounding",
    "learningObjective": "Identify confounding, selection bias, and measurement bias as distinct threats to inference.",
    "earliestFacilityStage": 2,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.confounding",
      "claim.stats1.20261108.recall",
      "claim.stats1.20261108.measurement",
      "claim.stats1.20261108.s33.application",
      "claim.stats1.20261108.selection",
      "claim.stats1.20261108.s34.application",
      "claim.stats1.20261108.s35.application",
      "claim.stats1.20261108.s36.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.sensitivity-specificity",
    "displayName": "Interpret sensitivity and specificity",
    "learningObjective": "Calculate and interpret sensitivity and specificity using the correct disease-status denominators.",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.sensitivity",
      "claim.stats1.20261108.specificity",
      "claim.stats1.20261108.false-negative",
      "claim.stats1.20261108.ppv",
      "claim.stats1.20261108.s37.application",
      "claim.stats1.20261108.s38.application",
      "claim.stats1.20261108.odds-ratio",
      "claim.stats1.20261108.s39.application",
      "claim.stats1.20261108.s40.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.predictive-value-prevalence",
    "displayName": "Relate positive predictive value to prevalence",
    "learningObjective": "Calculate positive predictive value and predict how it changes with prevalence when test characteristics stay fixed.",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.ppv",
      "claim.stats1.20261108.sensitivity",
      "claim.stats1.20261108.specificity",
      "claim.stats1.20261108.s41.application",
      "claim.stats1.20261108.prevalence",
      "claim.stats1.20261108.s43.application",
      "claim.stats1.20261108.s44.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "previousConceptId": null,
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "id": "concept.predictive-value.collection-population-denominator.v1",
    "displayName": "Match a positive result to its collection population and denominator",
    "learningObjective": "Identify the relevant tested cohort from collection chronology, then calculate positive predictive value rather than sensitivity or pretest prevalence.",
    "earliestFacilityStage": 0,
    "conceptType": "applied_science",
    "previousConceptId": "concept.statistics-ethics.predictive-value-prevalence",
    "versioningReason": "The old task asked only the direction of change under a supplied lower-prevalence label. This scores cohort selection and positive-result denominator calculation; retain the original direction-of-change concept.",
    "revisedItemIds": [
      "G06"
    ],
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.stats1.20261108.collection",
      "claim.stats1.20261108.ppv",
      "claim.stats1.20261108.s42.application"
    ],
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "lastClinicianReview": null,
    "aiAssistedDrafting": true,
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.risk-ratio-odds-ratio",
    "displayName": "Distinguish risk ratio and odds ratio",
    "learningObjective": "Name and interpret risk ratios and odds ratios without silently substituting one measure for the other.",
    "earliestFacilityStage": 2,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.risk-ratio",
      "claim.stats1.20261108.odds-ratio",
      "claim.stats1.20261108.s45.application",
      "claim.stats1.20261108.study-design",
      "claim.stats1.20261108.s46.application",
      "claim.stats1.20261108.odds-to-risk",
      "claim.stats1.20261108.s47.application",
      "claim.stats1.20261108.arr",
      "claim.stats1.20261108.s48.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.arr-nnt",
    "displayName": "Calculate absolute risk reduction and NNT",
    "learningObjective": "Calculate absolute risk reduction and number needed to treat while retaining comparator, outcome, and time horizon.",
    "earliestFacilityStage": 0,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.arr",
      "claim.stats1.20261108.nnt",
      "claim.stats1.20261108.s49.application",
      "claim.stats1.20261108.s50.application",
      "claim.stats1.20261108.s51.application",
      "claim.stats1.20261108.s52.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.p-value",
    "displayName": "Interpret a p-value",
    "learningObjective": "Interpret a p-value as a null-model tail probability without treating it as effect size or hypothesis probability.",
    "earliestFacilityStage": 2,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.p-value",
      "claim.stats1.20261108.s53.application",
      "claim.stats1.20261108.p-decision",
      "claim.stats1.20261108.s55.application",
      "claim.stats1.20261108.p-limits",
      "claim.stats1.20261108.s56.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "id": "concept.statistics-ethics.p-value.v2",
    "displayName": "Apply uncertainty to a target-benefit decision",
    "learningObjective": "Integrate an effect estimate, confidence interval and null test to distinguish target benefit confirmed, excluded or unresolved and avoid false adoption, futility or equivalence conclusions.",
    "earliestFacilityStage": 2,
    "conceptType": "applied_science",
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
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
      "claim.stats1.20261108.target-interval",
      "claim.stats1.20261108.ci-null",
      "claim.stats1.20261108.s54.application"
    ],
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.confidence-interval",
    "displayName": "Interpret a confidence interval",
    "learningObjective": "Interpret confidence intervals using their null value and precision without assigning probability to a fixed parameter.",
    "earliestFacilityStage": 2,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.ci-null",
      "claim.stats1.20261108.p-decision",
      "claim.stats1.20261108.s57.application",
      "claim.stats1.20261108.s58.application",
      "claim.stats1.20261108.s59.application",
      "claim.stats1.20261108.ci-precision",
      "claim.stats1.20261108.s60.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.statistics-ethics.errors-power",
    "displayName": "Distinguish type I error, type II error, and power",
    "learningObjective": "Distinguish type I error, type II error, and power relative to a prespecified model and effect.",
    "earliestFacilityStage": 2,
    "educationalTier": 1,
    "conceptType": "applied_science",
    "evidenceClaimIds": [
      "claim.stats1.20261108.type-i",
      "claim.stats1.20261108.type-ii",
      "claim.stats1.20261108.s61.application",
      "claim.stats1.20261108.s62.application",
      "claim.stats1.20261108.power",
      "claim.stats1.20261108.s63.application",
      "claim.stats1.20261108.s64.application"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-07",
      "clinicianSignOff": false,
      "scope": "Technical, editorial, source-traceability, and internal-consistency review; named clinician review remains required."
    },
    "conceptMeaning": "same",
    "conceptVersionReason": "Focused single-skill variants remain within the existing statistics objective; stable IDs and old FSRS histories remain attached.",
    "historyMigration": "None; no history transfer, selector change or acceptance."
  }
] as const;
