// Project-owned clinical drafts. Key shown first for review only; runtime choices are shuffled.
import type { QuestionQualityRevision } from "./question-quality-pilot-20261028";

export const QUESTION_QUALITY_PRIOR_DEFINITIONS: QuestionQualityRevision[] = [
  {
    "id": "revision.question-quality.20261028.A02",
    "auditId": "A02",
    "caseId": "case.gs028c.acute-cholecystitis.a-stones-without-secondary-signs",
    "nodeId": "node.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.1",
    "previousQuestionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v2",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-10-02.pre-endoscopy.1"
    ],
    "previousStem": "Which diagnostic study should be used next to evaluate suspected acute cholecystitis after an equivocal ultrasound?",
    "previousChoiceLabels": [
      "Hepatobiliary scintigraphy",
      "Right-upper-quadrant ultrasound",
      "Noncontrast abdominal CT",
      "Biliary magnetic resonance imaging"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, comes to the clinic with sustained right-upper-quadrant pain, nausea and inflammatory laboratory findings. Ultrasound shows gallstones, but the gallbladder inflammatory findings are inconclusive. The patient is stable; further imaging can be arranged at the receiving hospital without an availability constraint.",
    "educationalIntent": "routine_resident_candidate",
    "intendedInference": "Choose a clarifying study from the unresolved diagnostic goal and comparative performance, without being told which keyed test is available.",
    "reviewerNotes": "One guideline supports this ranking; verify the comparative wording and the absence of competing clinical imaging goals. No new concept meaning intended.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r2",
      "conceptId": "concept.cholecystitis.hida-after-equivocal-ultrasound",
      "stem": "Which additional study offers the greatest diagnostic sensitivity for suspected acute calculous cholecystitis after this equivocal ultrasound?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Hepatobiliary scintigraphy",
          "isCorrect": true,
          "rationale": "Uses the unresolved suspicion and comparative diagnostic performance, rather than a named available test in the presentation.",
          "distractorRationale": null
        },
        {
          "id": "d2_2",
          "label": "Contrast-enhanced abdominal CT",
          "isCorrect": false,
          "rationale": "A reasonable alternative abdominal study is tempting after inconclusive ultrasound; it is less well matched to the question's requested comparative sensitivity for cholecystitis.",
          "distractorRationale": "A reasonable alternative abdominal study is tempting after inconclusive ultrasound; it is less well matched to the question's requested comparative sensitivity for cholecystitis."
        },
        {
          "id": "d3_2",
          "label": "Biliary magnetic resonance imaging",
          "isCorrect": false,
          "rationale": "Detailed biliary anatomy is attractive, but the requested discrimination is diagnostic sensitivity for acute cholecystitis rather than duct mapping.",
          "distractorRationale": "Detailed biliary anatomy is attractive, but the requested discrimination is diagnostic sensitivity for acute cholecystitis rather than duct mapping."
        }
      ],
      "explanation": "Hepatobiliary scintigraphy is the best of these choices for diagnostic sensitivity when suspected acute calculous cholecystitis still needs clarification after equivocal ultrasound and resources permit. CT or MRI can have other roles; this item asks a defined comparative question rather than declaring one universal next test.",
      "teachingPoint": "Hepatobiliary scintigraphy is the best of these choices for diagnostic sensitivity when suspected acute calculous cholecystitis still needs clarification after equivocal ultrasound and resources permit. CT or MRI can have other roles; this item asks a defined comparative question rather than declaring one universal next test.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.cholecystitis.hida-after-equivocal-us",
        "claim.qq20261028.cholecystitis.comparative-imaging"
      ]
    },
    "previousPresentation": "{patientName}, a 37-year-old woman, comes to the clinic with sustained right-upper-quadrant pain, nausea, and inflammatory laboratory findings. Ultrasound confirms stones but the secondary signs of acute inflammation are inconclusive. The patient is stable and HIDA is promptly available at the receiving hospital.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.female.37",
        "presentation": "{patientName}, a 37-year-old woman, comes to the clinic with sustained right-upper-quadrant pain, nausea, and inflammatory laboratory findings. Ultrasound confirms stones but the secondary signs of acute inflammation are inconclusive. The patient is stable and HIDA is promptly available at the receiving hospital."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.male.37",
        "presentation": "{patientName}, a 37-year-old man, comes to the clinic with sustained right-upper-quadrant pain, nausea, and inflammatory laboratory findings. Ultrasound confirms stones but the secondary signs of acute inflammation are inconclusive. The patient is stable and HIDA is promptly available at the receiving hospital."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.female.64",
        "presentation": "{patientName}, a 64-year-old woman, comes to the clinic with sustained right-upper-quadrant pain, nausea, and inflammatory laboratory findings. Ultrasound confirms stones but the secondary signs of acute inflammation are inconclusive. The patient is stable and HIDA is promptly available at the receiving hospital."
      },
      {
        "id": "profile.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.male.64",
        "presentation": "{patientName}, a 64-year-old man, comes to the clinic with sustained right-upper-quadrant pain, nausea, and inflammatory laboratory findings. Ultrasound confirms stones but the secondary signs of acute inflammation are inconclusive. The patient is stable and HIDA is promptly available at the receiving hospital."
      }
    ]
  },
  {
    "id": "revision.question-quality.20261028.A04",
    "auditId": "A04",
    "caseId": "case.gs028f.nutrition.c1-where-phosphate-went",
    "nodeId": "node.gs028f.nutrition.c1-where-phosphate-went.1",
    "previousQuestionVariantId": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2",
    "questionVariantId": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-10-07.variety.2"
    ],
    "previousStem": "Which movement of phosphate best matches the insulin-associated refeeding shift documented for this patient?",
    "previousChoiceLabels": [
      "From extracellular blood into cells",
      "From cells into the extracellular blood",
      "From circulating blood into the urine",
      "From intestinal lumen into circulating blood"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, returns to the clinic after a completed hospital nutrition restart following prolonged poor intake. The record shows that carbohydrate intake increased, insulin rose and serum phosphate fell. The patient has recovered and asks about the earlier laboratory change.",
    "educationalIntent": "foundational_mechanism_application",
    "intendedInference": "Infer the insulin-associated intracellular shift from the nutrition sequence and laboratory direction, rather than repeat a supplied interpretation.",
    "reviewerNotes": "This remains a compartment/mechanism objective; it does not diagnose every cause of hypophosphatemia or teach a replacement regimen.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2.r2",
      "conceptId": "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift",
      "stem": "Which phosphate movement best accounts for the fall in serum phosphate during this nutrition restart?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "From extracellular fluid into cells",
          "isCorrect": true,
          "rationale": "Connects carbohydrate-driven insulin activity with cellular phosphate uptake.",
          "distractorRationale": null
        },
        {
          "id": "d1_2",
          "label": "From cells into extracellular fluid",
          "isCorrect": false,
          "rationale": "Reverses the compartment shift and would tend to raise the measured extracellular concentration.",
          "distractorRationale": "Reverses the compartment shift and would tend to raise the measured extracellular concentration."
        },
        {
          "id": "d2_2",
          "label": "From circulating blood into urine",
          "isCorrect": false,
          "rationale": "Mistakes an intracellular redistribution for renal loss after focusing on the falling serum result.",
          "distractorRationale": "Mistakes an intracellular redistribution for renal loss after focusing on the falling serum result."
        },
        {
          "id": "d3_2",
          "label": "From intestinal lumen into blood",
          "isCorrect": false,
          "rationale": "Confuses the source of newly absorbed nutrients with the redistribution explaining the serum fall.",
          "distractorRationale": "Confuses the source of newly absorbed nutrients with the redistribution explaining the serum fall."
        }
      ],
      "explanation": "After prolonged undernutrition, carbohydrate-associated insulin activity can increase cellular phosphate uptake. The relevant movement is from extracellular fluid into cells; the serum result measures the extracellular compartment.",
      "teachingPoint": "After prolonged undernutrition, carbohydrate-associated insulin activity can increase cellular phosphate uptake. The relevant movement is from extracellular fluid into cells; the serum result measures the extracellular compartment.",
      "supportingEvidenceClaimIds": [
        "claim.gs028f.refeeding.insulin-phosphate-shift"
      ]
    },
    "previousPresentation": "{patientName}, a 45-year-old woman, returns after a completed hospital nutrition restart. The team identified an insulin-associated phosphate shift after prolonged poor intake. The patient has no ongoing symptoms and asks which compartment received phosphate as the blood concentration fell.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028f.nutrition.c1-where-phosphate-went.female.45",
        "presentation": "{patientName}, a 45-year-old woman, returns after a completed hospital nutrition restart. The team identified an insulin-associated phosphate shift after prolonged poor intake. The patient has no ongoing symptoms and asks which compartment received phosphate as the blood concentration fell."
      },
      {
        "id": "profile.gs028f.nutrition.c1-where-phosphate-went.male.45",
        "presentation": "{patientName}, a 45-year-old man, returns after a completed hospital nutrition restart. The team identified an insulin-associated phosphate shift after prolonged poor intake. The patient has no ongoing symptoms and asks which compartment received phosphate as the blood concentration fell."
      },
      {
        "id": "profile.gs028f.nutrition.c1-where-phosphate-went.female.72",
        "presentation": "{patientName}, a 72-year-old woman, returns after a completed hospital nutrition restart. The team identified an insulin-associated phosphate shift after prolonged poor intake. The patient has no ongoing symptoms and asks which compartment received phosphate as the blood concentration fell."
      },
      {
        "id": "profile.gs028f.nutrition.c1-where-phosphate-went.male.72",
        "presentation": "{patientName}, a 72-year-old man, returns after a completed hospital nutrition restart. The team identified an insulin-associated phosphate shift after prolonged poor intake. The patient has no ongoing symptoms and asks which compartment received phosphate as the blood concentration fell."
      }
    ]
  },
  {
    "id": "revision.question-quality.20261028.A06",
    "auditId": "A06",
    "caseId": "case.gs028b.nipple-discharge.paired-bloody-single-duct",
    "nodeId": "node.gs028b.nipple-discharge.paired-bloody-single-duct.1",
    "previousQuestionVariantId": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1",
    "questionVariantId": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.pre-endoscopy.1"
    ],
    "previousStem": "How should this discharge pattern be classified?",
    "previousChoiceLabels": [
      "Pathologic discharge pattern",
      "Physiologic multiduct discharge",
      "Lactational milk production",
      "Superficial breast cellulitis"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after noticing intermittent small blood-stained spots inside the left side of the bra. Examination localizes the discharge to one duct. The discharge has appeared during ordinary activity as well as at the visit.",
    "educationalIntent": "foundational_feature_selection",
    "intendedInference": "Weight the observed features that distinguish pathologic from physiologic discharge; no infection or lactation alternatives are pre-excluded.",
    "reviewerNotes": "The concept remains pattern recognition, not etiologic diagnosis. Confirm that the two competing observed features are credible novice errors; do not claim resident stretch difficulty.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r2",
      "conceptId": "concept.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition",
      "stem": "Which feature of this nipple discharge most strongly supports a pathologic rather than a physiologic pattern?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Spontaneous single-duct discharge",
          "isCorrect": true,
          "rationale": "Uses the pattern that warrants pathologic-discharge evaluation; it does not identify a specific underlying lesion.",
          "distractorRationale": null
        },
        {
          "id": "d1_1",
          "label": "Intermittent episodes of discharge",
          "isCorrect": false,
          "rationale": "Intermittent timing can seem reassuring or concerning, but does not classify the pattern as reliably as the origin and spontaneity.",
          "distractorRationale": "Intermittent timing can seem reassuring or concerning, but does not classify the pattern as reliably as the origin and spontaneity."
        },
        {
          "id": "d2_1",
          "label": "Small volume of discharge",
          "isCorrect": false,
          "rationale": "The amount can distract from the more informative pattern; scant discharge can still warrant evaluation.",
          "distractorRationale": "The amount can distract from the more informative pattern; scant discharge can still warrant evaluation."
        }
      ],
      "explanation": "Spontaneous discharge from one duct, particularly when unilateral and blood-stained, supports a pathologic pattern requiring evaluation. Intermittent timing or small volume does not establish a physiologic pattern.",
      "teachingPoint": "Spontaneous discharge from one duct, particularly when unilateral and blood-stained, supports a pathologic pattern requiring evaluation. Intermittent timing or small volume does not establish a physiologic pattern.",
      "supportingEvidenceClaimIds": [
        "claim.discharge.pathologic-pattern"
      ]
    },
    "previousPresentation": "{patientName}, a 42-year-old woman, presents with spontaneous unilateral bloody discharge arising from one duct without compression. No fever or lactation is present.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028b.nipple-discharge.paired-bloody-single-duct.female.42",
        "presentation": "{patientName}, a 42-year-old woman, presents with spontaneous unilateral bloody discharge arising from one duct without compression. No fever or lactation is present."
      },
      {
        "id": "profile.gs028b.nipple-discharge.paired-bloody-single-duct.female.58",
        "presentation": "{patientName}, a 58-year-old woman, presents with spontaneous unilateral bloody discharge arising from one duct without compression. No fever or lactation is present."
      }
    ]
  },
  {
    "id": "revision.question-quality.20261028.A06.context",
    "auditId": "A06-context",
    "caseId": "case.gs028b.nipple-discharge.paired-bloody-single-duct",
    "nodeId": "node.gs028b.nipple-discharge.paired-bloody-single-duct.2",
    "previousQuestionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1",
    "questionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.pre-endoscopy.1"
    ],
    "previousStem": "Which initial imaging plan is most appropriate?",
    "previousChoiceLabels": [
      "Diagnostic mammography and ultrasound",
      "Screening mammography without targeted ultrasound",
      "Breast MRI without diagnostic mammography",
      "Observation without diagnostic breast imaging"
    ],
    "educationalIntent": "context_companion_unmodified_task",
    "intendedInference": "Existing follow-up/task retained; shared presentation revised by A06.",
    "reviewerNotes": "Version advanced for changed pre-answer context; same concept, task, options, evidence mappings and results. Review the full case sequence.",
    "contextCompanion": true,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r2",
      "conceptId": "concept.pathologic-nipple-discharge.diagnostic-imaging",
      "stem": "Which initial imaging plan is most appropriate?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Diagnostic mammography and ultrasound",
          "isCorrect": true,
          "distractorRationale": null
        },
        {
          "id": "d1_1",
          "label": "Screening mammography without targeted ultrasound",
          "isCorrect": false,
          "distractorRationale": "A symptom requires a diagnostic rather than screening pathway."
        },
        {
          "id": "d2_1",
          "label": "Breast MRI without diagnostic mammography",
          "isCorrect": false,
          "distractorRationale": "MRI is not the standard sole initial study for this presentation."
        },
        {
          "id": "d3_1",
          "label": "Observation without diagnostic breast imaging",
          "isCorrect": false,
          "distractorRationale": "Pathologic discharge warrants evaluation even without a palpable mass."
        }
      ],
      "explanation": "For an adult at least 40 with pathologic discharge, use diagnostic mammography or DBT and targeted ultrasound rather than screening imaging.",
      "supportingEvidenceClaimIds": [
        "claim.discharge.imaging"
      ]
    }
  },
  {
    "id": "revision.question-quality.20261028.A08",
    "auditId": "A08",
    "caseId": "case.gs028e.wound-healing-remaining.c2-skin-excision-plan",
    "nodeId": "node.gs028e.wound-healing-remaining.c2-skin-excision-plan.1",
    "previousQuestionVariantId": "question.wound.secondary-intention-healing.v1",
    "questionVariantId": "question.wound.secondary-intention-healing.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-10-07.variety.1"
    ],
    "previousStem": "Which healing strategy describes this patient's wound being left open without later edge closure?",
    "previousChoiceLabels": [
      "Healing by secondary intention",
      "Healing by direct edge approximation",
      "Healing after delayed edge closure",
      "Healing after skin-graft placement"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic to review an outside dermatology record after removal of a small skin lesion. At follow-up, the wound edges remain apart and the defect is becoming smaller as it heals. The wound-care plan is dressings while healing proceeds.",
    "educationalIntent": "foundational_terminology",
    "intendedInference": "Recognize the healing strategy from the observed course instead of alternative-by-alternative exclusions.",
    "reviewerNotes": "Keep the closing course sufficiently explicit to distinguish delayed closure; the simple concept cannot fairly be made a stretch item by deleting that distinction.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.wound.secondary-intention-healing.v1.r2",
      "conceptId": "concept.wound.secondary-intention-healing",
      "stem": "Which healing strategy describes this skin-excision wound's documented course?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Healing by secondary intention",
          "isCorrect": true,
          "rationale": "Recognizes healing of the open defect rather than relying on a list excluding sutures, grafting and later closure.",
          "distractorRationale": null
        },
        {
          "id": "d1_1",
          "label": "Healing by primary intention",
          "isCorrect": false,
          "rationale": "Mistakes ordinary postoperative wound care for immediate edge approximation.",
          "distractorRationale": "Mistakes ordinary postoperative wound care for immediate edge approximation."
        },
        {
          "id": "d2_1",
          "label": "Healing by delayed primary closure",
          "isCorrect": false,
          "rationale": "Confuses continuing open-wound healing with an initial open interval followed by edge closure.",
          "distractorRationale": "Confuses continuing open-wound healing with an initial open interval followed by edge closure."
        }
      ],
      "explanation": "This course describes secondary-intention healing: the defect heals while the edges remain apart. Primary intention approximates the edges, while delayed primary closure includes later edge closure. This names the supplied course rather than recommending open healing for every excision.",
      "teachingPoint": "This course describes secondary-intention healing: the defect heals while the edges remain apart. Primary intention approximates the edges, while delayed primary closure includes later edge closure. This names the supplied course rather than recommending open healing for every excision.",
      "supportingEvidenceClaimIds": [
        "claim.gs028e.secondary_intention"
      ]
    },
    "previousPresentation": "{patientName}, a 46-year-old woman, reviews an outside dermatology record after a small skin lesion was removed. The treating clinician deliberately left the appropriate defect open to heal without stitches, a graft or planned later closure. The patient is well and has no wound-infection symptoms.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028e.wound-healing-remaining.c2-skin-excision-plan.female.46",
        "presentation": "{patientName}, a 46-year-old woman, reviews an outside dermatology record after a small skin lesion was removed. The treating clinician deliberately left the appropriate defect open to heal without stitches, a graft or planned later closure. The patient is well and has no wound-infection symptoms."
      },
      {
        "id": "profile.gs028e.wound-healing-remaining.c2-skin-excision-plan.male.46",
        "presentation": "{patientName}, a 46-year-old man, reviews an outside dermatology record after a small skin lesion was removed. The treating clinician deliberately left the appropriate defect open to heal without stitches, a graft or planned later closure. The patient is well and has no wound-infection symptoms."
      },
      {
        "id": "profile.gs028e.wound-healing-remaining.c2-skin-excision-plan.female.71",
        "presentation": "{patientName}, a 71-year-old woman, reviews an outside dermatology record after a small skin lesion was removed. The treating clinician deliberately left the appropriate defect open to heal without stitches, a graft or planned later closure. The patient is well and has no wound-infection symptoms."
      },
      {
        "id": "profile.gs028e.wound-healing-remaining.c2-skin-excision-plan.male.71",
        "presentation": "{patientName}, a 71-year-old man, reviews an outside dermatology record after a small skin lesion was removed. The treating clinician deliberately left the appropriate defect open to heal without stitches, a graft or planned later closure. The patient is well and has no wound-infection symptoms."
      }
    ]
  },
  {
    "id": "revision.question-quality.20261028.A11",
    "auditId": "A11",
    "caseId": "case.gs028b.differentiated-thyroid-cancer.paired-malignant-cytology",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.paired-malignant-cytology.2",
    "previousQuestionVariantId": "question.differentiated-thyroid-cancer.individualized-surgical-extent.v1",
    "questionVariantId": "question.differentiated-thyroid-cancer.individualized-surgical-extent.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.pre-endoscopy.1"
    ],
    "previousStem": "Which planning approach is most appropriate?",
    "previousChoiceLabels": [
      "Discuss lobectomy as an eligible option",
      "Mandate total thyroidectomy for every DTC",
      "Avoid surgical evaluation entirely",
      "Choose the operation from age alone"
    ],
    "currentUpdate": "Neck ultrasound shows a 2 cm papillary thyroid carcinoma confined to one lobe, with no gross extension beyond the thyroid, no suspicious cervical nodes and a normal-appearing contralateral lobe. Staging has not identified distant metastases. The patient has chosen surgery and asks to preserve uninvolved thyroid tissue when an appropriate operation allows it.",
    "educationalIntent": "routine_resident_candidate",
    "intendedInference": "Apply the size/extent eligibility and patient goal to surgical extent; retain the necessary node/extension negatives.",
    "reviewerNotes": "Verify exact guideline eligibility and subtotal distractor. Total thyroidectomy can be defensible for other goals, so the explicit preference is decision-critical. Existing 2 cm value is retained, not invented.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.differentiated-thyroid-cancer.individualized-surgical-extent.v1.r2",
      "conceptId": "concept.differentiated-thyroid-cancer.individualized-surgical-extent",
      "stem": "Which initial operation best matches this patient's disease extent and stated preference for preserving uninvolved thyroid tissue?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Thyroid lobectomy",
          "isCorrect": true,
          "rationale": "Applies the confined unilateral tumor findings and tissue-preservation goal to an eligible initial operation.",
          "distractorRationale": null
        },
        {
          "id": "d1_1",
          "label": "Total thyroidectomy",
          "isCorrect": false,
          "rationale": "A cancer diagnosis can prompt a more extensive operation, but that is less aligned with this eligible patient's stated tissue-preservation goal.",
          "distractorRationale": "A cancer diagnosis can prompt a more extensive operation, but that is less aligned with this eligible patient's stated tissue-preservation goal."
        },
        {
          "id": "d2_1",
          "label": "Subtotal thyroidectomy",
          "isCorrect": false,
          "rationale": "Attempts a compromise on tissue preservation but is not the guideline's lobectomy-based initial approach for this profile.",
          "distractorRationale": "Attempts a compromise on tissue preservation but is not the guideline's lobectomy-based initial approach for this profile."
        }
      ],
      "explanation": "For this patient who has chosen surgery, the confined unilateral 2 cm disease and stated goal make lobectomy the best match among these operations. Extent remains an individualized discussion; the diagnosis alone does not require the same operation in every patient.",
      "teachingPoint": "For this patient who has chosen surgery, the confined unilateral 2 cm disease and stated goal make lobectomy the best match among these operations. Extent remains an individualized discussion; the diagnosis alone does not require the same operation in every patient.",
      "supportingEvidenceClaimIds": [
        "claim.dtc.extent",
        "claim.dtc.lobectomy-boundary"
      ]
    }
  },
  {
    "id": "revision.question-quality.20261028.A17",
    "auditId": "A17",
    "caseId": "case.adrenal-incidentaloma.renal-cancer-mass",
    "nodeId": "node.adrenal-incidentaloma.renal-cancer-mass.1",
    "previousQuestionVariantId": "question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v3",
    "questionVariantId": "question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v3.r2",
    "previousContentVersions": [
      "development-batch.2026-09-17.1"
    ],
    "previousStem": "Which test must precede {patientName}'s adrenal biopsy?",
    "previousChoiceLabels": [
      "Plasma-free metanephrines",
      "Overnight dexamethasone test",
      "Aldosterone-renin ratio",
      "CT-guided adrenal biopsy"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after treatment for renal cell carcinoma. Imaging shows a solitary adrenal mass measuring 28 HU. The oncology team is considering biopsy because tissue confirmation would change management.",
    "educationalIntent": "routine_resident_candidate",
    "intendedInference": "Distinguish the biopsy-specific endocrine safety problem from other legitimate adrenal studies.",
    "reviewerNotes": "Retains the original illustrative 28 HU and clinical meaning. Removing the normal cortisol result keeps a real endocrine distractor alive.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v3.r2",
      "conceptId": "concept.adrenal-incidentaloma.pheochromocytoma-before-biopsy",
      "stem": "Which biochemical study addresses the specific safety risk that must be assessed before biopsy of this adrenal mass?",
      "answerChoices": [
        {
          "id": "metanephrines_3",
          "label": "Plasma free metanephrines",
          "isCorrect": true,
          "rationale": "Recognizes the need to assess pheochromocytoma before a management-changing adrenal biopsy.",
          "distractorRationale": null
        },
        {
          "id": "dst_3",
          "label": "Overnight dexamethasone suppression",
          "isCorrect": false,
          "rationale": "Correctly recalls adrenal hormonal evaluation but substitutes cortisol assessment for the biopsy-specific catecholamine safety issue.",
          "distractorRationale": "Correctly recalls adrenal hormonal evaluation but substitutes cortisol assessment for the biopsy-specific catecholamine safety issue."
        },
        {
          "id": "aldosterone_3",
          "label": "Plasma aldosterone-renin ratio",
          "isCorrect": false,
          "rationale": "Confuses another adrenal endocrine workup pathway with the specific pre-biopsy safety assessment.",
          "distractorRationale": "Confuses another adrenal endocrine workup pathway with the specific pre-biopsy safety assessment."
        }
      ],
      "explanation": "Pheochromocytoma must be assessed before a biopsy of an indeterminate adrenal mass when tissue would change management. Plasma free metanephrines address that risk; urinary fractionated metanephrines are another accepted approach, but are not offered here. Cortisol or aldosterone evaluation answers different questions.",
      "teachingPoint": "Pheochromocytoma must be assessed before a biopsy of an indeterminate adrenal mass when tissue would change management. Plasma free metanephrines address that risk; urinary fractionated metanephrines are another accepted approach, but are not offered here. Cortisol or aldosterone evaluation answers different questions.",
      "supportingEvidenceClaimIds": [
        "claim.brief.adrenal-incidentaloma.pheochromocytoma-before-biopsy"
      ]
    },
    "previousPresentation": "{patientName} is a 58-year-old woman who has treated renal cell carcinoma and a solitary adrenal mass measuring 28 HU. Cortisol screening is normal, and tissue confirmation would change management.",
    "previousProfilePresentations": [
      {
        "id": "profile.adrenal-incidentaloma.renal-cancer-mass.female.58",
        "presentation": "{patientName} is a 58-year-old woman who has treated renal cell carcinoma and a solitary adrenal mass measuring 28 HU. Cortisol screening is normal, and tissue confirmation would change management."
      },
      {
        "id": "profile.adrenal-incidentaloma.renal-cancer-mass.male.58",
        "presentation": "{patientName} is a 58-year-old man who has treated renal cell carcinoma and a solitary adrenal mass measuring 28 HU. Cortisol screening is normal, and tissue confirmation would change management."
      },
      {
        "id": "profile.adrenal-incidentaloma.renal-cancer-mass.female.70",
        "presentation": "{patientName} is a 70-year-old woman who has treated renal cell carcinoma and a solitary adrenal mass measuring 28 HU. Cortisol screening is normal, and tissue confirmation would change management."
      },
      {
        "id": "profile.adrenal-incidentaloma.renal-cancer-mass.male.70",
        "presentation": "{patientName} is a 70-year-old man who has treated renal cell carcinoma and a solitary adrenal mass measuring 28 HU. Cortisol screening is normal, and tissue confirmation would change management."
      }
    ]
  },
  {
    "id": "revision.question-quality.20261028.A22",
    "auditId": "A22",
    "caseId": "case.gs028se.fisher-exact-study-design.a-tiny-pilot",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-tiny-pilot.1",
    "previousQuestionVariantId": "question.statistics-ethics.fisher-exact.v2",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.statistics-ethics.2"
    ],
    "previousStem": "Which analysis best compares two-year recurrence between the separate groups, using the sparse table and assumptions in the exhibit?",
    "previousChoiceLabels": [
      "Fisher exact test",
      "Chi-square test of independence",
      "Independent-samples t test",
      "Wilcoxon rank-sum test"
    ],
    "presentationTemplate": "{patientName}, the colorectal discussion lead, reviews a fictional pilot comparing recurrence after two approaches to rectal prolapse. Separate unmatched groups are assessed once at two years. The exhibit contains the observed patient counts; it does not report an efficacy conclusion.",
    "educationalIntent": "routine_resident_candidate",
    "intendedInference": "Derive the sparse expected-count issue and distinguish independent from paired binary data without a supplied reliability conclusion.",
    "reviewerNotes": "Employee discussion, not a patient encounter. Counts and two-year endpoint are retained fictional exercise data, not clinical thresholds or efficacy evidence.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.fisher-exact.v2.r2",
      "conceptId": "concept.statistics-ethics.fisher-exact",
      "stem": "Which test best compares recurrence between the two independent groups in the exhibit?",
      "answerChoices": [
        {
          "id": "correct_tiny-pilot",
          "label": "Fisher exact test",
          "isCorrect": true,
          "rationale": "Interprets the small observed categorical table and the inadequacy of the usual large-sample approximation.",
          "distractorRationale": null
        },
        {
          "id": "d1_tiny-pilot",
          "label": "Pearson chi-square test",
          "isCorrect": false,
          "rationale": "Recognizes independent categorical groups but overlooks the sparse expected-count problem.",
          "distractorRationale": "Recognizes independent categorical groups but overlooks the sparse expected-count problem."
        },
        {
          "id": "d2_tiny-pilot",
          "label": "McNemar paired-proportions test",
          "isCorrect": false,
          "rationale": "Recognizes a binary outcome but mistakes the two independent groups for paired observations.",
          "distractorRationale": "Recognizes a binary outcome but mistakes the two independent groups for paired observations."
        }
      ],
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
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.fisher-exact",
        "claim.gs028se.statistics.chi-square",
        "claim.gs028se.statistics.fisher-exact.mcnemar-boundary"
      ]
    },
    "previousPresentation": "{patientName}, the colorectal discussion lead, reviews a new fixation technique for rectal prolapse. A small pilot records recurrence within two years in separate groups. The supplier calls the pilot extensive; its sales delegation is larger than the study population. The report contains the observed two-by-two table and the expected-count assessment requested for the recurrence comparison.",
    "previousProfilePresentations": []
  },
  {
    "id": "revision.question-quality.20261028.A23",
    "auditId": "A23",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical.1",
    "previousQuestionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v4",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v4.r2",
    "previousContentVersions": [
      "development-batch.2026-09-29.statistics-ethics.2"
    ],
    "previousStem": "Which interpretation preserves the reported measure when an exposure odds ratio for rare ulcer recurrence is discussed as approximately similar to a risk ratio?",
    "previousChoiceLabels": [
      "Report the estimate as an odds ratio",
      "Report the estimate as a relative risk",
      "Report the estimate as a relative risk reduction",
      "Report the estimate as an absolute risk difference"
    ],
    "presentationTemplate": "{patientName}, the bariatric journal-club lead, reviews a fictional study of ulcer recurrence after gastric bypass. The report supplies a comparison expression in the exhibit. The task is to identify the scale actually calculated before discussing the result.",
    "educationalIntent": "foundational_quantitative_application",
    "intendedInference": "Identify the measure from its probability expression without its name appearing in the pre-answer text.",
    "reviewerNotes": "Keeps the naming/interpretation objective; does not introduce adjusted logistic-model interpretation. Removes the unrelated H. pylori treatment mapping from this revision only.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.risk-ratio-odds-ratio.v4.r2",
      "conceptId": "concept.statistics-ethics.risk-ratio-odds-ratio",
      "stem": "Which measure is calculated by the expression in this ulcer-recurrence report?",
      "answerChoices": [
        {
          "id": "correct_rare-not-identical",
          "label": "Odds ratio",
          "isCorrect": true,
          "rationale": "Recognizes the ratio of two odds, rather than a direct comparison of probabilities.",
          "distractorRationale": null
        },
        {
          "id": "d1_rare-not-identical",
          "label": "Risk ratio",
          "isCorrect": false,
          "rationale": "Treats division of odds as though it were division of the probabilities themselves.",
          "distractorRationale": "Treats division of odds as though it were division of the probabilities themselves."
        },
        {
          "id": "d3_rare-not-identical",
          "label": "Risk difference",
          "isCorrect": false,
          "rationale": "Confuses a relative comparison with subtraction of the two probabilities.",
          "distractorRationale": "Confuses a relative comparison with subtraction of the two probabilities."
        }
      ],
      "explanation": "Each p/(1-p) term is an odds. Dividing the two terms produces an odds ratio. A risk ratio divides the probabilities themselves, and a risk difference subtracts them. Similarity in selected settings does not make these measures interchangeable.",
      "teachingPoint": "Each p/(1-p) term is an odds. Dividing the two terms produces an odds ratio. A risk ratio divides the probabilities themselves, and a risk difference subtracts them. Similarity in selected settings does not make these measures interchangeable.",
      "exhibit": {
        "kind": "abstract",
        "title": "Fictional comparison expression",
        "body": "Let p_E denote recurrence probability in the exposed group and p_C recurrence probability in the comparator group. The reported expression is [p_E / (1 - p_E)] / [p_C / (1 - p_C)]. No numerical result or clinical efficacy claim is supplied."
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.risk-ratio-odds-ratio",
        "claim.qq20261028.statistics.odds-scale"
      ]
    },
    "previousPresentation": "{patientName}, the bariatric journal-club lead, reviews a new protective agent for marginal ulcer after gastric bypass. The observational report labels its estimate as an exposure odds ratio for rare ulcer recurrence. The editor requests a more exciting conclusion while retaining 'strictly factual.' Underlying group risks are unavailable, and the investigators discuss approximate similarity to a risk ratio.",
    "previousProfilePresentations": []
  },
  {
    "id": "revision.question-quality.20261028.A25",
    "auditId": "A25",
    "caseId": "case.gs028g.hiv-perioperative.paired-routine-elective",
    "nodeId": "node.gs028g.hiv-perioperative.paired-routine-elective.1",
    "previousQuestionVariantId": "question.gs028g.hiv-perioperative.art-continuity.v1",
    "questionVariantId": "question.gs028g.hiv-perioperative.art-continuity.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-10-07.level3.1"
    ],
    "previousStem": "Which ART plan is appropriate when the prescribed regimen can be continued perioperatively?",
    "previousChoiceLabels": [
      "Continue ART with the perioperative team",
      "Withhold ART during surgical recovery",
      "Use a single-drug ART formulary substitute",
      "Continue the unboosted ART components"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic before elective hernia repair at an outside surgical service. HIV is well controlled on a prescribed antiretroviral regimen. The patient can swallow, and the complete prescribed oral regimen is available for perioperative administration.",
    "educationalIntent": "routine_resident_candidate",
    "intendedInference": "Apply continuity guidance to administration feasibility without a stem that states the desired plan.",
    "reviewerNotes": "The second node still addresses interaction review; the first does not declare all perioperative combinations safe.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.hiv-perioperative.art-continuity.v1.r2",
      "conceptId": "concept.gs028g.hiv-perioperative.art-continuity",
      "stem": "Which perioperative antiretroviral medication plan is most appropriate for this elective operation?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Continue the complete prescribed regimen",
          "isCorrect": true,
          "rationale": "Recognizes feasible regimen continuity rather than repeating a stated permission to continue ART.",
          "distractorRationale": null
        },
        {
          "id": "d1_1",
          "label": "Withhold the complete prescribed regimen",
          "isCorrect": false,
          "rationale": "Overgeneralizes perioperative medication withholding to an effective regimen that can be administered.",
          "distractorRationale": "Overgeneralizes perioperative medication withholding to an effective regimen that can be administered."
        },
        {
          "id": "d3_1",
          "label": "Continue the regimen's unboosted components",
          "isCorrect": false,
          "rationale": "Attempts to avoid interaction concerns by removing part of a regimen without coordinated review.",
          "distractorRationale": "Attempts to avoid interaction concerns by removing part of a regimen without coordinated review."
        }
      ],
      "explanation": "Coordinate continuation of the complete prescribed antiretroviral regimen when it can be administered. Surgery itself does not justify interruption or uncoordinated removal of regimen components. If an interruption becomes unavoidable, involve the HIV clinician and perioperative team.",
      "teachingPoint": "Coordinate continuation of the complete prescribed antiretroviral regimen when it can be administered. Surgery itself does not justify interruption or uncoordinated removal of regimen components. If an interruption becomes unavoidable, involve the HIV clinician and perioperative team.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.hiv-perioperative.art-continuity",
        "claim.gs028g.hiv-perioperative.art-continuity.fact2",
        "claim.gs028g.hiv-perioperative.art-continuity.fact3",
        "claim.gs028g.hiv-perioperative.art-continuity.fact4"
      ]
    },
    "previousPresentation": "{patientName}, a 43-year-old woman, is planning an elective hernia repair at an outside surgical service. HIV is well controlled, and the anesthesia team confirms the prescribed ART can be taken around the procedure.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028g.hiv-perioperative.paired-routine-elective.female.43",
        "presentation": "{patientName}, a 43-year-old woman, is planning an elective hernia repair at an outside surgical service. HIV is well controlled, and the anesthesia team confirms the prescribed ART can be taken around the procedure."
      },
      {
        "id": "profile.gs028g.hiv-perioperative.paired-routine-elective.male.43",
        "presentation": "{patientName}, a 43-year-old man, is planning an elective hernia repair at an outside surgical service. HIV is well controlled, and the anesthesia team confirms the prescribed ART can be taken around the procedure."
      },
      {
        "id": "profile.gs028g.hiv-perioperative.paired-routine-elective.female.68",
        "presentation": "{patientName}, a 68-year-old woman, is planning an elective hernia repair at an outside surgical service. HIV is well controlled, and the anesthesia team confirms the prescribed ART can be taken around the procedure."
      },
      {
        "id": "profile.gs028g.hiv-perioperative.paired-routine-elective.male.68",
        "presentation": "{patientName}, a 68-year-old man, is planning an elective hernia repair at an outside surgical service. HIV is well controlled, and the anesthesia team confirms the prescribed ART can be taken around the procedure."
      }
    ]
  },
  {
    "id": "revision.question-quality.20261028.A25.context",
    "auditId": "A25-context",
    "caseId": "case.gs028g.hiv-perioperative.paired-routine-elective",
    "nodeId": "node.gs028g.hiv-perioperative.paired-routine-elective.2",
    "previousQuestionVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1",
    "questionVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-10-07.level3.1"
    ],
    "previousStem": "What is the appropriate response to proposed oral midazolam with ritonavir-boosted ART?",
    "previousChoiceLabels": [
      "Revise sedation for the ART interaction",
      "Retain the planned oral midazolam order",
      "Increase the proposed oral midazolam dose",
      "Withhold the ART regimen for oral sedation"
    ],
    "educationalIntent": "context_companion_unmodified_task",
    "intendedInference": "Existing follow-up/task retained; shared presentation revised by A25.",
    "reviewerNotes": "Version advanced for changed pre-answer context; same concept, task, options, evidence mappings and results. Review the full case sequence.",
    "contextCompanion": true,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r2",
      "conceptId": "concept.gs028g.hiv-perioperative.booster-midazolam-interaction",
      "stem": "What is the appropriate response to proposed oral midazolam with ritonavir-boosted ART?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Revise sedation for the ART interaction",
          "isCorrect": true,
          "distractorRationale": null
        },
        {
          "id": "d1_1",
          "label": "Retain the planned oral midazolam order",
          "isCorrect": false,
          "distractorRationale": "The oral combination has a route-specific contraindication."
        },
        {
          "id": "d2_1",
          "label": "Increase the proposed oral midazolam dose",
          "isCorrect": false,
          "distractorRationale": "Increased exposure from metabolic inhibition does not support a dose increase."
        },
        {
          "id": "d3_1",
          "label": "Withhold the ART regimen for oral sedation",
          "isCorrect": false,
          "distractorRationale": "A coordinated alternative sedation plan is preferable to sacrificing feasible effective ART."
        }
      ],
      "explanation": "The correct answer is “Revise sedation for the ART interaction.” Boosted therapy can increase midazolam exposure; this oral combination requires an alternative plan. The oral combination has a route-specific contraindication. Increased exposure from metabolic inhibition does not support a dose increase. A coordinated alternative sedation plan is preferable to sacrificing feasible effective ART.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.hiv-perioperative.booster-midazolam-interaction",
        "claim.gs028g.hiv-perioperative.booster-midazolam-interaction.fact2",
        "claim.gs028g.hiv-perioperative.booster-midazolam-interaction.fact3"
      ]
    }
  },
  {
    "id": "revision.question-quality.20261028.A27",
    "auditId": "A27",
    "caseId": "case.gs028g.laparoscopy-respiratory.paired-ventilation-load",
    "nodeId": "node.gs028g.laparoscopy-respiratory.paired-ventilation-load.1",
    "previousQuestionVariantId": "question.gs028g.laparoscopy-respiratory.co2-absorption.v2",
    "questionVariantId": "question.gs028g.laparoscopy-respiratory.co2-absorption.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-10-07.level3.1"
    ],
    "previousStem": "What physiologic process adds a CO2 load during laparoscopic insufflation?",
    "previousChoiceLabels": [
      "Absorption of CO2 from the insufflated cavity",
      "Circuit rebreathing of exhaled CO2",
      "Increased metabolic CO2 from hyperthermia",
      "Reduced alveolar ventilation from tube obstruction"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after a completed laparoscopic procedure. The anesthetic record shows that end-tidal CO2 rose gradually after abdominal insufflation while delivered minute ventilation stayed steady. The inspiratory CO2 tracing returned to zero on each breath, and body temperature stayed steady.",
    "educationalIntent": "routine_resident_candidate",
    "intendedInference": "Interpret recorded observations instead of accepting labels that the circuit, airway and metabolic course are normal.",
    "reviewerNotes": "Requires clinician review of the raw capnography observation and its competing interpretation. One ventilation review supports absorption; a separate capnography source supports the tracing interpretation.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.laparoscopy-respiratory.co2-absorption.v2.r2",
      "conceptId": "concept.gs028g.laparoscopy-respiratory.co2-absorption",
      "stem": "Which mechanism best explains the additional CO2 load during this documented insufflation period?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Absorption from the insufflated cavity",
          "isCorrect": true,
          "rationale": "Connects insufflation with a new systemic CO2 load requiring ventilatory clearance.",
          "distractorRationale": null
        },
        {
          "id": "d1_2",
          "label": "Rebreathing from the anesthetic circuit",
          "isCorrect": false,
          "rationale": "Interprets elevated expired CO2 as inspired-gas contamination despite the supplied inspiratory tracing.",
          "distractorRationale": "Interprets elevated expired CO2 as inspired-gas contamination despite the supplied inspiratory tracing."
        },
        {
          "id": "d2_2",
          "label": "Production from increased metabolic activity",
          "isCorrect": false,
          "rationale": "Attributes the change to endogenous production rather than the insufflated gas and temporal pattern.",
          "distractorRationale": "Attributes the change to endogenous production rather than the insufflated gas and temporal pattern."
        }
      ],
      "explanation": "CO2 from the insufflated cavity can be absorbed and add to the systemic load requiring ventilation. The temporal pattern and recorded observations favor that mechanism here. An unexpected or acute perioperative deterioration still requires assessment rather than automatic attribution to insufflation.",
      "teachingPoint": "CO2 from the insufflated cavity can be absorbed and add to the systemic load requiring ventilation. The temporal pattern and recorded observations favor that mechanism here. An unexpected or acute perioperative deterioration still requires assessment rather than automatic attribution to insufflation.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.laparoscopy-respiratory.co2-absorption",
        "claim.gs028g.laparoscopy-respiratory.co2-absorption.fact2",
        "claim.gs028g.laparoscopy-respiratory.co2-absorption.fact3",
        "claim.qq20261028.capnography.rebreathing-baseline"
      ]
    },
    "previousPresentation": "{patientName}, a 43-year-old woman, asks about an outside anesthetic explanation that ventilation requirements can rise after abdominal CO2 insufflation even when the breathing circuit is functioning normally. The explanation concerns an otherwise evaluated uncomplicated course without hyperthermia or airway obstruction.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028g.laparoscopy-respiratory.paired-ventilation-load.female.43",
        "presentation": "{patientName}, a 43-year-old woman, asks about an outside anesthetic explanation that ventilation requirements can rise after abdominal CO2 insufflation even when the breathing circuit is functioning normally. The explanation concerns an otherwise evaluated uncomplicated course without hyperthermia or airway obstruction."
      },
      {
        "id": "profile.gs028g.laparoscopy-respiratory.paired-ventilation-load.male.43",
        "presentation": "{patientName}, a 43-year-old man, asks about an outside anesthetic explanation that ventilation requirements can rise after abdominal CO2 insufflation even when the breathing circuit is functioning normally. The explanation concerns an otherwise evaluated uncomplicated course without hyperthermia or airway obstruction."
      },
      {
        "id": "profile.gs028g.laparoscopy-respiratory.paired-ventilation-load.female.68",
        "presentation": "{patientName}, a 68-year-old woman, asks about an outside anesthetic explanation that ventilation requirements can rise after abdominal CO2 insufflation even when the breathing circuit is functioning normally. The explanation concerns an otherwise evaluated uncomplicated course without hyperthermia or airway obstruction."
      },
      {
        "id": "profile.gs028g.laparoscopy-respiratory.paired-ventilation-load.male.68",
        "presentation": "{patientName}, a 68-year-old man, asks about an outside anesthetic explanation that ventilation requirements can rise after abdominal CO2 insufflation even when the breathing circuit is functioning normally. The explanation concerns an otherwise evaluated uncomplicated course without hyperthermia or airway obstruction."
      }
    ]
  },
  {
    "id": "revision.question-quality.20261028.A27.context",
    "auditId": "A27-context",
    "caseId": "case.gs028g.laparoscopy-respiratory.paired-ventilation-load",
    "nodeId": "node.gs028g.laparoscopy-respiratory.paired-ventilation-load.2",
    "previousQuestionVariantId": "question.gs028g.laparoscopy-respiratory.diaphragm-compliance.v2",
    "questionVariantId": "question.gs028g.laparoscopy-respiratory.diaphragm-compliance.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-10-07.level3.1"
    ],
    "previousStem": "Which combined mechanical effect explains increased respiratory restriction in this evaluated course?",
    "previousChoiceLabels": [
      "Cephalad abdominal displacement limiting expansion",
      "Caudal abdominal displacement enlarging resting lung volume",
      "Greater compliance from unrestricted diaphragm descent",
      "Increased resting lung volume from an empty abdomen"
    ],
    "educationalIntent": "context_companion_unmodified_task",
    "intendedInference": "Existing follow-up/task retained; shared presentation revised by A27.",
    "reviewerNotes": "Version advanced for changed pre-answer context; same concept, task, options, evidence mappings and results. Review the full case sequence.",
    "contextCompanion": true,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.laparoscopy-respiratory.diaphragm-compliance.v2.r2",
      "conceptId": "concept.gs028g.laparoscopy-respiratory.diaphragm-compliance",
      "stem": "Which combined mechanical effect explains increased respiratory restriction in this evaluated course?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Cephalad abdominal displacement limiting expansion",
          "isCorrect": true,
          "distractorRationale": null
        },
        {
          "id": "d1_2",
          "label": "Caudal abdominal displacement enlarging resting lung volume",
          "isCorrect": false,
          "distractorRationale": "That does not match head-down insufflation physiology."
        },
        {
          "id": "d2_2",
          "label": "Greater compliance from unrestricted diaphragm descent",
          "isCorrect": false,
          "distractorRationale": "The situation restricts rather than frees expansion."
        },
        {
          "id": "d3_2",
          "label": "Increased resting lung volume from an empty abdomen",
          "isCorrect": false,
          "distractorRationale": "The abdomen is insufflated rather than decompressed."
        }
      ],
      "explanation": "The correct answer is “Cephalad abdominal displacement limiting expansion.” Position and insufflation can accentuate diaphragm-related restriction. That does not match head-down insufflation physiology. The situation restricts rather than frees expansion. The abdomen is insufflated rather than decompressed.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance",
        "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance.fact2",
        "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance.fact3",
        "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance.fact4"
      ]
    }
  },
  {
    "id": "revision.question-quality.20261028.A28",
    "auditId": "A28",
    "caseId": "case.gs028g.merkel-cell.paired-skin-panel",
    "nodeId": "node.gs028g.merkel-cell.paired-skin-panel.1",
    "previousQuestionVariantId": "question.gs028g.merkel-cell.integrated-diagnosis.v1",
    "questionVariantId": "question.gs028g.merkel-cell.integrated-diagnosis.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-10-07.level3.1"
    ],
    "previousStem": "Which diagnosis best fits this integrated primary cutaneous neuroendocrine pathology assessment?",
    "previousChoiceLabels": [
      "Merkel cell carcinoma",
      "Cutaneous squamous cell carcinoma",
      "Primary cutaneous malignant melanoma",
      "Primary cutaneous lymphoid lymphoma"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with pathology from a growing forearm skin nodule. The biopsy shows small malignant cells in the dermis. The panel records CK20 with paranuclear dot-like staining, synaptophysin positivity and TTF1 negativity.",
    "educationalIntent": "routine_resident_candidate",
    "intendedInference": "Integrate raw morphology and immunostains rather than repeat an integrated primary-cutaneous-neuroendocrine label or an exclusion list.",
    "reviewerNotes": "New panel claims use Harms et al. and ESMO sources, not NCI PDQ alone. Confirm panel sufficiency and close differential; no prevalence inference from the editorial patient age.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.merkel-cell.integrated-diagnosis.v1.r2",
      "conceptId": "concept.gs028g.merkel-cell.integrated-diagnosis",
      "stem": "Which diagnosis is best supported by the skin-biopsy morphology and combined staining pattern?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Merkel cell carcinoma",
          "isCorrect": true,
          "rationale": "Integrates skin location, morphology and the panel; no single stain alone establishes the diagnosis.",
          "distractorRationale": null
        },
        {
          "id": "d1_1",
          "label": "Metastatic pulmonary small-cell carcinoma",
          "isCorrect": false,
          "rationale": "Shares small-cell neuroendocrine morphology, making the pattern across CK20 and TTF1 important rather than the word small-cell alone.",
          "distractorRationale": "Shares small-cell neuroendocrine morphology, making the pattern across CK20 and TTF1 important rather than the word small-cell alone."
        },
        {
          "id": "d2_1",
          "label": "Primary cutaneous malignant melanoma",
          "isCorrect": false,
          "rationale": "A malignant skin nodule remains plausible initially, but the combined epithelial/neuroendocrine staining favors another lineage.",
          "distractorRationale": "A malignant skin nodule remains plausible initially, but the combined epithelial/neuroendocrine staining favors another lineage."
        },
        {
          "id": "d3_1",
          "label": "Primary cutaneous malignant lymphoma",
          "isCorrect": false,
          "rationale": "Small dermal malignant cells can suggest a lymphoid process before the integrated immunophenotype is considered.",
          "distractorRationale": "Small dermal malignant cells can suggest a lymphoid process before the integrated immunophenotype is considered."
        }
      ],
      "explanation": "The morphology and combined CK20, synaptophysin and TTF1 pattern favor Merkel cell carcinoma among these options. Staining patterns have exceptions; no single marker definitively excludes pulmonary small-cell carcinoma or establishes Merkel cell carcinoma. Integrate the panel with the clinical and pathologic assessment.",
      "teachingPoint": "The morphology and combined CK20, synaptophysin and TTF1 pattern favor Merkel cell carcinoma among these options. Staining patterns have exceptions; no single marker definitively excludes pulmonary small-cell carcinoma or establishes Merkel cell carcinoma. Integrate the panel with the clinical and pathologic assessment.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.merkel-cell.integrated-diagnosis",
        "claim.qq20261028.merkel.panel-pattern",
        "claim.qq20261028.merkel.panel-exceptions"
      ]
    },
    "previousPresentation": "{patientName}, a 43-year-old woman, brings completed pathology from a growing forearm skin nodule. It shows a dermal small-cell malignancy with epithelial and neuroendocrine differentiation and cytokeratin-20 expression; the integrated workup excludes melanoma, lymphoma and a metastatic pulmonary primary.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028g.merkel-cell.paired-skin-panel.female.43",
        "presentation": "{patientName}, a 43-year-old woman, brings completed pathology from a growing forearm skin nodule. It shows a dermal small-cell malignancy with epithelial and neuroendocrine differentiation and cytokeratin-20 expression; the integrated workup excludes melanoma, lymphoma and a metastatic pulmonary primary."
      },
      {
        "id": "profile.gs028g.merkel-cell.paired-skin-panel.male.43",
        "presentation": "{patientName}, a 43-year-old man, brings completed pathology from a growing forearm skin nodule. It shows a dermal small-cell malignancy with epithelial and neuroendocrine differentiation and cytokeratin-20 expression; the integrated workup excludes melanoma, lymphoma and a metastatic pulmonary primary."
      },
      {
        "id": "profile.gs028g.merkel-cell.paired-skin-panel.female.68",
        "presentation": "{patientName}, a 68-year-old woman, brings completed pathology from a growing forearm skin nodule. It shows a dermal small-cell malignancy with epithelial and neuroendocrine differentiation and cytokeratin-20 expression; the integrated workup excludes melanoma, lymphoma and a metastatic pulmonary primary."
      },
      {
        "id": "profile.gs028g.merkel-cell.paired-skin-panel.male.68",
        "presentation": "{patientName}, a 68-year-old man, brings completed pathology from a growing forearm skin nodule. It shows a dermal small-cell malignancy with epithelial and neuroendocrine differentiation and cytokeratin-20 expression; the integrated workup excludes melanoma, lymphoma and a metastatic pulmonary primary."
      }
    ]
  },
  {
    "id": "revision.question-quality.20261028.A28.context",
    "auditId": "A28-context",
    "caseId": "case.gs028g.merkel-cell.paired-skin-panel",
    "nodeId": "node.gs028g.merkel-cell.paired-skin-panel.2",
    "previousQuestionVariantId": "question.gs028g.merkel-cell.clinically-negative-node-staging.v1",
    "questionVariantId": "question.gs028g.merkel-cell.clinically-negative-node-staging.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-10-07.level3.1"
    ],
    "previousStem": "Which regional staging plan is appropriate for this clinically node-negative Merkel cell carcinoma candidate?",
    "previousChoiceLabels": [
      "Specialist sentinel lymph node staging",
      "Use clinical node examination as final staging",
      "Proceed directly to local excision alone",
      "Refer for complete regional-node dissection"
    ],
    "educationalIntent": "context_companion_unmodified_task",
    "intendedInference": "Existing follow-up/task retained; shared presentation revised by A28.",
    "reviewerNotes": "Version advanced for changed pre-answer context; same concept, task, options, evidence mappings and results. Review the full case sequence.",
    "contextCompanion": true,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.merkel-cell.clinically-negative-node-staging.v1.r2",
      "conceptId": "concept.gs028g.merkel-cell.clinically-negative-node-staging",
      "stem": "Which regional staging plan is appropriate for this clinically node-negative Merkel cell carcinoma candidate?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Specialist sentinel lymph node staging",
          "isCorrect": true,
          "distractorRationale": null
        },
        {
          "id": "d1_1",
          "label": "Use clinical node examination as final staging",
          "isCorrect": false,
          "distractorRationale": "Normal examination does not establish pathologic node negativity."
        },
        {
          "id": "d2_1",
          "label": "Proceed directly to local excision alone",
          "isCorrect": false,
          "distractorRationale": "The clinically negative candidate still needs consideration of occult regional disease."
        },
        {
          "id": "d3_1",
          "label": "Refer for complete regional-node dissection",
          "isCorrect": false,
          "distractorRationale": "Sentinel staging assesses occult disease without automatically committing to full basin dissection."
        }
      ],
      "explanation": "The correct answer is “Specialist sentinel lymph node staging.” Sentinel-node assessment addresses occult regional disease that examination cannot exclude. Normal examination does not establish pathologic node negativity. The clinically negative candidate still needs consideration of occult regional disease. Sentinel staging assesses occult disease without automatically committing to full basin dissection.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.merkel-cell.clinically-negative-node-staging",
        "claim.gs028g.merkel-cell.clinically-negative-node-staging.fact2",
        "claim.gs028g.merkel-cell.clinically-negative-node-staging.fact3"
      ]
    }
  },
  {
    "id": "revision.question-quality.20261028.A30",
    "auditId": "A30",
    "caseId": "case.gs028g.peristomal-skin.paired-wide-opening",
    "nodeId": "node.gs028g.peristomal-skin.paired-wide-opening.2",
    "previousQuestionVariantId": "question.gs028g.peristomal-skin.restore-seal.v1",
    "questionVariantId": "question.gs028g.peristomal-skin.restore-seal.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-10-07.level3.1"
    ],
    "previousStem": "What is the best initial care plan for noninfectious dermatitis caused by this oversized pouch opening?",
    "previousChoiceLabels": [
      "Refit the seal with ostomy-nurse guidance",
      "Start systemic antibiotic treatment",
      "Start topical antifungal treatment",
      "Enlarge the cutout around the irritated skin"
    ],
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with burning around an ileostomy. Moist erosions form a ring around the stoma where effluent has contacted the skin. Skin farther out under the adhesive is intact. The stoma is viable, and the patient is well.",
    "currentUpdate": "With the pouch removed, the nurse sees that the cutout extends beyond the stoma base and leaves the eroded ring exposed to effluent.",
    "educationalIntent": "routine_resident_candidate",
    "intendedInference": "Infer the mechanism from the distribution and fit observations, then choose the corrective appliance change.",
    "reviewerNotes": "Prior diagnostic feedback is legitimate visible history and may scaffold this management item. Retain a realistic single best first appliance change; do not claim all coexisting infection is excluded.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.peristomal-skin.restore-seal.v1.r2",
      "conceptId": "concept.gs028g.peristomal-skin.restore-seal",
      "stem": "Which initial appliance-care change best addresses the ongoing skin injury around this ileostomy?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Resize the opening to the stoma",
          "isCorrect": true,
          "rationale": "Targets continued effluent contact at the observed fit problem with ostomy-nurse guidance.",
          "distractorRationale": null
        },
        {
          "id": "d1_1",
          "label": "Switch the adhesive to another product",
          "isCorrect": false,
          "rationale": "Treats the injury as adhesive intolerance despite the intact more peripheral adhesive-contact skin and exposed-ring pattern.",
          "distractorRationale": "Treats the injury as adhesive intolerance despite the intact more peripheral adhesive-contact skin and exposed-ring pattern."
        },
        {
          "id": "d2_1",
          "label": "Apply antifungal powder under the pouch",
          "isCorrect": false,
          "rationale": "Treats a competing cause of peristomal rash without correcting the demonstrated exposure pathway.",
          "distractorRationale": "Treats a competing cause of peristomal rash without correcting the demonstrated exposure pathway."
        },
        {
          "id": "d3_1",
          "label": "Increase the frequency of pouch changes",
          "isCorrect": false,
          "rationale": "Responds to wetness but leaves the opening-to-stoma mismatch in place.",
          "distractorRationale": "Responds to wetness but leaves the opening-to-stoma mismatch in place."
        }
      ],
      "explanation": "Resize the opening and restore a compatible seal with ostomy-nurse guidance to limit continuing effluent contact. Clean, dry and protect the affected skin as appropriate. Product substitution, empiric antifungal treatment or more frequent changes does not by itself correct the demonstrated fit problem.",
      "teachingPoint": "Resize the opening and restore a compatible seal with ostomy-nurse guidance to limit continuing effluent contact. Clean, dry and protect the affected skin as appropriate. Product substitution, empiric antifungal treatment or more frequent changes does not by itself correct the demonstrated fit problem.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.peristomal-skin.restore-seal",
        "claim.gs028g.peristomal-skin.restore-seal.fact2",
        "claim.gs028g.peristomal-skin.restore-seal.fact3",
        "claim.gs028g.peristomal-skin.restore-seal.fact4",
        "claim.qq20261028.peristomal.fit-exposure"
      ]
    },
    "previousPresentation": "{patientName}, a 43-year-old woman, has an ileostomy with moist, burning erosions exactly where effluent reaches exposed skin through an oversized appliance opening. The stoma is viable, and there is no spreading redness or purulence.",
    "previousProfilePresentations": [
      {
        "id": "profile.gs028g.peristomal-skin.paired-wide-opening.female.43",
        "presentation": "{patientName}, a 43-year-old woman, has an ileostomy with moist, burning erosions exactly where effluent reaches exposed skin through an oversized appliance opening. The stoma is viable, and there is no spreading redness or purulence."
      },
      {
        "id": "profile.gs028g.peristomal-skin.paired-wide-opening.male.43",
        "presentation": "{patientName}, a 43-year-old man, has an ileostomy with moist, burning erosions exactly where effluent reaches exposed skin through an oversized appliance opening. The stoma is viable, and there is no spreading redness or purulence."
      },
      {
        "id": "profile.gs028g.peristomal-skin.paired-wide-opening.female.68",
        "presentation": "{patientName}, a 68-year-old woman, has an ileostomy with moist, burning erosions exactly where effluent reaches exposed skin through an oversized appliance opening. The stoma is viable, and there is no spreading redness or purulence."
      },
      {
        "id": "profile.gs028g.peristomal-skin.paired-wide-opening.male.68",
        "presentation": "{patientName}, a 68-year-old man, has an ileostomy with moist, burning erosions exactly where effluent reaches exposed skin through an oversized appliance opening. The stoma is viable, and there is no spreading redness or purulence."
      }
    ]
  },
  {
    "id": "revision.question-quality.20261028.A30.context",
    "auditId": "A30-context",
    "caseId": "case.gs028g.peristomal-skin.paired-wide-opening",
    "nodeId": "node.gs028g.peristomal-skin.paired-wide-opening.1",
    "previousQuestionVariantId": "question.gs028g.peristomal-skin.effluent-irritation.v1",
    "questionVariantId": "question.gs028g.peristomal-skin.effluent-irritation.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-10-07.level3.1"
    ],
    "previousStem": "Which diagnosis best explains erosions confined to the effluent-exposed peristomal skin?",
    "previousChoiceLabels": [
      "Irritant contact dermatitis",
      "Peristomal bacterial cellulitis",
      "Peristomal candidal dermatitis",
      "Ulcerative peristomal pyoderma gangrenosum"
    ],
    "educationalIntent": "context_companion_unmodified_task",
    "intendedInference": "Existing follow-up/task retained; shared presentation revised by A30.",
    "reviewerNotes": "Version advanced for changed pre-answer context; same concept, task, options, evidence mappings and results. Review the full case sequence.",
    "contextCompanion": true,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.peristomal-skin.effluent-irritation.v1.r2",
      "conceptId": "concept.gs028g.peristomal-skin.effluent-irritation",
      "stem": "Which diagnosis best explains erosions confined to the effluent-exposed peristomal skin?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Irritant contact dermatitis",
          "isCorrect": true,
          "distractorRationale": null
        },
        {
          "id": "d1_1",
          "label": "Peristomal bacterial cellulitis",
          "isCorrect": false,
          "distractorRationale": "Spreading erythema and other infection findings are absent in this story."
        },
        {
          "id": "d2_1",
          "label": "Peristomal candidal dermatitis",
          "isCorrect": false,
          "distractorRationale": "No fungal-pattern findings are described; leakage explains this injury."
        },
        {
          "id": "d3_1",
          "label": "Ulcerative peristomal pyoderma gangrenosum",
          "isCorrect": false,
          "distractorRationale": "A deep, progressive undermined ulcer is not described."
        }
      ],
      "explanation": "The correct answer is “Irritant contact dermatitis.” The leakage distribution and wet erosions support an effluent-related irritant process. Spreading erythema and other infection findings are absent in this story. No fungal-pattern findings are described; leakage explains this injury. A deep, progressive undermined ulcer is not described.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.peristomal-skin.effluent-irritation",
        "claim.gs028g.peristomal-skin.effluent-irritation.fact2",
        "claim.gs028g.peristomal-skin.effluent-irritation.fact3"
      ]
    }
  },
  {
    "id": "revision.question-quality.20261028.A38",
    "auditId": "A38",
    "caseId": "case.pediatric-clinic.shrinking-mobile-neck-nodes",
    "nodeId": "node.pediatric-clinic.shrinking-mobile-neck-nodes.1",
    "previousQuestionVariantId": "question.pediatric-clinic.shrinking-mobile-neck-nodes.v2",
    "questionVariantId": "question.pediatric-clinic.shrinking-mobile-neck-nodes.v2.r2",
    "previousContentVersions": [
      "development-batch.2026-10-08.pediatric-clinic.1"
    ],
    "previousStem": "What is the most appropriate clinic plan for Ethan Brooks's improving cervical-node findings?",
    "previousChoiceLabels": [
      "Continue observation with a reassessment plan",
      "Arrange urgent pediatric oncology assessment",
      "Arrange routine pediatric ENT assessment",
      "End follow-up without reassessment instructions"
    ],
    "presentationTemplate": "Ethan Brooks, a {ageYears}-year-old boy, visits the clinic with his father, Paul Brooks, who remains in the same room throughout the visit. His father feels small neck nodes after a respiratory illness; they have become less noticeable. Ethan is active and feels well. The nodes are mobile and confined to the cervical region. He has no unexplained fever or weight loss.",
    "educationalIntent": "foundational_clinical_application",
    "intendedInference": "Weight trajectory and overall condition while preserving decision-critical safety information instead of a long checklist excluding every concern.",
    "reviewerNotes": "One local pediatric referral guide; verify safety-critical negatives and that prompt oncology remains a credible competing error rather than filler. No follow-up interval or size cutoff invented.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pediatric-clinic.shrinking-mobile-neck-nodes.v2.r2",
      "conceptId": "concept.pediatric-clinic.reactive-neck-node-observation",
      "stem": "Which initial clinic plan best fits Ethan Brooks's cervical-node course and current condition?",
      "answerChoices": [
        {
          "id": "choice.shrinking-mobile-neck-nodes.observe",
          "label": "Observe with return advice and reassessment",
          "isCorrect": true,
          "rationale": "Uses the improving post-illness course in a well child while retaining a safety net.",
          "distractorRationale": null
        },
        {
          "id": "choice.shrinking-mobile-neck-nodes.routine-ent",
          "label": "Arrange routine pediatric ENT clinic assessment",
          "isCorrect": false,
          "rationale": "Overweights persistence of palpable nodes while underweighting their improving course and the child's condition.",
          "distractorRationale": "Overweights persistence of palpable nodes while underweighting their improving course and the child's condition."
        },
        {
          "id": "choice.shrinking-mobile-neck-nodes.urgent-referral",
          "label": "Arrange prompt pediatric oncology clinic assessment",
          "isCorrect": false,
          "rationale": "Treats palpable cervical nodes as a malignancy pathway despite the low-concern course provided.",
          "distractorRationale": "Treats palpable cervical nodes as a malignancy pathway despite the low-concern course provided."
        }
      ],
      "explanation": "An improving course of small mobile cervical nodes in a well child supports initial observation with reassessment and return advice. Enlargement, new systemic symptoms or other concerning changes should prompt reassessment. Retain safety-netting rather than treating observation as dismissal.",
      "teachingPoint": "An improving course of small mobile cervical nodes in a well child supports initial observation with reassessment and return advice. Enlargement, new systemic symptoms or other concerning changes should prompt reassessment. Retain safety-netting rather than treating observation as dismissal.",
      "supportingEvidenceClaimIds": [
        "claim.pediatric-clinic.reactive-child-neck-nodes",
        "claim.pediatric-clinic.well-child-node-observation",
        "claim.pediatric-clinic.node-change-safety-net",
        "claim.pediatric-clinic.supraclavicular-node-red-flag",
        "claim.pediatric-clinic.unexplained-node-associated-fever",
        "claim.pediatric-clinic.unexplained-node-associated-weight-loss",
        "claim.pediatric-clinic.unexplained-node-associated-night-sweats",
        "claim.pediatric-clinic.concerning-node-pediatric-review"
      ]
    },
    "previousPresentation": "Ethan Brooks, a 12-year-old boy, visits the clinic with his father, Paul Brooks, who remains in the same room throughout the visit. Ethan's father can still feel small neck nodes after Ethan recovered from a respiratory illness. The nodes have become less noticeable. Ethan feels well, and the nodes are mobile without skin change or supraclavicular enlargement. There is no node growth, unexplained fever, weight loss or night sweating.",
    "previousProfilePresentations": [
      {
        "id": "profile.pediatric-clinic.shrinking-mobile-neck-nodes.boy12",
        "presentation": "Ethan Brooks, a 12-year-old boy, visits the clinic with his father, Paul Brooks, who remains in the same room throughout the visit. Ethan's father can still feel small neck nodes after Ethan recovered from a respiratory illness. The nodes have become less noticeable. Ethan feels well, and the nodes are mobile without skin change or supraclavicular enlargement. There is no node growth, unexplained fever, weight loss or night sweating."
      }
    ]
  },
  {
    "id": "revision.question-quality.20261028.A40",
    "auditId": "A40",
    "caseId": "case.pediatric-clinic.upper-midline-lump",
    "nodeId": "node.pediatric-clinic.upper-midline-lump.1",
    "previousQuestionVariantId": "question.pediatric-clinic.upper-midline-lump.v1",
    "questionVariantId": "question.pediatric-clinic.upper-midline-lump.v1.r2",
    "previousContentVersions": [
      "development-batch.2026-10-08.pediatric-clinic.1"
    ],
    "previousStem": "Which diagnosis best explains Ella Morgan's focal upper-midline abdominal-wall defect?",
    "previousChoiceLabels": [
      "Epigastric hernia",
      "Umbilical hernia",
      "Inguinal canal hernia",
      "Femoral canal hernia"
    ],
    "presentationTemplate": "Ella Morgan, a {ageYears}-year-old girl, visits the clinic with her mother, Rachel Morgan, who remains in the same room throughout the visit. Her mother points out a small focal lump in Ella's upper abdominal midline. Examination identifies a small abdominal-wall gap with protruding fat at that site, above the navel. Ella is comfortable.",
    "educationalIntent": "foundational_anatomical_recognition",
    "intendedInference": "Use the necessary positive anatomical finding without explicit navel/groin exclusions.",
    "reviewerNotes": "Still a basic recognition item; do not remove its deciding anatomical finding to force difficulty. No new diagnosis or concept meaning.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pediatric-clinic.upper-midline-lump.v1.r2",
      "conceptId": "concept.umbilical-epigastric-hernia.clinical-recognition",
      "stem": "Which hernia diagnosis best explains Ella Morgan's focal upper-midline abdominal-wall finding?",
      "answerChoices": [
        {
          "id": "choice.upper-midline-lump.epigastric",
          "label": "Epigastric hernia",
          "isCorrect": true,
          "rationale": "Uses the location and focal fat-containing wall defect rather than absence of bulges elsewhere.",
          "distractorRationale": null
        },
        {
          "id": "choice.upper-midline-lump.umbilical",
          "label": "Umbilical hernia",
          "isCorrect": false,
          "rationale": "Confuses a nearby midline location with the navel itself.",
          "distractorRationale": "Confuses a nearby midline location with the navel itself."
        },
        {
          "id": "choice.upper-midline-lump.inguinal",
          "label": "Inguinal canal hernia",
          "isCorrect": false,
          "rationale": "Overgeneralizes a common pediatric hernia category without using the examination site.",
          "distractorRationale": "Overgeneralizes a common pediatric hernia category without using the examination site."
        }
      ],
      "explanation": "A focal fat-containing abdominal-wall defect in the upper midline above the navel supports epigastric hernia. Umbilical and inguinal hernias are defined by different anatomical sites. The positive finding distinguishes the offered diagnoses without listing absent bulges at each competing site.",
      "teachingPoint": "A focal fat-containing abdominal-wall defect in the upper midline above the navel supports epigastric hernia. Umbilical and inguinal hernias are defined by different anatomical sites. The positive finding distinguishes the offered diagnoses without listing absent bulges at each competing site.",
      "supportingEvidenceClaimIds": [
        "claim.pediatric-clinic.epigastric-fat-defect",
        "claim.pediatric-clinic.umbilical-location",
        "claim.pediatric-clinic.inguinal-location",
        "claim.pediatric-clinic.femoral-location"
      ]
    },
    "previousPresentation": "Ella Morgan, a 6-year-old girl, visits the clinic with her mother, Rachel Morgan, who remains in the same room throughout the visit. Her mother points out a small focal lump in Ella's upper abdominal midline, above the navel. Examination identifies a small abdominal-wall gap with protruding fat at that site. The navel and groins have no bulge. Ella is comfortable and has no vomiting.",
    "previousProfilePresentations": [
      {
        "id": "profile.pediatric-clinic.upper-midline-lump.girl6",
        "presentation": "Ella Morgan, a 6-year-old girl, visits the clinic with her mother, Rachel Morgan, who remains in the same room throughout the visit. Her mother points out a small focal lump in Ella's upper abdominal midline, above the navel. Examination identifies a small abdominal-wall gap with protruding fat at that site. The navel and groins have no bulge. Ella is comfortable and has no vomiting."
      }
    ]
  }
];
