import type { QuestionQualityRevision } from "./question-quality-pilot-20261028";

/** DRAFTS awaiting independent re-review. Key shown first for review only; runtime choices randomize. */
export const QUESTION_QUALITY_ADVERSARIAL_DEFINITIONS: QuestionQualityRevision[] = [
  {
    "id": "revision.qq20261102a.a02",
    "auditId": "A02",
    "caseId": "case.gs028c.acute-cholecystitis.a-stones-without-secondary-signs",
    "nodeId": "node.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.1",
    "previousQuestionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r5",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r6",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which investigation should be arranged next for {patientName}'s suspected acute cholecystitis?",
    "previousChoiceLabels": [
      "Hepatobiliary scintigraphy",
      "Contrast-enhanced abdominal CT",
      "Biliary magnetic resonance imaging"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Integrate persistent focal inflammatory findings with ultrasound components rather than treating a normal wall as exclusion. Then Distinguish gallbladder filling, stimulated emptying and extrahepatic-duct protocols.",
    "reviewerNotes": "Melissa must confirm the exact protocol ranking. This does not claim a universal HIDA-over-all-CT/MRI algorithm; the former broad competing modalities have been replaced.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_2": "correct_2",
      "choice.qq20261102a.a02.d1": "d2_2",
      "choice.qq20261102a.a02.d2": "d3_2"
    },
    "choiceServiceOverrides": {
      "correct_2": null,
      "choice.qq20261102a.a02.d1": null,
      "choice.qq20261102a.a02.d2": null
    },
    "choiceTimingOverrides": {
      "correct_2": {
        "kind": "test",
        "timingProfileId": "timing.test.nuclear_imaging"
      },
      "choice.qq20261102a.a02.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.nuclear_imaging"
      },
      "choice.qq20261102a.a02.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r5",
      "whatChanged": "Narrow the competition to specified protocols; add the requested clinical/duct observations and a competing chronic-emptying interpretation without naming the deciding mechanism in the task. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#A02",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Require: Integrate persistent focal inflammatory findings with ultrasound components rather than treating a normal wall as exclusion. Then Distinguish gallbladder filling, stimulated emptying and extrahepatic-duct protocols. The closest error is: Stimulated ejection-fraction scintigraphy is a real resident error when gallstones coexist with a nondiagnostic structural examination.",
          "fairness 2: The acute local findings and lack of a duct-obstruction pattern favor a gallbladder-filling protocol over an emptying study or duct-focused MRCP. Review boundary: Melissa must confirm the exact protocol ranking. This does not claim a universal HIDA-over-all-CT/MRI algorithm; the former broad competing modalities have been replaced.",
          "fairness 3: The acute local findings and lack of a duct-obstruction pattern favor a gallbladder-filling protocol over an emptying study or duct-focused MRCP. Review boundary: Melissa must confirm the exact protocol ranking. This does not claim a universal HIDA-over-all-CT/MRI algorithm; the former broad competing modalities have been replaced."
        ],
        "suggestions": [
          "suggestions 1: The acute local findings and lack of a duct-obstruction pattern favor a gallbladder-filling protocol over an emptying study or duct-focused MRCP. Review boundary: Melissa must confirm the exact protocol ranking. This does not claim a universal HIDA-over-all-CT/MRI algorithm; the former broad competing modalities have been replaced.",
          "suggestions 2: The acute local findings and lack of a duct-obstruction pattern favor a gallbladder-filling protocol over an emptying study or duct-focused MRCP. Review boundary: Melissa must confirm the exact protocol ranking. This does not claim a universal HIDA-over-all-CT/MRI algorithm; the former broad competing modalities have been replaced.",
          "suggestions 3: All labels are concrete examination protocols, with comparable purpose-level detail. No lead-in announces cystic-duct obstruction or a gold-standard property. Narrow the competition to specified protocols; add the requested clinical/duct observations and a competing chronic-emptying interpretation without naming the deciding mechanism in the task. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting."
        ]
      },
      "selfCheck": {
        "cueAttack": "All labels are concrete examination protocols, with comparable purpose-level detail. No lead-in announces cystic-duct obstruction or a gold-standard property.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Integrate persistent focal inflammatory findings with ultrasound components rather than treating a normal wall as exclusion.",
          "Distinguish gallbladder filling, stimulated emptying and extrahepatic-duct protocols."
        ],
        "oneBestAnswer": "The acute local findings and lack of a duct-obstruction pattern favor a gallbladder-filling protocol over an emptying study or duct-focused MRCP.",
        "closestDistractor": "Stimulated ejection-fraction scintigraphy is a real resident error when gallstones coexist with a nondiagnostic structural examination.",
        "remainingReview": "Melissa must confirm the exact protocol ranking. This does not claim a universal HIDA-over-all-CT/MRI algorithm; the former broad competing modalities have been replaced."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r6",
      "conceptId": "concept.cholecystitis.hida-after-equivocal-ultrasound",
      "stem": "Which examination protocol should be ordered next for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Hepatobiliary scintigraphy assessing gallbladder filling",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Persistent local inflammatory findings call for assessment of gallbladder filling/cystic-duct obstruction despite the ultrasound components."
        },
        {
          "id": "choice.qq20261102a.a02.d1",
          "label": "Hepatobiliary scintigraphy measuring stimulated ejection fraction",
          "isCorrect": false,
          "distractorRationale": "Confuses evaluation of chronic gallbladder emptying with evaluation of the acute inflammatory presentation."
        },
        {
          "id": "choice.qq20261102a.a02.d2",
          "label": "MR cholangiopancreatography assessing the extrahepatic ducts",
          "isCorrect": false,
          "distractorRationale": "Prioritizes a duct-stone question over the gallbladder question suggested by persistent local signs; it is not a claim that MRI is never appropriate after ultrasound."
        }
      ],
      "explanation": "The clinical findings maintain concern for acute gallbladder inflammation. A filling study addresses cystic-duct obstruction; a stimulated ejection-fraction study addresses a different physiologic question. MRCP is a duct-focused protocol, not a universal substitute for either. Interpret any scan with preparation and technical limitations in mind.",
      "teachingPoint": "The clinical findings maintain concern for acute gallbladder inflammation. A filling study addresses cystic-duct obstruction; a stimulated ejection-fraction study addresses a different physiologic question. MRCP is a duct-focused protocol, not a universal substitute for either. Interpret any scan with preparation and technical limitations in mind.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.cholecystitis.hida-after-equivocal-us",
        "claim.qq20261028.cholecystitis.comparative-imaging",
        "claim.qq20261102.ultrasound-component-limits",
        "claim.qq20261102a.gallbladder-filling-versus-emptying"
      ]
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with right-upper-quadrant pain that persists between meals, nausea and a neutrophil count above the laboratory reference range. Deep inspiration stops when the right upper quadrant is palpated. Ultrasound shows gallstones, a wall that is not thickened and no pericholecystic fluid. The common duct is not dilated; bilirubin is within the laboratory reference range.",
    "previousPresentation": "{patientName}, a 37-year-old woman, visits the clinic with sustained right-upper-quadrant pain, nausea and a neutrophil count above the laboratory reference range. Ultrasound shows gallstones. The gallbladder wall is not thickened, and no pericholecystic fluid is seen.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.female.37",
        "presentation": "{patientName}, a 37-year-old woman, visits the clinic with sustained right-upper-quadrant pain, nausea and a neutrophil count above the laboratory reference range. Ultrasound shows gallstones. The gallbladder wall is not thickened, and no pericholecystic fluid is seen."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.male.37",
        "presentation": "{patientName}, a 37-year-old man, visits the clinic with sustained right-upper-quadrant pain, nausea and a neutrophil count above the laboratory reference range. Ultrasound shows gallstones. The gallbladder wall is not thickened, and no pericholecystic fluid is seen."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.female.64",
        "presentation": "{patientName}, a 64-year-old woman, visits the clinic with sustained right-upper-quadrant pain, nausea and a neutrophil count above the laboratory reference range. Ultrasound shows gallstones. The gallbladder wall is not thickened, and no pericholecystic fluid is seen."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.male.64",
        "presentation": "{patientName}, a 64-year-old man, visits the clinic with sustained right-upper-quadrant pain, nausea and a neutrophil count above the laboratory reference range. Ultrasound shows gallstones. The gallbladder wall is not thickened, and no pericholecystic fluid is seen."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 37,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "chiefComplaint": "Right upper quadrant pain",
    "previousChiefComplaint": "Gallbladder pain",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.female.37"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.male.37"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.female.64"
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.male.64"
      }
    ]
  },
  {
    "id": "revision.qq20261102a.a06",
    "auditId": "A06",
    "caseId": "case.gs028b.nipple-discharge.paired-bloody-single-duct",
    "nodeId": "node.gs028b.nipple-discharge.paired-bloody-single-duct.1",
    "previousQuestionVariantId": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r4",
    "questionVariantId": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r5",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "How should {patientName}'s left-sided staining between visits be interpreted?",
    "previousChoiceLabels": [
      "Pathologic nipple discharge",
      "Physiologic nipple discharge",
      "Galactorrhea"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Separate the focal between-visit episodes from secretion produced at several bilateral openings. Then Prioritize the focal breast assessment while also addressing a verified medication-related secretory explanation.",
    "reviewerNotes": "Melissa must confirm the mixed-pattern scenario and priority wording. This is recognition-driven triage, not a claim to have diagnosed the focal lesion.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qq20261102a.a06.d1": "d1_1",
      "choice.qq20261102a.a06.d2": "d2_1"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qq20261102a.a06.d1": null,
      "choice.qq20261102a.a06.d2": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r4",
      "whatChanged": "Add a genuine competing medication/laboratory explanation, require the learner to integrate both patterns, and replace mixed classification labels with parallel evaluation plans. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#A06",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The task no longer selects the concerning component for the learner, and all options are parallel two-part evaluation plans. Galactorrhea is no longer a taxonomic outlier.",
          "cues 2: The task no longer selects the concerning component for the learner, and all options are parallel two-part evaluation plans. Galactorrhea is no longer a taxonomic outlier."
        ],
        "fairness": [
          "fairness 1: The medication/prolactin findings do not account adequately for a spontaneous focal duct component; breast assessment and medication review can proceed together. Review boundary: Melissa must confirm the mixed-pattern scenario and priority wording. This is recognition-driven triage, not a claim to have diagnosed the focal lesion.",
          "fairness 2: Require: Separate the focal between-visit episodes from secretion produced at several bilateral openings. Then Prioritize the focal breast assessment while also addressing a verified medication-related secretory explanation. The closest error is: Attributing both findings to a plausible medication-associated prolactin rise is the intended anchoring error.",
          "fairness 3: The medication/prolactin findings do not account adequately for a spontaneous focal duct component; breast assessment and medication review can proceed together. Review boundary: Melissa must confirm the mixed-pattern scenario and priority wording. This is recognition-driven triage, not a claim to have diagnosed the focal lesion."
        ],
        "suggestions": [
          "suggestions 1: Add a genuine competing medication/laboratory explanation, require the learner to integrate both patterns, and replace mixed classification labels with parallel evaluation plans. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "suggestions 2: Require: Separate the focal between-visit episodes from secretion produced at several bilateral openings. Then Prioritize the focal breast assessment while also addressing a verified medication-related secretory explanation. The closest error is: Attributing both findings to a plausible medication-associated prolactin rise is the intended anchoring error."
        ]
      },
      "selfCheck": {
        "cueAttack": "The task no longer selects the concerning component for the learner, and all options are parallel two-part evaluation plans. Galactorrhea is no longer a taxonomic outlier.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Separate the focal between-visit episodes from secretion produced at several bilateral openings.",
          "Prioritize the focal breast assessment while also addressing a verified medication-related secretory explanation."
        ],
        "oneBestAnswer": "The medication/prolactin findings do not account adequately for a spontaneous focal duct component; breast assessment and medication review can proceed together.",
        "closestDistractor": "Attributing both findings to a plausible medication-associated prolactin rise is the intended anchoring error.",
        "remainingReview": "Melissa must confirm the mixed-pattern scenario and priority wording. This is recognition-driven triage, not a claim to have diagnosed the focal lesion."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r5",
      "conceptId": "concept.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition",
      "stem": "Which evaluation plan should guide {patientName}'s next visit?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Breast assessment and medication review",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Recognizes a focal concerning component alongside a plausible systemic explanation for the expressed bilateral secretion; an elevated prolactin does not explain away the focal episodes."
        },
        {
          "id": "choice.qq20261102a.a06.d1",
          "label": "Medication review and symptom reassessment",
          "isCorrect": false,
          "distractorRationale": "Over-unifies the observed patterns under a real prolactin-raising medicine and postpones assessment of the focal component."
        },
        {
          "id": "choice.qq20261102a.a06.d2",
          "label": "Endocrine assessment and medication review",
          "isCorrect": false,
          "distractorRationale": "Overweights the laboratory abnormality and treats it as a sufficient explanation for all of the breast observations."
        }
      ],
      "explanation": "A medication-related prolactin rise can account for bilateral secretion, while spontaneous unilateral duct discharge still warrants breast-local assessment. The two patterns can coexist; do not assume one systemic finding explains both.",
      "teachingPoint": "A medication-related prolactin rise can account for bilateral secretion, while spontaneous unilateral duct discharge still warrants breast-local assessment. The two patterns can coexist; do not assume one systemic finding explains both.",
      "supportingEvidenceClaimIds": [
        "claim.discharge.pathologic-pattern",
        "claim.qq20261029.discharge.mixed-pattern",
        "claim.qq20261029.discharge.endocrine-alternative",
        "claim.qq20261102.galactorrhea-pattern",
        "claim.qq20261102a.mixed-discharge-medication",
        "claim.qq20261102a.mixed-discharge-local-assessment"
      ]
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after noticing spots inside the left side of the bra between examinations. Compression in the clinic produces pale fluid from several openings on both nipples; a red-brown drop appears at one left nipple opening. Metoclopramide was started for nausea, and prolactin is above the laboratory reference range.",
    "previousPresentation": "{patientName}, a 42-year-old woman, visits the clinic after finding rust-coloured spots inside the left side of the bra between examinations. During the visit, compression produces pale fluid from several openings on each nipple; a reddish drop is also seen at one left-sided opening.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.nipple-discharge.paired-bloody-single-duct.female.42",
        "presentation": "{patientName}, a 42-year-old woman, visits the clinic after finding rust-coloured spots inside the left side of the bra between examinations. During the visit, compression produces pale fluid from several openings on each nipple; a reddish drop is also seen at one left-sided opening."
      },
      {
        "id": "profile.gs028b.nipple-discharge.paired-bloody-single-duct.female.58",
        "presentation": "{patientName}, a 58-year-old woman, visits the clinic after finding rust-coloured spots inside the left side of the bra between examinations. During the visit, compression produces pale fluid from several openings on each nipple; a reddish drop is also seen at one left-sided opening."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 42,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "chiefComplaint": "Nipple discharge",
    "previousChiefComplaint": "Bloody nipple discharge",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.nipple-discharge.paired-bloody-single-duct.female.42"
      },
      {
        "id": "profile.gs028b.nipple-discharge.paired-bloody-single-duct.female.58"
      }
    ]
  },
  {
    "id": "revision.qq20261102a.a06-context",
    "auditId": "A06-context",
    "caseId": "case.gs028b.nipple-discharge.paired-bloody-single-duct",
    "nodeId": "node.gs028b.nipple-discharge.paired-bloody-single-duct.2",
    "previousQuestionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r5",
    "questionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r6",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which evaluation plan is most appropriate for {patientName}'s nipple discharge?",
    "previousChoiceLabels": [
      "Diagnostic mammography and ultrasound",
      "Screening breast mammography",
      "Breast magnetic resonance imaging",
      "Interval clinical breast reassessment"
    ],
    "previousCurrentUpdate": "The left-sided staining has continued between visits.",
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Use the mixed history and age to identify a symptomatic breast-local workup. Then Select the initial pathway rather than moving directly to advanced problem-solving imaging.",
    "reviewerNotes": "The previous question scaffolds recognition; this follow-on measures modality/sequence selection rather than independent syndrome discovery.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qq20261102a.a06-context.d1": "d1_1",
      "choice.qq20261102a.a06-context.d2": "d2_1"
    },
    "choiceServiceOverrides": {
      "correct_1": "service.diagnostic_breast_imaging",
      "choice.qq20261102a.a06-context.d1": "service.breast_mri",
      "choice.qq20261102a.a06-context.d2": "service.breast_mri"
    },
    "choiceTimingOverrides": {
      "correct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_imaging_bundle"
      },
      "choice.qq20261102a.a06-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_mri"
      },
      "choice.qq20261102a.a06-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.breast_mri"
      }
    },
    "currentUpdate": "No breast imaging has yet been performed for these symptoms.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r5",
      "whatChanged": "Remove the redundant persistence update, establish initial-imaging stage, and compare three equally bundled imaging pathways.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#A06-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Every option combines two named imaging examinations. Screening/diagnostic superiority wording and a waiting filler are removed; each modality appears in two labels.",
          "cues 2: Every option combines two named imaging examinations. Screening/diagnostic superiority wording and a waiting filler are removed; each modality appears in two labels. Remove the redundant persistence update, establish initial-imaging stage, and compare three equally bundled imaging pathways."
        ],
        "fairness": [
          "fairness 1: The evaluation is explicitly initial, so the conventional mammography/targeted-ultrasound pathway precedes the offered MRI substitutions. Review boundary: The previous question scaffolds recognition; this follow-on measures modality/sequence selection rather than independent syndrome discovery.",
          "fairness 2: Require: Use the mixed history and age to identify a symptomatic breast-local workup. Then Select the initial pathway rather than moving directly to advanced problem-solving imaging. The closest error is: MRI-based workup is a credible cancer-anxiety/advanced-test error, not a wrong clinical category.",
          "fairness 3: The evaluation is explicitly initial, so the conventional mammography/targeted-ultrasound pathway precedes the offered MRI substitutions. Review boundary: The previous question scaffolds recognition; this follow-on measures modality/sequence selection rather than independent syndrome discovery."
        ],
        "suggestions": [
          "suggestions 1: The evaluation is explicitly initial, so the conventional mammography/targeted-ultrasound pathway precedes the offered MRI substitutions. Review boundary: The previous question scaffolds recognition; this follow-on measures modality/sequence selection rather than independent syndrome discovery.",
          "suggestions 2: Remove the redundant persistence update, establish initial-imaging stage, and compare three equally bundled imaging pathways.",
          "suggestions 3: Every option combines two named imaging examinations. Screening/diagnostic superiority wording and a waiting filler are removed; each modality appears in two labels. Remove the redundant persistence update, establish initial-imaging stage, and compare three equally bundled imaging pathways."
        ]
      },
      "selfCheck": {
        "cueAttack": "Every option combines two named imaging examinations. Screening/diagnostic superiority wording and a waiting filler are removed; each modality appears in two labels.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Use the mixed history and age to identify a symptomatic breast-local workup.",
          "Select the initial pathway rather than moving directly to advanced problem-solving imaging."
        ],
        "oneBestAnswer": "The evaluation is explicitly initial, so the conventional mammography/targeted-ultrasound pathway precedes the offered MRI substitutions.",
        "closestDistractor": "MRI-based workup is a credible cancer-anxiety/advanced-test error, not a wrong clinical category.",
        "remainingReview": "The previous question scaffolds recognition; this follow-on measures modality/sequence selection rather than independent syndrome discovery."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r6",
      "conceptId": "concept.pathologic-nipple-discharge.diagnostic-imaging",
      "stem": "Which initial imaging pathway should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Mammography and targeted ultrasound",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Matches initial symptomatic breast assessment at this adult age after interpretation of the focal discharge component."
        },
        {
          "id": "choice.qq20261102a.a06-context.d1",
          "label": "Contrast-enhanced MRI and targeted ultrasound",
          "isCorrect": false,
          "distractorRationale": "Moves an advanced problem-solving modality into the initial pathway without a preceding conventional assessment."
        },
        {
          "id": "choice.qq20261102a.a06-context.d2",
          "label": "Mammography and contrast-enhanced MRI",
          "isCorrect": false,
          "distractorRationale": "Substitutes an advanced examination for the targeted ultrasound component of the initial workup."
        }
      ],
      "explanation": "The focal discharge history requires a symptomatic imaging pathway. The initial combination at this age is mammography with targeted ultrasound; MRI can have a subsequent problem-solving role.",
      "supportingEvidenceClaimIds": [
        "claim.discharge.imaging",
        "claim.qq20261102a.initial-breast-pathway",
        "claim.qq20261102a.mixed-discharge-local-assessment"
      ],
      "teachingPoint": "The focal discharge history requires a symptomatic imaging pathway. The initial combination at this age is mammography with targeted ultrasound; MRI can have a subsequent problem-solving role."
    }
  },
  {
    "id": "revision.qq20261102a.a25",
    "auditId": "A25",
    "caseId": "case.gs028g.hiv-perioperative.paired-routine-elective",
    "nodeId": "node.gs028g.hiv-perioperative.paired-routine-elective.1",
    "previousQuestionVariantId": "question.gs028g.hiv-perioperative.art-continuity.v1.r5",
    "questionVariantId": "question.gs028g.hiv-perioperative.art-continuity.v1.r6",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which perioperative antiretroviral plan should be sent to {patientName}'s surgical team?",
    "previousChoiceLabels": [
      "Continue the complete prescribed regimen",
      "Interrupt the complete prescribed regimen",
      "Withhold ritonavir and maintain the other agents"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Identify the booster-containing regimen and preserve coordinated ART continuity. Then Apply the route-specific midazolam interaction instead of treating all administration routes alike.",
    "reviewerNotes": "The anesthetist and Melissa must verify individual administration; this is not a universal dose order or a proposed ART initiation regimen.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qq20261102a.a25.d1": "d1_1",
      "choice.qq20261102a.a25.d2": "d3_1",
      "choice.qq20261102a.a25.d3": "d1_1"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qq20261102a.a25.d1": null,
      "choice.qq20261102a.a25.d2": null,
      "choice.qq20261102a.a25.d3": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gs028g.hiv-perioperative.art-continuity.v1.r5",
      "whatChanged": "Make the named ART components consequential by adding a verified oral-sedative proposal and compare balanced, concrete continuity/route plans.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#A25",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Only continuation with appropriately monitored parenteral planning satisfies both established medication principles in the supplied setting.",
          "fairness 2: Require: Identify the booster-containing regimen and preserve coordinated ART continuity. Then Apply the route-specific midazolam interaction instead of treating all administration routes alike. The closest error is: Continuing ART while giving oral midazolam under observation is a realistic route-versus-monitoring misconception.",
          "fairness 3: Only continuation with appropriately monitored parenteral planning satisfies both established medication principles in the supplied setting. Review boundary: The anesthetist and Melissa must verify individual administration; this is not a universal dose order or a proposed ART initiation regimen."
        ],
        "suggestions": [
          "suggestions 1: Make the named ART components consequential by adding a verified oral-sedative proposal and compare balanced, concrete continuity/route plans.",
          "suggestions 2: Require: Identify the booster-containing regimen and preserve coordinated ART continuity. Then Apply the route-specific midazolam interaction instead of treating all administration routes alike. The closest error is: Continuing ART while giving oral midazolam under observation is a realistic route-versus-monitoring misconception."
        ]
      },
      "selfCheck": {
        "cueAttack": "Four balanced combinations make each continuity/route component occur equally often. The key is a concrete plan, not the sole flexible 'revise sedation' answer.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Identify the booster-containing regimen and preserve coordinated ART continuity.",
          "Apply the route-specific midazolam interaction instead of treating all administration routes alike."
        ],
        "oneBestAnswer": "Only continuation with appropriately monitored parenteral planning satisfies both established medication principles in the supplied setting.",
        "closestDistractor": "Continuing ART while giving oral midazolam under observation is a realistic route-versus-monitoring misconception.",
        "remainingReview": "The anesthetist and Melissa must verify individual administration; this is not a universal dose order or a proposed ART initiation regimen."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.hiv-perioperative.art-continuity.v1.r6",
      "conceptId": "concept.gs028g.hiv-perioperative.art-continuity",
      "stem": "Which combined medication plan should be agreed with {patientName}'s surgical team?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Continue ART; plan titrated intravenous midazolam with respiratory monitoring",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Preserves ART continuity and uses the route for which monitored, individualized midazolam administration can be considered with a boosted regimen."
        },
        {
          "id": "choice.qq20261102a.a25.d1",
          "label": "Continue ART; plan oral midazolam with respiratory monitoring",
          "isCorrect": false,
          "distractorRationale": "Preserves continuity but treats monitoring as sufficient to make the contraindicated oral combination acceptable."
        },
        {
          "id": "choice.qq20261102a.a25.d2",
          "label": "Interrupt ART; plan titrated intravenous midazolam with respiratory monitoring",
          "isCorrect": false,
          "distractorRationale": "Changes a complete regimen unnecessarily instead of coordinating the interacting procedural medicine."
        },
        {
          "id": "choice.qq20261102a.a25.d3",
          "label": "Interrupt ART; plan oral midazolam with respiratory monitoring",
          "isCorrect": false,
          "distractorRationale": "Both interrupts treatment and assumes an unspecified interruption makes the oral interaction acceptable."
        }
      ],
      "explanation": "Coordinate ART continuity and procedural medicines with the HIV/anesthesia teams. Oral midazolam should not be coadministered with a boosted protease-inhibitor regimen; parenteral use needs appropriate monitoring, individualized titration and consideration of dose reduction. No interruption or washout interval is assumed here.",
      "teachingPoint": "Coordinate ART continuity and procedural medicines with the HIV/anesthesia teams. Oral midazolam should not be coadministered with a boosted protease-inhibitor regimen; parenteral use needs appropriate monitoring, individualized titration and consideration of dose reduction. No interruption or washout interval is assumed here.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.hiv-perioperative.art-continuity",
        "claim.gs028g.hiv-perioperative.art-continuity.fact2",
        "claim.gs028g.hiv-perioperative.art-continuity.fact3",
        "claim.gs028g.hiv-perioperative.art-continuity.fact4",
        "claim.qq20261102.named-art-regimen",
        "claim.qq20261102a.boosted-midazolam-routes",
        "claim.qq20261102a.boosted-parenteral-titration",
        "claim.qq20261102a.art-continuity"
      ]
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic before elective hernia repair. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine. Oral midazolam is proposed as premedication; the anesthesia service can administer and monitor intravenous sedation.",
    "previousPresentation": "{patientName}, a 43-year-old woman, visits the clinic before elective hernia repair at an outside surgical service. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028g.hiv-perioperative.paired-routine-elective.female.43",
        "presentation": "{patientName}, a 43-year-old woman, visits the clinic before elective hernia repair at an outside surgical service. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine."
      },
      {
        "id": "profile.gs028g.hiv-perioperative.paired-routine-elective.male.43",
        "presentation": "{patientName}, a 43-year-old man, visits the clinic before elective hernia repair at an outside surgical service. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine."
      },
      {
        "id": "profile.gs028g.hiv-perioperative.paired-routine-elective.female.68",
        "presentation": "{patientName}, a 68-year-old woman, visits the clinic before elective hernia repair at an outside surgical service. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine."
      },
      {
        "id": "profile.gs028g.hiv-perioperative.paired-routine-elective.male.68",
        "presentation": "{patientName}, a 68-year-old man, visits the clinic before elective hernia repair at an outside surgical service. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": null,
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.a25-context",
    "auditId": "A25-context",
    "caseId": "case.gs028g.hiv-perioperative.paired-routine-elective",
    "nodeId": "node.gs028g.hiv-perioperative.paired-routine-elective.2",
    "previousQuestionVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r5",
    "questionVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r6",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which plan is most appropriate for {patientName}'s proposed oral midazolam?",
    "previousChoiceLabels": [
      "Revise the planned sedation",
      "Retain the planned sedation",
      "Increase the midazolam dose",
      "Withhold the antiretroviral regimen"
    ],
    "previousCurrentUpdate": "The outside surgical service proposes oral midazolam for sedation.",
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Recognize that choosing a parenteral route does not remove the boosted-regimen exposure interaction. Then Apply the repeated-dose context to individualized titration and recovery planning.",
    "reviewerNotes": "The preceding task scaffolds the route issue; this is a linked dosing/coordination decision, not an independent difficulty measurement. Melissa/anesthesia review remains necessary.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "correct_1": "correct_1",
      "choice.qq20261102a.a25-context.d1": "d1_1",
      "choice.qq20261102a.a25-context.d2": "d2_1"
    },
    "choiceServiceOverrides": {
      "correct_1": null,
      "choice.qq20261102a.a25-context.d1": null,
      "choice.qq20261102a.a25-context.d2": null
    },
    "currentUpdate": "The anesthetist anticipates more than one intravenous midazolam dose during {patientName}'s procedure. The medication list is unchanged.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r5",
      "whatChanged": "Replace generic revision and dose-escalation answers with comparably concrete repeat-dose/ART-coordination plans; retain actual route and regimen.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#A25-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: All choices provide monitoring and a concrete dosing/ART plan; unexplained escalation and the vague 'revise sedation' label are removed.",
          "cues 2: The repeated-dose circumstance specifically supports considering reduction/titration while maintaining coordinated ART, without asserting a fixed dose. Review boundary: The preceding task scaffolds the route issue; this is a linked dosing/coordination decision, not an independent difficulty measurement. Melissa/anesthesia review remains necessary."
        ],
        "fairness": [
          "fairness 1: Require: Recognize that choosing a parenteral route does not remove the boosted-regimen exposure interaction. Then Apply the repeated-dose context to individualized titration and recovery planning. The closest error is: Assuming intravenous use permits the usual repeat-dose approach is the intended residual error after route selection.",
          "fairness 2: The repeated-dose circumstance specifically supports considering reduction/titration while maintaining coordinated ART, without asserting a fixed dose. Review boundary: The preceding task scaffolds the route issue; this is a linked dosing/coordination decision, not an independent difficulty measurement. Melissa/anesthesia review remains necessary.",
          "fairness 3: The repeated-dose circumstance specifically supports considering reduction/titration while maintaining coordinated ART, without asserting a fixed dose."
        ],
        "suggestions": [
          "suggestions 1: The repeated-dose circumstance specifically supports considering reduction/titration while maintaining coordinated ART, without asserting a fixed dose. Review boundary: The preceding task scaffolds the route issue; this is a linked dosing/coordination decision, not an independent difficulty measurement. Melissa/anesthesia review remains necessary.",
          "suggestions 2: All choices provide monitoring and a concrete dosing/ART plan; unexplained escalation and the vague 'revise sedation' label are removed. Replace generic revision and dose-escalation answers with comparably concrete repeat-dose/ART-coordination plans; retain actual route and regimen.",
          "suggestions 3: Replace generic revision and dose-escalation answers with comparably concrete repeat-dose/ART-coordination plans; retain actual route and regimen."
        ]
      },
      "selfCheck": {
        "cueAttack": "All choices provide monitoring and a concrete dosing/ART plan; unexplained escalation and the vague 'revise sedation' label are removed.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that choosing a parenteral route does not remove the boosted-regimen exposure interaction.",
          "Apply the repeated-dose context to individualized titration and recovery planning."
        ],
        "oneBestAnswer": "The repeated-dose circumstance specifically supports considering reduction/titration while maintaining coordinated ART, without asserting a fixed dose.",
        "closestDistractor": "Assuming intravenous use permits the usual repeat-dose approach is the intended residual error after route selection.",
        "remainingReview": "The preceding task scaffolds the route issue; this is a linked dosing/coordination decision, not an independent difficulty measurement. Melissa/anesthesia review remains necessary."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r6",
      "conceptId": "concept.gs028g.hiv-perioperative.booster-midazolam-interaction",
      "stem": "Which instruction best fits {patientName}'s sedation plan?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Consider smaller midazolam increments with monitored titration",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Applies the boosted-regimen interaction to repeat parenteral dosing, retaining appropriate medical monitoring rather than forbidding all midazolam use."
        },
        {
          "id": "choice.qq20261102a.a25-context.d1",
          "label": "Consider standard midazolam increments with monitored titration",
          "isCorrect": false,
          "distractorRationale": "Fails to account for the expected increase in exposure when planning repeated doses."
        },
        {
          "id": "choice.qq20261102a.a25-context.d2",
          "label": "Consider omitting ritonavir; use standard increments with monitored titration",
          "isCorrect": false,
          "distractorRationale": "Assumes uncoordinated booster omission is an adequate interaction-management strategy without an established interruption plan."
        }
      ],
      "explanation": "Boosted protease-inhibitor treatment can increase midazolam exposure. Parenteral use can be considered with appropriate monitoring and medical management; dose reduction deserves particular consideration when more than one dose is planned. An unsupervised ART change is not a substitute for that coordination.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.hiv-perioperative.booster-midazolam-interaction",
        "claim.gs028g.hiv-perioperative.booster-midazolam-interaction.fact2",
        "claim.gs028g.hiv-perioperative.booster-midazolam-interaction.fact3",
        "claim.qq20261102.named-art-regimen",
        "claim.qq20261102a.boosted-midazolam-routes",
        "claim.qq20261102a.boosted-parenteral-titration",
        "claim.qq20261102a.art-continuity"
      ],
      "teachingPoint": "Boosted protease-inhibitor treatment can increase midazolam exposure. Parenteral use can be considered with appropriate monitoring and medical management; dose reduction deserves particular consideration when more than one dose is planned. An unsupervised ART change is not a substitute for that coordination."
    }
  },
  {
    "id": "revision.qq20261102a.b01",
    "auditId": "B01",
    "caseId": "case.achalasia.water-and-solids",
    "nodeId": "node.achalasia.water-and-solids.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v1.r2",
    "questionVariantId": "question.achalasia.manometric-recognition.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which motility diagnosis best accounts for {patientName}'s returned study?",
    "previousChoiceLabels": [
      "Achalasia",
      "Esophagogastric junction outflow obstruction",
      "Absent contractility"
    ],
    "previousCurrentUpdate": "During each test swallow, no contraction travels down the distal esophagus. The median integrated relaxation pressure is above the laboratory reference range.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Distinguish simultaneous whole-body pressurization from a propagated contraction. Then Integrate that interpretation with junction relaxation to classify the motility disorder.",
    "reviewerNotes": "Melissa must confirm protocol adequacy, the interpretation of the synthetic trace and laboratory references. No unverified device-specific IRP cutoff or achalasia treatment rule is added.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_1": "achalasia_1",
      "choice.qq20261102a.b01.d1": "choice.qq20261102.b01.d1",
      "choice.qq20261102a.b01.d2": "choice.qq20261102.b01.d2"
    },
    "choiceServiceOverrides": {
      "achalasia_1": null,
      "choice.qq20261102a.b01.d1": null,
      "choice.qq20261102a.b01.d2": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.manometric-recognition.v1.r2",
      "whatChanged": "Replace the defining-pair summary with a distinct position/trace interpretation problem and closer classification errors; siblings no longer differ only by age or symptom paraphrase.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B01",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The key retains its conventional diagnostic name; names are not padded. Position dependence, pressurization/spasm or subthreshold events carry the inference rather than an interpreted 'absent peristalsis plus impaired relaxation' summary."
        ],
        "fairness": [
          "fairness 1: The raw pattern meets the achalasia classification rather than the distinct relaxation/peristalsis conditions of the offered neighbors.",
          "fairness 2: Require: Distinguish simultaneous whole-body pressurization from a propagated contraction. Then Integrate that interpretation with junction relaxation to classify the motility disorder. The closest error is: Misclassifying a pressure event as preserved peristalsis, or applying the wrong position-specific criterion, drives the closest competing answer.",
          "fairness 3: The raw pattern meets the achalasia classification rather than the distinct relaxation/peristalsis conditions of the offered neighbors. Review boundary: Melissa must confirm protocol adequacy, the interpretation of the synthetic trace and laboratory references. No unverified device-specific IRP cutoff or achalasia treatment rule is added."
        ],
        "suggestions": [
          "suggestions 1: Require: Distinguish simultaneous whole-body pressurization from a propagated contraction. Then Integrate that interpretation with junction relaxation to classify the motility disorder. The closest error is: Misclassifying a pressure event as preserved peristalsis, or applying the wrong position-specific criterion, drives the closest competing answer.",
          "suggestions 2: Replace the defining-pair summary with a distinct position/trace interpretation problem and closer classification errors; siblings no longer differ only by age or symptom paraphrase.",
          "suggestions 3: Replace the defining-pair summary with a distinct position/trace interpretation problem and closer classification errors; siblings no longer differ only by age or symptom paraphrase."
        ]
      },
      "selfCheck": {
        "cueAttack": "The key retains its conventional diagnostic name; names are not padded. Position dependence, pressurization/spasm or subthreshold events carry the inference rather than an interpreted 'absent peristalsis plus impaired relaxation' summary.",
        "difficulty": "hard",
        "reasoningSteps": [
          "Distinguish simultaneous whole-body pressurization from a propagated contraction.",
          "Integrate that interpretation with junction relaxation to classify the motility disorder."
        ],
        "oneBestAnswer": "The raw pattern meets the achalasia classification rather than the distinct relaxation/peristalsis conditions of the offered neighbors.",
        "closestDistractor": "Misclassifying a pressure event as preserved peristalsis, or applying the wrong position-specific criterion, drives the closest competing answer.",
        "remainingReview": "Melissa must confirm protocol adequacy, the interpretation of the synthetic trace and laboratory references. No unverified device-specific IRP cutoff or achalasia treatment rule is added."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.manometric-recognition.v1.r3",
      "conceptId": "concept.achalasia.manometric-recognition",
      "stem": "Which motility diagnosis best accounts for {patientName}'s combined study findings?",
      "answerChoices": [
        {
          "id": "achalasia_1",
          "label": "Achalasia",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the body-pressure/contraction distinction with the appropriate junction-relaxation criterion; an apparent pressure event is not automatically normal peristalsis."
        },
        {
          "id": "choice.qq20261102a.b01.d1",
          "label": "Esophagogastric junction outflow obstruction",
          "isCorrect": false,
          "distractorRationale": "Represents a competing motility classification; check whether its relaxation and true-peristalsis requirements fit all of the reported observations."
        },
        {
          "id": "choice.qq20261102a.b01.d2",
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
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic because food and drinks stick and food returns after meals. A contrast swallow retains a barium column above the junction; endoscopy shows no fixed narrowing or intraluminal mass.",
    "previousPresentation": "{patientName}, a 42-year-old woman, visits the clinic because food and drinks both seem to stick, with passive return of food after meals. Endoscopy shows no fixed narrowing or intraluminal mass.",
    "previousProfilePresentations": [
      {
        "id": "profile.achalasia.water-and-solids.female.42",
        "presentation": "{patientName}, a 42-year-old woman, visits the clinic because food and drinks both seem to stick, with passive return of food after meals. Endoscopy shows no fixed narrowing or intraluminal mass."
      },
      {
        "id": "profile.achalasia.water-and-solids.male.42",
        "presentation": "{patientName}, a 42-year-old man, visits the clinic because food and drinks both seem to stick, with passive return of food after meals. Endoscopy shows no fixed narrowing or intraluminal mass."
      },
      {
        "id": "profile.achalasia.water-and-solids.female.48",
        "presentation": "{patientName}, a 48-year-old woman, visits the clinic because food and drinks both seem to stick, with passive return of food after meals. Endoscopy shows no fixed narrowing or intraluminal mass."
      },
      {
        "id": "profile.achalasia.water-and-solids.male.48",
        "presentation": "{patientName}, a 48-year-old man, visits the clinic because food and drinks both seem to stick, with passive return of food after meals. Endoscopy shows no fixed narrowing or intraluminal mass."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.achalasia.water-and-solids",
        "patientPresentationVariantId": "presentation.achalasia.water-and-solids",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Difficulty swallowing",
        "revisedPresentation": "{patientName}, a 42-year-old woman, visits the clinic because food and drinks both seem to stick, with passive return of food after meals. Endoscopy shows no fixed narrowing or intraluminal mass.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.achalasia.water-and-solids.female.42",
            "approvedInstantiationProfileId": "profile.achalasia.water-and-solids.female.42",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 42-year-old woman, visits the clinic because food and drinks both seem to stick, with passive return of food after meals. Endoscopy shows no fixed narrowing or intraluminal mass.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.achalasia.water-and-solids.male.42",
            "approvedInstantiationProfileId": "profile.achalasia.water-and-solids.male.42",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 42-year-old man, visits the clinic because food and drinks both seem to stick, with passive return of food after meals. Endoscopy shows no fixed narrowing or intraluminal mass.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.achalasia.water-and-solids.female.48",
            "approvedInstantiationProfileId": "profile.achalasia.water-and-solids.female.48",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 48-year-old woman, visits the clinic because food and drinks both seem to stick, with passive return of food after meals. Endoscopy shows no fixed narrowing or intraluminal mass.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.achalasia.water-and-solids.male.48",
            "approvedInstantiationProfileId": "profile.achalasia.water-and-solids.male.48",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 48-year-old man, visits the clinic because food and drinks both seem to stick, with passive return of food after meals. Endoscopy shows no fixed narrowing or intraluminal mass.",
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
        "ageYears": 42,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b01-context",
    "auditId": "B01-context",
    "caseId": "case.achalasia.water-and-solids",
    "nodeId": "node.achalasia.water-and-solids.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v1.r2",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which investigation should {patientName} have next for persistent swallowing difficulty?",
    "previousChoiceLabels": [
      "High-resolution esophageal manometry",
      "Repeat upper-GI endoscopy",
      "Ambulatory esophageal reflux monitoring",
      "Contrast-enhanced chest CT"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation. Then Choose a motor-classification examination over complementary distensibility or reflux testing.",
    "reviewerNotes": "The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_1": "manometry_1",
      "choice.qq20261102a.b01-context.d1": "repeat_egd_1",
      "choice.qq20261102a.b01-context.d2": "ph_monitoring_1"
    },
    "choiceServiceOverrides": {
      "manometry_1": "service.esophageal_manometry",
      "choice.qq20261102a.b01-context.d1": null,
      "choice.qq20261102a.b01-context.d2": null
    },
    "choiceTimingOverrides": {
      "manometry_1": {
        "kind": "test",
        "timingProfileId": "timing.test.physiology"
      },
      "choice.qq20261102a.b01-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.upper_endoscopy"
      },
      "choice.qq20261102a.b01-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.physiology"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.high-resolution-manometry.v1.r2",
      "whatChanged": "Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B01-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Remove unmotivated repeat endoscopy and chest CT. All options are specified physiologic assessments, with comparable qualifiers and plausible but different clinical purposes. Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question."
        ],
        "fairness": [
          "fairness 1: Require: Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation. Then Choose a motor-classification examination over complementary distensibility or reflux testing. The closest error is: Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
          "fairness 2: Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification. Review boundary: The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision.",
          "fairness 3: Require: Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation. Then Choose a motor-classification examination over complementary distensibility or reflux testing. The closest error is: Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
          "fairness 4: Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification. Review boundary: The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision."
        ],
        "suggestions": [
          "suggestions 1: Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question.",
          "suggestions 2: Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question.",
          "suggestions 3: Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question."
        ]
      },
      "selfCheck": {
        "cueAttack": "Remove unmotivated repeat endoscopy and chest CT. All options are specified physiologic assessments, with comparable qualifiers and plausible but different clinical purposes.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation.",
          "Choose a motor-classification examination over complementary distensibility or reflux testing."
        ],
        "oneBestAnswer": "Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification.",
        "closestDistractor": "Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
        "remainingReview": "The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v1.r3",
      "conceptId": "concept.achalasia.high-resolution-manometry",
      "stem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
      "answerChoices": [
        {
          "id": "manometry_1",
          "label": "High-resolution manometry with positional pressure assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Defines junction relaxation and esophageal-body motor patterns after the supplied structural evaluation."
        },
        {
          "id": "choice.qq20261102a.b01-context.d1",
          "label": "Functional lumen imaging with endoscopic distension assessment",
          "isCorrect": false,
          "distractorRationale": "Provides useful complementary distensibility information but does not replace the primary pressure-based classification study in this ordinary workup."
        },
        {
          "id": "choice.qq20261102a.b01-context.d2",
          "label": "Ambulatory pH-impedance monitoring with symptom association assessment",
          "isCorrect": false,
          "distractorRationale": "Investigates a reflux hypothesis rather than establishing the motor pattern responsible for the combined swallowing observations."
        }
      ],
      "explanation": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence"
      ],
      "teachingPoint": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies."
    },
    "previousResultNarrative": "During each test swallow, no contraction travels down the distal esophagus. The median integrated relaxation pressure is above the laboratory reference range.",
    "resultNarrative": "The esophageal pressure-study report is available for review."
  },
  {
    "id": "revision.qq20261102a.b02",
    "auditId": "B02",
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v2.r2",
    "questionVariantId": "question.achalasia.manometric-recognition.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which motility diagnosis best accounts for {patientName}'s returned study?",
    "previousChoiceLabels": [
      "Achalasia",
      "Esophagogastric junction outflow obstruction",
      "Absent contractility"
    ],
    "previousCurrentUpdate": "The tracing contains no propagated distal contraction during any test swallow. Median integrated relaxation pressure exceeds the laboratory's upper reference limit.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Apply the primary-position criterion without misapplying the separate EGJOO both-position criterion. Then Integrate that interpretation with junction relaxation to classify the motility disorder.",
    "reviewerNotes": "Melissa must confirm protocol adequacy, the interpretation of the synthetic trace and laboratory references. No unverified device-specific IRP cutoff or achalasia treatment rule is added.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_2": "achalasia_2",
      "choice.qq20261102a.b02.d1": "choice.qq20261102.b02.d1",
      "choice.qq20261102a.b02.d2": "choice.qq20261102.b02.d2"
    },
    "choiceServiceOverrides": {
      "achalasia_2": null,
      "choice.qq20261102a.b02.d1": null,
      "choice.qq20261102a.b02.d2": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.manometric-recognition.v2.r2",
      "whatChanged": "Replace the defining-pair summary with a distinct position/trace interpretation problem and closer classification errors; siblings no longer differ only by age or symptom paraphrase.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B02",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The key retains its conventional diagnostic name; names are not padded. Position dependence, pressurization/spasm or subthreshold events carry the inference rather than an interpreted 'absent peristalsis plus impaired relaxation' summary."
        ],
        "fairness": [
          "fairness 1: The raw pattern meets the achalasia classification rather than the distinct relaxation/peristalsis conditions of the offered neighbors.",
          "fairness 2: Require: Apply the primary-position criterion without misapplying the separate EGJOO both-position criterion. Then Integrate that interpretation with junction relaxation to classify the motility disorder. The closest error is: Misclassifying a pressure event as preserved peristalsis, or applying the wrong position-specific criterion, drives the closest competing answer.",
          "fairness 3: The raw pattern meets the achalasia classification rather than the distinct relaxation/peristalsis conditions of the offered neighbors. Review boundary: Melissa must confirm protocol adequacy, the interpretation of the synthetic trace and laboratory references. No unverified device-specific IRP cutoff or achalasia treatment rule is added."
        ],
        "suggestions": [
          "suggestions 1: Require: Apply the primary-position criterion without misapplying the separate EGJOO both-position criterion. Then Integrate that interpretation with junction relaxation to classify the motility disorder. The closest error is: Misclassifying a pressure event as preserved peristalsis, or applying the wrong position-specific criterion, drives the closest competing answer.",
          "suggestions 2: Replace the defining-pair summary with a distinct position/trace interpretation problem and closer classification errors; siblings no longer differ only by age or symptom paraphrase.",
          "suggestions 3: Replace the defining-pair summary with a distinct position/trace interpretation problem and closer classification errors; siblings no longer differ only by age or symptom paraphrase."
        ]
      },
      "selfCheck": {
        "cueAttack": "The key retains its conventional diagnostic name; names are not padded. Position dependence, pressurization/spasm or subthreshold events carry the inference rather than an interpreted 'absent peristalsis plus impaired relaxation' summary.",
        "difficulty": "hard",
        "reasoningSteps": [
          "Apply the primary-position criterion without misapplying the separate EGJOO both-position criterion.",
          "Integrate that interpretation with junction relaxation to classify the motility disorder."
        ],
        "oneBestAnswer": "The raw pattern meets the achalasia classification rather than the distinct relaxation/peristalsis conditions of the offered neighbors.",
        "closestDistractor": "Misclassifying a pressure event as preserved peristalsis, or applying the wrong position-specific criterion, drives the closest competing answer.",
        "remainingReview": "Melissa must confirm protocol adequacy, the interpretation of the synthetic trace and laboratory references. No unverified device-specific IRP cutoff or achalasia treatment rule is added."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.manometric-recognition.v2.r3",
      "conceptId": "concept.achalasia.manometric-recognition",
      "stem": "Which motility diagnosis best accounts for {patientName}'s combined study findings?",
      "answerChoices": [
        {
          "id": "achalasia_2",
          "label": "Achalasia",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the body-pressure/contraction distinction with the appropriate junction-relaxation criterion; an apparent pressure event is not automatically normal peristalsis."
        },
        {
          "id": "choice.qq20261102a.b02.d1",
          "label": "Absent contractility",
          "isCorrect": false,
          "distractorRationale": "Represents a competing motility classification; check whether its relaxation and true-peristalsis requirements fit all of the reported observations."
        },
        {
          "id": "choice.qq20261102a.b02.d2",
          "label": "Esophagogastric junction outflow obstruction",
          "isCorrect": false,
          "distractorRationale": "Represents a competing motility classification; check whether its relaxation and true-peristalsis requirements fit all of the reported observations."
        }
      ],
      "explanation": "With absent peristalsis and clearly abnormal relaxation pressure in the primary test position, achalasia remains the appropriate classification. Do not import the both-position requirement for a conclusive EGJ outflow-obstruction pattern into every achalasia assessment.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.manometric-recognition",
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102.motility-absent-contractility",
        "claim.qq20261102a.primary-position-achalasia"
      ],
      "teachingPoint": "With absent peristalsis and clearly abnormal relaxation pressure in the primary test position, achalasia remains the appropriate classification. Do not import the both-position requirement for a conclusive EGJ outflow-obstruction pattern into every achalasia assessment.",
      "exhibit": {
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
      }
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic because food and drinks pause behind the sternum and return at night. Endoscopy shows no fixed narrowing or intraluminal mass; the symptoms have persisted despite treatment directed at reflux.",
    "previousPresentation": "{patientName}, a 57-year-old woman, visits the clinic because swallowing food and drinks has become difficult and food returns into the mouth at night. Endoscopy shows no fixed narrowing or intraluminal mass.",
    "previousProfilePresentations": [
      {
        "id": "profile.achalasia.night-regurgitation.female.57",
        "presentation": "{patientName}, a 57-year-old woman, visits the clinic because swallowing food and drinks has become difficult and food returns into the mouth at night. Endoscopy shows no fixed narrowing or intraluminal mass."
      },
      {
        "id": "profile.achalasia.night-regurgitation.male.57",
        "presentation": "{patientName}, a 57-year-old man, visits the clinic because swallowing food and drinks has become difficult and food returns into the mouth at night. Endoscopy shows no fixed narrowing or intraluminal mass."
      },
      {
        "id": "profile.achalasia.night-regurgitation.female.63",
        "presentation": "{patientName}, a 63-year-old woman, visits the clinic because swallowing food and drinks has become difficult and food returns into the mouth at night. Endoscopy shows no fixed narrowing or intraluminal mass."
      },
      {
        "id": "profile.achalasia.night-regurgitation.male.63",
        "presentation": "{patientName}, a 63-year-old man, visits the clinic because swallowing food and drinks has become difficult and food returns into the mouth at night. Endoscopy shows no fixed narrowing or intraluminal mass."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.achalasia.night-regurgitation",
        "patientPresentationVariantId": "presentation.achalasia.night-regurgitation",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Difficulty swallowing",
        "revisedPresentation": "{patientName}, a 57-year-old woman, visits the clinic because swallowing food and drinks has become difficult and food returns into the mouth at night. Endoscopy shows no fixed narrowing or intraluminal mass.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.achalasia.night-regurgitation.female.57",
            "approvedInstantiationProfileId": "profile.achalasia.night-regurgitation.female.57",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 57-year-old woman, visits the clinic because swallowing food and drinks has become difficult and food returns into the mouth at night. Endoscopy shows no fixed narrowing or intraluminal mass.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.achalasia.night-regurgitation.male.57",
            "approvedInstantiationProfileId": "profile.achalasia.night-regurgitation.male.57",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 57-year-old man, visits the clinic because swallowing food and drinks has become difficult and food returns into the mouth at night. Endoscopy shows no fixed narrowing or intraluminal mass.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.achalasia.night-regurgitation.female.63",
            "approvedInstantiationProfileId": "profile.achalasia.night-regurgitation.female.63",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 63-year-old woman, visits the clinic because swallowing food and drinks has become difficult and food returns into the mouth at night. Endoscopy shows no fixed narrowing or intraluminal mass.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.achalasia.night-regurgitation.male.63",
            "approvedInstantiationProfileId": "profile.achalasia.night-regurgitation.male.63",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 63-year-old man, visits the clinic because swallowing food and drinks has become difficult and food returns into the mouth at night. Endoscopy shows no fixed narrowing or intraluminal mass.",
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
        "ageYears": 57,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b02-context",
    "auditId": "B02-context",
    "caseId": "case.achalasia.night-regurgitation",
    "nodeId": "node.achalasia.night-regurgitation.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v2.r2",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which investigation should {patientName} have next for persistent swallowing difficulty?",
    "previousChoiceLabels": [
      "High-resolution esophageal manometry",
      "Repeat upper-GI endoscopy",
      "Ambulatory esophageal reflux monitoring",
      "Contrast-enhanced chest CT"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation. Then Choose a motor-classification examination over complementary distensibility or reflux testing.",
    "reviewerNotes": "The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_2": "manometry_2",
      "choice.qq20261102a.b02-context.d1": "repeat_egd_2",
      "choice.qq20261102a.b02-context.d2": "ph_monitoring_2"
    },
    "choiceServiceOverrides": {
      "manometry_2": "service.esophageal_manometry",
      "choice.qq20261102a.b02-context.d1": null,
      "choice.qq20261102a.b02-context.d2": null
    },
    "choiceTimingOverrides": {
      "manometry_2": {
        "kind": "test",
        "timingProfileId": "timing.test.physiology"
      },
      "choice.qq20261102a.b02-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.upper_endoscopy"
      },
      "choice.qq20261102a.b02-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.physiology"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.high-resolution-manometry.v2.r2",
      "whatChanged": "Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B02-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Remove unmotivated repeat endoscopy and chest CT. All options are specified physiologic assessments, with comparable qualifiers and plausible but different clinical purposes. Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question."
        ],
        "fairness": [
          "fairness 1: Require: Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation. Then Choose a motor-classification examination over complementary distensibility or reflux testing. The closest error is: Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
          "fairness 2: Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification. Review boundary: The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision.",
          "fairness 3: Require: Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation. Then Choose a motor-classification examination over complementary distensibility or reflux testing. The closest error is: Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
          "fairness 4: Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification. Review boundary: The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision."
        ],
        "suggestions": [
          "suggestions 1: Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question.",
          "suggestions 2: Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question.",
          "suggestions 3: Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question."
        ]
      },
      "selfCheck": {
        "cueAttack": "Remove unmotivated repeat endoscopy and chest CT. All options are specified physiologic assessments, with comparable qualifiers and plausible but different clinical purposes.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation.",
          "Choose a motor-classification examination over complementary distensibility or reflux testing."
        ],
        "oneBestAnswer": "Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification.",
        "closestDistractor": "Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
        "remainingReview": "The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v2.r3",
      "conceptId": "concept.achalasia.high-resolution-manometry",
      "stem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
      "answerChoices": [
        {
          "id": "manometry_2",
          "label": "High-resolution manometry with positional pressure assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Defines junction relaxation and esophageal-body motor patterns after the supplied structural evaluation."
        },
        {
          "id": "choice.qq20261102a.b02-context.d1",
          "label": "Functional lumen imaging with endoscopic distension assessment",
          "isCorrect": false,
          "distractorRationale": "Provides useful complementary distensibility information but does not replace the primary pressure-based classification study in this ordinary workup."
        },
        {
          "id": "choice.qq20261102a.b02-context.d2",
          "label": "Ambulatory pH-impedance monitoring with symptom association assessment",
          "isCorrect": false,
          "distractorRationale": "Investigates a reflux hypothesis rather than establishing the motor pattern responsible for the combined swallowing observations."
        }
      ],
      "explanation": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence"
      ],
      "teachingPoint": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies."
    },
    "previousResultNarrative": "The tracing contains no propagated distal contraction during any test swallow. Median integrated relaxation pressure exceeds the laboratory's upper reference limit.",
    "resultNarrative": "The esophageal pressure-study report is available for review."
  },
  {
    "id": "revision.qq20261102a.b03",
    "auditId": "B03",
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v3.r2",
    "questionVariantId": "question.achalasia.manometric-recognition.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which motility diagnosis best accounts for {patientName}'s returned study?",
    "previousChoiceLabels": [
      "Achalasia",
      "Esophagogastric junction outflow obstruction",
      "Absent contractility"
    ],
    "previousCurrentUpdate": "None of the test swallows generates a propagated distal contraction. The reported median integrated relaxation pressure is above the laboratory reference range.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Distinguish premature contractions from preserved normal peristalsis. Then Integrate that interpretation with junction relaxation to classify the motility disorder.",
    "reviewerNotes": "Melissa must confirm protocol adequacy, the interpretation of the synthetic trace and laboratory references. No unverified device-specific IRP cutoff or achalasia treatment rule is added.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_3": "achalasia_3",
      "choice.qq20261102a.b03.d1": "choice.qq20261102.b03.d1",
      "choice.qq20261102a.b03.d2": "choice.qq20261102.b03.d2"
    },
    "choiceServiceOverrides": {
      "achalasia_3": null,
      "choice.qq20261102a.b03.d1": null,
      "choice.qq20261102a.b03.d2": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.manometric-recognition.v3.r2",
      "whatChanged": "Replace the defining-pair summary with a distinct position/trace interpretation problem and closer classification errors; siblings no longer differ only by age or symptom paraphrase.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B03",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The key retains its conventional diagnostic name; names are not padded. Position dependence, pressurization/spasm or subthreshold events carry the inference rather than an interpreted 'absent peristalsis plus impaired relaxation' summary."
        ],
        "fairness": [
          "fairness 1: The raw pattern meets the achalasia classification rather than the distinct relaxation/peristalsis conditions of the offered neighbors.",
          "fairness 2: Require: Distinguish premature contractions from preserved normal peristalsis. Then Integrate that interpretation with junction relaxation to classify the motility disorder. The closest error is: Misclassifying a pressure event as preserved peristalsis, or applying the wrong position-specific criterion, drives the closest competing answer.",
          "fairness 3: The raw pattern meets the achalasia classification rather than the distinct relaxation/peristalsis conditions of the offered neighbors. Review boundary: Melissa must confirm protocol adequacy, the interpretation of the synthetic trace and laboratory references. No unverified device-specific IRP cutoff or achalasia treatment rule is added."
        ],
        "suggestions": [
          "suggestions 1: Require: Distinguish premature contractions from preserved normal peristalsis. Then Integrate that interpretation with junction relaxation to classify the motility disorder. The closest error is: Misclassifying a pressure event as preserved peristalsis, or applying the wrong position-specific criterion, drives the closest competing answer.",
          "suggestions 2: Replace the defining-pair summary with a distinct position/trace interpretation problem and closer classification errors; siblings no longer differ only by age or symptom paraphrase.",
          "suggestions 3: Replace the defining-pair summary with a distinct position/trace interpretation problem and closer classification errors; siblings no longer differ only by age or symptom paraphrase."
        ]
      },
      "selfCheck": {
        "cueAttack": "The key retains its conventional diagnostic name; names are not padded. Position dependence, pressurization/spasm or subthreshold events carry the inference rather than an interpreted 'absent peristalsis plus impaired relaxation' summary.",
        "difficulty": "hard",
        "reasoningSteps": [
          "Distinguish premature contractions from preserved normal peristalsis.",
          "Integrate that interpretation with junction relaxation to classify the motility disorder."
        ],
        "oneBestAnswer": "The raw pattern meets the achalasia classification rather than the distinct relaxation/peristalsis conditions of the offered neighbors.",
        "closestDistractor": "Misclassifying a pressure event as preserved peristalsis, or applying the wrong position-specific criterion, drives the closest competing answer.",
        "remainingReview": "Melissa must confirm protocol adequacy, the interpretation of the synthetic trace and laboratory references. No unverified device-specific IRP cutoff or achalasia treatment rule is added."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.manometric-recognition.v3.r3",
      "conceptId": "concept.achalasia.manometric-recognition",
      "stem": "Which motility diagnosis best accounts for {patientName}'s combined study findings?",
      "answerChoices": [
        {
          "id": "achalasia_3",
          "label": "Achalasia",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the body-pressure/contraction distinction with the appropriate junction-relaxation criterion; an apparent pressure event is not automatically normal peristalsis."
        },
        {
          "id": "choice.qq20261102a.b03.d1",
          "label": "Distal esophageal spasm",
          "isCorrect": false,
          "distractorRationale": "Represents a competing motility classification; check whether its relaxation and true-peristalsis requirements fit all of the reported observations."
        },
        {
          "id": "choice.qq20261102a.b03.d2",
          "label": "Hypercontractile esophagus",
          "isCorrect": false,
          "distractorRationale": "Represents a competing motility classification; check whether its relaxation and true-peristalsis requirements fit all of the reported observations."
        }
      ],
      "explanation": "Premature distal contractions are not normal peristalsis. Elevated junction-relaxation pressure with premature/failed rather than normal swallows supports a spastic achalasia pattern rather than distal spasm with normal junction relaxation.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.manometric-recognition",
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102.motility-absent-contractility",
        "claim.qq20261102a.spastic-achalasia"
      ],
      "teachingPoint": "Premature distal contractions are not normal peristalsis. Elevated junction-relaxation pressure with premature/failed rather than normal swallows supports a spastic achalasia pattern rather than distal spasm with normal junction relaxation.",
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
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with dysphagia to food and drinks and intermittent swallowing-related chest pain. Endoscopy shows no ring or intraluminal mass, and the instrument crosses the junction.",
    "previousPresentation": "{patientName}, a 34-year-old woman, visits the clinic because meals take longer and both food and drinks pause before passing. Endoscopy shows no fixed narrowing or intraluminal mass.",
    "previousProfilePresentations": [
      {
        "id": "profile.achalasia.slow-meals.female.34",
        "presentation": "{patientName}, a 34-year-old woman, visits the clinic because meals take longer and both food and drinks pause before passing. Endoscopy shows no fixed narrowing or intraluminal mass."
      },
      {
        "id": "profile.achalasia.slow-meals.male.34",
        "presentation": "{patientName}, a 34-year-old man, visits the clinic because meals take longer and both food and drinks pause before passing. Endoscopy shows no fixed narrowing or intraluminal mass."
      },
      {
        "id": "profile.achalasia.slow-meals.female.40",
        "presentation": "{patientName}, a 40-year-old woman, visits the clinic because meals take longer and both food and drinks pause before passing. Endoscopy shows no fixed narrowing or intraluminal mass."
      },
      {
        "id": "profile.achalasia.slow-meals.male.40",
        "presentation": "{patientName}, a 40-year-old man, visits the clinic because meals take longer and both food and drinks pause before passing. Endoscopy shows no fixed narrowing or intraluminal mass."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.achalasia.slow-meals",
        "patientPresentationVariantId": "presentation.achalasia.slow-meals",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Difficulty swallowing",
        "revisedPresentation": "{patientName}, a 34-year-old woman, visits the clinic because meals take longer and both food and drinks pause before passing. Endoscopy shows no fixed narrowing or intraluminal mass.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.achalasia.slow-meals.female.34",
            "approvedInstantiationProfileId": "profile.achalasia.slow-meals.female.34",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 34-year-old woman, visits the clinic because meals take longer and both food and drinks pause before passing. Endoscopy shows no fixed narrowing or intraluminal mass.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.achalasia.slow-meals.male.34",
            "approvedInstantiationProfileId": "profile.achalasia.slow-meals.male.34",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 34-year-old man, visits the clinic because meals take longer and both food and drinks pause before passing. Endoscopy shows no fixed narrowing or intraluminal mass.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.achalasia.slow-meals.female.40",
            "approvedInstantiationProfileId": "profile.achalasia.slow-meals.female.40",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 40-year-old woman, visits the clinic because meals take longer and both food and drinks pause before passing. Endoscopy shows no fixed narrowing or intraluminal mass.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.achalasia.slow-meals.male.40",
            "approvedInstantiationProfileId": "profile.achalasia.slow-meals.male.40",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 40-year-old man, visits the clinic because meals take longer and both food and drinks pause before passing. Endoscopy shows no fixed narrowing or intraluminal mass.",
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
        "ageYears": 34,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b03-context",
    "auditId": "B03-context",
    "caseId": "case.achalasia.slow-meals",
    "nodeId": "node.achalasia.slow-meals.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v3.r2",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which investigation should {patientName} have next for persistent swallowing difficulty?",
    "previousChoiceLabels": [
      "High-resolution esophageal manometry",
      "Repeat upper-GI endoscopy",
      "Ambulatory esophageal reflux monitoring",
      "Contrast-enhanced chest CT"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation. Then Choose a motor-classification examination over complementary distensibility or reflux testing.",
    "reviewerNotes": "The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_3": "manometry_3",
      "choice.qq20261102a.b03-context.d1": "repeat_egd_3",
      "choice.qq20261102a.b03-context.d2": "ph_monitoring_3"
    },
    "choiceServiceOverrides": {
      "manometry_3": "service.esophageal_manometry",
      "choice.qq20261102a.b03-context.d1": null,
      "choice.qq20261102a.b03-context.d2": null
    },
    "choiceTimingOverrides": {
      "manometry_3": {
        "kind": "test",
        "timingProfileId": "timing.test.physiology"
      },
      "choice.qq20261102a.b03-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.upper_endoscopy"
      },
      "choice.qq20261102a.b03-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.physiology"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.high-resolution-manometry.v3.r2",
      "whatChanged": "Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B03-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Remove unmotivated repeat endoscopy and chest CT. All options are specified physiologic assessments, with comparable qualifiers and plausible but different clinical purposes. Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question."
        ],
        "fairness": [
          "fairness 1: Require: Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation. Then Choose a motor-classification examination over complementary distensibility or reflux testing. The closest error is: Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
          "fairness 2: Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification. Review boundary: The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision.",
          "fairness 3: Require: Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation. Then Choose a motor-classification examination over complementary distensibility or reflux testing. The closest error is: Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
          "fairness 4: Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification. Review boundary: The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision."
        ],
        "suggestions": [
          "suggestions 1: Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question.",
          "suggestions 2: Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question.",
          "suggestions 3: Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question."
        ]
      },
      "selfCheck": {
        "cueAttack": "Remove unmotivated repeat endoscopy and chest CT. All options are specified physiologic assessments, with comparable qualifiers and plausible but different clinical purposes.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation.",
          "Choose a motor-classification examination over complementary distensibility or reflux testing."
        ],
        "oneBestAnswer": "Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification.",
        "closestDistractor": "Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
        "remainingReview": "The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v3.r3",
      "conceptId": "concept.achalasia.high-resolution-manometry",
      "stem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
      "answerChoices": [
        {
          "id": "manometry_3",
          "label": "High-resolution manometry with positional pressure assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Defines junction relaxation and esophageal-body motor patterns after the supplied structural evaluation."
        },
        {
          "id": "choice.qq20261102a.b03-context.d1",
          "label": "Functional lumen imaging with endoscopic distension assessment",
          "isCorrect": false,
          "distractorRationale": "Provides useful complementary distensibility information but does not replace the primary pressure-based classification study in this ordinary workup."
        },
        {
          "id": "choice.qq20261102a.b03-context.d2",
          "label": "Ambulatory pH-impedance monitoring with symptom association assessment",
          "isCorrect": false,
          "distractorRationale": "Investigates a reflux hypothesis rather than establishing the motor pattern responsible for the combined swallowing observations."
        }
      ],
      "explanation": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence"
      ],
      "teachingPoint": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies."
    },
    "previousResultNarrative": "None of the test swallows generates a propagated distal contraction. The reported median integrated relaxation pressure is above the laboratory reference range.",
    "resultNarrative": "The esophageal pressure-study report is available for review."
  },
  {
    "id": "revision.qq20261102a.b04",
    "auditId": "B04",
    "caseId": "case.achalasia.clinic-referral",
    "nodeId": "node.achalasia.clinic-referral.2",
    "previousQuestionVariantId": "question.achalasia.manometric-recognition.v4.r2",
    "questionVariantId": "question.achalasia.manometric-recognition.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which motility diagnosis best accounts for {patientName}'s returned study?",
    "previousChoiceLabels": [
      "Achalasia",
      "Esophagogastric junction outflow obstruction",
      "Absent contractility"
    ],
    "previousCurrentUpdate": "The laboratory reports an elevated median integrated relaxation pressure relative to its reference range; all test swallows lack a propagated distal contraction.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret the small pressure events/contractile integral rather than counting every deflection as a contraction. Then Integrate that interpretation with junction relaxation to classify the motility disorder.",
    "reviewerNotes": "Melissa must confirm protocol adequacy, the interpretation of the synthetic trace and laboratory references. No unverified device-specific IRP cutoff or achalasia treatment rule is added.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "achalasia_4": "achalasia_4",
      "choice.qq20261102a.b04.d1": "choice.qq20261102.b04.d1",
      "choice.qq20261102a.b04.d2": "choice.qq20261102.b04.d2"
    },
    "choiceServiceOverrides": {
      "achalasia_4": null,
      "choice.qq20261102a.b04.d1": null,
      "choice.qq20261102a.b04.d2": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.manometric-recognition.v4.r2",
      "whatChanged": "Replace the defining-pair summary with a distinct position/trace interpretation problem and closer classification errors; siblings no longer differ only by age or symptom paraphrase.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B04",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The key retains its conventional diagnostic name; names are not padded. Position dependence, pressurization/spasm or subthreshold events carry the inference rather than an interpreted 'absent peristalsis plus impaired relaxation' summary."
        ],
        "fairness": [
          "fairness 1: The raw pattern meets the achalasia classification rather than the distinct relaxation/peristalsis conditions of the offered neighbors.",
          "fairness 2: Require: Interpret the small pressure events/contractile integral rather than counting every deflection as a contraction. Then Integrate that interpretation with junction relaxation to classify the motility disorder. The closest error is: Misclassifying a pressure event as preserved peristalsis, or applying the wrong position-specific criterion, drives the closest competing answer.",
          "fairness 3: The raw pattern meets the achalasia classification rather than the distinct relaxation/peristalsis conditions of the offered neighbors. Review boundary: Melissa must confirm protocol adequacy, the interpretation of the synthetic trace and laboratory references. No unverified device-specific IRP cutoff or achalasia treatment rule is added."
        ],
        "suggestions": [
          "suggestions 1: Require: Interpret the small pressure events/contractile integral rather than counting every deflection as a contraction. Then Integrate that interpretation with junction relaxation to classify the motility disorder. The closest error is: Misclassifying a pressure event as preserved peristalsis, or applying the wrong position-specific criterion, drives the closest competing answer.",
          "suggestions 2: Replace the defining-pair summary with a distinct position/trace interpretation problem and closer classification errors; siblings no longer differ only by age or symptom paraphrase.",
          "suggestions 3: Replace the defining-pair summary with a distinct position/trace interpretation problem and closer classification errors; siblings no longer differ only by age or symptom paraphrase."
        ]
      },
      "selfCheck": {
        "cueAttack": "The key retains its conventional diagnostic name; names are not padded. Position dependence, pressurization/spasm or subthreshold events carry the inference rather than an interpreted 'absent peristalsis plus impaired relaxation' summary.",
        "difficulty": "hard",
        "reasoningSteps": [
          "Interpret the small pressure events/contractile integral rather than counting every deflection as a contraction.",
          "Integrate that interpretation with junction relaxation to classify the motility disorder."
        ],
        "oneBestAnswer": "The raw pattern meets the achalasia classification rather than the distinct relaxation/peristalsis conditions of the offered neighbors.",
        "closestDistractor": "Misclassifying a pressure event as preserved peristalsis, or applying the wrong position-specific criterion, drives the closest competing answer.",
        "remainingReview": "Melissa must confirm protocol adequacy, the interpretation of the synthetic trace and laboratory references. No unverified device-specific IRP cutoff or achalasia treatment rule is added."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.manometric-recognition.v4.r3",
      "conceptId": "concept.achalasia.manometric-recognition",
      "stem": "Which motility diagnosis best accounts for {patientName}'s combined study findings?",
      "answerChoices": [
        {
          "id": "achalasia_4",
          "label": "Achalasia",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the body-pressure/contraction distinction with the appropriate junction-relaxation criterion; an apparent pressure event is not automatically normal peristalsis."
        },
        {
          "id": "choice.qq20261102a.b04.d1",
          "label": "Absent contractility",
          "isCorrect": false,
          "distractorRationale": "Represents a competing motility classification; check whether its relaxation and true-peristalsis requirements fit all of the reported observations."
        },
        {
          "id": "choice.qq20261102a.b04.d2",
          "label": "Ineffective esophageal motility",
          "isCorrect": false,
          "distractorRationale": "Represents a competing motility classification; check whether its relaxation and true-peristalsis requirements fit all of the reported observations."
        }
      ],
      "explanation": "The small pressure events fall in the failed-contraction range, not evidence of preserved effective peristalsis. Combined with abnormal junction relaxation, they support achalasia rather than absent contractility with normal relaxation or ineffective motility.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.manometric-recognition",
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102.motility-absent-contractility",
        "claim.qq20261102a.failed-contraction-threshold"
      ],
      "teachingPoint": "The small pressure events fall in the failed-contraction range, not evidence of preserved effective peristalsis. Combined with abnormal junction relaxation, they support achalasia rather than absent contractility with normal relaxation or ineffective motility.",
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
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with continued difficulty swallowing both food and drinks and passive regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass; a contrast swallow empties slowly through the distal junction.",
    "previousPresentation": "{patientName}, a 66-year-old woman, visits the clinic with continued difficulty swallowing both food and drinks and intermittent regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass.",
    "previousProfilePresentations": [
      {
        "id": "profile.achalasia.clinic-referral.female.66",
        "presentation": "{patientName}, a 66-year-old woman, visits the clinic with continued difficulty swallowing both food and drinks and intermittent regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass."
      },
      {
        "id": "profile.achalasia.clinic-referral.male.66",
        "presentation": "{patientName}, a 66-year-old man, visits the clinic with continued difficulty swallowing both food and drinks and intermittent regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass."
      },
      {
        "id": "profile.achalasia.clinic-referral.female.72",
        "presentation": "{patientName}, a 72-year-old woman, visits the clinic with continued difficulty swallowing both food and drinks and intermittent regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass."
      },
      {
        "id": "profile.achalasia.clinic-referral.male.72",
        "presentation": "{patientName}, a 72-year-old man, visits the clinic with continued difficulty swallowing both food and drinks and intermittent regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.achalasia.clinic-referral",
        "patientPresentationVariantId": "presentation.achalasia.clinic-referral",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Difficulty swallowing",
        "revisedPresentation": "{patientName}, a 66-year-old woman, visits the clinic with continued difficulty swallowing both food and drinks and intermittent regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.achalasia.clinic-referral.female.66",
            "approvedInstantiationProfileId": "profile.achalasia.clinic-referral.female.66",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 66-year-old woman, visits the clinic with continued difficulty swallowing both food and drinks and intermittent regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.achalasia.clinic-referral.male.66",
            "approvedInstantiationProfileId": "profile.achalasia.clinic-referral.male.66",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 66-year-old man, visits the clinic with continued difficulty swallowing both food and drinks and intermittent regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.achalasia.clinic-referral.female.72",
            "approvedInstantiationProfileId": "profile.achalasia.clinic-referral.female.72",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 72-year-old woman, visits the clinic with continued difficulty swallowing both food and drinks and intermittent regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.achalasia.clinic-referral.male.72",
            "approvedInstantiationProfileId": "profile.achalasia.clinic-referral.male.72",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 72-year-old man, visits the clinic with continued difficulty swallowing both food and drinks and intermittent regurgitation. Endoscopy shows no fixed narrowing or intraluminal mass.",
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
        "ageYears": 66,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b04-context",
    "auditId": "B04-context",
    "caseId": "case.achalasia.clinic-referral",
    "nodeId": "node.achalasia.clinic-referral.1",
    "previousQuestionVariantId": "question.achalasia.high-resolution-manometry.v4.r2",
    "questionVariantId": "question.achalasia.high-resolution-manometry.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which investigation should {patientName} have next for persistent swallowing difficulty?",
    "previousChoiceLabels": [
      "High-resolution esophageal manometry",
      "Repeat upper-GI endoscopy",
      "Ambulatory esophageal reflux monitoring",
      "Contrast-enhanced chest CT"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation. Then Choose a motor-classification examination over complementary distensibility or reflux testing.",
    "reviewerNotes": "The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "manometry_4": "manometry_4",
      "choice.qq20261102a.b04-context.d1": "repeat_egd_4",
      "choice.qq20261102a.b04-context.d2": "ph_monitoring_4"
    },
    "choiceServiceOverrides": {
      "manometry_4": "service.esophageal_manometry",
      "choice.qq20261102a.b04-context.d1": null,
      "choice.qq20261102a.b04-context.d2": null
    },
    "choiceTimingOverrides": {
      "manometry_4": {
        "kind": "test",
        "timingProfileId": "timing.test.physiology"
      },
      "choice.qq20261102a.b04-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.upper_endoscopy"
      },
      "choice.qq20261102a.b04-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.physiology"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.achalasia.high-resolution-manometry.v4.r2",
      "whatChanged": "Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B04-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Remove unmotivated repeat endoscopy and chest CT. All options are specified physiologic assessments, with comparable qualifiers and plausible but different clinical purposes. Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question."
        ],
        "fairness": [
          "fairness 1: Require: Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation. Then Choose a motor-classification examination over complementary distensibility or reflux testing. The closest error is: Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
          "fairness 2: Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification. Review boundary: The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision.",
          "fairness 3: Require: Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation. Then Choose a motor-classification examination over complementary distensibility or reflux testing. The closest error is: Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
          "fairness 4: Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification. Review boundary: The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision."
        ],
        "suggestions": [
          "suggestions 1: Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question.",
          "suggestions 2: Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question.",
          "suggestions 3: Retain actual structural findings, replace redundant structural/CT distractors with neighboring physiologic tests, and keep diagnosis-free feedback before the tracing question."
        ]
      },
      "selfCheck": {
        "cueAttack": "Remove unmotivated repeat endoscopy and chest CT. All options are specified physiologic assessments, with comparable qualifiers and plausible but different clinical purposes.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Integrate mixed solid/liquid symptoms and the actual structural study, rather than assuming reflux explains passive regurgitation.",
          "Choose a motor-classification examination over complementary distensibility or reflux testing."
        ],
        "oneBestAnswer": "Pressure-based motor classification is the next unresolved assessment; complementary distensibility and reflux testing do not supply that classification.",
        "closestDistractor": "Choosing a reflux study for nocturnal regurgitation or treating distensibility alone as a complete motor classification is credible.",
        "remainingReview": "The 'physiologic' task names the assessment category, not the diagnosis or correct device. Verify service-preview mapping and test suitability; no later pressure result is used to justify this earlier decision."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.achalasia.high-resolution-manometry.v4.r3",
      "conceptId": "concept.achalasia.high-resolution-manometry",
      "stem": "Which physiologic investigation should be obtained next for {patientName}'s persistent swallowing symptoms?",
      "answerChoices": [
        {
          "id": "manometry_4",
          "label": "High-resolution manometry with positional pressure assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Defines junction relaxation and esophageal-body motor patterns after the supplied structural evaluation."
        },
        {
          "id": "choice.qq20261102a.b04-context.d1",
          "label": "Functional lumen imaging with endoscopic distension assessment",
          "isCorrect": false,
          "distractorRationale": "Provides useful complementary distensibility information but does not replace the primary pressure-based classification study in this ordinary workup."
        },
        {
          "id": "choice.qq20261102a.b04-context.d2",
          "label": "Ambulatory pH-impedance monitoring with symptom association assessment",
          "isCorrect": false,
          "distractorRationale": "Investigates a reflux hypothesis rather than establishing the motor pattern responsible for the combined swallowing observations."
        }
      ],
      "explanation": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies.",
      "supportingEvidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence"
      ],
      "teachingPoint": "Measurements from the selected investigation will be returned for interpretation alongside the structural studies."
    },
    "previousResultNarrative": "The laboratory reports an elevated median integrated relaxation pressure relative to its reference range; all test swallows lack a propagated distal contraction.",
    "resultNarrative": "The esophageal pressure-study report is available for review."
  },
  {
    "id": "revision.qq20261102a.b05",
    "auditId": "B05",
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r2",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which imaging study should be arranged next for {patientName}'s intermittent groin swelling?",
    "previousChoiceLabels": [
      "Ultrasound of the groin",
      "Magnetic resonance imaging of the groin",
      "Computed tomography of the groin"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Distinguish the reported intermittent swelling from a plausible coexisting musculoskeletal source of pain. Then Choose the initial examination and dynamic protocol suited to that unresolved observation.",
    "reviewerNotes": "Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_4": "dynamic_ultrasound_4",
      "choice.qq20261102a.b05.d1": "choice.qq20261102.b05.d1",
      "choice.qq20261102a.b05.d2": "choice.qq20261102.b05.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_4": "service.ultrasound",
      "choice.qq20261102a.b05.d1": null,
      "choice.qq20261102a.b05.d2": null
    },
    "choiceTimingOverrides": {
      "dynamic_ultrasound_4": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qq20261102a.b05.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102a.b05.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r2",
      "whatChanged": "State initial-imaging stage, provide a real competing pain interpretation, and specify comparable modality/protocol plans without availability cues.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B05",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: There is no named-test availability sentence or interpreted 'equivocal' label. All choices specify a pelvic/groin imaging approach and clinically relevant protocol focus. State initial-imaging stage, provide a real competing pain interpretation, and specify comparable modality/protocol plans without availability cues.",
          "fairness 2: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Review boundary: Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
          "fairness 3: Require: Distinguish the reported intermittent swelling from a plausible coexisting musculoskeletal source of pain. Then Choose the initial examination and dynamic protocol suited to that unresolved observation. The closest error is: Anchoring on the reproducible adductor/hip/trunk pain and selecting musculoskeletal MRI is the intended resident error."
        ],
        "suggestions": [
          "suggestions 1: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Review boundary: Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
          "suggestions 2: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Review boundary: Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
          "suggestions 3: State initial-imaging stage, provide a real competing pain interpretation, and specify comparable modality/protocol plans without availability cues."
        ]
      },
      "selfCheck": {
        "cueAttack": "There is no named-test availability sentence or interpreted 'equivocal' label. All choices specify a pelvic/groin imaging approach and clinically relevant protocol focus.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Distinguish the reported intermittent swelling from a plausible coexisting musculoskeletal source of pain.",
          "Choose the initial examination and dynamic protocol suited to that unresolved observation."
        ],
        "oneBestAnswer": "This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone.",
        "closestDistractor": "Anchoring on the reproducible adductor/hip/trunk pain and selecting musculoskeletal MRI is the intended resident error.",
        "remainingReview": "Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v4.r3",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "stem": "Which initial imaging plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_4",
          "label": "Groin ultrasound with standing and Valsalva",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Tests the intermittent mechanical observation rather than assuming the coexisting musculoskeletal pain explains it."
        },
        {
          "id": "choice.qq20261102a.b05.d1",
          "label": "Pelvic MRI with hip and adductor assessment",
          "isCorrect": false,
          "distractorRationale": "Investigates the genuine competing musculoskeletal explanation, but is not the initial dynamic groin assessment in this setting."
        },
        {
          "id": "choice.qq20261102a.b05.d2",
          "label": "Pelvic CT with abdominal-wall and groin assessment",
          "isCorrect": false,
          "distractorRationale": "Can show anatomy, but a routine cross-sectional survey does not provide the usual first dynamic assessment of an intermittent lump."
        }
      ],
      "explanation": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment"
      ],
      "teachingPoint": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with groin pain after long work shifts. Hip rotation reproduces a deep ache, but the patient describes a separate surface swelling that is absent on waking. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
    "previousPresentation": "{patientName}, a 51-year-old man, visits the clinic with groin discomfort and a swelling noticed at the end of work shifts. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
    "previousProfilePresentations": [
      {
        "id": "profile.inguinal-hernia.standing-shift.male.51",
        "presentation": "{patientName}, a 51-year-old man, visits the clinic with groin discomfort and a swelling noticed at the end of work shifts. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      },
      {
        "id": "profile.inguinal-hernia.standing-shift.male.54",
        "presentation": "{patientName}, a 54-year-old man, visits the clinic with groin discomfort and a swelling noticed at the end of work shifts. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      },
      {
        "id": "profile.inguinal-hernia.standing-shift.male.57",
        "presentation": "{patientName}, a 57-year-old man, visits the clinic with groin discomfort and a swelling noticed at the end of work shifts. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      },
      {
        "id": "profile.inguinal-hernia.standing-shift.male.60",
        "presentation": "{patientName}, a 60-year-old man, visits the clinic with groin discomfort and a swelling noticed at the end of work shifts. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.inguinal-hernia.standing-shift",
        "patientPresentationVariantId": "presentation.inguinal-hernia.standing-shift",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Intermittent groin bulge",
        "revisedPresentation": "{patientName}, a 51-year-old man, visits the clinic with groin discomfort and a swelling noticed at the end of work shifts. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.standing-shift.male.51",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.standing-shift.male.51",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 51-year-old man, visits the clinic with groin discomfort and a swelling noticed at the end of work shifts. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.standing-shift.male.54",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.standing-shift.male.54",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 54-year-old man, visits the clinic with groin discomfort and a swelling noticed at the end of work shifts. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.standing-shift.male.57",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.standing-shift.male.57",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 57-year-old man, visits the clinic with groin discomfort and a swelling noticed at the end of work shifts. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.standing-shift.male.60",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.standing-shift.male.60",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 60-year-old man, visits the clinic with groin discomfort and a swelling noticed at the end of work shifts. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "previousResultNarrative": "A dynamic groin ultrasound confirms a reducible inguinal hernia; symptoms interfere with completing work shifts.",
    "resultNarrative": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity."
  },
  {
    "id": "revision.qq20261102a.b05-context",
    "auditId": "B05-context",
    "caseId": "case.inguinal-hernia.standing-shift",
    "nodeId": "node.inguinal-hernia.standing-shift.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which management plan should be recommended for {patientName}'s confirmed symptomatic groin hernia?",
    "previousChoiceLabels": [
      "Elective hernia repair consultation",
      "Observation with activity modification",
      "Emergency exploration of the groin",
      "Physical therapy for presumed groin strain"
    ],
    "previousCurrentUpdate": "A dynamic groin ultrasound confirms a reducible inguinal hernia; symptoms interfere with completing work shifts.",
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label. Then Use functional burden to compare three nonemergency strategies for the same condition.",
    "reviewerNotes": "This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_4": "elective_discussion_4",
      "choice.qq20261102a.b05-context.d1": "routine_observation_4",
      "choice.qq20261102a.b05-context.d2": "emergency_operation_4"
    },
    "choiceServiceOverrides": {
      "elective_discussion_4": null,
      "choice.qq20261102a.b05-context.d1": null,
      "choice.qq20261102a.b05-context.d2": null
    },
    "currentUpdate": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v4.r2",
      "whatChanged": "Replace interpreted confirmation and mismatched emergency/strain fillers with raw dynamic findings and three credible nonemergency hernia strategies.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B05-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification.",
          "cues 2: All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification.",
          "cues 3: All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification."
        ],
        "fairness": [
          "fairness 1: Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery. Review boundary: This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required.",
          "fairness 2: Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery. Review boundary: This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required.",
          "fairness 3: Require: Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label. Then Use functional burden to compare three nonemergency strategies for the same condition. The closest error is: Overextending watchful-waiting advice for minimally symptomatic hernias is plausible."
        ],
        "suggestions": [
          "suggestions 1: Replace interpreted confirmation and mismatched emergency/strain fillers with raw dynamic findings and three credible nonemergency hernia strategies.",
          "suggestions 2: Require: Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label. Then Use functional burden to compare three nonemergency strategies for the same condition. The closest error is: Overextending watchful-waiting advice for minimally symptomatic hernias is plausible.",
          "suggestions 3: Replace interpreted confirmation and mismatched emergency/strain fillers with raw dynamic findings and three credible nonemergency hernia strategies."
        ]
      },
      "selfCheck": {
        "cueAttack": "All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label.",
          "Use functional burden to compare three nonemergency strategies for the same condition."
        ],
        "oneBestAnswer": "Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery.",
        "closestDistractor": "Overextending watchful-waiting advice for minimally symptomatic hernias is plausible.",
        "remainingReview": "This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v4.r3",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "stem": "Which management plan should be discussed with {patientName}?",
      "answerChoices": [
        {
          "id": "elective_discussion_4",
          "label": "Elective repair consultation with operative-risk review",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the demonstrated lesion with repeated functional limitation, while leaving the actual operation and shared decision to assessment."
        },
        {
          "id": "choice.qq20261102a.b05-context.d1",
          "label": "Watchful waiting with an individualized symptom-triggered review",
          "isCorrect": false,
          "distractorRationale": "Applies an approach more suited to selected minimally symptomatic patients despite the supplied recurring activity limitation."
        },
        {
          "id": "choice.qq20261102a.b05-context.d2",
          "label": "Support-garment management with an individualized scheduled review",
          "isCorrect": false,
          "distractorRationale": "Offers symptom support but treats it as the main long-term strategy despite repeated functional limitation."
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
    "id": "revision.qq20261102a.b06",
    "auditId": "B06",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r2",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which imaging study should be arranged next for {patientName}'s intermittent groin swelling?",
    "previousChoiceLabels": [
      "Ultrasound of the groin",
      "Magnetic resonance imaging of the groin",
      "Computed tomography of the groin"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Distinguish the reported intermittent swelling from a plausible coexisting musculoskeletal source of pain. Then Choose the initial examination and dynamic protocol suited to that unresolved observation.",
    "reviewerNotes": "Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_2": "dynamic_ultrasound_2",
      "choice.qq20261102a.b06.d1": "choice.qq20261102.b06.d1",
      "choice.qq20261102a.b06.d2": "choice.qq20261102.b06.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_2": "service.ultrasound",
      "choice.qq20261102a.b06.d1": null,
      "choice.qq20261102a.b06.d2": null
    },
    "choiceTimingOverrides": {
      "dynamic_ultrasound_2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qq20261102a.b06.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102a.b06.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r2",
      "whatChanged": "State initial-imaging stage, provide a real competing pain interpretation, and specify comparable modality/protocol plans without availability cues.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B06",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: There is no named-test availability sentence or interpreted 'equivocal' label. All choices specify a pelvic/groin imaging approach and clinically relevant protocol focus. State initial-imaging stage, provide a real competing pain interpretation, and specify comparable modality/protocol plans without availability cues.",
          "fairness 2: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Review boundary: Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
          "fairness 3: Require: Distinguish the reported intermittent swelling from a plausible coexisting musculoskeletal source of pain. Then Choose the initial examination and dynamic protocol suited to that unresolved observation. The closest error is: Anchoring on the reproducible adductor/hip/trunk pain and selecting musculoskeletal MRI is the intended resident error."
        ],
        "suggestions": [
          "suggestions 1: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Review boundary: Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
          "suggestions 2: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Review boundary: Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
          "suggestions 3: State initial-imaging stage, provide a real competing pain interpretation, and specify comparable modality/protocol plans without availability cues."
        ]
      },
      "selfCheck": {
        "cueAttack": "There is no named-test availability sentence or interpreted 'equivocal' label. All choices specify a pelvic/groin imaging approach and clinically relevant protocol focus.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Distinguish the reported intermittent swelling from a plausible coexisting musculoskeletal source of pain.",
          "Choose the initial examination and dynamic protocol suited to that unresolved observation."
        ],
        "oneBestAnswer": "This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone.",
        "closestDistractor": "Anchoring on the reproducible adductor/hip/trunk pain and selecting musculoskeletal MRI is the intended resident error.",
        "remainingReview": "Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v2.r3",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "stem": "Which initial imaging plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_2",
          "label": "Groin ultrasound with standing and Valsalva",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Tests the intermittent mechanical observation rather than assuming the coexisting musculoskeletal pain explains it."
        },
        {
          "id": "choice.qq20261102a.b06.d1",
          "label": "Pelvic MRI with hip and adductor assessment",
          "isCorrect": false,
          "distractorRationale": "Investigates the genuine competing musculoskeletal explanation, but is not the initial dynamic groin assessment in this setting."
        },
        {
          "id": "choice.qq20261102a.b06.d2",
          "label": "Pelvic CT with abdominal-wall and groin assessment",
          "isCorrect": false,
          "distractorRationale": "Can show anatomy, but a routine cross-sectional survey does not provide the usual first dynamic assessment of an intermittent lump."
        }
      ],
      "explanation": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment"
      ],
      "teachingPoint": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with groin pain after running. Resisted hip adduction causes discomfort; a phone photograph taken after running shows a contour change at the symptomatic groin. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
    "previousPresentation": "{patientName}, a 35-year-old man, visits the clinic with groin discomfort and a swelling noticed after running. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
    "previousProfilePresentations": [
      {
        "id": "profile.inguinal-hernia.running-discomfort.male.35",
        "presentation": "{patientName}, a 35-year-old man, visits the clinic with groin discomfort and a swelling noticed after running. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      },
      {
        "id": "profile.inguinal-hernia.running-discomfort.male.38",
        "presentation": "{patientName}, a 38-year-old man, visits the clinic with groin discomfort and a swelling noticed after running. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      },
      {
        "id": "profile.inguinal-hernia.running-discomfort.male.41",
        "presentation": "{patientName}, a 41-year-old man, visits the clinic with groin discomfort and a swelling noticed after running. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      },
      {
        "id": "profile.inguinal-hernia.running-discomfort.male.44",
        "presentation": "{patientName}, a 44-year-old man, visits the clinic with groin discomfort and a swelling noticed after running. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.inguinal-hernia.running-discomfort",
        "patientPresentationVariantId": "presentation.inguinal-hernia.running-discomfort",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Intermittent groin bulge",
        "revisedPresentation": "{patientName}, a 35-year-old man, visits the clinic with groin discomfort and a swelling noticed after running. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.running-discomfort.male.35",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.running-discomfort.male.35",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 35-year-old man, visits the clinic with groin discomfort and a swelling noticed after running. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.running-discomfort.male.38",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.running-discomfort.male.38",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 38-year-old man, visits the clinic with groin discomfort and a swelling noticed after running. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.running-discomfort.male.41",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.running-discomfort.male.41",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 41-year-old man, visits the clinic with groin discomfort and a swelling noticed after running. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.running-discomfort.male.44",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.running-discomfort.male.44",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 44-year-old man, visits the clinic with groin discomfort and a swelling noticed after running. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "previousResultNarrative": "Targeted dynamic ultrasound demonstrates a reducible inguinal hernia, and the symptoms now prevent usual exercise.",
    "resultNarrative": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity."
  },
  {
    "id": "revision.qq20261102a.b06-context",
    "auditId": "B06-context",
    "caseId": "case.inguinal-hernia.running-discomfort",
    "nodeId": "node.inguinal-hernia.running-discomfort.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which management plan should be recommended for {patientName}'s confirmed symptomatic groin hernia?",
    "previousChoiceLabels": [
      "Elective hernia repair consultation",
      "Observation with activity modification",
      "Emergency exploration of the groin",
      "Physical therapy for presumed groin strain"
    ],
    "previousCurrentUpdate": "Targeted dynamic ultrasound demonstrates a reducible inguinal hernia, and the symptoms now prevent usual exercise.",
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label. Then Use functional burden to compare three nonemergency strategies for the same condition.",
    "reviewerNotes": "This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_2": "elective_discussion_2",
      "choice.qq20261102a.b06-context.d1": "routine_observation_2",
      "choice.qq20261102a.b06-context.d2": "emergency_operation_2"
    },
    "choiceServiceOverrides": {
      "elective_discussion_2": null,
      "choice.qq20261102a.b06-context.d1": null,
      "choice.qq20261102a.b06-context.d2": null
    },
    "currentUpdate": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v2.r2",
      "whatChanged": "Replace interpreted confirmation and mismatched emergency/strain fillers with raw dynamic findings and three credible nonemergency hernia strategies.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B06-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification.",
          "cues 2: All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification.",
          "cues 3: All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification."
        ],
        "fairness": [
          "fairness 1: Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery. Review boundary: This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required.",
          "fairness 2: Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery. Review boundary: This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required.",
          "fairness 3: Require: Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label. Then Use functional burden to compare three nonemergency strategies for the same condition. The closest error is: Overextending watchful-waiting advice for minimally symptomatic hernias is plausible."
        ],
        "suggestions": [
          "suggestions 1: Replace interpreted confirmation and mismatched emergency/strain fillers with raw dynamic findings and three credible nonemergency hernia strategies.",
          "suggestions 2: Require: Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label. Then Use functional burden to compare three nonemergency strategies for the same condition. The closest error is: Overextending watchful-waiting advice for minimally symptomatic hernias is plausible.",
          "suggestions 3: Replace interpreted confirmation and mismatched emergency/strain fillers with raw dynamic findings and three credible nonemergency hernia strategies."
        ]
      },
      "selfCheck": {
        "cueAttack": "All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label.",
          "Use functional burden to compare three nonemergency strategies for the same condition."
        ],
        "oneBestAnswer": "Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery.",
        "closestDistractor": "Overextending watchful-waiting advice for minimally symptomatic hernias is plausible.",
        "remainingReview": "This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v2.r3",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "stem": "Which management plan should be discussed with {patientName}?",
      "answerChoices": [
        {
          "id": "elective_discussion_2",
          "label": "Elective repair consultation with operative-risk review",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the demonstrated lesion with repeated functional limitation, while leaving the actual operation and shared decision to assessment."
        },
        {
          "id": "choice.qq20261102a.b06-context.d1",
          "label": "Watchful waiting with an individualized symptom-triggered review",
          "isCorrect": false,
          "distractorRationale": "Applies an approach more suited to selected minimally symptomatic patients despite the supplied recurring activity limitation."
        },
        {
          "id": "choice.qq20261102a.b06-context.d2",
          "label": "Support-garment management with an individualized scheduled review",
          "isCorrect": false,
          "distractorRationale": "Offers symptom support but treats it as the main long-term strategy despite repeated functional limitation."
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
    "id": "revision.qq20261102a.b07",
    "auditId": "B07",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r2",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which imaging study should be arranged next for {patientName}'s intermittent groin swelling?",
    "previousChoiceLabels": [
      "Ultrasound of the groin",
      "Magnetic resonance imaging of the groin",
      "Computed tomography of the groin"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Distinguish the reported intermittent swelling from a plausible coexisting musculoskeletal source of pain. Then Choose the initial examination and dynamic protocol suited to that unresolved observation.",
    "reviewerNotes": "Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_3": "dynamic_ultrasound_3",
      "choice.qq20261102a.b07.d1": "choice.qq20261102.b07.d1",
      "choice.qq20261102a.b07.d2": "choice.qq20261102.b07.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_3": "service.ultrasound",
      "choice.qq20261102a.b07.d1": null,
      "choice.qq20261102a.b07.d2": null
    },
    "choiceTimingOverrides": {
      "dynamic_ultrasound_3": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qq20261102a.b07.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102a.b07.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r2",
      "whatChanged": "State initial-imaging stage, provide a real competing pain interpretation, and specify comparable modality/protocol plans without availability cues.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B07",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: There is no named-test availability sentence or interpreted 'equivocal' label. All choices specify a pelvic/groin imaging approach and clinically relevant protocol focus. State initial-imaging stage, provide a real competing pain interpretation, and specify comparable modality/protocol plans without availability cues.",
          "fairness 2: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Review boundary: Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
          "fairness 3: Require: Distinguish the reported intermittent swelling from a plausible coexisting musculoskeletal source of pain. Then Choose the initial examination and dynamic protocol suited to that unresolved observation. The closest error is: Anchoring on the reproducible adductor/hip/trunk pain and selecting musculoskeletal MRI is the intended resident error."
        ],
        "suggestions": [
          "suggestions 1: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Review boundary: Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
          "suggestions 2: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Review boundary: Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
          "suggestions 3: State initial-imaging stage, provide a real competing pain interpretation, and specify comparable modality/protocol plans without availability cues."
        ]
      },
      "selfCheck": {
        "cueAttack": "There is no named-test availability sentence or interpreted 'equivocal' label. All choices specify a pelvic/groin imaging approach and clinically relevant protocol focus.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Distinguish the reported intermittent swelling from a plausible coexisting musculoskeletal source of pain.",
          "Choose the initial examination and dynamic protocol suited to that unresolved observation."
        ],
        "oneBestAnswer": "This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone.",
        "closestDistractor": "Anchoring on the reproducible adductor/hip/trunk pain and selecting musculoskeletal MRI is the intended resident error.",
        "remainingReview": "Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v3.r3",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "stem": "Which initial imaging plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_3",
          "label": "Groin ultrasound with standing and Valsalva",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Tests the intermittent mechanical observation rather than assuming the coexisting musculoskeletal pain explains it."
        },
        {
          "id": "choice.qq20261102a.b07.d1",
          "label": "Pelvic MRI with hip and adductor assessment",
          "isCorrect": false,
          "distractorRationale": "Investigates the genuine competing musculoskeletal explanation, but is not the initial dynamic groin assessment in this setting."
        },
        {
          "id": "choice.qq20261102a.b07.d2",
          "label": "Pelvic CT with abdominal-wall and groin assessment",
          "isCorrect": false,
          "distractorRationale": "Can show anatomy, but a routine cross-sectional survey does not provide the usual first dynamic assessment of an intermittent lump."
        }
      ],
      "explanation": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment"
      ],
      "teachingPoint": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with groin pain when lifting a relative. Tenderness lies near the pubic tubercle; the patient reports a separate lump that disappears after lying down. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
    "previousPresentation": "{patientName}, a 59-year-old man, visits the clinic with groin discomfort and a swelling noticed when helping lift a relative. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
    "previousProfilePresentations": [
      {
        "id": "profile.inguinal-hernia.caregiving-strain.male.59",
        "presentation": "{patientName}, a 59-year-old man, visits the clinic with groin discomfort and a swelling noticed when helping lift a relative. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      },
      {
        "id": "profile.inguinal-hernia.caregiving-strain.male.62",
        "presentation": "{patientName}, a 62-year-old man, visits the clinic with groin discomfort and a swelling noticed when helping lift a relative. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      },
      {
        "id": "profile.inguinal-hernia.caregiving-strain.male.65",
        "presentation": "{patientName}, a 65-year-old man, visits the clinic with groin discomfort and a swelling noticed when helping lift a relative. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      },
      {
        "id": "profile.inguinal-hernia.caregiving-strain.male.68",
        "presentation": "{patientName}, a 68-year-old man, visits the clinic with groin discomfort and a swelling noticed when helping lift a relative. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.inguinal-hernia.caregiving-strain",
        "patientPresentationVariantId": "presentation.inguinal-hernia.caregiving-strain",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Intermittent groin bulge",
        "revisedPresentation": "{patientName}, a 59-year-old man, visits the clinic with groin discomfort and a swelling noticed when helping lift a relative. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.caregiving-strain.male.59",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.caregiving-strain.male.59",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 59-year-old man, visits the clinic with groin discomfort and a swelling noticed when helping lift a relative. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.caregiving-strain.male.62",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.caregiving-strain.male.62",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 62-year-old man, visits the clinic with groin discomfort and a swelling noticed when helping lift a relative. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.caregiving-strain.male.65",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.caregiving-strain.male.65",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 65-year-old man, visits the clinic with groin discomfort and a swelling noticed when helping lift a relative. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.caregiving-strain.male.68",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.caregiving-strain.male.68",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 68-year-old man, visits the clinic with groin discomfort and a swelling noticed when helping lift a relative. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "previousResultNarrative": "Dynamic ultrasound confirms inguinal anatomy with a reducible hernia. The recurring discomfort limits caregiving tasks.",
    "resultNarrative": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity."
  },
  {
    "id": "revision.qq20261102a.b07-context",
    "auditId": "B07-context",
    "caseId": "case.inguinal-hernia.caregiving-strain",
    "nodeId": "node.inguinal-hernia.caregiving-strain.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which management plan should be recommended for {patientName}'s confirmed symptomatic groin hernia?",
    "previousChoiceLabels": [
      "Elective hernia repair consultation",
      "Observation with activity modification",
      "Emergency exploration of the groin",
      "Physical therapy for presumed groin strain"
    ],
    "previousCurrentUpdate": "Dynamic ultrasound confirms inguinal anatomy with a reducible hernia. The recurring discomfort limits caregiving tasks.",
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label. Then Use functional burden to compare three nonemergency strategies for the same condition.",
    "reviewerNotes": "This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_3": "elective_discussion_3",
      "choice.qq20261102a.b07-context.d1": "routine_observation_3",
      "choice.qq20261102a.b07-context.d2": "emergency_operation_3"
    },
    "choiceServiceOverrides": {
      "elective_discussion_3": null,
      "choice.qq20261102a.b07-context.d1": null,
      "choice.qq20261102a.b07-context.d2": null
    },
    "currentUpdate": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v3.r2",
      "whatChanged": "Replace interpreted confirmation and mismatched emergency/strain fillers with raw dynamic findings and three credible nonemergency hernia strategies.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B07-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification.",
          "cues 2: All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification.",
          "cues 3: All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification."
        ],
        "fairness": [
          "fairness 1: Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery. Review boundary: This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required.",
          "fairness 2: Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery. Review boundary: This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required.",
          "fairness 3: Require: Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label. Then Use functional burden to compare three nonemergency strategies for the same condition. The closest error is: Overextending watchful-waiting advice for minimally symptomatic hernias is plausible."
        ],
        "suggestions": [
          "suggestions 1: Replace interpreted confirmation and mismatched emergency/strain fillers with raw dynamic findings and three credible nonemergency hernia strategies.",
          "suggestions 2: Require: Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label. Then Use functional burden to compare three nonemergency strategies for the same condition. The closest error is: Overextending watchful-waiting advice for minimally symptomatic hernias is plausible.",
          "suggestions 3: Replace interpreted confirmation and mismatched emergency/strain fillers with raw dynamic findings and three credible nonemergency hernia strategies."
        ]
      },
      "selfCheck": {
        "cueAttack": "All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label.",
          "Use functional burden to compare three nonemergency strategies for the same condition."
        ],
        "oneBestAnswer": "Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery.",
        "closestDistractor": "Overextending watchful-waiting advice for minimally symptomatic hernias is plausible.",
        "remainingReview": "This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v3.r3",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "stem": "Which management plan should be discussed with {patientName}?",
      "answerChoices": [
        {
          "id": "elective_discussion_3",
          "label": "Elective repair consultation with operative-risk review",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the demonstrated lesion with repeated functional limitation, while leaving the actual operation and shared decision to assessment."
        },
        {
          "id": "choice.qq20261102a.b07-context.d1",
          "label": "Watchful waiting with an individualized symptom-triggered review",
          "isCorrect": false,
          "distractorRationale": "Applies an approach more suited to selected minimally symptomatic patients despite the supplied recurring activity limitation."
        },
        {
          "id": "choice.qq20261102a.b07-context.d2",
          "label": "Support-garment management with an individualized scheduled review",
          "isCorrect": false,
          "distractorRationale": "Offers symptom support but treats it as the main long-term strategy despite repeated functional limitation."
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
    "id": "revision.qq20261102a.b08",
    "auditId": "B08",
    "caseId": "case.inguinal-hernia.lifting-bulge",
    "nodeId": "node.inguinal-hernia.lifting-bulge.1",
    "previousQuestionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v1.r2",
    "questionVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which imaging study should be arranged next for {patientName}'s intermittent groin swelling?",
    "previousChoiceLabels": [
      "Ultrasound of the groin",
      "Magnetic resonance imaging of the groin",
      "Computed tomography of the groin"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Distinguish the reported intermittent swelling from a plausible coexisting musculoskeletal source of pain. Then Choose the initial examination and dynamic protocol suited to that unresolved observation.",
    "reviewerNotes": "Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "dynamic_ultrasound_1": "dynamic_ultrasound_1",
      "choice.qq20261102a.b08.d1": "choice.qq20261102.b08.d1",
      "choice.qq20261102a.b08.d2": "choice.qq20261102.b08.d2"
    },
    "choiceServiceOverrides": {
      "dynamic_ultrasound_1": "service.ultrasound",
      "choice.qq20261102a.b08.d1": null,
      "choice.qq20261102a.b08.d2": null
    },
    "choiceTimingOverrides": {
      "dynamic_ultrasound_1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qq20261102a.b08.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102a.b08.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.equivocal-exam-ultrasound.v1.r2",
      "whatChanged": "State initial-imaging stage, provide a real competing pain interpretation, and specify comparable modality/protocol plans without availability cues.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B08",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: There is no named-test availability sentence or interpreted 'equivocal' label. All choices specify a pelvic/groin imaging approach and clinically relevant protocol focus. State initial-imaging stage, provide a real competing pain interpretation, and specify comparable modality/protocol plans without availability cues.",
          "fairness 2: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Review boundary: Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
          "fairness 3: Require: Distinguish the reported intermittent swelling from a plausible coexisting musculoskeletal source of pain. Then Choose the initial examination and dynamic protocol suited to that unresolved observation. The closest error is: Anchoring on the reproducible adductor/hip/trunk pain and selecting musculoskeletal MRI is the intended resident error."
        ],
        "suggestions": [
          "suggestions 1: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Review boundary: Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
          "suggestions 2: This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone. Review boundary: Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia.",
          "suggestions 3: State initial-imaging stage, provide a real competing pain interpretation, and specify comparable modality/protocol plans without availability cues."
        ]
      },
      "selfCheck": {
        "cueAttack": "There is no named-test availability sentence or interpreted 'equivocal' label. All choices specify a pelvic/groin imaging approach and clinically relevant protocol focus.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Distinguish the reported intermittent swelling from a plausible coexisting musculoskeletal source of pain.",
          "Choose the initial examination and dynamic protocol suited to that unresolved observation."
        ],
        "oneBestAnswer": "This is the first imaging assessment of intermittent swelling; dynamic groin assessment is more directly indicated than investigation of the competing pain source alone.",
        "closestDistractor": "Anchoring on the reproducible adductor/hip/trunk pain and selecting musculoskeletal MRI is the intended resident error.",
        "remainingReview": "Melissa must confirm the scenario and initial ultrasound-versus-MRI ranking. The added competing observations are synthetic findings, not claims that they exclude a hernia."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.equivocal-exam-ultrasound.v1.r3",
      "conceptId": "concept.inguinal-hernia.equivocal-exam-ultrasound",
      "stem": "Which initial imaging plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "dynamic_ultrasound_1",
          "label": "Groin ultrasound with standing and Valsalva",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Tests the intermittent mechanical observation rather than assuming the coexisting musculoskeletal pain explains it."
        },
        {
          "id": "choice.qq20261102a.b08.d1",
          "label": "Pelvic MRI with hip and adductor assessment",
          "isCorrect": false,
          "distractorRationale": "Investigates the genuine competing musculoskeletal explanation, but is not the initial dynamic groin assessment in this setting."
        },
        {
          "id": "choice.qq20261102a.b08.d2",
          "label": "Pelvic CT with abdominal-wall and groin assessment",
          "isCorrect": false,
          "distractorRationale": "Can show anatomy, but a routine cross-sectional survey does not provide the usual first dynamic assessment of an intermittent lump."
        }
      ],
      "explanation": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway.",
      "supportingEvidenceClaimIds": [
        "claim.inguinal-hernia.equivocal-exam-ultrasound",
        "claim.qq20261102a.groin-initial-dynamic-assessment"
      ],
      "teachingPoint": "The pain findings and intermittent swelling need not have the same explanation. Initial dynamic groin ultrasound can evaluate a lump that disappears at rest. Persistent uncertainty after an adequate assessment can require further investigation; MRI is not dismissed as an invalid alternative in every occult-hernia pathway."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with groin pain while lifting at work. A musculoskeletal assessment reproduces pain with trunk movement; the patient also reports a swelling that comes and goes. The office examination does not reproduce the swelling during coughing. No groin imaging has yet been performed.",
    "previousPresentation": "{patientName}, a 44-year-old man, visits the clinic with groin discomfort and a swelling noticed while lifting at work. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
    "previousProfilePresentations": [
      {
        "id": "profile.inguinal-hernia.lifting-bulge.male.44",
        "presentation": "{patientName}, a 44-year-old man, visits the clinic with groin discomfort and a swelling noticed while lifting at work. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      },
      {
        "id": "profile.inguinal-hernia.lifting-bulge.male.47",
        "presentation": "{patientName}, a 47-year-old man, visits the clinic with groin discomfort and a swelling noticed while lifting at work. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      },
      {
        "id": "profile.inguinal-hernia.lifting-bulge.male.50",
        "presentation": "{patientName}, a 50-year-old man, visits the clinic with groin discomfort and a swelling noticed while lifting at work. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      },
      {
        "id": "profile.inguinal-hernia.lifting-bulge.male.53",
        "presentation": "{patientName}, a 53-year-old man, visits the clinic with groin discomfort and a swelling noticed while lifting at work. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.inguinal-hernia.lifting-bulge",
        "patientPresentationVariantId": "presentation.inguinal-hernia.lifting-bulge",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Intermittent groin bulge",
        "revisedPresentation": "{patientName}, a 44-year-old man, visits the clinic with groin discomfort and a swelling noticed while lifting at work. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.lifting-bulge.male.44",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.lifting-bulge.male.44",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 44-year-old man, visits the clinic with groin discomfort and a swelling noticed while lifting at work. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.lifting-bulge.male.47",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.lifting-bulge.male.47",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 47-year-old man, visits the clinic with groin discomfort and a swelling noticed while lifting at work. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.lifting-bulge.male.50",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.lifting-bulge.male.50",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 50-year-old man, visits the clinic with groin discomfort and a swelling noticed while lifting at work. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.inguinal-hernia.lifting-bulge.male.53",
            "approvedInstantiationProfileId": "profile.inguinal-hernia.lifting-bulge.male.53",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 53-year-old man, visits the clinic with groin discomfort and a swelling noticed while lifting at work. The swelling disappears when lying down. Examination at the visit does not reproduce the lump, including during coughing.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "previousResultNarrative": "Dynamic groin ultrasound confirms a reducible inguinal hernia. The patient reports that the symptoms limit lifting at work.",
    "resultNarrative": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity."
  },
  {
    "id": "revision.qq20261102a.b08-context",
    "auditId": "B08-context",
    "caseId": "case.inguinal-hernia.lifting-bulge",
    "nodeId": "node.inguinal-hernia.lifting-bulge.2",
    "previousQuestionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r2",
    "questionVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which management plan should be recommended for {patientName}'s confirmed symptomatic groin hernia?",
    "previousChoiceLabels": [
      "Elective hernia repair consultation",
      "Observation with activity modification",
      "Emergency exploration of the groin",
      "Physical therapy for presumed groin strain"
    ],
    "previousCurrentUpdate": "Dynamic groin ultrasound confirms a reducible inguinal hernia. The patient reports that the symptoms limit lifting at work.",
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label. Then Use functional burden to compare three nonemergency strategies for the same condition.",
    "reviewerNotes": "This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "elective_discussion_1": "elective_discussion_1",
      "choice.qq20261102a.b08-context.d1": "routine_observation_1",
      "choice.qq20261102a.b08-context.d2": "emergency_operation_1"
    },
    "choiceServiceOverrides": {
      "elective_discussion_1": null,
      "choice.qq20261102a.b08-context.d1": null,
      "choice.qq20261102a.b08-context.d2": null
    },
    "currentUpdate": "During straining, ultrasound shows a bowel-containing protrusion through the inguinal canal; it withdraws when straining stops. Pain at this site repeatedly interrupts the patient's usual activity.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inguinal-hernia.symptomatic-elective-repair.v1.r2",
      "whatChanged": "Replace interpreted confirmation and mismatched emergency/strain fillers with raw dynamic findings and three credible nonemergency hernia strategies.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B08-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification.",
          "cues 2: All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification.",
          "cues 3: All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification."
        ],
        "fairness": [
          "fairness 1: Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery. Review boundary: This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required.",
          "fairness 2: Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery. Review boundary: This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required.",
          "fairness 3: Require: Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label. Then Use functional burden to compare three nonemergency strategies for the same condition. The closest error is: Overextending watchful-waiting advice for minimally symptomatic hernias is plausible."
        ],
        "suggestions": [
          "suggestions 1: Replace interpreted confirmation and mismatched emergency/strain fillers with raw dynamic findings and three credible nonemergency hernia strategies.",
          "suggestions 2: Require: Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label. Then Use functional burden to compare three nonemergency strategies for the same condition. The closest error is: Overextending watchful-waiting advice for minimally symptomatic hernias is plausible.",
          "suggestions 3: Replace interpreted confirmation and mismatched emergency/strain fillers with raw dynamic findings and three credible nonemergency hernia strategies."
        ]
      },
      "selfCheck": {
        "cueAttack": "All choices address the same demonstrated problem. Emergency exploration and presumed-strain physiotherapy are removed; the lead-in no longer names the diagnosis or symptom classification.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the dynamic protrusion/withdrawal rather than receiving a 'confirmed symptomatic hernia' label.",
          "Use functional burden to compare three nonemergency strategies for the same condition."
        ],
        "oneBestAnswer": "Repeated activity interruption favors an elective repair assessment over the offered conservative strategies, without asserting that every hernia requires immediate surgery.",
        "closestDistractor": "Overextending watchful-waiting advice for minimally symptomatic hernias is plausible.",
        "remainingReview": "This core planning concept may remain relatively straightforward for senior residents; no warning sign or patient goal is hidden to manufacture struggle. Independent difficulty review remains required."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inguinal-hernia.symptomatic-elective-repair.v1.r3",
      "conceptId": "concept.inguinal-hernia.symptomatic-elective-repair",
      "stem": "Which management plan should be discussed with {patientName}?",
      "answerChoices": [
        {
          "id": "elective_discussion_1",
          "label": "Elective repair consultation with operative-risk review",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the demonstrated lesion with repeated functional limitation, while leaving the actual operation and shared decision to assessment."
        },
        {
          "id": "choice.qq20261102a.b08-context.d1",
          "label": "Watchful waiting with an individualized symptom-triggered review",
          "isCorrect": false,
          "distractorRationale": "Applies an approach more suited to selected minimally symptomatic patients despite the supplied recurring activity limitation."
        },
        {
          "id": "choice.qq20261102a.b08-context.d2",
          "label": "Support-garment management with an individualized scheduled review",
          "isCorrect": false,
          "distractorRationale": "Offers symptom support but treats it as the main long-term strategy despite repeated functional limitation."
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
    "id": "revision.qq20261102a.b09",
    "auditId": "B09",
    "caseId": "case.gs028b.differentiated-thyroid-cancer.a-palpable-node",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.a-palpable-node.1",
    "previousQuestionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r2",
    "questionVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which imaging study should be obtained before surgery for {patientName}'s papillary thyroid carcinoma?",
    "previousChoiceLabels": [
      "Neck ultrasonography",
      "Contrast-enhanced neck CT",
      "Thyroid scintigraphy"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret the cytologic nuclear/architectural findings rather than being told the tumor type. Then Distinguish limited procedure images from preoperative regional assessment and select its initial modality.",
    "reviewerNotes": "Melissa must verify the cytologic interpretation and that the palpable-node description does not call for a more specific immediate sampling plan.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_3": "correct_3",
      "choice.qq20261102a.b09.d1": "choice.qq20261102.b09.d1",
      "choice.qq20261102a.b09.d2": "choice.qq20261102.b09.d2"
    },
    "choiceServiceOverrides": {
      "correct_3": "service.ultrasound",
      "choice.qq20261102a.b09.d1": null,
      "choice.qq20261102a.b09.d2": null
    },
    "choiceTimingOverrides": {
      "correct_3": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      },
      "choice.qq20261102a.b09.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b09.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pet_ct"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r2",
      "whatChanged": "Supply raw cytology and the actual scope of prior imaging; replace scintigraphy with a same-purpose regional staging competitor and parallelize all protocols. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B09",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: All options describe a regional nodal survey at identical scope. Prior imaging scope is supplied because it changes the stage of workup, not to announce that the keyed modality is unavailable or needed. Supply raw cytology and the actual scope of prior imaging; replace scintigraphy with a same-purpose regional staging competitor and parallelize all protocols. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "fairness 2: The record does not contain a regional survey or features establishing a special extensive-disease CT indication; standard initial cervical ultrasound is the best offered plan. Review boundary: Melissa must verify the cytologic interpretation and that the palpable-node description does not call for a more specific immediate sampling plan.",
          "fairness 3: Require: Interpret the cytologic nuclear/architectural findings rather than being told the tumor type. Then Distinguish limited procedure images from preoperative regional assessment and select its initial modality. The closest error is: Choosing CT to map any palpable lateral node, or advanced metabolic imaging for every malignancy, are credible staging errors."
        ],
        "suggestions": [
          "suggestions 1: The record does not contain a regional survey or features establishing a special extensive-disease CT indication; standard initial cervical ultrasound is the best offered plan. Review boundary: Melissa must verify the cytologic interpretation and that the palpable-node description does not call for a more specific immediate sampling plan.",
          "suggestions 2: Supply raw cytology and the actual scope of prior imaging; replace scintigraphy with a same-purpose regional staging competitor and parallelize all protocols. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "suggestions 3: All options describe a regional nodal survey at identical scope. Prior imaging scope is supplied because it changes the stage of workup, not to announce that the keyed modality is unavailable or needed. Supply raw cytology and the actual scope of prior imaging; replace scintigraphy with a same-purpose regional staging competitor and parallelize all protocols. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting."
        ]
      },
      "selfCheck": {
        "cueAttack": "All options describe a regional nodal survey at identical scope. Prior imaging scope is supplied because it changes the stage of workup, not to announce that the keyed modality is unavailable or needed.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the cytologic nuclear/architectural findings rather than being told the tumor type.",
          "Distinguish limited procedure images from preoperative regional assessment and select its initial modality."
        ],
        "oneBestAnswer": "The record does not contain a regional survey or features establishing a special extensive-disease CT indication; standard initial cervical ultrasound is the best offered plan.",
        "closestDistractor": "Choosing CT to map any palpable lateral node, or advanced metabolic imaging for every malignancy, are credible staging errors.",
        "remainingReview": "Melissa must verify the cytologic interpretation and that the palpable-node description does not call for a more specific immediate sampling plan."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r3",
      "conceptId": "concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound",
      "stem": "Which regional imaging plan should be obtained before {patientName}'s operation?",
      "answerChoices": [
        {
          "id": "correct_3",
          "label": "Neck ultrasound surveying central and lateral nodal compartments",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the follicular-cell malignancy pattern with the missing regional assessment; ultrasound supplies the initial compartment survey and can direct further sampling."
        },
        {
          "id": "choice.qq20261102a.b09.d1",
          "label": "Contrast neck CT surveying central and lateral nodal compartments",
          "isCorrect": false,
          "distractorRationale": "Is a useful adjunct for selected extensive or invasive disease, rather than the initial replacement for the routine sonographic compartment assessment here."
        },
        {
          "id": "choice.qq20261102a.b09.d2",
          "label": "FDG PET-CT surveying central and lateral nodal compartments",
          "isCorrect": false,
          "distractorRationale": "Mistakes an advanced metabolic examination for the initial regional mapping study in this newly evaluated differentiated thyroid malignancy."
        }
      ],
      "explanation": "The cytology supports papillary thyroid carcinoma. Initial preoperative cervical ultrasound evaluates the primary and regional nodal compartments; cross-sectional or metabolic imaging has additional indications, not an automatic first role from this record.",
      "supportingEvidenceClaimIds": [
        "claim.dtc.preop-ultrasound",
        "claim.qq20261102a.papillary-cytology-regional-survey",
        "claim.qq20261102a.papillary-cytology-pattern"
      ],
      "teachingPoint": "The cytology supports papillary thyroid carcinoma. Initial preoperative cervical ultrasound evaluates the primary and regional nodal compartments; cross-sectional or metabolic imaging has additional indications, not an automatic first role from this record."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after a thyroid aspiration. The report describes papillary cell groups, nuclear grooves and intranuclear cytoplasmic inclusions. The procedure images document the thyroid nodule and needle position. A mobile node is palpable in the lateral neck; no regional nodal survey is documented.",
    "previousPresentation": "{patientName}, a 43-year-old woman, visits the clinic after thyroid FNA identifies papillary carcinoma. A mobile lateral-neck node is palpable.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.43",
        "presentation": "{patientName}, a 43-year-old woman, visits the clinic after thyroid FNA identifies papillary carcinoma. A mobile lateral-neck node is palpable."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.43",
        "presentation": "{patientName}, a 43-year-old man, visits the clinic after thyroid FNA identifies papillary carcinoma. A mobile lateral-neck node is palpable."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.68",
        "presentation": "{patientName}, a 68-year-old woman, visits the clinic after thyroid FNA identifies papillary carcinoma. A mobile lateral-neck node is palpable."
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.68",
        "presentation": "{patientName}, a 68-year-old man, visits the clinic after thyroid FNA identifies papillary carcinoma. A mobile lateral-neck node is palpable."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.gs028b.differentiated-thyroid-cancer.a-palpable-node",
        "patientPresentationVariantId": "presentation.gs028b.differentiated-thyroid-cancer.a-palpable-node",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic after thyroid FNA identifies papillary carcinoma. A mobile lateral-neck node is palpable.",
        "revisedFields": [
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.43",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.43",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic after thyroid FNA identifies papillary carcinoma. A mobile lateral-neck node is palpable.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.43",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.43",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 43-year-old man, visits the clinic after thyroid FNA identifies papillary carcinoma. A mobile lateral-neck node is palpable.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.68",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.68",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 68-year-old woman, visits the clinic after thyroid FNA identifies papillary carcinoma. A mobile lateral-neck node is palpable.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.68",
            "approvedInstantiationProfileId": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.68",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 68-year-old man, visits the clinic after thyroid FNA identifies papillary carcinoma. A mobile lateral-neck node is palpable.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "chiefComplaint": "Neck lump review",
    "previousChiefComplaint": "Thyroid cancer neck node",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.43"
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.43"
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.female.68"
      },
      {
        "id": "profile.gs028b.differentiated-thyroid-cancer.a-palpable-node.male.68"
      }
    ]
  },
  {
    "id": "revision.qq20261102a.b10",
    "auditId": "B10",
    "caseId": "case.gs028.stoma-prolapse.b-obstructed-prolapse",
    "nodeId": "node.gs028.stoma-prolapse.b-obstructed-prolapse.1",
    "previousQuestionVariantId": "question.stoma-prolapse.urgent-surgical-escalation.v4.r2",
    "questionVariantId": "question.stoma-prolapse.urgent-surgical-escalation.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which disposition should be arranged for {patientName}'s stoma problem?",
    "previousChoiceLabels": [
      "Emergency surgical assessment",
      "Expedited outpatient colorectal assessment",
      "Routine outpatient ostomy assessment"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "foundational_safety",
    "intendedInference": "Integrate output, vomiting and reducibility with the apparently reassuring color. Then Select acute assessment/support rather than a conservative-reduction pathway intended for a different presentation.",
    "reviewerNotes": "This remains a safety-critical disposition concept and may be easier for senior residents. Hardness never justifies suppressing obstruction signs or claiming color proves ischemia.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_4": "correct_4",
      "choice.qq20261102a.b10.d1": "choice.qq20261102.b10.d1",
      "choice.qq20261102a.b10.d2": "choice.qq20261102.b10.d2"
    },
    "choiceServiceOverrides": {
      "correct_4": null,
      "choice.qq20261102a.b10.d1": null,
      "choice.qq20261102a.b10.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.stoma-prolapse.urgent-surgical-escalation.v4.r2",
      "whatChanged": "Preserve warning signs and compare concrete assessment versus reduction strategies; no routine or emergency adjective uniquely selects the key.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B10",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Retain all safety findings. Replace urgency-word sorting and a routine-follow-up filler with actual management strategies a resident might consider.",
          "cues 2: Retain all safety findings. Replace urgency-word sorting and a routine-follow-up filler with actual management strategies a resident might consider."
        ],
        "fairness": [
          "fairness 1: The combined obstructive/nonreducible presentation requires acute surgical assessment rather than an outpatient reduction plan. Review boundary: This remains a safety-critical disposition concept and may be easier for senior residents. Hardness never justifies suppressing obstruction signs or claiming color proves ischemia.",
          "fairness 2: Retain decision-critical urgency signs and explicitly label this a foundational safety exception for manager/clinical review; do not claim resident difficulty.",
          "fairness 3: The combined obstructive/nonreducible presentation requires acute surgical assessment rather than an outpatient reduction plan."
        ],
        "suggestions": [
          "suggestions 1: Preserve warning signs and compare concrete assessment versus reduction strategies; no routine or emergency adjective uniquely selects the key.",
          "suggestions 2: Retain decision-critical urgency signs and explicitly label this a foundational safety exception for manager/clinical review; do not claim resident difficulty."
        ]
      },
      "selfCheck": {
        "cueAttack": "Retain all safety findings. Replace urgency-word sorting and a routine-follow-up filler with actual management strategies a resident might consider.",
        "difficulty": "foundational",
        "reasoningSteps": [
          "Integrate output, vomiting and reducibility with the apparently reassuring color.",
          "Select acute assessment/support rather than a conservative-reduction pathway intended for a different presentation."
        ],
        "oneBestAnswer": "The combined obstructive/nonreducible presentation requires acute surgical assessment rather than an outpatient reduction plan.",
        "closestDistractor": "Applying osmotic reduction to a red, apparently viable stoma despite obstructive symptoms is plausible.",
        "remainingReview": "This remains a safety-critical disposition concept and may be easier for senior residents. Hardness never justifies suppressing obstruction signs or claiming color proves ischemia."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.stoma-prolapse.urgent-surgical-escalation.v4.r3",
      "conceptId": "concept.stoma-prolapse.urgent-surgical-escalation",
      "stem": "Which management plan should be initiated for {patientName}'s stoma problem?",
      "answerChoices": [
        {
          "id": "correct_4",
          "label": "Hospital surgical assessment with intravenous resuscitation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the obstructive symptoms and nonreduction; visible red bowel does not establish an uncomplicated prolapse."
        },
        {
          "id": "choice.qq20261102a.b10.d1",
          "label": "Osmotic stoma reduction with supervised outpatient reassessment",
          "isCorrect": false,
          "distractorRationale": "Applies a conservative uncomplicated-prolapse strategy to a presentation with obstructive symptoms."
        },
        {
          "id": "choice.qq20261102a.b10.d2",
          "label": "Sedated manual reduction with supervised outpatient reassessment",
          "isCorrect": false,
          "distractorRationale": "Focuses on achieving reduction without first addressing the concerning obstruction/acute surgical assessment requirement."
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
    "id": "revision.qq20261102a.b11",
    "auditId": "B11",
    "caseId": "case.pigmented-skin-lesion.shoulder-border",
    "nodeId": "node.pigmented-skin-lesion.shoulder-border.2",
    "previousQuestionVariantId": "question.melanoma.sentinel-node-staging.v2.r2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which regional-node plan should accompany {patientName}'s melanoma excision?",
    "previousChoiceLabels": [
      "Sentinel lymph-node biopsy",
      "Lymph-node ultrasound surveillance",
      "Complete lymph-node dissection"
    ],
    "previousCurrentUpdate": "Histology identifies invasive melanoma with Breslow thickness 1.6 mm. No enlarged nodes are felt in the draining basin.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling.",
    "reviewerNotes": "Melissa must verify histologic wording, nodal imaging interpretation and the exact consent/operative plan. Existing primary thickness values are retained, not shifted to create difficulty.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sentinel_node_2": "sentinel_node_2",
      "choice.qq20261102a.b11.d1": "choice.qq20261102.b11.d1",
      "choice.qq20261102a.b11.d2": "choice.qq20261102.b11.d2"
    },
    "choiceServiceOverrides": {
      "sentinel_node_2": null,
      "choice.qq20261102a.b11.d1": null,
      "choice.qq20261102a.b11.d2": null
    },
    "choiceTimingOverrides": {
      "sentinel_node_2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102a.b11.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102a.b11.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "currentUpdate": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.6 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.melanoma.sentinel-node-staging.v2.r2",
      "whatChanged": "Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B11",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies. Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
          "cues 2: There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies. Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error."
        ],
        "fairness": [
          "fairness 1: There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies. Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
          "fairness 2: Require: Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling. The closest error is: Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error.",
          "fairness 3: The measured invasive primary and clinically uninvolved basin support sentinel staging; normal-appearing nodes do not establish microscopic node negativity. Review boundary: Melissa must verify histologic wording, nodal imaging interpretation and the exact consent/operative plan. Existing primary thickness values are retained, not shifted to create difficulty."
        ],
        "suggestions": [
          "suggestions 1: Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
          "suggestions 2: Require: Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling. The closest error is: Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error.",
          "suggestions 3: Require: Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling. The closest error is: Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error."
        ]
      },
      "selfCheck": {
        "cueAttack": "There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label.",
          "Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling."
        ],
        "oneBestAnswer": "The measured invasive primary and clinically uninvolved basin support sentinel staging; normal-appearing nodes do not establish microscopic node negativity.",
        "closestDistractor": "Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error.",
        "remainingReview": "Melissa must verify histologic wording, nodal imaging interpretation and the exact consent/operative plan. Existing primary thickness values are retained, not shifted to create difficulty."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.melanoma.sentinel-node-staging.v2.r3",
      "conceptId": "concept.melanoma.sentinel-node-staging",
      "stem": "Which regional-node plan should accompany {patientName}'s further excision planning?",
      "answerChoices": [
        {
          "id": "sentinel_node_2",
          "label": "Sentinel lymph node mapping and biopsy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Interprets the primary depth and clinically uninvolved basin, rather than treating reassuring node imaging as exclusion of microscopic involvement."
        },
        {
          "id": "choice.qq20261102a.b11.d1",
          "label": "Ultrasound-guided biopsy of an imaged regional node",
          "isCorrect": false,
          "distractorRationale": "Confuses size-selected sampling of a nonsuspicious visible node with mapping the sentinel drainage of the primary lesion."
        },
        {
          "id": "choice.qq20261102a.b11.d2",
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
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A flat asymmetric pigmented area contains a newly raised focus.",
    "previousPresentation": "{patientName}, a 58-year-old woman, visits the clinic with a changing pigmented lesion on the shoulder. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
    "previousProfilePresentations": [
      {
        "id": "profile.pigmented-skin-lesion.shoulder-border.female.58",
        "presentation": "{patientName}, a 58-year-old woman, visits the clinic with a changing pigmented lesion on the shoulder. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      },
      {
        "id": "profile.pigmented-skin-lesion.shoulder-border.male.58",
        "presentation": "{patientName}, a 58-year-old man, visits the clinic with a changing pigmented lesion on the shoulder. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      },
      {
        "id": "profile.pigmented-skin-lesion.shoulder-border.female.63",
        "presentation": "{patientName}, a 63-year-old woman, visits the clinic with a changing pigmented lesion on the shoulder. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      },
      {
        "id": "profile.pigmented-skin-lesion.shoulder-border.male.63",
        "presentation": "{patientName}, a 63-year-old man, visits the clinic with a changing pigmented lesion on the shoulder. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.pigmented-skin-lesion.shoulder-border",
        "patientPresentationVariantId": "presentation.pigmented-skin-lesion.shoulder-border",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Changing skin spot",
        "revisedPresentation": "{patientName}, a 58-year-old woman, visits the clinic with a changing pigmented lesion on the shoulder. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.shoulder-border.female.58",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.shoulder-border.female.58",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 58-year-old woman, visits the clinic with a changing pigmented lesion on the shoulder. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.shoulder-border.male.58",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.shoulder-border.male.58",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 58-year-old man, visits the clinic with a changing pigmented lesion on the shoulder. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.shoulder-border.female.63",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.shoulder-border.female.63",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 63-year-old woman, visits the clinic with a changing pigmented lesion on the shoulder. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.shoulder-border.male.63",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.shoulder-border.male.63",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 63-year-old man, visits the clinic with a changing pigmented lesion on the shoulder. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b11-context",
    "auditId": "B11-context",
    "caseId": "case.pigmented-skin-lesion.shoulder-border",
    "nodeId": "node.pigmented-skin-lesion.shoulder-border.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r2",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which biopsy approach should be arranged for {patientName}'s changing pigmented lesion?",
    "previousChoiceLabels": [
      "Complete excisional biopsy",
      "Superficial shave biopsy",
      "Partial punch biopsy",
      "Definitive wide local excision"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Recognize that the changing lesion contains clinically heterogeneous components. Then Compare sampling extent and depth rather than choosing an option merely called complete.",
    "reviewerNotes": "Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_2": "excisional_2",
      "choice.qq20261102a.b11-context.d1": "superficial_shave_2",
      "choice.qq20261102a.b11-context.d2": "partial_punch_2"
    },
    "choiceServiceOverrides": {
      "excisional_2": "service.skin_excisional_biopsy",
      "choice.qq20261102a.b11-context.d1": null,
      "choice.qq20261102a.b11-context.d2": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r2",
      "whatChanged": "Introduce clinically relevant heterogeneity and neutral, parallel sampling plans; keep diagnosis and definitive therapy out of the lead-in/options.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B11-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "cues 2: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "cues 3: All options are procedural descriptions with comparable extent/depth detail. The value-laden complete/partial/superficial labels and a wrong-stage wide-excision filler are removed."
        ],
        "fairness": [
          "fairness 1: Require: Recognize that the changing lesion contains clinically heterogeneous components. Then Compare sampling extent and depth rather than choosing an option merely called complete. The closest error is: Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
          "fairness 2: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "fairness 3: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations.",
          "fairness 4: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision."
        ],
        "suggestions": [
          "suggestions 1: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "suggestions 2: Require: Recognize that the changing lesion contains clinically heterogeneous components. Then Compare sampling extent and depth rather than choosing an option merely called complete. The closest error is: Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
          "suggestions 3: Introduce clinically relevant heterogeneity and neutral, parallel sampling plans; keep diagnosis and definitive therapy out of the lead-in/options."
        ]
      },
      "selfCheck": {
        "cueAttack": "All options are procedural descriptions with comparable extent/depth detail. The value-laden complete/partial/superficial labels and a wrong-stage wide-excision filler are removed.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that the changing lesion contains clinically heterogeneous components.",
          "Compare sampling extent and depth rather than choosing an option merely called complete."
        ],
        "oneBestAnswer": "The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations.",
        "closestDistractor": "Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
        "remainingReview": "Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r3",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "stem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
      "answerChoices": [
        {
          "id": "excisional_2",
          "label": "Elliptical sampling of the lesion through the dermis into subcutaneous fat",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Captures the heterogeneous lesion and a depth adequate for microstaging without committing to definitive wide margins before diagnosis."
        },
        {
          "id": "choice.qq20261102a.b11-context.d1",
          "label": "Punch sampling of the darkest focus through the dermis into subcutaneous fat",
          "isCorrect": false,
          "distractorRationale": "Can provide depth but risks selecting an unrepresentative component of a small heterogeneous lesion that can be sampled in its entirety."
        },
        {
          "id": "choice.qq20261102a.b11-context.d2",
          "label": "Tangential sampling of the lesion across its surface and papillary dermis",
          "isCorrect": false,
          "distractorRationale": "Captures surface extent but risks inadequate depth; this specific shallow plan is not a claim that every saucerization technique is inappropriate."
        }
      ],
      "explanation": "Diagnostic sampling must permit assessment of the heterogeneous lesion and its depth. A narrow diagnostic excision is distinct from the later definitive excision plan; a shallow surface specimen or a selected focus may compromise microstaging.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling"
      ],
      "teachingPoint": "Diagnostic sampling must permit assessment of the heterogeneous lesion and its depth. A narrow diagnostic excision is distinct from the later definitive excision plan; a shallow surface specimen or a selected focus may compromise microstaging."
    },
    "previousResultNarrative": "Histology identifies invasive melanoma with Breslow thickness 1.6 mm. No enlarged nodes are felt in the draining basin.",
    "resultNarrative": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.6 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes."
  },
  {
    "id": "revision.qq20261102a.b12",
    "auditId": "B12",
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.2",
    "previousQuestionVariantId": "question.melanoma.sentinel-node-staging.v4.r2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which regional-node plan should accompany {patientName}'s melanoma excision?",
    "previousChoiceLabels": [
      "Sentinel lymph-node biopsy",
      "Lymph-node ultrasound surveillance",
      "Complete lymph-node dissection"
    ],
    "previousCurrentUpdate": "Histology identifies invasive melanoma with Breslow thickness 1.5 mm. No enlarged nodes are felt in the draining basin.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling.",
    "reviewerNotes": "Melissa must verify histologic wording, nodal imaging interpretation and the exact consent/operative plan. Existing primary thickness values are retained, not shifted to create difficulty.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sentinel_node_4": "sentinel_node_4",
      "choice.qq20261102a.b12.d1": "choice.qq20261102.b12.d1",
      "choice.qq20261102a.b12.d2": "choice.qq20261102.b12.d2"
    },
    "choiceServiceOverrides": {
      "sentinel_node_4": null,
      "choice.qq20261102a.b12.d1": null,
      "choice.qq20261102a.b12.d2": null
    },
    "choiceTimingOverrides": {
      "sentinel_node_4": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102a.b12.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102a.b12.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "currentUpdate": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.5 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.melanoma.sentinel-node-staging.v4.r2",
      "whatChanged": "Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B12",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies. Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
          "cues 2: There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies. Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error."
        ],
        "fairness": [
          "fairness 1: There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies. Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
          "fairness 2: Require: Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling. The closest error is: Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error.",
          "fairness 3: The measured invasive primary and clinically uninvolved basin support sentinel staging; normal-appearing nodes do not establish microscopic node negativity. Review boundary: Melissa must verify histologic wording, nodal imaging interpretation and the exact consent/operative plan. Existing primary thickness values are retained, not shifted to create difficulty."
        ],
        "suggestions": [
          "suggestions 1: Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
          "suggestions 2: Require: Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling. The closest error is: Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error.",
          "suggestions 3: Require: Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling. The closest error is: Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error."
        ]
      },
      "selfCheck": {
        "cueAttack": "There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label.",
          "Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling."
        ],
        "oneBestAnswer": "The measured invasive primary and clinically uninvolved basin support sentinel staging; normal-appearing nodes do not establish microscopic node negativity.",
        "closestDistractor": "Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error.",
        "remainingReview": "Melissa must verify histologic wording, nodal imaging interpretation and the exact consent/operative plan. Existing primary thickness values are retained, not shifted to create difficulty."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.melanoma.sentinel-node-staging.v4.r3",
      "conceptId": "concept.melanoma.sentinel-node-staging",
      "stem": "Which regional-node plan should accompany {patientName}'s further excision planning?",
      "answerChoices": [
        {
          "id": "sentinel_node_4",
          "label": "Sentinel lymph node mapping and biopsy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Interprets the primary depth and clinically uninvolved basin, rather than treating reassuring node imaging as exclusion of microscopic involvement."
        },
        {
          "id": "choice.qq20261102a.b12.d1",
          "label": "Ultrasound-guided biopsy of an imaged regional node",
          "isCorrect": false,
          "distractorRationale": "Confuses size-selected sampling of a nonsuspicious visible node with mapping the sentinel drainage of the primary lesion."
        },
        {
          "id": "choice.qq20261102a.b12.d2",
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
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with a changing pigmented skin lesion on an accessible limb site. Two areas have different colors and an irregular border; the darker focus is not the thickest-looking focus.",
    "previousPresentation": "{patientName}, a 67-year-old woman, visits the clinic with a changing pigmented lesion on the forearm. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
    "previousProfilePresentations": [
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.female.67",
        "presentation": "{patientName}, a 67-year-old woman, visits the clinic with a changing pigmented lesion on the forearm. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      },
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.male.67",
        "presentation": "{patientName}, a 67-year-old man, visits the clinic with a changing pigmented lesion on the forearm. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      },
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.female.72",
        "presentation": "{patientName}, a 72-year-old woman, visits the clinic with a changing pigmented lesion on the forearm. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      },
      {
        "id": "profile.pigmented-skin-lesion.forearm-change.male.72",
        "presentation": "{patientName}, a 72-year-old man, visits the clinic with a changing pigmented lesion on the forearm. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.pigmented-skin-lesion.forearm-change",
        "patientPresentationVariantId": "presentation.pigmented-skin-lesion.forearm-change",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Changing skin spot",
        "revisedPresentation": "{patientName}, a 67-year-old woman, visits the clinic with a changing pigmented lesion on the forearm. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.forearm-change.female.67",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.forearm-change.female.67",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 67-year-old woman, visits the clinic with a changing pigmented lesion on the forearm. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.forearm-change.male.67",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.forearm-change.male.67",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 67-year-old man, visits the clinic with a changing pigmented lesion on the forearm. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.forearm-change.female.72",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.forearm-change.female.72",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 72-year-old woman, visits the clinic with a changing pigmented lesion on the forearm. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.forearm-change.male.72",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.forearm-change.male.72",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 72-year-old man, visits the clinic with a changing pigmented lesion on the forearm. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b12-context",
    "auditId": "B12-context",
    "caseId": "case.pigmented-skin-lesion.forearm-change",
    "nodeId": "node.pigmented-skin-lesion.forearm-change.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r2",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which biopsy approach should be arranged for {patientName}'s changing pigmented lesion?",
    "previousChoiceLabels": [
      "Complete excisional biopsy",
      "Superficial shave biopsy",
      "Partial punch biopsy",
      "Definitive wide local excision"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Recognize that the changing lesion contains clinically heterogeneous components. Then Compare sampling extent and depth rather than choosing an option merely called complete.",
    "reviewerNotes": "Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_4": "excisional_4",
      "choice.qq20261102a.b12-context.d1": "superficial_shave_4",
      "choice.qq20261102a.b12-context.d2": "partial_punch_4"
    },
    "choiceServiceOverrides": {
      "excisional_4": "service.skin_excisional_biopsy",
      "choice.qq20261102a.b12-context.d1": null,
      "choice.qq20261102a.b12-context.d2": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r2",
      "whatChanged": "Introduce clinically relevant heterogeneity and neutral, parallel sampling plans; keep diagnosis and definitive therapy out of the lead-in/options.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B12-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "cues 2: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "cues 3: All options are procedural descriptions with comparable extent/depth detail. The value-laden complete/partial/superficial labels and a wrong-stage wide-excision filler are removed."
        ],
        "fairness": [
          "fairness 1: Require: Recognize that the changing lesion contains clinically heterogeneous components. Then Compare sampling extent and depth rather than choosing an option merely called complete. The closest error is: Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
          "fairness 2: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "fairness 3: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations.",
          "fairness 4: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision."
        ],
        "suggestions": [
          "suggestions 1: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "suggestions 2: Require: Recognize that the changing lesion contains clinically heterogeneous components. Then Compare sampling extent and depth rather than choosing an option merely called complete. The closest error is: Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
          "suggestions 3: Introduce clinically relevant heterogeneity and neutral, parallel sampling plans; keep diagnosis and definitive therapy out of the lead-in/options."
        ]
      },
      "selfCheck": {
        "cueAttack": "All options are procedural descriptions with comparable extent/depth detail. The value-laden complete/partial/superficial labels and a wrong-stage wide-excision filler are removed.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that the changing lesion contains clinically heterogeneous components.",
          "Compare sampling extent and depth rather than choosing an option merely called complete."
        ],
        "oneBestAnswer": "The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations.",
        "closestDistractor": "Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
        "remainingReview": "Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r3",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "stem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
      "answerChoices": [
        {
          "id": "excisional_4",
          "label": "Elliptical sampling of the lesion through the dermis into subcutaneous fat",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Captures the heterogeneous lesion and a depth adequate for microstaging without committing to definitive wide margins before diagnosis."
        },
        {
          "id": "choice.qq20261102a.b12-context.d1",
          "label": "Punch sampling of the darkest focus through the dermis into subcutaneous fat",
          "isCorrect": false,
          "distractorRationale": "Can provide depth but risks selecting an unrepresentative component of a small heterogeneous lesion that can be sampled in its entirety."
        },
        {
          "id": "choice.qq20261102a.b12-context.d2",
          "label": "Tangential sampling of the lesion across its surface and papillary dermis",
          "isCorrect": false,
          "distractorRationale": "Captures surface extent but risks inadequate depth; this specific shallow plan is not a claim that every saucerization technique is inappropriate."
        }
      ],
      "explanation": "Diagnostic sampling must permit assessment of the heterogeneous lesion and its depth. A narrow diagnostic excision is distinct from the later definitive excision plan; a shallow surface specimen or a selected focus may compromise microstaging.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling"
      ],
      "teachingPoint": "Diagnostic sampling must permit assessment of the heterogeneous lesion and its depth. A narrow diagnostic excision is distinct from the later definitive excision plan; a shallow surface specimen or a selected focus may compromise microstaging."
    },
    "previousResultNarrative": "Histology identifies invasive melanoma with Breslow thickness 1.5 mm. No enlarged nodes are felt in the draining basin.",
    "resultNarrative": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.5 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes."
  },
  {
    "id": "revision.qq20261102a.b13",
    "auditId": "B13",
    "caseId": "case.colon-cancer.right-colon-referral",
    "nodeId": "node.colon-cancer.right-colon-referral.2",
    "previousQuestionVariantId": "question.colon-cancer.oncologic-regional-resection.v1.r2",
    "questionVariantId": "question.colon-cancer.oncologic-regional-resection.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which operative plan should be recommended for {patientName}'s colon cancer?",
    "previousChoiceLabels": [
      "Segmental colectomy with lymphadenectomy",
      "Local full-thickness excision of the tumour",
      "Total abdominal colectomy with lymphadenectomy"
    ],
    "previousCurrentUpdate": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature. Then Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT.",
    "reviewerNotes": "Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "regional_resection_1": "regional_resection_1",
      "choice.qq20261102a.b13.d1": "choice.qq20261102.b13.d1",
      "choice.qq20261102a.b13.d2": "choice.qq20261102.b13.d2"
    },
    "choiceServiceOverrides": {
      "regional_resection_1": null,
      "choice.qq20261102a.b13.d1": null,
      "choice.qq20261102a.b13.d2": null
    },
    "currentUpdate": "Staging CT shows no distant deposits and no enlarged regional nodes.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colon-cancer.oncologic-regional-resection.v1.r2",
      "whatChanged": "Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B13",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The particular adverse histology makes local scar treatment/surveillance inadequate substitutes for regional oncologic planning in the represented operable patient. Review boundary: Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted."
        ],
        "fairness": [
          "fairness 1: All choices address the post-polypectomy site; the least/middle/total-colectomy extent heuristic is removed. The normal-node result probes a misconception rather than excluding every competitor. Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "fairness 2: All choices address the post-polypectomy site; the least/middle/total-colectomy extent heuristic is removed. The normal-node result probes a misconception rather than excluding every competitor. Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "fairness 3: Require: Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature. Then Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT. The closest error is: Assuming an endoscopically clear scar plus negative CT permits a local completion procedure is credible."
        ],
        "suggestions": [
          "suggestions 1: The particular adverse histology makes local scar treatment/surveillance inadequate substitutes for regional oncologic planning in the represented operable patient. Review boundary: Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted.",
          "suggestions 2: Require: Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature. Then Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT. The closest error is: Assuming an endoscopically clear scar plus negative CT permits a local completion procedure is credible.",
          "suggestions 3: Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting."
        ]
      },
      "selfCheck": {
        "cueAttack": "All choices address the post-polypectomy site; the least/middle/total-colectomy extent heuristic is removed. The normal-node result probes a misconception rather than excluding every competitor.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature.",
          "Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT."
        ],
        "oneBestAnswer": "The particular adverse histology makes local scar treatment/surveillance inadequate substitutes for regional oncologic planning in the represented operable patient.",
        "closestDistractor": "Assuming an endoscopically clear scar plus negative CT permits a local completion procedure is credible.",
        "remainingReview": "Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.oncologic-regional-resection.v1.r3",
      "conceptId": "concept.colon-cancer.oncologic-regional-resection",
      "stem": "Which treatment plan should be discussed for {patientName}'s resection site?",
      "answerChoices": [
        {
          "id": "regional_resection_1",
          "label": "Segmental colectomy with removal of the draining mesentery",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Interprets the adverse invasive-polyp feature and recognizes a regional-node risk that a clear-looking scar or negative CT cannot remove."
        },
        {
          "id": "choice.qq20261102a.b13.d1",
          "label": "Endoscopic full-thickness excision centered on the resection scar",
          "isCorrect": false,
          "distractorRationale": "Addresses potential local residual disease but does not provide regional nodal treatment/staging for this adverse histology."
        },
        {
          "id": "choice.qq20261102a.b13.d2",
          "label": "Endoscopic scar surveillance with repeat targeted tissue sampling",
          "isCorrect": false,
          "distractorRationale": "Overweights endoscopic/CT reassurance and does not address the adverse histologic feature that changes the adequacy of polypectomy."
        }
      ],
      "explanation": "An endoscopically removed malignant polyp is not automatically cured by a clear-looking scar. The supplied adverse invasive feature supports discussion of oncologic resection with the regional mesentery. CT-negative nodes do not exclude microscopic disease. Exact bowel extent, especially for a transverse lesion, remains an anatomic operative decision.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.oncologic-regional-resection",
        "claim.qq20261102a.malignant-polyp-adverse-features"
      ],
      "teachingPoint": "An endoscopically removed malignant polyp is not automatically cured by a clear-looking scar. The supplied adverse invasive feature supports discussion of oncologic resection with the regional mesentery. CT-negative nodes do not exclude microscopic disease. Exact bowel extent, especially for a transverse lesion, remains an anatomic operative decision."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after endoscopic removal of a polyp in the ascending colon. The site now appears as a scar. Irregular malignant glands enter a thin endothelial-lined space beyond the muscularis mucosae.",
    "previousPresentation": "{patientName}, a 57-year-old woman, visits the clinic after colonoscopy finds a mass in the ascending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
    "previousProfilePresentations": [
      {
        "id": "profile.colon-cancer.right-colon-referral.female.57",
        "presentation": "{patientName}, a 57-year-old woman, visits the clinic after colonoscopy finds a mass in the ascending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      },
      {
        "id": "profile.colon-cancer.right-colon-referral.male.57",
        "presentation": "{patientName}, a 57-year-old man, visits the clinic after colonoscopy finds a mass in the ascending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      },
      {
        "id": "profile.colon-cancer.right-colon-referral.female.61",
        "presentation": "{patientName}, a 61-year-old woman, visits the clinic after colonoscopy finds a mass in the ascending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      },
      {
        "id": "profile.colon-cancer.right-colon-referral.male.61",
        "presentation": "{patientName}, a 61-year-old man, visits the clinic after colonoscopy finds a mass in the ascending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.colon-cancer.right-colon-referral",
        "patientPresentationVariantId": "presentation.colon-cancer.right-colon-referral",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Colon cancer consultation",
        "revisedPresentation": "{patientName}, a 57-year-old woman, visits the clinic after colonoscopy finds a mass in the ascending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.colon-cancer.right-colon-referral.female.57",
            "approvedInstantiationProfileId": "profile.colon-cancer.right-colon-referral.female.57",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 57-year-old woman, visits the clinic after colonoscopy finds a mass in the ascending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.colon-cancer.right-colon-referral.male.57",
            "approvedInstantiationProfileId": "profile.colon-cancer.right-colon-referral.male.57",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 57-year-old man, visits the clinic after colonoscopy finds a mass in the ascending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.colon-cancer.right-colon-referral.female.61",
            "approvedInstantiationProfileId": "profile.colon-cancer.right-colon-referral.female.61",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 61-year-old woman, visits the clinic after colonoscopy finds a mass in the ascending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.colon-cancer.right-colon-referral.male.61",
            "approvedInstantiationProfileId": "profile.colon-cancer.right-colon-referral.male.61",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 61-year-old man, visits the clinic after colonoscopy finds a mass in the ascending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
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
        "ageYears": 57,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "chiefComplaint": "Polyp pathology review",
    "previousChiefComplaint": "Colon cancer consultation",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.colon-cancer.right-colon-referral.female.57"
      },
      {
        "id": "profile.colon-cancer.right-colon-referral.male.57"
      },
      {
        "id": "profile.colon-cancer.right-colon-referral.female.61"
      },
      {
        "id": "profile.colon-cancer.right-colon-referral.male.61"
      }
    ]
  },
  {
    "id": "revision.qq20261102a.b13-context",
    "auditId": "B13-context",
    "caseId": "case.colon-cancer.right-colon-referral",
    "nodeId": "node.colon-cancer.right-colon-referral.1",
    "previousQuestionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v1.r2",
    "questionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which staging study should be obtained before treatment planning for {patientName}'s colon cancer?",
    "previousChoiceLabels": [
      "Contrast CT: chest, abdomen, pelvis",
      "Whole-body PET-CT for systemic staging",
      "Abdominal ultrasound",
      "Pelvic MRI alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Recognize that the removed polyp contains an invasive adverse feature rather than assuming polypectomy ended the evaluation. Then Compare complete systemic staging pathways, including the thoracic modality and the role of PET.",
    "reviewerNotes": "Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_cap_1": "ct_cap_1",
      "choice.qq20261102a.b13-context.d1": "pet_ct_1",
      "choice.qq20261102a.b13-context.d2": "abdominal_us_1"
    },
    "choiceServiceOverrides": {
      "ct_cap_1": "service.ct",
      "choice.qq20261102a.b13-context.d1": null,
      "choice.qq20261102a.b13-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_cap_1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b13-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b13-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pet_ct"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v1.r2",
      "whatChanged": "Make histology interpretation consequential and parallelize systemic staging coverage with credible modality/sequence errors.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B13-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: All options address thoracic and abdominal/pelvic staging. The 'pelvic MRI alone' and single-region ultrasound shortcuts are removed; no valid chest-CT/MRI pathway is mislabeled wrong.",
          "cues 2: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
          "cues 3: All options address thoracic and abdominal/pelvic staging. The 'pelvic MRI alone' and single-region ultrasound shortcuts are removed; no valid chest-CT/MRI pathway is mislabeled wrong."
        ],
        "fairness": [
          "fairness 1: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
          "fairness 2: Require: Recognize that the removed polyp contains an invasive adverse feature rather than assuming polypectomy ended the evaluation. Then Compare complete systemic staging pathways, including the thoracic modality and the role of PET. The closest error is: Selecting PET as automatically more complete, or carrying forward an older chest-radiograph pathway, is plausible.",
          "fairness 3: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging."
        ],
        "suggestions": [
          "suggestions 1: Make histology interpretation consequential and parallelize systemic staging coverage with credible modality/sequence errors.",
          "suggestions 2: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
          "suggestions 3: Make histology interpretation consequential and parallelize systemic staging coverage with credible modality/sequence errors."
        ]
      },
      "selfCheck": {
        "cueAttack": "All options address thoracic and abdominal/pelvic staging. The 'pelvic MRI alone' and single-region ultrasound shortcuts are removed; no valid chest-CT/MRI pathway is mislabeled wrong.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that the removed polyp contains an invasive adverse feature rather than assuming polypectomy ended the evaluation.",
          "Compare complete systemic staging pathways, including the thoracic modality and the role of PET."
        ],
        "oneBestAnswer": "The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT.",
        "closestDistractor": "Selecting PET as automatically more complete, or carrying forward an older chest-radiograph pathway, is plausible.",
        "remainingReview": "Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.preoperative-cross-sectional-staging.v1.r3",
      "conceptId": "concept.colon-cancer.preoperative-cross-sectional-staging",
      "stem": "Which staging pathway should precede further treatment planning for {patientName}?",
      "answerChoices": [
        {
          "id": "ct_cap_1",
          "label": "Chest CT with contrast-enhanced abdominal and pelvic CT",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides the conventional systemic staging pathway after recognition of invasive adverse polyp histology."
        },
        {
          "id": "choice.qq20261102a.b13-context.d1",
          "label": "Chest radiographs with contrast-enhanced abdominal and pelvic CT",
          "isCorrect": false,
          "distractorRationale": "Covers the same broad body regions but substitutes a less suitable thoracic examination for staging."
        },
        {
          "id": "choice.qq20261102a.b13-context.d2",
          "label": "Whole-body FDG PET-CT with regional anatomic review",
          "isCorrect": false,
          "distractorRationale": "Treats an advanced metabolic survey as the routine initial staging pathway, rather than reserving it for appropriate selected questions."
        }
      ],
      "explanation": "The pathology, not the scar's appearance, establishes the need for invasive-cancer staging. CT of the chest, abdomen and pelvis is a standard initial pathway. Chest radiography is not the equivalent thoracic assessment, and PET-CT is not routine initial staging. MRI-based alternatives can be appropriate in selected settings and are not falsely offered as invalid here.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.preoperative-cross-sectional-staging",
        "claim.qq20261102a.colon-systemic-staging"
      ],
      "teachingPoint": "The pathology, not the scar's appearance, establishes the need for invasive-cancer staging. CT of the chest, abdomen and pelvis is a standard initial pathway. Chest radiography is not the equivalent thoracic assessment, and PET-CT is not routine initial staging. MRI-based alternatives can be appropriate in selected settings and are not falsely offered as invalid here."
    },
    "previousResultNarrative": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "resultNarrative": "Staging CT shows no distant deposits and no enlarged regional nodes."
  },
  {
    "id": "revision.qq20261102a.b14",
    "auditId": "B14",
    "caseId": "case.colon-cancer.sigmoid-referral",
    "nodeId": "node.colon-cancer.sigmoid-referral.2",
    "previousQuestionVariantId": "question.colon-cancer.oncologic-regional-resection.v2.r2",
    "questionVariantId": "question.colon-cancer.oncologic-regional-resection.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which operative plan should be recommended for {patientName}'s colon cancer?",
    "previousChoiceLabels": [
      "Segmental colectomy with lymphadenectomy",
      "Local full-thickness excision of the tumour",
      "Total abdominal colectomy with lymphadenectomy"
    ],
    "previousCurrentUpdate": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature. Then Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT.",
    "reviewerNotes": "Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "regional_resection_2": "regional_resection_2",
      "choice.qq20261102a.b14.d1": "choice.qq20261102.b14.d1",
      "choice.qq20261102a.b14.d2": "choice.qq20261102.b14.d2"
    },
    "choiceServiceOverrides": {
      "regional_resection_2": null,
      "choice.qq20261102a.b14.d1": null,
      "choice.qq20261102a.b14.d2": null
    },
    "currentUpdate": "Staging CT shows no distant deposits and no enlarged regional nodes.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colon-cancer.oncologic-regional-resection.v2.r2",
      "whatChanged": "Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B14",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The particular adverse histology makes local scar treatment/surveillance inadequate substitutes for regional oncologic planning in the represented operable patient. Review boundary: Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted."
        ],
        "fairness": [
          "fairness 1: All choices address the post-polypectomy site; the least/middle/total-colectomy extent heuristic is removed. The normal-node result probes a misconception rather than excluding every competitor. Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "fairness 2: All choices address the post-polypectomy site; the least/middle/total-colectomy extent heuristic is removed. The normal-node result probes a misconception rather than excluding every competitor. Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "fairness 3: Require: Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature. Then Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT. The closest error is: Assuming an endoscopically clear scar plus negative CT permits a local completion procedure is credible."
        ],
        "suggestions": [
          "suggestions 1: The particular adverse histology makes local scar treatment/surveillance inadequate substitutes for regional oncologic planning in the represented operable patient. Review boundary: Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted.",
          "suggestions 2: Require: Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature. Then Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT. The closest error is: Assuming an endoscopically clear scar plus negative CT permits a local completion procedure is credible.",
          "suggestions 3: Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting."
        ]
      },
      "selfCheck": {
        "cueAttack": "All choices address the post-polypectomy site; the least/middle/total-colectomy extent heuristic is removed. The normal-node result probes a misconception rather than excluding every competitor.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature.",
          "Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT."
        ],
        "oneBestAnswer": "The particular adverse histology makes local scar treatment/surveillance inadequate substitutes for regional oncologic planning in the represented operable patient.",
        "closestDistractor": "Assuming an endoscopically clear scar plus negative CT permits a local completion procedure is credible.",
        "remainingReview": "Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.oncologic-regional-resection.v2.r3",
      "conceptId": "concept.colon-cancer.oncologic-regional-resection",
      "stem": "Which treatment plan should be discussed for {patientName}'s resection site?",
      "answerChoices": [
        {
          "id": "regional_resection_2",
          "label": "Segmental colectomy with removal of the draining mesentery",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Interprets the adverse invasive-polyp feature and recognizes a regional-node risk that a clear-looking scar or negative CT cannot remove."
        },
        {
          "id": "choice.qq20261102a.b14.d1",
          "label": "Endoscopic full-thickness excision centered on the resection scar",
          "isCorrect": false,
          "distractorRationale": "Addresses potential local residual disease but does not provide regional nodal treatment/staging for this adverse histology."
        },
        {
          "id": "choice.qq20261102a.b14.d2",
          "label": "Endoscopic scar surveillance with repeat targeted tissue sampling",
          "isCorrect": false,
          "distractorRationale": "Overweights endoscopic/CT reassurance and does not address the adverse histologic feature that changes the adequacy of polypectomy."
        }
      ],
      "explanation": "An endoscopically removed malignant polyp is not automatically cured by a clear-looking scar. The supplied adverse invasive feature supports discussion of oncologic resection with the regional mesentery. CT-negative nodes do not exclude microscopic disease. Exact bowel extent, especially for a transverse lesion, remains an anatomic operative decision.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.oncologic-regional-resection",
        "claim.qq20261102a.malignant-polyp-adverse-features"
      ],
      "teachingPoint": "An endoscopically removed malignant polyp is not automatically cured by a clear-looking scar. The supplied adverse invasive feature supports discussion of oncologic resection with the regional mesentery. CT-negative nodes do not exclude microscopic disease. Exact bowel extent, especially for a transverse lesion, remains an anatomic operative decision."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after endoscopic removal of a polyp in the sigmoid colon. The site now appears as a scar. Malignant cells below the muscularis mucosae form solid groups with very little gland formation.",
    "previousPresentation": "{patientName}, a 63-year-old woman, visits the clinic after colonoscopy finds a mass in the sigmoid colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
    "previousProfilePresentations": [
      {
        "id": "profile.colon-cancer.sigmoid-referral.female.63",
        "presentation": "{patientName}, a 63-year-old woman, visits the clinic after colonoscopy finds a mass in the sigmoid colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      },
      {
        "id": "profile.colon-cancer.sigmoid-referral.male.63",
        "presentation": "{patientName}, a 63-year-old man, visits the clinic after colonoscopy finds a mass in the sigmoid colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      },
      {
        "id": "profile.colon-cancer.sigmoid-referral.female.66",
        "presentation": "{patientName}, a 66-year-old woman, visits the clinic after colonoscopy finds a mass in the sigmoid colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      },
      {
        "id": "profile.colon-cancer.sigmoid-referral.male.66",
        "presentation": "{patientName}, a 66-year-old man, visits the clinic after colonoscopy finds a mass in the sigmoid colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.colon-cancer.sigmoid-referral",
        "patientPresentationVariantId": "presentation.colon-cancer.sigmoid-referral",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Colon cancer consultation",
        "revisedPresentation": "{patientName}, a 63-year-old woman, visits the clinic after colonoscopy finds a mass in the sigmoid colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.colon-cancer.sigmoid-referral.female.63",
            "approvedInstantiationProfileId": "profile.colon-cancer.sigmoid-referral.female.63",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 63-year-old woman, visits the clinic after colonoscopy finds a mass in the sigmoid colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.colon-cancer.sigmoid-referral.male.63",
            "approvedInstantiationProfileId": "profile.colon-cancer.sigmoid-referral.male.63",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 63-year-old man, visits the clinic after colonoscopy finds a mass in the sigmoid colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.colon-cancer.sigmoid-referral.female.66",
            "approvedInstantiationProfileId": "profile.colon-cancer.sigmoid-referral.female.66",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 66-year-old woman, visits the clinic after colonoscopy finds a mass in the sigmoid colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.colon-cancer.sigmoid-referral.male.66",
            "approvedInstantiationProfileId": "profile.colon-cancer.sigmoid-referral.male.66",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 66-year-old man, visits the clinic after colonoscopy finds a mass in the sigmoid colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "chiefComplaint": "Polyp pathology review",
    "previousChiefComplaint": "Colon cancer consultation",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.colon-cancer.sigmoid-referral.female.63"
      },
      {
        "id": "profile.colon-cancer.sigmoid-referral.male.63"
      },
      {
        "id": "profile.colon-cancer.sigmoid-referral.female.66"
      },
      {
        "id": "profile.colon-cancer.sigmoid-referral.male.66"
      }
    ]
  },
  {
    "id": "revision.qq20261102a.b14-context",
    "auditId": "B14-context",
    "caseId": "case.colon-cancer.sigmoid-referral",
    "nodeId": "node.colon-cancer.sigmoid-referral.1",
    "previousQuestionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v2.r2",
    "questionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which staging study should be obtained before treatment planning for {patientName}'s colon cancer?",
    "previousChoiceLabels": [
      "Contrast CT: chest, abdomen, pelvis",
      "Whole-body PET-CT for systemic staging",
      "Abdominal ultrasound",
      "Pelvic MRI alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Recognize that the removed polyp contains an invasive adverse feature rather than assuming polypectomy ended the evaluation. Then Compare complete systemic staging pathways, including the thoracic modality and the role of PET.",
    "reviewerNotes": "Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_cap_2": "ct_cap_2",
      "choice.qq20261102a.b14-context.d1": "pet_ct_2",
      "choice.qq20261102a.b14-context.d2": "abdominal_us_2"
    },
    "choiceServiceOverrides": {
      "ct_cap_2": "service.ct",
      "choice.qq20261102a.b14-context.d1": null,
      "choice.qq20261102a.b14-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_cap_2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b14-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b14-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pet_ct"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v2.r2",
      "whatChanged": "Make histology interpretation consequential and parallelize systemic staging coverage with credible modality/sequence errors.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B14-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: All options address thoracic and abdominal/pelvic staging. The 'pelvic MRI alone' and single-region ultrasound shortcuts are removed; no valid chest-CT/MRI pathway is mislabeled wrong.",
          "cues 2: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
          "cues 3: All options address thoracic and abdominal/pelvic staging. The 'pelvic MRI alone' and single-region ultrasound shortcuts are removed; no valid chest-CT/MRI pathway is mislabeled wrong."
        ],
        "fairness": [
          "fairness 1: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
          "fairness 2: Require: Recognize that the removed polyp contains an invasive adverse feature rather than assuming polypectomy ended the evaluation. Then Compare complete systemic staging pathways, including the thoracic modality and the role of PET. The closest error is: Selecting PET as automatically more complete, or carrying forward an older chest-radiograph pathway, is plausible.",
          "fairness 3: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging."
        ],
        "suggestions": [
          "suggestions 1: Make histology interpretation consequential and parallelize systemic staging coverage with credible modality/sequence errors.",
          "suggestions 2: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
          "suggestions 3: Make histology interpretation consequential and parallelize systemic staging coverage with credible modality/sequence errors."
        ]
      },
      "selfCheck": {
        "cueAttack": "All options address thoracic and abdominal/pelvic staging. The 'pelvic MRI alone' and single-region ultrasound shortcuts are removed; no valid chest-CT/MRI pathway is mislabeled wrong.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that the removed polyp contains an invasive adverse feature rather than assuming polypectomy ended the evaluation.",
          "Compare complete systemic staging pathways, including the thoracic modality and the role of PET."
        ],
        "oneBestAnswer": "The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT.",
        "closestDistractor": "Selecting PET as automatically more complete, or carrying forward an older chest-radiograph pathway, is plausible.",
        "remainingReview": "Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.preoperative-cross-sectional-staging.v2.r3",
      "conceptId": "concept.colon-cancer.preoperative-cross-sectional-staging",
      "stem": "Which staging pathway should precede further treatment planning for {patientName}?",
      "answerChoices": [
        {
          "id": "ct_cap_2",
          "label": "Chest CT with contrast-enhanced abdominal and pelvic CT",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides the conventional systemic staging pathway after recognition of invasive adverse polyp histology."
        },
        {
          "id": "choice.qq20261102a.b14-context.d1",
          "label": "Chest radiographs with contrast-enhanced abdominal and pelvic CT",
          "isCorrect": false,
          "distractorRationale": "Covers the same broad body regions but substitutes a less suitable thoracic examination for staging."
        },
        {
          "id": "choice.qq20261102a.b14-context.d2",
          "label": "Whole-body FDG PET-CT with regional anatomic review",
          "isCorrect": false,
          "distractorRationale": "Treats an advanced metabolic survey as the routine initial staging pathway, rather than reserving it for appropriate selected questions."
        }
      ],
      "explanation": "The pathology, not the scar's appearance, establishes the need for invasive-cancer staging. CT of the chest, abdomen and pelvis is a standard initial pathway. Chest radiography is not the equivalent thoracic assessment, and PET-CT is not routine initial staging. MRI-based alternatives can be appropriate in selected settings and are not falsely offered as invalid here.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.preoperative-cross-sectional-staging",
        "claim.qq20261102a.colon-systemic-staging"
      ],
      "teachingPoint": "The pathology, not the scar's appearance, establishes the need for invasive-cancer staging. CT of the chest, abdomen and pelvis is a standard initial pathway. Chest radiography is not the equivalent thoracic assessment, and PET-CT is not routine initial staging. MRI-based alternatives can be appropriate in selected settings and are not falsely offered as invalid here."
    },
    "previousResultNarrative": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "resultNarrative": "Staging CT shows no distant deposits and no enlarged regional nodes."
  },
  {
    "id": "revision.qq20261102a.b15",
    "auditId": "B15",
    "caseId": "case.colon-cancer.transverse-referral",
    "nodeId": "node.colon-cancer.transverse-referral.2",
    "previousQuestionVariantId": "question.colon-cancer.oncologic-regional-resection.v3.r2",
    "questionVariantId": "question.colon-cancer.oncologic-regional-resection.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which operative plan should be recommended for {patientName}'s colon cancer?",
    "previousChoiceLabels": [
      "Segmental colectomy with lymphadenectomy",
      "Local full-thickness excision of the tumour",
      "Total abdominal colectomy with lymphadenectomy"
    ],
    "previousCurrentUpdate": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature. Then Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT.",
    "reviewerNotes": "Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "regional_resection_3": "regional_resection_3",
      "choice.qq20261102a.b15.d1": "choice.qq20261102.b15.d1",
      "choice.qq20261102a.b15.d2": "choice.qq20261102.b15.d2"
    },
    "choiceServiceOverrides": {
      "regional_resection_3": null,
      "choice.qq20261102a.b15.d1": null,
      "choice.qq20261102a.b15.d2": null
    },
    "currentUpdate": "Staging CT shows no distant deposits and no enlarged regional nodes.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colon-cancer.oncologic-regional-resection.v3.r2",
      "whatChanged": "Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B15",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The particular adverse histology makes local scar treatment/surveillance inadequate substitutes for regional oncologic planning in the represented operable patient. Review boundary: Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted."
        ],
        "fairness": [
          "fairness 1: All choices address the post-polypectomy site; the least/middle/total-colectomy extent heuristic is removed. The normal-node result probes a misconception rather than excluding every competitor. Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "fairness 2: All choices address the post-polypectomy site; the least/middle/total-colectomy extent heuristic is removed. The normal-node result probes a misconception rather than excluding every competitor. Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "fairness 3: Require: Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature. Then Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT. The closest error is: Assuming an endoscopically clear scar plus negative CT permits a local completion procedure is credible.",
          "fairness 4: The particular adverse histology makes local scar treatment/surveillance inadequate substitutes for regional oncologic planning in the represented operable patient. Review boundary: Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted."
        ],
        "suggestions": [
          "suggestions 1: The particular adverse histology makes local scar treatment/surveillance inadequate substitutes for regional oncologic planning in the represented operable patient. Review boundary: Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted.",
          "suggestions 2: Require: Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature. Then Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT. The closest error is: Assuming an endoscopically clear scar plus negative CT permits a local completion procedure is credible.",
          "suggestions 3: Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting."
        ]
      },
      "selfCheck": {
        "cueAttack": "All choices address the post-polypectomy site; the least/middle/total-colectomy extent heuristic is removed. The normal-node result probes a misconception rather than excluding every competitor.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature.",
          "Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT."
        ],
        "oneBestAnswer": "The particular adverse histology makes local scar treatment/surveillance inadequate substitutes for regional oncologic planning in the represented operable patient.",
        "closestDistractor": "Assuming an endoscopically clear scar plus negative CT permits a local completion procedure is credible.",
        "remainingReview": "Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.oncologic-regional-resection.v3.r3",
      "conceptId": "concept.colon-cancer.oncologic-regional-resection",
      "stem": "Which treatment plan should be discussed for {patientName}'s resection site?",
      "answerChoices": [
        {
          "id": "regional_resection_3",
          "label": "Segmental colectomy with removal of the draining mesentery",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Interprets the adverse invasive-polyp feature and recognizes a regional-node risk that a clear-looking scar or negative CT cannot remove."
        },
        {
          "id": "choice.qq20261102a.b15.d1",
          "label": "Endoscopic full-thickness excision centered on the resection scar",
          "isCorrect": false,
          "distractorRationale": "Addresses potential local residual disease but does not provide regional nodal treatment/staging for this adverse histology."
        },
        {
          "id": "choice.qq20261102a.b15.d2",
          "label": "Endoscopic scar surveillance with repeat targeted tissue sampling",
          "isCorrect": false,
          "distractorRationale": "Overweights endoscopic/CT reassurance and does not address the adverse histologic feature that changes the adequacy of polypectomy."
        }
      ],
      "explanation": "An endoscopically removed malignant polyp is not automatically cured by a clear-looking scar. The supplied adverse invasive feature supports discussion of oncologic resection with the regional mesentery. CT-negative nodes do not exclude microscopic disease. Exact bowel extent, especially for a transverse lesion, remains an anatomic operative decision.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.oncologic-regional-resection",
        "claim.qq20261102a.malignant-polyp-adverse-features"
      ],
      "teachingPoint": "An endoscopically removed malignant polyp is not automatically cured by a clear-looking scar. The supplied adverse invasive feature supports discussion of oncologic resection with the regional mesentery. CT-negative nodes do not exclude microscopic disease. Exact bowel extent, especially for a transverse lesion, remains an anatomic operative decision."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after endoscopic removal of a polyp in the transverse colon. The site now appears as a scar. Invasive malignant glands reach the cauterized deep resection edge.",
    "previousPresentation": "{patientName}, a 54-year-old woman, visits the clinic after colonoscopy finds a mass in the transverse colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
    "previousProfilePresentations": [
      {
        "id": "profile.colon-cancer.transverse-referral.female.54",
        "presentation": "{patientName}, a 54-year-old woman, visits the clinic after colonoscopy finds a mass in the transverse colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      },
      {
        "id": "profile.colon-cancer.transverse-referral.male.54",
        "presentation": "{patientName}, a 54-year-old man, visits the clinic after colonoscopy finds a mass in the transverse colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      },
      {
        "id": "profile.colon-cancer.transverse-referral.female.59",
        "presentation": "{patientName}, a 59-year-old woman, visits the clinic after colonoscopy finds a mass in the transverse colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      },
      {
        "id": "profile.colon-cancer.transverse-referral.male.59",
        "presentation": "{patientName}, a 59-year-old man, visits the clinic after colonoscopy finds a mass in the transverse colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.colon-cancer.transverse-referral",
        "patientPresentationVariantId": "presentation.colon-cancer.transverse-referral",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Colon cancer consultation",
        "revisedPresentation": "{patientName}, a 54-year-old woman, visits the clinic after colonoscopy finds a mass in the transverse colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.colon-cancer.transverse-referral.female.54",
            "approvedInstantiationProfileId": "profile.colon-cancer.transverse-referral.female.54",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 54-year-old woman, visits the clinic after colonoscopy finds a mass in the transverse colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.colon-cancer.transverse-referral.male.54",
            "approvedInstantiationProfileId": "profile.colon-cancer.transverse-referral.male.54",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 54-year-old man, visits the clinic after colonoscopy finds a mass in the transverse colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.colon-cancer.transverse-referral.female.59",
            "approvedInstantiationProfileId": "profile.colon-cancer.transverse-referral.female.59",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 59-year-old woman, visits the clinic after colonoscopy finds a mass in the transverse colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.colon-cancer.transverse-referral.male.59",
            "approvedInstantiationProfileId": "profile.colon-cancer.transverse-referral.male.59",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 59-year-old man, visits the clinic after colonoscopy finds a mass in the transverse colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "chiefComplaint": "Polyp pathology review",
    "previousChiefComplaint": "Colon cancer consultation",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.colon-cancer.transverse-referral.female.54"
      },
      {
        "id": "profile.colon-cancer.transverse-referral.male.54"
      },
      {
        "id": "profile.colon-cancer.transverse-referral.female.59"
      },
      {
        "id": "profile.colon-cancer.transverse-referral.male.59"
      }
    ]
  },
  {
    "id": "revision.qq20261102a.b15-context",
    "auditId": "B15-context",
    "caseId": "case.colon-cancer.transverse-referral",
    "nodeId": "node.colon-cancer.transverse-referral.1",
    "previousQuestionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v3.r2",
    "questionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which staging study should be obtained before treatment planning for {patientName}'s colon cancer?",
    "previousChoiceLabels": [
      "Contrast CT: chest, abdomen, pelvis",
      "Whole-body PET-CT for systemic staging",
      "Abdominal ultrasound",
      "Pelvic MRI alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Recognize that the removed polyp contains an invasive adverse feature rather than assuming polypectomy ended the evaluation. Then Compare complete systemic staging pathways, including the thoracic modality and the role of PET.",
    "reviewerNotes": "Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_cap_3": "ct_cap_3",
      "choice.qq20261102a.b15-context.d1": "pet_ct_3",
      "choice.qq20261102a.b15-context.d2": "abdominal_us_3"
    },
    "choiceServiceOverrides": {
      "ct_cap_3": "service.ct",
      "choice.qq20261102a.b15-context.d1": null,
      "choice.qq20261102a.b15-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_cap_3": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b15-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b15-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pet_ct"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v3.r2",
      "whatChanged": "Make histology interpretation consequential and parallelize systemic staging coverage with credible modality/sequence errors.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B15-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: All options address thoracic and abdominal/pelvic staging. The 'pelvic MRI alone' and single-region ultrasound shortcuts are removed; no valid chest-CT/MRI pathway is mislabeled wrong.",
          "cues 2: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
          "cues 3: All options address thoracic and abdominal/pelvic staging. The 'pelvic MRI alone' and single-region ultrasound shortcuts are removed; no valid chest-CT/MRI pathway is mislabeled wrong."
        ],
        "fairness": [
          "fairness 1: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
          "fairness 2: Require: Recognize that the removed polyp contains an invasive adverse feature rather than assuming polypectomy ended the evaluation. Then Compare complete systemic staging pathways, including the thoracic modality and the role of PET. The closest error is: Selecting PET as automatically more complete, or carrying forward an older chest-radiograph pathway, is plausible.",
          "fairness 3: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging."
        ],
        "suggestions": [
          "suggestions 1: Make histology interpretation consequential and parallelize systemic staging coverage with credible modality/sequence errors.",
          "suggestions 2: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
          "suggestions 3: Make histology interpretation consequential and parallelize systemic staging coverage with credible modality/sequence errors."
        ]
      },
      "selfCheck": {
        "cueAttack": "All options address thoracic and abdominal/pelvic staging. The 'pelvic MRI alone' and single-region ultrasound shortcuts are removed; no valid chest-CT/MRI pathway is mislabeled wrong.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that the removed polyp contains an invasive adverse feature rather than assuming polypectomy ended the evaluation.",
          "Compare complete systemic staging pathways, including the thoracic modality and the role of PET."
        ],
        "oneBestAnswer": "The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT.",
        "closestDistractor": "Selecting PET as automatically more complete, or carrying forward an older chest-radiograph pathway, is plausible.",
        "remainingReview": "Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.preoperative-cross-sectional-staging.v3.r3",
      "conceptId": "concept.colon-cancer.preoperative-cross-sectional-staging",
      "stem": "Which staging pathway should precede further treatment planning for {patientName}?",
      "answerChoices": [
        {
          "id": "ct_cap_3",
          "label": "Chest CT with contrast-enhanced abdominal and pelvic CT",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides the conventional systemic staging pathway after recognition of invasive adverse polyp histology."
        },
        {
          "id": "choice.qq20261102a.b15-context.d1",
          "label": "Chest radiographs with contrast-enhanced abdominal and pelvic CT",
          "isCorrect": false,
          "distractorRationale": "Covers the same broad body regions but substitutes a less suitable thoracic examination for staging."
        },
        {
          "id": "choice.qq20261102a.b15-context.d2",
          "label": "Whole-body FDG PET-CT with regional anatomic review",
          "isCorrect": false,
          "distractorRationale": "Treats an advanced metabolic survey as the routine initial staging pathway, rather than reserving it for appropriate selected questions."
        }
      ],
      "explanation": "The pathology, not the scar's appearance, establishes the need for invasive-cancer staging. CT of the chest, abdomen and pelvis is a standard initial pathway. Chest radiography is not the equivalent thoracic assessment, and PET-CT is not routine initial staging. MRI-based alternatives can be appropriate in selected settings and are not falsely offered as invalid here.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.preoperative-cross-sectional-staging",
        "claim.qq20261102a.colon-systemic-staging"
      ],
      "teachingPoint": "The pathology, not the scar's appearance, establishes the need for invasive-cancer staging. CT of the chest, abdomen and pelvis is a standard initial pathway. Chest radiography is not the equivalent thoracic assessment, and PET-CT is not routine initial staging. MRI-based alternatives can be appropriate in selected settings and are not falsely offered as invalid here."
    },
    "previousResultNarrative": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "resultNarrative": "Staging CT shows no distant deposits and no enlarged regional nodes."
  },
  {
    "id": "revision.qq20261102a.b16",
    "auditId": "B16",
    "caseId": "case.colon-cancer.descending-referral",
    "nodeId": "node.colon-cancer.descending-referral.2",
    "previousQuestionVariantId": "question.colon-cancer.oncologic-regional-resection.v4.r2",
    "questionVariantId": "question.colon-cancer.oncologic-regional-resection.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which operative plan should be recommended for {patientName}'s colon cancer?",
    "previousChoiceLabels": [
      "Segmental colectomy with lymphadenectomy",
      "Local full-thickness excision of the tumour",
      "Total abdominal colectomy with lymphadenectomy"
    ],
    "previousCurrentUpdate": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature. Then Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT.",
    "reviewerNotes": "Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "regional_resection_4": "regional_resection_4",
      "choice.qq20261102a.b16.d1": "choice.qq20261102.b16.d1",
      "choice.qq20261102a.b16.d2": "choice.qq20261102.b16.d2"
    },
    "choiceServiceOverrides": {
      "regional_resection_4": null,
      "choice.qq20261102a.b16.d1": null,
      "choice.qq20261102a.b16.d2": null
    },
    "currentUpdate": "Staging CT shows no distant deposits and no enlarged regional nodes.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colon-cancer.oncologic-regional-resection.v4.r2",
      "whatChanged": "Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B16",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The particular adverse histology makes local scar treatment/surveillance inadequate substitutes for regional oncologic planning in the represented operable patient. Review boundary: Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted."
        ],
        "fairness": [
          "fairness 1: All choices address the post-polypectomy site; the least/middle/total-colectomy extent heuristic is removed. The normal-node result probes a misconception rather than excluding every competitor. Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "fairness 2: All choices address the post-polypectomy site; the least/middle/total-colectomy extent heuristic is removed. The normal-node result probes a misconception rather than excluding every competitor. Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "fairness 3: Require: Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature. Then Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT. The closest error is: Assuming an endoscopically clear scar plus negative CT permits a local completion procedure is credible."
        ],
        "suggestions": [
          "suggestions 1: The particular adverse histology makes local scar treatment/surveillance inadequate substitutes for regional oncologic planning in the represented operable patient. Review boundary: Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted.",
          "suggestions 2: Require: Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature. Then Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT. The closest error is: Assuming an endoscopically clear scar plus negative CT permits a local completion procedure is credible.",
          "suggestions 3: Replace an obvious gross-cancer operation with a scarred malignant-polyp decision; make siblings differ in adverse histology, and compare credible local versus regional strategies. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting."
        ]
      },
      "selfCheck": {
        "cueAttack": "All choices address the post-polypectomy site; the least/middle/total-colectomy extent heuristic is removed. The normal-node result probes a misconception rather than excluding every competitor.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the raw submucosal pathology/margin observation as an adverse invasive-polyp feature.",
          "Distinguish local scar clearance from the regional nodal issue despite reassuring endoscopy and CT."
        ],
        "oneBestAnswer": "The particular adverse histology makes local scar treatment/surveillance inadequate substitutes for regional oncologic planning in the represented operable patient.",
        "closestDistractor": "Assuming an endoscopically clear scar plus negative CT permits a local completion procedure is credible.",
        "remainingReview": "Melissa must confirm each adverse feature and operative suitability. No exact transverse-colectomy extent or unsupported lymph-node probability is asserted."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.oncologic-regional-resection.v4.r3",
      "conceptId": "concept.colon-cancer.oncologic-regional-resection",
      "stem": "Which treatment plan should be discussed for {patientName}'s resection site?",
      "answerChoices": [
        {
          "id": "regional_resection_4",
          "label": "Segmental colectomy with removal of the draining mesentery",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Interprets the adverse invasive-polyp feature and recognizes a regional-node risk that a clear-looking scar or negative CT cannot remove."
        },
        {
          "id": "choice.qq20261102a.b16.d1",
          "label": "Endoscopic full-thickness excision centered on the resection scar",
          "isCorrect": false,
          "distractorRationale": "Addresses potential local residual disease but does not provide regional nodal treatment/staging for this adverse histology."
        },
        {
          "id": "choice.qq20261102a.b16.d2",
          "label": "Endoscopic scar surveillance with repeat targeted tissue sampling",
          "isCorrect": false,
          "distractorRationale": "Overweights endoscopic/CT reassurance and does not address the adverse histologic feature that changes the adequacy of polypectomy."
        }
      ],
      "explanation": "An endoscopically removed malignant polyp is not automatically cured by a clear-looking scar. The supplied adverse invasive feature supports discussion of oncologic resection with the regional mesentery. CT-negative nodes do not exclude microscopic disease. Exact bowel extent, especially for a transverse lesion, remains an anatomic operative decision.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.oncologic-regional-resection",
        "claim.qq20261102a.malignant-polyp-adverse-features"
      ],
      "teachingPoint": "An endoscopically removed malignant polyp is not automatically cured by a clear-looking scar. The supplied adverse invasive feature supports discussion of oncologic resection with the regional mesentery. CT-negative nodes do not exclude microscopic disease. Exact bowel extent, especially for a transverse lesion, remains an anatomic operative decision."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after endoscopic removal of a polyp in the descending colon. The site now appears as a scar. The lesion was retrieved in fragments; malignant glands invade the submucosa and enter an endothelial-lined channel.",
    "previousPresentation": "{patientName}, a 68-year-old woman, visits the clinic after colonoscopy finds a mass in the descending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
    "previousProfilePresentations": [
      {
        "id": "profile.colon-cancer.descending-referral.female.68",
        "presentation": "{patientName}, a 68-year-old woman, visits the clinic after colonoscopy finds a mass in the descending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      },
      {
        "id": "profile.colon-cancer.descending-referral.male.68",
        "presentation": "{patientName}, a 68-year-old man, visits the clinic after colonoscopy finds a mass in the descending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      },
      {
        "id": "profile.colon-cancer.descending-referral.female.71",
        "presentation": "{patientName}, a 71-year-old woman, visits the clinic after colonoscopy finds a mass in the descending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      },
      {
        "id": "profile.colon-cancer.descending-referral.male.71",
        "presentation": "{patientName}, a 71-year-old man, visits the clinic after colonoscopy finds a mass in the descending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.colon-cancer.descending-referral",
        "patientPresentationVariantId": "presentation.colon-cancer.descending-referral",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Colon cancer consultation",
        "revisedPresentation": "{patientName}, a 68-year-old woman, visits the clinic after colonoscopy finds a mass in the descending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.colon-cancer.descending-referral.female.68",
            "approvedInstantiationProfileId": "profile.colon-cancer.descending-referral.female.68",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 68-year-old woman, visits the clinic after colonoscopy finds a mass in the descending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.colon-cancer.descending-referral.male.68",
            "approvedInstantiationProfileId": "profile.colon-cancer.descending-referral.male.68",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 68-year-old man, visits the clinic after colonoscopy finds a mass in the descending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.colon-cancer.descending-referral.female.71",
            "approvedInstantiationProfileId": "profile.colon-cancer.descending-referral.female.71",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 71-year-old woman, visits the clinic after colonoscopy finds a mass in the descending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.colon-cancer.descending-referral.male.71",
            "approvedInstantiationProfileId": "profile.colon-cancer.descending-referral.male.71",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 71-year-old man, visits the clinic after colonoscopy finds a mass in the descending colon that could not be removed endoscopically. Biopsy identifies invasive adenocarcinoma.",
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
        "ageYears": 68,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "chiefComplaint": "Polyp pathology review",
    "previousChiefComplaint": "Colon cancer consultation",
    "previousProfileChiefComplaints": [
      {
        "id": "profile.colon-cancer.descending-referral.female.68"
      },
      {
        "id": "profile.colon-cancer.descending-referral.male.68"
      },
      {
        "id": "profile.colon-cancer.descending-referral.female.71"
      },
      {
        "id": "profile.colon-cancer.descending-referral.male.71"
      }
    ]
  },
  {
    "id": "revision.qq20261102a.b16-context",
    "auditId": "B16-context",
    "caseId": "case.colon-cancer.descending-referral",
    "nodeId": "node.colon-cancer.descending-referral.1",
    "previousQuestionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v4.r2",
    "questionVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which staging study should be obtained before treatment planning for {patientName}'s colon cancer?",
    "previousChoiceLabels": [
      "Contrast CT: chest, abdomen, pelvis",
      "Whole-body PET-CT for systemic staging",
      "Abdominal ultrasound",
      "Pelvic MRI alone"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Recognize that the removed polyp contains an invasive adverse feature rather than assuming polypectomy ended the evaluation. Then Compare complete systemic staging pathways, including the thoracic modality and the role of PET.",
    "reviewerNotes": "Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_cap_4": "ct_cap_4",
      "choice.qq20261102a.b16-context.d1": "pet_ct_4",
      "choice.qq20261102a.b16-context.d2": "abdominal_us_4"
    },
    "choiceServiceOverrides": {
      "ct_cap_4": "service.ct",
      "choice.qq20261102a.b16-context.d1": null,
      "choice.qq20261102a.b16-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_cap_4": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b16-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b16-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pet_ct"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colon-cancer.preoperative-cross-sectional-staging.v4.r2",
      "whatChanged": "Make histology interpretation consequential and parallelize systemic staging coverage with credible modality/sequence errors.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B16-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: All options address thoracic and abdominal/pelvic staging. The 'pelvic MRI alone' and single-region ultrasound shortcuts are removed; no valid chest-CT/MRI pathway is mislabeled wrong.",
          "cues 2: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
          "cues 3: All options address thoracic and abdominal/pelvic staging. The 'pelvic MRI alone' and single-region ultrasound shortcuts are removed; no valid chest-CT/MRI pathway is mislabeled wrong."
        ],
        "fairness": [
          "fairness 1: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
          "fairness 2: Require: Recognize that the removed polyp contains an invasive adverse feature rather than assuming polypectomy ended the evaluation. Then Compare complete systemic staging pathways, including the thoracic modality and the role of PET. The closest error is: Selecting PET as automatically more complete, or carrying forward an older chest-radiograph pathway, is plausible.",
          "fairness 3: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging."
        ],
        "suggestions": [
          "suggestions 1: Make histology interpretation consequential and parallelize systemic staging coverage with credible modality/sequence errors.",
          "suggestions 2: The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT. Review boundary: Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging.",
          "suggestions 3: Make histology interpretation consequential and parallelize systemic staging coverage with credible modality/sequence errors."
        ]
      },
      "selfCheck": {
        "cueAttack": "All options address thoracic and abdominal/pelvic staging. The 'pelvic MRI alone' and single-region ultrasound shortcuts are removed; no valid chest-CT/MRI pathway is mislabeled wrong.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that the removed polyp contains an invasive adverse feature rather than assuming polypectomy ended the evaluation.",
          "Compare complete systemic staging pathways, including the thoracic modality and the role of PET."
        ],
        "oneBestAnswer": "The ordinary initial systemic staging question favors the CT pathway over thoracic radiography substitution or routine PET-CT.",
        "closestDistractor": "Selecting PET as automatically more complete, or carrying forward an older chest-radiograph pathway, is plausible.",
        "remainingReview": "Ordinary contrast suitability is assumed; no contraindication or unreturned staging result is invented. Additional assessments such as CEA/complete colon evaluation are not claimed to be replaced by imaging."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colon-cancer.preoperative-cross-sectional-staging.v4.r3",
      "conceptId": "concept.colon-cancer.preoperative-cross-sectional-staging",
      "stem": "Which staging pathway should precede further treatment planning for {patientName}?",
      "answerChoices": [
        {
          "id": "ct_cap_4",
          "label": "Chest CT with contrast-enhanced abdominal and pelvic CT",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Provides the conventional systemic staging pathway after recognition of invasive adverse polyp histology."
        },
        {
          "id": "choice.qq20261102a.b16-context.d1",
          "label": "Chest radiographs with contrast-enhanced abdominal and pelvic CT",
          "isCorrect": false,
          "distractorRationale": "Covers the same broad body regions but substitutes a less suitable thoracic examination for staging."
        },
        {
          "id": "choice.qq20261102a.b16-context.d2",
          "label": "Whole-body FDG PET-CT with regional anatomic review",
          "isCorrect": false,
          "distractorRationale": "Treats an advanced metabolic survey as the routine initial staging pathway, rather than reserving it for appropriate selected questions."
        }
      ],
      "explanation": "The pathology, not the scar's appearance, establishes the need for invasive-cancer staging. CT of the chest, abdomen and pelvis is a standard initial pathway. Chest radiography is not the equivalent thoracic assessment, and PET-CT is not routine initial staging. MRI-based alternatives can be appropriate in selected settings and are not falsely offered as invalid here.",
      "supportingEvidenceClaimIds": [
        "claim.colon-cancer.preoperative-cross-sectional-staging",
        "claim.qq20261102a.colon-systemic-staging"
      ],
      "teachingPoint": "The pathology, not the scar's appearance, establishes the need for invasive-cancer staging. CT of the chest, abdomen and pelvis is a standard initial pathway. Chest radiography is not the equivalent thoracic assessment, and PET-CT is not routine initial staging. MRI-based alternatives can be appropriate in selected settings and are not falsely offered as invalid here."
    },
    "previousResultNarrative": "Staging CT identifies the colonic primary but no distant deposits. No enlarged mesocolic nodes are reported.",
    "resultNarrative": "Staging CT shows no distant deposits and no enlarged regional nodes."
  },
  {
    "id": "revision.qq20261102a.b17",
    "auditId": "B17",
    "caseId": "case.pigmented-skin-lesion.changing-back-lesion",
    "nodeId": "node.pigmented-skin-lesion.changing-back-lesion.2",
    "previousQuestionVariantId": "question.melanoma.sentinel-node-staging.v1.r2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which regional-node plan should accompany {patientName}'s melanoma excision?",
    "previousChoiceLabels": [
      "Sentinel lymph-node biopsy",
      "Lymph-node ultrasound surveillance",
      "Complete lymph-node dissection"
    ],
    "previousCurrentUpdate": "Histology identifies invasive melanoma with Breslow thickness 1.4 mm. No enlarged nodes are felt in the draining basin.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling.",
    "reviewerNotes": "Melissa must verify histologic wording, nodal imaging interpretation and the exact consent/operative plan. Existing primary thickness values are retained, not shifted to create difficulty.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sentinel_node_1": "sentinel_node_1",
      "choice.qq20261102a.b17.d1": "choice.qq20261102.b17.d1",
      "choice.qq20261102a.b17.d2": "choice.qq20261102.b17.d2"
    },
    "choiceServiceOverrides": {
      "sentinel_node_1": null,
      "choice.qq20261102a.b17.d1": null,
      "choice.qq20261102a.b17.d2": null
    },
    "choiceTimingOverrides": {
      "sentinel_node_1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102a.b17.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102a.b17.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "currentUpdate": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.4 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.melanoma.sentinel-node-staging.v1.r2",
      "whatChanged": "Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B17",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies. Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
          "cues 2: There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies. Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error."
        ],
        "fairness": [
          "fairness 1: There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies. Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
          "fairness 2: Require: Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling. The closest error is: Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error.",
          "fairness 3: The measured invasive primary and clinically uninvolved basin support sentinel staging; normal-appearing nodes do not establish microscopic node negativity. Review boundary: Melissa must verify histologic wording, nodal imaging interpretation and the exact consent/operative plan. Existing primary thickness values are retained, not shifted to create difficulty."
        ],
        "suggestions": [
          "suggestions 1: Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
          "suggestions 2: Require: Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling. The closest error is: Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error.",
          "suggestions 3: Require: Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling. The closest error is: Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error."
        ]
      },
      "selfCheck": {
        "cueAttack": "There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label.",
          "Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling."
        ],
        "oneBestAnswer": "The measured invasive primary and clinically uninvolved basin support sentinel staging; normal-appearing nodes do not establish microscopic node negativity.",
        "closestDistractor": "Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error.",
        "remainingReview": "Melissa must verify histologic wording, nodal imaging interpretation and the exact consent/operative plan. Existing primary thickness values are retained, not shifted to create difficulty."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.melanoma.sentinel-node-staging.v1.r3",
      "conceptId": "concept.melanoma.sentinel-node-staging",
      "stem": "Which regional-node plan should accompany {patientName}'s further excision planning?",
      "answerChoices": [
        {
          "id": "sentinel_node_1",
          "label": "Sentinel lymph node mapping and biopsy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Interprets the primary depth and clinically uninvolved basin, rather than treating reassuring node imaging as exclusion of microscopic involvement."
        },
        {
          "id": "choice.qq20261102a.b17.d1",
          "label": "Ultrasound-guided biopsy of an imaged regional node",
          "isCorrect": false,
          "distractorRationale": "Confuses size-selected sampling of a nonsuspicious visible node with mapping the sentinel drainage of the primary lesion."
        },
        {
          "id": "choice.qq20261102a.b17.d2",
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
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with a changing pigmented skin lesion on an accessible limb site. A small raised focus sits within a broader changing pigmented area.",
    "previousPresentation": "{patientName}, a 46-year-old woman, visits the clinic with a changing pigmented lesion on the upper back. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
    "previousProfilePresentations": [
      {
        "id": "profile.pigmented-skin-lesion.changing-back-lesion.female.46",
        "presentation": "{patientName}, a 46-year-old woman, visits the clinic with a changing pigmented lesion on the upper back. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      },
      {
        "id": "profile.pigmented-skin-lesion.changing-back-lesion.male.46",
        "presentation": "{patientName}, a 46-year-old man, visits the clinic with a changing pigmented lesion on the upper back. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      },
      {
        "id": "profile.pigmented-skin-lesion.changing-back-lesion.female.51",
        "presentation": "{patientName}, a 51-year-old woman, visits the clinic with a changing pigmented lesion on the upper back. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      },
      {
        "id": "profile.pigmented-skin-lesion.changing-back-lesion.male.51",
        "presentation": "{patientName}, a 51-year-old man, visits the clinic with a changing pigmented lesion on the upper back. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.pigmented-skin-lesion.changing-back-lesion",
        "patientPresentationVariantId": "presentation.pigmented-skin-lesion.changing-back-lesion",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Changing skin spot",
        "revisedPresentation": "{patientName}, a 46-year-old woman, visits the clinic with a changing pigmented lesion on the upper back. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.changing-back-lesion.female.46",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.changing-back-lesion.female.46",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 46-year-old woman, visits the clinic with a changing pigmented lesion on the upper back. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.changing-back-lesion.male.46",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.changing-back-lesion.male.46",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 46-year-old man, visits the clinic with a changing pigmented lesion on the upper back. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.changing-back-lesion.female.51",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.changing-back-lesion.female.51",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 51-year-old woman, visits the clinic with a changing pigmented lesion on the upper back. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.changing-back-lesion.male.51",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.changing-back-lesion.male.51",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 51-year-old man, visits the clinic with a changing pigmented lesion on the upper back. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b17-context",
    "auditId": "B17-context",
    "caseId": "case.pigmented-skin-lesion.changing-back-lesion",
    "nodeId": "node.pigmented-skin-lesion.changing-back-lesion.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r2",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which biopsy approach should be arranged for {patientName}'s changing pigmented lesion?",
    "previousChoiceLabels": [
      "Complete excisional biopsy",
      "Superficial shave biopsy",
      "Partial punch biopsy",
      "Definitive wide local excision"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Recognize that the changing lesion contains clinically heterogeneous components. Then Compare sampling extent and depth rather than choosing an option merely called complete.",
    "reviewerNotes": "Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_1": "excisional_1",
      "choice.qq20261102a.b17-context.d1": "superficial_shave_1",
      "choice.qq20261102a.b17-context.d2": "partial_punch_1"
    },
    "choiceServiceOverrides": {
      "excisional_1": "service.skin_excisional_biopsy",
      "choice.qq20261102a.b17-context.d1": null,
      "choice.qq20261102a.b17-context.d2": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r2",
      "whatChanged": "Introduce clinically relevant heterogeneity and neutral, parallel sampling plans; keep diagnosis and definitive therapy out of the lead-in/options.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B17-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "cues 2: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "cues 3: All options are procedural descriptions with comparable extent/depth detail. The value-laden complete/partial/superficial labels and a wrong-stage wide-excision filler are removed."
        ],
        "fairness": [
          "fairness 1: Require: Recognize that the changing lesion contains clinically heterogeneous components. Then Compare sampling extent and depth rather than choosing an option merely called complete. The closest error is: Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
          "fairness 2: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "fairness 3: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations.",
          "fairness 4: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision."
        ],
        "suggestions": [
          "suggestions 1: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "suggestions 2: Require: Recognize that the changing lesion contains clinically heterogeneous components. Then Compare sampling extent and depth rather than choosing an option merely called complete. The closest error is: Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
          "suggestions 3: Introduce clinically relevant heterogeneity and neutral, parallel sampling plans; keep diagnosis and definitive therapy out of the lead-in/options."
        ]
      },
      "selfCheck": {
        "cueAttack": "All options are procedural descriptions with comparable extent/depth detail. The value-laden complete/partial/superficial labels and a wrong-stage wide-excision filler are removed.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that the changing lesion contains clinically heterogeneous components.",
          "Compare sampling extent and depth rather than choosing an option merely called complete."
        ],
        "oneBestAnswer": "The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations.",
        "closestDistractor": "Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
        "remainingReview": "Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r3",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "stem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
      "answerChoices": [
        {
          "id": "excisional_1",
          "label": "Elliptical sampling of the lesion through the dermis into subcutaneous fat",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Captures the heterogeneous lesion and a depth adequate for microstaging without committing to definitive wide margins before diagnosis."
        },
        {
          "id": "choice.qq20261102a.b17-context.d1",
          "label": "Punch sampling of the darkest focus through the dermis into subcutaneous fat",
          "isCorrect": false,
          "distractorRationale": "Can provide depth but risks selecting an unrepresentative component of a small heterogeneous lesion that can be sampled in its entirety."
        },
        {
          "id": "choice.qq20261102a.b17-context.d2",
          "label": "Tangential sampling of the lesion across its surface and papillary dermis",
          "isCorrect": false,
          "distractorRationale": "Captures surface extent but risks inadequate depth; this specific shallow plan is not a claim that every saucerization technique is inappropriate."
        }
      ],
      "explanation": "Diagnostic sampling must permit assessment of the heterogeneous lesion and its depth. A narrow diagnostic excision is distinct from the later definitive excision plan; a shallow surface specimen or a selected focus may compromise microstaging.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling"
      ],
      "teachingPoint": "Diagnostic sampling must permit assessment of the heterogeneous lesion and its depth. A narrow diagnostic excision is distinct from the later definitive excision plan; a shallow surface specimen or a selected focus may compromise microstaging."
    },
    "previousResultNarrative": "Histology identifies invasive melanoma with Breslow thickness 1.4 mm. No enlarged nodes are felt in the draining basin.",
    "resultNarrative": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.4 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes."
  },
  {
    "id": "revision.qq20261102a.b18",
    "auditId": "B18",
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.2",
    "previousQuestionVariantId": "question.melanoma.sentinel-node-staging.v3.r2",
    "questionVariantId": "question.melanoma.sentinel-node-staging.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which regional-node plan should accompany {patientName}'s melanoma excision?",
    "previousChoiceLabels": [
      "Sentinel lymph-node biopsy",
      "Lymph-node ultrasound surveillance",
      "Complete lymph-node dissection"
    ],
    "previousCurrentUpdate": "Histology identifies invasive melanoma with Breslow thickness 1.8 mm. No enlarged nodes are felt in the draining basin.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling.",
    "reviewerNotes": "Melissa must verify histologic wording, nodal imaging interpretation and the exact consent/operative plan. Existing primary thickness values are retained, not shifted to create difficulty.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sentinel_node_3": "sentinel_node_3",
      "choice.qq20261102a.b18.d1": "choice.qq20261102.b18.d1",
      "choice.qq20261102a.b18.d2": "choice.qq20261102.b18.d2"
    },
    "choiceServiceOverrides": {
      "sentinel_node_3": null,
      "choice.qq20261102a.b18.d1": null,
      "choice.qq20261102a.b18.d2": null
    },
    "choiceTimingOverrides": {
      "sentinel_node_3": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102a.b18.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102a.b18.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "currentUpdate": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.8 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.melanoma.sentinel-node-staging.v3.r2",
      "whatChanged": "Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B18",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies. Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
          "cues 2: There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies. Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error."
        ],
        "fairness": [
          "fairness 1: There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies. Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
          "fairness 2: Require: Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling. The closest error is: Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error.",
          "fairness 3: The measured invasive primary and clinically uninvolved basin support sentinel staging; normal-appearing nodes do not establish microscopic node negativity. Review boundary: Melissa must verify histologic wording, nodal imaging interpretation and the exact consent/operative plan. Existing primary thickness values are retained, not shifted to create difficulty."
        ],
        "suggestions": [
          "suggestions 1: Use raw primary histology plus a competing reassuring node study; remove the duplicated examination and replace obvious extensive dissection with a closer staging error.",
          "suggestions 2: Require: Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling. The closest error is: Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error.",
          "suggestions 3: Require: Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label. Then Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling. The closest error is: Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error."
        ]
      },
      "selfCheck": {
        "cueAttack": "There is one nodal examination statement, not a duplicated negative. Complete nodal dissection is replaced by a closer sampling misconception; all labels are regional-node strategies.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret dermal melanocytic invasion and the measured primary depth rather than a supplied stage label.",
          "Distinguish pathologic sentinel staging from reassuring nodal imaging or size-selected node sampling."
        ],
        "oneBestAnswer": "The measured invasive primary and clinically uninvolved basin support sentinel staging; normal-appearing nodes do not establish microscopic node negativity.",
        "closestDistractor": "Treating a benign-appearing ultrasound or an arbitrary-node needle sample as equivalent staging is a realistic error.",
        "remainingReview": "Melissa must verify histologic wording, nodal imaging interpretation and the exact consent/operative plan. Existing primary thickness values are retained, not shifted to create difficulty."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.melanoma.sentinel-node-staging.v3.r3",
      "conceptId": "concept.melanoma.sentinel-node-staging",
      "stem": "Which regional-node plan should accompany {patientName}'s further excision planning?",
      "answerChoices": [
        {
          "id": "sentinel_node_3",
          "label": "Sentinel lymph node mapping and biopsy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Interprets the primary depth and clinically uninvolved basin, rather than treating reassuring node imaging as exclusion of microscopic involvement."
        },
        {
          "id": "choice.qq20261102a.b18.d1",
          "label": "Ultrasound-guided biopsy of an imaged regional node",
          "isCorrect": false,
          "distractorRationale": "Confuses size-selected sampling of a nonsuspicious visible node with mapping the sentinel drainage of the primary lesion."
        },
        {
          "id": "choice.qq20261102a.b18.d2",
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
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with a changing pigmented skin lesion on an accessible limb site. The lesion has a changing border and a firm central focus within a flatter component.",
    "previousPresentation": "{patientName}, a 39-year-old woman, visits the clinic with a changing pigmented lesion on the calf. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
    "previousProfilePresentations": [
      {
        "id": "profile.pigmented-skin-lesion.calf-growth.female.39",
        "presentation": "{patientName}, a 39-year-old woman, visits the clinic with a changing pigmented lesion on the calf. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      },
      {
        "id": "profile.pigmented-skin-lesion.calf-growth.male.39",
        "presentation": "{patientName}, a 39-year-old man, visits the clinic with a changing pigmented lesion on the calf. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      },
      {
        "id": "profile.pigmented-skin-lesion.calf-growth.female.44",
        "presentation": "{patientName}, a 44-year-old woman, visits the clinic with a changing pigmented lesion on the calf. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      },
      {
        "id": "profile.pigmented-skin-lesion.calf-growth.male.44",
        "presentation": "{patientName}, a 44-year-old man, visits the clinic with a changing pigmented lesion on the calf. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.pigmented-skin-lesion.calf-growth",
        "patientPresentationVariantId": "presentation.pigmented-skin-lesion.calf-growth",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Changing skin spot",
        "revisedPresentation": "{patientName}, a 39-year-old woman, visits the clinic with a changing pigmented lesion on the calf. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.calf-growth.female.39",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.calf-growth.female.39",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 39-year-old woman, visits the clinic with a changing pigmented lesion on the calf. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.calf-growth.male.39",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.calf-growth.male.39",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 39-year-old man, visits the clinic with a changing pigmented lesion on the calf. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.calf-growth.female.44",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.calf-growth.female.44",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 44-year-old woman, visits the clinic with a changing pigmented lesion on the calf. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pigmented-skin-lesion.calf-growth.male.44",
            "approvedInstantiationProfileId": "profile.pigmented-skin-lesion.calf-growth.male.44",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 44-year-old man, visits the clinic with a changing pigmented lesion on the calf. The lesion is small and superficial, with an irregular border and areas of differing colour. No enlarged nodes are felt in the draining basin.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b18-context",
    "auditId": "B18-context",
    "caseId": "case.pigmented-skin-lesion.calf-growth",
    "nodeId": "node.pigmented-skin-lesion.calf-growth.1",
    "previousQuestionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r2",
    "questionVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which biopsy approach should be arranged for {patientName}'s changing pigmented lesion?",
    "previousChoiceLabels": [
      "Complete excisional biopsy",
      "Superficial shave biopsy",
      "Partial punch biopsy",
      "Definitive wide local excision"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Recognize that the changing lesion contains clinically heterogeneous components. Then Compare sampling extent and depth rather than choosing an option merely called complete.",
    "reviewerNotes": "Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "excisional_3": "excisional_3",
      "choice.qq20261102a.b18-context.d1": "superficial_shave_3",
      "choice.qq20261102a.b18-context.d2": "partial_punch_3"
    },
    "choiceServiceOverrides": {
      "excisional_3": "service.skin_excisional_biopsy",
      "choice.qq20261102a.b18-context.d1": null,
      "choice.qq20261102a.b18-context.d2": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r2",
      "whatChanged": "Introduce clinically relevant heterogeneity and neutral, parallel sampling plans; keep diagnosis and definitive therapy out of the lead-in/options.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B18-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "cues 2: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "cues 3: All options are procedural descriptions with comparable extent/depth detail. The value-laden complete/partial/superficial labels and a wrong-stage wide-excision filler are removed."
        ],
        "fairness": [
          "fairness 1: Require: Recognize that the changing lesion contains clinically heterogeneous components. Then Compare sampling extent and depth rather than choosing an option merely called complete. The closest error is: Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
          "fairness 2: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "fairness 3: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations.",
          "fairness 4: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision."
        ],
        "suggestions": [
          "suggestions 1: The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations. Review boundary: Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision.",
          "suggestions 2: Require: Recognize that the changing lesion contains clinically heterogeneous components. Then Compare sampling extent and depth rather than choosing an option merely called complete. The closest error is: Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
          "suggestions 3: Introduce clinically relevant heterogeneity and neutral, parallel sampling plans; keep diagnosis and definitive therapy out of the lead-in/options."
        ]
      },
      "selfCheck": {
        "cueAttack": "All options are procedural descriptions with comparable extent/depth detail. The value-laden complete/partial/superficial labels and a wrong-stage wide-excision filler are removed.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that the changing lesion contains clinically heterogeneous components.",
          "Compare sampling extent and depth rather than choosing an option merely called complete."
        ],
        "oneBestAnswer": "The accessible lesion can be diagnostically excised to adequate depth; the offered selected-focus and papillary-dermis samples have specific microstaging limitations.",
        "closestDistractor": "Sampling the darkest rather than the most representative/deep component is plausible; shallow sampling is described precisely rather than condemning all tangential techniques.",
        "remainingReview": "Clinician must confirm accessibility and technique descriptions. This is not an exception for a large facial/acral lesion; no later histology is used in this earlier decision."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r3",
      "conceptId": "concept.pigmented-skin-lesion.complete-diagnostic-biopsy",
      "stem": "Which diagnostic sampling plan should be used for {patientName}'s skin lesion?",
      "answerChoices": [
        {
          "id": "excisional_3",
          "label": "Elliptical sampling of the lesion through the dermis into subcutaneous fat",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Captures the heterogeneous lesion and a depth adequate for microstaging without committing to definitive wide margins before diagnosis."
        },
        {
          "id": "choice.qq20261102a.b18-context.d1",
          "label": "Punch sampling of the darkest focus through the dermis into subcutaneous fat",
          "isCorrect": false,
          "distractorRationale": "Can provide depth but risks selecting an unrepresentative component of a small heterogeneous lesion that can be sampled in its entirety."
        },
        {
          "id": "choice.qq20261102a.b18-context.d2",
          "label": "Tangential sampling of the lesion across its surface and papillary dermis",
          "isCorrect": false,
          "distractorRationale": "Captures surface extent but risks inadequate depth; this specific shallow plan is not a claim that every saucerization technique is inappropriate."
        }
      ],
      "explanation": "Diagnostic sampling must permit assessment of the heterogeneous lesion and its depth. A narrow diagnostic excision is distinct from the later definitive excision plan; a shallow surface specimen or a selected focus may compromise microstaging.",
      "supportingEvidenceClaimIds": [
        "claim.pigmented-skin-lesion.complete-diagnostic-biopsy",
        "claim.qq20261102a.melanoma-diagnostic-sampling"
      ],
      "teachingPoint": "Diagnostic sampling must permit assessment of the heterogeneous lesion and its depth. A narrow diagnostic excision is distinct from the later definitive excision plan; a shallow surface specimen or a selected focus may compromise microstaging."
    },
    "previousResultNarrative": "Histology identifies invasive melanoma with Breslow thickness 1.8 mm. No enlarged nodes are felt in the draining basin.",
    "resultNarrative": "The specimen contains atypical melanocytes extending into the dermis. Maximum vertical thickness from the epidermal granular layer to the deepest tumor is 1.8 mm. The regional examination finds no palpable node; ultrasound of the basin shows oval nodes with preserved central hilar echoes."
  },
  {
    "id": "revision.qq20261102a.b19",
    "auditId": "B19",
    "caseId": "case.soft-tissue-mass.deep-thigh",
    "nodeId": "node.soft-tissue-mass.deep-thigh.2",
    "previousQuestionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v1.r2",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which tissue-diagnosis plan should be arranged for {patientName}'s limb mass?",
    "previousChoiceLabels": [
      "Image-guided core biopsy through a sarcoma service",
      "Needle aspiration through a general radiology service",
      "Excisional biopsy through an outpatient surgery service"
    ],
    "previousCurrentUpdate": "MRI shows a deep mass extending between muscle compartments, with heterogeneous internal enhancement.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret the contrast/fluid-sensitive observations as different tissue components rather than one uniform lesion. Then Choose representative viable tissue for planned core biopsy, avoiding necrotic/fluid and reactive targets.",
    "reviewerNotes": "Melissa/radiology must confirm MRI-to-target interpretation and access/tract planning. Enhancement is not itself a diagnosis of sarcoma.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sarcoma_core_1": "sarcoma_core_1",
      "choice.qq20261102a.b19.d1": "choice.qq20261102.b19.d1",
      "choice.qq20261102a.b19.d2": "choice.qq20261102.b19.d2"
    },
    "choiceServiceOverrides": {
      "sarcoma_core_1": null,
      "choice.qq20261102a.b19.d1": null,
      "choice.qq20261102a.b19.d2": null
    },
    "choiceTimingOverrides": {
      "sarcoma_core_1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102a.b19.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102a.b19.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      }
    },
    "currentUpdate": "MRI shows a mass within muscle. Region A is solid tissue at its edge and takes up contrast. Region B is central fluid-like material that does not take up contrast. Region C is nearby muscle with diffuse high fluid-sensitive signal, without a discrete mass.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v1.r2",
      "whatChanged": "Hold specialist setting, guidance and core method constant; require interpretation of viable versus fluid/reactive components to select the tissue target.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B19",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The enhancing solid tumor component is the representative target; neither the fluid-like center nor adjacent nonmass muscle is equivalent diagnostic tissue. Review boundary: Melissa/radiology must confirm MRI-to-target interpretation and access/tract planning. Enhancement is not itself a diagnosis of sarcoma.",
          "cues 2: All options are anatomic targets for the same specialist image-guided core procedure. No key-only expert-service, image-guidance or precision qualifier remains."
        ],
        "fairness": [
          "fairness 1: Require: Interpret the contrast/fluid-sensitive observations as different tissue components rather than one uniform lesion. Then Choose representative viable tissue for planned core biopsy, avoiding necrotic/fluid and reactive targets. The closest error is: Sampling the largest or easiest central abnormality despite nonenhancement is a realistic diagnostic-yield error.",
          "fairness 2: The enhancing solid tumor component is the representative target; neither the fluid-like center nor adjacent nonmass muscle is equivalent diagnostic tissue. Review boundary: Melissa/radiology must confirm MRI-to-target interpretation and access/tract planning. Enhancement is not itself a diagnosis of sarcoma.",
          "fairness 3: The enhancing solid tumor component is the representative target; neither the fluid-like center nor adjacent nonmass muscle is equivalent diagnostic tissue. Review boundary: Melissa/radiology must confirm MRI-to-target interpretation and access/tract planning. Enhancement is not itself a diagnosis of sarcoma."
        ],
        "suggestions": [
          "suggestions 1: Hold specialist setting, guidance and core method constant; require interpretation of viable versus fluid/reactive components to select the tissue target.",
          "suggestions 2: Hold specialist setting, guidance and core method constant; require interpretation of viable versus fluid/reactive components to select the tissue target.",
          "suggestions 3: Hold specialist setting, guidance and core method constant; require interpretation of viable versus fluid/reactive components to select the tissue target."
        ]
      },
      "selfCheck": {
        "cueAttack": "All options are anatomic targets for the same specialist image-guided core procedure. No key-only expert-service, image-guidance or precision qualifier remains.",
        "difficulty": "hard",
        "reasoningSteps": [
          "Interpret the contrast/fluid-sensitive observations as different tissue components rather than one uniform lesion.",
          "Choose representative viable tissue for planned core biopsy, avoiding necrotic/fluid and reactive targets."
        ],
        "oneBestAnswer": "The enhancing solid tumor component is the representative target; neither the fluid-like center nor adjacent nonmass muscle is equivalent diagnostic tissue.",
        "closestDistractor": "Sampling the largest or easiest central abnormality despite nonenhancement is a realistic diagnostic-yield error.",
        "remainingReview": "Melissa/radiology must confirm MRI-to-target interpretation and access/tract planning. Enhancement is not itself a diagnosis of sarcoma."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.specialist-planned-biopsy.v1.r3",
      "conceptId": "concept.soft-tissue-mass.specialist-planned-biopsy",
      "stem": "The specialist team is planning image-guided core sampling. Which target should be sampled for {patientName}?",
      "answerChoices": [
        {
          "id": "sarcoma_core_1",
          "label": "Region A within the mass",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Targets tissue likely to provide viable diagnostic tumor rather than fluid/necrosis or adjacent reactive change."
        },
        {
          "id": "choice.qq20261102a.b19.d1",
          "label": "Region B within the mass",
          "isCorrect": false,
          "distractorRationale": "Mistakes the conspicuous central component for the best histologic target despite its lack of enhancement."
        },
        {
          "id": "choice.qq20261102a.b19.d2",
          "label": "Region C in surrounding muscle",
          "isCorrect": false,
          "distractorRationale": "Mistakes the surrounding reactive abnormality for representative tissue from the lesion itself."
        }
      ],
      "explanation": "A planned core biopsy should obtain representative viable tissue, with the tract coordinated with definitive care. Enhancement and the solid component help choose a diagnostic target; fluid-like center or adjacent edema can be unrepresentative. The service setting and sampling method are held constant here.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.planned-biopsy",
        "claim.soft-tissue-mass.mri",
        "claim.qq20261102a.sarcoma-viable-biopsy-target"
      ],
      "teachingPoint": "A planned core biopsy should obtain representative viable tissue, with the tract coordinated with definitive care. Enhancement and the solid component help choose a diagnostic target; fluid-like center or adjacent edema can be unrepresentative. The service setting and sampling method are held constant here."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with an enlarging extremity mass. Ultrasound places its superficial margin beneath the investing fascia, but cannot show the deep margin.",
    "previousPresentation": "{patientName}, a 39-year-old woman, visits the clinic with an enlarging mass in the thigh. On examination the lesion lies deep to the freely mobile skin.",
    "previousProfilePresentations": [
      {
        "id": "profile.soft-tissue-mass.deep-thigh.female.39",
        "presentation": "{patientName}, a 39-year-old woman, visits the clinic with an enlarging mass in the thigh. On examination the lesion lies deep to the freely mobile skin."
      },
      {
        "id": "profile.soft-tissue-mass.deep-thigh.male.39",
        "presentation": "{patientName}, a 39-year-old man, visits the clinic with an enlarging mass in the thigh. On examination the lesion lies deep to the freely mobile skin."
      },
      {
        "id": "profile.soft-tissue-mass.deep-thigh.female.43",
        "presentation": "{patientName}, a 43-year-old woman, visits the clinic with an enlarging mass in the thigh. On examination the lesion lies deep to the freely mobile skin."
      },
      {
        "id": "profile.soft-tissue-mass.deep-thigh.male.43",
        "presentation": "{patientName}, a 43-year-old man, visits the clinic with an enlarging mass in the thigh. On examination the lesion lies deep to the freely mobile skin."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.soft-tissue-mass.deep-thigh",
        "patientPresentationVariantId": "presentation.soft-tissue-mass.deep-thigh",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Enlarging limb mass",
        "revisedPresentation": "{patientName}, a 39-year-old woman, visits the clinic with an enlarging mass in the thigh. On examination the lesion lies deep to the freely mobile skin.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.soft-tissue-mass.deep-thigh.female.39",
            "approvedInstantiationProfileId": "profile.soft-tissue-mass.deep-thigh.female.39",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 39-year-old woman, visits the clinic with an enlarging mass in the thigh. On examination the lesion lies deep to the freely mobile skin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.soft-tissue-mass.deep-thigh.male.39",
            "approvedInstantiationProfileId": "profile.soft-tissue-mass.deep-thigh.male.39",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 39-year-old man, visits the clinic with an enlarging mass in the thigh. On examination the lesion lies deep to the freely mobile skin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.soft-tissue-mass.deep-thigh.female.43",
            "approvedInstantiationProfileId": "profile.soft-tissue-mass.deep-thigh.female.43",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic with an enlarging mass in the thigh. On examination the lesion lies deep to the freely mobile skin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.soft-tissue-mass.deep-thigh.male.43",
            "approvedInstantiationProfileId": "profile.soft-tissue-mass.deep-thigh.male.43",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 43-year-old man, visits the clinic with an enlarging mass in the thigh. On examination the lesion lies deep to the freely mobile skin.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b19-context",
    "auditId": "B19-context",
    "caseId": "case.soft-tissue-mass.deep-thigh",
    "nodeId": "node.soft-tissue-mass.deep-thigh.1",
    "previousQuestionVariantId": "question.soft-tissue-mass.extremity-mri.v1.r2",
    "questionVariantId": "question.soft-tissue-mass.extremity-mri.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which imaging study should characterize {patientName}'s limb mass before tissue sampling?",
    "previousChoiceLabels": [
      "Dedicated MRI of the involved extremity",
      "Focused ultrasound of the mass",
      "Plain radiographs of the involved extremity",
      "Noncontrast CT of the involved extremity"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Use the actual fascia/deep-margin observations rather than equating 'below skin' with subfascial depth. Then Select local soft-tissue characterization before biopsy rather than adding only vascular assessment.",
    "reviewerNotes": "Ordinary MRI/contrast suitability is assumed. No size threshold or future MRI result is used to justify this earlier choice.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "extremity_mri_1": "extremity_mri_1",
      "choice.qq20261102a.b19-context.d1": "repeat_ultrasound_1",
      "choice.qq20261102a.b19-context.d2": "plain_radiograph_1"
    },
    "choiceServiceOverrides": {
      "extremity_mri_1": "service.extremity_mri",
      "choice.qq20261102a.b19-context.d1": null,
      "choice.qq20261102a.b19-context.d2": null
    },
    "choiceTimingOverrides": {
      "extremity_mri_1": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102a.b19-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b19-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.soft-tissue-mass.extremity-mri.v1.r2",
      "whatChanged": "Establish actual fascial depth from prior ultrasound and compare parallel local imaging protocols before biopsy.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B19-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: All protocols include comparable technical detail; 'dedicated' and the uniquely limited noncontrast CT label are removed.",
          "cues 2: All protocols include comparable technical detail; 'dedicated' and the uniquely limited noncontrast CT label are removed."
        ],
        "fairness": [
          "fairness 1: Require: Use the actual fascia/deep-margin observations rather than equating 'below skin' with subfascial depth. Then Select local soft-tissue characterization before biopsy rather than adding only vascular assessment. The closest error is: Repeating ultrasound with Doppler because it was the initial triage study is plausible but does not answer the extent question.",
          "fairness 2: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling.",
          "fairness 3: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling. Review boundary: Ordinary MRI/contrast suitability is assumed. No size threshold or future MRI result is used to justify this earlier choice.",
          "fairness 4: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling."
        ],
        "suggestions": [
          "suggestions 1: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling. Review boundary: Ordinary MRI/contrast suitability is assumed. No size threshold or future MRI result is used to justify this earlier choice.",
          "suggestions 2: Establish actual fascial depth from prior ultrasound and compare parallel local imaging protocols before biopsy.",
          "suggestions 3: All protocols include comparable technical detail; 'dedicated' and the uniquely limited noncontrast CT label are removed. Establish actual fascial depth from prior ultrasound and compare parallel local imaging protocols before biopsy."
        ]
      },
      "selfCheck": {
        "cueAttack": "All protocols include comparable technical detail; 'dedicated' and the uniquely limited noncontrast CT label are removed.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Use the actual fascia/deep-margin observations rather than equating 'below skin' with subfascial depth.",
          "Select local soft-tissue characterization before biopsy rather than adding only vascular assessment."
        ],
        "oneBestAnswer": "The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling.",
        "closestDistractor": "Repeating ultrasound with Doppler because it was the initial triage study is plausible but does not answer the extent question.",
        "remainingReview": "Ordinary MRI/contrast suitability is assumed. No size threshold or future MRI result is used to justify this earlier choice."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.extremity-mri.v1.r3",
      "conceptId": "concept.soft-tissue-mass.extremity-mri",
      "stem": "Which local characterization study should precede tissue sampling of {patientName}'s mass?",
      "answerChoices": [
        {
          "id": "extremity_mri_1",
          "label": "Extremity MRI before and after intravenous contrast",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Defines the deep lesion and adjacent compartments before biopsy; ultrasound has not shown its deep extent."
        },
        {
          "id": "choice.qq20261102a.b19-context.d1",
          "label": "Extremity CT before and after intravenous contrast",
          "isCorrect": false,
          "distractorRationale": "Is a plausible cross-sectional alternative but does not replace the preferred soft-tissue local characterization in this setting."
        },
        {
          "id": "choice.qq20261102a.b19-context.d2",
          "label": "Extremity ultrasound with color-flow and spectral Doppler",
          "isCorrect": false,
          "distractorRationale": "Can add vascular information but does not resolve the unvisualized deep extent of this demonstrated subfascial lesion."
        }
      ],
      "explanation": "The prior examination establishes that the lesion lies below the investing fascia and that its deep extent is not defined. Local MRI characterization should precede biopsy planning. An ultrasound description merely below mobile skin would not have established that depth.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.mri",
        "claim.qq20261102a.sarcoma-local-imaging"
      ],
      "teachingPoint": "The prior examination establishes that the lesion lies below the investing fascia and that its deep extent is not defined. Local MRI characterization should precede biopsy planning. An ultrasound description merely below mobile skin would not have established that depth."
    },
    "previousResultNarrative": "MRI shows a deep mass extending between muscle compartments, with heterogeneous internal enhancement.",
    "resultNarrative": "MRI shows a mass within muscle. Region A is solid tissue at its edge and takes up contrast. Region B is central fluid-like material that does not take up contrast. Region C is nearby muscle with diffuse high fluid-sensitive signal, without a discrete mass."
  },
  {
    "id": "revision.qq20261102a.b20",
    "auditId": "B20",
    "caseId": "case.soft-tissue-mass.upper-arm",
    "nodeId": "node.soft-tissue-mass.upper-arm.2",
    "previousQuestionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v2.r2",
    "questionVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which tissue-diagnosis plan should be arranged for {patientName}'s limb mass?",
    "previousChoiceLabels": [
      "Image-guided core biopsy through a sarcoma service",
      "Needle aspiration through a general radiology service",
      "Excisional biopsy through an outpatient surgery service"
    ],
    "previousCurrentUpdate": "MRI shows a deep mass extending between muscle compartments, with heterogeneous internal enhancement.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret the contrast/fluid-sensitive observations as different tissue components rather than one uniform lesion. Then Choose representative viable tissue for planned core biopsy, avoiding necrotic/fluid and reactive targets.",
    "reviewerNotes": "Melissa/radiology must confirm MRI-to-target interpretation and access/tract planning. Enhancement is not itself a diagnosis of sarcoma.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "sarcoma_core_2": "sarcoma_core_2",
      "choice.qq20261102a.b20.d1": "choice.qq20261102.b20.d1",
      "choice.qq20261102a.b20.d2": "choice.qq20261102.b20.d2"
    },
    "choiceServiceOverrides": {
      "sarcoma_core_2": null,
      "choice.qq20261102a.b20.d1": null,
      "choice.qq20261102a.b20.d2": null
    },
    "choiceTimingOverrides": {
      "sarcoma_core_2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102a.b20.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      },
      "choice.qq20261102a.b20.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.biopsy"
      }
    },
    "currentUpdate": "MRI shows a mass within muscle. Region A is solid tissue at its edge and takes up contrast. Region B is central fluid-like material that does not take up contrast. Region C is nearby muscle with diffuse high fluid-sensitive signal, without a discrete mass.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.soft-tissue-mass.specialist-planned-biopsy.v2.r2",
      "whatChanged": "Hold specialist setting, guidance and core method constant; require interpretation of viable versus fluid/reactive components to select the tissue target.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B20",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The enhancing solid tumor component is the representative target; neither the fluid-like center nor adjacent nonmass muscle is equivalent diagnostic tissue. Review boundary: Melissa/radiology must confirm MRI-to-target interpretation and access/tract planning. Enhancement is not itself a diagnosis of sarcoma.",
          "cues 2: All options are anatomic targets for the same specialist image-guided core procedure. No key-only expert-service, image-guidance or precision qualifier remains."
        ],
        "fairness": [
          "fairness 1: Require: Interpret the contrast/fluid-sensitive observations as different tissue components rather than one uniform lesion. Then Choose representative viable tissue for planned core biopsy, avoiding necrotic/fluid and reactive targets. The closest error is: Sampling the largest or easiest central abnormality despite nonenhancement is a realistic diagnostic-yield error.",
          "fairness 2: The enhancing solid tumor component is the representative target; neither the fluid-like center nor adjacent nonmass muscle is equivalent diagnostic tissue. Review boundary: Melissa/radiology must confirm MRI-to-target interpretation and access/tract planning. Enhancement is not itself a diagnosis of sarcoma.",
          "fairness 3: The enhancing solid tumor component is the representative target; neither the fluid-like center nor adjacent nonmass muscle is equivalent diagnostic tissue. Review boundary: Melissa/radiology must confirm MRI-to-target interpretation and access/tract planning. Enhancement is not itself a diagnosis of sarcoma."
        ],
        "suggestions": [
          "suggestions 1: Hold specialist setting, guidance and core method constant; require interpretation of viable versus fluid/reactive components to select the tissue target.",
          "suggestions 2: Hold specialist setting, guidance and core method constant; require interpretation of viable versus fluid/reactive components to select the tissue target.",
          "suggestions 3: Hold specialist setting, guidance and core method constant; require interpretation of viable versus fluid/reactive components to select the tissue target."
        ]
      },
      "selfCheck": {
        "cueAttack": "All options are anatomic targets for the same specialist image-guided core procedure. No key-only expert-service, image-guidance or precision qualifier remains.",
        "difficulty": "hard",
        "reasoningSteps": [
          "Interpret the contrast/fluid-sensitive observations as different tissue components rather than one uniform lesion.",
          "Choose representative viable tissue for planned core biopsy, avoiding necrotic/fluid and reactive targets."
        ],
        "oneBestAnswer": "The enhancing solid tumor component is the representative target; neither the fluid-like center nor adjacent nonmass muscle is equivalent diagnostic tissue.",
        "closestDistractor": "Sampling the largest or easiest central abnormality despite nonenhancement is a realistic diagnostic-yield error.",
        "remainingReview": "Melissa/radiology must confirm MRI-to-target interpretation and access/tract planning. Enhancement is not itself a diagnosis of sarcoma."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.specialist-planned-biopsy.v2.r3",
      "conceptId": "concept.soft-tissue-mass.specialist-planned-biopsy",
      "stem": "The specialist team is planning image-guided core sampling. Which target should be sampled for {patientName}?",
      "answerChoices": [
        {
          "id": "sarcoma_core_2",
          "label": "Region A within the mass",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Targets tissue likely to provide viable diagnostic tumor rather than fluid/necrosis or adjacent reactive change."
        },
        {
          "id": "choice.qq20261102a.b20.d1",
          "label": "Region B within the mass",
          "isCorrect": false,
          "distractorRationale": "Mistakes the conspicuous central component for the best histologic target despite its lack of enhancement."
        },
        {
          "id": "choice.qq20261102a.b20.d2",
          "label": "Region C in surrounding muscle",
          "isCorrect": false,
          "distractorRationale": "Mistakes the surrounding reactive abnormality for representative tissue from the lesion itself."
        }
      ],
      "explanation": "A planned core biopsy should obtain representative viable tissue, with the tract coordinated with definitive care. Enhancement and the solid component help choose a diagnostic target; fluid-like center or adjacent edema can be unrepresentative. The service setting and sampling method are held constant here.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.planned-biopsy",
        "claim.soft-tissue-mass.mri",
        "claim.qq20261102a.sarcoma-viable-biopsy-target"
      ],
      "teachingPoint": "A planned core biopsy should obtain representative viable tissue, with the tract coordinated with definitive care. Enhancement and the solid component help choose a diagnostic target; fluid-like center or adjacent edema can be unrepresentative. The service setting and sampling method are held constant here."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with an enlarging extremity mass. Ultrasound places its superficial margin beneath the investing fascia, but cannot show the deep margin.",
    "previousPresentation": "{patientName}, a 52-year-old woman, visits the clinic with an enlarging mass in the upper arm. On examination the lesion lies deep to the freely mobile skin.",
    "previousProfilePresentations": [
      {
        "id": "profile.soft-tissue-mass.upper-arm.female.52",
        "presentation": "{patientName}, a 52-year-old woman, visits the clinic with an enlarging mass in the upper arm. On examination the lesion lies deep to the freely mobile skin."
      },
      {
        "id": "profile.soft-tissue-mass.upper-arm.male.52",
        "presentation": "{patientName}, a 52-year-old man, visits the clinic with an enlarging mass in the upper arm. On examination the lesion lies deep to the freely mobile skin."
      },
      {
        "id": "profile.soft-tissue-mass.upper-arm.female.56",
        "presentation": "{patientName}, a 56-year-old woman, visits the clinic with an enlarging mass in the upper arm. On examination the lesion lies deep to the freely mobile skin."
      },
      {
        "id": "profile.soft-tissue-mass.upper-arm.male.56",
        "presentation": "{patientName}, a 56-year-old man, visits the clinic with an enlarging mass in the upper arm. On examination the lesion lies deep to the freely mobile skin."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.soft-tissue-mass.upper-arm",
        "patientPresentationVariantId": "presentation.soft-tissue-mass.upper-arm",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Enlarging limb mass",
        "revisedPresentation": "{patientName}, a 52-year-old woman, visits the clinic with an enlarging mass in the upper arm. On examination the lesion lies deep to the freely mobile skin.",
        "revisedFields": [
          "chiefComplaint",
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.soft-tissue-mass.upper-arm.female.52",
            "approvedInstantiationProfileId": "profile.soft-tissue-mass.upper-arm.female.52",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 52-year-old woman, visits the clinic with an enlarging mass in the upper arm. On examination the lesion lies deep to the freely mobile skin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.soft-tissue-mass.upper-arm.male.52",
            "approvedInstantiationProfileId": "profile.soft-tissue-mass.upper-arm.male.52",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 52-year-old man, visits the clinic with an enlarging mass in the upper arm. On examination the lesion lies deep to the freely mobile skin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.soft-tissue-mass.upper-arm.female.56",
            "approvedInstantiationProfileId": "profile.soft-tissue-mass.upper-arm.female.56",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 56-year-old woman, visits the clinic with an enlarging mass in the upper arm. On examination the lesion lies deep to the freely mobile skin.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.soft-tissue-mass.upper-arm.male.56",
            "approvedInstantiationProfileId": "profile.soft-tissue-mass.upper-arm.male.56",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 56-year-old man, visits the clinic with an enlarging mass in the upper arm. On examination the lesion lies deep to the freely mobile skin.",
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
        "ageYears": 52,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b20-context",
    "auditId": "B20-context",
    "caseId": "case.soft-tissue-mass.upper-arm",
    "nodeId": "node.soft-tissue-mass.upper-arm.1",
    "previousQuestionVariantId": "question.soft-tissue-mass.extremity-mri.v2.r2",
    "questionVariantId": "question.soft-tissue-mass.extremity-mri.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which imaging study should characterize {patientName}'s limb mass before tissue sampling?",
    "previousChoiceLabels": [
      "Dedicated MRI of the involved extremity",
      "Focused ultrasound of the mass",
      "Plain radiographs of the involved extremity",
      "Noncontrast CT of the involved extremity"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Use the actual fascia/deep-margin observations rather than equating 'below skin' with subfascial depth. Then Select local soft-tissue characterization before biopsy rather than adding only vascular assessment.",
    "reviewerNotes": "Ordinary MRI/contrast suitability is assumed. No size threshold or future MRI result is used to justify this earlier choice.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "extremity_mri_2": "extremity_mri_2",
      "choice.qq20261102a.b20-context.d1": "repeat_ultrasound_2",
      "choice.qq20261102a.b20-context.d2": "plain_radiograph_2"
    },
    "choiceServiceOverrides": {
      "extremity_mri_2": "service.extremity_mri",
      "choice.qq20261102a.b20-context.d1": null,
      "choice.qq20261102a.b20-context.d2": null
    },
    "choiceTimingOverrides": {
      "extremity_mri_2": {
        "kind": "test",
        "timingProfileId": "timing.test.mri"
      },
      "choice.qq20261102a.b20-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b20-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.soft-tissue-mass.extremity-mri.v2.r2",
      "whatChanged": "Establish actual fascial depth from prior ultrasound and compare parallel local imaging protocols before biopsy.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B20-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: All protocols include comparable technical detail; 'dedicated' and the uniquely limited noncontrast CT label are removed.",
          "cues 2: All protocols include comparable technical detail; 'dedicated' and the uniquely limited noncontrast CT label are removed."
        ],
        "fairness": [
          "fairness 1: Require: Use the actual fascia/deep-margin observations rather than equating 'below skin' with subfascial depth. Then Select local soft-tissue characterization before biopsy rather than adding only vascular assessment. The closest error is: Repeating ultrasound with Doppler because it was the initial triage study is plausible but does not answer the extent question.",
          "fairness 2: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling.",
          "fairness 3: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling. Review boundary: Ordinary MRI/contrast suitability is assumed. No size threshold or future MRI result is used to justify this earlier choice.",
          "fairness 4: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling."
        ],
        "suggestions": [
          "suggestions 1: The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling. Review boundary: Ordinary MRI/contrast suitability is assumed. No size threshold or future MRI result is used to justify this earlier choice.",
          "suggestions 2: Establish actual fascial depth from prior ultrasound and compare parallel local imaging protocols before biopsy.",
          "suggestions 3: All protocols include comparable technical detail; 'dedicated' and the uniquely limited noncontrast CT label are removed. Establish actual fascial depth from prior ultrasound and compare parallel local imaging protocols before biopsy."
        ]
      },
      "selfCheck": {
        "cueAttack": "All protocols include comparable technical detail; 'dedicated' and the uniquely limited noncontrast CT label are removed.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Use the actual fascia/deep-margin observations rather than equating 'below skin' with subfascial depth.",
          "Select local soft-tissue characterization before biopsy rather than adding only vascular assessment."
        ],
        "oneBestAnswer": "The lesion is already demonstrated to be subfascial with undefined deep extent, supporting MRI before tissue sampling.",
        "closestDistractor": "Repeating ultrasound with Doppler because it was the initial triage study is plausible but does not answer the extent question.",
        "remainingReview": "Ordinary MRI/contrast suitability is assumed. No size threshold or future MRI result is used to justify this earlier choice."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.soft-tissue-mass.extremity-mri.v2.r3",
      "conceptId": "concept.soft-tissue-mass.extremity-mri",
      "stem": "Which local characterization study should precede tissue sampling of {patientName}'s mass?",
      "answerChoices": [
        {
          "id": "extremity_mri_2",
          "label": "Extremity MRI before and after intravenous contrast",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Defines the deep lesion and adjacent compartments before biopsy; ultrasound has not shown its deep extent."
        },
        {
          "id": "choice.qq20261102a.b20-context.d1",
          "label": "Extremity CT before and after intravenous contrast",
          "isCorrect": false,
          "distractorRationale": "Is a plausible cross-sectional alternative but does not replace the preferred soft-tissue local characterization in this setting."
        },
        {
          "id": "choice.qq20261102a.b20-context.d2",
          "label": "Extremity ultrasound with color-flow and spectral Doppler",
          "isCorrect": false,
          "distractorRationale": "Can add vascular information but does not resolve the unvisualized deep extent of this demonstrated subfascial lesion."
        }
      ],
      "explanation": "The prior examination establishes that the lesion lies below the investing fascia and that its deep extent is not defined. Local MRI characterization should precede biopsy planning. An ultrasound description merely below mobile skin would not have established that depth.",
      "supportingEvidenceClaimIds": [
        "claim.soft-tissue-mass.mri",
        "claim.qq20261102a.sarcoma-local-imaging"
      ],
      "teachingPoint": "The prior examination establishes that the lesion lies below the investing fascia and that its deep extent is not defined. Local MRI characterization should precede biopsy planning. An ultrasound description merely below mobile skin would not have established that depth."
    },
    "previousResultNarrative": "MRI shows a deep mass extending between muscle compartments, with heterogeneous internal enhancement.",
    "resultNarrative": "MRI shows a mass within muscle. Region A is solid tissue at its edge and takes up contrast. Region B is central fluid-like material that does not take up contrast. Region C is nearby muscle with diffuse high fluid-sensitive signal, without a discrete mass."
  },
  {
    "id": "revision.qq20261102a.b21",
    "auditId": "B21",
    "caseId": "case.l2.colonic-lipoma.direct.typical-a",
    "nodeId": "node.colonic-lipoma.management.patient-to-plan.v1",
    "previousQuestionVariantId": "question.colonic-lipoma.management.patient-to-plan.v1.r2",
    "questionVariantId": "question.colonic-lipoma.management.patient-to-plan.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which lesion-directed follow-up plan should be recommended for {patientName}?",
    "previousChoiceLabels": [
      "Continue ordinary screening",
      "Schedule lesion surveillance",
      "Arrange endoscopic removal"
    ],
    "previousCurrentUpdate": "{patientName} reports unchanged bowel habits and has not noticed pain or rectal bleeding.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Integrate surface behavior with the layer and internal echo pattern to recognize a lipoma. Then Apply the no-lesion-directed-follow-up boundary in an asymptomatic, convincingly characterized lesion.",
    "reviewerNotes": "Melissa must confirm the certainty boundary and absence of a separate screening/symptom indication. The passed core decision is retained, not redesigned.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "no_directed_treatment_or_surveillance": "no_directed_treatment_or_surveillance",
      "choice.qq20261102a.b21.d1": "choice.qq20261102.b21.d1",
      "choice.qq20261102a.b21.d2": "choice.qq20261102.b21.d2"
    },
    "choiceServiceOverrides": {
      "no_directed_treatment_or_surveillance": null,
      "choice.qq20261102a.b21.d1": null,
      "choice.qq20261102a.b21.d2": null
    },
    "choiceTimingOverrides": {
      "no_directed_treatment_or_surveillance": {
        "kind": "no_test"
      },
      "choice.qq20261102a.b21.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.lower_endoscopy"
      },
      "choice.qq20261102a.b21.d2": {
        "kind": "no_test"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colonic-lipoma.management.patient-to-plan.v1.r2",
      "whatChanged": "PASS retained with note-specific clarification of lesion-directed scope. Shared context gains supported EUS data; replace the now-redundant EUS alternative in B22.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B21",
      "originalVerdict": "PASS",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Require: Integrate surface behavior with the layer and internal echo pattern to recognize a lipoma. Then Apply the no-lesion-directed-follow-up boundary in an asymptomatic, convincingly characterized lesion. The closest error is: Demanding tissue or surveillance despite a convincing noninvasive characterization is plausible.",
          "fairness 2: Require: Integrate surface behavior with the layer and internal echo pattern to recognize a lipoma. Then Apply the no-lesion-directed-follow-up boundary in an asymptomatic, convincingly characterized lesion. The closest error is: Demanding tissue or surveillance despite a convincing noninvasive characterization is plausible.",
          "fairness 3: The combined findings support diagnostic confidence and the original asymptomatic management boundary; no screening interval is inferred from age. Review boundary: Melissa must confirm the certainty boundary and absence of a separate screening/symptom indication. The passed core decision is retained, not redesigned.",
          "fairness 4: The combined findings support diagnostic confidence and the original asymptomatic management boundary; no screening interval is inferred from age.",
          "fairness 5: The combined findings support diagnostic confidence and the original asymptomatic management boundary; no screening interval is inferred from age."
        ],
        "suggestions": [
          "suggestions 1: PASS retained with note-specific clarification of lesion-directed scope. Shared context gains supported EUS data; replace the now-redundant EUS alternative in B22.",
          "suggestions 2: The combined findings support diagnostic confidence and the original asymptomatic management boundary; no screening interval is inferred from age. Review boundary: Melissa must confirm the certainty boundary and absence of a separate screening/symptom indication. The passed core decision is retained, not redesigned.",
          "suggestions 3: The combined findings support diagnostic confidence and the original asymptomatic management boundary; no screening interval is inferred from age. Review boundary: Melissa must confirm the certainty boundary and absence of a separate screening/symptom indication. The passed core decision is retained, not redesigned."
        ]
      },
      "selfCheck": {
        "cueAttack": "Preserve the PASS inference and symptom status. Clarify the key's scope and do not offer a repeat of the ultrasound that has just supplied confidence.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Integrate surface behavior with the layer and internal echo pattern to recognize a lipoma.",
          "Apply the no-lesion-directed-follow-up boundary in an asymptomatic, convincingly characterized lesion."
        ],
        "oneBestAnswer": "The combined findings support diagnostic confidence and the original asymptomatic management boundary; no screening interval is inferred from age.",
        "closestDistractor": "Demanding tissue or surveillance despite a convincing noninvasive characterization is plausible.",
        "remainingReview": "Melissa must confirm the certainty boundary and absence of a separate screening/symptom indication. The passed core decision is retained, not redesigned."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colonic-lipoma.management.patient-to-plan.v1.r3",
      "conceptId": "concept.colonic-lipoma.asymptomatic-management",
      "stem": "Which lesion-directed care plan should be recommended for {patientName}?",
      "answerChoices": [
        {
          "id": "no_directed_treatment_or_surveillance",
          "label": "No additional lesion-specific follow-up",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Retains the passed management inference for a confidently characterized asymptomatic lipoma, without assigning an age-based screening interval."
        },
        {
          "id": "choice.qq20261102a.b21.d1",
          "label": "Scheduled lesion-specific endoscopic surveillance",
          "isCorrect": false,
          "distractorRationale": "Adds lesion-directed evaluation despite the convincing integrated endoscopic and sonographic phenotype."
        },
        {
          "id": "choice.qq20261102a.b21.d2",
          "label": "Endoscopic removal of the subepithelial lesion",
          "isCorrect": false,
          "distractorRationale": "Treats a confidently characterized asymptomatic lesion without a supplied symptom or diagnostic-uncertainty indication."
        }
      ],
      "explanation": "The observed deformable yellow subepithelial phenotype supports lipoma. A clearly characterized asymptomatic lipoma does not need lesion-directed treatment or dedicated surveillance; other colonoscopy findings and ordinary screening indications still matter.",
      "supportingEvidenceClaimIds": [
        "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
        "claim.colonic-lipoma.clear-asymptomatic.no-directed-follow-up",
        "claim.colonic-lipoma.symptoms-or-uncertainty-change-pathway",
        "claim.qq20261102a.subepithelial-integrated-pattern"
      ],
      "teachingPoint": "The observed deformable yellow subepithelial phenotype supports lipoma. A clearly characterized asymptomatic lipoma does not need lesion-directed treatment or dedicated surveillance; other colonoscopy findings and ordinary screening indications still matter."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic to review colonoscopy findings. A smooth yellowish subepithelial lesion indents under closed forceps and returns to shape when pressure is released. The mucosa is intact. Endoscopic ultrasound shows a uniformly bright lesion in the third wall layer, without internal fluid spaces.",
    "previousPresentation": "{patientName}, a 43-year-old woman, visits the clinic to review colonoscopy findings. A smooth yellowish subepithelial lesion indents under closed forceps and returns to its shape when pressure is released. The overlying mucosa is intact.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.l2.colonic-lipoma.direct.typical-a",
        "patientPresentationVariantId": "presentation.colonic-lipoma.direct.typical-a",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Colonic lesion",
        "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic to review colonoscopy findings. A smooth yellowish subepithelial lesion indents under closed forceps and returns to its shape when pressure is released. The overlying mucosa is intact.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b21-context",
    "auditId": "B21-context",
    "caseId": "case.l2.colonic-lipoma.direct.typical-a",
    "nodeId": "node.colonic-lipoma.recognition.patient-to-diagnosis.v1",
    "previousQuestionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r2",
    "questionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which diagnosis best explains {patientName}'s colonic lesion at endoscopy?",
    "previousChoiceLabels": [
      "Colonic lipoma",
      "Adenomatous polyp",
      "Colonic neuroendocrine tumor",
      "Gastrointestinal stromal tumor"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Interpret wall layer and solid-versus-cystic/echo characteristics. Then Integrate those findings with compressibility to distinguish closer subepithelial alternatives.",
    "reviewerNotes": "Melissa/endoscopy must verify the synthetic EUS description. Feedback must not supply the subsequent no-follow-up decision.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "colonic_lipoma": "colonic_lipoma",
      "choice.qq20261102a.b21-context.d1": "adenomatous_polyp",
      "choice.qq20261102a.b21-context.d2": "colonic_neuroendocrine_tumor"
    },
    "choiceServiceOverrides": {
      "colonic_lipoma": null,
      "choice.qq20261102a.b21-context.d1": null,
      "choice.qq20261102a.b21-context.d2": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r2",
      "whatChanged": "Use a supported second modality and closer subepithelial differentials; require integration rather than naming a classic endoscopic sign.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B21-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Remove a one-sign/eponym-style recognition contest. All options are subepithelial lesions, including a genuinely compressible competitor; no diagnosis name appears in the case. Use a supported second modality and closer subepithelial differentials; require integration rather than naming a classic endoscopic sign.",
          "fairness 2: Only lipoma fits the integrated layer, internal echo and surface observations among these alternatives. Review boundary: Melissa/endoscopy must verify the synthetic EUS description. Feedback must not supply the subsequent no-follow-up decision.",
          "fairness 3: Require: Interpret wall layer and solid-versus-cystic/echo characteristics. Then Integrate those findings with compressibility to distinguish closer subepithelial alternatives. The closest error is: Calling any deformable submucosal lesion lymphangioma without checking for fluid spaces is plausible.",
          "fairness 4: Only lipoma fits the integrated layer, internal echo and surface observations among these alternatives."
        ],
        "suggestions": [
          "suggestions 1: Require: Interpret wall layer and solid-versus-cystic/echo characteristics. Then Integrate those findings with compressibility to distinguish closer subepithelial alternatives. The closest error is: Calling any deformable submucosal lesion lymphangioma without checking for fluid spaces is plausible.",
          "suggestions 2: Only lipoma fits the integrated layer, internal echo and surface observations among these alternatives. Review boundary: Melissa/endoscopy must verify the synthetic EUS description. Feedback must not supply the subsequent no-follow-up decision.",
          "suggestions 3: Use a supported second modality and closer subepithelial differentials; require integration rather than naming a classic endoscopic sign."
        ]
      },
      "selfCheck": {
        "cueAttack": "Remove a one-sign/eponym-style recognition contest. All options are subepithelial lesions, including a genuinely compressible competitor; no diagnosis name appears in the case.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret wall layer and solid-versus-cystic/echo characteristics.",
          "Integrate those findings with compressibility to distinguish closer subepithelial alternatives."
        ],
        "oneBestAnswer": "Only lipoma fits the integrated layer, internal echo and surface observations among these alternatives.",
        "closestDistractor": "Calling any deformable submucosal lesion lymphangioma without checking for fluid spaces is plausible.",
        "remainingReview": "Melissa/endoscopy must verify the synthetic EUS description. Feedback must not supply the subsequent no-follow-up decision."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r3",
      "conceptId": "concept.colonic-lipoma.endoscopic-recognition",
      "stem": "Which diagnosis best integrates {patientName}'s endoscopic and wall-layer findings?",
      "answerChoices": [
        {
          "id": "colonic_lipoma",
          "label": "Colonic lipoma",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Combines compressibility/yellow surface with a uniform hyperechoic submucosal lesion."
        },
        {
          "id": "choice.qq20261102a.b21-context.d1",
          "label": "Colonic lymphangioma",
          "isCorrect": false,
          "distractorRationale": "Can be deformable and submucosal, but ordinarily has fluid-containing/cystic internal spaces rather than the supplied uniform bright solid pattern."
        },
        {
          "id": "choice.qq20261102a.b21-context.d2",
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
    "id": "revision.qq20261102a.b22",
    "auditId": "B22",
    "caseId": "case.l2.colonic-lipoma.direct.typical-b",
    "nodeId": "node.colonic-lipoma.management.patient-to-plan.v2",
    "previousQuestionVariantId": "question.colonic-lipoma.management.patient-to-plan.v2.r2",
    "questionVariantId": "question.colonic-lipoma.management.patient-to-plan.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which lesion-directed follow-up plan should be recommended for {patientName}?",
    "previousChoiceLabels": [
      "Continue ordinary screening",
      "Arrange endoscopic ultrasound",
      "Arrange endoscopic removal"
    ],
    "previousCurrentUpdate": "{patientName} reports unchanged bowel habits and has not noticed pain or rectal bleeding.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Integrate surface behavior with the layer and internal echo pattern to recognize a lipoma. Then Apply the no-lesion-directed-follow-up boundary in an asymptomatic, convincingly characterized lesion.",
    "reviewerNotes": "Melissa must confirm the certainty boundary and absence of a separate screening/symptom indication. The passed core decision is retained, not redesigned.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "no_lesion_specific_follow_up": "no_lesion_specific_follow_up",
      "choice.qq20261102a.b22.d1": "choice.qq20261102.b22.d1",
      "choice.qq20261102a.b22.d2": "choice.qq20261102.b22.d2"
    },
    "choiceServiceOverrides": {
      "no_lesion_specific_follow_up": null,
      "choice.qq20261102a.b22.d1": null,
      "choice.qq20261102a.b22.d2": null
    },
    "choiceTimingOverrides": {
      "no_lesion_specific_follow_up": {
        "kind": "no_test"
      },
      "choice.qq20261102a.b22.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.lower_endoscopy"
      },
      "choice.qq20261102a.b22.d2": {
        "kind": "no_test"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colonic-lipoma.management.patient-to-plan.v2.r2",
      "whatChanged": "PASS retained with note-specific clarification of lesion-directed scope. Shared context gains supported EUS data; replace the now-redundant EUS alternative in B22.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B22",
      "originalVerdict": "PASS",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Require: Integrate surface behavior with the layer and internal echo pattern to recognize a lipoma. Then Apply the no-lesion-directed-follow-up boundary in an asymptomatic, convincingly characterized lesion. The closest error is: Demanding tissue or surveillance despite a convincing noninvasive characterization is plausible.",
          "fairness 2: Require: Integrate surface behavior with the layer and internal echo pattern to recognize a lipoma. Then Apply the no-lesion-directed-follow-up boundary in an asymptomatic, convincingly characterized lesion. The closest error is: Demanding tissue or surveillance despite a convincing noninvasive characterization is plausible.",
          "fairness 3: The combined findings support diagnostic confidence and the original asymptomatic management boundary; no screening interval is inferred from age. Review boundary: Melissa must confirm the certainty boundary and absence of a separate screening/symptom indication. The passed core decision is retained, not redesigned.",
          "fairness 4: The combined findings support diagnostic confidence and the original asymptomatic management boundary; no screening interval is inferred from age.",
          "fairness 5: The combined findings support diagnostic confidence and the original asymptomatic management boundary; no screening interval is inferred from age."
        ],
        "suggestions": [
          "suggestions 1: PASS retained with note-specific clarification of lesion-directed scope. Shared context gains supported EUS data; replace the now-redundant EUS alternative in B22.",
          "suggestions 2: The combined findings support diagnostic confidence and the original asymptomatic management boundary; no screening interval is inferred from age. Review boundary: Melissa must confirm the certainty boundary and absence of a separate screening/symptom indication. The passed core decision is retained, not redesigned.",
          "suggestions 3: The combined findings support diagnostic confidence and the original asymptomatic management boundary; no screening interval is inferred from age. Review boundary: Melissa must confirm the certainty boundary and absence of a separate screening/symptom indication. The passed core decision is retained, not redesigned."
        ]
      },
      "selfCheck": {
        "cueAttack": "Preserve the PASS inference and symptom status. Clarify the key's scope and do not offer a repeat of the ultrasound that has just supplied confidence.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Integrate surface behavior with the layer and internal echo pattern to recognize a lipoma.",
          "Apply the no-lesion-directed-follow-up boundary in an asymptomatic, convincingly characterized lesion."
        ],
        "oneBestAnswer": "The combined findings support diagnostic confidence and the original asymptomatic management boundary; no screening interval is inferred from age.",
        "closestDistractor": "Demanding tissue or surveillance despite a convincing noninvasive characterization is plausible.",
        "remainingReview": "Melissa must confirm the certainty boundary and absence of a separate screening/symptom indication. The passed core decision is retained, not redesigned."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colonic-lipoma.management.patient-to-plan.v2.r3",
      "conceptId": "concept.colonic-lipoma.asymptomatic-management",
      "stem": "Which lesion-directed care plan should be recommended for {patientName}?",
      "answerChoices": [
        {
          "id": "no_lesion_specific_follow_up",
          "label": "No additional lesion-specific follow-up",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Retains the passed management inference for a confidently characterized asymptomatic lipoma, without assigning an age-based screening interval."
        },
        {
          "id": "choice.qq20261102a.b22.d1",
          "label": "Repeat endoscopy with targeted tissue sampling",
          "isCorrect": false,
          "distractorRationale": "Adds lesion-directed evaluation despite the convincing integrated endoscopic and sonographic phenotype."
        },
        {
          "id": "choice.qq20261102a.b22.d2",
          "label": "Endoscopic removal of the subepithelial lesion",
          "isCorrect": false,
          "distractorRationale": "Treats a confidently characterized asymptomatic lesion without a supplied symptom or diagnostic-uncertainty indication."
        }
      ],
      "explanation": "The observed deformable yellow subepithelial phenotype supports lipoma. A clearly characterized asymptomatic lipoma does not need lesion-directed treatment or dedicated surveillance; other colonoscopy findings and ordinary screening indications still matter.",
      "supportingEvidenceClaimIds": [
        "claim.colonic-lipoma.characteristic-endoscopic-phenotype",
        "claim.colonic-lipoma.clear-asymptomatic.no-directed-follow-up",
        "claim.colonic-lipoma.symptoms-or-uncertainty-change-pathway",
        "claim.qq20261102a.subepithelial-integrated-pattern"
      ],
      "teachingPoint": "The observed deformable yellow subepithelial phenotype supports lipoma. A clearly characterized asymptomatic lipoma does not need lesion-directed treatment or dedicated surveillance; other colonoscopy findings and ordinary screening indications still matter."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic to review colonoscopy findings. A smooth yellowish subepithelial lesion indents under closed forceps and returns to shape when pressure is released. The mucosa is intact. Endoscopic ultrasound shows a uniformly bright lesion in the third wall layer, without internal fluid spaces.",
    "previousPresentation": "{patientName}, a 43-year-old woman, visits the clinic to review colonoscopy findings. A smooth yellowish subepithelial lesion indents under closed forceps and returns to its shape when pressure is released. The overlying mucosa is intact.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.l2.colonic-lipoma.direct.typical-b",
        "patientPresentationVariantId": "presentation.colonic-lipoma.direct.typical-b",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Colonic lesion",
        "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic to review colonoscopy findings. A smooth yellowish subepithelial lesion indents under closed forceps and returns to its shape when pressure is released. The overlying mucosa is intact.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b22-context",
    "auditId": "B22-context",
    "caseId": "case.l2.colonic-lipoma.direct.typical-b",
    "nodeId": "node.colonic-lipoma.recognition.patient-to-diagnosis.v2",
    "previousQuestionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r2",
    "questionVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which diagnosis best explains {patientName}'s colonic lesion at endoscopy?",
    "previousChoiceLabels": [
      "Colonic lipoma",
      "Colonic adenocarcinoma",
      "Inflammatory polyp",
      "Colonic neuroendocrine tumor"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Interpret wall layer and solid-versus-cystic/echo characteristics. Then Integrate those findings with compressibility to distinguish closer subepithelial alternatives.",
    "reviewerNotes": "Melissa/endoscopy must verify the synthetic EUS description. Feedback must not supply the subsequent no-follow-up decision.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "colonic_lipoma": "colonic_lipoma",
      "choice.qq20261102a.b22-context.d1": "colonic_adenocarcinoma",
      "choice.qq20261102a.b22-context.d2": "inflammatory_polyp"
    },
    "choiceServiceOverrides": {
      "colonic_lipoma": null,
      "choice.qq20261102a.b22-context.d1": null,
      "choice.qq20261102a.b22-context.d2": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r2",
      "whatChanged": "Use a supported second modality and closer subepithelial differentials; require integration rather than naming a classic endoscopic sign.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B22-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Remove a one-sign/eponym-style recognition contest. All options are subepithelial lesions, including a genuinely compressible competitor; no diagnosis name appears in the case. Use a supported second modality and closer subepithelial differentials; require integration rather than naming a classic endoscopic sign.",
          "fairness 2: Only lipoma fits the integrated layer, internal echo and surface observations among these alternatives. Review boundary: Melissa/endoscopy must verify the synthetic EUS description. Feedback must not supply the subsequent no-follow-up decision.",
          "fairness 3: Require: Interpret wall layer and solid-versus-cystic/echo characteristics. Then Integrate those findings with compressibility to distinguish closer subepithelial alternatives. The closest error is: Calling any deformable submucosal lesion lymphangioma without checking for fluid spaces is plausible.",
          "fairness 4: Only lipoma fits the integrated layer, internal echo and surface observations among these alternatives."
        ],
        "suggestions": [
          "suggestions 1: Require: Interpret wall layer and solid-versus-cystic/echo characteristics. Then Integrate those findings with compressibility to distinguish closer subepithelial alternatives. The closest error is: Calling any deformable submucosal lesion lymphangioma without checking for fluid spaces is plausible.",
          "suggestions 2: Only lipoma fits the integrated layer, internal echo and surface observations among these alternatives. Review boundary: Melissa/endoscopy must verify the synthetic EUS description. Feedback must not supply the subsequent no-follow-up decision.",
          "suggestions 3: Use a supported second modality and closer subepithelial differentials; require integration rather than naming a classic endoscopic sign."
        ]
      },
      "selfCheck": {
        "cueAttack": "Remove a one-sign/eponym-style recognition contest. All options are subepithelial lesions, including a genuinely compressible competitor; no diagnosis name appears in the case.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret wall layer and solid-versus-cystic/echo characteristics.",
          "Integrate those findings with compressibility to distinguish closer subepithelial alternatives."
        ],
        "oneBestAnswer": "Only lipoma fits the integrated layer, internal echo and surface observations among these alternatives.",
        "closestDistractor": "Calling any deformable submucosal lesion lymphangioma without checking for fluid spaces is plausible.",
        "remainingReview": "Melissa/endoscopy must verify the synthetic EUS description. Feedback must not supply the subsequent no-follow-up decision."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r3",
      "conceptId": "concept.colonic-lipoma.endoscopic-recognition",
      "stem": "Which diagnosis best integrates {patientName}'s endoscopic and wall-layer findings?",
      "answerChoices": [
        {
          "id": "colonic_lipoma",
          "label": "Colonic lipoma",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Combines compressibility/yellow surface with a uniform hyperechoic submucosal lesion."
        },
        {
          "id": "choice.qq20261102a.b22-context.d1",
          "label": "Colonic lymphangioma",
          "isCorrect": false,
          "distractorRationale": "Can be deformable and submucosal, but ordinarily has fluid-containing/cystic internal spaces rather than the supplied uniform bright solid pattern."
        },
        {
          "id": "choice.qq20261102a.b22-context.d2",
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
    "id": "revision.qq20261102a.b23",
    "auditId": "B23",
    "caseId": "case.l2.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1",
    "nodeId": "node.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1",
    "previousQuestionVariantId": "question.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1.r2",
    "questionVariantId": "question.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which operative plan should be recommended for {patientName}'s gastric cancer?",
    "previousChoiceLabels": [
      "Gastrectomy preserving pancreas and spleen",
      "Gastrectomy preserving pancreas, removing spleen",
      "Gastrectomy removing pancreas and spleen"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret the gastric wall-layer observation rather than receiving a cT label. Then Combine stage-appropriate nodal extent with the distinct question of therapeutic versus prophylactic organ removal.",
    "reviewerNotes": "Melissa must confirm wall staging, operability and surgical scope. The previously withheld hilar-dissection teaching point remains withheld; no pancreatectomy rule is inferred from it.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "avoid_routine_prophylactic_splenectomy": "avoid_routine_prophylactic_splenectomy",
      "choice.qq20261102a.b23.d1": "choice.qq20261102.b23.d1",
      "choice.qq20261102a.b23.d2": "choice.qq20261102.b23.d2",
      "choice.qq20261102a.b23.d3": "choice.qq20261102.b23.d1"
    },
    "choiceServiceOverrides": {
      "avoid_routine_prophylactic_splenectomy": null,
      "choice.qq20261102a.b23.d1": null,
      "choice.qq20261102a.b23.d2": null,
      "choice.qq20261102a.b23.d3": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1.r2",
      "whatChanged": "Replace progressively destructive operations with balanced nodal/organ plans and a raw wall-staging observation; remove redundant organ-exclusion language.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B23",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Four balanced combinations remove the least/middle/most organ-removal shortcut and make nodal/organ components equally frequent. The redundant hilar-node negative is deleted. Replace progressively destructive operations with balanced nodal/organ plans and a raw wall-staging observation; remove redundant organ-exclusion language.",
          "cues 2: The invasive wall stage supports D2 planning while no therapeutic splenic indication is supplied in the stated lesser-curvature anatomy. Review boundary: Melissa must confirm wall staging, operability and surgical scope. The previously withheld hilar-dissection teaching point remains withheld; no pancreatectomy rule is inferred from it."
        ],
        "fairness": [
          "fairness 1: The invasive wall stage supports D2 planning while no therapeutic splenic indication is supplied in the stated lesser-curvature anatomy. Review boundary: Melissa must confirm wall staging, operability and surgical scope. The previously withheld hilar-dissection teaching point remains withheld; no pancreatectomy rule is inferred from it.",
          "fairness 2: The invasive wall stage supports D2 planning while no therapeutic splenic indication is supplied in the stated lesser-curvature anatomy. Review boundary: Melissa must confirm wall staging, operability and surgical scope. The previously withheld hilar-dissection teaching point remains withheld; no pancreatectomy rule is inferred from it.",
          "fairness 3: Require: Interpret the gastric wall-layer observation rather than receiving a cT label. Then Combine stage-appropriate nodal extent with the distinct question of therapeutic versus prophylactic organ removal. The closest error is: Equating D2 surgery with splenectomy, or choosing limited nodal surgery simply to preserve the spleen, is plausible."
        ],
        "suggestions": [
          "suggestions 1: Four balanced combinations remove the least/middle/most organ-removal shortcut and make nodal/organ components equally frequent. The redundant hilar-node negative is deleted. Replace progressively destructive operations with balanced nodal/organ plans and a raw wall-staging observation; remove redundant organ-exclusion language.",
          "suggestions 2: Replace progressively destructive operations with balanced nodal/organ plans and a raw wall-staging observation; remove redundant organ-exclusion language.",
          "suggestions 3: Replace progressively destructive operations with balanced nodal/organ plans and a raw wall-staging observation; remove redundant organ-exclusion language."
        ]
      },
      "selfCheck": {
        "cueAttack": "Four balanced combinations remove the least/middle/most organ-removal shortcut and make nodal/organ components equally frequent. The redundant hilar-node negative is deleted.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the gastric wall-layer observation rather than receiving a cT label.",
          "Combine stage-appropriate nodal extent with the distinct question of therapeutic versus prophylactic organ removal."
        ],
        "oneBestAnswer": "The invasive wall stage supports D2 planning while no therapeutic splenic indication is supplied in the stated lesser-curvature anatomy.",
        "closestDistractor": "Equating D2 surgery with splenectomy, or choosing limited nodal surgery simply to preserve the spleen, is plausible.",
        "remainingReview": "Melissa must confirm wall staging, operability and surgical scope. The previously withheld hilar-dissection teaching point remains withheld; no pancreatectomy rule is inferred from it."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1.r3",
      "conceptId": "concept.gastric-adenocarcinoma.prophylactic-splenectomy-avoidance",
      "stem": "Which operative plan should be discussed for {patientName}?",
      "answerChoices": [
        {
          "id": "avoid_routine_prophylactic_splenectomy",
          "label": "Gastrectomy with D2 lymphadenectomy and spleen preservation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the wall-depth finding with nodal extent while avoiding routine removal of an uninvolved spleen."
        },
        {
          "id": "choice.qq20261102a.b23.d1",
          "label": "Gastrectomy with D1 lymphadenectomy and spleen preservation",
          "isCorrect": false,
          "distractorRationale": "Preserves the organ but underestimates the nodal extent appropriate to the represented invasive stage."
        },
        {
          "id": "choice.qq20261102a.b23.d2",
          "label": "Gastrectomy with D2 lymphadenectomy and splenic resection",
          "isCorrect": false,
          "distractorRationale": "Provides the nodal extent but adds prophylactic organ removal without a supplied therapeutic indication."
        },
        {
          "id": "choice.qq20261102a.b23.d3",
          "label": "Gastrectomy with D1 lymphadenectomy and splenic resection",
          "isCorrect": false,
          "distractorRationale": "Combines an inadequate nodal extent for the represented stage with unindicated splenic removal."
        }
      ],
      "explanation": "The wall-depth observation supports an invasive stage requiring appropriate D2 nodal planning in an experienced service. That does not require routine splenectomy in the represented anatomy. This item does not resolve the separately documented JGCA English splenic-hilar wording discrepancy or prescribe a disputed station-10 rule.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-adenocarcinoma.prophylactic-splenectomy-no-survival-benefit",
        "claim.gastric-adenocarcinoma.prophylactic-splenectomy-increased-morbidity",
        "claim.gastric-adenocarcinoma.spleen-preservation-scope-boundary",
        "claim.qq20261102.gastric-adjacent-organ-scope",
        "claim.qq20261102a.gastric-depth-nodes-organ-plan",
        "claim.qq20261102a.gastric-spleen-preservation"
      ],
      "teachingPoint": "The wall-depth observation supports an invasive stage requiring appropriate D2 nodal planning in an experienced service. That does not require routine splenectomy in the represented anatomy. This item does not resolve the separately documented JGCA English splenic-hilar wording discrepancy or prescribe a disputed station-10 rule."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic for operative planning of a proximal gastric adenocarcinoma on the lesser-curvature side. Endoscopic ultrasound shows interruption of the muscularis-propria layer with the outer gastric contour maintained. CT shows a visible fat strip between the stomach and the pancreas and spleen.",
    "previousPresentation": "{patientName}, a 43-year-old woman, visits the clinic before planned gastrectomy for proximal gastric adenocarcinoma. Endoscopy places the tumor on the lesser-curvature side. CT shows maintained tissue planes between the tumor, pancreas and spleen, with no enlarged splenic-hilar nodes.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.l2.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1",
        "patientPresentationVariantId": "presentation.gastric-adenocarcinoma.post-endoscopy-splenic-referral",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Gastric cancer surgery",
        "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic before planned gastrectomy for proximal gastric adenocarcinoma. Endoscopy places the tumor on the lesser-curvature side. CT shows maintained tissue planes between the tumor, pancreas and spleen, with no enlarged splenic-hilar nodes.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b24",
    "auditId": "B24",
    "caseId": "case.l2.gastric-malt.cd20-boundary.v1",
    "nodeId": "node.gastric-malt.cd20-alone-boundary.v1",
    "previousQuestionVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r2",
    "questionVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which pathology interpretation is supported by {patientName}'s gastric specimen?",
    "previousChoiceLabels": [
      "B-cell infiltrate of undetermined significance",
      "Extranodal marginal-zone B-cell lymphoma",
      "Diffuse large B-cell lymphoma"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret what the marker establishes and what the specimen does not establish. Then Choose an action that repairs the diagnostic limitation rather than a more elaborate test on the same inadequate architecture.",
    "reviewerNotes": "Melissa/pathology must confirm repeat-sampling adequacy and scope. The core message that CD20 alone does not establish MALT is retained; this version applies it to the next action.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "lineage_not_diagnosis": "lineage_not_diagnosis",
      "choice.qq20261102a.b24.d1": "choice.qq20261102.b24.d1",
      "choice.qq20261102a.b24.d2": "choice.qq20261102.b24.d2"
    },
    "choiceServiceOverrides": {
      "lineage_not_diagnosis": null,
      "choice.qq20261102a.b24.d1": null,
      "choice.qq20261102a.b24.d2": null
    },
    "choiceTimingOverrides": {
      "lineage_not_diagnosis": {
        "kind": "test",
        "timingProfileId": "timing.test.endoscopy_with_sampling"
      },
      "choice.qq20261102a.b24.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.pathology_review"
      },
      "choice.qq20261102a.b24.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pathology_review"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-malt.cd20-alone-boundary.v1.r2",
      "whatChanged": "Replace the uncertainty-outlier diagnosis options with three plausible diagnostic strategies; require lineage/architecture interpretation before choosing the next step.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B24",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Every answer is a concrete diagnostic action. There is no sole cautious interpretation against two definitive disease names, and no 'alone' qualifier advertises an incorrect laboratory answer.",
          "cues 2: The missing architecture is not repaired by adding markers or molecular clonality to the same fragments; repeat tissue is the best offered classification strategy. Review boundary: Melissa/pathology must confirm repeat-sampling adequacy and scope. The core message that CD20 alone does not establish MALT is retained; this version applies it to the next action.",
          "cues 3: Every answer is a concrete diagnostic action. There is no sole cautious interpretation against two definitive disease names, and no 'alone' qualifier advertises an incorrect laboratory answer. Replace the uncertainty-outlier diagnosis options with three plausible diagnostic strategies; require lineage/architecture interpretation before choosing the next step."
        ],
        "fairness": [
          "fairness 1: The missing architecture is not repaired by adding markers or molecular clonality to the same fragments; repeat tissue is the best offered classification strategy. Review boundary: Melissa/pathology must confirm repeat-sampling adequacy and scope. The core message that CD20 alone does not establish MALT is retained; this version applies it to the next action.",
          "fairness 2: Require: Interpret what the marker establishes and what the specimen does not establish. Then Choose an action that repairs the diagnostic limitation rather than a more elaborate test on the same inadequate architecture. The closest error is: Treating clonality as a definitive lymphoma/subtype test is a documented diagnostic misconception.",
          "fairness 3: The missing architecture is not repaired by adding markers or molecular clonality to the same fragments; repeat tissue is the best offered classification strategy. Review boundary: Melissa/pathology must confirm repeat-sampling adequacy and scope. The core message that CD20 alone does not establish MALT is retained; this version applies it to the next action."
        ],
        "suggestions": [
          "suggestions 1: The missing architecture is not repaired by adding markers or molecular clonality to the same fragments; repeat tissue is the best offered classification strategy. Review boundary: Melissa/pathology must confirm repeat-sampling adequacy and scope. The core message that CD20 alone does not establish MALT is retained; this version applies it to the next action.",
          "suggestions 2: Replace the uncertainty-outlier diagnosis options with three plausible diagnostic strategies; require lineage/architecture interpretation before choosing the next step.",
          "suggestions 3: Replace the uncertainty-outlier diagnosis options with three plausible diagnostic strategies; require lineage/architecture interpretation before choosing the next step."
        ]
      },
      "selfCheck": {
        "cueAttack": "Every answer is a concrete diagnostic action. There is no sole cautious interpretation against two definitive disease names, and no 'alone' qualifier advertises an incorrect laboratory answer.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret what the marker establishes and what the specimen does not establish.",
          "Choose an action that repairs the diagnostic limitation rather than a more elaborate test on the same inadequate architecture."
        ],
        "oneBestAnswer": "The missing architecture is not repaired by adding markers or molecular clonality to the same fragments; repeat tissue is the best offered classification strategy.",
        "closestDistractor": "Treating clonality as a definitive lymphoma/subtype test is a documented diagnostic misconception.",
        "remainingReview": "Melissa/pathology must confirm repeat-sampling adequacy and scope. The core message that CD20 alone does not establish MALT is retained; this version applies it to the next action."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.cd20-alone-boundary.v1.r3",
      "conceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "stem": "Which next diagnostic action should classify {patientName}'s infiltrate?",
      "answerChoices": [
        {
          "id": "lineage_not_diagnosis",
          "label": "Endoscopic resampling for histology and immunophenotyping",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Obtains the architecture and integrated material needed to distinguish reactive and neoplastic B-cell processes and assign a subtype."
        },
        {
          "id": "choice.qq20261102a.b24.d1",
          "label": "Clonality analysis using immunoglobulin gene-rearrangement testing",
          "isCorrect": false,
          "distractorRationale": "May add information but cannot by itself replace morphologic/clinical correlation; clonal expansions can occur with inflammation."
        },
        {
          "id": "choice.qq20261102a.b24.d2",
          "label": "Expanded immunohistochemical staining of the existing fragments",
          "isCorrect": false,
          "distractorRationale": "Adds markers without repairing the absence of interpretable tissue relationships needed for integrated classification."
        }
      ],
      "explanation": "CD20 supports B-cell lineage, not a complete lymphoma diagnosis. Repeat sampling can restore the morphologic context; additional stains or a clonality result must be interpreted with that context rather than used as automatic subtype labels.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.integrated-pathologic-recognition",
        "claim.qq20261102a.gastric-lineage-not-classification"
      ],
      "teachingPoint": "CD20 supports B-cell lineage, not a complete lymphoma diagnosis. Repeat sampling can restore the morphologic context; additional stains or a clonality result must be interpreted with that context rather than used as automatic subtype labels."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic to review gastric biopsies obtained for dyspepsia. The fragments contain crushed CD20-positive lymphoid cells; intact relationships between cells and glands are not represented in the material.",
    "previousPresentation": "{patientName}, a 43-year-old woman, visits the clinic to review gastric biopsies obtained for dyspepsia. The fragments contain crushed lymphoid cells, many of which stain for CD20; gland architecture cannot be assessed in the fragments.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.l2.gastric-malt.cd20-boundary.v1",
        "patientPresentationVariantId": "presentation.gastric-malt.cd20-alone-boundary",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Gastric biopsy review",
        "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic to review gastric biopsies obtained for dyspepsia. The fragments contain crushed lymphoid cells, many of which stain for CD20; gland architecture cannot be assessed in the fragments.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b25",
    "auditId": "B25",
    "caseId": "case.l2.gastric-malt.profile-to-followup-boundary.v1",
    "nodeId": "node.gastric-malt.eradication-response-reassessment.v1",
    "previousQuestionVariantId": "question.gastric-malt.eradication-response-reassessment.v1.r2",
    "questionVariantId": "question.gastric-malt.eradication-response-reassessment.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which treatment-and-review plan is appropriate for {patientName}'s localized gastric lymphoma?",
    "previousChoiceLabels": [
      "Eradication with planned histologic response assessment",
      "Rituximab with planned radiological response assessment",
      "Antibiotics with symptom-triggered clinical follow-up"
    ],
    "previousCurrentUpdate": "The pathology review identifies low-grade gastric MALT lymphoma. H. pylori testing is positive, and staging confines the disease to the stomach.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Use the confirmed localized infection-associated low-grade disease to choose initial treatment. Then Distinguish eradication/symptom response from histologic lymphoma response.",
    "reviewerNotes": "The pathology context precedes this question; this is treatment plus response assessment rather than independent diagnosis. Melissa must approve the exact follow-up scope.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "eradicate_and_reassess": "eradicate_and_reassess",
      "choice.qq20261102a.b25.d1": "choice.qq20261102.b25.d1",
      "choice.qq20261102a.b25.d2": "choice.qq20261102.b25.d2"
    },
    "choiceServiceOverrides": {
      "eradicate_and_reassess": null,
      "choice.qq20261102a.b25.d1": null,
      "choice.qq20261102a.b25.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-malt.eradication-response-reassessment.v1.r2",
      "whatChanged": "PASS note-specific edits only: identical eradication terminology and deletion of an empty preliminary sentence; retain the original key and two linked decisions.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B25",
      "originalVerdict": "PASS",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: The original eradication-plus-histologic-response plan remains the best offered integrated treatment/follow-up strategy. Review boundary: The pathology context precedes this question; this is treatment plus response assessment rather than independent diagnosis. Melissa must approve the exact follow-up scope.",
          "fairness 2: The original eradication-plus-histologic-response plan remains the best offered integrated treatment/follow-up strategy.",
          "fairness 3: The original eradication-plus-histologic-response plan remains the best offered integrated treatment/follow-up strategy. Review boundary: The pathology context precedes this question; this is treatment plus response assessment rather than independent diagnosis. Melissa must approve the exact follow-up scope.",
          "fairness 4: The original eradication-plus-histologic-response plan remains the best offered integrated treatment/follow-up strategy. Review boundary: The pathology context precedes this question; this is treatment plus response assessment rather than independent diagnosis. Melissa must approve the exact follow-up scope."
        ],
        "suggestions": [
          "suggestions 1: PASS note-specific edits only: identical eradication terminology and deletion of an empty preliminary sentence; retain the original key and two linked decisions.",
          "suggestions 2: PASS retained. Both antibiotic-based choices now name the same adequate eradication treatment; the empty preliminary morphology-review sentence is deleted. PASS note-specific edits only: identical eradication terminology and deletion of an empty preliminary sentence; retain the original key and two linked decisions.",
          "suggestions 3: PASS retained. Both antibiotic-based choices now name the same adequate eradication treatment; the empty preliminary morphology-review sentence is deleted. PASS note-specific edits only: identical eradication terminology and deletion of an empty preliminary sentence; retain the original key and two linked decisions."
        ]
      },
      "selfCheck": {
        "cueAttack": "PASS retained. Both antibiotic-based choices now name the same adequate eradication treatment; the empty preliminary morphology-review sentence is deleted.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Use the confirmed localized infection-associated low-grade disease to choose initial treatment.",
          "Distinguish eradication/symptom response from histologic lymphoma response."
        ],
        "oneBestAnswer": "The original eradication-plus-histologic-response plan remains the best offered integrated treatment/follow-up strategy.",
        "closestDistractor": "Equating symptom relief after adequate eradication with completion of lymphoma assessment is credible.",
        "remainingReview": "The pathology context precedes this question; this is treatment plus response assessment rather than independent diagnosis. Melissa must approve the exact follow-up scope."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.eradication-response-reassessment.v1.r3",
      "conceptId": "concept.gastric-malt-lymphoma.hpylori-eradication-first-line",
      "stem": "Which treatment-and-review plan is appropriate for {patientName}'s localized gastric lymphoma?",
      "answerChoices": [
        {
          "id": "eradicate_and_reassess",
          "label": "H. pylori eradication with planned histologic response assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Retains the passed treatment-plus-response inference: adequate infection treatment is followed by assessment of the lymphoma itself."
        },
        {
          "id": "choice.qq20261102a.b25.d1",
          "label": "Rituximab treatment with planned radiologic response assessment",
          "isCorrect": false,
          "distractorRationale": "Moves systemic lymphoma therapy into routine initial localized infection-associated disease and substitutes a different response assessment."
        },
        {
          "id": "choice.qq20261102a.b25.d2",
          "label": "H. pylori eradication with symptom-triggered clinical reassessment",
          "isCorrect": false,
          "distractorRationale": "Uses the same adequate eradication treatment but mistakes symptom improvement for an adequate lymphoma-response strategy."
        }
      ],
      "explanation": "For the supplied localized H. pylori-positive gastric MALT lymphoma, eradication is initial treatment and must be followed by confirmation of infection clearance and endoscopic/histologic response assessment. Regression can be delayed; progression or transformation changes the pathway.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.hpylori-eradication-initial-localized",
        "claim.gastric-malt.eradication-confirmation-and-response-reassessment",
        "claim.gastric-malt.progression-and-transformation-boundary",
        "claim.qq20261102a.gastric-malt-response-assessment"
      ],
      "teachingPoint": "For the supplied localized H. pylori-positive gastric MALT lymphoma, eradication is initial treatment and must be followed by confirmation of infection clearance and endoscopic/histologic response assessment. Regression can be delayed; progression or transformation changes the pathway."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after gastric biopsies for epigastric discomfort.",
    "previousPresentation": "{patientName}, a 43-year-old woman, visits the clinic after EGD for epigastric discomfort. Gastric biopsy morphology and immunostains have been reviewed together.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.l2.gastric-malt.profile-to-followup-boundary.v1",
        "patientPresentationVariantId": "presentation.gastric-malt.pathology-profile-selection",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Gastric biopsy review",
        "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic after EGD for epigastric discomfort. Gastric biopsy morphology and immunostains have been reviewed together.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b25-context",
    "auditId": "B25-context",
    "caseId": "case.l2.gastric-malt.profile-to-followup-boundary.v1",
    "nodeId": "node.gastric-malt.pathology-profile-selection.v1",
    "previousQuestionVariantId": "question.gastric-malt.pathology-profile-selection.v1.r2",
    "questionVariantId": "question.gastric-malt.pathology-profile-selection.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which gastric biopsy profile supports MALT lymphoma in {patientName}'s pathology review?",
    "previousChoiceLabels": [
      "Small CD20-positive B cells forming lymphoepithelial lesions; CD5, CD10, and cyclin D1 absent",
      "Sheets of large CD20-positive cells with brisk proliferation, destructive growth, and no dominant small-cell infiltrate",
      "Cytokeratin-positive signet-ring cells infiltrating the gastric wall with a prominent desmoplastic stromal response",
      "Small CD5- and cyclin D1-positive B cells expanding the mucosa in a pattern compatible with mantle cell lymphoma"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Infer the B-cell tissue process from the supplied architecture and panel. Then Compare closer small-B-cell subtypes rather than reciting a profile for a named target disease.",
    "reviewerNotes": "Melissa/pathology must verify the full differential and recognize immunophenotypic exceptions. This is a typical-pattern interpretation, not an absolute marker exclusion rule.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "small_b_cells_lel": "small_b_cells_lel",
      "choice.qq20261102a.b25-context.d1": "large_b_cell_sheets",
      "choice.qq20261102a.b25-context.d2": "signet_ring_carcinoma"
    },
    "choiceServiceOverrides": {
      "small_b_cells_lel": null,
      "choice.qq20261102a.b25-context.d1": null,
      "choice.qq20261102a.b25-context.d2": null
    },
    "currentUpdate": "Atypical B cells expand the gastric lamina propria and infiltrate glands. CD20 and CD79a stain the infiltrate; CD5, CD10 and cyclin D1 do not. The specimen does not show sheets of transformed large cells.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-malt.pathology-profile-selection.v1.r2",
      "whatChanged": "Provide actual raw tissue/panel observations and ask for integrated interpretation; remove the named MALT target, self-identifying mantle-cell wording and uneven profile format.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B25-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The combined architecture and typical panel favor MALT-type marginal-zone lymphoma over the offered follicular and mantle-cell patterns. Review boundary: Melissa/pathology must verify the full differential and recognize immunophenotypic exceptions. This is a typical-pattern interpretation, not an absolute marker exclusion rule.",
          "cues 2: The diagnosis is not named in the task or in an option's explanation. All options are gastric small-B-cell lymphoma diagnoses rather than heterogeneous marker-profile paragraphs."
        ],
        "fairness": [
          "fairness 1: The combined architecture and typical panel favor MALT-type marginal-zone lymphoma over the offered follicular and mantle-cell patterns. Review boundary: Melissa/pathology must verify the full differential and recognize immunophenotypic exceptions. This is a typical-pattern interpretation, not an absolute marker exclusion rule.",
          "fairness 2: Require: Infer the B-cell tissue process from the supplied architecture and panel. Then Compare closer small-B-cell subtypes rather than reciting a profile for a named target disease. The closest error is: Overweighting B-cell lineage without integrating gland infiltration and the discriminating panel is plausible.",
          "fairness 3: The combined architecture and typical panel favor MALT-type marginal-zone lymphoma over the offered follicular and mantle-cell patterns. Review boundary: Melissa/pathology must verify the full differential and recognize immunophenotypic exceptions. This is a typical-pattern interpretation, not an absolute marker exclusion rule."
        ],
        "suggestions": [
          "suggestions 1: Provide actual raw tissue/panel observations and ask for integrated interpretation; remove the named MALT target, self-identifying mantle-cell wording and uneven profile format.",
          "suggestions 2: Provide actual raw tissue/panel observations and ask for integrated interpretation; remove the named MALT target, self-identifying mantle-cell wording and uneven profile format.",
          "suggestions 3: Provide actual raw tissue/panel observations and ask for integrated interpretation; remove the named MALT target, self-identifying mantle-cell wording and uneven profile format."
        ]
      },
      "selfCheck": {
        "cueAttack": "The diagnosis is not named in the task or in an option's explanation. All options are gastric small-B-cell lymphoma diagnoses rather than heterogeneous marker-profile paragraphs.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Infer the B-cell tissue process from the supplied architecture and panel.",
          "Compare closer small-B-cell subtypes rather than reciting a profile for a named target disease."
        ],
        "oneBestAnswer": "The combined architecture and typical panel favor MALT-type marginal-zone lymphoma over the offered follicular and mantle-cell patterns.",
        "closestDistractor": "Overweighting B-cell lineage without integrating gland infiltration and the discriminating panel is plausible.",
        "remainingReview": "Melissa/pathology must verify the full differential and recognize immunophenotypic exceptions. This is a typical-pattern interpretation, not an absolute marker exclusion rule."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.pathology-profile-selection.v1.r3",
      "conceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "stem": "Which diagnosis best integrates {patientName}'s tissue architecture and marker pattern?",
      "answerChoices": [
        {
          "id": "small_b_cells_lel",
          "label": "Gastric extranodal marginal-zone lymphoma",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates gland infiltration with the typical B-cell phenotype and absence of markers supporting the closer alternatives."
        },
        {
          "id": "choice.qq20261102a.b25-context.d1",
          "label": "Gastric follicular lymphoma",
          "isCorrect": false,
          "distractorRationale": "Is a closer small-B-cell alternative, but the supplied architecture and absent germinal-center marker do not favor it."
        },
        {
          "id": "choice.qq20261102a.b25-context.d2",
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
    "id": "revision.qq20261102a.b26",
    "auditId": "B26",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-040",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-040.1",
    "previousQuestionVariantId": "question.statistics-ethics.p-value.v2.r2",
    "questionVariantId": "question.statistics-ethics.p-value.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which interpretation of the reported p-value should {patientName} use?",
    "previousChoiceLabels": [
      "A 40% probability of data at least this extreme if the null model holds",
      "A 40% probability that the null model holds after these data are observed",
      "A 40% reduction in outcome probability for the intervention compared with the control"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Fictional teaching dataset; intervention effects are simulated. Null hypothesis: equal outcome probabilities in the two groups.",
      "items": [
        {
          "label": "Analysis",
          "value": "Prespecified comparison of intervention and control"
        },
        {
          "label": "p-value",
          "value": "0.40"
        }
      ]
    },
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Apply the pre-specified two-sided null-test rule to the p-value. Then Independently compare the effect interval, direction and protocol target rather than equating significance with important benefit.",
    "reviewerNotes": "The target and testing level belong to this explicitly hypothetical protocol, not a clinical guideline. Intervals are constructed approximate study outputs; no real efficacy or decision to change patient care is claimed.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_p-040": "correct_p-040",
      "choice.qq20261102a.b26.d1": "choice.qq20261102.b26.d1",
      "choice.qq20261102a.b26.d2": "choice.qq20261102.b26.d2",
      "choice.qq20261102a.b26.d3": "choice.qq20261102.b26.d1"
    },
    "choiceServiceOverrides": {
      "correct_p-040": null,
      "choice.qq20261102a.b26.d1": null,
      "choice.qq20261102a.b26.d2": null,
      "choice.qq20261102a.b26.d3": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.statistics-ethics.p-value.v2.r2",
      "whatChanged": "Replace definition recall with two linked report decisions using effect, uncertainty and an explicit fictional protocol target; balance all four response components. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B26",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Only one pair gets both the null-test decision and the separate interval-versus-target criterion right.",
          "fairness 2: Only one pair gets both the null-test decision and the separate interval-versus-target criterion right. Review boundary: The target and testing level belong to this explicitly hypothetical protocol, not a clinical guideline. Intervals are constructed approximate study outputs; no real efficacy or decision to change patient care is claimed.",
          "fairness 3: Require: Apply the pre-specified two-sided null-test rule to the p-value. Then Independently compare the effect interval, direction and protocol target rather than equating significance with important benefit. The closest error is: A nonsignificant result can tempt an equivalence/no-important-benefit conclusion despite the interval retaining an important benefit.",
          "fairness 4: Only one pair gets both the null-test decision and the separate interval-versus-target criterion right."
        ],
        "suggestions": [
          "suggestions 1: Require: Apply the pre-specified two-sided null-test rule to the p-value. Then Independently compare the effect interval, direction and protocol target rather than equating significance with important benefit. The closest error is: A nonsignificant result can tempt an equivalence/no-important-benefit conclusion despite the interval retaining an important benefit.",
          "suggestions 2: Replace definition recall with two linked report decisions using effect, uncertainty and an explicit fictional protocol target; balance all four response components. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "suggestions 3: Replace definition recall with two linked report decisions using effect, uncertainty and an explicit fictional protocol target; balance all four response components. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting."
        ]
      },
      "selfCheck": {
        "cueAttack": "Four balanced paired conclusions make each cautious/confident component equally frequent. The patient specialty is tied to an endpoint/decision rather than decorating a p-value definition.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Apply the pre-specified two-sided null-test rule to the p-value.",
          "Independently compare the effect interval, direction and protocol target rather than equating significance with important benefit."
        ],
        "oneBestAnswer": "Only one pair gets both the null-test decision and the separate interval-versus-target criterion right.",
        "closestDistractor": "A nonsignificant result can tempt an equivalence/no-important-benefit conclusion despite the interval retaining an important benefit.",
        "remainingReview": "The target and testing level belong to this explicitly hypothetical protocol, not a clinical guideline. Intervals are constructed approximate study outputs; no real efficacy or decision to change patient care is claimed."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v2.r3",
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
          "id": "choice.qq20261102a.b26.d1",
          "label": "Zero-effect hypothesis not rejected; target benefit demonstrated",
          "isCorrect": false,
          "distractorRationale": "Gets the null-test decision right but substitutes statistical significance or the point estimate for the protocol's magnitude criterion."
        },
        {
          "id": "choice.qq20261102a.b26.d2",
          "label": "Zero-effect hypothesis rejected; target benefit unconfirmed",
          "isCorrect": false,
          "distractorRationale": "Handles the magnitude criterion but misreads the pre-specified null test."
        },
        {
          "id": "choice.qq20261102a.b26.d3",
          "label": "Zero-effect hypothesis rejected; target benefit demonstrated",
          "isCorrect": false,
          "distractorRationale": "Conflates the null-test and magnitude decisions."
        }
      ],
      "explanation": "The p-value addresses the specified null test under its model. Whether the interval establishes the hypothetical protocol's target benefit is a separate comparison: negative risk differences favor intervention, and the entire interval must lie beyond the stated benefit target to establish it at this confidence level. Failure to reject a null does not demonstrate that it is true.",
      "teachingPoint": "The p-value addresses the specified null test under its model. Whether the interval establishes the hypothetical protocol's target benefit is a separate comparison: negative risk differences favor intervention, and the entire interval must lie beyond the stated benefit target to establish it at this confidence level. Failure to reject a null does not demonstrate that it is true.",
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
        "claim.qq20261102a.null-test-versus-protocol-magnitude"
      ]
    },
    "presentationTemplate": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The protocol tests a zero risk difference at a two-sided 0.05 level and separately specifies a benefit of at least 4 percentage points for its study decision.",
    "previousPresentation": "{patientName}, the journal-club lead, reviews an investigational rectal-prolapse fixation study. It compares an intervention with a control and reports recurrence within two years.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.gs028se.arr-nnt-p-value.b-p-040",
        "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-040",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedPresentation": "{patientName}, the journal-club lead, reviews an investigational rectal-prolapse fixation study. It compares an intervention with a control and reports recurrence within two years.",
        "revisedFields": [
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "chiefComplaint": "Thyroid surgery study",
    "previousChiefComplaint": "rectal prolapse study",
    "previousProfileChiefComplaints": []
  },
  {
    "id": "revision.qq20261102a.b27",
    "auditId": "B27",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-003",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-003.1",
    "previousQuestionVariantId": "question.statistics-ethics.p-value.v1.r2",
    "questionVariantId": "question.statistics-ethics.p-value.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which interpretation of the reported p-value should {patientName} use?",
    "previousChoiceLabels": [
      "A 3% probability of data at least this extreme if the null model holds",
      "A 3% probability that the null model holds after these data are observed",
      "A 3% reduction in outcome probability for the intervention compared with the control"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Fictional teaching dataset; intervention effects are simulated. Null hypothesis: equal outcome probabilities in the two groups.",
      "items": [
        {
          "label": "Analysis",
          "value": "Prespecified comparison of intervention and control"
        },
        {
          "label": "p-value",
          "value": "0.03"
        }
      ]
    },
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Apply the pre-specified two-sided null-test rule to the p-value. Then Independently compare the effect interval, direction and protocol target rather than equating significance with important benefit.",
    "reviewerNotes": "The target and testing level belong to this explicitly hypothetical protocol, not a clinical guideline. Intervals are constructed approximate study outputs; no real efficacy or decision to change patient care is claimed.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_p-003": "correct_p-003",
      "choice.qq20261102a.b27.d1": "choice.qq20261102.b27.d1",
      "choice.qq20261102a.b27.d2": "choice.qq20261102.b27.d2",
      "choice.qq20261102a.b27.d3": "choice.qq20261102.b27.d1"
    },
    "choiceServiceOverrides": {
      "correct_p-003": null,
      "choice.qq20261102a.b27.d1": null,
      "choice.qq20261102a.b27.d2": null,
      "choice.qq20261102a.b27.d3": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.statistics-ethics.p-value.v1.r2",
      "whatChanged": "Replace definition recall with two linked report decisions using effect, uncertainty and an explicit fictional protocol target; balance all four response components. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B27",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Only one pair gets both the null-test decision and the separate interval-versus-target criterion right.",
          "fairness 2: Only one pair gets both the null-test decision and the separate interval-versus-target criterion right. Review boundary: The target and testing level belong to this explicitly hypothetical protocol, not a clinical guideline. Intervals are constructed approximate study outputs; no real efficacy or decision to change patient care is claimed.",
          "fairness 3: Require: Apply the pre-specified two-sided null-test rule to the p-value. Then Independently compare the effect interval, direction and protocol target rather than equating significance with important benefit. The closest error is: Statistical significance can tempt a claim that a target magnitude is established despite the interval including smaller benefits.",
          "fairness 4: Only one pair gets both the null-test decision and the separate interval-versus-target criterion right."
        ],
        "suggestions": [
          "suggestions 1: Require: Apply the pre-specified two-sided null-test rule to the p-value. Then Independently compare the effect interval, direction and protocol target rather than equating significance with important benefit. The closest error is: Statistical significance can tempt a claim that a target magnitude is established despite the interval including smaller benefits.",
          "suggestions 2: Replace definition recall with two linked report decisions using effect, uncertainty and an explicit fictional protocol target; balance all four response components. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "suggestions 3: Replace definition recall with two linked report decisions using effect, uncertainty and an explicit fictional protocol target; balance all four response components. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting."
        ]
      },
      "selfCheck": {
        "cueAttack": "Four balanced paired conclusions make each cautious/confident component equally frequent. The patient specialty is tied to an endpoint/decision rather than decorating a p-value definition.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Apply the pre-specified two-sided null-test rule to the p-value.",
          "Independently compare the effect interval, direction and protocol target rather than equating significance with important benefit."
        ],
        "oneBestAnswer": "Only one pair gets both the null-test decision and the separate interval-versus-target criterion right.",
        "closestDistractor": "Statistical significance can tempt a claim that a target magnitude is established despite the interval including smaller benefits.",
        "remainingReview": "The target and testing level belong to this explicitly hypothetical protocol, not a clinical guideline. Intervals are constructed approximate study outputs; no real efficacy or decision to change patient care is claimed."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v1.r3",
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
          "id": "choice.qq20261102a.b27.d1",
          "label": "Zero-effect hypothesis rejected; target benefit demonstrated",
          "isCorrect": false,
          "distractorRationale": "Gets the null-test decision right but substitutes statistical significance or the point estimate for the protocol's magnitude criterion."
        },
        {
          "id": "choice.qq20261102a.b27.d2",
          "label": "Zero-effect hypothesis not rejected; target benefit unconfirmed",
          "isCorrect": false,
          "distractorRationale": "Handles the magnitude criterion but misreads the pre-specified null test."
        },
        {
          "id": "choice.qq20261102a.b27.d3",
          "label": "Zero-effect hypothesis not rejected; target benefit demonstrated",
          "isCorrect": false,
          "distractorRationale": "Conflates the null-test and magnitude decisions."
        }
      ],
      "explanation": "The p-value addresses the specified null test under its model. Whether the interval establishes the hypothetical protocol's target benefit is a separate comparison: negative risk differences favor intervention, and the entire interval must lie beyond the stated benefit target to establish it at this confidence level. Failure to reject a null does not demonstrate that it is true.",
      "teachingPoint": "The p-value addresses the specified null test under its model. Whether the interval establishes the hypothetical protocol's target benefit is a separate comparison: negative risk differences favor intervention, and the entire interval must lie beyond the stated benefit target to establish it at this confidence level. Failure to reject a null does not demonstrate that it is true.",
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
        "claim.qq20261102a.null-test-versus-protocol-magnitude"
      ]
    },
    "presentationTemplate": "{patientName} leads an employee journal-club discussion of a constructed randomized colon surgery comparison. The protocol tests a zero risk difference at a two-sided 0.05 level and separately specifies a benefit of at least 4 percentage points for its study decision.",
    "previousPresentation": "{patientName}, the journal-club lead, reviews an investigational gallbladder dissection study. It compares an intervention with a control and reports surgical-site infection within thirty days.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.gs028se.arr-nnt-p-value.b-p-003",
        "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-003",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedPresentation": "{patientName}, the journal-club lead, reviews an investigational gallbladder dissection study. It compares an intervention with a control and reports surgical-site infection within thirty days.",
        "revisedFields": [
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "chiefComplaint": "Colon surgery study",
    "previousChiefComplaint": "acute cholecystitis study",
    "previousProfileChiefComplaints": []
  },
  {
    "id": "revision.qq20261102a.b28",
    "auditId": "B28",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds.1",
    "previousQuestionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v3.r2",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "How should {patientName} describe the reported association estimate?",
    "previousChoiceLabels": [
      "40% lower adjusted odds",
      "40% lower adjusted risk",
      "40 percentage points lower adjusted risk"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Fictional teaching dataset; intervention effects are simulated. Recurrence model; intervention versus control.",
      "items": [
        {
          "label": "Measure",
          "value": "Adjusted odds ratio"
        },
        {
          "label": "Estimate",
          "value": "0.60"
        }
      ]
    },
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Convert the stated reference probability to odds before applying a conditional odds ratio. Then Convert the new odds back to probability and distinguish this from risk-ratio multiplication.",
    "reviewerNotes": "The baseline risk is an explicit fictional model input. Do not infer a population-average or causal benefit from this calculation.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_adjusted-odds": "correct_adjusted-odds",
      "choice.qq20261102a.b28.d1": "choice.qq20261102.b28.d1",
      "choice.qq20261102a.b28.d2": "choice.qq20261102.b28.d2"
    },
    "choiceServiceOverrides": {
      "correct_adjusted-odds": null,
      "choice.qq20261102a.b28.d1": null,
      "choice.qq20261102a.b28.d2": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v3.r2",
      "whatChanged": "Retain honest metric labeling but require conversion through odds using a fixed reference profile; all alternatives now give comparable risks. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B28",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Every option is an event probability in the same format. Copying the word odds from the exhibit no longer selects the key. Retain honest metric labeling but require conversion through odds using a fixed reference profile; all alternatives now give comparable risks. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "cues 2: Every option is an event probability in the same format. Copying the word odds from the exhibit no longer selects the key. Retain honest metric labeling but require conversion through odds using a fixed reference profile; all alternatives now give comparable risks. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting."
        ],
        "fairness": [
          "fairness 1: Only the approximately 29% answer follows the two required odds/probability conversions for the fixed profile.",
          "fairness 2: Only the approximately 29% answer follows the two required odds/probability conversions for the fixed profile.",
          "fairness 3: Require: Convert the stated reference probability to odds before applying a conditional odds ratio. Then Convert the new odds back to probability and distinguish this from risk-ratio multiplication. The closest error is: The 24% answer is the common odds-ratio-as-risk-ratio error at a nonrare baseline event rate."
        ],
        "suggestions": [
          "suggestions 1: Only the approximately 29% answer follows the two required odds/probability conversions for the fixed profile. Review boundary: The baseline risk is an explicit fictional model input. Do not infer a population-average or causal benefit from this calculation.",
          "suggestions 2: Retain honest metric labeling but require conversion through odds using a fixed reference profile; all alternatives now give comparable risks. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "suggestions 3: Retain honest metric labeling but require conversion through odds using a fixed reference profile; all alternatives now give comparable risks. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting."
        ]
      },
      "selfCheck": {
        "cueAttack": "Every option is an event probability in the same format. Copying the word odds from the exhibit no longer selects the key.",
        "difficulty": "hard",
        "reasoningSteps": [
          "Convert the stated reference probability to odds before applying a conditional odds ratio.",
          "Convert the new odds back to probability and distinguish this from risk-ratio multiplication."
        ],
        "oneBestAnswer": "Only the approximately 29% answer follows the two required odds/probability conversions for the fixed profile.",
        "closestDistractor": "The 24% answer is the common odds-ratio-as-risk-ratio error at a nonrare baseline event rate.",
        "remainingReview": "The baseline risk is an explicit fictional model input. Do not infer a population-average or causal benefit from this calculation."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.risk-ratio-odds-ratio.v3.r3",
      "conceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
      "stem": "What intervention event risk does that model predict for the same profile?",
      "answerChoices": [
        {
          "id": "correct_adjusted-odds",
          "label": "About 29% event risk",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Converts reference risk to odds, multiplies by the conditional odds ratio, then converts predicted odds back to risk."
        },
        {
          "id": "choice.qq20261102a.b28.d1",
          "label": "About 24% event risk",
          "isCorrect": false,
          "distractorRationale": "Multiplies the baseline risk directly by the odds ratio as though it were a risk ratio."
        },
        {
          "id": "choice.qq20261102a.b28.d2",
          "label": "About 19% event risk",
          "isCorrect": false,
          "distractorRationale": "Treats the reference probability as baseline odds before applying the odds ratio and converting back."
        }
      ],
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
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.risk-ratio-odds-ratio",
        "claim.qq20261102a.odds-to-risk-conversion"
      ]
    },
    "presentationTemplate": "{patientName} leads an employee study discussion. A fitted logistic model compares intervention with control at the same covariate profile. At that profile the control event risk is 40%; the adjusted intervention-versus-control odds ratio is 0.60.",
    "previousPresentation": "{patientName}, the journal-club lead, reviews an investigational Merkel-cell carcinoma treatment study. A regression model compares recurrence between treatment groups over two years.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds",
        "patientPresentationVariantId": "presentation.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-adjusted-odds",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedPresentation": "{patientName}, the journal-club lead, reviews an investigational Merkel-cell carcinoma treatment study. A regression model compares recurrence between treatment groups over two years.",
        "revisedFields": [
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "chiefComplaint": "Logistic model discussion",
    "previousChiefComplaint": "Merkel cell carcinoma study",
    "previousProfileChiefComplaints": []
  },
  {
    "id": "revision.qq20261102a.b29",
    "auditId": "B29",
    "caseId": "case.variety3.sedation-discharge-ride",
    "nodeId": "node.variety3.sedation-discharge-ride.1",
    "previousQuestionVariantId": "question.variety3.sedation-discharge-ride.v1.r2",
    "questionVariantId": "question.variety3.sedation-discharge-ride.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which transport and home-support arrangement should George Harris plan after gastroscopy with sedation?",
    "previousChoiceLabels": [
      "Adult escort and adult home support",
      "Taxi transfer and unaccompanied home recovery",
      "Self-drive transfer and adult home support"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Recognize that reversal of observed midazolam sedation does not remove the need to assess for recurrent sedation. Then Separately resolve the post-sedation travel/home-support gap rather than equating driver-only transport with a responsible escort.",
    "reviewerNotes": "Melissa/endoscopy must confirm the reversal/recovery scope and support protocol. No arbitrary observation interval, family-only rule or unsedated/nitrous-oxide rule is asserted. The core adult-support objective is retained with a related recovery complication.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "choice.sedation-discharge-ride.adult": "choice.sedation-discharge-ride.adult",
      "choice.qq20261102a.b29.d1": "choice.qq20261102.b29.d1",
      "choice.qq20261102a.b29.d2": "choice.qq20261102.b29.d2",
      "choice.qq20261102a.b29.d3": "choice.qq20261102.b29.d1"
    },
    "choiceServiceOverrides": {
      "choice.sedation-discharge-ride.adult": null,
      "choice.qq20261102a.b29.d1": null,
      "choice.qq20261102a.b29.d2": null,
      "choice.qq20261102a.b29.d3": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.variety3.sedation-discharge-ride.v1.r2",
      "whatChanged": "Retain the fixed George profile; use a reversal/recovery problem and actual support constraint, then compare balanced clinical/logistic plans instead of self-drive/unsupported fillers.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B29",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Only the monitored-recovery plus adult-escort/home-support combination addresses both supplied issues. Review boundary: Melissa/endoscopy must confirm the reversal/recovery scope and support protocol. No arbitrary observation interval, family-only rule or unsedated/nitrous-oxide rule is asserted. The core adult-support objective is retained with a related recovery complication.",
          "cues 2: Four balanced recovery/support combinations make every component equally frequent. Self-driving and a wholly unsupported home are removed; the pharmacologic complication, not a preference, supplies the second inference.",
          "cues 3: Only the monitored-recovery plus adult-escort/home-support combination addresses both supplied issues. Review boundary: Melissa/endoscopy must confirm the reversal/recovery scope and support protocol. No arbitrary observation interval, family-only rule or unsedated/nitrous-oxide rule is asserted. The core adult-support objective is retained with a related recovery complication."
        ],
        "fairness": [
          "fairness 1: Only the monitored-recovery plus adult-escort/home-support combination addresses both supplied issues. Review boundary: Melissa/endoscopy must confirm the reversal/recovery scope and support protocol. No arbitrary observation interval, family-only rule or unsedated/nitrous-oxide rule is asserted. The core adult-support objective is retained with a related recovery complication.",
          "fairness 2: Only the monitored-recovery plus adult-escort/home-support combination addresses both supplied issues.",
          "fairness 3: Require: Recognize that reversal of observed midazolam sedation does not remove the need to assess for recurrent sedation. Then Separately resolve the post-sedation travel/home-support gap rather than equating driver-only transport with a responsible escort. The closest error is: Assuming normal orientation after flumazenil permits immediate discharge, even with an otherwise appropriate escort, is a credible clinical error."
        ],
        "suggestions": [
          "suggestions 1: Only the monitored-recovery plus adult-escort/home-support combination addresses both supplied issues. Review boundary: Melissa/endoscopy must confirm the reversal/recovery scope and support protocol. No arbitrary observation interval, family-only rule or unsedated/nitrous-oxide rule is asserted. The core adult-support objective is retained with a related recovery complication.",
          "suggestions 2: Retain the fixed George profile; use a reversal/recovery problem and actual support constraint, then compare balanced clinical/logistic plans instead of self-drive/unsupported fillers.",
          "suggestions 3: Retain the fixed George profile; use a reversal/recovery problem and actual support constraint, then compare balanced clinical/logistic plans instead of self-drive/unsupported fillers."
        ]
      },
      "selfCheck": {
        "cueAttack": "Four balanced recovery/support combinations make every component equally frequent. Self-driving and a wholly unsupported home are removed; the pharmacologic complication, not a preference, supplies the second inference.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Recognize that reversal of observed midazolam sedation does not remove the need to assess for recurrent sedation.",
          "Separately resolve the post-sedation travel/home-support gap rather than equating driver-only transport with a responsible escort."
        ],
        "oneBestAnswer": "Only the monitored-recovery plus adult-escort/home-support combination addresses both supplied issues.",
        "closestDistractor": "Assuming normal orientation after flumazenil permits immediate discharge, even with an otherwise appropriate escort, is a credible clinical error.",
        "remainingReview": "Melissa/endoscopy must confirm the reversal/recovery scope and support protocol. No arbitrary observation interval, family-only rule or unsedated/nitrous-oxide rule is asserted. The core adult-support objective is retained with a related recovery complication."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.variety3.sedation-discharge-ride.v1.r3",
      "conceptId": "concept.variety3.endoscopic-sedation-escort-planning",
      "stem": "Which discharge arrangement should be booked for George Harris?",
      "answerChoices": [
        {
          "id": "choice.sedation-discharge-ride.adult",
          "label": "Monitor for recurrent sedation; arrange an adult escort and home support",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Accounts for recurrent sedation after reversal as well as the responsible-adult travel/home arrangement."
        },
        {
          "id": "choice.qq20261102a.b29.d1",
          "label": "Discharge when orientation returns; arrange an adult escort and home support",
          "isCorrect": false,
          "distractorRationale": "Provides support but treats immediate reversal of observed sedation as a sufficient recovery endpoint."
        },
        {
          "id": "choice.qq20261102a.b29.d2",
          "label": "Monitor for recurrent sedation; use driver-only transport with remote handover",
          "isCorrect": false,
          "distractorRationale": "Addresses recurrent sedation but mistakes a transport booking and remote handover for an accompanying responsible adult."
        },
        {
          "id": "choice.qq20261102a.b29.d3",
          "label": "Discharge when orientation returns; use driver-only transport with remote handover",
          "isCorrect": false,
          "distractorRationale": "Misreads both the reversal/recovery issue and the accompanying-adult requirement."
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
      ]
    },
    "presentationTemplate": "George Harris, a 67-year-old man, returns to the clinic after gastroscopy with intravenous midazolam. Flumazenil was given when he became difficult to rouse; he is now oriented and walking as usual. His sister will be at home, but the prebooked transport provides a driver only and telephone handover to his sister.",
    "previousPresentation": "George Harris, a 67-year-old man, visits the clinic to arrange an outside gastroscopy with sedation. He asks about travel home and recovery at home.",
    "previousProfilePresentations": [
      {
        "id": "profile.variety3.sedation-discharge-ride.man67",
        "presentation": "George Harris, a 67-year-old man, visits the clinic to arrange an outside gastroscopy with sedation. He asks about travel home and recovery at home."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.variety3.sedation-discharge-ride",
        "patientPresentationVariantId": "presentation.variety3.sedation-discharge-ride",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedPresentation": "George Harris, a 67-year-old man, visits the clinic to arrange an outside gastroscopy with sedation. He asks about travel home and recovery at home.",
        "revisedFields": [
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.variety3.sedation-discharge-ride.man67",
            "approvedInstantiationProfileId": "profile.variety3.sedation-discharge-ride.man67",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "George Harris, a 67-year-old man, visits the clinic to arrange an outside gastroscopy with sedation. He asks about travel home and recovery at home.",
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
        "sexLabel": "Male"
      },
      "patientDisplayName": "George Harris"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b30",
    "auditId": "B30",
    "caseId": "case.l2.gastric-malt.integrated-diagnosis-to-treatment.v1",
    "nodeId": "node.gastric-malt.integrated-pathology-diagnosis.v1",
    "previousQuestionVariantId": "question.gastric-malt.integrated-pathology-diagnosis.v1.r2",
    "questionVariantId": "question.gastric-malt.integrated-pathology-diagnosis.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which lymphoma diagnosis best fits {patientName}'s gastric biopsy?",
    "previousChoiceLabels": [
      "Gastric extranodal marginal-zone lymphoma",
      "Gastric diffuse large B-cell lymphoma",
      "Gastric mantle cell lymphoma"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret gland involvement and the lineage/marker panel together. Then Distinguish the closer small-B-cell lymphoma alternatives rather than matching the word small against a large-cell distractor.",
    "reviewerNotes": "Melissa/pathology must verify wording and subtype discrimination; no immunophenotypic exception is fabricated to create uncertainty.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "gastric_malt": "gastric_malt",
      "choice.qq20261102a.b30.d1": "choice.qq20261102.b30.d1",
      "choice.qq20261102a.b30.d2": "choice.qq20261102.b30.d2"
    },
    "choiceServiceOverrides": {
      "gastric_malt": null,
      "choice.qq20261102a.b30.d1": null,
      "choice.qq20261102a.b30.d2": null
    },
    "currentUpdate": "Atypical B cells expand the gastric lamina propria and infiltrate glands. CD20 and CD79a stain the infiltrate; CD5, CD10 and cyclin D1 do not. The infiltrate contains lymphocytes with irregular nuclei and pale cytoplasm around and within gastric glands.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-malt.integrated-pathology-diagnosis.v1.r2",
      "whatChanged": "Replace the large-cell competitor with a closer small-B-cell differential and require architecture-plus-panel integration.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B30",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: No large-cell diagnosis is eliminated by a size word, and no target diagnosis appears before the task. Morphology and legitimate negative markers remain available for medical reasoning. Replace the large-cell competitor with a closer small-B-cell differential and require architecture-plus-panel integration."
        ],
        "fairness": [
          "fairness 1: The integrated typical pattern supports marginal-zone/MALT rather than the alternative small-B-cell processes. Review boundary: Melissa/pathology must verify wording and subtype discrimination; no immunophenotypic exception is fabricated to create uncertainty.",
          "fairness 2: No large-cell diagnosis is eliminated by a size word, and no target diagnosis appears before the task. Morphology and legitimate negative markers remain available for medical reasoning. Replace the large-cell competitor with a closer small-B-cell differential and require architecture-plus-panel integration.",
          "fairness 3: Require: Interpret gland involvement and the lineage/marker panel together. Then Distinguish the closer small-B-cell lymphoma alternatives rather than matching the word small against a large-cell distractor. The closest error is: Recognizing B cells but misassigning the subtype by one shared feature is plausible.",
          "fairness 4: The integrated typical pattern supports marginal-zone/MALT rather than the alternative small-B-cell processes. Review boundary: Melissa/pathology must verify wording and subtype discrimination; no immunophenotypic exception is fabricated to create uncertainty."
        ],
        "suggestions": [
          "suggestions 1: Replace the large-cell competitor with a closer small-B-cell differential and require architecture-plus-panel integration.",
          "suggestions 2: Replace the large-cell competitor with a closer small-B-cell differential and require architecture-plus-panel integration.",
          "suggestions 3: The integrated typical pattern supports marginal-zone/MALT rather than the alternative small-B-cell processes. Review boundary: Melissa/pathology must verify wording and subtype discrimination; no immunophenotypic exception is fabricated to create uncertainty."
        ]
      },
      "selfCheck": {
        "cueAttack": "No large-cell diagnosis is eliminated by a size word, and no target diagnosis appears before the task. Morphology and legitimate negative markers remain available for medical reasoning.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret gland involvement and the lineage/marker panel together.",
          "Distinguish the closer small-B-cell lymphoma alternatives rather than matching the word small against a large-cell distractor."
        ],
        "oneBestAnswer": "The integrated typical pattern supports marginal-zone/MALT rather than the alternative small-B-cell processes.",
        "closestDistractor": "Recognizing B cells but misassigning the subtype by one shared feature is plausible.",
        "remainingReview": "Melissa/pathology must verify wording and subtype discrimination; no immunophenotypic exception is fabricated to create uncertainty."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.integrated-pathology-diagnosis.v1.r3",
      "conceptId": "concept.gastric-malt-lymphoma.pathologic-recognition",
      "stem": "Which diagnosis best fits {patientName}'s integrated biopsy findings?",
      "answerChoices": [
        {
          "id": "gastric_malt",
          "label": "Gastric extranodal marginal-zone lymphoma",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Integrates the gland-infiltrating marginal-zone-type architecture and typical B-cell marker profile."
        },
        {
          "id": "choice.qq20261102a.b30.d1",
          "label": "Gastric follicular lymphoma",
          "isCorrect": false,
          "distractorRationale": "Requires a different integrated architectural/germinal-center pattern rather than B-cell lineage alone."
        },
        {
          "id": "choice.qq20261102a.b30.d2",
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
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic to review gastric biopsies obtained for dyspepsia.",
    "previousPresentation": "{patientName}, a 43-year-old woman, visits the clinic to review gastric biopsies obtained for dyspepsia. Small lymphocytes expand the lamina propria and enter gastric glands. The cells stain for CD20 and CD79a; CD5 and cyclin D1 staining is not detected.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.l2.gastric-malt.integrated-diagnosis-to-treatment.v1",
        "patientPresentationVariantId": "presentation.gastric-malt.integrated-pathology-diagnosis",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedChiefComplaint": "Gastric biopsy review",
        "revisedPresentation": "{patientName}, a 43-year-old woman, visits the clinic to review gastric biopsies obtained for dyspepsia. Small lymphocytes expand the lamina propria and enter gastric glands. The cells stain for CD20 and CD79a; CD5 and cyclin D1 staining is not detected.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b30-context",
    "auditId": "B30-context",
    "caseId": "case.l2.gastric-malt.integrated-diagnosis-to-treatment.v1",
    "nodeId": "node.gastric-malt.localized-hpylori-positive-initial-treatment.v1",
    "previousQuestionVariantId": "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1.r2",
    "questionVariantId": "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which initial treatment plan should be recommended for {patientName}'s localized H. pylori-positive gastric MALT lymphoma?",
    "previousChoiceLabels": [
      "H. pylori eradication therapy, then response reassessment",
      "Immediate gastrectomy followed by routine postoperative surveillance",
      "Immediate R-CHOP before attempting H. pylori eradication therapy",
      "Definitive gastric radiotherapy without an initial eradication attempt"
    ],
    "previousCurrentUpdate": "An adult has confirmed localized low-grade gastric MALT lymphoma. H. pylori testing is positive, staging shows no disseminated disease, and the biopsy has no large-cell transformation.",
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Use the reviewed subtype, infection and stage to select initial treatment. Then Distinguish symptom/infection improvement from the required assessment of lymphoma response.",
    "reviewerNotes": "The preceding task supplies the diagnosis; the new difficulty is treatment plus response assessment, not independent syndrome inference. Melissa must confirm the response plan.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "eradicate_then_reassess": "eradicate_then_reassess",
      "choice.qq20261102a.b30-context.d1": "immediate_gastrectomy",
      "choice.qq20261102a.b30-context.d2": "immediate_rchop"
    },
    "choiceServiceOverrides": {
      "eradicate_then_reassess": null,
      "choice.qq20261102a.b30-context.d1": null,
      "choice.qq20261102a.b30-context.d2": null
    },
    "currentUpdate": "{patientName}'s reviewed biopsy supports low-grade gastric MALT lymphoma. H. pylori is detected, and staging confines the disease to the stomach.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1.r2",
      "whatChanged": "Name the same patient, retain necessary stage/infection information and compare neutral treatment/assessment strategies rather than advertised omissions of the key.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B30-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Remove before/without bypass language, immediate gastrectomy and the anonymous adult update. Both infection-treatment choices use the same terminology and comparable follow-up detail. Name the same patient, retain necessary stage/infection information and compare neutral treatment/assessment strategies rather than advertised omissions of the key.",
          "cues 2: Remove before/without bypass language, immediate gastrectomy and the anonymous adult update. Both infection-treatment choices use the same terminology and comparable follow-up detail. Name the same patient, retain necessary stage/infection information and compare neutral treatment/assessment strategies rather than advertised omissions of the key.",
          "cues 3: Remove before/without bypass language, immediate gastrectomy and the anonymous adult update. Both infection-treatment choices use the same terminology and comparable follow-up detail. Name the same patient, retain necessary stage/infection information and compare neutral treatment/assessment strategies rather than advertised omissions of the key.",
          "cues 4: Remove before/without bypass language, immediate gastrectomy and the anonymous adult update. Both infection-treatment choices use the same terminology and comparable follow-up detail."
        ],
        "fairness": [
          "fairness 1: Eradication plus histologic response assessment is the complete initial plan among these alternatives. Review boundary: The preceding task supplies the diagnosis; the new difficulty is treatment plus response assessment, not independent syndrome inference. Melissa must confirm the response plan.",
          "fairness 2: Eradication plus histologic response assessment is the complete initial plan among these alternatives.",
          "fairness 3: Eradication plus histologic response assessment is the complete initial plan among these alternatives.",
          "fairness 4: Require: Use the reviewed subtype, infection and stage to select initial treatment. Then Distinguish symptom/infection improvement from the required assessment of lymphoma response. The closest error is: Equating symptom-guided follow-up with adequate lymphoma-response assessment is plausible."
        ],
        "suggestions": [
          "suggestions 1: Eradication plus histologic response assessment is the complete initial plan among these alternatives. Review boundary: The preceding task supplies the diagnosis; the new difficulty is treatment plus response assessment, not independent syndrome inference. Melissa must confirm the response plan.",
          "suggestions 2: Name the same patient, retain necessary stage/infection information and compare neutral treatment/assessment strategies rather than advertised omissions of the key.",
          "suggestions 3: Remove before/without bypass language, immediate gastrectomy and the anonymous adult update. Both infection-treatment choices use the same terminology and comparable follow-up detail. Name the same patient, retain necessary stage/infection information and compare neutral treatment/assessment strategies rather than advertised omissions of the key."
        ]
      },
      "selfCheck": {
        "cueAttack": "Remove before/without bypass language, immediate gastrectomy and the anonymous adult update. Both infection-treatment choices use the same terminology and comparable follow-up detail.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Use the reviewed subtype, infection and stage to select initial treatment.",
          "Distinguish symptom/infection improvement from the required assessment of lymphoma response."
        ],
        "oneBestAnswer": "Eradication plus histologic response assessment is the complete initial plan among these alternatives.",
        "closestDistractor": "Equating symptom-guided follow-up with adequate lymphoma-response assessment is plausible.",
        "remainingReview": "The preceding task supplies the diagnosis; the new difficulty is treatment plus response assessment, not independent syndrome inference. Melissa must confirm the response plan."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gastric-malt.localized-hpylori-positive-initial-treatment.v1.r3",
      "conceptId": "concept.gastric-malt-lymphoma.hpylori-eradication-first-line",
      "stem": "Which initial treatment and response-assessment plan should be arranged for {patientName}?",
      "answerChoices": [
        {
          "id": "eradicate_then_reassess",
          "label": "H. pylori eradication with planned histologic response assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Treats the infection-linked localized disease and assesses lymphoma response independently of symptoms or infection clearance."
        },
        {
          "id": "choice.qq20261102a.b30-context.d1",
          "label": "H. pylori eradication with symptom-triggered clinical reassessment",
          "isCorrect": false,
          "distractorRationale": "Provides the same infection treatment but an insufficient lymphoma-response strategy."
        },
        {
          "id": "choice.qq20261102a.b30-context.d2",
          "label": "Rituximab treatment with planned radiologic response assessment",
          "isCorrect": false,
          "distractorRationale": "Moves systemic treatment into a routine initial localized infection-associated presentation."
        }
      ],
      "explanation": "An initial eradication course and planned histologic lymphoma-response assessment address different requirements. Improvement of symptoms or infection clearance does not itself establish a lymphoma response. Further therapy depends on the subsequent assessment, not a universal automatic escalation rule.",
      "supportingEvidenceClaimIds": [
        "claim.gastric-malt.hpylori-eradication-initial-localized",
        "claim.gastric-malt.eradication-confirmation-and-response-reassessment",
        "claim.qq20261102a.gastric-malt-response-assessment"
      ],
      "teachingPoint": "An initial eradication course and planned histologic lymphoma-response assessment address different requirements. Improvement of symptoms or infection clearance does not itself establish a lymphoma response. Further therapy depends on the subsequent assessment, not a universal automatic escalation rule."
    }
  },
  {
    "id": "revision.qq20261102a.b31",
    "auditId": "B31",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-008",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-008.1",
    "previousQuestionVariantId": "question.statistics-ethics.p-value.v4.r2",
    "questionVariantId": "question.statistics-ethics.p-value.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which conclusion should {patientName} include in the trial report?",
    "previousChoiceLabels": [
      "The data leave clinical importance unresolved",
      "The data favor clinically equivalent outcomes",
      "The data favor a clinically small treatment effect"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Fictional teaching dataset; intervention effects are simulated. Comparison of leak outcomes; null hypothesis: equal event probabilities.",
      "items": [
        {
          "label": "p-value",
          "value": "0.08"
        }
      ]
    },
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Apply the specified superiority test rather than interpreting the p-value as effect size. Then Check whether the uncertainty interval lies inside the independently stated equivalence margins.",
    "reviewerNotes": "The interval criterion and fictional margin need statistics review; no disease-specific clinical-importance threshold is invented.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_p-008": "correct_p-008",
      "choice.qq20261102a.b31.d1": "choice.qq20261102.b31.d1",
      "choice.qq20261102a.b31.d2": "choice.qq20261102.b31.d2",
      "choice.qq20261102a.b31.d3": "choice.qq20261102.b31.d1"
    },
    "choiceServiceOverrides": {
      "correct_p-008": null,
      "choice.qq20261102a.b31.d1": null,
      "choice.qq20261102a.b31.d2": null,
      "choice.qq20261102a.b31.d3": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.statistics-ethics.p-value.v4.r2",
      "whatChanged": "Supply effect/uncertainty and an explicit hypothetical equivalence protocol; compare a balanced set of distinct paired conclusions. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B31",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The p-value fails the pre-specified superiority test and the interval fails the equivalence criterion. Review boundary: The interval criterion and fictional margin need statistics review; no disease-specific clinical-importance threshold is invented.",
          "cues 2: All four answers have identical certainty/grammar and balanced establish/not-establish components. The key is no longer the sole cautious answer against two overlapping magnitude claims."
        ],
        "fairness": [
          "fairness 1: The p-value fails the pre-specified superiority test and the interval fails the equivalence criterion. Review boundary: The interval criterion and fictional margin need statistics review; no disease-specific clinical-importance threshold is invented.",
          "fairness 2: Require: Apply the specified superiority test rather than interpreting the p-value as effect size. Then Check whether the uncertainty interval lies inside the independently stated equivalence margins. The closest error is: Concluding equivalence from a nonsignificant superiority test is a real inferential error.",
          "fairness 3: The p-value fails the pre-specified superiority test and the interval fails the equivalence criterion."
        ],
        "suggestions": [
          "suggestions 1: Supply effect/uncertainty and an explicit hypothetical equivalence protocol; compare a balanced set of distinct paired conclusions. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "suggestions 2: The p-value fails the pre-specified superiority test and the interval fails the equivalence criterion. Review boundary: The interval criterion and fictional margin need statistics review; no disease-specific clinical-importance threshold is invented.",
          "suggestions 3: Supply effect/uncertainty and an explicit hypothetical equivalence protocol; compare a balanced set of distinct paired conclusions. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting."
        ]
      },
      "selfCheck": {
        "cueAttack": "All four answers have identical certainty/grammar and balanced establish/not-establish components. The key is no longer the sole cautious answer against two overlapping magnitude claims.",
        "difficulty": "hard",
        "reasoningSteps": [
          "Apply the specified superiority test rather than interpreting the p-value as effect size.",
          "Check whether the uncertainty interval lies inside the independently stated equivalence margins."
        ],
        "oneBestAnswer": "The p-value fails the pre-specified superiority test and the interval fails the equivalence criterion.",
        "closestDistractor": "Concluding equivalence from a nonsignificant superiority test is a real inferential error.",
        "remainingReview": "The interval criterion and fictional margin need statistics review; no disease-specific clinical-importance threshold is invented."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v4.r3",
      "conceptId": "concept.statistics-ethics.p-value",
      "stem": "Which paired conclusion should {patientName} report?",
      "answerChoices": [
        {
          "id": "correct_p-008",
          "label": "Superiority uncertain; equivalence uncertain",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "The null-test result and the interval's failure to lie within the equivalence margins are separate findings."
        },
        {
          "id": "choice.qq20261102a.b31.d1",
          "label": "Superiority uncertain; equivalence supported",
          "isCorrect": false,
          "distractorRationale": "Mistakes a nonsignificant superiority test for evidence of equivalence."
        },
        {
          "id": "choice.qq20261102a.b31.d2",
          "label": "Superiority supported; equivalence uncertain",
          "isCorrect": false,
          "distractorRationale": "Overweights the point estimate without applying its uncertainty and the pre-specified test."
        },
        {
          "id": "choice.qq20261102a.b31.d3",
          "label": "Superiority supported; equivalence supported",
          "isCorrect": false,
          "distractorRationale": "Misreads both the superiority test and the equivalence interval criterion."
        }
      ],
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
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.p-value",
        "claim.qq20261102a.null-test-versus-protocol-magnitude"
      ]
    },
    "presentationTemplate": "{patientName} leads an employee methods discussion of a constructed trial. Its protocol uses a two-sided 0.05 superiority test and two one-sided 0.05 equivalence tests with margins of minus 3 to plus 3 percentage points.",
    "previousPresentation": "{patientName}, the journal-club lead, reviews a report comparing two investigational anastomosis instruments after ileal resection. The constructed trial records leak within thirty days.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.gs028se.arr-nnt-p-value.b-p-008",
        "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-008",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedPresentation": "{patientName}, the journal-club lead, reviews a report comparing two investigational anastomosis instruments after ileal resection. The constructed trial records leak within thirty days.",
        "revisedFields": [
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "chiefComplaint": "Trial methods discussion",
    "previousChiefComplaint": "Meckel diverticulum study",
    "previousProfileChiefComplaints": []
  },
  {
    "id": "revision.qq20261102a.b32",
    "auditId": "B32",
    "caseId": "case.pancreatic-pseudocyst.early-satiety",
    "nodeId": "node.pancreatic-pseudocyst.early-satiety.2",
    "previousQuestionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v1.r2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
    "previousChoiceLabels": [
      "Endoscopic transmural drainage",
      "Percutaneous catheter drainage",
      "Operative internal drainage",
      "Observation with repeat imaging"
    ],
    "previousCurrentUpdate": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Integrate a walled fluid-only collection and its relationship to the stomach with the concrete food-intake symptoms. Then Select a specialist drainage assessment route without assuming CT apposition alone proves a safe puncture path.",
    "reviewerNotes": "Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_0": "drain_0",
      "choice.qq20261102a.b32.d1": "choice.qq20261102.b32.d1",
      "choice.qq20261102a.b32.d2": "choice.qq20261102.b32.d2",
      "choice.qq20261102a.b32.d3": "choice.qq20261102.b32.d3"
    },
    "choiceServiceOverrides": {
      "drain_0": null,
      "choice.qq20261102a.b32.d1": null,
      "choice.qq20261102a.b32.d2": null,
      "choice.qq20261102a.b32.d3": null
    },
    "choiceTimingOverrides": {
      "drain_0": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102a.b32.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102a.b32.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102a.b32.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v1.r2",
      "whatChanged": "PASS retained with its note-specific refinement: compare planning-level routes and do not imply that gastric apposition proves safe access.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B32",
      "originalVerdict": "PASS",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review. Review boundary: Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration.",
          "fairness 2: Require: Integrate a walled fluid-only collection and its relationship to the stomach with the concrete food-intake symptoms. Then Select a specialist drainage assessment route without assuming CT apposition alone proves a safe puncture path. The closest error is: Observation is plausible for a collection alone, and alternative routes are real; the deciding combination is burden plus anatomy, not the diagnosis name.",
          "fairness 3: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review. Review boundary: Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration.",
          "fairness 4: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review.",
          "fairness 5: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review. Review boundary: Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration."
        ],
        "suggestions": [
          "suggestions 1: Preserve the PASS wall/contents/apposition information and close competing routes. Every invasive option is explicitly an assessment/referral, not an instruction for immediate unassessed drainage. PASS retained with its note-specific refinement: compare planning-level routes and do not imply that gastric apposition proves safe access.",
          "suggestions 2: PASS retained with its note-specific refinement: compare planning-level routes and do not imply that gastric apposition proves safe access.",
          "suggestions 3: Preserve the PASS wall/contents/apposition information and close competing routes. Every invasive option is explicitly an assessment/referral, not an instruction for immediate unassessed drainage. PASS retained with its note-specific refinement: compare planning-level routes and do not imply that gastric apposition proves safe access."
        ]
      },
      "selfCheck": {
        "cueAttack": "Preserve the PASS wall/contents/apposition information and close competing routes. Every invasive option is explicitly an assessment/referral, not an instruction for immediate unassessed drainage.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Integrate a walled fluid-only collection and its relationship to the stomach with the concrete food-intake symptoms.",
          "Select a specialist drainage assessment route without assuming CT apposition alone proves a safe puncture path."
        ],
        "oneBestAnswer": "The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review.",
        "closestDistractor": "Observation is plausible for a collection alone, and alternative routes are real; the deciding combination is burden plus anatomy, not the diagnosis name.",
        "remainingReview": "Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.symptomatic-endoscopic-drainage.v1.r3",
      "conceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage",
      "stem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
      "answerChoices": [
        {
          "id": "drain_0",
          "label": "Referral for endoscopic transmural drainage assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Retains the passed anatomy/symptom inference while requiring specialist assessment of vascular/access safety before any puncture."
        },
        {
          "id": "choice.qq20261102a.b32.d1",
          "label": "Referral for percutaneous catheter drainage assessment",
          "isCorrect": false,
          "distractorRationale": "Is a possible route in selected circumstances, but is not favored over endoscopic assessment for the supplied gastric apposition and burden."
        },
        {
          "id": "choice.qq20261102a.b32.d2",
          "label": "Referral for operative internal drainage assessment",
          "isCorrect": false,
          "distractorRationale": "May be appropriate in selected anatomy or after other approaches fail; no such preference is established here."
        },
        {
          "id": "choice.qq20261102a.b32.d3",
          "label": "Observation with nutritional support and repeat imaging",
          "isCorrect": false,
          "distractorRationale": "Is appropriate for some collections, but does not address the represented ongoing gastric compression/food-intake burden as well as specialist drainage planning."
        }
      ],
      "explanation": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.early.pseudocyst.symptomatic-endoscopic-drainage"
      ],
      "teachingPoint": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced."
    }
  },
  {
    "id": "revision.qq20261102a.b32-context",
    "auditId": "B32-context",
    "caseId": "case.pancreatic-pseudocyst.early-satiety",
    "nodeId": "node.pancreatic-pseudocyst.early-satiety.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v1.r2",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which imaging study should characterize {patientName}'s post-pancreatitis collection?",
    "previousChoiceLabels": [
      "Contrast-enhanced CT",
      "Abdominal ultrasound",
      "Diagnostic ERCP",
      "Hepatobiliary scintigraphy"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established. Then Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement.",
    "reviewerNotes": "This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_0": "ct_0",
      "choice.qq20261102a.b32-context.d1": "us_0",
      "choice.qq20261102a.b32-context.d2": "ercp_0"
    },
    "choiceServiceOverrides": {
      "ct_0": "service.ct",
      "choice.qq20261102a.b32-context.d1": null,
      "choice.qq20261102a.b32-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_0": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b32-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b32-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.contrast-ct-characterization.v1.r2",
      "whatChanged": "Remove the prematurely announced collection and compare credible protocol-level imaging errors; retain symptoms and runtime-owned waits.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B32-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed.",
          "cues 2: The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed.",
          "cues 3: The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed."
        ],
        "fairness": [
          "fairness 1: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Review boundary: This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test.",
          "fairness 2: Require: Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established. Then Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement. The closest error is: Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible.",
          "fairness 3: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination.",
          "fairness 4: Require: Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established. Then Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement. The closest error is: Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible."
        ],
        "suggestions": [
          "suggestions 1: Remove the prematurely announced collection and compare credible protocol-level imaging errors; retain symptoms and runtime-owned waits.",
          "suggestions 2: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Review boundary: This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test.",
          "suggestions 3: Remove the prematurely announced collection and compare credible protocol-level imaging errors; retain symptoms and runtime-owned waits."
        ]
      },
      "selfCheck": {
        "cueAttack": "The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established.",
          "Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement."
        ],
        "oneBestAnswer": "Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination.",
        "closestDistractor": "Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible.",
        "remainingReview": "This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v1.r3",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization",
      "stem": "Which examination protocol should evaluate {patientName}'s persistent upper-abdominal symptoms?",
      "answerChoices": [
        {
          "id": "ct_0",
          "label": "CT abdomen with intravenous contrast",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Evaluates the pancreatic region, tissue enhancement and anatomic relationships when a post-pancreatitis complication is suspected."
        },
        {
          "id": "choice.qq20261102a.b32-context.d1",
          "label": "CT abdomen with oral luminal contrast",
          "isCorrect": false,
          "distractorRationale": "Outlines the bowel but does not provide the same enhancement/vascular assessment of a pancreatic-region complication."
        },
        {
          "id": "choice.qq20261102a.b32-context.d2",
          "label": "CT abdomen without contrast material",
          "isCorrect": false,
          "distractorRationale": "Can depict some findings, but does not provide equivalent tissue-enhancement information for characterizing the suspected complication."
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
    "id": "revision.qq20261102a.b33",
    "auditId": "B33",
    "caseId": "case.pancreatic-pseudocyst.postmeal-vomiting",
    "nodeId": "node.pancreatic-pseudocyst.postmeal-vomiting.2",
    "previousQuestionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v2.r2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
    "previousChoiceLabels": [
      "Endoscopic transmural drainage",
      "Percutaneous catheter drainage",
      "Operative internal drainage",
      "Observation with repeat imaging"
    ],
    "previousCurrentUpdate": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Integrate a walled fluid-only collection and its relationship to the stomach with the concrete food-intake symptoms. Then Select a specialist drainage assessment route without assuming CT apposition alone proves a safe puncture path.",
    "reviewerNotes": "Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_1": "drain_1",
      "choice.qq20261102a.b33.d1": "choice.qq20261102.b33.d1",
      "choice.qq20261102a.b33.d2": "choice.qq20261102.b33.d2",
      "choice.qq20261102a.b33.d3": "choice.qq20261102.b33.d3"
    },
    "choiceServiceOverrides": {
      "drain_1": null,
      "choice.qq20261102a.b33.d1": null,
      "choice.qq20261102a.b33.d2": null,
      "choice.qq20261102a.b33.d3": null
    },
    "choiceTimingOverrides": {
      "drain_1": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102a.b33.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102a.b33.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102a.b33.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v2.r2",
      "whatChanged": "PASS retained with its note-specific refinement: compare planning-level routes and do not imply that gastric apposition proves safe access.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B33",
      "originalVerdict": "PASS",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review. Review boundary: Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration.",
          "fairness 2: Require: Integrate a walled fluid-only collection and its relationship to the stomach with the concrete food-intake symptoms. Then Select a specialist drainage assessment route without assuming CT apposition alone proves a safe puncture path. The closest error is: Observation is plausible for a collection alone, and alternative routes are real; the deciding combination is burden plus anatomy, not the diagnosis name.",
          "fairness 3: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review. Review boundary: Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration.",
          "fairness 4: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review.",
          "fairness 5: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review. Review boundary: Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration."
        ],
        "suggestions": [
          "suggestions 1: Preserve the PASS wall/contents/apposition information and close competing routes. Every invasive option is explicitly an assessment/referral, not an instruction for immediate unassessed drainage. PASS retained with its note-specific refinement: compare planning-level routes and do not imply that gastric apposition proves safe access.",
          "suggestions 2: PASS retained with its note-specific refinement: compare planning-level routes and do not imply that gastric apposition proves safe access.",
          "suggestions 3: Preserve the PASS wall/contents/apposition information and close competing routes. Every invasive option is explicitly an assessment/referral, not an instruction for immediate unassessed drainage. PASS retained with its note-specific refinement: compare planning-level routes and do not imply that gastric apposition proves safe access."
        ]
      },
      "selfCheck": {
        "cueAttack": "Preserve the PASS wall/contents/apposition information and close competing routes. Every invasive option is explicitly an assessment/referral, not an instruction for immediate unassessed drainage.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Integrate a walled fluid-only collection and its relationship to the stomach with the concrete food-intake symptoms.",
          "Select a specialist drainage assessment route without assuming CT apposition alone proves a safe puncture path."
        ],
        "oneBestAnswer": "The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review.",
        "closestDistractor": "Observation is plausible for a collection alone, and alternative routes are real; the deciding combination is burden plus anatomy, not the diagnosis name.",
        "remainingReview": "Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.symptomatic-endoscopic-drainage.v2.r3",
      "conceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage",
      "stem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
      "answerChoices": [
        {
          "id": "drain_1",
          "label": "Referral for endoscopic transmural drainage assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Retains the passed anatomy/symptom inference while requiring specialist assessment of vascular/access safety before any puncture."
        },
        {
          "id": "choice.qq20261102a.b33.d1",
          "label": "Referral for percutaneous catheter drainage assessment",
          "isCorrect": false,
          "distractorRationale": "Is a possible route in selected circumstances, but is not favored over endoscopic assessment for the supplied gastric apposition and burden."
        },
        {
          "id": "choice.qq20261102a.b33.d2",
          "label": "Referral for operative internal drainage assessment",
          "isCorrect": false,
          "distractorRationale": "May be appropriate in selected anatomy or after other approaches fail; no such preference is established here."
        },
        {
          "id": "choice.qq20261102a.b33.d3",
          "label": "Observation with nutritional support and repeat imaging",
          "isCorrect": false,
          "distractorRationale": "Is appropriate for some collections, but does not address the represented ongoing gastric compression/food-intake burden as well as specialist drainage planning."
        }
      ],
      "explanation": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.early.pseudocyst.symptomatic-endoscopic-drainage"
      ],
      "teachingPoint": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced."
    }
  },
  {
    "id": "revision.qq20261102a.b33-context",
    "auditId": "B33-context",
    "caseId": "case.pancreatic-pseudocyst.postmeal-vomiting",
    "nodeId": "node.pancreatic-pseudocyst.postmeal-vomiting.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v2.r2",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v2.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which imaging study should characterize {patientName}'s post-pancreatitis collection?",
    "previousChoiceLabels": [
      "Contrast-enhanced CT",
      "Abdominal ultrasound",
      "Diagnostic ERCP",
      "Hepatobiliary scintigraphy"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established. Then Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement.",
    "reviewerNotes": "This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_1": "ct_1",
      "choice.qq20261102a.b33-context.d1": "us_1",
      "choice.qq20261102a.b33-context.d2": "ercp_1"
    },
    "choiceServiceOverrides": {
      "ct_1": "service.ct",
      "choice.qq20261102a.b33-context.d1": null,
      "choice.qq20261102a.b33-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b33-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b33-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.contrast-ct-characterization.v2.r2",
      "whatChanged": "Remove the prematurely announced collection and compare credible protocol-level imaging errors; retain symptoms and runtime-owned waits.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B33-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed.",
          "cues 2: The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed.",
          "cues 3: The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed."
        ],
        "fairness": [
          "fairness 1: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Review boundary: This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test.",
          "fairness 2: Require: Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established. Then Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement. The closest error is: Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible.",
          "fairness 3: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination.",
          "fairness 4: Require: Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established. Then Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement. The closest error is: Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible."
        ],
        "suggestions": [
          "suggestions 1: Remove the prematurely announced collection and compare credible protocol-level imaging errors; retain symptoms and runtime-owned waits.",
          "suggestions 2: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Review boundary: This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test.",
          "suggestions 3: Remove the prematurely announced collection and compare credible protocol-level imaging errors; retain symptoms and runtime-owned waits."
        ]
      },
      "selfCheck": {
        "cueAttack": "The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established.",
          "Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement."
        ],
        "oneBestAnswer": "Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination.",
        "closestDistractor": "Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible.",
        "remainingReview": "This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v2.r3",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization",
      "stem": "Which examination protocol should evaluate {patientName}'s persistent upper-abdominal symptoms?",
      "answerChoices": [
        {
          "id": "ct_1",
          "label": "CT abdomen with intravenous contrast",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Evaluates the pancreatic region, tissue enhancement and anatomic relationships when a post-pancreatitis complication is suspected."
        },
        {
          "id": "choice.qq20261102a.b33-context.d1",
          "label": "CT abdomen with oral luminal contrast",
          "isCorrect": false,
          "distractorRationale": "Outlines the bowel but does not provide the same enhancement/vascular assessment of a pancreatic-region complication."
        },
        {
          "id": "choice.qq20261102a.b33-context.d2",
          "label": "CT abdomen without contrast material",
          "isCorrect": false,
          "distractorRationale": "Can depict some findings, but does not provide equivalent tissue-enhancement information for characterizing the suspected complication."
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
    "id": "revision.qq20261102a.b34",
    "auditId": "B34",
    "caseId": "case.pancreatic-pseudocyst.persistent-pain",
    "nodeId": "node.pancreatic-pseudocyst.persistent-pain.2",
    "previousQuestionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v3.r2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
    "previousChoiceLabels": [
      "Endoscopic transmural drainage",
      "Percutaneous catheter drainage",
      "Operative internal drainage",
      "Observation with repeat imaging"
    ],
    "previousCurrentUpdate": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Integrate a walled fluid-only collection and its relationship to the stomach with the concrete food-intake symptoms. Then Select a specialist drainage assessment route without assuming CT apposition alone proves a safe puncture path.",
    "reviewerNotes": "Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_2": "drain_2",
      "choice.qq20261102a.b34.d1": "choice.qq20261102.b34.d1",
      "choice.qq20261102a.b34.d2": "choice.qq20261102.b34.d2",
      "choice.qq20261102a.b34.d3": "choice.qq20261102.b34.d3"
    },
    "choiceServiceOverrides": {
      "drain_2": null,
      "choice.qq20261102a.b34.d1": null,
      "choice.qq20261102a.b34.d2": null,
      "choice.qq20261102a.b34.d3": null
    },
    "choiceTimingOverrides": {
      "drain_2": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102a.b34.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102a.b34.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102a.b34.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v3.r2",
      "whatChanged": "Add concrete meal-related functional impairment to resolve pain-only ambiguity; use planning-level route labels and preserve raw collection anatomy.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B34",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review. Review boundary: Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration.",
          "fairness 2: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review. Review boundary: Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration.",
          "fairness 3: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review.",
          "fairness 4: Require: Integrate a walled fluid-only collection and its relationship to the stomach with the concrete food-intake symptoms. Then Select a specialist drainage assessment route without assuming CT apposition alone proves a safe puncture path. The closest error is: Observation is plausible for a collection alone, and alternative routes are real; the deciding combination is burden plus anatomy, not the diagnosis name."
        ],
        "suggestions": [
          "suggestions 1: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review. Review boundary: Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration.",
          "suggestions 2: Add concrete meal-related functional impairment to resolve pain-only ambiguity; use planning-level route labels and preserve raw collection anatomy.",
          "suggestions 3: Add concrete meal-related functional impairment to resolve pain-only ambiguity; use planning-level route labels and preserve raw collection anatomy."
        ]
      },
      "selfCheck": {
        "cueAttack": "Preserve the PASS wall/contents/apposition information and close competing routes. Every invasive option is explicitly an assessment/referral, not an instruction for immediate unassessed drainage.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Integrate a walled fluid-only collection and its relationship to the stomach with the concrete food-intake symptoms.",
          "Select a specialist drainage assessment route without assuming CT apposition alone proves a safe puncture path."
        ],
        "oneBestAnswer": "The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review.",
        "closestDistractor": "Observation is plausible for a collection alone, and alternative routes are real; the deciding combination is burden plus anatomy, not the diagnosis name.",
        "remainingReview": "Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.symptomatic-endoscopic-drainage.v3.r3",
      "conceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage",
      "stem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
      "answerChoices": [
        {
          "id": "drain_2",
          "label": "Referral for endoscopic transmural drainage assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Retains the passed anatomy/symptom inference while requiring specialist assessment of vascular/access safety before any puncture."
        },
        {
          "id": "choice.qq20261102a.b34.d1",
          "label": "Referral for percutaneous catheter drainage assessment",
          "isCorrect": false,
          "distractorRationale": "Is a possible route in selected circumstances, but is not favored over endoscopic assessment for the supplied gastric apposition and burden."
        },
        {
          "id": "choice.qq20261102a.b34.d2",
          "label": "Referral for operative internal drainage assessment",
          "isCorrect": false,
          "distractorRationale": "May be appropriate in selected anatomy or after other approaches fail; no such preference is established here."
        },
        {
          "id": "choice.qq20261102a.b34.d3",
          "label": "Observation with nutritional support and repeat imaging",
          "isCorrect": false,
          "distractorRationale": "Is appropriate for some collections, but does not address the represented ongoing gastric compression/food-intake burden as well as specialist drainage planning."
        }
      ],
      "explanation": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.early.pseudocyst.symptomatic-endoscopic-drainage",
        "claim.qq20261102a.collection-symptom-attribution"
      ],
      "teachingPoint": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with meal-related upper-abdominal pain and vomiting after interstitial edematous pancreatitis. Meals are repeatedly stopped after a few mouthfuls because of pain and fullness; the patient cannot maintain the usual food intake.",
    "previousPresentation": "{patientName}, a 44-year-old woman, visits the clinic with persistent upper-abdominal pain after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
    "previousProfilePresentations": [
      {
        "id": "profile.pancreatic-pseudocyst.persistent-pain.female.44",
        "presentation": "{patientName}, a 44-year-old woman, visits the clinic with persistent upper-abdominal pain after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      },
      {
        "id": "profile.pancreatic-pseudocyst.persistent-pain.male.44",
        "presentation": "{patientName}, a 44-year-old man, visits the clinic with persistent upper-abdominal pain after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      },
      {
        "id": "profile.pancreatic-pseudocyst.persistent-pain.female.46",
        "presentation": "{patientName}, a 46-year-old woman, visits the clinic with persistent upper-abdominal pain after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      },
      {
        "id": "profile.pancreatic-pseudocyst.persistent-pain.male.46",
        "presentation": "{patientName}, a 46-year-old man, visits the clinic with persistent upper-abdominal pain after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.pancreatic-pseudocyst.persistent-pain",
        "patientPresentationVariantId": "presentation.pancreatic-pseudocyst.persistent-pain",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedPresentation": "{patientName}, a 44-year-old woman, visits the clinic with persistent upper-abdominal pain after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
        "revisedFields": [
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.persistent-pain.female.44",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.persistent-pain.female.44",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 44-year-old woman, visits the clinic with persistent upper-abdominal pain after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.persistent-pain.male.44",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.persistent-pain.male.44",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 44-year-old man, visits the clinic with persistent upper-abdominal pain after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.persistent-pain.female.46",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.persistent-pain.female.46",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 46-year-old woman, visits the clinic with persistent upper-abdominal pain after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.pancreatic-pseudocyst.persistent-pain.male.46",
            "approvedInstantiationProfileId": "profile.pancreatic-pseudocyst.persistent-pain.male.46",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 46-year-old man, visits the clinic with persistent upper-abdominal pain after interstitial edematous pancreatitis. The symptoms continue after the acute episode has settled.",
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b34-context",
    "auditId": "B34-context",
    "caseId": "case.pancreatic-pseudocyst.persistent-pain",
    "nodeId": "node.pancreatic-pseudocyst.persistent-pain.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v3.r2",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which imaging study should characterize {patientName}'s post-pancreatitis collection?",
    "previousChoiceLabels": [
      "Contrast-enhanced CT",
      "Abdominal ultrasound",
      "Diagnostic ERCP",
      "Hepatobiliary scintigraphy"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established. Then Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement.",
    "reviewerNotes": "This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_2": "ct_2",
      "choice.qq20261102a.b34-context.d1": "us_2",
      "choice.qq20261102a.b34-context.d2": "ercp_2"
    },
    "choiceServiceOverrides": {
      "ct_2": "service.ct",
      "choice.qq20261102a.b34-context.d1": null,
      "choice.qq20261102a.b34-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b34-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b34-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.contrast-ct-characterization.v3.r2",
      "whatChanged": "Remove the prematurely announced collection and compare credible protocol-level imaging errors; retain symptoms and runtime-owned waits.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B34-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed.",
          "cues 2: The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed.",
          "cues 3: The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed."
        ],
        "fairness": [
          "fairness 1: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Review boundary: This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test.",
          "fairness 2: Require: Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established. Then Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement. The closest error is: Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible.",
          "fairness 3: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination.",
          "fairness 4: Require: Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established. Then Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement. The closest error is: Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible."
        ],
        "suggestions": [
          "suggestions 1: Remove the prematurely announced collection and compare credible protocol-level imaging errors; retain symptoms and runtime-owned waits.",
          "suggestions 2: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Review boundary: This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test.",
          "suggestions 3: Remove the prematurely announced collection and compare credible protocol-level imaging errors; retain symptoms and runtime-owned waits."
        ]
      },
      "selfCheck": {
        "cueAttack": "The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established.",
          "Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement."
        ],
        "oneBestAnswer": "Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination.",
        "closestDistractor": "Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible.",
        "remainingReview": "This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v3.r3",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization",
      "stem": "Which examination protocol should evaluate {patientName}'s persistent upper-abdominal symptoms?",
      "answerChoices": [
        {
          "id": "ct_2",
          "label": "CT abdomen with intravenous contrast",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Evaluates the pancreatic region, tissue enhancement and anatomic relationships when a post-pancreatitis complication is suspected."
        },
        {
          "id": "choice.qq20261102a.b34-context.d1",
          "label": "CT abdomen with oral luminal contrast",
          "isCorrect": false,
          "distractorRationale": "Outlines the bowel but does not provide the same enhancement/vascular assessment of a pancreatic-region complication."
        },
        {
          "id": "choice.qq20261102a.b34-context.d2",
          "label": "CT abdomen without contrast material",
          "isCorrect": false,
          "distractorRationale": "Can depict some findings, but does not provide equivalent tissue-enhancement information for characterizing the suspected complication."
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
    "id": "revision.qq20261102a.b35",
    "auditId": "B35",
    "caseId": "case.pancreatic-pseudocyst.reduced-intake",
    "nodeId": "node.pancreatic-pseudocyst.reduced-intake.2",
    "previousQuestionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v4.r2",
    "questionVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
    "previousChoiceLabels": [
      "Endoscopic transmural drainage",
      "Percutaneous catheter drainage",
      "Operative internal drainage",
      "Observation with repeat imaging"
    ],
    "previousCurrentUpdate": "CT shows a complete-walled collection of uniform fluid density against the posterior stomach, indenting its contour. There is no solid material within the collection.",
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Integrate a walled fluid-only collection and its relationship to the stomach with the concrete food-intake symptoms. Then Select a specialist drainage assessment route without assuming CT apposition alone proves a safe puncture path.",
    "reviewerNotes": "Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "drain_3": "drain_3",
      "choice.qq20261102a.b35.d1": "choice.qq20261102.b35.d1",
      "choice.qq20261102a.b35.d2": "choice.qq20261102.b35.d2",
      "choice.qq20261102a.b35.d3": "choice.qq20261102.b35.d3"
    },
    "choiceServiceOverrides": {
      "drain_3": null,
      "choice.qq20261102a.b35.d1": null,
      "choice.qq20261102a.b35.d2": null,
      "choice.qq20261102a.b35.d3": null
    },
    "choiceTimingOverrides": {
      "drain_3": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102a.b35.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102a.b35.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.pseudocyst_drainage"
      },
      "choice.qq20261102a.b35.d3": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.symptomatic-endoscopic-drainage.v4.r2",
      "whatChanged": "PASS retained with its note-specific refinement: compare planning-level routes and do not imply that gastric apposition proves safe access.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B35",
      "originalVerdict": "PASS",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review. Review boundary: Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration.",
          "fairness 2: Require: Integrate a walled fluid-only collection and its relationship to the stomach with the concrete food-intake symptoms. Then Select a specialist drainage assessment route without assuming CT apposition alone proves a safe puncture path. The closest error is: Observation is plausible for a collection alone, and alternative routes are real; the deciding combination is burden plus anatomy, not the diagnosis name.",
          "fairness 3: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review. Review boundary: Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration.",
          "fairness 4: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review.",
          "fairness 5: The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review. Review boundary: Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration."
        ],
        "suggestions": [
          "suggestions 1: Preserve the PASS wall/contents/apposition information and close competing routes. Every invasive option is explicitly an assessment/referral, not an instruction for immediate unassessed drainage. PASS retained with its note-specific refinement: compare planning-level routes and do not imply that gastric apposition proves safe access.",
          "suggestions 2: PASS retained with its note-specific refinement: compare planning-level routes and do not imply that gastric apposition proves safe access.",
          "suggestions 3: Preserve the PASS wall/contents/apposition information and close competing routes. Every invasive option is explicitly an assessment/referral, not an instruction for immediate unassessed drainage. PASS retained with its note-specific refinement: compare planning-level routes and do not imply that gastric apposition proves safe access."
        ]
      },
      "selfCheck": {
        "cueAttack": "Preserve the PASS wall/contents/apposition information and close competing routes. Every invasive option is explicitly an assessment/referral, not an instruction for immediate unassessed drainage.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Integrate a walled fluid-only collection and its relationship to the stomach with the concrete food-intake symptoms.",
          "Select a specialist drainage assessment route without assuming CT apposition alone proves a safe puncture path."
        ],
        "oneBestAnswer": "The supplied gastric compression and functional burden favor endoscopic drainage assessment among the offered plans, subject to expert access review.",
        "closestDistractor": "Observation is plausible for a collection alone, and alternative routes are real; the deciding combination is burden plus anatomy, not the diagnosis name.",
        "remainingReview": "Melissa must confirm symptom attribution, nutritional burden and access suitability. No collection size, elapsed-week cutoff or vascular clearance is fabricated. Every offered drainage/repeat-imaging plan receives an existing placeholder estimate so a key-only wait is not a runtime cue; this adds no executed order or fixed prose duration."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.symptomatic-endoscopic-drainage.v4.r3",
      "conceptId": "concept.pseudocyst.symptomatic-endoscopic-drainage",
      "stem": "Which management plan should be recommended for {patientName}'s returned imaging findings and ongoing symptoms?",
      "answerChoices": [
        {
          "id": "drain_3",
          "label": "Referral for endoscopic transmural drainage assessment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Retains the passed anatomy/symptom inference while requiring specialist assessment of vascular/access safety before any puncture."
        },
        {
          "id": "choice.qq20261102a.b35.d1",
          "label": "Referral for percutaneous catheter drainage assessment",
          "isCorrect": false,
          "distractorRationale": "Is a possible route in selected circumstances, but is not favored over endoscopic assessment for the supplied gastric apposition and burden."
        },
        {
          "id": "choice.qq20261102a.b35.d2",
          "label": "Referral for operative internal drainage assessment",
          "isCorrect": false,
          "distractorRationale": "May be appropriate in selected anatomy or after other approaches fail; no such preference is established here."
        },
        {
          "id": "choice.qq20261102a.b35.d3",
          "label": "Observation with nutritional support and repeat imaging",
          "isCorrect": false,
          "distractorRationale": "Is appropriate for some collections, but does not address the represented ongoing gastric compression/food-intake burden as well as specialist drainage planning."
        }
      ],
      "explanation": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced.",
      "supportingEvidenceClaimIds": [
        "claim.early.pseudocyst.contrast-ct-characterization",
        "claim.early.pseudocyst.symptomatic-endoscopic-drainage"
      ],
      "teachingPoint": "The post-interstitial-pancreatitis history and walled fluid-only collection support pseudocyst classification. Persistent symptoms and gastric apposition support referral for EUS-guided drainage when feasible; no size-only or exact elapsed-time rule is introduced."
    }
  },
  {
    "id": "revision.qq20261102a.b35-context",
    "auditId": "B35-context",
    "caseId": "case.pancreatic-pseudocyst.reduced-intake",
    "nodeId": "node.pancreatic-pseudocyst.reduced-intake.1",
    "previousQuestionVariantId": "question.pseudocyst.contrast-ct-characterization.v4.r2",
    "questionVariantId": "question.pseudocyst.contrast-ct-characterization.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which imaging study should characterize {patientName}'s post-pancreatitis collection?",
    "previousChoiceLabels": [
      "Contrast-enhanced CT",
      "Abdominal ultrasound",
      "Diagnostic ERCP",
      "Hepatobiliary scintigraphy"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established. Then Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement.",
    "reviewerNotes": "This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "ct_3": "ct_3",
      "choice.qq20261102a.b35-context.d1": "us_3",
      "choice.qq20261102a.b35-context.d2": "ercp_3"
    },
    "choiceServiceOverrides": {
      "ct_3": "service.ct",
      "choice.qq20261102a.b35-context.d1": null,
      "choice.qq20261102a.b35-context.d2": null
    },
    "choiceTimingOverrides": {
      "ct_3": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b35-context.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      },
      "choice.qq20261102a.b35-context.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.ct"
      }
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pseudocyst.contrast-ct-characterization.v4.r2",
      "whatChanged": "Remove the prematurely announced collection and compare credible protocol-level imaging errors; retain symptoms and runtime-owned waits.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B35-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed.",
          "cues 2: The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed.",
          "cues 3: The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed."
        ],
        "fairness": [
          "fairness 1: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Review boundary: This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test.",
          "fairness 2: Require: Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established. Then Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement. The closest error is: Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible.",
          "fairness 3: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination.",
          "fairness 4: Require: Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established. Then Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement. The closest error is: Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible."
        ],
        "suggestions": [
          "suggestions 1: Remove the prematurely announced collection and compare credible protocol-level imaging errors; retain symptoms and runtime-owned waits.",
          "suggestions 2: Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination. Review boundary: This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test.",
          "suggestions 3: Remove the prematurely announced collection and compare credible protocol-level imaging errors; retain symptoms and runtime-owned waits."
        ]
      },
      "selfCheck": {
        "cueAttack": "The lead-in does not announce an unreturned collection. All options are abdominal CT protocols with parallel neutral qualifiers; HIDA and diagnostic ERCP fillers are removed.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Infer a possible post-pancreatitis structural complication from the actual persistent symptoms, without being told a collection has already been established.",
          "Choose a protocol that supplies enhancement/anatomic characterization rather than confusing luminal contrast with intravenous enhancement."
        ],
        "oneBestAnswer": "Among these specified protocols, intravenous enhancement supplies the relevant characterization not provided by oral contrast or an unenhanced examination.",
        "closestDistractor": "Treating oral contrast as a substitute for IV contrast when gastric symptoms dominate is plausible.",
        "remainingReview": "This protocol distinction may remain familiar to senior residents. No MRI-versus-CT universal ranking, invented contraindication or future CT observation is used to select the earlier test."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pseudocyst.contrast-ct-characterization.v4.r3",
      "conceptId": "concept.pseudocyst.contrast-ct-characterization",
      "stem": "Which examination protocol should evaluate {patientName}'s persistent upper-abdominal symptoms?",
      "answerChoices": [
        {
          "id": "ct_3",
          "label": "CT abdomen with intravenous contrast",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Evaluates the pancreatic region, tissue enhancement and anatomic relationships when a post-pancreatitis complication is suspected."
        },
        {
          "id": "choice.qq20261102a.b35-context.d1",
          "label": "CT abdomen with oral luminal contrast",
          "isCorrect": false,
          "distractorRationale": "Outlines the bowel but does not provide the same enhancement/vascular assessment of a pancreatic-region complication."
        },
        {
          "id": "choice.qq20261102a.b35-context.d2",
          "label": "CT abdomen without contrast material",
          "isCorrect": false,
          "distractorRationale": "Can depict some findings, but does not provide equivalent tissue-enhancement information for characterizing the suspected complication."
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
    "id": "revision.qq20261102a.b36",
    "auditId": "B36",
    "caseId": "case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
    "nodeId": "node.gs028se.pdsa-act-qi-measures.a-abandon-harm.1",
    "previousQuestionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r2",
    "questionVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which next-cycle decision should {patientName}'s team make from the reported findings?",
    "previousChoiceLabels": [
      "Stop this version and test another approach",
      "Roll out this version and monitor outcomes",
      "Repeat this version without changing the workflow"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Fictional teaching dataset; intervention effects are simulated. Authorized local process test, not treatment efficacy.",
      "items": [
        {
          "label": "Symptom-relief target",
          "value": "Not met"
        },
        {
          "label": "Care-planning time",
          "value": "Longer across successive tests"
        },
        {
          "label": "Implementation audit",
          "value": "Tested workflow followed"
        }
      ]
    },
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Separate process, intended outcome, balancing workload and observed implementation measures. Then Choose a next adaptation that addresses the unresolved tradeoff rather than spreading a process win or assuming nonadherence.",
    "reviewerNotes": "QI/statistics review must confirm the best-next-test judgment; small sequential groups are not controlled proof or grounds for a mandatory stop rule.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_abandon-harm": "correct_abandon-harm",
      "choice.qq20261102a.b36.d1": "choice.qq20261102.b36.d1",
      "choice.qq20261102a.b36.d2": "choice.qq20261102.b36.d2"
    },
    "choiceServiceOverrides": {
      "correct_abandon-harm": null,
      "choice.qq20261102a.b36.d1": null,
      "choice.qq20261102a.b36.d2": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.quality-improvement.pdsa-act-and-iterate.v3.r2",
      "whatChanged": "Replace interpreted failure/adherence labels with a small mixed-outcome sequence and compare three plausible next PDSA tests; clarify revision rather than total abandonment. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B36",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Raw counts replace Not met/Longer/followed summaries. All answers propose an actual next test with identical measurement language; no 'without changing' villain qualifier remains.",
          "cues 2: Revision is the best offered next learning step given the mixed process/outcome/balancing observations and increasing completion, without overclaiming causal proof. Review boundary: QI/statistics review must confirm the best-next-test judgment; small sequential groups are not controlled proof or grounds for a mandatory stop rule.",
          "cues 3: Raw counts replace Not met/Longer/followed summaries. All answers propose an actual next test with identical measurement language; no 'without changing' villain qualifier remains. Replace interpreted failure/adherence labels with a small mixed-outcome sequence and compare three plausible next PDSA tests; clarify revision rather than total abandonment. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "cues 4: Raw counts replace Not met/Longer/followed summaries. All answers propose an actual next test with identical measurement language; no 'without changing' villain qualifier remains. Replace interpreted failure/adherence labels with a small mixed-outcome sequence and compare three plausible next PDSA tests; clarify revision rather than total abandonment. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting."
        ],
        "fairness": [
          "fairness 1: Revision is the best offered next learning step given the mixed process/outcome/balancing observations and increasing completion, without overclaiming causal proof. Review boundary: QI/statistics review must confirm the best-next-test judgment; small sequential groups are not controlled proof or grounds for a mandatory stop rule.",
          "fairness 2: Revision is the best offered next learning step given the mixed process/outcome/balancing observations and increasing completion, without overclaiming causal proof. Review boundary: QI/statistics review must confirm the best-next-test judgment; small sequential groups are not controlled proof or grounds for a mandatory stop rule.",
          "fairness 3: Require: Separate process, intended outcome, balancing workload and observed implementation measures. Then Choose a next adaptation that addresses the unresolved tradeoff rather than spreading a process win or assuming nonadherence. The closest error is: Spreading a documentation improvement as though it established the intended patient/process outcome is a credible QI error."
        ],
        "suggestions": [
          "suggestions 1: Revision is the best offered next learning step given the mixed process/outcome/balancing observations and increasing completion, without overclaiming causal proof. Review boundary: QI/statistics review must confirm the best-next-test judgment; small sequential groups are not controlled proof or grounds for a mandatory stop rule.",
          "suggestions 2: Revision is the best offered next learning step given the mixed process/outcome/balancing observations and increasing completion, without overclaiming causal proof. Review boundary: QI/statistics review must confirm the best-next-test judgment; small sequential groups are not controlled proof or grounds for a mandatory stop rule.",
          "suggestions 3: Revision is the best offered next learning step given the mixed process/outcome/balancing observations and increasing completion, without overclaiming causal proof. Review boundary: QI/statistics review must confirm the best-next-test judgment; small sequential groups are not controlled proof or grounds for a mandatory stop rule."
        ]
      },
      "selfCheck": {
        "cueAttack": "Raw counts replace Not met/Longer/followed summaries. All answers propose an actual next test with identical measurement language; no 'without changing' villain qualifier remains.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Separate process, intended outcome, balancing workload and observed implementation measures.",
          "Choose a next adaptation that addresses the unresolved tradeoff rather than spreading a process win or assuming nonadherence."
        ],
        "oneBestAnswer": "Revision is the best offered next learning step given the mixed process/outcome/balancing observations and increasing completion, without overclaiming causal proof.",
        "closestDistractor": "Spreading a documentation improvement as though it established the intended patient/process outcome is a credible QI error.",
        "remainingReview": "QI/statistics review must confirm the best-next-test judgment; small sequential groups are not controlled proof or grounds for a mandatory stop rule."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.quality-improvement.pdsa-act-and-iterate.v3.r3",
      "conceptId": "concept.quality-improvement.pdsa-act-and-iterate",
      "stem": "Which next PDSA test should {patientName}'s team undertake?",
      "answerChoices": [
        {
          "id": "correct_abandon-harm",
          "label": "Test a revised form while tracking repeat contacts and planning time",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Responds to the improved process metric but unchanged target outcome and increased balancing burden, without claiming every element of the approach must be abandoned."
        },
        {
          "id": "choice.qq20261102a.b36.d1",
          "label": "Test spread of this form while tracking repeat contacts and planning time",
          "isCorrect": false,
          "distractorRationale": "Overweights first-visit documentation improvement and moves to spread before resolving outcome/balancing concerns."
        },
        {
          "id": "choice.qq20261102a.b36.d2",
          "label": "Test refresher training while tracking repeat contacts and planning time",
          "isCorrect": false,
          "distractorRationale": "Treats adherence as the primary remaining explanation despite progressively complete entered sections and persistent outcome/workload findings."
        }
      ],
      "explanation": "The form improves a process measure, but the intended repeat-contact outcome does not show a corresponding improvement and workload rises. A modified next test is more informative than immediate spread or treating training as the sole unresolved problem. These small groups do not establish a general causal effect or a universal abandonment rule.",
      "teachingPoint": "The form improves a process measure, but the intended repeat-contact outcome does not show a corresponding improvement and workload rises. A modified next test is more informative than immediate spread or treating training as the sole unresolved problem. These small groups do not establish a general causal effect or a universal abandonment rule.",
      "exhibit": {
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
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.pdsa-act",
        "claim.qq20261102a.pdsa-outcome-balancing-adaptation"
      ]
    },
    "presentationTemplate": "{patientName} leads an employee quality meeting about a structured visit form. A small test aims to reduce unplanned repeat contacts while keeping planning workload manageable. Each row describes a constructed group of 20 visits.",
    "previousPresentation": "{patientName}, the quality-improvement lead, reviews an authorized local gastroparesis-pathway pilot. Successive tests miss the symptom target and take longer to plan care. An audit finds staff followed the tested workflow.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.gs028se.pdsa-act-qi-measures.a-abandon-harm",
        "patientPresentationVariantId": "presentation.gs028se.pdsa-act-qi-measures.a-abandon-harm",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedPresentation": "{patientName}, the quality-improvement lead, reviews an authorized local gastroparesis-pathway pilot. Successive tests miss the symptom target and take longer to plan care. An audit finds staff followed the tested workflow.",
        "revisedFields": [
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "chiefComplaint": "Pathway improvement review",
    "previousChiefComplaint": "gastroparesis study",
    "previousProfileChiefComplaints": []
  },
  {
    "id": "revision.qq20261102a.b37",
    "auditId": "B37",
    "caseId": "case.inflammatory-breast-cancer.persistent-erythema",
    "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.1",
    "previousQuestionVariantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r2",
    "questionVariantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which diagnostic plan should be arranged for {patientName}'s breast changes?",
    "previousChoiceLabels": [
      "Breast core biopsy and staging",
      "Breast skin punch biopsy and staging",
      "Breast fine-needle aspiration and staging"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Integrate the inflammatory presentation, imaged target and atypical cytology without treating the aspirate as confirmed invasive cancer. Then Choose tissue architecture from the appropriate target and distinguish a skin adjunct from a substitute.",
    "reviewerNotes": "Melissa/breast team must confirm the biopsy target and adjunctive role. The preserved external service still supplies confirmation followed by staging; no order is added before confirmation.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "core_staging_4": "core_staging_4",
      "choice.qq20261102a.b37.d1": "choice.qq20261102.b37.d1",
      "choice.qq20261102a.b37.d2": "choice.qq20261102.b37.d2"
    },
    "choiceServiceOverrides": {
      "core_staging_4": "service.ibc_biopsy_and_staging",
      "choice.qq20261102a.b37.d1": null,
      "choice.qq20261102a.b37.d2": null
    },
    "choiceTimingOverrides": {
      "core_staging_4": {
        "kind": "test",
        "timingProfileId": "timing.test.ibc_biopsy_and_staging"
      },
      "choice.qq20261102a.b37.d1": {
        "kind": "test",
        "timingProfileId": "timing.test.ultrasound_guided_aspiration"
      },
      "choice.qq20261102a.b37.d2": {
        "kind": "test",
        "timingProfileId": "timing.test.nipple_areolar_biopsy"
      }
    },
    "currentUpdate": "External systemic staging is planned if invasive carcinoma is confirmed.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r2",
      "whatChanged": "Provide a consequential prior cytologic result, ask for the first sampling step, distinguish primary and adjunctive targets and make staging conditional.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B37",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Require: Integrate the inflammatory presentation, imaged target and atypical cytology without treating the aspirate as confirmed invasive cancer. Then Choose tissue architecture from the appropriate target and distinguish a skin adjunct from a substitute. The closest error is: Treating skin punch as a complete substitute because the most visible abnormality is cutaneous is plausible.",
          "fairness 2: Core sampling of the imaged parenchymal target best repairs the current diagnostic limitation; repeat aspiration and skin-only sampling do not provide the same assessment. Review boundary: Melissa/breast team must confirm the biopsy target and adjunctive role. The preserved external service still supplies confirmation followed by staging; no order is added before confirmation.",
          "fairness 3: Core sampling of the imaged parenchymal target best repairs the current diagnostic limitation; repeat aspiration and skin-only sampling do not provide the same assessment.",
          "fairness 4: All options are concrete sampling procedures. The lead-in does not name IBC or a most-definitive principle; staging is explicitly conditional for every choice rather than bundled only into the key. Provide a consequential prior cytologic result, ask for the first sampling step, distinguish primary and adjunctive targets and make staging conditional."
        ],
        "suggestions": [
          "suggestions 1: Provide a consequential prior cytologic result, ask for the first sampling step, distinguish primary and adjunctive targets and make staging conditional.",
          "suggestions 2: Provide a consequential prior cytologic result, ask for the first sampling step, distinguish primary and adjunctive targets and make staging conditional.",
          "suggestions 3: Provide a consequential prior cytologic result, ask for the first sampling step, distinguish primary and adjunctive targets and make staging conditional."
        ]
      },
      "selfCheck": {
        "cueAttack": "All options are concrete sampling procedures. The lead-in does not name IBC or a most-definitive principle; staging is explicitly conditional for every choice rather than bundled only into the key.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Integrate the inflammatory presentation, imaged target and atypical cytology without treating the aspirate as confirmed invasive cancer.",
          "Choose tissue architecture from the appropriate target and distinguish a skin adjunct from a substitute."
        ],
        "oneBestAnswer": "Core sampling of the imaged parenchymal target best repairs the current diagnostic limitation; repeat aspiration and skin-only sampling do not provide the same assessment.",
        "closestDistractor": "Treating skin punch as a complete substitute because the most visible abnormality is cutaneous is plausible.",
        "remainingReview": "Melissa/breast team must confirm the biopsy target and adjunctive role. The preserved external service still supplies confirmation followed by staging; no order is added before confirmation."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r3",
      "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation",
      "stem": "Which tissue-sampling plan should come first for {patientName}?",
      "answerChoices": [
        {
          "id": "core_staging_4",
          "label": "Ultrasound-guided core biopsy of parenchymal abnormality",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Obtains tissue architecture from the imaged breast abnormality after an atypical cytologic sample; skin sampling can be adjunctive rather than a substitute for this target."
        },
        {
          "id": "choice.qq20261102a.b37.d1",
          "label": "Ultrasound-guided aspiration of the parenchymal abnormality",
          "isCorrect": false,
          "distractorRationale": "Repeats a cytologic approach without repairing the limitation in establishing an invasive tissue diagnosis and biomarker material."
        },
        {
          "id": "choice.qq20261102a.b37.d2",
          "label": "Punch sampling of the involved breast skin",
          "isCorrect": false,
          "distractorRationale": "Can provide useful adjunctive information but is not the best substitute for sampling the imaged parenchymal abnormality in this record."
        }
      ],
      "explanation": "The rapidly evolving skin/breast findings warrant assessment of an invasive breast malignancy. Core tissue from the parenchymal abnormality addresses the inadequate cytologic material; skin punch may be adjunctive. The existing external pathway completes staging after confirmation, not because suspicion alone equals a cancer diagnosis.",
      "supportingEvidenceClaimIds": [
        "claim.brief.ibc.core-biopsy-confirmation",
        "claim.qq20261102a.ibc-core-versus-adjunctive-skin"
      ],
      "teachingPoint": "The rapidly evolving skin/breast findings warrant assessment of an invasive breast malignancy. Core tissue from the parenchymal abnormality addresses the inadequate cytologic material; skin punch may be adjunctive. The existing external pathway completes staging after confirmation, not because suspicion alone equals a cancer diagnosis."
    },
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with ten weeks of expanding redness, warmth and swelling involving about half of one breast. Ultrasound shows skin thickening and an irregular hypoechoic parenchymal area. An aspirate from that area contains atypical epithelial clusters; no tissue block is available.",
    "previousPresentation": "{patientName}, a 50-year-old woman, visits the clinic with ten weeks of expanding redness, warmth and swelling involving about half of one breast. The patient is not lactating. Ultrasound shows skin thickening and an irregular hypoechoic area in the breast, without a fluid pocket.",
    "previousProfilePresentations": [
      {
        "id": "profile.inflammatory-breast-cancer.persistent-erythema.female.50",
        "presentation": "{patientName}, a 50-year-old woman, visits the clinic with ten weeks of expanding redness, warmth and swelling involving about half of one breast. The patient is not lactating. Ultrasound shows skin thickening and an irregular hypoechoic area in the breast, without a fluid pocket."
      },
      {
        "id": "profile.inflammatory-breast-cancer.persistent-erythema.female.54",
        "presentation": "{patientName}, a 54-year-old woman, visits the clinic with ten weeks of expanding redness, warmth and swelling involving about half of one breast. The patient is not lactating. Ultrasound shows skin thickening and an irregular hypoechoic area in the breast, without a fluid pocket."
      },
      {
        "id": "profile.inflammatory-breast-cancer.persistent-erythema.female.58",
        "presentation": "{patientName}, a 58-year-old woman, visits the clinic with ten weeks of expanding redness, warmth and swelling involving about half of one breast. The patient is not lactating. Ultrasound shows skin thickening and an irregular hypoechoic area in the breast, without a fluid pocket."
      },
      {
        "id": "profile.inflammatory-breast-cancer.persistent-erythema.female.62",
        "presentation": "{patientName}, a 62-year-old woman, visits the clinic with ten weeks of expanding redness, warmth and swelling involving about half of one breast. The patient is not lactating. Ultrasound shows skin thickening and an irregular hypoechoic area in the breast, without a fluid pocket."
      }
    ],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.inflammatory-breast-cancer.persistent-erythema",
        "patientPresentationVariantId": "presentation.inflammatory-breast-cancer.persistent-erythema",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedPresentation": "{patientName}, a 50-year-old woman, visits the clinic with ten weeks of expanding redness, warmth and swelling involving about half of one breast. The patient is not lactating. Ultrasound shows skin thickening and an irregular hypoechoic area in the breast, without a fluid pocket.",
        "revisedFields": [
          "presentation"
        ],
        "revisedProfilePresentations": [
          {
            "id": "ppr.qq20261102.profile.inflammatory-breast-cancer.persistent-erythema.female.50",
            "approvedInstantiationProfileId": "profile.inflammatory-breast-cancer.persistent-erythema.female.50",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 50-year-old woman, visits the clinic with ten weeks of expanding redness, warmth and swelling involving about half of one breast. The patient is not lactating. Ultrasound shows skin thickening and an irregular hypoechoic area in the breast, without a fluid pocket.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.inflammatory-breast-cancer.persistent-erythema.female.54",
            "approvedInstantiationProfileId": "profile.inflammatory-breast-cancer.persistent-erythema.female.54",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 54-year-old woman, visits the clinic with ten weeks of expanding redness, warmth and swelling involving about half of one breast. The patient is not lactating. Ultrasound shows skin thickening and an irregular hypoechoic area in the breast, without a fluid pocket.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.inflammatory-breast-cancer.persistent-erythema.female.58",
            "approvedInstantiationProfileId": "profile.inflammatory-breast-cancer.persistent-erythema.female.58",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 58-year-old woman, visits the clinic with ten weeks of expanding redness, warmth and swelling involving about half of one breast. The patient is not lactating. Ultrasound shows skin thickening and an irregular hypoechoic area in the breast, without a fluid pocket.",
            "revisedFields": [
              "presentation"
            ],
            "aiAssistedDrafting": true,
            "reviewStatus": "needs_clinician_review",
            "lastClinicianReview": null
          },
          {
            "id": "ppr.qq20261102.profile.inflammatory-breast-cancer.persistent-erythema.female.62",
            "approvedInstantiationProfileId": "profile.inflammatory-breast-cancer.persistent-erythema.female.62",
            "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
            "revisedPresentation": "{patientName}, a 62-year-old woman, visits the clinic with ten weeks of expanding redness, warmth and swelling involving about half of one breast. The patient is not lactating. Ultrasound shows skin thickening and an irregular hypoechoic area in the breast, without a fluid pocket.",
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
        "ageYears": 50,
        "sexLabel": "Female"
      },
      "patientDisplayName": "{patientName}"
    },
    "presentationRevisionMetadata": {
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    }
  },
  {
    "id": "revision.qq20261102a.b37-context",
    "auditId": "B37-context",
    "caseId": "case.inflammatory-breast-cancer.persistent-erythema",
    "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.2",
    "previousQuestionVariantId": "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r2",
    "questionVariantId": "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which treatment sequence should be planned for {patientName}'s confirmed inflammatory breast cancer?",
    "previousChoiceLabels": [
      "Neoadjuvant therapy, surgery, then radiation",
      "Mastectomy, adjuvant therapy, then observation",
      "Lumpectomy, radiation, then systemic therapy",
      "Radiation, lumpectomy, then systemic therapy"
    ],
    "previousCurrentUpdate": "Breast core biopsy confirms invasive carcinoma. Biomarker testing is complete, and external staging shows regional stage III disease without distant metastasis.",
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Retain the significance of the original inflammatory presentation/stage despite a hypothetical clinical response. Then Select the appropriate operation/radiation plan rather than equating disappearance of findings with permission for conservation or surgery omission.",
    "reviewerNotes": "Melissa/breast team must confirm operability and the intended contemporary local-treatment pathway. No particular systemic regimen or actual intervening treatment course is invented.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "neoadjuvant_4": "neoadjuvant_4",
      "choice.qq20261102a.b37-context.d1": "surgery_first_4",
      "choice.qq20261102a.b37-context.d2": "lumpectomy_4"
    },
    "choiceServiceOverrides": {
      "neoadjuvant_4": null,
      "choice.qq20261102a.b37-context.d1": null,
      "choice.qq20261102a.b37-context.d2": null
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r2",
      "whatChanged": "Test a response-versus-local-treatment decision with explicit operation specificity, while keeping therapy response conditional so the existing encounter timeline remains coherent.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B37-context",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [
          "cues 1: Each option specifies an operation/radiation pathway at comparable detail. Generic surgery, omitted-radiation observation and two lumpectomy-order fillers are removed.",
          "cues 2: The represented inflammatory stage III pathway retains modified radical mastectomy and regional radiation despite apparent clinical response. Review boundary: Melissa/breast team must confirm operability and the intended contemporary local-treatment pathway. No particular systemic regimen or actual intervening treatment course is invented.",
          "cues 3: Each option specifies an operation/radiation pathway at comparable detail. Generic surgery, omitted-radiation observation and two lumpectomy-order fillers are removed."
        ],
        "fairness": [
          "fairness 1: The represented inflammatory stage III pathway retains modified radical mastectomy and regional radiation despite apparent clinical response. Review boundary: Melissa/breast team must confirm operability and the intended contemporary local-treatment pathway. No particular systemic regimen or actual intervening treatment course is invented.",
          "fairness 2: Require: Retain the significance of the original inflammatory presentation/stage despite a hypothetical clinical response. Then Select the appropriate operation/radiation plan rather than equating disappearance of findings with permission for conservation or surgery omission. The closest error is: Applying ordinary post-neoadjuvant breast-conservation reasoning to the original inflammatory presentation is credible.",
          "fairness 3: Each option specifies an operation/radiation pathway at comparable detail. Generic surgery, omitted-radiation observation and two lumpectomy-order fillers are removed. Test a response-versus-local-treatment decision with explicit operation specificity, while keeping therapy response conditional so the existing encounter timeline remains coherent.",
          "fairness 4: The represented inflammatory stage III pathway retains modified radical mastectomy and regional radiation despite apparent clinical response. Review boundary: Melissa/breast team must confirm operability and the intended contemporary local-treatment pathway. No particular systemic regimen or actual intervening treatment course is invented."
        ],
        "suggestions": [
          "suggestions 1: Test a response-versus-local-treatment decision with explicit operation specificity, while keeping therapy response conditional so the existing encounter timeline remains coherent.",
          "suggestions 2: Test a response-versus-local-treatment decision with explicit operation specificity, while keeping therapy response conditional so the existing encounter timeline remains coherent.",
          "suggestions 3: The represented inflammatory stage III pathway retains modified radical mastectomy and regional radiation despite apparent clinical response. Review boundary: Melissa/breast team must confirm operability and the intended contemporary local-treatment pathway. No particular systemic regimen or actual intervening treatment course is invented."
        ]
      },
      "selfCheck": {
        "cueAttack": "Each option specifies an operation/radiation pathway at comparable detail. Generic surgery, omitted-radiation observation and two lumpectomy-order fillers are removed.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Retain the significance of the original inflammatory presentation/stage despite a hypothetical clinical response.",
          "Select the appropriate operation/radiation plan rather than equating disappearance of findings with permission for conservation or surgery omission."
        ],
        "oneBestAnswer": "The represented inflammatory stage III pathway retains modified radical mastectomy and regional radiation despite apparent clinical response.",
        "closestDistractor": "Applying ordinary post-neoadjuvant breast-conservation reasoning to the original inflammatory presentation is credible.",
        "remainingReview": "Melissa/breast team must confirm operability and the intended contemporary local-treatment pathway. No particular systemic regimen or actual intervening treatment course is invented."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r3",
      "conceptId": "concept.inflammatory-breast-cancer.neoadjuvant-sequence",
      "stem": "If initial systemic therapy removes the palpable breast mass and skin changes, which local treatment plan should be retained for {patientName}?",
      "answerChoices": [
        {
          "id": "neoadjuvant_4",
          "label": "Modified radical mastectomy with chest-wall and regional-node radiotherapy",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Uses the original inflammatory cancer presentation and curative stage rather than assuming a clinical response permits omission or de-escalation of required local treatment."
        },
        {
          "id": "choice.qq20261102a.b37-context.d1",
          "label": "Breast-conserving resection followed by breast and regional-node radiotherapy",
          "isCorrect": false,
          "distractorRationale": "Mistakes clinical downstaging for permission to substitute breast conservation in the represented inflammatory cancer pathway."
        },
        {
          "id": "choice.qq20261102a.b37-context.d2",
          "label": "Chest-wall radiotherapy followed by surgery for subsequent local regrowth",
          "isCorrect": false,
          "distractorRationale": "Mistakes an apparent clinical response for justification to reserve surgery for salvage."
        }
      ],
      "explanation": "For the represented operable stage III inflammatory breast cancer, clinical response to initial systemic therapy does not by itself replace the planned mastectomy and postmastectomy regional radiation pathway. This is a conditional planning question, not a claim that therapy occurred during the biopsy-result wait.",
      "supportingEvidenceClaimIds": [
        "claim.brief.ibc.trimodality-sequence",
        "claim.qq20261102a.ibc-response-local-treatment"
      ],
      "teachingPoint": "For the represented operable stage III inflammatory breast cancer, clinical response to initial systemic therapy does not by itself replace the planned mastectomy and postmastectomy regional radiation pathway. This is a conditional planning question, not a claim that therapy occurred during the biopsy-result wait."
    }
  },
  {
    "id": "revision.qq20261102a.b38",
    "auditId": "B38",
    "caseId": "case.gs028se.confidence-interval-errors-power.a-ratio-crosses",
    "nodeId": "node.gs028se.confidence-interval-errors-power.a-ratio-crosses.1",
    "previousQuestionVariantId": "question.statistics-ethics.confidence-interval.v1.r2",
    "questionVariantId": "question.statistics-ethics.confidence-interval.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which summary should {patientName} use for the recurrence estimate?",
    "previousChoiceLabels": [
      "Recurrence could be 60% lower or 20% higher",
      "Recurrence could be 40% lower or 120% higher",
      "Recurrence could be 30% lower or 70% higher"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Fictional teaching dataset; intervention effects are simulated. Intervention versus control recurrence.",
      "items": [
        {
          "label": "Risk ratio",
          "value": "0.70"
        },
        {
          "label": "95% confidence interval",
          "value": "0.40 to 1.20"
        }
      ]
    },
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Translate relative-risk interval endpoints into event probabilities at the fixed reference risk. Then Subtract the reference risk and compare the absolute interval with the explicit hypothetical harm margin.",
    "reviewerNotes": "Statistics review must confirm the fixed-reference assumption. The harm margin is fictional protocol data, not a disease-specific clinical recommendation.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_ratio-crosses": "correct_ratio-crosses",
      "choice.qq20261102a.b38.d1": "choice.qq20261102.b38.d1",
      "choice.qq20261102a.b38.d2": "choice.qq20261102.b38.d2"
    },
    "choiceServiceOverrides": {
      "correct_ratio-crosses": null,
      "choice.qq20261102a.b38.d1": null,
      "choice.qq20261102a.b38.d2": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.statistics-ethics.confidence-interval.v1.r2",
      "whatChanged": "Add an explicit fixed reference risk and hypothetical decision margin; require relative-to-absolute translation and a subsequent protocol comparison, with precise interval language. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B38",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Only -12 to +4 percentage points follows the reference-risk conversion and uses the proper control subtraction.",
          "fairness 2: Only -12 to +4 percentage points follows the reference-risk conversion and uses the proper control subtraction. Review boundary: Statistics review must confirm the fixed-reference assumption. The harm margin is fictional protocol data, not a disease-specific clinical recommendation.",
          "fairness 3: Only -12 to +4 percentage points follows the reference-risk conversion and uses the proper control subtraction.",
          "fairness 4: Require: Translate relative-risk interval endpoints into event probabilities at the fixed reference risk. Then Subtract the reference risk and compare the absolute interval with the explicit hypothetical harm margin. The closest error is: Centering the interval on the point estimate or subtracting the intervention rather than control reference are plausible calculation errors."
        ],
        "suggestions": [
          "suggestions 1: Add an explicit fixed reference risk and hypothetical decision margin; require relative-to-absolute translation and a subsequent protocol comparison, with precise interval language. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "suggestions 2: Add an explicit fixed reference risk and hypothetical decision margin; require relative-to-absolute translation and a subsequent protocol comparison, with precise interval language. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "suggestions 3: Add an explicit fixed reference risk and hypothetical decision margin; require relative-to-absolute translation and a subsequent protocol comparison, with precise interval language. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting."
        ]
      },
      "selfCheck": {
        "cueAttack": "Every answer reports an absolute interval and a protocol comparison with parallel certainty. There is no uniquely cautious key and no imprecise claim that these are hard bounds on what could occur.",
        "difficulty": "hard",
        "reasoningSteps": [
          "Translate relative-risk interval endpoints into event probabilities at the fixed reference risk.",
          "Subtract the reference risk and compare the absolute interval with the explicit hypothetical harm margin."
        ],
        "oneBestAnswer": "Only -12 to +4 percentage points follows the reference-risk conversion and uses the proper control subtraction.",
        "closestDistractor": "Centering the interval on the point estimate or subtracting the intervention rather than control reference are plausible calculation errors.",
        "remainingReview": "Statistics review must confirm the fixed-reference assumption. The harm margin is fictional protocol data, not a disease-specific clinical recommendation."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.confidence-interval.v1.r3",
      "conceptId": "concept.statistics-ethics.confidence-interval",
      "stem": "Which translated interval and protocol conclusion should {patientName} report?",
      "answerChoices": [
        {
          "id": "correct_ratio-crosses",
          "label": "12 points lower to 4 higher; the +5-point margin is outside the interval",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Converts ratio bounds to event risks using the fixed control risk, then subtracts the control risk before comparing the margin."
        },
        {
          "id": "choice.qq20261102a.b38.d1",
          "label": "14 points lower to 2 higher; the +5-point margin is outside the interval",
          "isCorrect": false,
          "distractorRationale": "Incorrectly centers a symmetric absolute interval on the point estimate rather than translating the supplied asymmetric ratio bounds."
        },
        {
          "id": "choice.qq20261102a.b38.d2",
          "label": "6 points lower to 10 higher; the +5-point margin is inside the interval",
          "isCorrect": false,
          "distractorRationale": "Subtracts the predicted intervention point risk rather than the fixed control risk when forming risk-difference bounds."
        }
      ],
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
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.confidence-interval",
        "claim.gs028se.statistics.risk-ratio-odds-ratio",
        "claim.qq20261102a.relative-to-absolute-interval"
      ]
    },
    "presentationTemplate": "{patientName} leads an employee trial discussion. For a constructed recurrence comparison, use a fixed 20% control risk to translate the reported relative-risk interval. The hypothetical protocol asks whether an absolute risk increase of 5 percentage points is outside that interval.",
    "previousPresentation": "{patientName}, the study discussion lead, reviews an investigational femoral-hernia reinforcement study. The constructed trial compares recurrence over two years.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.gs028se.confidence-interval-errors-power.a-ratio-crosses",
        "patientPresentationVariantId": "presentation.gs028se.confidence-interval-errors-power.a-ratio-crosses",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedPresentation": "{patientName}, the study discussion lead, reviews an investigational femoral-hernia reinforcement study. The constructed trial compares recurrence over two years.",
        "revisedFields": [
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "chiefComplaint": "Recurrence study discussion",
    "previousChiefComplaint": "femoral hernia study",
    "previousProfileChiefComplaints": []
  },
  {
    "id": "revision.qq20261102a.b39",
    "auditId": "B39",
    "caseId": "case.gs028se.arr-nnt-p-value.b-p-0001",
    "nodeId": "node.gs028se.arr-nnt-p-value.b-p-0001.1",
    "previousQuestionVariantId": "question.statistics-ethics.p-value.v3.r2",
    "questionVariantId": "question.statistics-ethics.p-value.v3.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which interpretation of the reported p-value should {patientName} use?",
    "previousChoiceLabels": [
      "A 0.1% probability of data at least this extreme if the null model holds",
      "A 0.1% probability that the null model holds after these data are observed",
      "A 0.1% reduction in outcome probability for the intervention compared with the control"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": {
      "kind": "keyValue",
      "caption": "Fictional teaching dataset; intervention effects are simulated. Null hypothesis: equal outcome probabilities in the two groups.",
      "items": [
        {
          "label": "Analysis",
          "value": "Prespecified comparison of intervention and control"
        },
        {
          "label": "p-value",
          "value": "0.001"
        }
      ]
    },
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Apply the pre-specified two-sided null-test rule to the p-value. Then Independently compare the effect interval, direction and protocol target rather than equating significance with important benefit.",
    "reviewerNotes": "The target and testing level belong to this explicitly hypothetical protocol, not a clinical guideline. Intervals are constructed approximate study outputs; no real efficacy or decision to change patient care is claimed.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "correct_p-0001": "correct_p-0001",
      "choice.qq20261102a.b39.d1": "choice.qq20261102.b39.d1",
      "choice.qq20261102a.b39.d2": "choice.qq20261102.b39.d2",
      "choice.qq20261102a.b39.d3": "choice.qq20261102.b39.d1"
    },
    "choiceServiceOverrides": {
      "correct_p-0001": null,
      "choice.qq20261102a.b39.d1": null,
      "choice.qq20261102a.b39.d2": null,
      "choice.qq20261102a.b39.d3": null
    },
    "currentUpdate": null,
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.statistics-ethics.p-value.v3.r2",
      "whatChanged": "Replace definition recall with two linked report decisions using effect, uncertainty and an explicit fictional protocol target; balance all four response components. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B39",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Only one pair gets both the null-test decision and the separate interval-versus-target criterion right.",
          "fairness 2: Only one pair gets both the null-test decision and the separate interval-versus-target criterion right. Review boundary: The target and testing level belong to this explicitly hypothetical protocol, not a clinical guideline. Intervals are constructed approximate study outputs; no real efficacy or decision to change patient care is claimed.",
          "fairness 3: Require: Apply the pre-specified two-sided null-test rule to the p-value. Then Independently compare the effect interval, direction and protocol target rather than equating significance with important benefit. The closest error is: A very small p-value can tempt a claim that a numerically tiny effect meets a much larger target.",
          "fairness 4: Only one pair gets both the null-test decision and the separate interval-versus-target criterion right."
        ],
        "suggestions": [
          "suggestions 1: Require: Apply the pre-specified two-sided null-test rule to the p-value. Then Independently compare the effect interval, direction and protocol target rather than equating significance with important benefit. The closest error is: A very small p-value can tempt a claim that a numerically tiny effect meets a much larger target.",
          "suggestions 2: Replace definition recall with two linked report decisions using effect, uncertainty and an explicit fictional protocol target; balance all four response components. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting.",
          "suggestions 3: Replace definition recall with two linked report decisions using effect, uncertainty and an explicit fictional protocol target; balance all four response components. Use a symptom/visit-reason complaint consistent with this scenario, without an interpreted finding or an unrelated retained study setting."
        ]
      },
      "selfCheck": {
        "cueAttack": "Four balanced paired conclusions make each cautious/confident component equally frequent. The patient specialty is tied to an endpoint/decision rather than decorating a p-value definition.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Apply the pre-specified two-sided null-test rule to the p-value.",
          "Independently compare the effect interval, direction and protocol target rather than equating significance with important benefit."
        ],
        "oneBestAnswer": "Only one pair gets both the null-test decision and the separate interval-versus-target criterion right.",
        "closestDistractor": "A very small p-value can tempt a claim that a numerically tiny effect meets a much larger target.",
        "remainingReview": "The target and testing level belong to this explicitly hypothetical protocol, not a clinical guideline. Intervals are constructed approximate study outputs; no real efficacy or decision to change patient care is claimed."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.p-value.v3.r3",
      "conceptId": "concept.statistics-ethics.p-value",
      "stem": "Which paired conclusion should {patientName} report from this study?",
      "answerChoices": [
        {
          "id": "correct_p-0001",
          "label": "Zero-effect hypothesis rejected; target benefit excluded",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Separates the pre-specified null test from whether the whole interval supports the protocol's target benefit."
        },
        {
          "id": "choice.qq20261102a.b39.d1",
          "label": "Zero-effect hypothesis rejected; target benefit not excluded",
          "isCorrect": false,
          "distractorRationale": "Gets the null-test decision right but substitutes statistical significance or the point estimate for the protocol's magnitude criterion."
        },
        {
          "id": "choice.qq20261102a.b39.d2",
          "label": "Zero-effect hypothesis not rejected; target benefit excluded",
          "isCorrect": false,
          "distractorRationale": "Handles the magnitude criterion but misreads the pre-specified null test."
        },
        {
          "id": "choice.qq20261102a.b39.d3",
          "label": "Zero-effect hypothesis not rejected; target benefit not excluded",
          "isCorrect": false,
          "distractorRationale": "Conflates the null-test and magnitude decisions."
        }
      ],
      "explanation": "The null test is significant, but the whole interval describes benefits smaller than the hypothetical one-point protocol target. Rejecting a zero effect does not imply that an important target magnitude remains plausible. These are constructed protocol criteria, not a clinical guideline.",
      "teachingPoint": "The null test is significant, but the whole interval describes benefits smaller than the hypothetical one-point protocol target. Rejecting a zero effect does not imply that an important target magnitude remains plausible. These are constructed protocol criteria, not a clinical guideline.",
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
        "claim.qq20261102a.null-test-versus-protocol-magnitude"
      ]
    },
    "presentationTemplate": "{patientName} leads an employee journal-club discussion of a constructed randomized thyroid surgery comparison. The protocol tests a zero risk difference at a two-sided 0.05 level and separately specifies a benefit of at least 1 percentage points for its study decision.",
    "previousPresentation": "{patientName}, the journal-club lead, reviews an investigational gastric-MALT recurrence prevention study. It compares an intervention with a control and reports recurrence within two years.",
    "previousProfilePresentations": [],
    "presentationContextBinding": {
      "patientPresentationRevision": {
        "id": "ppr.qq20261102.case.gs028se.arr-nnt-p-value.b-p-0001",
        "patientPresentationVariantId": "presentation.gs028se.arr-nnt-p-value.b-p-0001",
        "contentVersion": "presentation-revision.question-quality.2026-11-02.v4",
        "revisedPresentation": "{patientName}, the journal-club lead, reviews an investigational gastric-MALT recurrence prevention study. It compares an intervention with a control and reports recurrence within two years.",
        "revisedFields": [
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
      "idPrefix": "ppr.qq20261102a.",
      "contentVersion": "presentation-revision.question-quality.2026-11-02.v5"
    },
    "chiefComplaint": "Thyroid surgery study",
    "previousChiefComplaint": "gastric MALT lymphoma study",
    "previousProfileChiefComplaints": []
  },
  {
    "id": "revision.qq20261102a.b40",
    "auditId": "B40",
    "caseId": "case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
    "nodeId": "node.peptic-ulcer-bleeding.visible-vessel-treat.v1",
    "previousQuestionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r2",
    "questionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which treatment plan should be arranged for {patientName}'s ulcer finding?",
    "previousChoiceLabels": [
      "Endoscopic hemostasis and acid suppression",
      "Acid suppression and planned endoscopic reassessment",
      "Angiographic embolization and acid suppression"
    ],
    "previousCurrentUpdate": null,
    "previousExhibit": null,
    "educationalIntent": "resident_two_step_reviewer_prediction_pending",
    "intendedInference": "Interpret the raw base finding despite absence of active bleeding. Then Choose a suitable initial local modality rather than assuming every endoscopic agent is an equivalent definitive treatment.",
    "reviewerNotes": "Melissa/endoscopy must verify lesion suitability. The feedback does not name the later correct modality or teach the complete next-step rule before that question.",
    "contextCompanion": false,
    "choiceSourceIds": {
      "perform_endoscopic_hemostasis": "perform_endoscopic_hemostasis",
      "choice.qq20261102a.b40.d1": "choice.qq20261102.b40.d1",
      "choice.qq20261102a.b40.d2": "choice.qq20261102.b40.d2"
    },
    "choiceServiceOverrides": {
      "perform_endoscopic_hemostasis": null,
      "choice.qq20261102a.b40.d1": null,
      "choice.qq20261102a.b40.d2": null
    },
    "choiceTimingOverrides": {
      "perform_endoscopic_hemostasis": {
        "kind": "no_test"
      },
      "choice.qq20261102a.b40.d1": {
        "kind": "no_test"
      },
      "choice.qq20261102a.b40.d2": {
        "kind": "no_test"
      }
    },
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r2",
      "whatChanged": "Retain the raw vessel/dry-field finding and compare three same-stage endoscopic regimens rather than a weak preemptive embolization alternative.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B40",
      "originalVerdict": "REVISE",
      "noteResponses": {
        "cues": [],
        "fairness": [
          "fairness 1: Clip treatment is an appropriate initial modality for the represented stigma; the two standalone agent alternatives are not equivalent first-line definitive regimens. Review boundary: Melissa/endoscopy must verify lesion suitability. The feedback does not name the later correct modality or teach the complete next-step rule before that question.",
          "fairness 2: Require: Interpret the raw base finding despite absence of active bleeding. Then Choose a suitable initial local modality rather than assuming every endoscopic agent is an equivalent definitive treatment. The closest error is: Assuming injection or topical hemostasis is interchangeable with mechanical treatment after the field becomes dry is plausible.",
          "fairness 3: Require: Interpret the raw base finding despite absence of active bleeding. Then Choose a suitable initial local modality rather than assuming every endoscopic agent is an equivalent definitive treatment. The closest error is: Assuming injection or topical hemostasis is interchangeable with mechanical treatment after the field becomes dry is plausible.",
          "fairness 4: Clip treatment is an appropriate initial modality for the represented stigma; the two standalone agent alternatives are not equivalent first-line definitive regimens. Review boundary: Melissa/endoscopy must verify lesion suitability. The feedback does not name the later correct modality or teach the complete next-step rule before that question."
        ],
        "suggestions": [
          "suggestions 1: Retain the raw vessel/dry-field finding and compare three same-stage endoscopic regimens rather than a weak preemptive embolization alternative.",
          "suggestions 2: Require: Interpret the raw base finding despite absence of active bleeding. Then Choose a suitable initial local modality rather than assuming every endoscopic agent is an equivalent definitive treatment. The closest error is: Assuming injection or topical hemostasis is interchangeable with mechanical treatment after the field becomes dry is plausible.",
          "suggestions 3: Clip treatment is an appropriate initial modality for the represented stigma; the two standalone agent alternatives are not equivalent first-line definitive regimens. Review boundary: Melissa/endoscopy must verify lesion suitability. The feedback does not name the later correct modality or teach the complete next-step rule before that question."
        ]
      },
      "selfCheck": {
        "cueAttack": "All three choices are initial endoscopic regimens with identical acid-suppression detail; embolization-before-failure and treatment-versus-no-treatment shortcuts are removed.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the raw base finding despite absence of active bleeding.",
          "Choose a suitable initial local modality rather than assuming every endoscopic agent is an equivalent definitive treatment."
        ],
        "oneBestAnswer": "Clip treatment is an appropriate initial modality for the represented stigma; the two standalone agent alternatives are not equivalent first-line definitive regimens.",
        "closestDistractor": "Assuming injection or topical hemostasis is interchangeable with mechanical treatment after the field becomes dry is plausible.",
        "remainingReview": "Melissa/endoscopy must verify lesion suitability. The feedback does not name the later correct modality or teach the complete next-step rule before that question."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r3",
      "conceptId": "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis",
      "stem": "Which initial hemostatic plan should be used for {patientName}'s ulcer?",
      "answerChoices": [
        {
          "id": "perform_endoscopic_hemostasis",
          "label": "Endoscopic clip placement with proton-pump inhibitor treatment",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Treats the exposed vessel with a recommended local hemostatic modality despite the dry field."
        },
        {
          "id": "choice.qq20261102a.b40.d1",
          "label": "Endoscopic epinephrine injection with proton-pump inhibitor treatment",
          "isCorrect": false,
          "distractorRationale": "Mistakes transient injection hemostasis for an adequate standalone local treatment of this high-risk stigma."
        },
        {
          "id": "choice.qq20261102a.b40.d2",
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
    "id": "revision.qq20261102a.b40-context",
    "auditId": "B40-context",
    "caseId": "case.l2.peptic-ulcer-bleeding.visible-vessel-hemostasis.v1",
    "nodeId": "node.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1",
    "previousQuestionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r2",
    "questionVariantId": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r3",
    "previousContentVersions": [
      "question-authoring.2026-11-02.v4"
    ],
    "previousStem": "Which endoscopic option should be avoided as sole treatment for {patientName}'s nonbleeding ulcer vessel?",
    "previousChoiceLabels": [
      "Epinephrine plus bipolar coagulation",
      "Epinephrine injection alone",
      "Bipolar coagulation alone",
      "Endoscopic clip alone"
    ],
    "previousCurrentUpdate": "A stable adult with recent maroon stool undergoes EGD. A gastric ulcer contains a nonbleeding visible vessel, and four possible hemostatic plans are considered.",
    "previousExhibit": null,
    "educationalIntent": "context_companion_two_step",
    "intendedInference": "Interpret the failed clip and injection-controlled oozing as an incompletely treated vessel, not completed definitive hemostasis. Then Choose a suitable additional modality rather than more of the same injection or a temporizing surface agent.",
    "reviewerNotes": "Melissa/endoscopy must confirm technical suitability. No ulcer size, drug dose, repeat-endoscopy interval or claim that powder never has a role is invented.",
    "contextCompanion": true,
    "choiceSourceIds": {
      "choice.qq20261102a.b40-context.key": "epinephrine_alone",
      "choice.qq20261102a.b40-context.d1": "epinephrine_plus_bipolar",
      "choice.qq20261102a.b40-context.d2": "bipolar_alone"
    },
    "choiceServiceOverrides": {
      "choice.qq20261102a.b40-context.key": null,
      "choice.qq20261102a.b40-context.d1": null,
      "choice.qq20261102a.b40-context.d2": null
    },
    "currentUpdate": "During treatment of {patientName}'s same duodenal ulcer, a clip does not grasp the base. Epinephrine injection controls the oozing, but the vessel remains visible.",
    "adversarialReview": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r2",
      "whatChanged": "Repair patient/duodenal-location continuity and replace a monotherapy-exclusion quiz with an affirmative decision after a concrete hemostatic attempt.",
      "status": "awaiting_independent_re_review"
    },
    "reviewResponse": {
      "sourceReviewId": "docs/research/question-batch1-adversarial-review-20261102.json#B40-context",
      "originalVerdict": "FAIL",
      "noteResponses": {
        "cues": [
          "cues 1: The same named patient and duodenal lesion persist. The affirmative task has three comparable standalone interventions; there is no sole-treatment/combination-option logical elimination or duplicated bipolar component. Repair patient/duodenal-location continuity and replace a monotherapy-exclusion quiz with an affirmative decision after a concrete hemostatic attempt.",
          "cues 2: The same named patient and duodenal lesion persist. The affirmative task has three comparable standalone interventions; there is no sole-treatment/combination-option logical elimination or duplicated bipolar component. Repair patient/duodenal-location continuity and replace a monotherapy-exclusion quiz with an affirmative decision after a concrete hemostatic attempt."
        ],
        "fairness": [
          "fairness 1: The offered contact therapy adds the appropriate distinct local treatment after the described injection/clip course. Review boundary: Melissa/endoscopy must confirm technical suitability. No ulcer size, drug dose, repeat-endoscopy interval or claim that powder never has a role is invented.",
          "fairness 2: The offered contact therapy adds the appropriate distinct local treatment after the described injection/clip course. Review boundary: Melissa/endoscopy must confirm technical suitability. No ulcer size, drug dose, repeat-endoscopy interval or claim that powder never has a role is invented.",
          "fairness 3: Require: Interpret the failed clip and injection-controlled oozing as an incompletely treated vessel, not completed definitive hemostasis. Then Choose a suitable additional modality rather than more of the same injection or a temporizing surface agent. The closest error is: Mistaking cessation of oozing after injection for completion of treatment is plausible.",
          "fairness 4: The offered contact therapy adds the appropriate distinct local treatment after the described injection/clip course."
        ],
        "suggestions": [
          "suggestions 1: The offered contact therapy adds the appropriate distinct local treatment after the described injection/clip course. Review boundary: Melissa/endoscopy must confirm technical suitability. No ulcer size, drug dose, repeat-endoscopy interval or claim that powder never has a role is invented.",
          "suggestions 2: Repair patient/duodenal-location continuity and replace a monotherapy-exclusion quiz with an affirmative decision after a concrete hemostatic attempt.",
          "suggestions 3: The offered contact therapy adds the appropriate distinct local treatment after the described injection/clip course. Review boundary: Melissa/endoscopy must confirm technical suitability. No ulcer size, drug dose, repeat-endoscopy interval or claim that powder never has a role is invented."
        ]
      },
      "selfCheck": {
        "cueAttack": "The same named patient and duodenal lesion persist. The affirmative task has three comparable standalone interventions; there is no sole-treatment/combination-option logical elimination or duplicated bipolar component.",
        "difficulty": "moderate",
        "reasoningSteps": [
          "Interpret the failed clip and injection-controlled oozing as an incompletely treated vessel, not completed definitive hemostasis.",
          "Choose a suitable additional modality rather than more of the same injection or a temporizing surface agent."
        ],
        "oneBestAnswer": "The offered contact therapy adds the appropriate distinct local treatment after the described injection/clip course.",
        "closestDistractor": "Mistaking cessation of oozing after injection for completion of treatment is plausible.",
        "remainingReview": "Melissa/endoscopy must confirm technical suitability. No ulcer size, drug dose, repeat-endoscopy interval or claim that powder never has a role is invented."
      }
    },
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r3",
      "conceptId": "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality",
      "stem": "Which intervention should complete {patientName}'s endoscopic treatment?",
      "answerChoices": [
        {
          "id": "choice.qq20261102a.b40-context.key",
          "label": "Contact bipolar coagulation of the visible vessel",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Adds an appropriate second local modality after injection, when the initial clip attempt has not treated the target."
        },
        {
          "id": "choice.qq20261102a.b40-context.d1",
          "label": "Additional epinephrine injection around the visible vessel",
          "isCorrect": false,
          "distractorRationale": "Repeats the same temporary injection strategy without supplying the necessary additional local modality."
        },
        {
          "id": "choice.qq20261102a.b40-context.d2",
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
