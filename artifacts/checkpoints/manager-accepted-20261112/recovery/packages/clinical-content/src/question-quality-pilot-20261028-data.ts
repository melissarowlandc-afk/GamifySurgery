import type { QuestionQualityRevision } from "./question-quality-pilot-20261028";

/** LOCAL DRAFTS ONLY; key shown first for review only. Runtime choices randomize. */
export const QUESTION_QUALITY_DEFINITIONS: QuestionQualityRevision[] = [
  {
    "id": "revision.question-quality.20261028.A02.review2.owner-round2.owner-round3",
    "auditId": "A02",
    "caseId": "case.gs028c.acute-cholecystitis.a-stones-without-secondary-signs",
    "nodeId": "node.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.1",
    "previousQuestionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v2",
    "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r5",
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
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with sustained right-upper-quadrant pain, nausea and a neutrophil count above the laboratory reference range. Ultrasound shows gallstones. The gallbladder wall is not thickened, and no pericholecystic fluid is seen.",
    "educationalIntent": "routine_resident_candidate",
    "intendedInference": "Integrate ongoing local symptoms and inflammatory findings with ultrasound components that do not establish or exclude acute gallbladder inflammation.",
    "reviewerNotes": "Confirm a single best additional investigation in this clinically persistent presentation. Normal wall/fluid observations do not exclude acute cholecystitis; WSES diagnostic ranking is not a universal availability-independent algorithm.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r5",
      "conceptId": "concept.cholecystitis.hida-after-equivocal-ultrasound",
      "stem": "Which investigation should be arranged next for {patientName}'s suspected acute cholecystitis?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Hepatobiliary scintigraphy",
          "isCorrect": true,
          "rationale": "Targets the unresolved gallbladder question after inconclusive ultrasound.",
          "distractorRationale": null
        },
        {
          "id": "d2_2",
          "label": "Contrast-enhanced abdominal CT",
          "isCorrect": false,
          "rationale": "Prioritizes a broader abdominal survey when the remaining question concerns gallbladder inflammation.",
          "distractorRationale": "Prioritizes a broader abdominal survey when the remaining question concerns gallbladder inflammation."
        },
        {
          "id": "d3_2",
          "label": "Biliary magnetic resonance imaging",
          "isCorrect": false,
          "rationale": "Prioritizes detailed biliary anatomy over resolving the remaining gallbladder question.",
          "distractorRationale": "Prioritizes detailed biliary anatomy over resolving the remaining gallbladder question."
        }
      ],
      "explanation": "Hepatobiliary scintigraphy can clarify suspected acute calculous cholecystitis after an inconclusive ultrasound. WSES ranks its diagnostic accuracy highly; CT and MRI may serve other clinical questions. The exact next investigation remains subject to the clinical setting and clinician review.",
      "teachingPoint": "Hepatobiliary scintigraphy can clarify suspected acute calculous cholecystitis after an inconclusive ultrasound. WSES ranks its diagnostic accuracy highly; CT and MRI may serve other clinical questions. The exact next investigation remains subject to the clinical setting and clinician review.",
      "supportingEvidenceClaimIds": [
        "claim.gs028c.cholecystitis.hida-after-equivocal-us",
        "claim.qq20261028.cholecystitis.comparative-imaging",
        "claim.qq20261102.ultrasound-component-limits"
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
    ],
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Owner round two: Deleted the entire stability/availability sentence. Retained the symptoms, inflammatory findings and inconclusive ultrasound; no replacement setting sentence points at the key."
    },
    "supersedesQuestionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r4",
    "ownerEditorialReview": {
      "reviewedOn": "2026-10-29",
      "questionVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r3",
      "status": "needs_changes",
      "note": "Remove the unnecessary stability and imaging-availability sentence."
    },
    "ownerRound2Review": {
      "reviewedOn": "2026-10-29",
      "beforeVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r3",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Deleted the entire stability/availability sentence. Retained the symptoms, inflammatory findings and inconclusive ultrasound; no replacement setting sentence points at the key."
    },
    "ownerRound3Review": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.cholecystitis.hida-after-equivocal-ultrasound.v2.r4",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Replace the inconclusive summary with gallstones, a wall that is not thickened and absent surrounding fluid. Name the laboratory finding without inventing a numeric cutoff; retain the neutral task and three imaging options."
    }
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
    ],
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": false,
      "note": "Retained. The task asks for phosphate movement without supplying the direction; all options describe movements. Carbohydrate, insulin and laboratory sequence are observations, not the intracellular-shift conclusion."
    },
    "ownerEditorialReview": {
      "reviewedOn": "2026-10-29",
      "questionVariantId": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2.r2",
      "status": "approved_editorially",
      "note": "Owner approved this exact draft editorially; clinician approval remains pending."
    }
  },
  {
    "id": "revision.question-quality.20261028.A06.owner-round2.owner-round3",
    "auditId": "A06",
    "caseId": "case.gs028b.nipple-discharge.paired-bloody-single-duct",
    "nodeId": "node.gs028b.nipple-discharge.paired-bloody-single-duct.1",
    "previousQuestionVariantId": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1",
    "questionVariantId": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r4",
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
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic after finding rust-coloured spots inside the left side of the bra between examinations. During the visit, compression produces pale fluid from several openings on each nipple; a reddish drop is also seen at one left-sided opening.",
    "educationalIntent": "routine_resident_mixed_pattern_application",
    "intendedInference": "Classify the focal between-visit episodes while distinguishing them from the secretion produced during examination.",
    "reviewerNotes": "Three conventional discharge interpretations replace compound paired statements. Confirm the episode-specific task keeps the categories sufficiently distinct and galactorrhea is a credible distractor; no lesion diagnosis is inferred.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r4",
      "conceptId": "concept.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition",
      "stem": "How should {patientName}'s left-sided staining between visits be interpreted?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Pathologic nipple discharge",
          "isCorrect": true,
          "rationale": "Treats the separate unprovoked unilateral reddish episodes as a pathologic discharge pattern despite the bilateral expressed secretion.",
          "distractorRationale": null
        },
        {
          "id": "d1_1",
          "label": "Physiologic nipple discharge",
          "isCorrect": false,
          "rationale": "Overweights the bilateral expressed fluid and treats the separate left-sided history as reassuring.",
          "distractorRationale": "Overgeneralizes from the bilateral elicited secretion to the separate focal episodes that occur between examinations."
        },
        {
          "id": "d2_1",
          "label": "Galactorrhea",
          "isCorrect": false,
          "rationale": "Attributes the combined history to a systemic endocrine explanation because pale fluid can be expressed from both breasts, underweighting the focal reddish episodes.",
          "distractorRationale": "Confuses milk-like secretion with the separate reddish left-sided episodes; expressed pale fluid from both breasts makes this an understandable competing interpretation."
        }
      ],
      "explanation": "The unprovoked unilateral reddish episodes fit a pathologic discharge pattern. Bilateral secretion elicited by compression does not explain away that history; galactorrhea refers to a milk-like secretory presentation, not the focal reddish episodes.",
      "teachingPoint": "The unprovoked unilateral reddish episodes fit a pathologic discharge pattern. Bilateral secretion elicited by compression does not explain away that history; galactorrhea refers to a milk-like secretory presentation, not the focal reddish episodes.",
      "supportingEvidenceClaimIds": [
        "claim.discharge.pathologic-pattern",
        "claim.qq20261029.discharge.mixed-pattern",
        "claim.qq20261029.discharge.endocrine-alternative",
        "claim.qq20261102.galactorrhea-pattern"
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
    ],
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Owner round two: Replaced a single classic feature list with mixed raw observations. All three choices interpret both the between-examination episodes and the expressed secretion, with parallel grammar and credible overgeneralization errors."
    },
    "ownerEditorialReview": {
      "reviewedOn": "2026-10-29",
      "questionVariantId": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r2",
      "status": "needs_changes",
      "note": "Might be too easy."
    },
    "supersedesQuestionVariantId": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r3",
    "ownerRound2Review": {
      "reviewedOn": "2026-10-29",
      "beforeVariantId": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r2",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Replaced a single classic feature list with mixed raw observations. All three choices interpret both the between-examination episodes and the expressed secretion, with parallel grammar and credible overgeneralization errors."
    },
    "additionalSourceLabels": [
      "source.qq20261029.pitarch-discharge-2025"
    ],
    "ownerRound3Review": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r3",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Replace the awkward paired-pattern answer statements with three short, natural clinical interpretations. Focus the task on the left-sided episodes; the mixed raw observations remain as competing evidence."
    }
  },
  {
    "id": "revision.question-quality.20261028.A06.context.review2.owner-round2.owner-round3",
    "auditId": "A06-context",
    "caseId": "case.gs028b.nipple-discharge.paired-bloody-single-duct",
    "nodeId": "node.gs028b.nipple-discharge.paired-bloody-single-duct.2",
    "previousQuestionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1",
    "questionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r5",
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
    "educationalIntent": "context_companion_revised_task",
    "intendedInference": "Use the reviewed mixed-pattern history to select diagnostic evaluation.",
    "reviewerNotes": "Shared context only changes; same task/options/key/services. Prior classification feedback scaffolds this follow-up.",
    "contextCompanion": true,
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r5",
      "conceptId": "concept.pathologic-nipple-discharge.diagnostic-imaging",
      "stem": "Which evaluation plan is most appropriate for {patientName}'s nipple discharge?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Diagnostic mammography and ultrasound",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Uses the symptomatic presentation and age to select the diagnostic breast-imaging pathway."
        },
        {
          "id": "d1_1",
          "label": "Screening breast mammography",
          "isCorrect": false,
          "distractorRationale": "Applies a screening pathway to an ongoing symptomatic complaint.",
          "rationale": "Applies a screening pathway to an ongoing symptomatic complaint."
        },
        {
          "id": "d2_1",
          "label": "Breast magnetic resonance imaging",
          "isCorrect": false,
          "distractorRationale": "Selects advanced breast imaging before the usual diagnostic mammographic and sonographic evaluation.",
          "rationale": "Selects advanced breast imaging before the usual diagnostic mammographic and sonographic evaluation."
        },
        {
          "id": "d3_1",
          "label": "Interval clinical breast reassessment",
          "isCorrect": false,
          "distractorRationale": "Underweights the observed discharge pattern because the amount and episodes are small and intermittent.",
          "rationale": "Underweights the observed discharge pattern because the amount and episodes are small and intermittent."
        }
      ],
      "explanation": "Diagnostic mammography and ultrasound evaluate this symptomatic discharge pattern in the documented age group. A screening pathway or clinical reassessment alone does not answer the diagnostic question; breast MRI is not the usual initial imaging pathway here.",
      "supportingEvidenceClaimIds": [
        "claim.discharge.imaging"
      ]
    },
    "currentUpdate": "The left-sided staining has continued between visits.",
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Owner round two: Versioned the companion because its shared presentation changed; removed the redundant request-for-evaluation wording."
    },
    "supersedesQuestionVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r4",
    "ownerRound2Review": {
      "reviewedOn": "2026-10-29",
      "beforeVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r3",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Versioned the companion because its shared presentation changed; removed the redundant request-for-evaluation wording."
    },
    "additionalSourceLabels": [
      "source.qq20261029.pitarch-discharge-2025"
    ],
    "ownerRound3Review": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.pathologic-nipple-discharge.diagnostic-imaging.v1.r4",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared case alongside the changed interpretation task; imaging task and operational contract stay unchanged."
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
    ],
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": false,
      "note": "Retained. The task names healing as the comparison category across every option; the wound course still requires interpretation. This remains explicitly foundational."
    },
    "ownerEditorialReview": {
      "reviewedOn": "2026-10-29",
      "questionVariantId": "question.wound.secondary-intention-healing.v1.r2",
      "status": "approved_editorially",
      "note": "Owner approved this exact draft editorially; clinician approval remains pending."
    }
  },
  {
    "id": "revision.question-quality.20261028.A11.review2.owner-round2",
    "auditId": "A11",
    "caseId": "case.gs028b.differentiated-thyroid-cancer.paired-malignant-cytology",
    "nodeId": "node.gs028b.differentiated-thyroid-cancer.paired-malignant-cytology.2",
    "previousQuestionVariantId": "question.differentiated-thyroid-cancer.individualized-surgical-extent.v1",
    "questionVariantId": "question.differentiated-thyroid-cancer.individualized-surgical-extent.v1.r4",
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
    "currentUpdate": "Neck ultrasound shows a 2 cm papillary thyroid carcinoma confined to one lobe, with no gross extension beyond the thyroid, no suspicious cervical nodes and a normal-appearing contralateral lobe. Staging has not identified distant metastases. The patient has chosen surgery.",
    "educationalIntent": "routine_resident_candidate",
    "intendedInference": "Apply the disease-extent recommendation for initial surgery without using an explicit preference to identify the limited operation.",
    "reviewerNotes": "Named clinician must confirm the ATA 2025 recommendation and absence of an alternative supplied indication for total thyroidectomy. The existing 2 cm observation is unchanged. No blanket rule for all thyroid cancers is taught.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-29.v3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.differentiated-thyroid-cancer.individualized-surgical-extent.v1.r4",
      "conceptId": "concept.differentiated-thyroid-cancer.individualized-surgical-extent",
      "stem": "Which initial operation is most appropriate for {patientName}'s papillary thyroid carcinoma?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Lobectomy",
          "isCorrect": true,
          "rationale": "Applies the 2025 ATA initial-surgery recommendation to the stated unilateral 2 cm, intrathyroidal, node-negative and nonmetastatic profile.",
          "distractorRationale": null
        },
        {
          "id": "d1_1",
          "label": "Total thyroidectomy",
          "isCorrect": false,
          "rationale": "Extends treatment beyond the recommended initial extent for this stated profile without another supplied indication for contralateral surgery.",
          "distractorRationale": "Extends treatment beyond the recommended initial extent for this stated profile without another supplied indication for contralateral surgery."
        },
        {
          "id": "d2_1",
          "label": "Subtotal thyroidectomy",
          "isCorrect": false,
          "rationale": "Treats subtotal resection as an intermediate cancer operation; it is not the recommended initial operation for this profile.",
          "distractorRationale": "Treats subtotal resection as an intermediate cancer operation; it is not the recommended initial operation for this profile."
        }
      ],
      "explanation": "For the stated unilateral cancer measuring 2 cm without gross extension or nodal or distant metastases, the 2025 ATA recommendation supports lobectomy as the initial operation when surgery is chosen. Bilateral cancer or other indications can change the operation. This choice follows disease extent rather than an answer-directing tissue-preservation request.",
      "teachingPoint": "For the stated unilateral cancer measuring 2 cm without gross extension or nodal or distant metastases, the 2025 ATA recommendation supports lobectomy as the initial operation when surgery is chosen. Bilateral cancer or other indications can change the operation. This choice follows disease extent rather than an answer-directing tissue-preservation request.",
      "supportingEvidenceClaimIds": [
        "claim.dtc.extent",
        "claim.dtc.lobectomy-boundary",
        "claim.qq20261029.thyroid.initial-lobectomy"
      ]
    },
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Owner round two: Removed the tissue-preservation request entirely. Retained the selected-surgery status and staging facts; mapped the recommendation explicitly to current ATA guidance rather than relying on a preference to break a tie."
    },
    "supersedesQuestionVariantId": "question.differentiated-thyroid-cancer.individualized-surgical-extent.v1.r3",
    "ownerEditorialReview": {
      "reviewedOn": "2026-11-02",
      "questionVariantId": "question.differentiated-thyroid-cancer.individualized-surgical-extent.v1.r4",
      "status": "approved_editorially",
      "note": "Owner approved the exact round-two draft via the manager review page; named clinician approval remains outstanding."
    },
    "ownerRound2Review": {
      "reviewedOn": "2026-10-29",
      "beforeVariantId": "question.differentiated-thyroid-cancer.individualized-surgical-extent.v1.r3",
      "status": "owner_editorially_approved_needs_clinician_review",
      "whatChanged": "Removed the tissue-preservation request entirely. Retained the selected-surgery status and staging facts; mapped the recommendation explicitly to current ATA guidance rather than relying on a preference to break a tie."
    },
    "additionalSourceLabels": [
      "source.qq20261029.ata-extent-summary"
    ]
  },
  {
    "id": "revision.question-quality.20261028.A17.review2",
    "auditId": "A17",
    "caseId": "case.adrenal-incidentaloma.renal-cancer-mass",
    "nodeId": "node.adrenal-incidentaloma.renal-cancer-mass.1",
    "previousQuestionVariantId": "question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v3",
    "questionVariantId": "question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v3.r3",
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
      "contentVersion": "question-authoring.2026-10-28.v2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v3.r3",
      "conceptId": "concept.adrenal-incidentaloma.pheochromocytoma-before-biopsy",
      "stem": "Which test should be completed before {patientName}'s adrenal biopsy?",
      "answerChoices": [
        {
          "id": "metanephrines_3",
          "label": "Plasma free metanephrines",
          "isCorrect": true,
          "rationale": "Evaluates the catecholamine-related hazard before the planned invasive sampling.",
          "distractorRationale": null
        },
        {
          "id": "dst_3",
          "label": "Overnight dexamethasone suppression",
          "isCorrect": false,
          "rationale": "Selects cortisol assessment from the adrenal hormonal workup rather than evaluating catecholamine secretion.",
          "distractorRationale": "Selects cortisol assessment from the adrenal hormonal workup rather than evaluating catecholamine secretion."
        },
        {
          "id": "aldosterone_3",
          "label": "Plasma aldosterone-renin ratio",
          "isCorrect": false,
          "rationale": "Selects a mineralocorticoid workup from a different adrenal decision pathway.",
          "distractorRationale": "Selects a mineralocorticoid workup from a different adrenal decision pathway."
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
    ],
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Removed biochemical/specific-safety-risk wording. Neutral pre-biopsy task; the secretion-related inference belongs in post-answer rationale."
    },
    "supersedesQuestionVariantId": "question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v3.r2",
    "ownerEditorialReview": {
      "reviewedOn": "2026-10-29",
      "questionVariantId": "question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v3.r3",
      "status": "approved_editorially",
      "note": "Owner approved this exact draft editorially; clinician approval remains pending."
    }
  },
  {
    "id": "revision.question-quality.20261028.A22.review2",
    "auditId": "A22",
    "caseId": "case.gs028se.fisher-exact-study-design.a-tiny-pilot",
    "nodeId": "node.gs028se.fisher-exact-study-design.a-tiny-pilot.1",
    "previousQuestionVariantId": "question.statistics-ethics.fisher-exact.v2",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v2.r3",
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
      "contentVersion": "question-authoring.2026-10-28.v2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.fisher-exact.v2.r3",
      "conceptId": "concept.statistics-ethics.fisher-exact",
      "stem": "Which statistical test is most appropriate for comparing recurrence between the study groups?",
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
          "label": "McNemar test",
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
    "previousProfilePresentations": [],
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Removed the repeated independent-group descriptor from the task and the paired-proportions explanation from the McNemar label. Retained raw group design and observed table."
    },
    "supersedesQuestionVariantId": "question.statistics-ethics.fisher-exact.v2.r2",
    "ownerEditorialReview": {
      "reviewedOn": "2026-10-29",
      "questionVariantId": "question.statistics-ethics.fisher-exact.v2.r3",
      "status": "approved_editorially",
      "note": "Owner approved this exact draft editorially; clinician approval remains pending."
    }
  },
  {
    "id": "revision.question-quality.20261028.A23.review2",
    "auditId": "A23",
    "caseId": "case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical",
    "nodeId": "node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical.1",
    "previousQuestionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v4",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v4.r3",
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
    "presentationTemplate": "{patientName}, the bariatric journal-club lead, reviews a fictional study of ulcer recurrence after gastric bypass.",
    "educationalIntent": "foundational_quantitative_application",
    "intendedInference": "Identify the measure from its probability expression without its name appearing in the pre-answer text.",
    "reviewerNotes": "Keeps the naming/interpretation objective; does not introduce adjusted logistic-model interpretation. Removes the unrelated H. pylori treatment mapping from this revision only.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.statistics-ethics.risk-ratio-odds-ratio.v4.r3",
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
        "body": "Let p_E denote recurrence probability in the exposed group and p_C recurrence probability in the comparator group. The reported expression is [p_E / (1 - p_E)] / [p_C / (1 - p_C)]."
      },
      "supportingEvidenceClaimIds": [
        "claim.gs028se.statistics.risk-ratio-odds-ratio",
        "claim.qq20261028.statistics.odds-scale"
      ]
    },
    "previousPresentation": "{patientName}, the bariatric journal-club lead, reviews a new protective agent for marginal ulcer after gastric bypass. The observational report labels its estimate as an exposure odds ratio for rare ulcer recurrence. The editor requests a more exciting conclusion while retaining 'strictly factual.' Underlying group risks are unavailable, and the investigators discuss approximate similarity to a risk ratio.",
    "previousProfilePresentations": [],
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Removed author instructions about identifying the scale and an irrelevant exhibit disclaimer. The expression, definitions and neutral task remain."
    },
    "supersedesQuestionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v4.r2",
    "ownerEditorialReview": {
      "reviewedOn": "2026-10-29",
      "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v4.r3",
      "status": "approved_editorially",
      "note": "Owner approved this exact draft editorially; clinician approval remains pending."
    }
  },
  {
    "id": "revision.question-quality.20261028.A25.review2.owner-round2.owner-round3",
    "auditId": "A25",
    "caseId": "case.gs028g.hiv-perioperative.paired-routine-elective",
    "nodeId": "node.gs028g.hiv-perioperative.paired-routine-elective.1",
    "previousQuestionVariantId": "question.gs028g.hiv-perioperative.art-continuity.v1",
    "questionVariantId": "question.gs028g.hiv-perioperative.art-continuity.v1.r5",
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
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic before elective hernia repair at an outside surgical service. The medication list includes darunavir, ritonavir, tenofovir disoproxil fumarate and emtricitabine.",
    "educationalIntent": "routine_resident_candidate",
    "intendedInference": "Recognize the named prescribed antiretroviral combination and plan continuity rather than a blanket interruption or uncoordinated booster omission.",
    "reviewerNotes": "This is an existing prescribed regimen, not a recommendation to initiate it in everyone. Confirm perioperative coordination, food/administration feasibility and interactions; no fasting interval, dose or medication schedule is invented.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.hiv-perioperative.art-continuity.v1.r5",
      "conceptId": "concept.gs028g.hiv-perioperative.art-continuity",
      "stem": "Which perioperative antiretroviral plan should be sent to {patientName}'s surgical team?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Continue the complete prescribed regimen",
          "isCorrect": true,
          "rationale": "Maintains the prescribed complete regimen while the teams coordinate administration and interactions around surgery.",
          "distractorRationale": null
        },
        {
          "id": "d1_1",
          "label": "Interrupt the complete prescribed regimen",
          "isCorrect": false,
          "rationale": "Applies a generic perioperative withholding instruction to ART without medication-specific review.",
          "distractorRationale": "Interrupts the entire regimen simply for a planned operation without a supplied clinical reason or coordinated alternative."
        },
        {
          "id": "d3_1",
          "label": "Withhold ritonavir and maintain the other agents",
          "isCorrect": false,
          "rationale": "Attempts to reduce interaction concerns by removing ritonavir and continuing an incomplete regimen without coordinated review.",
          "distractorRationale": "Attempts to reduce interaction concerns by removing ritonavir and continuing an incomplete regimen without coordinated review."
        }
      ],
      "explanation": "Continue the prescribed complete ART regimen through the perioperative period when feasible, coordinating administration and interactions with the HIV and surgical teams. A planned operation is not by itself a reason for blanket interruption or uncoordinated removal of ritonavir.",
      "teachingPoint": "Continue the prescribed complete ART regimen through the perioperative period when feasible, coordinating administration and interactions with the HIV and surgical teams. A planned operation is not by itself a reason for blanket interruption or uncoordinated removal of ritonavir.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.hiv-perioperative.art-continuity",
        "claim.gs028g.hiv-perioperative.art-continuity.fact2",
        "claim.gs028g.hiv-perioperative.art-continuity.fact3",
        "claim.gs028g.hiv-perioperative.art-continuity.fact4",
        "claim.qq20261102.named-art-regimen"
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
    ],
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Owner round two: Removed the permission-like swallowing/availability sentence and the generic well-controlled reassurance. Added a concrete conflicting instruction to interpret. Rebuilt three parallel plans around full continuity, blanket interruption and partial-regimen continuation; no filler or exact interruption interval."
    },
    "supersedesQuestionVariantId": "question.gs028g.hiv-perioperative.art-continuity.v1.r4",
    "ownerEditorialReview": {
      "reviewedOn": "2026-10-29",
      "questionVariantId": "question.gs028g.hiv-perioperative.art-continuity.v1.r3",
      "status": "needs_changes",
      "note": "Needs changes; no additional note supplied."
    },
    "ownerRound2Review": {
      "reviewedOn": "2026-10-29",
      "beforeVariantId": "question.gs028g.hiv-perioperative.art-continuity.v1.r3",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Removed the permission-like swallowing/availability sentence and the generic well-controlled reassurance. Added a concrete conflicting instruction to interpret. Rebuilt three parallel plans around full continuity, blanket interruption and partial-regimen continuation; no filler or exact interruption interval."
    },
    "ownerRound3Review": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gs028g.hiv-perioperative.art-continuity.v1.r4",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Name darunavir/ritonavir with tenofovir disoproxil fumarate/emtricitabine using current NIH guidance. Delete the generic-sheet sentence completely and remove the generic adherence label. Retain three parallel regimen-continuity plans."
    }
  },
  {
    "id": "revision.question-quality.20261028.A25.context.review2.owner-round2.owner-round3",
    "auditId": "A25-context",
    "caseId": "case.gs028g.hiv-perioperative.paired-routine-elective",
    "nodeId": "node.gs028g.hiv-perioperative.paired-routine-elective.2",
    "previousQuestionVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1",
    "questionVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r5",
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
    "educationalIntent": "context_companion_revised_task",
    "intendedInference": "Evaluate the proposed oral sedative against the ritonavir-boosted medication history.",
    "reviewerNotes": "Shared presentation revised only; current task/options/key remain. The preceding continuity explanation does not state which sedation plan to select.",
    "contextCompanion": true,
    "question": {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r5",
      "conceptId": "concept.gs028g.hiv-perioperative.booster-midazolam-interaction",
      "stem": "Which plan is most appropriate for {patientName}'s proposed oral midazolam?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Revise the planned sedation",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Accounts for ritonavir-associated increased midazolam exposure when selecting the sedation plan."
        },
        {
          "id": "d1_1",
          "label": "Retain the planned sedation",
          "isCorrect": false,
          "distractorRationale": "Does not address the proposed oral drug combination.",
          "rationale": "Does not address the proposed oral drug combination."
        },
        {
          "id": "d2_1",
          "label": "Increase the midazolam dose",
          "isCorrect": false,
          "distractorRationale": "Responds in the wrong direction to increased drug exposure.",
          "rationale": "Responds in the wrong direction to increased drug exposure."
        },
        {
          "id": "d3_1",
          "label": "Withhold the antiretroviral regimen",
          "isCorrect": false,
          "distractorRationale": "Interrupts feasible effective therapy instead of coordinating an alternative sedation plan.",
          "rationale": "Interrupts feasible effective therapy instead of coordinating an alternative sedation plan."
        }
      ],
      "explanation": "Ritonavir-boosted therapy can increase midazolam exposure; the proposed oral combination requires an alternative sedation plan. Increased exposure does not support a dose increase. Coordinate the sedation plan rather than withholding feasible effective antiretroviral therapy.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.hiv-perioperative.booster-midazolam-interaction",
        "claim.gs028g.hiv-perioperative.booster-midazolam-interaction.fact2",
        "claim.gs028g.hiv-perioperative.booster-midazolam-interaction.fact3",
        "claim.qq20261102.named-art-regimen"
      ]
    },
    "currentUpdate": "The outside surgical service proposes oral midazolam for sedation.",
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Owner round two: Versioned the companion for the shared medication-reconciliation context; its interaction decision is unchanged."
    },
    "supersedesQuestionVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r4",
    "ownerRound2Review": {
      "reviewedOn": "2026-10-29",
      "beforeVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r3",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Versioned the companion for the shared medication-reconciliation context; its interaction decision is unchanged."
    },
    "ownerRound3Review": {
      "reviewedOn": "2026-11-02",
      "beforeVariantId": "question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r4",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Version the shared named-regimen presentation; the oral-midazolam interaction task and operational contract stay unchanged."
    }
  },
  {
    "id": "revision.question-quality.20261028.A27.review2",
    "auditId": "A27",
    "caseId": "case.gs028g.laparoscopy-respiratory.paired-ventilation-load",
    "nodeId": "node.gs028g.laparoscopy-respiratory.paired-ventilation-load.1",
    "previousQuestionVariantId": "question.gs028g.laparoscopy-respiratory.co2-absorption.v2",
    "questionVariantId": "question.gs028g.laparoscopy-respiratory.co2-absorption.v2.r3",
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
      "contentVersion": "question-authoring.2026-10-28.v2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.laparoscopy-respiratory.co2-absorption.v2.r3",
      "conceptId": "concept.gs028g.laparoscopy-respiratory.co2-absorption",
      "stem": "Which mechanism best explains the recorded end-tidal CO2 change?",
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
    ],
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Removed the interpreted additional-load conclusion and the insufflation cue from the lead-in. Raw time sequence, ventilation and tracing remain."
    },
    "supersedesQuestionVariantId": "question.gs028g.laparoscopy-respiratory.co2-absorption.v2.r2",
    "ownerEditorialReview": {
      "reviewedOn": "2026-10-29",
      "questionVariantId": "question.gs028g.laparoscopy-respiratory.co2-absorption.v2.r3",
      "status": "approved_editorially",
      "note": "Owner approved this exact draft editorially; clinician approval remains pending."
    }
  },
  {
    "id": "revision.question-quality.20261028.A27.context.review2",
    "auditId": "A27-context",
    "caseId": "case.gs028g.laparoscopy-respiratory.paired-ventilation-load",
    "nodeId": "node.gs028g.laparoscopy-respiratory.paired-ventilation-load.2",
    "previousQuestionVariantId": "question.gs028g.laparoscopy-respiratory.diaphragm-compliance.v2",
    "questionVariantId": "question.gs028g.laparoscopy-respiratory.diaphragm-compliance.v2.r3",
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
    "educationalIntent": "context_companion_revised_task",
    "intendedInference": "Predict the mechanical effect of the recorded positioning and insufflation instead of repeating an already supplied respiratory-restriction conclusion.",
    "reviewerNotes": "Manager review: task/options now reviewed alongside changed context. Same concept, result gate and evidence mappings; clinician must confirm equivalence. Removed the supplied restriction conclusion and broad acute-airway exclusion. Ask for the expected mechanical effect from the documented exposures; balanced direction/compliance combinations avoid task-word matching.",
    "contextCompanion": true,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.laparoscopy-respiratory.diaphragm-compliance.v2.r3",
      "conceptId": "concept.gs028g.laparoscopy-respiratory.diaphragm-compliance",
      "stem": "Which change in respiratory mechanics is expected with {patientName}'s recorded positioning and abdominal insufflation?",
      "answerChoices": [
        {
          "id": "correct_2",
          "label": "Cephalad diaphragm displacement with reduced compliance",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Connects the recorded positioning and insufflation with cephalad displacement and reduced compliance."
        },
        {
          "id": "d1_2",
          "label": "Caudal diaphragm displacement with increased compliance",
          "isCorrect": false,
          "distractorRationale": "Reverses both the displacement direction and the compliance effect.",
          "rationale": "Reverses both the displacement direction and the compliance effect."
        },
        {
          "id": "d2_2",
          "label": "Caudal diaphragm displacement with reduced compliance",
          "isCorrect": false,
          "distractorRationale": "Recalls reduced compliance but reverses the displacement direction.",
          "rationale": "Recalls reduced compliance but reverses the displacement direction."
        },
        {
          "id": "d3_2",
          "label": "Cephalad diaphragm displacement with increased compliance",
          "isCorrect": false,
          "distractorRationale": "Recalls cephalad displacement but reverses the compliance effect.",
          "rationale": "Recalls cephalad displacement but reverses the compliance effect."
        }
      ],
      "explanation": "Head-down positioning and abdominal insufflation can displace the diaphragm cephalad and reduce respiratory compliance. The offered combinations distinguish the direction of displacement from the effect on compliance.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance",
        "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance.fact2",
        "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance.fact3",
        "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance.fact4"
      ]
    },
    "currentUpdate": "The anesthetic record also documents head-down positioning during the insufflated portion of the procedure.",
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Removed the supplied restriction conclusion and broad acute-airway exclusion. Ask for the expected mechanical effect from the documented exposures; balanced direction/compliance combinations avoid task-word matching."
    },
    "supersedesQuestionVariantId": "question.gs028g.laparoscopy-respiratory.diaphragm-compliance.v2.r2"
  },
  {
    "id": "revision.question-quality.20261028.A28.review2",
    "auditId": "A28",
    "caseId": "case.gs028g.merkel-cell.paired-skin-panel",
    "nodeId": "node.gs028g.merkel-cell.paired-skin-panel.1",
    "previousQuestionVariantId": "question.gs028g.merkel-cell.integrated-diagnosis.v1",
    "questionVariantId": "question.gs028g.merkel-cell.integrated-diagnosis.v1.r3",
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
      "contentVersion": "question-authoring.2026-10-28.v2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.merkel-cell.integrated-diagnosis.v1.r3",
      "conceptId": "concept.gs028g.merkel-cell.integrated-diagnosis",
      "stem": "Which diagnosis is best supported by this skin biopsy?",
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
    ],
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Removed the instruction to integrate a combined pattern from the task. Raw morphology and stains remain the diagnostic evidence."
    },
    "supersedesQuestionVariantId": "question.gs028g.merkel-cell.integrated-diagnosis.v1.r2",
    "ownerEditorialReview": {
      "reviewedOn": "2026-10-29",
      "questionVariantId": "question.gs028g.merkel-cell.integrated-diagnosis.v1.r3",
      "status": "approved_editorially",
      "note": "Owner approved this exact draft editorially; clinician approval remains pending."
    }
  },
  {
    "id": "revision.question-quality.20261028.A28.context.review2",
    "auditId": "A28-context",
    "caseId": "case.gs028g.merkel-cell.paired-skin-panel",
    "nodeId": "node.gs028g.merkel-cell.paired-skin-panel.2",
    "previousQuestionVariantId": "question.gs028g.merkel-cell.clinically-negative-node-staging.v1",
    "questionVariantId": "question.gs028g.merkel-cell.clinically-negative-node-staging.v1.r3",
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
    "educationalIntent": "context_companion_revised_task",
    "intendedInference": "Existing follow-up/task retained; shared presentation revised by A28.",
    "reviewerNotes": "Manager review: task/options now reviewed alongside changed context. Same concept, result gate and evidence mappings; clinician must confirm equivalence. Removed sentinel staging from the pre-answer update and staging instruction from the task. Retained node examination, unexcised primary and procedural feasibility; parallel plans have no unique task-word key. Confirm next-step ranking and procedural sequencing.",
    "contextCompanion": true,
    "question": {
      "contentVersion": "question-authoring.2026-10-28.v2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.merkel-cell.clinically-negative-node-staging.v1.r3",
      "conceptId": "concept.gs028g.merkel-cell.clinically-negative-node-staging",
      "stem": "Which next step is most appropriate for {patientName}'s confirmed Merkel cell carcinoma?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Sentinel lymph node staging",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Assesses occult regional disease in the documented clinically node-negative candidate."
        },
        {
          "id": "d1_1",
          "label": "Serial clinical node examinations",
          "isCorrect": false,
          "distractorRationale": "Treats a normal examination as sufficient regional assessment.",
          "rationale": "Treats a normal examination as sufficient regional assessment."
        },
        {
          "id": "d2_1",
          "label": "Wide local excision alone",
          "isCorrect": false,
          "distractorRationale": "Treats the primary site without addressing regional staging.",
          "rationale": "Treats the primary site without addressing regional staging."
        },
        {
          "id": "d3_1",
          "label": "Complete regional-node dissection",
          "isCorrect": false,
          "distractorRationale": "Commits to full regional dissection before the offered staging assessment.",
          "rationale": "Commits to full regional dissection before the offered staging assessment."
        }
      ],
      "explanation": "Sentinel-node assessment addresses occult regional disease that examination cannot exclude. A normal examination does not establish pathologic node negativity. The clinically node-negative candidate should be considered for sentinel staging rather than proceeding automatically to full regional-node dissection.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.merkel-cell.clinically-negative-node-staging",
        "claim.gs028g.merkel-cell.clinically-negative-node-staging.fact2",
        "claim.gs028g.merkel-cell.clinically-negative-node-staging.fact3"
      ]
    },
    "currentUpdate": "The specialist confirms Merkel cell carcinoma. Regional nodes are not enlarged on examination, the primary site has not been excised, and an additional procedure is feasible.",
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Removed sentinel staging from the pre-answer update and staging instruction from the task. Retained node examination, unexcised primary and procedural feasibility; parallel plans have no unique task-word key."
    },
    "supersedesQuestionVariantId": "question.gs028g.merkel-cell.clinically-negative-node-staging.v1.r2"
  },
  {
    "id": "revision.question-quality.20261028.A30.review2.owner-round2",
    "auditId": "A30",
    "caseId": "case.gs028g.peristomal-skin.paired-wide-opening",
    "nodeId": "node.gs028g.peristomal-skin.paired-wide-opening.2",
    "previousQuestionVariantId": "question.gs028g.peristomal-skin.restore-seal.v1",
    "questionVariantId": "question.gs028g.peristomal-skin.restore-seal.v1.r4",
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
    "presentationTemplate": "{patientName}, a {ageYears}-year-old {sexNoun}, visits the clinic with recurrent burning around an ileostomy. Examination shows a moist red ring immediately beside the stoma, with intact skin farther out under the adhesive. The stoma is viable, and the patient feels well.",
    "currentUpdate": "The removed barrier shows moisture around its inner edge, although the outer adhesive border remains attached.",
    "educationalIntent": "routine_resident_candidate",
    "intendedInference": "Infer a recurrent appliance-contact problem from the skin distribution and removed-barrier observations, then choose fit assessment rather than an empiric product or interval change.",
    "reviewerNotes": "Confirm a single best next step. The observations support assessment/refitting but do not establish an exact cutout defect, product choice or wear interval. Prior diagnosis feedback remains legitimate scaffolding.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-29.v3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.peristomal-skin.restore-seal.v1.r4",
      "conceptId": "concept.gs028g.peristomal-skin.restore-seal",
      "stem": "Which next step is most appropriate for {patientName}'s recurrent peristomal skin injury?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Reassess pouch fit with the ostomy nurse",
          "isCorrect": true,
          "rationale": "Uses the distribution and removed-appliance observations to prioritize assessment of the seal and fit before prescribing a particular product or opening dimension.",
          "distractorRationale": null
        },
        {
          "id": "d1_1",
          "label": "Switch to a different adhesive brand",
          "isCorrect": false,
          "rationale": "Treats the complaint as an adhesive-product problem without first explaining the observed distribution and inner-edge moisture.",
          "distractorRationale": "Treats the complaint as an adhesive-product problem without first explaining the observed distribution and inner-edge moisture."
        },
        {
          "id": "d2_1",
          "label": "Start topical antifungal treatment",
          "isCorrect": false,
          "rationale": "Treats a competing rash mechanism before assessing the appliance and the source of the recurrent contact injury.",
          "distractorRationale": "Treats a competing rash mechanism before assessing the appliance and the source of the recurrent contact injury."
        },
        {
          "id": "d3_1",
          "label": "Schedule more frequent routine pouch changes",
          "isCorrect": false,
          "rationale": "May form part of an individualized plan, but selecting a new routine interval alone does not assess why this appliance repeatedly fails at the affected skin.",
          "distractorRationale": "May form part of an individualized plan, but selecting a new routine interval alone does not assess why this appliance repeatedly fails at the affected skin."
        }
      ],
      "explanation": "The observed skin distribution and moisture on the removed barrier warrant ostomy-nurse assessment of pouch fit and seal. Findings should guide refitting and compatible skin care. Wear time, product intolerance and coexisting infection may also need review; these observations do not prove a particular opening size or exclude every alternative.",
      "teachingPoint": "The observed skin distribution and moisture on the removed barrier warrant ostomy-nurse assessment of pouch fit and seal. Findings should guide refitting and compatible skin care. Wear time, product intolerance and coexisting infection may also need review; these observations do not prove a particular opening size or exclude every alternative.",
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
    ],
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Owner round two: Removed the explicit oversized-cutout mechanism and the presentation clause interpreting effluent contact. Used observable skin and barrier findings; the key now calls for assessment of fit, without assuming a demonstrated dimension that the vignette no longer supplies."
    },
    "supersedesQuestionVariantId": "question.gs028g.peristomal-skin.restore-seal.v1.r3",
    "ownerEditorialReview": {
      "reviewedOn": "2026-11-02",
      "questionVariantId": "question.gs028g.peristomal-skin.restore-seal.v1.r4",
      "status": "approved_editorially",
      "note": "Owner approved the exact round-two draft via the manager review page; named clinician approval remains outstanding."
    },
    "ownerRound2Review": {
      "reviewedOn": "2026-10-29",
      "beforeVariantId": "question.gs028g.peristomal-skin.restore-seal.v1.r3",
      "status": "owner_editorially_approved_needs_clinician_review",
      "whatChanged": "Removed the explicit oversized-cutout mechanism and the presentation clause interpreting effluent contact. Used observable skin and barrier findings; the key now calls for assessment of fit, without assuming a demonstrated dimension that the vignette no longer supplies."
    }
  },
  {
    "id": "revision.question-quality.20261028.A30.context.review2.owner-round2",
    "auditId": "A30-context",
    "caseId": "case.gs028g.peristomal-skin.paired-wide-opening",
    "nodeId": "node.gs028g.peristomal-skin.paired-wide-opening.1",
    "previousQuestionVariantId": "question.gs028g.peristomal-skin.effluent-irritation.v1",
    "questionVariantId": "question.gs028g.peristomal-skin.effluent-irritation.v1.r4",
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
    "educationalIntent": "context_companion_revised_task",
    "intendedInference": "Classify the observed peristomal distribution without an authored contact-mechanism conclusion.",
    "reviewerNotes": "Shared presentation changed only; same diagnosis task/options/key and evidence mappings. Confirm competing skin diagnoses remain clinically plausible.",
    "contextCompanion": true,
    "question": {
      "contentVersion": "question-authoring.2026-10-29.v3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.gs028g.peristomal-skin.effluent-irritation.v1.r4",
      "conceptId": "concept.gs028g.peristomal-skin.effluent-irritation",
      "stem": "Which diagnosis best explains {patientName}'s peristomal skin findings?",
      "answerChoices": [
        {
          "id": "correct_1",
          "label": "Peristomal irritant dermatitis",
          "isCorrect": true,
          "distractorRationale": null,
          "rationale": "Uses the observed contact distribution and wet erosions to identify the irritant process."
        },
        {
          "id": "d1_1",
          "label": "Peristomal bacterial cellulitis",
          "isCorrect": false,
          "distractorRationale": "Overweights the possibility of infection without explaining the contact distribution.",
          "rationale": "Overweights the possibility of infection without explaining the contact distribution."
        },
        {
          "id": "d2_1",
          "label": "Peristomal candidal dermatitis",
          "isCorrect": false,
          "distractorRationale": "Overweights moisture around an ostomy without explaining the distribution of injury.",
          "rationale": "Overweights moisture around an ostomy without explaining the distribution of injury."
        },
        {
          "id": "d3_1",
          "label": "Peristomal pyoderma gangrenosum",
          "isCorrect": false,
          "distractorRationale": "Does not fit the described shallow wet erosions and contact distribution.",
          "rationale": "Does not fit the described shallow wet erosions and contact distribution."
        }
      ],
      "explanation": "The contact distribution and wet erosions support peristomal irritant contact dermatitis. Compare competing causes with the observed morphology and distribution; the vignette does not establish that every coexisting condition has been excluded.",
      "supportingEvidenceClaimIds": [
        "claim.gs028g.peristomal-skin.effluent-irritation",
        "claim.gs028g.peristomal-skin.effluent-irritation.fact2",
        "claim.gs028g.peristomal-skin.effluent-irritation.fact3"
      ]
    },
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Owner round two: Versioned the companion because the shared presentation now contains raw morphology rather than a supplied effluent-contact explanation."
    },
    "supersedesQuestionVariantId": "question.gs028g.peristomal-skin.effluent-irritation.v1.r3",
    "ownerRound2Review": {
      "reviewedOn": "2026-10-29",
      "beforeVariantId": "question.gs028g.peristomal-skin.effluent-irritation.v1.r3",
      "status": "awaiting_owner_and_clinician_review",
      "whatChanged": "Versioned the companion because the shared presentation now contains raw morphology rather than a supplied effluent-contact explanation."
    }
  },
  {
    "id": "revision.question-quality.20261028.A38.review2",
    "auditId": "A38",
    "caseId": "case.pediatric-clinic.shrinking-mobile-neck-nodes",
    "nodeId": "node.pediatric-clinic.shrinking-mobile-neck-nodes.1",
    "previousQuestionVariantId": "question.pediatric-clinic.shrinking-mobile-neck-nodes.v2",
    "questionVariantId": "question.pediatric-clinic.shrinking-mobile-neck-nodes.v2.r3",
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
      "contentVersion": "question-authoring.2026-10-28.v2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pediatric-clinic.shrinking-mobile-neck-nodes.v2.r3",
      "conceptId": "concept.pediatric-clinic.reactive-neck-node-observation",
      "stem": "What is the most appropriate clinic plan for Ethan Brooks's cervical nodes?",
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
    ],
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Removed course/condition emphasis from the task. Improving trajectory and necessary safety findings stay in the presentation, with no observation or safety-net rule announced before answering."
    },
    "supersedesQuestionVariantId": "question.pediatric-clinic.shrinking-mobile-neck-nodes.v2.r2",
    "ownerEditorialReview": {
      "reviewedOn": "2026-10-29",
      "questionVariantId": "question.pediatric-clinic.shrinking-mobile-neck-nodes.v2.r3",
      "status": "approved_editorially",
      "note": "Owner approved this exact draft editorially; clinician approval remains pending."
    }
  },
  {
    "id": "revision.question-quality.20261028.A40.review2.owner-round2",
    "auditId": "A40",
    "caseId": "case.pediatric-clinic.upper-midline-lump",
    "nodeId": "node.pediatric-clinic.upper-midline-lump.1",
    "previousQuestionVariantId": "question.pediatric-clinic.upper-midline-lump.v1",
    "questionVariantId": "question.pediatric-clinic.upper-midline-lump.v1.r4",
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
    "presentationTemplate": "Ella Morgan, a {ageYears}-year-old girl, visits the clinic with her mother, Rachel Morgan, who remains in the same room throughout the visit. Her mother points out a small focal lump in Ella's upper abdominal midline. Examination identifies a small abdominal-wall gap with protruding fat at that site, above the navel. Her previous abdominal operation used a right-lower-quadrant incision. Ella is comfortable.",
    "educationalIntent": "foundational_anatomical_recognition",
    "intendedInference": "Localize the defect and relate it to the operative history among competing abdominal-wall hernias.",
    "reviewerNotes": "Still an anatomical-recognition task, with stronger same-category competitors. Confirm pediatric plausibility. Morgagni is diaphragmatic and is excluded from this abdominal-wall option set; no new diagnosis or concept meaning is intended.",
    "contextCompanion": false,
    "question": {
      "contentVersion": "question-authoring.2026-10-29.v3",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "question.pediatric-clinic.upper-midline-lump.v1.r4",
      "conceptId": "concept.umbilical-epigastric-hernia.clinical-recognition",
      "stem": "Which diagnosis best explains Ella Morgan's abdominal-wall lump?",
      "answerChoices": [
        {
          "id": "choice.upper-midline-lump.epigastric",
          "label": "Epigastric hernia",
          "isCorrect": true,
          "rationale": "Uses the focal upper-midline fat-containing wall defect; the previous incision is at a different site.",
          "distractorRationale": null
        },
        {
          "id": "choice.upper-midline-lump.spigelian",
          "label": "Spigelian hernia",
          "isCorrect": false,
          "rationale": "Confuses a lateral abdominal-wall defect near the semilunar line with the observed midline defect.",
          "distractorRationale": "Confuses a lateral abdominal-wall defect near the semilunar line with the observed midline defect."
        },
        {
          "id": "choice.upper-midline-lump.incisional",
          "label": "Incisional hernia",
          "isCorrect": false,
          "rationale": "Overweights the operative history without matching the current defect to the prior incision.",
          "distractorRationale": "Overweights the operative history without matching the current defect to the prior incision."
        },
        {
          "id": "choice.upper-midline-lump.lumbar",
          "label": "Lumbar hernia",
          "isCorrect": false,
          "rationale": "Confuses a posterior or flank wall defect with the anterior upper-midline finding.",
          "distractorRationale": "Confuses a posterior or flank wall defect with the anterior upper-midline finding."
        }
      ],
      "explanation": "The focal upper-midline fat-containing defect supports epigastric hernia. Spigelian and lumbar defects occupy different abdominal-wall regions; an incisional hernia is related to an operative incision, which is elsewhere in this record. All offered diagnoses are abdominal-wall hernias.",
      "teachingPoint": "The focal upper-midline fat-containing defect supports epigastric hernia. Spigelian and lumbar defects occupy different abdominal-wall regions; an incisional hernia is related to an operative incision, which is elsewhere in this record. All offered diagnoses are abdominal-wall hernias.",
      "supportingEvidenceClaimIds": [
        "claim.pediatric-clinic.epigastric-fat-defect",
        "claim.qq20261029.hernia.spigelian",
        "claim.qq20261029.hernia.incisional",
        "claim.qq20261029.hernia.lumbar"
      ]
    },
    "previousPresentation": "Ella Morgan, a 6-year-old girl, visits the clinic with her mother, Rachel Morgan, who remains in the same room throughout the visit. Her mother points out a small focal lump in Ella's upper abdominal midline, above the navel. Examination identifies a small abdominal-wall gap with protruding fat at that site. The navel and groins have no bulge. Ella is comfortable and has no vomiting.",
    "previousProfilePresentations": [
      {
        "id": "profile.pediatric-clinic.upper-midline-lump.girl6",
        "presentation": "Ella Morgan, a 6-year-old girl, visits the clinic with her mother, Rachel Morgan, who remains in the same room throughout the visit. Her mother points out a small focal lump in Ella's upper abdominal midline, above the navel. Examination identifies a small abdominal-wall gap with protruding fat at that site. The navel and groins have no bulge. Ella is comfortable and has no vomiting."
      }
    ],
    "leadInReview": {
      "reviewedOn": "2026-10-29",
      "changed": true,
      "note": "Owner round two: Replaced umbilical/inguinal competitors with Spigelian, incisional and lumbar hernias. Added the location of the prior incision as decision-critical raw history, without an option-by-option negative list. Morgagni is not used because its compartment differs."
    },
    "supersedesQuestionVariantId": "question.pediatric-clinic.upper-midline-lump.v1.r3",
    "ownerEditorialReview": {
      "reviewedOn": "2026-11-02",
      "questionVariantId": "question.pediatric-clinic.upper-midline-lump.v1.r4",
      "status": "approved_editorially",
      "note": "Owner approved the exact round-two draft via the manager review page; named clinician approval remains outstanding."
    },
    "ownerRound2Review": {
      "reviewedOn": "2026-10-29",
      "beforeVariantId": "question.pediatric-clinic.upper-midline-lump.v1.r3",
      "status": "owner_editorially_approved_needs_clinician_review",
      "whatChanged": "Replaced umbilical/inguinal competitors with Spigelian, incisional and lumbar hernias. Added the location of the prior incision as decision-critical raw history, without an option-by-option negative list. Morgagni is not used because its compartment differs."
    },
    "choiceSourceIds": {
      "choice.upper-midline-lump.spigelian": "choice.upper-midline-lump.umbilical",
      "choice.upper-midline-lump.incisional": "choice.upper-midline-lump.inguinal",
      "choice.upper-midline-lump.lumbar": "choice.upper-midline-lump.femoral"
    },
    "additionalSourceLabels": [
      "source.qq20261029.henriksen-ventral-review"
    ]
  }
];
