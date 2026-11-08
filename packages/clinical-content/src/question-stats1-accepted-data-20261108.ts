import type {Stats1Definition} from "./question-stats1-20261108-data";
import type {EvidenceClaim} from "./pilot-schema";
export const QUESTION_STATS1_REPAIRED_DEFINITIONS:Stats1Definition[]=[
  {
    "auditId": "S01",
    "title": "Choose an independent two-mean test",
    "family": "independent-t",
    "caseId": "case.gs028se.independent-t-paired-t.a-two-teams",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-teams.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v1.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.independent-t.v1.r2",
      "conceptId": "concept.statistics-ethics.independent-t",
      "stem": "Which test directly compares the two population mean healing times?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s01.key",
          "label": "Independent-samples Student t-test",
          "isCorrect": true,
          "rationale": "Two independent groups with approximately normal healing times within groups and similar variances: use the independent-samples t-test.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s01.d1",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "This needs matched pairs or repeated observations; the stated groups are independent and unpaired.",
          "distractorRationale": "This needs matched pairs or repeated observations; the stated groups are independent and unpaired."
        },
        {
          "id": "choice.stats1.20261108.r2.s01.d2",
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
            "value": "Two dressing groups; independent, unpaired patients."
          },
          {
            "label": "Outcome",
            "value": "Healing time in days; approximately normal within groups, with similar variances."
          }
        ]
      },
      "explanation": "Two independent groups with approximately normal healing times within groups and similar variances: use the independent-samples t-test.\nIt compares the two population mean healing times.\nA paired t-test needs matched pairs or repeated observations.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.r2.s01.application"
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
    "focus": "Make independence/unpaired sampling explicit; teach the actual normal-within-group and similar-variance assumptions for two groups. Remove shared-assessor language; label the individual outcome, not its mean.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S02",
    "title": "Choose an independent two-mean test",
    "family": "independent-t",
    "caseId": "case.gs028se.independent-t-paired-t.a-two-cohorts",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-cohorts.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v2.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.independent-t.v2.r2",
      "conceptId": "concept.statistics-ethics.independent-t",
      "stem": "Which test compares the two population mean blood losses?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s02.key",
          "label": "Independent-samples Student t-test",
          "isCorrect": true,
          "rationale": "Two independent groups with approximately normal blood losses within groups and similar variances: use the independent-samples t-test.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s02.d1",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "This needs matched pairs or repeated observations; the stated groups are independent and unpaired.",
          "distractorRationale": "This needs matched pairs or repeated observations; the stated groups are independent and unpaired."
        },
        {
          "id": "choice.stats1.20261108.r2.s02.d2",
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
            "value": "Two hospital groups; independent, unpaired patients."
          },
          {
            "label": "Outcome",
            "value": "Blood loss in mL; approximately normal within groups, with similar variances."
          }
        ]
      },
      "explanation": "Two independent groups with approximately normal blood losses within groups and similar variances: use the independent-samples t-test.\nIt compares the two population mean blood losses.\nA paired t-test needs matched pairs or repeated observations.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.r2.s02.application"
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
    "focus": "Make independence/unpaired sampling explicit; teach the actual normal-within-group and similar-variance assumptions for two groups. Remove shared-assessor language; label the individual outcome, not its mean.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S03",
    "title": "Choose an independent two-mean test",
    "family": "independent-t",
    "caseId": "case.gs028se.independent-t-paired-t.a-two-shifts",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-shifts.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v3.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.independent-t.v3.r2",
      "conceptId": "concept.statistics-ethics.independent-t",
      "stem": "Which test directly compares the two population mean incision lengths?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s03.key",
          "label": "Independent-samples Student t-test",
          "isCorrect": true,
          "rationale": "Two independent groups with approximately normal incision lengths within groups and similar variances: use the independent-samples t-test.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s03.d1",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "This needs matched pairs or repeated observations; the stated groups are independent and unpaired.",
          "distractorRationale": "This needs matched pairs or repeated observations; the stated groups are independent and unpaired."
        },
        {
          "id": "choice.stats1.20261108.r2.s03.d2",
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
            "value": "Two surgical-approach groups; independent, unpaired patients."
          },
          {
            "label": "Outcome",
            "value": "Incision length in cm; approximately normal within groups, with similar variances."
          }
        ]
      },
      "explanation": "Two independent groups with approximately normal incision lengths within groups and similar variances: use the independent-samples t-test.\nIt compares the two population mean incision lengths.\nA paired t-test needs matched pairs or repeated observations.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.r2.s03.application"
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
    "focus": "Make independence/unpaired sampling explicit; teach the actual normal-within-group and similar-variance assumptions for two groups. Remove shared-assessor language; label the individual outcome, not its mean.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S04",
    "title": "Choose an independent two-mean test",
    "family": "independent-t",
    "caseId": "case.gs028se.independent-t-paired-t.a-two-scripts",
    "nodeId": "node.gs028se.independent-t-paired-t.a-two-scripts.1",
    "questionVariantId": "question.statistics-ethics.independent-t.v4.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.independent-t.v4.r2",
      "conceptId": "concept.statistics-ethics.independent-t",
      "stem": "Which test directly compares the two population mean walking distances?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s04.key",
          "label": "Independent-samples Student t-test",
          "isCorrect": true,
          "rationale": "Two independent groups with approximately normal walking distances within groups and similar variances: use the independent-samples t-test.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s04.d1",
          "label": "Paired-samples Student t-test",
          "isCorrect": false,
          "rationale": "This needs matched pairs or repeated observations; the stated groups are independent and unpaired.",
          "distractorRationale": "This needs matched pairs or repeated observations; the stated groups are independent and unpaired."
        },
        {
          "id": "choice.stats1.20261108.r2.s04.d2",
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
            "value": "Two rehabilitation-program groups; independent, unpaired patients."
          },
          {
            "label": "Outcome",
            "value": "Walking distance in meters; approximately normal within groups, with similar variances."
          }
        ]
      },
      "explanation": "Two independent groups with approximately normal walking distances within groups and similar variances: use the independent-samples t-test.\nIt compares the two population mean walking distances.\nA paired t-test needs matched pairs or repeated observations.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.rank-sum",
        "claim.stats1.20261108.r2.s04.application"
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
    "focus": "Make independence/unpaired sampling explicit; teach the actual normal-within-group and similar-variance assumptions for two groups. Remove shared-assessor language; label the individual outcome, not its mean.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S09",
    "title": "Choose one omnibus mean comparison",
    "family": "one-way-anova",
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-three-teams",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-three-teams.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v1.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.one-way-anova.v1.r2",
      "conceptId": "concept.statistics-ethics.one-way-anova",
      "stem": "Which single test compares all population means?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s09.key",
          "label": "One-way analysis of variance test",
          "isCorrect": true,
          "rationale": "3 independent groups, approximately normal outcomes within groups and similar variances support one ANOVA comparison of all 3 population means.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s09.d1",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means.",
          "distractorRationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means."
        },
        {
          "id": "choice.stats1.20261108.r2.s09.d2",
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
            "value": "3 dressing groups; independent patients."
          },
          {
            "label": "Outcome",
            "value": "healing time in days; approximately normal within groups with similar variances."
          }
        ]
      },
      "explanation": "3 independent groups with approximately normal healing time within groups and similar variances: use one-way ANOVA.\nNull: all 3 population means are equal; rejection does not identify which pair differs.\nA two-sample t-test compares only two group means.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.one-way-anova",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.r2.s09.application"
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
    "focus": "State independence and teach the actual 3-group normality/similar-variance assumptions. Keep the conventional test names and the one omnibus comparison.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S10",
    "title": "Choose one omnibus mean comparison",
    "family": "one-way-anova",
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-four-formats",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-four-formats.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v2.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.one-way-anova.v2.r2",
      "conceptId": "concept.statistics-ethics.one-way-anova",
      "stem": "Which single test compares all population means?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s10.key",
          "label": "One-way analysis of variance test",
          "isCorrect": true,
          "rationale": "4 independent groups, approximately normal outcomes within groups and similar variances support one ANOVA comparison of all 4 population means.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s10.d1",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means.",
          "distractorRationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means."
        },
        {
          "id": "choice.stats1.20261108.r2.s10.d2",
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
            "value": "4 ward groups; independent patients."
          },
          {
            "label": "Outcome",
            "value": "length of stay in days; approximately normal within groups with similar variances."
          }
        ]
      },
      "explanation": "4 independent groups with approximately normal length of stay within groups and similar variances: use one-way ANOVA.\nNull: all 4 population means are equal; rejection does not identify which pair differs.\nA two-sample t-test compares only two group means.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.one-way-anova",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.r2.s10.application"
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
    "focus": "State independence and teach the actual 4-group normality/similar-variance assumptions. Keep the conventional test names and the one omnibus comparison.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S11",
    "title": "Choose one omnibus mean comparison",
    "family": "one-way-anova",
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-three-sites",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-three-sites.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v3.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.one-way-anova.v3.r2",
      "conceptId": "concept.statistics-ethics.one-way-anova",
      "stem": "Which single test compares all population means?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s11.key",
          "label": "One-way analysis of variance test",
          "isCorrect": true,
          "rationale": "3 independent groups, approximately normal outcomes within groups and similar variances support one ANOVA comparison of all 3 population means.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s11.d1",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means.",
          "distractorRationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means."
        },
        {
          "id": "choice.stats1.20261108.r2.s11.d2",
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
            "value": "3 training-program groups; independent patients."
          },
          {
            "label": "Outcome",
            "value": "task-completion time in seconds; approximately normal within groups with similar variances."
          }
        ]
      },
      "explanation": "3 independent groups with approximately normal task-completion time within groups and similar variances: use one-way ANOVA.\nNull: all 3 population means are equal; rejection does not identify which pair differs.\nA two-sample t-test compares only two group means.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.one-way-anova",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.r2.s11.application"
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
    "focus": "State independence and teach the actual 3-group normality/similar-variance assumptions. Keep the conventional test names and the one omnibus comparison.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S12",
    "title": "Choose one omnibus mean comparison",
    "family": "one-way-anova",
    "caseId": "case.gs028se.one-way-anova-rank-sum.a-five-signs",
    "nodeId": "node.gs028se.one-way-anova-rank-sum.a-five-signs.1",
    "questionVariantId": "question.statistics-ethics.one-way-anova.v4.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.one-way-anova.v4.r2",
      "conceptId": "concept.statistics-ethics.one-way-anova",
      "stem": "Which single test compares all population means?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s12.key",
          "label": "One-way analysis of variance test",
          "isCorrect": true,
          "rationale": "4 independent groups, approximately normal outcomes within groups and similar variances support one ANOVA comparison of all 4 population means.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s12.d1",
          "label": "Independent-samples Student t-test",
          "isCorrect": false,
          "rationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means.",
          "distractorRationale": "A single two-sample t-test does not supply the requested omnibus comparison of three or more means."
        },
        {
          "id": "choice.stats1.20261108.r2.s12.d2",
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
            "value": "4 device groups; independent patients."
          },
          {
            "label": "Outcome",
            "value": "blood loss in mL; approximately normal within groups with similar variances."
          }
        ]
      },
      "explanation": "4 independent groups with approximately normal blood loss within groups and similar variances: use one-way ANOVA.\nNull: all 4 population means are equal; rejection does not identify which pair differs.\nA two-sample t-test compares only two group means.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.one-way-anova",
        "claim.stats1.20261108.independent-t",
        "claim.stats1.20261108.paired-t",
        "claim.stats1.20261108.r2.s12.application"
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
    "focus": "State independence and teach the actual 4-group normality/similar-variance assumptions. Keep the conventional test names and the one omnibus comparison.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S21",
    "title": "Choose an association test for independent categories",
    "family": "chi-square",
    "caseId": "case.gs028se.signed-rank-chi-square.b-role-by-choice",
    "nodeId": "node.gs028se.signed-rank-chi-square.b-role-by-choice.1",
    "questionVariantId": "question.statistics-ethics.chi-square.v1.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.chi-square.v1.r2",
      "conceptId": "concept.statistics-ethics.chi-square",
      "stem": "Which test assesses association between the row and column categories?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s21.key",
          "label": "Pearson chi-square test",
          "isCorrect": true,
          "rationale": "Independent categorical observations with adequately populated expected cells fit this association test.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s21.d1",
          "label": "McNemar chi-square test",
          "isCorrect": false,
          "rationale": "This is for paired binary responses, not the independent multi-category table shown.",
          "distractorRationale": "This is for paired binary responses, not the independent multi-category table shown."
        },
        {
          "id": "choice.stats1.20261108.r2.s21.d2",
          "label": "One-way analysis of variance test",
          "isCorrect": false,
          "rationale": "Category counts are not continuous observations for comparing population means.",
          "distractorRationale": "Category counts are not continuous observations for comparing population means."
        }
      ],
      "exhibit": {
        "kind": "table",
        "caption": "Constructed independent patients; smoking status at admission, one category each.",
        "columnHeaders": [
          "Current",
          "Former",
          "Never"
        ],
        "rowHeaders": [
          "Group A",
          "Group B"
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
        "claim.stats1.20261108.r2.s21.application",
        "claim.stats1.20261108.r2.expected-cell"
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
    "focus": "Use one mutually exclusive current/former/never smoking category per independent patient at admission. Keep all six counts, the single association task and options.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S25",
    "title": "Choose an exact test for sparse independent counts",
    "family": "fisher-exact",
    "caseId": "case.gs028se.fisher-exact-study-design.a-rare-event",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-rare-event.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v1.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.fisher-exact.v1.r2",
      "conceptId": "concept.statistics-ethics.fisher-exact",
      "stem": "Which test compares the event proportions?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s25.key",
          "label": "Fisher exact test",
          "isCorrect": true,
          "rationale": "The groups are independent and the event cells are sparse. Expected event count = row total x event-column total / N = 8 x 2 / 16 = 1 per group.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s25.d1",
          "label": "Pearson chi-square test",
          "isCorrect": false,
          "rationale": "Its large-sample approximation is unreliable for these tiny expected event counts.",
          "distractorRationale": "Its large-sample approximation is unreliable for these tiny expected event counts."
        },
        {
          "id": "choice.stats1.20261108.r2.s25.d2",
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
      "explanation": "Sparse independent 2x2 counts -> Fisher exact test.\nExpected event count = row total x event-column total / N = 8 x 2 / 16 = 1 per group.\nPearson chi-square relies on an unreliable large-sample approximation for these tiny expected cells.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.fisher-exact",
        "claim.stats1.20261108.chi-square",
        "claim.stats1.20261108.mcnemar",
        "claim.stats1.20261108.r2.s25.application",
        "claim.stats1.20261108.r2.expected-cell"
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
    "focus": "Show the expected-cell formula with the actual row total, event-column total and grand total. Retain the sparse independent 2x2 rule and conventional procedure choices.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S26",
    "title": "Choose an exact test for sparse independent counts",
    "family": "fisher-exact",
    "caseId": "case.gs028se.fisher-exact-study-design.a-tiny-pilot",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-tiny-pilot.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v2.r5",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.fisher-exact.v2.r5",
      "conceptId": "concept.statistics-ethics.fisher-exact",
      "stem": "Which test compares the event proportions?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s26.key",
          "label": "Fisher exact test",
          "isCorrect": true,
          "rationale": "The groups are independent and the event cells are sparse. Expected event count = row total x event-column total / N = 10 x 1 / 20 = 0.5 per group.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s26.d1",
          "label": "Pearson chi-square test",
          "isCorrect": false,
          "rationale": "Its large-sample approximation is unreliable for these tiny expected event counts.",
          "distractorRationale": "Its large-sample approximation is unreliable for these tiny expected event counts."
        },
        {
          "id": "choice.stats1.20261108.r2.s26.d2",
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
      "explanation": "Sparse independent 2x2 counts -> Fisher exact test.\nExpected event count = row total x event-column total / N = 10 x 1 / 20 = 0.5 per group.\nPearson chi-square relies on an unreliable large-sample approximation for these tiny expected cells.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.fisher-exact",
        "claim.stats1.20261108.chi-square",
        "claim.stats1.20261108.mcnemar",
        "claim.stats1.20261108.r2.s26.application",
        "claim.stats1.20261108.r2.expected-cell"
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
    "focus": "Show the expected-cell formula with the actual row total, event-column total and grand total. Retain the sparse independent 2x2 rule and conventional procedure choices.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S27",
    "title": "Choose an exact test for sparse independent counts",
    "family": "fisher-exact",
    "caseId": "case.gs028se.fisher-exact-study-design.a-sparse-exposure",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-sparse-exposure.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v3.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.fisher-exact.v3.r2",
      "conceptId": "concept.statistics-ethics.fisher-exact",
      "stem": "Which test compares the event proportions?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s27.key",
          "label": "Fisher exact test",
          "isCorrect": true,
          "rationale": "The groups are independent and the event cells are sparse. Expected event count = row total x event-column total / N = 10 x 2 / 20 = 1 per group.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s27.d1",
          "label": "Pearson chi-square test",
          "isCorrect": false,
          "rationale": "Its large-sample approximation is unreliable for these tiny expected event counts.",
          "distractorRationale": "Its large-sample approximation is unreliable for these tiny expected event counts."
        },
        {
          "id": "choice.stats1.20261108.r2.s27.d2",
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
      "explanation": "Sparse independent 2x2 counts -> Fisher exact test.\nExpected event count = row total x event-column total / N = 10 x 2 / 20 = 1 per group.\nPearson chi-square relies on an unreliable large-sample approximation for these tiny expected cells.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.fisher-exact",
        "claim.stats1.20261108.chi-square",
        "claim.stats1.20261108.mcnemar",
        "claim.stats1.20261108.r2.s27.application",
        "claim.stats1.20261108.r2.expected-cell"
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
    "focus": "Show the expected-cell formula with the actual row total, event-column total and grand total. Retain the sparse independent 2x2 rule and conventional procedure choices.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S28",
    "title": "Choose an exact test for sparse independent counts",
    "family": "fisher-exact",
    "caseId": "case.gs028se.fisher-exact-study-design.a-small-response",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-small-response.1",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v4.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.fisher-exact.v4.r2",
      "conceptId": "concept.statistics-ethics.fisher-exact",
      "stem": "Which test compares the event proportions?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s28.key",
          "label": "Fisher exact test",
          "isCorrect": true,
          "rationale": "The groups are independent and the event cells are sparse. Expected event count = row total x event-column total / N = 12 x 1 / 24 = 0.5 per group.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s28.d1",
          "label": "Pearson chi-square test",
          "isCorrect": false,
          "rationale": "Its large-sample approximation is unreliable for these tiny expected event counts.",
          "distractorRationale": "Its large-sample approximation is unreliable for these tiny expected event counts."
        },
        {
          "id": "choice.stats1.20261108.r2.s28.d2",
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
      "explanation": "Sparse independent 2x2 counts -> Fisher exact test.\nExpected event count = row total x event-column total / N = 12 x 1 / 24 = 0.5 per group.\nPearson chi-square relies on an unreliable large-sample approximation for these tiny expected cells.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.fisher-exact",
        "claim.stats1.20261108.chi-square",
        "claim.stats1.20261108.mcnemar",
        "claim.stats1.20261108.r2.s28.application",
        "claim.stats1.20261108.r2.expected-cell"
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
    "focus": "Show the expected-cell formula with the actual row total, event-column total and grand total. Retain the sparse independent 2x2 rule and conventional procedure choices.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S30",
    "title": "Identify one study design",
    "family": "study-design",
    "caseId": "case.gs028se.fisher-exact-study-design.b-random-scripts",
    "nodeId": "node.gs028se.fisher-exact-study-design.b-random-scripts.1",
    "questionVariantId": "question.statistics-ethics.study-design.v2.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.study-design.v2.r2",
      "conceptId": "concept.statistics-ethics.study-design",
      "stem": "What is the study design?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s30.key",
          "label": "Cohort study",
          "isCorrect": true,
          "rationale": "Consecutive historical charts enter without outcome-based selection, then outcomes are compared by earlier exposure.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s30.d1",
          "label": "Case-control study",
          "isCorrect": false,
          "rationale": "This would select patients according to infection status, which is not the sampling basis here.",
          "distractorRationale": "This would select patients according to infection status, which is not the sampling basis here."
        },
        {
          "id": "choice.stats1.20261108.r2.s30.d2",
          "label": "Cross-sectional study",
          "isCorrect": false,
          "rationale": "These records preserve exposure before the later postoperative outcome rather than a single simultaneous assessment.",
          "distractorRationale": "These records preserve exposure before the later postoperative outcome rather than a single simultaneous assessment."
        }
      ],
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed study data",
        "items": [
          {
            "label": "Study",
            "value": "Consecutive surgical charts from last year, selected regardless of infection; compare recorded postoperative infections by preoperative smoking status."
          }
        ]
      },
      "explanation": "A retrospective cohort identifies a population without selecting on outcome.\nConsecutive patients enter regardless of infection; smoking precedes the recorded infections.\nCase-control studies select people by outcome status.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.study-design",
        "claim.stats1.20261108.r2.s30.application"
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
    "focus": "Specify consecutive historical charts selected without regard to infection; distinguish sampling basis from exposure-outcome chronology in the feedback.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S48",
    "title": "Interpret relative risk without changing its scale",
    "family": "risk-ratio-odds-ratio",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical.1",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v4.r5",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.risk-ratio-odds-ratio.v4.r5",
      "conceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
      "stem": "How does group A's risk compare with group B's?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s48.key",
          "label": "Risk is 50% lower",
          "isCorrect": true,
          "rationale": "A risk ratio of 0.5 means group A has half the event risk of group B.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s48.d1",
          "label": "Risk is 50% higher",
          "isCorrect": false,
          "rationale": "A 50% higher risk would correspond to a risk ratio of 1.5, not 0.5.",
          "distractorRationale": "A 50% higher risk would correspond to a risk ratio of 1.5, not 0.5."
        },
        {
          "id": "choice.stats1.20261108.r2.s48.d2",
          "label": "Risk is unchanged",
          "isCorrect": false,
          "rationale": "Equal risk corresponds to a risk ratio of 1, not 0.5.",
          "distractorRationale": "Equal risk corresponds to a risk ratio of 1, not 0.5."
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
      "explanation": "Risk ratio 0.5 = half the comparison risk = 50% lower risk.\nThis is a relative probability, not an absolute percentage-point difference.\nA 50% higher risk would require a risk ratio of 1.5.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.risk-ratio",
        "claim.stats1.20261108.odds-ratio",
        "claim.stats1.20261108.arr",
        "claim.stats1.20261108.r2.s48.application"
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
    "focus": "Use parallel risk statements differing in direction or magnitude; remove the risk/odds and percent/percentage-point component-convergence shortcut.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S49",
    "title": "Calculate NNT for one outcome and horizon",
    "family": "arr-nnt",
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-ten",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-ten.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v1.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.arr-nnt.v1.r2",
      "conceptId": "concept.statistics-ethics.arr-nnt",
      "stem": "What is the number needed to treat to prevent one infection during follow-up?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s49.key",
          "label": "10 patients",
          "isCorrect": true,
          "rationale": "ARR = 0.20 - 0.10 = 0.10; NNT = 1 / 0.10 = 10 over 30 days.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s49.d1",
          "label": "5 patients",
          "isCorrect": false,
          "rationale": "This is 1 / 0.20, the reciprocal of control risk rather than risk reduction.",
          "distractorRationale": "This is 1 / 0.20, the reciprocal of control risk rather than risk reduction."
        },
        {
          "id": "choice.stats1.20261108.r2.s49.d2",
          "label": "20 patients",
          "isCorrect": false,
          "rationale": "This treats the control percentage as a patient count instead of taking the reciprocal risk difference.",
          "distractorRationale": "This treats the control percentage as a patient count instead of taking the reciprocal risk difference."
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
      "explanation": "ARR = control risk - treatment risk = 20% - 10% = 10 percentage points.\nNNT = 1 / 0.1 = 10 patients over 30 days.\n5 patients is 1 / 0.20, using control risk instead of risk reduction.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.arr",
        "claim.stats1.20261108.nnt",
        "claim.stats1.20261108.r2.s49.application"
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
    "focus": "Put plausible values on both sides of the key, breaking the repeated sole-large/two-digit-key pattern. Retain rates/outcome/30-day horizon and explain an actual offered error.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S50",
    "title": "Calculate absolute risk reduction",
    "family": "arr-nnt",
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-five",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-five.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v2.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.arr-nnt.v2.r2",
      "conceptId": "concept.statistics-ethics.arr-nnt",
      "stem": "What is the absolute risk reduction?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s50.key",
          "label": "5 percentage points",
          "isCorrect": true,
          "rationale": "ARR = 15% - 10% = 5 percentage points.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s50.d1",
          "label": "10 percentage points",
          "isCorrect": false,
          "rationale": "This substitutes the treatment event rate for the between-group difference.",
          "distractorRationale": "This substitutes the treatment event rate for the between-group difference."
        },
        {
          "id": "choice.stats1.20261108.r2.s50.d2",
          "label": "15 percentage points",
          "isCorrect": false,
          "rationale": "This substitutes the control event rate for the between-group difference.",
          "distractorRationale": "This substitutes the control event rate for the between-group difference."
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
      "explanation": "ARR = control event risk - treatment event risk.\n15% - 10% = 5 percentage points.\nThe 10-point option substitutes the treatment event rate for the risk difference.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.arr",
        "claim.stats1.20261108.nnt",
        "claim.stats1.20261108.r2.s50.application"
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
    "focus": "Offer feasible same-scale 5/10/15-point values and explain the offered treatment-rate substitution; remove impossible large distractors.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S51",
    "title": "Calculate NNT for one outcome and horizon",
    "family": "arr-nnt",
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-twenty",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-twenty.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v3.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.arr-nnt.v3.r2",
      "conceptId": "concept.statistics-ethics.arr-nnt",
      "stem": "What is the number needed to treat to prevent one infection during follow-up?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s51.key",
          "label": "25 patients",
          "isCorrect": true,
          "rationale": "ARR = 0.12 - 0.08 = 0.04; NNT = 1 / 0.04 = 25 over 30 days.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s51.d1",
          "label": "4 patients",
          "isCorrect": false,
          "rationale": "This uses the raw percentage-point reduction as a patient count without taking its reciprocal as a proportion.",
          "distractorRationale": "This uses the raw percentage-point reduction as a patient count without taking its reciprocal as a proportion."
        },
        {
          "id": "choice.stats1.20261108.r2.s51.d2",
          "label": "33 patients",
          "isCorrect": false,
          "rationale": "This uses the rounded relative percentage reduction as a patient count instead of the reciprocal absolute reduction.",
          "distractorRationale": "This uses the rounded relative percentage reduction as a patient count instead of the reciprocal absolute reduction."
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
      "explanation": "ARR = control risk - treatment risk = 12% - 8% = 4 percentage points.\nNNT = 1 / 0.04 = 25 patients over 30 days.\n4 is the percentage-point reduction, not its reciprocal expressed as a proportion.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.arr",
        "claim.stats1.20261108.nnt",
        "claim.stats1.20261108.r2.s51.application"
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
    "focus": "Put plausible values on both sides of the key, breaking the repeated sole-large/two-digit-key pattern. Retain rates/outcome/30-day horizon and explain an actual offered error.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S52",
    "title": "Calculate NNT for one outcome and horizon",
    "family": "arr-nnt",
    "caseId": "case.gs028se.arr-nnt-p-value.a-arr-six",
    "nodeId": "node.gs028se.arr-nnt-p-value.a-arr-six.1",
    "questionVariantId": "question.statistics-ethics.arr-nnt.v4.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.arr-nnt.v4.r2",
      "conceptId": "concept.statistics-ethics.arr-nnt",
      "stem": "What is the number needed to treat to prevent one infection during follow-up?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s52.key",
          "label": "20 patients",
          "isCorrect": true,
          "rationale": "ARR = 0.30 - 0.25 = 0.05; NNT = 1 / 0.05 = 20 over 30 days.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s52.d1",
          "label": "5 patients",
          "isCorrect": false,
          "rationale": "This uses the raw percentage-point reduction instead of its reciprocal as a proportion.",
          "distractorRationale": "This uses the raw percentage-point reduction instead of its reciprocal as a proportion."
        },
        {
          "id": "choice.stats1.20261108.r2.s52.d2",
          "label": "25 patients",
          "isCorrect": false,
          "rationale": "This uses the treatment percentage as a patient count instead of the reciprocal absolute reduction.",
          "distractorRationale": "This uses the treatment percentage as a patient count instead of the reciprocal absolute reduction."
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
      "explanation": "ARR = control risk - treatment risk = 30% - 25% = 5 percentage points.\nNNT = 1 / 0.05 = 20 patients over 30 days.\n5 is the percentage-point reduction; NNT requires 1 / 0.05.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.arr",
        "claim.stats1.20261108.nnt",
        "claim.stats1.20261108.r2.s52.application"
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
    "focus": "Put plausible values on both sides of the key, breaking the repeated sole-large/two-digit-key pattern. Retain rates/outcome/30-day horizon and explain an actual offered error.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S54",
    "title": "Compare an uncertainty interval with a benefit target",
    "family": "p-value",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-040",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-040.1",
    "questionVariantId": "question.statistics-ethics.p-value.v2.r8",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v2.r8",
      "conceptId": "concept.statistics-ethics.p-value.v2",
      "stem": "Where does the target threshold fall relative to the confidence interval?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s54.key",
          "label": "Threshold lies inside the interval",
          "isCorrect": true,
          "rationale": "The 2-day threshold is greater than 1 and less than 3.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s54.d1",
          "label": "Threshold lies below the interval",
          "isCorrect": false,
          "rationale": "The interval begins at 1 day, below the 2-day threshold.",
          "distractorRationale": "The interval begins at 1 day, below the 2-day threshold."
        },
        {
          "id": "choice.stats1.20261108.r2.s54.d2",
          "label": "Threshold lies above the interval",
          "isCorrect": false,
          "rationale": "The interval extends to 3 days, above the 2-day threshold.",
          "distractorRationale": "The interval extends to 3 days, above the 2-day threshold."
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
            "label": "Target benefit threshold",
            "value": "2 days."
          },
          {
            "label": "95% confidence interval for the reduction",
            "value": "1 to 3 days."
          }
        ]
      },
      "explanation": "Compare the single target threshold with both interval endpoints.\n1 < 2 < 3 days: the interval includes reductions below and above the threshold.\nThe threshold is not below the interval, whose lower endpoint is 1 day.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.target-interval",
        "claim.stats1.20261108.ci-null",
        "claim.stats1.20261108.r2.s54.application"
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
    "focus": "State the target as the single 2-day threshold and use threshold consistently in task/options/feedback; show both sides of the threshold in the interval.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S55",
    "title": "Avoid proving no effect from nonsignificance",
    "family": "p-value",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-0001",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-0001.1",
    "questionVariantId": "question.statistics-ethics.p-value.v3.r6",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v3.r6",
      "conceptId": "concept.statistics-ethics.p-value",
      "stem": "Which conclusion follows from the difference test?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s55.key",
          "label": "The null hypothesis is not rejected",
          "isCorrect": true,
          "rationale": "The p-value exceeds the stated significance level; this does not prove the null.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s55.d1",
          "label": "The treatments are demonstrated equivalent",
          "isCorrect": false,
          "rationale": "Failure to reject a difference-test null is not an equivalence test.",
          "distractorRationale": "Failure to reject a difference-test null is not an equivalence test."
        },
        {
          "id": "choice.stats1.20261108.r2.s55.d2",
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
      "explanation": "A p-value above the chosen threshold does not reject the null.\n0.20 > 0.05 -> do not reject the tested null hypothesis.\nNonsignificance does not demonstrate equivalence.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.p-value",
        "claim.stats1.20261108.p-decision",
        "claim.stats1.20261108.r2.s55.application"
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
    "focus": "Use only the stated p-value and significance level: refer to the tested null, without inventing an equal-means null or adding data.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  },
  {
    "auditId": "S59",
    "title": "Use zero as the null for a difference",
    "family": "confidence-interval",
    "caseId": "case.gs028se.confidence-interval-errors-power.a-precision-width",
    "nodeId": "node.gs028se.confidence-interval-errors-power.a-precision-width.1",
    "questionVariantId": "question.statistics-ethics.confidence-interval.v3.r2",
    "question": {
      "contentVersion": "question-authoring.2026-11-08.stats1-r2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.confidence-interval.v3.r2",
      "conceptId": "concept.statistics-ethics.confidence-interval",
      "stem": "At the matching 5% significance level, which conclusion follows?",
      "answerChoices": [
        {
          "id": "choice.stats1.20261108.r2.s59.key",
          "label": "Recovery times do not differ significantly",
          "isCorrect": true,
          "rationale": "The reported range spans zero, the no-effect value.",
          "distractorRationale": null
        },
        {
          "id": "choice.stats1.20261108.r2.s59.d1",
          "label": "Recovery times are significantly shorter with A",
          "isCorrect": false,
          "rationale": "The interval includes a difference in the opposite direction as well as 0.",
          "distractorRationale": "The interval includes a difference in the opposite direction as well as 0."
        },
        {
          "id": "choice.stats1.20261108.r2.s59.d2",
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
      "explanation": "The null value for a difference is 0, not 1.\nThe interval -2 to +1 days includes 0, so the matching test does not reject no difference.\nA negative lower endpoint alone does not establish a significant decrease.",
      "supportingEvidenceClaimIds": [
        "claim.stats1.20261108.ci-null",
        "claim.stats1.20261108.p-decision",
        "claim.stats1.20261108.r2.s59.application"
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
    "focus": "Explain the shown negative lower endpoint, not an unstated point estimate; retain the interval, matching test and choices.",
    "educationalIntent": "focused_statistics_practice",
    "holdStatus": "none"
  }
];
export const QUESTION_STATS1_REPAIRED_CLAIMS:(EvidenceClaim&{basisClaimIds:string[];verificationScope:string})[]=[
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s01.application",
    "statement": "In this constructed comparison, two independent unpaired groups have approximately normal healing times within groups and similar variances; an independent-samples t-test directly compares their population means.",
    "basisClaimIds": [
      "claim.gs028se.statistics.independent-t",
      "claim.gs028se.statistics.paired-t",
      "claim.gs028se.statistics.rank-sum"
    ],
    "sourceIds": [
      "source.nist.independent-t.2026",
      "source.nist.paired-t.2026",
      "source.nist.rank-sum.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s02.application",
    "statement": "In this constructed comparison, two independent unpaired groups have approximately normal blood losses within groups and similar variances; an independent-samples t-test directly compares their population means.",
    "basisClaimIds": [
      "claim.gs028se.statistics.independent-t",
      "claim.gs028se.statistics.paired-t",
      "claim.gs028se.statistics.rank-sum"
    ],
    "sourceIds": [
      "source.nist.independent-t.2026",
      "source.nist.paired-t.2026",
      "source.nist.rank-sum.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s03.application",
    "statement": "In this constructed comparison, two independent unpaired groups have approximately normal incision lengths within groups and similar variances; an independent-samples t-test directly compares their population means.",
    "basisClaimIds": [
      "claim.gs028se.statistics.independent-t",
      "claim.gs028se.statistics.paired-t",
      "claim.gs028se.statistics.rank-sum"
    ],
    "sourceIds": [
      "source.nist.independent-t.2026",
      "source.nist.paired-t.2026",
      "source.nist.rank-sum.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s04.application",
    "statement": "In this constructed comparison, two independent unpaired groups have approximately normal walking distances within groups and similar variances; an independent-samples t-test directly compares their population means.",
    "basisClaimIds": [
      "claim.gs028se.statistics.independent-t",
      "claim.gs028se.statistics.paired-t",
      "claim.gs028se.statistics.rank-sum"
    ],
    "sourceIds": [
      "source.nist.independent-t.2026",
      "source.nist.paired-t.2026",
      "source.nist.rank-sum.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s09.application",
    "statement": "With 3 independent groups, approximately normal healing time within groups and similar variances in this constructed example, one-way ANOVA tests equality of all 3 population means without identifying a particular pair.",
    "basisClaimIds": [
      "claim.gs028se.statistics.one-way-anova",
      "claim.gs028se.statistics.independent-t",
      "claim.gs028se.statistics.paired-t"
    ],
    "sourceIds": [
      "source.nist.anova.2026",
      "source.nist.independent-t.2026",
      "source.nist.paired-t.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s10.application",
    "statement": "With 4 independent groups, approximately normal length of stay within groups and similar variances in this constructed example, one-way ANOVA tests equality of all 4 population means without identifying a particular pair.",
    "basisClaimIds": [
      "claim.gs028se.statistics.one-way-anova",
      "claim.gs028se.statistics.independent-t",
      "claim.gs028se.statistics.paired-t"
    ],
    "sourceIds": [
      "source.nist.anova.2026",
      "source.nist.independent-t.2026",
      "source.nist.paired-t.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s11.application",
    "statement": "With 3 independent groups, approximately normal task-completion time within groups and similar variances in this constructed example, one-way ANOVA tests equality of all 3 population means without identifying a particular pair.",
    "basisClaimIds": [
      "claim.gs028se.statistics.one-way-anova",
      "claim.gs028se.statistics.independent-t",
      "claim.gs028se.statistics.paired-t"
    ],
    "sourceIds": [
      "source.nist.anova.2026",
      "source.nist.independent-t.2026",
      "source.nist.paired-t.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s12.application",
    "statement": "With 4 independent groups, approximately normal blood loss within groups and similar variances in this constructed example, one-way ANOVA tests equality of all 4 population means without identifying a particular pair.",
    "basisClaimIds": [
      "claim.gs028se.statistics.one-way-anova",
      "claim.gs028se.statistics.independent-t",
      "claim.gs028se.statistics.paired-t"
    ],
    "sourceIds": [
      "source.nist.anova.2026",
      "source.nist.independent-t.2026",
      "source.nist.paired-t.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s21.application",
    "statement": "The constructed table counts each independent patient once by group and mutually exclusive smoking status at admission (current, former or never); its smallest expected cell is 50 x 20 / 100 = 10, supporting the Pearson chi-square approximation.",
    "basisClaimIds": [
      "claim.gs028se.statistics.chi-square",
      "claim.gs028se.statistics.chi-square.mcnemar-boundary",
      "claim.gs028se.statistics.one-way-anova"
    ],
    "sourceIds": [
      "source.nist.chi-square.2026",
      "source.nist.mcnemar.2026",
      "source.nist.anova.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s25.application",
    "statement": "For the constructed independent 2x2 table, expected events under independence equal row total times event-column total divided by grand total: 8 x 2 / 16 = 1 in each group; Fisher exact testing avoids the unreliable sparse-cell Pearson approximation.",
    "basisClaimIds": [
      "claim.gs028se.statistics.fisher-exact",
      "claim.gs028se.statistics.chi-square",
      "claim.gs028se.statistics.chi-square.mcnemar-boundary"
    ],
    "sourceIds": [
      "source.nist.fisher-exact.2026",
      "source.nist.chi-square.2026",
      "source.nist.mcnemar.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s26.application",
    "statement": "For the constructed independent 2x2 table, expected events under independence equal row total times event-column total divided by grand total: 10 x 1 / 20 = 0.5 in each group; Fisher exact testing avoids the unreliable sparse-cell Pearson approximation.",
    "basisClaimIds": [
      "claim.gs028se.statistics.fisher-exact",
      "claim.gs028se.statistics.chi-square",
      "claim.gs028se.statistics.chi-square.mcnemar-boundary"
    ],
    "sourceIds": [
      "source.nist.fisher-exact.2026",
      "source.nist.chi-square.2026",
      "source.nist.mcnemar.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s27.application",
    "statement": "For the constructed independent 2x2 table, expected events under independence equal row total times event-column total divided by grand total: 10 x 2 / 20 = 1 in each group; Fisher exact testing avoids the unreliable sparse-cell Pearson approximation.",
    "basisClaimIds": [
      "claim.gs028se.statistics.fisher-exact",
      "claim.gs028se.statistics.chi-square",
      "claim.gs028se.statistics.chi-square.mcnemar-boundary"
    ],
    "sourceIds": [
      "source.nist.fisher-exact.2026",
      "source.nist.chi-square.2026",
      "source.nist.mcnemar.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s28.application",
    "statement": "For the constructed independent 2x2 table, expected events under independence equal row total times event-column total divided by grand total: 12 x 1 / 24 = 0.5 in each group; Fisher exact testing avoids the unreliable sparse-cell Pearson approximation.",
    "basisClaimIds": [
      "claim.gs028se.statistics.fisher-exact",
      "claim.gs028se.statistics.chi-square",
      "claim.gs028se.statistics.chi-square.mcnemar-boundary"
    ],
    "sourceIds": [
      "source.nist.fisher-exact.2026",
      "source.nist.chi-square.2026",
      "source.nist.mcnemar.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s30.application",
    "statement": "Selecting consecutive historical surgical charts regardless of infection, then comparing recorded infections by earlier preoperative smoking, is a retrospective cohort design rather than outcome-selected case-control sampling.",
    "basisClaimIds": [
      "claim.gs028se.statistics.study-design"
    ],
    "sourceIds": [
      "source.cdc.field-epi-study-design.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s48.application",
    "statement": "The constructed risk ratio A/B = 0.5 means 50% lower risk in A; 50% higher corresponds to 1.5 and unchanged risk to 1.",
    "basisClaimIds": [
      "claim.gs028se.statistics.risk-ratio-odds-ratio",
      "claim.qq20261028.statistics.odds-scale",
      "claim.gs028se.statistics.arr-nnt"
    ],
    "sourceIds": [
      "source.cdc.field-epi-study-design.2026",
      "source.cdc.field-epi-analysis.2026",
      "source.cochrane.chapter-15.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s49.application",
    "statement": "For constructed 30-day risks 20% versus 10%, ARR is 0.10 and NNT is 10; reciprocal control risk gives 5 and does not answer NNT.",
    "basisClaimIds": [
      "claim.gs028se.statistics.arr-nnt"
    ],
    "sourceIds": [
      "source.cochrane.chapter-15.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s50.application",
    "statement": "For the constructed 30-day risks 15% versus 10%, absolute reduction is 5 percentage points; the two individual rates are not the difference.",
    "basisClaimIds": [
      "claim.gs028se.statistics.arr-nnt"
    ],
    "sourceIds": [
      "source.cochrane.chapter-15.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s51.application",
    "statement": "For constructed 30-day risks 12% versus 8%, ARR is 0.04 and NNT is 25; neither the raw 4-point reduction nor the rounded relative reduction is a patient count.",
    "basisClaimIds": [
      "claim.gs028se.statistics.arr-nnt"
    ],
    "sourceIds": [
      "source.cochrane.chapter-15.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s52.application",
    "statement": "For constructed 30-day risks 30% versus 25%, ARR is 0.05 and NNT is 20; the raw 5-point reduction and treatment percentage are not the reciprocal absolute reduction.",
    "basisClaimIds": [
      "claim.gs028se.statistics.arr-nnt"
    ],
    "sourceIds": [
      "source.cochrane.chapter-15.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s54.application",
    "statement": "In the constructed reduction interval of 1 to 3 days, the single target threshold of 2 days lies inside because 1 < 2 < 3; reductions both below and above that threshold remain within the interval.",
    "basisClaimIds": [
      "claim.qq20261102b.specified-interval-decision-rule",
      "claim.gs028se.statistics.confidence-interval"
    ],
    "sourceIds": [
      "source.qq20261102b.nist-p",
      "source.qq20261102b.nist-ci",
      "source.nist.confidence-intervals.2026",
      "source.nist.confidence-limits-mean.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s55.application",
    "statement": "For the constructed test with p = 0.20 and prespecified significance level 0.05, the tested null is not rejected; the result does not establish equivalence.",
    "basisClaimIds": [
      "claim.gs028se.statistics.p-value",
      "claim.gs028se.statistics.errors-power",
      "claim.qq20261102b.specified-interval-decision-rule"
    ],
    "sourceIds": [
      "source.nist.p-values.2026",
      "source.nist.errors-power.2026",
      "source.qq20261102b.nist-p",
      "source.qq20261102b.nist-ci"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.s59.application",
    "statement": "The constructed two-sided 95% interval -2 to +1 days contains the zero mean-difference null, so the matching 5% test does not find a difference; a negative lower endpoint alone does not establish a decrease.",
    "basisClaimIds": [
      "claim.gs028se.statistics.confidence-interval",
      "claim.gs028se.statistics.p-value",
      "claim.gs028se.statistics.errors-power",
      "claim.qq20261102b.specified-interval-decision-rule"
    ],
    "sourceIds": [
      "source.nist.confidence-intervals.2026",
      "source.nist.confidence-limits-mean.2026",
      "source.nist.p-values.2026",
      "source.nist.errors-power.2026",
      "source.qq20261102b.nist-p",
      "source.qq20261102b.nist-ci"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-08.stats1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.stats1.20261108.r2.expected-cell",
    "statement": "In a contingency table under independence, an expected cell count is its row total times its column total divided by the grand total.",
    "basisClaimIds": [
      "claim.gs028se.statistics.chi-square"
    ],
    "sourceIds": [
      "source.nist.chi-square.2026"
    ],
    "evidenceCategory": "definition",
    "certainty": "moderate",
    "limitation": "Offline mathematical/statistical application of recorded method facts. All data are constructed, not empirical clinical performance, treatment effects or cutoffs. Method selection and wording remain needs_clinician_review.",
    "applicablePopulation": "Only the labelled constructed statistics exercises and explicitly stated assumptions.",
    "lastCheckedOn": "2026-11-08",
    "verificationScope": "Original calculations and synthesis of previously recorded statistical-method facts; not a new source retrieval or source-currentness check."
  }
];
